import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    taskId: v.id("verificationTasks"),
    coachId: v.id("coaches"),
    price: v.number(),
    estimatedTime: v.number(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const coach = await ctx.db.get(args.coachId);
    if (!coach) throw new Error("Coach not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user || coach.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    if (coach.verificationStatus !== "approved") {
      throw new Error("Coach must be approved to bid");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    if (task.status !== "open" && task.status !== "bidding") {
      throw new Error("Task is not accepting bids");
    }

    const bidId = await ctx.db.insert("bids", {
      taskId: args.taskId,
      coachId: args.coachId,
      price: args.price,
      estimatedTime: args.estimatedTime,
      message: args.message,
      status: "pending",
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.taskId, { status: "bidding" });

    return bidId;
  },
});

export const listByTask = query({
  args: { taskId: v.id("verificationTasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const bids = await ctx.db
      .query("bids")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();

    return bids;
  },
});

export const listByCoach = query({
  args: { coachId: v.id("coaches") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const coach = await ctx.db.get(args.coachId);
    if (!coach) throw new Error("Coach not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user || coach.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    const bids = await ctx.db
      .query("bids")
      .withIndex("by_coach", (q) => q.eq("coachId", args.coachId))
      .collect();

    return bids;
  },
});

export const updateStatus = mutation({
  args: {
    bidId: v.id("bids"),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const bid = await ctx.db.get(args.bidId);
    if (!bid) throw new Error("Bid not found");

    await ctx.db.patch(args.bidId, { status: args.status });

    return args.bidId;
  },
});
