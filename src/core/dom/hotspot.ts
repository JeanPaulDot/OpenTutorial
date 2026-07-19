import type { DisplayMode } from '../types';

export interface HotspotModel {
  display: DisplayMode;
  content?: string;
  showDismiss?: boolean;
  onDismiss?: () => void;
}

export class TourHotspot {
  readonly el: HTMLDivElement;
  private beaconEl: HTMLDivElement;
  private tooltipEl: HTMLDivElement | null = null;
  private dismissBtn: HTMLButtonElement | null = null;
  private lastRect: { x: number; y: number; width: number; height: number } | null = null;
  private hasTooltip = false;

  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'ot-hotspot';

    this.beaconEl = document.createElement('div');
    this.beaconEl.className = 'ot-beacon';

    this.el.appendChild(this.beaconEl);
  }

  render(model: HotspotModel, rect: { x: number; y: number; width: number; height: number }): void {
    this.lastRect = rect;
    this.beaconEl.className = `ot-beacon ot-beacon--${model.display}`;

    this.el.style.left = `${rect.x + rect.width / 2}px`;
    this.el.style.top = `${rect.y + rect.height / 2}px`;
    this.el.style.pointerEvents = 'auto';

    const isBeacon = model.display === 'beacon';

    if (isBeacon) {
      this.hasTooltip = false;
      if (this.tooltipEl) this.tooltipEl.style.display = 'none';
      this.beaconEl.title = model.content ?? '';
      this.beaconEl.addEventListener('click', () => model.onDismiss?.(), { once: true });
    } else {
      this.hasTooltip = true;
      this.buildTooltip(model);
      this.positionTooltip(rect);
      this.beaconEl.addEventListener('click', () => model.onDismiss?.(), { once: true });
    }
  }

  private buildTooltip(model: HotspotModel): void {
    if (!this.tooltipEl) {
      this.tooltipEl = document.createElement('div');
      this.tooltipEl.className = 'ot-hotspot-tooltip';
      this.el.appendChild(this.tooltipEl);
    }
    this.tooltipEl.innerHTML = '';
    this.tooltipEl.style.display = 'flex';

    const textSpan = document.createElement('span');
    textSpan.className = 'ot-hotspot-text';
    textSpan.textContent = model.content ?? '';
    this.tooltipEl.appendChild(textSpan);

    if (model.showDismiss || model.display === 'hotspot') {
      if (!this.dismissBtn) {
        this.dismissBtn = document.createElement('button');
        this.dismissBtn.className = 'ot-hotspot-dismiss';
        this.dismissBtn.textContent = '→';
        this.dismissBtn.setAttribute('aria-label', 'Next step');
        this.dismissBtn.addEventListener('click', () => model.onDismiss?.());
      }
      this.tooltipEl.appendChild(this.dismissBtn);
    }
  }

  private positionTooltip(rect: { x: number; y: number; width: number; height: number }): void {
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

  reposition(newRect: { x: number; y: number; width: number; height: number }): void {
    if (!this.lastRect) return;
    this.lastRect = newRect;
    this.el.style.left = `${newRect.x + newRect.width / 2}px`;
    this.el.style.top = `${newRect.y + newRect.height / 2}px`;
    if (this.hasTooltip) this.positionTooltip(newRect);
  }

  destroy(): void {
    this.el.remove();
  }
}
