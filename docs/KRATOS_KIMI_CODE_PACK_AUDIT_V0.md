# KRATOS Kimi Code Pack Audit V0

**Date:** 2026-05-14 | **Status:** CONCLUÍDA | **Microfase:** Kimi Audit V0

---

## 1. Material Kimi Encontrado

### 1.1 kratos_visualspec4.md (Principal)
| Campo | Valor |
|-------|-------|
| Local | `C:\Users\lucas\Desktop\kratos_visualspec4.md` |
| Tamanho | 318 KB / 7.641 linhas |
| Tipo | Resposta completa do Kimi como Frontend Architect |
| Estrutura | Diagnóstico + Especificação Fase 3A/3B + Código de Referência + Consolidação + Fechamento |

**Seções internas:**
| Seção | Linhas | Conteúdo |
|--------|--------|----------|
| Diagnóstico visual | 350–382 | Análise do que já existia, gaps, riscos |
| Fase 3A — UI Primitives | 385–596 | 10 componentes: GlassPanel, KratosCard, StatusChip, SectionTitle, LoadingSkeleton, EmptyState, ErrorState, ProgressRing, MetricBadge, IslandMiniCard |
| Fase 3B — World Map | 597–726 | 10 componentes: OceanBackdrop, SkyLayer, CloudLayer, FloatingIsland, CentralCastleMission, IslandLabel, WoodenBridge, PortalGlow, WorldMapLegend, KratosWorldMap |
| Código de referência | 727–890 | ProgressRing, GlassPanel, KratosCard (TypeScript completo) |
| ULTRA PROMPT (meta) | 941–2500+ | Pesquisa sobre como usar Kimi K2.6 para frontend |
| Especificação Consolidada | 5392–5682 | Tokens, UI primitives, world map layers, island templates, dock slots |
| Fechamento Vila Viva | 5949–6343 | Especificação completa da ilha Vila Viva + mapa do que falta |
| Prompts de mockups | 6352–7100+ | 10 prompts sequenciais para geração no Kimi (Shell, Sidebar, Topbar, Aurora, etc.) |

### 1.2 KRATOS_CODEX/ (Stubs — 10 arquivos)
| Arquivo | Linhas | Conteúdo real |
|---------|--------|---------------|
| `kratos-design-bible.md` | 1 | "Define the visual constitution..." |
| `kratos-component-catalog.md` | 1 | stub vazio |
| `kratos-frontend-architecture.md` | 1 | stub vazio |
| `kratos-world-model.md` | 1 | "Central castle is mission continuity..." |
| `kratos-neuro-ux-rules.md` | 1 | "Prioritize next action, interruption recovery..." |
| `kratos-live-states.md` | 1 | "States: loading, live, stale, degraded, offline, empty." |
| `kratos-safe-editing-rules.md` | 1 | "Prefer extraction over rewrite..." |
| `kratos-aurora-behavior.md` | 1 | "Aurora is contextual and assistive..." |
| `kratos-mission-lens-contracts.md` | 1 | "Mission Lens should expose stable selectors..." |
| `kratos-visual-acceptance.md` | 1 | "Mission clear in 10 seconds, next action obvious..." |

**Veredito Codex:** TODOS são placeholders de 1 linha. Zero código, zero especificação detalhada. Servem apenas como índice temático do que PRECISARIA ser escrito.

### 1.3 KRATOS_CODEX_READY_EXTRACTED/
PNGs de referência (ChatGPT Image). Mockups visuais usados como input para o Kimi. Nenhum código.

---

## 2. Matriz de Classificação

Legenda:
- **USAR AGORA** — Aproveitável diretamente na próxima microfase, sem adaptação
- **USAR DEPOIS** — Bom material, mas requer pré-requisitos (P1-B, P2)
- **ADAPTAR** — Conceito útil, implementação precisa de reescrita para tokens/stack do projeto
- **NÃO USAR** — Incompatível com stack, regras do projeto, ou já existe melhor

### 2.1 Classificação por Material

| Material Kimi | Tipo | Classificação | Justificativa |
|---------------|------|---------------|---------------|
| Diagnóstico visual (linhas 350–382) | Análise | USAR DEPOIS | Diagnóstico preciso do estado PRÉ-1.0. A maioria dos gaps já foi resolvida. Útil como referência histórica. |
| GlassPanel spec + código | Spec + Código | ADAPTAR | Já existe `.kr-glass-panel` em index.css. Código Kimi usa `class-variance-authority` (não instalado), `cn()` de `@/lib/utils` (não existe). Conceito ok, implementação reescrever. |
| KratosCard spec + código | Spec + Código | ADAPTAR | Já existe via classes CSS. Props do Kimi são úteis como referência de API. |
| StatusChip spec | Spec | ADAPTAR | Já existe `.kr-chip-*` (6 variantes). Spec do Kimi tem estados diferentes (online/executing/error/stale vs healthy/degraded/critical/offline). Unificar. |
| SectionTitle spec | Spec | ADAPTAR | Já existe `.kr-section-title`. Adicionar prop `action` e `divider`. |
| LoadingSkeleton spec | Spec | ADAPTAR | Já existe `LoadingSkeleton.tsx`. Kimi spec adiciona shimmer animado — útil. |
| EmptyState spec | Spec | USAR DEPOIS | Não existe no repo. Componente necessário para P2. |
| ErrorState spec | Spec | USAR DEPOIS | Não existe no repo. Componente necessário para P2. |
| ProgressRing spec + código | Spec + Código | USAR DEPOIS | Não existe no repo. Código do Kimi é funcional (SVG + stroke-dasharray). Adaptar tokens e remover `any`. |
| MetricBadge spec | Spec | USAR DEPOIS | Não existe no repo. Útil para painéis de métricas. |
| IslandMiniCard spec | Spec | USAR DEPOIS | Navegação alternativa mobile. Necessário para responsividade. |
| OceanBackdrop spec | Spec | NÃO USAR | Já existe `WorldOceanBackground.tsx` — funcional e integrado ao mundo 3D. |
| SkyLayer spec | Spec | NÃO USAR | Já implementado via CSS em index.css (`.world-sky`). |
| CloudLayer spec | Spec | NÃO USAR | Já existe `WorldClouds.tsx` — funcional. |
| FloatingIsland spec + código | Spec + Código | NÃO USAR | Já existe `FloatingIsland.tsx` — mais completo. Código Kimi usa `motion.div` (Framer Motion não instalado). |
| CentralCastleMission spec + código | Spec + Código | NÃO USAR | Já existe `CentralCastleIsland.tsx`. Código Kimi usa clipPath complexo que duplica o existente. |
| IslandLabel spec | Spec | NÃO USAR | Já implementado dentro de `FloatingIsland.tsx`. |
| WoodenBridge spec | Spec | NÃO USAR | Já existe `IslandBridge.tsx` — implementado com SVG. |
| PortalGlow spec | Spec | NÃO USAR | Já implementado via CSS (`.kr-island-glow`). |
| WorldMapLegend spec | Spec | USAR DEPOIS | Não existe. Componente simples, útil para onboarding. |
| KratosWorldMap spec + código | Spec + Código | NÃO USAR | Já existe `KratosWorldMap.tsx` — orquestrador completo com 6 subcomponentes. |
| Design tokens globais (seção 2) | Tokens | ADAPTAR | Nomes diferentes dos tokens existentes (`kratos.ocean` vs `--kr-ocean-deep`). Cores úteis para P1-B (shadow, glow). |
| Island templates (seção 5) | Spec | ADAPTAR | 6 templates detalhados (Agência, Nimbus, OMNIS, Akasha, Vila, Arena). Estrutura de slots por ilha é útil. |
| BottomDock adaptativo (seção 6) | Arquitetura | USAR DEPOIS | Design de slots por rota. Refinamento do dock atual. |
| HolographicCore código | Código | USAR DEPOIS | Componente visual OMNIS. Usa `motion.div` — adaptar para CSS puro. |
| DreamPortal código | Código | USAR DEPOIS | Componente visual Nimbus. Usa `motion.div` — adaptar para CSS puro. |
| Vila Viva — DailyRoutines | Código | USAR DEPOIS | Código funcional, usa tokens em vez de hex (bom sinal). Adaptar para tokens `--kr-*`. |
| Vila Viva — RelationshipReminders | Código | USAR DEPOIS | Código funcional, padrão consistente. |
| Vila Viva — QualityTimePanel | Código | USAR DEPOIS | Reusa ProgressRing. Bom exemplo de composição. |
| Vila Viva — FamilyAgenda | Código | USAR DEPOIS | Código funcional. |
| Vila Viva — LifeAgendaCalendar | Código | USAR DEPOIS | Mini calendário com corações. |
| Prompts de mockups (10) | Meta-prompts | NÃO USAR | São prompts PARA o Kimi gerar mockups visuais, não código. Fora do escopo do Claude Code. |
| ULTRA PROMPT pesquisa Kimi | Meta-pesquisa | NÃO USAR | É um prompt pedindo pesquisa sobre como usar Kimi. Zero código. |
| KRATOS_CODEX/ (10 stubs) | Placeholders | NÃO USAR | 1 linha cada. Sem conteúdo aproveitável. |
| PNGs de referência | Imagens | NÃO USAR | Mockups visuais. Sem código. |

### 2.2 Contagem

| Classificação | Quantidade |
|---------------|------------|
| USAR AGORA | 0 |
| USAR DEPOIS | 15 |
| ADAPTAR | 7 |
| NÃO USAR | 14 |

---

## 3. O que JÁ EXISTE no Repo (Kimi NÃO sabia)

O Kimi escreveu a spec antes da branch `feature/kratos-1-visual-shell`. Tudo abaixo já existe e torna partes da spec redundantes:

| O que Kimi especificou | O que já existe no repo | Arquivo |
|------------------------|------------------------|---------|
| GlassPanel | `.kr-glass-panel`, `.glass-panel` classes | `index.css` |
| KratosCard | `.kr-card` classes | `index.css` |
| StatusChip | `.kr-chip-healthy`, `.kr-chip-degraded`, `.kr-chip-critical`, `.kr-chip-offline`, `.kr-chip-info`, `.kr-chip-neutral` | `index.css` |
| SectionTitle | `.kr-section-title` | `index.css` |
| LoadingSkeleton | `LoadingSkeleton.tsx` | `components/LoadingSkeleton.tsx` |
| OceanBackdrop | `WorldOceanBackground.tsx` | `components/WorldOceanBackground.tsx` |
| SkyLayer | `.world-sky` CSS | `index.css` |
| CloudLayer | `WorldClouds.tsx` | `components/WorldClouds.tsx` |
| FloatingIsland | `FloatingIsland.tsx` | `components/FloatingIsland.tsx` |
| CentralCastleMission | `CentralCastleIsland.tsx` | `components/CentralCastleIsland.tsx` |
| WoodenBridge | `IslandBridge.tsx` | `components/IslandBridge.tsx` |
| KratosWorldMap | `KratosWorldMap.tsx` | `components/KratosWorldMap.tsx` |
| AuroraPanel | `AuroraPanel.tsx` | `components/AuroraPanel.tsx` |
| MissionBar | `MissionBar.tsx` | `components/MissionBar.tsx` |
| Design tokens | 172 tokens `--kr-*` | `styles/kratos-tokens.css` |
| CheckpointSuggestion | `CheckpointSuggestionBanner.tsx` + `useCheckpointSuggestion.ts` | components + hooks |
| Live telemetry | `useLiveKratos.ts` (SSE + polling) | `hooks/useLiveKratos.ts` |
| Dynamic progress | MissionBar com progress/taskCount do /tasks | `Layout.tsx` → `KratosBottomDock.tsx` → `MissionBar.tsx` |
| Reduced motion | Regras em index.css | `index.css` |
| P1-A token cleanup | 11 rgba → color-mix (uncommitted) | `AuroraPanel.tsx` + `index.css` |

---

## 4. Incompatibilidades Técnicas do Código Kimi

Todo código de referência do Kimi tem estes problemas:

| Problema | Exemplo | Correção necessária |
|----------|---------|---------------------|
| `any` em TypeScript | `{position, mission}:any` | Tipar com interfaces explícitas |
| Framer Motion | `motion.div`, `whileHover`, `animate=` | Projeto NÃO tem Framer Motion. Substituir por CSS transitions/animations. |
| `cn()` de `@/lib/utils` | `import { cn } from "@/lib/utils"` | Não existe no projeto. Usar template literals ou instalar `clsx`. |
| `class-variance-authority` | `cva`, `VariantProps` | Não instalado. Usar classes condicionais simples. |
| `tailwind.config.ts` | Tokens no formato `kratos: { ocean: ... }` | Tailwind v4 usa CSS-based config. Tokens devem ir em `kratos-tokens.css`. |
| Hex inline | `#F97316`, `#7C3AED`, `#DC2626` | Devem ser `var(--kr-*)` tokens. |
| Ícones Lucide | `Bot`, `AlertTriangle`, `CheckCircle2` | Não instalado. Projeto usa unicode chars (+ TODO para SVG icons). |
| `forwardRef` desnecessário | `forwardRef<HTMLDivElement, ...>` | Só necessário se o componente realmente precisa de ref. |

---

## 5. Sequência Segura de Implementação (FRONT-KIMI)

### FRONT-KIMI-01: Commit P1-A (IMEDIATO)
- Commitar alterações pendentes de AuroraPanel.tsx e index.css
- Build passando, 0 erros TypeScript
- **Risco:** NENHUM. Código já testado.

### FRONT-KIMI-02: P1-B — CSS Token Completion
- Criar tokens de sombra (`--kr-shadow-*`) para os ~50 rgba/hex restantes
- Criar tokens de glow (`--kr-glow-*`)
- Aproveitar paleta de cores do Kimi como referência (NÃO copiar nomes — adaptar para `--kr-*`)
- **Risco:** BAIXO. Só mexe em CSS tokens.

### FRONT-KIMI-03: P2-A — UI Primitives (EmptyState, ErrorState, ProgressRing, MetricBadge)
- Criar `src/components/ui/` (não existe)
- Implementar 4 componentes que NÃO existem no repo
- Usar spec do Kimi como referência de API, reescrever implementação com tokens `--kr-*`
- **Risco:** BAIXO. Componentes novos, zero breaking changes.

### FRONT-KIMI-04: P2-B — UI Primitives (Refinamento)
- IslandMiniCard para navegação mobile
- WorldMapLegend
- Adaptar StatusChip do Kimi para unificar com `.kr-chip-*` existente
- Adicionar shimmer ao LoadingSkeleton
- **Risco:** BAIXO. Aprimoramento de componentes existentes.

### FRONT-KIMI-05: P3-A — Island Templates (Rail Slots)
- Implementar sistema de slots por ilha no RightRail
- KpiQuadPanel para Agência
- AgentList, IntegrationGrid para OMNIS
- GoldBorderCard, KnowledgeStatPanel para Akasha
- **Risco:** MÉDIO. Mexe no layout de múltiplas páginas. Backend intocado.

### FRONT-KIMI-06: P3-B — Island Decorativos (Centrais)
- HolographicCore para OMNIS (sem Framer Motion)
- DreamPortal para Nimbus (sem Framer Motion)
- Componentes da Vila Viva (DailyRoutines, RelationshipReminders, etc.)
- **Risco:** MÉDIO. Componentes visuais puros, sem lógica de negócio.

### FRONT-KIMI-07: P4 — BottomDock Adaptativo + Motion Polish
- Slots dinâmicos por rota no dock
- StatusBarDock global
- Responsividade mobile/tablet
- **Risco:** MÉDIO. Altera Layout.tsx (protegido — auditar antes).

---

## 6. Arquivos Protegidos (NÃO TOCAR em nenhuma microfase)

| Arquivo | Motivo |
|---------|--------|
| `backend/**` | Regra absoluta |
| `src/hooks/useLiveKratos.ts` | Contrato SSE + polling |
| `src/hooks/useApi.ts` | Fetch genérico base |
| `src/components/KratosVisualShell.tsx` | Grid shell estável |
| `src/components/KratosWorldMap.tsx` | Mundo 3D estável |
| `src/components/Layout.tsx` | Orquestrador (só na FRONT-KIMI-07 com auditoria) |
| `src/styles/kratos-tokens.css` | 172 tokens canônicos (só adicionar, nunca remover) |

---

## 7. Veredito Brutal

| Pergunta | Resposta |
|----------|----------|
| O material do Kimi está aproveitável? | **PARCIALMENTE.** O visualspec4.md tem 7.641 linhas mas ~70% é meta-pesquisa sobre Kimi ou especifica coisas que já existem. O valor real está nos componentes de ilha (Vila Viva) e nos UI primitives que ainda não existem (EmptyState, ErrorState, ProgressRing, MetricBadge). |
| Existe risco de duplicar componentes? | **SIM, ALTÍSSIMO.** O Kimi especificou GlassPanel, KratosCard, FloatingIsland, CentralCastleMission, KratosWorldMap e outros que JÁ EXISTEM no repo. Se um agente seguir a spec do Kimi cegamente, vai reescrever componentes funcionais. O token-enforcer skill deve ser carregado antes de qualquer implementação. |
| Existe risco de quebrar backend? | **NÃO.** Nenhum material do Kimi menciona endpoints, SQLite, coletores, ou `/live/stream`. Todo o escopo é frontend visual puro. |
| Existe risco de mexer em useLiveKratos? | **NÃO.** Nenhum material do Kimi referencia SSE, polling, ou useLiveKratos. |
| Qual é a primeira microfase segura? | **FRONT-KIMI-01: Commit P1-A.** As alterações de token cleanup já estão feitas e testadas (build passa, 0 erros). É um commit seguro de 2 arquivos. Depois: P1-B (CSS tokens novos, zero lógica). |
| Os stubs do KRATOS_CODEX têm valor? | **NÃO.** São 10 arquivos com 1 linha cada. Servem apenas como lembrete do que precisa ser escrito. Não bloqueiam nenhuma implementação. |
| Os PNGs de referência são úteis? | **LIMITADO.** São mockups visuais do ChatGPT. Podem orientar o design, mas não contêm código. |

---

## 8. Estado Atual do Repo

```
Branch: feature/kratos-1-visual-shell
Commits: 4 (c2edc94 ← aa4096a ← 05a4eaa ← f2c631b)
Alterações pendentes (P1-A):
  M frontend/src/components/AuroraPanel.tsx
  M frontend/src/index.css
Build: 61 modules, 0 errors
Testes backend: 128 passed
```

---

*Documento gerado ao final da microfase Kimi Code Pack Audit V0. Nenhum commit feito.*
