/**
 * MockModeAuditBanner — W20-B06
 *
 * Exibe claramente que KRATOS está em LOCAL MOCK MODE.
 * Mostra: fonte dos dados, status auth, modo de operador.
 *
 * TDAH-first: ação primária óbvia (dismiss ou ir a perfil).
 * Posicionado no topo de telas sensíveis.
 */
import { AlertTriangle, X, User, Lock } from "lucide-react";
import { useState } from "react";
import { useOperatorSession } from "@/hooks/useOperatorSession";

interface MockModeAuditBannerProps {
  /** Mostrar informações expandidas */
  verbose?: boolean;
  /** Permitir dismiss (padrão: true) */
  dismissible?: boolean;
}

export function MockModeAuditBanner({
  verbose = false,
  dismissible = true,
}: MockModeAuditBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const { operator, workspace, authMode, loginMethod } = useOperatorSession();

  if (dismissed) return null;

  return (
    <div
      className="rounded-lg px-4 py-3 mb-4 flex items-start gap-3"
      style={{
        background: "color-mix(in srgb, var(--kratos-warn) 6%, transparent)",
        border: "1px solid color-mix(in srgb, var(--kratos-warn) 20%, transparent)",
      }}
      role="alert"
      aria-label="Modo mock ativo"
    >
      <AlertTriangle
        className="h-4 w-4 shrink-0 mt-0.5"
        style={{ color: "var(--kratos-warn)" }}
        aria-hidden
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ color: "var(--kratos-warn)" }}
          >
            LOCAL MOCK MODE
          </span>
          <span
            className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase"
            style={{
              background: "color-mix(in srgb, var(--kratos-warn) 12%, transparent)",
              color: "var(--kratos-warn)",
            }}
          >
            AUTH: {authMode.toUpperCase()}
          </span>
          <span
            className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase"
            style={{
              background: "color-mix(in srgb, var(--kratos-text-muted) 8%, transparent)",
              color: "var(--kratos-text-muted)",
            }}
          >
            {loginMethod.toUpperCase()}
          </span>
        </div>
        <p className="text-[11px] mt-0.5" style={{ color: "var(--kratos-text-secondary)" }}>
          Dados são mock ou cache local. Sem conexão com Meta, Stripe ou OAuth real.
        </p>
        {verbose && (
          <div className="mt-2 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
              <span className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
                {operator.name} · {operator.handle} · {operator.role}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-3 w-3" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
              <span className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
                Workspace: {workspace.name} ({workspace.tier})
              </span>
            </div>
          </div>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Fechar aviso"
        >
          <X className="h-3.5 w-3.5" style={{ color: "var(--kratos-text-muted)" }} />
        </button>
      )}
    </div>
  );
}
