#!/usr/bin/env node
// PostToolUse hook — Atlas envelope validator for Write tool calls.
//
// Fires after Claude writes a file via the Write tool. If the write
// target ends in `.envelope.json`, parse the content, run the shared
// envelope validator, and feed errors back to Claude as a blocking
// message (exit 2) so the model knows to fix and retry.
//
// Silent no-op for every other write. Silent pass for valid envelopes.
//
// This hook is OPT-IN. Install by adding the snippet from
// AGENTS.md §Hooks to your `.claude/settings.json`. It is not
// auto-registered by the plugin.
//
// Wire-up contract (see docs/references/eval-harness/README.md):
//   - PostToolUse matcher: "Write"
//   - stdin: Claude Code PostToolUse payload (JSON)
//   - stderr on invalid envelope: one line per validator error
//   - exit 0: all good (or not an envelope write)
//   - exit 2: envelope invalid — Claude re-reads stderr as feedback

import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));

async function loadValidator() {
  // The validator lives in the repo at scripts/validators/envelope.mjs.
  // When the hook runs from an installed plugin, $CLAUDE_PROJECT_DIR
  // points at the repo root; when it runs in-place during dev, we
  // resolve relative to the hook file.
  const projectDir = process.env.CLAUDE_PROJECT_DIR;
  const candidates = [
    projectDir ? resolve(projectDir, 'scripts/validators/envelope.mjs') : null,
    resolve(scriptDir, '../../scripts/validators/envelope.mjs'),
  ].filter(Boolean);

  for (const p of candidates) {
    try {
      return (await import(`file://${p.replace(/\\/g, '/')}`)).validateEnvelope;
    } catch {
      // keep trying
    }
  }
  throw new Error(`could not locate scripts/validators/envelope.mjs (tried: ${candidates.join(', ')})`);
}

async function readStdin() {
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

async function main() {
  const raw = await readStdin();
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    // Malformed hook payload — not our fault, don't block Claude.
    process.stderr.write(`validate-envelope-write: could not parse hook payload: ${e.message}\n`);
    process.exit(0);
  }

  if (payload.tool_name !== 'Write') process.exit(0);

  const filePath = payload?.tool_input?.file_path;
  const content = payload?.tool_input?.content;
  if (typeof filePath !== 'string' || !filePath.endsWith('.envelope.json')) {
    process.exit(0);
  }
  if (typeof content !== 'string') {
    process.stderr.write(
      'Envelope write detected but tool_input.content was missing. Re-issue the write with full envelope body.\n',
    );
    process.exit(2);
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    process.stderr.write(
      `Envelope at ${filePath} is not valid JSON: ${e.message}\nRegenerate the envelope so JSON.parse succeeds.\n`,
    );
    process.exit(2);
  }

  const validateEnvelope = await loadValidator();
  const { ok, errors } = validateEnvelope(parsed);
  if (ok) process.exit(0);

  process.stderr.write(`Envelope at ${filePath} failed schema_version 2 validation:\n`);
  for (const err of errors) {
    process.stderr.write(`  ${err.path || '<root>'}: ${err.msg}\n`);
  }
  process.stderr.write(
    '\nFix the envelope to satisfy the schema and re-write. See docs/roadmap/architecture.md §3 for the envelope contract.\n',
  );
  process.exit(2);
}

main().catch((e) => {
  process.stderr.write(`validate-envelope-write: unexpected error: ${e.stack || e.message}\n`);
  process.exit(1);
});
