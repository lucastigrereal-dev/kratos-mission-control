import { Sparkles } from "lucide-react";

type Props = {
  message: string;
};

export function AuroraMessagePreview({ message }: Props) {
  return (
    <div
      className="rounded-md p-3"
      style={{
        background: "rgba(99,102,241,0.06)",
        border: "1px solid var(--kratos-border-live)",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Sparkles
          className="h-3 w-3"
          style={{ color: "var(--kratos-ghost)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
          style={{ color: "var(--kratos-ghost)" }}
        >
          Aurora · Sugestão
        </span>
      </div>
      <p
        className="text-[12px] leading-relaxed"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {message}
      </p>
    </div>
  );
}
