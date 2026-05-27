/**
 * Vercel Edge Function — KRATOS staging adapter
 *
 * Wraps o TanStack Start server (Fetch API) para o Vercel Edge Runtime.
 * Compatível: o dist-vercel/server/server.js exporta { fetch(req, env, ctx) }
 * que é a mesma interface do Vercel Edge.
 *
 * Usado apenas em staging (VITE_USE_MOCKS=true) — omnis-server não está em prod.
 * Quando omnis-server subir: trocar VITE_USE_MOCKS=false no dashboard Vercel.
 */

// @ts-ignore — importado após bun run build:vercel
import server from "../dist-vercel/server/server.js";

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request): Promise<Response> {
  return server.fetch(request, {}, { waitUntil: (_: Promise<unknown>) => {} });
}
