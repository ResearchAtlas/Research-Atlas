# Task — Phase 5: Atlas MCP Pilot + `data-analysis` Feasibility

**Phase:** 5.
**Goal:** stand up the Atlas MCP read-only pilot, and make an explicit
go/no-go call on `data-analysis`.
**Status:** PENDING.
**Budget:** 4–6 weeks.

## Part A — Atlas MCP read-only pilot

### Positioning reminder

The moat is the **provenance layer**, not raw data. CrossRef, OpenAlex,
Semantic Scholar already have MCP servers. Atlas MCP exposes:

- The **evidence graph** (references ↔ claims ↔ manuscripts, edges
  typed: cites, verified-by, disputes, supersedes).
- The **verdict ledger** (every `research-verification` run logged
  with envelope hash + resolver traces).
- The **audit records** (who ran what, against what corpus).

If the pilot is just a CrossRef proxy, we've missed the point.

### T1 — Storage + schema

- [ ] Pick storage. Options to evaluate:
  - **Neon Postgres** (Vercel Marketplace integration) — richer queries,
    graph-friendly, first-class Vercel integration. Likely default.
  - **Cloudflare D1** (SQLite, external to Vercel) — simple, low ops,
    but treat as an external dependency since D1 is a Cloudflare
    product, not a Vercel-native offering. Accept the cross-provider
    operational cost before picking it.
  - **Cloudflare R2 or Vercel Blob** for raw-envelope blob storage,
    paired with whichever SQL/Postgres option is picked for metadata.
- [ ] Write schema: `runs`, `verdicts`, `references`, `manuscripts`,
      `edges`. See
      [`../roadmap/architecture.md`](../roadmap/architecture.md) §4.
- [ ] Seed with the three Phase 0 + two Phase 2 + five Phase 4
      acceptance transcripts. Those become the first verdict
      ledger entries.

### T2 — MCP service

- [ ] Repo: `researchatlas/mcp`.
- [ ] Runtime: Vercel with Fluid Compute. Node 24 LTS.
- [ ] Framework: the official MCP TypeScript SDK for servers.
- [ ] Tools exposed (read-only):
  - `lookup_verdict(reference)` — return latest verdict envelope +
    provenance for a DOI / title / author.
  - `search_evidence_graph(query)` — return references + verdict
    nodes matching a topical query.
  - `get_audit_trail(run_id)` — return the full provenance chain
    for a specific run.
- [ ] Auth: none for read-only pilot. Rate-limit by IP.
- [ ] Deploy to `mcp.researchatlas.info` (subdomain of existing
      site domain).
- [ ] Public-docs page at `researchatlas.info/mcp` describing the
      surface.

### T3 — Integration smoke test

- [ ] Configure an MCP client (e.g. Claude Code via settings) to
      point at the pilot endpoint.
- [ ] Run a research session that calls
      `lookup_verdict` mid-generation. Capture transcript.
- [ ] Validate: the call returns provenance records, not just raw
      data. The differentiator is visible.

### T4 — Pilot success check

- [ ] One external MCP client successfully queries the endpoint.
- [ ] Zero auth bypass attempts succeed.
- [ ] Rate-limit holds under a basic load test (100 req/min from
      one IP → throttled).
- [ ] Public-docs page live.

### T5 — Post-pilot decision gate

After the pilot runs for 30 days:

- [ ] Evaluate uptake: how many distinct client queries in that
      window?
- [ ] Evaluate abuse surface: any poisoning attempts? Spam?
- [ ] Decide on write paths. See
      [`../roadmap/decision-gates.md`](../roadmap/decision-gates.md)
      §Atlas-MCP-write-paths.
- [ ] Document the call with a dated entry.

## Part B — `data-analysis` feasibility

### T6 — Sandbox tooling survey

Evaluate three paths for running statistical checks in a portable,
agent-callable way.

- [ ] **Vercel Sandbox.** Vendor-hosted, GA January 2026. Read
      current docs at https://vercel.com/docs/sandbox. Prototype a
      minimal "run Python to compute mean + SD" call from within a
      Claude Code session and measure latency + cost + authorship
      attribution.
- [ ] **Python MCP server(s).** Survey what's available. Run a
      minimal statistical check. Measure same metrics.
- [ ] **User-local Jupyter.** Via a connector skill that sends code
      to the user's running kernel. Simplest, least portable. Test
      feasibility.
- [ ] Compile matrix: tool, latency, cost, portability, reliability.

### T7 — Acceptance corpus feasibility

- [ ] Assemble 5 labeled datasets with known correct test choices
      (parametric t-test on normal+equal-var, Mann-Whitney on
      skewed, repeated-measures ANOVA on longitudinal, chi-square
      on categorical, Kruskal-Wallis on non-parametric multi-group).
- [ ] For each: define ground-truth outputs (correct test name,
      assumption-check verdicts, p-value within tolerance).
- [ ] Estimate effort to generate + verify this corpus at scale.

### T8 — Go/no-go decision

- [ ] If sandbox path is rock-solid and corpus effort is
      tractable: schedule `data-analysis` v1.0 as a dedicated
      skill-promotion task after Phase 6, with its own task doc.
      It does NOT get a numbered phase of its own — it plugs into
      the annual Tier 3 review gate in
      [`../roadmap/decision-gates.md`](../roadmap/decision-gates.md)
      §Tier-3-backlog-promotion.
- [ ] If sandbox is fragile or falls back to prompt-only when
      unreachable: backlog. Atlas does not ship skills that
      silently degrade. Revisit at next annual planning.
- [ ] Document decision in
      [`../roadmap/decision-gates.md`](../roadmap/decision-gates.md)
      §data-analysis-feasibility.

## Exit check

- [ ] Atlas MCP pilot live at `mcp.researchatlas.info` with at
      least one external client verified.
- [ ] 30-day pilot results documented.
- [ ] `data-analysis` go/no-go decision logged.

Exit triggers Phase 6 (task-first website rebuild, parallel track)
and feeds into the annual Tier 3 review gate (Q1 2027).

## Related

- Phase definition: [`../roadmap/phases.md`](../roadmap/phases.md) §Phase-5
- Architecture (MCP layer):
  [`../roadmap/architecture.md`](../roadmap/architecture.md) §4
- Decision gates:
  [`../roadmap/decision-gates.md`](../roadmap/decision-gates.md)
- MCP architecture spec:
  https://modelcontextprotocol.io/specification/2024-11-05/architecture/index
