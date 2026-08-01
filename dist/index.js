var Kt = Object.defineProperty;
var Xt = (n, t, e) => t in n ? Kt(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var d = (n, t, e) => Xt(n, typeof t != "symbol" ? t + "" : t, e);
import { C as Yt, c as Jt, a as st, r as Q, f as ut, d as Qt, b as Zt } from "./chunks/safeEval.es.js";
import { e as Es, i as $s, q as Ss, s as As, w as Cs } from "./chunks/safeEval.es.js";
import { shouldSample as te, sampleValue as xt } from "./analytics.js";
import { createAmplitudeAdapter as Ts, createDatadogAdapter as Ls, createDebugAdapter as Ns, createEventCollector as Ms, createFunnelReport as Rs, createGA4Adapter as Ps, createHeapAdapter as Ds, createHttpAdapter as qs, createMixpanelAdapter as Bs, createMultiAdapter as Os, createPostHogAdapter as Hs, createRudderStackAdapter as js, createSegmentAdapter as _s, filterEvents as zs, withEventTypes as Fs, withSampling as Ws } from "./analytics.js";
let kt = 0;
class mt {
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
    kt += 1;
    const s = `ot-mask-${kt}`;
    if (this.opts = e, this.root = document.createElement("div"), this.root.className = "ot-root", this.root.style.setProperty("--ot-z", String(t)), this.root.setAttribute("data-opentutorial", ""), e.dir && this.root.setAttribute("dir", e.dir), e.isolate) {
      this.host = document.createElement("div"), this.host.setAttribute("data-opentutorial-host", ""), this.host.style.cssText = "position:fixed;inset:0;pointer-events:none;", this.host.style.zIndex = String(t);
      try {
        this.shadow = this.host.attachShadow({ mode: "open" });
        const l = document.createElement("style");
        l.textContent = Yt, this.shadow.appendChild(l), this.shadow.appendChild(this.root);
      } catch {
        this.shadow = null, this.host = this.root;
      }
    } else
      this.host = this.root;
    const i = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(i, "svg"), this.svg.setAttribute("class", "ot-backdrop"), this.svg.setAttribute("width", "100%"), this.svg.setAttribute("height", "100%"), this.svg.setAttribute("aria-hidden", "true");
    const r = document.createElementNS(i, "defs"), o = document.createElementNS(i, "mask");
    o.setAttribute("id", s);
    const a = document.createElementNS(i, "rect");
    a.setAttribute("x", "0"), a.setAttribute("y", "0"), a.setAttribute("width", "100%"), a.setAttribute("height", "100%"), a.setAttribute("fill", "white"), this.mask = o, this.hole = this.addHole(), o.appendChild(a), o.appendChild(this.hole), r.appendChild(o), this.dimRect = document.createElementNS(i, "rect"), this.dimRect.setAttribute("class", "ot-dim"), this.dimRect.setAttribute("x", "0"), this.dimRect.setAttribute("y", "0"), this.dimRect.setAttribute("width", "100%"), this.dimRect.setAttribute("height", "100%"), this.dimRect.setAttribute("mask", `url(#${s})`), this.svg.appendChild(r), this.svg.appendChild(this.dimRect), this.ring = document.createElement("div"), this.ring.className = "ot-ring", this.ring.style.opacity = "0", this.rings.push(this.ring), this.shield = document.createElement("div"), this.shield.className = "ot-shield", this.shield.style.display = "none";
    for (let l = 0; l < 4; l += 1) {
      const c = document.createElement("div");
      c.className = "ot-shield-panel", this.panels.push(c), this.shield.appendChild(c);
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
    const e = Math.min(...t.map((o) => o.x)), s = Math.min(...t.map((o) => o.y)), i = Math.max(...t.map((o) => o.x + o.width)), r = Math.max(...t.map((o) => o.y + o.height));
    return { x: e, y: s, width: i - e, height: r - s };
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
      for (const r of this.holes) this.setHole({ x: -9999, y: -9999, width: 0, height: 0 }, 0, r);
      for (const r of this.rings) r.style.opacity = "0";
      this.svg.style.display = "none", this.applyShield();
      return;
    }
    for (this.current = { ...mt.union(i), padding: e, radius: s }, this.svg.style.display = ""; this.holes.length < i.length; ) this.addHole();
    for (; this.rings.length < i.length; ) this.addRing();
    i.forEach((r, o) => {
      const a = this.holes[o];
      this.setHole(r, e, a), a.setAttribute("rx", String(s));
      const l = this.rings[o].style;
      l.opacity = "1", l.left = `${r.x - e}px`, l.top = `${r.y - e}px`, l.width = `${r.width + e * 2}px`, l.height = `${r.height + e * 2}px`, l.borderRadius = `${s}px`;
    });
    for (let r = i.length; r < this.holes.length; r += 1)
      this.setHole({ x: -9999, y: -9999, width: 0, height: 0 }, 0, this.holes[r]), this.rings[r].style.opacity = "0";
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
    } : { x: t, y: e, width: 0, height: 0 }, [i, r, o, a] = this.panels, l = (c, u, h, f, k) => {
      c.style.left = `${u}px`, c.style.top = `${h}px`, c.style.width = `${Math.max(0, f)}px`, c.style.height = `${Math.max(0, k)}px`;
    };
    l(i, 0, 0, t, s.y), l(o, 0, s.y + s.height, t, e - (s.y + s.height)), l(a, 0, s.y, s.x, s.height), l(r, s.x + s.width, s.y, t - (s.x + s.width), s.height);
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
const ee = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function nt(n) {
  return n.replace(/[&<>"']/g, (t) => ee[t] ?? t);
}
const Dt = /^(javascript|vbscript|data|file|blob)\s*:/i;
function qt(n) {
  let t = "";
  for (const e of n)
    e.charCodeAt(0) > 32 && (t += e);
  return t;
}
function se(n) {
  const t = n.trim();
  return Dt.test(qt(t)) ? null : t;
}
function ie(n) {
  const t = qt(n.trim());
  return /^data:image\/(png|jpe?g|gif|webp|avif);/i.test(t) ? n.trim() : Dt.test(t) ? null : n.trim();
}
function V(n, t = {}) {
  if (typeof n != "string") return "";
  let e = nt(n);
  return e = e.replace(
    /!\[([^\]]*)\]\(([^\s)]+)\)/g,
    (s, i, r) => {
      const o = ie(r);
      return o ? `<img class="ot-inline-img" src="${o}" alt="${i}">` : s;
    }
  ), e = e.replace(
    /\[([^\]]+)\]\(([^\s)]+)\)/g,
    (s, i, r) => {
      const o = se(r);
      if (!o) return s;
      const l = /^(https?:)?\/\//i.test(o) ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${o}"${l}>${i}</a>`;
    }
  ), e = e.replace(/\*\*([^\s*][^*]*?[^\s*]|[^\s*])\*\*/g, "<strong>$1</strong>"), e = e.replace(/(^|[^*])\*([^\s*][^*\n]*?[^\s*]|[^\s*])\*/g, "$1<em>$2</em>"), e = e.replace(/~~([^~]+)~~/g, "<s>$1</s>"), e = e.replace(/`([^`]+)`/g, "<code>$1</code>"), t.breaks !== !1 && (e = e.replace(/\r?\n/g, "<br>")), e;
}
const Bt = /^(#{1,6})\s+(.*)$/, Ot = /^\s*(`{3,}|~{3,})\s*([\w+-]*)\s*$/, Ht = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/, pt = /^\s*[-*+]\s+(.*)$/, Z = /^\s*(\d+)\.\s+(.*)$/, it = /^\s*>\s?(.*)$/, lt = (n) => V(n, { breaks: !1 });
function jt(n) {
  if (typeof n != "string" || n === "") return "";
  const t = n.replace(/\r\n?/g, `
`).split(`
`), e = [];
  let s = [];
  const i = () => {
    s.length !== 0 && (e.push(`<p class="ot-content">${lt(s.join(`
`)).replace(/\n/g, "<br>")}</p>`), s = []);
  };
  for (let r = 0; r < t.length; r += 1) {
    const o = t[r], a = Ot.exec(o);
    if (a) {
      i();
      const c = a[1][0], u = a[2], h = [];
      for (r += 1; r < t.length && !new RegExp(`^\\s*${c}{3,}\\s*$`).test(t[r]); )
        h.push(t[r]), r += 1;
      const f = u ? ` class="language-${nt(u)}"` : "";
      e.push(`<pre class="ot-code"><code${f}>${nt(h.join(`
`))}</code></pre>`);
      continue;
    }
    if (Ht.test(o)) {
      i(), e.push('<hr class="ot-divider">');
      continue;
    }
    const l = Bt.exec(o);
    if (l) {
      i();
      const c = l[1].length;
      e.push(`<h${c} class="ot-heading ot-heading--${c}">${lt(l[2])}</h${c}>`);
      continue;
    }
    if (it.test(o)) {
      i();
      const c = [];
      for (; r < t.length && it.test(t[r]); )
        c.push(it.exec(t[r])[1]), r += 1;
      r -= 1, e.push(`<blockquote class="ot-quote">${jt(c.join(`
`))}</blockquote>`);
      continue;
    }
    if (pt.test(o) || Z.test(o)) {
      i();
      const c = Z.test(o), u = [];
      for (; r < t.length; ) {
        const w = t[r], b = c ? Z.exec(w) : pt.exec(w);
        if (!b) break;
        u.push(`<li>${lt(c ? b[2] : b[1])}</li>`), r += 1;
      }
      r -= 1;
      const h = c ? "ol" : "ul", f = c ? Number(Z.exec(o)[1]) : 1, k = c && f !== 1 ? ` start="${f}"` : "";
      e.push(`<${h} class="ot-list"${k}>${u.join("")}</${h}>`);
      continue;
    }
    if (o.trim() === "") {
      i();
      continue;
    }
    s.push(o);
  }
  return i(), e.join("");
}
function ne(n) {
  return typeof n != "string" ? !1 : n.split(/\r?\n/).some(
    (t) => Bt.test(t) || Ot.test(t) || Ht.test(t) || pt.test(t) || Z.test(t) || it.test(t)
  );
}
function gt(n, t) {
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
function re(n) {
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
function vt(n, t = {}) {
  const e = t.doc ?? document, s = e.createDocumentFragment();
  for (const i of n)
    switch (i.type) {
      case "text": {
        const r = typeof i.value == "string" ? i.value : "";
        if (t.markdown !== "inline" && ne(r)) {
          const o = e.createElement("div");
          o.className = "ot-prose", o.innerHTML = jt(r), s.appendChild(o);
        } else {
          const o = e.createElement("p");
          o.className = "ot-content", o.innerHTML = V(r), s.appendChild(o);
        }
        break;
      }
      case "image": {
        const r = e.createElement("img");
        r.className = "ot-media ot-media-image", r.src = i.src, r.alt = i.alt, r.loading = "lazy", i.width && (r.width = i.width), i.height && (r.height = i.height), s.appendChild(r);
        break;
      }
      case "video": {
        const r = e.createElement("video");
        r.className = "ot-media ot-media-video", r.src = i.src, i.poster && (r.poster = i.poster), r.controls = i.controls ?? !0, r.loop = i.loop ?? !1, r.muted = i.muted ?? i.autoplay ?? !1, r.playsInline = !0, i.autoplay && (r.autoplay = !0, r.muted = !0), s.appendChild(r);
        break;
      }
      case "list": {
        const r = e.createElement(i.ordered ? "ol" : "ul");
        r.className = "ot-list";
        for (const o of i.items) {
          const a = e.createElement("li");
          a.innerHTML = V(typeof o == "string" ? o : ""), r.appendChild(a);
        }
        s.appendChild(r);
        break;
      }
      case "code": {
        const r = e.createElement("pre");
        r.className = "ot-code";
        const o = e.createElement("code");
        i.lang && (o.dataset.lang = i.lang), o.textContent = i.value, r.appendChild(o), s.appendChild(r);
        break;
      }
      case "divider": {
        const r = e.createElement("hr");
        r.className = "ot-divider", s.appendChild(r);
        break;
      }
      case "html": {
        const r = e.createElement("div");
        r.className = "ot-html", r.innerHTML = t.allowHtml ? i.value : nt(i.value), s.appendChild(r);
        break;
      }
    }
  return s;
}
const oe = 240, ae = 460, le = 0.7, ce = 56, he = 44, de = 700, ue = 14, z = 10;
function pe(n) {
  if (n === "auto" || n === "center") return { side: "auto", align: "center" };
  const [t, e] = n.split("-");
  return { side: t, align: e ?? "center" };
}
function fe(n) {
  return { top: "bottom", bottom: "top", left: "right", right: "left" }[n];
}
function me(n) {
  return n === "left" ? "right" : n === "right" ? "left" : n;
}
class ge {
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
    d(this, "autoSize", !0);
    this.cbs = t, this.dir = e, this.autoSize = s.autoSize !== !1, this.el = document.createElement("div"), this.el.className = "ot-popover", this.el.setAttribute("role", "dialog"), this.el.tabIndex = -1, this.arrow = document.createElement("div"), this.arrow.className = "ot-arrow";
    const i = document.createElement("div");
    i.className = "ot-body", this.skipBtn = document.createElement("button"), this.skipBtn.type = "button", this.skipBtn.className = "ot-skip", this.skipBtn.setAttribute("aria-label", "Close tour"), this.skipBtn.innerHTML = "&times;", this.skipBtn.addEventListener("click", () => this.cbs.onSkip()), this.titleEl = document.createElement("h2"), this.titleEl.className = "ot-title", this.titleEl.id = `ot-title-${Math.random().toString(36).slice(2, 8)}`, this.el.setAttribute("aria-labelledby", this.titleEl.id), this.contentEl = document.createElement("div"), this.contentEl.className = "ot-content-wrap", this.progressEl = document.createElement("div"), this.progressEl.className = "ot-dots", this.progressEl.setAttribute("aria-hidden", "true"), this.liveEl = document.createElement("span"), this.liveEl.className = "ot-sr-only", this.liveEl.setAttribute("aria-live", "polite"), this.liveEl.setAttribute("aria-atomic", "true"), this.backBtn = document.createElement("button"), this.backBtn.type = "button", this.backBtn.className = "ot-btn ot-btn-ghost", this.backBtn.addEventListener("click", () => this.cbs.onPrev()), this.nextBtn = document.createElement("button"), this.nextBtn.type = "button", this.nextBtn.className = "ot-btn ot-btn-primary", this.nextBtn.addEventListener("click", () => this.cbs.onNext());
    const r = document.createElement("div");
    r.className = "ot-footer";
    const o = document.createElement("div");
    o.className = "ot-btns", o.appendChild(this.backBtn), o.appendChild(this.nextBtn), r.appendChild(this.progressEl), r.appendChild(o), i.appendChild(this.skipBtn), i.appendChild(this.titleEl), i.appendChild(this.contentEl), i.appendChild(this.liveEl), i.appendChild(r), this.el.appendChild(this.arrow), this.el.appendChild(i), s.swipe !== !1 && this.installSwipe();
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
    const r = (a) => {
      if (a.touches.length !== 1) {
        i = !1;
        return;
      }
      const l = a.target;
      if (l?.closest("button, a, input, textarea, select, video, audio, [data-ot-no-swipe]")) {
        i = !1;
        return;
      }
      if (l && this.isScrollableX(l)) {
        i = !1;
        return;
      }
      i = !0, t = a.touches[0].clientX, e = a.touches[0].clientY, s = Date.now();
    }, o = (a) => {
      if (!i) return;
      i = !1;
      const l = a.changedTouches[0];
      if (!l) return;
      const c = l.clientX - t, u = l.clientY - e;
      if (Date.now() - s > de || Math.abs(u) > he || Math.abs(c) < ce) return;
      const h = this.dir === "rtl" ? c > 0 : c < 0, f = this.model;
      f && (h ? f.showNext && this.cbs.onNext() : f.showBack && f.canGoBack && f.index > 0 && this.cbs.onPrev());
    };
    this.el.addEventListener("touchstart", r, { passive: !0 }), this.el.addEventListener("touchend", o, { passive: !0 }), this.detachSwipe = () => {
      this.el.removeEventListener("touchstart", r), this.el.removeEventListener("touchend", o);
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
    this.model = t, this.titleEl.textContent = t.title, this.contentEl.replaceChildren(
      vt(t.blocks, { allowHtml: t.allowHtml })
    ), this.liveEl.textContent = `${t.title}. Step ${t.index + 1} of ${t.total}`, this.progressEl.replaceChildren();
    for (let s = 0; s < t.total; s += 1) {
      const i = document.createElement("span");
      i.className = `ot-dot${s === t.index ? " ot-dot-active" : ""}`, this.progressEl.appendChild(i);
    }
    const e = t.showBack && t.canGoBack && t.index > 0;
    this.backBtn.style.display = e ? "" : "none", this.backBtn.textContent = t.labels.back, this.nextBtn.style.display = t.showNext ? "" : "none", this.nextBtn.textContent = t.isLast ? t.labels.done : t.labels.next, this.skipBtn.style.display = t.skippable ? "" : "none", this.skipBtn.setAttribute("aria-label", t.labels.skip), this.el.setAttribute("aria-modal", t.modal ? "true" : "false"), this.el.classList.toggle("ot-popover--modal-step", t.modal), t.density ? this.el.dataset.otDensity = t.density : delete this.el.dataset.otDensity, this.applyAutoSize();
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
    if (this.el.style.maxHeight = `${Math.round(e * le)}px`, !this.autoSize || i) {
      this.el.style.width = "";
      return;
    }
    this.el.style.width = "max-content";
    const r = this.el.offsetWidth;
    this.el.style.width = "";
    const o = Math.min(ae, s - z * 2), a = Math.min(oe, o), l = Math.max(a, Math.min(r, o));
    this.el.style.width = `${Math.round(l)}px`;
  }
  /** Position relative to a target rect (viewport coords), or centered when null. */
  position(t, e, s) {
    const i = window.innerWidth, r = window.innerHeight, o = this.el.offsetWidth, a = this.el.offsetHeight;
    if (!t || e === "center") {
      this.lastSide = "modal", this.el.classList.add("ot-modal"), this.arrow.style.display = "none", this.el.style.left = `${Math.max(z, (i - o) / 2)}px`, this.el.style.top = `${Math.max(z, (r - a) / 2)}px`;
      return;
    }
    this.el.classList.remove("ot-modal"), this.arrow.style.display = "";
    const l = pe(e), c = this.dir === "rtl" ? me(l.side) : l.side, u = l.align, h = ue + s, f = {
      top: t.y,
      bottom: r - (t.y + t.height),
      left: t.x,
      right: i - (t.x + t.width)
    };
    let w = c === "auto" ? ["bottom", "right", "top", "left"].reduce((E, I) => f[I] > f[E] ? I : E, "bottom") : c;
    const b = (g) => g === "top" || g === "bottom" ? f[g] >= a + h : f[g] >= o + h;
    if (!b(w)) {
      const g = fe(w);
      b(g) ? w = g : w = Object.keys(f).reduce((E, I) => f[E] >= f[I] ? E : I);
    }
    let x = 0, m = 0;
    const y = (g, E, I) => u === "start" ? this.dir === "rtl" ? g + E - I : g : u === "end" ? this.dir === "rtl" ? g : g + E - I : g + E / 2 - I / 2;
    w === "top" || w === "bottom" ? (x = y(t.x, t.width, o), m = w === "top" ? t.y - a - h : t.y + t.height + h) : (m = y(t.y, t.height, a), x = w === "left" ? t.x - o - h : t.x + t.width + h), x = Math.min(Math.max(x, z), Math.max(z, i - o - z)), m = Math.min(Math.max(m, z), Math.max(z, r - a - z)), this.el.style.left = `${x}px`, this.el.style.top = `${m}px`, this.lastSide = w, this.positionArrow(w, t, x, m, o, a);
  }
  positionArrow(t, e, s, i, r, o) {
    const a = this.arrow.style;
    a.top = "", a.bottom = "", a.left = "", a.right = "", this.arrow.dataset.side = t;
    const l = e.x + e.width / 2, c = e.y + e.height / 2;
    t === "top" ? (a.bottom = "-5px", a.left = `${Math.min(Math.max(l - s, 16), Math.max(16, r - 16))}px`) : t === "bottom" ? (a.top = "-5px", a.left = `${Math.min(Math.max(l - s, 16), Math.max(16, r - 16))}px`) : t === "left" ? (a.right = "-5px", a.top = `${Math.min(Math.max(c - i, 16), Math.max(16, o - 16))}px`) : (a.left = "-5px", a.top = `${Math.min(Math.max(c - i, 16), Math.max(16, o - 16))}px`);
  }
  getSide() {
    return this.lastSide;
  }
  destroy() {
    this.detachSwipe?.(), this.detachSwipe = null, this.el.remove();
  }
}
class ve {
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
    this.tooltipEl || (this.tooltipEl = document.createElement("div"), this.tooltipEl.className = "ot-hotspot-tooltip", this.tooltipEl.setAttribute("role", "status"), this.textEl = document.createElement("span"), this.textEl.className = "ot-hotspot-text", this.tooltipEl.appendChild(this.textEl), this.el.appendChild(this.tooltipEl)), this.tooltipEl.style.display = "flex", this.textEl && (this.textEl.innerHTML = V(t.content ?? "")), t.showDismiss || t.display === "hotspot" ? (this.dismissBtn || (this.dismissBtn = document.createElement("button"), this.dismissBtn.type = "button", this.dismissBtn.className = "ot-hotspot-dismiss", this.dismissBtn.textContent = "→", this.dismissBtn.setAttribute("aria-label", "Next step"), this.dismissBtn.addEventListener("click", () => this.onDismiss?.())), this.tooltipEl.appendChild(this.dismissBtn)) : this.dismissBtn?.parentNode && this.dismissBtn.remove();
  }
  positionTooltip(t) {
    if (!this.tooltipEl) return;
    const e = window.innerWidth, s = this.tooltipEl.offsetWidth || 200, i = t.x + t.width / 2, r = e - (i + 16), o = i - 16;
    r > s ? (this.tooltipEl.style.left = "12px", this.tooltipEl.style.right = "auto") : o > s ? (this.tooltipEl.style.right = "12px", this.tooltipEl.style.left = "auto") : (this.tooltipEl.style.left = `${Math.max(8, -(i - 8))}px`, this.tooltipEl.style.right = "auto"), this.tooltipEl.style.top = "16px";
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
const ye = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function be(n) {
  if (!n) return !1;
  if (n.isContentEditable) return !0;
  const t = n.tagName;
  if (t === "TEXTAREA" || t === "SELECT") return !0;
  if (t !== "INPUT") return !1;
  const e = n.type;
  return !["button", "submit", "reset", "checkbox", "radio", "file"].includes(e);
}
function we(n, t = {}) {
  const e = document.activeElement, s = t.trap !== !1, i = () => Array.from(n.querySelectorAll(ye)).filter((o) => o.getClientRects().length > 0 || o === document.activeElement), r = (o) => {
    const a = n.getRootNode().activeElement ?? document.activeElement;
    if (o.key === "Escape") {
      t.onEscape?.(), o.stopPropagation();
      return;
    }
    if (be(a)) return;
    if (o.key === "ArrowRight") {
      t.onArrowNext?.(), o.preventDefault();
      return;
    }
    if (o.key === "ArrowLeft") {
      t.onArrowPrev?.(), o.preventDefault();
      return;
    }
    if (o.key === "Enter" && a === n) {
      t.onArrowNext?.(), o.preventDefault();
      return;
    }
    if (o.key !== "Tab" || !s) return;
    const l = i();
    if (!l.length) {
      o.preventDefault();
      return;
    }
    const c = l[0], u = l[l.length - 1];
    o.shiftKey && (a === c || !n.contains(a)) ? (u.focus(), o.preventDefault()) : !o.shiftKey && a === u && (c.focus(), o.preventDefault());
  };
  return n.addEventListener("keydown", r), t.autoFocus !== !1 && n.focus({ preventScroll: !0 }), () => {
    n.removeEventListener("keydown", r);
    const o = document.activeElement;
    (!o || o === document.body || n.contains(o)) && e?.focus?.({ preventScroll: !0 });
  };
}
const ft = "opentutorial:locationchange";
let Et = !1;
function xe() {
  if (Et || typeof history > "u") return;
  Et = !0;
  const n = () => {
    try {
      window.dispatchEvent(new Event(ft));
    } catch {
    }
  };
  for (const t of ["pushState", "replaceState"]) {
    const e = history[t];
    typeof e == "function" && (history[t] = function(...i) {
      const r = e.apply(this, i);
      return n(), r;
    });
  }
}
function _t() {
  return typeof location > "u" ? "" : location.pathname + location.search + location.hash;
}
function zt(n, t, e = !1) {
  if (!n) return !1;
  const s = t.split("#")[0];
  if (n.endsWith("*"))
    return s.startsWith(n.slice(0, -1));
  if (n.includes(":")) {
    const r = n.split("/").map((o) => o.startsWith(":") ? "[^/]+" : o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("/");
    try {
      return new RegExp(`^${r}${e ? "$" : "(/|$|\\?)"}`).test(s);
    } catch {
      return !1;
    }
  }
  const i = s.split("?")[0];
  return e ? i === n : i.startsWith(n);
}
function Ft(n) {
  return typeof window > "u" ? () => {
  } : (xe(), window.addEventListener("popstate", n), window.addEventListener("hashchange", n), window.addEventListener(ft, n), () => {
    window.removeEventListener("popstate", n), window.removeEventListener("hashchange", n), window.removeEventListener(ft, n);
  });
}
class rt {
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
function Qe() {
  return new rt();
}
function Wt() {
  try {
    if (typeof localStorage < "u") {
      const n = "__ot_probe__";
      return localStorage.setItem(n, "1"), localStorage.removeItem(n), localStorage;
    }
  } catch {
  }
  return new rt();
}
function ct() {
  return { v: 2, tours: {}, progress: {} };
}
class Gt {
  constructor(t, e = "ot", s) {
    d(this, "ready");
    d(this, "storage");
    d(this, "prefix");
    d(this, "userId");
    d(this, "root", ct());
    d(this, "hydrated", !1);
    this.storage = t ?? Wt(), this.prefix = e, this.userId = s, this.ready = this.hydrate();
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
    return t === this.userId ? this.ready : (this.userId = t, this.root = ct(), this.hydrated = !1, this.hydrate());
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
      this.root = ct(), this.save();
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
      for (const [i, r] of Object.entries(s.tours)) {
        const o = this.root.tours[i];
        (!o || r.at > o.at) && (this.root.tours[i] = r);
      }
      for (const [i, r] of Object.entries(s.progress)) {
        const o = this.root.progress[i];
        (!o || r.timestamp > o.timestamp) && (this.root.progress[i] = r);
      }
    }
    return this.save(), !0;
  }
}
const $t = /* @__PURE__ */ new Set([
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
]), St = /* @__PURE__ */ new Set(["spotlight", "hotspot", "beacon", "modal", "banner"]), At = /* @__PURE__ */ new Set([
  "button",
  "target-click",
  "event",
  "auto",
  "input-match",
  "form-submit",
  "element-appears",
  "element-disappears",
  "url-match"
]), Ct = /* @__PURE__ */ new Set(["manual", "auto", "event", "route", "element", "idle", "scroll"]), ke = /* @__PURE__ */ new Set(["emit", "click", "focus", "navigate", "setContext", "scrollTo", "wait"]), Ee = /* @__PURE__ */ new Set(["text", "image", "video", "list", "code", "divider", "html"]), It = /* @__PURE__ */ new Set(["free", "target-only", "blocked"]), Tt = /* @__PURE__ */ new Set(["compact", "comfortable", "spacious"]), $e = /* @__PURE__ */ new Set([
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
]), Se = /* @__PURE__ */ new Set([
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
  "theme",
  "onEnter",
  "onExit"
]), Ae = /* @__PURE__ */ new Set([
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
]), Ce = /* @__PURE__ */ new Set([
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
]), Ie = /^[a-z0-9]+(-[a-z0-9]+)*$/, F = { title: 60, stepTitle: 80, description: 200, content: 320, steps: 24 }, Lt = { steps: 200 };
function R(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
class Te {
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
function Nt(n, t, e) {
  if (n !== void 0) {
    if (!R(n)) {
      e.error(t, "theme must be an object");
      return;
    }
    for (const s of Object.keys(n))
      Ce.has(s) || e.warn(`${t}.${s}`, `unknown theme token "${s}" (ignored)`);
  }
}
function ht(n, t, e) {
  if (n === void 0) return;
  if (typeof n != "string") {
    e.error(t, "must be a string expression");
    return;
  }
  if (n.length > 500) {
    e.error(t, `expression must be ≤ 500 chars (got ${n.length})`);
    return;
  }
  const s = Jt(n);
  s.ok || e.error(t, `invalid expression: ${s.message}`);
}
function Mt(n, t, e) {
  if (n !== void 0) {
    if (!Array.isArray(n)) {
      e.error(t, "must be an array of actions");
      return;
    }
    n.forEach((s, i) => {
      const r = `${t}[${i}]`;
      if (!R(s)) {
        e.error(r, "action must be an object");
        return;
      }
      if (!ke.has(s.type)) {
        e.error(`${r}.type`, `unknown action type "${String(s.type)}"`);
        return;
      }
      s.type === "emit" && typeof s.name != "string" && e.error(`${r}.name`, 'emit action requires a string "name"'), s.type === "navigate" && (typeof s.path != "string" || !s.path.startsWith("/")) && e.error(`${r}.path`, 'navigate requires a same-origin "path" starting with /'), s.type === "setContext" && typeof s.key != "string" && e.error(`${r}.key`, 'setContext requires a string "key"'), s.type === "scrollTo" && typeof s.selector != "string" && e.error(`${r}.selector`, 'scrollTo requires a string "selector"'), s.type === "wait" && typeof s.ms != "number" && e.error(`${r}.ms`, 'wait requires a numeric "ms"');
    });
  }
}
function et(n, t, e) {
  if (typeof n == "string") return n.length;
  if (R(n) && typeof n.key == "string") return n.key.length;
  if (R(n) && Array.isArray(n.blocks)) {
    if (n.blocks.length === 0) {
      e.error(t, "blocks must not be empty");
      return;
    }
    let s = 0;
    return n.blocks.forEach((i, r) => {
      const o = `${t}.blocks[${r}]`;
      if (!R(i)) {
        e.error(o, "block must be an object");
        return;
      }
      if (!Ee.has(i.type)) {
        e.error(`${o}.type`, `unknown block type "${String(i.type)}"`);
        return;
      }
      switch (i.type) {
        case "text":
          typeof i.value == "string" ? s += i.value.length : (!R(i.value) || typeof i.value.key != "string") && e.error(`${o}.value`, "text block requires a string or i18n object");
          break;
        case "image":
          typeof i.src != "string" && e.error(`${o}.src`, 'image block requires "src"'), typeof i.alt != "string" && e.error(`${o}.alt`, 'image block requires "alt" for accessibility');
          break;
        case "video":
          typeof i.src != "string" && e.error(`${o}.src`, 'video block requires "src"');
          break;
        case "list":
          (!Array.isArray(i.items) || i.items.length === 0) && e.error(`${o}.items`, 'list block requires a non-empty "items" array');
          break;
        case "code":
          typeof i.value != "string" && e.error(`${o}.value`, 'code block requires a string "value"');
          break;
        case "html":
          typeof i.value != "string" ? e.error(`${o}.value`, 'html block requires a string "value"') : e.warn(o, "html blocks render only when the host sets allowHtml: true");
          break;
      }
    }), s;
  }
}
function Le(n, t) {
  if (n === void 0) return;
  if (!R(n)) {
    t.error("$.trigger", "must be an object");
    return;
  }
  const e = n.type;
  if (!Ct.has(e)) {
    t.error("$.trigger.type", `must be one of: ${[...Ct].join(" | ")}`);
    return;
  }
  if (n.delay !== void 0 && (typeof n.delay != "number" || n.delay < 0) && t.error("$.trigger.delay", "must be a non-negative number (ms)"), e === "event" && typeof n.event != "string" && t.error("$.trigger.event", 'required when trigger.type === "event"'), e === "route" && typeof n.path != "string" && t.error("$.trigger.path", 'required when trigger.type === "route"'), e === "element" && typeof n.selector != "string" && t.error("$.trigger.selector", 'required when trigger.type === "element"'), e === "idle" && (typeof n.ms != "number" || n.ms <= 0) && t.error("$.trigger.ms", 'required positive number (ms) when trigger.type === "idle"'), e === "scroll") {
    const s = n.percent;
    (typeof s != "number" || s < 0 || s > 100) && t.error("$.trigger.percent", "must be a number between 0 and 100");
  }
}
function Ne(n, t, e) {
  if (n === void 0) return;
  if (!R(n)) {
    e.error(`${t}.target`, "must be an object");
    return;
  }
  for (const o of Object.keys(n))
    Ae.has(o) || e.warn(`${t}.target.${o}`, `unknown target key "${o}" (ignored)`);
  const { selector: s, text: i } = n, r = typeof s == "string" && s.trim().length > 0 || Array.isArray(s) && s.length > 0 && s.every((o) => typeof o == "string" && o.trim());
  s !== void 0 && !r && e.error(`${t}.target.selector`, "must be a non-empty CSS selector or array of selectors"), !r && typeof i != "string" && e.error(`${t}.target`, 'requires "selector", "text", or both'), n.timeout !== void 0 && (typeof n.timeout != "number" || n.timeout < 0) && e.error(`${t}.target.timeout`, "must be a non-negative number (ms)"), n.padding !== void 0 && (typeof n.padding != "number" || n.padding < 0) && e.error(`${t}.target.padding`, "must be a non-negative number (px)"), n.index !== void 0 && (typeof n.index != "number" || n.index < 0) && e.error(`${t}.target.index`, "must be a non-negative integer"), n.iframe !== void 0 && typeof n.iframe != "string" && e.error(`${t}.target.iframe`, "must be a CSS selector string"), n.scrollBehavior !== void 0 && !["auto", "smooth"].includes(n.scrollBehavior) && e.error(`${t}.target.scrollBehavior`, 'must be "auto" or "smooth"');
}
function yt(n) {
  const t = new Te();
  if (!R(n))
    return {
      ok: !1,
      errors: [{ path: "$", message: "spec must be a JSON object", severity: "error" }],
      warnings: []
    };
  for (const i of Object.keys(n))
    $e.has(i) || t.warn(`$.${i}`, `unknown top-level key "${i}" (ignored)`);
  n.specVersion !== 1 && t.error("$.specVersion", "must be the integer 1"), typeof n.id != "string" || !n.id ? t.error("$.id", "required, non-empty string") : Ie.test(n.id) || t.error("$.id", 'must be kebab-case (e.g. "dashboard-intro")');
  const e = et(n.title, "$.title", t);
  if (e === void 0 ? t.error("$.title", "required (string or i18n object with key)") : e === 0 ? t.error("$.title", "must not be empty") : e > F.title && t.warn("$.title", `longer than ${F.title} chars (got ${e})`), n.description !== void 0) {
    const i = et(n.description, "$.description", t);
    i === void 0 ? t.error("$.description", "must be a string or i18n object") : i > F.description && t.warn("$.description", `longer than ${F.description} chars (got ${i})`);
  }
  if (n.version !== void 0 && typeof n.version != "string" && t.error("$.version", 'must be a string (e.g. "1.0.0")'), n.priority !== void 0 && typeof n.priority != "number" && t.error("$.priority", "must be a number"), n.interaction !== void 0 && !It.has(n.interaction) && t.error("$.interaction", 'must be "free" | "target-only" | "blocked"'), n.density !== void 0 && !Tt.has(n.density) && t.error("$.density", 'must be "compact" | "comfortable" | "spacious"'), Le(n.trigger, t), n.audience !== void 0 && (R(n.audience) ? ht(n.audience.showIf, "$.audience.showIf", t) : t.error("$.audience", "must be an object")), n.frequency !== void 0)
    if (!R(n.frequency))
      t.error("$.frequency", "must be an object");
    else
      for (const i of ["max", "cooldown", "perSession"]) {
        const r = n.frequency[i];
        r !== void 0 && (typeof r != "number" || r < 0) && t.error(`$.frequency.${i}`, "must be a non-negative number");
      }
  if (n.onComplete !== void 0)
    if (!R(n.onComplete))
      t.error("$.onComplete", "must be an object");
    else {
      const { startTour: i, emit: r, navigate: o } = n.onComplete;
      i !== void 0 && typeof i != "string" && t.error("$.onComplete.startTour", "must be a tour id string"), r !== void 0 && typeof r != "string" && t.error("$.onComplete.emit", "must be an event name string"), o !== void 0 && (typeof o != "string" || !o.startsWith("/")) && t.error("$.onComplete.navigate", "must be a same-origin path starting with /");
    }
  if (Nt(n.theme, "$.theme", t), !Array.isArray(n.steps))
    return t.error("$.steps", "required, must be an array"), { ok: !1, errors: t.errors, warnings: t.warnings };
  n.steps.length < 1 && t.error("$.steps", "must contain at least 1 step"), n.steps.length > Lt.steps ? t.error("$.steps", `must contain ≤ ${Lt.steps} steps (got ${n.steps.length})`) : n.steps.length > F.steps && t.warn("$.steps", `${n.steps.length} steps is a lot; consider splitting into several tours`);
  const s = /* @__PURE__ */ new Set();
  return n.steps.forEach((i, r) => {
    const o = `$.steps[${r}]`;
    if (!R(i)) {
      t.error(o, "step must be an object");
      return;
    }
    for (const h of Object.keys(i))
      Se.has(h) || t.warn(`${o}.${h}`, `unknown step key "${h}" (ignored)`);
    typeof i.id != "string" || !i.id ? t.error(`${o}.id`, "required") : s.has(i.id) ? t.error(`${o}.id`, `duplicate step id "${i.id}"`) : s.add(i.id);
    const a = i.display;
    a !== void 0 && !St.has(a) && t.error(`${o}.display`, `must be one of: ${[...St].join(" | ")}`), Ne(i.target, o, t), i.placement !== void 0 && !$t.has(i.placement) && t.error(`${o}.placement`, `must be one of: ${[...$t].join(" | ")}`), i.interaction !== void 0 && !It.has(i.interaction) && t.error(`${o}.interaction`, 'must be "free" | "target-only" | "blocked"'), i.density !== void 0 && !Tt.has(i.density) && t.error(`${o}.density`, 'must be "compact" | "comfortable" | "spacious"');
    const l = et(i.title, `${o}.title`, t);
    l === void 0 ? t.error(`${o}.title`, "required (string or i18n object with key)") : l === 0 ? t.error(`${o}.title`, "must not be empty") : l > F.stepTitle && t.warn(`${o}.title`, `longer than ${F.stepTitle} chars (got ${l})`);
    const c = et(i.content, `${o}.content`, t);
    if (c === void 0 ? t.error(`${o}.content`, "required (string, i18n object, or { blocks: [...] })") : c > F.content && t.warn(`${o}.content`, `longer than ${F.content} chars (got ${c}); long copy hurts completion`), i.buttons !== void 0)
      if (!R(i.buttons)) t.error(`${o}.buttons`, "must be an object");
      else
        for (const h of Object.keys(i.buttons))
          ["next", "back", "skip", "done"].includes(h) || t.warn(`${o}.buttons.${h}`, `unknown button "${h}" (ignored)`);
    const u = i.advanceOn ?? "button";
    At.has(u) || t.error(`${o}.advanceOn`, `must be one of: ${[...At].join(" | ")}`), u === "event" && typeof i.event != "string" && t.error(`${o}.event`, 'required when advanceOn === "event"'), u === "auto" && (typeof i.duration != "number" || i.duration <= 0) && t.error(`${o}.duration`, 'required positive number (ms) when advanceOn === "auto"'), u === "target-click" && i.target === void 0 && t.error(`${o}.target`, 'required when advanceOn === "target-click"'), u === "input-match" && (i.target === void 0 && t.error(`${o}.target`, 'required when advanceOn === "input-match"'), typeof i.match != "string" && t.error(`${o}.match`, 'required when advanceOn === "input-match"')), u === "form-submit" && i.target === void 0 && t.error(`${o}.target`, 'required when advanceOn === "form-submit"'), (u === "element-appears" || u === "element-disappears") && typeof i.watch != "string" && t.error(`${o}.watch`, `required when advanceOn === "${u}"`), u === "url-match" && typeof i.urlPattern != "string" && t.error(`${o}.urlPattern`, 'required when advanceOn === "url-match"'), a === "beacon" && i.duration !== void 0 && typeof i.duration != "number" && t.error(`${o}.duration`, "must be a number (ms)"), i.next !== void 0 && (typeof i.next == "string" || (Array.isArray(i.next) ? (i.next.length === 0 && t.warn(`${o}.next`, "empty branch list falls through to the next step"), i.next.forEach((h, f) => {
      const k = `${o}.next[${f}]`;
      if (!R(h)) {
        t.error(k, "branch must be an object { if, to }");
        return;
      }
      ht(h.if, `${k}.if`, t), typeof h.to != "string" && t.error(`${k}.to`, "must be a step id string");
    })) : t.error(`${o}.next`, "must be a step id string or an array of { if, to } branches"))), ht(i.showIf, `${o}.showIf`, t), Nt(i.theme, `${o}.theme`, t), Mt(i.onEnter, `${o}.onEnter`, t), Mt(i.onExit, `${o}.onExit`, t);
  }), n.steps.forEach((i, r) => {
    if (!R(i)) return;
    const o = `$.steps[${r}].next`;
    typeof i.next == "string" && !s.has(i.next) ? t.error(o, `points to unknown step id "${i.next}"`) : Array.isArray(i.next) && i.next.forEach((a, l) => {
      R(a) && typeof a.to == "string" && !s.has(a.to) && t.error(`${o}[${l}].to`, `points to unknown step id "${a.to}"`);
    });
  }), t.errors.length ? { ok: !1, errors: t.errors, warnings: t.warnings } : { ok: !0, errors: [], warnings: t.warnings };
}
function Ze(n) {
  const t = yt(n);
  if (!t.ok) {
    const e = t.errors.map((s) => `  • ${s.path}: ${s.message}`).join(`
`);
    throw new Error(`[opentutorial] Invalid TutorialSpec:
${e}`);
  }
  return n;
}
function ts(n) {
  const t = [], e = /* @__PURE__ */ new Set();
  return n.forEach((s, i) => {
    const r = R(s) && typeof s.id == "string" ? s.id : void 0, o = yt(s);
    for (const a of [...o.errors, ...o.warnings])
      t.push({ ...a, path: `[${i}]${a.path.slice(1)}`, specId: r });
    r && (e.has(r) && t.push({ path: `[${i}].id`, message: `duplicate tour id "${r}"`, severity: "error", specId: r }), e.add(r));
  }), n.forEach((s, i) => {
    if (!R(s) || !R(s.onComplete)) return;
    const r = s.onComplete.startTour;
    typeof r == "string" && !e.has(r) && t.push({
      path: `[${i}].onComplete.startTour`,
      message: `chains to unknown tour "${r}"`,
      severity: "warning",
      specId: typeof s.id == "string" ? s.id : void 0
    });
  }), { ok: !t.some((s) => s.severity === "error"), issues: t };
}
const Me = ["zero", "one", "two", "few", "many", "other"];
function Rt(n, t) {
  return t.split(".").reduce(
    (e, s) => e && typeof e == "object" ? e[s] : void 0,
    n
  );
}
function Re(n, t, e = "en") {
  let s;
  try {
    s = new Intl.PluralRules(e).select(n);
  } catch {
    s = n === 1 ? "one" : "other";
  }
  return t[s] ?? t.other ?? "";
}
function Pe(n) {
  const t = {}, e = /(\w+)\s*\{([^{}]*)\}/g;
  let s;
  for (; (s = e.exec(n)) !== null; ) {
    const i = s[1];
    Me.includes(i) && (t[i] = s[2]);
  }
  return t;
}
function De(n, t) {
  let e = 0;
  for (let s = t; s < n.length; s += 1) {
    const i = n[s];
    if (i === "{") e += 1;
    else if (i === "}") {
      if (e === 0 && n[s + 1] === "}") return s;
      e > 0 && (e -= 1);
    }
  }
  return -1;
}
function Pt(n, t) {
  try {
    return new Intl.NumberFormat(t).format(n);
  } catch {
    return String(n);
  }
}
function dt(n, t, e = "en") {
  if (!n.includes("{{")) return n;
  let s = "", i = 0;
  for (; i < n.length; ) {
    const r = n.indexOf("{{", i);
    if (r === -1) {
      s += n.slice(i);
      break;
    }
    const o = De(n, r + 2);
    if (o === -1) {
      s += n.slice(i);
      break;
    }
    s += n.slice(i, r);
    const a = n.slice(r + 2, o).trim();
    s += qe(a, t, e), i = o + 2;
  }
  return s;
}
function qe(n, t, e) {
  const s = `{{${n}}}`, i = n.indexOf(",");
  if (i !== -1) {
    const o = n.slice(0, i).trim(), a = n.slice(i + 1).trim();
    if (!a.startsWith("plural")) return s;
    const l = t ? Rt(t, o) : void 0, c = typeof l == "number" ? l : Number(l);
    if (!Number.isFinite(c)) return s;
    const u = Pe(a.slice(6).replace(/^\s*,\s*/, ""));
    return Re(c, u, e).replace(/#/g, Pt(c, e));
  }
  if (!/^[\w.$]+$/.test(n)) return s;
  const r = t ? Rt(t, n) : void 0;
  return r == null ? s : typeof r == "number" ? Pt(r, e) : String(r);
}
function tt(n, t, e, s) {
  if (typeof n == "string") return dt(n, s, t);
  if (n && typeof n.key == "string") {
    const i = e?.(n.key, t);
    return dt(i !== void 0 ? i : n.fallback ?? n.key, s, t);
  }
  return String(n);
}
function es(n) {
  return (t) => n[t];
}
function ss(n, t = "en") {
  return (e, s) => {
    for (const i of [s, s.split("-")[0], t]) {
      const r = n[i]?.[e];
      if (r !== void 0) return r;
    }
  };
}
const Be = {
  next: "Next",
  back: "Back",
  done: "Done",
  skip: "Skip tour"
};
function Oe(n, t, e) {
  return e?.(`opentutorial.${n}`, t) ?? Be[n];
}
const He = /* @__PURE__ */ new Set(["ar", "he", "fa", "ur", "ps", "sd", "ug", "yi", "dv", "ckb"]);
function is(n) {
  try {
    const t = new Intl.Locale(n), e = t.getTextInfo?.().direction ?? t.textInfo?.direction;
    if (e === "rtl" || e === "ltr") return e;
  } catch {
  }
  return He.has(n.split("-")[0].toLowerCase()) ? "rtl" : "ltr";
}
const je = {
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
function _e(n) {
  const t = Math.min(...n.map((r) => r.x)), e = Math.min(...n.map((r) => r.y)), s = Math.max(...n.map((r) => r.x + r.width)), i = Math.max(...n.map((r) => r.y + r.height));
  return { x: t, y: e, width: s - t, height: i - e };
}
const ze = /* @__PURE__ */ new Set(["radius", "popoverWidth", "fontSize", "spacing", "arrowSize", "overlayBlur"]), Fe = /* @__PURE__ */ new Set(["animationMs"]), We = 200;
class Vt {
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
    this.spec = t, this.opts = e, this.context = { ...e.context ?? {} }, this.persistence = new Gt(
      e.persistence?.storage,
      e.persistence?.keyPrefix ?? "ot",
      e.userId
    );
    const s = yt(t);
    if (this.warnings = s.warnings, !s.ok || e.strict && s.warnings.length > 0) {
      this.errors = s.ok ? s.warnings : s.errors;
      const i = this.errors.map((r) => `  • ${r.path}: ${r.message}`).join(`
`);
      e.dev !== !1 && console.error(`[opentutorial] Spec "${t?.id ?? "?"}" failed validation:
${i}`), this.emit("error", { message: `invalid spec: ${this.errors.length} violation(s)` });
    } else if (s.warnings.length > 0 && e.dev) {
      const i = s.warnings.map((r) => `  • ${r.path}: ${r.message}`).join(`
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
    const e = this.visibleSteps().length;
    if (Object.assign(this.context, t), this.status !== "running") return;
    const s = this.currentStep();
    if (s?.showIf && !st(s.showIf, this.context)) {
      this.next();
      return;
    }
    this.visibleSteps().length !== e && this.rerenderCurrent();
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
      const i = this.visibleSteps(), r = i.findIndex((o) => o.id === s);
      r > 0 && (this.history = i.slice(0, r).map((o) => o.id));
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
      if (s?.tourId === this.spec.id && this.visibleSteps().some((r) => r.id === s.stepId))
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
        const s = this.visibleSteps().findIndex((r) => r.id === t.id);
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
      for (const o of t.next)
        if (o && typeof o.if == "string" && st(o.if, this.context)) return o.to;
    } else if (typeof t.next == "string")
      return t.next;
    const e = this.visibleSteps(), s = e.findIndex((o) => o.id === t.id);
    if (s >= 0) return e[s + 1]?.id;
    const i = this.spec.steps.findIndex((o) => o.id === t.id);
    if (i < 0) return;
    const r = new Set(e.map((o) => o.id));
    return this.spec.steps.slice(i + 1).find((o) => r.has(o.id))?.id;
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
    return this.spec.steps.filter((t) => !t.showIf || st(t.showIf, this.context));
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
    return gt(t, (e) => this.text(e));
  }
  interactionFor(t) {
    return t.interaction ?? this.spec.interaction ?? this.opts.interaction ?? "free";
  }
  buildDom() {
    const t = this.opts.zIndex ?? 9999;
    this.layer = new mt(t, {
      container: this.opts.container,
      isolate: this.opts.isolate,
      dir: this.opts.dir
    }), this.layer.attach(), (this.opts.renderStep || this.opts.renderIndicator) && (this.customHost = document.createElement("div"), this.customHost.className = "ot-custom-host", this.layer.mountPopover(this.customHost)), this.opts.renderStep || (this.popover = new ge(
      {
        onNext: () => {
          this.next();
        },
        onPrev: () => this.prev(),
        onSkip: () => this.skip("user")
      },
      this.opts.dir ?? "ltr",
      { swipe: this.opts.swipe, autoSize: this.opts.autoSize }
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
    if (this.transitions += 1, this.transitions > We) {
      this.emit("error", { message: "transition limit reached (possible next-loop)" }), this.complete("loop-guard");
      return;
    }
    const s = this.spec.steps.find((r) => r.id === t);
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
    const i = t.display ?? "spotlight", r = this.visibleSteps(), o = Math.max(0, r.findIndex((c) => c.id === t.id));
    let a = null;
    if (t.target) {
      if (a = Q(t.target), !a && t.target.waitFor && (this.renderStep(t, o, r.length, "Looking for the interface element…"), a = await ut(t.target, t.target.timeout ?? 5e3), !s()))
        return;
      if (!a) {
        const c = Qt(t.target);
        this.emit("target-not-found", { stepId: t.id, selector: c, message: `target not found: ${c}` }), this.next();
        return;
      }
    }
    if (!s()) return;
    if (this.resolved = a, a && t.target?.scrollIntoView !== !1) {
      const c = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches, u = t.target?.scrollBehavior ?? (c ? "auto" : "smooth");
      try {
        a.element.scrollIntoView({ block: "center", inline: "center", behavior: u });
      } catch {
      }
    }
    if (this.hotspot?.destroy(), this.hotspot = null, this.layer.updateSpotlight(null), this.layer.setInteraction(this.interactionFor(t)), (i === "hotspot" || i === "beacon") && a)
      this.showIndicator(t, i, a);
    else {
      this.renderStep(t, o, r.length), (i === "modal" || !a) && this.layer.showBackdrop(), requestAnimationFrame(() => requestAnimationFrame(() => {
        s() && this.reposition();
      }));
      const c = this.customHost ?? this.popover?.el;
      if (c) {
        const u = i === "modal" || this.interactionFor(t) !== "free";
        this.releaseFocus = we(c, {
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
    this.wireAdvance(t, a?.element ?? null), this.startTracking(), this.stepEnteredAt = Date.now(), this.persistence.saveProgress(this.spec.id, t.id, o), this.opts.autoResume && this.persistence.setActive(this.spec.id, t.id), this.runActions(t.onEnter), this.emit("step-shown", { stepId: t.id, index: o, total: r.length });
  }
  showIndicator(t, e, s) {
    if (!this.layer) return;
    const i = this.viewportRect(s);
    if (this.popover && (this.popover.el.style.display = "none"), this.opts.renderIndicator && this.customHost) {
      this.customHost.style.display = "", this.customHost.classList.add("ot-custom-indicator"), this.customHost.style.position = "fixed", this.customHost.style.left = `${i.x + i.width / 2}px`, this.customHost.style.top = `${i.y + i.height / 2}px`, this.cleanupRender?.();
      const r = this.visibleSteps(), o = r.findIndex((l) => l.id === t.id), a = this.opts.renderIndicator(
        {
          ...this.renderContext(t, Math.max(0, o), r.length, this.blocks(t.content)),
          display: e
        },
        this.customHost
      );
      if (this.cleanupRender = typeof a == "function" ? a : null, e === "beacon") {
        const l = window.setTimeout(() => {
          this.next();
        }, t.duration ?? 5e3);
        this.cleanupAdvance = () => window.clearTimeout(l);
      }
      return;
    }
    if (this.customHost && (this.customHost.style.display = "none"), this.hotspot = new ve(), this.hotspot.render({
      display: e,
      content: re(this.blocks(t.content)),
      showDismiss: e === "hotspot" || t.advanceOn === "button",
      onDismiss: () => {
        this.next();
      }
    }, i), this.layer.root.appendChild(this.hotspot.el), e === "beacon") {
      const r = window.setTimeout(() => {
        this.next();
      }, t.duration ?? 5e3);
      this.cleanupAdvance = () => window.clearTimeout(r);
    }
  }
  renderStep(t, e, s, i) {
    const r = i ? [{ type: "text", value: i }] : this.blocks(t.content);
    if (this.opts.renderStep && this.customHost) {
      this.cleanupRender?.();
      const o = this.renderContext(t, e, s, r), a = this.opts.renderStep(o, this.customHost);
      this.cleanupRender = typeof a == "function" ? a : null, this.customHost.style.display = "";
      return;
    }
    this.popover && (this.popover.el.style.display = "", this.popover.render(this.makeModel(t, e, s, r)));
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
      goTo: (r) => this.goTo(r)
    };
  }
  rerenderCurrent() {
    const t = this.currentStep();
    if (!t) return;
    const e = this.visibleSteps(), s = Math.max(0, e.findIndex((i) => i.id === t.id));
    this.renderStep(t, s, e.length), this.reposition();
  }
  makeModel(t, e, s, i) {
    const r = this.opts.locale ?? "en", o = this.opts.i18nResolver, a = (u, h) => h === !1 || h === void 0 ? Oe(u, r, o) : this.text(h), l = t.buttons ?? {}, c = t.advanceOn ?? "button";
    return {
      stepId: t.id,
      title: this.text(t.title),
      blocks: i,
      index: e,
      total: s,
      canGoBack: t.canGoBack !== !1 && this.history.length > 0,
      skippable: t.skippable !== !1 && l.skip !== !1,
      isLast: !t.next && e >= s - 1,
      advanceOn: c,
      labels: {
        next: a("next", l.next),
        back: a("back", l.back),
        done: a("done", l.done),
        skip: a("skip", l.skip)
      },
      // With a non-button advance condition the primary button would be a
      // "skip this step" escape hatch; hide it unless the author asked for one.
      showNext: l.next !== !1 && (c === "button" || e >= s - 1),
      showBack: l.back !== !1,
      modal: (t.display ?? "spotlight") === "modal" || this.interactionFor(t) === "blocked",
      allowHtml: this.opts.allowHtml,
      density: this.densityFor(t)
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
        const r = Q(t.target);
        r && (this.resolved = r);
      }
      const i = this.viewportRect(this.resolved);
      if (this.hotspot)
        this.hotspot.reposition(i), this.layer.setInteraction(this.interactionFor(t));
      else {
        const r = t.target?.all ? Zt(t.target).map((a) => this.viewportRect(a)) : [i], o = r.length > 1 ? _e(r) : i;
        this.layer.updateSpotlight(r.length > 0 ? r : i, e, this.mergedRadius()), s && this.popover?.position(o, t.placement ?? "auto", e);
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
    const r = performance.now() + 900, o = () => {
      this.status === "running" && (this.reposition(), performance.now() < r && requestAnimationFrame(o));
    };
    requestAnimationFrame(o), this.cleanupTrack = () => {
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
        const r = () => i();
        e.addEventListener("click", r, { once: !0 }), this.cleanupAdvance = () => e.removeEventListener("click", r);
        return;
      }
      case "event": {
        if (typeof t.event != "string") return;
        const r = t.event, o = () => i();
        window.addEventListener(r, o, { once: !0 }), this.cleanupAdvance = () => window.removeEventListener(r, o);
        return;
      }
      case "auto": {
        const r = window.setTimeout(i, t.duration ?? 3e3);
        this.cleanupAdvance = () => window.clearTimeout(r);
        return;
      }
      case "input-match": {
        if (!e || typeof t.match != "string") return;
        const r = t.match, o = (l) => {
          if (r.startsWith("/") && r.lastIndexOf("/") > 0) {
            const c = r.lastIndexOf("/");
            try {
              return new RegExp(r.slice(1, c), r.slice(c + 1)).test(l);
            } catch {
              return !1;
            }
          }
          return l === r;
        }, a = () => {
          const l = e.value ?? "";
          o(l) && i();
        };
        e.addEventListener("input", a), e.addEventListener("change", a), this.cleanupAdvance = () => {
          e.removeEventListener("input", a), e.removeEventListener("change", a);
        };
        return;
      }
      case "form-submit": {
        if (!e) return;
        const r = e.closest?.("form") ?? (e.tagName === "FORM" ? e : null);
        if (!r) return;
        const o = () => i();
        r.addEventListener("submit", o, { once: !0 }), this.cleanupAdvance = () => r.removeEventListener("submit", o);
        return;
      }
      case "element-appears": {
        if (typeof t.watch != "string") return;
        let r = !1;
        ut({ selector: t.watch, visible: !0 }, t.duration ?? 6e4).then((o) => {
          o && !r && i();
        }), this.cleanupAdvance = () => {
          r = !0;
        };
        return;
      }
      case "element-disappears": {
        if (typeof t.watch != "string") return;
        const r = t.watch, o = window.setInterval(() => {
          Q({ selector: r, visible: !0 }) || (window.clearInterval(o), i());
        }, 150);
        this.cleanupAdvance = () => window.clearInterval(o);
        return;
      }
      case "url-match": {
        if (typeof t.urlPattern != "string") return;
        const r = t.urlPattern, o = () => {
          zt(r, _t()) && i();
        }, a = Ft(o);
        this.cleanupAdvance = a, o();
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
    for (const [i, r] of Object.entries(s)) {
      if (r === void 0) continue;
      const o = je[i];
      if (!o) continue;
      const a = ze.has(i) ? `${r}px` : Fe.has(i) ? `${r}ms` : String(r);
      e.setProperty(o, a), this.appliedVars.push(o);
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
    return t === void 0 || t >= 1 ? !0 : (this.sampleDecision === null && (this.sampleDecision = te(this.spec?.id ?? "unknown", t)), this.sampleDecision);
  }
}
function Ge(n, t) {
  if (!n || n.type === "manual") return { dispose: () => {
  } };
  const e = n.delay ?? 0, s = [], i = [];
  let r = !1;
  const o = n.once ?? !0, a = () => {
    r || (o && (r = !0), e > 0 ? s.push(window.setTimeout(t, e)) : t());
  };
  switch (n.type) {
    case "auto": {
      a();
      break;
    }
    case "event": {
      const l = () => a();
      window.addEventListener(n.event, l), i.push(() => window.removeEventListener(n.event, l));
      break;
    }
    case "route": {
      const l = () => {
        zt(n.path, _t(), n.exact) ? a() : o || (r = !1);
      };
      i.push(Ft(l)), l();
      break;
    }
    case "element": {
      let l = !1;
      ut({ selector: n.selector, visible: !0 }, n.timeout ?? 3e4).then((c) => {
        c && !l && a();
      }), i.push(() => {
        l = !0;
      });
      break;
    }
    case "idle": {
      let l = 0;
      const c = () => {
        window.clearTimeout(l), !r && (l = window.setTimeout(a, n.ms));
      }, u = ["pointerdown", "keydown", "scroll", "pointermove"];
      for (const h of u)
        window.addEventListener(h, c, { passive: !0 }), i.push(() => window.removeEventListener(h, c));
      i.push(() => window.clearTimeout(l)), c();
      break;
    }
    case "scroll": {
      const l = () => {
        const c = document.documentElement, u = c.scrollHeight - c.clientHeight;
        if (u <= 0) return;
        c.scrollTop / u * 100 >= n.percent && a();
      };
      window.addEventListener("scroll", l, { passive: !0 }), i.push(() => window.removeEventListener("scroll", l)), l();
      break;
    }
  }
  return {
    dispose: () => {
      s.forEach((l) => window.clearTimeout(l)), i.forEach((l) => {
        try {
          l();
        } catch {
        }
      });
    }
  };
}
class Ut {
  constructor(t, e = {}) {
    d(this, "engines", /* @__PURE__ */ new Map());
    d(this, "specs");
    d(this, "opts");
    d(this, "triggers", []);
    d(this, "disposers", []);
    d(this, "queue", []);
    d(this, "activeId", null);
    d(this, "mounted", !1);
    /** Impressions in this page session, for `frequency.perSession`. */
    d(this, "sessionCounts", /* @__PURE__ */ new Map());
    this.specs = t, this.opts = e;
    for (const s of t)
      this.engines.set(s.id, new Vt(s, {
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
    if (s.audience?.showIf && !st(s.audience.showIf, i))
      return "audience rule did not match";
    const r = s.frequency;
    if (r) {
      const o = e.getPersistence().getRecord(s.id);
      if (r.max !== void 0 && (o?.shownCount ?? 0) >= r.max)
        return `frequency: already shown ${r.max} time(s)`;
      if (r.cooldown !== void 0 && o?.lastShownAt) {
        const a = Date.now() - o.lastShownAt;
        if (a < r.cooldown) return `frequency: cooldown active (${r.cooldown - a}ms left)`;
      }
      if (r.perSession !== void 0 && (this.sessionCounts.get(s.id) ?? 0) >= r.perSession)
        return `frequency: session limit of ${r.perSession} reached`;
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
    this.queue.some((i) => i.tourId === t) || (this.queue.push({ tourId: t, stepId: e, priority: s }), this.queue.sort((i, r) => r.priority - i.priority));
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
  /** The shared tour context. Every engine holds the same keys. */
  getContext() {
    return this.engines.values().next().value?.getContext() ?? {};
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
    for (const t of this.specs) {
      const e = this.engines.get(t.id);
      if (!e || !e.isValid()) continue;
      const s = t.trigger;
      !s || s.type === "manual" || (s.once ?? !0) && e.hasSeen() || this.triggers.push(Ge(s, () => {
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
        const i = e.get(`${t}Step`) ?? void 0, r = window.setTimeout(() => this.request(s, i, { force: !0 }), 400);
        this.disposers.push(() => window.clearTimeout(r));
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
function ns(n, t = {}) {
  return new Vt(n, t);
}
function rs(n, t = {}) {
  return new Ut(n, t);
}
function os(n) {
  return n;
}
function as(n) {
  return n;
}
function ls(n, t) {
  const { steps: e, ...s } = t;
  return {
    ...n,
    ...s,
    steps: n.steps.map((i) => e?.[i.id] ? { ...i, ...e[i.id] } : i)
  };
}
function Ve(n) {
  return n.map((t) => typeof t == "string" ? { name: t, weight: 1 } : { name: t.name, weight: t.weight ?? 1 });
}
function Ue(n, t, e, s = {}) {
  const i = Ve(e).filter((c) => c.weight > 0);
  if (i.length === 0) return null;
  const r = s.holdout ?? 0;
  if (r > 0 && xt(`holdout:${n}:${t}`) < r) return null;
  const o = i.reduce((c, u) => c + u.weight, 0), a = xt(`${n}:${t}`) * o;
  let l = 0;
  for (const c of i)
    if (l += c.weight, a < l) return c.name;
  return i[i.length - 1].name;
}
function cs(n, t) {
  const e = {};
  for (const [s, i] of Object.entries(t)) {
    const { variants: r, holdout: o } = Array.isArray(i) ? { variants: i, holdout: void 0 } : i;
    e[s] = Ue(s, n, r, { holdout: o });
  }
  return e;
}
function hs(n = {}) {
  const { days: t = 365, path: e = "/", domain: s, sameSite: i = "Lax", secure: r } = n, o = () => {
    const l = {};
    if (typeof document > "u") return l;
    for (const c of document.cookie.split(";")) {
      const u = c.indexOf("=");
      u < 0 || (l[decodeURIComponent(c.slice(0, u).trim())] = decodeURIComponent(c.slice(u + 1)));
    }
    return l;
  }, a = (l, c, u) => {
    if (typeof document > "u") return;
    const h = [
      `${encodeURIComponent(l)}=${encodeURIComponent(c)}`,
      `path=${e}`,
      `max-age=${Math.floor(u * 86400)}`,
      `SameSite=${i}`
    ];
    s && h.push(`domain=${s}`), (r ?? i === "None") && h.push("Secure"), document.cookie = h.join("; ");
  };
  return {
    getItem: (l) => o()[l] ?? null,
    setItem: (l, c) => a(l, c, t),
    removeItem: (l) => a(l, "", -1)
  };
}
function ds(n = "opentutorial", t = "kv") {
  const e = new rt();
  if (typeof indexedDB > "u") return e;
  let s = null;
  const i = () => s || (s = new Promise((o) => {
    try {
      const a = indexedDB.open(n, 1);
      a.onupgradeneeded = () => {
        const l = a.result;
        l.objectStoreNames.contains(t) || l.createObjectStore(t);
      }, a.onsuccess = () => o(a.result), a.onerror = () => o(null), a.onblocked = () => o(null);
    } catch {
      o(null);
    }
  }), s), r = async (o, a) => {
    const l = await i();
    return l ? new Promise((c) => {
      try {
        const u = l.transaction(t, o), h = a(u.objectStore(t));
        h.onsuccess = () => c(h.result), h.onerror = () => c(null);
      } catch {
        c(null);
      }
    }) : null;
  };
  return {
    getItem(o) {
      const a = e.getItem(o);
      return a !== null ? a : r("readonly", (l) => l.get(o)).then((l) => (typeof l == "string" && e.setItem(o, l), typeof l == "string" ? l : null));
    },
    setItem(o, a) {
      e.setItem(o, a), r("readwrite", (l) => l.put(a, o));
    },
    removeItem(o) {
      e.removeItem(o), r("readwrite", (a) => a.delete(o));
    }
  };
}
function us(n) {
  const {
    endpoint: t,
    headers: e,
    debounceMs: s = 400,
    fetchImpl: i,
    onError: r
  } = n, o = n.cache === !1 ? new rt() : n.cache ?? Wt(), a = i ?? (typeof fetch == "function" ? fetch.bind(globalThis) : void 0), l = t.replace(/\/$/, ""), c = (b) => `${l}/${encodeURIComponent(b)}`, u = () => ({
    "content-type": "application/json",
    ...typeof e == "function" ? e() : e ?? {}
  }), h = /* @__PURE__ */ new Map();
  let f = null;
  const k = async () => {
    if (!a || h.size === 0) return;
    const b = [...h.entries()];
    h.clear();
    for (const [x, m] of b)
      try {
        const y = await a(c(x), {
          method: m === null ? "DELETE" : "PUT",
          headers: u(),
          body: m === null ? void 0 : JSON.stringify({ value: m }),
          credentials: "include"
        });
        if (!y.ok) throw new Error(`HTTP ${y.status}`);
      } catch (y) {
        h.has(x) || h.set(x, m), r?.(y, m === null ? "delete" : "put", x);
      }
  }, w = () => {
    f && clearTimeout(f), f = setTimeout(() => {
      f = null, k();
    }, s);
  };
  return typeof window < "u" && (window.addEventListener("online", () => {
    k();
  }), window.addEventListener("pagehide", () => {
    k();
  })), {
    getItem(b) {
      const x = o.getItem(b);
      return x ?? (a ? a(c(b), { headers: u(), credentials: "include" }).then((m) => m.ok ? m.json() : null).then((m) => {
        const y = m?.value ?? null;
        return typeof y == "string" && o.setItem(b, y), y;
      }).catch((m) => (r?.(m, "get", b), null)) : null);
    },
    setItem(b, x) {
      o.setItem(b, x), h.set(b, x), w();
    },
    removeItem(b) {
      o.removeItem(b), h.set(b, null), w();
    }
  };
}
const Ke = {
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
function ps(n) {
  const { specs: t, autoMount: e = !0, storage: s, keyPrefix: i, ...r } = n, o = /* @__PURE__ */ new Map(), a = s !== void 0 || i !== void 0 ? { storage: s, keyPrefix: i, ...r.persistence ?? {} } : r.persistence, l = (h, f) => {
    const k = o.get(h);
    if (k)
      for (const w of k)
        try {
          w(f);
        } catch {
        }
  }, c = new Ut(t, {
    ...r,
    persistence: a,
    onEvent: (h) => {
      l("event", h);
      for (const [f, k] of Object.entries(Ke))
        k.includes(h.type) && l(f, h);
      r.onEvent?.(h);
    }
  });
  e && c.mount();
  const u = (h) => {
    const f = c.getActiveId();
    if (!f) return;
    const k = c.getEngine(f);
    k && h(k);
  };
  return {
    start: (h, f) => c.start(h, f),
    request: (h, f) => c.request(h, f),
    stop: () => c.stop("api"),
    skip: (h) => {
      h ? c.getEngine(h)?.skip("api") : c.stop("api");
    },
    pause: () => c.pause(),
    resume: () => c.resume(),
    next: () => u((h) => {
      h.next();
    }),
    prev: () => u((h) => h.prev()),
    goTo: (h) => u((f) => f.goTo(h)),
    getState: (h) => c.getState(h),
    getActiveId: () => c.getActiveId(),
    getSpecs: () => c.getSpecs(),
    hasSeen: (h) => c.hasSeen(h),
    whyBlocked: (h) => c.checkEligibility(h),
    getContext: () => c.getContext(),
    setContext: (h) => c.setContext(h),
    setTheme: (h) => c.setTheme(h),
    setLocale: (h) => c.setLocale(h),
    setUser: (h) => c.setUser(h),
    reset: () => c.reset(),
    resetTour: (h) => c.resetTour(h),
    resetProgress: () => c.resetProgress(),
    exportProgress: () => c.exportProgress(),
    importProgress: (h, f) => c.importProgress(h, f),
    getEngine: (h) => c.getEngine(h),
    ready: c.ready,
    on(h, f) {
      return o.has(h) || o.set(h, /* @__PURE__ */ new Set()), o.get(h).add(f), () => this.off(h, f);
    },
    off(h, f) {
      o.get(h)?.delete(f);
    },
    destroy() {
      l("destroy", {
        type: "skipped",
        tourId: c.getActiveId() ?? "",
        reason: "destroy",
        timestamp: Date.now()
      }), c.destroy(), o.clear();
    }
  };
}
function p(n, t, e = {}) {
  const s = document.createElement(n);
  t && (s.className = t);
  const { text: i, html: r, ...o } = e;
  return i !== void 0 && (s.textContent = i), r !== void 0 && (s.innerHTML = r), Object.assign(s, o), s;
}
function G(n, t, e) {
  const s = p("button", n, { type: "button", text: t });
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
class bt {
  constructor(t, e, s) {
    d(this, "ready");
    d(this, "persistence");
    this.persistence = new Gt(t, e, s), this.ready = this.persistence.ready;
  }
  /** True when the surface should be shown. */
  shouldShow(t, e = {}) {
    const { once: s = !0, resurfaceAfter: i } = e;
    if (!s) return !0;
    const r = this.persistence.getRecord(t);
    return r?.at ? i === void 0 ? !1 : Date.now() - r.at > i : !0;
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
function K(n, t) {
  t !== null && (t ?? document.body).appendChild(n);
}
function X(n, t) {
  return {
    el: n,
    mount(e) {
      (e ?? document.body).appendChild(n);
    },
    destroy() {
      t.run(), n.remove();
    }
  };
}
function fs(n) {
  const {
    id: t,
    message: e,
    position: s = "top",
    action: i,
    dismissible: r = !0,
    resurfaceAfter: o,
    storage: a,
    keyPrefix: l = "ot-banner",
    userId: c,
    container: u,
    className: h = "",
    onDismiss: f
  } = n, k = new U(), w = new bt(a, l, c), b = p("div", `ot-banner ot-banner--${s} ${h}`.trim());
  b.setAttribute("role", "status"), b.hidden = !0;
  const x = p("span", "ot-banner-content", { html: V(e) });
  b.appendChild(x), i && b.appendChild(G("ot-banner-action", i.label, i.onClick));
  const m = () => {
    w.markDismissed(t), b.hidden = !0, f?.();
  };
  if (r) {
    const g = G("ot-banner-dismiss", "×", m);
    g.setAttribute("aria-label", "Dismiss"), b.appendChild(g);
  }
  K(b, u);
  let y = !0;
  return k.add(() => {
    y = !1;
  }), w.ready.then(() => {
    y && (b.hidden = !w.shouldShow(t, { resurfaceAfter: o }));
  }), {
    ...X(b, k),
    setMessage(g) {
      x.innerHTML = V(g);
    },
    dismiss: m
  };
}
function ms(n) {
  const {
    id: t,
    title: e,
    content: s,
    once: i = !0,
    primaryAction: r,
    secondaryAction: o,
    dismissible: a = !0,
    allowHtml: l,
    locale: c = "en",
    i18nResolver: u,
    storage: h,
    keyPrefix: f = "ot-announce",
    userId: k,
    container: w,
    className: b = "",
    onDismiss: x
  } = n, m = new U(), y = new bt(h, f, k), g = p("div", "ot-root");
  g.setAttribute("data-opentutorial", ""), g.hidden = !0;
  const E = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  E.setAttribute("class", "ot-backdrop"), E.setAttribute("width", "100%"), E.setAttribute("height", "100%"), E.setAttribute("aria-hidden", "true");
  const I = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  I.setAttribute("class", "ot-dim"), I.setAttribute("width", "100%"), I.setAttribute("height", "100%"), E.appendChild(I);
  const M = `ot-announce-${t}`, N = p("div", `ot-popover ot-modal ot-popover--modal-step ${b}`.trim());
  N.setAttribute("role", "dialog"), N.setAttribute("aria-modal", "true"), N.setAttribute("aria-labelledby", M), N.style.left = "50%", N.style.top = "50%", N.style.transform = "translate(-50%, -50%)";
  const T = p("div", "ot-body"), S = (v) => {
    i && (v ? y.markActed(t) : y.markDismissed(t)), g.hidden = !0, v || x?.();
  };
  if (a) {
    const v = G("ot-skip", "×", () => S(!1));
    v.setAttribute("aria-label", "Dismiss"), T.appendChild(v);
  }
  const D = p("h2", "ot-title", { text: e });
  D.id = M, T.appendChild(D);
  const q = p("div", "ot-content-wrap"), B = gt(s, (v) => tt(v, c, u));
  q.appendChild(vt(B, { allowHtml: l })), T.appendChild(q);
  const C = p("div", "ot-footer");
  C.appendChild(p("span"));
  const $ = p("div", "ot-btns");
  o && $.appendChild(G("ot-btn ot-btn-ghost", o.label, () => {
    S(!0), o.onClick();
  })), $.appendChild(G("ot-btn ot-btn-primary", r?.label ?? "Got it", () => {
    S(!0), r?.onClick();
  })), C.appendChild($), T.appendChild(C), N.appendChild(T), g.appendChild(E), g.appendChild(N), K(g, w), a && m.listen(window, "keydown", (v) => {
    !g.hidden && v.key === "Escape" && S(!1);
  });
  let A = !0;
  return m.add(() => {
    A = !1;
  }), y.ready.then(() => {
    A && (g.hidden = !y.shouldShow(t, { once: i }), g.hidden || N.focus?.());
  }), {
    ...X(g, m),
    close: () => S(!1)
  };
}
function gs(n) {
  const {
    target: t,
    content: e,
    glyph: s = "?",
    openOnHover: i = !1,
    zIndex: r,
    container: o,
    className: a = ""
  } = n, l = new U(), c = typeof t == "string" ? { selector: t } : t, u = p("div", `ot-hint ${a}`.trim());
  r !== void 0 && (u.style.zIndex = String(r)), u.hidden = !0;
  const h = p("button", "ot-hint-dot", { type: "button", text: s });
  h.setAttribute("aria-expanded", "false"), h.setAttribute("aria-label", "Show hint");
  const f = p("div", "ot-hint-panel", { html: V(e) });
  f.setAttribute("role", "tooltip"), f.hidden = !0;
  const k = (m) => {
    f.hidden = !m, h.setAttribute("aria-expanded", String(m)), h.setAttribute("aria-label", m ? "Hide hint" : "Show hint");
  };
  h.addEventListener("click", () => k(f.hidden)), i && (u.addEventListener("mouseenter", () => k(!0)), u.addEventListener("mouseleave", () => k(!1))), u.appendChild(h), u.appendChild(f), K(u, o);
  let w = 0;
  const b = () => {
    const m = Q(c);
    if (!m) {
      u.hidden = !0;
      return;
    }
    const y = m.element.getBoundingClientRect();
    u.hidden = !1, u.style.left = `${y.x + m.frameOffset.x + y.width}px`, u.style.top = `${y.y + m.frameOffset.y}px`;
  }, x = () => {
    cancelAnimationFrame(w), w = requestAnimationFrame(b);
  };
  if (b(), l.listen(window, "resize", x), l.listen(window, "scroll", x, { capture: !0 }), l.add(() => cancelAnimationFrame(w)), typeof ResizeObserver < "u") {
    const m = new ResizeObserver(x);
    m.observe(document.documentElement), l.add(() => m.disconnect());
  }
  return {
    ...X(u, l),
    open: () => k(!0),
    close: () => k(!1),
    reposition: b
  };
}
function vs(n) {
  const {
    id: t,
    kind: e = "nps",
    question: s,
    options: i = [],
    lowLabel: r = "Not likely",
    highLabel: o = "Very likely",
    followUp: a,
    submitLabel: l = "Submit",
    dismissLabel: c = "Not now",
    thanksMessage: u = "Thanks for the feedback!",
    container: h,
    className: f = "",
    onSubmit: k,
    onDismiss: w
  } = n, b = new U();
  let x = null, m = null;
  const y = p("div", `ot-survey ${f}`.trim()), g = `ot-survey-q-${t}`, E = p("p", "ot-survey-question", { text: s });
  E.id = g, y.appendChild(E);
  const I = e === "nps" ? Array.from({ length: 11 }, (C, $) => $) : e === "rating" ? [1, 2, 3, 4, 5] : null, M = [], N = [], T = p("textarea", "ot-survey-textarea");
  T.placeholder = e === "text" ? s : a ?? "", T.setAttribute("aria-label", e === "text" ? s : a ?? "Additional comments"), T.hidden = e !== "text";
  const S = p("button", "ot-btn ot-btn-primary", { type: "button", text: l }), D = () => {
    for (const $ of M) {
      const A = Number($.dataset.value) === x;
      $.classList.toggle("ot-survey-score--selected", A), $.setAttribute("aria-checked", String(A));
    }
    for (const $ of N) {
      const A = $.dataset.value === m;
      $.classList.toggle("ot-survey-option--selected", A), $.setAttribute("aria-checked", String(A));
    }
    a && e !== "text" && (T.hidden = x === null && m === null);
    const C = e === "nps" || e === "rating" ? x !== null : e === "choice" ? m !== null : T.value.trim().length > 0;
    S.disabled = !C;
  };
  if (I) {
    const C = p("div", "ot-survey-scale");
    C.setAttribute("role", "radiogroup"), C.setAttribute("aria-labelledby", g);
    for (const A of I) {
      const v = p("button", "ot-survey-score", { type: "button", text: String(A) });
      v.dataset.value = String(A), v.setAttribute("role", "radio"), v.setAttribute("aria-checked", "false"), v.addEventListener("click", () => {
        x = A, D();
      }), M.push(v), C.appendChild(v);
    }
    y.appendChild(C);
    const $ = p("div", "ot-survey-labels");
    $.appendChild(p("span", void 0, { text: r })), $.appendChild(p("span", void 0, { text: o })), y.appendChild($);
  }
  if (e === "choice") {
    const C = p("div", "ot-survey-options");
    C.setAttribute("role", "radiogroup"), C.setAttribute("aria-labelledby", g);
    for (const $ of i) {
      const A = p("button", "ot-survey-option", { type: "button", text: $ });
      A.dataset.value = $, A.setAttribute("role", "radio"), A.setAttribute("aria-checked", "false"), A.addEventListener("click", () => {
        m = $, D();
      }), N.push(A), C.appendChild(A);
    }
    y.appendChild(C);
  }
  y.appendChild(T), T.addEventListener("input", D);
  const q = p("div", "ot-footer");
  w ? q.appendChild(G("ot-btn ot-btn-ghost", c, w)) : q.appendChild(p("span")), q.appendChild(S), y.appendChild(q);
  const B = () => ({
    surveyId: t,
    kind: e,
    score: x ?? void 0,
    choice: m ?? void 0,
    comment: T.value.trim() || void 0
  });
  return S.addEventListener("click", () => {
    S.disabled || (k({ ...B(), submittedAt: Date.now() }), y.replaceChildren(p("p", "ot-survey-thanks", { text: u })));
  }), D(), K(y, h), {
    ...X(y, b),
    getResponse: B,
    reset() {
      x = null, m = null, T.value = "", D();
    }
  };
}
function ys(n) {
  const {
    layer: t,
    specs: e,
    getStatus: s,
    onStart: i,
    title: r = "Onboarding",
    startLabel: o = "Start",
    runningLabel: a = "Running",
    floating: l = !1,
    collapsible: c = !1,
    defaultCollapsed: u = !1,
    hideWhenComplete: h = !1,
    locale: f = "en",
    i18nResolver: k,
    container: w,
    className: b = "",
    onComplete: x
  } = n, m = new U();
  let y = u, g = !1;
  const E = p("div", "ot-checklist"), I = p("ul", "ot-checklist-items"), M = p("div", "ot-checklist-bar-track"), N = p("div", "ot-checklist-bar-fill"), T = p("span", "ot-checklist-count"), S = p("button", "ot-checklist-toggle", { type: "button" });
  if (M.setAttribute("role", "progressbar"), M.setAttribute("aria-valuemin", "0"), M.setAttribute("aria-valuemax", "100"), M.appendChild(N), r) {
    const v = p("div", "ot-checklist-header");
    v.appendChild(p("h3", "ot-checklist-title", { text: r })), v.appendChild(T), c && (S.addEventListener("click", () => A(!y)), v.appendChild(S)), E.appendChild(v);
  }
  E.appendChild(M), E.appendChild(I);
  const D = () => e ?? t.getSpecs(), q = (v) => s ? s(v) : t.getActiveId() === v ? "in_progress" : t.hasSeen(v) ? "completed" : "pending", B = (v) => v === void 0 ? "" : tt(v, f, k, t.getContext());
  let C = { completed: 0, total: 0, percent: 0 };
  const $ = () => {
    const v = D(), j = v.map((O) => q(O.id)), L = j.filter((O) => O === "completed").length, P = v.length > 0 ? Math.round(L / v.length * 100) : 0;
    C = { completed: L, total: v.length, percent: P }, T.textContent = `${L}/${v.length}`, N.style.width = `${P}%`, M.setAttribute("aria-valuenow", String(P)), M.setAttribute("aria-label", `${L} of ${v.length} complete`), I.replaceChildren(), v.forEach((O, Y) => {
      const _ = j[Y], J = p("li", `ot-checklist-item ot-checklist-item--${_}`), H = p("span", "ot-checklist-icon", {
        text: _ === "completed" ? "✓" : _ === "in_progress" ? "◌" : "○"
      });
      H.setAttribute("aria-hidden", "true"), J.appendChild(H);
      const ot = p("div", "ot-checklist-info");
      ot.appendChild(p("span", "ot-checklist-name", { text: B(O.title) }));
      const wt = B(O.description);
      if (wt && ot.appendChild(p("span", "ot-checklist-desc", { text: wt })), J.appendChild(ot), _ !== "completed") {
        const at = p("button", "ot-checklist-btn", {
          type: "button",
          text: _ === "in_progress" ? a : o
        });
        at.disabled = _ === "in_progress", at.addEventListener("click", () => {
          i ? i(O.id) : t.start(O.id);
        }), J.appendChild(at);
      }
      I.appendChild(J);
    });
    const W = v.length > 0 && L === v.length;
    W && !g && (g = !0, x?.()), W || (g = !1), E.hidden = W && h, E.className = [
      "ot-checklist",
      l ? "ot-checklist--floating" : "",
      y ? "ot-checklist--collapsed" : "",
      b
    ].filter(Boolean).join(" ");
  };
  function A(v) {
    y = v, S.textContent = y ? "▸" : "▾", S.setAttribute("aria-expanded", String(!y)), S.setAttribute("aria-label", y ? "Expand checklist" : "Collapse checklist"), $();
  }
  return A(y), K(E, w), m.add(t.on("event", $)), {
    ...X(E, m),
    refresh: $,
    setCollapsed: A,
    getProgress: () => C
  };
}
function bs(n) {
  const {
    layer: t,
    specs: e,
    links: s = [],
    title: i = "Help & guides",
    searchPlaceholder: r = "Search…",
    floating: o = !1,
    launcherGlyph: a = "?",
    emptyMessage: l = "Nothing matches that search.",
    locale: c = "en",
    i18nResolver: u,
    container: h,
    className: f = ""
  } = n, k = new U();
  let w = !o, b = "";
  const x = p("div", "ot-hub-root"), m = p("div", `ot-hub ${o ? "ot-hub--floating" : ""} ${f}`.trim()), y = p("div", "ot-hub-header");
  y.appendChild(p("h3", "ot-hub-title", { text: i }));
  const g = p("input", "ot-hub-search");
  g.type = "search", g.placeholder = r, g.setAttribute("aria-label", r), y.appendChild(g), m.appendChild(y);
  const E = p("ul", "ot-hub-list");
  m.appendChild(E), x.appendChild(m);
  const I = p("button", "ot-hub-launcher", { type: "button", text: a });
  o && (I.setAttribute("aria-label", i), x.appendChild(I));
  const M = (S) => S === void 0 ? "" : tt(S, c, u, t.getContext()), N = () => {
    if (m.hidden = !w, o && (I.textContent = w ? "×" : a, I.setAttribute("aria-label", w ? "Close help" : i), I.setAttribute("aria-expanded", String(w))), !w) return;
    const S = b.trim().toLowerCase(), D = e ?? t.getSpecs(), q = (C, $) => !S || C.toLowerCase().includes(S) || $.toLowerCase().includes(S);
    E.replaceChildren();
    let B = 0;
    for (const C of D) {
      const $ = M(C.title), A = M(C.description);
      if (!q($, A)) continue;
      B += 1;
      const v = p("li"), j = p("button", "ot-hub-item", {
        type: "button",
        text: `${t.hasSeen(C.id) ? "↻ " : ""}${$}`
      });
      A && j.appendChild(p("span", "ot-hub-item-desc", { text: A })), j.addEventListener("click", () => {
        t.start(C.id), o && T(!1);
      }), v.appendChild(j), E.appendChild(v);
    }
    for (const C of s) {
      const $ = C.description ?? "";
      if (!q(C.label, $)) continue;
      B += 1;
      const A = p("li"), v = p("a", "ot-hub-item", { text: `${C.label} ↗` });
      v.href = C.href, v.target = "_blank", v.rel = "noopener noreferrer", $ && v.appendChild(p("span", "ot-hub-item-desc", { text: $ })), A.appendChild(v), E.appendChild(A);
    }
    B === 0 && E.appendChild(p("li", "ot-hub-empty", { text: l }));
  };
  function T(S) {
    w = S, N();
  }
  return g.addEventListener("input", () => {
    b = g.value, N();
  }), I.addEventListener("click", () => T(!w)), N(), K(x, h), k.add(t.on("event", () => {
    w && N();
  })), {
    ...X(x, k),
    open: () => T(!0),
    close: () => T(!1),
    search(S) {
      b = S, g.value = S, N();
    },
    refresh: N
  };
}
function ws(n) {
  const {
    entries: t,
    title: e = "What's new",
    floating: s = !0,
    launcherGlyph: i = "✦",
    emptyMessage: r = "Nothing new right now.",
    limit: o = 20,
    allowHtml: a,
    locale: l = "en",
    i18nResolver: c,
    storage: u,
    keyPrefix: h = "ot-changelog",
    userId: f,
    container: k,
    className: w = "",
    onRead: b
  } = n, x = new U(), m = new bt(u, h, f);
  let y = t, g = !s, E = !1;
  const I = p("div", "ot-changelog-root"), M = p("div", `ot-changelog ${s ? "ot-changelog--floating" : ""} ${w}`.trim());
  M.setAttribute("role", "region"), M.setAttribute("aria-label", e);
  const N = p("div", "ot-changelog-header");
  N.appendChild(p("h3", "ot-changelog-title", { text: e })), M.appendChild(N);
  const T = p("ul", "ot-changelog-list");
  M.appendChild(T), I.appendChild(M);
  const S = p("button", "ot-changelog-launcher", { type: "button" }), D = p("span", "ot-changelog-badge");
  if (D.setAttribute("aria-hidden", "true"), s)
    S.appendChild(p("span", "ot-changelog-glyph", { text: i })), S.appendChild(D), I.appendChild(S);
  else {
    const L = G("ot-changelog-close", "×", () => v(!1));
    L.setAttribute("aria-label", "Close"), N.appendChild(L);
  }
  const q = () => y.slice(0, o), B = () => E ? q().filter((L) => m.shouldShow(L.id)).map((L) => L.id) : [], C = () => {
    const L = B().length;
    D.textContent = L > 99 ? "99+" : String(L), D.hidden = L === 0, S.setAttribute(
      "aria-label",
      L > 0 ? `${e} (${L} unread)` : e
    ), S.setAttribute("aria-expanded", String(g));
  }, $ = () => {
    T.replaceChildren();
    const L = q();
    if (L.length === 0) {
      T.appendChild(p("li", "ot-changelog-empty", { text: r }));
      return;
    }
    for (const P of L) {
      const W = E && m.shouldShow(P.id), O = p("li", `ot-changelog-item${W ? " ot-changelog-item--unread" : ""}`), Y = p("div", "ot-changelog-meta");
      if (P.tag && Y.appendChild(p("span", "ot-changelog-tag", { text: P.tag })), P.date) {
        const H = p("time", "ot-changelog-date", { text: P.date });
        H.dateTime = P.date, Y.appendChild(H);
      }
      Y.childElementCount > 0 && O.appendChild(Y), O.appendChild(p("h4", "ot-changelog-entry-title", { text: P.title }));
      const _ = p("div", "ot-changelog-body"), J = gt(P.content, (H) => tt(H, l, c));
      if (_.appendChild(vt(J, { allowHtml: a })), O.appendChild(_), P.href) {
        const H = p("a", "ot-changelog-link", { text: "Read more ↗" });
        H.href = P.href, H.target = "_blank", H.rel = "noopener noreferrer", O.appendChild(H);
      }
      T.appendChild(O);
    }
  }, A = () => {
    M.hidden = !g, C(), g && $();
  };
  function v(L) {
    if (g = L, M.hidden = !g, g) {
      const P = B();
      if ($(), P.length > 0) {
        for (const W of P) m.markActed(W);
        b?.(P);
      }
    }
    C();
  }
  S.addEventListener("click", () => v(!g)), K(I, k), A();
  let j = !0;
  return x.add(() => {
    j = !1;
  }), m.ready.then(() => {
    j && (E = !0, A());
  }), {
    ...X(I, x),
    open: () => v(!0),
    close: () => v(!1),
    unread: B,
    markAllRead() {
      for (const L of q()) m.markActed(L.id);
      A();
    },
    setEntries(L) {
      y = L, A();
    }
  };
}
export {
  Yt as CSS,
  Be as DEFAULT_LABELS,
  rt as MemoryStorage,
  bt as SurfaceState,
  Vt as TourEngine,
  Ut as TourOrchestrator,
  Gt as TourPersistence,
  Ze as assertValidSpec,
  cs as assignAll,
  Ue as assignVariant,
  re as blocksToText,
  Jt as checkExpression,
  Ts as createAmplitudeAdapter,
  ms as createAnnouncement,
  fs as createBanner,
  ws as createChangelog,
  ys as createChecklist,
  hs as createCookieStorage,
  Ls as createDatadogAdapter,
  Ns as createDebugAdapter,
  Ms as createEventCollector,
  Rs as createFunnelReport,
  Ps as createGA4Adapter,
  Ds as createHeapAdapter,
  gs as createHint,
  qs as createHttpAdapter,
  ds as createIndexedDBStorage,
  es as createKeyResolver,
  ss as createLocaleResolver,
  Qe as createMemoryStorage,
  Bs as createMixpanelAdapter,
  Os as createMultiAdapter,
  Hs as createPostHogAdapter,
  us as createRemoteStorage,
  bs as createResourceCenter,
  js as createRudderStackAdapter,
  _s as createSegmentAdapter,
  vs as createSurvey,
  ns as createTour,
  rs as createTours,
  ps as createTutorialLayer,
  _t as currentPath,
  os as defineSpec,
  as as defineStep,
  Qt as describeTarget,
  nt as escapeHtml,
  Es as evaluateExpression,
  st as evaluateShowIf,
  ls as extendSpec,
  zs as filterEvents,
  ne as hasBlockMarkdown,
  Ge as installTrigger,
  dt as interpolate,
  $s as isVisible,
  is as localeDirection,
  zt as matchPath,
  gt as normalizeContent,
  Ft as onLocationChange,
  Ss as queryDeep,
  vt as renderBlocks,
  V as renderInline,
  jt as renderMarkdown,
  Oe as resolveLabel,
  Q as resolveTarget,
  Zt as resolveTargets,
  tt as resolveText,
  As as safeQuery,
  Re as selectPlural,
  te as shouldSample,
  yt as validateSpec,
  ts as validateSpecs,
  Cs as waitForElement,
  ut as waitForTarget,
  Fs as withEventTypes,
  Ws as withSampling
};
//# sourceMappingURL=index.js.map
