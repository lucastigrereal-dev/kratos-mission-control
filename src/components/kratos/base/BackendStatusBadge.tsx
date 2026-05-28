/**
 * BackendStatusBadge — W0-B4
 * Indicador inline de saúde do Python backend (localhost:5100).
 * 4 estados: live / degraded / offline / unknown.
 *
 * Exports:
 *  - BackendStatusBadge  → chip compacto para uso na topbar/sistema
 *  - BackendOfflineBanner → barra discreta fixa quando backend cai
 *
 * TDAH-first: banner em vermelho escuro (não alarme gritante), com botão
 * de reconexão. Aparece só quando browser está online mas backend caiu.
 */

import { RefreshCw } from "lucide-react";
import { useBackendHealth, type BackendStatus } from "@/hooks/useBackendHealth";
import { useOffline } from "@/hooks/useOffline";
import { StatusDot, type Severity } from "./StatusDot";

// ── Metadados visuais por estado ──────────────────────────────────────────────

interface BadgeMeta {
  label: string;
  severity: Severity;
  pulse?: boolean;
}

const STATUS_META: Record<BackendStatus, BadgeMeta> = {
  live:     { label: "LIVE",     severity: "ok",       pulse: true },
  degraded: { label: "DEGRADED", severity: "warn" },
  offline:  { label: "OFFLINE",  severity: "critical" },
  unknown:  { label: "…",        severity: "muted" },
};

// ── BackendStatusBadge ────────────────────────────────────────────────────────

/**
 * Chip compacto mostrando o estado do backend Python.
 * Uso: topbar, página /sistema, cards de saúde.
 */
export function BackendStatusBadge() {
  const { status } = useBackendHealth();
  const meta = STATUS_META[status];

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1"
      style={{
        background: "var(--kratos-surface-2)",
        border:     "1px solid var(--kratos-border)",
      }}
      title={`Backend: ${status}`}
      aria-label={`Backend ${status}`}
    >
      <StatusDot severity={meta.severity} pulse={meta.pulse} size="xs" />
      <span
        className="text-[9px] kratos-mono uppercase tracking-[0.15em]"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        {meta.label}
      </span>
    </div>
  );
}

// ── BackendOfflineBanner ──────────────────────────────────────────────────────

/**
 * Barra fixa discreta que aparece quando:
 *  - browser está ONLINE (senão OfflineBanner já cobre)
 *  - backend está OFFLINE (2+ falhas consecutivas)
 *
 * Posição: top: 90 (abaixo do TopBarV2, não bloqueia conteúdo)
 * Z-index: 8990 (abaixo do OfflineBanner em 9000)
 */
export function BackendOfflineBanner() {
  const { status, retry } = useBackendHealth();
  const browserOffline    = useOffline();

  // Se o browser está offline, o OfflineBanner já aparece e é mais relevante.
  // Só mostramos quando browser está online mas backend caiu.
  if (browserOffline || status !== "offline") return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="fixed left-0 right-0 z-[8990] flex items-center justify-center gap-3 px-4 py-1.5"
      style={{
        top:            90,
        background:     "color-mix(in oklab, var(--kratos-critical) 10%, transparent)",
        borderBottom:   "1px solid color-mix(in oklab, var(--kratos-critical) 22%, transparent)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <StatusDot severity="critical" size="xs" blink />

      <span
        className="text-[11px] font-medium"
        style={{ color: "var(--kratos-critical)" }}
      >
        Backend offline — dados podem estar desatualizados.
      </span>

      <button
        type="button"
        onClick={retry}
        className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] kratos-mono uppercase tracking-wider transition-opacity duration-100 kratos-focus-ring hover:opacity-80 active:opacity-60"
        style={{
          background: "color-mix(in oklab, var(--kratos-critical) 14%, transparent)",
          border:     "1px solid color-mix(in oklab, var(--kratos-critical) 28%, transparent)",
          color:      "var(--kratos-critical)",
        }}
        aria-label="Tentar reconectar ao backend agora"
      >
        <RefreshCw className="h-2.5 w-2.5" aria-hidden />
        Reconectar
      </button>
    </div>
  );
}
