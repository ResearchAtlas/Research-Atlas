# Research Atlas — Next Milestone Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Reference audit:** [docs/references/2026-04-17-atlas-next-milestone-review.md](../references/2026-04-17-atlas-next-milestone-review.md)

**Goal:** Move Research Atlas from a prompt library into the go-to free tool for AI-assisted research verification. The milestone is a flagship "Verify Sources" capability that runs a reference list through the VERIFY framework end-to-end, works across Claude Code / Codex / Gemini CLI with a single canonical skill file, and is discoverable via a one-command install in Claude Code's plugin marketplace.

**Success signal:** Given a paste of 25 real + 5 fabricated references, the flagship returns a structured verdict (real / suspected fabricated / unverifiable) in under 5 minutes with DOI evidence, matching the acceptance test in §2.

**Architecture principle:** One canonical Anthropic-format `SKILL.md` is the single source of truth. Claude Code reads it from `.claude/skills/`. Codex and Gemini CLI both read `.agents/skills/` natively — it is the shared "open agent skills" alias (documented at agentskills.io, supported by both vendors) and takes precedence over each agent's proprietary path (`.gemini/skills/` in Gemini's case). So we maintain two discovery paths, not three: `.claude/skills/` and `.agents/skills/`, with the latter a mirror of the former. No per-agent skill rewrites. The one genuine packaging artifact is the Claude Code plugin marketplace listing.

**Tech stack:** React 19 + Vite + TypeScript + Tailwind + shadcn/ui (site); Markdown + YAML frontmatter (skills); Claude Code plugin manifest + MCP config (distribution).

---

## 1. Scope

### In scope

- Track A remnants: remaining surface fixes from the audit (duplicate titles, minor UX polish).
- Track B flagship: `research-verification` skill upgraded to a real end-to-end verification agent with live tool integration (CrossRef / OpenAlex / OpenCitations / Semantic Scholar MCP), a worked example, and the acceptance test baked in as a golden transcript.
- Track C distribution: Claude Code plugin marketplace listing + repo-root `AGENTS.md` + shared `.agents/skills/` tree (covers Codex and Gemini natively) + a single "Install on your agent" page on the website.
- Docs: a short "How verification works" guide that matches the flagship output.

### Out of scope (this milestone)

- Wholesale IA rename (Library → "Skills & Prompts") — revisit after flagship lands.
- Hosted agent (paid tier, queued jobs, analytics dashboard).
- Non-verification skills upgraded to the same tool-integrated bar. They ship in v1.1+.
- Multi-language skill translations.
- Zotero write-back automation (read-only reference import is in scope if time allows; write-back is not).

### Explicit non-goals

- **We are not chasing Anthropic-style "plugin parity" on Codex and Gemini.** The only packaging artifact we ship is a Claude Code plugin. Codex and Gemini ship as "drop this folder / run this symlink" instructions — cheap, honest, and durable.
- **We are not building our own MCP servers** for CrossRef / OpenAlex / OpenCitations in v1. We use their public REST APIs from inside the skill (documented curl / fetch snippets the agent can run), and adopt `semanticscholar-mcp`, `zotero-mcp`, and `pmc-mcp` off the shelf. Building our own is a v1.1 decision.

---

## 2. Acceptance test (flagship gate)

This test IS the definition of done for Track B. It must pass on all three agents before the milestone is called done.

**Input:** a paste of 30 references — 25 real (pulled from recent Nature / NEJM / Cell / IEEE / ACL / CVPR 2024–2026 papers) + 5 fabricated (plausible-looking DOIs, plausible authors, no real resolve).

**Procedure:** user invokes the skill (`/verify-sources` in Claude Code, `$research-verification` in Codex, same via Gemini). Skill ingests the list, runs the three-layer VERIFY protocol, returns a structured report.

**Pass conditions (all six must hold):**

1. **Recall:** flags ≥ 4 of the 5 fabricated references as "suspected fabricated."
2. **Precision:** flags ≤ 1 of the 25 real references as "suspected fabricated" (false-positive ceiling).
3. **Evidence:** every flagged reference cites at least one resolver check (DOI lookup result, OpenAlex `id` null, CrossRef 404, etc.) in the report. No flag without evidence.
4. **Format:** output conforms to the YAML envelope in `.claude/skills/research-verification/SKILL.md` (`{meta, status, data, errors}`, `schema_version: 2`). `data.verdicts[]` is present with a `{reference_id, verdict, confidence, evidence}` block per reference, and the `self_check.verdicts_complete` invariant holds (one verdict per input reference).
5. **Latency:** end-to-end run completes in ≤ 5 minutes on a residential connection, skills-only (no human research in the loop).
6. **Cross-agent parity:** the same input produces semantically equivalent verdicts (same true-positives, same true-negatives, ±1 on edge cases) on Claude Code, Codex, and Gemini CLI.

A failure on any condition means the milestone does not ship — fix and re-run.

---

## 3. Timeline (8 weeks, rolling)

| Week | Track | Headline |
|------|-------|----------|
| 1 | A | Track A remnants: duplicate titles, Counter scroll regression, header microcopy |
| 2–3 | B | Flagship skill authored: tool integration, worked example, output envelope parity |
| 4 | B | Acceptance-test harness: scripted 30-ref corpus, pass/fail report |
| 5 | C | Claude Code plugin marketplace listing + one-command install works end-to-end |
| 6 | C | `.agents/skills/` tree + repo-root `AGENTS.md` verified on latest Codex |
| 7 | C | Same `.agents/skills/` tree verified on Gemini CLI via `gemini skills list` + `/skills` |
| 8 | Launch | Landing-page "Install on your agent" + changelog + public post |

Weeks can overlap where independent (A finishes during B); C cannot start until B passes the acceptance test.

---

## 4. Task checklist

### Track A — surface remnants

- [x] **A1. Rename duplicate-titled prompts.** Suffix framework name in title so TIDD-EC and COSTAR variants of Figure/Table Caption Generator and Experimental Results Analysis are distinct in the library list. Files: `src/content/prompts/*.yaml` (exact files TBD when task starts — grep for `title:` duplicates).
- [x] **A2. Verify Counter animation regression.** Confirm home-page stat counters still animate correctly after the `useInView` removal across Chrome + Safari + Firefox, desktop + 390×844 mobile. File: [src/modules/home/HomePage.tsx:16](../../src/modules/home/HomePage.tsx).
- [x] **A3. Revisit hero subhead microcopy.** Current hero promises "prompt workflow"; it should promise "evidence-grade research with AI." Align with `src/modules/home/HomePage.tsx:591` update shipped in-audit. Confirm full hero reads consistently.
- [x] **A4. Audit remaining audit-report items.** Re-read [docs/references/2026-04-17-atlas-next-milestone-review.md §2.1](../references/2026-04-17-atlas-next-milestone-review.md) table; confirm each "fixed in-session" row is still fixed on main after any rebases.

### Track B — flagship skill

- [x] **B1. Ingest/parse step.** Skill accepts a pasted reference list in any of: plain text, BibTeX, RIS, DOI-only list, URL list. Normalize to `{title, authors, year, venue, doi, url}` tuples. Reject lists > 200 entries with a clear message.
- [x] **B2. DOI resolver layer.** For every entry with a DOI: call CrossRef (`https://api.crossref.org/works/{doi}`); on miss, fall back to OpenAlex (`https://api.openalex.org/works/doi:{doi}`). On both miss → candidate for "suspected fabricated." Record raw response hash for audit.
- [x] **B3. Metadata cross-check.** For resolved DOIs, verify title ≈ claimed title (fuzzy match ≥ 0.85), first-author surname matches, year matches ± 1. Mismatches downgrade confidence.
- [x] **B4. No-DOI path.** For entries without DOI: search OpenAlex + Semantic Scholar (`semanticscholar-mcp`) by title + first author. Surface top-3 candidates; if none score > 0.7 similarity → "unverifiable."
- [x] **B5. Output envelope.** Produce the `{meta, status, data: {verdicts[], verdict_summary, self_check}, errors}` YAML with `schema_version: 2`. Every verdict carries: `reference_id`, `verdict: real | suspected_fabricated | unverifiable`, `evidence: [{source, query, result_summary}]`, `confidence: 0..1`.
- [x] **B6. Worked example transcript.** Bundle `research-verification/examples/acceptance-test-transcript.md` — the scripted 30-ref run — so users can see what "working" looks like before they install.
- [x] **B7. Lock acceptance corpus.** 30-reference corpus locked at `research-verification/examples/acceptance-corpus.txt` (25 real + 5 traps, with wrong-author/wrong-year metadata rows) against the six pass conditions. **Live run is the release gate** — see "Release Gate" below.

### Track C — cross-agent distribution

- [x] **C1. Claude Code plugin manifest.** Create `plugin.json` that bundles the skill + any MCP servers it depends on. **Current implementation (provisional):** this repo is its own single-plugin marketplace — `.claude-plugin/marketplace.json` is registered under the identifier `research-atlas`, and the install flow is `/plugin marketplace add HaroldZhong/Research-Atlas` then `/plugin install research-verification@research-atlas`. The slug is a personal-account slug today; the repo transfers to the `researchatlas` org as the first post-release-gate work item (see [`../tasks/track-org-setup.md`](../tasks/track-org-setup.md) and the 2026-04-18 entry in [`../roadmap/github-organization.md`](../roadmap/github-organization.md) Decisions log). **Target state:** a dedicated marketplace repo (working name `researchatlas/skills`) publishing many plugins under the same `research-atlas` marketplace identifier, so the install command stays stable when we cut the skill out of the website monorepo.
- [x] **C2. Codex `AGENTS.md`.** Add a repo-root `AGENTS.md` describing the skill, trigger phrases, expected inputs. Linux-Foundation-standard file; Codex (and Cursor / Aider / Copilot / Zed) auto-read it.
- [x] **C3. Codex `.agents/skills/research-verification/SKILL.md`.** Mirrored via `scripts/mirror-skills.mjs` (canonical → `.agents/skills/` + `plugin/skills/`); `prebuild` runs `mirror:skills:check` and fails loudly on drift.
- [x] **C4. Codex hook flag.** Documented in `AGENTS.md` (not README — Codex reads `AGENTS.md` natively). Users who want on-save / on-invoke hooks enable `codex_hooks = true` in `.codex/config.toml`. We do not ship a hook.
- [x] **C5. Gemini discovery protocol documented.** Gemini CLI auto-discovers skills from `.agents/skills/` (shared alias, takes precedence over `.gemini/skills/`). Verification: (a) run `gemini skills list` in the Atlas workspace and see `research-verification` listed; (b) issue a user-facing prompt that should match the skill (e.g. "verify these references") and confirm Gemini calls `activate_skill` and presents the consent prompt; (c) on approval, confirm the SKILL.md body + folder structure enter the conversation. Note: Gemini's `/skills` is a management surface (`list`, `link`, `enable`, `disable`, `reload`) — not an explicit selector. Invocation is prompt-driven. For a remote install against this monorepo, the `--path` flag is required so Gemini installs the skill subdirectory and not the whole repo: `gemini skills install <atlas-git-url> --path .agents/skills/research-verification`. For local development, `gemini skills link .agents/skills/research-verification --scope workspace`. No `skillz` MCP server, no `~/.skillz`, no symlinks required.
- [ ] **C6. Re-run acceptance test on Codex + Gemini.** §2, condition 6. Record the two transcripts in `docs/references/acceptance-runs/`. **Part of the Release Gate below — pending.**
- [x] **C7. Landing-page "Install on your agent."** Three-tab section (Claude Code / Codex CLI / Gemini CLI) live on the home page above the CTA, each tab showing the exact install command for that agent.

### Launch

- [x] **L1. Changelog + release notes.** `CHANGELOG.md` `[Unreleased]` section drafted; dated announce copy at `docs/announce-draft-2026-04.md` pending acceptance-gate approval.
- [ ] **L2. Announce.** Post on Anthropic Claude Code GitHub discussions, relevant subreddits, Hacker News only if timing is right. Gate on all six acceptance conditions + C6 transcripts green. **Draft ready, publish blocked on Release Gate.**

### Release Gate (active)

All three live acceptance runs must pass §2's six conditions and have their transcripts committed before L2 ships.

- [ ] **RG1. Claude Code.** Run the 30-ref corpus via the installed plugin. Transcript → `docs/references/acceptance-runs/claude-code.md`.
- [ ] **RG2. Codex CLI.** Same corpus invoked via `$research-verification`. Transcript → `docs/references/acceptance-runs/codex.md`.
- [ ] **RG3. Gemini CLI.** Same corpus via prompt-driven `activate_skill`. Transcript → `docs/references/acceptance-runs/gemini.md`.
- [ ] **RG4. Cross-agent parity check.** Verify §2 pass condition 6 holds across all three transcripts (±1 edge-case tolerance).
- [ ] **RG5. Tag release + promote `[Unreleased]`.** Bump `plugin/.claude-plugin/plugin.json` version if needed, tag the commit, move CHANGELOG `[Unreleased]` to a dated entry.

Status summary (as of 2026-04-17): Tracks A, B (minus live run), and C (minus C6) are complete. Docs are reconciled with the staged implementation. Lint, mirror-check, and build are green. Next action is RG1.

---

## 5. Cross-agent reality (the simpler truth)

Research during audit round 2 confirmed:

| Agent | Skill discovery path | Install / link mechanism | Invocation | Hook mechanism |
|-------|---------------------|--------------------------|------------|----------------|
| Claude Code | `.claude/skills/<name>/SKILL.md` | `/plugin install <name>@<marketplace>` | Skill auto-selected or `/skills` | Plugin manifest declares hooks |
| Codex CLI | `.agents/skills/<name>/SKILL.md` (native; multiple scopes: CWD, repo root, `$HOME`, `/etc/codex/skills`) | Clone repo, symlink folder, or ship via plugin | `$skill-name` or `/skills` | `codex_hooks = true` in `.codex/config.toml` |
| Gemini CLI | `.agents/skills/<name>/SKILL.md` (native; alias for `.gemini/skills/`, takes precedence for cross-agent compat) | `gemini skills install <source>` or `gemini skills link <path>` | **Prompt-driven**: Gemini calls `activate_skill` when your prompt matches. `/skills` is management-only (`list`, `link`, `enable`, `disable`, `reload`), not a selector. | Standard agent lifecycle |
| Cursor / Aider / Copilot / Zed | `AGENTS.md` (no native skills yet) | Read raw file | As directed by `AGENTS.md` | n/a |

The canonical `SKILL.md` stays Anthropic-format (YAML frontmatter: `name`, `description`). Both Codex and Gemini explicitly support the `.agents/skills/` convention as the shared "open agent skills" alias (see [agentskills.io](https://agentskills.io)). **One `.agents/skills/` tree covers both non-Anthropic agents.** Claude Code keeps its own `.claude/skills/` path. No per-agent SKILL variants. The only packaging artifact unique to one agent is the Claude plugin marketplace listing.

This collapses Track C surface area to "one plugin + one shared `.agents/skills/` tree + one `AGENTS.md`."

---

## 6. Risks and mitigations

- **Public API rate limits (CrossRef / OpenAlex / Semantic Scholar).** 50 req/s ceiling on CrossRef unauthenticated. Mitigation: batch, throttle, and document the `Crossref-Plus-API-Token` header for users who need higher throughput. If hit mid-run, skill continues with partial results and flags them as `unverifiable` rather than falsely `real`.
- **Semantic Scholar MCP drift.** Third-party MCP; may break between versions. Mitigation: pin a known-good version in install docs; have a REST fallback.
- **Fabricated references with real DOIs (DOI hijack).** Rare but exists. Mitigation: always cross-check resolved metadata against claimed metadata (task B3). A real DOI with a title mismatch is `unverifiable`, not `real`.
- **Acceptance test gaming.** If the 30-ref corpus leaks, future model versions may memorize verdicts. Mitigation: rotate the corpus every six months; keep a held-out validation set.
- **Codex / Gemini behavior differs on long tool-use chains.** Different timeout defaults, different context windows. Mitigation: C6 transcripts catch this before launch. If a difference is irreducible, document it in the landing-page tabs rather than hide it.
- **"One file everywhere" regresses.** A future Anthropic or Codex change could break the shared format. Mitigation: CI job that parses the canonical SKILL.md with all three agents' parsers (or equivalent) on every PR.

---

## 7. Definition of done

The milestone ships when:

1. All Track A checkboxes in §4 are checked.
2. All six acceptance-test conditions in §2 pass on Claude Code, Codex, and Gemini CLI.
3. A new user can go from "I use Codex" to "Verify Sources ran successfully on my references" in three commands or less, via `docs/install-on-your-agent.md` (or equivalent landing-page section).
4. The audit report at [docs/references/2026-04-17-atlas-next-milestone-review.md](../references/2026-04-17-atlas-next-milestone-review.md) has its §8.2.1 compatibility matrix updated to match §5 above (simpler-than-originally-thought reality).
5. `CHANGELOG.md` entry merged; public post drafted and scheduled.

---

## 8. Revision log

- 2026-04-17 — Initial plan. Drafted after audit round 2 + `.agents/skills/` research. Supersedes the informal "Track A/B/C" timeline in the audit report.
