import type { I18nContent, I18nResolver } from '../types';

export function resolveText(
  content: I18nContent,
  locale: string,
  resolver?: I18nResolver,
): string {
  if (typeof content === 'string') return content;
  if (content && typeof content.key === 'string') {
    if (resolver) {
      const resolved = resolver(content.key, locale);
      if (resolved !== undefined) return resolved;
    }
    return content.fallback ?? content.key;
  }
  return String(content);
}

export function createKeyResolver(messages: Record<string, string>): I18nResolver {
  return (key: string) => messages[key];
}
