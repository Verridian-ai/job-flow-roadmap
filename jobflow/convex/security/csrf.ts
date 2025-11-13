/**
 * CSRF Protection
 * Provides Cross-Site Request Forgery protection for state-changing operations
 */

import { GenericMutationCtx } from "convex/server";
import { DataModel } from "../_generated/dataModel";

export type MutationContext = GenericMutationCtx<DataModel>;

// In-memory CSRF token store (for development)
// In production, store in session or Redis
const csrfTokenStore = new Map<
  string,
  { token: string; expiresAt: number; used: boolean }
>();

/**
 * Generate a CSRF token for a user session
 */
export function generateCsrfToken(sessionId: string): string {
  const token = generateRandomToken();
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

  csrfTokenStore.set(sessionId, {
    token,
    expiresAt,
    used: false,
  });

  // Clean up expired tokens
  cleanupExpiredTokens();

  return token;
}

/**
 * Verify a CSRF token
 */
export function verifyCsrfToken(sessionId: string, token: string): boolean {
  const stored = csrfTokenStore.get(sessionId);

  if (!stored) {
    return false;
  }

  // Check if token is expired
  if (stored.expiresAt < Date.now()) {
    csrfTokenStore.delete(sessionId);
    return false;
  }

  // Check if token matches
  if (stored.token !== token) {
    return false;
  }

  // Check if token was already used (optional, for one-time tokens)
  // Comment out if you want reusable tokens within the expiry period
  if (stored.used) {
    return false;
  }

  // Mark token as used
  stored.used = true;
  csrfTokenStore.set(sessionId, stored);

  return true;
}

/**
 * Refresh a CSRF token
 */
export function refreshCsrfToken(sessionId: string): string {
  csrfTokenStore.delete(sessionId);
  return generateCsrfToken(sessionId);
}

/**
 * Revoke a CSRF token
 */
export function revokeCsrfToken(sessionId: string): void {
  csrfTokenStore.delete(sessionId);
}

/**
 * Generate a random token
 */
function generateRandomToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Clean up expired CSRF tokens
 */
function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [sessionId, data] of csrfTokenStore.entries()) {
    if (data.expiresAt < now) {
      csrfTokenStore.delete(sessionId);
    }
  }
}

/**
 * Middleware to verify CSRF token in mutations
 */
export function requireCsrfToken(sessionId: string, token: string | undefined): void {
  if (!token) {
    throw new Error("CSRF token is required");
  }

  if (!verifyCsrfToken(sessionId, token)) {
    throw new Error("Invalid or expired CSRF token");
  }
}

/**
 * Extract session ID from authentication identity
 */
export async function getSessionId(ctx: MutationContext): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: No authentication token provided");
  }

  // Use a hash of the subject as session ID
  return identity.subject;
}

// Cleanup expired tokens every 10 minutes
setInterval(cleanupExpiredTokens, 10 * 60 * 1000);
