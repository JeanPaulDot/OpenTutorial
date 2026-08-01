import { type SurfaceHandle } from './shared';
import type { TourTarget } from '../types';
export interface HintOptions {
    target: TourTarget | string;
    /** Inline markdown. */
    content: string;
    /** Character shown in the dot. Default "?". */
    glyph?: string;
    openOnHover?: boolean;
    zIndex?: number;
    container?: HTMLElement | null;
    className?: string;
}
export interface HintHandle extends SurfaceHandle {
    open: () => void;
    close: () => void;
    /** Re-measure now, for hosts that move the target without resizing. */
    reposition: () => void;
}
/**
 * A standalone "what is this?" marker pinned to an element, framework-free.
 *
 * Position is recomputed on scroll, resize and layout changes rather than once
 * at mount, so the dot stays on its target in a scrolling or reflowing page.
 */
export declare function createHint(options: HintOptions): HintHandle;
