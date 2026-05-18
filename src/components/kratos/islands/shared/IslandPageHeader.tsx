import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface IslandPageHeaderProps {
  title: string;
  subtitle: string;
  theme: "omnis" | "agencia" | "akasha" | "nimbus";
  onBack?: () => void;
  className?: string;
}

const themeAccentMap: Record<IslandPageHeaderProps["theme"], string> = {
  omnis: "#7C3AED",
  agencia: "#F97316",
  akasha: "#059669",
  nimbus: "#0EA5E9",
};

const themeGlowMap: Record<IslandPageHeaderProps["theme"], string> = {
  omnis: "#8B5CF6",
  agencia: "#FB923C",
  akasha: "#10B981",
  nimbus: "#7DD3FC",
};

export function IslandPageHeader({
  title,
  subtitle,
  theme,
  onBack,
  className,
}: IslandPageHeaderProps) {
  const accent = themeAccentMap[theme];
  const glow = themeGlowMap[theme];

  return (
    <header className={cn("relative mb-8", className)}>
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className={cn(
          "inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg",
          "text-[11px] font-medium tracking-[0.05em]",
          "transition-all duration-150",
          "kratos-focus-ring",
        )}
        style={{
          background: "var(--kratos-surface-3)",
          border: "1px solid var(--kratos-border)",
          color: "var(--kratos-text-secondary)",
        }}
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Voltar ao Castelo
      </button>

      {/* Title + subtitle */}
      <div className="flex items-baseline gap-4">
        <div>
          <h1
            className="kratos-display text-[28px] tracking-[-0.02em]"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            {title}
          </h1>
          <p
            className="mt-1 text-[13px] leading-relaxed"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            {subtitle}
          </p>
        </div>
        {/* Themed accent bar */}
        <div
          className="ml-auto h-1 w-16 rounded-full flex-shrink-0"
          style={{
            background: `linear-gradient(90deg, ${accent}, ${glow})`,
            boxShadow: `0 0 16px color-mix(in oklab, ${accent} 40%, transparent)`,
          }}
          aria-hidden
        />
      </div>
    </header>
  );
}
