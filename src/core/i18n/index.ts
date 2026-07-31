import type { I18nContent, I18nResolver } from '../types';

/** `{{name}}` placeholders are filled from the tour context. */
const PLACEHOLDER = /\{\{\s*([\w.$]+)\s*\}\}/g;

function lookup(params: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>(
    (acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined),
    params,
  );
}

export function interpolate(template: string, params?: Record<string, unknown>): string {
  if (!params || !template.includes('{{')) return template;
  return template.replace(PLACEHOLDER, (match, path: string) => {
    const value = lookup(params, path);
    return value === undefined || value === null ? match : String(value);
  });
}

export function resolveText(
  content: I18nContent,
  locale: string,
  resolver?: I18nResolver,
  params?: Record<string, unknown>,
): string {
  if (typeof content === 'string') return interpolate(content, params);
  if (content && typeof content.key === 'string') {
    const resolved = resolver?.(content.key, locale);
    if (resolved !== undefined) return interpolate(resolved, params);
    return interpolate(content.fallback ?? content.key, params);
  }
  return String(content);
}

/** Flat message map: `{ 'tour.title': 'Welcome' }`. */
export function createKeyResolver(messages: Record<string, string>): I18nResolver {
  return (key: string) => messages[key];
}

/** Per-locale maps, falling back "fr-CA" → "fr" → default. */
export function createLocaleResolver(
  messages: Record<string, Record<string, string>>,
  defaultLocale = 'en',
): I18nResolver {
  return (key: string, locale: string) => {
    for (const candidate of [locale, locale.split('-')[0], defaultLocale]) {
      const value = messages[candidate]?.[key];
      if (value !== undefined) return value;
    }
    return undefined;
  };
}

/** Default UI strings, overridable per locale through the resolver. */
export const DEFAULT_LABELS = {
  next: 'Next',
  back: 'Back',
  done: 'Done',
  skip: 'Skip tour',
} as const;

export type LabelKey = keyof typeof DEFAULT_LABELS;

/** Resolves built-in button text via `opentutorial.<key>` message keys. */
export function resolveLabel(key: LabelKey, locale: string, resolver?: I18nResolver): string {
  return resolver?.(`opentutorial.${key}`, locale) ?? DEFAULT_LABELS[key];
}
