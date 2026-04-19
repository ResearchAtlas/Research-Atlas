#!/usr/bin/env node
// Acceptance grader for Research Atlas skills.
//
// Consumes (envelope, ground_truth) and emits one boolean per pass
// condition defined in the ground-truth file. This is the mechanical
// sanity check for the public acceptance gate. It turns an envelope +
// ground-truth pair into explicit PASS / FAIL conditions; interpretation
// of failures still lives in the operator review step.
//
// Single-envelope mode covers recall, precision, evidence_present,
// envelope_conforms, latency. Latency is only graded when the operator
// passes --elapsed-minutes=<N>, since wall-clock isn't in the envelope.
//
// Latency measures ACTIVE AGENT TIME, not raw wall-clock. Interactive
// agents (Claude Code, Gemini, Codex) pause for per-tool approval
// prompts that the operator must manually accept. That wait is human
// latency, not agent latency, and scaling the number of tool calls (or
// the operator's reaction time) shouldn't push a well-behaved agent
// over the gate. The operator records two numbers:
//   --elapsed-minutes=N       wall-clock from prompt to final envelope
//   --approval-seconds=N      total seconds spent waiting on approvals
//                             (optional; default 0 — old behavior)
// Active agent time = elapsed_minutes - approval_seconds/60, and the
// gate threshold is applied to active time. Both numbers are reported.
//
// Parity mode (--parity) takes 3+ envelopes plus a ground-truth file
// and scores cross_agent_parity (exact + coarse-class match).
//
// Usage:
//   node scripts/grade-acceptance.mjs <envelope.json> <ground-truth.json> \
//       [--elapsed-minutes=N] [--approval-seconds=N]
//   node scripts/grade-acceptance.mjs --parity <env1.json> <env2.json> <env3.json> <ground-truth.json>
//
// Exit codes: 0 all conditions pass, 1 any fail, 2 usage error.
//
// Also exports `grade(envelope, groundTruth, opts)` and
// `gradeParity(envelopes, groundTruth)` for programmatic use.

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateEnvelope } from './validators/envelope.mjs';

// Coarse verdict classes for parity comparison. verified/partially_supported
// collapse to "supported"; the four flag classes collapse to "flagged";
// everything else passes through as-is.
const COARSE_CLASS_MAP = {
  verified: 'supported',
  partially_supported: 'supported',
  fabricated: 'flagged',
  fabricated_doi: 'flagged',
  metadata_mismatch_author: 'flagged',
  metadata_mismatch_year: 'flagged',
};

const FLAG_VERDICTS = new Set([
  'fabricated',
  'fabricated_doi',
  'metadata_mismatch_author',
  'metadata_mismatch_year',
]);

// Only these count as "flagged as not-real" for the precision check —
// metadata mismatches are real DOIs with wrong metadata, not fabrications.
const FABRICATION_VERDICTS = new Set(['fabricated', 'fabricated_doi']);

export function grade(envelope, groundTruth, opts = {}) {
  const conditions = [];
  const byRef = indexVerdicts(envelope);

  conditions.push(checkRecall(groundTruth, byRef));
  conditions.push(checkPrecision(groundTruth, byRef));
  conditions.push(checkEvidencePresent(byRef));
  conditions.push(checkEnvelopeConforms(envelope, groundTruth));

  if (typeof opts.elapsed_minutes === 'number') {
    const approvalSeconds = typeof opts.approval_seconds === 'number' ? opts.approval_seconds : 0;
    conditions.push(checkLatency(opts.elapsed_minutes, approvalSeconds, groundTruth));
  } else {
    const threshold = findThreshold(groundTruth, 'latency', 'threshold_minutes');
    conditions.push({
      name: 'latency',
      pass: null,
      actual: 'not measured (pass --elapsed-minutes=N; add --approval-seconds=N to exclude human approval wait)',
      expected: threshold != null ? `<= ${threshold} min active agent time` : 'unspecified',
    });
  }

  const passed_all = conditions.every((c) => c.pass === true);
  return { conditions, passed_all };
}

export function gradeParity(envelopes, groundTruth) {
  if (!Array.isArray(envelopes) || envelopes.length < 3) {
    throw new Error('gradeParity requires at least 3 envelopes');
  }

  const ids = groundTruth.items.map((i) => String(i.id));
  const indexes = envelopes.map((e) => indexVerdicts(e.envelope ?? e));

  let exact = 0;
  let coarse = 0;
  let missing = 0;
  const misses = [];

  for (const id of ids) {
    const verdicts = indexes.map((m) => m.get(id)?.verdict);
    if (verdicts.some((v) => v === undefined)) {
      missing++;
      continue;
    }
    if (verdicts.every((v) => v === verdicts[0])) {
      exact++;
      coarse++;
      continue;
    }
    const coarseVerdicts = verdicts.map((v) => COARSE_CLASS_MAP[v] ?? v);
    if (coarseVerdicts.every((v) => v === coarseVerdicts[0])) {
      coarse++;
    } else {
      misses.push({ id, verdicts });
    }
  }

  // Cross-agent parity thresholds: >= 90% exact, >= 95% coarse.
  const total = ids.length;
  const exactThreshold = Math.ceil(total * 0.9);
  const coarseThreshold = Math.ceil(total * 0.95);

  const conditions = [
    {
      name: 'cross_agent_parity_exact',
      pass: exact >= exactThreshold,
      actual: `${exact}/${total} exact verdict match${missing ? ` (${missing} missing)` : ''}`,
      expected: `>= ${exactThreshold}/${total} (90%)`,
    },
    {
      name: 'cross_agent_parity_coarse',
      pass: coarse >= coarseThreshold,
      actual: `${coarse}/${total} coarse class match${missing ? ` (${missing} missing)` : ''}`,
      expected: `>= ${coarseThreshold}/${total} (95%)`,
    },
  ];

  return {
    conditions,
    passed_all: conditions.every((c) => c.pass === true),
    misses,
  };
}

function indexVerdicts(envelope) {
  // The grader keys verdicts by the ground-truth item id (a stable
  // corpus-position string like "1", "2", ..., "30"). The skill's
  // SKILL.md Step 0.5 emits slug-style reference_ids like
  // "vaswani-2017-attention-is-all-you-need" by default, which do not
  // collide with the ground-truth keys. To tolerate both schemes, we
  // index by every reasonable handle:
  //   - the verdict's own reference_id (slug or numeric)
  //   - the 1-indexed position of the verdict in data.verdicts[]
  //     (mirrors the corpus's numeric enumeration, which is the
  //     contract the ground-truth file uses)
  // Ordinal fallback is safe because the skill processes references
  // in input order and emits one verdict per input chunk (Step 0.5
  // de-dup keeps first occurrence, so ordinality matches corpus
  // position as long as no dedup fires; when dedup fires the
  // duplicate is recorded in errors, not verdicts). When both a slug
  // and an ordinal resolve to the same verdict, the slug wins because
  // it was set first.
  const out = new Map();
  const verdicts = envelope?.data?.verdicts ?? [];
  verdicts.forEach((v, i) => {
    if (!v) return;
    if (typeof v.reference_id === 'string' && !out.has(v.reference_id)) {
      out.set(v.reference_id, v);
    }
    const ordinal = String(i + 1);
    if (!out.has(ordinal)) {
      out.set(ordinal, v);
    }
  });
  return out;
}

function checkRecall(groundTruth, byRef) {
  // Trap items: ground_truth declares either an exact expected_verdict
  // or a class that maps to FLAG_VERDICTS.
  const flagItems = groundTruth.items.filter((i) => {
    const expected = i.ground_truth?.expected_verdict;
    const cls = i.ground_truth?.class;
    return FLAG_VERDICTS.has(expected) || FLAG_VERDICTS.has(cls);
  });

  // A hit requires:
  //   - if expected_verdict is set, the actual verdict must match it
  //     exactly (fabricated_doi ≠ metadata_mismatch_year even though
  //     both are in FLAG_VERDICTS)
  //   - otherwise, any FLAG_VERDICTS member counts
  // Anything that fails either test is a miss, with a specific reason
  // so the failure message is actionable.
  const hits = [];
  const misses = [];
  for (const item of flagItems) {
    const v = byRef.get(String(item.id));
    const expected = item.ground_truth?.expected_verdict;
    if (!v) {
      misses.push({ id: item.id, reason: 'no verdict returned' });
      continue;
    }
    if (typeof expected === 'string') {
      if (v.verdict === expected) {
        hits.push(item);
      } else {
        misses.push({ id: item.id, reason: `got ${v.verdict}, expected ${expected}` });
      }
      continue;
    }
    if (FLAG_VERDICTS.has(v.verdict)) {
      hits.push(item);
    } else {
      misses.push({ id: item.id, reason: `got ${v.verdict}, expected any of ${[...FLAG_VERDICTS].join('|')}` });
    }
  }

  const threshold = findThreshold(groundTruth, 'recall') ?? Math.max(1, flagItems.length - 1);
  const missSummary = misses.length
    ? ` [misses: ${misses.map((m) => `${m.id}(${m.reason})`).join('; ')}]`
    : '';
  return {
    name: 'recall',
    pass: hits.length >= threshold,
    actual: `${hits.length}/${flagItems.length} correctly classified${missSummary}`,
    expected: `>= ${threshold}/${flagItems.length} with expected_verdict match when specified`,
  };
}

function checkPrecision(groundTruth, byRef) {
  const realItems = groundTruth.items.filter((i) =>
    String(i.ground_truth?.class ?? '').startsWith('real'),
  );
  const falseFlags = realItems.filter((i) => {
    const v = byRef.get(String(i.id));
    return v && FABRICATION_VERDICTS.has(v.verdict);
  });
  const threshold = findThreshold(groundTruth, 'precision') ?? 1;
  return {
    name: 'precision',
    pass: falseFlags.length <= threshold,
    actual: `${falseFlags.length}/${realItems.length} real items falsely flagged as fabricated`,
    expected: `<= ${threshold}/${realItems.length}`,
  };
}

function checkEvidencePresent(byRef) {
  // byRef indexes by multiple handles (slug + ordinal fallback) so the
  // same verdict can appear under two keys; dedup by object identity.
  const flagged = [...new Set(byRef.values())].filter((v) => FLAG_VERDICTS.has(v.verdict));
  const missing = flagged.filter((v) => !hasResolverCheck(v.evidence));
  return {
    name: 'evidence_present',
    pass: missing.length === 0,
    actual:
      missing.length === 0
        ? `all ${flagged.length} flagged item(s) cite a resolver or cross_check result`
        : `${missing.length} flagged item(s) missing resolver/cross_check evidence: ${missing
            .map((v) => v.reference_id)
            .join(', ')}`,
    expected: 'every flagged item has at least one resolver or cross_check entry in evidence',
  };
}

function hasResolverCheck(evidence) {
  if (!evidence || typeof evidence !== 'object' || Array.isArray(evidence)) return false;
  return 'resolved' in evidence || 'cross_check' in evidence;
}

function checkEnvelopeConforms(envelope, groundTruth) {
  const { ok, errors } = validateEnvelope(envelope);
  const expectedLen = groundTruth.total_items;
  const actualLen = envelope?.data?.verdicts?.length ?? 0;
  const schemaVersion = envelope?.meta?.schema_version;
  const schemaOK = schemaVersion === 2;
  const lenOK = typeof expectedLen !== 'number' ? true : actualLen === expectedLen;

  const problems = [];
  if (!schemaOK) problems.push(`schema_version=${schemaVersion}`);
  if (!lenOK) problems.push(`verdicts.length=${actualLen} vs expected ${expectedLen}`);
  if (!ok) problems.push(`${errors.length} validator error(s)`);

  return {
    name: 'envelope_conforms',
    pass: schemaOK && lenOK && ok,
    actual: problems.length === 0 ? 'schema_version=2, verdicts complete, validator passes' : problems.join('; '),
    expected: `schema_version=2, verdicts.length=${expectedLen ?? '?'}, validator passes`,
  };
}

function checkLatency(elapsedMinutes, approvalSeconds, groundTruth) {
  const threshold = findThreshold(groundTruth, 'latency', 'threshold_minutes') ?? 5;
  const activeMinutes = Math.max(0, elapsedMinutes - approvalSeconds / 60);
  const actual = approvalSeconds > 0
    ? `${activeMinutes.toFixed(1)} min active (${elapsedMinutes} min wall-clock minus ${approvalSeconds}s human approval wait)`
    : `${elapsedMinutes} min elapsed (no approval wait reported — treated as 100% active time; pass --approval-seconds=N if applicable)`;
  return {
    name: 'latency',
    pass: activeMinutes <= threshold,
    actual,
    expected: `<= ${threshold} min active agent time`,
  };
}

function findThreshold(groundTruth, conditionId, field = 'threshold') {
  const c = (groundTruth.pass_conditions ?? []).find((x) => x.id === conditionId);
  if (!c) return null;
  const val = c[field] ?? c.threshold;
  return typeof val === 'number' ? val : null;
}

// CLI

async function runCli() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    printUsage();
    process.exit(2);
  }

  if (argv[0] === '--parity') {
    return runParity(argv.slice(1));
  }
  return runSingle(argv);
}

async function runSingle(argv) {
  const positional = [];
  let elapsedMinutes;
  let approvalSeconds;
  for (const a of argv) {
    if (a.startsWith('--elapsed-minutes=')) {
      const n = Number(a.slice('--elapsed-minutes='.length));
      if (!Number.isFinite(n) || n < 0) {
        console.error(`--elapsed-minutes needs a non-negative number, got: ${a}`);
        process.exit(2);
      }
      elapsedMinutes = n;
    } else if (a.startsWith('--approval-seconds=')) {
      const n = Number(a.slice('--approval-seconds='.length));
      if (!Number.isFinite(n) || n < 0) {
        console.error(`--approval-seconds needs a non-negative number, got: ${a}`);
        process.exit(2);
      }
      approvalSeconds = n;
    } else if (a.startsWith('--')) {
      console.error(`unknown flag: ${a}`);
      process.exit(2);
    } else {
      positional.push(a);
    }
  }

  if (positional.length !== 2) {
    printUsage();
    process.exit(2);
  }

  if (typeof approvalSeconds === 'number' && typeof elapsedMinutes !== 'number') {
    console.error('--approval-seconds requires --elapsed-minutes to be set as well');
    process.exit(2);
  }

  const [envPath, gtPath] = positional;
  const envelope = await readJson(envPath);
  const groundTruth = await readJson(gtPath);
  const opts = {};
  if (typeof elapsedMinutes === 'number') opts.elapsed_minutes = elapsedMinutes;
  if (typeof approvalSeconds === 'number') opts.approval_seconds = approvalSeconds;
  const { conditions, passed_all } = grade(envelope, groundTruth, opts);
  reportConditions(conditions);
  process.exit(passed_all ? 0 : 1);
}

async function runParity(argv) {
  if (argv.length < 4) {
    console.error('--parity needs at least 3 envelope files + 1 ground-truth file');
    process.exit(2);
  }
  const envelopePaths = argv.slice(0, -1);
  const gtPath = argv[argv.length - 1];
  const envelopes = [];
  for (const p of envelopePaths) {
    envelopes.push({ agent: p, envelope: await readJson(p) });
  }
  const groundTruth = await readJson(gtPath);
  const { conditions, passed_all, misses } = gradeParity(envelopes, groundTruth);
  reportConditions(conditions);
  if (misses.length > 0) {
    console.log('\nparity misses:');
    for (const m of misses) {
      console.log(`  ${m.id}: ${m.verdicts.join(' / ')}`);
    }
  }
  process.exit(passed_all ? 0 : 1);
}

async function readJson(path) {
  const raw = await readFile(path, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`could not parse JSON at ${path}: ${e.message}`);
  }
}

function reportConditions(conditions) {
  for (const c of conditions) {
    const tag = c.pass === true ? 'PASS' : c.pass === false ? 'FAIL' : 'SKIP';
    console.log(`${tag}  ${c.name}`);
    console.log(`        actual:   ${c.actual}`);
    console.log(`        expected: ${c.expected}`);
  }
}

function printUsage() {
  console.error(
    'usage:\n' +
      '  grade-acceptance.mjs <envelope.json> <ground-truth.json> \\\n' +
      '      [--elapsed-minutes=N] [--approval-seconds=N]\n' +
      '  grade-acceptance.mjs --parity <env1.json> <env2.json> <env3.json> [...] <ground-truth.json>\n' +
      '\n' +
      '  --elapsed-minutes=N    total wall-clock minutes from trigger to final envelope\n' +
      '  --approval-seconds=N   total seconds spent waiting on user approval prompts\n' +
      '                         (subtracted from wall-clock to get active agent time)',
  );
}

const thisFile = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === thisFile) {
  runCli();
}
