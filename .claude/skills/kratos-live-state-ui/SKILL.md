---
id: kratos-live-state-ui
name: Kratos Live State UI
description: Gerencia a exibição de estados e dados em tempo real na interface do KRATOS, utilizando indicadores visuais e o stream SSE.
tags: [ui, live-data, real-time, sse, state-management, indicators]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Live State UI

## 1. Propósito
Esta skill é responsável por implementar e manter a exibição de estados e dados em tempo real na interface do KRATOS Mission Control. O objetivo é garantir que o operador tenha uma visão clara e imediata do status do sistema, dos coletores e das atividades em andamento, utilizando os indicadores visuais definidos na `docs/kratos-visual/KRATOS_UI_BIBLE.md` e consumindo o stream SSE (`/live/stream`) do backend [1] [2].

## 2. Quando Usar
- Ao desenvolver ou modificar qualquer componente de UI que exiba dados em tempo real ou o status de um subsistema.
- Ao integrar novos dados do stream SSE para visualização no frontend.
- Ao implementar os indicadores visuais de estado (ONLINE, DEGRADED, ERROR, RECONNECTING, OFFLINE, LOADING, LIVE, STALE) [2].
- Ao otimizar a performance da renderização de dados em tempo real.

## 3. Quando NÃO Usar
- Para lógica de negócio que não está diretamente ligada à exibição de estados em tempo real.
- Para a implementação de componentes de UI genéricos sem estado dinâmico (usar `kratos-design-system`).
- Para a configuração do próprio stream SSE (usar `kratos-sse-performance`).

## 4. Inputs Esperados
- Payloads do stream SSE (`/live/stream`) contendo o `live_snapshot` do sistema [1].
- Dados de status de coletores, serviços ou entidades que precisam ser representados visualmente.

## 5. Arquivos que Pode Tocar
- `frontend/src/hooks/useLiveKratos.ts` (para consumir e processar o stream SSE).
- `frontend/src/types/kratos.ts` (para definir interfaces de dados do `live_snapshot`).
- `frontend/src/components/ui/SystemStatusBadge.tsx`
- `frontend/src/components/**/*.tsx` e `frontend/src/pages/**/*.tsx` que exibem dados em tempo real (e.g., `TopBar.tsx`, `Sistema.tsx`, `OmnisSnapshot.tsx`).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` [1].
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`), a menos que a alteração seja estritamente necessária para integrar o sistema de estados.
- Arquivos de lógica de negócio ou serviços que não impactam diretamente a UI de estado ao vivo.

## 7. Definição de Pronto
- Os estados do sistema e os dados em tempo real são exibidos corretamente na UI, utilizando os indicadores visuais definidos na `docs/kratos-visual/KRATOS_UI_BIBLE.md` [2].
- A UI reage dinamicamente às atualizações do stream SSE, sem atrasos perceptíveis.
- A performance da renderização de dados em tempo real é otimizada, evitando re-renders desnecessários.
- A carga cognitiva é minimizada através de feedback visual claro e conciso [3].

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` para os indicadores visuais de estado (cores, ícones, comportamento) [2].
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para princípios de Neuro-UX aplicáveis à exibição de estados [3].
- [ ] Utilizado `useLiveKratos.ts` para consumir o stream `/live/stream` [1].
- [ ] Implementados os componentes de UI para exibir os dados do `live_snapshot`.
- [ ] Assegurado que os indicadores de estado (e.g., `SystemStatusBadge`) refletem o status atual do backend.
- [ ] Otimizada a renderização para evitar flickering ou lentidão em atualizações rápidas.

## 9. Anti-Patterns
- Fazer polling HTTP excessivo para dados que deveriam vir via SSE.
- Ignorar os estados de `LOADING` ou `STALE`, apresentando dados incompletos ou desatualizados sem indicação.
- Usar animações complexas ou piscantes para indicar estados, causando distração.
- Não fornecer feedback visual quando o sistema está `RECONNECTING` ou `OFFLINE`.

## 10. Exemplos de Execução
- **Cenário:** Exibir o status dos coletores na página `Sistema.tsx`.
  - **Ação:** Consumir a seção `collector_status` do `live_snapshot` via `useLiveKratos` e renderizar uma lista de coletores com seus respectivos `SystemStatusBadge` (OK, DEGRADED, ERROR) [1] [2].
- **Cenário:** Atualizar o `ProgressRing` na `RightSidebar` com o progresso geral do mês.
  - **Ação:** Consumir o valor de `progress_geral` do `live_snapshot` e atualizar o componente `ProgressRing` de forma suave e animada [2].

## 11. Guardrails
- A lógica de consumo do SSE deve ser centralizada em `useLiveKratos.ts`.
- A tipagem dos dados do `live_snapshot` em `frontend/src/types/kratos.ts` deve ser rigorosa.
- A exibição de dados em tempo real deve ser sempre acompanhada de um indicador de estado relevante.

## 12. Critérios de Qualidade
- **Precisão:** Os dados exibidos devem ser um reflexo exato e atualizado do estado do sistema.
- **Reatividade:** A UI deve responder imediatamente às mudanças no stream SSE.
- **Clareza:** Os indicadores de estado devem ser intuitivos e facilmente compreendidos pelo operador.
- **Performance:** A exibição de dados em tempo real não deve impactar negativamente a fluidez da interface.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado da implementação da exibição de estados e dados em tempo real, descrevendo os componentes afetados, como o stream SSE é consumido e uma confirmação de que os indicadores visuais e os princípios de Neuro-UX foram rigorosamente seguidos, com referência à `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md`.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
