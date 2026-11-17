import { createTutorialLayer as n } from "./index.js";
import { DEFAULT_LABELS as g, MemoryStorage as S, SurfaceState as A, TourEngine as h, TourOrchestrator as m, TourPersistence as T, assertValidSpec as v, assignAll as f, assignVariant as b, createAnnouncement as y, createBanner as x, createChangelog as C, createChecklist as k, createCookieStorage as w, createHint as E, createIndexedDBStorage as L, createKeyResolver as D, createLocaleResolver as M, createMemoryStorage as R, createRemoteStorage as B, createResourceCenter as H, createSurvey as P, createTour as F, createTours as I, currentPath as V, defineSpec as j, defineStep as q, extendSpec as O, installTrigger as z, interpolate as G, localeDirection as K, matchPath as Q, onLocationChange as U, resolveLabel as _, resolveText as J, selectPlural as N, validateSpec as W, validateSpecs as X } from "./index.js";
import { C as Z, b as $, c as ee, d as te, e as re, a as ae, f as oe, h as ce, i as se, n as ne, q as le, r as ie, g as ue, j as de, k as pe, l as ge, s as Se, w as Ae, m as he } from "./chunks/safeEval.es.js";
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
  Z as CSS,
  g as DEFAULT_LABELS,
  S as MemoryStorage,
  A as SurfaceState,
  h as TourEngine,
  m as TourOrchestrator,
  T as TourPersistence,
  v as assertValidSpec,
  f as assignAll,
  b as assignVariant,
  $ as blocksToText,
  ee as checkExpression,
  Te as createAmplitudeAdapter,
  y as createAnnouncement,
  x as createBanner,
  C as createChangelog,
  k as createChecklist,
  w as createCookieStorage,
  ve as createDatadogAdapter,
  fe as createDebugAdapter,
  be as createEventCollector,
  ye as createFunnelReport,
  xe as createGA4Adapter,
  Ce as createHeapAdapter,
  E as createHint,
  ke as createHttpAdapter,
  L as createIndexedDBStorage,
  D as createKeyResolver,
  M as createLocaleResolver,
  R as createMemoryStorage,
  we as createMixpanelAdapter,
  Ee as createMultiAdapter,
  Le as createPostHogAdapter,
  B as createRemoteStorage,
  H as createResourceCenter,
  De as createRudderStackAdapter,
  Me as createSegmentAdapter,
  P as createSurvey,
  F as createTour,
  i as createTourStore,
  I as createTours,
  n as createTutorialLayer,
  V as currentPath,
  j as defineSpec,
  q as defineStep,
  te as describeTarget,
  re as escapeHtml,
  ae as evaluateExpression,
  oe as evaluateShowIf,
  O as extendSpec,
  Re as filterEvents,
  ce as hasBlockMarkdown,
  z as installTrigger,
  G as interpolate,
  se as isVisible,
  K as localeDirection,
  Q as matchPath,
  ne as normalizeContent,
  U as onLocationChange,
  le as queryDeep,
  ie as renderBlocks,
  ue as renderInline,
  de as renderMarkdown,
  _ as resolveLabel,
  pe as resolveTarget,
  ge as resolveTargets,
  J as resolveText,
  Se as safeQuery,
  N as selectPlural,
  Be as shouldSample,
  u as tourAnchor,
  W as validateSpec,
  X as validateSpecs,
  Ae as waitForElement,
  he as waitForTarget,
  He as withEventTypes,
  Pe as withSampling
};
//# sourceMappingURL=svelte.js.map
