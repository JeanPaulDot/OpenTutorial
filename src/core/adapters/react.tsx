import {
  createContext,
  isValidElement,
  cloneElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { TourEngine } from '../engine';
import type {
  KeyValueStorage,
  ThemeOverrides,
  TourEvent,
  TourState,
  TutorialSpec,
  I18nResolver,
} from '../types';

export interface TourContextValue {
  start: (tourId: string, stepId?: string) => void;
  stop: () => void;
  activeId: string | null;
  state: TourState | null;
  events: TourEvent[];
  clearEvents: () => void;
  context: Record<string, unknown>;
  setContext: (patch: Record<string, unknown>) => void;
  setTheme: (theme: ThemeOverrides) => void;
  resetTours: () => void;
  resetProgress: () => void;
  hasSeen: (tourId: string) => boolean;
  specs: TutorialSpec[];
}

const TourContext = createContext<TourContextValue | null>(null);

export interface TourProviderProps {
  specs: TutorialSpec[];
  context?: Record<string, unknown>;
  theme?: ThemeOverrides;
  zIndex?: number;
  storage?: KeyValueStorage;
  onEvent?: (e: TourEvent) => void;
  deepLinkParam?: string | false;
  locale?: string;
  i18nResolver?: I18nResolver;
  resume?: boolean;
  progressTtl?: number;
  children: ReactNode;
}

export function TourProvider({
  specs,
  context: initialContext,
  theme,
  zIndex,
  storage,
  onEvent,
  deepLinkParam = 'tour',
  locale,
  i18nResolver,
  resume,
  progressTtl,
  children,
}: TourProviderProps) {
  const [events, setEvents] = useState<TourEvent[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [state, setState] = useState<TourState | null>(null);
  const [context, setContextState] = useState<Record<string, unknown>>(initialContext ?? {});
  const contextRef = useRef(context);
  const themeRef = useRef(theme);
  const enginesRef = useRef<Map<string, TourEngine> | null>(null);

  if (!enginesRef.current) {
    const handleEvent = (e: TourEvent) => {
      setEvents((prev) => [...prev.slice(-99), e]);
      onEvent?.(e);
      if (e.type === 'started') setActiveId(e.tourId);
      if (e.type === 'completed' || e.type === 'skipped') setActiveId((cur) => (cur === e.tourId ? null : cur));
      const eng = enginesRef.current?.get(e.tourId);
      if (eng) setState(eng.getState());
    };
    enginesRef.current = new Map(
      specs.map((s) => [
        s.id,
        new TourEngine(s, {
          context: contextRef.current,
          theme: themeRef.current,
          zIndex,
          onEvent: handleEvent,
          persistence: { storage },
          locale,
          i18nResolver,
          resume,
          progressTtl,
        }),
      ]),
    );
  }
  const engines = enginesRef.current;

  useEffect(() => {
    contextRef.current = context;
    engines.forEach((e) => e.setContext(context));
  }, [context, engines]);

  useEffect(() => {
    const timers: number[] = [];
    const listeners: Array<() => void> = [];
    specs.forEach((s) => {
      const t = s.trigger;
      if (!t || t.type === 'manual') return;
      const engine = engines.get(s.id);
      if (!engine || !engine.isValid()) return;
      const once = t.once ?? true;
      if (once && engine.hasSeen()) return;

      if (t.type === 'auto') {
        timers.push(window.setTimeout(() => void engine.start(), t.delay ?? 0));
      } else if (t.type === 'event' && t.event) {
        const handler = () => void engine.start();
        window.addEventListener(t.event, handler, { once });
        listeners.push(() => window.removeEventListener(t.event as string, handler));
      }
    });
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      listeners.forEach((off) => off());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (deepLinkParam === false) return;
    try {
      const id = new URLSearchParams(window.location.search).get(deepLinkParam);
      if (!id) return;
      const engine = engines.get(id);
      if (engine) {
        const t = window.setTimeout(() => void engine.start(), 400);
        return () => window.clearTimeout(t);
      }
    } catch { /* noop */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => engines.forEach((e) => { if (e.getState().status === 'running') e.skip(); }),
    [engines],
  );

  const value = useMemo<TourContextValue>(() => ({
    start: (tourId, stepId) => {
      const engine = engines.get(tourId);
      if (!engine) return;
      engines.forEach((e, id) => {
        if (id !== tourId && e.getState().status === 'running') e.skip();
      });
      void engine.start(stepId);
    },
    stop: () => engines.forEach((e) => { if (e.getState().status === 'running') e.skip(); }),
    activeId,
    state,
    events,
    clearEvents: () => setEvents([]),
    context,
    setContext: (patch) => setContextState((prev) => ({ ...prev, ...patch })),
    setTheme: (t) => {
      themeRef.current = t;
      engines.forEach((e) => e.setGlobalTheme(t));
    },
    resetTours: () => engines.forEach((e) => e.resetSeen()),
    resetProgress: () => engines.forEach((e) => e.resetProgress()),
    hasSeen: (tourId) => engines.get(tourId)?.hasSeen() ?? false,
    specs,
  }), [engines, specs, activeId, state, events, context]);

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used inside <TourProvider>');
  return ctx;
}

export interface TourAnchorProps {
  id: string;
  children: ReactElement;
}

export function TourAnchor({ id, children }: TourAnchorProps) {
  if (isValidElement(children)) {
    return cloneElement(children, { 'data-tour': id } as Record<string, unknown>);
  }
  return <span data-tour={id}>{children}</span>;
}
