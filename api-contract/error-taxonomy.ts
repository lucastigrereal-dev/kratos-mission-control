import { z } from "zod";

/**
 * KRATOS API Error Taxonomy
 * Standardizes error codes across all server functions.
 */
export const ApiErrorCodeSchema = z.enum([
  "missing_config",       // Required env var or config absent
  "external_unavailable", // GitHub/OMNIS/Akasha offline
  "stale_data",           // Data older than acceptable threshold
  "validation_error",     // Zod schema validation failed
  "forbidden_action",     // OMNIS execution attempt, write to read-only resource
  "internal_error",       // Unexpected error in store or handler
  "not_found",            // Resource not found (null return)
  "rate_limited",         // External API rate limit hit
]);

export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>;

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  detail?: string;
}

/**
 * Create a typed API error.
 */
export function createApiError(code: ApiErrorCode, message: string, detail?: string): ApiError {
  return { code, message, detail };
}

/**
 * Standard error messages by code.
 */
export const API_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  missing_config: "Configuração necessária ausente",
  external_unavailable: "Serviço externo indisponível",
  stale_data: "Dados desatualizados",
  validation_error: "Erro de validação",
  forbidden_action: "Ação não permitida",
  internal_error: "Erro interno",
  not_found: "Recurso não encontrado",
  rate_limited: "Limite de requisições atingido",
};
