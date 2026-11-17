/**
 * The step popover: block content, progress, navigation, arrow, and a
 * positioning engine with flip + shift + alignment. Viewport-fixed.
 *
 * Placement is resolved in physical terms but authored logically: under
 * `dir="rtl"` a `left` placement is mirrored to `right` so specs do not need to
 * be rewritten per locale.
 */

import type { AdvanceOn, ContentBlock, Density, Direction, Placement } from '../types';
import { renderBlocks, type InteractiveHandlers } from '../content';

export interface PopoverLabels {
  next: string;
  back: string;
  done: string;
  skip: string;
}

export interface PopoverModel {
  stepId: string;
  title: string;
  blocks: ContentBlock[];
  index: number;      // 0-based within visible steps
  total: number;
  canGoBack: boolean;
  skippable: boolean;
  isLast: boolean;
  advanceOn: AdvanceOn;
  labels: PopoverLabels;
  showNext: boolean;
  showBack: boolean;
  /** Render centered with no arrow, regardless of target. */
  modal: boolean;
  allowHtml?: boolean;
  density?: Density;
  /** The step's `nextWhen` is unmet — render Next disabled. */
  nextDisabled?: boolean;
  /** Per-dot flag: true when that step can be jumped back to. */
  jumpable?: boolean[];
  /** The theme pins a width, so auto-sizing must not override it. */
  fixedWidth?: boolean;
}

export interface PopoverCallbacks {
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  /** Jump to the step behind a progress dot. */
  onJump?: (index: number) => void;
  /** Wiring for `input` / `choice` / `button` content blocks. */
  interactive?: InteractiveHandlers;
}

export interface PopoverOptions {
  /** Advance/rewind on horizontal touch swipes. Default true. */
  swipe?: boolean;
  /** Size the card from its content and the viewport. Default true. */
  autoSize?: boolean;
  /** Let the user drag the card by its title. Default false. */
  draggable?: boolean;
}

/** Width bounds for auto-sizing, before the viewport clamp. */
const MIN_WIDTH = 240;
const MAX_WIDTH = 460;
/** Never eat more than this share of the viewport height. */
const MAX_HEIGHT_RATIO = 0.7;

/** Horizontal travel that counts as a swipe rather than a tap or a scroll. */
const SWIPE_MIN_X = 56;
/** Vertical drift above this means the user was scrolling, not swiping. */
const SWIPE_MAX_Y = 44;
/** A slow drag is a selection or a scroll, not a gesture. */
const SWIPE_MAX_MS = 700;

type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'center' | 'end';

interface Rect { x: number; y: number; width: number; height: number; }

const GAP = 14;
const VIEWPORT_MARGIN = 10;

function parsePlacement(p: Placement): { side: Side | 'auto'; align: Align } {
  if (p === 'auto' || p === 'center') return { side: 'auto', align: 'center' };
  const [side, align] = p.split('-') as [Side, Align | undefined];
  return { side, align: align ?? 'center' };
}

function opposite(side: Side): Side {
  return { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[side] as Side;
}

function mirror(side: Side | 'auto'): Side | 'auto' {
  if (side === 'left') return 'right';
  if (side === 'right') return 'left';
  return side;
}

export class TourPopover {
  readonly el: HTMLDivElement;
  private titleEl: HTMLHeadingElement;
  private contentEl: HTMLDivElement;
  private progressEl: HTMLDivElement;
  private liveEl: HTMLSpanElement;
  private backBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private skipBtn: HTMLButtonElement;
  private arrow: HTMLDivElement;
  private lastSide: Side | 'modal' | null = null;
  private cbs: PopoverCallbacks;
  private dir: Direction;
  /** The last rendered model, so a swipe honours the same rules as the buttons. */
  private model: PopoverModel | null = null;
  private detachSwipe: (() => void) | null = null;
  private detachDrag: (() => void) | null = null;
  private autoSize = true;
  /** Set once the user has dragged the card; cleared when the step changes. */
  private dragged = false;

  constructor(cbs: PopoverCallbacks, dir: Direction = 'ltr', opts: PopoverOptions = {}) {
    this.cbs = cbs;
    this.dir = dir;
    this.autoSize = opts.autoSize !== false;

    this.el = document.createElement('div');
    this.el.className = 'ot-popover';
    this.el.setAttribute('role', 'dialog');
    this.el.tabIndex = -1;

    this.arrow = document.createElement('div');
    this.arrow.className = 'ot-arrow';

    const body = document.createElement('div');
    body.className = 'ot-body';

    this.skipBtn = document.createElement('button');
    this.skipBtn.type = 'button';
    this.skipBtn.className = 'ot-skip';
    this.skipBtn.setAttribute('aria-label', 'Close tour');
    this.skipBtn.innerHTML = '&times;';
    this.skipBtn.addEventListener('click', () => this.cbs.onSkip());

    this.titleEl = document.createElement('h2');
    this.titleEl.className = 'ot-title';
    this.titleEl.id = `ot-title-${Math.random().toString(36).slice(2, 8)}`;
    this.el.setAttribute('aria-labelledby', this.titleEl.id);

    this.contentEl = document.createElement('div');
    this.contentEl.className = 'ot-content-wrap';

    this.progressEl = document.createElement('div');
    this.progressEl.className = 'ot-dots';
    this.progressEl.setAttribute('aria-hidden', 'true');

    // Step changes are announced here rather than by re-reading the dialog,
    // which would interrupt a screen reader mid-sentence on every reposition.
    this.liveEl = document.createElement('span');
    this.liveEl.className = 'ot-sr-only';
    this.liveEl.setAttribute('aria-live', 'polite');
    this.liveEl.setAttribute('aria-atomic', 'true');

    this.backBtn = document.createElement('button');
    this.backBtn.type = 'button';
    this.backBtn.className = 'ot-btn ot-btn-ghost';
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
    body.appendChild(this.liveEl);
    body.appendChild(footer);

    this.el.appendChild(this.arrow);
    this.el.appendChild(body);

    if (opts.swipe !== false) this.installSwipe();
    if (opts.draggable) this.installDrag();
  }

  /**
   * Drag the card by its title.
   *
   * A tour that covers the thing it is describing is a real complaint, and no
   * placement algorithm fixes every layout. Once dragged, the card stays where
   * the user put it until the step changes — automatic repositioning would
   * fight them on every scroll frame otherwise.
   */
  private installDrag(): void {
    this.el.classList.add('ot-popover--draggable');
    let startX = 0;
    let startY = 0;
    let originLeft = 0;
    let originTop = 0;
    let active = false;

    const onMove = (e: PointerEvent): void => {
      if (!active) return;
      const view = this.el.ownerDocument?.defaultView ?? window;
      const maxLeft = Math.max(VIEWPORT_MARGIN, view.innerWidth - this.el.offsetWidth - VIEWPORT_MARGIN);
      const maxTop = Math.max(VIEWPORT_MARGIN, view.innerHeight - this.el.offsetHeight - VIEWPORT_MARGIN);
      const left = Math.min(Math.max(originLeft + e.clientX - startX, VIEWPORT_MARGIN), maxLeft);
      const top = Math.min(Math.max(originTop + e.clientY - startY, VIEWPORT_MARGIN), maxTop);
      this.el.style.left = `${left}px`;
      this.el.style.top = `${top}px`;
      // The arrow would now point at nothing.
      this.arrow.style.display = 'none';
      this.dragged = true;
    };

    const onUp = (): void => {
      active = false;
      this.el.classList.remove('ot-popover--dragging');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    const onDown = (e: PointerEvent): void => {
      if (e.button !== 0) return;
      // The mobile bottom sheet is docked; dragging it would only undock it.
      if ((this.el.ownerDocument?.defaultView ?? window).innerWidth <= 480) return;
      active = true;
      startX = e.clientX;
      startY = e.clientY;
      originLeft = parseFloat(this.el.style.left) || 0;
      originTop = parseFloat(this.el.style.top) || 0;
      this.el.classList.add('ot-popover--dragging');
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      e.preventDefault();
    };

    this.titleEl.addEventListener('pointerdown', onDown);
    this.detachDrag = () => {
      this.titleEl.removeEventListener('pointerdown', onDown);
      onUp();
    };
  }

  /** True when the user has moved the card for the current step. */
  isDragged(): boolean { return this.dragged; }

  /** Flip the Next button without re-rendering — used as `nextWhen` changes. */
  setNextDisabled(disabled: boolean): void {
    this.nextBtn.disabled = disabled;
    this.nextBtn.setAttribute('aria-disabled', String(disabled));
    if (this.model) this.model = { ...this.model, nextDisabled: disabled };
  }

  /**
   * True while focus is on a control inside the step body. The engine checks
   * this before re-rendering, so typing into a field never loses the caret.
   */
  contentHasFocus(): boolean {
    const root = this.el.getRootNode() as Document | ShadowRoot;
    const active = root.activeElement ?? document.activeElement;
    return !!active && this.contentEl.contains(active);
  }

  /**
   * Horizontal touch swipes move between steps on mobile, where the popover is
   * docked as a bottom sheet and the buttons are a thumb-stretch away.
   *
   * Gated on the rendered model rather than fired blind: a step that advances on
   * `target-click` hides its Next button, and a swipe must not be a way around
   * that. Gestures starting on a control or inside a horizontally scrollable
   * block are ignored so the popover never eats a legitimate interaction.
   */
  private installSwipe(): void {
    let startX = 0;
    let startY = 0;
    let startAt = 0;
    let tracking = false;

    const onStart = (e: TouchEvent): void => {
      if (e.touches.length !== 1) { tracking = false; return; }
      const target = e.target as Element | null;
      if (target?.closest('button, a, input, textarea, select, video, audio, [data-ot-no-swipe]')) {
        tracking = false;
        return;
      }
      if (target && this.isScrollableX(target)) { tracking = false; return; }
      tracking = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startAt = Date.now();
    };

    const onEnd = (e: TouchEvent): void => {
      if (!tracking) return;
      tracking = false;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Date.now() - startAt > SWIPE_MAX_MS) return;
      if (Math.abs(dy) > SWIPE_MAX_Y || Math.abs(dx) < SWIPE_MIN_X) return;

      // In RTL the reading order flips, so "forward" is a swipe to the right.
      const forward = this.dir === 'rtl' ? dx > 0 : dx < 0;
      const model = this.model;
      if (!model) return;

      if (forward) {
        if (model.showNext && !model.nextDisabled) this.cbs.onNext();
      } else if (model.showBack && model.canGoBack && model.index > 0) {
        this.cbs.onPrev();
      }
    };

    this.el.addEventListener('touchstart', onStart, { passive: true });
    this.el.addEventListener('touchend', onEnd, { passive: true });
    this.detachSwipe = () => {
      this.el.removeEventListener('touchstart', onStart);
      this.el.removeEventListener('touchend', onEnd);
    };
  }

  private isScrollableX(from: Element): boolean {
    let node: Element | null = from;
    while (node && node !== this.el) {
      if (node.scrollWidth > node.clientWidth + 1) return true;
      node = node.parentElement;
    }
    return false;
  }

  setDir(dir: Direction): void { this.dir = dir; }

  render(model: PopoverModel): void {
    // A new step gets a fresh automatic position; a re-render of the same step
    // keeps wherever the user dragged it.
    if (this.model?.stepId !== model.stepId) this.dragged = false;

    this.model = model;
    this.titleEl.textContent = model.title;

    this.contentEl.replaceChildren(
      renderBlocks(model.blocks, { allowHtml: model.allowHtml, interactive: this.cbs.interactive }),
    );

    this.liveEl.textContent = `${model.title}. Step ${model.index + 1} of ${model.total}`;

    this.progressEl.replaceChildren();
    const anyJumpable = !!this.cbs.onJump && !!model.jumpable?.some(Boolean);
    // Purely decorative dots stay hidden from assistive tech (the live region
    // already announces position); navigable ones are real buttons.
    if (anyJumpable) this.progressEl.removeAttribute('aria-hidden');
    else this.progressEl.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < model.total; i += 1) {
      const active = i === model.index;
      if (anyJumpable && model.jumpable?.[i] && !active) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'ot-dot ot-dot-jump';
        dot.setAttribute('aria-label', `Go to step ${i + 1}`);
        dot.addEventListener('click', () => this.cbs.onJump?.(i));
        this.progressEl.appendChild(dot);
      } else {
        const dot = document.createElement('span');
        dot.className = `ot-dot${active ? ' ot-dot-active' : ''}`;
        if (anyJumpable) dot.setAttribute('aria-hidden', 'true');
        this.progressEl.appendChild(dot);
      }
    }

    const showBack = model.showBack && model.canGoBack && model.index > 0;
    this.backBtn.style.display = showBack ? '' : 'none';
    this.backBtn.textContent = model.labels.back;

    this.nextBtn.style.display = model.showNext ? '' : 'none';
    this.nextBtn.textContent = model.isLast ? model.labels.done : model.labels.next;
    this.nextBtn.disabled = !!model.nextDisabled;
    this.nextBtn.setAttribute('aria-disabled', String(!!model.nextDisabled));

    this.skipBtn.style.display = model.skippable ? '' : 'none';
    this.skipBtn.setAttribute('aria-label', model.labels.skip);

    // A modal step owns the screen; a tooltip alongside a still-usable page
    // must not claim to be modal or screen readers will hide the rest of it.
    this.el.setAttribute('aria-modal', model.modal ? 'true' : 'false');
    this.el.classList.toggle('ot-popover--modal-step', model.modal);

    // Density is a data attribute rather than a class so a host can target it
    // in CSS without knowing our class-name scheme.
    if (model.density) this.el.dataset.otDensity = model.density;
    else delete this.el.dataset.otDensity;

    this.applyAutoSize();
  }

  /**
   * Pick a width from the content and a max-height from the viewport.
   *
   * A fixed 340px card is wrong twice: a one-line step looks empty in it, and a
   * step with a code block or an image overflows it. Measuring the natural
   * width once per render costs a single forced layout and makes the card fit
   * what it actually holds.
   *
   * Height is capped rather than sized, so long content scrolls inside the card
   * instead of running off the bottom of the screen — which is what used to
   * happen on a short viewport.
   */
  private applyAutoSize(): void {
    const view = this.el.ownerDocument?.defaultView ?? window;
    const vh = view.innerHeight;
    const vw = view.innerWidth;

    // The mobile bottom sheet is full-bleed by design; leave it alone.
    const isSheet = vw <= 480;
    this.el.style.maxHeight = `${Math.round(vh * MAX_HEIGHT_RATIO)}px`;

    if (!this.autoSize || isSheet || this.model?.fixedWidth) {
      this.el.style.width = '';
      return;
    }

    // Measure at the natural content width, then clamp.
    this.el.style.width = 'max-content';
    const natural = this.el.offsetWidth;
    this.el.style.width = '';

    const ceiling = Math.min(MAX_WIDTH, vw - VIEWPORT_MARGIN * 2);
    const floor = Math.min(MIN_WIDTH, ceiling);
    const width = Math.max(floor, Math.min(natural, ceiling));

    this.el.style.width = `${Math.round(width)}px`;
  }

  /** Position relative to a target rect (viewport coords), or centered when null. */
  position(target: Rect | null, placement: Placement, padding: number): void {
    // The user put the card somewhere on purpose; leave it there.
    if (this.dragged) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pw = this.el.offsetWidth;
    const ph = this.el.offsetHeight;

    if (!target || placement === 'center') {
      this.lastSide = 'modal';
      this.el.classList.add('ot-modal');
      this.arrow.style.display = 'none';
      this.el.style.left = `${Math.max(VIEWPORT_MARGIN, (vw - pw) / 2)}px`;
      this.el.style.top = `${Math.max(VIEWPORT_MARGIN, (vh - ph) / 2)}px`;
      return;
    }
    this.el.classList.remove('ot-modal');
    this.arrow.style.display = '';

    const parsed = parsePlacement(placement);
    const wantedSide = this.dir === 'rtl' ? mirror(parsed.side) : parsed.side;
    const align = parsed.align;
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
      else side = (Object.keys(space) as Side[]).reduce((a, b) => (space[a] >= space[b] ? a : b));
    }

    let left = 0;
    let top = 0;

    const alignAlong = (start: number, len: number, size: number): number => {
      if (align === 'start') return this.dir === 'rtl' ? start + len - size : start;
      if (align === 'end') return this.dir === 'rtl' ? start : start + len - size;
      return start + len / 2 - size / 2;
    };

    if (side === 'top' || side === 'bottom') {
      left = alignAlong(target.x, target.width, pw);
      top = side === 'top' ? target.y - ph - gap : target.y + target.height + gap;
    } else {
      top = alignAlong(target.y, target.height, ph);
      left = side === 'left' ? target.x - pw - gap : target.x + target.width + gap;
    }

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
      a.left = `${Math.min(Math.max(cx - left, 16), Math.max(16, pw - 16))}px`;
    } else if (side === 'bottom') {
      a.top = '-5px';
      a.left = `${Math.min(Math.max(cx - left, 16), Math.max(16, pw - 16))}px`;
    } else if (side === 'left') {
      a.right = '-5px';
      a.top = `${Math.min(Math.max(cy - top, 16), Math.max(16, ph - 16))}px`;
    } else {
      a.left = '-5px';
      a.top = `${Math.min(Math.max(cy - top, 16), Math.max(16, ph - 16))}px`;
    }
  }

  getSide(): Side | 'modal' | null { return this.lastSide; }

  destroy(): void {
    this.detachSwipe?.();
    this.detachSwipe = null;
    this.detachDrag?.();
    this.detachDrag = null;
    this.el.remove();
  }
}
