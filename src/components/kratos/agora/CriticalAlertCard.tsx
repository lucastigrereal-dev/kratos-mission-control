import { AlertOctagon, ShieldCheck } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot } from "@/components/kratos/base/StatusDot";
import { AlertBadge } from "@/components/kratos/base/AlertBadge";

export type CriticalAlert = {
  title: string;
  detail?: string;
  badge?: string;
};

type Props = {
  alert?: CriticalAlert;
  warningsCount?: number;
};

export function CriticalAlertCard({ alert, warningsCount = 0 }: Props) {
  const hasCritical = !!alert;

  return (
    <StatusCard accent={hasCritical ? "off_focus" : "none"} className="h-full">
      <div className="flex items-center gap-2 mb-3">
        {hasCritical ? (
          <AlertOctagon
            className="h-3.5 w-3.5"
            style={{ color: "var(--kratos-critical)" }}
          />
        ) : (
          <ShieldCheck
            className="h-3.5 w-3.5"
            style={{ color: "var(--kratos-text-muted)" }}
          />
        )}
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Alerta crítico
        </span>
      </div>

      {hasCritical ? (
        <>
          <div className="flex items-start gap-2.5">
            <StatusDot severity="critical" size="xs" className="mt-1.5" />
            <div className="min-w-0 flex-1">
              <div
                className="text-[14px] font-medium leading-snug"
                style={{ color: "var(--kratos-text-primary)" }}
              >
                {alert!.title}
              </div>
              {alert!.detail && (
                <div
                  className="mt-1 text-[11px] leading-relaxed"
                  style={{ color: "var(--kratos-text-secondary)" }}
                >
                  {alert!.detail}
                </div>
              )}
            </div>
            {alert!.badge && (
              <AlertBadge
                severity="critical"
                label={alert!.badge}
                className="shrink-0"
              />
            )}
          </div>
          {warningsCount > 0 && (
            <div
              className="mt-3 text-[10px] kratos-mono uppercase tracking-[0.15em]"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              + {warningsCount} aviso{warningsCount > 1 ? "s" : ""} · ver detalhes
            </div>
          )}
        </>
      ) : (
        <>
          <div
            className="text-[14px] font-medium"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            Sem alerta crítico no momento.
          </div>
          <p
            className="mt-2 text-[11px] leading-relaxed"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            Continue na frente atual. Avisos menores vivem em /sistema.
          </p>
        </>
      )}
    </StatusCard>
  );
}
