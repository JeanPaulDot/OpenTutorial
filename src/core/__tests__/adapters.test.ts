import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTutorialLayer } from '../adapters/vanilla';
import { createTourPlugin, createTour as createVueTour, TOUR_KEY } from '../adapters/vue';
import { createTourStore, tourAnchor } from '../adapters/svelte';
import { createTourLayer as createSolidLayer, tourAnchor as solidAnchor } from '../adapters/solid';
import { OpenTutorialService, provideOpenTutorial } from '../adapters/angular';
import { defineOpenTutorialElement } from '../adapters/webcomponent';
import { createMemoryStorage } from '../storage/memory';
import type { TourEvent, TutorialSpec } from '../types';

function spec(id = 'welcome'): TutorialSpec {
  return {
    specVersion: 1,
    id,
    title: 'Welcome',
    trigger: { type: 'manual' },
    steps: [
      { id: 's1', title: 'One', content: 'first', placement: 'center' },
      { id: 's2', title: 'Two', content: 'second', placement: 'center' },
    ],
  } as TutorialSpec;
}

function options(extra: Record<string, unknown> = {}) {
  return { specs: [spec()], storage: createMemoryStorage(), autoMount: false, ...extra };
}

beforeEach(() => { document.body.innerHTML = ''; });

describe('vanilla adapter', () => {
  it('exposes the tour API', async () => {
    const layer = createTutorialLayer(options());
    await layer.ready;

    expect(layer.getSpecs().map((s) => s.id)).toEqual(['welcome']);
    expect(layer.getActiveId()).toBeNull();
    expect(layer.hasSeen('welcome')).toBe(false);
    expect(layer.whyBlocked('welcome')).toBeNull();
    expect(layer.whyBlocked('ghost')).toBe('unknown tour');
    expect(layer.getEngine('welcome')).toBeDefined();

    layer.destroy();
  });

  it('routes engine events to the named channels', async () => {
    const layer = createTutorialLayer(options());
    await layer.ready;

    const all: TourEvent[] = [];
    const starts: TourEvent[] = [];
    const steps: TourEvent[] = [];
    const stops: TourEvent[] = [];

    layer.on('event', (e) => all.push(e));
    layer.on('start', (e) => starts.push(e));
    layer.on('step', (e) => steps.push(e));
    layer.on('stop', (e) => stops.push(e));

    layer.start('welcome');
    await vi.waitFor(() => expect(starts.length).toBeGreaterThan(0));
    expect(steps.length).toBeGreaterThan(0);

    layer.skip();
    await vi.waitFor(() => expect(stops.length).toBeGreaterThan(0));
    expect(all.length).toBeGreaterThan(starts.length);

    layer.destroy();
  });

  it('off() and the returned unsubscribe both detach', async () => {
    const layer = createTutorialLayer(options());
    await layer.ready;

    const viaReturn = vi.fn();
    const viaOff = vi.fn();
    const unsubscribe = layer.on('event', viaReturn);
    layer.on('event', viaOff);

    unsubscribe();
    layer.off('event', viaOff);

    layer.start('welcome');
    await vi.waitFor(() => expect(layer.getActiveId()).toBe('welcome'));
    expect(viaReturn).not.toHaveBeenCalled();
    expect(viaOff).not.toHaveBeenCalled();

    layer.destroy();
  });

  it('a throwing subscriber cannot break the tour', async () => {
    const layer = createTutorialLayer(options());
    await layer.ready;

    layer.on('event', () => { throw new Error('subscriber blew up'); });
    expect(() => layer.start('welcome')).not.toThrow();
    await vi.waitFor(() => expect(layer.getActiveId()).toBe('welcome'));

    layer.destroy();
  });

  it('next, prev and goTo drive the active engine', async () => {
    const layer = createTutorialLayer(options());
    await layer.ready;

    layer.start('welcome');
    await vi.waitFor(() => expect(layer.getState()?.currentStepId).toBe('s1'));

    layer.next();
    await vi.waitFor(() => expect(layer.getState()?.currentStepId).toBe('s2'));

    layer.prev();
    await vi.waitFor(() => expect(layer.getState()?.currentStepId).toBe('s1'));

    layer.goTo('s2');
    await vi.waitFor(() => expect(layer.getState()?.currentStepId).toBe('s2'));

    layer.destroy();
  });

  it('navigation calls are no-ops with nothing active', async () => {
    const layer = createTutorialLayer(options());
    await layer.ready;
    expect(() => { layer.next(); layer.prev(); layer.goTo('s1'); }).not.toThrow();
    layer.destroy();
  });

  it('pause and resume round-trip', async () => {
    const layer = createTutorialLayer(options());
    await layer.ready;

    layer.start('welcome');
    await vi.waitFor(() => expect(layer.getActiveId()).toBe('welcome'));

    layer.pause();
    expect(layer.getState()?.status).toBe('paused');
    layer.resume();
    expect(layer.getState()?.status).toBe('running');

    layer.destroy();
  });

  it('exports and imports progress', async () => {
    const layer = createTutorialLayer(options());
    await layer.ready;

    layer.start('welcome');
    await vi.waitFor(() => expect(layer.getActiveId()).toBe('welcome'));
    layer.getEngine('welcome')!.complete('api');
    await vi.waitFor(() => expect(layer.hasSeen('welcome')).toBe(true));

    const snapshot = layer.exportProgress()!;
    layer.reset();
    expect(layer.hasSeen('welcome')).toBe(false);

    expect(layer.importProgress(snapshot)).toBe(true);
    expect(layer.hasSeen('welcome')).toBe(true);

    layer.destroy();
  });

  it('destroy emits on the destroy channel and clears listeners', async () => {
    const layer = createTutorialLayer(options());
    await layer.ready;

    const onDestroy = vi.fn();
    layer.on('destroy', onDestroy);
    layer.destroy();

    expect(onDestroy).toHaveBeenCalledTimes(1);
  });
});

describe('vue adapter', () => {
  it('provides the layer under TOUR_KEY and adds $tour', async () => {
    const provided = new Map<symbol | string, unknown>();
    const app = {
      provide: (key: symbol | string, value: unknown) => provided.set(key, value),
      config: { globalProperties: {} as Record<string, unknown> },
      unmount: vi.fn(),
    };

    createTourPlugin(options()).install(app);

    const layer = provided.get(TOUR_KEY) as ReturnType<typeof createVueTour>;
    expect(layer).toBeDefined();
    expect(app.config.globalProperties.$tour).toBe(layer);
    await layer.ready;

    expect(layer.snapshot()).toEqual({ activeId: null, state: null });
    layer.destroy();
  });

  it('destroys the layer when the app unmounts', async () => {
    const originalUnmount = vi.fn();
    const app = {
      provide: vi.fn(),
      config: { globalProperties: {} },
      unmount: originalUnmount,
    };

    createTourPlugin(options()).install(app);
    app.unmount();
    expect(originalUnmount).toHaveBeenCalled();
  });

  it('createTour returns a standalone decorated layer', async () => {
    const layer = createVueTour(options());
    await layer.ready;

    const seen: TourEvent[] = [];
    const off = layer.subscribe((e) => seen.push(e));

    layer.start('welcome');
    await vi.waitFor(() => expect(seen.length).toBeGreaterThan(0));
    expect(layer.snapshot().activeId).toBe('welcome');

    off();
    layer.destroy();
  });
});

describe('svelte adapter', () => {
  it('implements the store contract and pushes state', async () => {
    const store = createTourStore(options());
    await store.ready;

    const values: Array<{ activeId: string | null }> = [];
    const unsubscribe = store.subscribe((v) => values.push(v));

    // A Svelte store calls the subscriber immediately.
    expect(values).toHaveLength(1);
    expect(values[0].activeId).toBeNull();

    store.start('welcome');
    await vi.waitFor(() => expect(values.at(-1)?.activeId).toBe('welcome'));

    unsubscribe();
    const count = values.length;
    store.skip();
    await new Promise((r) => setTimeout(r, 20));
    expect(values).toHaveLength(count);

    store.destroy();
  });

  it('a throwing subscriber does not break the store', async () => {
    const store = createTourStore(options());
    await store.ready;
    store.subscribe(() => { throw new Error('nope'); });
    expect(() => store.start('welcome')).not.toThrow();
    store.destroy();
  });

  it('tourAnchor tags and cleans up an element', () => {
    const node = document.createElement('button');
    const action = tourAnchor(node, 'sidebar');
    expect(node.getAttribute('data-tour')).toBe('sidebar');

    action.update('header');
    expect(node.getAttribute('data-tour')).toBe('header');

    action.destroy();
    expect(node.hasAttribute('data-tour')).toBe(false);
  });
});

describe('solid adapter', () => {
  it('pushes snapshots into a setter and unsubscribes', async () => {
    const layer = createSolidLayer(options());
    await layer.ready;

    const seen: Array<string | null> = [];
    const stop = layer.watch((v) => seen.push(v.activeId));
    expect(seen).toEqual([null]);

    layer.start('welcome');
    await vi.waitFor(() => expect(seen.at(-1)).toBe('welcome'));
    expect(layer.snapshot().activeId).toBe('welcome');

    stop();
    const count = seen.length;
    layer.skip();
    await new Promise((r) => setTimeout(r, 20));
    expect(seen).toHaveLength(count);

    layer.destroy();
  });

  it('watchEvents forwards every event', async () => {
    const layer = createSolidLayer(options());
    await layer.ready;

    const events: TourEvent[] = [];
    layer.watchEvents((e) => events.push(e));
    layer.start('welcome');
    await vi.waitFor(() => expect(events.length).toBeGreaterThan(0));

    layer.destroy();
  });

  it('tourAnchor sets and clears the attribute from an accessor', () => {
    const node = document.createElement('div');
    solidAnchor(node, () => 'panel');
    expect(node.getAttribute('data-tour')).toBe('panel');

    solidAnchor(node, () => '');
    expect(node.hasAttribute('data-tour')).toBe(false);
  });
});

describe('angular adapter', () => {
  it('delegates the tour API and exposes observables', async () => {
    const service = new OpenTutorialService(options());
    await service.layer.ready;

    const snapshots: Array<string | null> = [];
    const sub = service.state$.subscribe((v) => snapshots.push(v.activeId));
    expect(snapshots).toEqual([null]);

    service.start('welcome');
    await vi.waitFor(() => expect(snapshots.at(-1)).toBe('welcome'));
    expect(service.snapshot().activeId).toBe('welcome');
    expect(service.hasSeen('welcome')).toBe(false);
    expect(service.whyBlocked('ghost')).toBe('unknown tour');

    sub.unsubscribe();
    service.ngOnDestroy();
  });

  it('accepts an observer object as well as a function', async () => {
    const service = new OpenTutorialService(options());
    await service.layer.ready;

    const next = vi.fn();
    const sub = service.state$.subscribe({ next });
    expect(next).toHaveBeenCalled();

    sub.unsubscribe();
    service.ngOnDestroy();
  });

  it('events$ forwards tour events', async () => {
    const service = new OpenTutorialService(options());
    await service.layer.ready;

    const events: TourEvent[] = [];
    const sub = service.events$.subscribe((e) => events.push(e));

    service.start('welcome');
    await vi.waitFor(() => expect(events.length).toBeGreaterThan(0));

    sub.unsubscribe();
    service.ngOnDestroy();
  });

  it('provideOpenTutorial returns a factory provider', () => {
    const provider = provideOpenTutorial(options());
    expect(provider.provide).toBe(OpenTutorialService);

    const instance = provider.useFactory();
    expect(instance).toBeInstanceOf(OpenTutorialService);
    instance.ngOnDestroy();
  });
});

describe('web component', () => {
  beforeEach(() => { defineOpenTutorialElement(); });
  afterEach(() => { document.body.innerHTML = ''; });

  it('registers the custom element', () => {
    expect(customElements.get('open-tutorial')).toBeDefined();
  });

  it('reads specs from an inline JSON script tag', async () => {
    document.body.innerHTML = `
      <open-tutorial>
        <script type="application/json">
          ${JSON.stringify(spec('inline'))}
        </script>
      </open-tutorial>
    `;

    const el = document.querySelector('open-tutorial') as HTMLElement & {
      layer?: { getSpecs: () => TutorialSpec[] };
    };
    await vi.waitFor(() => expect(el.layer).toBeDefined());
    expect(el.layer!.getSpecs().map((s) => s.id)).toEqual(['inline']);
  });

  it('reads specs from the specs attribute', async () => {
    const el = document.createElement('open-tutorial') as HTMLElement & {
      layer?: { getSpecs: () => TutorialSpec[] };
    };
    el.setAttribute('specs', JSON.stringify([spec('attr')]));
    document.body.appendChild(el);

    await vi.waitFor(() => expect(el.layer).toBeDefined());
    expect(el.layer!.getSpecs().map((s) => s.id)).toEqual(['attr']);
  });

  it('ignores malformed JSON rather than throwing', async () => {
    const el = document.createElement('open-tutorial');
    el.setAttribute('specs', '{not json');
    expect(() => document.body.appendChild(el)).not.toThrow();
  });

  it('tears the layer down on disconnect', async () => {
    const el = document.createElement('open-tutorial') as HTMLElement & { layer?: unknown };
    el.setAttribute('specs', JSON.stringify([spec('bye')]));
    document.body.appendChild(el);
    await vi.waitFor(() => expect(el.layer).toBeDefined());

    el.remove();
    await vi.waitFor(() => expect(el.layer ?? null).toBeNull());
  });

  it('defineOpenTutorialElement is idempotent', () => {
    expect(() => { defineOpenTutorialElement(); defineOpenTutorialElement(); }).not.toThrow();
  });
});
