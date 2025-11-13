/**
 * Payout Management
 * Tracks and manages coach payouts
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a payout record
 */
export const create = mutation({
  args: {
    coachId: v.id("coaches"),
    taskId: v.optional(v.id("verificationTasks")),
    sessionId: v.optional(v.id("sessions")),
    amount: v.number(),
    platformFee: v.number(),
    stripeTransferId: v.optional(v.string()),
    stripePayoutId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const payoutId = await ctx.db.insert("payouts", {
      coachId: args.coachId,
      taskId: args.taskId,
      sessionId: args.sessionId,
      amount: args.amount,
      platformFee: args.platformFee,
      status: "pending",
      stripeTransferId: args.stripeTransferId,
      stripePayoutId: args.stripePayoutId,
      createdAt: now,
    });

    return payoutId;
  },
});

/**
 * Update payout status
 */
export const updateStatus = mutation({
  args: {
    id: v.id("payouts"),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const payout = await ctx.db.get(args.id);
    if (!payout) {
      throw new Error("Payout not found");
    }

    const updates: any = {
      status: args.status,
    };

    if (args.status === "paid") {
      updates.paidAt = Date.now();
    }

    await ctx.db.patch(args.id, updates);

    return args.id;
  },
});

/**
 * List payouts for a coach
 */
export const listByCoach = query({
  args: {
    coachId: v.id("coaches"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("paid"),
        v.literal("failed"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    let payouts = await ctx.db
      .query("payouts")
      .withIndex("by_coach", (q) => q.eq("coachId", args.coachId))
      .collect();

    if (args.status) {
      payouts = payouts.filter((payout) => payout.status === args.status);
    }

    return payouts.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get payout by ID
 */
export const get = query({
  args: {
    id: v.id("payouts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const payout = await ctx.db.get(args.id);
    if (!payout) {
      throw new Error("Payout not found");
    }

    return payout;
  },
});

/**
 * Get payout for a specific task
 */
export const getByTask = query({
  args: {
    taskId: v.id("verificationTasks"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const payout = await ctx.db
      .query("payouts")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .first();

    return payout;
  },
});

/**
 * Get payout for a specific session
 */
export const getBySession = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const payout = await ctx.db
      .query("payouts")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    return payout;
  },
});

/**
 * Get coach earnings summary
 */
export const getEarningsSummary = query({
  args: {
    coachId: v.id("coaches"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const payouts = await ctx.db
      .query("payouts")
      .withIndex("by_coach", (q) => q.eq("coachId", args.coachId))
      .collect();

    // Calculate totals
    const totalEarnings = payouts.reduce(
      (sum, payout) => sum + payout.amount,
      0
    );

    const totalPlatformFees = payouts.reduce(
      (sum, payout) => sum + payout.platformFee,
      0
    );

    const paidPayouts = payouts.filter((p) => p.status === "paid");
    const totalPaid = paidPayouts.reduce((sum, payout) => sum + payout.amount, 0);

    const pendingPayouts = payouts.filter((p) => p.status === "pending");
    const totalPending = pendingPayouts.reduce(
      (sum, payout) => sum + payout.amount,
      0
    );

    const failedPayouts = payouts.filter((p) => p.status === "failed");
    const totalFailed = failedPayouts.reduce(
      (sum, payout) => sum + payout.amount,
      0
    );

    // Get monthly breakdown (last 12 months)
    const now = Date.now();
    const twelveMonthsAgo = now - 12 * 30 * 24 * 60 * 60 * 1000;

    const recentPayouts = payouts.filter((p) => p.createdAt >= twelveMonthsAgo);

    const monthlyBreakdown: Record<string, number> = {};
    recentPayouts.forEach((payout) => {
      const date = new Date(payout.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyBreakdown[monthKey] = (monthlyBreakdown[monthKey] || 0) + payout.amount;
    });

    return {
      totalEarnings,
      totalPlatformFees,
      totalPaid,
      totalPending,
      totalFailed,
      totalPayouts: payouts.length,
      paidCount: paidPayouts.length,
      pendingCount: pendingPayouts.length,
      failedCount: failedPayouts.length,
      monthlyBreakdown,
      averagePayoutAmount: totalEarnings / (payouts.length || 1),
    };
  },
});

/**
 * List recent payouts across all coaches (admin only)
 */
export const listRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // TODO: Add admin role check
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const payouts = await ctx.db
      .query("payouts")
      .order("desc")
      .take(args.limit || 50);

    return payouts;
  },
});

/**
 * Get platform fee statistics (admin only)
 */
export const getPlatformStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const payouts = await ctx.db.query("payouts").collect();

    const totalPlatformFees = payouts.reduce(
      (sum, payout) => sum + payout.platformFee,
      0
    );

    const totalPayouts = payouts.reduce(
      (sum, payout) => sum + payout.amount,
      0
    );

    const totalGrossRevenue = totalPlatformFees + totalPayouts;

    return {
      totalPlatformFees,
      totalPayouts,
      totalGrossRevenue,
      averagePlatformFee: totalPlatformFees / (payouts.length || 1),
      feePercentage: (totalPlatformFees / totalGrossRevenue) * 100,
      totalTransactions: payouts.length,
    };
  },
});
