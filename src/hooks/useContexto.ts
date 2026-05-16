import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getContextSnapshot } from "@/lib/contexto-server-fns";
import type { ContextSnapshot } from "../../api-contract/contexto.schema";

export function useContextSnapshot() {
  const qc = useQueryClient();

  const query = useQuery<{ data: ContextSnapshot | null; error: string | null }>({
    queryKey: ["contexto", "snapshot"],
    queryFn: () => getContextSnapshot({ refresh: false }),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  return {
    snapshot: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.data?.error ?? null,
    refetch: () => qc.invalidateQueries({ queryKey: ["contexto", "snapshot"] }),
  };
}
