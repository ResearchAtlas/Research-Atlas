# Acceptance Runs — Cross-Agent Protocol

This directory holds the transcripts of the 30-reference acceptance
test (see
[`.claude/skills/research-verification/examples/acceptance-corpus.txt`](../../../.claude/skills/research-verification/examples/acceptance-corpus.txt))
run against the three supported agents.

Two transcript families live here:

- **Local preflight** transcripts:
  `preflight-claude-code.md`, `preflight-codex.md`,
  `preflight-gemini.md`
- **Public cold-install** transcripts:
  `claude-code.md`, `codex.md`, `gemini.md`

The local preflight validates the artifact before publish. The public
cold-install gate is the release-signoff evidence that must be green
before the milestone ships.

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
5. Save the full transcript into this directory using the template
   below. Use the `preflight-*.md` filenames for local preflight and
   the bare agent filenames for the public cold-install gate.

## Stage split

### Local preflight

- Claude Code: local marketplace add from the repo root
- Codex CLI: native `.agents/skills/` discovery from the repo root
- Gemini CLI: `gemini skills link ... --scope workspace`, then fresh
  session

### Public cold-install gate

- Claude Code: `/plugin marketplace add <canonical-repo>`
- Codex CLI: fresh checkout of the canonical public repo
- Gemini CLI:
  `gemini skills install https://github.com/<canonical-repo> --path .agents/skills/research-verification`

See [`RUN-COMMANDS.md`](RUN-COMMANDS.md) for the exact stage-by-stage
commands.

## Agent-specific invocation

### Claude Code

- Expected discovery: auto-loaded from `.claude/skills/research-verification/SKILL.md`.
- Expected trigger: the skill's description matches "verify these references"; Claude selects it automatically. If not, run `/skills` and pick `research-verification`.
- Save transcripts to:
  `docs/references/acceptance-runs/preflight-claude-code.md` for local
  preflight and `docs/references/acceptance-runs/claude-code.md` for
  the public gate.

### Codex CLI

- Expected discovery: `.agents/skills/research-verification/SKILL.md` via native walk from the repo root.
- Sanity check: in a fresh session, run `/skills` — `research-verification` should appear in the list.
- Expected trigger: issue the prompt; Codex auto-matches on description, or invoke explicitly with `$research-verification`.
- Save transcripts to:
  `docs/references/acceptance-runs/preflight-codex.md` for local
  preflight and `docs/references/acceptance-runs/codex.md` for the
  public gate.
- Note: hooks are NOT enabled by default. Do not set `codex_hooks = true` for the acceptance run — we want the clean invocation path.

### Gemini CLI

- Expected discovery: `.agents/skills/research-verification/SKILL.md` (shared alias, takes precedence over `.gemini/skills/`).
- Sanity check: `gemini skills list` — `research-verification` should be listed.
- Expected trigger: issue the prompt. Gemini calls `activate_skill` and presents a consent prompt. Approve.
- Do NOT expect `/skills` to activate the skill — that surface is management-only in Gemini. Activation is prompt-driven.
- Save transcripts to:
  `docs/references/acceptance-runs/preflight-gemini.md` for local
  preflight and `docs/references/acceptance-runs/gemini.md` for the
  public gate.

## Transcript template

When saving an acceptance run, use this structure:

```markdown
# Acceptance Run — <Agent>

- Date: <YYYY-MM-DD>
- Gate stage: local-preflight | public-cold-install
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

## Status as of 2026-04-19

### Local preflight

- [x] Claude Code local preflight — **PASS** (resolver + install-path both green) — see [`preflight-claude-code.md`](preflight-claude-code.md). Phase 1 resolver evidence: 5/5 traps caught, 0/25 false-positive, ~4 min, envelope conforms with `schema_version: 2`. Phase 2 install-path evidence (fresh-session, 2026-04-19): `/plugin marketplace add ./` and `/plugin install research-verification@research-atlas` both accept their manifests; `/skills` lists the skill; one-ref smoke on LeCun 2015 returns verified with confidence 1.00 and all six cross-checks pass. One expected semantic to re-verify at P1: `/skills` attributes the skill to `project` scope due to workspace-over-plugin de-dup; unambiguous plugin-source attribution will land at P1 (clean-checkout cold-install). Pre-existing resolver-coverage gap: 3 real no-DOI refs (16 GAN, 21 GPT-2, 24 PPO) landed as `unverifiable` (not `fabricated`) because OpenAlex `title.search` missed them; non-blocking for v1, filed as a post-v1 hardening candidate.
- [x] Codex CLI local preflight — **PARTIAL PASS (4/5 conditions, latency over budget)** — see [`preflight-codex.md`](preflight-codex.md) and canonical envelope [`preflight-codex.envelope.json`](preflight-codex.envelope.json). Attempts 1 and 2 (2026-04-19) were both invalid; attempt 3 (2026-04-19) is the valid run. **Attempt 1** did not follow the protocol: corpus was pasted without the `verify these references - detailed depth, markdown output` prefix, so the skill's auto-trigger did not fire and Codex did a manual imperative reconstruction via Playwright instead of running the skill. No envelope. **Attempt 2** resolved Findings A (stale `.codex/skills/research-verification/` v2.0.0 removed) and B (auto-match via prefix) but introduced **ground-truth + prior-transcript piggyback**: Codex read the grader oracle and Claude's L1 transcript during the run and echoed Claude's numbers verbatim. No envelope. **Structural + directive remediation landed before attempt 3**: (a) `acceptance-ground-truth.json` moved out of the shipped skill bundle to `docs/references/eval-harness/` so cold P1 installs no longer ship the oracle; (b) canonical SKILL.md gained an "Execution Invariants" section forbidding reads of grader oracles / prior acceptance transcripts and mandating the full envelope; (c) the retry prompt keeps explicit forbid-rules as belt and suspenders. **Attempt 3** is independent and correct: no oracle read, no prior-transcript read, full resolver pipeline executed, full `schema_version: 2` envelope emitted with 30 verdicts. Grader output via `node scripts/grade-acceptance.mjs docs/references/acceptance-runs/preflight-codex.envelope.json docs/references/eval-harness/acceptance-ground-truth.json --elapsed-minutes=11`: **PASS recall 5/5**, **PASS precision 0/25**, **PASS evidence_present (all 5 flagged verdicts cite resolver/cross-check)**, **PASS envelope_conforms (`meta.schema_version=2`, `verdicts.length=30`, validator passes)**, **FAIL latency (~11 min vs ≤5 min budget)**. The latency miss is a Codex-sandbox-HTTP artifact (outbound HTTP blocked → Playwright browser → serial API calls), not a skill issue: Claude L1 finished the same corpus in ~4 min using in-process fetch. Decision: ship v1 with the latency miss declared here and in the announce draft (Option A in the L2 transcript); a post-v1 hardening task captures the Codex-browser-HTTP pipelining optimization. Two grader bugs were fixed alongside this run: (i) `indexVerdicts` gained an ordinal fallback because ground-truth keys by numeric IDs and the skill emits slug `reference_id` values; (ii) `checkEvidencePresent` dedupes by object identity because the ordinal fallback made `byRef.values()` double-count. `npm run grade:acceptance:fixtures` still passes after both fixes.
- [ ] Gemini CLI local preflight — **BLOCKED** after 3 attempts (2026-04-19) — see [`preflight-gemini.md`](preflight-gemini.md) and forensic envelopes [`preflight-gemini.attempt-1.envelope.raw.json`](preflight-gemini.attempt-1.envelope.raw.json), [`preflight-gemini.attempt-2.envelope.raw.json`](preflight-gemini.attempt-2.envelope.raw.json), [`preflight-gemini.attempt-3.envelope.raw.json`](preflight-gemini.attempt-3.envelope.raw.json). No canonical `preflight-gemini.envelope.json` is present — no attempt passed the hardened validator. **Attempt 1**: `/skills` did not activate the linked skill (Gemini activation is prompt-driven via `activate_skill`, not `/skills`; protocol updated). **Attempt 2**: envelope emitted with `data.output_format="markdown"` but `data.content=""` — the markdown report was in Gemini's prose reply, not inside the envelope. Motivated validator commit `050bd24` (non-empty content required when `output_format != "json"`). **Attempt 3**: resolver pipeline executed correctly, narrative tally matches ground truth (25 verified / 5 flagged / trap cohort 5/5), but envelope serialization truncated `data.verdicts` to a 4-item "sample", omitted `data.content` entirely, and self-attested `verdicts_complete: "pass"` despite `verdicts.length=4 !== input_count=30`. Hardened validator output: `data.content required` + `verdicts_complete violated: length 4 !== expected 30` + `verdict_summary.{verified,fabricated} counts do not match rollup`. Grader: FAIL recall (0/5, misses trap refs because they're in narrative not envelope), PASS precision (1/25), PASS evidence_present (3/3), FAIL envelope_conforms (4 validator errors), FAIL latency (6.0 min active from 8 min wall-clock minus 120s approval wait). Three correctness failures is too many for PARTIAL disposition. Root cause: Gemini's default response budget favors prose over structured output; when asked for a machine-readable envelope it summarizes. Retry plan (out of scope for L3 this pass): add explicit anti-truncation and `content`-non-empty directives to the retry prompt (see `preflight-gemini.md` §"Retry plan for attempt 4"). Validator hardening that landed during this investigation (`f0d4a5b`, `5d85f2c`, `050bd24`, `33eb6c1`) is the permanent win: no agent can silently ship a shape-degraded envelope past the gate regardless of how plausible the narrative looks.

### Public cold-install gate

- [ ] Claude Code public run — PENDING
- [ ] Codex CLI public run — PENDING
- [ ] Gemini CLI public run — PENDING

The local preflight is a prerequisite to publish. The public runs are
the release-signoff evidence.
