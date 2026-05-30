/**
 * useOperatorSession — W20 Hook de Sessão Local
 *
 * Fornece acesso à sessão mock do operador + RBAC visual.
 * Sem OAuth. Sem token real. Sem backend externo.
 */

import { useState, useCallback } from "react";
import type { OperatorRole, OperatorPermission } from "../../api-contract/operator.schema";
import {
  getCurrentSession,
  getCurrentOperator,
  getCurrentRole,
  getCurrentPermissions,
  hasPermission,
  hasAnyPermission,
  switchRole,
  switchWorkspace,
  resetToDefault,
  MOCK_WORKSPACES,
  MOCK_OPERATORS,
} from "@/lib/operator-session";

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useOperatorSession() {
  const [session, setSession] = useState(() => getCurrentSession());

  const changeRole = useCallback((role: OperatorRole) => {
    const updated = switchRole(role);
    setSession({ ...updated });
  }, []);

  const changeWorkspace = useCallback((wsId: string) => {
    const updated = switchWorkspace(wsId);
    if (updated) setSession({ ...updated });
  }, []);

  const reset = useCallback(() => {
    const updated = resetToDefault();
    setSession({ ...updated });
  }, []);

  return {
    operator: session.operator,
    workspace: session.workspace,
    role: session.operator.role,
    permissions: session.permissions,
    authMode: session.authMode,       // sempre "mock" em W20
    loginMethod: session.loginMethod, // sempre "mock" em W20
    isAuthenticated: session.isAuthenticated,
    /** Verifica uma permissão */
    can: (permission: OperatorPermission) => hasPermission(permission),
    /** Verifica qualquer de uma lista de permissões */
    canAny: (perms: OperatorPermission[]) => hasAnyPermission(perms),
    /** Actions */
    changeRole,
    changeWorkspace,
    resetToDefault: reset,
    /** Mock data for selectors */
    availableOperators: MOCK_OPERATORS,
    availableWorkspaces: MOCK_WORKSPACES,
    /** Status da sessão para display */
    isLocal: true,
    isMock: true,
  };
}

// ── Guard hook ────────────────────────────────────────────────────────────────

/**
 * useRBACGuard — verifica se o operador atual tem permissão.
 * Retorna { allowed, reason } para exibição condicional.
 */
export function useRBACGuard(permission: OperatorPermission) {
  const { can, role } = useOperatorSession();
  const allowed = can(permission);
  return {
    allowed,
    role,
    reason: allowed
      ? null
      : `Role "${role}" não tem permissão para "${permission}"`,
  };
}
