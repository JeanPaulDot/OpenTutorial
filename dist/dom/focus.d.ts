/** Focus trap + restore for the popover dialog. */
export interface TrapOptions {
    onEscape?: () => void;
    onArrowNext?: () => void;
    onArrowPrev?: () => void;
    /** Confine Tab to the dialog. Off for non-blocking steps so the page stays reachable. */
    trap?: boolean;
    /** Move focus into the dialog on mount. Default true. */
    autoFocus?: boolean;
}
export declare function trapFocus(container: HTMLElement, opts?: TrapOptions): () => void;
