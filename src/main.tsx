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

  // Global error handler with resource diagnostics
  window.addEventListener(
    "error",
    (ev: ErrorEvent) => {
      const isExtensionUrl = (u: any) => {
        const s = String(u || "");
        return s.startsWith("chrome-extension://") || s.startsWith("moz-extension://");
      };

      // Resource loading errors (img, script, link, etc.)
      const target = (ev as any).target as Element | null;
      if (target && target !== window) {
        const tag = (target as any).tagName?.toLowerCase?.() || "unknown";
        const url = (target as any).src || (target as any).href || "";
        if (isExtensionUrl(url)) return;
        if (/favicon\.ico$/i.test(String(url))) return; // ignore favicon noise
        pushErr("resource", `${tag}:${url || "(inline)"}`);
        console.warn("[dev] Resource load error:", { tag, url });
        return;
      }

      const msg = ev.message || "Script/resource error";
      if (typeof msg === "string" && /Abort|ERR_ABORTED/i.test(msg)) {
        console.info("[dev] Aborted load detected:", msg);
        pushErr("abort", msg);
        return;
      }
      pushErr("error", msg);
      console.error("[dev] Global error:", {
        message: msg,
        filename: (ev as any).filename,
        lineno: (ev as any).lineno,
        colno: (ev as any).colno,
      });
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
