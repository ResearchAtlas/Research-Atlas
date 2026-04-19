# GitHub Organization — `researchatlas`

**Status:** ACTIVE, 2026-04-18. Planning doc for an umbrella GitHub org
that will host all Atlas-related repos. Execution checklist in
[`../tasks/track-org-setup.md`](../tasks/track-org-setup.md).

## Current state vs. target state (read this first)

**Current (as of 2026-04-18):** Research Atlas is being prepared in a
single monorepo at `github.com/HaroldZhong/Research-Atlas` — a
**personal GitHub account**, not an org. The local release branch and
the current install surfaces in this repo point at that slug.

**Target:** a dedicated GitHub organization at
`github.com/researchatlas` hosting Atlas's repos under the product
brand. The monorepo transfers there; additional repos are created as
the roadmap's phase gates fire (see
[Target repo inventory](#target-repo-inventory) below).

**Why we are not there yet.** The artifact is ready locally, but the
public cold-install gate has not run yet. That creates a cleaner
decision point than we had earlier: run the **local preflight** first,
then decide whether the first public publish should happen from the
personal-account slug or from a freshly-created `researchatlas` org
slug. **Default bias:** transfer first if the admin work is acceptable,
so v1 launches from its permanent canonical URL. Explicit deferral is
allowed, but it should be recorded before the public cold-install gate
starts. See the [Decisions log](#decisions-log) at the bottom of this
doc.

## Why an org

As Atlas grows into the four-layer architecture in
[`architecture.md`](architecture.md), we need multiple repos:

- The Research Atlas website.
- Research Atlas Skills (the shipped plugin distribution).
- The Research Atlas Evidence Runtime package.
- The Research Atlas MCP service (later).
- Research Atlas acceptance corpora (if we pull them out for easier contribution).

Keeping all of that under one org gives us:

- **One identity surface.** `researchatlas` as the org login,
  `Research Atlas` as the display name and product brand, one avatar,
  one homepage link, one consistent look across all shipped repos.
- **Shared infra.** One set of GitHub Actions secrets, one shared
  project board, one set of team/CODEOWNERS rules.
- **Clean install URLs.** `researchatlas/skills`, `researchatlas/mcp`,
  `researchatlas/runtime` all read obviously. Today the monorepo lives
  on a personal account (`HaroldZhong/Research-Atlas`) and mixes website
  + skills + plan docs because there's nowhere else to put them.
- **Migration story for consumers.** If the monorepo transfers to
  `researchatlas/<slug>` before first public publish, v1 launches from
  the canonical org URL immediately. If the transfer is deferred, the
  marketplace identifier (`research-atlas`) stays stable and GitHub's
  redirect covers the old slug until the org move lands. When we later
  split Research Atlas Skills out (Phase 3 decision gate), the install
  command moves from the monorepo slug to `researchatlas/skills` —
  within the same org, easy to alias and redirect.

## Org name and identity

- **Org login:** `researchatlas` (target; availability to be verified as
  the first step of [`../tasks/track-org-setup.md`](../tasks/track-org-setup.md)).
  Lowercase, no hyphens, matches the domain `researchatlas.info`.
- **Display name:** `Research Atlas`.
- **Homepage URL:** `https://researchatlas.info`.
- **Description:** "An evidence operating system for researchers.
  Inspectable, source-grounded, submission-ready AI-assisted research
  workflows."
- **Avatar:** reuse the current Atlas mark.
- **Profile README:** a single-page org profile at
  `researchatlas/.github/profile/README.md` that points at the website,
  the flagship skill install command, and the public repos.

## Target repo inventory

These are the repos the org should eventually host. Most do not exist
yet; they appear as the roadmap's phase plan advances. Do not create
empty repos in advance — that's premature structure.

| Repo slug | Product name | Layer | Phase created | Contents |
|---|---|---|---|---|
| `Research-Atlas` (target slug TBD) | Research Atlas (monorepo) | 1 + 2 | exists at `HaroldZhong/Research-Atlas`; transfers to the org at D1 (default) or is explicitly deferred | The Vite/React website + canonical `.claude/skills/` sources. Today this is the v1 monorepo on a personal account. At the D1 canonical-publish decision (see [`../tasks/release-gate-v1.md`](../tasks/release-gate-v1.md)), the default path transfers it to `researchatlas/<final-slug>` (final slug locked in the transfer task; candidates are `Research-Atlas`, `research-atlas`, or `atlas`); deferral keeps it at the personal-account slug until a later transfer. After Phase 3, this narrows to just the Research Atlas website. |
| `skills` | Research Atlas Skills | 2 | Phase 3 decision gate | Dedicated skill + plugin distribution repo. Claude Code marketplace identifier stays `research-atlas`. Install URL changes to `researchatlas/skills`. |
| `evidence-runtime` | Research Atlas Evidence Runtime | 3 | Phase 3 | The shared envelope + validator + harness package. Published to npm as `@research-atlas/evidence-runtime`. |
| `mcp` | Research Atlas MCP | 4 | Phase 5+ | The Research Atlas MCP service. Deployed on Vercel with Fluid Compute. |
| `corpora` | Research Atlas Corpora | 3 | Phase 3+ | Locked acceptance corpora for every shipped skill. Public so the evaluation is reproducible. Versioned releases. |
| `.github` | (org config) | — | org setup | Profile README, default issue/PR templates, security policy, code of conduct. |

## Repo visibility

- All target repos above are **public** by default. Atlas's credibility
  rests on "inspectable and source-grounded." Closed-source Atlas defeats
  the pitch.
- Private repos are acceptable for: unreleased experiments,
  internal planning drafts that are not yet meant to be public (the
  current `docs/plans/` tunnel is the pattern here), and any
  user-submitted data subject to privacy rules.

## Branch and release conventions

To apply across all org repos once they exist:

- **Default branch:** `main`.
- **No force-push on `main`.** Branch protection rule.
- **Tagged releases follow SemVer.** `v1.0.0` format. Every
  user-facing release of a skill or package gets a tag.
- **CHANGELOG per repo.** Keep-a-Changelog format. `[Unreleased]` at
  top, promote on release.
- **No AI-author prefixes on branches or commits.** Canonical project
  rule per user preference. `claude/`, `codex/`, `gemini/` prefixes on
  branches and "Generated with ..." footers in commits are not used.

## Access and teams

- **`owners`** team: has admin on all repos. Founding members only.
- **`maintainers`** team: write on code repos, review on docs repos.
- **`bots`** team: for CI accounts (e.g. release bot, renovate bot)
  that need write to specific repos.
- **CODEOWNERS** on every repo. Reviews are assigned automatically.
- **Two-factor authentication required** org-wide. Non-negotiable for
  a project whose credibility depends on trust.

## Migration strategy — when to move things

Do NOT migrate pre-emptively. Moves are expensive (broken URLs,
confused users, stale install commands). Trigger a migration when one
of these lands:

0. **`HaroldZhong/Research-Atlas` → `researchatlas/<slug>`.**
   Triggered by the D1 canonical-publish decision in
   [`../tasks/release-gate-v1.md`](../tasks/release-gate-v1.md), after
   local preflight passes and before the public cold-install gate
   begins if we choose the org-first path. Execution checklist in
   [`../tasks/track-org-setup.md`](../tasks/track-org-setup.md). GitHub
   transfers preserve history and auto-create a redirect at the old
   slug, so old URLs keep resolving if the transfer is deferred until
   after first publish; we still update the landing page, CHANGELOG,
   announce copy, and `plugin/.claude-plugin/plugin.json` `repository`
   field to the new slug in the same commit as the transfer.
1. **Monorepo → split the website out from the skills repo.**
   Triggered by the Phase 3 decision gate. After split, the website
   stays at the post-transfer org slug (URL stable because researchers
   have bookmarked the marketplace install URL), and the new skills
   repo is `researchatlas/skills`. The marketplace identifier
   `research-atlas` does NOT change.
2. **Evidence Runtime extraction.** Triggered by Phase 3. A new
   `researchatlas/evidence-runtime` repo is created; skills add a
   dependency. No existing repo migrates.
3. **Atlas MCP.** Triggered by Phase 5+. New `researchatlas/mcp` repo.

Each migration is a dedicated task checklist in
[`../tasks/`](../tasks/).

## What we do NOT do

- **Do not create an org-wide monorepo** (e.g. a `research-atlas-all`
  repo with everything in it). Per-repo ownership keeps each layer's
  release cadence independent.
- **Do not host third-party skills in the org.**
  `vercel-react-best-practices` and `web-design-guidelines` stay out of
  the org. Atlas publishes only what Atlas owns.
- **Do not block local preflight on org setup.** The artifact should be
  validated locally first. The public cold-install stage does require a
  canonical public repo, but that can be either the final org slug
  (preferred) or the current personal-account slug if transfer is
  explicitly deferred and recorded.

## Decisions log

- **2026-04-18 — Revise the gate so local preflight happens before the
  canonical publish decision.** This supersedes the earlier
  "post-release transfer only" assumption from the same day. Rationale:
  the plugin and marketplace files exist only on the local
  `phase-0-1-baseline` branch, so a public cold-install gate is invalid
  until a real public `main` contains them. The clean sequence is:
  local preflight -> choose canonical public URL -> publish there ->
  run public cold-install gate. Default bias is transfer first if the
  org-admin work is acceptable, so v1 launches from its permanent URL.
  Explicit deferral remains allowed, but it must be recorded before the
  public gate starts.

## Related docs

- Repo inventory trigger gates: [`decision-gates.md`](decision-gates.md)
- Architecture mapping: [`architecture.md`](architecture.md)
- Execution checklist: [`../tasks/track-org-setup.md`](../tasks/track-org-setup.md)
