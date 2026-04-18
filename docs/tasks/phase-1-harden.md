# Task — Phase 1: Hardening

**Phase:** 1.
**Goal:** take the shipped flagship from "it works" to "it's
industry-standard." Progressive disclosure, shared validators, proper
eval harness, one opt-in hook.
**Status:** PENDING (starts after Phase 0 exits cleanly + 24h soak).
Pre-gate prep that doesn't depend on v1 shipping has landed early
(2026-04-18): envelope validator, caching doc, eval-harness README.
**Budget:** 2–3 weeks.

## Entry check

- [ ] Phase 0 exited: three green acceptance transcripts, tag live,
      announce published, no P0/P1 open.
- [ ] 24-hour soak since announce completed.

## T1 — Progressive disclosure refactor

Goal: SKILL.md under 200 lines; heavy logic lives in
`references/` so it's loaded on-demand by the agent.

- [ ] Audit current `.claude/skills/research-verification/SKILL.md`
      line count and identify hot sections (resolver layer, depth
      modifiers, no-DOI scoring, envelope schema, trigger rules).
- [ ] Extract resolver layer details →
      `references/resolver-layer.md`.
- [ ] Extract depth-modifier behavior →
      `references/depth-modifiers.md`.
- [ ] Extract no-DOI candidate scoring →
      `references/no-doi-scoring.md`.
- [ ] Replace the extracted content in SKILL.md with short pointers
      ("see `references/resolver-layer.md` for the full resolver
      walk").
- [ ] Re-run mirror: `npm run mirror:skills`. Verify `.agents/` and
      `plugin/` mirrors pick up the new `references/` files.
- [ ] Re-run the Claude Code acceptance gate from a fresh session —
      outputs must be identical. Save new transcript as
      `docs/references/acceptance-runs/claude-code-phase1.md`.
- [ ] Update CHANGELOG: `[1.0.1]` — progressive-disclosure refactor,
      no functional change.

## T2 — Envelope validator as shared helper

Goal: one place that validates the `{meta, status, data, errors}`
envelope. Used by the skill, the acceptance harness, and eventually
the Atlas MCP.

- [x] Create `scripts/validators/envelope.mjs` — exports a
      `validateEnvelope(obj)` function returning `{ok, errors[]}`.
      (landed 2026-04-18)
- [x] Implement schema_version: 2 validation: shape, required
      fields, `verdicts_complete` invariant
      (`data.verdicts.length == meta.input_count`, with fallback to
      `data.citations_checked`). (landed 2026-04-18)
- [x] CLI mode: `node scripts/validators/envelope.mjs <file.json>` →
      exit 0 on valid, exit 1 with diagnostics on invalid. JSON-only
      for now; YAML envelopes convert to JSON before validating.
      (landed 2026-04-18)
- [x] Wire into prebuild: `npm run validate:envelopes` globs
      `docs/references/acceptance-runs/**/*.envelope.json` with
      `--allow-empty` so the hook is tolerant until the first real
      envelope lands. (landed 2026-04-18)
- [ ] Update acceptance-runs README with: "before finalizing a
      transcript, save the raw envelope as
      `<agent>.envelope.json` next to the `.md` transcript, then
      run `npm run validate:envelopes`." (follows the first real
      acceptance run)

## T3 — Eval harness formalized

Goal: every future skill gets a standard corpus + transcript + grader
setup.

- [x] Create `docs/references/eval-harness/README.md` — describes
      corpus layout, transcript template, grader expectations.
      (landed 2026-04-18)
- [x] Document the 30-ref verification corpus as the reference
      implementation of the pattern. (landed 2026-04-18)
- [x] Define grader signatures: inputs (envelope + ground truth),
      outputs (pass conditions as booleans + failure explanations).
      (landed 2026-04-18, documented in eval-harness README)
- [x] Write `scripts/grade-acceptance.mjs` that takes an envelope
      + ground-truth file, emits a pass/fail per condition.
      Single-envelope mode covers 5 conditions; `--parity` mode
      covers cross-agent parity. Fixture smoke tested via
      `npm run grade:acceptance:fixtures`.
      (landed 2026-04-18; sanity check on the three Phase 0
      transcripts is deferred until those exist.)

## T4 — Opt-in PostToolUse validator hook (PoC)

Goal: one working hook proves the pattern. Not required to ship.

- [x] Add PostToolUse hook at
      `plugin/hooks/validate-envelope-write.mjs` (renamed from
      `validate-resolver-response.mjs` — the hook matches `Write`
      tool calls targeting `*.envelope.json`, which is the
      actionable surface; "resolver response" was a misnomer for
      what we can actually hook). (landed 2026-04-18)
- [x] Default-OFF posture: ship no `hooks/hooks.json` in the plugin
      (Claude Code plugin hooks live there, not in `plugin.json`;
      presence == auto-register, absence == default-OFF). Users opt
      in by adding the documented snippet to their
      `.claude/settings.json`. (landed 2026-04-18)
- [x] Document opt-in procedure in `AGENTS.md` §Hooks. (landed 2026-04-18)
- [x] Add acceptance corpus entry at
      `docs/references/acceptance-runs/hook-validation.md` with one
      live-session prompt + four scripted stdin smoke tests covering
      all branches. (landed 2026-04-18)
- [x] Codex `[features] codex_hooks` is documented as opt-in in
      AGENTS.md but the plugin does not ship a codex hook — the same
      Node script is harness-portable if Codex users want to wire
      their own. (landed 2026-04-18)

## T5 — Prompt caching discipline doc

Goal: agent harnesses know how to cache the skill body.

- [x] Add `docs/references/caching.md`: the breakpoint goes on the
      loaded SKILL.md body; per-query references AFTER the
      breakpoint. 5-min TTL default, 1-hour with 2× write cost for
      long sessions. Max 4 breakpoints, 20-block lookback, order
      `tools → system → messages`. (landed 2026-04-18)
- [x] Reference from `AGENTS.md` so harnesses pick up the guidance.
      (landed 2026-04-18 — new `## Prompt caching` section)

## T6 — Bug backlog from Phase 0 soak

- [ ] Triage any P2/P3 bugs captured during the 24-hour soak.
- [ ] Fix only items that block Phase 2 scoping. Park the rest in
      GitHub issues with labels.

## Exit check

- [ ] SKILL.md body < 200 lines. Same output behavior verified by
      re-run.
- [ ] `scripts/validators/envelope.mjs` exists, is covered by a
      prebuild script, and runs cleanly on all three Phase 0
      transcripts.
- [ ] `docs/references/eval-harness/README.md` exists.
- [ ] One hook working end-to-end in Claude Code, default OFF.
- [ ] CHANGELOG promoted to `[1.0.1]` — `[1.0.2]` covering the
      hardening line items.

Exit triggers Phase 2: [`phase-2-literature-review.md`](phase-2-literature-review.md).

## Related

- Phase definition: [`../roadmap/phases.md`](../roadmap/phases.md) §Phase-1
- Validator contract: [`../roadmap/architecture.md`](../roadmap/architecture.md) §3
