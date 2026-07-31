/**
 * `<open-tutorial>` custom element.
 *
 * The universal adapter: works in Angular, Solid, Lit, Astro, Rails, Django, or
 * a plain HTML file. Specs come from a `specs` property, a `specs` attribute
 * holding JSON, or an inline `<script type="application/json">` child.
 *
 * ```html
 * <open-tutorial auto-start="welcome">
 *   <script type="application/json">
 *     { "specVersion": 1, "id": "welcome", "title": "Hi", "steps": [ ... ] }
 *   </script>
 * </open-tutorial>
 * ```
 */

import { createTutorialLayer, type VanillaTutorialLayer } from './vanilla';
import type { Direction, InteractionMode, TourEvent, TutorialSpec } from '../types';

const OBSERVED = [
  'specs', 'context', 'theme', 'locale', 'dir', 'z-index', 'interaction',
  'auto-start', 'deep-link-param', 'resume', 'auto-resume', 'isolate', 'allow-html', 'debug',
];

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export class OpenTutorialElement extends HTMLElement {
  static get observedAttributes(): string[] { return OBSERVED; }

  private layer: VanillaTutorialLayer | null = null;
  private _specs: TutorialSpec[] = [];
  private _context: Record<string, unknown> = {};

  /** Assign specs as a property when they are not serializable into an attribute. */
  set specs(value: TutorialSpec[]) {
    this._specs = Array.isArray(value) ? value : [];
    this.rebuild();
  }
  get specs(): TutorialSpec[] { return this._specs; }

  set context(value: Record<string, unknown>) {
    this._context = value ?? {};
    this.layer?.setContext(this._context);
  }
  get context(): Record<string, unknown> { return this._context; }

  connectedCallback(): void {
    this.style.display = 'none';
    this.rebuild();
  }

  disconnectedCallback(): void {
    this.layer?.destroy();
    this.layer = null;
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnected) return;
    if (name === 'context') {
      this._context = parseJson(this.getAttribute('context'), {});
      this.layer?.setContext(this._context);
      return;
    }
    if (name === 'locale') {
      const locale = this.getAttribute('locale');
      if (locale) this.layer?.setLocale(locale);
      return;
    }
    this.rebuild();
  }

  private collectSpecs(): TutorialSpec[] {
    if (this._specs.length > 0) return this._specs;

    const attr = parseJson<TutorialSpec[] | TutorialSpec | null>(this.getAttribute('specs'), null);
    if (attr) return Array.isArray(attr) ? attr : [attr];

    const inline: TutorialSpec[] = [];
    for (const script of Array.from(this.querySelectorAll('script[type="application/json"]'))) {
      const parsed = parseJson<TutorialSpec | TutorialSpec[] | null>(script.textContent, null);
      if (!parsed) continue;
      inline.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    }
    return inline;
  }

  private rebuild(): void {
    if (!this.isConnected) return;
    this.layer?.destroy();

    const specs = this.collectSpecs();
    if (specs.length === 0) { this.layer = null; return; }

    const has = (name: string): boolean => this.hasAttribute(name) && this.getAttribute(name) !== 'false';
    const zIndex = Number(this.getAttribute('z-index'));
    const deepLinkAttr = this.getAttribute('deep-link-param');

    this.layer = createTutorialLayer({
      specs,
      context: { ...parseJson(this.getAttribute('context'), {}), ...this._context },
      theme: parseJson(this.getAttribute('theme'), undefined),
      locale: this.getAttribute('locale') ?? undefined,
      dir: (this.getAttribute('dir') as Direction) ?? undefined,
      zIndex: Number.isFinite(zIndex) && zIndex > 0 ? zIndex : undefined,
      interaction: (this.getAttribute('interaction') as InteractionMode) ?? undefined,
      deepLinkParam: deepLinkAttr === 'false' ? false : (deepLinkAttr ?? undefined),
      resume: has('resume'),
      autoResume: has('auto-resume'),
      isolate: has('isolate'),
      allowHtml: has('allow-html'),
      debug: has('debug'),
      // Re-emitted as DOM events so any framework can listen with its own syntax.
      onEvent: (e: TourEvent) => {
        this.dispatchEvent(new CustomEvent('opentutorial', { detail: e, bubbles: true, composed: true }));
        this.dispatchEvent(new CustomEvent(`ot-${e.type}`, { detail: e, bubbles: true, composed: true }));
      },
    });

    const autoStart = this.getAttribute('auto-start');
    if (autoStart) {
      void this.layer.ready.then(() => this.layer?.request(autoStart));
    }
  }

  // Imperative API, mirroring the vanilla layer.
  start(tourId: string, stepId?: string): void { this.layer?.start(tourId, stepId); }
  stop(): void { this.layer?.stop(); }
  pause(): void { this.layer?.pause(); }
  resumeTour(): void { this.layer?.resume(); }
  next(): void { this.layer?.next(); }
  prev(): void { this.layer?.prev(); }
  reset(): void { this.layer?.reset(); }
  getState(tourId?: string) { return this.layer?.getState(tourId) ?? null; }
  getLayer(): VanillaTutorialLayer | null { return this.layer; }
}

/** Registers `<open-tutorial>`. Safe to call more than once. */
export function defineOpenTutorialElement(tagName = 'open-tutorial'): void {
  if (typeof customElements === 'undefined') return;
  if (customElements.get(tagName)) return;
  customElements.define(tagName, OpenTutorialElement);
}
