var c = Object.defineProperty;
var i = (r, e, t) => e in r ? c(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var a = (r, e, t) => i(r, typeof e != "symbol" ? e + "" : e, t);
import { createTutorialLayer as l } from "./index.js";
import { DEFAULT_LABELS as S, MemoryStorage as g, SurfaceState as f, TourEngine as m, TourOrchestrator as x, TourPersistence as T, assertValidSpec as w, blocksToText as A, createAnnouncement as v, createBanner as C, createChangelog as b, createChecklist as E, createCookieStorage as k, createHint as D, createIndexedDBStorage as L, createKeyResolver as V, createLocaleResolver as B, createMemoryStorage as R, createRemoteStorage as F, createResourceCenter as H, createSurvey as P, createTour as q, createTours as M, currentPath as O, defineSpec as I, defineStep as U, escapeHtml as $, extendSpec as z, installTrigger as G, interpolate as K, localeDirection as Q, matchPath as _, normalizeContent as j, onLocationChange as J, renderBlocks as N, renderInline as W, resolveLabel as X, resolveText as Y, selectPlural as Z, validateSpec as ee, validateSpecs as te } from "./index.js";
import { C as ae, c as se, d as ne, e as oe, a as ce, i as ie, q as le, r as ue, s as he, w as pe, b as de } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as Se, createDatadogAdapter as ge, createDebugAdapter as fe, createEventCollector as me, createFunnelReport as xe, createGA4Adapter as Te, createHeapAdapter as we, createHttpAdapter as Ae, createMixpanelAdapter as ve, createMultiAdapter as Ce, createPostHogAdapter as be, createRudderStackAdapter as Ee, createSegmentAdapter as ke, filterEvents as De, shouldSample as Le, withEventTypes as Ve, withSampling as Be } from "./analytics.js";
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
  ae as CSS,
  S as DEFAULT_LABELS,
  g as MemoryStorage,
  n as OpenTutorialService,
  f as SurfaceState,
  m as TourEngine,
  x as TourOrchestrator,
  T as TourPersistence,
  w as assertValidSpec,
  A as blocksToText,
  se as checkExpression,
  Se as createAmplitudeAdapter,
  v as createAnnouncement,
  C as createBanner,
  b as createChangelog,
  E as createChecklist,
  k as createCookieStorage,
  ge as createDatadogAdapter,
  fe as createDebugAdapter,
  me as createEventCollector,
  xe as createFunnelReport,
  Te as createGA4Adapter,
  we as createHeapAdapter,
  D as createHint,
  Ae as createHttpAdapter,
  L as createIndexedDBStorage,
  V as createKeyResolver,
  B as createLocaleResolver,
  R as createMemoryStorage,
  ve as createMixpanelAdapter,
  Ce as createMultiAdapter,
  be as createPostHogAdapter,
  F as createRemoteStorage,
  H as createResourceCenter,
  Ee as createRudderStackAdapter,
  ke as createSegmentAdapter,
  P as createSurvey,
  q as createTour,
  M as createTours,
  l as createTutorialLayer,
  O as currentPath,
  I as defineSpec,
  U as defineStep,
  ne as describeTarget,
  $ as escapeHtml,
  oe as evaluateExpression,
  ce as evaluateShowIf,
  z as extendSpec,
  De as filterEvents,
  G as installTrigger,
  K as interpolate,
  ie as isVisible,
  Q as localeDirection,
  _ as matchPath,
  j as normalizeContent,
  J as onLocationChange,
  p as provideOpenTutorial,
  le as queryDeep,
  N as renderBlocks,
  W as renderInline,
  X as resolveLabel,
  ue as resolveTarget,
  Y as resolveText,
  he as safeQuery,
  Z as selectPlural,
  Le as shouldSample,
  ee as validateSpec,
  te as validateSpecs,
  pe as waitForElement,
  de as waitForTarget,
  Ve as withEventTypes,
  Be as withSampling
};
//# sourceMappingURL=angular.js.map
