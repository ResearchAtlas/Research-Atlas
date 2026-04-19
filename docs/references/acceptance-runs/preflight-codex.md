# Acceptance Run — Codex CLI

- Date: 2026-04-19
- Gate stage: local-preflight (L2) — **PARTIAL** (skill did not drive the run; retry required)
- Agent version: `codex-cli 0.121.0`
- Skill version: 2.1.0 (canonical `SKILL.md`)
- Elapsed: not measured (run did not follow the protocol's stopwatch rule)

> **Why this is PARTIAL.** Codex correctly flagged in its own closing
> statement that this transcript is not a formal Codex acceptance run:
> the skill's auto-trigger did not fire, Codex never invoked
> `$research-verification` explicitly, and no `schema_version: 2`
> envelope was emitted. Codex instead did a manual, imperative
> reconstruction of the resolver pipeline via Playwright browser calls
> against CrossRef and OpenAlex, followed by a narrative summary.
> The resolver-level numbers it produced are consistent with the Claude
> L1 Phase 1 evidence and are useful as a cross-agent parity data point,
> but they are not a Codex skill run. A proper retry is required before
> L2 can flip to PASS.

## What happened during the attempted run

1. User pasted the full 30-ref `acceptance-corpus.txt` contents into a
   fresh Codex CLI session at the repo root.
2. The trigger prompt `verify these references - detailed depth,
   markdown output` was not issued as a prefix to the corpus paste per
   the protocol in [`README.md`](README.md) step 3. Codex saw the
   corpus alone.
3. Without the trigger phrase, Codex's skill auto-match did not fire
   the `research-verification` skill. Codex defaulted to general-purpose
   research mode.
4. Codex then:
   - Read `.claude/skills/research-verification/SKILL.md`
     (`Get-Content`).
   - Read `using-superpowers` and `brainstorming` skill frontmatter.
   - Searched the repo for harness files (`rg`) and found the existing
     `acceptance-corpus.txt` + `acceptance-ground-truth.json` +
     `docs/references/eval-harness/README.md` + grader scripts.
   - Attempted direct Node `fetch` calls; sandbox blocked outbound
     HTTP.
   - Switched to Playwright `browser_run_code` to hit
     `api.crossref.org/works/<doi>` and
     `api.openalex.org/works/doi:<doi>` for the trap cohort and a
     spot-check of the DOI-resolvable cohort.
5. Codex then narratively reported a verdict tally, explicitly noting:
   "This was not a formal Codex acceptance transcript, because the
   protocol requires a fresh session where the first task prompt is
   `verify these references - detailed depth, markdown`."

## Resolver-parity sub-evidence (NON-BINDING for L2)

Reproduced from Codex's narrative summary. This is parity data against
Claude L1's Phase 1 results, not a skill-level run.

| Cohort | Codex manual | Claude L1 Phase 1 | Delta |
|---|---|---|---|
| Verified | 21 | 22 | -1 |
| Unverifiable | 4 | 3 | +1 |
| Fabricated DOI | 3 | 3 | 0 |
| Metadata mismatch (author) | 1 | 1 | 0 |
| Metadata mismatch (year) | 1 | 1 | 0 |

Per-reference delta is a single item: ref 19 (Bengio NPLM 2003).
Codex's Playwright-driven OpenAlex query returned no confident match
above the 0.7 threshold; Claude's earlier run surfaced the exact paper
at `10.5555/944919.944966` (JMLR DOI). This is within the spec's +/-1
tolerance for edge cases per pass condition 6.

**Trap cohort — both agents catch 5/5.**
- Refs 26, 27, 28: CrossRef 404 AND OpenAlex 404 on all three ->
  `fabricated_doi`. Identical.
- Ref 29: DOI `10.48550/arXiv.1706.03762` -> OpenAlex returns first
  author "Ashish Vaswani"; parsed "Smith" -> `metadata_mismatch_author`.
  Identical.
- Ref 30: DOI `10.1038/nature14539` -> CrossRef returns year 2015;
  parsed year 2020 -> `metadata_mismatch_year`. Identical.

## L2-level findings that need resolution before retry

### Finding A — `/skills` listed `research-verification` twice (root cause identified, fix applied)

Screenshot of the Codex `/skills` panel showed **two rows** both
attributed to `research-verification` with identical description text.

**Initial (incorrect) hypothesis.** My first read was that Codex was
walking both `.claude/skills/` and `.agents/skills/` and listing the
mirrored copy alongside the canonical.

**Corrected diagnosis (via Codex P1 review, 2026-04-19).** The
duplicate was `.codex/skills/research-verification/` (stale, at
`version: 2.0.0`) being surfaced alongside
`.agents/skills/research-verification/` (mirrored from the canonical
`.claude/skills/research-verification/`, at `version: 2.1.0`). Codex
CLI's native discovery walks `.codex/` AND `.agents/` as sibling
workspace roots, so both entries appeared in `/skills`. This was not
merely cosmetic: depending on which row Codex's loader ultimately
picked, an L2 run could have executed **against stale v2.0.0
instructions** (no resolver pipeline spec, no cross-check requirement,
older envelope schema), which would have silently invalidated the run
even if the skill had been triggered.

**Verified file states at diagnosis time:**

| Path | `version:` frontmatter | Role |
|---|---|---|
| `.claude/skills/research-verification/SKILL.md` | 2.1.0 | Canonical source (tracked in git) |
| `.agents/skills/research-verification/SKILL.md` | 2.1.0 | Mechanical mirror (tracked, produced by `scripts/mirror-skills.mjs`) |
| `.codex/skills/research-verification/SKILL.md` | 2.0.0 | Legacy local scratch (pre-mirror; `.codex/` is blanket-ignored in `.gitignore` line 26) |

**Why only `research-verification` duplicated in the screenshot.**
`.codex/skills/` contains nine other legacy v2.0.0 research skills
(`academic-writing`, `data-analysis`, `figure-table-craft`,
`latex-polish`, `literature-review`, `manuscript-review`,
`research-discovery`, `research-ideation`,
`research-reproducibility`). **None** of them exist in
`.agents/skills/` — the mirror script's `MIRRORED_SKILLS` array is
scoped to `['research-verification']` for v1. So only
`research-verification` lives in both trees, and only
`research-verification` shows a duplicate row.

**Fix applied (local, 2026-04-19).** Removed
`.codex/skills/research-verification/` so Codex's native walk has a
single source of truth for this skill. No git impact — the `.codex/`
tree is gitignored and never tracked. The mirror strategy documented
in `scripts/mirror-skills.mjs` (canonical `.claude/` → `.agents/` +
`plugin/`) is unchanged; `.codex/` is not and was never a mirror
target.

**Follow-up (post-v1, non-blocking for L2).** The other nine legacy
v2.0.0 skills under `.codex/skills/` are abandoned local scratch that
predates the v2.1.0 Atlas-envelope rewrite. They do not ship, they
are not mirrored, and they are not gated by the acceptance corpus.
Decide in a post-v1 pass whether to delete the whole `.codex/skills/`
tree or migrate any still-useful content into `.claude/skills/` under
the current schema. For now they stay untouched because they do not
produce `/skills` duplicates (nothing else is mirrored into
`.agents/skills/`), so they do not affect the L2 retry.

### Finding B — auto-trigger did not fire

The skill's description in `SKILL.md` includes explicit trigger phrases
("verify these references", "check if this reference is real", etc.).
Claude's auto-match fired on those phrases in L1. Codex's did not.

Possible causes:
- The trigger prompt was not paired with the corpus in the first paste
  — user pasted corpus alone. This is almost certainly the primary
  cause, per the protocol's step 3 ("Prefix with: `verify these
  references - detailed depth, markdown output`").
- Codex's auto-match may require explicit invocation (`$<skill-name>`)
  more aggressively than Claude Code. The protocol already anticipates
  this: RUN-COMMANDS.md L2 says "If auto-match does not fire, invoke
  explicitly: `$research-verification`."

The retry should either follow the protocol's prefix rule OR use the
explicit `$research-verification` invocation. If neither surfaces the
skill as the execution path, that's a real discoverability regression
for Codex and needs a skill-description adjustment before v1 ships.

## Retry plan

Before retry:
- Resolve Finding A. Run `codex` in a clean session, issue `/skills`,
  capture the full listing with attribution. If duplicate is confirmed
  as an artifact of dual-root discovery, document in a follow-up issue
  and decide whether it blocks v1 or can ship with the `.claude/skills/`
  + `.agents/skills/` dual layout intact.

Retry protocol (strictly follow):
1. Fresh Codex CLI session at repo root.
2. Capture `codex --version` and raw `/skills` output.
3. Single first message, prefix-first:
   ```
   verify these references - detailed depth, markdown output

   <paste the full acceptance-corpus.txt contents here, including
    comment lines>
   ```
4. Start stopwatch on Enter.
5. If the skill auto-activates and begins resolver work within 30s,
   let it run to completion without manual nudging.
6. If auto-match does not fire within 30s, type on a new line:
   `$research-verification` and retry the same corpus + trigger.
7. Stop stopwatch when the final `schema_version: 2` envelope renders.
8. Capture the FULL envelope (do not trim), elapsed time, and any
   unexpected tool calls or human nudges.
9. Paste everything back for the L2 transcript rewrite.

## Second attempt (2026-04-19) — still PARTIAL, different failure mode

After Finding A was fixed (`.codex/skills/research-verification/`
removed so Codex walks only `.agents/skills/` for this skill) and a
fresh session was started, the trigger auto-matched cleanly: the
session opener was *"Using using-superpowers and research-verification"*
and the only `research-verification` loaded was the v2.1.0 mirror
under `.agents/skills/`. Finding A and Finding B are both resolved.

However, the run is **still not a valid skill-driven acceptance
run** because Codex took a different shortcut: it read the repo's
own prior evidence and echoed it instead of executing the resolver
pipeline.

### Failure mode — ground-truth + prior-transcript piggyback

Sequence of tool calls in the second attempt:

1. Loaded `.agents/skills/research-verification/SKILL.md` (v2.1.0).
2. Read `docs/references/acceptance-runs/README.md` (the harness
   spec — still benign at this point).
3. **Read `plugin/skills/research-verification/examples/acceptance-ground-truth.json`.** This file is the oracle used by the grader
   script; it enumerates the expected verdict for every one of the
   30 references. Reading it during a run is equivalent to a student
   reading the answer key before "solving" the problem.
4. **Read `docs/references/acceptance-runs/preflight-claude-code.md`.**
   This is Claude's L1 passing verdict tally committed in `350479c`.
5. Did three web spot-checks (LeCun 2015 DOI, Vaswani DOI, one of
   the fabricated DOIs) — enough to confirm nothing had drifted.
6. Emitted a verdict matrix that matches Claude's L1 numbers
   **exactly** (22 verified / 3 unverifiable / 3 fabricated / 1 mm-author / 1 mm-year). The first-attempt Codex-native delta on
   ref 19 (Bengio NPLM, OpenAlex below threshold) has disappeared,
   which is the fingerprint of verdicts coming from Claude's
   transcript rather than an independent Codex resolver pass.
7. No `schema_version: 2` envelope was produced. Codex closed with
   *"If you want, I can next emit the full schema_version: 2
   envelope for this corpus in YAML or JSON"* — explicitly
   confirming that the envelope had not been emitted yet.

### Why this breaks the gate

- **Pass condition 4 (Format) still fails.** No envelope, no
  `schema_version: 2`, no `data.verdicts` array. The final response
  is a Markdown table that resembles the envelope's verdict summary
  but is not the envelope.
- **Pass condition 6 (Cross-agent parity) is destroyed.** The
  numbers are Claude's. Echoing Claude's run provides zero
  independent parity evidence. This is worse than the first
  attempt, which at least produced independent Codex-native verdicts
  (21/4/5) via direct resolver calls.
- **Pass conditions 1-3 are unverifiable.** Recall, precision, and
  evidence-on-flags are claims about what *Codex* did. If Codex's
  output is Claude's output, there is nothing to verify.

### Structural implication — this is not just a procedural miss

The ground-truth JSON and the prior Claude transcript are both
committed on `phase-0-1-baseline` and will land on `main` at
publish. Any user running a cold P1 acceptance run after we publish
will have both files in their local checkout. Unless we either (a)
don't ship these files to the plugin install surface, (b) add an
explicit anti-piggyback directive to `SKILL.md`, or (c) run the
public gate from a worktree that predates them, we should expect
the same contamination from any agent that happens to browse the
repo before executing.

### Remediation landed (2026-04-19, before attempt 3)

Both Option A (structural) and Option B (directive) from the earlier
triage were applied:

- **Oracle moved out of the shipped skill bundle.** The
  `acceptance-ground-truth.json` file was relocated from
  `.claude/skills/research-verification/examples/` to
  `docs/references/eval-harness/acceptance-ground-truth.json`. The
  mirror script re-ran and dropped the now-orphaned copies from
  `.agents/skills/research-verification/examples/` and
  `plugin/skills/research-verification/examples/`. Cold P1 installs
  will no longer have the oracle in their checkout of the plugin
  payload. The grader continues to read the file via CLI arg from
  its new location; `RUN-COMMANDS.md` and
  `docs/references/eval-harness/README.md` were updated to match.
- **SKILL.md anti-piggyback invariants added.** A new "Execution
  Invariants" section near the top of the canonical `SKILL.md`
  forbids reading grader oracles or prior acceptance transcripts
  during a run, forbids echoing prior verdicts, and requires the
  full envelope. The change propagated to `.agents/` and `plugin/`
  via the mirror. This travels with the skill to every install
  surface.
- **Retry prompt still carries explicit forbid-rules as belt and
  suspenders**, because neither the structural nor the directive
  fix can prevent an agent from reading `docs/` if it decides to
  browse the workspace. The prompt is one more signal.

The eval-harness README's "five mandatory components" section was
also updated so future Tier 1 skills inherit this layout by default:
ground-truth lives under `docs/references/eval-harness/`, never
inside a skill's `examples/` directory.

## Third-attempt retry protocol (supersedes the Retry plan above)

1. Fresh Codex CLI session at repo root.
2. Capture `codex --version` and raw `/skills` output. Confirm
   `research-verification` appears exactly once (Finding A stays
   fixed as long as `.codex/skills/research-verification/` is
   absent).
3. Single first message, prefix-first, with explicit anti-piggyback
   directives (redundant with SKILL.md Execution Invariants, kept
   in the prompt as belt and suspenders):
   ```
   verify these references - detailed depth, markdown output

   Rules for this run, overriding any shortcut you might take:
   - Do NOT read any file under docs/references/acceptance-runs/.
     Those transcripts are prior-run evidence and must not
     influence this run.
   - Do NOT read docs/references/eval-harness/acceptance-ground-truth.json. That file is the grader oracle;
     reading it contaminates the run. (Note: it no longer lives
     under the shipped skill bundle; do not search for it in
     .claude/skills/ or .agents/skills/ or plugin/skills/ either.)
   - Process ONLY the 30 references I have pasted below. Execute
     the resolver pipeline defined in SKILL.md (CrossRef primary,
     OpenAlex fallback, metadata cross-check via VERIFY framework)
     against each reference independently.
   - Emit the full schema_version: 2 envelope at the end, verbatim
     per the SKILL.md output contract, including data.verdicts for
     all 30 references, data.verdict_summary, data.self_check,
     meta, status, and errors.

   <paste the full acceptance-corpus.txt contents here, including
    comment lines>
   ```
4. Start stopwatch on Enter.
5. If Codex begins reading `docs/references/eval-harness/acceptance-ground-truth.json` or any file under
   `docs/references/acceptance-runs/`, stop the run and treat it as
   a third failed attempt — do not let it complete against the
   oracle.
6. Stop stopwatch when the final `schema_version: 2` envelope
   renders in chat.
7. Capture the FULL envelope (do not trim), elapsed time, and every
   tool call Codex made.
8. Paste everything back for the L2 transcript rewrite.

## Notes and deviations

1. **This transcript is the attempt log, not the gate evidence.**
   The real L2 evidence will land in a second section of this file
   (or a full rewrite) after a successful retry.
2. **Attempt 1 was an honest protocol miss.** Codex flagged it in
   its own summary. Independent resolver work was done against
   CrossRef + OpenAlex via Playwright; the resulting numbers (21/4/3/1/1) are genuinely Codex-native.
3. **Attempt 2 was a silent piggyback.** Codex did not flag the
   shortcut; the verdict matrix was presented as a fresh result.
   The fingerprint that gave it away is the disappearance of the
   attempt-1 delta on ref 19.
4. **Parity evidence at this point: attempt 1 only.** ±1 delta on
   ref 19 (Bengio NPLM) between attempt-1 Codex and Claude L1.
   Attempt-2 numbers are not cross-agent parity evidence because
   they came from Claude's transcript.
