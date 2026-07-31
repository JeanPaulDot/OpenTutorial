/**
 * Tiny, safe inline-markdown renderer.
 * Escapes all HTML first, then applies the allowed formats:
 * **bold**, *italic*, `code`, ~~strike~~, [link](https://…) and newlines.
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

/** Only http(s) and mailto survive; everything else (javascript:, data:) is dropped. */
const SAFE_LINK = /^(https?:\/\/|mailto:)/i;

export function renderInline(src: string): string {
  if (typeof src !== 'string') return '';
  let out = escapeHtml(src);

  // Links first, so emphasis inside the link text still formats.
  out = out.replace(
    /\[([^\]]+)\]\(([^\s)]+)\)/g,
    (match, text: string, href: string) =>
      (SAFE_LINK.test(href)
        ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
        : match),
  );

  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/~~([^~]+)~~/g, '<s>$1</s>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\r?\n/g, '<br>');
  return out;
}
