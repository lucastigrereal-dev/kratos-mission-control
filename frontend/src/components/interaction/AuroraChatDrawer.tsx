import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  "Revisar foco do dia",
  "Abrir Omnis Lab",
  "Ver agenda",
  "Organizar próximas missões",
];

export default function AuroraChatDrawer({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 200,
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Aurora assistente"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 340,
          maxWidth: "100%",
          background: "#1e293b",
          borderLeft: "1px solid #334155",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "kr-drawer-in 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #334155",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
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
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>
                AURORA
              </div>
              <div style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>
                ONLINE
              </div>
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Fechar chat da Aurora"
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "#94a3b8",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: "16px 20px", overflow: "auto" }}>
          <div
            style={{
              background: "rgba(124, 58, 237, 0.12)",
              border: "1px solid rgba(124, 58, 237, 0.25)",
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 13,
              color: "#e2e8f0",
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            Estou aqui. Qual frente você quer atacar agora?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  console.log(`Aurora suggestion: ${s}`);
                  onClose();
                }}
                style={{
                  width: "100%",
                  minHeight: 44,
                  textAlign: "left",
                  padding: "10px 16px",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  background: "rgba(30, 41, 59, 0.7)",
                  color: "#cbd5e1",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
