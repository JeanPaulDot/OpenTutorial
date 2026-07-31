import { createTutorialLayer as n } from "./index.js";
import { DEFAULT_LABELS as S, MemoryStorage as g, TourEngine as A, TourOrchestrator as m, TourPersistence as T, assertValidSpec as b, blocksToText as f, createCookieStorage as v, createIndexedDBStorage as h, createKeyResolver as x, createLocaleResolver as y, createMemoryStorage as C, createRemoteStorage as E, createTour as L, createTours as k, currentPath as w, defineSpec as D, defineStep as R, escapeHtml as F, extendSpec as H, installTrigger as M, interpolate as P, matchPath as B, normalizeContent as I, onLocationChange as q, renderBlocks as O, renderInline as V, resolveLabel as j, resolveText as z, validateSpec as G, validateSpecs as K } from "./index.js";
import { C as U, c as _, d as J, e as N, a as W, i as X, q as Y, r as Z, s as $, w as ee, b as te } from "./chunks/target.es.js";
import { createAmplitudeAdapter as ae, createDatadogAdapter as oe, createDebugAdapter as ce, createEventCollector as se, createFunnelReport as ne, createGA4Adapter as le, createHeapAdapter as ie, createHttpAdapter as ue, createMixpanelAdapter as de, createMultiAdapter as pe, createPostHogAdapter as Se, createRudderStackAdapter as ge, createSegmentAdapter as Ae, filterEvents as me } from "./analytics.js";
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
      return r.add(t), t(a), () => r.delete(t);
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
  U as CSS,
  S as DEFAULT_LABELS,
  g as MemoryStorage,
  A as TourEngine,
  m as TourOrchestrator,
  T as TourPersistence,
  b as assertValidSpec,
  f as blocksToText,
  _ as checkExpression,
  ae as createAmplitudeAdapter,
  v as createCookieStorage,
  oe as createDatadogAdapter,
  ce as createDebugAdapter,
  se as createEventCollector,
  ne as createFunnelReport,
  le as createGA4Adapter,
  ie as createHeapAdapter,
  ue as createHttpAdapter,
  h as createIndexedDBStorage,
  x as createKeyResolver,
  y as createLocaleResolver,
  C as createMemoryStorage,
  de as createMixpanelAdapter,
  pe as createMultiAdapter,
  Se as createPostHogAdapter,
  E as createRemoteStorage,
  ge as createRudderStackAdapter,
  Ae as createSegmentAdapter,
  L as createTour,
  i as createTourStore,
  k as createTours,
  n as createTutorialLayer,
  w as currentPath,
  D as defineSpec,
  R as defineStep,
  J as describeTarget,
  F as escapeHtml,
  N as evaluateExpression,
  W as evaluateShowIf,
  H as extendSpec,
  me as filterEvents,
  M as installTrigger,
  P as interpolate,
  X as isVisible,
  B as matchPath,
  I as normalizeContent,
  q as onLocationChange,
  Y as queryDeep,
  O as renderBlocks,
  V as renderInline,
  j as resolveLabel,
  Z as resolveTarget,
  z as resolveText,
  $ as safeQuery,
  u as tourAnchor,
  G as validateSpec,
  K as validateSpecs,
  ee as waitForElement,
  te as waitForTarget
};
//# sourceMappingURL=svelte.js.map
