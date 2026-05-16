import { Server } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot } from "@/components/kratos/base/StatusDot";
import type { OmnisServiceStatus } from "../../../../api-contract/omnis.schema";

const STATUS_SEVERITY: Record<OmnisServiceStatus["status"], "ok" | "warn" | "critical"> = {
  healthy: "ok",
  degraded: "warn",
  down: "critical",
};

interface Props {
  service: OmnisServiceStatus;
}

export function OmnisServiceStatusCard({ service }: Props) {
  const severity = STATUS_SEVERITY[service.status];

  return (
    <StatusCard accent="none">
      <div className="flex items-center gap-2.5">
        <Server
          className="h-3.5 w-3.5 shrink-0"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[13px] font-medium flex-1"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {service.nome}
        </span>
        <StatusDot severity={severity} pulse={service.status === "healthy"} />
      </div>
      {(service.porta || service.uptime) && (
        <div className="flex items-center gap-3 mt-1.5 ml-6">
          {service.porta && (
            <span
              className="text-[10px] kratos-mono"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              :{service.porta}
            </span>
          )}
          {service.uptime && (
            <span
              className="text-[10px] kratos-mono"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              up {service.uptime}
            </span>
          )}
        </div>
      )}
    </StatusCard>
  );
}
