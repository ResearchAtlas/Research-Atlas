# Task — Release Gate v1

**Phase:** 0.
**Goal:** ship `research-verification` v1.0 across Claude Code, Codex,
Gemini with a live acceptance-run gate.
**Status:** ACTIVE, 2026-04-17.

## Pre-flight

- [x] Plugin manifest at `.claude-plugin/marketplace.json` (identifier
      `research-atlas`).
- [x] Mechanical mirror `.claude/skills/` → `.agents/skills/` and
      `plugin/skills/` via `npm run mirror:skills`; drift check in
      `prebuild`.
- [x] Landing-page "Install on your agent" block with Claude / Codex /
      Gemini tabs.
- [x] Announce draft at [`../announce-draft-2026-04.md`](../announce-draft-2026-04.md).
- [x] Run-commands doc at
      [`../references/acceptance-runs/RUN-COMMANDS.md`](../references/acceptance-runs/RUN-COMMANDS.md).
- [x] Local green baseline: `npm run lint`, `npm run mirror:skills:check`,
      `npm run build`.

## Acceptance gate (RG1–RG5)

### RG1 — Claude Code acceptance run

- [ ] Open a fresh `claude` session in the repo root.
- [ ] (Recommended) Install via plugin:
      `/plugin marketplace add HaroldZhong/Research-Atlas` then
      `/plugin install research-verification@research-atlas`.
- [ ] Run `/skills` to confirm the plugin is active.
- [ ] Paste the full contents of
      `.claude/skills/research-verification/examples/acceptance-corpus.txt`.
- [ ] Issue trigger: `verify these references — detailed depth, markdown output`.
- [ ] Stopwatch start at Enter, stop at final envelope.
- [ ] Save transcript to
      `docs/references/acceptance-runs/claude-code.md` using the
      template in the acceptance-runs README.
- [ ] All six pass conditions green. If any fail, stop — do not retry
      inside the gate. Open an issue, fix in canonical SKILL.md,
      re-sync mirrors, rerun from a fresh session.

### RG2 — Codex CLI acceptance run

- [ ] Fresh `codex` session in the repo root.
- [ ] Run `/skills` — confirm `research-verification` appears.
- [ ] Paste corpus + trigger.
- [ ] Do NOT set `[features] codex_hooks = true`.
- [ ] Save transcript to `docs/references/acceptance-runs/codex.md`.
- [ ] All six pass conditions green.

### RG3 — Gemini CLI acceptance run

- [ ] One-time install if not already:
      `gemini skills install https://github.com/HaroldZhong/Research-Atlas --path .agents/skills/research-verification`.
- [ ] Verify `gemini skills list` shows `research-verification`.
- [ ] Fresh `gemini` session in repo root.
- [ ] Paste corpus + trigger. Approve consent prompt.
- [ ] Save transcript to `docs/references/acceptance-runs/gemini.md`.
- [ ] All six pass conditions green.

### RG4 — Cross-agent parity fill-in

- [ ] Compare verdicts per-reference across three transcripts.
- [ ] Allow ±1 on known edge cases (Watson-Crick, Turing, Shannon
      have pre-modern DOI schemas some resolvers don't index).
- [ ] Fill in condition 6 (cross-agent parity) in all three
      transcripts.
- [ ] Update `docs/references/acceptance-runs/README.md` status — flip
      the three `[ ]` checkboxes to `[x]` with dates.

### RG5 — Release mechanics

- [ ] Promote `CHANGELOG.md` `[Unreleased]` → `[1.0.0] — <run date>`.
- [ ] Tag: `git tag v1.0.0 -m "research-verification v1.0.0"`.
- [ ] Push tag: `git push origin v1.0.0`.
- [ ] Flip all `[ ]` items in
      [`../announce-draft-2026-04.md`](../announce-draft-2026-04.md)
      `Do-not-publish checklist` → `[x]`.
- [ ] Link-check every URL in the announce post (200 status).
- [ ] Publish announce to Anthropic Claude Code Discussions.
- [ ] 24-hour soak — monitor for P0/P1 bugs, do not publish to other
      venues yet.
- [ ] After 24h green: consider Reddit (r/AcademicAI, r/AskAcademia) and
      Hacker News.

## If a run fails

- **Do not patch-and-retry inside the gate.** A patched-mid-gate
  transcript is a lie.
- Record the failure transcript. Note which of the six conditions
  failed and why.
- Open a GitHub issue with the failing envelope attached.
- Fix in canonical `.claude/skills/research-verification/SKILL.md`.
  Re-sync mirrors: `npm run mirror:skills`.
- Restart from RG1 in a fresh session of the affected agent. All
  three agents stay in scope even if only one failed — parity is a
  condition.

## Exit check

- [ ] Three green transcripts in
      `docs/references/acceptance-runs/`.
- [ ] Tag `v1.0.0` on `origin`.
- [ ] Announce live on Anthropic Discussions.
- [ ] No P0/P1 bugs open after 24-hour soak.

Exit triggers Phase 1: [`phase-1-harden.md`](phase-1-harden.md).

## Related

- Run commands: [`../references/acceptance-runs/RUN-COMMANDS.md`](../references/acceptance-runs/RUN-COMMANDS.md)
- Pass conditions: [`../references/acceptance-runs/README.md`](../references/acceptance-runs/README.md)
- Phase definition: [`../roadmap/phases.md`](../roadmap/phases.md) §Phase-0
- Announce copy: [`../announce-draft-2026-04.md`](../announce-draft-2026-04.md)
