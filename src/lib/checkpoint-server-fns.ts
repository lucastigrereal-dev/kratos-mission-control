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

export const getCheckpoints = createServerFn({ method: "GET" }).handler(
  async (): Promise<Checkpoint[]> => {
    return getAll();
  },
);

export const getCheckpoint = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data: { id: string } }): Promise<Checkpoint | null> => {
    return getById(data.id) ?? null;
  },
);

export const createCheckpoint = createServerFn({ method: "POST" })
  .inputValidator(CreateCheckpointSchema)
  .handler(
    async ({ data }: { data: CreateCheckpoint }): Promise<Checkpoint> => {
      return storeCreate(data);
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
    }): Promise<Checkpoint | null> => {
      const { id, ...input } = data;
      return storeUpdate(id, input) ?? null;
    },
  );

export const deleteCheckpoint = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }): Promise<boolean> => {
    return storeRemove(data.id);
  },
);
