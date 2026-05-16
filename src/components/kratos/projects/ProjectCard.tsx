import { FolderGit2, Star, Pause, Play, Archive } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import type { Project, ProjectStatus } from "../../../../api-contract/project.schema";

const STATUS_META: Record<ProjectStatus, { label: string; color: string; icon: typeof Star }> = {
  active: { label: "ATIVO", color: "var(--kratos-ok)", icon: Play },
  paused: { label: "PAUSADO", color: "var(--kratos-warn)", icon: Pause },
  completed: { label: "CONCLUÍDO", color: "var(--kratos-info)", icon: Archive },
  archived: { label: "ARQUIVADO", color: "var(--kratos-text-muted)", icon: Archive },
};

const PRIORITY_COLORS: Record<number, string> = {
  5: "var(--kratos-critical)",
  4: "var(--kratos-warn)",
  3: "var(--kratos-info)",
  2: "var(--kratos-text-muted)",
  1: "var(--kratos-text-muted)",
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return `${Math.floor(days / 30)}m`;
}

interface Props {
  project: Project;
  onToggleStatus?: (id: string) => void;
  isPending?: boolean;
}

export function ProjectCard({ project, onToggleStatus, isPending = false }: Props) {
  const meta = STATUS_META[project.status];

  return (
    <StatusCard className="h-full flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <FolderGit2
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: "var(--kratos-text-muted)" }}
          />
          <span
            className="text-[14px] font-semibold leading-snug truncate"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            {project.nome}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {[...Array(project.prioridade)].map((_, i) => (
            <Star
              key={i}
              className="h-2.5 w-2.5"
              style={{ color: PRIORITY_COLORS[project.prioridade], fill: PRIORITY_COLORS[project.prioridade] }}
            />
          ))}
        </div>
      </div>

      {project.descricao && (
        <p
          className="text-[11px] leading-relaxed mb-3 line-clamp-2"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          {project.descricao}
        </p>
      )}

      <div className="mt-auto pt-3 flex items-center justify-between">
        <span
          className="kratos-chip text-[10px]"
          style={{ color: meta.color, borderColor: "var(--kratos-border)" }}
        >
          {meta.label}
        </span>

        <div className="flex items-center gap-2">
          {project.repo && (
            <span
              className="text-[10px] kratos-mono"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              {project.repo}
            </span>
          )}
          <span
            className="text-[10px] kratos-mono"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            {relativeTime(project.ultimaAtividade)}
          </span>
        </div>
      </div>

      {onToggleStatus && (
        <button
          type="button"
          onClick={() => onToggleStatus(project.id)}
          disabled={isPending}
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] kratos-mono uppercase tracking-[0.12em] kratos-focus-ring disabled:opacity-50"
          style={{
            background: "var(--kratos-surface-3)",
            border: "1px solid var(--kratos-border)",
            color: "var(--kratos-text-secondary)",
          }}
        >
          {project.status === "active" ? "Pausar" : "Ativar"}
        </button>
      )}
    </StatusCard>
  );
}
