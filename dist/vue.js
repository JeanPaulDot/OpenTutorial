import { createTutorialLayer as o } from "./index.js";
import { DEFAULT_LABELS as g, MemoryStorage as p, SurfaceState as S, TourEngine as m, TourOrchestrator as T, TourPersistence as f, assertValidSpec as v, assignAll as A, assignVariant as h, createAnnouncement as b, createBanner as x, createChangelog as k, createChecklist as E, createCookieStorage as C, createHint as w, createIndexedDBStorage as y, createKeyResolver as P, createLocaleResolver as L, createMemoryStorage as R, createRemoteStorage as D, createResourceCenter as M, createSurvey as B, createTour as H, createTours as I, currentPath as F, defineSpec as V, defineStep as O, extendSpec as U, installTrigger as j, interpolate as q, localeDirection as K, matchPath as _, onLocationChange as z, resolveLabel as G, resolveText as Q, selectPlural as Y, validateSpec as $, validateSpecs as J } from "./index.js";
import { C as W, b as X, c as Z, d as ee, e as te, a as re, f as ae, h as oe, i as ne, n as ce, q as se, r as ie, g as le, j as ue, k as de, l as ge, s as pe, w as Se, m as me } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as fe, createDatadogAdapter as ve, createDebugAdapter as Ae, createEventCollector as he, createFunnelReport as be, createGA4Adapter as xe, createHeapAdapter as ke, createHttpAdapter as Ee, createMixpanelAdapter as Ce, createMultiAdapter as we, createPostHogAdapter as ye, createRudderStackAdapter as Pe, createSegmentAdapter as Le, filterEvents as Re, shouldSample as De, withEventTypes as Me, withSampling as Be } from "./analytics.js";
const c = /* @__PURE__ */ Symbol.for("opentutorial");
function n(e) {
  return Object.assign(e, {
    snapshot: () => ({ activeId: e.getActiveId(), state: e.getState() }),
    subscribe: (t) => e.on("event", t)
  });
}
function i(e) {
  return {
    install(t) {
      const r = n(o(e));
      t.provide(c, r), t.config?.globalProperties && (t.config.globalProperties.$tour = r);
      const a = t.unmount?.bind(t);
      a && (t.unmount = () => {
        r.destroy(), a();
      });
    }
  };
}
function l(e) {
  return n(o(e));
}
export {
  W as CSS,
  g as DEFAULT_LABELS,
  p as MemoryStorage,
  S as SurfaceState,
  c as TOUR_KEY,
  m as TourEngine,
  T as TourOrchestrator,
  f as TourPersistence,
  v as assertValidSpec,
  A as assignAll,
  h as assignVariant,
  X as blocksToText,
  Z as checkExpression,
  fe as createAmplitudeAdapter,
  b as createAnnouncement,
  x as createBanner,
  k as createChangelog,
  E as createChecklist,
  C as createCookieStorage,
  ve as createDatadogAdapter,
  Ae as createDebugAdapter,
  he as createEventCollector,
  be as createFunnelReport,
  xe as createGA4Adapter,
  ke as createHeapAdapter,
  w as createHint,
  Ee as createHttpAdapter,
  y as createIndexedDBStorage,
  P as createKeyResolver,
  L as createLocaleResolver,
  R as createMemoryStorage,
  Ce as createMixpanelAdapter,
  we as createMultiAdapter,
  ye as createPostHogAdapter,
  D as createRemoteStorage,
  M as createResourceCenter,
  Pe as createRudderStackAdapter,
  Le as createSegmentAdapter,
  B as createSurvey,
  H as createTour,
  i as createTourPlugin,
  I as createTours,
  o as createTutorialLayer,
  l as createVueTour,
  F as currentPath,
  V as defineSpec,
  O as defineStep,
  ee as describeTarget,
  te as escapeHtml,
  re as evaluateExpression,
  ae as evaluateShowIf,
  U as extendSpec,
  Re as filterEvents,
  oe as hasBlockMarkdown,
  j as installTrigger,
  q as interpolate,
  ne as isVisible,
  K as localeDirection,
  _ as matchPath,
  ce as normalizeContent,
  z as onLocationChange,
  se as queryDeep,
  ie as renderBlocks,
  le as renderInline,
  ue as renderMarkdown,
  G as resolveLabel,
  de as resolveTarget,
  ge as resolveTargets,
  Q as resolveText,
  pe as safeQuery,
  Y as selectPlural,
  De as shouldSample,
  $ as validateSpec,
  J as validateSpecs,
  Se as waitForElement,
  me as waitForTarget,
  Me as withEventTypes,
  Be as withSampling
};
//# sourceMappingURL=vue.js.map
