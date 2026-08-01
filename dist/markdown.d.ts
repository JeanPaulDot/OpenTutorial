/**
 * A small, safe markdown renderer.
 *
 * Two entry points:
 *   renderInline   — emphasis, code, links, images. No block structure.
 *   renderMarkdown — the above plus headings, lists, quotes, fences and rules.
 *
 * Everything is **escaped before it is formatted**, never after. That ordering is
 * the whole security model: author text becomes inert HTML entities first, so a
 * spec fetched from a database or written by a non-engineer cannot inject markup,
 * and there is no sanitizer to keep ahead of attackers.
 */
export declare function escapeHtml(src: string): string;
export interface InlineOptions {
    /** Convert newlines to `<br>`. Off inside block rendering, which owns layout. */
    breaks?: boolean;
}
export declare function renderInline(src: string, opts?: InlineOptions): string;
/**
 * Render block-level markdown.
 *
 * Deliberately not CommonMark: there is no nested-list support, no reference
 * links and no inline HTML. A tour step is a paragraph or two, and every feature
 * beyond that is surface area an author can get wrong and a reviewer has to
 * check. Anything richer belongs in a content block.
 */
export declare function renderMarkdown(src: string): string;
/** True when the source uses any block-level syntax. */
export declare function hasBlockMarkdown(src: string): boolean;
