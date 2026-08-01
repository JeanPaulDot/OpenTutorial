/**
 * Content normalization and rendering.
 *
 * Authors may write `content` as a plain markdown string or as a list of typed
 * blocks. Everything downstream (the built-in popover, custom renderers, the
 * checklist) consumes the normalized block list, so there is exactly one shape
 * to handle.
 */
import type { ContentBlock, I18nContent, StepContent } from './types';
export type TextResolver = (content: I18nContent) => string;
/** Collapse any accepted content shape into a block list with i18n resolved. */
export declare function normalizeContent(content: StepContent, resolve: TextResolver): ContentBlock[];
/** Plain-text flattening, for aria-labels, the checklist and analytics. */
export declare function blocksToText(blocks: ContentBlock[]): string;
export interface RenderBlocksOptions {
    /** Allow `{ type: 'html' }` blocks through. Off unless the host opts in. */
    allowHtml?: boolean;
    /**
     * `'block'` (default) renders headings, lists, quotes and fences in text
     * content. `'inline'` restricts it to emphasis, code and links — use it when
     * a step's copy legitimately starts lines with `-` or `1.`.
     */
    markdown?: 'block' | 'inline';
    doc?: Document;
}
/** Build the DOM for a block list. Nothing here inserts unescaped author text. */
export declare function renderBlocks(blocks: ContentBlock[], opts?: RenderBlocksOptions): DocumentFragment;
