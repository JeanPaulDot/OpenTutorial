/**
 * Shared plumbing for the framework-neutral guidance surfaces.
 *
 * Every surface is a plain function that builds DOM and returns a handle. No
 * framework, no virtual DOM, no lifecycle to integrate with — which is the point:
 * Vue, Svelte, Angular, Solid, the Web Component and plain scripts all get the
 * same surfaces React has, and they all share these helpers so the markup and
 * the persistence rules cannot drift between them.
 */

import { TourPersistence } from '../persist';
import type { KeyValueStorage } from '../types';

export interface SurfaceHandle {
  /** The root element. Already mounted unless `container: null` was passed. */
  readonly el: HTMLElement;
  /** Attach (or move) the surface into a parent. */
  mount: (parent?: HTMLElement) => void;
  /** Remove from the DOM and release every listener. */
  destroy: () => void;
}

export interface DismissibleOptions {
  /** Stable id — the key dismissal is remembered under. */
  id: string;
  storage?: KeyValueStorage;
  keyPrefix?: string;
  /** Where to mount. `null` leaves the element detached for manual placement. */
  container?: HTMLElement | null;
}

/** Build an element in one call — the vanilla surfaces do this constantly. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  props: Partial<HTMLElementTagNameMap[K]> & { text?: string; html?: string } = {},
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  const { text, html, ...rest } = props;
  if (text !== undefined) el.textContent = text;
  if (html !== undefined) el.innerHTML = html;
  Object.assign(el, rest);
  return el;
}

export function button(className: string, label: string, onClick: () => void): HTMLButtonElement {
  const el = h('button', className, { type: 'button', text: label });
  el.addEventListener('click', onClick);
  return el;
}

/**
 * Collects teardown callbacks so a surface's `destroy()` is one call rather
 * than a list of `removeEventListener`s that drifts out of sync with the adds.
 */
export class Disposers {
  private fns: Array<() => void> = [];

  add(fn: () => void): void { this.fns.push(fn); }

  listen<T extends EventTarget>(
    target: T,
    type: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions,
  ): void {
    target.addEventListener(type, handler, options);
    this.fns.push(() => target.removeEventListener(type, handler, options));
  }

  run(): void {
    for (const fn of this.fns) { try { fn(); } catch { /* teardown is best-effort */ } }
    this.fns = [];
  }
}

/**
 * Seen/dismissed state for a surface.
 *
 * Reuses `TourPersistence` rather than inventing a second store, so a surface
 * honours the same `storage` adapter and `userId` namespacing tours do — a
 * banner dismissed as one user does not stay dismissed for the next.
 */
export class SurfaceState {
  readonly ready: Promise<void>;
  private persistence: TourPersistence;

  constructor(storage: KeyValueStorage | undefined, keyPrefix: string, userId?: string) {
    this.persistence = new TourPersistence(storage, keyPrefix, userId);
    this.ready = this.persistence.ready;
  }

  /** True when the surface should be shown. */
  shouldShow(id: string, opts: { once?: boolean; resurfaceAfter?: number } = {}): boolean {
    const { once = true, resurfaceAfter } = opts;
    if (!once) return true;
    const record = this.persistence.getRecord(id);
    if (!record?.at) return true;
    if (resurfaceAfter === undefined) return false;
    return Date.now() - record.at > resurfaceAfter;
  }

  markDismissed(id: string): void { this.persistence.mark(id, 'skipped'); }
  markActed(id: string): void { this.persistence.mark(id, 'completed'); }
  reset(id?: string): void { this.persistence.reset(id); }
}

/** Resolve `container` to a parent, honouring `null` as "do not mount". */
export function attach(el: HTMLElement, container: HTMLElement | null | undefined): void {
  if (container === null) return;
  (container ?? document.body).appendChild(el);
}

/** Standard handle over an element plus its disposers. */
export function makeHandle(el: HTMLElement, disposers: Disposers): SurfaceHandle {
  return {
    el,
    mount(parent) { (parent ?? document.body).appendChild(el); },
    destroy() {
      disposers.run();
      el.remove();
    },
  };
}
