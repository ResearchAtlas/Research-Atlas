# External Integrations & Attribution

Research Atlas selectively adapts patterns from external open research-skill
collections. This file is the integration matrix: what we studied, what we
adapted, under which license terms, and where it landed. We never bulk-copy
external skill trees; adaptation means rewriting in our own English for a
general academic audience, generalizing venue-specific assumptions, and
attributing here.

Studied 2026-07-02. Verify licenses again before any new adaptation.

## Source repositories

| Repo | License | How we treat it |
|---|---|---|
| [Yuan1z0825/nature-skills](https://github.com/Yuan1z0825/nature-skills) | Apache-2.0 | Adapt concepts & structures freely with attribution (this file). README/marketing is Chinese; skill bodies mostly English. Excluded: `nature-downloader` (separate nested license). |
| [Boom5426/Nature-Paper-Skills](https://github.com/Boom5426/Nature-Paper-Skills) | MIT | Adapt freely with attribution. Excluded: bundled conference LaTeX templates (`.sty`/`.bst` are third-party venue artifacts). |
| [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills) | CC BY-NC 4.0 (NonCommercial) | Design reference only. We re-derive concepts from the primary literature it cites (e.g. Lu et al. 2026, *Nature* 651:914, doi:10.1038/s41586-026-10265-5; Song et al. 2026 "PaperOrchestra") and never copy its expression (tables, checklist prose, rubric wording). |
| [imbad0202/academic-research-skills-codex](https://github.com/imbad0202/academic-research-skills-codex) | CC BY-NC 4.0 | Same as above; ~95% vendored copy of the previous repo. Only net-new ideas: worked integrity-gate transcript, platform-adapter architecture. Reference only. |

## Integration matrix

| Source | Pattern | License risk | Adaptation | Target | Priority | Status |
|---|---|---|---|---|---|---|
| nature-skills | Fuzzy duplicate detection (DOI/URL/reference_id primary key; title-similarity + first-author + year fallback score) | Low | Rewritten as Step 5 de-duplication + Step 3b candidate scoring | `research-verification` SKILL.md | High | **adopted** |
| nature-skills | Source reliability tiers (T1 primary indexes → T3 general web, with escalation rules) | Low | Rewrite tier table, domain-generic | research-verification / guides | High | planned |
| nature-skills | Conservative citation-support scale (strong/partial/background/contradictory/metadata-only); "never cite a metadata-only candidate without reading the abstract" | Low | Reworded into prompt guardrails | prompt library — `cite_support_scale` | Medium | **adopted** |
| nature-skills | AI-use traffic light (acceptable / disclose / never) + terminology ledger | Low | Reworded, venue-generic, split into two prompts | prompt library — `disclose_ai_use`, `write_terminology_ledger` | Medium | **adopted** |
| Nature-Paper-Skills | Pre-submission audit ladder (alignment → figures → methods anchoring → terminology → risk → reviewer-side rejection pass) with severity + minimum-safe-fix finding format | Low | Reworded, de-Natured ("target venue type" instead of Nature portfolio) | prompt library — `audit_presubmission_ladder` | High | **adopted** |
| Nature-Paper-Skills | Local-first citation hygiene scan (placeholders, TODO-verify markers, duplicate keys, mixed ID schemes; "imported BibTeX is draft metadata, not truth") | Low | Reworded into a prompt; explicitly defers existence verification to `research-verification` | prompt library — `cite_hygiene_scan` | High | **adopted** |
| Nature-Paper-Skills | Manuscript revision altitude ladder (direction → logic → evidence → terminology → language last; never polish prose on an unstable claim) | Low | Reworded | prompt library — `revise_altitude_ladder` | High | **adopted** |
| Nature-Paper-Skills | Claim–evidence map (claim / evidence / status / safer wording) | Low | Reworded | prompt library — `audit_claim_evidence_map` | High | **adopted** |
| Nature-Paper-Skills | Editor-first-impression checks (reader questions, title discipline) | Low | Reworded | prompt library — `check_editor_first_pass` | Medium | **adopted** |
| ARS (via Lu et al. 2026) | AI-research failure-mode checklist (unverified citations, results never produced, convenient round numbers, shortcut reliance, unexplained surprising findings, method-description drift) | Medium → mitigated by re-derivation from the cited paper | Re-derived independently from Lu et al. 2026, own wording and check set | prompt library — `check_ai_failure_modes` | High | **adopted** |
| ARS (concept) | Claim-level verification beyond existence: the source must anchor the exact claim, population, metric, and strength | Medium → concept only | Independently expressed; aligns with our existing alignment_audit task | research-verification SKILL.md | High | adopted (pre-existing, claims envelope) |
| ARS (concept) | Silent epistemic-upgrade detection (association→causation, hedge-drop, scope-widening) | Medium → concept only | Written from scratch as a prompt | prompt library — `check_epistemic_upgrades` | Medium | **adopted** |
| ARS (concept) | Retraction checking during citation verification | Low (public practice; Crossref/OpenAlex flags) | Implemented against resolver fields we already fetch | research-verification SKILL.md | Medium | planned |
| ARS (concept) | Instruction–data boundary for tool-using verifiers (fetched content is data, not instructions) | Low (generic security practice) | Written from scratch | research-verification SKILL.md | High | planned |
| ARS Codex | Platform-adapter-over-neutral-content packaging | Low (idea) | Reference only | future multi-platform packaging | Low | not planned |

## Rules for future adaptations

1. Check the license at the time of adaptation; record it here.
2. Permissive (MIT/Apache/BSD): adapt with attribution in this file; never copy
   files wholesale when a rewrite serves better.
3. NonCommercial / restrictive: use as a map to primary sources; re-derive from
   those sources; do not paraphrase closely.
4. Translate or rewrite non-English material into clear English; label anything
   venue-specific (journal families, national databases) or generalize it.
5. New prompts adapted from external patterns carry provenance metadata
   (`source`, `sourceUrl`) pointing at the upstream repo or primary paper.
