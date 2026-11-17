import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TourEngine } from '../engine';
import { TourOrchestrator } from '../orchestrator';
import { createTutorialLayer } from '../adapters/vanilla';
import { renderBlocks, normalizeContent } from '../content';
import { renderInline } from '../markdown';
import { validateSpec } from '../schema';
import { createMemoryStorage } from '../storage/memory';
import type { ContentBlock, CreateTourOptions, TourEvent, TutorialSpec } from '../types';

function build(steps: TutorialSpec['steps'], opts: CreateTourOptions = {}, spec: Partial<TutorialSpec> = {}) {
  const events: TourEvent[] = [];
  const engine = new TourEngine(
    { specVersion: 1, id: 'flow', title: 'Flow', trigger: { type: 'manual' }, steps, ...spec } as TutorialSpec,
    { persistence: { storage: createMemoryStorage() }, onEvent: (e) => events.push(e), dev: false, ...opts },
  );
  return { engine, events };
}

const spec = (id: string, extra: Partial<TutorialSpec> = {}): TutorialSpec => ({
  specVersion: 1,
  id,
  title: id,
  trigger: { type: 'manual' },
  steps: [{ id: 's1', title: 'One', content: 'a', placement: 'center' }],
  ...extra,
} as TutorialSpec);

const q = <T extends Element>(selector: string): T => document.querySelector(selector) as T;
const nextBtn = (): HTMLButtonElement => q<HTMLButtonElement>('.ot-btn-primary');

function type(field: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  field.value = value;
  field.dispatchEvent(new Event('input', { bubbles: true }));
}

beforeEach(() => { document.body.innerHTML = ''; });

describe('inline code is literal', () => {
  it('does not format emphasis inside backticks', () => {
    const html = renderInline('Run `a * b * c` and `**not bold**` now');
    expect(html).toContain('<code>a * b * c</code>');
    expect(html).toContain('<code>**not bold**</code>');
    expect(html).not.toContain('<strong>');
    expect(html).not.toContain('<em>');
  });

  it('does not turn a link inside backticks into an anchor', () => {
    const html = renderInline('Write `[text](https://x.test)` for a link');
    expect(html).not.toContain('<a ');
    expect(html).toContain('<code>[text](https://x.test)</code>');
  });

  it('still formats around code spans', () => {
    const html = renderInline('**bold** then `code` then *em*');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<code>code</code>');
    expect(html).toContain('<em>em</em>');
  });
});

describe('interactive blocks — rendering', () => {
  const blocks: ContentBlock[] = [
    { type: 'input', name: 'email', label: 'Email', inputType: 'email', placeholder: 'you@example.com' },
    { type: 'choice', name: 'role', options: ['Dev', 'Design'] },
    { type: 'button', label: 'Skip this', action: 'skip' },
  ];

  it('skips them entirely without handlers, rather than rendering dead controls', () => {
    const host = document.createElement('div');
    host.appendChild(renderBlocks(blocks));
    expect(host.querySelector('input, button')).toBeNull();
  });

  it('renders a labelled input wired to the handlers', () => {
    const setValue = vi.fn();
    const host = document.createElement('div');
    host.appendChild(renderBlocks(blocks, {
      interactive: { getValue: () => undefined, setValue, runAction: vi.fn() },
    }));

    const input = host.querySelector('input.ot-input') as HTMLInputElement;
    const label = host.querySelector('label') as HTMLLabelElement;
    expect(input.type).toBe('email');
    expect(label.htmlFor).toBe(input.id);

    type(input, 'ada@example.com');
    expect(setValue).toHaveBeenCalledWith('email', 'ada@example.com', 'input');
  });

  it('writes numbers from a number field', () => {
    const setValue = vi.fn();
    const host = document.createElement('div');
    host.appendChild(renderBlocks([{ type: 'input', name: 'seats', inputType: 'number' }], {
      interactive: { getValue: () => undefined, setValue, runAction: vi.fn() },
    }));

    type(host.querySelector('input')!, '12');
    expect(setValue).toHaveBeenCalledWith('seats', 12, 'input');
  });

  it('gives an unlabelled input an accessible name', () => {
    const host = document.createElement('div');
    host.appendChild(renderBlocks([{ type: 'input', name: 'company', placeholder: 'Company' }], {
      interactive: { getValue: () => undefined, setValue: vi.fn(), runAction: vi.fn() },
    }));
    expect(host.querySelector('input')?.getAttribute('aria-label')).toBe('Company');
  });

  it('restores the current value on re-render', () => {
    const host = document.createElement('div');
    host.appendChild(renderBlocks([{ type: 'input', name: 'email' }], {
      interactive: { getValue: () => 'kept@x.test', setValue: vi.fn(), runAction: vi.fn() },
    }));
    expect((host.querySelector('input') as HTMLInputElement).value).toBe('kept@x.test');
  });

  it('single choice selects one and reflects aria-checked', () => {
    let value: unknown;
    const host = document.createElement('div');
    host.appendChild(renderBlocks(normalizeContent({ blocks: [blocks[1]] }, String), {
      interactive: { getValue: () => value, setValue: (_n, v) => { value = v; }, runAction: vi.fn() },
    }));

    const options = host.querySelectorAll<HTMLButtonElement>('.ot-choice-option');
    options[1].click();
    expect(value).toBe('Design');
    expect(options[1].getAttribute('aria-checked')).toBe('true');
    expect(options[0].getAttribute('aria-checked')).toBe('false');
    expect(host.querySelector('.ot-choice')?.getAttribute('role')).toBe('radiogroup');
  });

  it('multiple choice toggles into an array', () => {
    let value: unknown;
    const host = document.createElement('div');
    host.appendChild(renderBlocks([{ type: 'choice', name: 'tools', options: ['A', 'B', 'C'], multiple: true }], {
      interactive: { getValue: () => value, setValue: (_n, v) => { value = v; }, runAction: vi.fn() },
    }));

    const options = host.querySelectorAll<HTMLButtonElement>('.ot-choice-option');
    options[0].click();
    options[2].click();
    expect(value).toEqual(['A', 'C']);
    options[0].click();
    expect(value).toEqual(['C']);
    expect(options[0].getAttribute('role')).toBe('checkbox');
  });

  it('supports { label, value } options', () => {
    let value: unknown;
    const host = document.createElement('div');
    host.appendChild(renderBlocks(
      [{ type: 'choice', name: 'size', options: [{ label: 'Small team', value: 5 }, { label: 'Large', value: 50 }] }],
      { interactive: { getValue: () => value, setValue: (_n, v) => { value = v; }, runAction: vi.fn() } },
    ));

    const option = host.querySelector('.ot-choice-option') as HTMLButtonElement;
    expect(option.textContent).toBe('Small team');
    option.click();
    expect(value).toBe(5);
  });

  it('a button runs its action', () => {
    const runAction = vi.fn();
    const host = document.createElement('div');
    host.appendChild(renderBlocks([blocks[2]], {
      interactive: { getValue: () => undefined, setValue: vi.fn(), runAction },
    }));
    (host.querySelector('.ot-block-btn') as HTMLButtonElement).click();
    expect(runAction).toHaveBeenCalledWith('skip', 'Skip this');
  });
});

describe('interactive blocks — in a tour', () => {
  const askEmail: TutorialSpec['steps'] = [
    {
      id: 'ask',
      title: 'Your email',
      placement: 'center',
      nextWhen: "email.includes('@')",
      content: { blocks: [{ type: 'input', name: 'email', inputType: 'email' }] },
    },
    { id: 'done', title: 'Thanks', content: 'Hello {{email}}', placement: 'center' },
  ];

  it('nextWhen disables Next until the answer satisfies it', async () => {
    const { engine } = build(askEmail);
    await engine.start();

    expect(nextBtn().disabled).toBe(true);
    expect(engine.getState().canGoNext).toBe(false);

    type(q<HTMLInputElement>('.ot-input'), 'ada');
    expect(nextBtn().disabled).toBe(true);

    type(q<HTMLInputElement>('.ot-input'), 'ada@example.com');
    expect(nextBtn().disabled).toBe(false);
    expect(engine.getState().canGoNext).toBe(true);
    expect(engine.getContext().email).toBe('ada@example.com');
    engine.destroy();
  });

  it('next() is refused while nextWhen is unmet — not just the button', async () => {
    const { engine } = build(askEmail);
    await engine.start();

    await engine.next();
    expect(engine.getState().currentStepId).toBe('ask');

    engine.setContext({ email: 'a@b.test' });
    await engine.next();
    expect(engine.getState().currentStepId).toBe('done');
    engine.destroy();
  });

  it('the answer is available to later steps', async () => {
    const { engine } = build(askEmail);
    await engine.start();
    type(q<HTMLInputElement>('.ot-input'), 'ada@example.com');
    await engine.next();
    expect(q('.ot-content').textContent).toBe('Hello ada@example.com');
    engine.destroy();
  });

  it('typing never rebuilds the field under the caret', async () => {
    const { engine } = build([{
      id: 'ask', title: 'Hi {{name}}', placement: 'center',
      content: { blocks: [{ type: 'input', name: 'name' }] },
    }]);
    await engine.start();

    const field = q<HTMLInputElement>('.ot-input');
    field.focus();
    type(field, 'Ada');

    // Same element, still focused, even though the title interpolates `name`.
    expect(q('.ot-input')).toBe(field);
    expect(document.activeElement).toBe(field);
    engine.destroy();
  });

  it('a choice can drive branching', async () => {
    const { engine } = build([
      {
        id: 'ask', title: 'Role?', placement: 'center', nextWhen: 'role',
        content: { blocks: [{ type: 'choice', name: 'role', options: ['dev', 'design'] }] },
        next: [{ if: "role === 'dev'", to: 'dev' }, { if: "role === 'design'", to: 'design' }],
      },
      { id: 'dev', title: 'For devs', content: 'd', placement: 'center' },
      { id: 'design', title: 'For designers', content: 'x', placement: 'center' },
    ]);
    await engine.start();

    document.querySelectorAll<HTMLButtonElement>('.ot-choice-option')[1].click();
    await engine.next();
    expect(engine.getState().currentStepId).toBe('design');
    engine.destroy();
  });

  it('a button block can jump, advance and skip', async () => {
    const { engine, events } = build([
      {
        id: 'a', title: 'A', placement: 'center',
        content: { blocks: [
          { type: 'button', label: 'Jump', action: { goTo: 'c' } },
          { type: 'button', label: 'Quit', action: 'skip' },
        ] },
      },
      { id: 'b', title: 'B', content: 'b', placement: 'center' },
      { id: 'c', title: 'C', content: 'c', placement: 'center' },
    ]);
    await engine.start();

    document.querySelectorAll<HTMLButtonElement>('.ot-block-btn')[0].click();
    await vi.waitFor(() => expect(engine.getState().currentStepId).toBe('c'));
    expect(events.some((e) => e.type === 'interaction' && e.meta?.button === 'Jump')).toBe(true);
    engine.destroy();
  });

  it('a button block can run step actions', async () => {
    const heard = vi.fn();
    window.addEventListener('demo:ping', heard);
    const { engine } = build([{
      id: 'a', title: 'A', placement: 'center',
      content: { blocks: [{ type: 'button', label: 'Ping', action: { type: 'emit', name: 'demo:ping' } }] },
    }]);
    await engine.start();

    q<HTMLButtonElement>('.ot-block-btn').click();
    expect(heard).toHaveBeenCalledTimes(1);
    window.removeEventListener('demo:ping', heard);
    engine.destroy();
  });

  it('interaction events carry a choice value but never free text', async () => {
    const { engine, events } = build([{
      id: 'a', title: 'A', placement: 'center',
      content: { blocks: [
        { type: 'input', name: 'email' },
        { type: 'choice', name: 'plan', options: ['free', 'pro'] },
      ] },
    }]);
    await engine.start();

    type(q<HTMLInputElement>('.ot-input'), 'secret@example.com');
    q<HTMLButtonElement>('.ot-choice-option').click();

    const interactions = events.filter((e) => e.type === 'interaction');
    const input = interactions.find((e) => e.meta?.name === 'email')!;
    const choice = interactions.find((e) => e.meta?.name === 'plan')!;
    expect(input.meta).toEqual({ name: 'email' });
    expect(JSON.stringify(input)).not.toContain('secret');
    expect(choice.meta).toEqual({ name: 'plan', value: 'free' });
    engine.destroy();
  });

  it('a step whose showIf goes false leaves even with nextWhen unmet', async () => {
    const { engine } = build(
      [
        { id: 'a', title: 'A', content: 'a', placement: 'center', showIf: 'show', nextWhen: 'never' },
        { id: 'b', title: 'B', content: 'b', placement: 'center' },
      ],
      { context: { show: true } },
    );
    await engine.start();
    engine.setContext({ show: false });
    await vi.waitFor(() => expect(engine.getState().currentStepId).toBe('b'));
    engine.destroy();
  });
});

describe('reactive context', () => {
  it('interpolated copy updates live', async () => {
    const { engine } = build(
      [{ id: 'a', title: 'Hi {{name}}', content: '{{count}} items', placement: 'center' }],
      { context: { name: 'Ada', count: 1 } },
    );
    await engine.start();
    expect(q('.ot-title').textContent).toBe('Hi Ada');

    engine.setContext({ name: 'Grace', count: 3 });
    expect(q('.ot-title').textContent).toBe('Hi Grace');
    expect(q('.ot-content').textContent).toBe('3 items');
    engine.destroy();
  });

  it('a step without interpolation is not rebuilt on unrelated changes', async () => {
    const { engine } = build([{ id: 'a', title: 'Static', content: 'Body', placement: 'center' }]);
    await engine.start();
    const body = q('.ot-content');
    engine.setContext({ unrelated: 1 });
    expect(q('.ot-content')).toBe(body);
    engine.destroy();
  });

  it('onContextChange reports only what actually changed', () => {
    const onContextChange = vi.fn();
    const { engine } = build([{ id: 'a', title: 'A', content: 'a' }], { context: { a: 1 }, onContextChange });

    engine.setContext({ a: 1 });
    expect(onContextChange).not.toHaveBeenCalled();

    engine.setContext({ a: 1, b: 2 });
    expect(onContextChange).toHaveBeenCalledTimes(1);
    expect(onContextChange.mock.calls[0][1]).toEqual({ b: 2 });
    engine.destroy();
  });

  it('a throwing onContextChange cannot break the tour', async () => {
    const { engine } = build(
      [{ id: 'a', title: 'A', content: 'a', placement: 'center' }],
      { onContextChange: () => { throw new Error('host bug'); } },
    );
    await engine.start();
    expect(() => engine.setContext({ x: 1 })).not.toThrow();
    engine.destroy();
  });

  it('a setContext action notifies too', async () => {
    const onContextChange = vi.fn();
    const { engine } = build(
      [{ id: 'a', title: 'A', content: 'a', placement: 'center', onEnter: [{ type: 'setContext', key: 'seen', value: true }] }],
      { onContextChange },
    );
    await engine.start();
    expect(onContextChange).toHaveBeenCalledWith(expect.objectContaining({ seen: true }), { seen: true });
    engine.destroy();
  });
});

describe('progress dots', () => {
  const three: TutorialSpec['steps'] = [
    { id: 'a', title: 'A', content: 'a', placement: 'center' },
    { id: 'b', title: 'B', content: 'b', placement: 'center' },
    { id: 'c', title: 'C', content: 'c', placement: 'center' },
  ];

  it('visited steps become buttons; current and future ones do not', async () => {
    const { engine } = build(three);
    await engine.start();
    expect(document.querySelectorAll('.ot-dot-jump')).toHaveLength(0);

    await engine.next();
    await engine.next();
    const jumps = document.querySelectorAll<HTMLButtonElement>('.ot-dot-jump');
    expect(jumps).toHaveLength(2);
    expect(jumps[0].getAttribute('aria-label')).toBe('Go to step 1');
    engine.destroy();
  });

  it('clicking a dot goes back and unwinds history', async () => {
    const { engine } = build(three);
    await engine.start();
    await engine.next();
    await engine.next();

    document.querySelectorAll<HTMLButtonElement>('.ot-dot-jump')[0].click();
    await vi.waitFor(() => expect(engine.getState().currentStepId).toBe('a'));
    // Back at the first step there is nothing left to go back to.
    expect(engine.getState().canGoBack).toBe(false);
    engine.destroy();
  });

  it('can be turned off', async () => {
    const { engine } = build(three, { dotNavigation: false });
    await engine.start();
    await engine.next();
    expect(document.querySelectorAll('.ot-dot-jump')).toHaveLength(0);
    engine.destroy();
  });

  it('respects canGoBack: false', async () => {
    const { engine } = build([three[0], { ...three[1], canGoBack: false }]);
    await engine.start();
    await engine.next();
    expect(document.querySelectorAll('.ot-dot-jump')).toHaveLength(0);
    engine.destroy();
  });
});

describe('popover options', () => {
  it('an explicit theme width wins over auto-sizing', async () => {
    const { engine } = build(
      [{ id: 'a', title: 'A', content: 'a', placement: 'center' }],
      { theme: { popoverWidth: 500 } },
    );
    await engine.start();
    expect(q<HTMLElement>('.ot-popover').style.width).toBe('');
    engine.destroy();
  });

  it('draggable adds the affordance only when asked', async () => {
    const off = build([{ id: 'a', title: 'A', content: 'a', placement: 'center' }]);
    await off.engine.start();
    expect(q('.ot-popover').classList.contains('ot-popover--draggable')).toBe(false);
    off.engine.destroy();
    document.body.innerHTML = '';

    const on = build([{ id: 'a', title: 'A', content: 'a', placement: 'center' }], { draggable: true });
    await on.engine.start();
    expect(q('.ot-popover').classList.contains('ot-popover--draggable')).toBe(true);
    on.engine.destroy();
  });

  it('dragging moves the card and survives a re-render of the same step', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    const { engine } = build(
      [{ id: 'a', title: 'Hi {{n}}', content: 'a', placement: 'center' }],
      { draggable: true, context: { n: 1 } },
    );
    await engine.start();

    const popover = q<HTMLElement>('.ot-popover');
    popover.style.left = '100px';
    popover.style.top = '100px';

    const title = q<HTMLElement>('.ot-title');
    const pointer = (t: string, x: number, y: number, target: EventTarget) => {
      const e = new MouseEvent(t, { bubbles: true, clientX: x, clientY: y, button: 0 });
      target.dispatchEvent(e);
    };
    pointer('pointerdown', 110, 110, title);
    pointer('pointermove', 260, 210, window);
    pointer('pointerup', 260, 210, window);

    expect(popover.style.left).toBe('250px');
    expect(popover.style.top).toBe('200px');

    // A context change re-renders the step; the card must stay put.
    engine.setContext({ n: 2 });
    expect(q<HTMLElement>('.ot-popover').style.left).toBe('250px');
    engine.destroy();
  });

  it('keyboard: false disables arrow navigation but never Escape', async () => {
    const { engine } = build(
      [
        { id: 'a', title: 'A', content: 'a', placement: 'center' },
        { id: 'b', title: 'B', content: 'b', placement: 'center' },
      ],
      { keyboard: false },
    );
    await engine.start();
    const popover = q<HTMLElement>('.ot-popover');

    popover.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    expect(engine.getState().currentStepId).toBe('a');

    popover.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(engine.getState().status).toBe('skipped');
    engine.destroy();
  });
});

describe('renderIndicator', () => {
  function anchor(): HTMLElement {
    const el = document.createElement('button');
    el.id = 't';
    let x = 100;
    el.getBoundingClientRect = () => ({
      x, y: 50, width: 40, height: 20, top: 50, left: x, right: x + 40, bottom: 70, toJSON: () => ({}),
    }) as DOMRect;
    (el as unknown as { move: (n: number) => void }).move = (n) => { x = n; };
    document.body.appendChild(el);
    return el;
  }

  it('renders the custom indicator at the target and no spotlight', async () => {
    anchor();
    const renderIndicator = vi.fn((_ctx, host: HTMLElement) => { host.textContent = 'dot'; });
    const { engine } = build(
      [{ id: 'a', title: 'A', content: 'a', display: 'beacon', target: { selector: '#t' }, duration: 60000 }],
      { renderIndicator },
    );
    await engine.start();

    const host = q<HTMLElement>('.ot-custom-indicator');
    expect(renderIndicator).toHaveBeenCalledTimes(1);
    expect(renderIndicator.mock.calls[0][0].display).toBe('beacon');
    expect(host.style.left).toBe('120px');
    expect(host.style.top).toBe('60px');
    engine.destroy();
  });

  it('gives the host back clean for the next ordinary step', async () => {
    anchor();
    const { engine } = build(
      [
        { id: 'a', title: 'A', content: 'a', display: 'hotspot', target: { selector: '#t' } },
        { id: 'b', title: 'B', content: 'b', placement: 'center' },
      ],
      { renderIndicator: (_ctx, host) => { host.textContent = 'dot'; } },
    );
    await engine.start();
    expect(document.querySelector('.ot-custom-indicator')).not.toBeNull();

    await engine.next();
    expect(document.querySelector('.ot-custom-indicator')).toBeNull();
    // The built-in popover handles the ordinary step.
    expect(q<HTMLElement>('.ot-popover').style.display).toBe('');
    expect(q('.ot-title').textContent).toBe('B');
    engine.destroy();
  });

  it('a context change during an indicator step does not pop the popover open', async () => {
    anchor();
    const { engine } = build(
      [{ id: 'a', title: 'Hi {{n}}', content: 'a', display: 'hotspot', target: { selector: '#t' } }],
      { renderIndicator: (_ctx, host) => { host.textContent = 'dot'; }, context: { n: 1 } },
    );
    await engine.start();
    engine.setContext({ n: 2 });
    expect(q<HTMLElement>('.ot-popover').style.display).toBe('none');
    engine.destroy();
  });
});

describe('orchestrator — shared, reactive context', () => {
  const make = (specs: TutorialSpec[], opts: Record<string, unknown> = {}) =>
    new TourOrchestrator(specs, { persistence: { storage: createMemoryStorage() }, dev: false, ...opts });

  it('an answer given inside one tour reaches every other tour', async () => {
    const orchestrator = make([
      spec('quiz', { steps: [{
        id: 'q', title: 'Q', placement: 'center',
        content: { blocks: [{ type: 'choice', name: 'role', options: ['dev', 'pm'] }] },
      }] }),
      spec('dev-tour', { audience: { showIf: "role === 'dev'" } }),
    ]);
    await orchestrator.ready;
    expect(orchestrator.checkEligibility('dev-tour')).toBe('audience rule did not match');

    orchestrator.start('quiz');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('quiz'));
    q<HTMLButtonElement>('.ot-choice-option').click();

    expect(orchestrator.getContext().role).toBe('dev');
    expect(orchestrator.getEngine('dev-tour')!.getContext().role).toBe('dev');
    expect(orchestrator.checkEligibility('dev-tour')).toBeNull();
    orchestrator.destroy();
  });

  it('reports each change once through onContextChange', async () => {
    const onContextChange = vi.fn();
    const orchestrator = make([spec('a'), spec('b'), spec('c')], { onContextChange });
    await orchestrator.ready;

    orchestrator.setContext({ plan: 'pro' });
    expect(onContextChange).toHaveBeenCalledTimes(1);

    orchestrator.setContext({ plan: 'pro' });
    expect(onContextChange).toHaveBeenCalledTimes(1);
    orchestrator.destroy();
  });

  it('a context trigger fires on the false → true edge, once', async () => {
    const orchestrator = make(
      [spec('cart-tour', { trigger: { type: 'context', when: 'items > 0', once: false } })],
      { context: { items: 0 } },
    );
    orchestrator.mount();
    await orchestrator.ready;
    await new Promise((r) => setTimeout(r, 10));
    expect(orchestrator.getActiveId()).toBeNull();

    orchestrator.setContext({ items: 1 });
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('cart-tour'));

    // Still true, different value: must not restart or re-queue.
    orchestrator.stop();
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBeNull());
    orchestrator.setContext({ items: 2 });
    await new Promise((r) => setTimeout(r, 10));
    expect(orchestrator.getActiveId()).toBeNull();

    // Falls, then rises again: fires again.
    orchestrator.setContext({ items: 0 });
    orchestrator.setContext({ items: 5 });
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('cart-tour'));
    orchestrator.destroy();
  });

  it('a context trigger already true at mount fires', async () => {
    const orchestrator = make(
      [spec('ready', { trigger: { type: 'context', when: "plan === 'pro'" } })],
      { context: { plan: 'pro' } },
    );
    orchestrator.mount();
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('ready'));
    orchestrator.destroy();
  });

  it('watch reports value changes with the previous value', async () => {
    const orchestrator = make([spec('a')], { context: { items: [] } });
    await orchestrator.ready;

    const seen: Array<[unknown, unknown]> = [];
    const stop = orchestrator.watch('items.length', (value, previous) => seen.push([value, previous]));

    orchestrator.setContext({ items: ['x'] });
    orchestrator.setContext({ unrelated: true });
    orchestrator.setContext({ items: ['x', 'y'] });
    expect(seen).toEqual([[1, 0], [2, 1]]);

    stop();
    orchestrator.setContext({ items: [] });
    expect(seen).toHaveLength(2);
    orchestrator.destroy();
  });
});

describe('orchestrator — runtime specs', () => {
  const make = (specs: TutorialSpec[], opts: Record<string, unknown> = {}) =>
    new TourOrchestrator(specs, { persistence: { storage: createMemoryStorage() }, dev: false, ...opts });

  it('addSpec registers a runnable tour and does not mutate the input array', async () => {
    const input = [spec('a')];
    const orchestrator = make(input);
    await orchestrator.ready;

    expect(orchestrator.addSpec(spec('late'))).toBe(true);
    expect(input).toHaveLength(1);
    expect(orchestrator.getSpecs().map((s) => s.id)).toEqual(['a', 'late']);

    orchestrator.start('late');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('late'));
    orchestrator.destroy();
  });

  it('a spec added later sees the current context, not the initial one', async () => {
    const orchestrator = make([spec('a')], { context: { plan: 'free' } });
    await orchestrator.ready;
    orchestrator.setContext({ plan: 'pro' });

    orchestrator.addSpec(spec('gated', { audience: { showIf: "plan === 'pro'" } }));
    expect(orchestrator.checkEligibility('gated')).toBeNull();
    orchestrator.destroy();
  });

  it('addSpec returns false for an invalid spec but keeps it explainable', async () => {
    const orchestrator = make([]);
    const bad = { specVersion: 1, id: 'Bad Id', title: '', steps: [] } as unknown as TutorialSpec;
    expect(orchestrator.addSpec(bad)).toBe(false);
    expect(orchestrator.checkEligibility('Bad Id')).toBe('spec failed validation');
    orchestrator.destroy();
  });

  it('addSpec with an existing id replaces it', async () => {
    const orchestrator = make([spec('a', { title: 'Old' })]);
    await orchestrator.ready;
    orchestrator.addSpec(spec('a', { title: 'New' }));
    expect(orchestrator.getSpecs()).toHaveLength(1);
    expect(orchestrator.getSpecs()[0].title).toBe('New');
    orchestrator.destroy();
  });

  it('a spec added after mount gets its trigger installed', async () => {
    const orchestrator = make([]);
    orchestrator.mount();
    await orchestrator.ready;

    orchestrator.addSpec(spec('auto', { trigger: { type: 'auto' } }));
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('auto'));
    orchestrator.destroy();
  });

  it('removeSpec stops a running tour and forgets it', async () => {
    const orchestrator = make([spec('a'), spec('b')]);
    await orchestrator.ready;
    orchestrator.start('a');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('a'));

    expect(orchestrator.removeSpec('a')).toBe(true);
    expect(orchestrator.getActiveId()).toBeNull();
    expect(orchestrator.getEngine('a')).toBeUndefined();
    expect(document.querySelector('.ot-root')).toBeNull();
    expect(orchestrator.removeSpec('a')).toBe(false);
    orchestrator.destroy();
  });
});

describe('layer — store, commands, watchContext', () => {
  const layerOf = (specs: TutorialSpec[], extra: Record<string, unknown> = {}) =>
    createTutorialLayer({ specs, storage: createMemoryStorage(), autoMount: false, dev: false, ...extra });

  it('store.subscribe delivers immediately and on every change', async () => {
    const layer = layerOf([spec('a')], { context: { plan: 'free' } });
    await layer.ready;

    const seen: Array<{ activeId: string | null; plan: unknown }> = [];
    const stop = layer.store.subscribe((s) => seen.push({ activeId: s.activeId, plan: s.context.plan }));
    expect(seen).toEqual([{ activeId: null, plan: 'free' }]);

    layer.setContext({ plan: 'pro' });
    expect(seen.at(-1)).toEqual({ activeId: null, plan: 'pro' });

    layer.start('a');
    await vi.waitFor(() => expect(seen.at(-1)?.activeId).toBe('a'));

    stop();
    const count = seen.length;
    layer.setContext({ plan: 'team' });
    expect(seen).toHaveLength(count);
    layer.destroy();
  });

  it('getSnapshot is stable between changes and fresh after one', async () => {
    const layer = layerOf([spec('a')]);
    await layer.ready;

    const first = layer.store.getSnapshot();
    expect(layer.store.getSnapshot()).toBe(first);

    layer.setContext({ x: 1 });
    const second = layer.store.getSnapshot();
    expect(second).not.toBe(first);
    expect(second.context).not.toBe(first.context);
    expect(second.context.x).toBe(1);
    layer.destroy();
  });

  it('dispatch drives the layer from plain data', async () => {
    const layer = layerOf([
      spec('a', { steps: [
        { id: 's1', title: 'One', content: 'a', placement: 'center' },
        { id: 's2', title: 'Two', content: 'b', placement: 'center' },
      ] }),
    ]);
    await layer.ready;

    expect(layer.dispatch({ type: 'start', tourId: 'a' })).toBe(true);
    await vi.waitFor(() => expect(layer.getState()?.currentStepId).toBe('s1'));

    layer.dispatch({ type: 'next' });
    await vi.waitFor(() => expect(layer.getState()?.currentStepId).toBe('s2'));

    layer.dispatch({ type: 'goTo', stepId: 's1' });
    await vi.waitFor(() => expect(layer.getState()?.currentStepId).toBe('s1'));

    layer.dispatch({ type: 'setContext', patch: { plan: 'pro' } });
    expect(layer.getContext().plan).toBe('pro');

    layer.dispatch({ type: 'stop' });
    await vi.waitFor(() => expect(layer.getActiveId()).toBeNull());

    layer.dispatch({ type: 'addSpec', spec: spec('generated') });
    expect(layer.getSpecs().map((s) => s.id)).toContain('generated');
    layer.dispatch({ type: 'removeSpec', tourId: 'generated' });
    expect(layer.getSpecs().map((s) => s.id)).not.toContain('generated');

    expect(layer.dispatch({ type: 'nonsense' } as never)).toBe(false);
    expect(layer.dispatch(null as never)).toBe(false);
    layer.destroy();
  });

  it('a JSON round-trip of a command still works', async () => {
    const layer = layerOf([spec('a')]);
    await layer.ready;
    const wire = JSON.stringify({ type: 'start', tourId: 'a' });
    layer.dispatch(JSON.parse(wire));
    await vi.waitFor(() => expect(layer.getActiveId()).toBe('a'));
    layer.destroy();
  });

  it('watchContext fires on change and unsubscribes', async () => {
    const layer = layerOf([spec('a')], { context: { n: 0 } });
    await layer.ready;
    const fn = vi.fn();
    const stop = layer.watchContext('n > 2', fn);

    layer.setContext({ n: 1 });
    expect(fn).not.toHaveBeenCalled();
    layer.setContext({ n: 3 });
    expect(fn).toHaveBeenCalledWith(true, false);

    stop();
    layer.setContext({ n: 0 });
    expect(fn).toHaveBeenCalledTimes(1);
    layer.destroy();
  });
});

describe('validation of the new surface', () => {
  const withBlocks = (blocks: unknown[], extra: Record<string, unknown> = {}) => ({
    specVersion: 1, id: 't', title: 'T',
    steps: [{ id: 's', title: 'S', content: { blocks }, ...extra }],
  });

  it('accepts well-formed interactive blocks', () => {
    const result = validateSpec(withBlocks([
      { type: 'input', name: 'email', inputType: 'email', label: 'Email' },
      { type: 'choice', name: 'role', options: ['a', { label: 'B', value: 2 }], multiple: true },
      { type: 'button', label: 'Go', action: 'next' },
      { type: 'button', label: 'Jump', action: { goTo: 's' } },
      { type: 'button', label: 'Emit', action: [{ type: 'emit', name: 'x' }] },
    ], { nextWhen: 'email' }));
    expect(result.errors).toEqual([]);
  });

  it('requires field names an expression can read', () => {
    const result = validateSpec(withBlocks([{ type: 'input', name: 'first-name' }]));
    expect(result.ok).toBe(false);
    expect(result.errors[0].path).toContain('.name');
  });

  it('rejects malformed blocks', () => {
    for (const block of [
      { type: 'input' },
      { type: 'input', name: 'x', inputType: 'password' },
      { type: 'choice', name: 'x' },
      { type: 'choice', name: 'x', options: [] },
      { type: 'choice', name: 'x', options: [{ label: 'no value' }] },
      { type: 'button', action: 'next' },
      { type: 'button', label: 'x' },
      { type: 'button', label: 'x', action: 'explode' },
      { type: 'button', label: 'x', action: { type: 'emit' } },
    ]) {
      expect(validateSpec(withBlocks([block])).ok, JSON.stringify(block)).toBe(false);
    }
  });

  it('checks nextWhen as an expression', () => {
    expect(validateSpec(withBlocks([{ type: 'text', value: 'x' }], { nextWhen: 'a ===' })).ok).toBe(false);
  });

  it('validates the context trigger', () => {
    const base = { specVersion: 1, id: 't', title: 'T', steps: [{ id: 's', title: 'S', content: 'c' }] };
    expect(validateSpec({ ...base, trigger: { type: 'context', when: 'items > 0' } }).ok).toBe(true);
    expect(validateSpec({ ...base, trigger: { type: 'context' } }).ok).toBe(false);
    expect(validateSpec({ ...base, trigger: { type: 'context', when: '&&' } }).ok).toBe(false);
  });
});
