/**
 * Vercel build config — staging only.
 *
 * Igual ao vite.config.ts mas sem @cloudflare/vite-plugin.
 * Produz dist-vercel/server/index.js compatível com Node.js / Vercel Edge.
 *
 * Build: bun run build:vercel
 * Deploy: vercel --build-env VITE_USE_MOCKS=true
 */
// @ts-ignore — @lovable.dev/vite-tanstack-config types not fully exported
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Desativa @cloudflare/vite-plugin — output Node.js compatível
  cloudflare: false,
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 700,
      outDir: "dist-vercel",
    },
  },
});
