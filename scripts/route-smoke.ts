/**
 * W04 — Route Smoke Test (structural)
 * Verifies all 7 KRATOS routes exist, have valid TanStack Router setup,
 * and use real view components (not placeholders).
 *
 * Run: bun run scripts/route-smoke.ts
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROUTES_DIR = resolve(import.meta.dirname ?? ".", "../src/routes");

const EXPECTED_ROUTES = [
  "index.tsx",        // / (Dashboard)
  "agora.tsx",        // /agora
  "agenda.tsx",       // /agenda
  "checkpoints.tsx",  // /checkpoints
  "projetos.tsx",     // /projetos
  "contexto.tsx",     // /contexto
  "sistema.tsx",      // /sistema
];

interface CheckResult {
  route: string;
  exists: boolean;
  hasCreateFileRoute: boolean;
  hasComponent: boolean;
  hasPlaceholder: boolean;
  viewComponent: string | null;
}

function checkRoute(filename: string): CheckResult {
  const filepath = resolve(ROUTES_DIR, filename);
  const exists = existsSync(filepath);

  if (!exists) {
    return {
      route: filename,
      exists: false,
      hasCreateFileRoute: false,
      hasComponent: false,
      hasPlaceholder: false,
      viewComponent: null,
    };
  }

  const content = readFileSync(filepath, "utf-8");
  const hasCreateFileRoute = content.includes("createFileRoute");
  const hasComponent = /component\s*[=:]/.test(content);
  const hasPlaceholder =
    content.includes("Em construção") ||
    content.includes("PlaceholderRoute") ||
    content.includes("placeholder");

  // Extract view component name
  const viewMatch = content.match(/import\s*\{\s*(\w+View)\s*\}/);
  const viewComponent = viewMatch ? viewMatch[1] : null;

  return {
    route: filename,
    exists,
    hasCreateFileRoute,
    hasComponent,
    hasPlaceholder,
    viewComponent,
  };
}

function main() {
  console.log("KRATOS Route Smoke Test — W04\n");
  console.log(`Routes directory: ${ROUTES_DIR}\n`);

  const results = EXPECTED_ROUTES.map(checkRoute);

  let passed = 0;
  let failed = 0;

  for (const r of results) {
    const routePath = r.route.replace(".tsx", "") === "index" ? "/" : `/${r.route.replace(".tsx", "")}`;
    const ok = r.exists && r.hasCreateFileRoute && r.hasComponent && !r.hasPlaceholder;

    if (ok) {
      passed++;
      console.log(`  PASS  ${routePath} → ${r.viewComponent ?? "unknown view"}`);
    } else {
      failed++;
      const issues: string[] = [];
      if (!r.exists) issues.push("FILE MISSING");
      if (!r.hasCreateFileRoute) issues.push("no createFileRoute");
      if (!r.hasComponent) issues.push("no component");
      if (r.hasPlaceholder) issues.push("HAS PLACEHOLDER");
      console.log(`  FAIL  ${routePath} → ${issues.join(", ")}`);
    }
  }

  console.log(`\n${passed} passed, ${failed} failed out of ${EXPECTED_ROUTES.length} routes`);

  if (failed > 0) {
    process.exit(1);
  }
}

main();
