import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface IslandPageHeaderProps {
  title: string;
  subtitle: string;
  theme: string;
  onBack?: () => void;
  className?: string;
}

const themeGlowMap: Record<string, string> = {
  omnis: "var(--kr-aurora)",
  agencia: "var(--kr-accent-orange-lighter)",
  akasha: "var(--kr-accent-emerald)",
  nimbus: "var(--kr-accent-blue-light)",
  arena: "var(--kr-accent-amber-bright)",
  vila: "var(--kr-success)",
  forja: "var(--kr-danger)",
  observatorio: "var(--kr-azure)",
  filosofia: "var(--kr-accent-indigo)",
  tesouro: "var(--kr-accent-gold-light)",
};

export function IslandPageHeader({
  title,
  subtitle,
  theme,
  onBack,
  className,
}: IslandPageHeaderProps) {
  const accent = `var(--kr-island-${theme}, var(--kratos-accent))`;
  const glow = themeGlowMap[theme] ?? accent;

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
