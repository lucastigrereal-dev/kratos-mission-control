import { useState, useRef, useEffect, type FormEvent } from "react";
import { Send, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickCommand {
  id: string;
  label: string;
  icon?: string;
}

interface AuroraChatDockProps {
  messages?: Array<{ id: string; text: string; from: "aurora" | "operator" }>;
  onSend?: (text: string) => void;
  onQuickCommand?: (commandId: string) => void;
  quickCommands?: QuickCommand[];
  className?: string;
  context?: "drift" | "lost" | "zombie" | "normal";
}

export function AuroraChatDock({
  messages = [],
  onSend,
  onQuickCommand,
  quickCommands,
  className,
  context = "normal",
}: AuroraChatDockProps) {
  const [input, setInput] = useState("");
  const [activeCommandId, setActiveCommandId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleCommandClick(commandId: string) {
    setActiveCommandId(commandId);
    onQuickCommand?.(commandId);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActiveCommandId(null), 200);
  }

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
            style={{
              color:
                context === "drift" || context === "lost" || context === "zombie"
                  ? "var(--kr-color-warn)"
                  : "var(--kr-text-muted)",
            }}
            aria-hidden
          />
          <span
            className="text-[10px] kr-animate-pulse-glow"
            style={{
              color:
                context === "drift" || context === "lost" || context === "zombie"
                  ? "var(--kr-color-warn)"
                  : "var(--kr-text-muted)",
            }}
          >
            {context === "drift"
              ? "Aurora detectou deriva — use /retomar"
              : context === "lost"
                ? "Você está perdido — Aurora pode ajudar"
                : context === "zombie"
                  ? "Modo zumbi — Aurora sugere uma pausa"
                  : "Pronto — Aurora aguarda"}
          </span>
        </div>
      )}

      {/* Quick command chips */}
      {quickCommands && quickCommands.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {quickCommands.map((cmd) => {
            const isActive = activeCommandId === cmd.id;
            return (
              <button
                key={cmd.id}
                type="button"
                onClick={() => handleCommandClick(cmd.id)}
                disabled={isActive}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-all duration-100 hover:brightness-110 active:scale-[0.97] kratos-focus-ring",
                  isActive && "kr-animate-pulse-glow",
                )}
                style={{
                  background: isActive
                    ? "color-mix(in oklab, var(--kr-aurora, #6366F1) 15%, transparent)"
                    : "var(--kr-surface-2, rgba(255,255,255,0.03))",
                  border: isActive
                    ? "1px solid color-mix(in oklab, var(--kr-aurora, #6366F1) 40%, transparent)"
                    : "1px solid var(--kr-glass-strong-border, rgba(255,255,255,0.10))",
                  color: isActive
                    ? "var(--kr-aurora, #6366F1)"
                    : "var(--kr-text-secondary, #D1D5DB)",
                  opacity: isActive ? 1 : undefined,
                }}
              >
                {cmd.icon && <span aria-hidden>{cmd.icon}</span>}
                {cmd.label}
              </button>
            );
          })}
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
