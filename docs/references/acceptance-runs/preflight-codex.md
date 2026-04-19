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

### Finding A — `/skills` lists `research-verification` twice

Screenshot of the Codex `/skills` panel shows **two rows** both
attributed to `research-verification` with identical description text.
Almost certainly an artifact of Codex's native discovery walking both
`.claude/skills/research-verification/` AND
`.agents/skills/research-verification/` (the mechanical mirror) and
listing them as independent skills.

Why this matters:
- It makes discovery non-deterministic from the user's POV (which
  entry do they pick?).
- If Codex's skill loader has dedup-by-name behavior, only one is
  actually executable; the other is a phantom.
- If both are independently loadable, an edit to `.claude/skills/` that
  hasn't been mirrored via `npm run mirror:skills` could produce
  split-brain behavior in a fresh Codex session.

Needs investigation before L2 retry:
- Does Codex's skill loader treat `.claude/skills/` and
  `.agents/skills/` as sibling roots and list both?
- If yes, what's the dedup precedence? Workspace project scope first?
  Alphabetical? Filesystem order?
- Does this affect the other 10 shipped skills too (literature-review,
  manuscript-review, etc.)? Screenshot shows they DON'T appear twice —
  only `research-verification` — which suggests this is specific to the
  skills that have been through `scripts/mirror-skills.mjs`. Need to
  confirm whether the other skills are NOT mirrored or whether Codex
  deduplicated them and missed this one.

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

## Notes and deviations

1. **This transcript is the attempt log, not the gate evidence.** The
   real L2 evidence will land in a second section of this file (or a
   full rewrite) after the retry run.
2. **Codex's manual run was honest and transparent.** It flagged the
   protocol violation in its own summary, which is the right failure
   mode. Nothing here suggests a Codex bug — just a protocol miss on
   the first-message shape plus a discoverability quirk (Finding A)
   that needs triage.
3. **Parity trending green.** The ±1 delta on ref 19 is within spec.
   No real ref was flagged as fabricated. Trap cohort is 5/5 identical.
   This is good news for the eventual L2 PASS, once a proper run lands.
