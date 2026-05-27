import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/project-server-fns";
import type {
  Project,
  CreateProject,
  UpdateProject,
} from "../../api-contract/project.schema";

const projectKeys = {
  all: ["projects"] as const,
  detail: (id: string) => ["projects", id] as const,
};

export function useProjects() {
  return useQuery<Project[], Error>({
    queryKey: projectKeys.all,
    queryFn: async () => {
      const result = await getProjects();
      if (result.error) throw new Error(result.error);
      return result.data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useProject(id: string) {
  return useQuery<Project | null, Error>({
    queryKey: projectKeys.detail(id),
    queryFn: async () => {
      const result = await getProject({ data: { id } });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 30_000,
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation<Project, Error, CreateProject, { previous: Project[] | undefined }>({
    mutationFn: async (input) => {
      const result = await createProject({ data: input });
      if (result.error || !result.data) throw new Error(result.error ?? "Falha ao criar projeto");
      return result.data;
    },
    // W5-B3: Optimistic insert
    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.all });
      const previous = queryClient.getQueryData<Project[]>(projectKeys.all);
      const now = new Date().toISOString();
      const optimistic: Project = {
        id: crypto.randomUUID(),
        nome: newProject.nome,
        descricao: newProject.descricao,
        status: "active",
        repo: newProject.repo ?? null,
        prioridade: newProject.prioridade ?? 3,
        ultimaAtividade: now,
        criadoEm: now,
        atualizadoEm: now,
      };
      queryClient.setQueryData<Project[]>(
        projectKeys.all,
        (old) => [...(old ?? []), optimistic],
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(projectKeys.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation<
    Project | null,
    Error,
    { id: string; input: UpdateProject },
    { previous: Project[] | undefined }
  >({
    mutationFn: async ({ id, input }) => {
      const result = await updateProject({ data: { id, ...input } });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    // W5-B3: Optimistic patch
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.all });
      const previous = queryClient.getQueryData<Project[]>(projectKeys.all);
      queryClient.setQueryData<Project[]>(projectKeys.all, (old) =>
        (old ?? []).map((p) =>
          p.id === id
            ? { ...p, ...input, atualizadoEm: new Date().toISOString() }
            : p,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(projectKeys.all, context.previous);
      }
    },
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (id) => {
      const result = await deleteProject({ data: { id } });
      if (result.error) throw new Error(result.error);
      return result.data ?? false;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.removeQueries({ queryKey: projectKeys.detail(id) });
    },
  });
}
