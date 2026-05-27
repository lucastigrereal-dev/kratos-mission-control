import { useState, useEffect, useCallback, useRef, type KeyboardEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  RotateCcw,
  ArrowRight,
  Save,
  AlertTriangle,
  Target,
  FolderKanban,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { trackAuroraCommand } from "@/lib/analytics/kratosAnalytics";

// --- Command registry ---
interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: typeof Search;
  action: () => void;
}

interface AuroraCommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onCommand?: (command: string) => void;
}

const COMMANDS: CommandItem[] = [
  {
    id: "resume-checkpoint",
    label: "Onde parei?",
    description: "Retomar último checkpoint salvo",
    icon: RotateCcw,
    action: () => {},
  },
  {
    id: "next-action",
    label: "Próxima ação",
    description: "Ver próxima melhor ação recomendada",
    icon: ArrowRight,
    action: () => {},
  },
  {
    id: "save-checkpoint",
    label: "Salvar checkpoint",
    description: "Salvar estado atual da missão",
    icon: Save,
    action: () => {},
  },
  {
    id: "view-risks",
    label: "Ver riscos",
    description: "Mostrar lista de riscos ativos",
    icon: AlertTriangle,
    action: () => {},
  },
  {
    id: "go-agora",
    label: "Ir para Agora",
    description: "Navegar para a página de foco imediato",
    icon: Target,
    action: () => {},
  },
  {
    id: "go-projetos",
    label: "Ir para Projetos",
    description: "Navegar para a página de projetos",
    icon: FolderKanban,
    action: () => {},
  },
];

export function AuroraCommandPalette({
  open,
  onClose,
  onCommand,
}: AuroraCommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Build commands with navigation actions wired in
  const commands: CommandItem[] = COMMANDS.map((cmd) => {
    if (cmd.id === "go-agora") {
      return { ...cmd, action: () => navigate({ to: "/agora" }) };
    }
    if (cmd.id === "go-projetos") {
      return { ...cmd, action: () => navigate({ to: "/projetos" }) };
    }
    if (cmd.id === "save-checkpoint") {
      return { ...cmd, action: () => navigate({ to: "/checkpoints" }) };
    }
    if (cmd.id === "view-risks") {
      return { ...cmd, action: () => navigate({ to: "/projetos" }) };
    }
    if (cmd.id === "resume-checkpoint") {
      return { ...cmd, action: () => navigate({ to: "/checkpoints" }) };
    }
    if (cmd.id === "next-action") {
      return { ...cmd, action: () => navigate({ to: "/agora" }) };
    }
    return cmd;
  });

  // Filter commands by query
  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase()),
      )
    : commands;

  // Reset state on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      // Focus input after animation frame
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Clamp selectedIndex when filtered list changes
  useEffect(() => {
    if (selectedIndex >= filtered.length) {
      setSelectedIndex(Math.max(0, filtered.length - 1));
    }
  }, [filtered.length, selectedIndex]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay to avoid immediate close from the trigger click
    const timeout = setTimeout(
      () => window.addEventListener("mousedown", handler),
      100,
    );
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousedown", handler);
    };
  }, [open, onClose]);

  // Execute command
  const executeCommand = useCallback(
    (cmd: CommandItem) => {
      const t0 = performance.now();
      cmd.action();
      // W8-B3: Track aurora command execution
      trackAuroraCommand(cmd.id, true, Math.round(performance.now() - t0));
      onCommand?.(cmd.id);
      onClose();
    },
    [onCommand, onClose],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev + 1 >= filtered.length ? 0 : prev + 1,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev - 1 < 0 ? filtered.length - 1 : prev - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filtered[selectedIndex]) {
            executeCommand(filtered[selectedIndex]);
          }
          break;
      }
    },
    [filtered, selectedIndex, executeCommand],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]"
      style={{
        background: "rgba(0, 0, 0, 0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      <div ref={panelRef} className="w-full max-w-lg px-4">
        <GlassPanel padding="sm" className="overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <Search
              className="h-4 w-4 shrink-0"
              style={{ color: "var(--kratos-text-muted)" }}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Digite um comando..."
              className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--kratos-text-muted)]"
              style={{ color: "var(--kratos-text-primary)" }}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-0.5 kratos-focus-ring"
              style={{ color: "var(--kratos-text-muted)" }}
              aria-label="Fechar paleta de comandos"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="kratos-hairline" />

          {/* Command list */}
          <div className="max-h-64 overflow-y-auto kratos-scrollbar py-1">
            {filtered.length === 0 ? (
              <div
                className="px-4 py-6 text-center text-[12px]"
                style={{ color: "var(--kratos-text-muted)" }}
              >
                Nenhum comando encontrado para "{query}"
              </div>
            ) : (
              <ul role="listbox">
                {filtered.map((cmd, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <li
                      key={cmd.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => executeCommand(cmd)}
                      className={cn(
                        "mx-1 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-100",
                      )}
                      style={{
                        background: isSelected
                          ? "var(--kratos-surface-4)"
                          : "transparent",
                        color: "var(--kratos-text-primary)",
                      }}
                    >
                      <cmd.icon
                        className="h-4 w-4 shrink-0"
                        style={{ color: "var(--kratos-accent)" }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-medium">
                          {cmd.label}
                        </div>
                        <div
                          className="text-[10px]"
                          style={{ color: "var(--kratos-text-secondary)" }}
                        >
                          {cmd.description}
                        </div>
                      </div>
                      {isSelected && (
                        <kbd
                          className="rounded px-1 py-0.5 text-[9px] kratos-mono"
                          style={{
                            background: "var(--kratos-surface-3)",
                            color: "var(--kratos-text-muted)",
                          }}
                        >
                          ⏎
                        </kbd>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer hint */}
          <div
            className="flex items-center gap-3 px-3 py-1.5"
            style={{
              borderTop: "1px solid var(--kratos-border)",
            }}
          >
            <span
              className="text-[9px] kratos-mono"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              <kbd
                className="mr-1 rounded px-1 py-0.5"
                style={{ background: "var(--kratos-surface-4)" }}
              >
                ↑↓
              </kbd>
              Navegar
            </span>
            <span
              className="text-[9px] kratos-mono"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              <kbd
                className="mr-1 rounded px-1 py-0.5"
                style={{ background: "var(--kratos-surface-4)" }}
              >
                ↵
              </kbd>
              Selecionar
            </span>
            <span
              className="text-[9px] kratos-mono ml-auto"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              <kbd
                className="mr-1 rounded px-1 py-0.5"
                style={{ background: "var(--kratos-surface-4)" }}
              >
                Esc
              </kbd>
              Fechar
            </span>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
