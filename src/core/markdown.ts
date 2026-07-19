/**
 * Tiny, safe inline-markdown renderer.
 * Escapes all HTML first, then applies the four allowed formats:
 * **bold**, *italic*, `code`, [link](https://…)
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

export function renderInline(src: string): string {
  let out = escapeHtml(src);
  // links first so markup inside link text still formats
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  return out;
}
