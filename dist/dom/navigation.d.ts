/**
 * Location tracking for route triggers and `advanceOn: 'url-match'`.
 *
 * `popstate` only fires on back/forward, so SPA navigations via `pushState` are
 * invisible without patching. The patch is installed once, is idempotent, and
 * always calls through to the original method.
 */
export declare function currentPath(): string;
/**
 * Match a path pattern. Supports a trailing `*` wildcard and `:param` segments;
 * anything else is compared literally.
 */
export declare function matchPath(pattern: string, path: string, exact?: boolean): boolean;
/** Subscribe to every location change, including SPA pushes. */
export declare function onLocationChange(cb: () => void): () => void;
