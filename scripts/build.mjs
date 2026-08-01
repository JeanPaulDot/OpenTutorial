#!/usr/bin/env node
/**
 * The complete build, as one cross-platform command.
 *
 * Three passes have to run in this order, and the first one empties `dist/`:
 *
 *   1. vite build                  → ESM + CJS + styles.css + spec.schema.json
 *   2. BUILD_TARGET=iife vite build → dist/opentutorial.global.js
 *   3. tsc --emitDeclarationOnly   → .d.ts
 *
 * Running only step 1 (which is what `prepare` used to do) silently publishes a
 * package with no global bundle, breaking the `unpkg`, `jsdelivr` and
 * `./opentutorial.global.js` entry points. A `BUILD_TARGET=iife npm run build`
 * shell prefix would fix it on POSIX and fail on Windows, so the sequencing
 * lives here instead of in package.json.
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: 'inherit',
      // npm/npx resolve through the shell on Windows.
      shell: process.platform === 'win32',
      env: { ...process.env, ...env },
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
    });
  });
}

/** Files the published package advertises and must therefore always exist. */
const REQUIRED = [
  'dist/index.js',
  'dist/index.cjs',
  'dist/index.d.ts',
  'dist/react.js',
  'dist/vue.js',
  'dist/svelte.js',
  'dist/angular.js',
  'dist/solid.js',
  'dist/webcomponent.js',
  'dist/analytics.js',
  'dist/authoring.js',
  'dist/opentutorial.global.js',
  'dist/styles.css',
  'dist/spec.schema.json',
];

async function main() {
  await run('npx', ['vite', 'build']);
  await run('npx', ['vite', 'build'], { BUILD_TARGET: 'iife' });
  await run('npx', ['tsc', '-p', 'tsconfig.lib.json', '--emitDeclarationOnly']);

  const missing = REQUIRED.filter((file) => !existsSync(path.join(ROOT, file)));
  if (missing.length > 0) {
    console.error('\nBuild finished but these published files are missing:');
    for (const file of missing) console.error(`  - ${file}`);
    process.exit(1);
  }

  console.log(`\nBuild complete — ${REQUIRED.length} published entry points verified.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
