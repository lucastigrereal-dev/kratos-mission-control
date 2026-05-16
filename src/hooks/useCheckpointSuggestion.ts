import { useMemo } from "react";
import { useCheckpoints } from "./useCheckpoints";
import { useProjects } from "./useProjects";
import type { Checkpoint } from "../../api-contract/checkpoint.schema";

interface CheckpointSuggestion {
  severity: "ok" | "warn" | "critical";
  reason: string;
  suggestedAction: string;
  affectedCheckpoint?: Checkpoint;
  affectedProject?: string;
}

function findStaleCheckpoint(checkpoints: Checkpoint[]): Checkpoint | undefined {
  const now = Date.now();
  const STALE_MS = 7 * 24 * 3600000; // 7 days
  return checkpoints
    .filter((c) => c.status === "in_progress" || c.status === "pending")
    .sort((a, b) => new Date(a.atualizadoEm).getTime() - new Date(b.atualizadoEm).getTime())
    .find((c) => now - new Date(c.atualizadoEm).getTime() > STALE_MS);
}

function findBlockedCheckpoint(checkpoints: Checkpoint[]): Checkpoint | undefined {
  return checkpoints.find((c) => c.status === "blocked");
}

function hasActiveCheckpoint(checkpoints: Checkpoint[]): boolean {
  return checkpoints.some(
    (c) => c.status === "in_progress" || c.status === "pending"
  );
}

export function useCheckpointSuggestion(): CheckpointSuggestion | null {
  const { data: checkpoints, isLoading: cpLoading } = useCheckpoints();
  const { data: projects, isLoading: pjLoading } = useProjects();

  return useMemo(() => {
    if (cpLoading || pjLoading) return null;
    if (!checkpoints || !projects) return null;

    const blocked = findBlockedCheckpoint(checkpoints);
    if (blocked) {
      return {
        severity: "critical",
        reason: `Checkpoint "${blocked.titulo}" está bloqueado.`,
        suggestedAction: "Identificar desbloqueador e atualizar status.",
        affectedCheckpoint: blocked,
        affectedProject: blocked.projetoId ?? undefined,
      };
    }

    const stale = findStaleCheckpoint(checkpoints);
    if (stale) {
      return {
        severity: "warn",
        reason: `Checkpoint "${stale.titulo}" parado há mais de 7 dias.`,
        suggestedAction: "Retomar ou fechar checkpoint com status atualizado.",
        affectedCheckpoint: stale,
        affectedProject: stale.projetoId ?? undefined,
      };
    }

    if (!hasActiveCheckpoint(checkpoints)) {
      const activeProjects = projects.filter((p) => p.status === "active");
      if (activeProjects.length > 0) {
        return {
          severity: "warn",
          reason: `${activeProjects[0].nome} está ativo mas sem checkpoint.`,
          suggestedAction: "Criar checkpoint mínimo hoje, mesmo que parcial.",
          affectedProject: activeProjects[0].nome,
        };
      }
      return {
        severity: "warn",
        reason: "Nenhum checkpoint ativo no sistema.",
        suggestedAction: "Criar checkpoint mínimo hoje, mesmo que parcial.",
      };
    }

    return null;
  }, [checkpoints, projects, cpLoading, pjLoading]);
}
