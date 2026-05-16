import { z } from "zod";

export const AppointmentTypeSchema = z.enum([
  "deep_work",
  "meeting",
  "review",
  "admin",
  "checkpoint",
]);

export const AppointmentStatusSchema = z.enum([
  "pending",
  "in_progress",
  "completed",
  "blocked",
]);

export const AppointmentSchema = z.object({
  id: z.string().uuid(),
  titulo: z.string().min(1).max(200),
  descricao: z.string().max(1000).optional(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  horario: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  tipo: AppointmentTypeSchema,
  status: AppointmentStatusSchema,
  projetoId: z.string().uuid().nullable(),
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
});

export const CreateAppointmentSchema = z.object({
  titulo: z.string().min(1).max(200),
  descricao: z.string().max(1000).optional(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  horario: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  tipo: AppointmentTypeSchema.optional(),
  projetoId: z.string().uuid().nullable().optional(),
});

export const UpdateAppointmentSchema = z.object({
  titulo: z.string().min(1).max(200).optional(),
  descricao: z.string().max(1000).optional(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  horario: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  tipo: AppointmentTypeSchema.optional(),
  status: AppointmentStatusSchema.optional(),
  projetoId: z.string().uuid().nullable().optional(),
});

export type AppointmentType = z.infer<typeof AppointmentTypeSchema>;
export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;
export type Appointment = z.infer<typeof AppointmentSchema>;
export type CreateAppointment = z.infer<typeof CreateAppointmentSchema>;
export type UpdateAppointment = z.infer<typeof UpdateAppointmentSchema>;
