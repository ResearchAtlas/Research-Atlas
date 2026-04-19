# Task — GitHub Organization Setup

**Track:** post-v1-release-gate. This is the first work item that
fires after RG1–RG5 in
[`../plans/2026-04-17-next-milestone-plan.md`](../plans/2026-04-17-next-milestone-plan.md)
close green.
**Goal:** stand up the `researchatlas` GitHub organization and
transfer `HaroldZhong/Research-Atlas` into it, so Atlas can grow into
multi-repo territory under the product brand.
**Status:** ACTIVE, 2026-04-18. Blocked on v1 release gate closing.

## Why this track exists as its own doc

Research Atlas currently ships from `github.com/HaroldZhong/Research-Atlas`
— a **personal GitHub account**, not an org. The target is a dedicated
`researchatlas` org hosting the monorepo and all future Atlas repos
(see [`../roadmap/github-organization.md`](../roadmap/github-organization.md)
for layout and rationale, including the 2026-04-18 decision to defer
the transfer until v1 has shipped).

**Order of operations:**
1. v1 (`research-verification`) finishes the release gate on the
   current slug.
2. This task runs: create the org, transfer the repo, update shipped
   surfaces, verify cold install.
3. Future phase-gate work creates additional repos (`skills`,
   `evidence-runtime`, `mcp`, `corpora`) directly in the org.

This track **does not gate v1.** It is the first post-gate cleanup.

## Step 1 — Verify target namespace availability

- [ ] Check whether `github.com/researchatlas` is claimed today. Visit
      the URL in an incognito window. Three possible outcomes:
      - **Available (404 / "not found").** Proceed to Step 2 and
        create the org under this login.
      - **Already a user account.** Someone registered the handle.
        Two sub-cases:
        - Owned by the user / someone the user trusts: coordinate
          the handle transfer per GitHub's process, then create the
          org. Alternatively, the user can rename their personal
          account off `researchatlas` to free it.
        - Owned by a squatter: either file a GitHub username-squatting
          report (trademark-backed if a mark exists), or pick an
          alternative org login (`research-atlas` with a hyphen, or
          `atlas-research`). Record the chosen login in the
          Decisions log in
          [`../roadmap/github-organization.md`](../roadmap/github-organization.md)
          and update shipped prose in the same transfer commit.
      - **Already an org.** Unlikely (we have not created it) but
        worth ruling out. If found, confirm ownership; if it's
        squatted, fall back to the alternative-login path above.
- [ ] Lock in the final org login before running any of the steps
      below. Every downstream step references that string.

## Step 2 — Create or reconfigure the organization

If creating new:

- [ ] Create org at `github.com/organizations/new`. Plan: Free.
- [ ] Login: `researchatlas` (if available; see Step 1 fallback).
- [ ] Display name: `Research Atlas`.
- [ ] Email: an address the user controls, ideally not the personal
      GitHub email. A Google Workspace alias under
      `researchatlas.info` is ideal if domain email is set up.
- [ ] Homepage URL: `https://researchatlas.info`.
- [ ] Description: "An evidence operating system for researchers.
      Inspectable, source-grounded, submission-ready AI-assisted
      research workflows."
- [ ] Avatar: upload the Atlas mark (source in `public/`).

If already exists:

- [ ] Verify the above fields are all set. Update any that drift.

## Step 3 — Org-wide security

- [ ] Require 2FA for all members. Settings → Authentication
      security → "Require two-factor authentication for all members".
- [ ] Enable dependency graph, Dependabot alerts, Dependabot security
      updates, and secret scanning org-wide. Settings → Code
      security and analysis.
- [ ] Enable Advanced Security only if / when private repos exist and
      merit it — GHAS is free for public repos.

## Step 4 — Profile README

- [ ] Create repo `.github` in the org (public, default branch
      `main`).
- [ ] Add `profile/README.md` with: project pitch, links to
      researchatlas.info, the current flagship install command, and
      a short list of public repos.
- [ ] Add `CODE_OF_CONDUCT.md` (Contributor Covenant v2.1) and
      `SECURITY.md` (report vulnerabilities to a designated email;
      do not file as public issues).
- [ ] Add default issue templates: bug report, feature request,
      acceptance-run failure.

## Step 5 — Transfer the monorepo into the org

Source: `github.com/HaroldZhong/Research-Atlas` (personal account).
Destination: `github.com/<final-org-login>/<final-slug>` (final slug
locked here; candidates are `Research-Atlas`, `research-atlas`, or
`atlas` — pick and record in the
[`../roadmap/github-organization.md`](../roadmap/github-organization.md)
Decisions log before executing).

- [ ] **Gate check.** Confirm v1 release gate is green: RG1, RG2, RG3
      transcripts committed under `docs/references/acceptance-runs/`
      and CHANGELOG `[Unreleased]` has been promoted to a dated tag.
      Do not transfer before the gate closes.
- [ ] **Back up.** `git push --all && git push --tags` to
      `HaroldZhong/Research-Atlas`. Confirm every branch and tag is
      up on the remote.
- [ ] **Transfer.** On `HaroldZhong/Research-Atlas` → Settings → Danger
      Zone → Transfer ownership → target org + optional new name.
      GitHub creates an automatic redirect at the old slug so existing
      URLs continue to resolve.
- [ ] **Update `origin`.** On local clones,
      `git remote set-url origin git@github.com:<org>/<slug>.git`.
- [ ] **Vercel.** Confirm the Vercel project auto-detects the move and
      production deploys still run. If Vercel lost the GitHub link,
      re-connect it. Trigger a redeploy and confirm the live site still
      matches.
- [ ] **Update shipped surfaces to the new slug in one commit.**
      Everything that hardcodes `HaroldZhong/Research-Atlas`:
      - `plugin/.claude-plugin/plugin.json` `repository` field.
      - Landing page install tabs in
        `src/modules/home/HomePage.tsx`.
      - `CHANGELOG.md` (the newly promoted dated entry + the Known
        gaps paragraph).
      - `docs/announce-draft-2026-04.md` install snippets.
      - `docs/tasks/release-gate-v1.md` and
        `docs/references/acceptance-runs/RUN-COMMANDS.md` command
        blocks.
      - `AGENTS.md` install examples.
      The redirect at `HaroldZhong/Research-Atlas` keeps old URLs
      resolving; we still prefer the canonical new slug everywhere
      new copy ships.
- [ ] **Cold-install verification (post-transfer).** In a fresh agent
      session on a clean machine, run the Claude Code install command
      with the new slug:
      `/plugin marketplace add <org>/<slug>` then
      `/plugin install research-verification@research-atlas`. Confirm
      the skill lists, loads, and executes the worked example without
      errors. Repeat for Codex (`gh repo clone <org>/<slug>` path) and
      Gemini (`gemini skills install <url> --path .agents/skills/research-verification`).
- [ ] **Announce follow-up.** Post a short note in the original
      announce thread(s) with the new install URL. Flag that the old
      URL continues to work via redirect.

## Step 6 — Teams and CODEOWNERS

- [ ] Create `owners` team: admin on all repos.
- [ ] Create `maintainers` team: write on code repos, review on
      docs.
- [ ] Create `bots` team: for future CI bots that need scoped
      write.
- [ ] Add `CODEOWNERS` file to the Research Atlas monorepo:
      assign skill-related paths to a skill maintainer, site paths
      to a site maintainer, docs paths to docs maintainer. For now
      a single owner is fine — just document the pattern.

## Step 7 — Branch protection

On the Research Atlas monorepo (and every future repo):

- [ ] Protect `main`. Require PRs. No force-push.
- [ ] Require status checks if CI exists.
- [ ] Require linear history (no merge commits). Squash-and-merge
      default.
- [ ] Disallow bypass by admins — applies to owners too. Fewer
      foot-guns.

## Step 8 — Document it

- [ ] Append a dated entry to the
      [`../roadmap/github-organization.md`](../roadmap/github-organization.md)
      "Decisions log" recording: final org login, final post-transfer
      slug, transfer date, and any deviations from the plan (e.g. if
      the fallback login was used).
- [ ] Note the setup date at the top of this task file and flip
      **Status** from `ACTIVE` to `COMPLETE, YYYY-MM-DD`.
- [ ] Open a docs-only follow-up ticket if any surface was missed in
      the Step 5 "Update shipped surfaces" commit.

## When to revisit

- When Phase 3 split decision fires. That's when
  `researchatlas/skills` might be created.
- When Phase 5 Atlas MCP pilot fires. That's when
  `researchatlas/mcp` might be created.
- When a corpora repo is created — likely alongside Phase 3.

Each of those triggers a dedicated task doc for the new repo's
initial setup.

## Explicitly out of scope for this track

- Setting up CI/CD for any repo. That's per-repo infrastructure
  work, not org-setup work.
- Creating stub repos for `skills`, `mcp`, `evidence-runtime`,
  `corpora`. These do not exist until their triggering phase fires.
  Empty stub repos are premature structure.
- Pre-v1 repo moves. Transferring `HaroldZhong/Research-Atlas`
  before the release gate closes is out of scope — see the
  2026-04-18 decision in
  [`../roadmap/github-organization.md`](../roadmap/github-organization.md).
  This track is explicitly post-gate.

## Related

- Why this track exists: [`../roadmap/github-organization.md`](../roadmap/github-organization.md)
- Org-level architecture context: [`../roadmap/architecture.md`](../roadmap/architecture.md)
