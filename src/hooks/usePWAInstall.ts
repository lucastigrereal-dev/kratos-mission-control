/**
 * usePWAInstall — W6-B2b
 *
 * Captura o evento beforeinstallprompt do browser.
 * Mostra prompt de instalação após 3 visitas.
 * Persiste contagem em localStorage.
 * Expõe: canInstall, prompt(), dismiss()
 */

import { useState, useEffect, useCallback, useRef } from "react";

const VISIT_KEY = "kratos.pwa.visit_count";
const DISMISSED_KEY = "kratos.pwa.install_dismissed";
const INSTALL_THRESHOLD = 3;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt(): Promise<void>;
}

export interface UsePWAInstallReturn {
  /** true quando o browser suporta install E já atingiu o threshold de visitas */
  canInstall: boolean;
  /** Chamar para abrir o prompt nativo do browser */
  triggerInstall: () => Promise<void>;
  /** Chamar para dispensar — não mostra mais nesta sessão */
  dismiss: () => void;
}

export function usePWAInstall(): UsePWAInstallReturn {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Incrementa contagem de visitas
    try {
      const raw = localStorage.getItem(VISIT_KEY);
      const count = raw ? parseInt(raw, 10) : 0;
      const next = count + 1;
      localStorage.setItem(VISIT_KEY, String(next));

      // Se já dispensou, não mostra
      const dismissed = localStorage.getItem(DISMISSED_KEY) === "1";
      if (dismissed) return;

      // Só habilita depois do threshold
      if (next < INSTALL_THRESHOLD) return;
    } catch {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Se já estava instalado, desabilita
    window.addEventListener("appinstalled", () => {
      deferredPrompt.current = null;
      setCanInstall(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === "accepted") {
      deferredPrompt.current = null;
      setCanInstall(false);
    }
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* noop */
    }
    setCanInstall(false);
  }, []);

  return { canInstall, triggerInstall, dismiss };
}
