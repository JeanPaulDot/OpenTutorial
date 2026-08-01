function y(t, e = {}) {
  const o = {
    tour_id: t.tourId,
    event_type: t.type
  };
  return t.stepId !== void 0 && (o.step_id = t.stepId), t.index !== void 0 && (o.step_index = t.index), t.total !== void 0 && (o.step_total = t.total), t.duration !== void 0 && (o.duration_ms = t.duration), t.reason !== void 0 && (o.reason = t.reason), t.selector !== void 0 && (o.selector = t.selector), t.message !== void 0 && (o.message = t.message), t.meta && Object.assign(o, t.meta), e.includeTimestamp !== !1 && (o.timestamp = t.timestamp), o;
}
function S(t, e = "OpenTutorial") {
  return `${e} ${t.type}`;
}
function u(t) {
  try {
    t();
  } catch {
  }
}
function E(t) {
  return (e) => u(() => t.capture(S(e, "[OpenTutorial]"), y(e)));
}
function R(t) {
  return (e) => u(() => t.track(S(e, "[OpenTutorial]"), y(e)));
}
function N(t) {
  return (e) => u(() => t.track(S(e, "[OpenTutorial]"), y(e, { includeTimestamp: !1 })));
}
function k(t) {
  return (e) => u(() => t.track(S(e, "OpenTutorial"), y(e)));
}
function P(t) {
  return k(t);
}
function B(t) {
  return (e) => u(() => {
    (t ?? window.heap)?.track(`OpenTutorial ${e.type}`, y(e));
  });
}
function F(t) {
  return (e) => u(() => {
    const o = window.gtag;
    typeof o == "function" && o("event", `opentutorial_${e.type.replace(/-/g, "_")}`, {
      ...y(e, { includeTimestamp: !1 }),
      send_to: t
    });
  });
}
function H(t) {
  return (e) => u(() => {
    (t ?? window.DD_RUM)?.addAction(`opentutorial.${e.type}`, y(e));
  });
}
function J(t = console.log) {
  return (e) => u(() => t(`[opentutorial] ${e.type}`, y(e)));
}
function j(...t) {
  const e = t.filter((o) => typeof o == "function");
  return (o) => {
    for (const r of e) u(() => r(o));
  };
}
function q(t, e) {
  const o = new Set(e);
  return (r) => {
    o.has(r.type) && t(r);
  };
}
function C(t) {
  const {
    endpoint: e,
    headers: o,
    batchSize: r = 20,
    flushMs: l = 5e3,
    storage: h,
    storageKey: w = "ot:analytics:queue",
    maxQueue: g = 500,
    transform: a,
    fetchImpl: p,
    onError: f
  } = t, I = p ?? (typeof fetch == "function" ? fetch.bind(globalThis) : void 0);
  let i = [], A = null, O = !1;
  const M = () => ({
    "content-type": "application/json",
    ...typeof o == "function" ? o() : o ?? {}
  }), n = () => {
    h && u(() => h.setItem(w, JSON.stringify(i)));
  };
  h && Promise.resolve(h.getItem(w)).then((c) => {
    if (typeof c == "string")
      try {
        const d = JSON.parse(c);
        Array.isArray(d) && (i = [...d, ...i].slice(-g));
      } catch {
      }
  });
  const s = async () => {
    if (O || i.length === 0 || !I) return;
    O = !0;
    const c = i.splice(0, Math.max(r, 1));
    n();
    try {
      const d = await I(e, {
        method: "POST",
        headers: M(),
        body: JSON.stringify({ events: c }),
        keepalive: !0
      });
      if (!d.ok) throw new Error(`HTTP ${d.status}`);
    } catch (d) {
      i = [...c, ...i].slice(-g), n(), f?.(d, c);
    } finally {
      O = !1;
    }
  }, m = () => {
    A || (A = setTimeout(() => {
      A = null, s();
    }, l));
  };
  return typeof window < "u" && (window.addEventListener("online", () => {
    s();
  }), window.addEventListener("pagehide", () => {
    if (i.length === 0) return;
    b(e, { events: i }) && (i = [], n());
  })), (c) => u(() => {
    i.push(a ? a(c) : y(c)), i.length > g && (i = i.slice(-g)), n(), i.length >= r ? s() : m();
  });
}
function b(t, e) {
  try {
    return typeof navigator > "u" || typeof navigator.sendBeacon != "function" ? !1 : navigator.sendBeacon(t, new Blob([JSON.stringify(e)], { type: "application/json" }));
  } catch {
    return !1;
  }
}
function T(t) {
  if (t.length === 0) return 0;
  const e = [...t].sort((r, l) => r - l), o = Math.floor(e.length / 2);
  return e.length % 2 === 0 ? Math.round((e[o - 1] + e[o]) / 2) : e[o];
}
function $(t, e, o) {
  const r = t.filter((n) => n.tourId === e), l = r.filter((n) => n.type === "started" || n.type === "resumed").length, h = r.filter((n) => n.type === "completed").length, w = r.filter((n) => n.type === "skipped").length, g = r.filter((n) => (n.type === "completed" || n.type === "skipped") && typeof n.duration == "number").map((n) => n.duration), a = [], p = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  for (const n of r)
    if (n.type === "step-shown" && n.stepId && (a.includes(n.stepId) || a.push(n.stepId), p.set(n.stepId, (p.get(n.stepId) ?? 0) + 1)), n.type === "step-completed" && n.stepId && (f.set(n.stepId, (f.get(n.stepId) ?? 0) + 1), typeof n.duration == "number")) {
      const s = I.get(n.stepId) ?? [];
      s.push(n.duration), I.set(n.stepId, s);
    }
  const A = (o ? o.steps.map((n) => n.id).filter((n) => p.has(n)) : a).map((n, s) => {
    const m = p.get(n) ?? 0, c = f.get(n) ?? 0, d = Math.max(0, m - c);
    return {
      stepId: n,
      index: s,
      views: m,
      completions: c,
      dropOffs: d,
      dropOffRate: m > 0 ? d / m : 0,
      medianDurationMs: T(I.get(n) ?? [])
    };
  }), O = A.reduce(
    (n, s) => s.dropOffs > 0 && (!n || s.dropOffRate > n.dropOffRate) ? s : n,
    null
  ), M = /* @__PURE__ */ new Map();
  for (const n of r) {
    if (n.type !== "target-not-found" || !n.stepId) continue;
    const s = `${n.stepId}::${n.selector ?? ""}`, m = M.get(s);
    m ? m.count += 1 : M.set(s, { stepId: n.stepId, selector: n.selector ?? "", count: 1 });
  }
  return {
    tourId: e,
    starts: l,
    completions: h,
    skips: w,
    completionRate: l > 0 ? h / l : 0,
    medianDurationMs: T(g),
    steps: A,
    worstStep: O,
    targetsNotFound: [...M.values()].sort((n, s) => s.count - n.count)
  };
}
function L(t = 5e3) {
  const e = [];
  return {
    adapter: (o) => {
      e.push(o), e.length > t && e.splice(0, e.length - t);
    },
    events: e,
    report: (o, r) => $(e, o, r),
    clear: () => {
      e.length = 0;
    }
  };
}
function _(t) {
  let e = 2166136261;
  for (let o = 0; o < t.length; o += 1)
    e ^= t.charCodeAt(o), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function x(t) {
  return _(t) / 4294967296;
}
function D(t, e, o = "") {
  return e >= 1 ? !0 : e <= 0 ? !1 : x(`${o}:${t}`) < e;
}
function v(t, e) {
  const { rate: o, key: r = (a) => a.tourId, always: l = [], salt: h = "" } = e, w = new Set(l), g = /* @__PURE__ */ new Map();
  return (a) => {
    if (w.has(a.type)) {
      t(a);
      return;
    }
    const p = r(a);
    let f = g.get(p);
    f === void 0 && (f = D(p, o, h), g.set(p, f)), f && t(a);
  };
}
function z(t, e) {
  const o = new Set(e);
  return (r) => {
    o.has(r.type) && t(r);
  };
}
export {
  N as createAmplitudeAdapter,
  H as createDatadogAdapter,
  J as createDebugAdapter,
  L as createEventCollector,
  $ as createFunnelReport,
  F as createGA4Adapter,
  B as createHeapAdapter,
  C as createHttpAdapter,
  R as createMixpanelAdapter,
  j as createMultiAdapter,
  E as createPostHogAdapter,
  P as createRudderStackAdapter,
  k as createSegmentAdapter,
  S as eventName,
  q as filterEvents,
  x as sampleValue,
  D as shouldSample,
  y as toProperties,
  z as withEventTypes,
  v as withSampling
};
//# sourceMappingURL=analytics.js.map
