import { describe, it, expect } from 'vitest';
import {
  interpolate, resolveText, selectPlural, localeDirection,
  createKeyResolver, createLocaleResolver, resolveLabel, DEFAULT_LABELS,
} from '../i18n';

describe('interpolate', () => {
  it('returns the template untouched when there is nothing to fill', () => {
    expect(interpolate('plain text')).toBe('plain text');
  });

  it('fills simple and dotted placeholders', () => {
    expect(interpolate('Hi {{name}}', { name: 'Ada' })).toBe('Hi Ada');
    expect(interpolate('Plan: {{user.plan}}', { user: { plan: 'pro' } })).toBe('Plan: pro');
  });

  it('leaves an unresolved placeholder verbatim rather than blanking it', () => {
    expect(interpolate('Hi {{name}}', {})).toBe('Hi {{name}}');
    expect(interpolate('Hi {{name}}')).toBe('Hi {{name}}');
    expect(interpolate('Hi {{a.b.c}}', { a: {} })).toBe('Hi {{a.b.c}}');
  });

  it('formats numbers for the locale', () => {
    expect(interpolate('{{n}}', { n: 1234567 }, 'en')).toBe('1,234,567');
    expect(interpolate('{{n}}', { n: 1234567 }, 'de')).toBe('1.234.567');
  });

  it('tolerates an unterminated placeholder', () => {
    expect(interpolate('broken {{name', { name: 'x' })).toBe('broken {{name');
  });

  it('leaves a non-identifier body alone', () => {
    expect(interpolate('{{ 1 + 1 }}', {})).toBe('{{1 + 1}}');
  });

  it('handles several placeholders in one string', () => {
    expect(interpolate('{{a}} and {{b}}', { a: 'x', b: 'y' })).toBe('x and y');
  });
});

describe('plural', () => {
  it('selects the right English category', () => {
    const forms = { one: '# tour', other: '# tours' };
    expect(selectPlural(1, forms)).toBe('# tour');
    expect(selectPlural(0, forms)).toBe('# tours');
    expect(selectPlural(5, forms)).toBe('# tours');
  });

  it('falls back to other when a category is missing', () => {
    expect(selectPlural(1, { other: 'many' })).toBe('many');
    expect(selectPlural(1, {})).toBe('');
  });

  it('uses locale rules, not English ones', () => {
    // Polish has a distinct `few` for 2–4.
    const forms = { one: 'jeden', few: 'kilka', many: 'wiele', other: 'inne' };
    expect(selectPlural(1, forms, 'pl')).toBe('jeden');
    expect(selectPlural(3, forms, 'pl')).toBe('kilka');
    expect(selectPlural(10, forms, 'pl')).toBe('wiele');
  });

  it('degrades gracefully for an invalid locale tag', () => {
    expect(selectPlural(1, { one: 'a', other: 'b' }, 'not-a-locale!!')).toBe('a');
  });

  it('renders plural blocks inside interpolate, substituting #', () => {
    const template = 'You have {{count, plural, one {# tour} other {# tours}}} left';
    expect(interpolate(template, { count: 1 })).toBe('You have 1 tour left');
    expect(interpolate(template, { count: 4 })).toBe('You have 4 tours left');
  });

  it('formats the substituted count for the locale', () => {
    const template = '{{count, plural, other {# items}}}';
    expect(interpolate(template, { count: 12345 }, 'en')).toBe('12,345 items');
  });

  it('leaves a plural block verbatim when the count is missing or not numeric', () => {
    const template = '{{count, plural, one {# a} other {# b}}}';
    expect(interpolate(template, {})).toBe(template);
    expect(interpolate(template, { count: 'lots' })).toBe(template);
  });

  it('ignores an unsupported ICU function', () => {
    const template = '{{gender, select, male {he} other {they}}}';
    expect(interpolate(template, { gender: 'male' })).toBe(template);
  });

  it('mixes plural blocks with ordinary placeholders', () => {
    const template = '{{name}} finished {{n, plural, one {# tour} other {# tours}}}';
    expect(interpolate(template, { name: 'Ada', n: 2 })).toBe('Ada finished 2 tours');
  });
});

describe('resolveText', () => {
  it('passes a plain string through interpolation', () => {
    expect(resolveText('Hi {{name}}', 'en', undefined, { name: 'Ada' })).toBe('Hi Ada');
  });

  it('resolves a key through the resolver', () => {
    const resolver = createKeyResolver({ 'tour.title': 'Welcome, {{name}}' });
    expect(resolveText({ key: 'tour.title' }, 'en', resolver, { name: 'Ada' })).toBe('Welcome, Ada');
  });

  it('falls back to the fallback, then the key itself', () => {
    expect(resolveText({ key: 'missing', fallback: 'Default' }, 'en', createKeyResolver({}))).toBe('Default');
    expect(resolveText({ key: 'missing' }, 'en', createKeyResolver({}))).toBe('missing');
  });

  it('resolves plurals through a message catalogue', () => {
    const resolver = createKeyResolver({
      'checklist.left': '{{n, plural, one {# step left} other {# steps left}}}',
    });
    expect(resolveText({ key: 'checklist.left' }, 'en', resolver, { n: 1 })).toBe('1 step left');
    expect(resolveText({ key: 'checklist.left' }, 'en', resolver, { n: 3 })).toBe('3 steps left');
  });
});

describe('createLocaleResolver', () => {
  const resolver = createLocaleResolver({
    en: { greet: 'Hello' },
    fr: { greet: 'Bonjour' },
    'fr-CA': { greet: 'Salut' },
  }, 'en');

  it('prefers the exact locale', () => {
    expect(resolver('greet', 'fr-CA')).toBe('Salut');
  });

  it('falls back to the base language', () => {
    expect(resolver('greet', 'fr-BE')).toBe('Bonjour');
  });

  it('falls back to the default locale', () => {
    expect(resolver('greet', 'de')).toBe('Hello');
  });

  it('returns undefined for an unknown key', () => {
    expect(resolver('nope', 'en')).toBeUndefined();
  });
});

describe('resolveLabel', () => {
  it('uses the built-in default', () => {
    expect(resolveLabel('next', 'en')).toBe(DEFAULT_LABELS.next);
  });

  it('prefers a resolver override under the opentutorial namespace', () => {
    const resolver = createKeyResolver({ 'opentutorial.next': 'Suivant' });
    expect(resolveLabel('next', 'fr', resolver)).toBe('Suivant');
  });
});

describe('localeDirection', () => {
  it('reports rtl for right-to-left languages', () => {
    expect(localeDirection('ar')).toBe('rtl');
    expect(localeDirection('he-IL')).toBe('rtl');
    expect(localeDirection('fa')).toBe('rtl');
  });

  it('reports ltr for everything else', () => {
    expect(localeDirection('en')).toBe('ltr');
    expect(localeDirection('fr-CA')).toBe('ltr');
  });

  it('falls back to ltr for a malformed tag', () => {
    expect(localeDirection('!!!')).toBe('ltr');
  });
});
