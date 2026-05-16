/**
 * P2-2 — Map-based repository factory.
 * Wraps a Map<string, T> with the standard Repository<T, C, U> interface.
 *
 * This formalizes what all 3 CRUD stores already do ad-hoc.
 * When D1 is activated, a D1Repository implementation replaces this
 * without changing any server function or hook code.
 */

import type { Repository } from "./types";

export function createMapRepository<
  T extends { id: string; criadoEm: string; atualizadoEm: string },
  C,
  U,
>(
  seedItems: T[],
  buildEntity: (input: C, id: string, now: string) => T,
): Repository<T, C, U> {
  const store = new Map<string, T>();

  for (const item of seedItems) {
    store.set(item.id, item);
  }

  return {
    getAll(): T[] {
      return [...store.values()];
    },

    getById(id: string): T | undefined {
      return store.get(id);
    },

    create(input: C): T {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const entity = buildEntity(input, id, now);
      store.set(id, entity);
      return entity;
    },

    update(id: string, input: U): T | undefined {
      const existing = store.get(id);
      if (!existing) return undefined;
      const updated: T = {
        ...existing,
        ...(input as object),
        id: existing.id,
        criadoEm: existing.criadoEm,
        atualizadoEm: new Date().toISOString(),
      };
      store.set(id, updated);
      return updated;
    },

    remove(id: string): boolean {
      return store.delete(id);
    },
  };
}
