import { cn } from "@/lib/utils";

interface Connection {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

interface BridgeSystemProps {
  className?: string;
  /** Array of bridge connections between island positions */
  connections: Connection[];
}

/**
 * BridgeSystem — SVG bezier curves connecting island positions.
 *
 * Each connection renders a quadratic bezier curve with:
 * - Wood tone stroke (#8B7355 / var(--kr-wood))
 * - Subtle drop shadow for depth
 * - Pulsing glow on hover-capable connections
 *
 * Positions should be in percentage (0-100) of the parent container.
 * The SVG uses a viewBox of "0 0 100 100" with preserveAspectRatio="none".
 */
export function BridgeSystem({ className, connections }: BridgeSystemProps) {
  if (connections.length === 0) return null;

  /**
   * Generate a bezier curve path between two percentage-based points.
   * Midpoint Y is slightly raised for a gentle arc.
   */
  function buildPath(conn: Connection): string {
    const { from, to } = conn;
    const midX = (from.x + to.x) / 2;
    const midY = Math.min(from.y, to.y) - Math.abs(to.x - from.x) * 0.15;

    return `M ${from.x} ${from.y} Q ${midX} ${midY}, ${to.x} ${to.y}`;
  }

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ zIndex: "var(--kr-z-bridge-system, 30)" }}
    >
      <defs>
        {/* Drop shadow filter for bridge depth */}
        <filter id="bridge-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>

      {connections.map((conn, index) => (
        <g key={index}>
          {/* Shadow layer — slightly offset and thicker */}
          <path
            d={buildPath(conn)}
            fill="none"
            stroke="rgba(0, 0, 0, 0.35)"
            strokeWidth={4}
            strokeLinecap="round"
            filter="url(#bridge-shadow)"
          />
          {/* Main bridge stroke */}
          <path
            d={buildPath(conn)}
            fill="none"
            stroke="var(--kr-wood, #8B7355)"
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.8}
          />
          {/* Highlight — thinner, lighter line on top */}
          <path
            d={buildPath(conn)}
            fill="none"
            stroke="var(--kr-wood-light, #CA8A04)"
            strokeWidth={1}
            strokeLinecap="round"
            opacity={0.4}
          />
        </g>
      ))}
    </svg>
  );
}
