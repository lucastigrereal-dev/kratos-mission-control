import { StatusDot, type Severity } from "./StatusDot";

type Props = {
  severity: Severity;
  label: string;
  className?: string;
};

export function AlertBadge({ severity, label, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] kratos-mono ${className}`}
      style={{
        color: "var(--kratos-text-secondary)",
        background: "var(--kratos-surface-3)",
        border: "1px solid var(--kratos-border)",
      }}
    >
      <StatusDot severity={severity} size="xs" />
      {label}
    </span>
  );
}
