export type Placement = 'auto' | 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';
export type DisplayMode = 'spotlight' | 'hotspot' | 'beacon';
export interface ThemeOverrides {
    accent?: string;
    bg?: string;
    fg?: string;
    muted?: string;
    backdrop?: string;
    radius?: number;
    shadow?: string;
    font?: string;
    z?: number;
    spotlightRing?: string;
    popoverWidth?: number;
}
export interface TourTrigger {
    type: 'manual' | 'auto' | 'event';
    event?: string;
    once?: boolean;
    delay?: number;
}
export interface TourTarget {
    selector: string;
    waitFor?: boolean;
    timeout?: number;
    scrollIntoView?: boolean;
    padding?: number;
}
export type AdvanceOn = 'button' | 'target-click' | 'event' | 'auto';
export type StepAction = {
    type: 'emit';
    name: string;
    detail?: unknown;
} | {
    type: 'click';
} | {
    type: 'focus';
} | {
    type: 'navigate';
    path: string;
} | {
    type: 'setContext';
    key: string;
    value: unknown;
};
export type I18nContent = string | {
    key: string;
    fallback?: string;
};
export type I18nResolver = (key: string, locale: string) => string | undefined;
export interface TourStep {
    id: string;
    target?: TourTarget;
    placement?: Placement;
    display?: DisplayMode;
    title: I18nContent;
    content: I18nContent;
    advanceOn?: AdvanceOn;
    event?: string;
    duration?: number;
    skippable?: boolean;
    canGoBack?: boolean;
    next?: string;
    showIf?: string;
    theme?: ThemeOverrides;
    onEnter?: StepAction[];
    onExit?: StepAction[];
}
export interface TutorialSpec {
    specVersion: 1;
    id: string;
    title: I18nContent;
    description?: I18nContent;
    version?: string;
    trigger?: TourTrigger;
    theme?: ThemeOverrides;
    steps: TourStep[];
}
export interface SpecError {
    path: string;
    message: string;
}
export type ValidationResult = {
    ok: true;
} | {
    ok: false;
    errors: SpecError[];
};
export type TourEventType = 'started' | 'step-shown' | 'step-hidden' | 'skipped' | 'completed' | 'error';
export interface TourEvent {
    type: TourEventType;
    tourId: string;
    stepId?: string;
    index?: number;
    total?: number;
    message?: string;
    timestamp: number;
}
export type TourStatus = 'idle' | 'running' | 'completed' | 'skipped' | 'destroyed';
export interface TourState {
    status: TourStatus;
    currentStepId: string | null;
    index: number;
    total: number;
}
export interface KeyValueStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}
export interface ProgressRecord {
    tourId: string;
    lastStepId: string;
    stepIndex: number;
    timestamp: number;
}
export type AnalyticsAdapter = (event: TourEvent) => void;
export interface CreateTourOptions {
    context?: Record<string, unknown>;
    theme?: ThemeOverrides;
    zIndex?: number;
    onEvent?: AnalyticsAdapter;
    persistence?: {
        storage?: KeyValueStorage;
        keyPrefix?: string;
    };
    locale?: string;
    i18nResolver?: I18nResolver;
    resume?: boolean;
    progressTtl?: number;
    dev?: boolean;
}
