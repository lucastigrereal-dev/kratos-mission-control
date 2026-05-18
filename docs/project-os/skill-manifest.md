# KRATOS Skill Manifest

**Status:** Canonical | **Version:** 2.0 | **Date:** 2026-05-18

---

## Active Skills

### Core Tier — Build & Quality

| Skill | Arquivo | Propósito |
|-------|---------|-----------|
| `api-contract-sync` | `.claude/skills/api-contract-sync.md` | Sincronizar contratos de API entre frontend e backend |
| `token-enforcer` | `.claude/skills/token-enforcer.md` | Garantir zero hex colors, 100% token CSS |
| `visual-qa-kimi` | `.claude/skills/visual-qa-kimi.md` | QA visual pós-implementação |
| `neuro-ux-checker` | `.claude/skills/neuro-ux-checker.md` | Validar regras TDAH-first (Miller, animações, estados) |
| `motion-guardian` | `.claude/skills/motion-guardian.md` | Garantir prefers-reduced-motion e animações corretas |

### Builder Tier — Component Construction

| Skill | Arquivo | Propósito |
|-------|---------|-----------|
| `glass-panel-builder` | `.claude/skills/glass-panel-builder.md` | Construir painéis glass-morphism |
| `hud-assembler` | `.claude/skills/hud-assembler.md` | Montar HUD elements (topbar, statusbar, badges) |
| `island-composer` | `.claude/skills/island-composer.md` | Compor cards de sistema (Akasha, OMNIS, GitHub) |

### Integration Tier — External Systems

| Skill | Arquivo | Propósito |
|-------|---------|-----------|
| `akasha-vault-builder` | `.claude/skills/akasha-vault-builder.md` | Construir UI de status/ busca da Akasha |
| `omnis-lab-builder` | `.claude/skills/omnis-lab-builder.md` | Construir UI de status/health do OMNIS |

### Meta Tier — Code Generation

| Skill | Arquivo | Propósito |
|-------|---------|-----------|
| `kimi-to-code` | `.claude/skills/kimi-to-code.md` | Converter especificações KIMI em código |

---

## Skill Tiers

```
meta:     kimi-to-code
           │
builder:  glass-panel-builder, hud-assembler, island-composer
           │
core:     api-contract-sync, token-enforcer, visual-qa-kimi,
          neuro-ux-checker, motion-guardian
           │
integration: akasha-vault-builder, omnis-lab-builder
```

---

## Skill Invocation Rules

1. **Core skills rodam automaticamente** no QA gate
2. **Builder skills** são chamadas por agentes (`kratos-ui-builder`)
3. **Integration skills** exigem contrato de API externa documentado
4. **Meta skills** são chamadas manualmente quando novo spec KIMI chega

---

## Deprecation Log

Skills removidas ou absorvidas:

| Skill | Data | Destino |
|-------|------|---------|
| (none) | — | — |

---

*Manifesto canônico. Atualizado quando skills são adicionadas, removidas ou modificadas.*
