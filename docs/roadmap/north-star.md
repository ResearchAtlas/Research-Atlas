# North Star — Research Atlas as an Evidence Operating System

**Status:** ACTIVE, 2026-04-17. Supersedes informal positioning in
`docs/announce-draft-2026-04.md` hero copy.

## One-sentence product promise

> **Atlas helps researchers produce AI-assisted work that is inspectable,
> source-grounded, and submission-ready.**

Three words are load-bearing:

- **Inspectable.** Every claim, citation, verdict, and tool call is
  logged, hashed, and replayable. A human can audit any step.
- **Source-grounded.** Atlas does not freestyle. When it makes a claim
  about a reference, a paper, a statistic, or a fact, it came from a
  named source (CrossRef, OpenAlex, Semantic Scholar, Zotero, the
  manuscript itself) and the lookup is traceable.
- **Submission-ready.** The output is structured, envelope-conformant,
  and usable downstream — not prose that needs re-editing before it goes
  into a paper, a preregistration, or a peer review.

Note on "submission-ready" vs "submission-safe": **we ship on
submission-ready**, not submission-safe. Submission-safe implies
certification that a manuscript passes a specific journal's requirements.
That's a bigger bar (journal-specific rubrics, STROBE/CONSORT templates,
disclosure compliance, preprint policy checks) and it belongs to a
future skill (`research-compliance`) with real tool paths, not to the v1
flagship. Do not claim submission-safety publicly until that skill has
shipped and passed its own acceptance gate.

## What Atlas is NOT

- **Not a prompt library.** Prompts are not the product. The skill layer
  is — portable, audited workflows that run across agents.
- **Not a chatbot.** Atlas is task-first. Entry points are named
  workflows (`Verify Sources`, `Audit Manuscript`, `Build Literature
  Review`), not an open-ended "ask me anything" prompt.
- **Not a search engine.** Atlas uses search engines (OpenAlex,
  Semantic Scholar, CrossRef, OpenReview) as tools. The product is the
  verdict + provenance layer on top, not the index underneath.
- **Not a peer reviewer.** `manuscript-review` is framed as inline
  evidence audit against reviewer checklists, not as reviewer-style
  prose generation. Impersonating a reviewer is the exact failure mode
  Atlas positions against.

## Outcome-first entry points

The end state is a researcher opening Atlas (website or CLI) and
picking from a short list of outcomes:

1. **Verify Sources** — paste references, get per-reference verdicts
   with provenance. Today: shipping via `research-verification` v1.
2. **Build Literature Review** — define a question and scope, get a
   structured evidence table, gap analysis, and citation hygiene
   report. Phase 2 promotion of `literature-review`.
3. **Audit Manuscript** — load a manuscript, get inline evidence
   audit, claim-citation alignment, and reviewer-checklist scoring.
   Phase 4 promotion of `manuscript-review`.
4. **Check Data Analysis** — load a dataset or analysis script, get
   assumption checks, test recommendations, reproducibility flags.
   Phase 5 promotion of `data-analysis`, gated on sandbox tooling.
5. **Prepare Submission** — later. Requires `research-compliance`,
   which requires real tool paths (not rubric-only). Backlog, not a
   v1.x commitment.

These entry points are what the website's home page should eventually
route to. Today the home page is a prompt/skill library. Phase 2 is when
the task-first reframing lands.

## Why the flagship is `research-verification`

Three reasons this is the right first publishable skill:

1. **Clear failure mode.** Citation fabrication in AI-generated writing
   is a real, measurable problem (~40% fabrication rates in recent
   studies). The problem doesn't need explaining.
2. **Tool paths are public.** CrossRef, OpenAlex, Semantic Scholar all
   have free, well-documented APIs with rate limits we can live inside.
   No proprietary-data story required.
3. **Verification is verifiable.** We can lock a corpus with known
   ground truth (25 real + 5 fabricated) and run an acceptance gate on
   it. Every other skill is harder to evaluate objectively.

`research-verification` sets the publish bar for everything that comes
after — full tool wiring, acceptance corpus, six pass conditions, a
schema-validated envelope, three-agent parity.

## The three caveats on the Codex-proposed vision

Codex's draft north star proposed "submission-safe" as the product
promise, `manuscript-review` as reviewer simulation, and Atlas MCP as
the long-term data plane. All three are right-directionally but need
tightening:

1. **Soften "submission-safe" → "submission-ready"** until a real
   compliance skill ships. See above.
2. **Reframe `manuscript-review` away from "reviewer simulation"**
   toward "inline evidence audit against reviewer checklists." Same
   tool paths, no impersonation. Details in
   [`../tasks/phase-4-manuscript-review.md`](../tasks/phase-4-manuscript-review.md).
3. **Atlas MCP's moat is the provenance layer, not the raw data.**
   CrossRef / OpenAlex / Semantic Scholar already have MCP servers. If
   Atlas MCP just proxies them, it's redundant. The differentiator is
   the evidence graph + verdict ledger + audit records — the same things
   that make `research-verification` defensible. See
   [`architecture.md`](architecture.md) §4.

## How this doc relates to everything else

- **Architecture decomposition:** [`architecture.md`](architecture.md).
- **Phase-by-phase plan:** [`phases.md`](phases.md).
- **Decision gates where the plan branches:**
  [`decision-gates.md`](decision-gates.md).
- **Comparisons to adjacent projects:**
  [`competitive-landscape.md`](competitive-landscape.md).
- **Active execution:** [`../tasks/`](../tasks/).
