import { QueryClient } from "@tanstack/react-query";

/**
 * Factory para criar um QueryClient configurado com defaults KRATOS.
 *
 * Defaults:
 * - staleTime: 30s — evita refetch desnecessário em navegação rápida
 * - gcTime: 5min — dados descartados após 5min sem uso (cache GC)
 * - retry: 1 — uma retentativa em falha (fail-fast para live dashboard)
 * - refetchOnWindowFocus: false — sem revalidação automática ao focar janela
 *
 * Hooks individuais podem sobreescrever estes defaults via opções de useQuery.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}
