# Acceptance Run — exact commands for each agent

> Run date target: 2026-04-17. Execute in order: Claude Code → Codex → Gemini.
> Each run is an **independent fresh session** in this repo root. Do not reuse
> the session from a prior run. Transcript gets saved to `<agent>.md` in this
> directory.

## Shared prerequisites (run once, before any agent)

```bash
# from repo root: E:\Researcher Prompt Hub
npm run lint
npm run mirror:skills:check
npm run build
```

All three must pass. Current baseline (2026-04-17) is green: lint 0 errors,
mirror in sync, build + SEO smoke clean on 29 routes.

The 30-reference corpus lives at
`.claude/skills/research-verification/examples/acceptance-corpus.txt` (92 lines
including comments; parser ignores `#` lines). Copy-paste the **full file**
into each agent session — do not trim.

Trigger prompt (identical across agents):

```
verify these references — detailed depth, markdown output
```

Stopwatch starts when you hit Enter on the prompt, stops when the agent
emits the final envelope.

---

## 1. Claude Code run

Target transcript: `docs/references/acceptance-runs/claude-code.md`.

### Option A — via installed plugin (closer to end-user path)

In a **new terminal**, from the repo root:

```bash
claude
```

Then inside the Claude Code session:

```
/plugin marketplace add researchatlas/researcher-prompt-hub
/plugin install research-verification@research-atlas
/skills
```

Confirm `research-verification` appears in `/skills` output. Then paste the
corpus contents, followed by the trigger prompt on its own line.

### Option B — via in-repo canonical skill (no plugin install)

```bash
claude
```

Claude Code auto-discovers `.claude/skills/research-verification/SKILL.md`
from the working directory. Paste corpus + trigger. If the skill doesn't
auto-select, run `/skills` and pick `research-verification` explicitly.

**Recommended: Option A** — tests the same path a new user would take.

### Capture

Save the full session transcript to `docs/references/acceptance-runs/claude-code.md`
using the template in `README.md`. Fill in:
- Date, agent version (`claude --version`), skill version (2.1.0)
- Start/end timestamps
- Six pass conditions table
- Per-reference verdict tally
- Raw YAML/JSON envelope from the final response
- Any manual nudges or deviations

---

## 2. Codex CLI run

Target transcript: `docs/references/acceptance-runs/codex.md`.

In a **new terminal**, from the repo root:

```bash
codex
```

Inside Codex:

```
/skills
```

Confirm `research-verification` is listed (native discovery from
`.agents/skills/research-verification/SKILL.md`). Then paste corpus + trigger.
If auto-match doesn't fire, invoke explicitly:

```
$research-verification

<paste corpus here>

verify these references — detailed depth, markdown output
```

### Hooks

Do **NOT** set `[features] codex_hooks = true` for this run — we want the
clean invocation path, and Codex hooks are experimental + disabled on
Windows anyway.

### Capture

Save to `docs/references/acceptance-runs/codex.md` using the same template.
Note Codex CLI version from `codex --version`.

---

## 3. Gemini CLI run

Target transcript: `docs/references/acceptance-runs/gemini.md`.

### One-time install (if not already installed)

```bash
gemini skills install https://github.com/researchatlas/researcher-prompt-hub \
  --path .agents/skills/research-verification
gemini skills list
```

Confirm `research-verification` is listed. (Alternative for local dev:
`gemini skills link .agents/skills/research-verification --scope workspace`.)

### Run

In a **new terminal**, from the repo root:

```bash
gemini
```

Inside Gemini, paste corpus + trigger. Gemini will call `activate_skill` and
prompt for consent — **approve** the skill activation.

Do NOT use `/skills` to activate — that surface is management-only in Gemini.
Activation is prompt-driven.

### Capture

Save to `docs/references/acceptance-runs/gemini.md`. Note Gemini CLI version
from `gemini --version`.

---

## After all three runs

1. Fill in the **cross-agent parity** row (condition 6) in all three
   transcripts — compare verdicts per-reference, allow ±1 on edge cases
   (Watson-Crick, Turing, Shannon have pre-modern DOI schemas that some
   resolvers do not index cleanly).
2. Update `README.md` status section: flip the three `[ ]` checkboxes to
   `[x]` with dates.
3. Update `docs/plans/2026-04-17-next-milestone-plan.md` Release Gate section
   (RG1–RG5).
4. Promote `CHANGELOG.md` `[Unreleased]` → `[1.0.0] — 2026-04-17` (or run
   date).
5. Uncheck the first three `[ ]` items in `docs/announce-draft-2026-04.md`
   `Do-not-publish checklist` — flip to `[x]`.
6. Tag release, then publish announce to Anthropic Discussions first
   (24-hour soak), then consider Reddit + HN.

## If a run fails

Do not patch-and-retry silently. Record the failure transcript, note which
of the six conditions failed, open an issue, and only re-run after an
intentional fix lands in the canonical SKILL.md (and mirrors re-synced).
The release gate is worthless if we iterate inside it.
