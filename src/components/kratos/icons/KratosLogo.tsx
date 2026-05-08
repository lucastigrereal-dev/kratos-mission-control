type Props = { collapsed?: boolean };

export function KratosLogo({ collapsed = false }: Props) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-md"
        style={{
          background:
            "linear-gradient(135deg, var(--kratos-accent), var(--kratos-ghost))",
          boxShadow: "0 0 0 1px var(--kratos-border)",
        }}
        aria-hidden
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 2 L2 12 M2 7 L12 2 M2 7 L12 12"
            stroke="#0C0C0E"
            strokeWidth="1.75"
            strokeLinecap="square"
          />
        </svg>
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-none">
          <span
            className="text-[13px] font-semibold tracking-wider"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            KRATOS
          </span>
          <span
            className="text-[9px] uppercase tracking-[0.18em] mt-0.5 kratos-mono"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            Mission Control
          </span>
        </div>
      )}
    </div>
  );
}
