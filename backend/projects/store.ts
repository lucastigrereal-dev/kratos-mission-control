import type { Project, CreateProject, UpdateProject } from "../../api-contract/project.schema";
import { createMapRepository } from "../lib/store-adapter";

const now = new Date().toISOString();

const seedItems: Project[] = [
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

function buildEntity(input: CreateProject, id: string, now: string): Project {
  return {
    id,
    nome: input.nome,
    descricao: input.descricao,
    status: "active",
    repo: input.repo ?? null,
    prioridade: input.prioridade ?? 3,
    ultimaAtividade: now,
    criadoEm: now,
    atualizadoEm: now,
  };
}

const repo = createMapRepository<Project, CreateProject, UpdateProject>(
  seedItems,
  buildEntity,
);

export function getAll(): Project[] {
  return repo.getAll().sort(
    (a, b) => b.prioridade - a.prioridade || new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime(),
  );
}

export const getById = repo.getById;
export const create = repo.create;
export const update = repo.update;
export const remove = repo.remove;
