import { useQuery } from "@tanstack/react-query";
import {
  ContentDraftsEnvelopeSchema,
  type CaptionDraft,
  type ContentDraftsEnvelope,
} from "../../api-contract/content-drafts.schema";
import { apiGet } from "../lib/api/client";

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
  const params = new URLSearchParams({ limit: String(limit) });
  if (status) params.set("status", status);
  const result = await apiGet(`/content/drafts?${params}`);
  if (!result.ok) return empty;
  const parsed = ContentDraftsEnvelopeSchema.safeParse(result.raw);
  if (!parsed.success) return empty;
  return parsed.data;
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
