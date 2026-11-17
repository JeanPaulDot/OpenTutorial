import { C as U, k as H, d as P, a as W, b as J, n as _ } from "./chunks/safeEval.es.js";
const z = [
  "data-tour",
  "data-testid",
  "data-test-id",
  "data-test",
  "data-cy",
  "data-qa",
  "data-automation-id"
], F = /^(css-[a-z0-9]+|sc-[a-zA-Z0-9]+|jsx-\d+|[a-z]+-[a-f0-9]{5,}|_[\w-]{5,})$/, q = /(^|[-_:])(\d{3,}|[a-f0-9]{8,}|uid|uuid|react-aria|radix|headlessui|mui-)/i;
function y(t) {
  return typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(t) : t.replace(/["\\]/g, "\\$&");
}
function R(t, o = document) {
  try {
    return o.querySelectorAll(t).length;
  } catch {
    return 0;
  }
}
function B(t) {
  return Array.from(t.classList).filter(
    (o) => o.length > 1 && !F.test(o) && !o.startsWith("ot-")
  );
}
function V(t) {
  const o = t.parentElement;
  return o ? Array.from(o.children).filter((e) => e.tagName === t.tagName).indexOf(t) + 1 : 1;
}
function G(t, o = document) {
  const n = [];
  let e = t, a = 0;
  for (; e && e.nodeType === 1 && a < 6; ) {
    if (e.id && !q.test(e.id)) {
      n.unshift(`#${y(e.id)}`);
      break;
    }
    const i = e.tagName.toLowerCase();
    if (i === "html" || i === "body") {
      n.unshift(i);
      break;
    }
    const s = B(e);
    let c = s.length > 0 ? `${i}.${y(s[0])}` : i;
    const h = e.parentElement;
    h && Array.from(h.children).filter(
      (m) => m.tagName === e.tagName && (s.length === 0 || m.classList.contains(s[0]))
    ).length > 1 && (c += `:nth-of-type(${V(e)})`), n.unshift(c), e = h, a += 1;
    const r = n.join(" > ");
    if (R(r, o) === 1) break;
  }
  return n.join(" > ");
}
function K(t, o = document) {
  const n = [], e = (r, l, m) => {
    const f = R(r, o);
    if (f === 0) return;
    const x = f === 1 ? l : Math.max(10, l - 25);
    n.push({ selector: r, score: x, reason: m, matches: f });
  };
  for (const r of z) {
    const l = t.getAttribute(r);
    l && e(`[${r}="${y(l)}"]`, r === "data-tour" ? 100 : 92, `explicit ${r} hook`);
  }
  if (t.id) {
    const r = !q.test(t.id);
    e(`#${y(t.id)}`, r ? 85 : 45, r ? "element id" : "id looks generated");
  }
  const a = t.getAttribute("name");
  a && e(`${t.tagName.toLowerCase()}[name="${y(a)}"]`, 78, "form field name");
  const i = t.getAttribute("role"), s = t.getAttribute("aria-label");
  i && s ? e(`[role="${y(i)}"][aria-label="${y(s)}"]`, 74, "role + aria-label") : s && e(`[aria-label="${y(s)}"]`, 70, "aria-label");
  const c = B(t);
  if (c.length > 0) {
    const r = t.tagName.toLowerCase();
    e(`${r}.${c.map(y).join(".")}`, 55, "tag + stable classes"), c.length > 1 && e(`.${y(c[0])}`, 40, "single class");
  }
  const h = G(t, o);
  return h && e(h, 28, "structural path (fragile — add a data-tour attribute)"), n.filter((r, l, m) => m.findIndex((f) => f.selector === r.selector) === l).sort((r, l) => l.score - r.score);
}
function I(t, o = document) {
  const n = K(t, o);
  if (n.length === 0) return null;
  const [e, ...a] = n, i = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  return {
    selector: e.selector,
    score: e.score,
    reason: e.reason,
    fallbacks: a.filter((s) => s.score >= 40).slice(0, 2).map((s) => s.selector),
    text: i.length > 0 && i.length <= 60 ? i : void 0
  };
}
function ne(t, o = document) {
  return t.map((n) => {
    const e = R(n, o);
    return e === 0 ? { selector: n, matches: e, ok: !1, note: "no element matches" } : e > 1 ? { selector: n, matches: e, ok: !0, note: `matches ${e} elements; add target.index` } : { selector: n, matches: e, ok: !0 };
  });
}
const Y = "[data-ot-recorder]";
function X(t = {}) {
  const o = t.minScore ?? 60, n = [], e = document.createElement("style");
  e.setAttribute("data-ot-recorder", ""), e.textContent = U, document.head.appendChild(e);
  const a = document.createElement("div");
  a.className = "ot-rec-highlight", a.setAttribute("data-ot-recorder", ""), a.style.display = "none";
  const i = document.createElement("div");
  i.className = "ot-rec-label", i.setAttribute("data-ot-recorder", ""), i.style.display = "none";
  const s = document.createElement("div");
  s.className = "ot-rec-panel", s.setAttribute("data-ot-recorder", ""), document.body.append(a, i, s);
  const c = () => ({
    specVersion: 1,
    id: t.tourId ?? "recorded-tour",
    title: t.title ?? "Recorded tour",
    trigger: { type: "manual" },
    steps: n.length > 0 ? n.map((p) => p.step) : [{ id: "step-1", title: "Untitled", content: "Add your copy here." }]
  }), h = () => JSON.stringify(c(), null, 2), r = () => {
    s.replaceChildren();
    const p = document.createElement("h4");
    p.textContent = `Recording — ${n.length} step${n.length === 1 ? "" : "s"}`, s.appendChild(p);
    const g = document.createElement("ul");
    g.className = "ot-rec-steps", n.forEach((C, j) => {
      const L = document.createElement("li");
      L.className = "ot-rec-step";
      const S = document.createElement("div");
      S.style.flex = "1", S.style.minWidth = "0";
      const D = document.createElement("div");
      D.textContent = `${j + 1}. ${typeof C.step.title == "string" ? C.step.title : C.step.id}`, S.appendChild(D);
      const M = document.createElement("code"), O = C.step.target?.selector;
      if (M.textContent = Array.isArray(O) ? O[0] : O ?? "(no target)", S.appendChild(M), C.score < o) {
        const A = document.createElement("div");
        A.textContent = `⚠ fragile (${C.score}) — ${C.reason}`, A.style.color = "#f59e0b", A.style.fontSize = "10.5px", S.appendChild(A);
      }
      const k = document.createElement("button");
      k.className = "ot-rec-btn ot-rec-btn--ghost", k.textContent = "×", k.title = "Remove step", k.addEventListener("click", () => {
        n.splice(j, 1), l(), r(), t.onChange?.(c());
      }), L.append(S, k), g.appendChild(L);
    }), s.appendChild(g);
    const d = document.createElement("div");
    d.className = "ot-rec-actions";
    const b = document.createElement("button");
    b.className = "ot-rec-btn", b.textContent = "Copy JSON", b.addEventListener("click", () => m());
    const v = document.createElement("button");
    v.className = "ot-rec-btn ot-rec-btn--ghost", v.textContent = "Stop", v.addEventListener("click", () => w()), d.append(b, v), s.appendChild(d);
    const N = document.createElement("div");
    N.style.cssText = "margin-top:8px;opacity:0.55;font-size:11px;line-height:1.45", N.textContent = "Click any element to capture it. Esc stops recording.", s.appendChild(N);
  }, l = () => {
    n.forEach((p, g) => {
      p.step.id = `step-${g + 1}`;
    });
  }, m = () => {
    const p = h();
    if (t.onExport) {
      t.onExport(c(), p);
      return;
    }
    navigator.clipboard?.writeText(p).catch(() => {
      console.log(p);
    });
  }, f = (p) => !!p?.closest?.(Y), x = (p) => {
    const g = p.target;
    if (!g || f(g)) {
      a.style.display = "none", i.style.display = "none";
      return;
    }
    const d = g.getBoundingClientRect();
    a.style.display = "", a.style.left = `${d.x}px`, a.style.top = `${d.y}px`, a.style.width = `${d.width}px`, a.style.height = `${d.height}px`;
    const b = I(g);
    i.style.display = "", i.textContent = b ? `${b.selector}  (${b.score})` : g.tagName.toLowerCase();
    const v = d.y + d.height + 4;
    i.style.left = `${Math.max(4, d.x)}px`, i.style.top = v + 22 < window.innerHeight ? `${v}px` : `${Math.max(4, d.y - 22)}px`;
  }, u = (p) => {
    const g = p.target;
    if (!g || f(g)) return;
    p.preventDefault(), p.stopPropagation();
    const d = I(g);
    if (!d) return;
    const b = (g.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40), v = {
      id: `step-${n.length + 1}`,
      target: {
        selector: d.fallbacks.length > 0 ? [d.selector, ...d.fallbacks] : d.selector,
        ...d.score < o && d.text ? { text: d.text } : {}
      },
      title: b || "Untitled step",
      content: "Describe what the user should do here."
    };
    n.push({ step: v, score: d.score, reason: d.reason }), r(), t.onChange?.(c());
  }, $ = (p) => {
    p.key === "Escape" && (p.preventDefault(), w());
  };
  document.addEventListener("pointermove", x, !0), document.addEventListener("click", u, !0), document.addEventListener("keydown", $, !0), r();
  let E = !1;
  const w = () => {
    E || (E = !0, document.removeEventListener("pointermove", x, !0), document.removeEventListener("click", u, !0), document.removeEventListener("keydown", $, !0), a.remove(), i.remove(), s.remove(), e.remove());
  };
  return { stop: w, getSpec: c, toJSON: h };
}
function oe(t = "ot-record") {
  try {
    const n = new URLSearchParams(window.location.search).get(t);
    return !n || n === "0" || n === "false" ? null : X({ tourId: n === "1" ? void 0 : n });
  } catch {
    return null;
  }
}
function se(t) {
  const o = document.createElement("style");
  o.setAttribute("data-ot-debug", ""), o.textContent = U;
  const n = document.createElement("div");
  n.className = "ot-debug", n.setAttribute("data-ot-debug", ""), document.head.appendChild(o), document.body.appendChild(n);
  const e = (s, c, h) => {
    const r = document.createElement("div");
    r.className = "ot-debug-row";
    const l = document.createElement("span");
    l.className = "ot-debug-key", l.textContent = s;
    const m = document.createElement("span");
    return m.className = `ot-debug-val${h ? ` ot-debug-${h}` : ""}`, m.textContent = c, r.append(l, m), r;
  }, a = () => {
    const s = t.getActiveId(), c = t.getState(), h = t.getContext(), r = t.specs.find((u) => u.id === s);
    n.replaceChildren();
    const l = document.createElement("h4");
    l.textContent = "OpenTutorial debug", n.appendChild(l), n.appendChild(e("tour", s ?? "(none)")), n.appendChild(e("status", c?.status ?? "idle")), n.appendChild(e("step", c?.currentStepId ?? "—")), c && n.appendChild(e("position", `${c.index + 1} / ${c.total}`));
    const m = r?.steps.find((u) => u.id === c?.currentStepId);
    if (m?.target) {
      const u = H(m.target);
      n.appendChild(e(
        "target",
        u ? "resolved" : "NOT FOUND",
        u ? "ok" : "bad"
      )), n.appendChild(e("selector", P(m.target)));
    }
    const f = Object.keys(h);
    if (f.length > 0) {
      const u = document.createElement("h4");
      u.textContent = "context", u.style.marginTop = "10px", n.appendChild(u);
      for (const $ of f.slice(0, 12))
        n.appendChild(e($, JSON.stringify(h[$])?.slice(0, 40) ?? "undefined"));
    }
    const x = [];
    r?.audience?.showIf && x.push({ label: "audience", expr: r.audience.showIf });
    for (const u of r?.steps ?? [])
      u.showIf && x.push({ label: u.id, expr: u.showIf });
    if (x.length > 0) {
      const u = document.createElement("h4");
      u.textContent = "conditions", u.style.marginTop = "10px", n.appendChild(u);
      for (const { label: $, expr: E } of x.slice(0, 12)) {
        const w = W(E, h);
        n.appendChild(e($, `${E} → ${String(w)}`, w ? "ok" : "bad"));
      }
    }
  }, i = () => a();
  return window.addEventListener("opentutorial", i), a(), {
    update: a,
    destroy: () => {
      window.removeEventListener("opentutorial", i), n.remove(), o.remove();
    }
  };
}
function re(t = "[opentutorial]") {
  const o = (n) => {
    const e = n.detail;
    if (!e) return;
    const a = [e.type, e.tourId, e.stepId].filter(Boolean).join(" · ");
    console.log(`${t} ${a}${e.duration ? ` (${e.duration}ms)` : ""}`);
  };
  return window.addEventListener("opentutorial", o), () => window.removeEventListener("opentutorial", o);
}
const Z = [
  "[data-tour]",
  "[data-testid]",
  "[data-test]",
  "[data-cy]",
  "button",
  "a[href]",
  "input",
  "select",
  "textarea",
  "summary",
  '[role="button"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="link"]',
  '[role="switch"]',
  "nav",
  "main",
  "aside",
  "form",
  "h1",
  "h2",
  "h3"
].join(","), Q = {
  BUTTON: "button",
  A: "link",
  NAV: "navigation",
  MAIN: "main",
  ASIDE: "complementary",
  FORM: "form",
  SELECT: "combobox",
  TEXTAREA: "textbox",
  INPUT: "textbox",
  H1: "heading",
  H2: "heading",
  H3: "heading",
  SUMMARY: "button"
};
function ee(t) {
  const o = t.getAttribute("aria-label"), n = t.getAttribute("placeholder"), e = (o ?? t.textContent ?? n ?? "").replace(/\s+/g, " ").trim();
  return e ? e.length > 80 ? `${e.slice(0, 77)}…` : e : n ?? void 0;
}
function ae(t = document, o = {}) {
  const { limit: n = 60, minScore: e = 0, includeHidden: a = !1 } = o, i = t.nodeType === 9 ? t : t.ownerDocument ?? document, s = /* @__PURE__ */ new Set(), c = [];
  let h;
  try {
    h = Array.from(t.querySelectorAll(Z));
  } catch {
    return [];
  }
  for (const r of h) {
    if (r.closest(".ot-root, [data-opentutorial], [data-ot-recorder], [data-ot-debug]")) continue;
    const l = r.getBoundingClientRect(), m = l.width > 0 || l.height > 0;
    if (!m && !a) continue;
    const f = I(r, i);
    !f || f.score < e || s.has(f.selector) || (s.add(f.selector), c.push({
      selector: f.selector,
      score: f.score,
      tag: r.tagName.toLowerCase(),
      role: r.getAttribute("role") ?? Q[r.tagName],
      text: ee(r),
      visible: m
    }));
  }
  return c.sort((r, l) => l.score - r.score), c.slice(0, n);
}
function T(t) {
  return t === void 0 ? "" : typeof t == "string" ? t : t.fallback ?? t.key;
}
function ie(t) {
  const o = [];
  o.push(`Tour "${T(t.title)}" (${t.id}) — ${t.steps.length} step(s).`);
  const n = t.trigger;
  if (!n || n.type === "manual" ? o.push("Starts: manually.") : n.type === "route" ? o.push(`Starts: on route ${n.path}.`) : n.type === "event" ? o.push(`Starts: on the "${n.event}" event.`) : n.type === "element" ? o.push(`Starts: when ${n.selector} appears.`) : n.type === "idle" ? o.push(`Starts: after ${n.ms}ms idle.`) : n.type === "scroll" ? o.push(`Starts: at ${n.percent}% scroll.`) : n.type === "context" ? o.push(`Starts: when ${n.when} becomes true.`) : o.push("Starts: automatically."), t.audience?.showIf && o.push(`Audience: ${t.audience.showIf}.`), t.frequency) {
    const e = t.frequency, a = [
      e.max !== void 0 ? `at most ${e.max} time(s)` : "",
      e.cooldown !== void 0 ? `${e.cooldown}ms apart` : "",
      e.perSession !== void 0 ? `${e.perSession} per session` : ""
    ].filter(Boolean);
    a.length && o.push(`Frequency: ${a.join(", ")}.`);
  }
  return t.steps.forEach((e, a) => {
    const i = e.target ? (Array.isArray(e.target.selector) ? e.target.selector[0] : e.target.selector) ?? (e.target.text ? `text "${e.target.text}"` : "") : "", s = J(_(e.content, T)).slice(0, 140), c = [
      `${a + 1}. [${e.id}] ${T(e.title)}`,
      i ? `→ ${i}` : "(centred)",
      e.advanceOn && e.advanceOn !== "button" ? `advances on ${e.advanceOn}` : "",
      e.showIf ? `only if ${e.showIf}` : "",
      e.nextWhen ? `continue when ${e.nextWhen}` : ""
    ].filter(Boolean);
    o.push(c.join(" · ")), s && o.push(`   "${s}"`);
  }), t.onComplete?.startTour && o.push(`Then starts: ${t.onComplete.startTour}.`), o.join(`
`);
}
function ce(t = {}) {
  const { goal: o, anchors: n = [], contextKeys: e = [], maxSteps: a = 6 } = t, i = n.length > 0 ? n.map((s) => `- ${s.selector}  (${s.role ?? s.tag}${s.text ? `: "${s.text}"` : ""}, stability ${s.score})`).join(`
`) : '(none supplied — use placement "center" with no target rather than inventing selectors)';
  return [
    "You write product tours as OpenTutorial TutorialSpec JSON.",
    "Reply with one JSON object and nothing else — no prose, no code fence.",
    "",
    "Shape:",
    "{",
    '  "specVersion": 1,',
    '  "id": "kebab-case-id",',
    '  "title": "Short title",',
    '  "trigger": { "type": "manual" },',
    '  "steps": [',
    "    {",
    '      "id": "kebab-case-step-id",',
    '      "title": "Required, under 60 characters",',
    '      "content": "Markdown. One or two short sentences.",',
    '      "target": { "selector": "<one of the selectors listed below>" },',
    '      "placement": "auto"',
    "    }",
    "  ]",
    "}",
    "",
    "Rules:",
    `- At most ${a} steps. One idea per step.`,
    '- "specVersion" is always 1. Every id is kebab-case and unique.',
    '- Every step needs "id", "title" and "content".',
    "- Use ONLY selectors from the list below. Never invent one. A step with no good",
    '  target omits "target" and sets "placement": "center".',
    "- Prefer selectors with stability 70 or higher.",
    '- "placement": auto | top | bottom | left | right (optionally -start / -end) | center.',
    '- "advanceOn": "button" (default) or "target-click" when the step asks the user to',
    '  click the highlighted element. "target-click" requires a target.',
    '- Conditions ("showIf", "nextWhen", "audience.showIf") are expressions over the context:',
    "  comparisons, && || !, arithmetic, a.b.c, list[0], and the methods includes,",
    "  startsWith, endsWith, matches. No function calls beyond those.",
    "- To ask the user something, use content blocks:",
    '  "content": { "blocks": [',
    '    { "type": "text", "value": "What best describes you?" },',
    '    { "type": "choice", "name": "role", "options": ["Developer", "Designer"] }',
    "  ] }",
    '  and gate the step with "nextWhen": "role". Field names must be identifiers.',
    "- Do not include keys that are not described here.",
    "",
    "Selectors available on this page:",
    i,
    "",
    e.length > 0 ? `Context keys you may use in conditions: ${e.join(", ")}.` : "No context keys are available; avoid conditions unless you create the key with a choice or input block.",
    "",
    o ? `Goal: ${o}` : "Goal: introduce the most important parts of this page to a first-time user."
  ].join(`
`);
}
function le(t) {
  if (typeof t != "string") return null;
  const o = t.indexOf("{"), n = t.lastIndexOf("}");
  if (o === -1 || n <= o) return null;
  try {
    return JSON.parse(t.slice(o, n + 1));
  } catch {
    return null;
  }
}
export {
  ne as auditSelectors,
  I as bestSelector,
  ae as collectAnchors,
  ce as createAuthoringPrompt,
  se as createDebugPanel,
  ie as describeSpec,
  oe as enableRecorderFromUrl,
  le as extractSpec,
  K as generateSelectors,
  re as logEvents,
  X as startRecorder
};
//# sourceMappingURL=authoring.js.map
