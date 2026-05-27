# KRATOS — Plano de Construção

> Objetivo: substituir o frontend atual por um cockpit premium que supera o Lovable.

## Decisões tomadas
- Stack: React 19 + TanStack + Tailwind v4 + shadcn/ui + **Framer Motion 12** ✅
- Layout: HUD-first, mundo-primeiro, sem sidebar quadrada
- Backend: FastAPI port 5100 (não mexer)
- OMNIS: read-only agora, arquitetura extensível para ações
- Árvore de trabalho: sempre `src/`

---

## FASE 0 — Fundação ✅ COMPLETA

- 10 skills de engenharia criadas
- 8 commands criados
- docs/ai/ criado (design-rules, workflow, prompt-patterns)
- CLAUDE.md atualizado
- Framer Motion 12 instalado

---

## FASE 1 — Shell + HUD Adaptativo 🔄 PRÓXIMA

Matar o layout quadrado. Criar HUD que faz o mundo respirar.

```
TopHUD (48px)
  energia · hora · missão resumida · status live · AuroraOrb

NavRail (48px largura)
  ícones de navegação · expande em hover/clique · Framer Motion

Área central (flex-1)
  mundo de ilhas / conteúdo da rota ativa
  painéis contextuais entram como overlays

AuroraDrawer (slide da direita)
  expande do AuroraOrb · mundo continua ao fundo

BottomDock (56px)
  missão atual · próxima ação · checkpoint · status
```

---

## FASE 2 — World Map com 11 Ilhas

Ilhas como domínios cognitivos, não decoração.

Palco Central · OMNIS Lab · Akasha · Arena Comercial ·
Agência/Estúdio · Vila Viva · Forja · Observatório ·
Tesouro · Nimbus Academy · Finalizar

---

## FASE 3 — Mission Lens

SSE único sem duplicação. Source badges honestos. Fallback explícito.

---

## FASE 4 — Agora Screen

As 9 perguntas respondidas em < 10 segundos.

---

## FASE 5 — Aurora

Orb flutuante → drawer contextual. Command palette completa.

---

## FASE 6 — OMNIS Bridge

Read-only. Arquitetura pronta para ações quando Lucas autorizar.

---

## FASE 7 — Polish + QA

Screenshots, design-system-guardian, acessibilidade, bundle.
