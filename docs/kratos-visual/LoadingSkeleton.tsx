import React from 'react';

interface LoadingSkeletonProps {
  type?: "text" | "title" | "card";
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({
  type = "text",
  count = 3,
  className = ''
}: LoadingSkeletonProps) {
  return (
    <div className={className}>
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