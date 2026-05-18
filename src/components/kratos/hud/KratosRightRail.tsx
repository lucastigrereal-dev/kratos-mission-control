import { type ReactNode } from "react";
import { FocusTodayCard } from "./FocusTodayCard";
import { AgendaTodayCard } from "./AgendaTodayCard";
import { DailyQuoteCard } from "./DailyQuoteCard";
import { cn } from "@/lib/utils";

interface KratosRightRailProps {
  children?: ReactNode;
  auroraContent?: ReactNode;
}

export function KratosRightRail({ children, auroraContent }: KratosRightRailProps) {
  return (
    <aside
      className="fixed right-0 top-16 bottom-8 z-100 flex flex-col w-[340px] overflow-y-auto kr-scrollbar-thin"
      style={{
        background: "var(--kr-hud-bg)",
        borderLeft: `1px solid var(--kr-hud-border)`,
        backdropFilter: "blur(var(--kr-glass-blur))",
        WebkitBackdropFilter: "blur(var(--kr-glass-blur))",
      }}
    >
      <div className="flex flex-col gap-4 p-4">
        {/* Aurora Panel area (first slot) */}
        {auroraContent ? (
          <div className="shrink-0">{auroraContent}</div>
        ) : (
          <div
            className="rounded-2xl p-5 shrink-0"
            style={{
              background: "var(--kr-glass-bg)",
              border: "1px solid var(--kr-glass-border)",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, var(--kr-aurora), var(--kr-azure))",
                  boxShadow: "var(--kr-shadow-glow-blue)",
                }}
                aria-hidden
              >
                <span className="text-xl">🌌</span>
              </div>
              <div className="text-center">
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--kr-text-primary)" }}
                >
                  KRATOS Aurora
                </span>
                <p
                  className="text-[11px] mt-1 leading-relaxed"
                  style={{ color: "var(--kr-text-muted)" }}
                >
                  Inteligencia contextual do seu mundo
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Focus Today */}
        <FocusTodayCard />

        {/* Agenda Today */}
        <AgendaTodayCard />

        {/* Daily Quote */}
        <DailyQuoteCard />

        {/* Slot for caller-provided children */}
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </aside>
  );
}
