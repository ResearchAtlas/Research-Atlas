# Hook acceptance corpus — envelope-write validator

**Skill:** n/a (harness-level hook)
**Target:** [`plugin/hooks/validate-envelope-write.mjs`](../../../plugin/hooks/validate-envelope-write.mjs)
**Status:** one-item corpus, Phase 1 T4 proof-of-concept.

This corpus exists to prove the opt-in PostToolUse hook does what its
name claims: when Claude Code writes a file whose path ends in
`.envelope.json`, the hook runs the shared envelope validator and
either lets the write stand (exit 0) or feeds validator errors back
to the model (exit 2).

The corpus is one adversarial prompt plus four scripted stdin
payloads. The prompt exercises the end-to-end hook in a live session;
the scripted payloads let CI/regression runs skip the live agent and
still prove the hook's four branches.

## Prerequisites

- Claude Code settings must include the opt-in PostToolUse snippet
  from [`../../../AGENTS.md`](../../../AGENTS.md) §Hooks. Without the
  snippet the hook is inert — installing the plugin does not register
  it.
- The canonical validator lives at
  [`../../../scripts/validators/envelope.mjs`](../../../scripts/validators/envelope.mjs).
  It is mirrored into
  [`../../../plugin/hooks/envelope.mjs`](../../../plugin/hooks/envelope.mjs)
  by `scripts/mirror-skills.mjs`; the hook imports the bundled sibling
  so it works identically from a monorepo checkout and an installed
  plugin (no `$CLAUDE_PROJECT_DIR` dependency).

## Live-session prompt

Paste into a fresh Claude Code session inside this repo:

```
Write the following JSON to ./tmp-acceptance.envelope.json exactly as shown.
Do not reformat, do not correct, do not add missing fields:

{
  "meta": {
    "skill": "research-verification",
    "version": "2.1.0",
    "schema_version": 2,
    "run_id": "4b8c2e41-0000-4000-8000-00000000dead",
    "timestamp": "2026-04-18T12:00:00Z",
    "input_count": 3
  },
  "status": "success",
  "data": {
    "task": "verify_citations",
    "verdicts": [
      {
        "reference_id": "only-one",
        "verdict": "verified",
        "confidence": 0.9,
        "evidence": { "parsed": { "doi": "10.1/x" } }
      }
    ]
  }
}
```

**Expected behavior:**

1. Claude issues the Write tool call.
2. The hook fires (PostToolUse matcher: `Write`).
3. The hook sees `file_path` ends in `.envelope.json`, parses the
   content, validates via `validateEnvelope`, and exits 2 with:

   ```
   Envelope at <path>/tmp-acceptance.envelope.json failed schema_version 2 validation:
     data.verdicts: verdicts_complete violated: length 1 !== expected 3 (from meta.input_count)

   Fix the envelope to satisfy the schema and re-write. ...
   ```

4. Claude reads the stderr as feedback and either (a) fixes
   `meta.input_count` to match the single verdict or (b) adds two
   more verdicts, then re-writes.

**Pass condition:** the hook fires, exits 2, and Claude's next
message acknowledges the validator feedback and corrects the
envelope. Save the full transcript as
`docs/references/acceptance-runs/hook-validation-<agent>.md` using
the template in [`README.md`](README.md).

## Scripted smoke test (no live session)

The four branches are encoded as a runnable harness:
[`../../../scripts/test-hook-smoke.mjs`](../../../scripts/test-hook-smoke.mjs).
Run from the repo root:

```sh
npm run test:hook:smoke
```

Expected output:

```
ok  — non-envelope write
ok  — non-Write tool
ok  — valid envelope write
ok  — invalid envelope write (verdicts_complete)

All 4 smoke branches passed.
```

The harness asserts both exit codes (0 / 0 / 0 / 2) and the stderr
shape (`verdicts_complete` substring on the failing branch). A diverging
branch exits 1 with a per-case diagnostic.

## Why this is only a PoC

- One hook, one matcher (`Write`), one file-path heuristic
  (`*.envelope.json`). A production-grade hook would also cover
  Edit/MultiEdit, handle streaming writes, and surface the
  `verdicts_complete` source (`meta.input_count` vs
  `data.citations_checked`) in the error message.
- No Codex or Gemini parity. Codex hooks are experimental and
  Windows-disabled as of 2026-04; porting is deferred to Phase 2+.

## Related

- Task spec: [`../../tasks/phase-1-harden.md`](../../tasks/phase-1-harden.md) §T4
- Hook opt-in snippet: [`../../../AGENTS.md`](../../../AGENTS.md) §Hooks
- Envelope contract: [`../../roadmap/architecture.md`](../../roadmap/architecture.md) §3
