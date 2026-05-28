import { Zap, Star, Gem, Clock, Sparkles, Crown } from "lucide-react";
import { StatusDot } from "../base/StatusDot";

interface TopBarV2Props {
  operatorName?: string;
  operatorAvatarUrl?: string;
  energy?: number;
  level?: number;
  xp?: number;
  auroraOnline?: boolean;
  onToggleAurora?: () => void;
  auroraOpen?: boolean;
  leftOffset?: number;
}

const WEEKDAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function formatDateTime(): { time: string; dateLabel: string } {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const weekday = WEEKDAYS[now.getDay()];
  const day = now.getDate();
  const month = MONTHS[now.getMonth()];
  return {
    time: `${hh}:${mm}`,
    dateLabel: `${weekday}, ${day} de ${month}`,
  };
}

function OperatorBadge({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-[var(--kr-gold,#FFD700)]"
          />
        ) : (
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold"
            style={{
              background:
                "linear-gradient(135deg, var(--kr-island-arena, #F59E0B), var(--kr-island-forja, #EF4444))",
              color: "var(--kr-text-primary, #fff)",
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0">
        <span
          className="text-[13px] font-semibold leading-tight"
          style={{ color: "var(--kr-text-primary, #f0f0f2)" }}
        >
          {name}
        </span>
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em] leading-tight"
          style={{ color: "var(--kr-gold, #FFD700)", opacity: 0.85 }}
        >
          KRATOS CONTROL
        </span>
      </div>
    </div>
  );
}

function KratosCrest() {
  return (
    <div className="flex flex-col items-center gap-0.5">
      {/* Crown */}
      <Crown
        className="h-3.5 w-3.5"
        style={{ color: "var(--kr-gold, #FFD700)" }}
        strokeWidth={2.5}
      />
      {/* Shield */}
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 40,
          height: 40,
          border: "2px solid var(--kr-gold, #FFD700)",
          background:
            "linear-gradient(135deg, var(--kr-castle-roof, #1E40AF), var(--kr-surface-3, #1e1e24))",
          boxShadow:
            "0 0 12px color-mix(in oklab, var(--kr-gold, #FFD700) 30%, transparent)",
        }}
      >
        <span
          className="text-base font-black"
          style={{
            color: "var(--kr-gold, #FFD700)",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          K
        </span>
      </div>
    </div>
  );
}

function StatPill({
  icon: Icon,
  value,
  label,
  iconColor,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>;
  value: string;
  label: string;
  iconColor: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-2">
      <div className="flex items-center gap-1">
        <Icon
          className="h-3.5 w-3.5"
          style={{ color: iconColor }}
          strokeWidth={2.5}
        />
        <span
          className="text-[13px] font-bold kratos-num"
          style={{ color: "var(--kr-text-primary, #f0f0f2)" }}
        >
          {value}
        </span>
      </div>
      <span
        className="text-[9px] kratos-mono uppercase tracking-[0.15em]"
        style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
      >
        {label}
      </span>
    </div>
  );
}

function AuroraTrigger({
  online,
  onClick,
  active,
}: {
  online: boolean;
  onClick?: () => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all duration-150 kratos-focus-ring"
      style={{
        background: active
          ? "rgba(99,102,241,0.14)"
          : "var(--kr-surface-2, rgba(255,255,255,0.04))",
        border: `1px solid ${active ? "var(--kr-border-live, rgba(99,102,241,0.3))" : "var(--kr-glass-strong-border, rgba(255,255,255,0.08))"}`,
      }}
      aria-pressed={active}
      aria-label={active ? "Fechar painel Aurora" : "Abrir painel Aurora"}
    >
      <div className="relative shrink-0">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{
            background:
              "linear-gradient(135deg, var(--kr-info, #3b82f6), var(--kr-ghost, #6366f1))",
          }}
        >
          <Sparkles className="h-4 w-4" style={{ color: "var(--kratos-text-primary)" }} />
        </div>
        {online && (
          <div className="absolute -bottom-0.5 -right-0.5">
            <StatusDot severity="ok" size="xs" pulse />
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-0">
        <span
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--kr-text-secondary, #8a8a9a)" }}
        >
          AURORA
        </span>
        <span
          className="text-[9px] kratos-mono uppercase tracking-wider"
          style={{
            color: online
              ? "var(--kr-ok, #22c55e)"
              : "var(--kr-text-muted, #4a4a5a)",
          }}
        >
          {online ? "ONLINE" : "OFFLINE"}
        </span>
      </div>
    </button>
  );
}

export function TopBarV2({
  operatorName = "Lucas",
  operatorAvatarUrl,
  energy = 87,
  level = 47,
  xp = 32780,
  auroraOnline = true,
  onToggleAurora,
  auroraOpen = false,
  leftOffset = 0,
}: TopBarV2Props) {
  const { time, dateLabel } = formatDateTime();

  return (
    <header
      className="fixed right-0 z-[80] flex items-center justify-between px-5"
      style={{
        height: 90,
        left: leftOffset,
        right: 0,
        background: "var(--kr-glass-strong-bg, rgba(15, 23, 42, 0.92))",
        borderBottom:
          "1px solid var(--kr-glass-strong-border, rgba(255, 255, 255, 0.08))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "left 200ms ease",
      }}
    >
      {/* Left: Operator */}
      <div className="flex items-center" style={{ minWidth: 180 }}>
        <OperatorBadge name={operatorName} avatarUrl={operatorAvatarUrl} />
      </div>

      {/* Center: Crest */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <KratosCrest />
      </div>

      {/* Right: Stats + Aurora */}
      <div className="flex items-center gap-1">
        <StatPill
          icon={Zap}
          value={`${energy}%`}
          label="ENERGIA"
          iconColor="var(--kr-warn, #f59e0b)"
        />
        <div
          className="h-6 w-px mx-1"
          style={{ background: "var(--kratos-border, rgba(255,255,255,0.06))" }}
          aria-hidden
        />
        <StatPill
          icon={Star}
          value={String(level)}
          label="NÍVEL"
          iconColor="var(--kr-warn, #f59e0b)"
        />
        <div
          className="h-6 w-px mx-1"
          style={{ background: "var(--kratos-border, rgba(255,255,255,0.06))" }}
          aria-hidden
        />
        <StatPill
          icon={Gem}
          value={xp.toLocaleString("pt-BR")}
          label="XP"
          iconColor="var(--kr-ghost, #6366f1)"
        />
        <div
          className="h-6 w-px mx-1"
          style={{ background: "var(--kratos-border, rgba(255,255,255,0.06))" }}
          aria-hidden
        />
        <div className="flex flex-col items-center gap-0.5 px-2">
          <div className="flex items-center gap-1">
            <Clock
              className="h-3.5 w-3.5"
              style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
              strokeWidth={2.5}
            />
            <span
              className="text-[13px] font-bold kratos-num"
              style={{ color: "var(--kr-text-primary, #f0f0f2)" }}
            >
              {time}
            </span>
          </div>
          <span
            className="text-[9px] kratos-mono uppercase tracking-[0.12em]"
            style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
          >
            {dateLabel}
          </span>
        </div>
        <div
          className="h-6 w-px mx-2"
          style={{ background: "var(--kratos-border, rgba(255,255,255,0.06))" }}
          aria-hidden
        />
        <AuroraTrigger
          online={auroraOnline}
          onClick={onToggleAurora}
          active={auroraOpen}
        />
      </div>
    </header>
  );
}
