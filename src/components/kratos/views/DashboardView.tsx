import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { GithubRepoCard } from "@/components/kratos/sistema/GithubRepoCard";
import { SourceBadgeIndicator } from "@/components/kratos/base/SourceBadgeIndicator";
import { ProgressRing } from "@/components/kratos/base/ProgressRing";
import { NextActionBlock } from "@/components/kratos/shell/NextActionBlock";
import { IslandCard } from "@/components/kratos/shell/IslandCard";
import type {
  SystemIslandData,
  DockerIslandData,
  GitIslandData,
  TasksIslandData,
  ContextIslandData,
  AlertsIslandData,
} from "@/components/kratos/shell/IslandCard";
import { DriftIndicator } from "@/components/kratos/shell/DriftIndicator";
import { CheckpointResume } from "@/components/kratos/checkpoints/CheckpointResume";
import {
  useDashboard,
  useDashboardSnapshot,
  type DashboardLoaderData,
} from "@/hooks/useDashboard";
import { useTrackedRepos, useGithubRepo, useGithubConfig } from "@/hooks/useGithub";
import { useMissionLens } from "@/hooks/useMissionLens";
import { useDriftDetection } from "@/hooks/useDriftDetection";
import { usePausedCheckpoints, useResumeCheckpoint } from "@/hooks/useCheckpoints";

const DEFAULT_OWNER = "lucastigrereal-dev";

// --- Mock data para os 6 IslandCards ---
const MOCK_SYSTEM_DATA: SystemIslandData = {
  cpuPercent: 34,
  ramPercent: 62,
  health: "healthy",
};

const MOCK_DOCKER_DATA: DockerIslandData = {
  containers: [
    { name: "kratos-dev", status: "running" },
    { name: "akasha-db", status: "running" },
    { name: "omnis-api", status: "stopped" },
  ],
  runningCount: 2,
  totalCount: 3,
};

const MOCK_GIT_DATA: GitIslandData = {
  branch: "main",
  dirty: true,
  ahead: 2,
  behind: 0,
};

const MOCK_TASKS_DATA: TasksIslandData = {
  urgent: [
    { id: "1", title: "Fase 2.5 - AuroraPanel", overdue: false },
    { id: "2", title: "Bug: login redirect quebrado", overdue: true },
  ],
  totalCount: 5,
};

const MOCK_CONTEXT_DATA: ContextIslandData = {
  activeApp: "VS Code",
  project: "KRATOS Mission Control",
  minutesInSession: 47,
};

const MOCK_ALERTS_DATA: AlertsIslandData = {
  alerts: [
    { id: "a1", message: "Container omnis-api parado", severity: "high" },
  ],
};

// --- Layout helpers para os ProgressRings ---
interface RingStatProps {
  value: number;
  color: string;
  title: string;
  sub: string;
}

function RingStat({ value, color, title, sub }: RingStatProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ProgressRing
        value={value}
        size={42}
        strokeWidth={3.5}
        color={color}
        trackColor="var(--kratos-surface-3)"
      />
      <span
        className="text-[10px] font-medium leading-none"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {title}
      </span>
      <span
        className="text-[9px] leading-none kratos-mono"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        {sub}
      </span>
    </div>
  );
}

export function DashboardView({
  ssrData,
}: {
  ssrData?: DashboardLoaderData;
}) {
  const navigate = useNavigate();
  const d = useDashboard();
  const snap = useDashboardSnapshot();
  const ghConfig = useGithubConfig();
  const { data: trackedRepos, isLoading: reposLoading } = useTrackedRepos();

  // Novos hooks
  const { lens, sourceType: lensSourceType } = useMissionLens();
  const drift = useDriftDetection();
  const { data: pausedCheckpoints, isLoading: checkpointsLoading } = usePausedCheckpoints();
  const resumeCheckpoint = useResumeCheckpoint();

  // --- Loading (only full loading state when no SSR data available) ---
  if (d.isLoading && !ssrData) {
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

  // --- Error ---
  if (d.isError) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
        <SectionHeader
          eyebrow="Mission Control"
          title="KRATOS"
          description="Erro ao carregar dados do dashboard."
        />
        <ErrorState
          title="Dashboard indisponível"
          description={
            d.error instanceof Error
              ? d.error.message
              : "Não foi possível carregar os dados do dashboard. Verifique sua conexão."
          }
        />
      </div>
    );
  }

  // Resolve: prefer live hook data, fall back to SSR data while loading
  const projects = d.isLoading && ssrData ? ssrData.projects : d.projects;
  const checkpoints = d.isLoading && ssrData ? ssrData.checkpoints : d.checkpoints;
  const appointments = d.isLoading && ssrData ? ssrData.appointments : d.appointments;
  const contexto = d.isLoading && ssrData ? ssrData.contexto : d.contexto;

  // --- Normal: Cockpit Layout ---
  const hasAlerts = appointments.overdue > 0;
  const isOnFocus = contexto?.focusStatus === "on_focus";

  const projetosValue =
    projects.total > 0 ? Math.round((projects.active / projects.total) * 100) : 0;
  const checkpointsValue =
    checkpoints.total > 0
      ? Math.round(((checkpoints.inProgress + checkpoints.pending) / checkpoints.total) * 100)
      : 0;
  const agendaValue =
    appointments.total > 0
      ? Math.round((appointments.today / appointments.total) * 100)
      : 0;
  const focoValue = isOnFocus ? 100 : 0;
  const focoColor = isOnFocus ? "var(--kratos-ok)" : "var(--kratos-critical)";

  const topPausedCheckpoint = pausedCheckpoints?.[0] ?? null;
  const checkpointResumeData = topPausedCheckpoint
    ? {
        id: topPausedCheckpoint.id,
        titulo: topPausedCheckpoint.titulo,
        descricao: topPausedCheckpoint.descricao,
        progresso: topPausedCheckpoint.progresso,
        atualizadoEm: topPausedCheckpoint.atualizadoEm,
      }
    : null;

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      {/* DriftIndicator — somente quando deriva detectada */}
      <div className="mb-2">
        <DriftIndicator
          driftState={drift.driftState}
          minutesOff={drift.minutesOff}
          nudgeMessage={drift.nudgeMessage}
          originalMission={drift.originalMission}
          onResume={() => {
            // Retomar missão: volta para o foco
          }}
        />
      </div>

      {/* SectionHeader */}
      <SectionHeader
        eyebrow="Mission Control"
        title="KRATOS"
        description="Visão consolidada de projetos, checkpoints, agenda e contexto."
      />

      {/* Meta badges */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
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

      {/* Row 1: NextActionBlock + ProgressRings */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        {/* NextActionBlock — col-span-9 */}
        <div className="col-span-12 lg:col-span-9">
          <NextActionBlock
            action={lens?.next_best_action}
            sourceType={lensSourceType}
            onStart={() => {
              // Iniciar próxima ação
            }}
          />
        </div>

        {/* ProgressRings — col-span-3, grid 2x2 */}
        <div className="col-span-12 lg:col-span-3">
          <div
            className="rounded-xl p-4 grid grid-cols-2 gap-3 h-full"
            style={{
              background: "var(--kratos-surface-2)",
              border: "1px solid var(--kratos-border)",
            }}
          >
            <RingStat
              value={projetosValue}
              color="var(--kratos-ok)"
              title="Projetos"
              sub={`${projects.active}/${projects.total}`}
            />
            <RingStat
              value={checkpointsValue}
              color="var(--kratos-accent)"
              title="Checkpoints"
              sub={`${checkpoints.inProgress + checkpoints.pending}/${checkpoints.total}`}
            />
            <RingStat
              value={agendaValue}
              color="var(--kratos-info)"
              title="Agenda"
              sub={`${appointments.today} hoje`}
            />
            <RingStat
              value={focoValue}
              color={focoColor}
              title="Foco"
              sub={isOnFocus ? "ON" : "OFF"}
            />
          </div>
        </div>
      </div>

      {/* Row 2: 6 IslandCards em grid 6-col (compact mode) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <IslandCard
          domain="system"
          data={MOCK_SYSTEM_DATA}
          sourceType="mock"
          compact
        />
        <IslandCard
          domain="docker"
          data={MOCK_DOCKER_DATA}
          sourceType="mock"
          compact
        />
        <IslandCard
          domain="git"
          data={MOCK_GIT_DATA}
          sourceType="mock"
          compact
        />
        <IslandCard
          domain="tasks"
          data={MOCK_TASKS_DATA}
          sourceType="mock"
          compact
        />
        <IslandCard
          domain="context"
          data={MOCK_CONTEXT_DATA}
          sourceType="mock"
          compact
        />
        <IslandCard
          domain="alerts"
          data={MOCK_ALERTS_DATA}
          sourceType="mock"
          compact
        />
      </div>

      {/* Row 3: CheckpointResume + Alert bar + Quick nav */}
      <div className="grid grid-cols-12 gap-4 mb-8">
        {/* CheckpointResume — col-span-9 */}
        <div className="col-span-12 lg:col-span-9">
          <CheckpointResume
            checkpoint={checkpointResumeData}
            isLoading={checkpointsLoading}
            onResume={(id) => resumeCheckpoint.mutate(id)}
          />
        </div>

        {/* Right column: Alert bar + Quick nav — col-span-3 */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
          {/* Alert bar */}
          {hasAlerts && (
            <StatusCard accent="off_focus" className="kratos-critical-signal" interactive>
              <button
                type="button"
                onClick={() => navigate({ to: "/agenda" })}
                className="kratos-focus-ring flex w-full items-center gap-3 rounded-md text-left"
                aria-label={`Abrir agenda com ${appointments.overdue} compromisso${appointments.overdue > 1 ? "s" : ""} atrasado${appointments.overdue > 1 ? "s" : ""}`}
              >
                <AlertTriangle
                  className="h-4 w-4 shrink-0"
                  style={{ color: "var(--kratos-critical)" }}
                />
                <span
                  className="text-[13px] font-medium"
                  style={{ color: "var(--kratos-text-primary)" }}
                >
                  {appointments.overdue} compromisso
                  {appointments.overdue > 1 ? "s" : ""} atrasado
                  {appointments.overdue > 1 ? "s" : ""}
                </span>
              </button>
            </StatusCard>
          )}

          {/* Quick nav links */}
          <div
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{
              background: "var(--kratos-surface-2)",
              border: "1px solid var(--kratos-border)",
            }}
          >
            <div className="kratos-eyebrow mb-1">Acesso rápido</div>
            <button
              type="button"
              onClick={() => navigate({ to: "/agora" })}
              className="kratos-focus-ring flex items-center justify-between w-full rounded-md px-3 py-2 text-left text-[13px] font-medium"
              style={{
                color: "var(--kratos-text-primary)",
                background: "var(--kratos-surface-3)",
              }}
            >
              Agora
              <span style={{ color: "var(--kratos-accent)" }}>&rarr;</span>
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/agenda" })}
              className="kratos-focus-ring flex items-center justify-between w-full rounded-md px-3 py-2 text-left text-[13px] font-medium"
              style={{
                color: "var(--kratos-text-primary)",
                background: "var(--kratos-surface-3)",
              }}
            >
              Agenda
              <span style={{ color: "var(--kratos-info)" }}>&rarr;</span>
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/checkpoints" })}
              className="kratos-focus-ring flex items-center justify-between w-full rounded-md px-3 py-2 text-left text-[13px] font-medium"
              style={{
                color: "var(--kratos-text-primary)",
                background: "var(--kratos-surface-3)",
              }}
            >
              Checkpoints
              <span style={{ color: "var(--kratos-ok)" }}>&rarr;</span>
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/projetos" })}
              className="kratos-focus-ring flex items-center justify-between w-full rounded-md px-3 py-2 text-left text-[13px] font-medium"
              style={{
                color: "var(--kratos-text-primary)",
                background: "var(--kratos-surface-3)",
              }}
            >
              Projetos
              <span style={{ color: "var(--kratos-accent)" }}>&rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: GitHub tracked repos */}
      {reposLoading && (
        <div>
          <div className="kratos-eyebrow mb-3">GitHub · Repositórios monitorados</div>
          <LoadingState lines={3} compact />
        </div>
      )}
      {trackedRepos && trackedRepos.length > 0 && (
        <div>
          <div className="kratos-eyebrow mb-3">GitHub · Repositórios monitorados</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {trackedRepos.map((name) => (
              <GithubRepoWrapper key={name} owner={DEFAULT_OWNER} repo={name} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Componente wrapper para repos do GitHub (inline da antiga TrackedRepoCard) ---
function GithubRepoWrapper({ owner, repo }: { owner: string; repo: string }) {
  const { data, isLoading, isError, error } = useGithubRepo(owner, repo);

  if (isLoading) return <LoadingState lines={3} compact />;
  if (isError)
    return (
      <ErrorState title={repo} description={error?.message ?? "Erro ao buscar repositório."} />
    );
  if (!data) return <div className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>Sem dados de {repo}</div>;
  return <GithubRepoCard repo={data} />;
}
