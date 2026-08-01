import { normalizeContent, renderBlocks } from '../content';
import { resolveText } from '../i18n';
import {
  Disposers, SurfaceState, attach, button, h, makeHandle,
  type DismissibleOptions, type SurfaceHandle,
} from './shared';
import type { I18nResolver, StepContent } from '../types';

export interface ChangelogEntry {
  /** Stable id — drives the unread badge. */
  id: string;
  title: string;
  /** ISO date or any string you want rendered verbatim. */
  date?: string;
  /** Free-form tag: "New", "Fixed", "Improved". */
  tag?: string;
  content: StepContent;
  /** Optional deep link out to fuller release notes. */
  href?: string;
}

export interface ChangelogOptions extends Omit<DismissibleOptions, 'id'> {
  entries: ChangelogEntry[];
  title?: string;
  /** Render as a floating panel with a launcher that carries an unread count. */
  floating?: boolean;
  launcherGlyph?: string;
  emptyMessage?: string;
  /** Entries to render. Default 20. */
  limit?: number;
  allowHtml?: boolean;
  locale?: string;
  i18nResolver?: I18nResolver;
  userId?: string;
  className?: string;
  /** Fired with the ids that were unread when the panel was opened. */
  onRead?: (ids: string[]) => void;
}

export interface ChangelogHandle extends SurfaceHandle {
  open: () => void;
  close: () => void;
  /** Ids the current user has not seen yet. */
  unread: () => string[];
  /** Mark everything read without opening the panel. */
  markAllRead: () => void;
  /** Swap the entry list — for feeds fetched after mount. */
  setEntries: (entries: ChangelogEntry[]) => void;
}

/**
 * What's-new widget.
 *
 * Read state is per entry id, not a single "last seen" timestamp, so inserting
 * a backdated entry still surfaces it and re-ordering the feed never marks
 * anything unread again. The launcher carries the unread count, which is the
 * only part most users ever look at.
 */
export function createChangelog(options: ChangelogOptions): ChangelogHandle {
  const {
    entries: initialEntries, title = "What's new", floating = true,
    launcherGlyph = '✦', emptyMessage = 'Nothing new right now.', limit = 20,
    allowHtml, locale = 'en', i18nResolver, storage, keyPrefix = 'ot-changelog',
    userId, container, className = '', onRead,
  } = options;

  const disposers = new Disposers();
  const state = new SurfaceState(storage, keyPrefix, userId);
  let entries = initialEntries;
  let open = !floating;
  let hydrated = false;

  const root = h('div', 'ot-changelog-root');

  const panel = h('div', `ot-changelog ${floating ? 'ot-changelog--floating' : ''} ${className}`.trim());
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', title);

  const header = h('div', 'ot-changelog-header');
  header.appendChild(h('h3', 'ot-changelog-title', { text: title }));
  panel.appendChild(header);

  const list = h('ul', 'ot-changelog-list');
  panel.appendChild(list);
  root.appendChild(panel);

  const launcher = h('button', 'ot-changelog-launcher', { type: 'button' });
  const badge = h('span', 'ot-changelog-badge');
  badge.setAttribute('aria-hidden', 'true');

  if (floating) {
    launcher.appendChild(h('span', 'ot-changelog-glyph', { text: launcherGlyph }));
    launcher.appendChild(badge);
    root.appendChild(launcher);
  } else {
    const close = button('ot-changelog-close', '×', () => setOpen(false));
    close.setAttribute('aria-label', 'Close');
    header.appendChild(close);
  }

  const visible = (): ChangelogEntry[] => entries.slice(0, limit);

  const unread = (): string[] => {
    // Before hydration every entry would look unread; report none rather than
    // flashing a wrong badge count that immediately corrects itself.
    if (!hydrated) return [];
    return visible().filter((entry) => state.shouldShow(entry.id)).map((entry) => entry.id);
  };

  const renderBadge = (): void => {
    const count = unread().length;
    badge.textContent = count > 99 ? '99+' : String(count);
    badge.hidden = count === 0;
    launcher.setAttribute(
      'aria-label',
      count > 0 ? `${title} (${count} unread)` : title,
    );
    launcher.setAttribute('aria-expanded', String(open));
  };

  const renderList = (): void => {
    list.replaceChildren();
    const items = visible();
    if (items.length === 0) {
      list.appendChild(h('li', 'ot-changelog-empty', { text: emptyMessage }));
      return;
    }

    for (const entry of items) {
      const isUnread = hydrated && state.shouldShow(entry.id);
      const li = h('li', `ot-changelog-item${isUnread ? ' ot-changelog-item--unread' : ''}`);

      const meta = h('div', 'ot-changelog-meta');
      if (entry.tag) meta.appendChild(h('span', 'ot-changelog-tag', { text: entry.tag }));
      if (entry.date) {
        const time = h('time', 'ot-changelog-date', { text: entry.date });
        time.dateTime = entry.date;
        meta.appendChild(time);
      }
      if (meta.childElementCount > 0) li.appendChild(meta);

      li.appendChild(h('h4', 'ot-changelog-entry-title', { text: entry.title }));

      const body = h('div', 'ot-changelog-body');
      const blocks = normalizeContent(entry.content, (c) => resolveText(c, locale, i18nResolver));
      body.appendChild(renderBlocks(blocks, { allowHtml }));
      li.appendChild(body);

      if (entry.href) {
        const anchor = h('a', 'ot-changelog-link', { text: 'Read more ↗' });
        anchor.href = entry.href;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        li.appendChild(anchor);
      }

      list.appendChild(li);
    }
  };

  const refresh = (): void => {
    panel.hidden = !open;
    renderBadge();
    if (open) renderList();
  };

  function setOpen(next: boolean): void {
    open = next;
    panel.hidden = !open;

    if (open) {
      const pending = unread();
      // Paint first, mark read second, and deliberately do NOT repaint after —
      // the whole point of opening is to see which entries were new, and a
      // repaint would clear the highlight in the same frame it appeared.
      renderList();
      if (pending.length > 0) {
        for (const id of pending) state.markActed(id);
        onRead?.(pending);
      }
    }

    renderBadge();
  }

  launcher.addEventListener('click', () => setOpen(!open));

  attach(root, container);
  refresh();

  let alive = true;
  disposers.add(() => { alive = false; });
  void state.ready.then(() => {
    if (!alive) return;
    hydrated = true;
    refresh();
  });

  return {
    ...makeHandle(root, disposers),
    open: () => setOpen(true),
    close: () => setOpen(false),
    unread,
    markAllRead() {
      for (const entry of visible()) state.markActed(entry.id);
      refresh();
    },
    setEntries(next: ChangelogEntry[]) {
      entries = next;
      refresh();
    },
  };
}
