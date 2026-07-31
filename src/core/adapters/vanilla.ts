import { TourOrchestrator, type OrchestratorOptions } from '../orchestrator';
import type { TourEngine } from '../engine';
import type { ThemeOverrides, TourEvent, TourState, TutorialSpec } from '../types';

export type VanillaEventName =
  | 'start' | 'stop' | 'skip' | 'complete' | 'step' | 'event' | 'destroy';

export interface VanillaTutorialLayer {
  start: (tourId: string, stepId?: string) => void;
  request: (tourId: string, stepId?: string) => boolean;
  stop: () => void;
  skip: (tourId?: string) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  goTo: (stepId: string) => void;
  getState: (tourId?: string) => TourState | null;
  getActiveId: () => string | null;
  hasSeen: (tourId: string) => boolean;
  whyBlocked: (tourId: string) => string | null;
  setContext: (patch: Record<string, unknown>) => void;
  setTheme: (theme: ThemeOverrides) => void;
  setLocale: (locale: string) => void;
  setUser: (userId: string | undefined) => Promise<void>;
  reset: () => void;
  resetTour: (tourId: string) => void;
  resetProgress: () => void;
  getEngine: (tourId: string) => TourEngine | undefined;
  on: (event: VanillaEventName, handler: (detail: TourEvent) => void) => () => void;
  off: (event: VanillaEventName, handler: (detail: TourEvent) => void) => void;
  ready: Promise<void>;
  destroy: () => void;
}

export interface VanillaOptions extends OrchestratorOptions {
  specs: TutorialSpec[];
  /** Install triggers and deep links immediately. Default true. */
  autoMount?: boolean;
}

/** Which engine events feed each named channel. */
const CHANNELS: Record<VanillaEventName, ReadonlyArray<TourEvent['type']>> = {
  start: ['started', 'resumed'],
  stop: ['completed', 'skipped'],
  skip: ['skipped'],
  complete: ['completed'],
  step: ['step-shown'],
  event: [],       // every event
  destroy: [],     // emitted locally by destroy()
};

export function createTutorialLayer(opts: VanillaOptions): VanillaTutorialLayer {
  const { specs, autoMount = true, ...rest } = opts;
  const listeners = new Map<VanillaEventName, Set<(detail: TourEvent) => void>>();

  const dispatch = (name: VanillaEventName, detail: TourEvent): void => {
    const handlers = listeners.get(name);
    if (!handlers) return;
    for (const handler of handlers) {
      try { handler(detail); } catch { /* a subscriber must not break the tour */ }
    }
  };

  const orchestrator = new TourOrchestrator(specs, {
    ...rest,
    onEvent: (e) => {
      // Previously these were dispatched on `window` under names the engine
      // never emitted, so nothing ever fired. Now they are delivered directly.
      dispatch('event', e);
      for (const [name, types] of Object.entries(CHANNELS) as Array<[VanillaEventName, ReadonlyArray<TourEvent['type']>]>) {
        if (types.includes(e.type)) dispatch(name, e);
      }
      rest.onEvent?.(e);
    },
  });

  if (autoMount) orchestrator.mount();

  const active = (fn: (engine: TourEngine) => void): void => {
    const id = orchestrator.getActiveId();
    if (!id) return;
    const engine = orchestrator.getEngine(id);
    if (engine) fn(engine);
  };

  return {
    start: (tourId, stepId) => orchestrator.start(tourId, stepId),
    request: (tourId, stepId) => orchestrator.request(tourId, stepId),
    stop: () => orchestrator.stop('api'),
    skip: (tourId) => {
      if (tourId) orchestrator.getEngine(tourId)?.skip('api');
      else orchestrator.stop('api');
    },
    pause: () => orchestrator.pause(),
    resume: () => orchestrator.resume(),
    next: () => active((e) => void e.next()),
    prev: () => active((e) => e.prev()),
    goTo: (stepId) => active((e) => e.goTo(stepId)),
    getState: (tourId) => orchestrator.getState(tourId),
    getActiveId: () => orchestrator.getActiveId(),
    hasSeen: (tourId) => orchestrator.hasSeen(tourId),
    whyBlocked: (tourId) => orchestrator.checkEligibility(tourId),
    setContext: (patch) => orchestrator.setContext(patch),
    setTheme: (theme) => orchestrator.setTheme(theme),
    setLocale: (locale) => orchestrator.setLocale(locale),
    setUser: (userId) => orchestrator.setUser(userId),
    reset: () => orchestrator.reset(),
    resetTour: (tourId) => orchestrator.resetTour(tourId),
    resetProgress: () => orchestrator.resetProgress(),
    getEngine: (tourId) => orchestrator.getEngine(tourId),
    ready: orchestrator.ready,

    on(event, handler) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(handler);
      return () => this.off(event, handler);
    },

    off(event, handler) {
      listeners.get(event)?.delete(handler);
    },

    destroy() {
      dispatch('destroy', {
        type: 'skipped',
        tourId: orchestrator.getActiveId() ?? '',
        reason: 'destroy',
        timestamp: Date.now(),
      });
      orchestrator.destroy();
      listeners.clear();
    },
  };
}
