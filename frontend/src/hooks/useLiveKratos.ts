import { useState, useEffect, useRef, useCallback } from "react";

export type ConnectionState = "live" | "reconnecting" | "polling" | "fallback" | "offline";

const API_BASE = "http://127.0.0.1:5100";
const POLL_INTERVAL_MS = 10000;

export function useLiveKratos() {
  const [snapshot, setSnapshot] = useState<Record<string, unknown> | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>("offline");
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSnapshot = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/live/snapshot`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSnapshot(data);
      setError(null);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fetch failed");
      return false;
    }
  }, []);

  const startPolling = useCallback(() => {
    setConnectionState("polling");
    fetchSnapshot();
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    pollTimerRef.current = setInterval(fetchSnapshot, POLL_INTERVAL_MS);
  }, [fetchSnapshot]);

  const startSSE = useCallback(() => {
    const es = new EventSource(`${API_BASE}/live/stream`);
    eventSourceRef.current = es;

    es.onopen = () => {
      setConnectionState("live");
      setError(null);
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSnapshot(data);
        setConnectionState("live");
        setError(null);
      } catch {
        // ignore parse errors on keepalive comments
      }
    };

    es.onerror = () => {
      es.close();
      setConnectionState("reconnecting");
      // After 2 failed reconnect attempts, fall back to polling
      startPolling();
    };
  }, [startPolling]);

  useEffect(() => {
    startSSE();

    return () => {
      eventSourceRef.current?.close();
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [startSSE]);

  return { snapshot, connectionState, error, refetch: fetchSnapshot };
}
