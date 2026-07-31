/**
 * The overlay layer: a fixed container holding an SVG backdrop with a rounded
 * spotlight cutout, a ring highlight, and an optional interaction shield.
 *
 * Pointer behaviour is driven by the step's `interaction` mode:
 *   free        — the layer never intercepts input (default)
 *   target-only — four shield panels surround the target, leaving it clickable
 *   blocked     — the shield covers the whole viewport
 *
 * With `isolate: true` the layer lives in a shadow root, so host page CSS cannot
 * reach in and the library's own styles cannot leak out.
 */

import type { InteractionMode } from '../types';
import { CSS } from '../styles';

let uid = 0;

export interface SpotlightRect { x: number; y: number; width: number; height: number; }

export interface LayerOptions {
  container?: HTMLElement;
  isolate?: boolean;
  dir?: 'ltr' | 'rtl';
}

export class TourLayer {
  /** Children mount here — inside the shadow root when isolated. */
  readonly root: HTMLDivElement;
  /** The element actually placed in the host document. */
  private host: HTMLElement;
  private shadow: ShadowRoot | null = null;
  private svg: SVGSVGElement;
  private dimRect: SVGRectElement;
  private hole: SVGRectElement;
  private ring: HTMLDivElement;
  private shield: HTMLDivElement;
  private panels: HTMLDivElement[] = [];
  private current: (SpotlightRect & { padding: number; radius: number }) | null = null;
  private interaction: InteractionMode = 'free';
  private opts: LayerOptions;

  constructor(zIndex: number, opts: LayerOptions = {}) {
    uid += 1;
    const maskId = `ot-mask-${uid}`;
    this.opts = opts;

    this.root = document.createElement('div');
    this.root.className = 'ot-root';
    this.root.style.setProperty('--ot-z', String(zIndex));
    this.root.setAttribute('data-opentutorial', '');
    if (opts.dir) this.root.setAttribute('dir', opts.dir);

    if (opts.isolate) {
      this.host = document.createElement('div');
      this.host.setAttribute('data-opentutorial-host', '');
      this.host.style.cssText = 'position:fixed;inset:0;pointer-events:none;';
      this.host.style.zIndex = String(zIndex);
      try {
        this.shadow = this.host.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = CSS;
        this.shadow.appendChild(style);
        this.shadow.appendChild(this.root);
      } catch {
        // attachShadow throws on elements that already host a shadow root.
        this.shadow = null;
        this.host = this.root;
      }
    } else {
      this.host = this.root;
    }

    const NS = 'http://www.w3.org/2000/svg';
    this.svg = document.createElementNS(NS, 'svg');
    this.svg.setAttribute('class', 'ot-backdrop');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.setAttribute('aria-hidden', 'true');

    const defs = document.createElementNS(NS, 'defs');
    const mask = document.createElementNS(NS, 'mask');
    mask.setAttribute('id', maskId);

    const cover = document.createElementNS(NS, 'rect');
    cover.setAttribute('x', '0');
    cover.setAttribute('y', '0');
    cover.setAttribute('width', '100%');
    cover.setAttribute('height', '100%');
    cover.setAttribute('fill', 'white');

    this.hole = document.createElementNS(NS, 'rect');
    this.hole.setAttribute('fill', 'black');
    this.hole.setAttribute('rx', '12');
    this.setHole({ x: -9999, y: -9999, width: 0, height: 0 }, 0);

    mask.appendChild(cover);
    mask.appendChild(this.hole);
    defs.appendChild(mask);

    this.dimRect = document.createElementNS(NS, 'rect');
    this.dimRect.setAttribute('class', 'ot-dim');
    this.dimRect.setAttribute('x', '0');
    this.dimRect.setAttribute('y', '0');
    this.dimRect.setAttribute('width', '100%');
    this.dimRect.setAttribute('height', '100%');
    this.dimRect.setAttribute('mask', `url(#${maskId})`);

    this.svg.appendChild(defs);
    this.svg.appendChild(this.dimRect);

    this.ring = document.createElement('div');
    this.ring.className = 'ot-ring';
    this.ring.style.opacity = '0';

    this.shield = document.createElement('div');
    this.shield.className = 'ot-shield';
    this.shield.style.display = 'none';
    for (let i = 0; i < 4; i += 1) {
      const panel = document.createElement('div');
      panel.className = 'ot-shield-panel';
      this.panels.push(panel);
      this.shield.appendChild(panel);
    }

    this.root.appendChild(this.svg);
    this.root.appendChild(this.ring);
    this.root.appendChild(this.shield);

    this.svg.style.display = 'none';
  }

  private setHole(rect: SpotlightRect, padding: number): void {
    this.hole.setAttribute('x', String(rect.x - padding));
    this.hole.setAttribute('y', String(rect.y - padding));
    this.hole.setAttribute('width', String(Math.max(0, rect.width + padding * 2)));
    this.hole.setAttribute('height', String(Math.max(0, rect.height + padding * 2)));
  }

  /** Update the cutout + ring. Pass null to clear the spotlight. */
  updateSpotlight(rect: SpotlightRect | null, padding = 8, radius = 12): void {
    this.current = rect ? { ...rect, padding, radius } : null;
    if (!rect) {
      this.setHole({ x: -9999, y: -9999, width: 0, height: 0 }, 0);
      this.ring.style.opacity = '0';
      this.svg.style.display = 'none';
      this.applyShield();
      return;
    }
    this.svg.style.display = '';
    this.setHole(rect, padding);
    this.hole.setAttribute('rx', String(radius));
    const s = this.ring.style;
    s.opacity = '1';
    s.left = `${rect.x - padding}px`;
    s.top = `${rect.y - padding}px`;
    s.width = `${rect.width + padding * 2}px`;
    s.height = `${rect.height + padding * 2}px`;
    s.borderRadius = `${radius}px`;
    this.applyShield();
  }

  /** Dim the viewport with no cutout — for modal steps that have no target. */
  showBackdrop(): void {
    this.current = null;
    this.svg.style.display = '';
    this.setHole({ x: -9999, y: -9999, width: 0, height: 0 }, 0);
    this.ring.style.opacity = '0';
    this.applyShield();
  }

  setInteraction(mode: InteractionMode): void {
    this.interaction = mode;
    this.applyShield();
  }

  /**
   * Position the pointer-blocking panels. `target-only` leaves a rectangular gap
   * over the spotlight; `blocked` covers everything; `free` hides the shield.
   */
  private applyShield(): void {
    if (this.interaction === 'free') {
      this.shield.style.display = 'none';
      return;
    }
    this.shield.style.display = '';

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = this.interaction === 'target-only' && this.current
      ? {
          x: this.current.x - this.current.padding,
          y: this.current.y - this.current.padding,
          width: this.current.width + this.current.padding * 2,
          height: this.current.height + this.current.padding * 2,
        }
      : { x: vw, y: vh, width: 0, height: 0 };

    const [top, right, bottom, left] = this.panels;
    const place = (el: HTMLElement, x: number, y: number, w: number, h: number): void => {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.width = `${Math.max(0, w)}px`;
      el.style.height = `${Math.max(0, h)}px`;
    };

    place(top, 0, 0, vw, gap.y);
    place(bottom, 0, gap.y + gap.height, vw, vh - (gap.y + gap.height));
    place(left, 0, gap.y, gap.x, gap.height);
    place(right, gap.x + gap.width, gap.y, vw - (gap.x + gap.width), gap.height);
  }

  refresh(): void {
    if (this.current) this.updateSpotlight(this.current, this.current.padding, this.current.radius);
    else this.applyShield();
  }

  mountPopover(el: HTMLElement): void { this.root.appendChild(el); }

  setBackdropColor(color: string): void { this.dimRect.style.fill = color; }

  setDir(dir: 'ltr' | 'rtl'): void { this.root.setAttribute('dir', dir); }

  attach(parent?: HTMLElement): void {
    (parent ?? this.opts.container ?? document.body).appendChild(this.host);
  }

  destroy(): void { this.host.remove(); }
}
