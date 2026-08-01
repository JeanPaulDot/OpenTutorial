import { createTutorialLayer as s } from "./index.js";
import { DEFAULT_LABELS as S, MemoryStorage as g, SurfaceState as h, TourEngine as A, TourOrchestrator as m, TourPersistence as v, assertValidSpec as T, blocksToText as f, createAnnouncement as w, createBanner as x, createChangelog as y, createChecklist as C, createCookieStorage as E, createHint as b, createIndexedDBStorage as L, createKeyResolver as k, createLocaleResolver as D, createMemoryStorage as R, createRemoteStorage as H, createResourceCenter as P, createSurvey as B, createTour as F, createTours as M, currentPath as I, defineSpec as q, defineStep as O, escapeHtml as V, extendSpec as j, installTrigger as z, interpolate as G, localeDirection as K, matchPath as Q, normalizeContent as U, onLocationChange as _, renderBlocks as J, renderInline as N, resolveLabel as W, resolveText as X, selectPlural as Y, validateSpec as Z, validateSpecs as $ } from "./index.js";
import { C as te, c as re, d as ae, e as oe, a as ce, i as ne, q as se, r as le, s as ie, w as ue, b as pe } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as Se, createDatadogAdapter as ge, createDebugAdapter as he, createEventCollector as Ae, createFunnelReport as me, createGA4Adapter as ve, createHeapAdapter as Te, createHttpAdapter as fe, createMixpanelAdapter as we, createMultiAdapter as xe, createPostHogAdapter as ye, createRudderStackAdapter as Ce, createSegmentAdapter as Ee, filterEvents as be, shouldSample as Le, withEventTypes as ke, withSampling as De } from "./analytics.js";
function i(r) {
  const a = /* @__PURE__ */ new Set();
  let t = { activeId: null, state: null };
  const o = s({
    ...r,
    onStateChange: (e, c) => {
      t = { activeId: e, state: c };
      for (const n of a)
        try {
          n(t);
        } catch {
        }
      r.onStateChange?.(e, c);
    }
  });
  return Object.assign(o, {
    snapshot: () => t,
    watch(e) {
      return a.add(e), e(t), () => {
        a.delete(e);
      };
    },
    watchEvents(e) {
      return o.on("event", e);
    }
  });
}
function u(r, a) {
  const t = a();
  t ? r.setAttribute("data-tour", t) : r.removeAttribute("data-tour");
}
export {
  te as CSS,
  S as DEFAULT_LABELS,
  g as MemoryStorage,
  h as SurfaceState,
  A as TourEngine,
  m as TourOrchestrator,
  v as TourPersistence,
  T as assertValidSpec,
  f as blocksToText,
  re as checkExpression,
  Se as createAmplitudeAdapter,
  w as createAnnouncement,
  x as createBanner,
  y as createChangelog,
  C as createChecklist,
  E as createCookieStorage,
  ge as createDatadogAdapter,
  he as createDebugAdapter,
  Ae as createEventCollector,
  me as createFunnelReport,
  ve as createGA4Adapter,
  Te as createHeapAdapter,
  b as createHint,
  fe as createHttpAdapter,
  L as createIndexedDBStorage,
  k as createKeyResolver,
  D as createLocaleResolver,
  R as createMemoryStorage,
  we as createMixpanelAdapter,
  xe as createMultiAdapter,
  ye as createPostHogAdapter,
  H as createRemoteStorage,
  P as createResourceCenter,
  Ce as createRudderStackAdapter,
  Ee as createSegmentAdapter,
  B as createSurvey,
  F as createTour,
  i as createTourLayer,
  M as createTours,
  s as createTutorialLayer,
  I as currentPath,
  q as defineSpec,
  O as defineStep,
  ae as describeTarget,
  V as escapeHtml,
  oe as evaluateExpression,
  ce as evaluateShowIf,
  j as extendSpec,
  be as filterEvents,
  z as installTrigger,
  G as interpolate,
  ne as isVisible,
  K as localeDirection,
  Q as matchPath,
  U as normalizeContent,
  _ as onLocationChange,
  se as queryDeep,
  J as renderBlocks,
  N as renderInline,
  W as resolveLabel,
  le as resolveTarget,
  X as resolveText,
  ie as safeQuery,
  Y as selectPlural,
  Le as shouldSample,
  u as tourAnchor,
  Z as validateSpec,
  $ as validateSpecs,
  ue as waitForElement,
  pe as waitForTarget,
  ke as withEventTypes,
  De as withSampling
};
//# sourceMappingURL=solid.js.map
