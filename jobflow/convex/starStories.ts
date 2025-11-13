import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

// Bulk delete multiple STAR stories
export const bulkDelete = mutation({
  args: {
    ids: v.array(v.id("starStories")),
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

    // Verify all stories belong to user before deleting
    for (const id of args.ids) {
      const story = await ctx.db.get(id);
      if (!story || story.userId !== user._id) {
        throw new Error("Unauthorized: Cannot delete story that doesn't belong to you");
      }
    }

    // Delete all stories
    for (const id of args.ids) {
      await ctx.db.delete(id);
    }

    return { deleted: args.ids.length };
  },
});

// Export all stories for a user (for backup/import purposes)
export const exportAll = query({
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

    const stories = await ctx.db
      .query("starStories")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return stories;
  },
});

// Import stories from exported JSON
export const importStories = mutation({
  args: {
    stories: v.array(v.object({
      title: v.string(),
      situation: v.string(),
      task: v.string(),
      action: v.string(),
      result: v.string(),
      skills: v.array(v.string()),
      category: v.string(),
    })),
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
    const importedIds = [];

    for (const story of args.stories) {
      const storyId = await ctx.db.insert("starStories", {
        userId: user._id,
        title: story.title,
        situation: story.situation,
        task: story.task,
        action: story.action,
        result: story.result,
        skills: story.skills,
        category: story.category,
        createdAt: now,
        updatedAt: now,
      });
      importedIds.push(storyId);
    }

    return { imported: importedIds.length, ids: importedIds };
  },
});

// Get unique categories for filtering
export const getCategories = query({
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

    const stories = await ctx.db
      .query("starStories")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const categories = new Set(stories.map(s => s.category));
    return Array.from(categories).filter(Boolean);
  },
});

// Get statistics about stories
export const getStats = query({
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

    const stories = await ctx.db
      .query("starStories")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const categoryCounts: Record<string, number> = {};
    const allSkills: string[] = [];

    stories.forEach(story => {
      categoryCounts[story.category] = (categoryCounts[story.category] || 0) + 1;
      allSkills.push(...story.skills);
    });

    const skillCounts: Record<string, number> = {};
    allSkills.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });

    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    return {
      total: stories.length,
      byCategory: categoryCounts,
      topSkills,
    };
  },
});

// Aliases for frontend compatibility
export const listByUser = list;
export const remove = deleteStory;
