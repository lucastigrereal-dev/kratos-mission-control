# KRATOS → OMNIS Write Bridge Contract

**Versão:** 1.0 (W19 — Local/Mock/Dry-Run)  
**Data:** 2026-05-30  
**Status:** SPEC_ONLY — sem chamadas externas reais  

---

## Boundary Imutável

```
KRATOS vê.
Aurora interpreta.
OMNIS/HOMINIS age.
Akasha lembra.
Codex/Claude constrói.
Lucas decide.
```

**KRATOS nunca executa comandos OMNIS diretamente.**  
W19 cria a interface de escrita em modo dry-run + human gate only.

---

## Modos de Operação

| Modo | Descrição | Chama OMNIS real? |
|------|-----------|-------------------|
| `dry_run` | Simula payload, retorna preview | ❌ Nunca |
| `mock` | Retorna resposta mock estática | ❌ Nunca |
| `human_gate` | Aguarda aprovação de Lucas | ❌ Até aprovação |
| `live_unavailable` | OMNIS offline ou não configurado | ❌ Backend down |

---

## Fluxo de Envio

```
Lucas digita comando
    ↓
MissionCommandSchema.parse()  ← validação Zod
    ↓
WriteBridgeAdapter.preview()   ← sem execução
    ↓
[HumanApprovalGate]            ← Lucas revisa
    ↓
  ┌─ Aprovado → WriteBridgeAdapter.sendDryRun()  ← mock response
  └─ Rejeitado → ExecutionStatus: rejected
```

---

## Tipos Principais

### MissionCommand

```typescript
{
  command: string          // ex: "Gerar briefing matinal"
  target_skill?: string   // ex: "jarvis-morning"
  context?: Record<string, unknown>
  requested_mode: "dry_run" | "human_gate" | "mock" | "live_unavailable"
  requested_at?: string
}
```

### ExecutionResponse

```typescript
{
  request_id: string
  status: "pending_approval" | "approved" | "dry_run_complete" | "rejected" | "error" | "live_unavailable"
  mode: ExecutionMode
  payload_preview?: Record<string, unknown>   // O que seria enviado
  mock_response?: {
    estimated_duration_ms?: number
    estimated_tokens?: number
    affected_skills: string[]
    warnings: string[]
    note?: string
  }
  source: "dry_run" | "mock" | "live_unavailable" | "human_gate"
  processed_at: string
}
```

### HumanApprovalGate

```typescript
{
  gate_id: string
  request_id: string
  command_summary: string
  risk_level: "low" | "medium" | "high" | "critical"
  risk_reasons: string[]
  requires_confirmation: true   // SEMPRE true
  checklist: Array<{ id, label, required }>
  status: "pending" | "approved" | "rejected"
}
```

---

## Regras de Segurança

1. **`live_enabled`** é sempre `false` em modo local (W19)
2. **`human_gate_required`** é sempre `true` — nunca pode ser `false`
3. **Nenhuma secret key** no bundle KRATOS
4. **Nenhuma chamada HTTP** ao OMNIS backend por este adapter
5. **Source badge** sempre visível: `"dry_run"` ou `"mock"` ou `"live_unavailable"`
6. **Comando de risco `high`/`critical`** exige checklist extra de confirmação

---

## Human Slots (desbloqueio futuro)

| Item | Quando desbloquear | Pré-requisito |
|------|-------------------|---------------|
| `live_enabled = true` | W28 App Factory deploy | OMNIS API key + KRATOS auth |
| Execução automática | Nunca sem gate | Não planejado |
| Webhook OMNIS | W28+ | Backend OMNIS configurado |

---

## Schema Source

`api-contract/omnis-write-bridge.schema.ts`

---

**STATUS: SPEC COMPLETA — W19-B04**
