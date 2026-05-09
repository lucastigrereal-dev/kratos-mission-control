import { CornerDownLeft } from "lucide-react";

export function AuroraInputMock() {
  return (
    <div
      className="flex items-center justify-between gap-2 rounded-md px-3 py-2.5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--kratos-border)",
      }}
      aria-disabled="true"
      title="Mock visual — em breve conectado ao KRATOS real"
    >
      <span
        className="truncate text-[12px]"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        Aurora está em modo visual.
      </span>
      <kbd
        className="kratos-mono inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px]"
        style={{
          background: "var(--kratos-surface-3)",
          border: "1px solid var(--kratos-border)",
          color: "var(--kratos-text-muted)",
        }}
      >
        <CornerDownLeft className="h-2.5 w-2.5" />
        ⌘K
      </kbd>
    </div>
  );
}
