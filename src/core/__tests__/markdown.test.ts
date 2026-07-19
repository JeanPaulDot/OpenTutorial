import { describe, it, expect } from 'vitest';
import { renderInline, escapeHtml } from '../markdown';

describe('escapeHtml', () => {
  it('escapes & < > " \'', () => {
    expect(escapeHtml('<script>alert("x")</script>'))
      .toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  });
});

describe('renderInline', () => {
  it('renders plain text unchanged', () => {
    expect(renderInline('Hello world')).toBe('Hello world');
  });

  it('renders **bold**', () => {
    expect(renderInline('**bold**')).toBe('<strong>bold</strong>');
  });

  it('renders *italic*', () => {
    expect(renderInline('*italic*')).toBe('<em>italic</em>');
  });

  it('renders `code`', () => {
    expect(renderInline('`code`')).toBe('<code>code</code>');
  });

  it('renders links', () => {
    expect(renderInline('[text](https://example.com)'))
      .toBe('<a href="https://example.com" target="_blank" rel="noopener noreferrer">text</a>');
  });

  it('escapes HTML in input', () => {
    expect(renderInline('<b>not bold</b>')).toBe('&lt;b&gt;not bold&lt;/b&gt;');
  });

  it('renders combined formats', () => {
    const result = renderInline('**bold** and *italic*');
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<em>italic</em>');
  });

  it('does not render unclosed markers', () => {
    expect(renderInline('**unclosed')).toBe('**unclosed');
  });
});
