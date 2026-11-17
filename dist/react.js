import { jsx as t, jsxs as v, Fragment as se } from "react/jsx-runtime";
import { isValidElement as ve, cloneElement as be, useState as T, useRef as D, useEffect as L, useCallback as ge, useMemo as B, useContext as ye, createContext as Ne } from "react";
import { createPortal as ke } from "react-dom";
import { TourOrchestrator as Ce, resolveText as K, TourPersistence as oe, createChangelog as xe } from "./index.js";
import { DEFAULT_LABELS as ze, MemoryStorage as Ge, SurfaceState as Je, TourEngine as Ke, assertValidSpec as Qe, assignAll as Ue, assignVariant as We, createAnnouncement as Xe, createBanner as Ye, createChecklist as Ze, createCookieStorage as et, createHint as tt, createIndexedDBStorage as rt, createKeyResolver as nt, createLocaleResolver as st, createMemoryStorage as ot, createRemoteStorage as at, createResourceCenter as ct, createSurvey as lt, createTour as it, createTours as ut, createTutorialLayer as dt, currentPath as ht, defineSpec as mt, defineStep as pt, extendSpec as ft, installTrigger as vt, interpolate as bt, localeDirection as gt, matchPath as yt, onLocationChange as Nt, resolveLabel as kt, selectPlural as Ct, validateSpec as xt, validateSpecs as wt } from "./index.js";
import { g as ae, n as we, r as Se, k as Te } from "./chunks/safeEval.es.js";
import { C as Tt, b as Et, c as Lt, d as At, e as Rt, a as $t, f as Mt, h as Dt, i as _t, q as Pt, j as Bt, l as Ht, s as Ot, w as qt, m as Ft } from "./chunks/safeEval.es.js";
import { createAmplitudeAdapter as Vt, createDatadogAdapter as jt, createDebugAdapter as zt, createEventCollector as Gt, createFunnelReport as Jt, createGA4Adapter as Kt, createHeapAdapter as Qt, createHttpAdapter as Ut, createMixpanelAdapter as Wt, createMultiAdapter as Xt, createPostHogAdapter as Yt, createRudderStackAdapter as Zt, createSegmentAdapter as er, filterEvents as tr, shouldSample as rr, withEventTypes as nr, withSampling as sr } from "./analytics.js";
const ce = Ne(null);
function Me({
  specs: r,
  context: n,
  theme: l,
  zIndex: u,
  storage: i,
  keyPrefix: y,
  userId: d,
  onEvent: x,
  deepLinkParam: S = "tour",
  locale: N,
  i18nResolver: f,
  dir: E,
  resume: h,
  progressTtl: k,
  autoResume: b,
  interaction: a,
  container: C,
  isolate: o,
  allowHtml: w,
  strict: R,
  density: $,
  autoSize: M,
  swipe: m,
  keyboard: c,
  draggable: P,
  dotNavigation: g,
  sampleRate: j,
  onContextChange: _,
  onNavigate: O,
  beforeNext: H,
  renderStep: q,
  dev: ie,
  debug: ue,
  children: de
}) {
  const [Q, U] = T([]), [W, he] = T(null), [X, me] = T(null), [F, Y] = T(n ?? {}), [z, Z] = T(null), ee = D(x), G = D(H), te = D(O), re = D(_), ne = D(q);
  ee.current = x, G.current = H, te.current = O, re.current = _, ne.current = q;
  const I = D(null);
  I.current || (I.current = new Ce(r, {
    context: n,
    theme: l,
    zIndex: u,
    persistence: { storage: i, keyPrefix: y },
    userId: d,
    locale: N,
    i18nResolver: f,
    dir: E,
    resume: h,
    progressTtl: k,
    autoResume: b,
    interaction: a,
    container: C,
    isolate: o,
    allowHtml: w,
    strict: R,
    density: $,
    autoSize: M,
    swipe: m,
    keyboard: c,
    draggable: P,
    dotNavigation: g,
    sampleRate: j,
    deepLinkParam: S,
    dev: ie,
    debug: ue,
    // An answer given in an `input` / `choice` block changes the context
    // from inside the engine. Mirror it into React state, or `useTour().context`
    // would silently go stale. The effect below then calls `setContext` with
    // values the orchestrator already has, which it treats as a no-op.
    onContextChange: (e, p) => {
      Y((A) => ({ ...A, ...p })), re.current?.(e, p);
    },
    onNavigate: (e) => te.current?.(e),
    beforeNext: G.current ? (e) => G.current(e) : void 0,
    renderStep: ne.current ? (e, p) => (Z({ ctx: e, host: p }), () => Z(null)) : void 0,
    onEvent: (e) => {
      U((p) => [...p.slice(-99), e]), ee.current?.(e);
    },
    onStateChange: (e, p) => {
      he(e), me(p);
    }
  }));
  const s = I.current, pe = D(new Map(r.map((e) => [e.id, e])));
  L(() => {
    const e = pe.current, p = new Map(r.map((A) => [A.id, A]));
    for (const A of [...e.keys()])
      p.has(A) || (s.removeSpec(A), e.delete(A));
    for (const [A, J] of p)
      e.get(A) !== J && (s.addSpec(J), e.set(A, J));
  }, [r, s]), L(() => (s.mount(), () => {
    s.destroy(), I.current = null;
  }), [s]), L(() => {
    s.setContext(F);
  }, [F, s]), L(() => {
    l && s.setTheme(l);
  }, [l, s]), L(() => {
    N && s.setLocale(N);
  }, [N, s]), L(() => {
    s.setUser(d);
  }, [d, s]);
  const V = ge(
    (e) => {
      const p = s.getActiveId();
      if (!p) return;
      const A = s.getEngine(p);
      A && e(A);
    },
    [s]
  ), fe = B(() => ({
    start: (e, p) => s.start(e, p),
    request: (e, p) => s.request(e, p),
    stop: () => s.stop("api"),
    pause: () => s.pause(),
    resume: () => s.resume(),
    next: () => V((e) => {
      e.next();
    }),
    prev: () => V((e) => e.prev()),
    goTo: (e) => V((p) => p.goTo(e)),
    activeId: W,
    state: X,
    events: Q,
    clearEvents: () => U([]),
    context: F,
    setContext: (e) => Y((p) => ({ ...p, ...e })),
    setTheme: (e) => s.setTheme(e),
    setUser: (e) => s.setUser(e),
    resetTours: () => s.reset(),
    resetTour: (e) => s.resetTour(e),
    resetProgress: () => s.resetProgress(),
    exportProgress: () => s.exportProgress(),
    importProgress: (e, p) => s.importProgress(e, p),
    hasSeen: (e) => s.hasSeen(e),
    whyBlocked: (e) => s.checkEligibility(e),
    getEngine: (e) => s.getEngine(e),
    specs: r
  }), [s, r, W, X, Q, F, V]);
  return /* @__PURE__ */ v(ce.Provider, { value: fe, children: [
    de,
    z && q ? ke(q(z.ctx), z.host) : null
  ] });
}
function le() {
  const r = ye(ce);
  if (!r) throw new Error("useTour must be used inside <TourProvider>");
  return r;
}
function De(r) {
  const n = D(r);
  n.current = r, L(() => {
    const l = (u) => {
      const i = u.detail;
      i && n.current(i);
    };
    return window.addEventListener("opentutorial", l), () => window.removeEventListener("opentutorial", l);
  }, []);
}
function _e({ id: r, children: n }) {
  return ve(n) ? be(n, { "data-tour": r }) : /* @__PURE__ */ t("span", { "data-tour": r, children: n });
}
function Pe({
  specs: r,
  getStatus: n,
  onStart: l,
  className: u = "",
  title: i = "Onboarding",
  floating: y = !1,
  collapsible: d = !1,
  defaultCollapsed: x = !1,
  hideWhenComplete: S = !1,
  locale: N,
  i18nResolver: f,
  onComplete: E
}) {
  const h = le(), [k, b] = T(x), a = r ?? h.specs, C = N ?? "en", o = B(() => n || ((g) => h.activeId === g ? "in_progress" : h.hasSeen(g) ? "completed" : "pending"), [n, h]), w = a.map((g) => o(g.id)), R = w.filter((g) => g === "completed").length, $ = a.length > 0 ? Math.round(R / a.length * 100) : 0;
  if (a.length > 0 && R === a.length && S)
    return E?.(), null;
  const m = (g) => g === void 0 ? "" : K(g, C, f, h.context), c = (g) => {
    l ? l(g) : h.start(g);
  }, P = [
    "ot-checklist",
    y ? "ot-checklist--floating" : "",
    k ? "ot-checklist--collapsed" : "",
    u
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ v("div", { className: P, children: [
    i && /* @__PURE__ */ v("div", { className: "ot-checklist-header", children: [
      /* @__PURE__ */ t("h3", { className: "ot-checklist-title", children: i }),
      /* @__PURE__ */ v("span", { className: "ot-checklist-count", children: [
        R,
        "/",
        a.length
      ] }),
      d && /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          className: "ot-checklist-toggle",
          "aria-expanded": !k,
          "aria-label": k ? "Expand checklist" : "Collapse checklist",
          onClick: () => b((g) => !g),
          children: k ? "▸" : "▾"
        }
      )
    ] }),
    /* @__PURE__ */ t(
      "div",
      {
        className: "ot-checklist-bar-track",
        role: "progressbar",
        "aria-valuenow": $,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-label": `${R} of ${a.length} complete`,
        children: /* @__PURE__ */ t("div", { className: "ot-checklist-bar-fill", style: { width: `${$}%` } })
      }
    ),
    /* @__PURE__ */ t("ul", { className: "ot-checklist-items", children: a.map((g, j) => {
      const _ = w[j], O = _ === "completed" ? "✓" : _ === "in_progress" ? "◌" : "○", H = m(g.description);
      return /* @__PURE__ */ v("li", { className: `ot-checklist-item ot-checklist-item--${_}`, children: [
        /* @__PURE__ */ t("span", { className: "ot-checklist-icon", "aria-hidden": "true", children: O }),
        /* @__PURE__ */ v("div", { className: "ot-checklist-info", children: [
          /* @__PURE__ */ t("span", { className: "ot-checklist-name", children: m(g.title) }),
          H && /* @__PURE__ */ t("span", { className: "ot-checklist-desc", children: H })
        ] }),
        _ !== "completed" && /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "ot-checklist-btn",
            onClick: () => c(g.id),
            disabled: _ === "in_progress",
            children: _ === "in_progress" ? "Running" : "Start"
          }
        )
      ] }, g.id);
    }) })
  ] });
}
function Be({
  id: r,
  message: n,
  position: l = "top",
  action: u,
  dismissible: i = !0,
  resurfaceAfter: y,
  storage: d,
  keyPrefix: x = "ot-banner",
  className: S = "",
  onDismiss: N
}) {
  const f = B(
    () => new oe(d, x),
    [d, x]
  ), [E, h] = T(!1);
  if (L(() => {
    let b = !1;
    return f.ready.then(() => {
      if (b) return;
      const a = f.getRecord(r);
      if (!a?.at) {
        h(!0);
        return;
      }
      const C = y !== void 0 && Date.now() - a.at > y;
      h(C);
    }), () => {
      b = !0;
    };
  }, [f, r, y]), !E) return null;
  const k = () => {
    f.mark(r, "skipped"), h(!1), N?.();
  };
  return /* @__PURE__ */ v("div", { className: `ot-banner ot-banner--${l} ${S}`.trim(), role: "status", children: [
    /* @__PURE__ */ t(
      "span",
      {
        className: "ot-banner-content",
        dangerouslySetInnerHTML: { __html: ae(n) }
      }
    ),
    u && /* @__PURE__ */ t("button", { type: "button", className: "ot-banner-action", onClick: u.onClick, children: u.label }),
    i && /* @__PURE__ */ t("button", { type: "button", className: "ot-banner-dismiss", "aria-label": "Dismiss", onClick: k, children: "×" })
  ] });
}
function He({
  id: r,
  title: n,
  content: l,
  once: u = !0,
  primaryAction: i,
  secondaryAction: y,
  dismissible: d = !0,
  allowHtml: x,
  storage: S,
  keyPrefix: N = "ot-announce",
  locale: f = "en",
  i18nResolver: E,
  className: h = "",
  children: k,
  onDismiss: b
}) {
  const a = B(() => new oe(S, N), [S, N]), [C, o] = T(!1), [w, R] = T(null);
  L(() => {
    let c = !1;
    return a.ready.then(() => {
      c || o(!u || !a.hasSeen(r));
    }), () => {
      c = !0;
    };
  }, [a, r, u]);
  const $ = B(
    () => we(l, (c) => K(c, f, E)),
    [l, f, E]
  ), M = () => {
    u && a.mark(r, "skipped"), o(!1), b?.();
  }, m = (c) => {
    u && a.mark(r, "completed"), o(!1), c();
  };
  return L(() => {
    w && w.replaceChildren(Se($, { allowHtml: x }));
  }, [w, $, x]), L(() => {
    if (!C || !d) return;
    const c = (P) => {
      P.key === "Escape" && M();
    };
    return window.addEventListener("keydown", c), () => window.removeEventListener("keydown", c);
  }, [C, d]), C ? /* @__PURE__ */ v("div", { className: "ot-root", "data-opentutorial": "", children: [
    /* @__PURE__ */ t("svg", { className: "ot-backdrop", width: "100%", height: "100%", "aria-hidden": "true", children: /* @__PURE__ */ t("rect", { className: "ot-dim", x: "0", y: "0", width: "100%", height: "100%" }) }),
    /* @__PURE__ */ t(
      "div",
      {
        className: `ot-popover ot-modal ot-popover--modal-step ${h}`.trim(),
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": `ot-announce-${r}`,
        style: { left: "50%", top: "50%", transform: "translate(-50%, -50%)" },
        children: /* @__PURE__ */ v("div", { className: "ot-body", children: [
          d && /* @__PURE__ */ t("button", { type: "button", className: "ot-skip", "aria-label": "Dismiss", onClick: M, children: "×" }),
          /* @__PURE__ */ t("h2", { className: "ot-title", id: `ot-announce-${r}`, children: n }),
          /* @__PURE__ */ t("div", { className: "ot-content-wrap", ref: R }),
          k,
          /* @__PURE__ */ v("div", { className: "ot-footer", children: [
            /* @__PURE__ */ t("span", {}),
            /* @__PURE__ */ v("div", { className: "ot-btns", children: [
              y && /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  className: "ot-btn ot-btn-ghost",
                  onClick: () => m(y.onClick),
                  children: y.label
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  className: "ot-btn ot-btn-primary",
                  onClick: () => i ? m(i.onClick) : M(),
                  children: i?.label ?? "Got it"
                }
              )
            ] })
          ] })
        ] })
      }
    )
  ] }) : null;
}
function Oe({
  id: r,
  kind: n = "nps",
  question: l,
  options: u = [],
  lowLabel: i = "Not likely",
  highLabel: y = "Very likely",
  followUp: d,
  submitLabel: x = "Submit",
  thanksMessage: S = "Thanks for the feedback!",
  className: N = "",
  onSubmit: f,
  onDismiss: E
}) {
  const [h, k] = T(null), [b, a] = T(null), [C, o] = T(""), [w, R] = T(!1);
  if (w)
    return /* @__PURE__ */ t("div", { className: `ot-survey ${N}`.trim(), children: /* @__PURE__ */ t("p", { className: "ot-survey-thanks", children: S }) });
  const $ = n === "nps" ? Array.from({ length: 11 }, (c, P) => P) : n === "rating" ? [1, 2, 3, 4, 5] : null, M = n === "nps" || n === "rating" ? h !== null : n === "choice" ? b !== null : C.trim().length > 0, m = () => {
    M && (f({
      surveyId: r,
      kind: n,
      score: h ?? void 0,
      choice: b ?? void 0,
      comment: C.trim() || void 0,
      submittedAt: Date.now()
    }), R(!0));
  };
  return /* @__PURE__ */ v("div", { className: `ot-survey ${N}`.trim(), children: [
    /* @__PURE__ */ t("p", { className: "ot-survey-question", id: `ot-survey-q-${r}`, children: l }),
    $ && /* @__PURE__ */ v(se, { children: [
      /* @__PURE__ */ t("div", { className: "ot-survey-scale", role: "radiogroup", "aria-labelledby": `ot-survey-q-${r}`, children: $.map((c) => /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": h === c,
          className: `ot-survey-score${h === c ? " ot-survey-score--selected" : ""}`,
          onClick: () => k(c),
          children: c
        },
        c
      )) }),
      /* @__PURE__ */ v("div", { className: "ot-survey-labels", children: [
        /* @__PURE__ */ t("span", { children: i }),
        /* @__PURE__ */ t("span", { children: y })
      ] })
    ] }),
    n === "choice" && /* @__PURE__ */ t("div", { className: "ot-survey-options", role: "radiogroup", "aria-labelledby": `ot-survey-q-${r}`, children: u.map((c) => /* @__PURE__ */ t(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": b === c,
        className: `ot-survey-option${b === c ? " ot-survey-option--selected" : ""}`,
        onClick: () => a(c),
        children: c
      },
      c
    )) }),
    (n === "text" || d && (h !== null || b !== null)) && /* @__PURE__ */ t(
      "textarea",
      {
        className: "ot-survey-textarea",
        placeholder: n === "text" ? l : d,
        "aria-label": n === "text" ? l : d ?? "Additional comments",
        value: C,
        onChange: (c) => o(c.target.value)
      }
    ),
    /* @__PURE__ */ v("div", { className: "ot-footer", children: [
      E ? /* @__PURE__ */ t("button", { type: "button", className: "ot-btn ot-btn-ghost", onClick: E, children: "Not now" }) : /* @__PURE__ */ t("span", {}),
      /* @__PURE__ */ t("button", { type: "button", className: "ot-btn ot-btn-primary", disabled: !M, onClick: m, children: x })
    ] })
  ] });
}
function qe({
  specs: r,
  links: n = [],
  title: l = "Help & guides",
  searchPlaceholder: u = "Search…",
  floating: i = !1,
  launcherGlyph: y = "?",
  emptyMessage: d = "Nothing matches that search.",
  locale: x = "en",
  i18nResolver: S,
  className: N = ""
}) {
  const f = le(), [E, h] = T(""), [k, b] = T(!i), a = r ?? f.specs, C = B(() => {
    const o = (m) => m === void 0 ? "" : K(m, x, S, f.context), w = E.trim().toLowerCase(), R = a.map((m) => ({
      kind: "tour",
      id: m.id,
      label: o(m.title),
      description: o(m.description),
      seen: f.hasSeen(m.id)
    })), $ = n.map((m) => ({
      kind: "link",
      id: m.href,
      label: m.label,
      description: m.description ?? "",
      href: m.href
    })), M = [...R, ...$];
    return w ? M.filter(
      (m) => m.label.toLowerCase().includes(w) || m.description.toLowerCase().includes(w)
    ) : M;
  }, [a, n, E, x, S, f]);
  return i && !k ? /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: "ot-hub-launcher",
      "aria-label": l,
      onClick: () => b(!0),
      children: y
    }
  ) : /* @__PURE__ */ v(se, { children: [
    /* @__PURE__ */ v("div", { className: `ot-hub ${i ? "ot-hub--floating" : ""} ${N}`.trim(), children: [
      /* @__PURE__ */ v("div", { className: "ot-hub-header", children: [
        /* @__PURE__ */ t("h3", { className: "ot-hub-title", children: l }),
        /* @__PURE__ */ t(
          "input",
          {
            type: "search",
            className: "ot-hub-search",
            placeholder: u,
            "aria-label": u,
            value: E,
            onChange: (o) => h(o.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ v("ul", { className: "ot-hub-list", children: [
        C.length === 0 && /* @__PURE__ */ t("li", { className: "ot-hub-empty", children: d }),
        C.map((o) => /* @__PURE__ */ t("li", { children: o.kind === "tour" ? /* @__PURE__ */ v(
          "button",
          {
            type: "button",
            className: "ot-hub-item",
            onClick: () => {
              f.start(o.id), i && b(!1);
            },
            children: [
              o.seen ? "↻ " : "",
              o.label,
              o.description && /* @__PURE__ */ t("span", { className: "ot-hub-item-desc", children: o.description })
            ]
          }
        ) : /* @__PURE__ */ v(
          "a",
          {
            className: "ot-hub-item",
            href: o.href,
            target: "_blank",
            rel: "noopener noreferrer",
            children: [
              o.label,
              " ↗",
              o.description && /* @__PURE__ */ t("span", { className: "ot-hub-item-desc", children: o.description })
            ]
          }
        ) }, `${o.kind}-${o.id}`))
      ] })
    ] }),
    i && /* @__PURE__ */ t(
      "button",
      {
        type: "button",
        className: "ot-hub-launcher",
        "aria-label": "Close help",
        onClick: () => b(!1),
        children: "×"
      }
    )
  ] });
}
function Fe({
  target: r,
  content: n,
  glyph: l = "?",
  openOnHover: u = !1,
  zIndex: i,
  className: y = ""
}) {
  const [d, x] = T(null), [S, N] = T(!1), f = D(0), h = JSON.stringify(typeof r == "string" ? { selector: r } : r);
  return L(() => {
    let k = !0;
    const b = () => {
      if (!k) return;
      const o = Te(JSON.parse(h));
      if (!o) {
        x(null);
        return;
      }
      const w = o.element.getBoundingClientRect();
      x({
        x: w.x + o.frameOffset.x + w.width,
        y: w.y + o.frameOffset.y
      });
    }, a = () => {
      cancelAnimationFrame(f.current), f.current = requestAnimationFrame(b);
    };
    b(), window.addEventListener("resize", a), window.addEventListener("scroll", a, !0);
    const C = new ResizeObserver(a);
    return C.observe(document.documentElement), () => {
      k = !1, cancelAnimationFrame(f.current), window.removeEventListener("resize", a), window.removeEventListener("scroll", a, !0), C.disconnect();
    };
  }, [h]), d ? /* @__PURE__ */ v(
    "div",
    {
      className: `ot-hint ${y}`.trim(),
      style: { left: d.x, top: d.y, ...i ? { zIndex: i } : {} },
      onMouseEnter: u ? () => N(!0) : void 0,
      onMouseLeave: u ? () => N(!1) : void 0,
      children: [
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "ot-hint-dot",
            "aria-expanded": S,
            "aria-label": S ? "Hide hint" : "Show hint",
            onClick: () => N((k) => !k),
            children: l
          }
        ),
        S && /* @__PURE__ */ t(
          "div",
          {
            className: "ot-hint-panel",
            role: "tooltip",
            dangerouslySetInnerHTML: { __html: ae(n) }
          }
        )
      ]
    }
  ) : null;
}
function Ie({ entries: r, ...n }) {
  const l = D(null), u = D(null), i = D(n);
  return L(() => {
    i.current = n;
  }), L(() => {
    const y = l.current;
    if (!y) return;
    const d = xe({
      ...i.current,
      entries: [],
      container: y
    });
    return u.current = d, () => {
      d.destroy(), u.current = null;
    };
  }, []), L(() => {
    u.current?.setEntries(r);
  }, [r]), /* @__PURE__ */ t("div", { ref: l });
}
export {
  He as Announcement,
  Be as Banner,
  Tt as CSS,
  Ie as Changelog,
  ze as DEFAULT_LABELS,
  Fe as Hint,
  Ge as MemoryStorage,
  qe as ResourceCenter,
  Je as SurfaceState,
  Oe as Survey,
  _e as TourAnchor,
  Pe as TourChecklist,
  Ke as TourEngine,
  Ce as TourOrchestrator,
  oe as TourPersistence,
  Me as TourProvider,
  Qe as assertValidSpec,
  Ue as assignAll,
  We as assignVariant,
  Et as blocksToText,
  Lt as checkExpression,
  Vt as createAmplitudeAdapter,
  Xe as createAnnouncement,
  Ye as createBanner,
  xe as createChangelog,
  Ze as createChecklist,
  et as createCookieStorage,
  jt as createDatadogAdapter,
  zt as createDebugAdapter,
  Gt as createEventCollector,
  Jt as createFunnelReport,
  Kt as createGA4Adapter,
  Qt as createHeapAdapter,
  tt as createHint,
  Ut as createHttpAdapter,
  rt as createIndexedDBStorage,
  nt as createKeyResolver,
  st as createLocaleResolver,
  ot as createMemoryStorage,
  Wt as createMixpanelAdapter,
  Xt as createMultiAdapter,
  Yt as createPostHogAdapter,
  at as createRemoteStorage,
  ct as createResourceCenter,
  Zt as createRudderStackAdapter,
  er as createSegmentAdapter,
  lt as createSurvey,
  it as createTour,
  ut as createTours,
  dt as createTutorialLayer,
  ht as currentPath,
  mt as defineSpec,
  pt as defineStep,
  At as describeTarget,
  Rt as escapeHtml,
  $t as evaluateExpression,
  Mt as evaluateShowIf,
  ft as extendSpec,
  tr as filterEvents,
  Dt as hasBlockMarkdown,
  vt as installTrigger,
  bt as interpolate,
  _t as isVisible,
  gt as localeDirection,
  yt as matchPath,
  we as normalizeContent,
  Nt as onLocationChange,
  Pt as queryDeep,
  Se as renderBlocks,
  ae as renderInline,
  Bt as renderMarkdown,
  kt as resolveLabel,
  Te as resolveTarget,
  Ht as resolveTargets,
  K as resolveText,
  Ot as safeQuery,
  Ct as selectPlural,
  rr as shouldSample,
  le as useTour,
  De as useTourEvents,
  xt as validateSpec,
  wt as validateSpecs,
  qt as waitForElement,
  Ft as waitForTarget,
  nr as withEventTypes,
  sr as withSampling
};
//# sourceMappingURL=react.js.map
