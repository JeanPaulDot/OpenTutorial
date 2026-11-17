import { TourOrchestrator, type OrchestratorOptions } from '../orchestrator';
import type { TourEngine } from '../engine';
import type { PersistedRoot } from '../persist';
import type { KeyValueStorage, ThemeOverrides, TourEvent, TourState, TutorialSpec } from '../types';

export type VanillaEventName =
  | 'start' | 'stop' | 'skip' | 'complete' | 'step' | 'event' | 'destroy';

/** What `subscribe` delivers and `getSnapshot` returns. */
export interface LayerSnapshot {
  activeId: string | null;
  state: TourState | null;
  context: Record<string, unknown>;
}

/**
 * A serializable instruction for the layer.
 *
 * Everything the imperative API can do, as plain data — so a tour can be
 * driven over `postMessage`, from a test script, or by an AI agent that emits
 * JSON rather than calling functions.
 */
export type LayerCommand =
  | { type: 'start'; tourId: string; stepId?: string }
  | { type: 'request'; tourId: string; stepId?: string }
  | { type: 'stop' }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'goTo'; stepId: string }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'setContext'; patch: Record<string, unknown> }
  | { type: 'addSpec'; spec: TutorialSpec }
  | { type: 'removeSpec'; tourId: string }
  | { type: 'reset'; tourId?: string };

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
  getSpecs: () => TutorialSpec[];
  hasSeen: (tourId: string) => boolean;
  whyBlocked: (tourId: string) => string | null;
  getContext: () => Record<string, unknown>;
  setContext: (patch: Record<string, unknown>) => void;
  setTheme: (theme: ThemeOverrides) => void;
  setLocale: (locale: string) => void;
  setUser: (userId: string | undefined) => Promise<void>;
  reset: () => void;
  resetTour: (tourId: string) => void;
  resetProgress: () => void;
  exportProgress: () => PersistedRoot | null;
  importProgress: (data: PersistedRoot | string, mode?: 'replace' | 'merge') => boolean;
  getEngine: (tourId: string) => TourEngine | undefined;
  /** Register a tour at runtime. Replaces one with the same id. False if invalid. */
  addSpec: (spec: TutorialSpec) => boolean;
  /** Unregister a tour, stopping it first if it is running. */
  removeSpec: (tourId: string) => boolean;
  /**
   * A framework-neutral store over `{ activeId, state, context }`.
   *
   * `subscribe` calls `run` immediately and again on every change, which is the
   * Svelte store contract; `getSnapshot` is referentially stable between
   * changes, which is what React's `useSyncExternalStore` requires:
   *
   *   useSyncExternalStore(cb => layer.store.subscribe(() => cb()), layer.store.getSnapshot)
   *
   * Nested under `store` because the Svelte, Vue and Solid adapters each
   * already expose their own `subscribe` / `watch` with different shapes.
   */
  store: {
    subscribe: (run: (snapshot: LayerSnapshot) => void) => () => void;
    getSnapshot: () => LayerSnapshot;
  };
  /** Run `fn` whenever an expression over the context changes value. */
  watchContext: (expr: string, fn: (value: unknown, previous: unknown) => void) => () => void;
  /** Execute a serializable command. Returns false for an unknown one. */
  dispatch: (command: LayerCommand) => boolean;
  on: (event: VanillaEventName, handler: (detail: TourEvent) => void) => () => void;
  off: (event: VanillaEventName, handler: (detail: TourEvent) => void) => void;
  ready: Promise<void>;
  destroy: () => void;
}

export interface VanillaOptions extends OrchestratorOptions {
  specs: TutorialSpec[];
  /** Install triggers and deep links immediately. Default true. */
  autoMount?: boolean;
  /**
   * Shorthand for `persistence.storage`.
   *
   * `TourProvider` has accepted a top-level `storage` prop since 0.1, so the
   * nested-only form here was a trap: passing `storage` to a non-React adapter
   * silently fell through to localStorage. Both spellings work now; the nested
   * one wins if you somehow pass both.
   */
  storage?: KeyValueStorage;
  /** Shorthand for `persistence.keyPrefix`. Default `"ot"`. */
  keyPrefix?: string;
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
  const { specs, autoMount = true, storage, keyPrefix, ...rest } = opts;
  const listeners = new Map<VanillaEventName, Set<(detail: TourEvent) => void>>();

  const persistence = (storage !== undefined || keyPrefix !== undefined)
    ? { storage, keyPrefix, ...(rest.persistence ?? {}) }
    : rest.persistence;

  const dispatch = (name: VanillaEventName, detail: TourEvent): void => {
    const handlers = listeners.get(name);
    if (!handlers) return;
    for (const handler of handlers) {
      try { handler(detail); } catch { /* a subscriber must not break the tour */ }
    }
  };

  const subscribers = new Set<(snapshot: LayerSnapshot) => void>();
  let snapshot: LayerSnapshot = { activeId: null, state: null, context: rest.context ?? {} };

  const publish = (next: LayerSnapshot): void => {
    snapshot = next;
    for (const run of subscribers) {
      try { run(snapshot); } catch { /* a subscriber must not break the tour */ }
    }
  };

  const orchestrator = new TourOrchestrator(specs, {
    ...rest,
    persistence,
    onStateChange: (activeId, state) => {
      publish({ activeId, state, context: snapshot.context });
      rest.onStateChange?.(activeId, state);
    },
    onContextChange: (context, patch) => {
      // A fresh object each time: the context itself is mutated in place, and
      // a store that hands back the same reference never looks changed.
      publish({ ...snapshot, context: { ...context } });
      rest.onContextChange?.(context, patch);
    },
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

  snapshot = { ...snapshot, context: { ...orchestrator.getContext() } };
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
    getSpecs: () => orchestrator.getSpecs(),
    hasSeen: (tourId) => orchestrator.hasSeen(tourId),
    whyBlocked: (tourId) => orchestrator.checkEligibility(tourId),
    getContext: () => orchestrator.getContext(),
    setContext: (patch) => orchestrator.setContext(patch),
    setTheme: (theme) => orchestrator.setTheme(theme),
    setLocale: (locale) => orchestrator.setLocale(locale),
    setUser: (userId) => orchestrator.setUser(userId),
    reset: () => orchestrator.reset(),
    resetTour: (tourId) => orchestrator.resetTour(tourId),
    resetProgress: () => orchestrator.resetProgress(),
    exportProgress: () => orchestrator.exportProgress(),
    importProgress: (data, mode) => orchestrator.importProgress(data, mode),
    getEngine: (tourId) => orchestrator.getEngine(tourId),
    addSpec: (spec) => orchestrator.addSpec(spec),
    removeSpec: (tourId) => orchestrator.removeSpec(tourId),
    store: {
      subscribe(run) {
        subscribers.add(run);
        try { run(snapshot); } catch { /* a subscriber must not break the tour */ }
        return () => { subscribers.delete(run); };
      },
      getSnapshot: () => snapshot,
    },
    watchContext: (expr, fn) => orchestrator.watch(expr, fn),
    dispatch(command) {
      switch (command?.type) {
        case 'start': orchestrator.start(command.tourId, command.stepId); return true;
        case 'request': orchestrator.request(command.tourId, command.stepId); return true;
        case 'stop': orchestrator.stop('api'); return true;
        case 'next': active((e) => void e.next()); return true;
        case 'prev': active((e) => e.prev()); return true;
        case 'goTo': active((e) => e.goTo(command.stepId)); return true;
        case 'pause': orchestrator.pause(); return true;
        case 'resume': orchestrator.resume(); return true;
        case 'setContext': orchestrator.setContext(command.patch ?? {}); return true;
        case 'addSpec': orchestrator.addSpec(command.spec); return true;
        case 'removeSpec': orchestrator.removeSpec(command.tourId); return true;
        case 'reset':
          if (command.tourId) orchestrator.resetTour(command.tourId);
          else orchestrator.reset();
          return true;
        default: return false;
      }
    },
    get ready() { return orchestrator.ready; },

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
      subscribers.clear();
    },
  };
}
