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

import { createTutorialLayer, type VanillaOptions, type VanillaTutorialLayer } from './vanilla';
import type { TourEvent, TourState } from '../types';

/** Minimal `Observable`-compatible surface — works with `toSignal`/`async` pipe. */
export interface TourObservable<T> {
  subscribe: (observer: ((value: T) => void) | { next?: (value: T) => void }) => {
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
export class OpenTutorialService {
  readonly layer: VanillaTutorialLayer;

  private snapshotValue: TourSnapshot = { activeId: null, state: null };
  private watchers = new Set<(value: TourSnapshot) => void>();

  constructor(options: VanillaOptions) {
    this.layer = createTutorialLayer({
      ...options,
      onStateChange: (activeId, state) => {
        this.snapshotValue = { activeId, state };
        for (const watcher of this.watchers) {
          try { watcher(this.snapshotValue); } catch { /* a subscriber must not break the tour */ }
        }
        options.onStateChange?.(activeId, state);
      },
    });
  }

  // --- Delegated tour API -------------------------------------------------

  start(tourId: string, stepId?: string): void { this.layer.start(tourId, stepId); }
  request(tourId: string, stepId?: string): boolean { return this.layer.request(tourId, stepId); }
  stop(): void { this.layer.stop(); }
  pause(): void { this.layer.pause(); }
  resume(): void { this.layer.resume(); }
  next(): void { this.layer.next(); }
  prev(): void { this.layer.prev(); }
  goTo(stepId: string): void { this.layer.goTo(stepId); }
  hasSeen(tourId: string): boolean { return this.layer.hasSeen(tourId); }
  whyBlocked(tourId: string): string | null { return this.layer.whyBlocked(tourId); }
  setContext(patch: Record<string, unknown>): void { this.layer.setContext(patch); }
  setUser(userId: string | undefined): Promise<void> { return this.layer.setUser(userId); }

  /** Current active tour and state, for a one-off read. */
  snapshot(): TourSnapshot { return this.snapshotValue; }

  /**
   * State as an `Observable`-shaped object.
   *
   * ```ts
   * state = toSignal(this.tours.state$, { initialValue: this.tours.snapshot() });
   * ```
   */
  get state$(): TourObservable<TourSnapshot> {
    return {
      subscribe: (observer) => {
        const next = typeof observer === 'function' ? observer : observer.next?.bind(observer);
        if (next) { this.watchers.add(next); next(this.snapshotValue); }
        return {
          unsubscribe: () => { if (next) this.watchers.delete(next); },
        };
      },
    };
  }

  /** Every tour event, in the same `Observable` shape. */
  get events$(): TourObservable<TourEvent> {
    return {
      subscribe: (observer) => {
        const next = typeof observer === 'function' ? observer : observer.next?.bind(observer);
        const off = next ? this.layer.on('event', next) : () => undefined;
        return { unsubscribe: off };
      },
    };
  }

  /** Angular calls this when the providing injector is destroyed. */
  ngOnDestroy(): void {
    this.watchers.clear();
    this.layer.destroy();
  }
}

/** Shape of an Angular factory provider, without importing Angular's types. */
export interface TourProvider {
  provide: typeof OpenTutorialService;
  useFactory: () => OpenTutorialService;
}

export function provideOpenTutorial(options: VanillaOptions): TourProvider {
  return {
    provide: OpenTutorialService,
    useFactory: () => new OpenTutorialService(options),
  };
}
