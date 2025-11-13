/**
 * Role-Based Access Control (RBAC) Middleware
 * Provides role verification and authorization helpers for Convex functions
 */

import { GenericQueryCtx, GenericMutationCtx } from "convex/server";
import { DataModel } from "../_generated/dataModel";

export type Role = "job_seeker" | "coach" | "admin";

export type QueryContext = GenericQueryCtx<DataModel>;
export type MutationContext = GenericMutationCtx<DataModel>;

/**
 * Get the current authenticated user with role information
 */
export async function getCurrentUser(ctx: QueryContext | MutationContext) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: No authentication token provided");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
    .unique();

  if (!user) {
    throw new Error("Unauthorized: User not found");
  }

  return user;
}

/**
 * Verify that the current user has one of the required roles
 */
export async function requireRole(
  ctx: QueryContext | MutationContext,
  allowedRoles: Role[]
): Promise<void> {
  const user = await getCurrentUser(ctx);

  if (!allowedRoles.includes(user.role)) {
    throw new Error(
      `Forbidden: User role '${user.role}' is not authorized. Required roles: ${allowedRoles.join(", ")}`
    );
  }
}

/**
 * Verify that the current user is an admin
 */
export async function requireAdmin(ctx: QueryContext | MutationContext): Promise<void> {
  await requireRole(ctx, ["admin"]);
}

/**
 * Verify that the current user is a coach
 */
export async function requireCoach(ctx: QueryContext | MutationContext): Promise<void> {
  await requireRole(ctx, ["coach", "admin"]);
}

/**
 * Verify that the current user is the resource owner or an admin
 */
export async function requireOwnerOrAdmin(
  ctx: QueryContext | MutationContext,
  resourceUserId: string
): Promise<void> {
  const user = await getCurrentUser(ctx);

  if (user.role === "admin") {
    return; // Admins can access any resource
  }

  if (user._id !== resourceUserId) {
    throw new Error("Forbidden: You can only access your own resources");
  }
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(
  ctx: QueryContext | MutationContext,
  role: Role
): Promise<boolean> {
  try {
    const user = await getCurrentUser(ctx);
    return user.role === role;
  } catch {
    return false;
  }
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated(ctx: QueryContext | MutationContext): Promise<boolean> {
  try {
    await getCurrentUser(ctx);
    return true;
  } catch {
    return false;
  }
}

/**
 * Verify email is verified
 */
export async function requireEmailVerified(ctx: QueryContext | MutationContext): Promise<void> {
  const user = await getCurrentUser(ctx);

  if (!user.emailVerified) {
    throw new Error("Forbidden: Email verification required");
  }
}
