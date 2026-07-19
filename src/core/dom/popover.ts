/**
 * The step popover: content, progress, navigation buttons, arrow, and a
 * positioning engine with flip + shift + alignment. Viewport-fixed.
 */

import type { AdvanceOn, Placement } from '../types';
import { renderInline } from '../markdown';

export interface PopoverModel {
  stepId: string;
  title: string;
  content: string;
  index: number;      // 0-based within visible steps
  total: number;
  canGoBack: boolean;
  skippable: boolean;
  isLast: boolean;
  advanceOn: AdvanceOn;
}

export interface PopoverCallbacks {
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'center' | 'end';

interface Rect { x: number; y: number; width: number; height: number; }

const GAP = 14;
const VIEWPORT_MARGIN = 10;

function parsePlacement(p: Placement): { side: Side | 'auto'; align: Align } {
  if (p === 'auto') return { side: 'auto', align: 'center' };
  const [side, align] = p.split('-') as [Side, (Align | undefined)];
  return { side, align: align ?? 'center' };
}

function opposite(side: Side): Side {
  return { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[side] as Side;
}

export class TourPopover {
  readonly el: HTMLDivElement;
  private titleEl: HTMLHeadingElement;
  private contentEl: HTMLParagraphElement;
  private progressEl: HTMLDivElement;
  private a11yProgressEl: HTMLSpanElement;
  private backBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private skipBtn: HTMLButtonElement;
  private arrow: HTMLDivElement;
  private lastSide: Side | 'modal' | null = null;
  private cbs: PopoverCallbacks;

  constructor(cbs: PopoverCallbacks) {
    this.cbs = cbs;
    this.el = document.createElement('div');
    this.el.className = 'ot-popover';
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    this.el.tabIndex = -1;

    this.arrow = document.createElement('div');
    this.arrow.className = 'ot-arrow';

    const body = document.createElement('div');
    body.className = 'ot-body';

    this.skipBtn = document.createElement('button');
    this.skipBtn.type = 'button';
    this.skipBtn.className = 'ot-skip';
    this.skipBtn.setAttribute('aria-label', 'Skip tour');
    this.skipBtn.innerHTML = '&times;';
    this.skipBtn.addEventListener('click', () => this.cbs.onSkip());

    this.titleEl = document.createElement('h3');
    this.titleEl.className = 'ot-title';
    this.titleEl.id = `ot-title-${Math.random().toString(36).slice(2, 8)}`;
    this.el.setAttribute('aria-labelledby', this.titleEl.id);

    this.contentEl = document.createElement('p');
    this.contentEl.className = 'ot-content';

    this.progressEl = document.createElement('div');
    this.progressEl.className = 'ot-dots';
    this.progressEl.setAttribute('aria-hidden', 'true');

    this.a11yProgressEl = document.createElement('span');
    this.a11yProgressEl.className = 'ot-sr-only';

    this.backBtn = document.createElement('button');
    this.backBtn.type = 'button';
    this.backBtn.className = 'ot-btn ot-btn-ghost';
    this.backBtn.textContent = 'Back';
    this.backBtn.addEventListener('click', () => this.cbs.onPrev());

    this.nextBtn = document.createElement('button');
    this.nextBtn.type = 'button';
    this.nextBtn.className = 'ot-btn ot-btn-primary';
    this.nextBtn.addEventListener('click', () => this.cbs.onNext());

    const footer = document.createElement('div');
    footer.className = 'ot-footer';
    const btns = document.createElement('div');
    btns.className = 'ot-btns';
    btns.appendChild(this.backBtn);
    btns.appendChild(this.nextBtn);
    footer.appendChild(this.progressEl);
    footer.appendChild(btns);

    body.appendChild(this.skipBtn);
    body.appendChild(this.titleEl);
    body.appendChild(this.contentEl);
    body.appendChild(this.a11yProgressEl);
    body.appendChild(footer);

    this.el.appendChild(this.arrow);
    this.el.appendChild(body);
  }

  render(model: PopoverModel): void {
    this.titleEl.textContent = model.title;
    this.contentEl.innerHTML = renderInline(model.content);

    this.a11yProgressEl.textContent = `Step ${model.index + 1} of ${model.total}`;
    this.progressEl.innerHTML = '';
    for (let i = 0; i < model.total; i += 1) {
      const dot = document.createElement('span');
      dot.className = `ot-dot${i === model.index ? ' ot-dot-active' : ''}`;
      this.progressEl.appendChild(dot);
    }

    this.backBtn.style.visibility = model.index === 0 || !model.canGoBack ? 'hidden' : 'visible';
    this.nextBtn.textContent = model.isLast ? 'Done' : 'Next';
    if (model.advanceOn !== 'button') this.nextBtn.textContent = model.isLast ? 'Done' : 'Skip step';
    this.skipBtn.style.display = model.skippable ? '' : 'none';
  }

  /** Position relative to a target rect (viewport coords), or centered when null. */
  position(target: Rect | null, placement: Placement, padding: number): void {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pw = this.el.offsetWidth;
    const ph = this.el.offsetHeight;

    if (!target) {
      this.lastSide = 'modal';
      this.el.classList.add('ot-modal');
      this.arrow.style.display = 'none';
      this.el.style.left = `${Math.max(VIEWPORT_MARGIN, (vw - pw) / 2)}px`;
      this.el.style.top = `${Math.max(VIEWPORT_MARGIN, (vh - ph) / 2)}px`;
      return;
    }
    this.el.classList.remove('ot-modal');
    this.arrow.style.display = '';

    const { side: wantedSide, align } = parsePlacement(placement);
    const gap = GAP + padding;

    const space: Record<Side, number> = {
      top: target.y,
      bottom: vh - (target.y + target.height),
      left: target.x,
      right: vw - (target.x + target.width),
    };

    const pickAuto = (): Side => {
      const order: Side[] = ['bottom', 'right', 'top', 'left'];
      return order.reduce((best, s) => (space[s] > space[best] ? s : best), 'bottom' as Side);
    };

    let side: Side = wantedSide === 'auto' ? pickAuto() : wantedSide;

    const fits = (s: Side): boolean =>
      s === 'top' || s === 'bottom' ? space[s] >= ph + gap : space[s] >= pw + gap;

    if (!fits(side)) {
      const opp = opposite(side);
      if (fits(opp)) side = opp;
      else if (!fits(side)) {
        // pick the side with the most space as a last resort
        side = (Object.keys(space) as Side[]).reduce((a, b) => (space[a] >= space[b] ? a : b));
      }
    }

    let left = 0;
    let top = 0;

    const alignAlong = (start: number, len: number, size: number): number => {
      if (align === 'start') return start;
      if (align === 'end') return start + len - size;
      return start + len / 2 - size / 2;
    };

    if (side === 'top' || side === 'bottom') {
      left = alignAlong(target.x, target.width, pw);
      top = side === 'top' ? target.y - ph - gap : target.y + target.height + gap;
    } else {
      top = alignAlong(target.y, target.height, ph);
      left = side === 'left' ? target.x - pw - gap : target.x + target.width + gap;
    }

    // shift into viewport
    left = Math.min(Math.max(left, VIEWPORT_MARGIN), Math.max(VIEWPORT_MARGIN, vw - pw - VIEWPORT_MARGIN));
    top = Math.min(Math.max(top, VIEWPORT_MARGIN), Math.max(VIEWPORT_MARGIN, vh - ph - VIEWPORT_MARGIN));

    this.el.style.left = `${left}px`;
    this.el.style.top = `${top}px`;
    this.lastSide = side;
    this.positionArrow(side, target, left, top, pw, ph);
  }

  private positionArrow(side: Side, target: Rect, left: number, top: number, pw: number, ph: number): void {
    const a = this.arrow.style;
    a.top = ''; a.bottom = ''; a.left = ''; a.right = '';
    this.arrow.dataset.side = side;
    const cx = target.x + target.width / 2;
    const cy = target.y + target.height / 2;
    if (side === 'top') {
      a.bottom = '-5px';
      a.left = `${Math.min(Math.max(cx - left, 16), pw - 16)}px`;
    } else if (side === 'bottom') {
      a.top = '-5px';
      a.left = `${Math.min(Math.max(cx - left, 16), pw - 16)}px`;
    } else if (side === 'left') {
      a.right = '-5px';
      a.top = `${Math.min(Math.max(cy - top, 16), ph - 16)}px`;
    } else {
      a.left = '-5px';
      a.top = `${Math.min(Math.max(cy - top, 16), ph - 16)}px`;
    }
  }

  getSide(): Side | 'modal' | null { return this.lastSide; }

  destroy(): void { this.el.remove(); }
}
