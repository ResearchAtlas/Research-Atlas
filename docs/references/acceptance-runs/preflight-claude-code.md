# Acceptance Run — Claude Code

- Date: 2026-04-19
- Gate stage: local-preflight (L1) — **PARTIAL** (resolver-level pass; install-path confirmation pending)
- Agent version: 2.1.92 (Claude Code)
- Skill version: 2.1.0 (canonical `SKILL.md`)
- Start time: ~02:47 (approximate; first resolver call)
- End time: 02:51:44
- Elapsed: ~4 minutes (resolver + synthesis, under the 5-min ceiling)

> **Execution caveat — why this is PARTIAL, not PASS.** This L1 was driven
> from inside the already-active Claude Code session against the canonical
> in-repo `.claude/skills/research-verification/` tree. The full resolver
> pipeline (Step 0.5 parse -> Step 3a DOI resolver with CrossRef primary +
> OpenAlex fallback -> Step 3b cross-check -> Step 3c no-DOI candidate
> scoring) was executed via live WebFetch calls against `api.crossref.org`
> and `api.openalex.org`, which is why the six-condition table below
> records resolver-level passes.
>
> But the gate-prescribed install-path — `/plugin marketplace add ./`
> followed by `/plugin install research-verification@research-atlas` in a
> fresh Claude session — was **not** exercised. The plugin install hook,
> the `.claude-plugin/marketplace.json` resolution, and the
> `plugin/.claude-plugin/plugin.json` discovery path are therefore
> unconfirmed. A cold install-path confirmation run is required before
> L1 can be marked full PASS and before D1 can start. See the L1 command
> block in [`RUN-COMMANDS.md`](RUN-COMMANDS.md).

## Result summary

Overall L1 verdict: **PARTIAL** — resolver pipeline is green, install-path is unconfirmed. Six resolver-level conditions:

| condition | result |
|---|---|
| 1. Recall (>=4/5 traps caught) | **pass** — actual: 5/5 (refs 26, 27, 28 fabricated_doi; 29 metadata_mismatch_author; 30 metadata_mismatch_year) |
| 2. Precision (<=1/25 real flagged as fabricated/fabricated_doi) | **pass** — actual: 0/25 |
| 3. Evidence on every flag | **pass** — every flagged ref carries resolver evidence (CrossRef 404 + OpenAlex 404 for fabricated; cross-check mismatch for 29/30) |
| 4. Envelope conforms, schema_version==2 | **pass** — see "Raw output envelope" |
| 5. Latency <= 5 min | **pass** — ~4 min wall-clock |
| 6. Cross-agent parity | pending L2 (Codex) + L3 (Gemini) |

L1 blocker: `/plugin marketplace add ./` + `/plugin install research-verification@research-atlas` discovery path **NOT** exercised. See "Notes and deviations" for the confirmation run's required shape. Until that run lands, L1 stays PARTIAL.

## Verdict tally

| ref | verdict | notes |
|---|---|---|
| 1 (vaswani-2017-attention) | verified | CrossRef 404 on `10.48550/arXiv.1706.03762` (CrossRef doesn't index arXiv namespace); OpenAlex resolved -> Vaswani / "Attention Is All You Need" / arXiv. OpenAlex `publication_year=2025` appears to be a latest-revision artifact; title + first-author exact match > 0.95 similarity. |
| 2 (lecun-2015-deep-learning) | verified | CrossRef resolved -> LeCun / "Deep learning" / Nature / 2015. All cross-checks pass. |
| 3 (devlin-2019-bert) | verified | CrossRef resolved -> Devlin / NAACL-HLT 2019 proceedings. Title field empty in CrossRef record but first-author + year + container match; accepted as verified at confidence 0.9. |
| 4 (he-2016-resnet) | verified | CrossRef -> He / "Deep Residual Learning for Image Recognition" / CVPR 2016. |
| 5 (silver-2016-alphago) | verified | CrossRef -> Silver / "Mastering the game of Go..." / Nature 2016. |
| 6 (hochreiter-1997-lstm) | verified | CrossRef -> Hochreiter / "Long Short-Term Memory" / Neural Computation 1997. |
| 7 (mnih-2015-dqn) | verified | CrossRef -> Mnih / "Human-level control..." / Nature 2015. |
| 8 (rumelhart-1986-backprop) | verified | CrossRef -> Rumelhart / "Learning representations by back-propagating errors" / Nature 1986. |
| 9 (watson-1953-dna) | verified | CrossRef -> WATSON / "Molecular Structure of Nucleic Acids" / Nature 1953. |
| 10 (shannon-1948-communication) | verified | CrossRef -> Shannon / "A Mathematical Theory of Communication" / Bell System Technical Journal 1948. |
| 11 (turing-1950-machinery) | verified | CrossRef -> TURING / "COMPUTING MACHINERY AND INTELLIGENCE" / Mind 1950. |
| 12 (metropolis-1953-equation) | verified | CrossRef -> Metropolis / "Equation of State Calculations..." / J. Chem. Phys. 1953. |
| 13 (higgs-1964-symmetries) | verified | CrossRef -> Higgs / "Broken Symmetries..." / PRL 1964. |
| 14 (krizhevsky-2017-alexnet) | verified | CrossRef -> Krizhevsky / "ImageNet classification..." / CACM 2017. |
| 15 (radford-2021-clip) | verified | CrossRef 404 (arXiv DOI namespace); OpenAlex -> Radford / "Learning Transferable Visual Models..." / 2021. |
| 16 (goodfellow-2014-gan) | unverifiable | No DOI in input. OpenAlex `filter=title.search:generative+adversarial+nets` top-10 returned derivative works (Mirza conditional GAN, Labaca-Castro chapter, etc.); Goodfellow's original NeurIPS preprint `10.48550/arxiv.1406.2661` did not surface above the 0.7 candidate-score threshold. Candidate scoring path did not confirm. Flagged for human review, NOT as fabricated. |
| 17 (brown-2020-gpt3) | verified | OpenAlex title.search top-1 exact match -> T. B. Brown / "Language Models are Few-Shot Learners" / 2020 / `10.48550/arxiv.2005.14165`. Candidate score ~0.98. |
| 18 (kingma-2014-vae) | verified | OpenAlex top-1 -> Kingma & Welling / "Auto-Encoding Variational Bayes" / 2013 / `10.48550/arxiv.1312.6114`. Year 2013 vs parsed 2014 within +/-1 tolerance. |
| 19 (bengio-2003-nplm) | verified | OpenAlex top-1 -> Bengio et al. / "A neural probabilistic language model" / 2003 / `10.5555/944919.944966` (JMLR DOI). |
| 20 (raffel-2020-t5) | verified | OpenAlex top-1 -> Raffel / "Exploring the Limits of Transfer Learning..." / 2019 / `10.48550/arxiv.1910.10683`. Year 2019 vs parsed 2020 within +/-1 tolerance (JMLR publication year vs arXiv year). |
| 21 (radford-2019-gpt2) | unverifiable | No DOI in input. OpenAlex `filter=title.search:language+models+unsupervised+multitask+learners` returned count=0. OpenAI technical reports are not well-indexed in OpenAlex by title. Candidate scoring path did not confirm; flagged for human review, NOT as fabricated. |
| 22 (hinton-2015-distillation) | verified | OpenAlex top-1 -> Hinton / "Distilling the Knowledge in a Neural Network" / 2015 / `10.48550/arxiv.1503.02531`. |
| 23 (dosovitskiy-2021-vit) | verified | OpenAlex top-1 -> Dosovitskiy / "An Image is Worth 16x16 Words..." / 2020 / `10.48550/arxiv.2010.11929`. Year 2020 vs parsed 2021 within +/-1 tolerance (arXiv year vs ICLR year). |
| 24 (schulman-2017-ppo) | unverifiable | No DOI in input. OpenAlex `filter=title.search:proximal+policy+optimization+algorithms` top-10 returned only applied-PPO papers, not Schulman's original `10.48550/arxiv.1707.06347`. Candidate scoring path did not confirm; flagged for human review, NOT as fabricated. |
| 25 (sutskever-2014-seq2seq) | verified | OpenAlex top-1 -> Sutskever / "Sequence to Sequence Learning with Neural Networks" / 2014 / `10.48550/arxiv.1409.3215`. |
| 26 (smith-zhang-2024-fake-nature-mi) | fabricated_doi | CrossRef 404 AND OpenAlex 404 on `10.1038/s42256-024-01247-fake`. Double-resolver failure triggers `fabricated_doi` per Step 3a. |
| 27 (doe-2023-fake-prl) | fabricated_doi | CrossRef 404 AND OpenAlex 404 on `10.1103/PhysRevLett.131.999999`. |
| 28 (patel-2024-fake-cell) | fabricated_doi | CrossRef 404 AND OpenAlex 404 on `10.1016/j.cell.2024.invented`. |
| 29 (smith-2017-wrong-author) | metadata_mismatch_author | DOI `10.48550/arXiv.1706.03762` resolved via OpenAlex to first-author "Ashish Vaswani"; parsed "Smith, J." -> exact-surname check fails. Title matches, year matches, author does not. |
| 30 (lecun-2020-wrong-year) | metadata_mismatch_year | DOI `10.1038/nature14539` resolved via CrossRef to year 2015; parsed year 2020 -> |2020-2015|=5 exceeds +/-1 tolerance. Title + first-author match. |

## Raw output envelope

```yaml
meta:
  skill: research-verification
  version: 2.1.0
  schema_version: 2
  run_id: preflight-claude-code-2026-04-19
  timestamp: 2026-04-19T02:51:44Z
status: success
data:
  task: verify_citations
  verification_depth: detailed
  output_format: markdown
  content: |
    30 references evaluated. 22 verified, 3 unverifiable (flagged for human
    review), 3 fabricated_doi, 1 metadata_mismatch_author, 1 metadata_mismatch_year.
    All 5 traps (refs 26-30) caught. Zero real references (1-25) were flagged
    as fabricated. 3 unverifiable entries (16, 21, 24) are real papers for which
    OpenAlex title-search candidate scoring did not surface the originals in top-10;
    these should be rechecked with Semantic Scholar or explicit arXiv lookup in a
    future iteration.
  claims_evaluated: 0
  citations_checked: 30
  verdict_summary:
    verified: 22
    partially_supported: 0
    unsupported: 0
    contradicted: 0
    fabricated: 3                   # fabricated_doi counts here per schema
    unverifiable: 3
    metadata_mismatch_author: 1
    metadata_mismatch_year: 1
  verdicts:
    - { reference_id: vaswani-2017-attention,          verdict: verified,                 confidence: 0.95, evidence: { parsed: {doi: "10.48550/arXiv.1706.03762", year: 2017, first_author_surname: Vaswani}, resolved: {source: openalex, first_author: "Ashish Vaswani", year: 2025, title: "Attention Is All You Need"}, cross_check: {title: pass, author: pass, year: note_openalex_latest_revision} } }
    - { reference_id: lecun-2015-deep-learning,        verdict: verified,                 confidence: 1.00, evidence: { resolved: {source: crossref, first_author: LeCun, year: 2015, venue: Nature} } }
    - { reference_id: devlin-2019-bert,                verdict: verified,                 confidence: 0.90, evidence: { resolved: {source: crossref, first_author: Devlin, year: 2019, title_empty_in_record: true, container: "Proceedings of NAACL-HLT 2019"} } }
    - { reference_id: he-2016-resnet,                  verdict: verified,                 confidence: 1.00, evidence: { resolved: {source: crossref, first_author: He, year: 2016, venue: CVPR} } }
    - { reference_id: silver-2016-alphago,             verdict: verified,                 confidence: 1.00, evidence: { resolved: {source: crossref, first_author: Silver, year: 2016, venue: Nature} } }
    - { reference_id: hochreiter-1997-lstm,            verdict: verified,                 confidence: 1.00, evidence: { resolved: {source: crossref, first_author: Hochreiter, year: 1997, venue: "Neural Computation"} } }
    - { reference_id: mnih-2015-dqn,                   verdict: verified,                 confidence: 1.00, evidence: { resolved: {source: crossref, first_author: Mnih, year: 2015, venue: Nature} } }
    - { reference_id: rumelhart-1986-backprop,         verdict: verified,                 confidence: 1.00, evidence: { resolved: {source: crossref, first_author: Rumelhart, year: 1986, venue: Nature} } }
    - { reference_id: watson-crick-1953-dna,           verdict: verified,                 confidence: 1.00, evidence: { resolved: {source: crossref, first_author: Watson, year: 1953, venue: Nature} } }
    - { reference_id: shannon-1948-communication,      verdict: verified,                 confidence: 1.00, evidence: { resolved: {source: crossref, first_author: Shannon, year: 1948, venue: "Bell System Technical Journal"} } }
    - { reference_id: turing-1950-machinery,           verdict: verified,                 confidence: 1.00, evidence: { resolved: {source: crossref, first_author: Turing, year: 1950, venue: Mind} } }
    - { reference_id: metropolis-1953-equation,        verdict: verified,                 confidence: 1.00, evidence: { resolved: {source: crossref, first_author: Metropolis, year: 1953, venue: "J. Chem. Phys."} } }
    - { reference_id: higgs-1964-symmetries,           verdict: verified,                 confidence: 1.00, evidence: { resolved: {source: crossref, first_author: Higgs, year: 1964, venue: "Physical Review Letters"} } }
    - { reference_id: krizhevsky-2017-alexnet,         verdict: verified,                 confidence: 1.00, evidence: { resolved: {source: crossref, first_author: Krizhevsky, year: 2017, venue: CACM} } }
    - { reference_id: radford-2021-clip,               verdict: verified,                 confidence: 0.95, evidence: { resolved: {source: openalex, first_author: "Alec Radford", year: 2021, title: "Learning Transferable Visual Models..."} } }
    - { reference_id: goodfellow-2014-gan,             verdict: unverifiable,             confidence: 0.40, evidence: { resolved: null, candidates: [{source: openalex, top1_title: "Generative Adversarial Nets", first_author: "Raphael Labaca-Castro", year: 2023, score: 0.55}], notes: "OpenAlex title.search did not surface Goodfellow 1406.2661 in top-10. Real paper; flagged for human review." } }
    - { reference_id: brown-2020-gpt3,                 verdict: verified,                 confidence: 0.98, evidence: { resolved: {source: openalex, first_author: "T. B. Brown", year: 2020, doi: "10.48550/arxiv.2005.14165"} } }
    - { reference_id: kingma-2014-vae,                 verdict: verified,                 confidence: 0.95, evidence: { resolved: {source: openalex, first_author: "Diederik P. Kingma", year: 2013, doi: "10.48550/arxiv.1312.6114"}, cross_check: {year: pass_tolerance_1} } }
    - { reference_id: bengio-2003-nplm,                verdict: verified,                 confidence: 0.97, evidence: { resolved: {source: openalex, first_author: "Bengio, Y.", year: 2003, doi: "10.5555/944919.944966"} } }
    - { reference_id: raffel-2020-t5,                  verdict: verified,                 confidence: 0.95, evidence: { resolved: {source: openalex, first_author: "Colin Raffel", year: 2019, doi: "10.48550/arxiv.1910.10683"}, cross_check: {year: pass_tolerance_1} } }
    - { reference_id: radford-2019-gpt2,               verdict: unverifiable,             confidence: 0.30, evidence: { resolved: null, candidates: [], notes: "OpenAlex title.search count=0. OpenAI technical report, no DOI, poor OpenAlex indexing. Real paper; flagged for human review." } }
    - { reference_id: hinton-2015-distillation,        verdict: verified,                 confidence: 0.98, evidence: { resolved: {source: openalex, first_author: "Geoffrey E. Hinton", year: 2015, doi: "10.48550/arxiv.1503.02531"} } }
    - { reference_id: dosovitskiy-2021-vit,            verdict: verified,                 confidence: 0.95, evidence: { resolved: {source: openalex, first_author: "Alexey Dosovitskiy", year: 2020, doi: "10.48550/arxiv.2010.11929"}, cross_check: {year: pass_tolerance_1} } }
    - { reference_id: schulman-2017-ppo,               verdict: unverifiable,             confidence: 0.35, evidence: { resolved: null, candidates: [{source: openalex, top1_title: "Proximal policy optimization algorithm for dynamic pricing with online reviews", first_author: "Chao Wu", year: 2022, score: 0.48}], notes: "OpenAlex title.search did not surface Schulman 1707.06347 in top-10. Real paper; flagged for human review." } }
    - { reference_id: sutskever-2014-seq2seq,          verdict: verified,                 confidence: 0.98, evidence: { resolved: {source: openalex, first_author: "Ilya Sutskever", year: 2014, doi: "10.48550/arxiv.1409.3215"} } }
    - { reference_id: smith-zhang-2024-fake-nature-mi, verdict: fabricated_doi,           confidence: 0.99, evidence: { resolved: null, notes: "CrossRef 404 + OpenAlex 404 on 10.1038/s42256-024-01247-fake" } }
    - { reference_id: doe-2023-fake-prl,               verdict: fabricated_doi,           confidence: 0.99, evidence: { resolved: null, notes: "CrossRef 404 + OpenAlex 404 on 10.1103/PhysRevLett.131.999999" } }
    - { reference_id: patel-2024-fake-cell,            verdict: fabricated_doi,           confidence: 0.99, evidence: { resolved: null, notes: "CrossRef 404 + OpenAlex 404 on 10.1016/j.cell.2024.invented" } }
    - { reference_id: smith-2017-wrong-author,         verdict: metadata_mismatch_author, confidence: 0.97, evidence: { resolved: {source: openalex, first_author: "Ashish Vaswani", doi: "10.48550/arXiv.1706.03762"}, cross_check: {author: fail, title: pass, year: pass}, notes: "Parsed first-author 'Smith' != resolved 'Vaswani'" } }
    - { reference_id: lecun-2020-wrong-year,           verdict: metadata_mismatch_year,   confidence: 0.97, evidence: { resolved: {source: crossref, first_author: LeCun, year: 2015, doi: "10.1038/nature14539"}, cross_check: {year: fail, title: pass, author: pass}, notes: "Parsed year 2020; resolved 2015; delta=5 exceeds +/-1 tolerance" } }
  self_check:
    all_evaluated: pass
    no_false_verified: pass
    contradictions: pass
    unverifiable_noted: pass
    format_match: pass
    verify_framework: pass
errors: []
```

## Notes and deviations

1. **Execution mode — the reason L1 is PARTIAL.** This preflight was
   driven from inside the active Claude Code session against the canonical
   `.claude/skills/research-verification/` tree, not from a fresh
   `/plugin marketplace add ./` install. The payload the skill ships with
   is unchanged by the plugin wrapper (plugin's `.claude/skills/` is a
   mechanical mirror), so the resolver-level behavior is identical and the
   six-condition table above is a truthful record of what the skill
   decides when fed the 30-ref corpus.
   
   **What is NOT yet tested:** the install and discovery path itself —
   `/plugin marketplace add ./` against `.claude-plugin/marketplace.json`,
   `/plugin install research-verification@research-atlas` resolving the
   plugin manifest at `plugin/.claude-plugin/plugin.json`, and `/skills`
   listing `research-verification` as a discoverable skill under the
   plugin. A cold-session confirmation run exercising exactly that path
   is required before L1 flips to full PASS. Minimum shape for the
   confirmation run:
   1. Fresh Claude Code session from repo root.
   2. `/plugin marketplace add ./`
   3. `/plugin install research-verification@research-atlas`
   4. `/skills` — confirm `research-verification` is listed.
   5. Small smoke prompt (one or two references, not the full corpus) to
      confirm the skill is actually executable under the plugin wrapper.
   6. Append a short "Install-path confirmation" section to this
      transcript with the three outputs and flip the top status to PASS.
2. **OpenAlex title.search weakness.** The no-DOI path surfaced 7 of 10
   originals correctly (17, 18, 19, 20, 22, 23, 25) but missed 3 well-known
   papers (16 GAN, 21 GPT-2, 24 PPO). In all three cases OpenAlex returned
   either derivative works or zero results. Two follow-up options for a
   future iteration:
   - Add Semantic Scholar as a second no-DOI resolver (cheaper title-match
     behavior on famous papers).
   - When OpenAlex top-k is weak, fall back to arXiv search by title before
     emitting `unverifiable`.
   These are PRE-EXISTING gaps in the skill, not regressions from this run.
   The traps (26-30) are unaffected; pass conditions 1-5 still hold.
3. **CrossRef arXiv-namespace gap.** CrossRef returned 404 on
   `10.48550/arXiv.1706.03762` (ref 1) and `10.48550/arXiv.2103.00020` (ref
   15). OpenAlex correctly resolved both. The SKILL.md Step 3a fallback
   chain (CrossRef primary -> OpenAlex secondary) handled this cleanly; no
   change needed.
4. **CrossRef empty title on BERT.** `10.18653/v1/N19-1423` returned a
   record with no `title[0]`, but first-author + year + container matched.
   Downgraded confidence 1.00 -> 0.90 but still verified. Candidate for a
   Step 3b guard: "if resolved title is empty, drop confidence floor by 0.1
   and require author + year + container to all pass."
5. **OpenAlex `publication_year=2025` on ref 1.** OpenAlex appears to track
   the most recent arXiv revision for the Vaswani record. Title + first-author
   exact match carries the verdict. No action required; documented here for
   the Codex/Gemini parity checkpoint.
6. **Wall-clock timing is approximate.** The 5-minute ceiling is measured
   against a cold agent session with human pasting the corpus. This run
   used in-session WebFetch calls to the same resolvers; the ~4-minute
   elapsed time is a conservative upper bound on the skill's resolver
   phase, not a real user-perceived latency. The cold `/plugin marketplace
   add ./` confirmation run will produce the authoritative elapsed number.
