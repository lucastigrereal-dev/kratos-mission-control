# BRIDGE V1 — KRATOS OMNIS HEALTH REPORT

**Data:** 2026-05-14
**Fase:** V1 — KRATOS omnis_collector consome OMNIS /health via HTTP
**Status:** CONCLUIDO

---

## 1. Objetivo

Fazer o `omnis_collector` do KRATOS consumir o endpoint HTTP real `GET OMNIS_HEALTH_URL` em vez de depender exclusivamente de filesystem scan.

---

## 2. Arquivos Modificados

| Arquivo | Ação | Linhas |
|---|---|---|
| `backend/app/collectors/omnis_collector.py` | Modificado | +89 / -28 |
| `backend/tests/test_omnis_collector.py` | Criado | +144 (12 testes) |

Nenhum outro arquivo alterado. Nenhum endpoint público modificado.

---

## 3. O Que Mudou

### Antes
```
collect_status() → filesystem scan (único caminho)
```

### Depois
```
collect_status() → HTTP GET OMNIS_HEALTH_URL
                 → se OK: retorna dados normalizados do /health
                 → se falhar: fallback automático para filesystem scan
```

### Detalhes técnicos
- Cliente HTTP: `urllib.request` (Python stdlib, zero dependências novas)
- Timeout: 3 segundos
- Validação da resposta HTTP: status 200 + JSON válido + campo `status` presente
- Fallback: se `OMNIS_HEALTH_URL` não estiver definida, ou HTTP falhar por qualquer motivo, usa filesystem scan
- `collect_summary()` também consome HTTP com o mesmo padrão de fallback

---

## 4. Testes

### Novos: 12/12 pass
```
tests/test_omnis_collector.py::test_fetch_health_http_returns_none_when_url_not_set PASSED
tests/test_omnis_collector.py::test_fetch_health_http_returns_parsed_json_on_200 PASSED
tests/test_omnis_collector.py::test_fetch_health_http_returns_none_on_non_200 PASSED
tests/test_omnis_collector.py::test_fetch_health_http_returns_none_on_connection_error PASSED
tests/test_omnis_collector.py::test_fetch_health_http_returns_none_on_invalid_json PASSED
tests/test_omnis_collector.py::test_fetch_health_http_returns_none_when_status_field_missing PASSED
tests/test_omnis_collector.py::test_collect_status_uses_http_when_available PASSED
tests/test_omnis_collector.py::test_collect_status_falls_back_to_filesystem_when_http_fails PASSED
tests/test_omnis_collector.py::test_collect_status_returns_error_on_catastrophic_failure PASSED
tests/test_omnis_collector.py::test_collect_summary_uses_http_when_available PASSED
tests/test_omnis_collector.py::test_collect_summary_falls_back_when_http_fails PASSED
tests/test_omnis_collector.py::test_scan_filesystem_returns_expected_keys PASSED
```

### Existentes: 127/128 pass (1 falha pre-existente: `psutil` não instalado)
- `test_omnis_status` — **PASS**
- `test_omnis_summary` — **PASS**

---

## 5. Como Configurar OMNIS_HEALTH_URL

### Opção A — Variável de ambiente
```powershell
$env:OMNIS_HEALTH_URL = "http://127.0.0.1:5200/health"
```

### Opção B — .env no backend do KRATOS
```bash
# Criar C:\Users\lucas\kratos-mission-control\backend\.env
OMNIS_HEALTH_URL=http://127.0.0.1:5200/health
```

### Sem configurar
Se `OMNIS_HEALTH_URL` não estiver definida, o coletor continua funcionando normalmente com filesystem scan. Zero breaking change.

---

## 6. Comandos Executados

```powershell
# Rodar apenas os testes do omnis_collector
pytest tests/test_omnis_collector.py -v

# Rodar toda a suite de testes
pytest tests/ -v --ignore=tests/test_omnis_collector.py
```

---

## 7. Riscos

| Risco | Nível | Mitigação |
|---|---|---|
| OMNIS /health offline → KRATOS volta ao fallback | Baixo | Fallback automático, sem interrupção |
| Timeout HTTP (3s) atrasa coleta | Baixo | Sub-coletor já tem timeout de 2s no live_event_service |
| Dados do /health formatados diferente do esperado | Baixo | Validação de schema (`status` obrigatório) + fallback |
| Servidor OMNIS exposto em rede | Médio | Bind apenas em 127.0.0.1 (já implementado no V0) |

---

## 8. Próximos Passos

**BRIDGE V2 — Execution Intent Pendente:**
- Aurora gera `execution_intent.json` a partir de anomalias detectadas pelo KRATOS
- Enviar intenção para fila de aprovação do AURORA_CONTROL
- Sem POST até aprovação explícita

**Para testar com saúde real:**
```powershell
# Terminal 1: iniciar OMNIS health server
cd C:\Users\lucas\omnis-control
python src/health/server.py

# Terminal 2: testar via KRATOS
$env:OMNIS_HEALTH_URL = "http://127.0.0.1:5200/health"
cd C:\Users\lucas\kratos-mission-control\backend
.venv\Scripts\python.exe -c "from app.collectors.omnis_collector import collect_status; print(collect_status())"
```

---

## 9. Veredito

**BRIDGE V1: CONCLUIDO.** KRATOS agora consome OMNIS /health via HTTP com fallback automático para filesystem scan. Mudança mínima, zero breaking changes, 12 novos testes, 127/128 testes existentes intactos.

A ponte está viva.

---

*Relatório gerado por BRIDGE V1 — 2026-05-14*
