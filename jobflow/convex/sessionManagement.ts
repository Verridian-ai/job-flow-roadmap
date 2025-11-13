import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Enhanced Session Management with:
 * - "Remember Me" functionality
 * - Activity tracking
 * - Multi-device session management
 * - Device fingerprinting
 * - Session revocation
 */

interface DeviceInfo {
  deviceName?: string;
  deviceType?: "desktop" | "mobile" | "tablet";
  browser?: string;
  os?: string;
  location?: string;
}

/**
 * Parse user agent to extract device information
 */
function parseUserAgent(userAgent: string): Partial<DeviceInfo> {
  const info: Partial<DeviceInfo> = {};

  // Detect OS
  if (/Windows/i.test(userAgent)) info.os = "Windows";
  else if (/Mac OS/i.test(userAgent)) info.os = "macOS";
  else if (/Linux/i.test(userAgent)) info.os = "Linux";
  else if (/Android/i.test(userAgent)) info.os = "Android";
  else if (/iOS|iPhone|iPad/i.test(userAgent)) info.os = "iOS";

  // Detect Browser
  if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) info.browser = "Chrome";
  else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) info.browser = "Safari";
  else if (/Firefox/i.test(userAgent)) info.browser = "Firefox";
  else if (/Edge/i.test(userAgent)) info.browser = "Edge";
  else if (/MSIE|Trident/i.test(userAgent)) info.browser = "Internet Explorer";

  // Detect Device Type
  if (/Mobile|Android|iPhone/i.test(userAgent)) info.deviceType = "mobile";
  else if (/Tablet|iPad/i.test(userAgent)) info.deviceType = "tablet";
  else info.deviceType = "desktop";

  // Generate device name
  info.deviceName = `${info.browser || "Unknown"} on ${info.os || "Unknown"}`;

  return info;
}

/**
 * Create enhanced session with device tracking and remember me
 */
export const createEnhancedSession = mutation({
  args: {
    userId: v.id("users"),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresIn: v.number(), // seconds
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    location: v.optional(v.string()),
    rememberMe: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();
    const sessionId = `session_${user._id}_${now}`;

    // Parse device info from user agent
    const deviceInfo = args.userAgent ? parseUserAgent(args.userAgent) : {};

    // Adjust expiration based on remember me
    const expirationTime = args.rememberMe
      ? now + 30 * 24 * 60 * 60 * 1000 // 30 days if remember me
      : now + args.expiresIn * 1000; // Standard expiration

    // Create session record
    const id = await ctx.db.insert("authSessions", {
      userId: args.userId,
      sessionId,
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      expiresAt: expirationTime,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      deviceName: deviceInfo.deviceName,
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      location: args.location,
      rememberMe: args.rememberMe || false,
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
 * Get all sessions for current user with enhanced device info
 */
export const getUserSessionsWithDetails = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    // Sort by last activity (most recent first)
    const sortedSessions = sessions.sort((a, b) => b.lastActivityAt - a.lastActivityAt);

    // Enhance with metadata
    return sortedSessions.map((session) => ({
      ...session,
      isCurrent: false, // Will be set by client based on current session ID
      isExpiringSoon: session.expiresAt - Date.now() < 24 * 60 * 60 * 1000, // < 24 hours
      daysUntilExpiry: Math.ceil((session.expiresAt - Date.now()) / (24 * 60 * 60 * 1000)),
      lastActivityRelative: getRelativeTime(session.lastActivityAt),
    }));
  },
});

/**
 * Track session activity with periodic updates
 */
export const trackSessionActivity = mutation({
  args: {
    sessionId: v.string(),
    activityType: v.optional(v.string()), // "page_view", "api_call", etc.
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("authSessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .unique();

    if (!session || !session.active) {
      return { success: false, message: "Session not found or inactive" };
    }

    const now = Date.now();

    // Check if session is expired
    if (session.expiresAt < now) {
      await ctx.db.patch(session._id, {
        active: false,
      });
      return { success: false, message: "Session expired" };
    }

    // Update last activity timestamp
    await ctx.db.patch(session._id, {
      lastActivityAt: now,
    });

    return { success: true };
  },
});

/**
 * Revoke specific session by ID
 */
export const revokeSessionById = mutation({
  args: {
    sessionId: v.id("authSessions"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);

    if (!session) {
      return { success: false, message: "Session not found" };
    }

    // Verify user owns this session
    if (session.userId !== args.userId) {
      throw new Error("Unauthorized: You can only revoke your own sessions");
    }

    await ctx.db.patch(args.sessionId, {
      active: false,
    });

    return {
      success: true,
      message: "Session revoked successfully",
      deviceName: session.deviceName || "Unknown device",
    };
  },
});

/**
 * Revoke all sessions except current one
 */
export const revokeAllOtherSessions = mutation({
  args: {
    userId: v.id("users"),
    currentSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    // Revoke all sessions except current
    const otherSessions = sessions.filter((s) => s.sessionId !== args.currentSessionId);

    await Promise.all(
      otherSessions.map((session) =>
        ctx.db.patch(session._id, {
          active: false,
        })
      )
    );

    return {
      success: true,
      message: `Revoked ${otherSessions.length} session(s)`,
      count: otherSessions.length,
    };
  },
});

/**
 * Revoke all sessions (complete sign out)
 */
export const revokeAllSessions = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    await Promise.all(
      sessions.map((session) =>
        ctx.db.patch(session._id, {
          active: false,
        })
      )
    );

    return {
      success: true,
      message: `Signed out from all devices (${sessions.length} sessions)`,
      count: sessions.length,
    };
  },
});

/**
 * Get session statistics and security insights
 */
export const getSessionAnalytics = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const allSessions = await ctx.db
      .query("authSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const now = Date.now();
    const activeSessions = allSessions.filter((s) => s.active);
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Group by device type
    const deviceBreakdown = activeSessions.reduce((acc, session) => {
      const type = session.deviceType || "unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by location
    const locationBreakdown = activeSessions.reduce((acc, session) => {
      const loc = session.location || "Unknown";
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: allSessions.length,
      active: activeSessions.length,
      withRememberMe: activeSessions.filter((s) => s.rememberMe).length,
      recentlyActive24h: activeSessions.filter((s) => s.lastActivityAt > oneDayAgo).length,
      recentlyActive7d: activeSessions.filter((s) => s.lastActivityAt > oneWeekAgo).length,
      deviceBreakdown,
      locationBreakdown,
      oldestActiveSession: activeSessions.length > 0
        ? Math.min(...activeSessions.map((s) => s.createdAt))
        : null,
    };
  },
});

/**
 * Clean up expired and old inactive sessions
 */
export const cleanupSessions = mutation({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    let query = ctx.db.query("authSessions");

    if (args.userId) {
      query = query.withIndex("by_user", (q) => q.eq("userId", args.userId));
    }

    const sessions = await query.collect();

    // Find sessions to clean up
    const toCleanup = sessions.filter((s) => {
      // Expired sessions
      if (s.expiresAt < now) return true;
      // Old inactive sessions (> 30 days)
      if (!s.active && s.lastActivityAt < thirtyDaysAgo) return true;
      return false;
    });

    // Mark expired as inactive
    const expiredSessions = toCleanup.filter((s) => s.expiresAt < now && s.active);
    await Promise.all(
      expiredSessions.map((session) =>
        ctx.db.patch(session._id, {
          active: false,
        })
      )
    );

    // Delete old inactive sessions
    const oldInactiveSessions = toCleanup.filter(
      (s) => !s.active && s.lastActivityAt < thirtyDaysAgo
    );
    await Promise.all(oldInactiveSessions.map((session) => ctx.db.delete(session._id)));

    return {
      success: true,
      expiredCount: expiredSessions.length,
      deletedCount: oldInactiveSessions.length,
      message: `Cleaned up ${expiredSessions.length} expired and deleted ${oldInactiveSessions.length} old sessions`,
    };
  },
});

/**
 * Update session remember me setting
 */
export const updateRememberMe = mutation({
  args: {
    sessionId: v.string(),
    rememberMe: v.boolean(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("authSessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .unique();

    if (!session) {
      throw new Error("Session not found");
    }

    const now = Date.now();
    const newExpiration = args.rememberMe
      ? now + 30 * 24 * 60 * 60 * 1000 // 30 days
      : now + 24 * 60 * 60 * 1000; // 24 hours

    await ctx.db.patch(session._id, {
      rememberMe: args.rememberMe,
      expiresAt: newExpiration,
    });

    return {
      success: true,
      message: args.rememberMe
        ? "Session will be remembered for 30 days"
        : "Session will expire in 24 hours",
    };
  },
});

/**
 * Helper function to get relative time string
 */
function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
