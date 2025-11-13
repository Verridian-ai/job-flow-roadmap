import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Row-Level Security (RLS) Implementation
 *
 * This module provides database-level security policies that restrict
 * which rows users can access based on their identity and role.
 *
 * Features:
 * - Ownership-based access control
 * - Role-based data filtering
 * - Secure query helpers
 * - Data visibility policies
 */

/**
 * Policy evaluation result
 */
interface PolicyResult {
  allowed: boolean;
  reason: string;
}

/**
 * Check if user owns a resource
 */
function checkOwnership(
  userId: Id<"users">,
  resource: { userId: Id<"users"> }
): PolicyResult {
  if (resource.userId === userId) {
    return { allowed: true, reason: "owner" };
  }
  return { allowed: false, reason: "not_owner" };
}

/**
 * Check if user has a specific role
 */
async function checkRole(
  ctx: QueryCtx,
  userId: Id<"users">,
  requiredRole: "job_seeker" | "coach" | "admin"
): Promise<PolicyResult> {
  const user = await ctx.db.get(userId);
  if (!user) {
    return { allowed: false, reason: "user_not_found" };
  }

  if (user.role === requiredRole) {
    return { allowed: true, reason: `has_role_${requiredRole}` };
  }

  // Admin can access everything
  if (user.role === "admin") {
    return { allowed: true, reason: "admin_access" };
  }

  return { allowed: false, reason: "insufficient_role" };
}

/**
 * Resume RLS Policies
 */
export const resumePolicies = {
  /**
   * Can read resume if:
   * - User is owner
   * - User is admin
   * - User is coach viewing for verification
   */
  canRead: async (
    ctx: QueryCtx,
    userId: Id<"users">,
    resume: Doc<"resumes">
  ): Promise<PolicyResult> => {
    // Owner can read
    const ownerCheck = checkOwnership(userId, resume);
    if (ownerCheck.allowed) return ownerCheck;

    // Admin can read
    const adminCheck = await checkRole(ctx, userId, "admin");
    if (adminCheck.allowed) return adminCheck;

    // Coach can read resumes for verification tasks
    const coachCheck = await checkRole(ctx, userId, "coach");
    if (coachCheck.allowed && resume.status === "pending_verification") {
      return { allowed: true, reason: "coach_verification_access" };
    }

    return { allowed: false, reason: "no_access" };
  },

  /**
   * Can write (edit) resume if:
   * - User is owner and resume not verified
   * - User is admin
   */
  canWrite: async (
    ctx: QueryCtx,
    userId: Id<"users">,
    resume: Doc<"resumes">
  ): Promise<PolicyResult> => {
    // Owner can write only if not verified
    const ownerCheck = checkOwnership(userId, resume);
    if (ownerCheck.allowed) {
      if (resume.status !== "verified") {
        return { allowed: true, reason: "owner_unverified" };
      }
      return { allowed: false, reason: "resume_verified" };
    }

    // Admin can always write
    const adminCheck = await checkRole(ctx, userId, "admin");
    if (adminCheck.allowed) return adminCheck;

    return { allowed: false, reason: "no_write_access" };
  },

  /**
   * Can delete resume if:
   * - User is owner
   * - User is admin
   */
  canDelete: async (
    ctx: QueryCtx,
    userId: Id<"users">,
    resume: Doc<"resumes">
  ): Promise<PolicyResult> => {
    const ownerCheck = checkOwnership(userId, resume);
    if (ownerCheck.allowed) return ownerCheck;

    const adminCheck = await checkRole(ctx, userId, "admin");
    if (adminCheck.allowed) return adminCheck;

    return { allowed: false, reason: "no_delete_access" };
  },
};

/**
 * Session RLS Policies
 */
export const sessionPolicies = {
  /**
   * Can read session if:
   * - User is the client (userId)
   * - User is the coach (via coachId)
   * - User is admin
   */
  canRead: async (
    ctx: QueryCtx,
    userId: Id<"users">,
    session: Doc<"sessions">
  ): Promise<PolicyResult> => {
    // Client can read their sessions
    const clientCheck = checkOwnership(userId, session);
    if (clientCheck.allowed) return clientCheck;

    // Coach can read their sessions
    const coaches = await ctx.db
      .query("coaches")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const coach of coaches) {
      if (session.coachId === coach._id) {
        return { allowed: true, reason: "coach_access" };
      }
    }

    // Admin can read
    const adminCheck = await checkRole(ctx, userId, "admin");
    if (adminCheck.allowed) return adminCheck;

    return { allowed: false, reason: "no_access" };
  },

  /**
   * Can write session if:
   * - User is the coach
   * - User is admin
   */
  canWrite: async (
    ctx: QueryCtx,
    userId: Id<"users">,
    session: Doc<"sessions">
  ): Promise<PolicyResult> => {
    const coaches = await ctx.db
      .query("coaches")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const coach of coaches) {
      if (session.coachId === coach._id) {
        return { allowed: true, reason: "coach_write_access" };
      }
    }

    const adminCheck = await checkRole(ctx, userId, "admin");
    if (adminCheck.allowed) return adminCheck;

    return { allowed: false, reason: "no_write_access" };
  },
};

/**
 * Verification Task RLS Policies
 */
export const verificationTaskPolicies = {
  /**
   * Can read task if:
   * - User is task creator
   * - User is assigned coach
   * - User is coach and task is open
   * - User is admin
   */
  canRead: async (
    ctx: QueryCtx,
    userId: Id<"users">,
    task: Doc<"verificationTasks">
  ): Promise<PolicyResult> => {
    // Creator can read
    const creatorCheck = checkOwnership(userId, task);
    if (creatorCheck.allowed) return creatorCheck;

    // Assigned coach can read
    const coaches = await ctx.db
      .query("coaches")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const coach of coaches) {
      if (task.assignedCoachId === coach._id) {
        return { allowed: true, reason: "assigned_coach_access" };
      }

      // Other coaches can read open tasks
      if (task.status === "open") {
        return { allowed: true, reason: "marketplace_access" };
      }
    }

    // Admin can read
    const adminCheck = await checkRole(ctx, userId, "admin");
    if (adminCheck.allowed) return adminCheck;

    return { allowed: false, reason: "no_access" };
  },

  /**
   * Can write task if:
   * - User is task creator
   * - User is assigned coach
   * - User is admin
   */
  canWrite: async (
    ctx: QueryCtx,
    userId: Id<"users">,
    task: Doc<"verificationTasks">
  ): Promise<PolicyResult> => {
    const creatorCheck = checkOwnership(userId, task);
    if (creatorCheck.allowed) return creatorCheck;

    const coaches = await ctx.db
      .query("coaches")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const coach of coaches) {
      if (task.assignedCoachId === coach._id) {
        return { allowed: true, reason: "assigned_coach_write" };
      }
    }

    const adminCheck = await checkRole(ctx, userId, "admin");
    if (adminCheck.allowed) return adminCheck;

    return { allowed: false, reason: "no_write_access" };
  },
};

/**
 * Message RLS Policies
 */
export const messagePolicies = {
  /**
   * Can read message if:
   * - User is sender
   * - User is receiver
   * - User is admin
   */
  canRead: async (
    ctx: QueryCtx,
    userId: Id<"users">,
    message: Doc<"messages">
  ): Promise<PolicyResult> => {
    if (message.senderId === userId || message.receiverId === userId) {
      return { allowed: true, reason: "participant_access" };
    }

    const adminCheck = await checkRole(ctx, userId, "admin");
    if (adminCheck.allowed) return adminCheck;

    return { allowed: false, reason: "no_access" };
  },
};

/**
 * Payment RLS Policies
 */
export const paymentPolicies = {
  /**
   * Can read payment if:
   * - User made the payment
   * - User is coach receiving payment (via task/session)
   * - User is admin
   */
  canRead: async (
    ctx: QueryCtx,
    userId: Id<"users">,
    payment: Doc<"payments">
  ): Promise<PolicyResult> => {
    const payerCheck = checkOwnership(userId, payment);
    if (payerCheck.allowed) return payerCheck;

    // Check if user is receiving coach
    if (payment.taskId) {
      const task = await ctx.db.get(payment.taskId);
      if (task) {
        const coaches = await ctx.db
          .query("coaches")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .collect();

        for (const coach of coaches) {
          if (task.assignedCoachId === coach._id) {
            return { allowed: true, reason: "payee_access" };
          }
        }
      }
    }

    const adminCheck = await checkRole(ctx, userId, "admin");
    if (adminCheck.allowed) return adminCheck;

    return { allowed: false, reason: "no_access" };
  },
};

/**
 * Secure query helpers that automatically filter based on RLS policies
 */

/**
 * Get user's resumes (automatically filtered)
 */
export const getMyResumes = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get all user's resumes
    const resumes = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return resumes;
  },
});

/**
 * Get user's sessions (automatically filtered)
 */
export const getMySessions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get sessions where user is client
    const clientSessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Get sessions where user is coach
    const coaches = await ctx.db
      .query("coaches")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const coachSessions = [];
    for (const coach of coaches) {
      const sessions = await ctx.db
        .query("sessions")
        .withIndex("by_coach", (q) => q.eq("coachId", coach._id))
        .collect();
      coachSessions.push(...sessions);
    }

    // Combine and deduplicate
    const allSessions = [...clientSessions, ...coachSessions];
    const uniqueSessions = Array.from(
      new Map(allSessions.map((s) => [s._id, s])).values()
    );

    return uniqueSessions;
  },
});

/**
 * Get user's verification tasks (automatically filtered)
 */
export const getMyVerificationTasks = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get tasks created by user
    const createdTasks = await ctx.db
      .query("verificationTasks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Get tasks assigned to user (if coach)
    const coaches = await ctx.db
      .query("coaches")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const assignedTasks = [];
    for (const coach of coaches) {
      const tasks = await ctx.db
        .query("verificationTasks")
        .withIndex("by_coach", (q) => q.eq("assignedCoachId", coach._id))
        .collect();
      assignedTasks.push(...tasks);
    }

    // Combine and deduplicate
    const allTasks = [...createdTasks, ...assignedTasks];
    const uniqueTasks = Array.from(
      new Map(allTasks.map((t) => [t._id, t])).values()
    );

    return uniqueTasks;
  },
});

/**
 * Get user's messages (automatically filtered)
 */
export const getMyMessages = query({
  args: {
    userId: v.id("users"),
    otherUserId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    let messages;

    if (args.otherUserId) {
      // Get conversation with specific user
      const sent = await ctx.db
        .query("messages")
        .withIndex("by_sender", (q) => q.eq("senderId", args.userId))
        .filter((q) => q.eq(q.field("receiverId"), args.otherUserId))
        .collect();

      const received = await ctx.db
        .query("messages")
        .withIndex("by_receiver", (q) => q.eq("receiverId", args.userId))
        .filter((q) => q.eq(q.field("senderId"), args.otherUserId))
        .collect();

      messages = [...sent, ...received].sort((a, b) => a.createdAt - b.createdAt);
    } else {
      // Get all user's messages
      const sent = await ctx.db
        .query("messages")
        .withIndex("by_sender", (q) => q.eq("senderId", args.userId))
        .collect();

      const received = await ctx.db
        .query("messages")
        .withIndex("by_receiver", (q) => q.eq("receiverId", args.userId))
        .collect();

      messages = [...sent, ...received].sort((a, b) => b.createdAt - a.createdAt);
    }

    return messages;
  },
});

/**
 * Get user's payments (automatically filtered)
 */
export const getMyPayments = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get payments made by user
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return payments;
  },
});

/**
 * Validate policy before mutation
 */
export async function validatePolicy(
  ctx: QueryCtx,
  userId: Id<"users">,
  resourceType: string,
  resourceId: string,
  action: "read" | "write" | "delete"
): Promise<PolicyResult> {
  switch (resourceType) {
    case "resume": {
      const resume = await ctx.db.get(resourceId as Id<"resumes">);
      if (!resume) return { allowed: false, reason: "resource_not_found" };

      if (action === "read") return resumePolicies.canRead(ctx, userId, resume);
      if (action === "write") return resumePolicies.canWrite(ctx, userId, resume);
      if (action === "delete") return resumePolicies.canDelete(ctx, userId, resume);
      break;
    }
    case "session": {
      const session = await ctx.db.get(resourceId as Id<"sessions">);
      if (!session) return { allowed: false, reason: "resource_not_found" };

      if (action === "read") return sessionPolicies.canRead(ctx, userId, session);
      if (action === "write") return sessionPolicies.canWrite(ctx, userId, session);
      break;
    }
    case "verificationTask": {
      const task = await ctx.db.get(resourceId as Id<"verificationTasks">);
      if (!task) return { allowed: false, reason: "resource_not_found" };

      if (action === "read") return verificationTaskPolicies.canRead(ctx, userId, task);
      if (action === "write") return verificationTaskPolicies.canWrite(ctx, userId, task);
      break;
    }
    case "message": {
      const message = await ctx.db.get(resourceId as Id<"messages">);
      if (!message) return { allowed: false, reason: "resource_not_found" };

      if (action === "read") return messagePolicies.canRead(ctx, userId, message);
      break;
    }
    case "payment": {
      const payment = await ctx.db.get(resourceId as Id<"payments">);
      if (!payment) return { allowed: false, reason: "resource_not_found" };

      if (action === "read") return paymentPolicies.canRead(ctx, userId, payment);
      break;
    }
  }

  return { allowed: false, reason: "unknown_resource_type" };
}
