# Task — Phase 4: `manuscript-review` Promotion

**Phase:** 4.
**Goal:** ship `manuscript-review` v1.0 as the third Tier 1 skill,
framed as **inline evidence audit against reviewer checklists** —
explicitly NOT reviewer-style prose generation.
**Status:** PENDING.
**Budget:** 3–4 weeks.

## Positioning guardrail (read first)

`manuscript-review` is a high-risk product surface because the easy
version of it — "write like a reviewer" — is exactly the
hallucination-prone behavior Atlas positions against. This task
enforces a strict framing:

**What `manuscript-review` DOES:**
- Load a manuscript, parse claims + citations.
- Run reviewer-checklist rubrics over the manuscript (STROBE,
  CONSORT, NIH Rigor and Reproducibility, PRISMA, venue-specific).
- Inline-audit citations via `research-verification` under the
  hood.
- Score claim-citation alignment.
- Emit a structured report: pass/fail per rubric item + evidence
  citations.

**What `manuscript-review` DOES NOT DO:**
- Generate reviewer-style prose critique ("This paper's methodology
  is weak because...").
- Recommend accept/reject decisions.
- Simulate a named reviewer persona.
- Write freeform reviewer comments.

If the scoping work drifts toward the DOES-NOT-DO list, stop and
re-read this section.

## T1 — Tool wiring

- [ ] **Manuscript parser.** Accept PDF, LaTeX source, Markdown,
      plain text. Extract: claims (annotated or inferred), citations
      (with provenance pointers), sections, figures/tables.
- [ ] **Checklist application layer.** For each checklist item,
      apply a deterministic check (presence/absence, structured
      match) OR emit a "needs manual review" marker. Do not
      free-form-interpret.
- [ ] **Inline verification integration.** Every cited reference in
      the manuscript gets run through `research-verification`.
      Results feed the envelope's per-citation verdict.
- [ ] **Claim-citation alignment scorer.** For each claim with a
      citation, check that the citation's paper actually supports
      the claim. Uses `research-verification`'s alignment_audit task.

## T2 — Acceptance corpus

- [ ] Curate 5 manuscripts across domains. For each:
  - [ ] Annotated ground-truth reviewer checklist answers (domain
        expert fills these in offline).
  - [ ] Known citation-alignment issues (intentional or
        unintentional).
  - [ ] Known checklist failures.
- [ ] Save under
      `.claude/skills/manuscript-review/examples/corpus/` with
      explicit ground-truth YAML alongside each manuscript.
- [ ] Label a subset as "trap" cases (manuscripts that look
      compliant but fail a specific checklist item).

## T3 — Six pass conditions

- [ ] **Recall:** detects ≥ 80% of the known checklist failures in
      the corpus.
- [ ] **Precision:** false-positive rate on compliant items ≤ 10%.
- [ ] **Evidence:** every flagged item has an evidence pointer
      (section + paragraph + optional quote).
- [ ] **Format:** envelope schema_version: 2, checklist-item table
      in `data.checklist`, citation verdicts in `data.citations`.
- [ ] **Latency:** end-to-end ≤ 15 minutes for a single-manuscript
      run on residential connection.
- [ ] **Cross-agent parity:** semantically equivalent checklist
      verdicts across Claude / Codex / Gemini (±1 on edge cases).
- [ ] **Behavioral guardrail (new):** zero reviewer-impersonation
      output in the final envelope. No "I think this paper is...",
      no "this is a weak paper", no accept/reject recommendation.
      Violations auto-fail the run regardless of other scores.

## T4 — Three-agent acceptance runs

- [ ] Claude Code. Transcript →
      `docs/references/acceptance-runs/manuscript-review-claude-code.md`.
- [ ] Codex CLI. Transcript → `...-codex.md`.
- [ ] Gemini CLI. Transcript → `...-gemini.md`.
- [ ] Cross-agent parity fill-in.
- [ ] Behavioral guardrail check on all three — grep transcripts for
      reviewer-style prose patterns. Any hit is a failing transcript.

## T5 — Plugin + marketplace

- [ ] Add `manuscript-review` to
      `.claude-plugin/marketplace.json` as plugin entry #3.
- [ ] Update per-agent mirrors.
- [ ] Update landing page install block.
- [ ] Update `AGENTS.md`.

## T6 — Announce

- [ ] Draft announce at
      `docs/announce-manuscript-review-<date>.md`.
  - [ ] Lead with the positioning guardrail. The announce should
        explicitly say Atlas does NOT write reviewer critiques.
        Preempt the inevitable "oh cool, an AI peer reviewer"
        misread.
- [ ] Promote CHANGELOG: `[1.2.0]`.
- [ ] Tag `v1.2.0`.
- [ ] Anthropic Discussions first. 24-hour soak. Watch for
      misread-in-the-wild comments.

## Exit check

- [ ] `manuscript-review` v1.0 installable via marketplace.
- [ ] Three green acceptance transcripts.
- [ ] Behavioral guardrail check clean.
- [ ] No P0/P1 bugs after 24-hour soak.
- [ ] CHANGELOG `[1.2.0]` live.

Exit triggers Phase 5:
[`phase-5-atlas-mcp-pilot.md`](phase-5-atlas-mcp-pilot.md).

## Related

- Phase definition: [`../roadmap/phases.md`](../roadmap/phases.md) §Phase-4
- Positioning guardrail source:
  [`../roadmap/north-star.md`](../roadmap/north-star.md) caveat 2
- Evaluation report on current `manuscript-review` v2.0.0:
  `.claude/skills/EVALUATION_REPORT.md`
