import { C as D, r as B, d as H, e as M } from "./chunks/safeEval.es.js";
const P = [
  "data-tour",
  "data-testid",
  "data-test-id",
  "data-test",
  "data-cy",
  "data-qa",
  "data-automation-id"
], J = /^(css-[a-z0-9]+|sc-[a-zA-Z0-9]+|jsx-\d+|[a-z]+-[a-f0-9]{5,}|_[\w-]{5,})$/, _ = /(^|[-_:])(\d{3,}|[a-f0-9]{8,}|uid|uuid|react-aria|radix|headlessui|mui-)/i;
function y(n) {
  return typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(n) : n.replace(/["\\]/g, "\\$&");
}
function O(n, s = document) {
  try {
    return s.querySelectorAll(n).length;
  } catch {
    return 0;
  }
}
function z(n) {
  return Array.from(n.classList).filter(
    (s) => s.length > 1 && !J.test(s) && !s.startsWith("ot-")
  );
}
function q(n) {
  const s = n.parentElement;
  return s ? Array.from(s.children).filter((e) => e.tagName === n.tagName).indexOf(n) + 1 : 1;
}
function F(n, s = document) {
  const t = [];
  let e = n, c = 0;
  for (; e && e.nodeType === 1 && c < 6; ) {
    if (e.id && !_.test(e.id)) {
      t.unshift(`#${y(e.id)}`);
      break;
    }
    const r = e.tagName.toLowerCase();
    if (r === "html" || r === "body") {
      t.unshift(r);
      break;
    }
    const a = z(e);
    let d = a.length > 0 ? `${r}.${y(a[0])}` : r;
    const m = e.parentElement;
    m && Array.from(m.children).filter(
      (h) => h.tagName === e.tagName && (a.length === 0 || h.classList.contains(a[0]))
    ).length > 1 && (d += `:nth-of-type(${q(e)})`), t.unshift(d), e = m, c += 1;
    const o = t.join(" > ");
    if (O(o, s) === 1) break;
  }
  return t.join(" > ");
}
function K(n, s = document) {
  const t = [], e = (o, p, h) => {
    const g = O(o, s);
    if (g === 0) return;
    const x = g === 1 ? p : Math.max(10, p - 25);
    t.push({ selector: o, score: x, reason: h, matches: g });
  };
  for (const o of P) {
    const p = n.getAttribute(o);
    p && e(`[${o}="${y(p)}"]`, o === "data-tour" ? 100 : 92, `explicit ${o} hook`);
  }
  if (n.id) {
    const o = !_.test(n.id);
    e(`#${y(n.id)}`, o ? 85 : 45, o ? "element id" : "id looks generated");
  }
  const c = n.getAttribute("name");
  c && e(`${n.tagName.toLowerCase()}[name="${y(c)}"]`, 78, "form field name");
  const r = n.getAttribute("role"), a = n.getAttribute("aria-label");
  r && a ? e(`[role="${y(r)}"][aria-label="${y(a)}"]`, 74, "role + aria-label") : a && e(`[aria-label="${y(a)}"]`, 70, "aria-label");
  const d = z(n);
  if (d.length > 0) {
    const o = n.tagName.toLowerCase();
    e(`${o}.${d.map(y).join(".")}`, 55, "tag + stable classes"), d.length > 1 && e(`.${y(d[0])}`, 40, "single class");
  }
  const m = F(n, s);
  return m && e(m, 28, "structural path (fragile — add a data-tour attribute)"), t.filter((o, p, h) => h.findIndex((g) => g.selector === o.selector) === p).sort((o, p) => p.score - o.score);
}
function U(n, s = document) {
  const t = K(n, s);
  if (t.length === 0) return null;
  const [e, ...c] = t, r = (n.textContent ?? "").replace(/\s+/g, " ").trim();
  return {
    selector: e.selector,
    score: e.score,
    reason: e.reason,
    fallbacks: c.filter((a) => a.score >= 40).slice(0, 2).map((a) => a.selector),
    text: r.length > 0 && r.length <= 60 ? r : void 0
  };
}
function Z(n, s = document) {
  return n.map((t) => {
    const e = O(t, s);
    return e === 0 ? { selector: t, matches: e, ok: !1, note: "no element matches" } : e > 1 ? { selector: t, matches: e, ok: !0, note: `matches ${e} elements; add target.index` } : { selector: t, matches: e, ok: !0 };
  });
}
const V = "[data-ot-recorder]";
function W(n = {}) {
  const s = n.minScore ?? 60, t = [], e = document.createElement("style");
  e.setAttribute("data-ot-recorder", ""), e.textContent = D, document.head.appendChild(e);
  const c = document.createElement("div");
  c.className = "ot-rec-highlight", c.setAttribute("data-ot-recorder", ""), c.style.display = "none";
  const r = document.createElement("div");
  r.className = "ot-rec-label", r.setAttribute("data-ot-recorder", ""), r.style.display = "none";
  const a = document.createElement("div");
  a.className = "ot-rec-panel", a.setAttribute("data-ot-recorder", ""), document.body.append(c, r, a);
  const d = () => ({
    specVersion: 1,
    id: n.tourId ?? "recorded-tour",
    title: n.title ?? "Recorded tour",
    trigger: { type: "manual" },
    steps: t.length > 0 ? t.map((u) => u.step) : [{ id: "step-1", title: "Untitled", content: "Add your copy here." }]
  }), m = () => JSON.stringify(d(), null, 2), o = () => {
    a.replaceChildren();
    const u = document.createElement("h4");
    u.textContent = `Recording — ${t.length} step${t.length === 1 ? "" : "s"}`, a.appendChild(u);
    const f = document.createElement("ul");
    f.className = "ot-rec-steps", t.forEach((E, T) => {
      const A = document.createElement("li");
      A.className = "ot-rec-step";
      const S = document.createElement("div");
      S.style.flex = "1", S.style.minWidth = "0";
      const R = document.createElement("div");
      R.textContent = `${T + 1}. ${typeof E.step.title == "string" ? E.step.title : E.step.id}`, S.appendChild(R);
      const j = document.createElement("code"), I = E.step.target?.selector;
      if (j.textContent = Array.isArray(I) ? I[0] : I ?? "(no target)", S.appendChild(j), E.score < s) {
        const k = document.createElement("div");
        k.textContent = `⚠ fragile (${E.score}) — ${E.reason}`, k.style.color = "#f59e0b", k.style.fontSize = "10.5px", S.appendChild(k);
      }
      const N = document.createElement("button");
      N.className = "ot-rec-btn ot-rec-btn--ghost", N.textContent = "×", N.title = "Remove step", N.addEventListener("click", () => {
        t.splice(T, 1), p(), o(), n.onChange?.(d());
      }), A.append(S, N), f.appendChild(A);
    }), a.appendChild(f);
    const i = document.createElement("div");
    i.className = "ot-rec-actions";
    const b = document.createElement("button");
    b.className = "ot-rec-btn", b.textContent = "Copy JSON", b.addEventListener("click", () => h());
    const C = document.createElement("button");
    C.className = "ot-rec-btn ot-rec-btn--ghost", C.textContent = "Stop", C.addEventListener("click", () => $()), i.append(b, C), a.appendChild(i);
    const L = document.createElement("div");
    L.style.cssText = "margin-top:8px;opacity:0.55;font-size:11px;line-height:1.45", L.textContent = "Click any element to capture it. Esc stops recording.", a.appendChild(L);
  }, p = () => {
    t.forEach((u, f) => {
      u.step.id = `step-${f + 1}`;
    });
  }, h = () => {
    const u = m();
    if (n.onExport) {
      n.onExport(d(), u);
      return;
    }
    navigator.clipboard?.writeText(u).catch(() => {
      console.log(u);
    });
  }, g = (u) => !!u?.closest?.(V), x = (u) => {
    const f = u.target;
    if (!f || g(f)) {
      c.style.display = "none", r.style.display = "none";
      return;
    }
    const i = f.getBoundingClientRect();
    c.style.display = "", c.style.left = `${i.x}px`, c.style.top = `${i.y}px`, c.style.width = `${i.width}px`, c.style.height = `${i.height}px`;
    const b = U(f);
    r.style.display = "", r.textContent = b ? `${b.selector}  (${b.score})` : f.tagName.toLowerCase();
    const C = i.y + i.height + 4;
    r.style.left = `${Math.max(4, i.x)}px`, r.style.top = C + 22 < window.innerHeight ? `${C}px` : `${Math.max(4, i.y - 22)}px`;
  }, l = (u) => {
    const f = u.target;
    if (!f || g(f)) return;
    u.preventDefault(), u.stopPropagation();
    const i = U(f);
    if (!i) return;
    const b = (f.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40), C = {
      id: `step-${t.length + 1}`,
      target: {
        selector: i.fallbacks.length > 0 ? [i.selector, ...i.fallbacks] : i.selector,
        ...i.score < s && i.text ? { text: i.text } : {}
      },
      title: b || "Untitled step",
      content: "Describe what the user should do here."
    };
    t.push({ step: C, score: i.score, reason: i.reason }), o(), n.onChange?.(d());
  }, v = (u) => {
    u.key === "Escape" && (u.preventDefault(), $());
  };
  document.addEventListener("pointermove", x, !0), document.addEventListener("click", l, !0), document.addEventListener("keydown", v, !0), o();
  let w = !1;
  const $ = () => {
    w || (w = !0, document.removeEventListener("pointermove", x, !0), document.removeEventListener("click", l, !0), document.removeEventListener("keydown", v, !0), c.remove(), r.remove(), a.remove(), e.remove());
  };
  return { stop: $, getSpec: d, toJSON: m };
}
function Q(n = "ot-record") {
  try {
    const t = new URLSearchParams(window.location.search).get(n);
    return !t || t === "0" || t === "false" ? null : W({ tourId: t === "1" ? void 0 : t });
  } catch {
    return null;
  }
}
function X(n) {
  const s = document.createElement("style");
  s.setAttribute("data-ot-debug", ""), s.textContent = D;
  const t = document.createElement("div");
  t.className = "ot-debug", t.setAttribute("data-ot-debug", ""), document.head.appendChild(s), document.body.appendChild(t);
  const e = (a, d, m) => {
    const o = document.createElement("div");
    o.className = "ot-debug-row";
    const p = document.createElement("span");
    p.className = "ot-debug-key", p.textContent = a;
    const h = document.createElement("span");
    return h.className = `ot-debug-val${m ? ` ot-debug-${m}` : ""}`, h.textContent = d, o.append(p, h), o;
  }, c = () => {
    const a = n.getActiveId(), d = n.getState(), m = n.getContext(), o = n.specs.find((l) => l.id === a);
    t.replaceChildren();
    const p = document.createElement("h4");
    p.textContent = "OpenTutorial debug", t.appendChild(p), t.appendChild(e("tour", a ?? "(none)")), t.appendChild(e("status", d?.status ?? "idle")), t.appendChild(e("step", d?.currentStepId ?? "—")), d && t.appendChild(e("position", `${d.index + 1} / ${d.total}`));
    const h = o?.steps.find((l) => l.id === d?.currentStepId);
    if (h?.target) {
      const l = B(h.target);
      t.appendChild(e(
        "target",
        l ? "resolved" : "NOT FOUND",
        l ? "ok" : "bad"
      )), t.appendChild(e("selector", H(h.target)));
    }
    const g = Object.keys(m);
    if (g.length > 0) {
      const l = document.createElement("h4");
      l.textContent = "context", l.style.marginTop = "10px", t.appendChild(l);
      for (const v of g.slice(0, 12))
        t.appendChild(e(v, JSON.stringify(m[v])?.slice(0, 40) ?? "undefined"));
    }
    const x = [];
    o?.audience?.showIf && x.push({ label: "audience", expr: o.audience.showIf });
    for (const l of o?.steps ?? [])
      l.showIf && x.push({ label: l.id, expr: l.showIf });
    if (x.length > 0) {
      const l = document.createElement("h4");
      l.textContent = "conditions", l.style.marginTop = "10px", t.appendChild(l);
      for (const { label: v, expr: w } of x.slice(0, 12)) {
        const $ = M(w, m);
        t.appendChild(e(v, `${w} → ${String($)}`, $ ? "ok" : "bad"));
      }
    }
  }, r = () => c();
  return window.addEventListener("opentutorial", r), c(), {
    update: c,
    destroy: () => {
      window.removeEventListener("opentutorial", r), t.remove(), s.remove();
    }
  };
}
function Y(n = "[opentutorial]") {
  const s = (t) => {
    const e = t.detail;
    if (!e) return;
    const c = [e.type, e.tourId, e.stepId].filter(Boolean).join(" · ");
    console.log(`${n} ${c}${e.duration ? ` (${e.duration}ms)` : ""}`);
  };
  return window.addEventListener("opentutorial", s), () => window.removeEventListener("opentutorial", s);
}
export {
  Z as auditSelectors,
  U as bestSelector,
  X as createDebugPanel,
  Q as enableRecorderFromUrl,
  K as generateSelectors,
  Y as logEvents,
  W as startRecorder
};
//# sourceMappingURL=authoring.js.map
