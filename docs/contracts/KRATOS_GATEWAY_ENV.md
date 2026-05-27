# KRATOS Gateway Env (Contract v1)

These variables configure the server-side gateway used by KRATOS to call OMNIS
without exposing secrets in browser `VITE_*` variables.

## Required

- `OMNIS_API_BASE_URL`  
  Example: `http://localhost:8001`

- `KRATOS_OMNIS_API_KEY`  
  Secret sent as `X-KRATOS-KEY` by server functions.

## Important

- Do **not** use `VITE_KRATOS_OMNIS_API_KEY`.
- Keep the key server-side only.
- Canonical auth header is `X-KRATOS-KEY` (do not use `X-API-Key` in new integrations).
- Frontend hooks should call KRATOS server functions, not OMNIS directly for authenticated routes.
- SSE status probe uses `/v1/events/status` first and falls back to `/events/status` during migration.
