import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCheckpoints,
  getCheckpoint,
  createCheckpoint,
  updateCheckpoint,
  deleteCheckpoint,
} from "@/lib/checkpoint-server-fns";
import type {
  Checkpoint,
  CreateCheckpoint,
  UpdateCheckpoint,
} from "../../api-contract/checkpoint.schema";

const checkpointKeys = {
  all: ["checkpoints"] as const,
  detail: (id: string) => ["checkpoints", id] as const,
};

export function useCheckpoints() {
  return useQuery<Checkpoint[], Error>({
    queryKey: checkpointKeys.all,
    queryFn: async () => {
      const result = await getCheckpoints();
      if (result.error) throw new Error(result.error);
      return result.data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useCheckpoint(id: string) {
  return useQuery<Checkpoint | null, Error>({
    queryKey: checkpointKeys.detail(id),
    queryFn: async () => {
      const result = await getCheckpoint({ data: { id } });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 30_000,
    enabled: !!id,
  });
}

export function useCreateCheckpoint() {
  const queryClient = useQueryClient();

  return useMutation<Checkpoint, Error, CreateCheckpoint>({
    mutationFn: async (input) => {
      const result = await createCheckpoint({ data: input });
      if (result.error || !result.data) throw new Error(result.error ?? "Falha ao criar checkpoint");
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checkpointKeys.all });
    },
  });
}

export function useUpdateCheckpoint() {
  const queryClient = useQueryClient();

  return useMutation<
    Checkpoint | null,
    Error,
    { id: string; input: UpdateCheckpoint }
  >({
    mutationFn: async ({ id, input }) => {
      const result = await updateCheckpoint({ data: { id, ...input } });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: checkpointKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: checkpointKeys.all });
    },
  });
}

export function useDeleteCheckpoint() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (id) => {
      const result = await deleteCheckpoint({ data: { id } });
      if (result.error) throw new Error(result.error);
      return result.data ?? false;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: checkpointKeys.all });
      queryClient.removeQueries({ queryKey: checkpointKeys.detail(id) });
    },
  });
}

// --- Checkpoints pausados + resume ---

const PAUSED_STATUSES = ["pending", "in_progress"] as const;

export interface PausedCheckpoint {
  id: string;
  titulo: string;
  descricao?: string;
  projetoId: string | null;
  progresso: number;
  atualizadoEm: string;
}

export function usePausedCheckpoints() {
  return useQuery<PausedCheckpoint[], Error>({
    queryKey: ["checkpoints", "paused"],
    queryFn: async () => {
      const result = await getCheckpoints();
      if (result.error) throw new Error(result.error);
      const all = result.data ?? [];
      return all
        .filter((c) => (PAUSED_STATUSES as readonly string[]).includes(c.status))
        .slice(0, 5)
        .map((c) => ({
          id: c.id,
          titulo: c.titulo,
          descricao: c.descricao,
          projetoId: c.projetoId,
          progresso: c.progresso,
          atualizadoEm: c.atualizadoEm,
        }));
    },
    staleTime: 30_000,
  });
}

export function useResumeCheckpoint() {
  const queryClient = useQueryClient();

  return useMutation<Checkpoint | null, Error, string>({
    mutationFn: async (id: string) => {
      const result = await updateCheckpoint({
        data: { id, status: "in_progress" },
      });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checkpointKeys.all });
      queryClient.invalidateQueries({ queryKey: ["checkpoints", "paused"] });
    },
  });
}
