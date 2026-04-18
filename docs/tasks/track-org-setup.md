# Task — GitHub Organization Setup

**Track:** parallel (runs any time between Phase 0 and Phase 3).
**Goal:** stand up the `researchatlas` GitHub organization so Atlas
can grow into multi-repo territory cleanly.
**Status:** ACTIVE, 2026-04-17. Blocked on user account-admin action.

## Why this track exists as its own doc

Atlas's shipped install URLs already reference
`github.com/researchatlas/researcher-prompt-hub`. That means the
`researchatlas` namespace is already in use as a user or org account.
This task is about making it a proper **organization** with the
structure described in
[`../roadmap/github-organization.md`](../roadmap/github-organization.md) —
or, if `researchatlas` is already an org, formalizing the settings and
migration plan.

This track **does not gate any phase.** The current monorepo is fine
through Phase 2. Do the setup when convenient.

## Step 1 — Verify current state

- [ ] Check whether `github.com/researchatlas` is currently a
      **user account** or an **organization**. Go to the profile
      page; user accounts have a "Follow" button, orgs have
      "Subscribe" or "Invite".
- [ ] If it's a user account, verify that the user owns it (not
      squatted by someone else). If squatted, escalate to GitHub
      support for a trademark-backed reclamation or pick an
      alternative org name (e.g. `research-atlas` with a hyphen). A
      rename cascades into the landing page install commands,
      announce copy, and CHANGELOG — expensive, so resolve this
      before shipping v1.
- [ ] If it's already an org, skip to Step 2.

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

## Step 5 — Transfer or rename the monorepo (only if needed)

If the current repo is under a personal account and needs to move:

- [ ] Back up: ensure the full git history is pushed.
- [ ] Transfer via Settings → Danger Zone → Transfer ownership.
- [ ] Verify CI (if any), webhooks, and Vercel project still point at
      the new path. Vercel will auto-detect the transfer, but verify
      production deploys still run.
- [ ] Verify the shipped plugin install URL
      (`researchatlas/researcher-prompt-hub`) resolves. Test cold in
      a fresh agent session.

If the current repo is already under the org, skip this step.

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

- [ ] Update [`../roadmap/github-organization.md`](../roadmap/github-organization.md)
      "Decisions log" (add at bottom of the doc) with the org name
      finalized and any deviations from the plan.
- [ ] Note the setup date in this task file so we know when it
      landed.

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
- Renaming the Research Atlas monorepo's slug (`researcher-prompt-hub`)
  to something else. Not worth the churn — install URLs are shipped
  and stable. The user-facing brand is already "Research Atlas"; the
  historical slug can keep resolving.

## Related

- Why this track exists: [`../roadmap/github-organization.md`](../roadmap/github-organization.md)
- Org-level architecture context: [`../roadmap/architecture.md`](../roadmap/architecture.md)
