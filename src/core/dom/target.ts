/**
 * Target resolution.
 *
 * A step's target can be a selector, an ordered list of fallback selectors, a
 * piece of visible text, or any of those scoped into a same-origin iframe or
 * through open shadow roots. Everything here is defensive: a malformed selector
 * or a cross-origin iframe yields `null`, never an exception.
 */

import type { TourTarget } from '../types';

export interface ResolvedTarget {
  element: Element;
  /** The document the element lives in — differs from `document` inside an iframe. */
  doc: Document;
  /** Offset to add to the element's rect to map it into the top-level viewport. */
  frameOffset: { x: number; y: number };
  /** Which selector actually matched, for diagnostics. */
  matched: string;
}

const TEXT_CANDIDATES =
  'button, a, [role], label, summary, h1, h2, h3, h4, h5, h6, p, li, td, th, span, div';

export function safeQuery(selector: string, root: ParentNode = document): Element | null {
  try { return root.querySelector(selector); } catch { return null; }
}

export function safeQueryAll(selector: string, root: ParentNode = document): Element[] {
  try { return Array.from(root.querySelectorAll(selector)); } catch { return []; }
}

/** Query through open shadow roots as well as the light DOM. */
export function queryDeep(selector: string, root: ParentNode = document): Element[] {
  const out = safeQueryAll(selector, root);
  const seen = new Set<ShadowRoot>();

  const walk = (node: ParentNode): void => {
    for (const el of safeQueryAll('*', node)) {
      const shadow = (el as Element & { shadowRoot?: ShadowRoot | null }).shadowRoot;
      if (!shadow || seen.has(shadow)) continue;
      seen.add(shadow);
      out.push(...safeQueryAll(selector, shadow));
      walk(shadow);
    }
  };
  walk(root);

  // Preserve document order and drop duplicates.
  return [...new Set(out)];
}

export function isVisible(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;
  const view = el.ownerDocument?.defaultView;
  if (!view) return true;
  const cs = view.getComputedStyle(el as HTMLElement);
  return cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0';
}

function normalizeText(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * Find the *most specific* element containing `text` — the deepest node whose
 * own text matches, so "Save" resolves to the button, not the surrounding form.
 */
function queryByText(text: string, scope: Element[] | null, root: ParentNode): Element | null {
  const needle = normalizeText(text);
  if (!needle) return null;
  const candidates = scope ?? safeQueryAll(TEXT_CANDIDATES, root);
  const matches = candidates.filter((el) => normalizeText(el.textContent ?? '').includes(needle));
  if (matches.length === 0) return null;

  // Exact matches beat substring matches; among equals, prefer the deepest.
  const exact = matches.filter((el) => normalizeText(el.textContent ?? '') === needle);
  const pool = exact.length ? exact : matches;
  return pool.reduce((best, el) => (best.contains(el) ? el : best));
}

function resolveDocument(target: TourTarget): { doc: Document; offset: { x: number; y: number } } | null {
  if (!target.iframe) return { doc: document, offset: { x: 0, y: 0 } };
  const frame = safeQuery(target.iframe) as HTMLIFrameElement | null;
  if (!frame) return null;
  try {
    const doc = frame.contentDocument;
    if (!doc) return null; // cross-origin
    const r = frame.getBoundingClientRect();
    return { doc, offset: { x: r.x, y: r.y } };
  } catch {
    return null; // cross-origin access threw
  }
}

/** Resolve a target once. Returns null when nothing matches right now. */
export function resolveTarget(target: TourTarget): ResolvedTarget | null {
  const frame = resolveDocument(target);
  if (!frame) return null;
  const { doc, offset } = frame;

  const selectors = target.selector
    ? (Array.isArray(target.selector) ? target.selector : [target.selector])
    : [];

  const pick = (list: Element[]): Element | null => {
    const filtered = target.visible ? list.filter(isVisible) : list;
    if (filtered.length === 0) return null;
    return filtered[target.index ?? 0] ?? null;
  };

  for (const selector of selectors) {
    const found = target.shadow ? queryDeep(selector, doc) : safeQueryAll(selector, doc);
    // When both a selector and text are given, the text narrows the selector's matches.
    if (target.text) {
      const el = queryByText(target.text, target.visible ? found.filter(isVisible) : found, doc);
      if (el) return { element: el, doc, frameOffset: offset, matched: selector };
      continue;
    }
    const el = pick(found);
    if (el) return { element: el, doc, frameOffset: offset, matched: selector };
  }

  if (selectors.length === 0 && target.text) {
    const el = queryByText(target.text, null, doc);
    if (el && (!target.visible || isVisible(el))) {
      return { element: el, doc, frameOffset: offset, matched: `text:${target.text}` };
    }
  }

  return null;
}

/** Human-readable description of a target, for error messages and the debug panel. */
export function describeTarget(target: TourTarget): string {
  const bits: string[] = [];
  if (target.selector) {
    bits.push(Array.isArray(target.selector) ? target.selector.join(' | ') : target.selector);
  }
  if (target.text) bits.push(`text "${target.text}"`);
  if (target.iframe) bits.push(`in iframe ${target.iframe}`);
  return bits.join(' + ') || '(no selector)';
}

/**
 * Wait for a target to appear. Observes the relevant document and also polls,
 * because mutations inside a shadow root or an iframe that swaps documents are
 * not always observable from the top-level tree.
 */
export function waitForTarget(target: TourTarget, timeout = 5000): Promise<ResolvedTarget | null> {
  return new Promise((resolve) => {
    const immediate = resolveTarget(target);
    if (immediate) { resolve(immediate); return; }

    let done = false;
    let observer: MutationObserver | null = null;

    const finish = (value: ResolvedTarget | null): void => {
      if (done) return;
      done = true;
      observer?.disconnect();
      clearInterval(poll);
      clearTimeout(deadline);
      resolve(value);
    };

    const check = (): void => {
      const found = resolveTarget(target);
      if (found) finish(found);
    };

    try {
      observer = new MutationObserver(check);
      const root = target.iframe
        ? (resolveDocument(target)?.doc.documentElement ?? document.documentElement)
        : document.documentElement;
      observer.observe(root, { childList: true, subtree: true, attributes: true });
    } catch { /* observation is an optimization; polling still covers us */ }

    const poll = setInterval(check, 100);
    const deadline = setTimeout(() => finish(null), timeout);
  });
}

/** Back-compat: the old element-only helper. */
export function waitForElement(selector: string, timeout = 5000): Promise<Element | null> {
  return waitForTarget({ selector }, timeout).then((r) => r?.element ?? null);
}
