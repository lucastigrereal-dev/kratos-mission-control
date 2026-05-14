---
name: kimi-to-code
description: "Converte especificações visuais do Kimi (KRATOS Visual Specs) em código TypeScript/React pronto para o frontend."
metadata:
  type: skill
  tier: core
  project: kratos-mission-control
  scope: frontend
  protected_endpoints:
    - /live/stream
    - /live/snapshot
    - /mission/lens
    - /context/current
    - /context/checkpoint
---

# kimi-to-code

Converte especificações visuais do Kimi em componentes React/TypeScript seguindo o design system KRATOS.

## Responsabilidades
- Ler specs visuais (Fase2, Fase3, visualspec4, etc.) e gerar componentes
- Garantir que TODO componente use tokens CSS (`var(--kr-*)`), nunca hex direto
- Garantir que TODO componente declare interface de props, nunca `any`
- Garantir que TODO componente tenha fallback seguro (backend offline não quebra a página)
- Garantir que TODO fetch use os hooks existentes (`useApi`, `useLiveKratos`), nunca fetch raw

## Anti-padrões (NUNCA fazer)
- Criar fetch raw com `useEffect` + `fetch()` — usar `useApi<T>(path)`
- Usar `style={{ color: "#fff" }}` — usar `var(--kr-text-primary)`
- Recriar KratosVisualShell, KratosWorldMap, Layout.tsx
- Alterar backend/, criar endpoint novo, ou alterar contratos existentes
- Instalar Three.js, React Three Fiber, ou qualquer lib 3D

## Contratos existentes (read-only)
| Endpoint | Hook | Contrato |
|----------|------|----------|
| GET /live/snapshot | `useLiveKratos().snapshot` | `LiveSnapshot` |
| GET /live/stream | `useLiveKratos()` SSE | `SSE stream` |
| GET /mission/lens | `useApi<MissionLensBrief>("/mission/lens")` | Mission Lens v1 |
| GET /context/current | `useApi<ContextData>("/context/current")` | Context + drift + checkpoint_suggestion |
| POST /context/checkpoint | `useCheckpointSuggestion().createCheckpoint()` | Checkpoint payload |
| GET /tasks | `useApi<Task[]>("/tasks")` | Task list |
| GET /checkpoints | `useApi("/checkpoints")` | Checkpoint list |
| GET /projects | `useApi("/projects")` | Project list |
| GET /system | via `/live/snapshot` | Collector status |

## Padrão de componente novo
```tsx
import { useApi } from "../hooks/useApi";
import SourceBadge, { type SourceType } from "../components/SourceBadge";

interface MeuComponenteProps {
  titulo: string;
  ativo?: boolean;
}

export default function MeuComponente({ titulo, ativo = false }: MeuComponenteProps) {
  // usar useApi para dados, useCallback para handlers, useMemo para derivados
  return (
    <div className="kr-card" style={{ borderColor: ativo ? "var(--kr-aurora-500)" : "var(--kr-border-default)" }}>
      <h6>{titulo}</h6>
    </div>
  );
}
```
