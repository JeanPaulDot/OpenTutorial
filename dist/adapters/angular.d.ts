/**
 * Angular adapter.
 *
 * `@angular/core` is deliberately *not* imported. A decorator like `@Injectable`
 * would drag Angular into `dependencies` and pin a major version, so this ships
 * a plain class instead and you register it with a factory provider — which
 * works identically in every Angular version that supports standalone providers.
 *
 * ```ts
 * // app.config.ts
 * import { provideOpenTutorial } from '@opentutorial/core/angular';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideOpenTutorial({ specs, context: { plan: 'pro' } })],
 * };
 *
 * // any component
 * import { inject } from '@angular/core';
 * import { OpenTutorialService } from '@opentutorial/core/angular';
 *
 * export class HomeComponent {
 *   private tours = inject(OpenTutorialService);
 *   startTour() { this.tours.start('welcome'); }
 * }
 * ```
 *
 * `OpenTutorialService` is used as its own DI token, so no `InjectionToken`
 * import is needed on your side either.
 */
import { type VanillaOptions, type VanillaTutorialLayer } from './vanilla';
import type { TourEvent, TourState } from '../types';
/** Minimal `Observable`-compatible surface — works with `toSignal`/`async` pipe. */
export interface TourObservable<T> {
    subscribe: (observer: ((value: T) => void) | {
        next?: (value: T) => void;
    }) => {
        unsubscribe: () => void;
    };
}
export interface TourSnapshot {
    activeId: string | null;
    state: TourState | null;
}
/**
 * Injectable-shaped wrapper around the tour layer.
 *
 * Implements Angular's `OnDestroy` structurally, so Angular tears the layer
 * down with the injector that created it.
 */
export declare class OpenTutorialService {
    readonly layer: VanillaTutorialLayer;
    private snapshotValue;
    private watchers;
    constructor(options: VanillaOptions);
    start(tourId: string, stepId?: string): void;
    request(tourId: string, stepId?: string): boolean;
    stop(): void;
    pause(): void;
    resume(): void;
    next(): void;
    prev(): void;
    goTo(stepId: string): void;
    hasSeen(tourId: string): boolean;
    whyBlocked(tourId: string): string | null;
    setContext(patch: Record<string, unknown>): void;
    setUser(userId: string | undefined): Promise<void>;
    /** Current active tour and state, for a one-off read. */
    snapshot(): TourSnapshot;
    /**
     * State as an `Observable`-shaped object.
     *
     * ```ts
     * state = toSignal(this.tours.state$, { initialValue: this.tours.snapshot() });
     * ```
     */
    get state$(): TourObservable<TourSnapshot>;
    /** Every tour event, in the same `Observable` shape. */
    get events$(): TourObservable<TourEvent>;
    /** Angular calls this when the providing injector is destroyed. */
    ngOnDestroy(): void;
}
/** Shape of an Angular factory provider, without importing Angular's types. */
export interface TourProvider {
    provide: typeof OpenTutorialService;
    useFactory: () => OpenTutorialService;
}
export declare function provideOpenTutorial(options: VanillaOptions): TourProvider;
