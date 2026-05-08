import { Compass } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot, type Severity } from "@/components/kratos/base/StatusDot";

type Drift = "none" | "light" | "high";

type Props = {
  drift: Drift;
  minutes?: number;
};

const META: Record<Drift, { label: string; severity: Severity; accent: "on_focus" | "off_focus" | "none"; copy: (m?: number) => string }> = {
  none: {
    label: "SEM DESVIO",
    severity: "ok",
    accent: "on_focus",
    copy: () => "Sem desvio crítico agora.",
  },
  light: {
    label: "DESVIO LEVE",
    severity: "warn",
    accent: "none",
    copy: (m) => `Pequena distração detectada${m ? ` há ${m} min` : ""}.`,
  },
  high: {
    label: "DESVIO ALTO",
    severity: "critical",
    accent: "off_focus",
    copy: (m) => `Você saiu do foco planejado${m ? ` há ${m} min` : ""}.`,
  },
};

export function FocusDriftCard({ drift, minutes }: Props) {
  const meta = META[drift];
  return (
    <StatusCard accent={meta.accent} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Compass
            className="h-3.5 w-3.5"
            style={{ color: "var(--kratos-text-muted)" }}
          />
          <span
            className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            Foco
          </span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] kratos-mono"
          style={{
            color: "var(--kratos-text-secondary)",
            background: "var(--kratos-surface-3)",
            border: "1px solid var(--kratos-border)",
          }}
        >
          <StatusDot severity={meta.severity} size="xs" />
          {meta.label}
        </span>
      </div>

      <p
        className="text-[14px] leading-snug"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {meta.copy(minutes)}
      </p>

      <p
        className="mt-auto pt-4 text-[11px]"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        {drift === "none"
          ? "Continue. Você está na rota."
          : "Volte para a próxima ação antes de abrir nova frente."}
      </p>
    </StatusCard>
  );
}
