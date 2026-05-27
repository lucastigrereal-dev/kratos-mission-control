/**
 * useSSEToasts — dispara notificações sonner quando o OMNIS reporta eventos críticos.
 *
 * Observa as missões via useMissions() e emite toasts quando:
 * - budget_exceeded muda de false → true (nova missão com budget estourado)
 * - approval_pending muda de false → true (nova aprovação pendente)
 * - status muda para "failed" (missão falhou)
 *
 * Cada alerta é disparado apenas UMA vez por sessão (useRef para deduplicação).
 * Posicionado bottom-right via Toaster no __root.tsx — TDAH-first.
 *
 * READ-ONLY: apenas lê estado do OMNIS, nunca comanda.
 */
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useMissions } from "./useMissions";

const TOAST_DURATION_GUARDRAIL = 10_000; // 10s para alertas críticos
const TOAST_DURATION_INFO = 5_000;

export function useSSEToasts(): void {
  const { missions } = useMissions(20);
  // Deduplication: armazena chaves de alertas já emitidos nesta sessão
  const seenRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const m of missions) {
      // Budget excedido → toast crítico
      if (m.budget_exceeded) {
        const key = `budget:${m.mission_id}`;
        if (!seenRef.current.has(key)) {
          seenRef.current.add(key);
          toast.error(`Budget excedido — ${m.title}`, {
            description: "O limite de custo foi atingido. Revise no OMNIS Lab.",
            duration: TOAST_DURATION_GUARDRAIL,
          });
        }
      }

      // Aprovação pendente → toast warning
      if (m.approval_pending) {
        const key = `approval:${m.mission_id}`;
        if (!seenRef.current.has(key)) {
          seenRef.current.add(key);
          toast.warning(`Aprovação necessária — ${m.title}`, {
            description:
              m.approval_reason ??
              "Missão aguardando aprovação para continuar.",
            duration: TOAST_DURATION_GUARDRAIL,
          });
        }
      }

      // Missão falhou → toast error (apenas para missões que não estavam em failed antes)
      if (m.status === "failed") {
        const key = `failed:${m.mission_id}`;
        if (!seenRef.current.has(key)) {
          seenRef.current.add(key);
          toast.error(`Missão falhou — ${m.title}`, {
            description: m.last_error ?? "Verifique os logs no OMNIS Lab.",
            duration: TOAST_DURATION_GUARDRAIL,
          });
        }
      }

      // Missão completou → toast success
      if (m.status === "completed") {
        const key = `completed:${m.mission_id}`;
        if (!seenRef.current.has(key)) {
          seenRef.current.add(key);
          toast.success(`Missão concluída — ${m.title}`, {
            duration: TOAST_DURATION_INFO,
          });
        }
      }
    }
  }, [missions]);
}
