import type { ReactNode } from "react";
import { SystemCard } from "./SystemCard";

type Accent = "none" | "on_focus" | "off_focus" | "live" | "info" | "ghost";

const ACCENT_BORDER: Record<Accent, string> = {
  none: "var(--kratos-border)",
  on_focus: "var(--kratos-border-on-focus)",
  off_focus: "var(--kratos-border-off-focus)",
  live: "var(--kratos-border-live)",
  info: "rgba(59,130,246,0.18)",
  ghost: "rgba(99,102,241,0.18)",
};

type Props = {
  children: ReactNode;
  accent?: Accent;
  className?: string;
  interactive?: boolean;
};

export function StatusCard({
  children,
  accent = "none",
  className = "",
  interactive,
}: Props) {
  return (
    <SystemCard
      interactive={interactive}
      className={className}
      style={{ borderColor: ACCENT_BORDER[accent] }}
    >
      {children}
    </SystemCard>
  );
}
