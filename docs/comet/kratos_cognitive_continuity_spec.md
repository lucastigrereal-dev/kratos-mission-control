# KRATOS COGNITIVE CONTINUITY SPEC

**Projeto:** KRATOS Mission Control  
**Versão:** 1.0  
**Data:** 2026-05-13  
**Status:** Documento canônico de produto e neuro UX  
**Base:** Pesquisa Deep Research Perplexity + KRATOS 0.9 + Auditoria Entregas vs Promessas

---

## 1. Definição Canônica

O **KRATOS Mission Control** é um sistema operacional de continuidade cognitiva.

Ele não existe apenas para organizar tarefas.
Ele existe para restaurar contexto mental, detectar drift, proteger hiperfoco e devolver ao operador o fio da missão.

> KRATOS não pergunta apenas: “onde está minha tarefa?”  
> KRATOS responde: “onde estava minha mente?”

Essa é a diferença central entre o KRATOS e ferramentas comuns de produtividade.

---

## 2. Tese Central

A maioria dos sistemas de produtividade trata fragmentação como problema de organização.

O KRATOS trata fragmentação como problema de continuidade mental.

Ferramentas comuns dizem:

- “organize sua lista”;
- “bloqueie distrações”;
- “planeje melhor seu dia”;
- “siga o calendário”;
- “mantenha a streak”.

KRATOS diz:

- “você estava nesta missão”;
- “você desviou sem perceber”;
- “este foi o contexto perdido”;
- “esta é a próxima ação de retorno”;
- “você não falhou, só perdeu o fio”;
- “vamos restaurar o estado mental e operacional”.

---

## 3. Relação com o Operating Model

Este documento complementa o `KRATOS_OPERATING_MODEL.md`.

O Operating Model define **quem faz o quê**:

```txt
KRATOS vê.
Aurora interpreta.
OMNIS/HOMINIS age.
Akasha lembra.
Codex/Claude constrói.
Lucas decide.
```

Este documento define **por que o KRATOS existe**:

```txt
KRATOS protege continuidade cognitiva.
KRATOS restaura contexto.
KRATOS reduz drift.
KRATOS protege flow.
KRATOS transforma caos mental em próxima ação clara.
```

---

## 4. O Problema Real

O problema central do operador criativo com TDAH não é falta de tarefas.

O problema é perda de continuidade.

Exemplos reais:

- abrir o navegador para uma coisa e sair 30 minutos depois em outra frente;
- começar uma missão técnica e abandonar após uma interrupção;
- perder o motivo original de estar com 12 abas abertas;
- voltar ao computador e não lembrar “onde estava minha mente”;
- confundir movimento com avanço;
- hiperfocar em uma lateral e esquecer a missão principal;
- ter muitas frentes abertas e nenhuma trilha de retomada.

KRATOS deve tratar isso como fenômeno operacional, não como defeito moral.

---

## 5. Princípios Neuro UX para TDAH

### 5.1 Próxima ação vence lista infinita

A interface deve sempre priorizar uma próxima ação clara.

Lista grande demais vira cemitério de intenção.

### 5.2 Drift não é fracasso

Quando o operador sai do foco, a microcopy não deve punir.

Ruim:

> “Você perdeu o foco.”

Bom:

> “Você saiu da missão original há 12 minutos. Quer voltar ou atualizar a missão?”

### 5.3 Regulação, não bloqueio cego

Bloquear tudo pode destruir o workflow real de uma mente não-linear.

O KRATOS deve diferenciar:

- drift destrutivo;
- troca produtiva;
- pesquisa necessária;
- interrupção externa;
- pausa legítima;
- hiperfoco útil.

### 5.4 Spatial memory

Elementos críticos devem ficar sempre no mesmo lugar.

O operador deve saber, pelo músculo visual:

- onde está a missão;
- onde está a próxima ação;
- onde estão alertas;
- onde está Aurora;
- onde estão contextos pausados;
- onde retomar.

### 5.5 Baixa competição por atenção

O KRATOS deve parecer vivo, mas não histérico.

Nada de carnaval de widgets.
Nada de 20 cards gritando.
Nada de gamificação infantil.

### 5.6 Hiperfoco é ativo estratégico

KRATOS não deve interromper o operador quando detectar flow.

Ele deve proteger.

### 5.7 Retomada sem vergonha

A interface deve reduzir o custo emocional de voltar.

O usuário não deve sentir:

> “sou um fracasso porque abandonei”.

Ele deve sentir:

> “o sistema guardou o fio; posso continuar”.

---

## 6. Anti-Patterns Proibidos

### 6.1 Calendário como tirano

Não assumir que o operador sabe prever duração real de tarefas.

### 6.2 Streak como chantagem emocional

Evitar gamificação baseada em sequência rígida.

Streak quebrada vira culpa, não evolução.

### 6.3 Bloqueador burro

Não bloquear distrações sem contexto.

Às vezes trocar rápido de contexto faz parte do modo produtivo.

### 6.4 Lista morta

Tarefa abandonada sem contexto vira lápide digital.

Toda tarefa importante deveria ter memória de abandono ou checkpoint.

### 6.5 Dashboard de culpa

Não mostrar 50 coisas atrasadas sem próxima ação de retorno.

### 6.6 Notificação agressiva

Interromper hiperfoco é crime operacional.

Nudges devem ser suaves, opcionais e contextuais.

---

## 7. Vocabulário do KRATOS

| Termo | Definição |
|---|---|
| **Missão** | Unidade cognitiva principal. Algo que o operador está tentando avançar. |
| **Sessão** | Janela temporal em que uma missão recebeu atenção real. |
| **Checkpoint** | Save-game mental e operacional de uma sessão. |
| **Drift** | Desvio não intencional da missão ativa. |
| **Switch** | Troca de contexto. Pode ser produtiva ou destrutiva. |
| **Stalling** | Travamento sem progresso observável. |
| **Overload** | Excesso de carga cognitiva, abas, decisões ou frentes abertas. |
| **Flow** | Estado de trabalho contínuo e produtivo que deve ser protegido. |
| **Restore** | Retomada guiada do contexto anterior. |
| **Ambient Memory** | Informação relevante aparecendo na periferia antes da busca ativa. |
| **Abandonment Memory** | Registro de por que uma missão foi deixada para trás. |

---

## 8. Os 4 Tiers de Intervenção

### Tier 1 — Ambient

Sempre visível, nunca intrusivo.

Exemplos:

- missão atual;
- próxima ação;
- estado live/cached/mock;
- progresso discreto;
- alerta de drift em cor suave;
- checkpoint disponível.

### Tier 2 — Nudge

Aparece quando um padrão é detectado.

Exemplos:

- “Você está há 15 minutos fora da missão original.”
- “Parece que você entrou em espiral de pesquisa.”
- “Você abriu 9 abas novas em 4 minutos. Quer organizar isso?”

### Tier 3 — Block

Só quando pré-configurado pelo usuário.

Exemplos:

- bloquear Twitter durante Modo Guerra;
- silenciar Slack durante hiperfoco;
- avisar antes de abrir uma nova frente;
- impedir nova missão sem checkpoint da atual.

### Tier 4 — Restore

Acionado pelo usuário ou sugerido após interrupção.

Exemplos:

- restaurar sessão anterior;
- reabrir tabs relevantes;
- mostrar resumo de onde parou;
- carregar arquivos e próximo passo;
- recuperar última decisão.

---

## 9. Features Anti-Fragmentação

### 9.1 Drift Detector — P0

Detecta quando o comportamento atual diverge da missão declarada.

Sinais:

- app/janela fora do projeto;
- tempo excessivo fora da missão;
- troca de domínio;
- navegação não relacionada;
- ausência de progresso no contexto ativo.

Intervenção:

> “Você abriu o navegador para pesquisar X, mas está há 18 minutos em Y. Quer voltar, pausar ou transformar isso em nova missão?”

Status no KRATOS atual:

- Parcialmente existente via ActivityWatch, context classifier e context drift.
- Precisa virar experiência visual clara no frontend.

---

### 9.2 One-Click Context Restore — P0/P1

Restaura contexto operacional de uma missão.

MVP seguro:

- mostrar último checkpoint;
- mostrar arquivos/contextos relacionados;
- mostrar última ação;
- mostrar motivo de pausa se houver;
- oferecer botão “retomar”.

Versão futura:

- reabrir tabs;
- reabrir arquivos;
- restaurar app state;
- carregar playlist;
- reativar workspace.

Status atual:

- Checkpoints reais já existem.
- Restore completo ainda ausente.

---

### 9.3 Stalling Detector — P0/P1

Detecta travamento cognitivo.

Sinais possíveis:

- mesma tela por muito tempo sem input;
- muitas abas abertas sem produção;
- alternância rápida entre arquivos sem edição;
- pesquisa longa sem output;
- loop entre terminal, navegador e editor sem commit/checkpoint.

Intervenção:

> “Parece que você travou aqui. Quer que eu resuma a tela, quebre em 3 passos ou salve checkpoint?”

Status atual:

- Ausente como feature dedicada.
- Pode nascer do ActivityWatch + context_loss_service.

---

### 9.4 Ambient Next Action — P0

Próxima ação sempre visível e atualizada.

Regra:

- não pode ser genérica;
- deve vir com razão;
- deve ser pequena;
- deve ter CTA claro.

Exemplo:

> “Finalizar GET /tasks em SQLite. Motivo: hoje POST salva real, mas GET lê mock.”

Status atual:

- Já existe via NBA engine e Mission Lens.
- Precisa ser o centro emocional do frontend.

---

### 9.5 Mission Memory Graph — P1/P2

Mapa visual de missões, contextos, arquivos e relações.

Não entra no MVP inicial.

Objetivo futuro:

- ver missões ativas;
- ver missões dormentes;
- ver relação entre projetos;
- navegar por contexto, não por pasta;
- usar spatial memory.

---

### 9.6 Interruption Recovery — P1

Detecta interrupções e salva contexto automaticamente.

Exemplos:

- reunião começa;
- ligação entra;
- app de call abre;
- mudança brusca de foco;
- ausência longa após atividade intensa.

Depois da interrupção:

> “Você estava finalizando o Operating Model. Quer retomar direto ou ver resumo?”

---

### 9.7 Energy-Aware Scheduling — P2

Sugere tipo de tarefa conforme padrão de energia.

Não entra agora.

Motivo:

- precisa de histórico confiável;
- pode virar pseudociência se feito cedo demais;
- primeiro precisamos de dados reais e consistentes.

---

### 9.8 Hyperfocus Protector — P1

Detecta flow e reduz interrupções.

Sinais:

- atividade contínua;
- poucas trocas;
- edição consistente;
- progresso observável;
- ausência de drift.

Ações futuras:

- silenciar alertas não críticos;
- manter HUD mínimo;
- evitar nudges;
- registrar sessão de flow.

---

### 9.9 Abandonment Memory — P2

Registra por que uma missão foi abandonada.

Exemplos:

- Slack interrompeu;
- reunião começou;
- erro técnico travou;
- pesquisa virou espiral;
- energia caiu;
- falta de clareza da próxima ação.

Uso futuro:

> “Você abandonou esse projeto 3 vezes depois de abrir WhatsApp. Quer proteger essa sessão?”

---

### 9.10 Collaborative Context Sharing — P3

Compartilhar snapshot de contexto com outra pessoa.

Não entra no core individual agora.

---

## 10. Stack de Memória — Decisão Pragmática

A pesquisa cita arquiteturas avançadas como dual-memory, graph memory, memory-as-OS-resource e episodic context reconstruction.

São referências excelentes, mas não devem ser implementadas todas agora.

### 10.1 O que entra agora

- SQLite como fonte operacional local.
- Checkpoints estruturados.
- Mission Lens como compact memory atual.
- Snapshots de collectors.
- Histórico mínimo de contexto.
- Source badges.
- Context drift.

### 10.2 O que entra depois

- embeddings locais;
- vector search;
- graph memory;
- memory palace;
- agent assistants por missão;
- retrieval híbrido;
- context reconstruction avançado.

### 10.3 Regra anti-feijoada

Não adicionar Qdrant, embeddings, grafo e LLM local antes de resolver:

1. tasks reais;
2. projects reais;
3. browser contexts reais;
4. source badges;
5. UX clara de next action;
6. restore básico via checkpoint.

---

## 11. Data Model Conceitual

### 11.1 Mission

```ts
type Mission = {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'dormant' | 'completed' | 'abandoned';
  current_session_id?: string;
  last_checkpoint_id?: string;
  next_action?: string;
  source: 'live' | 'cached' | 'fallback' | 'mock' | 'error';
};
```

### 11.2 Session

```ts
type Session = {
  id: string;
  mission_id: string;
  started_at: string;
  ended_at?: string;
  apps: AppActivity[];
  files: FileActivity[];
  tabs: BrowserTab[];
  cognitive_markers: {
    drift_detected: boolean;
    stalling_detected: boolean;
    overload_detected: boolean;
    flow_detected: boolean;
  };
  interruption_reason?: string;
  resume_hint?: string;
};
```

### 11.3 Checkpoint

```ts
type CognitiveCheckpoint = {
  id: string;
  mission_id: string;
  session_id?: string;
  created_at: string;
  summary: string;
  last_action: string;
  next_action: string;
  open_context: {
    apps: string[];
    files: string[];
    tabs: string[];
  };
  reason_for_pause?: string;
  source: 'manual' | 'auto' | 'interruption' | 'drift';
};
```

---

## 12. Visual Design Philosophy

### 12.1 HUD de videogame para adultos

O KRATOS deve ser legível em 1 segundo.

O operador deve bater o olho e saber:

- missão atual;
- próxima ação;
- estado do sistema;
- se está em drift;
- se pode restaurar contexto;
- o que não abrir.

### 12.2 Mundo vivo, não brinquedo

As ilhas flutuantes são metáfora operacional.

Cada ilha representa domínio de contexto, não decoração.

### 12.3 Diegetic UI

A informação deve parecer parte do mundo.

Exemplo:

- Palco Central mostra missão.
- Omnis Lab mostra agentes e automações.
- Akasha mostra memória.
- Arena mostra vendas.
- Forja mostra energia/corpo.

### 12.4 Regra dos 3 focos

Em qualquer tela principal, exibir no máximo 3 prioridades visuais:

1. Missão atual.
2. Próxima ação.
3. Alerta/risco mais importante.

O resto deve ser secundário, colapsável ou periférico.

---

## 13. Roadmap Pragmático KRATOS

### Fase 0 — Verdade Operacional

- GET /tasks em SQLite.
- GET /projects em SQLite.
- Corrigir alert_service.
- Badge de source.
- Documentar Operating Model.
- Documentar Cognitive Continuity Spec.

### Fase 1 — Frontend Mission Control MVP

- Palco Central.
- Mission Lens visual.
- Aurora panel.
- Próxima ação central.
- Drift state visual.
- Checkpoint/resume card.
- Source badges.
- Ilhas pseudo-3D.

### Fase 2 — Restore Básico

- Checkpoint preview.
- Últimas missões pausadas.
- Resume hint.
- Botão Retomar.
- Histórico de interrupções.

### Fase 3 — Stalling + Context Loss

- Endpoint de context loss.
- Detecção de research spiral.
- Detecção de idle/stalling.
- Nudges suaves.

### Fase 4 — OMNIS/HOMINIS Bridge

- Contrato de execução.
- Job tracking.
- Safety gate.
- Execução autorizada.

### Fase 5 — Memory Layer Avançada

- Embeddings locais.
- Busca semântica.
- Graph memory.
- Context reconstruction.

---

## 14. Métricas de Sucesso

### Métricas operacionais

- Tempo para saber próxima ação.
- Tempo para retomar contexto.
- Número de drift events detectados.
- Número de checkpoints salvos.
- Número de sessões restauradas.
- Redução de abas/contextos órfãos.

### Métricas cognitivas

- Redução de sensação de perda.
- Redução de culpa ao retomar.
- Aumento de sessões de flow.
- Menos fricção para voltar.
- Clareza em até 10 segundos.

### Métricas técnicas

- SSE saudável.
- Source badges corretos.
- Mock residual reduzido.
- Build limpo.
- Testes passando.
- Tempo de snapshot aceitável.

---

## 15. Prompt de Continuidade para Codex/Claude

```txt
Leia KRATOS_OPERATING_MODEL.md e KRATOS_COGNITIVE_CONTINUITY_SPEC.md antes de qualquer alteração.

O KRATOS não é app de tarefas.
Ele é sistema operacional de continuidade cognitiva.

Objetivo do produto:
- detectar drift mental;
- preservar contexto;
- restaurar sessões;
- proteger hiperfoco;
- mostrar próxima ação clara;
- reduzir culpa e overload;
- impedir que dados mock pareçam reais.

Antes de implementar, responda:
1. Essa mudança melhora continuidade cognitiva?
2. Qual entidade é dona da mudança: KRATOS, Aurora, OMNIS/HOMINIS, Akasha ou Codex?
3. A fonte de dados é live, cached, fallback, mock ou error?
4. Existe risco de confundir observação com execução?
5. Como validar sem quebrar Mission Lens, SSE ou backend?

Não implemente embeddings, Qdrant, graph memory ou LLM local nesta fase.
Prioridade atual:
1. corrigir mock residual de tasks/projects;
2. badge de source;
3. frontend visual baseado em missão, drift, checkpoint e próxima ação.
```

---

## 16. Veredito Final

A pesquisa confirma que o KRATOS não deve competir com Todoist, Motion, Sunsama, Notion ou trackers comuns.

Ele deve criar uma categoria própria:

> Operating System de continuidade cognitiva para operadores criativos, técnicos e neurodivergentes.

O diferencial não é uma feature isolada.

O diferencial é a combinação:

1. observação local-first;
2. memória operacional;
3. detecção de drift;
4. restauração de contexto;
5. intervenção suave;
6. UX neurocompatível;
7. execução futura via OMNIS/HOMINIS;
8. memória longa via Akasha;
9. interpretação via Aurora.

O KRATOS não organiza o trabalho.

Ele protege a mente que tenta trabalhar.

---

**Fim do documento.**

