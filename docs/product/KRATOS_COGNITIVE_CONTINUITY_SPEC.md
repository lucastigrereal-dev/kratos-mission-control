# KRATOS Cognitive Continuity Spec v1.0

**Status:** Canonical | **Version:** 1.0 | **Date:** 2026-05-13

---

## 1. Tese Central

**"Não é só onde está minha tarefa, é onde estava minha mente."**

KRATOS é um sistema operacional de continuidade cognitiva. Ele existe para resolver o problema fundamental de um operador solo com TDAH: a fragmentação da atenção ao longo do tempo.

Tasks se perdem. Listas se acumulam. Mas o pior é perder o **contexto mental** — aquele estado onde você sabia exatamente o que estava fazendo, por quê, e qual era o próximo passo.

KRATOS não substitui um task manager. Ele substitui a **memória de trabalho externa** que um operador solo não tem.

---

## 2. Princípios TDAH-First

### 2.1 Próxima ação vence lista infinita

Uma lista com 50 itens paralisa. Uma única próxima ação clara desbloqueia.
KRATOS sempre responde "o que eu faço AGORA?" — não "o que eu poderia fazer?".

### 2.2 Drift não é fracasso

Sair do foco é inevitável. O problema não é drift — é drift **sem consciência** e sem caminho de volta.
KRATOS detecta, nomeia e oferece retomada. Sem culpa. Sem julgamento.

### 2.3 Regulação, não bloqueio burro

Interrupções hard ("você não pode fazer isso!") geram rebeldia ou ansiedade.
KRATOS regula com nudges graduais: ambiental → nudge → block → restore.
Nunca bloqueia sem oferecer caminho alternativo.

### 2.4 Spatial memory

O cérebro TDAH lembra melhor por posição espacial do que por listas abstratas.
Componentes visuais com posição fixa > listas textuais que mudam de ordem.

### 2.5 Baixa competição por atenção

Cada elemento na tela compete pela atenção limitada.
Menos elementos, mais hierarquia visual, um foco claro por vez.

### 2.6 Hiperfoco deve ser protegido

Quando o operador entra em fluxo, a pior coisa é interromper.
KRATOS detecta hiperfoco e silencia alertas não-críticos.

### 2.7 Retomada sem vergonha

"Não lembro onde parei" é o maior inimigo da continuidade.
Checkpoints são salvos automaticamente. Restore é um clique. Sem fricção, sem culpa.

---

## 3. Vocabulário

| Termo | Definição |
|-------|-----------|
| **missão** | Unidade de trabalho com objetivo claro e dono definido. Pode ser um projeto, uma task, um sprint. |
| **sessão** | Período contínuo de trabalho focado em uma missão. Começa com um checkpoint e termina com outro. |
| **checkpoint** | Snapshot do contexto mental: app atual, janela, projeto, próxima ação, estado. Salvamento da memória de trabalho. |
| **drift** | Desvio do foco da missão atual para outra atividade. Detectado por comparação entre projeto inferido e missão esperada. |
| **switch** | Mudança de contexto entre aplicações ou abas. Contado por sessão para detectar fragmentação. |
| **stalling** | Estado de inação: operador está no contexto certo mas não avança. Detectado por tempo excessivo sem ação. |
| **overload** | Excesso de estímulos: muitas abas, muitos projetos paralelos, muitos alertas. |
| **flow** | Hiperfoco produtivo: baixo drift, baixo switching, progresso contínuo. |
| **restore** | Ato de retomar uma sessão anterior a partir de um checkpoint salvo. |
| **ambient memory** | Informação exibida passivamente no ambiente (cockpit sempre visível), sem exigir ação. |
| **abandonment memory** | Registro de projetos/tarefas abandonados, com contexto de por que foram deixados. |

---

## 4. Quatro Tiers de Intervenção

### Tier 1 — Ambient

**Sem interrupção.** Informação disponível no cockpit.
Ex: badge "[Você está há 30min no Instagram]" visível mas sem popup.
Ex: cor de fundo sutil muda quando drift > 15min.

### Tier 2 — Nudge

**Notificação suave.** Um toque, não um bloqueio.
Ex: "Salvar checkpoint?" após 45min de sessão.
Ex: "Retomar missão?" quando volta de pausa longa.

### Tier 3 — Block

**Intervenção ativa.** Bloqueio com justificativa clara e caminho alternativo.
Ex: "Você definiu que não abriria novos projetos hoje. Quer revisar essa regra?"
Ex: Modo guerra bloqueia redes sociais e exige justificativa para bypass.

### Tier 4 — Restore

**Recuperação de estado.** Restauração completa de contexto.
Ex: One-click restore de checkpoint: reabre apps, arquivos, abas, e mostra próxima ação.
Ex: "Você estava aqui há 3 dias. Isso era o que você estava fazendo: ..."

---

## 5. Features Anti-Fragmentação

### 5.1 Drift Detector [PARCIAL — backend OK, UI básica]

Detecta quando o operador está fora do foco da missão.
- Compara janela ativa com missão esperada
- Classifica severidade: low (<15min), medium (15-45min), high (>45min)
- Sugere recovery action com CTA

### 5.2 One-click Context Restore [AUSENTE]

Restaura checkpoint com um clique.
- Salva estado atual como checkpoint
- Reabre aplicações e arquivos do checkpoint anterior
- Mostra "onde você parou" e "próxima ação"
- Pré-requisito: tasks reais, projects reais, source badges

### 5.3 Stalling Detector [AUSENTE]

Detecta quando o operador está parado no contexto certo.
- Monitora inatividade dentro do projeto foco
- Nudge após N minutos sem progresso detectável
- Oferece: "Quer ajuda para quebrar isso em passo menor?"

### 5.4 Ambient Next Action [PARCIAL — NBA engine OK, exibição básica]

Próxima ação sempre visível, sem precisar navegar.
- NextBestActionCard no topo do cockpit
- Persiste entre sessões
- Atualiza automaticamente com regras de prioridade

### 5.5 Mission Memory Graph [AUSENTE — postergado: requer Qdrant/embeddings]

Grafo de relações entre missões, projetos e checkpoints.
- "Essa missão depende daquela?"
- "Qual foi a última vez que mexi nesse projeto?"
- Postergado pela regra anti-feijoada.

### 5.6 Interruption Recovery [AUSENTE]

Restaura contexto após interrupção externa.
- Detecta ausência (AFK) e prepara restore point
- Ao retornar: "Você estava fazendo X. Quer continuar?"
- Integração com ActivityWatch para detectar pausas

### 5.7 Hyperfocus Protector [AUSENTE]

Protege o fluxo quando hiperfoco é detectado.
- Silencia alertas não-críticos
- Bloqueia notificações externas (modo guerra light)
- Registra sessão de hiperfoco para análise posterior

### 5.8 Abandonment Memory [AUSENTE]

Registra e exibe projetos/tarefas abandonados com contexto.
- "Você abandonou X em 15/04. Motivo: bloqueado por API do Meta."
- Permite retomar com contexto preservado
- Pré-requisito: tasks reais, projects reais

---

## 6. Regra Anti-Feijoada

**NÃO implementar Qdrant, embeddings, graph memory, LLM local ou chat Aurora antes de corrigir:**

1. Tasks — GET/POST/PATCH consistentes (SQLite em todas as operações)
2. Projects — GET do SQLite, não mock JSON
3. Source badges — todo componente indica fonte dos dados
4. Context restore básico — salvar e retomar checkpoint com 1 clique
5. Stalling detection básico — "você está preso há 40min na mesma tela"

A ordem importa. Infraestrutura complexa sobre dados mock é castelo de areia.
Fundação sólida primeiro. Features avançadas depois.

---

## 7. Métricas de Continuidade Cognitiva

| Métrica | O que mede | Status |
|---------|-----------|--------|
| **Drift time** | Minutos fora do foco por dia | Coletado, sem analytics |
| **Switch count** | Trocas de contexto por sessão | Coletado, sem exibição |
| **Session length** | Duração de sessões focadas | Coletado, sem analytics |
| **Checkpoint frequency** | Frequência de salvamento de contexto | Coletado |
| **Restore success** | % de checkpoints que foram restaurados | Não implementado |
| **Abandonment rate** | Projetos abertos vs abandonados | Parcial (regra G) |
| **Flow time** | Minutos em estado de flow | Não implementado |

---

## 8. Arquitetura de Dados de Continuidade

```
ActivityWatch ──→ janela ativa, abas, AFK
      │
      ├──→ context_classifier ──→ projeto inferido, confiança
      │
      ├──→ context_drift ──→ estado (on_focus/off_focus/unknown), severidade
      │
      ├──→ checkpoint_suggestion ──→ should_suggest, trigger, cooldown
      │
      └──→ context_loss ──→ 5 padrões de perda de contexto

Contexto composto ──→ Mission Lens v1 (9 blocos)
      │
      └──→ SSE push (/live/stream) a cada 5s
            │
            └──→ Frontend: 5 estados de conexão
                  live → reconnecting → polling → fallback → offline
```

---

## 9. Roadmap de Continuidade

| Fase | O quê | Dependência |
|------|-------|-------------|
| **0.10** (atual) | Verdade operacional: tasks SQLite, projects SQLite, source badges, docs canônicos | — |
| **0.11** | Context restore 1-click + stalling detection básico | 0.10 completo |
| **1.0** | Redesign visual com ilhas + ambient memory | 0.11 completo |
| **1.1** | Hyperfocus protector + interruption recovery | 1.0 completo |
| **1.2** | Abandonment memory + métricas cognitivas | 1.1 completo |
| **2.0** | Aurora chat + Mission Memory Graph + analytics | 1.2 completo |

---

*Documento canônico. Alterações requerem PR e atualização da versão.*
