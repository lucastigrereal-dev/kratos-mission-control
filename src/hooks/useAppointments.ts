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
  return useMutation<Appointment, Error, CreateAppointment, { previous: Appointment[] | undefined }>({
    mutationFn: async (input) => {
      const result = await createAppointment({ data: input });
      if (result.error || !result.data) throw new Error(result.error ?? "Falha ao criar compromisso");
      return result.data;
    },
    // W5-B3: Optimistic insert — appointment appears immediately in agenda
    onMutate: async (newAppt) => {
      await queryClient.cancelQueries({ queryKey: appointmentKeys.all });
      const previous = queryClient.getQueryData<Appointment[]>(appointmentKeys.all);
      const now = new Date().toISOString();
      const optimistic: Appointment = {
        id: crypto.randomUUID(),
        titulo: newAppt.titulo,
        descricao: newAppt.descricao,
        data: newAppt.data,
        horario: newAppt.horario ?? null,
        tipo: newAppt.tipo ?? "meeting",
        status: "pending",
        projetoId: newAppt.projetoId ?? null,
        criadoEm: now,
        atualizadoEm: now,
      };
      queryClient.setQueryData<Appointment[]>(
        appointmentKeys.all,
        (old) => [...(old ?? []), optimistic],
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(appointmentKeys.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation<
    Appointment | null,
    Error,
    { id: string; input: UpdateAppointment },
    { previous: Appointment[] | undefined }
  >({
    mutationFn: async ({ id, input }) => {
      const result = await updateAppointment({ data: { id, ...input } });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    // W5-B3: Optimistic patch — status/title changes reflect immediately
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: appointmentKeys.all });
      const previous = queryClient.getQueryData<Appointment[]>(appointmentKeys.all);
      queryClient.setQueryData<Appointment[]>(appointmentKeys.all, (old) =>
        (old ?? []).map((a) =>
          a.id === id
            ? { ...a, ...input, atualizadoEm: new Date().toISOString() }
            : a,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(appointmentKeys.all, context.previous);
      }
    },
    onSettled: (_data, _err, variables) => {
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
