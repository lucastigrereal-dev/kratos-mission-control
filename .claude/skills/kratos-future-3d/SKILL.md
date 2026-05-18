---
id: kratos-future-3d
name: Kratos Future 3D
description: Define a estratégia e as diretrizes para a futura integração de elementos 3D no KRATOS Mission Control, mantendo a coerência visual e a performance.
tags: [3d, future, ui, world-map, performance, pseudo-3d]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Future 3D

## 1. Propósito
Esta skill estabelece a estratégia e as diretrizes para a eventual transição ou integração de elementos 3D mais avançados no KRATOS Mission Control. Embora a versão atual priorize um "pseudo-3D 2D seguro" sem `Three.js` obrigatório, esta skill prepara o terreno para futuras evoluções, garantindo que qualquer implementação 3D mantenha a coerência visual, a performance e os princípios de Neuro-UX do sistema [1] [2] [3].

## 2. Quando Usar
- Ao planejar a introdução de elementos 3D mais complexos ou interativos no mapa de ilhas ou em outras áreas da UI.
- Ao avaliar novas tecnologias ou bibliotecas 3D para integração no KRATOS.
- Ao refatorar componentes visuais existentes para prepará-los para uma transição 3D.
- Ao otimizar a performance de renderização para ambientes que possam incluir 3D.

## 3. Quando NÃO Usar
- Para o desenvolvimento da UI atual, que deve aderir ao estilo "pseudo-3D 2D seguro" [2].
- Para lógica de backend ou manipulação de dados.
- Para a criação de componentes de UI genéricos que não têm relação com 3D.

## 4. Inputs Esperados
- Requisitos de design para novas funcionalidades 3D.
- Avaliações de performance de protótipos 3D.
- Especificações de assets 3D (modelos, texturas).

## 5. Arquivos que Pode Tocar
- `frontend/src/components/world/WorldMap.tsx` (para integrar um novo renderizador 3D).
- `frontend/src/components/**/*.tsx` (componentes que podem ser adaptados para 3D).
- `frontend/src/index.css` (para estilos que podem precisar de ajustes para 3D).
- `frontend/vite.config.ts` (para configurar loaders ou otimizações para assets 3D).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` [1].
- Arquivos de configuração de build ou de fundação da aplicação que não estão diretamente relacionados à implementação 3D.
- Introduzir bibliotecas 3D sem uma avaliação rigorosa de performance e impacto na carga cognitiva.

## 7. Definição de Pronto
- Um protótipo ou componente 3D foi implementado, demonstrando a viabilidade técnica e visual.
- A performance de renderização 3D é aceitável, mantendo um FPS alto e sem engasgos.
- O estilo visual "Game UI Adulto" e "Apple-clean" é preservado na implementação 3D [2].
- A carga cognitiva não é aumentada pela complexidade visual do 3D [3].
- A integração 3D é modular e não compromete a arquitetura existente.

## 8. Checklist Operacional
- [ ] Avaliada a performance de renderização 3D em diferentes dispositivos.
- [ ] Garantido que a implementação 3D não introduz dependências de `Three.js` na V1, a menos que seja uma decisão estratégica para uma versão futura específica.
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` para diretrizes visuais e de animação que podem ser adaptadas para 3D [2].
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para garantir que o 3D não aumente a carga cognitiva [3].
- [ ] Otimizados os assets 3D para o menor tamanho de arquivo e maior performance.
- [ ] Implementado um mecanismo de fallback para ambientes que não suportam 3D ou para desabilitar o 3D por preferência do usuário.

## 9. Anti-Patterns
- Introduzir 3D apenas por "parecer legal" sem uma justificativa funcional clara.
- Usar modelos 3D de alta poligonalidade que impactam negativamente a performance.
- Criar interfaces 3D que são difíceis de navegar ou que distraem o operador.
- Ignorar a acessibilidade na implementação 3D.

## 10. Exemplos de Execução
- **Cenário:** Prototipar uma versão 3D de uma ilha do mapa.
  - **Ação:** Criar um componente React que renderiza um modelo 3D otimizado da ilha, utilizando uma biblioteca 3D leve (e.g., `react-three-fiber` com `Three.js` para prototipagem, mas com a consciência de que `Three.js` não é obrigatório na V1), e avaliar o impacto na performance e na experiência do usuário.
- **Cenário:** Adicionar um efeito de profundidade 3D a um widget.
  - **Ação:** Utilizar técnicas CSS 3D (`transform: perspective`, `rotateX`, `rotateY`) para simular profundidade em um componente 2D, mantendo a performance e a compatibilidade.

## 11. Guardrails
- Qualquer biblioteca 3D introduzida deve ser avaliada quanto ao seu impacto no bundle size e na performance.
- A complexidade visual do 3D não deve comprometer a legibilidade ou a clareza da informação.
- A transição para 3D deve ser incremental e opcional para o usuário na V1.
- O estilo "Game UI Adulto" deve ser mantido, evitando elementos infantis ou excessivamente futuristas.

## 12. Critérios de Qualidade
- **Performance:** A renderização 3D deve ser fluida (60 FPS) e não causar engasgos na UI.
- **Coerência Visual:** O 3D deve se integrar perfeitamente ao estilo visual existente do KRATOS.
- **Funcionalidade:** O 3D deve aprimorar a experiência do usuário, não apenas ser um adorno.
- **Manutenibilidade:** A implementação 3D deve ser modular e fácil de manter.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado sobre a implementação ou prototipagem de elementos 3D, incluindo a tecnologia utilizada, métricas de performance, uma avaliação da coerência visual e do impacto na Neuro-UX. Confirme que as diretrizes de "pseudo-3D 2D seguro" foram respeitadas na versão atual e que a solução é escalável para o futuro.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
