/** Wait for an element to appear in the DOM (MutationObserver + polling fallback). */

export function waitForElement(selector: string, timeout = 5000): Promise<Element | null> {
  return new Promise((resolve) => {
    const existing = safeQuery(selector);
    if (existing) { resolve(existing); return; }

    let done = false;
    const finish = (el: Element | null) => {
      if (done) return;
      done = true;
      obs.disconnect();
      clearInterval(iv);
      clearTimeout(to);
      resolve(el);
    };

    const obs = new MutationObserver(() => {
      const el = safeQuery(selector);
      if (el) finish(el);
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });

    const iv = setInterval(() => {
      const el = safeQuery(selector);
      if (el) finish(el);
    }, 100);

    const to = setTimeout(() => finish(null), timeout);
  });
}

export function safeQuery(selector: string): Element | null {
  try { return document.querySelector(selector); } catch { return null; }
}
