/**
 * A tiny sandboxed expression evaluator for `showIf`, `next` branches and
 * `audience` rules.
 *
 * Deliberately hand-written: no `eval`, no `new Function`, so the library stays
 * usable under a strict Content-Security-Policy. The grammar covers boolean
 * logic, comparison, arithmetic, member/index access and a fixed whitelist of
 * string/array methods — nothing that can reach the host page.
 */

type OpValue =
  | '===' | '!==' | '==' | '!=' | '<=' | '>=' | '<' | '>'
  | '&&' | '||' | '!' | '(' | ')' | '[' | ']' | ','
  | '+' | '-' | '*' | '/' | '%' | '?' | ':';

type Token =
  | { t: 'op'; v: OpValue }
  | { t: 'str'; v: string }
  | { t: 'num'; v: number }
  | { t: 'bool'; v: boolean }
  | { t: 'null' }
  | { t: 'undef' }
  | { t: 'ident'; v: string }
  | { t: 'dot' };

const DEFAULT_MAX_LEN = 500;

/** Prototype-pollution guards: these keys are never readable through an expression. */
const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/** Methods callable on a resolved value. Each is pure and cannot escape the sandbox. */
const SAFE_METHODS: Record<string, (target: unknown, args: unknown[]) => unknown> = {
  includes: (t, a) => {
    if (typeof t === 'string') return t.includes(String(a[0]));
    if (Array.isArray(t)) return t.includes(a[0]);
    return false;
  },
  startsWith: (t, a) => (typeof t === 'string' ? t.startsWith(String(a[0])) : false),
  endsWith: (t, a) => (typeof t === 'string' ? t.endsWith(String(a[0])) : false),
  toLowerCase: (t) => (typeof t === 'string' ? t.toLowerCase() : t),
  toUpperCase: (t) => (typeof t === 'string' ? t.toUpperCase() : t),
  trim: (t) => (typeof t === 'string' ? t.trim() : t),
  indexOf: (t, a) => {
    if (typeof t === 'string') return t.indexOf(String(a[0]));
    if (Array.isArray(t)) return t.indexOf(a[0]);
    return -1;
  },
  /** `value.matches('^pro')` — regex test against the resolved string. */
  matches: (t, a) => {
    if (typeof t !== 'string') return false;
    try { return new RegExp(String(a[0])).test(t); } catch { return false; }
  },
};

/** Longest-first so "===" is matched before "==", "<=" before "<". */
const OPERATORS: OpValue[] = [
  '===', '!==', '==', '!=', '<=', '>=',
  '&&', '||',
  '<', '>', '!', '(', ')', '[', ']', ',',
  '+', '-', '*', '/', '%', '?', ':',
];

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    if (/^\s/.test(rest)) { i += 1; continue; }

    const op = OPERATORS.find((o) => rest.startsWith(o));
    if (op) { tokens.push({ t: 'op', v: op }); i += op.length; continue; }

    if (rest[0] === '.') { tokens.push({ t: 'dot' }); i += 1; continue; }

    let m = rest.match(/^'((?:[^'\\]|\\.)*)'/) ?? rest.match(/^"((?:[^"\\]|\\.)*)"/);
    if (m) {
      tokens.push({ t: 'str', v: m[1].replace(/\\(.)/g, '$1') });
      i += m[0].length;
      continue;
    }

    m = rest.match(/^\d+(\.\d+)?/);
    if (m) { tokens.push({ t: 'num', v: Number(m[0]) }); i += m[0].length; continue; }

    m = rest.match(/^(true|false)\b/);
    if (m) { tokens.push({ t: 'bool', v: m[1] === 'true' }); i += m[0].length; continue; }

    m = rest.match(/^null\b/);
    if (m) { tokens.push({ t: 'null' }); i += m[0].length; continue; }

    m = rest.match(/^undefined\b/);
    if (m) { tokens.push({ t: 'undef' }); i += m[0].length; continue; }

    m = rest.match(/^[A-Za-z_$][\w$]*/);
    if (m) { tokens.push({ t: 'ident', v: m[0] }); i += m[0].length; continue; }

    throw new Error(`Unexpected character "${rest[0]}" at ${i}`);
  }
  return tokens;
}

function readKey(target: unknown, key: string | number): unknown {
  if (target === null || target === undefined) return undefined;
  if (typeof key === 'string' && BLOCKED_KEYS.has(key)) return undefined;
  if (typeof target === 'string') {
    if (key === 'length') return target.length;
    if (typeof key === 'number') return target[key];
    return undefined;
  }
  if (Array.isArray(target)) {
    if (key === 'length') return target.length;
    return target[key as number];
  }
  if (typeof target === 'object') {
    return (target as Record<string, unknown>)[String(key)];
  }
  return undefined;
}

function looseEq(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || a === undefined) return b === null || b === undefined;
  if (typeof a === 'number' || typeof b === 'number') return Number(a) === Number(b);
  return String(a) === String(b);
}

function num(v: unknown): number {
  return typeof v === 'number' ? v : Number(v);
}

class Parser {
  private pos = 0;
  private tokens: Token[];
  private ctx: Record<string, unknown>;

  constructor(tokens: Token[], ctx: Record<string, unknown>) {
    this.tokens = tokens;
    this.ctx = ctx;
  }

  parse(): unknown {
    const v = this.ternary();
    if (this.pos !== this.tokens.length) throw new Error('Trailing tokens');
    return v;
  }

  private peek(): Token | undefined { return this.tokens[this.pos]; }

  private isOp(v: OpValue): boolean {
    const t = this.peek();
    return !!t && t.t === 'op' && t.v === v;
  }

  private eatOp(v: OpValue): boolean {
    if (this.isOp(v)) { this.pos += 1; return true; }
    return false;
  }

  private expectOp(v: OpValue): void {
    if (!this.eatOp(v)) throw new Error(`Expected "${v}"`);
  }

  private ternary(): unknown {
    const cond = this.orExpr();
    if (!this.eatOp('?')) return cond;
    const whenTrue = this.ternary();
    this.expectOp(':');
    const whenFalse = this.ternary();
    return cond ? whenTrue : whenFalse;
  }

  private orExpr(): unknown {
    let left = this.andExpr();
    while (this.eatOp('||')) {
      const right = this.andExpr();
      left = left || right;
    }
    return left;
  }

  private andExpr(): unknown {
    let left = this.equality();
    while (this.eatOp('&&')) {
      const right = this.equality();
      left = left && right;
    }
    return left;
  }

  private equality(): unknown {
    let left = this.relational();
    for (;;) {
      if (this.eatOp('===')) { left = left === this.relational(); continue; }
      if (this.eatOp('!==')) { left = left !== this.relational(); continue; }
      if (this.eatOp('==')) { left = looseEq(left, this.relational()); continue; }
      if (this.eatOp('!=')) { left = !looseEq(left, this.relational()); continue; }
      return left;
    }
  }

  private relational(): unknown {
    let left = this.additive();
    for (;;) {
      if (this.eatOp('<=')) { left = num(left) <= num(this.additive()); continue; }
      if (this.eatOp('>=')) { left = num(left) >= num(this.additive()); continue; }
      if (this.eatOp('<')) { left = num(left) < num(this.additive()); continue; }
      if (this.eatOp('>')) { left = num(left) > num(this.additive()); continue; }
      return left;
    }
  }

  private additive(): unknown {
    let left = this.multiplicative();
    for (;;) {
      if (this.eatOp('+')) {
        const right = this.multiplicative();
        left = typeof left === 'string' || typeof right === 'string'
          ? String(left) + String(right)
          : num(left) + num(right);
        continue;
      }
      if (this.eatOp('-')) { left = num(left) - num(this.multiplicative()); continue; }
      return left;
    }
  }

  private multiplicative(): unknown {
    let left = this.unary();
    for (;;) {
      if (this.eatOp('*')) { left = num(left) * num(this.unary()); continue; }
      if (this.eatOp('/')) { left = num(left) / num(this.unary()); continue; }
      if (this.eatOp('%')) { left = num(left) % num(this.unary()); continue; }
      return left;
    }
  }

  private unary(): unknown {
    if (this.eatOp('!')) return !this.unary();
    if (this.eatOp('-')) return -num(this.unary());
    return this.postfix();
  }

  private postfix(): unknown {
    let value = this.primary();
    for (;;) {
      if (this.peek()?.t === 'dot') {
        this.pos += 1;
        const next = this.peek();
        if (!next || next.t !== 'ident') throw new Error('Expected identifier after "."');
        this.pos += 1;
        if (this.isOp('(')) {
          this.pos += 1;
          const args: unknown[] = [];
          if (!this.isOp(')')) {
            do { args.push(this.ternary()); } while (this.eatOp(','));
          }
          this.expectOp(')');
          // Own-property check, not a plain lookup: `SAFE_METHODS['constructor']`
          // would otherwise resolve through Object.prototype and hand the
          // expression a real function — `plan.constructor()` used to evaluate
          // to `Object('pro')`, and `toString`/`valueOf`/`hasOwnProperty` were
          // all reachable the same way.
          const fn = Object.prototype.hasOwnProperty.call(SAFE_METHODS, next.v)
            ? SAFE_METHODS[next.v]
            : undefined;
          if (typeof fn !== 'function') throw new Error(`Method "${next.v}" is not allowed`);
          value = fn(value, args);
          continue;
        }
        value = readKey(value, next.v);
        continue;
      }
      if (this.eatOp('[')) {
        const key = this.ternary();
        this.expectOp(']');
        value = readKey(value, typeof key === 'number' ? key : String(key));
        continue;
      }
      return value;
    }
  }

  private primary(): unknown {
    const t = this.peek();
    if (!t) throw new Error('Unexpected end of expression');

    if (t.t === 'op' && t.v === '(') {
      this.pos += 1;
      const v = this.ternary();
      this.expectOp(')');
      return v;
    }

    if (t.t === 'op' && t.v === '[') {
      this.pos += 1;
      const items: unknown[] = [];
      if (!this.isOp(']')) {
        do { items.push(this.ternary()); } while (this.eatOp(','));
      }
      this.expectOp(']');
      return items;
    }

    this.pos += 1;
    switch (t.t) {
      case 'str': return t.v;
      case 'num': return t.v;
      case 'bool': return t.v;
      case 'null': return null;
      case 'undef': return undefined;
      case 'ident': return readKey(this.ctx, t.v);
      default: throw new Error('Unexpected token');
    }
  }
}

export interface EvalOptions {
  maxLength?: number;
  /** Called when an expression fails to parse. Feeds the debug overlay. */
  onError?: (message: string, expr: string) => void;
}

/** Evaluate an expression to its raw value. Returns `undefined` on any failure. */
export function evaluateExpression(
  expr: string,
  ctx: Record<string, unknown>,
  opts: EvalOptions = {},
): unknown {
  try {
    if (typeof expr !== 'string') return undefined;
    if (expr.length > (opts.maxLength ?? DEFAULT_MAX_LEN)) {
      opts.onError?.('expression exceeds the maximum length', expr);
      return undefined;
    }
    return new Parser(tokenize(expr), ctx).parse();
  } catch (err) {
    opts.onError?.(err instanceof Error ? err.message : 'invalid expression', expr);
    return undefined;
  }
}

/** Evaluate to a boolean. A malformed expression is falsy — it never throws. */
export function evaluateShowIf(
  expr: string,
  ctx: Record<string, unknown>,
  opts: EvalOptions = {},
): boolean {
  return Boolean(evaluateExpression(expr, ctx, opts));
}

/** Syntax-check without real data. Used by the validator and the CLI. */
export function checkExpression(expr: string): { ok: true } | { ok: false; message: string } {
  try {
    // Unknown identifiers resolve to undefined against an empty context, so this
    // validates syntax without needing the runtime context to exist yet.
    new Parser(tokenize(expr), {}).parse();
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : 'invalid expression' };
  }
}
