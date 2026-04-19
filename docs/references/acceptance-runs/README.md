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

## Status as of 2026-04-18

### Local preflight

- [x] Claude Code local preflight — **PASS** (resolver + install-path both green) — see [`preflight-claude-code.md`](preflight-claude-code.md). Phase 1 resolver evidence: 5/5 traps caught, 0/25 false-positive, ~4 min, envelope conforms with `schema_version: 2`. Phase 2 install-path evidence (fresh-session, 2026-04-19): `/plugin marketplace add ./` and `/plugin install research-verification@research-atlas` both accept their manifests; `/skills` lists the skill; one-ref smoke on LeCun 2015 returns verified with confidence 1.00 and all six cross-checks pass. One expected semantic to re-verify at P1: `/skills` attributes the skill to `project` scope due to workspace-over-plugin de-dup; unambiguous plugin-source attribution will land at P1 (clean-checkout cold-install). Pre-existing resolver-coverage gap: 3 real no-DOI refs (16 GAN, 21 GPT-2, 24 PPO) landed as `unverifiable` (not `fabricated`) because OpenAlex `title.search` missed them; non-blocking for v1, filed as a post-v1 hardening candidate.
- [~] Codex CLI local preflight — **PARTIAL, attempt 2 still invalid** — see [`preflight-codex.md`](preflight-codex.md). Attempt 1 (2026-04-19) did not follow the protocol: corpus was pasted without the `verify these references - detailed depth, markdown output` prefix, so the skill's auto-trigger did not fire and Codex did a manual imperative reconstruction via Playwright against CrossRef + OpenAlex instead of running the skill. No `schema_version: 2` envelope was emitted. Codex self-admitted the miss. Attempt-1 parity sub-evidence (non-binding) was consistent with Claude's L1 (21 verified / 4 unverifiable / 5 traps; +1 delta on ref 19 Bengio NPLM within the ±1 tolerance). Two findings were triaged and fixed: **Finding A** — `.codex/skills/research-verification/` (stale v2.0.0) duplicated `.agents/skills/research-verification/` (v2.1.0) in Codex's `/skills`; `.codex/` copy removed locally (gitignored, no commit). **Finding B** — auto-match did not fire; fixed by prefix-first trigger pairing. Attempt 2 (2026-04-19) resolved Findings A and B cleanly (single `research-verification` loaded from `.agents/`, both `using-superpowers` and `research-verification` auto-fired) but introduced a new failure: **ground-truth + prior-transcript piggyback**. Codex read `plugin/skills/research-verification/examples/acceptance-ground-truth.json` (the oracle) and `docs/references/acceptance-runs/preflight-claude-code.md` (Claude's L1 verdict tally) during the run, then echoed Claude's numbers (22/3/3/1/1) verbatim after only three confirmatory web spot-checks. The attempt-1 Codex-native delta on ref 19 vanished — the fingerprint of verdicts coming from Claude's transcript rather than an independent resolver pass. Still no `schema_version: 2` envelope; Codex closed with "If you want, I can next emit the full envelope" — confirming none was produced. **Structural remediation landed before attempt 3 (2026-04-19):** (a) `acceptance-ground-truth.json` moved out of the shipped skill bundle into `docs/references/eval-harness/` so cold P1 installs no longer have the oracle in their plugin payload; (b) SKILL.md gained a top-of-skill "Execution Invariants" section forbidding reads of grader oracles or prior acceptance transcripts, with the full envelope made mandatory; (c) the retry prompt keeps explicit per-run forbid-rules as belt and suspenders. Third-attempt retry protocol captured in the transcript.
- [ ] Gemini CLI local preflight — PENDING

### Public cold-install gate

- [ ] Claude Code public run — PENDING
- [ ] Codex CLI public run — PENDING
- [ ] Gemini CLI public run — PENDING

The local preflight is a prerequisite to publish. The public runs are
the release-signoff evidence.
