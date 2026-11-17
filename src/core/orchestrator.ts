/**
 * Owns a set of tours and guarantees that at most one runs at a time.
 *
 * v0.1 started every eligible `auto` tour on its own timer, so two overlays
 * could mount simultaneously. Here every start request — trigger, deep link,
 * chain, or explicit API call — funnels through `request()`, which checks
 * audience and frequency rules and either starts the tour or queues it by
 * priority for when the current one ends.
 */

import { TourEngine } from './engine';
import type { PersistedRoot } from './persist';
import { installTrigger, type TriggerHandle } from './triggers';
import { evaluateExpression, evaluateShowIf } from './safeEval';
import type {
  CreateTourOptions, ThemeOverrides, TourEvent, TourState, TutorialSpec,
} from './types';

export interface OrchestratorOptions extends CreateTourOptions {
  /** URL parameter that deep-links a tour. `false` disables deep linking. */
  deepLinkParam?: string | false;
  /** Called whenever the active tour or its state changes. */
  onStateChange?: (active: string | null, state: TourState | null) => void;
}

interface QueueEntry { tourId: string; stepId?: string; priority: number }

export class TourOrchestrator {
  private engines = new Map<string, TourEngine>();
  private specs: TutorialSpec[];
  private opts: OrchestratorOptions;
  private triggers = new Map<string, TriggerHandle>();
  /**
   * The one shared context. Engines hold mirrors of it, kept in step through
   * `applyContext`, so an answer given inside one tour is visible to the
   * audience rules, triggers and branches of every other.
   */
  private context: Record<string, unknown>;
  /** `context` triggers, with the last value of each expression for edge detection. */
  private contextTriggers = new Map<string, { when: string; last: boolean; fire: () => void }>();
  private watchers = new Set<{ expr: string; last: unknown; fn: (value: unknown, previous: unknown) => void }>();
  private disposers: Array<() => void> = [];
  private queue: QueueEntry[] = [];
  private activeId: string | null = null;
  private mounted = false;
  /** Impressions in this page session, for `frequency.perSession`. */
  private sessionCounts = new Map<string, number>();

  constructor(specs: TutorialSpec[], opts: OrchestratorOptions = {}) {
    // Copied: `addSpec` / `removeSpec` must not mutate the caller's array.
    this.specs = [...specs];
    this.opts = opts;
    this.context = { ...(opts.context ?? {}) };

    for (const spec of this.specs) this.createEngine(spec);
  }

  private createEngine(spec: TutorialSpec): TourEngine {
    const engine = new TourEngine(spec, {
      ...this.opts,
      // The current shared context, not the construction-time one — a spec
      // added later must see everything set since.
      context: this.context,
      onEvent: (e) => this.handleEvent(e),
      onContextChange: (_context, patch) => this.onEngineContext(spec.id, patch),
    });
    this.engines.set(spec.id, engine);
    return engine;
  }

  // -------------------------------------------------------------------------
  // Runtime spec management
  // -------------------------------------------------------------------------

  /**
   * Register a tour after construction — one fetched from a server, built by a
   * feature flag, or generated on the fly. Replaces any tour with the same id.
   * Returns false when the spec fails validation (it is still registered, so
   * `whyBlocked` can explain why it will not run).
   */
  addSpec(spec: TutorialSpec): boolean {
    if (this.engines.has(spec.id)) this.removeSpec(spec.id);
    this.specs.push(spec);
    const engine = this.createEngine(spec);

    if (this.mounted) {
      void engine.ready.then(() => {
        if (this.mounted && this.engines.get(spec.id) === engine) this.installTriggerFor(spec);
      });
    }
    this.notifyState();
    return engine.isValid();
  }

  /** Unregister a tour, stopping it first if it is running. */
  removeSpec(tourId: string): boolean {
    const engine = this.engines.get(tourId);
    if (!engine) return false;

    const status = engine.getState().status;
    if (status === 'running' || status === 'paused') engine.skip('removed');

    this.triggers.get(tourId)?.dispose();
    this.triggers.delete(tourId);
    this.contextTriggers.delete(tourId);
    this.queue = this.queue.filter((q) => q.tourId !== tourId);
    this.sessionCounts.delete(tourId);

    engine.destroy();
    this.engines.delete(tourId);
    this.specs = this.specs.filter((s) => s.id !== tourId);
    if (this.activeId === tourId) this.activeId = null;
    this.notifyState();
    return true;
  }

  private notifyState(): void {
    const state = this.activeId ? this.engines.get(this.activeId)?.getState() ?? null : null;
    try { this.opts.onStateChange?.(this.activeId, state); } catch { /* host callback */ }
  }

  get ready(): Promise<void> {
    return Promise.all([...this.engines.values()].map((e) => e.ready)).then(() => undefined);
  }

  getEngine(tourId: string): TourEngine | undefined { return this.engines.get(tourId); }
  getEngines(): TourEngine[] { return [...this.engines.values()]; }
  getSpecs(): TutorialSpec[] { return this.specs; }
  getActiveId(): string | null { return this.activeId; }

  getState(tourId?: string): TourState | null {
    const id = tourId ?? this.activeId;
    if (!id) return null;
    return this.engines.get(id)?.getState() ?? null;
  }

  hasSeen(tourId: string): boolean { return this.engines.get(tourId)?.hasSeen() ?? false; }

  // -------------------------------------------------------------------------
  // Eligibility
  // -------------------------------------------------------------------------

  /** Why a tour may not start right now, or null if it may. */
  checkEligibility(tourId: string): string | null {
    const engine = this.engines.get(tourId);
    if (!engine) return 'unknown tour';
    if (!engine.isValid()) return 'spec failed validation';

    const spec = engine.spec;
    const context = engine.getContext();

    if (spec.audience?.showIf && !evaluateShowIf(spec.audience.showIf, context)) {
      return 'audience rule did not match';
    }

    const freq = spec.frequency;
    if (freq) {
      const record = engine.getPersistence().getRecord(spec.id);
      if (freq.max !== undefined && (record?.shownCount ?? 0) >= freq.max) {
        return `frequency: already shown ${freq.max} time(s)`;
      }
      if (freq.cooldown !== undefined && record?.lastShownAt) {
        const since = Date.now() - record.lastShownAt;
        if (since < freq.cooldown) return `frequency: cooldown active (${freq.cooldown - since}ms left)`;
      }
      if (freq.perSession !== undefined && (this.sessionCounts.get(spec.id) ?? 0) >= freq.perSession) {
        return `frequency: session limit of ${freq.perSession} reached`;
      }
    }

    return null;
  }

  // -------------------------------------------------------------------------
  // Starting
  // -------------------------------------------------------------------------

  /**
   * Ask for a tour to run. Starts it when the stage is free and the rules pass,
   * otherwise queues it. Returns true when it started immediately.
   */
  request(tourId: string, stepId?: string, opts: { force?: boolean; queue?: boolean } = {}): boolean {
    const engine = this.engines.get(tourId);
    if (!engine) return false;

    if (!opts.force) {
      const blocked = this.checkEligibility(tourId);
      if (blocked) return false;
    }

    if (this.activeId && this.activeId !== tourId) {
      if (opts.force) {
        this.engines.get(this.activeId)?.skip('preempted');
      } else if (opts.queue !== false) {
        this.enqueue(tourId, stepId, engine.spec.priority ?? 0);
        return false;
      } else {
        return false;
      }
    }

    this.sessionCounts.set(tourId, (this.sessionCounts.get(tourId) ?? 0) + 1);
    void engine.start(stepId);
    return true;
  }

  /** Start a tour immediately, preempting whatever is running. */
  start(tourId: string, stepId?: string): void {
    this.request(tourId, stepId, { force: true });
  }

  private enqueue(tourId: string, stepId: string | undefined, priority: number): void {
    if (this.queue.some((q) => q.tourId === tourId)) return;
    this.queue.push({ tourId, stepId, priority });
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  private drain(): void {
    while (this.queue.length > 0) {
      const entry = this.queue.shift();
      if (!entry) return;
      if (this.request(entry.tourId, entry.stepId, { queue: false })) return;
    }
  }

  stop(reason = 'api'): void {
    for (const engine of this.engines.values()) {
      const status = engine.getState().status;
      if (status === 'running' || status === 'paused') engine.skip(reason);
    }
    this.queue = [];
  }

  pause(): void {
    if (!this.activeId) return;
    this.engines.get(this.activeId)?.pause();
  }

  resume(): void {
    if (!this.activeId) return;
    this.engines.get(this.activeId)?.resume();
  }

  // -------------------------------------------------------------------------
  // Shared state
  // -------------------------------------------------------------------------

  setContext(patch: Record<string, unknown>): void {
    const changed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(patch)) {
      if (!Object.is(this.context[key], value)) changed[key] = value;
    }
    if (Object.keys(changed).length === 0) return;

    Object.assign(this.context, changed);
    this.engines.forEach((e) => e.applyContext(changed));
    this.afterContextChange(changed);
  }

  /** The shared tour context. */
  getContext(): Record<string, unknown> { return this.context; }

  /** A change that started inside one engine — an interactive block or an action. */
  private onEngineContext(sourceId: string, patch: Record<string, unknown>): void {
    Object.assign(this.context, patch);
    this.engines.forEach((engine, id) => { if (id !== sourceId) engine.applyContext(patch); });
    this.afterContextChange(patch);
  }

  private afterContextChange(patch: Record<string, unknown>): void {
    try { this.opts.onContextChange?.(this.context, patch); } catch { /* host callback */ }

    for (const watcher of this.watchers) {
      const value = evaluateExpression(watcher.expr, this.context);
      if (Object.is(value, watcher.last)) continue;
      const previous = watcher.last;
      watcher.last = value;
      try { watcher.fn(value, previous); } catch { /* a watcher must not break the tour */ }
    }

    // Edge-triggered: fire on false → true only. A level-triggered version
    // would restart the tour on every unrelated context change while it held.
    for (const entry of this.contextTriggers.values()) {
      const now = evaluateShowIf(entry.when, this.context);
      const rose = now && !entry.last;
      entry.last = now;
      if (rose) entry.fire();
    }
  }

  /**
   * Observe an expression over the context. `fn` runs whenever its value
   * changes — `watch("cart.length", n => badge.update(n))`. Returns an
   * unsubscribe function.
   */
  watch(expr: string, fn: (value: unknown, previous: unknown) => void): () => void {
    const watcher = { expr, last: evaluateExpression(expr, this.context), fn };
    this.watchers.add(watcher);
    return () => { this.watchers.delete(watcher); };
  }

  setTheme(theme: ThemeOverrides): void {
    this.engines.forEach((e) => e.setGlobalTheme(theme));
  }

  setLocale(locale: string): void {
    this.opts = { ...this.opts, locale };
    this.engines.forEach((e) => e.setLocale(locale));
  }

  async setUser(userId: string | undefined): Promise<void> {
    this.sessionCounts.clear();
    await Promise.all([...this.engines.values()].map((e) => e.setUser(userId)));
  }

  /** Clear seen-state and progress for every tour. */
  reset(): void {
    this.sessionCounts.clear();
    // One shared store: resetting through any engine clears them all.
    this.engines.values().next().value?.resetAll();
  }

  resetProgress(): void {
    this.engines.forEach((e) => e.resetProgress());
  }

  resetTour(tourId: string): void {
    this.sessionCounts.delete(tourId);
    this.engines.get(tourId)?.resetSeen();
  }

  /** Snapshot persisted state for every tour. See `TourEngine.exportProgress`. */
  exportProgress(): PersistedRoot | null {
    return this.engines.values().next().value?.exportProgress() ?? null;
  }

  /** Restore a snapshot. All engines share one store, so one call covers them all. */
  importProgress(data: PersistedRoot | string, mode: 'replace' | 'merge' = 'replace'): boolean {
    return this.engines.values().next().value?.importProgress(data, mode) ?? false;
  }

  // -------------------------------------------------------------------------
  // Mounting
  // -------------------------------------------------------------------------

  /** Install triggers, deep-link handling, chaining and cross-page resume. */
  mount(): void {
    if (this.mounted) return;
    this.mounted = true;

    void this.ready.then(() => {
      if (!this.mounted) return;
      this.installChainListener();
      this.installDeepLink();
      this.installAutoResume();
      this.installTriggers();
    });
  }

  private installTriggers(): void {
    for (const spec of this.specs) this.installTriggerFor(spec);
  }

  private installTriggerFor(spec: TutorialSpec): void {
    const engine = this.engines.get(spec.id);
    if (!engine || !engine.isValid()) return;
    const trigger = spec.trigger;
    if (!trigger || trigger.type === 'manual') return;

    const once = trigger.once ?? true;
    // `once` is persisted seen-state, not just a per-page flag.
    if (once && engine.hasSeen()) return;

    const start = (): void => {
      if (once && engine.hasSeen()) return;
      this.request(spec.id);
    };

    if (trigger.type === 'context') {
      // Lives here rather than in `installTrigger`: only the orchestrator
      // knows when the context changed.
      let timer = 0;
      const fire = (): void => {
        window.clearTimeout(timer);
        if (trigger.delay && trigger.delay > 0) timer = window.setTimeout(start, trigger.delay);
        else start();
      };
      const last = evaluateShowIf(trigger.when, this.context);
      this.contextTriggers.set(spec.id, { when: trigger.when, last, fire });
      this.triggers.set(spec.id, { dispose: () => window.clearTimeout(timer) });
      // Already true at mount counts as "became true".
      if (last) fire();
      return;
    }

    this.triggers.set(spec.id, installTrigger(trigger, start));
  }

  private installDeepLink(): void {
    const param = this.opts.deepLinkParam ?? 'tour';
    if (param === false) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get(param);
      if (!id || !this.engines.has(id)) return;
      const stepId = params.get(`${param}Step`) ?? undefined;
      // A deep link is an explicit user intent, so it bypasses frequency rules.
      const timer = window.setTimeout(() => this.request(id, stepId, { force: true }), 400);
      this.disposers.push(() => window.clearTimeout(timer));
    } catch { /* malformed URL */ }
  }

  private installAutoResume(): void {
    if (!this.opts.autoResume) return;
    const first = this.engines.values().next().value;
    if (!first) return;
    const active = first.getPersistence().getActive();
    if (!active || !this.engines.has(active.tourId)) return;
    const timer = window.setTimeout(() => this.request(active.tourId, active.stepId, { force: true }), 200);
    this.disposers.push(() => window.clearTimeout(timer));
  }

  private installChainListener(): void {
    const handler = (e: Event): void => {
      const detail = (e as CustomEvent<{ from: string; to: string }>).detail;
      if (!detail?.to || !this.engines.has(detail.to)) return;
      // Queued rather than started inline: the finishing engine is still tearing
      // its DOM down when it announces the chain.
      window.setTimeout(() => this.request(detail.to, undefined, { force: true }), 0);
    };
    window.addEventListener('opentutorial:chain', handler);
    this.disposers.push(() => window.removeEventListener('opentutorial:chain', handler));
  }

  private handleEvent(e: TourEvent): void {
    if (e.type === 'started' || e.type === 'resumed') {
      this.activeId = e.tourId;
    }
    if (e.type === 'completed' || e.type === 'skipped') {
      if (this.activeId === e.tourId) this.activeId = null;
    }

    try { this.opts.onEvent?.(e); } catch { /* host listener errors are not ours */ }

    const state = this.activeId ? this.engines.get(this.activeId)?.getState() ?? null : null;
    try { this.opts.onStateChange?.(this.activeId, state); } catch { /* noop */ }

    if ((e.type === 'completed' || e.type === 'skipped') && this.queue.length > 0) {
      window.setTimeout(() => this.drain(), 0);
    }
  }

  destroy(): void {
    this.mounted = false;
    this.triggers.forEach((t) => t.dispose());
    this.disposers.forEach((d) => { try { d(); } catch { /* noop */ } });
    this.triggers.clear();
    this.contextTriggers.clear();
    this.watchers.clear();
    this.disposers = [];
    this.queue = [];
    this.engines.forEach((e) => e.destroy());
    this.activeId = null;
  }
}
