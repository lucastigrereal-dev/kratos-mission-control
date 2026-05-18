---
id: kratos-system-screen
name: Kratos System Screen
description: Implementa a tela 'Sistema', fornecendo uma visão detalhada da saúde e status dos componentes do backend do KRATOS.
tags: [screen, system, health, status, backend, collectors, docker, git]
version: 1.0
author: Manus AI
---

# SKILL: Kratos System Screen

## 1. Propósito
Esta skill é responsável por implementar a tela 'Sistema' (`Sistema.tsx`) no KRATOS Mission Control. Sendo a maior página do frontend, seu objetivo é fornecer ao operador uma visão abrangente e detalhada da saúde e status de todos os componentes do backend, incluindo coletores (system, docker, git, omnis, activitywatch), serviços e o estado geral do sistema. A tela deve apresentar essas informações de forma clara, organizada e neurocompatível, permitindo a rápida identificação de problemas e a compreensão do desempenho do KRATOS [1] [2].

## 2. Quando Usar
- Ao desenvolver ou modificar a página `Sistema.tsx`.
- Ao integrar dados de status e métricas de coletores e serviços do backend.
- Ao implementar visualizações para CPU, RAM, disco, containers Docker, repositórios Git e outros componentes do sistema.
- Ao adicionar funcionalidades para depuração ou diagnóstico de problemas do sistema.

## 3. Quando NÃO Usar
- Para lógica de negócio específica de outras telas (e.g., `Agenda`, `Projetos`).
- Para a criação de componentes de UI genéricos que não são exclusivos da tela 'Sistema' (usar `kratos-design-system`).
- Para a configuração de aspectos fundamentais da aplicação (usar `kratos-foundation`).

## 4. Inputs Esperados
- Dados dos endpoints de sistema do backend: `/system`, `/docker`, `/git`, `/omnis/status`, `/activitywatch/status` [1].
- Payloads do `live_snapshot` que contenham `collector_status` e outras métricas de sistema [1].
- Interações do usuário para filtrar, ordenar ou detalhar informações do sistema.

## 5. Arquivos que Pode Tocar
- `frontend/src/pages/Sistema.tsx` (componente principal da tela).
- `frontend/src/hooks/useLiveKratos.ts` (para consumir o stream SSE e dados de sistema em tempo real).
- `frontend/src/lib/api.ts` (para métodos de API relacionados a sistema).
- `frontend/src/types/kratos.ts` (para tipagem dos dados de sistema, docker, git, etc.).
- Componentes em `frontend/src/components/` que exibem informações de sistema (e.g., `SystemResourceCard`, `DockerContainerList`, `GitRepoStatus`).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` (o backend é a fonte dos dados, não o alvo de modificação por esta skill) [1].
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`), a menos que a alteração seja estritamente necessária para a rota da tela 'Sistema'.
- Arquivos de lógica de negócio ou serviços que não impactam diretamente a tela 'Sistema'.

## 7. Definição de Pronto
- A tela 'Sistema' é renderizada corretamente, exibindo uma visão detalhada da saúde e status dos componentes do backend, conforme a `docs/kratos-visual/KRATOS_UI_BIBLE.md` [2].
- Os dados são atualizados em tempo real via SSE, refletindo o estado atual dos coletores e serviços [1].
- A interface é neurocompatível, com baixa carga cognitiva e visualizações que facilitam a identificação de problemas (e.g., `SystemStatusBadge`) [2].
- As informações são organizadas de forma hierárquica e fácil de navegar.

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` para layout, cores e tipografia da tela 'Sistema' [2].
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para princípios de Neuro-UX aplicáveis à exibição de dados complexos (clareza, organização, feedback visual) [1].
- [ ] Implementado o componente `Sistema.tsx` e seus subcomponentes.
- [ ] Consumidos os dados dos endpoints `/system`, `/docker`, `/git`, `/omnis/status`, `/activitywatch/status` via `api.ts` ou `useLiveKratos`.
- [ ] Desenvolvidas visualizações para:
    - Uso de CPU, RAM, Disco (C: e G:).
    - Lista de containers Docker (status, health, ports).
    - Status de repositórios Git (branch, dirty, last commit).
    - Status do OMNIS (checkers, testes, briefings, blockers).
    - Status do ActivityWatch.
- [ ] Utilizados `SystemStatusBadge` para indicar a saúde de cada componente [2].
- [ ] Garantido que a apresentação dos dados do sistema não sobrecarrega o operador, talvez com seções colapsáveis ou filtros.

## 9. Anti-Patterns
- Exibir dados brutos do sistema sem formatação ou agregação, dificultando a interpretação.
- Não fornecer feedback visual claro sobre o status de cada componente, tornando difícil identificar falhas.
- Exigir que o operador navegue por múltiplas telas para obter uma visão completa da saúde do sistema.
- Usar cores ou ícones inconsistentes para representar os mesmos estados em diferentes partes da tela.

## 10. Exemplos de Execução
- **Cenário:** Exibir o uso de CPU e RAM do sistema.
  - **Ação:** Criar um `SystemResourceCard` que consome dados do endpoint `/system` e exibe gráficos de progresso ou barras para CPU e RAM, com cores indicando níveis de uso (e.g., verde para baixo, amarelo para médio, vermelho para alto) [2].
- **Cenário:** Listar containers Docker e seus status.
  - **Ação:** Criar um `DockerContainerList` que consome dados do endpoint `/docker` e renderiza uma tabela ou lista de containers, com um `SystemStatusBadge` para cada um (running, exited, unhealthy) [1] [2].

## 11. Guardrails
- A sanitização de dados sensíveis (`activitywatch_collector.py`) deve ser respeitada, e nenhuma informação filtrada deve ser exibida no frontend [1].
- A tela 'Sistema' deve ser otimizada para performance, dada a quantidade de dados que pode exibir.
- As visualizações devem ser claras e concisas, evitando gráficos complexos demais para uma rápida leitura.

## 12. Critérios de Qualidade
- **Compreensão:** O operador deve ser capaz de entender rapidamente a saúde geral e específica do sistema.
- **Precisão:** Os dados exibidos devem ser um reflexo exato e atualizado do estado do backend.
- **Organização:** As informações devem ser estruturadas de forma lógica e fácil de navegar.
- **Neuro-UX:** A tela deve ajudar o operador a identificar problemas sem causar ansiedade ou sobrecarga de informações.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado da implementação da tela 'Sistema', descrevendo os componentes criados, como os dados de sistema são consumidos e visualizados, e uma confirmação de que os princípios de Neuro-UX e as diretrizes visuais foram rigorosamente seguidos. Inclua uma avaliação da clareza e organização da tela, especialmente considerando sua complexidade.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
