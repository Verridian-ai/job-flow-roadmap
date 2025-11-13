import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new coaching session
export const create = mutation({
  args: {
    coachId: v.id("coaches"),
    scheduledTime: v.number(),
    duration: v.number(),
    meetingUrl: v.optional(v.string()),
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

    // Verify coach exists
    const coach = await ctx.db.get(args.coachId);
    if (!coach) {
      throw new Error("Coach not found");
    }

    const now = Date.now();
    const sessionId = await ctx.db.insert("sessions", {
      userId: user._id,
      coachId: args.coachId,
      scheduledTime: args.scheduledTime,
      duration: args.duration,
      status: "scheduled",
      meetingUrl: args.meetingUrl,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    return sessionId;
  },
});

// List all sessions for the current user (as job seeker or coach)
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("scheduled"),
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("no_show")
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

    // If user is a coach, get their coach profile
    let coachProfile = null;
    if (user.role === "coach") {
      coachProfile = await ctx.db
        .query("coaches")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();
    }

    // Get sessions as job seeker
    const userSessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Get sessions as coach
    let coachSessions = [];
    if (coachProfile) {
      coachSessions = await ctx.db
        .query("sessions")
        .withIndex("by_coach", (q) => q.eq("coachId", coachProfile._id))
        .collect();
    }

    // Combine and deduplicate
    const allSessions = [...userSessions, ...coachSessions];

    // Filter by status if provided
    if (args.status) {
      return allSessions.filter((session) => session.status === args.status);
    }

    return allSessions;
  },
});

// Update a session
export const update = mutation({
  args: {
    id: v.id("sessions"),
    scheduledTime: v.optional(v.number()),
    duration: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("scheduled"),
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("no_show")
      )
    ),
    meetingUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
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

    const session = await ctx.db.get(args.id);
    if (!session) {
      throw new Error("Session not found");
    }

    // Check if user is either the session owner or the coach
    let isAuthorized = session.userId === user._id;

    if (!isAuthorized && user.role === "coach") {
      const coachProfile = await ctx.db
        .query("coaches")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();

      if (coachProfile && session.coachId === coachProfile._id) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new Error("Unauthorized");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...updates } = args;
    await ctx.db.patch(args.id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});
