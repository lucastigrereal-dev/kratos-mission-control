import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getServicesHealth } from "@/lib/service-server-fns";
import type { Service } from "../../api-contract/service.schema";

export function useServices() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["services"],
    queryFn: () => getServicesHealth(),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  return {
    services: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.data?.error ?? null,
    refetch: () => qc.invalidateQueries({ queryKey: ["services"] }),
  };
}
