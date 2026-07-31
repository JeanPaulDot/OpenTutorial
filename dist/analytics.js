function d(t, n = {}) {
  const o = {
    tour_id: t.tourId,
    event_type: t.type
  };
  return t.stepId !== void 0 && (o.step_id = t.stepId), t.index !== void 0 && (o.step_index = t.index), t.total !== void 0 && (o.step_total = t.total), t.duration !== void 0 && (o.duration_ms = t.duration), t.reason !== void 0 && (o.reason = t.reason), t.selector !== void 0 && (o.selector = t.selector), t.message !== void 0 && (o.message = t.message), t.meta && Object.assign(o, t.meta), n.includeTimestamp !== !1 && (o.timestamp = t.timestamp), o;
}
function k(t, n = "Opentutorial") {
  return `${n} ${t.type}`;
}
function c(t) {
  try {
    t();
  } catch {
  }
}
function $(t) {
  return (n) => c(() => t.capture(k(n, "[Opentutorial]"), d(n)));
}
function T(t) {
  return (n) => c(() => t.track(k(n, "[Opentutorial]"), d(n)));
}
function D(t) {
  return (n) => c(() => t.track(k(n, "[Opentutorial]"), d(n, { includeTimestamp: !1 })));
}
function S(t) {
  return (n) => c(() => t.track(k(n, "Opentutorial"), d(n)));
}
function R(t) {
  return S(t);
}
function E(t) {
  return (n) => c(() => {
    (t ?? window.heap)?.track(`Opentutorial ${n.type}`, d(n));
  });
}
function N(t) {
  return (n) => c(() => {
    const o = window.gtag;
    typeof o == "function" && o("event", `opentutorial_${n.type.replace(/-/g, "_")}`, {
      ...d(n, { includeTimestamp: !1 }),
      send_to: t
    });
  });
}
function P(t) {
  return (n) => c(() => {
    (t ?? window.DD_RUM)?.addAction(`opentutorial.${n.type}`, d(n));
  });
}
function B(t = console.log) {
  return (n) => c(() => t(`[opentutorial] ${n.type}`, d(n)));
}
function F(...t) {
  const n = t.filter((o) => typeof o == "function");
  return (o) => {
    for (const r of n) c(() => r(o));
  };
}
function H(t, n) {
  const o = new Set(n);
  return (r) => {
    o.has(r.type) && t(r);
  };
}
function J(t) {
  const {
    endpoint: n,
    headers: o,
    batchSize: r = 20,
    flushMs: f = 5e3,
    storage: l,
    storageKey: M = "ot:analytics:queue",
    maxQueue: g = 500,
    transform: h,
    fetchImpl: m,
    onError: I
  } = t, y = m ?? (typeof fetch == "function" ? fetch.bind(globalThis) : void 0);
  let i = [], w = null, O = !1;
  const A = () => ({
    "content-type": "application/json",
    ...typeof o == "function" ? o() : o ?? {}
  }), e = () => {
    l && c(() => l.setItem(M, JSON.stringify(i)));
  };
  l && Promise.resolve(l.getItem(M)).then((a) => {
    if (typeof a == "string")
      try {
        const p = JSON.parse(a);
        Array.isArray(p) && (i = [...p, ...i].slice(-g));
      } catch {
      }
  });
  const s = async () => {
    if (O || i.length === 0 || !y) return;
    O = !0;
    const a = i.splice(0, Math.max(r, 1));
    e();
    try {
      const p = await y(n, {
        method: "POST",
        headers: A(),
        body: JSON.stringify({ events: a }),
        keepalive: !0
      });
      if (!p.ok) throw new Error(`HTTP ${p.status}`);
    } catch (p) {
      i = [...a, ...i].slice(-g), e(), I?.(p, a);
    } finally {
      O = !1;
    }
  }, u = () => {
    w || (w = setTimeout(() => {
      w = null, s();
    }, f));
  };
  return typeof window < "u" && (window.addEventListener("online", () => {
    s();
  }), window.addEventListener("pagehide", () => {
    if (i.length === 0) return;
    _(n, { events: i }) && (i = [], e());
  })), (a) => c(() => {
    i.push(h ? h(a) : d(a)), i.length > g && (i = i.slice(-g)), e(), i.length >= r ? s() : u();
  });
}
function _(t, n) {
  try {
    return typeof navigator > "u" || typeof navigator.sendBeacon != "function" ? !1 : navigator.sendBeacon(t, new Blob([JSON.stringify(n)], { type: "application/json" }));
  } catch {
    return !1;
  }
}
function b(t) {
  if (t.length === 0) return 0;
  const n = [...t].sort((r, f) => r - f), o = Math.floor(n.length / 2);
  return n.length % 2 === 0 ? Math.round((n[o - 1] + n[o]) / 2) : n[o];
}
function x(t, n, o) {
  const r = t.filter((e) => e.tourId === n), f = r.filter((e) => e.type === "started" || e.type === "resumed").length, l = r.filter((e) => e.type === "completed").length, M = r.filter((e) => e.type === "skipped").length, g = r.filter((e) => (e.type === "completed" || e.type === "skipped") && typeof e.duration == "number").map((e) => e.duration), h = [], m = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
  for (const e of r)
    if (e.type === "step-shown" && e.stepId && (h.includes(e.stepId) || h.push(e.stepId), m.set(e.stepId, (m.get(e.stepId) ?? 0) + 1)), e.type === "step-completed" && e.stepId && (I.set(e.stepId, (I.get(e.stepId) ?? 0) + 1), typeof e.duration == "number")) {
      const s = y.get(e.stepId) ?? [];
      s.push(e.duration), y.set(e.stepId, s);
    }
  const w = (o ? o.steps.map((e) => e.id).filter((e) => m.has(e)) : h).map((e, s) => {
    const u = m.get(e) ?? 0, a = I.get(e) ?? 0, p = Math.max(0, u - a);
    return {
      stepId: e,
      index: s,
      views: u,
      completions: a,
      dropOffs: p,
      dropOffRate: u > 0 ? p / u : 0,
      medianDurationMs: b(y.get(e) ?? [])
    };
  }), O = w.reduce(
    (e, s) => s.dropOffs > 0 && (!e || s.dropOffRate > e.dropOffRate) ? s : e,
    null
  ), A = /* @__PURE__ */ new Map();
  for (const e of r) {
    if (e.type !== "target-not-found" || !e.stepId) continue;
    const s = `${e.stepId}::${e.selector ?? ""}`, u = A.get(s);
    u ? u.count += 1 : A.set(s, { stepId: e.stepId, selector: e.selector ?? "", count: 1 });
  }
  return {
    tourId: n,
    starts: f,
    completions: l,
    skips: M,
    completionRate: f > 0 ? l / f : 0,
    medianDurationMs: b(g),
    steps: w,
    worstStep: O,
    targetsNotFound: [...A.values()].sort((e, s) => s.count - e.count)
  };
}
function j(t = 5e3) {
  const n = [];
  return {
    adapter: (o) => {
      n.push(o), n.length > t && n.splice(0, n.length - t);
    },
    events: n,
    report: (o, r) => x(n, o, r),
    clear: () => {
      n.length = 0;
    }
  };
}
export {
  D as createAmplitudeAdapter,
  P as createDatadogAdapter,
  B as createDebugAdapter,
  j as createEventCollector,
  x as createFunnelReport,
  N as createGA4Adapter,
  E as createHeapAdapter,
  J as createHttpAdapter,
  T as createMixpanelAdapter,
  F as createMultiAdapter,
  $ as createPostHogAdapter,
  R as createRudderStackAdapter,
  S as createSegmentAdapter,
  k as eventName,
  H as filterEvents,
  d as toProperties
};
//# sourceMappingURL=analytics.js.map
