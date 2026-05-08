import { Crosshair } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot } from "@/components/kratos/base/StatusDot";

type Status = "on_focus" | "off_focus" | "unknown";

type Props = {
  project: string;
  mission: string;
  app: string;
  window: string;
  status: Status;
  confidence: number; // 0-100
};

const STATUS_META: Record<Status, { label: string; severity: "ok" | "critical" | "muted"; accent: "on_focus" | "off_focus" | "none" }> = {
  on_focus: { label: "ON FOCUS", severity: "ok", accent: "on_focus" },
  off_focus: { label: "OFF FOCUS", severity: "critical", accent: "off_focus" },
  unknown: { label: "UNKNOWN", severity: "muted", accent: "none" },
};

export function CurrentContextHero({
  project,
  mission,
  app,
  window: windowName,
  status,
  confidence,
}: Props) {
  const meta = STATUS_META[status];
  return (
    <StatusCard accent={meta.accent} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Crosshair
            className="h-3.5 w-3.5"
            style={{ color: "var(--kratos-text-muted)" }}
          />
          <span
            className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            Você está aqui
          </span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] kratos-mono"
          style={{
            color: "var(--kratos-text-secondary)",
            background: "var(--kratos-surface-3)",
            border: "1px solid var(--kratos-border)",
          }}
        >
          <StatusDot severity={meta.severity} size="xs" />
          {meta.label}
        </span>
      </div>

      <div className="space-y-1.5">
        <div
          className="text-[11px] kratos-mono uppercase tracking-[0.15em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Projeto inferido
        </div>
        <div
          className="text-[22px] font-semibold leading-tight"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {project}
        </div>
        <div
          className="text-[13px] leading-relaxed"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          {mission}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <div
            className="text-[10px] kratos-mono uppercase tracking-[0.15em] mb-1"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            App
          </div>
          <div
            className="text-[12px]"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            {app}
          </div>
        </div>
        <div>
          <div
            className="text-[10px] kratos-mono uppercase tracking-[0.15em] mb-1"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            Janela
          </div>
          <div
            className="text-[12px]"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            {window}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            Confiança
          </span>
          <span
            className="text-[10px] kratos-mono"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            {confidence}%
          </span>
        </div>
        <div
          className="h-1 w-full rounded-full overflow-hidden"
          style={{ background: "var(--kratos-surface-3)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.max(0, Math.min(100, confidence))}%`,
              background: "var(--kratos-accent)",
            }}
          />
        </div>
        <p
          className="mt-2 text-[11px]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Contexto inferido com {confidence >= 75 ? "alta" : confidence >= 45 ? "média" : "baixa"} confiança.
        </p>
      </div>
    </StatusCard>
  );
}
