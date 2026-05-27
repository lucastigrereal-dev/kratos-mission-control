---
id: integration-architect
name: Integration Architect
description: Arquitetura de integrações do KRATOS com OMNIS, Akasha e GitHub — read-only por padrão, extensível para ações, sem quebrar Mission Lens ou SSE.
tags: [integration, omnis, akasha, github, architecture, bridge]
version: 1.1
context: kratos-mission-control
tree: src/
priority: P1
anthropic_principle: minimal-footprint — KRATOS observa, OMNIS age. Nunca inverter essa hierarquia.
---

# SKILL: Integration Architect

## Propósito
Projetar e implementar pontes do KRATOS com sistemas externos. **KRATOS vê — nunca executa.** Toda integração começa read-only e só evolui para ações com autorização explícita.

## Regra de Ouro
```
KRATOS vê.
Aurora interpreta.
OMNIS/HOMINIS age.
Akasha lembra.
Lucas decide.
```
Qualquer design que inverta essa hierarquia está errado.

## Quando Usar
- Implementar nova integração (OMNIS, Akasha, GitHub, ActivityWatch)
- Revisar bridge existente
- Decidir se uma integração deve ser read-only ou ter ações

## Integrações Mapeadas

### OMNIS (status read-only)
```typescript
// src/hooks/useOmnis.ts
export function useOmnisStatus() {
  return useQuery({
    queryKey: ['omnis', 'status'],
    queryFn: () => fetchOmnisStatus(),        // GET apenas
    refetchInterval: 30_000,
    // Fallback: mostrar last-known-state se offline
  })
}

// NUNCA implementar sem autorização:
// triggerCrew(), approveWorkflow(), postToOmnis()
// Essas funções ficam comentadas com:
// // TODO(autorização Lucas): ativar ações OMNIS
```

### Akasha (busca read-only)
```typescript
// src/hooks/useAkasha.ts
export function useAkashaSearch(query: string) {
  return useQuery({
    queryKey: ['akasha', 'search', query],
    queryFn: () => searchAkasha(query),       // GET apenas
    enabled: query.length > 2,
  })
}
// KRATOS não escreve na Akasha — só lê
```

### GitHub (status read-only)
```typescript
// src/hooks/useGithub.ts — já implementado
// Padrão correto:
export function useGithubStatus(repo: string) {
  return useQuery({
    queryKey: ['github', repo],
    queryFn: () => fetchGithubStatus(repo),
    refetchInterval: 60_000,
  })
}
```

### Backend FastAPI (port 5100)
```typescript
// Endpoint base: http://127.0.0.1:5100
// Proxy: frontend/vite.config.ts → /api → :5100
// SSE: /live/stream
// Fallback: /live/snapshot

// useApi<T>() já implementado em src/hooks/useApi.ts
// SEMPRE usar este hook, nunca fetch() raw
```

## Processo de Nova Integração

### Passo 1 — Definir contrato
```typescript
// api-contract/<nome>.schema.ts PRIMEIRO
import { z } from 'zod'

export const <Nome>StatusSchema = z.object({
  status: z.enum(['active', 'idle', 'error', 'offline']),
  source: z.enum(['live', 'cached', 'mock', 'offline']),
  timestamp: z.string(),
  // ...dados específicos
})

export type <Nome>Status = z.infer<typeof <Nome>StatusSchema>
```

### Passo 2 — Implementar hook
```typescript
// src/hooks/use<Nome>.ts
export function use<Nome>Status() {
  const { data, isLoading, error } = useApi<<Nome>Status>(
    '/api/<nome>/status'
  )

  return {
    status: data,
    isLoading,
    error,
    isOffline: data?.source === 'offline',
    isMock: data?.source === 'mock',
  }
}
```

### Passo 3 — Source Badge obrigatório
Todo componente que exibe dado de integração DEVE mostrar:
```tsx
<SourceBadge source={status?.source ?? 'offline'} />
// 🟢 live | 🟡 cached | 🔴 mock | ⚫ offline
```

### Passo 4 — Fallback explícito
```typescript
// Integração NUNCA quebra o frontend
// Se offline → mostrar estado degradado com informação útil
// Se mock → badge claro indicando dado sintético
// Se stale → timestamp visível de quando foi atualizado
```

### Passo 5 — Adicionar testes
```typescript
// tests/stores/<nome>-store.test.ts
describe('<Nome> integration', () => {
  it('retorna status live quando disponível', ...)
  it('retorna fallback quando offline', ...)
  it('valida schema com Zod', ...)
})
```

## Extensão para Ações (futuro)
Arquitetura preparada mas desabilitada:
```typescript
// TODO(autorização Lucas): descomentar para ativar ações
// export async function triggerOmnisCrew(crewId: string) {
//   return await postToOmnis('/crews/' + crewId + '/trigger')
// }
```

## Anti-patterns
- KRATOS disparar ações em OMNIS sem autorização
- Integração sem schema Zod
- Dados de integração sem source badge
- Frontend quebrando quando integração cai
- fetch() raw em vez de useApi<T>()

## Saída Esperada
Schema Zod em `api-contract/`, hook em `src/hooks/`, source badge no componente, testes, fallback explícito.
