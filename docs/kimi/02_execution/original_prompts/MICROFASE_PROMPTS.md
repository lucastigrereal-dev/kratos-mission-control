# PROMPTS PARA CLAUDE CODE — KRATOS Frontend Microfases

Cada arquivo abaixo é um prompt pronto para colar no Claude Code dentro do repositório KRATOS.
Copie e cole o prompt correspondente à microfase que você quer executar.

---

## FRONT-KIMI-01 — AUDIT DO ESTADO ATUAL

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-01 — AUDIT DO ESTADO ATUAL

Contexto:
O KRATOS já tem shell visual implementado (commits 05a4eaa + c2edc94).
Precisamos mapear o que existe vs. o que as specs definem.

Objetivo:
Criar inventário completo do frontend atual e identificar gaps.

REGRAS:
- NÃO alterar nenhum arquivo de código.
- NÃO alterar backend.
- NÃO commitar ainda.
- Esta microfase é APENAS documentação.

Tarefas:
1. Listar todos os arquivos em frontend/src/components/
2. Para cada componente, verificar se existe versão no pack docs/kimi/03_SAFE_PRIMITIVES/
3. Identificar componentes EXISTENTES que precisam de polish vs. componentes que FALTAM
4. Listar as 11 ilhas e verificar quais têm página implementada
5. Verificar se tailwind.config.ts tem os tokens do pack docs/kimi/01_VISUAL_BIBLE/VISUAL_BIBLE.md
6. Verificar se framer-motion está no package.json

Gerar relatório:
docs/kimi/AUDIT_REPORT.md

Com tabelas:
| Componente | Existe? | Precisa Polish? | Falta Criar? | Prioridade |
| Ilha | Página existe? | Status |
| Token | No tailwind.config? |

Veredito brutal:
- O que está mais perto do mockup?
- O que está mais longe?
- Qual é a microfase mais urgente depois dessa?
```

---

## FRONT-KIMI-02 — DESIGN TOKENS + MOTION

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-02 — DESIGN TOKENS + MOTION SYSTEM

Contexto:
Precisamos garantir que todos os tokens do KRATOS estão no tailwind.config.ts
e criar o sistema de motion.

Objetivo:
1. Sincronizar tailwind.config.ts com VISUAL_BIBLE.md seção 5
2. Criar src/motion/variants.ts
3. Criar src/hooks/useReducedMotion.ts

REGRAS:
- NÃO alterar backend.
- NÃO alterar SSE, Mission Lens, useLiveKratos.
- NÃO instalar framer-motion ainda (apenas preparar o arquivo comentado).
- Rodar build ao final.

Arquivos de referência:
- docs/kimi/01_VISUAL_BIBLE/VISUAL_BIBLE.md (seção 5 — todos os tokens)
- docs/kimi/08_MOTION_SYSTEM/motionVariants.ts

Tarefas:
1. Ler tailwind.config.ts atual
2. Comparar com tokens do VISUAL_BIBLE.md
3. Adicionar tokens faltantes (cores por ilha, sombras, keyframes, animations)
4. Criar frontend/src/motion/variants.ts com CSS_MOTION exportado
5. Criar frontend/src/hooks/useReducedMotion.ts
6. Rodar: cd frontend && npm run build

Relatório final:
- Quantos tokens foram adicionados?
- Build passou? Sim/Não
- Testes backend: python -m pytest -q
- O que ficou faltando (se houver)?

Veredito: PASSOU ou FALHOU
```

---

## FRONT-KIMI-03 — UI PRIMITIVES

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-03 — UI PRIMITIVES

Contexto:
KRATOS precisa de uma biblioteca de primitives para que todas as ilhas
usem os mesmos componentes base (sem reinventar glassmorphism em cada página).

Objetivo:
Criar/atualizar os UI primitives em frontend/src/components/ui/

REGRAS:
- NÃO alterar backend.
- NÃO instalar CVA (class-variance-authority) sem verificar package.json primeiro.
- NÃO duplicar componentes que já existem com boa implementação.
- Comparar com existente ANTES de criar.
- Rodar build ao final.

Arquivos de referência:
- docs/kimi/03_SAFE_PRIMITIVES/GlassPanel.tsx
- docs/kimi/03_SAFE_PRIMITIVES/ProgressRing.tsx
- docs/kimi/03_SAFE_PRIMITIVES/UIComponents.tsx (MetricBadge, EmptyState, ErrorState, StatusChip, IslandMiniCard)

Tarefas:
1. Para cada arquivo em docs/kimi/03_SAFE_PRIMITIVES/:
   a. Verificar se componente já existe em frontend/src/components/ui/
   b. Se existe: comparar e fazer patch mínimo necessário
   c. Se não existe: criar baseado no arquivo de referência
2. Criar/atualizar:
   - GlassPanel.tsx
   - ProgressRing.tsx
   - MetricBadge.tsx + MetricBadgeV2.tsx
   - EmptyState.tsx
   - ErrorState.tsx
   - StatusChip.tsx
   - IslandMiniCard.tsx
3. Rodar: cd frontend && npm run build
4. Rodar: python -m pytest -q

Não criar:
- KratosCard (verificar se já existe — pode ser o LoadingSkeleton que usa GlassPanel)
- SectionTitle (simples — inline se não existir)

Relatório final:
- Lista de arquivos criados/atualizados
- Build: PASSOU/FALHOU
- Testes: X/128
- Riscos identificados
```

---

## FRONT-KIMI-04 — WORLD MAP POLISH

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-04 — WORLD MAP POLISH

Contexto:
O WorldMap já existe (commit 05a4eaa). Precisamos polir e alinhar
com o mockup 06_VISAO_GERAL_MAPA.png.

Objetivo:
Refinar os componentes do mundo sem recriar o que já funciona.

REGRAS:
- NÃO recriar KratosWorldMap do zero.
- NÃO alterar useLiveKratos.
- NÃO alterar SSE/backend.
- NÃO usar Three.js.
- Comparar com mockup antes de qualquer mudança.

Arquivos de referência:
- docs/kimi/04_WORLD_MAP_COMPONENTS/WorldMapComponents.tsx
- docs/kimi/02_IMPLEMENTATION_ROADMAP/ISLAND_CONFIG.ts
- docs/kimi/00_VISUAL_REFERENCES/images/06_VISAO_GERAL_MAPA.png (mockup visual)

Tarefas:
1. Ler frontend/src/components/KratosWorldMap.tsx atual
2. Comparar com mockup e identificar divergências
3. Aplicar patches:
   a. FloatingIsland: adicionar hover scale + glow temático
   b. CentralCastleMission: verificar banner de missão HTML (vs. componente atual)
   c. CloudLayer: verificar animação cloud-drift ativa
   d. IslandLabel: criar se não existir
4. Verificar posicionamento das ilhas vs. ISLAND_CONFIG.ts
5. Rodar build + testes

Relatório:
- Comparação antes/depois por componente
- Divergências identificadas vs. mockup
- O que ficou dentro vs. fora do escopo dessa microfase
```

---

## FRONT-KIMI-05 — HUD POLISH

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-05 — HUD POLISH

Contexto:
Shell visual existe. Precisamos garantir que o BottomDock
mostra Missão Atual + Próxima Ação em todas as rotas.

Objetivo:
Refinar TopHud, Sidebar e BottomDock. Criar StatusBarDock, SquadDock, AudioPlayer.

REGRAS:
- NÃO alterar useLiveKratos.
- NÃO alterar endpoints.
- SourceBadge deve permanecer visível.
- Sidebar: 12 itens em ordem fixa conforme ISLAND_CONFIG.ts SIDEBAR_ORDER.

Arquivos de referência:
- docs/kimi/05_HUD_COMPONENTS/ (todos os arquivos)
- docs/kimi/02_IMPLEMENTATION_ROADMAP/ISLAND_CONFIG.ts (SIDEBAR_ORDER)

Tarefas:
1. Verificar KratosTopHud: Energia + XP + Nível + Relógio presentes?
2. Verificar KratosSidebar: 12 itens em ordem fixa + highlight temático ativo?
3. Criar/Atualizar KratosBottomDock como slot container
4. Criar StatusBarDock (Missão + Foco + Próxima Ação + Squad + Player)
5. Criar SquadDock (avatar stack)
6. Criar AudioPlayer (track + play/pause + skip) — dados mock
7. Rodar build + testes

Critério de aceite:
- Em qualquer rota, BottomDock mostra missão atual
- Sidebar tem highlight da rota ativa com cor temática da ilha
```

---

## FRONT-KIMI-07 — ISLAND: OMNIS LAB

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-07 — ISLAND: OMNIS LAB

Objetivo:
Implementar a página do OMNIS Lab com visual idêntico ao mockup.

Arquivos de referência:
- docs/kimi/07_ISLAND_PAGES/OmnisLabPage.md (spec completa + código)
- docs/kimi/00_VISUAL_REFERENCES/images/02_OMNIS_LAB.png (mockup)

REGRAS:
- NÃO executar automações reais.
- Dados são mock — não conectar ao OMNIS real ainda.
- NÃO alterar backend, endpoints, useLiveKratos.
- Uma ilha por microfase.

Tarefas:
1. Criar frontend/src/pages/OmnisPage.tsx (ou verificar se existe)
2. Criar components/islands/omnis/:
   - HolographicCore.tsx (com CSS fallback se framer não instalado)
   - TechPanel.tsx
   - AgentList.tsx (mock data)
   - AutomationList.tsx (mock data)
   - IntegrationGrid.tsx (mock data)
   - SystemHealth.tsx
   - EconomyCounter.tsx
3. Criar OmnisRightRail.tsx
4. Configurar BottomDock para perfil OMNIS (AudioPlayer + EconomyCounter + SystemHealth + IntegrationGrid)
5. Rodar build + testes

Critério de aceite:
- Visual idêntico ao mockup 02_OMNIS_LAB.png
- HolographicCore visível e animando (ou fallback CSS)
- AgentList com 5 agentes e status dots
- IntegrationGrid com 7 ícones
- Build: 0 erros | Testes: 128/128
```

---

## FRONT-KIMI-12 — VISUAL QA FINAL

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-12 — VISUAL QA FINAL

Objetivo:
Comparar cada tela implementada com seu mockup de referência.
Gerar relatório de divergências e classificar.

Tarefas:
1. Para cada ilha implementada:
   a. Identificar mockup correspondente em docs/kimi/00_VISUAL_REFERENCES/images/
   b. Comparar estrutura, layout e componentes visuais
   c. Classificar cada divergência:
      - ✅ OK — idêntico ou equivalente
      - ⚠️ AJUSTE LEVE — pequena diferença não crítica
      - ❌ DIVERGÊNCIA — diferença significativa a corrigir
      - 🚫 BLOQUEANTE — quebra a experiência, corrigir antes de release

2. Gerar: docs/kimi/12_ADOPTION_LOG/VISUAL_QA_FINAL_REPORT.md

3. Para cada BLOQUEANTE: gerar prompt de correção separado

Critério de aceite:
- Nenhum BLOQUEANTE sem plano de correção
- Maioria OK ou AJUSTE LEVE
- Relatório completo com screenshot path + classificação
```
