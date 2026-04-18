# Prompt-Caching Discipline for Atlas Skills

**Status:** ACTIVE, 2026-04-18. Normative for any agent harness loading
a Research Atlas skill. Referenced from `AGENTS.md` §Prompt caching.

This doc tells an agent harness (Claude Code, Codex CLI, Gemini CLI,
or a bespoke one built on the Anthropic API directly) **where to put
cache breakpoints** when loading a Research Atlas skill. Get this
right and the SKILL.md body, the bundled `references/`, and the
acceptance corpus stay cache-warm across turns in a session. Get it
wrong and every turn re-reads thousands of tokens from cold storage.

## Anthropic prompt-cache primer

The rules below are the ones that matter for Atlas; the full spec
lives in Anthropic's docs.

- **Breakpoints are hints, not commands.** You mark up to **4 blocks**
  in the prompt with a `cache_control: {type: "ephemeral"}` hint. The
  API then caches **everything from the start of the prompt up to the
  last hit breakpoint** as one contiguous prefix.
- **TTL defaults to 5 minutes.** Set
  `cache_control: {type: "ephemeral", ttl: "1h"}` for long-running
  sessions. The 1-hour TTL costs **2× the normal cache-write rate** —
  only use it when the session genuinely spans hours (corpus runs,
  multi-pass audits).
- **Order matters.** Anthropic's recommended prompt layout for
  caching is `tools → system → messages`. The skill body goes in
  `system` (or equivalent system-tier content); per-turn inputs go in
  `messages`.
- **20-block lookback.** The API remembers the last 20 cache-eligible
  blocks. If a new request's prefix diverges beyond that window, the
  cache miss is total — you pay the full prompt cost.
- **Any mutation above a breakpoint invalidates it.** If you change
  even one token in `tools` or `system` content before the cache
  breakpoint, the hit fails. Stability of the cached prefix is
  everything.

## The Atlas cache layout

Atlas skills are designed for the following breakpoint strategy.
Harnesses SHOULD follow it unless they have a specific reason not to.

```
┌──────────────────────────────────────────────┐
│ tools                                        │  ← stable (skill + resolver tool schemas)
├──────────────────────────────────────────────┤
│ system:                                      │
│   [Atlas agent instructions — AGENTS.md §2]  │  ← stable
│   [SKILL.md body — full progressive-         │  ← stable per session
│    disclosure tree if loaded eagerly]        │
│                        [[CACHE BREAKPOINT]]  │  ← breakpoint #1 (5m default)
│   [references/<loaded_on_demand>.md]         │  ← appended as the agent pulls them
│                        [[CACHE BREAKPOINT]]  │  ← breakpoint #2 (5m) — optional
├──────────────────────────────────────────────┤
│ messages:                                    │
│   [corpus inputs, per-turn deltas]           │  ← dynamic; NOT cached
└──────────────────────────────────────────────┘
```

### Rules

1. **Put breakpoint #1 directly after the SKILL.md body.** Everything
   above is stable for the session — tools, system preamble, skill
   body. That prefix is the expensive part to re-send every turn.

2. **Per-query `references/` go AFTER the breakpoint.** When the
   agent decides it needs `references/resolver-layer.md` mid-session,
   append it to the system content **after** breakpoint #1. If the
   same references file stays loaded across turns, a second
   breakpoint (#2) can be placed after it to extend the cached
   prefix.

3. **Corpus inputs go in `messages`, never in `system`.** The corpus
   is the per-turn payload; putting it in system content would burn
   the cache every turn.

4. **Skill version changes invalidate the cache.** When a SKILL.md
   bumps its `version:`, the cached prefix is stale. That's expected
   and desired — version bumps should invalidate.

5. **Progressive disclosure is a cache-friendly design.** The smaller
   SKILL.md body (Phase 1 T1 drives this under 200 lines) means the
   cacheable prefix is smaller, hits faster, and stays valid longer
   because it changes less often than the `references/` it points at.

## TTL selection heuristic

| Session kind | TTL | Reasoning |
|---|---|---|
| Single-question verification (one reference, one turn) | no caching | Prefix isn't re-used |
| Standard corpus run (5–50 refs, < 10 minutes) | 5 min (default) | Default TTL covers the whole run |
| Full acceptance gate (30 refs, 30+ minutes) | **1 hour** | Avoid re-writing the cache mid-run |
| Multi-hour audit across manuscripts | **1 hour** | Same as above |
| Interactive debugging across many sessions | no caching | Cross-session caching doesn't apply |

The 2× write cost of 1-hour TTL is paid once; the savings are
per-turn and compound. For any session with 3+ turns against the same
prefix, 1-hour TTL pays off.

## What breaks the cache (don't do this)

- **Rotating timestamps, run IDs, or nonces in system content.**
  Anything that changes turn-to-turn must live in `messages`, not
  `system`.
- **Editing SKILL.md on disk mid-session.** The harness should
  re-load the skill at the next session start; do not hot-patch the
  cached body.
- **Mixing skills in one system prompt.** Each skill cached
  separately is fine; interleaving bits of two SKILL.md bodies into
  one system prompt makes both caches fragile.
- **User messages that reference prior turns by quoting them in
  system.** Keep multi-turn memory in `messages` — the model sees the
  full thread regardless.

## Harness-specific notes

### Claude Code
The plugin manifest + skill loader place the SKILL.md body in system
content automatically. You do not set breakpoints by hand; Claude
Code's own caching layer handles it. But if you author hook scripts
that inject content, inject it into `messages`, not `system`, to
avoid breaking the cache prefix.

### Codex CLI
Native `.agents/skills/` discovery loads SKILL.md into the system
role at session start. Codex's own prompt-cache logic applies. Keep
custom instructions short; anything you add via `codex_hooks` should
not mutate the skill body prefix.

### Gemini CLI
Gemini loads skills via `skills install` (Anthropic SKILL.md format
supported since April 2026). Gemini's prompt caching is separate from
Anthropic's and uses its own mechanics; this doc's exact breakpoint
placements do not apply to Gemini harnesses. Follow Google's caching
guidance for Gemini-specific runs.

### Bespoke harnesses (Anthropic API direct)
Follow the layout above literally. Set up to 4 `cache_control`
markers; never exceed. Test that re-runs within TTL hit the cache
(look for `cache_read_input_tokens` in the response's `usage`).

## Verifying the cache is working

Every Anthropic API response includes:

```json
"usage": {
  "input_tokens": ...,
  "cache_creation_input_tokens": ...,  // first-turn write cost
  "cache_read_input_tokens": ...       // subsequent-turn hit
}
```

After the first turn of a corpus run, `cache_read_input_tokens`
should be the bulk of the input token count. If it's near zero on
turn 2+, your breakpoint is wrong or the prefix is being mutated.

## Related

- AGENTS.md §Prompt caching (harness-facing pointer)
- [`../roadmap/architecture.md`](../roadmap/architecture.md) §Atlas
  Skills (progressive disclosure)
- [`../tasks/phase-1-harden.md`](../tasks/phase-1-harden.md) T1 (the
  under-200-line SKILL.md target) and T5 (this doc)
- Anthropic API reference: [prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
