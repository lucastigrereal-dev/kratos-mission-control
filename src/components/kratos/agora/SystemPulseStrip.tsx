import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot, type Severity } from "@/components/kratos/base/StatusDot";
import {
  LiveStatusIndicator,
  type LiveState,
} from "@/components/kratos/base/LiveStatusIndicator";

export type SystemPulse = {
  name: string;
  severity: Severity;
  hint?: string;
};

type Props = {
  systems: SystemPulse[];
  liveState: LiveState;
  lastUpdate?: string;
};

export function SystemPulseStrip({ systems, liveState, lastUpdate }: Props) {
  return (
    <StatusCard>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            Saúde do Live
          </span>
          <LiveStatusIndicator state={liveState} lastUpdate={lastUpdate} />
        </div>

        <div
          className="hidden h-4 w-px sm:block"
          style={{ background: "var(--kratos-border)" }}
        />

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {systems.map((s, i) => (
            <li key={`${s.name}-${i}`} className="flex items-center gap-2">
              <StatusDot severity={s.severity} size="xs" />
              <span
                className="text-[11px] kratos-mono uppercase tracking-[0.12em]"
                style={{ color: "var(--kratos-text-secondary)" }}
              >
                {s.name}
              </span>
              {s.hint && (
                <span
                  className="text-[10px] kratos-mono"
                  style={{ color: "var(--kratos-text-muted)" }}
                >
                  · {s.hint}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </StatusCard>
  );
}
