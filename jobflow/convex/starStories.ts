import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

// Create a new STAR story
export const create = mutation({
  args: {
    title: v.string(),
    situation: v.string(),
    task: v.string(),
    action: v.string(),
    result: v.string(),
    skills: v.array(v.string()),
    category: v.string(),
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

    const now = Date.now();
    const storyId = await ctx.db.insert("starStories", {
      userId: user._id,
      title: args.title,
      situation: args.situation,
      task: args.task,
      action: args.action,
      result: args.result,
      skills: args.skills,
      category: args.category,
      createdAt: now,
      updatedAt: now,
    });

    return storyId;
  },
});

// List all STAR stories for the current user
export const list = query({
  args: {
    category: v.optional(v.string()),
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

    if (args.category) {
      return await ctx.db
        .query("starStories")
        .withIndex("by_user_and_category", (q) =>
          q.eq("userId", user._id).eq("category", args.category)
        )
        .collect();
    }

    return await ctx.db
      .query("starStories")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Get a single STAR story by ID
export const get = query({
  args: {
    id: v.id("starStories"),
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

    const story = await ctx.db.get(args.id);
    if (!story) {
      throw new Error("Story not found");
    }

    // Row-level security: ensure user owns this story
    if (story.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    return story;
  },
});

// Update a STAR story
export const update = mutation({
  args: {
    id: v.id("starStories"),
    title: v.optional(v.string()),
    situation: v.optional(v.string()),
    task: v.optional(v.string()),
    action: v.optional(v.string()),
    result: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
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

    const story = await ctx.db.get(args.id);
    if (!story) {
      throw new Error("Story not found");
    }

    // Row-level security: ensure user owns this story
    if (story.userId !== user._id) {
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

// Delete a STAR story
export const deleteStory = mutation({
  args: {
    id: v.id("starStories"),
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

    const story = await ctx.db.get(args.id);
    if (!story) {
      throw new Error("Story not found");
    }

    // Row-level security: ensure user owns this story
    if (story.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Score STAR story with AI
export const scoreWithAI = mutation({
  args: {
    id: v.id("starStories"),
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

    const story = await ctx.db.get(args.id);
    if (!story) {
      throw new Error("Story not found");
    }

    // Row-level security: ensure user owns this story
    if (story.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    // Call AI action to score the story
    const scoring = await ctx.runAction(api.ai.scoreStarStory, {
      title: story.title,
      situation: story.situation,
      task: story.task,
      action: story.action,
      result: story.result,
      skills: story.skills,
    });

    // Update story with AI scores
    await ctx.db.patch(args.id, {
      qualityScore: scoring.qualityScore,
      completenessScore: scoring.completenessScore,
      impactScore: scoring.impactScore,
      clarityScore: scoring.clarityScore,
      aiSuggestions: scoring.suggestions,
      updatedAt: Date.now(),
    });

    return scoring;
  },
});

// Duplicate a STAR story
export const duplicate = mutation({
  args: {
    id: v.id("starStories"),
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

    const story = await ctx.db.get(args.id);
    if (!story) {
      throw new Error("Story not found");
    }

    // Row-level security: ensure user owns this story
    if (story.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    const now = Date.now();
    const newStoryId = await ctx.db.insert("starStories", {
      userId: user._id,
      title: `${story.title} (Copy)`,
      situation: story.situation,
      task: story.task,
      action: story.action,
      result: story.result,
      skills: story.skills,
      category: story.category,
      createdAt: now,
      updatedAt: now,
    });

    return newStoryId;
  },
});

// Aliases for frontend compatibility
export const listByUser = list;
export const remove = deleteStory;
