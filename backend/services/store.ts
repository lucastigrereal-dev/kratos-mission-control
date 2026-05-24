import type { Service } from "../../api-contract/service.schema";

const store = new Map<string, Service>();
let _lastFetch = 0;
const _cacheTtl = 15_000; // 15s cache

function seedFallback(): void {
  const now = new Date().toISOString();
  const items: Service[] = [
    { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01", nome: "KRATOS", descricao: "Mission Control — este cockpit.", health: "unknown", ultimoPing: now, versao: "0.12.0" },
    { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02", nome: "Akasha", descricao: "Memória vetorial pgvector.", url: "localhost:5432", health: "unknown", ultimoPing: now, versao: "3.1.0" },
    { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03", nome: "OMNIS", descricao: "Motor de execução de skills e crews.", health: "unknown", ultimoPing: now, versao: "2.5.0" },
    { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04", nome: "Publisher OS", descricao: "Pipeline de produção de conteúdo Instagram.", url: "localhost:3200", health: "unknown", ultimoPing: now, versao: "4.0.0" },
    { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05", nome: "Supabase DB", descricao: "Banco de dados principal.", url: "localhost:5434", health: "unknown", ultimoPing: now, versao: "15.0" },
    { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06", nome: "Redis", descricao: "Cache e filas BullMQ.", url: "localhost:6381", health: "unknown", ultimoPing: now, versao: "7.2" },
    { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07", nome: "Ollama", descricao: "LLM local para inferência.", url: "localhost:11434", health: "unknown", ultimoPing: now, versao: "0.9.0" },
    { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08", nome: "n8n", descricao: "Automação de workflows.", url: "localhost:5678", health: "unknown", ultimoPing: now, versao: "1.8.0" },
  ];
  for (const item of items) store.set(item.id, item);
}

const SERVICE_MAP: Record<string, { id: string; nome: string; descricao: string; url?: string; versao: string }> = {
  system:       { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01", nome: "KRATOS",       descricao: "Mission Control — este cockpit.", versao: "0.12.0" },
  docker:       { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a0a", nome: "Docker",       descricao: "Container runtime.", versao: "—" },
  akasha:       { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02", nome: "Akasha",       descricao: "Memória vetorial pgvector.", url: "localhost:5432", versao: "3.1.0" },
  omnis:        { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03", nome: "OMNIS",        descricao: "Motor de execução de skills e crews.", versao: "2.5.0" },
  qdrant:       { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a0b", nome: "Qdrant",       descricao: "Vector store.", url: "localhost:6333", versao: "—" },
  ollama:       { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07", nome: "Ollama",       descricao: "LLM local para inferência.", url: "localhost:11434", versao: "—" },
  publisher_os: { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04", nome: "Publisher OS", descricao: "Pipeline de produção de conteúdo Instagram.", url: "localhost:3200", versao: "—" },
  supabase:     { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05", nome: "Supabase DB",  descricao: "Banco de dados principal.", url: "localhost:5434", versao: "—" },
  redis:        { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06", nome: "Redis",        descricao: "Cache e filas BullMQ.", url: "localhost:6381", versao: "—" },
  n8n:          { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08", nome: "n8n",          descricao: "Automação de workflows.", url: "localhost:5678", versao: "—" },
};

function healthFromStatus(status: string): "live" | "degraded" | "offline" | "unknown" {
  if (status === "ok") return "live";
  if (status === "degraded") return "degraded";
  if (status === "error") return "offline";
  return "unknown";
}

async function fetchRealHealth(): Promise<Service[]> {
  const now = new Date().toISOString();
  try {
    const res = await fetch("http://localhost:5100/health", { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error("health endpoint returned " + res.status);
    const body = await res.json() as any;
    const collectors = body?.data?.collectors ?? {};

    const services: Service[] = [];
    for (const [key, meta] of Object.entries(SERVICE_MAP)) {
      const c = (collectors as Record<string, any>)[key];
      const health = c ? healthFromStatus(c.status) : "unknown";
      services.push({ ...meta, health, ultimoPing: now });
    }

    return services;
  } catch {
    return [];
  }
}

async function refreshStore(): Promise<void> {
  const now = Date.now();
  if (now - _lastFetch < _cacheTtl) return;

  const real = await fetchRealHealth();
  if (real.length > 0) {
    store.clear();
    for (const s of real) store.set(s.id, s);
    _lastFetch = now;
  } else if (store.size === 0) {
    seedFallback();
  }
}

export async function getServices(): Promise<Service[]> {
  await refreshStore();
  if (store.size === 0) seedFallback();
  return Array.from(store.values());
}

export async function getServicesHealthSummary(): Promise<{
  total: number; live: number; degraded: number; offline: number; unknown: number;
  stale: boolean; checked_at: string;
}> {
  const services = await getServices();
  const checked_at = new Date().toISOString();
  const live = services.filter((s) => s.health === "live").length;
  const degraded = services.filter((s) => s.health === "degraded").length;
  const offline = services.filter((s) => s.health === "offline").length;
  const unknown = services.filter((s) => s.health === "unknown").length;
  return {
    total: services.length,
    live, degraded, offline, unknown,
    stale: _lastFetch === 0,
    checked_at,
  };
}

export function _reset(): void {
  store.clear();
  _lastFetch = 0;
}
