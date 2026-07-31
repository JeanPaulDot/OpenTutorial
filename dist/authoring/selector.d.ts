/**
 * Selector generation for the recorder.
 *
 * The hard part of authoring a tour is not writing copy — it is picking a
 * selector that still matches after the next deploy. This scores candidates by
 * how likely they are to survive: explicit test/tour hooks first, then stable
 * ids, then semantic attributes, and only as a last resort a positional path.
 */
export interface SelectorCandidate {
    selector: string;
    /** 0–100. Above 70 is safe to ship; below 40 will probably break. */
    score: number;
    reason: string;
    /** How many elements this selector matches right now. */
    matches: number;
}
/** Every viable selector for an element, best first. */
export declare function generateSelectors(el: Element, root?: Document): SelectorCandidate[];
export interface BestSelector {
    selector: string;
    score: number;
    reason: string;
    /** Lower-scored alternatives, usable as a `selector: []` fallback chain. */
    fallbacks: string[];
    /** Visible text, offered as a `target.text` fallback. */
    text?: string;
}
export declare function bestSelector(el: Element, root?: Document): BestSelector | null;
/** Check a set of selectors against the live page. Powers `lint-selectors`. */
export declare function auditSelectors(selectors: string[], root?: Document): Array<{
    selector: string;
    matches: number;
    ok: boolean;
    note?: string;
}>;
