export default function TopBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
        padding: "0 24px",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      {/* Área esquerda */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flexShrink: 1, overflow: "hidden" }}>
        {/* Brasão tigre placeholder */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 800,
            color: "#1e293b",
            flexShrink: 0,
          }}
        >
          K
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0" }}>
            Bom dia, Lucas!
          </span>
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, letterSpacing: "0.08em" }}>
            KRATOS CONTROL
          </span>
        </div>
        <div
          className="kr-topbar-motto"
          style={{
            fontSize: 11,
            color: "#475569",
            fontStyle: "italic",
            borderLeft: "1px solid #334155",
            paddingLeft: 12,
            marginLeft: 2,
          }}
        >
          Seu mundo. Sua missão. Seu legado.
        </div>
      </div>

      {/* Área central — brasão K */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #334155, #1e293b)",
          border: "2px solid #f59e0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 800,
          color: "#f59e0b",
          boxShadow: "0 0 12px rgba(245, 158, 11, 0.2)",
        }}
      >
        K
      </div>

      {/* Área direita — indicadores gamificados */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <span className="kr-topbar-energy"><StatBadge label="Energia" value="87%" color="#22c55e" /></span>
        <span className="kr-topbar-level"><StatBadge label="Nível" value="47" color="#38bdf8" /></span>
        <StatBadge label="XP" value="32.780" color="#a78bfa" />
        <div
          style={{
            width: 1,
            height: 28,
            background: "#334155",
            margin: "0 4px",
          }}
        />
        <div style={{ textAlign: "right", lineHeight: 1.3 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0", fontVariantNumeric: "tabular-nums" }}>
            09:42
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: "0.04em" }}>
            Terça, 21 de Maio
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div style={{ textAlign: "center", lineHeight: 1.2 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
      <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: "0.05em" }}>
        {label}
      </div>
    </div>
  );
}
