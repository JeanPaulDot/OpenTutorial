import { createTutorialLayer as n } from "./index.js";
import { DEFAULT_LABELS as S, MemoryStorage as g, SurfaceState as A, TourEngine as h, TourOrchestrator as m, TourPersistence as T, assertValidSpec as v, assignAll as f, assignVariant as b, blocksToText as y, createAnnouncement as x, createBanner as C, createChangelog as k, createChecklist as w, createCookieStorage as E, createHint as L, createIndexedDBStorage as D, createKeyResolver as M, createLocaleResolver as R, createMemoryStorage as B, createRemoteStorage as H, createResourceCenter as P, createSurvey as F, createTour as I, createTours as V, currentPath as q, defineSpec as O, defineStep as j, escapeHtml as z, extendSpec as G, hasBlockMarkdown as K, installTrigger as Q, interpolate as U, localeDirection as _, matchPath as J, normalizeContent as N, onLocationChange as W, renderBlocks as X, renderInline as Y, renderMarkdown as Z, resolveLabel as $, resolveText as ee, selectPlural as te, validateSpec as re, validateSpecs as ae } from "./index.js";
import { C as ce, c as se, d as ne, e as le, a as ie, i as ue, q as de, r as pe, b as Se, s as ge, w as Ae, f as he } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as Te, createDatadogAdapter as ve, createDebugAdapter as fe, createEventCollector as be, createFunnelReport as ye, createGA4Adapter as xe, createHeapAdapter as Ce, createHttpAdapter as ke, createMixpanelAdapter as we, createMultiAdapter as Ee, createPostHogAdapter as Le, createRudderStackAdapter as De, createSegmentAdapter as Me, filterEvents as Re, shouldSample as Be, withEventTypes as He, withSampling as Pe } from "./analytics.js";
function i(e) {
  const r = /* @__PURE__ */ new Set();
  let a = { activeId: null, state: null };
  const c = n({
    ...e,
    onStateChange: (t, o) => {
      a = { activeId: t, state: o };
      for (const s of r)
        try {
          s(a);
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
  ce as CSS,
  S as DEFAULT_LABELS,
  g as MemoryStorage,
  A as SurfaceState,
  h as TourEngine,
  m as TourOrchestrator,
  T as TourPersistence,
  v as assertValidSpec,
  f as assignAll,
  b as assignVariant,
  y as blocksToText,
  se as checkExpression,
  Te as createAmplitudeAdapter,
  x as createAnnouncement,
  C as createBanner,
  k as createChangelog,
  w as createChecklist,
  E as createCookieStorage,
  ve as createDatadogAdapter,
  fe as createDebugAdapter,
  be as createEventCollector,
  ye as createFunnelReport,
  xe as createGA4Adapter,
  Ce as createHeapAdapter,
  L as createHint,
  ke as createHttpAdapter,
  D as createIndexedDBStorage,
  M as createKeyResolver,
  R as createLocaleResolver,
  B as createMemoryStorage,
  we as createMixpanelAdapter,
  Ee as createMultiAdapter,
  Le as createPostHogAdapter,
  H as createRemoteStorage,
  P as createResourceCenter,
  De as createRudderStackAdapter,
  Me as createSegmentAdapter,
  F as createSurvey,
  I as createTour,
  i as createTourStore,
  V as createTours,
  n as createTutorialLayer,
  q as currentPath,
  O as defineSpec,
  j as defineStep,
  ne as describeTarget,
  z as escapeHtml,
  le as evaluateExpression,
  ie as evaluateShowIf,
  G as extendSpec,
  Re as filterEvents,
  K as hasBlockMarkdown,
  Q as installTrigger,
  U as interpolate,
  ue as isVisible,
  _ as localeDirection,
  J as matchPath,
  N as normalizeContent,
  W as onLocationChange,
  de as queryDeep,
  X as renderBlocks,
  Y as renderInline,
  Z as renderMarkdown,
  $ as resolveLabel,
  pe as resolveTarget,
  Se as resolveTargets,
  ee as resolveText,
  ge as safeQuery,
  te as selectPlural,
  Be as shouldSample,
  u as tourAnchor,
  re as validateSpec,
  ae as validateSpecs,
  Ae as waitForElement,
  he as waitForTarget,
  He as withEventTypes,
  Pe as withSampling
};
//# sourceMappingURL=svelte.js.map
