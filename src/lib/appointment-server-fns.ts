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

export const getAppointments = createServerFn({ method: "GET" }).handler(
  async (): Promise<Appointment[]> => {
    return getAll();
  }
);

export const getAppointment = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data: { id: string } }): Promise<Appointment | null> => {
    return getById(data.id) ?? null;
  }
);

export const createAppointment = createServerFn({ method: "POST" })
  .inputValidator(CreateAppointmentSchema)
  .handler(
    async ({ data }: { data: CreateAppointment }): Promise<Appointment> => {
      return storeCreate(data);
    }
  );

export const updateAppointment = createServerFn({ method: "POST" })
  .inputValidator(UpdateAppointmentSchema.extend({ id: z.string().uuid() }))
  .handler(
    async ({
      data,
    }: {
      data: UpdateAppointment & { id: string };
    }): Promise<Appointment | null> => {
      const { id, ...input } = data;
      return storeUpdate(id, input) ?? null;
    }
  );

export const deleteAppointment = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }): Promise<boolean> => {
    return storeRemove(data.id);
  }
);
