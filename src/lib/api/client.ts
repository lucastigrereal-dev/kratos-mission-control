/**
 * KRATOS API Client — fonte canônica para chamadas HTTP ao backend Python.
 * Todos os hooks que falam com localhost:5100 devem importar daqui.
 *
 * READ-ONLY boundary: KRATOS lê status do OMNIS — NUNCA comanda.
 * apiPost existe apenas para APIs internas do KRATOS, não para o OMNIS.
 *
 * W1-B5: Mock interceptor — VITE_USE_MOCKS=true para desenvolvimento offline.
 * O mock retorna dados sintéticos realistas com source:'mock' implícito.
 */

export const API_BASE: string =
  typeof window !== "undefined"
    ? (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5100")
    : "http://localhost:5100";

export const DEFAULT_TIMEOUT_MS = 5_000;

const USE_MOCKS =
  typeof import.meta !== "undefined" &&
  import.meta.env?.VITE_USE_MOCKS === "true";

export interface FetchResult {
  ok: boolean;
  /** HTTP status code, 0 em caso de timeout/rede */
  status: number;
  /** JSON parsed response, null em caso de erro */
  raw: unknown;
}

// ── Mock data registry — realista, sem dados fake óbvios ──────────────────
// Cada chave é um prefixo de path. O mock mais específico vence.

const MOCK_REGISTRY: Record<string, unknown> = {
  "/live/snapshot": {
    mission_lens: {
      current_mission: "OMNIS — Parallel Fabric P2",
      status: "running",
      focus_state: "Implementando wave-status skill",
    },
    next_best_action: {
      action: "Revisar worktree kratos-mission-control",
      context: "Feature/fase14 tem 7 commits prontos para merge",
    },
    mentor_signals: [],
    context: { focus_state: "Modo Construção" },
  },
  "/live/aurora-insight": {
    insight: "Tigrão, 3 missões ativas no OMNIS. Parallel Fabric P1 100% — P2 iniciando.",
    confidence: 0.82,
    source: "state.json",
  },
  "/live/drift": {
    drift_state: "on-mission",
    minutes_off: 0,
    nudge_message: null,
    original_mission: null,
  },
  "/missions/active": {
    data: [
      {
        mission_id: "mock-m1",
        title: "Parallel Fabric P2 — intelligent layer",
        sector: "Produto & Tecnologia",
        status: "running",
        current_step: "wave-status-skill",
        retry_count: 0,
        max_retries: 3,
        cumulative_cost_usd: 0.0042,
        last_event_type: "step_started",
        last_event_label: "Executando step",
        last_event_at: new Date(Date.now() - 4 * 60_000).toISOString(),
        error_count: 0,
        event_count: 12,
        budget_exceeded: false,
        approval_pending: false,
      },
      {
        mission_id: "mock-m2",
        title: "KR30 — Observabilidade backend",
        sector: "Produto & Tecnologia",
        status: "paused",
        current_step: null,
        retry_count: 1,
        max_retries: 3,
        cumulative_cost_usd: 0.0011,
        last_event_type: "mission_paused",
        last_event_label: "Pausado",
        last_event_at: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
        error_count: 0,
        event_count: 5,
        budget_exceeded: false,
        approval_pending: false,
      },
    ],
    total: 2,
    source: "live",
    missions_dir: "mock",
  },
  "/omnis/status": {
    version: "0.1.0",
    status: "healthy",
    workflows_registered: 14,
    test_count: 9847,
    last_run_status: "ok",
    memoria: { totalDocs: 20000, totalChunks: 606000 },
  },
  "/omnis/crews": [],
  "/omnis/jobs": { jobs: [], total: 0 },
  "/services": {
    services: [
      { name: "KRATOS Backend", status: "healthy", latency_ms: 12 },
      { name: "OMNIS API", status: "healthy", latency_ms: 18 },
      { name: "Akasha (pgvector)", status: "healthy", latency_ms: 31 },
    ],
  },
  // ── W10-B1: Marketing Island mocks ───────────────────────────────────────
  "/agencia/queue-summary": {
    data: {
      total: 18,
      por_status: {
        caption_ready: 7,
        needs_asset: 5,
        done: 4,
        cancelled: 2,
      },
      proximo_slot: {
        date: "2026-05-28",
        time: "18:00",
        account: "oinatalrn",
        objective: "engagement",
        status: "caption_ready",
      },
    },
    source: "live",
    queue_path: "mock",
  },
  "/agencia/metrics": {
    source: "mock",
    period: "last_7d",
    accounts: [
      { handle: "lucastigrereal",   followers: 690_000, reach: 41_200, engagement_pct: 4.8 },
      { handle: "oinatalrn",        followers: 630_000, reach: 37_800, engagement_pct: 5.1 },
      { handle: "agenteviajabrasil",followers: 452_000, reach: 28_400, engagement_pct: 4.3 },
      { handle: "afamiliatigrereal",followers: 320_000, reach: 19_600, engagement_pct: 3.9 },
      { handle: "oquecomernatalrn", followers: 249_000, reach: 17_800, engagement_pct: 5.6 },
      { handle: "natalaivoueu",     followers: 240_000, reach: 15_200, engagement_pct: 4.7 },
    ],
    total_followers: 2_581_000,
    total_reach_7d: 160_000,
    avg_engagement_pct: 4.7,
    posts_published_7d: 14,
  },
};

/** Finds best-match mock for a given path (most specific prefix wins). */
function findMock(path: string): unknown | undefined {
  // Strip query string for matching
  const cleanPath = path.split("?")[0];
  // Find longest matching key
  const key = Object.keys(MOCK_REGISTRY)
    .filter((k) => cleanPath.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  return key ? MOCK_REGISTRY[key] : undefined;
}

/**
 * GET request ao backend Python do KRATOS.
 * Retorna `{ ok, status, raw }` — o caller faz o parse Zod.
 * Nunca lança exceção — requests com falha retornam `{ ok: false, raw: null }`.
 */
export async function apiGet(
  path: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<FetchResult> {
  // W1-B5: Mock mode shortcut
  if (USE_MOCKS) {
    const mock = findMock(path);
    if (mock !== undefined) {
      return { ok: true, status: 200, raw: mock };
    }
    // No mock registered → return empty ok so hooks show EmptyState
    return { ok: true, status: 200, raw: null };
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return { ok: false, status: res.status, raw: null };
    const raw: unknown = await res.json();
    return { ok: true, status: res.status, raw };
  } catch {
    return { ok: false, status: 0, raw: null };
  }
}

/**
 * POST request — para endpoints de mutação futuros.
 * ATENÇÃO: não usar para endpoints OMNIS. KRATOS não comanda OMNIS.
 */
export async function apiPost<B = unknown>(
  path: string,
  body: B,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<FetchResult> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return { ok: false, status: res.status, raw: null };
    const raw: unknown = await res.json();
    return { ok: true, status: res.status, raw };
  } catch {
    return { ok: false, status: 0, raw: null };
  }
}
