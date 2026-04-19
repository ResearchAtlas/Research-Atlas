# Research Atlas — docs

This is the canonical home for Atlas planning, strategy, and release
artifacts. The repo also ships a React/Vite site and a skill/plugin bundle;
this directory is the narrative layer on top.

## Layout

```
docs/
├── README.md                     # this file
├── announce-draft-2026-04.md     # L1/L2 announce copy for v1 launch
├── plans/                        # time-stamped execution plans (keep dated)
├── references/                   # review memos + acceptance-run transcripts
├── roadmap/                      # north-star + 12-month phase plan (living)
└── tasks/                        # per-phase task checklists (living)
```

## Where to start

- **Shipping v1 right now?** Go to [tasks/release-gate-v1.md](tasks/release-gate-v1.md).
  That's the active punch list. It links to the acceptance-run protocol at
  [references/acceptance-runs/RUN-COMMANDS.md](references/acceptance-runs/RUN-COMMANDS.md).
- **Why does Atlas exist?** [roadmap/north-star.md](roadmap/north-star.md).
  Atlas is an evidence operating system for researchers, not a prompt hub.
- **What are we building, in what order?** [roadmap/phases.md](roadmap/phases.md).
  Six phases, Q2 2026 → Q1 2027.
- **How does it fit together?** [roadmap/architecture.md](roadmap/architecture.md).
  Four layers: Atlas Web, Atlas Skills, Atlas Evidence Runtime, Atlas MCP.
- **How do we make go/no-go calls?** [roadmap/decision-gates.md](roadmap/decision-gates.md).
  Explicit branch points, not a linear march.
- **What else is in this space?** [roadmap/competitive-landscape.md](roadmap/competitive-landscape.md).
  Where Atlas overlaps and where it differentiates.

## Doc conventions

- **`plans/` is append-only and dated.** A plan is a snapshot of intent at
  a point in time. When strategy changes, supersede with a new dated plan;
  do not rewrite history in-place.
- **`roadmap/` and `tasks/` are living.** These reflect current intent and
  are edited freely. Archive to `plans/<date>-<topic>.md` when a plan fully
  supersedes a roadmap doc.
- **`references/` is evidence.** Review memos from external reviewers,
  transcripts from acceptance runs, research scans. Never delete.
- **Dates everywhere.** Every doc opens with a status line:
  `Status: DRAFT|ACTIVE|SUPERSEDED, YYYY-MM-DD`. Supersede with a
  backlink.
- **Keep the skill library scope clean.** Third-party skills installed
  globally (`vercel-react-best-practices`, `web-design-guidelines`) are not
  Atlas skills. They help Claude review the Atlas frontend. Do not include
  them in scope for any Atlas roadmap.

## Related artifacts outside `docs/`

- `AGENTS.md` — repo-root onboarding for Claude / Codex / Gemini / Cursor.
- `CHANGELOG.md` — shipped changes per version.
- `.claude/skills/` — canonical skill sources (10 skills today; see
  `.claude/skills/EVALUATION_REPORT.md` for v2.0.0 scorecards).
- `.agents/skills/` + `plugin/skills/` — mechanical mirrors, sync via
  `npm run mirror:skills`.
- `.claude-plugin/marketplace.json` — the single-plugin marketplace
  (identifier: `research-atlas`).

## Status snapshot (2026-04-18)

- Flagship skill `research-verification` v2.1.0 is **staged for release**:
  plugin manifest, mirrors, landing page install block, and announce
  draft are in place. **Not yet released** — `CHANGELOG.md` still under
  `[Unreleased]`, no `v1.0.0` tag, live acceptance gate open.
- Release gate pending in
  [tasks/release-gate-v1.md](tasks/release-gate-v1.md) — local
  preflight (Claude Code, Codex, Gemini), then canonical publish,
  then the public cold-install gate, then release + announce.
- Skill library: 10 skills in canonical tree. `research-verification` is
  at the publish bar (pending the gate above). `literature-review` is
  the active Tier 2 promotion target (Phase 2). The remaining eight stay
  as Tier 3 prompt-grade reference material until a real promotion plan
  lands.
