/**
 * useTasks.ts — W1-B8
 * Hooks para consumir GET /tasks e variantes.
 *
 * W1 — Tasks Reality: GET /tasks agora retorna SQLite real com envelope
 * { data: Task[], source: "live"|"mock", source_ts: iso }.
 *
 * Exports:
 *  - useTasksToday()  — tarefas do dia (/tasks/today)
 *  - useTasks()       — todas as tarefas (/tasks)
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import {
  TaskEnvelopeSchema,
  envelopeToIslandData,
  type TasksIslandResult,
  type TaskDataSource,
} from "../../api-contract/tasks.schema";
import type { DataSource } from "../../api-contract/source-badge.schema";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Map backend source string to frontend DataSource (source-badge) */
function toDataSource(src: TaskDataSource): DataSource {
  if (src === "live")    return "live";
  if (src === "mock")    return "mock";
  if (src === "cached")  return "cache";
  return "partial";
}

async function fetchTasksToday(): Promise<TasksIslandResult | null> {
  const result = await apiGet("/tasks/today");
  if (!result.ok || result.raw == null) return null;
  const parsed = TaskEnvelopeSchema.safeParse(result.raw);
  if (!parsed.success) throw new Error(`tasks schema mismatch: ${parsed.error.message}`);
  return envelopeToIslandData(parsed.data);
}

async function fetchAllTasks(): Promise<TasksIslandResult | null> {
  const result = await apiGet("/tasks");
  if (!result.ok || result.raw == null) return null;
  const parsed = TaskEnvelopeSchema.safeParse(result.raw);
  if (!parsed.success) throw new Error(`tasks schema mismatch: ${parsed.error.message}`);
  return envelopeToIslandData(parsed.data);
}

// ── useTasksToday ─────────────────────────────────────────────────────────────

export interface UseTasksTodayResult {
  tasks: TasksIslandResult | null;
  /** Frontend DataSource for SourceBadgeIndicator */
  sourceType: DataSource;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useTasksToday(): UseTasksTodayResult {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey:          ["tasks", "today"],
    queryFn:           fetchTasksToday,
    staleTime:         30_000,
    refetchInterval:   60_000, // tarefas de hoje refrescam a cada minuto
    retry:             1,
    refetchOnWindowFocus: false,
  });

  const sourceType = toDataSource(query.data?.source ?? "mock");

  return {
    tasks:      query.data ?? null,
    sourceType,
    isLoading:  query.isLoading,
    isError:    query.isError,
    refetch:    () => void qc.invalidateQueries({ queryKey: ["tasks", "today"] }),
  };
}

// ── useTasks (todas) ──────────────────────────────────────────────────────────

export interface UseTasksResult {
  tasks: TasksIslandResult | null;
  sourceType: DataSource;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useTasks(): UseTasksResult {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey:          ["tasks", "all"],
    queryFn:           fetchAllTasks,
    staleTime:         30_000,
    refetchInterval:   60_000,
    retry:             1,
    refetchOnWindowFocus: false,
  });

  const sourceType = toDataSource(query.data?.source ?? "mock");

  return {
    tasks:      query.data ?? null,
    sourceType,
    isLoading:  query.isLoading,
    isError:    query.isError,
    refetch:    () => void qc.invalidateQueries({ queryKey: ["tasks", "all"] }),
  };
}
