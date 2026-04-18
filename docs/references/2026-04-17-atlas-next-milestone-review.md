# Research Atlas: Next-Milestone Review

**Date:** 2026-04-17
**Last revised:** 2026-04-17 (post-Codex review)
**Author:** Claude Code (review requested by maintainer)
**Status:** Strategy memo. Factual claims reflect the state of the repo when first drafted; see §0.1 for what has since changed.
**Scope:** Evaluation of the Research Atlas site (researchatlas.info), the internal agent skills in `.claude/skills/`, and an external advisory report from ChatGPT. Produces a recommendation for the next milestone.

---

## 0. TL;DR

- ChatGPT's diagnosis is mostly correct, its strategic direction (verification-first workflow hub) is right, but its prescription is incomplete because it could not see the internal machinery.
- The site publicly looks like a prompt library. Internally, ten v2.0.0 agent skills with routing rules, decision tables, and unified output envelopes already exist — they are just not exposed or wired to tools.
- The real 2026 frontier is not **skill nomenclature** (Workflow Kit vs Research Skill vs Tool Playbook). It is **tool-grounded, source-locator-backed execution** via MCP. On that axis, both the public site and the internal skills are aspirational.
- Recommend a **three-track next milestone** — with Track B as *the* milestone and A, C as supporting:
  - **Track B (the milestone):** ship one tool-grounded researcher outcome — *"paste a bibliography, get verified / suspicious / unverifiable per reference with evidence locators and an audit log"* — end-to-end, under a defined time budget.
  - **Track A (support):** fix trust-eroding surface bugs and ship the IA rename.
  - **Track C (support, secondary):** install path for Claude Code / Cursor / Copilot users; marketplace publish where it reduces friction.
- Public IA should lead with task-first entry points (*Verify Sources*, *Review Manuscript*, *Build Literature Review*), not with `/skills`. Keep the skill machinery internal; sell outcomes.

## 0.1 Revision note

This memo was initially written against the state of the repo at the start of the review session. In the course of the same session, the Track A surface fixes (Counter bug, hero mockup filename, bottom CTA copy) were implemented. The "hard claims — verified directly" table in §2.1 therefore reflects pre-fix state; the specific fixes that have since landed are called out inline. A subsequent external review by Codex (summarized in §10) prompted additional corrections to source attribution and restructuring of §5 to make the flagship milestone crisper. Treat §2 as an audit snapshot and §5, §8, §10 as current strategy.

---

## 1. What I reviewed

- **Live site:** [researchatlas.info](https://researchatlas.info) (homepage + library confirmed via WebFetch).
- **Codebase:** [`src/`](../../src) — routing ([`App.tsx`](../../src/App.tsx)), data ([`prompts.ts`](../../src/data/prompts.ts), [`workflows.ts`](../../src/data/workflows.ts), [`guides.ts`](../../src/data/guides.ts), [`taxonomy.ts`](../../src/data/taxonomy.ts)), and per-page components under [`src/modules/`](../../src/modules).
- **Internal skills:** 12 skills under [`.claude/skills/`](../../.claude/skills) plus the existing self-assessment in [`EVALUATION_REPORT.md`](../../.claude/skills/EVALUATION_REPORT.md).
- **ChatGPT's report:** full 11-section audit, confirmed against live site and code.
- **External context (web research):** Anthropic Agent Skills spec, Claude Code skill conventions, OpenAI deep research citation accuracy, context engineering vs prompt engineering trend, public research-skill repos (K-Dense-AI `scientific-agent-skills`, `AI-Research-SKILLs`, `academic-research-skills`), NotebookLM / Claude Projects / ChatGPT Deep Research comparison, Zotero MCP and Semantic Scholar MCP integrations.

---

## 2. Audit of ChatGPT's report against reality

### 2.1 Hard claims — verified directly

| ChatGPT claim | Verdict | Evidence |
|---|---|---|
| Hero still sells "AI-assisted tools" and uses copy-prompt mockup | **Correct** (bottom CTA copy updated in-session from "streamline your prompt workflow" to "ship evidence-grade research with AI"; hero headline still says "Unlock Research Rigor with AI-Assisted Tools") | [`HomePage.tsx`](../../src/modules/home/HomePage.tsx) |
| `preview.tsx` visible in hero mockup | **Correct at time of audit; fixed in-session** | Was literal string `preview.tsx` at `HomePage.tsx:173`; replaced with `research-prompt.yaml` during Track A cleanup. Current file: [`HomePage.tsx`](../../src/modules/home/HomePage.tsx) |
| Homepage counters show `0+ / 0 / 0` | **Correct at time of audit; fixed in-session** | Original `Counter` was gated by `useInView` so the number stayed at `0` until the section scrolled into view. Refactored to trigger the animation on mount (still count-up, no stuck-at-zero). Current file: [`HomePage.tsx`](../../src/modules/home/HomePage.tsx) |
| Library called "Prompt Library" | **Correct** | [Live library page](https://researchatlas.info/library) self-identifies; page header in [`LibraryPage.tsx`](../../src/modules/library/LibraryPage.tsx) |
| Duplicate library entries | **Correct**, 3 duplicates found: *Figure Caption Generator* (lines 1292 + 1504), *Table Caption Generator* (1339 + 1540), *Experimental Results Analysis* (1386 + 1577) in [`prompts.ts`](../../src/data/prompts.ts) |
| Many "prompts" are really protocols/templates | **Correct** | Confirmed: *IRB Alignment Checklist*, *De-identification SOP*, *Baseline Model Specification Card*, *Claim-Source Alignment Audit*, *Citation Audit Log*, *Reproduction Runbook*, *Notebook Protocol README Setup*, *Claim-to-Citation Ledger* |
| Research Stages mixes lifecycle and writing states | **Correct** | `polishing` and `writing` are both `ResearchStage` values in [`taxonomy.ts:5–10`](../../src/data/taxonomy.ts#L5) alongside `design`, `analysis`, `data_qc`, etc. |
| Writing-heavy imbalance (Writing 52 etc.) | **Directionally correct.** Of 106 prompts, a large share are tagged `writing` or `polishing`; `measures`, `experimental`, `visualization` are sparse |
| Guides thin in places, NotebookLM the most mature page | **Correct** | Verified against [`guides.ts`](../../src/data/guides.ts): NotebookLM guide has richest structure; *Prompting Fundamentals*, *Verification & Integrity*, and *Ethics, Privacy, and Disclosure* are much shorter |
| Workflow catalog mixes practical kits with acronym-heavy architecture pages | **Correct** | [`workflows.ts`](../../src/data/workflows.ts) has 16 workflows — *FOCUS*, *NotebookLM*, *w1–w6* are practical; *EXHYTE*, *AutoResearcher*, *DeepResearchEco*, *Scideator*, *BioPlanner*, *Six-Stage Autonomous Scientist* are architecture patterns |

### 2.2 Claims that need nuance

- **"Workflow pages mostly render title + `0 / N` progress + step list."** Partially correct. [`WorkflowDetailPage.tsx`](../../src/modules/workflows/WorkflowDetailPage.tsx) does have real step tracking (`completedSteps`, auto-advance at line 98–108), but the detail pages are indeed visually flat and the progress state is ephemeral (lost on refresh). ChatGPT's critique of the UX outcome stands even if the code is slightly better than implied.
- **"Site feels stale not because it lacks rigor language, but because its packaging is stuck one layer too low."** True, but the deeper reason is that the **rigor language is decoupled from any machinery that enforces it**. A "verification protocol" page has no button to run the verification; a "citation hygiene workflow" does not actually call a citation resolver. The packaging problem is real, but it is a symptom, not the root cause.
- **"Do not make Agent Skills the public-facing identity."** Defensible given the audience, but understates what has already been built internally. See §4.

### 2.3 Things ChatGPT missed

1. **A `SkillsPage.tsx` exists but is unrouted.** [`src/modules/skills/SkillsPage.tsx`](../../src/modules/skills/SkillsPage.tsx) is a skeleton with two hardcoded examples (Cursor/VS Code rules, Paper Reviewer persona). It is not in the router ([`App.tsx:22–32`](../../src/App.tsx#L22)). Either remove it or turn it into a real page — the current state is dead code and quietly leaks the intent.
2. **`.claude/skills/` contains 10 research skills already at v2.0.0.** [`EVALUATION_REPORT.md`](../../.claude/skills/EVALUATION_REPORT.md) self-grades them at 4.47/5 on a five-dimension rubric (triggers, structure, DoD, reusability, composability). A sub-agent review (§3) confirms the structural work is real, but the grade is optimistic on external-world fidelity.
3. **MCP servers for research are already installed in this workspace.** PMC article search, OSF preprint search, Hugging Face paper search, and Zotero/Semantic Scholar integrations are available. None of the skills or workflows reference them. ChatGPT's §4–§6 recommendations (Tool Playbooks, Context Packs, Verification Protocols) are the *right* shape to close that gap; the gap itself is larger than ChatGPT could see from the live site.
4. **The site ships as a pre-rendered static SPA.** React/Vite/Tanstack — no server compute, no Vercel Functions, no live agents. That constrains what "verification protocol" can actually mean on the site itself vs. in downstream agent runtime.
5. **The domain and landscape around "Agent Skills" has hardened in 2026.** Anthropic launched Agent Skills as an open standard in late 2025; official repo is [`anthropics/skills`](https://github.com/anthropics/skills). Community research-skill repos (K-Dense-AI's 133-skill `scientific-agent-skills`, Orchestra Research's `AI-Research-SKILLs`, `academic-research-skills`) are real competition if Atlas chooses the skills route. ChatGPT's "do not use Agent Skills as public identity" advice under-weights this — *making Atlas the curated, verification-focused subset* may be the more durable niche than avoiding the term entirely.

### 2.4 Overall assessment of ChatGPT's report

Stronger than most AI-generated audits. Concrete page references, honest separation of observation / inference / recommendation, and the strategic framing (Option 3: verified AI-assisted research workflow hub) is the right answer. Weaker where it cannot see code: the IA proposal is sound, but the content-model proposal (Research Skill, Workflow Kit, Tool Playbook, Verification Protocol, Context Pack, Ethics Brief, Method Card, Review Checklist) is arguably *too* granular for a small open-source project and conflicts with the already-built internal `SKILL.md` conventions. A simpler public layer over a smaller internal type set is likely better than eight content types.

---

## 3. Internal agent skills — independent audit

Detailed review by a sub-agent reading every [`SKILL.md`](../../.claude/skills/) plus [`EVALUATION_REPORT.md`](../../.claude/skills/EVALUATION_REPORT.md).

### 3.1 Per-skill verdict

| Skill | Verdict | Note |
|---|---|---|
| [academic-writing](../../.claude/skills/academic-writing/SKILL.md) | **Production** | Strong technique library; real routing; well-scoped to prose quality |
| [literature-review](../../.claude/skills/literature-review/SKILL.md) | **Production** | Solid task router; honest about fabrication risk; `w4_cite` subflow usable |
| [research-verification](../../.claude/skills/research-verification/SKILL.md) | **Production** (best in set) | VERIFY framework + three-layer depth + honest unverifiable handling |
| [data-analysis](../../.claude/skills/data-analysis/SKILL.md) | **Production** | Real decision table for parametric vs nonparametric; `w3_stress` sub-checks genuinely rigorous |
| [manuscript-review](../../.claude/skills/manuscript-review/SKILL.md) | **Production** | Concrete review dimensions; `w6_rebut` is a usable five-step workflow |
| [latex-polish](../../.claude/skills/latex-polish/SKILL.md) | **Production** | Five crisp modes with hard rules; good LaTeX-preservation guards |
| [research-discovery](../../.claude/skills/research-discovery/SKILL.md) | **Needs polish** | FOCUS pipeline coherent but phases 1–2 drift narrative; no social-scan integration |
| [research-ideation](../../.claude/skills/research-ideation/SKILL.md) | **Needs polish** | Acronym-heavy (AutoResearcher/EXHYTE/Scideator) for what is structured brainstorming |
| [research-reproducibility](../../.claude/skills/research-reproducibility/SKILL.md) | **Needs polish** | Good manifest logic; promises SHA-256 hashes without calling Bash |
| [figure-table-craft](../../.claude/skills/figure-table-craft/SKILL.md) | **Needs polish** | Captions solid; figure blueprint stays textual (no diagram tool) |

Two non-research skills (`vercel-react-best-practices`, `web-design-guidelines`) exist as-is; they use a different frontmatter convention and are fine to keep separate.

### 3.2 What is genuinely strong

1. **Trigger + collision-resolution system.** Every skill has `MUST trigger when` / `MUST NOT trigger when` / Collision Resolution table with named alternatives. Better than most public skill packs.
2. **Fabrication honesty.** VERIFY framework, `no_false_verified` CHECK across skills, and an explicit `unverifiable` status class reflect real research integrity practice.
3. **Unified output envelope + pipeline graph.** `{meta, status, data, errors}` with `schema_version` and `run_id`. Chains are legible.

### 3.3 The big five gaps

1. **No live bibliographic tool integration.** No CrossRef, OpenAlex, OpenCitations, Semantic Scholar, arXiv, or PMC calls. The skills *name* these services in prose but do not wire them. The environment has MCP servers that would close this gap — none are referenced.
2. **No first-class research file formats.** PDF, BibTeX/BibLaTeX, RIS, CSV, `.tex`, `.ipynb`, `.qmd` are not handled as typed inputs; skills accept "path or text" and delegate parsing to the model.
3. **No grounding-with-locators protocol.** Claims and citations do not carry `(quote, page/section, source_id)` tuples despite anti-fabrication being the headline feature.
4. **No privacy / IRB / PII guardrails.** Only one skill mentions PII in passing. For human-subjects, health, or education data this is a material gap.
5. **No 2026 platform awareness.** No Claude deep research, ChatGPT deep research, NotebookLM Source Discovery, Gemini Notebooks, or MCP-server conventions acknowledged in the skill procedures. Given the project's own flagship workflow is NotebookLM, this is surprising.

### 3.4 The 4.47/5 grade is optimistic

Reassessed under a rubric that weights *external-world fidelity*, the honest average is closer to **3.7/5 (B)**. The v1 → v2 delta is real; the absolute grade is not. Self-grading that rewards structural ceremony (frontmatter, envelopes, CHECK tokens) while not penalizing missing integration is where the optimism lives.

### 3.5 Publishability as Anthropic Agent Skills

- **Ready with trim** (fit ≤1024-char `description` + move `version:` under `metadata:` + drop `allowed-tools:` for non-Claude-Code distribution): `research-verification`, `manuscript-review`, `latex-polish`, `data-analysis`.
- **Close, fix overclaims:** `academic-writing`, `literature-review`.
- **Restructure before publishing:** `research-discovery`, `research-reproducibility` (the latter must actually call Bash for hashes).
- **Merge or drop:** `research-ideation` → fold into `literature-review` as tasks; `figure-table-craft` → split captions/results into `academic-writing`, send figure_blueprint to a diagram-capable skill.

---

## 4. Where the 2026 landscape actually is

Synthesizing the web research (see §7 Sources):

1. **Context engineering > prompt engineering.** Industry signal is unambiguous: 82% of data leaders say prompt engineering alone is insufficient; 95% plan to invest in context engineering in 2026. The relevant unit of work is the *information environment* the model sees, not the cleverness of the ask.
2. **Tool-grounded is the default, prompt-only is the exception.** Claude Opus 4.7 is optimized for long-running tasks with self-verification; Anthropic positions Agent Skills as *knowledge* that complements MCP *tools*. OpenAI's Deep Research docs now emphasize trusted MCP servers and staged workflows (source whitelisting is part of the guidance, not a single flag). NotebookLM remains the gold standard for strict source grounding.
3. **Citation hallucination is still a front-page problem.** NeurIPS 2025 had ≥100 hallucinated citations across ≥53 accepted papers (GPTZero analysis); ICLR 2026 flagged a comparable pattern. Independent evaluations of deep-research systems continue to report non-trivial reference-accuracy gaps — specific headline numbers vary by benchmark and version, so treat any single percentage with care and re-check before citing. A verification-first pitch is timely and defensible regardless of the exact figure.
4. **Zotero/Semantic Scholar MCP servers are live.** `zotero-mcp`, `seerai`, multiple independent integrations. A research platform that does not connect to a user's reference manager in 2026 is leaving the primary workflow on the table.
5. **Public skill repos are multiplying.** K-Dense-AI's `scientific-agent-skills` ships 133 skills with explicit tool integrations (70+ Python packages, 100+ scientific databases). Atlas's 10-skill verified research subset is a defensible niche only if it stays disciplined about verification and actually integrates tools. A rename without integration will not differentiate.

**Implication for Atlas:** ChatGPT is right that "prompt library" is not the right identity. It is *also* right that "agent skills platform" is too insider-y for first-time visitors. The durable position is narrower: **"a small, verified set of research workflows and skills that actually use your sources and tools."** Tool grounding is the moat.

---

## 5. Recommended next milestone

**The milestone is Track B.** Track A and Track C are supporting work that ships around it. Do not let the supporting work become the headline.

### Track B — Verify Sources: the researcher-facing flagship (the milestone, 4 weeks)

**User story.** A researcher arrives on Atlas with a draft manuscript or a bibliography. They paste the reference list (or upload a `.bib` / `.ris` / PDF with references). Within **5 minutes for ≤50 references**, they get back a per-reference verdict (`verified | suspicious | unverifiable`), evidence for each (resolved URL/DOI, matched title and authors, venue and year confirmation, and a quoted or locator-pinned claim where available), plus a downloadable audit log. No silent fall-back to model memory.

**Acceptance test (Definition of Done for the milestone).**

Given a test bibliography of 25 real references plus 5 deliberately fabricated references (mismatched DOIs, invented authors, wrong year), the flagship flow must:

1. Resolve all real DOIs against CrossRef with full metadata echoed back.
2. Flag all 5 fabricated entries as `suspicious` or `unverifiable` with the specific VERIFY heuristic that triggered.
3. Return the full report in under 5 minutes on a typical connection.
4. Emit a machine-readable audit log (`{reference, status, evidence: {doi, url, matched_title, matched_authors, matched_year, verify_flags}, confidence}`).
5. Never silently guess — every `verified` has at least one external-source evidence URL; every `unverifiable` explains why the external lookup failed.
6. Work end-to-end from a clean install (no workspace-specific MCP preconfig needed).

If any item fails on the test fixture, the milestone is not shipped.

**Integrations (minimum viable scope).** Start narrow; expand only after the minimum works end-to-end.

- **Must have:** CrossRef DOI resolution (`https://api.crossref.org/works/{doi}`), OpenAlex author/venue cross-check.
- **Should have:** Zotero MCP for users with a library; BibTeX upload as fallback.
- **Nice to have (phase 2):** OpenCitations for citation network; Semantic Scholar / PMC MCP for abstract verification; arXiv for preprints.

**Deliverables.**

- Updated [`research-verification/SKILL.md`](../../.claude/skills/research-verification/SKILL.md) with real tool invocation (not just naming) and the audit-log output schema above.
- A small Node or Python reference CLI in `scripts/` so users without Claude Code can run the flow locally.
- **A task-first entry point on the site:** `/verify-sources` (not `/skills`) — a page that accepts bibliography text and either (a) executes the flow in the browser against CrossRef / OpenAlex public APIs, or (b) produces the exact copy-paste prompt + `SKILL.md` + CLI invocation needed to run it externally. Choose based on static-site constraints (see §7 risks).
- One tool-playbook guide — *"Verify a manuscript's citations with Claude + CrossRef + Zotero"* — linked from the new entry point and written against the tested flow.

### Track A — Trust and navigation cleanup (2 weeks)

Surface work that makes the flagship credible. Not the flagship itself.

- ~~Remove `preview.tsx` from the hero mockup.~~ **Shipped in-session** (now `research-prompt.yaml`).
- ~~Fix the `Counter` fallback.~~ **Shipped in-session** (animation fires on mount).
- ~~Rewrite bottom CTA from "streamline your prompt workflow".~~ **Shipped in-session** (now "Ready to ship evidence-grade research with AI?").
- Rewrite the hero headline. Current: *"Unlock Research Rigor with AI-Assisted Tools."* Replace with a task-first line — e.g. *"Verify your sources. Review your manuscript. Build your literature review."* — and move the verification entry point to the primary CTA once Track B ships.
- Rename top-nav labels:
  - `Library` → `Prompts & Protocols` (accept the hub is both, stop overselling with just "Prompt Library").
  - `Workflows` → `Workflow Kits`.
  - `Guides` → keep, but split internally into `Start Here`, `Tool Playbooks`, `Protocols`.
- Deduplicate the three caption/results entries by **suffixing the framework** (e.g. *Figure Caption Generator (TIDD-EC)* vs *Figure Caption Generator (COSTAR)*) rather than deleting — these are legitimate variants, not duplicates. Library shouldn't show two identically named entries.
- Move protocol-like items (IRB, SOP, Ledger, Runbook, Audit Log) into a `Protocols` section with typed metadata (last reviewed, sources, verification required, sensitivity tier).
- Either route `SkillsPage.tsx` as a real page in Track C, or delete the file. No dead code.

### Track C — Distribution and install path (secondary, 3 weeks, can start in parallel)

Make the machinery installable for users on Claude Code / Cursor / Copilot. Explicitly **not** the public identity of the site.

- Route `/skills` as a secondary tab (not the primary entry point). Replace the skeleton [`SkillsPage.tsx`](../../src/modules/skills/SkillsPage.tsx) with:
  - A list of the 6 production-ready skills with scorecards, trigger lists, input schemas, and output envelopes rendered from each `SKILL.md` frontmatter.
  - A *"Download SKILL.md"* button per skill — installable under Claude Code / Cursor / Copilot.
  - A one-line install snippet for each skill once the Anthropic Skills marketplace publish path is chosen (see §8.2).
  - A pipeline diagram (already conceptually drawn in [`EVALUATION_REPORT.md`](../../.claude/skills/EVALUATION_REPORT.md) §5) showing how skills chain.
- Normalize skill frontmatter to match the Anthropic Agent Skills spec:
  - Move `version:` under `metadata:`.
  - Drop or document `allowed-tools:` as a Claude Code extension.
  - Trim `description:` to ≤1024 chars where over.
- Label these as **Verified Research Skills** publicly — the word "verified" does the heavy lifting; "agent" stays optional.

### Milestones and decision gates

- **Week 2:** Track A shipped (remaining items after the in-session fixes). Track B integration spike done — first 10 references round-tripping through CrossRef + OpenAlex. Track C SkillsPage wireframe reviewed.
- **Week 4:** Track B flagship live with the 30-reference acceptance test passing in CI. `/verify-sources` entry point public. Track C SkillsPage shipped with 6 skills + download.
- **Week 6:** Decide marketplace publish (§8.2). Decide whether to extend tool grounding to `literature-review` and `data-analysis`, or invest in a second flagship (NotebookLM Tool Playbook).
- **Week 8:** Kill-or-keep decision on `research-ideation` and `figure-table-craft` based on whether tool integration is feasible.

---

## 6. Anti-recommendations (things I suggest NOT doing)

- **Do not adopt all eight content types from ChatGPT's §6.** Method Card, Ethics Brief, Review Checklist, and Context Pack are real conceptual objects but do not need to be separate nav/content types for a small project. Keep them as *embedded sections* within Skills, Workflow Kits, and Protocols, discoverable by filter.
- **Do not rebuild `SkillsPage` as a marketing page.** Make it functional from day one — one-click install, visible schema, downloadable `SKILL.md`. A marketing page with no install path is the worst outcome.
- **Do not commit to NotebookLM exclusivity.** NotebookLM is the right flagship playbook. It is not the right floor. Preserve the skills-are-portable message: same skill works under Claude Code, Cursor, Copilot, ChatGPT with MCP.
- **Do not defer the surface bugs.** The `preview.tsx` string + `0/0/0` counters actively damage trust on a site whose whole identity is trust-first. These are cheap to fix and should ship within the first week.
- **Do not rebrand around "agent skills" as the top-line identity.** Agree with ChatGPT here. "Verified research workflows" is the public brand; "agent skills" is what is under the hood.

---

## 7. Key risks

- **Tool-integration complexity.** CrossRef is trivial; Zotero MCP + OpenAlex + PMC + OpenCitations is a real engineering project. Start narrow, expand only after one integration is solid.
- **Static-site constraint.** The site is a pre-rendered SPA; running the verification skill itself requires client-side JS (via WebAssembly or a small hosted function) or pushing execution to the user's Claude Code / Cursor / Codex session. Choose explicitly. Easiest path: export-first (download `SKILL.md`, run locally).
- **Skill maintenance drift.** Ten skills at v2.0.0 is close to the upper limit of what one maintainer can keep current. Do not grow the skill count; grow skill depth.
- **Overlap with K-Dense-AI / Orchestra / others.** Those repos compete on quantity. Atlas should compete on *verification discipline*. Resist the urge to match their catalog.

---

## 8. Answer the maintainer's core question

> *"push it to the next milestone to help researchers work with latest AI technologies and methods, instead of just giving them bunch of prompts and workflows"*

### 8.1 The milestone — phrased for researchers, not builders

Reframe the milestone around the **user outcome**, not the internal artifact.

- **User-facing milestone:** *"Atlas can verify the sources in your manuscript."* Paste a bibliography, get per-reference verified / suspicious / unverifiable with evidence locators and a downloadable audit log, in under 5 minutes. First-class entry point: `/verify-sources`.
- **Internal architecture supporting it:** `research-verification` skill, wired to CrossRef + OpenAlex + Zotero MCP, with a reference CLI and a normalized `SKILL.md`.

Lead publicly with the outcome. Keep the skill machinery internal. `/skills` is a secondary tab for Claude Code / Cursor / Copilot users who want to install the flow into their own agent.

Second and third task-first entry points (roughly in priority order, once the flagship works): *Review Manuscript* (wraps `manuscript-review` + `research-verification`), *Build Literature Review* (wraps `literature-review` + `research-verification`), *Analyze Data* (wraps `data-analysis`).

### 8.2 Should the skills be published so users can install with one command? (And on which agents?)

**Yes — Claude Code first via a plugin, then Codex and Gemini CLI via explicit adapters. Not before Track B ships, and not as the headline.**

Reasons **for** publishing:
- One-command install is a real friction reduction for researchers already using Claude Code / Codex / Gemini CLI.
- It forces the discipline of cleaning up frontmatter, fixing `allowed-tools:`, trimming `description:` to ≤1024 chars, and removing workspace-specific references — all work Track C needs anyway.
- Each ecosystem's skill/plugin distribution is still young; being an early *"verified research"* entry is cheaper than being the 50th.
- Community repos (K-Dense-AI's 133-skill catalog) already have quantity. A smaller, verification-focused entry differentiates by quality, not volume.

Reasons **against (or at least, against leading with it)**:
- Install paths only reach users already on an agent. The flagship milestone must work for researchers who are *not* on any agent — that is why `/verify-sources` on the website matters more than install-from-marketplace.
- A listing of a skill that does not actually call tools would be worse than no listing. Publishing must come *after* Track B so the skill genuinely invokes CrossRef / OpenAlex / Zotero.
- Maintenance overhead compounds per platform. Start with one skill on one platform; add more only after the pattern proves out.

#### 8.2.1 Cross-agent compatibility matrix

Follow-up research across Codex rounds 3 and 4 (§10.7, §10.8) found the earlier "no single artifact" framing too pessimistic, and round 3's own Gemini mechanism was wrong. The corrected picture: **Codex and Gemini both natively read `.agents/skills/`** (the shared "open agent skills" alias documented at [agentskills.io](https://agentskills.io), supported by both vendors; Gemini additionally honors `.gemini/skills/` but `.agents/skills/` takes precedence for cross-agent compatibility). Claude Code keeps its own `.claude/skills/` path. All three agents parse the same Anthropic-format `SKILL.md`. The packaging model is therefore **one canonical `SKILL.md` + two discovery paths (`.claude/skills/` and `.agents/skills/`, mirrored)**.

| Target agent | Skill discovery path | Install / link mechanism | Invocation | Hook mechanism | What Atlas ships |
|---|---|---|---|---|---|
| **Claude Code** (primary) | `.claude/skills/<name>/SKILL.md` | `/plugin install research-verification@research-atlas` after `/plugin marketplace add researchatlas/researcher-prompt-hub` (current impl: this monorepo is its own single-plugin marketplace, identified as `research-atlas` in `.claude-plugin/marketplace.json`). Target state: cut over to a dedicated `researchatlas/skills` marketplace repo using the same `research-atlas` identifier so the install command stays stable. See [Claude plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces). | Skill auto-selected or `/skills`. | Plugin manifest declares hooks. | `.claude-plugin/marketplace.json` at repo root + `plugin/.claude-plugin/plugin.json` bundling the canonical `SKILL.md` + MCP config. **One packaging artifact, unique to Claude.** |
| **Codex CLI** | `.agents/skills/<name>/SKILL.md` (native; multiple scopes — CWD, parent dirs, repo root, `$HOME`, `/etc/codex/skills` — see [OpenAI Codex skills](https://developers.openai.com/codex/skills)). Repo-root `AGENTS.md` is a separate Linux-Foundation convention also read by Cursor / Aider / Copilot / Zed (see [OpenAI Codex intro](https://openai.com/index/introducing-codex/)). | Clone the Atlas repo, symlink the `.agents/skills/research-verification/` folder into the user's workspace, or install via a Codex plugin. | `$skill-name` shorthand, or `/skills` selector, or automatic task-match. | Opt-in via `codex_hooks = true` in `.codex/config.toml`. | Mirror the canonical SKILL.md into `.agents/skills/research-verification/SKILL.md` (symlink on Unix, copy step on Windows) + a short `AGENTS.md` block at repo root. No separate repo. |
| **Gemini CLI** | `.agents/skills/<name>/SKILL.md` (native; shared alias that takes precedence over `.gemini/skills/` — see [Gemini CLI skills docs](https://geminicli.com/docs/cli/skills/)). | `gemini skills install <git-url-or-path>` or `gemini skills link <path>`; in-session `/skills link <path>`. | **Prompt-driven.** When the user's prompt matches the skill's description, Gemini calls `activate_skill` and asks for consent; on approval the SKILL.md body + folder enter the conversation. `/skills` is *management only* (`list`, `link`, `enable`, `disable`, `reload`) — not a selector. | Standard agent lifecycle. | **Zero extra ship work.** Gemini reads the same `.agents/skills/` tree we mirror for Codex. The README documents `gemini skills list` / `gemini skills link` for setup; invocation just happens via user prompts. No extension repo, no MCP server. |
| Cursor / Copilot / Aider / Zed | `AGENTS.md` at repo root (no native skills yet). | Clone repo; agent auto-reads `AGENTS.md`. | As directed by `AGENTS.md`. | n/a in v1. | Covered by the same `AGENTS.md` we ship for Codex. |
| No agent / bare terminal | n/a | `npx @researchatlas/verify-sources` or equivalent. | n/a | n/a | `scripts/verify-sources` in the main repo, npm / PyPI after flagship passes. |

**Key implication:** the packaging surface shrinks to **one Claude plugin marketplace listing + one shared `.agents/skills/` tree + one `AGENTS.md`.** The canonical `SKILL.md` is the source of truth. `.claude/skills/` and `.agents/skills/` are mirror copies (one hand-maintained, one generated by a one-line CI step). CI just checks the canonical file parses under all three agents' expected parsers — no propagation job needed.

#### 8.2.2 Recommended sequence

1. **Week 4.** Ship Track B flagship. The skill now actually calls tools. Acceptance test passes on Claude Code.
2. **Week 5 — Claude Code plugin.** Register this repo as a single-plugin marketplace (`.claude-plugin/marketplace.json` with `name: "research-atlas"`, plugin listing under `plugin/`). Install flow becomes `/plugin marketplace add researchatlas/researcher-prompt-hub` → `/plugin install research-verification@research-atlas`. Surface the install command on `/verify-sources` and `/skills`. Defer cutting over to a dedicated `researchatlas/skills` marketplace repo until we have more than one plugin — the marketplace identifier `research-atlas` stays stable through that cutover.
3. **Week 6 — Shared `.agents/skills/` tree + `AGENTS.md`.** Mirror the canonical SKILL.md to `.agents/skills/research-verification/SKILL.md` in the main repo. Add an `AGENTS.md` at repo root pointing to it. Document the `codex_hooks = true` opt-in. Re-run the acceptance test on Codex. **This same tree serves Gemini.**
4. **Week 7 — Verify Gemini discovery and prompt-driven activation.** Run `gemini skills list` inside the Atlas workspace; confirm `research-verification` appears without extra config. Then issue a prompt that should trigger the skill ("verify these references…") and confirm Gemini calls `activate_skill`, shows the consent prompt, and — on approval — executes the 30-ref acceptance test. `/skills` is management-only in Gemini; activation is prompt-driven, not selector-driven. If a user prefers out-of-workspace install, document `gemini skills install <atlas-git-url> --path .agents/skills/research-verification` (the `--path` flag is required — without it, Gemini installs the monorepo root rather than the skill subdirectory) or `gemini skills link .agents/skills/research-verification --scope workspace` in the README. No separate repo, no MCP server, no symlink to `~/.skillz`.
5. **Weeks 8–10.** Monitor installs / issues per platform. If Claude Code share is ≥70% of installs, leave the shared `.agents/skills/` tree stable and deprioritize extending Gemini/Codex packaging. If usage splits, invest in per-agent polish.
6. **After parity proves out:** tier additional skills (`manuscript-review`, `latex-polish`, `data-analysis`) through the same Claude-plugin / shared-`.agents/skills/` model.

**Distribution channels summary** (all thin, none leading publicly):
- Single-plugin marketplace in this repo (`.claude-plugin/marketplace.json`, identifier `research-atlas`) — the one genuine per-agent artifact. Future: migrate to a dedicated `researchatlas/skills` marketplace repo when we ship more plugins; the marketplace identifier stays `research-atlas` across the move.
- Canonical `.claude/skills/research-verification/SKILL.md` in the main repo, mirrored to `.agents/skills/research-verification/SKILL.md` + a root `AGENTS.md` (covers Codex and Gemini natively, plus Cursor / Aider / Copilot / Zed via `AGENTS.md`).
- Direct `SKILL.md` + MCP config download from `/skills` for anything else.
- `scripts/verify-sources` CLI for users not on any agent.
- Optional: Anthropic community `skills` repo PR for broader discoverability once the plugin is stable.

See also §5 Track C for the on-site infrastructure that surfaces the install commands.

---

## 9. Appendix: evidence and sources

### 9.1 Internal evidence

- Homepage: [`src/modules/home/HomePage.tsx`](../../src/modules/home/HomePage.tsx) (Counter bug, hero mockup filename, bottom CTA — all fixed in-session)
- Routing: [`src/App.tsx`](../../src/App.tsx) (no `/skills` route at time of audit)
- Data: [`src/data/prompts.ts`](../../src/data/prompts.ts) (106 entries; shared-title pairs at L1292/1504, L1339/1540, L1386/1577 are legitimate framework variants — see §5 Track A for the suffix-rename fix), [`src/data/workflows.ts`](../../src/data/workflows.ts) (16 workflows), [`src/data/guides.ts`](../../src/data/guides.ts) (10 guides), [`src/data/taxonomy.ts`](../../src/data/taxonomy.ts) (9 stages, 7 types)
- Skills: [`.claude/skills/`](../../.claude/skills/) — 10 research skills + 2 tooling skills; self-assessment in [`EVALUATION_REPORT.md`](../../.claude/skills/EVALUATION_REPORT.md)
- Dead UI: [`src/modules/skills/SkillsPage.tsx`](../../src/modules/skills/SkillsPage.tsx)

### 9.2 External sources

- Anthropic Agent Skills spec & repo: <https://github.com/anthropics/skills> — required-frontmatter (`name`, `description`), progressive disclosure, complements MCP.
- Anthropic engineering post on Agent Skills: <https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills>
- Anthropic "Building agents with Skills": <https://claude.com/blog/building-agents-with-skills-equipping-agents-for-specialized-work>
- Claude Code skills docs: <https://code.claude.com/docs/en/skills>
- Claude Code plugin install flow: <https://code.claude.com/docs/en/discover-plugins>
- Claude Code plugin marketplaces: <https://code.claude.com/docs/en/plugin-marketplaces>
- OpenAI Codex intro (`AGENTS.md` convention): <https://openai.com/index/introducing-codex/>
- OpenAI Codex skills docs (`.agents/skills/`, `$skill-name`, `/skills`): <https://developers.openai.com/codex/skills>
- Gemini CLI skills docs (native `.gemini/skills/` + `.agents/skills/` alias, `gemini skills install/link/list`, `/skills`): <https://geminicli.com/docs/cli/skills/>
- Gemini CLI repo: <https://github.com/google-gemini/gemini-cli>
- Gemini CLI extension reference example: <https://github.com/gemini-cli-extensions/security>
- Open Agent Skills standard (shared `.agents/skills/` alias): <https://agentskills.io>
- Community research-skill repos: <https://github.com/K-Dense-AI/scientific-agent-skills> (133 skills, 100+ databases), <https://github.com/Orchestra-Research/AI-research-SKILLs>, <https://github.com/Imbad0202/academic-research-skills>
- Zotero MCP: <https://github.com/54yyyu/zotero-mcp> and related integrations
- Citation hallucination at NeurIPS 2025: <https://gptzero.me/news/iclr-2026/> and <https://fortune.com/2026/01/21/neurips-ai-conferences-research-papers-hallucinations/>
- OpenAI Deep Research launch notes: <https://openai.com/index/introducing-deep-research/> — used for general deep-research framing. (Earlier drafts of this memo cited a specific "~78% FACT accuracy" figure to this URL; that attribution has been removed because the OpenAI page does not carry that number.)
- OpenAI Deep Research developer guide: <https://developers.openai.com/api/docs/guides/deep-research> — covers trusted MCP servers and staged workflows, the correct framing for source-scope controls.
- Context engineering vs prompt engineering (2026 shift): <https://www.promptingguide.ai/guides/context-engineering-guide>, <https://sombrainc.com/blog/ai-context-engineering-guide>
- NotebookLM vs Claude Projects vs ChatGPT: <https://elephas.app/blog/notebooklm-vs-claude-projects>, <https://www.mindstudio.ai/blog/gemini-notebooks-vs-claude-projects-chatgpt>
- Nature on citation hallucination: <https://www.nature.com/articles/d41586-025-02853-8>

### 9.3 ChatGPT report strengths and weaknesses — scored

| Dimension | Score | Note |
|---|---|---|
| Observation accuracy | 9/10 | Direct quotes from live site, most verified |
| Inference quality | 7/10 | Right direction, sometimes too granular |
| Strategic framing | 8/10 | Option 3 is correct call |
| IA proposal | 7/10 | Good top-nav; content-model too complex for a small project |
| Content-type model | 6/10 | 8 types is too many; should be 4 public + 4 embedded |
| 2026 landscape awareness | 7/10 | References deep research and MCP; misses tool integration as *the* moat |
| Actionability | 7/10 | 30/60/90 is fine but does not identify the single flagship bet |
| Code-level insight | 3/10 | Could not see `.claude/skills/`, MCP servers, or unrouted `SkillsPage` — not its fault |

---

## 10. Codex review — findings and response

An external review by Codex flagged four concerns. Each is addressed below, with the corresponding edits to this document.

### 10.1 "High: two 'verified directly' claims are stale against the current repo."

- Claim: the report says `preview.tsx` is visible in the hero; the current file shows `research-prompt.yaml`.
- Claim: the report says the Counter "requires `useInView`"; the current implementation uses `useEffect` without the `useInView` gate.

**Response: accepted.** Both items reflect the pre-fix state captured when the memo was first drafted. The corresponding fixes were implemented later in the same session. §0.1 (revision note), §2.1 (table entries now annotated *"Correct at time of audit; fixed in-session"*), and §5 Track A (fixes marked as shipped) have been updated so the audit framing is honest about the before/after.

**Lesson:** If this memo is treated as an audit artifact in future reviews, pin factual claims to a specific commit SHA or deployed-build URL — not to the moving state of `main`.

### 10.2 "Medium: source attribution is looser than presented."

- Claim: the "~78% FACT accuracy" figure was cited to OpenAI's deep-research launch page, which does not contain it.
- Claim: "trusted-site restriction" is not how OpenAI's own docs frame the risk.

**Response: accepted.** The specific FACT percentage has been removed from §4 and replaced with the generalized statement that independent evaluations continue to report non-trivial reference-accuracy gaps. The OpenAI launch-page citation in §9.2 has been annotated to acknowledge the mismatch. The "trusted-site restriction" wording has been rewritten to "trusted MCP servers and staged workflows," matching the framing in OpenAI's developer guide, which is now cited separately.

### 10.3 "Medium: the recommendation drifts back toward agent-builder concerns faster than researcher-facing value."

**Response: accepted.** §5 has been restructured: Track B is now *the* milestone and is phrased as a researcher-facing outcome ("Verify Sources") with a concrete acceptance test. Track A and Track C are explicitly supporting work. §8.1 adds the task-first public-IA framing: `/verify-sources` leads, `/skills` is a secondary distribution surface. The public brand is outcome-led ("verify your sources," "review your manuscript"); the skill machinery stays internal.

### 10.4 "Low: the plan needs a tighter user story and success metric."

**Response: accepted.** §5 Track B now includes an explicit acceptance test: a fixture of 25 real references + 5 deliberately fabricated ones, with six pass conditions (CrossRef round-trip, VERIFY-flag all fabrications, ≤5 min runtime, machine-readable audit log, no silent fallback, works from clean install). The milestone does not ship if the fixture fails.

### 10.5 Codex's headline verdict — and where we differ

Codex's verdict: *"strong strategic memo and a mediocre audit artifact."* That is accepted and now reflected in the document's own framing. The header labels it a strategy memo; §0.1 flags which claims are snapshots vs current state. Where we differ: Codex recommends de-prioritizing `/skills` substantially. This memo's position is narrower — `/skills` is secondary for the *first* milestone, but it remains useful infrastructure once the flagship ships (see §5 Track C and §8.2 on marketplace publishing). A strong public IA does not preclude a strong install path; they serve different audiences.

### 10.6 Codex round 2 — fixes applied

A second Codex pass flagged three concrete issues after the previous revision:

1. **[P1] Legacy evidence links in §§1–3 were broken after the memo moved into `docs/references/`.** Paths like `../src/...` and `../.claude/...` resolved under `docs/` rather than the repo root. **Fixed:** all `../src` and `../.claude` links in §§1–3 now use `../../src` and `../../.claude`. Verified by grep.
2. **[P1] The marketplace plan used `/skill install research-verification`, which is not the documented Claude Code command.** Claude Code installs via `/plugin install <plugin>@<marketplace>`. **Fixed:** §8.2 now scopes the Claude path around publishing a **plugin** that bundles the skill, and shows the documented `/plugin install` + `/plugin marketplace add` flow. New §9.2 sources for the Claude plugin install flow and marketplaces docs.
3. **[P2] Cross-agent publish plan implied one artifact would cover Claude, Codex, and Gemini.** **Fixed:** §8.2.1 now contains an explicit compatibility matrix:
   - **Claude Code:** plugin in `researchatlas/plugins`, installed via `/plugin install research-verification@atlas`.
   - **Codex:** `codex/` directory with drop-in `AGENTS.md` snippet (no central marketplace — Codex follows repo-level `AGENTS.md` conventions).
   - **Gemini CLI:** separate `researchatlas/gemini-verify` extension repo, installed via `gemini extensions install ...`.
   - **Cursor / Copilot:** raw `SKILL.md` + MCP config download.
   - **No agent:** `scripts/verify-sources` CLI via npm / PyPI.

   The canonical `SKILL.md` lives in the main Atlas repo; each per-agent adapter references it, and a CI job propagates updates across adapters. This is the minimum structure that keeps cross-agent parity honest.

   **Note (superseded):** rounds 3 and 4 (§10.7, §10.8) simplify this further. The "three adapter repos" framing is outdated — Codex and Gemini now share a single `.agents/skills/` tree. See §8.2.1 for the current matrix.

§8.2.2 ("Recommended sequence") now sequences the three agent adapters week-by-week: Claude plugin week 5, Codex `AGENTS.md` week 6, Gemini CLI extension week 7, with a usage-share decision gate at week 8–10.

### 10.7 Round 3 — simpler cross-agent reality (`.agents/skills/` + symlinks)

A follow-up pass researched how Codex and Gemini actually discover skill files today, rather than assuming each agent needs its own packaging format. Findings:

1. **Codex has a native `.agents/skills/<name>/SKILL.md` convention.** Same Anthropic frontmatter, invoked via `$skill-name` or `/skills`. We do **not** need a "codex/ bundle" or a separate adapter repo — we mirror (symlink on Unix, copy in a build step on Windows) the canonical `.claude/skills/` tree into `.agents/skills/` and Codex finds it.
2. **Gemini CLI supports Anthropic-format skills via the `skillz` MCP server.** `uvx skillz` installs it; the default discovery path is `~/.skillz/`. Users can `ln -s ~/.claude/skills ~/.skillz` and Gemini reads the exact same files. No separate extension repo needed.
3. **Cursor / Aider / Copilot / Zed all read `AGENTS.md` at repo root.** The `AGENTS.md` block we were writing for Codex already covers them.

**Fixes applied:**

- **§8.2.1 matrix rewritten.** The "one canonical SKILL.md + per-agent adapters" phrasing is replaced with "one canonical SKILL.md + thin discovery-path adapters." The `What Atlas ships` column collapses from "three adapter repos" to "one Claude plugin marketplace listing + symlinks + one `AGENTS.md`."
- **§8.2.2 sequence rewritten.** Week 6 becomes "Codex adapter (symlink, not repo)" and documents the `codex_hooks = true` opt-in. Week 7 becomes "Gemini CLI setup doc" (no extension repo).
- **New plan artifact.** [docs/plans/2026-04-17-next-milestone-plan.md](../plans/2026-04-17-next-milestone-plan.md) lands the acceptance test + weekly task checklist + §5 compat table that mirrors this round's conclusions.

**Lesson:** before asserting cross-platform incompatibility in a strategy memo, spend 10 minutes checking each platform's current skill-discovery documentation. Codex shipped `.agents/skills/` as a native convention and the `skillz` MCP server predated this memo — earlier drafts simply did not check.

### 10.8 Round 4 — Gemini mechanism corrected

Round 3 collapsed the cross-agent packaging plan to "one canonical SKILL.md + symlinks," which was the right direction. But the specific Gemini mechanism it cited — the `skillz` community MCP server with discovery at `~/.skillz/` — was wrong. A fourth Codex pass flagged this, verified against the official [Gemini CLI skills documentation](https://geminicli.com/docs/cli/skills/) and [Codex skills documentation](https://developers.openai.com/codex/skills).

**What the Gemini CLI actually does today:**

- Native skill discovery in `.gemini/skills/` **or** `.agents/skills/` at the workspace level, and `~/.gemini/skills/` or `~/.agents/skills/` at the user level. `.agents/skills/` takes precedence — it is the shared "open agent skills" alias ([agentskills.io](https://agentskills.io)) that both Gemini and Codex honor for cross-agent compatibility.
- Install / link commands: `gemini skills install <git-url | local-path | .skill-file>`, `gemini skills link <path>`, `gemini skills list`, `gemini skills enable/disable/uninstall`.
- In-session: `/skills list`, `/skills link`, `/skills enable/disable`.
- Activation: when a task matches a skill's description, Gemini invokes `activate_skill`; on user approval the SKILL.md body + folder structure are added to conversation history.

**Implication:** Gemini needs **no** separate setup step. The same `.agents/skills/research-verification/` directory we mirror for Codex is what Gemini reads. Zero extra files to ship, zero separate docs page, zero MCP server dependency. The packaging surface shrinks one more notch: Claude plugin + shared `.agents/skills/` tree + `AGENTS.md`. That is it.

**Fixes applied:**

- **§8.2.1 matrix rewritten.** Gemini row now describes native `.agents/skills/` discovery with `gemini skills install / link` and `/skills` — no `skillz`, no `~/.skillz`, no `uvx`. `What Atlas ships` for Gemini drops to "zero extra ship work."
- **§8.2.2 sequence rewritten.** Week 7 is now "verify Gemini discovery" (running `gemini skills list` + the acceptance test), not "setup doc for `uvx skillz`."
- **§9.2 sources updated** with the official Gemini and Codex skills docs, plus [agentskills.io](https://agentskills.io).
- **Plan updated.** [docs/plans/2026-04-17-next-milestone-plan.md](../plans/2026-04-17-next-milestone-plan.md) Architecture principle, §3 timeline week 7, §4 task C5, and §5 compat table all switched to the native `.agents/skills/` flow.

**Lesson reinforced:** "it's compatible" is not the same claim as "here's the mechanism." Round 3 got the first right and the second wrong. Strategy memos that prescribe install steps must cite the vendor's skills documentation directly — a community MCP server is not the same as native support, and conflating them invented engineering work that does not need to exist.
