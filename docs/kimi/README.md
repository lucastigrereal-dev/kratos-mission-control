# KRATOS KIMI — Pacote Reorganizado para Claude Code

**Origem:** `KRATOS_KIMI_FRONTEND_PACK_V1_COMPILED.zip`  
**Status:** reorganizado para uso seguro no KRATOS `feature/kratos-1-visual-shell`  
**Regra suprema:** Kimi é **referência**, não ordem de cópia direta.

## Como instalar no repo KRATOS

Copie a pasta `docs/kimi/` para:

```powershell
C:\Users\lucas\kratos-mission-control\docs\kimi
```

Copie a pasta `frontend/public/references/kimi/` para:

```powershell
C:\Users\lucas\kratos-mission-control\frontend\public\references\kimi
```

## Ordem de uso

1. Leia `docs/kimi/KIMI_NEXT_MICROPHASE.md`.
2. Leia `docs/kimi/KIMI_EXECUTION_ROADMAP.md`.
3. Leia `docs/kimi/KIMI_COMPONENT_MAP.md`.
4. Use os arquivos em `03_component_reference/` apenas como referência.
5. Nunca copie sem comparar com o repo real.
6. Depois de executar uma microfase, atualize `docs/kimi/KIMI_ADOPTION_LOG.md`.

## Regra de segurança

- Não tocar em `backend/`.
- Não tocar em `useLiveKratos.ts`.
- Não mexer em `/live/stream`, `/live/snapshot`, `/mission/lens`.
- Não instalar dependência sem autorização.
- Não usar `git add .`.

