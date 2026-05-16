import IconGlyph from "../ui/IconGlyph";

interface Props {
  onOpen?: () => void;
}

export default function NimbusCard({ onOpen }: Props) {
  return (
    <button
      onClick={() => {
        console.log("Nimbus: open spotlight");
        onOpen?.();
      }}
      aria-label="Nimbus — Sua vassoura mágica"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        minHeight: 44,
        background: "rgba(56, 189, 248, 0.06)",
        border: "1px solid #334155",
        borderRadius: 10,
        padding: "8px 12px",
        cursor: "pointer",
        color: "#cbd5e1",
      }}
    >
      <IconGlyph name="sparkle" size={22} />
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.06em" }}>
          NIMBUS
        </div>
        <div style={{ fontSize: 10, color: "#94a3b8" }}>
          Sua vassoura mágica — Vá para onde precisar.
        </div>
      </div>
    </button>
  );
}
