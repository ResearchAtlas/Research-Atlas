# Acceptance Run - exact commands for each stage

> Execute in order: local preflight (L1-L3) -> canonical publish (D1) ->
> public cold-install gate (P1-P3) -> parity (P4) -> release mechanics (P5) ->
> announce (A1).
>
> Every agent run is an independent fresh session. Do not reuse the
> prior agent session inside a gate. If the artifact changes, restart
> from L1.

## Shared prerequisites

Run once from repo root before any gate work:

```bash
# from repo root: E:\Researcher Prompt Hub
npm run lint
npm run mirror:skills:check
npm run build
```

All three must pass.

The 30-reference corpus lives at:

`E:\Researcher Prompt Hub\.claude\skills\research-verification\examples\acceptance-corpus.txt`

Copy-paste the **full file** into each agent session. Do not trim the
comment lines.

Use this trigger prompt in every agent run:

```text
verify these references - detailed depth, markdown output
```

Start the stopwatch when you press Enter on the prompt. Stop it when
the agent emits the final envelope.

## Canonical publish variable

Before P1-P3, decide the public repo that v1 ships from.

Use this variable in the commands below:

```text
<CANONICAL_REPO> = <owner>/<repo>
```

Examples:

- `researchatlas/Research-Atlas` if you transfer first
- `HaroldZhong/Research-Atlas` if you explicitly defer the transfer

## Stage L - Local preflight

These runs validate the artifact locally before any public publish.

### L1 - Claude Code local marketplace preflight

Target transcript:
`docs/references/acceptance-runs/preflight-claude-code.md`

In a new terminal from the repo root:

```bash
claude --version
claude
```

Inside Claude Code:

```text
/plugin marketplace add ./
/plugin install research-verification@research-atlas
/skills
```

Confirm `research-verification` appears in `/skills`. Then paste:

1. the full corpus contents
2. the trigger prompt on its own line

### L2 - Codex local preflight

Target transcript:
`docs/references/acceptance-runs/preflight-codex.md`

In a new terminal from the repo root:

```bash
codex --version
codex
```

Inside Codex:

```text
/skills
```

Confirm `research-verification` appears. Then paste the corpus +
trigger.

If auto-match does not fire, invoke explicitly:

```text
$research-verification
```

Then paste the corpus + trigger.

Do **not** enable `codex_hooks` for this run.

### L3 - Gemini local preflight

Target transcript:
`docs/references/acceptance-runs/preflight-gemini.md`

From the repo root:

```bash
gemini --version
gemini skills link .agents/skills/research-verification --scope workspace
gemini skills list
```

Confirm `research-verification` is listed.

Then start a fresh Gemini session:

```bash
gemini
```

Inside Gemini, paste the corpus + trigger. Approve the `activate_skill`
consent prompt.

Do not use `/skills` to activate the skill. Gemini activation is
prompt-driven.

## Stage D - Canonical publish

### D1 - Publish the artifact to the final public repo

Recommended path: transfer to the final `researchatlas` org first.
Fallback path: explicitly defer transfer and use
`HaroldZhong/Research-Atlas` for v1.

Required state before P1-P3:

1. The chosen public repo exists.
2. Its `main` branch contains:
   - `.claude-plugin/marketplace.json`
   - `plugin/.claude-plugin/plugin.json`
   - `.claude/skills/research-verification/`
   - `.agents/skills/research-verification/`
3. Every user-facing install surface points at the same
   `<CANONICAL_REPO>`.

If you choose the org-transfer path, execute
[`../../tasks/track-org-setup.md`](../../tasks/track-org-setup.md)
through the transfer + surface-update steps before continuing.

## Stage P - Public cold-install gate

These runs are the actual release-signoff evidence.

### P1 - Claude Code public cold-install

Target transcript:
`docs/references/acceptance-runs/claude-code.md`

In a new terminal from a clean checkout of `<CANONICAL_REPO>`:

```bash
claude --version
claude
```

Inside Claude Code:

```text
/plugin marketplace add <CANONICAL_REPO>
/plugin install research-verification@research-atlas
/skills
```

Confirm `research-verification` appears. Then paste the corpus +
trigger.

### P2 - Codex public cold-install

Target transcript:
`docs/references/acceptance-runs/codex.md`

In a new terminal from a clean checkout of `<CANONICAL_REPO>`:

```bash
codex --version
codex
```

Inside Codex:

```text
/skills
```

Confirm `research-verification` appears. Then paste the corpus +
trigger.

If auto-match does not fire, invoke explicitly with
`$research-verification`, then paste the corpus + trigger.

Do **not** enable `codex_hooks` for this run.

### P3 - Gemini public cold-install

Target transcript:
`docs/references/acceptance-runs/gemini.md`

From a clean shell:

```bash
gemini --version
gemini skills install https://github.com/<CANONICAL_REPO> --path .agents/skills/research-verification
gemini skills list
```

Confirm `research-verification` is listed.

Then start a fresh Gemini session from a clean checkout of the same
repo:

```bash
gemini
```

Inside Gemini, paste the corpus + trigger. Approve the `activate_skill`
consent prompt.

## Capture instructions

Use the transcript template in
[`README.md`](README.md) for both preflight and public runs.

For every transcript, record:

- Date
- Agent version (`<agent> --version`)
- Skill version (2.1.0)
- Start and end timestamps
- Elapsed minutes
- Six pass conditions table
- Verdict tally
- Raw final envelope
- Any human nudges or deviations

## P4 - Cross-agent parity

After the three public runs exist:

1. Compare verdicts per-reference across Claude, Codex, and Gemini.
2. Allow +/-1 on edge cases (Watson-Crick, Turing, Shannon).
3. Fill in condition 6 in all three public transcripts.
4. Update `README.md` status section.

If you save final envelopes as JSON, you can also run:

```bash
node scripts/grade-acceptance.mjs --parity \
  docs/references/acceptance-runs/claude-code.envelope.json \
  docs/references/acceptance-runs/codex.envelope.json \
  docs/references/acceptance-runs/gemini.envelope.json \
  .claude/skills/research-verification/examples/acceptance-ground-truth.json
```

## P5 - Release mechanics

After P1-P4 are green:

```bash
git checkout main
git pull --ff-only
git tag v1.0.0 -m "research-verification v1.0.0"
git push origin v1.0.0
```

Also:

1. Promote `CHANGELOG.md` `[Unreleased]` -> `[1.0.0] - <run date>`.
2. Flip the announce draft checklist to `[x]`.
3. Link-check the announce URLs.

## A1 - Announce

1. Publish to Anthropic Claude Code Discussions.
2. Wait 24 hours.
3. If no P0/P1 regressions appear, consider Reddit + HN.

## If any run fails

Do not patch-and-retry inside the same gate stage.

1. Save the failing transcript.
2. Note which pass condition failed.
3. Fix canonical `.claude/skills/research-verification/SKILL.md`.
4. Re-run:

```bash
npm run mirror:skills
npm run lint
npm run grade:acceptance:fixtures
npm run test:hook:smoke
npm run validate:envelopes:fixtures
npm run prebuild
```

5. Restart from **L1**. Once the artifact changes, all later evidence is
   stale.
