# Acceptance Runs — Cross-Agent Protocol

This directory holds the transcripts of the 30-reference acceptance test
(see [`.claude/skills/research-verification/examples/acceptance-corpus.txt`](../../../.claude/skills/research-verification/examples/acceptance-corpus.txt))
run against the three supported agents. All three must pass before the milestone
ships (Track C6 + §7 Definition of Done in the [milestone plan](../../plans/2026-04-17-next-milestone-plan.md)).

## The six pass conditions

Reproduced here for convenience. Every run must hold all six:

1. **Recall:** flags ≥ 4 of the 5 fabricated references (entries 26-30) as fabricated or metadata-mismatch.
2. **Precision:** flags ≤ 1 of the 25 real references (entries 1-25) as fabricated.
3. **Evidence:** every flagged reference has at least one resolver check in its `evidence` block (CrossRef 404, OpenAlex null, cross-check mismatch, etc.).
4. **Format:** output conforms to the `{meta, status, data, errors}` envelope in the canonical SKILL.md; `schema_version == 2`; every parsed reference has one entry in `data.verdicts`.
5. **Latency:** end-to-end run ≤ 5 minutes on a residential connection, no human research in the loop.
6. **Cross-agent parity:** Claude, Codex, and Gemini produce semantically equivalent verdicts — same true-positives, same true-negatives, up to ±1 on edge cases (Watson-Crick / Turing / Shannon have old DOI schemas that some resolvers do not index cleanly).

## Protocol — identical across agents

1. Start a fresh agent session in this repo (`cd` into the repo root).
2. Copy-paste the full contents of `acceptance-corpus.txt` (comment lines included; the skill's parser ignores them) into the chat.
3. Prefix with: `verify these references — detailed depth, markdown output`.
4. Start a stopwatch. Let the agent run to completion without manual intervention.
5. Save the full transcript into this directory as `<agent>.md` using the template below.

## Agent-specific invocation

### Claude Code

- Expected discovery: auto-loaded from `.claude/skills/research-verification/SKILL.md`.
- Expected trigger: the skill's description matches "verify these references"; Claude selects it automatically. If not, run `/skills` and pick `research-verification`.
- Save transcript to: `docs/references/acceptance-runs/claude-code.md`.

### Codex CLI

- Expected discovery: `.agents/skills/research-verification/SKILL.md` via native walk from the repo root.
- Sanity check: in a fresh session, run `/skills` — `research-verification` should appear in the list.
- Expected trigger: issue the prompt; Codex auto-matches on description, or invoke explicitly with `$research-verification`.
- Save transcript to: `docs/references/acceptance-runs/codex.md`.
- Note: hooks are NOT enabled by default. Do not set `codex_hooks = true` for the acceptance run — we want the clean invocation path.

### Gemini CLI

- Expected discovery: `.agents/skills/research-verification/SKILL.md` (shared alias, takes precedence over `.gemini/skills/`).
- Sanity check: `gemini skills list` — `research-verification` should be listed.
- Expected trigger: issue the prompt. Gemini calls `activate_skill` and presents a consent prompt. Approve.
- Do NOT expect `/skills` to activate the skill — that surface is management-only in Gemini. Activation is prompt-driven.
- Save transcript to: `docs/references/acceptance-runs/gemini.md`.

## Transcript template

When saving an acceptance run, use this structure:

```markdown
# Acceptance Run — <Agent>

- Date: <YYYY-MM-DD>
- Agent version: <output of `<agent> --version`>
- Skill version: 2.1.0 (from canonical SKILL.md)
- Start time: <HH:MM:SS>
- End time: <HH:MM:SS>
- Elapsed: <N minutes>

## Result summary

| condition | result |
|---|---|
| 1. Recall (≥4/5 fabricated flagged) | pass / fail — actual: N/5 |
| 2. Precision (≤1/25 real flagged) | pass / fail — actual: N/25 |
| 3. Evidence on every flag | pass / fail |
| 4. Envelope conforms, schema_version==2 | pass / fail |
| 5. Latency ≤ 5 min | pass / fail — actual: N min |
| 6. Cross-agent parity | filled in after all three runs complete |

## Verdict tally

| ref | verdict | notes |
|---|---|---|
| 1 (vaswani-2017) | verified | ... |
| ... | ... | ... |
| 30 (lecun-2020-wrong-year) | metadata_mismatch_year | ... |

## Raw output envelope

(paste the YAML from the agent's final response here)

## Notes and deviations

(anything the agent got wrong, anything the human had to nudge, anything that
should inform the next iteration of the skill)
```

## Status as of 2026-04-17

- [ ] Claude Code run — PENDING (execute after the canonical SKILL.md is final).
- [ ] Codex CLI run — PENDING (blocked on Claude Code pass).
- [ ] Gemini CLI run — PENDING (blocked on Claude Code pass).

The Claude Code run is the B7 gate. Codex + Gemini runs are the C6 gate. All three gate the Launch track (L1-L2).
