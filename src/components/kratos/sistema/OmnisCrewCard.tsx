import { Users } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot } from "@/components/kratos/base/StatusDot";
import type { OmnisCrew } from "../../../../api-contract/omnis.schema";

const CREW_SEVERITY: Record<OmnisCrew["status"], "ok" | "warn" | "critical"> = {
  idle: "ok",
  running: "warn",
  failed: "critical",
};

function rateColor(rate: number): string {
  if (rate >= 0.8) return "var(--kratos-ok)";
  if (rate >= 0.5) return "var(--kratos-warn)";
  return "var(--kratos-critical)";
}

interface Props {
  crew: OmnisCrew;
}

export function OmnisCrewCard({ crew }: Props) {
  const severity = CREW_SEVERITY[crew.status];
  const pct = Math.round(crew.taxaSucesso * 100);

  return (
    <StatusCard accent="none">
      <div className="flex items-center gap-2.5">
        <Users
          className="h-3.5 w-3.5 shrink-0"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[13px] font-medium flex-1"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {crew.nome}
        </span>
        <StatusDot severity={severity} pulse={crew.status === "running"} />
      </div>
      {crew.descricao && (
        <p
          className="text-[11px] mt-1 line-clamp-2 ml-6"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          {crew.descricao}
        </p>
      )}
      <div className="flex items-center gap-4 mt-2 ml-6">
        <span
          className="text-[11px]"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          <span
            className="kratos-num text-[13px] font-semibold"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            {crew.jobsConcluidos}
          </span>{" "}
          jobs
        </span>
        <span className="text-[11px]" style={{ color: "var(--kratos-text-secondary)" }}>
          <span
            className="kratos-num text-[13px] font-semibold"
            style={{ color: rateColor(crew.taxaSucesso) }}
          >
            {pct}%
          </span>{" "}
          sucesso
        </span>
      </div>
    </StatusCard>
  );
}
