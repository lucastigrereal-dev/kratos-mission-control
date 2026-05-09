import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  eyebrow?: string;
  right?: ReactNode;
};

export function SectionHeader({ title, description, eyebrow, right }: Props) {
  return (
    <header className="mb-6">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          {eyebrow && <div className="kratos-eyebrow mb-2">{eyebrow}</div>}
          <h2 className="kratos-display text-[22px] sm:text-[24px]">{title}</h2>
          {description && (
            <p
              className="mt-1.5 text-[13px] leading-relaxed max-w-[60ch]"
              style={{ color: "var(--kratos-text-secondary)" }}
            >
              {description}
            </p>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
      <div className="kratos-divider-soft mt-5" aria-hidden />
    </header>
  );
}
