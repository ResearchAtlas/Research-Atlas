# GitHub Organization — `researchatlas`

**Status:** ACTIVE, 2026-04-17. Planning doc for an umbrella GitHub org
that hosts all Atlas-related repos. Execution checklist in
[`../tasks/track-org-setup.md`](../tasks/track-org-setup.md).

## Why an org

Research Atlas today lives in a single monorepo at
`github.com/researchatlas/researcher-prompt-hub` (the current slug is
historical — the project brand is **Research Atlas**, and all
user-facing prose uses that name). As Atlas grows into the four-layer
architecture in [`architecture.md`](architecture.md), we need multiple
repos:

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
  `researchatlas/runtime` all read obviously. Today the single monorepo
  (slug `researcher-prompt-hub`) mixes website + skills + plan docs
  because there's nowhere else to put them.
- **Migration story for consumers.** When we split Research Atlas
  Skills out (Phase 3 decision gate), the install command changes from
  the current monorepo slug to `researchatlas/skills` — within the
  same org, easy to alias and redirect.

## Org name and identity

- **Org login:** `researchatlas` (matches current use in shipped install
  URLs). Lowercase, no hyphens, matches the domain `researchatlas.info`.
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
| `researcher-prompt-hub` | Research Atlas (monorepo) | 1 + 2 | exists | The Vite/React website + canonical `.claude/skills/` sources. Today this is the monorepo. After Phase 3, this narrows to just the Research Atlas website. Slug stays historical; user-facing copy uses "Research Atlas". |
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

1. **`researcher-prompt-hub` → split the website out from the skills
   repo.** Triggered by the Phase 3 decision gate. After split, the
   website stays at `researchatlas/researcher-prompt-hub` (URL stable
   because researchers have bookmarked the marketplace install URL),
   and the new skills repo is `researchatlas/skills`. The marketplace
   identifier `research-atlas` does NOT change.
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
- **Do not block the release gate on org setup.** Today's shipped
  install URLs already assume `researchatlas/researcher-prompt-hub`
  exists. That's the prerequisite, and it's met. Anything past that is
  post-v1 cleanup, not a v1 blocker.

## Related docs

- Repo inventory trigger gates: [`decision-gates.md`](decision-gates.md)
- Architecture mapping: [`architecture.md`](architecture.md)
- Execution checklist: [`../tasks/track-org-setup.md`](../tasks/track-org-setup.md)
