import { createServerFn } from "@tanstack/react-start";
import {
  DashboardSnapshotDataSchema,
  type DashboardSnapshotData,
} from "../../api-contract/dashboard.schema";
import { SourceBadgeMetaSchema, type SourceBadgeMeta } from "../../api-contract/source-badge.schema";
import { createApiError, type ApiError } from "../../api-contract/error-taxonomy";
import { getServicesHealthSummary } from "../../backend/services/store";
import { getRepoStatus, listTrackedRepos } from "../../backend/github/store";
import { getLatest } from "../../backend/contexto/store";
import type { ServiceHealth } from "../../api-contract/service.schema";

interface DashboardSnapshotEnvelope {
  data: DashboardSnapshotData | null;
  error: ApiError | null;
  meta: SourceBadgeMeta;
}

export const getDashboardSnapshot = createServerFn({ method: "GET" })
  .handler(async (): Promise<DashboardSnapshotEnvelope> => {
    const now = new Date().toISOString();
    const meta: SourceBadgeMeta = {
      source: "mock",
      origin: "local",
      stale: false,
      updated_at: now,
      errors: [],
    };

    try {
      // Services
      const svc = getServicesHealthSummary();

      // Repos
      const repoDigests = (await Promise.all(listTrackedRepos().map(async (r) => {
        const gh = await getRepoStatus("lucastigrereal-dev", r);
        if (!gh) return null;
        return {
          nome: gh.nome,
          nomeCompleto: gh.nomeCompleto,
          url: gh.url,
          openPRs: gh.prs.filter((p) => p.status === "open").length,
          openIssues: gh.openIssues,
          ultimoPush: gh.ultimoPush,
        };
      }))).filter(Boolean);

      // Context
      const ctx = getLatest();

      // Overall health
      let health: ServiceHealth = "live";
      if (svc.offline > 0) health = "offline";
      else if (svc.degraded > 0) health = "degraded";
      else if (svc.unknown === svc.total) health = "unknown";

      const payload: DashboardSnapshotData = {
        summary_cards: [
          { label: "Serviços ativos", value: `${svc.live}/${svc.total}`, trend: "stable" },
          { label: "Repositórios", value: `${repoDigests.length}`, detail: "tracked" },
          { label: "Confiança", value: `${ctx.confidence}%`, detail: ctx.project },
          { label: "Foco", value: ctx.focusStatus === "on_focus" ? "Em foco" : "Desviado", trend: ctx.focusStatus === "on_focus" ? "up" : "down" },
        ],
        services: {
          total: svc.total,
          live: svc.live,
          degraded: svc.degraded,
          offline: svc.offline,
          unknown: svc.unknown,
        },
        repos: repoDigests as DashboardSnapshotData["repos"],
        next_actions: [
          { action: ctx.reasons[0] ?? "Definir próximo passo", project: ctx.project, priority: "high" },
        ],
        health,
        updated_at: now,
      };

      const parsed = DashboardSnapshotDataSchema.safeParse(payload);
      if (!parsed.success) {
        meta.errors.push(parsed.error.message);
        meta.stale = true;
        return {
          data: null,
          error: createApiError("validation_error", "Dados do dashboard inválidos", parsed.error.message),
          meta,
        };
      }

      return { data: parsed.data, error: null, meta };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Falha ao gerar snapshot do dashboard";
      meta.errors.push(message);
      meta.stale = true;
      return {
        data: null,
        error: createApiError("internal_error", message),
        meta,
      };
    }
  });
