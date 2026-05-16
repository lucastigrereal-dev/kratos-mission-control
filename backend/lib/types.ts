/**
 * P2-1 — Shared types for the KRATOS storage layer.
 * Used by both in-memory Map stores (current) and future D1 adapters.
 */

/** Standardized API response envelope — matches the Hono/Cloudflare Worker contract. */
export interface ApiEnvelope<T> {
  data: T | null;
  error: string | null;
}

/** Create a success envelope. */
export function success<T>(data: T): ApiEnvelope<T> {
  return { data, error: null };
}

/** Create a failure envelope. */
export function failure(error: string): ApiEnvelope<null> {
  return { data: null, error };
}

/**
 * Repository interface for entity storage.
 * T = full entity (read model), C = create input, U = update input.
 * All current Map stores and future D1 adapters implement this contract.
 */
export interface Repository<T, C, U> {
  getAll(): T[];
  getById(id: string): T | undefined;
  create(input: C): T;
  update(id: string, input: U): T | undefined;
  remove(id: string): boolean;
}
