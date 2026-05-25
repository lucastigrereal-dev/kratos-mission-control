import {
  Telescope,
  Layers,
  ExternalLink,
  Clock,
  CheckCircle2,
  PauseCircle,
  Archive,
  Circle,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { useProjects } from "@/hooks/useProjects";
import type { Project, ProjectStatus } from "../../../../api-contract/project.schema";

const accent = "var(--kr-island-observatorio)";

// ── Helpers ────────────────────────────────────────────────────────────────

function statusIcon(status: ProjectStatus) {
  if (status === "active") return CheckCircle2;
  if (status === "paused") return PauseCircle;
  if (status === "completed") return CheckCircle2;
  return Archive;
}

function statusColor(status: ProjectStatus): string {
  if (status === "active") return "var(--kr-success)";
  if (status === "paused") return "var(--kr-warning)";
  if (status === "completed") return "var(--kr-accent-cyan)";
  return "var(--kratos-text-muted)";
}

function statusLabel(status: ProjectStatus): string {
  if (status === "active") return "Ativo";
  if (status === "paused") return "Pausado";
  if (status === "completed") return "Concluído";
  return "Arquivado";
}

function relativeTime(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "hoje";
    if (days === 1) return "ontem";
    return `${days}d atrás`;
  } catch {
    return "—";
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const Icon = statusIcon(project.status);
  const color = statusColor(project.status);

  return (
    <GlassPanel padding="sm" className="!p-3">
      <div className="flex items-start gap-3">
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}
        >
          <Icon className="h-4 w-4" style={{ color }} aria-hidden />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[13px] font-semibold truncate" style={{ color: "var(--kratos-text-primary)" }}>
              {project.nome}
            </p>
            <span
              className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded flex-shrink-0"
              style={{
                background: `color-mix(in srgb, ${color} 12%, transparent)`,
                color,
              }}
            >
              {statusLabel(project.status)}
            </span>
          </div>

          {project.descricao && (
            <p className="text-[11px] line-clamp-2 mb-2" style={{ color: "var(--kratos-text-secondary)" }}>
              {project.descricao}
            </p>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
              <span className="text-[10px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
                {relativeTime(project.ultimaAtividade)}
              </span>
            </div>
            {project.repo && (
              <div className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
                <span className="text-[10px] kratos-mono truncate max-w-[120px]" style={{ color: "var(--kratos-text-muted)" }}>
                  {project.repo.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              </div>
            )}
            <span
              className="text-[10px] kratos-mono ml-auto"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              P{project.prioridade}
            </span>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────

export function ObservatorioScreen() {
  const { data: projects, isLoading, isError, error } = useProjects();

  const activeProjects = projects?.filter((p) => p.status === "active") ?? [];
  const otherProjects = projects?.filter((p) => p.status !== "active") ?? [];

  return (
    <IslandPageFrame theme="observatorio">
      {isLoading ? (
        <LoadingState lines={6} />
      ) : isError ? (
        <ErrorState
          title="Erro ao carregar projetos"
          description={error?.message ?? "Não foi possível conectar ao backend"}
          variant="external_unavailable"
        />
      ) : (
        <div className="space-y-5">
          <IslandPageHeader
            title="OBSERVATÓRIO"
            subtitle="Projetos, Visão e Estratégia"
            theme="observatorio"
          />

          {/* Active projects */}
          <KratosCard
            header={
              <SectionTitle
                icon={Telescope}
                title={`Projetos Ativos${activeProjects.length > 0 ? ` (${activeProjects.length})` : ""}`}
              />
            }
          >
            {activeProjects.length === 0 ? (
              <EmptyState
                compact
                icon={<Circle className="h-4 w-4" />}
                title="Nenhum projeto ativo"
                description="Crie um projeto em /projetos para acompanhar aqui."
              />
            ) : (
              <div className="space-y-2">
                {activeProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </KratosCard>

          {/* Other projects */}
          {otherProjects.length > 0 && (
            <KratosCard header={<SectionTitle icon={Layers} title="Outros Projetos" />}>
              <div className="space-y-2">
                {otherProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </KratosCard>
          )}

          {(!projects || projects.length === 0) && (
            <EmptyState
              title="Nenhum projeto encontrado"
              description="Adicione projetos em /projetos para visualizá-los aqui."
            />
          )}
        </div>
      )}
    </IslandPageFrame>
  );
}
