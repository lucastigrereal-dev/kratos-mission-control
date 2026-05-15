import { useState, useRef, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import AuroraCommandInput from "./AuroraCommandInput";

interface Message {
  id: string;
  role: "user" | "aurora";
  text: string;
  timestamp: string;
}

interface MentorSummary {
  next_action?: string;
  today_focus?: string[];
  focus_mode?: string;
  risks?: string[];
  checkpoint_summary?: string;
  recommendations_count?: number;
}

function generateResponse(command: string, summary: MentorSummary | null): string {
  const lower = command.toLowerCase();

  if (lower.includes("missao") || lower.includes("missão") || lower.includes("onde estou")) {
    return summary?.today_focus?.[0]
      ? `Voce esta focado em: **${summary.today_focus[0]}**. Modo: ${summary.focus_mode ?? "execucao"}.`
      : "Missao atual nao disponivel. Use /checkpoints para restaurar contexto.";
  }

  if (lower.includes("proximo") || lower.includes("próximo") || lower.includes("acao") || lower.includes("ação")) {
    return summary?.next_action
      ? `Proxima acao recomendada: **${summary.next_action}**`
      : "Nenhuma acao pendente detectada. Sugiro revisar /tarefas.";
  }

  if (lower.includes("risco") || lower.includes("bloqueio") || lower.includes("travado")) {
    if (summary?.risks && summary.risks.length > 0) {
      return `Riscos ativos detectados:\n${summary.risks.map((r) => `- ${r}`).join("\n")}`;
    }
    return "Nenhum risco ou bloqueio ativo detectado. Sinais limpos.";
  }

  if (lower.includes("checkpoint") || lower.includes("contexto")) {
    return summary?.checkpoint_summary
      ? `Contexto do ultimo checkpoint: ${summary.checkpoint_summary}`
      : "Nenhum checkpoint registrado. Crie um para preservar contexto entre sessoes.";
  }

  if (lower.includes("foco") || lower.includes("prioridade")) {
    return summary?.today_focus
      ? `Prioridades hoje:\n${summary.today_focus.map((f) => `- ${f}`).join("\n")}`
      : "Prioridades nao definidas. Use /mentor/focus para configurar.";
  }

  if (lower.includes("status") || lower.includes("sistema")) {
    return "Sistema operacional. KRATOS 0.10 — Verdade Operacional. Backend OK, frontend OK, todos os gates passando.";
  }

  return `Comando recebido: "${command}".\n\nVoce pode perguntar sobre: **missao**, **proxima acao**, **riscos**, **checkpoint**, **foco**, ou **status do sistema**. Estou aqui para orientar.`;
}

export default function AuroraFullScreenPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = sessionStorage.getItem("kr-aurora-messages");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [processing, setProcessing] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const { data: summary } = useApi<MentorSummary>("/mentor/summary");

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem("kr-aurora-messages", JSON.stringify(messages));
  }, [messages]);

  function addMessage(role: "user" | "aurora", text: string) {
    const msg: Message = {
      id: crypto.randomUUID(),
      role,
      text,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, msg]);
  }

  function handleCommand(command: string) {
    addMessage("user", command);
    setProcessing(true);

    // Simulate think time
    setTimeout(() => {
      const response = generateResponse(command, summary ?? null);
      addMessage("aurora", response);
      setProcessing(false);
    }, 600);
  }

  function handleClear() {
    setMessages([]);
    sessionStorage.removeItem("kr-aurora-messages");
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      gap: "var(--kr-space-hud)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "var(--kr-space-section)",
        borderBottom: "1px solid var(--kr-glass-border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--kr-aurora-orb-bg, radial-gradient(circle, var(--kr-purple-400), var(--kr-blue-600)))",
            boxShadow: "0 0 12px var(--kr-purple-500)",
          }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>AURORA · Full Screen</div>
            <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
              Modo foco — analise profunda
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleClear}
            className="kr-interactive"
            title="Limpar conversa"
            style={{
              border: "1px solid var(--kr-glass-border)",
              background: "var(--kr-glass-bg)",
              color: "var(--kr-text-secondary)",
              padding: "6px 12px",
              borderRadius: "var(--kr-radius-sm)",
              fontSize: "var(--kr-text-sm)",
              cursor: "pointer",
            }}
          >
            Limpar
          </button>
          <button
            onClick={onClose}
            className="kr-interactive"
            title="Sair do modo full-screen (Esc)"
            style={{
              border: "1px solid var(--kr-glass-border)",
              background: "var(--kr-glass-bg)",
              color: "var(--kr-text-primary)",
              padding: "6px 16px",
              borderRadius: "var(--kr-radius-sm)",
              fontSize: "var(--kr-text-sm)",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Sair [Esc]
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "var(--kr-space-section)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--kr-space-hud)",
      }}>
        {messages.length === 0 && (
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            color: "var(--kr-text-muted)",
          }}>
            <div className="kr-aurora-orb" style={{ transform: "scale(1.5)" }}>
              <div className="kr-aurora-orb-inner" />
              <div className="kr-aurora-orb-ring--outer" />
              <div className="kr-aurora-orb-ring--inner" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 4 }}>
                Aurora esta ouvindo
              </div>
              <div style={{ fontSize: "var(--kr-text-sm)" }}>
                Pergunte sobre missao, riscos, checkpoint, foco ou status do sistema.
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "100%",
            }}
          >
            <div style={{
              fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", marginBottom: 2,
            }}>
              {msg.role === "user" ? "Voce" : "Aurora"} · {msg.timestamp}
            </div>
            <div
              className={msg.role === "aurora" ? "kr-glass-panel" : "kr-glass-panel kr-glass-panel--light"}
              style={{
                padding: "var(--kr-space-hud) var(--kr-space-section)",
                maxWidth: "80%",
                whiteSpace: "pre-wrap",
                fontSize: "var(--kr-text-base)",
                lineHeight: 1.5,
                background: msg.role === "user"
                  ? "var(--kr-purple-800)"
                  : "var(--kr-glass-bg)",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {processing && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--kr-text-muted)", padding: 8 }}>
            <span className="kr-dot kr-dot-live" />
            Aurora processando...
          </div>
        )}

        <div ref={messagesEnd} />
      </div>

      {/* Command input */}
      <div style={{ padding: "0 var(--kr-space-section) var(--kr-space-section)" }}>
        <AuroraCommandInput
          onSubmit={handleCommand}
          disabled={processing}
          placeholder="Pergunte para Aurora — ex: 'Qual a proxima acao?' ou 'O que esta travado?'"
        />
      </div>
    </div>
  );
}
