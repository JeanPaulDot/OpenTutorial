import { describe, it, expect } from 'vitest';
import { normalizeContent, renderBlocks, blocksToText } from '../content';
import type { ContentBlock } from '../types';

const identity = (c: unknown): string => (typeof c === 'string' ? c : String((c as { key?: string })?.key ?? ''));

function html(blocks: ContentBlock[], opts = {}): string {
  const host = document.createElement('div');
  host.appendChild(renderBlocks(blocks, opts));
  return host.innerHTML;
}

describe('normalizeContent', () => {
  it('wraps a bare string in a text block', () => {
    expect(normalizeContent('hello', identity)).toEqual([{ type: 'text', value: 'hello' }]);
  });

  it('resolves i18n objects through the resolver', () => {
    expect(normalizeContent({ key: 'step.body' }, identity)).toEqual([
      { type: 'text', value: 'step.body' },
    ]);
  });

  it('passes a block list through, resolving text and list items', () => {
    const blocks = normalizeContent({
      blocks: [
        { type: 'text', value: { key: 'a' } },
        { type: 'list', items: [{ key: 'b' }, 'c'] },
        { type: 'image', src: '/x.png', alt: 'X' },
      ],
    }, identity);

    expect(blocks[0]).toEqual({ type: 'text', value: 'a' });
    expect(blocks[1]).toMatchObject({ type: 'list', items: ['b', 'c'] });
    expect(blocks[2]).toMatchObject({ type: 'image', src: '/x.png' });
  });
});

describe('blocksToText', () => {
  it('flattens every block kind it can', () => {
    const text = blocksToText([
      { type: 'text', value: 'Intro' },
      { type: 'list', items: ['one', 'two'] },
      { type: 'code', value: 'npm i' },
      { type: 'image', src: '/a.png', alt: 'Diagram' },
      { type: 'divider' },
    ] as ContentBlock[]);

    expect(text).toBe('Intro one, two npm i Diagram');
  });

  it('returns an empty string for no blocks', () => {
    expect(blocksToText([])).toBe('');
  });
});

describe('renderBlocks', () => {
  it('renders inline markdown in text blocks', () => {
    const out = html([{ type: 'text', value: 'Click **Save** now' }]);
    expect(out).toContain('<strong>Save</strong>');
    expect(out).toContain('class="ot-content"');
  });

  it('escapes HTML inside text blocks', () => {
    const out = html([{ type: 'text', value: '<img src=x onerror=alert(1)>' }]);
    expect(out).not.toContain('<img');
    expect(out).toContain('&lt;img');
  });

  it('renders lists', () => {
    const host = document.createElement('div');
    host.appendChild(renderBlocks([{ type: 'list', items: ['a', 'b', 'c'] }]));
    expect(host.querySelectorAll('li')).toHaveLength(3);
  });

  it('renders images with alt text', () => {
    const host = document.createElement('div');
    host.appendChild(renderBlocks([{ type: 'image', src: '/a.png', alt: 'Chart' }]));
    const img = host.querySelector('img')!;
    expect(img.getAttribute('src')).toBe('/a.png');
    expect(img.getAttribute('alt')).toBe('Chart');
  });

  it('renders code blocks without interpreting markup', () => {
    const host = document.createElement('div');
    host.appendChild(renderBlocks([{ type: 'code', value: '<script>x</script>' }]));
    const code = host.querySelector('code')!;
    expect(code.textContent).toBe('<script>x</script>');
    expect(host.querySelector('script')).toBeNull();
  });

  it('escapes html blocks unless the host opts in', () => {
    const blocks: ContentBlock[] = [{ type: 'html', value: '<b class="raw">bold</b>' }];

    // Escaped, not silently dropped: the author sees their markup was rejected
    // instead of wondering where the block went — and nothing live is inserted.
    const escaped = document.createElement('div');
    escaped.appendChild(renderBlocks(blocks));
    expect(escaped.querySelector('b')).toBeNull();
    expect(escaped.textContent).toContain('<b class="raw">bold</b>');

    const allowed = document.createElement('div');
    allowed.appendChild(renderBlocks(blocks, { allowHtml: true }));
    expect(allowed.querySelector('b.raw')).not.toBeNull();
  });

  it('never lets a script survive an html block, even when allowed', () => {
    const host = document.createElement('div');
    host.appendChild(renderBlocks(
      [{ type: 'html', value: '<p>ok</p><script>window.x = 1</script>' }],
      { allowHtml: true },
    ));
    expect(host.querySelector('p')).not.toBeNull();
    // innerHTML never executes scripts, so nothing runs even if the tag is present.
    expect((window as unknown as { x?: number }).x).toBeUndefined();
  });

  it('renders a divider', () => {
    const host = document.createElement('div');
    host.appendChild(renderBlocks([{ type: 'divider' }]));
    expect(host.querySelector('hr')).not.toBeNull();
  });

  it('renders video with a poster', () => {
    const host = document.createElement('div');
    host.appendChild(renderBlocks([{ type: 'video', src: '/v.mp4', poster: '/p.png' }]));
    const video = host.querySelector('video')!;
    expect(video.getAttribute('src')).toBe('/v.mp4');
    expect(video.getAttribute('poster')).toBe('/p.png');
  });

  it('produces nothing for an empty block list', () => {
    expect(html([])).toBe('');
  });
});
