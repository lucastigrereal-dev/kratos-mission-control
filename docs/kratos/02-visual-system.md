# KRATOS Visual System — Bible + Tokens + Templates

> **Para Manus/Kimi:** Toda decisão visual segue este documento. Tokens primeiro, hex nunca.

---

## 1. Princípios Visuais

- **Glassmorphism:** backdrop-blur em toda chrome (sidebar, topbar, painéis)
- **Dark mode only:** fundo oceano profundo `#051024`
- **Tom operacional:** fonte mono para dados, sans para labels
- **1 ação primária por tela** — visualmente dominante
- **Posições fixas** — spatial memory, sem reordenação
- **Zero popups** sem trigger explícito
- **Cores vibrantes só para alertas críticos**

---

## 2. Design Tokens (`src/styles/kratos-tokens.css`)

### 2.1 Oceano e Céu (fundo do mundo 3D)

```css
--kr-ocean-deep: #051024
--kr-ocean-mid: #0A1930
--kr-ocean-surface: #0F2347
--kr-sky-upper: #0B1A3B
--kr-sky-lower: #162D50
--kr-sun-glow: rgba(99, 102, 241, 0.15)
```

### 2.2 Ilhas (terreno flutuante)

```css
--kr-island-grass: #1A3A2A
--kr-island-earth: #2D1F0E
--kr-island-rock: #3D3D3D
--kr-island-edge: rgba(255, 255, 255, 0.06)
```

### 2.3 Castelo (CSS-only)

```css
--kr-castle-stone: #4A4A5A
--kr-castle-tower: #5A5A6A
--kr-castle-gate: #FFD700
--kr-castle-portal: #6366F1
```

### 2.4 Glassmorphism

```css
--kr-glass-bg: rgba(15, 23, 42, 0.75)
--kr-glass-border: rgba(255, 255, 255, 0.06)
--kr-glass-strong-bg: rgba(15, 23, 42, 0.90)
--kr-glass-strong-border: rgba(255, 255, 255, 0.08)
--kr-panel-blur: 20px
```

### 2.5 Cores Semânticas

```css
--kr-color-aurora: #6366F1     /* Aurora AI */
--kr-color-mission: #22C55E    /* Sucesso/missão ativa */
--kr-color-risk: #EF4444       /* Perigo/alerta */
--kr-color-warn: #F59E0B       /* Aviso/drift */
--kr-color-info: #3B82F6       /* Informação */
--kr-azure: #3B82F6            /* Azul celestial */
--kr-gold: #FFD700             /* Destaque/ouro */
```

### 2.6 Superfícies

```css
--kr-surface-1: rgba(255, 255, 255, 0.02)
--kr-surface-2: rgba(255, 255, 255, 0.03)
--kr-surface-mid: rgba(255, 255, 255, 0.06)
```

### 2.7 Texto

```css
--kr-text-primary: #E5E7EB
--kr-text-secondary: #D1D5DB
--kr-text-muted: #9CA3AF
--kr-font-sans: 'Inter', system-ui, sans-serif
--kr-font-mono: 'JetBrains Mono', monospace
```

### 2.8 Espaçamento

```css
--kr-space-xs: 4px
--kr-space-sm: 8px
--kr-space-md: 12px
--kr-space-lg: 16px
--kr-space-xl: 24px
```

### 2.9 Sombras

```css
--kr-shadow-card: 0 1px 3px rgba(0,0,0,0.3)
--kr-shadow-elevated: 0 4px 12px rgba(0,0,0,0.4)
--kr-shadow-glow-aurora: 0 0 20px rgba(99,102,241,0.3)
```

### 2.10 Z-Index (camadas do mundo 3D)

| Camada | z-index | Componente |
|---|---|---|
| z-0 a z-30 | 0-30 | Mundo 3D (oceano, céu, nuvens) |
| z-40 a z-70 | 40-70 | Ilhas, castelo, pontes |
| z-[75] | 75 | WorldCharacterMarker |
| z-[80] | 80 | Sidebar, Topbar, AuroraPanel |
| z-[85] | 85 | DriftIndicator |
| z-[86] | 86 | ZombieBadge / Offline |
| z-[89] | 89 | CurrentMissionBar, Alert pill |
| z-[90] | 90 | StatusBarDock |

### 2.11 Animações

```css
--kr-duration-fast: 100ms
--kr-duration-normal: 200ms
--kr-duration-slow: 400ms
--kr-duration-glacial: 120s   /* cloud drift */
--kr-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--kr-ease-out: cubic-bezier(0, 0, 0.2, 1)
```

### 2.12 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

## 3. Classes Utilitárias

```css
.glass-panel        /* backdrop-blur + glass bg + border */
.glass-panel-strong /* variante mais opaca */
.kratos-card        /* card com hover lift */
.kratos-eyebrow     /* label mono uppercase tracking */
.kratos-mono        /* fonte monospace */
.kratos-scrollbar   /* scrollbar customizada fina */
.kratos-focus-ring  /* anel de foco acessível */
.kr-animate-pulse-glow  /* pulso sutil (alertas apenas) */
.kr-animate-float       /* flutuação suave (ilhas) */
```

---

## 4. HUD Layout (KratosWorldPage)

```
┌─────────────────────────────────────────────────┐
│ Topbar (h:52, z-80, glass)                       │
│ [OperatorWelcome] [StatusDot] [SourceBadge] [AuroraBtn]
├────┬──────────────────────────────────┬──────────┤
│    │                                  │ Aurora   │
│ SB │  KratosWorldMap (z-0..70)       │ Panel    │
│    │  Ocean + Sky + Clouds            │ (z-80)   │
│ 60 │  Ilhas + Castelo + Bridges       │ w:340    │
│ px │                                  │          │
│    │  WorldCharacterMarker (z-75)     │ Aurora   │
│    │                                  │ ChatDock │
├────┴──────────────────────────────────┴──────────┤
│ DriftIndicator (z-85, condicional)                │
│ CurrentMissionBar + Restore CTA (z-89)            │
│ StatusBarDock (z-90, fixed bottom)                │
└─────────────────────────────────────────────────┘
```

---

## 5. Componentes de UI Primitives

Sempre usar estes. NUNCA criar card/panel/empty-state novo.

| Componente | Arquivo | Uso |
|---|---|---|
| `GlassPanel` | `ui-primitives/GlassPanel.tsx` | Container com blur |
| `KratosCard` | `ui-primitives/KratosCard.tsx` | Card com header/footer |
| `LoadingSkeleton` | `ui-primitives/LoadingSkeleton.tsx` | Loading shimmer |
| `EmptyState` | `ui-primitives/EmptyState.tsx` | Estado vazio com CTA |
| `ErrorState` | `ui-primitives/ErrorState.tsx` | Erro com retry |
| `ProgressRing` | `ui-primitives/ProgressRing.tsx` | SVG radial progress |
| `MetricBadge` | `ui-primitives/MetricBadge.tsx` | Valor/label/delta |
| `SectionTitle` | `ui-primitives/SectionTitle.tsx` | Título com ícone |
| `StatusChip` | `ui-primitives/StatusChip.tsx` | Chip de estado |
| `IconTile` | `ui-primitives/IconTile.tsx` | Ícone em tile colorido |
| `IslandMiniCard` | `ui-primitives/IslandMiniCard.tsx` | Preview de ilha |

---

## 6. Template de Tela de Ilha

```tsx
// src/components/kratos/islands/NovaIlhaScreen.tsx
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { LoadingState } from "@/components/kratos/base/LoadingState";

interface NovaIlhaScreenProps {
  isLoading?: boolean;
  error?: { message: string } | null;
  isEmpty?: boolean;
}

export function NovaIlhaScreen({
  isLoading = false,
  error = null,
  isEmpty = false,
}: NovaIlhaScreenProps) {
  return (
    <IslandPageFrame theme="indigo">
      <IslandPageHeader
        title="Nome da Ilha"
        description="Descrição do propósito"
        icon="🎯"
        onBack={() => window.history.back()}
      />
      {/* content */}
    </IslandPageFrame>
  );
}
```

### Temas de Ilha Disponíveis

```css
--kr-island-omnis: #6366F1       /* indigo */
--kr-island-agencia: #06B6D4     /* cyan */
--kr-island-akasha: #FFD700      /* gold */
--kr-island-nimbus: #22C55E      /* green */
--kr-island-arena: #F59E0B       /* amber */
--kr-island-vila: #EC4899        /* pink */
--kr-island-forja: #EF4444       /* red */
--kr-island-observatorio: #3B82F6 /* blue */
--kr-island-filosofia: #8B5CF6   /* purple */
--kr-island-tesouro: #22C55E     /* green */
```

---

## 7. Estados Obrigatórios (toda tela com dados)

```tsx
// Padrão: loading > error > empty > dados
if (isLoading) return <LoadingState lines={5} />;
if (error) return <ErrorState title="..." description="..." onRetry={refetch} />;
if (isEmpty) return <EmptyState title="..." description="..." />;
return <DadosReais />;
```

---

## 8. Regras de Estilo

1. ✅ `style={{ color: "var(--kr-text-primary)" }}` — usar tokens
2. ❌ `style={{ color: "#E5E7EB" }}` — **nunca hex inline**
3. ✅ `className="glass-panel"` — classes utilitárias
4. ✅ `cn("base", cond && "variant")` — merge com `cn()`
5. ❌ Template literals sem `cn()` — quebra Tailwind purge
6. ✅ `lucide-react` para ícones
7. ❌ Emojis como ícones (exceto em labels de ilha)

---

## 9. Tipografia

| Uso | Fonte | Tamanho | Tracking |
|---|---|---|---|
| Título de seção | `kratos-mono` | 10px | 0.15em |
| Dados/métricas | `kratos-mono` | 11-12px | normal |
| Corpo | Inter | 12-14px | normal |
| Labels | Inter | 10-11px | normal |
| Aurora messages | Inter | 11px | normal |
| Eyebrow | `kratos-mono` | 10px | 0.18em |
