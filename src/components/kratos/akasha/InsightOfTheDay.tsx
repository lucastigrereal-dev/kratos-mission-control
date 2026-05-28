/**
 * InsightOfTheDay — W14 Auto-Learning
 *
 * Displays a daily insight from Akasha memory vault (or static fallback).
 * Used in DashboardView, FilosofiaScreen, and anywhere insights surface.
 */
import { Quote, Sparkles, Database } from "lucide-react";
import { useAkashaDailyInsight } from "@/hooks/useAkashaDailyInsight";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";

interface InsightOfTheDayProps {
  accent?: string;
  compact?: boolean;
}

export function InsightOfTheDay({
  accent = "var(--kr-island-filosofia)",
  compact = false,
}: InsightOfTheDayProps) {
  const { insight, isLoading, isFromAkasha } = useAkashaDailyInsight();

  if (isLoading) {
    return (
      <GlassPanel padding="sm" className="!p-3">
        <div className="h-4 w-3/4 animate-pulse rounded" style={{ background: "var(--kratos-surface-4)" }} />
        <div className="h-3 w-1/2 animate-pulse rounded mt-2" style={{ background: "var(--kratos-surface-4)" }} />
      </GlassPanel>
    );
  }

  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: `color-mix(in oklab, ${accent} 5%, var(--kratos-surface-3))`,
        border: `1px solid color-mix(in oklab, ${accent} 15%, transparent)`,
      }}
    >
      <div className="flex gap-2.5">
        <Quote className={compact ? "h-3.5 w-3.5 shrink-0 mt-0.5" : "h-4 w-4 shrink-0 mt-0.5"} style={{ color: accent }} aria-hidden />
        <div className="flex-1 min-w-0">
          <p
            className={`italic leading-relaxed ${compact ? "text-[11px]" : "text-[12px]"}`}
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            {insight.content}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            {insight.source && (
              <p
                className="text-[10px] font-semibold"
                style={{ color: accent }}
              >
                {insight.source}
              </p>
            )}
            <div className="ml-auto flex items-center gap-1">
              {isFromAkasha ? (
                <>
                  <Database className="h-3 w-3" style={{ color: accent }} aria-hidden />
                  <span className="text-[9px] font-bold uppercase tracking-[0.05em]" style={{ color: accent }}>
                    Akasha
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
                  <span className="text-[9px]" style={{ color: "var(--kratos-text-muted)" }}>
                    curado
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
