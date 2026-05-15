# KRATOS Kimi Frontend Pack v1

Este pacote foi organizado a partir do material fornecido pelo Kimi (especificações visuais, códigos de referência e orientações) para evoluir o frontend do **KRATOS Mission Control**.  O objetivo é fornecer ao Claude Code uma fonte canônica local de componentes, tokens, planos de microfases e prompts para implementação segura, sem tocar no backend ou quebrar o contrato do sistema.

## Conteúdo do pacote

| Pasta/arquivo | Conteúdo | Objetivo |
|---|---|---|
| `01_VISUAL_BIBLE/` | Guia visual, tokens e regras anti‐SaaS | Define a identidade visual do KRATOS e princípios de UI neurocompatíveis |
| `02_IMPLEMENTATION_ROADMAP/` | Roadmap de microfases e ordem de execução | Planeja a evolução gradual do frontend |
| `03_SAFE_PRIMITIVES/` | Componentes pequenos em TSX (EmptyState, ErrorState, ProgressRing, MetricBadge, GlassPanel, StatusChip) | Primitives seguros para reutilização |
| `04_WORLD_MAP_COMPONENTS/` | Componentes de mapa pseudo‑3D | Base para o mapa de ilhas; contém código adaptado do Kimi |
| `05_HUD_COMPONENTS/` | Componentes de HUD (TopBar, Sidebar, BottomDock, MissionBar, SquadDock, StatusBarDock) | Estrutura do cockpit |
| `06_AURORA_COMPONENTS/` | Componentes relacionados à Aurora | Painel de assistente e sinalizações |
| `07_ISLAND_PAGES/` | Esboços de páginas internas das ilhas | Templates para futuras microfases |
| `08_MOTION_SYSTEM/` | Keyframes e regras de motion | Base para animações e acessibilidade |
| `09_CLAUDE_PROMPTS/` | Prompts de microfases | Scripts para guiar o Claude Code em cada fase |
| `10_DO_NOT_USE_DIRECTLY/` | Código que não deve ser usado diretamente | Prevê duplicações ou arrisque quebrar contratos |
| `11_VALIDATION/` | Checklists de build e QA | Critérios para aceitar cada microfase |

## Como usar

1. **Leia a Bíblia Visual** para entender paleta, tokens e princípios de UI.
2. **Consulte o roadmap** para saber em qual microfase você está e quais arquivos usar.
3. **Implementa os primitives** antes de componentes maiores.  Use `03_SAFE_PRIMITIVES` como base.
4. **Siga as microfases**: use os prompts em `09_CLAUDE_PROMPTS` para iniciar cada microfase.
5. **Não copie código sem auditá-lo**.  Sempre compare o código Kimi com o código existente no KRATOS e adapte conforme necessário.
6. **Nunca mexa no backend**, endpoints, `useLiveKratos`, SSE (`/live/stream`, `/live/snapshot`) ou Mission Lens sem autorização explícita.
7. Use os checklists em `11_VALIDATION` antes de commitar qualquer alteração.

## Observação

Este pacote foi gerado automaticamente com base nos arquivos fornecidos pelo Kimi.  Alguns componentes estão resumidos ou esboçados para evitar duplicações e preservar contratos existentes.  Ao implementar, adapte conforme a arquitetura real do KRATOS.