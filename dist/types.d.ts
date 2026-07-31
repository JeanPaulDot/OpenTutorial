export type Placement = 'auto' | 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end' | 'center';
export type DisplayMode = 'spotlight' | 'hotspot' | 'beacon' | 'modal' | 'banner';
export type Direction = 'ltr' | 'rtl';
export interface ThemeOverrides {
    accent?: string;
    bg?: string;
    fg?: string;
    muted?: string;
    border?: string;
    success?: string;
    danger?: string;
    backdrop?: string;
    radius?: number;
    shadow?: string;
    font?: string;
    fontSize?: number;
    spacing?: number;
    arrowSize?: number;
    overlayBlur?: number;
    animationMs?: number;
    z?: number;
    spotlightRing?: string;
    popoverWidth?: number;
}
interface TriggerBase {
    /** Fire at most once ever (persisted). Default true for non-manual triggers. */
    once?: boolean;
    /** Delay in ms between the trigger firing and the tour starting. */
    delay?: number;
}
export type TourTrigger = ({
    type: 'manual';
} & TriggerBase) | ({
    type: 'auto';
} & TriggerBase) | ({
    type: 'event';
    event: string;
} & TriggerBase)
/** Fires when the current path matches. `path` supports a trailing `*` wildcard. */
 | ({
    type: 'route';
    path: string;
    exact?: boolean;
} & TriggerBase)
/** Fires when an element matching `selector` enters the DOM. */
 | ({
    type: 'element';
    selector: string;
    timeout?: number;
} & TriggerBase)
/** Fires after `ms` without pointer/key input. */
 | ({
    type: 'idle';
    ms: number;
} & TriggerBase)
/** Fires once the page has been scrolled `percent` (0-100) of the way down. */
 | ({
    type: 'scroll';
    percent: number;
} & TriggerBase);
/** How often a tour may be shown. Evaluated before a trigger is allowed to start it. */
export interface FrequencyRule {
    /** Maximum lifetime impressions. */
    max?: number;
    /** Minimum ms between two impressions. */
    cooldown?: number;
    /** Maximum impressions within the current page session. */
    perSession?: number;
}
export interface TourTarget {
    /** CSS selector, or an ordered fallback list — the first match wins. */
    selector?: string | string[];
    /** Match by visible text content instead of, or in addition to, `selector`. */
    text?: string;
    /** Pick the nth match (0-based) when the selector matches several elements. */
    index?: number;
    /** Search open shadow roots as well as the light DOM. */
    shadow?: boolean;
    /** Selector of a same-origin iframe to search inside. */
    iframe?: string;
    /** Poll/observe until the element appears rather than failing immediately. */
    waitFor?: boolean;
    /** Milliseconds to wait when `waitFor` is set. Default 5000. */
    timeout?: number;
    /** Require the element to be visible (non-zero box, not `visibility: hidden`). */
    visible?: boolean;
    scrollIntoView?: boolean;
    scrollBehavior?: 'auto' | 'smooth';
    padding?: number;
}
export type I18nContent = string | {
    key: string;
    fallback?: string;
};
export type I18nResolver = (key: string, locale: string) => string | undefined;
export type ContentBlock = {
    type: 'text';
    value: I18nContent;
} | {
    type: 'image';
    src: string;
    alt: string;
    width?: number;
    height?: number;
} | {
    type: 'video';
    src: string;
    poster?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
} | {
    type: 'list';
    items: I18nContent[];
    ordered?: boolean;
} | {
    type: 'code';
    value: string;
    lang?: string;
} | {
    type: 'divider';
}
/** Raw HTML. Ignored unless the host opts in with `allowHtml: true`. */
 | {
    type: 'html';
    value: string;
};
export type StepContent = I18nContent | {
    blocks: ContentBlock[];
};
export type AdvanceOn = 'button' | 'target-click' | 'event' | 'auto'
/** Advance when the target input's value matches `match`. */
 | 'input-match'
/** Advance when the target (or its enclosing form) is submitted. */
 | 'form-submit'
/** Advance when `watch` appears in the DOM. */
 | 'element-appears'
/** Advance when `watch` leaves the DOM. */
 | 'element-disappears'
/** Advance when `location.pathname + search` matches `urlPattern`. */
 | 'url-match';
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
} | {
    type: 'scrollTo';
    selector: string;
} | {
    type: 'wait';
    ms: number;
};
/** Conditional branch: the first rule whose `if` evaluates true wins. */
export interface NextRule {
    if: string;
    to: string;
}
export type NextSpec = string | NextRule[];
/** Per-step button label overrides. `false` hides the button. */
export interface StepButtons {
    next?: I18nContent | false;
    back?: I18nContent | false;
    skip?: I18nContent | false;
    done?: I18nContent;
}
/**
 * How much of the page the user may interact with while a step is showing.
 * - `free`      — everything stays clickable (default; matches v0.1 behaviour)
 * - `target-only` — only the highlighted element and the popover accept input
 * - `blocked`   — only the popover accepts input
 */
export type InteractionMode = 'free' | 'target-only' | 'blocked';
export interface TourStep {
    id: string;
    target?: TourTarget;
    placement?: Placement;
    display?: DisplayMode;
    title: I18nContent;
    content: StepContent;
    buttons?: StepButtons;
    advanceOn?: AdvanceOn;
    /** Event name for `advanceOn: 'event'`. */
    event?: string;
    /** Timeout in ms for `advanceOn: 'auto'` and for `display: 'beacon'`. */
    duration?: number;
    /** Expected value (or `/regex/` literal) for `advanceOn: 'input-match'`. */
    match?: string;
    /** Selector watched by `advanceOn: 'element-appears' | 'element-disappears'`. */
    watch?: string;
    /** Path pattern (trailing `*` allowed) for `advanceOn: 'url-match'`. */
    urlPattern?: string;
    interaction?: InteractionMode;
    skippable?: boolean;
    canGoBack?: boolean;
    next?: NextSpec;
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
    /** Higher wins when several tours are eligible at once. Default 0. */
    priority?: number;
    trigger?: TourTrigger;
    /** Spec-level gate, evaluated against the tour context like `showIf`. */
    audience?: {
        showIf?: string;
    };
    frequency?: FrequencyRule;
    onComplete?: {
        startTour?: string;
        emit?: string;
        navigate?: string;
    };
    theme?: ThemeOverrides;
    interaction?: InteractionMode;
    steps: TourStep[];
}
export type IssueSeverity = 'error' | 'warning';
export interface SpecIssue {
    path: string;
    message: string;
    severity: IssueSeverity;
}
/** @deprecated Use `SpecIssue`. Kept as an alias for 0.1.x compatibility. */
export type SpecError = SpecIssue;
export type ValidationResult = {
    ok: true;
    errors: never[];
    warnings: SpecIssue[];
} | {
    ok: false;
    errors: SpecIssue[];
    warnings: SpecIssue[];
};
export type TourEventType = 'started' | 'resumed' | 'step-shown' | 'step-hidden' | 'step-completed' | 'back' | 'paused' | 'unpaused' | 'skipped' | 'dismissed' | 'completed' | 'target-not-found' | 'error';
export interface TourEvent {
    type: TourEventType;
    tourId: string;
    stepId?: string;
    index?: number;
    total?: number;
    message?: string;
    /** Time in ms spent on the step this event refers to. */
    duration?: number;
    /** Why a terminal event happened: 'user' | 'escape' | 'api' | 'error' | 'navigation'. */
    reason?: string;
    /** The selector involved, on targeting events. */
    selector?: string;
    meta?: Record<string, unknown>;
    timestamp: number;
}
export type TourStatus = 'idle' | 'running' | 'paused' | 'completed' | 'skipped' | 'destroyed';
export interface TourState {
    status: TourStatus;
    currentStepId: string | null;
    index: number;
    total: number;
    paused: boolean;
    canGoBack: boolean;
    canGoNext: boolean;
}
/**
 * Minimal storage contract. `getItem` may return a promise, which lets
 * IndexedDB and remote adapters plug in without changing any caller.
 */
export interface KeyValueStorage {
    getItem(key: string): string | null | Promise<string | null>;
    setItem(key: string, value: string): void | Promise<void>;
    removeItem(key: string): void | Promise<void>;
}
export interface ProgressRecord {
    tourId: string;
    lastStepId: string;
    stepIndex: number;
    timestamp: number;
}
export type AnalyticsAdapter = (event: TourEvent) => void;
/** Everything a custom renderer needs to draw a step itself. */
export interface StepRenderContext {
    tourId: string;
    step: TourStep;
    index: number;
    total: number;
    title: string;
    /** Content normalized to blocks, with i18n already resolved. */
    blocks: ContentBlock[];
    canGoBack: boolean;
    canSkip: boolean;
    isLast: boolean;
    next: () => void;
    prev: () => void;
    skip: () => void;
    goTo: (stepId: string) => void;
}
export interface CreateTourOptions {
    context?: Record<string, unknown>;
    theme?: ThemeOverrides;
    zIndex?: number;
    onEvent?: AnalyticsAdapter;
    persistence?: {
        storage?: KeyValueStorage;
        keyPrefix?: string;
    };
    /** Namespaces persisted state so two users on one browser stay separate. */
    userId?: string;
    locale?: string;
    i18nResolver?: I18nResolver;
    dir?: Direction;
    resume?: boolean;
    progressTtl?: number;
    /** Continue a tour that was interrupted by a full page navigation. */
    autoResume?: boolean;
    /** Default interaction mode for every step. */
    interaction?: InteractionMode;
    /** Mount the overlay here instead of `document.body`. */
    container?: HTMLElement;
    /** Render the overlay inside a shadow root so host CSS cannot leak in. */
    isolate?: boolean;
    /** Permit `{ type: 'html' }` content blocks. Off by default. */
    allowHtml?: boolean;
    /** Reject specs that only produced warnings. Default false. */
    strict?: boolean;
    /** Called instead of `location.assign` for `navigate` actions — hand off to your router. */
    onNavigate?: (path: string) => void;
    /** Veto or defer advancing. Returning false keeps the current step. */
    beforeNext?: (ctx: {
        tourId: string;
        step: TourStep;
        index: number;
    }) => boolean | Promise<boolean>;
    /** Replace the built-in popover entirely. */
    renderStep?: (ctx: StepRenderContext, host: HTMLElement) => void | (() => void);
    dev?: boolean;
    /** Show the debug overlay (step, target, context, showIf results). */
    debug?: boolean;
}
export {};
