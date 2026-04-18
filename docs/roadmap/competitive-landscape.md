# Competitive Landscape

**Status:** ACTIVE, 2026-04-17.

This doc maps Atlas against the other projects playing nearby. The
goal is honesty about who does what, and clarity about where Atlas's
specific wedge is — not a marketing deck.

## Who's adjacent

### Other AI-research skill libraries

**Orchestra-Research / AI-Research-SKILLs.**
[Repo](https://github.com/Orchestra-Research/AI-Research-SKILLs). 87
skills across ML infrastructure categories (model architecture,
tokenization, fine-tuning, post-training, distributed training,
interpretability, RAG, agents, MLOps). Organized as reference
documentation (300KB+ per skill) scraped from official repos.
Distributed as an npm package with an interactive installer that
supports multiple agent CLIs.

**Overlap with Atlas:** they use the Agent Skills standard. Same
progressive-disclosure structure (SKILL.md + references + scripts).
Same multi-agent positioning.

**Where Atlas differs:**

- **Domain.** Orchestra targets ML engineers building/training/serving
  models. Atlas targets researchers doing literature search,
  citation verification, manuscript audit, and data analysis. Almost
  no overlap in the actual skill inventory.
- **Quality model.** Orchestra's bar is "comprehensive documentation
  from official sources." Atlas's bar is "real tool calls with
  acceptance corpus + three-agent parity gate." Orchestra skills are
  reference-heavy; Atlas skills are execution-heavy.
- **Distribution surface today.** Orchestra ships an npm installer.
  Atlas ships a Claude Code plugin + `.agents/skills/` for Codex and
  Gemini. An npm installer is a later option (see
  [`phases.md`](phases.md) — not in the 12-month window).

**Takeaway:** Orchestra is not a direct competitor. The npm
interactive-installer pattern is worth studying as a future
distribution option if Atlas ever grows past 5+ skills. For now, the
Claude Code marketplace + per-agent skill paths are sufficient.

### Research-intelligence SaaS tools

**Consensus.** ([Site](https://consensus.app/).) Semantic search over
scientific literature with a claim-answering interface.

**Elicit.** ([Site](https://elicit.com/).) Research assistant that
takes a question and returns structured evidence tables from
literature.

**SciSpace.** ([Site](https://typeset.io/).) Literature search +
paper summarization + figure extraction.

**Overlap with Atlas:** these products solve adjacent user problems —
"answer a research question from the literature." All three do some
variant of literature synthesis.

**Where Atlas differs:**

- **Distribution model.** Atlas is free + open-source, runs inside the
  researcher's existing AI coding CLI (Claude Code, Codex, Gemini).
  Consensus/Elicit/SciSpace are hosted web apps with accounts and
  paid tiers.
- **Inspection layer.** Atlas's core promise is every verdict is
  auditable with hashed resolver traces. The SaaS tools show sources
  but don't give you the evidence graph. For AI-assisted researchers
  who need to defend their work, the audit trail is the wedge.
- **Workflow coverage.** Atlas covers verification, literature review,
  manuscript audit, and data analysis in one portable skill bundle.
  The SaaS tools each pick one vertical.

**Takeaway:** Atlas is the open, audit-first, in-your-CLI alternative
to hosted research-intelligence SaaS. Different product, different
customer moment (working inside your editor, not opening a browser
tab).

### AI-native research agents (OpenAI Deep Research, Claude Research, Gemini Deep Research)

These are vendor-native research modes inside the three major model
providers' products. They take a question and produce a long-form
research report with citations.

**Overlap with Atlas:** they cite sources. Their outputs have the
same citation-fabrication problem Atlas is positioned to solve.

**Where Atlas differs:**

- **Atlas is complementary, not competitive.** The right mental model:
  Deep Research produces the draft → Atlas verifies the citations →
  researcher signs off. Atlas's `research-verification` skill is the
  natural "next step" after any deep-research run.
- **Atlas MCP (future) makes this explicit.** Phase 5+ exposes
  Atlas's evidence graph via MCP, so Deep Research / Claude Research
  / Gemini Research can call Atlas mid-generation instead of after.
  See [`architecture.md`](architecture.md) §4.

**Takeaway:** build toward integration, not competition. The Atlas MCP
read-path pilot is specifically designed to be called by vendor
research agents.

### Academic reference managers with AI bolt-ons

**Zotero** (with AI plugins), **Mendeley**, **Readwise Reader**
(research mode).

**Overlap with Atlas:** reference management and annotation.

**Where Atlas differs:**

- Atlas doesn't manage references; it **verifies and audits** them.
  Zotero is the system of record; Atlas consumes it (via
  kujenga/zotero-mcp) and adds the evidence/verdict layer on top.

**Takeaway:** integrate, don't replicate. The `literature-review`
Phase 2 skill will call Zotero MCP to read a user's library.

### Preprint and peer-review tooling

**OpenReview**, **bioRxiv/medRxiv**, **PubPeer**.

**Overlap with Atlas:** preprint discovery and post-publication
critique.

**Where Atlas differs:** Atlas is the private, pre-submission tool.
OpenReview/PubPeer are public post-submission tools. Different stage,
different audience.

**Takeaway:** integrate via the OpenReview MCP (anyakors) in Phase 2+.
No product overlap.

## Atlas's specific wedge

Three things that, combined, no one else is doing:

1. **Open, portable skill layer across Claude Code, Codex, Gemini.**
   Same SKILL.md, same acceptance bar, same verdict envelope.
2. **Real tool calls, not rubrics.** Every shipped skill has wired
   tool paths (CrossRef, OpenAlex, Semantic Scholar, Zotero,
   OpenReview) and real acceptance corpora.
3. **Provenance-first output envelope.** `schema_version: 2` with
   hashed resolver traces, verdict tables, and the
   `verdicts_complete` Ralph Loop invariant. Auditable in a way that
   hosted SaaS outputs aren't.

The ≤1 competitor on any single axis is easy to find. The three
together are the wedge.

## What the competitive landscape does NOT change

- **Atlas stays open-source and free** through at least the 12-month
  window. Paid tiers are off the roadmap.
- **Atlas does not pivot to a SaaS web app.** The website is the
  interface layer; skills are where the product lives.
- **Atlas does not chase Orchestra's breadth.** Quality >> quantity.
  Four Tier 1 skills beats forty Tier 3 skills.

## Related docs

- What Atlas is: [`north-star.md`](north-star.md)
- How Atlas is built: [`architecture.md`](architecture.md)
- When things land: [`phases.md`](phases.md)
