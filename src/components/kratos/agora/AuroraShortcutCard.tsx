import { Sparkles, ArrowUpRight } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";

export function AuroraShortcutCard() {
  return (
    <StatusCard accent="ghost">
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-md"
          style={{
            background: "rgba(99,102,241,0.10)",
            border: "1px solid var(--kratos-border-live)",
          }}
        >
          <Sparkles
            className="h-4 w-4"
            style={{ color: "var(--kratos-ghost)" }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="text-[13px] font-medium"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            Aurora pode resumir o próximo passo.
          </div>
          <div
            className="text-[11px] leading-relaxed"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            Use o painel à direita para conversar com o Mentor.
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            /* visual mock — abertura real do Aurora vive na Topbar */
          }}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[11px] kratos-mono uppercase tracking-[0.15em] kratos-focus-ring transition-colors"
          style={{
            background: "var(--kratos-surface-3)",
            border: "1px solid var(--kratos-border-live)",
            color: "var(--kratos-text-primary)",
          }}
        >
          Atalho visual Aurora
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </StatusCard>
  );
}
