import { useEffect, useRef, useState } from "react";
import IconGlyph from "../ui/IconGlyph";

interface Props {
  open: boolean;
  onClose: () => void;
}

const QUICK_ACTIONS = [
  { label: "Abrir Omnis", icon: "eye" },
  { label: "Abrir Akasha", icon: "database" },
  { label: "Abrir Agenda", icon: "star" },
  { label: "Ver Finanças", icon: "coin" },
];

export default function SpotlightModal({ open, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
    }
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
          background: "rgba(0, 0, 0, 0.55)",
          zIndex: 200,
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-label="Nimbus — busca rápida"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 440,
          maxWidth: "calc(100% - 32px)",
          background: "#1e293b",
          border: "1px solid #334155",
          borderRadius: 16,
          boxShadow: "0 0 48px rgba(0, 0, 0, 0.4)",
          zIndex: 201,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px 8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(56, 189, 248, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#38bdf8",
              }}
            >
              <IconGlyph name="zap" size={20} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>
              NIMBUS
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Fechar Nimbus"
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

        <div style={{ padding: "8px 20px 0", fontSize: 12, color: "#94a3b8" }}>
          Vá para onde precisar.
        </div>

        {/* Input */}
        <div style={{ padding: "12px 20px" }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                console.log(`Nimbus command: ${query}`);
                setQuery("");
                onClose();
              }
            }}
            placeholder="Digite uma área, missão ou comando..."
            aria-label="Buscar área ou missão"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #334155",
              borderRadius: 10,
              background: "#0f172a",
              color: "#e2e8f0",
              fontSize: 14,
              outline: "none",
              lineHeight: 1.4,
            }}
          />
        </div>

        {/* Quick actions */}
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>
            AÇÕES RÁPIDAS
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={() => {
                  console.log(`Nimbus quick: ${a.label}`);
                  onClose();
                }}
                style={{
                  minHeight: 44,
                  padding: "8px 14px",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  background: "rgba(30, 41, 59, 0.7)",
                  color: "#cbd5e1",
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <IconGlyph name={a.icon} size={16} />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
