import { Sparkles } from "lucide-react";

type Props = {
  message: string;
};

export function AuroraMessagePreview({ message }: Props) {
  return (
    <div
      className="rounded-lg p-3.5"
      style={{
        background:
          "linear-gradient(180deg, rgba(99,102,241,0.10), rgba(99,102,241,0.04))",
        border: "1px solid var(--kratos-border-live)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px rgba(99,102,241,0.04)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles
          className="h-3 w-3"
          style={{ color: "var(--kratos-ghost)" }}
          aria-hidden
        />
        <span
          className="kratos-eyebrow"
          style={{ color: "var(--kratos-ghost)" }}
        >
          Aurora · Sugestão
        </span>
      </div>
      <p
        className="text-[12.5px] leading-relaxed"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {message}
      </p>
    </div>
  );
}
