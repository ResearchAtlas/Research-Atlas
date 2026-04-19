# Task — Phase 3: Evidence Runtime + Repo Split Gate

**Phase:** 3.
**Goal:** extract the shared Evidence Runtime as its own package and
make the explicit Phase-3 call on whether to split skills out of the
monorepo.
**Status:** PENDING.
**Budget:** 2–3 weeks.

## T1 — Phase-3 split decision (gate)

The split gate fires here. See
[`../roadmap/decision-gates.md`](../roadmap/decision-gates.md) §Phase-3-split.

- [ ] Collect evidence: install-friction, maintenance cost of two
      plugins in one repo, end-user URL confusion, external-PR
      signal.
- [ ] Write the call in the decisions log of `decision-gates.md`
      with a dated entry.
- [ ] If "split now": execute T2a below.
- [ ] If "defer" or "never": skip T2a, note the re-check trigger.

## T2a — Repo split execution (conditional)

Only if the gate fires "split now".

- [ ] Create `researchatlas/skills` repo (public, default branch
      `main`). Branch protection + CODEOWNERS per
      [`../roadmap/github-organization.md`](../roadmap/github-organization.md).
- [ ] Copy the relevant paths from the Research Atlas monorepo with
      a `Forked from <monorepo-slug> @ <sha>` note in the new repo's
      README (use whatever slug the monorepo has at fork time — today
      that's `HaroldZhong/Research-Atlas`; post-org-transfer it will be
      `researchatlas/<final-slug>`). `git subtree split` is fragile on
      Windows (user's primary env); clean copy + note is fine.
- [ ] Move:
      `.claude/skills/`, `.agents/skills/`, `plugin/`,
      `.claude-plugin/`, `scripts/mirror-skills.mjs`,
      corpus paths, and the relevant docs/references pieces.
- [ ] Update the Research Atlas monorepo — delete the migrated skill
      paths. **Do not re-couple** by adding the `skills` repo as a
      submodule or plugin install. Per
      [`../roadmap/architecture.md`](../roadmap/architecture.md)
      §"Atlas Web", the website documents and links to skills but
      does not embed or run them. The website's only remaining
      relationship to skills is via hyperlinks in the install-on-
      your-agent block.
- [ ] Update the website's install-on-your-agent block so
      Claude/Codex/Gemini commands point at
      `researchatlas/skills`.
- [ ] If the site's `/skills` or `/workflows` pages need build-time
      metadata from the skill repo (e.g. skill list, versions,
      short descriptions), fetch that at build time via a plain
      `fetch` of the `skills` repo's raw content URLs, or copy a
      `skills-manifest.json` snapshot into the website repo at
      release time. Do NOT introduce a runtime dependency.
- [ ] Keep marketplace identifier `research-atlas` unchanged — users
      typing the install command should not need to retype.
- [ ] Announce the migration on the current channels with the new
      install URL. Leave the old URL resolving via GitHub's
      auto-redirect for 90 days.

## T2b — Defer documentation (conditional)

Only if the gate fires "defer" or "never".

- [ ] Update
      [`../roadmap/github-organization.md`](../roadmap/github-organization.md)
      repo-inventory table to reflect that `skills` is deferred.
- [ ] Update this task doc's T2a section with a dated "Deferred —
      see decision-gates.md" note instead of executing.

## T3 — Evidence Runtime package

Goal: one shared package that every skill depends on for envelope
validation, provenance records, connector stubs.

- [ ] Decide hosting: separate repo `researchatlas/evidence-runtime`
      or subdirectory of wherever skills live. Default: separate
      repo — lets the runtime ship on its own release cadence.
- [ ] Create the repo. Initialize as a TypeScript library with
      strict mode, targeting Node 20+ (Node 24 LTS is current
      default but Codex CLI + Gemini CLI runtimes vary; Node 20 is
      the safer floor).
- [ ] Port `scripts/validators/envelope.mjs` (from Phase 1) into
      `src/validators/envelope.ts` — promote to TypeScript, tighten
      types.
- [ ] Add `src/provenance/record.ts` — canonical provenance record
      shape. `{source, query, raw_response_hash, timestamp,
      resolver_version}`. Exported type.
- [ ] Add `src/connectors/crossref.ts`,
      `src/connectors/openalex.ts`,
      `src/connectors/semantic-scholar.ts`. Port from the logic
      inlined in `research-verification` SKILL.md references. Each
      emits provenance records on every call.
- [ ] Add `src/connectors/zotero.ts` — thin wrapper over
      kujenga/zotero-mcp.
- [ ] Publish to npm as `@research-atlas/evidence-runtime` (or
      GitHub Packages provisionally if npm publish needs more setup).
      Initial version `0.1.0` — pre-1.0 so breaking changes are
      expected.
- [ ] Add CI: lint, test, type-check, publish on tag.

## T4 — Migrate shipped skills to import from runtime

- [ ] `research-verification`: replace inline envelope validator
      with `import { validateEnvelope } from '@research-atlas/evidence-runtime'`.
- [ ] `research-verification`: replace inline connector code with
      runtime connectors.
- [ ] `literature-review`: same migration.
- [ ] Re-run both skills' acceptance gates in all three agents.
      Verify no behavior change. Save transcripts with `-phase3`
      suffix.
- [ ] Bump skill versions: `research-verification` 2.2.0,
      `literature-review` 1.1.0. Publish to marketplace.

## T5 — Corpora repo (conditional)

Trigger: corpus curation has become a bottleneck by this point.

- [ ] If yes: create `researchatlas/corpora`. Move all locked
      corpora out of `.claude/skills/*/examples/`. Skills reference
      corpus by URL + SHA.
- [ ] If no: skip. Corpora stay in skill directories.

## T6 — Documentation sweep

- [ ] Update `docs/roadmap/architecture.md` — runtime is now a real
      package, not informal conventions.
- [ ] Update `docs/roadmap/github-organization.md` — update
      repo-inventory table.
- [ ] Update top-level `AGENTS.md` — mention runtime dependency in
      the onboarding section.
- [ ] Update `README.md` — add a "For developers" subsection
      pointing at the runtime package.

## Exit check

- [ ] Evidence Runtime package published (npm or GitHub Packages).
- [ ] `research-verification` + `literature-review` both import
      from runtime, no duplicated envelope logic.
- [ ] All six agents × 2 skills acceptance runs green.
- [ ] Split decision documented in `decision-gates.md`.

Exit triggers Phase 4:
[`phase-4-manuscript-review.md`](phase-4-manuscript-review.md).

## Related

- Phase definition: [`../roadmap/phases.md`](../roadmap/phases.md) §Phase-3
- Decision gate: [`../roadmap/decision-gates.md`](../roadmap/decision-gates.md) §Phase-3-split
- Runtime layer: [`../roadmap/architecture.md`](../roadmap/architecture.md) §3
- Org setup: [`track-org-setup.md`](track-org-setup.md)
