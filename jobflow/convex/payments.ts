import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a payment
export const create = mutation({
  args: {
    amount: v.number(),
    currency: v.string(),
    type: v.union(
      v.literal("verification"),
      v.literal("session"),
      v.literal("subscription")
    ),
    stripePaymentIntentId: v.optional(v.string()),
    taskId: v.optional(v.id("verificationTasks")),
    sessionId: v.optional(v.id("sessions")),
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

    // Verify ownership of related entities
    if (args.taskId) {
      const task = await ctx.db.get(args.taskId);
      if (!task || task.userId !== user._id) {
        throw new Error("Unauthorized access to task");
      }
    }

    if (args.sessionId) {
      const session = await ctx.db.get(args.sessionId);
      if (!session || session.userId !== user._id) {
        throw new Error("Unauthorized access to session");
      }
    }

    const now = Date.now();
    const paymentId = await ctx.db.insert("payments", {
      userId: user._id,
      amount: args.amount,
      currency: args.currency,
      type: args.type,
      status: "pending",
      stripePaymentIntentId: args.stripePaymentIntentId,
      taskId: args.taskId,
      sessionId: args.sessionId,
      createdAt: now,
    });

    return paymentId;
  },
});

// List payments for current user
export const list = query({
  args: {
    type: v.optional(
      v.union(
        v.literal("verification"),
        v.literal("session"),
        v.literal("subscription")
      )
    ),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("succeeded"),
        v.literal("failed"),
        v.literal("refunded")
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

    let payments = await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Filter by type if provided
    if (args.type) {
      payments = payments.filter((payment) => payment.type === args.type);
    }

    // Filter by status if provided
    if (args.status) {
      payments = payments.filter((payment) => payment.status === args.status);
    }

    return payments;
  },
});

// Update payment status (typically called by webhook or backend process)
export const updateStatus = mutation({
  args: {
    id: v.id("payments"),
    status: v.union(
      v.literal("pending"),
      v.literal("succeeded"),
      v.literal("failed"),
      v.literal("refunded")
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

    const payment = await ctx.db.get(args.id);
    if (!payment) {
      throw new Error("Payment not found");
    }

    // Row-level security: ensure user owns this payment
    if (payment.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
    });

    return args.id;
  },
});

// Get payment by ID
export const get = query({
  args: {
    id: v.id("payments"),
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

    const payment = await ctx.db.get(args.id);
    if (!payment) {
      throw new Error("Payment not found");
    }

    // Row-level security: ensure user owns this payment
    if (payment.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    return payment;
  },
});
