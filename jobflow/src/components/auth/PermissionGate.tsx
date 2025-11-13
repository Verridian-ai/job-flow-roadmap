import { ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface PermissionGateProps {
  children: ReactNode;
  userId: Id<"users"> | null;
  permission?: string;
  role?: "job_seeker" | "coach" | "admin";
  fallback?: ReactNode;
  showLoading?: boolean;
}

/**
 * Permission Gate Component
 *
 * Conditionally renders children based on user permissions or role.
 * Use this for inline permission checks (e.g., showing/hiding buttons).
 */
export default function PermissionGate({
  children,
  userId,
  permission,
  role,
  fallback = null,
  showLoading = false,
}: PermissionGateProps) {
  // Check permission if specified
  const hasPermissionResult = useQuery(
    api.rbac.hasPermission,
    userId && permission ? { userId, permission } : "skip"
  );

  // Get user data if checking role
  const userData = useQuery(
    api.users.get,
    userId && role ? { id: userId } : "skip"
  );

  // Loading state
  if (showLoading) {
    if ((permission && hasPermissionResult === undefined) || (role && userData === undefined)) {
      return (
        <div className="inline-block">
          <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
        </div>
      );
    }
  }

  // No user - don't show
  if (!userId) {
    return <>{fallback}</>;
  }

  // Check permission
  if (permission) {
    if (hasPermissionResult === false) {
      return <>{fallback}</>;
    }
  }

  // Check role
  if (role) {
    if (userData && userData.role !== role) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
