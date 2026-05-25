import { useQuery } from "@tanstack/react-query";
import { fetchAkashaStatus, type AkashaStatusData } from "@/lib/akasha-server-fns";

export function useAkashaStatus() {
  return useQuery<AkashaStatusData | null, Error>({
    queryKey: ["akasha", "status"],
    queryFn: async () => {
      const result = await fetchAkashaStatus();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 60_000,
    retry: false,
  });
}
