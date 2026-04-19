#!/usr/bin/env node
// Shared envelope validator for Research Atlas skills.
//
// Validates a single output envelope against the schema_version 2 shape
// that every Atlas skill (flagship + future runtime consumers) agrees on:
//
//   { meta, status, data, errors? }
//   data: { task, content?, verdicts?, verdict_summary?, self_check?, ... }
//
// This validator is SKILL-AGNOSTIC by default with a small dispatch table
// for skills whose contract is tight enough to assert structurally here
// (currently: research-verification). It enforces:
//   - envelope shape + required fields (meta, status, data, errors array)
//   - types + format on well-known fields (UUID v4 run_id, ISO-8601
//     timestamp, SemVer version, status enum)
//   - errors: always required at the envelope root (use [] when none)
//   - data.content: required when status is success|partial AND
//     data.verdicts is present (prevents "I emitted JSON but no report")
//   - the `verdicts_complete` invariant whenever `data.verdicts` is present:
//       data.verdicts.length === meta.input_count      (preferred signal)
//       data.verdicts.length === data.citations_checked (fallback)
//       (skipped only when neither signal is set)
//   - self_check: when data.verdicts is present, self_check is required
//     and must contain `verdicts_complete` as one of its keys; all values
//     must be "pass" or "fail"
//   - evidence structural presence: each verdict's evidence block must
//     contain `parsed` (required, object). Skills in SKILL_RULES additionally
//     require every listed evidence key to be structurally present with a
//     matching shape (nullable object, array, or nullable string).
//   - verdict_summary: when present, must be a flat object of
//     { string -> non-negative integer }. When meta.skill is in the
//     SKILL_RULES table, keys must be from that skill's closed set AND
//     counts must match a rollup of data.verdicts under the skill's
//     verdict_rollup map (catches drift between summary totals and the
//     actual verdict list; also flags unknown verdict classes).
//
// It does NOT enforce the verdict enum, task whitelist, or evidence
// contents beyond structural presence — deeper semantic contracts belong
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
const SUMMARY_KEY = /^[a-z][a-z0-9_]*$/;

// Per-skill structural assertions that are tight enough to bake into the
// shared validator. Keep this small — one entry per Tier 1 skill. Deeper
// skill-specific logic (verdict enum, evidence semantics) belongs in a
// dedicated per-skill validator loaded in Phase 3 runtime.
const SKILL_RULES = {
  'research-verification': {
    // Closed set of verdict_summary keys. Fine-grained verdict classes
    // (fabricated_doi, metadata_mismatch_*) live in data.verdicts[*].verdict;
    // they roll up into the `fabricated` bucket here.
    verdict_summary_keys: new Set([
      'verified',
      'partially_supported',
      'unsupported',
      'contradicted',
      'fabricated',
      'unverifiable',
    ]),
    // Closed set of allowed verdict classes. Anything outside this set is
    // a typo or a hallucinated category — flag it.
    verdict_enum: new Set([
      'verified',
      'partially_supported',
      'unsupported',
      'contradicted',
      'fabricated',
      'fabricated_doi',
      'metadata_mismatch_title',
      'metadata_mismatch_author',
      'metadata_mismatch_year',
      'unverifiable',
    ]),
    // Rollup from fine-grained verdicts to verdict_summary buckets. The
    // validator recomputes expected bucket totals from data.verdicts and
    // asserts they equal data.verdict_summary[bucket].
    verdict_rollup: {
      verified: new Set(['verified']),
      partially_supported: new Set(['partially_supported']),
      unsupported: new Set(['unsupported']),
      contradicted: new Set(['contradicted']),
      fabricated: new Set([
        'fabricated',
        'fabricated_doi',
        'metadata_mismatch_title',
        'metadata_mismatch_author',
        'metadata_mismatch_year',
      ]),
      unverifiable: new Set(['unverifiable']),
    },
    // Keys that must be structurally present on every verdict's evidence
    // block. Scalar/object entries may be null; array entries must be an
    // array (possibly empty); string entries may be null. Shapes (when
    // non-null) are checked below.
    evidence_required_keys: {
      resolved: { shape: 'object-or-null' },
      cross_check: { shape: 'object-or-null' },
      candidates: { shape: 'array' },
      abstract_snippet: { shape: 'string-or-null' },
      notes: { shape: 'string-or-null' },
    },
  },
};

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
  validateSelfCheck(obj, push);

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
  const { meta, data, status } = obj;

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

  validateVerdictSummary(meta, data.verdict_summary, push);

  if (data.verdicts === undefined) return;

  if (!Array.isArray(data.verdicts)) {
    push('data.verdicts', 'must be an array when present');
    return;
  }

  // When we're producing verdicts and the run is not an outright error,
  // consumers rely on `content` as the human-readable twin of the
  // machine output. Missing content means the agent synthesized JSON
  // without the prose report the task advertised.
  if (status === 'success' || status === 'partial') {
    if (typeof data.content !== 'string') {
      push(
        'data.content',
        `required when status is "${status}" and data.verdicts is present (may be empty string only for output_format=json)`,
      );
    }
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

  const skillRules = SKILL_RULES[meta?.skill];
  data.verdicts.forEach((v, i) => validateVerdict(v, i, skillRules, push));
  validateVerdictSummaryCounts(meta, data, push);
}

function validateVerdictSummaryCounts(meta, data, push) {
  const rules = SKILL_RULES[meta?.skill];
  if (!rules?.verdict_rollup) return;
  const summary = data.verdict_summary;
  if (!summary || typeof summary !== 'object' || Array.isArray(summary)) return;
  if (!Array.isArray(data.verdicts)) return;

  // Start all canonical buckets at zero so the comparison loop below sees
  // the full key set, even if summary omits some keys (already flagged by
  // validateVerdictSummary, but we still want matching-count diagnostics).
  const expected = {};
  for (const key of rules.verdict_summary_keys) expected[key] = 0;

  data.verdicts.forEach((v) => {
    if (typeof v?.verdict !== 'string') return;
    for (const [bucket, members] of Object.entries(rules.verdict_rollup)) {
      if (members.has(v.verdict)) {
        expected[bucket] += 1;
        return;
      }
    }
    // Unknown verdict — flagged separately by validateVerdict's enum check.
  });

  for (const key of rules.verdict_summary_keys) {
    const actual = summary[key];
    if (!Number.isInteger(actual)) continue; // already flagged upstream
    if (actual !== expected[key]) {
      push(
        `data.verdict_summary.${key}`,
        `count ${actual} does not match rollup from data.verdicts (expected ${expected[key]})`,
      );
    }
  }
}

function validateVerdictSummary(meta, summary, push) {
  if (summary === undefined) return;
  if (!summary || typeof summary !== 'object' || Array.isArray(summary)) {
    push('data.verdict_summary', 'must be an object when present');
    return;
  }
  const rules = SKILL_RULES[meta?.skill];
  for (const [key, value] of Object.entries(summary)) {
    if (!SUMMARY_KEY.test(key)) {
      push(`data.verdict_summary.${key}`, 'key must match /^[a-z][a-z0-9_]*$/');
    } else if (rules && !rules.verdict_summary_keys.has(key)) {
      push(
        `data.verdict_summary.${key}`,
        `key not allowed for skill "${meta.skill}"; allowed: ${[...rules.verdict_summary_keys].join(', ')}`,
      );
    }
    if (!Number.isInteger(value) || value < 0) {
      push(`data.verdict_summary.${key}`, `must be a non-negative integer, got ${JSON.stringify(value)}`);
    }
  }
  // When a closed-key skill is identified, require ALL canonical keys to
  // be present. A skill that lists only the keys it happens to have
  // non-zero counts for makes downstream rollup code branch on presence
  // vs. absence — structural presence is easier to reason about.
  if (rules) {
    for (const key of rules.verdict_summary_keys) {
      if (!(key in summary)) {
        push(
          `data.verdict_summary.${key}`,
          `required key for skill "${meta.skill}" (may be 0, but must be structurally present)`,
        );
      }
    }
  }
}

function validateVerdict(v, i, skillRules, push) {
  const at = (field) => `data.verdicts[${i}].${field}`;
  if (!v || typeof v !== 'object' || Array.isArray(v)) {
    push(`data.verdicts[${i}]`, 'must be an object');
    return;
  }
  if (typeof v.reference_id !== 'string' || v.reference_id.length === 0) {
    push(at('reference_id'), 'must be a non-empty string');
  }
  if (typeof v.verdict !== 'string' || v.verdict.length === 0) {
    push(at('verdict'), 'must be a non-empty string');
  } else if (skillRules?.verdict_enum && !skillRules.verdict_enum.has(v.verdict)) {
    push(
      at('verdict'),
      `unknown verdict class "${v.verdict}"; allowed: ${[...skillRules.verdict_enum].join(', ')}`,
    );
  }
  if (typeof v.confidence !== 'number' || v.confidence < 0 || v.confidence > 1) {
    push(at('confidence'), 'must be a number in [0, 1]');
  }
  if (!v.evidence || typeof v.evidence !== 'object' || Array.isArray(v.evidence)) {
    push(at('evidence'), 'missing or not an object');
    return;
  }
  // `evidence.parsed` is the one key all Atlas skills agree on — Step 0.5
  // (or its equivalent) always populates it before dispatch. Beyond that,
  // evidence shape is skill-specific and checked from the SKILL_RULES
  // table. Skills without a rules entry get only the parsed check.
  if (!v.evidence.parsed || typeof v.evidence.parsed !== 'object' || Array.isArray(v.evidence.parsed)) {
    push(at('evidence.parsed'), 'required; must be an object');
  }
  if (!skillRules?.evidence_required_keys) return;
  for (const [key, spec] of Object.entries(skillRules.evidence_required_keys)) {
    if (!(key in v.evidence)) {
      const hint = spec.shape === 'array' ? 'use [] when not populated' : 'use null when not populated';
      push(at(`evidence.${key}`), `key is structurally required (${hint})`);
      continue;
    }
    const value = v.evidence[key];
    if (spec.shape === 'array') {
      if (!Array.isArray(value)) push(at(`evidence.${key}`), 'must be an array (possibly empty)');
    } else if (spec.shape === 'object-or-null') {
      if (value !== null && (typeof value !== 'object' || Array.isArray(value))) {
        push(at(`evidence.${key}`), 'must be an object or null');
      }
    } else if (spec.shape === 'string-or-null') {
      if (value !== null && typeof value !== 'string') {
        push(at(`evidence.${key}`), 'must be a string or null');
      }
    }
  }
}

function validateErrors(errs, push) {
  if (errs === undefined) {
    push('errors', 'required at envelope root (use [] when there are no errors)');
    return;
  }
  if (!Array.isArray(errs)) {
    push('errors', 'must be an array');
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

function validateSelfCheck(obj, push) {
  // self_check lives under data (see SKILL.md output envelope). Older
  // examples put it at the envelope root; tolerate that for read but
  // assert the canonical location for write.
  const hasVerdicts = Array.isArray(obj?.data?.verdicts);
  const sc = obj?.data?.self_check ?? obj?.self_check;
  const scPath = obj?.data?.self_check !== undefined ? 'data.self_check' : 'self_check';

  if (sc === undefined) {
    if (hasVerdicts) {
      push('data.self_check', 'required when data.verdicts is present');
    }
    return;
  }
  if (!sc || typeof sc !== 'object' || Array.isArray(sc)) {
    push(scPath, 'must be an object when present');
    return;
  }
  for (const [key, value] of Object.entries(sc)) {
    if (value !== 'pass' && value !== 'fail') {
      push(`${scPath}.${key}`, `must be "pass" or "fail", got ${JSON.stringify(value)}`);
    }
  }
  if (hasVerdicts && !('verdicts_complete' in sc)) {
    push(
      `${scPath}.verdicts_complete`,
      'required when data.verdicts is present (self-reported twin of the validator length check)',
    );
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
