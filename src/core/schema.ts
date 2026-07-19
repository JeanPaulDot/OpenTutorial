import type { SpecError, TutorialSpec, ValidationResult } from './types';

const PLACEMENTS = new Set([
  'auto',
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
]);

const DISPLAY_MODES = new Set(['spotlight', 'hotspot', 'beacon']);
const ADVANCE = new Set(['button', 'target-click', 'event', 'auto']);
const TRIGGER_TYPES = new Set(['manual', 'auto', 'event']);
const ACTION_TYPES = new Set(['emit', 'click', 'focus', 'navigate', 'setContext']);
const TOP_LEVEL_KEYS = new Set([
  'specVersion', 'id', 'title', 'description', 'version', 'trigger', 'theme', 'steps',
]);
const THEME_KEYS = new Set([
  'accent', 'bg', 'fg', 'muted', 'backdrop', 'radius', 'shadow', 'font', 'z',
  'spotlightRing', 'popoverWidth',
]);

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function checkTheme(theme: unknown, path: string, errors: SpecError[]): void {
  if (theme === undefined) return;
  if (!isObj(theme)) { errors.push({ path, message: 'theme must be an object' }); return; }
  for (const k of Object.keys(theme)) {
    if (!THEME_KEYS.has(k)) {
      errors.push({ path: `${path}.${k}`, message: `unknown theme token "${k}"` });
    }
  }
}

function checkActions(actions: unknown, path: string, errors: SpecError[]): void {
  if (actions === undefined) return;
  if (!Array.isArray(actions)) { errors.push({ path, message: 'must be an array of actions' }); return; }
  actions.forEach((a, i) => {
    const p = `${path}[${i}]`;
    if (!isObj(a)) { errors.push({ path: p, message: 'action must be an object' }); return; }
    if (!ACTION_TYPES.has(a.type as string)) {
      errors.push({ path: `${p}.type`, message: `unknown action type "${String(a.type)}"` });
      return;
    }
    if (a.type === 'emit' && typeof a.name !== 'string') {
      errors.push({ path: `${p}.name`, message: 'emit action requires a string "name"' });
    }
    if (a.type === 'navigate' && (typeof a.path !== 'string' || !a.path.startsWith('/'))) {
      errors.push({ path: `${p}.path`, message: 'navigate action requires a same-origin "path" starting with /' });
    }
    if (a.type === 'setContext' && typeof a.key !== 'string') {
      errors.push({ path: `${p}.key`, message: 'setContext action requires a string "key"' });
    }
  });
}

function resolveContent(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (isObj(v) && typeof v.key === 'string') return v.key;
  return undefined;
}

export function validateSpec(input: unknown): ValidationResult {
  const errors: SpecError[] = [];
  const push = (path: string, message: string) => errors.push({ path, message });

  if (!isObj(input)) {
    return { ok: false, errors: [{ path: '$', message: 'spec must be a JSON object' }] };
  }

  for (const k of Object.keys(input)) {
    if (!TOP_LEVEL_KEYS.has(k)) push(`$.${k}`, `unknown top-level key "${k}"`);
  }

  if (input.specVersion !== 1) push('$.specVersion', 'must be the integer 1');

  if (typeof input.id !== 'string' || !input.id) push('$.id', 'required, non-empty string');
  else if (!KEBAB.test(input.id)) push('$.id', 'must be kebab-case (e.g. "dashboard-intro")');

  const title = resolveContent(input.title);
  if (!title) push('$.title', 'required (string or i18n object with key)');
  else if (typeof input.title === 'string' && input.title.length > 60) push('$.title', `must be ≤ 60 chars (got ${input.title.length})`);

  if (input.description !== undefined) {
    const desc = resolveContent(input.description);
    if (!desc) push('$.description', 'must be a string or i18n object');
    else if (desc.length > 200) push('$.description', `must be ≤ 200 chars (got ${desc.length})`);
  }

  if (input.version !== undefined && typeof input.version !== 'string') {
    push('$.version', 'must be a string (e.g. "1.0.0")');
  }

  if (input.trigger !== undefined) {
    if (!isObj(input.trigger)) push('$.trigger', 'must be an object');
    else {
      const t = input.trigger;
      if (!TRIGGER_TYPES.has(t.type as string)) {
        push('$.trigger.type', 'must be "manual" | "auto" | "event"');
      }
      if (t.type === 'event' && typeof t.event !== 'string') {
        push('$.trigger.event', 'required when trigger.type === "event"');
      }
      if (t.delay !== undefined && (typeof t.delay !== 'number' || t.delay < 0)) {
        push('$.trigger.delay', 'must be a non-negative number (ms)');
      }
    }
  }

  checkTheme(input.theme, '$.theme', errors);

  if (!Array.isArray(input.steps)) {
    push('$.steps', 'required, must be an array');
    return errors.length ? { ok: false, errors } : { ok: false, errors: [{ path: '$.steps', message: 'missing' }] };
  }
  if (input.steps.length < 1) push('$.steps', 'must contain at least 1 step');
  if (input.steps.length > 24) push('$.steps', `must contain ≤ 24 steps (got ${input.steps.length})`);

  const ids = new Set<string>();
  input.steps.forEach((raw, i) => {
    const p = `$.steps[${i}]`;
    if (!isObj(raw)) { push(p, 'step must be an object'); return; }

    if (typeof raw.id !== 'string' || !raw.id) push(`${p}.id`, 'required');
    else if (ids.has(raw.id)) push(`${p}.id`, `duplicate step id "${raw.id}"`);
    else ids.add(raw.id);

    if (raw.display !== undefined && !DISPLAY_MODES.has(raw.display as string)) {
      push(`${p}.display`, 'must be "spotlight" | "hotspot" | "beacon"');
    }

    if (raw.target !== undefined) {
      if (!isObj(raw.target)) push(`${p}.target`, 'must be an object');
      else {
        if (typeof raw.target.selector !== 'string' || !raw.target.selector.trim()) {
          push(`${p}.target.selector`, 'required, non-empty CSS selector');
        }
        if (raw.target.timeout !== undefined && (typeof raw.target.timeout !== 'number' || raw.target.timeout < 0)) {
          push(`${p}.target.timeout`, 'must be a non-negative number (ms)');
        }
        if (raw.target.padding !== undefined && (typeof raw.target.padding !== 'number' || raw.target.padding < 0)) {
          push(`${p}.target.padding`, 'must be a non-negative number (px)');
        }
      }
    }

    if (raw.placement !== undefined && !PLACEMENTS.has(raw.placement as string)) {
      push(`${p}.placement`, `must be one of: ${[...PLACEMENTS].join(' | ')}`);
    }

    const stepTitle = resolveContent(raw.title);
    if (!stepTitle) push(`${p}.title`, 'required (string or i18n object with key)');
    else if (stepTitle.length > 80) push(`${p}.title`, `must be ≤ 80 chars (got ${stepTitle.length})`);

    const content = resolveContent(raw.content);
    if (!content) push(`${p}.content`, 'required (string or i18n object with key)');
    else if (content.length > 320) push(`${p}.content`, `must be ≤ 320 chars (got ${content.length})`);

    const advance = raw.advanceOn ?? 'button';
    if (!ADVANCE.has(advance as string)) {
      push(`${p}.advanceOn`, 'must be "button" | "target-click" | "event" | "auto"');
    }
    if (advance === 'event' && typeof raw.event !== 'string') {
      push(`${p}.event`, 'required when advanceOn === "event"');
    }
    if (advance === 'auto' && (typeof raw.duration !== 'number' || (raw.duration as number) <= 0)) {
      push(`${p}.duration`, 'required positive number (ms) when advanceOn === "auto"');
    }
    if (advance === 'target-click' && raw.target === undefined) {
      push(`${p}.target`, 'required when advanceOn === "target-click"');
    }

    if (raw.next !== undefined && typeof raw.next !== 'string') {
      push(`${p}.next`, 'must be a step id string');
    }
    if (raw.showIf !== undefined && (typeof raw.showIf !== 'string' || raw.showIf.length > 200)) {
      push(`${p}.showIf`, 'must be a string expression ≤ 200 chars');
    }

    checkTheme(raw.theme, `${p}.theme`, errors);
    checkActions(raw.onEnter, `${p}.onEnter`, errors);
    checkActions(raw.onExit, `${p}.onExit`, errors);
  });

  input.steps.forEach((raw, i) => {
    if (isObj(raw) && typeof raw.next === 'string' && !ids.has(raw.next)) {
      push(`$.steps[${i}].next`, `points to unknown step id "${raw.next}"`);
    }
  });

  return errors.length ? { ok: false, errors } : { ok: true };
}

export function assertValidSpec(input: unknown): TutorialSpec {
  const result = validateSpec(input);
  if (!result.ok) {
    const detail = result.errors.map((e) => `  • ${e.path}: ${e.message}`).join('\n');
    throw new Error(`[opentutorial] Invalid TutorialSpec:\n${detail}`);
  }
  return input as TutorialSpec;
}
