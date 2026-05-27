import { useQuery } from "@tanstack/react-query";
import {
  MissionEventLogSchema,
  type MissionEventLog,
} from "../../api-contract/missions.schema";
import { apiGet } from "../lib/api/client";

async function fetchMissionEvents(
  missionId: string,
  limit = 20,
): Promise<MissionEventLog | null> {
  const result = await apiGet(`/missions/${missionId}/events?limit=${limit}`);
  if (!result.ok) return null;
  const parsed = MissionEventLogSchema.safeParse(result.raw);
  if (!parsed.success) return null;
  return parsed.data;
}

export function useMissionEvents(missionId: string | null, limit = 20) {
  const query = useQuery({
    queryKey: ["mission-events", missionId, limit],
    queryFn: () =>
      missionId ? fetchMissionEvents(missionId, limit) : Promise.resolve(null),
    enabled: Boolean(missionId),
    staleTime: 15_000,
    refetchInterval: 30_000,
    retry: 1,
  });

  return {
    eventLog: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
