---
id: kratos-planning
name: Kratos Planning
description: Gerencia e otimiza o planejamento de tarefas, projetos e metas no KRATOS.
tags: [planning, tasks, projects, goals, deadlines, roadmap]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Planning

## 1. Propósito
Esta skill capacita o Codex a interagir com os serviços de planejamento do backend do KRATOS, como `execution_plan_service.py` e `calendar_service.py`, para criar, atualizar e consultar planos diários, semanais, tarefas, metas e prazos. O objetivo é garantir que o frontend reflita com precisão o estado do planejamento do operador, facilitando o foco e a execução [1].

## 2. Quando Usar
- Ao desenvolver ou modificar componentes de UI relacionados a `Agenda`, `Projetos`, `Tarefas`, `Deadlines` e `Checkpoints`.
- Ao implementar funcionalidades de criação, edição ou visualização de planos de execução.
- Ao integrar dados de planejamento do backend para exibição no frontend.
- Quando o operador solicita uma visão consolidada de suas atividades futuras ou passadas.

## 3. Quando NÃO Usar
- Para interações com coletores de dados brutos (e.g., `system_collector.py`, `docker_collector.py`).
- Para lógica de UI puramente visual que não envolve manipulação de dados de planejamento.
- Para a geração de relatórios de status do sistema (usar `kratos-reporting`).

## 4. Inputs Esperados
- Requisições de API para endpoints de planejamento (e.g., `/calendar/events`, `/execution/today/generate`).
- Dados de formulário do usuário para criação ou atualização de tarefas, metas ou eventos.
- IDs de projetos, tarefas ou eventos para operações específicas.

## 5. Arquivos que Pode Tocar
- `frontend/src/pages/Agenda.tsx`
- `frontend/src/pages/Projetos.tsx`
- `frontend/src/pages/Tarefas.tsx`
- `frontend/src/pages/Deadlines.tsx`
- `frontend/src/pages/Checkpoints.tsx`
- `frontend/src/lib/api.ts` (para adicionar ou modificar métodos de API relacionados a planejamento).
- `frontend/src/types/kratos.ts` (para definir ou atualizar interfaces de dados de planejamento).
- Componentes em `frontend/src/components/` que exibem ou interagem com dados de planejamento (e.g., `widgets/DailyFocusWidget.tsx`, `widgets/AgendaWidget.tsx`).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` (o backend é imutável por esta skill) [1].
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`), a menos que a alteração seja estritamente necessária para integrar uma nova rota de planejamento.
- Arquivos relacionados a coletores ou serviços de baixo nível do backend.

## 7. Definição de Pronto
- O frontend exibe os dados de planejamento de forma precisa e atualizada, conforme a `docs/kratos-visual/KRATOS_UI_BIBLE.md` [2].
- As interações do usuário (criação, edição, marcação de conclusão) são refletidas corretamente no backend via API [1].
- A navegação entre as telas de planejamento é fluida e consistente.
- As regras de Neuro-UX são aplicadas para reduzir a carga cognitiva na visualização e interação com o planejamento [2].

## 8. Checklist Operacional
- [ ] Identificados os endpoints de backend relevantes para a funcionalidade de planejamento [1].
- [ ] Implementados os métodos de API correspondentes em `frontend/src/lib/api.ts`.
- [ ] Definidas ou atualizadas as interfaces TypeScript em `frontend/src/types/kratos.ts`.
- [ ] Desenvolvidos ou modificados os componentes React para exibir e interagir com os dados.
- [ ] Garantido que a UI segue a `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` [2].
- [ ] Testada a comunicação bidirecional com o backend para operações CRUD.

## 9. Anti-Patterns
- Hardcoding de dados de planejamento no frontend; todos os dados devem vir do backend.
- Ignorar a tipagem TypeScript para dados de planejamento, levando a erros em tempo de execução.
- Criar componentes de planejamento que não sejam reutilizáveis ou que dupliquem lógica existente.
- Apresentar informações de planejamento de forma densa ou confusa, violando os princípios de Neuro-UX.

## 10. Exemplos de Execução
- **Cenário:** Exibir a lista de tarefas do dia na tela `Agenda.tsx`.
  - **Ação:** Chamar `api.getTasksToday()` e renderizar os resultados usando um componente de lista de tarefas, aplicando os estilos definidos no `docs/kratos-visual/KRATOS_UI_BIBLE.md`.
- **Cenário:** Permitir que o usuário crie um novo evento de calendário.
  - **Ação:** Implementar um formulário em `Agenda.tsx` que, ao ser submetido, chama `api.createCalendarEvent()` com os dados fornecidos.

## 11. Guardrails
- As chamadas de API devem incluir tratamento de erros e estados de carregamento para feedback ao usuário.
- A validação de dados de entrada do usuário deve ser implementada no frontend antes de enviar para o backend.
- A lógica de negócio complexa relacionada a planejamento deve residir nos serviços de backend, não no frontend.

## 12. Critérios de Qualidade
- **Consistência:** A interface de planejamento deve ser consistente com o restante do KRATOS em termos de design e interação.
- **Precisão:** Os dados exibidos devem ser um reflexo exato do estado do backend.
- **Usabilidade:** A criação, edição e visualização de itens de planejamento devem ser intuitivas e eficientes para o operador.
- **Performance:** A renderização de listas e calendários deve ser rápida, mesmo com um grande volume de dados.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado das funcionalidades de planejamento implementadas, os arquivos modificados e uma confirmação de que os dados são corretamente exibidos e persistidos no backend, aderindo às diretrizes de UI e Neuro-UX.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS NEURO-UX RULES. (2026-05-13).
