> Last audited against this rubric on 2026-07-02 (all 106 library prompts).

# Research Atlas Prompt Quality Rubric (v1)

Every library prompt is scored pass/fail on eight criteria. A prompt's quality
status derives from the audit outcome.

## Criteria

1. **Clear task** — one unambiguous job; the model can act without guessing what
   "done" means.
2. **Explicit inputs** — every `{{variable}}` in the instructions is declared in
   `variables[]` with the right type (multiline for drafts/blocks), required
   flag, and a description; no undeclared or unused variables.
3. **Correct tags** — `stages[]` and `researchTypes[]` actually match what the
   prompt does (e.g. a figure-caption prompt is `visualization`/`writing`, not
   `analysis`).
4. **Concrete output format** — the prompt states the structure of the answer
   (sections, table columns, labels) and it is consistent with the
   `outputFormat` field.
5. **Verification / citation discipline** — where the prompt touches facts,
   sources, or literature it must instruct the model to cite what it actually
   used, mark uncertainty, and never invent references; prompts that could
   induce fabricated citations without such guardrails fail.
6. **No fake authority** — role-play personas are fine ("act as a careful
   statistical reviewer"), but fabricated credentials, named venues implying
   endorsement ("as a Nature editor"), or claims of guaranteed outcomes fail.
   Venue-specific framing must be labeled generic ("top-tier venue") or tagged.
7. **English clarity** — idiomatic, translation artifacts removed (curly-quote
   scare quotes, ● bullets, "please conduct a comprehensive..." filler),
   consistent terminology, concise.
8. **Reusable** — works across disciplines or is explicitly tagged/labeled for
   its niche; no hidden assumptions about one language, country, or venue.

## Status mapping

- **reviewed** — passes all eight criteria after audit (possibly with in-place fixes).
- **unverified** — imported content not yet audited (default for new imports).
- **needs_refresh** — audit found problems that could not be safely fixed in
  place (needs a rewrite, retest, or source refresh); listed honestly in the UI.
- **verified** — reviewed AND exercised against a live model with acceptable
  output (reserved; applied per-prompt when actually tested).

## Fix policy

Safe in-place fixes (allowed during audit): variable declarations, tags,
output-format statements, English clarity edits, guardrail sentences, honest
persona rewording. Unsafe (mark needs_refresh instead): changing the prompt's
core method or claims, anything that would need re-testing to trust.
