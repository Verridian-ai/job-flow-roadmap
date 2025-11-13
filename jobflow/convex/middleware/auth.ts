/**
 * Authentication Middleware for Convex
 *
 * This middleware provides authentication and authorization checks
 * for protected Convex functions using WorkOS SSO.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Authentication Error Types
 */
export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = "Forbidden") {
    super(message, "FORBIDDEN");
  }
}

/**
 * Get the authenticated user from the context
 *
 * This function retrieves the current user based on the authentication
 * identity provided by Convex's auth system (integrated with Clerk/WorkOS).
 */
export async function getAuthenticatedUser(
  ctx: QueryCtx | MutationCtx
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
    .unique();

  return user;
}

/**
 * Require authentication - throws if user is not authenticated
 */
export async function requireAuth(
  ctx: QueryCtx | MutationCtx
) {
  const user = await getAuthenticatedUser(ctx);

  if (!user) {
    throw new UnauthorizedError("You must be logged in to perform this action");
  }

  return user;
}

/**
 * Require specific role - throws if user doesn't have the required role
 */
export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  allowedRoles: Array<"job_seeker" | "coach" | "admin">
) {
  const user = await requireAuth(ctx);

  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError(`This action requires one of the following roles: ${allowedRoles.join(", ")}`);
  }

  return user;
}

/**
 * Check if user is the owner of a resource
 */
export async function requireOwnership(
  ctx: QueryCtx | MutationCtx,
  resourceUserId: Id<"users">
) {
  const user = await requireAuth(ctx);

  if (user._id !== resourceUserId) {
    throw new ForbiddenError("You do not have permission to access this resource");
  }

  return user;
}

/**
 * Check if user is either the owner or has admin role
 */
export async function requireOwnerOrAdmin(
  ctx: QueryCtx | MutationCtx,
  resourceUserId: Id<"users">
) {
  const user = await requireAuth(ctx);

  if (user._id !== resourceUserId && user.role !== "admin") {
    throw new ForbiddenError("You do not have permission to access this resource");
  }

  return user;
}

/**
 * Verify session is active and not expired
 */
export async function verifySession(
  ctx: QueryCtx | MutationCtx,
  sessionId: string
) {
  const session = await ctx.db
    .query("authSessions")
    .withIndex("by_session_id", (q) => q.eq("sessionId", sessionId))
    .unique();

  if (!session) {
    throw new UnauthorizedError("Session not found");
  }

  if (!session.active) {
    throw new UnauthorizedError("Session is no longer active");
  }

  if (session.expiresAt < Date.now()) {
    // Mark session as inactive
    await ctx.db.patch(session._id, {
      active: false,
    });
    throw new UnauthorizedError("Session has expired");
  }

  return session;
}

/**
 * Update session activity timestamp
 */
export async function updateSessionActivity(
  ctx: MutationCtx,
  sessionId: string
) {
  const session = await ctx.db
    .query("authSessions")
    .withIndex("by_session_id", (q) => q.eq("sessionId", sessionId))
    .unique();

  if (session && session.active) {
    await ctx.db.patch(session._id, {
      lastActivityAt: Date.now(),
    });
  }
}

/**
 * Check if user has verified email
 */
export async function requireVerifiedEmail(
  ctx: QueryCtx | MutationCtx
) {
  const user = await requireAuth(ctx);

  if (!user.emailVerified) {
    throw new ForbiddenError("You must verify your email to perform this action");
  }

  return user;
}

/**
 * Check if user has 2FA enabled (for sensitive operations)
 */
export async function require2FA(
  ctx: QueryCtx | MutationCtx
) {
  const user = await requireAuth(ctx);

  if (!user.twoFactorEnabled) {
    throw new ForbiddenError("Two-factor authentication is required for this action");
  }

  return user;
}

/**
 * Rate limiting helper (basic implementation)
 * In production, use a proper rate limiting service
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(
  ctx: QueryCtx | MutationCtx,
  action: string,
  limit: number,
  windowMs: number
) {
  const user = await getAuthenticatedUser(ctx);
  const key = user ? `user:${user._id}:${action}` : `anon:${action}`;

  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || record.resetAt < now) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  if (record.count >= limit) {
    throw new ForbiddenError(`Rate limit exceeded. Please try again later.`);
  }

  record.count++;
  return true;
}

/**
 * Audit log helper for sensitive operations
 */
export async function logAuditEvent(
  ctx: MutationCtx,
  action: string,
  details?: Record<string, any>
) {
  const user = await getAuthenticatedUser(ctx);

  // In a real implementation, you would store this in an audit log table
  console.log("AUDIT:", {
    userId: user?._id,
    action,
    details,
    timestamp: new Date().toISOString(),
  });
}
