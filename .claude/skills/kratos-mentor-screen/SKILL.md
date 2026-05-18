---
id: kratos-mentor-screen
name: Kratos Mentor Screen
description: Implementa a tela 'Mentor', exibindo recomendações, sinais operacionais e insights do motor de inteligência do KRATOS.
tags: [screen, mentor, ai, recommendations, next-best-action, neuro-ux]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Mentor Screen

## 1. Propósito
Esta skill é responsável por implementar a tela 'Mentor' no KRATOS Mission Control. O objetivo é fornecer ao operador uma interface para visualizar as recomendações do motor de inteligência (NBA Engine) do KRATOS, sinais operacionais, próximas melhores ações e insights contextuais. A tela deve ser neurocompatível, apresentando essas informações de forma clara, acionável e com baixa carga cognitiva, ajudando o operador a tomar decisões informadas e a manter o foco [1] [2].

## 2. Quando Usar
- Ao desenvolver ou modificar a página `Mentor.tsx` (se existir, ou integrar em `Agora.tsx` ou `Contexto.tsx` conforme o design).
- Ao integrar dados de recomendações, sinais e próximas ações do backend (e.g., `mentor_decision_service.py`, `mentor_signal_service.py`).
- Ao implementar visualizações para as 9 regras de decisão do mentor (repo_dirty, no_next_action, output_unreviewed, etc.) [1].
- Ao criar funcionalidades para interagir com as recomendações (completar, dispensar, adiar).

## 3. Quando NÃO Usar
- Para lógica de negócio específica de outras telas (e.g., `Agenda`, `Sistema`).
- Para a criação de componentes de UI genéricos que não são exclusivos da tela 'Mentor' (usar `kratos-design-system`).
- Para a configuração de aspectos fundamentais da aplicação (usar `kratos-foundation`).

## 4. Inputs Esperados
- Dados dos endpoints do mentor do backend: `/mentor/summary`, `/mentor/next-action`, `/mentor/recommendations`, `/mentor/next-best-action`, `/mentor/projects-at-risk`, `/mentor/context-signals` [1].
- Payloads do `live_snapshot` que contenham `mentor_signals` e `next_best_action` [1].
- Interações do usuário para gerenciar as recomendações.

## 5. Arquivos que Pode Tocar
- `frontend/src/pages/Mentor.tsx` (se for uma página dedicada).
- `frontend/src/pages/Agora.tsx` ou `frontend/src/pages/Contexto.tsx` (se a funcionalidade do mentor for integrada nestas telas).
- `frontend/src/lib/api.ts` (para métodos de API relacionados ao mentor).
- `frontend/src/types/kratos.ts` (para tipagem dos dados de recomendações e sinais).
- Componentes em `frontend/src/components/` que exibem informações do mentor (e.g., `RecommendationCard`, `NextBestActionWidget`).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` (o backend é a fonte dos dados, não o alvo de modificação por esta skill) [1].
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`), a menos que a alteração seja estritamente necessária para a rota da tela 'Mentor'.
- Arquivos de lógica de negócio ou serviços que não impactam diretamente a tela 'Mentor'.

## 7. Definição de Pronto
- A tela 'Mentor' (ou a seção do mentor) é renderizada corretamente, exibindo recomendações e sinais operacionais de forma clara e acionável, conforme a `docs/kratos-visual/KRATOS_UI_BIBLE.md` [2].
- Os dados são atualizados em tempo real, refletindo as últimas análises do motor de inteligência [1].
- A interface é neurocompatível, com baixa carga cognitiva e visualizações que facilitam a compreensão e a interação com as recomendações [2].
- As funcionalidades de gerenciar recomendações (completar, dispensar, adiar) são intuitivas e fornecem feedback claro.

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` para layout, cores e tipografia da tela 'Mentor' [2].
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para princípios de Neuro-UX aplicáveis à apresentação de recomendações (clareza, acionabilidade, feedback) [1].
- [ ] Implementado o componente `Mentor.tsx` ou a seção do mentor em uma tela existente.
- [ ] Consumidos os dados dos endpoints `/mentor/*` via `api.ts` ou `useLiveKratos`.
- [ ] Desenvolvidas visualizações para:
    - Próxima Melhor Ação (`/mentor/next-action`).
    - Recomendações ativas (`/mentor/recommendations/active`).
    - Sinais operacionais (`/mentor/signals`).
    - Projetos em risco (`/mentor/projects-at-risk`).
- [ ] Implementadas as ações de `POST /mentor/recommendations/{id}/complete`, `/{id}/dismiss`, `/{id}/snooze` [1].
- [ ] Garantido que a apresentação das recomendações não sobrecarrega o operador e que a ação sugerida é proeminente.

## 9. Anti-Patterns
- Exibir uma lista longa e não priorizada de recomendações, causando paralisia por análise.
- Não fornecer um caminho claro para o operador agir sobre uma recomendação.
- Usar linguagem ambígua ou técnica demais nas recomendações, dificultando a compreensão.
- Não atualizar as recomendações em tempo real, mostrando informações desatualizadas.

## 10. Exemplos de Execução
- **Cenário:** Exibir a 
Próxima Melhor Ação (NBA) na tela 'Mentor'.
  - **Ação:** Criar um componente `NextBestActionCard` que consome o endpoint `/mentor/next-action` e exibe a recomendação mais urgente de forma proeminente, com um botão de 'Executar' ou 'Dispensar' [1] [2].
- **Cenário:** Listar as recomendações ativas para o operador.
  - **Ação:** Criar um componente `RecommendationList` que consome `/mentor/recommendations/active` e exibe cada recomendação em um `RecommendationCard`, com opções para 'Completar', 'Dispensar' ou 'Adiar' [1] [2].

## 11. Guardrails
- As recomendações devem ser sempre acionáveis e claras, sem ambiguidade.
- A lógica de priorização do mentor (`mentor_decision_service.py`) deve ser respeitada na exibição das recomendações [1].
- A interface deve sempre fornecer uma opção para o operador ignorar ou adiar uma recomendação, sem forçar a ação.

## 12. Critérios de Qualidade
- **Acionabilidade:** As recomendações devem ser facilmente compreendidas e executadas pelo operador.
- **Relevância:** As recomendações devem ser contextuais e úteis para o operador.
- **Não Intrusividade:** O mentor deve guiar sem distrair ou sobrecarregar o operador.
- **Eficácia:** A capacidade do mentor de ajudar o operador a progredir em suas missões e a manter o foco.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado da implementação da tela 'Mentor', descrevendo os componentes criados, como as recomendações são consumidas e apresentadas, e uma confirmação de que os princípios de Neuro-UX e as diretrizes visuais foram rigorosamente seguidos. Inclua uma avaliação da acionabilidade e relevância das recomendações do mentor.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
