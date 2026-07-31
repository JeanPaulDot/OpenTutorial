var u = Object.defineProperty;
var p = (r, s, e) => s in r ? u(r, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[s] = e;
var l = (r, s, e) => p(r, typeof s != "symbol" ? s + "" : s, e);
import { createTutorialLayer as d } from "./index.js";
import { DEFAULT_LABELS as f, MemoryStorage as v, TourEngine as S, TourOrchestrator as E, TourPersistence as T, assertValidSpec as C, blocksToText as _, createCookieStorage as L, createIndexedDBStorage as k, createKeyResolver as w, createLocaleResolver as R, createMemoryStorage as D, createRemoteStorage as H, createTour as z, createTours as F, currentPath as I, defineSpec as M, defineStep as O, escapeHtml as P, extendSpec as q, installTrigger as B, interpolate as V, matchPath as J, normalizeContent as N, onLocationChange as j, renderBlocks as G, renderInline as K, resolveLabel as Q, resolveText as U, validateSpec as $, validateSpecs as W } from "./index.js";
import { C as Y, c as Z, d as ee, e as te, a as re, i as se, q as ae, r as ie, s as oe, w as ne, b as le } from "./chunks/target.es.js";
import { createAmplitudeAdapter as ue, createDatadogAdapter as pe, createDebugAdapter as de, createEventCollector as he, createFunnelReport as me, createGA4Adapter as ye, createHeapAdapter as ge, createHttpAdapter as be, createMixpanelAdapter as Ae, createMultiAdapter as xe, createPostHogAdapter as fe, createRudderStackAdapter as ve, createSegmentAdapter as Se, filterEvents as Ee } from "./analytics.js";
const h = [
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
function n(r, s) {
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
    return h;
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
        this._context = n(this.getAttribute("context"), {}), this.layer?.setContext(this._context);
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
    const e = n(this.getAttribute("specs"), null);
    if (e) return Array.isArray(e) ? e : [e];
    const t = [];
    for (const o of Array.from(this.querySelectorAll('script[type="application/json"]'))) {
      const a = n(o.textContent, null);
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
    const t = (i) => this.hasAttribute(i) && this.getAttribute(i) !== "false", o = Number(this.getAttribute("z-index")), a = this.getAttribute("deep-link-param");
    this.layer = d({
      specs: e,
      context: { ...n(this.getAttribute("context"), {}), ...this._context },
      theme: n(this.getAttribute("theme"), void 0),
      locale: this.getAttribute("locale") ?? void 0,
      dir: this.getAttribute("dir") ?? void 0,
      zIndex: Number.isFinite(o) && o > 0 ? o : void 0,
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
  Y as CSS,
  f as DEFAULT_LABELS,
  v as MemoryStorage,
  m as OpenTutorialElement,
  S as TourEngine,
  E as TourOrchestrator,
  T as TourPersistence,
  C as assertValidSpec,
  _ as blocksToText,
  Z as checkExpression,
  ue as createAmplitudeAdapter,
  L as createCookieStorage,
  pe as createDatadogAdapter,
  de as createDebugAdapter,
  he as createEventCollector,
  me as createFunnelReport,
  ye as createGA4Adapter,
  ge as createHeapAdapter,
  be as createHttpAdapter,
  k as createIndexedDBStorage,
  w as createKeyResolver,
  R as createLocaleResolver,
  D as createMemoryStorage,
  Ae as createMixpanelAdapter,
  xe as createMultiAdapter,
  fe as createPostHogAdapter,
  H as createRemoteStorage,
  ve as createRudderStackAdapter,
  Se as createSegmentAdapter,
  z as createTour,
  F as createTours,
  d as createTutorialLayer,
  I as currentPath,
  y as defineOpenTutorialElement,
  M as defineSpec,
  O as defineStep,
  ee as describeTarget,
  P as escapeHtml,
  te as evaluateExpression,
  re as evaluateShowIf,
  q as extendSpec,
  Ee as filterEvents,
  B as installTrigger,
  V as interpolate,
  se as isVisible,
  J as matchPath,
  N as normalizeContent,
  j as onLocationChange,
  ae as queryDeep,
  G as renderBlocks,
  K as renderInline,
  Q as resolveLabel,
  ie as resolveTarget,
  U as resolveText,
  oe as safeQuery,
  $ as validateSpec,
  W as validateSpecs,
  ne as waitForElement,
  le as waitForTarget
};
//# sourceMappingURL=webcomponent.js.map
