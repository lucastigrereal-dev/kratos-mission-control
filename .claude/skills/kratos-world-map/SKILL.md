---
id: kratos-world-map
name: Kratos World Map
description: Gerencia a renderização e interatividade do mapa de ilhas do KRATOS Mission Control.
tags: [ui, world-map, islands, navigation, pseudo-3d]
version: 1.0
author: Manus AI
---

# SKILL: Kratos World Map

## 1. Propósito
Esta skill é responsável por implementar e manter o componente `WorldMap` do KRATOS, que exibe o mapa de ilhas isométrico. O objetivo é garantir uma renderização visualmente rica, interativa e performática, alinhada com a `docs/kratos-visual/KRATOS_UI_BIBLE.md` e os princípios de Neuro-UX, facilitando a navegação e a compreensão do estado operacional do operador [2] [3].

## 2. Quando Usar
- Ao desenvolver ou modificar o componente `WorldMap` e seus subcomponentes (`IslandNode`, `CentralCastle`, `IslandConnection`).
- Ao implementar novas ilhas ou conexões no mapa.
- Ao adicionar ou ajustar animações e interações relacionadas à navegação no mundo.
- Ao integrar dados de status das ilhas (e.g., `status`, `novidades`) provenientes do backend.

## 3. Quando NÃO Usar
- Para lógica de negócio que não está diretamente ligada à renderização ou interação do mapa.
- Para componentes de UI genéricos que não fazem parte do mapa de ilhas (usar `kratos-design-system`).
- Para a comunicação de dados em tempo real via SSE (usar `kratos-sse-performance`).

## 4. Inputs Esperados
- Dados estruturados das ilhas e suas conexões (e.g., `islands[]`, `connections[]`).
- Estado atual da ilha ativa (`activeIsland`).
- Informações de status e novidades para cada ilha.

## 5. Arquivos que Pode Tocar
- `frontend/src/components/world/WorldMap.tsx`
- `frontend/src/components/world/IslandNode.tsx`
- `frontend/src/components/world/CentralCastle.tsx`
- `frontend/src/components/world/IslandConnection.tsx`
- `frontend/src/types/kratos.ts` (para definir interfaces de `Island` e `Connection`).
- `frontend/src/pages/VisaoGeral.tsx` (se houver uma página específica para o mapa).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` [1].
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`).
- Arquivos de lógica de negócio ou serviços que não impactam diretamente o mapa.

## 7. Definição de Pronto
- O mapa de ilhas é renderizado corretamente, seguindo o estilo visual pseudo-3D 2D definido na `docs/kratos-visual/KRATOS_UI_BIBLE.md` [2].
- As interações de hover e click nas ilhas funcionam conforme especificado (elevação, glow, zoom suave, ripple) [2].
- A navegação entre ilhas é fluida e exibe o breadcrumb e o botão "Voltar ao Castelo" [2].
- O status das ilhas (e.g., novidades, atividade pulsante) é visualmente indicado.
- O componente é performático, com animações suaves e sem engasgos.

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` para estilo visual, animações e navegação entre ilhas [2].
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para princípios de Neuro-UX aplicáveis ao mapa [3].
- [ ] Implementado o componente `WorldMap` com `IslandNode` e `CentralCastle`.
- [ ] Adicionadas as conexões visuais (pontes) entre as ilhas.
- [ ] Desenvolvidas as animações de hover e click para as ilhas.
- [ ] Integrados os dados de status das ilhas do backend (via `useLiveKratos` ou API calls).
- [ ] Garantido que o mapa é responsivo e mantém a proporção em diferentes tamanhos de tela.

## 9. Anti-Patterns
- Usar imagens rasterizadas de baixa qualidade para as ilhas; preferir assets vetoriais ou renderizados em alta resolução.
- Implementar animações complexas que prejudicam a performance ou distraem o operador.
- Não fornecer feedback visual claro sobre o estado interativo das ilhas.
- Ignorar a hierarquia de `z-index` para elementos do mapa, causando sobreposição incorreta.

## 10. Exemplos de Execução
- **Cenário:** Renderizar o mapa de ilhas na tela `VisaoGeral.tsx`.
  - **Ação:** Importar e utilizar o componente `WorldMap`, passando os dados das ilhas e conexões obtidos do backend. Garantir que o `CentralCastle` esteja no centro e que as ilhas sejam posicionadas isometricamente.
- **Cenário:** Adicionar um indicador de "novidade" a uma ilha específica.
  - **Ação:** Modificar o `IslandNode` para exibir um pequeno badge ou efeito pulsante quando a propriedade `hasNewContent` for `true`.

## 11. Guardrails
- O estilo pseudo-3D 2D deve ser mantido; evitar a introdução de bibliotecas 3D sem aprovação explícita.
- A lógica de navegação deve ser centralizada e consistente, utilizando `React Router DOM` para as rotas das ilhas.
- A performance de renderização do mapa deve ser monitorada, especialmente com um grande número de ilhas ou animações.

## 12. Critérios de Qualidade
- **Fidelidade Visual:** O mapa deve ser um reflexo fiel da imagem canônica, com cores, formas e proporções corretas.
- **Interatividade:** As interações devem ser intuitivas, responsivas e fornecer feedback claro.
- **Performance:** O mapa deve ser renderizado suavemente, mesmo com múltiplas animações e atualizações de estado.
- **Clareza:** A representação visual do estado operacional do operador deve ser imediatamente compreensível.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado da implementação do mapa de ilhas, incluindo uma descrição dos componentes criados/modificados, como as interações foram implementadas e uma confirmação de que o estilo visual e os princípios de Neuro-UX foram rigorosamente seguidos. Inclua capturas de tela do mapa renderizado, se possível.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
