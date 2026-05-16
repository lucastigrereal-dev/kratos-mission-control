import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, type ApiEnvelope } from "./useApi";
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
  return useQuery<ApiEnvelope<Checkpoint[]>>({
    queryKey: checkpointKeys.all,
    queryFn: () => apiFetch<Checkpoint[]>("/api/checkpoints"),
    staleTime: 30_000,
    select: (envelope) => envelope,
  });
}

export function useCheckpoint(id: string) {
  return useQuery<ApiEnvelope<Checkpoint>>({
    queryKey: checkpointKeys.detail(id),
    queryFn: () => apiFetch<Checkpoint>(`/api/checkpoints/${id}`),
    staleTime: 30_000,
    enabled: !!id,
    select: (envelope) => envelope,
  });
}

export function useCreateCheckpoint() {
  const queryClient = useQueryClient();

  return useMutation<ApiEnvelope<Checkpoint>, Error, CreateCheckpoint>({
    mutationFn: (input) =>
      apiFetch<Checkpoint>("/api/checkpoints", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checkpointKeys.all });
    },
  });
}

export function useUpdateCheckpoint() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiEnvelope<Checkpoint>,
    Error,
    { id: string; input: UpdateCheckpoint }
  >({
    mutationFn: ({ id, input }) =>
      apiFetch<Checkpoint>(`/api/checkpoints/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
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

  return useMutation<ApiEnvelope<null>, Error, string>({
    mutationFn: (id) =>
      apiFetch<null>(`/api/checkpoints/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: checkpointKeys.all });
      queryClient.removeQueries({ queryKey: checkpointKeys.detail(id) });
    },
  });
}
