/**
 * W20 — Multi-Operator SaaS Tests
 * Testa: schema, RBAC, sessions, permissões, workspace
 * Sem OAuth. Sem backend. Sem chamadas externas.
 */

import { describe, it, expect, beforeEach } from "bun:test";
import {
  OperatorRoleSchema,
  OperatorPermissionSchema,
  OperatorProfileSchema,
  WorkspaceSchema,
  LocalSessionSchema,
  ROLE_PERMISSIONS,
  DEFAULT_OPERATOR,
  DEFAULT_WORKSPACE,
  DEFAULT_SESSION,
} from "../../api-contract/operator.schema";
import {
  getCurrentSession,
  getCurrentRole,
  getCurrentPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canExecuteDryRun,
  canViewBilling,
  canManageWorkspace,
  switchRole,
  switchWorkspace,
  resetToDefault,
  MOCK_WORKSPACES,
  MOCK_OPERATORS,
  _resetSession,
} from "../../src/lib/operator-session";

beforeEach(() => {
  _resetSession();
});

// ── Schema Tests ──────────────────────────────────────────────────────────────

describe("OperatorRoleSchema", () => {
  it("aceita todos os 4 roles válidos", () => {
    for (const role of ["admin", "operator", "viewer", "dev"] as const) {
      expect(OperatorRoleSchema.safeParse(role).success).toBe(true);
    }
  });

  it("rejeita role inválido", () => {
    expect(OperatorRoleSchema.safeParse("superadmin").success).toBe(false);
  });
});

describe("OperatorProfileSchema", () => {
  it("valida DEFAULT_OPERATOR", () => {
    const r = OperatorProfileSchema.safeParse(DEFAULT_OPERATOR);
    expect(r.success).toBe(true);
  });

  it("rejeita avatarInitial com mais de 2 chars", () => {
    const r = OperatorProfileSchema.safeParse({ ...DEFAULT_OPERATOR, avatarInitial: "ABC" });
    expect(r.success).toBe(false);
  });
});

describe("WorkspaceSchema", () => {
  it("valida DEFAULT_WORKSPACE", () => {
    const r = WorkspaceSchema.safeParse(DEFAULT_WORKSPACE);
    expect(r.success).toBe(true);
  });

  it("rejeita slug com maiúsculas", () => {
    const r = WorkspaceSchema.safeParse({ ...DEFAULT_WORKSPACE, slug: "Kratos-Personal" });
    expect(r.success).toBe(false);
  });

  it("rejeita slug com espaços", () => {
    const r = WorkspaceSchema.safeParse({ ...DEFAULT_WORKSPACE, slug: "kratos personal" });
    expect(r.success).toBe(false);
  });
});

describe("LocalSessionSchema", () => {
  it("valida DEFAULT_SESSION", () => {
    const r = LocalSessionSchema.safeParse(DEFAULT_SESSION);
    expect(r.success).toBe(true);
  });

  it("authMode é sempre 'mock'", () => {
    expect(DEFAULT_SESSION.authMode).toBe("mock");
  });

  it("isAuthenticated é sempre true", () => {
    expect(DEFAULT_SESSION.isAuthenticated).toBe(true);
  });
});

// ── ROLE_PERMISSIONS ──────────────────────────────────────────────────────────

describe("ROLE_PERMISSIONS", () => {
  it("admin tem todas as permissions", () => {
    const adminPerms = ROLE_PERMISSIONS["admin"];
    expect(adminPerms).toContain("execute:dry_run");
    expect(adminPerms).toContain("manage:workspace");
    expect(adminPerms).toContain("manage:billing");
    expect(adminPerms).toContain("dev:raw_data");
  });

  it("viewer não tem execute:dry_run", () => {
    expect(ROLE_PERMISSIONS["viewer"]).not.toContain("execute:dry_run");
  });

  it("viewer não tem manage:workspace", () => {
    expect(ROLE_PERMISSIONS["viewer"]).not.toContain("manage:workspace");
  });

  it("operator tem execute:dry_run mas não execute:real", () => {
    expect(ROLE_PERMISSIONS["operator"]).toContain("execute:dry_run");
    expect(ROLE_PERMISSIONS["operator"]).not.toContain("execute:real");
  });

  it("nenhum role tem execute:real (W28 apenas)", () => {
    for (const role of ["admin", "operator", "viewer", "dev"] as const) {
      expect(ROLE_PERMISSIONS[role]).not.toContain("execute:real");
    }
  });

  it("dev tem dev:raw_data", () => {
    expect(ROLE_PERMISSIONS["dev"]).toContain("dev:raw_data");
  });
});

// ── Permission Checks ─────────────────────────────────────────────────────────

describe("hasPermission", () => {
  it("admin pode view:dashboard", () => {
    expect(hasPermission("view:dashboard")).toBe(true);
  });

  it("admin pode execute:dry_run", () => {
    expect(hasPermission("execute:dry_run")).toBe(true);
  });

  it("admin não pode execute:real", () => {
    expect(hasPermission("execute:real")).toBe(false);
  });
});

describe("hasAnyPermission", () => {
  it("retorna true se qualquer permission existe", () => {
    expect(hasAnyPermission(["execute:real", "view:dashboard"])).toBe(true);
  });

  it("retorna false se nenhuma permission existe", () => {
    expect(hasAnyPermission(["execute:real"])).toBe(false);
  });
});

describe("hasAllPermissions", () => {
  it("retorna true se todas existem", () => {
    expect(hasAllPermissions(["view:dashboard", "execute:dry_run"])).toBe(true);
  });

  it("retorna false se alguma não existe", () => {
    expect(hasAllPermissions(["view:dashboard", "execute:real"])).toBe(false);
  });
});

describe("canExecuteDryRun", () => {
  it("admin pode dry run", () => {
    expect(canExecuteDryRun()).toBe(true);
  });
});

describe("canViewBilling", () => {
  it("admin pode ver billing", () => {
    expect(canViewBilling()).toBe(true);
  });
});

// ── Role Switching ────────────────────────────────────────────────────────────

describe("switchRole", () => {
  it("troca para viewer corretamente", () => {
    const session = switchRole("viewer");
    expect(session.operator.role).toBe("viewer");
    expect(session.permissions).toEqual(ROLE_PERMISSIONS["viewer"]);
  });

  it("após switch para viewer, execute:dry_run é false", () => {
    switchRole("viewer");
    expect(hasPermission("execute:dry_run")).toBe(false);
  });

  it("após switch de volta para admin, execute:dry_run é true", () => {
    switchRole("viewer");
    switchRole("admin");
    expect(hasPermission("execute:dry_run")).toBe(true);
  });

  it("dev tem dev:raw_data após switch", () => {
    switchRole("dev");
    expect(hasPermission("dev:raw_data")).toBe(true);
  });

  it("operator tem execute:dry_run após switch", () => {
    switchRole("operator");
    expect(canExecuteDryRun()).toBe(true);
  });
});

// ── Workspace Switching ───────────────────────────────────────────────────────

describe("switchWorkspace", () => {
  it("troca workspace válido", () => {
    const ws = MOCK_WORKSPACES[1];
    const session = switchWorkspace(ws.id);
    expect(session?.workspace.id).toBe(ws.id);
  });

  it("retorna null para workspace inexistente", () => {
    const result = switchWorkspace("ws-inexistente-999");
    expect(result).toBeNull();
  });

  it("não altera sessão se workspace inválido", () => {
    const before = getCurrentSession().workspace.id;
    switchWorkspace("ws-invalido");
    expect(getCurrentSession().workspace.id).toBe(before);
  });
});

// ── Reset ─────────────────────────────────────────────────────────────────────

describe("resetToDefault", () => {
  it("restaura admin após switch", () => {
    switchRole("viewer");
    expect(getCurrentRole()).toBe("viewer");
    resetToDefault();
    expect(getCurrentRole()).toBe("admin");
  });

  it("restaura workspace padrão", () => {
    switchWorkspace(MOCK_WORKSPACES[1].id);
    resetToDefault();
    expect(getCurrentSession().workspace.id).toBe(DEFAULT_WORKSPACE.id);
  });
});

// ── Mock Data ─────────────────────────────────────────────────────────────────

describe("MOCK data", () => {
  it("MOCK_WORKSPACES tem pelo menos 2 entradas", () => {
    expect(MOCK_WORKSPACES.length).toBeGreaterThanOrEqual(2);
  });

  it("MOCK_OPERATORS tem pelo menos 3 entradas", () => {
    expect(MOCK_OPERATORS.length).toBeGreaterThanOrEqual(3);
  });

  it("MOCK_OPERATORS inclui admin", () => {
    const hasAdmin = MOCK_OPERATORS.some((op) => op.role === "admin");
    expect(hasAdmin).toBe(true);
  });

  it("MOCK_OPERATORS inclui dev", () => {
    const hasDev = MOCK_OPERATORS.some((op) => op.role === "dev");
    expect(hasDev).toBe(true);
  });

  it("MOCK_OPERATORS inclui viewer", () => {
    const hasViewer = MOCK_OPERATORS.some((op) => op.role === "viewer");
    expect(hasViewer).toBe(true);
  });

  it("todos os MOCK_WORKSPACES têm source: mock", () => {
    for (const ws of MOCK_WORKSPACES) {
      expect(ws.source).toBe("mock");
    }
  });
});

// ── getCurrentPermissions ─────────────────────────────────────────────────────

describe("getCurrentPermissions", () => {
  it("admin tem view:dashboard e execute:dry_run", () => {
    const perms = getCurrentPermissions();
    expect(perms).toContain("view:dashboard");
    expect(perms).toContain("execute:dry_run");
  });

  it("viewer não tem execute:dry_run após switch", () => {
    switchRole("viewer");
    const perms = getCurrentPermissions();
    expect(perms).not.toContain("execute:dry_run");
  });
});
