# Security Module Documentation

This security module provides comprehensive protection for the JobFlow application. It includes Role-Based Access Control (RBAC), Row-Level Security (RLS), input validation, rate limiting, CSRF protection, audit logging, and security headers.

## Table of Contents

1. [RBAC (Role-Based Access Control)](#rbac)
2. [RLS (Row-Level Security)](#rls)
3. [Input Validation](#input-validation)
4. [Rate Limiting](#rate-limiting)
5. [CSRF Protection](#csrf-protection)
6. [Audit Logging](#audit-logging)
7. [Security Headers](#security-headers)
8. [Best Practices](#best-practices)

---

## RBAC (Role-Based Access Control)

### Overview
RBAC provides role-based authorization for Convex functions. The system supports three roles:
- `job_seeker`: Regular users looking for jobs
- `coach`: Career coaches offering services
- `admin`: System administrators

### Usage Examples

#### Get Current User
```typescript
import { getCurrentUser } from "./security";

export const myQuery = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    // User is authenticated and contains role information
  },
});
```

#### Require Specific Role
```typescript
import { requireRole, requireAdmin, requireCoach } from "./security";

export const adminOnlyAction = mutation({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    // Only admins can execute this code
  },
});

export const coachAction = mutation({
  handler: async (ctx) => {
    await requireCoach(ctx);
    // Only coaches and admins can execute this code
  },
});

export const multiRoleAction = mutation({
  handler: async (ctx) => {
    await requireRole(ctx, ["coach", "admin"]);
    // Multiple roles allowed
  },
});
```

#### Check Ownership
```typescript
import { requireOwnerOrAdmin } from "./security";

export const updateResource = mutation({
  args: { resourceId: v.id("resources") },
  handler: async (ctx, args) => {
    const resource = await ctx.db.get(args.resourceId);
    await requireOwnerOrAdmin(ctx, resource.userId);
    // Only owner or admin can proceed
  },
});
```

---

## RLS (Row-Level Security)

### Overview
RLS ensures users can only access their own data, preventing unauthorized data access.

### Usage Examples

#### Verify Ownership
```typescript
import { verifyOwnership } from "./security";

export const getMyResume = query({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) throw new Error("Resume not found");

    await verifyOwnership(ctx, resume.userId);
    return resume;
  },
});
```

#### Filter Results by User
```typescript
import { filterByUser } from "./security";

export const listResources = query({
  handler: async (ctx) => {
    const allResources = await ctx.db.query("resources").collect();
    return await filterByUser(ctx, allResources);
  },
});
```

#### Verify Conversation Access
```typescript
import { verifyConversationAccess } from "./security";

export const getMessage = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    await verifyConversationAccess(ctx, message.senderId, message.receiverId);
    return message;
  },
});
```

---

## Input Validation

### Overview
Comprehensive input validation to prevent XSS, SQL injection, and invalid data.

### Usage Examples

#### Basic Validation
```typescript
import {
  validateEmail,
  validatePhone,
  validateUrl,
  validateLength,
  validateRequired,
} from "./security";

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    validateEmail(args.email);
    validateLength(args.name, 2, 100, "Name");

    if (args.phone) {
      validatePhone(args.phone);
    }

    // Proceed with creation
  },
});
```

#### Safe String Validation
```typescript
import { validateSafeString } from "./security";

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Validates length, no HTML, and no SQL injection patterns
    validateSafeString(args.title, 5, 200, "Title");
    validateSafeString(args.content, 10, 10000, "Content");

    // Safe to proceed
  },
});
```

#### Rating and Price Validation
```typescript
import { validateRating, validatePrice } from "./security";

export const createReview = mutation({
  args: {
    rating: v.number(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    validateRating(args.rating); // 1-5, integer
    validatePrice(args.price, "Session Price");

    // Proceed with creation
  },
});
```

---

## Rate Limiting

### Overview
Prevents abuse by limiting the number of requests per time window.

### Usage Examples

#### Rate Limit by User
```typescript
import { rateLimitByUser, RateLimitPresets } from "./security";

export const sendMessage = mutation({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    // Limit to 50 requests per minute
    await rateLimitByUser(ctx, RateLimitPresets.STANDARD);

    // Proceed with sending message
  },
});
```

#### AI Operations Rate Limiting
```typescript
import { rateLimitByUser, RateLimitPresets } from "./security";

export const generateResume = mutation({
  args: { jobDescription: v.string() },
  handler: async (ctx, args) => {
    // Limit AI operations to 20 per hour
    await rateLimitByUser(ctx, RateLimitPresets.AI_OPERATIONS);

    // Call AI service
  },
});
```

#### Custom Rate Limit
```typescript
import { rateLimitByUser } from "./security";

export const customAction = mutation({
  handler: async (ctx) => {
    await rateLimitByUser(ctx, {
      maxRequests: 5,
      windowMs: 60 * 1000, // 5 requests per minute
    });

    // Proceed
  },
});
```

### Available Presets
- `STRICT`: 10 requests per minute
- `STANDARD`: 50 requests per minute
- `RELAXED`: 100 requests per minute
- `AUTH`: 5 attempts per 15 minutes
- `UPLOAD`: 10 uploads per hour
- `AI_OPERATIONS`: 20 requests per hour
- `PAYMENT`: 10 per hour

---

## CSRF Protection

### Overview
Protects against Cross-Site Request Forgery attacks on state-changing operations.

### Usage Examples

#### Generate CSRF Token
```typescript
import { generateCsrfToken, getSessionId } from "./security";

export const getCsrfToken = query({
  handler: async (ctx) => {
    const sessionId = await getSessionId(ctx);
    return generateCsrfToken(sessionId);
  },
});
```

#### Verify CSRF Token
```typescript
import { requireCsrfToken, getSessionId } from "./security";

export const sensitiveAction = mutation({
  args: {
    csrfToken: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const sessionId = await getSessionId(ctx);
    requireCsrfToken(sessionId, args.csrfToken);

    // Safe to proceed with sensitive operation
  },
});
```

---

## Audit Logging

### Overview
Tracks security events and user actions for compliance and debugging.

### Usage Examples

#### Log Authentication Events
```typescript
import { logAuthEvent } from "./security";

export const login = mutation({
  handler: async (ctx) => {
    // ... authentication logic

    logAuthEvent("auth.login", user._id, true);
  },
});
```

#### Log Data Access
```typescript
import { logDataAccess } from "./security";

export const getResource = query({
  args: { resourceId: v.id("resources") },
  handler: async (ctx, args) => {
    try {
      const resource = await ctx.db.get(args.resourceId);
      const user = await getCurrentUser(ctx);

      logDataAccess(
        user._id,
        "resource",
        args.resourceId,
        "read",
        true
      );

      return resource;
    } catch (error) {
      logDataAccess(
        user._id,
        "resource",
        args.resourceId,
        "read",
        false,
        error.message
      );
      throw error;
    }
  },
});
```

#### Log Security Events
```typescript
import { logSecurityEvent } from "./security";

export const detectSuspiciousActivity = mutation({
  handler: async (ctx) => {
    logSecurityEvent(
      "security.suspicious_activity",
      user._id,
      { reason: "Multiple failed login attempts" }
    );
  },
});
```

---

## Security Headers

### Overview
Provides HTTP security headers to protect against common web vulnerabilities.

### Vite Configuration

Add to your `vite.config.ts`:

```typescript
import { getSecurityHeaders } from "./convex/security";

export default defineConfig({
  server: {
    headers: getSecurityHeaders(),
  },
});
```

### Headers Included
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-Frame-Options`: Prevents clickjacking
- `X-XSS-Protection`: Enables XSS filter
- `Strict-Transport-Security`: Enforces HTTPS
- `Content-Security-Policy`: Controls resource loading
- `Referrer-Policy`: Controls referrer information
- `Permissions-Policy`: Restricts browser features

---

## Best Practices

### 1. Always Authenticate First
```typescript
// Good
export const myMutation = mutation({
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    // User is authenticated
  },
});

// Bad - no authentication
export const badMutation = mutation({
  handler: async (ctx, args) => {
    // Anyone can call this
  },
});
```

### 2. Validate All User Input
```typescript
// Good
export const createPost = mutation({
  args: { title: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    validateSafeString(args.title, 5, 200, "Title");
    validateSafeString(args.content, 10, 5000, "Content");
    // Safe to proceed
  },
});
```

### 3. Use Rate Limiting for Expensive Operations
```typescript
// Good - AI operations are rate limited
export const generateContent = mutation({
  handler: async (ctx, args) => {
    await rateLimitByUser(ctx, RateLimitPresets.AI_OPERATIONS);
    // Call expensive AI service
  },
});
```

### 4. Log Security Events
```typescript
// Good - track important events
export const deleteAccount = mutation({
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    await ctx.db.delete(user._id);

    logAuditEvent({
      eventType: "user.deleted",
      userId: user._id,
      action: "delete_account",
      success: true,
    });
  },
});
```

### 5. Always Verify Ownership
```typescript
// Good - verify ownership before updates
export const updateResource = mutation({
  args: { resourceId: v.id("resources") },
  handler: async (ctx, args) => {
    const resource = await ctx.db.get(args.resourceId);
    await verifyOwnership(ctx, resource.userId);
    // Only owner can update
  },
});
```

### 6. Use CSRF Protection for Sensitive Actions
```typescript
// Good - require CSRF token for sensitive operations
export const deleteAllData = mutation({
  args: { csrfToken: v.string() },
  handler: async (ctx, args) => {
    const sessionId = await getSessionId(ctx);
    requireCsrfToken(sessionId, args.csrfToken);
    // Safe to proceed with destructive action
  },
});
```

---

## Integration Checklist

- [ ] Add RBAC checks to all authenticated endpoints
- [ ] Validate all user input
- [ ] Apply rate limiting to expensive operations
- [ ] Add CSRF protection to sensitive mutations
- [ ] Log security events and data access
- [ ] Configure security headers in Vite
- [ ] Test role permissions
- [ ] Test ownership verification
- [ ] Test rate limiting
- [ ] Review audit logs regularly

---

## Security Contacts

For security issues or questions:
- Create a security issue in the repository
- Contact the security team
- Review security audit logs regularly

---

## License

Part of the JobFlow application security infrastructure.
