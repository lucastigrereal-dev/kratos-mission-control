import type { Project, CreateProject, UpdateProject } from "../../api-contract/project.schema";

const store = new Map<string, Project>();

function seed(): void {
  const now = new Date().toISOString();
  const items: Project[] = [
    {
      id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00",
      nome: "KRATOS",
      descricao: "Mission Control — cockpit pessoal de projetos, checkpoints e foco.",
      status: "active",
      repo: "kratos-mission-control",
      prioridade: 5,
      ultimaAtividade: now,
      criadoEm: new Date(Date.now() - 30 * 86400000).toISOString(),
      atualizadoEm: now,
    },
    {
      id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
      nome: "OMNIS",
      descricao: "Runtime de agentes autônomos — skills, crews, memória vetorial.",
      status: "active",
      repo: "omnis-runtime-bridge",
      prioridade: 5,
      ultimaAtividade: new Date(Date.now() - 3600000).toISOString(),
      criadoEm: new Date(Date.now() - 60 * 86400000).toISOString(),
      atualizadoEm: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02",
      nome: "Lusterart",
      descricao: "Sistema de estética pessoal — roupas, estilo, inventário visual.",
      status: "paused",
      repo: null,
      prioridade: 2,
      ultimaAtividade: new Date(Date.now() - 7 * 86400000).toISOString(),
      criadoEm: new Date(Date.now() - 90 * 86400000).toISOString(),
      atualizadoEm: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03",
      nome: "Casa Segura",
      descricao: "Projeto da casa própria — planejamento, orçamento, execução.",
      status: "active",
      repo: null,
      prioridade: 3,
      ultimaAtividade: new Date(Date.now() - 3 * 86400000).toISOString(),
      criadoEm: new Date(Date.now() - 120 * 86400000).toISOString(),
      atualizadoEm: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04",
      nome: "Instagramas",
      descricao: "Operação de 6 perfis Instagram (2.3M seguidores) — publi, collabs, pipeline comercial.",
      status: "active",
      repo: null,
      prioridade: 4,
      ultimaAtividade: new Date(Date.now() - 1800000).toISOString(),
      criadoEm: new Date(Date.now() - 180 * 86400000).toISOString(),
      atualizadoEm: new Date(Date.now() - 1800000).toISOString(),
    },
  ];
  for (const item of items) {
    store.set(item.id, item);
  }
}

seed();

export function getAll(): Project[] {
  return [...store.values()].sort(
    (a, b) => b.prioridade - a.prioridade || new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime()
  );
}

export function getById(id: string): Project | undefined {
  return store.get(id);
}

export function create(input: CreateProject): Project {
  const now = new Date().toISOString();
  const project: Project = {
    id: crypto.randomUUID(),
    nome: input.nome,
    descricao: input.descricao,
    status: "active",
    repo: input.repo ?? null,
    prioridade: input.prioridade ?? 3,
    ultimaAtividade: now,
    criadoEm: now,
    atualizadoEm: now,
  };
  store.set(project.id, project);
  return project;
}

export function update(id: string, input: UpdateProject): Project | undefined {
  const existing = store.get(id);
  if (!existing) return undefined;
  const updated: Project = {
    ...existing,
    ...input,
    id: existing.id,
    criadoEm: existing.criadoEm,
    atualizadoEm: new Date().toISOString(),
  };
  store.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return store.delete(id);
}
