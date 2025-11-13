# Job Flow Platform - Database Schema Documentation

## Overview

This document provides comprehensive documentation for the Job Flow platform's Convex database schema. The schema supports a multi-sided marketplace connecting job seekers with career coaches for resume review, interview preparation, and career guidance.

## Table of Contents

1. [Schema Structure](#schema-structure)
2. [Table Definitions](#table-definitions)
3. [Indexes and Performance](#indexes-and-performance)
4. [Data Validation](#data-validation)
5. [Best Practices](#best-practices)

---

## Schema Structure

The schema consists of 15 tables organized into 6 functional areas:

### 1. Users & Authentication (2 tables)
- **users**: Core user profiles and authentication
- **auditLogs**: Security audit trail

### 2. STAR Stories & Resumes (2 tables)
- **starStories**: User-created career accomplishment stories
- **resumes**: AI-generated, ATS-optimized resumes

### 3. Job Tracking & Applications (2 tables)
- **jobs**: Saved job postings
- **applications**: Application tracking with interview notes

### 4. Coaches & Sessions (2 tables)
- **coaches**: Coach profiles with credentials and availability
- **sessions**: Coaching session scheduling and tracking

### 5. Marketplace & Verification (2 tables)
- **verificationTasks**: Resume review marketplace tasks
- **bids**: Coach bids on verification tasks

### 6. Reviews, Payments & Messaging (5 tables)
- **reviews**: Coach reviews and ratings
- **payments**: Payment transactions with Stripe
- **subscriptions**: User subscription plans
- **messages**: Direct messaging between users
- **notifications**: System notifications

---

## Table Definitions

### 1. Users & Authentication

#### users

Core user profiles with authentication, preferences, and privacy settings.

**Fields:**
- `email` (string): User's email address (unique identifier)
- `name` (string): User's full name
- `role` (union): User role - "job_seeker", "coach", or "admin"
- `authId` (string): External authentication provider ID (WorkOS/Clerk)
- `emailVerified` (boolean): Email verification status
- `profilePhoto` (optional string): Profile picture URL
- `bio` (optional string): User biography
- `phone` (optional string): Contact phone number
- `location` (optional string): User location
- `twoFactorEnabled` (boolean): 2FA security setting
- `lastLoginAt` (optional number): Last login timestamp
- `loginCount` (optional number): Total login count
- `privacySettings` (object): Privacy preferences
  - `profileVisible` (boolean)
  - `emailVisible` (boolean)
  - `phoneVisible` (boolean)
- `notificationPreferences` (object): Notification settings
  - `email` (boolean)
  - `push` (boolean)
  - `sms` (boolean)
- `createdAt` (number): Account creation timestamp
- `updatedAt` (number): Last update timestamp

**Indexes:**
- `by_auth_id`: Fast lookup by authentication ID
- `by_email`: Fast lookup by email
- `by_role`: Filter users by role
- `by_created_at`: Sort by registration date

**Search Index:**
- `search_users`: Search by name with filters for role and email verification

**Usage:**
```typescript
// Query user by authId
const user = await ctx.db
  .query("users")
  .withIndex("by_auth_id", (q) => q.eq("authId", authId))
  .unique();

// Search users by name
const users = await ctx.db
  .query("users")
  .withSearchIndex("search_users", (q) =>
    q.search("name", searchTerm)
     .eq("role", "coach")
  );
```

---

#### auditLogs

Security audit trail for tracking sensitive operations and compliance.

**Fields:**
- `userId` (id): Reference to users table
- `action` (string): Action type (e.g., "login", "profile_update")
- `resource` (string): Resource type (e.g., "user", "payment")
- `resourceId` (optional string): Specific resource identifier
- `metadata` (optional any): Additional context data
- `ipAddress` (optional string): User's IP address
- `userAgent` (optional string): Browser/client information
- `createdAt` (number): Log timestamp

**Indexes:**
- `by_user`: All logs for a specific user
- `by_action`: Filter by action type
- `by_resource`: Filter by resource type
- `by_created_at`: Sort by time
- `by_user_and_action`: Composite index for user-specific action queries

**Usage:**
```typescript
// Log a user action
await ctx.db.insert("auditLogs", {
  userId: user._id,
  action: "password_reset",
  resource: "user",
  resourceId: user._id,
  ipAddress: request.ip,
  userAgent: request.userAgent,
  createdAt: Date.now(),
});

// Query user's recent activity
const recentActivity = await ctx.db
  .query("auditLogs")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .order("desc")
  .take(20);
```

---

### 2. STAR Stories & Resumes

#### starStories

User-created stories using the STAR (Situation, Task, Action, Result) framework for documenting career accomplishments.

**Fields:**
- `userId` (id): Reference to users table
- `title` (string): Story title
- `situation` (string): Background context
- `task` (string): Objective or challenge
- `action` (string): Actions taken
- `result` (string): Outcomes achieved
- `skills` (array[string]): Associated skills
- `category` (string): Story category
- `metrics` (optional object): Quantifiable metrics
  - `quantifiable` (boolean): Has measurable outcomes
  - `impactLevel` (string): "low", "medium", or "high"
  - `timeframe` (optional string): Duration or timeframe
- `isPublic` (optional boolean): Share with coaches
- `createdAt` (number): Creation timestamp
- `updatedAt` (number): Last update timestamp

**Indexes:**
- `by_user`: All stories for a user
- `by_user_and_category`: User's stories by category
- `by_category`: Filter by category
- `by_created_at`: Sort by creation date

**Search Index:**
- `search_stories`: Search by title with filters for user, category, and skills

**Usage:**
```typescript
// Create a new STAR story
const storyId = await ctx.db.insert("starStories", {
  userId: user._id,
  title: "Led cross-functional team to launch new product",
  situation: "Company needed to enter new market segment...",
  task: "Lead team of 5 to deliver MVP in 3 months...",
  action: "Implemented agile methodology, conducted user research...",
  result: "Launched on time, acquired 10K users in first month...",
  skills: ["Leadership", "Product Management", "Agile"],
  category: "leadership",
  metrics: {
    quantifiable: true,
    impactLevel: "high",
    timeframe: "3 months",
  },
  isPublic: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// Search stories by skill
const leadershipStories = await ctx.db
  .query("starStories")
  .withSearchIndex("search_stories", (q) =>
    q.search("title", "leadership")
     .eq("userId", userId)
  );
```

---

#### resumes

AI-generated resumes with ATS scoring, verification status, and version control.

**Fields:**
- `userId` (id): Reference to users table
- `title` (string): Resume title/name
- `content` (string): Full resume content (HTML/Markdown)
- `jobDescription` (string): Job description used for tailoring
- `starStoryIds` (array[id]): Associated STAR stories
- `atsScore` (number): ATS compatibility score (0-100)
- `confidenceScore` (number): AI confidence level
- `improvements` (optional array[string]): Suggested improvements
- `keywords` (optional array[string]): Extracted keywords
- `status` (union): Resume status
  - "draft", "pending_verification", "verified", "archived"
- `version` (number): Version number
- `templateId` (optional string): Template identifier
- `formatting` (optional object): Formatting preferences
  - `font` (string)
  - `fontSize` (number)
  - `colorScheme` (string)
- `createdAt` (number): Creation timestamp
- `updatedAt` (number): Last update timestamp

**Indexes:**
- `by_user`: All resumes for a user
- `by_status`: Filter by status
- `by_user_and_status`: User's resumes by status
- `by_ats_score`: Sort by ATS score
- `by_created_at`: Sort by creation date

**Search Index:**
- `search_resumes`: Search by title with filters for user and status

**Usage:**
```typescript
// Get user's verified resumes
const verifiedResumes = await ctx.db
  .query("resumes")
  .withIndex("by_user_and_status", (q) =>
    q.eq("userId", userId).eq("status", "verified")
  )
  .collect();

// Find high-scoring resumes
const topResumes = await ctx.db
  .query("resumes")
  .withIndex("by_ats_score")
  .order("desc")
  .filter((q) => q.gt(q.field("atsScore"), 80))
  .take(10);
```

---

### 3. Job Tracking & Applications

#### jobs

Saved job postings from various sources with tracking and notes.

**Fields:**
- `userId` (id): Reference to users table
- `title` (string): Job title
- `company` (string): Company name
- `location` (string): Job location
- `jobUrl` (optional string): Job posting URL
- `description` (string): Job description
- `salary` (optional string): Salary information
- `status` (union): Application status
  - "saved", "applied", "interviewing", "offered", "rejected", "accepted"
- `source` (union): Job source
  - "manual", "linkedin", "indeed", "glassdoor", "other"
- `appliedDate` (optional number): Application date
- `notes` (optional string): User notes
- `priority` (optional number): Priority rating (1-5)
- `tags` (optional array[string]): Custom tags
- `salaryMin` (optional number): Minimum salary
- `salaryMax` (optional number): Maximum salary
- `salaryCurrency` (optional string): Currency code
- `createdAt` (number): Creation timestamp
- `updatedAt` (number): Last update timestamp

**Indexes:**
- `by_user`: All jobs for a user
- `by_status`: Filter by status
- `by_user_and_status`: User's jobs by status
- `by_company`: Filter by company
- `by_created_at`: Sort by creation date
- `by_applied_date`: Sort by application date

**Search Index:**
- `search_jobs`: Search by title with filters for user, status, and company

---

#### applications

Detailed application tracking with interview scheduling and follow-ups.

**Fields:**
- `userId` (id): Reference to users table
- `jobId` (id): Reference to jobs table
- `resumeId` (optional id): Reference to resumes table
- `coverLetter` (optional string): Cover letter content
- `status` (union): Application status
  - "pending", "submitted", "reviewed", "interviewing", "offered", "rejected", "accepted", "withdrawn"
- `appliedDate` (number): Application submission date
- `followUpDate` (optional number): Follow-up reminder date
- `responseDate` (optional number): Employer response date
- `interviewDates` (optional array[number]): Interview timestamps
- `interviewNotes` (optional array[string]): Interview notes
- `notes` (optional string): General notes
- `documents` (optional array[string]): Document URLs
- `contacts` (optional array[object]): Contact information
  - `name` (string)
  - `email` (optional string)
  - `role` (optional string)
- `createdAt` (number): Creation timestamp
- `updatedAt` (number): Last update timestamp

**Indexes:**
- `by_user`: All applications for a user
- `by_job`: Applications for a specific job
- `by_status`: Filter by status
- `by_user_and_status`: User's applications by status
- `by_applied_date`: Sort by application date
- `by_follow_up_date`: Sort by follow-up date

---

### 4. Coaches & Sessions

#### coaches

Coach profiles with expertise, credentials, availability, and performance metrics.

**Fields:**
- `userId` (id): Reference to users table
- `specialty` (array[string]): Areas of expertise
- `industries` (array[string]): Industry experience
- `experience` (string): Experience description
- `yearsOfExperience` (optional number): Years of experience
- `certifications` (array[object]): Professional certifications
- `portfolio` (array[object]): Portfolio items
- `hourlyRate` (number): Hourly rate
- `availability` (array[object]): Weekly availability schedule
- `timezone` (optional string): Timezone
- `rating` (number): Average rating (0-5)
- `reviewCount` (number): Total reviews
- `completedSessions` (optional number): Sessions completed
- `responseTime` (optional number): Average response time (minutes)
- `verificationStatus` (union): Verification status
  - "pending", "approved", "rejected", "suspended"
- `stripeAccountId` (optional string): Stripe Connect account ID
- `payoutEnabled` (optional boolean): Payout capability
- `isAcceptingClients` (optional boolean): Currently accepting clients
- `maxClientsPerWeek` (optional number): Client capacity
- `createdAt` (number): Profile creation timestamp
- `updatedAt` (number): Last update timestamp

**Indexes:**
- `by_user`: Coach by user ID
- `by_verification_status`: Filter by verification status
- `by_rating`: Sort by rating
- `by_created_at`: Sort by join date
- `by_specialty`: Filter by specialty

**Search Index:**
- `search_coaches`: Search by experience with filters

---

#### sessions

Coaching sessions with scheduling, status tracking, and outcomes.

**Fields:**
- `userId` (id): Client reference
- `coachId` (id): Coach reference
- `scheduledTime` (number): Session timestamp
- `duration` (number): Duration in minutes
- `status` (union): Session status
  - "scheduled", "completed", "cancelled", "no_show", "rescheduled"
- `sessionType` (optional string): Type of session
- `meetingUrl` (optional string): Video call URL
- `notes` (optional string): Session notes
- `recordingUrl` (optional string): Recording URL
- `coachNotes` (optional string): Coach's private notes
- `actionItems` (optional array[string]): Follow-up action items
- `rating` (optional number): Session rating
- `price` (optional number): Session price
- `paymentId` (optional id): Payment reference
- `createdAt` (number): Booking timestamp
- `updatedAt` (number): Last update timestamp

**Indexes:**
- `by_user`: User's sessions
- `by_coach`: Coach's sessions
- `by_status`: Filter by status
- `by_scheduled_time`: Sort by session time
- `by_user_and_status`: User's sessions by status
- `by_coach_and_status`: Coach's sessions by status

---

### 5. Marketplace & Verification

#### verificationTasks

Marketplace tasks for resume review and verification with bidding system.

**Fields:**
- `resumeId` (id): Resume to be reviewed
- `userId` (id): Task creator
- `taskType` (union): Type of review
  - "resume_review_quick", "resume_review_full", "cover_letter_review", "linkedin_profile_review"
- `urgency` (union): Urgency level
  - "urgent" (24 hours), "standard" (2-3 days), "flexible" (1 week)
- `suggestedPrice` (number): Initial price suggestion
- `finalPrice` (optional number): Accepted bid price
- `status` (union): Task status
  - "open", "bidding", "assigned", "in_progress", "review", "completed", "disputed", "cancelled"
- `assignedCoachId` (optional id): Assigned coach
- `description` (optional string): Task description
- `requirements` (optional array[string]): Specific requirements
- `deliverables` (optional array[string]): Expected deliverables
- `completedAt` (optional number): Completion timestamp
- `feedback` (optional string): Client feedback
- `deliveredFiles` (optional array[string]): Delivered file URLs
- `qaStatus` (optional union): Quality assurance status
  - "pending", "approved", "needs_revision"
- `qaFeedback` (optional string): QA feedback
- `createdAt` (number): Task creation timestamp
- `updatedAt` (number): Last update timestamp

**Indexes:**
- `by_status`: Filter by status
- `by_user`: User's tasks
- `by_coach`: Coach's tasks
- `by_urgency`: Filter by urgency
- `by_created_at`: Sort by creation date
- `by_status_and_urgency`: Composite index for task board

---

#### bids

Coach bids on verification tasks in the marketplace.

**Fields:**
- `taskId` (id): Task reference
- `coachId` (id): Bidding coach
- `price` (number): Bid amount
- `estimatedTime` (number): Estimated hours
- `message` (optional string): Proposal message
- `status` (union): Bid status
  - "pending", "accepted", "rejected", "withdrawn"
- `deliveryDate` (optional number): Proposed delivery date
- `qualifications` (optional array[string]): Relevant qualifications
- `createdAt` (number): Bid submission timestamp
- `updatedAt` (optional number): Last update timestamp

**Indexes:**
- `by_task`: Bids for a task
- `by_coach`: Coach's bids
- `by_status`: Filter by status
- `by_task_and_status`: Task's bids by status
- `by_price`: Sort by price

---

### 6. Reviews, Payments & Messaging

#### reviews

User reviews and ratings for coaches after sessions or task completion.

**Fields:**
- `userId` (id): Reviewer
- `coachId` (id): Reviewed coach
- `taskId` (optional id): Related task
- `sessionId` (optional id): Related session
- `rating` (number): Overall rating (1-5)
- `comment` (optional string): Review text
- `detailedRatings` (optional object): Detailed ratings
  - `professionalism` (number)
  - `communication` (number)
  - `expertise` (number)
  - `value` (number)
- `isVerified` (optional boolean): Verified purchase
- `helpfulCount` (optional number): Helpful votes
- `coachResponse` (optional string): Coach's response
- `coachResponseDate` (optional number): Response timestamp
- `createdAt` (number): Review timestamp
- `updatedAt` (optional number): Last update timestamp

**Indexes:**
- `by_coach`: Coach's reviews
- `by_user`: User's reviews
- `by_rating`: Filter by rating
- `by_coach_and_rating`: Coach's reviews by rating
- `by_created_at`: Sort by date

---

#### payments

All payment transactions with Stripe integration and coach payouts.

**Fields:**
- `userId` (id): Payer
- `amount` (number): Payment amount
- `currency` (string): Currency code (ISO 4217)
- `type` (union): Payment type
  - "verification", "session", "subscription", "refund"
- `status` (union): Payment status
  - "pending", "processing", "succeeded", "failed", "refunded", "cancelled"
- `stripePaymentIntentId` (optional string): Stripe Payment Intent ID
- `stripeChargeId` (optional string): Stripe Charge ID
- `stripeRefundId` (optional string): Stripe Refund ID
- `taskId` (optional id): Related task
- `sessionId` (optional id): Related session
- `subscriptionId` (optional id): Related subscription
- `coachId` (optional id): Coach to be paid
- `platformFee` (optional number): Platform commission
- `coachPayout` (optional number): Coach's portion
- `payoutStatus` (optional union): Payout status
  - "pending", "paid", "failed"
- `errorMessage` (optional string): Error details
- `metadata` (optional any): Additional data
- `createdAt` (number): Payment timestamp
- `updatedAt` (optional number): Last update timestamp

**Indexes:**
- `by_user`: User's payments
- `by_status`: Filter by status
- `by_type`: Filter by type
- `by_coach`: Coach's payouts
- `by_stripe_payment_intent`: Lookup by Stripe ID
- `by_created_at`: Sort by date
- `by_user_and_status`: User's payments by status

---

#### subscriptions

User subscription plans with Stripe billing integration.

**Fields:**
- `userId` (id): Subscriber
- `plan` (union): Subscription plan
  - "free", "premium", "pro", "enterprise"
- `status` (union): Subscription status
  - "active", "cancelled", "expired", "past_due", "paused"
- `stripeSubscriptionId` (optional string): Stripe Subscription ID
- `stripeCustomerId` (optional string): Stripe Customer ID
- `stripePriceId` (optional string): Stripe Price ID
- `currentPeriodStart` (number): Billing period start
- `currentPeriodEnd` (number): Billing period end
- `cancelAt` (optional number): Scheduled cancellation
- `cancelledAt` (optional number): Actual cancellation
- `features` (optional object): Plan features
  - `maxResumes` (number)
  - `maxStarStories` (number)
  - `aiGenerationsPerMonth` (number)
  - `prioritySupport` (boolean)
- `trialStart` (optional number): Trial start date
- `trialEnd` (optional number): Trial end date
- `createdAt` (number): Subscription start
- `updatedAt` (number): Last update timestamp

**Indexes:**
- `by_user`: User's subscription
- `by_status`: Filter by status
- `by_plan`: Filter by plan
- `by_stripe_subscription`: Lookup by Stripe ID
- `by_current_period_end`: Sort by renewal date

---

#### messages

Direct messaging between users and coaches with threading support.

**Fields:**
- `senderId` (id): Message sender
- `receiverId` (id): Message recipient
- `content` (string): Message content
- `messageType` (optional union): Message type
  - "text", "file", "system"
- `read` (boolean): Read status
- `readAt` (optional number): Read timestamp
- `fileUrl` (optional string): Attachment URL
- `fileName` (optional string): Attachment filename
- `fileSize` (optional number): Attachment size
- `taskId` (optional id): Related task
- `sessionId` (optional id): Related session
- `threadId` (optional string): Thread identifier
- `replyToId` (optional id): Reply reference
- `flagged` (optional boolean): Flagged for moderation
- `flagReason` (optional string): Flag reason
- `createdAt` (number): Message timestamp
- `updatedAt` (optional number): Last update timestamp

**Indexes:**
- `by_sender`: Sender's messages
- `by_receiver`: Receiver's messages
- `by_conversation`: Conversation between two users
- `by_thread`: Thread messages
- `by_created_at`: Sort by date
- `by_read_status`: Unread messages

---

#### notifications

System notifications for users with multi-channel delivery.

**Fields:**
- `userId` (id): Notification recipient
- `title` (string): Notification title
- `message` (string): Notification content
- `type` (union): Notification type
  - "application", "session", "payment", "message", "review", "system"
- `priority` (union): Priority level
  - "low", "medium", "high", "urgent"
- `read` (boolean): Read status
- `readAt` (optional number): Read timestamp
- `actionUrl` (optional string): Action link
- `actionText` (optional string): Action button text
- `relatedId` (optional string): Related resource ID
- `relatedType` (optional string): Related resource type
- `emailSent` (optional boolean): Email delivery status
- `pushSent` (optional boolean): Push notification status
- `smsSent` (optional boolean): SMS delivery status
- `createdAt` (number): Creation timestamp
- `expiresAt` (optional number): Expiration timestamp

**Indexes:**
- `by_user`: User's notifications
- `by_type`: Filter by type
- `by_read_status`: Unread notifications
- `by_priority`: Filter by priority
- `by_created_at`: Sort by date
- `by_expires_at`: Sort by expiration

---

## Indexes and Performance

### Index Strategy

1. **Primary Indexes**: Every table has indexes on frequently queried fields
2. **Composite Indexes**: Combined indexes for common query patterns
3. **Search Indexes**: Full-text search on text fields with filters
4. **Timestamp Indexes**: Efficient sorting and filtering by date

### Query Optimization Tips

```typescript
// Use specific indexes for better performance
const recentJobs = await ctx.db
  .query("jobs")
  .withIndex("by_user_and_status", (q) =>
    q.eq("userId", userId).eq("status", "applied")
  )
  .order("desc")
  .take(10);

// Use search indexes for text search
const searchResults = await ctx.db
  .query("coaches")
  .withSearchIndex("search_coaches", (q) =>
    q.search("experience", searchTerm)
     .eq("verificationStatus", "approved")
  );

// Filter after index lookup for additional conditions
const highPriorityJobs = await ctx.db
  .query("jobs")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .filter((q) => q.gte(q.field("priority"), 4))
  .collect();
```

---

## Data Validation

### Field Validation Rules

1. **Email**: Must be valid email format
2. **Ratings**: Must be between 0-5 (or 1-5 for reviews)
3. **ATS Score**: Must be between 0-100
4. **Currency**: Must be valid ISO 4217 code
5. **Timestamps**: Must be Unix timestamps (milliseconds)
6. **IDs**: Must be valid Convex document IDs

### Status Transitions

```typescript
// Application status flow
pending → submitted → reviewed → interviewing → offered → accepted/rejected

// Task status flow
open → bidding → assigned → in_progress → review → completed

// Payment status flow
pending → processing → succeeded/failed/refunded
```

---

## Best Practices

### 1. Always Use Timestamps

```typescript
// Always include timestamps
await ctx.db.insert("users", {
  ...userData,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// Update the updatedAt field
await ctx.db.patch(userId, {
  ...updates,
  updatedAt: Date.now(),
});
```

### 2. Maintain Data Consistency

```typescript
// Update related records atomically
await ctx.db.patch(taskId, { status: "completed", completedAt: Date.now() });
await ctx.db.insert("payments", { taskId, status: "succeeded", ... });
await ctx.db.insert("notifications", { userId, type: "task_completed", ... });
```

### 3. Use Proper Indexing

```typescript
// Query using appropriate indexes
const unreadMessages = await ctx.db
  .query("messages")
  .withIndex("by_read_status", (q) =>
    q.eq("receiverId", userId).eq("read", false)
  );
```

### 4. Implement Soft Deletes

```typescript
// Use status fields instead of deleting
await ctx.db.patch(resumeId, {
  status: "archived",
  updatedAt: Date.now()
});
```

### 5. Audit Sensitive Operations

```typescript
// Log important actions
await ctx.db.insert("auditLogs", {
  userId,
  action: "payment_processed",
  resource: "payment",
  resourceId: paymentId,
  metadata: { amount, currency },
  createdAt: Date.now(),
});
```

---

## Migration and Versioning

### Schema Changes

When modifying the schema:

1. Add new optional fields first
2. Migrate existing data
3. Make fields required if needed
4. Remove deprecated fields last

### Example Migration

```typescript
// Add new field as optional
await ctx.db.patch(userId, {
  timezone: "America/New_York", // optional field
  updatedAt: Date.now(),
});

// After all records updated, make it required in schema
```

---

## Security Considerations

### Row-Level Security

Implement in queries:

```typescript
// Only return user's own data
const myResumes = await ctx.db
  .query("resumes")
  .withIndex("by_user", (q) => q.eq("userId", currentUserId))
  .collect();

// Coaches only see assigned tasks
const myTasks = await ctx.db
  .query("verificationTasks")
  .withIndex("by_coach", (q) => q.eq("assignedCoachId", coachId))
  .collect();
```

### PII Protection

- Never log PII in audit logs
- Encrypt sensitive fields if needed
- Implement proper access controls
- Follow GDPR compliance requirements

---

## Performance Monitoring

### Key Metrics to Track

1. Query response times
2. Index usage statistics
3. Database size growth
4. Most frequent queries
5. Slow query identification

### Optimization Strategies

1. Add indexes for frequent queries
2. Use pagination for large result sets
3. Implement caching where appropriate
4. Archive old data regularly
5. Monitor and optimize search queries

---

## Support and Resources

- Convex Documentation: https://docs.convex.dev/
- Schema Design Best Practices: https://docs.convex.dev/database/schemas
- Query Optimization: https://docs.convex.dev/database/reading-data
- Full-Text Search: https://docs.convex.dev/text-search

---

**Last Updated**: 2025-11-13
**Schema Version**: 1.0.0
**Agent**: Agent-5 (Infrastructure)
