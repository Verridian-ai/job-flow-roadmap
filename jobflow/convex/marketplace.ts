import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a verification task
export const createTask = mutation({
  args: {
    resumeId: v.id("resumes"),
    taskType: v.union(
      v.literal("resume_review_quick"),
      v.literal("resume_review_full"),
      v.literal("cover_letter_review")
    ),
    urgency: v.union(
      v.literal("urgent"),
      v.literal("standard"),
      v.literal("flexible")
    ),
    suggestedPrice: v.number(),
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

    // Verify user owns the resume
    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.userId !== user._id) {
      throw new Error("Unauthorized access to resume");
    }

    const now = Date.now();
    const taskId = await ctx.db.insert("verificationTasks", {
      resumeId: args.resumeId,
      userId: user._id,
      taskType: args.taskType,
      urgency: args.urgency,
      suggestedPrice: args.suggestedPrice,
      status: "open",
      createdAt: now,
      updatedAt: now,
    });

    return taskId;
  },
});

// List verification tasks
export const listTasks = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("open"),
        v.literal("bidding"),
        v.literal("assigned"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("disputed")
      )
    ),
    forCoaches: v.optional(v.boolean()),
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

    // If forCoaches is true, return all open/bidding tasks for coaches to bid on
    if (args.forCoaches) {
      const openTasks = await ctx.db
        .query("verificationTasks")
        .withIndex("by_status", (q) => q.eq("status", "open"))
        .collect();

      const biddingTasks = await ctx.db
        .query("verificationTasks")
        .withIndex("by_status", (q) => q.eq("status", "bidding"))
        .collect();

      return [...openTasks, ...biddingTasks];
    }

    // Otherwise, return tasks owned by the user
    if (args.status) {
      const allTasks = await ctx.db
        .query("verificationTasks")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();

      return allTasks.filter((task) => task.userId === user._id);
    }

    return await ctx.db
      .query("verificationTasks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Create a bid on a verification task
export const createBid = mutation({
  args: {
    taskId: v.id("verificationTasks"),
    price: v.number(),
    estimatedTime: v.number(),
    message: v.optional(v.string()),
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

    // Verify user is a coach
    if (user.role !== "coach") {
      throw new Error("Only coaches can create bids");
    }

    const coachProfile = await ctx.db
      .query("coaches")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!coachProfile) {
      throw new Error("Coach profile not found");
    }

    // Verify coach is approved
    if (coachProfile.verificationStatus !== "approved") {
      throw new Error("Coach must be approved to create bids");
    }

    // Verify task exists and is open for bidding
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.status !== "open" && task.status !== "bidding") {
      throw new Error("Task is not accepting bids");
    }

    // Check if coach already has a bid on this task
    const existingBid = await ctx.db
      .query("bids")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .filter((q) => q.eq(q.field("coachId"), coachProfile._id))
      .first();

    if (existingBid) {
      throw new Error("You already have a bid on this task");
    }

    const now = Date.now();
    const bidId = await ctx.db.insert("bids", {
      taskId: args.taskId,
      coachId: coachProfile._id,
      price: args.price,
      estimatedTime: args.estimatedTime,
      message: args.message,
      status: "pending",
      createdAt: now,
    });

    // Update task status to bidding if it was open
    if (task.status === "open") {
      await ctx.db.patch(args.taskId, {
        status: "bidding",
        updatedAt: now,
      });
    }

    return bidId;
  },
});

// Accept a bid
export const acceptBid = mutation({
  args: {
    bidId: v.id("bids"),
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

    const bid = await ctx.db.get(args.bidId);
    if (!bid) {
      throw new Error("Bid not found");
    }

    const task = await ctx.db.get(bid.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Verify user owns the task
    if (task.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    // Verify task is in bidding status
    if (task.status !== "bidding") {
      throw new Error("Task is not accepting bid acceptances");
    }

    const now = Date.now();

    // Accept the bid
    await ctx.db.patch(args.bidId, {
      status: "accepted",
    });

    // Update task
    await ctx.db.patch(bid.taskId, {
      status: "assigned",
      assignedCoachId: bid.coachId,
      finalPrice: bid.price,
      updatedAt: now,
    });

    // Reject all other bids
    const otherBids = await ctx.db
      .query("bids")
      .withIndex("by_task", (q) => q.eq("taskId", bid.taskId))
      .filter((q) => q.neq(q.field("_id"), args.bidId))
      .collect();

    for (const otherBid of otherBids) {
      if (otherBid.status === "pending") {
        await ctx.db.patch(otherBid._id, {
          status: "rejected",
        });
      }
    }

    return { taskId: bid.taskId };
  },
});

// Get a task by ID
export const getTask = query({
  args: {
    taskId: v.id("verificationTasks"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  },
});

// Mark task as completed (coach action)
export const completeTask = mutation({
  args: {
    taskId: v.id("verificationTasks"),
    feedback: v.optional(v.string()),
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

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Verify user is the assigned coach
    if (!task.assignedCoachId) {
      throw new Error("No coach assigned to this task");
    }

    const coach = await ctx.db.get(task.assignedCoachId);
    if (!coach || coach.userId !== user._id) {
      throw new Error("Unauthorized - only the assigned coach can complete this task");
    }

    if (task.status !== "in_progress" && task.status !== "assigned") {
      throw new Error("Task must be in progress to be completed");
    }

    const now = Date.now();

    // Update task status
    await ctx.db.patch(args.taskId, {
      status: "completed",
      completedAt: now,
      feedback: args.feedback,
      updatedAt: now,
    });

    return { taskId: args.taskId };
  },
});

// Start working on a task (coach action)
export const startTask = mutation({
  args: {
    taskId: v.id("verificationTasks"),
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

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Verify user is the assigned coach
    if (!task.assignedCoachId) {
      throw new Error("No coach assigned to this task");
    }

    const coach = await ctx.db.get(task.assignedCoachId);
    if (!coach || coach.userId !== user._id) {
      throw new Error("Unauthorized - only the assigned coach can start this task");
    }

    if (task.status !== "assigned") {
      throw new Error("Task must be assigned to start working on it");
    }

    const now = Date.now();

    // Update task status
    await ctx.db.patch(args.taskId, {
      status: "in_progress",
      updatedAt: now,
    });

    return { taskId: args.taskId };
  },
});

// Update task status
export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("verificationTasks"),
    status: v.union(
      v.literal("open"),
      v.literal("bidding"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("disputed")
    ),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    await ctx.db.patch(args.taskId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.taskId;
  },
});
