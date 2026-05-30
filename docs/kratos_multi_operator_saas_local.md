# KRATOS Multi-Operator SaaS — Local Mode

**Versão:** W20  
**Status:** LOCAL MOCK — sem auth real  

---

## Modelo de Dados

```
OperatorProfile
  id, name, handle, role, avatarInitial, sessionSource("mock")

Workspace
  id, name, slug, tier("personal"|"pro"), source("mock")
  operators: [{ operatorId, role }]

LocalSession
  operator: OperatorProfile
  workspace: Workspace
  permissions: OperatorPermission[]
  authMode: "mock"           ← sempre em W20
  isAuthenticated: true
```

## Roles e Permissões

| Role | execute:dry_run | manage:workspace | dev:raw_data | view:billing |
|------|:-:|:-:|:-:|:-:|
| admin | ✅ | ✅ | ✅ | ✅ |
| operator | ✅ | ❌ | ❌ | ❌ |
| viewer | ❌ | ❌ | ❌ | ❌ |
| dev | ✅ | ❌ | ✅ | ✅ |

**execute:real** — nenhum role tem. Requer W28.

## Components Criados

- `api-contract/operator.schema.ts` — schemas Zod + DEFAULT_SESSION
- `src/lib/operator-session.ts` — in-memory session store
- `src/hooks/useOperatorSession.ts` — React hook + useRBACGuard
- `src/components/kratos/pro/MockModeAuditBanner.tsx` — banner LOCAL MOCK MODE
- `src/components/kratos/pro/OperatorWorkspaceSelector.tsx` — seletor dropdown

## Human Slots

| Item | Status |
|------|--------|
| OAuth Meta | BLOCKED — META_APP_ID + SECRET |
| OAuth Google | BLOCKED — não configurado |
| Real session backend | BLOCKED — requer W28 |
| execute:real permission | BLOCKED — W28+ |

---

**W20 COMPLETE (local/mock)**
