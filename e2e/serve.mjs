#!/usr/bin/env node
/**
 * Minimal static server for the E2E fixtures.
 *
 * Serves `e2e/fixtures` at `/` and the built `dist/` at `/dist`, so the tests
 * load exactly the files npm publishes. A dependency-free server keeps the
 * "zero runtime deps, minimal dev deps" promise intact.
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const FIXTURES = path.join(HERE, 'fixtures');
const PORT = 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.cjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  // `/dist/...` maps to the real build output; everything else is a fixture.
  const base = clean.startsWith('/dist/') ? ROOT : FIXTURES;
  const relative = clean.startsWith('/dist/') ? clean.slice(1) : clean.replace(/^\//, '');
  const full = path.join(base, relative || 'index.html');

  // Refuse anything that escapes the served roots.
  if (!full.startsWith(ROOT)) return null;
  if (existsSync(full) && !full.endsWith(path.sep)) return full;

  const asIndex = path.join(full, 'index.html');
  return existsSync(asIndex) ? asIndex : null;
}

createServer(async (req, res) => {
  const file = resolve(req.url ?? '/');
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
    return;
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(500, { 'content-type': 'text/plain' });
    res.end('Read error');
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`E2E fixtures on http://127.0.0.1:${PORT}`);
});

process.on('SIGTERM', () => process.exit(0));
