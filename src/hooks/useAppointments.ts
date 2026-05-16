import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "@/lib/appointment-server-fns";
import type {
  Appointment,
  CreateAppointment,
  UpdateAppointment,
} from "../../api-contract/appointment.schema";

const appointmentKeys = {
  all: ["appointments"] as const,
  detail: (id: string) => ["appointments", id] as const,
};

export function useAppointments() {
  return useQuery<Appointment[], Error>({
    queryKey: appointmentKeys.all,
    queryFn: async () => {
      const result = await getAppointments();
      if (result.error) throw new Error(result.error);
      return result.data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useAppointment(id: string) {
  return useQuery<Appointment | null, Error>({
    queryKey: appointmentKeys.detail(id),
    queryFn: async () => {
      const result = await getAppointment({ data: { id } });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 30_000,
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation<Appointment, Error, CreateAppointment>({
    mutationFn: async (input) => {
      const result = await createAppointment({ data: input });
      if (result.error || !result.data) throw new Error(result.error ?? "Falha ao criar compromisso");
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation<
    Appointment | null,
    Error,
    { id: string; input: UpdateAppointment }
  >({
    mutationFn: async ({ id, input }) => {
      const result = await updateAppointment({ data: { id, ...input } });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (id) => {
      const result = await deleteAppointment({ data: { id } });
      if (result.error) throw new Error(result.error);
      return result.data ?? false;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      queryClient.removeQueries({ queryKey: appointmentKeys.detail(id) });
    },
  });
}
