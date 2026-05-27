import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiGet } from "../lib/api/client";

// --- Tipos ---
export type DriftState = "on-mission" | "drifting" | "lost" | "zombie";

export interface DriftStatus {
  driftState: DriftState;
  minutesOff: number;
  originalMission: string;
  nudgeMessage: string;
}

// --- Schema do endpoint /context/lost ---
const ContextLostEventSchema = z.object({
  timestamp: z.string().optional(),
  duration_minutes: z.number().optional(),
  original_context: z.string().optional(),
  reason: z.string().optional(),
});

const ContextLostResponseSchema = z.object({
  source: z.string().optional(),
  data: z.array(ContextLostEventSchema).nullable(),
  meta: z.record(z.unknown()).optional(),
});

// --- Mensagens de nudge por threshold (sem culpa, sem sermão) ---
const NUDGE_MESSAGES: Record<DriftState, string> = {
  "on-mission": "",
  "drifting": "Você saiu da missão há pouco. Quer retomar?",
  "lost": "Perdeu o fio? Seu último checkpoint está aqui.",
  "zombie": "Missão sem atividade há muito tempo. Retomar ou arquivar?",
};

// --- Hook ---
export function useDriftDetection(): DriftStatus {
  const [minutesOff, setMinutesOff] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  // Rastreia quais thresholds já exibiram nudge nesta sessão
  const nudgedThresholds = useRef<Set<DriftState>>(new Set());

  // Fetch /context/lost
  const { data: lostData } = useQuery({
    queryKey: ["context", "lost"],
    queryFn: async () => {
      const result = await apiGet("/context/lost");
      if (!result.ok) return null;
      const parsed = ContextLostResponseSchema.safeParse(result.raw);
      return parsed.success ? parsed.data : null;
    },
    staleTime: 60_000,
    retry: false,
  });

  // Detectar visibilidade da janela
  useEffect(() => {
    if (typeof document === "undefined") return;
    const handler = () => setIsVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // Timer que incrementa minutesOff quando janela está oculta
  useEffect(() => {
    if (isVisible) return; // janela em foco — não conta drift
    const interval = setInterval(() => {
      setMinutesOff((prev) => prev + 1);
    }, 60_000);
    return () => clearInterval(interval);
  }, [isVisible]);

  // Resetar minutesOff quando janela volta ao foco
  useEffect(() => {
    if (isVisible) setMinutesOff(0);
  }, [isVisible]);

  // Derivar originalMission do último evento /context/lost
  const lastEvent = lostData?.data?.[0];
  const backendMinutes = lastEvent?.duration_minutes ?? 0;
  const originalMission = lastEvent?.original_context ?? "Missão anterior";

  // Usar o maior entre backend e timer local
  const effectiveMinutes = Math.max(minutesOff, backendMinutes);

  // Derivar driftState
  const driftState: DriftState =
    effectiveMinutes >= 45
      ? "zombie"
      : effectiveMinutes >= 20
        ? "lost"
        : effectiveMinutes >= 10
          ? "drifting"
          : "on-mission";

  // Nudge: só emite uma vez por threshold por sessão
  const nudgeMessage =
    nudgedThresholds.current.has(driftState) || driftState === "on-mission"
      ? ""
      : NUDGE_MESSAGES[driftState];

  useEffect(() => {
    if (driftState === "on-mission") {
      nudgedThresholds.current.clear();
    } else if (!nudgedThresholds.current.has(driftState)) {
      nudgedThresholds.current.add(driftState);
    }
  }, [driftState]);

  return {
    driftState,
    minutesOff: effectiveMinutes,
    originalMission,
    nudgeMessage,
  };
}
