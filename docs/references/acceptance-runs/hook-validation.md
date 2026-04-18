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
- The shared validator lives at
  [`../../../scripts/validators/envelope.mjs`](../../../scripts/validators/envelope.mjs).
  The hook resolves it via `$CLAUDE_PROJECT_DIR` first, then falls
  back to a sibling path for dev checkouts.

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

Each line is a self-contained payload piped to the hook from the repo
root. Expected exit codes noted; run all four in sequence to confirm
each branch.

```sh
# 1. Non-envelope write — should exit 0 silently
echo '{"tool_name":"Write","tool_input":{"file_path":"/tmp/readme.md","content":"hi"}}' \
  | node plugin/hooks/validate-envelope-write.mjs
# expect: exit 0, no stderr

# 2. Non-Write tool — should exit 0 silently
echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' \
  | node plugin/hooks/validate-envelope-write.mjs
# expect: exit 0, no stderr

# 3. Valid envelope write — should exit 0 silently
printf '%s' "{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"/tmp/demo.envelope.json\",\"content\":$(cat scripts/validators/__fixtures__/valid-reference-level.json | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>process.stdout.write(JSON.stringify(d)))')}}" \
  | node plugin/hooks/validate-envelope-write.mjs
# expect: exit 0, no stderr

# 4. Invalid envelope write (verdicts_complete violation) — should exit 2
printf '%s' "{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"/tmp/demo.envelope.json\",\"content\":$(cat scripts/validators/__fixtures__/invalid-verdicts-incomplete.json | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>process.stdout.write(JSON.stringify(d)))')}}" \
  | node plugin/hooks/validate-envelope-write.mjs
# expect: exit 2, stderr with verdicts_complete error
```

All four branches behave as specified: **pass**.

## Why this is only a PoC

- One hook, one matcher (`Write`), one file-path heuristic
  (`*.envelope.json`). A production-grade hook would also cover
  Edit/MultiEdit, handle streaming writes, and surface the
  `verdicts_complete` source (`meta.input_count` vs
  `data.citations_checked`) in the error message.
- No Codex or Gemini parity. Codex hooks are experimental and
  Windows-disabled as of 2026-04; porting is deferred to Phase 2+.
- The hook requires the validator file on disk. A sandboxed or
  network-isolated install would need the validator bundled into
  `${CLAUDE_PLUGIN_ROOT}/hooks/` instead of pulled from
  `scripts/validators/`. That's a packaging follow-up, not a
  correctness issue.

## Related

- Task spec: [`../../tasks/phase-1-harden.md`](../../tasks/phase-1-harden.md) §T4
- Hook opt-in snippet: [`../../../AGENTS.md`](../../../AGENTS.md) §Hooks
- Envelope contract: [`../../roadmap/architecture.md`](../../roadmap/architecture.md) §3
