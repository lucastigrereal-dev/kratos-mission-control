import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

const SHORTCUTS: Record<string, string> = {
  "1": "/",
  "2": "/agora",
  "3": "/agenda",
  "4": "/checkpoints",
  "5": "/projetos",
  "6": "/contexto",
  "7": "/sistema",
};

function isEditableElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useGlobalShortcuts(): void {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isEditableElement(document.activeElement)) return;

      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("kratos:toggle-aurora"));
        return;
      }

      const route = SHORTCUTS[e.key];
      if (route) {
        e.preventDefault();
        navigate({ to: route });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);
}
