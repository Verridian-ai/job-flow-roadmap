import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new application
export const create = mutation({
  args: {
    jobId: v.id("jobs"),
    resumeId: v.optional(v.id("resumes")),
    coverLetter: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("submitted"),
      v.literal("reviewed"),
      v.literal("interviewing"),
      v.literal("offered"),
      v.literal("rejected"),
      v.literal("accepted")
    ),
    followUpDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Verify user owns the job
    const job = await ctx.db.get(args.jobId);
    if (!job || job.userId !== user._id) {
      throw new Error("Unauthorized access to job");
    }

    // Verify user owns the resume if provided
    if (args.resumeId) {
      const resume = await ctx.db.get(args.resumeId);
      if (!resume || resume.userId !== user._id) {
        throw new Error("Unauthorized access to resume");
      }
    }

    const now = Date.now();
    const applicationId = await ctx.db.insert("applications", {
      userId: user._id,
      jobId: args.jobId,
      resumeId: args.resumeId,
      coverLetter: args.coverLetter,
      status: args.status,
      appliedDate: now,
      followUpDate: args.followUpDate,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    return applicationId;
  },
});

// List all applications for the current user
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("submitted"),
        v.literal("reviewed"),
        v.literal("interviewing"),
        v.literal("offered"),
        v.literal("rejected"),
        v.literal("accepted")
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (args.status) {
      return await ctx.db
        .query("applications")
        .withIndex("by_user_and_status", (q) =>
          q.eq("userId", user._id).eq("status", args.status)
        )
        .collect();
    }

    return await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Update application status
export const updateStatus = mutation({
  args: {
    id: v.id("applications"),
    status: v.union(
      v.literal("pending"),
      v.literal("submitted"),
      v.literal("reviewed"),
      v.literal("interviewing"),
      v.literal("offered"),
      v.literal("rejected"),
      v.literal("accepted")
    ),
    followUpDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const application = await ctx.db.get(args.id);
    if (!application) {
      throw new Error("Application not found");
    }

    // Row-level security: ensure user owns this application
    if (application.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    const updateData: {
      updatedAt: number;
      status?: typeof args.status;
      notes?: string;
      appliedDate?: number;
      followUpDate?: number;
    } = { updatedAt: Date.now() };
    if (args.status !== undefined) updateData.status = args.status;
    if (args.notes !== undefined) updateData.notes = args.notes;
    if (args.appliedDate !== undefined) updateData.appliedDate = args.appliedDate;
    if (args.followUpDate !== undefined) updateData.followUpDate = args.followUpDate;
    
    await ctx.db.patch(args.id, updateData);

    return args.id;
  },
});
