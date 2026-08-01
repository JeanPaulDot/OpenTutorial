import { resolveText } from '../i18n';
import { Disposers, attach, h, makeHandle, type SurfaceHandle } from './shared';
import type { TourController } from './controller';
import type { I18nContent, I18nResolver, TutorialSpec } from '../types';

export interface ResourceLink {
  label: string;
  href: string;
  description?: string;
}

export interface ResourceCenterOptions {
  layer: TourController;
  /** Defaults to every spec registered on the layer. */
  specs?: TutorialSpec[];
  /** Extra destinations — docs, support, changelog. */
  links?: ResourceLink[];
  title?: string;
  searchPlaceholder?: string;
  /** Render as a floating panel with its own launcher button. */
  floating?: boolean;
  launcherGlyph?: string;
  emptyMessage?: string;
  locale?: string;
  i18nResolver?: I18nResolver;
  container?: HTMLElement | null;
  className?: string;
}

export interface ResourceCenterHandle extends SurfaceHandle {
  open: () => void;
  close: () => void;
  /** Set the search query programmatically. */
  search: (query: string) => void;
  refresh: () => void;
}

/**
 * Help hub: a searchable list of every available tour plus custom links.
 *
 * This is what makes one-shot onboarding safe to dismiss — there is always a
 * way back into guidance the user waved away.
 */
export function createResourceCenter(options: ResourceCenterOptions): ResourceCenterHandle {
  const {
    layer, specs: specsOption, links = [], title = 'Help & guides',
    searchPlaceholder = 'Search…', floating = false, launcherGlyph = '?',
    emptyMessage = 'Nothing matches that search.', locale = 'en', i18nResolver,
    container, className = '',
  } = options;

  const disposers = new Disposers();
  let open = !floating;
  let query = '';

  // One root holds both the panel and the launcher so the host has a single
  // element to place, show or tear down.
  const root = h('div', 'ot-hub-root');

  const panel = h('div', `ot-hub ${floating ? 'ot-hub--floating' : ''} ${className}`.trim());
  const header = h('div', 'ot-hub-header');
  header.appendChild(h('h3', 'ot-hub-title', { text: title }));

  const search = h('input', 'ot-hub-search');
  search.type = 'search';
  search.placeholder = searchPlaceholder;
  search.setAttribute('aria-label', searchPlaceholder);
  header.appendChild(search);
  panel.appendChild(header);

  const list = h('ul', 'ot-hub-list');
  panel.appendChild(list);
  root.appendChild(panel);

  const launcher = h('button', 'ot-hub-launcher', { type: 'button', text: launcherGlyph });
  if (floating) {
    launcher.setAttribute('aria-label', title);
    root.appendChild(launcher);
  }

  const text = (content: I18nContent | undefined): string =>
    (content === undefined ? '' : resolveText(content, locale, i18nResolver, layer.getContext()));

  const refresh = (): void => {
    panel.hidden = !open;
    if (floating) {
      launcher.textContent = open ? '×' : launcherGlyph;
      launcher.setAttribute('aria-label', open ? 'Close help' : title);
      launcher.setAttribute('aria-expanded', String(open));
    }
    if (!open) return;

    const needle = query.trim().toLowerCase();
    const specs = specsOption ?? layer.getSpecs();
    const matches = (label: string, description: string): boolean =>
      !needle || label.toLowerCase().includes(needle) || description.toLowerCase().includes(needle);

    list.replaceChildren();
    let shown = 0;

    for (const spec of specs) {
      const label = text(spec.title);
      const description = text(spec.description);
      if (!matches(label, description)) continue;
      shown += 1;

      const li = h('li');
      const btn = h('button', 'ot-hub-item', {
        type: 'button',
        text: `${layer.hasSeen(spec.id) ? '↻ ' : ''}${label}`,
      });
      if (description) btn.appendChild(h('span', 'ot-hub-item-desc', { text: description }));
      btn.addEventListener('click', () => {
        layer.start(spec.id);
        if (floating) setOpen(false);
      });
      li.appendChild(btn);
      list.appendChild(li);
    }

    for (const link of links) {
      const description = link.description ?? '';
      if (!matches(link.label, description)) continue;
      shown += 1;

      const li = h('li');
      const anchor = h('a', 'ot-hub-item', { text: `${link.label} ↗` });
      anchor.href = link.href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      if (description) anchor.appendChild(h('span', 'ot-hub-item-desc', { text: description }));
      li.appendChild(anchor);
      list.appendChild(li);
    }

    if (shown === 0) list.appendChild(h('li', 'ot-hub-empty', { text: emptyMessage }));
  };

  function setOpen(next: boolean): void {
    open = next;
    refresh();
  }

  search.addEventListener('input', () => { query = search.value; refresh(); });
  launcher.addEventListener('click', () => setOpen(!open));

  refresh();
  attach(root, container);
  disposers.add(layer.on('event', () => { if (open) refresh(); }));

  return {
    ...makeHandle(root, disposers),
    open: () => setOpen(true),
    close: () => setOpen(false),
    search(next: string) { query = next; search.value = next; refresh(); },
    refresh,
  };
}
