# Task - Release Gate v1

**Phase:** 0.
**Goal:** ship `research-verification` v1.0 from a canonical public repo
with a clean local preflight, a clean public cold-install gate, and a
separate release/announce checkpoint.
**Status:** ACTIVE, 2026-04-18.

## Stage map

The v1 gate now has six stages:

1. **L1-L3 - Local preflight.** Validate the artifact locally before
   any publish or transfer work.
2. **D1 - Canonical publish decision.** Pick the public repo URL that
   v1 will ship from, publish the branch there, and make sure `main`
   at that URL actually contains the plugin/skill payload.
3. **P1-P3 - Public cold-install gate.** Re-run the acceptance corpus
   from fresh sessions against the public URL a real user would install
   from.
4. **P4 - Cross-agent parity.** Compare the three public runs.
5. **P5 - Release mechanics.** Promote CHANGELOG, tag the merged release
   commit, and push the tag.
6. **A1 - Announce + soak.** Publish only after the release commit
   exists and the public gate is green.

## Pre-flight

- [x] Plugin manifest at `.claude-plugin/marketplace.json`
      (identifier `research-atlas`).
- [x] Mechanical mirror `.claude/skills/` -> `.agents/skills/` and
      `plugin/skills/` via `npm run mirror:skills`; drift check in
      `prebuild`.
- [x] Landing-page "Install on your agent" block with Claude / Codex /
      Gemini tabs.
- [x] Announce draft at [`../announce-draft-2026-04.md`](../announce-draft-2026-04.md).
- [x] Run-commands doc at
      [`../references/acceptance-runs/RUN-COMMANDS.md`](../references/acceptance-runs/RUN-COMMANDS.md).
- [x] Local green baseline: `npm run lint`,
      `npm run mirror:skills:check`, `npm run build`.

## Stage L - Local preflight

These runs validate the artifact before we depend on any public repo
URL. They are required before D1.

### L1 - Claude Code local marketplace preflight

- [ ] Open a fresh `claude` session in the repo root.
- [ ] Add the local marketplace from the repo root:
      `/plugin marketplace add ./`
- [ ] Install the plugin:
      `/plugin install research-verification@research-atlas`
- [ ] Run `/skills` to confirm the plugin is active.
- [ ] Paste the full contents of
      `.claude/skills/research-verification/examples/acceptance-corpus.txt`.
- [ ] Issue trigger:
      `verify these references - detailed depth, markdown output`
- [ ] Stopwatch start at Enter, stop at final envelope.
- [ ] Save transcript to
      `docs/references/acceptance-runs/preflight-claude-code.md`
      using the acceptance-runs template.
- [ ] All six pass conditions green.

### L2 - Codex local preflight

- [ ] Open a fresh `codex` session in the repo root.
- [ ] Run `/skills` - confirm `research-verification` appears from
      `.agents/skills/research-verification/`.
- [ ] Paste the corpus + the same trigger prompt.
- [ ] Do NOT set `[features] codex_hooks = true`.
- [ ] Save transcript to
      `docs/references/acceptance-runs/preflight-codex.md`.
- [ ] All six pass conditions green.

### L3 - Gemini local preflight

- [ ] From the repo root, link the workspace skill:
      `gemini skills link .agents/skills/research-verification --scope workspace`
- [ ] Run `gemini skills list` - confirm `research-verification` is
      listed.
- [ ] Start a fresh `gemini` session in the repo root.
- [ ] Paste the corpus + the same trigger prompt. Approve the
      `activate_skill` consent prompt.
- [ ] Save transcript to
      `docs/references/acceptance-runs/preflight-gemini.md`.
- [ ] All six pass conditions green.

**Exit check for Stage L**

- [ ] Three green local-preflight transcripts exist.
- [ ] Any failures were fixed in canonical `.claude/skills/...`,
      mirrors re-synced, and the local preflight was restarted from L1.

## Stage D - Canonical publish decision

The public cold-install gate is invalid until the plugin exists on the
public repo URL users will actually install from.

### D1 - Publish to the canonical public URL

- [ ] Pick the canonical public repo for v1.
      Recommended: transfer to the final `researchatlas` org first.
      Allowed fallback: explicitly defer the transfer and keep
      `HaroldZhong/Research-Atlas` as the v1 canonical URL.
- [ ] If transferring first, execute
      [`track-org-setup.md`](track-org-setup.md) through the transfer +
      URL update steps before continuing.
- [ ] Push `phase-0-1-baseline` to the chosen remote.
- [ ] Open a PR to `main` on that remote.
- [ ] Merge the PR so the canonical public `main` contains:
      `.claude-plugin/marketplace.json`, `plugin/`,
      `.claude/skills/research-verification/`,
      `.agents/skills/research-verification/`, and the docs that define
      the gate.
- [ ] Verify from a clean shell that the canonical URL resolves and
      `main` contains the marketplace file.

**Exit check for Stage D**

- [ ] `origin/main` at the canonical public URL contains the plugin and
      marketplace manifests.
- [ ] Every user-facing install surface points at the same canonical
      repo URL.

## Stage P - Public cold-install gate

These are the release-signoff runs. They must be performed from the
canonical public repo chosen in D1, not from local-only paths.

### P1 - Claude Code public cold-install

- [ ] Open a fresh `claude` session on a clean checkout.
- [ ] Install via plugin:
      `/plugin marketplace add <canonical-owner>/<canonical-repo>`
      then `/plugin install research-verification@research-atlas`.
- [ ] Run `/skills` to confirm the plugin is active.
- [ ] Paste the full corpus + the trigger prompt.
- [ ] Stopwatch start at Enter, stop at final envelope.
- [ ] Save transcript to
      `docs/references/acceptance-runs/claude-code.md`.
- [ ] All six pass conditions green.

### P2 - Codex public cold-install

- [ ] Open a fresh `codex` session in a clean checkout of the canonical
      public repo.
- [ ] Run `/skills` - confirm `research-verification` appears.
- [ ] Paste the corpus + the trigger prompt.
- [ ] Do NOT set `[features] codex_hooks = true`.
- [ ] Save transcript to
      `docs/references/acceptance-runs/codex.md`.
- [ ] All six pass conditions green.

### P3 - Gemini public cold-install

- [ ] From a clean shell, install the skill from the canonical public
      repo:
      `gemini skills install https://github.com/<canonical-owner>/<canonical-repo> --path .agents/skills/research-verification`
- [ ] Run `gemini skills list` - confirm `research-verification` is
      listed.
- [ ] Start a fresh `gemini` session in a clean checkout of the same
      repo.
- [ ] Paste the corpus + the trigger prompt. Approve the consent prompt.
- [ ] Save transcript to
      `docs/references/acceptance-runs/gemini.md`.
- [ ] All six pass conditions green.

### P4 - Cross-agent parity fill-in

- [ ] Compare verdicts per-reference across the three public
      transcripts.
- [ ] Allow +/-1 on known edge cases (Watson-Crick, Turing, Shannon
      have pre-modern DOI schemas some resolvers do not index cleanly).
- [ ] Fill in condition 6 (cross-agent parity) in all three public
      transcripts.
- [ ] Update `docs/references/acceptance-runs/README.md` status -
      flip the public-run checkboxes to `[x]` with dates.

### P5 - Release mechanics

- [ ] Promote `CHANGELOG.md` `[Unreleased]` -> `[1.0.0] - <run date>`.
- [ ] Ensure the release commit is on `main` at the canonical public
      URL.
- [ ] Tag the merged release commit:
      `git tag v1.0.0 -m "research-verification v1.0.0"`
- [ ] Push the tag:
      `git push origin v1.0.0`
- [ ] Flip all `[ ]` items in
      [`../announce-draft-2026-04.md`](../announce-draft-2026-04.md)
      `Do-not-publish checklist` -> `[x]`.
- [ ] Link-check every URL in the announce post (200 status).

## Stage A - Announce + soak

### A1 - Publish the announce after the tag exists

- [ ] Publish announce to Anthropic Claude Code Discussions.
- [ ] 24-hour soak - monitor for P0/P1 bugs, do not publish to other
      venues yet.
- [ ] After 24h green: consider Reddit (r/AcademicAI, r/AskAcademia)
      and Hacker News.

## If any run fails

- **Do not patch-and-retry inside the same gate stage.** A patched
  transcript is not valid evidence.
- Record the failure transcript and note which condition failed.
- Fix in canonical `.claude/skills/research-verification/SKILL.md`.
- Re-sync mirrors: `npm run mirror:skills`.
- Re-run the local smoke chain.
- Restart the gate from **L1**. Once the artifact changes, all later
  gate evidence is stale.

## Exit check

- [ ] Three green local-preflight transcripts in
      `docs/references/acceptance-runs/`.
- [ ] Three green public cold-install transcripts in
      `docs/references/acceptance-runs/`.
- [ ] Tag `v1.0.0` on `origin`.
- [ ] Announce live on Anthropic Discussions.
- [ ] No P0/P1 bugs open after the 24-hour soak.

Exit triggers Phase 1: [`phase-1-harden.md`](phase-1-harden.md).

## Related

- Run commands:
  [`../references/acceptance-runs/RUN-COMMANDS.md`](../references/acceptance-runs/RUN-COMMANDS.md)
- Pass conditions:
  [`../references/acceptance-runs/README.md`](../references/acceptance-runs/README.md)
- Canonical publish / org transfer support:
  [`track-org-setup.md`](track-org-setup.md)
- Phase definition:
  [`../roadmap/phases.md`](../roadmap/phases.md) section Phase 0
- Announce copy:
  [`../announce-draft-2026-04.md`](../announce-draft-2026-04.md)
