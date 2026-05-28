import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { ProjectCard } from "@/components/kratos/projects/ProjectCard";
import { ProjectFilterBar } from "@/components/kratos/projects/ProjectFilterBar";
import { useProjects, useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import type { Project, ProjectStatus } from "../../../../api-contract/project.schema";

type FilterValue = ProjectStatus | "all";

export function ProjetosView() {
  const { data: projects, isLoading, isError, error, refetch } = useProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const [filter, setFilter] = useState<FilterValue>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8 space-y-10">
        <SectionHeader
          eyebrow="Projetos"
          title="Projetos conhecidos"
          description="Carregando projetos..."
        />
        <LoadingState lines={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8 space-y-10">
        <SectionHeader
          eyebrow="Projetos"
          title="Projetos conhecidos"
          description="Algo falhou ao carregar."
        />
        <ErrorState
          title="Não foi possível carregar os projetos"
          description={error?.message ?? "Erro ao buscar projetos."}
          hint="Verifique a conexão e tente novamente."
        />
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[11px] kratos-mono uppercase tracking-[0.15em] kratos-focus-ring"
          style={{
            background: "var(--kratos-surface-3)",
            border: "1px solid var(--kratos-border)",
            color: "var(--kratos-text-primary)",
          }}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const items = projects ?? [];
  const filtered = filter === "all" ? items : items.filter((p) => p.status === filter);

  const counts: Record<FilterValue, number> = {
    all: items.length,
    active: items.filter((p) => p.status === "active").length,
    paused: items.filter((p) => p.status === "paused").length,
    completed: items.filter((p) => p.status === "completed").length,
    archived: items.filter((p) => p.status === "archived").length,
  };

  const activeCount = counts.active;
  const pausedCount = counts.paused;

  function handleCreate() {
    if (!newName.trim()) return;
    createMutation.mutate(
      { nome: newName.trim(), prioridade: 3 },
      {
        onSuccess: () => {
          setNewName("");
          setShowCreate(false);
        },
      }
    );
  }

  function handleToggleStatus(id: string) {
    const project = items.find((p) => p.id === id);
    if (!project) return;
    setPendingId(id);
    const nextStatus: ProjectStatus = project.status === "active" ? "paused" : "active";
    updateMutation.mutate(
      { id, input: { status: nextStatus } },
      { onSettled: () => setPendingId(null) }
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8 space-y-10">
      <SectionHeader
        eyebrow="Projetos"
        title="Projetos conhecidos"
        description={`${activeCount} ativo${activeCount !== 1 ? "s" : ""}${pausedCount > 0 ? ` · ${pausedCount} pausado${pausedCount !== 1 ? "s" : ""}` : ""}`}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProjectFilterBar active={filter} onChange={setFilter} counts={counts} />
        <button
          type="button"
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] kratos-mono uppercase tracking-[0.12em] kratos-focus-ring transition-colors"
          style={{
            background: showCreate ? "var(--kratos-surface-3)" : "var(--kratos-accent)",
            border: "1px solid var(--kratos-border-live)",
            color: showCreate ? "var(--kratos-text-primary)" : "var(--kratos-surface-0)",
          }}
          disabled={createMutation.isPending}
        >
          <Plus className="h-3 w-3" />
          Novo
        </button>
      </div>

      {showCreate && (
        <div
          className="flex items-center gap-2 rounded-md p-3"
          style={{
            background: "var(--kratos-surface-2)",
            border: "1px solid var(--kratos-border-live)",
          }}
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setShowCreate(false);
            }}
            placeholder="Nome do projeto..."
            autoFocus
            className="flex-1 bg-transparent text-[13px] outline-none"
            style={{ color: "var(--kratos-text-primary)" }}
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={!newName.trim() || createMutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium kratos-focus-ring disabled:opacity-40"
            style={{
              background: "var(--kratos-accent)",
              color: "var(--kratos-surface-0)",
            }}
          >
            {createMutation.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Plus className="h-3 w-3" />
            )}
            Criar
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(false)}
            className="text-[11px] kratos-mono"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            ESC
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="Sem projetos"
          description="Crie o primeiro projeto para começar."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum projeto neste filtro"
          description={`Nenhum projeto com status "${filter}".`}
          compact
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onToggleStatus={handleToggleStatus}
              isPending={pendingId === project.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
