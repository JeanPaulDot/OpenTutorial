/**
 * The overlay layer: a fixed container holding an SVG backdrop with a
 * rounded-rect spotlight cutout, plus a ring highlight around the target.
 * The layer itself never blocks pointer events — only the popover does.
 */
export interface SpotlightRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare class TourLayer {
    readonly root: HTMLDivElement;
    private svg;
    private dimRect;
    private hole;
    private ring;
    private current;
    constructor(zIndex: number);
    private setHole;
    /** Update the cutout + ring. Pass null for a fully dimmed (modal) state. */
    updateSpotlight(rect: SpotlightRect | null, padding?: number, radius?: number): void;
    refresh(): void;
    mountPopover(el: HTMLElement): void;
    setBackdropColor(color: string): void;
    attach(parent?: HTMLElement): void;
    destroy(): void;
}
