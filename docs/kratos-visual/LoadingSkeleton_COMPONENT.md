# LoadingSkeleton Component

## Description
A component that displays loading skeleton placeholders with shimmer animation. Used to indicate that content is loading while maintaining layout stability.

## Props
- `type`: "text" | "title" | "card" - Type of skeleton to display (default: "text")
- `count`: number - Number of skeleton items to display (default: 3)

## Implementation
```tsx
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
```

## Usage Examples
```tsx
// Text skeletons
<LoadingSkeleton type="text" count={5} />

// Title skeleton
<LoadingSkeleton type="title" count={1} />

// Card skeleton
<LoadingSkeleton type="card" count={3} />

// Default text skeletons
<LoadingSkeleton />
```

## CSS Classes Used
- `kr-skeleton` - Base skeleton styling with shimmer animation
- `kr-skeleton-text` - Text skeleton styling
- `kr-skeleton-title` - Title skeleton styling
- `kr-skeleton-card` - Card skeleton styling

## Design Tokens Referenced
- `--kr-bg-tertiary` - Tertiary background color
- `--kr-bg-card` - Card background color
- `--kr-radius-sm` - Small border radius
- `--kr-radius-lg` - Large border radius
- Background gradient animation for shimmer effect