import { useState } from "react";
import { Plus, Bookmark } from "lucide-react";
import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ResumeFromHereCard } from "@/components/kratos/checkpoints/ResumeFromHereCard";
import { CheckpointSummaryCard } from "@/components/kratos/checkpoints/CheckpointSummaryCard";
import { CheckpointFilterBar } from "@/components/kratos/checkpoints/CheckpointFilterBar";
import { CheckpointTimeline } from "@/components/kratos/checkpoints/CheckpointTimeline";
import type { CheckpointItem } from "@/components/kratos/checkpoints/CheckpointItemCard";
import type { CheckpointStatus } from "@/../api-contract/checkpoint.schema";
import {
  useCheckpoints,
  useCreateCheckpoint,
  useUpdateCheckpoint,
  useDeleteCheckpoint,
} from "@/hooks/useCheckpoints";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

function mapToItem(
  checkpoint: import("@/../api-contract/checkpoint.schema").Checkpoint,
): CheckpointItem {
  const age =
    Date.now() - new Date(checkpoint.criadoEm).getTime() < 6 * 3600000
      ? "recente"
      : "antigo";

  return {
    id: checkpoint.id,
    time: relativeTime(checkpoint.atualizadoEm),
    project: checkpoint.projetoId ?? "KRATOS",
    summary: checkpoint.titulo,
    nextAction: checkpoint.descricao ?? "—",
    tags: [
      `${checkpoint.progresso}%`,
      statusLabel(checkpoint.status),
    ],
    type: "manual",
    age,
  };
}

function statusLabel(status: CheckpointStatus): string {
  const labels: Record<CheckpointStatus, string> = {
    pending: "PENDENTE",
    in_progress: "EM PROGRESSO",
    completed: "CONCLUÍDO",
    blocked: "BLOQUEADO",
    cancelled: "CANCELADO",
  };
  return labels[status];
}

type FilterValue = CheckpointStatus | "all";

export function CheckpointsView() {
  const { data: checkpoints = [], isLoading, isError, error, refetch } = useCheckpoints();
  const createMutation = useCreateCheckpoint();
  const updateMutation = useUpdateCheckpoint();
  const deleteMutation = useDeleteCheckpoint();

  const [showCreate, setShowCreate] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const resumeCheckpoint = checkpoints.find((c) => c.status === "in_progress");
  const filtered = checkpoints.filter(
    (c) => filter === "all" || c.status === filter,
  );
  const timelineItems = filtered.map(mapToItem);

  const todayCount = checkpoints.filter(
    (c) => new Date(c.criadoEm).toDateString() === new Date().toDateString(),
  ).length;

  const handleCreate = () => {
    if (!titulo.trim()) return;
    setPendingId("__create__");
    createMutation.mutate(
      { titulo: titulo.trim(), descricao: descricao.trim() || undefined },
      {
        onSuccess: () => {
          setTitulo("");
          setDescricao("");
          setShowCreate(false);
          setPendingId(null);
        },
        onError: () => setPendingId(null),
      },
    );
  };

  const handleResume = (id: string) => {
    setPendingId(id);
    updateMutation.mutate(
      { id, input: { status: "in_progress" } },
      {
        onSuccess: () => setPendingId(null),
        onError: () => setPendingId(null),
      },
    );
  };

  const handleDelete = (id: string) => {
    setPendingId(id);
    deleteMutation.mutate(id, {
      onSuccess: () => setPendingId(null),
      onError: () => setPendingId(null),
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
        <SectionHeader
          eyebrow="Checkpoints"
          title="Seu save game mental para retomar sem se perder."
          description="Não reconstrua do zero. Retome."
        />
        <LoadingState />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
        <SectionHeader
          eyebrow="Checkpoints"
          title="Seu save game mental para retomar sem se perder."
          description="Não reconstrua do zero. Retome."
        />
        <ErrorState
          message={error?.message ?? "Erro ao carregar checkpoints"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      <SectionHeader
        eyebrow="Checkpoints"
        title="Seu save game mental para retomar sem se perder."
        description="Não reconstrua do zero. Retome."
      />

      {/* Primary action */}
      <div className="mb-4">
        {!showCreate ? (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-medium kratos-focus-ring kratos-card-hover"
            style={{
              background: "var(--kratos-surface-3)",
              border: "1px solid var(--kratos-border-live)",
              color: "var(--kratos-text-primary)",
            }}
          >
            <Plus className="h-4 w-4" />
            Salvar checkpoint agora
          </button>
        ) : (
          <StatusCard accent="ghost" className="mb-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
              className="space-y-3"
            >
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="O que você está fazendo agora?"
                autoFocus
                className="w-full rounded-md px-3 py-2 text-[13px] kratos-focus-ring"
                style={{
                  background: "var(--kratos-surface-2)",
                  border: "1px solid var(--kratos-border)",
                  color: "var(--kratos-text-primary)",
                }}
              />
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Próxima ação (opcional)"
                className="w-full rounded-md px-3 py-2 text-[13px] kratos-focus-ring"
                style={{
                  background: "var(--kratos-surface-2)",
                  border: "1px solid var(--kratos-border)",
                  color: "var(--kratos-text-secondary)",
                }}
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!titulo.trim() || createMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-[12px] font-medium kratos-focus-ring disabled:opacity-40"
                  style={{
                    background: "var(--kratos-surface-4)",
                    border: "1px solid var(--kratos-border-live)",
                    color: "var(--kratos-text-primary)",
                  }}
                >
                  {createMutation.isPending ? "Salvando..." : "Salvar"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-md px-4 py-2 text-[12px] kratos-focus-ring"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--kratos-border)",
                    color: "var(--kratos-text-secondary)",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </StatusCard>
        )}
      </div>

      {/* Empty state */}
      {checkpoints.length === 0 ? (
        <EmptyState
          eyebrow="Nenhum checkpoint ainda"
          title="Seu primeiro save game está a um clique."
          action={
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-medium kratos-focus-ring"
              style={{
                background: "var(--kratos-surface-4)",
                border: "1px solid var(--kratos-border-live)",
                color: "var(--kratos-text-primary)",
              }}
            >
              <Bookmark className="h-4 w-4" />
              Criar primeiro checkpoint
            </button>
          }
        />
      ) : (
        <>
          {/* Resume + Summary row */}
          {resumeCheckpoint && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <div className="lg:col-span-2">
                <ResumeFromHereCard
                  project={resumeCheckpoint.projetoId ?? "KRATOS"}
                  time={relativeTime(resumeCheckpoint.atualizadoEm)}
                  summary={resumeCheckpoint.titulo}
                  nextAction={resumeCheckpoint.descricao ?? "Retomar"}
                  onResume={() => handleResume(resumeCheckpoint.id)}
                  isPending={pendingId === resumeCheckpoint.id}
                />
              </div>
              <CheckpointSummaryCard
                lastCheckpoint={relativeTime(checkpoints[0]?.atualizadoEm ?? "")}
                todayCount={todayCount}
                recentProject={checkpoints[0]?.projetoId ?? "KRATOS"}
                risk={{
                  label: checkpoints.some((c) => c.status === "blocked")
                    ? "Bloqueio ativo"
                    : todayCount > 0
                      ? "Baixo"
                      : "Sem atividade",
                  severity: checkpoints.some((c) => c.status === "blocked")
                    ? "critical"
                    : todayCount > 0
                      ? "ok"
                      : "warn",
                }}
              />
            </div>
          )}

          {/* Filters */}
          <div className="mb-4">
            <CheckpointFilterBar active={filter} onChange={setFilter} />
          </div>

          {/* Timeline */}
          {timelineItems.length > 0 ? (
            <CheckpointTimeline
              items={timelineItems}
              onResume={handleResume}
              onDelete={handleDelete}
              pendingId={pendingId}
            />
          ) : (
            <StatusCard>
              <div
                className="text-center py-8 text-[13px]"
                style={{ color: "var(--kratos-text-secondary)" }}
              >
                Nenhum checkpoint com este filtro.
              </div>
            </StatusCard>
          )}
        </>
      )}
    </div>
  );
}
