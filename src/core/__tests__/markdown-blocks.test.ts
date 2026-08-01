import { describe, it, expect } from 'vitest';
import { renderMarkdown, renderInline, hasBlockMarkdown, escapeHtml } from '../markdown';

const html = (src: string): string => renderMarkdown(src);

function dom(src: string): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = renderMarkdown(src);
  return host;
}

describe('escaping comes first', () => {
  it('neutralises markup in every block type', () => {
    for (const src of [
      '<img src=x onerror=alert(1)>',
      '# <script>alert(1)</script>',
      '- <iframe src="evil"></iframe>',
      '> <object data="evil"></object>',
      '1. <svg onload=alert(1)>',
    ]) {
      const host = dom(src);
      expect(host.querySelector('script, iframe, object, svg, img')).toBeNull();
      expect(host.innerHTML).toContain('&lt;');
    }
  });

  it('escapes inside fenced code without formatting it', () => {
    const host = dom('```\n<b>**not bold**</b>\n```');
    expect(host.querySelector('code')?.textContent).toBe('<b>**not bold**</b>');
    expect(host.querySelector('strong')).toBeNull();
  });

  it('escapeHtml covers the five dangerous characters', () => {
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
  });
});

describe('headings', () => {
  it('renders all six levels', () => {
    for (let level = 1; level <= 6; level += 1) {
      const host = dom(`${'#'.repeat(level)} Title`);
      const heading = host.querySelector(`h${level}`)!;
      expect(heading.textContent).toBe('Title');
      expect(heading.className).toContain(`ot-heading--${level}`);
    }
  });

  it('needs a space, so a hashtag is not a heading', () => {
    expect(html('#nothashtag')).toContain('<p');
    expect(html('#nothashtag')).not.toContain('<h1');
  });

  it('formats inline markup inside a heading', () => {
    expect(html('## A **bold** title')).toContain('<strong>bold</strong>');
  });

  it('ignores more than six hashes', () => {
    expect(html('####### Too deep')).not.toContain('<h7');
  });
});

describe('lists', () => {
  it('renders unordered lists from -, * and +', () => {
    for (const marker of ['-', '*', '+']) {
      const host = dom(`${marker} one\n${marker} two`);
      expect(host.querySelector('ul')).not.toBeNull();
      expect(host.querySelectorAll('li')).toHaveLength(2);
    }
  });

  it('renders ordered lists and honours the start number', () => {
    const host = dom('3. three\n4. four');
    const list = host.querySelector('ol')!;
    expect(list.getAttribute('start')).toBe('3');
    expect(host.querySelectorAll('li')).toHaveLength(2);
  });

  it('omits start when the list begins at 1', () => {
    expect(dom('1. one').querySelector('ol')?.hasAttribute('start')).toBe(false);
  });

  it('formats inline markup inside items', () => {
    expect(html('- Click **Save**')).toContain('<strong>Save</strong>');
  });

  it('ends the list at a blank line', () => {
    const host = dom('- one\n\nAfter');
    expect(host.querySelectorAll('li')).toHaveLength(1);
    expect(host.querySelector('p')?.textContent).toBe('After');
  });

  it('starts a new list when the type changes', () => {
    const host = dom('- bullet\n1. number');
    expect(host.querySelector('ul')).not.toBeNull();
    expect(host.querySelector('ol')).not.toBeNull();
  });
});

describe('blockquotes', () => {
  it('renders a quote and merges consecutive lines', () => {
    const host = dom('> first\n> second');
    const quote = host.querySelector('blockquote')!;
    expect(quote).not.toBeNull();
    expect(quote.textContent).toContain('first');
    expect(quote.textContent).toContain('second');
  });

  it('supports blocks inside a quote', () => {
    const host = dom('> ## Heading\n> - item');
    expect(host.querySelector('blockquote h2')).not.toBeNull();
    expect(host.querySelector('blockquote li')).not.toBeNull();
  });
});

describe('fenced code', () => {
  it('renders a fence with a language class', () => {
    const host = dom('```ts\nconst a = 1;\n```');
    const code = host.querySelector('code')!;
    expect(code.className).toBe('language-ts');
    expect(code.textContent).toBe('const a = 1;');
  });

  it('works without a language', () => {
    expect(dom('```\nplain\n```').querySelector('code')?.className).toBe('');
  });

  it('supports tilde fences', () => {
    expect(dom('~~~\ncode\n~~~').querySelector('code')?.textContent).toBe('code');
  });

  it('preserves internal blank lines and indentation', () => {
    const host = dom('```\na\n\n  b\n```');
    expect(host.querySelector('code')?.textContent).toBe('a\n\n  b');
  });

  it('tolerates an unclosed fence', () => {
    expect(() => renderMarkdown('```\nunterminated')).not.toThrow();
    expect(dom('```\nunterminated').querySelector('code')?.textContent).toBe('unterminated');
  });
});

describe('rules and paragraphs', () => {
  it('renders horizontal rules', () => {
    for (const src of ['---', '***', '___']) {
      expect(dom(src).querySelector('hr')).not.toBeNull();
    }
  });

  it('does not mistake a rule for a list', () => {
    expect(dom('---').querySelector('ul')).toBeNull();
  });

  it('splits paragraphs on blank lines', () => {
    expect(dom('one\n\ntwo').querySelectorAll('p')).toHaveLength(2);
  });

  it('keeps a single newline as a line break inside a paragraph', () => {
    expect(html('one\ntwo')).toContain('<br>');
    expect(dom('one\ntwo').querySelectorAll('p')).toHaveLength(1);
  });

  it('returns an empty string for empty input', () => {
    expect(renderMarkdown('')).toBe('');
    expect(renderMarkdown(null as unknown as string)).toBe('');
  });
});

describe('links and images', () => {
  it('renders external links with rel and target', () => {
    const host = dom('[docs](https://example.com)');
    const link = host.querySelector('a')!;
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('keeps in-app links in the same tab', () => {
    const link = dom('[settings](/settings)').querySelector('a')!;
    expect(link.getAttribute('href')).toBe('/settings');
    expect(link.hasAttribute('target')).toBe(false);
  });

  it('refuses script-bearing schemes', () => {
    for (const href of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'vbscript:x', 'data:text/html,x']) {
      const host = dom(`[click](${href})`);
      expect(host.querySelector('a')).toBeNull();
    }
  });

  it('renders images and allows data:image', () => {
    expect(dom('![chart](/img/a.png)').querySelector('img')?.getAttribute('alt')).toBe('chart');
    const inlineData = 'data:image/png;base64,iVBORw0KGgo=';
    expect(dom(`![x](${inlineData})`).querySelector('img')).not.toBeNull();
  });

  it('refuses non-image data URLs in images', () => {
    expect(dom('![x](data:text/html;base64,PHNjcmlwdD4=)').querySelector('img')).toBeNull();
  });

  it('does not read an image as a link', () => {
    const host = dom('![alt](/a.png)');
    expect(host.querySelector('img')).not.toBeNull();
    expect(host.querySelector('a')).toBeNull();
  });
});

describe('renderInline', () => {
  it('still supports the 0.x formats', () => {
    expect(renderInline('**b**')).toContain('<strong>b</strong>');
    expect(renderInline('*i*')).toContain('<em>i</em>');
    expect(renderInline('~~s~~')).toContain('<s>s</s>');
    expect(renderInline('`c`')).toContain('<code>c</code>');
  });

  it('converts newlines to <br> by default and not when breaks are off', () => {
    expect(renderInline('a\nb')).toContain('<br>');
    expect(renderInline('a\nb', { breaks: false })).not.toContain('<br>');
  });

  it('does not turn a bare asterisk into emphasis', () => {
    expect(renderInline('2 * 3 * 4')).not.toContain('<em>');
  });
});

describe('hasBlockMarkdown', () => {
  it('detects block syntax', () => {
    for (const src of ['# h', '- a', '1. a', '> q', '```\nx\n```', '---']) {
      expect(hasBlockMarkdown(src)).toBe(true);
    }
  });

  it('is false for inline-only prose', () => {
    for (const src of ['Just **prose** here.', 'A [link](https://x.test)', '']) {
      expect(hasBlockMarkdown(src)).toBe(false);
    }
  });
});

describe('a realistic step body', () => {
  it('renders a mixed document', () => {
    const host = dom([
      '## Connect your data',
      '',
      'Pick a source, then authorise it.',
      '',
      '- Postgres',
      '- BigQuery',
      '',
      '> Read-only credentials are enough.',
      '',
      '```bash',
      'opentutorial validate specs/',
      '```',
    ].join('\n'));

    expect(host.querySelector('h2')?.textContent).toBe('Connect your data');
    expect(host.querySelectorAll('li')).toHaveLength(2);
    expect(host.querySelector('blockquote')).not.toBeNull();
    expect(host.querySelector('code')?.className).toBe('language-bash');
    expect(host.querySelectorAll('p').length).toBeGreaterThanOrEqual(1);
  });
});
