/**
 * Content normalization and rendering.
 *
 * Authors may write `content` as a plain markdown string or as a list of typed
 * blocks. Everything downstream (the built-in popover, custom renderers, the
 * checklist) consumes the normalized block list, so there is exactly one shape
 * to handle.
 */

import type { BlockAction, ContentBlock, I18nContent, StepContent } from './types';
import { renderInline, renderMarkdown, hasBlockMarkdown, escapeHtml } from './markdown';

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
        case 'input':
          return {
            ...block,
            ...(block.label !== undefined ? { label: resolve(block.label) } : {}),
            ...(block.placeholder !== undefined ? { placeholder: resolve(block.placeholder) } : {}),
          };
        case 'choice':
          return {
            ...block,
            ...(block.label !== undefined ? { label: resolve(block.label) } : {}),
            options: block.options.map((option) =>
              (typeof option === 'string'
                ? { label: option, value: option }
                : { label: resolve(option.label), value: option.value })),
          };
        case 'button':
          return { ...block, label: resolve(block.label) };
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
        case 'input':
        case 'choice':
        case 'button': return typeof b.label === 'string' ? b.label : '';
        default: return '';
      }
    })
    .filter(Boolean)
    .join(' ');
}

export interface RenderBlocksOptions {
  /** Allow `{ type: 'html' }` blocks through. Off unless the host opts in. */
  allowHtml?: boolean;
  /**
   * `'block'` (default) renders headings, lists, quotes and fences in text
   * content. `'inline'` restricts it to emphasis, code and links — use it when
   * a step's copy legitimately starts lines with `-` or `1.`.
   */
  markdown?: 'block' | 'inline';
  /**
   * Wiring for `input`, `choice` and `button` blocks. Without it those blocks
   * are skipped: a field that silently goes nowhere is worse than no field.
   */
  interactive?: InteractiveHandlers;
  doc?: Document;
}

export interface InteractiveHandlers {
  /** Current value for a named field, so a re-render keeps what was typed. */
  getValue: (name: string) => unknown;
  /** Called on every change. */
  setValue: (name: string, value: unknown, kind: 'input' | 'choice') => void;
  /** Called when a `button` block is pressed. */
  runAction: (action: BlockAction, label: string) => void;
}

let fieldUid = 0;

/** Build the DOM for a block list. Nothing here inserts unescaped author text. */
export function renderBlocks(blocks: ContentBlock[], opts: RenderBlocksOptions = {}): DocumentFragment {
  const doc = opts.doc ?? document;
  const frag = doc.createDocumentFragment();

  for (const block of blocks) {
    switch (block.type) {
      case 'text': {
        const value = typeof block.value === 'string' ? block.value : '';

        // Block syntax (headings, lists, quotes, fences) needs a container that
        // can hold several elements; a plain paragraph would nest them illegally.
        // Prose without any of it stays a single <p>, which is the common case
        // and keeps the markup as light as it was before block markdown existed.
        if (opts.markdown !== 'inline' && hasBlockMarkdown(value)) {
          const wrap = doc.createElement('div');
          wrap.className = 'ot-prose';
          wrap.innerHTML = renderMarkdown(value);
          frag.appendChild(wrap);
        } else {
          const p = doc.createElement('p');
          p.className = 'ot-content';
          p.innerHTML = renderInline(value);
          frag.appendChild(p);
        }
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

      case 'input': {
        const io = opts.interactive;
        if (!io) break;
        fieldUid += 1;
        const id = `ot-field-${fieldUid}`;
        const hasLabel = typeof block.label === 'string' && block.label !== '';

        const wrap = doc.createElement('div');
        wrap.className = 'ot-field';

        if (hasLabel) {
          const label = doc.createElement('label');
          label.className = 'ot-field-label';
          label.htmlFor = id;
          label.textContent = block.label as string;
          wrap.appendChild(label);
        }

        const field = block.multiline ? doc.createElement('textarea') : doc.createElement('input');
        field.className = 'ot-input';
        field.id = id;
        field.name = block.name;
        field.dataset.otName = block.name;
        if (!block.multiline) (field as HTMLInputElement).type = block.inputType ?? 'text';
        if (typeof block.placeholder === 'string') field.placeholder = block.placeholder;
        // Without a visible label, the placeholder (or the name) is the only
        // thing a screen reader can announce.
        if (!hasLabel) {
          field.setAttribute(
            'aria-label',
            typeof block.placeholder === 'string' && block.placeholder ? block.placeholder : block.name,
          );
        }

        const current = io.getValue(block.name);
        if (current !== undefined && current !== null) field.value = String(current);

        field.addEventListener('input', () => {
          const raw = field.value;
          // A number field writes a number, so `seats > 3` works in an
          // expression without the author remembering to coerce.
          const value = block.inputType === 'number' && raw.trim() !== '' && Number.isFinite(Number(raw))
            ? Number(raw)
            : raw;
          io.setValue(block.name, value, 'input');
        });

        wrap.appendChild(field);
        frag.appendChild(wrap);
        break;
      }

      case 'choice': {
        const io = opts.interactive;
        if (!io) break;

        const group = doc.createElement('div');
        group.className = 'ot-choice';
        group.dataset.otName = block.name;
        group.setAttribute('role', block.multiple ? 'group' : 'radiogroup');
        if (typeof block.label === 'string' && block.label) {
          const label = doc.createElement('div');
          label.className = 'ot-field-label';
          label.textContent = block.label;
          fieldUid += 1;
          label.id = `ot-field-${fieldUid}`;
          group.setAttribute('aria-labelledby', label.id);
          group.appendChild(label);
        } else {
          group.setAttribute('aria-label', block.name);
        }

        const options = block.options.map((option) =>
          (typeof option === 'string' ? { label: option, value: option } : option));

        const selected = (): unknown[] => {
          const value = io.getValue(block.name);
          if (block.multiple) return Array.isArray(value) ? value : [];
          return value === undefined ? [] : [value];
        };

        const buttons: HTMLButtonElement[] = [];
        const paint = (): void => {
          const now = selected();
          buttons.forEach((btn, i) => {
            const on = now.includes(options[i].value);
            btn.classList.toggle('ot-choice-option--selected', on);
            btn.setAttribute('aria-checked', String(on));
          });
        };

        const list = doc.createElement('div');
        list.className = 'ot-choice-options';
        options.forEach((option) => {
          const btn = doc.createElement('button');
          btn.type = 'button';
          btn.className = 'ot-choice-option';
          btn.setAttribute('role', block.multiple ? 'checkbox' : 'radio');
          btn.textContent = typeof option.label === 'string' ? option.label : String(option.value);
          btn.addEventListener('click', () => {
            if (block.multiple) {
              const now = selected();
              const next = now.includes(option.value)
                ? now.filter((v) => v !== option.value)
                : [...now, option.value];
              io.setValue(block.name, next, 'choice');
            } else {
              io.setValue(block.name, option.value, 'choice');
            }
            // Painted locally: the engine deliberately does not re-render the
            // body while focus is inside it, or the pressed button would be
            // replaced mid-click.
            paint();
          });
          buttons.push(btn);
          list.appendChild(btn);
        });

        paint();
        group.appendChild(list);
        frag.appendChild(group);
        break;
      }

      case 'button': {
        const io = opts.interactive;
        if (!io) break;
        const label = typeof block.label === 'string' ? block.label : '';
        const btn = doc.createElement('button');
        btn.type = 'button';
        btn.className = `ot-btn ot-block-btn ${block.variant === 'primary' ? 'ot-btn-primary' : 'ot-btn-ghost'}`;
        btn.textContent = label;
        btn.addEventListener('click', () => io.runAction(block.action, label));
        frag.appendChild(btn);
        break;
      }
    }
  }

  return frag;
}
