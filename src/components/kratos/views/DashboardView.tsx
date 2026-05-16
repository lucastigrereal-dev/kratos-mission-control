import { useNavigate } from "@tanstack/react-router";
import {
  FolderGit2,
  CheckCircle2,
  CalendarClock,
  Crosshair,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { useDashboard } from "@/hooks/useDashboard";

function StatBlock({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number | string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="flex flex-col">
      <span
        className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        {label}
      </span>
      <span
        className="text-[28px] font-bold leading-none mt-1"
        style={{ color }}
      >
        {value}
      </span>
      {sub && (
        <span
          className="text-[11px] mt-0.5"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

function QuickLink({
  icon: Icon,
  label,
  to,
  accent,
}: {
  icon: typeof FolderGit2;
  label: string;
  to: string;
  accent: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate({ to })}
      className="kratos-focus-ring kratos-card-hover flex items-center gap-3 rounded-md px-4 py-3 text-left w-full"
      style={{
        background: "var(--kratos-surface-2)",
        border: "1px solid var(--kratos-border)",
      }}
    >
      <Icon className="h-4 w-4 shrink-0" style={{ color: accent }} />
      <span
        className="text-[13px] font-medium flex-1"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {label}
      </span>
      <ArrowRight
        className="h-3.5 w-3.5 shrink-0"
        style={{ color: "var(--kratos-text-muted)" }}
      />
    </button>
  );
}

export function DashboardView() {
  const d = useDashboard();

  if (d.isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
        <SectionHeader
          eyebrow="Mission Control"
          title="KRATOS"
          description="Carregando visão consolidada..."
        />
        <LoadingState lines={8} />
      </div>
    );
  }

  const hasAlerts = d.appointments.overdue > 0;
  const isOnFocus = d.contexto?.focusStatus === "on_focus";

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      <SectionHeader
        eyebrow="Mission Control"
        title="KRATOS"
        description="Visão consolidada de projetos, checkpoints, agenda e contexto."
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard accent="none">
          <StatBlock
            label="Projetos ativos"
            value={d.projects.active}
            sub={`${d.projects.total} total · ${d.projects.completed} concluídos`}
            color="var(--kratos-ok)"
          />
        </StatusCard>
        <StatusCard accent="none">
          <StatBlock
            label="Em progresso"
            value={d.checkpoints.inProgress + d.checkpoints.pending}
            sub={`${d.checkpoints.completed} concluídos`}
            color="var(--kratos-accent)"
          />
        </StatusCard>
        <StatusCard accent="none">
          <StatBlock
            label="Compromissos hoje"
            value={d.appointments.today}
            sub={`${d.appointments.overdue} atrasados`}
            color="var(--kratos-info)"
          />
        </StatusCard>
        <StatusCard accent={isOnFocus ? "on_focus" : "none"}>
          <StatBlock
            label="Foco"
            value={isOnFocus ? "ON" : "OFF"}
            sub={
              d.contexto
                ? `${d.contexto.project} · ${d.contexto.focusStatus}`
                : "Sem dados"
            }
            color={
              isOnFocus ? "var(--kratos-ok)" : "var(--kratos-warn)"
            }
          />
        </StatusCard>
      </div>

      {/* Alert bar */}
      {hasAlerts && (
        <div className="mt-4">
          <StatusCard accent="off_focus">
            <div className="flex items-center gap-3">
              <AlertTriangle
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--kratos-risk)" }}
              />
              <span
                className="text-[13px] font-medium"
                style={{ color: "var(--kratos-text-primary)" }}
              >
                {d.appointments.overdue} compromisso
                {d.appointments.overdue > 1 ? "s" : ""} atrasado
                {d.appointments.overdue > 1 ? "s" : ""}
              </span>
              <span
                className="text-[11px] ml-auto"
                style={{ color: "var(--kratos-text-muted)" }}
              >
                Ir para Agenda →
              </span>
            </div>
          </StatusCard>
        </div>
      )}

      {/* Quick navigation */}
      <div className="mt-6">
        <div
          className="mb-3 text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          — Acesso rápido —
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickLink
            icon={Crosshair}
            label="Agora"
            to="/agora"
            accent="var(--kratos-accent)"
          />
          <QuickLink
            icon={CalendarClock}
            label="Agenda"
            to="/agenda"
            accent="var(--kratos-info)"
          />
          <QuickLink
            icon={CheckCircle2}
            label="Checkpoints"
            to="/checkpoints"
            accent="var(--kratos-ok)"
          />
          <QuickLink
            icon={FolderGit2}
            label="Projetos"
            to="/projetos"
            accent="var(--kratos-accent)"
          />
        </div>
      </div>
    </div>
  );
}
