var Ht = Object.defineProperty;
var jt = (r, t, e) => t in r ? Ht(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var d = (r, t, e) => jt(r, typeof t != "symbol" ? t + "" : t, e);
import { C as Ft, r as dt, g as st, c as _t, f as V, n as ut, k as Q, m as ct, d as zt, b as Wt, l as Vt, a as vt } from "./chunks/safeEval.es.js";
import { e as us, h as ps, i as fs, q as ms, j as gs, s as vs, w as ys } from "./chunks/safeEval.es.js";
import { shouldSample as Gt, sampleValue as yt } from "./analytics.js";
import { createAmplitudeAdapter as ws, createDatadogAdapter as xs, createDebugAdapter as ks, createEventCollector as Es, createFunnelReport as Ss, createGA4Adapter as As, createHeapAdapter as $s, createHttpAdapter as Cs, createMixpanelAdapter as Is, createMultiAdapter as Ts, createPostHogAdapter as Ls, createRudderStackAdapter as Ns, createSegmentAdapter as Ms, filterEvents as Ds, withEventTypes as Rs, withSampling as Bs } from "./analytics.js";
let bt = 0;
class pt {
  constructor(t, e = {}) {
    /** Children mount here — inside the shadow root when isolated. */
    d(this, "root");
    /** The element actually placed in the host document. */
    d(this, "host");
    d(this, "shadow", null);
    d(this, "svg");
    d(this, "dimRect");
    d(this, "mask");
    d(this, "hole");
    d(this, "holes", []);
    d(this, "ring");
    d(this, "rings", []);
    d(this, "shield");
    d(this, "panels", []);
    d(this, "current", null);
    /** Every highlighted rect, when a step targets more than one element. */
    d(this, "currentAll", []);
    d(this, "interaction", "free");
    d(this, "opts");
    bt += 1;
    const s = `ot-mask-${bt}`;
    if (this.opts = e, this.root = document.createElement("div"), this.root.className = "ot-root", this.root.style.setProperty("--ot-z", String(t)), this.root.setAttribute("data-opentutorial", ""), e.dir && this.root.setAttribute("dir", e.dir), e.isolate) {
      this.host = document.createElement("div"), this.host.setAttribute("data-opentutorial-host", ""), this.host.style.cssText = "position:fixed;inset:0;pointer-events:none;", this.host.style.zIndex = String(t);
      try {
        this.shadow = this.host.attachShadow({ mode: "open" });
        const c = document.createElement("style");
        c.textContent = Ft, this.shadow.appendChild(c), this.shadow.appendChild(this.root);
      } catch {
        this.shadow = null, this.host = this.root;
      }
    } else
      this.host = this.root;
    const i = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(i, "svg"), this.svg.setAttribute("class", "ot-backdrop"), this.svg.setAttribute("width", "100%"), this.svg.setAttribute("height", "100%"), this.svg.setAttribute("aria-hidden", "true");
    const o = document.createElementNS(i, "defs"), n = document.createElementNS(i, "mask");
    n.setAttribute("id", s);
    const a = document.createElementNS(i, "rect");
    a.setAttribute("x", "0"), a.setAttribute("y", "0"), a.setAttribute("width", "100%"), a.setAttribute("height", "100%"), a.setAttribute("fill", "white"), this.mask = n, this.hole = this.addHole(), n.appendChild(a), n.appendChild(this.hole), o.appendChild(n), this.dimRect = document.createElementNS(i, "rect"), this.dimRect.setAttribute("class", "ot-dim"), this.dimRect.setAttribute("x", "0"), this.dimRect.setAttribute("y", "0"), this.dimRect.setAttribute("width", "100%"), this.dimRect.setAttribute("height", "100%"), this.dimRect.setAttribute("mask", `url(#${s})`), this.svg.appendChild(o), this.svg.appendChild(this.dimRect), this.ring = document.createElement("div"), this.ring.className = "ot-ring", this.ring.style.opacity = "0", this.rings.push(this.ring), this.shield = document.createElement("div"), this.shield.className = "ot-shield", this.shield.style.display = "none";
    for (let c = 0; c < 4; c += 1) {
      const h = document.createElement("div");
      h.className = "ot-shield-panel", this.panels.push(h), this.shield.appendChild(h);
    }
    this.root.appendChild(this.svg), this.root.appendChild(this.ring), this.root.appendChild(this.shield), this.svg.style.display = "none";
  }
  /** Add a cutout to the mask pool. */
  addHole() {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    return t.setAttribute("fill", "black"), t.setAttribute("rx", "12"), t.setAttribute("x", "-9999"), t.setAttribute("y", "-9999"), t.setAttribute("width", "0"), t.setAttribute("height", "0"), this.holes.push(t), this.mask && this.mask.appendChild(t), t;
  }
  /** Add a highlight ring to the pool. */
  addRing() {
    const t = document.createElement("div");
    return t.className = "ot-ring", t.style.opacity = "0", this.rings.push(t), this.root.appendChild(t), t;
  }
  setHole(t, e, s = this.hole) {
    s.setAttribute("x", String(t.x - e)), s.setAttribute("y", String(t.y - e)), s.setAttribute("width", String(Math.max(0, t.width + e * 2))), s.setAttribute("height", String(Math.max(0, t.height + e * 2)));
  }
  /** Smallest rect containing every input. Drives the popover and the shield. */
  static union(t) {
    const e = Math.min(...t.map((n) => n.x)), s = Math.min(...t.map((n) => n.y)), i = Math.max(...t.map((n) => n.x + n.width)), o = Math.max(...t.map((n) => n.y + n.height));
    return { x: e, y: s, width: i - e, height: o - s };
  }
  /** Update the cutout + ring. Pass null to clear the spotlight. */
  /**
   * Update the cutout(s) and ring(s). Pass null to clear the spotlight.
   *
   * An array highlights several elements at once — "these three fields" — with
   * one cutout and one ring each. The popover and the interaction shield use
   * their union, because a four-panel shield cannot express a disjoint gap and a
   * popover has to point somewhere.
   */
  updateSpotlight(t, e = 8, s = 12) {
    const i = t === null ? [] : Array.isArray(t) ? t : [t];
    if (this.currentAll = i, i.length === 0) {
      this.current = null;
      for (const o of this.holes) this.setHole({ x: -9999, y: -9999, width: 0, height: 0 }, 0, o);
      for (const o of this.rings) o.style.opacity = "0";
      this.svg.style.display = "none", this.applyShield();
      return;
    }
    for (this.current = { ...pt.union(i), padding: e, radius: s }, this.svg.style.display = ""; this.holes.length < i.length; ) this.addHole();
    for (; this.rings.length < i.length; ) this.addRing();
    i.forEach((o, n) => {
      const a = this.holes[n];
      this.setHole(o, e, a), a.setAttribute("rx", String(s));
      const c = this.rings[n].style;
      c.opacity = "1", c.left = `${o.x - e}px`, c.top = `${o.y - e}px`, c.width = `${o.width + e * 2}px`, c.height = `${o.height + e * 2}px`, c.borderRadius = `${s}px`;
    });
    for (let o = i.length; o < this.holes.length; o += 1)
      this.setHole({ x: -9999, y: -9999, width: 0, height: 0 }, 0, this.holes[o]), this.rings[o].style.opacity = "0";
    this.applyShield();
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
    } : { x: t, y: e, width: 0, height: 0 }, [i, o, n, a] = this.panels, c = (h, p, m, u, k) => {
      h.style.left = `${p}px`, h.style.top = `${m}px`, h.style.width = `${Math.max(0, u)}px`, h.style.height = `${Math.max(0, k)}px`;
    };
    c(i, 0, 0, t, s.y), c(n, 0, s.y + s.height, t, e - (s.y + s.height)), c(a, 0, s.y, s.x, s.height), c(o, s.x + s.width, s.y, t - (s.x + s.width), s.height);
  }
  refresh() {
    this.current ? this.updateSpotlight(
      this.currentAll.length > 1 ? this.currentAll : this.current,
      this.current.padding,
      this.current.radius
    ) : this.applyShield();
  }
  /** The rects currently highlighted, for the popover to anchor against. */
  getSpotlightRects() {
    return this.currentAll;
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
const Ut = 240, Yt = 460, Xt = 0.7, Kt = 56, Jt = 44, Qt = 700, Zt = 14, O = 10;
function te(r) {
  if (r === "auto" || r === "center") return { side: "auto", align: "center" };
  const [t, e] = r.split("-");
  return { side: t, align: e ?? "center" };
}
function ee(r) {
  return { top: "bottom", bottom: "top", left: "right", right: "left" }[r];
}
function se(r) {
  return r === "left" ? "right" : r === "right" ? "left" : r;
}
class ie {
  constructor(t, e = "ltr", s = {}) {
    d(this, "el");
    d(this, "titleEl");
    d(this, "contentEl");
    d(this, "progressEl");
    d(this, "liveEl");
    d(this, "backBtn");
    d(this, "nextBtn");
    d(this, "skipBtn");
    d(this, "arrow");
    d(this, "lastSide", null);
    d(this, "cbs");
    d(this, "dir");
    /** The last rendered model, so a swipe honours the same rules as the buttons. */
    d(this, "model", null);
    d(this, "detachSwipe", null);
    d(this, "detachDrag", null);
    d(this, "autoSize", !0);
    /** Set once the user has dragged the card; cleared when the step changes. */
    d(this, "dragged", !1);
    this.cbs = t, this.dir = e, this.autoSize = s.autoSize !== !1, this.el = document.createElement("div"), this.el.className = "ot-popover", this.el.setAttribute("role", "dialog"), this.el.tabIndex = -1, this.arrow = document.createElement("div"), this.arrow.className = "ot-arrow";
    const i = document.createElement("div");
    i.className = "ot-body", this.skipBtn = document.createElement("button"), this.skipBtn.type = "button", this.skipBtn.className = "ot-skip", this.skipBtn.setAttribute("aria-label", "Close tour"), this.skipBtn.innerHTML = "&times;", this.skipBtn.addEventListener("click", () => this.cbs.onSkip()), this.titleEl = document.createElement("h2"), this.titleEl.className = "ot-title", this.titleEl.id = `ot-title-${Math.random().toString(36).slice(2, 8)}`, this.el.setAttribute("aria-labelledby", this.titleEl.id), this.contentEl = document.createElement("div"), this.contentEl.className = "ot-content-wrap", this.progressEl = document.createElement("div"), this.progressEl.className = "ot-dots", this.progressEl.setAttribute("aria-hidden", "true"), this.liveEl = document.createElement("span"), this.liveEl.className = "ot-sr-only", this.liveEl.setAttribute("aria-live", "polite"), this.liveEl.setAttribute("aria-atomic", "true"), this.backBtn = document.createElement("button"), this.backBtn.type = "button", this.backBtn.className = "ot-btn ot-btn-ghost", this.backBtn.addEventListener("click", () => this.cbs.onPrev()), this.nextBtn = document.createElement("button"), this.nextBtn.type = "button", this.nextBtn.className = "ot-btn ot-btn-primary", this.nextBtn.addEventListener("click", () => this.cbs.onNext());
    const o = document.createElement("div");
    o.className = "ot-footer";
    const n = document.createElement("div");
    n.className = "ot-btns", n.appendChild(this.backBtn), n.appendChild(this.nextBtn), o.appendChild(this.progressEl), o.appendChild(n), i.appendChild(this.skipBtn), i.appendChild(this.titleEl), i.appendChild(this.contentEl), i.appendChild(this.liveEl), i.appendChild(o), this.el.appendChild(this.arrow), this.el.appendChild(i), s.swipe !== !1 && this.installSwipe(), s.draggable && this.installDrag();
  }
  /**
   * Drag the card by its title.
   *
   * A tour that covers the thing it is describing is a real complaint, and no
   * placement algorithm fixes every layout. Once dragged, the card stays where
   * the user put it until the step changes — automatic repositioning would
   * fight them on every scroll frame otherwise.
   */
  installDrag() {
    this.el.classList.add("ot-popover--draggable");
    let t = 0, e = 0, s = 0, i = 0, o = !1;
    const n = (h) => {
      if (!o) return;
      const p = this.el.ownerDocument?.defaultView ?? window, m = Math.max(O, p.innerWidth - this.el.offsetWidth - O), u = Math.max(O, p.innerHeight - this.el.offsetHeight - O), k = Math.min(Math.max(s + h.clientX - t, O), m), l = Math.min(Math.max(i + h.clientY - e, O), u);
      this.el.style.left = `${k}px`, this.el.style.top = `${l}px`, this.arrow.style.display = "none", this.dragged = !0;
    }, a = () => {
      o = !1, this.el.classList.remove("ot-popover--dragging"), window.removeEventListener("pointermove", n), window.removeEventListener("pointerup", a);
    }, c = (h) => {
      h.button === 0 && ((this.el.ownerDocument?.defaultView ?? window).innerWidth <= 480 || (o = !0, t = h.clientX, e = h.clientY, s = parseFloat(this.el.style.left) || 0, i = parseFloat(this.el.style.top) || 0, this.el.classList.add("ot-popover--dragging"), window.addEventListener("pointermove", n), window.addEventListener("pointerup", a), h.preventDefault()));
    };
    this.titleEl.addEventListener("pointerdown", c), this.detachDrag = () => {
      this.titleEl.removeEventListener("pointerdown", c), a();
    };
  }
  /** True when the user has moved the card for the current step. */
  isDragged() {
    return this.dragged;
  }
  /** Flip the Next button without re-rendering — used as `nextWhen` changes. */
  setNextDisabled(t) {
    this.nextBtn.disabled = t, this.nextBtn.setAttribute("aria-disabled", String(t)), this.model && (this.model = { ...this.model, nextDisabled: t });
  }
  /**
   * True while focus is on a control inside the step body. The engine checks
   * this before re-rendering, so typing into a field never loses the caret.
   */
  contentHasFocus() {
    const e = this.el.getRootNode().activeElement ?? document.activeElement;
    return !!e && this.contentEl.contains(e);
  }
  /**
   * Horizontal touch swipes move between steps on mobile, where the popover is
   * docked as a bottom sheet and the buttons are a thumb-stretch away.
   *
   * Gated on the rendered model rather than fired blind: a step that advances on
   * `target-click` hides its Next button, and a swipe must not be a way around
   * that. Gestures starting on a control or inside a horizontally scrollable
   * block are ignored so the popover never eats a legitimate interaction.
   */
  installSwipe() {
    let t = 0, e = 0, s = 0, i = !1;
    const o = (a) => {
      if (a.touches.length !== 1) {
        i = !1;
        return;
      }
      const c = a.target;
      if (c?.closest("button, a, input, textarea, select, video, audio, [data-ot-no-swipe]")) {
        i = !1;
        return;
      }
      if (c && this.isScrollableX(c)) {
        i = !1;
        return;
      }
      i = !0, t = a.touches[0].clientX, e = a.touches[0].clientY, s = Date.now();
    }, n = (a) => {
      if (!i) return;
      i = !1;
      const c = a.changedTouches[0];
      if (!c) return;
      const h = c.clientX - t, p = c.clientY - e;
      if (Date.now() - s > Qt || Math.abs(p) > Jt || Math.abs(h) < Kt) return;
      const m = this.dir === "rtl" ? h > 0 : h < 0, u = this.model;
      u && (m ? u.showNext && !u.nextDisabled && this.cbs.onNext() : u.showBack && u.canGoBack && u.index > 0 && this.cbs.onPrev());
    };
    this.el.addEventListener("touchstart", o, { passive: !0 }), this.el.addEventListener("touchend", n, { passive: !0 }), this.detachSwipe = () => {
      this.el.removeEventListener("touchstart", o), this.el.removeEventListener("touchend", n);
    };
  }
  isScrollableX(t) {
    let e = t;
    for (; e && e !== this.el; ) {
      if (e.scrollWidth > e.clientWidth + 1) return !0;
      e = e.parentElement;
    }
    return !1;
  }
  setDir(t) {
    this.dir = t;
  }
  render(t) {
    this.model?.stepId !== t.stepId && (this.dragged = !1), this.model = t, this.titleEl.textContent = t.title, this.contentEl.replaceChildren(
      dt(t.blocks, { allowHtml: t.allowHtml, interactive: this.cbs.interactive })
    ), this.liveEl.textContent = `${t.title}. Step ${t.index + 1} of ${t.total}`, this.progressEl.replaceChildren();
    const e = !!this.cbs.onJump && !!t.jumpable?.some(Boolean);
    e ? this.progressEl.removeAttribute("aria-hidden") : this.progressEl.setAttribute("aria-hidden", "true");
    for (let i = 0; i < t.total; i += 1) {
      const o = i === t.index;
      if (e && t.jumpable?.[i] && !o) {
        const n = document.createElement("button");
        n.type = "button", n.className = "ot-dot ot-dot-jump", n.setAttribute("aria-label", `Go to step ${i + 1}`), n.addEventListener("click", () => this.cbs.onJump?.(i)), this.progressEl.appendChild(n);
      } else {
        const n = document.createElement("span");
        n.className = `ot-dot${o ? " ot-dot-active" : ""}`, e && n.setAttribute("aria-hidden", "true"), this.progressEl.appendChild(n);
      }
    }
    const s = t.showBack && t.canGoBack && t.index > 0;
    this.backBtn.style.display = s ? "" : "none", this.backBtn.textContent = t.labels.back, this.nextBtn.style.display = t.showNext ? "" : "none", this.nextBtn.textContent = t.isLast ? t.labels.done : t.labels.next, this.nextBtn.disabled = !!t.nextDisabled, this.nextBtn.setAttribute("aria-disabled", String(!!t.nextDisabled)), this.skipBtn.style.display = t.skippable ? "" : "none", this.skipBtn.setAttribute("aria-label", t.labels.skip), this.el.setAttribute("aria-modal", t.modal ? "true" : "false"), this.el.classList.toggle("ot-popover--modal-step", t.modal), t.density ? this.el.dataset.otDensity = t.density : delete this.el.dataset.otDensity, this.applyAutoSize();
  }
  /**
   * Pick a width from the content and a max-height from the viewport.
   *
   * A fixed 340px card is wrong twice: a one-line step looks empty in it, and a
   * step with a code block or an image overflows it. Measuring the natural
   * width once per render costs a single forced layout and makes the card fit
   * what it actually holds.
   *
   * Height is capped rather than sized, so long content scrolls inside the card
   * instead of running off the bottom of the screen — which is what used to
   * happen on a short viewport.
   */
  applyAutoSize() {
    const t = this.el.ownerDocument?.defaultView ?? window, e = t.innerHeight, s = t.innerWidth, i = s <= 480;
    if (this.el.style.maxHeight = `${Math.round(e * Xt)}px`, !this.autoSize || i || this.model?.fixedWidth) {
      this.el.style.width = "";
      return;
    }
    this.el.style.width = "max-content";
    const o = this.el.offsetWidth;
    this.el.style.width = "";
    const n = Math.min(Yt, s - O * 2), a = Math.min(Ut, n), c = Math.max(a, Math.min(o, n));
    this.el.style.width = `${Math.round(c)}px`;
  }
  /** Position relative to a target rect (viewport coords), or centered when null. */
  position(t, e, s) {
    if (this.dragged) return;
    const i = window.innerWidth, o = window.innerHeight, n = this.el.offsetWidth, a = this.el.offsetHeight;
    if (!t || e === "center") {
      this.lastSide = "modal", this.el.classList.add("ot-modal"), this.arrow.style.display = "none", this.el.style.left = `${Math.max(O, (i - n) / 2)}px`, this.el.style.top = `${Math.max(O, (o - a) / 2)}px`;
      return;
    }
    this.el.classList.remove("ot-modal"), this.arrow.style.display = "";
    const c = te(e), h = this.dir === "rtl" ? se(c.side) : c.side, p = c.align, m = Zt + s, u = {
      top: t.y,
      bottom: o - (t.y + t.height),
      left: t.x,
      right: i - (t.x + t.width)
    };
    let l = h === "auto" ? ["bottom", "right", "top", "left"].reduce((E, I) => u[I] > u[E] ? I : E, "bottom") : h;
    const f = (y) => y === "top" || y === "bottom" ? u[y] >= a + m : u[y] >= n + m;
    if (!f(l)) {
      const y = ee(l);
      f(y) ? l = y : l = Object.keys(u).reduce((E, I) => u[E] >= u[I] ? E : I);
    }
    let w = 0, v = 0;
    const x = (y, E, I) => p === "start" ? this.dir === "rtl" ? y + E - I : y : p === "end" ? this.dir === "rtl" ? y : y + E - I : y + E / 2 - I / 2;
    l === "top" || l === "bottom" ? (w = x(t.x, t.width, n), v = l === "top" ? t.y - a - m : t.y + t.height + m) : (v = x(t.y, t.height, a), w = l === "left" ? t.x - n - m : t.x + t.width + m), w = Math.min(Math.max(w, O), Math.max(O, i - n - O)), v = Math.min(Math.max(v, O), Math.max(O, o - a - O)), this.el.style.left = `${w}px`, this.el.style.top = `${v}px`, this.lastSide = l, this.positionArrow(l, t, w, v, n, a);
  }
  positionArrow(t, e, s, i, o, n) {
    const a = this.arrow.style;
    a.top = "", a.bottom = "", a.left = "", a.right = "", this.arrow.dataset.side = t;
    const c = e.x + e.width / 2, h = e.y + e.height / 2;
    t === "top" ? (a.bottom = "-5px", a.left = `${Math.min(Math.max(c - s, 16), Math.max(16, o - 16))}px`) : t === "bottom" ? (a.top = "-5px", a.left = `${Math.min(Math.max(c - s, 16), Math.max(16, o - 16))}px`) : t === "left" ? (a.right = "-5px", a.top = `${Math.min(Math.max(h - i, 16), Math.max(16, n - 16))}px`) : (a.left = "-5px", a.top = `${Math.min(Math.max(h - i, 16), Math.max(16, n - 16))}px`);
  }
  getSide() {
    return this.lastSide;
  }
  destroy() {
    this.detachSwipe?.(), this.detachSwipe = null, this.detachDrag?.(), this.detachDrag = null, this.el.remove();
  }
}
class ne {
  constructor() {
    d(this, "el");
    d(this, "beaconEl");
    d(this, "tooltipEl", null);
    d(this, "textEl", null);
    d(this, "dismissBtn", null);
    d(this, "lastRect", null);
    d(this, "hasTooltip", !1);
    /** Held in a field so re-rendering never stacks duplicate listeners. */
    d(this, "onDismiss", null);
    this.el = document.createElement("div"), this.el.className = "ot-hotspot", this.beaconEl = document.createElement("button"), this.beaconEl.type = "button", this.beaconEl.className = "ot-beacon", this.beaconEl.addEventListener("click", () => this.onDismiss?.()), this.el.appendChild(this.beaconEl);
  }
  render(t, e) {
    this.lastRect = e, this.onDismiss = t.onDismiss ?? null, this.beaconEl.className = `ot-beacon ot-beacon--${t.display}`, this.el.style.left = `${e.x + e.width / 2}px`, this.el.style.top = `${e.y + e.height / 2}px`, this.el.style.pointerEvents = "auto";
    const s = t.content?.trim() || "Show me";
    this.beaconEl.setAttribute("aria-label", s), t.display === "beacon" ? (this.hasTooltip = !1, this.tooltipEl && (this.tooltipEl.style.display = "none"), this.beaconEl.title = t.content ?? "") : (this.hasTooltip = !0, this.buildTooltip(t), this.positionTooltip(e));
  }
  buildTooltip(t) {
    this.tooltipEl || (this.tooltipEl = document.createElement("div"), this.tooltipEl.className = "ot-hotspot-tooltip", this.tooltipEl.setAttribute("role", "status"), this.textEl = document.createElement("span"), this.textEl.className = "ot-hotspot-text", this.tooltipEl.appendChild(this.textEl), this.el.appendChild(this.tooltipEl)), this.tooltipEl.style.display = "flex", this.textEl && (this.textEl.innerHTML = st(t.content ?? "")), t.showDismiss || t.display === "hotspot" ? (this.dismissBtn || (this.dismissBtn = document.createElement("button"), this.dismissBtn.type = "button", this.dismissBtn.className = "ot-hotspot-dismiss", this.dismissBtn.textContent = "→", this.dismissBtn.setAttribute("aria-label", "Next step"), this.dismissBtn.addEventListener("click", () => this.onDismiss?.())), this.tooltipEl.appendChild(this.dismissBtn)) : this.dismissBtn?.parentNode && this.dismissBtn.remove();
  }
  positionTooltip(t) {
    if (!this.tooltipEl) return;
    const e = window.innerWidth, s = this.tooltipEl.offsetWidth || 200, i = t.x + t.width / 2, o = e - (i + 16), n = i - 16;
    o > s ? (this.tooltipEl.style.left = "12px", this.tooltipEl.style.right = "auto") : n > s ? (this.tooltipEl.style.right = "12px", this.tooltipEl.style.left = "auto") : (this.tooltipEl.style.left = `${Math.max(8, -(i - 8))}px`, this.tooltipEl.style.right = "auto"), this.tooltipEl.style.top = "16px";
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
const re = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function oe(r) {
  if (!r) return !1;
  if (r.isContentEditable) return !0;
  const t = r.tagName;
  if (t === "TEXTAREA" || t === "SELECT") return !0;
  if (t !== "INPUT") return !1;
  const e = r.type;
  return !["button", "submit", "reset", "checkbox", "radio", "file"].includes(e);
}
function ae(r, t = {}) {
  const e = document.activeElement, s = t.trap !== !1, i = () => Array.from(r.querySelectorAll(re)).filter((n) => n.getClientRects().length > 0 || n === document.activeElement), o = (n) => {
    const a = r.getRootNode().activeElement ?? document.activeElement;
    if (n.key === "Escape") {
      t.onEscape?.(), n.stopPropagation();
      return;
    }
    if (oe(a)) return;
    if (n.key === "ArrowRight") {
      t.onArrowNext?.(), n.preventDefault();
      return;
    }
    if (n.key === "ArrowLeft") {
      t.onArrowPrev?.(), n.preventDefault();
      return;
    }
    if (n.key === "Enter" && a === r) {
      t.onArrowNext?.(), n.preventDefault();
      return;
    }
    if (n.key !== "Tab" || !s) return;
    const c = i();
    if (!c.length) {
      n.preventDefault();
      return;
    }
    const h = c[0], p = c[c.length - 1];
    n.shiftKey && (a === h || !r.contains(a)) ? (p.focus(), n.preventDefault()) : !n.shiftKey && a === p && (h.focus(), n.preventDefault());
  };
  return r.addEventListener("keydown", o), t.autoFocus !== !1 && r.focus({ preventScroll: !0 }), () => {
    r.removeEventListener("keydown", o);
    const n = document.activeElement;
    (!n || n === document.body || r.contains(n)) && e?.focus?.({ preventScroll: !0 });
  };
}
const lt = "opentutorial:locationchange";
let wt = !1;
function ce() {
  if (wt || typeof history > "u") return;
  wt = !0;
  const r = () => {
    try {
      window.dispatchEvent(new Event(lt));
    } catch {
    }
  };
  for (const t of ["pushState", "replaceState"]) {
    const e = history[t];
    typeof e == "function" && (history[t] = function(...i) {
      const o = e.apply(this, i);
      return r(), o;
    });
  }
}
function Mt() {
  return typeof location > "u" ? "" : location.pathname + location.search + location.hash;
}
function Dt(r, t, e = !1) {
  if (!r) return !1;
  const s = t.split("#")[0];
  if (r.endsWith("*"))
    return s.startsWith(r.slice(0, -1));
  if (r.includes(":")) {
    const o = r.split("/").map((n) => n.startsWith(":") ? "[^/]+" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("/");
    try {
      return new RegExp(`^${o}${e ? "$" : "(/|$|\\?)"}`).test(s);
    } catch {
      return !1;
    }
  }
  const i = s.split("?")[0];
  return e ? i === r : i.startsWith(r);
}
function Rt(r) {
  return typeof window > "u" ? () => {
  } : (ce(), window.addEventListener("popstate", r), window.addEventListener("hashchange", r), window.addEventListener(lt, r), () => {
    window.removeEventListener("popstate", r), window.removeEventListener("hashchange", r), window.removeEventListener(lt, r);
  });
}
class it {
  constructor() {
    d(this, "map", /* @__PURE__ */ new Map());
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
function Fe() {
  return new it();
}
function Bt() {
  try {
    if (typeof localStorage < "u") {
      const r = "__ot_probe__";
      return localStorage.setItem(r, "1"), localStorage.removeItem(r), localStorage;
    }
  } catch {
  }
  return new it();
}
function ot() {
  return { v: 2, tours: {}, progress: {} };
}
class Pt {
  constructor(t, e = "ot", s) {
    d(this, "ready");
    d(this, "storage");
    d(this, "prefix");
    d(this, "userId");
    d(this, "root", ot());
    d(this, "hydrated", !1);
    this.storage = t ?? Bt(), this.prefix = e, this.userId = s, this.ready = this.hydrate();
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
    return t === this.userId ? this.ready : (this.userId = t, this.root = ot(), this.hydrated = !1, this.hydrate());
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
      this.root = ot(), this.save();
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
        const n = this.root.tours[i];
        (!n || o.at > n.at) && (this.root.tours[i] = o);
      }
      for (const [i, o] of Object.entries(s.progress)) {
        const n = this.root.progress[i];
        (!n || o.timestamp > n.timestamp) && (this.root.progress[i] = o);
      }
    }
    return this.save(), !0;
  }
}
const xt = /* @__PURE__ */ new Set([
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
]), kt = /* @__PURE__ */ new Set(["spotlight", "hotspot", "beacon", "modal", "banner"]), Et = /* @__PURE__ */ new Set([
  "button",
  "target-click",
  "event",
  "auto",
  "input-match",
  "form-submit",
  "element-appears",
  "element-disappears",
  "url-match"
]), St = /* @__PURE__ */ new Set(["manual", "auto", "event", "route", "element", "idle", "scroll", "context"]), le = /* @__PURE__ */ new Set(["emit", "click", "focus", "navigate", "setContext", "scrollTo", "wait"]), he = /* @__PURE__ */ new Set([
  "text",
  "image",
  "video",
  "list",
  "code",
  "divider",
  "html",
  "input",
  "choice",
  "button"
]), At = /* @__PURE__ */ new Set(["text", "email", "number", "url", "tel"]), de = /^[A-Za-z_$][\w$]*$/, $t = /* @__PURE__ */ new Set(["free", "target-only", "blocked"]), Ct = /* @__PURE__ */ new Set(["compact", "comfortable", "spacious"]), ue = /* @__PURE__ */ new Set([
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
  "density",
  "steps"
]), pe = /* @__PURE__ */ new Set([
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
  "density",
  "skippable",
  "canGoBack",
  "next",
  "showIf",
  "nextWhen",
  "theme",
  "onEnter",
  "onExit"
]), fe = /* @__PURE__ */ new Set([
  "selector",
  "text",
  "index",
  "all",
  "shadow",
  "iframe",
  "waitFor",
  "timeout",
  "visible",
  "scrollIntoView",
  "scrollBehavior",
  "padding"
]), me = /* @__PURE__ */ new Set([
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
]), ge = /^[a-z0-9]+(-[a-z0-9]+)*$/, z = { title: 60, stepTitle: 80, description: 200, content: 320, steps: 24 }, It = { steps: 200 };
function D(r) {
  return typeof r == "object" && r !== null && !Array.isArray(r);
}
class ve {
  constructor() {
    d(this, "errors", []);
    d(this, "warnings", []);
  }
  error(t, e) {
    this.errors.push({ path: t, message: e, severity: "error" });
  }
  warn(t, e) {
    this.warnings.push({ path: t, message: e, severity: "warning" });
  }
}
function Tt(r, t, e) {
  if (r !== void 0) {
    if (!D(r)) {
      e.error(t, "theme must be an object");
      return;
    }
    for (const s of Object.keys(r))
      me.has(s) || e.warn(`${t}.${s}`, `unknown theme token "${s}" (ignored)`);
  }
}
function Z(r, t, e) {
  if (r === void 0) return;
  if (typeof r != "string") {
    e.error(t, "must be a string expression");
    return;
  }
  if (r.length > 500) {
    e.error(t, `expression must be ≤ 500 chars (got ${r.length})`);
    return;
  }
  const s = _t(r);
  s.ok || e.error(t, `invalid expression: ${s.message}`);
}
function ht(r, t, e) {
  if (r !== void 0) {
    if (!Array.isArray(r)) {
      e.error(t, "must be an array of actions");
      return;
    }
    r.forEach((s, i) => {
      const o = `${t}[${i}]`;
      if (!D(s)) {
        e.error(o, "action must be an object");
        return;
      }
      if (!le.has(s.type)) {
        e.error(`${o}.type`, `unknown action type "${String(s.type)}"`);
        return;
      }
      s.type === "emit" && typeof s.name != "string" && e.error(`${o}.name`, 'emit action requires a string "name"'), s.type === "navigate" && (typeof s.path != "string" || !s.path.startsWith("/")) && e.error(`${o}.path`, 'navigate requires a same-origin "path" starting with /'), s.type === "setContext" && typeof s.key != "string" && e.error(`${o}.key`, 'setContext requires a string "key"'), s.type === "scrollTo" && typeof s.selector != "string" && e.error(`${o}.selector`, 'scrollTo requires a string "selector"'), s.type === "wait" && typeof s.ms != "number" && e.error(`${o}.ms`, 'wait requires a numeric "ms"');
    });
  }
}
function et(r, t, e) {
  if (typeof r == "string") return r.length;
  if (D(r) && typeof r.key == "string") return r.key.length;
  if (D(r) && Array.isArray(r.blocks)) {
    if (r.blocks.length === 0) {
      e.error(t, "blocks must not be empty");
      return;
    }
    let s = 0;
    return r.blocks.forEach((i, o) => {
      const n = `${t}.blocks[${o}]`;
      if (!D(i)) {
        e.error(n, "block must be an object");
        return;
      }
      if (!he.has(i.type)) {
        e.error(`${n}.type`, `unknown block type "${String(i.type)}"`);
        return;
      }
      switch (i.type) {
        case "text":
          typeof i.value == "string" ? s += i.value.length : (!D(i.value) || typeof i.value.key != "string") && e.error(`${n}.value`, "text block requires a string or i18n object");
          break;
        case "image":
          typeof i.src != "string" && e.error(`${n}.src`, 'image block requires "src"'), typeof i.alt != "string" && e.error(`${n}.alt`, 'image block requires "alt" for accessibility');
          break;
        case "video":
          typeof i.src != "string" && e.error(`${n}.src`, 'video block requires "src"');
          break;
        case "list":
          (!Array.isArray(i.items) || i.items.length === 0) && e.error(`${n}.items`, 'list block requires a non-empty "items" array');
          break;
        case "code":
          typeof i.value != "string" && e.error(`${n}.value`, 'code block requires a string "value"');
          break;
        case "html":
          typeof i.value != "string" ? e.error(`${n}.value`, 'html block requires a string "value"') : e.warn(n, "html blocks render only when the host sets allowHtml: true");
          break;
        case "input":
        case "choice":
          (typeof i.name != "string" || !de.test(i.name)) && e.error(`${n}.name`, `${String(i.type)} block requires a "name" that is a valid identifier (e.g. "teamSize")`), i.type === "input" && i.inputType !== void 0 && !At.has(i.inputType) && e.error(`${n}.inputType`, `must be one of: ${[...At].join(" | ")}`), i.type === "choice" && (!Array.isArray(i.options) || i.options.length === 0 ? e.error(`${n}.options`, 'choice block requires a non-empty "options" array') : i.options.forEach((a, c) => {
            typeof a == "string" || D(a) && a.label !== void 0 && a.value !== void 0 || e.error(`${n}.options[${c}]`, "option must be a string or { label, value }");
          }));
          break;
        case "button":
          typeof i.label != "string" && !(D(i.label) && typeof i.label.key == "string") && e.error(`${n}.label`, 'button block requires a "label"'), i.action === void 0 ? e.error(`${n}.action`, 'button block requires an "action"') : typeof i.action == "string" ? ["next", "prev", "skip", "complete"].includes(i.action) || e.error(`${n}.action`, 'must be "next" | "prev" | "skip" | "complete", { goTo }, or a step action') : D(i.action) && "goTo" in i.action ? typeof i.action.goTo != "string" && e.error(`${n}.action.goTo`, "must be a step id") : ht(Array.isArray(i.action) ? i.action : [i.action], `${n}.action`, e);
          break;
      }
    }), s;
  }
}
function ye(r, t) {
  if (r === void 0) return;
  if (!D(r)) {
    t.error("$.trigger", "must be an object");
    return;
  }
  const e = r.type;
  if (!St.has(e)) {
    t.error("$.trigger.type", `must be one of: ${[...St].join(" | ")}`);
    return;
  }
  if (r.delay !== void 0 && (typeof r.delay != "number" || r.delay < 0) && t.error("$.trigger.delay", "must be a non-negative number (ms)"), e === "event" && typeof r.event != "string" && t.error("$.trigger.event", 'required when trigger.type === "event"'), e === "context" && Z(r.when ?? null, "$.trigger.when", t), e === "route" && typeof r.path != "string" && t.error("$.trigger.path", 'required when trigger.type === "route"'), e === "element" && typeof r.selector != "string" && t.error("$.trigger.selector", 'required when trigger.type === "element"'), e === "idle" && (typeof r.ms != "number" || r.ms <= 0) && t.error("$.trigger.ms", 'required positive number (ms) when trigger.type === "idle"'), e === "scroll") {
    const s = r.percent;
    (typeof s != "number" || s < 0 || s > 100) && t.error("$.trigger.percent", "must be a number between 0 and 100");
  }
}
function be(r, t, e) {
  if (r === void 0) return;
  if (!D(r)) {
    e.error(`${t}.target`, "must be an object");
    return;
  }
  for (const n of Object.keys(r))
    fe.has(n) || e.warn(`${t}.target.${n}`, `unknown target key "${n}" (ignored)`);
  const { selector: s, text: i } = r, o = typeof s == "string" && s.trim().length > 0 || Array.isArray(s) && s.length > 0 && s.every((n) => typeof n == "string" && n.trim());
  s !== void 0 && !o && e.error(`${t}.target.selector`, "must be a non-empty CSS selector or array of selectors"), !o && typeof i != "string" && e.error(`${t}.target`, 'requires "selector", "text", or both'), r.timeout !== void 0 && (typeof r.timeout != "number" || r.timeout < 0) && e.error(`${t}.target.timeout`, "must be a non-negative number (ms)"), r.padding !== void 0 && (typeof r.padding != "number" || r.padding < 0) && e.error(`${t}.target.padding`, "must be a non-negative number (px)"), r.index !== void 0 && (typeof r.index != "number" || r.index < 0) && e.error(`${t}.target.index`, "must be a non-negative integer"), r.iframe !== void 0 && typeof r.iframe != "string" && e.error(`${t}.target.iframe`, "must be a CSS selector string"), r.scrollBehavior !== void 0 && !["auto", "smooth"].includes(r.scrollBehavior) && e.error(`${t}.target.scrollBehavior`, 'must be "auto" or "smooth"');
}
function ft(r) {
  const t = new ve();
  if (!D(r))
    return {
      ok: !1,
      errors: [{ path: "$", message: "spec must be a JSON object", severity: "error" }],
      warnings: []
    };
  for (const i of Object.keys(r))
    ue.has(i) || t.warn(`$.${i}`, `unknown top-level key "${i}" (ignored)`);
  r.specVersion !== 1 && t.error("$.specVersion", "must be the integer 1"), typeof r.id != "string" || !r.id ? t.error("$.id", "required, non-empty string") : ge.test(r.id) || t.error("$.id", 'must be kebab-case (e.g. "dashboard-intro")');
  const e = et(r.title, "$.title", t);
  if (e === void 0 ? t.error("$.title", "required (string or i18n object with key)") : e === 0 ? t.error("$.title", "must not be empty") : e > z.title && t.warn("$.title", `longer than ${z.title} chars (got ${e})`), r.description !== void 0) {
    const i = et(r.description, "$.description", t);
    i === void 0 ? t.error("$.description", "must be a string or i18n object") : i > z.description && t.warn("$.description", `longer than ${z.description} chars (got ${i})`);
  }
  if (r.version !== void 0 && typeof r.version != "string" && t.error("$.version", 'must be a string (e.g. "1.0.0")'), r.priority !== void 0 && typeof r.priority != "number" && t.error("$.priority", "must be a number"), r.interaction !== void 0 && !$t.has(r.interaction) && t.error("$.interaction", 'must be "free" | "target-only" | "blocked"'), r.density !== void 0 && !Ct.has(r.density) && t.error("$.density", 'must be "compact" | "comfortable" | "spacious"'), ye(r.trigger, t), r.audience !== void 0 && (D(r.audience) ? Z(r.audience.showIf, "$.audience.showIf", t) : t.error("$.audience", "must be an object")), r.frequency !== void 0)
    if (!D(r.frequency))
      t.error("$.frequency", "must be an object");
    else
      for (const i of ["max", "cooldown", "perSession"]) {
        const o = r.frequency[i];
        o !== void 0 && (typeof o != "number" || o < 0) && t.error(`$.frequency.${i}`, "must be a non-negative number");
      }
  if (r.onComplete !== void 0)
    if (!D(r.onComplete))
      t.error("$.onComplete", "must be an object");
    else {
      const { startTour: i, emit: o, navigate: n } = r.onComplete;
      i !== void 0 && typeof i != "string" && t.error("$.onComplete.startTour", "must be a tour id string"), o !== void 0 && typeof o != "string" && t.error("$.onComplete.emit", "must be an event name string"), n !== void 0 && (typeof n != "string" || !n.startsWith("/")) && t.error("$.onComplete.navigate", "must be a same-origin path starting with /");
    }
  if (Tt(r.theme, "$.theme", t), !Array.isArray(r.steps))
    return t.error("$.steps", "required, must be an array"), { ok: !1, errors: t.errors, warnings: t.warnings };
  r.steps.length < 1 && t.error("$.steps", "must contain at least 1 step"), r.steps.length > It.steps ? t.error("$.steps", `must contain ≤ ${It.steps} steps (got ${r.steps.length})`) : r.steps.length > z.steps && t.warn("$.steps", `${r.steps.length} steps is a lot; consider splitting into several tours`);
  const s = /* @__PURE__ */ new Set();
  return r.steps.forEach((i, o) => {
    const n = `$.steps[${o}]`;
    if (!D(i)) {
      t.error(n, "step must be an object");
      return;
    }
    for (const m of Object.keys(i))
      pe.has(m) || t.warn(`${n}.${m}`, `unknown step key "${m}" (ignored)`);
    typeof i.id != "string" || !i.id ? t.error(`${n}.id`, "required") : s.has(i.id) ? t.error(`${n}.id`, `duplicate step id "${i.id}"`) : s.add(i.id);
    const a = i.display;
    a !== void 0 && !kt.has(a) && t.error(`${n}.display`, `must be one of: ${[...kt].join(" | ")}`), be(i.target, n, t), i.placement !== void 0 && !xt.has(i.placement) && t.error(`${n}.placement`, `must be one of: ${[...xt].join(" | ")}`), i.interaction !== void 0 && !$t.has(i.interaction) && t.error(`${n}.interaction`, 'must be "free" | "target-only" | "blocked"'), i.density !== void 0 && !Ct.has(i.density) && t.error(`${n}.density`, 'must be "compact" | "comfortable" | "spacious"');
    const c = et(i.title, `${n}.title`, t);
    c === void 0 ? t.error(`${n}.title`, "required (string or i18n object with key)") : c === 0 ? t.error(`${n}.title`, "must not be empty") : c > z.stepTitle && t.warn(`${n}.title`, `longer than ${z.stepTitle} chars (got ${c})`);
    const h = et(i.content, `${n}.content`, t);
    if (h === void 0 ? t.error(`${n}.content`, "required (string, i18n object, or { blocks: [...] })") : h > z.content && t.warn(`${n}.content`, `longer than ${z.content} chars (got ${h}); long copy hurts completion`), i.buttons !== void 0)
      if (!D(i.buttons)) t.error(`${n}.buttons`, "must be an object");
      else
        for (const m of Object.keys(i.buttons))
          ["next", "back", "skip", "done"].includes(m) || t.warn(`${n}.buttons.${m}`, `unknown button "${m}" (ignored)`);
    const p = i.advanceOn ?? "button";
    Et.has(p) || t.error(`${n}.advanceOn`, `must be one of: ${[...Et].join(" | ")}`), p === "event" && typeof i.event != "string" && t.error(`${n}.event`, 'required when advanceOn === "event"'), p === "auto" && (typeof i.duration != "number" || i.duration <= 0) && t.error(`${n}.duration`, 'required positive number (ms) when advanceOn === "auto"'), p === "target-click" && i.target === void 0 && t.error(`${n}.target`, 'required when advanceOn === "target-click"'), p === "input-match" && (i.target === void 0 && t.error(`${n}.target`, 'required when advanceOn === "input-match"'), typeof i.match != "string" && t.error(`${n}.match`, 'required when advanceOn === "input-match"')), p === "form-submit" && i.target === void 0 && t.error(`${n}.target`, 'required when advanceOn === "form-submit"'), (p === "element-appears" || p === "element-disappears") && typeof i.watch != "string" && t.error(`${n}.watch`, `required when advanceOn === "${p}"`), p === "url-match" && typeof i.urlPattern != "string" && t.error(`${n}.urlPattern`, 'required when advanceOn === "url-match"'), a === "beacon" && i.duration !== void 0 && typeof i.duration != "number" && t.error(`${n}.duration`, "must be a number (ms)"), i.next !== void 0 && (typeof i.next == "string" || (Array.isArray(i.next) ? (i.next.length === 0 && t.warn(`${n}.next`, "empty branch list falls through to the next step"), i.next.forEach((m, u) => {
      const k = `${n}.next[${u}]`;
      if (!D(m)) {
        t.error(k, "branch must be an object { if, to }");
        return;
      }
      Z(m.if, `${k}.if`, t), typeof m.to != "string" && t.error(`${k}.to`, "must be a step id string");
    })) : t.error(`${n}.next`, "must be a step id string or an array of { if, to } branches"))), Z(i.showIf, `${n}.showIf`, t), Z(i.nextWhen, `${n}.nextWhen`, t), Tt(i.theme, `${n}.theme`, t), ht(i.onEnter, `${n}.onEnter`, t), ht(i.onExit, `${n}.onExit`, t);
  }), r.steps.forEach((i, o) => {
    if (!D(i)) return;
    const n = `$.steps[${o}].next`;
    typeof i.next == "string" && !s.has(i.next) ? t.error(n, `points to unknown step id "${i.next}"`) : Array.isArray(i.next) && i.next.forEach((a, c) => {
      D(a) && typeof a.to == "string" && !s.has(a.to) && t.error(`${n}[${c}].to`, `points to unknown step id "${a.to}"`);
    });
  }), t.errors.length ? { ok: !1, errors: t.errors, warnings: t.warnings } : { ok: !0, errors: [], warnings: t.warnings };
}
function _e(r) {
  const t = ft(r);
  if (!t.ok) {
    const e = t.errors.map((s) => `  • ${s.path}: ${s.message}`).join(`
`);
    throw new Error(`[opentutorial] Invalid TutorialSpec:
${e}`);
  }
  return r;
}
function ze(r) {
  const t = [], e = /* @__PURE__ */ new Set();
  return r.forEach((s, i) => {
    const o = D(s) && typeof s.id == "string" ? s.id : void 0, n = ft(s);
    for (const a of [...n.errors, ...n.warnings])
      t.push({ ...a, path: `[${i}]${a.path.slice(1)}`, specId: o });
    o && (e.has(o) && t.push({ path: `[${i}].id`, message: `duplicate tour id "${o}"`, severity: "error", specId: o }), e.add(o));
  }), r.forEach((s, i) => {
    if (!D(s) || !D(s.onComplete)) return;
    const o = s.onComplete.startTour;
    typeof o == "string" && !e.has(o) && t.push({
      path: `[${i}].onComplete.startTour`,
      message: `chains to unknown tour "${o}"`,
      severity: "warning",
      specId: typeof s.id == "string" ? s.id : void 0
    });
  }), { ok: !t.some((s) => s.severity === "error"), issues: t };
}
const we = ["zero", "one", "two", "few", "many", "other"];
function Lt(r, t) {
  return t.split(".").reduce(
    (e, s) => e && typeof e == "object" ? e[s] : void 0,
    r
  );
}
function xe(r, t, e = "en") {
  let s;
  try {
    s = new Intl.PluralRules(e).select(r);
  } catch {
    s = r === 1 ? "one" : "other";
  }
  return t[s] ?? t.other ?? "";
}
function ke(r) {
  const t = {}, e = /(\w+)\s*\{([^{}]*)\}/g;
  let s;
  for (; (s = e.exec(r)) !== null; ) {
    const i = s[1];
    we.includes(i) && (t[i] = s[2]);
  }
  return t;
}
function Ee(r, t) {
  let e = 0;
  for (let s = t; s < r.length; s += 1) {
    const i = r[s];
    if (i === "{") e += 1;
    else if (i === "}") {
      if (e === 0 && r[s + 1] === "}") return s;
      e > 0 && (e -= 1);
    }
  }
  return -1;
}
function Nt(r, t) {
  try {
    return new Intl.NumberFormat(t).format(r);
  } catch {
    return String(r);
  }
}
function at(r, t, e = "en") {
  if (!r.includes("{{")) return r;
  let s = "", i = 0;
  for (; i < r.length; ) {
    const o = r.indexOf("{{", i);
    if (o === -1) {
      s += r.slice(i);
      break;
    }
    const n = Ee(r, o + 2);
    if (n === -1) {
      s += r.slice(i);
      break;
    }
    s += r.slice(i, o);
    const a = r.slice(o + 2, n).trim();
    s += Se(a, t, e), i = n + 2;
  }
  return s;
}
function Se(r, t, e) {
  const s = `{{${r}}}`, i = r.indexOf(",");
  if (i !== -1) {
    const n = r.slice(0, i).trim(), a = r.slice(i + 1).trim();
    if (!a.startsWith("plural")) return s;
    const c = t ? Lt(t, n) : void 0, h = typeof c == "number" ? c : Number(c);
    if (!Number.isFinite(h)) return s;
    const p = ke(a.slice(6).replace(/^\s*,\s*/, ""));
    return xe(h, p, e).replace(/#/g, Nt(h, e));
  }
  if (!/^[\w.$]+$/.test(r)) return s;
  const o = t ? Lt(t, r) : void 0;
  return o == null ? s : typeof o == "number" ? Nt(o, e) : String(o);
}
function tt(r, t, e, s) {
  if (typeof r == "string") return at(r, s, t);
  if (r && typeof r.key == "string") {
    const i = e?.(r.key, t);
    return at(i !== void 0 ? i : r.fallback ?? r.key, s, t);
  }
  return String(r);
}
function We(r) {
  return (t) => r[t];
}
function Ve(r, t = "en") {
  return (e, s) => {
    for (const i of [s, s.split("-")[0], t]) {
      const o = r[i]?.[e];
      if (o !== void 0) return o;
    }
  };
}
const Ae = {
  next: "Next",
  back: "Back",
  done: "Done",
  skip: "Skip tour"
};
function $e(r, t, e) {
  return e?.(`opentutorial.${r}`, t) ?? Ae[r];
}
const Ce = /* @__PURE__ */ new Set(["ar", "he", "fa", "ur", "ps", "sd", "ug", "yi", "dv", "ckb"]);
function Ge(r) {
  try {
    const t = new Intl.Locale(r), e = t.getTextInfo?.().direction ?? t.textInfo?.direction;
    if (e === "rtl" || e === "ltr") return e;
  } catch {
  }
  return Ce.has(r.split("-")[0].toLowerCase()) ? "rtl" : "ltr";
}
const Ie = {
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
};
function Te(r) {
  const t = Math.min(...r.map((o) => o.x)), e = Math.min(...r.map((o) => o.y)), s = Math.max(...r.map((o) => o.x + o.width)), i = Math.max(...r.map((o) => o.y + o.height));
  return { x: t, y: e, width: s - t, height: i - e };
}
function Le(r) {
  try {
    return JSON.stringify([r.title, r.content]).includes("{{");
  } catch {
    return !1;
  }
}
const Ne = /* @__PURE__ */ new Set(["radius", "popoverWidth", "fontSize", "spacing", "arrowSize", "overlayBlur"]), Me = /* @__PURE__ */ new Set(["animationMs"]), De = 200;
class qt {
  constructor(t, e = {}) {
    d(this, "spec");
    d(this, "errors", []);
    d(this, "warnings", []);
    d(this, "opts");
    d(this, "persistence");
    d(this, "context");
    d(this, "layer", null);
    d(this, "popover", null);
    d(this, "hotspot", null);
    d(this, "customHost", null);
    d(this, "releaseFocus", null);
    d(this, "cleanupAdvance", null);
    d(this, "cleanupTrack", null);
    d(this, "cleanupRender", null);
    d(this, "appliedVars", []);
    d(this, "status", "idle");
    d(this, "currentId", null);
    d(this, "history", []);
    d(this, "resolved", null);
    d(this, "runToken", 0);
    d(this, "transitions", 0);
    d(this, "stepEnteredAt", 0);
    d(this, "startedAt", 0);
    d(this, "advancing", !1);
    d(this, "sampleDecision", null);
    /** A custom `renderIndicator` surface is showing instead of the hotspot. */
    d(this, "indicatorActive", !1);
    this.spec = t, this.opts = e, this.context = { ...e.context ?? {} }, this.persistence = new Pt(
      e.persistence?.storage,
      e.persistence?.keyPrefix ?? "ot",
      e.userId
    );
    const s = ft(t);
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
      canGoNext: this.status === "running" && this.canAdvance(s)
    };
  }
  /** False while the step's `nextWhen` condition is unmet. */
  canAdvance(t) {
    return !t?.nextWhen || V(t.nextWhen, this.context);
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
  /**
   * Snapshot every persisted record — seen state, resume progress, and the
   * in-flight tour — as plain JSON. Storage is shared across the tours built
   * from one options object, so this covers all of them, not just this spec.
   */
  exportProgress() {
    return this.persistence.exportAll();
  }
  /**
   * Restore a snapshot from `exportProgress()`. `merge` keeps whichever record
   * is newer per tour, which is what you want when reconciling a server copy
   * with local activity; `replace` overwrites wholesale. Returns false when the
   * payload cannot be parsed, leaving existing state untouched.
   */
  importProgress(t, e = "replace") {
    return this.persistence.importAll(t, e);
  }
  setUser(t) {
    return this.opts = { ...this.opts, userId: t }, this.persistence.setUser(t);
  }
  getContext() {
    return this.context;
  }
  setContext(t) {
    this.patchContext(t, { reactive: !0, notify: !0 });
  }
  /**
   * Apply a patch that originated in another engine. Same reactive refresh as
   * `setContext`, but without firing `onContextChange` — the orchestrator uses
   * this to mirror one tour's answers into the others without an echo.
   */
  applyContext(t) {
    this.patchContext(t, { reactive: !0, notify: !1 });
  }
  patchContext(t, e) {
    const s = {};
    for (const [n, a] of Object.entries(t))
      Object.is(this.context[n], a) || (s[n] = a);
    if (Object.keys(s).length === 0) return;
    const i = this.visibleSteps().length;
    if (Object.assign(this.context, s), e.notify)
      try {
        this.opts.onContextChange?.(this.context, s);
      } catch {
      }
    if (!e.reactive || this.status !== "running") return;
    const o = this.currentStep();
    if (o) {
      if (o.showIf && !V(o.showIf, this.context)) {
        this.advance(!0);
        return;
      }
      this.refreshReactive(o, this.visibleSteps().length !== i);
    }
  }
  /**
   * Bring the visible step in line with a context change.
   *
   * Three things can be stale: the Next button (`nextWhen`), the step count
   * (a later step appeared or vanished), and interpolated copy (`{{name}}`).
   * The body is only rebuilt when it has to be, and never while the user is
   * typing in it — replacing the field under the caret would eat keystrokes.
   */
  refreshReactive(t, e) {
    if (this.indicatorActive || this.hotspot) return;
    const i = this.layer?.root.getRootNode()?.activeElement ?? document.activeElement, o = !!this.popover?.contentHasFocus() || !!this.customHost && !!i && this.customHost.contains(i);
    if ((e || !!this.opts.renderStep || Le(t)) && !o) {
      this.rerenderCurrent();
      return;
    }
    this.popover?.setNextDisabled(!this.canAdvance(t));
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
      const i = this.visibleSteps(), o = i.findIndex((n) => n.id === s);
      o > 0 && (this.history = i.slice(0, o).map((n) => n.id));
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
    return this.advance(!1);
  }
  /** `force` skips the `nextWhen` gate — for steps leaving on their own account. */
  async advance(t) {
    if (this.status !== "running" || this.advancing) return;
    const e = this.currentStep();
    if (!e || !t && !this.canAdvance(e)) return;
    if (this.opts.beforeNext) {
      this.advancing = !0;
      try {
        const i = this.visibleSteps().findIndex((n) => n.id === e.id);
        if (!await this.opts.beforeNext({ tourId: this.spec.id, step: e, index: Math.max(0, i) })) return;
      } catch {
        return;
      } finally {
        this.advancing = !1;
      }
      if (this.status !== "running") return;
    }
    this.emit("step-completed", { stepId: e.id, duration: this.stepDuration() });
    const s = this.resolveNextId(e);
    if (!s) {
      this.complete("end");
      return;
    }
    await this.goToInternal(s, !0);
  }
  resolveNextId(t) {
    if (Array.isArray(t.next)) {
      for (const n of t.next)
        if (n && typeof n.if == "string" && V(n.if, this.context)) return n.to;
    } else if (typeof t.next == "string")
      return t.next;
    const e = this.visibleSteps(), s = e.findIndex((n) => n.id === t.id);
    if (s >= 0) return e[s + 1]?.id;
    const i = this.spec.steps.findIndex((n) => n.id === t.id);
    if (i < 0) return;
    const o = new Set(e.map((n) => n.id));
    return this.spec.steps.slice(i + 1).find((n) => o.has(n.id))?.id;
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
    return this.spec.steps.filter((t) => !t.showIf || V(t.showIf, this.context));
  }
  currentStep() {
    return this.spec.steps.find((t) => t.id === this.currentId) ?? null;
  }
  stepDuration() {
    return this.stepEnteredAt ? Date.now() - this.stepEnteredAt : 0;
  }
  text(t) {
    return tt(t, this.opts.locale ?? "en", this.opts.i18nResolver, this.context);
  }
  blocks(t) {
    return ut(t, (e) => this.text(e));
  }
  interactionFor(t) {
    return t.interaction ?? this.spec.interaction ?? this.opts.interaction ?? "free";
  }
  buildDom() {
    const t = this.opts.zIndex ?? 9999;
    this.layer = new pt(t, {
      container: this.opts.container,
      isolate: this.opts.isolate,
      dir: this.opts.dir
    }), this.layer.attach(), (this.opts.renderStep || this.opts.renderIndicator) && (this.customHost = document.createElement("div"), this.customHost.className = "ot-custom-host", this.layer.mountPopover(this.customHost)), this.opts.renderStep || (this.popover = new ie(
      {
        onNext: () => {
          this.next();
        },
        onPrev: () => this.prev(),
        onSkip: () => this.skip("user"),
        onJump: (e) => this.jumpTo(e),
        interactive: this.interactiveHandlers()
      },
      this.opts.dir ?? "ltr",
      { swipe: this.opts.swipe, autoSize: this.opts.autoSize, draggable: this.opts.draggable }
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
    if (this.transitions += 1, this.transitions > De) {
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
    const i = t.display ?? "spotlight", o = this.visibleSteps(), n = Math.max(0, o.findIndex((h) => h.id === t.id));
    let a = null;
    if (t.target) {
      if (a = Q(t.target), !a && t.target.waitFor && (this.renderStep(t, n, o.length, "Looking for the interface element…"), a = await ct(t.target, t.target.timeout ?? 5e3), !s()))
        return;
      if (!a) {
        const h = zt(t.target);
        this.emit("target-not-found", { stepId: t.id, selector: h, message: `target not found: ${h}` }), this.next();
        return;
      }
    }
    if (!s()) return;
    if (this.resolved = a, a && t.target?.scrollIntoView !== !1) {
      const h = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches, p = t.target?.scrollBehavior ?? (h ? "auto" : "smooth");
      try {
        a.element.scrollIntoView({ block: "center", inline: "center", behavior: p });
      } catch {
      }
    }
    if (this.hotspot?.destroy(), this.hotspot = null, this.resetIndicatorHost(), this.layer.updateSpotlight(null), this.layer.setInteraction(this.interactionFor(t)), (i === "hotspot" || i === "beacon") && a)
      this.showIndicator(t, i, a);
    else {
      this.renderStep(t, n, o.length), (i === "modal" || !a) && this.layer.showBackdrop(), requestAnimationFrame(() => requestAnimationFrame(() => {
        s() && this.reposition();
      }));
      const h = this.customHost ?? this.popover?.el;
      if (h) {
        const p = i === "modal" || this.interactionFor(t) !== "free";
        this.releaseFocus = ae(h, {
          trap: p,
          onEscape: () => {
            t.skippable !== !1 && this.skip("escape");
          },
          // Escape is never optional — a tour must always be dismissible from
          // the keyboard — but arrow/Enter navigation can be turned off for
          // hosts whose own shortcuts would collide.
          ...this.opts.keyboard !== !1 ? { onArrowNext: () => {
            this.next();
          }, onArrowPrev: () => this.prev() } : {}
        });
      }
    }
    this.wireAdvance(t, a?.element ?? null), this.startTracking(), this.stepEnteredAt = Date.now(), this.persistence.saveProgress(this.spec.id, t.id, n), this.opts.autoResume && this.persistence.setActive(this.spec.id, t.id), this.runActions(t.onEnter), this.emit("step-shown", { stepId: t.id, index: n, total: o.length });
  }
  showIndicator(t, e, s) {
    if (!this.layer) return;
    const i = this.viewportRect(s);
    if (this.popover && (this.popover.el.style.display = "none"), this.opts.renderIndicator && this.customHost) {
      this.indicatorActive = !0, this.customHost.style.display = "", this.customHost.classList.add("ot-custom-indicator"), this.customHost.style.position = "fixed", this.customHost.style.left = `${i.x + i.width / 2}px`, this.customHost.style.top = `${i.y + i.height / 2}px`, this.cleanupRender?.();
      const o = this.visibleSteps(), n = o.findIndex((c) => c.id === t.id), a = this.opts.renderIndicator(
        {
          ...this.renderContext(t, Math.max(0, n), o.length, this.blocks(t.content)),
          display: e
        },
        this.customHost
      );
      if (this.cleanupRender = typeof a == "function" ? a : null, e === "beacon") {
        const c = window.setTimeout(() => {
          this.next();
        }, t.duration ?? 5e3);
        this.cleanupAdvance = () => window.clearTimeout(c);
      }
      return;
    }
    if (this.customHost && (this.customHost.style.display = "none"), this.hotspot = new ne(), this.hotspot.render({
      display: e,
      content: Wt(this.blocks(t.content)),
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
      const n = this.renderContext(t, e, s, o), a = this.opts.renderStep(n, this.customHost);
      this.cleanupRender = typeof a == "function" ? a : null, this.customHost.style.display = "";
      return;
    }
    this.popover && (this.popover.el.style.display = "", this.popover.render(this.makeModel(t, e, s, o)));
  }
  /** Shared by `renderStep` and `renderIndicator`. */
  renderContext(t, e, s, i) {
    return {
      tourId: this.spec.id,
      step: t,
      index: e,
      total: s,
      title: this.text(t.title),
      blocks: i,
      canGoBack: t.canGoBack !== !1 && this.history.length > 0,
      canSkip: t.skippable !== !1,
      isLast: !t.next && e >= s - 1,
      next: () => {
        this.next();
      },
      prev: () => this.prev(),
      skip: () => this.skip("user"),
      goTo: (o) => this.goTo(o),
      context: this.context,
      setValue: (o, n) => this.setContext({ [o]: n }),
      canGoNext: this.canAdvance(t)
    };
  }
  /** Undo what `showIndicator` did to the shared custom host. */
  resetIndicatorHost() {
    this.indicatorActive && (this.indicatorActive = !1, this.customHost && (this.customHost.classList.remove("ot-custom-indicator"), this.customHost.style.position = "", this.customHost.style.left = "", this.customHost.style.top = "", this.opts.renderStep || (this.customHost.style.display = "none")));
  }
  interactiveHandlers() {
    return {
      getValue: (t) => this.context[t],
      setValue: (t, e, s) => {
        this.emit("interaction", {
          stepId: this.currentId ?? void 0,
          meta: s === "choice" ? { name: t, value: e } : { name: t }
        }), this.setContext({ [t]: e });
      },
      runAction: (t, e) => {
        this.emit("interaction", { stepId: this.currentId ?? void 0, meta: { button: e } }), this.runBlockAction(t);
      }
    };
  }
  runBlockAction(t) {
    if (t === "next") {
      this.next();
      return;
    }
    if (t === "prev") {
      this.prev();
      return;
    }
    if (t === "skip") {
      this.skip("user");
      return;
    }
    if (t === "complete") {
      this.complete("user");
      return;
    }
    if (t && typeof t == "object" && !Array.isArray(t) && "goTo" in t) {
      this.goTo(t.goTo);
      return;
    }
    this.runActions(Array.isArray(t) ? t : [t]);
  }
  /** Jump back to an already-visited step from its progress dot. */
  jumpTo(t) {
    if (this.status !== "running") return;
    const e = this.visibleSteps(), s = e[t], i = e.findIndex((n) => n.id === this.currentId);
    if (!s || t >= i || this.currentStep()?.canGoBack === !1) return;
    const o = this.history.lastIndexOf(s.id);
    o >= 0 && (this.history.length = o), this.emit("back", { stepId: s.id }), this.goToInternal(s.id, !1);
  }
  rerenderCurrent() {
    const t = this.currentStep();
    if (!t || this.indicatorActive || this.hotspot) return;
    const e = this.visibleSteps(), s = Math.max(0, e.findIndex((i) => i.id === t.id));
    this.renderStep(t, s, e.length), this.reposition();
  }
  makeModel(t, e, s, i) {
    const o = this.opts.locale ?? "en", n = this.opts.i18nResolver, a = (p, m) => m === !1 || m === void 0 ? $e(p, o, n) : this.text(m), c = t.buttons ?? {}, h = t.advanceOn ?? "button";
    return {
      stepId: t.id,
      title: this.text(t.title),
      blocks: i,
      index: e,
      total: s,
      canGoBack: t.canGoBack !== !1 && this.history.length > 0,
      skippable: t.skippable !== !1 && c.skip !== !1,
      isLast: !t.next && e >= s - 1,
      advanceOn: h,
      labels: {
        next: a("next", c.next),
        back: a("back", c.back),
        done: a("done", c.done),
        skip: a("skip", c.skip)
      },
      // With a non-button advance condition the primary button would be a
      // "skip this step" escape hatch; hide it unless the author asked for one.
      showNext: c.next !== !1 && (h === "button" || e >= s - 1),
      showBack: c.back !== !1,
      modal: (t.display ?? "spotlight") === "modal" || this.interactionFor(t) === "blocked",
      allowHtml: this.opts.allowHtml,
      density: this.densityFor(t),
      nextDisabled: !this.canAdvance(t),
      jumpable: Array.from({ length: s }, (p, m) => this.opts.dotNavigation !== !1 && t.canGoBack !== !1 && m < e),
      // An explicit width in the theme is a decision; auto-sizing must not undo it.
      fixedWidth: { ...this.opts.theme, ...this.spec.theme, ...t.theme }.popoverWidth !== void 0
    };
  }
  /** Step overrides spec, which overrides the global option. */
  densityFor(t) {
    return t.density ?? this.spec.density ?? this.opts.density ?? "comfortable";
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
        const o = Q(t.target);
        o && (this.resolved = o);
      }
      const i = this.viewportRect(this.resolved);
      if (this.indicatorActive && this.customHost)
        this.customHost.style.left = `${i.x + i.width / 2}px`, this.customHost.style.top = `${i.y + i.height / 2}px`, this.layer.setInteraction(this.interactionFor(t));
      else if (this.hotspot)
        this.hotspot.reposition(i), this.layer.setInteraction(this.interactionFor(t));
      else {
        const o = t.target?.all ? Vt(t.target).map((a) => this.viewportRect(a)) : [i], n = o.length > 1 ? Te(o) : i;
        this.layer.updateSpotlight(o.length > 0 ? o : i, e, this.mergedRadius()), s && this.popover?.position(n, t.placement ?? "auto", e);
      }
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
    const o = performance.now() + 900, n = () => {
      this.status === "running" && (this.reposition(), performance.now() < o && requestAnimationFrame(n));
    };
    requestAnimationFrame(n), this.cleanupTrack = () => {
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
        const o = t.event, n = () => i();
        window.addEventListener(o, n, { once: !0 }), this.cleanupAdvance = () => window.removeEventListener(o, n);
        return;
      }
      case "auto": {
        const o = window.setTimeout(i, t.duration ?? 3e3);
        this.cleanupAdvance = () => window.clearTimeout(o);
        return;
      }
      case "input-match": {
        if (!e || typeof t.match != "string") return;
        const o = t.match, n = (c) => {
          if (o.startsWith("/") && o.lastIndexOf("/") > 0) {
            const h = o.lastIndexOf("/");
            try {
              return new RegExp(o.slice(1, h), o.slice(h + 1)).test(c);
            } catch {
              return !1;
            }
          }
          return c === o;
        }, a = () => {
          const c = e.value ?? "";
          n(c) && i();
        };
        e.addEventListener("input", a), e.addEventListener("change", a), this.cleanupAdvance = () => {
          e.removeEventListener("input", a), e.removeEventListener("change", a);
        };
        return;
      }
      case "form-submit": {
        if (!e) return;
        const o = e.closest?.("form") ?? (e.tagName === "FORM" ? e : null);
        if (!o) return;
        const n = () => i();
        o.addEventListener("submit", n, { once: !0 }), this.cleanupAdvance = () => o.removeEventListener("submit", n);
        return;
      }
      case "element-appears": {
        if (typeof t.watch != "string") return;
        let o = !1;
        ct({ selector: t.watch, visible: !0 }, t.duration ?? 6e4).then((n) => {
          n && !o && i();
        }), this.cleanupAdvance = () => {
          o = !0;
        };
        return;
      }
      case "element-disappears": {
        if (typeof t.watch != "string") return;
        const o = t.watch, n = window.setInterval(() => {
          Q({ selector: o, visible: !0 }) || (window.clearInterval(n), i());
        }, 150);
        this.cleanupAdvance = () => window.clearInterval(n);
        return;
      }
      case "url-match": {
        if (typeof t.urlPattern != "string") return;
        const o = t.urlPattern, n = () => {
          Dt(o, Mt()) && i();
        }, a = Rt(n);
        this.cleanupAdvance = a, n();
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
            this.patchContext({ [s.key]: s.value }, { reactive: !1, notify: !0 });
            break;
          case "scrollTo": {
            Q({ selector: s.selector })?.element.scrollIntoView({ block: "center", behavior: "smooth" });
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
      const n = Ie[i];
      if (!n) continue;
      const a = Ne.has(i) ? `${o}px` : Me.has(i) ? `${o}ms` : String(o);
      e.setProperty(n, a), this.appliedVars.push(n);
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
    if (this.sampled())
      try {
        this.opts.onEvent?.(i);
      } catch {
      }
    try {
      window.dispatchEvent(new CustomEvent("opentutorial", { detail: i }));
    } catch {
    }
  }
  /** Cached per engine: one hash per tour, not one per event. */
  sampled() {
    const t = this.opts.sampleRate;
    return t === void 0 || t >= 1 ? !0 : (this.sampleDecision === null && (this.sampleDecision = Gt(this.spec?.id ?? "unknown", t)), this.sampleDecision);
  }
}
function Re(r, t) {
  if (!r || r.type === "manual") return { dispose: () => {
  } };
  const e = r.delay ?? 0, s = [], i = [];
  let o = !1;
  const n = r.once ?? !0, a = () => {
    o || (n && (o = !0), e > 0 ? s.push(window.setTimeout(t, e)) : t());
  };
  switch (r.type) {
    case "auto": {
      a();
      break;
    }
    case "event": {
      const c = () => a();
      window.addEventListener(r.event, c), i.push(() => window.removeEventListener(r.event, c));
      break;
    }
    case "route": {
      const c = () => {
        Dt(r.path, Mt(), r.exact) ? a() : n || (o = !1);
      };
      i.push(Rt(c)), c();
      break;
    }
    case "element": {
      let c = !1;
      ct({ selector: r.selector, visible: !0 }, r.timeout ?? 3e4).then((h) => {
        h && !c && a();
      }), i.push(() => {
        c = !0;
      });
      break;
    }
    case "idle": {
      let c = 0;
      const h = () => {
        window.clearTimeout(c), !o && (c = window.setTimeout(a, r.ms));
      }, p = ["pointerdown", "keydown", "scroll", "pointermove"];
      for (const m of p)
        window.addEventListener(m, h, { passive: !0 }), i.push(() => window.removeEventListener(m, h));
      i.push(() => window.clearTimeout(c)), h();
      break;
    }
    case "scroll": {
      const c = () => {
        const h = document.documentElement, p = h.scrollHeight - h.clientHeight;
        if (p <= 0) return;
        h.scrollTop / p * 100 >= r.percent && a();
      };
      window.addEventListener("scroll", c, { passive: !0 }), i.push(() => window.removeEventListener("scroll", c)), c();
      break;
    }
  }
  return {
    dispose: () => {
      s.forEach((c) => window.clearTimeout(c)), i.forEach((c) => {
        try {
          c();
        } catch {
        }
      });
    }
  };
}
class Ot {
  constructor(t, e = {}) {
    d(this, "engines", /* @__PURE__ */ new Map());
    d(this, "specs");
    d(this, "opts");
    d(this, "triggers", /* @__PURE__ */ new Map());
    /**
     * The one shared context. Engines hold mirrors of it, kept in step through
     * `applyContext`, so an answer given inside one tour is visible to the
     * audience rules, triggers and branches of every other.
     */
    d(this, "context");
    /** `context` triggers, with the last value of each expression for edge detection. */
    d(this, "contextTriggers", /* @__PURE__ */ new Map());
    d(this, "watchers", /* @__PURE__ */ new Set());
    d(this, "disposers", []);
    d(this, "queue", []);
    d(this, "activeId", null);
    d(this, "mounted", !1);
    /** Impressions in this page session, for `frequency.perSession`. */
    d(this, "sessionCounts", /* @__PURE__ */ new Map());
    this.specs = [...t], this.opts = e, this.context = { ...e.context ?? {} };
    for (const s of this.specs) this.createEngine(s);
  }
  createEngine(t) {
    const e = new qt(t, {
      ...this.opts,
      // The current shared context, not the construction-time one — a spec
      // added later must see everything set since.
      context: this.context,
      onEvent: (s) => this.handleEvent(s),
      onContextChange: (s, i) => this.onEngineContext(t.id, i)
    });
    return this.engines.set(t.id, e), e;
  }
  // -------------------------------------------------------------------------
  // Runtime spec management
  // -------------------------------------------------------------------------
  /**
   * Register a tour after construction — one fetched from a server, built by a
   * feature flag, or generated on the fly. Replaces any tour with the same id.
   * Returns false when the spec fails validation (it is still registered, so
   * `whyBlocked` can explain why it will not run).
   */
  addSpec(t) {
    this.engines.has(t.id) && this.removeSpec(t.id), this.specs.push(t);
    const e = this.createEngine(t);
    return this.mounted && e.ready.then(() => {
      this.mounted && this.engines.get(t.id) === e && this.installTriggerFor(t);
    }), this.notifyState(), e.isValid();
  }
  /** Unregister a tour, stopping it first if it is running. */
  removeSpec(t) {
    const e = this.engines.get(t);
    if (!e) return !1;
    const s = e.getState().status;
    return (s === "running" || s === "paused") && e.skip("removed"), this.triggers.get(t)?.dispose(), this.triggers.delete(t), this.contextTriggers.delete(t), this.queue = this.queue.filter((i) => i.tourId !== t), this.sessionCounts.delete(t), e.destroy(), this.engines.delete(t), this.specs = this.specs.filter((i) => i.id !== t), this.activeId === t && (this.activeId = null), this.notifyState(), !0;
  }
  notifyState() {
    const t = this.activeId ? this.engines.get(this.activeId)?.getState() ?? null : null;
    try {
      this.opts.onStateChange?.(this.activeId, t);
    } catch {
    }
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
    if (s.audience?.showIf && !V(s.audience.showIf, i))
      return "audience rule did not match";
    const o = s.frequency;
    if (o) {
      const n = e.getPersistence().getRecord(s.id);
      if (o.max !== void 0 && (n?.shownCount ?? 0) >= o.max)
        return `frequency: already shown ${o.max} time(s)`;
      if (o.cooldown !== void 0 && n?.lastShownAt) {
        const a = Date.now() - n.lastShownAt;
        if (a < o.cooldown) return `frequency: cooldown active (${o.cooldown - a}ms left)`;
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
    const e = {};
    for (const [s, i] of Object.entries(t))
      Object.is(this.context[s], i) || (e[s] = i);
    Object.keys(e).length !== 0 && (Object.assign(this.context, e), this.engines.forEach((s) => s.applyContext(e)), this.afterContextChange(e));
  }
  /** The shared tour context. */
  getContext() {
    return this.context;
  }
  /** A change that started inside one engine — an interactive block or an action. */
  onEngineContext(t, e) {
    Object.assign(this.context, e), this.engines.forEach((s, i) => {
      i !== t && s.applyContext(e);
    }), this.afterContextChange(e);
  }
  afterContextChange(t) {
    try {
      this.opts.onContextChange?.(this.context, t);
    } catch {
    }
    for (const e of this.watchers) {
      const s = vt(e.expr, this.context);
      if (Object.is(s, e.last)) continue;
      const i = e.last;
      e.last = s;
      try {
        e.fn(s, i);
      } catch {
      }
    }
    for (const e of this.contextTriggers.values()) {
      const s = V(e.when, this.context), i = s && !e.last;
      e.last = s, i && e.fire();
    }
  }
  /**
   * Observe an expression over the context. `fn` runs whenever its value
   * changes — `watch("cart.length", n => badge.update(n))`. Returns an
   * unsubscribe function.
   */
  watch(t, e) {
    const s = { expr: t, last: vt(t, this.context), fn: e };
    return this.watchers.add(s), () => {
      this.watchers.delete(s);
    };
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
  /** Snapshot persisted state for every tour. See `TourEngine.exportProgress`. */
  exportProgress() {
    return this.engines.values().next().value?.exportProgress() ?? null;
  }
  /** Restore a snapshot. All engines share one store, so one call covers them all. */
  importProgress(t, e = "replace") {
    return this.engines.values().next().value?.importProgress(t, e) ?? !1;
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
    for (const t of this.specs) this.installTriggerFor(t);
  }
  installTriggerFor(t) {
    const e = this.engines.get(t.id);
    if (!e || !e.isValid()) return;
    const s = t.trigger;
    if (!s || s.type === "manual") return;
    const i = s.once ?? !0;
    if (i && e.hasSeen()) return;
    const o = () => {
      i && e.hasSeen() || this.request(t.id);
    };
    if (s.type === "context") {
      let n = 0;
      const a = () => {
        window.clearTimeout(n), s.delay && s.delay > 0 ? n = window.setTimeout(o, s.delay) : o();
      }, c = V(s.when, this.context);
      this.contextTriggers.set(t.id, { when: s.when, last: c, fire: a }), this.triggers.set(t.id, { dispose: () => window.clearTimeout(n) }), c && a();
      return;
    }
    this.triggers.set(t.id, Re(s, o));
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
    }), this.triggers.clear(), this.contextTriggers.clear(), this.watchers.clear(), this.disposers = [], this.queue = [], this.engines.forEach((t) => t.destroy()), this.activeId = null;
  }
}
function Ue(r, t = {}) {
  return new qt(r, t);
}
function Ye(r, t = {}) {
  return new Ot(r, t);
}
function Xe(r) {
  return r;
}
function Ke(r) {
  return r;
}
function Je(r, t) {
  const { steps: e, ...s } = t;
  return {
    ...r,
    ...s,
    steps: r.steps.map((i) => e?.[i.id] ? { ...i, ...e[i.id] } : i)
  };
}
function Be(r) {
  return r.map((t) => typeof t == "string" ? { name: t, weight: 1 } : { name: t.name, weight: t.weight ?? 1 });
}
function Pe(r, t, e, s = {}) {
  const i = Be(e).filter((h) => h.weight > 0);
  if (i.length === 0) return null;
  const o = s.holdout ?? 0;
  if (o > 0 && yt(`holdout:${r}:${t}`) < o) return null;
  const n = i.reduce((h, p) => h + p.weight, 0), a = yt(`${r}:${t}`) * n;
  let c = 0;
  for (const h of i)
    if (c += h.weight, a < c) return h.name;
  return i[i.length - 1].name;
}
function Qe(r, t) {
  const e = {};
  for (const [s, i] of Object.entries(t)) {
    const { variants: o, holdout: n } = Array.isArray(i) ? { variants: i, holdout: void 0 } : i;
    e[s] = Pe(s, r, o, { holdout: n });
  }
  return e;
}
function Ze(r = {}) {
  const { days: t = 365, path: e = "/", domain: s, sameSite: i = "Lax", secure: o } = r, n = () => {
    const c = {};
    if (typeof document > "u") return c;
    for (const h of document.cookie.split(";")) {
      const p = h.indexOf("=");
      p < 0 || (c[decodeURIComponent(h.slice(0, p).trim())] = decodeURIComponent(h.slice(p + 1)));
    }
    return c;
  }, a = (c, h, p) => {
    if (typeof document > "u") return;
    const m = [
      `${encodeURIComponent(c)}=${encodeURIComponent(h)}`,
      `path=${e}`,
      `max-age=${Math.floor(p * 86400)}`,
      `SameSite=${i}`
    ];
    s && m.push(`domain=${s}`), (o ?? i === "None") && m.push("Secure"), document.cookie = m.join("; ");
  };
  return {
    getItem: (c) => n()[c] ?? null,
    setItem: (c, h) => a(c, h, t),
    removeItem: (c) => a(c, "", -1)
  };
}
function ts(r = "opentutorial", t = "kv") {
  const e = new it();
  if (typeof indexedDB > "u") return e;
  let s = null;
  const i = () => s || (s = new Promise((n) => {
    try {
      const a = indexedDB.open(r, 1);
      a.onupgradeneeded = () => {
        const c = a.result;
        c.objectStoreNames.contains(t) || c.createObjectStore(t);
      }, a.onsuccess = () => n(a.result), a.onerror = () => n(null), a.onblocked = () => n(null);
    } catch {
      n(null);
    }
  }), s), o = async (n, a) => {
    const c = await i();
    return c ? new Promise((h) => {
      try {
        const p = c.transaction(t, n), m = a(p.objectStore(t));
        m.onsuccess = () => h(m.result), m.onerror = () => h(null);
      } catch {
        h(null);
      }
    }) : null;
  };
  return {
    getItem(n) {
      const a = e.getItem(n);
      return a !== null ? a : o("readonly", (c) => c.get(n)).then((c) => (typeof c == "string" && e.setItem(n, c), typeof c == "string" ? c : null));
    },
    setItem(n, a) {
      e.setItem(n, a), o("readwrite", (c) => c.put(a, n));
    },
    removeItem(n) {
      e.removeItem(n), o("readwrite", (a) => a.delete(n));
    }
  };
}
function es(r) {
  const {
    endpoint: t,
    headers: e,
    debounceMs: s = 400,
    fetchImpl: i,
    onError: o
  } = r, n = r.cache === !1 ? new it() : r.cache ?? Bt(), a = i ?? (typeof fetch == "function" ? fetch.bind(globalThis) : void 0), c = t.replace(/\/$/, ""), h = (f) => `${c}/${encodeURIComponent(f)}`, p = () => ({
    "content-type": "application/json",
    ...typeof e == "function" ? e() : e ?? {}
  }), m = /* @__PURE__ */ new Map();
  let u = null;
  const k = async () => {
    if (!a || m.size === 0) return;
    const f = [...m.entries()];
    m.clear();
    for (const [w, v] of f)
      try {
        const x = await a(h(w), {
          method: v === null ? "DELETE" : "PUT",
          headers: p(),
          body: v === null ? void 0 : JSON.stringify({ value: v }),
          credentials: "include"
        });
        if (!x.ok) throw new Error(`HTTP ${x.status}`);
      } catch (x) {
        m.has(w) || m.set(w, v), o?.(x, v === null ? "delete" : "put", w);
      }
  }, l = () => {
    u && clearTimeout(u), u = setTimeout(() => {
      u = null, k();
    }, s);
  };
  return typeof window < "u" && (window.addEventListener("online", () => {
    k();
  }), window.addEventListener("pagehide", () => {
    k();
  })), {
    getItem(f) {
      const w = n.getItem(f);
      return w ?? (a ? a(h(f), { headers: p(), credentials: "include" }).then((v) => v.ok ? v.json() : null).then((v) => {
        const x = v?.value ?? null;
        return typeof x == "string" && n.setItem(f, x), x;
      }).catch((v) => (o?.(v, "get", f), null)) : null);
    },
    setItem(f, w) {
      n.setItem(f, w), m.set(f, w), l();
    },
    removeItem(f) {
      n.removeItem(f), m.set(f, null), l();
    }
  };
}
const qe = {
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
function ss(r) {
  const { specs: t, autoMount: e = !0, storage: s, keyPrefix: i, ...o } = r, n = /* @__PURE__ */ new Map(), a = s !== void 0 || i !== void 0 ? { storage: s, keyPrefix: i, ...o.persistence ?? {} } : o.persistence, c = (l, f) => {
    const w = n.get(l);
    if (w)
      for (const v of w)
        try {
          v(f);
        } catch {
        }
  }, h = /* @__PURE__ */ new Set();
  let p = { activeId: null, state: null, context: o.context ?? {} };
  const m = (l) => {
    p = l;
    for (const f of h)
      try {
        f(p);
      } catch {
      }
  }, u = new Ot(t, {
    ...o,
    persistence: a,
    onStateChange: (l, f) => {
      m({ activeId: l, state: f, context: p.context }), o.onStateChange?.(l, f);
    },
    onContextChange: (l, f) => {
      m({ ...p, context: { ...l } }), o.onContextChange?.(l, f);
    },
    onEvent: (l) => {
      c("event", l);
      for (const [f, w] of Object.entries(qe))
        w.includes(l.type) && c(f, l);
      o.onEvent?.(l);
    }
  });
  p = { ...p, context: { ...u.getContext() } }, e && u.mount();
  const k = (l) => {
    const f = u.getActiveId();
    if (!f) return;
    const w = u.getEngine(f);
    w && l(w);
  };
  return {
    start: (l, f) => u.start(l, f),
    request: (l, f) => u.request(l, f),
    stop: () => u.stop("api"),
    skip: (l) => {
      l ? u.getEngine(l)?.skip("api") : u.stop("api");
    },
    pause: () => u.pause(),
    resume: () => u.resume(),
    next: () => k((l) => {
      l.next();
    }),
    prev: () => k((l) => l.prev()),
    goTo: (l) => k((f) => f.goTo(l)),
    getState: (l) => u.getState(l),
    getActiveId: () => u.getActiveId(),
    getSpecs: () => u.getSpecs(),
    hasSeen: (l) => u.hasSeen(l),
    whyBlocked: (l) => u.checkEligibility(l),
    getContext: () => u.getContext(),
    setContext: (l) => u.setContext(l),
    setTheme: (l) => u.setTheme(l),
    setLocale: (l) => u.setLocale(l),
    setUser: (l) => u.setUser(l),
    reset: () => u.reset(),
    resetTour: (l) => u.resetTour(l),
    resetProgress: () => u.resetProgress(),
    exportProgress: () => u.exportProgress(),
    importProgress: (l, f) => u.importProgress(l, f),
    getEngine: (l) => u.getEngine(l),
    addSpec: (l) => u.addSpec(l),
    removeSpec: (l) => u.removeSpec(l),
    store: {
      subscribe(l) {
        h.add(l);
        try {
          l(p);
        } catch {
        }
        return () => {
          h.delete(l);
        };
      },
      getSnapshot: () => p
    },
    watchContext: (l, f) => u.watch(l, f),
    dispatch(l) {
      switch (l?.type) {
        case "start":
          return u.start(l.tourId, l.stepId), !0;
        case "request":
          return u.request(l.tourId, l.stepId), !0;
        case "stop":
          return u.stop("api"), !0;
        case "next":
          return k((f) => {
            f.next();
          }), !0;
        case "prev":
          return k((f) => f.prev()), !0;
        case "goTo":
          return k((f) => f.goTo(l.stepId)), !0;
        case "pause":
          return u.pause(), !0;
        case "resume":
          return u.resume(), !0;
        case "setContext":
          return u.setContext(l.patch ?? {}), !0;
        case "addSpec":
          return u.addSpec(l.spec), !0;
        case "removeSpec":
          return u.removeSpec(l.tourId), !0;
        case "reset":
          return l.tourId ? u.resetTour(l.tourId) : u.reset(), !0;
        default:
          return !1;
      }
    },
    get ready() {
      return u.ready;
    },
    on(l, f) {
      return n.has(l) || n.set(l, /* @__PURE__ */ new Set()), n.get(l).add(f), () => this.off(l, f);
    },
    off(l, f) {
      n.get(l)?.delete(f);
    },
    destroy() {
      c("destroy", {
        type: "skipped",
        tourId: u.getActiveId() ?? "",
        reason: "destroy",
        timestamp: Date.now()
      }), u.destroy(), n.clear(), h.clear();
    }
  };
}
function g(r, t, e = {}) {
  const s = document.createElement(r);
  t && (s.className = t);
  const { text: i, html: o, ...n } = e;
  return i !== void 0 && (s.textContent = i), o !== void 0 && (s.innerHTML = o), Object.assign(s, n), s;
}
function G(r, t, e) {
  const s = g("button", r, { type: "button", text: t });
  return s.addEventListener("click", e), s;
}
class U {
  constructor() {
    d(this, "fns", []);
  }
  add(t) {
    this.fns.push(t);
  }
  listen(t, e, s, i) {
    t.addEventListener(e, s, i), this.fns.push(() => t.removeEventListener(e, s, i));
  }
  run() {
    for (const t of this.fns)
      try {
        t();
      } catch {
      }
    this.fns = [];
  }
}
class mt {
  constructor(t, e, s) {
    d(this, "ready");
    d(this, "persistence");
    this.persistence = new Pt(t, e, s), this.ready = this.persistence.ready;
  }
  /** True when the surface should be shown. */
  shouldShow(t, e = {}) {
    const { once: s = !0, resurfaceAfter: i } = e;
    if (!s) return !0;
    const o = this.persistence.getRecord(t);
    return o?.at ? i === void 0 ? !1 : Date.now() - o.at > i : !0;
  }
  markDismissed(t) {
    this.persistence.mark(t, "skipped");
  }
  markActed(t) {
    this.persistence.mark(t, "completed");
  }
  reset(t) {
    this.persistence.reset(t);
  }
}
function Y(r, t) {
  t !== null && (t ?? document.body).appendChild(r);
}
function X(r, t) {
  return {
    el: r,
    mount(e) {
      (e ?? document.body).appendChild(r);
    },
    destroy() {
      t.run(), r.remove();
    }
  };
}
function is(r) {
  const {
    id: t,
    message: e,
    position: s = "top",
    action: i,
    dismissible: o = !0,
    resurfaceAfter: n,
    storage: a,
    keyPrefix: c = "ot-banner",
    userId: h,
    container: p,
    className: m = "",
    onDismiss: u
  } = r, k = new U(), l = new mt(a, c, h), f = g("div", `ot-banner ot-banner--${s} ${m}`.trim());
  f.setAttribute("role", "status"), f.hidden = !0;
  const w = g("span", "ot-banner-content", { html: st(e) });
  f.appendChild(w), i && f.appendChild(G("ot-banner-action", i.label, i.onClick));
  const v = () => {
    l.markDismissed(t), f.hidden = !0, u?.();
  };
  if (o) {
    const y = G("ot-banner-dismiss", "×", v);
    y.setAttribute("aria-label", "Dismiss"), f.appendChild(y);
  }
  Y(f, p);
  let x = !0;
  return k.add(() => {
    x = !1;
  }), l.ready.then(() => {
    x && (f.hidden = !l.shouldShow(t, { resurfaceAfter: n }));
  }), {
    ...X(f, k),
    setMessage(y) {
      w.innerHTML = st(y);
    },
    dismiss: v
  };
}
function ns(r) {
  const {
    id: t,
    title: e,
    content: s,
    once: i = !0,
    primaryAction: o,
    secondaryAction: n,
    dismissible: a = !0,
    allowHtml: c,
    locale: h = "en",
    i18nResolver: p,
    storage: m,
    keyPrefix: u = "ot-announce",
    userId: k,
    container: l,
    className: f = "",
    onDismiss: w
  } = r, v = new U(), x = new mt(m, u, k), y = g("div", "ot-root");
  y.setAttribute("data-opentutorial", ""), y.hidden = !0;
  const E = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  E.setAttribute("class", "ot-backdrop"), E.setAttribute("width", "100%"), E.setAttribute("height", "100%"), E.setAttribute("aria-hidden", "true");
  const I = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  I.setAttribute("class", "ot-dim"), I.setAttribute("width", "100%"), I.setAttribute("height", "100%"), E.appendChild(I);
  const M = `ot-announce-${t}`, N = g("div", `ot-popover ot-modal ot-popover--modal-step ${f}`.trim());
  N.setAttribute("role", "dialog"), N.setAttribute("aria-modal", "true"), N.setAttribute("aria-labelledby", M), N.style.left = "50%", N.style.top = "50%", N.style.transform = "translate(-50%, -50%)";
  const T = g("div", "ot-body"), A = (b) => {
    i && (b ? x.markActed(t) : x.markDismissed(t)), y.hidden = !0, b || w?.();
  };
  if (a) {
    const b = G("ot-skip", "×", () => A(!1));
    b.setAttribute("aria-label", "Dismiss"), T.appendChild(b);
  }
  const B = g("h2", "ot-title", { text: e });
  B.id = M, T.appendChild(B);
  const P = g("div", "ot-content-wrap"), q = ut(s, (b) => tt(b, h, p));
  P.appendChild(dt(q, { allowHtml: c })), T.appendChild(P);
  const C = g("div", "ot-footer");
  C.appendChild(g("span"));
  const S = g("div", "ot-btns");
  n && S.appendChild(G("ot-btn ot-btn-ghost", n.label, () => {
    A(!0), n.onClick();
  })), S.appendChild(G("ot-btn ot-btn-primary", o?.label ?? "Got it", () => {
    A(!0), o?.onClick();
  })), C.appendChild(S), T.appendChild(C), N.appendChild(T), y.appendChild(E), y.appendChild(N), Y(y, l), a && v.listen(window, "keydown", (b) => {
    !y.hidden && b.key === "Escape" && A(!1);
  });
  let $ = !0;
  return v.add(() => {
    $ = !1;
  }), x.ready.then(() => {
    $ && (y.hidden = !x.shouldShow(t, { once: i }), y.hidden || N.focus?.());
  }), {
    ...X(y, v),
    close: () => A(!1)
  };
}
function rs(r) {
  const {
    target: t,
    content: e,
    glyph: s = "?",
    openOnHover: i = !1,
    zIndex: o,
    container: n,
    className: a = ""
  } = r, c = new U(), h = typeof t == "string" ? { selector: t } : t, p = g("div", `ot-hint ${a}`.trim());
  o !== void 0 && (p.style.zIndex = String(o)), p.hidden = !0;
  const m = g("button", "ot-hint-dot", { type: "button", text: s });
  m.setAttribute("aria-expanded", "false"), m.setAttribute("aria-label", "Show hint");
  const u = g("div", "ot-hint-panel", { html: st(e) });
  u.setAttribute("role", "tooltip"), u.hidden = !0;
  const k = (v) => {
    u.hidden = !v, m.setAttribute("aria-expanded", String(v)), m.setAttribute("aria-label", v ? "Hide hint" : "Show hint");
  };
  m.addEventListener("click", () => k(u.hidden)), i && (p.addEventListener("mouseenter", () => k(!0)), p.addEventListener("mouseleave", () => k(!1))), p.appendChild(m), p.appendChild(u), Y(p, n);
  let l = 0;
  const f = () => {
    const v = Q(h);
    if (!v) {
      p.hidden = !0;
      return;
    }
    const x = v.element.getBoundingClientRect();
    p.hidden = !1, p.style.left = `${x.x + v.frameOffset.x + x.width}px`, p.style.top = `${x.y + v.frameOffset.y}px`;
  }, w = () => {
    cancelAnimationFrame(l), l = requestAnimationFrame(f);
  };
  if (f(), c.listen(window, "resize", w), c.listen(window, "scroll", w, { capture: !0 }), c.add(() => cancelAnimationFrame(l)), typeof ResizeObserver < "u") {
    const v = new ResizeObserver(w);
    v.observe(document.documentElement), c.add(() => v.disconnect());
  }
  return {
    ...X(p, c),
    open: () => k(!0),
    close: () => k(!1),
    reposition: f
  };
}
function os(r) {
  const {
    id: t,
    kind: e = "nps",
    question: s,
    options: i = [],
    lowLabel: o = "Not likely",
    highLabel: n = "Very likely",
    followUp: a,
    submitLabel: c = "Submit",
    dismissLabel: h = "Not now",
    thanksMessage: p = "Thanks for the feedback!",
    container: m,
    className: u = "",
    onSubmit: k,
    onDismiss: l
  } = r, f = new U();
  let w = null, v = null;
  const x = g("div", `ot-survey ${u}`.trim()), y = `ot-survey-q-${t}`, E = g("p", "ot-survey-question", { text: s });
  E.id = y, x.appendChild(E);
  const I = e === "nps" ? Array.from({ length: 11 }, (C, S) => S) : e === "rating" ? [1, 2, 3, 4, 5] : null, M = [], N = [], T = g("textarea", "ot-survey-textarea");
  T.placeholder = e === "text" ? s : a ?? "", T.setAttribute("aria-label", e === "text" ? s : a ?? "Additional comments"), T.hidden = e !== "text";
  const A = g("button", "ot-btn ot-btn-primary", { type: "button", text: c }), B = () => {
    for (const S of M) {
      const $ = Number(S.dataset.value) === w;
      S.classList.toggle("ot-survey-score--selected", $), S.setAttribute("aria-checked", String($));
    }
    for (const S of N) {
      const $ = S.dataset.value === v;
      S.classList.toggle("ot-survey-option--selected", $), S.setAttribute("aria-checked", String($));
    }
    a && e !== "text" && (T.hidden = w === null && v === null);
    const C = e === "nps" || e === "rating" ? w !== null : e === "choice" ? v !== null : T.value.trim().length > 0;
    A.disabled = !C;
  };
  if (I) {
    const C = g("div", "ot-survey-scale");
    C.setAttribute("role", "radiogroup"), C.setAttribute("aria-labelledby", y);
    for (const $ of I) {
      const b = g("button", "ot-survey-score", { type: "button", text: String($) });
      b.dataset.value = String($), b.setAttribute("role", "radio"), b.setAttribute("aria-checked", "false"), b.addEventListener("click", () => {
        w = $, B();
      }), M.push(b), C.appendChild(b);
    }
    x.appendChild(C);
    const S = g("div", "ot-survey-labels");
    S.appendChild(g("span", void 0, { text: o })), S.appendChild(g("span", void 0, { text: n })), x.appendChild(S);
  }
  if (e === "choice") {
    const C = g("div", "ot-survey-options");
    C.setAttribute("role", "radiogroup"), C.setAttribute("aria-labelledby", y);
    for (const S of i) {
      const $ = g("button", "ot-survey-option", { type: "button", text: S });
      $.dataset.value = S, $.setAttribute("role", "radio"), $.setAttribute("aria-checked", "false"), $.addEventListener("click", () => {
        v = S, B();
      }), N.push($), C.appendChild($);
    }
    x.appendChild(C);
  }
  x.appendChild(T), T.addEventListener("input", B);
  const P = g("div", "ot-footer");
  l ? P.appendChild(G("ot-btn ot-btn-ghost", h, l)) : P.appendChild(g("span")), P.appendChild(A), x.appendChild(P);
  const q = () => ({
    surveyId: t,
    kind: e,
    score: w ?? void 0,
    choice: v ?? void 0,
    comment: T.value.trim() || void 0
  });
  return A.addEventListener("click", () => {
    A.disabled || (k({ ...q(), submittedAt: Date.now() }), x.replaceChildren(g("p", "ot-survey-thanks", { text: p })));
  }), B(), Y(x, m), {
    ...X(x, f),
    getResponse: q,
    reset() {
      w = null, v = null, T.value = "", B();
    }
  };
}
function as(r) {
  const {
    layer: t,
    specs: e,
    getStatus: s,
    onStart: i,
    title: o = "Onboarding",
    startLabel: n = "Start",
    runningLabel: a = "Running",
    floating: c = !1,
    collapsible: h = !1,
    defaultCollapsed: p = !1,
    hideWhenComplete: m = !1,
    locale: u = "en",
    i18nResolver: k,
    container: l,
    className: f = "",
    onComplete: w
  } = r, v = new U();
  let x = p, y = !1;
  const E = g("div", "ot-checklist"), I = g("ul", "ot-checklist-items"), M = g("div", "ot-checklist-bar-track"), N = g("div", "ot-checklist-bar-fill"), T = g("span", "ot-checklist-count"), A = g("button", "ot-checklist-toggle", { type: "button" });
  if (M.setAttribute("role", "progressbar"), M.setAttribute("aria-valuemin", "0"), M.setAttribute("aria-valuemax", "100"), M.appendChild(N), o) {
    const b = g("div", "ot-checklist-header");
    b.appendChild(g("h3", "ot-checklist-title", { text: o })), b.appendChild(T), h && (A.addEventListener("click", () => $(!x)), b.appendChild(A)), E.appendChild(b);
  }
  E.appendChild(M), E.appendChild(I);
  const B = () => e ?? t.getSpecs(), P = (b) => s ? s(b) : t.getActiveId() === b ? "in_progress" : t.hasSeen(b) ? "completed" : "pending", q = (b) => b === void 0 ? "" : tt(b, u, k, t.getContext());
  let C = { completed: 0, total: 0, percent: 0 };
  const S = () => {
    const b = B(), F = b.map((H) => P(H.id)), L = F.filter((H) => H === "completed").length, R = b.length > 0 ? Math.round(L / b.length * 100) : 0;
    C = { completed: L, total: b.length, percent: R }, T.textContent = `${L}/${b.length}`, N.style.width = `${R}%`, M.setAttribute("aria-valuenow", String(R)), M.setAttribute("aria-label", `${L} of ${b.length} complete`), I.replaceChildren(), b.forEach((H, K) => {
      const _ = F[K], J = g("li", `ot-checklist-item ot-checklist-item--${_}`), j = g("span", "ot-checklist-icon", {
        text: _ === "completed" ? "✓" : _ === "in_progress" ? "◌" : "○"
      });
      j.setAttribute("aria-hidden", "true"), J.appendChild(j);
      const nt = g("div", "ot-checklist-info");
      nt.appendChild(g("span", "ot-checklist-name", { text: q(H.title) }));
      const gt = q(H.description);
      if (gt && nt.appendChild(g("span", "ot-checklist-desc", { text: gt })), J.appendChild(nt), _ !== "completed") {
        const rt = g("button", "ot-checklist-btn", {
          type: "button",
          text: _ === "in_progress" ? a : n
        });
        rt.disabled = _ === "in_progress", rt.addEventListener("click", () => {
          i ? i(H.id) : t.start(H.id);
        }), J.appendChild(rt);
      }
      I.appendChild(J);
    });
    const W = b.length > 0 && L === b.length;
    W && !y && (y = !0, w?.()), W || (y = !1), E.hidden = W && m, E.className = [
      "ot-checklist",
      c ? "ot-checklist--floating" : "",
      x ? "ot-checklist--collapsed" : "",
      f
    ].filter(Boolean).join(" ");
  };
  function $(b) {
    x = b, A.textContent = x ? "▸" : "▾", A.setAttribute("aria-expanded", String(!x)), A.setAttribute("aria-label", x ? "Expand checklist" : "Collapse checklist"), S();
  }
  return $(x), Y(E, l), v.add(t.on("event", S)), {
    ...X(E, v),
    refresh: S,
    setCollapsed: $,
    getProgress: () => C
  };
}
function cs(r) {
  const {
    layer: t,
    specs: e,
    links: s = [],
    title: i = "Help & guides",
    searchPlaceholder: o = "Search…",
    floating: n = !1,
    launcherGlyph: a = "?",
    emptyMessage: c = "Nothing matches that search.",
    locale: h = "en",
    i18nResolver: p,
    container: m,
    className: u = ""
  } = r, k = new U();
  let l = !n, f = "";
  const w = g("div", "ot-hub-root"), v = g("div", `ot-hub ${n ? "ot-hub--floating" : ""} ${u}`.trim()), x = g("div", "ot-hub-header");
  x.appendChild(g("h3", "ot-hub-title", { text: i }));
  const y = g("input", "ot-hub-search");
  y.type = "search", y.placeholder = o, y.setAttribute("aria-label", o), x.appendChild(y), v.appendChild(x);
  const E = g("ul", "ot-hub-list");
  v.appendChild(E), w.appendChild(v);
  const I = g("button", "ot-hub-launcher", { type: "button", text: a });
  n && (I.setAttribute("aria-label", i), w.appendChild(I));
  const M = (A) => A === void 0 ? "" : tt(A, h, p, t.getContext()), N = () => {
    if (v.hidden = !l, n && (I.textContent = l ? "×" : a, I.setAttribute("aria-label", l ? "Close help" : i), I.setAttribute("aria-expanded", String(l))), !l) return;
    const A = f.trim().toLowerCase(), B = e ?? t.getSpecs(), P = (C, S) => !A || C.toLowerCase().includes(A) || S.toLowerCase().includes(A);
    E.replaceChildren();
    let q = 0;
    for (const C of B) {
      const S = M(C.title), $ = M(C.description);
      if (!P(S, $)) continue;
      q += 1;
      const b = g("li"), F = g("button", "ot-hub-item", {
        type: "button",
        text: `${t.hasSeen(C.id) ? "↻ " : ""}${S}`
      });
      $ && F.appendChild(g("span", "ot-hub-item-desc", { text: $ })), F.addEventListener("click", () => {
        t.start(C.id), n && T(!1);
      }), b.appendChild(F), E.appendChild(b);
    }
    for (const C of s) {
      const S = C.description ?? "";
      if (!P(C.label, S)) continue;
      q += 1;
      const $ = g("li"), b = g("a", "ot-hub-item", { text: `${C.label} ↗` });
      b.href = C.href, b.target = "_blank", b.rel = "noopener noreferrer", S && b.appendChild(g("span", "ot-hub-item-desc", { text: S })), $.appendChild(b), E.appendChild($);
    }
    q === 0 && E.appendChild(g("li", "ot-hub-empty", { text: c }));
  };
  function T(A) {
    l = A, N();
  }
  return y.addEventListener("input", () => {
    f = y.value, N();
  }), I.addEventListener("click", () => T(!l)), N(), Y(w, m), k.add(t.on("event", () => {
    l && N();
  })), {
    ...X(w, k),
    open: () => T(!0),
    close: () => T(!1),
    search(A) {
      f = A, y.value = A, N();
    },
    refresh: N
  };
}
function ls(r) {
  const {
    entries: t,
    title: e = "What's new",
    floating: s = !0,
    launcherGlyph: i = "✦",
    emptyMessage: o = "Nothing new right now.",
    limit: n = 20,
    allowHtml: a,
    locale: c = "en",
    i18nResolver: h,
    storage: p,
    keyPrefix: m = "ot-changelog",
    userId: u,
    container: k,
    className: l = "",
    onRead: f
  } = r, w = new U(), v = new mt(p, m, u);
  let x = t, y = !s, E = !1;
  const I = g("div", "ot-changelog-root"), M = g("div", `ot-changelog ${s ? "ot-changelog--floating" : ""} ${l}`.trim());
  M.setAttribute("role", "region"), M.setAttribute("aria-label", e);
  const N = g("div", "ot-changelog-header");
  N.appendChild(g("h3", "ot-changelog-title", { text: e })), M.appendChild(N);
  const T = g("ul", "ot-changelog-list");
  M.appendChild(T), I.appendChild(M);
  const A = g("button", "ot-changelog-launcher", { type: "button" }), B = g("span", "ot-changelog-badge");
  if (B.setAttribute("aria-hidden", "true"), s)
    A.appendChild(g("span", "ot-changelog-glyph", { text: i })), A.appendChild(B), I.appendChild(A);
  else {
    const L = G("ot-changelog-close", "×", () => b(!1));
    L.setAttribute("aria-label", "Close"), N.appendChild(L);
  }
  const P = () => x.slice(0, n), q = () => E ? P().filter((L) => v.shouldShow(L.id)).map((L) => L.id) : [], C = () => {
    const L = q().length;
    B.textContent = L > 99 ? "99+" : String(L), B.hidden = L === 0, A.setAttribute(
      "aria-label",
      L > 0 ? `${e} (${L} unread)` : e
    ), A.setAttribute("aria-expanded", String(y));
  }, S = () => {
    T.replaceChildren();
    const L = P();
    if (L.length === 0) {
      T.appendChild(g("li", "ot-changelog-empty", { text: o }));
      return;
    }
    for (const R of L) {
      const W = E && v.shouldShow(R.id), H = g("li", `ot-changelog-item${W ? " ot-changelog-item--unread" : ""}`), K = g("div", "ot-changelog-meta");
      if (R.tag && K.appendChild(g("span", "ot-changelog-tag", { text: R.tag })), R.date) {
        const j = g("time", "ot-changelog-date", { text: R.date });
        j.dateTime = R.date, K.appendChild(j);
      }
      K.childElementCount > 0 && H.appendChild(K), H.appendChild(g("h4", "ot-changelog-entry-title", { text: R.title }));
      const _ = g("div", "ot-changelog-body"), J = ut(R.content, (j) => tt(j, c, h));
      if (_.appendChild(dt(J, { allowHtml: a })), H.appendChild(_), R.href) {
        const j = g("a", "ot-changelog-link", { text: "Read more ↗" });
        j.href = R.href, j.target = "_blank", j.rel = "noopener noreferrer", H.appendChild(j);
      }
      T.appendChild(H);
    }
  }, $ = () => {
    M.hidden = !y, C(), y && S();
  };
  function b(L) {
    if (y = L, M.hidden = !y, y) {
      const R = q();
      if (S(), R.length > 0) {
        for (const W of R) v.markActed(W);
        f?.(R);
      }
    }
    C();
  }
  A.addEventListener("click", () => b(!y)), Y(I, k), $();
  let F = !0;
  return w.add(() => {
    F = !1;
  }), v.ready.then(() => {
    F && (E = !0, $());
  }), {
    ...X(I, w),
    open: () => b(!0),
    close: () => b(!1),
    unread: q,
    markAllRead() {
      for (const L of P()) v.markActed(L.id);
      $();
    },
    setEntries(L) {
      x = L, $();
    }
  };
}
export {
  Ft as CSS,
  Ae as DEFAULT_LABELS,
  it as MemoryStorage,
  mt as SurfaceState,
  qt as TourEngine,
  Ot as TourOrchestrator,
  Pt as TourPersistence,
  _e as assertValidSpec,
  Qe as assignAll,
  Pe as assignVariant,
  Wt as blocksToText,
  _t as checkExpression,
  ws as createAmplitudeAdapter,
  ns as createAnnouncement,
  is as createBanner,
  ls as createChangelog,
  as as createChecklist,
  Ze as createCookieStorage,
  xs as createDatadogAdapter,
  ks as createDebugAdapter,
  Es as createEventCollector,
  Ss as createFunnelReport,
  As as createGA4Adapter,
  $s as createHeapAdapter,
  rs as createHint,
  Cs as createHttpAdapter,
  ts as createIndexedDBStorage,
  We as createKeyResolver,
  Ve as createLocaleResolver,
  Fe as createMemoryStorage,
  Is as createMixpanelAdapter,
  Ts as createMultiAdapter,
  Ls as createPostHogAdapter,
  es as createRemoteStorage,
  cs as createResourceCenter,
  Ns as createRudderStackAdapter,
  Ms as createSegmentAdapter,
  os as createSurvey,
  Ue as createTour,
  Ye as createTours,
  ss as createTutorialLayer,
  Mt as currentPath,
  Xe as defineSpec,
  Ke as defineStep,
  zt as describeTarget,
  us as escapeHtml,
  vt as evaluateExpression,
  V as evaluateShowIf,
  Je as extendSpec,
  Ds as filterEvents,
  ps as hasBlockMarkdown,
  Re as installTrigger,
  at as interpolate,
  fs as isVisible,
  Ge as localeDirection,
  Dt as matchPath,
  ut as normalizeContent,
  Rt as onLocationChange,
  ms as queryDeep,
  dt as renderBlocks,
  st as renderInline,
  gs as renderMarkdown,
  $e as resolveLabel,
  Q as resolveTarget,
  Vt as resolveTargets,
  tt as resolveText,
  vs as safeQuery,
  xe as selectPlural,
  Gt as shouldSample,
  ft as validateSpec,
  ze as validateSpecs,
  ys as waitForElement,
  ct as waitForTarget,
  Rs as withEventTypes,
  Bs as withSampling
};
//# sourceMappingURL=index.js.map
