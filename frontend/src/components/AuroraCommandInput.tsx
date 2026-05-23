import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface AuroraCommandInputProps {
  onSubmit: (command: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const HISTORY_KEY = "kr-aurora-command-history";
const MAX_HISTORY = 50;

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(commands: string[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(commands.slice(-MAX_HISTORY)));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export default function AuroraCommandInput({
  onSubmit,
  disabled = false,
  placeholder = "Digite um comando para Aurora...",
}: AuroraCommandInputProps) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>(loadHistory);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit() {
    const cmd = value.trim();
    if (!cmd || disabled) return;

    const next = [cmd, ...history.filter((h) => h !== cmd)];
    setHistory(next);
    saveHistory(next);
    setHistoryIndex(-1);
    onSubmit(cmd);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) return;
      setHistoryIndex(nextIdx);
      setValue(history[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setValue("");
        return;
      }
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setValue(history[nextIdx]);
    } else if (e.key === "Escape") {
      setValue("");
      setHistoryIndex(-1);
    }
  }

  return (
    <div className="kr-glass-panel kr-glass-panel--strong" style={{ padding: "var(--kr-space-hud) var(--kr-space-section)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "1.2rem", opacity: 0.6 }}>{">"}</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          autoFocus
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "var(--kr-radius-sm)",
            border: "1px solid var(--kr-glass-border)",
            background: "var(--kr-glass-bg)",
            color: "var(--kr-text-primary)",
            fontSize: "var(--kr-text-base)",
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="kr-interactive"
          style={{
            padding: "8px 16px",
            borderRadius: "var(--kr-radius-sm)",
            border: "none",
            background: disabled || !value.trim() ? "var(--kr-text-disabled)" : "var(--kr-purple-500)",
            color: "#fff",
            fontSize: "var(--kr-text-sm)",
            cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          Executar
        </button>
      </div>
      {history.length > 0 && (
        <div style={{ marginTop: 6, fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
          Historico: {history.slice(0, 5).join(" | ")}
          {history.length > 5 && ` +${history.length - 5} mais`}
        </div>
      )}
    </div>
  );
}
