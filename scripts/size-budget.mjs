#!/usr/bin/env node
/**
 * Bundle-size budget.
 *
 * "Zero dependencies, small core" is a promise the package makes on its front
 * page, and without a gate it erodes one convenience helper at a time. Budgets
 * are gzipped bytes, because that is what a user actually downloads.
 *
 * Raising a budget is fine — it just has to be a deliberate line in a diff.
 */

import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * file → max gzipped bytes.
 *
 * Set at roughly 20% headroom over the 0.3.0 measurements, so ordinary work
 * does not trip the gate but a new dependency-sized addition does.
 */
const BUDGETS = {
  'dist/index.js': 36_000,
  'dist/react.js': 8_500,
  'dist/vue.js': 2_000,
  'dist/svelte.js': 2_000,
  'dist/angular.js': 2_600,
  'dist/solid.js': 2_000,
  'dist/webcomponent.js': 3_400,
  'dist/analytics.js': 3_400,
  'dist/authoring.js': 5_200,
  // Larger than the sum of its parts: the global build inlines everything,
  // including the guidance surfaces and the authoring tools.
  'dist/opentutorial.global.js': 44_000,
  'dist/styles.css': 6_000,
};

const format = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;

async function main() {
  const rows = [];
  let failed = false;
  let missing = false;

  for (const [file, budget] of Object.entries(BUDGETS)) {
    const full = path.join(ROOT, file);
    if (!existsSync(full)) {
      rows.push({ file, size: null, budget, status: 'MISSING' });
      missing = true;
      continue;
    }
    const size = gzipSync(await readFile(full)).length;
    const over = size > budget;
    if (over) failed = true;
    rows.push({ file, size, budget, status: over ? 'OVER' : 'ok' });
  }

  const width = Math.max(...rows.map((r) => r.file.length));
  for (const row of rows) {
    const size = row.size === null ? '—' : format(row.size);
    const pct = row.size === null ? '' : ` (${Math.round((row.size / row.budget) * 100)}%)`;
    const marker = row.status === 'ok' ? ' ' : '!';
    console.log(
      `${marker} ${row.file.padEnd(width)}  ${size.padStart(9)} / ${format(row.budget).padStart(9)}${pct}`,
    );
  }

  if (missing) {
    console.error('\nSome bundles are missing — run `npm run build` first.');
    process.exit(1);
  }
  if (failed) {
    console.error('\nOver budget. Shrink the bundle, or raise the budget in scripts/size-budget.mjs.');
    process.exit(1);
  }
  console.log('\nAll bundles within budget.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
