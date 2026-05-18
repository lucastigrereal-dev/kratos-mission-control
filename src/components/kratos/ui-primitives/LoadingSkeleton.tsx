import { useEffect, useId } from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  lines?: number;
  compact?: boolean;
  className?: string;
}

/* Inject shimmer keyframes once globally. Multiple instances share the same animation. */
let shimmerInjected = false;

function injectShimmerKeyframes() {
  if (shimmerInjected) return;
  shimmerInjected = true;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes kratos-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}

export function LoadingSkeleton({
  lines = 3,
  compact = false,
  className,
}: LoadingSkeletonProps) {
  const id = useId();

  useEffect(() => {
    injectShimmerKeyframes();
  }, []);

  const widthPatterns = ["w-full", "w-3/4", "w-1/2", "w-5/6", "w-2/3"];

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        compact ? "gap-1.5" : "gap-2",
        className,
      )}
      role="status"
      aria-label="Carregando"
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={`${id}-${i}`}
          className={cn(
            "rounded-full",
            compact ? "h-2" : "h-3",
            widthPatterns[i % widthPatterns.length],
          )}
          style={{
            background:
              "linear-gradient(90deg, var(--kratos-surface-3) 25%, var(--kratos-surface-4) 50%, var(--kratos-surface-3) 75%)",
            backgroundSize: "200% 100%",
            animation: "kratos-shimmer 1.5s ease-in-out infinite",
          }}
        />
      ))}
    </div>
  );
}
