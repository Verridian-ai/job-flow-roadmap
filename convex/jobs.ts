import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new job
export const create = mutation({
  args: {
    title: v.string(),
    company: v.string(),
    location: v.string(),
    jobUrl: v.optional(v.string()),
    description: v.string(),
    salary: v.optional(v.string()),
    status: v.union(
      v.literal("saved"),
      v.literal("applied"),
      v.literal("interviewing"),
      v.literal("offered"),
      v.literal("rejected"),
      v.literal("accepted")
    ),
    source: v.union(
      v.literal("manual"),
      v.literal("linkedin"),
      v.literal("indeed"),
      v.literal("other")
    ),
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

    const now = Date.now();
    const jobId = await ctx.db.insert("jobs", {
      userId: user._id,
      title: args.title,
      company: args.company,
      location: args.location,
      jobUrl: args.jobUrl,
      description: args.description,
      salary: args.salary,
      status: args.status,
      source: args.source,
      appliedDate: args.status === "applied" ? now : undefined,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    return jobId;
  },
});

// List all jobs for the current user
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("saved"),
        v.literal("applied"),
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
        .query("jobs")
        .withIndex("by_user_and_status", (q) =>
          q.eq("userId", user._id).eq("status", args.status)
        )
        .collect();
    }

    return await ctx.db
      .query("jobs")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Update a job
export const update = mutation({
  args: {
    id: v.id("jobs"),
    title: v.optional(v.string()),
    company: v.optional(v.string()),
    location: v.optional(v.string()),
    jobUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    salary: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("saved"),
        v.literal("applied"),
        v.literal("interviewing"),
        v.literal("offered"),
        v.literal("rejected"),
        v.literal("accepted")
      )
    ),
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

    const job = await ctx.db.get(args.id);
    if (!job) {
      throw new Error("Job not found");
    }

    // Row-level security: ensure user owns this job
    if (job.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...updates } = args;
    const now = Date.now();

    // Set appliedDate if status is changing to "applied"
    const appliedDate =
      args.status === "applied" && job.status !== "applied"
        ? now
        : job.appliedDate;

    await ctx.db.patch(args.id, {
      ...updates,
      appliedDate,
      updatedAt: now,
    });

    return args.id;
  },
});

// Delete a job
export const deleteJob = mutation({
  args: {
    id: v.id("jobs"),
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

    const job = await ctx.db.get(args.id);
    if (!job) {
      throw new Error("Job not found");
    }

    // Row-level security: ensure user owns this job
    if (job.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Aliases for frontend compatibility
export const listByUser = list;
export const remove = deleteJob;
