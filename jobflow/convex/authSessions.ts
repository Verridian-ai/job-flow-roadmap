import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, verifySession } from "./middleware/auth";

/**
 * Authentication Session Management Functions
 *
 * Handles user authentication session lifecycle including:
 * - Session creation
 * - Session validation
 * - Session refresh
 * - Session revocation
 * - Active session tracking
 */

/**
 * Create a new authentication session
 */
export const createSession = mutation({
  args: {
    userId: v.id("users"),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresIn: v.number(), // seconds
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();
    const sessionId = `session_${user._id}_${now}`;

    // Create session record
    const id = await ctx.db.insert("authSessions", {
      userId: args.userId,
      sessionId,
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      expiresAt: now + args.expiresIn * 1000,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      active: true,
      createdAt: now,
      lastActivityAt: now,
    });

    // Update user's last login time
    await ctx.db.patch(args.userId, {
      lastLoginAt: now,
      updatedAt: now,
    });

    const session = await ctx.db.get(id);
    return session;
  },
});

/**
 * Get active session by session ID
 */
export const getSession = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await verifySession(ctx, args.sessionId);
    return session;
  },
});

/**
 * Get all active sessions for current user
 */
export const getUserSessions = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);

    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    // Sort by last activity (most recent first)
    return sessions.sort((a, b) => b.lastActivityAt - a.lastActivityAt);
  },
});

/**
 * Update session activity timestamp
 */
export const updateSessionActivity = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("authSessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .unique();

    if (session && session.active) {
      await ctx.db.patch(session._id, {
        lastActivityAt: Date.now(),
      });
      return true;
    }

    return false;
  },
});

/**
 * Refresh session tokens
 */
export const refreshSession = mutation({
  args: {
    sessionId: v.string(),
    newAccessToken: v.string(),
    newRefreshToken: v.optional(v.string()),
    expiresIn: v.number(), // seconds
  },
  handler: async (ctx, args) => {
    const session = await verifySession(ctx, args.sessionId);

    const now = Date.now();
    await ctx.db.patch(session._id, {
      accessToken: args.newAccessToken,
      refreshToken: args.newRefreshToken || session.refreshToken,
      expiresAt: now + args.expiresIn * 1000,
      lastActivityAt: now,
    });

    return await ctx.db.get(session._id);
  },
});

/**
 * Revoke (logout) a specific session
 */
export const revokeSession = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("authSessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .unique();

    if (!session) {
      return { success: false, message: "Session not found" };
    }

    // Verify user owns this session
    const user = await requireAuth(ctx);
    if (session.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(session._id, {
      active: false,
    });

    return { success: true, message: "Session revoked successfully" };
  },
});

/**
 * Revoke all sessions for current user (logout from all devices)
 */
export const revokeAllSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);

    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    // Revoke all active sessions
    await Promise.all(
      sessions.map((session) =>
        ctx.db.patch(session._id, {
          active: false,
        })
      )
    );

    return {
      success: true,
      message: `Revoked ${sessions.length} session(s)`,
      count: sessions.length,
    };
  },
});

/**
 * Revoke a specific session (for managing devices)
 */
export const revokeSessionById = mutation({
  args: {
    sessionId: v.id("authSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);

    if (!session) {
      return { success: false, message: "Session not found" };
    }

    // Verify user owns this session
    const user = await requireAuth(ctx);
    if (session.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.sessionId, {
      active: false,
    });

    return { success: true, message: "Session revoked successfully" };
  },
});

/**
 * Clean up expired sessions (should be run periodically)
 */
export const cleanupExpiredSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Find all expired sessions
    const expiredSessions = await ctx.db
      .query("authSessions")
      .withIndex("by_active", (q) => q.eq("active", true))
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    // Mark them as inactive
    await Promise.all(
      expiredSessions.map((session) =>
        ctx.db.patch(session._id, {
          active: false,
        })
      )
    );

    return {
      success: true,
      message: `Cleaned up ${expiredSessions.length} expired session(s)`,
      count: expiredSessions.length,
    };
  },
});

/**
 * Get session statistics for a user
 */
export const getSessionStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);

    const allSessions = await ctx.db
      .query("authSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const activeSessions = allSessions.filter((s) => s.active);
    const now = Date.now();
    const recentSessions = activeSessions.filter(
      (s) => s.lastActivityAt > now - 24 * 60 * 60 * 1000 // Last 24 hours
    );

    return {
      total: allSessions.length,
      active: activeSessions.length,
      recentlyActive: recentSessions.length,
      lastLogin: user.lastLoginAt,
    };
  },
});

/**
 * Check if session is valid and active
 */
export const validateSession = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const session = await verifySession(ctx, args.sessionId);
      return {
        valid: true,
        session,
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Invalid session",
      };
    }
  },
});
