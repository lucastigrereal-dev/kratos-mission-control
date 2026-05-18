---
id: kratos-arena-screen
name: Kratos Arena Screen
description: Implementa a tela 'Arena', focada na visualização e gestão de missões, projetos e desafios operacionais.
tags: [screen, arena, missions, projects, challenges, gamification]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Arena Screen

## 1. Propósito
Esta skill é responsável por implementar a tela 'Arena' no KRATOS Mission Control. O objetivo é fornecer ao operador uma visão gamificada e engajadora de suas missões, projetos e desafios operacionais. A tela deve ser neurocompatível, utilizando elementos visuais e de interação que estimulem o foco, a continuidade e a sensação de progresso, minimizando a sobrecarga e a procrastinação [1] [2].

## 2. Quando Usar
- Ao desenvolver ou modificar a página `Arena.tsx`.
- Ao integrar dados de missões, projetos e desafios do backend (e.g., `mission_service.py`, `project_service.py`, `challenge_service.py`).
- Ao implementar visualizações para o progresso de missões, status de projetos e recompensas de desafios.
- Ao criar funcionalidades para iniciar, pausar, completar missões ou interagir com projetos.

## 3. Quando NÃO Usar
- Para lógica de negócio específica de outras telas (e.g., `Agenda`, `Sistema`).
- Para a criação de componentes de UI genéricos que não são exclusivos da tela 'Arena' (usar `kratos-design-system`).
- Para a configuração de aspectos fundamentais da aplicação (usar `kratos-foundation`).

## 4. Inputs Esperados
- Dados dos endpoints de missões, projetos e desafios do backend: `/missions`, `/projects`, `/challenges` [1].
- Payloads do `live_snapshot` que contenham `mission_status`, `project_progress` [1].
- Interações do usuário para gerenciar missões e projetos.

## 5. Arquivos que Pode Tocar
- `frontend/src/pages/Arena.tsx` (componente principal da tela).
- `frontend/src/lib/api.ts` (para métodos de API relacionados a missões, projetos e desafios).
- `frontend/src/types/kratos.ts` (para tipagem dos dados de missões, projetos e desafios).
- Componentes em `frontend/src/components/` que exibem informações da arena (e.g., `MissionCard`, `ProjectProgressRing`, `ChallengeBadge`).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` (o backend é a fonte dos dados, não o alvo de modificação por esta skill) [1].
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`), a menos que a alteração seja estritamente necessária para a rota da tela 'Arena'.
- Arquivos de lógica de negócio ou serviços que não impactam diretamente a tela 'Arena'.

## 7. Definição de Pronto
- A tela 'Arena' é renderizada corretamente, exibindo missões, projetos e desafios de forma gamificada e engajadora, conforme a `docs/kratos-visual/KRATOS_UI_BIBLE.md` [2].
- Os dados são atualizados em tempo real, refletindo o progresso do operador [1].
- A interface é neurocompatível, com baixa carga cognitiva e visualizações que estimulam o progresso e a continuidade [2].
- As interações para gerenciar missões e projetos são fluidas e intuitivas.

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` para layout, cores e tipografia da tela 'Arena' [2].
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para princípios de Neuro-UX aplicáveis à gamificação (feedback positivo, progresso visível) [1].
- [ ] Implementado o componente `Arena.tsx` e seus subcomponentes.
- [ ] Consumidos os dados dos endpoints `/missions`, `/projects`, `/challenges` via `api.ts` ou `useLiveKratos`.
- [ ] Desenvolvidas visualizações para:
    - Lista de missões ativas com progresso.
    - Cartões de projeto com status e indicadores de saúde.
    - Desafios concluídos e pendentes.
- [ ] Implementadas funcionalidades para iniciar/pausar missões, marcar projetos como concluídos.
- [ ] Garantido que a apresentação dos elementos gamificados não distrai, mas sim engaja o operador.

## 9. Anti-Patterns
- Usar elementos gamificados de forma excessiva ou infantil, quebrando a seriedade do 
