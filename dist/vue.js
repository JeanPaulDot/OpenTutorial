import { createTutorialLayer as o } from "./index.js";
import { DEFAULT_LABELS as p, MemoryStorage as g, TourEngine as S, TourOrchestrator as m, TourPersistence as T, assertValidSpec as f, blocksToText as A, createCookieStorage as v, createIndexedDBStorage as b, createKeyResolver as x, createLocaleResolver as E, createMemoryStorage as h, createRemoteStorage as L, createTour as P, createTours as y, currentPath as C, defineSpec as R, defineStep as k, escapeHtml as D, extendSpec as I, installTrigger as w, interpolate as F, matchPath as H, normalizeContent as M, onLocationChange as B, renderBlocks as O, renderInline as U, resolveLabel as V, resolveText as q, validateSpec as K, validateSpecs as _ } from "./index.js";
import { C as z, c as G, d as Q, e as Y, a as $, i as J, q as N, r as W, s as X, w as Z, b as ee } from "./chunks/target.es.js";
import { createAmplitudeAdapter as re, createDatadogAdapter as ae, createDebugAdapter as oe, createEventCollector as ce, createFunnelReport as ne, createGA4Adapter as se, createHeapAdapter as ie, createHttpAdapter as le, createMixpanelAdapter as ue, createMultiAdapter as de, createPostHogAdapter as pe, createRudderStackAdapter as ge, createSegmentAdapter as Se, filterEvents as me } from "./analytics.js";
const n = /* @__PURE__ */ Symbol.for("opentutorial");
function c(e) {
  return Object.assign(e, {
    snapshot: () => ({ activeId: e.getActiveId(), state: e.getState() }),
    subscribe: (t) => e.on("event", t)
  });
}
function i(e) {
  return {
    install(t) {
      const r = c(o(e));
      t.provide(n, r), t.config?.globalProperties && (t.config.globalProperties.$tour = r);
      const a = t.unmount?.bind(t);
      a && (t.unmount = () => {
        r.destroy(), a();
      });
    }
  };
}
function l(e) {
  return c(o(e));
}
export {
  z as CSS,
  p as DEFAULT_LABELS,
  g as MemoryStorage,
  n as TOUR_KEY,
  S as TourEngine,
  m as TourOrchestrator,
  T as TourPersistence,
  f as assertValidSpec,
  A as blocksToText,
  G as checkExpression,
  re as createAmplitudeAdapter,
  v as createCookieStorage,
  ae as createDatadogAdapter,
  oe as createDebugAdapter,
  ce as createEventCollector,
  ne as createFunnelReport,
  se as createGA4Adapter,
  ie as createHeapAdapter,
  le as createHttpAdapter,
  b as createIndexedDBStorage,
  x as createKeyResolver,
  E as createLocaleResolver,
  h as createMemoryStorage,
  ue as createMixpanelAdapter,
  de as createMultiAdapter,
  pe as createPostHogAdapter,
  L as createRemoteStorage,
  ge as createRudderStackAdapter,
  Se as createSegmentAdapter,
  P as createTour,
  i as createTourPlugin,
  y as createTours,
  o as createTutorialLayer,
  l as createVueTour,
  C as currentPath,
  R as defineSpec,
  k as defineStep,
  Q as describeTarget,
  D as escapeHtml,
  Y as evaluateExpression,
  $ as evaluateShowIf,
  I as extendSpec,
  me as filterEvents,
  w as installTrigger,
  F as interpolate,
  J as isVisible,
  H as matchPath,
  M as normalizeContent,
  B as onLocationChange,
  N as queryDeep,
  O as renderBlocks,
  U as renderInline,
  V as resolveLabel,
  W as resolveTarget,
  q as resolveText,
  X as safeQuery,
  K as validateSpec,
  _ as validateSpecs,
  Z as waitForElement,
  ee as waitForTarget
};
//# sourceMappingURL=vue.js.map
