interface BridgePath {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color?: string;
}

interface IslandBridgeProps {
  bridges: BridgePath[];
}

function buildPath(b: BridgePath): string {
  // Curved bezier: control point offset perpendicular to the line
  const midX = (b.fromX + b.toX) / 2;
  const midY = (b.fromY + b.toY) / 2;
  const dx = b.toX - b.fromX;
  const dy = b.toY - b.fromY;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  // Perpendicular offset for curve
  const offsetX = (-dy / len) * 8;
  const offsetY = (dx / len) * 8;
  const cx = midX + offsetX;
  const cy = midY + offsetY;

  return `M ${b.fromX}% ${b.fromY}% Q ${cx}% ${cy}% ${b.toX}% ${b.toY}%`;
}

export default function IslandBridge({ bridges }: IslandBridgeProps) {
  return (
    <svg
      className="kr-bridges-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="kr-bridge-shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      {bridges.map((b, i) => (
        <path
          key={i}
          d={buildPath(b)}
          style={{ stroke: b.color || "#8b7355" }}
          filter="url(#kr-bridge-shadow)"
        />
      ))}
    </svg>
  );
}
