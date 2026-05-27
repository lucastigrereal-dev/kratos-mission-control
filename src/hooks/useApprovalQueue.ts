import { useQuery } from "@tanstack/react-query";
import {
  ContentDraftsEnvelopeSchema,
  type CaptionDraft,
  type ContentDraftsEnvelope,
} from "../../api-contract/content-drafts.schema";

const BASE_URL =
  typeof window !== "undefined"
    ? (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5100")
    : "http://localhost:5100";

async function fetchApprovalQueue(
  status = "needs_review",
  limit = 20,
): Promise<ContentDraftsEnvelope> {
  const empty: ContentDraftsEnvelope = {
    data: [],
    total_filtered: 0,
    por_status: {},
    source: "empty",
  };
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    if (status) params.set("status", status);
    const res = await fetch(`${BASE_URL}/content/drafts?${params}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return empty;
    const raw: unknown = await res.json();
    const parsed = ContentDraftsEnvelopeSchema.safeParse(raw);
    if (!parsed.success) return empty;
    return parsed.data;
  } catch {
    return empty;
  }
}

export function useApprovalQueue(limit = 20) {
  const query = useQuery({
    queryKey: ["approval-queue", limit],
    queryFn: () => fetchApprovalQueue("needs_review", limit),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });

  const envelope = query.data;

  return {
    drafts: (envelope?.data ?? []) as CaptionDraft[],
    porStatus: envelope?.por_status ?? {},
    totalFiltered: envelope?.total_filtered ?? 0,
    source: envelope?.source ?? "empty",
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
