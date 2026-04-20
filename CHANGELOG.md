# Changelog

All notable changes to Research Atlas land here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[SemVer](https://semver.org/spec/v2.0.0.html) where applicable.

## [Unreleased]

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
  `.claude/skills/` tree into `.agents/skills/` (shared open-agent path for Codex +
  Gemini) and `plugin/skills/` (Claude Code plugin packaging). `npm run mirror:skills`
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
  auto-select, Codex native discovery + `$research-verification`, Gemini
  prompt-driven `activate_skill`), and the `codex_hooks = true` opt-in for users who
  want lifecycle hooks.
- **"Install on your agent" landing section** on the home page — three-tab Claude /
  Codex / Gemini install block with the canonical install command for each agent.
- **Selective `.gitignore` tunnel** — `.claude/skills/research-verification/`,
  `.agents/skills/research-verification/`, and the current milestone plan are
  published; the rest of `.claude/`, `.agents/`, `.codex/`, `.gemini/`, and
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
- Track C6 cross-agent acceptance runs on Codex and Gemini CLI are pending in the
  local release-workflow materials.
- Public dedicated marketplace/plugin repo (e.g. `researchatlas/skills`) has not
  been created yet; until then, the plugin installs from the monorepo at
  `ResearchAtlas/Research-Atlas`, which is registered as a single-plugin
  marketplace identified as `research-atlas`.

---

## Earlier history

This changelog starts with the v1.0 milestone (research-verification flagship).
Earlier changes are tracked in `git log` only.
