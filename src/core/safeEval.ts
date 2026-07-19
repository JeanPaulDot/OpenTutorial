type Token =
  | { t: 'op'; v: '===' | '!==' | '&&' | '||' | '!' | '(' | ')' }
  | { t: 'str'; v: string }
  | { t: 'num'; v: number }
  | { t: 'bool'; v: boolean }
  | { t: 'null' }
  | { t: 'ident'; v: string }
  | { t: 'dot' };

const MAX_LEN = 200;

function resolve(ctx: Record<string, unknown>, path: string[], start = 0): unknown {
  let val: unknown = ctx;
  for (let i = start; i < path.length; i++) {
    if (typeof val !== 'object' || val === null) return undefined;
    val = (val as Record<string, unknown>)[path[i]];
  }
  return val;
}

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    if (/^\s/.test(rest)) { i += 1; continue; }
    let m = rest.match(/^(===|!==|&&|\|\||[()!])/);
    if (m) { tokens.push({ t: 'op', v: m[1] as never }); i += m[1].length; continue; }
    if (rest[0] === '.') { tokens.push({ t: 'dot' }); i += 1; continue; }
    m = rest.match(/^'([^']*)'/) ?? rest.match(/^"([^"]*)"/);
    if (m) { tokens.push({ t: 'str', v: m[1] }); i += m[0].length; continue; }
    m = rest.match(/^\d+(\.\d+)?/);
    if (m) { tokens.push({ t: 'num', v: Number(m[0]) }); i += m[0].length; continue; }
    m = rest.match(/^(true|false)\b/);
    if (m) { tokens.push({ t: 'bool', v: m[1] === 'true' }); i += m[0].length; continue; }
    m = rest.match(/^null\b/);
    if (m) { tokens.push({ t: 'null' }); i += m[0].length; continue; }
    m = rest.match(/^[A-Za-z_$][\w$]*/);
    if (m) { tokens.push({ t: 'ident', v: m[0] }); i += m[0].length; continue; }
    throw new Error(`Unexpected character at ${i}`);
  }
  return tokens;
}

type Value = unknown;

class Parser {
  private pos = 0;
  private tokens: Token[];
  private ctx: Record<string, unknown>;

  constructor(tokens: Token[], ctx: Record<string, unknown>) {
    this.tokens = tokens;
    this.ctx = ctx;
  }

  parse(): Value {
    const v = this.orExpr();
    if (this.pos !== this.tokens.length) throw new Error('Trailing tokens');
    return v;
  }

  private peek(): Token | undefined { return this.tokens[this.pos]; }
  private isOp(v: string): boolean {
    const t = this.peek();
    return !!t && t.t === 'op' && t.v === v;
  }
  private isDot(): boolean {
    const t = this.peek();
    return !!t && t.t === 'dot';
  }
  private eatOp(v: string): boolean {
    if (this.isOp(v)) { this.pos += 1; return true; }
    return false;
  }

  private orExpr(): Value {
    let left = this.andExpr();
    while (this.eatOp('||')) {
      const right = this.andExpr();
      left = Boolean(left) || Boolean(right);
    }
    return left;
  }

  private andExpr(): Value {
    let left = this.cmpExpr();
    while (this.eatOp('&&')) {
      const right = this.cmpExpr();
      left = Boolean(left) && Boolean(right);
    }
    return left;
  }

  private cmpExpr(): Value {
    const left = this.unary();
    if (this.eatOp('===')) return left === this.unary();
    if (this.eatOp('!==')) return left !== this.unary();
    return left;
  }

  private unary(): Value {
    if (this.eatOp('!')) return !this.unary();
    return this.primary();
  }

  private primary(): Value {
    const t = this.peek();
    if (!t) throw new Error('Unexpected end of expression');
    if (t.t === 'op' && t.v === '(') {
      this.pos += 1;
      const v = this.orExpr();
      if (!this.eatOp(')')) throw new Error('Missing closing parenthesis');
      return v;
    }
    this.pos += 1;
    switch (t.t) {
      case 'str': return t.v;
      case 'num': return t.v;
      case 'bool': return t.v;
      case 'null': return null;
      case 'ident': {
        const path = [t.v];
        while (this.isDot()) {
          this.pos += 1;
          const next = this.peek();
          if (!next || next.t !== 'ident') throw new Error('Expected identifier after dot');
          this.pos += 1;
          path.push(next.v);
        }
        return resolve(this.ctx, path);
      }
      default: throw new Error(`Unexpected token`);
    }
  }
}

export function evaluateShowIf(expr: string, ctx: Record<string, unknown>): boolean {
  try {
    if (expr.length > MAX_LEN) return false;
    return Boolean(new Parser(tokenize(expr), ctx).parse());
  } catch {
    return false;
  }
}
