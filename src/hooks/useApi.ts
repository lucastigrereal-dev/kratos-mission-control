import { useCallback, useRef, useState, useEffect } from "react";

// Standard KRATOS API envelope matching api-contract/KRATOS_API_CONTRACT_V1.md
export interface ApiEnvelope<T> {
  data: T | null;
  error: string | null;
  meta: {
    latency_ms: number;
    source: "live" | "cached" | "fallback" | "mock" | "error";
    cached_at: string | null;
  };
}

interface ApiOptions extends Omit<RequestInit, "signal"> {
  signal?: AbortSignal;
  baseUrl?: string;
}

const DEFAULT_BASE_URL = "";

export async function apiFetch<T>(
  path: string,
  options?: ApiOptions,
): Promise<ApiEnvelope<T>> {
  const baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;
  const url = `${baseUrl}${path}`;
  const start = performance.now();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      return {
        data: null,
        error: `HTTP ${response.status}: ${response.statusText}`,
        meta: {
          latency_ms: performance.now() - start,
          source: "error",
          cached_at: null,
        },
      };
    }

    const json = await response.json();

    if ("source" in json && "data" in json) {
      return {
        data: (json as ApiEnvelope<T>).data,
        error: (json as ApiEnvelope<T>).error,
        meta: {
          latency_ms: performance.now() - start,
          source: (json as ApiEnvelope<T>).meta.source,
          cached_at: (json as ApiEnvelope<T>).meta.cached_at,
        },
      };
    }

    return {
      data: json as T,
      error: null,
      meta: {
        latency_ms: performance.now() - start,
        source: "live",
        cached_at: null,
      },
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        data: null,
        error: "Request cancelled",
        meta: {
          latency_ms: performance.now() - start,
          source: "error",
          cached_at: null,
        },
      };
    }

    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
      meta: {
        latency_ms: performance.now() - start,
        source: "error",
        cached_at: null,
      },
    };
  }
}

interface UseApiState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  meta: ApiEnvelope<T>["meta"] | null;
}

export function useApi<T>(
  path: string | null,
  options?: ApiOptions,
): UseApiState<T> & { refetch: (signal?: AbortSignal) => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
    meta: null,
  });

  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const execute = useCallback(
    async (externalSignal?: AbortSignal) => {
      if (!path) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const signal = externalSignal ?? controller.signal;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await apiFetch<T>(path, { ...options, signal });

      if (!mountedRef.current) return;
      if (signal.aborted) return;

      setState({
        data: result.data,
        error: result.error,
        isLoading: false,
        meta: result.meta,
      });
    },
    [path, options],
  );

  useEffect(() => {
    mountedRef.current = true;
    execute();

    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, [execute]);

  return { ...state, refetch: execute };
}
