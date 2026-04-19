# Acceptance Run — Gemini CLI

- Date: 2026-04-19
- Gate stage: local-preflight (L3) — **BLOCKED** after 3 attempts
- Agent version: `gemini` (Gemini 3, Auto profile, no sandbox)
- Skill version: 2.1.0 (canonical `SKILL.md`, mirrored to
  `.agents/skills/research-verification/`)
- Canonical envelope: **not produced** — no attempt emitted a
  validator-passing `schema_version: 2` envelope

> **Why this is BLOCKED, not PARTIAL.** Three successive attempts each
> failed a different pass condition in the hardened contract. The
> common thread is that Gemini's narrative-first output style does not
> naturally produce the full structured envelope the skill requires:
> it emits an abridged markdown report, then when asked for a
> machine-readable payload truncates `data.verdicts` to a "sample" and
> drops `data.content`. The validator hardening landed during this L3
> investigation (`f0d4a5b`, `5d85f2c`, `050bd24`, `33eb6c1`) now
> catches every one of those deviations mechanically, which is a
> skill-contract win — but it also means L3 cannot close PARTIAL on
> soft evidence the way L2 Codex did. A Gemini-specific prompting
> adjustment is required before L3 can retry productively.

## Attempt 1 — skill not discoverable via `/skills`

Saved raw envelope:
[`preflight-gemini.attempt-1.envelope.raw.json`](preflight-gemini.attempt-1.envelope.raw.json)

**Protocol followed.** Per `RUN-COMMANDS.md` L3:

```bash
gemini --version
gemini skills link .agents/skills/research-verification --scope workspace
gemini skills list
```

The `skills link` step succeeded and `skills list` showed
`research-verification` registered under workspace scope. A fresh
`gemini` session was opened and the corpus + trigger was pasted.

**Failure mode.** Gemini's `/skills` panel inside the session did not
list the linked skill as activatable, and the trigger phrase did not
auto-activate. Gemini instead treated the corpus as a general
research task and produced a narrative summary without the envelope.
Attempt closed without a gradable artifact.

**Root cause (diagnosed).** Gemini skills activate prompt-driven via
the `activate_skill` consent prompt, not via `/skills`. The protocol
in `RUN-COMMANDS.md` was updated to reflect this (commit predates
this transcript):

> Do not use `/skills` to activate the skill. Gemini activation is
> prompt-driven.

## Attempt 2 — consent approved but `data.content` empty

Saved raw envelope:
[`preflight-gemini.attempt-2.envelope.raw.json`](preflight-gemini.attempt-2.envelope.raw.json)

**What happened.** Fresh session. Corpus + trigger pasted. Gemini
surfaced the `activate_skill` consent prompt; approved. Gemini then
ran the resolver pipeline, produced a markdown report in its
narrative output, and emitted an envelope at the end.

**Failure mode.** `data.output_format` was `"markdown"` but
`data.content` was the empty string `""` — the markdown report was
in Gemini's prose reply, not embedded inside the envelope. The
hardened validator caught this with:

```
data.content: must be a non-empty string when output_format is
              "markdown" (empty string is only allowed for
              output_format=json)
```

This is the fix that shipped as commit `050bd24` during this L3
investigation; attempt 2 is the evidence that motivated it.

**Structural improvements** vs attempt 1: a real envelope was
produced, it had `schema_version: 2`, 30 verdicts were present in
`data.verdicts`, trap cohort was classified correctly (5/5), no
piggybacking on prior transcripts or the ground-truth oracle.
The only contract breach was the empty `content` field.

## Attempt 3 — verdicts array truncated to 4-item sample

Saved raw envelope:
[`preflight-gemini.attempt-3.envelope.raw.json`](preflight-gemini.attempt-3.envelope.raw.json)

Run profile:

- Gemini 3, Auto profile, `no sandbox`, profile footer
  "phase-0-1-baseline"
- Wall-clock: ~8 min (estimated from prompt-entry to final envelope
  render)
- Approval wait: ~120 s (≈12 `activate_skill`/WebFetch/GoogleSearch
  consent prompts at ~10 s each)
- Active agent time: 8 − 120/60 = **6.0 min** (over the 5-min budget)

**What happened.** Fresh session. Corpus + trigger pasted. Gemini
approved `activate_skill` and ran the resolver pipeline correctly
— CrossRef primary + OpenAlex fallback for the 17 DOI-bearing refs,
OpenAlex + GoogleSearch for the 10 no-DOI refs, cross-check via
VERIFY framework for the 5 traps. The narrative portion of Gemini's
response contained a correct verdict matrix:

| cohort | Gemini verdict |
|---|---|
| refs 1-15 (DOI-resolvable) | 15 × `verified` |
| refs 16-25 (no DOI) | 10 × `verified` |
| refs 26-28 (fabricated DOIs) | 3 × `fabricated_doi` |
| ref 29 (Smith on Vaswani DOI) | `metadata_mismatch_author` |
| ref 30 (LeCun 2020 on 2015 DOI) | `metadata_mismatch_year` |

This is 5/5 on the trap cohort and 0/25 false-fabrication on the
real cohort — a clean accuracy profile.

**Failure mode.** When Gemini serialized the envelope at the end
of the run, it wrote:

1. `"data.output_format": "markdown"` but **no `data.content` key at
   all** (not even an empty string).
2. `"data.verdicts"` containing **only 4 entries** — the first
   verified ref (Vaswani) and the four trap refs. A prose header
   above the JSON called this section "Detailed Evidence (Sample)",
   indicating Gemini deliberately abbreviated to save tokens.
3. `"data.verdict_summary": { verified: 25, ..., fabricated: 5, ... }`
   — the summary claimed 25 verified + 5 fabricated (30 total,
   consistent with the narrative tally) but the verdicts array only
   contained 1 verified + 3 fabricated_doi + 2 metadata_mismatch_*.
4. `"self_check.verdicts_complete": "pass"` — self-asserted pass
   despite `verdicts.length=4` vs `meta.input_count=30`.

**Validator output (hardened contract catches every breach):**

```
FAIL  preflight-gemini.envelope.json
  data.content: required when status is "success" and
                data.verdicts is present (may be empty string only
                for output_format=json)
  data.verdicts: verdicts_complete violated: length 4 !== expected
                 30 (from meta.input_count)
  data.verdict_summary.verified: count 25 does not match rollup
                                  from data.verdicts (expected 1)
  data.verdict_summary.fabricated: count 5 does not match rollup
                                    from data.verdicts (expected 3)
```

**Grader output (using `--elapsed-minutes=8 --approval-seconds=120`):**

```
FAIL  recall           — 0/5 correctly classified [misses: 26, 27,
                         28, 29, 30 all "no verdict returned"
                         because they aren't in the truncated
                         verdicts array even though they ARE in the
                         narrative]
PASS  precision        — 1/25 real items falsely flagged
PASS  evidence_present — all 3 flagged items cite resolver result
FAIL  envelope_conforms — 4 validator errors, verdicts.length=4 vs
                          expected 30
FAIL  latency          — 6.0 min active (8 min wall-clock minus
                         120 s human approval wait)
```

Recall reports 0/5 only because the truncated verdicts array excluded
4 of the 5 trap refs — the trap verdicts are in Gemini's narrative,
not in the envelope, so the grader (which consumes only the envelope)
cannot see them. A future retry that emits all 30 verdicts would
flip recall to 5/5 unchanged in skill behavior.

## Why this is BLOCKED, not PARTIAL

L2 Codex attempt 3 shipped as PARTIAL (4/5, latency over budget)
because all four *correctness* conditions were green — the envelope
was real, the 30 verdicts were independently derived, the trap cohort
matched ground truth, the validator passed. Only latency failed, and
latency is a Codex-sandbox-HTTP artifact with no skill-design cause.

L3 Gemini attempt 3 fails *two* correctness conditions:

- **envelope_conforms fails.** The verdicts array is truncated and
  `data.content` is missing. These are shape violations, not accuracy
  violations.
- **recall fails *as reported*.** The underlying recall would be 5/5
  if the verdicts were emitted in full — the narrative has all 5
  — but the grader consumes the envelope, and the envelope is the
  shipped contract. A narrative-only recall is not a gate pass.

One correctness failure (envelope shape) plus one graded-recall
failure plus one latency failure = 3/5 conditions down. That is not
close enough to PARTIAL disposition to ship L3 as signoff evidence
for cross-agent parity (condition 6).

## What changed during this investigation (validator hardening)

The four round-by-round validator tightenings all landed while L3
Gemini was being investigated. Each round was motivated by an
attempt-specific leak:

| commit | rule added | motivating attempt |
|---|---|---|
| `f0d4a5b` | evidence_required_keys (all 6 keys); verdict_summary rollup bucket-check; errors field presence | attempt 1 / 2 analysis |
| `5d85f2c` | verdict_summary itself required when `data.verdicts` present | attempt 2 analysis |
| `050bd24` | `data.content` must be non-empty when `output_format != "json"` | attempt 2 (empty content) |
| `33eb6c1` | grader `--approval-seconds` flag; active = wall-clock − approval time | universal (Gemini especially WebFetch / GoogleSearch heavy on consent prompts) |

All four rules are now mechanical: no agent can silently ship a
shape-degraded envelope past the gate, regardless of how plausible
the narrative looks. Attempt 3 is the clearest demonstration — the
narrative was correct but the envelope was not, and the hardened
validator caught every gap.

## Retry plan for attempt 4 (out of scope for this transcript)

The three failure modes point at the same underlying issue: Gemini's
default response budget favors prose, and when asked to emit a full
structured envelope it summarizes. The retry prompt needs to push
back on that explicitly:

1. Fresh Gemini session at repo root.
2. Capture `gemini --version` and confirm
   `.agents/skills/research-verification/SKILL.md` is at v2.1.0.
3. Single first message, prefix-first, with explicit envelope
   requirements:

   ```text
   verify these references - detailed depth, markdown output

   Output requirements (strict, overriding any default response
   shape you would normally use):
   - Emit the FULL schema_version: 2 envelope at the end.
   - data.verdicts MUST contain all 30 entries — one per input ref,
     in input order. No sampling, no truncation, no "see above".
   - data.content MUST contain the rendered markdown report (the
     full verdict report, not empty string) because
     output_format=markdown.
   - data.verdict_summary totals MUST equal what you would get by
     rolling up data.verdicts item-by-item into the coarse-6 keys
     (verified, partially_supported, unsupported, contradicted,
     fabricated, unverifiable). fabricated_doi and
     metadata_mismatch_* roll up to `fabricated`. Do not report
     counts from your narrative tally; report counts from the
     verdicts array.
   - self_check.verdicts_complete MUST be `pass` only if
     data.verdicts.length === meta.input_count. Do not self-attest
     pass otherwise.

   <paste the full acceptance-corpus.txt contents here, including
    comment lines>
   ```

4. Track every consent approval. Log approval count on a scratch
   line as you clear each prompt.
5. Stop stopwatch when the final envelope renders.
6. Run:
   ```bash
   npm run validate:envelopes
   node scripts/grade-acceptance.mjs \
     docs/references/acceptance-runs/preflight-gemini.envelope.json \
     docs/references/eval-harness/acceptance-ground-truth.json \
     --elapsed-minutes=<wall> \
     --approval-seconds=$((<count> * 10))
   ```
7. If validator passes and grader is 4/5 (latency may still miss
   because of consent-prompt overhead), close L3 as PARTIAL with
   the same latency-miss note L2 carries.

## Notes and deviations

1. **Attempt 1 documented a real discoverability gap.** `/skills`
   inside the Gemini session did not activate the linked skill —
   activation is prompt-driven via `activate_skill`. The protocol
   was updated to say so.
2. **Attempt 2 motivated the `content`-non-empty validator rule.**
   The empty `data.content` with `output_format=markdown` was
   previously accepted by the validator; now it is not.
3. **Attempt 3 motivated no new validator rule.** Every breach
   (truncated verdicts, missing `data.content`, inconsistent
   summary totals) was already caught by rules landed earlier in
   this investigation. The hardened contract worked exactly as
   intended — the failure is Gemini's output shape, not the
   validator's coverage.
4. **Parity evidence plan.** Gemini's *narrative* trap-cohort
   tally (5/5) and real-cohort tally (25/25 verified) match
   Claude L1 and Codex L2 attempt 3 within the +/-1 edge-case
   tolerance for pass condition 6. But because no envelope was
   emitted in full, this cannot be used as the canonical Gemini
   column in a three-way parity check. If L3 closes BLOCKED, P4
   parity must either (a) wait for a clean Gemini retry or (b)
   ship as two-agent parity (Claude + Codex) with Gemini narrative
   evidence attached as a non-binding third opinion.
