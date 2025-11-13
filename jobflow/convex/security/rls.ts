/**
 * Row-Level Security (RLS) Helpers
 * Provides helpers to ensure users can only access their own data
 */

import { GenericQueryCtx, GenericMutationCtx } from "convex/server";
import { DataModel } from "../_generated/dataModel";
import { getCurrentUser } from "./rbac";

export type QueryContext = GenericQueryCtx<DataModel>;
export type MutationContext = GenericMutationCtx<DataModel>;

/**
 * Filter query results to only include records owned by the current user
 */
export async function filterByUser<T extends { userId: string }>(
  ctx: QueryContext | MutationContext,
  records: T[]
): Promise<T[]> {
  const user = await getCurrentUser(ctx);
  return records.filter((record) => record.userId === user._id);
}

/**
 * Verify that a resource belongs to the current user
 */
export async function verifyOwnership(
  ctx: QueryContext | MutationContext,
  resourceUserId: string
): Promise<void> {
  const user = await getCurrentUser(ctx);

  // Admins can bypass ownership checks
  if (user.role === "admin") {
    return;
  }

  if (user._id !== resourceUserId) {
    throw new Error("Forbidden: You do not own this resource");
  }
}

/**
 * Verify that a coach resource belongs to the current coach
 */
export async function verifyCoachOwnership(
  ctx: QueryContext | MutationContext,
  coachUserId: string
): Promise<void> {
  const user = await getCurrentUser(ctx);

  // Admins can bypass ownership checks
  if (user.role === "admin") {
    return;
  }

  if (user.role !== "coach") {
    throw new Error("Forbidden: You must be a coach to access this resource");
  }

  if (user._id !== coachUserId) {
    throw new Error("Forbidden: You do not own this coach resource");
  }
}

/**
 * Get the current user's ID (for use in queries)
 */
export async function getCurrentUserId(ctx: QueryContext | MutationContext): Promise<string> {
  const user = await getCurrentUser(ctx);
  return user._id;
}

/**
 * Verify that the current user can access a conversation
 * (either as sender or receiver)
 */
export async function verifyConversationAccess(
  ctx: QueryContext | MutationContext,
  senderId: string,
  receiverId: string
): Promise<void> {
  const user = await getCurrentUser(ctx);

  // Admins can access any conversation
  if (user.role === "admin") {
    return;
  }

  if (user._id !== senderId && user._id !== receiverId) {
    throw new Error("Forbidden: You are not part of this conversation");
  }
}

/**
 * Check if the current user is the owner of a resource
 */
export async function isOwner(
  ctx: QueryContext | MutationContext,
  resourceUserId: string
): Promise<boolean> {
  try {
    const user = await getCurrentUser(ctx);
    return user._id === resourceUserId || user.role === "admin";
  } catch {
    return false;
  }
}
