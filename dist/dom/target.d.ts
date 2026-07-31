/**
 * Target resolution.
 *
 * A step's target can be a selector, an ordered list of fallback selectors, a
 * piece of visible text, or any of those scoped into a same-origin iframe or
 * through open shadow roots. Everything here is defensive: a malformed selector
 * or a cross-origin iframe yields `null`, never an exception.
 */
import type { TourTarget } from '../types';
export interface ResolvedTarget {
    element: Element;
    /** The document the element lives in — differs from `document` inside an iframe. */
    doc: Document;
    /** Offset to add to the element's rect to map it into the top-level viewport. */
    frameOffset: {
        x: number;
        y: number;
    };
    /** Which selector actually matched, for diagnostics. */
    matched: string;
}
export declare function safeQuery(selector: string, root?: ParentNode): Element | null;
export declare function safeQueryAll(selector: string, root?: ParentNode): Element[];
/** Query through open shadow roots as well as the light DOM. */
export declare function queryDeep(selector: string, root?: ParentNode): Element[];
export declare function isVisible(el: Element): boolean;
/** Resolve a target once. Returns null when nothing matches right now. */
export declare function resolveTarget(target: TourTarget): ResolvedTarget | null;
/** Human-readable description of a target, for error messages and the debug panel. */
export declare function describeTarget(target: TourTarget): string;
/**
 * Wait for a target to appear. Observes the relevant document and also polls,
 * because mutations inside a shadow root or an iframe that swaps documents are
 * not always observable from the top-level tree.
 */
export declare function waitForTarget(target: TourTarget, timeout?: number): Promise<ResolvedTarget | null>;
/** Back-compat: the old element-only helper. */
export declare function waitForElement(selector: string, timeout?: number): Promise<Element | null>;
