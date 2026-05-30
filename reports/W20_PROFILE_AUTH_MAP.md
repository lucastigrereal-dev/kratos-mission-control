# W20 PROFILE + AUTH MAP

**Data:** 2026-05-30  
**Status:** Mapeamento completo  

---

## Estado Atual de Auth/Perfil

### Arquivos Existentes

| Arquivo | Status | Notes |
|---------|--------|-------|
| `src/components/kratos/pro/UserProfileScreen.tsx` | ✅ W17 | Operador hardcoded: Lucas Tigre, 6 perfis, tiers Personal/Pro |
| `src/components/kratos/pro/BillingScreen.tsx` | ✅ W18 | Stripe placeholder, pricing cards |
| `src/routes/perfil.tsx` | ✅ W17 | Rota `/perfil` |
| `src/lib/kratos-routes.ts` | ✅ | 8 rotas, inclui /perfil |

### Auth Status

**Nenhuma autenticação existe.** KRATOS é local-first, operador único.

| Sistema Auth | Status |
|-------------|--------|
| OAuth Meta | ❌ BLOCKED_EXTERNAL (META_APP_ID faltando) |
| OAuth Google | ❌ Não implementado |
| JWT local | ❌ Não implementado |
| Session backend | ❌ Não existe |
| Auth local mock | 🎯 A criar em W20 |

### Modelo de Operador Atual

```typescript
// UserProfileScreen.tsx — hardcoded
const OPERATOR = {
  name: "Lucas Tigre",
  handle: "@lucastigrereal", 
  role: "Criador de Conteúdo & Operador",
  mode: "Sobrevivência — gera caixa AGORA",
  totalFollowers: "2.320.000+",
};
```

### RBAC Atual

**Não existe.** Todas as telas são visíveis para qualquer usuário.

---

## Gap W20

| Necessidade | Estado atual | O que criar |
|------------|-------------|-------------|
| OperatorProfile type | Hardcoded inline | Schema Zod tipado |
| Workspace | Não existe | Zod schema + mock |
| Role | Não existe | Enum: admin/operator/viewer/dev |
| Permissions | Não existe | Record<Role, Permission[]> |
| Auth session mock | Não existe | Provider React local |
| RBAC visual | Não existe | Hook useOperatorRole() |
| Audit banner | Não existe | "LOCAL MOCK MODE" banner |
| Human Slot | Não existe | OAuth Meta slot visual |

---

**MAP COMPLETO → W20-B02**
