var u = Object.defineProperty;
var h = (r, s, e) => s in r ? u(r, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[s] = e;
var l = (r, s, e) => h(r, typeof s != "symbol" ? s + "" : s, e);
import { createTutorialLayer as p } from "./index.js";
import { DEFAULT_LABELS as f, MemoryStorage as S, SurfaceState as v, TourEngine as E, TourOrchestrator as C, TourPersistence as T, assertValidSpec as _, blocksToText as k, createAnnouncement as L, createBanner as w, createChangelog as R, createChecklist as D, createCookieStorage as H, createHint as P, createIndexedDBStorage as z, createKeyResolver as B, createLocaleResolver as F, createMemoryStorage as I, createRemoteStorage as M, createResourceCenter as O, createSurvey as q, createTour as V, createTours as J, currentPath as N, defineSpec as j, defineStep as G, escapeHtml as K, extendSpec as Q, installTrigger as U, interpolate as $, localeDirection as W, matchPath as X, normalizeContent as Y, onLocationChange as Z, renderBlocks as ee, renderInline as te, resolveLabel as re, resolveText as se, selectPlural as ae, validateSpec as ie, validateSpecs as ne } from "./index.js";
import { C as le, c as ce, d as ue, e as he, a as pe, i as de, q as me, r as ye, s as ge, w as be, b as Ae } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as fe, createDatadogAdapter as Se, createDebugAdapter as ve, createEventCollector as Ee, createFunnelReport as Ce, createGA4Adapter as Te, createHeapAdapter as _e, createHttpAdapter as ke, createMixpanelAdapter as Le, createMultiAdapter as we, createPostHogAdapter as Re, createRudderStackAdapter as De, createSegmentAdapter as He, filterEvents as Pe, shouldSample as ze, withEventTypes as Be, withSampling as Fe } from "./analytics.js";
const d = [
  "specs",
  "context",
  "theme",
  "locale",
  "dir",
  "z-index",
  "interaction",
  "auto-start",
  "deep-link-param",
  "resume",
  "auto-resume",
  "isolate",
  "allow-html",
  "debug"
];
function o(r, s) {
  if (!r) return s;
  try {
    return JSON.parse(r);
  } catch {
    return s;
  }
}
class m extends HTMLElement {
  constructor() {
    super(...arguments);
    l(this, "layer", null);
    l(this, "_specs", []);
    l(this, "_context", {});
  }
  static get observedAttributes() {
    return d;
  }
  /** Assign specs as a property when they are not serializable into an attribute. */
  set specs(e) {
    this._specs = Array.isArray(e) ? e : [], this.rebuild();
  }
  get specs() {
    return this._specs;
  }
  set context(e) {
    this._context = e ?? {}, this.layer?.setContext(this._context);
  }
  get context() {
    return this._context;
  }
  connectedCallback() {
    this.style.display = "none", this.rebuild();
  }
  disconnectedCallback() {
    this.layer?.destroy(), this.layer = null;
  }
  attributeChangedCallback(e) {
    if (this.isConnected) {
      if (e === "context") {
        this._context = o(this.getAttribute("context"), {}), this.layer?.setContext(this._context);
        return;
      }
      if (e === "locale") {
        const t = this.getAttribute("locale");
        t && this.layer?.setLocale(t);
        return;
      }
      this.rebuild();
    }
  }
  collectSpecs() {
    if (this._specs.length > 0) return this._specs;
    const e = o(this.getAttribute("specs"), null);
    if (e) return Array.isArray(e) ? e : [e];
    const t = [];
    for (const n of Array.from(this.querySelectorAll('script[type="application/json"]'))) {
      const a = o(n.textContent, null);
      a && t.push(...Array.isArray(a) ? a : [a]);
    }
    return t;
  }
  rebuild() {
    if (!this.isConnected) return;
    this.layer?.destroy();
    const e = this.collectSpecs();
    if (e.length === 0) {
      this.layer = null;
      return;
    }
    const t = (i) => this.hasAttribute(i) && this.getAttribute(i) !== "false", n = Number(this.getAttribute("z-index")), a = this.getAttribute("deep-link-param");
    this.layer = p({
      specs: e,
      context: { ...o(this.getAttribute("context"), {}), ...this._context },
      theme: o(this.getAttribute("theme"), void 0),
      locale: this.getAttribute("locale") ?? void 0,
      dir: this.getAttribute("dir") ?? void 0,
      zIndex: Number.isFinite(n) && n > 0 ? n : void 0,
      interaction: this.getAttribute("interaction") ?? void 0,
      deepLinkParam: a === "false" ? !1 : a ?? void 0,
      resume: t("resume"),
      autoResume: t("auto-resume"),
      isolate: t("isolate"),
      allowHtml: t("allow-html"),
      debug: t("debug"),
      // Re-emitted as DOM events so any framework can listen with its own syntax.
      onEvent: (i) => {
        this.dispatchEvent(new CustomEvent("opentutorial", { detail: i, bubbles: !0, composed: !0 })), this.dispatchEvent(new CustomEvent(`ot-${i.type}`, { detail: i, bubbles: !0, composed: !0 }));
      }
    });
    const c = this.getAttribute("auto-start");
    c && this.layer.ready.then(() => this.layer?.request(c));
  }
  // Imperative API, mirroring the vanilla layer.
  start(e, t) {
    this.layer?.start(e, t);
  }
  stop() {
    this.layer?.stop();
  }
  pause() {
    this.layer?.pause();
  }
  resumeTour() {
    this.layer?.resume();
  }
  next() {
    this.layer?.next();
  }
  prev() {
    this.layer?.prev();
  }
  reset() {
    this.layer?.reset();
  }
  getState(e) {
    return this.layer?.getState(e) ?? null;
  }
  getLayer() {
    return this.layer;
  }
}
function y(r = "open-tutorial") {
  typeof customElements > "u" || customElements.get(r) || customElements.define(r, m);
}
y();
export {
  le as CSS,
  f as DEFAULT_LABELS,
  S as MemoryStorage,
  m as OpenTutorialElement,
  v as SurfaceState,
  E as TourEngine,
  C as TourOrchestrator,
  T as TourPersistence,
  _ as assertValidSpec,
  k as blocksToText,
  ce as checkExpression,
  fe as createAmplitudeAdapter,
  L as createAnnouncement,
  w as createBanner,
  R as createChangelog,
  D as createChecklist,
  H as createCookieStorage,
  Se as createDatadogAdapter,
  ve as createDebugAdapter,
  Ee as createEventCollector,
  Ce as createFunnelReport,
  Te as createGA4Adapter,
  _e as createHeapAdapter,
  P as createHint,
  ke as createHttpAdapter,
  z as createIndexedDBStorage,
  B as createKeyResolver,
  F as createLocaleResolver,
  I as createMemoryStorage,
  Le as createMixpanelAdapter,
  we as createMultiAdapter,
  Re as createPostHogAdapter,
  M as createRemoteStorage,
  O as createResourceCenter,
  De as createRudderStackAdapter,
  He as createSegmentAdapter,
  q as createSurvey,
  V as createTour,
  J as createTours,
  p as createTutorialLayer,
  N as currentPath,
  y as defineOpenTutorialElement,
  j as defineSpec,
  G as defineStep,
  ue as describeTarget,
  K as escapeHtml,
  he as evaluateExpression,
  pe as evaluateShowIf,
  Q as extendSpec,
  Pe as filterEvents,
  U as installTrigger,
  $ as interpolate,
  de as isVisible,
  W as localeDirection,
  X as matchPath,
  Y as normalizeContent,
  Z as onLocationChange,
  me as queryDeep,
  ee as renderBlocks,
  te as renderInline,
  re as resolveLabel,
  ye as resolveTarget,
  se as resolveText,
  ge as safeQuery,
  ae as selectPlural,
  ze as shouldSample,
  ie as validateSpec,
  ne as validateSpecs,
  be as waitForElement,
  Ae as waitForTarget,
  Be as withEventTypes,
  Fe as withSampling
};
//# sourceMappingURL=webcomponent.js.map
