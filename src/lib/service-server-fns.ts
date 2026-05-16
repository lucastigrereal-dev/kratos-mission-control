import { createServerFn } from "@tanstack/react-start";
import { ServiceSchema, type Service } from "../../api-contract/service.schema";
import { getServices } from "../../backend/services/store";

export const getServicesHealth = createServerFn({ method: "GET" })
  .handler(async (): Promise<{ data: Service[] | null; error: string | null }> => {
    try {
      const services = getServices();
      const parsed = ServiceSchema.array().safeParse(services);
      if (!parsed.success) {
        return { data: null, error: parsed.error.message };
      }
      return { data: parsed.data, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao obter saúde dos serviços" };
    }
  });
