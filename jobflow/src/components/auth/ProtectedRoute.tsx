import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface ProtectedRouteProps {
  children: ReactNode;
  userId: Id<"users"> | null;
  requiredPermission?: string;
  requiredRole?: "job_seeker" | "coach" | "admin";
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  userId,
  requiredPermission,
  requiredRole,
  fallbackPath = "/unauthorized",
}: ProtectedRouteProps) {
  // Check permission if required
  const hasPermissionResult = useQuery(
    api.rbac.hasPermission,
    userId && requiredPermission
      ? { userId, permission: requiredPermission }
      : "skip"
  );

  // Get user data if checking role
  const userData = useQuery(
    api.users.get,
    userId && requiredRole ? { id: userId } : "skip"
  );

  // Loading state
  if (userId && requiredPermission && hasPermissionResult === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (userId && requiredRole && userData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check authentication
  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  // Check permission
  if (requiredPermission && !hasPermissionResult) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check role
  if (requiredRole && userData && userData.role !== requiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
