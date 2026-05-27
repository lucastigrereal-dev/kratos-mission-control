/**
 * KRATOS Error Handler — W8-B2 (sem Sentry SDK)
 *
 * Captura erros globais não tratados e envia para o sistema de analytics.
 * Produção: envia para VITE_ANALYTICS_ENDPOINT se configurado.
 * Dev: loga no console com contexto detalhado.
 *
 * Instalar: chamar installGlobalErrorHandlers() uma vez no entry point.
 */

import { track } from "./kratosAnalytics";

export interface CapturedError {
  message: string;
  stack?: string;
  type: "js" | "unhandled_promise" | "resource";
  url?: string;
  line?: number;
  col?: number;
  ts: number;
}

/** In-memory ring buffer — últimos 20 erros para diagnóstico */
const ERROR_LOG: CapturedError[] = [];
const MAX_LOG = 20;

/** Expõe o log para uso em devtools / ErrorBoundary */
export function getErrorLog(): Readonly<CapturedError[]> {
  return ERROR_LOG;
}

function appendError(err: CapturedError): void {
  ERROR_LOG.push(err);
  if (ERROR_LOG.length > MAX_LOG) ERROR_LOG.shift();
}

function sanitizeMessage(msg: string): string {
  // Strip paths that might contain user-specific info
  return msg.replace(/C:\\Users\\[^\\]+\\/g, "~\\").slice(0, 200);
}

/**
 * Install window-level error handlers.
 * Safe to call multiple times — installs only once.
 */
let _installed = false;

export function installGlobalErrorHandlers(): void {
  if (typeof window === "undefined") return; // SSR guard
  if (_installed) return;
  _installed = true;

  // Unhandled JS errors
  window.addEventListener("error", (evt) => {
    if (!evt.error && !evt.message) return; // Resource errors (img, script 404) — skip

    const captured: CapturedError = {
      message: sanitizeMessage(evt.message || String(evt.error)),
      stack: evt.error?.stack?.slice(0, 500),
      type: "js",
      url: evt.filename,
      line: evt.lineno,
      col: evt.colno,
      ts: Date.now(),
    };

    appendError(captured);
    track("error_boundary", {
      error_type: "global_js",
      path: window.location.pathname,
    });

    if (import.meta.env?.DEV) {
      console.error("[kratos:error]", captured);
    }
  });

  // Unhandled promise rejections
  window.addEventListener("unhandledrejection", (evt) => {
    const reason = evt.reason;
    const message =
      reason instanceof Error
        ? reason.message
        : typeof reason === "string"
          ? reason
          : "Unhandled promise rejection";

    const captured: CapturedError = {
      message: sanitizeMessage(message),
      stack: reason instanceof Error ? reason.stack?.slice(0, 500) : undefined,
      type: "unhandled_promise",
      ts: Date.now(),
    };

    appendError(captured);
    track("error_boundary", {
      error_type: "unhandled_promise",
      path: window.location.pathname,
    });

    if (import.meta.env?.DEV) {
      console.error("[kratos:promise]", captured);
    }
  });
}
