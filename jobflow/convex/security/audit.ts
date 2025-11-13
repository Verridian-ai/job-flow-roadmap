/**
 * Security Audit Logging
 * Tracks important security events and user actions
 */

import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./rbac";

export type AuditEventType =
  | "auth.login"
  | "auth.logout"
  | "auth.failed_login"
  | "auth.password_reset"
  | "auth.2fa_enabled"
  | "auth.2fa_disabled"
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "role.changed"
  | "data.accessed"
  | "data.created"
  | "data.updated"
  | "data.deleted"
  | "payment.created"
  | "payment.succeeded"
  | "payment.failed"
  | "security.rate_limit_exceeded"
  | "security.unauthorized_access"
  | "security.suspicious_activity";

export interface AuditLogEntry {
  eventType: AuditEventType;
  userId?: string;
  userName?: string;
  resourceType?: string;
  resourceId?: string;
  action: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  timestamp: number;
}

// In-memory audit log (for development)
// In production, store in database or external logging service
const auditLog: AuditLogEntry[] = [];

/**
 * Log an audit event
 */
export function logAuditEvent(entry: Omit<AuditLogEntry, "timestamp">): void {
  const logEntry: AuditLogEntry = {
    ...entry,
    timestamp: Date.now(),
  };

  auditLog.push(logEntry);

  // In production, send to external logging service
  // For now, just log to console in development
  if (process.env.NODE_ENV !== "production") {
    console.log("[AUDIT]", logEntry);
  }

  // Keep only last 10000 entries in memory
  if (auditLog.length > 10000) {
    auditLog.shift();
  }
}

/**
 * Log authentication event
 */
export function logAuthEvent(
  eventType: Extract<AuditEventType, `auth.${string}`>,
  userId: string | undefined,
  success: boolean,
  details?: Record<string, unknown>
): void {
  logAuditEvent({
    eventType,
    userId,
    action: eventType.replace("auth.", ""),
    success,
    details,
  });
}

/**
 * Log data access event
 */
export function logDataAccess(
  userId: string,
  resourceType: string,
  resourceId: string,
  action: "read" | "create" | "update" | "delete",
  success: boolean,
  errorMessage?: string
): void {
  logAuditEvent({
    eventType: `data.${action === "read" ? "accessed" : action}` as AuditEventType,
    userId,
    resourceType,
    resourceId,
    action,
    success,
    errorMessage,
  });
}

/**
 * Log security event
 */
export function logSecurityEvent(
  eventType: Extract<AuditEventType, `security.${string}`>,
  userId: string | undefined,
  details?: Record<string, unknown>,
  ipAddress?: string
): void {
  logAuditEvent({
    eventType,
    userId,
    action: eventType.replace("security.", ""),
    success: false,
    details,
    ipAddress,
  });
}

/**
 * Log payment event
 */
export function logPaymentEvent(
  eventType: Extract<AuditEventType, `payment.${string}`>,
  userId: string,
  resourceId: string,
  success: boolean,
  details?: Record<string, unknown>
): void {
  logAuditEvent({
    eventType,
    userId,
    resourceType: "payment",
    resourceId,
    action: eventType.replace("payment.", ""),
    success,
    details,
  });
}

/**
 * Get audit logs (admin only)
 */
export const getAuditLogs = mutation({
  args: {
    limit: v.optional(v.number()),
    eventType: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // Only admins can view audit logs
    if (user.role !== "admin") {
      throw new Error("Forbidden: Admin access required");
    }

    let filteredLogs = [...auditLog];

    if (args.eventType) {
      filteredLogs = filteredLogs.filter(
        (log) => log.eventType === args.eventType
      );
    }

    if (args.userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === args.userId);
    }

    const limit = args.limit || 100;
    return filteredLogs.slice(-limit).reverse();
  },
});

/**
 * Clear old audit logs (admin only)
 */
export const clearOldAuditLogs = mutation({
  args: {
    olderThanDays: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // Only admins can clear audit logs
    if (user.role !== "admin") {
      throw new Error("Forbidden: Admin access required");
    }

    const cutoffTime = Date.now() - args.olderThanDays * 24 * 60 * 60 * 1000;
    const beforeCount = auditLog.length;

    // Remove old logs
    for (let i = auditLog.length - 1; i >= 0; i--) {
      if (auditLog[i].timestamp < cutoffTime) {
        auditLog.splice(i, 1);
      }
    }

    const removedCount = beforeCount - auditLog.length;

    logAuditEvent({
      eventType: "data.deleted",
      userId: user._id,
      resourceType: "audit_logs",
      action: "clear_old_logs",
      success: true,
      details: { removedCount, olderThanDays: args.olderThanDays },
    });

    return { removedCount };
  },
});
