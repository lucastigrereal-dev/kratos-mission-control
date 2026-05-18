import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Compass,
  CheckCircle2,
  Circle,
  Sparkles,
  Calendar,
} from "lucide-react";

// ── Mock Data ──────────────────────────────────────────────────────────────

const travels = [
  {
    destination: "Japão — Kyoto & Tokyo",
    dates: "15-30 Out 2026",
    days: 15,
    thumbnail: "JP",
    color: "#EF4444",
  },
  {
    destination: "Patagônia Argentina",
    dates: "5-12 Dez 2026",
    days: 8,
    thumbnail: "PA",
    color: "#3B82F6",
  },
  {
    destination: "Nordeste Raiz — Rota das Emoções",
    dates: "Jan 2027",
    days: 12,
    thumbnail: "NE",
    color: "#F59E0B",
  },
];

const adventures = [
  { name: "Curso de Fotografia Avançada", progress: 75 },
  { name: "Leitura: Meditações — Marco Aurélio", progress: 60 },
  { name: "Prática de Japonês Básico", progress: 25 },
];

const wishlist = [
  { text: "Aurora Boreal na Noruega", done: false },
  { text: "Mergulho em Fernando de Noronha", done: true },
  { text: "Trilha Inca até Machu Picchu", done: false },
  { text: "Safári no Quênia", done: false },
  { text: "Transiberiana Moscou-Vladivostok", done: false },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function DreamPortal() {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative flex items-center justify-center h-[180px] w-[180px]">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full kratos-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(14, 165, 233, 0.5) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        {/* Portal rings */}
        <div
          className="relative z-10 flex h-48 w-48 items-center justify-center rounded-full"
          style={{
            border: "4px solid rgba(14, 165, 233, 0.2)",
            background: "rgba(15, 23, 42, 0.4)",
            boxShadow: "0 0 60px rgba(14, 165, 233, 0.15)",
          }}
        >
          {/* SVG concentric rings */}
          {[0, 20, 40].map((offset, i) => (
            <svg
              key={i}
              viewBox="0 0 200 200"
              className="absolute inset-0 h-full w-full"
              style={{
                animation: `spin ${6 + i * 2}s linear infinite ${i % 2 === 0 ? "normal" : "reverse"}`,
              }}
              aria-hidden
            >
              <circle
                cx="100"
                cy="100"
                r={80 - offset}
                fill="none"
                stroke="url(#portalGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${120 + i * 30} ${240}`}
                opacity={0.7 - i * 0.12}
              />
              <defs>
                <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#67E8F9" />
                  <stop offset="50%" stopColor="#0EA5E9" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>
              </defs>
            </svg>
          ))}

          {/* Pulsating center */}
          <div
            className="z-20 h-14 w-14 rounded-full"
            style={{
              background: "radial-gradient(circle, #22D3EE, #0EA5E9)",
              boxShadow: "0 0 30px rgba(103, 232, 249, 0.8)",
              animation: "kratos-pulse 3s ease-in-out infinite",
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

function WoodenSign() {
  return (
    <div
      className="inline-block px-6 py-2 rounded-md mx-auto mb-4"
      style={{
        background: "linear-gradient(135deg, #78350F, #92400E)",
        border: "2px solid #451A03",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <span
        className="text-[14px] font-bold uppercase tracking-[0.15em]"
        style={{ color: "#FDE68A" }}
      >
        ESCOLHA SEU DESTINO
      </span>
    </div>
  );
}

function TravelCards() {
  return (
    <div className="space-y-3">
      {travels.map((t) => (
        <div
          key={t.destination}
          className="flex items-center gap-3 rounded-xl p-3 transition-all kratos-card-hover"
          style={{
            background: "var(--kratos-surface-2)",
            borderLeft: `3px solid ${t.color}`,
          }}
        >
          {/* Thumbnail */}
          <div
            className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${t.color}20` }}
          >
            <span
              className="text-[11px] font-bold kratos-mono"
              style={{ color: t.color }}
            >
              {t.thumbnail}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium truncate" style={{ color: "var(--kratos-text-primary)" }}>
              {t.destination}
            </p>
            <p className="text-[11px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
              <Calendar className="h-3 w-3 inline mr-1" aria-hidden />
              {t.dates}
            </p>
          </div>

          {/* Day count badge */}
          <span
            className="kratos-chip flex-shrink-0"
            style={{ color: "#7DD3FC" }}
          >
            {t.days} dias
          </span>
        </div>
      ))}
    </div>
  );
}

function AdventureTracker() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Aventuras em Progresso
      </h3>
      <div className="space-y-3">
        {adventures.map((a) => (
          <div key={a.name} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Compass className="h-4 w-4 flex-shrink-0" style={{ color: "#7DD3FC" }} aria-hidden />
                <span className="text-[13px] truncate" style={{ color: "var(--kratos-text-primary)" }}>
                  {a.name}
                </span>
              </div>
              <span className="kratos-mono text-[11px] flex-shrink-0 ml-2" style={{ color: "var(--kratos-text-muted)" }}>
                {a.progress}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden ml-6" style={{ background: "var(--kratos-surface-4)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${a.progress}%`,
                  background:
                    a.progress >= 70
                      ? "linear-gradient(90deg, #0EA5E9, #22D3EE)"
                      : a.progress >= 30
                        ? "#0EA5E9"
                        : "var(--kratos-surface-4)",
                }}
                aria-hidden
              />
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function WishList() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Lugares que Quero Visitar
      </h3>
      <div className="space-y-2">
        {wishlist.map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors kratos-card-hover"
            style={{ background: "var(--kratos-surface-2)" }}
          >
            {item.done ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "#4ADE80" }} aria-label="Concluído" />
            ) : (
              <Circle className="h-4 w-4 flex-shrink-0" style={{ color: "var(--kratos-text-muted)" }} aria-label="Pendente" />
            )}
            <span
              className={cn(
                "text-[13px]",
                item.done ? "" : "",
              )}
              style={{
                color: item.done ? "var(--kratos-text-muted)" : "var(--kratos-text-primary)",
                textDecoration: item.done ? "line-through" : "none",
              }}
            >
              {item.text}
            </span>
            {item.done && (
              <span className="ml-auto text-[10px] kratos-mono" style={{ color: "#4ADE80" }}>
                FEITO
              </span>
            )}
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function InspirationCard() {
  return (
    <GlassPanel padding="md">
      <div
        className="rounded-xl p-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(34, 211, 238, 0.05))",
          border: "1px solid rgba(14, 165, 233, 0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4" style={{ color: "#7DD3FC" }} aria-hidden />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "#7DD3FC" }}
          >
            Inspiração
          </span>
        </div>
        <blockquote
          className="text-[14px] italic leading-relaxed"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          "O mundo é um livro, e quem não viaja lê apenas uma página."
        </blockquote>
        <p
          className="mt-2 text-[11px]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          — Santo Agostinho
        </p>
      </div>
    </GlassPanel>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────

export function NimbusScreen() {
  return (
    <IslandPageFrame theme="nimbus">
      <IslandPageHeader
        title="NIMBUS ACADEMY"
        subtitle="Sua vassoura mágica. Vá para onde precisar."
        theme="nimbus"
      />

      {/* Dream portal — centered hero */}
      <DreamPortal />

      {/* Wooden sign */}
      <div className="flex justify-center">
        <WoodenSign />
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <GlassPanel padding="md">
            <h3
              className="kratos-eyebrow mb-3"
              style={{ color: "var(--kratos-text-secondary)" }}
            >
              Próximas Viagens
            </h3>
            <TravelCards />
          </GlassPanel>
        </div>
        <div className="space-y-4">
          <AdventureTracker />
          <InspirationCard />
        </div>
      </div>

      <div className="mt-4">
        <WishList />
      </div>
    </IslandPageFrame>
  );
}
