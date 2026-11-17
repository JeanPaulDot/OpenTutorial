#!/usr/bin/env node
/**
 * OpenTutorial CLI.
 *
 * Runs the same validator the engine runs at startup, so a spec that passes here
 * cannot fail-closed in production for a reason CI could have caught. No
 * dependencies: argument parsing, globbing and colour are all a few lines each,
 * and the package promise is `dependencies: {}`.
 */

import { createServer, request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { connect as netConnect } from 'node:net';
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

/** Flags that consume the next argument. Everything else is boolean. */
const VALUE_FLAGS = new Set(['port']);

function parseArgs(argv) {
  // A Map so value flags can carry their value; `.has()` still answers the
  // boolean question for the rest.
  const flags = new Map();
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const [name, inline] = arg.slice(2).split('=');
      if (inline !== undefined) flags.set(name, inline);
      else if (VALUE_FLAGS.has(name) && argv[i + 1] !== undefined && !argv[i + 1].startsWith('-')) {
        // Without this, `--port 5000` left "5000" behind as a spec path.
        flags.set(name, argv[i + 1]);
        i += 1;
      } else flags.set(name, true);
    } else if (arg.startsWith('-') && arg.length > 1) {
      for (const ch of arg.slice(1)) flags.set(ch, true);
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

/**
 * Run your specs against a live app without wiring them into it.
 *
 * This is a reverse proxy, not an iframe. The first version framed the target,
 * which could never work: a page on :3000 framed by a page on :4180 is
 * cross-origin, and nothing — this library included — may read into a
 * cross-origin frame. Proxying makes the app same-origin with the injected
 * tour, so selectors resolve exactly as they will in production.
 *
 * Specs are re-read from disk on every page load, so the loop is
 * *edit JSON → refresh*.
 */
async function commandPreview(positional, flags) {
  const [target, ...specPatterns] = positional;
  if (!target) {
    console.error(red('Usage: opentutorial preview <url> [specs...] [--port 4180]'));
    return 2;
  }

  let origin;
  try { origin = new URL(target); } catch {
    console.error(red(`Not a valid URL: ${target}`));
    return 2;
  }

  const patterns = specPatterns.length > 0 ? specPatterns : ['.'];
  const { validateSpec } = await loadCore();

  const loadSpecs = async () => {
    const files = (await resolveInputs(patterns)).filter((f) => f.endsWith('.json'));
    const specs = [];
    const problems = [];
    for (const file of files) {
      let parsed;
      try { parsed = JSON.parse(await readFile(file, 'utf8')); } catch (err) {
        problems.push(`${file}: invalid JSON (${err.message})`);
        continue;
      }
      for (const spec of Array.isArray(parsed) ? parsed : [parsed]) {
        // Anything without the marker is some other JSON file in the folder.
        if (!spec || spec.specVersion !== 1 || typeof spec.id !== 'string') continue;
        const result = validateSpec(spec);
        for (const issue of result.errors) problems.push(`${spec.id} ${issue.path}: ${issue.message}`);
        specs.push(spec);
      }
    }
    return { specs, problems };
  };

  const initial = await loadSpecs();
  if (initial.specs.length === 0) {
    console.error(red('No specs found. A spec needs "specVersion": 1 and an "id".'));
    return 2;
  }

  const port = Number(flags.get('port')) || 4180;
  const assets = {
    '/__ot/opentutorial.global.js': [path.join(PKG_ROOT, 'dist', 'opentutorial.global.js'), 'text/javascript'],
    '/__ot/styles.css': [path.join(PKG_ROOT, 'dist', 'styles.css'), 'text/css'],
  };

  const INJECT = '<link rel="stylesheet" href="/__ot/styles.css">'
    + '<script src="/__ot/opentutorial.global.js"></script>'
    + '<script src="/__ot/boot.js"></script>';

  const requester = origin.protocol === 'https:' ? httpsRequest : httpRequest;

  const server = createServer(async (req, res) => {
    const url = req.url ?? '/';
    const pathname = url.split('?')[0];

    if (pathname === '/__ot/specs.json') {
      const fresh = await loadSpecs();
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      res.end(JSON.stringify(fresh));
      return;
    }
    if (pathname === '/__ot/boot.js') {
      res.writeHead(200, { 'content-type': 'text/javascript', 'cache-control': 'no-store' });
      res.end(PREVIEW_BOOT);
      return;
    }
    if (assets[pathname]) {
      const [file, type] = assets[pathname];
      if (!existsSync(file)) { res.writeHead(404); res.end('Build the package first'); return; }
      res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' });
      res.end(await readFile(file));
      return;
    }

    // Everything else is the app. Ask for an uncompressed body so HTML can be
    // edited without a decompression dependency.
    const headers = { ...req.headers, host: origin.host };
    delete headers['accept-encoding'];

    const upstream = requester({
      protocol: origin.protocol,
      hostname: origin.hostname,
      port: origin.port || (origin.protocol === 'https:' ? 443 : 80),
      method: req.method,
      path: url,
      headers,
    }, (up) => {
      const outHeaders = { ...up.headers };
      // Keep redirects inside the proxy.
      if (typeof outHeaders.location === 'string' && outHeaders.location.startsWith(origin.origin)) {
        outHeaders.location = outHeaders.location.slice(origin.origin.length) || '/';
      }

      const isHtml = String(up.headers['content-type'] ?? '').includes('text/html');
      if (!isHtml) {
        res.writeHead(up.statusCode ?? 502, outHeaders);
        up.pipe(res);
        return;
      }

      const chunks = [];
      up.on('data', (c) => chunks.push(c));
      up.on('end', () => {
        let html = Buffer.concat(chunks).toString('utf8');
        const at = html.lastIndexOf('</body>');
        html = at === -1 ? html + INJECT : html.slice(0, at) + INJECT + html.slice(at);
        delete outHeaders['content-length'];
        res.writeHead(up.statusCode ?? 200, outHeaders);
        res.end(html);
      });
    });

    upstream.on('error', (err) => {
      res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
      res.end(`OpenTutorial preview could not reach ${origin.origin}\n${err.message}\n\nIs the app running?`);
    });
    req.pipe(upstream);
  });

  // Dev servers push hot-reload updates over a WebSocket; without this the app
  // loads but never updates, and some frameworks show an error overlay.
  server.on('upgrade', (req, socket, head) => {
    if (origin.protocol !== 'http:') { socket.destroy(); return; }
    const up = netConnect(Number(origin.port) || 80, origin.hostname, () => {
      const lines = [`${req.method} ${req.url} HTTP/${req.httpVersion}`];
      for (let i = 0; i < req.rawHeaders.length; i += 2) {
        const name = req.rawHeaders[i];
        const value = name.toLowerCase() === 'host' ? origin.host : req.rawHeaders[i + 1];
        lines.push(`${name}: ${value}`);
      }
      up.write(`${lines.join('\r\n')}\r\n\r\n`);
      if (head?.length) up.write(head);
      up.pipe(socket);
      socket.pipe(up);
    });
    up.on('error', () => socket.destroy());
    socket.on('error', () => up.destroy());
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  }).catch((err) => {
    console.error(red(err.code === 'EADDRINUSE' ? `Port ${port} is in use. Try --port ${port + 1}.` : err.message));
    process.exit(2);
  });

  console.log(green(`Preview on http://127.0.0.1:${port}`) + dim(`  →  ${origin.origin}`));
  console.log(dim(`${initial.specs.length} spec(s). Edit the JSON and refresh the page.`));
  for (const problem of initial.problems) console.log(yellow(`! ${problem}`));
  console.log(dim('Ctrl+C to stop.'));

  await new Promise((resolve) => process.on('SIGINT', () => { server.close(); resolve(); }));
  return 0;
}

/** Runs in the proxied page: loads the specs and adds a small control bar. */
const PREVIEW_BOOT = `
(async () => {
  const data = await fetch('/__ot/specs.json').then((r) => r.json()).catch(() => ({ specs: [], problems: ['could not load specs'] }));
  if (!window.OpenTutorial) return;

  const layer = OpenTutorial.createTutorialLayer({ specs: data.specs, deepLinkParam: 'tour', debug: false });
  window.__otPreview = layer;

  const bar = document.createElement('div');
  bar.setAttribute('data-opentutorial', '');
  bar.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:2147483000;display:flex;gap:6px;align-items:center;padding:6px 8px;border-radius:10px;background:#17171f;color:#f2f2f7;font:12px system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.35)';

  const pick = document.createElement('select');
  pick.setAttribute('aria-label', 'Tour');
  pick.style.cssText = 'font:inherit;background:#23232e;color:inherit;border:1px solid #444;border-radius:6px;padding:3px 6px;max-width:200px';
  for (const spec of data.specs) {
    const option = document.createElement('option');
    option.value = spec.id;
    const blocked = layer.whyBlocked(spec.id);
    option.textContent = (typeof spec.title === 'string' ? spec.title : spec.id) + (blocked === 'spec failed validation' ? '  (invalid)' : '');
    pick.appendChild(option);
  }
  const remembered = sessionStorage.getItem('ot-preview-tour');
  if (remembered && data.specs.some((s) => s.id === remembered)) pick.value = remembered;
  pick.onchange = () => sessionStorage.setItem('ot-preview-tour', pick.value);

  const button = (label, fn) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.style.cssText = 'font:inherit;background:#6d5cff;color:#fff;border:0;border-radius:6px;padding:4px 10px;cursor:pointer';
    b.onclick = fn;
    return b;
  };

  bar.append(
    pick,
    button('Start', () => { layer.reset(); layer.start(pick.value); }),
    button('Stop', () => layer.stop()),
  );
  if (data.problems.length) {
    const warn = document.createElement('span');
    warn.textContent = data.problems.length + ' issue(s)';
    warn.title = data.problems.join('\\n');
    warn.style.cssText = 'color:#fbbf24;cursor:help';
    bar.append(warn);
    console.warn('[opentutorial preview]\\n' + data.problems.join('\\n'));
  }
  document.body.appendChild(bar);
})();
`;

// --- MCP --------------------------------------------------------------------

/**
 * A Model Context Protocol server over stdio.
 *
 * Gives an AI agent the same grounding a human gets from the docs and the
 * validator: the schema, the guides, and a way to check its work. Hand-rolled
 * JSON-RPC rather than an SDK, because the package promise is `dependencies: {}`
 * and the protocol surface needed here is four methods.
 *
 *   { "mcpServers": { "opentutorial": { "command": "npx", "args": ["opentutorial", "mcp"] } } }
 */
async function commandMcp() {
  const core = await loadCore();
  const authoringEntry = path.join(PKG_ROOT, 'dist', 'authoring.js');
  const authoring = existsSync(authoringEntry) ? await import(pathToFileURL(authoringEntry).href) : {};
  const docsRoot = path.join(PKG_ROOT, 'docs');
  const pkg = JSON.parse(await readFile(path.join(PKG_ROOT, 'package.json'), 'utf8'));

  const listDocs = async () => (existsSync(docsRoot) ? (await walk(docsRoot)) : [])
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.relative(docsRoot, f).replace(/\\/g, '/'))
    .sort();

  const parseSpec = (input) => {
    if (typeof input === 'string') {
      try { return JSON.parse(input); } catch (err) { throw new Error(`spec is not valid JSON: ${err.message}`); }
    }
    return input;
  };

  const tools = [
    {
      name: 'validate_spec',
      description: 'Validate an OpenTutorial TutorialSpec. Returns errors (the tour will not run) and warnings. Always call this after writing or editing a spec.',
      inputSchema: {
        type: 'object',
        properties: { spec: { description: 'The spec, as a JSON object or a JSON string.' } },
        required: ['spec'],
      },
      run: ({ spec }) => {
        const result = core.validateSpec(parseSpec(spec));
        if (result.ok && result.warnings.length === 0) return 'Valid. No errors, no warnings.';
        const lines = [result.ok ? 'Valid, with warnings.' : 'INVALID — the tour will not run until the errors are fixed.'];
        for (const e of result.errors) lines.push(`error   ${e.path} — ${e.message}`);
        for (const w of result.warnings) lines.push(`warning ${w.path} — ${w.message}`);
        return lines.join('\n');
      },
    },
    {
      name: 'describe_spec',
      description: 'Summarise a TutorialSpec in plain language: when it starts, who sees it, and what each step does.',
      inputSchema: { type: 'object', properties: { spec: {} }, required: ['spec'] },
      run: ({ spec }) => {
        if (!authoring.describeSpec) throw new Error('describe_spec is unavailable in this build');
        return authoring.describeSpec(parseSpec(spec));
      },
    },
    {
      name: 'get_spec_schema',
      description: 'Return the JSON Schema for TutorialSpec — every field, type and enum.',
      inputSchema: { type: 'object', properties: {} },
      run: async () => readFile(SCHEMA_PATH, 'utf8'),
    },
    {
      name: 'get_authoring_prompt',
      description: 'Return concise rules for writing a valid TutorialSpec, optionally grounded in real page selectors and a goal.',
      inputSchema: {
        type: 'object',
        properties: {
          goal: { type: 'string', description: 'What the tour should achieve.' },
          selectors: { type: 'array', items: { type: 'string' }, description: 'Real selectors that exist on the page.' },
          contextKeys: { type: 'array', items: { type: 'string' } },
        },
      },
      run: ({ goal, selectors = [], contextKeys = [] }) => {
        if (!authoring.createAuthoringPrompt) throw new Error('get_authoring_prompt is unavailable in this build');
        const anchors = selectors.map((selector) => ({ selector, score: 70, tag: 'element', visible: true }));
        return authoring.createAuthoringPrompt({ goal, anchors, contextKeys });
      },
    },
    {
      name: 'list_docs',
      description: 'List the documentation pages shipped with this version of OpenTutorial.',
      inputSchema: { type: 'object', properties: {} },
      run: async () => (await listDocs()).join('\n') || 'No docs found.',
    },
    {
      name: 'read_doc',
      description: 'Read one documentation page. Use a path from list_docs, e.g. "spec-reference.md" or "guides/targeting.md".',
      inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
      run: async ({ path: requested }) => {
        const full = path.resolve(docsRoot, String(requested));
        // Resolved-path containment: a request for "../package.json" must not leave docs/.
        if (full !== docsRoot && !full.startsWith(docsRoot + path.sep)) throw new Error('path is outside the docs directory');
        if (!existsSync(full)) throw new Error(`no such doc: ${requested}. Call list_docs.`);
        return readFile(full, 'utf8');
      },
    },
    {
      name: 'search_docs',
      description: 'Search the documentation for a phrase. Returns matching lines with their page.',
      inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
      run: async ({ query }) => {
        const needle = String(query ?? '').toLowerCase().trim();
        if (!needle) throw new Error('query is empty');
        const hits = [];
        for (const doc of await listDocs()) {
          const lines = (await readFile(path.join(docsRoot, doc), 'utf8')).split(/\r?\n/);
          lines.forEach((line, i) => {
            if (hits.length < 40 && line.toLowerCase().includes(needle)) hits.push(`${doc}:${i + 1}: ${line.trim().slice(0, 200)}`);
          });
        }
        return hits.length ? hits.join('\n') : `No matches for "${query}".`;
      },
    },
  ];

  const send = (message) => process.stdout.write(`${JSON.stringify(message)}\n`);
  const reply = (id, result) => send({ jsonrpc: '2.0', id, result });
  const fail = (id, code, message) => send({ jsonrpc: '2.0', id, error: { code, message } });

  const handle = async (message) => {
    const { id, method, params } = message;
    const isRequest = id !== undefined && id !== null;

    switch (method) {
      case 'initialize':
        reply(id, {
          protocolVersion: params?.protocolVersion ?? '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'opentutorial', version: pkg.version },
          instructions: 'Tools for authoring OpenTutorial product tours. Read spec-reference.md first, write the spec, then always call validate_spec.',
        });
        return;
      case 'ping':
        reply(id, {});
        return;
      case 'tools/list':
        reply(id, { tools: tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
        return;
      case 'tools/call': {
        const tool = tools.find((t) => t.name === params?.name);
        if (!tool) { fail(id, -32602, `Unknown tool: ${params?.name}`); return; }
        try {
          const text = await tool.run(params?.arguments ?? {});
          reply(id, { content: [{ type: 'text', text: String(text) }] });
        } catch (err) {
          // A tool failure is a result the model can read and act on, not a
          // protocol error.
          reply(id, { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true });
        }
        return;
      }
      default:
        // Notifications (no id) are never answered, known or not.
        if (isRequest) fail(id, -32601, `Method not found: ${method}`);
    }
  };

  let buffer = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    buffer += chunk;
    let newline;
    while ((newline = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line) continue;
      let message;
      try { message = JSON.parse(line); } catch { fail(null, -32700, 'Parse error'); continue; }
      handle(message).catch((err) => fail(message?.id ?? null, -32603, err.message));
    }
  });

  // stdout is the protocol channel; anything human-readable goes to stderr.
  console.error(`opentutorial MCP server v${pkg.version} ready on stdio`);
  await new Promise((resolve) => process.stdin.on('end', resolve));
  return 0;
}

async function commandDescribe(positional) {
  const files = (await resolveInputs(positional.length > 0 ? positional : ['.'])).filter((f) => f.endsWith('.json'));
  const authoringEntry = path.join(PKG_ROOT, 'dist', 'authoring.js');
  if (!existsSync(authoringEntry)) { console.error(red('Build the package first.')); return 2; }
  const { describeSpec } = await import(pathToFileURL(authoringEntry).href);

  let shown = 0;
  for (const file of files) {
    let parsed;
    try { parsed = JSON.parse(await readFile(file, 'utf8')); } catch { continue; }
    for (const spec of Array.isArray(parsed) ? parsed : [parsed]) {
      if (!spec || spec.specVersion !== 1 || !Array.isArray(spec.steps)) continue;
      console.log(`${dim(file)}\n${describeSpec(spec)}\n`);
      shown += 1;
    }
  }
  if (shown === 0) { console.error(red('No specs found.')); return 2; }
  return 0;
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
  opentutorial preview <url> [paths...]   Proxy a running app with your specs injected
  opentutorial describe [paths...]        Summarise specs in plain language
  opentutorial mcp                        Start an MCP server (stdio) for AI agents
  opentutorial schema                     Print the path to spec.schema.json
  opentutorial version                    Print the package version

${bold('Options')}
  --strict        Treat warnings as failures (validate)
  --json          Machine-readable output (validate)
  --quiet, -q     Only print files with issues (validate)
  --networkidle   Wait for network idle before checking (lint-selectors)
  --port <n>      Port for the preview server (default 4180)

${bold('Examples')}
  opentutorial validate specs/**/*.json --strict
  opentutorial validate ./tours
  opentutorial lint-selectors http://localhost:3000 specs/
  opentutorial preview http://localhost:3000 specs/

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
    case 'preview': return commandPreview(positional, flags);
    case 'describe': return commandDescribe(positional);
    case 'mcp': return commandMcp();
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
