import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import {
  CreateCheckpointSchema,
  UpdateCheckpointSchema,
  type Checkpoint,
  type CreateCheckpoint,
  type UpdateCheckpoint,
} from "../../api-contract/checkpoint.schema";
import {
  getAll,
  getById,
  create as storeCreate,
  update as storeUpdate,
  remove as storeRemove,
} from "../../backend/checkpoints/store";

type Envelope<T> = { data: T | null; error: string | null };

export const getCheckpoints = createServerFn({ method: "GET" }).handler(
  async (): Promise<Envelope<Checkpoint[]>> => {
    try {
      return { data: getAll(), error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao listar checkpoints" };
    }
  },
);

export const getCheckpoint = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data: { id: string } }): Promise<Envelope<Checkpoint>> => {
    try {
      return { data: getById(data.id) ?? null, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao buscar checkpoint" };
    }
  },
);

export const createCheckpoint = createServerFn({ method: "POST" })
  .inputValidator(CreateCheckpointSchema)
  .handler(
    async ({ data }: { data: CreateCheckpoint }): Promise<Envelope<Checkpoint>> => {
      try {
        return { data: storeCreate(data), error: null };
      } catch (e) {
        return { data: null, error: e instanceof Error ? e.message : "Falha ao criar checkpoint" };
      }
    },
  );

export const updateCheckpoint = createServerFn({ method: "POST" })
  .inputValidator(
    UpdateCheckpointSchema.extend({ id: z.string().uuid() }),
  )
  .handler(
    async ({
      data,
    }: {
      data: UpdateCheckpoint & { id: string };
    }): Promise<Envelope<Checkpoint>> => {
      try {
        const { id, ...input } = data;
        return { data: storeUpdate(id, input) ?? null, error: null };
      } catch (e) {
        return { data: null, error: e instanceof Error ? e.message : "Falha ao atualizar checkpoint" };
      }
    },
  );

export const deleteCheckpoint = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }): Promise<Envelope<boolean>> => {
    try {
      return { data: storeRemove(data.id), error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao deletar checkpoint" };
    }
  },
);
