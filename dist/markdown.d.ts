/**
 * Tiny, safe inline-markdown renderer.
 * Escapes all HTML first, then applies the four allowed formats:
 * **bold**, *italic*, `code`, [link](https://…)
 */
export declare function escapeHtml(src: string): string;
export declare function renderInline(src: string): string;
