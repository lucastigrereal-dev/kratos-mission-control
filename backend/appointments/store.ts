import type { Appointment, CreateAppointment, UpdateAppointment } from "../../api-contract/appointment.schema";
import { createMapRepository } from "../lib/store-adapter";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const now = new Date().toISOString();
const t = today();

const seedItems: Appointment[] = [
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10",
    titulo: "Validar visual do Crédito 3 no sandbox.",
    descricao: "Revisão completa do shell com tokens KRATOS.",
    data: t,
    horario: "09:00",
    tipo: "deep_work",
    status: "in_progress",
    projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00",
    criadoEm: new Date(Date.now() - 86400000).toISOString(),
    atualizadoEm: now,
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    titulo: "Revisar microcopy da /agenda com Mentor.",
    descricao: "Ajustar textos e labels para clareza TDAH.",
    data: t,
    horario: "11:30",
    tipo: "review",
    status: "pending",
    projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00",
    criadoEm: new Date(Date.now() - 86400000).toISOString(),
    atualizadoEm: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
    titulo: "Anotar pontos de adaptação para o Claude Code.",
    descricao: "Documentar decisões de adaptação do framework.",
    data: t,
    horario: "14:00",
    tipo: "admin",
    status: "pending",
    projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00",
    criadoEm: new Date(Date.now() - 86400000).toISOString(),
    atualizadoEm: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
    titulo: "Subir checkpoint visual do dia.",
    descricao: "Salvar estado atual como checkpoint.",
    data: t,
    horario: "18:00",
    tipo: "checkpoint",
    status: "pending",
    projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00",
    criadoEm: new Date(Date.now() - 86400000).toISOString(),
    atualizadoEm: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14",
    titulo: "Aprovar release de OMNIS v2.",
    descricao: "Validar build final antes do deploy.",
    data: t,
    horario: null,
    tipo: "review",
    status: "blocked",
    projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
    criadoEm: new Date(Date.now() - 172800000).toISOString(),
    atualizadoEm: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15",
    titulo: "Documentar tokens KRATOS no README interno.",
    descricao: "Lista completa de tokens com exemplos.",
    data: daysFromNow(-3),
    horario: "10:00",
    tipo: "admin",
    status: "pending",
    projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00",
    criadoEm: new Date(Date.now() - 345600000).toISOString(),
    atualizadoEm: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16",
    titulo: "Revisar política de fallback do ActivityWatch.",
    descricao: "Definir comportamento quando coletor offline.",
    data: daysFromNow(-6),
    horario: "15:00",
    tipo: "review",
    status: "pending",
    projetoId: null,
    criadoEm: new Date(Date.now() - 604800000).toISOString(),
    atualizadoEm: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17",
    titulo: "Entrega Crédito 3 — Agenda + Mentor",
    descricao: "Fechamento completo do módulo de agenda.",
    data: t,
    horario: "16:00",
    tipo: "deep_work",
    status: "pending",
    projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00",
    criadoEm: new Date(Date.now() - 172800000).toISOString(),
    atualizadoEm: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18",
    titulo: "Checkpoint semanal de contexto",
    descricao: "Revisão do que avançou na semana.",
    data: daysFromNow(2),
    horario: "17:00",
    tipo: "checkpoint",
    status: "pending",
    projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00",
    criadoEm: new Date(Date.now() - 86400000).toISOString(),
    atualizadoEm: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19",
    titulo: "Reunião de handoff com Claude Code",
    descricao: "Alinhamento semanal de contexto.",
    data: daysFromNow(1),
    horario: "10:00",
    tipo: "meeting",
    status: "pending",
    projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00",
    criadoEm: new Date(Date.now() - 172800000).toISOString(),
    atualizadoEm: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20",
    titulo: "Fechamento Crédito 4 — Contexto",
    descricao: "Finalizar módulo de contexto pessoal.",
    data: daysFromNow(4),
    horario: "09:00",
    tipo: "deep_work",
    status: "pending",
    projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00",
    criadoEm: new Date(Date.now() - 86400000).toISOString(),
    atualizadoEm: new Date(Date.now() - 86400000).toISOString(),
  },
];

function buildEntity(input: CreateAppointment, id: string, now: string): Appointment {
  return {
    id,
    titulo: input.titulo,
    descricao: input.descricao,
    data: input.data,
    horario: input.horario ?? null,
    tipo: input.tipo ?? "deep_work",
    status: "pending",
    projetoId: input.projetoId ?? null,
    criadoEm: now,
    atualizadoEm: now,
  };
}

const repo = createMapRepository<Appointment, CreateAppointment, UpdateAppointment>(
  seedItems,
  buildEntity,
);

export function getAll(): Appointment[] {
  return repo.getAll().sort(
    (a, b) => a.data.localeCompare(b.data) || (a.horario ?? "").localeCompare(b.horario ?? ""),
  );
}

export const getById = repo.getById;
export const create = repo.create;
export const update = repo.update;
export const remove = repo.remove;
