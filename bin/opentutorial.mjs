#!/usr/bin/env node
/**
 * OpenTutorial CLI.
 *
 * Runs the same validator the engine runs at startup, so a spec that passes here
 * cannot fail-closed in production for a reason CI could have caught. No
 * dependencies: argument parsing, globbing and colour are all a few lines each,
 * and the package promise is `dependencies: {}`.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(HERE, '..');
const SCHEMA_PATH = path.join(PKG_ROOT, 'dist', 'spec.schema.json');

// --- output ---------------------------------------------------------------

const useColour = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code, text) => (useColour ? `\u001b[${code}m${text}\u001b[0m` : text);
const red = (t) => paint('31', t);
const yellow = (t) => paint('33', t);
const green = (t) => paint('32', t);
const dim = (t) => paint('2', t);
const bold = (t) => paint('1', t);

// --- args -----------------------------------------------------------------

function parseArgs(argv) {
  const flags = new Set();
  const positional = [];
  for (const arg of argv) {
    if (arg.startsWith('--')) flags.add(arg.slice(2));
    else if (arg.startsWith('-') && arg.length > 1) {
      for (const ch of arg.slice(1)) flags.add(ch);
    } else positional.push(arg);
  }
  return { flags, positional };
}

// --- globbing -------------------------------------------------------------

/** Minimal glob → RegExp. Supports `**`, `*` and `?`; enough for spec paths. */
function globToRegExp(pattern) {
  const normalised = pattern.replace(/\\/g, '/');
  let out = '';
  for (let i = 0; i < normalised.length; i += 1) {
    const char = normalised[i];
    if (char === '*') {
      if (normalised[i + 1] === '*') {
        // `**/` may match zero directories, so the slash is part of the group.
        out += normalised[i + 2] === '/' ? '(?:.*/)?' : '.*';
        i += normalised[i + 2] === '/' ? 2 : 1;
      } else out += '[^/]*';
    } else if (char === '?') out += '[^/]';
    else out += char.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${out}$`);
}

async function walk(dir, acc = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return acc; }
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

/** Resolve file paths, directories and globs to a sorted, unique file list. */
async function resolveInputs(patterns) {
  const found = new Set();

  for (const pattern of patterns) {
    if (existsSync(pattern)) {
      const info = await stat(pattern);
      if (info.isDirectory()) {
        for (const file of await walk(pattern)) {
          if (file.endsWith('.json')) found.add(file);
        }
      } else found.add(pattern);
      continue;
    }

    // Walk from the deepest non-glob prefix so `specs/**/*.json` does not scan
    // the whole working tree.
    const normalised = pattern.replace(/\\/g, '/');
    const firstMagic = normalised.search(/[*?]/);
    const base = firstMagic === -1
      ? '.'
      : (normalised.slice(0, firstMagic).replace(/\/[^/]*$/, '') || '.');
    const re = globToRegExp(normalised);
    for (const file of await walk(base)) {
      if (re.test(file.replace(/\\/g, '/'))) found.add(file);
    }
  }

  return [...found].sort();
}

// --- library ---------------------------------------------------------------

async function loadCore() {
  const entry = path.join(PKG_ROOT, 'dist', 'index.js');
  if (!existsSync(entry)) {
    console.error(red(`Could not find ${entry}.`));
    console.error(dim('Run `npm run build` first if you are working from a source checkout.'));
    process.exit(2);
  }
  return import(pathToFileURL(entry).href);
}

// --- commands --------------------------------------------------------------

async function commandValidate(positional, flags) {
  const patterns = positional.length > 0 ? positional : ['.'];
  const files = (await resolveInputs(patterns)).filter((f) => f.endsWith('.json'));

  if (files.length === 0) {
    console.error(red('No JSON files matched.'));
    return 2;
  }

  const { validateSpec } = await loadCore();
  const strict = flags.has('strict');
  const asJson = flags.has('json');
  const quiet = flags.has('quiet') || flags.has('q');

  const report = [];
  let errorCount = 0;
  let warningCount = 0;
  const seenIds = new Map();

  for (const file of files) {
    let parsed;
    try {
      parsed = JSON.parse(await readFile(file, 'utf8'));
    } catch (err) {
      errorCount += 1;
      report.push({ file, ok: false, errors: [{ path: '$', message: `invalid JSON: ${err.message}`, severity: 'error' }], warnings: [] });
      continue;
    }

    // A file may hold one spec or an array of them.
    const specs = Array.isArray(parsed) ? parsed : [parsed];
    for (const [index, spec] of specs.entries()) {
      const label = specs.length > 1 ? `${file} [${index}]` : file;
      const result = validateSpec(spec);

      const errors = [...result.errors];
      const warnings = [...result.warnings];

      // Duplicate ids across files are invisible to a per-spec validator, and
      // they silently shadow each other at runtime.
      const id = typeof spec?.id === 'string' ? spec.id : null;
      if (id) {
        const previous = seenIds.get(id);
        if (previous) errors.push({ path: '$.id', message: `duplicate tour id "${id}" (also in ${previous})`, severity: 'error' });
        else seenIds.set(id, label);
      }

      errorCount += errors.length;
      warningCount += warnings.length;
      report.push({ file: label, ok: errors.length === 0, errors, warnings });
    }
  }

  if (asJson) {
    console.log(JSON.stringify({ ok: errorCount === 0 && (!strict || warningCount === 0), errorCount, warningCount, files: report }, null, 2));
  } else {
    for (const entry of report) {
      const issues = [...entry.errors, ...entry.warnings];
      if (issues.length === 0) {
        if (!quiet) console.log(`${green('✓')} ${entry.file}`);
        continue;
      }
      const marker = entry.errors.length > 0 ? red('✗') : yellow('!');
      console.log(`${marker} ${bold(entry.file)}`);
      for (const issue of entry.errors) console.log(`  ${red('error')}   ${issue.path} — ${issue.message}`);
      for (const issue of entry.warnings) console.log(`  ${yellow('warning')} ${issue.path} — ${issue.message}`);
    }

    const summary = `${report.length} spec(s), ${errorCount} error(s), ${warningCount} warning(s)`;
    console.log(errorCount > 0 ? red(summary) : warningCount > 0 ? yellow(summary) : green(summary));
    if (strict && warningCount > 0 && errorCount === 0) {
      console.log(dim('--strict: warnings are treated as failures.'));
    }
  }

  if (errorCount > 0) return 1;
  if (strict && warningCount > 0) return 1;
  return 0;
}

async function commandLintSelectors(positional, flags) {
  const [url, ...specPatterns] = positional;
  if (!url) {
    console.error(red('Usage: opentutorial lint-selectors <url> [specs...]'));
    return 2;
  }

  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.error(red('lint-selectors needs Playwright, which is not bundled.'));
    console.error(dim('Install it in your project:  npm i -D playwright && npx playwright install chromium'));
    return 2;
  }

  const files = (await resolveInputs(specPatterns.length > 0 ? specPatterns : ['.']))
    .filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    console.error(red('No spec files matched.'));
    return 2;
  }

  const targets = [];
  for (const file of files) {
    let parsed;
    try { parsed = JSON.parse(await readFile(file, 'utf8')); } catch { continue; }
    for (const spec of Array.isArray(parsed) ? parsed : [parsed]) {
      for (const step of spec?.steps ?? []) {
        const selector = step?.target?.selector;
        if (!selector) continue;
        // A step may carry a fallback list; every entry is worth checking, but
        // only a total miss is a failure.
        const list = Array.isArray(selector) ? selector : [selector];
        targets.push({ file, tourId: spec.id, stepId: step.id, selectors: list });
      }
    }
  }

  if (targets.length === 0) {
    console.log(green('No targeted steps to check.'));
    return 0;
  }

  const browser = await chromium.launch();
  let missing = 0;
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: flags.has('networkidle') ? 'networkidle' : 'load' });

    for (const target of targets) {
      const results = [];
      for (const selector of target.selectors) {
        const count = await page.locator(selector).count().catch(() => -1);
        results.push({ selector, count });
      }
      const hit = results.find((r) => r.count > 0);
      const label = `${target.tourId}/${target.stepId}`;
      if (hit) {
        const ambiguous = hit.count > 1;
        console.log(`${ambiguous ? yellow('!') : green('✓')} ${label} ${dim(hit.selector)}${ambiguous ? yellow(` (matches ${hit.count})`) : ''}`);
      } else {
        missing += 1;
        console.log(`${red('✗')} ${label} ${dim(target.selectors.join(', '))} ${red('no match')}`);
      }
    }
  } finally {
    await browser.close();
  }

  const summary = `${targets.length} step(s), ${missing} unmatched`;
  console.log(missing > 0 ? red(summary) : green(summary));
  return missing > 0 ? 1 : 0;
}

function commandSchema() {
  if (!existsSync(SCHEMA_PATH)) {
    console.error(red('Schema not found. Build the package first.'));
    return 2;
  }
  console.log(SCHEMA_PATH);
  return 0;
}

async function commandVersion() {
  const pkg = JSON.parse(await readFile(path.join(PKG_ROOT, 'package.json'), 'utf8'));
  console.log(pkg.version);
  return 0;
}

function usage() {
  console.log(`
${bold('opentutorial')} — spec tooling for @opentutorial/core

${bold('Usage')}
  opentutorial validate [paths...]        Validate spec JSON (default: current directory)
  opentutorial lint-selectors <url> [paths...]
                                          Check every step selector against a live page
  opentutorial schema                     Print the path to spec.schema.json
  opentutorial version                    Print the package version

${bold('Options')}
  --strict        Treat warnings as failures (validate)
  --json          Machine-readable output (validate)
  --quiet, -q     Only print files with issues (validate)
  --networkidle   Wait for network idle before checking (lint-selectors)

${bold('Examples')}
  opentutorial validate specs/**/*.json --strict
  opentutorial validate ./tours
  opentutorial lint-selectors http://localhost:3000 specs/

${bold('Exit codes')}
  0  everything passed
  1  validation or selector failures
  2  bad usage or missing prerequisite
`.trim());
  return 0;
}

// --- entry -----------------------------------------------------------------

async function main() {
  // Parse everything, then take the first positional as the command — so
  // `opentutorial --help` and `opentutorial validate --help` both work.
  const { flags, positional: all } = parseArgs(process.argv.slice(2));
  const [command, ...positional] = all;

  if (flags.has('version') || flags.has('v') || command === 'version') return commandVersion();
  if (!command || flags.has('help') || flags.has('h') || command === 'help') return usage();

  switch (command) {
    case 'validate': return commandValidate(positional, flags);
    case 'lint-selectors': return commandLintSelectors(positional, flags);
    case 'schema': return commandSchema();
    default:
      console.error(red(`Unknown command "${command}".`));
      usage();
      return 2;
  }
}

main().then(
  (code) => process.exit(code ?? 0),
  (err) => {
    console.error(red(err?.stack ?? String(err)));
    process.exit(2);
  },
);
