import { type ReactElement, type ReactNode } from 'react';
import type { TourEngine } from '../engine';
import type { PersistedRoot } from '../persist';
import type { Direction, InteractionMode, KeyValueStorage, StepRenderContext, ThemeOverrides, TourEvent, TourState, TutorialSpec, I18nResolver } from '../types';
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
    beforeNext?: (ctx: {
        tourId: string;
        step: TutorialSpec['steps'][number];
        index: number;
    }) => boolean | Promise<boolean>;
    /** Replace the built-in popover with your own component. */
    renderStep?: (ctx: StepRenderContext) => ReactNode;
    dev?: boolean;
    debug?: boolean;
    children: ReactNode;
}
export declare function TourProvider({ specs, context: initialContext, theme, zIndex, storage, keyPrefix, userId, onEvent, deepLinkParam, locale, i18nResolver, dir, resume, progressTtl, autoResume, interaction, container, isolate, allowHtml, strict, onNavigate, beforeNext, renderStep, dev, debug, children, }: TourProviderProps): import("react").JSX.Element;
export declare function useTour(): TourContextValue;
/** Subscribe to tour events without re-rendering on every state change. */
export declare function useTourEvents(handler: (e: TourEvent) => void): void;
export interface TourAnchorProps {
    id: string;
    children: ReactElement;
}
/** Tags a child with `data-tour="<id>"` so specs can target it stably. */
export declare function TourAnchor({ id, children }: TourAnchorProps): import("react").JSX.Element;
