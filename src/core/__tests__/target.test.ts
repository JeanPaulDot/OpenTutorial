import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  resolveTarget, waitForTarget, waitForElement,
  safeQuery, safeQueryAll, queryDeep, isVisible, describeTarget,
} from '../dom/target';

/** jsdom gives every element a zero rect, so `visible` tests need real numbers. */
function sizeOf(el: Element, width: number, height: number): void {
  el.getBoundingClientRect = () => ({
    x: 0, y: 0, width, height, top: 0, left: 0, right: width, bottom: height,
    toJSON: () => ({}),
  }) as DOMRect;
}

describe('safeQuery', () => {
  beforeEach(() => { document.body.innerHTML = '<div id="a" class="x"></div>'; });

  it('finds an element', () => {
    expect(safeQuery('#a')).toBeInstanceOf(HTMLElement);
  });

  it('returns null for a malformed selector instead of throwing', () => {
    expect(safeQuery('<<<not a selector')).toBeNull();
    expect(safeQueryAll(':::bad')).toEqual([]);
  });
});

describe('queryDeep', () => {
  it('pierces open shadow roots', () => {
    document.body.innerHTML = '<div id="host"></div>';
    const host = document.getElementById('host')!;
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = '<button class="deep">Go</button>';

    expect(safeQueryAll('.deep')).toHaveLength(0);
    expect(queryDeep('.deep')).toHaveLength(1);
  });

  it('does not enter closed shadow roots', () => {
    document.body.innerHTML = '<div id="closed"></div>';
    const host = document.getElementById('closed')!;
    const shadow = host.attachShadow({ mode: 'closed' });
    shadow.innerHTML = '<button class="hidden-deep"></button>';

    expect(queryDeep('.hidden-deep')).toHaveLength(0);
  });
});

describe('isVisible', () => {
  beforeEach(() => { document.body.innerHTML = '<div id="v"></div><div id="z"></div>'; });

  it('is false for a zero-size element', () => {
    expect(isVisible(document.getElementById('z')!)).toBe(false);
  });

  it('is true for a sized, displayed element', () => {
    const el = document.getElementById('v')!;
    sizeOf(el, 100, 20);
    expect(isVisible(el)).toBe(true);
  });

  it('is false when display is none', () => {
    const el = document.getElementById('v')!;
    sizeOf(el, 100, 20);
    el.setAttribute('style', 'display: none');
    expect(isVisible(el)).toBe(false);
  });
});

describe('resolveTarget', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="one" class="item">First</div>
      <div id="two" class="item">Second</div>
      <button id="save">Save changes</button>
      <p id="para">Save</p>
    `;
  });

  it('resolves a single selector', () => {
    const found = resolveTarget({ selector: '#one' });
    expect(found?.element.id).toBe('one');
    expect(found?.matched).toBe('#one');
  });

  it('returns null when nothing matches', () => {
    expect(resolveTarget({ selector: '#nope' })).toBeNull();
  });

  it('walks a fallback list in order and reports which one matched', () => {
    const found = resolveTarget({ selector: ['#missing', '#gone', '#two'] });
    expect(found?.element.id).toBe('two');
    expect(found?.matched).toBe('#two');
  });

  it('honours index within a multi-match selector', () => {
    expect(resolveTarget({ selector: '.item' })?.element.id).toBe('one');
    expect(resolveTarget({ selector: '.item', index: 1 })?.element.id).toBe('two');
    expect(resolveTarget({ selector: '.item', index: 9 })).toBeNull();
  });

  it('matches by visible text, preferring the deepest exact match', () => {
    const found = resolveTarget({ text: 'Save' });
    // #para is an exact match; #save only contains it.
    expect(found?.element.id).toBe('para');
    expect(found?.matched).toBe('text:Save');
  });

  it('uses text to narrow a selector', () => {
    const found = resolveTarget({ selector: 'button', text: 'save changes' });
    expect(found?.element.id).toBe('save');
    expect(found?.matched).toBe('button');
  });

  it('filters to visible elements when asked', () => {
    const one = document.getElementById('one')!;
    const two = document.getElementById('two')!;
    sizeOf(two, 50, 10);
    // `one` keeps jsdom's zero rect and is therefore invisible.
    expect(resolveTarget({ selector: '.item', visible: true })?.element.id).toBe('two');
    sizeOf(one, 50, 10);
    expect(resolveTarget({ selector: '.item', visible: true })?.element.id).toBe('one');
  });

  it('returns null for a missing iframe rather than throwing', () => {
    expect(resolveTarget({ selector: '#one', iframe: '#no-frame' })).toBeNull();
  });

  it('resolves inside a same-origin iframe and reports its offset', () => {
    const frame = document.createElement('iframe');
    document.body.appendChild(frame);
    frame.contentDocument!.body.innerHTML = '<span id="inner">hi</span>';
    frame.id = 'f';
    sizeOf(frame, 300, 200);
    Object.defineProperty(frame, 'getBoundingClientRect', {
      value: () => ({ x: 40, y: 60, width: 300, height: 200, top: 60, left: 40, right: 340, bottom: 260, toJSON: () => ({}) }),
    });

    const found = resolveTarget({ selector: '#inner', iframe: '#f' });
    expect(found?.element.id).toBe('inner');
    expect(found?.frameOffset).toEqual({ x: 40, y: 60 });
  });

  it('finds targets through shadow roots when shadow is set', () => {
    document.body.innerHTML = '<div id="host"></div>';
    const shadow = document.getElementById('host')!.attachShadow({ mode: 'open' });
    shadow.innerHTML = '<b class="needle">x</b>';

    expect(resolveTarget({ selector: '.needle' })).toBeNull();
    expect(resolveTarget({ selector: '.needle', shadow: true })?.element.className).toBe('needle');
  });
});

describe('describeTarget', () => {
  it('summarises each shape', () => {
    expect(describeTarget({ selector: '#a' })).toBe('#a');
    expect(describeTarget({ selector: ['#a', '#b'] })).toBe('#a | #b');
    expect(describeTarget({ text: 'Save' })).toBe('text "Save"');
    expect(describeTarget({ selector: '#a', iframe: '#f' })).toBe('#a + in iframe #f');
    expect(describeTarget({})).toBe('(no selector)');
  });
});

describe('waitForTarget', () => {
  beforeEach(() => { vi.useFakeTimers(); document.body.innerHTML = ''; });
  afterEach(() => { vi.useRealTimers(); });

  it('resolves immediately when the target already exists', async () => {
    document.body.innerHTML = '<div id="now"></div>';
    await expect(waitForTarget({ selector: '#now' })).resolves.toMatchObject({
      matched: '#now',
    });
  });

  it('resolves once the element appears later', async () => {
    const promise = waitForTarget({ selector: '#later' }, 5000);
    document.body.innerHTML = '<div id="later"></div>';
    await vi.advanceTimersByTimeAsync(150);
    const found = await promise;
    expect(found?.element.id).toBe('later');
  });

  it('resolves null at the timeout', async () => {
    const promise = waitForTarget({ selector: '#never' }, 300);
    await vi.advanceTimersByTimeAsync(400);
    await expect(promise).resolves.toBeNull();
  });

  it('waitForElement unwraps to the element', async () => {
    document.body.innerHTML = '<div id="el"></div>';
    await expect(waitForElement('#el')).resolves.toBeInstanceOf(HTMLElement);
  });
});
