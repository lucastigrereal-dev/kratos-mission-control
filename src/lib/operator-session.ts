/**
 * Operator Session Provider — W20 Local Mock
 *
 * Gerencia sessão local do operador sem OAuth, sem backend, sem token real.
 * Em W20, a sessão é sempre mock/local com Lucas como admin.
 * Multi-operador real requer W28 + OAuth Meta/Google.
 *
 * Human Slot: OAuth Meta / Google — desbloqueio futuro.
 */

import type { LocalSession, OperatorProfile, Workspace, OperatorPermission, OperatorRole } from "../../api-contract/operator.schema";
import {
  DEFAULT_SESSION,
  DEFAULT_OPERATOR,
  DEFAULT_WORKSPACE,
  ROLE_PERMISSIONS,
  OperatorProfileSchema,
} from "../../api-contract/operator.schema";

// ── Session Store (in-memory, local) ─────────────────────────────────────────

let _currentSession: LocalSession = { ...DEFAULT_SESSION };

export function getCurrentSession(): LocalSession {
  return _currentSession;
}

export function getCurrentOperator(): OperatorProfile {
  return _currentSession.operator;
}

export function getCurrentWorkspace(): Workspace {
  return _currentSession.workspace;
}

export function getCurrentRole(): OperatorRole {
  return _currentSession.operator.role;
}

export function getCurrentPermissions(): OperatorPermission[] {
  return _currentSession.permissions;
}

// ── Permission Checks ─────────────────────────────────────────────────────────

export function hasPermission(permission: OperatorPermission): boolean {
  return _currentSession.permissions.includes(permission);
}

export function hasAnyPermission(permissions: OperatorPermission[]): boolean {
  return permissions.some((p) => hasPermission(p));
}

export function hasAllPermissions(permissions: OperatorPermission[]): boolean {
  return permissions.every((p) => hasPermission(p));
}

export function canExecuteDryRun(): boolean {
  return hasPermission("execute:dry_run");
}

export function canViewBilling(): boolean {
  return hasPermission("view:billing");
}

export function canManageWorkspace(): boolean {
  return hasPermission("manage:workspace");
}

// ── Role Switching (local/mock only) ─────────────────────────────────────────

/**
 * switchRole — apenas para dev/demo mode, sem persistência real.
 * Em produção, role é definida pela auth real (W28+).
 */
export function switchRole(role: OperatorRole): LocalSession {
  const updated: LocalSession = {
    ..._currentSession,
    operator: { ..._currentSession.operator, role },
    permissions: ROLE_PERMISSIONS[role],
  };
  _currentSession = updated;
  return updated;
}

/**
 * resetToDefault — restaura Lucas/admin como sessão padrão.
 */
export function resetToDefault(): LocalSession {
  _currentSession = { ...DEFAULT_SESSION };
  return _currentSession;
}

// ── Workspace List (mock) ─────────────────────────────────────────────────────

export const MOCK_WORKSPACES: Workspace[] = [
  DEFAULT_WORKSPACE,
  {
    id: "ws-jarvis-002",
    name: "JARVIS Operations",
    slug: "jarvis-ops",
    tier: "personal",
    status: "active",
    source: "mock",
    operators: [{ operatorId: "lucas-tigre-001", role: "admin" }],
    createdAt: new Date(0).toISOString(),
  },
];

export function switchWorkspace(workspaceId: string): LocalSession | null {
  const ws = MOCK_WORKSPACES.find((w) => w.id === workspaceId);
  if (!ws) return null;
  const updated: LocalSession = { ..._currentSession, workspace: ws };
  _currentSession = updated;
  return updated;
}

// ── Additional Mock Operators (para demo multi-operador) ──────────────────────

export const MOCK_OPERATORS: OperatorProfile[] = [
  DEFAULT_OPERATOR,
  OperatorProfileSchema.parse({
    id: "dev-user-001",
    name: "Dev Mode",
    handle: "@dev",
    role: "dev",
    avatarInitial: "DM",
    mode: "Debug & Inspeção",
    sessionSource: "mock",
    createdAt: new Date(0).toISOString(),
  }),
  OperatorProfileSchema.parse({
    id: "viewer-001",
    name: "Visitante",
    handle: "@viewer",
    role: "viewer",
    avatarInitial: "VW",
    sessionSource: "mock",
    createdAt: new Date(0).toISOString(),
  }),
];

// For tests: reset state
export function _resetSession(): void {
  _currentSession = { ...DEFAULT_SESSION };
}
