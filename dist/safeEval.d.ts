/**
 * A tiny sandboxed expression evaluator for `showIf`, `next` branches and
 * `audience` rules.
 *
 * Deliberately hand-written: no `eval`, no `new Function`, so the library stays
 * usable under a strict Content-Security-Policy. The grammar covers boolean
 * logic, comparison, arithmetic, member/index access and a fixed whitelist of
 * string/array methods — nothing that can reach the host page.
 */
export interface EvalOptions {
    maxLength?: number;
    /** Called when an expression fails to parse. Feeds the debug overlay. */
    onError?: (message: string, expr: string) => void;
}
/** Evaluate an expression to its raw value. Returns `undefined` on any failure. */
export declare function evaluateExpression(expr: string, ctx: Record<string, unknown>, opts?: EvalOptions): unknown;
/** Evaluate to a boolean. A malformed expression is falsy — it never throws. */
export declare function evaluateShowIf(expr: string, ctx: Record<string, unknown>, opts?: EvalOptions): boolean;
/** Syntax-check without real data. Used by the validator and the CLI. */
export declare function checkExpression(expr: string): {
    ok: true;
} | {
    ok: false;
    message: string;
};
