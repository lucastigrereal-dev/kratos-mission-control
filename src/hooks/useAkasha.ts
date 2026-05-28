import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchAkashaStatus, searchAkasha, fetchAkashaCollections, type AkashaStatusData } from "@/lib/akasha-server-fns";
import type { AkashaSearchResponse, AkashaCollectionsResponse } from "../../api-contract/akasha.schema";

// ── Status ────────────────────────────────────────────────────────────────────

export function useAkashaStatus() {
  return useQuery<AkashaStatusData | null, Error>({
    queryKey: ["akasha", "status"],
    queryFn: async () => {
      const result = await fetchAkashaStatus();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 60_000,
    retry: false,
  });
}

// ── Collections ───────────────────────────────────────────────────────────────

export function useAkashaCollections() {
  const query = useQuery<AkashaCollectionsResponse | null, Error>({
    queryKey: ["akasha", "collections"],
    queryFn: async () => {
      const result = await fetchAkashaCollections();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 300_000, // 5 min — collections change rarely
    retry: false,
  });

  return {
    collections: query.data?.collections ?? [],
    totalChunks: query.data?.total_chunks,
    totalDocs: query.data?.total_docs,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// ── Search ────────────────────────────────────────────────────────────────────

export interface UseAkashaSearchState {
  query: string;
  results: AkashaSearchResponse["results"];
  isSearching: boolean;
  error: string | null;
  hasSearched: boolean;
  latencyMs: number | null;
  setQuery: (q: string) => void;
  search: (q?: string) => void;
  clear: () => void;
}

/**
 * useAkashaSearch — semantic memory search via Akasha pgvector.
 *
 * Auto-searches after DEBOUNCE_MS when query >= 3 chars.
 * Manual: call search() immediately.
 * Graceful: if backend offline, error is surfaced — no crash.
 */
const DEBOUNCE_MS = 400;

export function useAkashaSearch(limit = 5, collection?: string): UseAkashaSearchState {
  const [queryText, setQueryText] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mutation = useMutation<AkashaSearchResponse | null, Error, string>({
    mutationFn: async (q: string) => {
      const result = await searchAkasha({ data: { query: q, limit, collection } });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
  });

  const search = useCallback(
    (overrideQuery?: string) => {
      const q = (overrideQuery ?? queryText).trim();
      if (!q) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setHasSearched(true);
      mutation.mutate(q);
    },
    [queryText, mutation],
  );

  const setQuery = useCallback(
    (q: string) => {
      setQueryText(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (q.trim().length >= 3) {
        debounceRef.current = setTimeout(() => {
          setHasSearched(true);
          mutation.mutate(q.trim());
        }, DEBOUNCE_MS);
      }
    },
    [mutation],
  );

  const clear = useCallback(() => {
    setQueryText("");
    setHasSearched(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    mutation.reset();
  }, [mutation]);

  return {
    query: queryText,
    results: mutation.data?.results ?? [],
    isSearching: mutation.isPending,
    error: mutation.error?.message ?? null,
    hasSearched,
    latencyMs: mutation.data?.latency_ms ?? null,
    setQuery,
    search,
    clear,
  };
}
