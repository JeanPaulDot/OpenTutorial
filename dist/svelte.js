import { createTutorialLayer as s } from "./index.js";
import { DEFAULT_LABELS as S, MemoryStorage as g, SurfaceState as A, TourEngine as m, TourOrchestrator as h, TourPersistence as T, assertValidSpec as v, blocksToText as b, createAnnouncement as f, createBanner as y, createChangelog as x, createChecklist as C, createCookieStorage as E, createHint as w, createIndexedDBStorage as L, createKeyResolver as k, createLocaleResolver as D, createMemoryStorage as R, createRemoteStorage as H, createResourceCenter as P, createSurvey as B, createTour as F, createTours as M, currentPath as I, defineSpec as q, defineStep as O, escapeHtml as V, extendSpec as j, installTrigger as z, interpolate as G, localeDirection as K, matchPath as Q, normalizeContent as U, onLocationChange as _, renderBlocks as J, renderInline as N, resolveLabel as W, resolveText as X, selectPlural as Y, validateSpec as Z, validateSpecs as $ } from "./index.js";
import { C as te, c as re, d as ae, e as oe, a as ce, i as ne, q as se, r as le, s as ie, w as ue, b as pe } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as Se, createDatadogAdapter as ge, createDebugAdapter as Ae, createEventCollector as me, createFunnelReport as he, createGA4Adapter as Te, createHeapAdapter as ve, createHttpAdapter as be, createMixpanelAdapter as fe, createMultiAdapter as ye, createPostHogAdapter as xe, createRudderStackAdapter as Ce, createSegmentAdapter as Ee, filterEvents as we, shouldSample as Le, withEventTypes as ke, withSampling as De } from "./analytics.js";
function i(e) {
  const r = /* @__PURE__ */ new Set();
  let a = { activeId: null, state: null };
  const c = s({
    ...e,
    onStateChange: (t, o) => {
      a = { activeId: t, state: o };
      for (const n of r)
        try {
          n(a);
        } catch {
        }
      e.onStateChange?.(t, o);
    }
  });
  return Object.assign(c, {
    subscribe(t) {
      r.add(t);
      try {
        t(a);
      } catch {
      }
      return () => {
        r.delete(t);
      };
    }
  });
}
function u(e, r) {
  return e.setAttribute("data-tour", r), {
    update(a) {
      e.setAttribute("data-tour", a);
    },
    destroy() {
      e.removeAttribute("data-tour");
    }
  };
}
export {
  te as CSS,
  S as DEFAULT_LABELS,
  g as MemoryStorage,
  A as SurfaceState,
  m as TourEngine,
  h as TourOrchestrator,
  T as TourPersistence,
  v as assertValidSpec,
  b as blocksToText,
  re as checkExpression,
  Se as createAmplitudeAdapter,
  f as createAnnouncement,
  y as createBanner,
  x as createChangelog,
  C as createChecklist,
  E as createCookieStorage,
  ge as createDatadogAdapter,
  Ae as createDebugAdapter,
  me as createEventCollector,
  he as createFunnelReport,
  Te as createGA4Adapter,
  ve as createHeapAdapter,
  w as createHint,
  be as createHttpAdapter,
  L as createIndexedDBStorage,
  k as createKeyResolver,
  D as createLocaleResolver,
  R as createMemoryStorage,
  fe as createMixpanelAdapter,
  ye as createMultiAdapter,
  xe as createPostHogAdapter,
  H as createRemoteStorage,
  P as createResourceCenter,
  Ce as createRudderStackAdapter,
  Ee as createSegmentAdapter,
  B as createSurvey,
  F as createTour,
  i as createTourStore,
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
  we as filterEvents,
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
//# sourceMappingURL=svelte.js.map
