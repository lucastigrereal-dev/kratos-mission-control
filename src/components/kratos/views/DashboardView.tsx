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
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { GithubRepoCard } from "@/components/kratos/sistema/GithubRepoCard";
import { useDashboard, useDashboardSnapshot } from "@/hooks/useDashboard";
import { useTrackedRepos, useGithubRepo, useGithubConfig } from "@/hooks/useGithub";
import { SourceBadgeIndicator } from "@/components/kratos/base/SourceBadgeIndicator";

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
      <span className="kratos-eyebrow">{label}</span>
      <span className="text-[28px] font-bold leading-none mt-1" style={{ color }}>
        {value}
      </span>
      {sub && (
        <span className="text-[11px] mt-0.5" style={{ color: "var(--kratos-text-muted)" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

const DEFAULT_OWNER = "lucastigrereal-dev";

function TrackedRepoCard({ owner, repo }: { owner: string; repo: string }) {
  const { data, isLoading, isError, error } = useGithubRepo(owner, repo);

  if (isLoading) return <LoadingState lines={3} compact />;
  if (isError)
    return (
      <ErrorState title={repo} description={error?.message ?? "Erro ao buscar repositório."} />
    );
  if (!data) return <EmptyState title={repo} description="Sem dados do repositório." />;
  return <GithubRepoCard repo={data} />;
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
      aria-label={`Ir para ${label}`}
    >
      <Icon className="h-4 w-4 shrink-0" style={{ color: accent }} />
      <span
        className="text-[13px] font-medium flex-1"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {label}
      </span>
      <ArrowRight className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
    </button>
  );
}

export function DashboardView() {
  const navigate = useNavigate();
  const d = useDashboard();
  const snap = useDashboardSnapshot();
  const ghConfig = useGithubConfig();
  const { data: trackedRepos, isLoading: reposLoading } = useTrackedRepos();

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
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SourceBadgeIndicator meta={snap.meta} />
        {ghConfig.data && !ghConfig.data.configured && (
          <span
            className="text-[0.65rem] rounded-full border px-2 py-0.5"
            style={{
              color: "var(--kratos-text-muted)",
              borderColor: "var(--kratos-warn)",
              background: "color-mix(in oklab, var(--kratos-warn) 8%, transparent)",
            }}
          >
            GitHub não configurado
          </span>
        )}
        {snap.data?.degraded && (
          <span
            className="text-[0.65rem] rounded-full border px-2 py-0.5"
            style={{
              color: "var(--kratos-text-secondary)",
              borderColor: "var(--kratos-warn)",
              background: "color-mix(in oklab, var(--kratos-warn) 8%, transparent)",
            }}
          >
            Serviços degradados
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <StatusCard accent={isOnFocus ? "on_focus" : "off_focus"}>
          <StatBlock
            label="Foco"
            value={isOnFocus ? "ON" : "OFF"}
            sub={
              d.contexto
                ? isOnFocus
                  ? `${d.contexto.project} · Mantenha o ritmo`
                  : `${d.contexto.project} · Volte para a próxima ação`
                : "Sem dados de contexto"
            }
            color={isOnFocus ? "var(--kratos-ok)" : "var(--kratos-critical)"}
          />
        </StatusCard>
      </div>

      {/* Alert bar */}
      {hasAlerts && (
        <div className="mt-4">
          <StatusCard accent="off_focus" className="kratos-critical-signal" interactive>
            <button
              type="button"
              onClick={() => navigate({ to: "/agenda" })}
              className="kratos-focus-ring flex w-full items-center gap-3 rounded-md text-left"
              aria-label={`Abrir agenda com ${d.appointments.overdue} compromisso${d.appointments.overdue > 1 ? "s" : ""} atrasado${d.appointments.overdue > 1 ? "s" : ""}`}
            >
              <AlertTriangle
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--kratos-critical)" }}
              />
              <span
                className="text-[13px] font-medium"
                style={{ color: "var(--kratos-text-primary)" }}
              >
                {d.appointments.overdue} compromisso
                {d.appointments.overdue > 1 ? "s" : ""} atrasado
                {d.appointments.overdue > 1 ? "s" : ""}
              </span>
              <span className="text-[11px] ml-auto" style={{ color: "var(--kratos-critical)" }}>
                Ir para Agenda →
              </span>
            </button>
          </StatusCard>
        </div>
      )}

      {/* Quick navigation */}
      <div className="mt-6">
        <div className="kratos-eyebrow mb-3">— Acesso rápido —</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickLink icon={Crosshair} label="Agora" to="/agora" accent="var(--kratos-accent)" />
          <QuickLink icon={CalendarClock} label="Agenda" to="/agenda" accent="var(--kratos-info)" />
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

      {/* GitHub tracked repos */}
      {reposLoading && (
        <div className="mt-8">
          <div className="kratos-eyebrow mb-3">— GitHub · Repositórios monitorados —</div>
          <LoadingState lines={3} compact />
        </div>
      )}
      {trackedRepos && trackedRepos.length > 0 && (
        <div className="mt-8">
          <div className="kratos-eyebrow mb-3">— GitHub · Repositórios monitorados —</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {trackedRepos.map((name) => (
              <TrackedRepoCard key={name} owner={DEFAULT_OWNER} repo={name} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
