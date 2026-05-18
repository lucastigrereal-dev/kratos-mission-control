---
id: kratos-sse-performance
name: Kratos SSE Performance
description: Otimiza o consumo e processamento do stream SSE (`/live/stream`) no frontend para garantir atualizações em tempo real performáticas e eficientes.
tags: [sse, performance, real-time, live-data, frontend, optimization]
version: 1.0
author: Manus AI
---

# SKILL: Kratos SSE Performance

## 1. Propósito
Esta skill foca na otimização do consumo e processamento do stream Server-Sent Events (SSE) (`/live/stream`) no frontend do KRATOS Mission Control. O objetivo é garantir que as atualizações de dados em tempo real sejam entregues e renderizadas com a máxima performance e eficiência, minimizando a latência, o uso de recursos do navegador e evitando gargalos na UI. A skill assegura que o frontend aproveite a arquitetura paralela do backend (`live_event_service.py`) para uma experiência fluida e responsiva [1] [2].

## 2. Quando Usar
- Ao desenvolver ou modificar o `useLiveKratos.ts` ou qualquer lógica de consumo do stream SSE.
- Ao implementar novos componentes que dependem de dados em tempo real do `live_snapshot`.
- Ao otimizar a renderização de dados dinâmicos para evitar re-renders excessivos ou bloqueios da thread principal.
- Ao depurar problemas de performance ou latência em atualizações de UI em tempo real.
- Quando o backend reporta `build_time_ms` baixo para o `/live/snapshot` e o frontend precisa refletir essa performance [1].

## 3. Quando NÃO Usar
- Para a lógica de negócio que não envolve diretamente o consumo ou a exibição de dados em tempo real.
- Para a estilização de componentes de UI (usar `kratos-design-system`).
- Para a gestão de estados estáticos ou dados que não mudam frequentemente.

## 4. Inputs Esperados
- O stream de eventos do endpoint `/live/stream` do backend [1].
- Payloads do `live_snapshot` contendo as 9 seções paralelas de dados [1].
- Métricas de performance do navegador (FPS, uso de CPU/memória).

## 5. Arquivos que Pode Tocar
- `frontend/src/hooks/useLiveKratos.ts` (componente central para esta skill).
- `frontend/src/lib/api.ts` (para o fallback HTTP de `/live/snapshot`).
- `frontend/src/types/kratos.ts` (para a tipagem precisa do `live_snapshot`).
- Qualquer componente em `frontend/src/components/` ou `frontend/src/pages/` que consuma dados via `useLiveKratos`.

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` (o backend é a fonte dos dados, não o alvo de modificação por esta skill) [1].
- Arquivos de configuração de build que não afetam diretamente o desempenho do SSE.
- Arquivos de lógica de negócio ou serviços que não impactam diretamente o consumo de SSE.

## 7. Definição de Pronto
- O stream SSE é consumido de forma eficiente, sem perdas de eventos ou reconexões frequentes não intencionais.
- A UI é atualizada de forma suave e reativa às mudanças no `live_snapshot`, mantendo um FPS alto.
- O uso de CPU e memória do navegador é minimizado durante o consumo e renderização de dados em tempo real.
- O mecanismo de fallback para `/live/snapshot` via HTTP funciona corretamente em caso de falha do SSE [1].
- A latência percebida entre a atualização do backend e a renderização no frontend é mínima (idealmente < 100ms).

## 8. Checklist Operacional
- [ ] Verificado o `useLiveKratos.ts` para garantir que a conexão SSE é gerenciada de forma robusta (reconexão automática, tratamento de erros).
- [ ] Implementada a lógica de processamento do `live_snapshot` de forma otimizada, talvez com `useMemo` ou `useCallback` para evitar re-renders desnecessários em componentes filhos.
- [ ] Testado o cenário de fallback para `/live/snapshot` via HTTP quando o SSE falha [1].
- [ ] Monitorado o uso de recursos do navegador (CPU, memória) durante a exibição de dados em tempo real.
- [ ] Verificado se os indicadores de estado (`LIVE`, `STALE`, `RECONNECTING`) são exibidos corretamente [2].
- [ ] Assegurado que as atualizações de UI são fluidas e não causam engasgos.

## 9. Anti-Patterns
- Re-renderizar a árvore de componentes inteira a cada atualização do `live_snapshot`.
- Bloquear a thread principal do navegador com operações de processamento de dados síncronas e pesadas.
- Ignorar o tratamento de erros da conexão SSE, levando a uma UI estagnada ou quebrada.
- Fazer chamadas HTTP repetitivas para dados que deveriam ser entregues via SSE.
- Não implementar um mecanismo de `debounce` ou `throttle` para atualizações de UI muito frequentes.

## 10. Exemplos de Execução
- **Cenário:** Otimizar o consumo de uma seção específica do `live_snapshot`.
  - **Ação:** Criar um custom hook (`useLiveSectionData`) que utiliza `useLiveKratos` e `useMemo` para extrair e memoizar apenas a seção de dados necessária, evitando re-renders de componentes não relacionados.
- **Cenário:** Implementar um indicador de `LIVE` para uma métrica específica.
  - **Ação:** No componente que exibe a métrica, usar o estado `LIVE` do `live_snapshot` para renderizar um pequeno ícone pulsante, conforme a `docs/kratos-visual/KRATOS_UI_BIBLE.md` [2].

## 11. Guardrails
- A lógica de conexão e reconexão do SSE deve ser centralizada e robusta.
- A tipagem do `live_snapshot` em `frontend/src/types/kratos.ts` deve ser mantida atualizada e precisa.
- Qualquer alteração no `useLiveKratos.ts` deve ser acompanhada de testes de performance e estabilidade.
- O `live_cache_service.py` do backend (cache TTL de 20s) deve ser considerado ao otimizar o frontend para evitar requisições desnecessárias [1].

## 12. Critérios de Qualidade
- **Baixa Latência:** As atualizações de UI devem ser quase instantâneas após a emissão do evento pelo backend.
- **Eficiência de Recursos:** Mínimo impacto no uso de CPU e memória do navegador.
- **Estabilidade:** A conexão SSE deve ser resiliente a falhas de rede e reconectar-se automaticamente.
- **Fluidez da UI:** A interface deve permanecer responsiva e sem engasgos durante as atualizações em tempo real.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado sobre as otimizações de performance implementadas para o consumo de SSE, incluindo métricas de latência, uso de recursos e estabilidade da conexão. Confirme que a UI reflete as atualizações em tempo real de forma eficiente e que o fallback HTTP foi testado, com referência ao `KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo`.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
