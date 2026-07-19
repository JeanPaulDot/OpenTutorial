import { TourEngine } from '../engine';
import type { CreateTourOptions, TutorialSpec, TourState } from '../types';

export interface VanillaTutorialLayer {
  start: (tourId: string, stepId?: string) => void;
  stop: () => void;
  skip: (tourId?: string) => void;
  getState: (tourId?: string) => TourState | null;
  destroy: () => void;
  setContext: (patch: Record<string, unknown>) => void;
  setTheme: (theme: Record<string, string>) => void;
  on: (event: string, handler: (e: Event) => void) => void;
  off: (event: string, handler: (e: Event) => void) => void;
}

export interface VanillaOptions extends CreateTourOptions {
  specs: TutorialSpec[];
}

export function createTutorialLayer(opts: VanillaOptions): VanillaTutorialLayer {
  const engines = new Map<string, TourEngine>();

  for (const spec of opts.specs) {
    const engine = new TourEngine(spec, {
      context: opts.context,
      theme: opts.theme,
      zIndex: opts.zIndex,
      onEvent: opts.onEvent,
      persistence: opts.persistence,
      dev: opts.dev,
    });
    engines.set(spec.id, engine);
  }

  const listeners = new Map<string, Set<(e: Event) => void>>();

  function emit(eventName: string, detail: unknown) {
    const handlers = listeners.get(eventName);
    if (!handlers) return;
    const e = new CustomEvent(eventName, { detail });
    handlers.forEach((h) => h(e));
  }

  return {
    start(tourId, stepId) {
      const engine = engines.get(tourId);
      if (!engine) return;
      engines.forEach((e, id) => {
        if (id !== tourId && e.getState().status === 'running') e.skip();
      });
      emit('tour:start', { tourId, stepId });
      void engine.start(stepId);
    },

    stop() {
      engines.forEach((e) => { if (e.getState().status === 'running') e.skip(); });
      emit('tour:stop', {});
    },

    skip(tourId) {
      if (tourId) {
        engines.get(tourId)?.skip();
        emit('tour:skip', { tourId });
      } else {
        this.stop();
      }
    },

    getState(tourId) {
      if (tourId) return engines.get(tourId)?.getState() ?? null;
      const running = Array.from(engines.values()).find((e) => e.getState().status === 'running');
      return running?.getState() ?? null;
    },

    destroy() {
      engines.forEach((e) => e.destroy());
      engines.clear();
      listeners.clear();
      emit('tour:destroy', {});
    },

    setContext(patch) {
      engines.forEach((e) => e.setContext(patch));
    },

    setTheme(theme) {
      engines.forEach((e) => e.setGlobalTheme(theme));
    },

    on(event, handler) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(handler);
      window.addEventListener(`opentutorial:${event}`, handler);
    },

    off(event, handler) {
      listeners.get(event)?.delete(handler);
      window.removeEventListener(`opentutorial:${event}`, handler);
    },
  };
}
