# KRATOS KIMI K-P3F LIVE DATA VISUAL STATES REPORT

**Data:** 2026-05-14 | **Branch:** `feature/kratos-kimi-visual-wave-2`

---

## 1. Objetivo

Criar um sistema de estados visuais para dados vivos — transições entre loading, empty, error, degraded, stale e fresh com feedback visual imediato e personalidade, sem poluição.

---

## 2. Material Kimi Usado

| Documento | Uso |
|-----------|-----|
| `VISUAL_BIBLE.md` | Estados com transições suaves, glass em todos os níveis |
| `ANTI_SAAS_RULES.md` | "Feedback que respira" — nada de spinner infinito sem contexto |

---

## 3. Arquivos Alterados

| Arquivo | Mudança |
|---------|---------|
| `frontend/src/index.css` | ~90 linhas de novos estados e refinamentos |

**Nenhum componente novo ou TSX alterado. Zero dependências novas.**

---

## 4. Melhorias Visuais

### Stale Data (`kr-data-stale`, `kr-stale-badge`)
- Overlay âmbar sutil (4% opacity) sobre containers com dados desatualizados
- Badge inline: "cache" / "14min atrás" com cor `--kr-status-stale` + glass pill
- Camada `::before` não-bloqueante com `pointer-events: none`

### Fresh Data Pulse (`kr-data-fresh`)
- Animação `kr-fresh-pulse`: glow verde inserido que expande e dissolve
- 1.2s duração, ativado ao receber dados live após polling/fallback
- Usa `box-shadow: inset` para não afetar layout

### State Transition (`kr-state-transition`)
- Container wrapper: filhos entram com `kr-state-enter` (fade-in + slide-up 4px)
- 0.3s ease-out — rápido o suficiente para não parecer lag
- Transição entre loading → empty, loading → error, loading → data

### Degraded Indicator (`kr-degraded-indicator`)
- Banner inline amarelo sutil: "Modo polling — dados atualizados a cada 30s"
- Dot pulsante + glass bg + border yellow 12%
- Alternativa mais suave ao error banner para modos aceitáveis

### Empty State Refinements
- Descrição com `font-style: italic` para tom mais humano
- Action button: `font-weight: 600`, hover com azure glow + background tint
- Nova variante: `.kr-empty-state--glass` com bg, border, blur e border-radius

### Error State Refinements
- Retry button: hover com azure tint + glass strong bg
- Transição expandida para feedback tátil

### Skeleton Glass (`kr-skeleton-glass`)
- Nova variante: skeleton com visual de glass (bg + border)
- Shimmer sobre glass para sensação de "carregando dentro do vidro"

---

## 5. Sistema de Estados (Resumo)

| Estado | Classes | Gatilho Visual |
|--------|---------|----------------|
| Carregando | `kr-skeleton`, `kr-skeleton-glass` | Shimmer animado |
| Vazio | `kr-empty-state`, `--glass` | Ícone opaco + desc italic |
| Erro | `kr-error-state`, `--danger/warning/info` | Border + bg coloridos |
| Stale | `kr-data-stale`, `kr-stale-badge` | Overlay âmbar sutil |
| Fresh | `kr-data-fresh` | Pulse verde momentary |
| Degraded | `kr-degraded-indicator` | Banner amarelo sutil |
| Offline | `kr-offline-overlay` | Barra fixa vermelha |

---

## 6. Build

| Métrica | Antes (K-P3E) | Depois |
|---------|---------------|--------|
| Módulos | 68 | 68 |
| Erros | 0 | 0 |
| Tempo | 695ms | 632ms |
| CSS | 59.68 KB | 62.97 KB (+3.29 KB) |
| JS | 206.97 KB | 206.97 KB (inalterado) |

---

## 7. Backend Diff

**VAZIO.** Zero arquivos backend alterados.

---

## 8. Próxima Microfase Recomendada

**K-P3G — Neuro UX / Cognitive Continuity** (preservação de scroll, foco, transições de rota, breadcrumbs visuais)
