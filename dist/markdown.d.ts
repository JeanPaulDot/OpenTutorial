/**
 * Tiny, safe inline-markdown renderer.
 * Escapes all HTML first, then applies the allowed formats:
 * **bold**, *italic*, `code`, ~~strike~~, [link](https://…) and newlines.
 */
export declare function escapeHtml(src: string): string;
export declare function renderInline(src: string): string;
