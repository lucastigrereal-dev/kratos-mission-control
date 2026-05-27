/**
 * PWAInstallPrompt — W6-B2b
 *
 * Chip sutil de instalação — aparece no bottom-left após 3 visitas.
 * TDAH-first: nunca no centro, nunca modal. Bottom-left, não intrusivo.
 * Só aparece se o browser suportar A2HS (desktop Chrome/Edge, Android).
 */

import { Download, X } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export function PWAInstallPrompt() {
  const { canInstall, triggerInstall, dismiss } = usePWAInstall();

  if (!canInstall) return null;

  return (
    <div
      role="complementary"
      aria-label="Instalar KRATOS como aplicativo"
      className="fixed bottom-20 left-4 z-[9000] flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] shadow-lg"
      style={{
        background: "var(--kratos-surface-3, #0d2035)",
        border: "1px solid var(--kratos-border, rgba(255,255,255,0.08))",
        color: "var(--kratos-text-primary)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        // Respeita bottom dock (72px) com folga
      }}
    >
      <Download
        className="h-3.5 w-3.5 shrink-0"
        style={{ color: "var(--kratos-accent)" }}
      />
      <span style={{ color: "var(--kratos-text-secondary)" }}>
        Instalar KRATOS
      </span>
      <button
        type="button"
        onClick={triggerInstall}
        className="ml-1 rounded px-2 py-0.5 text-[10px] font-medium transition-colors hover:opacity-80"
        style={{
          background: "var(--kratos-accent)",
          color: "var(--kratos-surface-0, #030B19)",
        }}
      >
        Instalar
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dispensar"
        className="ml-0.5 rounded p-0.5 transition-opacity hover:opacity-70"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
