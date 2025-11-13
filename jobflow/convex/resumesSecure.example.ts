/**
 * Example: Secure Resumes Implementation
 *
 * This file demonstrates how to refactor the resumes.ts file
 * to use the new security module features.
 *
 * Key improvements:
 * - Uses security helpers instead of duplicate authentication code
 * - Adds input validation
 * - Implements rate limiting for AI operations
 * - Adds audit logging
 * - Better error messages
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import {
  getCurrentUser,
  verifyOwnership,
  validateSafeString,
  validateLength,
  validateArray,
  rateLimitByUser,
  RateLimitPresets,
  logDataAccess,
  logAuditEvent,
} from "./security";

// Create a new resume (with security)
export const createSecure = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    jobDescription: v.string(),
    starStoryIds: v.array(v.id("starStories")),
  },
  handler: async (ctx, args) => {
    // Get authenticated user (throws if not authenticated)
    const user = await getCurrentUser(ctx);

    // Rate limit resume creation
    await rateLimitByUser(ctx, {
      maxRequests: 10,
      windowMs: 60 * 60 * 1000, // 10 resumes per hour
    });

    // Validate inputs
    validateSafeString(args.title, 3, 200, "Title");
    validateLength(args.content, 50, 50000, "Content");
    validateLength(args.jobDescription, 10, 10000, "Job Description");
    validateArray(args.starStoryIds, 0, 20, "STAR Stories");

    try {
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

      // Log successful creation
      logDataAccess(user._id, "resume", resumeId, "create", true);

      return resumeId;
    } catch (error) {
      // Log failed creation
      logDataAccess(
        user._id,
        "resume",
        "unknown",
        "create",
        false,
        (error as Error).message
      );
      throw error;
    }
  },
});

// List all resumes for the current user (with security)
export const listSecure = query({
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
    // Get authenticated user
    const user = await getCurrentUser(ctx);

    // Query user's resumes
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

// Get a single resume by ID (with security)
export const getSecure = query({
  args: {
    id: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const user = await getCurrentUser(ctx);

    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Verify ownership (throws if user doesn't own the resume)
    await verifyOwnership(ctx, resume.userId);

    // Log successful access
    logDataAccess(user._id, "resume", args.id, "read", true);

    return resume;
  },
});

// Update a resume (with security)
export const updateSecure = mutation({
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
    // Get authenticated user
    const user = await getCurrentUser(ctx);

    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Verify ownership
    await verifyOwnership(ctx, resume.userId);

    // Validate optional fields
    if (args.title) {
      validateSafeString(args.title, 3, 200, "Title");
    }
    if (args.content) {
      validateLength(args.content, 50, 50000, "Content");
    }
    if (args.jobDescription) {
      validateLength(args.jobDescription, 10, 10000, "Job Description");
    }
    if (args.starStoryIds) {
      validateArray(args.starStoryIds, 0, 20, "STAR Stories");
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...updates } = args;
      await ctx.db.patch(args.id, {
        ...updates,
        updatedAt: Date.now(),
      });

      // Log successful update
      logDataAccess(user._id, "resume", args.id, "update", true);

      return args.id;
    } catch (error) {
      // Log failed update
      logDataAccess(
        user._id,
        "resume",
        args.id,
        "update",
        false,
        (error as Error).message
      );
      throw error;
    }
  },
});

// Generate resume with AI (with security)
export const generateWithAISecure = mutation({
  args: {
    jobDescription: v.string(),
    starStoryIds: v.array(v.id("starStories")),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const user = await getCurrentUser(ctx);

    // Rate limit AI operations (20 per hour)
    await rateLimitByUser(ctx, RateLimitPresets.AI_OPERATIONS);

    // Validate inputs
    validateLength(args.jobDescription, 10, 10000, "Job Description");
    validateArray(args.starStoryIds, 1, 20, "STAR Stories");

    // Verify user owns all the STAR stories and fetch them
    const starStories = [];
    for (const storyId of args.starStoryIds) {
      const story = await ctx.db.get(storyId);
      if (!story) {
        throw new Error(`STAR story ${storyId} not found`);
      }

      // Verify ownership
      await verifyOwnership(ctx, story.userId);
      starStories.push(story);
    }

    try {
      // Call AI action to generate resume
      const resumeContent = await ctx.runAction(api.ai.generateResume, {
        jobDescription: args.jobDescription,
        starStories: starStories.map((s) => ({
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
        title: `AI Resume - ${new Date().toLocaleDateString()}`,
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

      // Log AI resume generation
      logAuditEvent({
        eventType: "data.created",
        userId: user._id,
        resourceType: "resume",
        resourceId: resumeId,
        action: "generate_ai_resume",
        success: true,
        details: {
          starStoryCount: starStories.length,
          atsScore: atsAnalysis.score,
        },
      });

      return resumeId;
    } catch (error) {
      // Log failed AI generation
      logAuditEvent({
        eventType: "data.created",
        userId: user._id,
        resourceType: "resume",
        action: "generate_ai_resume",
        success: false,
        errorMessage: (error as Error).message,
      });
      throw error;
    }
  },
});

// Delete a resume (with security)
export const deleteResumeSecure = mutation({
  args: {
    id: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const user = await getCurrentUser(ctx);

    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Verify ownership
    await verifyOwnership(ctx, resume.userId);

    try {
      await ctx.db.delete(args.id);

      // Log successful deletion
      logDataAccess(user._id, "resume", args.id, "delete", true);

      return { success: true };
    } catch (error) {
      // Log failed deletion
      logDataAccess(
        user._id,
        "resume",
        args.id,
        "delete",
        false,
        (error as Error).message
      );
      throw error;
    }
  },
});

/**
 * MIGRATION GUIDE:
 *
 * To migrate existing code to use these secure versions:
 *
 * 1. Replace authentication boilerplate:
 *    - Remove manual getUserIdentity() and user lookup
 *    - Use getCurrentUser(ctx) instead
 *
 * 2. Add input validation:
 *    - Add validateSafeString, validateLength, etc.
 *    - Validate all user inputs before processing
 *
 * 3. Add rate limiting:
 *    - Add rateLimitByUser() for expensive operations
 *    - Use appropriate presets or custom limits
 *
 * 4. Add audit logging:
 *    - Log all data access (create, read, update, delete)
 *    - Log security events
 *    - Include success/failure status
 *
 * 5. Use RLS helpers:
 *    - Replace manual ownership checks with verifyOwnership()
 *    - Use verifyCoachOwnership() for coach resources
 *
 * 6. Update error handling:
 *    - Catch and log errors
 *    - Provide meaningful error messages
 */
