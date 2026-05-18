---
id: kratos-agenda-screen
name: Kratos Agenda Screen
description: Implementa a tela 'Agenda', focada na visualização e gestão de eventos, tarefas e planos diários/semanais.
tags: [screen, agenda, calendar, tasks, planning, events]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Agenda Screen

## 1. Propósito
Esta skill é responsável por implementar a tela 'Agenda' (`Agenda.tsx`) no KRATOS Mission Control. O objetivo é fornecer ao operador uma visão clara e organizada de seus eventos, tarefas, prazos e planos diários/semanais, facilitando a gestão do tempo e a priorização. A tela deve ser neurocompatível, permitindo que o operador visualize e interaja com sua agenda de forma eficiente, minimizando a sobrecarga de informações [1] [2].

## 2. Quando Usar
- Ao desenvolver ou modificar a página `Agenda.tsx`.
- Ao integrar dados de calendário, tarefas e planos do backend (e.g., `calendar_service.py`, `execution_plan_service.py`).
- Ao implementar funcionalidades de criação, edição ou visualização de eventos e tarefas na agenda.
- Ao exibir resumos de agenda na sidebar direita (e.g., `AgendaWidget`).

## 3. Quando NÃO Usar
- Para lógica de negócio específica de outras telas (e.g., `Projetos`, `Sistema`).
- Para a criação de componentes de UI genéricos que não são exclusivos da tela 'Agenda' (usar `kratos-design-system`).
- Para a configuração de aspectos fundamentais da aplicação (usar `kratos-foundation`).

## 4. Inputs Esperados
- Dados dos endpoints de calendário e execução do backend: `/calendar/today`, `/calendar/week`, `/calendar/month`, `/calendar/events`, `/execution/today`, `/execution/week` [1].
- Dados de tarefas: `/tasks/today`, `/tasks/overdue` [1].
- Interações do usuário para criar, editar ou marcar eventos/tarefas como concluídos.

## 5. Arquivos que Pode Tocar
- `frontend/src/pages/Agenda.tsx` (componente principal da tela).
- `frontend/src/components/widgets/AgendaWidget.tsx`.
- `frontend/src/lib/api.ts` (para métodos de API relacionados a calendário e tarefas).
- `frontend/src/types/kratos.ts` (para tipagem dos dados de calendário e tarefas).
- Componentes em `frontend/src/components/` que exibem informações da agenda (e.g., `CalendarView`, `TaskListItem`).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` (o backend é a fonte dos dados, não o alvo de modificação por esta skill) [1].
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`), a menos que a alteração seja estritamente necessária para a rota da tela 'Agenda'.
- Arquivos de lógica de negócio ou serviços que não impactam diretamente a tela 'Agenda'.

## 7. Definição de Pronto
- A tela 'Agenda' é renderizada corretamente, exibindo eventos, tarefas e planos de forma clara e organizada, conforme a `docs/kratos-visual/KRATOS_UI_BIBLE.md` [2].
- Os dados são atualizados dinamicamente, refletindo o estado atual do planejamento do operador [1].
- A interface é neurocompatível, com baixa carga cognitiva e visualizações que facilitam a priorização e a gestão do tempo [2].
- As interações para criar, editar e concluir itens da agenda são fluidas e intuitivas.

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` para layout, cores e tipografia da tela 'Agenda' [2].
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para princípios de Neuro-UX aplicáveis à gestão da agenda (clareza, feedback, priorização visual) [1].
- [ ] Implementado o componente `Agenda.tsx` e seus subcomponentes (e.g., visualização de calendário, lista de tarefas).
- [ ] Consumidos os dados dos endpoints `/calendar/*` e `/tasks/*` via `api.ts`.
- [ ] Desenvolvidas funcionalidades para:
    - Visualização de eventos e tarefas por dia, semana ou mês.
    - Criação e edição de eventos e tarefas.
    - Marcação de tarefas como concluídas.
- [ ] Garantido que a apresentação dos dados da agenda não sobrecarrega o operador.

## 9. Anti-Patterns
- Exibir uma agenda densa e confusa, com muitos detalhes em um único lugar, dificultando a leitura.
- Não fornecer feedback visual claro para ações como adicionar um evento ou concluir uma tarefa.
- Exigir muitos cliques para realizar ações comuns na agenda.
- Não diferenciar visualmente tarefas, eventos e prazos, causando confusão.

## 10. Exemplos de Execução
- **Cenário:** Exibir os eventos e tarefas do dia atual na tela 'Agenda'.
  - **Ação:** Chamar `api.getCalendarToday()` e `api.getTasksToday()` e renderizar os resultados em uma lista cronológica, utilizando ícones e cores para diferenciar eventos e tarefas, conforme a `docs/kratos-visual/KRATOS_UI_BIBLE.md` [2].
- **Cenário:** Permitir que o operador crie um novo evento de calendário.
  - **Ação:** Implementar um formulário modal que, ao ser preenchido e submetido, chama `api.createCalendarEvent()` e atualiza a visualização da agenda.

## 11. Guardrails
- A lógica de manipulação de datas e horários deve ser robusta e considerar fusos horários.
- A validação de dados de entrada para eventos e tarefas deve ser implementada no frontend.
- A integração com o `AgendaWidget` na sidebar direita deve ser consistente.

## 12. Critérios de Qualidade
- **Clareza:** A agenda deve ser fácil de ler e entender, mesmo com muitos itens.
- **Usabilidade:** A interação com a agenda deve ser intuitiva e eficiente.
- **Precisão:** Os dados exibidos devem ser um reflexo exato do planejamento do operador.
- **Neuro-UX:** A tela deve ajudar o operador a gerenciar seu tempo e prioridades sem causar ansiedade ou sobrecarga.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado da implementação da tela 'Agenda', descrevendo os componentes criados, como os dados de calendário e tarefas são consumidos e visualizados, e uma confirmação de que os princípios de Neuro-UX e as diretrizes visuais foram rigorosamente seguidos. Inclua uma avaliação da clareza e usabilidade da tela.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
