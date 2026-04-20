#!/usr/bin/env node
// Runnable smoke harness for plugin/hooks/validate-envelope-write.mjs.
//
// Pipes four canonical PostToolUse payloads to the hook and asserts the
// exit code + stderr shape of each branch. Covers the four core hook
// branches: non-envelope writes, non-Write tools, valid envelopes, and
// invalid envelopes that should block on validator output.
//
// Exit 0: all branches behave as expected. Exit 1: at least one branch
// diverged (full diagnostic printed).

import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const hookPath = join(repoRoot, 'plugin', 'hooks', 'validate-envelope-write.mjs');

async function loadFixture(rel) {
  return readFile(join(repoRoot, rel), 'utf8');
}

function runHook(payload) {
  return new Promise((res, rej) => {
    const child = spawn(process.execPath, [hookPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (c) => { stdout += c; });
    child.stderr.on('data', (c) => { stderr += c; });
    child.on('error', rej);
    child.on('close', (code) => res({ code, stdout, stderr }));
    child.stdin.end(payload);
  });
}

function envelopePayload(filePath, contentStr) {
  return JSON.stringify({
    tool_name: 'Write',
    tool_input: { file_path: filePath, content: contentStr },
  });
}

const cases = [
  {
    name: 'non-envelope write',
    build: async () =>
      JSON.stringify({
        tool_name: 'Write',
        tool_input: { file_path: '/tmp/readme.md', content: 'hi' },
      }),
    expectCode: 0,
    expectStderrEmpty: true,
  },
  {
    name: 'non-Write tool',
    build: async () =>
      JSON.stringify({ tool_name: 'Bash', tool_input: { command: 'ls' } }),
    expectCode: 0,
    expectStderrEmpty: true,
  },
  {
    name: 'valid envelope write',
    build: async () => {
      const content = await loadFixture('scripts/validators/__fixtures__/valid-reference-level.json');
      return envelopePayload('/tmp/demo.envelope.json', content);
    },
    expectCode: 0,
    expectStderrEmpty: true,
  },
  {
    name: 'invalid envelope write (verdicts_complete)',
    build: async () => {
      const content = await loadFixture('scripts/validators/__fixtures__/invalid-verdicts-incomplete.json');
      return envelopePayload('/tmp/demo.envelope.json', content);
    },
    expectCode: 2,
    expectStderrMatch: /verdicts_complete/,
  },
];

async function main() {
  const failures = [];
  for (const c of cases) {
    const payload = await c.build();
    const { code, stderr } = await runHook(payload);
    const problems = [];
    if (code !== c.expectCode) problems.push(`exit ${code}, expected ${c.expectCode}`);
    if (c.expectStderrEmpty && stderr.trim() !== '') problems.push(`stderr non-empty: ${stderr.trim()}`);
    if (c.expectStderrMatch && !c.expectStderrMatch.test(stderr)) problems.push(`stderr missing ${c.expectStderrMatch}: ${stderr.trim()}`);
    if (problems.length === 0) {
      console.log(`ok  — ${c.name}`);
    } else {
      console.log(`FAIL — ${c.name}`);
      for (const p of problems) console.log(`       ${p}`);
      failures.push(c.name);
    }
  }
  if (failures.length > 0) {
    console.error(`\n${failures.length} of ${cases.length} smoke branches failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${cases.length} smoke branches passed.`);
}

main().catch((e) => {
  console.error(e.stack || e.message);
  process.exit(1);
});
