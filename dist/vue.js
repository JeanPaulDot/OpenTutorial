import { createTutorialLayer as o } from "./index.js";
import { DEFAULT_LABELS as p, MemoryStorage as g, SurfaceState as S, TourEngine as m, TourOrchestrator as T, TourPersistence as f, assertValidSpec as v, blocksToText as A, createAnnouncement as b, createBanner as h, createChangelog as x, createChecklist as E, createCookieStorage as C, createHint as y, createIndexedDBStorage as P, createKeyResolver as L, createLocaleResolver as R, createMemoryStorage as k, createRemoteStorage as w, createResourceCenter as D, createSurvey as H, createTour as I, createTours as B, currentPath as F, defineSpec as M, defineStep as O, escapeHtml as U, extendSpec as V, installTrigger as q, interpolate as K, localeDirection as _, matchPath as j, normalizeContent as z, onLocationChange as G, renderBlocks as Q, renderInline as Y, resolveLabel as $, resolveText as J, selectPlural as N, validateSpec as W, validateSpecs as X } from "./index.js";
import { C as ee, c as te, d as re, e as ae, a as oe, i as ce, q as ne, r as se, s as ie, w as le, b as ue } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as pe, createDatadogAdapter as ge, createDebugAdapter as Se, createEventCollector as me, createFunnelReport as Te, createGA4Adapter as fe, createHeapAdapter as ve, createHttpAdapter as Ae, createMixpanelAdapter as be, createMultiAdapter as he, createPostHogAdapter as xe, createRudderStackAdapter as Ee, createSegmentAdapter as Ce, filterEvents as ye, shouldSample as Pe, withEventTypes as Le, withSampling as Re } from "./analytics.js";
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
  ee as CSS,
  p as DEFAULT_LABELS,
  g as MemoryStorage,
  S as SurfaceState,
  n as TOUR_KEY,
  m as TourEngine,
  T as TourOrchestrator,
  f as TourPersistence,
  v as assertValidSpec,
  A as blocksToText,
  te as checkExpression,
  pe as createAmplitudeAdapter,
  b as createAnnouncement,
  h as createBanner,
  x as createChangelog,
  E as createChecklist,
  C as createCookieStorage,
  ge as createDatadogAdapter,
  Se as createDebugAdapter,
  me as createEventCollector,
  Te as createFunnelReport,
  fe as createGA4Adapter,
  ve as createHeapAdapter,
  y as createHint,
  Ae as createHttpAdapter,
  P as createIndexedDBStorage,
  L as createKeyResolver,
  R as createLocaleResolver,
  k as createMemoryStorage,
  be as createMixpanelAdapter,
  he as createMultiAdapter,
  xe as createPostHogAdapter,
  w as createRemoteStorage,
  D as createResourceCenter,
  Ee as createRudderStackAdapter,
  Ce as createSegmentAdapter,
  H as createSurvey,
  I as createTour,
  i as createTourPlugin,
  B as createTours,
  o as createTutorialLayer,
  l as createVueTour,
  F as currentPath,
  M as defineSpec,
  O as defineStep,
  re as describeTarget,
  U as escapeHtml,
  ae as evaluateExpression,
  oe as evaluateShowIf,
  V as extendSpec,
  ye as filterEvents,
  q as installTrigger,
  K as interpolate,
  ce as isVisible,
  _ as localeDirection,
  j as matchPath,
  z as normalizeContent,
  G as onLocationChange,
  ne as queryDeep,
  Q as renderBlocks,
  Y as renderInline,
  $ as resolveLabel,
  se as resolveTarget,
  J as resolveText,
  ie as safeQuery,
  N as selectPlural,
  Pe as shouldSample,
  W as validateSpec,
  X as validateSpecs,
  le as waitForElement,
  ue as waitForTarget,
  Le as withEventTypes,
  Re as withSampling
};
//# sourceMappingURL=vue.js.map
