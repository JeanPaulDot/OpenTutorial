import type { DisplayMode } from '../types';
import { renderInline } from '../markdown';

export interface HotspotModel {
  display: DisplayMode;
  content?: string;
  showDismiss?: boolean;
  onDismiss?: () => void;
}

interface Rect { x: number; y: number; width: number; height: number }

/**
 * The non-blocking indicator used by `hotspot` and `beacon` steps: a pulsing dot
 * anchored to the target, optionally with a small tooltip beside it.
 */
export class TourHotspot {
  readonly el: HTMLDivElement;
  private beaconEl: HTMLButtonElement;
  private tooltipEl: HTMLDivElement | null = null;
  private textEl: HTMLSpanElement | null = null;
  private dismissBtn: HTMLButtonElement | null = null;
  private lastRect: Rect | null = null;
  private hasTooltip = false;
  /** Held in a field so re-rendering never stacks duplicate listeners. */
  private onDismiss: (() => void) | null = null;

  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'ot-hotspot';

    this.beaconEl = document.createElement('button');
    this.beaconEl.type = 'button';
    this.beaconEl.className = 'ot-beacon';
    this.beaconEl.addEventListener('click', () => this.onDismiss?.());

    this.el.appendChild(this.beaconEl);
  }

  render(model: HotspotModel, rect: Rect): void {
    this.lastRect = rect;
    this.onDismiss = model.onDismiss ?? null;
    this.beaconEl.className = `ot-beacon ot-beacon--${model.display}`;

    this.el.style.left = `${rect.x + rect.width / 2}px`;
    this.el.style.top = `${rect.y + rect.height / 2}px`;
    this.el.style.pointerEvents = 'auto';

    const label = model.content?.trim() || 'Show me';
    this.beaconEl.setAttribute('aria-label', label);

    if (model.display === 'beacon') {
      this.hasTooltip = false;
      if (this.tooltipEl) this.tooltipEl.style.display = 'none';
      this.beaconEl.title = model.content ?? '';
    } else {
      this.hasTooltip = true;
      this.buildTooltip(model);
      this.positionTooltip(rect);
    }
  }

  private buildTooltip(model: HotspotModel): void {
    if (!this.tooltipEl) {
      this.tooltipEl = document.createElement('div');
      this.tooltipEl.className = 'ot-hotspot-tooltip';
      this.tooltipEl.setAttribute('role', 'status');

      this.textEl = document.createElement('span');
      this.textEl.className = 'ot-hotspot-text';
      this.tooltipEl.appendChild(this.textEl);

      this.el.appendChild(this.tooltipEl);
    }
    this.tooltipEl.style.display = 'flex';
    if (this.textEl) this.textEl.innerHTML = renderInline(model.content ?? '');

    const wantsDismiss = model.showDismiss || model.display === 'hotspot';
    if (wantsDismiss) {
      if (!this.dismissBtn) {
        this.dismissBtn = document.createElement('button');
        this.dismissBtn.type = 'button';
        this.dismissBtn.className = 'ot-hotspot-dismiss';
        this.dismissBtn.textContent = '→';
        this.dismissBtn.setAttribute('aria-label', 'Next step');
        this.dismissBtn.addEventListener('click', () => this.onDismiss?.());
      }
      this.tooltipEl.appendChild(this.dismissBtn);
    } else if (this.dismissBtn?.parentNode) {
      this.dismissBtn.remove();
    }
  }

  private positionTooltip(rect: Rect): void {
    if (!this.tooltipEl) return;
    const vw = window.innerWidth;
    const tooltipW = this.tooltipEl.offsetWidth || 200;
    const centerX = rect.x + rect.width / 2;
    const spaceRight = vw - (centerX + 16);
    const spaceLeft = centerX - 16;

    if (spaceRight > tooltipW) {
      this.tooltipEl.style.left = '12px';
      this.tooltipEl.style.right = 'auto';
    } else if (spaceLeft > tooltipW) {
      this.tooltipEl.style.right = '12px';
      this.tooltipEl.style.left = 'auto';
    } else {
      this.tooltipEl.style.left = `${Math.max(8, -(centerX - 8))}px`;
      this.tooltipEl.style.right = 'auto';
    }
    this.tooltipEl.style.top = '16px';
  }

  reposition(newRect: Rect): void {
    if (!this.lastRect) return;
    this.lastRect = newRect;
    this.el.style.left = `${newRect.x + newRect.width / 2}px`;
    this.el.style.top = `${newRect.y + newRect.height / 2}px`;
    if (this.hasTooltip) this.positionTooltip(newRect);
  }

  focus(): void { this.beaconEl.focus({ preventScroll: true }); }

  destroy(): void {
    this.onDismiss = null;
    this.el.remove();
  }
}
