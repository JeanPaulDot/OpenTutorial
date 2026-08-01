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
export interface SpotlightRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface LayerOptions {
    container?: HTMLElement;
    isolate?: boolean;
    dir?: 'ltr' | 'rtl';
}
export declare class TourLayer {
    /** Children mount here — inside the shadow root when isolated. */
    readonly root: HTMLDivElement;
    /** The element actually placed in the host document. */
    private host;
    private shadow;
    private svg;
    private dimRect;
    private mask;
    private hole;
    private holes;
    private ring;
    private rings;
    private shield;
    private panels;
    private current;
    /** Every highlighted rect, when a step targets more than one element. */
    private currentAll;
    private interaction;
    private opts;
    constructor(zIndex: number, opts?: LayerOptions);
    /** Add a cutout to the mask pool. */
    private addHole;
    /** Add a highlight ring to the pool. */
    private addRing;
    private setHole;
    /** Smallest rect containing every input. Drives the popover and the shield. */
    private static union;
    /** Update the cutout + ring. Pass null to clear the spotlight. */
    /**
     * Update the cutout(s) and ring(s). Pass null to clear the spotlight.
     *
     * An array highlights several elements at once — "these three fields" — with
     * one cutout and one ring each. The popover and the interaction shield use
     * their union, because a four-panel shield cannot express a disjoint gap and a
     * popover has to point somewhere.
     */
    updateSpotlight(rect: SpotlightRect | SpotlightRect[] | null, padding?: number, radius?: number): void;
    /** Dim the viewport with no cutout — for modal steps that have no target. */
    showBackdrop(): void;
    setInteraction(mode: InteractionMode): void;
    /**
     * Position the pointer-blocking panels. `target-only` leaves a rectangular gap
     * over the spotlight; `blocked` covers everything; `free` hides the shield.
     */
    private applyShield;
    refresh(): void;
    /** The rects currently highlighted, for the popover to anchor against. */
    getSpotlightRects(): SpotlightRect[];
    mountPopover(el: HTMLElement): void;
    setBackdropColor(color: string): void;
    setDir(dir: 'ltr' | 'rtl'): void;
    attach(parent?: HTMLElement): void;
    destroy(): void;
}
