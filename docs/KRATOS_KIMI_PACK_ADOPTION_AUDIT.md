# KRATOS KIMI PACK ADOPTION AUDIT

**Data:** 2026-05-14 | **Aba:** 2 — Kimi Planning | **Status:** CONCLUÍDO

---

## 1. Estado Visual Atual

### O que funciona bem
- Visual shell 1.0 presente: sidebar, topbar, mundo de ilhas, Aurora panel, dock inferior
- 172 tokens CSS em `kratos-tokens.css`
- 6 chips de status com `color-mix()` (P1-A aplicado)
- Live telemetry vinculado ao MissionBar via `useLiveKratos.ts`
- CheckpointSuggestionBanner funcional
- SourceBadge indicando origem dos dados
- Build: 61 módulos, 0 erros TypeScript

### O que está fraco
- **~50 rgba/hex hardcoded** em `index.css` (sombras, glows, gradientes, mundo 3D) — P1-C pendente
- **Ilhas internas sem páginas** — clicar em ilha não revela conteúdo temático
- **AuroraPanel minimalista** — sem os componentes visuais ricos da spec Kimi (AuroraOrb, AuroraSignalCard)
- **HUD funcional mas genérico** — falta identidade por ilha, falta alma Nintendo
- **Sem responsividade mobile** — layout só funciona em desktop 16:9
- **Sem shimmer no LoadingSkeleton** — carga parece estática
- **Dock inferior simples** — sem slots dinâmicos por rota

---

## 2. Fontes Kimi Encontradas

### ZIPs extraídos
| ZIP | Local |
|-----|-------|
| `KRATOS_KIMI_ORGANIZADO_PARA_CLAUDE.zip` | `_k_tmp_kimi_import/` |
| `KRATOS_KIMI_FRONTEND_PACK_V1_COMPILED.zip` | `_k_tmp_kimi_import/` |
| `KRATOS_KIMI_FRONTEND_PACK_V1.zip` | `_k_tmp_kimi_import/` |
| `KRATOS_KIMI_FRONTEND_PACK_V1 (1).zip` | `_k_tmp_kimi_import/` |

### Docs copiados para `docs/kimi/` (55 arquivos)
| Pasta | Conteúdo | Status |
|-------|----------|--------|
| `00_inbox_original/` | README executivos (technical + visual) | Referência histórica |
| `01_visual_bible/` | VISUAL_BIBLE, DESIGN_TOKENS, UI_PRINCIPLES, ANTI_SAAS_RULES (+ variantes _technical/_visual) | Fonte canônica |
| `02_execution/original_roadmap/` | CLAUDE_EXECUTION_ORDER, FILE_TARGET_MAP, ISLAND_CONFIG, ROADMAP_MICROFASES | Guia de execução |
| `02_execution/original_prompts/` | 8 prompts FRONT_KIMI_00 a 07 + MICROFASE_PROMPTS | Templates |
| `02_execution/original_adoption_log/` | KIMI_ADOPTION_LOG.md | Template |
| `03_component_reference/island_pages/` | AkashaGringottsPage, OmnisLabPage, AllOtherIslands (.md) | Specs conceituais |
| `04_motion_reference/` | motionVariants.ts, performanceRules, reducedMotionRules | Referência (NÃO importar) |
| `05_validation/` | ACCEPTANCE_CHECKLIST, CRITERIA, BUILD_CHECKLIST, SCREENSHOT, VISUAL_QA | Checklists |
| `07_raw_large_specs/` | kratos_visualspec4.md, visual_spec5.md, KIMI_CODIGOS_ORGANIZADO.md | Raw specs (318KB+) |
| Raiz | README, KIMI_EXECUTION_ROADMAP, KIMI_COMPONENT_MAP, KIMI_ADOPTION_LOG, KIMI_NEXT_MICROPHASE, KIMI_CODE_RAW | Orquestração |

### Imagens copiadas para `frontend/public/references/kimi/` (9 PNGs)
| Imagem | Ilha |
|--------|------|
| `01_AKASHA_GRINGOTTS.png` | Akasha / Gringotts |
| `02_OMNIS_LAB.png` | OMNIS Lab |
| `03_AGENCIA_ESTUDIO_V2.png` | Agência / Estúdio v2 |
| `04_AGENCIA_ESTUDIO_V1.png` | Agência / Estúdio v1 |
| `05_NIMBUS_ACADEMY.png` | Nimbus Academy |
| `06_VISAO_GERAL_MAPA.png` | Visão Geral / Mapa |
| `07_FILOSOFIA_SABEDORIA.png` | Filosofia & Sabedoria |
| `08_VILA_VIVA.png` | Vila Viva |
| `09_OBSERVATORIO.png` | Observatório |

---

## 3. O Que Já Foi Adotado

### P1-A — Visual Consistency Fixes ✅
- Commit `0577f35`: 11 rgba → color-mix em AuroraPanel.tsx + index.css

### P1-D — UI Primitives Novos ✅ (parcialmente adotado)
| Componente | Arquivo | Estado |
|-----------|---------|--------|
| EmptyState | `components/ui/EmptyState.tsx` | Existe |
| ErrorState | `components/ui/ErrorState.tsx` | Existe |
| ProgressRing | `components/ui/ProgressRing.tsx` | Existe |
| MetricBadge | `components/ui/MetricBadge.tsx` | Existe |
| SectionTitle | `components/ui/SectionTitle.tsx` | Existe |
| Barrel export | `components/ui/index.ts` | Existe |

### P2-B — Mobile / Onboarding ✅ (parcialmente adotado)
| Componente | Arquivo | Estado |
|-----------|---------|--------|
| IslandMiniCard | `components/world/IslandMiniCard.tsx` | Existe |
| WorldMapLegend | `components/world/WorldMapLegend.tsx` | Existe |

### Componentes originais (NÃO Kimi — anteriores)
Todos os componentes world map, HUD, shell, aurora, layout, hooks originais do KRATOS 1.0 permanecem intactos.

---

## 4. O Que AINDA NÃO Foi Adotado

### Visual Bible
- Filosofia visual (Missão em 10s, Mundo Vivo, Neurocompatibilidade) — **não aplicada sistematicamente**
- 7 princípios inegociáveis — **não verificados contra o front atual**
- Z-index hierarchy — **não auditada no index.css atual**

### Design Tokens (gap Kimi → KRATOS)
- Tokens Kimi usam formato Tailwind v3 (`kratos.ocean.deep`) → KRATOS usa CSS custom properties (`--kr-ocean-deep`)
- Paleta de cores por ilha existe no Kimi mas **não mapeada** para tokens `--kr-*`
- Shadows (`shadow-kratos-glass`, `glow-omnis`, etc.) — **não existem como tokens**
- Motion keyframes (`float-slow`, `cloud-drift`, `pulse-glow`) — **podem já existir em index.css, precisam auditoria**

### Safe Primitives (Kimi → adaptação pendente)
- StatusChip do Kimi — **não unificado** com `.kr-chip-*` existentes
- GlassPanel do Kimi — **não usado** (já existe `.kr-glass-panel`)

### World Map Components (Kimi → NÃO USAR)
Todos os 6 componentes world map do Kimi (OceanBackdrop, FloatingIsland, CentralCastleMission, IslandBridge, CloudLayer, IslandLabel) **já existem no repo** com implementação superior. Kimi só serve como referência visual.

### HUD Components (Kimi → NÃO USAR)
KratosTopHud, KratosSidebar, KratosBottomDock, MissionBar, SquadDock, StatusBarDock do Kimi **já existem no repo**. Kimi só serve como referência para polish.

### Aurora Components (Kimi → adaptar com cuidado)
| Componente Kimi | Estado no KRATOS |
|-----------------|-----------------|
| AuroraPanel | Já existe — Kimi é referência para upgrade |
| AuroraOrb | Não existe — útil para P4 |
| AuroraSignalCard | Não existe — útil para P4 |
| CheckpointSuggestionVisual | Já existe como CheckpointSuggestionBanner |

### Island Pages (NÃO adotado)
| Página Kimi | Estado | Código Kimi |
|-------------|--------|-------------|
| OmnisLabPage | Spec .md disponível | Usa Framer Motion, hex inline |
| AkashaGringottsPage | Spec .md disponível | Conceitual |
| AkashaVaultPage | .tsx no pack | Usa Framer Motion |
| AgenciaStudioPage | .tsx no pack | Usa Framer Motion |
| ArenaComercialPage | .tsx no pack | Spec |
| ForjaCorpoPage | .tsx no pack | Spec |
| ObservatorioPage | .tsx no pack | Spec |
| Todas as outras | AllOtherIslands.md | Specs conceituais |

### Motion Rules (NÃO adotado)
- `motionVariants.ts` — **NÃO usar** (depende de Framer Motion)
- `performanceRules.md` — **não aplicado**
- `reducedMotionRules.md` — **parcialmente** (já existe em index.css)

### Validation Checklists (NÃO executado)
- ACCEPTANCE_CHECKLIST — **não preenchido**
- VISUAL_QA_CHECKLIST — **não preenchido**
- BUILD_CHECKLIST — **não verificado**
- SCREENSHOT_REQUIREMENTS — **não aplicável** (sem Playwright)

---

## 5. O Que Pode Ser Adotado Com Segurança Agora

### P0 — Obrigatório (dívida técnica)
| Item | Fonte Kimi | Ação |
|------|-----------|------|
| **P1-C: CSS Token Completion** | `KIMI_NEXT_MICROPHASE.md` | Tokenizar ~50 rgba/hex em index.css |
| **Auditar tokens existentes** | `DESIGN_TOKENS.md` | Comparar 172 tokens atuais com paleta Kimi |

### P1 — Importante (valor visual imediato)
| Item | Fonte Kimi | Ação |
|------|-----------|------|
| **Shimmer no LoadingSkeleton** | `KIMI_EXECUTION_ROADMAP.md` (P2-A) | CSS keyframes puro |
| **SectionTitle com action/divider** | Spec Kimi | Props aditivas (não quebrar existente) |
| **StatusChip unificado** | Kimi StatusChip spec | Mapear estados Kimi → `.kr-chip-*` |

### P2 — Polish (diferenciação)
| Item | Fonte Kimi | Ação |
|------|-----------|------|
| **AuroraOrb** | `06_AURORA_COMPONENTS/AuroraOrb.tsx` | Componente visual puro, CSS apenas |
| **AuroraSignalCard** | `06_AURORA_COMPONENTS/AuroraSignalCard.tsx` | Cards de sinal no RightRail |
| **WorldMapLegend** | Já existe em `components/world/` | Verificar integração |
| **IslandMiniCard** | Já existe em `components/world/` | Verificar integração |
| **Island Pages skeleton** | `03_component_reference/island_pages/` | Criar páginas mínimas (sem Framer) |

---

## 6. O Que NÃO Pode Ser Usado Diretamente

### Bloqueios absolutos (NUNCA importar)
| Material | Motivo |
|----------|--------|
| `10_DO_NOT_USE_DIRECTLY/duplicated_components/` | Duplicam GlassPanel, FloatingIsland, etc. |
| `10_DO_NOT_USE_DIRECTLY/full_layout_attempts/` | Reescrevem Layout.tsx inteiro |
| `10_DO_NOT_USE_DIRECTLY/full_worldmap_attempts/` | Reescrevem KratosWorldMap.tsx inteiro |
| `10_DO_NOT_USE_DIRECTLY/risky_backend_touching_code/` | Tocam em backend |
| `04_motion_reference/motionVariants.ts` | Depende de Framer Motion (não instalado) |
| Qualquer `.tsx` do Kimi com `motion.div` | Framer Motion não instalado |
| Qualquer `.tsx` do Kimi com `import { cn }` | `@/lib/utils` não existe |
| Qualquer `.tsx` do Kimi com `cva` / `VariantProps` | `class-variance-authority` não instalado |
| Qualquer `.tsx` do Kimi com ícones Lucide | `lucide-react` não instalado |
| Hex inline do Kimi (`#7C3AED`, `#F97316`, etc.) | Devem virar `var(--kr-*)` |

### Dependências que o Kimi assume (NÃO INSTALAR sem autorização)
| Dependência | Uso no Kimi | Alternativa no KRATOS |
|-------------|-------------|----------------------|
| `framer-motion` | `motion.div`, `animate`, `whileHover` | CSS transitions/animations |
| `class-variance-authority` | `cva()`, `VariantProps` | Classes condicionais simples |
| `clsx` / `cn()` | `cn("base", condition && "variant")` | Template literals |
| `lucide-react` | Ícones `<Bot>`, `<AlertTriangle>` | Unicode chars + TODO SVG |

---

## 7. Mapa Kimi → Front Atual

| Material Kimi | Arquivo Fonte | Destino Provável | Ação | Risco |
|---------------|---------------|------------------|------|------|
| CSS Token Completion | `KIMI_NEXT_MICROPHASE.md` | `styles/kratos-tokens.css`, `index.css` | EXECUTAR P1-C | 🟢 |
| Paleta de cores por ilha | `DESIGN_TOKENS.md` | `styles/kratos-tokens.css` | ADAPTAR nomes → `--kr-*` | 🟢 |
| Shadow tokens | `DESIGN_TOKENS.md` | `styles/kratos-tokens.css` | CRIAR `--kr-shadow-*` | 🟢 |
| Glow tokens | `DESIGN_TOKENS.md` | `styles/kratos-tokens.css` | CRIAR `--kr-glow-*` | 🟢 |
| Motion keyframes | `DESIGN_TOKENS.md` | `index.css` | AUDITAR (podem já existir) | 🟢 |
| LoadingSkeleton shimmer | `KIMI_EXECUTION_ROADMAP.md` P2-A | `LoadingSkeleton.tsx`, `index.css` | ADICIONAR CSS | 🟡 |
| SectionTitle action/divider | Kimi spec | `ui/SectionTitle.tsx` | ADICIONAR props | 🟡 |
| AuroraOrb | `AuroraOrb.tsx` (Kimi) | `components/aurora/AuroraOrb.tsx` | CRIAR (CSS puro) | 🟡 |
| AuroraSignalCard | `AuroraSignalCard.tsx` (Kimi) | `components/aurora/AuroraSignalCard.tsx` | CRIAR (CSS puro) | 🟡 |
| HolographicCore | `OmnisLabPage.md` | `components/islands/omnis/HolographicCore.tsx` | CRIAR (sem Framer) | 🟡 |
| OmnisLabPage | `OmnisLabPage.md` | `pages/OmnisLabPage.tsx` | CRIAR skeleton | 🟡 |
| AkashaVaultPage | `AkashaVaultPage.tsx` (Kimi) | `pages/AkashaVaultPage.tsx` | CRIAR skeleton | 🟡 |
| VISUAL_BIBLE filosofia | `VISUAL_BIBLE.md` | N/A (guia conceitual) | LER antes de qualquer P3+ | 🟢 |
| ANTI_SAAS_RULES | `ANTI_SAAS_RULES.md` | N/A (guia conceitual) | LER antes de qualquer UI | 🟢 |
| Z-index hierarchy | `VISUAL_BIBLE.md` §4 | `index.css` | AUDITAR contra atual | 🟢 |
| VISUAL_QA_CHECKLIST | `05_validation/` | N/A (checklist) | EXECUTAR após P4 | 🟢 |
| GlassPanel (Kimi) | `03_SAFE_PRIMITIVES/GlassPanel.tsx` | NÃO USAR | Já existe `.kr-glass-panel` | 🔴 |
| FloatingIsland (Kimi) | `04_WORLD_MAP/` | NÃO USAR | Já existe | 🔴 |
| CentralCastleMission (Kimi) | `04_WORLD_MAP/` | NÃO USAR | Já existe | 🔴 |
| KratosWorldMap (Kimi) | `04_WORLD_MAP/` | NÃO USAR | Já existe | 🔴 |
| motionVariants.ts (Kimi) | `04_motion_reference/` | NÃO USAR | Framer Motion não instalado | 🔴 |

---

## 8. Plano Executor Para Aba 1

### Microfase K-P1-C — CSS Token Completion (PRÓXIMA)

**Objetivo:** Tokenizar ~50 rgba/hex restantes em `index.css`. Criar tokens de sombra, glow e gradiente em `kratos-tokens.css`. Zero lógica, zero componentes novos.

**Arquivos permitidos:**
- `frontend/src/styles/kratos-tokens.css` — adicionar tokens no final
- `frontend/src/index.css` — substituir rgba/hex por `var(--kr-*)`

**Arquivos proibidos:**
- Qualquer `.tsx`
- `backend/`
- `hooks/`
- `package.json`

**Componentes Kimi de referência:**
- `docs/kimi/01_visual_bible/DESIGN_TOKENS.md` — paleta de cores, shadows, glows
- `docs/kimi/01_visual_bible/VISUAL_BIBLE.md` — z-index hierarchy

**Critério de aceite:**
- `npm run build` → 0 errors
- `git diff HEAD -- backend/` → vazio
- `git diff --stat` → máximo 2 arquivos
- Nenhum `.tsx` alterado

---

### Microfase K-P2-A — LoadingSkeleton Shimmer + SectionTitle

**Objetivo:** Adicionar shimmer animation ao LoadingSkeleton + props aditivas ao SectionTitle.

**Arquivos permitidos:**
- `frontend/src/components/LoadingSkeleton.tsx` — adicionar shimmer
- `frontend/src/components/ui/SectionTitle.tsx` — adicionar props action/divider
- `frontend/src/index.css` — adicionar `.kr-skeleton-shimmer`

**Arquivos proibidos:**
- `backend/`, `hooks/`, `package.json`
- NÃO reescrever componentes existentes (apenas adicionar)

**Critério de aceite:**
- `npm run build` → 0 errors
- LoadingSkeleton existente mantém comportamento
- SectionTitle existente mantém comportamento sem novas props
- Shimmer visível (dev server)

---

### Microfase K-P3-A — Aurora Components (Orb + SignalCard)

**Objetivo:** Criar AuroraOrb e AuroraSignalCard com CSS puro (sem Framer Motion).

**Arquivos permitidos (NOVOS):**
- `frontend/src/components/aurora/AuroraOrb.tsx`
- `frontend/src/components/aurora/AuroraSignalCard.tsx`
- `frontend/src/index.css` — classes `.kr-aurora-orb`, `.kr-aurora-signal`

**Arquivos proibidos:**
- NÃO alterar `AuroraPanel.tsx` existente (só integrar depois)
- `backend/`, `hooks/`, `package.json`

**Componentes Kimi de referência:**
- `KRATOS_KIMI_FRONTEND_PACK_V1_COMPILED/06_AURORA_COMPONENTS/AuroraOrb.tsx`
- `KRATOS_KIMI_FRONTEND_PACK_V1_COMPILED/06_AURORA_COMPONENTS/AuroraSignalCard.tsx`

**Adaptações obrigatórias:**
- Remover `motion.div` → CSS transitions
- Hex inline → `var(--kr-*)`
- `any` → interfaces tipadas

**Critério de aceite:**
- `npm run build` → 0 errors
- 2 componentes renderizam no dev server
- Zero dependências novas

---

### Microfase K-P3-B — Island Page Skeletons (OMNIS + Akasha)

**Objetivo:** Criar páginas mínimas para ilhas OMNIS Lab e Akasha Vault. Estrutura com header temático + grid de placeholders. Sem Framer Motion. Sem integração com backend.

**Arquivos permitidos (NOVOS):**
- `frontend/src/pages/OmnisLabPage.tsx`
- `frontend/src/pages/AkashaVaultPage.tsx`
- `frontend/src/components/islands/omnis/HolographicCore.tsx` (CSS puro)
- `frontend/src/index.css` — classes temáticas OMNIS + Akasha

**Arquivos proibidos:**
- NÃO alterar rotas em `App.tsx` (só adicionar depois de validado)
- `backend/`, `hooks/`, `package.json`

**Componentes Kimi de referência:**
- `docs/kimi/03_component_reference/island_pages/OmnisLabPage.md`
- `docs/kimi/03_component_reference/island_pages/AkashaGringottsPage.md`

**Critério de aceite:**
- `npm run build` → 0 errors
- Páginas renderizam com header + grid de cards vazios
- Cores temáticas por ilha (violeta/ciano OMNIS, esmeralda/ouro Akasha)
- Zero Framer Motion, zero hex inline

---

### Microfase K-P4 — Visual QA + Checklist

**Objetivo:** Executar o VISUAL_QA_CHECKLIST.md contra o front atual. Documentar gaps. Gerar relatório de QA.

**Arquivos permitidos:**
- Nenhum — somente leitura e documentação

**Ações:**
1. Abrir frontend no dev server
2. Preencher cada item do checklist como OK / Ajuste / Divergência / Bloqueante
3. Tirar screenshots de cada seção
4. Gerar `docs/KRATOS_VISUAL_QA_REPORT.md`

**Critério de aceite:**
- 12 itens do checklist preenchidos
- Screenshots salvos em `frontend/public/references/screenshots/`
- Relatório gerado

---

## 9. Prompt Executor Para Aba 1 (K-P1-C)

```
═══ ABA 1 — EXECUTOR K-P1-C ═══

CONTEXTO: Branch feature/kratos-1-visual-shell.
P1-A ✅ | ui/ e world/ components ✅ | P1-C é a próxima.

LEIA ANTES DE EXECUTAR:
- docs/kimi/KIMI_EXECUTION_ROADMAP.md
- docs/kimi/01_visual_bible/DESIGN_TOKENS.md
- docs/kimi/01_visual_bible/VISUAL_BIBLE.md (z-index hierarchy)
- docs/kimi/01_visual_bible/ANTI_SAAS_RULES.md

REGRAS ABSOLUTAS:
- NÃO tocar backend/
- NÃO tocar hooks/
- NÃO tocar componentes .tsx
- NÃO instalar dependências
- NÃO usar Framer Motion
- NÃO usar git add .

EXECUTAR P1-C:

PASSO 1 — AUDITAR rgba/hex em index.css
Liste todos os rgba() e hex que NÃO usam var(--kr-*).
Ignore scrollbar e high-contrast (#ccc, #999, #fff).

PASSO 2 — AGRUPAR por categoria
- Sombras: rgba(0,0,0,X) → --kr-shadow-*
- Glows coloridos: rgba(R,G,B,0.X) → --kr-glow-*
- Gradientes: rgba em linear-gradient → --kr-gradient-*
- Outros: cores sólidas → tokens existentes ou novos

PASSO 3 — CRIAR tokens em kratos-tokens.css
Adicionar ao final do arquivo, com comentário "K-P1-C shadow/glow/gradient tokens".
Usar nomes semânticos: --kr-shadow-card, --kr-glow-aurora, --kr-gradient-ocean.

PASSO 4 — SUBSTITUIR no index.css
Cada rgba/hex pelo var(--kr-*) correspondente.

PASSO 5 — VALIDAR
- npm run build → deve dar 0 errors
- git diff HEAD -- backend/ → deve ser vazio
- git diff --stat → máximo 2 arquivos (tokens.css + index.css)
- Nenhum .tsx na lista de diff

PASSO 6 — GERAR RELATÓRIO
Criar docs/KRATOS_FRONTEND_P1C_TOKEN_COMPLETION_REPORT.md
com lista de tokens criados, substituições feitas, build result.

PASSO 7 — PARAR
NÃO commitar. Reportar "K-P1-C PRONTO PARA COMMIT".
```

---

## 10. Veredito

| Pergunta | Resposta |
|----------|----------|
| **Podemos aplicar Kimi Pack?** | SIM, mas com disciplina. Kimi é referência, não código-fonte. Cada componente precisa de adaptação para CSS puro + tokens `--kr-*`. |
| **Por onde começar?** | **K-P1-C — CSS Token Completion.** É a dívida mais antiga, risco zero (só CSS), e desbloqueia todas as fases seguintes. |
| **Qual o risco?** | 🟢 BAIXO para P1-C. O risco sobe para 🟡 em P3+ quando mexemos em componentes existentes ou criamos páginas internas. Risco 🔴 só se alguém importar código Kimi bruto sem adaptação. |
| **O que NUNCA fazer?** | Importar .tsx do Kimi diretamente. Usar Framer Motion. Reescrever componentes que já existem. Tocar em backend. |
| **O front atual está utilizável?** | SIM. Visual shell funcional, build limpo, dados live. Mas ainda não é o "KRATOS Supremo" — falta a alma visual das ilhas internas e o polish de Aurora/HUD que o Kimi especificou. |

**K-P1-C autorizado. Aba 1 pode executar.**
