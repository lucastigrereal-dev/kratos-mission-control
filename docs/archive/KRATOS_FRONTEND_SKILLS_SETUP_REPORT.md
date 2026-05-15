# KRATOS Frontend Skills Setup Report

**Date:** 2026-05-14 | **Phase:** Preparação | **Status:** PRONTO PARA P1-A

---

## 1. Resumo da Auditoria

### Stack real detectada
| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Runtime | Node.js | — |
| Framework | React | ^18.3.1 |
| Bundler | Vite | ^5.4.11 |
| TypeScript | tsc | ~5.6.0 |
| CSS | Tailwind CSS | ^4.0.0 |
| Roteamento | react-router-dom | ^6.28.0 |
| Testes | Nenhum (sem Vitest, sem Playwright) | — |
| UI Lib | Nenhuma (sem shadcn, MUI, Chakra) | — |

### Arquivos de config
- `vite.config.ts` — plugin React + Tailwind, proxy `/api` → `127.0.0.1:5100`
- `tsconfig.json` — target ES2020, JSX react-jsx, strict mode, path alias `@/*`
- `package.json` — 3 dependências runtime, 6 devDependencies
- **NÃO existe** `tailwind.config.ts` (Tailwind v4 usa CSS-based config)
- **NÃO existe** Playwright
- **NÃO existe** Vitest/Jest

### Estrutura de diretórios
```
frontend/src/
├── components/     (16 arquivos — flat, sem subpastas)
├── pages/          (8 arquivos)
├── hooks/          (3 arquivos: useApi, useLiveKratos, useCheckpointSuggestion)
├── styles/         (2 arquivos: kratos-tokens.css, index.css)
├── App.tsx         (9 rotas)
├── main.tsx        (entry point)
└── vite-env.d.ts   (types)
```

### O que NÃO existe
- `src/components/ui/` — não existe
- `src/components/world/` — não existe
- `src/components/shell/` — não existe
- `.claude/` — não existia (criado nesta fase)
- `tailwind.config.ts` — não existe (Tailwind v4)
- `playwright.config.ts` — não existe
- Qualquer arquivo de teste no frontend

### Tokens KRATOS
- `styles/kratos-tokens.css` — 172 tokens (cores, vidro, ilhas, motion, z-index, spacing)
- `index.css` — ~1410 linhas com todas as classes do shell + mundo + animações + a11y
- Tokens usam prefixo `--kr-*`, organizados por categoria

### Componentes base existentes
- Shell grid (5 áreas) — `KratosVisualShell.tsx`
- Top HUD — `KratosTopHud.tsx`
- Sidebar — `KratosSidebar.tsx`
- Right Rail — `KratosRightRail.tsx`
- Bottom Dock — `KratosBottomDock.tsx`
- Orquestrador — `Layout.tsx`
- Mundo 3D — `KratosWorldMap.tsx` + 6 subcomponentes
- Aurora Panel — `AuroraPanel.tsx`
- MissionBar — `MissionBar.tsx`
- SourceBadge — `SourceBadge.tsx`
- CheckpointSuggestionBanner — `CheckpointSuggestionBanner.tsx`
- LoadingSkeleton — `LoadingSkeleton.tsx`

---

## 2. Árvore Relevante do Frontend

```
frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   ├── favicon.svg          (logo K raio roxo)
│   └── icons.svg            (ícones redes sociais — NÃO usados)
├── src/
│   ├── main.tsx             (entry point)
│   ├── App.tsx              (9 rotas)
│   ├── index.css            (1410 linhas — shell + mundo + a11y)
│   ├── vite-env.d.ts
│   ├── styles/
│   │   └── kratos-tokens.css (172 tokens)
│   ├── hooks/
│   │   ├── useApi.ts             (fetch genérico)
│   │   ├── useLiveKratos.ts      (SSE + polling) ⛔ PROTEGIDO
│   │   └── useCheckpointSuggestion.ts (POST /context/checkpoint)
│   ├── components/
│   │   ├── Layout.tsx            (orquestrador)
│   │   ├── KratosVisualShell.tsx (grid CSS)
│   │   ├── KratosTopHud.tsx      (top bar)
│   │   ├── KratosSidebar.tsx     (nav 8 itens)
│   │   ├── KratosRightRail.tsx   (Aurora + riscos)
│   │   ├── KratosBottomDock.tsx  (missão + squads)
│   │   ├── KratosWorldMap.tsx    (mundo 3D)
│   │   ├── FloatingIsland.tsx    (ilha individual)
│   │   ├── CentralCastleIsland.tsx
│   │   ├── IslandBridge.tsx      (pontes SVG)
│   │   ├── WorldOceanBackground.tsx
│   │   ├── WorldClouds.tsx
│   │   ├── AuroraPanel.tsx       (orbe + sinais)
│   │   ├── MissionBar.tsx        (progresso)
│   │   ├── SourceBadge.tsx       (fonte dos dados)
│   │   ├── CheckpointSuggestionBanner.tsx
│   │   └── LoadingSkeleton.tsx
│   └── pages/
│       ├── VisaoGeralPage.tsx    (mundo 3D)
│       ├── MissionLensPage.tsx   (9 blocos)
│       ├── TarefasPage.tsx       (lista tasks)
│       ├── ProjetosPage.tsx      (grid projetos)
│       ├── ContextoPage.tsx      (drift + checkpoint)
│       ├── SistemaPage.tsx       (coletores)
│       ├── CheckpointsPage.tsx   (lista checkpoints)
│       └── OmnisPage.tsx         (placeholder)
├── mock-data/
│   ├── now.json
│   ├── projects.json
│   ├── system.json
│   └── tasks.json
└── docs/
    ├── KRATOS_PHASE_0_8C_AUTO_CHECKPOINT_SUGGESTION_REPORT.md
    ├── architecture/
    │   └── KRATOS_OPERATING_MODEL.md
    └── product/
        └── KRATOS_COGNITIVE_CONTINUITY_SPEC.md
```

---

## 3. Skills Registradas

| # | Skill | Arquivo | Tier | Status |
|---|-------|---------|------|--------|
| 1 | kimi-to-code | `.claude/skills/kimi-to-code.md` | core | active |
| 2 | glass-panel-builder | `.claude/skills/glass-panel-builder.md` | core | active |
| 3 | island-composer | `.claude/skills/island-composer.md` | core | active |
| 4 | hud-assembler | `.claude/skills/hud-assembler.md` | core | active |
| 5 | token-enforcer | `.claude/skills/token-enforcer.md` | strategy | active |
| 6 | omnis-lab-builder | `.claude/skills/omnis-lab-builder.md` | strategy | placeholder |
| 7 | akasha-vault-builder | `.claude/skills/akasha-vault-builder.md` | strategy | placeholder |
| 8 | visual-qa-kimi | `.claude/skills/visual-qa-kimi.md` | analytics | active |
| 9 | motion-guardian | `.claude/skills/motion-guardian.md` | analytics | active |
| 10 | neuro-ux-checker | `.claude/skills/neuro-ux-checker.md` | analytics | active |

**Nota:** 2 skills do pack original (`omnis-agent-contracts`, `akasha-memory-contracts`) não foram registradas como markdown porque são contratos de API/backend, não skills de frontend. Elas pertencem à camada de integração, não ao escopo visual.

---

## 4. Riscos Encontrados

| Risco | Severidade | Descrição |
|-------|-----------|-----------|
| Duplicação de KratosWorldMap | 🔴 ALTO | Kimi pode gerar novo mundo 3D sem saber que já existe |
| Hex inline em componentes | 🟡 MÉDIO | Alguns componentes atuais usam `style={{ color: "#..." }}` — token-enforcer deve corrigir |
| `any` em TypeScript | 🟡 MÉDIO | Alguns casts usam `as Record<string, string>` — aceitável como transição, mas evitar em código novo |
| Blur + motion | 🟡 MÉDIO | `prefers-reduced-motion` zera durations mas não zera blur — verificar com motion-guardian |
| Icons.svg não usado | 🟢 BAIXO | O sprite SVG existe em `/public` mas não é referenciado por nenhum componente |
| Sem testes | 🟢 BAIXO | Frontend não tem testes automatizados. Microfases futuras devem incluir Playwright ou Vitest |

---

## 5. Arquivos Protegidos (NUNCA alterar)

| Arquivo/Módulo | Motivo |
|---------------|--------|
| `backend/**` | Regra absoluta 1 |
| `src/hooks/useLiveKratos.ts` | Contrato SSE + polling, testado |
| Endpoints: `/live/stream`, `/live/snapshot`, `/mission/lens`, `/context/current`, `/context/checkpoint` | Contratos canônicos |
| `src/components/KratosVisualShell.tsx` | Grid shell estável |
| `src/components/KratosWorldMap.tsx` | Mundo 3D estável |
| `src/components/Layout.tsx` | Orquestrador de dados (editar só com auditoria) |

---

## 6. Proposta da Próxima Microfase P1-A

**Nome:** P1-A — Token Cleanup + Glass Consistency

**Objetivo:** Garantir que TODO componente existente use tokens CSS (`var(--kr-*)`) e classes glassmorphism, eliminando hex inline e estilos inconsistentes.

**Escopo:**
1. Auditar todos os 16 componentes + 8 páginas por violações de token
2. Substituir `style={{ color: "#xxx" }}` por `var(--kr-*)` equivalente
3. Substituir `backdrop-filter: blur(Npx)` inline por classe `.glass-panel` ou tokens
4. Garantir que todo `.kr-card` e `.glass-panel` tenha contraste adequado
5. Adicionar fallback `prefers-reduced-motion` onde faltar

**NÃO inclusos em P1-A:**
- Criar componentes novos
- Alterar layout ou grid
- Adicionar features
- Mexer em ilhas ou mundo 3D

---

## 7. Lista Exata de Arquivos que P1-A Vai Tocar

| Arquivo | Ação | Risco |
|---------|------|-------|
| `src/components/AuroraPanel.tsx` | Substituir hex inline por tokens | Baixo |
| `src/components/CheckpointSuggestionBanner.tsx` | Verificar tokens (já OK, criado na 1.0B) | Nenhum |
| `src/components/KratosTopHud.tsx` | Verificar cores inline | Baixo |
| `src/components/KratosRightRail.tsx` | Verificar glass/cores | Baixo |
| `src/components/KratosBottomDock.tsx` | Verificar tokens | Baixo |
| `src/components/MissionBar.tsx` | Verificar tokens (já OK) | Nenhum |
| `src/components/SourceBadge.tsx` | Verificar tokens (já OK) | Nenhum |
| `src/pages/MissionLensPage.tsx` | Substituir hex inline por tokens | Médio |
| `src/pages/ContextoPage.tsx` | Substituir hex inline por tokens | Médio |
| `src/pages/TarefasPage.tsx` | Substituir hex inline por tokens | Médio |
| `src/pages/ProjetosPage.tsx` | Substituir hex inline por tokens | Médio |
| `src/pages/SistemaPage.tsx` | Substituir hex inline por tokens | Médio |
| `src/index.css` | Adicionar regras reduced-motion faltantes | Baixo |

**Total: 13 arquivos.** Nenhum componente criado. Nenhum backend tocado.

---

## 8. Comandos de Validação Recomendados

```bash
# 1. TypeScript check
cd frontend && npx tsc --noEmit

# 2. Build de produção
cd frontend && npm run build

# 3. Buscar hex inline restante (deve retornar zero resultados em componentes)
cd frontend && grep -rn "style.*#[0-9a-fA-F]" src/components/ src/pages/ || echo "ZERO — OK"

# 4. Buscar any em TypeScript (deve retornar zero em arquivos novos)
cd frontend && grep -rn ": any" src/components/ src/pages/ || echo "ZERO — OK"

# 5. Backend health (se disponível)
curl -s --connect-timeout 5 http://127.0.0.1:5100/live/snapshot | head -c 200

# 6. Verificar se build não cresceu (baseline: ~35KB CSS, ~205KB JS)
ls -la frontend/dist/assets/
```

---

*Documento gerado na fase de preparação. P1-A aguarda autorização explícita para execução.*
