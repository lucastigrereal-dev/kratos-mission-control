import type { OmnisStatus, OmnisCrew, OmnisJob } from "../../api-contract/omnis.schema";
import type { ApiError } from "../../api-contract/error-taxonomy";
import { createApiError } from "../../api-contract/error-taxonomy";
import {
  getOmnisStatus,
  getOmnisServiceHealth,
  getOmnisCrewStatus,
  getOmnisRecentJobs,
} from "../../backend/omnis/store";

// Config detection — never reads .env, only checks globalThis
export interface OmnisProviderConfig {
  configured: boolean;
  baseUrlEnvName: string;
  checkedAt: string;
}

export function checkOmnisConfig(): OmnisProviderConfig {
  const url = (globalThis as Record<string, unknown>).OMNIS_BASE_URL as string | undefined;
  return {
    configured: typeof url === "string" && url.length > 0,
    baseUrlEnvName: "OMNIS_BASE_URL",
    checkedAt: new Date().toISOString(),
  };
}

export interface OmnisProviderResult<T> {
  data: T | null;
  error: ApiError | null;
}

// All operations are READ-ONLY — no job execution, no commands

export function fetchOmnisStatus(): OmnisProviderResult<OmnisStatus> {
  try {
    return { data: getOmnisStatus(), error: null };
  } catch (e) {
    return {
      data: null,
      error: createApiError(
        "external_unavailable",
        "OMNIS indisponível",
        e instanceof Error ? e.message : undefined,
      ),
    };
  }
}

export function fetchOmnisHealth(): OmnisProviderResult<{ healthy: number; degraded: number; down: number }> {
  try {
    return { data: getOmnisServiceHealth(), error: null };
  } catch (e) {
    return {
      data: null,
      error: createApiError(
        "external_unavailable",
        "OMNIS health check indisponível",
        e instanceof Error ? e.message : undefined,
      ),
    };
  }
}

export function fetchOmnisCrews(): OmnisProviderResult<OmnisCrew[]> {
  try {
    return { data: getOmnisCrewStatus(), error: null };
  } catch (e) {
    return {
      data: null,
      error: createApiError(
        "external_unavailable",
        "OMNIS crews indisponíveis",
        e instanceof Error ? e.message : undefined,
      ),
    };
  }
}

export function fetchOmnisJobs(limit = 5): OmnisProviderResult<OmnisJob[]> {
  try {
    return { data: getOmnisRecentJobs(limit), error: null };
  } catch (e) {
    return {
      data: null,
      error: createApiError(
        "external_unavailable",
        "OMNIS jobs indisponíveis",
        e instanceof Error ? e.message : undefined,
      ),
    };
  }
}

// Safety: these are the ONLY exports — no executeJob, no runCrew, no commands
// OMNIS_BASE_URL is used only as config detection — KRATOS never calls OMNIS directly
// If OMNIS is not configured, the existing store returns mock data as fallback
