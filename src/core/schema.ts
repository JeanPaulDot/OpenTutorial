import type { SpecIssue, TutorialSpec, ValidationResult } from './types';
import { checkExpression } from './safeEval';

const PLACEMENTS = new Set([
  'auto', 'center',
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
]);

const DISPLAY_MODES = new Set(['spotlight', 'hotspot', 'beacon', 'modal', 'banner']);
const ADVANCE = new Set([
  'button', 'target-click', 'event', 'auto',
  'input-match', 'form-submit', 'element-appears', 'element-disappears', 'url-match',
]);
const TRIGGER_TYPES = new Set(['manual', 'auto', 'event', 'route', 'element', 'idle', 'scroll']);
const ACTION_TYPES = new Set(['emit', 'click', 'focus', 'navigate', 'setContext', 'scrollTo', 'wait']);
const BLOCK_TYPES = new Set(['text', 'image', 'video', 'list', 'code', 'divider', 'html']);
const INTERACTION_MODES = new Set(['free', 'target-only', 'blocked']);

const TOP_LEVEL_KEYS = new Set([
  'specVersion', 'id', 'title', 'description', 'version', 'priority', 'trigger',
  'audience', 'frequency', 'onComplete', 'theme', 'interaction', 'steps',
]);
const STEP_KEYS = new Set([
  'id', 'target', 'placement', 'display', 'title', 'content', 'buttons', 'advanceOn',
  'event', 'duration', 'match', 'watch', 'urlPattern', 'interaction', 'skippable',
  'canGoBack', 'next', 'showIf', 'theme', 'onEnter', 'onExit',
]);
const TARGET_KEYS = new Set([
  'selector', 'text', 'index', 'shadow', 'iframe', 'waitFor', 'timeout', 'visible',
  'scrollIntoView', 'scrollBehavior', 'padding',
]);
const THEME_KEYS = new Set([
  'accent', 'bg', 'fg', 'muted', 'border', 'success', 'danger', 'backdrop', 'radius',
  'shadow', 'font', 'fontSize', 'spacing', 'arrowSize', 'overlayBlur', 'animationMs',
  'z', 'spotlightRing', 'popoverWidth',
]);

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Soft limits. Exceeding these is a warning — the tour still runs. */
const SOFT = { title: 60, stepTitle: 80, description: 200, content: 320, steps: 24 };
/** Hard limits. Past these the spec is rejected. */
const HARD = { steps: 200 };

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

class Issues {
  readonly errors: SpecIssue[] = [];
  readonly warnings: SpecIssue[] = [];
  error(path: string, message: string): void { this.errors.push({ path, message, severity: 'error' }); }
  warn(path: string, message: string): void { this.warnings.push({ path, message, severity: 'warning' }); }
}

function checkTheme(theme: unknown, path: string, out: Issues): void {
  if (theme === undefined) return;
  if (!isObj(theme)) { out.error(path, 'theme must be an object'); return; }
  for (const k of Object.keys(theme)) {
    if (!THEME_KEYS.has(k)) out.warn(`${path}.${k}`, `unknown theme token "${k}" (ignored)`);
  }
}

function checkExpr(expr: unknown, path: string, out: Issues): void {
  if (expr === undefined) return;
  if (typeof expr !== 'string') { out.error(path, 'must be a string expression'); return; }
  if (expr.length > 500) { out.error(path, `expression must be ≤ 500 chars (got ${expr.length})`); return; }
  const result = checkExpression(expr);
  if (!result.ok) out.error(path, `invalid expression: ${result.message}`);
}

function checkActions(actions: unknown, path: string, out: Issues): void {
  if (actions === undefined) return;
  if (!Array.isArray(actions)) { out.error(path, 'must be an array of actions'); return; }
  actions.forEach((a, i) => {
    const p = `${path}[${i}]`;
    if (!isObj(a)) { out.error(p, 'action must be an object'); return; }
    if (!ACTION_TYPES.has(a.type as string)) {
      out.error(`${p}.type`, `unknown action type "${String(a.type)}"`);
      return;
    }
    if (a.type === 'emit' && typeof a.name !== 'string') {
      out.error(`${p}.name`, 'emit action requires a string "name"');
    }
    if (a.type === 'navigate' && (typeof a.path !== 'string' || !a.path.startsWith('/'))) {
      out.error(`${p}.path`, 'navigate requires a same-origin "path" starting with /');
    }
    if (a.type === 'setContext' && typeof a.key !== 'string') {
      out.error(`${p}.key`, 'setContext requires a string "key"');
    }
    if (a.type === 'scrollTo' && typeof a.selector !== 'string') {
      out.error(`${p}.selector`, 'scrollTo requires a string "selector"');
    }
    if (a.type === 'wait' && typeof a.ms !== 'number') {
      out.error(`${p}.ms`, 'wait requires a numeric "ms"');
    }
  });
}

/** Returns the plain-text length of a content value, or undefined if malformed. */
function contentLength(v: unknown, path: string, out: Issues): number | undefined {
  if (typeof v === 'string') return v.length;
  if (isObj(v) && typeof v.key === 'string') return v.key.length;

  if (isObj(v) && Array.isArray(v.blocks)) {
    if (v.blocks.length === 0) { out.error(path, 'blocks must not be empty'); return undefined; }
    let total = 0;
    v.blocks.forEach((block, i) => {
      const p = `${path}.blocks[${i}]`;
      if (!isObj(block)) { out.error(p, 'block must be an object'); return; }
      if (!BLOCK_TYPES.has(block.type as string)) {
        out.error(`${p}.type`, `unknown block type "${String(block.type)}"`);
        return;
      }
      switch (block.type) {
        case 'text':
          if (typeof block.value === 'string') total += block.value.length;
          else if (!isObj(block.value) || typeof block.value.key !== 'string') {
            out.error(`${p}.value`, 'text block requires a string or i18n object');
          }
          break;
        case 'image':
          if (typeof block.src !== 'string') out.error(`${p}.src`, 'image block requires "src"');
          if (typeof block.alt !== 'string') out.error(`${p}.alt`, 'image block requires "alt" for accessibility');
          break;
        case 'video':
          if (typeof block.src !== 'string') out.error(`${p}.src`, 'video block requires "src"');
          break;
        case 'list':
          if (!Array.isArray(block.items) || block.items.length === 0) {
            out.error(`${p}.items`, 'list block requires a non-empty "items" array');
          }
          break;
        case 'code':
          if (typeof block.value !== 'string') out.error(`${p}.value`, 'code block requires a string "value"');
          break;
        case 'html':
          if (typeof block.value !== 'string') out.error(`${p}.value`, 'html block requires a string "value"');
          else out.warn(p, 'html blocks render only when the host sets allowHtml: true');
          break;
      }
    });
    return total;
  }

  return undefined;
}

function checkTrigger(trigger: unknown, out: Issues): void {
  if (trigger === undefined) return;
  if (!isObj(trigger)) { out.error('$.trigger', 'must be an object'); return; }

  const type = trigger.type as string;
  if (!TRIGGER_TYPES.has(type)) {
    out.error('$.trigger.type', `must be one of: ${[...TRIGGER_TYPES].join(' | ')}`);
    return;
  }
  if (trigger.delay !== undefined && (typeof trigger.delay !== 'number' || trigger.delay < 0)) {
    out.error('$.trigger.delay', 'must be a non-negative number (ms)');
  }
  if (type === 'event' && typeof trigger.event !== 'string') {
    out.error('$.trigger.event', 'required when trigger.type === "event"');
  }
  if (type === 'route' && typeof trigger.path !== 'string') {
    out.error('$.trigger.path', 'required when trigger.type === "route"');
  }
  if (type === 'element' && typeof trigger.selector !== 'string') {
    out.error('$.trigger.selector', 'required when trigger.type === "element"');
  }
  if (type === 'idle' && (typeof trigger.ms !== 'number' || trigger.ms <= 0)) {
    out.error('$.trigger.ms', 'required positive number (ms) when trigger.type === "idle"');
  }
  if (type === 'scroll') {
    const pct = trigger.percent;
    if (typeof pct !== 'number' || pct < 0 || pct > 100) {
      out.error('$.trigger.percent', 'must be a number between 0 and 100');
    }
  }
}

function checkTarget(target: unknown, p: string, out: Issues): void {
  if (target === undefined) return;
  if (!isObj(target)) { out.error(`${p}.target`, 'must be an object'); return; }

  for (const k of Object.keys(target)) {
    if (!TARGET_KEYS.has(k)) out.warn(`${p}.target.${k}`, `unknown target key "${k}" (ignored)`);
  }

  const { selector, text } = target;
  const selectorOk =
    (typeof selector === 'string' && selector.trim().length > 0) ||
    (Array.isArray(selector) && selector.length > 0 && selector.every((s) => typeof s === 'string' && s.trim()));

  if (selector !== undefined && !selectorOk) {
    out.error(`${p}.target.selector`, 'must be a non-empty CSS selector or array of selectors');
  }
  if (!selectorOk && typeof text !== 'string') {
    out.error(`${p}.target`, 'requires "selector", "text", or both');
  }
  if (target.timeout !== undefined && (typeof target.timeout !== 'number' || target.timeout < 0)) {
    out.error(`${p}.target.timeout`, 'must be a non-negative number (ms)');
  }
  if (target.padding !== undefined && (typeof target.padding !== 'number' || target.padding < 0)) {
    out.error(`${p}.target.padding`, 'must be a non-negative number (px)');
  }
  if (target.index !== undefined && (typeof target.index !== 'number' || target.index < 0)) {
    out.error(`${p}.target.index`, 'must be a non-negative integer');
  }
  if (target.iframe !== undefined && typeof target.iframe !== 'string') {
    out.error(`${p}.target.iframe`, 'must be a CSS selector string');
  }
  if (target.scrollBehavior !== undefined && !['auto', 'smooth'].includes(target.scrollBehavior as string)) {
    out.error(`${p}.target.scrollBehavior`, 'must be "auto" or "smooth"');
  }
}

export function validateSpec(input: unknown): ValidationResult {
  const out = new Issues();

  if (!isObj(input)) {
    return {
      ok: false,
      errors: [{ path: '$', message: 'spec must be a JSON object', severity: 'error' }],
      warnings: [],
    };
  }

  // Unknown top-level keys are warnings, not errors: a spec authored against a
  // newer version of the library should still run on an older one.
  for (const k of Object.keys(input)) {
    if (!TOP_LEVEL_KEYS.has(k)) out.warn(`$.${k}`, `unknown top-level key "${k}" (ignored)`);
  }

  if (input.specVersion !== 1) out.error('$.specVersion', 'must be the integer 1');

  if (typeof input.id !== 'string' || !input.id) out.error('$.id', 'required, non-empty string');
  else if (!KEBAB.test(input.id)) out.error('$.id', 'must be kebab-case (e.g. "dashboard-intro")');

  const titleLen = contentLength(input.title, '$.title', out);
  if (titleLen === undefined) out.error('$.title', 'required (string or i18n object with key)');
  else if (titleLen === 0) out.error('$.title', 'must not be empty');
  else if (titleLen > SOFT.title) out.warn('$.title', `longer than ${SOFT.title} chars (got ${titleLen})`);

  if (input.description !== undefined) {
    const len = contentLength(input.description, '$.description', out);
    if (len === undefined) out.error('$.description', 'must be a string or i18n object');
    else if (len > SOFT.description) out.warn('$.description', `longer than ${SOFT.description} chars (got ${len})`);
  }

  if (input.version !== undefined && typeof input.version !== 'string') {
    out.error('$.version', 'must be a string (e.g. "1.0.0")');
  }
  if (input.priority !== undefined && typeof input.priority !== 'number') {
    out.error('$.priority', 'must be a number');
  }
  if (input.interaction !== undefined && !INTERACTION_MODES.has(input.interaction as string)) {
    out.error('$.interaction', 'must be "free" | "target-only" | "blocked"');
  }

  checkTrigger(input.trigger, out);

  if (input.audience !== undefined) {
    if (!isObj(input.audience)) out.error('$.audience', 'must be an object');
    else checkExpr(input.audience.showIf, '$.audience.showIf', out);
  }

  if (input.frequency !== undefined) {
    if (!isObj(input.frequency)) {
      out.error('$.frequency', 'must be an object');
    } else {
      for (const k of ['max', 'cooldown', 'perSession'] as const) {
        const v = input.frequency[k];
        if (v !== undefined && (typeof v !== 'number' || v < 0)) {
          out.error(`$.frequency.${k}`, 'must be a non-negative number');
        }
      }
    }
  }

  if (input.onComplete !== undefined) {
    if (!isObj(input.onComplete)) {
      out.error('$.onComplete', 'must be an object');
    } else {
      const { startTour, emit, navigate } = input.onComplete;
      if (startTour !== undefined && typeof startTour !== 'string') {
        out.error('$.onComplete.startTour', 'must be a tour id string');
      }
      if (emit !== undefined && typeof emit !== 'string') {
        out.error('$.onComplete.emit', 'must be an event name string');
      }
      if (navigate !== undefined && (typeof navigate !== 'string' || !navigate.startsWith('/'))) {
        out.error('$.onComplete.navigate', 'must be a same-origin path starting with /');
      }
    }
  }

  checkTheme(input.theme, '$.theme', out);

  if (!Array.isArray(input.steps)) {
    out.error('$.steps', 'required, must be an array');
    return { ok: false, errors: out.errors, warnings: out.warnings };
  }
  if (input.steps.length < 1) out.error('$.steps', 'must contain at least 1 step');
  if (input.steps.length > HARD.steps) {
    out.error('$.steps', `must contain ≤ ${HARD.steps} steps (got ${input.steps.length})`);
  } else if (input.steps.length > SOFT.steps) {
    out.warn('$.steps', `${input.steps.length} steps is a lot; consider splitting into several tours`);
  }

  const ids = new Set<string>();
  input.steps.forEach((raw, i) => {
    const p = `$.steps[${i}]`;
    if (!isObj(raw)) { out.error(p, 'step must be an object'); return; }

    for (const k of Object.keys(raw)) {
      if (!STEP_KEYS.has(k)) out.warn(`${p}.${k}`, `unknown step key "${k}" (ignored)`);
    }

    if (typeof raw.id !== 'string' || !raw.id) out.error(`${p}.id`, 'required');
    else if (ids.has(raw.id)) out.error(`${p}.id`, `duplicate step id "${raw.id}"`);
    else ids.add(raw.id);

    const display = raw.display as string | undefined;
    if (display !== undefined && !DISPLAY_MODES.has(display)) {
      out.error(`${p}.display`, `must be one of: ${[...DISPLAY_MODES].join(' | ')}`);
    }

    checkTarget(raw.target, p, out);

    if (raw.placement !== undefined && !PLACEMENTS.has(raw.placement as string)) {
      out.error(`${p}.placement`, `must be one of: ${[...PLACEMENTS].join(' | ')}`);
    }
    if (raw.interaction !== undefined && !INTERACTION_MODES.has(raw.interaction as string)) {
      out.error(`${p}.interaction`, 'must be "free" | "target-only" | "blocked"');
    }

    const stepTitleLen = contentLength(raw.title, `${p}.title`, out);
    if (stepTitleLen === undefined) out.error(`${p}.title`, 'required (string or i18n object with key)');
    else if (stepTitleLen === 0) out.error(`${p}.title`, 'must not be empty');
    else if (stepTitleLen > SOFT.stepTitle) {
      out.warn(`${p}.title`, `longer than ${SOFT.stepTitle} chars (got ${stepTitleLen})`);
    }

    const contentLen = contentLength(raw.content, `${p}.content`, out);
    if (contentLen === undefined) {
      out.error(`${p}.content`, 'required (string, i18n object, or { blocks: [...] })');
    } else if (contentLen > SOFT.content) {
      out.warn(`${p}.content`, `longer than ${SOFT.content} chars (got ${contentLen}); long copy hurts completion`);
    }

    if (raw.buttons !== undefined) {
      if (!isObj(raw.buttons)) out.error(`${p}.buttons`, 'must be an object');
      else {
        for (const k of Object.keys(raw.buttons)) {
          if (!['next', 'back', 'skip', 'done'].includes(k)) {
            out.warn(`${p}.buttons.${k}`, `unknown button "${k}" (ignored)`);
          }
        }
      }
    }

    const advance = (raw.advanceOn ?? 'button') as string;
    if (!ADVANCE.has(advance)) {
      out.error(`${p}.advanceOn`, `must be one of: ${[...ADVANCE].join(' | ')}`);
    }
    if (advance === 'event' && typeof raw.event !== 'string') {
      out.error(`${p}.event`, 'required when advanceOn === "event"');
    }
    if (advance === 'auto' && (typeof raw.duration !== 'number' || (raw.duration as number) <= 0)) {
      out.error(`${p}.duration`, 'required positive number (ms) when advanceOn === "auto"');
    }
    if (advance === 'target-click' && raw.target === undefined) {
      out.error(`${p}.target`, 'required when advanceOn === "target-click"');
    }
    if (advance === 'input-match') {
      if (raw.target === undefined) out.error(`${p}.target`, 'required when advanceOn === "input-match"');
      if (typeof raw.match !== 'string') out.error(`${p}.match`, 'required when advanceOn === "input-match"');
    }
    if (advance === 'form-submit' && raw.target === undefined) {
      out.error(`${p}.target`, 'required when advanceOn === "form-submit"');
    }
    if ((advance === 'element-appears' || advance === 'element-disappears') && typeof raw.watch !== 'string') {
      out.error(`${p}.watch`, `required when advanceOn === "${advance}"`);
    }
    if (advance === 'url-match' && typeof raw.urlPattern !== 'string') {
      out.error(`${p}.urlPattern`, 'required when advanceOn === "url-match"');
    }

    if (display === 'beacon' && raw.duration !== undefined && typeof raw.duration !== 'number') {
      out.error(`${p}.duration`, 'must be a number (ms)');
    }

    if (raw.next !== undefined) {
      if (typeof raw.next === 'string') {
        // Cross-reference happens in the second pass, once every id is known.
      } else if (Array.isArray(raw.next)) {
        if (raw.next.length === 0) out.warn(`${p}.next`, 'empty branch list falls through to the next step');
        raw.next.forEach((rule, ri) => {
          const rp = `${p}.next[${ri}]`;
          if (!isObj(rule)) { out.error(rp, 'branch must be an object { if, to }'); return; }
          checkExpr(rule.if, `${rp}.if`, out);
          if (typeof rule.to !== 'string') out.error(`${rp}.to`, 'must be a step id string');
        });
      } else {
        out.error(`${p}.next`, 'must be a step id string or an array of { if, to } branches');
      }
    }

    checkExpr(raw.showIf, `${p}.showIf`, out);
    checkTheme(raw.theme, `${p}.theme`, out);
    checkActions(raw.onEnter, `${p}.onEnter`, out);
    checkActions(raw.onExit, `${p}.onExit`, out);
  });

  // Second pass: every `next` target must name a real step.
  input.steps.forEach((raw, i) => {
    if (!isObj(raw)) return;
    const p = `$.steps[${i}].next`;
    if (typeof raw.next === 'string' && !ids.has(raw.next)) {
      out.error(p, `points to unknown step id "${raw.next}"`);
    } else if (Array.isArray(raw.next)) {
      raw.next.forEach((rule, ri) => {
        if (isObj(rule) && typeof rule.to === 'string' && !ids.has(rule.to)) {
          out.error(`${p}[${ri}].to`, `points to unknown step id "${rule.to}"`);
        }
      });
    }
  });

  return out.errors.length
    ? { ok: false, errors: out.errors, warnings: out.warnings }
    : { ok: true, errors: [] as never[], warnings: out.warnings };
}

export function assertValidSpec(input: unknown): TutorialSpec {
  const result = validateSpec(input);
  if (!result.ok) {
    const detail = result.errors.map((e) => `  • ${e.path}: ${e.message}`).join('\n');
    throw new Error(`[opentutorial] Invalid TutorialSpec:\n${detail}`);
  }
  return input as TutorialSpec;
}

/** Validate a set of specs together, catching cross-spec problems. */
export function validateSpecs(specs: unknown[]): { ok: boolean; issues: Array<SpecIssue & { specId?: string }> } {
  const issues: Array<SpecIssue & { specId?: string }> = [];
  const seen = new Set<string>();

  specs.forEach((spec, i) => {
    const id = isObj(spec) && typeof spec.id === 'string' ? spec.id : undefined;
    const result = validateSpec(spec);
    for (const issue of [...result.errors, ...result.warnings]) {
      issues.push({ ...issue, path: `[${i}]${issue.path.slice(1)}`, specId: id });
    }
    if (id) {
      if (seen.has(id)) {
        issues.push({ path: `[${i}].id`, message: `duplicate tour id "${id}"`, severity: 'error', specId: id });
      }
      seen.add(id);
    }
  });

  // Chained tours must point at a spec that exists in the same set.
  specs.forEach((spec, i) => {
    if (!isObj(spec) || !isObj(spec.onComplete)) return;
    const next = spec.onComplete.startTour;
    if (typeof next === 'string' && !seen.has(next)) {
      issues.push({
        path: `[${i}].onComplete.startTour`,
        message: `chains to unknown tour "${next}"`,
        severity: 'warning',
        specId: typeof spec.id === 'string' ? spec.id : undefined,
      });
    }
  });

  return { ok: !issues.some((i) => i.severity === 'error'), issues };
}
