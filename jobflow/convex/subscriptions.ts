/**
 * Subscription Management
 * Handles user subscriptions and plans
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a new subscription
 */
export const create = mutation({
  args: {
    userId: v.id("users"),
    plan: v.union(
      v.literal("free"),
      v.literal("premium"),
      v.literal("pro")
    ),
    stripeSubscriptionId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if user already has an active subscription
    const existingSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (existingSubscription) {
      throw new Error("User already has an active subscription");
    }

    const subscriptionId = await ctx.db.insert("subscriptions", {
      userId: args.userId,
      plan: args.plan,
      status: "active",
      stripeSubscriptionId: args.stripeSubscriptionId,
      currentPeriodStart: args.currentPeriodStart || now,
      currentPeriodEnd: args.currentPeriodEnd || now + 30 * 24 * 60 * 60 * 1000, // 30 days
      createdAt: now,
      updatedAt: now,
    });

    return subscriptionId;
  },
});

/**
 * Get user's current subscription
 */
export const getCurrent = query({
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

    if (!user) {
      throw new Error("User not found");
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();

    return subscription;
  },
});

/**
 * Get subscription by ID
 */
export const get = query({
  args: {
    id: v.id("subscriptions"),
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

    const subscription = await ctx.db.get(args.id);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    // Verify user owns this subscription
    if (subscription.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    return subscription;
  },
});

/**
 * List all subscriptions for current user
 */
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("cancelled"),
        v.literal("expired")
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

    let subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    if (args.status) {
      subscriptions = subscriptions.filter((sub) => sub.status === args.status);
    }

    return subscriptions;
  },
});

/**
 * Update subscription status
 */
export const updateStatus = mutation({
  args: {
    id: v.id("subscriptions"),
    status: v.union(
      v.literal("active"),
      v.literal("cancelled"),
      v.literal("expired")
    ),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db.get(args.id);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * Update subscription details
 */
export const update = mutation({
  args: {
    id: v.id("subscriptions"),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("cancelled"),
        v.literal("expired")
      )
    ),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db.get(args.id);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.currentPeriodStart !== undefined) {
      updates.currentPeriodStart = args.currentPeriodStart;
    }

    if (args.currentPeriodEnd !== undefined) {
      updates.currentPeriodEnd = args.currentPeriodEnd;
    }

    if (args.status !== undefined) {
      updates.status = args.status;
    }

    await ctx.db.patch(args.id, updates);

    return args.id;
  },
});

/**
 * Check if user has active subscription
 */
export const hasActiveSubscription = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) {
      return false;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    return !!subscription;
  },
});

/**
 * Get subscription features by plan
 */
export const getFeatures = query({
  args: {
    plan: v.union(
      v.literal("free"),
      v.literal("premium"),
      v.literal("pro")
    ),
  },
  handler: async (ctx, args) => {
    const features = {
      free: {
        resumes: 3,
        aiGenerations: 5,
        jobTracking: 10,
        atsScores: true,
        starStories: 10,
        templates: 1,
        support: "community",
      },
      premium: {
        resumes: 10,
        aiGenerations: 50,
        jobTracking: 100,
        atsScores: true,
        starStories: 50,
        templates: 5,
        support: "email",
        coaching: "discount",
      },
      pro: {
        resumes: "unlimited",
        aiGenerations: "unlimited",
        jobTracking: "unlimited",
        atsScores: true,
        starStories: "unlimited",
        templates: "all",
        support: "priority",
        coaching: "included",
        marketplace: "priority",
      },
    };

    return features[args.plan];
  },
});

/**
 * Check if user can access a feature
 */
export const canAccessFeature = query({
  args: {
    feature: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) {
      return false;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    const plan = subscription?.plan || "free";

    // Define feature access by plan
    const featureAccess: Record<string, string[]> = {
      ai_resume_generation: ["free", "premium", "pro"],
      unlimited_resumes: ["pro"],
      priority_support: ["pro"],
      coaching_discount: ["premium", "pro"],
      marketplace_priority: ["pro"],
      advanced_analytics: ["premium", "pro"],
    };

    const allowedPlans = featureAccess[args.feature] || [];
    return allowedPlans.includes(plan);
  },
});
