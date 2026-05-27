/**
 * KRATOS Analytics — W8-B3
 *
 * Lightweight event tracker — zero external SDK, zero PII.
 * Events são bufferizados em memória e podem ser forwarded para
 * Plausible / PostHog / endpoint próprio quando configurado.
 *
 * Toggle: VITE_ANALYTICS_ENDPOINT=https://plausible.io/api/event
 * Sem endpoint configurado: apenas loga em dev (console.debug).
 *
 * Eventos rastreados:
 *   route_view         — cada navegação de rota
 *   aurora_command     — comando executado no ⌘K palette
 *   optimistic_create  — criação de item (checkpoint/projeto/appointment)
 *   sse_disconnect     — SSE caiu (observabilidade de infra)
 *   error_boundary     — erro capturado por ErrorBoundary
 */

// ── Types ─────────────────────────────────────────────────────────────────

export type KratosEventName =
  | "route_view"
  | "aurora_command"
  | "optimistic_create"
  | "sse_disconnect"
  | "error_boundary";

export interface KratosEvent {
  name: KratosEventName;
  /** Epoch ms — set automatically */
  ts: number;
  props?: Record<string, string | number | boolean>;
}

// ── Config ────────────────────────────────────────────────────────────────

const ENDPOINT: string | undefined =
  typeof import.meta !== "undefined"
    ? import.meta.env?.VITE_ANALYTICS_ENDPOINT
    : undefined;

const IS_DEV =
  typeof import.meta !== "undefined" &&
  import.meta.env?.DEV === true;

/** Max events held in buffer before flush */
const BUFFER_MAX = 50;
/** Flush interval — 10s */
const FLUSH_INTERVAL_MS = 10_000;

// ── Internal buffer ───────────────────────────────────────────────────────

let _buffer: KratosEvent[] = [];
let _flushTimer: ReturnType<typeof setTimeout> | null = null;
let _sessionStart = Date.now();

// ── Core track ────────────────────────────────────────────────────────────

/**
 * Track a single event.
 * Fire-and-forget — never throws.
 */
export function track(
  name: KratosEventName,
  props?: KratosEvent["props"],
): void {
  const event: KratosEvent = { name, ts: Date.now(), props };

  if (IS_DEV) {
    // In dev: just log, no buffering
    console.debug(`[kratos:analytics] ${name}`, props ?? "");
    return;
  }

  _buffer.push(event);
  if (_buffer.length >= BUFFER_MAX) {
    flush();
  } else {
    scheduleFlush();
  }
}

// ── Typed helpers ─────────────────────────────────────────────────────────

/** Track a route navigation */
export function trackRouteView(pathname: string): void {
  track("route_view", {
    path: sanitizePath(pathname),
    session_age_s: Math.floor((Date.now() - _sessionStart) / 1000),
  });
}

/** Track an Aurora ⌘K command execution */
export function trackAuroraCommand(
  commandId: string,
  success: boolean,
  latencyMs?: number,
): void {
  track("aurora_command", {
    command_id: commandId,
    success,
    ...(latencyMs !== undefined ? { latency_ms: latencyMs } : {}),
  });
}

/** Track optimistic create (checkpoint / project / appointment) */
export function trackOptimisticCreate(entity: "checkpoint" | "project" | "appointment"): void {
  track("optimistic_create", { entity });
}

/** Track SSE disconnect (infrastructure observability) */
export function trackSSEDisconnect(reconnectAttempt: number): void {
  track("sse_disconnect", { attempt: reconnectAttempt });
}

/** Track error boundary catch */
export function trackErrorBoundary(route: string, errorType: string): void {
  track("error_boundary", {
    path: sanitizePath(route),
    error_type: errorType.slice(0, 60), // truncate long error class names
  });
}

// ── Session ───────────────────────────────────────────────────────────────

/** Reset session clock (call on page load) */
export function resetSession(): void {
  _sessionStart = Date.now();
}

// ── Flush ─────────────────────────────────────────────────────────────────

function scheduleFlush(): void {
  if (_flushTimer) return;
  _flushTimer = setTimeout(() => {
    _flushTimer = null;
    flush();
  }, FLUSH_INTERVAL_MS);
}

async function flush(): Promise<void> {
  if (_buffer.length === 0) return;
  const batch = _buffer.splice(0);

  if (!ENDPOINT) return; // No endpoint configured — events silently dropped in prod

  try {
    await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client": "kratos-mission-control",
      },
      body: JSON.stringify({ events: batch }),
      // keepalive: sendBeacon-like behaviour so events fire on page unload
      keepalive: true,
    });
  } catch {
    // Never fail silently — re-queue up to 10 events to avoid loss
    _buffer.unshift(...batch.slice(-10));
  }
}

/** Flush on page unload */
if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);
}

// ── Helpers ───────────────────────────────────────────────────────────────

/** Strip UUIDs and dynamic segments from paths to avoid high-cardinality keys */
function sanitizePath(path: string): string {
  return path
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "/:uuid")
    .replace(/\/\d{4}-\d{2}-\d{2}/g, "/:date")
    .replace(/\/\d+/g, "/:id");
}
