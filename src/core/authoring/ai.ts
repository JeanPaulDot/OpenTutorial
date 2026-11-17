/**
 * Helpers for authoring tours with a language model.
 *
 * A model writing a tour needs three things it cannot guess: what a valid spec
 * looks like, which elements exist on the page, and whether what it wrote
 * actually works. This file supplies the first two — `createAuthoringPrompt`
 * and `collectAnchors` — and `validateSpec` plus `auditSelectors` close the
 * loop on the third.
 *
 * Nothing here calls a model. The library stays dependency-free and
 * vendor-neutral: you bring the model, this brings the grounding.
 */

import { bestSelector } from './selector';
import { blocksToText, normalizeContent } from '../content';
import type { I18nContent, TutorialSpec } from '../types';

export interface PageAnchor {
  /** The most stable selector available for this element. */
  selector: string;
  /** 0–100. Above 70 is safe to ship; below 40 will probably break. */
  score: number;
  tag: string;
  /** ARIA role, explicit or implied by the tag. */
  role?: string;
  /** Visible text or accessible label, trimmed. */
  text?: string;
  /** False when the element currently has no box (hidden tab, closed menu). */
  visible: boolean;
}

export interface CollectAnchorsOptions {
  /** Maximum anchors to return. Default 60. */
  limit?: number;
  /** Drop anchors whose selector scores below this. Default 0 (keep all). */
  minScore?: number;
  /** Include elements that currently have no box. Default false. */
  includeHidden?: boolean;
}

/** Elements worth pointing a tour at: explicit hooks first, then controls and landmarks. */
const CANDIDATES = [
  '[data-tour]', '[data-testid]', '[data-test]', '[data-cy]',
  'button', 'a[href]', 'input', 'select', 'textarea', 'summary',
  '[role="button"]', '[role="tab"]', '[role="menuitem"]', '[role="link"]', '[role="switch"]',
  'nav', 'main', 'aside', 'form', 'h1', 'h2', 'h3',
].join(',');

const IMPLIED_ROLE: Record<string, string> = {
  BUTTON: 'button', A: 'link', NAV: 'navigation', MAIN: 'main', ASIDE: 'complementary',
  FORM: 'form', SELECT: 'combobox', TEXTAREA: 'textbox', INPUT: 'textbox',
  H1: 'heading', H2: 'heading', H3: 'heading', SUMMARY: 'button',
};

function labelOf(el: Element): string | undefined {
  const aria = el.getAttribute('aria-label');
  const placeholder = el.getAttribute('placeholder');
  const text = (aria ?? el.textContent ?? placeholder ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return placeholder ?? undefined;
  return text.length > 80 ? `${text.slice(0, 77)}…` : text;
}

/**
 * List the elements on the page a tour could target, each with its most stable
 * selector and a stability score.
 *
 * This is the grounding a model needs: handed a list of real selectors, it
 * picks from them; left to imagine, it invents `#submit-button` and the tour
 * breaks on the first step.
 */
export function collectAnchors(root: ParentNode = document, opts: CollectAnchorsOptions = {}): PageAnchor[] {
  const { limit = 60, minScore = 0, includeHidden = false } = opts;
  const doc = (root as Document).nodeType === 9 ? (root as Document) : (root as Element).ownerDocument ?? document;

  const seen = new Set<string>();
  const anchors: PageAnchor[] = [];

  let elements: Element[];
  try { elements = Array.from(root.querySelectorAll(CANDIDATES)); } catch { return []; }

  for (const el of elements) {
    // Never offer the library's own UI as a target.
    if (el.closest('.ot-root, [data-opentutorial], [data-ot-recorder], [data-ot-debug]')) continue;

    const rect = el.getBoundingClientRect();
    const visible = rect.width > 0 || rect.height > 0;
    if (!visible && !includeHidden) continue;

    const best = bestSelector(el, doc);
    if (!best || best.score < minScore || seen.has(best.selector)) continue;
    seen.add(best.selector);

    anchors.push({
      selector: best.selector,
      score: best.score,
      tag: el.tagName.toLowerCase(),
      role: el.getAttribute('role') ?? IMPLIED_ROLE[el.tagName],
      text: labelOf(el),
      visible,
    });
  }

  // Most stable first, so truncating at `limit` drops the fragile ones.
  anchors.sort((a, b) => b.score - a.score);
  return anchors.slice(0, limit);
}

// ---------------------------------------------------------------------------

function plain(content: I18nContent | undefined): string {
  if (content === undefined) return '';
  return typeof content === 'string' ? content : (content.fallback ?? content.key);
}

/**
 * Describe a spec in plain language.
 *
 * For showing a human (or a reviewing model) what a tour does without making
 * them read JSON: when it starts, who sees it, and what each step says, points
 * at and waits for.
 */
export function describeSpec(spec: TutorialSpec): string {
  const lines: string[] = [];
  lines.push(`Tour "${plain(spec.title)}" (${spec.id}) — ${spec.steps.length} step(s).`);

  const trigger = spec.trigger;
  if (!trigger || trigger.type === 'manual') lines.push('Starts: manually.');
  else if (trigger.type === 'route') lines.push(`Starts: on route ${trigger.path}.`);
  else if (trigger.type === 'event') lines.push(`Starts: on the "${trigger.event}" event.`);
  else if (trigger.type === 'element') lines.push(`Starts: when ${trigger.selector} appears.`);
  else if (trigger.type === 'idle') lines.push(`Starts: after ${trigger.ms}ms idle.`);
  else if (trigger.type === 'scroll') lines.push(`Starts: at ${trigger.percent}% scroll.`);
  else if (trigger.type === 'context') lines.push(`Starts: when ${trigger.when} becomes true.`);
  else lines.push('Starts: automatically.');

  if (spec.audience?.showIf) lines.push(`Audience: ${spec.audience.showIf}.`);
  if (spec.frequency) {
    const f = spec.frequency;
    const bits = [
      f.max !== undefined ? `at most ${f.max} time(s)` : '',
      f.cooldown !== undefined ? `${f.cooldown}ms apart` : '',
      f.perSession !== undefined ? `${f.perSession} per session` : '',
    ].filter(Boolean);
    if (bits.length) lines.push(`Frequency: ${bits.join(', ')}.`);
  }

  spec.steps.forEach((step, i) => {
    const target = step.target
      ? (Array.isArray(step.target.selector) ? step.target.selector[0] : step.target.selector)
        ?? (step.target.text ? `text "${step.target.text}"` : '')
      : '';
    const body = blocksToText(normalizeContent(step.content, plain)).slice(0, 140);
    const bits = [
      `${i + 1}. [${step.id}] ${plain(step.title)}`,
      target ? `→ ${target}` : '(centred)',
      step.advanceOn && step.advanceOn !== 'button' ? `advances on ${step.advanceOn}` : '',
      step.showIf ? `only if ${step.showIf}` : '',
      step.nextWhen ? `continue when ${step.nextWhen}` : '',
    ].filter(Boolean);
    lines.push(bits.join(' · '));
    if (body) lines.push(`   "${body}"`);
  });

  if (spec.onComplete?.startTour) lines.push(`Then starts: ${spec.onComplete.startTour}.`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------

export interface AuthoringPromptOptions {
  /** What the tour should achieve, in the user's words. */
  goal?: string;
  /** Real elements on the page, from `collectAnchors()`. Strongly recommended. */
  anchors?: PageAnchor[];
  /** Keys available in the tour context, for `showIf` / `audience` / `nextWhen`. */
  contextKeys?: string[];
  /** Upper bound on steps. Default 6 — long tours are abandoned. */
  maxSteps?: number;
}

/**
 * Build a prompt that gets a valid `TutorialSpec` out of a language model.
 *
 * Deliberately compact: the rules that models actually get wrong (kebab-case
 * ids, required titles, the expression grammar, inventing selectors) rather
 * than the whole schema. Always run the result through `validateSpec` — the
 * prompt reduces failures, the validator catches them.
 */
export function createAuthoringPrompt(opts: AuthoringPromptOptions = {}): string {
  const { goal, anchors = [], contextKeys = [], maxSteps = 6 } = opts;

  const anchorList = anchors.length > 0
    ? anchors
      .map((a) => `- ${a.selector}  (${a.role ?? a.tag}${a.text ? `: "${a.text}"` : ''}, stability ${a.score})`)
      .join('\n')
    : '(none supplied — use placement "center" with no target rather than inventing selectors)';

  return [
    'You write product tours as OpenTutorial TutorialSpec JSON.',
    'Reply with one JSON object and nothing else — no prose, no code fence.',
    '',
    'Shape:',
    '{',
    '  "specVersion": 1,',
    '  "id": "kebab-case-id",',
    '  "title": "Short title",',
    '  "trigger": { "type": "manual" },',
    '  "steps": [',
    '    {',
    '      "id": "kebab-case-step-id",',
    '      "title": "Required, under 60 characters",',
    '      "content": "Markdown. One or two short sentences.",',
    '      "target": { "selector": "<one of the selectors listed below>" },',
    '      "placement": "auto"',
    '    }',
    '  ]',
    '}',
    '',
    'Rules:',
    `- At most ${maxSteps} steps. One idea per step.`,
    '- "specVersion" is always 1. Every id is kebab-case and unique.',
    '- Every step needs "id", "title" and "content".',
    '- Use ONLY selectors from the list below. Never invent one. A step with no good',
    '  target omits "target" and sets "placement": "center".',
    '- Prefer selectors with stability 70 or higher.',
    '- "placement": auto | top | bottom | left | right (optionally -start / -end) | center.',
    '- "advanceOn": "button" (default) or "target-click" when the step asks the user to',
    '  click the highlighted element. "target-click" requires a target.',
    '- Conditions ("showIf", "nextWhen", "audience.showIf") are expressions over the context:',
    '  comparisons, && || !, arithmetic, a.b.c, list[0], and the methods includes,',
    '  startsWith, endsWith, matches. No function calls beyond those.',
    '- To ask the user something, use content blocks:',
    '  "content": { "blocks": [',
    '    { "type": "text", "value": "What best describes you?" },',
    '    { "type": "choice", "name": "role", "options": ["Developer", "Designer"] }',
    '  ] }',
    '  and gate the step with "nextWhen": "role". Field names must be identifiers.',
    '- Do not include keys that are not described here.',
    '',
    'Selectors available on this page:',
    anchorList,
    '',
    contextKeys.length > 0
      ? `Context keys you may use in conditions: ${contextKeys.join(', ')}.`
      : 'No context keys are available; avoid conditions unless you create the key with a choice or input block.',
    '',
    goal ? `Goal: ${goal}` : 'Goal: introduce the most important parts of this page to a first-time user.',
  ].join('\n');
}

/**
 * Pull a spec out of a model reply.
 *
 * Models wrap JSON in prose and code fences however firmly they are told not
 * to. This finds the outermost object and parses it; it returns null rather
 * than throwing, because a malformed reply is an expected outcome to retry on.
 */
export function extractSpec(reply: string): unknown | null {
  if (typeof reply !== 'string') return null;
  const start = reply.indexOf('{');
  const end = reply.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try { return JSON.parse(reply.slice(start, end + 1)); } catch { return null; }
}
