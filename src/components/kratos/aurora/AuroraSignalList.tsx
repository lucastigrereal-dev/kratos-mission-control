import { cn } from "@/lib/utils";

export interface AuroraSignal {
  tone: "critical" | "warning" | "info" | "neutral";
  message: string;
  source?: string;
}

interface AuroraSignalListProps {
  signals?: AuroraSignal[];
}

const TONE_COLORS: Record<AuroraSignal["tone"], string> = {
  critical: "var(--kratos-critical)",
  warning: "var(--kratos-warn)",
  info: "var(--kratos-info)",
  neutral: "var(--kratos-text-muted)",
};

export function AuroraSignalList({ signals }: AuroraSignalListProps) {
  if (!signals || signals.length === 0) {
    return (
      <div
        className="py-3 text-center text-[11px]"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        Nenhum sinal ativo. Tudo em ordem.
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {signals.map((signal, index) => (
        <li
          key={`${signal.tone}-${index}`}
          className={cn(
            "flex items-start gap-2.5 rounded-md px-2 py-1.5",
            signal.tone === "critical" &&
              "kratos-critical-signal",
          )}
        >
          {/* Colored dot */}
          <span
            className="mt-1.5 block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: TONE_COLORS[signal.tone] }}
          />

          {/* Message + source */}
          <div className="min-w-0 flex-1">
            <p
              className="text-[11px] leading-snug"
              style={{
                color:
                  signal.tone === "neutral"
                    ? "var(--kratos-text-muted)"
                    : "var(--kratos-text-primary)",
              }}
            >
              {signal.message}
            </p>
            {signal.source && (
              <span
                className="mt-0.5 block text-[9px] kratos-mono"
                style={{ color: "var(--kratos-text-muted)" }}
              >
                {signal.source}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
