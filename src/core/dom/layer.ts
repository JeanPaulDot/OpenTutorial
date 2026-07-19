/**
 * The overlay layer: a fixed container holding an SVG backdrop with a
 * rounded-rect spotlight cutout, plus a ring highlight around the target.
 * The layer itself never blocks pointer events — only the popover does.
 */

let uid = 0;

export interface SpotlightRect { x: number; y: number; width: number; height: number; }

export class TourLayer {
  readonly root: HTMLDivElement;
  private svg: SVGSVGElement;
  private dimRect: SVGRectElement;
  private hole: SVGRectElement;
  private ring: HTMLDivElement;
  private current: (SpotlightRect & { padding: number; radius: number }) | null = null;

  constructor(zIndex: number) {
    uid += 1;
    const maskId = `ot-mask-${uid}`;

    this.root = document.createElement('div');
    this.root.className = 'ot-root';
    this.root.style.setProperty('--ot-z', String(zIndex));
    this.root.setAttribute('data-opentutorial', '');

    const NS = 'http://www.w3.org/2000/svg';
    this.svg = document.createElementNS(NS, 'svg');
    this.svg.setAttribute('class', 'ot-backdrop');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');

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

    this.root.appendChild(this.svg);
    this.root.appendChild(this.ring);

    // Start with the backdrop hidden — showSpotlight(rect) reveals it.
    this.svg.style.display = 'none';
  }

  private setHole(rect: SpotlightRect, padding: number): void {
    this.hole.setAttribute('x', String(rect.x - padding));
    this.hole.setAttribute('y', String(rect.y - padding));
    this.hole.setAttribute('width', String(Math.max(0, rect.width + padding * 2)));
    this.hole.setAttribute('height', String(Math.max(0, rect.height + padding * 2)));
  }

  /** Update the cutout + ring. Pass null for a fully dimmed (modal) state. */
  updateSpotlight(rect: SpotlightRect | null, padding = 8, radius = 12): void {
    this.current = rect ? { ...rect, padding, radius } : null;
    if (!rect) {
      this.setHole({ x: -9999, y: -9999, width: 0, height: 0 }, 0);
      this.ring.style.opacity = '0';
      this.svg.style.display = 'none';
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
  }

  refresh(): void {
    if (this.current) this.updateSpotlight(this.current, this.current.padding, this.current.radius);
  }

  mountPopover(el: HTMLElement): void { this.root.appendChild(el); }

  setBackdropColor(color: string): void {
    this.dimRect.style.fill = color;
  }

  attach(parent: HTMLElement = document.body): void { parent.appendChild(this.root); }

  destroy(): void { this.root.remove(); }
}
