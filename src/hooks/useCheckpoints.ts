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
  return useQuery<Checkpoint[]>({
    queryKey: checkpointKeys.all,
    queryFn: () => getCheckpoints(),
    staleTime: 30_000,
  });
}

export function useCheckpoint(id: string) {
  return useQuery<Checkpoint | null>({
    queryKey: checkpointKeys.detail(id),
    queryFn: () => getCheckpoint({ data: { id } }),
    staleTime: 30_000,
    enabled: !!id,
  });
}

export function useCreateCheckpoint() {
  const queryClient = useQueryClient();

  return useMutation<Checkpoint, Error, CreateCheckpoint>({
    mutationFn: (input) => createCheckpoint({ data: input }),
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
    mutationFn: ({ id, input }) =>
      updateCheckpoint({ data: { id, ...input } }),
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
    mutationFn: (id) => deleteCheckpoint({ data: { id } }),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: checkpointKeys.all });
      queryClient.removeQueries({ queryKey: checkpointKeys.detail(id) });
    },
  });
}
