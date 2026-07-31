import type { TourEvent, TutorialSpec } from '../types';

export interface FunnelStep {
  stepId: string;
  index: number;
  /** Sessions that reached this step. */
  views: number;
  /** Sessions that advanced past it. */
  completions: number;
  /** Sessions that ended the tour here. */
  dropOffs: number;
  /** Share of viewers who did not continue, 0–1. */
  dropOffRate: number;
  medianDurationMs: number;
}

export interface FunnelReport {
  tourId: string;
  starts: number;
  completions: number;
  skips: number;
  completionRate: number;
  medianDurationMs: number;
  steps: FunnelStep[];
  /** The step losing the most users, if any did. */
  worstStep: FunnelStep | null;
  targetsNotFound: Array<{ stepId: string; selector: string; count: number }>;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

/**
 * Build a drop-off report from a raw event stream.
 *
 * Answers the question every tour author actually has — "where do people quit?"
 * — without needing a warehouse. Feed it the events collected from `onEvent`.
 */
export function createFunnelReport(
  events: readonly TourEvent[],
  tourId: string,
  spec?: TutorialSpec,
): FunnelReport {
  const mine = events.filter((e) => e.tourId === tourId);

  const starts = mine.filter((e) => e.type === 'started' || e.type === 'resumed').length;
  const completions = mine.filter((e) => e.type === 'completed').length;
  const skips = mine.filter((e) => e.type === 'skipped').length;

  const tourDurations = mine
    .filter((e) => (e.type === 'completed' || e.type === 'skipped') && typeof e.duration === 'number')
    .map((e) => e.duration as number);

  const order: string[] = [];
  const views = new Map<string, number>();
  const completed = new Map<string, number>();
  const durations = new Map<string, number[]>();

  for (const e of mine) {
    if (e.type === 'step-shown' && e.stepId) {
      if (!order.includes(e.stepId)) order.push(e.stepId);
      views.set(e.stepId, (views.get(e.stepId) ?? 0) + 1);
    }
    if (e.type === 'step-completed' && e.stepId) {
      completed.set(e.stepId, (completed.get(e.stepId) ?? 0) + 1);
      if (typeof e.duration === 'number') {
        const list = durations.get(e.stepId) ?? [];
        list.push(e.duration);
        durations.set(e.stepId, list);
      }
    }
  }

  // Prefer the spec's declared order; fall back to first-seen order.
  const stepIds = spec ? spec.steps.map((s) => s.id).filter((id) => views.has(id)) : order;

  const steps: FunnelStep[] = stepIds.map((stepId, index) => {
    const seen = views.get(stepId) ?? 0;
    const advanced = completed.get(stepId) ?? 0;
    const dropOffs = Math.max(0, seen - advanced);
    return {
      stepId,
      index,
      views: seen,
      completions: advanced,
      dropOffs,
      dropOffRate: seen > 0 ? dropOffs / seen : 0,
      medianDurationMs: median(durations.get(stepId) ?? []),
    };
  });

  const worstStep = steps.reduce<FunnelStep | null>(
    (worst, step) => (step.dropOffs > 0 && (!worst || step.dropOffRate > worst.dropOffRate) ? step : worst),
    null,
  );

  const notFound = new Map<string, { stepId: string; selector: string; count: number }>();
  for (const e of mine) {
    if (e.type !== 'target-not-found' || !e.stepId) continue;
    const key = `${e.stepId}::${e.selector ?? ''}`;
    const existing = notFound.get(key);
    if (existing) existing.count += 1;
    else notFound.set(key, { stepId: e.stepId, selector: e.selector ?? '', count: 1 });
  }

  return {
    tourId,
    starts,
    completions,
    skips,
    completionRate: starts > 0 ? completions / starts : 0,
    medianDurationMs: median(tourDurations),
    steps,
    worstStep,
    targetsNotFound: [...notFound.values()].sort((a, b) => b.count - a.count),
  };
}

/** Collects events in memory so `createFunnelReport` has something to read. */
export function createEventCollector(limit = 5000): {
  adapter: (e: TourEvent) => void;
  events: TourEvent[];
  report: (tourId: string, spec?: TutorialSpec) => FunnelReport;
  clear: () => void;
} {
  const events: TourEvent[] = [];
  return {
    adapter: (e: TourEvent) => {
      events.push(e);
      if (events.length > limit) events.splice(0, events.length - limit);
    },
    events,
    report: (tourId, spec) => createFunnelReport(events, tourId, spec),
    clear: () => { events.length = 0; },
  };
}
