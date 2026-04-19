# Announce draft — Research Verification flagship (2026-04)

> **Status:** DRAFT, copy reconciled 2026-04-17. Packaging, mirrors, landing page,
> and install commands are shipped and verified (lint, mirror-check, and build
> green). **Do not publish** until all three live acceptance runs under
> `docs/references/acceptance-runs/` are green and CHANGELOG moves the
> `[Unreleased]` section to a dated release tag. See the Release Gate section of
> `docs/plans/2026-04-17-next-milestone-plan.md` for the active checklist.

## TL;DR for each venue

### Anthropic Claude Code — GitHub Discussions

**Title:** Research Atlas ships a `research-verification` plugin — one skill, three agents

**Body:**

> Research Atlas ([researchatlas.info](https://researchatlas.info)) is a free
> toolkit of research workflows for AI-assisted academics. Today we're shipping
> the first flagship agent skill: **`research-verification`**.
>
> It takes a reference list (plain text, BibTeX, RIS, DOIs, URLs — any or all) and
> returns a structured per-reference verdict. DOI resolution via CrossRef primary
> + OpenAlex fallback, metadata cross-check (fuzzy title ≥ 0.85, first-author
> surname, year ±1), and a no-DOI candidate-scoring path against OpenAlex +
> Semantic Scholar. Every resolver hit records a hashed raw response so you can
> audit what the agent actually saw.
>
> It runs on Claude Code, Codex CLI, and Gemini CLI off of one canonical
> `SKILL.md`. No per-agent rewrites.
>
> Install on Claude Code:
>
> ```
> /plugin marketplace add HaroldZhong/Research-Atlas
> /plugin install research-verification@research-atlas
> ```
>
> Paste a reference list, say "verify these references," and you get a
> `{meta, data.verdicts[], errors}` envelope back. The 30-reference acceptance
> corpus and worked-example transcript are in the plugin bundle.
>
> Source: <link to repo>. Feedback welcome.

### r/AcademicAI / r/AskAcademia (selectively)

Same TL;DR, but lead with the problem (citation fabrication in AI-generated
writing, the ~40% rate reported in recent studies) rather than the plugin
mechanics.

### Hacker News — only if timing is right

Title: `Show HN: Verify AI-generated citations across Claude, Codex, and Gemini`

Lead with the cross-agent parity angle, not the skill's internals. HN reads the
comments — make sure the repo has an updated README, a working install, and
honest pass rates on the acceptance corpus before submitting.

## Do-not-publish checklist

- [ ] Claude Code acceptance run transcript committed in
      `docs/references/acceptance-runs/claude-code.md` with all 6 pass conditions
      green.
- [ ] Codex CLI transcript similarly green.
- [ ] Gemini CLI transcript similarly green.
- [ ] CHANGELOG `[Unreleased]` section promoted to a dated tag and semver bumped.
- [ ] `HaroldZhong/Research-Atlas` (or the future dedicated plugins repo) is
      public and the install commands in this post actually work from a cold machine.
      The marketplace identifier resolved by `/plugin install … @research-atlas`
      matches the `name` field in `.claude-plugin/marketplace.json`.
- [x] The "Install on your agent" section on the homepage shows the exact same
      commands as this post. (Verified 2026-04-17 — Claude tab, Codex tab, and
      Gemini tab including the `--path .agents/skills/research-verification`
      flag.)
- [ ] Link-check: every URL in this post resolves 200, including the acceptance
      corpus, the worked example, and the audit report.

When all are checked: tag release, publish to Anthropic Discussions first
(lowest-risk audience), wait ~24h for feedback, iterate if needed, then consider
Reddit + HN.
