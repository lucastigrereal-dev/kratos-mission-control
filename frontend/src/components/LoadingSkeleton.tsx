interface LoadingSkeletonProps {
  type?: "text" | "title" | "card";
  count?: number;
}

export default function LoadingSkeleton({ type = "text", count = 3 }: LoadingSkeletonProps) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`kr-skeleton ${
            type === "title" ? "kr-skeleton-title" :
            type === "card" ? "kr-skeleton-card" :
            "kr-skeleton-text"
          }`}
          style={type === "text" && i === count - 1 ? { width: "40%", marginBottom: 0 } : undefined}
        />
      ))}
    </div>
  );
}
