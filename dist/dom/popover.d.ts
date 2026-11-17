/**
 * The step popover: block content, progress, navigation, arrow, and a
 * positioning engine with flip + shift + alignment. Viewport-fixed.
 *
 * Placement is resolved in physical terms but authored logically: under
 * `dir="rtl"` a `left` placement is mirrored to `right` so specs do not need to
 * be rewritten per locale.
 */
import type { AdvanceOn, ContentBlock, Density, Direction, Placement } from '../types';
import { type InteractiveHandlers } from '../content';
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
    private detachDrag;
    private autoSize;
    /** Set once the user has dragged the card; cleared when the step changes. */
    private dragged;
    constructor(cbs: PopoverCallbacks, dir?: Direction, opts?: PopoverOptions);
    /**
     * Drag the card by its title.
     *
     * A tour that covers the thing it is describing is a real complaint, and no
     * placement algorithm fixes every layout. Once dragged, the card stays where
     * the user put it until the step changes — automatic repositioning would
     * fight them on every scroll frame otherwise.
     */
    private installDrag;
    /** True when the user has moved the card for the current step. */
    isDragged(): boolean;
    /** Flip the Next button without re-rendering — used as `nextWhen` changes. */
    setNextDisabled(disabled: boolean): void;
    /**
     * True while focus is on a control inside the step body. The engine checks
     * this before re-rendering, so typing into a field never loses the caret.
     */
    contentHasFocus(): boolean;
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
    private applyAutoSize;
    /** Position relative to a target rect (viewport coords), or centered when null. */
    position(target: Rect | null, placement: Placement, padding: number): void;
    private positionArrow;
    getSide(): Side | 'modal' | null;
    destroy(): void;
}
export {};
