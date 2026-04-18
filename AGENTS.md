# AGENTS.md

This file is the agent-facing onboarding guide for Research Atlas (researchatlas.info).
It follows the [open-agent `AGENTS.md` convention](https://agents.md) and is auto-read by
Codex, Cursor, Aider, Copilot, and Zed. Claude Code reads `CLAUDE.md` when present;
in its absence the repo's skill tree at `.claude/skills/` is sufficient.

## What this repo is

- **The website** — a Vite + React 19 + TypeScript + Tailwind + shadcn/ui static site,
  prerendered via `scripts/prerender.mjs`. Deploys to Vercel.
- **A flagship Anthropic Agent Skill** — `research-verification`, the end-to-end
  reference-verification workflow built around the VERIFY framework, CrossRef +
  OpenAlex DOI resolution, and a structured per-reference verdict envelope.

These two things share the repo but live in non-overlapping trees. Choose your lane
before editing.

## Project structure (agent-relevant slice)

```
.
├── .claude/skills/research-verification/      # CANONICAL skill — edit here
│   ├── SKILL.md
│   └── examples/{acceptance-corpus.txt, acceptance-test-transcript.md}
├── .agents/skills/research-verification/      # MIRROR — do not edit directly
├── plugin/                                    # MIRROR — Claude Code plugin packaging
│   ├── .claude-plugin/plugin.json
│   └── skills/research-verification/          # (generated)
├── .claude-plugin/marketplace.json            # marketplace listing for this repo
├── scripts/mirror-skills.mjs                  # canonical -> mirrors; runs in `prebuild`
├── src/                                       # website source (React/TS/Tailwind)
├── scripts/prerender.mjs                      # SSR prerender into dist/
├── docs/plans/                                # milestone plans (mostly private)
└── docs/references/                           # audit + review memos (mostly private)
```

## The "one source of truth" rule for skills

There is ONE canonical skill path: `.claude/skills/research-verification/`. Every
other location (`.agents/skills/…`, `plugin/skills/…`) is a MECHANICAL mirror.

**Do not hand-edit the mirrors.** They are overwritten on every `npm run build`.

After any edit to `.claude/skills/…`:

```sh
npm run mirror:skills        # rewrite mirrors
npm run mirror:skills:check  # CI-friendly check; exits non-zero on drift
```

`prebuild` runs `mirror:skills:check` — drift fails the build loudly instead of
silently shipping stale mirrors.

## Development commands

- `npm run dev` — Vite dev server
- `npm run build` — client build + SSR prerender + SEO smoke (runs mirror check first)
- `npm run lint` — ESLint
- `npm run mirror:skills` — rewrite skill mirrors
- `npm run mirror:skills:check` — assert mirrors are in sync
- `npm run validate:envelopes` — validate any saved
  `*.envelope.json` under `docs/references/acceptance-runs/`
  against schema_version 2 (+ `verdicts_complete` invariant). Part
  of `prebuild`; tolerant when no envelopes are committed yet.
- `npm run grade:acceptance:fixtures` — smoke-test the acceptance
  grader on the mini fixtures. For a real run, invoke
  `node scripts/grade-acceptance.mjs <envelope.json>
  <ground-truth.json> --elapsed-minutes=N` (or `--parity` with 3+
  envelopes). See
  [`docs/references/eval-harness/README.md`](docs/references/eval-harness/README.md).

## Prompt caching

Harness authors: see [docs/references/caching.md](docs/references/caching.md)
for where to place cache breakpoints so SKILL.md bodies and loaded
`references/` stay warm across a session. Short version: one
breakpoint directly after the skill body; per-query references go
after it; corpus inputs always in `messages`, never `system`.

## Testing

- Website: verify visually (`npm run dev`) — no automated UI tests yet.
- Skill: run the 30-reference acceptance corpus at
  `.claude/skills/research-verification/examples/acceptance-corpus.txt` in a fresh
  agent session. All six pass conditions in the corpus header must hold.

## Agent-specific notes

### Claude Code

- Installed locally: the skill at `.claude/skills/research-verification/` is
  auto-discovered. Invoke by prompt ("verify these references") or via `/skills`.
- Installed by others: via the plugin marketplace ->
  `/plugin marketplace add researchatlas/researcher-prompt-hub` then
  `/plugin install research-verification@research-atlas`.

### Codex CLI

- Skill discovery path: `.agents/skills/research-verification/` — native, no
  configuration required. Works when Codex is launched from any directory inside
  this repo (including subdirectories — Codex walks up to the repo root).
- Invocation inside a session: `$research-verification` or the `/skills` selector.
- Auto-match by description is also supported; Codex will surface the skill when
  a user prompt matches its `description` field in the YAML frontmatter.
- **Hooks are opt-in.** If you want the skill to run on save, on file open, or
  on any other lifecycle event, add to `~/.codex/config.toml` (or the repo-local
  `.codex/config.toml`):
  ```toml
  codex_hooks = true
  ```
  This repo does not ship a hook. The flag is documented here so power users can
  wire their own. Default is `false`.

### Gemini CLI

- Skill discovery path: `.agents/skills/research-verification/` — native via the
  shared open-agent-skills alias. Takes precedence over `.gemini/skills/`.
- Verification command: `gemini skills list` should show `research-verification`
  after Gemini is launched inside this repo.
- **Invocation is prompt-driven, not selector-driven.** Issue a user-facing prompt
  that matches the skill's description (e.g. "verify these references"); Gemini
  calls `activate_skill` and presents a consent prompt. On approval, the SKILL.md
  body enters the conversation.
- `/skills` in Gemini is a MANAGEMENT surface — `list`, `link`, `enable`, `disable`,
  `reload`. It is not an activation selector.
- For a remote install pointing at this monorepo:
  ```sh
  gemini skills install https://github.com/researchatlas/researcher-prompt-hub \
    --path .agents/skills/research-verification
  ```
  The `--path` flag is required — without it, Gemini tries to install the whole
  repo as a skill and fails. For a local install against a working copy:
  `gemini skills link .agents/skills/research-verification --scope workspace`.

### Cursor / Aider / Copilot / Zed

- No native skill discovery. Read this file and the canonical SKILL.md directly.
- Trigger phrases are listed in the skill's `description` field.

## What I (the agent) am probably being asked to do

If you were dropped into this repo to work on a task, the task is likely one of:

1. **Edit the skill.** Change `.claude/skills/research-verification/SKILL.md` (and
   any `examples/`), then run `npm run mirror:skills` before staging. Do not touch
   the mirror paths directly.
2. **Edit the website.** Change files under `src/`. Verify by running `npm run dev`
   and checking the feature in a browser. `npm run build` is the CI gate.
3. **Publish the plugin.** `plugin/` is a self-contained Claude Code plugin payload
   ready to either (a) be registered as a single-plugin marketplace from this repo
   via `.claude-plugin/marketplace.json`, or (b) be copied into a dedicated
   `researchatlas/plugins` marketplace repo when that exists.

When in doubt about scope, check `docs/plans/` for the current milestone plan.
