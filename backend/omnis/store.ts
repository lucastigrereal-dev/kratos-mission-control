import type { OmnisStatus, OmnisServiceStatus, OmnisCrew, OmnisJob, OmnisMemoryStats } from "../../api-contract/omnis.schema";

const MOCK_SERVICES: OmnisServiceStatus[] = [
  { nome: "ollama", status: "healthy", porta: 11434, uptime: "14d 6h" },
  { nome: "litellm", status: "healthy", porta: 4002, uptime: "14d 6h" },
  { nome: "supabase-db", status: "healthy", porta: 5434, uptime: "14d 6h" },
  { nome: "redis", status: "healthy", porta: 6382, uptime: "14d 6h" },
  { nome: "n8n", status: "healthy", porta: 5678, uptime: "12d 3h" },
  { nome: "publisher-core", status: "healthy", porta: 3200, uptime: "14d 6h" },
  { nome: "minio", status: "healthy", porta: 9001, uptime: "14d 6h" },
  { nome: "open-webui", status: "degraded", porta: 3001, uptime: "8d 12h" },
];

const MOCK_CREWS: OmnisCrew[] = [
  {
    nome: "conteudo",
    descricao: "Produção de carrosséis, reels e multi-copy",
    ultimaExecucao: new Date(Date.now() - 1800000).toISOString(),
    status: "idle",
    jobsConcluidos: 247,
    taxaSucesso: 0.89,
  },
  {
    nome: "sdr",
    descricao: "Qualificação de leads hoteleiros",
    ultimaExecucao: new Date(Date.now() - 86400000).toISOString(),
    status: "idle",
    jobsConcluidos: 83,
    taxaSucesso: 0.94,
  },
  {
    nome: "analytics",
    descricao: "Métricas de engajamento e relatórios",
    ultimaExecucao: new Date(Date.now() - 43200000).toISOString(),
    status: "idle",
    jobsConcluidos: 156,
    taxaSucesso: 0.97,
  },
  {
    nome: "seo",
    descricao: "Otimização de legendas e hashtags",
    ultimaExecucao: new Date(Date.now() - 7200000).toISOString(),
    status: "idle",
    jobsConcluidos: 198,
    taxaSucesso: 0.91,
  },
  {
    nome: "memoria",
    descricao: "Indexação e busca vetorial (Akasha + Mem0)",
    status: "failed",
    jobsConcluidos: 42,
    taxaSucesso: 0.76,
  },
];

const MOCK_JOBS: OmnisJob[] = [
  {
    id: "97da9a72",
    tipo: "carrossel",
    status: "done",
    criadoEm: new Date(Date.now() - 1800000).toISOString(),
    duracaoSegundos: 918,
    outputTipo: "carrossel @afamiliatigrereal",
  },
  {
    id: "8e15f0ad",
    tipo: "reel",
    status: "done",
    criadoEm: new Date(Date.now() - 3600000).toISOString(),
    duracaoSegundos: 1205,
    outputTipo: "reel @lucastigrereal",
  },
  {
    id: "a3b7c1d9",
    tipo: "multi_copy",
    status: "running",
    criadoEm: new Date(Date.now() - 600000).toISOString(),
    outputTipo: "multi_copy @oinatalrn",
  },
  {
    id: "f2e4d6c8",
    tipo: "sdr_qualify",
    status: "needs_review",
    criadoEm: new Date(Date.now() - 7200000).toISOString(),
    duracaoSegundos: 345,
    outputTipo: "lead qualification report",
  },
];

const MOCK_MEMORY: OmnisMemoryStats = {
  totalDocs: 20260,
  totalChunks: 606000,
  dominios: 9,
};

const MOCK_STATUS: OmnisStatus = {
  servicos: MOCK_SERVICES,
  crews: MOCK_CREWS,
  jobsRecentes: MOCK_JOBS,
  memoria: MOCK_MEMORY,
  atualizadoEm: new Date().toISOString(),
};

const cache = new Map<string, { data: OmnisStatus; ts: number }>();
const CACHE_TTL = 30_000; // 30s — OMNIS muda mais rápido

function buildStatus(): OmnisStatus {
  return {
    ...MOCK_STATUS,
    atualizadoEm: new Date().toISOString(),
  };
}

export function getOmnisStatus(): OmnisStatus {
  const key = "omnis:status";
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }
  const status = buildStatus();
  cache.set(key, { data: status, ts: Date.now() });
  return status;
}

export function getOmnisServiceHealth(): { healthy: number; degraded: number; down: number } {
  const status = getOmnisStatus();
  return {
    healthy: status.servicos.filter((s) => s.status === "healthy").length,
    degraded: status.servicos.filter((s) => s.status === "degraded").length,
    down: status.servicos.filter((s) => s.status === "down").length,
  };
}

export function getOmnisCrewStatus() {
  return getOmnisStatus().crews;
}

export function getOmnisRecentJobs(limit = 5): OmnisJob[] {
  return getOmnisStatus().jobsRecentes.slice(0, limit);
}

/** For testing: reset the store to empty state */
export function _reset(): void {
  cache.clear();
}
