import type { I18nContent, I18nResolver } from '../types';

/**
 * Placeholder syntax inside `{{ … }}`:
 *
 *   {{name}}                                   → simple interpolation
 *   {{user.plan}}                              → dotted path
 *   {{count, plural, one {# tour} other {# tours}}}
 *
 * The plural form is a deliberately small subset of ICU MessageFormat: one
 * argument, the `plural` keyword, then `category {body}` pairs. `#` inside a
 * body is replaced with the locale-formatted count. Category selection uses
 * `Intl.PluralRules`, so Slavic `few`/`many`, Arabic `zero`/`two` and every
 * other CLDR category work without a rules table of our own.
 */

const PLURAL_CATEGORIES = ['zero', 'one', 'two', 'few', 'many', 'other'] as const;
export type PluralCategory = (typeof PLURAL_CATEGORIES)[number];
export type PluralForms = Partial<Record<PluralCategory, string>>;

function lookup(params: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>(
    (acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined),
    params,
  );
}

/**
 * Pick the plural form for `count`.
 *
 * Falls back to `other`, then to an empty string, so a message missing the
 * category a locale actually needs degrades instead of throwing.
 */
export function selectPlural(count: number, forms: PluralForms, locale = 'en'): string {
  let category: string;
  try {
    category = new Intl.PluralRules(locale).select(count);
  } catch {
    // Unknown/invalid locale tag — Intl throws rather than falling back.
    category = count === 1 ? 'one' : 'other';
  }
  return forms[category as PluralCategory] ?? forms.other ?? '';
}

/** `one {# tour} other {# tours}` → `{ one: '# tour', other: '# tours' }`. */
function parseForms(source: string): PluralForms {
  const forms: PluralForms = {};
  const re = /(\w+)\s*\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source)) !== null) {
    const category = match[1] as PluralCategory;
    if (PLURAL_CATEGORIES.includes(category)) forms[category] = match[2];
  }
  return forms;
}

/**
 * Index of the `}}` that closes the `{{` starting at `from`.
 *
 * Plural bodies contain balanced single braces, so a plain `indexOf('}}')`
 * would stop at the wrong place in `{{n, plural, other {# items}}}`.
 */
function findClose(source: string, from: number): number {
  let depth = 0;
  for (let i = from; i < source.length; i += 1) {
    const char = source[i];
    if (char === '{') depth += 1;
    else if (char === '}') {
      if (depth === 0 && source[i + 1] === '}') return i;
      if (depth > 0) depth -= 1;
    }
  }
  return -1;
}

function formatNumber(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Fill `{{…}}` placeholders from `params`.
 *
 * An unresolved placeholder is left verbatim rather than blanked, so a missing
 * value is visible in review instead of silently producing "Welcome, !".
 */
export function interpolate(
  template: string,
  params?: Record<string, unknown>,
  locale = 'en',
): string {
  if (!template.includes('{{')) return template;

  let out = '';
  let cursor = 0;

  while (cursor < template.length) {
    const open = template.indexOf('{{', cursor);
    if (open === -1) { out += template.slice(cursor); break; }

    const close = findClose(template, open + 2);
    if (close === -1) { out += template.slice(cursor); break; }

    out += template.slice(cursor, open);
    const body = template.slice(open + 2, close).trim();
    out += renderPlaceholder(body, params, locale);
    cursor = close + 2;
  }

  return out;
}

function renderPlaceholder(
  body: string,
  params: Record<string, unknown> | undefined,
  locale: string,
): string {
  const verbatim = `{{${body}}}`;

  const comma = body.indexOf(',');
  if (comma !== -1) {
    const path = body.slice(0, comma).trim();
    const rest = body.slice(comma + 1).trim();
    if (!rest.startsWith('plural')) return verbatim;

    const raw = params ? lookup(params, path) : undefined;
    const count = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(count)) return verbatim;

    const forms = parseForms(rest.slice('plural'.length).replace(/^\s*,\s*/, ''));
    return selectPlural(count, forms, locale).replace(/#/g, formatNumber(count, locale));
  }

  if (!/^[\w.$]+$/.test(body)) return verbatim;
  const value = params ? lookup(params, body) : undefined;
  if (value === undefined || value === null) return verbatim;
  return typeof value === 'number' ? formatNumber(value, locale) : String(value);
}

export function resolveText(
  content: I18nContent,
  locale: string,
  resolver?: I18nResolver,
  params?: Record<string, unknown>,
): string {
  if (typeof content === 'string') return interpolate(content, params, locale);
  if (content && typeof content.key === 'string') {
    const resolved = resolver?.(content.key, locale);
    if (resolved !== undefined) return interpolate(resolved, params, locale);
    return interpolate(content.fallback ?? content.key, params, locale);
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

/** Text direction for a locale tag — drives `dir` and mirrored placements. */
const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ug', 'yi', 'dv', 'ckb']);

export function localeDirection(locale: string): 'ltr' | 'rtl' {
  try {
    // Intl.Locale exposes the script direction on modern engines.
    const info = new Intl.Locale(locale) as Intl.Locale & {
      textInfo?: { direction?: string };
      getTextInfo?: () => { direction?: string };
    };
    const direction = info.getTextInfo?.().direction ?? info.textInfo?.direction;
    if (direction === 'rtl' || direction === 'ltr') return direction;
  } catch { /* invalid tag → fall through to the language table */ }
  return RTL_LANGUAGES.has(locale.split('-')[0].toLowerCase()) ? 'rtl' : 'ltr';
}
