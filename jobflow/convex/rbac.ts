import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Role-Based Access Control (RBAC) System
 *
 * This module provides a comprehensive RBAC implementation with:
 * - Role definitions (job_seeker, coach, admin)
 * - Permission checks
 * - Resource access control
 * - Role assignment and management
 */

/**
 * Role definitions with their permissions
 */
export const ROLES = {
  JOB_SEEKER: "job_seeker",
  COACH: "coach",
  ADMIN: "admin",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

/**
 * Permission definitions for different actions
 */
export const PERMISSIONS = {
  // User permissions
  VIEW_OWN_PROFILE: "view_own_profile",
  EDIT_OWN_PROFILE: "edit_own_profile",
  VIEW_OTHER_PROFILES: "view_other_profiles",
  MANAGE_USERS: "manage_users",

  // Resume permissions
  CREATE_RESUME: "create_resume",
  VIEW_OWN_RESUMES: "view_own_resumes",
  EDIT_OWN_RESUMES: "edit_own_resumes",
  DELETE_OWN_RESUMES: "delete_own_resumes",
  VIEW_ALL_RESUMES: "view_all_resumes",

  // Coach permissions
  VIEW_COACH_DIRECTORY: "view_coach_directory",
  BECOME_COACH: "become_coach",
  MANAGE_COACH_PROFILE: "manage_coach_profile",
  VIEW_CLIENT_SESSIONS: "view_client_sessions",
  MANAGE_AVAILABILITY: "manage_availability",
  RECEIVE_PAYMENTS: "receive_payments",

  // Marketplace permissions
  CREATE_VERIFICATION_TASK: "create_verification_task",
  BID_ON_TASKS: "bid_on_tasks",
  ACCEPT_BIDS: "accept_bids",
  VIEW_MARKETPLACE: "view_marketplace",

  // Session permissions
  BOOK_SESSION: "book_session",
  MANAGE_SESSIONS: "manage_sessions",
  VIEW_SESSION_NOTES: "view_session_notes",

  // Payment permissions
  MAKE_PAYMENTS: "make_payments",
  VIEW_PAYMENT_HISTORY: "view_payment_history",
  MANAGE_PAYOUTS: "manage_payouts",

  // Admin permissions
  MANAGE_PLATFORM: "manage_platform",
  VIEW_ANALYTICS: "view_analytics",
  MODERATE_CONTENT: "moderate_content",
  MANAGE_DISPUTES: "manage_disputes",
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Role-Permission mapping
 */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  job_seeker: [
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.EDIT_OWN_PROFILE,
    PERMISSIONS.VIEW_OTHER_PROFILES,
    PERMISSIONS.CREATE_RESUME,
    PERMISSIONS.VIEW_OWN_RESUMES,
    PERMISSIONS.EDIT_OWN_RESUMES,
    PERMISSIONS.DELETE_OWN_RESUMES,
    PERMISSIONS.VIEW_COACH_DIRECTORY,
    PERMISSIONS.BECOME_COACH,
    PERMISSIONS.CREATE_VERIFICATION_TASK,
    PERMISSIONS.ACCEPT_BIDS,
    PERMISSIONS.VIEW_MARKETPLACE,
    PERMISSIONS.BOOK_SESSION,
    PERMISSIONS.VIEW_SESSION_NOTES,
    PERMISSIONS.MAKE_PAYMENTS,
    PERMISSIONS.VIEW_PAYMENT_HISTORY,
  ],
  coach: [
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.EDIT_OWN_PROFILE,
    PERMISSIONS.VIEW_OTHER_PROFILES,
    PERMISSIONS.VIEW_COACH_DIRECTORY,
    PERMISSIONS.MANAGE_COACH_PROFILE,
    PERMISSIONS.VIEW_CLIENT_SESSIONS,
    PERMISSIONS.MANAGE_AVAILABILITY,
    PERMISSIONS.RECEIVE_PAYMENTS,
    PERMISSIONS.BID_ON_TASKS,
    PERMISSIONS.VIEW_MARKETPLACE,
    PERMISSIONS.MANAGE_SESSIONS,
    PERMISSIONS.VIEW_SESSION_NOTES,
    PERMISSIONS.VIEW_PAYMENT_HISTORY,
    PERMISSIONS.MANAGE_PAYOUTS,
  ],
  admin: [
    // Admins have all permissions
    ...Object.values(PERMISSIONS),
  ],
};

/**
 * Check if a user has a specific permission
 */
export const hasPermission = query({
  args: {
    userId: v.id("users"),
    permission: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return false;
    }

    const userPermissions = ROLE_PERMISSIONS[user.role as Role] || [];
    return userPermissions.includes(args.permission as Permission);
  },
});

/**
 * Get all permissions for a user's role
 */
export const getUserPermissions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return [];
    }

    return ROLE_PERMISSIONS[user.role as Role] || [];
  },
});

/**
 * Check if user can access a specific resource
 */
export const canAccessResource = query({
  args: {
    userId: v.id("users"),
    resourceType: v.string(), // "resume", "session", "coach_profile", etc.
    resourceId: v.string(),
    action: v.string(), // "view", "edit", "delete"
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return { allowed: false, reason: "User not found" };
    }

    // Admin can access everything
    if (user.role === ROLES.ADMIN) {
      return { allowed: true, reason: "Admin access" };
    }

    // Check resource-specific access
    switch (args.resourceType) {
      case "resume": {
        const resume = await ctx.db.get(args.resourceId as Id<"resumes">);
        if (!resume) {
          return { allowed: false, reason: "Resource not found" };
        }

        // Owner can always access their own resumes
        if (resume.userId === args.userId) {
          return { allowed: true, reason: "Owner access" };
        }

        // Coaches can view resumes for verification tasks
        if (user.role === ROLES.COACH && args.action === "view") {
          return { allowed: true, reason: "Coach verification access" };
        }

        return { allowed: false, reason: "Insufficient permissions" };
      }

      case "session": {
        const session = await ctx.db.get(args.resourceId as Id<"sessions">);
        if (!session) {
          return { allowed: false, reason: "Resource not found" };
        }

        // Job seeker (client) can access their sessions
        if (session.userId === args.userId) {
          return { allowed: true, reason: "Client access" };
        }

        // Coach can access sessions they're assigned to
        const coach = await ctx.db
          .query("coaches")
          .withIndex("by_user", (q) => q.eq("userId", args.userId))
          .unique();

        if (coach && session.coachId === coach._id) {
          return { allowed: true, reason: "Coach access" };
        }

        return { allowed: false, reason: "Insufficient permissions" };
      }

      case "coach_profile": {
        const coach = await ctx.db.get(args.resourceId as Id<"coaches">);
        if (!coach) {
          return { allowed: false, reason: "Resource not found" };
        }

        // Anyone can view coach profiles
        if (args.action === "view") {
          return { allowed: true, reason: "Public profile" };
        }

        // Only the coach can edit their own profile
        if (coach.userId === args.userId && args.action === "edit") {
          return { allowed: true, reason: "Owner access" };
        }

        return { allowed: false, reason: "Insufficient permissions" };
      }

      case "verification_task": {
        const task = await ctx.db.get(args.resourceId as Id<"verificationTasks">);
        if (!task) {
          return { allowed: false, reason: "Resource not found" };
        }

        // Task creator can always access
        if (task.userId === args.userId) {
          return { allowed: true, reason: "Owner access" };
        }

        // Assigned coach can access
        const coach = await ctx.db
          .query("coaches")
          .withIndex("by_user", (q) => q.eq("userId", args.userId))
          .unique();

        if (coach && task.assignedCoachId === coach._id) {
          return { allowed: true, reason: "Assigned coach access" };
        }

        // Other coaches can view open tasks
        if (user.role === ROLES.COACH && task.status === "open" && args.action === "view") {
          return { allowed: true, reason: "Marketplace access" };
        }

        return { allowed: false, reason: "Insufficient permissions" };
      }

      default:
        return { allowed: false, reason: "Unknown resource type" };
    }
  },
});

/**
 * Assign a role to a user (admin only)
 */
export const assignRole = mutation({
  args: {
    adminId: v.id("users"),
    targetUserId: v.id("users"),
    newRole: v.union(v.literal("job_seeker"), v.literal("coach"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    // Verify admin permissions
    const admin = await ctx.db.get(args.adminId);
    if (!admin || admin.role !== ROLES.ADMIN) {
      throw new Error("Only admins can assign roles");
    }

    const targetUser = await ctx.db.get(args.targetUserId);
    if (!targetUser) {
      throw new Error("Target user not found");
    }

    // Update role
    await ctx.db.patch(args.targetUserId, {
      role: args.newRole,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: `Role updated to ${args.newRole}`,
      previousRole: targetUser.role,
      newRole: args.newRole,
    };
  },
});

/**
 * Request role change (e.g., job_seeker wants to become coach)
 */
export const requestRoleChange = mutation({
  args: {
    userId: v.id("users"),
    requestedRole: v.union(v.literal("job_seeker"), v.literal("coach")),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // For becoming a coach, create coach profile
    if (args.requestedRole === ROLES.COACH && user.role === ROLES.JOB_SEEKER) {
      // Check if coach profile already exists
      const existingCoach = await ctx.db
        .query("coaches")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .unique();

      if (existingCoach) {
        return {
          success: false,
          message: "Coach profile already exists",
        };
      }

      // Update user role
      await ctx.db.patch(args.userId, {
        role: ROLES.COACH,
        updatedAt: Date.now(),
      });

      return {
        success: true,
        message: "Role changed to coach. Please complete your coach profile.",
        previousRole: user.role,
        newRole: ROLES.COACH,
      };
    }

    // Other role changes require admin approval
    return {
      success: false,
      message: "This role change requires admin approval",
    };
  },
});

/**
 * Get role capabilities (for UI display)
 */
export const getRoleCapabilities = query({
  args: {
    role: v.union(v.literal("job_seeker"), v.literal("coach"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const permissions = ROLE_PERMISSIONS[args.role as Role] || [];

    return {
      role: args.role,
      permissions,
      capabilities: {
        canCreateResumes: permissions.includes(PERMISSIONS.CREATE_RESUME),
        canBecomeCoach: permissions.includes(PERMISSIONS.BECOME_COACH),
        canBidOnTasks: permissions.includes(PERMISSIONS.BID_ON_TASKS),
        canManageCoachProfile: permissions.includes(PERMISSIONS.MANAGE_COACH_PROFILE),
        canViewAnalytics: permissions.includes(PERMISSIONS.VIEW_ANALYTICS),
        canManagePlatform: permissions.includes(PERMISSIONS.MANAGE_PLATFORM),
      },
    };
  },
});

/**
 * Check multiple permissions at once (for bulk authorization)
 */
export const checkPermissions = query({
  args: {
    userId: v.id("users"),
    permissions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return {};
    }

    const userPermissions = ROLE_PERMISSIONS[user.role as Role] || [];
    const result: Record<string, boolean> = {};

    args.permissions.forEach((permission) => {
      result[permission] = userPermissions.includes(permission as Permission);
    });

    return result;
  },
});
