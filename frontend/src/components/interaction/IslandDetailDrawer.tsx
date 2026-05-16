import { useEffect, useRef } from "react";
import type { HotspotDef } from "../stage/IslandHotspot";

interface Props {
  island: HotspotDef | null;
  open: boolean;
  onClose: () => void;
}

export default function IslandDetailDrawer({ island, open, onClose }: Props) {
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

  if (!open || !island) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)",
          zIndex: 200,
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label={`Detalhes: ${island.name}`}
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 460,
          maxWidth: "calc(100% - 32px)",
          maxHeight: "60%",
          background: "#1e293b",
          border: "1px solid #334155",
          borderBottom: "none",
          borderRadius: "16px 16px 0 0",
          boxShadow: "0 -4px 32px rgba(0, 0, 0, 0.35)",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "16px 20px 12px",
            borderBottom: "1px solid #334155",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.04em" }}>
              {island.name}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
              {island.category}
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Fechar detalhes"
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
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Actions */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          <ActionBtn
            label="Abrir área"
            onClick={() => {
              console.log(`Island action: abrir ${island.name}`);
              onClose();
            }}
          />
          <ActionBtn
            label="Ver missões"
            onClick={() => {
              console.log(`Island action: missões ${island.name}`);
              onClose();
            }}
          />
          <ActionBtn
            label="Pedir ajuda à Aurora"
            onClick={() => {
              console.log(`Island action: pedir Aurora sobre ${island.name}`);
              onClose();
            }}
          />
        </div>
      </div>
    </>
  );
}

function ActionBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: 44,
        padding: "10px 16px",
        textAlign: "left",
        border: "1px solid #334155",
        borderRadius: 8,
        background: "rgba(30, 41, 59, 0.7)",
        color: "#cbd5e1",
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
