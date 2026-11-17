var c = Object.defineProperty;
var i = (r, e, t) => e in r ? c(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var a = (r, e, t) => i(r, typeof e != "symbol" ? e + "" : e, t);
import { createTutorialLayer as l } from "./index.js";
import { DEFAULT_LABELS as g, MemoryStorage as S, SurfaceState as f, TourEngine as m, TourOrchestrator as T, TourPersistence as x, assertValidSpec as w, assignAll as A, assignVariant as v, createAnnouncement as C, createBanner as k, createChangelog as b, createChecklist as E, createCookieStorage as V, createHint as B, createIndexedDBStorage as D, createKeyResolver as L, createLocaleResolver as M, createMemoryStorage as R, createRemoteStorage as F, createResourceCenter as H, createSurvey as P, createTour as q, createTours as O, currentPath as I, defineSpec as U, defineStep as $, extendSpec as j, installTrigger as z, interpolate as G, localeDirection as K, matchPath as Q, onLocationChange as _, resolveLabel as J, resolveText as N, selectPlural as W, validateSpec as X, validateSpecs as Y } from "./index.js";
import { C as ee, b as te, c as re, d as ae, e as se, a as ne, f as oe, h as ce, i as ie, n as le, q as ue, r as he, g as pe, j as de, k as ye, l as ge, s as Se, w as fe, m as me } from "./chunks/safeEval.es.js";
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
  ee as CSS,
  g as DEFAULT_LABELS,
  S as MemoryStorage,
  n as OpenTutorialService,
  f as SurfaceState,
  m as TourEngine,
  T as TourOrchestrator,
  x as TourPersistence,
  w as assertValidSpec,
  A as assignAll,
  v as assignVariant,
  te as blocksToText,
  re as checkExpression,
  xe as createAmplitudeAdapter,
  C as createAnnouncement,
  k as createBanner,
  b as createChangelog,
  E as createChecklist,
  V as createCookieStorage,
  we as createDatadogAdapter,
  Ae as createDebugAdapter,
  ve as createEventCollector,
  Ce as createFunnelReport,
  ke as createGA4Adapter,
  be as createHeapAdapter,
  B as createHint,
  Ee as createHttpAdapter,
  D as createIndexedDBStorage,
  L as createKeyResolver,
  M as createLocaleResolver,
  R as createMemoryStorage,
  Ve as createMixpanelAdapter,
  Be as createMultiAdapter,
  De as createPostHogAdapter,
  F as createRemoteStorage,
  H as createResourceCenter,
  Le as createRudderStackAdapter,
  Me as createSegmentAdapter,
  P as createSurvey,
  q as createTour,
  O as createTours,
  l as createTutorialLayer,
  I as currentPath,
  U as defineSpec,
  $ as defineStep,
  ae as describeTarget,
  se as escapeHtml,
  ne as evaluateExpression,
  oe as evaluateShowIf,
  j as extendSpec,
  Re as filterEvents,
  ce as hasBlockMarkdown,
  z as installTrigger,
  G as interpolate,
  ie as isVisible,
  K as localeDirection,
  Q as matchPath,
  le as normalizeContent,
  _ as onLocationChange,
  p as provideOpenTutorial,
  ue as queryDeep,
  he as renderBlocks,
  pe as renderInline,
  de as renderMarkdown,
  J as resolveLabel,
  ye as resolveTarget,
  ge as resolveTargets,
  N as resolveText,
  Se as safeQuery,
  W as selectPlural,
  Fe as shouldSample,
  X as validateSpec,
  Y as validateSpecs,
  fe as waitForElement,
  me as waitForTarget,
  He as withEventTypes,
  Pe as withSampling
};
//# sourceMappingURL=angular.js.map
