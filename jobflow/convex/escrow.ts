import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Hold payment in escrow when bid is accepted
export const holdPaymentInEscrow = mutation({
  args: {
    taskId: v.id("verificationTasks"),
    bidId: v.id("bids"),
    paymentIntentId: v.string(),
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

    // Verify task ownership
    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== user._id) {
      throw new Error("Unauthorized access to task");
    }

    if (task.status !== "assigned") {
      throw new Error("Task must be assigned before holding payment in escrow");
    }

    // Get the accepted bid
    const bid = await ctx.db.get(args.bidId);
    if (!bid || bid.taskId !== args.taskId || bid.status !== "accepted") {
      throw new Error("Invalid or unaccepted bid");
    }

    if (!task.assignedCoachId) {
      throw new Error("No coach assigned to task");
    }

    const now = Date.now();

    // Create escrow payment record
    const paymentId = await ctx.db.insert("payments", {
      userId: user._id,
      amount: bid.price,
      currency: "usd",
      type: "verification",
      status: "held_in_escrow",
      stripePaymentIntentId: args.paymentIntentId,
      taskId: args.taskId,
      coachId: task.assignedCoachId,
      escrowHeldAt: now,
      createdAt: now,
    });

    return paymentId;
  },
});

// Release escrow payment to coach when task is completed
export const releaseEscrowPayment = mutation({
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

    // Verify task ownership
    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== user._id) {
      throw new Error("Unauthorized access to task");
    }

    if (task.status !== "completed") {
      throw new Error("Task must be completed before releasing payment");
    }

    // Find the escrow payment
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_status", (q) => q.eq("status", "held_in_escrow"))
      .filter((q) => q.eq(q.field("taskId"), args.taskId))
      .first();

    if (!payment) {
      throw new Error("No escrow payment found for this task");
    }

    const now = Date.now();

    // Update payment status to released
    await ctx.db.patch(payment._id, {
      status: "released",
      escrowReleasedAt: now,
    });

    // This would trigger a Stripe transfer to the coach's connected account
    // In a real implementation, you'd call Stripe's API here
    // For now, we'll just update the status

    return {
      paymentId: payment._id,
      amount: payment.amount,
      coachId: payment.coachId,
    };
  },
});

// Refund escrow payment when task is cancelled
export const refundEscrowPayment = mutation({
  args: {
    taskId: v.id("verificationTasks"),
    reason: v.string(),
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

    // Verify task ownership (user can cancel) or coach can request cancellation
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    let isAuthorized = false;

    // Check if user is the task owner
    if (task.userId === user._id) {
      isAuthorized = true;
    }

    // Check if user is the assigned coach
    if (task.assignedCoachId) {
      const coach = await ctx.db.get(task.assignedCoachId);
      if (coach && coach.userId === user._id) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new Error("Unauthorized to cancel this task");
    }

    // Find the escrow payment
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_status", (q) => q.eq("status", "held_in_escrow"))
      .filter((q) => q.eq(q.field("taskId"), args.taskId))
      .first();

    if (!payment) {
      throw new Error("No escrow payment found for this task");
    }

    const now = Date.now();

    // Update payment status to refunded
    await ctx.db.patch(payment._id, {
      status: "refunded",
    });

    // Update task status
    await ctx.db.patch(args.taskId, {
      status: "disputed",
      updatedAt: now,
    });

    // This would trigger a Stripe refund
    // In a real implementation, you'd call Stripe's API here

    return {
      paymentId: payment._id,
      amount: payment.amount,
      refundedTo: payment.userId,
    };
  },
});

// Get escrow payment status for a task
export const getEscrowStatus = query({
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

    // Check authorization
    let isAuthorized = false;
    if (task.userId === user._id) {
      isAuthorized = true;
    }

    if (task.assignedCoachId) {
      const coach = await ctx.db.get(task.assignedCoachId);
      if (coach && coach.userId === user._id) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new Error("Unauthorized to view this escrow status");
    }

    // Find the payment
    const payment = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("taskId"), args.taskId))
      .order("desc")
      .first();

    if (!payment) {
      return {
        hasEscrow: false,
        status: null,
        amount: null,
      };
    }

    return {
      hasEscrow: true,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      escrowHeldAt: payment.escrowHeldAt,
      escrowReleasedAt: payment.escrowReleasedAt,
    };
  },
});

// List all escrow payments for current user (as client or coach)
export const listEscrowPayments = query({
  args: {
    role: v.optional(v.union(v.literal("client"), v.literal("coach"))),
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

    let payments;

    if (args.role === "coach") {
      // Get coach profile
      const coach = await ctx.db
        .query("coaches")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();

      if (!coach) {
        return [];
      }

      // Get payments where user is the coach
      payments = await ctx.db
        .query("payments")
        .withIndex("by_coach", (q) => q.eq("coachId", coach._id))
        .filter((q) =>
          q.or(
            q.eq(q.field("status"), "held_in_escrow"),
            q.eq(q.field("status"), "released")
          )
        )
        .collect();
    } else {
      // Get payments where user is the client
      payments = await ctx.db
        .query("payments")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .filter((q) =>
          q.or(
            q.eq(q.field("status"), "held_in_escrow"),
            q.eq(q.field("status"), "released"),
            q.eq(q.field("status"), "refunded")
          )
        )
        .collect();
    }

    return payments;
  },
});
