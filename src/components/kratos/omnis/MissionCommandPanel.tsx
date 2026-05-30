/**
 * MissionCommandPanel — W19-B06
 *
 * Painel de envio de missão ao OMNIS em modo dry-run.
 * Features:
 *   - Campo de comando livre
 *   - Quick Commands (5 predefinidos)
 *   - Preview do payload que seria enviado
 *   - Human Approval Gate integrado
 *   - Source badge sempre visível (dry_run / live_unavailable)
 *   - Zero execução real
 *
 * Boundary: KRATOS vê. Lucas decide. OMNIS não é chamado.
 */
import { useRef, type KeyboardEvent } from "react";
import {
  Terminal,
  Zap,
  Eye,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Loader2,
  Code2,
} from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { HumanApprovalGate } from "./HumanApprovalGate";
import { useOmnisWriteBridge } from "@/hooks/useOmnisWriteBridge";
import { QUICK_COMMANDS } from "../../../../api-contract/omnis-write-bridge.schema";

const accent = "var(--kr-island-omnis)";

// ── Source Badge ──────────────────────────────────────────────────────────────

function ModeBadge({ source }: { source: "dry_run" | "mock" | "live_unavailable" }) {
  const label = source === "dry_run" ? "DRY-RUN" : source === "mock" ? "MOCK" : "OMNIS OFFLINE";
  const color = source === "live_unavailable" ? "var(--kratos-critical)" : "var(--kratos-warn)";
  return (
    <span
      className="rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
      style={{
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        color,
        border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
      }}
    >
      {label}
    </span>
  );
}

// ── Payload Preview ───────────────────────────────────────────────────────────

function PayloadPreview({ payload }: { payload: Record<string, unknown> }) {
  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: "color-mix(in srgb, var(--kratos-surface-3) 60%, transparent)",
        border: "1px solid color-mix(in srgb, var(--kratos-text-muted) 8%, transparent)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Code2 className="h-3.5 w-3.5" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--kratos-text-muted)" }}>
          Payload preview (não enviado)
        </span>
      </div>
      <pre
        className="text-[10px] overflow-x-auto whitespace-pre-wrap break-words"
        style={{ color: "var(--kratos-text-secondary)", fontFamily: "var(--kr-font-mono, monospace)" }}
      >
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}

// ── Dry Run Result ────────────────────────────────────────────────────────────

function DryRunResult({
  mock,
  requestId,
}: {
  mock: NonNullable<import("../../../../api-contract/omnis-write-bridge.schema").ExecutionResponse["mock_response"]>;
  requestId: string;
}) {
  return (
    <div
      className="rounded-lg px-4 py-3 space-y-2"
      style={{
        background: "color-mix(in srgb, var(--kratos-ok) 6%, transparent)",
        border: "1px solid color-mix(in srgb, var(--kratos-ok) 20%, transparent)",
      }}
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4" style={{ color: "var(--kratos-ok)" }} aria-hidden />
        <span className="text-[12px] font-semibold" style={{ color: "var(--kratos-ok)" }}>
          Dry-Run Concluído
        </span>
        <span className="text-[9px] ml-auto" style={{ color: "var(--kratos-text-muted)" }}>
          {requestId.slice(-8)}
        </span>
      </div>
      {mock.note && (
        <p className="text-[11px]" style={{ color: "var(--kratos-text-secondary)" }}>
          {mock.note}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <p className="text-[9px] uppercase" style={{ color: "var(--kratos-text-muted)" }}>Duração estimada</p>
          <p className="text-[12px] font-medium" style={{ color: "var(--kratos-text-primary)" }}>
            {mock.estimated_duration_ms != null ? `~${(mock.estimated_duration_ms / 1000).toFixed(1)}s` : "—"}
          </p>
        </div>
        <div>
          <p className="text-[9px] uppercase" style={{ color: "var(--kratos-text-muted)" }}>Tokens estimados</p>
          <p className="text-[12px] font-medium" style={{ color: "var(--kratos-text-primary)" }}>
            {mock.estimated_tokens != null ? `~${mock.estimated_tokens.toLocaleString("pt-BR")}` : "—"}
          </p>
        </div>
      </div>
      {mock.warnings.map((w, i) => (
        <p key={i} className="text-[10px] flex items-start gap-1" style={{ color: "var(--kratos-warn)" }}>
          <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" aria-hidden />
          {w}
        </p>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function MissionCommandPanel() {
  const bridge = useOmnisWriteBridge();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (bridge.phase === "idle" || bridge.phase === "previewing") {
        bridge.preview();
      }
    }
    if (e.key === "Escape") {
      bridge.reset();
      inputRef.current?.blur();
    }
  }

  return (
    <KratosCard
      header={
        <div className="flex items-center justify-between w-full">
          <SectionTitle icon={Terminal} title="Mission Command" />
          <ModeBadge source={bridge.sourceBadge} />
        </div>
      }
    >
      <div className="space-y-4">
        {/* Disclaimer */}
        <div
          className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-[11px]"
          style={{
            background: "color-mix(in srgb, var(--kratos-warn) 6%, transparent)",
            border: "1px solid color-mix(in srgb, var(--kratos-warn) 15%, transparent)",
          }}
        >
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "var(--kratos-warn)" }} aria-hidden />
          <span style={{ color: "var(--kratos-text-secondary)" }}>
            <strong style={{ color: "var(--kratos-warn)" }}>Modo Dry-Run:</strong>{" "}
            nenhum comando será executado no OMNIS real. Todo envio exige aprovação de Lucas.
          </span>
        </div>

        {/* Quick Commands */}
        <div>
          <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--kratos-text-muted)" }}>
            Comandos rápidos
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_COMMANDS.map((cmd) => (
              <button
                key={cmd.id}
                type="button"
                onClick={() => bridge.setCommandText(cmd.label)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] transition-colors"
                style={{
                  background: bridge.commandText === cmd.label
                    ? `color-mix(in srgb, ${accent} 15%, transparent)`
                    : "color-mix(in srgb, var(--kratos-surface-3) 60%, transparent)",
                  color: bridge.commandText === cmd.label ? accent : "var(--kratos-text-secondary)",
                  border: `1px solid ${bridge.commandText === cmd.label
                    ? `color-mix(in srgb, ${accent} 25%, transparent)`
                    : "color-mix(in srgb, var(--kratos-text-muted) 10%, transparent)"}`,
                }}
              >
                <Zap className="h-3 w-3" aria-hidden />
                {cmd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Command input */}
        <div
          className="rounded-xl p-3"
          style={{
            background: "color-mix(in srgb, var(--kratos-surface-3) 80%, transparent)",
            border: `1px solid color-mix(in srgb, ${accent} 15%, var(--kratos-text-muted) 8%)`,
          }}
        >
          <textarea
            ref={inputRef}
            value={bridge.commandText}
            onChange={(e) => bridge.setCommandText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite o comando para o OMNIS… ex: 'Gerar briefing matinal do dia'"
            rows={3}
            className="w-full bg-transparent text-[13px] outline-none resize-none placeholder:text-[13px]"
            style={{ color: "var(--kratos-text-primary)" }}
            aria-label="Comando de missão"
            spellCheck={false}
          />
          <p className="text-[9px] mt-1" style={{ color: "var(--kratos-text-muted)" }}>
            Ctrl+Enter para preview • Esc para limpar
          </p>
        </div>

        {/* Error */}
        {bridge.error && bridge.phase === "error" && (
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[11px]"
            style={{
              background: "color-mix(in srgb, var(--kratos-critical) 8%, transparent)",
              border: "1px solid color-mix(in srgb, var(--kratos-critical) 20%, transparent)",
              color: "var(--kratos-critical)",
            }}
          >
            <XCircle className="h-4 w-4 shrink-0" aria-hidden />
            {bridge.error}
          </div>
        )}

        {/* Preview button */}
        {(bridge.phase === "idle" || bridge.phase === "previewing") && bridge.commandText.trim().length >= 3 && (
          <button
            type="button"
            onClick={bridge.preview}
            disabled={bridge.phase === "previewing"}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-[12px] font-semibold transition-all w-full justify-center"
            style={{
              background: `color-mix(in srgb, ${accent} 15%, transparent)`,
              color: accent,
              border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
            }}
          >
            {bridge.phase === "previewing" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
            Preview do Payload
          </button>
        )}

        {/* Payload preview */}
        {bridge.previewResponse?.payload_preview && bridge.phase !== "done" && (
          <PayloadPreview payload={bridge.previewResponse.payload_preview} />
        )}

        {/* Human Approval Gate */}
        {bridge.phase === "gate_pending" && bridge.gate && (
          <HumanApprovalGate
            gate={bridge.gate}
            onApprove={bridge.approveGate}
            onReject={bridge.rejectGate}
            validationError={bridge.error}
          />
        )}

        {/* Gate approved → execute button */}
        {bridge.gate?.status === "approved" && bridge.phase === "gate_pending" && (
          <button
            type="button"
            onClick={bridge.executeApproved}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-[12px] font-semibold transition-all w-full justify-center"
            style={{
              background: "color-mix(in srgb, var(--kratos-ok) 15%, transparent)",
              color: "var(--kratos-ok)",
              border: "1px solid color-mix(in srgb, var(--kratos-ok) 25%, transparent)",
            }}
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
            Executar Dry-Run
          </button>
        )}

        {/* Executing */}
        {bridge.phase === "executing" && (
          <div className="flex items-center gap-2 justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: accent }} aria-hidden />
            <span className="text-[12px]" style={{ color: "var(--kratos-text-secondary)" }}>
              Processando dry-run…
            </span>
          </div>
        )}

        {/* Dry Run Result */}
        {bridge.phase === "done" && bridge.dryRunResponse?.mock_response && (
          <DryRunResult
            mock={bridge.dryRunResponse.mock_response}
            requestId={bridge.dryRunResponse.request_id}
          />
        )}

        {/* Rejected */}
        {bridge.phase === "rejected" && (
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[11px]"
            style={{
              background: "color-mix(in srgb, var(--kratos-text-muted) 8%, transparent)",
              border: "1px solid color-mix(in srgb, var(--kratos-text-muted) 15%, transparent)",
              color: "var(--kratos-text-muted)",
            }}
          >
            <XCircle className="h-4 w-4 shrink-0" aria-hidden />
            Execução cancelada por Lucas.
          </div>
        )}

        {/* Reset button (post-done/rejected) */}
        {(bridge.phase === "done" || bridge.phase === "rejected") && (
          <button
            type="button"
            onClick={bridge.reset}
            className="flex items-center gap-1.5 text-[11px] transition-opacity hover:opacity-70 mx-auto"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Novo comando
          </button>
        )}
      </div>
    </KratosCard>
  );
}
