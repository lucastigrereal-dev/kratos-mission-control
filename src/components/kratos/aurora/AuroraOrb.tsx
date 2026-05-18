import { cn } from "@/lib/utils";

interface AuroraOrbProps {
  active?: boolean;
  pulse?: boolean;
}

export function AuroraOrb({ active = true, pulse = false }: AuroraOrbProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        pulse && !active && "kratos-pulse",
      )}
      style={{
        width: 48,
        height: 48,
        animation: !pulse && active
          ? "kratos-float-medium 3s ease-in-out infinite"
          : undefined,
      }}
    >
      {/* Rotating ring */}
      <div
        className="animate-spin absolute inset-0 rounded-full"
        style={{
          animationDuration: "4s",
          border: "2px solid transparent",
          borderTopColor: active
            ? "var(--kratos-ghost)"
            : "var(--kratos-text-muted)",
          borderRightColor: active
            ? "var(--kratos-accent)"
            : "var(--kratos-text-muted)",
        }}
      />

      {/* Orb core — radial gradient holographic */}
      <div
        className="rounded-full"
        style={{
          width: 36,
          height: 36,
          background: active
            ? "radial-gradient(circle at 30% 30%, #ffffff 0%, var(--kratos-ghost) 40%, transparent 80%)"
            : "radial-gradient(circle at 30% 30%, var(--kratos-text-muted) 0%, var(--kratos-surface-4) 60%, transparent 100%)",
          boxShadow: active
            ? "0 0 18px color-mix(in oklab, var(--kratos-ghost) 40%, transparent), 0 0 4px color-mix(in oklab, var(--kratos-accent) 60%, transparent)"
            : "none",
          opacity: active ? 1 : 0.35,
        }}
      />

      {/* Pulse ring when active and pulsing */}
      {active && pulse && (
        <div
          className="absolute inset-0 rounded-full kratos-pulse"
          style={{
            border: "1.5px solid",
            borderColor: "color-mix(in oklab, var(--kratos-ghost) 30%, transparent)",
            boxShadow: "0 0 12px color-mix(in oklab, var(--kratos-ghost) 20%, transparent)",
          }}
        />
      )}
    </div>
  );
}
