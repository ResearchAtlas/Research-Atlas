# Research Atlas

Research Atlas is an inspectable research plugin suite for rigorous
AI-assisted research. The companion site is
[researchatlas.info](https://researchatlas.info).

Version 1 ships one flagship skill:

- `research-verification` — end-to-end reference verification across
  Claude Code, Codex CLI, and Gemini CLI

## Install

### Claude Code

```text
/plugin marketplace add ResearchAtlas/Research-Atlas
/plugin install research-verification@research-atlas
```

Then ask: `verify these references`

### Codex CLI

```bash
git clone https://github.com/ResearchAtlas/Research-Atlas
cd Research-Atlas
codex
```

Then ask: `verify these references`

Codex discovers the skill natively from
`.agents/skills/research-verification/`. You can also invoke it with
`$research-verification`.

### Gemini CLI

```bash
gemini skills install https://github.com/ResearchAtlas/Research-Atlas \
  --path .agents/skills/research-verification
gemini skills list
```

Then ask: `verify these references`

Gemini activates the skill by prompt match and asks for consent before
loading the skill body.

## What The Skill Does

- Resolves DOI-backed references against CrossRef first and OpenAlex as
  fallback.
- Cross-checks title, first-author surname, and publication year to
  catch fabricated DOIs and metadata mismatches.
- Emits a structured per-reference verdict envelope alongside a
  human-readable report.

## Website

The website is the public library and guide surface for Research Atlas:

- Library: copy-ready prompts
- Workflows: step-by-step research procedures
- Guides: framework and method explanations

Start here: [researchatlas.info](https://researchatlas.info)

## For Maintainers

```bash
npm install
npm run dev
npm run build
```

Useful verification commands:

```bash
npm run mirror:skills:check
npm run validate:envelopes
npm run grade:acceptance:fixtures
npm run test:hook:smoke
```

## Contributing

This repo contains both the website and the shipped flagship skill.
Changes usually fall into one of two lanes:

- website changes under `src/`
- canonical skill changes under `.claude/skills/research-verification/`

Do not hand-edit `.agents/skills/` or `plugin/skills/`; those are
mechanical mirrors.

## License

Released under the MIT License. See [LICENSE](LICENSE).
