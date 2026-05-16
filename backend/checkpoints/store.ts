import type {
  Checkpoint,
  CreateCheckpoint,
  UpdateCheckpoint,
} from "../../api-contract/checkpoint.schema";
import { createMapRepository } from "../lib/store-adapter";

const seedItems: Checkpoint[] = [
  {
    id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00",
    titulo: "Plano do Crédito 4 aprovado",
    descricao: "Validação do sandbox concluída antes do build de /contexto",
    progresso: 60,
    status: "in_progress",
    deadline: null,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
    titulo: "Crédito 3 validado no sandbox",
    descricao: "Agenda validada, pronto para abrir plano do Crédito 4",
    progresso: 100,
    status: "completed",
    deadline: null,
    criadoEm: new Date(Date.now() - 3600000).toISOString(),
    atualizadoEm: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
    projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02",
    titulo: "Microcopy do Mentor revisada",
    descricao: "Aplicar no painel da /agenda após revisão final",
    progresso: 30,
    status: "pending",
    deadline: new Date(Date.now() + 86400000).toISOString(),
    criadoEm: new Date(Date.now() - 7200000).toISOString(),
    atualizadoEm: new Date(Date.now() - 3600000).toISOString(),
  },
];

function buildEntity(input: CreateCheckpoint, id: string, now: string): Checkpoint {
  return {
    id,
    projetoId: input.projetoId ?? null,
    titulo: input.titulo,
    descricao: input.descricao,
    progresso: 0,
    status: "pending",
    deadline: input.deadline ?? null,
    criadoEm: now,
    atualizadoEm: now,
  };
}

const repo = createMapRepository<Checkpoint, CreateCheckpoint, UpdateCheckpoint>(
  seedItems,
  buildEntity,
);

export function getAll(): Checkpoint[] {
  return repo.getAll().sort(
    (a, b) => new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime(),
  );
}

export const getById = repo.getById;
export const create = repo.create;
export const update = repo.update;
export const remove = repo.remove;
