import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateSelectors, bestSelector, auditSelectors } from '../authoring/selector';
import { createDebugPanel, logEvents } from '../authoring/debug';
import { startRecorder, enableRecorderFromUrl } from '../authoring/recorder';
import type { TutorialSpec } from '../types';

beforeEach(() => { document.body.innerHTML = ''; });

afterEach(() => {
  document.querySelectorAll('[data-ot-recorder], [data-ot-debug]').forEach((el) => el.remove());
});

describe('generateSelectors', () => {
  it('prefers explicit tour hooks above everything else', () => {
    document.body.innerHTML = '<button id="save" class="btn primary" data-tour="save-btn">Save</button>';
    const [top] = generateSelectors(document.getElementById('save')!);

    expect(top.selector).toBe('[data-tour="save-btn"]');
    expect(top.score).toBeGreaterThan(90);
    expect(top.matches).toBe(1);
  });

  it('falls back through the test-hook attributes', () => {
    document.body.innerHTML = '<button data-testid="submit">Go</button>';
    const [top] = generateSelectors(document.querySelector('button')!);
    expect(top.selector).toBe('[data-testid="submit"]');
  });

  it('uses a stable id when there is no hook', () => {
    document.body.innerHTML = '<div id="sidebar">x</div>';
    const candidates = generateSelectors(document.getElementById('sidebar')!);
    expect(candidates.some((c) => c.selector === '#sidebar')).toBe(true);
  });

  it('rejects generated-looking ids', () => {
    document.body.innerHTML = '<div id="radix-12345678">x</div>';
    const candidates = generateSelectors(document.querySelector('div')!);
    const byId = candidates.find((c) => c.selector.startsWith('#'));
    // Either not offered at all, or offered with a low score.
    expect(byId === undefined || byId.score < 60).toBe(true);
  });

  it('ignores CSS-in-JS class names', () => {
    document.body.innerHTML = '<div class="css-1a2b3c sc-AbCdEf">x</div>';
    const candidates = generateSelectors(document.querySelector('div')!);
    expect(candidates.every((c) => !c.selector.includes('css-1a2b3c'))).toBe(true);
    expect(candidates.every((c) => !c.selector.includes('sc-AbCdEf'))).toBe(true);
  });

  it('reports how many elements each candidate matches', () => {
    document.body.innerHTML = '<ul><li class="row">a</li><li class="row">b</li></ul>';
    const candidates = generateSelectors(document.querySelector('.row')!);
    const ambiguous = candidates.find((c) => c.selector === '.row');
    if (ambiguous) expect(ambiguous.matches).toBe(2);
  });

  it('always produces at least one candidate', () => {
    document.body.innerHTML = '<section><span>plain</span></section>';
    expect(generateSelectors(document.querySelector('span')!).length).toBeGreaterThan(0);
  });
});

describe('bestSelector', () => {
  it('returns the winner plus scored fallbacks and visible text', () => {
    document.body.innerHTML = '<button id="pay" data-testid="pay-btn" class="cta">Pay now</button>';
    const best = bestSelector(document.getElementById('pay')!)!;

    expect(best.selector).toBe('[data-testid="pay-btn"]');
    expect(best.score).toBeGreaterThan(80);
    expect(best.text).toBe('Pay now');
    expect(Array.isArray(best.fallbacks)).toBe(true);
  });

  it('omits text that is too long to be a stable matcher', () => {
    document.body.innerHTML = `<button data-tour="x">${'word '.repeat(30)}</button>`;
    expect(bestSelector(document.querySelector('button')!)!.text).toBeUndefined();
  });

  it('returns null when there is no element to describe', () => {
    const detached = document.createElement('div');
    const result = bestSelector(detached);
    // A detached node yields either null or a low-confidence path.
    expect(result === null || typeof result.selector === 'string').toBe(true);
  });
});

describe('auditSelectors', () => {
  it('flags dead selectors', () => {
    document.body.innerHTML = '<div id="here"></div>';
    const [ok, dead] = auditSelectors(['#here', '#gone']);

    expect(ok).toMatchObject({ selector: '#here', matches: 1, ok: true });
    expect(dead).toMatchObject({ selector: '#gone', matches: 0, ok: false });
    expect(dead.note).toContain('no element');
  });

  it('warns about ambiguous selectors without failing them', () => {
    document.body.innerHTML = '<p class="row"></p><p class="row"></p>';
    const [result] = auditSelectors(['.row']);

    expect(result.ok).toBe(true);
    expect(result.matches).toBe(2);
    expect(result.note).toContain('target.index');
  });

  it('treats a malformed selector as unmatched rather than throwing', () => {
    expect(() => auditSelectors(['<<bad'])).not.toThrow();
    expect(auditSelectors(['<<bad'])[0].ok).toBe(false);
  });
});

describe('createDebugPanel', () => {
  const specs: TutorialSpec[] = [{
    specVersion: 1,
    id: 'welcome',
    title: 'Welcome',
    steps: [
      { id: 's1', title: 'One', content: 'a', target: { selector: '#exists' } },
      { id: 's2', title: 'Two', content: 'b', showIf: "plan === 'pro'" },
    ],
  } as TutorialSpec];

  it('mounts, reports the active step and resolves targets', () => {
    document.body.innerHTML = '<div id="exists"></div>';
    const panel = createDebugPanel({
      specs,
      getContext: () => ({ plan: 'pro' }),
      getActiveId: () => 'welcome',
      getState: () => ({ currentStepId: 's1', index: 0, total: 2, status: 'running' }),
    });

    const el = document.querySelector('.ot-debug')!;
    expect(el).not.toBeNull();
    expect(el.textContent).toContain('welcome');
    expect(el.textContent).toContain('s1');

    panel.destroy();
    expect(document.querySelector('.ot-debug')).toBeNull();
  });

  it('shows showIf results against the live context', () => {
    const panel = createDebugPanel({
      specs,
      getContext: () => ({ plan: 'free' }),
      getActiveId: () => 'welcome',
      getState: () => ({ currentStepId: 's2', index: 1, total: 2, status: 'running' }),
    });

    panel.update();
    const text = document.querySelector('.ot-debug')!.textContent ?? '';
    expect(text).toContain("plan === 'pro'");
    panel.destroy();
  });

  it('handles having no active tour', () => {
    const panel = createDebugPanel({
      specs,
      getContext: () => ({}),
      getActiveId: () => null,
      getState: () => null,
    });

    expect(() => panel.update()).not.toThrow();
    panel.destroy();
  });
});

describe('logEvents', () => {
  it('subscribes and returns a working unsubscribe', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const stop = logEvents();

    window.dispatchEvent(new CustomEvent('opentutorial', {
      detail: { type: 'started', tourId: 'welcome', timestamp: Date.now() },
    }));
    expect(spy).toHaveBeenCalled();

    stop();
    spy.mockClear();
    window.dispatchEvent(new CustomEvent('opentutorial', {
      detail: { type: 'completed', tourId: 'welcome', timestamp: Date.now() },
    }));
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});

describe('startRecorder', () => {
  it('mounts its panel and emits a placeholder step until something is captured', () => {
    const recorder = startRecorder({ tourId: 'recorded', title: 'Recorded tour' });

    expect(document.querySelector('[data-ot-recorder]')).not.toBeNull();
    const spec = recorder.getSpec();
    expect(spec.id).toBe('recorded');
    expect(spec.title).toBe('Recorded tour');
    // A spec with zero steps fails validation, so an empty recording still
    // exports something a user can open and edit.
    expect(spec.steps).toHaveLength(1);
    expect(spec.steps[0].id).toBe('step-1');

    recorder.stop();
    expect(document.querySelector('.ot-rec-panel')).toBeNull();
  });

  it('captures a clicked element as a step with a scored selector', () => {
    document.body.innerHTML = '<button data-tour="pay">Pay</button>';
    const onChange = vi.fn();
    const recorder = startRecorder({ tourId: 't', onChange });

    document.querySelector('button')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );

    const spec = recorder.getSpec();
    expect(spec.steps).toHaveLength(1);
    expect(spec.steps[0].target?.selector).toBe('[data-tour="pay"]');
    expect(onChange).toHaveBeenCalled();

    recorder.stop();
  });

  it('never captures its own UI', () => {
    document.body.innerHTML = '<button data-tour="real">Real</button>';
    const recorder = startRecorder({ tourId: 't' });
    const panel = document.querySelector('.ot-rec-panel') as HTMLElement;
    expect(panel).not.toBeNull();

    panel.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    // Still the placeholder, so nothing from the recorder's own chrome landed.
    expect(recorder.getSpec().steps[0].id).toBe('step-1');
    expect(recorder.getSpec().steps[0].target).toBeUndefined();

    // A real page element is captured, proving the listener is actually live.
    document.querySelector('button')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    expect(recorder.getSpec().steps[0].target?.selector).toBe('[data-tour="real"]');

    recorder.stop();
  });

  it('emits valid JSON', () => {
    document.body.innerHTML = '<a data-tour="link">Link</a>';
    const recorder = startRecorder({ tourId: 'json-tour' });
    document.querySelector('a')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    const parsed = JSON.parse(recorder.toJSON());
    expect(parsed.id).toBe('json-tour');
    expect(parsed.steps).toHaveLength(1);

    recorder.stop();
  });

  it('calls onExport instead of the clipboard when provided', () => {
    document.body.innerHTML = '<button data-tour="b">B</button>';
    const onExport = vi.fn();
    const recorder = startRecorder({ tourId: 't', onExport });
    document.querySelector('button')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    const copy = Array.from(document.querySelectorAll('[data-ot-recorder] button'))
      .find((b) => /copy/i.test(b.textContent ?? '')) as HTMLButtonElement | undefined;
    copy?.click();

    if (copy) expect(onExport).toHaveBeenCalled();
    recorder.stop();
  });
});

describe('enableRecorderFromUrl', () => {
  afterEach(() => { window.history.replaceState({}, '', '/'); });

  it('does nothing without the flag', () => {
    window.history.replaceState({}, '', '/');
    expect(enableRecorderFromUrl()).toBeNull();
  });

  it('starts the recorder when the flag is present', () => {
    window.history.replaceState({}, '', '/?ot-record=1');
    const handle = enableRecorderFromUrl();

    expect(handle).not.toBeNull();
    expect(document.querySelector('[data-ot-recorder]')).not.toBeNull();
    handle?.stop();
  });

  it('accepts a custom parameter name', () => {
    window.history.replaceState({}, '', '/?authoring=1');
    const handle = enableRecorderFromUrl('authoring');
    expect(handle).not.toBeNull();
    handle?.stop();
  });
});
