import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import {
  CreateAppointmentSchema,
  UpdateAppointmentSchema,
  type Appointment,
  type CreateAppointment,
  type UpdateAppointment,
} from "../../api-contract/appointment.schema";
import {
  getAll,
  getById,
  create as storeCreate,
  update as storeUpdate,
  remove as storeRemove,
} from "../../backend/appointments/store";

type Envelope<T> = { data: T | null; error: string | null };

export const getAppointments = createServerFn({ method: "GET" }).handler(
  async (): Promise<Envelope<Appointment[]>> => {
    try {
      return { data: getAll(), error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao listar compromissos" };
    }
  },
);

export const getAppointment = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<Envelope<Appointment>> => {
    try {
      return { data: getById(data.id) ?? null, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao buscar compromisso" };
    }
  });

export const createAppointment = createServerFn({ method: "POST" })
  .inputValidator(CreateAppointmentSchema)
  .handler(
    async ({ data }: { data: CreateAppointment }): Promise<Envelope<Appointment>> => {
      try {
        return { data: storeCreate(data), error: null };
      } catch (e) {
        return { data: null, error: e instanceof Error ? e.message : "Falha ao criar compromisso" };
      }
    },
  );

export const updateAppointment = createServerFn({ method: "POST" })
  .inputValidator(UpdateAppointmentSchema.extend({ id: z.string().uuid() }))
  .handler(
    async ({
      data,
    }: {
      data: UpdateAppointment & { id: string };
    }): Promise<Envelope<Appointment>> => {
      try {
        const { id, ...input } = data;
        return { data: storeUpdate(id, input) ?? null, error: null };
      } catch (e) {
        return { data: null, error: e instanceof Error ? e.message : "Falha ao atualizar compromisso" };
      }
    },
  );

export const deleteAppointment = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<Envelope<boolean>> => {
    try {
      return { data: storeRemove(data.id), error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao deletar compromisso" };
    }
  });
