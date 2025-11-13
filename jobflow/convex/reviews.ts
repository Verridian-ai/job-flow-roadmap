import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a review for a coach
export const create = mutation({
  args: {
    coachId: v.id("coaches"),
    taskId: v.optional(v.id("verificationTasks")),
    sessionId: v.optional(v.id("sessions")),
    rating: v.number(),
    comment: v.optional(v.string()),
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

    // Verify coach exists
    const coach = await ctx.db.get(args.coachId);
    if (!coach) {
      throw new Error("Coach not found");
    }

    // Verify rating is between 1 and 5
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Verify user has completed a task or session with this coach
    let hasInteraction = false;

    if (args.taskId) {
      const task = await ctx.db.get(args.taskId);
      if (
        task &&
        task.userId === user._id &&
        task.assignedCoachId === args.coachId &&
        task.status === "completed"
      ) {
        hasInteraction = true;
      }
    }

    if (args.sessionId && !hasInteraction) {
      const session = await ctx.db.get(args.sessionId);
      if (
        session &&
        session.userId === user._id &&
        session.coachId === args.coachId &&
        session.status === "completed"
      ) {
        hasInteraction = true;
      }
    }

    if (!hasInteraction) {
      throw new Error(
        "You must complete a task or session with this coach before reviewing"
      );
    }

    // Check if user already reviewed this task/session
    if (args.taskId) {
      const existingReview = await ctx.db
        .query("reviews")
        .filter((q) =>
          q.and(
            q.eq(q.field("userId"), user._id),
            q.eq(q.field("taskId"), args.taskId)
          )
        )
        .first();

      if (existingReview) {
        throw new Error("You have already reviewed this task");
      }
    }

    if (args.sessionId) {
      const existingReview = await ctx.db
        .query("reviews")
        .filter((q) =>
          q.and(
            q.eq(q.field("userId"), user._id),
            q.eq(q.field("sessionId"), args.sessionId)
          )
        )
        .first();

      if (existingReview) {
        throw new Error("You have already reviewed this session");
      }
    }

    const now = Date.now();
    const reviewId = await ctx.db.insert("reviews", {
      userId: user._id,
      coachId: args.coachId,
      taskId: args.taskId,
      sessionId: args.sessionId,
      rating: args.rating,
      comment: args.comment,
      createdAt: now,
    });

    // Update coach rating and review count
    const allReviews = await ctx.db
      .query("reviews")
      .withIndex("by_coach", (q) => q.eq("coachId", args.coachId))
      .collect();

    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;

    await ctx.db.patch(args.coachId, {
      rating: averageRating,
      reviewCount: allReviews.length,
      updatedAt: now,
    });

    return reviewId;
  },
});

// List reviews by coach
export const listByCoach = query({
  args: {
    coachId: v.id("coaches"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_coach", (q) => q.eq("coachId", args.coachId))
      .collect();
  },
});

// List reviews by user
export const listByUser = query({
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

    return await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});
