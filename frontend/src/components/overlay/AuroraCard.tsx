import CardShell from "../ui/CardShell";

interface Props {
  onChatClick?: () => void;
}

export default function AuroraCard({ onChatClick }: Props) {
  return (
    <CardShell>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
            color: "#e2e8f0",
            flexShrink: 0,
          }}
        >
          A
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.06em" }}>
            AURORA
          </div>
          <div style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>
            ONLINE
          </div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.4, marginBottom: 8 }}>
        Estou aqui para te ajudar a focar no que realmente importa hoje.
      </div>
      <button
        onClick={() => {
          console.log("Aurora: open chat");
          onChatClick?.();
        }}
        aria-label="Falar com Aurora"
        style={{
          width: "100%",
          minHeight: 44,
          padding: "6px 0",
          border: "1px solid #7c3aed",
          borderRadius: 6,
          background: "rgba(124, 58, 237, 0.12)",
          color: "#c4b5fd",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Falar com Aurora
      </button>
    </CardShell>
  );
}
