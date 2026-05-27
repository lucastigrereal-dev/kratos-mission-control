/**
 * OfflineBanner — W6-B2a
 * Barra slim que aparece quando navigator.onLine = false.
 * Posição: fixa no topo do main (não bloqueia nav).
 * TDAH-first: ambar, não vermelho — aviso, não alarme.
 */

import { WifiOff } from "lucide-react";
import { useOffline } from "@/hooks/useOffline";

export function OfflineBanner() {
  const offline = useOffline();

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-0 right-0 z-[9000] flex items-center justify-center gap-2 px-4 py-1.5 text-[11px] font-medium"
      style={{
        top: 90, // abaixo do TopBar
        background: "var(--kr-warning, #D97706)",
        color: "#000",
        borderBottom: "1px solid rgba(0,0,0,0.15)",
      }}
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      <span>Offline — exibindo dados salvos. Reconectará automaticamente.</span>
    </div>
  );
}
