import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  eyebrow?: string;
  right?: ReactNode;
};

export function SectionHeader({ title, description, eyebrow, right }: Props) {
  return (
    <header className="flex items-start justify-between gap-4 mb-4">
      <div className="min-w-0">
        {eyebrow && (
          <div
            className="text-[10px] uppercase tracking-[0.18em] kratos-mono mb-1.5"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            {eyebrow}
          </div>
        )}
        <h2
          className="text-[18px] font-semibold leading-tight"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="mt-1 text-[12px] leading-relaxed"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            {description}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  );
}
