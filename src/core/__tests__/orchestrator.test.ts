import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TourOrchestrator } from '../orchestrator';
import { createMemoryStorage } from '../storage/memory';
import type { TourEvent, TutorialSpec } from '../types';

function spec(id: string, extra: Partial<TutorialSpec> = {}): TutorialSpec {
  return {
    specVersion: 1,
    id,
    title: id,
    trigger: { type: 'manual' },
    steps: [
      { id: 's1', title: 'One', content: 'first', placement: 'center' },
      { id: 's2', title: 'Two', content: 'second', placement: 'center' },
    ],
    ...extra,
  } as TutorialSpec;
}

/**
 * Start a tour and complete it.
 *
 * `complete()` only applies to a running or paused tour, so seen-state cannot
 * be faked by calling it on an idle engine.
 */
async function finish(orchestrator: TourOrchestrator, tourId: string): Promise<void> {
  orchestrator.start(tourId);
  await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe(tourId));
  orchestrator.getEngine(tourId)!.complete('api');
  await vi.waitFor(() => expect(orchestrator.getActiveId()).toBeNull());
}

function build(specs: TutorialSpec[], opts: Record<string, unknown> = {}) {
  const events: TourEvent[] = [];
  const orchestrator = new TourOrchestrator(specs, {
    storage: createMemoryStorage(),
    onEvent: (e) => events.push(e),
    ...opts,
  });
  return { orchestrator, events };
}

describe('TourOrchestrator — basics', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('exposes its specs and engines', () => {
    const { orchestrator } = build([spec('a'), spec('b')]);
    expect(orchestrator.getSpecs().map((s) => s.id)).toEqual(['a', 'b']);
    expect(orchestrator.getEngines()).toHaveLength(2);
    expect(orchestrator.getEngine('a')).toBeDefined();
    expect(orchestrator.getEngine('nope')).toBeUndefined();
  });

  it('tracks the active tour', async () => {
    const { orchestrator } = build([spec('a')]);
    await orchestrator.ready;
    expect(orchestrator.getActiveId()).toBeNull();

    orchestrator.start('a');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('a'));
    expect(orchestrator.getState()?.status).toBe('running');
  });

  it('reports null state for an unknown tour', () => {
    const { orchestrator } = build([spec('a')]);
    expect(orchestrator.getState('nope')).toBeNull();
  });

  it('shares context across every engine', () => {
    const { orchestrator } = build([spec('a'), spec('b')], { context: { plan: 'free' } });
    orchestrator.setContext({ plan: 'pro' });
    expect(orchestrator.getContext().plan).toBe('pro');
    expect(orchestrator.getEngine('b')!.getContext().plan).toBe('pro');
  });
});

describe('TourOrchestrator — eligibility', () => {
  it('rejects an unknown tour', () => {
    const { orchestrator } = build([spec('a')]);
    expect(orchestrator.checkEligibility('ghost')).toBe('unknown tour');
  });

  it('rejects a spec that failed validation', () => {
    const broken = { specVersion: 1, id: 'Bad Id', title: '', steps: [] } as unknown as TutorialSpec;
    const { orchestrator } = build([broken]);
    expect(orchestrator.checkEligibility('Bad Id')).toBe('spec failed validation');
  });

  it('applies spec-level audience rules', () => {
    const { orchestrator } = build(
      [spec('pro-only', { audience: { showIf: "plan === 'pro'" } })],
      { context: { plan: 'free' } },
    );
    expect(orchestrator.checkEligibility('pro-only')).toBe('audience rule did not match');

    orchestrator.setContext({ plan: 'pro' });
    expect(orchestrator.checkEligibility('pro-only')).toBeNull();
  });

  it('enforces frequency.max across sessions', async () => {
    const storage = createMemoryStorage();
    const capped = spec('capped', { frequency: { max: 1 } });

    const first = new TourOrchestrator([capped], { storage });
    await first.ready;
    first.getEngine('capped')!.getPersistence().markShown('capped');

    expect(first.checkEligibility('capped')).toMatch(/already shown 1 time/);
  });

  it('enforces frequency.cooldown', async () => {
    const storage = createMemoryStorage();
    const { orchestrator } = build([spec('cool', { frequency: { cooldown: 60_000 } })], { storage });
    await orchestrator.ready;

    orchestrator.getEngine('cool')!.getPersistence().markShown('cool');
    expect(orchestrator.checkEligibility('cool')).toMatch(/cooldown active/);
  });

  it('enforces frequency.perSession without touching persistence', async () => {
    const { orchestrator } = build([spec('once-a-session', { frequency: { perSession: 1 } })]);
    await orchestrator.ready;

    expect(orchestrator.request('once-a-session')).toBe(true);
    orchestrator.stop();
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBeNull());

    expect(orchestrator.checkEligibility('once-a-session')).toMatch(/session limit/);
  });
});

describe('TourOrchestrator — one at a time', () => {
  it('queues a second request and drains it when the first ends', async () => {
    const { orchestrator } = build([spec('first'), spec('second')]);
    await orchestrator.ready;

    expect(orchestrator.request('first')).toBe(true);
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('first'));

    // Queued, not started.
    expect(orchestrator.request('second')).toBe(false);
    expect(orchestrator.getActiveId()).toBe('first');

    orchestrator.getEngine('first')!.complete('api');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('second'));
  });

  it('drains the queue in priority order', async () => {
    const { orchestrator } = build([
      spec('running'),
      spec('low', { priority: 1 }),
      spec('high', { priority: 10 }),
    ]);
    await orchestrator.ready;

    orchestrator.request('running');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('running'));

    orchestrator.request('low');
    orchestrator.request('high');

    orchestrator.getEngine('running')!.complete('api');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('high'));
  });

  it('queue: false refuses instead of queuing', async () => {
    const { orchestrator } = build([spec('a'), spec('b')]);
    await orchestrator.ready;

    orchestrator.request('a');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('a'));

    expect(orchestrator.request('b', undefined, { queue: false })).toBe(false);
    orchestrator.getEngine('a')!.complete('api');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBeNull());
  });

  it('start() preempts whatever is running', async () => {
    const { orchestrator } = build([spec('a'), spec('b')]);
    await orchestrator.ready;

    orchestrator.start('a');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('a'));

    orchestrator.start('b');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('b'));
  });

  it('force bypasses audience and frequency rules', async () => {
    const { orchestrator } = build(
      [spec('gated', { audience: { showIf: "plan === 'pro'" } })],
      { context: { plan: 'free' } },
    );
    await orchestrator.ready;

    expect(orchestrator.request('gated')).toBe(false);
    expect(orchestrator.request('gated', undefined, { force: true })).toBe(true);
  });

  it('pause and resume act on the active tour only', async () => {
    const { orchestrator } = build([spec('a')]);
    await orchestrator.ready;

    orchestrator.start('a');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('a'));

    orchestrator.pause();
    expect(orchestrator.getState()?.status).toBe('paused');
    orchestrator.resume();
    expect(orchestrator.getState()?.status).toBe('running');
  });

  it('pause is a no-op with nothing running', () => {
    const { orchestrator } = build([spec('a')]);
    expect(() => { orchestrator.pause(); orchestrator.resume(); }).not.toThrow();
  });
});

describe('TourOrchestrator — persistence', () => {
  it('resetTour clears seen state and the session count', async () => {
    const { orchestrator } = build([spec('a', { frequency: { perSession: 1 } })]);
    await orchestrator.ready;

    orchestrator.request('a');
    orchestrator.stop();
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBeNull());
    expect(orchestrator.checkEligibility('a')).toMatch(/session limit/);

    orchestrator.resetTour('a');
    expect(orchestrator.checkEligibility('a')).toBeNull();
  });

  it('exports and re-imports progress', async () => {
    const { orchestrator } = build([spec('a'), spec('b')]);
    await orchestrator.ready;

    await finish(orchestrator, 'a');
    expect(orchestrator.hasSeen('a')).toBe(true);

    const snapshot = orchestrator.exportProgress();
    expect(snapshot?.tours.a).toBeDefined();

    orchestrator.reset();
    expect(orchestrator.hasSeen('a')).toBe(false);

    expect(orchestrator.importProgress(snapshot!)).toBe(true);
    expect(orchestrator.hasSeen('a')).toBe(true);
  });

  it('rejects an unparseable import without losing existing state', async () => {
    const { orchestrator } = build([spec('a')]);
    await orchestrator.ready;
    await finish(orchestrator, 'a');

    expect(orchestrator.importProgress('not json at all')).toBe(false);
    expect(orchestrator.hasSeen('a')).toBe(true);
  });

  it('merge keeps the newer record per tour', async () => {
    const { orchestrator } = build([spec('a')]);
    await orchestrator.ready;

    await finish(orchestrator, 'a');
    const mine = orchestrator.exportProgress()!;

    const older = {
      v: 2 as const,
      tours: { a: { status: 'skipped' as const, at: 1 } },
      progress: {},
    };
    orchestrator.importProgress(older, 'merge');
    // The local record is newer, so it survives.
    expect(orchestrator.getEngine('a')!.getPersistence().getStatus('a')).toBe('completed');
    expect(mine.tours.a.status).toBe('completed');
  });
});

describe('TourOrchestrator — mount', () => {
  beforeEach(() => { window.history.replaceState({}, '', '/'); });
  afterEach(() => { vi.useRealTimers(); });

  it('installs triggers for non-manual specs', async () => {
    const { orchestrator } = build([spec('auto-tour', { trigger: { type: 'auto' } })]);
    orchestrator.mount();
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('auto-tour'));
    orchestrator.destroy();
  });

  it('skips triggers for tours already seen when once is set', async () => {
    const storage = createMemoryStorage();
    const first = new TourOrchestrator([spec('seen', { trigger: { type: 'auto' } })], { storage });
    await first.ready;
    await finish(first, 'seen');
    first.destroy();

    const second = new TourOrchestrator([spec('seen', { trigger: { type: 'auto' } })], { storage });
    second.mount();
    await second.ready;
    await new Promise((r) => setTimeout(r, 50));
    expect(second.getActiveId()).toBeNull();
    second.destroy();
  });

  it('starts a deep-linked tour, bypassing frequency rules', async () => {
    window.history.replaceState({}, '', '/?tour=linked');
    const { orchestrator } = build([spec('linked', { frequency: { max: 0 } })]);
    orchestrator.mount();

    await vi.waitFor(
      () => expect(orchestrator.getActiveId()).toBe('linked'),
      { timeout: 2000 },
    );
    orchestrator.destroy();
  });

  it('honours deepLinkParam: false', async () => {
    window.history.replaceState({}, '', '/?tour=linked');
    const { orchestrator } = build([spec('linked')], { deepLinkParam: false });
    orchestrator.mount();
    await orchestrator.ready;
    await new Promise((r) => setTimeout(r, 600));
    expect(orchestrator.getActiveId()).toBeNull();
    orchestrator.destroy();
  });

  it('chains into the next tour on completion', async () => {
    const { orchestrator } = build([
      spec('first', { onComplete: { startTour: 'second' } }),
      spec('second'),
    ]);
    orchestrator.mount();
    await orchestrator.ready;

    orchestrator.start('first');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('first'));

    orchestrator.getEngine('first')!.complete('user');
    await vi.waitFor(() => expect(orchestrator.getActiveId()).toBe('second'), { timeout: 2000 });
    orchestrator.destroy();
  });

  it('destroy tears everything down and is idempotent', async () => {
    const { orchestrator } = build([spec('a', { trigger: { type: 'auto' } })]);
    orchestrator.mount();
    await orchestrator.ready;

    orchestrator.destroy();
    expect(orchestrator.getActiveId()).toBeNull();
    expect(() => orchestrator.destroy()).not.toThrow();
  });

  it('surfaces state changes through onStateChange', async () => {
    const seen: Array<string | null> = [];
    const { orchestrator } = build([spec('a')], {
      onStateChange: (active: string | null) => seen.push(active),
    });
    await orchestrator.ready;

    orchestrator.start('a');
    await vi.waitFor(() => expect(seen).toContain('a'));
  });

  it('an onEvent listener that throws does not break the tour', async () => {
    const { orchestrator } = build([spec('a')], {
      onEvent: () => { throw new Error('boom'); },
    });
    await orchestrator.ready;
    expect(() => orchestrator.start('a')).not.toThrow();
  });
});
