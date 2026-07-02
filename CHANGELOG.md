# Changelog

All notable changes to Research Atlas land here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[SemVer](https://semver.org/spec/v2.0.0.html) where applicable.

## [Unreleased]

### Added — 2026-07-02 wave (PRs #5–#11)

- **Provenance & freshness system** — every prompt, guide, and workflow carries
  `{source, sourceUrl?, owner, status, addedAt, reviewedAt?}` metadata replacing
  the misleading batch timestamps. `npm run validate:content` (zero new
  dependencies) enforces unique ids, provenance shape, no future/stale dates,
  resolvable workflow `promptIds`, taxonomy integrity, and
  `{{placeholder}}` ↔ `variables[]` parity; wired into `prebuild`.
- **Prompt quality audit** — `PROMPT_RUBRIC.md` (8 criteria) published; all 106
  prompts audited and statused (`reviewed`, 2026-07-02), 43 fixed in place:
  anti-fabrication guardrails on source-facing prompts, honest personas,
  variable-drift repairs, translation artifacts removed. Status badge + source
  shown on prompt details.
- **`research-verification` v2.2.0** — duplicate references now produce
  mirrored verdict entries (`-dupN` ids, `duplicate_of` errors) instead of
  being dropped, resolving the `input_count`/`verdicts_complete` contradiction;
  retraction surfacing from resolver responses; structured `data.claims`
  contract for claim-level tasks; validator gains reference-id uniqueness,
  retraction shape, and claims checks; 9 new fixtures plus
  `npm run test:validator:fixtures` (first harness asserting invalid fixtures
  fail).
- **Acceptance corpus v2** — 32 references (was 30): entry 31 duplicates entry 1
  (duplicate-contract trap), entry 32 is a real retracted paper (Wakefield 1998,
  doi:10.1016/S0140-6736(97)11096-0). Ground truth v2 adds `duplicate_handling`
  and `retraction_flagged` pass conditions; the grader enforces both when a
  ground truth declares them (mini fixtures + smoke cases included).
- **10 externally adapted prompts** (pre-submission audit ladder, claim–evidence
  map, revision altitude ladder, citation hygiene/support, editor first-pass,
  claim-strength audit, AI failure-mode self-check, terminology ledger, AI-use
  disclosure) with per-prompt upstream attribution; `INTEGRATIONS.md` documents
  the full integration matrix and license rules (Apache-2.0/MIT adapted with
  attribution; CC BY-NC repos used as design references only).
- **Library & workflow UX** — variable inputs driven by `PromptVariable`
  metadata (multiline, required, descriptions, defaults), localStorage
  persistence for sandbox values and workflow progress (with reset),
  Copy-as-Markdown export, and a real `/skills` page with true install flows
  (Claude Code / Codex CLI) replacing the orphaned placeholder.
- **GitHub Actions CI** — lint, full build gate, grader fixtures, and hook smoke
  on every PR and push to main.

### Changed — 2026-07-02 wave

- Plain "Copy to Clipboard" now appends the prompt's `Constraints:` /
  `Output requirements:` lines so guardrails reach the model (previously they
  lived only in page metadata).
- Hero subhead and library copy toned down to what the product actually does
  ("citation-disciplined drafts", "curated prompts").
- **Dropped Gemini CLI** as a supported surface (docs, `/skills` page, home
  install section, `.gitignore`/eslint ignores). Supported harnesses are now
  Claude Code + Codex CLI; parity grading requires 2+ envelopes.
- **`research-verification` resolver hardening** (v2.2.0): DataCite/arXiv
  tertiary resolver; bounded retry + resolver-outage → `unverifiable` (never
  `fabricated` on a mere outage); blank-resolver-field → `partially_supported`
  not a title mismatch; `RETRACTED:` title-prefix detection (and stripped before
  the title cross-check); the task-section mutual-exclusivity contract is now
  enforced by the validator (citation tasks reject `claims`, claim tasks reject
  `verdicts`).
- **PC6 latency gate** is now a per-reference active-time budget (35 s/ref, so
  18.7 min for the 32-ref corpus, 5.8 min for a 10-ref list) instead of a flat
  5 minutes — it scales with corpus size and encodes the real per-reference
  resolver cost.
- **Committed v2 acceptance evidence**: `scripts/acceptance/envelopes/` now holds
  the 32-reference v2 runs on Claude Code + Codex CLI (skill v2.2.0), replacing
  the v1 (30-item) artifacts. Both grade fully pass — including the per-reference
  latency budget — with 32/32 cross-agent parity.

### Known gaps — 2026-07-02 wave

- `verified` prompt status remains reserved: no prompt has been exercised
  against a live model yet.

---

### Added

- **Flagship `research-verification` skill, v2.1.0** — end-to-end reference verification
  built around the VERIFY framework. Ingest/parse step accepts plain text, BibTeX, RIS,
  bare DOI lists, and URL lists. DOI resolver layer uses CrossRef primary and OpenAlex
  fallback, hashing raw resolver responses for audit. Metadata cross-check gates
  `verified` verdicts on fuzzy title similarity ≥ 0.85, first-author surname match, and
  year within ±1. No-DOI references flow through OpenAlex + Semantic Scholar candidate
  scoring with a 0.7 confidence floor. Output is a machine-readable
  `{meta, status, data.verdicts[], errors}` envelope (schema_version 2) plus a
  human-readable report. Ships with a worked-example transcript and a locked 30-reference
  acceptance corpus (25 real + 5 traps) covering all six milestone pass conditions.
- **Mechanical skill mirror** — `scripts/mirror-skills.mjs` rewrites the canonical
  `.claude/skills/` tree into `.agents/skills/` (shared open-agent path for Codex)
  and `plugin/skills/` (Claude Code plugin packaging). `npm run mirror:skills`
  to sync; `npm run mirror:skills:check` as a CI-friendly drift check; wired into
  `prebuild` so stale mirrors fail the build.
- **Claude Code plugin manifest** — `plugin/.claude-plugin/plugin.json` and
  `.claude-plugin/marketplace.json` at the repo root make this repo installable as
  its own single-plugin marketplace (named `research-atlas`) via
  `/plugin marketplace add ResearchAtlas/Research-Atlas` →
  `/plugin install research-verification@research-atlas`. The marketplace
  identifier is `research-atlas` regardless of the hosting repo name.
- **Repo-root `AGENTS.md`** — onboarding guide for Codex / Cursor / Aider / Copilot /
  Zed. Documents the canonical-skill contract, per-agent invocation mechanics (Claude
  auto-select, Codex native discovery + `$research-verification`), and the
  `codex_hooks = true` opt-in for users who want lifecycle hooks.
- **"Install on your agent" landing section** on the home page — Claude / Codex
  install block with the canonical install command for each agent.
- **Selective `.gitignore` tunnel** — `.claude/skills/research-verification/`,
  `.agents/skills/research-verification/`, and the current milestone plan are
  published; the rest of `.claude/`, `.agents/`, `.codex/`, and
  `docs/plans/` stays private.
- **Acceptance-run protocol** — the six pass conditions, per-agent invocation
  steps, and transcript conventions that govern the release gate.

### Changed

- Duplicate-titled prompts in the library now carry a framework suffix — both
  `(TIDD-EC)` and `(COSTAR)` variants of `Figure Caption Generator`,
  `Table Caption Generator`, and `Experimental Results Analysis` are now distinct
  in the library list.
- Hero subhead reads "evidence-grade literature reviews, verified citations, and
  reproducible analyses" — replaces the previous "prompt workflow" framing to match
  the research-verification positioning.
- Output envelope schema version bumped to **2**; adds `data.verdicts[]` with
  per-reference `{reference_id, verdict, confidence, evidence}` blocks. Schema
  version 1 payloads are no longer emitted.

### Fixed

- Counter animation on home-page stat blocks verified working after the `useInView`
  removal across Chrome + Safari + Firefox, desktop + 390×844 mobile.

### Known gaps

- Track B7 live acceptance run on Claude Code is pending — the corpus and harness
  are locked, the run itself is the release gate.
- Track C6 cross-agent acceptance runs on Codex CLI are pending in the local
  release-workflow materials.
- Public dedicated marketplace/plugin repo (e.g. `researchatlas/skills`) has not
  been created yet; until then, the plugin installs from the monorepo at
  `ResearchAtlas/Research-Atlas`, which is registered as a single-plugin
  marketplace identified as `research-atlas`.

---

## Earlier history

This changelog starts with the v1.0 milestone (research-verification flagship).
Earlier changes are tracked in `git log` only.
