import { useState } from "react";

export interface HotspotDef {
  id: string;
  name: string;
  category: string;
  top: string;
  left: string;
  width: string;
  height: string;
}

interface IslandHotspotProps {
  hotspot: HotspotDef;
  selected: boolean;
  onClick: () => void;
}

export default function IslandHotspot({ hotspot, selected, onClick }: IslandHotspotProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`${hotspot.name} — ${hotspot.category}`}
      aria-pressed={selected}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        position: "absolute",
        top: hotspot.top,
        left: hotspot.left,
        width: hotspot.width,
        height: hotspot.height,
        minWidth: 48,
        minHeight: 48,
        cursor: "pointer",
        zIndex: hovered || selected ? 5 : 1,
      }}
    >
      {/* Hotspot body */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 12,
          border: selected
            ? "2px solid #f59e0b"
            : hovered
              ? "1px solid rgba(56, 189, 248, 0.5)"
              : "1px solid rgba(51, 65, 85, 0.4)",
          background: selected
            ? "rgba(245, 158, 11, 0.08)"
            : hovered
              ? "rgba(56, 189, 248, 0.06)"
              : "rgba(15, 23, 42, 0.5)",
          boxShadow: selected
            ? "0 0 20px rgba(245, 158, 11, 0.15)"
            : hovered
              ? "0 0 16px rgba(56, 189, 248, 0.1)"
              : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 8px",
          transition: "all 0.2s ease",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: hovered || selected ? 14 : 12,
            fontWeight: hovered || selected ? 700 : 500,
            color: hovered || selected ? "#e2e8f0" : "#cbd5e1",
            textAlign: "center",
            lineHeight: 1.2,
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {hotspot.name}
        </div>
        {(hovered || selected) && (
          <div
            style={{
              fontSize: 9,
              color: hovered ? "#94a3b8" : "#d97706",
              textAlign: "center",
              lineHeight: 1.3,
              marginTop: 3,
              transition: "all 0.2s ease",
            }}
          >
            {hotspot.category}
          </div>
        )}
      </div>
    </div>
  );
}
