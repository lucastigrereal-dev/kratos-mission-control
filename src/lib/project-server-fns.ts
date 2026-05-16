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

export const getProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<Project[]> => {
    return getAll();
  }
);

export const getProject = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data: { id: string } }): Promise<Project | null> => {
    return getById(data.id) ?? null;
  }
);

export const createProject = createServerFn({ method: "POST" })
  .inputValidator(CreateProjectSchema)
  .handler(
    async ({ data }: { data: CreateProject }): Promise<Project> => {
      return storeCreate(data);
    }
  );

export const updateProject = createServerFn({ method: "POST" })
  .inputValidator(UpdateProjectSchema.extend({ id: z.string().uuid() }))
  .handler(
    async ({
      data,
    }: {
      data: UpdateProject & { id: string };
    }): Promise<Project | null> => {
      const { id, ...input } = data;
      return storeUpdate(id, input) ?? null;
    }
  );

export const deleteProject = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }): Promise<boolean> => {
    return storeRemove(data.id);
  }
);
