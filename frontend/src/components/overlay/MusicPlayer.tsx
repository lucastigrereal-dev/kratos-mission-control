import IconGlyph from "../ui/IconGlyph";

export default function MusicPlayer() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {/* Cover art */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 8,
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#1e293b",
          flexShrink: 0,
        }}
      >
        <IconGlyph name="music" size={22} />
      </div>

      {/* Track info */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>
          Koopa Road
        </div>
        <div style={{ fontSize: 10, color: "#94a3b8" }}>
          Super Mario 64 &middot; 1:32 / 3:20
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <CtrlBtn icon="skip-back" label="Faixa anterior" />
        <CtrlBtn
          icon="play"
          label="Tocar ou pausar trilha sonora"
          onClick={() => console.log("Music: toggle play")}
          active
        />
        <CtrlBtn icon="skip-forward" label="Próxima faixa" />
      </div>
    </div>
  );
}

function CtrlBtn({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: 44,
        height: 44,
        minWidth: 44,
        minHeight: 44,
        borderRadius: "50%",
        border: "none",
        background: active ? "rgba(56, 189, 248, 0.15)" : "transparent",
        color: active ? "#38bdf8" : "#cbd5e1",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      <IconGlyph name={icon} size={18} />
    </button>
  );
}
