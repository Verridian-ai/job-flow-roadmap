import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

/**
 * Hook to check user permissions
 */
export function usePermissions(userId: Id<"users"> | null) {
  const permissions = useQuery(
    api.rbac.getUserPermissions,
    userId ? { userId } : "skip"
  );

  const hasPermission = (permission: string) => {
    return permissions?.includes(permission) || false;
  };

  const hasAnyPermission = (...perms: string[]) => {
    return perms.some((p) => permissions?.includes(p));
  };

  const hasAllPermissions = (...perms: string[]) => {
    return perms.every((p) => permissions?.includes(p));
  };

  return {
    permissions: permissions || [],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading: permissions === undefined,
  };
}

/**
 * Hook to check resource access
 */
export function useResourceAccess(
  userId: Id<"users"> | null,
  resourceType: string,
  resourceId: string,
  action: string
) {
  const accessResult = useQuery(
    api.rbac.canAccessResource,
    userId ? { userId, resourceType, resourceId, action } : "skip"
  );

  return {
    allowed: accessResult?.allowed || false,
    reason: accessResult?.reason,
    isLoading: accessResult === undefined,
  };
}

/**
 * Hook to get role capabilities
 */
export function useRoleCapabilities(role: "job_seeker" | "coach" | "admin" | null) {
  const capabilities = useQuery(
    api.rbac.getRoleCapabilities,
    role ? { role } : "skip"
  );

  return {
    capabilities: capabilities?.capabilities,
    permissions: capabilities?.permissions || [],
    isLoading: capabilities === undefined,
  };
}

/**
 * Hook to check multiple permissions at once
 */
export function useCheckPermissions(userId: Id<"users"> | null, permissions: string[]) {
  const results = useQuery(
    api.rbac.checkPermissions,
    userId && permissions.length > 0 ? { userId, permissions } : "skip"
  );

  return {
    results: results || {},
    isLoading: results === undefined,
  };
}
