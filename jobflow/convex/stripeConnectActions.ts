/**
 * Stripe Connect Actions
 * Handles coach onboarding, payouts, and earnings
 */

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import {
  createConnectAccount,
  createAccountLink,
  getConnectAccount,
  createTransfer,
  createPayout,
  createPaymentWithApplicationFee,
  getAccountBalance,
  listTransfers,
  listPayouts,
  createDashboardLink,
  calculatePlatformFee,
  calculateCoachPayout,
} from "./stripeConnect";

/**
 * Create Stripe Connect account for coach
 */
export const createCoachConnectAccount = action({
  args: {
    coachId: v.id("coaches"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get coach profile
    const coach = await ctx.runQuery(api.coaches.get, {
      id: args.coachId,
    });

    if (!coach) {
      throw new Error("Coach not found");
    }

    // Get user details
    const user = await ctx.runQuery(api.users.getById, {
      userId: coach.userId,
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if coach already has Connect account
    if (coach.stripeAccountId) {
      throw new Error("Coach already has a Connect account");
    }

    // Create Connect account
    const account = await createConnectAccount({
      email: user.email,
      country: "US", // TODO: Get from user profile
      metadata: {
        coachId: args.coachId,
        userId: coach.userId,
      },
    });

    // Update coach profile with Connect account ID
    await ctx.runMutation(api.coaches.updateStripeAccount, {
      coachId: args.coachId,
      stripeAccountId: account.id,
    });

    return {
      accountId: account.id,
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    };
  },
});

/**
 * Generate Connect account onboarding link
 */
export const getCoachOnboardingLink = action({
  args: {
    coachId: v.id("coaches"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const coach = await ctx.runQuery(api.coaches.get, {
      id: args.coachId,
    });

    if (!coach || !coach.stripeAccountId) {
      throw new Error("Coach does not have a Connect account");
    }

    // Create account link for onboarding
    const accountLink = await createAccountLink({
      accountId: coach.stripeAccountId,
      refreshUrl: `${process.env.SITE_URL}/coach/onboarding/refresh`,
      returnUrl: `${process.env.SITE_URL}/coach/onboarding/complete`,
    });

    return {
      url: accountLink.url,
      expiresAt: accountLink.expires_at,
    };
  },
});

/**
 * Get Connect account status
 */
export const getCoachAccountStatus = action({
  args: {
    coachId: v.id("coaches"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const coach = await ctx.runQuery(api.coaches.get, {
      id: args.coachId,
    });

    if (!coach || !coach.stripeAccountId) {
      return {
        hasAccount: false,
        detailsSubmitted: false,
        chargesEnabled: false,
        payoutsEnabled: false,
      };
    }

    const account = await getConnectAccount(coach.stripeAccountId);

    return {
      hasAccount: true,
      accountId: account.id,
      detailsSubmitted: account.details_submitted || false,
      chargesEnabled: account.charges_enabled || false,
      payoutsEnabled: account.payouts_enabled || false,
      country: account.country,
      email: account.email,
    };
  },
});

/**
 * Process payout for completed verification task
 */
export const processTaskPayout = action({
  args: {
    taskId: v.id("verificationTasks"),
    paymentId: v.id("payments"),
  },
  handler: async (ctx, args) => {
    // Get task details
    const task = await ctx.runQuery(api.marketplace.getTask, {
      taskId: args.taskId,
    });

    if (!task || !task.assignedCoachId || !task.finalPrice) {
      throw new Error("Task not found or not properly assigned");
    }

    if (task.status !== "completed") {
      throw new Error("Task must be completed before payout");
    }

    // Get coach profile
    const coach = await ctx.runQuery(api.coaches.get, {
      id: task.assignedCoachId,
    });

    if (!coach || !coach.stripeAccountId) {
      throw new Error("Coach does not have a Connect account");
    }

    // Get payment details
    const payment = await ctx.runQuery(api.payments.get, {
      id: args.paymentId,
    });

    if (!payment || payment.status !== "succeeded") {
      throw new Error("Payment not found or not succeeded");
    }

    // Calculate platform fee and coach payout
    const platformFee = calculatePlatformFee(task.finalPrice);
    const coachAmount = calculateCoachPayout(task.finalPrice);

    // Create transfer to coach
    const transfer = await createTransfer({
      amount: coachAmount,
      currency: "usd",
      destination: coach.stripeAccountId,
      description: `Payout for task ${args.taskId}`,
      metadata: {
        taskId: args.taskId,
        coachId: task.assignedCoachId,
        paymentId: args.paymentId,
        platformFee: platformFee.toString(),
      },
    });

    // Record the payout in database
    await ctx.runMutation(api.payouts.create, {
      coachId: task.assignedCoachId,
      taskId: args.taskId,
      amount: coachAmount,
      platformFee: platformFee,
      stripeTransferId: transfer.id,
    });

    return {
      transferId: transfer.id,
      amount: coachAmount,
      platformFee: platformFee,
      status: "paid",
    };
  },
});

/**
 * Process payout for completed coaching session
 */
export const processSessionPayout = action({
  args: {
    sessionId: v.id("sessions"),
    paymentId: v.id("payments"),
  },
  handler: async (ctx, args) => {
    // Get session details
    const session = await ctx.runQuery(api.sessions.get, {
      id: args.sessionId,
    });

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.status !== "completed") {
      throw new Error("Session must be completed before payout");
    }

    // Get coach profile
    const coach = await ctx.runQuery(api.coaches.get, {
      id: session.coachId,
    });

    if (!coach || !coach.stripeAccountId) {
      throw new Error("Coach does not have a Connect account");
    }

    // Get payment details
    const payment = await ctx.runQuery(api.payments.get, {
      id: args.paymentId,
    });

    if (!payment || payment.status !== "succeeded") {
      throw new Error("Payment not found or not succeeded");
    }

    // Calculate session fee based on duration and hourly rate
    const hours = session.duration / 60; // duration in minutes
    const sessionFee = coach.hourlyRate * hours;

    // Calculate platform fee and coach payout
    const platformFee = calculatePlatformFee(sessionFee);
    const coachAmount = calculateCoachPayout(sessionFee);

    // Create transfer to coach
    const transfer = await createTransfer({
      amount: coachAmount,
      currency: "usd",
      destination: coach.stripeAccountId,
      description: `Payout for session ${args.sessionId}`,
      metadata: {
        sessionId: args.sessionId,
        coachId: session.coachId,
        paymentId: args.paymentId,
        platformFee: platformFee.toString(),
      },
    });

    // Record the payout
    await ctx.runMutation(api.payouts.create, {
      coachId: session.coachId,
      sessionId: args.sessionId,
      amount: coachAmount,
      platformFee: platformFee,
      stripeTransferId: transfer.id,
    });

    return {
      transferId: transfer.id,
      amount: coachAmount,
      platformFee: platformFee,
      status: "paid",
    };
  },
});

/**
 * Get coach balance and earnings
 */
export const getCoachBalance = action({
  args: {
    coachId: v.id("coaches"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const coach = await ctx.runQuery(api.coaches.get, {
      id: args.coachId,
    });

    if (!coach || !coach.stripeAccountId) {
      return {
        available: 0,
        pending: 0,
        currency: "usd",
      };
    }

    const balance = await getAccountBalance(coach.stripeAccountId);

    // Sum up available balance
    const availableBalance = balance.available.reduce(
      (sum, bal) => sum + bal.amount,
      0
    );

    // Sum up pending balance
    const pendingBalance = balance.pending.reduce(
      (sum, bal) => sum + bal.amount,
      0
    );

    return {
      available: availableBalance / 100, // Convert from cents
      pending: pendingBalance / 100,
      currency: balance.available[0]?.currency || "usd",
    };
  },
});

/**
 * Get coach payout history
 */
export const getCoachPayouts = action({
  args: {
    coachId: v.id("coaches"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const coach = await ctx.runQuery(api.coaches.get, {
      id: args.coachId,
    });

    if (!coach || !coach.stripeAccountId) {
      return [];
    }

    const payouts = await listPayouts({
      accountId: coach.stripeAccountId,
      limit: args.limit,
    });

    return payouts.data.map((payout) => ({
      id: payout.id,
      amount: payout.amount / 100,
      currency: payout.currency,
      status: payout.status,
      arrivalDate: payout.arrival_date,
      description: payout.description,
      created: payout.created,
    }));
  },
});

/**
 * Get coach transfer history
 */
export const getCoachTransfers = action({
  args: {
    coachId: v.id("coaches"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const coach = await ctx.runQuery(api.coaches.get, {
      id: args.coachId,
    });

    if (!coach || !coach.stripeAccountId) {
      return [];
    }

    const transfers = await listTransfers({
      destination: coach.stripeAccountId,
      limit: args.limit,
    });

    return transfers.data.map((transfer) => ({
      id: transfer.id,
      amount: transfer.amount / 100,
      currency: transfer.currency,
      description: transfer.description,
      created: transfer.created,
      metadata: transfer.metadata,
    }));
  },
});

/**
 * Generate link to Stripe Connect dashboard
 */
export const getCoachDashboardLink = action({
  args: {
    coachId: v.id("coaches"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const coach = await ctx.runQuery(api.coaches.get, {
      id: args.coachId,
    });

    if (!coach || !coach.stripeAccountId) {
      throw new Error("Coach does not have a Connect account");
    }

    const loginLink = await createDashboardLink(coach.stripeAccountId);

    return {
      url: loginLink.url,
    };
  },
});

/**
 * Calculate fee estimate for an amount
 */
export const calculateFeeEstimate = action({
  args: {
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const platformFee = calculatePlatformFee(args.amount);
    const coachPayout = calculateCoachPayout(args.amount);

    return {
      amount: args.amount,
      platformFee: platformFee,
      coachPayout: coachPayout,
      feePercentage: (platformFee / args.amount) * 100,
    };
  },
});
