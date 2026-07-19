import type { I18nContent, I18nResolver } from '../types';
export declare function resolveText(content: I18nContent, locale: string, resolver?: I18nResolver): string;
export declare function createKeyResolver(messages: Record<string, string>): I18nResolver;
