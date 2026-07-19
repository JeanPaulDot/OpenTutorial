/**
 * The step popover: content, progress, navigation buttons, arrow, and a
 * positioning engine with flip + shift + alignment. Viewport-fixed.
 */
import type { AdvanceOn, Placement } from '../types';
export interface PopoverModel {
    stepId: string;
    title: string;
    content: string;
    index: number;
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
    private a11yProgressEl;
    private backBtn;
    private nextBtn;
    private skipBtn;
    private arrow;
    private lastSide;
    private cbs;
    constructor(cbs: PopoverCallbacks);
    render(model: PopoverModel): void;
    /** Position relative to a target rect (viewport coords), or centered when null. */
    position(target: Rect | null, placement: Placement, padding: number): void;
    private positionArrow;
    getSide(): Side | 'modal' | null;
    destroy(): void;
}
export {};
