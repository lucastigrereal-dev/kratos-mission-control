# KRATOS Mission Control — Pacote Completo V5

Documento consolidado com os artefatos pedidos desde o início da conversa: visão do sistema, constituição visual, pesquisa operacional consolidada, estratégia para Codex/Lovable/Claude Code, estrutura de pastas, manifestos, AGENTS/skills, prompt chains, arquivos markdown do repositório, checklist de integração e pacote frontend inicial. O núcleo conceitual do projeto é consistente ao longo dos materiais do espaço: KRATOS não é um dashboard comum; ele foi definido como um cockpit local-first, um “sistema operacional emocional” e um mundo operacional vivo com ilhas, castelo central, HUD limpo, foco, retomada e Aurora como presença contextual.[file:1][file:3]

A consolidação abaixo também preserva as restrições repetidas ao longo dos materiais: não reescrever backend, não trocar Vite, não criar auth, não criar Supabase, não substituir SSE por outra arquitetura sem necessidade, e usar o frontend como executor especializado sobre contratos já existentes.[file:1][file:5][file:6]

## Sumário

1. Norte do KRATOS
2. Regras absolutas do projeto
3. Diagnóstico consolidado
4. Direção visual oficial
5. OCR e interpretação da imagem de referência
6. Ilhas e mundos oficiais
7. Arquitetura frontend alvo
8. Estrutura de pastas V5
9. Manifestos por pasta
10. AGENTS.md global e do repositório
11. Ecossistema de skills do Codex
12. Prompt-mestre para Codex
13. Sequência de scripts para Codex
14. Estratégia Lovable
15. Arquivos de documentação do repositório
16. Pacote frontend inicial (arquivos TSX/TS/CSS)
17. Regras de neuro UX e ADHD-first
18. Regras de performance e SSE
19. Roadmap incremental
20. Checklist final de aceite
21. Tabela textual consolidada

---

## 1. Norte do KRATOS

KRATOS Mission Control foi definido como uma camada operacional local-first que observa computador, projetos, Git, Docker, contexto atual, perda de foco, checkpoints, agenda, risco e próxima ação, com updates em tempo quase real via SSE e fallback via snapshot.[file:1][file:5][file:6]

Ao longo da conversa e dos arquivos do espaço, o sistema foi reposicionado de “dashboard” para “mundo operacional vivo”: um castelo central com ilhas que representam domínios reais da vida e da operação, reduzindo RAM emocional, custo de reentrada cognitiva e caos contextual.[file:1][file:3]

A consequência disso é arquitetural: o frontend não deve ser um admin panel genérico, e o agente de código não deve inventar visual ou backend; ele deve implementar uma constituição visual e operacional já definida, respeitando contratos existentes e trabalhando de forma incremental.[file:1][file:5]

## 2. Regras absolutas do projeto

As restrições mais repetidas e portanto canônicas são:

- Não reescrever backend.[file:1][file:5]
- Não alterar FastAPI, SQLite, collectors, Mission Lens v1, `livestream`, `livesnapshot` ou contratos sem extrema necessidade.[file:1]
- Não criar Supabase, auth, Next.js, Postgres ou APIs paralelas para resolver problema de frontend.[file:1][file:6]
- Não trocar Vite.[file:1]
- Não instalar Three.js/R3F na primeira fase visual; primeiro vem a versão 2D pseudo-3D segura.[file:1]
- Não permitir que Lovable, Codex ou Claude Code “pensem arquitetura” fora do escopo; eles devem agir como executor frontend com coleira curta.[file:5][file:6]
- Priorizar clareza operacional, baixa carga cognitiva, continuidade mental, componentização e evolução incremental.[file:1][file:5]

## 3. Diagnóstico consolidado

O diagnóstico recorrente nos materiais é que dashboards operacionais falham porque tentam mostrar tudo ao mesmo tempo e transformam completude em paralisia; o redesenho do KRATOS deve reduzir o tempo de orientação para algo próximo de 10 segundos.[file:5]

Os problemas-alvo são: hierarquia visual fraca, excesso de informação sem severidade, ausência de uma leitura emocional do estado do sistema, live data sem ritmo e falta de ponto claro de retorno mental para alguém que alterna contextos e pode perder o fio da missão.[file:5][file:3]

No teu caso, isso é ainda mais importante porque o briefing do espaço reforça TDAH, sobreposição de ideias e tendência a não concluir; portanto a arquitetura precisa impor foco único, próxima ação dominante, retomada rápida e redução de culpa, não só “boniteza”.[file:3]

## 4. Direção visual oficial

A direção visual desejada foi descrita diversas vezes como Apple-clean, Raycast, Linear, Arc, Vercel, HUD futurista limpo, premium, neurocompatível, baixa carga cognitiva e com sensação de game UI adulta, não infantil nem cyberpunk poluído.[file:1][file:5]

A regra estética central é 80% operação/admin observability e no máximo 20% “cockpit/Jarvis”, com zero carnaval sci-fi; a emoção visual deve existir, mas controlada e subordinada à leitura da missão atual.[file:5][file:6]

A primeira versão visual deve usar fundo céu-oceano, ilhas flutuantes, painéis azul-escuro translúcidos, sidebar fixa, topbar com energia/nível/XP/hora, Aurora no topo direito, castelo central e HUD lateral com foco do dia, progresso, agenda e squads.[file:1]

## 5. OCR e interpretação da imagem de referência

A imagem de referência consolidada descreve uma interface wide 16:9 com céu azul, nuvens, oceano, ilhas conectadas, castelo central, HUD lateral, topbar com energia, nível, XP, hora, Aurora no topo direito, foco do dia, progresso, citação, agenda, trilha sonora e squads.[file:1]

A leitura operacional correta da imagem não é “fazer igual pixel a pixel”, mas recriar os princípios: mundo operacional, ilhas como módulos, castelo central como missão, HUD como instrumento de clareza, Aurora como presença viva e game-feel controlado sem infantilização.[file:1]

Também há correções canônicas sobre a referência: remover IP protegido, não usar músicas protegidas, corrigir typos visuais, aumentar contraste em textos pequenos, melhorar responsividade e preparar ligação futura entre ilhas e payload real.[file:1]

## 6. Ilhas e mundos oficiais

Os materiais do espaço consolidam um mapa emocional-operacional com ilhas oficiais como Castelo KRATOS, Omnis Lab, Agência/Redes Sociais, Akasha/Gringotts, Nimbus Academy, Vila Viva, Tesouro Finanças, Arena Comercial, Observatório, Forja Corpo, Missão/Propósito e Mundo Externo.[file:1]

Cada ilha foi definida como representação de uma responsabilidade real, com papel cognitivo de externalizar o mapa psíquico-operacional e reduzir ansiedade espacializando o caos em domínios navegáveis.[file:1][file:3]

A consequência visual é que as ilhas não podem parecer iguais: prioridade, escala, destaque e “respiração” do mapa devem variar conforme foco, contexto e estado atual do reino.[file:1]

## 7. Arquitetura frontend alvo

O frontend alvo continua React + Vite + TypeScript + Tailwind + componentes próprios/shadcn/ui, com backend FastAPI e SQLite já existentes, consumindo SSE de `livestream` e fallback `livesnapshot`.[file:1][file:5]

A arquitetura recomendada para a nova camada visual é separar shell, world, HUD, Aurora, mission, UI, hooks e lib, para permitir evolução incremental sem virar monólito de tela única.[file:1][file:5]

O desenho geral recomendado é: sidebar fixa à esquerda, topbar no topo, mundo central com castelo e ilhas, trilhos laterais de contexto/HUD, e uma barra inferior ou dock para squads, missão contínua e trilha de foco.[file:1]

## 8. Estrutura de pastas V5

```txt
frontend/
  public/
    references/
      kratos-control-reference.png
  src/
    kratos/
      shell/
      world/
      hud/
      aurora/
      mission/
      ui/
      hooks/
      lib/
      styles/
    pages/
    components/
    App.tsx
    main.tsx
  docs/
    kratos-visual/
```

### 8.1. Descrição

- `shell/`: layout estrutural do cockpit.
- `world/`: mapa, castelo, ilhas, fundo, pontes.
- `hud/`: foco, agenda, progresso, citação, squads, trilha.
- `aurora/`: presença contextual e assistente lateral.
- `mission/`: missão atual, próxima ação, do-not-do, checkpoint suggestion.
- `ui/`: design system local reutilizável.
- `hooks/`: `useKratosLiveSafe`, atalhos, mapeamento de estados.
- `lib/`: dados tipados de ilhas e mock visual isolado.
- `styles/`: tokens e CSS do cockpit.

## 9. Manifestos por pasta

### 9.1. `docs/kratos-visual/KRATOS_V5_MANIFESTO_ROOT.md`

Define a missão do frontend: transformar o KRATOS em um cockpit visual que devolve o fio da missão, sem tocar no motor do sistema.[file:1][file:5]

### 9.2. `KRATOS_V5_SHELL_MANIFESTO.md`

Declara layout 3 áreas, um único scroll principal, prioridade de leitura e composição responsiva desktop-first.[file:1]

### 9.3. `KRATOS_V5_WORLD_MANIFESTO.md`

Declara o castelo como centro da missão e cada ilha como módulo emocional-operacional distinto, com status e cor semântica.[file:1]

### 9.4. `KRATOS_V5_HUD_MANIFESTO.md`

Define foco do dia, progresso, agenda, Aurora, squads, status do sistema e regras de quando cada bloco aparece ou recolhe.[file:1][file:5]

### 9.5. `KRATOS_V5_AURORA_MANIFESTO.md`

Afirma que Aurora não é chatbot genérico; é consciência operacional, contextual, lateral e não intrusiva.[file:1][file:5]

### 9.6. `KRATOS_V5_NEURO_UX_RULES.md`

Consolida foco único, carga cognitiva baixa, continuidade, linguagem direta, feedback sem culpa e eliminação de widgets decorativos.[file:3][file:5]

## 10. AGENTS.md global e do repositório

### 10.1. `~/.codex/AGENTS.md`

```md
# Global Codex Agent Rules

You are a frontend execution agent for local-first mission control systems.

Global defaults:
- Prefer incremental changes.
- Never propose backend rewrites unless explicitly requested.
- Preserve existing contracts and routes.
- Ask for clarification before changing architecture.
- Prefer React + Vite + TypeScript + Tailwind conventions already present in the repo.
- Treat design systems, motion, and live-state UX as first-class concerns.
- Avoid destructive refactors.
- Prefer component extraction over large screen rewrites.
- Document changed files and testing instructions after each task.
```

### 10.2. `repo/AGENTS.md`

```md
# KRATOS Mission Control — Repository Agent Rules

## Mission
Codex acts as a specialized frontend executor for KRATOS Mission Control.
KRATOS is a local-first operational cockpit, not a generic SaaS dashboard.

## Absolute rules
- Do not touch backend/FastAPI/SQLite/collectors/Mission Lens contracts unless explicitly authorized.
- Do not replace SSE (`/live/stream`) or snapshot fallback (`/live/snapshot`).
- Do not add Supabase, auth, Next.js, Postgres, WebSockets, or unrelated infrastructure.
- Do not rewrite the entire app.
- First implementation is 2D pseudo-3D, not real 3D.

## Frontend priorities
1. Build must pass.
2. Existing live data must continue to work.
3. Mission clarity in 10 seconds.
4. Low cognitive load.
5. Incremental componentization.

## Visual DNA
Apple-clean + Linear + Raycast + Vercel + premium mission HUD.
No cyberpunk clutter. No childish fantasy. No generic Tailwind admin.

## Required workflow
Before editing:
1. Read relevant docs in `docs/kratos-visual/`.
2. List files you plan to change.
3. Explain why each file is necessary.
4. Implement in small diffs.
5. Report changed files, risks, and how to test.
```

## 11. Ecossistema de skills do Codex

A estrutura recomendada para especializar o Codex foi evoluindo para um sistema de skills focadas, com escopo pequeno, ao invés de um prompt monolítico; isso acompanha a própria recomendação do ecossistema de skills focadas e metadata enxuta.[file:1][file:6]

### 11.1. Skills-base recomendadas

```txt
repo/.codex/skills/
  kratos-foundation/SKILL.md
  kratos-planning/SKILL.md
  kratos-design-system/SKILL.md
  kratos-neuro-ux/SKILL.md
  kratos-shell/SKILL.md
  kratos-world-map/SKILL.md
  kratos-hud/SKILL.md
  kratos-aurora-ui/SKILL.md
  kratos-live-state-ui/SKILL.md
  kratos-sse-performance/SKILL.md
  kratos-accessibility/SKILL.md
  kratos-frontend-guardrails/SKILL.md
  kratos-reporting/SKILL.md
  kratos-visual-qa/SKILL.md
  kratos-agora-screen/SKILL.md
  kratos-context-screen/SKILL.md
  kratos-agenda-screen/SKILL.md
  kratos-checkpoints-screen/SKILL.md
  kratos-system-screen/SKILL.md
  kratos-mentor-screen/SKILL.md
  kratos-arena-screen/SKILL.md
  kratos-future-3d/SKILL.md
```

### 11.2. Exemplo de skill

```md
---
name: kratos-shell
purpose: Build and preserve the KRATOS mission shell layout.
triggers:
  - sidebar
  - topbar
  - shell
  - layout
  - mission control
allowed_paths:
  - frontend/src/kratos/shell/**
  - frontend/src/kratos/ui/**
  - frontend/src/pages/**
forbidden_paths:
  - backend/**
  - services/**
  - collectors/**
---

# KRATOS Shell

Goals:
- Keep one main scroll region.
- Preserve low cognitive load.
- Keep sidebar, topbar, status bar visually coherent.
- Support Aurora right rail without crowding the main world view.

Never:
- Introduce new backend calls unless already documented.
- Rename core live data contracts.
- Convert layout into generic admin dashboard.
```

## 12. Prompt-mestre para Codex

```txt
Você está trabalhando no projeto real KRATOS Mission Control.

CONTEXTO
KRATOS é um cockpit operacional local-first para um operador solo técnico-criativo.
Ele mostra estado do computador, projetos ativos, Docker, Git, alertas, contexto atual,
perda de foco, checkpoints, agenda, deadlines, próxima ação e sinais do sistema.

STACK REAL
- Frontend React + Vite + TypeScript + Tailwind
- Backend FastAPI
- Banco local SQLite
- Live SSE em /live/stream
- Fallback snapshot em /live/snapshot
- Mission Lens já existe
- Hook importante: useLiveKratos.ts

MISSÃO
Agir como executor frontend especializado do KRATOS.
Seu trabalho é melhorar shell, design system, world-map, HUD, Aurora lateral,
mission cards e telas associadas sem quebrar contratos.

REGRAS ABSOLUTAS
- Não tocar em backend, collectors, SQLite, Mission Lens v1, endpoints e SSE sem autorização explícita.
- Não criar Supabase, auth, Next.js, Postgres, WebSockets ou nova arquitetura.
- Não instalar Three.js/R3F agora.
- Primeira versão é 2D pseudo-3D segura.
- Não recriar dashboard SaaS genérico.

PRIORIDADES
1. Build funcionando.
2. Dados reais preservados.
3. Missão clara em 10 segundos.
4. Baixa carga cognitiva.
5. Componentização incremental.

FLUXO OBRIGATÓRIO
Antes de editar:
1. Resuma o que entendeu.
2. Liste os arquivos que pretende alterar.
3. Explique o porquê.
4. Faça perguntas se houver ambiguidade.
5. Só então implemente.

AO FINAL
- Liste arquivos criados e alterados.
- Diga como testar.
- Diga o que ainda está mockado.
- Diga os riscos remanescentes.
```

## 13. Sequência de scripts para Codex

A cadeia de execução consolidada tem 8 estágios: preparação local, auditoria, escopo, bible visual, implementação segura, lapidação visual, binding com dados reais e validação final.[file:1]

### 13.1. SCRIPT 0 — Preparação local

```txt
cd C:\mission-control

git status
git branch --show-current

New-Item -ItemType Directory -Force .\frontend\public\references
New-Item -ItemType Directory -Force .\docs\kratos-visual

Test-Path .\frontend\public\references\kratos-control-reference.png
```

### 13.2. SCRIPT 1 — Auditoria sem editar

```txt
Leia tudo antes de agir.
Você está trabalhando no KRATOS Mission Control.

IMPORTANTE
Nesta primeira etapa, NÃO altere arquivos.
NÃO edite código.
NÃO rode refatoração.
NÃO crie componentes.
NÃO mexa no backend.

Objetivo desta etapa:
Entender o projeto atual, carregar a referência visual e me entregar um plano seguro de implementação frontend.

Sua tarefa:
1. Leia a estrutura do projeto.
2. Identifique frontend, backend, package.json, App.tsx, pages, components, hooks e lib/api.
3. Encontre useLiveKratos.ts.
4. Confirme quais comandos existem no package.json.
5. Confirme se Tailwind está configurado.
6. Confirme se o projeto usa React Router.
7. Confirme quais páginas existem.
8. Confirme se a imagem existe em frontend/public/references/kratos-control-reference.png.
9. Não altere nada.
10. Gere um plano de arquivos a alterar na próxima etapa.
```

### 13.3. SCRIPT 2 — Escopo, branch e docs

```txt
Agora execute a preparação segura.

1. Rode git status.
2. Crie a branch feature/kratos-1-frontend-codex.
3. Crie/atualize:
- docs/kratos-visual/KRATOS1FRONTENDCODEXSCOPE.md
- docs/kratos-visual/KRATOSVISUALREFERENCE.md
- docs/kratos-visual/KRATOSVISUALACCEPTANCE.md

Pare e me diga:
- branch atual
- arquivos criados
- se a imagem foi encontrada
- próximo passo recomendado
```

### 13.4. SCRIPT 3 — Visual Bible e OCR

```txt
Agora crie a documentação visual completa do KRATOS com base na imagem anexada.
Crie/atualize:
- docs/kratos-visual/KRATOSUIBIBLE.md
- docs/kratos-visual/KRATOSIMAGEOCRSPEC.md
- docs/kratos-visual/KRATOSCOMPONENTMAP.md

Não implemente ainda. Só documente.
```

### 13.5. SCRIPT 4 — Implementação visual segura

```txt
Agora implemente o KRATOS Visual MVP de forma segura.
Use:
- docs/kratos-visual/KRATOSUIBIBLE.md
- docs/kratos-visual/KRATOSIMAGEOCRSPEC.md
- docs/kratos-visual/KRATOSCOMPONENTMAP.md
- frontend/public/references/kratos-control-reference.png

Regras:
- Não tocar no backend.
- Não alterar endpoints.
- Não alterar Mission Lens v1.
- Não alterar SSE.
- Não trocar Vite por Next.
- Não instalar Three.js agora.
- Pode usar mock apenas para áreas sem fonte real.

Ao final:
1. Rode npm run build.
2. Corrija erros.
3. Crie docs/kratos-visual/KRATOS1VISUALMVPIMPLEMENTATION.md
```

### 13.6. SCRIPT 5 — Ajuste visual comparando com imagem

```txt
Agora abra o preview e compare com a imagem de referência.
Ajuste apenas o visual, sem criar novas funcionalidades e sem mexer no backend.

Ao final:
1. Rode npm run build.
2. Atualize KRATOS1VISUALMVPIMPLEMENTATION.md
3. Crie KRATOS1VISUALCOMPARISON.md
```

### 13.7. SCRIPT 6 — Binding com dados reais

```txt
Agora faça a rodada de integração visual com dados reais, sem alterar backend.

Tarefas:
1. Mapear o shape real retornado por useLiveKratos.
2. Mapear onde a Tela Agora atual consumia dados reais antes do redesign.
3. Criar helpers defensivos para extrair currentMission, nextAction, risks, alerts, todayAgenda, etc.
4. Substituir mocks por dados reais onde possível.
5. Manter mocks só para ilhas, squads, trilha de foco e XP/nível/energia se necessário.
6. Todo dado mockado deve estar isolado em src/kratos/lib/kratos-visual-mock.ts.
```

### 13.8. SCRIPT 7 — Validação final e relatório

```txt
Agora faça validação final do KRATOS Frontend Codex.
Não implemente novas features.
Apenas valide, corrija bugs pequenos e documente.

Crie:
- docs/kratos-visual/KRATOS1FRONTENDCODEXFINALREPORT.md

No final, gere uma mensagem curta para Lucas com:
- o que foi feito
- como testar
- se pode ou não fazer merge
- próximos 3 passos
```

## 14. Estratégia Lovable

Os documentos do espaço convergem em uma diretriz muito clara: Lovable deve ser usado como camada de cockpit visual, nunca como cérebro, backend, schema manager ou orquestrador.[file:5][file:6]

### 14.1. `KRATOSLOVABLEKNOWLEDGE.md`

```md
# KRATOS Mission Control — Project Knowledge

## Função do projeto
Este projeto é APENAS a camada visual e operacional do KRATOS Mission Control.

## Regra máxima
O Lovable nunca deve:
- criar backend
- criar banco
- criar auth
- criar Supabase
- inventar APIs
- alterar contratos de API
- mexer na arquitetura real

## Stack congelada
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui

## Estética
- Apple-clean
- Linear / Raycast / Vercel vibe
- 80% observability/admin
- 20% cockpit/Jarvis
- 0% cyberpunk carnaval

## Estados obrigatórios por tela
- loading
- empty
- error
- degraded
- success

## Protocolo
Antes de codar:
1. Resuma o que entendeu.
2. Liste os arquivos a alterar.
3. Faça perguntas se houver ambiguidade.
4. Só então implemente.
```

### 14.2. `KRATOSAPIMAP.md`

```md
# KRATOS API MAP

Backend FastAPI local, fora do Lovable.
Banco SQLite no MVP.

## Endpoints planejados / existentes esperados
- GET /health
- GET /now
- GET /projects
- GET /projects/:id
- GET /system
- GET /docker
- GET /git
- GET /activity
- GET /tabs
- GET /checkpoints
- POST /checkpoints
- GET /timeline
- GET /outputs
- GET /logs
- GET /alerts
- GET /live/snapshot
- SSE /live/stream
```

### 14.3. `KRATOSUIMAP.md`

```md
# KRATOS UI MAP

## Página Agora
Widgets:
- NextActionCard
- RiskBanner
- StatusCard sistema
- StatusCard Docker
- StatusCard projetos
- Mini ActivityTimeline

## Página Projetos
Widgets:
- ProjectTable / ProjectCard list
- filtros por status, risco, atividade

## Página Projeto detalhe
Widgets:
- ProjectHeader
- CheckpointPanel
- ActivityTimeline
- RecentFiles
- RecentOutputs
- ServiceHealthTable

## Página Checkpoints
Widgets:
- CheckpointTimeline
- filtro manual/inferred

## Página Activity
Widgets:
- ActivityTimeline
- tempo por projeto/app

## Página Sistema
Widgets:
- métricas CPU/RAM/disk
- tabela Docker
- tabela collectors
- status Git

## Página Logs/Outputs
Widgets:
- LogsTable
- OutputsList
```

### 14.4. `KRATOSDATAMODEL.md`

```md
# KRATOS DATA MODEL MVP

## Projeto
- id
- name
- status
- description?
- createdAt
- lastActivityAt
- lastCheckpointAt?
- hasDirtyRepo
- hasUnhealthyContainers

## Mission
- id
- projectId
- missionTitle
- status
- whereIStopped
- nextAction
- blocker
- source: manual | inferred
- confidence?
- createdAt
- updatedAt

## Checkpoint
- id
- projectId
- missionTitle
- whereIStopped
- nextAction
- blocker
- source
- confidence?
- createdAt
- updatedAt

## ActivityEvent
- id
- timestampStart
- timestampEnd
- app
- windowTitle
- url?
- projectGuess
- missionGuess?
- source: window | browser | vscode

## RepoState
- id
- projectId
- repoName
- path
- branch
- isDirty
- lastCommitMessage
- lastCommitTime

## ContainerState
- id
- projectId
- name
- image
- status
- unhealthyReason?
- lastStateChange

## SystemMetrics
- id
- timestamp
- cpuPercent
- ramPercent
- diskCPercent
- diskGPercent?

## Output
- id
- projectId
- path
- type
- createdAt
- size
- summary?

## Log
- id
- projectId?
- source
- level
- message
- payload?
- timestamp

## Alert
- id
- type
- severity
- message
- projectId?
- createdAt
- resolvedAt?
```

### 14.5. `KRATOSSECURITYRULES.md`

```md
# KRATOS SECURITY RULES FOR LOVABLE

- Nunca manipular secrets, .env ou credenciais.
- Nunca expor paths sensíveis na UI; usar nomes amigáveis.
- Operações destrutivas (delete, prune, stop, rm) não fazem parte do MVP.
- Qualquer ação perigosa deve passar por backend + confirmação humana.
- Nenhuma função terminal remoto deve ser criada no frontend.
- Logs e outputs longos devem ser resumidos/truncados visualmente.
```

### 14.6. `KRATOSPROMPTSEQUENCE.md`

```md
# KRATOS Prompt Sequence para Lovable

0. Prompt de abertura
1. Shell e layout base
2. Página Agora
3. Página Projetos
4. Página Projeto detalhe
5. Página Checkpoints
6. Página Activity Timeline
7. Página Sistema/Serviços
8. Página Logs/Outputs
9. Refinos incrementais sempre com escopo cirúrgico
```

## 15. Arquivos de documentação do repositório

A partir de tudo o que foi consolidado, a base mínima de documentação do repositório deve incluir:[file:1][file:6]

```txt
docs/
  kratos-visual/
    KRATOS1FRONTENDCODEXSCOPE.md
    KRATOSVISUALREFERENCE.md
    KRATOSVISUALACCEPTANCE.md
    KRATOSUIBIBLE.md
    KRATOSIMAGEOCRSPEC.md
    KRATOSCOMPONENTMAP.md
    KRATOS1VISUALMVPIMPLEMENTATION.md
    KRATOS1VISUALCOMPARISON.md
    KRATOS1LIVEDATABINDING.md
    KRATOS1FRONTENDCODEXFINALREPORT.md
    KRATOS_V5_MANIFESTO_ROOT.md
    KRATOS_V5_SHELL_MANIFESTO.md
    KRATOS_V5_WORLD_MANIFESTO.md
    KRATOS_V5_HUD_MANIFESTO.md
    KRATOS_V5_AURORA_MANIFESTO.md
    KRATOS_V5_NEURO_UX_RULES.md
```

## 16. Pacote frontend inicial

Abaixo está um pacote inicial enxuto para plugar no projeto React/Vite/Tailwind, alinhado ao que foi consolidado nos materiais do espaço.[file:1][file:5]

### 16.1. `src/kratos/types.ts`

```ts
export type StatusLevel = 'critical' | 'warning' | 'ok' | 'info' | 'dormant'
export type LiveStatus = 'live' | 'degraded' | 'offline' | 'error'
export type ScreenId = 'now' | 'mentor' | 'context' | 'agenda' | 'checkpoints' | 'system' | 'arena'

export interface AlertItem {
  id: string
  level: StatusLevel
  title: string
  detail?: string
  timestamp?: string
}

export interface TaskItem {
  id: string
  title: string
  project?: string
  due?: string
  done?: boolean
  overdue?: boolean
  level?: StatusLevel
}

export interface ProjectRisk {
  id: string
  project: string
  reason: string
  level: StatusLevel
  nextAction?: string
}

export interface SystemMetric {
  label: string
  value: string
  level?: StatusLevel
  mono?: boolean
}

export interface DockerContainer {
  id: string
  name: string
  status: 'running' | 'unhealthy' | 'starting' | 'stopped'
  uptime?: string
  port?: string
}

export interface GitStatus {
  branch?: string
  unstaged?: number
  untracked?: number
  ahead?: number
  behind?: number
  lastCommit?: string
  synced?: boolean
}

export interface CollectorStatus {
  id: string
  name: string
  status: LiveStatus
  latency?: string
  lastSeen?: string
}

export interface ContextState {
  activeApp?: string
  activeWindow?: string
  inferredProject?: string
  confidencePct?: number
  focusState?: 'focused' | 'drifting' | 'lost'
  focusMinutes?: number
  awayMinutes?: number
  browserActiveTab?: string
  browserReason?: string
  openTabs?: number
}

export interface AgendaEvent {
  id: string
  time: string
  title: string
  project?: string
  current?: boolean
}

export interface Checkpoint {
  id: string
  timestamp: string
  project: string
  app: string
  note: string
  git?: string
  apps?: string
}

export interface LiveSnapshot {
  liveStatus: LiveStatus
  lastUpdatedLabel?: string
  activeProject?: string
  nextAction?: string
  alerts: AlertItem[]
  todayTasks: TaskItem[]
  risks: ProjectRisk[]
  systemMetrics: SystemMetric[]
  docker: DockerContainer[]
  git: GitStatus
  collectors: CollectorStatus[]
  context: ContextState
  agenda: AgendaEvent[]
  checkpoints: Checkpoint[]
}
```

### 16.2. `src/kratos/lib/kratos-worlds.ts`

```ts
export type KratosWorld = {
  id: string
  title: string
  subtitle: string
  description: string
  type: 'hub' | 'ai' | 'knowledge' | 'sales' | 'content' | 'life' | 'body' | 'wisdom' | 'finance' | 'ideas'
  color: string
  accent: string
  position: { x: number; y: number }
  status?: 'ok' | 'attention' | 'critical' | 'idle'
  route?: string
}

export const KRATOS_WORLDS: KratosWorld[] = [
  {
    id: 'hub',
    title: 'Castelo KRATOS',
    subtitle: 'Missão atual',
    description: 'Centro da missão, direção, foco e estado do reino.',
    type: 'hub',
    color: '#f8fafc',
    accent: '#ef4444',
    position: { x: 50, y: 38 },
    status: 'ok',
    route: '/agora'
  },
  {
    id: 'omnis-lab',
    title: 'Omnis Lab',
    subtitle: 'Automações e IAs',
    description: 'Agentes, automações, execução e infraestrutura de IA.',
    type: 'ai',
    color: '#22d3ee',
    accent: '#7c3aed',
    position: { x: 24, y: 20 },
    status: 'attention',
    route: '/omnis'
  },
  {
    id: 'agencia',
    title: 'Agência',
    subtitle: 'Conteúdo, marca e marketing',
    description: 'Instagram, páginas, campanhas e presença digital.',
    type: 'content',
    color: '#f97316',
    accent: '#fb7185',
    position: { x: 18, y: 44 },
    status: 'ok',
    route: '/agencia'
  },
  {
    id: 'vila-viva',
    title: 'Vila Viva',
    subtitle: 'Família e vida real',
    description: 'Presença, filhos, rotina e equilíbrio fora da máquina.',
    type: 'life',
    color: '#22c55e',
    accent: '#f59e0b',
    position: { x: 22, y: 70 },
    status: 'ok',
    route: '/vida'
  },
  {
    id: 'arena-comercial',
    title: 'Arena Comercial',
    subtitle: 'Vendas e negociação',
    description: 'CRM, follow-up, metas, receita e negociação.',
    type: 'sales',
    color: '#ef4444',
    accent: '#f59e0b',
    position: { x: 40, y: 78 },
    status: 'critical',
    route: '/arena'
  },
  {
    id: 'forja-corpo',
    title: 'Forja Corpo',
    subtitle: 'Treino, saúde e disciplina',
    description: 'Energia física, rotina e disciplina do operador.',
    type: 'body',
    color: '#f97316',
    accent: '#ef4444',
    position: { x: 56, y: 82 },
    status: 'idle',
    route: '/corpo'
  },
  {
    id: 'akasha',
    title: 'Akasha',
    subtitle: 'Memória e conhecimento',
    description: 'Pesquisa, contexto, arquivos, memória e docs.',
    type: 'knowledge',
    color: '#60a5fa',
    accent: '#c084fc',
    position: { x: 74, y: 22 },
    status: 'ok',
    route: '/akasha'
  },
  {
    id: 'filosofia',
    title: 'Filosofia & Sabedoria',
    subtitle: 'Estudo e evolução',
    description: 'Feynman, filosofia, síntese e refinamento mental.',
    type: 'wisdom',
    color: '#eab308',
    accent: '#fde68a',
    position: { x: 80, y: 46 },
    status: 'ok',
    route: '/academy'
  },
  {
    id: 'tesouro',
    title: 'Tesouro Finanças',
    subtitle: 'Caixa e patrimônio',
    description: 'Controle, caixa, metas e prosperidade organizada.',
    type: 'finance',
    color: '#facc15',
    accent: '#f59e0b',
    position: { x: 76, y: 68 },
    status: 'attention',
    route: '/financas'
  },
  {
    id: 'observatorio',
    title: 'Observatório',
    subtitle: 'Ideias e visão',
    description: 'Análise, futuro, estratégia e leitura do horizonte.',
    type: 'ideas',
    color: '#38bdf8',
    accent: '#a78bfa',
    position: { x: 88, y: 82 },
    status: 'idle',
    route: '/observatorio'
  }
]
```

### 16.3. `src/kratos/lib/kratos-visual-mock.ts`

```ts
import type { LiveSnapshot } from '../types'

export const mockKratosSnapshot: LiveSnapshot = {
  liveStatus: 'live',
  lastUpdatedLabel: '2s',
  activeProject: 'KRATOS Mission Control',
  nextAction: 'Finalizar a Tela Agora e validar leitura em 10 segundos',
  alerts: [
    { id: 'a1', level: 'critical', title: 'kratosdb unhealthy', detail: 'Container instável há 4 minutos.', timestamp: 'agora' },
    { id: 'a2', level: 'warning', title: 'Git com alterações abertas', detail: '3 arquivos modificados ainda sem commit.', timestamp: '8min' },
    { id: 'a3', level: 'ok', title: 'SSE conectado', detail: 'livestream ativo.', timestamp: '2s' }
  ],
  todayTasks: [
    { id: 't1', title: 'Fechar layout base do cockpit', project: 'KRATOS' },
    { id: 't2', title: 'Revisar tela Sistema/Serviços', project: 'KRATOS' },
    { id: 't3', title: 'Salvar checkpoint antes de trocar de contexto', project: 'KRATOS', done: true }
  ],
  risks: [
    { id: 'r1', project: 'KRATOS', reason: 'Sem commit limpo após alterações visuais.', level: 'warning', nextAction: 'Rodar build e commitar base.' },
    { id: 'r2', project: 'Arena Comercial', reason: 'Ainda visual; backend real deve esperar cockpit estabilizar.', level: 'info', nextAction: 'Manter mock até decisão SQLite.' }
  ],
  systemMetrics: [
    { label: 'CPU', value: '34', level: 'ok', mono: true },
    { label: 'RAM', value: '6.2GB', level: 'ok', mono: true },
    { label: 'Docker', value: '4/6', level: 'warning', mono: true },
    { label: 'Git', value: '3 unstaged', level: 'warning', mono: true },
    { label: 'SSE', value: 'live', level: 'ok', mono: true }
  ],
  docker: [
    { id: 'd1', name: 'kratosapi', status: 'running', uptime: '2h 14min', port: '8000' },
    { id: 'd2', name: 'kratosdb', status: 'unhealthy', uptime: '4min', port: '5432' },
    { id: 'd3', name: 'omnisagent', status: 'running', uptime: '5h 03min', port: '9000' },
    { id: 'd4', name: 'rediscache', status: 'starting', uptime: '0:32', port: '6379' }
  ],
  git: {
    branch: 'feat/kratos-visual-polish',
    unstaged: 3,
    untracked: 2,
    ahead: 0,
    behind: 0,
    lastCommit: 'refactor now screen layout',
    synced: true
  },
  collectors: [
    { id: 'c1', name: 'SSE livestream', status: 'live', latency: '12ms', lastSeen: '2s' },
    { id: 'c2', name: 'Context collector', status: 'live', lastSeen: '2s' },
    { id: 'c3', name: 'Git collector', status: 'degraded', latency: '45s', lastSeen: '45s' }
  ],
  context: {
    activeApp: 'Cursor',
    activeWindow: 'src/screens/NowScreen.tsx',
    inferredProject: 'KRATOS',
    confidencePct: 94,
    focusState: 'focused',
    focusMinutes: 47,
    awayMinutes: 0,
    browserActiveTab: 'Linear KRATOS #42',
    browserReason: 'Relacionada ao PR visual atual.',
    openTabs: 7
  },
  agenda: [
    { id: 'e1', time: '09:00', title: 'Desenvolvimento KRATOS', project: 'KRATOS', current: true },
    { id: 'e2', time: '14:00', title: 'Reunião clínica', project: 'Clínica' },
    { id: 'e3', time: '17:00', title: 'Revisão semanal', project: 'Operacional' }
  ],
  checkpoints: [
    { id: 'cp1', timestamp: '10:02', project: 'KRATOS', app: 'Cursor', note: 'Editando card de próxima ação e alertas.', git: 'feat/kratos-visual-polish 3 unstaged', apps: 'Cursor, Terminal, Linear' },
    { id: 'cp2', timestamp: '08:47', project: 'Clínica', app: 'Chrome', note: 'Revisando planilha de agendamentos.', apps: 'Chrome, Sheets, WhatsApp' }
  ]
}
```

### 16.4. `src/kratos/hooks/useKratosLiveSafe.ts`

```ts
import { useEffect, useMemo, useRef, useState } from 'react'
import type { LiveSnapshot, LiveStatus } from '../types'
import { mockKratosSnapshot } from '../lib/kratos-visual-mock'

interface Options {
  streamUrl?: string
  snapshotUrl?: string
  useMockFallback?: boolean
  pollingMs?: number
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeLiveEvent(prev: LiveSnapshot, incoming: unknown): LiveSnapshot {
  if (!isObject(incoming)) return prev

  if (typeof incoming.type === 'string' && 'payload' in incoming) {
    const type = incoming.type
    const payload = incoming.payload

    if (type === 'snapshot' && isObject(payload)) {
      return { ...prev, ...(payload as Partial<LiveSnapshot>) }
    }

    return {
      ...prev,
      [type]: payload,
      lastUpdatedLabel: 'agora'
    } as LiveSnapshot
  }

  return { ...prev, ...(incoming as Partial<LiveSnapshot>), lastUpdatedLabel: 'agora' }
}

async function fetchSnapshot(url: string): Promise<Partial<LiveSnapshot> | null> {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) return null
  const json = await response.json()
  if (json?.snapshot && typeof json.snapshot === 'object') return json.snapshot
  return json
}

export function useKratosLiveSafe(options: Options = {}) {
  const {
    streamUrl = '/live/stream',
    snapshotUrl = '/live/snapshot',
    useMockFallback = true,
    pollingMs = 15000
  } = options

  const [snapshot, setSnapshot] = useState<LiveSnapshot>(useMockFallback ? mockKratosSnapshot : { ...mockKratosSnapshot, liveStatus: 'offline' })
  const [connectionStatus, setConnectionStatus] = useState<LiveStatus>(useMockFallback ? 'live' : 'offline')
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const pollingRef = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadInitialSnapshot() {
      try {
        const data = await fetchSnapshot(snapshotUrl)
        if (!mounted || !data) return
        setSnapshot(prev => ({ ...prev, ...data, liveStatus: (data.liveStatus ?? prev.liveStatus) as LiveStatus }))
        setError(null)
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'snapshot unavailable')
      }
    }

    setConnectionStatus('degraded')
    loadInitialSnapshot()

    return () => {
      mounted = false
    }
  }, [snapshotUrl])

  useEffect(() => {
    let closed = false

    function startPolling() {
      if (pollingRef.current) return
      pollingRef.current = window.setInterval(async () => {
        try {
          const data = await fetchSnapshot(snapshotUrl)
          if (!data) return
          setSnapshot(prev => mergeLiveEvent(prev, data))
          setConnectionStatus('degraded')
          setError(null)
        } catch (err) {
          setConnectionStatus('offline')
          setError(err instanceof Error ? err.message : 'polling unavailable')
        }
      }, pollingMs)
    }

    function stopPolling() {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }

    function connect() {
      if (closed) return
      try {
        const es = new EventSource(streamUrl)
        eventSourceRef.current = es

        es.onopen = () => {
          stopPolling()
          setConnectionStatus('live')
          setSnapshot(prev => ({ ...prev, liveStatus: 'live', lastUpdatedLabel: 'agora' }))
          setError(null)
        }

        es.onmessage = event => {
          try {
            const data = JSON.parse(event.data)
            setSnapshot(prev => mergeLiveEvent(prev, data))
            setConnectionStatus('live')
            setError(null)
          } catch {
            setError('invalid SSE payload')
          }
        }

        es.onerror = () => {
          es.close()
          eventSourceRef.current = null
          setConnectionStatus('degraded')
          setSnapshot(prev => ({ ...prev, liveStatus: 'degraded' }))
          startPolling()
          if (!closed) window.setTimeout(connect, 5000)
        }
      } catch (err) {
        setConnectionStatus('degraded')
        setError(err instanceof Error ? err.message : 'SSE unavailable')
        startPolling()
      }
    }

    connect()

    return () => {
      closed = true
      if (eventSourceRef.current) eventSourceRef.current.close()
      stopPolling()
    }
  }, [streamUrl, snapshotUrl, pollingMs])

  return useMemo(
    () => ({
      snapshot,
      connectionStatus,
      error,
      isLive: connectionStatus === 'live',
      isDegraded: connectionStatus === 'degraded',
      isOffline: connectionStatus === 'offline' || connectionStatus === 'error'
    }),
    [snapshot, connectionStatus, error]
  )
}
```

### 16.5. `src/kratos/ui/StatusBadge.tsx`

```tsx
import type { StatusLevel } from '../types'

const levelStyles: Record<StatusLevel, string> = {
  critical: 'border-red-500/30 bg-red-500/15 text-red-300',
  warning: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
  ok: 'border-green-500/30 bg-green-500/15 text-green-300',
  info: 'border-blue-500/30 bg-blue-500/15 text-blue-300',
  dormant: 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400'
}

export function StatusBadge({ level, label, className = '' }: { level: StatusLevel; label: string; className?: string }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em]',
        levelStyles[level],
        className
      ].join(' ')}
    >
      {label}
    </span>
  )
}
```

### 16.6. `src/kratos/ui/LiveIndicator.tsx`

```tsx
import type { LiveStatus } from '../types'

const statusStyles: Record<LiveStatus, string> = {
  live: 'bg-green-400 shadow-[0_0_0_4px_rgba(34,197,94,0.08)] animate-pulse',
  degraded: 'bg-amber-400',
  offline: 'bg-zinc-500',
  error: 'bg-red-400'
}

export function LiveIndicator({ status, label, className = '' }: { status: LiveStatus; label?: string; className?: string }) {
  return (
    <span className={['inline-flex items-center gap-2', className].join(' ')}>
      <span className={['h-2 w-2 rounded-full', statusStyles[status]].join(' ')} />
      {label ? <span>{label}</span> : null}
    </span>
  )
}
```

### 16.7. `src/kratos/ui/PanelCard.tsx`

```tsx
import type { ReactNode } from 'react'

export function PanelCard({
  label,
  title,
  action,
  children,
  className = '',
  contentClassName = ''
}: {
  label?: string
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <section className={['rounded-xl border border-[#2A2A35] bg-[#111114] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-colors duration-150 hover:border-[#3A3A48]', className].join(' ')}>
      {(label || title || action) && (
        <div className="flex items-start justify-between gap-3 border-b border-white/5 px-4 py-3">
          <div className="space-y-1">
            {label ? <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</p> : null}
            {title ? <h3 className="text-sm font-semibold text-zinc-100">{title}</h3> : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      )}
      <div className={['p-4', contentClassName].join(' ')}>{children}</div>
    </section>
  )
}
```

### 16.8. `src/kratos/shell/KratosShell.tsx`

```tsx
import type { ReactNode } from 'react'
import type { LiveStatus, ScreenId } from '../types'
import { KratosSidebar } from './KratosSidebar'
import { KratosTopbar } from './KratosTopbar'
import { KratosStatusBar } from './KratosStatusBar'

export function KratosShell({
  activeScreen,
  activeProject,
  liveStatus,
  lastUpdatedLabel,
  error,
  children,
  aurora,
  onNavigate,
  onOpenCommand,
  onToggleAurora
}: {
  activeScreen: ScreenId
  activeProject?: string
  liveStatus: LiveStatus
  lastUpdatedLabel?: string
  error?: string | null
  children: ReactNode
  aurora?: ReactNode
  onNavigate: (screen: ScreenId) => void
  onOpenCommand: () => void
  onToggleAurora: () => void
}) {
  return (
    <div className="flex h-screen flex-col bg-[#0A0A0B] text-[#F2F2F3]">
      <KratosTopbar
        activeProject={activeProject}
        liveStatus={liveStatus}
        onOpenCommand={onOpenCommand}
        onToggleAurora={onToggleAurora}
      />

      <div className="flex min-h-0 flex-1">
        <KratosSidebar active={activeScreen} onNavigate={onNavigate} />
        <main className="min-w-0 flex-1 overflow-auto bg-[#0A0A0B]">{children}</main>
        {aurora}
      </div>

      <KratosStatusBar status={liveStatus} lastUpdatedLabel={lastUpdatedLabel} error={error} />
    </div>
  )
}
```

### 16.9. `src/kratos/shell/KratosSidebar.tsx`

```tsx
import type { ScreenId } from '../types'

const items: Array<{ id: ScreenId; label: string }> = [
  { id: 'now', label: 'Agora' },
  { id: 'mentor', label: 'Mentor' },
  { id: 'context', label: 'Contexto' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'checkpoints', label: 'Checkpoints' },
  { id: 'system', label: 'Sistema' },
  { id: 'arena', label: 'Arena' }
]

export function KratosSidebar({ active, onNavigate }: { active: ScreenId; onNavigate: (screen: ScreenId) => void }) {
  return (
    <aside className="hidden w-[220px] shrink-0 border-r border-white/5 bg-[#0D0D10] p-3 lg:block">
      <div className="mb-4 px-2">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">KRATOS</p>
        <p className="mt-1 text-sm font-semibold text-zinc-100">Mission Control</p>
      </div>
      <nav className="space-y-1">
        {items.map(item => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={[
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150',
                isActive ? 'bg-[#7B6FFF]/12 text-[#D8D4FF]' : 'text-zinc-400 hover:bg-[#18181C] hover:text-zinc-200'
              ].join(' ')}
            >
              <span className="h-2 w-2 rounded-full bg-current/80" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
```

### 16.10. `src/kratos/shell/KratosTopbar.tsx`

```tsx
import type { LiveStatus } from '../types'
import { LiveIndicator } from '../ui/LiveIndicator'

export function KratosTopbar({
  activeProject,
  liveStatus,
  onOpenCommand,
  onToggleAurora
}: {
  activeProject?: string
  liveStatus: LiveStatus
  onOpenCommand: () => void
  onToggleAurora: () => void
}) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-white/5 bg-[#0D0D10] px-4">
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Projeto atual</p>
        <p className="text-sm font-medium text-zinc-100">{activeProject ?? 'Sem projeto ativo'}</p>
      </div>
      <div className="flex items-center gap-3">
        <LiveIndicator status={liveStatus} label={liveStatus.toUpperCase()} className="text-xs text-zinc-400" />
        <button onClick={onOpenCommand} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5">
          CmdK
        </button>
        <button onClick={onToggleAurora} className="rounded-lg border border-[#7B6FFF]/20 bg-[#7B6FFF]/10 px-3 py-1.5 text-xs text-[#D8D4FF] hover:bg-[#7B6FFF]/15">
          Aurora
        </button>
      </div>
    </header>
  )
}
```

### 16.11. `src/kratos/shell/KratosStatusBar.tsx`

```tsx
import type { LiveStatus } from '../types'
import { LiveIndicator } from '../ui/LiveIndicator'

export function KratosStatusBar({ status, lastUpdatedLabel, error }: { status: LiveStatus; lastUpdatedLabel?: string; error?: string | null }) {
  return (
    <footer className="flex h-8 items-center justify-between border-t border-white/5 bg-[#0D0D10] px-4 text-[11px] text-zinc-500">
      <LiveIndicator status={status} label={status === 'live' ? `live • último update ${lastUpdatedLabel ?? 'agora'}` : status === 'degraded' ? 'degradado • usando fallback' : status} />
      <span>{error ?? 'checkpoint salvo 14min atrás'}</span>
    </footer>
  )
}
```

### 16.12. `src/kratos/aurora/AuroraPanel.tsx`

```tsx
import { PanelCard } from '../ui/PanelCard'

export function AuroraPanel() {
  return (
    <aside className="hidden w-[320px] shrink-0 border-l border-white/5 bg-[#0D0D10] p-3 xl:block">
      <PanelCard label="Aurora" title="Presença operacional" className="h-full">
        <div className="space-y-4">
          <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-3 text-sm text-cyan-100">
            Estou aqui para te ajudar a focar no que realmente importa hoje.
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300 hover:bg-white/5">onde parei?</button>
            <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300 hover:bg-white/5">próxima ação</button>
            <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300 hover:bg-white/5">salvar checkpoint</button>
          </div>
          <div className="space-y-2 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-sm text-zinc-300">
            <div className="rounded-lg bg-white/[0.03] p-2">Você parou em NowScreen.tsx, card de próxima ação.</div>
            <div className="rounded-lg bg-[#7B6FFF]/10 p-2 text-[#D8D4FF]">Próxima ação sugerida: fechar a base visual e validar leitura em 10 segundos.</div>
          </div>
          <input
            className="w-full rounded-lg border border-white/10 bg-[#111114] px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
            placeholder="O que você precisa saber?"
          />
        </div>
      </PanelCard>
    </aside>
  )
}
```

### 16.13. `src/kratos/world/KratosWorldMap.tsx`

```tsx
import { KRATOS_WORLDS } from '../lib/kratos-worlds'
import { PanelCard } from '../ui/PanelCard'

export function KratosWorldMap() {
  return (
    <PanelCard label="Mundo operacional" title="Mapa de ilhas" className="overflow-hidden">
      <div className="relative min-h-[520px] rounded-2xl bg-[radial-gradient(circle_at_top,#60a5fa_0%,#1d4ed8_35%,#0f172a_70%,#0a0a0b_100%)] p-6">
        <div className="absolute inset-x-6 bottom-4 h-24 rounded-[999px] bg-cyan-300/10 blur-2xl" />

        {KRATOS_WORLDS.map(world => (
          <div
            key={world.id}
            className="absolute rounded-2xl border border-white/15 bg-[#0f172acc] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-sm"
            style={{ left: `${world.position.x}%`, top: `${world.position.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: world.color }} />
              <p className="text-xs uppercase tracking-[0.16em] text-white/60">{world.subtitle}</p>
            </div>
            <h3 className="text-sm font-semibold text-white">{world.title}</h3>
            <p className="mt-1 max-w-[180px] text-xs leading-5 text-white/70">{world.description}</p>
          </div>
        ))}
      </div>
    </PanelCard>
  )
}
```

### 16.14. `src/kratos/screens/NowScreen.tsx`

```tsx
import { PanelCard } from '../ui/PanelCard'
import { StatusBadge } from '../ui/StatusBadge'
import { KratosWorldMap } from '../world/KratosWorldMap'
import type { LiveSnapshot } from '../types'

export function NowScreen({ snapshot }: { snapshot: LiveSnapshot }) {
  return (
    <div className="space-y-4 p-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <PanelCard label="Próxima ação" title="Missão dominante" className="min-h-[180px]">
          <p className="max-w-3xl text-3xl font-semibold leading-tight text-[#C9C4FF]">{snapshot.nextAction}</p>
          <p className="mt-3 text-sm text-zinc-400">Nada na tela deve competir com isso.</p>
        </PanelCard>

        <PanelCard label="Alertas agora" title="O que merece atenção">
          <div className="space-y-3">
            {snapshot.alerts.map(alert => (
              <div key={alert.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="mb-2 flex items-center gap-2">
                  <StatusBadge level={alert.level} label={alert.level} />
                  <span className="text-xs text-zinc-500">{alert.timestamp}</span>
                </div>
                <p className="text-sm font-medium text-zinc-100">{alert.title}</p>
                {alert.detail ? <p className="mt-1 text-sm text-zinc-400">{alert.detail}</p> : null}
              </div>
            ))}
          </div>
        </PanelCard>
      </div>

      <PanelCard label="Status do sistema" title="Leitura rápida">
        <div className="flex flex-wrap gap-2">
          {snapshot.systemMetrics.map(metric => (
            <div key={metric.label} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300">
              <span className="mr-2 text-zinc-500">{metric.label}</span>
              <span className={metric.mono ? 'font-mono' : ''}>{metric.value}</span>
            </div>
          ))}
        </div>
      </PanelCard>

      <KratosWorldMap />
    </div>
  )
}
```

## 17. Regras de neuro UX e ADHD-first

Os materiais do espaço deixam claro que o cockpit deve funcionar como “ambiente nervoso externo”, reduzindo custo de reentrada cognitiva e guiando execução sem humilhação, culpa ou overload visual.[file:3][file:5]

Regras consolidadas:

- Uma missão dominante por vez.[file:3][file:5]
- Uma próxima ação visualmente mais forte que o resto.[file:1][file:5]
- Nunca punir backlog; reorganizar e conduzir.[file:3]
- Sempre mostrar onde você parou, por que esta aba está aberta e como retomar.[file:5][file:6]
- Preferir feedback dopaminérgico elegante e não infantil.[file:3]
- Aurora confronta com gentileza operacional, não com frases motivacionais vazias.[file:5]
- Estados mentais futuros podem adaptar interface, mas a fase atual deve priorizar estrutura cognitiva estável antes de “magia”.[file:2]

## 18. Regras de performance e SSE

Os materiais consolidam algumas regras práticas para live data: EventSource para stream, fallback de polling/snapshot, stores ou hooks que minimizem re-render, uso de skeletons em vez de spinners, memoização de cards e estados `live`, `degraded`, `offline`, `empty` e `loading` sempre desenhados.[file:5]

A diretriz técnica é atualizar apenas campos específicos do snapshot quando possível, evitar objetos inline em componentes vivos, e manter o layout estável mesmo sem sinal, para que a sensação operacional continue intacta.[file:5]

A escolha de SSE continua coerente com as regras do projeto: não propor WebSocket se SSE já resolve o problema atual.[file:1]

## 19. Roadmap incremental

### Fase 1
- Shell
- design system local
- Tela Agora
- world-map 2D pseudo-3D
- Aurora lateral visual
- snapshot + stream seguros

### Fase 2
- Mentor
- Contexto
- Agenda
- Checkpoints
- Sistema/Serviços
- lapidação responsiva notebook

### Fase 3
- binding máximo com Mission Lens real
- squads vivos
- ilhas reagindo a status
- refinamento do modo foco

### Fase 4
- Arena Comercial real
- Aurora briefing real
- automações visuais de continuidade

### Fase 5
- 3D leve somente se realmente útil e estável

## 20. Checklist final de aceite

- Build passa.[file:1]
- Backend intacto.[file:1][file:6]
- `livestream` continua funcionando.[file:1]
- `livesnapshot` continua funcionando.[file:1]
- `useLiveKratos` ou wrapper equivalente continua preservado.[file:1]
- Missão atual entendível em 10 segundos.[file:1][file:5]
- Próxima ação é dominante.[file:5]
- Aurora aparece sem roubar a tela.[file:1][file:5]
- Sidebar, HUD e world-map ajudam, não poluem.[file:1]
- Cores vivas, mas legíveis.[file:1]
- Nada parece SaaS genérico, Grafana cru, cyberpunk poluído ou fantasia infantil.[file:1][file:5]
- Nenhum asset protegido foi copiado literalmente.[file:1]

## 21. Tabela textual consolidada

```txt
ARTEFATO / PASTA                                 | FUNÇÃO
-------------------------------------------------|---------------------------------------------------------
~/.codex/AGENTS.md                               | Regras globais do agente executor
repo/AGENTS.md                                   | Constituição operacional do Codex para o KRATOS
repo/.codex/skills/*                             | Especialização modular do Codex por domínio
frontend/public/references/                      | Imagem oficial de referência visual
frontend/src/kratos/shell/                       | Sidebar, topbar, statusbar, shell do cockpit
frontend/src/kratos/world/                       | Mapa, castelo, ilhas, fundo, pontes
frontend/src/kratos/hud/                         | Foco, agenda, progresso, squads, trilha
frontend/src/kratos/aurora/                      | Aurora lateral e presença contextual
frontend/src/kratos/mission/                     | Missão atual, próxima ação, do-not-do
frontend/src/kratos/ui/                          | Design system local reutilizável
frontend/src/kratos/hooks/                       | Live state, atalhos, integração SSE/snapshot
frontend/src/kratos/lib/                         | Worlds, mocks, helpers defensivos
frontend/docs/kratos-visual/                     | Bible, OCR, acceptance, reports, manifestos
KRATOSLOVABLEKNOWLEDGE.md                        | Guardrails de uso do Lovable
KRATOSAPIMAP.md                                  | Contratos e endpoints do cockpit
KRATOSUIMAP.md                                   | Mapa de widgets por tela
KRATOSDATAMODEL.md                               | Modelo mínimo de entidades do KRATOS
KRATOSSECURITYRULES.md                           | Regras de segurança e escopo do frontend
KRATOSPROMPTSEQUENCE.md                          | Ordem oficial de prompts modulares para Lovable
SCRIPT 0..7                                      | Sequência oficial para executar Codex com segurança
KRATOS_V5_MANIFESTO_ROOT.md                      | Norte do frontend e sua missão
KRATOS_V5_SHELL_MANIFESTO.md                     | Regras do shell e layout
KRATOS_V5_WORLD_MANIFESTO.md                     | Regras do mapa e das ilhas
KRATOS_V5_HUD_MANIFESTO.md                       | Regras do HUD e painéis
KRATOS_V5_AURORA_MANIFESTO.md                    | Regras de presença da Aurora
KRATOS_V5_NEURO_UX_RULES.md                      | Regras cognitivas e ADHD-first
```
