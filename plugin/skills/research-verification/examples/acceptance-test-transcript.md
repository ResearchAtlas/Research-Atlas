# Worked Example — Research Verification Skill

This transcript walks through the skill end-to-end on a small reference list that exercises every code path in Step 3 (CrossRef hit, OpenAlex fallback, metadata mismatch, fabricated DOI, no-DOI search). Use it as the golden trace when debugging regressions or onboarding a new agent host.

**Scenario:** Someone pastes the following list into a chat with the agent and says _"verify these citations"_.

## Input

```
task: verify_citations
references: |
  1. Vaswani, A., Shazeer, N., Parmar, N., et al. (2017). Attention is all you need. In Advances in Neural Information Processing Systems (pp. 5998-6008).

  2. LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. Nature, 521(7553), 436-444. https://doi.org/10.1038/nature14539

  3. LeCun, Y., Bengio, Y., & Hinton, G. (2018). Deep learning. Nature, 521(7553), 436-444. https://doi.org/10.1038/nature14539

  4. Smith, J., & Doe, A. (2024). Foundation models for cold fusion research. Journal of Speculative AI, 12(3), 1-42. https://doi.org/10.1038/nonexistent-2024-99999

  5. Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K. (2018). BERT: Pre-training of deep bidirectional transformers for language understanding. arXiv preprint arXiv:1810.04805.
verification_depth: detailed
output_format: markdown
```

## Step 0 — Input Validation

- `task` present ✓
- `references` payload non-empty ✓
- No claim-level fields required (task is reference-level)

## Step 0.5 — Ingest & Parse

Parser walks the payload, splits on numbered list markers `^\d+\.\s`, detects `prose` format for every chunk. Normalized output:

| id | source_format | doi | authors[0] | year | title (first 60 chars) |
|----|---|---|---|---|---|
| vaswani-2017-attention-is-all-you-need | prose | null | Vaswani, A. | 2017 | Attention is all you need |
| lecun-2015-deep-learning | prose | `10.1038/nature14539` | LeCun, Y. | 2015 | Deep learning |
| lecun-2018-deep-learning | prose | `10.1038/nature14539` | LeCun, Y. | 2018 | Deep learning |
| smith-2024-foundation-models-for-cold-fusion | prose | `10.1038/nonexistent-2024-99999` | Smith, J. | 2024 | Foundation models for cold fusion research |
| devlin-2018-bert-pre-training-of-deep-bidirectional | prose | null | Devlin, J. | 2018 | BERT: Pre-training of deep bidirectional transformers |

De-dup check: entries 2 and 3 share DOI `10.1038/nature14539`. Per Step 0.5(5), we keep the first occurrence. Entry 3 is recorded in `errors` as `{duplicate_of: lecun-2015-deep-learning, raw: "3. LeCun, Y., Bengio, Y., ..."}` and still gets a verdict entry so the caller sees what happened.

Count: 5 entries, well under the 200-entry cap. Proceed.

## Step 1 — Route

`task: verify_citations` → Bibliography Audit + VERIFY Framework.

## Step 2 — VERIFY Framework Pre-Scan

- Entry 4: **I**nvented DOI heuristic fires — "nonexistent" in the DOI suffix is a strong smell. Flagged for prioritization, but verdict is still determined by the resolver.
- Entry 3: **Y**ear discrepancy heuristic fires — same DOI, different year from entry 2.
- All others pass the pre-scan.

## Step 3a — DOI Resolver

**vaswani-2017-attention-is-all-you-need:** no DOI, skip to Step 3c.

**lecun-2015-deep-learning:** CrossRef `/works/10.1038/nature14539` → 200 OK. Resolved:
```
title: "Deep learning"
authors: ["LeCun, Yann", "Bengio, Yoshua", "Hinton, Geoffrey"]
year: 2015
venue: "Nature"
raw_response_hash: "3f9c...a1" (sha256 of first 4 KB)
source: crossref
```

**lecun-2018-deep-learning:** marked as duplicate in Step 0.5, so no resolver call — verdict is carried from entry 2's result with a note explaining the duplicate collapse. (Verdict `verified`, but `evidence.notes: "Collapsed into lecun-2015-deep-learning; year 2018 in the parsed input disagrees with the canonical year 2015."`)

**smith-2024-foundation-models-for-cold-fusion:** CrossRef `/works/10.1038/nonexistent-2024-99999` → 404. Fallback to OpenAlex `/works/doi:10.1038/nonexistent-2024-99999` → 404. Verdict: `fabricated_doi`, confidence 1.0, evidence `"DOI returned 404 from both CrossRef and OpenAlex"`.

**devlin-2018-bert-pre-training-of-deep-bidirectional:** no DOI, skip to Step 3c.

## Step 3b — Metadata Cross-Check

**lecun-2015-deep-learning:**
| field | parsed | resolved | similarity | pass |
|---|---|---|---|---|
| title | "Deep learning" | "Deep learning" | 1.00 | ✓ |
| author | "LeCun" | "LeCun" | exact | ✓ |
| year | 2015 | 2015 | exact | ✓ |

All three pass → `verdict: verified`, confidence 1.0.

(Entries 1 and 5 handled in Step 3c below. Entry 4 already decided in Step 3a. Entry 3 inherits from entry 2 as a duplicate.)

## Step 3c — No-DOI Path

**vaswani-2017-attention-is-all-you-need:** OpenAlex search `?search=Attention is all you need&filter=authorships.author.display_name.search:Vaswani&filter=publication_year:2016|2017|2018` returns 3 candidates. Top hit: `{title: "Attention Is All You Need", authors: ["Ashish Vaswani", ...], year: 2017, doi: "10.48550/arxiv.1706.03762", score: 1.00}`. Step 3b passes fully. Verdict: `verified`, confidence 1.0, `resolved.doi` backfilled to `10.48550/arxiv.1706.03762`.

**devlin-2018-bert-pre-training-of-deep-bidirectional:** OpenAlex search returns 5 candidates. Top hit: `{title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding", authors: ["Jacob Devlin", ...], year: 2019, doi: "10.18653/v1/N19-1423", score: 0.92}`. Title similarity 1.00, author match ✓, year 2018 vs 2019 — within ±1, passes. Verdict: `verified`, confidence 0.92 (knocked down because the resolved canonical year is a year off from the parsed year). Also adds `evidence.notes: "Parsed year 2018 refers to the arXiv preprint; resolved canonical is the 2019 NAACL publication."`

## Step 3d — Depth Modifier (detailed)

For each `verified` entry, fetch the abstract:
- entry 1: abstract snippet (first 500 chars) from OpenAlex
- entry 2: abstract snippet from CrossRef
- entry 5: abstract snippet from OpenAlex

Skipped for entry 3 (duplicate) and entry 4 (`fabricated_doi`).

## Step 4 — Self-Check

```
all_evaluated:      pass  (5 parsed references, 5 verdict records)
no_false_verified:  pass  (each "verified" backed by either resolver confirmation or score ≥ 0.9)
contradictions:     pass  (entry 4 fabrication surfaced, not suppressed)
unverifiable_noted: pass  (no "unverifiable" in this run; rule still satisfied vacuously)
format_match:       pass  (output_format == markdown)
verify_framework:   pass  (pre-scan flags recorded in evidence.notes)
verdicts_complete:  pass  (5 entries in data.verdicts, in input order)
```

## Output Envelope (abbreviated)

```yaml
meta:
  skill: research-verification
  version: 2.1.0
  schema_version: 2
  run_id: 4b8c2e41-...
  timestamp: 2026-04-17T15:30:00Z
status: success
data:
  task: verify_citations
  verification_depth: detailed
  output_format: markdown
  citations_checked: 5
  verdict_summary: { verified: 3, partially_supported: 0, unsupported: 0, contradicted: 0, fabricated: 1, unverifiable: 0 }
  verdicts:
    - reference_id: vaswani-2017-attention-is-all-you-need
      verdict: verified
      confidence: 1.00
      evidence:
        parsed: { doi: null, title: "Attention is all you need", authors: ["Vaswani, A."], year: 2017, venue: null, source_format: prose, raw: "1. Vaswani, A., ..." }
        resolved: { doi: "10.48550/arxiv.1706.03762", title: "Attention Is All You Need", authors: ["Ashish Vaswani", ...], year: 2017, venue: "NeurIPS", source: openalex, raw_response_hash: "a7..." }
        cross_check: { title: { similarity: 1.00, pass: true }, author: { pass: true }, year: { parsed: 2017, resolved: 2017, pass: true } }
        candidates: [ {source: openalex, score: 1.00, title: "Attention Is All You Need", ...}, {score: 0.78, ...}, {score: 0.71, ...} ]
        abstract_snippet: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks..."
        notes: null
    - reference_id: lecun-2015-deep-learning
      verdict: verified
      confidence: 1.00
      evidence: { ... }
    - reference_id: lecun-2018-deep-learning
      verdict: verified
      confidence: 0.85
      evidence:
        parsed: { doi: "10.1038/nature14539", year: 2018, ... }
        resolved: null
        cross_check: null
        candidates: []
        abstract_snippet: null
        notes: "Collapsed into lecun-2015-deep-learning; parsed year 2018 disagrees with canonical year 2015."
    - reference_id: smith-2024-foundation-models-for-cold-fusion
      verdict: fabricated_doi
      confidence: 1.00
      evidence:
        parsed: { doi: "10.1038/nonexistent-2024-99999", ... }
        resolved: null
        cross_check: null
        notes: "DOI returned 404 from both CrossRef and OpenAlex."
    - reference_id: devlin-2018-bert-pre-training-of-deep-bidirectional
      verdict: verified
      confidence: 0.92
      evidence:
        parsed: { doi: null, year: 2018, ... }
        resolved: { doi: "10.18653/v1/N19-1423", year: 2019, ..., source: openalex }
        cross_check: { title: { similarity: 1.00, pass: true }, author: { pass: true }, year: { parsed: 2018, resolved: 2019, pass: true } }
        candidates: [ ... ]
        abstract_snippet: "We introduce a new language representation model called BERT..."
        notes: "Parsed year 2018 refers to the arXiv preprint; canonical is the 2019 NAACL publication."
errors:
  - reference_id: lecun-2018-deep-learning
    stage: parse
    reason: "Duplicate of lecun-2015-deep-learning (same normalized DOI)."
    raw: "3. LeCun, Y., Bengio, Y., & Hinton, G. (2018). Deep learning. Nature, 521(7553), 436-444. https://doi.org/10.1038/nature14539"
```

## Regression Expectations

If any of the following changes, the acceptance-test harness should fail loudly:

1. A `verified` verdict is produced without a matching `resolved` record and an `evidence.cross_check` entry (or the `resolver_only` marker).
2. A DOI-404 reference is silently skipped instead of getting `verdict: fabricated_doi`.
3. A duplicate DOI is re-resolved twice rather than collapsed in Step 0.5.
4. The no-DOI path accepts a candidate with score ≤ 0.7 as `verified`.
5. `data.verdicts` length ≠ number of parsed references.

These are the invariants the 30-reference acceptance corpus (see `acceptance-corpus.txt`) will stress.
