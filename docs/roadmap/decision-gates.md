# Decision Gates

**Status:** ACTIVE, 2026-04-17. Cross-referenced from
[`phases.md`](phases.md).

A decision gate is a point in the plan where the right call depends on
evidence we don't have yet. At each gate we pause, collect the
evidence the gate asks for, and make an explicit call — not an
assumption. This doc tracks the gates, their trigger phase, the
evidence we need, and the possible outcomes.

When a gate fires, update this doc in place with the decision and the
date. Do not rewrite history — add a dated entry under the gate's
"Decisions log" section.

## Gate: Phase-3 split (skills repo)

**Fires at end of:** Phase 2 (after plugin #2 `literature-review`
ships).

**The question.** Should Atlas skills live in a dedicated
`researchatlas/skills` repo instead of the current monorepo?

**Evidence to collect before deciding:**
1. Install-friction data on the monorepo-as-marketplace pattern from
   the first 30 days of Phase 2. How many users hit issues?
2. Maintenance cost of two plugins in one repo. Did mirror syncs slow
   down? Did CI get slower?
3. Any end-user confusion about the install URL
   (the current monorepo slug — `HaroldZhong/Research-Atlas` pre-org
   transfer, or `researchatlas/<slug>` post-transfer — resolving to
   marketplace identifier `research-atlas`).
4. Any pull requests from external contributors. Is the monorepo
   scaring them off?

**Possible outcomes:**

- **Split now.** Create `researchatlas/skills`. Website stays at the
  old URL. Install URL changes; marketplace identifier unchanged.
  Detailed execution plan lands in
  [`../tasks/phase-3-runtime-and-split.md`](../tasks/phase-3-runtime-and-split.md).
- **Defer.** Explicitly defer to Phase 4 exit. Not "we'll see later" —
  a dated deferral with a re-check trigger.
- **Never.** If the monorepo is stable through 3+ plugins, split may
  become net-negative. Close the gate and stop revisiting.

**Default bias:** defer. Splitting pre-emptively reverses the
already-staged monorepo strategy before it has earned real signal. See
[`../plans/2026-04-17-skill-library-maturity.md`](../plans/2026-04-17-skill-library-maturity.md)
§5.

**Decisions log:** (none yet)

## Gate: `literature-review` promotion vs. `paper-citation-ledger` carve-out

**Fires at start of:** Phase 2 scoping (within 1 day of entry).

**The question.** Is `literature-review` rich enough that promoting it
to Tier 1 is the right Phase 2 move, or do we carve out
`paper-citation-ledger` as a narrow sibling skill instead?

**Evidence to collect:**
1. Scoping pass on `literature-review`'s four tasks (search,
   citation_audit, gap_analysis, synthesis). Which tasks are
   tool-backed today, which are prompt-only?
2. Estimate of acceptance-corpus effort for the full skill vs. the
   carve-out.
3. User signal on which task actually gets used — look at workflow
   page analytics if instrumented.

**Possible outcomes:**

- **Full promotion.** Wire all four tasks, build the 3+2 corpus, ship
  as `literature-review` v1.0.
- **Carve-out.** Ship `paper-citation-ledger` as the narrow sibling
  covering only the citation-hygiene task. `literature-review` stays
  Tier 3. Lower-risk, faster.

**Default bias:** full promotion. It's the bigger bet and the one that
matches the "Build Literature Review" outcome-first entry point in
[`north-star.md`](north-star.md). Only carve out if the scoping pass
reveals the corpus effort is prohibitive.

**Decisions log:** (pending — fires when Phase 2 opens)

## Gate: `data-analysis` feasibility

**Fires at:** Phase 5 midpoint.

**The question.** Can `data-analysis` clear the Tier 1 publish bar,
given that it requires a sandboxed code-execution environment?

**Evidence to collect:**
1. Sandbox tool survey results. Options on the table:
   - **Vercel Sandbox.** Vendor-hosted, GA since January 2026.
   - **Python MCP server(s).** User-hosted, varying maturity.
   - **User-local Jupyter via a connector skill.** Simplest, least
     portable.
2. Latency + cost envelope for a representative statistical check.
3. Acceptance corpus feasibility — can we assemble ground-truth
   labeled datasets for parametric/nonparametric/regression tests?

**Possible outcomes:**

- **Ship.** Wire to the chosen sandbox, build the corpus, run the
  acceptance gate. Schedule `data-analysis` v1.0 for Phase 6 or Phase
  7.
- **Backlog.** Keep `data-analysis` as Tier 3. Revisit at the next
  annual planning cycle.

**Default bias:** depends heavily on sandbox maturity at the time.
Atlas does not want to ship a skill that silently falls back to
prompt-only when the sandbox is unreachable. If the sandbox path is
not rock-solid, backlog.

**Decisions log:** (pending — fires at Phase 5)

## Gate: Atlas MCP write paths

**Fires at:** Phase 5 exit (after read-only pilot).

**The question.** Should Atlas MCP expose write paths so external
agents can log runs into the Atlas verdict ledger?

**Evidence to collect:**
1. Read-only pilot uptake. Did any external agent integrate?
2. Abuse-surface analysis. A writeable MCP is a public-write endpoint.
   What are the spam/poisoning risks?
3. Rate-limit + auth model feasibility.
4. Legal/consent model for user-submitted verdicts — who owns them?

**Possible outcomes:**

- **Ship write paths, auth-gated.** Writes require Atlas account +
  rate limits + provenance signing.
- **Stay read-only permanently.** Writes happen only through Atlas Web
  signed-in flows, not through MCP.

**Default bias:** read-only permanently unless there's clear external
demand AND a clean abuse model. Making a public-write evidence ledger
is a magnet for provenance poisoning.

**Decisions log:** (pending — fires after Phase 5)

## Gate: Tier 3 backlog promotion (annual review)

**Fires:** once a year, starting Q1 2027.

**The question.** Of the remaining Tier 3 skills (`academic-writing`,
`research-discovery`, `research-ideation`, `research-reproducibility`,
`figure-table-craft`, `latex-polish`), which (if any) earn a
promotion slot?

**Evidence to collect:**
1. `/skills` and `/workflows` analytics. Which Tier 3 pages get the
   most traffic?
2. Install analytics if Tier 1 plugins have usage telemetry by then.
3. User feedback on gaps that a Tier 3 promotion would close.
4. Corpus feasibility per candidate.

**Possible outcomes:**

- **Promote one.** Start a Phase-2-style promotion for the winner.
- **Promote none.** Atlas's quality bar is high; stagnating at four
  Tier 1 skills is better than shipping a weak fifth.
- **Retire a Tier 3.** If a skill has zero traffic and clearly
  duplicates a Tier 1, delete it rather than pretending it's backlog.

**Default bias:** promote none. The Tier 3 skills exist as
prompt-grade reference material; they're useful as-is. Promotion is
expensive and the current Tier 1 surface already covers the core
workflows.

**Decisions log:** (pending — fires Q1 2027)

## How to read these gates

Every gate has:
- A trigger phase (when the gate fires).
- A question.
- Evidence to collect (empirical, not opinion).
- A fixed set of possible outcomes.
- A default bias (not a default answer).
- A decisions log (dated entries when the gate fires).

A gate is closed only by writing an entry in the decisions log.
"Pending" is a valid state indefinitely — gates that haven't fired
yet haven't failed; they just haven't happened.
