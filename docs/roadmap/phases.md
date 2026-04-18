# Phases — 12-month plan

**Status:** ACTIVE, 2026-04-17. Horizon: Q2 2026 → Q1 2027.

Six phases, sized so each ends with a concrete shippable artifact or a
decision gate. No phase auto-advances — entry criteria are explicit.
Decision points that can reroute the plan are cross-linked to
[`decision-gates.md`](decision-gates.md).

## Phase overview

| # | Name | Duration | Ends with |
|---|---|---|---|
| 0 | Release Gate v1 | ~1 week | `research-verification` v1.0 shipped, announce live |
| 1 | Hardening | 2–3 weeks | Evaluation harness + progressive disclosure + envelope validator shipped |
| 2 | `literature-review` promotion | 3–4 weeks | Tier 1 `literature-review` v1.0 shipped with its own acceptance corpus |
| 3 | Runtime + repo split gate | 2–3 weeks | Evidence Runtime extracted, Phase-3 decision on org split made |
| 4 | `manuscript-review` promotion | 3–4 weeks | Tier 1 `manuscript-review` v1.0 shipped |
| 5 | Atlas MCP pilot + `data-analysis` feasibility | 4–6 weeks | Read-only MCP service running; data-analysis go/no-go |
| 6 | Task-first website rebuild | parallel with 4–5 | Home page reframes around outcomes, run history UI |

Parallel track: [`track-org-setup.md`](../tasks/track-org-setup.md) runs
whenever convenient between Phase 0 and Phase 3. Does not gate any
phase.

## Phase 0 — Release Gate v1

**Entry criteria:** plugin manifest shipped, mirrors in sync,
landing-page install block live, announce draft ready. **All met today
(2026-04-17).**

**Scope:**
- Run the 30-reference acceptance corpus live on Claude Code, Codex,
  Gemini. Capture transcripts.
- Promote `CHANGELOG.md` `[Unreleased]` → `[1.0.0] — <date>`.
- Tag release.
- Publish announce to Anthropic Discussions (24-hour soak before other
  venues).

**Exit criteria:**
- Three green acceptance transcripts in
  `docs/references/acceptance-runs/{claude-code,codex,gemini}.md`.
- Announce live on at least one venue.
- No P0/P1 bugs open from first 24 hours.

**Task checklist:** [`../tasks/release-gate-v1.md`](../tasks/release-gate-v1.md).

**Decision gate at exit:** none. Phase 1 follows automatically.

## Phase 1 — Hardening

**Entry criteria:** Phase 0 exited cleanly. At least 24 hours elapsed
since announce for feedback to settle.

**Scope:**
- **Progressive disclosure refactor.** Move SKILL.md bulk into
  `references/resolver-layer.md`, `references/depth-modifiers.md`,
  `references/no-doi-scoring.md`. Keep SKILL.md body under 200 lines.
- **Envelope validator as a shared helper.** Move the ad-hoc schema
  logic into `scripts/validators/envelope.mjs`. Expose as a library for
  skills and as a CLI for the acceptance harness. Wire into the
  mirror-check so envelope drift fails the build.
- **Evaluation harness formalized.** Define per-skill corpus layout,
  transcript template, graders. Keep the 30-ref verification corpus as
  the reference implementation.
- **One opt-in PostToolUse validator hook** (proof of concept). Default
  OFF. Claude Code only. Codex mirror documentation-only (Codex hooks
  are experimental and Windows-disabled).
- **Prompt caching discipline.** Document cache-breakpoint placement in
  `AGENTS.md` so agent harnesses can implement.

**Exit criteria:**
- `research-verification` SKILL.md body < 200 lines, references split.
- `scripts/validators/envelope.mjs` exists and is used by acceptance
  runs.
- Per-skill eval harness doc in
  `docs/references/eval-harness/README.md`.
- Hook PoC lands in `plugin/hooks/` with an acceptance case.

**Task checklist:** [`../tasks/phase-1-harden.md`](../tasks/phase-1-harden.md).

## Phase 2 — `literature-review` promotion

**Entry criteria:** Phase 1 exited. Evidence Runtime primitives
(validator, transcript template) reusable from another skill.

**Scope:**
- **Tool wiring** for `literature-review`'s four tasks (search,
  citation_audit, gap_analysis, synthesis) against OpenAlex +
  Semantic Scholar + Zotero MCP.
- **Acceptance corpus** — 3 manuscripts + 2 systematic-review
  corpora, ground-truth labels for each task.
- **Six pass conditions** paralleling `research-verification`'s
  (recall, precision, evidence, format, latency, cross-agent parity).
- **Three-agent acceptance run** — Claude Code, Codex, Gemini
  transcripts saved alongside the verification ones.
- **Announce:** plugin #2 ships. Landing page gets an updated
  install block. CHANGELOG promoted to 1.1.0.

**Exit criteria:**
- `literature-review` v1.0 published in the marketplace (still
  `research-atlas` identifier).
- Three green acceptance transcripts.
- No P0/P1 bugs.

**Task checklist:** [`../tasks/phase-2-literature-review.md`](../tasks/phase-2-literature-review.md).

**Decision gate at exit:** **Phase 3 split decision.** With plugin #2
real, reassess whether to split the skills out of the monorepo. See
[`decision-gates.md`](decision-gates.md) §Phase-3-split.

## Phase 3 — Runtime + repo split gate

**Entry criteria:** Phase 2 exited.

**Scope:**
- **Decide:** split skills to `researchatlas/skills`? Answer now, with
  real two-plugin data. See [`decision-gates.md`](decision-gates.md).
- **Extract Evidence Runtime.** Create the
  `@research-atlas/evidence-runtime` package (same org whether or not
  skills split). Move envelope validator, provenance model primitives,
  connector stubs for CrossRef/OpenAlex/Semantic Scholar/Zotero.
- **Migrate** `research-verification` and `literature-review` to
  import from runtime. No duplicate envelope logic.
- **Corpora repo (conditional).** If corpus curation is the bottleneck
  by this point, pull corpora out to `researchatlas/corpora`.

**Exit criteria:**
- Runtime published to npm (or published via GitHub Packages
  provisionally).
- Both shipped skills import from runtime; no drift.
- Split decision made and documented in
  [`decision-gates.md`](decision-gates.md) §Phase-3 with a dated
  rationale.

**Task checklist:** [`../tasks/phase-3-runtime-and-split.md`](../tasks/phase-3-runtime-and-split.md).

## Phase 4 — `manuscript-review` promotion

**Entry criteria:** Phase 3 exited. Evidence Runtime stable.

**Scope:**
- **Reframe from "reviewer simulation" to "inline evidence audit
  against reviewer checklists."** See
  [`north-star.md`](north-star.md) caveat 2. No reviewer-style prose
  generation.
- **Tool wiring** — checklist application, inline citation verification
  (reuses `research-verification`), claim-citation alignment scoring.
- **Acceptance corpus** — 5 manuscripts with ground-truth reviewer
  checklists filled in by domain experts.
- **Six pass conditions** adapted for manuscript-scope.
- **Three-agent acceptance run.**

**Exit criteria:**
- `manuscript-review` v1.0 published.
- CHANGELOG promoted to 1.2.0.
- No reviewer-impersonation output in any acceptance transcript.

**Task checklist:** [`../tasks/phase-4-manuscript-review.md`](../tasks/phase-4-manuscript-review.md).

## Phase 5 — Atlas MCP pilot + `data-analysis` feasibility

**Entry criteria:** three Tier 1 skills shipped. Evidence Runtime
stable. Usage signal from at least 100 installs across agents.

**Scope:**
- **Atlas MCP (read-only pilot).** Expose verdict-ledger and
  evidence-graph lookups via MCP. Hosted on Vercel Fluid Compute.
  Differentiator is the provenance layer, not the raw data. See
  [`architecture.md`](architecture.md) §4.
- **`data-analysis` feasibility assessment.** Evaluate sandbox tooling:
  Vercel Sandbox vs. python MCP vs. user-local Jupyter. Outcome is a
  recommendation + go/no-go, not the skill shipping. See
  [`decision-gates.md`](decision-gates.md) §data-analysis-feasibility.

**Exit criteria:**
- MCP pilot deployed at `mcp.researchatlas.info` (or subpath).
- One external agent (e.g. Claude Research) successfully queries the
  MCP in a recorded session.
- data-analysis decision documented.

**Task checklist:** [`../tasks/phase-5-atlas-mcp-pilot.md`](../tasks/phase-5-atlas-mcp-pilot.md).

## Phase 6 — Task-first website rebuild (parallel with 4–5)

**Entry criteria:** at least 2 shipped Tier 1 skills. Can overlap with
Phases 4–5; does not block them.

**Scope:**
- **Reframe home page** around outcomes (Verify Sources, Build
  Literature Review, Audit Manuscript, Check Data Analysis).
- **Run-history UI** (requires auth + storage). Needed if/when Atlas
  MCP is writeable (Phase 6+ — not pilot phase).
- **Evidence ledger UI** — reader opens a manuscript and sees each
  citation's verdict inline. Requires Atlas MCP read path.

**Exit criteria:**
- Home page routes to named workflows, not a prompt list.
- Auth story picked if run history ships.

**Task checklist:** TBD (not yet written; create at Phase 4 midpoint).

## Things that are explicitly not in this 12-month window

- `research-compliance` as a shipped skill. Requires journal-specific
  tool paths. Backlog until there's an external verifier.
- `preregistration` as a shipped skill. Same reason.
- `latex-polish` promotion. Low leverage relative to the four above.
- Any paid tier. Atlas is free + open through at least this window.
- Any closed-source layer. Per [`north-star.md`](north-star.md), every
  layer ships public.

## Related docs

- Vision: [`north-star.md`](north-star.md)
- Architecture: [`architecture.md`](architecture.md)
- Go/no-go points: [`decision-gates.md`](decision-gates.md)
- Tasks per phase: [`../tasks/`](../tasks/)
