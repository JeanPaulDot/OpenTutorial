import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createPostHogAdapter, createMixpanelAdapter, createAmplitudeAdapter,
  createSegmentAdapter, createRudderStackAdapter, createHeapAdapter,
  createGA4Adapter, createDatadogAdapter, createDebugAdapter,
  createMultiAdapter, filterEvents,
} from '../analytics/vendors';
import { createHttpAdapter } from '../analytics/http';
import { createFunnelReport, createEventCollector } from '../analytics/funnel';
import { withSampling, withEventTypes, shouldSample, sampleValue } from '../analytics/sampling';
import { toProperties, eventName } from '../analytics/common';
import { createMemoryStorage } from '../storage/memory';
import type { TourEvent } from '../types';

function event(partial: Partial<TourEvent> = {}): TourEvent {
  return {
    type: 'step-shown',
    tourId: 'welcome',
    stepId: 's1',
    index: 0,
    total: 3,
    timestamp: 1700000000000,
    ...partial,
  };
}

describe('toProperties', () => {
  it('flattens an event without mutating it', () => {
    const source = event({ duration: 1200, reason: 'user', selector: '#a', message: 'hi', meta: { plan: 'pro' } });
    const frozen = JSON.stringify(source);

    const props = toProperties(source);
    expect(props).toMatchObject({
      tour_id: 'welcome',
      event_type: 'step-shown',
      step_id: 's1',
      step_index: 0,
      step_total: 3,
      duration_ms: 1200,
      reason: 'user',
      selector: '#a',
      message: 'hi',
      plan: 'pro',
      timestamp: 1700000000000,
    });
    // The v0.1 Amplitude bug was an adapter deleting keys off the live event.
    expect(JSON.stringify(source)).toBe(frozen);
  });

  it('omits absent optional fields', () => {
    const props = toProperties({ type: 'started', tourId: 't', timestamp: 1 });
    expect(props).not.toHaveProperty('step_id');
    expect(props).not.toHaveProperty('duration_ms');
  });

  it('can drop the timestamp', () => {
    expect(toProperties(event(), { includeTimestamp: false })).not.toHaveProperty('timestamp');
  });

  it('names events with a prefix', () => {
    expect(eventName(event())).toBe('OpenTutorial step-shown');
    expect(eventName(event(), '[X]')).toBe('[X] step-shown');
  });
});

describe('vendor adapters', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('PostHog uses capture', () => {
    const client = { capture: vi.fn() };
    createPostHogAdapter(client)(event());
    expect(client.capture).toHaveBeenCalledWith('[OpenTutorial] step-shown', expect.objectContaining({ tour_id: 'welcome' }));
  });

  it('Mixpanel uses track', () => {
    const client = { track: vi.fn() };
    createMixpanelAdapter(client)(event());
    expect(client.track).toHaveBeenCalledWith('[OpenTutorial] step-shown', expect.any(Object));
  });

  it('Amplitude omits the timestamp', () => {
    const client = { track: vi.fn() };
    createAmplitudeAdapter(client)(event());
    expect(client.track.mock.calls[0][1]).not.toHaveProperty('timestamp');
  });

  it('Segment and RudderStack share a contract', () => {
    const segment = { track: vi.fn() };
    const rudder = { track: vi.fn() };
    createSegmentAdapter(segment)(event());
    createRudderStackAdapter(rudder)(event());
    expect(segment.track.mock.calls[0][0]).toBe('OpenTutorial step-shown');
    expect(rudder.track.mock.calls[0][0]).toBe('OpenTutorial step-shown');
  });

  it('Heap falls back to the global client', () => {
    const heap = { track: vi.fn() };
    vi.stubGlobal('heap', heap);
    createHeapAdapter()(event());
    expect(heap.track).toHaveBeenCalledWith('OpenTutorial step-shown', expect.any(Object));
  });

  it('GA4 snake-cases the event name', () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);
    createGA4Adapter('G-123')(event({ type: 'target-not-found' }));
    expect(gtag).toHaveBeenCalledWith('event', 'opentutorial_target_not_found', expect.objectContaining({ send_to: 'G-123' }));
  });

  it('GA4 is a no-op when gtag is absent', () => {
    vi.stubGlobal('gtag', undefined);
    expect(() => createGA4Adapter()(event())).not.toThrow();
  });

  it('Datadog records an action', () => {
    const rum = { addAction: vi.fn() };
    createDatadogAdapter(rum)(event());
    expect(rum.addAction).toHaveBeenCalledWith('opentutorial.step-shown', expect.any(Object));
  });

  it('the debug adapter logs', () => {
    const log = vi.fn();
    createDebugAdapter(log)(event());
    expect(log).toHaveBeenCalledWith('[opentutorial] step-shown', expect.any(Object));
  });

  it('an adapter that throws never escapes', () => {
    const client = { capture: () => { throw new Error('vendor down'); } };
    expect(() => createPostHogAdapter(client)(event())).not.toThrow();
  });

  it('createMultiAdapter fans out and isolates failures', () => {
    const good = vi.fn();
    const bad = () => { throw new Error('nope'); };
    createMultiAdapter(bad, good, undefined)(event());
    expect(good).toHaveBeenCalledTimes(1);
  });

  it('filterEvents passes only the listed types', () => {
    const sink = vi.fn();
    const adapter = filterEvents(sink, ['completed']);
    adapter(event({ type: 'step-shown' }));
    adapter(event({ type: 'completed' }));
    expect(sink).toHaveBeenCalledTimes(1);
  });
});

describe('sampling', () => {
  it('is deterministic for a key', () => {
    expect(sampleValue('welcome')).toBe(sampleValue('welcome'));
    expect(sampleValue('welcome')).not.toBe(sampleValue('other'));
    expect(sampleValue('welcome')).toBeGreaterThanOrEqual(0);
    expect(sampleValue('welcome')).toBeLessThan(1);
  });

  it('keeps everything at rate 1 and nothing at rate 0', () => {
    expect(shouldSample('any', 1)).toBe(true);
    expect(shouldSample('any', 0)).toBe(false);
  });

  it('keeps a whole tour run together, not individual events', () => {
    const sink = vi.fn();
    // Find a tour id that survives a 50% sample, then assert every event follows.
    const kept = ['a', 'b', 'c', 'd', 'e', 'f'].find((id) => shouldSample(id, 0.5))!;
    const adapter = withSampling(sink, { rate: 0.5 });

    adapter(event({ tourId: kept, type: 'started' }));
    adapter(event({ tourId: kept, type: 'step-shown' }));
    adapter(event({ tourId: kept, type: 'completed' }));
    expect(sink).toHaveBeenCalledTimes(3);
  });

  it('drops every event of a sampled-out run', () => {
    const sink = vi.fn();
    const dropped = ['a', 'b', 'c', 'd', 'e', 'f'].find((id) => !shouldSample(id, 0.5))!;
    const adapter = withSampling(sink, { rate: 0.5 });

    adapter(event({ tourId: dropped, type: 'started' }));
    adapter(event({ tourId: dropped, type: 'completed' }));
    expect(sink).not.toHaveBeenCalled();
  });

  it('always lets through the listed types', () => {
    const sink = vi.fn();
    const adapter = withSampling(sink, { rate: 0, always: ['error'] });
    adapter(event({ type: 'step-shown' }));
    adapter(event({ type: 'error' }));
    expect(sink).toHaveBeenCalledTimes(1);
    expect(sink.mock.calls[0][0].type).toBe('error');
  });

  it('can sample by a custom key', () => {
    const sink = vi.fn();
    const adapter = withSampling(sink, { rate: 1, key: (e) => String(e.meta?.userId ?? '') });
    adapter(event({ meta: { userId: 'u1' } }));
    expect(sink).toHaveBeenCalledTimes(1);
  });

  it('salt changes which cohort is picked', () => {
    const withoutSalt = shouldSample('welcome', 0.5);
    const salted = ['s1', 's2', 's3', 's4', 's5'].map((s) => shouldSample('welcome', 0.5, s));
    expect(salted.some((v) => v !== withoutSalt)).toBe(true);
  });

  it('withEventTypes narrows the stream', () => {
    const sink = vi.fn();
    const adapter = withEventTypes(sink, ['started', 'completed']);
    adapter(event({ type: 'step-shown' }));
    adapter(event({ type: 'started' }));
    expect(sink).toHaveBeenCalledTimes(1);
  });
});

describe('createHttpAdapter', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('batches once the batch size is reached', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true } as Response);
    const adapter = createHttpAdapter({
      endpoint: 'https://sink.test/e', batchSize: 2, flushMs: 100000, fetchImpl,
    });

    adapter(event({ type: 'started' }));
    expect(fetchImpl).not.toHaveBeenCalled();

    adapter(event({ type: 'completed' }));
    await vi.waitFor(() => expect(fetchImpl).toHaveBeenCalledTimes(1));

    const body = JSON.parse(fetchImpl.mock.calls[0][1].body as string);
    expect(body.events).toHaveLength(2);
  });

  it('flushes on the timer', async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true } as Response);
    const adapter = createHttpAdapter({
      endpoint: 'https://sink.test/e', batchSize: 100, flushMs: 50, fetchImpl,
    });

    adapter(event());
    await vi.advanceTimersByTimeAsync(80);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('persists the queue so an outage does not lose events', async () => {
    const storage = createMemoryStorage();
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'));
    const onError = vi.fn();

    const adapter = createHttpAdapter({
      endpoint: 'https://sink.test/e', batchSize: 1, flushMs: 100000, storage, fetchImpl, onError,
    });

    adapter(event({ type: 'started' }));
    await vi.waitFor(() => expect(onError).toHaveBeenCalled());

    const persisted = storage.getItem('ot:analytics:queue');
    expect(persisted).toBeTruthy();
    expect(JSON.parse(persisted!)).toHaveLength(1);
  });

  it('restores a persisted queue on construction', async () => {
    const storage = createMemoryStorage();
    storage.setItem('ot:analytics:queue', JSON.stringify([{ tour_id: 'old', event_type: 'started' }]));

    const fetchImpl = vi.fn().mockResolvedValue({ ok: true } as Response);
    const adapter = createHttpAdapter({
      endpoint: 'https://sink.test/e', batchSize: 2, flushMs: 100000, storage, fetchImpl,
    });

    // Restoration reads storage through a promise, so it lands a tick later.
    await Promise.resolve();
    adapter(event());

    await vi.waitFor(() => expect(fetchImpl).toHaveBeenCalled());
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body as string);
    expect(body.events[0].tour_id).toBe('old');
  });

  it('applies a transform', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true } as Response);
    const adapter = createHttpAdapter({
      endpoint: 'https://sink.test/e',
      batchSize: 1,
      flushMs: 100000,
      fetchImpl,
      transform: (e) => ({ custom: e.type }),
    });

    adapter(event({ type: 'skipped' }));
    await vi.waitFor(() => expect(fetchImpl).toHaveBeenCalled());
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body as string);
    expect(body.events[0]).toEqual({ custom: 'skipped' });
  });
});

describe('createFunnelReport', () => {
  const stream: TourEvent[] = [
    event({ type: 'started', stepId: undefined, index: undefined }),
    event({ type: 'step-shown', stepId: 's1', index: 0 }),
    event({ type: 'step-completed', stepId: 's1', index: 0, duration: 1000 }),
    event({ type: 'step-shown', stepId: 's2', index: 1 }),
    event({ type: 'step-completed', stepId: 's2', index: 1, duration: 3000 }),
    event({ type: 'step-shown', stepId: 's3', index: 2 }),
    event({ type: 'skipped', stepId: 's3', duration: 9000, reason: 'user' }),
    event({ type: 'target-not-found', stepId: 's3', selector: '#gone' }),
    event({ tourId: 'other', type: 'started' }),
  ];

  it('summarises starts, completions and skips for one tour only', () => {
    const report = createFunnelReport(stream, 'welcome');
    expect(report.tourId).toBe('welcome');
    expect(report.starts).toBe(1);
    expect(report.completions).toBe(0);
    expect(report.skips).toBe(1);
    expect(report.completionRate).toBe(0);
  });

  it('reports per-step views and drop-off', () => {
    const report = createFunnelReport(stream, 'welcome');
    const last = report.steps.find((s) => s.stepId === 's3');
    expect(last?.views).toBe(1);
    expect(last?.dropOffs).toBe(1);
    expect(last?.dropOffRate).toBe(1);
    expect(report.worstStep?.stepId).toBe('s3');
  });

  it('collects unresolved targets', () => {
    const report = createFunnelReport(stream, 'welcome');
    expect(report.targetsNotFound).toEqual([{ stepId: 's3', selector: '#gone', count: 1 }]);
  });

  it('handles an empty stream', () => {
    const report = createFunnelReport([], 'nothing');
    expect(report.starts).toBe(0);
    expect(report.steps).toEqual([]);
    expect(report.worstStep).toBeNull();
  });

  it('createEventCollector accumulates, reports and clears', () => {
    const collector = createEventCollector();
    collector.adapter(event({ type: 'started' }));
    collector.adapter(event({ type: 'step-shown', stepId: 's1', index: 0 }));
    collector.adapter(event({ type: 'completed' }));

    expect(collector.events).toHaveLength(3);
    expect(collector.report('welcome').completions).toBe(1);

    collector.clear();
    expect(collector.events).toHaveLength(0);
  });

  it('createEventCollector trims to its limit', () => {
    const collector = createEventCollector(2);
    collector.adapter(event({ type: 'started' }));
    collector.adapter(event({ type: 'step-shown' }));
    collector.adapter(event({ type: 'completed' }));
    expect(collector.events).toHaveLength(2);
    expect(collector.events[1].type).toBe('completed');
  });
});
