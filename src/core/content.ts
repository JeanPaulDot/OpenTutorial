/**
 * Content normalization and rendering.
 *
 * Authors may write `content` as a plain markdown string or as a list of typed
 * blocks. Everything downstream (the built-in popover, custom renderers, the
 * checklist) consumes the normalized block list, so there is exactly one shape
 * to handle.
 */

import type { ContentBlock, I18nContent, StepContent } from './types';
import { renderInline, escapeHtml } from './markdown';

export type TextResolver = (content: I18nContent) => string;

/** Collapse any accepted content shape into a block list with i18n resolved. */
export function normalizeContent(content: StepContent, resolve: TextResolver): ContentBlock[] {
  if (content && typeof content === 'object' && 'blocks' in content && Array.isArray(content.blocks)) {
    return content.blocks.map((block) => {
      switch (block.type) {
        case 'text':
          return { type: 'text', value: resolve(block.value) };
        case 'list':
          return { ...block, items: block.items.map((item) => resolve(item)) };
        default:
          return block;
      }
    });
  }
  return [{ type: 'text', value: resolve(content as I18nContent) }];
}

/** Plain-text flattening, for aria-labels, the checklist and analytics. */
export function blocksToText(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'text': return typeof b.value === 'string' ? b.value : '';
        case 'list': return b.items.filter((i): i is string => typeof i === 'string').join(', ');
        case 'code': return b.value;
        case 'image': return b.alt;
        default: return '';
      }
    })
    .filter(Boolean)
    .join(' ');
}

export interface RenderBlocksOptions {
  /** Allow `{ type: 'html' }` blocks through. Off unless the host opts in. */
  allowHtml?: boolean;
  doc?: Document;
}

/** Build the DOM for a block list. Nothing here inserts unescaped author text. */
export function renderBlocks(blocks: ContentBlock[], opts: RenderBlocksOptions = {}): DocumentFragment {
  const doc = opts.doc ?? document;
  const frag = doc.createDocumentFragment();

  for (const block of blocks) {
    switch (block.type) {
      case 'text': {
        const p = doc.createElement('p');
        p.className = 'ot-content';
        p.innerHTML = renderInline(typeof block.value === 'string' ? block.value : '');
        frag.appendChild(p);
        break;
      }

      case 'image': {
        const img = doc.createElement('img');
        img.className = 'ot-media ot-media-image';
        img.src = block.src;
        img.alt = block.alt;
        img.loading = 'lazy';
        if (block.width) img.width = block.width;
        if (block.height) img.height = block.height;
        frag.appendChild(img);
        break;
      }

      case 'video': {
        const video = doc.createElement('video');
        video.className = 'ot-media ot-media-video';
        video.src = block.src;
        if (block.poster) video.poster = block.poster;
        video.controls = block.controls ?? true;
        video.loop = block.loop ?? false;
        video.muted = block.muted ?? block.autoplay ?? false;
        video.playsInline = true;
        if (block.autoplay) {
          video.autoplay = true;
          // Autoplay is only permitted when muted; forcing it avoids a silent
          // rejection that leaves the user staring at a blank frame.
          video.muted = true;
        }
        frag.appendChild(video);
        break;
      }

      case 'list': {
        const list = doc.createElement(block.ordered ? 'ol' : 'ul');
        list.className = 'ot-list';
        for (const item of block.items) {
          const li = doc.createElement('li');
          li.innerHTML = renderInline(typeof item === 'string' ? item : '');
          list.appendChild(li);
        }
        frag.appendChild(list);
        break;
      }

      case 'code': {
        const pre = doc.createElement('pre');
        pre.className = 'ot-code';
        const code = doc.createElement('code');
        if (block.lang) code.dataset.lang = block.lang;
        code.textContent = block.value;
        pre.appendChild(code);
        frag.appendChild(pre);
        break;
      }

      case 'divider': {
        const hr = doc.createElement('hr');
        hr.className = 'ot-divider';
        frag.appendChild(hr);
        break;
      }

      case 'html': {
        const div = doc.createElement('div');
        div.className = 'ot-html';
        // Opt-in only. Without `allowHtml` the markup is shown escaped rather
        // than silently dropped, so a misconfiguration is visible in review.
        div.innerHTML = opts.allowHtml ? block.value : escapeHtml(block.value);
        frag.appendChild(div);
        break;
      }
    }
  }

  return frag;
}
