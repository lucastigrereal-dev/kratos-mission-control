import { Sparkles, ArrowRight } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";

export type MentorRecommendation = {
  recommendation: string;
  why: string;
  impact: string;
  nextStep: string;
};

interface Props {
  data: MentorRecommendation;
  onPrimary?: () => void;
}

export function MentorRecommendationCard({ data, onPrimary }: Props) {
  return (
    <StatusCard accent="ghost" className="h-full">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-ghost)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Mentor · recomendação prioritária
        </span>
      </div>

      <div
        className="text-[18px] font-semibold leading-snug"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {data.recommendation}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Block label="Por que importa" value={data.why} />
        <Block label="Impacto" value={data.impact} />
      </div>

      {onPrimary && (
        <button
          type="button"
          onClick={onPrimary}
          className="mt-5 inline-flex items-center gap-2 rounded-md px-3 py-2 text-[12px] font-medium kratos-focus-ring transition-colors"
          style={{
            background: "var(--kratos-accent)",
            color: "var(--kratos-surface-0)",
          }}
        >
          {data.nextStep}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </StatusCard>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-md p-3"
      style={{
        background: "var(--kratos-surface-3)",
        border: "1px solid var(--kratos-border)",
      }}
    >
      <div
        className="text-[10px] kratos-mono uppercase tracking-[0.15em] mb-1"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        {label}
      </div>
      <div
        className="text-[12px] leading-relaxed"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {value}
      </div>
    </div>
  );
}
