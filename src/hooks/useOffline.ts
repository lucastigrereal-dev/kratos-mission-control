/**
 * useOffline — W6-B2a
 * Detecta estado de conexão do browser.
 * Reativo: ouve online/offline events do window.
 */

import { useState, useEffect } from "react";

export function useOffline(): boolean {
  const [offline, setOffline] = useState<boolean>(
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );

  useEffect(() => {
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return offline;
}
