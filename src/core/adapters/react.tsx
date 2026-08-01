'use client';

import {
  createContext,
  isValidElement,
  cloneElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { TourOrchestrator } from '../orchestrator';
import type { TourEngine } from '../engine';
import type { PersistedRoot } from '../persist';
import type {
  Direction, InteractionMode, KeyValueStorage, StepRenderContext, ThemeOverrides,
  TourEvent, TourState, TutorialSpec, I18nResolver,
} from '../types';

export interface TourContextValue {
  /** Start a tour, preempting anything already running. */
  start: (tourId: string, stepId?: string) => void;
  /** Ask for a tour, honouring audience/frequency rules and the queue. */
  request: (tourId: string, stepId?: string) => boolean;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  goTo: (stepId: string) => void;
  activeId: string | null;
  state: TourState | null;
  events: TourEvent[];
  clearEvents: () => void;
  context: Record<string, unknown>;
  setContext: (patch: Record<string, unknown>) => void;
  setTheme: (theme: ThemeOverrides) => void;
  setUser: (userId: string | undefined) => Promise<void>;
  resetTours: () => void;
  resetTour: (tourId: string) => void;
  resetProgress: () => void;
  /** Snapshot persisted state for backup or server sync. */
  exportProgress: () => PersistedRoot | null;
  /** Restore a snapshot from `exportProgress()`. */
  importProgress: (data: PersistedRoot | string, mode?: 'replace' | 'merge') => boolean;
  hasSeen: (tourId: string) => boolean;
  /** Null when the tour may start; otherwise the reason it may not. */
  whyBlocked: (tourId: string) => string | null;
  getEngine: (tourId: string) => TourEngine | undefined;
  specs: TutorialSpec[];
}

const TourContext = createContext<TourContextValue | null>(null);

export interface TourProviderProps {
  specs: TutorialSpec[];
  context?: Record<string, unknown>;
  theme?: ThemeOverrides;
  zIndex?: number;
  storage?: KeyValueStorage;
  keyPrefix?: string;
  userId?: string;
  onEvent?: (e: TourEvent) => void;
  deepLinkParam?: string | false;
  locale?: string;
  i18nResolver?: I18nResolver;
  dir?: Direction;
  resume?: boolean;
  progressTtl?: number;
  autoResume?: boolean;
  interaction?: InteractionMode;
  container?: HTMLElement;
  isolate?: boolean;
  allowHtml?: boolean;
  strict?: boolean;
  onNavigate?: (path: string) => void;
  beforeNext?: (ctx: { tourId: string; step: TutorialSpec['steps'][number]; index: number }) => boolean | Promise<boolean>;
  /** Replace the built-in popover with your own component. */
  renderStep?: (ctx: StepRenderContext) => ReactNode;
  dev?: boolean;
  debug?: boolean;
  children: ReactNode;
}

interface CustomRender { ctx: StepRenderContext; host: HTMLElement }

export function TourProvider({
  specs,
  context: initialContext,
  theme,
  zIndex,
  storage,
  keyPrefix,
  userId,
  onEvent,
  deepLinkParam = 'tour',
  locale,
  i18nResolver,
  dir,
  resume,
  progressTtl,
  autoResume,
  interaction,
  container,
  isolate,
  allowHtml,
  strict,
  onNavigate,
  beforeNext,
  renderStep,
  dev,
  debug,
  children,
}: TourProviderProps) {
  const [events, setEvents] = useState<TourEvent[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [state, setState] = useState<TourState | null>(null);
  const [context, setContextState] = useState<Record<string, unknown>>(initialContext ?? {});
  const [custom, setCustom] = useState<CustomRender | null>(null);

  // Callbacks are read through refs so changing a handler never rebuilds the
  // orchestrator — which would tear down a running tour mid-step.
  const onEventRef = useRef(onEvent);
  const beforeNextRef = useRef(beforeNext);
  const onNavigateRef = useRef(onNavigate);
  const renderStepRef = useRef(renderStep);
  onEventRef.current = onEvent;
  beforeNextRef.current = beforeNext;
  onNavigateRef.current = onNavigate;
  renderStepRef.current = renderStep;

  const orchestratorRef = useRef<TourOrchestrator | null>(null);

  if (!orchestratorRef.current) {
    orchestratorRef.current = new TourOrchestrator(specs, {
      context: initialContext,
      theme,
      zIndex,
      persistence: { storage, keyPrefix },
      userId,
      locale,
      i18nResolver,
      dir,
      resume,
      progressTtl,
      autoResume,
      interaction,
      container,
      isolate,
      allowHtml,
      strict,
      deepLinkParam,
      dev,
      debug,
      onNavigate: (path) => onNavigateRef.current?.(path),
      beforeNext: beforeNextRef.current
        ? (ctx) => beforeNextRef.current!(ctx)
        : undefined,
      renderStep: renderStepRef.current
        ? (ctx, host) => {
            setCustom({ ctx, host });
            return () => setCustom(null);
          }
        : undefined,
      onEvent: (e) => {
        setEvents((prev) => [...prev.slice(-99), e]);
        onEventRef.current?.(e);
      },
      onStateChange: (id, s) => {
        setActiveId(id);
        setState(s);
      },
    });
  }

  const orchestrator = orchestratorRef.current;

  useEffect(() => {
    orchestrator.mount();
    return () => {
      orchestrator.destroy();
      orchestratorRef.current = null;
    };
  }, [orchestrator]);

  useEffect(() => {
    orchestrator.setContext(context);
  }, [context, orchestrator]);

  useEffect(() => {
    if (theme) orchestrator.setTheme(theme);
  }, [theme, orchestrator]);

  useEffect(() => {
    if (locale) orchestrator.setLocale(locale);
  }, [locale, orchestrator]);

  useEffect(() => {
    void orchestrator.setUser(userId);
  }, [userId, orchestrator]);

  const runOnActive = useCallback(
    (fn: (engine: TourEngine) => void) => {
      const id = orchestrator.getActiveId();
      if (!id) return;
      const engine = orchestrator.getEngine(id);
      if (engine) fn(engine);
    },
    [orchestrator],
  );

  const value = useMemo<TourContextValue>(() => ({
    start: (tourId, stepId) => orchestrator.start(tourId, stepId),
    request: (tourId, stepId) => orchestrator.request(tourId, stepId),
    stop: () => orchestrator.stop('api'),
    pause: () => orchestrator.pause(),
    resume: () => orchestrator.resume(),
    next: () => runOnActive((e) => void e.next()),
    prev: () => runOnActive((e) => e.prev()),
    goTo: (stepId) => runOnActive((e) => e.goTo(stepId)),
    activeId,
    state,
    events,
    clearEvents: () => setEvents([]),
    context,
    setContext: (patch) => setContextState((prev) => ({ ...prev, ...patch })),
    setTheme: (t) => orchestrator.setTheme(t),
    setUser: (id) => orchestrator.setUser(id),
    resetTours: () => orchestrator.reset(),
    resetTour: (tourId) => orchestrator.resetTour(tourId),
    resetProgress: () => orchestrator.resetProgress(),
    exportProgress: () => orchestrator.exportProgress(),
    importProgress: (data, mode) => orchestrator.importProgress(data, mode),
    hasSeen: (tourId) => orchestrator.hasSeen(tourId),
    whyBlocked: (tourId) => orchestrator.checkEligibility(tourId),
    getEngine: (tourId) => orchestrator.getEngine(tourId),
    specs,
  }), [orchestrator, specs, activeId, state, events, context, runOnActive]);

  return (
    <TourContext.Provider value={value}>
      {children}
      {custom && renderStep ? createPortal(renderStep(custom.ctx), custom.host) : null}
    </TourContext.Provider>
  );
}

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used inside <TourProvider>');
  return ctx;
}

/** Subscribe to tour events without re-rendering on every state change. */
export function useTourEvents(handler: (e: TourEvent) => void): void {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    const listener = (e: Event): void => {
      const detail = (e as CustomEvent<TourEvent>).detail;
      if (detail) ref.current(detail);
    };
    window.addEventListener('opentutorial', listener);
    return () => window.removeEventListener('opentutorial', listener);
  }, []);
}

export interface TourAnchorProps {
  id: string;
  children: ReactElement;
}

/** Tags a child with `data-tour="<id>"` so specs can target it stably. */
export function TourAnchor({ id, children }: TourAnchorProps) {
  if (isValidElement(children)) {
    return cloneElement(children, { 'data-tour': id } as Record<string, unknown>);
  }
  return <span data-tour={id}>{children}</span>;
}
