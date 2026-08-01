import { TourLayer } from './dom/layer';
import { TourPopover, type PopoverModel } from './dom/popover';
import { TourHotspot } from './dom/hotspot';
import { trapFocus } from './dom/focus';
import { resolveTarget, waitForTarget, describeTarget, type ResolvedTarget } from './dom/target';
import { currentPath, matchPath, onLocationChange } from './dom/navigation';
import { TourPersistence, type PersistedRoot } from './persist';
import { validateSpec } from './schema';
import { evaluateShowIf } from './safeEval';
import { resolveText, resolveLabel } from './i18n';
import { normalizeContent, blocksToText } from './content';
import type {
  ContentBlock, CreateTourOptions, InteractionMode, SpecIssue, StepAction, StepRenderContext,
  ThemeOverrides, TourEvent, TourEventType, TourState, TourStatus, TourStep, TutorialSpec,
  I18nContent, StepContent,
} from './types';

const THEME_VAR_MAP: Record<keyof ThemeOverrides, string> = {
  accent: '--ot-accent',
  bg: '--ot-bg',
  fg: '--ot-fg',
  muted: '--ot-muted',
  border: '--ot-border',
  success: '--ot-success',
  danger: '--ot-danger',
  backdrop: '--ot-backdrop',
  radius: '--ot-radius',
  shadow: '--ot-shadow',
  font: '--ot-font',
  fontSize: '--ot-font-size',
  spacing: '--ot-spacing',
  arrowSize: '--ot-arrow-size',
  overlayBlur: '--ot-overlay-blur',
  animationMs: '--ot-anim-ms',
  z: '--ot-z',
  spotlightRing: '--ot-spotlight-ring',
  popoverWidth: '--ot-popover-width',
};

const PX_KEYS = new Set(['radius', 'popoverWidth', 'fontSize', 'spacing', 'arrowSize', 'overlayBlur']);
const MS_KEYS = new Set(['animationMs']);
const MAX_TRANSITIONS = 200;

export class TourEngine {
  readonly spec: TutorialSpec;
  readonly errors: SpecIssue[] = [];
  readonly warnings: SpecIssue[] = [];

  private opts: CreateTourOptions;
  private persistence: TourPersistence;
  private context: Record<string, unknown>;

  private layer: TourLayer | null = null;
  private popover: TourPopover | null = null;
  private hotspot: TourHotspot | null = null;
  private customHost: HTMLDivElement | null = null;
  private releaseFocus: (() => void) | null = null;
  private cleanupAdvance: (() => void) | null = null;
  private cleanupTrack: (() => void) | null = null;
  private cleanupRender: (() => void) | null = null;
  private appliedVars: string[] = [];

  private status: TourStatus = 'idle';
  private currentId: string | null = null;
  private history: string[] = [];
  private resolved: ResolvedTarget | null = null;
  private runToken = 0;
  private transitions = 0;
  private stepEnteredAt = 0;
  private startedAt = 0;
  private advancing = false;

  constructor(spec: TutorialSpec, opts: CreateTourOptions = {}) {
    this.spec = spec;
    this.opts = opts;
    this.context = { ...(opts.context ?? {}) };
    this.persistence = new TourPersistence(
      opts.persistence?.storage,
      opts.persistence?.keyPrefix ?? 'ot',
      opts.userId,
    );

    const result = validateSpec(spec);
    this.warnings = result.warnings;
    if (!result.ok || (opts.strict && result.warnings.length > 0)) {
      this.errors = result.ok ? result.warnings : result.errors;
      const detail = this.errors.map((e) => `  • ${e.path}: ${e.message}`).join('\n');
      if (opts.dev !== false) {
        console.error(`[opentutorial] Spec "${spec?.id ?? '?'}" failed validation:\n${detail}`);
      }
      this.emit('error', { message: `invalid spec: ${this.errors.length} violation(s)` });
    } else if (result.warnings.length > 0 && opts.dev) {
      const detail = result.warnings.map((w) => `  • ${w.path}: ${w.message}`).join('\n');
      console.warn(`[opentutorial] Spec "${spec.id}" has warnings:\n${detail}`);
    }
  }

  /** Resolves once persisted state has been read (matters for async storage). */
  get ready(): Promise<void> { return this.persistence.ready; }

  getState(): TourState {
    const visible = this.visibleSteps();
    const idx = visible.findIndex((s) => s.id === this.currentId);
    const step = this.currentStep();
    return {
      status: this.status,
      currentStepId: this.currentId,
      index: Math.max(0, idx),
      total: visible.length,
      paused: this.status === 'paused',
      canGoBack: step?.canGoBack !== false && this.history.length > 0,
      canGoNext: this.status === 'running',
    };
  }

  isValid(): boolean { return this.errors.length === 0; }

  hasSeen(): boolean {
    return this.persistence.hasSeen(this.spec.id, this.spec.version);
  }

  getPersistence(): TourPersistence { return this.persistence; }

  resetSeen(): void { this.persistence.reset(this.spec.id); }

  /** Clears seen-state and progress for every tour sharing this storage. */
  resetAll(): void { this.persistence.reset(); }

  resetProgress(): void { this.persistence.clearProgress(this.spec.id); }

  /**
   * Snapshot every persisted record — seen state, resume progress, and the
   * in-flight tour — as plain JSON. Storage is shared across the tours built
   * from one options object, so this covers all of them, not just this spec.
   */
  exportProgress(): PersistedRoot { return this.persistence.exportAll(); }

  /**
   * Restore a snapshot from `exportProgress()`. `merge` keeps whichever record
   * is newer per tour, which is what you want when reconciling a server copy
   * with local activity; `replace` overwrites wholesale. Returns false when the
   * payload cannot be parsed, leaving existing state untouched.
   */
  importProgress(data: PersistedRoot | string, mode: 'replace' | 'merge' = 'replace'): boolean {
    return this.persistence.importAll(data, mode);
  }

  setUser(userId: string | undefined): Promise<void> {
    this.opts = { ...this.opts, userId };
    return this.persistence.setUser(userId);
  }

  getContext(): Record<string, unknown> { return this.context; }

  setContext(patch: Record<string, unknown>): void {
    Object.assign(this.context, patch);
    // A step whose `showIf` just became false must not stay on screen.
    if (this.status === 'running') {
      const step = this.currentStep();
      if (step?.showIf && !evaluateShowIf(step.showIf, this.context)) {
        void this.next();
      }
    }
  }

  setGlobalTheme(theme: ThemeOverrides): void {
    this.opts = { ...this.opts, theme };
    if (this.layer) this.applyThemeChain(this.currentStep()?.theme);
  }

  setLocale(locale: string): void {
    this.opts = { ...this.opts, locale };
    if (this.status === 'running') this.rerenderCurrent();
  }

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  async start(stepId?: string): Promise<void> {
    if (this.status === 'destroyed' || this.status === 'running') return;
    if (!this.isValid()) return;
    await this.persistence.ready;

    this.status = 'running';
    this.history = [];
    this.transitions = 0;
    this.startedAt = Date.now();

    const resumed = stepId ? undefined : this.resolveResumeStep();
    const firstId = stepId ?? resumed ?? this.visibleSteps()[0]?.id;

    // When we resume partway into a tour (deep link, auto-resume, or explicit
    // step), seed history with the preceding visible steps so "Back" works
    // instead of being hidden for the whole session.
    this.history = [];
    if (firstId) {
      const visible = this.visibleSteps();
      const idx = visible.findIndex((s) => s.id === firstId);
      if (idx > 0) this.history = visible.slice(0, idx).map((s) => s.id);
    }

    this.buildDom();
    this.persistence.markShown(this.spec.id, this.spec.version);
    this.emit(resumed ? 'resumed' : 'started', { stepId: firstId });

    if (!firstId) { this.complete('empty'); return; }
    await this.goToInternal(firstId, false);
  }

  private resolveResumeStep(): string | undefined {
    // A tour interrupted by a hard navigation takes priority over stale progress.
    if (this.opts.autoResume) {
      const active = this.persistence.getActive();
      if (active?.tourId === this.spec.id) {
        const visible = this.visibleSteps();
        if (visible.some((s) => s.id === active.stepId)) return active.stepId;
      }
    }
    if (!this.opts.resume) return undefined;
    const ttl = this.opts.progressTtl ?? 24 * 60 * 60 * 1000;
    const progress = this.persistence.getProgressIfValid(this.spec.id, ttl);
    if (progress?.lastStepId) {
      // Only resume into a step that currently passes `showIf`, so a hidden or
      // deleted step never strands the user outside the active flow.
      if (this.visibleSteps().some((s) => s.id === progress.lastStepId)) return progress.lastStepId;
    }
    return undefined;
  }

  async next(): Promise<void> {
    if (this.status !== 'running' || this.advancing) return;
    const step = this.currentStep();
    if (!step) return;

    if (this.opts.beforeNext) {
      this.advancing = true;
      try {
        const index = this.visibleSteps().findIndex((s) => s.id === step.id);
        const allowed = await this.opts.beforeNext({ tourId: this.spec.id, step, index: Math.max(0, index) });
        if (!allowed) return;
      } catch {
        return; // a throwing guard blocks rather than silently advancing
      } finally {
        this.advancing = false;
      }
      if (this.status !== 'running') return;
    }

    this.emit('step-completed', { stepId: step.id, duration: this.stepDuration() });

    const nextId = this.resolveNextId(step);
    if (!nextId) { this.complete('end'); return; }
    await this.goToInternal(nextId, true);
  }

  private resolveNextId(step: TourStep): string | undefined {
    if (Array.isArray(step.next)) {
      for (const rule of step.next) {
        if (rule && typeof rule.if === 'string' && evaluateShowIf(rule.if, this.context)) return rule.to;
      }
      // No branch matched — fall through to sequential order.
    } else if (typeof step.next === 'string') {
      return step.next;
    }
    const visible = this.visibleSteps();
    const idx = visible.findIndex((s) => s.id === step.id);
    if (idx >= 0) return visible[idx + 1]?.id;

    // The current step is no longer visible — `setContext` just turned its own
    // `showIf` false. Walking forward from its position in the spec finds the
    // next step the user should actually see; returning undefined here would
    // end the whole tour instead of skipping the one step that dropped out.
    const specIdx = this.spec.steps.findIndex((s) => s.id === step.id);
    if (specIdx < 0) return undefined;
    const visibleIds = new Set(visible.map((s) => s.id));
    return this.spec.steps.slice(specIdx + 1).find((s) => visibleIds.has(s.id))?.id;
  }

  prev(): void {
    if (this.status !== 'running') return;
    const step = this.currentStep();
    if (step && step.canGoBack === false) return;
    const prevId = this.history.pop();
    if (!prevId) return;
    this.emit('back', { stepId: this.currentId ?? undefined });
    void this.goToInternal(prevId, false);
  }

  goTo(stepId: string): void {
    if (this.status !== 'running') return;
    void this.goToInternal(stepId, true);
  }

  /** Hide the tour but remember where the user was. `resume()` picks it back up. */
  pause(): void {
    if (this.status !== 'running') return;
    this.status = 'paused';
    this.emit('paused', { stepId: this.currentId ?? undefined });
    this.teardownDom();
  }

  resume(): void {
    if (this.status !== 'paused') return;
    const stepId = this.currentId;
    this.status = 'running';
    this.emit('unpaused', { stepId: stepId ?? undefined });
    this.buildDom();
    if (stepId) void this.goToInternal(stepId, false);
    else void this.start();
  }

  skip(reason = 'user'): void {
    if (this.status !== 'running' && this.status !== 'paused') return;
    this.finish('skipped', reason);
  }

  complete(reason = 'user'): void {
    if (this.status !== 'running' && this.status !== 'paused') return;
    this.finish('completed', reason);
  }

  destroy(): void {
    this.status = 'destroyed';
    this.teardownDom();
  }

  // -------------------------------------------------------------------------
  // Internals
  // -------------------------------------------------------------------------

  private visibleSteps(): TourStep[] {
    return this.spec.steps.filter((s) => !s.showIf || evaluateShowIf(s.showIf, this.context));
  }

  private currentStep(): TourStep | null {
    return this.spec.steps.find((s) => s.id === this.currentId) ?? null;
  }

  private stepDuration(): number {
    return this.stepEnteredAt ? Date.now() - this.stepEnteredAt : 0;
  }

  private text(content: I18nContent): string {
    return resolveText(content, this.opts.locale ?? 'en', this.opts.i18nResolver, this.context);
  }

  private blocks(content: StepContent): ContentBlock[] {
    return normalizeContent(content, (c) => this.text(c));
  }

  private interactionFor(step: TourStep): InteractionMode {
    return step.interaction ?? this.spec.interaction ?? this.opts.interaction ?? 'free';
  }

  private buildDom(): void {
    const z = this.opts.zIndex ?? 9999;
    this.layer = new TourLayer(z, {
      container: this.opts.container,
      isolate: this.opts.isolate,
      dir: this.opts.dir,
    });
    this.layer.attach();

    if (this.opts.renderStep) {
      this.customHost = document.createElement('div');
      this.customHost.className = 'ot-custom-host';
      this.layer.mountPopover(this.customHost);
    } else {
      this.popover = new TourPopover(
        {
          onNext: () => void this.next(),
          onPrev: () => this.prev(),
          onSkip: () => this.skip('user'),
        },
        this.opts.dir ?? 'ltr',
        { swipe: this.opts.swipe },
      );
      this.layer.mountPopover(this.popover.el);
    }
    this.applyThemeChain(undefined);
  }

  private teardownDom(): void {
    this.runToken += 1;
    this.releaseFocus?.();
    this.cleanupAdvance?.();
    this.cleanupTrack?.();
    this.cleanupRender?.();
    this.releaseFocus = null;
    this.cleanupAdvance = null;
    this.cleanupTrack = null;
    this.cleanupRender = null;
    this.popover?.destroy();
    this.hotspot?.destroy();
    this.customHost?.remove();
    this.layer?.destroy();
    this.popover = null;
    this.hotspot = null;
    this.customHost = null;
    this.layer = null;
    this.resolved = null;
  }

  private finish(status: 'completed' | 'skipped', reason: string): void {
    const step = this.currentStep();
    if (step) this.runActions(step.onExit);
    const duration = this.startedAt ? Date.now() - this.startedAt : 0;
    this.status = status;
    this.persistence.mark(this.spec.id, status, this.spec.version);
    this.persistence.clearActive();
    this.emit(status, { stepId: this.currentId ?? undefined, reason, duration });
    this.teardownDom();

    if (status === 'completed') this.runOnComplete();
  }

  private runOnComplete(): void {
    const hook = this.spec.onComplete;
    if (!hook) return;
    try {
      if (hook.emit) window.dispatchEvent(new CustomEvent(hook.emit, { detail: { tourId: this.spec.id } }));
      if (hook.navigate) this.navigate(hook.navigate);
      if (hook.startTour) {
        // Announced rather than started directly: the engine owns one spec, so
        // whoever manages the set (orchestrator/adapter) performs the handoff.
        window.dispatchEvent(new CustomEvent('opentutorial:chain', {
          detail: { from: this.spec.id, to: hook.startTour },
        }));
      }
    } catch { /* a completion hook must never break the host */ }
  }

  private async goToInternal(stepId: string, pushHistory: boolean): Promise<void> {
    if (this.status !== 'running') return;
    this.transitions += 1;
    if (this.transitions > MAX_TRANSITIONS) {
      this.emit('error', { message: 'transition limit reached (possible next-loop)' });
      this.complete('loop-guard');
      return;
    }
    const step = this.spec.steps.find((s) => s.id === stepId);
    if (!step) {
      this.emit('error', { message: `unknown step "${stepId}"` });
      return;
    }
    const leaving = this.currentStep();
    if (leaving) {
      this.runActions(leaving.onExit);
      this.emit('step-hidden', { stepId: leaving.id, duration: this.stepDuration() });
    }
    if (pushHistory && this.currentId && this.currentId !== stepId) {
      this.history.push(this.currentId);
    }
    await this.showStep(step);
  }

  private async showStep(step: TourStep): Promise<void> {
    if (!this.layer) return;
    const token = ++this.runToken;
    const alive = (): boolean => this.runToken === token && this.status === 'running';

    this.currentId = step.id;
    this.cleanupAdvance?.();
    this.cleanupAdvance = null;
    this.releaseFocus?.();
    this.releaseFocus = null;
    this.applyThemeChain(step.theme);

    const display = step.display ?? 'spotlight';
    const visible = this.visibleSteps();
    const index = Math.max(0, visible.findIndex((s) => s.id === step.id));

    let found: ResolvedTarget | null = null;

    if (step.target) {
      found = resolveTarget(step.target);
      if (!found && step.target.waitFor) {
        this.renderStep(step, index, visible.length, 'Looking for the interface element…');
        found = await waitForTarget(step.target, step.target.timeout ?? 5000);
        if (!alive()) return;
      }
      if (!found) {
        const selector = describeTarget(step.target);
        this.emit('target-not-found', { stepId: step.id, selector, message: `target not found: ${selector}` });
        void this.next();
        return;
      }
    }
    if (!alive()) return;

    this.resolved = found;

    if (found && step.target?.scrollIntoView !== false) {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const behavior = step.target?.scrollBehavior ?? (reduced ? 'auto' : 'smooth');
      try {
        (found.element as HTMLElement).scrollIntoView({ block: 'center', inline: 'center', behavior });
      } catch { /* jsdom and some embedded views lack smooth scrolling */ }
    }

    this.hotspot?.destroy();
    this.hotspot = null;
    this.layer.updateSpotlight(null);
    this.layer.setInteraction(this.interactionFor(step));

    const isIndicator = display === 'hotspot' || display === 'beacon';

    if (isIndicator && found) {
      this.showIndicator(step, display, found);
    } else {
      this.renderStep(step, index, visible.length);
      if (display === 'modal' || !found) this.layer.showBackdrop();
      requestAnimationFrame(() => requestAnimationFrame(() => { if (alive()) this.reposition(); }));
      const surface = this.customHost ?? this.popover?.el;
      if (surface) {
        const blocking = display === 'modal' || this.interactionFor(step) !== 'free';
        this.releaseFocus = trapFocus(surface, {
          trap: blocking,
          onEscape: () => { if (step.skippable !== false) this.skip('escape'); },
          onArrowNext: () => void this.next(),
          onArrowPrev: () => this.prev(),
        });
      }
    }

    this.wireAdvance(step, found?.element ?? null);
    this.startTracking();

    this.stepEnteredAt = Date.now();
    this.persistence.saveProgress(this.spec.id, step.id, index);
    if (this.opts.autoResume) this.persistence.setActive(this.spec.id, step.id);

    this.runActions(step.onEnter);
    this.emit('step-shown', { stepId: step.id, index, total: visible.length });
  }

  private showIndicator(step: TourStep, display: 'hotspot' | 'beacon', found: ResolvedTarget): void {
    if (!this.layer) return;
    const rect = this.viewportRect(found);
    if (this.popover) this.popover.el.style.display = 'none';
    if (this.customHost) this.customHost.style.display = 'none';

    this.hotspot = new TourHotspot();
    this.hotspot.render({
      display,
      content: blocksToText(this.blocks(step.content)),
      showDismiss: display === 'hotspot' || step.advanceOn === 'button',
      onDismiss: () => void this.next(),
    }, rect);
    this.layer.root.appendChild(this.hotspot.el);

    if (display === 'beacon') {
      // Auto-dismiss on a timer. Earlier versions also advanced on any document
      // click, which fired on unrelated interactions across the page.
      const timeout = window.setTimeout(() => void this.next(), step.duration ?? 5000);
      this.cleanupAdvance = () => window.clearTimeout(timeout);
    }
  }

  private renderStep(step: TourStep, index: number, total: number, loadingText?: string): void {
    const blocks: ContentBlock[] = loadingText
      ? [{ type: 'text', value: loadingText }]
      : this.blocks(step.content);

    if (this.opts.renderStep && this.customHost) {
      this.cleanupRender?.();
      const ctx: StepRenderContext = {
        tourId: this.spec.id,
        step,
        index,
        total,
        title: this.text(step.title),
        blocks,
        canGoBack: step.canGoBack !== false && this.history.length > 0,
        canSkip: step.skippable !== false,
        isLast: !step.next && index >= total - 1,
        next: () => void this.next(),
        prev: () => this.prev(),
        skip: () => this.skip('user'),
        goTo: (id: string) => this.goTo(id),
      };
      const cleanup = this.opts.renderStep(ctx, this.customHost);
      this.cleanupRender = typeof cleanup === 'function' ? cleanup : null;
      this.customHost.style.display = '';
      return;
    }

    if (!this.popover) return;
    this.popover.el.style.display = '';
    this.popover.render(this.makeModel(step, index, total, blocks));
  }

  private rerenderCurrent(): void {
    const step = this.currentStep();
    if (!step) return;
    const visible = this.visibleSteps();
    const index = Math.max(0, visible.findIndex((s) => s.id === step.id));
    this.renderStep(step, index, visible.length);
    this.reposition();
  }

  private makeModel(step: TourStep, index: number, total: number, blocks: ContentBlock[]): PopoverModel {
    const locale = this.opts.locale ?? 'en';
    const resolver = this.opts.i18nResolver;
    const label = (key: 'next' | 'back' | 'done' | 'skip', override: I18nContent | false | undefined): string =>
      (override === false || override === undefined ? resolveLabel(key, locale, resolver) : this.text(override));

    const buttons = step.buttons ?? {};
    const advanceOn = step.advanceOn ?? 'button';

    return {
      stepId: step.id,
      title: this.text(step.title),
      blocks,
      index,
      total,
      canGoBack: step.canGoBack !== false && this.history.length > 0,
      skippable: step.skippable !== false && buttons.skip !== false,
      isLast: !step.next && index >= total - 1,
      advanceOn,
      labels: {
        next: label('next', buttons.next),
        back: label('back', buttons.back),
        done: label('done', buttons.done),
        skip: label('skip', buttons.skip),
      },
      // With a non-button advance condition the primary button would be a
      // "skip this step" escape hatch; hide it unless the author asked for one.
      showNext: buttons.next !== false && (advanceOn === 'button' || index >= total - 1),
      showBack: buttons.back !== false,
      modal: (step.display ?? 'spotlight') === 'modal' || this.interactionFor(step) === 'blocked',
      allowHtml: this.opts.allowHtml,
    };
  }

  /** Element rect mapped into the top-level viewport (adds the iframe offset). */
  private viewportRect(found: ResolvedTarget): { x: number; y: number; width: number; height: number } {
    const r = found.element.getBoundingClientRect();
    return {
      x: r.x + found.frameOffset.x,
      y: r.y + found.frameOffset.y,
      width: r.width,
      height: r.height,
    };
  }

  private reposition(): void {
    if (!this.layer || this.status !== 'running') return;
    const step = this.currentStep();
    if (!step) return;
    const pad = step.target?.padding ?? 8;
    const surfaceIsPopover = !!this.popover && !this.opts.renderStep;

    if (this.resolved) {
      // Re-resolve if the element was detached and re-rendered by the host app.
      if (!this.resolved.doc.contains(this.resolved.element) && step.target) {
        const again = resolveTarget(step.target);
        if (again) this.resolved = again;
      }
      const rect = this.viewportRect(this.resolved);
      if (this.hotspot) {
        this.hotspot.reposition(rect);
        this.layer.setInteraction(this.interactionFor(step));
      } else {
        this.layer.updateSpotlight(rect, pad, this.mergedRadius());
        if (surfaceIsPopover) this.popover?.position(rect, step.placement ?? 'auto', pad);
      }
    } else {
      this.layer.showBackdrop();
      if (surfaceIsPopover) this.popover?.position(null, 'center', 0);
    }
  }

  private mergedRadius(): number {
    const chain = { ...this.opts.theme, ...this.spec.theme, ...this.currentStep()?.theme };
    return (chain.radius ?? 14) + 2;
  }

  private startTracking(): void {
    this.cleanupTrack?.();
    let raf = 0;
    let scheduled = false;
    const schedule = (): void => {
      if (scheduled) return;
      scheduled = true;
      raf = requestAnimationFrame(() => { scheduled = false; this.reposition(); });
    };

    const ro = new ResizeObserver(schedule);
    if (this.resolved) {
      try { ro.observe(this.resolved.element); } catch { /* detached */ }
    }
    ro.observe(document.documentElement);
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);

    // The target may still be animating into place; keep correcting briefly.
    const settleUntil = performance.now() + 900;
    const settle = (): void => {
      if (this.status !== 'running') return;
      this.reposition();
      if (performance.now() < settleUntil) requestAnimationFrame(settle);
    };
    requestAnimationFrame(settle);

    this.cleanupTrack = () => {
      ro.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
      cancelAnimationFrame(raf);
    };
  }

  // -------------------------------------------------------------------------
  // Advance conditions
  // -------------------------------------------------------------------------

  private wireAdvance(step: TourStep, el: Element | null): void {
    const mode = step.advanceOn ?? 'button';
    const advance = (): void => { void this.next(); };

    switch (mode) {
      case 'target-click': {
        if (!el) return;
        const handler = (): void => advance();
        el.addEventListener('click', handler, { once: true });
        this.cleanupAdvance = () => el.removeEventListener('click', handler);
        return;
      }

      case 'event': {
        if (typeof step.event !== 'string') return;
        const name = step.event;
        const handler = (): void => advance();
        window.addEventListener(name, handler, { once: true });
        this.cleanupAdvance = () => window.removeEventListener(name, handler);
        return;
      }

      case 'auto': {
        const timer = window.setTimeout(advance, step.duration ?? 3000);
        this.cleanupAdvance = () => window.clearTimeout(timer);
        return;
      }

      case 'input-match': {
        if (!el || typeof step.match !== 'string') return;
        const expected = step.match;
        const test = (value: string): boolean => {
          if (expected.startsWith('/') && expected.lastIndexOf('/') > 0) {
            const end = expected.lastIndexOf('/');
            try {
              return new RegExp(expected.slice(1, end), expected.slice(end + 1)).test(value);
            } catch { return false; }
          }
          return value === expected;
        };
        const handler = (): void => {
          const value = (el as HTMLInputElement).value ?? '';
          if (test(value)) advance();
        };
        el.addEventListener('input', handler);
        el.addEventListener('change', handler);
        this.cleanupAdvance = () => {
          el.removeEventListener('input', handler);
          el.removeEventListener('change', handler);
        };
        return;
      }

      case 'form-submit': {
        if (!el) return;
        const form = (el as HTMLElement).closest?.('form') ?? (el.tagName === 'FORM' ? el : null);
        if (!form) return;
        const handler = (): void => advance();
        form.addEventListener('submit', handler, { once: true });
        this.cleanupAdvance = () => form.removeEventListener('submit', handler);
        return;
      }

      case 'element-appears': {
        if (typeof step.watch !== 'string') return;
        let cancelled = false;
        void waitForTarget({ selector: step.watch, visible: true }, step.duration ?? 60000)
          .then((found) => { if (found && !cancelled) advance(); });
        this.cleanupAdvance = () => { cancelled = true; };
        return;
      }

      case 'element-disappears': {
        if (typeof step.watch !== 'string') return;
        const watch = step.watch;
        const poll = window.setInterval(() => {
          if (!resolveTarget({ selector: watch, visible: true })) {
            window.clearInterval(poll);
            advance();
          }
        }, 150);
        this.cleanupAdvance = () => window.clearInterval(poll);
        return;
      }

      case 'url-match': {
        if (typeof step.urlPattern !== 'string') return;
        const pattern = step.urlPattern;
        const check = (): void => { if (matchPath(pattern, currentPath())) advance(); };
        const off = onLocationChange(check);
        this.cleanupAdvance = off;
        check();
        return;
      }

      default:
        // 'button' — the popover's Next handler drives it.
    }
  }

  // -------------------------------------------------------------------------
  // Actions, theme, events
  // -------------------------------------------------------------------------

  private navigate(path: string): void {
    if (!path.startsWith('/')) return; // same-origin only
    if (this.opts.onNavigate) {
      this.opts.onNavigate(path);
      return;
    }
    window.location.assign(path);
  }

  private runActions(actions: StepAction[] | undefined): void {
    if (!actions) return;
    const el = this.resolved?.element as HTMLElement | null;
    for (const a of actions) {
      try {
        switch (a.type) {
          case 'emit':
            window.dispatchEvent(new CustomEvent(a.name, { detail: a.detail }));
            break;
          case 'click': el?.click?.(); break;
          case 'focus': el?.focus?.(); break;
          case 'navigate':
            // With autoResume on, the tour is recorded before we leave so a hard
            // navigation can pick it back up on the next page.
            if (this.opts.autoResume && this.currentId) {
              this.persistence.setActive(this.spec.id, this.currentId);
            }
            this.navigate(a.path);
            break;
          case 'setContext': this.context[a.key] = a.value; break;
          case 'scrollTo': {
            const target = resolveTarget({ selector: a.selector });
            target?.element.scrollIntoView({ block: 'center', behavior: 'smooth' });
            break;
          }
          case 'wait':
            // Intentionally non-blocking: the step stays put and the timer only
            // matters alongside `advanceOn: 'auto'`.
            break;
        }
      } catch { /* actions must never break the host */ }
    }
  }

  private applyThemeChain(stepTheme: ThemeOverrides | undefined): void {
    if (!this.layer) return;
    const style = this.layer.root.style;
    for (const v of this.appliedVars) style.removeProperty(v);
    this.appliedVars = [];

    const chain: ThemeOverrides = { ...this.opts.theme, ...this.spec.theme, ...stepTheme };
    for (const [key, raw] of Object.entries(chain)) {
      if (raw === undefined) continue;
      const varName = THEME_VAR_MAP[key as keyof ThemeOverrides];
      if (!varName) continue;
      const value = PX_KEYS.has(key) ? `${raw}px` : MS_KEYS.has(key) ? `${raw}ms` : String(raw);
      style.setProperty(varName, value);
      this.appliedVars.push(varName);
    }
    if (chain.z !== undefined) this.layer.root.style.zIndex = String(chain.z);
  }

  private emit(type: TourEventType, extra: Partial<TourEvent> = {}): void {
    const e: TourEvent = {
      type,
      tourId: this.spec?.id ?? 'unknown',
      timestamp: Date.now(),
      ...extra,
    };
    // Frozen so one listener cannot corrupt the event for the next.
    const frozen = Object.freeze({ ...e });
    try { this.opts.onEvent?.(frozen); } catch { /* listener errors must not break the tour */ }
    try { window.dispatchEvent(new CustomEvent('opentutorial', { detail: frozen })); } catch { /* noop */ }
  }
}
