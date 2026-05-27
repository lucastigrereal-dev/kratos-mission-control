# KRATOS — Tasks

`[x]` concluído · `[ ]` pendente · `[~]` em progresso

---

## FASE 0 — Fundação ✅

- [x] Instalar Framer Motion 12
- [x] 10 skills de engenharia em `.claude/skills/`
- [x] 8 commands em `.claude/commands/`
- [x] `docs/ai/design-rules.md`
- [x] `docs/ai/workflow.md`
- [x] `docs/ai/prompt-patterns.md`
- [x] `CLAUDE.md` atualizado
- [x] `plan.md` + `tasks.md` criados

---

## FASE 1 — Shell + HUD Adaptativo

- [x] P0 Mapear layout atual (encontrar `grid-cols` problemático)
- [x] P0 `TopHUD.tsx` — 48px, status live, missão resumida
- [x] P0 `NavRail.tsx` — rail fino, expand/collapse Framer Motion
- [x] P0 `BottomDock.tsx` — missão + próxima ação + status
- [x] P0 `AuroraOrb.tsx` — presença flutuante com pulso
- [x] P0 `AuroraDrawer.tsx` — slide direita, Framer Motion
- [x] P0 Atualizar shell principal — HUD-first
- [x] P0 Full-screen mockup stage — imagem como base, overlays vivos por cima
- [x] P1 Gate: `bun run build` passes clean

---

## FASE 2 — World Map

- [ ] P0 `IslandCard.tsx` — card com estados (live/loading/empty)
- [ ] P0 `IslandOverlay.tsx` — expand + blur de fundo
- [ ] P1 Ilhas P0: Palco Central, OMNIS Lab, Akasha
- [ ] P2 Ilhas restantes (8)
- [ ] P1 Gate: `bun run build` + `/snapshot-visual`

---

## FASE 3 — Mission Lens

- [ ] P0 Auditar SSE duplicados
- [ ] P0 `useMissionLens.ts` — SSE único + fallback
- [ ] P0 `SourceBadge.tsx` — live/cached/mock/offline
- [ ] P1 Gate: `bun run build` + `bun test`

---

## FASE 4 — Agora Screen

- [ ] P0 `MissionCard.tsx`
- [ ] P0 `NextActionCard.tsx`
- [ ] P1 `DoNotDoCard.tsx`
- [ ] P1 `RisksPanel.tsx`
- [ ] P1 `CheckpointCard.tsx`
- [ ] P2 `DriftIndicator.tsx`
- [ ] P1 Gate: `/revisar-ui` + `bun run build`

---

## FASE 5 — Aurora

- [ ] P1 `AuroraOrb.tsx` com pulso Framer Motion
- [ ] P1 `AuroraDrawer.tsx` com estado real
- [ ] P2 Completar actions do `AuroraCommandPalette.tsx`

---

## FASE 6 — OMNIS Bridge

- [ ] P1 Schema Zod `api-contract/omnis.schema.ts`
- [ ] P1 `useOmnisStatus()` read-only
- [ ] P2 Source badge na ilha OMNIS Lab

---

## FASE 7 — Polish

- [ ] P1 `/snapshot-visual` todas as rotas
- [ ] P1 `design-system-guardian` todos os componentes novos
- [ ] P2 Migrar tokens legados `--kratos-*` → `--kr-*`
- [ ] P2 Acessibilidade + bundle audit

---

## Dependências do Lucas

- [ ] Autorização para `wrangler deploy`
- [ ] Secrets Cloudflare no dashboard
- [ ] Decisão: OMNIS bridge terá ações além de read-only?
