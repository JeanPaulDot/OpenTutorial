import type { TourTarget } from '../types';
export interface HintProps {
    target: TourTarget | string;
    content: string;
    /** Character shown in the dot. Default "?". */
    glyph?: string;
    /** Open on hover as well as click. */
    openOnHover?: boolean;
    zIndex?: number;
    className?: string;
}
/**
 * A standalone, always-available hint marker — not part of any flow.
 *
 * Useful for permanent "what is this?" affordances next to a dense control,
 * where a step-through tour would be overkill.
 */
export declare function Hint({ target, content, glyph, openOnHover, zIndex, className, }: HintProps): import("react").JSX.Element | null;
