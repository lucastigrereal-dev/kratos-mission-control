# ╔══════════════════════════════════════════════════════════════════╗
# ║   KRATOS / OMNIS / AKASHA — CLAUDE CODE SKILLS PACK v1.0       ║
# ║   Gerado por Perplexity + Kimi Visual Spec Fase 3               ║
# ║   Stack: React + Vite + TypeScript + Tailwind + Framer Motion   ║
# ╚══════════════════════════════════════════════════════════════════╝

---

## ÍNDICE

1. [kimi-to-code] — Tradutor de Spec Visual Kimi → Tarefas Técnicas
2. [glass-panel-builder] — Implementador do GlassPanel e Primitives
3. [island-composer] — Montador das Ilhas Pseudo-3D
4. [hud-assembler] — Montador do HUD (TopBar + Sidebar + RightRail + Dock)
5. [token-enforcer] — Guardião dos Design Tokens
6. [omnis-lab-builder] — Construtor da Ilha OMNIS Lab
7. [akasha-vault-builder] — Construtor da Ilha Akasha/Gringotts
8. [omnis-agent-contracts] — Contratos de Agentes OMNIS
9. [akasha-memory-contracts] — Contratos de Memória AKASHA
10. [visual-qa-kimi] — QA Visual comparando implementação vs spec Kimi
11. [motion-guardian] — Guardião das animações e prefers-reduced-motion
12. [neuro-ux-checker] — Revisor de UX para TDAH

---

# ════════════════════════════════════════════════
# SKILL 1 — kimi-to-code
# Tradutor de Spec Visual Kimi → Tarefas Técnicas
# ════════════════════════════════════════════════

## Nome: kimi-to-code
## Quando chamar:
Sempre que o Kimi entregar um spec visual, mockup descrito em texto,
ou imagem de referência. Esta skill converte isso em tarefas atômicas
implementáveis pelo Claude Code.

## Missão:
Receber spec do Kimi → Decompor em componentes → Mapear tokens → Criar checklist técnico.
NÃO inventar identidade visual nova.
NÃO sugerir cores fora dos tokens.
Marcar tudo que estiver ambíguo como [REQUER CONFIRMAÇÃO DO KIMI].

## Prompt Interno:
```
Você é o tradutor oficial do Kimi → Claude Code no projeto KRATOS.

Receba o spec visual abaixo e produza:

1. LISTA DE COMPONENTES NOVOS
   - Nome do componente (PascalCase)
   - Caminho: src/components/[categoria]/[Nome].tsx
   - Props TypeScript completas (sem "any")
   - Tailwind classes base
   - Token KRATOS usado (ex: bg-kratos-omnis, shadow-glow-omnis)
   - Estado: vazio, carregando, erro, ativo

2. LISTA DE TOKENS NECESSÁRIOS
   - Se o token já existe em tailwind.config.ts: [EXISTENTE]
   - Se precisa criar: [NOVO — REQUER APROVAÇÃO]
   - Nunca adicionar token sem aprovação explícita

3. CHECKLIST DE COMPARAÇÃO
   Formato: [ ] Implementado | [ ] Divergência | [ ] Pendente

4. ARQUIVOS TOCADOS (lista exata de paths)

5. ARQUIVOS PROTEGIDOS (lista de arquivos que NÃO podem ser tocados)
   Inclui SEMPRE:
   - src/hooks/useLiveKratos.ts
   - src/services/liveStream.ts  
   - src/services/snapshot.ts
   - backend/ (qualquer coisa)

Regra: Se o spec for ambíguo, marque com [REQUER CONFIRMAÇÃO DO KIMI].
Nunca invente. Nunca assuma.
```

## Exemplo de uso no terminal:
```
> Kimi gerou spec do HolographicCore com 3 anéis SVG e cubo 3D.
  kimi-to-code: processe e crie checklist.
```

## Output esperado:
```
COMPONENTE: HolographicCore
PATH: src/components/islands/omnis/HolographicCore.tsx
TOKENS: omnis.DEFAULT, omnis.glow, omnis.neon
ARQUIVOS TOCADOS: src/components/islands/omnis/HolographicCore.tsx
ARQUIVOS PROTEGIDOS: nenhum nesta tarefa
CHECKLIST:
[ ] SVG anel externo (spin 10s linear)
[ ] SVG anel interno (spin 7s reverse)
[ ] Cubo CSS 3D (rotateY + rotateX)
[ ] Glow violeta/ciano
[ ] prefers-reduced-motion: parar animação
[ ] Acessibilidade: aria-hidden nos SVGs decorativos
```

---

# ════════════════════════════════════════════════
# SKILL 2 — glass-panel-builder
# Implementador de UI Primitives KRATOS
# ════════════════════════════════════════════════

## Nome: glass-panel-builder
## Quando chamar:
Para implementar ou corrigir qualquer UI Primitive do sistema.
GlassPanel, KratosCard, StatusChip, SectionTitle, LoadingSkeleton,
EmptyState, ErrorState, ProgressRing, MetricBadge, IslandMiniCard.

## Regras Absolutas:
- Usar SEMPRE os tokens KRATOS do tailwind.config.ts
- Nunca colocar cor inline (style={{ color: '#fff' }})
- Nunca criar nova sombra fora do sistema (kratos-glass, kratos-glass-hover, kratos-hud)
- TypeScript estrito: nenhum "any" nem "as any"
- Framer Motion apenas para animações já descritas no spec (float, pulse-glow)
- prefers-reduced-motion: SEMPRE respeitado

## Código de Referência Canônico (NÃO ALTERAR CONTRATOS):

### GlassPanel
```tsx
// src/components/ui/GlassPanel.tsx
// CONTRATO SAGRADO — não alterar props sem aprovação

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ as: Comp = "div", padding = "md", interactive, className, ...p }, ref) => (
    <Comp
      ref={ref}
      className={cn(
        "relative rounded-glass border border-kratos-hud-border",
        "bg-kratos-hud-glass backdrop-blur-glass shadow-kratos-glass",
        padding === "sm" && "p-3",
        padding === "md" && "p-4",
        padding === "lg" && "p-6",
        interactive &&
          "cursor-pointer transition-all hover:border-white/20 hover:shadow-kratos-glass-hover",
        className
      )}
      {...p}
    />
  )
);
GlassPanel.displayName = "GlassPanel";
```

### StatusChip
```tsx
// src/components/ui/StatusChip.tsx
const STATUS_STYLES = {
  online:    "bg-emerald-400 text-emerald-300",
  offline:   "bg-slate-500  text-slate-400",
  executing: "bg-cyan-400   text-cyan-300 animate-pulse",
  warning:   "bg-amber-400  text-amber-300",
  error:     "bg-rose-500   text-rose-300",
  stale:     "bg-slate-600  text-slate-400",
} as const;

interface StatusChipProps {
  status: keyof typeof STATUS_STYLES;
  label?: string;
  pulse?: boolean;
  size?: "sm" | "md";
}

export function StatusChip({ status, label, pulse, size = "md" }: StatusChipProps) {
  return (
    <span role="status" className="flex items-center gap-1.5">
      <span
        className={cn(
          "rounded-full",
          size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2",
          STATUS_STYLES[status],
          pulse && "animate-pulse"
        )}
      />
      {label && (
        <span className="text-xs font-medium uppercase tracking-wide opacity-80">
          {label}
        </span>
      )}
    </span>
  );
}
```

### ProgressRing (canônico)
```tsx
// src/components/ui/ProgressRing.tsx
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
  animate?: boolean;
}

export function ProgressRing({
  value, size = 120, strokeWidth = 10,
  color = "stroke-amber-400", trackColor = "stroke-white/10",
  label, sublabel, animate = true,
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const [o, setO] = useState(c);

  useEffect(() => {
    const t = setTimeout(() => setO(c - (value / 100) * c), 50);
    return () => clearTimeout(t);
  }, [value, c]);

  return (
    <div className="relative flex flex-col items-center justify-center"
         style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size/2} cy={size/2} r={r} fill="none"
                strokeWidth={strokeWidth} className={trackColor} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
                strokeWidth={strokeWidth} strokeLinecap="round"
                className={cn(color, "transition-all duration-1000 ease-out")}
                style={{ strokeDasharray: c, strokeDashoffset: o }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{label ?? `${value}%`}</span>
        {sublabel && (
          <span className="text-[10px] uppercase tracking-wider text-white/50">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
```

## Checklist de Aceite para Primitives:
- [ ] Token KRATOS usado (não hardcode)
- [ ] TypeScript sem "any"
- [ ] prefers-reduced-motion respeitado
- [ ] Estado vazio existe (EmptyState)
- [ ] Estado de erro existe (ErrorState)
- [ ] Estado de carregamento existe (LoadingSkeleton)
- [ ] aria-label/role em elementos interativos
- [ ] Nenhum arquivo de backend tocado

---

# ════════════════════════════════════════════════
# SKILL 3 — island-composer
# Montador das Ilhas Pseudo-3D
# ════════════════════════════════════════════════

## Nome: island-composer
## Quando chamar:
Para implementar ou ajustar FloatingIsland, CentralCastleMission,
OceanBackdrop, CloudLayer, BridgeSystem, IslandLabel, KratosWorldMap.

## Posicionamento Canônico das Ilhas (% do viewport 16:9):
```
OMNIS Lab:        left:10%  top:8%
Agência/Estúdio:  left:8%   top:38%
Vila Viva:        left:12%  top:62%
Arena Comercial:  left:22%  top:78%
Akasha:           left:75%  top:10%
Filosofia:        left:82%  top:38%
Finanças:         left:78%  top:65%
Forja/Corpo:      left:45%  top:72%
Observatório:     left:65%  top:82%
Nimbus:           left:48%  top:92%
Castelo Central:  left:50%  top:45%  [xl — z-50]
```

## Hierarquia de Camadas (z-index obrigatório):
```
z-0   OceanBackdrop
z-10  SkyLayer
z-15  GhostIslands
z-20  CloudLayer
z-30  BridgeSystem (SVGs)
z-40  FloatingIsland
z-50  CentralCastleMission
z-60  IslandLabel
z-70  MissionBanner
z-90  BottomDock
z-100 HUD (TopBar + Sidebar + RightRail)
```

## Regras Técnicas:
- Sem Three.js. Sem React Three Fiber.
- Perspectiva: CSS perspective:1000px + rotateX(12deg) na base da ilha
- Conteúdo interno da ilha: transform counter-rotation ou flat (legibilidade)
- Animações: apenas as do tailwind.config.ts (float-slow, float-medium, pulse-glow, cloud-drift)
- Mobile < 1024px: modo lista com IslandMiniCard OU scroll horizontal min-w-[1280px]
- Reduced motion: desativar float-slow, cloud-drift, pulse-glow. Manter fade.

## Código FloatingIsland Canônico:
```tsx
// src/components/world/FloatingIsland.tsx
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface IslandPosition { left: string; top: string; }
interface FloatingIslandProps {
  id: string;
  label: string;
  tagline: string;
  position: IslandPosition;
  theme: string; // "omnis" | "agencia" | "akasha" | etc
  onClick?: () => void;
  children?: React.ReactNode;
}

export function FloatingIsland({
  id, label, tagline, position, theme, onClick, children
}: FloatingIslandProps) {
  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{ left: position.left, top: position.top, transform: "translate(-50%,-50%)" }}
      whileHover={{ scale: 1.05, zIndex: 60 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onClick={onClick}
      role="button"
      aria-label={`Navegar para ${label}`}
      tabIndex={0}
    >
      {/* Glow temático — aria-hidden pois é decorativo */}
      <div
        className={`absolute -inset-8 rounded-full blur-3xl animate-pulse-glow`}
        style={{ background: `var(--tw-shadow-color)`, opacity: 0.25 }}
        aria-hidden
      />
      <div style={{ perspective: "1000px" }}>
        <div
          className="relative flex items-end justify-center rounded-[32px] bg-kratos-island-grass shadow-kratos-island"
          style={{ transform: "rotateX(12deg)", width: "160px", height: "120px" }}
        >
          <div className="absolute inset-0 rounded-[32px] border-[6px] border-kratos-island-earth/40" />
          {children}
        </div>
        {/* Sombra base da ilha */}
        <div
          className="absolute top-full left-4 right-4 h-6 rounded-b-2xl bg-kratos-island-earth"
          style={{ transform: "rotateX(-75deg) translateY(-12px)", transformOrigin: "top" }}
          aria-hidden
        />
      </div>
      <GlassPanel className="mt-3 px-3 py-1.5 text-center" padding="none">
        <p className="text-xs font-bold text-white">{label}</p>
        <p className="text-[10px] text-white/50">{tagline}</p>
      </GlassPanel>
    </motion.div>
  );
}
```

---

# ════════════════════════════════════════════════
# SKILL 4 — hud-assembler
# Montador do HUD Completo
# ════════════════════════════════════════════════

## Nome: hud-assembler
## Quando chamar:
TopBar, Sidebar, RightRail, BottomDock, StatusBarDock, WorldNavDock.

## Estrutura Arquitetural Canônica do Shell:
```tsx
// src/components/shell/KratosAppShell.tsx
// ESTE ARQUIVO É SAGRADO — alterações só com aprovação do Aurora

<div className="relative h-screen w-screen overflow-hidden">
  {/* Background */}
  <div className="fixed inset-0 z-0">{/* OceanBackdrop */}</div>

  {/* Conteúdo da rota (ilhas, páginas) */}
  <main className="relative z-10 h-full w-full">
    <Outlet />
  </main>

  {/* HUD Layer — pointer-events separados */}
  <div className="pointer-events-none fixed inset-0 z-[100]">
    <TopBar className="pointer-events-auto" />
    <Sidebar className="pointer-events-auto" />
    <RightRail className="pointer-events-auto">{/* slot injetado pela rota */}</RightRail>
  </div>

  {/* Dock */}
  <BottomDock className="pointer-events-auto fixed bottom-0 left-0 right-0 z-[90]" />
</div>
```

## RightRail — Container de Slots (NÃO É PÁGINA):
```tsx
// src/components/shell/RightRail.tsx
// Cada rota injeta {children}. RightRail não tem lógica de dados.
<div className="fixed right-0 top-0 z-[100] flex h-screen w-[340px] flex-col gap-4
                overflow-y-auto border-l border-white/5 bg-slate-900/40 p-4 pb-24
                backdrop-blur-xl scrollbar-thin scrollbar-thumb-white/10">
  <AuroraPanel />
  {children}
</div>
```

## BottomDock — Perfis por Rota:
```
PERFIL         | ESQUERDA              | CENTRO                    | DIREITA
default/Mapa   | AudioPlayer           | MissionStep               | SquadDock
agencia        | AudioPlayer (expand)  | —                         | SquadDock
omnis          | AudioPlayer           | EconomyCounter+SysHealth  | IntegrationGrid
akasha         | AudioPlayer compacto  | WorldNavDock              | StatusBarDock
```

## StatusBarDock (global, 56px altura):
```
[Avatar+MissãoAtual+Progress4px] | [Target+FocoDoDia] | [ChevronRight+PróximaAção] | [Squad avatares] | [Player]
bg-slate-900/80 border-t border-white/5 backdrop-blur-xl
```

---

# ════════════════════════════════════════════════
# SKILL 5 — token-enforcer
# Guardião dos Design Tokens KRATOS
# ════════════════════════════════════════════════

## Nome: token-enforcer
## Quando chamar:
Hook PostToolUse em qualquer edição de .tsx, .css, .ts de componente.
Também chamar manualmente antes de qualquer commit visual.

## O que verificar:

### PROIBIDO (bloquear commit se encontrado):
```
- style={{ color: '#' }}          → usar token ou classe Tailwind
- style={{ background: '#' }}     → usar bg-kratos-[ilha] ou bg-slate-
- style={{ boxShadow: '...' }}    → usar shadow-kratos-glass ou shadow-glow-[ilha]
- border: '1px solid #'           → usar border-kratos-hud-border ou border-white/[n]
- font-size: [número]px inline    → usar text-[scale] do Tailwind
- rgba(  sem variável             → usar bg-kratos-hud-glass ou opacity classes
```

### TOKENS CANÔNICOS (fonte: tailwind.config.ts Fase 3):
```typescript
// CORES POR ILHA:
kratos.omnis.DEFAULT     = "#7C3AED"  // roxo
kratos.omnis.glow        = "#8B5CF6"
kratos.omnis.neon        = "#06B6D4"
kratos.agencia.DEFAULT   = "#F97316"  // laranja
kratos.akasha.DEFAULT    = "#059669"  // esmeralda
kratos.akasha.gold       = "#F59E0B"
kratos.arena.DEFAULT     = "#DC2626"  // vermelho
kratos.vila.DEFAULT      = "#16A34A"  // verde
kratos.nimbus.DEFAULT    = "#0EA5E9"  // ciano
kratos.filosofia.DEFAULT = "#7C3AED"
kratos.financas.DEFAULT  = "#166534"
kratos.observatorio.DEFAULT = "#1E3A8A"
kratos.forja.DEFAULT     = "#475569"
// HUD:
kratos.hud.glass   = "rgba(15,23,42,0.75)"
kratos.hud.border  = "rgba(255,255,255,0.10)"
// ACCENT:
kratos.accent.energy   = "#FACC15"
kratos.accent.xp       = "#A855F7"
kratos.accent.online   = "#4ADE80"
kratos.accent.progress = "#06B6D4"

// SOMBRAS:
shadow-kratos-glass       (painéis glass)
shadow-kratos-glass-hover (hover em painéis interativos)
shadow-kratos-island      (base das ilhas)
shadow-kratos-hud         (elementos do HUD)
shadow-glow-omnis         (glow violeta OMNIS)
shadow-glow-agencia       (glow laranja Agência)
shadow-glow-akasha        (glow esmeralda Akasha)
shadow-glow-nimbus        (glow ciano Nimbus)

// RADIUS:
rounded-glass   = 16px  (painéis)
rounded-island  = 24px  (ilhas)
rounded-card    = 20px  (cards internos)
rounded-tech    = 8px   (UI técnica OMNIS)

// BLUR:
backdrop-blur-glass  = 16px
backdrop-blur-panel  = 24px

// ANIMAÇÕES:
animate-float-slow    (6s, ilhas flutuando)
animate-float-medium  (5s, elementos menores)
animate-cloud-drift   (120s, nuvens)
animate-pulse-glow    (4s, glows temáticos)
animate-spin-slow     (10s, anéis do HolographicCore)
```

### Script de Verificação (PowerShell):
```powershell
# .aurora/hooks/token-enforcer.ps1
$files = git diff --cached --name-only | Where-Object { $_ -match "\.(tsx|ts|css)$" }
$violations = @()

foreach ($file in $files) {
  $content = Get-Content $file -Raw

  # Detectar cores inline
  if ($content -match "style=\{[^}]*color:\s*['"]#") {
    $violations += "COR INLINE em $file — use token Tailwind"
  }
  if ($content -match "style=\{[^}]*background:\s*['"]#") {
    $violations += "BG INLINE em $file — use bg-kratos-[ilha]"
  }
  if ($content -match "style=\{[^}]*boxShadow:") {
    $violations += "SHADOW INLINE em $file — use shadow-kratos-[tipo]"
  }
}

if ($violations.Count -gt 0) {
  Write-Host "❌ TOKEN VIOLATIONS DETECTADAS:" -ForegroundColor Red
  $violations | ForEach-Object { Write-Host "  → $_" -ForegroundColor Yellow }
  exit 1
}

Write-Host "✅ Tokens OK" -ForegroundColor Green
exit 0
```

---

# ════════════════════════════════════════════════
# SKILL 6 — omnis-lab-builder
# Construtor da Ilha OMNIS Lab
# ════════════════════════════════════════════════

## Nome: omnis-lab-builder
## Quando chamar:
Para implementar ou modificar qualquer componente dentro da ilha OMNIS Lab.

## Componentes OMNIS (paths canônicos):
```
src/components/islands/omnis/
  HolographicCore.tsx      ← COMPONENTE PRINCIPAL DA ILHA
  AgentList.tsx
  AutomationList.tsx
  WorkflowStatusList.tsx
  IntegrationGrid.tsx
  SystemHealth.tsx
  EconomyCounter.tsx
  TechPanel.tsx
  OmnisIslandLayout.tsx    ← COMPOSIÇÃO FINAL
```

## RightRail Slots OMNIS:
- AuroraPanel (global)
- ResumoDoLab
- AgentList
- AutomationList
- WorkflowStatusList

## BottomDock OMNIS:
- Esquerda: AudioPlayer
- Centro: EconomyCounter + SystemHealth
- Direita: IntegrationGrid

## HolographicCore — Spec Técnico Completo:
```tsx
// TOKENS: omnis.DEFAULT (#7C3AED), omnis.glow (#8B5CF6), omnis.neon (#06B6D4)
// SOMBRAS: shadow-glow-omnis
// ANIMAÇÕES: animate-spin-slow (10s), reverse (7s), animate-pulse
// ACESSIBILIDADE: todos SVGs decorativos têm aria-hidden

// Estrutura:
// Container 224px circular
// ├── SVG anel externo (spin 10s linear) — gradiente violet→cyan
// ├── SVG anel interno (spin 7s reverse) — gradiente cyan→blue
// └── Cubo CSS 3D (rotateY+rotateX 20s) — 6 faces border cyan/10
//     Label "OMNIS Core" — bg-slate-900/90 border-violet-500/40
```

## AgentList — Spec:
```tsx
// Cada agente:
// Avatar 36px + ring violeta (ring-1 ring-kratos-omnis-glow)
// Dot status: online(emerald) / executing(cyan pulse) / idle(slate)
// Nome: text-xs font-bold text-white
// Função: text-[10px] text-white/50
// Dados: StatusChip (usar skill glass-panel-builder)
```

## IntegrationGrid — Spec:
```tsx
// Grid 4 colunas, célula 64px
// bg-slate-800/60 rounded-tech (8px)
// Logo integração (SVG ou ícone)
// Badge "Conectado": bg-emerald-500/20 text-emerald-400 text-[10px]
// Badge "Offline": bg-rose-500/20 text-rose-400
```

## TechPanel (variante do GlassPanel para OMNIS):
```tsx
// Extiende GlassPanel com:
// bg-slate-900/80 (mais escuro)
// border-violet-500/30
// rounded-tech (8px — não glass)
// Usa shadow-glow-omnis no hover
```

## Contrato de Dados OMNIS (read-only do backend):
```typescript
// Estes dados vêm do backend via useLiveKratos — NÃO alterar a fonte
interface OmnisStatus {
  agents: Agent[];          // leitura apenas
  automations: Automation[];
  workflows: Workflow[];
  integrations: Integration[];
  economy: { time: string; delta: string };
  health: { db: boolean; servers: boolean; apis: boolean; ai: boolean };
}
// NUNCA fazer POST direto do frontend OMNIS
// NUNCA criar novo endpoint para satisfazer visual
```

---

# ════════════════════════════════════════════════
# SKILL 7 — akasha-vault-builder
# Construtor da Ilha Akasha / Gringotts
# ════════════════════════════════════════════════

## Nome: akasha-vault-builder
## Quando chamar:
Para implementar ou modificar qualquer componente da ilha Akasha.

## Componentes AKASHA (paths canônicos):
```
src/components/islands/akasha/
  KnowledgeStatPanel.tsx
  GoldBorderCard.tsx
  VaultIntegrityBadge.tsx
  MemorySparkline.tsx
  VaultCrystal.tsx
  PromptSalvos.tsx
  DocumentosRecentes.tsx
  PesquisasAtivas.tsx
  AkashaIslandLayout.tsx
```

## Tokens AKASHA:
```
bg-kratos-akasha          → #059669 (esmeralda)
bg-kratos-akasha-glow     → #10B981
text-kratos-akasha-label  → #6EE7B7
bg-kratos-akasha-gold     → #F59E0B
text-kratos-akasha-goldLight → #FCD34D
shadow-glow-akasha        → 0 0 40px rgba(16,185,129,0.3)
border-amber-500          → borda dourada dos cards
```

## KnowledgeStatPanel — Spec:
```tsx
// GlassPanel com borda âmbar especial
// Header: font-serif text-amber-400 (única exceção serif no sistema)
// Stats verticais: ícone 20px + valor bold + label small
// Padding lg, largura fixa ~200px (widget lateral da ilha)
```

## GoldBorderCard — Spec:
```tsx
// GlassPanel com border-l-[3px] border-l-amber-500
// Ícone container 40px com bg-amber-500/20 rounded-lg
// Título: text-sm font-semibold text-white
// Meta: text-[10px] text-white/40
// NÃO usar border colorida em outros cards (anti-pattern — só Akasha usa por identidade)
```

## VaultCrystal — Spec:
```tsx
// Forma diamante via clip-path:
// clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)
// Gradiente: from-emerald-400 to-cyan-400
// Glow: shadow-glow-akasha
// Animação: animate-float-medium
// aria-hidden (decorativo)
```

## MemorySparkline — Spec:
```tsx
// SVG área verde (fill emerald/20 + stroke emerald-400)
// 7-10 pontos de dados
// Delta: "+23.6% ▲" em text-emerald-400
// Sem eixos visíveis (estético, não analítico)
```

## Arquitetura AKASHA como Sistema de Memória:
```
AKASHA lê de:
- SQLite local (via FastAPI read-only endpoint)
- useLiveKratos (hook existente — NÃO TOCAR)

AKASHA NUNCA:
- Escreve direto no banco
- Cria endpoint novo
- Modifica arquivos fora de src/components/islands/akasha/
```

---

# ════════════════════════════════════════════════
# SKILL 8 — omnis-agent-contracts
# Contratos de Agentes OMNIS para produção
# ════════════════════════════════════════════════

## Nome: omnis-agent-contracts
## Quando chamar:
Fase P6+ — quando OMNIS precisar de contratos de status, intenção e resultado
entre o KRATOS (observador) e o OMNIS (executor).

## PRINCÍPIO FUNDAMENTAL:
```
KRATOS vê → Aurora interpreta → OMNIS executa
KRATOS NUNCA executa diretamente.
OMNIS NUNCA recebe POST sem health check confirmado.
```

## Contrato de Status (read-only — KRATOS lê OMNIS):
```typescript
// GET /omnis/health — sempre antes de qualquer exibição
interface OmnisHealthResponse {
  status: "online" | "degraded" | "offline";
  agents: { id: string; name: string; status: "idle" | "executing" | "error" }[];
  lastHeartbeat: string; // ISO timestamp
  version: string;
}
```

## Contrato de Intenção (KRATOS registra intenção, AURORA valida):
```typescript
// Antes de qualquer execução, KRATOS registra a intenção
interface ExecutionIntent {
  id: string;           // uuid
  source: "aurora";     // SEMPRE aurora — nunca direto do UI
  action: string;       // ex: "run_automation:daily_summary"
  context: Record<string, unknown>;
  requestedAt: string;
  approvedBy: "lucas" | null; // null = aguardando aprovação
}
```

## Contrato de Resultado:
```typescript
interface ExecutionResult {
  intentId: string;
  status: "success" | "partial" | "failed";
  output: unknown;
  error?: string;
  completedAt: string;
  // Resultado salvo no AKASHA para memória
  savedToAkasha: boolean;
}
```

## Regra de Ouro — Kill Switch:
```typescript
// Se OMNIS status !== "online" → BLOQUEAR toda execução
// Se approvedBy === null após 30s → timeout e log
// Se error no resultado → NUNCA retry automático, sempre alerta Aurora
```

---

# ════════════════════════════════════════════════
# SKILL 9 — akasha-memory-contracts
# Contratos de Memória AKASHA para produção
# ════════════════════════════════════════════════

## Nome: akasha-memory-contracts
## Quando chamar:
Para definir como KRATOS salva e recupera contexto no AKASHA.

## O AKASHA é o hipocampo do sistema:
```
Compact Memory = "Em que missão você está AGORA?" (1 frase, sempre atualizada)
Vector Memory  = "Todos os contextos e missões anteriores" (busca semântica)
```

## Contrato de Snapshot de Sessão:
```typescript
interface SessionSnapshot {
  id: string;
  mission: string;        // resumo 1 frase (Compact Memory)
  startedAt: string;
  pausedAt?: string;
  state: "active" | "paused" | "abandoned" | "completed";
  context: {
    activeFiles: string[];
    apps: string[];
    kratosMissao: string;
    nextAction: string;
  };
  cognitiveMarkers: {
    flowDetected: boolean;
    driftDetected: boolean;
    stallingDetected: boolean;
  };
}
```

## Contrato de Busca (AKASHA → KRATOS):
```typescript
// KRATOS busca contexto anterior quando detecta drift ou retomada
interface MemoryQuery {
  query: string;     // texto semântico
  limit: number;     // max 5 resultados
  type: "session" | "mission" | "prompt" | "document";
}

interface MemoryResult {
  items: { id: string; title: string; summary: string; score: number }[];
  totalFound: number;
}
```

## Drift Detection Pattern (TDAH-aware):
```
Trigger: usuário inativo por 5min EM APP diferente da missão ativa
→ KRATOS muda StatusChip para warning (amber)
→ Aurora exibe nudge suave (NÃO popup bloqueante)
→ Nudge: "Você estava em [missão]. Continuar ou mudar?"
→ Usuário responde → ação registrada no AKASHA
→ NUNCA forçar retorno. Sempre perguntar.
```

---

# ════════════════════════════════════════════════
# SKILL 10 — visual-qa-kimi
# QA Visual comparando implementação vs Spec Kimi
# ════════════════════════════════════════════════

## Nome: visual-qa-kimi
## Quando chamar:
Após QUALQUER implementação de componente ou ilha.
Antes de qualquer commit visual.

## Processo:
1. Capturar screenshot via Playwright (`localhost:5173`)
2. Comparar com imagem de referência do Kimi
3. Gerar relatório delta com classificação

## Classificações de Delta:
```
[OK]          → Fiel ao spec. Pode commitar.
[AJUSTE LEVE] → Pequena divergência (espaçamento, tamanho de fonte).
                Não bloqueia mas deve ser corrigido na próxima iteração.
[DIVERGÊNCIA] → Cor errada, componente faltando, layout incorreto.
                BLOQUEIA commit.
[BLOQUEANTE]  → Componente de backend tocado, contrato violado, erro no console.
                BLOQUEIA tudo. Requerer revisão do Aurora.
```

## Checklist de QA Visual KRATOS:
```
[ ] Missão Atual visível em <= 10 segundos
[ ] Próxima Ação destacada no StatusBarDock
[ ] Aurora aparece no RightRail
[ ] SourceBadge presente (SSE ou fallback)
[ ] BottomDock visível e completo
[ ] Glassmorphism legível sobre oceano (min 75% opacidade)
[ ] Glow temático correto por ilha (cor certa)
[ ] Animações rodando (float-slow nas ilhas)
[ ] prefers-reduced-motion: animações paradas
[ ] Console do browser sem erros
[ ] TypeScript sem erros (tsc --noEmit)
[ ] 60fps em Chrome/Edge (verificar DevTools Performance)
[ ] Responsivo em 1440×900 (notebook)
[ ] Transição entre ilhas: AnimatePresence com zoom+blur suave
[ ] Interface NÃO parece SaaS corporativo
[ ] Interface NÃO parece dashboard Grafana
[ ] Interface NÃO tem cores inline violando tokens
```

## Playwright Smoke Tests (comandos PowerShell):
```powershell
# Iniciar frontend
cd kratos
npm run dev

# Rodar smoke tests
npx playwright test tests/playwright/smoke/ --reporter=list

# Capturar screenshots de referência
npx playwright test tests/playwright/visual/ --update-snapshots

# Abrir relatório HTML
npx playwright show-report
```

---

# ════════════════════════════════════════════════
# SKILL 11 — motion-guardian
# Guardião de Animações e prefers-reduced-motion
# ════════════════════════════════════════════════

## Nome: motion-guardian
## Quando chamar:
Antes de qualquer commit que adicione animação, transition ou keyframe.

## Animações PERMITIDAS (apenas estas):
```
animate-float-slow     → ilhas flutuando (6s ease-in-out infinite)
animate-float-medium   → elementos menores (5s ease-in-out infinite)
animate-cloud-drift    → nuvens (120s linear infinite)
animate-pulse-glow     → glows temáticos (4s ease-in-out infinite)
animate-spin-slow      → anéis HolographicCore (10s linear infinite)
animate-pulse          → StatusChip executing (Tailwind built-in)
transition-all         → hover states (200-300ms)
```

## Animações PROIBIDAS:
```
- animate-bounce (infantil)
- animate-ping (intrusivo)
- Qualquer @keyframes que mova texto de conteúdo
- Flash ou blink em qualquer intensidade
- Rotação de elementos com texto
- Parallax em scroll (performance em hardware modesto)
```

## Regra prefers-reduced-motion (OBRIGATÓRIA):
```css
/* tailwind.config.ts já tem — VERIFICAR se está aplicado */
@media (prefers-reduced-motion: reduce) {
  .animate-float-slow,
  .animate-float-medium,
  .animate-cloud-drift,
  .animate-pulse-glow,
  .animate-spin-slow {
    animation: none !important;
  }
  /* Manter apenas: transition-opacity para feedback de estado */
}
```

## Framer Motion — Regras de Uso:
```tsx
// PERMITIDO:
whileHover={{ scale: 1.05 }}          // ilhas
transition={{ type: "spring", ... }}  // ilhas
AnimatePresence                        // transição entre rotas
motion.div com opacity/y              // reveals de painel

// PROIBIDO:
motion.div com rotate em conteúdo textual
AnimatePresence com duração > 400ms
Múltiplos motion.div aninhados com animações simultâneas (performance)
```

---

# ════════════════════════════════════════════════
# SKILL 12 — neuro-ux-checker
# Revisor de UX para TDAH
# ════════════════════════════════════════════════

## Nome: neuro-ux-checker
## Quando chamar:
Após qualquer implementação de ilha ou componente que exiba informação.
Também chamar antes de cada entrega de microfase.

## Princípios TDAH do KRATOS (fonte: arquitetura cognitiva):
```
1. Ambient Awareness: informação sempre visível, NUNCA intrusiva
2. Progressive Disclosure: mostrar apenas próxima ação imediata
3. Spatial Memory Anchors: posições FIXAS — nunca mover UI sem aviso
4. Chunking Visual: max 3 itens por grupo visual
5. Espaço negativo generoso: 60% da tela deve ser "respiro"
6. Cor como categoria, não decoração
7. Nunca popup bloqueante para drift detection — sempre nudge suave
8. Celebrar flow state, não penalizar abandono
```

## Checklist Neuro-UX:
```
[ ] Posso ver a Missão Atual em < 1 segundo sem buscar?
[ ] A Próxima Ação está visível sem scroll?
[ ] Há mais de 3 itens competindo por atenção no viewport?
    → Se SIM: problema. Reduzir ou colapsar.
[ ] Algum elemento pisca ou pulsa de forma intrusiva?
    → Se SIM: problema. Pulse apenas em StatusChip de status.
[ ] O Aurora está disponível mas não gritando?
    → Deve ser acessível no RightRail, não um popup.
[ ] Contraste texto/fundo >= 4.5:1?
    → Glassmorphism pode trair — verificar com ferramentas.
[ ] Se o usuário perder o foco, consegue retomar em < 3 segundos?
    → StatusBarDock deve sempre mostrar missão ativa.
[ ] A interface tem "onde estou?" claro?
    → Sidebar highlight da ilha ativa, IslandLabel visível.
[ ] Notificações são ambient (sidebar) e não push (popup)?
    → Se tem alert() ou window.confirm() → REMOVER IMEDIATAMENTE.
```

## Anti-Patterns Neuro-UX a Detectar:
```
❌ Modal bloqueante para qualquer informação não-crítica
❌ Notificação push que interrompe flow
❌ Streak counter com vergonha por não completar
❌ Mais de 3 cores diferentes em 1 card
❌ Texto < 12px em qualquer label operacional
❌ Informação crítica abaixo do fold
❌ Loading sem skeleton (tela em branco = TDAH perde contexto)
❌ Transição brusca (flash branco entre rotas)
```

---

# ════════════════════════════════════════════════
# ROADMAP DE IMPLANTAÇÃO DAS SKILLS
# ════════════════════════════════════════════════

## P0 — Fundação (fazer AGORA):
```
1. Copiar CLAUDE.md para raiz do projeto KRATOS
2. Adicionar hooks: git-guardian.py, token-enforcer.ps1, contract-guardian.py
3. Configurar .claude/settings.json com PreToolUse e PostToolUse
4. Validar tailwind.config.ts com todos os tokens da Fase 3
5. Rodar: npx tsc --noEmit (sem erros antes de qualquer implementação)
```

## P1 — UI Primitives (skill: glass-panel-builder):
```
GlassPanel ✓ (código canônico acima)
KratosCard
StatusChip ✓
SectionTitle
LoadingSkeleton
EmptyState
ErrorState
ProgressRing ✓
MetricBadge
IslandMiniCard
```

## P2 — World Map (skill: island-composer):
```
OceanBackdrop
CloudLayer
FloatingIsland ✓
CentralCastleMission ✓
BridgeSystem
KratosWorldMap ✓
```

## P3 — OMNIS Lab (skill: omnis-lab-builder):
```
HolographicCore ✓
TechPanel
AgentList
IntegrationGrid
SystemHealth
EconomyCounter
OmnisIslandLayout
```

## P4 — AKASHA (skill: akasha-vault-builder):
```
KnowledgeStatPanel
GoldBorderCard
VaultIntegrityBadge
MemorySparkline
VaultCrystal
AkashaIslandLayout
```

## P5 — HUD Polish (skill: hud-assembler):
```
StatusBarDock refinado
WorldNavDock
Sidebar highlight temático
RightRail slot system
```

## P6 — Contratos Bridge (skills: omnis-agent-contracts + akasha-memory-contracts):
```
OmnisHealthResponse (read-only)
ExecutionIntent (registrar intenção — sem POST ainda)
SessionSnapshot (AKASHA salva contexto)
Drift Detection passive
```

---

# ════════════════════════════════════════════════
# PROMPT PRONTO — PRIMEIRA MICROFASE
# Para Claude Code executar no terminal
# ════════════════════════════════════════════════

## MICROFASE P1-A: Implementar UI Primitives Base

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

MICROFASE: P1-A — UI Primitives Base KRATOS
EXECUTOR: Claude Code
SUPERVISOR: AURORA_CONTROL
MODO: EXECUTE (autorizado)

ESCOPO EXATO:
Criar/atualizar apenas os seguintes arquivos:
  src/components/ui/GlassPanel.tsx
  src/components/ui/KratosCard.tsx
  src/components/ui/StatusChip.tsx
  src/components/ui/SectionTitle.tsx
  src/components/ui/LoadingSkeleton.tsx
  src/components/ui/EmptyState.tsx
  src/components/ui/ErrorState.tsx
  src/components/ui/ProgressRing.tsx
  src/components/ui/MetricBadge.tsx
  src/components/ui/IslandMiniCard.tsx
  src/components/ui/index.ts (barrel export)

REFERÊNCIA DE CÓDIGO:
Usar exatamente o código canônico do KRATOS Skills Pack v1.0
para GlassPanel, StatusChip e ProgressRing.
Para os demais, seguir os specs da Fase 3.

REGRAS ABSOLUTAS:
1. NÃO tocar em nenhum arquivo fora de src/components/ui/
2. NÃO criar novos tokens — usar apenas os existentes no tailwind.config.ts
3. NÃO usar "any" no TypeScript
4. CADA componente deve ter: estado vazio, estado erro, estado carregamento
5. TODOS os SVGs decorativos devem ter aria-hidden
6. prefers-reduced-motion deve ser respeitado em TODOS os componentes
7. Commit APENAS com: git add src/components/ui/
   NUNCA: git add . ou git add -A

ACEITE DESTA MICROFASE:
[ ] npx tsc --noEmit → zero erros
[ ] npm run dev → frontend carrega sem erro no console
[ ] Screenshot: GlassPanel renderizando sobre fundo escuro
[ ] Todos os 10 componentes exportados em index.ts
[ ] Nenhum arquivo de backend nos staged files

RELATÓRIO FINAL OBRIGATÓRIO:
Ao finalizar, gerar: reports/P1-A-completion-{data}.md com:
- Arquivos criados/modificados
- Decisões tomadas
- Pontos de atenção para próxima fase
- Status de cada item do checklist de aceite
```

---
*KRATOS / OMNIS / AKASHA Skills Pack v1.0*
*Gerado: Maio 2026 | Por: Perplexity + Kimi Visual Spec Fase 3*
*Revisão obrigatória a cada fase completada*
