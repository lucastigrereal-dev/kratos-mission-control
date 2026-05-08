import { Crosshair } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot } from "@/components/kratos/base/StatusDot";

export type FocusState = "on_focus" | "off_focus" | "unknown";

type Props = {
  project: string;
  state: FocusState;
  headline: string;
  subline?: string;
  duration?: string;
};

const META: Record<
  FocusState,
  { accent: "on_focus" | "off_focus" | "none"; label: string; tone: string }
> = {
  on_focus: {
    accent: "on_focus",
    label: "ON_FOCUS",
    tone: "var(--kratos-ok)",
  },
  off_focus: {
    accent: "off_focus",
    label: "OFF_FOCUS",
    tone: "var(--kratos-critical)",
  },
  unknown: {
    accent: "none",
    label: "UNKNOWN",
    tone: "var(--kratos-text-muted)",
  },
};

export function FocusCard({ project, state, headline, subline, duration }: Props) {
  const meta = META[state];
  return (
    <StatusCard accent={meta.accent} className="h-full">
      <div className="flex items-center gap-2 mb-3">
        <Crosshair
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Foco atual
        </span>
      </div>

      <div
        className="text-[22px] font-semibold leading-tight"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {project}
      </div>

      <p
        className="mt-2 text-[13px] leading-relaxed"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        {headline}
      </p>

      {subline && (
        <p
          className="mt-1 text-[12px] leading-relaxed"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          {subline}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <StatusDot
          severity={
            state === "on_focus" ? "ok" : state === "off_focus" ? "critical" : "muted"
          }
          pulse={state === "on_focus"}
          size="xs"
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
          style={{ color: meta.tone }}
        >
          {meta.label}
          {duration ? ` · ${duration}` : ""}
        </span>
      </div>
    </StatusCard>
  );
}
