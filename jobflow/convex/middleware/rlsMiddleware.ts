import { MutationCtx, QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { validatePolicy } from "../rls";

/**
 * RLS Middleware for automatic policy enforcement
 *
 * Use these helpers in your mutations to automatically enforce RLS policies
 */

/**
 * Enforce read policy before accessing a resource
 */
export async function enforceReadPolicy(
  ctx: QueryCtx,
  userId: Id<"users">,
  resourceType: string,
  resourceId: string
): Promise<void> {
  const result = await validatePolicy(ctx, userId, resourceType, resourceId, "read");
  if (!result.allowed) {
    throw new Error(`Access denied: ${result.reason}`);
  }
}

/**
 * Enforce write policy before modifying a resource
 */
export async function enforceWritePolicy(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  resourceType: string,
  resourceId: string
): Promise<void> {
  const result = await validatePolicy(ctx as QueryCtx, userId, resourceType, resourceId, "write");
  if (!result.allowed) {
    throw new Error(`Write access denied: ${result.reason}`);
  }
}

/**
 * Enforce delete policy before removing a resource
 */
export async function enforceDeletePolicy(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  resourceType: string,
  resourceId: string
): Promise<void> {
  const result = await validatePolicy(ctx as QueryCtx, userId, resourceType, resourceId, "delete");
  if (!result.allowed) {
    throw new Error(`Delete access denied: ${result.reason}`);
  }
}

/**
 * Check ownership of a resource
 */
export async function checkOwnership<T extends { userId: Id<"users"> }>(
  resource: T,
  userId: Id<"users">
): Promise<boolean> {
  return resource.userId === userId;
}

/**
 * Filter query results based on RLS policies
 *
 * Use this helper to filter arrays of resources
 */
export async function filterByPolicy<T extends { _id: Id<any>; userId: Id<"users"> }>(
  ctx: QueryCtx,
  userId: Id<"users">,
  resourceType: string,
  resources: T[],
  action: "read" | "write" | "delete" = "read"
): Promise<T[]> {
  const filtered: T[] = [];

  for (const resource of resources) {
    const result = await validatePolicy(
      ctx,
      userId,
      resourceType,
      resource._id,
      action
    );
    if (result.allowed) {
      filtered.push(resource);
    }
  }

  return filtered;
}

/**
 * Decorators for automatic RLS enforcement
 */

/**
 * Example usage in mutations:
 *
 * export const updateResume = mutation({
 *   args: { userId: v.id("users"), resumeId: v.id("resumes"), ... },
 *   handler: async (ctx, args) => {
 *     await enforceWritePolicy(ctx, args.userId, "resume", args.resumeId);
 *     // Proceed with update...
 *   }
 * });
 */
