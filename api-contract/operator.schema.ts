/**
 * Operator / Multi-Tenancy Schema — W20
 * Local SaaS model: OperatorProfile, Workspace, Role, Permissions
 *
 * Modo local: sem OAuth, sem backend externo, sem token real.
 * Toda sessão é mock/local persistida em memória.
 */

import { z } from "zod";

// ── Role ──────────────────────────────────────────────────────────────────────

export const OperatorRoleSchema = z.enum([
  "admin",     // Lucas — acesso total
  "operator",  // Operador convidado — pode ver + executar dry-run
  "viewer",    // Visualização apenas
  "dev",       // Dev mode — acesso a logs, schemas, raw data
]);
export type OperatorRole = z.infer<typeof OperatorRoleSchema>;

// ── Permissions ───────────────────────────────────────────────────────────────

export const OperatorPermissionSchema = z.enum([
  "view:dashboard",
  "view:omnis",
  "view:akasha",
  "view:analytics",
  "view:billing",
  "view:profile",
  "view:system",
  "execute:dry_run",      // Pode executar dry-run no OMNIS
  "execute:real",         // BLOQUEADO em W20 — requer W28
  "manage:workspace",     // Criar/editar workspaces
  "manage:operators",     // Convidar outros operadores
  "manage:billing",       // Acessar billing real
  "dev:raw_data",         // Ver payloads, schemas, logs raw
]);
export type OperatorPermission = z.infer<typeof OperatorPermissionSchema>;

// ── Role → Permissions mapping ────────────────────────────────────────────────

export const ROLE_PERMISSIONS: Record<OperatorRole, OperatorPermission[]> = {
  admin: [
    "view:dashboard", "view:omnis", "view:akasha", "view:analytics",
    "view:billing", "view:profile", "view:system",
    "execute:dry_run",
    "manage:workspace", "manage:operators", "manage:billing",
    "dev:raw_data",
  ],
  operator: [
    "view:dashboard", "view:omnis", "view:akasha", "view:analytics",
    "view:profile", "view:system",
    "execute:dry_run",
  ],
  viewer: [
    "view:dashboard", "view:omnis", "view:akasha", "view:analytics",
    "view:profile",
  ],
  dev: [
    "view:dashboard", "view:omnis", "view:akasha", "view:analytics",
    "view:billing", "view:profile", "view:system",
    "execute:dry_run",
    "dev:raw_data",
  ],
};

// ── OperatorProfile ───────────────────────────────────────────────────────────

export const OperatorProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  handle: z.string(),
  role: OperatorRoleSchema,
  /** Avatarr inicial para UI */
  avatarInitial: z.string().max(2),
  /** Modo de operação */
  mode: z.string().optional(),
  /** Status da sessão */
  sessionSource: z.enum(["mock", "local", "oauth"]).default("mock"),
  createdAt: z.string().datetime(),
});
export type OperatorProfile = z.infer<typeof OperatorProfileSchema>;

// ── Workspace ─────────────────────────────────────────────────────────────────

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  /** Tier do workspace */
  tier: z.enum(["personal", "pro", "enterprise"]).default("personal"),
  /** Status do workspace */
  status: z.enum(["active", "trial", "suspended", "pending_payment"]).default("active"),
  /** Se é mock ou real */
  source: z.enum(["mock", "local"]).default("mock"),
  operators: z.array(z.object({
    operatorId: z.string(),
    role: OperatorRoleSchema,
  })).default([]),
  createdAt: z.string().datetime(),
});
export type Workspace = z.infer<typeof WorkspaceSchema>;

// ── Session ───────────────────────────────────────────────────────────────────

export const LocalSessionSchema = z.object({
  operator: OperatorProfileSchema,
  workspace: WorkspaceSchema,
  permissions: z.array(OperatorPermissionSchema),
  /** Sempre "mock" em W20 */
  authMode: z.literal("mock"),
  /** Sempre false em W20 */
  isAuthenticated: z.literal(true),
  loginMethod: z.enum(["mock", "oauth_meta", "oauth_google", "email"]).default("mock"),
});
export type LocalSession = z.infer<typeof LocalSessionSchema>;

// ── Mock Data ─────────────────────────────────────────────────────────────────

export const DEFAULT_OPERATOR: OperatorProfile = {
  id: "lucas-tigre-001",
  name: "Lucas Tigre",
  handle: "@lucastigrereal",
  role: "admin",
  avatarInitial: "LT",
  mode: "Sobrevivência — gera caixa AGORA",
  sessionSource: "mock",
  createdAt: new Date(0).toISOString(),
};

export const DEFAULT_WORKSPACE: Workspace = {
  id: "ws-kratos-001",
  name: "Kratos Personal",
  slug: "kratos-personal",
  tier: "personal",
  status: "active",
  source: "mock",
  operators: [{ operatorId: "lucas-tigre-001", role: "admin" }],
  createdAt: new Date(0).toISOString(),
};

export const DEFAULT_SESSION: LocalSession = {
  operator: DEFAULT_OPERATOR,
  workspace: DEFAULT_WORKSPACE,
  permissions: ROLE_PERMISSIONS["admin"],
  authMode: "mock",
  isAuthenticated: true,
  loginMethod: "mock",
};
