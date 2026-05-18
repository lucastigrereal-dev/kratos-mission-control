type Props = { lines?: number; compact?: boolean };

export function LoadingState({ lines = 3, compact = false }: Props) {
  return (
    <div className={compact ? "py-3" : "py-6"} aria-busy="true" aria-live="polite" role="status">
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-2.5 rounded kratos-blink"
            style={{
              background: "var(--kratos-surface-3)",
              width: `${100 - i * 12}%`,
              animationDelay: `${i * 120}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
