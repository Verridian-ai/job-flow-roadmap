/**
 * AI Convex Actions
 * Convex action wrappers for AI service
 */

import { action } from "../_generated/server";
import { v } from "convex/values";
import { aiService } from "./service";

/**
 * Generate resume with AI
 */
export const generateResume = action({
  args: {
    jobDescription: v.string(),
    starStories: v.array(
      v.object({
        title: v.string(),
        situation: v.string(),
        task: v.string(),
        action: v.string(),
        result: v.string(),
        skills: v.array(v.string()),
      })
    ),
    candidateName: v.string(),
    candidateEmail: v.string(),
  },
  handler: async (ctx, args) => {
    return await aiService.generateResume(args);
  },
});

/**
 * Extract STAR story from user input
 */
export const extractStarStory = action({
  args: {
    userInput: v.string(),
  },
  handler: async (ctx, args) => {
    return await aiService.extractStarStory(args.userInput);
  },
});

/**
 * Calculate ATS score
 */
export const calculateATSScore = action({
  args: {
    resumeContent: v.string(),
    jobDescription: v.string(),
  },
  handler: async (ctx, args) => {
    return await aiService.calculateATSScore(
      args.resumeContent,
      args.jobDescription
    );
  },
});

/**
 * Generate cover letter
 */
export const generateCoverLetter = action({
  args: {
    jobDescription: v.string(),
    resumeContent: v.string(),
    companyName: v.string(),
    positionTitle: v.string(),
  },
  handler: async (ctx, args) => {
    return await aiService.generateCoverLetter(args);
  },
});

/**
 * Generate interview questions
 */
export const generateInterviewQuestions = action({
  args: {
    jobDescription: v.string(),
    resumeContent: v.string(),
  },
  handler: async (ctx, args) => {
    return await aiService.generateInterviewQuestions(
      args.jobDescription,
      args.resumeContent
    );
  },
});

/**
 * Get AI usage statistics
 */
export const getUsageStats = action({
  args: {},
  handler: async (ctx) => {
    return aiService.getUsageStats();
  },
});

/**
 * Get AI cache statistics
 */
export const getCacheStats = action({
  args: {},
  handler: async (ctx) => {
    return aiService.getCacheStats();
  },
});

/**
 * Clear AI cache (admin only)
 */
export const clearCache = action({
  args: {},
  handler: async (ctx) => {
    aiService.clearCache();
    return { success: true };
  },
});
