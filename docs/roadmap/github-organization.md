# GitHub Organization — `researchatlas`

**Status:** ACTIVE, 2026-04-18. Planning doc for an umbrella GitHub org
that will host all Atlas-related repos. Execution checklist in
[`../tasks/track-org-setup.md`](../tasks/track-org-setup.md).

## Current state vs. target state (read this first)

**Current (as of 2026-04-18):** Research Atlas ships from a single
monorepo at `github.com/HaroldZhong/Research-Atlas` — a **personal
GitHub account**, not an org. All shipped install URLs, acceptance-run
commands, and the `plugin/.claude-plugin/plugin.json` `repository`
field point at this slug.

**Target:** a dedicated GitHub organization at
`github.com/researchatlas` hosting Atlas's repos under the product
brand. The monorepo transfers there; additional repos are created as
the roadmap's phase gates fire (see
[Target repo inventory](#target-repo-inventory) below).

**Why we are not there yet.** v1 (`research-verification`) is already
published and pre-announced from the `HaroldZhong/Research-Atlas` slug.
Moving the repo before the v1 release gate (RG1–RG5) would invalidate
every URL in the announce draft, the landing page install tabs, and
the CHANGELOG. The cost outweighs the benefit for a rename that can
happen cleanly once v1 has shipped. **The transfer is the first
post-release-gate work item** — see the [Decisions log](#decisions-log)
at the bottom of this doc.

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
- **Migration story for consumers.** When the monorepo transfers to
  `researchatlas/<slug>` (post-v1), the marketplace identifier
  (`research-atlas`) stays stable — only the install URL changes, and
  we ship the new URL together with the existing one in the announce
  follow-up. When we later split Research Atlas Skills out (Phase 3
  decision gate), the install command moves from the monorepo slug to
  `researchatlas/skills` — within the same org, easy to alias and
  redirect.

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
| `Research-Atlas` (target slug TBD) | Research Atlas (monorepo) | 1 + 2 | exists at `HaroldZhong/Research-Atlas`; transfers to the org post-v1 | The Vite/React website + canonical `.claude/skills/` sources. Today this is the v1 monorepo on a personal account. Post-v1 release gate, it transfers to `researchatlas/<final-slug>` (the final slug is locked in the dated transfer task; candidates are `Research-Atlas`, `research-atlas`, or `atlas`). After Phase 3, this narrows to just the Research Atlas website. |
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
   Triggered by the v1 release gate closing green (RG1–RG5 in
   [`../plans/2026-04-17-next-milestone-plan.md`](../plans/2026-04-17-next-milestone-plan.md)).
   This is the first post-gate work item. Execution checklist in
   [`../tasks/track-org-setup.md`](../tasks/track-org-setup.md). GitHub
   transfers preserve history and auto-create a redirect at the old
   slug, so previously-shipped install URLs continue to resolve; we
   still update the landing page, CHANGELOG, announce copy, and
   `plugin/.claude-plugin/plugin.json` `repository` field to the new
   slug in the same commit as the transfer.
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
- **Do not block the release gate on org setup.** v1 ships from
  `HaroldZhong/Research-Atlas`. The org transfer is the first
  post-release-gate work item, not a v1 blocker. GitHub's automatic
  redirect on repo transfer means v1's shipped install URLs keep
  resolving even after the move.

## Decisions log

- **2026-04-18 — Keep v1 at `HaroldZhong/Research-Atlas`; transfer to
  a `researchatlas` org is the first post-release-gate work item.**
  Rationale: v1's announce draft, landing page install tabs,
  CHANGELOG, and plugin manifest already point at the current slug.
  Moving pre-gate invalidates every URL and forces a second
  acceptance-run pass to re-verify the cold install. Moving post-gate
  lets GitHub's transfer redirect handle backwards compatibility for
  existing consumers while we update shipped surfaces in a single
  coordinated commit. Target org login is `researchatlas`, pending
  the Step 1 availability check in
  [`../tasks/track-org-setup.md`](../tasks/track-org-setup.md).

## Related docs

- Repo inventory trigger gates: [`decision-gates.md`](decision-gates.md)
- Architecture mapping: [`architecture.md`](architecture.md)
- Execution checklist: [`../tasks/track-org-setup.md`](../tasks/track-org-setup.md)
