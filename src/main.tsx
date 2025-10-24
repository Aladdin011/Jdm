import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializePerformanceOptimizations } from "./utils/performance";
import { initLayoutStability } from "./utils/layout-stability";

// Initialize performance optimizations
initializePerformanceOptimizations();
initLayoutStability();

// Dev-only diagnostics: improve error handling and reduce false alarms
if (import.meta.env.DEV) {
  // Ensure no stale service workers interfere with Vite dev requests
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch(() => {});
  }

  // Simple ring buffer for recent errors to aid debugging
  const recentErrors: { ts: number; type: string; message: string }[] = [];
  const pushErr = (type: string, message: string) => {
    recentErrors.push({ ts: Date.now(), type, message });
    if (recentErrors.length > 20) recentErrors.shift();
    // Expose for quick inspection in DevTools
    (window as any).__recentErrors = recentErrors;
  };

  // Global error handler (script/resource errors)
  window.addEventListener(
    "error",
    (ev: ErrorEvent) => {
      const msg = ev.message || "Script/resource error";
      // Treat aborted module loads in Vite dev as informational
      if (typeof msg === "string" && msg.includes("Abort")) {
        console.info("[dev] Aborted load detected:", msg);
        pushErr("abort", msg);
        return;
      }
      pushErr("error", msg);
      console.error("[dev] Global error:", msg);
    },
    true,
  );

  // Global unhandled rejection handler
  window.addEventListener("unhandledrejection", (ev: PromiseRejectionEvent) => {
    const reason = ev.reason;
    const msg = typeof reason === "string" ? reason : reason?.message || String(reason);
    // Suppress AbortError noise from canceled fetch/module requests in dev
    if (msg && /AbortError|network\s*aborted/i.test(msg)) {
      console.info("[dev] Suppressed abort rejection:", msg);
      pushErr("abort", msg);
      return;
    }
    pushErr("rejection", msg);
    console.error("[dev] Unhandled rejection:", msg);
  });
}

createRoot(document.getElementById("root")!).render(<App />);

// DEV-ONLY diagnostics (previously added)
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  (async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        await r.unregister();
      }
      console.info('[DEV] Unregistered any existing service workers');
    } catch (err) {
      console.warn('[DEV] Failed to unregister SWs', err);
    }
  })();
}

// Global error diagnostics (previously added)
(function attachGlobalErrorHandlers() {
  const isAbortLike = (err) =>
    !!err && (
      err.name === 'AbortError' ||
      /ERR_ABORTED|fetch aborted|navigation canceled/i.test(String(err))
    );
  (function extendDiagnosticsToIgnoreExtensions() {
    const IGNORE = import.meta.env.VITE_IGNORE_EXTENSIONS === 'true';
    if (!IGNORE) return;
    const isExtensionUrl = (u: any) => {
      const s = String(u || '');
      return s.includes('chrome-extension://') || s.includes('moz-extension://');
    };
    window.addEventListener('error', (e: any) => {
      const src = e?.filename || e?.error?.stack || e?.message;
      if (isExtensionUrl(src)) {
        // swallow extension-origin errors
        return;
      }
    }, true);
    window.addEventListener('unhandledrejection', (e: any) => {
      const src = e?.reason?.stack || e?.reason || '';
      if (isExtensionUrl(src)) {
        // swallow extension-origin rejections
        return;
      }
    });
  })();
  window.addEventListener('error', (e) => {
    const err = e.error || e.message || e;
    if (isAbortLike(err)) return; // suppress noisy dev cancellations
    console.error('[GlobalError]', err);
  });
  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason;
    if (isAbortLike(reason)) return;
    console.error('[UnhandledRejection]', reason);
  });
})();

// Runtime SVG attribute sanitizer to prevent preserveAspectRatio errors
(function sanitizeSvgPreserveAspectRatio() {
  if (typeof document === 'undefined') return;

  const fixSvg = (el) => {
    try {
      const v = el.getAttribute('preserveAspectRatio');
      if (!v) return;
      // Replace invalid YEnd with YMid; keep meet/slice suffixes intact
      if (/YEnd\b/.test(v)) {
        const corrected = v.replace(/YEnd\b/g, 'YMid');
        el.setAttribute('preserveAspectRatio', corrected);
        console.warn('[SVG] Corrected preserveAspectRatio:', v, '->', corrected);
      }
    } catch (err) {
      // Swallow to avoid interfering with render
    }
  };

  // Initial sweep
  document.querySelectorAll('svg[preserveAspectRatio]').forEach((el) => fixSvg(el));

  // Observe future DOM additions
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of m.addedNodes || []) {
        if (!(n instanceof Element)) continue;
        if (n.tagName && n.tagName.toLowerCase() === 'svg') fixSvg(n);
        n.querySelectorAll?.('svg[preserveAspectRatio]').forEach((el) => fixSvg(el));
      }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();