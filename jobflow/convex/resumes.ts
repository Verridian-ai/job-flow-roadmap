import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

// Create a new resume
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    jobDescription: v.string(),
    starStoryIds: v.array(v.id("starStories")),
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
    const resumeId = await ctx.db.insert("resumes", {
      userId: user._id,
      title: args.title,
      content: args.content,
      jobDescription: args.jobDescription,
      starStoryIds: args.starStoryIds,
      atsScore: 0,
      confidenceScore: 0,
      status: "draft",
      version: 1,
      createdAt: now,
      updatedAt: now,
    });

    return resumeId;
  },
});

// List all resumes for the current user
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("pending_verification"),
        v.literal("verified"),
        v.literal("archived")
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

    if (args.status) {
      return await ctx.db
        .query("resumes")
        .withIndex("by_user_and_status", (q) =>
          q.eq("userId", user._id).eq("status", args.status)
        )
        .collect();
    }

    return await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Get a single resume by ID
export const get = query({
  args: {
    id: v.id("resumes"),
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

    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Row-level security: ensure user owns this resume
    if (resume.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    return resume;
  },
});

// Update a resume
export const update = mutation({
  args: {
    id: v.id("resumes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    starStoryIds: v.optional(v.array(v.id("starStories"))),
    atsScore: v.optional(v.number()),
    confidenceScore: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("pending_verification"),
        v.literal("verified"),
        v.literal("archived")
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

    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Row-level security: ensure user owns this resume
    if (resume.userId !== user._id) {
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

// Generate resume with AI
export const generateWithAI = mutation({
  args: {
    jobDescription: v.string(),
    starStoryIds: v.array(v.id("starStories")),
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

    // Verify user owns all the STAR stories and fetch them
    const starStories = [];
    for (const storyId of args.starStoryIds) {
      const story = await ctx.db.get(storyId);
      if (!story || story.userId !== user._id) {
        throw new Error("Unauthorized access to STAR story");
      }
      starStories.push(story);
    }

    // Call AI action to generate resume
    const resumeContent = await ctx.runAction(api.ai.generateResume, {
      jobDescription: args.jobDescription,
      starStories: starStories.map(s => ({
        title: s.title,
        situation: s.situation,
        task: s.task,
        action: s.action,
        result: s.result,
        skills: s.skills,
      })),
      candidateName: user.name,
      candidateEmail: user.email,
    });

    // Calculate ATS score
    const atsAnalysis = await ctx.runAction(api.ai.calculateATSScore, {
      resumeContent,
      jobDescription: args.jobDescription,
    });

    const now = Date.now();
    const resumeId = await ctx.db.insert("resumes", {
      userId: user._id,
      title: `Resume - ${new Date().toLocaleDateString()}`,
      content: resumeContent,
      jobDescription: args.jobDescription,
      starStoryIds: args.starStoryIds,
      atsScore: atsAnalysis.score || 0,
      confidenceScore: atsAnalysis.score || 0,
      status: "draft",
      version: 1,
      createdAt: now,
      updatedAt: now,
    });

    return {
      resumeId,
      content: resumeContent,
      atsScore: atsAnalysis.score || 0,
      atsAnalysis: atsAnalysis,
    };
  },
});

// Delete a resume
export const deleteResume = mutation({
  args: {
    id: v.id("resumes"),
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

    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Row-level security: ensure user owns this resume
    if (resume.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Aliases for frontend compatibility
export const listByUser = list;
export const generate = generateWithAI;
export const remove = deleteResume;
