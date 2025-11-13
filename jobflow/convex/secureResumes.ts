import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { enforceReadPolicy, enforceWritePolicy, enforceDeletePolicy } from "./middleware/rlsMiddleware";

/**
 * Example: Secure Resume Mutations with RLS Enforcement
 *
 * These mutations automatically enforce row-level security policies
 * before allowing any database operations.
 */

/**
 * Get a resume with RLS enforcement
 */
export const getResume = query({
  args: {
    userId: v.id("users"),
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    // Enforce read policy
    await enforceReadPolicy(ctx, args.userId, "resume", args.resumeId);

    const resume = await ctx.db.get(args.resumeId);
    return resume;
  },
});

/**
 * Update a resume with RLS enforcement
 */
export const updateResume = mutation({
  args: {
    userId: v.id("users"),
    resumeId: v.id("resumes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Enforce write policy
    await enforceWritePolicy(ctx, args.userId, "resume", args.resumeId);

    // Proceed with update
    await ctx.db.patch(args.resumeId, {
      title: args.title,
      content: args.content,
      updatedAt: Date.now(),
    });

    return { success: true, message: "Resume updated successfully" };
  },
});

/**
 * Delete a resume with RLS enforcement
 */
export const deleteResume = mutation({
  args: {
    userId: v.id("users"),
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    // Enforce delete policy
    await enforceDeletePolicy(ctx, args.userId, "resume", args.resumeId);

    // Proceed with deletion
    await ctx.db.delete(args.resumeId);

    return { success: true, message: "Resume deleted successfully" };
  },
});

/**
 * Update resume status (special permissions)
 */
export const updateResumeStatus = mutation({
  args: {
    userId: v.id("users"),
    resumeId: v.id("resumes"),
    status: v.union(
      v.literal("draft"),
      v.literal("pending_verification"),
      v.literal("verified"),
      v.literal("archived")
    ),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Owner can change to draft, pending_verification, or archived
    if (resume.userId === args.userId) {
      if (["draft", "pending_verification", "archived"].includes(args.status)) {
        await ctx.db.patch(args.resumeId, {
          status: args.status,
          updatedAt: Date.now(),
        });
        return { success: true, message: "Status updated" };
      }
      throw new Error("Cannot set status to verified");
    }

    // Coaches can verify resumes
    if (user.role === "coach" && args.status === "verified") {
      await enforceWritePolicy(ctx, args.userId, "resume", args.resumeId);
      await ctx.db.patch(args.resumeId, {
        status: "verified",
        updatedAt: Date.now(),
      });
      return { success: true, message: "Resume verified" };
    }

    // Admin can set any status
    if (user.role === "admin") {
      await ctx.db.patch(args.resumeId, {
        status: args.status,
        updatedAt: Date.now(),
      });
      return { success: true, message: "Status updated by admin" };
    }

    throw new Error("Insufficient permissions to change status");
  },
});
