# Research Atlas Eval Harness

**Status:** ACTIVE, 2026-04-18. Normative pattern for every Research
Atlas skill that claims publish-readiness (Tier 1).

This directory defines **the repeatable protocol** every Atlas skill
passes through before going into the marketplace. The
`research-verification` 30-reference corpus is the reference
implementation. New skills follow the same pattern.

## What an eval-harness bundle looks like

A skill that reaches Tier 1 status ships a locked evaluation bundle
co-located with the skill source:

```
.claude/skills/<skill-name>/
├── SKILL.md                                  # canonical body (progressive disclosure)
├── references/                               # on-demand-loaded sub-docs
└── examples/
    ├── acceptance-corpus.<ext>               # the locked input corpus
    ├── acceptance-ground-truth.json          # expected verdicts / checks
    └── acceptance-test-transcript.md         # reference transcript (one agent)
```

### Current state of `research-verification` (the reference skill)

As of 2026-04-18 the flagship ships these bundle artifacts:

- [`SKILL.md`](../../../.claude/skills/research-verification/SKILL.md)
- [`examples/acceptance-corpus.txt`](../../../.claude/skills/research-verification/examples/acceptance-corpus.txt) (locked 2026-04-17, 30 items)
- [`examples/acceptance-ground-truth.json`](../../../.claude/skills/research-verification/examples/acceptance-ground-truth.json) (the machine-readable labels file that maps each corpus item to its expected verdict class and evidence requirements)
- [`examples/acceptance-test-transcript.md`](../../../.claude/skills/research-verification/examples/acceptance-test-transcript.md) (reference Claude Code transcript, abbreviated)

Still missing (Phase 1 T3 remainder): the three live-run per-agent
transcripts + saved `*.envelope.json` files in
[`../acceptance-runs/`](../acceptance-runs/), and the
`scripts/grade-acceptance.mjs` grader that consumes them. Those land
alongside the release gate.

Plus, per-agent transcripts land in
[`../acceptance-runs/`](../acceptance-runs/):

```
docs/references/acceptance-runs/
├── README.md                                 # the protocol (living)
├── RUN-COMMANDS.md                           # exact per-agent invocation
└── <skill-name>-<agent>.md                   # one transcript per (skill × agent)
```

## The five mandatory components

Any skill claiming Tier 1 ships all five:

1. **Locked corpus.** A static input file checked into the repo.
   "Locked" means: once promoted, the corpus is append-only (never
   silently mutated). Changes get a new version suffix
   (`acceptance-corpus-v2.*`). Rationale: scorecards across agents
   must be comparing the same inputs.

2. **Ground truth.** A machine-readable labels file that says what
   the correct output should be for every input item. Format:

   ```json
   {
     "corpus_version": "1",
     "items": [
       { "id": "1", "ground_truth": { "verdict": "verified", "must_include_evidence": ["resolved.doi"] } },
       { "id": "26", "ground_truth": { "verdict": "fabricated_doi" } }
     ]
   }
   ```

3. **Pass conditions.** A numbered list (6 for
   `research-verification`) stating the thresholds that must hold.
   Lives in the corpus file header AND in
   `docs/references/acceptance-runs/README.md` under the skill's
   section. Conditions cover accuracy (recall/precision), shape
   (envelope/schema), behavior (evidence present), and ops (latency,
   cross-agent parity).

4. **Three-agent transcripts.** Claude Code, Codex CLI, Gemini CLI.
   All three must pass the same conditions against the same corpus
   before the skill can be promoted. Transcripts preserve the raw
   envelope, elapsed time, and any operator notes.

5. **Grader.** A `node scripts/grade-acceptance.mjs` invocation that
   ingests (envelope, ground-truth) and emits a pass/fail per
   condition. Used as a sanity check on saved transcripts and as a
   regression canary in CI once the skill is stable.

## Corpus authoring rules

- **Every item needs a stable id.** Numeric or slug. The id flows
  into `verdict.reference_id` so scorecards can be computed
  mechanically.
- **Mix real and trap items.** Pure happy-path corpora don't catch
  hallucinations. `research-verification` runs 25 real + 5 traps
  (3 fabricated DOIs, 1 wrong author, 1 wrong year). Aim for a
  similar real:trap split in any verification-flavored skill.
- **Cover the task surface.** If the skill advertises five tasks,
  the corpus must exercise all five. Gaps in coverage become gaps in
  the scorecard.
- **Include timing guardrails.** A corpus that takes 45 minutes to
  grade is a corpus that won't get run often. Target ≤ 10 min
  end-to-end where possible.

## Grader signatures

Every grader implements:

```
grade(envelope, groundTruth) -> {
  conditions: [
    { name: string, pass: boolean, actual: string, expected: string }
  ],
  passed_all: boolean
}
```

Each condition is a boolean check. The grader does not tie-break or
interpret — it reports. Interpretation lives in the acceptance-runs
review step.

## Cross-agent parity check

After all three per-agent transcripts exist, a parity check runs:

- For every corpus item, compute the verdict across (Claude, Codex,
  Gemini). Count items where all three agree.
- Parity target: **≥ 90% exact verdict match, ≥ 95% coarse-class
  match** (where coarse classes collapse `verified` +
  `partially_supported` and collapse the four `fabricated*` /
  `metadata_mismatch_*` types).
- Publish the parity scorecard alongside the three transcripts. A
  skill that fails parity is not ready for Tier 1 — either the skill
  has agent-specific bugs or the corpus is ambiguous.

## Regression runs

Once a skill is Tier 1:

- Run the acceptance corpus on Claude Code on every version bump.
  Save transcript, validate envelope via `npm run validate:envelopes`,
  confirm all six conditions.
- Run on Codex + Gemini at each minor version (`x.Y.0`).
- If any condition drops, cut a patch release that fixes it. A Tier
  1 skill that regresses out of the bar is downgraded until fixed.

## Skills that are NOT Tier 1

Skills in Tier 2 (active promotion target) and Tier 3 (prompt-grade
reference) do not ship the full harness. Tier 2 skills ship a corpus
draft and a single-agent transcript; Tier 3 skills ship neither. See
[`../../roadmap/decision-gates.md`](../../roadmap/decision-gates.md)
for the promotion criteria.

## Related

- Acceptance runs protocol:
  [`../acceptance-runs/README.md`](../acceptance-runs/README.md)
- Per-agent invocation:
  [`../acceptance-runs/RUN-COMMANDS.md`](../acceptance-runs/RUN-COMMANDS.md)
- Envelope validator:
  [`../../../scripts/validators/envelope.mjs`](../../../scripts/validators/envelope.mjs)
- Phase 1 T3 (this doc's source):
  [`../../tasks/phase-1-harden.md`](../../tasks/phase-1-harden.md)
