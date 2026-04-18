#!/usr/bin/env node
// Mirror the canonical Anthropic-format skill tree into every distribution path.
// Canonical source:  .claude/skills/                (Claude Code reads this in-dev)
// Mirror targets:
//   .agents/skills/                                  (shared open-agent-skills tree; Codex + Gemini read natively)
//   plugin/skills/                                   (Claude Code plugin packaging; shipped via marketplace)
//
// Usage:
//   node scripts/mirror-skills.mjs           # copy canonical -> all mirrors, overwriting any drift
//   node scripts/mirror-skills.mjs --check   # exit non-zero if any mirror is out of sync (for CI / prebuild)

import { createHash } from 'node:crypto';
import { readdir, readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const CANONICAL = join(repoRoot, '.claude', 'skills');
const MIRROR_TARGETS = [
  join(repoRoot, '.agents', 'skills'),
  join(repoRoot, 'plugin', 'skills'),
];

const MIRRORED_SKILLS = ['research-verification'];

// Single-file mirrors: canonical source -> bundled copies needed by
// distribution payloads. The plugin hook at plugin/hooks/ needs the
// envelope validator at install time, when the repo's scripts/ tree
// is not present. Keep this list small — anything larger should move
// to a dedicated mirror step.
const FILE_MIRRORS = [
  {
    src: join(repoRoot, 'scripts', 'validators', 'envelope.mjs'),
    dst: join(repoRoot, 'plugin', 'hooks', 'envelope.mjs'),
  },
];

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');

async function walk(root) {
  const out = [];
  async function visit(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        await visit(full);
      } else if (entry.isFile()) {
        out.push(full);
      }
    }
  }
  if (existsSync(root)) await visit(root);
  return out.sort();
}

function hash(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

async function snapshot(root, skill) {
  const base = join(root, skill);
  const files = await walk(base);
  const map = new Map();
  for (const file of files) {
    const rel = relative(base, file).split('\\').join('/');
    const buf = await readFile(file);
    map.set(rel, { buf, digest: hash(buf) });
  }
  return map;
}

async function syncSkillToTarget(skill, mirrorRoot) {
  const src = await snapshot(CANONICAL, skill);
  if (src.size === 0) {
    throw new Error(`Canonical skill missing or empty: .claude/skills/${skill}`);
  }
  const dst = await snapshot(mirrorRoot, skill);
  const mirrorBase = join(mirrorRoot, skill);

  const drift = [];
  for (const [rel, { digest }] of src) {
    const other = dst.get(rel);
    if (!other || other.digest !== digest) drift.push(`~ ${rel}`);
  }
  for (const rel of dst.keys()) {
    if (!src.has(rel)) drift.push(`- ${rel}`);
  }

  if (checkOnly) return drift;

  if (existsSync(mirrorBase)) {
    await rm(mirrorBase, { recursive: true, force: true });
  }
  for (const [rel, { buf }] of src) {
    const target = join(mirrorBase, rel);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, buf);
  }
  return drift;
}

function labelFor(target) {
  return relative(repoRoot, target).split('\\').join('/');
}

async function syncFile({ src, dst }) {
  const srcBuf = await readFile(src);
  let dstBuf = null;
  if (existsSync(dst)) dstBuf = await readFile(dst);
  const drift = dstBuf === null || hash(srcBuf) !== hash(dstBuf);
  if (!drift || checkOnly) return drift;
  await mkdir(dirname(dst), { recursive: true });
  await writeFile(dst, srcBuf);
  return drift;
}

async function main() {
  const results = [];
  for (const target of MIRROR_TARGETS) {
    for (const skill of MIRRORED_SKILLS) {
      const drift = await syncSkillToTarget(skill, target);
      results.push({ target, skill, drift });
    }
  }

  const fileResults = [];
  for (const mirror of FILE_MIRRORS) {
    const drifted = await syncFile(mirror);
    fileResults.push({ mirror, drifted });
  }

  if (checkOnly) {
    const staleSkills = results.filter((r) => r.drift.length > 0);
    const staleFiles = fileResults.filter((r) => r.drifted);
    if (staleSkills.length === 0 && staleFiles.length === 0) {
      console.log('mirror-skills: in sync');
      return;
    }
    console.error('mirror-skills: mirror is out of date. Run `npm run mirror:skills`.');
    for (const { target, skill, drift } of staleSkills) {
      console.error(`  ${labelFor(target)}/${skill}:`);
      for (const line of drift) console.error(`    ${line}`);
    }
    for (const { mirror } of staleFiles) {
      console.error(`  ${labelFor(mirror.dst)} drifts from ${labelFor(mirror.src)}`);
    }
    process.exit(1);
  }

  const changed = results.filter((r) => r.drift.length > 0);
  const fileChanged = fileResults.filter((r) => r.drifted);
  if (changed.length === 0 && fileChanged.length === 0) {
    console.log('mirror-skills: already in sync, no changes written');
    return;
  }
  for (const { target, skill, drift } of changed) {
    console.log(`mirror-skills: synced ${labelFor(target)}/${skill} (${drift.length} change${drift.length === 1 ? '' : 's'})`);
    for (const line of drift) console.log(`  ${line}`);
  }
  for (const { mirror } of fileChanged) {
    console.log(`mirror-skills: synced ${labelFor(mirror.dst)} from ${labelFor(mirror.src)}`);
  }
}

main().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
