var c = Object.defineProperty;
var i = (r, e, t) => e in r ? c(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var a = (r, e, t) => i(r, typeof e != "symbol" ? e + "" : e, t);
import { createTutorialLayer as l } from "./index.js";
import { DEFAULT_LABELS as g, MemoryStorage as S, SurfaceState as f, TourEngine as T, TourOrchestrator as m, TourPersistence as x, assertValidSpec as w, assignAll as A, assignVariant as v, blocksToText as C, createAnnouncement as k, createBanner as b, createChangelog as E, createChecklist as V, createCookieStorage as B, createHint as D, createIndexedDBStorage as L, createKeyResolver as M, createLocaleResolver as R, createMemoryStorage as F, createRemoteStorage as H, createResourceCenter as P, createSurvey as q, createTour as O, createTours as I, currentPath as U, defineSpec as $, defineStep as z, escapeHtml as G, extendSpec as K, hasBlockMarkdown as Q, installTrigger as _, interpolate as j, localeDirection as J, matchPath as N, normalizeContent as W, onLocationChange as X, renderBlocks as Y, renderInline as Z, renderMarkdown as ee, resolveLabel as te, resolveText as re, selectPlural as ae, validateSpec as se, validateSpecs as ne } from "./index.js";
import { C as ce, c as ie, d as le, e as ue, a as he, i as pe, q as de, r as ye, b as ge, s as Se, w as fe, f as Te } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as xe, createDatadogAdapter as we, createDebugAdapter as Ae, createEventCollector as ve, createFunnelReport as Ce, createGA4Adapter as ke, createHeapAdapter as be, createHttpAdapter as Ee, createMixpanelAdapter as Ve, createMultiAdapter as Be, createPostHogAdapter as De, createRudderStackAdapter as Le, createSegmentAdapter as Me, filterEvents as Re, shouldSample as Fe, withEventTypes as He, withSampling as Pe } from "./analytics.js";
class n {
  constructor(e) {
    a(this, "layer");
    a(this, "snapshotValue", { activeId: null, state: null });
    a(this, "watchers", /* @__PURE__ */ new Set());
    this.layer = l({
      ...e,
      onStateChange: (t, s) => {
        this.snapshotValue = { activeId: t, state: s };
        for (const o of this.watchers)
          try {
            o(this.snapshotValue);
          } catch {
          }
        e.onStateChange?.(t, s);
      }
    });
  }
  // --- Delegated tour API -------------------------------------------------
  start(e, t) {
    this.layer.start(e, t);
  }
  request(e, t) {
    return this.layer.request(e, t);
  }
  stop() {
    this.layer.stop();
  }
  pause() {
    this.layer.pause();
  }
  resume() {
    this.layer.resume();
  }
  next() {
    this.layer.next();
  }
  prev() {
    this.layer.prev();
  }
  goTo(e) {
    this.layer.goTo(e);
  }
  hasSeen(e) {
    return this.layer.hasSeen(e);
  }
  whyBlocked(e) {
    return this.layer.whyBlocked(e);
  }
  setContext(e) {
    this.layer.setContext(e);
  }
  setUser(e) {
    return this.layer.setUser(e);
  }
  /** Current active tour and state, for a one-off read. */
  snapshot() {
    return this.snapshotValue;
  }
  /**
   * State as an `Observable`-shaped object.
   *
   * ```ts
   * state = toSignal(this.tours.state$, { initialValue: this.tours.snapshot() });
   * ```
   */
  get state$() {
    return {
      subscribe: (e) => {
        const t = typeof e == "function" ? e : e.next?.bind(e);
        return t && (this.watchers.add(t), t(this.snapshotValue)), {
          unsubscribe: () => {
            t && this.watchers.delete(t);
          }
        };
      }
    };
  }
  /** Every tour event, in the same `Observable` shape. */
  get events$() {
    return {
      subscribe: (e) => {
        const t = typeof e == "function" ? e : e.next?.bind(e);
        return { unsubscribe: t ? this.layer.on("event", t) : () => {
        } };
      }
    };
  }
  /** Angular calls this when the providing injector is destroyed. */
  ngOnDestroy() {
    this.watchers.clear(), this.layer.destroy();
  }
}
function p(r) {
  return {
    provide: n,
    useFactory: () => new n(r)
  };
}
export {
  ce as CSS,
  g as DEFAULT_LABELS,
  S as MemoryStorage,
  n as OpenTutorialService,
  f as SurfaceState,
  T as TourEngine,
  m as TourOrchestrator,
  x as TourPersistence,
  w as assertValidSpec,
  A as assignAll,
  v as assignVariant,
  C as blocksToText,
  ie as checkExpression,
  xe as createAmplitudeAdapter,
  k as createAnnouncement,
  b as createBanner,
  E as createChangelog,
  V as createChecklist,
  B as createCookieStorage,
  we as createDatadogAdapter,
  Ae as createDebugAdapter,
  ve as createEventCollector,
  Ce as createFunnelReport,
  ke as createGA4Adapter,
  be as createHeapAdapter,
  D as createHint,
  Ee as createHttpAdapter,
  L as createIndexedDBStorage,
  M as createKeyResolver,
  R as createLocaleResolver,
  F as createMemoryStorage,
  Ve as createMixpanelAdapter,
  Be as createMultiAdapter,
  De as createPostHogAdapter,
  H as createRemoteStorage,
  P as createResourceCenter,
  Le as createRudderStackAdapter,
  Me as createSegmentAdapter,
  q as createSurvey,
  O as createTour,
  I as createTours,
  l as createTutorialLayer,
  U as currentPath,
  $ as defineSpec,
  z as defineStep,
  le as describeTarget,
  G as escapeHtml,
  ue as evaluateExpression,
  he as evaluateShowIf,
  K as extendSpec,
  Re as filterEvents,
  Q as hasBlockMarkdown,
  _ as installTrigger,
  j as interpolate,
  pe as isVisible,
  J as localeDirection,
  N as matchPath,
  W as normalizeContent,
  X as onLocationChange,
  p as provideOpenTutorial,
  de as queryDeep,
  Y as renderBlocks,
  Z as renderInline,
  ee as renderMarkdown,
  te as resolveLabel,
  ye as resolveTarget,
  ge as resolveTargets,
  re as resolveText,
  Se as safeQuery,
  ae as selectPlural,
  Fe as shouldSample,
  se as validateSpec,
  ne as validateSpecs,
  fe as waitForElement,
  Te as waitForTarget,
  He as withEventTypes,
  Pe as withSampling
};
//# sourceMappingURL=angular.js.map
