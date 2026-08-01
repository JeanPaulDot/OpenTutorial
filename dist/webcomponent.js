var u = Object.defineProperty;
var h = (r, s, e) => s in r ? u(r, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[s] = e;
var l = (r, s, e) => h(r, typeof s != "symbol" ? s + "" : s, e);
import { createTutorialLayer as d } from "./index.js";
import { DEFAULT_LABELS as x, MemoryStorage as S, SurfaceState as v, TourEngine as E, TourOrchestrator as C, TourPersistence as T, assertValidSpec as k, assignAll as _, assignVariant as w, blocksToText as L, createAnnouncement as R, createBanner as D, createChangelog as H, createChecklist as M, createCookieStorage as B, createHint as P, createIndexedDBStorage as z, createKeyResolver as F, createLocaleResolver as I, createMemoryStorage as O, createRemoteStorage as q, createResourceCenter as V, createSurvey as J, createTour as N, createTours as j, currentPath as G, defineSpec as K, defineStep as Q, escapeHtml as U, extendSpec as $, hasBlockMarkdown as W, installTrigger as X, interpolate as Y, localeDirection as Z, matchPath as ee, normalizeContent as te, onLocationChange as re, renderBlocks as se, renderInline as ae, renderMarkdown as ie, resolveLabel as ne, resolveText as oe, selectPlural as le, validateSpec as ce, validateSpecs as ue } from "./index.js";
import { C as de, c as pe, d as me, e as ge, a as ye, i as Ae, q as be, r as fe, b as xe, s as Se, w as ve, f as Ee } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as Te, createDatadogAdapter as ke, createDebugAdapter as _e, createEventCollector as we, createFunnelReport as Le, createGA4Adapter as Re, createHeapAdapter as De, createHttpAdapter as He, createMixpanelAdapter as Me, createMultiAdapter as Be, createPostHogAdapter as Pe, createRudderStackAdapter as ze, createSegmentAdapter as Fe, filterEvents as Ie, shouldSample as Oe, withEventTypes as qe, withSampling as Ve } from "./analytics.js";
const p = [
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
    return p;
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
    this.layer = d({
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
function g(r = "open-tutorial") {
  typeof customElements > "u" || customElements.get(r) || customElements.define(r, m);
}
g();
export {
  de as CSS,
  x as DEFAULT_LABELS,
  S as MemoryStorage,
  m as OpenTutorialElement,
  v as SurfaceState,
  E as TourEngine,
  C as TourOrchestrator,
  T as TourPersistence,
  k as assertValidSpec,
  _ as assignAll,
  w as assignVariant,
  L as blocksToText,
  pe as checkExpression,
  Te as createAmplitudeAdapter,
  R as createAnnouncement,
  D as createBanner,
  H as createChangelog,
  M as createChecklist,
  B as createCookieStorage,
  ke as createDatadogAdapter,
  _e as createDebugAdapter,
  we as createEventCollector,
  Le as createFunnelReport,
  Re as createGA4Adapter,
  De as createHeapAdapter,
  P as createHint,
  He as createHttpAdapter,
  z as createIndexedDBStorage,
  F as createKeyResolver,
  I as createLocaleResolver,
  O as createMemoryStorage,
  Me as createMixpanelAdapter,
  Be as createMultiAdapter,
  Pe as createPostHogAdapter,
  q as createRemoteStorage,
  V as createResourceCenter,
  ze as createRudderStackAdapter,
  Fe as createSegmentAdapter,
  J as createSurvey,
  N as createTour,
  j as createTours,
  d as createTutorialLayer,
  G as currentPath,
  g as defineOpenTutorialElement,
  K as defineSpec,
  Q as defineStep,
  me as describeTarget,
  U as escapeHtml,
  ge as evaluateExpression,
  ye as evaluateShowIf,
  $ as extendSpec,
  Ie as filterEvents,
  W as hasBlockMarkdown,
  X as installTrigger,
  Y as interpolate,
  Ae as isVisible,
  Z as localeDirection,
  ee as matchPath,
  te as normalizeContent,
  re as onLocationChange,
  be as queryDeep,
  se as renderBlocks,
  ae as renderInline,
  ie as renderMarkdown,
  ne as resolveLabel,
  fe as resolveTarget,
  xe as resolveTargets,
  oe as resolveText,
  Se as safeQuery,
  le as selectPlural,
  Oe as shouldSample,
  ce as validateSpec,
  ue as validateSpecs,
  ve as waitForElement,
  Ee as waitForTarget,
  qe as withEventTypes,
  Ve as withSampling
};
//# sourceMappingURL=webcomponent.js.map
