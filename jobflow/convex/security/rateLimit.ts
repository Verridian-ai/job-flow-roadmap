/**
 * Rate Limiting Implementation
 * Provides rate limiting functionality to prevent abuse
 */

import { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { DataModel } from "../_generated/dataModel";

export type Context = GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>;

// In-memory rate limit store (for development)
// In production, use a distributed cache like Redis
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix?: string;
}

/**
 * Check rate limit for a given key
 * @throws Error if rate limit is exceeded
 */
export function checkRateLimit(key: string, config: RateLimitConfig): void {
  const now = Date.now();
  const storeKey = `${config.keyPrefix || "rl"}:${key}`;
  const record = rateLimitStore.get(storeKey);

  // Clean up expired records
  if (record && record.resetTime < now) {
    rateLimitStore.delete(storeKey);
  }

  // Check current rate limit
  const currentRecord = rateLimitStore.get(storeKey);

  if (!currentRecord) {
    // First request in the window
    rateLimitStore.set(storeKey, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return;
  }

  if (currentRecord.count >= config.maxRequests) {
    const retryAfter = Math.ceil((currentRecord.resetTime - now) / 1000);
    throw new Error(
      `Rate limit exceeded. Try again in ${retryAfter} seconds.`
    );
  }

  // Increment count
  currentRecord.count++;
  rateLimitStore.set(storeKey, currentRecord);
}

/**
 * Rate limit by user ID
 */
export async function rateLimitByUser(
  ctx: Context,
  config: RateLimitConfig
): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }

  checkRateLimit(identity.subject, config);
}

/**
 * Rate limit by IP address (requires IP from context)
 */
export function rateLimitByIp(ip: string, config: RateLimitConfig): void {
  checkRateLimit(ip, config);
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  // Strict: 10 requests per minute
  STRICT: {
    maxRequests: 10,
    windowMs: 60 * 1000,
  },
  // Standard: 50 requests per minute
  STANDARD: {
    maxRequests: 50,
    windowMs: 60 * 1000,
  },
  // Relaxed: 100 requests per minute
  RELAXED: {
    maxRequests: 100,
    windowMs: 60 * 1000,
  },
  // Authentication: 5 attempts per 15 minutes
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  },
  // File upload: 10 uploads per hour
  UPLOAD: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
  },
  // AI operations: 20 requests per hour
  AI_OPERATIONS: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000,
  },
  // Payment operations: 10 per hour
  PAYMENT: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
  },
} as const;

/**
 * Clean up expired rate limit records
 * Should be called periodically
 */
export function cleanupExpiredRecords(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanupExpiredRecords, 5 * 60 * 1000);
