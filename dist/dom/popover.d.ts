/**
 * The step popover: block content, progress, navigation, arrow, and a
 * positioning engine with flip + shift + alignment. Viewport-fixed.
 *
 * Placement is resolved in physical terms but authored logically: under
 * `dir="rtl"` a `left` placement is mirrored to `right` so specs do not need to
 * be rewritten per locale.
 */
import type { AdvanceOn, ContentBlock, Direction, Placement } from '../types';
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
    index: number;
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
}
export interface PopoverCallbacks {
    onNext: () => void;
    onPrev: () => void;
    onSkip: () => void;
}
export interface PopoverOptions {
    /** Advance/rewind on horizontal touch swipes. Default true. */
    swipe?: boolean;
}
type Side = 'top' | 'bottom' | 'left' | 'right';
interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare class TourPopover {
    readonly el: HTMLDivElement;
    private titleEl;
    private contentEl;
    private progressEl;
    private liveEl;
    private backBtn;
    private nextBtn;
    private skipBtn;
    private arrow;
    private lastSide;
    private cbs;
    private dir;
    /** The last rendered model, so a swipe honours the same rules as the buttons. */
    private model;
    private detachSwipe;
    constructor(cbs: PopoverCallbacks, dir?: Direction, opts?: PopoverOptions);
    /**
     * Horizontal touch swipes move between steps on mobile, where the popover is
     * docked as a bottom sheet and the buttons are a thumb-stretch away.
     *
     * Gated on the rendered model rather than fired blind: a step that advances on
     * `target-click` hides its Next button, and a swipe must not be a way around
     * that. Gestures starting on a control or inside a horizontally scrollable
     * block are ignored so the popover never eats a legitimate interaction.
     */
    private installSwipe;
    private isScrollableX;
    setDir(dir: Direction): void;
    render(model: PopoverModel): void;
    /** Position relative to a target rect (viewport coords), or centered when null. */
    position(target: Rect | null, placement: Placement, padding: number): void;
    private positionArrow;
    getSide(): Side | 'modal' | null;
    destroy(): void;
}
export {};
