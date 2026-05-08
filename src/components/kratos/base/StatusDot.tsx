export type Severity = "ok" | "warn" | "critical" | "info" | "ghost" | "muted";

const SEVERITY_VAR: Record<Severity, string> = {
  ok: "var(--kratos-ok)",
  warn: "var(--kratos-warn)",
  critical: "var(--kratos-critical)",
  info: "var(--kratos-info)",
  ghost: "var(--kratos-ghost)",
  muted: "var(--kratos-text-muted)",
};

type Props = {
  severity: Severity;
  pulse?: boolean;
  blink?: boolean;
  size?: "xs" | "sm" | "md";
  className?: string;
};

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
};

export function StatusDot({
  severity,
  pulse,
  blink,
  size = "sm",
  className = "",
}: Props) {
  const color = SEVERITY_VAR[severity];
  const anim = pulse ? "kratos-pulse" : blink ? "kratos-blink" : "";
  return (
    <span
      aria-hidden
      className={`inline-block rounded-full ${SIZE[size]} ${anim} ${className}`}
      style={{
        background: color,
        boxShadow: pulse
          ? `0 0 8px ${color}, 0 0 0 2px color-mix(in oklab, ${color} 25%, transparent)`
          : undefined,
      }}
    />
  );
}
