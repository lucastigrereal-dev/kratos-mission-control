/**
 * Pure health utility functions.
 * Extracted for testability — no React, no hooks.
 */

export type HealthSeverity = "ok" | "warn" | "critical" | "muted";
export type LiveState = "live" | "degraded" | "offline";

export function serviceHealthToSeverity(status: string): HealthSeverity {
  if (status === "healthy" || status === "up" || status === "ok" || status === "live") return "ok";
  if (status === "degraded") return "warn";
  if (status === "down" || status === "failed" || status === "offline") return "critical";
  return "muted";
}

export function deriveLiveState(
  krOk: number,
  krWarn: number,
  krCrit: number,
  omOk: number,
  omWarn: number,
  omCrit: number,
): LiveState {
  const totalCrit = krCrit + omCrit;
  const totalWarn = krWarn + omWarn;
  if (totalCrit > 0) return "degraded";
  if (totalWarn > 0) return "degraded";
  if (krOk > 0 || omOk > 0) return "live";
  return "offline";
}
