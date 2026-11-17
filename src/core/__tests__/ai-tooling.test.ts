import { describe, it, expect, beforeEach } from 'vitest';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { collectAnchors, describeSpec, createAuthoringPrompt, extractSpec } from '../authoring/ai';
import { validateSpec } from '../schema';
import type { TutorialSpec } from '../types';

function sized(el: Element): void {
  el.getBoundingClientRect = () => ({
    x: 0, y: 0, width: 80, height: 24, top: 0, left: 0, right: 80, bottom: 24, toJSON: () => ({}),
  }) as DOMRect;
}

beforeEach(() => { document.body.innerHTML = ''; });

describe('collectAnchors', () => {
  it('lists targetable elements with stable selectors, best first', () => {
    document.body.innerHTML = `
      <nav><a href="/home">Home</a></nav>
      <button data-tour="new-project">New project</button>
      <button class="css-1a2b3c">Fragile</button>
      <input placeholder="Search" data-testid="search" />
    `;
    document.querySelectorAll('*').forEach(sized);

    const anchors = collectAnchors();
    const selectors = anchors.map((a) => a.selector);

    expect(selectors).toContain('[data-tour="new-project"]');
    expect(selectors).toContain('[data-testid="search"]');
    // Sorted by stability, so the explicit hooks lead.
    expect(anchors[0].score).toBeGreaterThanOrEqual(anchors.at(-1)!.score);

    const project = anchors.find((a) => a.selector === '[data-tour="new-project"]')!;
    expect(project.text).toBe('New project');
    expect(project.role).toBe('button');
    expect(project.visible).toBe(true);
  });

  it('never offers the library own UI', () => {
    document.body.innerHTML = `
      <div class="ot-root"><button class="ot-btn">Next</button></div>
      <div data-ot-recorder><button>Copy</button></div>
      <button id="real">Real</button>
    `;
    document.querySelectorAll('*').forEach(sized);

    const anchors = collectAnchors();
    expect(anchors).toHaveLength(1);
    expect(anchors[0].text).toBe('Real');
  });

  it('skips hidden elements unless asked', () => {
    document.body.innerHTML = '<button id="hidden">Hidden</button>';
    expect(collectAnchors()).toHaveLength(0);
    expect(collectAnchors(document, { includeHidden: true })).toHaveLength(1);
  });

  it('honours limit and minScore, and de-duplicates', () => {
    document.body.innerHTML = Array.from({ length: 10 }, (_, i) => `<button data-tour="b${i}">B${i}</button>`).join('');
    document.querySelectorAll('*').forEach(sized);

    expect(collectAnchors(document, { limit: 3 })).toHaveLength(3);
    expect(collectAnchors(document, { minScore: 101 })).toHaveLength(0);
    const all = collectAnchors();
    expect(new Set(all.map((a) => a.selector)).size).toBe(all.length);
  });

  it('truncates long labels', () => {
    document.body.innerHTML = `<button data-tour="long">${'word '.repeat(40)}</button>`;
    document.querySelectorAll('*').forEach(sized);
    expect(collectAnchors()[0].text!.length).toBeLessThanOrEqual(80);
  });
});

describe('describeSpec', () => {
  const spec = {
    specVersion: 1,
    id: 'billing',
    title: 'Set up billing',
    trigger: { type: 'route', path: '/billing' },
    audience: { showIf: "plan === 'trial'" },
    frequency: { max: 2 },
    onComplete: { startTour: 'invite' },
    steps: [
      { id: 'open', title: 'Add a card', content: 'It takes **a minute**.', target: { selector: ['#add', '.add'] }, advanceOn: 'target-click' },
      { id: 'ask', title: 'Team size', content: { blocks: [{ type: 'choice', name: 'size', label: 'How many?', options: ['1', '10'] }] }, nextWhen: 'size' },
    ],
  } as unknown as TutorialSpec;

  it('covers trigger, audience, frequency, steps and chaining', () => {
    const text = describeSpec(spec);
    expect(text).toContain('Set up billing');
    expect(text).toContain('on route /billing');
    expect(text).toContain("plan === 'trial'");
    expect(text).toContain('at most 2 time(s)');
    expect(text).toContain('[open] Add a card');
    expect(text).toContain('#add');
    expect(text).toContain('advances on target-click');
    expect(text).toContain('continue when size');
    expect(text).toContain('(centred)');
    expect(text).toContain('Then starts: invite');
  });

  it('describes every trigger type without throwing', () => {
    for (const trigger of [
      undefined,
      { type: 'manual' }, { type: 'auto' }, { type: 'event', event: 'x' },
      { type: 'element', selector: '#x' }, { type: 'idle', ms: 5 },
      { type: 'scroll', percent: 50 }, { type: 'context', when: 'a' },
    ]) {
      expect(() => describeSpec({ ...spec, trigger } as TutorialSpec)).not.toThrow();
    }
  });
});

describe('createAuthoringPrompt', () => {
  it('grounds the model in real selectors and the goal', () => {
    const prompt = createAuthoringPrompt({
      goal: 'Show a new user how to create a project',
      anchors: [{ selector: '[data-tour="new"]', score: 95, tag: 'button', role: 'button', text: 'New', visible: true }],
      contextKeys: ['plan'],
      maxSteps: 4,
    });

    expect(prompt).toContain('[data-tour="new"]');
    expect(prompt).toContain('Show a new user how to create a project');
    expect(prompt).toContain('At most 4 steps');
    expect(prompt).toContain('plan');
    expect(prompt).toContain('Never invent');
  });

  it('tells the model not to invent selectors when it has none', () => {
    expect(createAuthoringPrompt()).toContain('none supplied');
  });

  it('the shape it teaches is itself a valid spec', () => {
    // If the example in the prompt ever drifts from the validator, every model
    // following it produces invalid tours.
    const example = {
      specVersion: 1,
      id: 'kebab-case-id',
      title: 'Short title',
      trigger: { type: 'manual' },
      steps: [{
        id: 'kebab-case-step-id',
        title: 'Required, under 60 characters',
        content: 'Markdown. One or two short sentences.',
        target: { selector: '#x' },
        placement: 'auto',
      }],
    };
    expect(validateSpec(example).errors).toEqual([]);

    const quiz = {
      specVersion: 1, id: 'q', title: 'Q',
      steps: [{
        id: 's', title: 'S', nextWhen: 'role',
        content: { blocks: [
          { type: 'text', value: 'What best describes you?' },
          { type: 'choice', name: 'role', options: ['Developer', 'Designer'] },
        ] },
      }],
    };
    expect(validateSpec(quiz).errors).toEqual([]);
  });
});

describe('extractSpec', () => {
  it('parses bare JSON', () => {
    expect(extractSpec('{"id":"a"}')).toEqual({ id: 'a' });
  });

  it('digs JSON out of prose and code fences', () => {
    const reply = 'Sure! Here is the tour:\n```json\n{"specVersion":1,"id":"a"}\n```\nLet me know.';
    expect(extractSpec(reply)).toEqual({ specVersion: 1, id: 'a' });
  });

  it('returns null rather than throwing on garbage', () => {
    expect(extractSpec('no json here')).toBeNull();
    expect(extractSpec('{ broken')).toBeNull();
    expect(extractSpec(undefined as unknown as string)).toBeNull();
  });
});

describe('published JSON Schema matches the validator', () => {
  const schema = JSON.parse(readFileSync(path.resolve(__dirname, '../../../schema/spec.schema.json'), 'utf8'));
  const d = schema.definitions;

  it('knows every field the validator accepts', () => {
    // `additionalProperties: false` makes a missing key an editor error on a
    // perfectly valid spec — which is exactly what happened to `density`.
    expect(Object.keys(schema.properties)).toEqual(expect.arrayContaining(['density', 'interaction', 'audience', 'frequency']));
    expect(Object.keys(d.step.properties)).toEqual(expect.arrayContaining(['density', 'nextWhen', 'showIf', 'next']));
    expect(Object.keys(d.target.properties)).toEqual(expect.arrayContaining(['all', 'index', 'shadow', 'iframe']));
    expect(d.trigger.properties.type.enum).toEqual(expect.arrayContaining(['context', 'route', 'idle', 'scroll']));
    expect(d.contentBlock.properties.type.enum).toEqual(expect.arrayContaining(['input', 'choice', 'button', 'text', 'html']));
  });

  it('stays valid JSON Schema draft-07', () => {
    expect(schema.$schema).toContain('draft-07');
    expect(typeof schema.$id).toBe('string');
  });
});

// ---------------------------------------------------------------------------

const BIN = path.resolve(__dirname, '../../../bin/opentutorial.mjs');
const BUILT = existsSync(path.resolve(__dirname, '../../../dist/index.js'));

interface RpcReply {
  id: number;
  result: {
    serverInfo: { name: string };
    capabilities: { tools?: object };
    tools: Array<{ name: string; inputSchema: { type: string } }>;
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  };
  error: { code: number; message: string };
}

/** Speak newline-delimited JSON-RPC to the MCP server and collect replies by id. */
function mcpSession(messages: object[], expected: number): Promise<Record<number, RpcReply>> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [BIN, 'mcp'], { stdio: ['pipe', 'pipe', 'pipe'] });
    const replies: Record<number, RpcReply> = {};
    let buffer = '';

    const timer = setTimeout(() => { child.kill(); reject(new Error('MCP server timed out')); }, 15000);

    child.stdout.on('data', (chunk) => {
      buffer += String(chunk);
      let newline;
      while ((newline = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line) continue;
        const message = JSON.parse(line);
        if (message.id !== undefined && message.id !== null) replies[message.id] = message;
        if (Object.keys(replies).length >= expected) {
          clearTimeout(timer);
          child.stdin.end();
          resolve(replies);
        }
      }
    });
    child.on('error', reject);
    for (const message of messages) child.stdin.write(`${JSON.stringify(message)}\n`);
  });
}

describe.runIf(BUILT)('MCP server', () => {
  it('initialises, lists tools and validates a spec', async () => {
    const good = { specVersion: 1, id: 'ok', title: 'OK', steps: [{ id: 's', title: 'S', content: 'c' }] };
    const bad = { specVersion: 1, id: 'Bad Id', title: '', steps: [] };

    const replies = await mcpSession([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 't', version: '0' } } },
      { jsonrpc: '2.0', method: 'notifications/initialized' },
      { jsonrpc: '2.0', id: 2, method: 'tools/list' },
      { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'validate_spec', arguments: { spec: good } } },
      { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'validate_spec', arguments: { spec: JSON.stringify(bad) } } },
      { jsonrpc: '2.0', id: 5, method: 'ping' },
    ], 5);

    expect(replies[1].result.serverInfo.name).toBe('opentutorial');
    expect(replies[1].result.capabilities.tools).toBeDefined();

    const names = replies[2].result.tools.map((t) => t.name);
    expect(names).toEqual(expect.arrayContaining(['validate_spec', 'get_spec_schema', 'list_docs', 'read_doc', 'search_docs']));
    for (const tool of replies[2].result.tools) expect(tool.inputSchema.type).toBe('object');

    expect(replies[3].result.content[0].text).toContain('Valid');
    expect(replies[4].result.content[0].text).toContain('INVALID');
    expect(replies[4].result.content[0].text).toContain('$.id');
    expect(replies[5].result).toEqual({});
  }, 20000);

  it('serves docs but refuses to read outside them', async () => {
    const replies = await mcpSession([
      { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'list_docs', arguments: {} } },
      { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'read_doc', arguments: { path: 'spec-reference.md' } } },
      { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'read_doc', arguments: { path: '../package.json' } } },
      { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'search_docs', arguments: { query: 'nextWhen' } } },
    ], 4);

    expect(replies[1].result.content[0].text).toContain('spec-reference.md');
    expect(replies[2].result.content[0].text).toContain('# Spec reference');
    expect(replies[3].result.isError).toBe(true);
    expect(replies[3].result.content[0].text).toContain('outside the docs directory');
    expect(replies[4].result.isError).toBeUndefined();
  }, 20000);

  it('answers unknown methods and tools with errors, and ignores unknown notifications', async () => {
    const replies = await mcpSession([
      { jsonrpc: '2.0', method: 'notifications/whatever' },
      { jsonrpc: '2.0', id: 1, method: 'does/not/exist' },
      { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'nope', arguments: {} } },
      { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'validate_spec', arguments: { spec: '{not json' } } },
    ], 3);

    expect(replies[1].error.code).toBe(-32601);
    expect(replies[2].error.code).toBe(-32602);
    // A tool failing is a readable result, not a protocol error.
    expect(replies[3].result.isError).toBe(true);
  }, 20000);
});
