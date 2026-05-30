/**
 * OperatorWorkspaceSelector — W20-B04
 *
 * Seletor de operador e workspace em modo local/mock.
 * Permite trocar de role para visualizar o RBAC visual.
 * Sem OAuth. Sem conexão externa.
 *
 * TDAH-first: compact por padrão, expande ao clicar.
 */
import { useState } from "react";
import { User, ChevronDown, Check, Shield, Eye, Code2, Lock } from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { useOperatorSession } from "@/hooks/useOperatorSession";
import type { OperatorRole } from "../../../../api-contract/operator.schema";

const ROLE_ICONS: Record<OperatorRole, React.ElementType> = {
  admin: Shield,
  operator: User,
  viewer: Eye,
  dev: Code2,
};

const ROLE_LABELS: Record<OperatorRole, string> = {
  admin: "Admin",
  operator: "Operador",
  viewer: "Visualizador",
  dev: "Dev",
};

const ROLE_DESCRIPTIONS: Record<OperatorRole, string> = {
  admin: "Acesso total — Lucas Tigre",
  operator: "Pode ver + dry-run",
  viewer: "Apenas visualização",
  dev: "Modo debug + raw data",
};

const ROLE_ORDER: OperatorRole[] = ["admin", "operator", "viewer", "dev"];

interface OperatorWorkspaceSelectorProps {
  /** Modo compacto (apenas avatar + nome) vs expandido */
  compact?: boolean;
}

export function OperatorWorkspaceSelector({ compact = false }: OperatorWorkspaceSelectorProps) {
  const { operator, workspace, role, changeRole, changeWorkspace, availableWorkspaces } =
    useOperatorSession();
  const [open, setOpen] = useState(false);

  const RoleIcon = ROLE_ICONS[role];

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl px-3 py-2 w-full transition-colors text-left"
        style={{
          background: open
            ? "color-mix(in srgb, var(--kr-island-omnis) 10%, transparent)"
            : "color-mix(in srgb, var(--kratos-surface-3) 50%, transparent)",
          border: `1px solid ${open
            ? "color-mix(in srgb, var(--kr-island-omnis) 20%, transparent)"
            : "color-mix(in srgb, var(--kratos-text-muted) 10%, transparent)"}`,
        }}
      >
        {/* Avatar */}
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
          style={{
            background: "color-mix(in srgb, var(--kr-island-omnis) 20%, transparent)",
            color: "var(--kr-island-omnis)",
          }}
        >
          {operator.avatarInitial}
        </div>

        {!compact && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-medium truncate" style={{ color: "var(--kratos-text-primary)" }}>
                {operator.name}
              </span>
              <span
                className="rounded px-1 text-[8px] font-bold uppercase"
                style={{
                  background: "color-mix(in srgb, var(--kratos-warn) 12%, transparent)",
                  color: "var(--kratos-warn)",
                }}
              >
                MOCK
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <RoleIcon className="h-3 w-3" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
              <span className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
                {ROLE_LABELS[role]} · {workspace.name}
              </span>
            </div>
          </div>
        )}

        <ChevronDown
          className="h-3.5 w-3.5 shrink-0 transition-transform"
          style={{
            color: "var(--kratos-text-muted)",
            transform: open ? "rotate(180deg)" : "none",
          }}
          aria-hidden
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl overflow-hidden"
          style={{
            background: "var(--kratos-surface-2)",
            border: "1px solid color-mix(in srgb, var(--kratos-text-muted) 12%, transparent)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {/* Role section */}
          <div className="p-2">
            <p className="text-[9px] uppercase tracking-wider px-2 py-1" style={{ color: "var(--kratos-text-muted)" }}>
              Role (simulação local)
            </p>
            {ROLE_ORDER.map((r) => {
              const Icon = ROLE_ICONS[r];
              const isActive = r === role;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => { changeRole(r); setOpen(false); }}
                  className="flex items-center gap-2.5 w-full rounded-lg px-2 py-2 transition-colors text-left"
                  style={{
                    background: isActive
                      ? "color-mix(in srgb, var(--kr-island-omnis) 10%, transparent)"
                      : "transparent",
                  }}
                >
                  <Icon
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: isActive ? "var(--kr-island-omnis)" : "var(--kratos-text-muted)" }}
                    aria-hidden
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[11px] font-medium"
                      style={{ color: isActive ? "var(--kr-island-omnis)" : "var(--kratos-text-primary)" }}
                    >
                      {ROLE_LABELS[r]}
                    </p>
                    <p className="text-[9px]" style={{ color: "var(--kratos-text-muted)" }}>
                      {ROLE_DESCRIPTIONS[r]}
                    </p>
                  </div>
                  {isActive && (
                    <Check className="h-3 w-3 shrink-0" style={{ color: "var(--kr-island-omnis)" }} aria-hidden />
                  )}
                </button>
              );
            })}
          </div>

          {/* Workspace section */}
          <div
            className="p-2"
            style={{ borderTop: "1px solid color-mix(in srgb, var(--kratos-text-muted) 8%, transparent)" }}
          >
            <p className="text-[9px] uppercase tracking-wider px-2 py-1" style={{ color: "var(--kratos-text-muted)" }}>
              Workspace
            </p>
            {availableWorkspaces.map((ws) => {
              const isActive = ws.id === workspace.id;
              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => { changeWorkspace(ws.id); setOpen(false); }}
                  className="flex items-center gap-2 w-full rounded-lg px-2 py-2 transition-colors text-left"
                  style={{
                    background: isActive
                      ? "color-mix(in srgb, var(--kr-island-omnis) 8%, transparent)"
                      : "transparent",
                  }}
                >
                  <div
                    className="h-4 w-4 rounded flex items-center justify-center shrink-0 text-[7px] font-bold"
                    style={{
                      background: "color-mix(in srgb, var(--kr-island-omnis) 15%, transparent)",
                      color: "var(--kr-island-omnis)",
                    }}
                  >
                    {ws.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span
                    className="flex-1 text-[11px] truncate"
                    style={{ color: isActive ? "var(--kr-island-omnis)" : "var(--kratos-text-secondary)" }}
                  >
                    {ws.name}
                  </span>
                  {isActive && (
                    <Check className="h-3 w-3 shrink-0" style={{ color: "var(--kr-island-omnis)" }} aria-hidden />
                  )}
                </button>
              );
            })}
          </div>

          {/* OAuth Human Slot */}
          <div
            className="px-3 py-2.5 flex items-center gap-2"
            style={{
              borderTop: "1px solid color-mix(in srgb, var(--kratos-text-muted) 8%, transparent)",
              background: "color-mix(in srgb, var(--kratos-surface-3) 40%, transparent)",
            }}
          >
            <Lock className="h-3 w-3 shrink-0" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
            <div>
              <p className="text-[9px] font-semibold uppercase" style={{ color: "var(--kratos-text-muted)" }}>
                OAuth Meta / Google — Human Slot
              </p>
              <p className="text-[9px]" style={{ color: "var(--kratos-text-muted)" }}>
                Requer META_APP_ID + SECRET — não configurado
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
