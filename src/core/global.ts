/**
 * Entry for the IIFE build (`dist/opentutorial.global.js`).
 *
 * Everything here works without a bundler and without React, so a plain HTML
 * page can drop in a script tag and start a tour:
 *
 * ```html
 * <link rel="stylesheet" href="https://unpkg.com/@opentutorial/core/dist/styles.css">
 * <script src="https://unpkg.com/@opentutorial/core/dist/opentutorial.global.js"></script>
 * <script>
 *   const tl = OpenTutorial.createTutorialLayer({ specs: [ ... ] });
 *   tl.start('welcome');
 * </script>
 * ```
 */

export { createTutorialLayer } from './adapters/vanilla';
export { TourEngine } from './engine';
export { TourOrchestrator } from './orchestrator';
export { TourPersistence } from './persist';
export { createTour, createTours, defineSpec } from './factory';
export { validateSpec, validateSpecs, assertValidSpec } from './schema';
export { evaluateShowIf, evaluateExpression } from './safeEval';
export { resolveTarget, waitForTarget } from './dom/target';
export { createCookieStorage, createIndexedDBStorage, createRemoteStorage } from './storage';
export { startRecorder, enableRecorderFromUrl, bestSelector, auditSelectors } from './authoring';
export { createDebugPanel, logEvents } from './authoring/debug';
export {
  createPostHogAdapter,
  createMixpanelAdapter,
  createAmplitudeAdapter,
  createSegmentAdapter,
  createGA4Adapter,
  createHttpAdapter,
  createFunnelReport,
  createEventCollector,
  createMultiAdapter,
} from './analytics';
export {
  createBanner,
  createAnnouncement,
  createHint,
  createSurvey,
  createChecklist,
  createResourceCenter,
  createChangelog,
} from './surfaces';
export { defineOpenTutorialElement } from './adapters/webcomponent';
export { CSS } from './styles';

import { defineOpenTutorialElement } from './adapters/webcomponent';
import { enableRecorderFromUrl } from './authoring/recorder';

// A script-tag consumer expects the element and the `?ot-record=1` hook to work
// without extra wiring; both are no-ops when unused.
defineOpenTutorialElement();
enableRecorderFromUrl();

// The global was `Opentutorial` in 0.2.0. Alias it rather than break every
// script-tag page that already shipped.
//
// Deferred to a microtask because the IIFE wrapper assigns `window.OpenTutorial`
// only after this module body has finished running — reading it here directly
// would always see `undefined`.
queueMicrotask(() => {
  const scope = globalThis as Record<string, unknown>;
  if (scope.OpenTutorial && !scope.Opentutorial) scope.Opentutorial = scope.OpenTutorial;
});
