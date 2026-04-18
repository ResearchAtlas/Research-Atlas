# Atlas Architecture — Four Layers

**Status:** ACTIVE, 2026-04-17. Derived from Codex's four-layer proposal
(2026-04-17 review memo) with the three caveats from
[`north-star.md`](north-star.md) baked in.

Atlas is a four-layer system. Each layer has clear ownership, a clear
contract with the layers above and below, and a clear reason to exist
independently.

```
┌────────────────────────────────────────────────────────────┐
│ 1. Atlas Web           (the interface)                     │
│    researchatlas.info — task-first entry points,           │
│    run history, evidence ledger UI, exports.               │
├────────────────────────────────────────────────────────────┤
│ 2. Atlas Skills        (the portable workflow layer)       │
│    SKILL.md sources, plugin manifests, per-agent mirrors,  │
│    acceptance corpora, transcripts.                        │
├────────────────────────────────────────────────────────────┤
│ 3. Atlas Evidence Runtime   (the shared contract)          │
│    Envelope schema, provenance model, validator library,   │
│    eval harness, connector layer.                          │
├────────────────────────────────────────────────────────────┤
│ 4. Atlas MCP           (the data plane — future)           │
│    Remote MCP service exposing the evidence graph,         │
│    verdict ledger, audit records. Differentiated by the    │
│    provenance layer, not by raw data.                      │
└────────────────────────────────────────────────────────────┘
```

## 1. Atlas Web

**What:** the researcher-facing website at `researchatlas.info`.

**Today:** a Vite + React site with a prompt/skill library, workflow
pages, and an install-on-your-agent landing section.

**Where it's going:**

- Home page reframes around outcomes (Verify Sources, Build Literature
  Review, Audit Manuscript, Check Data Analysis). Phase 2 work.
- Run history: logged-in users see past verification runs with evidence
  envelopes. Requires auth + storage; Phase 4+.
- Evidence ledger UI: a reader can open a manuscript and see each
  citation's verdict inline. Phase 5+.
- Team review: shared workspaces for co-authors. Later.

**Tech stack:** React 19, Vite, TanStack Query, Radix UI, Tailwind,
react-router-dom v7. Deploy on Vercel. No server runtime today — the
site is fully pre-rendered static plus client hydration. Moving parts of
it to Fluid Compute is a Phase 4+ decision when auth + run history
arrives.

**Contract with Atlas Skills:** the website **documents and links to**
skills but does not embed them. Install flow happens in the user's
agent CLI, not in-browser. Website never runs skill logic — that stays
inside Claude Code / Codex / Gemini.

## 2. Atlas Skills

**What:** the portable workflow layer. Each skill is one SKILL.md with
optional `references/`, `scripts/`, and `examples/` folders, distributed
as a Claude Code plugin, a Codex CLI skill directory, and a Gemini CLI
skill install target.

**Today:**

- Canonical sources live in `.claude/skills/` (10 skills, 1 at publish
  bar, 9 as Tier 3 prompt-grade reference material per
  `.claude/skills/EVALUATION_REPORT.md`).
- Mechanical mirrors in `.agents/skills/` (shared Codex + Gemini path)
  and `plugin/skills/` (Claude plugin packaging).
- Sync via `npm run mirror:skills`; drift check in `prebuild`.
- Single-plugin marketplace at `.claude-plugin/marketplace.json`,
  identifier `research-atlas`.

**Where it's going:**

- Tier 2 promotions one at a time, each behind the same acceptance-corpus
  publish bar `research-verification` set.
- Phase 3 decision gate: split to a dedicated `researchatlas/skills`
  repo once plugin #2 exists. Not a pre-launch dependency. See
  [`decision-gates.md`](decision-gates.md) §Phase-3.
- Progressive disclosure refactor: lean SKILL.md body, heavy logic moves
  into `references/` files, deterministic helpers into `scripts/`.

**Contract with Atlas Evidence Runtime:** skills do NOT re-implement
envelope schemas, validators, or provenance logic. They import or
reference the runtime. Today the runtime is informal (conventions in the
canonical SKILL.md); Phase 3 makes it explicit.

## 3. Atlas Evidence Runtime

**What:** the shared contract everything above depends on. This is the
most important layer and the one most often neglected.

**Contents:**

- **Envelope schema.** `{meta, status, data, errors}` with
  `schema_version: 2`. Every skill emits this. JSON Schema definition
  must be checkable programmatically.
- **Provenance model.** For every external tool call: source (CrossRef /
  OpenAlex / Semantic Scholar / Zotero / OpenReview), query, raw
  response hash, timestamp, resolver version. Hashes so the evidence is
  auditable without re-fetching.
- **Validator library.** Schema validation, `verdicts_complete`
  invariant (Ralph Loop pattern), confidence-floor checks, required-field
  assertions. Invoked as a library by skills and as a PostToolUse hook
  by Claude Code harnesses.
- **Eval harness.** Locked corpora, graders, regression runs,
  transcript storage. Today: the 30-reference corpus for
  `research-verification`. Future: per-skill corpora with the same
  structure.
- **Connector layer.** Typed clients for CrossRef, OpenAlex, Semantic
  Scholar, OpenReview, Zotero (via kujenga/zotero-mcp),
  user-local corpora. Each connector emits provenance records.

**Today:** informal. The envelope exists, the validator is ad-hoc, the
harness is the acceptance-run protocol. Phase 3 is when this becomes a
real package.

**Where it's going:**

- Phase 1: extract the envelope validator as a shared Node helper used
  by the Claude Code plugin and the mirror check.
- Phase 3: formalize as its own package (name TBD —
  `@research-atlas/evidence-runtime` under a new org). All shipped
  skills import from it.
- Phase 5+: connector layer grows to cover per-workflow tool surfaces
  as new skills ship.

**Contract with Atlas MCP:** the MCP serves the same provenance model
the runtime defines. The MCP is the runtime with a network wrapper.

## 4. Atlas MCP (data plane — future)

**What:** a remote MCP service that exposes Atlas's evidence graph and
verdict ledger as first-class tools to any MCP-speaking agent.

**The moat question.** CrossRef, OpenAlex, Semantic Scholar already
have MCP servers. If Atlas MCP just proxies them, it's redundant. The
differentiator has to be the **provenance layer on top**:

- **Evidence graph:** references, claims, manuscripts, and the edges
  between them (cites, verified-by, disputes, supersedes).
- **Verdict ledger:** every `research-verification` run logged with
  envelope hash, resolver traces, timestamps. Re-queryable.
- **Audit records:** who ran what, against what corpus, with what
  tool set, producing what verdict.

Agents like OpenAI Deep Research, Claude Research, and Gemini's own
research modes should be able to call Atlas MCP to ground their outputs
in audited evidence — not just re-fetch the primary sources.

**Today:** does not exist. Listed here so we build the provenance model
(in Layer 3) in a way that can be exposed cleanly when the MCP lands.

**Where it's going:**

- Phase 5+ pilot on a read-only surface (verdict lookup, evidence graph
  read). Phase 6+ for write paths (logging runs into the ledger).
- Likely deploy on Vercel with Fluid Compute for the runtime, backed by
  a marketplace database (D1, Neon, or similar — not the deprecated
  Vercel Postgres). Revisit infra choice at Phase 5.

**Contract with Atlas Web:** the website is an MCP client. Run-history
and evidence-ledger UI in Atlas Web read from Atlas MCP.

## Cross-agent portability — how the three-agent story actually works

All four layers must be agent-agnostic. Atlas does not assume Claude.

- **Layer 1 (Web):** not agent-specific at all. Serves any browser.
- **Layer 2 (Skills):** canonical `.claude/skills/` source → mechanical
  mirrors for Codex (`.agents/skills/`) and Gemini (same shared path).
  Plugin manifest for Claude Code.
- **Layer 3 (Runtime):** a plain Node/TypeScript library. No
  Claude-isms. Importable from any skill regardless of host agent.
- **Layer 4 (MCP):** MCP is the portability contract. Any MCP-speaking
  agent can call it.

**Hooks are a Layer-2 opt-in**, not a Layer-3 contract. Skills work
fully without hooks. See the hooks section in
[`../plans/2026-04-17-skill-library-maturity.md`](../plans/2026-04-17-skill-library-maturity.md)
§9 for the per-agent hook asymmetry.

## Related docs

- Vision: [`north-star.md`](north-star.md)
- Sequencing: [`phases.md`](phases.md)
- Go/no-go points: [`decision-gates.md`](decision-gates.md)
- Where Atlas sits vs other projects:
  [`competitive-landscape.md`](competitive-landscape.md)
- GitHub org to hold these repos: [`github-organization.md`](github-organization.md)
