/**
 * Stripe Actions - Convex actions for Stripe API integration
 * These are actions (not mutations) because they interact with external APIs
 */

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import {
  createPaymentIntent,
  createCheckoutSession,
  createCustomer,
  retrieveCustomer,
  createSubscription,
  cancelSubscription,
  createRefund,
  PRICING,
} from "./stripe";

/**
 * Create a payment intent for verification tasks
 */
export const createVerificationPaymentIntent = action({
  args: {
    taskId: v.id("verificationTasks"),
    taskType: v.union(
      v.literal("resume_review_quick"),
      v.literal("resume_review_full"),
      v.literal("cover_letter_review")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get the task to verify ownership
    const task = await ctx.runQuery(api.marketplace.getTask, {
      taskId: args.taskId,
    });

    if (!task) {
      throw new Error("Task not found");
    }

    // Determine price based on task type
    let amount: number;
    switch (args.taskType) {
      case "resume_review_quick":
        amount = PRICING.VERIFICATION.QUICK_REVIEW;
        break;
      case "resume_review_full":
        amount = PRICING.VERIFICATION.FULL_REVIEW;
        break;
      case "cover_letter_review":
        amount = PRICING.VERIFICATION.COVER_LETTER;
        break;
    }

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent(amount / 100, "usd", {
      taskId: args.taskId,
      taskType: args.taskType,
      userId: identity.subject,
    });

    // Store payment record in database
    const paymentId = await ctx.runMutation(api.payments.create, {
      amount: amount / 100,
      currency: "usd",
      type: "verification",
      stripePaymentIntentId: paymentIntent.id,
      taskId: args.taskId,
    });

    return {
      paymentId,
      clientSecret: paymentIntent.client_secret,
      amount: amount / 100,
    };
  },
});

/**
 * Create a payment intent for coaching sessions
 */
export const createSessionPaymentIntent = action({
  args: {
    sessionId: v.id("sessions"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Verify session exists and user owns it
    const session = await ctx.runQuery(api.sessions.get, {
      id: args.sessionId,
    });

    if (!session) {
      throw new Error("Session not found");
    }

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent(args.amount, "usd", {
      sessionId: args.sessionId,
      userId: identity.subject,
    });

    // Store payment record in database
    const paymentId = await ctx.runMutation(api.payments.create, {
      amount: args.amount,
      currency: "usd",
      type: "session",
      stripePaymentIntentId: paymentIntent.id,
      sessionId: args.sessionId,
    });

    return {
      paymentId,
      clientSecret: paymentIntent.client_secret,
      amount: args.amount,
    };
  },
});

/**
 * Create a checkout session for subscription
 */
export const createSubscriptionCheckout = action({
  args: {
    plan: v.union(v.literal("premium"), v.literal("pro")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get or create Stripe customer
    const user = await ctx.runQuery(api.users.getCurrentUser, {});
    if (!user) {
      throw new Error("User not found");
    }

    let customerId: string;
    if (user.stripeCustomerId) {
      customerId = user.stripeCustomerId;
    } else {
      const customer = await createCustomer(user.email, user.name, {
        userId: user._id,
        authId: identity.subject,
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await ctx.runMutation(api.users.updateStripeCustomerId, {
        customerId: customer.id,
      });
    }

    // Determine price based on plan
    const priceId =
      args.plan === "premium"
        ? process.env.STRIPE_PREMIUM_PRICE_ID
        : process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      throw new Error("Stripe price ID not configured");
    }

    // Create checkout session
    const session = await createCheckoutSession({
      customerId,
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      successUrl: `${process.env.SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.SITE_URL}/pricing`,
      metadata: {
        userId: user._id,
        plan: args.plan,
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  },
});

/**
 * Create a checkout session for one-time payment
 */
export const createPaymentCheckout = action({
  args: {
    type: v.union(
      v.literal("verification"),
      v.literal("session")
    ),
    amount: v.number(),
    description: v.string(),
    taskId: v.optional(v.id("verificationTasks")),
    sessionId: v.optional(v.id("sessions")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.runQuery(api.users.getCurrentUser, {});
    if (!user) {
      throw new Error("User not found");
    }

    // Create checkout session
    const session = await createCheckoutSession({
      customerEmail: user.email,
      lineItems: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: args.description,
            },
            unit_amount: Math.round(args.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      successUrl: `${process.env.SITE_URL}/dashboard/payments?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.SITE_URL}/dashboard`,
      metadata: {
        userId: user._id,
        type: args.type,
        taskId: args.taskId || "",
        sessionId: args.sessionId || "",
      },
    });

    // Create payment record
    await ctx.runMutation(api.payments.create, {
      amount: args.amount,
      currency: "usd",
      type: args.type,
      taskId: args.taskId,
      sessionId: args.sessionId,
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  },
});

/**
 * Process refund for a payment
 */
export const processRefund = action({
  args: {
    paymentId: v.id("payments"),
    reason: v.optional(
      v.union(
        v.literal("duplicate"),
        v.literal("fraudulent"),
        v.literal("requested_by_customer")
      )
    ),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get payment record
    const payment = await ctx.runQuery(api.payments.get, {
      id: args.paymentId,
    });

    if (!payment || !payment.stripePaymentIntentId) {
      throw new Error("Payment not found or invalid");
    }

    // Create refund in Stripe
    const refund = await createRefund(
      payment.stripePaymentIntentId,
      args.amount,
      args.reason
    );

    // Update payment status
    await ctx.runMutation(api.payments.updateStatus, {
      id: args.paymentId,
      status: "refunded",
    });

    return {
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
    };
  },
});

/**
 * Cancel a subscription
 */
export const cancelUserSubscription = action({
  args: {
    subscriptionId: v.id("subscriptions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get subscription record
    const subscription = await ctx.runQuery(api.subscriptions.get, {
      id: args.subscriptionId,
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error("Subscription not found or invalid");
    }

    // Cancel in Stripe
    const canceledSubscription = await cancelSubscription(
      subscription.stripeSubscriptionId
    );

    // Update subscription status
    await ctx.runMutation(api.subscriptions.updateStatus, {
      id: args.subscriptionId,
      status: "cancelled",
    });

    return {
      id: canceledSubscription.id,
      status: canceledSubscription.status,
      canceledAt: canceledSubscription.canceled_at,
    };
  },
});

/**
 * Get customer portal URL for managing subscriptions
 */
export const createCustomerPortalSession = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.runQuery(api.users.getCurrentUser, {});
    if (!user || !user.stripeCustomerId) {
      throw new Error("User not found or no Stripe customer");
    }

    const stripe = await import("./stripe").then((m) => m.getStripeClient());

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.SITE_URL}/dashboard/settings`,
    });

    return {
      url: session.url,
    };
  },
});
