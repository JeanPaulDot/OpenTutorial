import { createTutorialLayer as s } from "./index.js";
import { DEFAULT_LABELS as g, MemoryStorage as S, SurfaceState as h, TourEngine as A, TourOrchestrator as m, TourPersistence as v, assertValidSpec as T, assignAll as f, assignVariant as w, blocksToText as x, createAnnouncement as y, createBanner as C, createChangelog as E, createChecklist as b, createCookieStorage as k, createHint as L, createIndexedDBStorage as D, createKeyResolver as M, createLocaleResolver as R, createMemoryStorage as B, createRemoteStorage as H, createResourceCenter as P, createSurvey as F, createTour as I, createTours as V, currentPath as q, defineSpec as O, defineStep as j, escapeHtml as z, extendSpec as G, hasBlockMarkdown as K, installTrigger as Q, interpolate as U, localeDirection as _, matchPath as J, normalizeContent as N, onLocationChange as W, renderBlocks as X, renderInline as Y, renderMarkdown as Z, resolveLabel as $, resolveText as ee, selectPlural as te, validateSpec as re, validateSpecs as ae } from "./index.js";
import { C as ce, c as ne, d as se, e as le, a as ie, i as de, q as ue, r as pe, b as ge, s as Se, w as he, f as Ae } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as ve, createDatadogAdapter as Te, createDebugAdapter as fe, createEventCollector as we, createFunnelReport as xe, createGA4Adapter as ye, createHeapAdapter as Ce, createHttpAdapter as Ee, createMixpanelAdapter as be, createMultiAdapter as ke, createPostHogAdapter as Le, createRudderStackAdapter as De, createSegmentAdapter as Me, filterEvents as Re, shouldSample as Be, withEventTypes as He, withSampling as Pe } from "./analytics.js";
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
function d(r, a) {
  const t = a();
  t ? r.setAttribute("data-tour", t) : r.removeAttribute("data-tour");
}
export {
  ce as CSS,
  g as DEFAULT_LABELS,
  S as MemoryStorage,
  h as SurfaceState,
  A as TourEngine,
  m as TourOrchestrator,
  v as TourPersistence,
  T as assertValidSpec,
  f as assignAll,
  w as assignVariant,
  x as blocksToText,
  ne as checkExpression,
  ve as createAmplitudeAdapter,
  y as createAnnouncement,
  C as createBanner,
  E as createChangelog,
  b as createChecklist,
  k as createCookieStorage,
  Te as createDatadogAdapter,
  fe as createDebugAdapter,
  we as createEventCollector,
  xe as createFunnelReport,
  ye as createGA4Adapter,
  Ce as createHeapAdapter,
  L as createHint,
  Ee as createHttpAdapter,
  D as createIndexedDBStorage,
  M as createKeyResolver,
  R as createLocaleResolver,
  B as createMemoryStorage,
  be as createMixpanelAdapter,
  ke as createMultiAdapter,
  Le as createPostHogAdapter,
  H as createRemoteStorage,
  P as createResourceCenter,
  De as createRudderStackAdapter,
  Me as createSegmentAdapter,
  F as createSurvey,
  I as createTour,
  i as createTourLayer,
  V as createTours,
  s as createTutorialLayer,
  q as currentPath,
  O as defineSpec,
  j as defineStep,
  se as describeTarget,
  z as escapeHtml,
  le as evaluateExpression,
  ie as evaluateShowIf,
  G as extendSpec,
  Re as filterEvents,
  K as hasBlockMarkdown,
  Q as installTrigger,
  U as interpolate,
  de as isVisible,
  _ as localeDirection,
  J as matchPath,
  N as normalizeContent,
  W as onLocationChange,
  ue as queryDeep,
  X as renderBlocks,
  Y as renderInline,
  Z as renderMarkdown,
  $ as resolveLabel,
  pe as resolveTarget,
  ge as resolveTargets,
  ee as resolveText,
  Se as safeQuery,
  te as selectPlural,
  Be as shouldSample,
  d as tourAnchor,
  re as validateSpec,
  ae as validateSpecs,
  he as waitForElement,
  Ae as waitForTarget,
  He as withEventTypes,
  Pe as withSampling
};
//# sourceMappingURL=solid.js.map
