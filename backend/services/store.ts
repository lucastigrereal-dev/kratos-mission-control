import type { Service } from "../../api-contract/service.schema";

const store = new Map<string, Service>();

function seed(): void {
  const now = new Date().toISOString();
  const items: Service[] = [
    {
      id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
      nome: "KRATOS",
      descricao: "Mission Control — este cockpit.",
      health: "live",
      ultimoPing: now,
      versao: "0.10.0",
    },
    {
      id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02",
      nome: "Akasha",
      descricao: "Memória vetorial pgvector.",
      url: "localhost:5432",
      health: "live",
      ultimoPing: now,
      versao: "3.1.0",
    },
    {
      id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03",
      nome: "OMNIS",
      descricao: "Motor de execução de skills e crews.",
      health: "degraded",
      ultimoPing: now,
      versao: "2.5.0",
    },
    {
      id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04",
      nome: "Publisher OS",
      descricao: "Pipeline de produção de conteúdo Instagram.",
      url: "localhost:3200",
      health: "live",
      ultimoPing: now,
      versao: "4.0.0",
    },
    {
      id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05",
      nome: "Supabase DB",
      descricao: "Banco de dados principal.",
      url: "localhost:5434",
      health: "live",
      ultimoPing: now,
      versao: "15.0",
    },
    {
      id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06",
      nome: "Redis",
      descricao: "Cache e filas BullMQ.",
      url: "localhost:6382",
      health: "live",
      ultimoPing: now,
      versao: "7.2",
    },
    {
      id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07",
      nome: "Ollama",
      descricao: "LLM local para inferência.",
      url: "localhost:11434",
      health: "live",
      ultimoPing: now,
      versao: "0.9.0",
    },
    {
      id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08",
      nome: "n8n",
      descricao: "Automação de workflows.",
      url: "localhost:5678",
      health: "degraded",
      ultimoPing: now,
      versao: "1.8.0",
    },
  ];

  for (const item of items) {
    store.set(item.id, item);
  }
}

export function getServices(): Service[] {
  if (store.size === 0) seed();
  return Array.from(store.values()).map((s) => ({
    ...s,
    ultimoPing: new Date().toISOString(),
  }));
}
