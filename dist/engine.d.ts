import { TourPersistence, type PersistedRoot } from './persist';
import type { CreateTourOptions, SpecIssue, ThemeOverrides, TourState, TutorialSpec } from './types';
export declare class TourEngine {
    readonly spec: TutorialSpec;
    readonly errors: SpecIssue[];
    readonly warnings: SpecIssue[];
    private opts;
    private persistence;
    private context;
    private layer;
    private popover;
    private hotspot;
    private customHost;
    private releaseFocus;
    private cleanupAdvance;
    private cleanupTrack;
    private cleanupRender;
    private appliedVars;
    private status;
    private currentId;
    private history;
    private resolved;
    private runToken;
    private transitions;
    private stepEnteredAt;
    private startedAt;
    private advancing;
    private sampleDecision;
    /** A custom `renderIndicator` surface is showing instead of the hotspot. */
    private indicatorActive;
    constructor(spec: TutorialSpec, opts?: CreateTourOptions);
    /** Resolves once persisted state has been read (matters for async storage). */
    get ready(): Promise<void>;
    getState(): TourState;
    /** False while the step's `nextWhen` condition is unmet. */
    private canAdvance;
    isValid(): boolean;
    hasSeen(): boolean;
    getPersistence(): TourPersistence;
    resetSeen(): void;
    /** Clears seen-state and progress for every tour sharing this storage. */
    resetAll(): void;
    resetProgress(): void;
    /**
     * Snapshot every persisted record — seen state, resume progress, and the
     * in-flight tour — as plain JSON. Storage is shared across the tours built
     * from one options object, so this covers all of them, not just this spec.
     */
    exportProgress(): PersistedRoot;
    /**
     * Restore a snapshot from `exportProgress()`. `merge` keeps whichever record
     * is newer per tour, which is what you want when reconciling a server copy
     * with local activity; `replace` overwrites wholesale. Returns false when the
     * payload cannot be parsed, leaving existing state untouched.
     */
    importProgress(data: PersistedRoot | string, mode?: 'replace' | 'merge'): boolean;
    setUser(userId: string | undefined): Promise<void>;
    getContext(): Record<string, unknown>;
    setContext(patch: Record<string, unknown>): void;
    /**
     * Apply a patch that originated in another engine. Same reactive refresh as
     * `setContext`, but without firing `onContextChange` — the orchestrator uses
     * this to mirror one tour's answers into the others without an echo.
     */
    applyContext(patch: Record<string, unknown>): void;
    private patchContext;
    /**
     * Bring the visible step in line with a context change.
     *
     * Three things can be stale: the Next button (`nextWhen`), the step count
     * (a later step appeared or vanished), and interpolated copy (`{{name}}`).
     * The body is only rebuilt when it has to be, and never while the user is
     * typing in it — replacing the field under the caret would eat keystrokes.
     */
    private refreshReactive;
    setGlobalTheme(theme: ThemeOverrides): void;
    setLocale(locale: string): void;
    start(stepId?: string): Promise<void>;
    private resolveResumeStep;
    next(): Promise<void>;
    /** `force` skips the `nextWhen` gate — for steps leaving on their own account. */
    private advance;
    private resolveNextId;
    prev(): void;
    goTo(stepId: string): void;
    /** Hide the tour but remember where the user was. `resume()` picks it back up. */
    pause(): void;
    resume(): void;
    skip(reason?: string): void;
    complete(reason?: string): void;
    destroy(): void;
    private visibleSteps;
    private currentStep;
    private stepDuration;
    private text;
    private blocks;
    private interactionFor;
    private buildDom;
    private teardownDom;
    private finish;
    private runOnComplete;
    private goToInternal;
    private showStep;
    private showIndicator;
    private renderStep;
    /** Shared by `renderStep` and `renderIndicator`. */
    private renderContext;
    /** Undo what `showIndicator` did to the shared custom host. */
    private resetIndicatorHost;
    private interactiveHandlers;
    private runBlockAction;
    /** Jump back to an already-visited step from its progress dot. */
    private jumpTo;
    private rerenderCurrent;
    private makeModel;
    /** Step overrides spec, which overrides the global option. */
    private densityFor;
    /** Element rect mapped into the top-level viewport (adds the iframe offset). */
    private viewportRect;
    private reposition;
    private mergedRadius;
    private startTracking;
    private wireAdvance;
    private navigate;
    private runActions;
    private applyThemeChain;
    private emit;
    /** Cached per engine: one hash per tour, not one per event. */
    private sampled;
}
