import {
  Crosshair,
  ArrowRight,
  AlertOctagon,
  Clock,
  Save,
  Sparkles,
} from "lucide-react";
import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot } from "@/components/kratos/base/StatusDot";
import { AlertBadge } from "@/components/kratos/base/AlertBadge";

function CardLabel({ icon: Icon, label }: { icon: typeof Crosshair; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon
        className="h-3.5 w-3.5"
        style={{ color: "var(--kratos-text-muted)" }}
      />
      <span
        className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        {label}
      </span>
    </div>
  );
}

export function AgoraView() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Agora · 14:32 BRT"
        title="Foco do operador"
        description="Uma decisão, uma ação. O resto espera."
        right={
          <button
            type="button"
            disabled
            title="Disponível no próximo crédito"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[11px] kratos-mono uppercase tracking-[0.15em] cursor-not-allowed opacity-60 kratos-focus-ring"
            style={{
              background: "var(--kratos-surface-2)",
              border: "1px solid var(--kratos-border)",
              color: "var(--kratos-text-secondary)",
            }}
          >
            <Save className="h-3.5 w-3.5" />
            Salvar checkpoint
          </button>
        }
      />

      {/* F-pattern: foco (top-left) + próxima ação (top-right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatusCard accent="on_focus">
          <CardLabel icon={Crosshair} label="Foco atual" />
          <div
            className="text-[20px] font-semibold leading-tight"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            KRATOS · Mission Control
          </div>
          <div
            className="mt-1.5 text-[12px] leading-relaxed"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            Sessão ativa em <span className="kratos-mono">~/dev/kratos</span> ·
            branch <span className="kratos-mono">main</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <StatusDot severity="ok" pulse size="xs" />
            <span
              className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
              style={{ color: "var(--kratos-ok)" }}
            >
              on_focus · 47min
            </span>
          </div>
        </StatusCard>

        <StatusCard accent="info">
          <CardLabel icon={ArrowRight} label="Próxima ação" />
          <div
            className="text-[16px] font-medium leading-snug"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            Validar shell visual com Claude Code
          </div>
          <div
            className="mt-2 text-[12px] leading-relaxed"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            Próximo crédito conecta os hooks reais e troca os mocks por live data.
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span
              className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
              style={{ color: "var(--kratos-info)" }}
            >
              score 0.87
            </span>
            <span style={{ color: "var(--kratos-text-muted)" }}>·</span>
            <span
              className="text-[10px] kratos-mono"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              recomendado pelo Mentor
            </span>
          </div>
        </StatusCard>
      </div>

      {/* Alertas + Deadline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatusCard accent="off_focus">
          <CardLabel icon={AlertOctagon} label="Alertas críticos" />
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2.5">
              <StatusDot severity="critical" size="xs" className="mt-1.5" />
              <div className="min-w-0">
                <div
                  className="text-[12px] font-medium"
                  style={{ color: "var(--kratos-text-primary)" }}
                >
                  ActivityWatch offline
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "var(--kratos-text-secondary)" }}
                >
                  Coletor caiu há 4min · usando fallback mock
                </div>
              </div>
              <AlertBadge severity="critical" label="P1" className="ml-auto shrink-0" />
            </li>
            <li className="flex items-start gap-2.5">
              <StatusDot severity="warn" size="xs" className="mt-1.5" />
              <div className="min-w-0">
                <div
                  className="text-[12px] font-medium"
                  style={{ color: "var(--kratos-text-primary)" }}
                >
                  Branch dirty há 2h
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "var(--kratos-text-secondary)" }}
                >
                  12 arquivos modificados · sem checkpoint recente
                </div>
              </div>
              <AlertBadge severity="warn" label="P2" className="ml-auto shrink-0" />
            </li>
          </ul>
        </StatusCard>

        <StatusCard>
          <CardLabel icon={Clock} label="Deadline mais urgente" />
          <div
            className="text-[16px] font-medium leading-snug"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            Entrega Crédito 1 — KRATOS Shell
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className="text-[28px] font-semibold leading-none kratos-mono"
              style={{ color: "var(--kratos-warn)" }}
            >
              2d
            </span>
            <span
              className="text-[11px] kratos-mono uppercase tracking-[0.15em]"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              · 10 mai 2026
            </span>
          </div>
          <div
            className="mt-3 text-[11px]"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            Validação visual antes do Crédito 2 (Tela Agora completa).
          </div>
        </StatusCard>
      </div>

      {/* Atalho Aurora */}
      <StatusCard accent="ghost">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-md"
            style={{
              background: "rgba(99,102,241,0.10)",
              border: "1px solid var(--kratos-border-live)",
            }}
          >
            <Sparkles
              className="h-4 w-4"
              style={{ color: "var(--kratos-ghost)" }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="text-[13px] font-medium"
              style={{ color: "var(--kratos-text-primary)" }}
            >
              Aurora · Mentor
            </div>
            <div
              className="text-[11px]"
              style={{ color: "var(--kratos-text-secondary)" }}
            >
              Abra o painel à direita para conversar e revisar sinais.
            </div>
          </div>
          <span
            className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            Topbar → Aurora
          </span>
        </div>
      </StatusCard>
    </div>
  );
}
