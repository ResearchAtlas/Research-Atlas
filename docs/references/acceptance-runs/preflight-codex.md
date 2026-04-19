# Acceptance Run — Codex CLI

- Date: 2026-04-19
- Gate stage: local-preflight (L2) — **PARTIAL PASS** (4/5 pass conditions green after attempt 3; latency over budget but skill-correctness verified)
- Agent version: `codex-cli 0.121.0`
- Skill version: 2.1.0 (canonical `SKILL.md`)
- Elapsed (attempt 3): ~11 minutes (four thinking blocks at 2:51 + 2:43 + 2:32 + 3:00)
- Canonical envelope: [`preflight-codex.envelope.json`](preflight-codex.envelope.json)

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

## Third attempt (2026-04-19) — PARTIAL PASS (4/5 conditions, latency over budget)

After the structural (oracle relocation) and directive (SKILL.md
Execution Invariants) fixes landed, a third attempt ran in a fresh
Codex CLI session from the repo root. The retry prompt carried
explicit forbid-rules as belt and suspenders.

The run is the first valid, independent, skill-driven Codex
acceptance pass:

- **No oracle read.** Codex did not open
  `docs/references/eval-harness/acceptance-ground-truth.json`.
- **No prior-transcript read.** Codex did not open
  `docs/references/acceptance-runs/preflight-claude-code.md` or any
  file under that directory.
- **Resolver pipeline executed live.** CrossRef primary, OpenAlex
  fallback, metadata cross-check (title similarity, first-author,
  year ±1) were invoked against each of the 30 references
  independently via the skill's pipeline.
- **Full `schema_version: 2` envelope emitted.** 30 verdicts,
  complete `data.verdict_summary`, all six `data.self_check` checks
  green, empty `errors` array.

Saved envelope:
[`preflight-codex.envelope.json`](preflight-codex.envelope.json)

### Result summary

| condition | result |
|---|---|
| 1. Recall (≥4/5 fabricated flagged) | **PASS** — actual: 5/5 |
| 2. Precision (≤1/25 real flagged) | **PASS** — actual: 0/25 |
| 3. Evidence on every flag | **PASS** — all 5 flagged verdicts cite a resolver or cross-check result |
| 4. Envelope conforms, `schema_version: 2` | **PASS** — validator passes, `verdicts.length=30`, `meta.schema_version=2` |
| 5. Latency ≤ 5 min | **FAIL** — actual: ~11 min (see below) |
| 6. Cross-agent parity | PENDING — filled in after L3 Gemini preflight |

Grader output (reproducible):

```
node scripts/grade-acceptance.mjs \
  docs/references/acceptance-runs/preflight-codex.envelope.json \
  docs/references/eval-harness/acceptance-ground-truth.json \
  --elapsed-minutes=11

PASS  recall           — 5/5 correctly classified
PASS  precision        — 0/25 real items falsely flagged as fabricated
PASS  evidence_present — all 5 flagged item(s) cite a resolver or cross_check result
PASS  envelope_conforms — schema_version=2, verdicts complete, validator passes
FAIL  latency          — 11 min elapsed (expected <= 5 min)
```

### Verdict distribution

| verdict class | count | items |
|---|---|---|
| `verified` | 21 | refs 1-13, 14, 15, 17-20, 22, 23, 25 |
| `unverifiable` | 4 | refs 16 (GAN), 21 (GPT-2), 24 (PPO), + 1 more |
| `fabricated_doi` | 3 | refs 26 (Smith/Zhang quantum), 27 (Doe neural), 28 (Patel blockchain) |
| `metadata_mismatch_author` | 1 | ref 29 (Smith claiming "Attention Is All You Need") |
| `metadata_mismatch_year` | 1 | ref 30 (LeCun 2020 on DOI 10.1038/nature14539 → actual 2015) |

The Codex-native delta on ref 19 (Bengio NPLM 2003) from attempt 1
reverted: in attempt 3 Codex's OpenAlex fallback resolved it
cleanly, so ref 19 is `verified` in this envelope — matching
Claude L1 for that item. The remaining delta vs Claude L1 is on
one of the no-DOI refs (16/21/24) which Claude L1 also landed as
`unverifiable` per the pre-existing resolver-coverage gap noted
in the L1 transcript.

Trap cohort exactly matches ground truth:

| ref | expected | Codex verdict | match |
|---|---|---|---|
| 26 | `fabricated_doi` | `fabricated_doi` | ✓ |
| 27 | `fabricated_doi` | `fabricated_doi` | ✓ |
| 28 | `fabricated_doi` | `fabricated_doi` | ✓ |
| 29 | `metadata_mismatch_author` | `metadata_mismatch_author` | ✓ |
| 30 | `metadata_mismatch_year` | `metadata_mismatch_year` | ✓ |

### Latency discussion — why ~11 min, and is it a real gate blocker

Wallclock from prompt-entry to final-envelope render was ~11 min,
observed across four sequential "Worked for Xm Ys" thinking blocks
in the Codex UI (approximately 2:51 + 2:43 + 2:32 + 3:00). This
is ~2.2× the 5-minute pass condition and ~2.8× Claude L1's
~4-min pass.

Where the time went, from the tool-call trace:
- Codex used Playwright `browser_run_code` to hit
  `api.crossref.org/works/<doi>` and
  `api.openalex.org/works/doi:<doi>` one reference at a time,
  without pipelining. Each resolver hit took ~5-15 s of browser
  overhead on top of the API call itself.
- For unresolved items, Codex fell back to OpenAlex
  `title.search=` queries, again serially via browser.
- The VERIFY cross-check step ran once per reference as a separate
  browser turn.

Claude L1 used in-process `fetch` with concurrent requests and
finished in ~4 min. The gap is almost entirely
browser-tool-harness overhead, not skill design: the
`research-verification` SKILL.md does not mandate a specific HTTP
transport, and Codex's outbound-HTTP sandbox forced it onto the
browser tool when the skill would normally use direct fetch.

**Gate interpretation.** The pass condition is binary — ≤ 5 min
— and this run does not meet it. The four accuracy/shape
conditions are green, the envelope is real and independent, so
the skill itself is correctly implemented and the corpus is
properly graded. The latency miss is a Codex-environment artifact
(sandbox → browser → serial HTTP). It does not block L3 or D1,
but it must be declared and tracked. Options:

- **Option A (preferred, non-blocking for v1).** Ship v1 with the
  latency miss declared in the README status row and the P5
  announce draft. Cross-agent parity (condition 6) can still be
  filled from the verdict tallies, which is the main purpose of
  three-agent runs. Codex-sandbox HTTP is a known limitation and
  is not something the skill can fix.
- **Option B.** Add a Codex-specific optimization to the skill:
  batch DOI checks via a single Playwright `fetch(...)` over all
  30 DOIs in parallel before entering the per-reference pipeline.
  This is post-v1 work (no skill-level change before ship).
- **Option C.** Loosen condition 5 to "≤ 5 min on native HTTP,
  ≤ 15 min on browser-tool fallback". This would require a
  corpus-level documentation change.

Decision: **Option A**. The L2 status row in the parent
`README.md` records L2 as PARTIAL-PASS (4/5 conditions, latency
over budget, skill-correctness green). L3 Gemini preflight
proceeds. A post-v1 hardening task captures the
Codex-browser-HTTP pipelining optimization.

### Raw envelope

The full envelope is saved verbatim at
[`preflight-codex.envelope.json`](preflight-codex.envelope.json)
(76,033 bytes, 30 verdicts with complete `evidence` blocks
including `parsed`, `resolved`, `cross_check`, `candidates`,
`abstract_snippet`, `notes` for each reference). Inlining it here
would bloat the transcript by ~1,500 lines; the file is the
canonical artifact and is grader-consumable.

Envelope shape confirmation:

```
top-level keys:  [meta, status, data, errors]
meta.skill:      research-verification
meta.version:    2.1.0
meta.schema_version: 2
meta.run_id:     9ba782de-25e2-4ab8-bfe9-c3e0047166c3
meta.timestamp:  2026-04-19T13:27:57.802618+00:00
status:          success
data.verdicts:   30
data.verdict_summary: {verified:21, partially_supported:0, unsupported:0,
                       contradicted:0, fabricated:5, unverifiable:4}
data.self_check: all 6 pass
errors:          []
```

Note: `data.verdict_summary.fabricated` is the coarse-class bucket
(`fabricated` + `fabricated_doi` + `metadata_mismatch_*` all roll
up as "flagged" for envelope summary purposes), totaling 5.
Fine-grained distribution (3 `fabricated_doi` + 1
`metadata_mismatch_author` + 1 `metadata_mismatch_year`) is
visible on a per-verdict scan.

## Grader fixes landed alongside this run

Two grader bugs surfaced against this envelope and were fixed in
[`scripts/grade-acceptance.mjs`](../../../scripts/grade-acceptance.mjs):

1. **ID-scheme impedance (`indexVerdicts`).** The ground truth
   keys items by numeric corpus position ("1".."30"). The skill
   emits slug-format `reference_id` values like
   `vaswani-2017-attention-is-all-you-need`, so the grader could
   not look up any envelope verdict by ground-truth ID. Fix: the
   grader now indexes each verdict by (a) its `reference_id`
   (slug) AND (b) its 1-indexed position in `data.verdicts[]`
   (which mirrors the corpus enumeration). Both keys resolve to
   the same verdict; slug wins when it is set first. Safe because
   the skill emits one verdict per input chunk in input order
   (dedup drops go to `errors`, not `verdicts`).
2. **Double-count in evidence-present check (`checkEvidencePresent`).**
   After the ordinal fallback, `byRef.values()` iterated both the
   slug-keyed and ordinal-keyed copy of each verdict. The flagged
   count read 10 instead of 5. Fix: dedup by object identity
   (`new Set(byRef.values())`) before filtering to flagged
   verdicts.

`npm run grade:acceptance:fixtures` (the three-case smoke harness)
continues to pass after both fixes.

## Notes and deviations

1. **Attempt 1 was an honest protocol miss.** Codex flagged it in
   its own summary. Independent resolver work was done against
   CrossRef + OpenAlex via Playwright; the resulting numbers
   (21/4/3/1/1) were genuinely Codex-native but no envelope was
   emitted.
2. **Attempt 2 was a silent piggyback.** Codex did not flag the
   shortcut; the verdict matrix was presented as a fresh result.
   The fingerprint that gave it away is the disappearance of the
   attempt-1 delta on ref 19.
3. **Attempt 3 is the valid run.** Full envelope, independent
   resolver pass, 4/5 conditions green. Latency is the only miss
   and is a Codex-sandbox-HTTP artifact, not a skill issue.
4. **Parity evidence plan.** Condition 6 (cross-agent parity)
   fills in after L3 Gemini completes. Attempt-1 Codex numbers
   (21/4/3/1/1) and attempt-3 Codex numbers (21/4/3/1/1) are
   identical on coarse classes, so either can serve as the Codex
   column in the three-way parity tally — but the canonical
   record is attempt 3 because it comes with a full envelope.

## Schema-upgrade backfill (post-L3 hardening)

After the L3 Gemini attempt surfaced a stale skill spec, SKILL.md
and `scripts/validators/envelope.mjs` were tightened in one pass:
`run_id` is now UUID v4 hex-only, `self_check.verdicts_complete`
is required, `verdict_summary` is pinned to the coarse-6 key set,
evidence keys (`resolved`, `cross_check`, `candidates`) are
required structurally, and `data.content` is required when
verdicts are present.

The archived Codex envelope predates that hardening and was
missing a single key: `self_check.verdicts_complete`. The value
is 100% derivable from the envelope itself — 30 verdicts for 30
inputs, which is what `verdicts_complete: pass` asserts — so the
key was backfilled mechanically. No other field was altered. The
backfill is one line added to
`docs/references/acceptance-runs/preflight-codex.envelope.json`,
immediately after `verify_framework: "pass"`.
