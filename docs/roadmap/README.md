# Roadmap

This folder holds Atlas's north-star vision, architecture, 12-month phase
plan, decision gates, and competitive context. It is **living** — edits
land here directly. Dated snapshots live in [`../plans/`](../plans/).

## Files

| File | Purpose |
|---|---|
| [north-star.md](north-star.md) | What Atlas ultimately is, the product promise, and the three caveats on the "submission-safe" framing. |
| [architecture.md](architecture.md) | Four-layer architecture: Atlas Web, Atlas Skills, Atlas Evidence Runtime, Atlas MCP. |
| [phases.md](phases.md) | Six phases from now through Q1 2027 with entry criteria, scope, and exit criteria. |
| [decision-gates.md](decision-gates.md) | Explicit branch points where the roadmap forks. Do not auto-advance. |
| [github-organization.md](github-organization.md) | `researchatlas` GitHub org: naming, repo inventory, visibility, access, migration triggers. |
| [competitive-landscape.md](competitive-landscape.md) | Who else plays in evidence-backed research AI, and Atlas's specific wedge. |

## How to use this folder

- **Reading order for new contributors:** north-star → architecture →
  phases → decision-gates → competitive-landscape.
- **Reading order for "what do I work on":** go to
  [`../tasks/`](../tasks/), start at the phase that matches current state.
- **Changes to this folder** should be small and justified. The roadmap is
  a claim about the future; the more we rewrite it, the less trust it
  earns. If a rewrite is large, capture it as a dated plan in
  [`../plans/`](../plans/) first, then fold into the roadmap once it has
  settled.

## What this folder is NOT

- It is not a commitment schedule. Phase calendars are
  best-guess, adjusted at each decision gate.
- It is not a backlog. Backlog items live in
  [`../tasks/`](../tasks/) per phase.
- It is not a feature spec. Feature specs live alongside the code they
  describe.
