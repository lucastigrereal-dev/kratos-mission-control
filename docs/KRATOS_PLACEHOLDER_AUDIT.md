# KRATOS Placeholder Audit

**Data:** 2026-05-16
**Commit:** `f280e09`

---

## Placeholders restantes

### 1. Mentor/Aurora — AI-derived data (AgendaView)

| Placeholder | Localização | Dependência |
|---|---|---|
| `MENTOR_MOCK.recommendation` | `AgendaView.tsx:231` | AI agent pipeline |
| `MENTOR_MOCK.score` | `AgendaView.tsx:234` | AI agent pipeline |
| `MENTOR_MOCK.finishline` | `AgendaView.tsx:246` | AI agent pipeline |
| `MENTOR_MOCK.donotdo` | `AgendaView.tsx:247` | AI agent pipeline |

### 2. AuroraPanel — chat/intelligence (AuroraPanelContent)

| Placeholder | Localização | Dependência |
|---|---|---|
| `MOCK_AURORA.greeting` | `AuroraPanelContent.tsx:22` | Aurora runtime |
| `MOCK_AURORA.state` | `AuroraPanelContent.tsx:30` | Aurora runtime |
| `MOCK_AURORA.message` | `AuroraPanelContent.tsx:35` | Aurora runtime |

### 3. MiniAgenda — AgoraView

| Placeholder | Localização | Dependência |
|---|---|---|
| `MiniAgenda items={[]}` | `AgoraView.tsx:258` | Appointment data integration |

---

## Já resolvido (não-placeholder)

- **zero** `console.log` em `src/components/kratos/`
- Sidebar navigation: TanStack Router Link com active state ✅
- Checkpoints CRUD: hooks reais (create/update/delete) via server fns ✅
- SystemPulseStrip: `useLiveStatus` com dados de `useServices` + `useOmnisStatus` ✅
- RiskProjectCard: `useCheckpointSuggestion` com dados de checkpoints + projects reais ✅
- DashboardView GitHub: API real com timeout 3s e mock fallback ✅
- GitHub tracked repos: loading state + individual error isolation ✅
- SistemaView OMNIS: loading/error/empty independentes por seção ✅
