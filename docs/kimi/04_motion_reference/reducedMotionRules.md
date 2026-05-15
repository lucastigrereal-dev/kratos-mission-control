# Regras de Reduced Motion

O KRATOS deve respeitar a preferência do usuário por animações reduzidas.  Para isso, siga estas regras:

1. **Detectar a preferência:** use a query CSS `@media (prefers-reduced-motion: reduce) { … }` para desligar ou suavizar animações.
2. **Desativar animações:** para classes `animate-float-slow`, `animate-float-medium`, `animate-cloud-drift`, `animate-pulse-glow` e `animate-spin-slow`, remova a animação completamente e mantenha apenas uma transição de opacidade.
3. **Reduzir efeitos parallax:** desative drift de nuvens e flutuação de ilhas quando `prefers-reduced-motion` estiver ativado.
4. **Evitar loops infinitos:** se uma animação for essencial (ex.: indicador de carregamento), reduza a velocidade e implemente transições mais suaves.
5. **Fornecer alternativa visual:** para usuários com motion reduzido, use indicadores estáticos, como progress bars em vez de anéis em movimento.