import { useState, type FormEvent } from "react";
import { Send, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuroraChatDockProps {
  messages?: Array<{ id: string; text: string; from: "aurora" | "operator" }>;
  onSend?: (text: string) => void;
  className?: string;
}

export function AuroraChatDock({
  messages = [],
  onSend,
  className,
}: AuroraChatDockProps) {
  const [input, setInput] = useState("");
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setInput("");
  }

  return (
    <div
      className={cn("flex flex-col gap-1 rounded-t-2xl px-4 py-2", className)}
      style={{
        background: "var(--kr-glass-strong-bg)",
        border: "1px solid var(--kr-glass-strong-border)",
        borderBottom: "none",
        backdropFilter: "blur(var(--kr-panel-blur))",
        WebkitBackdropFilter: "blur(var(--kr-panel-blur))",
        boxShadow: "var(--kr-shadow-elevated)",
      }}
    >
      {/* Last message preview */}
      {lastMessage && (
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="text-[10px] font-medium"
            style={{
              color: lastMessage.from === "aurora"
                ? "var(--kr-aurora)"
                : "var(--kr-text-muted)",
            }}
          >
            {lastMessage.from === "aurora" ? "Aurora" : "Você"}:
          </span>
          <span
            className="text-[11px] truncate"
            style={{ color: "var(--kr-text-secondary)" }}
          >
            {lastMessage.text}
          </span>
        </div>
      )}

      {/* Empty state when no messages */}
      {messages.length === 0 && (
        <div className="flex items-center gap-1.5">
          <MessageCircle
            className="h-3 w-3 shrink-0"
            style={{ color: "var(--kr-text-muted)" }}
            aria-hidden
          />
          <span className="text-[10px] kr-animate-pulse-glow"
            style={{ color: "var(--kr-text-muted)" }}
          >
            Pronto — Aurora aguarda
          </span>
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte algo à Aurora..."
          className="flex-1 bg-transparent text-xs outline-none placeholder:text-[var(--kr-text-muted)]"
          style={{ color: "var(--kr-text-primary)" }}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="flex items-center justify-center rounded-lg p-1.5 transition-opacity shrink-0"
          style={{
            background: input.trim()
              ? "linear-gradient(135deg, var(--kr-aurora), var(--kr-azure))"
              : "var(--kr-surface-mid)",
            opacity: input.trim() ? 1 : 0.5,
          }}
          aria-label="Enviar mensagem"
        >
          <Send className="h-3.5 w-3.5" style={{ color: "var(--kr-text-primary)" }} />
        </button>
      </form>
    </div>
  );
}
