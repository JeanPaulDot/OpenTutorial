import { jsx as e, jsxs as b, Fragment as X } from "react/jsx-runtime";
import { isValidElement as oe, cloneElement as ae, useState as S, useRef as M, useEffect as R, useCallback as ce, useMemo as O, useContext as le, createContext as ie } from "react";
import { createPortal as ue } from "react-dom";
import { TourOrchestrator as de, resolveText as z, TourPersistence as Y, renderInline as Z, normalizeContent as he, renderBlocks as me } from "./index.js";
import { DEFAULT_LABELS as Re, MemoryStorage as De, TourEngine as _e, assertValidSpec as Me, blocksToText as Oe, createCookieStorage as qe, createIndexedDBStorage as Fe, createKeyResolver as He, createLocaleResolver as Be, createMemoryStorage as Ie, createRemoteStorage as Ve, createTour as Pe, createTours as je, createTutorialLayer as ze, currentPath as Ge, defineSpec as Je, defineStep as Ke, escapeHtml as Qe, extendSpec as Ue, installTrigger as We, interpolate as Xe, matchPath as Ye, onLocationChange as Ze, resolveLabel as et, validateSpec as tt, validateSpecs as rt } from "./index.js";
import { r as pe } from "./chunks/target.es.js";
import { C as st, c as ot, d as at, e as ct, a as lt, i as it, q as ut, s as dt, w as ht, b as mt } from "./chunks/target.es.js";
import { createAmplitudeAdapter as bt, createDatadogAdapter as vt, createDebugAdapter as ft, createEventCollector as gt, createFunnelReport as yt, createGA4Adapter as Nt, createHeapAdapter as kt, createHttpAdapter as Ct, createMixpanelAdapter as xt, createMultiAdapter as wt, createPostHogAdapter as St, createRudderStackAdapter as Tt, createSegmentAdapter as Et, filterEvents as Lt } from "./analytics.js";
const ee = ie(null);
function Ne({
  specs: t,
  context: n,
  theme: u,
  zIndex: m,
  storage: d,
  keyPrefix: x,
  userId: p,
  onEvent: k,
  deepLinkParam: w = "tour",
  locale: g,
  i18nResolver: h,
  dir: T,
  resume: i,
  progressTtl: y,
  autoResume: v,
  interaction: o,
  container: N,
  isolate: s,
  allowHtml: C,
  strict: A,
  onNavigate: L,
  beforeNext: $,
  renderStep: a,
  dev: c,
  debug: _,
  children: f
}) {
  const [q, D] = S([]), [F, H] = S(null), [G, re] = S(null), [B, ne] = S(n ?? {}), [P, J] = S(null), K = M(k), j = M($), Q = M(L), U = M(a);
  K.current = k, j.current = $, Q.current = L, U.current = a;
  const I = M(null);
  I.current || (I.current = new de(t, {
    context: n,
    theme: u,
    zIndex: m,
    persistence: { storage: d, keyPrefix: x },
    userId: p,
    locale: g,
    i18nResolver: h,
    dir: T,
    resume: i,
    progressTtl: y,
    autoResume: v,
    interaction: o,
    container: N,
    isolate: s,
    allowHtml: C,
    strict: A,
    deepLinkParam: w,
    dev: c,
    debug: _,
    onNavigate: (r) => Q.current?.(r),
    beforeNext: j.current ? (r) => j.current(r) : void 0,
    renderStep: U.current ? (r, E) => (J({ ctx: r, host: E }), () => J(null)) : void 0,
    onEvent: (r) => {
      D((E) => [...E.slice(-99), r]), K.current?.(r);
    },
    onStateChange: (r, E) => {
      H(r), re(E);
    }
  }));
  const l = I.current;
  R(() => (l.mount(), () => {
    l.destroy(), I.current = null;
  }), [l]), R(() => {
    l.setContext(B);
  }, [B, l]), R(() => {
    u && l.setTheme(u);
  }, [u, l]), R(() => {
    g && l.setLocale(g);
  }, [g, l]), R(() => {
    l.setUser(p);
  }, [p, l]);
  const V = ce(
    (r) => {
      const E = l.getActiveId();
      if (!E) return;
      const W = l.getEngine(E);
      W && r(W);
    },
    [l]
  ), se = O(() => ({
    start: (r, E) => l.start(r, E),
    request: (r, E) => l.request(r, E),
    stop: () => l.stop("api"),
    pause: () => l.pause(),
    resume: () => l.resume(),
    next: () => V((r) => {
      r.next();
    }),
    prev: () => V((r) => r.prev()),
    goTo: (r) => V((E) => E.goTo(r)),
    activeId: F,
    state: G,
    events: q,
    clearEvents: () => D([]),
    context: B,
    setContext: (r) => ne((E) => ({ ...E, ...r })),
    setTheme: (r) => l.setTheme(r),
    setUser: (r) => l.setUser(r),
    resetTours: () => l.reset(),
    resetTour: (r) => l.resetTour(r),
    resetProgress: () => l.resetProgress(),
    hasSeen: (r) => l.hasSeen(r),
    whyBlocked: (r) => l.checkEligibility(r),
    getEngine: (r) => l.getEngine(r),
    specs: t
  }), [l, t, F, G, q, B, V]);
  return /* @__PURE__ */ b(ee.Provider, { value: se, children: [
    f,
    P && a ? ue(a(P.ctx), P.host) : null
  ] });
}
function te() {
  const t = le(ee);
  if (!t) throw new Error("useTour must be used inside <TourProvider>");
  return t;
}
function ke(t) {
  const n = M(t);
  n.current = t, R(() => {
    const u = (m) => {
      const d = m.detail;
      d && n.current(d);
    };
    return window.addEventListener("opentutorial", u), () => window.removeEventListener("opentutorial", u);
  }, []);
}
function Ce({ id: t, children: n }) {
  return oe(n) ? ae(n, { "data-tour": t }) : /* @__PURE__ */ e("span", { "data-tour": t, children: n });
}
function xe({
  specs: t,
  getStatus: n,
  onStart: u,
  className: m = "",
  title: d = "Onboarding",
  floating: x = !1,
  collapsible: p = !1,
  defaultCollapsed: k = !1,
  hideWhenComplete: w = !1,
  locale: g,
  i18nResolver: h,
  onComplete: T
}) {
  const i = te(), [y, v] = S(k), o = t ?? i.specs, N = g ?? "en", s = O(() => n || ((f) => i.activeId === f ? "in_progress" : i.hasSeen(f) ? "completed" : "pending"), [n, i]), C = o.map((f) => s(f.id)), A = C.filter((f) => f === "completed").length, L = o.length > 0 ? Math.round(A / o.length * 100) : 0;
  if (o.length > 0 && A === o.length && w)
    return T?.(), null;
  const a = (f) => f === void 0 ? "" : z(f, N, h, i.context), c = (f) => {
    u ? u(f) : i.start(f);
  }, _ = [
    "ot-checklist",
    x ? "ot-checklist--floating" : "",
    y ? "ot-checklist--collapsed" : "",
    m
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ b("div", { className: _, children: [
    d && /* @__PURE__ */ b("div", { className: "ot-checklist-header", children: [
      /* @__PURE__ */ e("h3", { className: "ot-checklist-title", children: d }),
      /* @__PURE__ */ b("span", { className: "ot-checklist-count", children: [
        A,
        "/",
        o.length
      ] }),
      p && /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "ot-checklist-toggle",
          "aria-expanded": !y,
          "aria-label": y ? "Expand checklist" : "Collapse checklist",
          onClick: () => v((f) => !f),
          children: y ? "▸" : "▾"
        }
      )
    ] }),
    /* @__PURE__ */ e(
      "div",
      {
        className: "ot-checklist-bar-track",
        role: "progressbar",
        "aria-valuenow": L,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-label": `${A} of ${o.length} complete`,
        children: /* @__PURE__ */ e("div", { className: "ot-checklist-bar-fill", style: { width: `${L}%` } })
      }
    ),
    /* @__PURE__ */ e("ul", { className: "ot-checklist-items", children: o.map((f, q) => {
      const D = C[q], F = D === "completed" ? "✓" : D === "in_progress" ? "◌" : "○", H = a(f.description);
      return /* @__PURE__ */ b("li", { className: `ot-checklist-item ot-checklist-item--${D}`, children: [
        /* @__PURE__ */ e("span", { className: "ot-checklist-icon", "aria-hidden": "true", children: F }),
        /* @__PURE__ */ b("div", { className: "ot-checklist-info", children: [
          /* @__PURE__ */ e("span", { className: "ot-checklist-name", children: a(f.title) }),
          H && /* @__PURE__ */ e("span", { className: "ot-checklist-desc", children: H })
        ] }),
        D !== "completed" && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "ot-checklist-btn",
            onClick: () => c(f.id),
            disabled: D === "in_progress",
            children: D === "in_progress" ? "Running" : "Start"
          }
        )
      ] }, f.id);
    }) })
  ] });
}
function we({
  id: t,
  message: n,
  position: u = "top",
  action: m,
  dismissible: d = !0,
  resurfaceAfter: x,
  storage: p,
  keyPrefix: k = "ot-banner",
  className: w = "",
  onDismiss: g
}) {
  const h = O(
    () => new Y(p, k),
    [p, k]
  ), [T, i] = S(!1);
  if (R(() => {
    let v = !1;
    return h.ready.then(() => {
      if (v) return;
      const o = h.getRecord(t);
      if (!o?.at) {
        i(!0);
        return;
      }
      const N = x !== void 0 && Date.now() - o.at > x;
      i(N);
    }), () => {
      v = !0;
    };
  }, [h, t, x]), !T) return null;
  const y = () => {
    h.mark(t, "skipped"), i(!1), g?.();
  };
  return /* @__PURE__ */ b("div", { className: `ot-banner ot-banner--${u} ${w}`.trim(), role: "status", children: [
    /* @__PURE__ */ e(
      "span",
      {
        className: "ot-banner-content",
        dangerouslySetInnerHTML: { __html: Z(n) }
      }
    ),
    m && /* @__PURE__ */ e("button", { type: "button", className: "ot-banner-action", onClick: m.onClick, children: m.label }),
    d && /* @__PURE__ */ e("button", { type: "button", className: "ot-banner-dismiss", "aria-label": "Dismiss", onClick: y, children: "×" })
  ] });
}
function Se({
  id: t,
  title: n,
  content: u,
  once: m = !0,
  primaryAction: d,
  secondaryAction: x,
  dismissible: p = !0,
  allowHtml: k,
  storage: w,
  keyPrefix: g = "ot-announce",
  locale: h = "en",
  i18nResolver: T,
  className: i = "",
  children: y,
  onDismiss: v
}) {
  const o = O(() => new Y(w, g), [w, g]), [N, s] = S(!1), [C, A] = S(null);
  R(() => {
    let c = !1;
    return o.ready.then(() => {
      c || s(!m || !o.hasSeen(t));
    }), () => {
      c = !0;
    };
  }, [o, t, m]);
  const L = O(
    () => he(u, (c) => z(c, h, T)),
    [u, h, T]
  ), $ = () => {
    m && o.mark(t, "skipped"), s(!1), v?.();
  }, a = (c) => {
    m && o.mark(t, "completed"), s(!1), c();
  };
  return R(() => {
    C && C.replaceChildren(me(L, { allowHtml: k }));
  }, [C, L, k]), R(() => {
    if (!N || !p) return;
    const c = (_) => {
      _.key === "Escape" && $();
    };
    return window.addEventListener("keydown", c), () => window.removeEventListener("keydown", c);
  }, [N, p]), N ? /* @__PURE__ */ b("div", { className: "ot-root", "data-opentutorial": "", children: [
    /* @__PURE__ */ e("svg", { className: "ot-backdrop", width: "100%", height: "100%", "aria-hidden": "true", children: /* @__PURE__ */ e("rect", { className: "ot-dim", x: "0", y: "0", width: "100%", height: "100%" }) }),
    /* @__PURE__ */ e(
      "div",
      {
        className: `ot-popover ot-modal ot-popover--modal-step ${i}`.trim(),
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": `ot-announce-${t}`,
        style: { left: "50%", top: "50%", transform: "translate(-50%, -50%)" },
        children: /* @__PURE__ */ b("div", { className: "ot-body", children: [
          p && /* @__PURE__ */ e("button", { type: "button", className: "ot-skip", "aria-label": "Dismiss", onClick: $, children: "×" }),
          /* @__PURE__ */ e("h2", { className: "ot-title", id: `ot-announce-${t}`, children: n }),
          /* @__PURE__ */ e("div", { className: "ot-content-wrap", ref: A }),
          y,
          /* @__PURE__ */ b("div", { className: "ot-footer", children: [
            /* @__PURE__ */ e("span", {}),
            /* @__PURE__ */ b("div", { className: "ot-btns", children: [
              x && /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "ot-btn ot-btn-ghost",
                  onClick: () => a(x.onClick),
                  children: x.label
                }
              ),
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "ot-btn ot-btn-primary",
                  onClick: () => d ? a(d.onClick) : $(),
                  children: d?.label ?? "Got it"
                }
              )
            ] })
          ] })
        ] })
      }
    )
  ] }) : null;
}
function Te({
  id: t,
  kind: n = "nps",
  question: u,
  options: m = [],
  lowLabel: d = "Not likely",
  highLabel: x = "Very likely",
  followUp: p,
  submitLabel: k = "Submit",
  thanksMessage: w = "Thanks for the feedback!",
  className: g = "",
  onSubmit: h,
  onDismiss: T
}) {
  const [i, y] = S(null), [v, o] = S(null), [N, s] = S(""), [C, A] = S(!1);
  if (C)
    return /* @__PURE__ */ e("div", { className: `ot-survey ${g}`.trim(), children: /* @__PURE__ */ e("p", { className: "ot-survey-thanks", children: w }) });
  const L = n === "nps" ? Array.from({ length: 11 }, (c, _) => _) : n === "rating" ? [1, 2, 3, 4, 5] : null, $ = n === "nps" || n === "rating" ? i !== null : n === "choice" ? v !== null : N.trim().length > 0, a = () => {
    $ && (h({
      surveyId: t,
      kind: n,
      score: i ?? void 0,
      choice: v ?? void 0,
      comment: N.trim() || void 0,
      submittedAt: Date.now()
    }), A(!0));
  };
  return /* @__PURE__ */ b("div", { className: `ot-survey ${g}`.trim(), children: [
    /* @__PURE__ */ e("p", { className: "ot-survey-question", id: `ot-survey-q-${t}`, children: u }),
    L && /* @__PURE__ */ b(X, { children: [
      /* @__PURE__ */ e("div", { className: "ot-survey-scale", role: "radiogroup", "aria-labelledby": `ot-survey-q-${t}`, children: L.map((c) => /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": i === c,
          className: `ot-survey-score${i === c ? " ot-survey-score--selected" : ""}`,
          onClick: () => y(c),
          children: c
        },
        c
      )) }),
      /* @__PURE__ */ b("div", { className: "ot-survey-labels", children: [
        /* @__PURE__ */ e("span", { children: d }),
        /* @__PURE__ */ e("span", { children: x })
      ] })
    ] }),
    n === "choice" && /* @__PURE__ */ e("div", { className: "ot-survey-options", role: "radiogroup", "aria-labelledby": `ot-survey-q-${t}`, children: m.map((c) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": v === c,
        className: `ot-survey-option${v === c ? " ot-survey-option--selected" : ""}`,
        onClick: () => o(c),
        children: c
      },
      c
    )) }),
    (n === "text" || p && (i !== null || v !== null)) && /* @__PURE__ */ e(
      "textarea",
      {
        className: "ot-survey-textarea",
        placeholder: n === "text" ? u : p,
        "aria-label": n === "text" ? u : p ?? "Additional comments",
        value: N,
        onChange: (c) => s(c.target.value)
      }
    ),
    /* @__PURE__ */ b("div", { className: "ot-footer", children: [
      T ? /* @__PURE__ */ e("button", { type: "button", className: "ot-btn ot-btn-ghost", onClick: T, children: "Not now" }) : /* @__PURE__ */ e("span", {}),
      /* @__PURE__ */ e("button", { type: "button", className: "ot-btn ot-btn-primary", disabled: !$, onClick: a, children: k })
    ] })
  ] });
}
function Ee({
  specs: t,
  links: n = [],
  title: u = "Help & guides",
  searchPlaceholder: m = "Search…",
  floating: d = !1,
  launcherGlyph: x = "?",
  emptyMessage: p = "Nothing matches that search.",
  locale: k = "en",
  i18nResolver: w,
  className: g = ""
}) {
  const h = te(), [T, i] = S(""), [y, v] = S(!d), o = t ?? h.specs, N = O(() => {
    const s = (a) => a === void 0 ? "" : z(a, k, w, h.context), C = T.trim().toLowerCase(), A = o.map((a) => ({
      kind: "tour",
      id: a.id,
      label: s(a.title),
      description: s(a.description),
      seen: h.hasSeen(a.id)
    })), L = n.map((a) => ({
      kind: "link",
      id: a.href,
      label: a.label,
      description: a.description ?? "",
      href: a.href
    })), $ = [...A, ...L];
    return C ? $.filter(
      (a) => a.label.toLowerCase().includes(C) || a.description.toLowerCase().includes(C)
    ) : $;
  }, [o, n, T, k, w, h]);
  return d && !y ? /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: "ot-hub-launcher",
      "aria-label": u,
      onClick: () => v(!0),
      children: x
    }
  ) : /* @__PURE__ */ b(X, { children: [
    /* @__PURE__ */ b("div", { className: `ot-hub ${d ? "ot-hub--floating" : ""} ${g}`.trim(), children: [
      /* @__PURE__ */ b("div", { className: "ot-hub-header", children: [
        /* @__PURE__ */ e("h3", { className: "ot-hub-title", children: u }),
        /* @__PURE__ */ e(
          "input",
          {
            type: "search",
            className: "ot-hub-search",
            placeholder: m,
            "aria-label": m,
            value: T,
            onChange: (s) => i(s.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ b("ul", { className: "ot-hub-list", children: [
        N.length === 0 && /* @__PURE__ */ e("li", { className: "ot-hub-empty", children: p }),
        N.map((s) => /* @__PURE__ */ e("li", { children: s.kind === "tour" ? /* @__PURE__ */ b(
          "button",
          {
            type: "button",
            className: "ot-hub-item",
            onClick: () => {
              h.start(s.id), d && v(!1);
            },
            children: [
              s.seen ? "↻ " : "",
              s.label,
              s.description && /* @__PURE__ */ e("span", { className: "ot-hub-item-desc", children: s.description })
            ]
          }
        ) : /* @__PURE__ */ b(
          "a",
          {
            className: "ot-hub-item",
            href: s.href,
            target: "_blank",
            rel: "noopener noreferrer",
            children: [
              s.label,
              " ↗",
              s.description && /* @__PURE__ */ e("span", { className: "ot-hub-item-desc", children: s.description })
            ]
          }
        ) }, `${s.kind}-${s.id}`))
      ] })
    ] }),
    d && /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        className: "ot-hub-launcher",
        "aria-label": "Close help",
        onClick: () => v(!1),
        children: "×"
      }
    )
  ] });
}
function Le({
  target: t,
  content: n,
  glyph: u = "?",
  openOnHover: m = !1,
  zIndex: d,
  className: x = ""
}) {
  const [p, k] = S(null), [w, g] = S(!1), h = M(0), i = JSON.stringify(typeof t == "string" ? { selector: t } : t);
  return R(() => {
    let y = !0;
    const v = () => {
      if (!y) return;
      const s = pe(JSON.parse(i));
      if (!s) {
        k(null);
        return;
      }
      const C = s.element.getBoundingClientRect();
      k({
        x: C.x + s.frameOffset.x + C.width,
        y: C.y + s.frameOffset.y
      });
    }, o = () => {
      cancelAnimationFrame(h.current), h.current = requestAnimationFrame(v);
    };
    v(), window.addEventListener("resize", o), window.addEventListener("scroll", o, !0);
    const N = new ResizeObserver(o);
    return N.observe(document.documentElement), () => {
      y = !1, cancelAnimationFrame(h.current), window.removeEventListener("resize", o), window.removeEventListener("scroll", o, !0), N.disconnect();
    };
  }, [i]), p ? /* @__PURE__ */ b(
    "div",
    {
      className: `ot-hint ${x}`.trim(),
      style: { left: p.x, top: p.y, ...d ? { zIndex: d } : {} },
      onMouseEnter: m ? () => g(!0) : void 0,
      onMouseLeave: m ? () => g(!1) : void 0,
      children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "ot-hint-dot",
            "aria-expanded": w,
            "aria-label": w ? "Hide hint" : "Show hint",
            onClick: () => g((y) => !y),
            children: u
          }
        ),
        w && /* @__PURE__ */ e(
          "div",
          {
            className: "ot-hint-panel",
            role: "tooltip",
            dangerouslySetInnerHTML: { __html: Z(n) }
          }
        )
      ]
    }
  ) : null;
}
export {
  Se as Announcement,
  we as Banner,
  st as CSS,
  Re as DEFAULT_LABELS,
  Le as Hint,
  De as MemoryStorage,
  Ee as ResourceCenter,
  Te as Survey,
  Ce as TourAnchor,
  xe as TourChecklist,
  _e as TourEngine,
  de as TourOrchestrator,
  Y as TourPersistence,
  Ne as TourProvider,
  Me as assertValidSpec,
  Oe as blocksToText,
  ot as checkExpression,
  bt as createAmplitudeAdapter,
  qe as createCookieStorage,
  vt as createDatadogAdapter,
  ft as createDebugAdapter,
  gt as createEventCollector,
  yt as createFunnelReport,
  Nt as createGA4Adapter,
  kt as createHeapAdapter,
  Ct as createHttpAdapter,
  Fe as createIndexedDBStorage,
  He as createKeyResolver,
  Be as createLocaleResolver,
  Ie as createMemoryStorage,
  xt as createMixpanelAdapter,
  wt as createMultiAdapter,
  St as createPostHogAdapter,
  Ve as createRemoteStorage,
  Tt as createRudderStackAdapter,
  Et as createSegmentAdapter,
  Pe as createTour,
  je as createTours,
  ze as createTutorialLayer,
  Ge as currentPath,
  Je as defineSpec,
  Ke as defineStep,
  at as describeTarget,
  Qe as escapeHtml,
  ct as evaluateExpression,
  lt as evaluateShowIf,
  Ue as extendSpec,
  Lt as filterEvents,
  We as installTrigger,
  Xe as interpolate,
  it as isVisible,
  Ye as matchPath,
  he as normalizeContent,
  Ze as onLocationChange,
  ut as queryDeep,
  me as renderBlocks,
  Z as renderInline,
  et as resolveLabel,
  pe as resolveTarget,
  z as resolveText,
  dt as safeQuery,
  te as useTour,
  ke as useTourEvents,
  tt as validateSpec,
  rt as validateSpecs,
  ht as waitForElement,
  mt as waitForTarget
};
//# sourceMappingURL=react.js.map
