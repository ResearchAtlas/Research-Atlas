#!/usr/bin/env node
// Runnable smoke harness for scripts/grade-acceptance.mjs.
//
// Runs the grader across the three mini fixtures and asserts exit codes:
//   - passing envelope           -> exit 0 (all conditions green)
//   - wrong-trap-class envelope  -> exit 1 (recall fails: P1-A regression guard)
//   - precision-fail envelope    -> exit 1 (precision fails: real item flagged)
//
// Exit 0: all branches behave as expected. Exit 1: at least one branch
// diverged (full diagnostic printed).

import { spawn } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const grader = join(repoRoot, 'scripts', 'grade-acceptance.mjs');
const fixtures = join(repoRoot, 'scripts', '__fixtures__', 'grade-acceptance');
const groundTruth = join(fixtures, 'mini-ground-truth.json');

function runGrader(envelope) {
  return new Promise((res, rej) => {
    const child = spawn(
      process.execPath,
      [grader, envelope, groundTruth, '--elapsed-minutes=1'],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (c) => { stdout += c; });
    child.stderr.on('data', (c) => { stderr += c; });
    child.on('error', rej);
    child.on('close', (code) => res({ code, stdout, stderr }));
  });
}

const cases = [
  {
    name: 'passing envelope (all conditions green)',
    fixture: 'mini-envelope-passing.json',
    expectCode: 0,
    expectStdoutMatch: /PASS\s+recall/,
  },
  {
    name: 'wrong-trap-class envelope (recall must fail: P1-A guard)',
    fixture: 'mini-envelope-wrong-trap-class.json',
    expectCode: 1,
    expectStdoutMatch: /FAIL\s+recall/,
  },
  {
    name: 'precision-fail envelope (real item flagged)',
    fixture: 'mini-envelope-precision-fail.json',
    expectCode: 1,
    expectStdoutMatch: /FAIL\s+precision/,
  },
];

async function main() {
  const failures = [];
  for (const c of cases) {
    const { code, stdout, stderr } = await runGrader(join(fixtures, c.fixture));
    const problems = [];
    if (code !== c.expectCode) problems.push(`exit ${code}, expected ${c.expectCode}`);
    if (c.expectStdoutMatch && !c.expectStdoutMatch.test(stdout)) {
      problems.push(`stdout missing ${c.expectStdoutMatch}`);
    }
    if (problems.length === 0) {
      console.log(`ok  — ${c.name}`);
    } else {
      console.log(`FAIL — ${c.name}`);
      for (const p of problems) console.log(`       ${p}`);
      if (stdout.trim()) console.log(`       stdout: ${stdout.trim().replace(/\n/g, '\n               ')}`);
      if (stderr.trim()) console.log(`       stderr: ${stderr.trim()}`);
      failures.push(c.name);
    }
  }
  if (failures.length > 0) {
    console.error(`\n${failures.length} of ${cases.length} grader smoke cases failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${cases.length} grader smoke cases passed.`);
}

main().catch((e) => {
  console.error(e.stack || e.message);
  process.exit(1);
});
