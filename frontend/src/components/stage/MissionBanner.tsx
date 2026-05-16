export default function MissionBanner() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        padding: "20px 32px",
        background: "rgba(15, 23, 42, 0.85)",
        border: "1px solid #f59e0b",
        borderRadius: 16,
        boxShadow: "0 0 24px rgba(245, 158, 11, 0.10), 0 0 48px rgba(245, 158, 11, 0.04)",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#f59e0b",
          letterSpacing: "0.15em",
          marginBottom: 6,
        }}
      >
        MISSÃO ATUAL
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "#e2e8f0",
          letterSpacing: "0.04em",
          lineHeight: 1.3,
        }}
      >
        CONSTRUIR O FUTURO
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 400,
          color: "#94a3b8",
          marginTop: 4,
          fontStyle: "italic",
        }}
      >
        ENQUANTO VIVO O PRESENTE
      </div>
    </div>
  );
}
