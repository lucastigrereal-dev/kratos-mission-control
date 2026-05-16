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
  return useQuery<Appointment[]>({
    queryKey: appointmentKeys.all,
    queryFn: () => getAppointments(),
    staleTime: 30_000,
  });
}

export function useAppointment(id: string) {
  return useQuery<Appointment | null>({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => getAppointment({ data: { id } }),
    staleTime: 30_000,
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation<Appointment, Error, CreateAppointment>({
    mutationFn: (input) => createAppointment({ data: input }),
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
    mutationFn: ({ id, input }) =>
      updateAppointment({ data: { id, ...input } }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: (id) => deleteAppointment({ data: { id } }),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      queryClient.removeQueries({ queryKey: appointmentKeys.detail(id) });
    },
  });
}
