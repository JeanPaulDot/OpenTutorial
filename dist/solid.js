import { createTutorialLayer as s } from "./index.js";
import { DEFAULT_LABELS as g, MemoryStorage as S, SurfaceState as h, TourEngine as A, TourOrchestrator as m, TourPersistence as v, assertValidSpec as T, assignAll as f, assignVariant as w, createAnnouncement as x, createBanner as y, createChangelog as C, createChecklist as k, createCookieStorage as E, createHint as b, createIndexedDBStorage as L, createKeyResolver as D, createLocaleResolver as M, createMemoryStorage as R, createRemoteStorage as B, createResourceCenter as H, createSurvey as P, createTour as F, createTours as I, currentPath as V, defineSpec as j, defineStep as q, extendSpec as O, installTrigger as z, interpolate as G, localeDirection as K, matchPath as Q, onLocationChange as U, resolveLabel as _, resolveText as J, selectPlural as N, validateSpec as W, validateSpecs as X } from "./index.js";
import { C as Z, b as $, c as ee, d as te, e as ae, a as re, f as oe, h as ce, i as ne, n as se, q as le, r as ie, g as de, j as ue, k as pe, l as ge, s as Se, w as he, m as Ae } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as ve, createDatadogAdapter as Te, createDebugAdapter as fe, createEventCollector as we, createFunnelReport as xe, createGA4Adapter as ye, createHeapAdapter as Ce, createHttpAdapter as ke, createMixpanelAdapter as Ee, createMultiAdapter as be, createPostHogAdapter as Le, createRudderStackAdapter as De, createSegmentAdapter as Me, filterEvents as Re, shouldSample as Be, withEventTypes as He, withSampling as Pe } from "./analytics.js";
function i(a) {
  const r = /* @__PURE__ */ new Set();
  let t = { activeId: null, state: null };
  const o = s({
    ...a,
    onStateChange: (e, c) => {
      t = { activeId: e, state: c };
      for (const n of r)
        try {
          n(t);
        } catch {
        }
      a.onStateChange?.(e, c);
    }
  });
  return Object.assign(o, {
    snapshot: () => t,
    watch(e) {
      return r.add(e), e(t), () => {
        r.delete(e);
      };
    },
    watchEvents(e) {
      return o.on("event", e);
    }
  });
}
function d(a, r) {
  const t = r();
  t ? a.setAttribute("data-tour", t) : a.removeAttribute("data-tour");
}
export {
  Z as CSS,
  g as DEFAULT_LABELS,
  S as MemoryStorage,
  h as SurfaceState,
  A as TourEngine,
  m as TourOrchestrator,
  v as TourPersistence,
  T as assertValidSpec,
  f as assignAll,
  w as assignVariant,
  $ as blocksToText,
  ee as checkExpression,
  ve as createAmplitudeAdapter,
  x as createAnnouncement,
  y as createBanner,
  C as createChangelog,
  k as createChecklist,
  E as createCookieStorage,
  Te as createDatadogAdapter,
  fe as createDebugAdapter,
  we as createEventCollector,
  xe as createFunnelReport,
  ye as createGA4Adapter,
  Ce as createHeapAdapter,
  b as createHint,
  ke as createHttpAdapter,
  L as createIndexedDBStorage,
  D as createKeyResolver,
  M as createLocaleResolver,
  R as createMemoryStorage,
  Ee as createMixpanelAdapter,
  be as createMultiAdapter,
  Le as createPostHogAdapter,
  B as createRemoteStorage,
  H as createResourceCenter,
  De as createRudderStackAdapter,
  Me as createSegmentAdapter,
  P as createSurvey,
  F as createTour,
  i as createTourLayer,
  I as createTours,
  s as createTutorialLayer,
  V as currentPath,
  j as defineSpec,
  q as defineStep,
  te as describeTarget,
  ae as escapeHtml,
  re as evaluateExpression,
  oe as evaluateShowIf,
  O as extendSpec,
  Re as filterEvents,
  ce as hasBlockMarkdown,
  z as installTrigger,
  G as interpolate,
  ne as isVisible,
  K as localeDirection,
  Q as matchPath,
  se as normalizeContent,
  U as onLocationChange,
  le as queryDeep,
  ie as renderBlocks,
  de as renderInline,
  ue as renderMarkdown,
  _ as resolveLabel,
  pe as resolveTarget,
  ge as resolveTargets,
  J as resolveText,
  Se as safeQuery,
  N as selectPlural,
  Be as shouldSample,
  d as tourAnchor,
  W as validateSpec,
  X as validateSpecs,
  he as waitForElement,
  Ae as waitForTarget,
  He as withEventTypes,
  Pe as withSampling
};
//# sourceMappingURL=solid.js.map
