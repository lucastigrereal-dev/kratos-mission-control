# Anti‑SaaS Rules

Para preservar a identidade única do KRATOS Mission Control, estas regras definem o que **não** fazer ao evoluir o frontend.  Elas evitam que o cockpit se transforme em um SaaS corporativo ou em um painel de tarefas genérico.

1. **Sem aparência de CRM.**  Evite estilos de dashboards empresariais.  O KRATOS não deve se parecer com Notion, Trello, Monday ou HubSpot.
2. **Nada de grids infinitos.**  Grandes tabelas de dados não são o foco do KRATOS.  Use resumos, cards e painéis contextuais.
3. **Não reimplemente frameworks.**  Não introduza `Next.js`, `Material UI` ou `Ant Design`.  A stack oficial é **React + Vite + TypeScript + Tailwind**.
4. **Sem cores corporativas neutras.**  Tons de cinza e azul corporativo devem ser limitados; use a paleta de tokens que remete a oceano, céu, ilhas e energia.
5. **Sem skeletons brancos cegantes.**  Placeholders devem respeitar o dark mode e a acessibilidade, usando opacidades baixas (`bg-white/5`) em vez de cinza claro.
6. **Sem overload de indicadores.**  O HUD deve focar no que importa: missão, próxima ação, energia e riscos.  Não adicione 20 métricas irrelevantes.
7. **Sem transições agressivas.**  Evite efeitos de parallax exagerados ou motion acelerado que possam causar desconforto.
8. **Nada de 3D completo.**  O pseudo‑3D deve ser via CSS e SVG.  Não utilizar Three.js ou WebGL; isso ficaria fora do escopo do KRATOS.
9. **Sem publicar sem aprovação.**  O KRATOS é um cockpit offline/privado.  Funcionalidades de publicação ou automação de marketing pertencem ao OMNIS, não ao frontend.
10. **Sem mexer no backend.**  Qualquer código que toque em endpoints, banco de dados ou server logic deve ser feito em outra microfase com autorização específica.