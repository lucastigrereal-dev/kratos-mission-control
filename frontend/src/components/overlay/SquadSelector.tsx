const SQUADS = ["Aurora", "Omnis", "Agência", "Vermilia", "Novo Squad"];

export default function SquadSelector() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span className="kr-squad-label" style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", marginRight: 2, flexShrink: 0 }}>
        SQUADS
      </span>
      {SQUADS.map((name) => (
        <button
          key={name}
          onClick={() => console.log(`Squad: ${name}`)}
          aria-label={`Squad ${name}`}
          aria-pressed={name === "Aurora"}
          style={{
            padding: "8px 12px",
            minHeight: 44,
            borderRadius: 14,
            border: "1px solid #334155",
            background: "rgba(30, 41, 59, 0.7)",
            color: name === "Aurora" ? "#c4b5fd" : "#cbd5e1",
            fontSize: 11,
            fontWeight: name === "Aurora" ? 600 : 400,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
