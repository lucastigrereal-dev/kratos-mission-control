# VISUAL BIBLE KRATOS

Esta bíblia visual sintetiza a identidade do frontend do **KRATOS Mission Control** com base nas especificações do Kimi.  Ela serve como referência para designers e desenvolvedores ao evoluir o visual da aplicação.

## Identidade Visual

* **Mundo vivo de ilhas.**  O KRATOS não é um dashboard estático; trata‑se de um mapa pseudo‑3D com ilhas temáticas que representam domínios da vida e da operação.
* **Paleta premium.**  Tons de azul profundo (oceano), azul celeste (céu), verdes vivos (ilhas), dourado e púrpura para energia, XP e OMNIS.
* **Glassmorphism.**  Painéis flutuantes com blur e bordas suaves, utilizando tokens definidos em `01_VISUAL_BIBLE/DESIGN_TOKENS.md`.
* **HUD inspirado em jogos.**  Barra superior, barra inferior, lateral direita e esquerda, com informações de energia, nível, XP, hora, próximos passos e risos da Aurora.
* **Aurora como personagem.**  A assistente aparece em um painel na direita, com orb holográfico e mensagens contextuais.
* **Conectividade com dados reais.**  O visual nunca deve esconder se um dado vem de `live`, `cached`, `fallback`, `mock` ou `error`.  Utilizar `SourceBadge` sempre que necessário.

## Princípios de UI

1. **Neurocompatibilidade.**  Reduza o ruído visual e respeite `prefers-reduced-motion`.  Animações devem ser discretas e pausadas quando o usuário preferir.
2. **Próxima ação clara.**  O usuário deve entender em 10 segundos qual é a missão atual e qual é a próxima ação.
3. **Modularidade.**  Componentes devem ser pequenos e reutilizáveis.  Evite criar mega‑componentes monolíticos.
4. **Adoção progressiva.**  Implementar por microfases, adaptando gradualmente o código existente do KRATOS em vez de substituí‑lo completamente.
5. **Transparência de fontes.**  Sempre indicar a origem dos dados (live, cached, fallback, mock) através do `SourceBadge`.

## Anti‑SaaS Rules

1. **Não transformar o cockpit em CRM ou Notion.**  O KRATOS não é um SaaS genérico.  Ele é um sistema operacional pessoal.
2. **Evitar aparência corporativa.**  Não use greys monocromáticos típicos de dashboards B2B; prefira a paleta definida de oceanos, céus e ilhas.
3. **Não exagerar no cyberpunk.**  Luzes neon e contraste elevado devem ser usados com moderação para não cansar.
4. **Não adicionar painéis redundantes.**  Cada elemento da interface deve responder a uma necessidade do usuário — missão, progresso, contexto ou risco.

## Estrutura de Arquivos

Esta bíblia está complementada por arquivos:

* `DESIGN_TOKENS.md` — Paleta de cores, sombras, radius e animações.
* `ANTI_SAAS_RULES.md` — Lista expandida de práticas a evitar.
* `UI_PRINCIPLES.md` — Descrições detalhadas dos princípios de experiência de usuário.

Consulte‑os antes de iniciar qualquer microfase.