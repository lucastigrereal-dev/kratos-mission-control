/**
 * useOmnisWriteBridge — Hook para o Write Bridge KRATOS → OMNIS
 * W19 — Dry-run mode, human gate required
 *
 * Nunca chama o OMNIS real. Toda resposta é mock/dry_run.
 * Source badge sempre visível: "dry_run" | "mock" | "live_unavailable".
 */

import { useState, useCallback } from "react";
import {
  previewCommand,
  sendDryRun,
  getWriteBridgeConfig,
} from "@/lib/omnis-write-bridge";
import type {
  MissionCommand,
  ExecutionResponse,
  HumanApprovalGate,
  WriteBridgeConfig,
} from "../../api-contract/omnis-write-bridge.schema";

// ── Types ─────────────────────────────────────────────────────────────────────

export type BridgePhase =
  | "idle"          // nenhum comando digitado
  | "previewing"    // comando digitado, aguardando preview
  | "gate_pending"  // preview feito, aguardando aprovação humana
  | "executing"     // aprovado, executando dry-run
  | "done"          // dry-run completo
  | "rejected"      // gate rejeitado
  | "error";        // erro de validação

export interface OmnisWriteBridgeState {
  phase: BridgePhase;
  config: WriteBridgeConfig;
  commandText: string;
  previewResponse: ExecutionResponse | null;
  gate: HumanApprovalGate | null;
  dryRunResponse: ExecutionResponse | null;
  error: string | null;
  /** SourceBadge label para exibição */
  sourceBadge: "dry_run" | "mock" | "live_unavailable";
  /** Actions */
  setCommandText: (text: string) => void;
  preview: () => void;
  approveGate: (checkedIds: string[]) => void;
  rejectGate: () => void;
  executeApproved: () => void;
  reset: () => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useOmnisWriteBridge(targetSkill?: string): OmnisWriteBridgeState {
  const config = getWriteBridgeConfig();
  const [phase, setPhase] = useState<BridgePhase>("idle");
  const [commandText, setCommandTextState] = useState("");
  const [previewResponse, setPreviewResponse] = useState<ExecutionResponse | null>(null);
  const [gate, setGate] = useState<HumanApprovalGate | null>(null);
  const [dryRunResponse, setDryRunResponse] = useState<ExecutionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setCommandText = useCallback((text: string) => {
    setCommandTextState(text);
    if (phase !== "idle" && phase !== "previewing") {
      // reset se estava em fase avançada
      setPhase("idle");
      setPreviewResponse(null);
      setGate(null);
      setDryRunResponse(null);
      setError(null);
    }
  }, [phase]);

  const preview = useCallback(() => {
    const command: MissionCommand = {
      command: commandText.trim(),
      target_skill: targetSkill,
      requested_mode: "dry_run",
    };

    setPhase("previewing");
    setError(null);

    const result = previewCommand(command);

    if (!result.ok) {
      setError(result.error ?? "Erro ao gerar preview");
      setPhase("error");
      return;
    }

    setPreviewResponse(result.response);
    setGate(result.gate ?? null);
    setPhase("gate_pending");
  }, [commandText, targetSkill]);

  const approveGate = useCallback((checkedIds: string[]) => {
    if (!gate) return;

    // Verificar que todos os itens required estão marcados
    const requiredIds = gate.checklist.filter((c) => c.required).map((c) => c.id);
    const allRequiredChecked = requiredIds.every((id) => checkedIds.includes(id));

    if (!allRequiredChecked) {
      setError("Marque todos os itens obrigatórios antes de aprovar");
      return;
    }

    setGate((prev) => prev ? { ...prev, status: "approved" } : null);
    setError(null);
  }, [gate]);

  const rejectGate = useCallback(() => {
    setGate((prev) => prev ? { ...prev, status: "rejected" } : null);
    setPhase("rejected");
  }, []);

  const executeApproved = useCallback(() => {
    if (!gate || gate.status !== "approved") {
      setError("Gate não aprovado");
      return;
    }

    const command: MissionCommand = {
      command: commandText.trim(),
      target_skill: targetSkill,
      requested_mode: "dry_run",
    };

    setPhase("executing");

    const result = sendDryRun(command, gate);

    if (!result.ok) {
      setError(result.error ?? "Erro na execução dry-run");
      setPhase("error");
      return;
    }

    setDryRunResponse(result.response);
    setPhase("done");
  }, [gate, commandText, targetSkill]);

  const reset = useCallback(() => {
    setCommandTextState("");
    setPhase("idle");
    setPreviewResponse(null);
    setGate(null);
    setDryRunResponse(null);
    setError(null);
  }, []);

  // Source badge derivado do estado
  const sourceBadge: OmnisWriteBridgeState["sourceBadge"] =
    dryRunResponse?.source === "dry_run" ? "dry_run"
    : config.omnis_base_url_configured === false ? "live_unavailable"
    : "mock";

  return {
    phase,
    config,
    commandText,
    previewResponse,
    gate,
    dryRunResponse,
    error,
    sourceBadge,
    setCommandText,
    preview,
    approveGate,
    rejectGate,
    executeApproved,
    reset,
  };
}
