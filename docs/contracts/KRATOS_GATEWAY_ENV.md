# KRATOS Gateway Env (Contract v1)

These variables configure the server-side gateway used by KRATOS to call OMNIS
without exposing secrets in browser `VITE_*` variables.

## Required

- `OMNIS_API_BASE_URL`  
  Example: `http://localhost:5100`

- `KRATOS_OMNIS_API_KEY`  
  Secret sent as `X-KRATOS-KEY` by server functions.

## Important

- Do **not** use `VITE_KRATOS_OMNIS_API_KEY`.
- Keep the key server-side only.
- Frontend hooks should call KRATOS server functions, not OMNIS directly for authenticated routes.
