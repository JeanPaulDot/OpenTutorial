import { TourLayer } from './dom/layer';
import { TourPopover, type PopoverModel } from './dom/popover';
import { TourHotspot } from './dom/hotspot';
import { trapFocus } from './dom/focus';
import { safeQuery, waitForElement } from './dom/waitFor';
import { TourPersistence } from './persist';
import { validateSpec } from './schema';
import { evaluateShowIf } from './safeEval';
import { resolveText } from './i18n';
import type {
  CreateTourOptions, SpecError, StepAction, ThemeOverrides,
  TourEvent, TourEventType, TourState, TourStatus, TourStep, TutorialSpec,
  I18nContent,
} from './types';

const THEME_VAR_MAP: Record<keyof ThemeOverrides, string> = {
  accent: '--ot-accent',
  bg: '--ot-bg',
  fg: '--ot-fg',
  muted: '--ot-muted',
  backdrop: '--ot-backdrop',
  radius: '--ot-radius',
  shadow: '--ot-shadow',
  font: '--ot-font',
  z: '--ot-z',
  spotlightRing: '--ot-spotlight-ring',
  popoverWidth: '--ot-popover-width',
};
const PX_KEYS = new Set(['radius', 'popoverWidth']);
const MAX_TRANSITIONS = 100;

function resolveI18n(content: I18nContent, locale: string, resolver?: (key: string, locale: string) => string | undefined): string {
  return resolveText(content, locale, resolver);
}

export class TourEngine {
  readonly spec: TutorialSpec;
  readonly errors: SpecError[] = [];

  private opts: CreateTourOptions;
  private persistence: TourPersistence;
  private context: Record<string, unknown>;

  private layer: TourLayer | null = null;
  private popover: TourPopover | null = null;
  private hotspot: TourHotspot | null = null;
  private releaseFocus: (() => void) | null = null;
  private cleanupAdvance: (() => void) | null = null;
  private cleanupTrack: (() => void) | null = null;
  private appliedVars: string[] = [];

  private status: TourStatus = 'idle';
  private currentId: string | null = null;
  private history: string[] = [];
  private targetEl: Element | null = null;
  private runToken = 0;
  private transitions = 0;

  constructor(spec: TutorialSpec, opts: CreateTourOptions = {}) {
    this.spec = spec;
    this.opts = opts;
    this.context = { ...(opts.context ?? {}) };
    this.persistence = new TourPersistence(opts.persistence?.storage, opts.persistence?.keyPrefix ?? 'ot');

    const result = validateSpec(spec);
    if (!result.ok) {
      this.errors = result.errors;
      const detail = result.errors.map((e) => `  • ${e.path}: ${e.message}`).join('\n');
      if (opts.dev !== false) {
        console.error(`[opentutorial] Spec "${spec?.id ?? '?'}" failed validation:\n${detail}`);
      }
      this.emit('error', { message: `invalid spec: ${result.errors.length} violation(s)` });
    }
  }

  getState(): TourState {
    const visible = this.visibleSteps();
    const idx = visible.findIndex((s) => s.id === this.currentId);
    return {
      status: this.status,
      currentStepId: this.currentId,
      index: Math.max(0, idx),
      total: visible.length,
    };
  }

  isValid(): boolean { return this.errors.length === 0; }

  hasSeen(): boolean {
    return this.persistence.hasSeen(this.spec.id, this.spec.version);
  }

  resetSeen(): void {
    this.persistence.reset();
    this.persistence.clearAllProgress();
  }

  resetProgress(): void { this.persistence.clearAllProgress(); }

  setContext(patch: Record<string, unknown>): void {
    Object.assign(this.context, patch);
  }

  setGlobalTheme(theme: ThemeOverrides): void {
    this.opts = { ...this.opts, theme };
    if (this.layer) this.applyThemeChain(this.currentStep()?.theme);
  }

  async start(stepId?: string): Promise<void> {
    if (this.status === 'destroyed' || this.status === 'running') return;
    if (!this.isValid()) return;
    this.status = 'running';
    this.history = [];
    this.transitions = 0;

    const resumeId = stepId ?? this.resolveResumeStep();
    this.buildDom();

    const firstId = resumeId ?? this.visibleSteps()[0]?.id;
    this.emit('started');
    if (!firstId) { this.complete(); return; }
    await this.goToInternal(firstId, false);
  }

  private resolveResumeStep(): string | undefined {
    if (!this.opts.resume) return undefined;
    const ttl = this.opts.progressTtl ?? 24 * 60 * 60 * 1000;
    const progress = this.persistence.getProgressIfValid(this.spec.id, ttl);
    if (progress && progress.lastStepId) {
      // Only resume into a step that is currently visible (passes showIf).
      // A step hidden by context, or removed from the spec, is skipped so we
      // never land the user on a step that isn't in the active flow.
      const visible = this.visibleSteps();
      const idx = visible.findIndex((s) => s.id === progress.lastStepId);
      if (idx >= 0 && idx < visible.length) return progress.lastStepId;
    }
    return undefined;
  }

  next(): void {
    if (this.status !== 'running') return;
    const step = this.currentStep();
    if (!step) return;

    let nextId: string | undefined = step.next;
    if (!nextId) {
      const visible = this.visibleSteps();
      const idx = visible.findIndex((s) => s.id === step.id);
      nextId = idx >= 0 ? visible[idx + 1]?.id : undefined;
    }
    if (!nextId) { this.complete(); return; }
    void this.goToInternal(nextId, true);
  }

  prev(): void {
    if (this.status !== 'running') return;
    const step = this.currentStep();
    if (step && step.canGoBack === false) return;
    const prevId = this.history.pop();
    if (!prevId) return;
    void this.goToInternal(prevId, false);
  }

  goTo(stepId: string): void {
    if (this.status !== 'running') return;
    void this.goToInternal(stepId, true);
  }

  skip(): void {
    if (this.status !== 'running') return;
    this.finish('skipped');
  }

  complete(): void {
    if (this.status !== 'running') return;
    this.finish('completed');
  }

  destroy(): void {
    this.status = 'destroyed';
    this.teardownDom();
  }

  private visibleSteps(): TourStep[] {
    return this.spec.steps.filter((s) => !s.showIf || evaluateShowIf(s.showIf, this.context));
  }

  private currentStep(): TourStep | null {
    return this.spec.steps.find((s) => s.id === this.currentId) ?? null;
  }

  private resolveText(content: I18nContent): string {
    return resolveI18n(content, this.opts.locale ?? 'en', this.opts.i18nResolver);
  }

  private buildDom(): void {
    const z = this.opts.zIndex ?? 9999;
    this.layer = new TourLayer(z);
    this.layer.attach();
    this.popover = new TourPopover({
      onNext: () => this.next(),
      onPrev: () => this.prev(),
      onSkip: () => this.skip(),
    });
    this.layer.mountPopover(this.popover.el);
    this.applyThemeChain(undefined);
  }

  private teardownDom(): void {
    this.runToken += 1;
    this.releaseFocus?.();
    this.cleanupAdvance?.();
    this.cleanupTrack?.();
    this.releaseFocus = null;
    this.cleanupAdvance = null;
    this.cleanupTrack = null;
    this.popover?.destroy();
    this.hotspot?.destroy();
    this.layer?.destroy();
    this.popover = null;
    this.hotspot = null;
    this.layer = null;
    this.targetEl = null;
    this.appliedVars = [];
  }

  private finish(status: 'completed' | 'skipped'): void {
    const step = this.currentStep();
    if (step) this.runActions(step.onExit);
    this.status = status;
    this.persistence.mark(this.spec.id, status, this.spec.version);
    this.emit(status, { stepId: this.currentId ?? undefined });
    this.teardownDom();
  }

  private async goToInternal(stepId: string, pushHistory: boolean): Promise<void> {
    if (this.status !== 'running') return;
    this.transitions += 1;
    if (this.transitions > MAX_TRANSITIONS) {
      this.emit('error', { message: 'transition limit reached (possible next-loop)' });
      this.complete();
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
      this.emit('step-hidden', { stepId: leaving.id });
    }
    if (pushHistory && this.currentId && this.currentId !== stepId) {
      this.history.push(this.currentId);
    }
    await this.showStep(step);
  }

  private async showStep(step: TourStep): Promise<void> {
    if (!this.layer || !this.popover) return;
    const token = ++this.runToken;
    const alive = () => this.runToken === token && this.status === 'running';

    this.currentId = step.id;
    this.cleanupAdvance?.();
    this.cleanupAdvance = null;
    this.releaseFocus?.();
    this.releaseFocus = null;
    this.applyThemeChain(step.theme);

    const display = step.display ?? 'spotlight';

    const visible = this.visibleSteps();
    const index = Math.max(0, visible.findIndex((s) => s.id === step.id));

    let el: Element | null = null;

    if (step.target) {
      el = safeQuery(step.target.selector);
      if (!el && step.target.waitFor) {
        if (display === 'spotlight') {
          this.popover.render(this.makeModel(step, index, visible.length, 'Looking for the interface element…'));
          this.popover.position(null, 'auto', 0);
          this.layer.updateSpotlight(null);
        }
        el = await waitForElement(step.target.selector, step.target.timeout ?? 5000);
        if (!alive()) return;
        if (!el) {
          this.emit('error', { stepId: step.id, message: `target not found: ${step.target.selector}` });
          this.next();
          return;
        }
      } else if (!el) {
        this.emit('error', { stepId: step.id, message: `target not found: ${step.target.selector}` });
        this.next();
        return;
      }
    }
    if (!alive()) return;

    this.targetEl = el;

    if (el && step.target?.scrollIntoView !== false) {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      (el as HTMLElement).scrollIntoView({ block: 'center', inline: 'center', behavior: reduced ? 'auto' : 'smooth' });
    }

    this.hotspot?.destroy();
    this.hotspot = null;
    this.layer.updateSpotlight(null);

    if (display === 'spotlight') {
      this.popover.render(this.makeModel(step, index, visible.length));
      this.popover.el.style.display = '';
      requestAnimationFrame(() => requestAnimationFrame(() => { if (alive()) this.reposition(); }));
      this.releaseFocus = trapFocus(this.popover.el, {
        onEscape: () => { if (step.skippable !== false) this.skip(); },
        onArrowNext: () => this.next(),
        onArrowPrev: () => this.prev(),
      });
    } else if (el) {
      const rect = el.getBoundingClientRect();
      this.popover.el.style.display = 'none';
      this.hotspot = new TourHotspot();
      this.hotspot.render({
        display,
        content: this.resolveText(step.content),
        showDismiss: display === 'hotspot' || step.advanceOn === 'button',
        onDismiss: () => this.next(),
      }, rect);
      this.layer.root.appendChild(this.hotspot.el);

      if (display === 'beacon') {
        const beaconTimeout = window.setTimeout(() => this.next(), step.duration ?? 5000);
        const docHandler = () => this.next();
        document.addEventListener('click', docHandler, { once: true });
        this.cleanupAdvance = () => {
          window.clearTimeout(beaconTimeout);
          document.removeEventListener('click', docHandler);
        };
      }
    }

    this.wireAdvance(step, el);
    this.startTracking();

    this.persistence.saveProgress(this.spec.id, step.id, index);

    this.runActions(step.onEnter);
    this.emit('step-shown', { stepId: step.id, index, total: visible.length });
  }

  private makeModel(step: TourStep, index: number, total: number, loadingContent?: string): PopoverModel {
    return {
      stepId: step.id,
      title: this.resolveText(step.title),
      content: loadingContent ?? this.resolveText(step.content),
      index,
      total,
      canGoBack: step.canGoBack !== false && this.history.length > 0,
      skippable: step.skippable !== false,
      isLast: !step.next && index >= total - 1,
      advanceOn: step.advanceOn ?? 'button',
    };
  }

  private reposition(): void {
    if (!this.layer || this.status !== 'running') return;
    const step = this.currentStep();
    if (!step) return;
    const pad = step.target?.padding ?? 8;

    if (this.targetEl) {
      const r = this.targetEl.getBoundingClientRect();
      if (r.width === 0 && r.height === 0 && !document.contains(this.targetEl)) {
        const el = step.target ? safeQuery(step.target.selector) : null;
        if (el) this.targetEl = el;
      }
      const rect = { x: r.x, y: r.y, width: r.width, height: r.height };
      if (this.hotspot) {
        this.hotspot.reposition(rect);
      } else if (this.popover) {
        this.layer.updateSpotlight(rect, pad, this.mergedRadius());
        this.popover.position(rect, step.placement ?? 'auto', pad);
      }
    } else {
      this.layer.updateSpotlight(null);
      this.popover?.position(null, 'auto', 0);
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
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      raf = requestAnimationFrame(() => { scheduled = false; this.reposition(); });
    };
    const ro = new ResizeObserver(schedule);
    if (this.targetEl) ro.observe(this.targetEl);
    ro.observe(document.documentElement);
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);

    const settleUntil = performance.now() + 900;
    const settle = () => {
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

  private wireAdvance(step: TourStep, el: Element | null): void {
    const mode = step.advanceOn ?? 'button';
    if (mode === 'target-click' && el) {
      const handler = () => this.next();
      el.addEventListener('click', handler, { once: true });
      this.cleanupAdvance = () => el.removeEventListener('click', handler);
    } else if (mode === 'event' && typeof step.event === 'string') {
      const eventName: string = step.event;
      const handler = () => this.next();
      window.addEventListener(eventName, handler, { once: true });
      this.cleanupAdvance = () => window.removeEventListener(eventName, handler);
    } else if (mode === 'auto') {
      const t = window.setTimeout(() => this.next(), step.duration ?? 3000);
      this.cleanupAdvance = () => window.clearTimeout(t);
    }
  }

  private runActions(actions: StepAction[] | undefined): void {
    if (!actions) return;
    const el = this.targetEl as HTMLElement | null;
    for (const a of actions) {
      try {
        switch (a.type) {
          case 'emit':
            window.dispatchEvent(new CustomEvent(a.name, { detail: a.detail }));
            break;
          case 'click': el?.click?.(); break;
          case 'focus': el?.focus?.(); break;
          case 'navigate':
            if (a.path.startsWith('/')) window.location.assign(a.path);
            break;
          case 'setContext': this.context[a.key] = a.value; break;
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
      const value = PX_KEYS.has(key) ? `${raw}px` : String(raw);
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
    try { this.opts.onEvent?.(e); } catch { /* listener errors must not break the tour */ }
    try { window.dispatchEvent(new CustomEvent('opentutorial', { detail: e })); } catch { /* noop */ }
  }
}
