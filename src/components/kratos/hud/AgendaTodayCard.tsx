import { Clock } from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";

interface AgendaItem {
  time: string;
  label: string;
}

interface AgendaTodayCardProps {
  items?: AgendaItem[];
}

const defaultItems: AgendaItem[] = [
  { time: "09:00", label: "Reuniao — Pipeline hoteis SP" },
  { time: "11:00", label: "Deep Work — KRATOS HUD Shell" },
  { time: "14:00", label: "Review — Collabs pendentes" },
  { time: "16:00", label: "Checkpoint — Metricas do dia" },
];

export function AgendaTodayCard({ items = defaultItems }: AgendaTodayCardProps) {
  return (
    <GlassPanel padding="md" blur="panel">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Clock
          className="h-4 w-4"
          style={{ color: "var(--kr-warning)" }}
          aria-hidden
        />
        <span
          className="text-[13px] font-semibold"
          style={{ color: "var(--kr-text-primary)" }}
        >
          Agenda de Hoje
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const isCurrent = item.time === "11:00"; // mock: Deep Work is "now"

          return (
            <div
              key={i}
              className={cn(
                "relative flex gap-3",
                !isLast && "pb-3",
              )}
            >
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center shrink-0">
                {/* Dot */}
                <div
                  className={cn(
                    "h-2 w-2 rounded-full shrink-0 mt-[3px]",
                    isCurrent && "animate-pulse",
                  )}
                  style={{
                    background: isCurrent
                      ? "var(--kr-azure)"
                      : "var(--kr-surface-high)",
                    boxShadow: isCurrent
                      ? "0 0 8px rgba(30, 144, 255, 0.6)"
                      : "none",
                  }}
                  aria-hidden
                />
                {/* Vertical line (except last) */}
                {!isLast && (
                  <div
                    className="flex-1 mt-1"
                    style={{
                      width: 1,
                      background: "var(--kr-hud-border)",
                      minHeight: "16px",
                    }}
                    aria-hidden
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <span
                  className="block text-[10px] uppercase tracking-[0.12em] font-semibold mb-0.5"
                  style={{ color: isCurrent ? "var(--kr-azure)" : "var(--kr-text-muted)" }}
                >
                  {item.time}
                </span>
                <span
                  className="block text-[12px] leading-relaxed"
                  style={{
                    color: isCurrent ? "var(--kr-text-primary)" : "var(--kr-text-secondary)",
                  }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

/* Inline cn() — avoids extra import in this file */
function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
