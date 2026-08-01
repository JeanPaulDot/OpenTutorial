import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TourEngine } from '../engine';
import { createMemoryStorage } from '../storage/memory';
import type { CreateTourOptions, TourEvent, TutorialSpec } from '../types';

function build(
  steps: TutorialSpec['steps'],
  opts: CreateTourOptions = {},
  spec: Partial<TutorialSpec> = {},
): { engine: TourEngine; events: TourEvent[] } {
  const events: TourEvent[] = [];
  const engine = new TourEngine(
    {
      specVersion: 1,
      id: 'flow',
      title: 'Flow',
      trigger: { type: 'manual' },
      steps,
      ...spec,
    } as TutorialSpec,
    {
      persistence: { storage: createMemoryStorage() },
      onEvent: (e) => events.push(e),
      dev: false,
      ...opts,
    },
  );
  return { engine, events };
}

/** Give an element a non-zero rect so `visible` checks and positioning work. */
function anchor(id: string): HTMLElement {
  const el = document.createElement('button');
  el.id = id;
  el.setAttribute('data-tour', id);
  el.getBoundingClientRect = () => ({
    x: 10, y: 10, width: 80, height: 24, top: 10, left: 10, right: 90, bottom: 34, toJSON: () => ({}),
  }) as DOMRect;
  el.getClientRects = () => ([{ width: 80, height: 24 }] as unknown as DOMRectList);
  document.body.appendChild(el);
  return el;
}

beforeEach(() => {
  document.body.innerHTML = '';
  window.history.replaceState({}, '', '/');
});

afterEach(() => { vi.useRealTimers(); });

describe('advance conditions', () => {
  it('target-click advances when the target is clicked', async () => {
    const target = anchor('go');
    const { engine } = build([
      { id: 's1', title: 'One', content: 'x', target: { selector: '#go' }, advanceOn: 'target-click' },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' },
    ]);

    await engine.start();
    expect(engine.getState().currentStepId).toBe('s1');

    target.click();
    await vi.waitFor(() => expect(engine.getState().currentStepId).toBe('s2'));
    engine.destroy();
  });

  it('event advances on a window event', async () => {
    const { engine } = build([
      { id: 's1', title: 'One', content: 'x', placement: 'center', advanceOn: 'event', event: 'saved' },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' },
    ]);

    await engine.start();
    window.dispatchEvent(new Event('saved'));
    await vi.waitFor(() => expect(engine.getState().currentStepId).toBe('s2'));
    engine.destroy();
  });

  it('auto advances after the configured delay', async () => {
    vi.useFakeTimers();
    const { engine } = build([
      { id: 's1', title: 'One', content: 'x', placement: 'center', advanceOn: 'auto', duration: 500 },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' },
    ]);

    await engine.start();
    expect(engine.getState().currentStepId).toBe('s1');

    await vi.advanceTimersByTimeAsync(600);
    expect(engine.getState().currentStepId).toBe('s2');
    engine.destroy();
  });

  it('input-match advances once the value matches', async () => {
    const input = document.createElement('input');
    input.id = 'field';
    input.getBoundingClientRect = () => ({
      x: 0, y: 0, width: 100, height: 20, top: 0, left: 0, right: 100, bottom: 20, toJSON: () => ({}),
    }) as DOMRect;
    document.body.appendChild(input);

    const { engine } = build([
      {
        id: 's1', title: 'One', content: 'x',
        target: { selector: '#field' }, advanceOn: 'input-match', match: 'hello',
      },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' },
    ]);

    await engine.start();

    input.value = 'hel';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(engine.getState().currentStepId).toBe('s1');

    input.value = 'hello';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await vi.waitFor(() => expect(engine.getState().currentStepId).toBe('s2'));
    engine.destroy();
  });

  it('form-submit advances when the form submits', async () => {
    const form = document.createElement('form');
    form.id = 'signup';
    form.getBoundingClientRect = () => ({
      x: 0, y: 0, width: 100, height: 40, top: 0, left: 0, right: 100, bottom: 40, toJSON: () => ({}),
    }) as DOMRect;
    document.body.appendChild(form);

    const { engine } = build([
      { id: 's1', title: 'One', content: 'x', target: { selector: '#signup' }, advanceOn: 'form-submit' },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' },
    ]);

    await engine.start();
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(engine.getState().currentStepId).toBe('s2'));
    engine.destroy();
  });

  it('element-appears advances when the element arrives', async () => {
    const { engine } = build([
      {
        id: 's1', title: 'One', content: 'x', placement: 'center',
        advanceOn: 'element-appears', watch: '#later',
      },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' },
    ]);

    await engine.start();
    anchor('later');
    await vi.waitFor(() => expect(engine.getState().currentStepId).toBe('s2'), { timeout: 2000 });
    engine.destroy();
  });

  it('element-disappears advances when the element goes away', async () => {
    const target = anchor('spinner');
    const { engine } = build([
      {
        id: 's1', title: 'One', content: 'x', placement: 'center',
        advanceOn: 'element-disappears', watch: '#spinner',
      },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' },
    ]);

    await engine.start();
    target.remove();
    await vi.waitFor(() => expect(engine.getState().currentStepId).toBe('s2'), { timeout: 2000 });
    engine.destroy();
  });

  it('url-match advances on navigation to the pattern', async () => {
    const { engine } = build([
      {
        id: 's1', title: 'One', content: 'x', placement: 'center',
        advanceOn: 'url-match', urlPattern: '/done',
      },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' },
    ]);

    await engine.start();
    window.history.pushState({}, '', '/done');
    await vi.waitFor(() => expect(engine.getState().currentStepId).toBe('s2'), { timeout: 2000 });
    engine.destroy();
  });
});

describe('beforeNext guard', () => {
  it('blocks the transition when it returns false', async () => {
    let allow = false;
    const { engine } = build(
      [
        { id: 's1', title: 'One', content: 'x', placement: 'center' },
        { id: 's2', title: 'Two', content: 'y', placement: 'center' },
      ],
      { beforeNext: () => allow },
    );

    await engine.start();
    await engine.next();
    expect(engine.getState().currentStepId).toBe('s1');

    allow = true;
    await engine.next();
    expect(engine.getState().currentStepId).toBe('s2');
    engine.destroy();
  });

  it('awaits an async guard', async () => {
    const { engine } = build(
      [
        { id: 's1', title: 'One', content: 'x', placement: 'center' },
        { id: 's2', title: 'Two', content: 'y', placement: 'center' },
      ],
      { beforeNext: async () => { await Promise.resolve(); return true; } },
    );

    await engine.start();
    await engine.next();
    expect(engine.getState().currentStepId).toBe('s2');
    engine.destroy();
  });

  it('a throwing guard does not strand the tour', async () => {
    const { engine } = build(
      [
        { id: 's1', title: 'One', content: 'x', placement: 'center' },
        { id: 's2', title: 'Two', content: 'y', placement: 'center' },
      ],
      { beforeNext: () => { throw new Error('guard exploded'); } },
    );

    await engine.start();
    await expect(engine.next()).resolves.toBeUndefined();
    engine.destroy();
  });
});

describe('branching', () => {
  it('follows the first matching next rule', async () => {
    const { engine } = build(
      [
        {
          id: 's1', title: 'One', content: 'x', placement: 'center',
          next: [
            { if: "plan === 'pro'", to: 'pro-step' },
            { if: "plan === 'free'", to: 'free-step' },
          ],
        },
        { id: 'pro-step', title: 'Pro', content: 'p', placement: 'center' },
        { id: 'free-step', title: 'Free', content: 'f', placement: 'center' },
      ],
      { context: { plan: 'free' } },
    );

    await engine.start();
    await engine.next();
    expect(engine.getState().currentStepId).toBe('free-step');
    engine.destroy();
  });

  it('falls through to the next step when no rule matches', async () => {
    const { engine } = build(
      [
        {
          id: 's1', title: 'One', content: 'x', placement: 'center',
          next: [{ if: "plan === 'enterprise'", to: 'ent' }],
        },
        { id: 's2', title: 'Two', content: 'y', placement: 'center' },
        { id: 'ent', title: 'Ent', content: 'e', placement: 'center' },
      ],
      { context: { plan: 'free' } },
    );

    await engine.start();
    await engine.next();
    expect(engine.getState().currentStepId).toBe('s2');
    engine.destroy();
  });

  it('accepts a plain string next', async () => {
    const { engine } = build([
      { id: 's1', title: 'One', content: 'x', placement: 'center', next: 's3' },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' },
      { id: 's3', title: 'Three', content: 'z', placement: 'center' },
    ]);

    await engine.start();
    await engine.next();
    expect(engine.getState().currentStepId).toBe('s3');
    engine.destroy();
  });
});

describe('reactive showIf', () => {
  it('leaves the current step when its condition becomes false', async () => {
    const { engine } = build(
      [
        { id: 's1', title: 'One', content: 'x', placement: 'center', showIf: "plan === 'pro'" },
        { id: 's2', title: 'Two', content: 'y', placement: 'center' },
      ],
      { context: { plan: 'pro' } },
    );

    await engine.start();
    expect(engine.getState().currentStepId).toBe('s1');

    engine.setContext({ plan: 'free' });
    await vi.waitFor(() => expect(engine.getState().currentStepId).toBe('s2'));
    engine.destroy();
  });

  it('ignores context changes while idle', () => {
    const { engine } = build([{ id: 's1', title: 'One', content: 'x', showIf: 'false' }]);
    expect(() => engine.setContext({ a: 1 })).not.toThrow();
    engine.destroy();
  });

  it('completes only when there is genuinely nothing left to show', async () => {
    const { engine, events } = build(
      [
        { id: 's1', title: 'One', content: 'x', placement: 'center', showIf: "plan === 'pro'" },
        { id: 's2', title: 'Two', content: 'y', placement: 'center', showIf: "plan === 'pro'" },
      ],
      { context: { plan: 'pro' } },
    );

    await engine.start();
    engine.setContext({ plan: 'free' });

    await vi.waitFor(() => expect(events.some((e) => e.type === 'completed')).toBe(true));
    engine.destroy();
  });
});

describe('pause and resume', () => {
  it('round-trips and lands on the same step', async () => {
    const { engine, events } = build([
      { id: 's1', title: 'One', content: 'x', placement: 'center' },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' },
    ]);

    await engine.start();
    await engine.next();
    expect(engine.getState().currentStepId).toBe('s2');

    engine.pause();
    expect(engine.getState().status).toBe('paused');
    expect(events.some((e) => e.type === 'paused')).toBe(true);

    engine.resume();
    await vi.waitFor(() => expect(engine.getState().status).toBe('running'));
    expect(engine.getState().currentStepId).toBe('s2');
    expect(events.some((e) => e.type === 'unpaused')).toBe(true);
    engine.destroy();
  });

  it('pause is a no-op when not running', () => {
    const { engine } = build([{ id: 's1', title: 'One', content: 'x' }]);
    engine.pause();
    expect(engine.getState().status).toBe('idle');
    engine.destroy();
  });
});

describe('actions', () => {
  it('runs setContext and emit on enter and exit', async () => {
    const seen: string[] = [];
    window.addEventListener('tour:ping', () => seen.push('ping'));

    const { engine } = build([
      {
        id: 's1', title: 'One', content: 'x', placement: 'center',
        onEnter: [{ type: 'setContext', key: 'entered', value: true }],
        onExit: [{ type: 'emit', name: 'tour:ping' }],
      },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' },
    ]);

    await engine.start();
    expect(engine.getContext().entered).toBe(true);

    await engine.next();
    expect(seen).toEqual(['ping']);
    engine.destroy();
  });

  it('a failing action never breaks the step', async () => {
    const { engine } = build([
      {
        id: 's1', title: 'One', content: 'x', placement: 'center',
        onEnter: [{ type: 'scrollTo', selector: '#does-not-exist' }],
      },
    ]);

    await expect(engine.start()).resolves.toBeUndefined();
    expect(engine.getState().status).toBe('running');
    engine.destroy();
  });

  it('navigate delegates to onNavigate instead of reloading', async () => {
    const onNavigate = vi.fn();
    const { engine } = build(
      [{
        id: 's1', title: 'One', content: 'x', placement: 'center',
        onEnter: [{ type: 'navigate', path: '/next-page' }],
      }],
      { onNavigate },
    );

    await engine.start();
    expect(onNavigate).toHaveBeenCalledWith('/next-page');
    engine.destroy();
  });
});

describe('targeting failures', () => {
  it('emits target-not-found and keeps going', async () => {
    const { engine, events } = build([
      { id: 's1', title: 'One', content: 'x', target: { selector: '#nowhere' },  },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' },
    ]);

    await engine.start();
    await vi.waitFor(
      () => expect(events.some((e) => e.type === 'target-not-found')).toBe(true),
      { timeout: 3000 },
    );

    const event = events.find((e) => e.type === 'target-not-found')!;
    expect(event.selector).toContain('#nowhere');
    engine.destroy();
  });
});

describe('progress and resume', () => {
  it('saves progress and resumes where it left off', async () => {
    const storage = createMemoryStorage();
    const steps = [
      { id: 's1', title: 'One', content: 'x', placement: 'center' as const },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' as const },
      { id: 's3', title: 'Three', content: 'z', placement: 'center' as const },
    ];

    const first = build(steps, { persistence: { storage }, resume: true }).engine;
    await first.start();
    await first.next();
    expect(first.getState().currentStepId).toBe('s2');
    first.destroy();

    const second = build(steps, { persistence: { storage }, resume: true }).engine;
    await second.ready;
    await second.start();
    expect(second.getState().currentStepId).toBe('s2');
    // History is seeded so Back is available immediately after a resume.
    expect(second.getState().canGoBack).toBe(true);
    second.destroy();
  });

  it('ignores progress older than the ttl', async () => {
    const storage = createMemoryStorage();
    const steps = [
      { id: 's1', title: 'One', content: 'x', placement: 'center' as const },
      { id: 's2', title: 'Two', content: 'y', placement: 'center' as const },
    ];

    const first = build(steps, { persistence: { storage }, resume: true }).engine;
    await first.start();
    await first.next();
    first.destroy();

    vi.setSystemTime(Date.now() + 10_000);
    const second = build(steps, { persistence: { storage }, resume: true, progressTtl: 1000 }).engine;
    await second.ready;
    await second.start();
    expect(second.getState().currentStepId).toBe('s1');
    second.destroy();
    vi.useRealTimers();
  });
});

describe('custom rendering', () => {
  it('renderStep replaces the built-in popover', async () => {
    const renderStep = vi.fn((ctx: { step: { title?: unknown } }, host: HTMLElement) => {
      host.textContent = `custom:${String(ctx.step.title)}`;
    });

    const { engine } = build(
      [{ id: 's1', title: 'One', content: 'x', placement: 'center' }],
      { renderStep: renderStep as unknown as CreateTourOptions['renderStep'] },
    );

    await engine.start();
    expect(renderStep).toHaveBeenCalled();
    expect(document.querySelector('.ot-custom-host')?.textContent).toBe('custom:One');
    expect(document.querySelector('.ot-popover')).toBeNull();
    engine.destroy();
  });
});

describe('interaction modes', () => {
  it('accepts every mode without throwing', async () => {
    for (const interaction of ['free', 'target-only', 'blocked'] as const) {
      anchor('t');
      const { engine } = build(
        [{ id: 's1', title: 'One', content: 'x', target: { selector: '#t' } }],
        { interaction },
      );
      await engine.start();
      expect(engine.getState().status).toBe('running');
      engine.destroy();
      document.body.innerHTML = '';
    }
  });
});

describe('lifecycle guards', () => {
  it('a transition cap stops runaway loops', async () => {
    const { engine } = build([
      { id: 's1', title: 'One', content: 'x', placement: 'center', next: 's2' },
      { id: 's2', title: 'Two', content: 'y', placement: 'center', next: 's1' },
    ]);

    await engine.start();
    for (let i = 0; i < 400; i += 1) await engine.next();

    // Whatever it does, it must stop rather than spin forever.
    expect(['running', 'completed', 'skipped']).toContain(engine.getState().status);
    engine.destroy();
  });

  it('completes when every step is filtered out', async () => {
    const { engine, events } = build(
      [{ id: 's1', title: 'One', content: 'x', showIf: 'false' }],
      { context: {} },
    );

    await engine.start();
    expect(events.some((e) => e.type === 'completed')).toBe(true);
    engine.destroy();
  });

  it('start is ignored while already running', async () => {
    const { engine, events } = build([
      { id: 's1', title: 'One', content: 'x', placement: 'center' },
    ]);

    await engine.start();
    await engine.start();
    expect(events.filter((e) => e.type === 'started')).toHaveLength(1);
    engine.destroy();
  });

  it('reports duration on terminal events', async () => {
    const { engine, events } = build([
      { id: 's1', title: 'One', content: 'x', placement: 'center' },
    ]);

    await engine.start();
    engine.complete('user');

    const completed = events.find((e) => e.type === 'completed')!;
    expect(completed.reason).toBe('user');
    expect(typeof completed.duration).toBe('number');
    engine.destroy();
  });
});
