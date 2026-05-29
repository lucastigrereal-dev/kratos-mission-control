/**
 * KRATOS Structured Logger — W11-B4
 *
 * Logger estruturado para todo o frontend KRATOS.
 * - Dev: saída colorizada no console com level/module/timestamp
 * - Prod: debug/info silenciosos; warn/error → Sentry via captureError/captureMessage
 *
 * Uso:
 *   import { createLogger } from "@/lib/observability/logger";
 *   const log = createLogger("useLiveStatus");
 *   log.debug("polling interval", { ms: 10000 });
 *   log.warn("SSE dead state reached");
 *   log.error("parse failure", new Error("..."));
 */

import { captureError, captureMessage, sentryEnabled } from "@/lib/sentry";

// ── Types ─────────────────────────────────────────────────────────────────────

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  ts: string;
  level: LogLevel;
  module: string;
  msg: string;
  data?: Record<string, unknown>;
  error?: Error;
}

// ── Dev color map ─────────────────────────────────────────────────────────────

const DEV_COLORS: Record<LogLevel, string> = {
  debug: "color: #6b7280",         // gray
  info:  "color: #3b82f6",         // blue
  warn:  "color: #f59e0b",         // amber
  error: "color: #ef4444",         // red
};

const DEV_PREFIXES: Record<LogLevel, string> = {
  debug: "▸",
  info:  "ℹ",
  warn:  "⚠",
  error: "✖",
};

// ── Prod → Sentry bridge ──────────────────────────────────────────────────────

function sendToSentry(
  level: "warn" | "error",
  module: string,
  msg: string,
  data?: Record<string, unknown>,
  error?: Error,
): void {
  if (!sentryEnabled()) return;

  const context: Record<string, unknown> = { module, ...data };

  if (level === "error") {
    captureError(error ?? msg, context);
  } else {
    captureMessage(`[${module}] ${msg}`, "warning", context);
  }
}

// ── Logger factory ────────────────────────────────────────────────────────────

export interface Logger {
  debug(msg: string, data?: Record<string, unknown>): void;
  info(msg: string, data?: Record<string, unknown>): void;
  warn(msg: string, data?: Record<string, unknown>, error?: Error): void;
  error(msg: string, error?: Error, data?: Record<string, unknown>): void;
}

const IS_DEV =
  typeof import.meta !== "undefined" && import.meta.env?.DEV === true;

const IS_SSR = typeof window === "undefined";

/**
 * Cria um logger com o nome do módulo pré-configurado.
 * Em prod não emite console.debug/info — apenas warn/error via Sentry.
 */
export function createLogger(module: string): Logger {
  function log(
    level: LogLevel,
    msg: string,
    data?: Record<string, unknown>,
    error?: Error,
  ): void {
    const ts = new Date().toISOString().slice(11, 23); // HH:mm:ss.mmm

    // ── Dev: colorized console ────────────────────────────────────────────
    if (IS_DEV && !IS_SSR) {
      const prefix = DEV_PREFIXES[level];
      const style  = DEV_COLORS[level];
      const label  = `%c${prefix} [kratos:${module}] ${msg}`;

      if (level === "debug") {
        if (data) console.debug(label, style, data);
        else      console.debug(label, style);
      } else if (level === "info") {
        if (data) console.info(label, style, data);
        else      console.info(label, style);
      } else if (level === "warn") {
        if (data || error) console.warn(label, style, ...[data, error].filter(Boolean));
        else               console.warn(label, style);
      } else if (level === "error") {
        if (error || data) console.error(label, style, ...[error, data].filter(Boolean));
        else               console.error(label, style);
      }
      return;
    }

    // ── Prod: only warn/error → Sentry ────────────────────────────────────
    if (level === "warn" || level === "error") {
      sendToSentry(level, module, msg, data, error);
    }
    // debug and info are silenced in production
  }

  return {
    debug: (msg, data) => log("debug", msg, data),
    info:  (msg, data) => log("info",  msg, data),
    warn:  (msg, data, error) => log("warn",  msg, data, error),
    error: (msg, error, data) => log("error", msg, data, error),
  };
}

// ── Global singleton for quick one-off usage ──────────────────────────────────
export const logger = createLogger("kratos");
