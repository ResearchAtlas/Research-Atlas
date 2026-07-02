#!/usr/bin/env node
// Content validator for Research Atlas prompts/guides/workflows.
//
// Data lives in TypeScript (src/data/*.ts), so this script bundles a tiny
// virtual entry with esbuild (already a transitive dependency via vite),
// writes it to a temp file, and imports it to get plain JS arrays.
//
// Checks (see PROVENANCE_WORKSTREAM task for the full list):
//   ERRORS (exit 1):
//     - duplicate ids within prompts / guides / workflows
//     - missing/invalid provenance (required keys, status enum, ISO dates)
//     - future addedAt/reviewedAt; reviewedAt before addedAt
//     - unresolved workflow promptIds (flat steps + phases[].steps)
//     - provenance.sourceUrl repo-relative paths that don't exist
//     - stages[]/researchTypes[] values not in the taxonomy enums
//     - prompt variable/instruction placeholder mismatches
//   WARNINGS (exit still 0):
//     - staleness: (reviewedAt ?? addedAt) older than STALE_AFTER_DAYS
//
// Usage: node scripts/validate-content.mjs
// Exit codes: 0 (no errors), 1 (errors found).

import { build } from 'esbuild';
import { writeFile, rm, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_STATUSES = new Set(['verified', 'reviewed', 'unverified', 'needs_refresh']);

async function loadData() {
  const entry = `
    export { PROMPTS } from "@/data/prompts"
    export { GUIDES } from "@/data/guides"
    export { WORKFLOWS } from "@/data/workflows"
    export { STAGES, RESEARCH_TYPES } from "@/data/taxonomy"
    export { STALE_AFTER_DAYS } from "@/data/provenance"
  `;

  const result = await build({
    stdin: {
      contents: entry,
      resolveDir: ROOT,
      loader: 'ts',
      sourcefile: 'validate-content-entry.ts',
    },
    bundle: true,
    write: false,
    platform: 'node',
    format: 'esm',
    tsconfig: join(ROOT, 'tsconfig.json'),
  });

  const tmpDir = await mkdtemp(join(tmpdir(), 'research-atlas-validate-'));
  const outFile = join(tmpDir, 'bundle.mjs');
  await writeFile(outFile, result.outputFiles[0].contents);
  try {
    return await import(`file://${outFile}`);
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
}

function main() {
  return loadData().then(({ PROMPTS, GUIDES, WORKFLOWS, STAGES, RESEARCH_TYPES, STALE_AFTER_DAYS }) => {
    const errors = [];
    const warnings = [];
    const error = (locator, msg) => errors.push(`${locator}: ${msg}`);
    const warn = (locator, msg) => warnings.push(`${locator}: ${msg}`);

    const validStages = new Set(STAGES.map((s) => s.id));
    const validResearchTypes = new Set(RESEARCH_TYPES.map((t) => t.id));
    const today = new Date().toISOString().slice(0, 10);

    checkDuplicateIds(PROMPTS, 'prompts', error);
    checkDuplicateIds(GUIDES, 'guides', error);
    checkDuplicateIds(WORKFLOWS, 'workflows', error);

    for (const p of PROMPTS) {
      const locator = `prompts/${p.id}`;
      checkProvenance(locator, p.provenance, today, error, warn, STALE_AFTER_DAYS);
      checkTaxonomy(locator, p, validStages, validResearchTypes, error);
      checkVariableIntegrity(locator, p, error);
    }

    for (const g of GUIDES) {
      const locator = `guides/${g.id}`;
      checkProvenance(locator, g.provenance, today, error, warn, STALE_AFTER_DAYS);
      checkTaxonomy(locator, g, validStages, validResearchTypes, error);
    }

    const promptIds = new Set(PROMPTS.map((p) => p.id));
    for (const w of WORKFLOWS) {
      const locator = `workflows/${w.id}`;
      checkProvenance(locator, w.provenance, today, error, warn, STALE_AFTER_DAYS);
      checkTaxonomy(locator, w, validStages, validResearchTypes, error);
      checkWorkflowPromptIds(locator, w, promptIds, error);
    }

    for (const e of errors) console.log(`ERROR   ${e}`);
    for (const w of warnings) console.log(`WARNING ${w}`);
    console.log(`\n${errors.length} errors, ${warnings.length} warnings`);

    process.exit(errors.length === 0 ? 0 : 1);
  });
}

function checkDuplicateIds(items, kind, error) {
  const seen = new Map();
  for (const item of items) {
    seen.set(item.id, (seen.get(item.id) ?? 0) + 1);
  }
  for (const [id, count] of seen) {
    if (count > 1) error(`${kind}/${id}`, `duplicate id (${count} occurrences)`);
  }
}

function checkProvenance(locator, provenance, today, error, warn, staleAfterDays) {
  if (!provenance || typeof provenance !== 'object') {
    error(locator, 'missing provenance');
    return;
  }

  if (typeof provenance.source !== 'string' || provenance.source.length === 0) {
    error(`${locator}.provenance.source`, 'required non-empty string');
  }
  if (typeof provenance.owner !== 'string' || provenance.owner.length === 0) {
    error(`${locator}.provenance.owner`, 'required non-empty string');
  }
  if (!VALID_STATUSES.has(provenance.status)) {
    error(`${locator}.provenance.status`, `must be one of ${[...VALID_STATUSES].join(', ')}, got ${JSON.stringify(provenance.status)}`);
  }

  if (typeof provenance.addedAt !== 'string' || !ISO_DATE.test(provenance.addedAt)) {
    error(`${locator}.provenance.addedAt`, 'required ISO date (YYYY-MM-DD)');
  } else if (provenance.addedAt > today) {
    error(`${locator}.provenance.addedAt`, `is in the future (${provenance.addedAt} > ${today})`);
  }

  if (provenance.reviewedAt !== undefined) {
    if (typeof provenance.reviewedAt !== 'string' || !ISO_DATE.test(provenance.reviewedAt)) {
      error(`${locator}.provenance.reviewedAt`, 'must be an ISO date (YYYY-MM-DD) when present');
    } else {
      if (provenance.reviewedAt > today) {
        error(`${locator}.provenance.reviewedAt`, `is in the future (${provenance.reviewedAt} > ${today})`);
      }
      if (typeof provenance.addedAt === 'string' && ISO_DATE.test(provenance.addedAt) && provenance.reviewedAt < provenance.addedAt) {
        error(`${locator}.provenance.reviewedAt`, `is earlier than addedAt (${provenance.reviewedAt} < ${provenance.addedAt})`);
      }
    }
  }

  if (provenance.sourceUrl) {
    if (!/^https?:\/\//i.test(provenance.sourceUrl)) {
      const target = join(ROOT, provenance.sourceUrl);
      if (!existsSync(target)) {
        error(`${locator}.provenance.sourceUrl`, `repo-relative path does not exist: ${provenance.sourceUrl}`);
      }
    }
  }

  const effectiveDate = provenance.reviewedAt ?? provenance.addedAt;
  if (typeof effectiveDate === 'string' && ISO_DATE.test(effectiveDate)) {
    const ageDays = (Date.parse(today) - Date.parse(effectiveDate)) / (1000 * 60 * 60 * 24);
    if (ageDays > staleAfterDays) {
      warn(locator, `stale: last touched ${effectiveDate}, ${Math.floor(ageDays)} days ago (> ${staleAfterDays})`);
    }
  }
}

function checkTaxonomy(locator, item, validStages, validResearchTypes, error) {
  for (const stage of item.stages ?? []) {
    if (!validStages.has(stage)) error(`${locator}.stages`, `unknown stage "${stage}"`);
  }
  for (const type of item.researchTypes ?? []) {
    if (!validResearchTypes.has(type)) error(`${locator}.researchTypes`, `unknown research type "${type}"`);
  }
}

function checkVariableIntegrity(locator, prompt, error) {
  const instructions = prompt.content?.instructions ?? '';
  const usedVars = new Set([...instructions.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]));
  const declaredVars = new Set((prompt.variables ?? []).map((v) => v.name));

  for (const v of usedVars) {
    if (!declaredVars.has(v)) {
      error(`${locator}.variables`, `instructions reference {{${v}}} but it is not declared in variables[]`);
    }
  }
  for (const v of declaredVars) {
    if (!usedVars.has(v)) {
      error(`${locator}.variables`, `variable "${v}" is declared but never used in instructions`);
    }
  }
}

function checkWorkflowPromptIds(locator, workflow, promptIds, error) {
  const checkStep = (stepLocator, step) => {
    for (const id of step.promptIds ?? []) {
      if (!promptIds.has(id)) {
        error(stepLocator, `promptIds references unknown prompt "${id}"`);
      }
    }
  };

  for (const step of workflow.steps ?? []) {
    checkStep(`${locator}.steps/${step.id}`, step);
  }
  for (const phase of workflow.phases ?? []) {
    for (const step of phase.steps ?? []) {
      checkStep(`${locator}.phases/${phase.id}/steps/${step.id}`, step);
    }
  }
}

main();
