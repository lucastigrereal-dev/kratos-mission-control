import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  type Project,
  type CreateProject,
  type UpdateProject,
} from "../../api-contract/project.schema";
import {
  getAll,
  getById,
  create as storeCreate,
  update as storeUpdate,
  remove as storeRemove,
} from "../../backend/projects/store";

type Envelope<T> = { data: T | null; error: string | null };

export const getProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<Envelope<Project[]>> => {
    try {
      return { data: getAll(), error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao listar projetos" };
    }
  },
);

export const getProject = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<Envelope<Project>> => {
    try {
      return { data: getById(data.id) ?? null, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao buscar projeto" };
    }
  });

export const createProject = createServerFn({ method: "POST" })
  .inputValidator(CreateProjectSchema)
  .handler(
    async ({ data }: { data: CreateProject }): Promise<Envelope<Project>> => {
      try {
        return { data: storeCreate(data), error: null };
      } catch (e) {
        return { data: null, error: e instanceof Error ? e.message : "Falha ao criar projeto" };
      }
    },
  );

export const updateProject = createServerFn({ method: "POST" })
  .inputValidator(UpdateProjectSchema.extend({ id: z.string().uuid() }))
  .handler(
    async ({
      data,
    }: {
      data: UpdateProject & { id: string };
    }): Promise<Envelope<Project>> => {
      try {
        const { id, ...input } = data;
        return { data: storeUpdate(id, input) ?? null, error: null };
      } catch (e) {
        return { data: null, error: e instanceof Error ? e.message : "Falha ao atualizar projeto" };
      }
    },
  );

export const deleteProject = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<Envelope<boolean>> => {
    try {
      return { data: storeRemove(data.id), error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao deletar projeto" };
    }
  });
