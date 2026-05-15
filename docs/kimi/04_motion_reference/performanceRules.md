# Regras de Performance

As animações e efeitos visuais do KRATOS devem ser leves e responsivos.  Siga estas recomendações para garantir desempenho consistente:

1. **Evite repaints excessivos:** use CSS transforms (`translate`, `rotate`) ao invés de propriedades que causam reflow (`top`, `left`, `width`).
2. **SVGs e filtros:** efeitos de blur e drop-shadow aplicados em SVGs podem ser custosos.  Utilize sombras pré-definidas por tokens sempre que possível.
3. **Limite o número de elementos animados:** animações simultâneas em dezenas de ilhas e nuvens podem degradar FPS.  Mantenha 3–5 nuvens animadas e aplique flutuação apenas às ilhas principais.
4. **Throttling para eventos de scroll:** se adicionar animações baseadas em scroll no RightRail, use throttling ou `requestAnimationFrame` para evitar jank.
5. **Use `will-change` com parcimônia:** aplique `will-change: transform` apenas em elementos que realmente serão animados, para não comprometer a otimização do browser.