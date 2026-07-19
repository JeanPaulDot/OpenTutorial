import { type ReactElement, type ReactNode } from 'react';
import type { KeyValueStorage, ThemeOverrides, TourEvent, TourState, TutorialSpec, I18nResolver } from '../types';
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
export declare function TourProvider({ specs, context: initialContext, theme, zIndex, storage, onEvent, deepLinkParam, locale, i18nResolver, resume, progressTtl, children, }: TourProviderProps): import("react").JSX.Element;
export declare function useTour(): TourContextValue;
export interface TourAnchorProps {
    id: string;
    children: ReactElement;
}
export declare function TourAnchor({ id, children }: TourAnchorProps): import("react").JSX.Element;
