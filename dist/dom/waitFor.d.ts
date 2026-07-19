/** Wait for an element to appear in the DOM (MutationObserver + polling fallback). */
export declare function waitForElement(selector: string, timeout?: number): Promise<Element | null>;
export declare function safeQuery(selector: string): Element | null;
