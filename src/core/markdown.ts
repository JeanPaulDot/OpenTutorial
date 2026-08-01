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

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(src: string): string {
  return src.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}

/**
 * Schemes that can execute. Everything else — including relative paths and
 * fragments — is allowed, because linking to an in-app route is a normal thing
 * for a tour to do and none of those can run code.
 */
const DANGEROUS_SCHEME = /^(javascript|vbscript|data|file|blob)\s*:/i;

/**
 * Strip whitespace and control characters before testing the scheme.
 *
 * Browsers parse `java	script:alert(1)` as `javascript:`, so a scheme test
 * against the raw string is trivially bypassed. Normalising first means the
 * test sees what the browser will see.
 */
function normalizeScheme(url: string): string {
  // A character-code filter rather than a regex range: a class containing NUL
  // is exactly what `no-control-regex` exists to catch, and this reads better.
  let out = '';
  for (const char of url) {
    if (char.charCodeAt(0) > 0x20) out += char;
  }
  return out;
}

function safeHref(href: string): string | null {
  const trimmed = href.trim();
  return DANGEROUS_SCHEME.test(normalizeScheme(trimmed)) ? null : trimmed;
}

/** Images may additionally use `data:image/...`, which cannot execute. */
function safeSrc(src: string): string | null {
  const trimmed = normalizeScheme(src.trim());
  if (/^data:image\/(png|jpe?g|gif|webp|avif);/i.test(trimmed)) return src.trim();
  return DANGEROUS_SCHEME.test(trimmed) ? null : src.trim();
}

export interface InlineOptions {
  /** Convert newlines to `<br>`. Off inside block rendering, which owns layout. */
  breaks?: boolean;
}

export function renderInline(src: string, opts: InlineOptions = {}): string {
  if (typeof src !== 'string') return '';
  let out = escapeHtml(src);

  // Images before links: `![alt](src)` also matches the link pattern.
  out = out.replace(
    /!\[([^\]]*)\]\(([^\s)]+)\)/g,
    (match, alt: string, src2: string) => {
      const url = safeSrc(src2);
      return url ? `<img class="ot-inline-img" src="${url}" alt="${alt}">` : match;
    },
  );

  // Links before emphasis, so `**bold**` inside link text still formats.
  out = out.replace(
    /\[([^\]]+)\]\(([^\s)]+)\)/g,
    (match, text: string, href: string) => {
      const url = safeHref(href);
      if (!url) return match;
      // Only send target/rel to genuinely external destinations; an in-app link
      // opening a new tab would drop the user out of the tour.
      const external = /^(https?:)?\/\//i.test(url);
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${url}"${attrs}>${text}</a>`;
    },
  );

  // Emphasis requires a non-space at both edges, so arithmetic like `2 * 3 * 4`
  // and a lone bullet character are left alone. The alternation covers the
  // single-character case (`*i*`), which the greedy form cannot express.
  out = out.replace(/\*\*([^\s*][^*]*?[^\s*]|[^\s*])\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^\s*][^*\n]*?[^\s*]|[^\s*])\*/g, '$1<em>$2</em>');
  out = out.replace(/~~([^~]+)~~/g, '<s>$1</s>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');

  if (opts.breaks !== false) out = out.replace(/\r?\n/g, '<br>');
  return out;
}

// ---------------------------------------------------------------------------
// Block rendering
// ---------------------------------------------------------------------------

const HEADING = /^(#{1,6})\s+(.*)$/;
const FENCE = /^\s*(`{3,}|~{3,})\s*([\w+-]*)\s*$/;
const RULE = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/;
const UNORDERED = /^\s*[-*+]\s+(.*)$/;
const ORDERED = /^\s*(\d+)\.\s+(.*)$/;
const QUOTE = /^\s*>\s?(.*)$/;

/** `renderInline` with block-owned line breaks. */
const inline = (src: string): string => renderInline(src, { breaks: false });

/**
 * Render block-level markdown.
 *
 * Deliberately not CommonMark: there is no nested-list support, no reference
 * links and no inline HTML. A tour step is a paragraph or two, and every feature
 * beyond that is surface area an author can get wrong and a reviewer has to
 * check. Anything richer belongs in a content block.
 */
export function renderMarkdown(src: string): string {
  if (typeof src !== 'string' || src === '') return '';

  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const out: string[] = [];
  let paragraph: string[] = [];

  const flushParagraph = (): void => {
    if (paragraph.length === 0) return;
    out.push(`<p class="ot-content">${inline(paragraph.join('\n')).replace(/\n/g, '<br>')}</p>`);
    paragraph = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    // --- fenced code -------------------------------------------------------
    const fence = FENCE.exec(line);
    if (fence) {
      flushParagraph();
      const marker = fence[1][0];
      const lang = fence[2];
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !new RegExp(`^\\s*${marker}{3,}\\s*$`).test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      const cls = lang ? ` class="language-${escapeHtml(lang)}"` : '';
      out.push(`<pre class="ot-code"><code${cls}>${escapeHtml(body.join('\n'))}</code></pre>`);
      continue;
    }

    // --- horizontal rule ---------------------------------------------------
    // Checked before lists so `---` is not read as an empty bullet.
    if (RULE.test(line)) {
      flushParagraph();
      out.push('<hr class="ot-divider">');
      continue;
    }

    // --- heading -----------------------------------------------------------
    const heading = HEADING.exec(line);
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      out.push(`<h${level} class="ot-heading ot-heading--${level}">${inline(heading[2])}</h${level}>`);
      continue;
    }

    // --- blockquote --------------------------------------------------------
    if (QUOTE.test(line)) {
      flushParagraph();
      const body: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i])) {
        body.push(QUOTE.exec(lines[i])![1]);
        i += 1;
      }
      i -= 1;
      out.push(`<blockquote class="ot-quote">${renderMarkdown(body.join('\n'))}</blockquote>`);
      continue;
    }

    // --- lists -------------------------------------------------------------
    if (UNORDERED.test(line) || ORDERED.test(line)) {
      flushParagraph();
      const ordered = ORDERED.test(line);
      const items: string[] = [];

      while (i < lines.length) {
        const current = lines[i];
        const match = ordered ? ORDERED.exec(current) : UNORDERED.exec(current);
        if (!match) break;
        items.push(`<li>${inline(ordered ? match[2] : match[1])}</li>`);
        i += 1;
      }
      i -= 1;

      const tag = ordered ? 'ol' : 'ul';
      const start = ordered ? Number(ORDERED.exec(line)![1]) : 1;
      const startAttr = ordered && start !== 1 ? ` start="${start}"` : '';
      out.push(`<${tag} class="ot-list"${startAttr}>${items.join('')}</${tag}>`);
      continue;
    }

    // --- blank line --------------------------------------------------------
    if (line.trim() === '') {
      flushParagraph();
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return out.join('');
}

/** True when the source uses any block-level syntax. */
export function hasBlockMarkdown(src: string): boolean {
  if (typeof src !== 'string') return false;
  return src.split(/\r?\n/).some(
    (line) =>
      HEADING.test(line) || FENCE.test(line) || RULE.test(line) ||
      UNORDERED.test(line) || ORDERED.test(line) || QUOTE.test(line),
  );
}
