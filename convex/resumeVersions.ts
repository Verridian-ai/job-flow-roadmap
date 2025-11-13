import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List all versions for a resume
export const listByResume = query({
  args: {
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Verify user owns the resume
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user || resume.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    // For now, return mock versions since the schema doesn't have resumeVersions table
    // In production, you would query the resumeVersions table
    return [
      {
        _id: "version1" as any,
        resumeId: args.resumeId,
        versionNumber: 1,
        content: resume.content,
        title: resume.title,
        atsScore: resume.atsScore,
        createdAt: resume.createdAt,
      },
    ];
  },
});

// Create a new version (called on save)
export const createVersion = mutation({
  args: {
    resumeId: v.id("resumes"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // In production, would create a new version entry
    // For now, just update the resume
    await ctx.db.patch(args.resumeId, {
      content: args.content,
      version: (resume.version || 1) + 1,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Restore a previous version
export const restore = mutation({
  args: {
    versionId: v.id("resumes"), // In production, would be resumeVersions
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // In production, would get version content and create new version
    await ctx.db.patch(args.resumeId, {
      version: (resume.version || 1) + 1,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete a version
export const deleteVersion = mutation({
  args: {
    versionId: v.id("resumes"), // In production, would be resumeVersions
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // In production, would delete the version
    return { success: true };
  },
});

// Tag a version
export const tagVersion = mutation({
  args: {
    versionId: v.id("resumes"), // In production, would be resumeVersions
    tag: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // In production, would update version with tag
    return { success: true };
  },
});

// Duplicate a version as new resume
export const duplicate = mutation({
  args: {
    versionId: v.id("resumes"), // In production, would be resumeVersions
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

    // Get original resume
    const original = await ctx.db.get(args.versionId);
    if (!original) {
      throw new Error("Resume not found");
    }

    // Create duplicate
    const now = Date.now();
    const newResumeId = await ctx.db.insert("resumes", {
      userId: user._id,
      title: `${original.title} (Copy)`,
      content: original.content,
      jobDescription: original.jobDescription,
      starStoryIds: original.starStoryIds,
      atsScore: original.atsScore,
      confidenceScore: original.confidenceScore,
      status: "draft",
      version: 1,
      createdAt: now,
      updatedAt: now,
    });

    return newResumeId;
  },
});
