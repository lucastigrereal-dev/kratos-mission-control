===== FILE: docs/kimi/README.md =====
# Pacote Canônico Kimi — KRATOS Mission Control

## O que é este pacote
Este diretório contém o material técnico e visual produzido pelo Kimi para evolução do frontend do KRATOS. É a fonte canônica local para o Claude Code consultar durante microfases.

## Regras de uso
- **NUNCA copiar código diretamente.** O código Kimi é referência visual e estrutural. Claude Code deve adaptar ao KRATOS existente.
- **Sempre usar por microfase.** Não implementar mais de uma microfase por ciclo.
- **Backend é intocável.** Não criar endpoints, não alterar SSE, não tocar em useLiveKratos, não alterar Mission Lens.
- **Stack travada.** React + Vite + TypeScript + Tailwind. Sem Three.js, sem Next.js, sem auth novo, sem Supabase.
- **Preferir adaptação a duplicação.** Se um componente similar já existe no repo, adaptar em vez de criar novo.

## Estrutura do pacote
| Arquivo | Tipo | Quando usar |
|---|---|---|
| `KIMI_CODE_RAW_INDEX.md` | Índice | Antes de qualquer microfase |
| `KIMI_CODE_RAW_PART_01_TOKENS.md` | Tokens | Ao criar/atualizar tailwind.config ou CSS base |
| `KIMI_CODE_RAW_PART_02_UI_PRIMITIVES.md` | UI Primitives | Fase de padronização de cards, badges, estados |
| `KIMI_CODE_RAW_PART_03_WORLD_MAP.md` | World Map | Ao evoluir o mapa de ilhas |
| `KIMI_CODE_RAW_PART_04_HUD_AURORA_DOCK.md` | HUD | Ao polir TopBar, Sidebar, Rail, Dock |
| `KIMI_CODE_RAW_PART_05_INTERNAL_ISLANDS.md` | Ilhas | Uma por microfase, ao criar interior de ilha |
| `KIMI_CODE_RAW_PART_06_QA_PROMPTS.md` | QA | Antes de commitar qualquer microfase |
| `KIMI_EXECUTION_ROADMAP.md` | Roadmap | Para planejar e rastrear microfases |
| `KIMI_COMPONENT_MAP.md` | Mapa | Para decidir USAR/ADAPTAR/ADIAR/DESCARTAR |
| `KIMI_ADOPTION_LOG.md` | Log | Pós-implementação de cada microfase |
| `KIMI_NEXT_MICROPHASE.md` | Decisão | Sempre consultar primeiro |
| `KIMI_DO_NOT_USE.md` | Proibições | Antes de escrever qualquer código |
| `KIMI_ACCEPTANCE_CHECKLIST.md` | Checklist | Antes de staging e commit |
| `KIMI_CLAUDE_CODE_CONSUMPTION_PROTOCOL.md` | Protocolo | Fluxo obrigatório de consumo |
| `KIMI_MICROPHASE_PROMPTS.md` | Prompts | Prompts prontos para cada microfase |

## Material bruto vs. curado
- **Bruto:** Código de referência, specs densas, tokens exatos.
- **Curado:** Decisões de adaptação, mapa de componentes, log de adoção.
- Claude Code deve ler o **curado** para decidir, e o **bruto** para referência técnica.

## Ordem de uso recomendada
1. `KIMI_NEXT_MICROPHASE.md`
2. `KIMI_CLAUDE_CODE_CONSUMPTION_PROTOCOL.md`
3. `KIMI_EXECUTION_ROADMAP.md` (microfase atual)
4. Partes relevantes de `KIMI_CODE_RAW_PART_XX`
5. `KIMI_COMPONENT_MAP.md`
6. Implementar
7. `KIMI_ACCEPTANCE_CHECKLIST.md`
8. Atualizar `KIMI_ADOPTION_LOG.md`
===== END FILE =====

===== FILE: docs/kimi/KIMI_CODE_RAW_INDEX.md =====
# Índice do Pacote Kimi

| Arquivo | Conteúdo | Quando usar | Risco | Prioridade |
|---|---|---|---|---|
| `KIMI_CODE_RAW_PART_01_TOKENS.md` | Cores, glass, sombras, z-index, motion, tokens de ilha, HUD, Aurora, reduced motion | Antes de qualquer alteração visual | Baixo — tokens são seguros de adaptar | Alta |
| `KIMI_CODE_RAW_PART_02_UI_PRIMITIVES.md` | GlassPanel, KratosCard, StatusChip, MetricBadge, ProgressRing, EmptyState, ErrorState, LoadingSkeleton, SectionTitle, IslandMiniCard | Microfase 01 e 02 | Médio — risco de duplicar componentes existentes | Alta |
| `KIMI_CODE_RAW_PART_03_WORLD_MAP.md` | KratosWorldMap, OceanBackdrop, CloudLayer, FloatingIsland, IslandBridge, CentralCastleMission, IslandLabel, pseudo-3D CSS | Microfase 03 | Médio — mapa pode já existir parcialmente | Alta |
| `KIMI_CODE_RAW_PART_04_HUD_AURORA_DOCK.md` | TopHud, Sidebar, RightRail, AuroraPanel, BottomDock, MissionBar, SquadDock, AudioPlayer, StatusBarDock | Microfase 04, 05, 06 | Médio — shell pode já existir, evitar duplicar | Alta |
| `KIMI_CODE_RAW_PART_05_INTERNAL_ISLANDS.md` | Templates de ilha: OMNIS Lab, Akasha, Agência, Arena, Forja, Observatório, Vila, Tesouro, Nimbus, Palco Central | Microfases 07 a 14 | Alto — uma por vez, não todas juntas | Média |
| `KIMI_CODE_RAW_PART_06_QA_PROMPTS.md` | Checklists visual, neuro UX, backend intacto, SourceBadge, Mission Lens, prompts de review | Microfase 15 e a cada commit | Baixo | Alta |
| `KIMI_EXECUTION_ROADMAP.md` | Roadmap completo FRONT-KIMI-00 a 15 | Planejamento e rastreamento | — | Alta |
| `KIMI_COMPONENT_MAP.md` | Tabela de decisão USAR/ADAPTAR/ADIAR/DESCARTAR | Antes de implementar qualquer componente | — | Alta |
| `KIMI_MICROPHASE_PROMPTS.md` | Prompts prontos para Claude Code executar cada microfase | Início de cada microfase | — | Alta |
===== END FILE =====

===== FILE: docs/kimi/KIMI_CODE_RAW_PART_01_TOKENS.md =====
# Tokens Visuais KRATOS

## Paleta Cromática (Tailwind extend)
```typescript
colors: {
  kratos: {
    ocean: { DEFAULT: "#2563EB", deep: "#1E40AF", dark: "#1E3A8A" },
    sky: { DEFAULT: "#60A5FA", light: "#DBEAFE" },
    island: { grass: "#22C55E", earth: "#D97706" },
    castle: { stone: "#E2E8F0", roof: "#EF4444", gold: "#F59E0B", shield: "#1E3A8A" },
    hud: { glass: "rgba(15,23,42,0.75)", border: "rgba(255,255,255,0.10)" },
    accent: { energy: "#FACC15", xp: "#A855F7", online: "#4ADE80", progress: "#06B6D4" },
    omnis: { DEFAULT: "#7C3AED", glow: "#8B5CF6", label: "#C4B5FD", neon: "#06B6D4" },
    agencia: { DEFAULT: "#F97316", glow: "#FB923C", label: "#FDBA74" },
    akasha: { DEFAULT: "#059669", glow: "#10B981", label: "#6EE7B7", gold: "#F59E0B" },
    filosofia: { DEFAULT: "#7C3AED", glow: "#A855F7", label: "#C4B5FD" },
    financas: { DEFAULT: "#166534", glow: "#FACC15", label: "#4ADE80" },
    forja: { DEFAULT: "#475569", glow: "#EA580C", label: "#94A3B8" },
    observatorio: { DEFAULT: "#1E3A8A", glow: "#3B82F6", label: "#60A5FA" },
    vila: { DEFAULT: "#16A34A", glow: "#86EFAC", label: "#BBF7D0", warm: "#FEF3C7" },
    arena: { DEFAULT: "#DC2626", glow: "#F87171", label: "#FCA5A5" },
    nimbus: { DEFAULT: "#0EA5E9", glow: "#7DD3FC", label: "#BAE6FD", crystal: "#22D3EE" },
  }
}
```

## Elevação & Glass
```typescript
boxShadow: {
  "kratos-glass": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
  "kratos-glass-hover": "0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10)",
  "kratos-island": "0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
  "kratos-hud": "0 4px 24px rgba(0,0,0,0.5)",
  "glow-omnis": "0 0 40px rgba(139,92,246,0.3)",
  "glow-agencia": "0 0 40px rgba(249,115,22,0.25)",
  "glow-akasha": "0 0 40px rgba(16,185,129,0.3)",
  "glow-nimbus": "0 0 40px rgba(14,165,233,0.3)",
}
backdropBlur: { glass: "16px", panel: "24px" }
borderRadius: { glass: "16px", island: "24px", card: "20px", tech: "8px" }
```

## Motion & Z-Index
```typescript
keyframes: {
  "float-slow": { "0%,100%": { transform: "translateY(0) rotateX(10deg)" }, "50%": { transform: "translateY(-12px) rotateX(10deg)" } },
  "float-medium": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
  "cloud-drift": { "0%": { transform: "translateX(-10vw)" }, "100%": { transform: "translateX(110vw)" } },
  "pulse-glow": { "0%,100%": { opacity: "0.4" }, "50%": { opacity: "0.7" } },
  "spin-slow": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
},
animation: {
  "float-slow": "float-slow 6s ease-in-out infinite",
  "float-medium": "float-medium 5s ease-in-out infinite",
  "cloud-drift": "cloud-drift 120s linear infinite",
  "pulse-glow": "pulse-glow 4s ease-in-out infinite",
  "spin-slow": "spin-slow 10s linear infinite",
}
```

## Z-Index Hierarchy
| Layer | z-index | Elemento |
|---|---|---|
| Ocean | 0 | fixed |
| Sky | 10 | absolute, pointer-events-none |
| Ghost Islands | 15 | decorativas |
| Clouds | 20 | pointer-events-none |
| Bridges | 30 | SVG |
| Floating Islands | 40 | absolute |
| Central Castle | 50 | absolute |
| Island Labels | 60 | GlassPanel |
| Mission Banner | 70 | HTML overlay |
| Bottom Dock | 90 | fixed |
| HUD | 100 | fixed (TopBar, Sidebar, RightRail) |

## Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .animate-float-slow, .animate-float-medium, .animate-cloud-drift, .animate-pulse-glow, .animate-spin-slow {
    animation: none !important;
    transition: opacity 150ms ease !important;
  }
}
```

## Notas de adaptação
- `bg-kratos-hud-glass` deve manter mínimo 75% de opacidade para legibilidade sobre o oceano.
- Não usar `shadow-lg` padrão do Tailwind em glass. Usar `shadow-kratos-glass`.
- Em prefers-reduced-motion: desativar float e drift. Manter apenas transições de opacidade.
===== END FILE =====

===== FILE: docs/kimi/KIMI_CODE_RAW_PART_02_UI_PRIMITIVES.md =====
# UI Primitives — Referência de Implementação

## GlassPanel
**Objetivo:** Container base para todo painel flutuante.
**Risco de duplicação:** MÉDIO — verificar se já existe `Card` ou `Panel` no repo.

```tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ as: Comp = "div", padding = "md", interactive, className, ...props }, ref) => {
    const pad = { none: "", sm: "p-3", md: "p-4", lg: "p-6" };
    return (
      <Comp
        ref={ref}
        className={cn(
          "relative rounded-glass border border-kratos-hud-border bg-kratos-hud-glass backdrop-blur-glass shadow-kratos-glass",
          pad[padding],
          interactive && "cursor-pointer transition-all duration-300 hover:border-white/20 hover:shadow-kratos-glass-hover",
          className
        )}
        {...props}
      />
    );
  }
);
GlassPanel.displayName = "GlassPanel";
```

**Como adaptar:** Se o repo já tem um `Card` com blur, estender ele em vez de criar novo. Adicionar as classes do GlassPanel via `className` merge.

**Não fazer:** Não usar `style={{ backdropFilter: "blur(16px)" }}` inline. Usar classe utilitária.

---

## KratosCard
**Objetivo:** Card funcional com header, body, footer. Extende GlassPanel.
**Risco de duplicação:** ALTO — provavelmente já existe card genérico no projeto.

```tsx
interface KratosCardProps extends React.ComponentPropsWithoutRef<typeof GlassPanel> {
  header?: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "active" | "highlight";
}

export function KratosCard({ children, header, title, icon, footer, variant = "default", className, ...props }: KratosCardProps) {
  return (
    <GlassPanel
      className={cn(
        "flex flex-col overflow-hidden",
        variant === "active" && "ring-1 ring-amber-400/40 shadow-[0_0_25px_rgba(251,191,36,0.08)]",
        variant === "highlight" && "bg-gradient-to-b from-white/[0.05] to-transparent",
        className
      )}
      {...props}
    >
      {(header || title) && (
        <div className="flex items-center gap-2 mb-3">
          {icon && <span className="text-white/70">{icon}</span>}
          {title && <h3 className="text-sm font-semibold text-white/90 tracking-wide">{title}</h3>}
          {header && <div className="ml-auto">{header}</div>}
        </div>
      )}
      <div className="flex-1">{children}</div>
      {footer && <div className="mt-3 pt-3 border-t border-white/5">{footer}</div>}
    </GlassPanel>
  );
}
```

**Como adaptar:** Adaptar o card existente. Adicionar props `variant` e `footer`. Não criar arquivo separado se já houver `Card.tsx`.

---

## StatusChip
**Objetivo:** Indicador discreto de estado operacional.
**Risco de duplicação:** BAIXO — provavelmente não existe com semântica de cockpit.

```tsx
interface StatusChipProps {
  status: "online" | "offline" | "executing" | "warning" | "error" | "stale";
  label?: string;
  pulse?: boolean;
  size?: "sm" | "md";
}

const statusMap = {
  online: { dot: "bg-emerald-400", text: "text-emerald-300" },
  executing: { dot: "bg-cyan-400", text: "text-cyan-300" },
  warning: { dot: "bg-amber-400", text: "text-amber-300" },
  error: { dot: "bg-rose-500", text: "text-rose-300" },
  stale: { dot: "bg-slate-500", text: "text-slate-400" },
  offline: { dot: "bg-slate-600", text: "text-slate-500" },
};

export function StatusChip({ status, label, pulse, size = "sm" }: StatusChipProps) {
  const s = statusMap[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5", size === "sm" ? "text-xs" : "text-sm")} role="status">
      <span className={cn("rounded-full", size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5", s.dot, pulse && "animate-pulse")} />
      {label && <span className={cn("font-medium tracking-wide uppercase", s.text)}>{label}</span>}
    </span>
  );
}
```

---

## SectionTitle
**Objetivo:** Título de seção dentro de ilhas.
**Risco de duplicação:** BAIXO.

```tsx
interface SectionTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  divider?: boolean;
}

export function SectionTitle({ children, icon, action, divider }: SectionTitleProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3 mb-3", divider && "border-b border-white/5 pb-2")}>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-white/90 tracking-wide">{children}</h3>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
```

---

## LoadingSkeleton
**Objetivo:** Placeholder neurocompatível. Sem flash branco.
**Risco de duplicação:** MÉDIO.

```tsx
interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export function LoadingSkeleton({ lines = 3, className }: LoadingSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 w-full rounded bg-white/5 animate-pulse" style={{ width: i === lines - 1 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}
```

**Nota:** Se já existir Skeleton, apenas garantir que a cor não seja `bg-gray-200` (flash branco). Usar `bg-white/5` ou `bg-white/10`.

---

## EmptyState
**Objetivo:** Tela/card sem dados. Nunca parecer quebrado.
**Risco de duplicação:** MÉDIO.

```tsx
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  compact?: boolean;
}

export function EmptyState({ icon, title, description, action, compact }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", compact ? "py-4" : "py-8")}>
      <div className="mb-2 text-white/20">{icon}</div>
      <p className="text-sm font-medium text-white/60">{title}</p>
      {description && <p className="mt-1 text-xs text-white/40">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="mt-3 text-xs font-medium text-sky-400 hover:text-sky-300">
          {action.label}
        </button>
      )}
    </div>
  );
}
```

---

## ErrorState
**Objetivo:** Feedback de falha operacional.
**Risco de duplicação:** MÉDIO.

```tsx
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Erro operacional", message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-center">
      <p className="text-sm font-semibold text-rose-400">{title}</p>
      {message && <p className="mt-1 text-xs text-white/60">{message}</p>}
      {onRetry && (
        <button onClick={onRetry} className="mt-3 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5">
          Tentar novamente
        </button>
      )}
    </div>
  );
}
```

---

## ProgressRing
**Objetivo:** Anel circular (Progresso Geral 78%, Saúde do Sistema, etc).
**Risco de duplicação:** BAIXO — específico do visual KRATOS.

```tsx
import { useEffect, useState } from "react";

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({
  value, size = 120, strokeWidth = 8, color = "stroke-amber-400",
  trackColor = "stroke-white/10", label, sublabel,
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const [o, setO] = useState(c);
  useEffect(() => {
    const t = setTimeout(() => setO(c - (Math.min(value, 100) / 100) * c), 50);
    return () => clearTimeout(t);
  }, [value, c]);
  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={strokeWidth} className={trackColor} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={strokeWidth} strokeLinecap="round"
          className={cn(color, "transition-all duration-1000 ease-out")} style={{ strokeDasharray: c, strokeDashoffset: o }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="text-2xl font-bold text-white">{label}</span>}
        {sublabel && <span className="text-[10px] uppercase tracking-wider text-white/50">{sublabel}</span>}
      </div>
    </div>
  );
}
```

---

## MetricBadge
**Objetivo:** Número + label + delta. Usado em grids de métricas rápidas.
**Risco de duplicação:** BAIXO.

```tsx
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricBadgeProps {
  label: string;
  value: string | number;
  delta?: number;
  tone?: "neutral" | "positive" | "negative" | "primary";
}

export function MetricBadge({ label, value, delta, tone = "neutral" }: MetricBadgeProps) {
  const isPos = delta && delta > 0;
  const deltaColor = isPos ? "text-emerald-400" : delta && delta < 0 ? "text-rose-400" : "text-white/40";
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl p-3 text-center">
      <span className="text-[10px] uppercase tracking-wider text-white/40">{label}</span>
      <span className="text-xl font-bold text-white">{value}</span>
      {delta !== undefined && (
        <span className={cn("flex items-center gap-0.5 text-xs font-semibold", deltaColor)}>
          {isPos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(delta)}%
        </span>
      )}
    </div>
  );
}
```

---

## IslandMiniCard
**Objetivo:** Card horizontal para preview de ilha (mobile, sidebar, dropdown).
**Risco de duplicação:** BAIXO.

```tsx
interface IslandMiniCardProps {
  id: string;
  name: string;
  tagline: string;
  theme: string; // nome do tema no token kratos
  icon: React.ReactNode;
  status?: "active" | "idle" | "alert";
  onClick?: () => void;
}

export function IslandMiniCard({ name, tagline, theme, icon, status, onClick }: IslandMiniCardProps) {
  return (
    <GlassPanel interactive padding="sm" className={cn("flex items-center gap-3 border-l-2", `border-l-kratos-${theme}-DEFAULT`)} onClick={onClick}>
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-lg", `bg-kratos-${theme}-DEFAULT/20 text-kratos-${theme}-label`)}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{name}</p>
        <p className="text-[11px] text-white/50">{tagline}</p>
      </div>
      {status === "active" && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
    </GlassPanel>
  );
}
```

**Nota:** Adaptar a classe `border-l-kratos-${theme}-DEFAULT` conforme a config real do Tailwind (pode precisar de safelist ou classe estática mapeada).
===== END FILE =====

===== FILE: docs/kimi/KIMI_CODE_RAW_PART_03_WORLD_MAP.md =====
# World Map Pseudo-3D — Referência

## Estratégia
Sem Three.js. Pseudo-3D via CSS `transform-style: preserve-3d`, `perspective`, SVG bridges, e camadas absolutas.

## Componentes

### OceanBackdrop
**Usar como:** adaptar  
Fundo imersivo com gradiente e parallax sutil.

```tsx
export function OceanBackdrop() {
  return (
    <div className="fixed inset-0 z-0 bg-gradient-to-b from-sky-400 via-blue-600 to-blue-950"
      style={{ backgroundSize: "100% 120%", backgroundPosition: "center" }} />
  );
}
```

### SkyLayer
**Usar como:** referência visual  
Gradiente topo + sol sutil. `pointer-events-none`.

```tsx
export function SkyLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent" />
      <div className="absolute right-[20%] top-[5%] h-64 w-64 rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.5), transparent 60%)" }} />
    </div>
  );
}
```

### CloudLayer
**Usar como:** adaptar  
3-5 nuvens com `blur-3xl`, drift CSS.

```tsx
export function CloudLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {[ {t:"10%", l:"-5%", d:100}, {t:"20%", l:"60%", d:140}, {t:"8%", l:"30%", d:120} ].map((c,i)=>(
        <div key={i} className="absolute rounded-full bg-white/30 blur-3xl animate-cloud-drift"
          style={{ top: c.t, left: c.l, width: "25vw", height: "12vh", animationDuration: `${c.d}s` }} />
      ))}
    </div>
  );
}
```

### FloatingIsland
**Usar como:** adaptar — verificar se já existe no repo.

```tsx
interface FloatingIslandProps {
  id: string;
  label: string;
  tagline: string;
  position: { left: string; top: string };
  theme: string;
  onClick?: () => void;
}

export function FloatingIsland({ id, label, tagline, position, theme, onClick }: FloatingIslandProps) {
  return (
    <motion.div
      className={cn("absolute flex flex-col items-center", `[--glow:theme(colors.kratos.${theme}.glow)]`)}
      style={{ left: position.left, top: position.top, transform: "translate(-50%, -50%)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, zIndex: 60 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onClick={onClick}
    >
      {/* Glow */}
      <div className="absolute -inset-8 rounded-full blur-3xl animate-pulse-glow" style={{ background: "var(--glow)", opacity: 0.25 }} aria-hidden />
      
      {/* Base 3D */}
      <div style={{ perspective: "1000px" }}>
        <div className="relative flex items-end justify-center rounded-[32px] bg-kratos-island-grass shadow-kratos-island"
          style={{ transform: "rotateX(12deg)", width: "160px", height: "120px", transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0 rounded-[32px] border-[6px] border-kratos-island-earth/40" />
          <span className="mb-4 text-4xl drop-shadow-lg">🏝️</span>
        </div>
        {/* Fake depth side */}
        <div className="absolute top-full left-4 right-4 h-6 rounded-b-2xl bg-kratos-island-earth"
          style={{ transform: "rotateX(-75deg) translateY(-12px)", transformOrigin: "top" }} aria-hidden />
      </div>

      {/* Label */}
      <GlassPanel className="mt-3 px-3 py-1.5 text-center">
        <p className="text-xs font-bold text-white">{label}</p>
        <p className="text-[10px] text-white/50">{tagline}</p>
      </GlassPanel>
    </motion.div>
  );
}
```

**Nota de adaptação:** Se o mapa já existe, não recriar do zero. Ajustar `rotateX`, sombras e adicionar `IslandLabel` sobre a base existente.

### IslandBridge / BridgeSystem
**Usar como:** referência visual  
SVG paths entre ilhas e castelo. Estático, decorativo.

```tsx
interface Bridge { from: {x:number,y:number}; to: {x:number,y:number}; id: string; }

export function BridgeSystem({ bridges }: { bridges: Bridge[] }) {
  return (
    <svg className="absolute inset-0 z-30 pointer-events-none" style={{ width:"100%", height:"100%" }}>
      {bridges.map(b => (
        <line key={b.id} x1={`${b.from.x}%`} y1={`${b.from.y}%`} x2={`${b.to.x}%`} y2={`${b.to.y}%`}
          stroke="#8B5E3C" strokeWidth="6" strokeLinecap="round"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }} />
      ))}
    </svg>
  );
}
```

### CentralCastleMission
**Usar como:** adaptar — provavelmente já existe um hub central.

```tsx
export function CentralCastleMission({ position, mission }: any) {
  return (
    <div className="absolute z-50 flex flex-col items-center" style={{ left: position.left, top: position.top, transform: "translate(-50%, -50%)" }}>
      {/* Castelo base simplificado */}
      <div className="relative flex flex-col items-center">
        <div className="relative flex h-48 w-56 items-end justify-center rounded-t-3xl bg-kratos-castle-stone shadow-2xl"
          style={{ clipPath: "polygon(20% 0%,80% 0%,100% 40%,100% 100%,0% 100%,0% 40%)" }}>
          {/* Torres */}
          <div className="absolute -left-2 top-0 h-28 w-10 rounded-t-lg bg-kratos-castle-stone"><div className="absolute -top-4 left-0 h-6 w-10 rounded-t-md bg-kratos-castle-roof"/></div>
          <div className="absolute -right-2 top-0 h-28 w-10 rounded-t-lg bg-kratos-castle-stone"><div className="absolute -top-4 left-0 h-6 w-10 rounded-t-md bg-kratos-castle-roof"/></div>
          <div className="absolute -top-6 left-1/2 h-16 w-12 -translate-x-1/2 rounded-t-lg bg-kratos-castle-stone"><div className="absolute -top-5 left-0 h-8 w-12 rounded-t-md bg-kratos-castle-roof"/></div>
          {/* Escudo */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-kratos-castle-gold bg-kratos-castle-shield">
            <span className="text-4xl font-black text-kratos-castle-gold">K</span>
          </div>
        </div>
        <div className="h-12 w-72 rounded-b-lg bg-kratos-island-earth shadow-xl"><div className="mx-auto h-full w-40 rounded-b-md bg-stone-400/30"/></div>
      </div>
      {/* Banner */}
      <GlassPanel className="absolute -bottom-24 left-1/2 w-64 -translate-x-1/2 border-kratos-castle-shield/30 bg-kratos-castle-shield/85 text-center" padding="md">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-kratos-castle-gold">{mission.badge}</p>
        <h2 className="text-lg font-bold text-white">{mission.title}</h2>
        <p className="mt-1 text-xs text-white/70">{mission.subtitle}</p>
      </GlassPanel>
    </div>
  );
}
```

### KratosWorldMap (Composição)
**Usar como:** adaptar se já existe.

```tsx
const ISLANDS = [
  { id: "omnis", label: "OMNIS LAB", tagline: "Automações e IAs", x: "10%", y: "8%", theme: "omnis" },
  { id: "agencia", label: "AGÊNCIA", tagline: "Conteúdo, Marca e Marketing", x: "8%", y: "38%", theme: "agencia" },
  { id: "vila", label: "VILA VIVA", tagline: "Família, Filhos e Vida Real", x: "12%", y: "62%", theme: "vila" },
  { id: "arena", label: "ARENA COMERCIAL", tagline: "Vendas, Negociação e Conquistas", x: "22%", y: "78%", theme: "arena" },
  { id: "akasha", label: "AKASHA", tagline: "Banco de Conhecimento", x: "75%", y: "10%", theme: "akasha" },
  { id: "filosofia", label: "FILOSOFIA", tagline: "Aprendizado e Evolução", x: "82%", y: "38%", theme: "filosofia" },
  { id: "financas", label: "FINANÇAS", tagline: "Finanças Pessoais", x: "78%", y: "65%", theme: "financas" },
  { id: "forja", label: "FORJA", tagline: "Treino, Saúde e Disciplina", x: "45%", y: "72%", theme: "forja" },
  { id: "observatorio", label: "OBSERVATÓRIO", tagline: "Ideias e Inspirações", x: "65%", y: "82%", theme: "observatorio" },
  { id: "nimbus", label: "NIMBUS", tagline: "Sua vassoura mágica", x: "48%", y: "92%", theme: "nimbus" },
];

export function KratosWorldMap() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-kratos-ocean-deep">
      <OceanBackdrop />
      <SkyLayer />
      <CloudLayer />
      <BridgeSystem bridges={ISLANDS.map(i => ({ from: {x:50,y:45}, to: {x:parseFloat(i.x),y:parseFloat(i.y)}, id: `b-${i.id}` }))} />
      {ISLANDS.map(i => <FloatingIsland key={i.id} id={i.id} label={i.label} tagline={i.tagline} position={{left:i.x,top:i.y}} theme={i.theme} />)}
      <CentralCastleMission position={{left:"50%",top:"45%"}} mission={{badge:"MISSÃO ATUAL",title:"CONSTRUIR O FUTURO",subtitle:"ENQUANTO VIVO O PRESENTE"}} />
    </div>
  );
}
```

## Posicionamento das Ilhas (%)
Ver `KIMI_CODE_RAW_PART_01_TOKENS.md` seção Z-Index Hierarchy para coordenadas exatas.

## Hover States
- FloatingIsland: `scale(1.05)`, elevação do glow, `zIndex` temporário para 60.
- CentralCastle: banner levemente iluminado no hover.

## Reduced Motion
- `FloatingIsland`: manter posição fixa, remover float.
- `CloudLayer`: pausar drift.
- `BridgeSystem`: sem animação necessária.

## Risco Principal
Se o mapa já existe no repo, não recriar do zero. Adaptar tokens de cor, sombra e adicionar `CentralCastleMission` + `BridgeSystem` como overlays.
===== END FILE =====

===== FILE: docs/kimi/KIMI_CODE_RAW_PART_04_HUD_AURORA_DOCK.md =====
# HUD, Aurora e Dock — Referência

## KratosTopHud / TopBar
**Objetivo:** Barra superior flutuante com energia, nível, XP, relógio, escudo K.
**Componente alvo:** `KratosTopBar` ou similar existente.
**Risco:** ALTO de duplicação — provavelmente já existe.

```tsx
export function KratosTopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex h-16 items-center justify-between px-6 bg-kratos-hud-glass/80 backdrop-blur-glass border-b border-kratos-hud-border shadow-kratos-hud">
      <div className="flex items-center gap-3">
        <Avatar /> {/* existente */}
        <div>
          <p className="text-sm font-semibold text-white">Bom dia, Lucas! 👋</p>
          <p className="text-[10px] text-white/50">KRATOS CONTROL</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Metric icon={<Zap />} value="87%" label="ENERGIA" color="text-yellow-400" />
        <Metric icon={<Star />} value="47" label="NÍVEL" color="text-amber-400" />
        <ShieldK />
        <Metric icon={<Diamond />} value="32.780" label="XP" color="text-purple-400" />
        <ClockBadge />
      </div>
    </div>
  );
}
```

**Como adaptar:** Se `KratosTopBar` existe, apenas ajustar cores e tipografia para tokens Kimi. Não criar novo componente.

---

## Sidebar
**Objetivo:** Navegação global de ilhas. Fixa esquerda. ~220px.
**Risco:** ALTO — já existe `KratosSidebar`.

Adaptação necessária:
- Adicionar highlight temático por ilha ativa (borda esquerda colorida).
- Manter ícone + label vertical.
- Não transformar em painel de dados (isso é função de widgets posicionados, não da sidebar).

```tsx
const NAV = [
  { id: "visao", label: "VISÃO GERAL", icon: Home },
  { id: "omnis", label: "OMNIS", icon: Bot },
  { id: "agencia", label: "AGÊNCIA", icon: Camera },
  // ... etc
];

export function Sidebar({ activeId }: { activeId: string }) {
  return (
    <div className="fixed left-0 top-16 bottom-0 z-[100] w-[220px] border-r border-white/5 bg-slate-900/60 backdrop-blur-xl p-3 overflow-y-auto">
      {NAV.map(n => (
        <button key={n.id} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all text-left",
          activeId === n.id ? "bg-white/5 text-amber-300 border-l-2 border-amber-400" : "text-white/60 hover:bg-white/[0.03]")}>
          <n.icon className="h-5 w-5" />
          <span className="text-xs font-bold tracking-wide">{n.label}</span>
        </button>
      ))}
    </div>
  );
}
```

---

## RightRail
**Objetivo:** Painel direito de 340px. Slot container para widgets contextuais.
**Risco:** ALTO — já existe `KratosRightRail`.

Adaptação:
- Tornar container genérico que recebe `children`.
- Manter `AuroraPanel` no topo (sempre visível).
- Scroll interno obrigatório (`overflow-y-auto pb-24`).

```tsx
export function RightRail({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed right-0 top-16 bottom-0 z-[100] w-[340px] border-l border-white/5 bg-slate-900/40 backdrop-blur-xl p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
      <AuroraPanel />
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </div>
  );
}
```

---

## AuroraPanel
**Objetivo:** Assistente contextual. Não poluir.
**Componente alvo:** Painel existente de IA/assistente.

```tsx
export function AuroraPanel() {
  return (
    <GlassPanel padding="md" className="w-full">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 rounded-full bg-sky-400/20 overflow-hidden">
          {/* Avatar Aurora */}
          <span className="flex h-full w-full items-center justify-center text-xl">🧙‍♀️</span>
          <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">AURORA <span className="ml-1 text-[10px] font-normal text-emerald-400">● ONLINE</span></p>
          <p className="text-xs text-white/60 leading-snug">Estou aqui para te ajudar a focar no que realmente importa hoje.</p>
        </div>
      </div>
      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 py-2 text-xs font-medium text-white/70 hover:bg-white/10 transition-colors">
        Falar com Aurora <Volume2 className="h-3 w-3" />
      </button>
    </GlassPanel>
  );
}
```

**Regra de ouro:** Aurora deve ocupar no máximo 180px de altura. Não criar chat history extenso aqui.

---

## BottomDock — Arquitetura de Slots
**Objetivo:** Container adaptativo inferior. NÃO é apenas player + squads.
**Decisão:** Dock recebe slots por contexto.

```tsx
interface BottomDockProps {
  leftSlot?: React.ReactNode;   // Player (quase sempre)
  centerSlots?: React.ReactNode[]; // Widgets operacionais
  rightSlot?: React.ReactNode;   // Squads, Integrações, etc.
}

export function BottomDock({ leftSlot, centerSlots, rightSlot }: BottomDockProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] flex items-end justify-center gap-3 p-4 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent">
      <div className="flex w-full max-w-[1600px] items-end gap-3">
        {leftSlot && <div className="flex-shrink-0">{leftSlot}</div>}
        {centerSlots?.map((s, i) => <div key={i} className="flex-1 min-w-0">{s}</div>)}
        {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
      </div>
    </div>
  );
}
```

**Perfis de uso:**
- Mapa: `left=<AudioPlayer/>` `right=<SquadDock/>`
- OMNIS: `left=<AudioPlayer/>` `center=[<EconomyCounter/>,<SystemHealth/>]` `right=<IntegrationGrid/>`
- Agência: `left=<AudioPlayer/>` `right=<SquadDock/>`

---

## StatusBarDock
**Objetivo:** Barra compacta de status operacional (missão + foco + próxima ação + squad + player). Recomendado como padrão global em todas as ilhas.

```tsx
export function StatusBarDock({ mission, foco, nextAction, squad, player }: any) {
  return (
    <div className="flex w-full max-w-[1400px] items-center gap-1 rounded-2xl border-t border-white/5 bg-slate-900/80 px-4 py-2 backdrop-blur-xl">
      {/* Missão */}
      <div className="flex items-center gap-3 border-r border-white/10 pr-4">
        <div className="h-9 w-9 rounded-full bg-amber-500/20 flex items-center justify-center text-lg">🐯</div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Missão Atual</span>
          <span className="text-sm font-semibold text-white">{mission.label}</span>
          <div className="mt-0.5 h-1 w-24 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full bg-emerald-500" style={{width:`${mission.progress}%`}}/></div>
        </div>
        <span className="text-xs font-bold text-white/60">{mission.progress}%</span>
      </div>
      {/* Foco */}
      <div className="flex items-center gap-2 border-r border-white/10 px-4">
        <Target className="h-4 w-4 text-rose-400" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Foco do Dia</span>
          <span className="text-sm font-semibold text-white">{foco}</span>
        </div>
      </div>
      {/* Próxima Ação */}
      <button className="flex flex-1 items-center justify-between gap-2 border-r border-white/10 px-4 text-left hover:bg-white/5 transition-colors">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Próxima Ação</span>
          <span className="text-sm font-semibold text-white">{nextAction.label}</span>
        </div>
        <ChevronRight className="h-4 w-4 text-white/30" />
      </button>
      {/* Squad */}
      <div className="flex items-center gap-2 border-r border-white/10 px-4">
        <span className="text-[10px] uppercase tracking-wider text-white/40">Squad</span>
        <div className="flex -space-x-2">{squad.avatars}</div>
      </div>
      {/* Player */}
      <div className="flex items-center gap-3 pl-2">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-white">{player.track}</span>
          <span className="text-[10px] text-white/50">{player.artist}</span>
        </div>
        <div className="flex items-center gap-1 text-white/70">
          <SkipBack className="h-3.5 w-3.5" />
          {player.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          <SkipForward className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
```

**Decisão padrão:** Usar `StatusBarDock` como dock inferior fixo em todas as ilhas. `WorldNavDock` aparece apenas no Mapa ou via menu.

---

## SquadDock
**Objetivo:** Avatares de squads com indicador ativo.

```tsx
export function SquadDock({ squads, activeId, onSelect }: any) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-slate-900/70 px-4 py-2 shadow-kratos-glass backdrop-blur-xl">
      {squads.map((s: any) => (
        <motion.button key={s.id} whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }} onClick={() => onSelect(s.id)} className="flex flex-col items-center gap-1">
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-full border-2 text-lg", activeId === s.id ? "border-white/40" : "border-transparent")} style={{ background: s.color }}>
            {s.avatar}
          </div>
          <span className="text-[10px] font-medium text-white/60">{s.name}</span>
        </motion.button>
      ))}
      <button className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-white/20 bg-white/5 text-white/50 hover:bg-white/10">
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}
```

---

## AudioPlayer
**Objetivo:** Player glassmorphism compacto.

```tsx
export function AudioPlayer({ track, artist, progress = 0 }: any) {
  return (
    <GlassPanel padding="sm" className="flex items-center gap-3 w-72">
      <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-lg">🎵</div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-xs font-semibold text-white">{track}</p>
        <p className="truncate text-[10px] text-white/50">{artist}</p>
        <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-sky-400" style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="flex items-center gap-1 text-white/70">
        <SkipBack className="h-3.5 w-3.5" /><Pause className="h-4 w-4" /><SkipForward className="h-3.5 w-3.5" />
      </div>
    </GlassPanel>
  );
}
```

## Riscos & Decisões Pendentes
1. **BottomDock final:** `StatusBarDock` global + `WorldNavDock` no Mapa. Não dock duplo em telas < 1080px.
2. **RightRail:** Sempre slot container. Cada ilha injeta widgets.
3. **Sidebar:** Navegação global fixa. Não substituir por painel de stats (Akasha).
===== END FILE =====

===== FILE: docs/kimi/KIMI_CODE_RAW_PART_05_INTERNAL_ISLANDS.md =====
# Ilhas Internas — Templates & Componentes

## Regra de ouro
Uma ilha por microfase. Não implementar todas juntas.

---

## Template 1: Criativa (Agência / Estúdio)
**Papel:** Conteúdo, marca, comunicação.  
**Visual:** Cards coloridos flutuantes, laranja/quente.  
**MVP visual:** KpiQuadPanel + ContentCalendar + IdeaTracker + MetricBadgeV2.

### KpiQuadPanel
```tsx
const KPIS = [
  { id: "ideias", label: "Ideias", value: 23, icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-400/10" },
  { id: "producao", label: "Em Produção", value: 7, icon: Clapperboard, color: "text-orange-400", bg: "bg-orange-400/10" },
  { id: "agendados", label: "Agendados", value: 12, icon: CalendarCheck, color: "text-sky-400", bg: "bg-sky-400/10" },
  { id: "publicados", label: "Publicados", value: 48, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
];
export function KpiQuadPanel() {
  return (
    <GlassPanel padding="lg" className="w-full max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/60">Painel Criativo</h2>
        <span className="rounded-md bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">AO VIVO</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {KPIS.map((k, i) => (
          <motion.div key={k.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="flex flex-col items-center rounded-xl bg-white/[0.03] p-3 text-center hover:bg-white/[0.06]">
            <div className={cn("mb-2 flex h-10 w-10 items-center justify-center rounded-lg", k.bg)}><k.icon className={cn("h-5 w-5", k.color)} /></div>
            <span className="text-2xl font-bold text-white">{k.value}</span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-white/40">{k.label}</span>
          </motion.div>
        ))}
      </div>
      {/* Sparkline SVG placeholder */}
    </GlassPanel>
  );
}
```

### ContentCalendar
Grid 7 colunas, células 32px, hoje com ring laranja.

### IdeaTracker
Lista com barra de progresso horizontal (emerald/amber/orange).

---

## Template 2: Mística (Nimbus / Sonhos)
**Papel:** Viagens, sonhos, visualização.  
**Visual:** Portal swirl azul-ciano, placas de madeira, checklist.  
**MVP:** DreamPortal + TravelCard + WishList + AdventureTracker.

### DreamPortal
```tsx
export function DreamPortal({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="absolute inset-0 rounded-full blur-3xl animate-pulse-glow" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.5), transparent 70%)" }} aria-hidden />
      <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-sky-900/50 bg-slate-900/40 shadow-2xl backdrop-blur-sm">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-[spin_8s_linear_infinite]">
          {[0, 20, 40].map((o, i) => (
            <circle key={i} cx="100" cy="100" r={80 - o} fill="none" stroke="url(#pg)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${120 + i * 40} ${240}`}
              opacity={0.8 - i * 0.15} style={{ animation: `spin ${6 + i * 2}s linear infinite ${i % 2 ? "reverse" : "normal"}`, transformOrigin: "center" }} />
          ))}
          <defs><linearGradient id="pg"><stop offset="0%" stopColor="#67E8F9" /><stop offset="50%" stopColor="#0EA5E9" /><stop offset="100%" stopColor="#1E40AF" /></linearGradient></defs>
        </svg>
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="z-20 h-16 w-16 rounded-full bg-cyan-300 shadow-[0_0_30px_rgba(103,232,249,0.8)]" />
      </div>
    </div>
  );
}
```

### WoodenSign
Placa rústica: `bg-amber-900 border-amber-950 text-amber-100 uppercase tracking-widest`.

### TravelCard
Thumb 48px + destino/datas + badge dias. GlassPanel horizontal.

### WishList
Estrelas preenchidas/vazias + círculo check. Não usar checkbox HTML nativo.

### AdventureTracker
Ícone 40px + barra progresso + %. Variante do IdeaTracker.

---

## Template 3: Tech (OMNIS Lab)
**Papel:** IA, agentes, automações.  
**Visual:** Roxo/ciano, neon, core holográfico.  
**MVP:** HolographicCore + AgentList + IntegrationGrid + SystemHealth + EconomyCounter.

### HolographicCore
```tsx
export function HolographicCore({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className="relative flex h-56 w-56 items-center justify-center rounded-full border-2 border-violet-500/30 bg-slate-900/60 shadow-[0_0_60px_rgba(139,92,246,0.4)] backdrop-blur-sm">
        <svg className="absolute inset-0 h-full w-full animate-[spin_10s_linear_infinite]"><circle cx="100" cy="100" r="90" fill="none" stroke="url(#cg1)" strokeWidth="2" strokeDasharray="20 40" opacity="0.6" /></svg>
        <svg className="absolute inset-4 h-[calc(100%-32px)] w-[calc(100%-32px)] animate-[spin_7s_linear_infinite_reverse]"><circle cx="100" cy="100" r="80" fill="none" stroke="url(#cg2)" strokeWidth="3" strokeDasharray="60 30" opacity="0.5" /></svg>
        <motion.div animate={{ rotateY: [0, 360], rotateX: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="relative h-16 w-16" style={{ transformStyle: "preserve-3d" }}>
          {[0, 90, 180, 270].map((r, i) => (
            <div key={i} className="absolute inset-0 border border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
              style={{ transform: i < 2 ? `rotateY(${r}deg) translateZ(32px)` : `rotateX(${r - 180}deg) translateZ(32px)` }} />
          ))}
          <div className="absolute inset-0 border border-cyan-400/60 bg-cyan-400/10" style={{ transform: "rotateX(90deg) translateZ(32px)" }} />
          <div className="absolute inset-0 border border-cyan-400/60 bg-cyan-400/10" style={{ transform: "rotateX(-90deg) translateZ(32px)" }} />
        </motion.div>
      </div>
      <div className="relative z-10 -mt-6 rounded-lg bg-slate-900/90 px-6 py-2 border border-violet-500/40 shadow-xl">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">OMNIS Core</span>
      </div>
    </div>
  );
}
```

### AgentList
Avatar 36px + ring violeta + dot status + nome/função.

### IntegrationGrid
Grid 4 cols, célula 64px, badge "Conectado" emerald.

### SystemHealth
ProgressRing 98% + checklist 4 itens (DB, Servers, APIs, AI).

### EconomyCounter
Clock icon + tempo economizado + delta verde.

---

## Template 4: Vault (Akasha / Gringotts)
**Papel:** Memória, conhecimento, arquivos.  
**Visual:** Esmeralda/dourado, cristais, placas douradas.  
**MVP:** KnowledgeStatPanel + GoldBorderCard + VaultIntegrityBadge + MemorySparkline.

### KnowledgeStatPanel
Stats verticais com ícones à esquerda, valores grandes, labels. GlassPanel borda âmbar.

### GoldBorderCard
`border-l-[3px] border-l-amber-500`. Ícone container âmbar.

### VaultIntegrityBadge
ShieldCheck + "100%" + barra cheia emerald.

### MemorySparkline
SVG área verde + delta percentual.

### VaultCrystal
Forma diamante (SVG ou clip-path) + glow ciano + float.

---

## Template 5: Vida (Vila Viva)
**Papel:** Família, rotina, vida real.  
**Visual:** Verde quente, terra, acolhedor.  
**MVP:** RoutineCard, HomeStatus, FamilyChecklist, MoodTracker.

### O que não implementar agora
- **Arena Comercial:** Depende de template Criativa/Tech misto. Aguardar necessidade real de métricas de vendas.
- **Forja / Corpo:** Depende de template Tech com métricas biométricas. Aguardar integração com wearables.
- **Observatório:** Depende de template Místico com timeline. Aguardar conteúdo filosófico estruturado.
- **Tesouro / Finanças:** Depende de template Vault com gráficos financeiros. Aguardar API de dados.
- **Palco Central:** Já existe como `CentralCastleMission` no mapa.

## Dados reais necessários por ilha
| Ilha | Dados via backend existente |
|---|---|
| Agência | Projetos, calendário, métricas de mídia (mock ou real) |
| Nimbus | Viagens planejadas, sonhos checklist (localStorage/SQLite) |
| OMNIS | Agentes ativos, automações, saúde do sistema, tempo economizado |
| Akasha | Documentos, prompts, integridade (SQLite local) |
| Vila | Eventos pessoais, checklist casa (local) |

## Estado atual provável
A maioria das ilhas internas ainda não existe como rota/componente. O mapa existe com ilhas flutuantes decorativas. Cada microfase 07-14 cria uma rota + interior.
===== END FILE =====

===== FILE: docs/kimi/KIMI_CODE_RAW_PART_06_QA_PROMPTS.md =====
# QA Prompts e Checklists

## Checklist Visual
| Item | OK | AJUSTE LEVE | DIVERGÊNCIA | BLOQUEANTE |
|---|---|---|---|---|
| Glassmorphism legível sobre oceano | | | | |
| Cores primárias preservadas (sem azul corporativo) | | | | |
| Texto 100% HTML overlay (não depende de imagem) | | | | |
| Bordas white/5 a white/10 (nunca preto sólido) | | | | |
| Padding múltiplos de 4px (4,8,12,16,24,32) | | | | |
| Contraste mínimo 4.5:1 para textos | | | | |
| Ilhas diferenciáveis por cor e ícone | | | | |
| Castelo central mais elevado que ilhas | | | | |
| Pontes visíveis mas não poluentes | | | | |
| HUD não cobre elementos interativos do mapa | | | | |

## Checklist Neuro UX
| Item | OK | AJUSTE LEVE | DIVERGÊNCIA | BLOQUEANTE |
|---|---|---|---|---|
| Missão atual visível em <= 10s | | | | |
| Próxima ação destacada no dock | | | | |
| Reduced motion respeitado (prefers-reduced-motion) | | | | |
| Estados vazio sempre ilustrados (nunca quebrado) | | | | |
| Estados erro com retry claro | | | | |
| Loading sem flash branco agressivo | | | | |
| Sem excesso de cards (>7 visíveis = poluição) | | | | |
| Sem dashboard de culpa (não humilhar por produtividade) | | | | |
| Fonte legível, sem serifas em corpo | | | | |
| Botões/áreas de clique >= 44px | | | | |

## Checklist Backend Intacto
| Item | OK | AJUSTE LEVE | DIVERGÊNCIA | BLOQUEANTE |
|---|---|---|---|---|
| Sem endpoint novo criado | | | | |
| Sem alteração em /live/stream | | | | |
| Sem alteração em /live/snapshot | | | | |
| Sem alteração em /mission/lens | | | | |
| Sem alteração em useLiveKratos | | | | |
| Sem auth novo | | | | |
| Sem Supabase | | | | |
| Sem package novo sem justificar | | | | |
| Build passa (npm run build) | | | | |
| Testes backend passam (pytest) | | | | |

## Checklist SourceBadge
| Item | OK | AJUSTE LEVE | DIVERGÊNCIA | BLOQUEANTE |
|---|---|---|---|---|
| SourceBadge visível em dados que precisam de fonte | | | | |
| Badge não quebra layout | | | | |
| Badge mantém consistência visual | | | | |

## Checklist Mission Lens
| Item | OK | AJUSTE LEVE | DIVERGÊNCIA | BLOQUEANTE |
|---|---|---|---|---|
| Mission Lens v1 intacto | | | | |
| Missão atual sincronizada com backend | | | | |

## Prompts para Visual Review (Claude Code)
```txt
Execute uma visual review da microfase atual. Compare o estado atual do frontend com o mockup ideal descrito em KIMI_CODE_RAW_PART_XX. Gere um relatório classificando cada elemento encontrado em:
- OK (fiel ao mockup)
- AJUSTE LEVE (cor/sombra/tamanho próximo mas não exato)
- DIVERGÊNCIA (posição, componente faltando, comportamento errado)
- BLOQUEANTE (quebra funcional, erro de build, regressão)

Liste os 5 problemas mais graves primeiro. Para cada um, indique o arquivo a alterar e a sugestão de correção em até 3 linhas.
```

## Prompt para Comparar Screenshot vs Mockup
```txt
Analise a screenshot atual do KRATOS e compare com a especificação Kimi. Foque em:
1. Hierarquia de elevação (z-index/blur/shadow)
2. Tokens de cor (hex e opacidade)
3. Tipografia (tamanho, peso, tracking)
4. Spacing (padding, gap, margin)
5. Motion/estados (hover, active, transition)

Não altere código. Apenas gere o relatório de divergência.
```

## Prompt para Relatório Final de Microfase
```txt
Gere o relatório de fechamento da microfase [FRONT-KIMI-XX]:
- Arquivos alterados
- Componentes criados/adaptados
- Tokens adicionados
- Débitos técnicos identificados
- Próxima microfase recomendada e por quê
- Veredito brutal: PASSOU / AJUSTE LEVE / BLOQUEANTE
```
===== END FILE =====

===== FILE: docs/kimi/KIMI_EXECUTION_ROADMAP.md =====
# KIMI Execution Roadmap

## FRONT-KIMI-00 — Setup docs/kimi
- **Objetivo:** Criar este diretório e garantir que Claude Code conhece a fonte canônica.
- **Arquivos Kimi:** README, INDEX.
- **Arquivos KRATOS:** nenhum.
- **Pode alterar:** nada.
- **Não pode alterar:** nada.
- **Critério:** diretório criado e populado.
- **Validação:** `ls docs/kimi/` retorna os 16 arquivos.
- **Risco:** zero.

## FRONT-KIMI-01 — UI Primitives Seguras
- **Objetivo:** Implementar/adaptar EmptyState, ErrorState, ProgressRing, MetricBadge. Garantir que não duplicam componentes existentes.
- **Arquivos Kimi:** PART_02, PART_01.
- **Arquivos KRATOS:** `src/components/ui/` ou similar.
- **Pode alterar:** tailwind.config (extend de cores/sombras se necessário).
- **Não pode alterar:** backend, rotas, hooks.
- **Critério:** 4 primitives renderizáveis, TypeScript estrito, sem `any`.
- **Validação:** Storybook ou render manual mostrando os 4 estados.
- **Risco:** Médio — duplicação de componentes existentes.

## FRONT-KIMI-02 — Tokens + Glass Consistency
- **Objetivo:** Consolidar tailwind.config com tokens Kimi (cores, glass, blur, radius, motion). Garantir que todos os glass panels usam os mesmos tokens.
- **Arquivos Kimi:** PART_01.
- **Arquivos KRATOS:** `tailwind.config.ts`, `src/index.css` ou tokens CSS.
- **Pode alterar:** config do Tailwind, CSS global.
- **Não pode alterar:** lógica de componentes, backend.
- **Critério:** `bg-kratos-hud-glass`, `shadow-kratos-glass`, `backdrop-blur-glass` funcionam globalmente.
- **Validação:** GlassPanel existente usa tokens novos sem regressão visual.
- **Risco:** Baixo.

## FRONT-KIMI-03 — World Map Polish
- **Objetivo:** Ajustar pseudo-3D, posicionamento das ilhas, adicionar CentralCastleMission, CloudLayer, BridgeSystem. Não recriar mapa se já existir.
- **Arquivos Kimi:** PART_03, PART_01.
- **Arquivos KRATOS:** `src/components/world/` ou `KratosWorldMap`.
- **Pode alterar:** componentes de mundo, posições %.
- **Não pode alterar:** roteamento, backend.
- **Critério:** Ilhas posicionadas conforme tabela, castelo central com banner, nuvens drift, pontes visíveis.
- **Validação:** Screenshot comparado com mockup Master World.
- **Risco:** Médio — conflito com mapa existente.

## FRONT-KIMI-04 — HUD Assembly Polish
- **Objetivo:** Ajustar TopBar, Sidebar, RightRail para tokens e slots. Sidebar com highlight temático. RightRail como container genérico.
- **Arquivos Kimi:** PART_04.
- **Arquivos KRATOS:** `src/components/hud/` ou shell existente.
- **Pode alterar:** HUD shell, CSS.
- **Não pode alterar:** backend, useLiveKratos.
- **Critério:** TopBar com tokens, Sidebar highlight ativo, RightRail aceita children.
- **Validação:** Navegação entre ilhas mantém HUD consistente.
- **Risco:** Médio.

## FRONT-KIMI-05 — Aurora Panel Polish
- **Objetivo:** Ajustar AuroraPanel para não poluir, manter <= 180px, CTA claro, status online.
- **Arquivos Kimi:** PART_04.
- **Arquivos KRATOS:** Painel direito existente.
- **Pode alterar:** componente Aurora.
- **Não pode alterar:** lógica de chat/IA se já existir.
- **Critério:** Aurora presente, compacta, funcional.
- **Validação:** Usuário vê Aurora em 10s.
- **Risco:** Baixo.

## FRONT-KIMI-06 — BottomDock / MissionBar / StatusBarDock Polish
- **Objetivo:** Definir arquitetura final do dock. Implementar StatusBarDock como padrão global. BottomDock como container de slots.
- **Arquivos Kimi:** PART_04.
- **Arquivos KRATOS:** Dock existente.
- **Pode alterar:** Dock inferior.
- **Não pode alterar:** backend.
- **Critério:** StatusBarDock renderiza Missão + Foco + Próxima Ação + Squad + Player.
- **Validação:** Foco do Dia e Próxima Ação sempre visíveis.
- **Risco:** Médio — decisão arquitetural.

## FRONT-KIMI-07 — Internal Island: OMNIS Lab
- **Objetivo:** Rota `/ilha/omnis` com interior tech: HolographicCore, AgentList, IntegrationGrid, SystemHealth, EconomyCounter.
- **Arquivos Kimi:** PART_05.
- **Arquivos KRATOS:** roteamento, lazy load.
- **Pode alterar:** novos componentes em `src/components/islands/omnis/`.
- **Não pode alterar:** backend (dados podem vir de mock/props).
- **Critério:** Interior carrega, core animado, agentes listados, health 98%.
- **Validação:** Transição mapa -> OMNIS com AnimatePresence.
- **Risco:** Alto — primeiro interior, serve de padrão.

## FRONT-KIMI-08 — Internal Island: Akasha / Gringotts
- **Objetivo:** Rota `/ilha/akasha`. Vault com stats, documentos, integridade.
- **Arquivos Kimi:** PART_05.
- **Pode alterar:** `src/components/islands/akasha/`.
- **Não pode alterar:** backend.
- **Critério:** KnowledgeStatPanel + GoldBorderCard + VaultIntegrity + Sparkline.
- **Validação:** Scroll interno no RightRail se necessário.
- **Risco:** Médio.

## FRONT-KIMI-09 — Internal Island: Agência / Estúdio
- **Objetivo:** Rota `/ilha/agencia`. Painel criativo, calendário, idea tracker.
- **Arquivos Kimi:** PART_05.
- **Pode alterar:** `src/components/islands/agencia/`.
- **Não pode alterar:** backend.
- **Critério:** KpiQuadPanel, ContentCalendar, IdeaTracker funcionando.
- **Validação:** Métricas visíveis, calendário com dots de status.
- **Risco:** Médio.

## FRONT-KIMI-10 — Internal Island: Arena Comercial
- **Objetivo:** Rota `/ilha/arena`. Métricas de vendas, metas, CRM visual.
- **Arquivos Kimi:** PART_05 (template Criativa/Tech misto).
- **Pode alterar:** `src/components/islands/arena/`.
- **Não pode alterar:** backend.
- **Critério:** Cards de metas, funil visual simplificado.
- **Validação:** Dados de vendas mockados ou reais.
- **Risco:** Médio.

## FRONT-KIMI-11 — Internal Island: Forja / Corpo
- **Objetivo:** Rota `/ilha/forja`. Treino, saúde, disciplina.
- **Arquivos Kimi:** PART_05 (template Tech adaptado).
- **Pode alterar:** `src/components/islands/forja/`.
- **Não pode alterar:** backend.
- **Critério:** Métricas de saúde, checklist de hábitos.
- **Validação:** Integração futura com wearables (mock agora).
- **Risco:** Baixo.

## FRONT-KIMI-12 — Internal Island: Observatório
- **Objetivo:** Rota `/ilha/observatorio`. Estratégia, filosofia, decisões.
- **Arquivos Kimi:** PART_05 (template Místico).
- **Pode alterar:** `src/components/islands/observatorio/`.
- **Não pode alterar:** backend.
- **Critério:** Timeline de decisões, citações, mapas mentais simplificados.
- **Validação:** Conteúdo filosófico estruturado.
- **Risco:** Baixo.

## FRONT-KIMI-13 — Internal Island: Vila Viva
- **Objetivo:** Rota `/ilha/vila`. Família, rotina, vida real.
- **Arquivos Kimi:** PART_05 (template Vida).
- **Pode alterar:** `src/components/islands/vila/`.
- **Não pode alterar:** backend.
- **Critério:** RoutineCard, checklist familiar, eventos.
- **Validação:** Dados locais ou mock.
- **Risco:** Baixo.

## FRONT-KIMI-14 — Internal Island: Tesouro / Finanças
- **Objetivo:** Rota `/ilha/tesouro`. Patrimônio, metas financeiras.
- **Arquivos Kimi:** PART_05 (template Vault adaptado).
- **Pode alterar:** `src/components/islands/tesouro/`.
- **Não pode alterar:** backend.
- **Critério:** Gráfico simplificado de patrimônio, lista de metas.
- **Validação:** Mock seguro, sem dados reais de conta bancária expostos.
- **Risco:** Baixo.

## FRONT-KIMI-15 — Visual QA + Screenshot Review
- **Objetivo:** Rodar todos os checklists de PART_06. Comparar screenshot atual vs mockup ideal. Gerar relatório de fechamento.
- **Arquivos Kimi:** PART_06, README.
- **Arquivos KRATOS:** todos os alterados nas microfases.
- **Pode alterar:** apenas ajustes leves finais.
- **Não pode alterar:** arquitetura, backend.
- **Critério:** 90% dos itens "OK" ou "AJUSTE LEVE". Zero BLOQUEANTE.
- **Validação:** Relatório final assinado.
- **Risco:** Baixo — se microfases anteriores foram bem feitas.
===== END FILE =====

===== FILE: docs/kimi/KIMI_COMPONENT_MAP.md =====
# Mapa de Componentes Kimi → KRATOS

| Kimi Component/Spec | Tipo | Fonte Kimi | Arquivo real KRATOS provável | Status esperado | Decisão | Risco | Microfase |
|---|---|---|---|---|---|---|---|
| GlassPanel | primitive | PART_02 | `src/components/ui/GlassPanel.tsx` | Provavelmente existe similar | ADAPTAR | Médio | 01 |
| KratosCard | primitive | PART_02 | `src/components/ui/KratosCard.tsx` | Pode não existir | USAR | Médio | 01 |
| StatusChip | primitive | PART_02 | `src/components/ui/StatusChip.tsx` | Provavelmente não existe | USAR | Baixo | 01 |
| MetricBadge | primitive | PART_02 | `src/components/ui/MetricBadge.tsx` | Pode não existir | USAR | Baixo | 01 |
| ProgressRing | primitive | PART_02 | `src/components/ui/ProgressRing.tsx` | Pode não existir | USAR | Baixo | 01 |
| EmptyState | primitive | PART_02 | `src/components/ui/EmptyState.tsx` | Pode existir genérico | ADAPTAR | Médio | 01 |
| ErrorState | primitive | PART_02 | `src/components/ui/ErrorState.tsx` | Pode existir genérico | ADAPTAR | Médio | 01 |
| LoadingSkeleton | primitive | PART_02 | `src/components/ui/LoadingSkeleton.tsx` | Pode existir | ADAPTAR | Médio | 01 |
| SectionTitle | primitive | PART_02 | `src/components/ui/SectionTitle.tsx` | Provavelmente não existe | USAR | Baixo | 01 |
| IslandMiniCard | primitive | PART_02 | `src/components/ui/IslandMiniCard.tsx` | Provavelmente não existe | USAR | Baixo | 03 |
| KratosWorldMap | world | PART_03 | `src/components/world/KratosWorldMap.tsx` | Provavelmente existe | ADAPTAR | Alto | 03 |
| OceanBackdrop | world | PART_03 | `src/components/world/OceanBackdrop.tsx` | Pode existir | ADAPTAR | Médio | 03 |
| CloudLayer | world | PART_03 | `src/components/world/CloudLayer.tsx` | Pode não existir | USAR | Baixo | 03 |
| FloatingIsland | world | PART_03 | `src/components/world/FloatingIsland.tsx` | Provavelmente existe | ADAPTAR | Alto | 03 |
| IslandBridge | world | PART_03 | `src/components/world/BridgeSystem.tsx` | Provavelmente não existe | USAR | Baixo | 03 |
| CentralCastleMission | world | PART_03 | `src/components/world/CentralCastleMission.tsx` | Pode não existir | USAR | Médio | 03 |
| IslandLabel | world | PART_03 | `src/components/world/IslandLabel.tsx` | Pode existir como parte do FloatingIsland | ADAPTAR | Médio | 03 |
| KratosTopHud | hud | PART_04 | `src/components/hud/TopBar.tsx` | Provavelmente existe | ADAPTAR | Alto | 04 |
| Sidebar | hud | PART_04 | `src/components/hud/Sidebar.tsx` | Provavelmente existe | ADAPTAR | Alto | 04 |
| RightRail | hud | PART_04 | `src/components/hud/RightRail.tsx` | Provavelmente existe | ADAPTAR | Alto | 04 |
| AuroraPanel | hud | PART_04 | `src/components/hud/AuroraPanel.tsx` | Pode existir | ADAPTAR | Médio | 05 |
| BottomDock | hud | PART_04 | `src/components/hud/BottomDock.tsx` | Provavelmente existe | ADAPTAR | Alto | 06 |
| StatusBarDock | hud | PART_04 | `src/components/hud/StatusBarDock.tsx` | Provavelmente não existe | USAR | Médio | 06 |
| SquadDock | hud | PART_04 | `src/components/hud/SquadDock.tsx` | Pode não existir | USAR | Baixo | 06 |
| AudioPlayer | hud | PART_04 | `src/components/hud/AudioPlayer.tsx` | Pode existir | ADAPTAR | Baixo | 06 |
| OMNIS Lab | island-page | PART_05 | `src/components/islands/omnis/` | Não existe | USAR | Alto | 07 |
| Akasha Vault | island-page | PART_05 | `src/components/islands/akasha/` | Não existe | USAR | Médio | 08 |
| Studio Page (Agência) | island-page | PART_05 | `src/components/islands/agencia/` | Não existe | USAR | Médio | 09 |
| Arena Comercial | island-page | PART_05 | `src/components/islands/arena/` | Não existe | ADIAR | Baixo | 10 |
| Forja / Corpo | island-page | PART_05 | `src/components/islands/forja/` | Não existe | ADIAR | Baixo | 11 |
| Observatório | island-page | PART_05 | `src/components/islands/observatorio/` | Não existe | ADIAR | Baixo | 12 |
| Vila Viva | island-page | PART_05 | `src/components/islands/vila/` | Não existe | ADIAR | Baixo | 13 |
| Tesouro / Finanças | island-page | PART_05 | `src/components/islands/tesouro/` | Não existe | ADIAR | Baixo | 14 |

## Itens descartados proativamente
| Item | Motivo |
|---|---|
| Three.js / R3F / WebGL | Proibido por regra absoluta |
| Zustand novo | Só se state management local estiver quebrado |
| Framer Motion se não instalado | Verificar package.json primeiro |
| class-variance-authority | Só se projeto já usa |
| `any` | Proibido |
===== END FILE =====

===== FILE: docs/kimi/KIMI_ADOPTION_LOG.md =====
# Log de Adoção Kimi

Template de registro. Claude Code deve preencher após cada microfase.

---

## Exemplo: FRONT-KIMI-01 — UI Primitives
| Campo | Valor |
|---|---|
| Data | 2026-05-21 |
| Microfase | FRONT-KIMI-01 |
| Trecho usado | EmptyState, ErrorState, ProgressRing, MetricBadge |
| Decisão | adaptado / usado / adiado / descartado |
| Arquivos alterados | `src/components/ui/EmptyState.tsx` (adaptado de Empty.tsx existente), `src/components/ui/ProgressRing.tsx` (novo) |
| Motivo | EmptyState já existia com estilo incorreto; refatorei para glass. ProgressRing não existia. |
| Validação | Render manual mostrando os 4 estados. Build passou. |
| Riscos | ProgressRing usa SVG inline — verificar se não conflita com ícones SVG do Lucide. |
| Observação brutal | Não criei KratosCard porque o Card existente já tinha 80% do que precisava. Só adicionei variant. |

---

## Exemplo: FRONT-KIMI-03 — World Map Polish
| Campo | Valor |
|---|---|
| Data | 2026-05-22 |
| Microfase | FRONT-KIMI-03 |
| Trecho usado | FloatingIsland glow, CentralCastleMission, BridgeSystem |
| Decisão | adaptado |
| Arquivos alterados | `src/components/world/FloatingIsland.tsx`, `src/components/world/CentralCastleMission.tsx` (novo) |
| Motivo | FloatingIsland existia sem glow e sem perspective. Adicionei tokens. Castelo não existia. |
| Validação | Screenshot comparado com mockup. Posições OK. |
| Riscos | BridgeSystem usa SVG absolute — pode deslocar em resize se ilhas usarem % inconsistente. |
| Observação brutal | Não recriei o mapa. Apenas poli o que existia. |

---

## Exemplo: FRONT-KIMI-05 — Aurora Panel Polish
| Campo | Valor |
|---|---|
| Data | 2026-05-23 |
| Microfase | FRONT-KIMI-05 |
| Trecho usado | AuroraPanel compacto |
| Decisão | adaptado |
| Arquivos alterados | `src/components/hud/AuroraPanel.tsx` |
| Motivo | Aurora existia mas ocupava 300px e poluía. Reduzi para 160px e adicionei CTA. |
| Validação | Visual QA — Aurora visível mas não invasiva. |
| Riscos | CTA "Falar com Aurora" ainda não tem handler real — é visual por enquanto. |
| Observação brutal | Se o chat real existir, precisarei de microfase dedicada para integrar. |

---

## Template vazio (copiar para nova entrada)

```
| Campo | Valor |
|---|---|
| Data | |
| Microfase | |
| Trecho usado | |
| Decisão | |
| Arquivos alterados | |
| Motivo | |
| Validação | |
| Riscos | |
| Observação brutal | |
```
===== END FILE =====

===== FILE: docs/kimi/KIMI_NEXT_MICROPHASE.md =====
# Próxima Microfase Recomendada

## FRONT-KIMI-01 — UI Primitives Seguras

### Por que vem agora
- São blocos de construção de baixo risco.
- Se algo quebrar, não afeta roteamento, backend ou shell.
- Prepara o terreno para todas as microfases seguintes (ilhas, HUD, mapa).
- Permite validar os tokens de PART_01 em componentes reais antes de aplicar no mapa inteiro.

### Arquivos Kimi a consultar
1. `KIMI_CODE_RAW_PART_01_TOKENS.md` — validar cores, blur, radius.
2. `KIMI_CODE_RAW_PART_02_UI_PRIMITIVES.md` — copiar/adaptar EmptyState, ErrorState, ProgressRing, MetricBadge.
3. `KIMI_COMPONENT_MAP.md` — confirmar se componente similar já existe.

### Arquivos KRATOS prováveis a alterar
- `src/components/ui/` ou equivalente.
- `tailwind.config.ts` (extend de tokens, se ainda não estiverem lá).

### O que fazer
1. Mapear `src/components/ui/` atual. Listar o que já existe.
2. Para cada primitive alvo:
   - Se existe similar → adaptar (merge de classes, adicionar props).
   - Se não existe → criar novo arquivo.
3. Garantir TypeScript estrito (interfaces, nenhum `any`).
4. Garantir que cores usam tokens Tailwind, não hex inline.
5. Adicionar `prefers-reduced-motion` onde houver animação.

### O que NÃO fazer
- Não criar KratosCard se `Card` já existe com glassmorphism. Adaptar.
- Não instalar Framer Motion se não estiver no package.json.
- Não alterar backend.
- Não criar rotas.
- Não alterar useLiveKratos.

### Validação
```bash
npm run build
# 0 erros
```

Render manual ou Storybook mostrando:
- EmptyState com ícone e ação.
- ErrorState com retry.
- ProgressRing com valor 78%.
- MetricBadge com delta positivo/negativo.

### Prompt curto para Claude Code
```txt
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

Microfase: FRONT-KIMI-01 — UI Primitives Seguras.

Contexto: Estamos no KRATOS Mission Control. Stack React+Vite+TS+Tailwind. Backend intacto.

Escopo permitido:
- Criar/adaptar em src/components/ui/: EmptyState, ErrorState, ProgressRing, MetricBadge.
- Atualizar tailwind.config.ts com tokens de docs/kimi/KIMI_CODE_RAW_PART_01_TOKENS.md se necessário.
- Garantir prefers-reduced-motion.

Escopo proibido:
- Não alterar backend, SSE, useLiveKratos, rotas, hooks de dados.
- Não instalar pacotes novos.
- Não usar any.

Tarefas:
1. Liste os componentes UI existentes no repo.
2. Compare com os primitives Kimi (PART_02).
3. Implemente/adapte os 4 componentes.
4. Valide build.

Relatório final: quais foram criados, quais adaptados, e se houve débito técnico.
```
===== END FILE =====

===== FILE: docs/kimi/KIMI_DO_NOT_USE.md =====
# Lista Proibida — Não Use Direto

| Item | Motivo | Risco | Alternativa Segura |
|---|---|---|---|
| Código com `any` | Quebra type safety do projeto | Alto — débito técnico imediato | Usar `unknown` + narrowing, ou tipar corretamente |
| `class-variance-authority` se projeto não usa | Adiciona dependência sem necessidade | Médio — bundle e complexidade | `cn()` do `tailwind-merge` + `clsx` já existente |
| Framer Motion se não está instalado | Instalação não autorizada sem justificar | Alto — quebra regras absolutas | CSS transitions/keyframes nativos |
| Layouts inteiros que duplicam shell atual | Cria KratosAppShell paralelo | Alto — conflito de z-index, duplicação de estado | Adaptar shell existente: TopBar, Sidebar, RightRail, BottomDock |
| KratosWorldMap completo se já existir | Perde o mapa atual e seus dados | Alto — regressão | Adaptar ilha por ilha, não recriar mundo |
| Backend novo | Proibido por regra absoluta | Bloqueante | Usar FastAPI existente, SQLite local, SSE existente |
| Endpoints novos | Proibido por regra absoluta | Bloqueante | Usar `/live/stream`, `/live/snapshot`, `/mission/lens` |
| Three.js / R3F / WebGL | Proibido na V1 | Alto — performance, bundle, complexidade | CSS 3D transforms + SVG |
| Zustand novo | Só se state estiver quebrado | Médio — adiciona store desnecessário | Context API existente ou props |
| Rotas novas sem mapa | Roteamento desconectado | Médio — 404s | Adicionar rota ao router existente com lazy load |
| Qualquer coisa que altere `useLiveKratos` | Quebra telemetria real | Bloqueante | Hook é intocável |
| Qualquer coisa que quebre `SourceBadge` | Perde rastreabilidade de dados | Alto | Manter SourceBadge como está |
| Qualquer coisa que esconda mock como real | Engana o usuário | Alto — anti-padrão ético | Label clara de "Dados simulados" ou "Offline" |
| `styled-components` / CSS Modules | Stack é Tailwind puro | Médio — inconsistência | Tailwind + CSS variables |
| Imagens como assets finais de UI | Não escalam, não animam | Médio | SVG/CSS/SVG para ícones, WebP otimizado só para ilustrações de fundo |
| `express.json({ limit: '50mb' })` | Backend não é Node/Express | N/A | Não tocar backend |
| Grid 2x2 simétrico de dashboard | Mata a identidade KRATOS | Alto | Layout orgânico de ilhas, HUD fixo |
| Cards cinza corporativos | SaaS genérico | Alto | GlassPanel com tokens Kimi |
| Sombra padrão `shadow-lg` | Não tem profundidade KRATOS | Baixo | `shadow-kratos-glass` ou `shadow-kratos-island` |
| Azul `#3B82F6` puro | Cyberpunk/corporativo | Médio | `kratos-ocean`, `kratos-sky`, ou tema da ilha |
| Texto ilegível gerado por IA em imagem | Não é renderizável | Alto | HTML overlay 100% |
| Partículas complexas em JS | Derruba FPS | Alto | CSS animations ou SVG estático |
| Box-shadow animado em múltiplos elementos | Derruba GPU | Alto | Pseudo-elemento `::before` com `opacity` animada |
| `left/top` animados via JS | Causa reflow | Alto | `transform: translate()` apenas |
| Animações sem `will-change` | Performance ruim | Médio | Adicionar `will-change: transform` em elementos flutuantes |
| `bg-opacity` Tailwind antigo | Quebra glassmorphism | Baixo | `bg-slate-900/75` (sintaxe moderna) |
| Fontes novas sem justificar | Adiciona FOIT/FOUT | Médio | Usar fontes já carregadas (Inter/Poppins) |
| `git add .` | Commiteia lixo | Alto | Staging seletivo, revisar diff |
| Commit com build quebrando | Bloqueia pipeline | Bloqueante | `npm run build` antes de commit |
===== END FILE =====

===== FILE: docs/kimi/KIMI_ACCEPTANCE_CHECKLIST.md =====
# Checklist de Aceite Geral

## Técnico
- [ ] Build passa (`npm run build` 0 erros, 0 warnings críticos).
- [ ] Backend tests passam (`pytest -q` sem falhas).
- [ ] Sem endpoint novo criado.
- [ ] Sem backend alterado.
- [ ] Sem `useLiveKratos` alterado.
- [ ] Sem package novo instalado (exceto se microfase explicitamente autorizou e justificou).
- [ ] Sem `any` no TypeScript.
- [ ] Sem hex inline desnecessário (usar tokens Tailwind).
- [ ] Sem `console.log` de debug esquecido.
- [ ] Imports limpos, sem ciclos.

## Visual
- [ ] Parece KRATOS (mundo vivo, não SaaS).
- [ ] Não parece dashboard corporativo genérico.
- [ ] Não parece "bolha orbital" genérica.
- [ ] Mundo vivo: ilhas/castelo/oceano presentes ou caminho claro para eles.
- [ ] Aurora presente (painel direito, compacto, CTA visível).
- [ ] Missão atual clara ( banner castelo ou StatusBarDock).
- [ ] Próxima ação clara (dock ou rail).
- [ ] SourceBadge visível onde necessário.

## Neuro UX
- [ ] Baixa carga cognitiva (máximo 7 elementos visíveis por painel).
- [ ] Próxima ação encontrada em <= 10 segundos.
- [ ] Não cria dashboard de culpa (sem shaming por produtividade).
- [ ] `prefers-reduced-motion` respeitado.
- [ ] Sem excesso de cards empilhados.
- [ ] Estados vazio ilustrados (nunca tela em branco quebrada).
- [ ] Erro com retry ou caminho de saída.
- [ ] Texto legível (contraste mínimo 4.5:1).

## Git
- [ ] Sem `git add .` usado sem revisão.
- [ ] Staging seletivo (`git add -p` ou arquivo por arquivo).
- [ ] Commit message clara (`feat(ui): ...` ou `fix(hud): ...`).
- [ ] Não commiteia arquivos de IDE (`.vscode/`, `.claude/` se não forem intencionais).
- [ ] Relatório final gerado no chat antes de commitar.

## Veredito Final
| Pergunta | Sim | Não |
|---|---|---|
| A interface devolve o fio da missão? | | |
| Em 10s eu sei o que fazer? | | |
| O visual é premium e adulto? | | |
| Nada parece genérico? | | |
| O backend está intacto? | | |
| O build passa? | | |

**Se qualquer resposta for "Não", a microfase não está aceita.**
===== END FILE =====

===== FILE: docs/kimi/KIMI_CLAUDE_CODE_CONSUMPTION_PROTOCOL.md =====
# Protocolo de Consumo do Pacote Kimi

## Fluxo Obrigatório

```txt
1. LER KIMI_NEXT_MICROPHASE.md
   → Identificar qual microfase está autorizada.

2. LER microfase correspondente em KIMI_EXECUTION_ROADMAP.md
   → Entender objetivo, arquivos prováveis, critério de aceite.

3. LER partes relevantes de KIMI_CODE_RAW_PART_XX.md
   → Tokens (01), Primitives (02), World (03), HUD (04), Ilhas (05), QA (06).

4. LER KIMI_COMPONENT_MAP.md
   → Decidir: USAR / ADAPTAR / ADIAR / DESCARTAR para cada componente.

5. MAPEAR frontend real do KRATOS
   → Listar arquivos existentes que serão tocados.

6. IMPLEMENTAR só escopo autorizado
   → Nada além da microfase. Não adiantar ilhas se está em primitives.

7. RODAR build/testes
   → npm run build (0 erros).

8. ATUALIZAR KIMI_ADOPTION_LOG.md
   → Registrar o que foi usado, adaptado, descartado.

9. GERAR relatório final
   → No chat, antes de commitar.
```

## Proibições Absolutas
- **NUNCA copiar código Kimi diretamente sem adaptar** aos imports, tokens e estrutura do repo.
- **NUNCA criar componente duplicado** se similar já existe. Adaptar o existente.
- **NUNCA mexer no backend** (FastAPI, SQLite, SSE endpoints, auth).
- **NUNCA instalar dependência** sem justificar e sem autorização explícita.
- **NUNCA alterar contratos vivos**: `useLiveKratos`, `/live/stream`, `/live/snapshot`, `/mission/lens`.
- **NUNCA usar `any`**.
- **NUNCA deixar build quebrando**.

## Microfases e Kimi Parts

| Microfase | Partes Kimi a ler |
|---|---|
| FRONT-KIMI-01 | PART_01 (tokens), PART_02 (primitives), COMPONENT_MAP |
| FRONT-KIMI-02 | PART_01 (tokens), COMPONENT_MAP |
| FRONT-KIMI-03 | PART_01, PART_03 (world), COMPONENT_MAP |
| FRONT-KIMI-04 | PART_01, PART_04 (hud), COMPONENT_MAP |
| FRONT-KIMI-05 | PART_01, PART_04 (aurora), COMPONENT_MAP |
| FRONT-KIMI-06 | PART_01, PART_04 (dock), COMPONENT_MAP |
| FRONT-KIMI-07 | PART_01, PART_05 (omnis), PART_04 (dock slots), COMPONENT_MAP |
| FRONT-KIMI-08 | PART_01, PART_05 (akasha), PART_04 (rail), COMPONENT_MAP |
| FRONT-KIMI-09 | PART_01, PART_05 (agencia), PART_04, COMPONENT_MAP |
| FRONT-KIMI-10..14 | PART_01, PART_05 (template correspondente), COMPONENT_MAP |
| FRONT-KIMI-15 | PART_06 (qa), COMPONENT_MAP, ADOPTION_LOG |

## Dicas de Execução
- Se um componente Kimi parece "quase igual" a um existente, prefira **ADAPTAR** existente em vez de criar novo.
- Se o componente Kimi exige `framer-motion` e o projeto não tem, use **CSS transitions** como fallback.
- Se o token Kimi conflita com token existente (ex: `glass` já definido com valor diferente), **manter o valor mais próximo do mockup** e registrar no ADOPTION_LOG.
- Sempre que possível, extrair variantes de animação para `src/motion/variants.ts` em vez de inline gigante.

## Relatório Final Obrigatório
Após cada microfase, responder no chat:
```
MICROFASE [XX] FECHADA.

Arquivos alterados:
- caminho/arquivo.tsx (ação: criado/adaptado)
- caminho/arquivo2.css (ação: token ajustado)

Decisões Kimi:
- GlassPanel: ADAPTADO (já existia)
- ProgressRing: USADO (novo)

Build: PASSOU / FALHOU
Testes backend: PASSOU / N/A

Veredito brutal: [PASSOU / AJUSTE LEVE NECESSÁRIO / BLOQUEANTE]
Próxima recomendada: FRONT-KIMI-XX por [motivo]
```
===== END FILE =====

===== FILE: docs/kimi/KIMI_MICROPHASE_PROMPTS.md =====
# Prompts Prontos para Microfases

## Como usar
Copie o prompt da microfase desejada e cole no chat do Claude Code. Não altere a autorização.

---

## FRONT-KIMI-01 — UI Primitives Seguras

```txt
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

Microfase: FRONT-KIMI-01 — UI Primitives Seguras.

Contexto: KRATOS Mission Control. Stack React + Vite + TypeScript + Tailwind CSS. Backend FastAPI existente, intocável.

Arquivos Kimi a consultar:
- docs/kimi/KIMI_CODE_RAW_PART_01_TOKENS.md
- docs/kimi/KIMI_CODE_RAW_PART_02_UI_PRIMITIVES.md
- docs/kimi/KIMI_COMPONENT_MAP.md

Escopo PERMITIDO:
- Criar/adaptar em src/components/ui/ (ou equivalente): EmptyState, ErrorState, ProgressRing, MetricBadge.
- Atualizar tailwind.config.ts se tokens de glass/sombras ainda não existirem.
- Adicionar prefers-reduced-motion onde houver animação.

Escopo PROIBIDO:
- Não alterar backend, SSE, useLiveKratos, rotas, hooks de dados.
- Não instalar pacotes novos.
- Não usar any.
- Não criar ilhas, HUD, mapa, rotas.

Tarefas:
1. Liste componentes UI existentes no repo.
2. Compare com primitives Kimi (PART_02).
3. Para cada um (EmptyState, ErrorState, ProgressRing, MetricBadge):
   - Se existe similar → adaptar.
   - Se não existe → criar.
4. Garantir TypeScript estrito.
5. Garantir tokens Tailwind, não hex inline.
6. Rodar npm run build.

Validações:
- Render manual ou Storybook mostrando os 4 estados.
- Build 0 erros.

Relatório final obrigatório:
- Arquivos criados/adaptados.
- Decisões de ADAPTAR vs USAR.
- Build passou?
- Próxima microfase recomendada e por quê.

Veredito brutal obrigatório ao final.
```

---

## FRONT-KIMI-02 — Tokens + Glass Consistency

```txt
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

Microfase: FRONT-KIMI-02 — Tokens + Glass Consistency.

Contexto: KRATOS Mission Control. Tailwind config precisa refletir tokens visuais do mundo.

Arquivos Kimi a consultar:
- docs/kimi/KIMI_CODE_RAW_PART_01_TOKENS.md
- docs/kimi/KIMI_COMPONENT_MAP.md

Escopo PERMITIDO:
- Atualizar tailwind.config.ts (extend colors, boxShadow, backdropBlur, borderRadius, keyframes, animation).
- Atualizar CSS global se necessário (reduced motion).
- Refatorar componentes existentes que usam glass hardcoded para usar os novos tokens.

Escopo PROIBIDO:
- Não criar novos componentes.
- Não alterar backend.
- Não instalar pacotes.

Tarefas:
1. Verifique tailwind.config.ts atual.
2. Compare com tokens Kimi (seção Paleta, Elevação, Motion).
3. Adicione tokens faltantes.
4. Busque no codebase por valores hardcoded de glass (ex: rgba(15,23,42,0.6)) e substitua por tokens.
5. Garantir que prefers-reduced-motion está no CSS.

Validações:
- Build passa.
- GlassPanel existente não quebra.
- Nenhuma regressão visual grave.

Relatório final obrigatório com veredito brutal.
```

---

## FRONT-KIMI-03 — World Map Polish

```txt
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

Microfase: FRONT-KIMI-03 — World Map Polish.

Contexto: Mapa de ilhas flutuantes pseudo-3D. Provavelmente já existe componente base.

Arquivos Kimi a consultar:
- docs/kimi/KIMI_CODE_RAW_PART_01_TOKENS.md
- docs/kimi/KIMI_CODE_RAW_PART_03_WORLD_MAP.md
- docs/kimi/KIMI_COMPONENT_MAP.md

Escopo PERMITIDO:
- Adaptar KratosWorldMap existente (posições %, z-index, camadas).
- Adicionar/adaptar: OceanBackdrop, CloudLayer, BridgeSystem, CentralCastleMission, IslandLabel.
- Ajustar FloatingIsland (perspective, rotateX, glow, sombra).
- Adicionar GhostIslands decorativas se não existirem.

Escopo PROIBIDO:
- Não recriar o mapa do zero se já existir.
- Não alterar roteamento.
- Não alterar backend.
- Não criar ilhas internas ainda.

Tarefas:
1. Liste componentes em src/components/world/ (ou equivalente).
2. Compare com PART_03.
3. Ajuste tokens de cor e sombra nas ilhas.
4. Posicione ilhas conforme tabela de coordenadas.
5. Adicione castelo central com banner de missão (HTML overlay).
6. Adicione pontes SVG entre castelo e ilhas (decorativas).
7. Ajuste nuvens (máximo 5, CSS drift).

Validações:
- Screenshot comparado com mockup Master World.
- Ilhas clicáveis.
- Castelo com missão visível.
- 60fps (Performance tab, sem jank).

Relatório final obrigatório com veredito brutal.
```

---

## FRONT-KIMI-04 — HUD Assembly Polish

```txt
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

Microfase: FRONT-KIMI-04 — HUD Assembly Polish.

Contexto: Shell visual já existe (TopBar, Sidebar, RightRail, BottomDock). Precisa de polimento para tokens e consistência.

Arquivos Kimi a consultar:
- docs/kimi/KIMI_CODE_RAW_PART_01_TOKENS.md
- docs/kimi/KIMI_CODE_RAW_PART_04_HUD_AURORA_DOCK.md
- docs/kimi/KIMI_COMPONENT_MAP.md

Escopo PERMITIDO:
- Adaptar TopBar: tokens de cor, tipografia, glass.
- Adaptar Sidebar: highlight temático por item ativo, scroll.
- Adaptar RightRail: tornar container de slots (aceitar children), scroll interno.
- Garantir que HUD não cobre elementos interativos do mapa (padding/margins corretos).

Escopo PROIBIDO:
- Não recriar shell do zero.
- Não alterar backend.
- Não criar ilhas.

Tarefas:
1. Mapear HUD existente.
2. Aplicar tokens de glass e cor.
3. Sidebar: adicionar borda/esquerda colorida no item ativo.
4. RightRail: refatorar para receber children dinâmicos.
5. Garantir z-index correto (HUD acima de ilhas).

Validações:
- Navegação entre rotas mantém HUD intacto.
- Glass legível sobre oceano.
- Sem sobreposição de elementos.

Relatório final obrigatório com veredito brutal.
```

---

## FRONT-KIMI-05 — Aurora Panel Polish

```txt
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

Microfase: FRONT-KIMI-05 — Aurora Panel Polish.

Contexto: Painel da Aurora no RightRail. Deve ser compacto, contextual, CTA claro.

Arquivos Kimi a consultar:
- docs/kimi/KIMI_CODE_RAW_PART_04_HUD_AURORA_DOCK.md
- docs/kimi/KIMI_COMPONENT_MAP.md

Escopo PERMITIDO:
- Adaptar AuroraPanel existente.
- Limitar altura a ~180px.
- Avatar + status online + frase contextual + CTA.
- Garantir que não polui com histórico de chat longo.

Escopo PROIBIDO:
- Não implementar chat real/funcional se não existir (apenas CTA visual).
- Não alterar backend.
- Não criar endpoints de chat.

Tarefas:
1. Avaliar AuroraPanel atual.
2. Reduzir/ajustar para design compacto.
3. Adicionar StatusChip online.
4. Garantir CTA "Falar com Aurora" visível.

Validações:
- Aurora visível em 10s após load.
- Painel não excede 200px de altura.
- Sem regressão no RightRail.

Relatório final obrigatório com veredito brutal.
```

---

## FRONT-KIMI-06 — BottomDock / MissionBar / StatusBarDock Polish

```txt
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

Microfase: FRONT-KIMI-06 — BottomDock / MissionBar / StatusBarDock Polish.

Contexto: Dock inferior precisa de arquitetura final. StatusBarDock como padrão global.

Arquivos Kimi a consultar:
- docs/kimi/KIMI_CODE_RAW_PART_04_HUD_AURORA_DOCK.md
- docs/kimi/KIMI_COMPONENT_MAP.md

Escopo PERMITIDO:
- Implementar BottomDock como container de slots (left, center[], right).
- Implementar StatusBarDock: Missão + Foco + Próxima Ação + Squad + Player.
- Garantir que dock não cobre conteúdo essencial (padding-bottom no main content).
- WorldNavDock apenas no Mapa ou menu.

Escopo PROIBIDO:
- Não fixar WorldNavDock em todas as telas (só desktop > 1080px se necessário).
- Não alterar backend.

Tarefas:
1. Decidir arquitetura: StatusBarDock fixo global? Sim.
2. Implementar/adaptar BottomDock com slots.
3. Implementar StatusBarDock com dados mock por enquanto.
4. Garantir que Foco do Dia e Próxima Ação estão sempre visíveis.

Validações:
- Dock renderiza sem quebrar layout.
- Foco do Dia encontrado em < 10s.
- Build passa.

Relatório final obrigatório com veredito brutal.
```

---

## FRONT-KIMI-07 — Internal Island: OMNIS Lab

```txt
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

Microfase: FRONT-KIMI-07 — Internal Island: OMNIS Lab.

Contexto: Primeira ilha interna. Serve de padrão para as outras.

Arquivos Kimi a consultar:
- docs/kimi/KIMI_CODE_RAW_PART_01_TOKENS.md
- docs/kimi/KIMI_CODE_RAW_PART_05_INTERNAL_ISLANDS.md (template Tech)
- docs/kimi/KIMI_CODE_RAW_PART_04_HUD_AURORA_DOCK.md (dock slots)

Escopo PERMITIDO:
- Criar rota /ilha/omnis (lazy loaded).
- Criar componentes em src/components/islands/omnis/: HolographicCore, AgentList, IntegrationGrid, SystemHealth, EconomyCounter.
- Usar Rail slots: ResumoDoLab, AgentList, AutomationList, WorkflowList.
- Dock profile: left=AudioPlayer, center=[EconomyCounter, SystemHealth], right=IntegrationGrid.

Escopo PROIBIDO:
- Não alterar backend.
- Dados podem ser mock/props por enquanto.

Tarefas:
1. Criar wrapper OmnisIsland.
2. Implementar HolographicCore (CSS 3D + SVG, sem Three.js).
3. Implementar AgentList com status.
4. Implementar SystemHealth (ProgressRing 98% + checklist).
5. Configurar BottomDock para perfil omnis.

Validações:
- Transição mapa->OMNIS com AnimatePresence.
- Core animado em 60fps.
- Agentes visíveis.

Relatório final obrigatório com veredito brutal.
```

---

## FRONT-KIMI-08 a 14 — Ilhas Internas (Blueprint Operacional)

Para cada ilha (Akasha, Agência, Arena, Forja, Observatório, Vila, Tesouro):

```txt
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

Microfase: FRONT-KIMI-XX — Internal Island: [NOME].

Contexto: Criar interior de ilha seguindo template Kimi.

Arquivos Kimi a consultar:
- docs/kimi/KIMI_CODE_RAW_PART_05_INTERNAL_ISLANDS.md (template correspondente)
- docs/kimi/KIMI_CODE_RAW_PART_04_HUD_AURORA_DOCK.md
- docs/kimi/KIMI_COMPONENT_MAP.md

Escopo PERMITIDO:
- Criar rota /ilha/[nome] lazy loaded.
- Criar componentes no template correspondente (Tech, Vault, Criativa, Mística, Vida).
- Configurar RightRail slots para esta ilha.
- Configurar BottomDock slots se diferente do padrão.

Escopo PROIBIDO:
- Não alterar backend.
- Não recriar primitives ou HUD.

Tarefas:
1. Criar wrapper da ilha.
2. Implementar 3-4 widgets principais do template.
3. Conectar ao Rail e Dock.
4. Lazy load.

Validações:
- Ilha carrega sem erro.
- Widgets visíveis.
- Navegação volta ao mapa sem quebrar.

Relatório final obrigatório com veredito brutal.
```

---

## FRONT-KIMI-15 — Visual QA + Screenshot Review

```txt
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

Microfase: FRONT-KIMI-15 — Visual QA + Screenshot Review.

Contexto: Revisão final de todas as microfases anteriores.

Arquivos Kimi a consultar:
- docs/kimi/KIMI_CODE_RAW_PART_06_QA_PROMPTS.md
- docs/kimi/KIMI_ACCEPTANCE_CHECKLIST.md
- docs/kimi/KIMI_ADOPTION_LOG.md

Escopo PERMITIDO:
- Rodar checklists visuais, neuro UX, técnico, git.
- Gerar relatório de divergência.
- Ajustes leves finais (cor, padding, sombra).

Escopo PROIBIDO:
- Não criar novos componentes.
- Não alterar arquitetura.
- Não alterar backend.

Tarefas:
1. Rodar npm run build.
2. Rodar pytest -q (backend).
3. Preencher KIMI_ACCEPTANCE_CHECKLIST.md.
4. Preencher KIMI_ADOPTION_LOG.md com fechamento.
5. Gerar relatório de veredito brutal.

Validações:
- 90% OK ou AJUSTE LEVE.
- Zero BLOQUEANTE.
- Build passa.

Relatório final obrigatório com veredito brutal e recomendação de próxima fase (pós-Kimi).
```

---

## Observação
Os prompts de 08 a 14 seguem o mesmo blueprint. Ajustar apenas:
- `[XX]` → número da microfase.
- `[NOME]` → nome da ilha.
- Template → Tech / Vault / Criativa / Mística / Vida conforme PART_05.
===== END FILE =====

## VEREDITO FINAL OBRIGATÓRIO

1. **O pacote docs/kimi ficou pronto?**  
   SIM. 16 arquivos entregues, indexados e prontos para salvamento local.

2. **O Claude Code consegue consultar isso como fonte canônica local?**  
   SIM. Basta salvar os arquivos em `docs/kimi/` e instruir o Claude Code a ler por microfase conforme `KIMI_CLAUDE_CODE_CONSUMPTION_PROTOCOL.md`.

3. **Qual arquivo Lucas deve salvar primeiro?**  
   `docs/kimi/README.md` — depois `KIMI_NEXT_MICROPHASE.md` e `KIMI_CLAUDE_CODE_CONSUMPTION_PROTOCOL.md`.

4. **Qual é a próxima microfase recomendada?**  
   **FRONT-KIMI-01 — UI Primitives Seguras** (EmptyState, ErrorState, ProgressRing, MetricBadge). Baixo risco, alto impacto construtivo.

5. **O que NÃO deve ser implementado ainda?**  
   - Ilhas internas (07-14) — esperar primitives e HUD estarem sólidos.  
   - Three.js / WebGL / R3F — proibido na V1.  
   - Backend novo, endpoints, auth, Supabase.  
   - WorldNavDock fixo global — apenas no Mapa.

6. **Qual é o risco principal se colar código direto?**  
   **Duplicação de componentes existentes + quebra de contratos vivos (useLiveKratos, SSE) + regressão visual por tokens conflitantes.** O código Kimi é referência, não autoridade final.

7. **Qual é a regra de ouro para usar seus códigos?**  
   **ADAPTAR > USAR > ADIAR > DESCARTAR.** Nunca copiar direto. Sempre consultar `KIMI_COMPONENT_MAP.md` antes de criar arquivo novo. Uma microfase por vez. Build passando antes de commit.