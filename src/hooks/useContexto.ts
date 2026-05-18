import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getContextSnapshot, getContextoSnapshot } from "@/lib/contexto-server-fns";
import type { ContextSnapshot, ContextoSnapshotData } from "../../api-contract/contexto.schema";
import type { SourceBadgeMeta } from "../../api-contract/source-badge.schema";

export function useContextSnapshot() {
  const qc = useQueryClient();

  const query = useQuery<{ data: ContextSnapshot | null; error: string | null }>({
    queryKey: ["contexto", "snapshot"],
    queryFn: () => getContextSnapshot({ refresh: false }),
    staleTime: 15_000,
    refetchInterval: 30_000,
    retry: false,
  });

  return {
    snapshot: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.data?.error ?? null,
    refetch: () => qc.invalidateQueries({ queryKey: ["contexto", "snapshot"] }),
  };
}

// ── Mission-level contexto snapshot (Sprint A getContextoSnapshot) ──

export function useContextoMissionSnapshot(opts?: { refresh?: boolean }) {
  const qc = useQueryClient();
  const refresh = opts?.refresh ?? false;

  const query = useQuery<{
    data: ContextoSnapshotData | null;
    error: { code: string; message: string; detail?: string } | null;
    meta: SourceBadgeMeta;
  }>({
    queryKey: ["contexto", "mission-snapshot"],
    queryFn: () => getContextoSnapshot({ refresh }),
    staleTime: 15_000,
    refetchInterval: 30_000,
    retry: false,
  });

  return {
    data: query.data?.data ?? null,
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    isError: query.isError || query.data?.error !== null,
    error: query.data?.error ?? null,
    refetch: () => qc.invalidateQueries({ queryKey: ["contexto", "mission-snapshot"] }),
  };
}
