# Row-Level Security (RLS) Implementation Guide

## Overview

This implementation provides comprehensive row-level security policies that automatically restrict which data rows users can access based on their identity and role.

## Architecture

### 1. Policy Definitions (`convex/rls.ts`)

Each resource type has three policy methods:
- `canRead`: Determines read access
- `canWrite`: Determines write/update access
- `canDelete`: Determines delete access

### 2. Middleware (`convex/middleware/rlsMiddleware.ts`)

Provides enforcement functions to use in mutations:
- `enforceReadPolicy`: Throws error if read not allowed
- `enforceWritePolicy`: Throws error if write not allowed
- `enforceDeletePolicy`: Throws error if delete not allowed

### 3. Secure Queries (`convex/rls.ts`)

Pre-built queries that automatically filter data:
- `getMyResumes`: Returns only user's resumes
- `getMySessions`: Returns only user's sessions (client or coach)
- `getMyVerificationTasks`: Returns only user's tasks
- `getMyMessages`: Returns only user's messages
- `getMyPayments`: Returns only user's payments

## Resource Policies

### Resume Policies

**Read Access**:
- Owner: Full access
- Admin: Full access
- Coach: Can view `pending_verification` resumes

**Write Access**:
- Owner: Can edit only if status != `verified`
- Admin: Full access
- Coach: Cannot edit

**Delete Access**:
- Owner: Full access
- Admin: Full access

### Session Policies

**Read Access**:
- Client (userId): Full access to their sessions
- Coach (via coachId): Full access to their client sessions
- Admin: Full access

**Write Access**:
- Coach: Can update their sessions
- Admin: Full access

### Verification Task Policies

**Read Access**:
- Creator: Full access
- Assigned Coach: Full access
- Other Coaches: Can view `open` tasks only
- Admin: Full access

**Write Access**:
- Creator: Full access
- Assigned Coach: Full access
- Admin: Full access

### Message Policies

**Read Access**:
- Sender: Can read sent messages
- Receiver: Can read received messages
- Admin: Full access

### Payment Policies

**Read Access**:
- Payer: Can read their payments
- Payee Coach: Can read payments they receive
- Admin: Full access

## Usage Examples

### Basic Mutation with RLS

```typescript
import { mutation } from "./_generated/server";
import { enforceWritePolicy } from "./middleware/rlsMiddleware";
import { v } from "convex/values";

export const updateResume = mutation({
  args: {
    userId: v.id("users"),
    resumeId: v.id("resumes"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Enforce write policy - throws error if not allowed
    await enforceWritePolicy(ctx, args.userId, "resume", args.resumeId);

    // Policy passed - safe to proceed
    await ctx.db.patch(args.resumeId, {
      content: args.content,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
```

### Query with RLS

```typescript
import { query } from "./_generated/server";
import { enforceReadPolicy } from "./middleware/rlsMiddleware";
import { v } from "convex/values";

export const getResume = query({
  args: {
    userId: v.id("users"),
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    // Enforce read policy - throws error if not allowed
    await enforceReadPolicy(ctx, args.userId, "resume", args.resumeId);

    // Policy passed - safe to return data
    const resume = await ctx.db.get(args.resumeId);
    return resume;
  },
});
```

### Using Secure Query Helpers

```typescript
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function MyResumes({ userId }) {
  // Automatically filters to only user's resumes
  const resumes = useQuery(api.rls.getMyResumes, { userId });

  return (
    <div>
      {resumes?.map(resume => (
        <div key={resume._id}>{resume.title}</div>
      ))}
    </div>
  );
}
```

### Manual Policy Validation

```typescript
import { validatePolicy } from "./rls";

export const customMutation = mutation({
  args: { userId: v.id("users"), resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    // Check policy without throwing
    const policy = await validatePolicy(
      ctx,
      args.userId,
      "resume",
      args.resumeId,
      "write"
    );

    if (!policy.allowed) {
      return {
        success: false,
        message: `Access denied: ${policy.reason}`
      };
    }

    // Proceed with operation
    // ...
  },
});
```

## Best Practices

### 1. Always Enforce Policies in Mutations

Every mutation that modifies data should enforce RLS:

```typescript
// ✅ GOOD
export const updateData = mutation({
  handler: async (ctx, args) => {
    await enforceWritePolicy(ctx, args.userId, "resource", args.id);
    // ... perform update
  }
});

// ❌ BAD - No policy check!
export const updateData = mutation({
  handler: async (ctx, args) => {
    // Directly updating without checking
    await ctx.db.patch(args.id, { ... });
  }
});
```

### 2. Use Secure Query Helpers

Instead of manually filtering, use the provided helpers:

```typescript
// ✅ GOOD
const resumes = await ctx.db.query(api.rls.getMyResumes, { userId });

// ❌ BAD - Missing policy enforcement
const resumes = await ctx.db
  .query("resumes")
  .withIndex("by_user", q => q.eq("userId", userId))
  .collect();
```

### 3. Check Policies Before Expensive Operations

Validate access before performing expensive operations:

```typescript
export const generateReport = mutation({
  handler: async (ctx, args) => {
    // Check access first
    await enforceReadPolicy(ctx, args.userId, "data", args.dataId);

    // Then perform expensive operation
    const report = await generateExpensiveReport(args.dataId);
    return report;
  }
});
```

### 4. Handle Policy Errors Gracefully

```typescript
try {
  await enforceReadPolicy(ctx, userId, "resume", resumeId);
  // Access granted
} catch (error) {
  // Access denied - handle gracefully
  return {
    error: "You don't have permission to view this resume",
    code: "FORBIDDEN"
  };
}
```

## Testing RLS Policies

### Unit Test Example

```typescript
import { test } from "convex-test";
import { resumePolicies } from "./rls";

test("Resume owner can read their resume", async () => {
  const userId = "user123";
  const resume = { userId, _id: "resume123", ... };

  const result = await resumePolicies.canRead(ctx, userId, resume);
  expect(result.allowed).toBe(true);
  expect(result.reason).toBe("owner");
});

test("Non-owner cannot read resume", async () => {
  const userId = "user123";
  const otherUserId = "user456";
  const resume = { userId, _id: "resume123", ... };

  const result = await resumePolicies.canRead(ctx, otherUserId, resume);
  expect(result.allowed).toBe(false);
});
```

## Security Considerations

### 1. Client-Side Validation is NOT Security

Always enforce policies on the server:

```typescript
// ❌ BAD - Client check only
if (userId === resume.userId) {
  // This can be bypassed!
  updateResume(resumeId);
}

// ✅ GOOD - Server-side enforcement
export const updateResume = mutation({
  handler: async (ctx, args) => {
    await enforceWritePolicy(ctx, args.userId, "resume", args.resumeId);
    // Server validates - secure!
  }
});
```

### 2. Don't Trust Client Input

Always validate resource ownership on the server:

```typescript
// ❌ BAD - Trusting client
export const updateResume = mutation({
  args: { userId: v.id("users"), ... },
  handler: async (ctx, args) => {
    // Using userId from client - can be spoofed!
    const resume = await ctx.db.get(args.resumeId);
    if (resume.userId === args.userId) { ... }
  }
});

// ✅ GOOD - Validating on server
export const updateResume = mutation({
  handler: async (ctx, args) => {
    // Get authenticated user from session
    const user = await getAuthenticatedUser(ctx);
    await enforceWritePolicy(ctx, user._id, "resume", args.resumeId);
  }
});
```

### 3. Admin Override Pattern

Admins need special handling:

```typescript
export const updateResource = mutation({
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    // Admin can bypass normal policies
    if (user.role !== "admin") {
      await enforceWritePolicy(ctx, args.userId, "resource", args.id);
    }

    // Proceed with operation
  }
});
```

## Troubleshooting

### "Access denied: not_owner"
- User is trying to access a resource they don't own
- Check if userId matches resource.userId

### "Access denied: insufficient_role"
- User's role doesn't have permission
- Verify user.role and required role

### "Access denied: no_access"
- Generic access denial
- Check all policy conditions

### "Access denied: resume_verified"
- Trying to edit a verified resume
- Only unverified resumes can be edited by owners

## Performance Considerations

### 1. Index Usage

RLS policies use database indices for efficient queries:

```typescript
// Efficient - uses index
await ctx.db
  .query("resumes")
  .withIndex("by_user", q => q.eq("userId", userId))
  .collect();
```

### 2. Batch Operations

For bulk operations, check policies once per batch:

```typescript
// Check policy once
await enforceWritePolicy(ctx, userId, "resume", resumeId);

// Then perform multiple operations
await ctx.db.patch(resumeId, { title: "New" });
await ctx.db.patch(resumeId, { content: "..." });
```

### 3. Caching Policy Results

For repeated checks, cache the result:

```typescript
const policyCache = new Map();

async function checkWithCache(userId, resourceId) {
  const key = `${userId}:${resourceId}`;
  if (policyCache.has(key)) {
    return policyCache.get(key);
  }

  const result = await validatePolicy(...);
  policyCache.set(key, result);
  return result;
}
```

## Migration Guide

To add RLS to existing mutations:

1. Import enforcement functions
2. Add userId parameter
3. Add enforcement call before operation
4. Test with different users

```typescript
// Before
export const updateData = mutation({
  args: { id: v.id("data"), value: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { value: args.value });
  }
});

// After
export const updateData = mutation({
  args: {
    userId: v.id("users"),  // Added
    id: v.id("data"),
    value: v.string()
  },
  handler: async (ctx, args) => {
    // Added policy check
    await enforceWritePolicy(ctx, args.userId, "data", args.id);
    await ctx.db.patch(args.id, { value: args.value });
  }
});
```
