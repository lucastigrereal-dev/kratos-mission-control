import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://127.0.0.1:5100";

interface ApiResult<T> {
  data: T | null;
  source: string;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(path: string): ApiResult<T> & { refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [source, setSource] = useState("unknown");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}${path}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setSource("live");
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fetch failed");
      setSource("error");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, source, loading, error, refetch: fetchData };
}
