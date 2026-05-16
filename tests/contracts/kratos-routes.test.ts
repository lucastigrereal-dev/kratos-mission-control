import { describe, it, expect } from "bun:test";
import { KRATOS_ROUTES, VISIBLE_ROUTES } from "../../src/lib/kratos-routes";

describe("KRATOS_ROUTES contract", () => {
  it("has exactly 7 routes defined", () => {
    expect(KRATOS_ROUTES.length).toBe(7);
  });

  it("has no duplicate paths", () => {
    const paths = KRATOS_ROUTES.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("all paths start with /", () => {
    for (const route of KRATOS_ROUTES) {
      expect(route.path.startsWith("/")).toBe(true);
    }
  });

  it("includes the 7 expected routes", () => {
    const paths = KRATOS_ROUTES.map((r) => r.path).sort();
    expect(paths).toEqual([
      "/",
      "/agenda",
      "/agora",
      "/checkpoints",
      "/contexto",
      "/projetos",
      "/sistema",
    ]);
  });

  it("every route has a label, icon, and section", () => {
    for (const route of KRATOS_ROUTES) {
      expect(route.label.length).toBeGreaterThan(0);
      expect(route.icon).toBeDefined();
      expect(["operacao", "memoria", "sistema"]).toContain(route.section);
    }
  });

  it("exactly 6 routes are visible in sidebar", () => {
    expect(VISIBLE_ROUTES.length).toBe(6);
  });

  it("dashboard (/) is not visible in sidebar", () => {
    const dashboard = KRATOS_ROUTES.find((r) => r.path === "/");
    expect(dashboard?.visibleInSidebar).toBe(false);
  });

  it("all visible routes have valid section distribution", () => {
    const sections = new Map<string, number>();
    for (const route of VISIBLE_ROUTES) {
      sections.set(route.section, (sections.get(route.section) ?? 0) + 1);
    }
    expect(sections.get("operacao")).toBe(3);
    expect(sections.get("memoria")).toBe(2);
    expect(sections.get("sistema")).toBe(1);
  });
});
