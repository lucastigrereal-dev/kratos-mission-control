import type {
  Checkpoint,
  CreateCheckpoint,
  UpdateCheckpoint,
} from "../../api-contract/checkpoint.schema";

const store = new Map<string, Checkpoint>();

function seed(): void {
  const now = new Date().toISOString();
  const items: Checkpoint[] = [
    {
      id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      projetoId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00",
      titulo: "Plano do Crédito 4 aprovado",
      descricao: "Validação do sandbox concluída antes do build de /contexto",
      progresso: 60,
      status: "in_progress",
      deadline: null,
      criadoEm: now,
      atualizadoEm: now,
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

  for (const item of items) {
    store.set(item.id, item);
  }
}

seed();

export function getAll(): Checkpoint[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime(),
  );
}

export function getById(id: string): Checkpoint | undefined {
  return store.get(id);
}

export function create(input: CreateCheckpoint): Checkpoint {
  const now = new Date().toISOString();
  const checkpoint: Checkpoint = {
    id: crypto.randomUUID(),
    projetoId: input.projetoId ?? null,
    titulo: input.titulo,
    descricao: input.descricao,
    progresso: 0,
    status: "pending",
    deadline: input.deadline ?? null,
    criadoEm: now,
    atualizadoEm: now,
  };
  store.set(checkpoint.id, checkpoint);
  return checkpoint;
}

export function update(
  id: string,
  input: UpdateCheckpoint,
): Checkpoint | undefined {
  const existing = store.get(id);
  if (!existing) return undefined;

  const updated: Checkpoint = {
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
