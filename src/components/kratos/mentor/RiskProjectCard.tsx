import { ShieldAlert } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { AlertBadge } from "@/components/kratos/base/AlertBadge";

export type RiskProject = {
  project: string;
  risk: string;
  reason: string;
  suggestedAction: string;
  severity: "warn" | "critical";
};

type Props = { data?: RiskProject };

export function RiskProjectCard({ data }: Props) {
  if (!data) {
    return (
      <StatusCard>
        <div className="flex items-center gap-2">
          <ShieldAlert
            className="h-3.5 w-3.5"
            style={{ color: "var(--kratos-text-muted)" }}
          />
          <span
            className="text-[12px]"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            Nenhum projeto em risco agora.
          </span>
        </div>
      </StatusCard>
    );
  }

  return (
    <StatusCard accent={data.severity === "critical" ? "off_focus" : "info"}>
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2 md:min-w-[200px]">
          <ShieldAlert
            className="h-3.5 w-3.5"
            style={{ color: "var(--kratos-text-muted)" }}
          />
          <span
            className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            Projeto em risco
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[14px] font-semibold"
              style={{ color: "var(--kratos-text-primary)" }}
            >
              {data.project}
            </span>
            <AlertBadge severity={data.severity} label={data.risk} />
          </div>
          <div
            className="mt-1 text-[12px] leading-relaxed"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            {data.reason}
          </div>
        </div>

        <div
          className="md:max-w-[260px] text-[12px] leading-snug rounded-md p-2.5"
          style={{
            background: "var(--kratos-surface-3)",
            border: "1px solid var(--kratos-border)",
            color: "var(--kratos-text-primary)",
          }}
        >
          <span
            className="block text-[10px] kratos-mono uppercase tracking-[0.15em] mb-0.5"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            Ação sugerida
          </span>
          {data.suggestedAction}
        </div>
      </div>
    </StatusCard>
  );
}
