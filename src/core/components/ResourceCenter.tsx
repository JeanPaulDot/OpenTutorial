'use client';

import { useMemo, useState } from 'react';
import { useTour } from '../adapters/react';
import { resolveText } from '../i18n';
import type { I18nContent, I18nResolver, TutorialSpec } from '../types';

// One definition, shared with the framework-free `createResourceCenter`.
export type { ResourceLink } from '../surfaces/resourceCenter';
import type { ResourceLink } from '../surfaces/resourceCenter';

export interface ResourceCenterProps {
  /** Defaults to every spec on the provider. */
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
  className?: string;
}

/**
 * Help hub: a searchable list of every available tour plus custom links.
 *
 * Gives users a way back into guidance they dismissed, which is what makes
 * one-shot onboarding tours safe to dismiss in the first place.
 */
export function ResourceCenter({
  specs: specsProp,
  links = [],
  title = 'Help & guides',
  searchPlaceholder = 'Search…',
  floating = false,
  launcherGlyph = '?',
  emptyMessage = 'Nothing matches that search.',
  locale = 'en',
  i18nResolver,
  className = '',
}: ResourceCenterProps) {
  const tour = useTour();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(!floating);

  const specs = specsProp ?? tour.specs;

  const items = useMemo(() => {
    const text = (content: I18nContent | undefined): string =>
      (content === undefined ? '' : resolveText(content, locale, i18nResolver, tour.context));
    const needle = query.trim().toLowerCase();
    const tours = specs.map((spec) => ({
      kind: 'tour' as const,
      id: spec.id,
      label: text(spec.title),
      description: text(spec.description),
      seen: tour.hasSeen(spec.id),
    }));
    const external = links.map((link) => ({
      kind: 'link' as const,
      id: link.href,
      label: link.label,
      description: link.description ?? '',
      href: link.href,
    }));
    const all = [...tours, ...external];
    if (!needle) return all;
    return all.filter(
      (i) => i.label.toLowerCase().includes(needle) || i.description.toLowerCase().includes(needle),
    );
    // `hasSeen` reads persisted state; re-derive whenever the active tour changes.
  }, [specs, links, query, locale, i18nResolver, tour]);

  if (floating && !open) {
    return (
      <button
        type="button"
        className="ot-hub-launcher"
        aria-label={title}
        onClick={() => setOpen(true)}
      >
        {launcherGlyph}
      </button>
    );
  }

  return (
    <>
      <div className={`ot-hub ${floating ? 'ot-hub--floating' : ''} ${className}`.trim()}>
        <div className="ot-hub-header">
          <h3 className="ot-hub-title">{title}</h3>
          <input
            type="search"
            className="ot-hub-search"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <ul className="ot-hub-list">
          {items.length === 0 && <li className="ot-hub-empty">{emptyMessage}</li>}
          {items.map((item) => (
            <li key={`${item.kind}-${item.id}`}>
              {item.kind === 'tour' ? (
                <button
                  type="button"
                  className="ot-hub-item"
                  onClick={() => { tour.start(item.id); if (floating) setOpen(false); }}
                >
                  {item.seen ? '↻ ' : ''}{item.label}
                  {item.description && <span className="ot-hub-item-desc">{item.description}</span>}
                </button>
              ) : (
                <a
                  className="ot-hub-item"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label} ↗
                  {item.description && <span className="ot-hub-item-desc">{item.description}</span>}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      {floating && (
        <button
          type="button"
          className="ot-hub-launcher"
          aria-label="Close help"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
      )}
    </>
  );
}
