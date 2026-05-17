# KRATOS — AUDITORIA BRUTAL DE ADERÊNCIA À IDEALIZAÇÃO

**Data:** 2026-05-15 | **Auditor:** Claude Code (code-only + UI audit context)
**Versão auditada:** `feature/kratos-kimi-supreme-zips-5waves` (merged PR #2, commit `2be496c`)

---

## REGRA ZERO: SEM PASSAR PANO

Esta auditoria não mede esforço. Não mede qualidade técnica. Não celebra o que foi feito.
**Mede aderência à visão.** Onde a visão está vs onde o código está.
Cada nota abaixo de 5 tem evidência concreta do código.

---

## A VISÃO (O Ideal — contra o qual tudo é medido)

```
KRATOS Mission Control NÃO É um dashboard.
É um MUNDO VIVO de ilhas/regiões flutuantes.
Apple-clean + Nintendo soul + sci-fi light.
Pseudo-3D / SVG / profundidade / parallax.

Cada módulo é uma REGIÃO com identidade própria:
HUB, OMNIS Lab, Akasha, Agência, Arena Comercial,
Observatório, Tesouro, Vila Viva, Forja, Nimbus.

Responde 6 perguntas sem pensar:
→ O que está urgente?
→ O que pode virar dinheiro?
→ O que precisa ser executado?
→ O que está travado?
→ Onde está o progresso?
→ Qual o próximo passo pequeno?

Neurocompatível com TDAH.
GPS operacional. Não exige ler — exige VER.
```

---

## MAPEAMENTO: REGIÕES IDEAIS vs REALIDADE ATUAL

| Região Ideal | Existe? | O que realmente existe | Formato atual |
|---|---|---|---|
| **HUB** (centro de comando) | PARCIAL | `VisaoGeralPage` + `KratosWorldMap` | Página com grid de cards + mapa de ilhas |
| **OMNIS Lab** (IA/execução) | PARCIAL | `OmnisPage.tsx` | Página de status com métricas e blockers |
| **Akasha** (memória) | NÃO | Inexistente como região | — |
| **Agência** (conteúdo/mídia) | NÃO | Inexistente | — |
| **Arena Comercial** (vendas) | NÃO | Inexistente | — |
| **Observatório** (analytics) | PARCIAL | `VisaoGeralPage` (métricas estáticas) | Badges com "..." placeholder |
| **Tesouro** (métricas/receita) | NÃO | Inexistente | — |
| **Vila Viva** (comunidade) | NÃO | Inexistente | — |
| **Forja** (criação/produção) | NÃO | Inexistente como região | — |
| **Nimbus** (assets/cloud) | NÃO | Inexistente | — |
| **Aurora Sentinel** (oráculo) | PARCIAL | `AuroraFullScreenPanel` (chat) + `AuroraPanel` (orb decorativo) | Chat full-screen + orbe flutuante |

**Resultado:** 3/11 regiões com cobertura parcial. 8/11 regiões ausentes.
**As 3 que existem** são páginas React com painéis de vidro — não "regiões" com identidade espacial.

---

## 20 CRITÉRIOS DE ADERÊNCIA (0-5 cada)

### BLOCO A — ALMA E IDENTIDADE (30 pontos)

| # | Critério | Nota | Evidência |
|---|----------|------|-----------|
| A1 | **Mundo vivo vs Dashboard** — A interface transmite sensação de "lugar" ou parece software corporativo? | **2** | O `KratosWorldMap` (179 linhas) é o ÚNICO elemento que tenta ser "mundo" — ilhas flutuantes, castelo, pontes de corda, nuvens. Mas as 10 páginas filhas são todas painéis `kr-glass-panel` com `kr-card`. O mapa é uma vitrine posta no meio de um dashboard. A sidebar (`KratosSidebar.tsx`) é navegação textual tradicional — zero relação espacial com o mundo. |
| A2 | **Identidade por região** — Cada região tem personalidade visual distinta ou são todas a mesma coisa com título diferente? | **1** | `ContextoPage`, `OmnisPage`, `MissionLensPage`, `TarefasPage`, `ProjetosPage`, `SistemaPage` — TODAS usam o mesmo padrão: `kr-section-title-wrap` → `kr-glass-panel`/`kr-card` → grid. A única diferenciação é o título `<h2>`. `VisaoGeralPage` é a única com layout diferente (world map + grid 2x2). Não existe identidade visual por região. |
| A3 | **Apple-clean** — Clareza, respiro, foco em um elemento principal por tela? | **3** | O design system tem hierarquia limpa. `shell.css` com 5 zonas bem definidas. `tokens.css` com ~150 tokens. Espaçamento melhorou pós-fix #3 (touch targets 44px). Mas `VisaoGeralPage` enfia 4 metric badges + mapa + continuity card + grid 2x2 de cards na mesma tela. Sobrecarga informacional. |
| A4 | **Nintendo soul** — Sensação de descoberta, ludicidade, surpresa, personalidade? | **1** | O castelo com portal pulsante e as ilhas flutuantes são o único respiro de alma. Os unicode chars (◈ ◉ ☰ ⬡ ◎ ⚙ ◆ ◬ ◷ ✦) tentam dar personalidade mas falham — são inconsistentes entre OS e parecem placeholder, não design intencional. O Aurora orb com anéis rotativos tem potencial não explorado. |
| A5 | **Sci-fi light** — Tecnologia visível mas não opressiva, holográfico, etéreo? | **2** | Glassmorphism (`backdrop-filter: blur()`, `rgba()` translúcido) entrega o "holográfico". `color-mix()` nos badges cria transparências sci-fi. Mas falta a camada de "luz" — os painéis são estáticos, não há partículas, scanlines sutis, glitch effects, bordas luminescentes animadas. O Aurora orb (`shell.css` linha 329) tem float animation mas é isolado. |
| A6 | **Pseudo-3D / profundidade / parallax** — O espaço tem eixo Z? | **2** | `world.css` tem `perspective: 900px` e escala de sombras de profundidade (surface → card → glass → island → float). Ilhas usam `box-shadow`多层 para elevação. `WorldClouds` drift com `@keyframes`. Mas: parallax é zero, profundidade só existe no mapa, as páginas são flat 2D, e o `transform: translateY()` no hover é tímido demais para criar sensação de Z. |

**Bloco A: 11/30 (37%)**

---

### BLOCO B — RESPOSTA OPERACIONAL (30 pontos)

| # | Critério | Nota | Evidência |
|---|----------|------|-----------|
| B1 | **O que está urgente?** — A urgência salta aos olhos sem ler? | **1** | Não. `BlockedItemsCard` (`BlockedItemsCard.tsx`) mostra blockers mas com peso visual igual a qualquer card. `KratosRightRail` tem seção de riscos com `--kr-risk-critical-bg` mas o card é pequeno (320px rail), fácil de ignorar. O Aurora `recommendations_count` existe na resposta de API mas nunca é exibido com destaque. Nada PULSA vermelho quando algo queima. |
| B2 | **O que pode virar dinheiro?** — Oportunidades comerciais são visíveis? | **0** | ZERO. Nenhuma página, componente, rota de API ou menção a receita, pipeline comercial, oportunidades de venda, collabs, pacotes (Starter/Growth/Premium), prospecção de hotéis. O operador tem 690K seguidores e 6 perfis — o KRATOS não sabe disso. |
| B3 | **O que precisa ser executado?** — A fila de ação é clara e priorizada? | **2** | `TarefasPage` existe com API `/tasks`. `TodayMissionPanel` mostra missão atual. `FocusNowCard` mostra modo foco + timebox. Mas `VisaoGeralPage:70,78` mostra `"..."` como placeholder fixo para Tarefas e Projetos — não é loading, não é erro, é placeholder PERMANENTE. O dado existe na API mas não chega na tela principal. |
| B4 | **O que está travado?** — Bloqueios são inconfundíveis? | **2** | `OmnisPage` lista `blockers` com `kr-right-rail-risk` + dot critical. `BlockedItemsCard` mostra itens bloqueados. `Layout.tsx:83-89` computa riscos do `/mission/lens`. Mas blockers aparecem enterrados em páginas secundárias — não na `VisaoGeralPage` (a tela de entrada). Um blocker crítico deveria ser impossível de ignorar na landing page. |
| B5 | **Onde está o progresso?** — Linha do tempo, momentum visível? | **2** | `KratosBottomDock` tem barra de progresso (`progress` prop). `CheckpointTimeline` mostra timeline de sessões. `ProjectContinuityCard` mostra retomada. Mas não há visualização de momentum (acelerando? desacelerando?), nem streak, nem velocidade. A barra de progresso é uma thin strip no dock inferior — fácil de ignorar. |
| B6 | **Qual o próximo passo pequeno?** — Ação seguinte é óbvia e de um clique? | **3** | `NextBestActionCard` (`/mentor/next-action`). `KratosBottomDock` tem botão "Continuar". `FocusNowCard` mostra `focus_project`. `Layout.tsx:142-146` tenta navegar para `/tarefas` no CTA principal mas usa `window.location.assign` (recarrega tudo). A ação existe, está visível, mas não é "de um clique sem pensar" — exige ler um card, interpretar, decidir. |

**Bloco B: 10/30 (33%)**

---

### BLOCO C — EXPERIÊNCIA ESPACIAL (20 pontos)

| # | Critério | Nota | Evidência |
|---|----------|------|-----------|
| C1 | **Navegação espacial** — Transitar entre regiões parece "viajar" ou parece "clicar em menu"? | **1** | A navegação é 100% textual via `KratosSidebar` (NavLink com unicode chars). O `KratosWorldMap` permite navegar clicando em ilhas (`navigate(route)`) — isso é o mais próximo de "viajar". Mas as transições são instantâneas, sem animação de viagem, sem sensação de deslocamento no espaço. Clicou, trocou a tela. Como qualquer site. |
| C2 | **SVG / ilustração vs cards genéricos** — O visual é customizado ou genérico? | **1** | `FloatingIsland` e `CentralCastleIsland` são puro CSS (divs aninhadas simulando ilhas/torres). Impressionante tecnicamente, mas não é SVG — é "CSS art". Não escala, não tem detalhe, não tem ilustração real. O restante é 100% cards genéricos com `kr-glass-panel`. Nenhuma ilustração customizada por região. |
| C3 | **Profundidade e parallax** — O olho percebe camadas? | **1** | Só no `KratosWorldMap`. `WorldClouds` tem drift lento. Ilhas têm shadow depth. Mas: zero parallax ao mover mouse, zero scroll-triggered depth, zero transições entre camadas. As páginas são flat. O `prefers-reduced-motion` é respeitado (bom), mas a versão "com motion" ainda é tímida. |
| C4 | **Neurocompatível com TDAH** — Informação escaneável em segundos, sem sobrecarga? | **2** | O layout 5 zonas é uma boa arquitetura cognitiva (HUD em cima, nav esquerda, conteúdo centro, alerts direita, dock baixo). `KratosTopHud` com saudação + hora + status é limpo. Mas `VisaoGeralPage` joga MUITA informação simultânea. `AuroraCommandInput` com history (ArrowUp/Down) é bom para interação rápida. `FocusMode` dimming (`.kr-focus-mode`) existe mas não é default — o usuário tem que ativar. |

**Bloco C: 5/20 (25%)**

---

### BLOCO D — COMPLETUDE E COBERTURA (20 pontos)

| # | Critério | Nota | Evidência |
|---|----------|------|-----------|
| D1 | **Regiões implementadas** — Quantas das 11 regiões ideais têm presença real? | **1** | 3/11 com cobertura parcial (HUB, OMNIS Lab, Aurora). 8/11 completamente ausentes. E as 3 que existem são páginas, não regiões. |
| D2 | **Densidade de dados reais** — O que aparece na tela é dado vivo ou placeholder? | **2** | `/omnis/status` e `/approvals/` retornam dados reais do backend. `/mission/lens` retorna contrato populado. `/context/current` processa janela ativa. Mas `VisaoGeralPage` Tarefas/Projetos são `"..."` placeholder fixo. `NextBestActionCard` mostra fallback string "Nenhuma ação definida" frequentemente. `FocusNowCard` faz fallback para 90min hardcoded. |
| D3 | **Cobertura dos 6 perfis Instagram** — Algum componente mostra os 6 perfis? | **0** | ZERO. Nenhuma menção a @lucastigrereal, @oinatalrn, @agenteviajabrasil, @afamiliatigrereal, @oquecomernatalrn, @natalaivoueu. Nenhum dado de seguidores, engajamento, posts recentes. |
| D4 | **Cobertura do pipeline comercial** — Collabs, pacotes, prospecção? | **0** | ZERO. Starter R$350, Growth R$990/mês, Premium R$1.200 — invisíveis. Nenhum CRM, funil, follow-up. |

**Bloco D: 3/20 (15%)**

---

## MATRIZ FINAL

| Bloco | Peso | Nota Bruta | Nota Ponderada | % |
|-------|------|-----------|----------------|-----|
| A — Alma e Identidade | 30 | 11/30 | 11.0 | 37% |
| B — Resposta Operacional | 30 | 10/30 | 10.0 | 33% |
| C — Experiência Espacial | 20 | 5/20 | 5.0 | 25% |
| D — Completude e Cobertura | 20 | 3/20 | 3.0 | 15% |
| **TOTAL** | **100** | **29/100** | **29.0** | **29%** |

---

## VEREDITO COLORIDO

```
████████████████████████████████████████████████████████████████
█                    VEREDITO FINAL                            █
█                                                              █
█   NOTA: 29 / 100                                             █
█   FAIXA: 21-40 — "ESQUELETO FUNCIONAL, ALMA AUSENTE"        █
█   COR:   VERMELHO                                            █
█                                                              █
█   ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  █
█   29% de aderência à idealização                             █
████████████████████████████████████████████████████████████████
```

**Interpretação da faixa:**
- **0-20 (PRETO):** "Outro produto" — Não é reconhecível como KRATOS. Não estamos aqui.
- **21-40 (VERMELHO):** "Esqueleto funcional, alma ausente" — Funciona, tem estrutura, mas não entrega a visão. **ESTAMOS AQUI: 29/100.**
- **41-60 (AMARELO):** "Dashboard premium" — Funciona bem como dashboard mas ainda não é mundo vivo.
- **61-80 (VERDE):** "Caminho certo, falta alma/regiões" — A visão é reconhecível, faltam camadas.
- **81-100 (AZUL):** "KRATOS idealizado" — O produto que foi descrito na visão.

---

## TOP 10 GAPS (ordenados por gravidade — o que mais distancia da visão)

### GAP #1 — NÃO É UM MUNDO, É UM SITE COM SIDEBAR
**Gravidade:** CRÍTICA | **Bloco:** A1, C1

A navegação é uma sidebar de links textuais. Isso é o oposto de "mundo vivo de regiões". O mapa de ilhas (`KratosWorldMap`) é o embrião da navegação espacial, mas está enterrado dentro da `VisaoGeralPage` como "mais um componente". A sidebar e o mapa coexistem como dois sistemas de navegação redundantes e contraditórios — um textual, um espacial.

**Evidência no código:** `KratosSidebar.tsx:15-29` define 10 NavLinks. `KratosWorldMap.tsx:28-111` define 7 ilhas + castelo. Dois mapas do mesmo território, competindo pela atenção.

### GAP #2 — ZERO CONEXÃO COM O NEGÓCIO REAL
**Gravidade:** CRÍTICA | **Bloco:** B2, D3, D4

O KRATOS não sabe que o operador tem 6 perfis Instagram, 2.3M+ seguidores, pacotes de venda (Starter/Growth/Premium), collabs com hotéis, pipeline comercial. A pergunta "o que gera dinheiro hoje?" — a pergunta guia do operador — não pode ser respondida. Nenhum endpoint, componente ou menção.

### GAP #3 — REGIÕES SÃO PÁGINAS, NÃO LUGARES
**Gravidade:** CRÍTICA | **Bloco:** A2, D1

O ideal descreve 11 regiões com identidade visual própria. A realidade: 11 rotas React que renderizam o mesmo template (`kr-section-title-wrap` → `kr-glass-panel` → grid de `kr-card`). Não há distinção visual entre entrar no OMNIS Lab e entrar em Contexto. Ambos são páginas com painéis de vidro.

### GAP #4 — AURORA É UM CHAT, NÃO UMA PRESENÇA
**Gravidade:** ALTA | **Bloco:** A4, A5

O ideal: Aurora Sentinel como presença oracular integrada ao mundo — um farol, um olho que tudo vê, uma entidade que sussurra alertas. A realidade: `AuroraFullScreenPanel` (263 linhas) é um chat full-screen com `generateResponse()` baseado em regex (`if lower.includes("missao")`...). O `AuroraPanel.tsx` (174 linhas) tem um orbe holográfico decorativo — bonito, mas não-integrado. A Aurora não "observa" nada automaticamente.

### GAP #5 — INFORMAÇÃO CRÍTICA NÃO GRITA
**Gravidade:** ALTA | **Bloco:** B1, B4

Blockers, riscos críticos, prazos estourados — todos usam o mesmo vocabulário visual de cards e badges. Um blocker crítico deveria pulsar, tingir o ambiente, alterar o tom da interface. Hoje: `kr-right-rail-risk` com `borderLeftColor: var(--kr-risk-critical)` e um dot vermelho. Silencioso. Fácil de ignorar.

### GAP #6 — PLACEHOLDERS PERMANENTES MASCAM A VERDADE
**Gravidade:** ALTA | **Bloco:** B3, D2

`VisaoGeralPage.tsx:70, 78` — Tarefas e Projetos mostram `"..."` como valor. Não é estado de loading (o `LoadingSkeleton` cobre isso), não é erro (o `ErrorState` cobre isso), é um placeholder PERMANENTE. O dado existe (`/tasks` retorna array de tasks no `Layout.tsx:50`) mas não chega na landing page. Isso quebra a premissa de "verdade operacional".

### GAP #7 — PROFUNDIDADE E PARALLAX SÓ EXISTEM NO MAPA
**Gravidade:** MÉDIA | **Bloco:** A6, C3

O `world.css` mostra que o time sabe fazer: `perspective: 900px`, sombras de profundidade, `@keyframes cloud-drift`. Mas essa linguagem visual não escapa do mapa. As páginas são flat. A transição entre páginas é instantânea e sem direção. Não há `transform: translateZ()` em lugar nenhum.

### GAP #8 — SEM SVG, SEM ILUSTRAÇÃO, SEM IDENTIDADE
**Gravidade:** MÉDIA | **Bloco:** C2

O castelo e as ilhas são CSS puro — técnica impressionante mas limite. Sem SVG, não há como ter detalhe: bandeiras tremulando, janelas iluminadas, pontes balançando, criaturas, personagens. O "Nintendo soul" vem de ilustração com personalidade. CSS art não escala para esse nível de detalhe.

### GAP #9 — SEM CAMADA DE "LUZ" SCI-FI
**Gravidade:** MÉDIA | **Bloco:** A5

Glassmorphism entrega o "holográfico". Mas o "sci-fi light" pede mais: edge glow animado nas bordas dos painéis, scanlines sutis, partículas flutuantes, feixes de luz conectando regiões, glitch effects em dados degradados. Nada disso existe. O Aurora orb (`shell.css:329`) é o único elemento com "luz animada" e está isolado num canto.

### GAP #10 — DUAS FONTES DE VERDADE NO CSS
**Gravidade:** BAIXA | **Bloco:** A3 (qualidade técnica)

`tokens.css` (446 linhas, importado) e `kratos-tokens.css` (355 linhas, NÃO importado) definem tokens sobrepostos com naming conventions diferentes. `--kr-text-xs` vs `--kr-font-caption`. Componentes referenciam tokens que só existem no arquivo não-importado (`--kr-purple-900` em `ProjectContinuityCard.tsx:64`). Isso corrói o design system por baixo.

---

## O QUE O KRATOS ATUAL É (honestamente)

```
O KRATOS atual é um DASHBOARD PREMIUM com TEMA DE MUNDO.
```

- O esqueleto técnico é sólido: 29 rotas FastAPI, 11 páginas React, 40+ componentes, 31 testes frontend
- O design system é coerente: glassmorphism, ~150 tokens CSS, estados consistentes
- O mapa de ilhas é o embrião genuíno da visão — o único elemento que não é "dashboard genérico"
- A estrutura 5 zonas (HUD, Sidebar, Main, Rail, Dock) é uma boa arquitetura cognitiva
- Mas o produto ENTREGUE é: sidebar + páginas de cards com vidro fosco
- Nenhuma região tem alma própria. Nenhum dado de negócio real existe. A navegação é textual.
- **É um dashboard tecnicamente bem executado com uma skin de mundo de fantasia.**

---

## O QUE FALTA PARA SER O KRATOS IDEAL (visão geral)

1. **Matar a sidebar tradicional** — A navegação PRIMÁRIA precisa ser o mundo. Sidebar vira secundária ou some.
2. **Dar identidade visual a cada região** — Ilustração SVG, paleta própria, "clima" diferente por região.
3. **Conectar os dados de negócio** — Perfis Instagram, pipeline comercial, métricas de receita, collabs.
4. **Fazer a Aurora ser onipresente** — Não um chat, uma presença: alertas proativos, orbe pulsando no canto com severidade.
5. **Adicionar camada de luz sci-fi** — Edge glow, partículas, scanlines, feixes de luz entre ilhas.
6. **Profundidade e parallax em toda parte** — Não só no mapa. Cada página deveria ter camadas em Z.
7. **Informação crítica grita** — Blocker = ambiente tinge de vermelho. Urgente = pulsação. Dinheiro = brilho dourado.
8. **Substituir unicode chars por SVG** — Ícones com personalidade Nintendo, não glifos de sistema.
9. **Unificar tokens CSS** — Um arquivo canônico, sem código morto.
10. **Cada tela responder as 6 perguntas em segundos** — Sem ler parágrafos, sem clicar em subpáginas.

---

**Disclaimer:** Esta auditoria é sobre ADERÊNCIA À VISÃO, não sobre qualidade técnica. O código é limpo, bem arquitetado, testado. O problema não é o código — é a distância entre o que foi construído e o que foi sonhado.
