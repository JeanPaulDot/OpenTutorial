import { jsx as E, jsxs as I } from "react/jsx-runtime";
import { createContext as J, isValidElement as Y, cloneElement as U, useState as B, useRef as R, useEffect as M, useMemo as X, useContext as Q } from "react";
let V = 0;
class Z {
  root;
  svg;
  dimRect;
  hole;
  ring;
  current = null;
  constructor(t) {
    V += 1;
    const e = `ot-mask-${V}`;
    this.root = document.createElement("div"), this.root.className = "ot-root", this.root.style.setProperty("--ot-z", String(t)), this.root.setAttribute("data-opentutorial", "");
    const s = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(s, "svg"), this.svg.setAttribute("class", "ot-backdrop"), this.svg.setAttribute("width", "100%"), this.svg.setAttribute("height", "100%");
    const i = document.createElementNS(s, "defs"), n = document.createElementNS(s, "mask");
    n.setAttribute("id", e);
    const a = document.createElementNS(s, "rect");
    a.setAttribute("x", "0"), a.setAttribute("y", "0"), a.setAttribute("width", "100%"), a.setAttribute("height", "100%"), a.setAttribute("fill", "white"), this.hole = document.createElementNS(s, "rect"), this.hole.setAttribute("fill", "black"), this.hole.setAttribute("rx", "12"), this.setHole({ x: -9999, y: -9999, width: 0, height: 0 }, 0), n.appendChild(a), n.appendChild(this.hole), i.appendChild(n), this.dimRect = document.createElementNS(s, "rect"), this.dimRect.setAttribute("class", "ot-dim"), this.dimRect.setAttribute("x", "0"), this.dimRect.setAttribute("y", "0"), this.dimRect.setAttribute("width", "100%"), this.dimRect.setAttribute("height", "100%"), this.dimRect.setAttribute("mask", `url(#${e})`), this.svg.appendChild(i), this.svg.appendChild(this.dimRect), this.ring = document.createElement("div"), this.ring.className = "ot-ring", this.ring.style.opacity = "0", this.root.appendChild(this.svg), this.root.appendChild(this.ring), this.svg.style.display = "none";
  }
  setHole(t, e) {
    this.hole.setAttribute("x", String(t.x - e)), this.hole.setAttribute("y", String(t.y - e)), this.hole.setAttribute("width", String(Math.max(0, t.width + e * 2))), this.hole.setAttribute("height", String(Math.max(0, t.height + e * 2)));
  }
  /** Update the cutout + ring. Pass null for a fully dimmed (modal) state. */
  updateSpotlight(t, e = 8, s = 12) {
    if (this.current = t ? { ...t, padding: e, radius: s } : null, !t) {
      this.setHole({ x: -9999, y: -9999, width: 0, height: 0 }, 0), this.ring.style.opacity = "0", this.svg.style.display = "none";
      return;
    }
    this.svg.style.display = "", this.setHole(t, e), this.hole.setAttribute("rx", String(s));
    const i = this.ring.style;
    i.opacity = "1", i.left = `${t.x - e}px`, i.top = `${t.y - e}px`, i.width = `${t.width + e * 2}px`, i.height = `${t.height + e * 2}px`, i.borderRadius = `${s}px`;
  }
  refresh() {
    this.current && this.updateSpotlight(this.current, this.current.padding, this.current.radius);
  }
  mountPopover(t) {
    this.root.appendChild(t);
  }
  setBackdropColor(t) {
    this.dimRect.style.fill = t;
  }
  attach(t = document.body) {
    t.appendChild(this.root);
  }
  destroy() {
    this.root.remove();
  }
}
const tt = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function et(o) {
  return o.replace(/[&<>"']/g, (t) => tt[t] ?? t);
}
function st(o) {
  let t = et(o);
  return t = t.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  ), t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"), t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>"), t = t.replace(/`([^`]+)`/g, "<code>$1</code>"), t;
}
const it = 14, S = 10;
function nt(o) {
  if (o === "auto") return { side: "auto", align: "center" };
  const [t, e] = o.split("-");
  return { side: t, align: e ?? "center" };
}
function ot(o) {
  return { top: "bottom", bottom: "top", left: "right", right: "left" }[o];
}
class rt {
  el;
  titleEl;
  contentEl;
  progressEl;
  a11yProgressEl;
  backBtn;
  nextBtn;
  skipBtn;
  arrow;
  lastSide = null;
  cbs;
  constructor(t) {
    this.cbs = t, this.el = document.createElement("div"), this.el.className = "ot-popover", this.el.setAttribute("role", "dialog"), this.el.setAttribute("aria-modal", "true"), this.el.tabIndex = -1, this.arrow = document.createElement("div"), this.arrow.className = "ot-arrow";
    const e = document.createElement("div");
    e.className = "ot-body", this.skipBtn = document.createElement("button"), this.skipBtn.type = "button", this.skipBtn.className = "ot-skip", this.skipBtn.setAttribute("aria-label", "Skip tour"), this.skipBtn.innerHTML = "&times;", this.skipBtn.addEventListener("click", () => this.cbs.onSkip()), this.titleEl = document.createElement("h3"), this.titleEl.className = "ot-title", this.titleEl.id = `ot-title-${Math.random().toString(36).slice(2, 8)}`, this.el.setAttribute("aria-labelledby", this.titleEl.id), this.contentEl = document.createElement("p"), this.contentEl.className = "ot-content", this.progressEl = document.createElement("div"), this.progressEl.className = "ot-dots", this.progressEl.setAttribute("aria-hidden", "true"), this.a11yProgressEl = document.createElement("span"), this.a11yProgressEl.className = "ot-sr-only", this.backBtn = document.createElement("button"), this.backBtn.type = "button", this.backBtn.className = "ot-btn ot-btn-ghost", this.backBtn.textContent = "Back", this.backBtn.addEventListener("click", () => this.cbs.onPrev()), this.nextBtn = document.createElement("button"), this.nextBtn.type = "button", this.nextBtn.className = "ot-btn ot-btn-primary", this.nextBtn.addEventListener("click", () => this.cbs.onNext());
    const s = document.createElement("div");
    s.className = "ot-footer";
    const i = document.createElement("div");
    i.className = "ot-btns", i.appendChild(this.backBtn), i.appendChild(this.nextBtn), s.appendChild(this.progressEl), s.appendChild(i), e.appendChild(this.skipBtn), e.appendChild(this.titleEl), e.appendChild(this.contentEl), e.appendChild(this.a11yProgressEl), e.appendChild(s), this.el.appendChild(this.arrow), this.el.appendChild(e);
  }
  render(t) {
    this.titleEl.textContent = t.title, this.contentEl.innerHTML = st(t.content), this.a11yProgressEl.textContent = `Step ${t.index + 1} of ${t.total}`, this.progressEl.innerHTML = "";
    for (let e = 0; e < t.total; e += 1) {
      const s = document.createElement("span");
      s.className = `ot-dot${e === t.index ? " ot-dot-active" : ""}`, this.progressEl.appendChild(s);
    }
    this.backBtn.style.visibility = t.index === 0 || !t.canGoBack ? "hidden" : "visible", this.nextBtn.textContent = t.isLast ? "Done" : "Next", t.advanceOn !== "button" && (this.nextBtn.textContent = t.isLast ? "Done" : "Skip step"), this.skipBtn.style.display = t.skippable ? "" : "none";
  }
  /** Position relative to a target rect (viewport coords), or centered when null. */
  position(t, e, s) {
    const i = window.innerWidth, n = window.innerHeight, a = this.el.offsetWidth, r = this.el.offsetHeight;
    if (!t) {
      this.lastSide = "modal", this.el.classList.add("ot-modal"), this.arrow.style.display = "none", this.el.style.left = `${Math.max(S, (i - a) / 2)}px`, this.el.style.top = `${Math.max(S, (n - r) / 2)}px`;
      return;
    }
    this.el.classList.remove("ot-modal"), this.arrow.style.display = "";
    const { side: l, align: c } = nt(e), f = it + s, x = {
      top: t.y,
      bottom: n - (t.y + t.height),
      left: t.x,
      right: i - (t.x + t.width)
    };
    let m = l === "auto" ? ["bottom", "right", "top", "left"].reduce((b, y) => x[y] > x[b] ? y : b, "bottom") : l;
    const T = (p) => p === "top" || p === "bottom" ? x[p] >= r + f : x[p] >= a + f;
    if (!T(m)) {
      const p = ot(m);
      T(p) ? m = p : T(m) || (m = Object.keys(x).reduce((b, y) => x[b] >= x[y] ? b : y));
    }
    let k = 0, w = 0;
    const N = (p, b, y) => c === "start" ? p : c === "end" ? p + b - y : p + b / 2 - y / 2;
    m === "top" || m === "bottom" ? (k = N(t.x, t.width, a), w = m === "top" ? t.y - r - f : t.y + t.height + f) : (w = N(t.y, t.height, r), k = m === "left" ? t.x - a - f : t.x + t.width + f), k = Math.min(Math.max(k, S), Math.max(S, i - a - S)), w = Math.min(Math.max(w, S), Math.max(S, n - r - S)), this.el.style.left = `${k}px`, this.el.style.top = `${w}px`, this.lastSide = m, this.positionArrow(m, t, k, w, a, r);
  }
  positionArrow(t, e, s, i, n, a) {
    const r = this.arrow.style;
    r.top = "", r.bottom = "", r.left = "", r.right = "", this.arrow.dataset.side = t;
    const l = e.x + e.width / 2, c = e.y + e.height / 2;
    t === "top" ? (r.bottom = "-5px", r.left = `${Math.min(Math.max(l - s, 16), n - 16)}px`) : t === "bottom" ? (r.top = "-5px", r.left = `${Math.min(Math.max(l - s, 16), n - 16)}px`) : t === "left" ? (r.right = "-5px", r.top = `${Math.min(Math.max(c - i, 16), a - 16)}px`) : (r.left = "-5px", r.top = `${Math.min(Math.max(c - i, 16), a - 16)}px`);
  }
  getSide() {
    return this.lastSide;
  }
  destroy() {
    this.el.remove();
  }
}
class at {
  el;
  beaconEl;
  tooltipEl = null;
  dismissBtn = null;
  lastRect = null;
  hasTooltip = !1;
  constructor() {
    this.el = document.createElement("div"), this.el.className = "ot-hotspot", this.beaconEl = document.createElement("div"), this.beaconEl.className = "ot-beacon", this.el.appendChild(this.beaconEl);
  }
  render(t, e) {
    this.lastRect = e, this.beaconEl.className = `ot-beacon ot-beacon--${t.display}`, this.el.style.left = `${e.x + e.width / 2}px`, this.el.style.top = `${e.y + e.height / 2}px`, this.el.style.pointerEvents = "auto", t.display === "beacon" ? (this.hasTooltip = !1, this.tooltipEl && (this.tooltipEl.style.display = "none"), this.beaconEl.title = t.content ?? "", this.beaconEl.addEventListener("click", () => t.onDismiss?.(), { once: !0 })) : (this.hasTooltip = !0, this.buildTooltip(t), this.positionTooltip(e), this.beaconEl.addEventListener("click", () => t.onDismiss?.(), { once: !0 }));
  }
  buildTooltip(t) {
    this.tooltipEl || (this.tooltipEl = document.createElement("div"), this.tooltipEl.className = "ot-hotspot-tooltip", this.el.appendChild(this.tooltipEl)), this.tooltipEl.innerHTML = "", this.tooltipEl.style.display = "flex";
    const e = document.createElement("span");
    e.className = "ot-hotspot-text", e.textContent = t.content ?? "", this.tooltipEl.appendChild(e), (t.showDismiss || t.display === "hotspot") && (this.dismissBtn || (this.dismissBtn = document.createElement("button"), this.dismissBtn.className = "ot-hotspot-dismiss", this.dismissBtn.textContent = "→", this.dismissBtn.setAttribute("aria-label", "Next step"), this.dismissBtn.addEventListener("click", () => t.onDismiss?.())), this.tooltipEl.appendChild(this.dismissBtn));
  }
  positionTooltip(t) {
    if (!this.tooltipEl) return;
    const e = window.innerWidth, s = this.tooltipEl.offsetWidth || 200, i = t.x + t.width / 2, n = e - (i + 16), a = i - 16;
    n > s ? (this.tooltipEl.style.left = "12px", this.tooltipEl.style.right = "auto") : a > s ? (this.tooltipEl.style.right = "12px", this.tooltipEl.style.left = "auto") : (this.tooltipEl.style.left = `${Math.max(8, -(i - 8))}px`, this.tooltipEl.style.right = "auto"), this.tooltipEl.style.top = "16px";
  }
  reposition(t) {
    this.lastRect && (this.lastRect = t, this.el.style.left = `${t.x + t.width / 2}px`, this.el.style.top = `${t.y + t.height / 2}px`, this.hasTooltip && this.positionTooltip(t));
  }
  destroy() {
    this.el.remove();
  }
}
function lt(o, t = {}) {
  const e = document.activeElement, s = () => Array.from(
    o.querySelectorAll(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )
  ).filter((n) => n.offsetParent !== null || n === document.activeElement), i = (n) => {
    if (n.key === "Escape") {
      t.onEscape?.(), n.stopPropagation();
      return;
    }
    if (n.key === "ArrowRight" || n.key === "Enter" && !(document.activeElement instanceof HTMLButtonElement)) {
      t.onArrowNext?.(), n.preventDefault();
      return;
    }
    if (n.key === "ArrowLeft") {
      t.onArrowPrev?.(), n.preventDefault();
      return;
    }
    if (n.key !== "Tab") return;
    const a = s();
    if (!a.length) {
      n.preventDefault();
      return;
    }
    const r = a[0], l = a[a.length - 1], c = document.activeElement;
    n.shiftKey && (c === r || !o.contains(c)) ? (l.focus(), n.preventDefault()) : !n.shiftKey && c === l && (r.focus(), n.preventDefault());
  };
  return o.addEventListener("keydown", i), o.focus({ preventScroll: !0 }), () => {
    o.removeEventListener("keydown", i), e?.focus?.({ preventScroll: !0 });
  };
}
function ht(o, t = 5e3) {
  return new Promise((e) => {
    const s = C(o);
    if (s) {
      e(s);
      return;
    }
    let i = !1;
    const n = (c) => {
      i || (i = !0, a.disconnect(), clearInterval(r), clearTimeout(l), e(c));
    }, a = new MutationObserver(() => {
      const c = C(o);
      c && n(c);
    });
    a.observe(document.documentElement, { childList: !0, subtree: !0 });
    const r = setInterval(() => {
      const c = C(o);
      c && n(c);
    }, 100), l = setTimeout(() => n(null), t);
  });
}
function C(o) {
  try {
    return document.querySelector(o);
  } catch {
    return null;
  }
}
class ct {
  map = /* @__PURE__ */ new Map();
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
function ut() {
  try {
    if (typeof localStorage < "u") {
      const o = "__ot_probe__";
      return localStorage.setItem(o, "1"), localStorage.removeItem(o), localStorage;
    }
  } catch {
  }
  return new ct();
}
class pt {
  storage;
  prefix;
  constructor(t, e = "ot") {
    this.storage = t ?? ut(), this.prefix = e;
  }
  key() {
    return `${this.prefix}:tours`;
  }
  progressKey(t) {
    return `${this.prefix}:progress:${t}`;
  }
  load() {
    try {
      const t = this.storage.getItem(this.key());
      if (!t) return { v: 1, tours: {} };
      const e = JSON.parse(t);
      if (e && e.v === 1 && e.tours) return e;
    } catch {
    }
    return { v: 1, tours: {} };
  }
  save(t) {
    try {
      this.storage.setItem(this.key(), JSON.stringify(t));
    } catch {
    }
  }
  mark(t, e, s) {
    const i = this.load();
    i.tours[t] = { status: e, version: s, at: Date.now() }, this.save(i), this.clearProgress(t);
  }
  hasSeen(t, e) {
    const s = this.load().tours[t];
    return !(!s || e && s.version !== e);
  }
  getStatus(t) {
    const e = this.load().tours[t];
    return e ? e.status : null;
  }
  reset(t) {
    if (!t) {
      try {
        this.storage.removeItem(this.key());
      } catch {
      }
      this.clearProgress(t ?? "");
      return;
    }
    const e = this.load();
    delete e.tours[t], this.save(e), this.clearProgress(t);
  }
  clearAllProgress() {
    try {
      const t = this.storage.getItem(this.key());
      if (!t) return;
      const e = JSON.parse(t);
      if (!e || e.v !== 1) return;
      for (const s of Object.keys(e.tours)) this.clearProgress(s);
    } catch {
    }
  }
  saveProgress(t, e, s) {
    const i = { tourId: t, lastStepId: e, stepIndex: s, timestamp: Date.now() };
    try {
      this.storage.setItem(this.progressKey(t), JSON.stringify(i));
    } catch {
    }
  }
  getProgress(t) {
    try {
      const e = this.storage.getItem(this.progressKey(t));
      return e ? JSON.parse(e) : null;
    } catch {
      return null;
    }
  }
  getProgressIfValid(t, e) {
    const s = this.getProgress(t);
    return s ? Date.now() - s.timestamp > e ? (this.clearProgress(t), null) : s : null;
  }
  clearProgress(t) {
    try {
      this.storage.removeItem(this.progressKey(t));
    } catch {
    }
  }
}
const z = /* @__PURE__ */ new Set([
  "auto",
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
]), dt = /* @__PURE__ */ new Set(["spotlight", "hotspot", "beacon"]), ft = /* @__PURE__ */ new Set(["button", "target-click", "event", "auto"]), mt = /* @__PURE__ */ new Set(["manual", "auto", "event"]), gt = /* @__PURE__ */ new Set(["emit", "click", "focus", "navigate", "setContext"]), vt = /* @__PURE__ */ new Set([
  "specVersion",
  "id",
  "title",
  "description",
  "version",
  "trigger",
  "theme",
  "steps"
]), yt = /* @__PURE__ */ new Set([
  "accent",
  "bg",
  "fg",
  "muted",
  "backdrop",
  "radius",
  "shadow",
  "font",
  "z",
  "spotlightRing",
  "popoverWidth"
]), bt = /^[a-z0-9]+(-[a-z0-9]+)*$/;
function $(o) {
  return typeof o == "object" && o !== null && !Array.isArray(o);
}
function H(o, t, e) {
  if (o !== void 0) {
    if (!$(o)) {
      e.push({ path: t, message: "theme must be an object" });
      return;
    }
    for (const s of Object.keys(o))
      yt.has(s) || e.push({ path: `${t}.${s}`, message: `unknown theme token "${s}"` });
  }
}
function F(o, t, e) {
  if (o !== void 0) {
    if (!Array.isArray(o)) {
      e.push({ path: t, message: "must be an array of actions" });
      return;
    }
    o.forEach((s, i) => {
      const n = `${t}[${i}]`;
      if (!$(s)) {
        e.push({ path: n, message: "action must be an object" });
        return;
      }
      if (!gt.has(s.type)) {
        e.push({ path: `${n}.type`, message: `unknown action type "${String(s.type)}"` });
        return;
      }
      s.type === "emit" && typeof s.name != "string" && e.push({ path: `${n}.name`, message: 'emit action requires a string "name"' }), s.type === "navigate" && (typeof s.path != "string" || !s.path.startsWith("/")) && e.push({ path: `${n}.path`, message: 'navigate action requires a same-origin "path" starting with /' }), s.type === "setContext" && typeof s.key != "string" && e.push({ path: `${n}.key`, message: 'setContext action requires a string "key"' });
    });
  }
}
function L(o) {
  if (typeof o == "string") return o;
  if ($(o) && typeof o.key == "string") return o.key;
}
function G(o) {
  const t = [], e = (n, a) => t.push({ path: n, message: a });
  if (!$(o))
    return { ok: !1, errors: [{ path: "$", message: "spec must be a JSON object" }] };
  for (const n of Object.keys(o))
    vt.has(n) || e(`$.${n}`, `unknown top-level key "${n}"`);
  if (o.specVersion !== 1 && e("$.specVersion", "must be the integer 1"), typeof o.id != "string" || !o.id ? e("$.id", "required, non-empty string") : bt.test(o.id) || e("$.id", 'must be kebab-case (e.g. "dashboard-intro")'), L(o.title) ? typeof o.title == "string" && o.title.length > 60 && e("$.title", `must be ≤ 60 chars (got ${o.title.length})`) : e("$.title", "required (string or i18n object with key)"), o.description !== void 0) {
    const n = L(o.description);
    n ? n.length > 200 && e("$.description", `must be ≤ 200 chars (got ${n.length})`) : e("$.description", "must be a string or i18n object");
  }
  if (o.version !== void 0 && typeof o.version != "string" && e("$.version", 'must be a string (e.g. "1.0.0")'), o.trigger !== void 0)
    if (!$(o.trigger)) e("$.trigger", "must be an object");
    else {
      const n = o.trigger;
      mt.has(n.type) || e("$.trigger.type", 'must be "manual" | "auto" | "event"'), n.type === "event" && typeof n.event != "string" && e("$.trigger.event", 'required when trigger.type === "event"'), n.delay !== void 0 && (typeof n.delay != "number" || n.delay < 0) && e("$.trigger.delay", "must be a non-negative number (ms)");
    }
  if (H(o.theme, "$.theme", t), !Array.isArray(o.steps))
    return e("$.steps", "required, must be an array"), t.length ? { ok: !1, errors: t } : { ok: !1, errors: [{ path: "$.steps", message: "missing" }] };
  o.steps.length < 1 && e("$.steps", "must contain at least 1 step"), o.steps.length > 24 && e("$.steps", `must contain ≤ 24 steps (got ${o.steps.length})`);
  const i = /* @__PURE__ */ new Set();
  return o.steps.forEach((n, a) => {
    const r = `$.steps[${a}]`;
    if (!$(n)) {
      e(r, "step must be an object");
      return;
    }
    typeof n.id != "string" || !n.id ? e(`${r}.id`, "required") : i.has(n.id) ? e(`${r}.id`, `duplicate step id "${n.id}"`) : i.add(n.id), n.display !== void 0 && !dt.has(n.display) && e(`${r}.display`, 'must be "spotlight" | "hotspot" | "beacon"'), n.target !== void 0 && ($(n.target) ? ((typeof n.target.selector != "string" || !n.target.selector.trim()) && e(`${r}.target.selector`, "required, non-empty CSS selector"), n.target.timeout !== void 0 && (typeof n.target.timeout != "number" || n.target.timeout < 0) && e(`${r}.target.timeout`, "must be a non-negative number (ms)"), n.target.padding !== void 0 && (typeof n.target.padding != "number" || n.target.padding < 0) && e(`${r}.target.padding`, "must be a non-negative number (px)")) : e(`${r}.target`, "must be an object")), n.placement !== void 0 && !z.has(n.placement) && e(`${r}.placement`, `must be one of: ${[...z].join(" | ")}`);
    const l = L(n.title);
    l ? l.length > 80 && e(`${r}.title`, `must be ≤ 80 chars (got ${l.length})`) : e(`${r}.title`, "required (string or i18n object with key)");
    const c = L(n.content);
    c ? c.length > 320 && e(`${r}.content`, `must be ≤ 320 chars (got ${c.length})`) : e(`${r}.content`, "required (string or i18n object with key)");
    const f = n.advanceOn ?? "button";
    ft.has(f) || e(`${r}.advanceOn`, 'must be "button" | "target-click" | "event" | "auto"'), f === "event" && typeof n.event != "string" && e(`${r}.event`, 'required when advanceOn === "event"'), f === "auto" && (typeof n.duration != "number" || n.duration <= 0) && e(`${r}.duration`, 'required positive number (ms) when advanceOn === "auto"'), f === "target-click" && n.target === void 0 && e(`${r}.target`, 'required when advanceOn === "target-click"'), n.next !== void 0 && typeof n.next != "string" && e(`${r}.next`, "must be a step id string"), n.showIf !== void 0 && (typeof n.showIf != "string" || n.showIf.length > 200) && e(`${r}.showIf`, "must be a string expression ≤ 200 chars"), H(n.theme, `${r}.theme`, t), F(n.onEnter, `${r}.onEnter`, t), F(n.onExit, `${r}.onExit`, t);
  }), o.steps.forEach((n, a) => {
    $(n) && typeof n.next == "string" && !i.has(n.next) && e(`$.steps[${a}].next`, `points to unknown step id "${n.next}"`);
  }), t.length ? { ok: !1, errors: t } : { ok: !0 };
}
function Bt(o) {
  const t = G(o);
  if (!t.ok) {
    const e = t.errors.map((s) => `  • ${s.path}: ${s.message}`).join(`
`);
    throw new Error(`[opentutorial] Invalid TutorialSpec:
${e}`);
  }
  return o;
}
const Et = 200;
function xt(o, t, e = 0) {
  let s = o;
  for (let i = e; i < t.length; i++) {
    if (typeof s != "object" || s === null) return;
    s = s[t[i]];
  }
  return s;
}
function kt(o) {
  const t = [];
  let e = 0;
  for (; e < o.length; ) {
    const s = o.slice(e);
    if (/^\s/.test(s)) {
      e += 1;
      continue;
    }
    let i = s.match(/^(===|!==|&&|\|\||[()!])/);
    if (i) {
      t.push({ t: "op", v: i[1] }), e += i[1].length;
      continue;
    }
    if (s[0] === ".") {
      t.push({ t: "dot" }), e += 1;
      continue;
    }
    if (i = s.match(/^'([^']*)'/) ?? s.match(/^"([^"]*)"/), i) {
      t.push({ t: "str", v: i[1] }), e += i[0].length;
      continue;
    }
    if (i = s.match(/^\d+(\.\d+)?/), i) {
      t.push({ t: "num", v: Number(i[0]) }), e += i[0].length;
      continue;
    }
    if (i = s.match(/^(true|false)\b/), i) {
      t.push({ t: "bool", v: i[1] === "true" }), e += i[0].length;
      continue;
    }
    if (i = s.match(/^null\b/), i) {
      t.push({ t: "null" }), e += i[0].length;
      continue;
    }
    if (i = s.match(/^[A-Za-z_$][\w$]*/), i) {
      t.push({ t: "ident", v: i[0] }), e += i[0].length;
      continue;
    }
    throw new Error(`Unexpected character at ${e}`);
  }
  return t;
}
class wt {
  pos = 0;
  tokens;
  ctx;
  constructor(t, e) {
    this.tokens = t, this.ctx = e;
  }
  parse() {
    const t = this.orExpr();
    if (this.pos !== this.tokens.length) throw new Error("Trailing tokens");
    return t;
  }
  peek() {
    return this.tokens[this.pos];
  }
  isOp(t) {
    const e = this.peek();
    return !!e && e.t === "op" && e.v === t;
  }
  isDot() {
    const t = this.peek();
    return !!t && t.t === "dot";
  }
  eatOp(t) {
    return this.isOp(t) ? (this.pos += 1, !0) : !1;
  }
  orExpr() {
    let t = this.andExpr();
    for (; this.eatOp("||"); ) {
      const e = this.andExpr();
      t = !!t || !!e;
    }
    return t;
  }
  andExpr() {
    let t = this.cmpExpr();
    for (; this.eatOp("&&"); ) {
      const e = this.cmpExpr();
      t = !!t && !!e;
    }
    return t;
  }
  cmpExpr() {
    const t = this.unary();
    return this.eatOp("===") ? t === this.unary() : this.eatOp("!==") ? t !== this.unary() : t;
  }
  unary() {
    return this.eatOp("!") ? !this.unary() : this.primary();
  }
  primary() {
    const t = this.peek();
    if (!t) throw new Error("Unexpected end of expression");
    if (t.t === "op" && t.v === "(") {
      this.pos += 1;
      const e = this.orExpr();
      if (!this.eatOp(")")) throw new Error("Missing closing parenthesis");
      return e;
    }
    switch (this.pos += 1, t.t) {
      case "str":
        return t.v;
      case "num":
        return t.v;
      case "bool":
        return t.v;
      case "null":
        return null;
      case "ident": {
        const e = [t.v];
        for (; this.isDot(); ) {
          this.pos += 1;
          const s = this.peek();
          if (!s || s.t !== "ident") throw new Error("Expected identifier after dot");
          this.pos += 1, e.push(s.v);
        }
        return xt(this.ctx, e);
      }
      default:
        throw new Error("Unexpected token");
    }
  }
}
function St(o, t) {
  try {
    return o.length > Et ? !1 : !!new wt(kt(o), t).parse();
  } catch {
    return !1;
  }
}
function $t(o, t, e) {
  if (typeof o == "string") return o;
  if (o && typeof o.key == "string") {
    if (e) {
      const s = e(o.key, t);
      if (s !== void 0) return s;
    }
    return o.fallback ?? o.key;
  }
  return String(o);
}
function Mt(o) {
  return (t) => o[t];
}
const At = {
  accent: "--ot-accent",
  bg: "--ot-bg",
  fg: "--ot-fg",
  muted: "--ot-muted",
  backdrop: "--ot-backdrop",
  radius: "--ot-radius",
  shadow: "--ot-shadow",
  font: "--ot-font",
  z: "--ot-z",
  spotlightRing: "--ot-spotlight-ring",
  popoverWidth: "--ot-popover-width"
}, Tt = /* @__PURE__ */ new Set(["radius", "popoverWidth"]), It = 100;
function Ct(o, t, e) {
  return $t(o, t, e);
}
class D {
  spec;
  errors = [];
  opts;
  persistence;
  context;
  layer = null;
  popover = null;
  hotspot = null;
  releaseFocus = null;
  cleanupAdvance = null;
  cleanupTrack = null;
  appliedVars = [];
  status = "idle";
  currentId = null;
  history = [];
  targetEl = null;
  runToken = 0;
  transitions = 0;
  constructor(t, e = {}) {
    this.spec = t, this.opts = e, this.context = { ...e.context ?? {} }, this.persistence = new pt(e.persistence?.storage, e.persistence?.keyPrefix ?? "ot");
    const s = G(t);
    if (!s.ok) {
      this.errors = s.errors;
      const i = s.errors.map((n) => `  • ${n.path}: ${n.message}`).join(`
`);
      e.dev !== !1 && console.error(`[opentutorial] Spec "${t?.id ?? "?"}" failed validation:
${i}`), this.emit("error", { message: `invalid spec: ${s.errors.length} violation(s)` });
    }
  }
  getState() {
    const t = this.visibleSteps(), e = t.findIndex((s) => s.id === this.currentId);
    return {
      status: this.status,
      currentStepId: this.currentId,
      index: Math.max(0, e),
      total: t.length
    };
  }
  isValid() {
    return this.errors.length === 0;
  }
  hasSeen() {
    return this.persistence.hasSeen(this.spec.id, this.spec.version);
  }
  resetSeen() {
    this.persistence.reset(), this.persistence.clearAllProgress();
  }
  resetProgress() {
    this.persistence.clearAllProgress();
  }
  setContext(t) {
    Object.assign(this.context, t);
  }
  setGlobalTheme(t) {
    this.opts = { ...this.opts, theme: t }, this.layer && this.applyThemeChain(this.currentStep()?.theme);
  }
  async start(t) {
    if (this.status === "destroyed" || this.status === "running" || !this.isValid()) return;
    this.status = "running", this.history = [], this.transitions = 0;
    const e = t ?? this.resolveResumeStep();
    this.buildDom();
    const s = e ?? this.visibleSteps()[0]?.id;
    if (this.emit("started"), !s) {
      this.complete();
      return;
    }
    await this.goToInternal(s, !1);
  }
  resolveResumeStep() {
    if (!this.opts.resume) return;
    const t = this.opts.progressTtl ?? 1440 * 60 * 1e3, e = this.persistence.getProgressIfValid(this.spec.id, t);
    if (e && e.lastStepId) {
      const s = this.visibleSteps(), i = s.findIndex((n) => n.id === e.lastStepId);
      if (i >= 0 && i < s.length) return e.lastStepId;
    }
  }
  next() {
    if (this.status !== "running") return;
    const t = this.currentStep();
    if (!t) return;
    let e = t.next;
    if (!e) {
      const s = this.visibleSteps(), i = s.findIndex((n) => n.id === t.id);
      e = i >= 0 ? s[i + 1]?.id : void 0;
    }
    if (!e) {
      this.complete();
      return;
    }
    this.goToInternal(e, !0);
  }
  prev() {
    if (this.status !== "running") return;
    const t = this.currentStep();
    if (t && t.canGoBack === !1) return;
    const e = this.history.pop();
    e && this.goToInternal(e, !1);
  }
  goTo(t) {
    this.status === "running" && this.goToInternal(t, !0);
  }
  skip() {
    this.status === "running" && this.finish("skipped");
  }
  complete() {
    this.status === "running" && this.finish("completed");
  }
  destroy() {
    this.status = "destroyed", this.teardownDom();
  }
  visibleSteps() {
    return this.spec.steps.filter((t) => !t.showIf || St(t.showIf, this.context));
  }
  currentStep() {
    return this.spec.steps.find((t) => t.id === this.currentId) ?? null;
  }
  resolveText(t) {
    return Ct(t, this.opts.locale ?? "en", this.opts.i18nResolver);
  }
  buildDom() {
    const t = this.opts.zIndex ?? 9999;
    this.layer = new Z(t), this.layer.attach(), this.popover = new rt({
      onNext: () => this.next(),
      onPrev: () => this.prev(),
      onSkip: () => this.skip()
    }), this.layer.mountPopover(this.popover.el), this.applyThemeChain(void 0);
  }
  teardownDom() {
    this.runToken += 1, this.releaseFocus?.(), this.cleanupAdvance?.(), this.cleanupTrack?.(), this.releaseFocus = null, this.cleanupAdvance = null, this.cleanupTrack = null, this.popover?.destroy(), this.hotspot?.destroy(), this.layer?.destroy(), this.popover = null, this.hotspot = null, this.layer = null, this.targetEl = null, this.appliedVars = [];
  }
  finish(t) {
    const e = this.currentStep();
    e && this.runActions(e.onExit), this.status = t, this.persistence.mark(this.spec.id, t, this.spec.version), this.emit(t, { stepId: this.currentId ?? void 0 }), this.teardownDom();
  }
  async goToInternal(t, e) {
    if (this.status !== "running") return;
    if (this.transitions += 1, this.transitions > It) {
      this.emit("error", { message: "transition limit reached (possible next-loop)" }), this.complete();
      return;
    }
    const s = this.spec.steps.find((n) => n.id === t);
    if (!s) {
      this.emit("error", { message: `unknown step "${t}"` });
      return;
    }
    const i = this.currentStep();
    i && (this.runActions(i.onExit), this.emit("step-hidden", { stepId: i.id })), e && this.currentId && this.currentId !== t && this.history.push(this.currentId), await this.showStep(s);
  }
  async showStep(t) {
    if (!this.layer || !this.popover) return;
    const e = ++this.runToken, s = () => this.runToken === e && this.status === "running";
    this.currentId = t.id, this.cleanupAdvance?.(), this.cleanupAdvance = null, this.releaseFocus?.(), this.releaseFocus = null, this.applyThemeChain(t.theme);
    const i = t.display ?? "spotlight", n = this.visibleSteps(), a = Math.max(0, n.findIndex((l) => l.id === t.id));
    let r = null;
    if (t.target) {
      if (r = C(t.target.selector), !r && t.target.waitFor) {
        if (i === "spotlight" && (this.popover.render(this.makeModel(t, a, n.length, "Looking for the interface element…")), this.popover.position(null, "auto", 0), this.layer.updateSpotlight(null)), r = await ht(t.target.selector, t.target.timeout ?? 5e3), !s()) return;
        if (!r) {
          this.emit("error", { stepId: t.id, message: `target not found: ${t.target.selector}` }), this.next();
          return;
        }
      } else if (!r) {
        this.emit("error", { stepId: t.id, message: `target not found: ${t.target.selector}` }), this.next();
        return;
      }
    }
    if (s()) {
      if (this.targetEl = r, r && t.target?.scrollIntoView !== !1) {
        const l = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        r.scrollIntoView({ block: "center", inline: "center", behavior: l ? "auto" : "smooth" });
      }
      if (this.hotspot?.destroy(), this.hotspot = null, this.layer.updateSpotlight(null), i === "spotlight")
        this.popover.render(this.makeModel(t, a, n.length)), this.popover.el.style.display = "", requestAnimationFrame(() => requestAnimationFrame(() => {
          s() && this.reposition();
        })), this.releaseFocus = lt(this.popover.el, {
          onEscape: () => {
            t.skippable !== !1 && this.skip();
          },
          onArrowNext: () => this.next(),
          onArrowPrev: () => this.prev()
        });
      else if (r) {
        const l = r.getBoundingClientRect();
        if (this.popover.el.style.display = "none", this.hotspot = new at(), this.hotspot.render({
          display: i,
          content: this.resolveText(t.content),
          showDismiss: i === "hotspot" || t.advanceOn === "button",
          onDismiss: () => this.next()
        }, l), this.layer.root.appendChild(this.hotspot.el), i === "beacon") {
          const c = window.setTimeout(() => this.next(), t.duration ?? 5e3), f = () => this.next();
          document.addEventListener("click", f, { once: !0 }), this.cleanupAdvance = () => {
            window.clearTimeout(c), document.removeEventListener("click", f);
          };
        }
      }
      this.wireAdvance(t, r), this.startTracking(), this.persistence.saveProgress(this.spec.id, t.id, a), this.runActions(t.onEnter), this.emit("step-shown", { stepId: t.id, index: a, total: n.length });
    }
  }
  makeModel(t, e, s, i) {
    return {
      stepId: t.id,
      title: this.resolveText(t.title),
      content: i ?? this.resolveText(t.content),
      index: e,
      total: s,
      canGoBack: t.canGoBack !== !1 && this.history.length > 0,
      skippable: t.skippable !== !1,
      isLast: !t.next && e >= s - 1,
      advanceOn: t.advanceOn ?? "button"
    };
  }
  reposition() {
    if (!this.layer || this.status !== "running") return;
    const t = this.currentStep();
    if (!t) return;
    const e = t.target?.padding ?? 8;
    if (this.targetEl) {
      const s = this.targetEl.getBoundingClientRect();
      if (s.width === 0 && s.height === 0 && !document.contains(this.targetEl)) {
        const n = t.target ? C(t.target.selector) : null;
        n && (this.targetEl = n);
      }
      const i = { x: s.x, y: s.y, width: s.width, height: s.height };
      this.hotspot ? this.hotspot.reposition(i) : this.popover && (this.layer.updateSpotlight(i, e, this.mergedRadius()), this.popover.position(i, t.placement ?? "auto", e));
    } else
      this.layer.updateSpotlight(null), this.popover?.position(null, "auto", 0);
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
    this.targetEl && i.observe(this.targetEl), i.observe(document.documentElement), window.addEventListener("resize", s), window.addEventListener("scroll", s, !0);
    const n = performance.now() + 900, a = () => {
      this.status === "running" && (this.reposition(), performance.now() < n && requestAnimationFrame(a));
    };
    requestAnimationFrame(a), this.cleanupTrack = () => {
      i.disconnect(), window.removeEventListener("resize", s), window.removeEventListener("scroll", s, !0), cancelAnimationFrame(t);
    };
  }
  wireAdvance(t, e) {
    const s = t.advanceOn ?? "button";
    if (s === "target-click" && e) {
      const i = () => this.next();
      e.addEventListener("click", i, { once: !0 }), this.cleanupAdvance = () => e.removeEventListener("click", i);
    } else if (s === "event" && typeof t.event == "string") {
      const i = t.event, n = () => this.next();
      window.addEventListener(i, n, { once: !0 }), this.cleanupAdvance = () => window.removeEventListener(i, n);
    } else if (s === "auto") {
      const i = window.setTimeout(() => this.next(), t.duration ?? 3e3);
      this.cleanupAdvance = () => window.clearTimeout(i);
    }
  }
  runActions(t) {
    if (!t) return;
    const e = this.targetEl;
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
            s.path.startsWith("/") && window.location.assign(s.path);
            break;
          case "setContext":
            this.context[s.key] = s.value;
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
    for (const [i, n] of Object.entries(s)) {
      if (n === void 0) continue;
      const a = At[i];
      if (!a) continue;
      const r = Tt.has(i) ? `${n}px` : String(n);
      e.setProperty(a, r), this.appliedVars.push(a);
    }
    s.z !== void 0 && (this.layer.root.style.zIndex = String(s.z));
  }
  emit(t, e = {}) {
    const s = {
      type: t,
      tourId: this.spec?.id ?? "unknown",
      timestamp: Date.now(),
      ...e
    };
    try {
      this.opts.onEvent?.(s);
    } catch {
    }
    try {
      window.dispatchEvent(new CustomEvent("opentutorial", { detail: s }));
    } catch {
    }
  }
}
function Lt(o, t = {}) {
  return new D(o, t);
}
function Ot(o) {
  return o;
}
const K = J(null);
function Rt({
  specs: o,
  context: t,
  theme: e,
  zIndex: s,
  storage: i,
  onEvent: n,
  deepLinkParam: a = "tour",
  locale: r,
  i18nResolver: l,
  resume: c,
  progressTtl: f,
  children: x
}) {
  const [O, m] = B([]), [T, k] = B(null), [w, N] = B(null), [p, b] = B(t ?? {}), y = R(p), _ = R(e), P = R(null);
  if (!P.current) {
    const h = (u) => {
      m((d) => [...d.slice(-99), u]), n?.(u), u.type === "started" && k(u.tourId), (u.type === "completed" || u.type === "skipped") && k((d) => d === u.tourId ? null : d);
      const v = P.current?.get(u.tourId);
      v && N(v.getState());
    };
    P.current = new Map(
      o.map((u) => [
        u.id,
        new D(u, {
          context: y.current,
          theme: _.current,
          zIndex: s,
          onEvent: h,
          persistence: { storage: i },
          locale: r,
          i18nResolver: l,
          resume: c,
          progressTtl: f
        })
      ])
    );
  }
  const g = P.current;
  M(() => {
    y.current = p, g.forEach((h) => h.setContext(p));
  }, [p, g]), M(() => {
    const h = [], u = [];
    return o.forEach((v) => {
      const d = v.trigger;
      if (!d || d.type === "manual") return;
      const A = g.get(v.id);
      if (!A || !A.isValid()) return;
      const j = d.once ?? !0;
      if (!(j && A.hasSeen())) {
        if (d.type === "auto")
          h.push(window.setTimeout(() => {
            A.start();
          }, d.delay ?? 0));
        else if (d.type === "event" && d.event) {
          const q = () => {
            A.start();
          };
          window.addEventListener(d.event, q, { once: j }), u.push(() => window.removeEventListener(d.event, q));
        }
      }
    }), () => {
      h.forEach((v) => window.clearTimeout(v)), u.forEach((v) => v());
    };
  }, []), M(() => {
    if (a !== !1)
      try {
        const h = new URLSearchParams(window.location.search).get(a);
        if (!h) return;
        const u = g.get(h);
        if (u) {
          const v = window.setTimeout(() => {
            u.start();
          }, 400);
          return () => window.clearTimeout(v);
        }
      } catch {
      }
  }, []), M(
    () => () => g.forEach((h) => {
      h.getState().status === "running" && h.skip();
    }),
    [g]
  );
  const W = X(() => ({
    start: (h, u) => {
      const v = g.get(h);
      v && (g.forEach((d, A) => {
        A !== h && d.getState().status === "running" && d.skip();
      }), v.start(u));
    },
    stop: () => g.forEach((h) => {
      h.getState().status === "running" && h.skip();
    }),
    activeId: T,
    state: w,
    events: O,
    clearEvents: () => m([]),
    context: p,
    setContext: (h) => b((u) => ({ ...u, ...h })),
    setTheme: (h) => {
      _.current = h, g.forEach((u) => u.setGlobalTheme(h));
    },
    resetTours: () => g.forEach((h) => h.resetSeen()),
    resetProgress: () => g.forEach((h) => h.resetProgress()),
    hasSeen: (h) => g.get(h)?.hasSeen() ?? !1,
    specs: o
  }), [g, o, T, w, O, p]);
  return /* @__PURE__ */ E(K.Provider, { value: W, children: x });
}
function Dt() {
  const o = Q(K);
  if (!o) throw new Error("useTour must be used inside <TourProvider>");
  return o;
}
function _t({ id: o, children: t }) {
  return Y(t) ? U(t, { "data-tour": o }) : /* @__PURE__ */ E("span", { "data-tour": o, children: t });
}
function jt(o) {
  const t = /* @__PURE__ */ new Map();
  for (const i of o.specs) {
    const n = new D(i, {
      context: o.context,
      theme: o.theme,
      zIndex: o.zIndex,
      onEvent: o.onEvent,
      persistence: o.persistence,
      dev: o.dev
    });
    t.set(i.id, n);
  }
  const e = /* @__PURE__ */ new Map();
  function s(i, n) {
    const a = e.get(i);
    if (!a) return;
    const r = new CustomEvent(i, { detail: n });
    a.forEach((l) => l(r));
  }
  return {
    start(i, n) {
      const a = t.get(i);
      a && (t.forEach((r, l) => {
        l !== i && r.getState().status === "running" && r.skip();
      }), s("tour:start", { tourId: i, stepId: n }), a.start(n));
    },
    stop() {
      t.forEach((i) => {
        i.getState().status === "running" && i.skip();
      }), s("tour:stop", {});
    },
    skip(i) {
      i ? (t.get(i)?.skip(), s("tour:skip", { tourId: i })) : this.stop();
    },
    getState(i) {
      return i ? t.get(i)?.getState() ?? null : Array.from(t.values()).find((a) => a.getState().status === "running")?.getState() ?? null;
    },
    destroy() {
      t.forEach((i) => i.destroy()), t.clear(), e.clear(), s("tour:destroy", {});
    },
    setContext(i) {
      t.forEach((n) => n.setContext(i));
    },
    setTheme(i) {
      t.forEach((n) => n.setGlobalTheme(i));
    },
    on(i, n) {
      e.has(i) || e.set(i, /* @__PURE__ */ new Set()), e.get(i).add(n), window.addEventListener(`opentutorial:${i}`, n);
    },
    off(i, n) {
      e.get(i)?.delete(n), window.removeEventListener(`opentutorial:${i}`, n);
    }
  };
}
function qt({
  specs: o,
  getStatus: t,
  onStart: e,
  className: s = "",
  title: i = "Onboarding"
}) {
  const n = o.filter((r) => t(r.id) === "completed").length, a = o.length > 0 ? Math.round(n / o.length * 100) : 0;
  return /* @__PURE__ */ I("div", { className: `ot-checklist ${s}`, children: [
    i && /* @__PURE__ */ I("div", { className: "ot-checklist-header", children: [
      /* @__PURE__ */ E("h3", { className: "ot-checklist-title", children: i }),
      /* @__PURE__ */ I("span", { className: "ot-checklist-count", children: [
        n,
        "/",
        o.length
      ] })
    ] }),
    /* @__PURE__ */ E("div", { className: "ot-checklist-bar-track", children: /* @__PURE__ */ E("div", { className: "ot-checklist-bar-fill", style: { width: `${a}%` } }) }),
    /* @__PURE__ */ E("ul", { className: "ot-checklist-items", children: o.map((r) => {
      const l = t(r.id), c = l === "completed" ? "✓" : l === "in_progress" ? "◌" : "○";
      return /* @__PURE__ */ I("li", { className: `ot-checklist-item ot-checklist-item--${l}`, children: [
        /* @__PURE__ */ E("span", { className: "ot-checklist-icon", children: c }),
        /* @__PURE__ */ I("div", { className: "ot-checklist-info", children: [
          /* @__PURE__ */ E("span", { className: "ot-checklist-name", children: typeof r.title == "string" ? r.title : r.title.key }),
          r.description && /* @__PURE__ */ E("span", { className: "ot-checklist-desc", children: typeof r.description == "string" ? r.description : "" })
        ] }),
        l !== "completed" && /* @__PURE__ */ E(
          "button",
          {
            className: "ot-checklist-btn",
            onClick: () => e(r.id),
            disabled: l === "in_progress",
            children: l === "in_progress" ? "Continue" : "Start"
          }
        )
      ] }, r.id);
    }) })
  ] });
}
function Vt(o) {
  return (t) => {
    try {
      o.capture("[Opentutorial] " + t.type, t);
    } catch {
    }
  };
}
function zt(o) {
  return (t) => {
    try {
      o.track("[Opentutorial] " + t.type, t);
    } catch {
    }
  };
}
function Ht(o) {
  return (t) => {
    try {
      const e = t;
      delete e.timestamp, o.track("[Opentutorial] " + t.type, e);
    } catch {
    }
  };
}
function Ft(o) {
  return (t) => {
    try {
      const e = window.gtag;
      typeof e == "function" && e("event", "opentutorial_" + t.type, {
        tour_id: t.tourId,
        step_id: t.stepId ?? "",
        event_label: t.message ?? "",
        send_to: o
      });
    } catch {
    }
  };
}
export {
  _t as TourAnchor,
  qt as TourChecklist,
  D as TourEngine,
  pt as TourPersistence,
  Rt as TourProvider,
  Bt as assertValidSpec,
  Ht as createAmplitudeAdapter,
  Ft as createGA4Adapter,
  Mt as createKeyResolver,
  zt as createMixpanelAdapter,
  Vt as createPostHogAdapter,
  Lt as createTour,
  jt as createTutorialLayer,
  Ot as defineSpec,
  et as escapeHtml,
  St as evaluateShowIf,
  st as renderInline,
  $t as resolveText,
  Dt as useTour,
  G as validateSpec
};
//# sourceMappingURL=index.js.map
