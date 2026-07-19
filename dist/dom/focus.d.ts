/** Focus trap + restore for the popover dialog. */
export interface TrapOptions {
    onEscape?: () => void;
    onArrowNext?: () => void;
    onArrowPrev?: () => void;
}
export declare function trapFocus(container: HTMLElement, opts?: TrapOptions): () => void;
