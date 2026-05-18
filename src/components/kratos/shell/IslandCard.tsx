import { Component, type ReactNode } from "react";
import { Cpu, Container, GitBranch, CheckSquare, MapPin, AlertTriangle } from "lucide-react";
import { SourceBadgeIndicator } from "@/components/kratos/base/SourceBadgeIndicator";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import type { DataSource } from "../../../api-contract/source-badge.schema";

// --- ErrorBoundary por island ---
interface BoundaryState {
  hasError: boolean;
}
class IslandErrorBoundary extends Component<
  { children: ReactNode; domain: string },
  BoundaryState
> {
  state: BoundaryState = { hasError: false };
  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <ErrorState title={`${this.props.domain} indisponível`} variant="external_unavailable" />
      );
    }
    return this.props.children;
  }
}

// --- Tipos dos dados por domínio ---
export type IslandDomain = "system" | "docker" | "git" | "tasks" | "context" | "alerts";

export interface SystemIslandData {
  cpuPercent: number;
  ramPercent: number;
  health: "healthy" | "degraded" | "critical";
}

export interface DockerIslandData {
  containers: Array<{ name: string; status: "running" | "stopped" | "error" }>;
  runningCount: number;
  totalCount: number;
}

export interface GitIslandData {
  branch: string;
  dirty: boolean;
  ahead: number;
  behind: number;
}

export interface TasksIslandData {
  urgent: Array<{ id: string; title: string; overdue?: boolean }>;
  totalCount: number;
}

export interface ContextIslandData {
  activeApp: string;
  project: string;
  minutesInSession: number;
}

export interface AlertsIslandData {
  alerts: Array<{ id: string; message: string; severity: "critical" | "high" | "medium" }>;
}

export type IslandData =
  | { domain: "system"; data: SystemIslandData | null }
  | { domain: "docker"; data: DockerIslandData | null }
  | { domain: "git"; data: GitIslandData | null }
  | { domain: "tasks"; data: TasksIslandData | null }
  | { domain: "context"; data: ContextIslandData | null }
  | { domain: "alerts"; data: AlertsIslandData | null };

interface IslandCardProps {
  domain: IslandDomain;
  data: IslandData["data"];
  sourceType: DataSource;
  isLoading?: boolean;
  compact?: boolean;
}

// --- Helpers visuais ---
const DOMAIN_META: Record<IslandDomain, { label: string; icon: typeof Cpu; question: string }> = {
  system: { label: "Sistema", icon: Cpu, question: "CPU & RAM" },
  docker: { label: "Docker", icon: Container, question: "Containers" },
  git: { label: "Git", icon: GitBranch, question: "Branch atual" },
  tasks: { label: "Tarefas", icon: CheckSquare, question: "O que está urgente?" },
  context: { label: "Contexto", icon: MapPin, question: "Onde você está?" },
  alerts: { label: "Alertas", icon: AlertTriangle, question: "O que está em risco?" },
};

function HealthBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--kratos-surface-3)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span
        className="text-[10px] kratos-mono w-8 text-right"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        {value}%
      </span>
    </div>
  );
}

function StatusDotInline({ ok }: { ok: boolean }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
      style={{ background: ok ? "var(--kratos-ok)" : "var(--kratos-critical)" }}
    />
  );
}

// --- Conteúdo por domínio ---
function SystemContent({ data }: { data: SystemIslandData }) {
  const cpuColor =
    data.cpuPercent > 85
      ? "var(--kratos-critical)"
      : data.cpuPercent > 70
        ? "var(--kratos-warn)"
        : "var(--kratos-ok)";
  const ramColor =
    data.ramPercent > 90
      ? "var(--kratos-critical)"
      : data.ramPercent > 80
        ? "var(--kratos-warn)"
        : "var(--kratos-ok)";
  return (
    <div className="space-y-2">
      <div
        className="flex justify-between text-[11px]"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        <span>CPU</span>
        <span>RAM</span>
      </div>
      <HealthBar value={data.cpuPercent} color={cpuColor} />
      <HealthBar value={data.ramPercent} color={ramColor} />
    </div>
  );
}

function DockerContent({ data }: { data: DockerIslandData }) {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
        {data.runningCount}/{data.totalCount} rodando
      </div>
      {data.containers.slice(0, 4).map((c) => (
        <div key={c.name} className="flex items-center gap-2">
          <StatusDotInline ok={c.status === "running"} />
          <span
            className="text-[11px] truncate kratos-mono"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            {c.name}
          </span>
        </div>
      ))}
    </div>
  );
}

function GitContent({ data }: { data: GitIslandData }) {
  return (
    <div className="space-y-2">
      <div
        className="text-[12px] font-medium kratos-mono truncate"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {data.branch}
      </div>
      <div
        className="flex items-center gap-3 text-[11px]"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        <span style={{ color: data.dirty ? "var(--kratos-warn)" : "var(--kratos-ok)" }}>
          {data.dirty ? "● modificado" : "● limpo"}
        </span>
        {(data.ahead > 0 || data.behind > 0) && (
          <span>
            ↑{data.ahead} ↓{data.behind}
          </span>
        )}
      </div>
    </div>
  );
}

function TasksContent({ data }: { data: TasksIslandData }) {
  if (data.urgent.length === 0) {
    return <EmptyState title="Sem urgências" description="Tudo em dia." />;
  }
  return (
    <div className="space-y-1.5">
      {data.urgent.slice(0, 3).map((t) => (
        <div key={t.id} className="flex items-start gap-2">
          <StatusDotInline ok={!t.overdue} />
          <span
            className="text-[11px] leading-snug"
            style={{ color: t.overdue ? "var(--kratos-critical)" : "var(--kratos-text-secondary)" }}
          >
            {t.title}
          </span>
        </div>
      ))}
      {data.totalCount > 3 && (
        <div className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
          +{data.totalCount - 3} mais
        </div>
      )}
    </div>
  );
}

function ContextContent({ data }: { data: ContextIslandData }) {
  return (
    <div className="space-y-1.5">
      <div
        className="text-[12px] font-medium truncate"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {data.project}
      </div>
      <div className="text-[11px] truncate" style={{ color: "var(--kratos-text-secondary)" }}>
        {data.activeApp}
      </div>
      <div className="text-[10px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
        {data.minutesInSession}min nesta sessão
      </div>
    </div>
  );
}

function AlertsContent({ data }: { data: AlertsIslandData }) {
  const sorted = [...data.alerts].sort((a, b) => {
    const order: Record<string, number> = { critical: 0, high: 1, medium: 2 };
    return order[a.severity] - order[b.severity];
  });
  if (sorted.length === 0) {
    return <EmptyState title="Sem alertas" description="Sistema estável." />;
  }
  return (
    <div className="space-y-1.5">
      {sorted.slice(0, 3).map((a) => {
        const color =
          a.severity === "critical"
            ? "var(--kratos-critical)"
            : a.severity === "high"
              ? "var(--kratos-warn)"
              : "var(--kratos-info)";
        return (
          <div key={a.id} className="flex items-start gap-2">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full shrink-0 mt-1"
              style={{ background: color }}
            />
            <span
              className="text-[11px] leading-snug"
              style={{ color: "var(--kratos-text-secondary)" }}
            >
              {a.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// --- Componente principal ---
export function IslandCard({
  domain,
  data,
  sourceType,
  isLoading = false,
  compact = false,
}: IslandCardProps) {
  const meta = DOMAIN_META[domain];
  const Icon = meta.icon;

  const sourceMeta = {
    source: sourceType,
    stale: sourceType === "stale",
    updated_at: new Date().toISOString(),
    errors: sourceType === "error" ? ["Falha ao carregar"] : [],
  };

  function renderContent() {
    if (isLoading) return <LoadingState lines={3} compact />;
    if (sourceType === "error" || !data) {
      return (
        <ErrorState description={`${meta.label} indisponível`} variant="external_unavailable" />
      );
    }
    switch (domain) {
      case "system":
        return <SystemContent data={data as SystemIslandData} />;
      case "docker":
        return <DockerContent data={data as DockerIslandData} />;
      case "git":
        return <GitContent data={data as GitIslandData} />;
      case "tasks":
        return <TasksContent data={data as TasksIslandData} />;
      case "context":
        return <ContextContent data={data as ContextIslandData} />;
      case "alerts":
        return <AlertsContent data={data as AlertsIslandData} />;
    }
  }

  return (
    <IslandErrorBoundary domain={meta.label}>
      <div
        className={`rounded-xl flex flex-col gap-3 ${compact ? "p-3" : "p-4"}`}
        style={{
          background: "var(--kratos-surface-2)",
          border: "1px solid var(--kratos-border)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: "var(--kratos-text-muted)" }}
              aria-hidden
            />
            <span
              className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              {meta.question}
            </span>
          </div>
          <SourceBadgeIndicator meta={sourceMeta} size="sm" />
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </IslandErrorBoundary>
  );
}
