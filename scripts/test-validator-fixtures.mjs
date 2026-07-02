#!/usr/bin/env node
// Runnable assertion harness for the envelope validator fixtures.
//
// Walks scripts/validators/__fixtures__/ and asserts the split contract:
//   - every valid-*.json   -> validateEnvelope(...).ok === true
//   - every invalid-*.json -> validateEnvelope(...).ok === false
//
// This closes a gap: `npm run validate:envelopes:fixtures` only globs the
// valid-*.json files, so nothing previously asserted that the invalid-*.json
// fixtures (e.g. invalid-verdicts-incomplete.json) actually FAIL. A regression
// that loosened the validator would have gone unnoticed.
//
// Exit 0: every fixture landed on its expected side. Exit 1: at least one
// fixture flipped (full diagnostic printed).

import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateEnvelope } from './validators/envelope.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const fixturesDir = join(repoRoot, 'scripts', 'validators', '__fixtures__');

async function main() {
  const entries = (await readdir(fixturesDir)).filter((f) => f.endsWith('.json')).sort();
  const cases = [];
  for (const name of entries) {
    if (name.startsWith('valid-')) cases.push({ name, expectOk: true });
    else if (name.startsWith('invalid-')) cases.push({ name, expectOk: false });
    // Fixtures that are neither valid-* nor invalid-* are ignored on purpose.
  }

  if (cases.length === 0) {
    console.error('no valid-*/invalid-* fixtures found — did the fixtures dir move?');
    process.exit(1);
  }

  const failures = [];
  for (const c of cases) {
    let ok, errors;
    try {
      const obj = JSON.parse(await readFile(join(fixturesDir, c.name), 'utf8'));
      ({ ok, errors } = validateEnvelope(obj));
    } catch (e) {
      console.log(`FAIL — ${c.name}`);
      console.log(`       could not parse: ${e.message}`);
      failures.push(c.name);
      continue;
    }
    if (ok === c.expectOk) {
      console.log(`ok  — ${c.name} (${c.expectOk ? 'valid' : 'invalid'})`);
    } else {
      console.log(`FAIL — ${c.name}`);
      console.log(`       expected validateEnvelope ok=${c.expectOk}, got ok=${ok}`);
      if (!ok) {
        for (const err of errors) console.log(`       ${err.path || '<root>'}: ${err.msg}`);
      } else {
        console.log('       (validator accepted an envelope that should have failed)');
      }
      failures.push(c.name);
    }
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} of ${cases.length} validator fixture cases failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${cases.length} validator fixture cases passed.`);
}

main().catch((e) => {
  console.error(e.stack || e.message);
  process.exit(1);
});
