/**
 * KRATOS Sentry integration — W11-B5
 *
 * Inicia o Sentry SDK apenas quando VITE_SENTRY_DSN está configurado.
 * Sem DSN: todas as chamadas são no-op silenciosas — zero console noise.
 *
 * DSN é uma chave PÚBLICA (design intencional do Sentry — pode ir no bundle).
 * Secretos de servidor (STRIPE_*, ANTHROPIC_*, etc.) NÃO usam VITE_ prefix.
 *
 * Uso:
 *   import { initSentry, sentryEnabled, captureError, addBreadcrumb } from "@/lib/sentry";
 *   initSentry(); // chamar uma vez no entry point
 */

import * as Sentry from "@sentry/react";

// ── Config ────────────────────────────────────────────────────────────────

const DSN =
  typeof import.meta !== "undefined"
    ? import.meta.env?.VITE_SENTRY_DSN
    : undefined;

const ENVIRONMENT =
  typeof import.meta !== "undefined"
    ? (import.meta.env?.VITE_SENTRY_ENVIRONMENT ?? (import.meta.env?.DEV ? "development" : "production"))
    : "unknown";

const RELEASE =
  typeof import.meta !== "undefined"
    ? import.meta.env?.VITE_SENTRY_RELEASE
    : undefined;

// ── Public API ────────────────────────────────────────────────────────────

/** True quando Sentry está ativo (DSN configurado) */
export function sentryEnabled(): boolean {
  return Boolean(DSN);
}

/**
 * Inicializa o Sentry. Chame UMA VEZ no entry point (src/start.ts ou __root).
 * No-op se VITE_SENTRY_DSN não estiver configurado.
 */
export function initSentry(): void {
  if (!DSN) return;

  Sentry.init({
    dsn: DSN,
    environment: ENVIRONMENT,
    release: RELEASE,

    // Performance monitoring — 10% em prod, 100% em dev
    tracesSampleRate: ENVIRONMENT === "production" ? 0.1 : 1.0,

    // Session replay — desativado (privacidade)
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,

    // Fingerprinting — agrupa erros similares
    beforeSend(event) {
      // Nunca enviar dados do usuário local (TDAH-first privacy)
      if (event.user) {
        delete event.user.ip_address;
        delete event.user.email;
      }
      return event;
    },

    // Integrações minimalistas
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
  });
}

/**
 * Captura um erro para o Sentry (com contexto extra).
 * No-op se Sentry não estiver ativo.
 */
export function captureError(
  error: Error | string,
  context?: Record<string, unknown>,
): void {
  if (!sentryEnabled()) return;

  if (typeof error === "string") {
    Sentry.captureMessage(error, {
      level: "error",
      extra: context,
    });
  } else {
    Sentry.captureException(error, { extra: context });
  }
}

/**
 * Captura uma mensagem de aviso/info para o Sentry.
 * No-op se Sentry não estiver ativo.
 */
export function captureMessage(
  message: string,
  level: "fatal" | "error" | "warning" | "log" | "info" | "debug" = "warning",
  extra?: Record<string, unknown>,
): void {
  if (!sentryEnabled()) return;
  Sentry.captureMessage(message, { level, extra });
}

/**
 * Adiciona um breadcrumb ao contexto do Sentry.
 * No-op se Sentry não estiver ativo.
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, unknown>,
  level: Sentry.SeverityLevel = "info",
): void {
  if (!sentryEnabled()) return;
  Sentry.addBreadcrumb({ message, category, data, level });
}

/**
 * Seta contexto do usuário (apenas ID anônimo — sem PII).
 * No-op se Sentry não estiver ativo.
 */
export function setSentryUser(anonymousId: string): void {
  if (!sentryEnabled()) return;
  Sentry.setUser({ id: anonymousId });
}
