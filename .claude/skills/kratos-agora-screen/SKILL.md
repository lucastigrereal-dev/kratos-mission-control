---
id: kratos-agora-screen
name: Kratos Agora Screen
description: Implementa a tela principal 'Agora' (Mission Control HQ), exibindo o estado atual do operador e do sistema.
tags: [screen, agora, mission-control, hq, overview, live-data]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Agora Screen

## 1. Propósito
Esta skill é responsável por implementar a tela principal do KRATOS, denominada 'Agora' (Mission Control HQ). Esta tela serve como o ponto central de controle e visão geral para o operador, exibindo um resumo consolidado do estado atual do sistema, da missão e do foco. O objetivo é fornecer uma visão clara e imediata do que é mais importante, minimizando a carga cognitiva e facilitando a tomada de decisão [1] [2].

## 2. Quando Usar
- Ao desenvolver ou modificar a página `Agora.tsx`.
- Ao integrar novos widgets ou informações que precisam ser exibidas na tela principal.
- Ao ajustar o layout ou a interatividade da tela 'Agora'.
- Ao garantir que os dados em tempo real do backend sejam corretamente exibidos nesta tela.

## 3. Quando NÃO Usar
- Para lógica de negócio específica de outras telas (e.g., `Agenda`, `Projetos`).
- Para a criação de componentes de UI genéricos que não são exclusivos da tela 'Agora' (usar `kratos-design-system`).
- Para a configuração de aspectos fundamentais da aplicação (usar `kratos-foundation`).

## 4. Inputs Esperados
- Dados do `live_snapshot` do backend, incluindo `mission_lens`, `mentor_signals`, `today_agenda`, `today_execution`, `alerts`, `next_best_action`, `recent_checkpoints`, `context`, `collector_status` [1].
- Interações do usuário com os widgets da tela.

## 5. Arquivos que Pode Tocar
- `frontend/src/pages/Agora.tsx` (componente principal da tela).
- `frontend/src/components/widgets/*.tsx` (widgets exibidos na tela 'Agora').
- `frontend/src/hooks/useLiveKratos.ts` (para consumir o stream SSE).
- `frontend/src/types/kratos.ts` (para tipagem dos dados do `live_snapshot`).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` [1].
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`), a menos que a alteração seja estritamente necessária para a rota da tela 'Agora'.
- Arquivos de lógica de negócio ou serviços que não impactam diretamente a tela 'Agora'.

## 7. Definição de Pronto
- A tela 'Agora' é renderizada corretamente, exibindo todos os widgets e informações conforme a `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `docs/kratos-visual/KRATOS_IMAGE_OCR_SPEC.md` [2] [3].
- Os dados são atualizados em tempo real via SSE, refletindo o estado atual do sistema e do operador [1].
- A interface é neurocompatível, com baixa carga cognitiva e foco claro na missão atual e próxima ação [2].
- As interações são fluidas e fornecem feedback visual instantâneo.

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `docs/kratos-visual/KRATOS_IMAGE_OCR_SPEC.md` para o layout e conteúdo da tela 'Agora' [2] [3].
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para princípios de Neuro-UX aplicáveis à tela 'Agora' [1].
- [ ] Implementado o componente `Agora.tsx` e seus subcomponentes (widgets).
- [ ] Consumidos os dados do `live_snapshot` via `useLiveKratos` para popular os widgets.
- [ ] Garantido que a 
informação mais crítica (Missão Atual, Foco do Dia, Próxima Ação) é proeminente e de fácil acesso.
- [ ] Assegurado que as transições para outras telas (e.g., clicando em um item da agenda) são fluidas.

## 9. Anti-Patterns
- Sobrecarregar a tela 'Agora' com informações secundárias ou irrelevantes, aumentando a carga cognitiva.
- Não atualizar os dados em tempo real, fazendo com que a tela mostre informações desatualizadas.
- Usar animações ou elementos visuais que distraiam o operador do foco principal.
- Exigir muitos cliques ou navegação complexa para acessar informações essenciais.

## 10. Exemplos de Execução
- **Cenário:** Exibir o widget "Foco do Dia" na sidebar direita da tela 'Agora'.
  - **Ação:** Criar o componente `DailyFocusWidget` que consome dados do `live_snapshot` (seção `today_execution`) e renderiza as tarefas importantes, projetos em andamento e reuniões, destacando o foco principal com tipografia Poppins ExtraBold [2] [3].
- **Cenário:** Atualizar o 
widget "Progresso Geral" com o percentual de conclusão do mês.
  - **Ação:** Criar o componente `ProgressWidget` que consome o `progress_geral` do `live_snapshot` e renderiza um `ProgressRing` circular, exibindo o percentual e a descrição "Do mês concluído" [2] [3].

## 11. Guardrails
- A tela 'Agora' deve ser a primeira tela a ser carregada após a inicialização do aplicativo.
- A lógica de apresentação de dados deve ser otimizada para performance, evitando re-renders desnecessários.
- Qualquer nova informação adicionada à tela deve ser avaliada quanto ao seu impacto na carga cognitiva e na clareza.
- O botão "Falar com Aurora" deve estar sempre acessível para o operador interagir com a assistente contextual.

## 12. Critérios de Qualidade
- **Clareza Operacional:** O operador deve ser capaz de compreender o estado geral e a próxima ação em segundos.
- **Reatividade:** A tela deve refletir as atualizações do sistema em tempo real de forma fluida.
- **Foco:** A interface deve guiar o olhar do operador para as informações mais críticas, minimizando distrações.
- **Consistência:** O layout e os componentes devem ser consistentes com a `docs/kratos-visual/KRATOS_UI_BIBLE.md`.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado da implementação da tela 'Agora', descrevendo os componentes principais, como os dados do `live_snapshot` são consumidos e uma confirmação de que os princípios de Neuro-UX e as diretrizes visuais foram rigorosamente seguidos. Inclua uma avaliação da clareza operacional e da reatividade da tela.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] docs/kratos-visual/KRATOS_IMAGE_OCR_SPEC.md. (2026-05-13).
[4] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
