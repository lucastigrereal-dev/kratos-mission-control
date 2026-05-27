import { useQuery } from "@tanstack/react-query";
import type { MissionEventLog } from "../../api-contract/missions.schema";
import { fetchMissionEventsV1 } from "../lib/missions-server-fns";

export function useMissionEvents(missionId: string | null, limit = 20) {
  const query = useQuery({
    queryKey: ["mission-events", missionId, limit],
    queryFn: async (): Promise<MissionEventLog | null> => {
      if (!missionId) return null;
      const result = await fetchMissionEventsV1({
        data: { missionId, limit },
      });
      return result.data ?? null;
    },
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
