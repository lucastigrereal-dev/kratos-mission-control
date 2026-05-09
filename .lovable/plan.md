
# Crédito 5A — Design Elevation Pass

Elevação visual do sandbox KRATOS para parecer cockpit premium Apple-clean (VisionOS + Raycast + Linear + Vercel + observability). Sem nova lógica, sem features, sem dependências.

## Direção (resumo de qualidade)

1. **Mais Apple-clean**: tipografia com mais hierarquia (display tight, mono para números/prazos), espaçamento mais generoso entre seções, bordas hairline (1px @ 6–8% white), profundidade via *layered surfaces* (surface-1/2/3) e não via sombra colorida. Zero gradiente chamativo, zero neon, zero branco puro (texto primário fica em `--kratos-text-primary` que já é off-white).
2. **Não vira admin template**: substituir títulos genéricos por *operational copy* curta; cada tela ganha um *hero strip* fino (eyebrow + título + 1 linha de contexto) em vez do header retangular padrão; navegação ativa marcada por barra lateral fina + leve `surface-3`, não por bloco colorido.
3. **/agora mais impactante sem encher**: hero do Foco vira protagonista — ocupa coluna inteira em desktop com tipografia maior, número/prazo em mono e badge LIVE discreta. Demais cards descem em densidade visual (subtler) para criar contraste de prioridade. Nenhum card novo.
4. **AuroraPanel premium sem virar chat**: glass sutil mantido (já existe), adicionar header com micro divisor luminoso, mensagens em cápsulas com borda hairline, quick-actions como chips compactos, input mock com placeholder calmo ("Aurora está em modo visual"). Nada de bolha de chat infinita.
5. **Cards menos genéricos**: padronizar interior — eyebrow mono em `text-muted` + título 14–15px semibold + corpo 13px + footer com badge/meta em mono 10–11px tracking 0.15em. Hover eleva para `surface-3` + borda 10% white. Focus ring em `--kratos-accent` com offset.

## Arquivos a alterar

Shell:
- `src/styles.css` — adicionar utilitários *visuais* (não-tokens novos): `.kratos-eyebrow`, `.kratos-display`, `.kratos-num`, `.kratos-divider-soft`, `.kratos-hairline`, refinar `.kratos-card-hover`, `.kratos-focus-ring`, `.kratos-aurora-glass`. Sem cores novas, sem dependências.
- `src/components/kratos/shell/AppShell.tsx` — ritmo do container principal, padding vertical maior, gutter responsivo (apenas estética).
- `src/components/kratos/shell/Sidebar.tsx` — agrupamento visual (eyebrow "Operação" / "Sistema"), refino do item ativo (barra accent + surface-3), espaçamento.
- `src/components/kratos/shell/Topbar.tsx` — limpar densidade, logo com mais presença, separadores hairline, botão Aurora com estado mais elegante.
- `src/components/kratos/shell/StatusBar.tsx` — texto mais compacto e calmo, separadores em vez de bullets, microcopy operacional.
- `src/components/kratos/shell/AuroraPanel.tsx` — header refinado (divisor luminoso, eyebrow "Aurora · Mentor"), manter largura/transição/fechar.

Aurora:
- `src/components/kratos/aurora/AuroraPanelContent.tsx`, `AuroraMessagePreview.tsx`, `AuroraQuickActions.tsx`, `AuroraInputMock.tsx` — visual VisionOS sutil, cápsulas com hairline, chips compactos, input mock calmo.

Base (apenas refino visual, sem mudar API):
- `src/components/kratos/base/SystemCard.tsx` — borda hairline, hover mais elegante, transições 180–200ms.
- `src/components/kratos/base/StatusCard.tsx` — accents mais discretos.
- `src/components/kratos/base/SectionHeader.tsx` — eyebrow + título + meta alinhados, divisor soft opcional.
- `src/components/kratos/base/AlertBadge.tsx`, `StatusDot.tsx`, `LiveStatusIndicator.tsx` — densidade, mono, pulse mais sutil.

Views (apenas hierarquia, ritmo, microcopy — sem novos cards):
- `src/components/kratos/views/AgoraView.tsx` — promover FocusCard a hero (maior, mais ar), demais cards em densidade reduzida.
- `src/components/kratos/views/AgendaView.tsx` — manter `DoNotDoPanel` na primeira dobra, refinar hierarquia entre Mentor/Score/Risk e o plano do dia.
- `src/components/kratos/views/ContextoView.tsx` — hero do contexto mais limpo, lista limitada a respiração visual.
- `src/components/kratos/views/CheckpointsView.tsx` — "Retomar daqui" como peça visual mais forte (card destacado, não botão isolado).
- `src/routes/sistema.tsx` — organização em grid mais técnico/legível dos 9 estados.
- `src/routes/index.tsx` — microcopy operacional ("Você está aqui.") e CTA discreto para `/agora`.

## Arquivos NÃO tocados

`backend/**`, `src/hooks/**`, `src/lib/**`, `src/types/**`, `package.json`, `vite.config.ts`, `tsconfig.json`, qualquer `.env`, `src/router.tsx`, `src/routeTree.gen.ts`, `src/server.ts`, `src/start.ts`.

## Microinterações permitidas

Hover 180ms (surface + border), pulse LIVE 2s ease-in-out já existente, fade-in 300ms já existente, focus ring accent. Nada de bounce, parallax, 3D, neon.

## Garantias

- Nenhuma lógica nova: sem `fetch`, sem `useEffect` novo com side effect, sem hooks customizados, sem handlers reais. Botões mock continuam mock (`disabled` + `aria-label` + `title` quando aplicável).
- Nenhuma cor fora dos tokens KRATOS existentes em `src/styles.css`.
- Nenhuma dependência adicionada.
- Estrutura funcional aprovada preservada em `/agora`, `/agenda`, `/contexto`, `/checkpoints`, `/sistema` e AuroraPanel.
- Responsividade ampla, acessibilidade completa e padronização de estados ruins ficam para 5B / 6 / 7 conforme acordado — este passe foca só em elevação visual.

Aguardando aprovação para executar o Build do 5A.
