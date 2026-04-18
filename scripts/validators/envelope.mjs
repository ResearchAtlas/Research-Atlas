#!/usr/bin/env node
// Shared envelope validator for Research Atlas skills.
//
// Validates a single output envelope against the schema_version 2 shape
// that every Atlas skill (flagship + future runtime consumers) agrees on:
//
//   { meta, status, data, errors?, self_check? }
//
// This validator is INTENTIONALLY SKILL-AGNOSTIC. It enforces:
//   - envelope shape + required fields
//   - types on well-known fields (status, verdict confidence, etc.)
//   - the `verdicts_complete` invariant whenever `data.verdicts` is present:
//       data.verdicts.length === meta.input_count      (preferred signal)
//       data.verdicts.length === data.citations_checked (fallback)
//       (skipped only when neither signal is set)
//
// It does NOT enforce the verdict enum, task whitelist, or evidence shape
// beyond "must be an object with a `parsed` block" — those contracts belong
// in per-skill validators layered on top of this one (Phase 3 runtime).
//
// The envelope is JSON. Human-readable transcripts often embed abbreviated
// YAML summaries with `...` elisions — those are NOT directly validatable.
// Operators save the raw envelope from a run as .json and validate that.
//
// Usage:
//   node scripts/validators/envelope.mjs <path-to-envelope.json>
//   node scripts/validators/envelope.mjs --glob "docs/references/**/*.envelope.json"
//   node scripts/validators/envelope.mjs --glob "..." --allow-empty   # exit 0 when zero files match
//
// Exit codes: 0 all valid, 1 any invalid, 2 usage error.
//
// Also exports `validateEnvelope(obj)` for programmatic use.

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SUPPORTED_SCHEMA_VERSION = 2;
const VALID_STATUSES = new Set(['success', 'partial', 'error']);
const VALID_STAGES = new Set(['parse', 'resolve', 'cross_check']);

const SKILL_SLUG = /^[a-z][a-z0-9-]*[a-z0-9]$/;
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateEnvelope(obj) {
  const errors = [];
  const push = (path, msg) => errors.push({ path, msg });

  if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) {
    return { ok: false, errors: [{ path: '', msg: 'envelope must be an object' }] };
  }

  validateMeta(obj.meta, push);

  if (!VALID_STATUSES.has(obj.status)) {
    push('status', `must be one of ${[...VALID_STATUSES].join(', ')}`);
  }

  if (!obj.data || typeof obj.data !== 'object' || Array.isArray(obj.data)) {
    push('data', 'missing or not an object');
    return { ok: errors.length === 0, errors };
  }

  validateData(obj, push);
  validateErrors(obj.errors, push);
  validateSelfCheck(obj.self_check, push);

  return { ok: errors.length === 0, errors };
}

function validateMeta(meta, push) {
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
    push('meta', 'missing or not an object');
    return;
  }
  if (typeof meta.skill !== 'string' || !SKILL_SLUG.test(meta.skill)) {
    push('meta.skill', 'must be a lowercase slug (e.g. "research-verification", "literature-review")');
  }
  if (typeof meta.version !== 'string' || !SEMVER.test(meta.version)) {
    push('meta.version', 'must be a SemVer string (e.g. "2.1.0")');
  }
  if (meta.schema_version !== SUPPORTED_SCHEMA_VERSION) {
    push(
      'meta.schema_version',
      `expected ${SUPPORTED_SCHEMA_VERSION}, got ${JSON.stringify(meta.schema_version)}`,
    );
  }
  if (typeof meta.run_id !== 'string' || !UUID.test(meta.run_id)) {
    push('meta.run_id', 'must be a UUID string');
  }
  if (typeof meta.timestamp !== 'string' || !ISO_8601.test(meta.timestamp)) {
    push('meta.timestamp', 'must be ISO-8601 timestamp');
  }
  if (meta.input_count !== undefined && (!Number.isInteger(meta.input_count) || meta.input_count < 0)) {
    push('meta.input_count', 'must be a non-negative integer when present');
  }
}

function validateData(obj, push) {
  const { meta, data } = obj;

  if (typeof data.task !== 'string' || data.task.length === 0) {
    push('data.task', 'must be a non-empty string');
  }

  if (data.citations_checked !== undefined) {
    if (!Number.isInteger(data.citations_checked) || data.citations_checked < 0) {
      push('data.citations_checked', 'must be a non-negative integer when present');
    }
  }
  if (data.claims_evaluated !== undefined) {
    if (!Number.isInteger(data.claims_evaluated) || data.claims_evaluated < 0) {
      push('data.claims_evaluated', 'must be a non-negative integer when present');
    }
  }

  if (data.verdicts === undefined) return;

  if (!Array.isArray(data.verdicts)) {
    push('data.verdicts', 'must be an array when present');
    return;
  }

  const expectedFromInputCount = Number.isInteger(meta?.input_count) ? meta.input_count : null;
  const expectedFromCitationsChecked = Number.isInteger(data.citations_checked)
    ? data.citations_checked
    : null;
  const expected = expectedFromInputCount ?? expectedFromCitationsChecked;
  const source = expectedFromInputCount != null ? 'meta.input_count' : 'data.citations_checked';

  if (expected != null && data.verdicts.length !== expected) {
    push(
      'data.verdicts',
      `verdicts_complete violated: length ${data.verdicts.length} !== expected ${expected} (from ${source})`,
    );
  }

  data.verdicts.forEach((v, i) => validateVerdict(v, i, push));
}

function validateVerdict(v, i, push) {
  const at = (field) => `data.verdicts[${i}].${field}`;
  if (!v || typeof v !== 'object' || Array.isArray(v)) {
    push(`data.verdicts[${i}]`, 'must be an object');
    return;
  }
  if (typeof v.reference_id !== 'string' || v.reference_id.length === 0) {
    push(at('reference_id'), 'must be a non-empty string');
  }
  if (typeof v.verdict !== 'string' || v.verdict.length === 0) {
    push(at('verdict'), 'must be a non-empty string (skill-specific enum enforced elsewhere)');
  }
  if (typeof v.confidence !== 'number' || v.confidence < 0 || v.confidence > 1) {
    push(at('confidence'), 'must be a number in [0, 1]');
  }
  if (!v.evidence || typeof v.evidence !== 'object' || Array.isArray(v.evidence)) {
    push(at('evidence'), 'missing or not an object');
    return;
  }
  if (!v.evidence.parsed || typeof v.evidence.parsed !== 'object' || Array.isArray(v.evidence.parsed)) {
    push(at('evidence.parsed'), 'required; must be an object');
  }
}

function validateErrors(errs, push) {
  if (errs === undefined) return;
  if (!Array.isArray(errs)) {
    push('errors', 'must be an array when present');
    return;
  }
  errs.forEach((e, i) => {
    if (!e || typeof e !== 'object' || Array.isArray(e)) {
      push(`errors[${i}]`, 'must be an object');
      return;
    }
    if (e.stage !== undefined && !VALID_STAGES.has(e.stage)) {
      push(`errors[${i}].stage`, `must be one of ${[...VALID_STAGES].join(', ')} when present`);
    }
    if (typeof e.reason !== 'string') {
      push(`errors[${i}].reason`, 'must be a string');
    }
  });
}

function validateSelfCheck(sc, push) {
  if (sc === undefined) return;
  if (!sc || typeof sc !== 'object' || Array.isArray(sc)) {
    push('self_check', 'must be an object when present');
    return;
  }
  for (const [key, value] of Object.entries(sc)) {
    if (value !== 'pass' && value !== 'fail') {
      push(`self_check.${key}`, `must be "pass" or "fail", got ${JSON.stringify(value)}`);
    }
  }
}

async function expandPaths(args) {
  const out = [];
  let allowEmpty = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--glob') {
      const pattern = args[++i];
      if (!pattern) throw new Error('--glob requires a pattern argument');
      out.push(...(await globWalk(pattern)));
    } else if (a === '--allow-empty') {
      allowEmpty = true;
    } else if (a.startsWith('--')) {
      throw new Error(`unknown flag: ${a}`);
    } else {
      out.push(resolve(a));
    }
  }
  return { files: out, allowEmpty };
}

// Minimal glob: supports a literal root plus one `**/*.ext` or `*.ext` tail.
async function globWalk(pattern) {
  const normalized = pattern.replace(/\\/g, '/');
  const starIdx = normalized.indexOf('*');
  const root = starIdx === -1 ? normalized : normalized.slice(0, normalized.lastIndexOf('/', starIdx));
  const tail = starIdx === -1 ? '' : normalized.slice(root.length + 1);
  const matcher = compileGlob(tail);
  const hits = [];
  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (matcher(full)) {
        hits.push(full);
      }
    }
  }
  const rootPath = resolve(root || '.');
  const s = await stat(rootPath).catch(() => null);
  if (!s) return hits;
  if (s.isFile()) return matcher(rootPath) ? [rootPath] : [];
  await walk(rootPath);
  return hits;
}

function compileGlob(tail) {
  if (!tail) return () => true;
  const re = new RegExp(
    '(?:^|/)' +
      tail
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*\*\//g, '(?:.*/)?')
        .replace(/\*/g, '[^/]*') +
      '$',
  );
  return (p) => re.test(p.replace(/\\/g, '/'));
}

async function runCli() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    console.error('usage: envelope.mjs <file.json> [more.json ...] | --glob <pattern>');
    process.exit(2);
  }
  let files, allowEmpty;
  try {
    ({ files, allowEmpty } = await expandPaths(argv));
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
  if (files.length === 0) {
    if (allowEmpty) {
      console.log('no files matched (--allow-empty)');
      process.exit(0);
    }
    console.error('no files matched');
    process.exit(2);
  }

  let failures = 0;
  for (const f of files) {
    try {
      const raw = await readFile(f, 'utf8');
      const obj = JSON.parse(raw);
      const { ok, errors } = validateEnvelope(obj);
      if (ok) {
        console.log(`PASS  ${f}`);
      } else {
        failures++;
        console.log(`FAIL  ${f}`);
        for (const err of errors) {
          console.log(`        ${err.path || '<root>'}: ${err.msg}`);
        }
      }
    } catch (e) {
      failures++;
      console.log(`ERROR ${f}`);
      console.log(`        ${e.message}`);
    }
  }
  process.exit(failures === 0 ? 0 : 1);
}

const thisFile = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === thisFile) {
  runCli();
}
