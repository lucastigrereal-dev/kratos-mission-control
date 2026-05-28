import { cn } from "@/lib/utils";

interface OperatorWelcomeCardProps {
  operatorName?: string;
  motto?: string;
  avatarUrl?: string;
  className?: string;
}

const DEFAULT_MOTTO = "What you do today defines tomorrow.";

export function OperatorWelcomeCard({
  operatorName = "Operator",
  motto = DEFAULT_MOTTO,
  avatarUrl,
  className,
}: OperatorWelcomeCardProps) {
  const initials = operatorName.charAt(0).toUpperCase();

  return (
    <div
      className={cn("flex items-center gap-3 rounded-2xl px-4 py-3", className)}
      style={{
        background: "var(--kr-glass-bg)",
        border: "1px solid var(--kr-glass-border)",
        backdropFilter: "blur(var(--kr-glass-blur))",
        WebkitBackdropFilter: "blur(var(--kr-glass-blur))",
        boxShadow: "var(--kr-shadow-inner-glow)",
      }}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={operatorName}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--kr-gold)] ring-offset-1 ring-offset-[var(--kr-surface-deep)]"
          />
        ) : (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, var(--kr-azure), var(--kr-aurora))",
              color: "var(--kr-text-primary)",
            }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="text-sm font-semibold leading-tight"
          style={{ color: "var(--kr-text-primary)" }}
        >
          {operatorName}
        </span>
        <span
          className="text-[11px] leading-tight italic truncate"
          style={{ color: "var(--kr-gold)" }}
        >
          {motto}
        </span>
      </div>
    </div>
  );
}
