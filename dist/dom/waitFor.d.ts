/**
 * Back-compat surface. Target resolution now lives in `./target`, which also
 * handles selector fallbacks, text matching, shadow roots and iframes.
 */
export { waitForElement, waitForTarget, safeQuery, resolveTarget } from './target';
