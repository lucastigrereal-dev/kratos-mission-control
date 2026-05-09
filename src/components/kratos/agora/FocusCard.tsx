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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Crosshair
            className="h-3.5 w-3.5"
            style={{ color: "var(--kratos-text-muted)" }}
            aria-hidden
          />
          <span className="kratos-eyebrow">Foco atual</span>
        </div>
        <span
          className="kratos-chip"
          style={{ color: meta.tone, borderColor: "var(--kratos-border)" }}
        >
          <StatusDot
            severity={
              state === "on_focus" ? "ok" : state === "off_focus" ? "critical" : "muted"
            }
            pulse={state === "on_focus"}
            size="xs"
          />
          {meta.label}
        </span>
      </div>

      <div className="kratos-display text-[26px] sm:text-[30px]">
        {project}
      </div>

      <p
        className="mt-3 text-[14px] leading-relaxed"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        {headline}
      </p>

      {subline && (
        <p
          className="mt-1.5 text-[12px] leading-relaxed kratos-mono"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          {subline}
        </p>
      )}

      {duration && (
        <div
          className="mt-5 flex items-baseline gap-2"
          aria-label={`Sessão ativa há ${duration}`}
        >
          <span className="kratos-eyebrow">Sessão ativa</span>
          <span className="kratos-num text-[18px]">{duration}</span>
        </div>
      )}
    </StatusCard>
  );
}
