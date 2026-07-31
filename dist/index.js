var tt = Object.defineProperty;
var et = (n, t, e) => t in n ? tt(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var h = (n, t, e) => et(n, typeof t != "symbol" ? t + "" : t, e);
import { C as st, c as it, a as T, r as A, b as B, d as nt } from "./chunks/target.es.js";
import { e as ae, i as ce, q as le, s as he, w as ue } from "./chunks/target.es.js";
import { createAmplitudeAdapter as pe, createDatadogAdapter as fe, createDebugAdapter as me, createEventCollector as ge, createFunnelReport as ve, createGA4Adapter as ye, createHeapAdapter as be, createHttpAdapter as we, createMixpanelAdapter as xe, createMultiAdapter as Ee, createPostHogAdapter as ke, createRudderStackAdapter as $e, createSegmentAdapter as Se, filterEvents as Ae } from "./analytics.js";
let D = 0;
class rt {
  constructor(t, e = {}) {
    /** Children mount here — inside the shadow root when isolated. */
    h(this, "root");
    /** The element actually placed in the host document. */
    h(this, "host");
    h(this, "shadow", null);
    h(this, "svg");
    h(this, "dimRect");
    h(this, "hole");
    h(this, "ring");
    h(this, "shield");
    h(this, "panels", []);
    h(this, "current", null);
    h(this, "interaction", "free");
    h(this, "opts");
    D += 1;
    const s = `ot-mask-${D}`;
    if (this.opts = e, this.root = document.createElement("div"), this.root.className = "ot-root", this.root.style.setProperty("--ot-z", String(t)), this.root.setAttribute("data-opentutorial", ""), e.dir && this.root.setAttribute("dir", e.dir), e.isolate) {
      this.host = document.createElement("div"), this.host.setAttribute("data-opentutorial-host", ""), this.host.style.cssText = "position:fixed;inset:0;pointer-events:none;", this.host.style.zIndex = String(t);
      try {
        this.shadow = this.host.attachShadow({ mode: "open" });
        const a = document.createElement("style");
        a.textContent = st, this.shadow.appendChild(a), this.shadow.appendChild(this.root);
      } catch {
        this.shadow = null, this.host = this.root;
      }
    } else
      this.host = this.root;
    const i = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(i, "svg"), this.svg.setAttribute("class", "ot-backdrop"), this.svg.setAttribute("width", "100%"), this.svg.setAttribute("height", "100%"), this.svg.setAttribute("aria-hidden", "true");
    const o = document.createElementNS(i, "defs"), r = document.createElementNS(i, "mask");
    r.setAttribute("id", s);
    const c = document.createElementNS(i, "rect");
    c.setAttribute("x", "0"), c.setAttribute("y", "0"), c.setAttribute("width", "100%"), c.setAttribute("height", "100%"), c.setAttribute("fill", "white"), this.hole = document.createElementNS(i, "rect"), this.hole.setAttribute("fill", "black"), this.hole.setAttribute("rx", "12"), this.setHole({ x: -9999, y: -9999, width: 0, height: 0 }, 0), r.appendChild(c), r.appendChild(this.hole), o.appendChild(r), this.dimRect = document.createElementNS(i, "rect"), this.dimRect.setAttribute("class", "ot-dim"), this.dimRect.setAttribute("x", "0"), this.dimRect.setAttribute("y", "0"), this.dimRect.setAttribute("width", "100%"), this.dimRect.setAttribute("height", "100%"), this.dimRect.setAttribute("mask", `url(#${s})`), this.svg.appendChild(o), this.svg.appendChild(this.dimRect), this.ring = document.createElement("div"), this.ring.className = "ot-ring", this.ring.style.opacity = "0", this.shield = document.createElement("div"), this.shield.className = "ot-shield", this.shield.style.display = "none";
    for (let a = 0; a < 4; a += 1) {
      const l = document.createElement("div");
      l.className = "ot-shield-panel", this.panels.push(l), this.shield.appendChild(l);
    }
    this.root.appendChild(this.svg), this.root.appendChild(this.ring), this.root.appendChild(this.shield), this.svg.style.display = "none";
  }
  setHole(t, e) {
    this.hole.setAttribute("x", String(t.x - e)), this.hole.setAttribute("y", String(t.y - e)), this.hole.setAttribute("width", String(Math.max(0, t.width + e * 2))), this.hole.setAttribute("height", String(Math.max(0, t.height + e * 2)));
  }
  /** Update the cutout + ring. Pass null to clear the spotlight. */
  updateSpotlight(t, e = 8, s = 12) {
    if (this.current = t ? { ...t, padding: e, radius: s } : null, !t) {
      this.setHole({ x: -9999, y: -9999, width: 0, height: 0 }, 0), this.ring.style.opacity = "0", this.svg.style.display = "none", this.applyShield();
      return;
    }
    this.svg.style.display = "", this.setHole(t, e), this.hole.setAttribute("rx", String(s));
    const i = this.ring.style;
    i.opacity = "1", i.left = `${t.x - e}px`, i.top = `${t.y - e}px`, i.width = `${t.width + e * 2}px`, i.height = `${t.height + e * 2}px`, i.borderRadius = `${s}px`, this.applyShield();
  }
  /** Dim the viewport with no cutout — for modal steps that have no target. */
  showBackdrop() {
    this.current = null, this.svg.style.display = "", this.setHole({ x: -9999, y: -9999, width: 0, height: 0 }, 0), this.ring.style.opacity = "0", this.applyShield();
  }
  setInteraction(t) {
    this.interaction = t, this.applyShield();
  }
  /**
   * Position the pointer-blocking panels. `target-only` leaves a rectangular gap
   * over the spotlight; `blocked` covers everything; `free` hides the shield.
   */
  applyShield() {
    if (this.interaction === "free") {
      this.shield.style.display = "none";
      return;
    }
    this.shield.style.display = "";
    const t = window.innerWidth, e = window.innerHeight, s = this.interaction === "target-only" && this.current ? {
      x: this.current.x - this.current.padding,
      y: this.current.y - this.current.padding,
      width: this.current.width + this.current.padding * 2,
      height: this.current.height + this.current.padding * 2
    } : { x: t, y: e, width: 0, height: 0 }, [i, o, r, c] = this.panels, a = (l, u, d, v, x) => {
      l.style.left = `${u}px`, l.style.top = `${d}px`, l.style.width = `${Math.max(0, v)}px`, l.style.height = `${Math.max(0, x)}px`;
    };
    a(i, 0, 0, t, s.y), a(r, 0, s.y + s.height, t, e - (s.y + s.height)), a(c, 0, s.y, s.x, s.height), a(o, s.x + s.width, s.y, t - (s.x + s.width), s.height);
  }
  refresh() {
    this.current ? this.updateSpotlight(this.current, this.current.padding, this.current.radius) : this.applyShield();
  }
  mountPopover(t) {
    this.root.appendChild(t);
  }
  setBackdropColor(t) {
    this.dimRect.style.fill = t;
  }
  setDir(t) {
    this.root.setAttribute("dir", t);
  }
  attach(t) {
    (t ?? this.opts.container ?? document.body).appendChild(this.host);
  }
  destroy() {
    this.host.remove();
  }
}
const ot = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function W(n) {
  return n.replace(/[&<>"']/g, (t) => ot[t] ?? t);
}
const at = /^(https?:\/\/|mailto:)/i;
function P(n) {
  if (typeof n != "string") return "";
  let t = W(n);
  return t = t.replace(
    /\[([^\]]+)\]\(([^\s)]+)\)/g,
    (e, s, i) => at.test(i) ? `<a href="${i}" target="_blank" rel="noopener noreferrer">${s}</a>` : e
  ), t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"), t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>"), t = t.replace(/~~([^~]+)~~/g, "<s>$1</s>"), t = t.replace(/`([^`]+)`/g, "<code>$1</code>"), t = t.replace(/\r?\n/g, "<br>"), t;
}
function ct(n, t) {
  return n && typeof n == "object" && "blocks" in n && Array.isArray(n.blocks) ? n.blocks.map((e) => {
    switch (e.type) {
      case "text":
        return { type: "text", value: t(e.value) };
      case "list":
        return { ...e, items: e.items.map((s) => t(s)) };
      default:
        return e;
    }
  }) : [{ type: "text", value: t(n) }];
}
function lt(n) {
  return n.map((t) => {
    switch (t.type) {
      case "text":
        return typeof t.value == "string" ? t.value : "";
      case "list":
        return t.items.filter((e) => typeof e == "string").join(", ");
      case "code":
        return t.value;
      case "image":
        return t.alt;
      default:
        return "";
    }
  }).filter(Boolean).join(" ");
}
function ht(n, t = {}) {
  const e = t.doc ?? document, s = e.createDocumentFragment();
  for (const i of n)
    switch (i.type) {
      case "text": {
        const o = e.createElement("p");
        o.className = "ot-content", o.innerHTML = P(typeof i.value == "string" ? i.value : ""), s.appendChild(o);
        break;
      }
      case "image": {
        const o = e.createElement("img");
        o.className = "ot-media ot-media-image", o.src = i.src, o.alt = i.alt, o.loading = "lazy", i.width && (o.width = i.width), i.height && (o.height = i.height), s.appendChild(o);
        break;
      }
      case "video": {
        const o = e.createElement("video");
        o.className = "ot-media ot-media-video", o.src = i.src, i.poster && (o.poster = i.poster), o.controls = i.controls ?? !0, o.loop = i.loop ?? !1, o.muted = i.muted ?? i.autoplay ?? !1, o.playsInline = !0, i.autoplay && (o.autoplay = !0, o.muted = !0), s.appendChild(o);
        break;
      }
      case "list": {
        const o = e.createElement(i.ordered ? "ol" : "ul");
        o.className = "ot-list";
        for (const r of i.items) {
          const c = e.createElement("li");
          c.innerHTML = P(typeof r == "string" ? r : ""), o.appendChild(c);
        }
        s.appendChild(o);
        break;
      }
      case "code": {
        const o = e.createElement("pre");
        o.className = "ot-code";
        const r = e.createElement("code");
        i.lang && (r.dataset.lang = i.lang), r.textContent = i.value, o.appendChild(r), s.appendChild(o);
        break;
      }
      case "divider": {
        const o = e.createElement("hr");
        o.className = "ot-divider", s.appendChild(o);
        break;
      }
      case "html": {
        const o = e.createElement("div");
        o.className = "ot-html", o.innerHTML = t.allowHtml ? i.value : W(i.value), s.appendChild(o);
        break;
      }
    }
  return s;
}
const ut = 14, S = 10;
function dt(n) {
  if (n === "auto" || n === "center") return { side: "auto", align: "center" };
  const [t, e] = n.split("-");
  return { side: t, align: e ?? "center" };
}
function pt(n) {
  return { top: "bottom", bottom: "top", left: "right", right: "left" }[n];
}
function ft(n) {
  return n === "left" ? "right" : n === "right" ? "left" : n;
}
class mt {
  constructor(t, e = "ltr") {
    h(this, "el");
    h(this, "titleEl");
    h(this, "contentEl");
    h(this, "progressEl");
    h(this, "liveEl");
    h(this, "backBtn");
    h(this, "nextBtn");
    h(this, "skipBtn");
    h(this, "arrow");
    h(this, "lastSide", null);
    h(this, "cbs");
    h(this, "dir");
    this.cbs = t, this.dir = e, this.el = document.createElement("div"), this.el.className = "ot-popover", this.el.setAttribute("role", "dialog"), this.el.tabIndex = -1, this.arrow = document.createElement("div"), this.arrow.className = "ot-arrow";
    const s = document.createElement("div");
    s.className = "ot-body", this.skipBtn = document.createElement("button"), this.skipBtn.type = "button", this.skipBtn.className = "ot-skip", this.skipBtn.setAttribute("aria-label", "Close tour"), this.skipBtn.innerHTML = "&times;", this.skipBtn.addEventListener("click", () => this.cbs.onSkip()), this.titleEl = document.createElement("h2"), this.titleEl.className = "ot-title", this.titleEl.id = `ot-title-${Math.random().toString(36).slice(2, 8)}`, this.el.setAttribute("aria-labelledby", this.titleEl.id), this.contentEl = document.createElement("div"), this.contentEl.className = "ot-content-wrap", this.progressEl = document.createElement("div"), this.progressEl.className = "ot-dots", this.progressEl.setAttribute("aria-hidden", "true"), this.liveEl = document.createElement("span"), this.liveEl.className = "ot-sr-only", this.liveEl.setAttribute("aria-live", "polite"), this.liveEl.setAttribute("aria-atomic", "true"), this.backBtn = document.createElement("button"), this.backBtn.type = "button", this.backBtn.className = "ot-btn ot-btn-ghost", this.backBtn.addEventListener("click", () => this.cbs.onPrev()), this.nextBtn = document.createElement("button"), this.nextBtn.type = "button", this.nextBtn.className = "ot-btn ot-btn-primary", this.nextBtn.addEventListener("click", () => this.cbs.onNext());
    const i = document.createElement("div");
    i.className = "ot-footer";
    const o = document.createElement("div");
    o.className = "ot-btns", o.appendChild(this.backBtn), o.appendChild(this.nextBtn), i.appendChild(this.progressEl), i.appendChild(o), s.appendChild(this.skipBtn), s.appendChild(this.titleEl), s.appendChild(this.contentEl), s.appendChild(this.liveEl), s.appendChild(i), this.el.appendChild(this.arrow), this.el.appendChild(s);
  }
  setDir(t) {
    this.dir = t;
  }
  render(t) {
    this.titleEl.textContent = t.title, this.contentEl.replaceChildren(
      ht(t.blocks, { allowHtml: t.allowHtml })
    ), this.liveEl.textContent = `${t.title}. Step ${t.index + 1} of ${t.total}`, this.progressEl.replaceChildren();
    for (let s = 0; s < t.total; s += 1) {
      const i = document.createElement("span");
      i.className = `ot-dot${s === t.index ? " ot-dot-active" : ""}`, this.progressEl.appendChild(i);
    }
    const e = t.showBack && t.canGoBack && t.index > 0;
    this.backBtn.style.display = e ? "" : "none", this.backBtn.textContent = t.labels.back, this.nextBtn.style.display = t.showNext ? "" : "none", this.nextBtn.textContent = t.isLast ? t.labels.done : t.labels.next, this.skipBtn.style.display = t.skippable ? "" : "none", this.skipBtn.setAttribute("aria-label", t.labels.skip), this.el.setAttribute("aria-modal", t.modal ? "true" : "false"), this.el.classList.toggle("ot-popover--modal-step", t.modal);
  }
  /** Position relative to a target rect (viewport coords), or centered when null. */
  position(t, e, s) {
    const i = window.innerWidth, o = window.innerHeight, r = this.el.offsetWidth, c = this.el.offsetHeight;
    if (!t || e === "center") {
      this.lastSide = "modal", this.el.classList.add("ot-modal"), this.arrow.style.display = "none", this.el.style.left = `${Math.max(S, (i - r) / 2)}px`, this.el.style.top = `${Math.max(S, (o - c) / 2)}px`;
      return;
    }
    this.el.classList.remove("ot-modal"), this.arrow.style.display = "";
    const a = dt(e), l = this.dir === "rtl" ? ft(a.side) : a.side, u = a.align, d = ut + s, v = {
      top: t.y,
      bottom: o - (t.y + t.height),
      left: t.x,
      right: i - (t.x + t.width)
    };
    let b = l === "auto" ? ["bottom", "right", "top", "left"].reduce((E, k) => v[k] > v[E] ? k : E, "bottom") : l;
    const g = (y) => y === "top" || y === "bottom" ? v[y] >= c + d : v[y] >= r + d;
    if (!g(b)) {
      const y = pt(b);
      g(y) ? b = y : b = Object.keys(v).reduce((E, k) => v[E] >= v[k] ? E : k);
    }
    let m = 0, f = 0;
    const w = (y, E, k) => u === "start" ? this.dir === "rtl" ? y + E - k : y : u === "end" ? this.dir === "rtl" ? y : y + E - k : y + E / 2 - k / 2;
    b === "top" || b === "bottom" ? (m = w(t.x, t.width, r), f = b === "top" ? t.y - c - d : t.y + t.height + d) : (f = w(t.y, t.height, c), m = b === "left" ? t.x - r - d : t.x + t.width + d), m = Math.min(Math.max(m, S), Math.max(S, i - r - S)), f = Math.min(Math.max(f, S), Math.max(S, o - c - S)), this.el.style.left = `${m}px`, this.el.style.top = `${f}px`, this.lastSide = b, this.positionArrow(b, t, m, f, r, c);
  }
  positionArrow(t, e, s, i, o, r) {
    const c = this.arrow.style;
    c.top = "", c.bottom = "", c.left = "", c.right = "", this.arrow.dataset.side = t;
    const a = e.x + e.width / 2, l = e.y + e.height / 2;
    t === "top" ? (c.bottom = "-5px", c.left = `${Math.min(Math.max(a - s, 16), Math.max(16, o - 16))}px`) : t === "bottom" ? (c.top = "-5px", c.left = `${Math.min(Math.max(a - s, 16), Math.max(16, o - 16))}px`) : t === "left" ? (c.right = "-5px", c.top = `${Math.min(Math.max(l - i, 16), Math.max(16, r - 16))}px`) : (c.left = "-5px", c.top = `${Math.min(Math.max(l - i, 16), Math.max(16, r - 16))}px`);
  }
  getSide() {
    return this.lastSide;
  }
  destroy() {
    this.el.remove();
  }
}
class gt {
  constructor() {
    h(this, "el");
    h(this, "beaconEl");
    h(this, "tooltipEl", null);
    h(this, "textEl", null);
    h(this, "dismissBtn", null);
    h(this, "lastRect", null);
    h(this, "hasTooltip", !1);
    /** Held in a field so re-rendering never stacks duplicate listeners. */
    h(this, "onDismiss", null);
    this.el = document.createElement("div"), this.el.className = "ot-hotspot", this.beaconEl = document.createElement("button"), this.beaconEl.type = "button", this.beaconEl.className = "ot-beacon", this.beaconEl.addEventListener("click", () => this.onDismiss?.()), this.el.appendChild(this.beaconEl);
  }
  render(t, e) {
    this.lastRect = e, this.onDismiss = t.onDismiss ?? null, this.beaconEl.className = `ot-beacon ot-beacon--${t.display}`, this.el.style.left = `${e.x + e.width / 2}px`, this.el.style.top = `${e.y + e.height / 2}px`, this.el.style.pointerEvents = "auto";
    const s = t.content?.trim() || "Show me";
    this.beaconEl.setAttribute("aria-label", s), t.display === "beacon" ? (this.hasTooltip = !1, this.tooltipEl && (this.tooltipEl.style.display = "none"), this.beaconEl.title = t.content ?? "") : (this.hasTooltip = !0, this.buildTooltip(t), this.positionTooltip(e));
  }
  buildTooltip(t) {
    this.tooltipEl || (this.tooltipEl = document.createElement("div"), this.tooltipEl.className = "ot-hotspot-tooltip", this.tooltipEl.setAttribute("role", "status"), this.textEl = document.createElement("span"), this.textEl.className = "ot-hotspot-text", this.tooltipEl.appendChild(this.textEl), this.el.appendChild(this.tooltipEl)), this.tooltipEl.style.display = "flex", this.textEl && (this.textEl.innerHTML = P(t.content ?? "")), t.showDismiss || t.display === "hotspot" ? (this.dismissBtn || (this.dismissBtn = document.createElement("button"), this.dismissBtn.type = "button", this.dismissBtn.className = "ot-hotspot-dismiss", this.dismissBtn.textContent = "→", this.dismissBtn.setAttribute("aria-label", "Next step"), this.dismissBtn.addEventListener("click", () => this.onDismiss?.())), this.tooltipEl.appendChild(this.dismissBtn)) : this.dismissBtn?.parentNode && this.dismissBtn.remove();
  }
  positionTooltip(t) {
    if (!this.tooltipEl) return;
    const e = window.innerWidth, s = this.tooltipEl.offsetWidth || 200, i = t.x + t.width / 2, o = e - (i + 16), r = i - 16;
    o > s ? (this.tooltipEl.style.left = "12px", this.tooltipEl.style.right = "auto") : r > s ? (this.tooltipEl.style.right = "12px", this.tooltipEl.style.left = "auto") : (this.tooltipEl.style.left = `${Math.max(8, -(i - 8))}px`, this.tooltipEl.style.right = "auto"), this.tooltipEl.style.top = "16px";
  }
  reposition(t) {
    this.lastRect && (this.lastRect = t, this.el.style.left = `${t.x + t.width / 2}px`, this.el.style.top = `${t.y + t.height / 2}px`, this.hasTooltip && this.positionTooltip(t));
  }
  focus() {
    this.beaconEl.focus({ preventScroll: !0 });
  }
  destroy() {
    this.onDismiss = null, this.el.remove();
  }
}
const vt = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function yt(n) {
  if (!n) return !1;
  if (n.isContentEditable) return !0;
  const t = n.tagName;
  if (t === "TEXTAREA" || t === "SELECT") return !0;
  if (t !== "INPUT") return !1;
  const e = n.type;
  return !["button", "submit", "reset", "checkbox", "radio", "file"].includes(e);
}
function bt(n, t = {}) {
  const e = document.activeElement, s = t.trap !== !1, i = () => Array.from(n.querySelectorAll(vt)).filter((r) => r.getClientRects().length > 0 || r === document.activeElement), o = (r) => {
    const c = n.getRootNode().activeElement ?? document.activeElement;
    if (r.key === "Escape") {
      t.onEscape?.(), r.stopPropagation();
      return;
    }
    if (yt(c)) return;
    if (r.key === "ArrowRight") {
      t.onArrowNext?.(), r.preventDefault();
      return;
    }
    if (r.key === "ArrowLeft") {
      t.onArrowPrev?.(), r.preventDefault();
      return;
    }
    if (r.key === "Enter" && c === n) {
      t.onArrowNext?.(), r.preventDefault();
      return;
    }
    if (r.key !== "Tab" || !s) return;
    const a = i();
    if (!a.length) {
      r.preventDefault();
      return;
    }
    const l = a[0], u = a[a.length - 1];
    r.shiftKey && (c === l || !n.contains(c)) ? (u.focus(), r.preventDefault()) : !r.shiftKey && c === u && (l.focus(), r.preventDefault());
  };
  return n.addEventListener("keydown", o), t.autoFocus !== !1 && n.focus({ preventScroll: !0 }), () => {
    n.removeEventListener("keydown", o);
    const r = document.activeElement;
    (!r || r === document.body || n.contains(r)) && e?.focus?.({ preventScroll: !0 });
  };
}
const R = "opentutorial:locationchange";
let O = !1;
function wt() {
  if (O || typeof history > "u") return;
  O = !0;
  const n = () => {
    try {
      window.dispatchEvent(new Event(R));
    } catch {
    }
  };
  for (const t of ["pushState", "replaceState"]) {
    const e = history[t];
    typeof e == "function" && (history[t] = function(...i) {
      const o = e.apply(this, i);
      return n(), o;
    });
  }
}
function K() {
  return typeof location > "u" ? "" : location.pathname + location.search + location.hash;
}
function Y(n, t, e = !1) {
  if (!n) return !1;
  const s = t.split("#")[0];
  if (n.endsWith("*"))
    return s.startsWith(n.slice(0, -1));
  if (n.includes(":")) {
    const o = n.split("/").map((r) => r.startsWith(":") ? "[^/]+" : r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("/");
    try {
      return new RegExp(`^${o}${e ? "$" : "(/|$|\\?)"}`).test(s);
    } catch {
      return !1;
    }
  }
  const i = s.split("?")[0];
  return e ? i === n : i.startsWith(n);
}
function J(n) {
  return typeof window > "u" ? () => {
  } : (wt(), window.addEventListener("popstate", n), window.addEventListener("hashchange", n), window.addEventListener(R, n), () => {
    window.removeEventListener("popstate", n), window.removeEventListener("hashchange", n), window.removeEventListener(R, n);
  });
}
class C {
  constructor() {
    h(this, "map", /* @__PURE__ */ new Map());
  }
  getItem(t) {
    return this.map.get(t) ?? null;
  }
  setItem(t, e) {
    this.map.set(t, e);
  }
  removeItem(t) {
    this.map.delete(t);
  }
}
function Ut() {
  return new C();
}
function X() {
  try {
    if (typeof localStorage < "u") {
      const n = "__ot_probe__";
      return localStorage.setItem(n, "1"), localStorage.removeItem(n), localStorage;
    }
  } catch {
  }
  return new C();
}
function L() {
  return { v: 2, tours: {}, progress: {} };
}
class xt {
  constructor(t, e = "ot", s) {
    h(this, "ready");
    h(this, "storage");
    h(this, "prefix");
    h(this, "userId");
    h(this, "root", L());
    h(this, "hydrated", !1);
    this.storage = t ?? X(), this.prefix = e, this.userId = s, this.ready = this.hydrate();
  }
  key() {
    return this.userId ? `${this.prefix}:u:${this.userId}` : `${this.prefix}:anon`;
  }
  legacyKey() {
    return `${this.prefix}:tours`;
  }
  /**
   * Switch identity. Progress is per-user, so logging in or out must not carry
   * the previous user's completions over.
   */
  setUser(t) {
    return t === this.userId ? this.ready : (this.userId = t, this.root = L(), this.hydrated = !1, this.hydrate());
  }
  getUser() {
    return this.userId;
  }
  parse(t) {
    if (typeof t != "string" || !t) return null;
    try {
      const e = JSON.parse(t);
      if (!e || typeof e != "object") return null;
      if (e.v === 2)
        return {
          v: 2,
          tours: e.tours ?? {},
          progress: e.progress ?? {},
          active: e.active
        };
      if (e.v === 1)
        return { v: 2, tours: e.tours ?? {}, progress: {} };
    } catch {
    }
    return null;
  }
  async hydrate() {
    try {
      const t = await Promise.resolve(this.storage.getItem(this.key())), e = this.parse(t);
      if (e) {
        this.root = e, this.hydrated = !0;
        return;
      }
      if (!this.userId) {
        const s = this.parse(await Promise.resolve(this.storage.getItem(this.legacyKey())));
        if (s) {
          this.root = s, this.hydrated = !0, this.save();
          try {
            this.storage.removeItem(this.legacyKey());
          } catch {
          }
          return;
        }
      }
    } catch {
    }
    this.hydrated = !0;
  }
  isHydrated() {
    return this.hydrated;
  }
  save() {
    try {
      this.storage.setItem(this.key(), JSON.stringify(this.root));
    } catch {
    }
  }
  mark(t, e, s) {
    const i = this.root.tours[t];
    this.root.tours[t] = {
      status: e,
      version: s,
      at: Date.now(),
      shownCount: i?.shownCount ?? 0,
      lastShownAt: i?.lastShownAt
    }, delete this.root.progress[t], this.root.active?.tourId === t && delete this.root.active, this.save();
  }
  /** Records an impression. Frequency rules read `shownCount` / `lastShownAt`. */
  markShown(t, e) {
    const s = this.root.tours[t];
    this.root.tours[t] = {
      status: s?.status ?? "skipped",
      version: s?.version ?? e,
      at: s?.at ?? 0,
      shownCount: (s?.shownCount ?? 0) + 1,
      lastShownAt: Date.now()
    }, this.save();
  }
  hasSeen(t, e) {
    const s = this.root.tours[t];
    return !(!s || !s.at || e && s.version !== e);
  }
  getStatus(t) {
    const e = this.root.tours[t];
    return !e || !e.at ? null : e.status;
  }
  getRecord(t) {
    return this.root.tours[t] ?? null;
  }
  reset(t) {
    if (!t) {
      this.root = L(), this.save();
      return;
    }
    delete this.root.tours[t], delete this.root.progress[t], this.save();
  }
  clearAllProgress() {
    this.root.progress = {}, this.save();
  }
  saveProgress(t, e, s) {
    this.root.progress[t] = { tourId: t, lastStepId: e, stepIndex: s, timestamp: Date.now() }, this.save();
  }
  getProgress(t) {
    return this.root.progress[t] ?? null;
  }
  getProgressIfValid(t, e) {
    const s = this.getProgress(t);
    return s ? Date.now() - s.timestamp > e ? (this.clearProgress(t), null) : s : null;
  }
  clearProgress(t) {
    t in this.root.progress && (delete this.root.progress[t], this.save());
  }
  /**
   * Remember the in-flight tour so a full page navigation can pick it back up.
   * Distinct from `progress`, which survives across sessions — this is cleared
   * as soon as the tour ends or is deliberately abandoned.
   */
  setActive(t, e) {
    this.root.active = { tourId: t, stepId: e, at: Date.now() }, this.save();
  }
  getActive(t = 300 * 1e3) {
    const e = this.root.active;
    return e ? Date.now() - e.at > t ? (this.clearActive(), null) : e : null;
  }
  clearActive() {
    this.root.active && (delete this.root.active, this.save());
  }
  /** Serialize everything for backup or server sync. */
  exportAll() {
    return JSON.parse(JSON.stringify(this.root));
  }
  /** Replace local state wholesale, or merge newer records in. */
  importAll(t, e = "replace") {
    const s = this.parse(typeof t == "string" ? t : JSON.stringify(t));
    if (!s) return !1;
    if (e === "replace")
      this.root = s;
    else {
      for (const [i, o] of Object.entries(s.tours)) {
        const r = this.root.tours[i];
        (!r || o.at > r.at) && (this.root.tours[i] = o);
      }
      for (const [i, o] of Object.entries(s.progress)) {
        const r = this.root.progress[i];
        (!r || o.timestamp > r.timestamp) && (this.root.progress[i] = o);
      }
    }
    return this.save(), !0;
  }
}
const j = /* @__PURE__ */ new Set([
  "auto",
  "center",
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
  "right",
  "right-start",
  "right-end"
]), H = /* @__PURE__ */ new Set(["spotlight", "hotspot", "beacon", "modal", "banner"]), F = /* @__PURE__ */ new Set([
  "button",
  "target-click",
  "event",
  "auto",
  "input-match",
  "form-submit",
  "element-appears",
  "element-disappears",
  "url-match"
]), z = /* @__PURE__ */ new Set(["manual", "auto", "event", "route", "element", "idle", "scroll"]), Et = /* @__PURE__ */ new Set(["emit", "click", "focus", "navigate", "setContext", "scrollTo", "wait"]), kt = /* @__PURE__ */ new Set(["text", "image", "video", "list", "code", "divider", "html"]), V = /* @__PURE__ */ new Set(["free", "target-only", "blocked"]), $t = /* @__PURE__ */ new Set([
  "specVersion",
  "id",
  "title",
  "description",
  "version",
  "priority",
  "trigger",
  "audience",
  "frequency",
  "onComplete",
  "theme",
  "interaction",
  "steps"
]), St = /* @__PURE__ */ new Set([
  "id",
  "target",
  "placement",
  "display",
  "title",
  "content",
  "buttons",
  "advanceOn",
  "event",
  "duration",
  "match",
  "watch",
  "urlPattern",
  "interaction",
  "skippable",
  "canGoBack",
  "next",
  "showIf",
  "theme",
  "onEnter",
  "onExit"
]), At = /* @__PURE__ */ new Set([
  "selector",
  "text",
  "index",
  "shadow",
  "iframe",
  "waitFor",
  "timeout",
  "visible",
  "scrollIntoView",
  "scrollBehavior",
  "padding"
]), It = /* @__PURE__ */ new Set([
  "accent",
  "bg",
  "fg",
  "muted",
  "border",
  "success",
  "danger",
  "backdrop",
  "radius",
  "shadow",
  "font",
  "fontSize",
  "spacing",
  "arrowSize",
  "overlayBlur",
  "animationMs",
  "z",
  "spotlightRing",
  "popoverWidth"
]), Tt = /^[a-z0-9]+(-[a-z0-9]+)*$/, $ = { title: 60, stepTitle: 80, description: 200, content: 320, steps: 24 }, _ = { steps: 200 };
function p(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
class Ct {
  constructor() {
    h(this, "errors", []);
    h(this, "warnings", []);
  }
  error(t, e) {
    this.errors.push({ path: t, message: e, severity: "error" });
  }
  warn(t, e) {
    this.warnings.push({ path: t, message: e, severity: "warning" });
  }
}
function U(n, t, e) {
  if (n !== void 0) {
    if (!p(n)) {
      e.error(t, "theme must be an object");
      return;
    }
    for (const s of Object.keys(n))
      It.has(s) || e.warn(`${t}.${s}`, `unknown theme token "${s}" (ignored)`);
  }
}
function N(n, t, e) {
  if (n === void 0) return;
  if (typeof n != "string") {
    e.error(t, "must be a string expression");
    return;
  }
  if (n.length > 500) {
    e.error(t, `expression must be ≤ 500 chars (got ${n.length})`);
    return;
  }
  const s = it(n);
  s.ok || e.error(t, `invalid expression: ${s.message}`);
}
function G(n, t, e) {
  if (n !== void 0) {
    if (!Array.isArray(n)) {
      e.error(t, "must be an array of actions");
      return;
    }
    n.forEach((s, i) => {
      const o = `${t}[${i}]`;
      if (!p(s)) {
        e.error(o, "action must be an object");
        return;
      }
      if (!Et.has(s.type)) {
        e.error(`${o}.type`, `unknown action type "${String(s.type)}"`);
        return;
      }
      s.type === "emit" && typeof s.name != "string" && e.error(`${o}.name`, 'emit action requires a string "name"'), s.type === "navigate" && (typeof s.path != "string" || !s.path.startsWith("/")) && e.error(`${o}.path`, 'navigate requires a same-origin "path" starting with /'), s.type === "setContext" && typeof s.key != "string" && e.error(`${o}.key`, 'setContext requires a string "key"'), s.type === "scrollTo" && typeof s.selector != "string" && e.error(`${o}.selector`, 'scrollTo requires a string "selector"'), s.type === "wait" && typeof s.ms != "number" && e.error(`${o}.ms`, 'wait requires a numeric "ms"');
    });
  }
}
function I(n, t, e) {
  if (typeof n == "string") return n.length;
  if (p(n) && typeof n.key == "string") return n.key.length;
  if (p(n) && Array.isArray(n.blocks)) {
    if (n.blocks.length === 0) {
      e.error(t, "blocks must not be empty");
      return;
    }
    let s = 0;
    return n.blocks.forEach((i, o) => {
      const r = `${t}.blocks[${o}]`;
      if (!p(i)) {
        e.error(r, "block must be an object");
        return;
      }
      if (!kt.has(i.type)) {
        e.error(`${r}.type`, `unknown block type "${String(i.type)}"`);
        return;
      }
      switch (i.type) {
        case "text":
          typeof i.value == "string" ? s += i.value.length : (!p(i.value) || typeof i.value.key != "string") && e.error(`${r}.value`, "text block requires a string or i18n object");
          break;
        case "image":
          typeof i.src != "string" && e.error(`${r}.src`, 'image block requires "src"'), typeof i.alt != "string" && e.error(`${r}.alt`, 'image block requires "alt" for accessibility');
          break;
        case "video":
          typeof i.src != "string" && e.error(`${r}.src`, 'video block requires "src"');
          break;
        case "list":
          (!Array.isArray(i.items) || i.items.length === 0) && e.error(`${r}.items`, 'list block requires a non-empty "items" array');
          break;
        case "code":
          typeof i.value != "string" && e.error(`${r}.value`, 'code block requires a string "value"');
          break;
        case "html":
          typeof i.value != "string" ? e.error(`${r}.value`, 'html block requires a string "value"') : e.warn(r, "html blocks render only when the host sets allowHtml: true");
          break;
      }
    }), s;
  }
}
function Lt(n, t) {
  if (n === void 0) return;
  if (!p(n)) {
    t.error("$.trigger", "must be an object");
    return;
  }
  const e = n.type;
  if (!z.has(e)) {
    t.error("$.trigger.type", `must be one of: ${[...z].join(" | ")}`);
    return;
  }
  if (n.delay !== void 0 && (typeof n.delay != "number" || n.delay < 0) && t.error("$.trigger.delay", "must be a non-negative number (ms)"), e === "event" && typeof n.event != "string" && t.error("$.trigger.event", 'required when trigger.type === "event"'), e === "route" && typeof n.path != "string" && t.error("$.trigger.path", 'required when trigger.type === "route"'), e === "element" && typeof n.selector != "string" && t.error("$.trigger.selector", 'required when trigger.type === "element"'), e === "idle" && (typeof n.ms != "number" || n.ms <= 0) && t.error("$.trigger.ms", 'required positive number (ms) when trigger.type === "idle"'), e === "scroll") {
    const s = n.percent;
    (typeof s != "number" || s < 0 || s > 100) && t.error("$.trigger.percent", "must be a number between 0 and 100");
  }
}
function Nt(n, t, e) {
  if (n === void 0) return;
  if (!p(n)) {
    e.error(`${t}.target`, "must be an object");
    return;
  }
  for (const r of Object.keys(n))
    At.has(r) || e.warn(`${t}.target.${r}`, `unknown target key "${r}" (ignored)`);
  const { selector: s, text: i } = n, o = typeof s == "string" && s.trim().length > 0 || Array.isArray(s) && s.length > 0 && s.every((r) => typeof r == "string" && r.trim());
  s !== void 0 && !o && e.error(`${t}.target.selector`, "must be a non-empty CSS selector or array of selectors"), !o && typeof i != "string" && e.error(`${t}.target`, 'requires "selector", "text", or both'), n.timeout !== void 0 && (typeof n.timeout != "number" || n.timeout < 0) && e.error(`${t}.target.timeout`, "must be a non-negative number (ms)"), n.padding !== void 0 && (typeof n.padding != "number" || n.padding < 0) && e.error(`${t}.target.padding`, "must be a non-negative number (px)"), n.index !== void 0 && (typeof n.index != "number" || n.index < 0) && e.error(`${t}.target.index`, "must be a non-negative integer"), n.iframe !== void 0 && typeof n.iframe != "string" && e.error(`${t}.target.iframe`, "must be a CSS selector string"), n.scrollBehavior !== void 0 && !["auto", "smooth"].includes(n.scrollBehavior) && e.error(`${t}.target.scrollBehavior`, 'must be "auto" or "smooth"');
}
function M(n) {
  const t = new Ct();
  if (!p(n))
    return {
      ok: !1,
      errors: [{ path: "$", message: "spec must be a JSON object", severity: "error" }],
      warnings: []
    };
  for (const i of Object.keys(n))
    $t.has(i) || t.warn(`$.${i}`, `unknown top-level key "${i}" (ignored)`);
  n.specVersion !== 1 && t.error("$.specVersion", "must be the integer 1"), typeof n.id != "string" || !n.id ? t.error("$.id", "required, non-empty string") : Tt.test(n.id) || t.error("$.id", 'must be kebab-case (e.g. "dashboard-intro")');
  const e = I(n.title, "$.title", t);
  if (e === void 0 ? t.error("$.title", "required (string or i18n object with key)") : e === 0 ? t.error("$.title", "must not be empty") : e > $.title && t.warn("$.title", `longer than ${$.title} chars (got ${e})`), n.description !== void 0) {
    const i = I(n.description, "$.description", t);
    i === void 0 ? t.error("$.description", "must be a string or i18n object") : i > $.description && t.warn("$.description", `longer than ${$.description} chars (got ${i})`);
  }
  if (n.version !== void 0 && typeof n.version != "string" && t.error("$.version", 'must be a string (e.g. "1.0.0")'), n.priority !== void 0 && typeof n.priority != "number" && t.error("$.priority", "must be a number"), n.interaction !== void 0 && !V.has(n.interaction) && t.error("$.interaction", 'must be "free" | "target-only" | "blocked"'), Lt(n.trigger, t), n.audience !== void 0 && (p(n.audience) ? N(n.audience.showIf, "$.audience.showIf", t) : t.error("$.audience", "must be an object")), n.frequency !== void 0)
    if (!p(n.frequency))
      t.error("$.frequency", "must be an object");
    else
      for (const i of ["max", "cooldown", "perSession"]) {
        const o = n.frequency[i];
        o !== void 0 && (typeof o != "number" || o < 0) && t.error(`$.frequency.${i}`, "must be a non-negative number");
      }
  if (n.onComplete !== void 0)
    if (!p(n.onComplete))
      t.error("$.onComplete", "must be an object");
    else {
      const { startTour: i, emit: o, navigate: r } = n.onComplete;
      i !== void 0 && typeof i != "string" && t.error("$.onComplete.startTour", "must be a tour id string"), o !== void 0 && typeof o != "string" && t.error("$.onComplete.emit", "must be an event name string"), r !== void 0 && (typeof r != "string" || !r.startsWith("/")) && t.error("$.onComplete.navigate", "must be a same-origin path starting with /");
    }
  if (U(n.theme, "$.theme", t), !Array.isArray(n.steps))
    return t.error("$.steps", "required, must be an array"), { ok: !1, errors: t.errors, warnings: t.warnings };
  n.steps.length < 1 && t.error("$.steps", "must contain at least 1 step"), n.steps.length > _.steps ? t.error("$.steps", `must contain ≤ ${_.steps} steps (got ${n.steps.length})`) : n.steps.length > $.steps && t.warn("$.steps", `${n.steps.length} steps is a lot; consider splitting into several tours`);
  const s = /* @__PURE__ */ new Set();
  return n.steps.forEach((i, o) => {
    const r = `$.steps[${o}]`;
    if (!p(i)) {
      t.error(r, "step must be an object");
      return;
    }
    for (const d of Object.keys(i))
      St.has(d) || t.warn(`${r}.${d}`, `unknown step key "${d}" (ignored)`);
    typeof i.id != "string" || !i.id ? t.error(`${r}.id`, "required") : s.has(i.id) ? t.error(`${r}.id`, `duplicate step id "${i.id}"`) : s.add(i.id);
    const c = i.display;
    c !== void 0 && !H.has(c) && t.error(`${r}.display`, `must be one of: ${[...H].join(" | ")}`), Nt(i.target, r, t), i.placement !== void 0 && !j.has(i.placement) && t.error(`${r}.placement`, `must be one of: ${[...j].join(" | ")}`), i.interaction !== void 0 && !V.has(i.interaction) && t.error(`${r}.interaction`, 'must be "free" | "target-only" | "blocked"');
    const a = I(i.title, `${r}.title`, t);
    a === void 0 ? t.error(`${r}.title`, "required (string or i18n object with key)") : a === 0 ? t.error(`${r}.title`, "must not be empty") : a > $.stepTitle && t.warn(`${r}.title`, `longer than ${$.stepTitle} chars (got ${a})`);
    const l = I(i.content, `${r}.content`, t);
    if (l === void 0 ? t.error(`${r}.content`, "required (string, i18n object, or { blocks: [...] })") : l > $.content && t.warn(`${r}.content`, `longer than ${$.content} chars (got ${l}); long copy hurts completion`), i.buttons !== void 0)
      if (!p(i.buttons)) t.error(`${r}.buttons`, "must be an object");
      else
        for (const d of Object.keys(i.buttons))
          ["next", "back", "skip", "done"].includes(d) || t.warn(`${r}.buttons.${d}`, `unknown button "${d}" (ignored)`);
    const u = i.advanceOn ?? "button";
    F.has(u) || t.error(`${r}.advanceOn`, `must be one of: ${[...F].join(" | ")}`), u === "event" && typeof i.event != "string" && t.error(`${r}.event`, 'required when advanceOn === "event"'), u === "auto" && (typeof i.duration != "number" || i.duration <= 0) && t.error(`${r}.duration`, 'required positive number (ms) when advanceOn === "auto"'), u === "target-click" && i.target === void 0 && t.error(`${r}.target`, 'required when advanceOn === "target-click"'), u === "input-match" && (i.target === void 0 && t.error(`${r}.target`, 'required when advanceOn === "input-match"'), typeof i.match != "string" && t.error(`${r}.match`, 'required when advanceOn === "input-match"')), u === "form-submit" && i.target === void 0 && t.error(`${r}.target`, 'required when advanceOn === "form-submit"'), (u === "element-appears" || u === "element-disappears") && typeof i.watch != "string" && t.error(`${r}.watch`, `required when advanceOn === "${u}"`), u === "url-match" && typeof i.urlPattern != "string" && t.error(`${r}.urlPattern`, 'required when advanceOn === "url-match"'), c === "beacon" && i.duration !== void 0 && typeof i.duration != "number" && t.error(`${r}.duration`, "must be a number (ms)"), i.next !== void 0 && (typeof i.next == "string" || (Array.isArray(i.next) ? (i.next.length === 0 && t.warn(`${r}.next`, "empty branch list falls through to the next step"), i.next.forEach((d, v) => {
      const x = `${r}.next[${v}]`;
      if (!p(d)) {
        t.error(x, "branch must be an object { if, to }");
        return;
      }
      N(d.if, `${x}.if`, t), typeof d.to != "string" && t.error(`${x}.to`, "must be a step id string");
    })) : t.error(`${r}.next`, "must be a step id string or an array of { if, to } branches"))), N(i.showIf, `${r}.showIf`, t), U(i.theme, `${r}.theme`, t), G(i.onEnter, `${r}.onEnter`, t), G(i.onExit, `${r}.onExit`, t);
  }), n.steps.forEach((i, o) => {
    if (!p(i)) return;
    const r = `$.steps[${o}].next`;
    typeof i.next == "string" && !s.has(i.next) ? t.error(r, `points to unknown step id "${i.next}"`) : Array.isArray(i.next) && i.next.forEach((c, a) => {
      p(c) && typeof c.to == "string" && !s.has(c.to) && t.error(`${r}[${a}].to`, `points to unknown step id "${c.to}"`);
    });
  }), t.errors.length ? { ok: !1, errors: t.errors, warnings: t.warnings } : { ok: !0, errors: [], warnings: t.warnings };
}
function Gt(n) {
  const t = M(n);
  if (!t.ok) {
    const e = t.errors.map((s) => `  • ${s.path}: ${s.message}`).join(`
`);
    throw new Error(`[opentutorial] Invalid TutorialSpec:
${e}`);
  }
  return n;
}
function Wt(n) {
  const t = [], e = /* @__PURE__ */ new Set();
  return n.forEach((s, i) => {
    const o = p(s) && typeof s.id == "string" ? s.id : void 0, r = M(s);
    for (const c of [...r.errors, ...r.warnings])
      t.push({ ...c, path: `[${i}]${c.path.slice(1)}`, specId: o });
    o && (e.has(o) && t.push({ path: `[${i}].id`, message: `duplicate tour id "${o}"`, severity: "error", specId: o }), e.add(o));
  }), n.forEach((s, i) => {
    if (!p(s) || !p(s.onComplete)) return;
    const o = s.onComplete.startTour;
    typeof o == "string" && !e.has(o) && t.push({
      path: `[${i}].onComplete.startTour`,
      message: `chains to unknown tour "${o}"`,
      severity: "warning",
      specId: typeof s.id == "string" ? s.id : void 0
    });
  }), { ok: !t.some((s) => s.severity === "error"), issues: t };
}
const qt = /\{\{\s*([\w.$]+)\s*\}\}/g;
function Bt(n, t) {
  return t.split(".").reduce(
    (e, s) => e && typeof e == "object" ? e[s] : void 0,
    n
  );
}
function q(n, t) {
  return !t || !n.includes("{{") ? n : n.replace(qt, (e, s) => {
    const i = Bt(t, s);
    return i == null ? e : String(i);
  });
}
function Pt(n, t, e, s) {
  if (typeof n == "string") return q(n, s);
  if (n && typeof n.key == "string") {
    const i = e?.(n.key, t);
    return q(i !== void 0 ? i : n.fallback ?? n.key, s);
  }
  return String(n);
}
function Kt(n) {
  return (t) => n[t];
}
function Yt(n, t = "en") {
  return (e, s) => {
    for (const i of [s, s.split("-")[0], t]) {
      const o = n[i]?.[e];
      if (o !== void 0) return o;
    }
  };
}
const Rt = {
  next: "Next",
  back: "Back",
  done: "Done",
  skip: "Skip tour"
};
function Mt(n, t, e) {
  return e?.(`opentutorial.${n}`, t) ?? Rt[n];
}
const Dt = {
  accent: "--ot-accent",
  bg: "--ot-bg",
  fg: "--ot-fg",
  muted: "--ot-muted",
  border: "--ot-border",
  success: "--ot-success",
  danger: "--ot-danger",
  backdrop: "--ot-backdrop",
  radius: "--ot-radius",
  shadow: "--ot-shadow",
  font: "--ot-font",
  fontSize: "--ot-font-size",
  spacing: "--ot-spacing",
  arrowSize: "--ot-arrow-size",
  overlayBlur: "--ot-overlay-blur",
  animationMs: "--ot-anim-ms",
  z: "--ot-z",
  spotlightRing: "--ot-spotlight-ring",
  popoverWidth: "--ot-popover-width"
}, Ot = /* @__PURE__ */ new Set(["radius", "popoverWidth", "fontSize", "spacing", "arrowSize", "overlayBlur"]), jt = /* @__PURE__ */ new Set(["animationMs"]), Ht = 200;
class Q {
  constructor(t, e = {}) {
    h(this, "spec");
    h(this, "errors", []);
    h(this, "warnings", []);
    h(this, "opts");
    h(this, "persistence");
    h(this, "context");
    h(this, "layer", null);
    h(this, "popover", null);
    h(this, "hotspot", null);
    h(this, "customHost", null);
    h(this, "releaseFocus", null);
    h(this, "cleanupAdvance", null);
    h(this, "cleanupTrack", null);
    h(this, "cleanupRender", null);
    h(this, "appliedVars", []);
    h(this, "status", "idle");
    h(this, "currentId", null);
    h(this, "history", []);
    h(this, "resolved", null);
    h(this, "runToken", 0);
    h(this, "transitions", 0);
    h(this, "stepEnteredAt", 0);
    h(this, "startedAt", 0);
    h(this, "advancing", !1);
    this.spec = t, this.opts = e, this.context = { ...e.context ?? {} }, this.persistence = new xt(
      e.persistence?.storage,
      e.persistence?.keyPrefix ?? "ot",
      e.userId
    );
    const s = M(t);
    if (this.warnings = s.warnings, !s.ok || e.strict && s.warnings.length > 0) {
      this.errors = s.ok ? s.warnings : s.errors;
      const i = this.errors.map((o) => `  • ${o.path}: ${o.message}`).join(`
`);
      e.dev !== !1 && console.error(`[opentutorial] Spec "${t?.id ?? "?"}" failed validation:
${i}`), this.emit("error", { message: `invalid spec: ${this.errors.length} violation(s)` });
    } else if (s.warnings.length > 0 && e.dev) {
      const i = s.warnings.map((o) => `  • ${o.path}: ${o.message}`).join(`
`);
      console.warn(`[opentutorial] Spec "${t.id}" has warnings:
${i}`);
    }
  }
  /** Resolves once persisted state has been read (matters for async storage). */
  get ready() {
    return this.persistence.ready;
  }
  getState() {
    const t = this.visibleSteps(), e = t.findIndex((i) => i.id === this.currentId), s = this.currentStep();
    return {
      status: this.status,
      currentStepId: this.currentId,
      index: Math.max(0, e),
      total: t.length,
      paused: this.status === "paused",
      canGoBack: s?.canGoBack !== !1 && this.history.length > 0,
      canGoNext: this.status === "running"
    };
  }
  isValid() {
    return this.errors.length === 0;
  }
  hasSeen() {
    return this.persistence.hasSeen(this.spec.id, this.spec.version);
  }
  getPersistence() {
    return this.persistence;
  }
  resetSeen() {
    this.persistence.reset(this.spec.id);
  }
  /** Clears seen-state and progress for every tour sharing this storage. */
  resetAll() {
    this.persistence.reset();
  }
  resetProgress() {
    this.persistence.clearProgress(this.spec.id);
  }
  setUser(t) {
    return this.opts = { ...this.opts, userId: t }, this.persistence.setUser(t);
  }
  getContext() {
    return this.context;
  }
  setContext(t) {
    if (Object.assign(this.context, t), this.status === "running") {
      const e = this.currentStep();
      e?.showIf && !T(e.showIf, this.context) && this.next();
    }
  }
  setGlobalTheme(t) {
    this.opts = { ...this.opts, theme: t }, this.layer && this.applyThemeChain(this.currentStep()?.theme);
  }
  setLocale(t) {
    this.opts = { ...this.opts, locale: t }, this.status === "running" && this.rerenderCurrent();
  }
  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------
  async start(t) {
    if (this.status === "destroyed" || this.status === "running" || !this.isValid()) return;
    await this.persistence.ready, this.status = "running", this.history = [], this.transitions = 0, this.startedAt = Date.now();
    const e = t ? void 0 : this.resolveResumeStep(), s = t ?? e ?? this.visibleSteps()[0]?.id;
    if (this.history = [], s) {
      const i = this.visibleSteps(), o = i.findIndex((r) => r.id === s);
      o > 0 && (this.history = i.slice(0, o).map((r) => r.id));
    }
    if (this.buildDom(), this.persistence.markShown(this.spec.id, this.spec.version), this.emit(e ? "resumed" : "started", { stepId: s }), !s) {
      this.complete("empty");
      return;
    }
    await this.goToInternal(s, !1);
  }
  resolveResumeStep() {
    if (this.opts.autoResume) {
      const s = this.persistence.getActive();
      if (s?.tourId === this.spec.id && this.visibleSteps().some((o) => o.id === s.stepId))
        return s.stepId;
    }
    if (!this.opts.resume) return;
    const t = this.opts.progressTtl ?? 1440 * 60 * 1e3, e = this.persistence.getProgressIfValid(this.spec.id, t);
    if (e?.lastStepId && this.visibleSteps().some((s) => s.id === e.lastStepId))
      return e.lastStepId;
  }
  async next() {
    if (this.status !== "running" || this.advancing) return;
    const t = this.currentStep();
    if (!t) return;
    if (this.opts.beforeNext) {
      this.advancing = !0;
      try {
        const s = this.visibleSteps().findIndex((o) => o.id === t.id);
        if (!await this.opts.beforeNext({ tourId: this.spec.id, step: t, index: Math.max(0, s) })) return;
      } catch {
        return;
      } finally {
        this.advancing = !1;
      }
      if (this.status !== "running") return;
    }
    this.emit("step-completed", { stepId: t.id, duration: this.stepDuration() });
    const e = this.resolveNextId(t);
    if (!e) {
      this.complete("end");
      return;
    }
    await this.goToInternal(e, !0);
  }
  resolveNextId(t) {
    if (Array.isArray(t.next)) {
      for (const i of t.next)
        if (i && typeof i.if == "string" && T(i.if, this.context)) return i.to;
    } else if (typeof t.next == "string")
      return t.next;
    const e = this.visibleSteps(), s = e.findIndex((i) => i.id === t.id);
    return s >= 0 ? e[s + 1]?.id : void 0;
  }
  prev() {
    if (this.status !== "running") return;
    const t = this.currentStep();
    if (t && t.canGoBack === !1) return;
    const e = this.history.pop();
    e && (this.emit("back", { stepId: this.currentId ?? void 0 }), this.goToInternal(e, !1));
  }
  goTo(t) {
    this.status === "running" && this.goToInternal(t, !0);
  }
  /** Hide the tour but remember where the user was. `resume()` picks it back up. */
  pause() {
    this.status === "running" && (this.status = "paused", this.emit("paused", { stepId: this.currentId ?? void 0 }), this.teardownDom());
  }
  resume() {
    if (this.status !== "paused") return;
    const t = this.currentId;
    this.status = "running", this.emit("unpaused", { stepId: t ?? void 0 }), this.buildDom(), t ? this.goToInternal(t, !1) : this.start();
  }
  skip(t = "user") {
    this.status !== "running" && this.status !== "paused" || this.finish("skipped", t);
  }
  complete(t = "user") {
    this.status !== "running" && this.status !== "paused" || this.finish("completed", t);
  }
  destroy() {
    this.status = "destroyed", this.teardownDom();
  }
  // -------------------------------------------------------------------------
  // Internals
  // -------------------------------------------------------------------------
  visibleSteps() {
    return this.spec.steps.filter((t) => !t.showIf || T(t.showIf, this.context));
  }
  currentStep() {
    return this.spec.steps.find((t) => t.id === this.currentId) ?? null;
  }
  stepDuration() {
    return this.stepEnteredAt ? Date.now() - this.stepEnteredAt : 0;
  }
  text(t) {
    return Pt(t, this.opts.locale ?? "en", this.opts.i18nResolver, this.context);
  }
  blocks(t) {
    return ct(t, (e) => this.text(e));
  }
  interactionFor(t) {
    return t.interaction ?? this.spec.interaction ?? this.opts.interaction ?? "free";
  }
  buildDom() {
    const t = this.opts.zIndex ?? 9999;
    this.layer = new rt(t, {
      container: this.opts.container,
      isolate: this.opts.isolate,
      dir: this.opts.dir
    }), this.layer.attach(), this.opts.renderStep ? (this.customHost = document.createElement("div"), this.customHost.className = "ot-custom-host", this.layer.mountPopover(this.customHost)) : (this.popover = new mt(
      {
        onNext: () => {
          this.next();
        },
        onPrev: () => this.prev(),
        onSkip: () => this.skip("user")
      },
      this.opts.dir ?? "ltr"
    ), this.layer.mountPopover(this.popover.el)), this.applyThemeChain(void 0);
  }
  teardownDom() {
    this.runToken += 1, this.releaseFocus?.(), this.cleanupAdvance?.(), this.cleanupTrack?.(), this.cleanupRender?.(), this.releaseFocus = null, this.cleanupAdvance = null, this.cleanupTrack = null, this.cleanupRender = null, this.popover?.destroy(), this.hotspot?.destroy(), this.customHost?.remove(), this.layer?.destroy(), this.popover = null, this.hotspot = null, this.customHost = null, this.layer = null, this.resolved = null;
  }
  finish(t, e) {
    const s = this.currentStep();
    s && this.runActions(s.onExit);
    const i = this.startedAt ? Date.now() - this.startedAt : 0;
    this.status = t, this.persistence.mark(this.spec.id, t, this.spec.version), this.persistence.clearActive(), this.emit(t, { stepId: this.currentId ?? void 0, reason: e, duration: i }), this.teardownDom(), t === "completed" && this.runOnComplete();
  }
  runOnComplete() {
    const t = this.spec.onComplete;
    if (t)
      try {
        t.emit && window.dispatchEvent(new CustomEvent(t.emit, { detail: { tourId: this.spec.id } })), t.navigate && this.navigate(t.navigate), t.startTour && window.dispatchEvent(new CustomEvent("opentutorial:chain", {
          detail: { from: this.spec.id, to: t.startTour }
        }));
      } catch {
      }
  }
  async goToInternal(t, e) {
    if (this.status !== "running") return;
    if (this.transitions += 1, this.transitions > Ht) {
      this.emit("error", { message: "transition limit reached (possible next-loop)" }), this.complete("loop-guard");
      return;
    }
    const s = this.spec.steps.find((o) => o.id === t);
    if (!s) {
      this.emit("error", { message: `unknown step "${t}"` });
      return;
    }
    const i = this.currentStep();
    i && (this.runActions(i.onExit), this.emit("step-hidden", { stepId: i.id, duration: this.stepDuration() })), e && this.currentId && this.currentId !== t && this.history.push(this.currentId), await this.showStep(s);
  }
  async showStep(t) {
    if (!this.layer) return;
    const e = ++this.runToken, s = () => this.runToken === e && this.status === "running";
    this.currentId = t.id, this.cleanupAdvance?.(), this.cleanupAdvance = null, this.releaseFocus?.(), this.releaseFocus = null, this.applyThemeChain(t.theme);
    const i = t.display ?? "spotlight", o = this.visibleSteps(), r = Math.max(0, o.findIndex((l) => l.id === t.id));
    let c = null;
    if (t.target) {
      if (c = A(t.target), !c && t.target.waitFor && (this.renderStep(t, r, o.length, "Looking for the interface element…"), c = await B(t.target, t.target.timeout ?? 5e3), !s()))
        return;
      if (!c) {
        const l = nt(t.target);
        this.emit("target-not-found", { stepId: t.id, selector: l, message: `target not found: ${l}` }), this.next();
        return;
      }
    }
    if (!s()) return;
    if (this.resolved = c, c && t.target?.scrollIntoView !== !1) {
      const l = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches, u = t.target?.scrollBehavior ?? (l ? "auto" : "smooth");
      try {
        c.element.scrollIntoView({ block: "center", inline: "center", behavior: u });
      } catch {
      }
    }
    if (this.hotspot?.destroy(), this.hotspot = null, this.layer.updateSpotlight(null), this.layer.setInteraction(this.interactionFor(t)), (i === "hotspot" || i === "beacon") && c)
      this.showIndicator(t, i, c);
    else {
      this.renderStep(t, r, o.length), (i === "modal" || !c) && this.layer.showBackdrop(), requestAnimationFrame(() => requestAnimationFrame(() => {
        s() && this.reposition();
      }));
      const l = this.customHost ?? this.popover?.el;
      if (l) {
        const u = i === "modal" || this.interactionFor(t) !== "free";
        this.releaseFocus = bt(l, {
          trap: u,
          onEscape: () => {
            t.skippable !== !1 && this.skip("escape");
          },
          onArrowNext: () => {
            this.next();
          },
          onArrowPrev: () => this.prev()
        });
      }
    }
    this.wireAdvance(t, c?.element ?? null), this.startTracking(), this.stepEnteredAt = Date.now(), this.persistence.saveProgress(this.spec.id, t.id, r), this.opts.autoResume && this.persistence.setActive(this.spec.id, t.id), this.runActions(t.onEnter), this.emit("step-shown", { stepId: t.id, index: r, total: o.length });
  }
  showIndicator(t, e, s) {
    if (!this.layer) return;
    const i = this.viewportRect(s);
    if (this.popover && (this.popover.el.style.display = "none"), this.customHost && (this.customHost.style.display = "none"), this.hotspot = new gt(), this.hotspot.render({
      display: e,
      content: lt(this.blocks(t.content)),
      showDismiss: e === "hotspot" || t.advanceOn === "button",
      onDismiss: () => {
        this.next();
      }
    }, i), this.layer.root.appendChild(this.hotspot.el), e === "beacon") {
      const o = window.setTimeout(() => {
        this.next();
      }, t.duration ?? 5e3);
      this.cleanupAdvance = () => window.clearTimeout(o);
    }
  }
  renderStep(t, e, s, i) {
    const o = i ? [{ type: "text", value: i }] : this.blocks(t.content);
    if (this.opts.renderStep && this.customHost) {
      this.cleanupRender?.();
      const r = {
        tourId: this.spec.id,
        step: t,
        index: e,
        total: s,
        title: this.text(t.title),
        blocks: o,
        canGoBack: t.canGoBack !== !1 && this.history.length > 0,
        canSkip: t.skippable !== !1,
        isLast: !t.next && e >= s - 1,
        next: () => {
          this.next();
        },
        prev: () => this.prev(),
        skip: () => this.skip("user"),
        goTo: (a) => this.goTo(a)
      }, c = this.opts.renderStep(r, this.customHost);
      this.cleanupRender = typeof c == "function" ? c : null, this.customHost.style.display = "";
      return;
    }
    this.popover && (this.popover.el.style.display = "", this.popover.render(this.makeModel(t, e, s, o)));
  }
  rerenderCurrent() {
    const t = this.currentStep();
    if (!t) return;
    const e = this.visibleSteps(), s = Math.max(0, e.findIndex((i) => i.id === t.id));
    this.renderStep(t, s, e.length), this.reposition();
  }
  makeModel(t, e, s, i) {
    const o = this.opts.locale ?? "en", r = this.opts.i18nResolver, c = (u, d) => d === !1 || d === void 0 ? Mt(u, o, r) : this.text(d), a = t.buttons ?? {}, l = t.advanceOn ?? "button";
    return {
      stepId: t.id,
      title: this.text(t.title),
      blocks: i,
      index: e,
      total: s,
      canGoBack: t.canGoBack !== !1 && this.history.length > 0,
      skippable: t.skippable !== !1 && a.skip !== !1,
      isLast: !t.next && e >= s - 1,
      advanceOn: l,
      labels: {
        next: c("next", a.next),
        back: c("back", a.back),
        done: c("done", a.done),
        skip: c("skip", a.skip)
      },
      // With a non-button advance condition the primary button would be a
      // "skip this step" escape hatch; hide it unless the author asked for one.
      showNext: a.next !== !1 && (l === "button" || e >= s - 1),
      showBack: a.back !== !1,
      modal: (t.display ?? "spotlight") === "modal" || this.interactionFor(t) === "blocked",
      allowHtml: this.opts.allowHtml
    };
  }
  /** Element rect mapped into the top-level viewport (adds the iframe offset). */
  viewportRect(t) {
    const e = t.element.getBoundingClientRect();
    return {
      x: e.x + t.frameOffset.x,
      y: e.y + t.frameOffset.y,
      width: e.width,
      height: e.height
    };
  }
  reposition() {
    if (!this.layer || this.status !== "running") return;
    const t = this.currentStep();
    if (!t) return;
    const e = t.target?.padding ?? 8, s = !!this.popover && !this.opts.renderStep;
    if (this.resolved) {
      if (!this.resolved.doc.contains(this.resolved.element) && t.target) {
        const o = A(t.target);
        o && (this.resolved = o);
      }
      const i = this.viewportRect(this.resolved);
      this.hotspot ? (this.hotspot.reposition(i), this.layer.setInteraction(this.interactionFor(t))) : (this.layer.updateSpotlight(i, e, this.mergedRadius()), s && this.popover?.position(i, t.placement ?? "auto", e));
    } else
      this.layer.showBackdrop(), s && this.popover?.position(null, "center", 0);
  }
  mergedRadius() {
    return ({ ...this.opts.theme, ...this.spec.theme, ...this.currentStep()?.theme }.radius ?? 14) + 2;
  }
  startTracking() {
    this.cleanupTrack?.();
    let t = 0, e = !1;
    const s = () => {
      e || (e = !0, t = requestAnimationFrame(() => {
        e = !1, this.reposition();
      }));
    }, i = new ResizeObserver(s);
    if (this.resolved)
      try {
        i.observe(this.resolved.element);
      } catch {
      }
    i.observe(document.documentElement), window.addEventListener("resize", s), window.addEventListener("scroll", s, !0);
    const o = performance.now() + 900, r = () => {
      this.status === "running" && (this.reposition(), performance.now() < o && requestAnimationFrame(r));
    };
    requestAnimationFrame(r), this.cleanupTrack = () => {
      i.disconnect(), window.removeEventListener("resize", s), window.removeEventListener("scroll", s, !0), cancelAnimationFrame(t);
    };
  }
  // -------------------------------------------------------------------------
  // Advance conditions
  // -------------------------------------------------------------------------
  wireAdvance(t, e) {
    const s = t.advanceOn ?? "button", i = () => {
      this.next();
    };
    switch (s) {
      case "target-click": {
        if (!e) return;
        const o = () => i();
        e.addEventListener("click", o, { once: !0 }), this.cleanupAdvance = () => e.removeEventListener("click", o);
        return;
      }
      case "event": {
        if (typeof t.event != "string") return;
        const o = t.event, r = () => i();
        window.addEventListener(o, r, { once: !0 }), this.cleanupAdvance = () => window.removeEventListener(o, r);
        return;
      }
      case "auto": {
        const o = window.setTimeout(i, t.duration ?? 3e3);
        this.cleanupAdvance = () => window.clearTimeout(o);
        return;
      }
      case "input-match": {
        if (!e || typeof t.match != "string") return;
        const o = t.match, r = (a) => {
          if (o.startsWith("/") && o.lastIndexOf("/") > 0) {
            const l = o.lastIndexOf("/");
            try {
              return new RegExp(o.slice(1, l), o.slice(l + 1)).test(a);
            } catch {
              return !1;
            }
          }
          return a === o;
        }, c = () => {
          const a = e.value ?? "";
          r(a) && i();
        };
        e.addEventListener("input", c), e.addEventListener("change", c), this.cleanupAdvance = () => {
          e.removeEventListener("input", c), e.removeEventListener("change", c);
        };
        return;
      }
      case "form-submit": {
        if (!e) return;
        const o = e.closest?.("form") ?? (e.tagName === "FORM" ? e : null);
        if (!o) return;
        const r = () => i();
        o.addEventListener("submit", r, { once: !0 }), this.cleanupAdvance = () => o.removeEventListener("submit", r);
        return;
      }
      case "element-appears": {
        if (typeof t.watch != "string") return;
        let o = !1;
        B({ selector: t.watch, visible: !0 }, t.duration ?? 6e4).then((r) => {
          r && !o && i();
        }), this.cleanupAdvance = () => {
          o = !0;
        };
        return;
      }
      case "element-disappears": {
        if (typeof t.watch != "string") return;
        const o = t.watch, r = window.setInterval(() => {
          A({ selector: o, visible: !0 }) || (window.clearInterval(r), i());
        }, 150);
        this.cleanupAdvance = () => window.clearInterval(r);
        return;
      }
      case "url-match": {
        if (typeof t.urlPattern != "string") return;
        const o = t.urlPattern, r = () => {
          Y(o, K()) && i();
        }, c = J(r);
        this.cleanupAdvance = c, r();
        return;
      }
    }
  }
  // -------------------------------------------------------------------------
  // Actions, theme, events
  // -------------------------------------------------------------------------
  navigate(t) {
    if (t.startsWith("/")) {
      if (this.opts.onNavigate) {
        this.opts.onNavigate(t);
        return;
      }
      window.location.assign(t);
    }
  }
  runActions(t) {
    if (!t) return;
    const e = this.resolved?.element;
    for (const s of t)
      try {
        switch (s.type) {
          case "emit":
            window.dispatchEvent(new CustomEvent(s.name, { detail: s.detail }));
            break;
          case "click":
            e?.click?.();
            break;
          case "focus":
            e?.focus?.();
            break;
          case "navigate":
            this.opts.autoResume && this.currentId && this.persistence.setActive(this.spec.id, this.currentId), this.navigate(s.path);
            break;
          case "setContext":
            this.context[s.key] = s.value;
            break;
          case "scrollTo": {
            A({ selector: s.selector })?.element.scrollIntoView({ block: "center", behavior: "smooth" });
            break;
          }
          case "wait":
            break;
        }
      } catch {
      }
  }
  applyThemeChain(t) {
    if (!this.layer) return;
    const e = this.layer.root.style;
    for (const i of this.appliedVars) e.removeProperty(i);
    this.appliedVars = [];
    const s = { ...this.opts.theme, ...this.spec.theme, ...t };
    for (const [i, o] of Object.entries(s)) {
      if (o === void 0) continue;
      const r = Dt[i];
      if (!r) continue;
      const c = Ot.has(i) ? `${o}px` : jt.has(i) ? `${o}ms` : String(o);
      e.setProperty(r, c), this.appliedVars.push(r);
    }
    s.z !== void 0 && (this.layer.root.style.zIndex = String(s.z));
  }
  emit(t, e = {}) {
    const s = {
      type: t,
      tourId: this.spec?.id ?? "unknown",
      timestamp: Date.now(),
      ...e
    }, i = Object.freeze({ ...s });
    try {
      this.opts.onEvent?.(i);
    } catch {
    }
    try {
      window.dispatchEvent(new CustomEvent("opentutorial", { detail: i }));
    } catch {
    }
  }
}
function Ft(n, t) {
  if (!n || n.type === "manual") return { dispose: () => {
  } };
  const e = n.delay ?? 0, s = [], i = [];
  let o = !1;
  const r = n.once ?? !0, c = () => {
    o || (r && (o = !0), e > 0 ? s.push(window.setTimeout(t, e)) : t());
  };
  switch (n.type) {
    case "auto": {
      c();
      break;
    }
    case "event": {
      const a = () => c();
      window.addEventListener(n.event, a), i.push(() => window.removeEventListener(n.event, a));
      break;
    }
    case "route": {
      const a = () => {
        Y(n.path, K(), n.exact) ? c() : r || (o = !1);
      };
      i.push(J(a)), a();
      break;
    }
    case "element": {
      let a = !1;
      B({ selector: n.selector, visible: !0 }, n.timeout ?? 3e4).then((l) => {
        l && !a && c();
      }), i.push(() => {
        a = !0;
      });
      break;
    }
    case "idle": {
      let a = 0;
      const l = () => {
        window.clearTimeout(a), !o && (a = window.setTimeout(c, n.ms));
      }, u = ["pointerdown", "keydown", "scroll", "pointermove"];
      for (const d of u)
        window.addEventListener(d, l, { passive: !0 }), i.push(() => window.removeEventListener(d, l));
      i.push(() => window.clearTimeout(a)), l();
      break;
    }
    case "scroll": {
      const a = () => {
        const l = document.documentElement, u = l.scrollHeight - l.clientHeight;
        if (u <= 0) return;
        l.scrollTop / u * 100 >= n.percent && c();
      };
      window.addEventListener("scroll", a, { passive: !0 }), i.push(() => window.removeEventListener("scroll", a)), a();
      break;
    }
  }
  return {
    dispose: () => {
      s.forEach((a) => window.clearTimeout(a)), i.forEach((a) => {
        try {
          a();
        } catch {
        }
      });
    }
  };
}
class Z {
  constructor(t, e = {}) {
    h(this, "engines", /* @__PURE__ */ new Map());
    h(this, "specs");
    h(this, "opts");
    h(this, "triggers", []);
    h(this, "disposers", []);
    h(this, "queue", []);
    h(this, "activeId", null);
    h(this, "mounted", !1);
    /** Impressions in this page session, for `frequency.perSession`. */
    h(this, "sessionCounts", /* @__PURE__ */ new Map());
    this.specs = t, this.opts = e;
    for (const s of t)
      this.engines.set(s.id, new Q(s, {
        ...e,
        onEvent: (i) => this.handleEvent(i)
      }));
  }
  get ready() {
    return Promise.all([...this.engines.values()].map((t) => t.ready)).then(() => {
    });
  }
  getEngine(t) {
    return this.engines.get(t);
  }
  getEngines() {
    return [...this.engines.values()];
  }
  getSpecs() {
    return this.specs;
  }
  getActiveId() {
    return this.activeId;
  }
  getState(t) {
    const e = t ?? this.activeId;
    return e ? this.engines.get(e)?.getState() ?? null : null;
  }
  hasSeen(t) {
    return this.engines.get(t)?.hasSeen() ?? !1;
  }
  // -------------------------------------------------------------------------
  // Eligibility
  // -------------------------------------------------------------------------
  /** Why a tour may not start right now, or null if it may. */
  checkEligibility(t) {
    const e = this.engines.get(t);
    if (!e) return "unknown tour";
    if (!e.isValid()) return "spec failed validation";
    const s = e.spec, i = e.getContext();
    if (s.audience?.showIf && !T(s.audience.showIf, i))
      return "audience rule did not match";
    const o = s.frequency;
    if (o) {
      const r = e.getPersistence().getRecord(s.id);
      if (o.max !== void 0 && (r?.shownCount ?? 0) >= o.max)
        return `frequency: already shown ${o.max} time(s)`;
      if (o.cooldown !== void 0 && r?.lastShownAt) {
        const c = Date.now() - r.lastShownAt;
        if (c < o.cooldown) return `frequency: cooldown active (${o.cooldown - c}ms left)`;
      }
      if (o.perSession !== void 0 && (this.sessionCounts.get(s.id) ?? 0) >= o.perSession)
        return `frequency: session limit of ${o.perSession} reached`;
    }
    return null;
  }
  // -------------------------------------------------------------------------
  // Starting
  // -------------------------------------------------------------------------
  /**
   * Ask for a tour to run. Starts it when the stage is free and the rules pass,
   * otherwise queues it. Returns true when it started immediately.
   */
  request(t, e, s = {}) {
    const i = this.engines.get(t);
    if (!i || !s.force && this.checkEligibility(t))
      return !1;
    if (this.activeId && this.activeId !== t)
      if (s.force)
        this.engines.get(this.activeId)?.skip("preempted");
      else return s.queue !== !1 && this.enqueue(t, e, i.spec.priority ?? 0), !1;
    return this.sessionCounts.set(t, (this.sessionCounts.get(t) ?? 0) + 1), i.start(e), !0;
  }
  /** Start a tour immediately, preempting whatever is running. */
  start(t, e) {
    this.request(t, e, { force: !0 });
  }
  enqueue(t, e, s) {
    this.queue.some((i) => i.tourId === t) || (this.queue.push({ tourId: t, stepId: e, priority: s }), this.queue.sort((i, o) => o.priority - i.priority));
  }
  drain() {
    for (; this.queue.length > 0; ) {
      const t = this.queue.shift();
      if (!t || this.request(t.tourId, t.stepId, { queue: !1 })) return;
    }
  }
  stop(t = "api") {
    for (const e of this.engines.values()) {
      const s = e.getState().status;
      (s === "running" || s === "paused") && e.skip(t);
    }
    this.queue = [];
  }
  pause() {
    this.activeId && this.engines.get(this.activeId)?.pause();
  }
  resume() {
    this.activeId && this.engines.get(this.activeId)?.resume();
  }
  // -------------------------------------------------------------------------
  // Shared state
  // -------------------------------------------------------------------------
  setContext(t) {
    this.engines.forEach((e) => e.setContext(t));
  }
  setTheme(t) {
    this.engines.forEach((e) => e.setGlobalTheme(t));
  }
  setLocale(t) {
    this.opts = { ...this.opts, locale: t }, this.engines.forEach((e) => e.setLocale(t));
  }
  async setUser(t) {
    this.sessionCounts.clear(), await Promise.all([...this.engines.values()].map((e) => e.setUser(t)));
  }
  /** Clear seen-state and progress for every tour. */
  reset() {
    this.sessionCounts.clear(), this.engines.values().next().value?.resetAll();
  }
  resetProgress() {
    this.engines.forEach((t) => t.resetProgress());
  }
  resetTour(t) {
    this.sessionCounts.delete(t), this.engines.get(t)?.resetSeen();
  }
  // -------------------------------------------------------------------------
  // Mounting
  // -------------------------------------------------------------------------
  /** Install triggers, deep-link handling, chaining and cross-page resume. */
  mount() {
    this.mounted || (this.mounted = !0, this.ready.then(() => {
      this.mounted && (this.installChainListener(), this.installDeepLink(), this.installAutoResume(), this.installTriggers());
    }));
  }
  installTriggers() {
    for (const t of this.specs) {
      const e = this.engines.get(t.id);
      if (!e || !e.isValid()) continue;
      const s = t.trigger;
      !s || s.type === "manual" || (s.once ?? !0) && e.hasSeen() || this.triggers.push(Ft(s, () => {
        (s.once ?? !0) && e.hasSeen() || this.request(t.id);
      }));
    }
  }
  installDeepLink() {
    const t = this.opts.deepLinkParam ?? "tour";
    if (t !== !1)
      try {
        const e = new URLSearchParams(window.location.search), s = e.get(t);
        if (!s || !this.engines.has(s)) return;
        const i = e.get(`${t}Step`) ?? void 0, o = window.setTimeout(() => this.request(s, i, { force: !0 }), 400);
        this.disposers.push(() => window.clearTimeout(o));
      } catch {
      }
  }
  installAutoResume() {
    if (!this.opts.autoResume) return;
    const t = this.engines.values().next().value;
    if (!t) return;
    const e = t.getPersistence().getActive();
    if (!e || !this.engines.has(e.tourId)) return;
    const s = window.setTimeout(() => this.request(e.tourId, e.stepId, { force: !0 }), 200);
    this.disposers.push(() => window.clearTimeout(s));
  }
  installChainListener() {
    const t = (e) => {
      const s = e.detail;
      !s?.to || !this.engines.has(s.to) || window.setTimeout(() => this.request(s.to, void 0, { force: !0 }), 0);
    };
    window.addEventListener("opentutorial:chain", t), this.disposers.push(() => window.removeEventListener("opentutorial:chain", t));
  }
  handleEvent(t) {
    (t.type === "started" || t.type === "resumed") && (this.activeId = t.tourId), (t.type === "completed" || t.type === "skipped") && this.activeId === t.tourId && (this.activeId = null);
    try {
      this.opts.onEvent?.(t);
    } catch {
    }
    const e = this.activeId ? this.engines.get(this.activeId)?.getState() ?? null : null;
    try {
      this.opts.onStateChange?.(this.activeId, e);
    } catch {
    }
    (t.type === "completed" || t.type === "skipped") && this.queue.length > 0 && window.setTimeout(() => this.drain(), 0);
  }
  destroy() {
    this.mounted = !1, this.triggers.forEach((t) => t.dispose()), this.disposers.forEach((t) => {
      try {
        t();
      } catch {
      }
    }), this.triggers = [], this.disposers = [], this.queue = [], this.engines.forEach((t) => t.destroy()), this.activeId = null;
  }
}
function Jt(n, t = {}) {
  return new Q(n, t);
}
function Xt(n, t = {}) {
  return new Z(n, t);
}
function Qt(n) {
  return n;
}
function Zt(n) {
  return n;
}
function te(n, t) {
  const { steps: e, ...s } = t;
  return {
    ...n,
    ...s,
    steps: n.steps.map((i) => e?.[i.id] ? { ...i, ...e[i.id] } : i)
  };
}
function ee(n = {}) {
  const { days: t = 365, path: e = "/", domain: s, sameSite: i = "Lax", secure: o } = n, r = () => {
    const a = {};
    if (typeof document > "u") return a;
    for (const l of document.cookie.split(";")) {
      const u = l.indexOf("=");
      u < 0 || (a[decodeURIComponent(l.slice(0, u).trim())] = decodeURIComponent(l.slice(u + 1)));
    }
    return a;
  }, c = (a, l, u) => {
    if (typeof document > "u") return;
    const d = [
      `${encodeURIComponent(a)}=${encodeURIComponent(l)}`,
      `path=${e}`,
      `max-age=${Math.floor(u * 86400)}`,
      `SameSite=${i}`
    ];
    s && d.push(`domain=${s}`), (o ?? i === "None") && d.push("Secure"), document.cookie = d.join("; ");
  };
  return {
    getItem: (a) => r()[a] ?? null,
    setItem: (a, l) => c(a, l, t),
    removeItem: (a) => c(a, "", -1)
  };
}
function se(n = "opentutorial", t = "kv") {
  const e = new C();
  if (typeof indexedDB > "u") return e;
  let s = null;
  const i = () => s || (s = new Promise((r) => {
    try {
      const c = indexedDB.open(n, 1);
      c.onupgradeneeded = () => {
        const a = c.result;
        a.objectStoreNames.contains(t) || a.createObjectStore(t);
      }, c.onsuccess = () => r(c.result), c.onerror = () => r(null), c.onblocked = () => r(null);
    } catch {
      r(null);
    }
  }), s), o = async (r, c) => {
    const a = await i();
    return a ? new Promise((l) => {
      try {
        const u = a.transaction(t, r), d = c(u.objectStore(t));
        d.onsuccess = () => l(d.result), d.onerror = () => l(null);
      } catch {
        l(null);
      }
    }) : null;
  };
  return {
    getItem(r) {
      const c = e.getItem(r);
      return c !== null ? c : o("readonly", (a) => a.get(r)).then((a) => (typeof a == "string" && e.setItem(r, a), typeof a == "string" ? a : null));
    },
    setItem(r, c) {
      e.setItem(r, c), o("readwrite", (a) => a.put(c, r));
    },
    removeItem(r) {
      e.removeItem(r), o("readwrite", (c) => c.delete(r));
    }
  };
}
function ie(n) {
  const {
    endpoint: t,
    headers: e,
    debounceMs: s = 400,
    fetchImpl: i,
    onError: o
  } = n, r = n.cache === !1 ? new C() : n.cache ?? X(), c = i ?? (typeof fetch == "function" ? fetch.bind(globalThis) : void 0), a = t.replace(/\/$/, ""), l = (g) => `${a}/${encodeURIComponent(g)}`, u = () => ({
    "content-type": "application/json",
    ...typeof e == "function" ? e() : e ?? {}
  }), d = /* @__PURE__ */ new Map();
  let v = null;
  const x = async () => {
    if (!c || d.size === 0) return;
    const g = [...d.entries()];
    d.clear();
    for (const [m, f] of g)
      try {
        const w = await c(l(m), {
          method: f === null ? "DELETE" : "PUT",
          headers: u(),
          body: f === null ? void 0 : JSON.stringify({ value: f }),
          credentials: "include"
        });
        if (!w.ok) throw new Error(`HTTP ${w.status}`);
      } catch (w) {
        d.has(m) || d.set(m, f), o?.(w, f === null ? "delete" : "put", m);
      }
  }, b = () => {
    v && clearTimeout(v), v = setTimeout(() => {
      v = null, x();
    }, s);
  };
  return typeof window < "u" && (window.addEventListener("online", () => {
    x();
  }), window.addEventListener("pagehide", () => {
    x();
  })), {
    getItem(g) {
      const m = r.getItem(g);
      return m ?? (c ? c(l(g), { headers: u(), credentials: "include" }).then((f) => f.ok ? f.json() : null).then((f) => {
        const w = f?.value ?? null;
        return typeof w == "string" && r.setItem(g, w), w;
      }).catch((f) => (o?.(f, "get", g), null)) : null);
    },
    setItem(g, m) {
      r.setItem(g, m), d.set(g, m), b();
    },
    removeItem(g) {
      r.removeItem(g), d.set(g, null), b();
    }
  };
}
const zt = {
  start: ["started", "resumed"],
  stop: ["completed", "skipped"],
  skip: ["skipped"],
  complete: ["completed"],
  step: ["step-shown"],
  event: [],
  // every event
  destroy: []
  // emitted locally by destroy()
};
function ne(n) {
  const { specs: t, autoMount: e = !0, ...s } = n, i = /* @__PURE__ */ new Map(), o = (a, l) => {
    const u = i.get(a);
    if (u)
      for (const d of u)
        try {
          d(l);
        } catch {
        }
  }, r = new Z(t, {
    ...s,
    onEvent: (a) => {
      o("event", a);
      for (const [l, u] of Object.entries(zt))
        u.includes(a.type) && o(l, a);
      s.onEvent?.(a);
    }
  });
  e && r.mount();
  const c = (a) => {
    const l = r.getActiveId();
    if (!l) return;
    const u = r.getEngine(l);
    u && a(u);
  };
  return {
    start: (a, l) => r.start(a, l),
    request: (a, l) => r.request(a, l),
    stop: () => r.stop("api"),
    skip: (a) => {
      a ? r.getEngine(a)?.skip("api") : r.stop("api");
    },
    pause: () => r.pause(),
    resume: () => r.resume(),
    next: () => c((a) => {
      a.next();
    }),
    prev: () => c((a) => a.prev()),
    goTo: (a) => c((l) => l.goTo(a)),
    getState: (a) => r.getState(a),
    getActiveId: () => r.getActiveId(),
    hasSeen: (a) => r.hasSeen(a),
    whyBlocked: (a) => r.checkEligibility(a),
    setContext: (a) => r.setContext(a),
    setTheme: (a) => r.setTheme(a),
    setLocale: (a) => r.setLocale(a),
    setUser: (a) => r.setUser(a),
    reset: () => r.reset(),
    resetTour: (a) => r.resetTour(a),
    resetProgress: () => r.resetProgress(),
    getEngine: (a) => r.getEngine(a),
    ready: r.ready,
    on(a, l) {
      return i.has(a) || i.set(a, /* @__PURE__ */ new Set()), i.get(a).add(l), () => this.off(a, l);
    },
    off(a, l) {
      i.get(a)?.delete(l);
    },
    destroy() {
      o("destroy", {
        type: "skipped",
        tourId: r.getActiveId() ?? "",
        reason: "destroy",
        timestamp: Date.now()
      }), r.destroy(), i.clear();
    }
  };
}
export {
  st as CSS,
  Rt as DEFAULT_LABELS,
  C as MemoryStorage,
  Q as TourEngine,
  Z as TourOrchestrator,
  xt as TourPersistence,
  Gt as assertValidSpec,
  lt as blocksToText,
  it as checkExpression,
  pe as createAmplitudeAdapter,
  ee as createCookieStorage,
  fe as createDatadogAdapter,
  me as createDebugAdapter,
  ge as createEventCollector,
  ve as createFunnelReport,
  ye as createGA4Adapter,
  be as createHeapAdapter,
  we as createHttpAdapter,
  se as createIndexedDBStorage,
  Kt as createKeyResolver,
  Yt as createLocaleResolver,
  Ut as createMemoryStorage,
  xe as createMixpanelAdapter,
  Ee as createMultiAdapter,
  ke as createPostHogAdapter,
  ie as createRemoteStorage,
  $e as createRudderStackAdapter,
  Se as createSegmentAdapter,
  Jt as createTour,
  Xt as createTours,
  ne as createTutorialLayer,
  K as currentPath,
  Qt as defineSpec,
  Zt as defineStep,
  nt as describeTarget,
  W as escapeHtml,
  ae as evaluateExpression,
  T as evaluateShowIf,
  te as extendSpec,
  Ae as filterEvents,
  Ft as installTrigger,
  q as interpolate,
  ce as isVisible,
  Y as matchPath,
  ct as normalizeContent,
  J as onLocationChange,
  le as queryDeep,
  ht as renderBlocks,
  P as renderInline,
  Mt as resolveLabel,
  A as resolveTarget,
  Pt as resolveText,
  he as safeQuery,
  M as validateSpec,
  Wt as validateSpecs,
  ue as waitForElement,
  B as waitForTarget
};
//# sourceMappingURL=index.js.map
