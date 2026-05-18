---
id: kratos-context-screen
name: Kratos Context Screen
description: Implementa a tela 'Contexto', focada na visualização e gestão do contexto operacional do operador, incluindo detecção de drift.
tags: [screen, context, neuro-ux, focus, activitywatch, drift]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Context Screen

## 1. Propósito
Esta skill é responsável por implementar a tela 'Contexto' (`Contexto.tsx`) no KRATOS Mission Control. O objetivo principal é fornecer ao operador uma visão clara e detalhada de seu contexto operacional atual, histórico de atividades, janelas ativas e, crucialmente, detectar e visualizar o 'drift' (desvio) de foco. A tela deve ser neurocompatível, ajudando o operador a entender onde está, onde esteve e como retomar o foco, minimizando a carga cognitiva [1] [2].

## 2. Quando Usar
- Ao desenvolver ou modificar a página `Contexto.tsx`.
- Ao integrar dados de contexto do backend (e.g., `activitywatch_collector`, `context_drift_service`).
- Ao implementar visualizações para janelas ativas, abas do navegador, trocas de contexto e detecção de drift.
- Ao criar funcionalidades para 'checkpoint' de contexto ou sugestões de recuperação de foco.

## 3. Quando NÃO Usar
- Para lógica de negócio específica de outras telas (e.g., `Agenda`, `Projetos`).
- Para a criação de componentes de UI genéricos que não são exclusivos da tela 'Contexto' (usar `kratos-design-system`).
- Para a configuração de aspectos fundamentais da aplicação (usar `kratos-foundation`).

## 4. Inputs Esperados
- Dados dos endpoints de contexto do backend: `/context/current`, `/context/lost`, `/context/project-guess` [1].
- Dados de atividade: `/activity/windows`, `/activity/browser`, `/activity/sessions`, `/activity/context-switches` [1].
- Payloads do `live_snapshot` que contenham informações de contexto.

## 5. Arquivos que Pode Tocar
- `frontend/src/pages/Contexto.tsx` (componente principal da tela).
- `frontend/src/hooks/useLiveKratos.ts` (para consumir o stream SSE e dados de contexto em tempo real).
- `frontend/src/lib/api.ts` (para métodos de API relacionados a contexto, como `POST /context/checkpoint`).
- `frontend/src/types/kratos.ts` (para tipagem dos dados de contexto e atividade).
- Componentes em `frontend/src/components/` que exibem informações de contexto (e.g., lista de janelas, gráfico de drift).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` (o backend é a fonte dos dados, não o alvo de modificação por esta skill) [1].
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`), a menos que a alteração seja estritamente necessária para a rota da tela 'Contexto'.
- Arquivos de lógica de negócio ou serviços que não impactam diretamente a tela 'Contexto'.

## 7. Definição de Pronto
- A tela 'Contexto' é renderizada corretamente, exibindo informações de contexto, atividade e drift de forma clara e organizada [2].
- Os dados são atualizados em tempo real, refletindo o estado atual do operador e do sistema [1].
- A interface é neurocompatível, com baixa carga cognitiva e visualizações que facilitam a compreensão do contexto e a detecção de desvios [2].
- As interações para criar checkpoints ou visualizar detalhes de atividades são fluidas e intuitivas.

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` para layout, cores e tipografia da tela 'Contexto' [2].
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para princípios de Neuro-UX aplicáveis à gestão de contexto (clareza, feedback, retomada de foco) [1].
- [ ] Implementado o componente `Contexto.tsx` e seus subcomponentes.
- [ ] Consumidos os dados dos endpoints `/context/*` e `/activity/*` via `useLiveKratos` ou `api.ts`.
- [ ] Desenvolvidas visualizações para:
    - Janela/aba ativa atual.
    - Histórico de janelas/abas recentes.
    - Gráfico ou indicador de 'context drift' (on_focus/related/off_focus/unknown) [1].
    - Sugestões de 'recovery_action' baseadas no drift [1].
- [ ] Implementada a funcionalidade de criar um checkpoint de contexto (`POST /context/checkpoint`).
- [ ] Garantido que a apresentação dos dados de contexto não sobrecarrega o operador.

## 9. Anti-Patterns
- Exibir dados brutos do ActivityWatch sem processamento ou classificação, aumentando a carga cognitiva.
- Não fornecer uma representação visual clara do 'context drift', tornando difícil para o operador identificar desvios.
- Exigir que o operador navegue por múltiplas telas para entender seu contexto atual.
- Não oferecer ações claras para retomar o foco após a detecção de um drift.

## 10. Exemplos de Execução
- **Cenário:** Exibir a janela ativa atual e o projeto associado.
  - **Ação:** No `Contexto.tsx`, consumir `/context/current` e renderizar o título da janela e o `project_guess` (classificado pelo `context_classifier_service.py`) de forma proeminente [1].
- **Cenário:** Visualizar o histórico de trocas de contexto.
  - **Ação:** Criar um componente de lista ou gráfico que exiba os dados de `/activity/context-switches`, mostrando a frequência e a duração das trocas de contexto entre projetos [1].

## 11. Guardrails
- A sanitização de dados sensíveis do ActivityWatch (`activitywatch_collector.py`) deve ser respeitada, e nenhuma informação filtrada deve ser exibida no frontend [1].
- A lógica de classificação de contexto (`context_classifier_service.py`) deve ser utilizada para associar janelas/abas a projetos [1].
- A funcionalidade de 'checkpoint' deve ser clara e fácil de usar, com feedback visual após a criação.

## 12. Critérios de Qualidade
- **Clareza do Contexto:** O operador deve ser capaz de entender seu contexto atual e histórico rapidamente.
- **Detecção de Drift:** A tela deve efetivamente alertar o operador sobre desvios de foco de forma não intrusiva.
- **Facilitação da Retomada:** As sugestões de 'recovery_action' devem ser úteis e acionáveis.
- **Baixa Carga Cognitiva:** A apresentação visual dos dados de contexto deve ser otimizada para a mente com TDAH.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado da implementação da tela 'Contexto', descrevendo os componentes criados, como os dados de contexto e atividade são consumidos e visualizados, e uma confirmação de que os princípios de Neuro-UX e as diretrizes visuais foram rigorosamente seguidos. Inclua uma avaliação da eficácia da detecção de drift e das ações de retomada de foco.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
