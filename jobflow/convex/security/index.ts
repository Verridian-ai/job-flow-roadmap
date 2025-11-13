/**
 * Security Module - Central Export
 *
 * Provides comprehensive security features:
 * - RBAC (Role-Based Access Control)
 * - RLS (Row-Level Security)
 * - Input Validation
 * - Rate Limiting
 * - CSRF Protection
 * - Audit Logging
 * - Security Headers
 */

// RBAC exports
export {
  getCurrentUser,
  requireRole,
  requireAdmin,
  requireCoach,
  requireOwnerOrAdmin,
  requireEmailVerified,
  hasRole,
  isAuthenticated,
  type Role,
  type QueryContext,
  type MutationContext,
} from "./rbac";

// RLS exports
export {
  filterByUser,
  verifyOwnership,
  verifyCoachOwnership,
  verifyConversationAccess,
  getCurrentUserId,
  isOwner,
} from "./rls";

// Validation exports
export {
  validateEmail,
  validatePhone,
  validateUrl,
  validateLength,
  validateRequired,
  validateRange,
  validateRating,
  validatePrice,
  validateArray,
  validateEnum,
  validateNoHtml,
  validateNoSqlInjection,
  validateSafeString,
  validateFileUpload,
  validateFutureDate,
  validatePastDate,
  type FileValidationOptions,
} from "./validation";

// Rate limiting exports
export {
  checkRateLimit,
  rateLimitByUser,
  rateLimitByIp,
  cleanupExpiredRecords,
  RateLimitPresets,
  type RateLimitConfig,
} from "./rateLimit";

// CSRF protection exports
export {
  generateCsrfToken,
  verifyCsrfToken,
  refreshCsrfToken,
  revokeCsrfToken,
  requireCsrfToken,
  getSessionId,
} from "./csrf";

// Audit logging exports
export {
  logAuditEvent,
  logAuthEvent,
  logDataAccess,
  logSecurityEvent,
  logPaymentEvent,
  getAuditLogs,
  clearOldAuditLogs,
  type AuditEventType,
  type AuditLogEntry,
} from "./audit";

// Security headers exports
export {
  getSecurityHeaders,
  getCorsHeaders,
  isAllowedOrigin,
  generateCspNonce,
  viteSecurityHeaders,
  type SecurityHeaders,
} from "./headers";
