import { createTutorialLayer as o } from "./index.js";
import { DEFAULT_LABELS as g, MemoryStorage as p, SurfaceState as S, TourEngine as m, TourOrchestrator as T, TourPersistence as f, assertValidSpec as v, assignAll as A, assignVariant as h, blocksToText as b, createAnnouncement as x, createBanner as E, createChangelog as k, createChecklist as C, createCookieStorage as w, createHint as y, createIndexedDBStorage as P, createKeyResolver as L, createLocaleResolver as R, createMemoryStorage as D, createRemoteStorage as M, createResourceCenter as B, createSurvey as H, createTour as I, createTours as F, currentPath as V, defineSpec as O, defineStep as U, escapeHtml as q, extendSpec as K, hasBlockMarkdown as _, installTrigger as j, interpolate as z, localeDirection as G, matchPath as Q, normalizeContent as Y, onLocationChange as $, renderBlocks as J, renderInline as N, renderMarkdown as W, resolveLabel as X, resolveText as Z, selectPlural as ee, validateSpec as te, validateSpecs as re } from "./index.js";
import { C as oe, c as ne, d as ce, e as se, a as ie, i as le, q as ue, r as de, b as ge, s as pe, w as Se, f as me } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as fe, createDatadogAdapter as ve, createDebugAdapter as Ae, createEventCollector as he, createFunnelReport as be, createGA4Adapter as xe, createHeapAdapter as Ee, createHttpAdapter as ke, createMixpanelAdapter as Ce, createMultiAdapter as we, createPostHogAdapter as ye, createRudderStackAdapter as Pe, createSegmentAdapter as Le, filterEvents as Re, shouldSample as De, withEventTypes as Me, withSampling as Be } from "./analytics.js";
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
  oe as CSS,
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
  b as blocksToText,
  ne as checkExpression,
  fe as createAmplitudeAdapter,
  x as createAnnouncement,
  E as createBanner,
  k as createChangelog,
  C as createChecklist,
  w as createCookieStorage,
  ve as createDatadogAdapter,
  Ae as createDebugAdapter,
  he as createEventCollector,
  be as createFunnelReport,
  xe as createGA4Adapter,
  Ee as createHeapAdapter,
  y as createHint,
  ke as createHttpAdapter,
  P as createIndexedDBStorage,
  L as createKeyResolver,
  R as createLocaleResolver,
  D as createMemoryStorage,
  Ce as createMixpanelAdapter,
  we as createMultiAdapter,
  ye as createPostHogAdapter,
  M as createRemoteStorage,
  B as createResourceCenter,
  Pe as createRudderStackAdapter,
  Le as createSegmentAdapter,
  H as createSurvey,
  I as createTour,
  i as createTourPlugin,
  F as createTours,
  o as createTutorialLayer,
  l as createVueTour,
  V as currentPath,
  O as defineSpec,
  U as defineStep,
  ce as describeTarget,
  q as escapeHtml,
  se as evaluateExpression,
  ie as evaluateShowIf,
  K as extendSpec,
  Re as filterEvents,
  _ as hasBlockMarkdown,
  j as installTrigger,
  z as interpolate,
  le as isVisible,
  G as localeDirection,
  Q as matchPath,
  Y as normalizeContent,
  $ as onLocationChange,
  ue as queryDeep,
  J as renderBlocks,
  N as renderInline,
  W as renderMarkdown,
  X as resolveLabel,
  de as resolveTarget,
  ge as resolveTargets,
  Z as resolveText,
  pe as safeQuery,
  ee as selectPlural,
  De as shouldSample,
  te as validateSpec,
  re as validateSpecs,
  Se as waitForElement,
  me as waitForTarget,
  Me as withEventTypes,
  Be as withSampling
};
//# sourceMappingURL=vue.js.map
