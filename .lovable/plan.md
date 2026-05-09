# Crédito 5/5 — Polish Final + Responsividade + Handoff

Refino puramente visual do sandbox. Sem novas features, sem lógica real, sem backend, hooks, API, types, package, vite, tsconfig ou .env. Nenhum arquivo proibido será tocado.

## Arquivos a alterar (refino visual)

Shell e estilos globais:

- `src/styles.css` — pequenos ajustes: utilitários de container responsivo, breakpoint helpers e refinamento dos tokens de hover/focus já existentes (sem mudar paleta).
- `src/components/kratos/shell/AppShell.tsx` — sidebar colapsada por padrão em telas estreitas, AuroraPanel fechado por padrão em mobile, container `max-w` e `px` responsivos.
- `src/components/kratos/shell/Sidebar.tsx` — comportamento responsivo (largura/colapso em <1024px), focus rings, `aria-label` nos botões.
- `src/components/kratos/shell/Topbar.tsx` — densidade, truncamento, `aria-label` no toggle Aurora.
- `src/components/kratos/shell/AuroraPanel.tsx` — manter estrutura externa; só ajustar largura responsiva (overlay em mobile).
- `src/components/kratos/shell/StatusBar.tsx` — esconder metadados secundários em mobile, sem virar poluição.

Views (apenas espaçamento, hierarquia, microcopy, empilhamento mobile):

- `src/components/kratos/views/AgoraView.tsx`
- `src/components/kratos/views/AgendaView.tsx` (manter `DoNotDoPanel` na primeira dobra)
- `src/components/kratos/views/ContextoView.tsx`
- `src/components/kratos/views/CheckpointsView.tsx`
- `src/routes/sistema.tsx` ou view correspondente (manter como referência dos 9 estados)
- `src/routes/index.tsx` (ajustar microcopy da home)

Componentes base (apenas inconsistências pequenas, sem reescrever):

- `src/components/kratos/base/StatusCard.tsx`
- `src/components/kratos/base/SystemCard.tsx`
- `src/components/kratos/base/SectionHeader.tsx`
- `src/components/kratos/base/AlertBadge.tsx`
- `src/components/kratos/base/EmptyState.tsx`
- `src/components/kratos/base/LoadingState.tsx`
- `src/components/kratos/base/ErrorState.tsx`
- `src/components/kratos/base/LiveStatusIndicator.tsx`
- `src/components/kratos/base/StatusDot.tsx`

Cards das telas (microcopy + acessibilidade + botões mock com `aria-label` e `disabled` quando não fazem ação):

- `src/components/kratos/agora/*` (NextActionCard, AuroraShortcutCard, etc.)
- `src/components/kratos/agenda/*`
- `src/components/kratos/contexto/ContextActionStrip.tsx` e demais
- `src/components/kratos/checkpoints/*`
- `src/components/kratos/aurora/AuroraQuickActions.tsx`, `AuroraInputMock.tsx`

## Arquivos a criar

- `KRATOS_VISUAL_HANDOFF.md` (raiz) — markdown curto com:
  - resumo dos 5 créditos
  - principais componentes criados
  - componentes mais portáveis
  - telas a adaptar primeiro no KRATOS real
  - pontos de atenção para conectar hooks reais
  - lista de arquivos que Claude Code deve olhar
  - aviso "tudo é mock visual"
  - proibição de copiar cegamente

Nenhum outro arquivo novo. Nenhum hook, lib, type, asset.

## Telas refinadas

`/`, `/agora`, `/agenda`, `/contexto`, `/checkpoints`, `/sistema` — sempre só polish (espaçamento, hierarquia, microcopy, hover/focus, empilhamento mobile).

## Estados revisados (visual apenas)

`loading`, `empty`, `error`, `degraded`, `cached`, `reconnecting`, `fallback`, `offline`, `live` — padronizados via os componentes base já existentes (`LoadingState`, `EmptyState`, `ErrorState`, `LiveStatusIndicator`). `/sistema` segue como referência dos 9 estados; demais telas usam de forma discreta com a microcopy sugerida.

## Responsividade

Breakpoints alvo: 360–414 (mobile), 768 (tablet), 1280 (notebook), 1440, 1920.

- Sidebar colapsa <1024px.
- AuroraPanel fechado por padrão em mobile; quando aberto, vira overlay e não comprime o main.
- Grids das views passam de multi-coluna para coluna única em <768px.
- StatusBar reduz informações secundárias em <640px.

## Microcopy

Substituir frases genéricas por operacionais conforme o briefing ("Faça isso agora.", "Retome daqui.", "Sem alerta crítico agora.", etc.) nos cards e headers das telas existentes.

## Acessibilidade

- `aria-label` em botões icônicos.
- `disabled` + `title` em botões mock sem side effect.
- focus ring (`kratos-focus-ring`) em todos os interativos.
- contraste mantido pelos tokens existentes; nenhuma cor nova fora dos tokens KRATOS.

## Confirmações obrigatórias

- Não toca: `backend/**`, `src/hooks/**`, `src/lib/**`, `src/types/**`, `package.json`, `vite.config.ts`, `tsconfig.json`, qualquer `.env`.
- Não cria lógica real, fetch, hooks, API client, SSE, WebSocket, IA, auth, banco, endpoint.
- Não adiciona dependências.
- Não usa emojis, neon, gráficos, glassmorphism fora do AuroraPanel.
- `/agora`, `/agenda`, `/contexto`, `/checkpoints`, `/sistema` continuam funcionando como aprovados; `DoNotDoPanel` segue na primeira dobra de `/agenda`; `/sistema` segue com os 9 estados; AuroraPanel segue visual (não chat real).

Aguardando aprovação para executar o Build.  
  
  
KRATOS LOVABLE — REPLANEJAMENTO DO CRÉDITO 5

Não execute o plano anterior ainda.

Como agora temos mais créditos disponíveis, não precisamos comprimir polish, responsividade, acessibilidade, estados ruins e handoff em um único Build.

Vamos fazer direito.

A partir de agora, divida a evolução em passes separados:

- Crédito 5A: Design Elevation Pass

- Crédito 5B: Responsividade + Acessibilidade

- Crédito 6: Estados ruins + consistência visual

- Crédito 7: Handoff final para Claude Code adaptar ao KRATOS real

Neste momento, quero executar APENAS o:

CRÉDITO 5A — DESIGN ELEVATION PASS

Apple-clean futurista · Raycast · Linear · VisionOS · Jarvis calmo

OBJETIVO:

Elevar o visual do sandbox KRATOS para parecer um cockpit premium Apple-clean do futuro.

Não quero apenas ajustes de padding.

Não quero apenas aria-label.

Não quero apenas responsividade.

Quero que o KRATOS deixe de parecer protótipo organizado e comece a parecer produto visual premium.

DIREÇÃO VISUAL:

Apple VisionOS + Raycast + Linear + Vercel + observability cockpit.

80% operacional.

20% Jarvis.

0% carnaval sci-fi.

Se parecer dashboard SaaS genérico, falhou.

Se parecer admin template escuro, falhou.

Se parecer cyberpunk/neon, falhou.

Se ficar bonito mas confuso, falhou.

Se precisar de manual, falhou.

REGRA CENTRAL:

A interface precisa parecer incrível, mas continuar simples.

One screen, one decision.

NÃO CRIAR:

- backend

- Supabase

- auth

- banco

- endpoint

- fetch

- API client

- hooks reais

- src/types

- SSE/EventSource

- WebSocket

- IA real

- chat real

- gráficos

- tabelas pesadas

- dependências novas

- nova arquitetura

NÃO ALTERAR:

- backend/**

- src/hooks/**

- src/lib/**

- src/types/**

- package.json

- vite.config.ts

- tsconfig.json

- qualquer .env

PODE ALTERAR:

- src/styles.css

- src/components/kratos/**

- src/routes/**

- views visuais existentes

Mas somente para elevação visual.

Nada de lógica real.

NÃO MEXER NA ESTRUTURA FUNCIONAL APROVADA:

- /agora continua simples

- /agenda continua com DoNotDoPanel na primeira dobra

- /contexto continua respondendo “onde estou?”

- /checkpoints continua respondendo “onde parei?”

- /sistema continua referência dos 9 estados

- AuroraPanel continua visual/mock

TAREFA 1 — ELEVAR O SHELL

Refinar:

- sidebar

- topbar

- main content

- AuroraPanel

- status bar

Objetivo:

O shell deve parecer um cockpit pessoal premium, não um menu lateral comum.

Melhorar:

- ritmo visual

- contraste sutil

- presença do logo KRATOS

- item ativo

- agrupamento da navegação

- topbar mais limpa e premium

- status bar discreta e elegante

- AuroraPanel com sensação VisionOS sutil

Glassmorphism permitido apenas no AuroraPanel.

TAREFA 2 — ELEVAR OS CARDS

Os cards não podem parecer blocos cinza genéricos.

Refinar:

- borda

- profundidade

- contraste interno

- títulos

- subtítulos

- badges

- hover

- focus

- hierarquia

Não usar glass nos cards principais.

Cards de dados devem ser sólidos, legíveis e calmos.

TAREFA 3 — ELEVAR TIPOGRAFIA

Refinar:

- títulos com mais presença

- labels técnicos em estilo mono

- números/prazos/durações com tratamento visual premium

- subtítulos mais limpos

- microcopy mais curta

Evitar:

- texto grande demais

- texto pequeno demais

- poluição verbal

TAREFA 4 — ELEVAR AS TELAS

Revisar visualmente:

/agora

Deve parecer a tela principal mais impactante e simples.

Ela deve dizer:

- foco

- próxima ação

- crítico

- deadline

- checkpoint

- Aurora

/agenda

Deve parecer central de execução.

Não calendário.

Não dashboard.

/contexto

Deve parecer mapa mental limpo.

Onde estou, onde me perdi, como volto.

/checkpoints

Deve parecer save game mental.

Retomar daqui precisa ser visualmente forte.

/sistema

Deve parecer painel técnico organizado.

Não depósito de estado.

AuroraPanel

Deve parecer especial, mas sem dominar.

Jarvis calmo, não chat gigante.

TAREFA 5 — ELEVAR MICROINTERAÇÕES

Aplicar apenas:

- hover 150–200ms

- pulse live muito sutil

- fade-in leve

- focus ring elegante

- transições suaves de painel

Não usar:

- bounce

- 3D

- parallax

- animação exagerada

- neon

- efeitos chamativos

TAREFA 6 — MANTER PALETA

Usar somente tokens KRATOS existentes.

Não inventar cores novas.

Não usar branco puro.

Não usar neon.

Não usar gradiente chamativo.

Cor = significado.

TAREFA 7 — TESTE DE QUALIDADE VISUAL

Antes de executar, seu plano precisa responder:

1. Como o visual ficará mais Apple-clean?

2. Como evitará parecer admin template?

3. Como a /agora ficará mais impactante sem ficar mais cheia?

4. Como o AuroraPanel ficará mais premium sem virar chat gigante?

5. Como os cards ficarão mais próprios e menos genéricos?

6. Quais arquivos serão alterados?

7. Quais arquivos NÃO serão tocados?

8. Como garantirá que nenhuma lógica real será criada?

ENTREGA AGORA:

Apresente um plano atualizado APENAS para o CRÉDITO 5A — DESIGN ELEVATION PASS.

Não execute Build ainda.

Aguarde aprovação.