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
  return useQuery<Project[]>({
    queryKey: projectKeys.all,
    queryFn: () => getProjects(),
    staleTime: 30_000,
  });
}

export function useProject(id: string) {
  return useQuery<Project | null>({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProject({ data: { id } }),
    staleTime: 30_000,
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation<Project, Error, CreateProject>({
    mutationFn: (input) => createProject({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation<
    Project | null,
    Error,
    { id: string; input: UpdateProject }
  >({
    mutationFn: ({ id, input }) =>
      updateProject({ data: { id, ...input } }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: (id) => deleteProject({ data: { id } }),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.removeQueries({ queryKey: projectKeys.detail(id) });
    },
  });
}
