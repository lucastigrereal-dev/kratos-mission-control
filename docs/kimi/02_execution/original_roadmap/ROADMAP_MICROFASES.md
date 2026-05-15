# ROADMAP DE MICROFASES — KRATOS Frontend
## Ordem Oficial de Execução

---

## ESTADO ATUAL (14/05/2026)

```
Branch: feature/kratos-1-visual-shell
Commits: c2edc94 (skills) ← 05a4eaa (visual shell) ← aa4096a ← f2c631b
Build: 61 módulos, 0 erros, 629ms
Testes: 128/128 passing
```

**Já implementado (NÃO recriar):**
- Shell visual completo (TopHud, Sidebar, BottomDock, RightRail, AuroraPanel)
- KratosWorldMap + FloatingIsland + CentralCastleIsland + IslandBridge
- WorldClouds + WorldOceanBackground
- MissionBar + LoadingSkeleton + SourceBadge
- 11 skills de Claude Code em `.claude/skills/`

---

## MICROFASES

### FRONT-KIMI-01 — Audit do Estado Atual
**Objetivo:** Mapear o que existe vs. o que as specs definem. Criar inventário.
**Consultar:** `01_VISUAL_BIBLE/VISUAL_BIBLE.md`, mockups em `00_VISUAL_REFERENCES/images/`
**Pode alterar:** `docs/` apenas
**Não pode:** Nenhum código frontend
**Critério:** Relatório com: existe/falta/diverge por componente
**Tempo estimado:** 30min

---

### FRONT-KIMI-02 — Design Tokens + Motion System
**Objetivo:** Garantir que `tailwind.config.ts` tem todos os tokens e criar `src/motion/variants.ts`
**Consultar:** `01_VISUAL_BIBLE/VISUAL_BIBLE.md` seção 5, `08_MOTION_SYSTEM/`
**Pode alterar:**
- `frontend/tailwind.config.ts`
- `frontend/src/styles/kratos-tokens.css`
- `frontend/src/motion/variants.ts` (criar)
- `frontend/src/hooks/useReducedMotion.ts` (criar)
**Não pode:** Backend, endpoints, useLiveKratos
**Critério:** `npm run build` passa. Tokens visíveis no DevTools.
**Tempo estimado:** 45min

---

### FRONT-KIMI-03 — UI Primitives
**Objetivo:** Criar/atualizar primitives em `frontend/src/components/ui/`
**Consultar:** `03_SAFE_PRIMITIVES/` — todos os arquivos
**Componentes alvo:**
- `GlassPanel.tsx` (criar ou atualizar)
- `KratosCard.tsx` (criar)
- `StatusChip.tsx` (criar ou atualizar)
- `ProgressRing.tsx` (criar)
- `MetricBadge.tsx` (criar)
- `MetricBadgeV2.tsx` (criar)
- `EmptyState.tsx` (criar)
- `ErrorState.tsx` (criar)
- `IslandMiniCard.tsx` (criar)
- `SectionTitle.tsx` (criar)
**Não pode:** Mexer em componentes que já existem sem comparar
**Critério:** Build passa. 128 testes passam.

---

### FRONT-KIMI-04 — World Map Polish
**Objetivo:** Refinar os componentes do mundo já existentes
**Consultar:** `04_WORLD_MAP_COMPONENTS/`
**Componentes alvo:**
- `OceanBackdrop.tsx` / `WorldOceanBackground.tsx` → verificar tokens
- `CloudLayer.tsx` / `WorldClouds.tsx` → verificar animação drift
- `FloatingIsland.tsx` → adicionar Framer Motion hover + pseudo-3D melhorado
- `CentralCastleIsland.tsx` → adicionar MissionBanner HTML real
- `IslandBridge.tsx` → verificar SVG
- `IslandLabel.tsx` (criar se não existir)
**Não pode:** Recriar mapa inteiro se estrutura existe
**Critério:** Visual idêntico ao mockup `06_VISAO_GERAL_MAPA.png`

---

### FRONT-KIMI-05 — HUD Polish
**Objetivo:** Refinar shell (TopHud, Sidebar, BottomDock)
**Consultar:** `05_HUD_COMPONENTS/`
**Componentes alvo:**
- `KratosTopHud.tsx` → Energia, XP, Nível, Relógio
- `KratosSidebar.tsx` → 12 itens ordem fixa + highlight temático
- `KratosBottomDock.tsx` → Slot container com AudioPlayer + MissionStep + SquadDock
- `StatusBarDock.tsx` (criar)
- `SquadDock.tsx` (criar)
- `AudioPlayer.tsx` (criar)
**Critério:** BottomDock mostra Missão Atual + Próxima Ação em todas as rotas

---

### FRONT-KIMI-06 — Aurora Panel Polish
**Objetivo:** Refinar AuroraPanel + criar componentes Aurora
**Consultar:** `06_AURORA_COMPONENTS/`
**Componentes alvo:**
- `AuroraPanel.tsx` → Orb holográfico + mentor summary
- `AuroraOrb.tsx` (criar)
- `AuroraSignalCard.tsx` (criar)
- `CheckpointSuggestionVisual.tsx` (criar)
**Critério:** Aurora aparece em todas as rotas no RightRail topo. Não vira chat.

---

### FRONT-KIMI-07 — Island: OMNIS Lab
**Consultar:** `07_ISLAND_PAGES/OmnisLabPage.md`
**Componentes novos:** HolographicCore, TechPanel, AgentList, IntegrationGrid, SystemHealth, EconomyCounter
**Critério:** Visual idêntico ao mockup `02_OMNIS_LAB.png`

---

### FRONT-KIMI-08 — Island: Akasha / Gringotts
**Consultar:** `07_ISLAND_PAGES/AkashaGringottsPage.md`
**Componentes novos:** KnowledgeStatPanel, GoldBorderCard, VaultIntegrityBadge, MemorySparkline, VaultCrystal
**Critério:** Visual idêntico ao mockup `01_AKASHA_GRINGOTTS.png`

---

### FRONT-KIMI-09 — Island: Agência / Estúdio
**Consultar:** `07_ISLAND_PAGES/AgenciaEstudioPage.md`
**Componentes novos:** KpiQuadPanel, MetricBadgeV2, ContentCalendar, IdeaTracker
**Critério:** Visual idêntico aos mockups `03_AGENCIA_ESTUDIO_V2.png` e `04_AGENCIA_ESTUDIO_V1.png`

---

### FRONT-KIMI-10 — Islands: Arena + Forja + Observatório + Tesouro
**Consultar:** `07_ISLAND_PAGES/` cada arquivo correspondente
**Uma ilha por sessão de Claude Code**
**Critério:** Build passa após cada ilha

---

### FRONT-KIMI-11 — Islands: Vila Viva + Filosofia + Nimbus
**Consultar:** `07_ISLAND_PAGES/` cada arquivo correspondente
**Critério:** Visual idêntico aos mockups correspondentes

---

### FRONT-KIMI-12 — Visual QA Final
**Objetivo:** Comparar cada tela com seu mockup. Gerar relatório de divergências.
**Consultar:** `11_VALIDATION/VISUAL_QA_CHECKLIST.md`
**Saída:** Lista de OK / AJUSTE LEVE / DIVERGÊNCIA / BLOQUEANTE por componente

---

## REGRA DE OURO

> Cada microfase termina com: `npm run build` (0 erros) + `python -m pytest -q` (128 passes) + commit documentado.

Se quebrar o build → REVERTER imediatamente. Não tentar consertar em cima.
