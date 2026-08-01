import { jsx as e, jsxs as b, Fragment as X } from "react/jsx-runtime";
import { isValidElement as oe, cloneElement as ae, useState as T, useRef as D, useEffect as L, useCallback as ce, useMemo as P, useContext as le, createContext as ie } from "react";
import { createPortal as ue } from "react-dom";
import { TourOrchestrator as de, resolveText as z, TourPersistence as Y, renderInline as Z, normalizeContent as he, renderBlocks as me, createChangelog as pe } from "./index.js";
import { DEFAULT_LABELS as _e, MemoryStorage as Me, SurfaceState as Pe, TourEngine as He, assertValidSpec as Oe, blocksToText as qe, createAnnouncement as Be, createBanner as Fe, createChecklist as Ie, createCookieStorage as Ve, createHint as je, createIndexedDBStorage as ze, createKeyResolver as Ge, createLocaleResolver as Je, createMemoryStorage as Ke, createRemoteStorage as Qe, createResourceCenter as Ue, createSurvey as We, createTour as Xe, createTours as Ye, createTutorialLayer as Ze, currentPath as et, defineSpec as tt, defineStep as rt, escapeHtml as nt, extendSpec as st, installTrigger as ot, interpolate as at, localeDirection as ct, matchPath as lt, onLocationChange as it, resolveLabel as ut, selectPlural as dt, validateSpec as ht, validateSpecs as mt } from "./index.js";
import { r as be } from "./chunks/safeEval.es.js";
import { C as bt, c as vt, d as ft, e as gt, a as yt, i as Nt, q as kt, s as Ct, w as xt, b as wt } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as Tt, createDatadogAdapter as Et, createDebugAdapter as Lt, createEventCollector as At, createFunnelReport as $t, createGA4Adapter as Rt, createHeapAdapter as Dt, createHttpAdapter as _t, createMixpanelAdapter as Mt, createMultiAdapter as Pt, createPostHogAdapter as Ht, createRudderStackAdapter as Ot, createSegmentAdapter as qt, filterEvents as Bt, shouldSample as Ft, withEventTypes as It, withSampling as Vt } from "./analytics.js";
const ee = ie(null);
function ke({
  specs: t,
  context: n,
  theme: i,
  zIndex: d,
  storage: u,
  keyPrefix: g,
  userId: h,
  onEvent: C,
  deepLinkParam: S = "tour",
  locale: y,
  i18nResolver: p,
  dir: E,
  resume: m,
  progressTtl: N,
  autoResume: v,
  interaction: o,
  container: k,
  isolate: s,
  allowHtml: x,
  strict: R,
  onNavigate: A,
  beforeNext: $,
  renderStep: c,
  dev: l,
  debug: M,
  children: f
}) {
  const [H, _] = T([]), [O, q] = T(null), [G, re] = T(null), [B, ne] = T(n ?? {}), [V, J] = T(null), K = D(C), j = D($), Q = D(A), U = D(c);
  K.current = C, j.current = $, Q.current = A, U.current = c;
  const F = D(null);
  F.current || (F.current = new de(t, {
    context: n,
    theme: i,
    zIndex: d,
    persistence: { storage: u, keyPrefix: g },
    userId: h,
    locale: y,
    i18nResolver: p,
    dir: E,
    resume: m,
    progressTtl: N,
    autoResume: v,
    interaction: o,
    container: k,
    isolate: s,
    allowHtml: x,
    strict: R,
    deepLinkParam: S,
    dev: l,
    debug: M,
    onNavigate: (r) => Q.current?.(r),
    beforeNext: j.current ? (r) => j.current(r) : void 0,
    renderStep: U.current ? (r, w) => (J({ ctx: r, host: w }), () => J(null)) : void 0,
    onEvent: (r) => {
      _((w) => [...w.slice(-99), r]), K.current?.(r);
    },
    onStateChange: (r, w) => {
      q(r), re(w);
    }
  }));
  const a = F.current;
  L(() => (a.mount(), () => {
    a.destroy(), F.current = null;
  }), [a]), L(() => {
    a.setContext(B);
  }, [B, a]), L(() => {
    i && a.setTheme(i);
  }, [i, a]), L(() => {
    y && a.setLocale(y);
  }, [y, a]), L(() => {
    a.setUser(h);
  }, [h, a]);
  const I = ce(
    (r) => {
      const w = a.getActiveId();
      if (!w) return;
      const W = a.getEngine(w);
      W && r(W);
    },
    [a]
  ), se = P(() => ({
    start: (r, w) => a.start(r, w),
    request: (r, w) => a.request(r, w),
    stop: () => a.stop("api"),
    pause: () => a.pause(),
    resume: () => a.resume(),
    next: () => I((r) => {
      r.next();
    }),
    prev: () => I((r) => r.prev()),
    goTo: (r) => I((w) => w.goTo(r)),
    activeId: O,
    state: G,
    events: H,
    clearEvents: () => _([]),
    context: B,
    setContext: (r) => ne((w) => ({ ...w, ...r })),
    setTheme: (r) => a.setTheme(r),
    setUser: (r) => a.setUser(r),
    resetTours: () => a.reset(),
    resetTour: (r) => a.resetTour(r),
    resetProgress: () => a.resetProgress(),
    exportProgress: () => a.exportProgress(),
    importProgress: (r, w) => a.importProgress(r, w),
    hasSeen: (r) => a.hasSeen(r),
    whyBlocked: (r) => a.checkEligibility(r),
    getEngine: (r) => a.getEngine(r),
    specs: t
  }), [a, t, O, G, H, B, I]);
  return /* @__PURE__ */ b(ee.Provider, { value: se, children: [
    f,
    V && c ? ue(c(V.ctx), V.host) : null
  ] });
}
function te() {
  const t = le(ee);
  if (!t) throw new Error("useTour must be used inside <TourProvider>");
  return t;
}
function Ce(t) {
  const n = D(t);
  n.current = t, L(() => {
    const i = (d) => {
      const u = d.detail;
      u && n.current(u);
    };
    return window.addEventListener("opentutorial", i), () => window.removeEventListener("opentutorial", i);
  }, []);
}
function xe({ id: t, children: n }) {
  return oe(n) ? ae(n, { "data-tour": t }) : /* @__PURE__ */ e("span", { "data-tour": t, children: n });
}
function we({
  specs: t,
  getStatus: n,
  onStart: i,
  className: d = "",
  title: u = "Onboarding",
  floating: g = !1,
  collapsible: h = !1,
  defaultCollapsed: C = !1,
  hideWhenComplete: S = !1,
  locale: y,
  i18nResolver: p,
  onComplete: E
}) {
  const m = te(), [N, v] = T(C), o = t ?? m.specs, k = y ?? "en", s = P(() => n || ((f) => m.activeId === f ? "in_progress" : m.hasSeen(f) ? "completed" : "pending"), [n, m]), x = o.map((f) => s(f.id)), R = x.filter((f) => f === "completed").length, A = o.length > 0 ? Math.round(R / o.length * 100) : 0;
  if (o.length > 0 && R === o.length && S)
    return E?.(), null;
  const c = (f) => f === void 0 ? "" : z(f, k, p, m.context), l = (f) => {
    i ? i(f) : m.start(f);
  }, M = [
    "ot-checklist",
    g ? "ot-checklist--floating" : "",
    N ? "ot-checklist--collapsed" : "",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ b("div", { className: M, children: [
    u && /* @__PURE__ */ b("div", { className: "ot-checklist-header", children: [
      /* @__PURE__ */ e("h3", { className: "ot-checklist-title", children: u }),
      /* @__PURE__ */ b("span", { className: "ot-checklist-count", children: [
        R,
        "/",
        o.length
      ] }),
      h && /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "ot-checklist-toggle",
          "aria-expanded": !N,
          "aria-label": N ? "Expand checklist" : "Collapse checklist",
          onClick: () => v((f) => !f),
          children: N ? "▸" : "▾"
        }
      )
    ] }),
    /* @__PURE__ */ e(
      "div",
      {
        className: "ot-checklist-bar-track",
        role: "progressbar",
        "aria-valuenow": A,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-label": `${R} of ${o.length} complete`,
        children: /* @__PURE__ */ e("div", { className: "ot-checklist-bar-fill", style: { width: `${A}%` } })
      }
    ),
    /* @__PURE__ */ e("ul", { className: "ot-checklist-items", children: o.map((f, H) => {
      const _ = x[H], O = _ === "completed" ? "✓" : _ === "in_progress" ? "◌" : "○", q = c(f.description);
      return /* @__PURE__ */ b("li", { className: `ot-checklist-item ot-checklist-item--${_}`, children: [
        /* @__PURE__ */ e("span", { className: "ot-checklist-icon", "aria-hidden": "true", children: O }),
        /* @__PURE__ */ b("div", { className: "ot-checklist-info", children: [
          /* @__PURE__ */ e("span", { className: "ot-checklist-name", children: c(f.title) }),
          q && /* @__PURE__ */ e("span", { className: "ot-checklist-desc", children: q })
        ] }),
        _ !== "completed" && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "ot-checklist-btn",
            onClick: () => l(f.id),
            disabled: _ === "in_progress",
            children: _ === "in_progress" ? "Running" : "Start"
          }
        )
      ] }, f.id);
    }) })
  ] });
}
function Se({
  id: t,
  message: n,
  position: i = "top",
  action: d,
  dismissible: u = !0,
  resurfaceAfter: g,
  storage: h,
  keyPrefix: C = "ot-banner",
  className: S = "",
  onDismiss: y
}) {
  const p = P(
    () => new Y(h, C),
    [h, C]
  ), [E, m] = T(!1);
  if (L(() => {
    let v = !1;
    return p.ready.then(() => {
      if (v) return;
      const o = p.getRecord(t);
      if (!o?.at) {
        m(!0);
        return;
      }
      const k = g !== void 0 && Date.now() - o.at > g;
      m(k);
    }), () => {
      v = !0;
    };
  }, [p, t, g]), !E) return null;
  const N = () => {
    p.mark(t, "skipped"), m(!1), y?.();
  };
  return /* @__PURE__ */ b("div", { className: `ot-banner ot-banner--${i} ${S}`.trim(), role: "status", children: [
    /* @__PURE__ */ e(
      "span",
      {
        className: "ot-banner-content",
        dangerouslySetInnerHTML: { __html: Z(n) }
      }
    ),
    d && /* @__PURE__ */ e("button", { type: "button", className: "ot-banner-action", onClick: d.onClick, children: d.label }),
    u && /* @__PURE__ */ e("button", { type: "button", className: "ot-banner-dismiss", "aria-label": "Dismiss", onClick: N, children: "×" })
  ] });
}
function Te({
  id: t,
  title: n,
  content: i,
  once: d = !0,
  primaryAction: u,
  secondaryAction: g,
  dismissible: h = !0,
  allowHtml: C,
  storage: S,
  keyPrefix: y = "ot-announce",
  locale: p = "en",
  i18nResolver: E,
  className: m = "",
  children: N,
  onDismiss: v
}) {
  const o = P(() => new Y(S, y), [S, y]), [k, s] = T(!1), [x, R] = T(null);
  L(() => {
    let l = !1;
    return o.ready.then(() => {
      l || s(!d || !o.hasSeen(t));
    }), () => {
      l = !0;
    };
  }, [o, t, d]);
  const A = P(
    () => he(i, (l) => z(l, p, E)),
    [i, p, E]
  ), $ = () => {
    d && o.mark(t, "skipped"), s(!1), v?.();
  }, c = (l) => {
    d && o.mark(t, "completed"), s(!1), l();
  };
  return L(() => {
    x && x.replaceChildren(me(A, { allowHtml: C }));
  }, [x, A, C]), L(() => {
    if (!k || !h) return;
    const l = (M) => {
      M.key === "Escape" && $();
    };
    return window.addEventListener("keydown", l), () => window.removeEventListener("keydown", l);
  }, [k, h]), k ? /* @__PURE__ */ b("div", { className: "ot-root", "data-opentutorial": "", children: [
    /* @__PURE__ */ e("svg", { className: "ot-backdrop", width: "100%", height: "100%", "aria-hidden": "true", children: /* @__PURE__ */ e("rect", { className: "ot-dim", x: "0", y: "0", width: "100%", height: "100%" }) }),
    /* @__PURE__ */ e(
      "div",
      {
        className: `ot-popover ot-modal ot-popover--modal-step ${m}`.trim(),
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": `ot-announce-${t}`,
        style: { left: "50%", top: "50%", transform: "translate(-50%, -50%)" },
        children: /* @__PURE__ */ b("div", { className: "ot-body", children: [
          h && /* @__PURE__ */ e("button", { type: "button", className: "ot-skip", "aria-label": "Dismiss", onClick: $, children: "×" }),
          /* @__PURE__ */ e("h2", { className: "ot-title", id: `ot-announce-${t}`, children: n }),
          /* @__PURE__ */ e("div", { className: "ot-content-wrap", ref: R }),
          N,
          /* @__PURE__ */ b("div", { className: "ot-footer", children: [
            /* @__PURE__ */ e("span", {}),
            /* @__PURE__ */ b("div", { className: "ot-btns", children: [
              g && /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "ot-btn ot-btn-ghost",
                  onClick: () => c(g.onClick),
                  children: g.label
                }
              ),
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "ot-btn ot-btn-primary",
                  onClick: () => u ? c(u.onClick) : $(),
                  children: u?.label ?? "Got it"
                }
              )
            ] })
          ] })
        ] })
      }
    )
  ] }) : null;
}
function Ee({
  id: t,
  kind: n = "nps",
  question: i,
  options: d = [],
  lowLabel: u = "Not likely",
  highLabel: g = "Very likely",
  followUp: h,
  submitLabel: C = "Submit",
  thanksMessage: S = "Thanks for the feedback!",
  className: y = "",
  onSubmit: p,
  onDismiss: E
}) {
  const [m, N] = T(null), [v, o] = T(null), [k, s] = T(""), [x, R] = T(!1);
  if (x)
    return /* @__PURE__ */ e("div", { className: `ot-survey ${y}`.trim(), children: /* @__PURE__ */ e("p", { className: "ot-survey-thanks", children: S }) });
  const A = n === "nps" ? Array.from({ length: 11 }, (l, M) => M) : n === "rating" ? [1, 2, 3, 4, 5] : null, $ = n === "nps" || n === "rating" ? m !== null : n === "choice" ? v !== null : k.trim().length > 0, c = () => {
    $ && (p({
      surveyId: t,
      kind: n,
      score: m ?? void 0,
      choice: v ?? void 0,
      comment: k.trim() || void 0,
      submittedAt: Date.now()
    }), R(!0));
  };
  return /* @__PURE__ */ b("div", { className: `ot-survey ${y}`.trim(), children: [
    /* @__PURE__ */ e("p", { className: "ot-survey-question", id: `ot-survey-q-${t}`, children: i }),
    A && /* @__PURE__ */ b(X, { children: [
      /* @__PURE__ */ e("div", { className: "ot-survey-scale", role: "radiogroup", "aria-labelledby": `ot-survey-q-${t}`, children: A.map((l) => /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": m === l,
          className: `ot-survey-score${m === l ? " ot-survey-score--selected" : ""}`,
          onClick: () => N(l),
          children: l
        },
        l
      )) }),
      /* @__PURE__ */ b("div", { className: "ot-survey-labels", children: [
        /* @__PURE__ */ e("span", { children: u }),
        /* @__PURE__ */ e("span", { children: g })
      ] })
    ] }),
    n === "choice" && /* @__PURE__ */ e("div", { className: "ot-survey-options", role: "radiogroup", "aria-labelledby": `ot-survey-q-${t}`, children: d.map((l) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": v === l,
        className: `ot-survey-option${v === l ? " ot-survey-option--selected" : ""}`,
        onClick: () => o(l),
        children: l
      },
      l
    )) }),
    (n === "text" || h && (m !== null || v !== null)) && /* @__PURE__ */ e(
      "textarea",
      {
        className: "ot-survey-textarea",
        placeholder: n === "text" ? i : h,
        "aria-label": n === "text" ? i : h ?? "Additional comments",
        value: k,
        onChange: (l) => s(l.target.value)
      }
    ),
    /* @__PURE__ */ b("div", { className: "ot-footer", children: [
      E ? /* @__PURE__ */ e("button", { type: "button", className: "ot-btn ot-btn-ghost", onClick: E, children: "Not now" }) : /* @__PURE__ */ e("span", {}),
      /* @__PURE__ */ e("button", { type: "button", className: "ot-btn ot-btn-primary", disabled: !$, onClick: c, children: C })
    ] })
  ] });
}
function Le({
  specs: t,
  links: n = [],
  title: i = "Help & guides",
  searchPlaceholder: d = "Search…",
  floating: u = !1,
  launcherGlyph: g = "?",
  emptyMessage: h = "Nothing matches that search.",
  locale: C = "en",
  i18nResolver: S,
  className: y = ""
}) {
  const p = te(), [E, m] = T(""), [N, v] = T(!u), o = t ?? p.specs, k = P(() => {
    const s = (c) => c === void 0 ? "" : z(c, C, S, p.context), x = E.trim().toLowerCase(), R = o.map((c) => ({
      kind: "tour",
      id: c.id,
      label: s(c.title),
      description: s(c.description),
      seen: p.hasSeen(c.id)
    })), A = n.map((c) => ({
      kind: "link",
      id: c.href,
      label: c.label,
      description: c.description ?? "",
      href: c.href
    })), $ = [...R, ...A];
    return x ? $.filter(
      (c) => c.label.toLowerCase().includes(x) || c.description.toLowerCase().includes(x)
    ) : $;
  }, [o, n, E, C, S, p]);
  return u && !N ? /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: "ot-hub-launcher",
      "aria-label": i,
      onClick: () => v(!0),
      children: g
    }
  ) : /* @__PURE__ */ b(X, { children: [
    /* @__PURE__ */ b("div", { className: `ot-hub ${u ? "ot-hub--floating" : ""} ${y}`.trim(), children: [
      /* @__PURE__ */ b("div", { className: "ot-hub-header", children: [
        /* @__PURE__ */ e("h3", { className: "ot-hub-title", children: i }),
        /* @__PURE__ */ e(
          "input",
          {
            type: "search",
            className: "ot-hub-search",
            placeholder: d,
            "aria-label": d,
            value: E,
            onChange: (s) => m(s.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ b("ul", { className: "ot-hub-list", children: [
        k.length === 0 && /* @__PURE__ */ e("li", { className: "ot-hub-empty", children: h }),
        k.map((s) => /* @__PURE__ */ e("li", { children: s.kind === "tour" ? /* @__PURE__ */ b(
          "button",
          {
            type: "button",
            className: "ot-hub-item",
            onClick: () => {
              p.start(s.id), u && v(!1);
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
    u && /* @__PURE__ */ e(
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
function Ae({
  target: t,
  content: n,
  glyph: i = "?",
  openOnHover: d = !1,
  zIndex: u,
  className: g = ""
}) {
  const [h, C] = T(null), [S, y] = T(!1), p = D(0), m = JSON.stringify(typeof t == "string" ? { selector: t } : t);
  return L(() => {
    let N = !0;
    const v = () => {
      if (!N) return;
      const s = be(JSON.parse(m));
      if (!s) {
        C(null);
        return;
      }
      const x = s.element.getBoundingClientRect();
      C({
        x: x.x + s.frameOffset.x + x.width,
        y: x.y + s.frameOffset.y
      });
    }, o = () => {
      cancelAnimationFrame(p.current), p.current = requestAnimationFrame(v);
    };
    v(), window.addEventListener("resize", o), window.addEventListener("scroll", o, !0);
    const k = new ResizeObserver(o);
    return k.observe(document.documentElement), () => {
      N = !1, cancelAnimationFrame(p.current), window.removeEventListener("resize", o), window.removeEventListener("scroll", o, !0), k.disconnect();
    };
  }, [m]), h ? /* @__PURE__ */ b(
    "div",
    {
      className: `ot-hint ${g}`.trim(),
      style: { left: h.x, top: h.y, ...u ? { zIndex: u } : {} },
      onMouseEnter: d ? () => y(!0) : void 0,
      onMouseLeave: d ? () => y(!1) : void 0,
      children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "ot-hint-dot",
            "aria-expanded": S,
            "aria-label": S ? "Hide hint" : "Show hint",
            onClick: () => y((N) => !N),
            children: i
          }
        ),
        S && /* @__PURE__ */ e(
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
function $e({ entries: t, ...n }) {
  const i = D(null), d = D(null), u = D(n);
  return L(() => {
    u.current = n;
  }), L(() => {
    const g = i.current;
    if (!g) return;
    const h = pe({
      ...u.current,
      entries: [],
      container: g
    });
    return d.current = h, () => {
      h.destroy(), d.current = null;
    };
  }, []), L(() => {
    d.current?.setEntries(t);
  }, [t]), /* @__PURE__ */ e("div", { ref: i });
}
export {
  Te as Announcement,
  Se as Banner,
  bt as CSS,
  $e as Changelog,
  _e as DEFAULT_LABELS,
  Ae as Hint,
  Me as MemoryStorage,
  Le as ResourceCenter,
  Pe as SurfaceState,
  Ee as Survey,
  xe as TourAnchor,
  we as TourChecklist,
  He as TourEngine,
  de as TourOrchestrator,
  Y as TourPersistence,
  ke as TourProvider,
  Oe as assertValidSpec,
  qe as blocksToText,
  vt as checkExpression,
  Tt as createAmplitudeAdapter,
  Be as createAnnouncement,
  Fe as createBanner,
  pe as createChangelog,
  Ie as createChecklist,
  Ve as createCookieStorage,
  Et as createDatadogAdapter,
  Lt as createDebugAdapter,
  At as createEventCollector,
  $t as createFunnelReport,
  Rt as createGA4Adapter,
  Dt as createHeapAdapter,
  je as createHint,
  _t as createHttpAdapter,
  ze as createIndexedDBStorage,
  Ge as createKeyResolver,
  Je as createLocaleResolver,
  Ke as createMemoryStorage,
  Mt as createMixpanelAdapter,
  Pt as createMultiAdapter,
  Ht as createPostHogAdapter,
  Qe as createRemoteStorage,
  Ue as createResourceCenter,
  Ot as createRudderStackAdapter,
  qt as createSegmentAdapter,
  We as createSurvey,
  Xe as createTour,
  Ye as createTours,
  Ze as createTutorialLayer,
  et as currentPath,
  tt as defineSpec,
  rt as defineStep,
  ft as describeTarget,
  nt as escapeHtml,
  gt as evaluateExpression,
  yt as evaluateShowIf,
  st as extendSpec,
  Bt as filterEvents,
  ot as installTrigger,
  at as interpolate,
  Nt as isVisible,
  ct as localeDirection,
  lt as matchPath,
  he as normalizeContent,
  it as onLocationChange,
  kt as queryDeep,
  me as renderBlocks,
  Z as renderInline,
  ut as resolveLabel,
  be as resolveTarget,
  z as resolveText,
  Ct as safeQuery,
  dt as selectPlural,
  Ft as shouldSample,
  te as useTour,
  Ce as useTourEvents,
  ht as validateSpec,
  mt as validateSpecs,
  xt as waitForElement,
  wt as waitForTarget,
  It as withEventTypes,
  Vt as withSampling
};
//# sourceMappingURL=react.js.map
