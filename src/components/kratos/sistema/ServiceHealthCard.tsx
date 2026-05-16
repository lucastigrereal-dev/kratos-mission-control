import { Server, ExternalLink } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot, type Severity } from "@/components/kratos/base/StatusDot";
import type { Service, ServiceHealth } from "../../../../api-contract/service.schema";

const HEALTH_SEVERITY: Record<ServiceHealth, Severity> = {
  live: "ok",
  degraded: "warn",
  offline: "critical",
  unknown: "muted",
};

const HEALTH_LABEL: Record<ServiceHealth, string> = {
  live: "LIVE",
  degraded: "DEGRADADO",
  offline: "OFFLINE",
  unknown: "DESCONHECIDO",
};

export function ServiceHealthCard({ nome, descricao, url, health, versao }: Service) {
  return (
    <StatusCard accent="none" className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Server
            className="h-3.5 w-3.5"
            style={{ color: "var(--kratos-text-muted)" }}
          />
          <span
            className="text-[13px] font-medium"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            {nome}
          </span>
        </div>
        <StatusDot severity={HEALTH_SEVERITY[health]} pulse={health === "live"} />
      </div>
      <p
        className="text-[11px] leading-relaxed mb-2"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        {descricao}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.12em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          {HEALTH_LABEL[health]}
          {versao ? ` · v${versao}` : ""}
        </span>
        {url && (
          <span
            className="text-[10px] kratos-mono flex items-center gap-1"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            <ExternalLink className="h-3 w-3" />
            {url}
          </span>
        )}
      </div>
    </StatusCard>
  );
}
