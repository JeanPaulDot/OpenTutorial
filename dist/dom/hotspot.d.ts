import type { DisplayMode } from '../types';
export interface HotspotModel {
    display: DisplayMode;
    content?: string;
    showDismiss?: boolean;
    onDismiss?: () => void;
}
interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * The non-blocking indicator used by `hotspot` and `beacon` steps: a pulsing dot
 * anchored to the target, optionally with a small tooltip beside it.
 */
export declare class TourHotspot {
    readonly el: HTMLDivElement;
    private beaconEl;
    private tooltipEl;
    private textEl;
    private dismissBtn;
    private lastRect;
    private hasTooltip;
    /** Held in a field so re-rendering never stacks duplicate listeners. */
    private onDismiss;
    constructor();
    render(model: HotspotModel, rect: Rect): void;
    private buildTooltip;
    private positionTooltip;
    reposition(newRect: Rect): void;
    focus(): void;
    destroy(): void;
}
export {};
