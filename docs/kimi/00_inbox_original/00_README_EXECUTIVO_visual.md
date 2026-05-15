# KRATOS KIMI FRONTEND PACK V1
## README EXECUTIVO — Fonte Canônica para Claude Code

**Versão:** 1.0 | **Data:** 2026-05-14 | **Status:** PRONTO PARA USO

---

## O QUE É ESSE PACK

Este pacote é a fonte canônica de referência visual e de código para o desenvolvimento frontend do **KRATOS Mission Control**.

Ele foi criado para que o **Claude Code** execute cada microfase com segurança, sem:
- Reinventar componentes já existentes
- Tocar no backend
- Instalar dependências sem autorização
- Duplicar arquitetura
- Transformar o KRATOS em dashboard SaaS genérico

---

## REGRA SUPREMA

> **O código deste pack é REFERÊNCIA, não ordem de execução direta.**
>
> Claude Code deve: ler → comparar com repo real → adaptar → validar build → registrar.

---

## ESTRUTURA DO PACK

| Pasta | Conteúdo | Quando usar |
|---|---|---|
| `00_VISUAL_REFERENCES/` | 9 mockups PNG + descrições visuais | Sempre. É a bíblia visual. |
| `01_VISUAL_BIBLE/` | Filosofia, tokens, anti-SaaS rules, princípios | Antes de qualquer microfase |
| `02_IMPLEMENTATION_ROADMAP/` | Ordem de microfases + mapa de arquivos | Planejamento de execução |
| `03_SAFE_PRIMITIVES/` | GlassPanel, ProgressRing, etc. prontos | FRONT-KIMI-03 |
| `04_WORLD_MAP_COMPONENTS/` | OceanBackdrop, FloatingIsland, Castle, etc. | FRONT-KIMI-04 |
| `05_HUD_COMPONENTS/` | TopBar, Sidebar, BottomDock, etc. | FRONT-KIMI-05 |
| `06_AURORA_COMPONENTS/` | AuroraPanel, AuroraOrb, etc. | FRONT-KIMI-06 |
| `07_ISLAND_PAGES/` | 11 ilhas completas com specs e código | FRONT-KIMI-07+ |
| `08_MOTION_SYSTEM/` | motionVariants.ts dual-mode | FRONT-KIMI-02 |
| `09_CLAUDE_PROMPTS/` | Prompts prontos por microfase | Execução de cada fase |
| `10_DO_NOT_USE_DIRECTLY/` | Lista de riscos e anti-patterns | Verificar ANTES de cada microfase |
| `11_VALIDATION/` | Checklists de build, visual QA e aceite | DEPOIS de cada microfase |
| `12_ADOPTION_LOG/` | Registro do que foi feito | Atualizar após cada microfase |

---

## STACK OFICIAL

```
React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion
```

**Framer Motion:** Será instalado. Criar fallback CSS para tudo.  
**CVA (class-variance-authority):** Pode ser adicionado. Verificar package.json antes de usar.  
**Three.js / R3F:** PROIBIDO na V1.  
**Pseudo-3D:** Via CSS, SVG, gradientes, sombras, blur, transform.

---

## ESTADO DO REPO (14/05/2026)

- **Branch:** `feature/kratos-1-visual-shell`
- **Último commit:** `c2edc94` (docs: frontend skills pack)
- **Anterior:** `05a4eaa` (feat: visual shell + island world)
- **Build:** 61 módulos, 0 erros
- **Testes:** 128/128 passando

**Componentes JÁ implementados (não recriar):**
- `KratosVisualShell.tsx`
- `KratosWorldMap.tsx`
- `FloatingIsland.tsx`
- `CentralCastleIsland.tsx`
- `IslandBridge.tsx`
- `KratosTopHud.tsx`
- `KratosSidebar.tsx`
- `KratosBottomDock.tsx`
- `KratosRightRail.tsx`
- `AuroraPanel.tsx`
- `MissionBar.tsx`
- `WorldClouds.tsx`
- `WorldOceanBackground.tsx`
- `LoadingSkeleton.tsx`
- `SourceBadge.tsx`

---

## REGRAS ABSOLUTAS

```
NÃO TOCAR:
- backend/
- /live/stream
- /live/snapshot
- /mission/lens
- Mission Lens v1
- useLiveKratos.ts
- SQLite schema
- endpoints existentes

PODE TOCAR:
- frontend/src/components/
- frontend/src/pages/
- frontend/src/styles/
- frontend/src/motion/
- docs/kimi/
```

---

## ORDEM DE EXECUÇÃO

```
FRONT-KIMI-01 → Audit do estado atual
FRONT-KIMI-02 → Tokens + Motion System
FRONT-KIMI-03 → UI Primitives (GlassPanel, ProgressRing, etc.)
FRONT-KIMI-04 → World Map Polish
FRONT-KIMI-05 → HUD Polish
FRONT-KIMI-06 → Aurora Panel Polish
FRONT-KIMI-07 → Islands: OMNIS Lab
FRONT-KIMI-08 → Islands: Akasha/Gringotts
FRONT-KIMI-09 → Islands: Agência/Estúdio
FRONT-KIMI-10 → Islands: Arena Comercial + Forja + Observatório + Tesouro
FRONT-KIMI-11 → Islands: Vila Viva + Filosofia + Nimbus
FRONT-KIMI-12 → Visual QA Final
```

---

**Gerado por:** Aurora Auditora | KRATOS KIMI Pack V1
