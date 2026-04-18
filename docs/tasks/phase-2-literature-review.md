# Task — Phase 2: `literature-review` Promotion

**Phase:** 2.
**Goal:** promote `literature-review` from Tier 2 (active promotion
target — fills the missing tool wiring and acceptance corpus) to
Tier 1 (publishable) with the same rigor `research-verification` v1.0
set.
**Status:** PENDING.
**Budget:** 3–4 weeks.

## Decision gate at entry

The first day of Phase 2 opens the **`literature-review` vs.
`paper-citation-ledger` carve-out** gate in
[`../roadmap/decision-gates.md`](../roadmap/decision-gates.md). Do the
scoping pass below, then write the decision.

- [ ] Scope `literature-review`'s four tasks (search, citation_audit,
      gap_analysis, synthesis). Flag which are tool-backed today,
      which are prompt-only.
- [ ] Estimate acceptance-corpus effort: 3 manuscripts + 2
      systematic-review corpora, ground-truth labels per task.
- [ ] Write decision in `decision-gates.md` "Decisions log". If
      "full promotion", continue below. If "carve-out", replace this
      plan with a narrower `paper-citation-ledger` one.

## T1 — Tool wiring

Goal: every task in `literature-review` has real tool paths, not
prompt-only logic.

- [ ] **search task:** wire to OpenAlex (primary) + Semantic Scholar
      (fallback). Query normalization, pagination, rate-limit
      handling. Reuse connectors from Evidence Runtime if extracted
      by then; otherwise inline and refactor in Phase 3.
- [ ] **citation_audit task:** import shape from
      `research-verification`. Call the envelope validator. The
      audit is a verification run wrapped in a per-manuscript
      reporting layer.
- [ ] **gap_analysis task:** wire to OpenAlex topical clustering
      + citation network. Identify under-cited topics. Output
      structured, not prose-only.
- [ ] **synthesis task:** evidence-table generation. Pull from search
      results + citation network. Output one `{meta, status, data,
      errors}` envelope with a structured evidence table in
      `data.evidence`.
- [ ] **Zotero MCP integration:** if a user has Zotero MCP running,
      read their library as the canonical reference set for the
      citation_audit task.

## T2 — Acceptance corpus

Goal: locked corpus that exercises all four tasks with ground truth.

- [ ] Curate 3 manuscripts across domains (bio, ML, social science).
      Each with annotated ground truth for citation_audit verdicts.
- [ ] Curate 2 systematic-review corpora. Each with a known set of
      "in scope" and "out of scope" papers for the search task.
- [ ] Curate 1 gap_analysis ground-truth case with known
      under-covered topics for a well-studied area.
- [ ] Save all corpus files under
      `.claude/skills/literature-review/examples/corpus/`.
- [ ] Add to mirror whitelist so the corpus ships with the plugin.

## T3 — Six pass conditions

Adapt `research-verification`'s framework.

- [ ] Define per-task pass conditions:
  - **search:** recall ≥ 0.8, precision ≥ 0.75 against ground-truth
    corpus.
  - **citation_audit:** same as `research-verification`'s corpus-wide
    recall/precision bars.
  - **gap_analysis:** identifies ≥ 70% of the known gaps.
  - **synthesis:** evidence table passes envelope validator + all
    cited papers verifiable via search+resolver chain.
- [ ] Latency: end-to-end ≤ 10 min on a residential connection for
      the full corpus run (4× the verification budget — literature
      review is heavier).
- [ ] Cross-agent parity: semantically equivalent verdicts and
      evidence tables across Claude / Codex / Gemini.

Document all six in `docs/references/acceptance-runs/README.md` under
a new "literature-review" section.

## T4 — Three-agent acceptance runs

Mirror the Phase 0 protocol.

- [ ] Claude Code acceptance run. Save transcript to
      `docs/references/acceptance-runs/literature-review-claude-code.md`.
- [ ] Codex CLI acceptance run. Transcript to
      `...-codex.md`.
- [ ] Gemini CLI acceptance run. Transcript to
      `...-gemini.md`.
- [ ] Cross-agent parity fill-in.
- [ ] All six conditions green on all three.

## T5 — Plugin + marketplace updates

- [ ] Add `literature-review` to
      `.claude-plugin/marketplace.json` as a second plugin entry.
- [ ] Update plugin manifest at `plugin/.claude-plugin/plugin.json`
      (or create a second plugin directory if co-installing from one
      marketplace entry needs separate plugin manifests).
- [ ] Update landing-page "Install on your agent" block with the
      new install command per agent.
- [ ] Update `AGENTS.md` with the new skill's invocation mechanics
      per agent.

## T6 — Announce

- [ ] Draft `docs/announce-literature-review-<date>.md` following
      the Phase 0 announce structure.
- [ ] Promote CHANGELOG: `[1.1.0] — <date>` with the new skill.
- [ ] Tag: `v1.1.0`.
- [ ] Publish to Anthropic Discussions first. 24-hour soak.
- [ ] Reddit + HN consideration after soak.

## Exit check

- [ ] `literature-review` v1.0 installable via the marketplace.
- [ ] Three green acceptance transcripts.
- [ ] No P0/P1 bugs after 24-hour soak.
- [ ] CHANGELOG `[1.1.0]` live.

Exit triggers Phase 3: [`phase-3-runtime-and-split.md`](phase-3-runtime-and-split.md).

## Related

- Phase definition: [`../roadmap/phases.md`](../roadmap/phases.md) §Phase-2
- Decision gate: [`../roadmap/decision-gates.md`](../roadmap/decision-gates.md) §literature-review-vs-paper-citation-ledger
- Evaluation report: `.claude/skills/EVALUATION_REPORT.md` (current
  `literature-review` v2.0.0 scorecard; Phase 2 is the step that
  earns v1.0 publish-readiness on top of that scorecard).
