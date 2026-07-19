import type { DisplayMode } from '../types';
export interface HotspotModel {
    display: DisplayMode;
    content?: string;
    showDismiss?: boolean;
    onDismiss?: () => void;
}
export declare class TourHotspot {
    readonly el: HTMLDivElement;
    private beaconEl;
    private tooltipEl;
    private dismissBtn;
    private lastRect;
    private hasTooltip;
    constructor();
    render(model: HotspotModel, rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): void;
    private buildTooltip;
    private positionTooltip;
    reposition(newRect: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): void;
    destroy(): void;
}
