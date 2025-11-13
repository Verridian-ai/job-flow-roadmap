import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Job Flow Platform - Complete Convex Database Schema
 *
 * This schema defines all 13 tables for the Job Flow platform:
 * - User management and authentication
 * - STAR stories and resume generation
 * - Job tracking and applications
 * - Coach marketplace and sessions
 * - Payments and subscriptions
 * - Messaging and reviews
 *
 * All tables include:
 * - Proper indexing for performance
 * - Search indexes where applicable
 * - Validation through typed schemas
 * - Timestamps for audit trails
 */

export default defineSchema({
  // ========================================
  // USERS & AUTHENTICATION
  // ========================================

  /**
   * Users Table
   * Core user profiles with authentication, preferences, and privacy settings
   * Supports three roles: job_seeker, coach, and admin
   */
  users: defineTable({
    // Authentication & Identity
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("job_seeker"), v.literal("coach"), v.literal("admin")),
    authId: v.string(), // WorkOS or Clerk authentication ID
    emailVerified: v.boolean(),

    // Profile Information
    profilePhoto: v.optional(v.string()),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),

    // Security Settings
    twoFactorEnabled: v.boolean(),
    lastLoginAt: v.optional(v.number()),
    loginCount: v.optional(v.number()),

    // Privacy Settings
    privacySettings: v.object({
      profileVisible: v.boolean(),
      emailVisible: v.boolean(),
      phoneVisible: v.boolean(),
    }),

    // Notification Preferences
    notificationPreferences: v.object({
      email: v.boolean(),
      push: v.boolean(),
      sms: v.boolean(),
    }),

    // Audit Fields
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_auth_id", ["authId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_created_at", ["createdAt"])
    .searchIndex("search_users", {
      searchField: "name",
      filterFields: ["role", "emailVerified"],
    }),

  /**
   * Audit Logs Table
   * Security audit trail for sensitive operations
   */
  auditLogs: defineTable({
    userId: v.id("users"),
    action: v.string(), // e.g., "login", "profile_update", "password_reset"
    resource: v.string(), // e.g., "user", "resume", "payment"
    resourceId: v.optional(v.string()),
    metadata: v.optional(v.any()), // Additional context data
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_action", ["action"])
    .index("by_resource", ["resource"])
    .index("by_created_at", ["createdAt"])
    .index("by_user_and_action", ["userId", "action"]),

  // ========================================
  // STAR STORIES & RESUMES
  // ========================================

  /**
   * STAR Stories Table
   * User-created stories using the STAR (Situation, Task, Action, Result) framework
   */
  starStories: defineTable({
    userId: v.id("users"),
    title: v.string(),
    situation: v.string(),
    task: v.string(),
    action: v.string(),
    result: v.string(),
    skills: v.array(v.string()),
    category: v.string(), // e.g., "leadership", "technical", "problem-solving"
    metrics: v.optional(v.object({
      quantifiable: v.boolean(),
      impactLevel: v.string(), // "low", "medium", "high"
      timeframe: v.optional(v.string()),
    })),
    isPublic: v.optional(v.boolean()), // Allow sharing with coaches
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "category"])
    .index("by_category", ["category"])
    .index("by_created_at", ["createdAt"])
    .searchIndex("search_stories", {
      searchField: "title",
      filterFields: ["userId", "category", "skills"],
    }),

  /**
   * Resumes Table
   * AI-generated resumes with ATS scoring and verification status
   */
  resumes: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(), // Full resume content (HTML or Markdown)
    jobDescription: v.string(), // Job description used for tailoring
    starStoryIds: v.array(v.id("starStories")),

    // AI Analysis
    atsScore: v.number(), // 0-100
    confidenceScore: v.number(), // AI confidence in the resume
    improvements: v.optional(v.array(v.string())), // Suggested improvements
    keywords: v.optional(v.array(v.string())), // Extracted keywords

    // Verification & Status
    status: v.union(
      v.literal("draft"),
      v.literal("pending_verification"),
      v.literal("verified"),
      v.literal("archived")
    ),
    version: v.number(),

    // Template & Formatting
    templateId: v.optional(v.string()),
    formatting: v.optional(v.object({
      font: v.string(),
      fontSize: v.number(),
      colorScheme: v.string(),
    })),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_ats_score", ["atsScore"])
    .index("by_created_at", ["createdAt"])
    .searchIndex("search_resumes", {
      searchField: "title",
      filterFields: ["userId", "status"],
    }),

  // ========================================
  // JOB TRACKING & APPLICATIONS
  // ========================================

  /**
   * Jobs Table
   * Saved job postings from various sources
   */
  jobs: defineTable({
    userId: v.id("users"),
    title: v.string(),
    company: v.string(),
    location: v.string(),
    jobUrl: v.optional(v.string()),
    description: v.string(),
    salary: v.optional(v.string()),

    // Job Status & Tracking
    status: v.union(
      v.literal("saved"),
      v.literal("applied"),
      v.literal("interviewing"),
      v.literal("offered"),
      v.literal("rejected"),
      v.literal("accepted")
    ),

    // Source & Metadata
    source: v.union(
      v.literal("manual"),
      v.literal("linkedin"),
      v.literal("indeed"),
      v.literal("glassdoor"),
      v.literal("other")
    ),

    // Additional Information
    appliedDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    priority: v.optional(v.number()), // 1-5 priority rating
    tags: v.optional(v.array(v.string())),

    // Salary Information
    salaryMin: v.optional(v.number()),
    salaryMax: v.optional(v.number()),
    salaryCurrency: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_company", ["company"])
    .index("by_created_at", ["createdAt"])
    .index("by_applied_date", ["appliedDate"])
    .searchIndex("search_jobs", {
      searchField: "title",
      filterFields: ["userId", "status", "company"],
    }),

  /**
   * Applications Table
   * Application tracking with status, notes, and follow-ups
   */
  applications: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobs"),
    resumeId: v.optional(v.id("resumes")),
    coverLetter: v.optional(v.string()),

    // Application Status
    status: v.union(
      v.literal("pending"),
      v.literal("submitted"),
      v.literal("reviewed"),
      v.literal("interviewing"),
      v.literal("offered"),
      v.literal("rejected"),
      v.literal("accepted"),
      v.literal("withdrawn")
    ),

    // Dates & Tracking
    appliedDate: v.number(),
    followUpDate: v.optional(v.number()),
    responseDate: v.optional(v.number()),

    // Interview Information
    interviewDates: v.optional(v.array(v.number())),
    interviewNotes: v.optional(v.array(v.string())),

    // Additional Details
    notes: v.optional(v.string()),
    documents: v.optional(v.array(v.string())), // Document URLs
    contacts: v.optional(v.array(v.object({
      name: v.string(),
      email: v.optional(v.string()),
      role: v.optional(v.string()),
    }))),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_job", ["jobId"])
    .index("by_status", ["status"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_applied_date", ["appliedDate"])
    .index("by_follow_up_date", ["followUpDate"]),

  // ========================================
  // COACHES & SESSIONS
  // ========================================

  /**
   * Coaches Table
   * Coach profiles with expertise, rates, and verification status
   */
  coaches: defineTable({
    userId: v.id("users"),

    // Expertise & Experience
    specialty: v.array(v.string()), // e.g., ["resume_review", "interview_prep"]
    industries: v.array(v.string()),
    experience: v.string(),
    yearsOfExperience: v.optional(v.number()),

    // Credentials
    certifications: v.array(v.object({
      name: v.string(),
      issuer: v.string(),
      date: v.string(),
      url: v.optional(v.string()),
    })),
    portfolio: v.array(v.object({
      title: v.string(),
      description: v.string(),
      url: v.optional(v.string()),
    })),

    // Pricing & Availability
    hourlyRate: v.number(),
    availability: v.array(v.object({
      dayOfWeek: v.number(), // 0-6 (Sunday-Saturday)
      startTime: v.string(), // HH:MM format
      endTime: v.string(),
    })),
    timezone: v.optional(v.string()),

    // Performance Metrics
    rating: v.number(), // 0-5
    reviewCount: v.number(),
    completedSessions: v.optional(v.number()),
    responseTime: v.optional(v.number()), // Average response time in minutes

    // Verification & Status
    verificationStatus: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("suspended")
    ),

    // Payment Integration
    stripeAccountId: v.optional(v.string()),
    payoutEnabled: v.optional(v.boolean()),

    // Platform Settings
    isAcceptingClients: v.optional(v.boolean()),
    maxClientsPerWeek: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_verification_status", ["verificationStatus"])
    .index("by_rating", ["rating"])
    .index("by_created_at", ["createdAt"])
    .index("by_specialty", ["specialty"])
    .searchIndex("search_coaches", {
      searchField: "experience",
      filterFields: ["verificationStatus", "specialty", "industries"],
    }),

  /**
   * Sessions Table
   * Coaching sessions with scheduling and status tracking
   */
  sessions: defineTable({
    userId: v.id("users"),
    coachId: v.id("coaches"),

    // Scheduling
    scheduledTime: v.number(),
    duration: v.number(), // Duration in minutes

    // Status & Tracking
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show"),
      v.literal("rescheduled")
    ),

    // Session Details
    sessionType: v.optional(v.string()), // "resume_review", "interview_prep", etc.
    meetingUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),

    // Feedback & Outcomes
    coachNotes: v.optional(v.string()),
    actionItems: v.optional(v.array(v.string())),
    rating: v.optional(v.number()),

    // Payment Information
    price: v.optional(v.number()),
    paymentId: v.optional(v.id("payments")),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_coach", ["coachId"])
    .index("by_status", ["status"])
    .index("by_scheduled_time", ["scheduledTime"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_coach_and_status", ["coachId", "status"]),

  // ========================================
  // MARKETPLACE & VERIFICATION
  // ========================================

  /**
   * Verification Tasks Table
   * Marketplace tasks for resume review and verification
   */
  verificationTasks: defineTable({
    resumeId: v.id("resumes"),
    userId: v.id("users"),

    // Task Details
    taskType: v.union(
      v.literal("resume_review_quick"),
      v.literal("resume_review_full"),
      v.literal("cover_letter_review"),
      v.literal("linkedin_profile_review")
    ),
    urgency: v.union(
      v.literal("urgent"),      // Within 24 hours
      v.literal("standard"),    // 2-3 days
      v.literal("flexible")     // 1 week
    ),

    // Pricing
    suggestedPrice: v.number(),
    finalPrice: v.optional(v.number()),

    // Status & Assignment
    status: v.union(
      v.literal("open"),
      v.literal("bidding"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("completed"),
      v.literal("disputed"),
      v.literal("cancelled")
    ),
    assignedCoachId: v.optional(v.id("coaches")),

    // Task Details
    description: v.optional(v.string()),
    requirements: v.optional(v.array(v.string())),
    deliverables: v.optional(v.array(v.string())),

    // Completion
    completedAt: v.optional(v.number()),
    feedback: v.optional(v.string()),
    deliveredFiles: v.optional(v.array(v.string())),

    // Quality Assurance
    qaStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("needs_revision")
    )),
    qaFeedback: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_user", ["userId"])
    .index("by_coach", ["assignedCoachId"])
    .index("by_urgency", ["urgency"])
    .index("by_created_at", ["createdAt"])
    .index("by_status_and_urgency", ["status", "urgency"]),

  /**
   * Bids Table
   * Coach bids on verification tasks in the marketplace
   */
  bids: defineTable({
    taskId: v.id("verificationTasks"),
    coachId: v.id("coaches"),

    // Bid Details
    price: v.number(),
    estimatedTime: v.number(), // In hours
    message: v.optional(v.string()),

    // Status
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("withdrawn")
    ),

    // Additional Information
    deliveryDate: v.optional(v.number()),
    qualifications: v.optional(v.array(v.string())),

    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_task", ["taskId"])
    .index("by_coach", ["coachId"])
    .index("by_status", ["status"])
    .index("by_task_and_status", ["taskId", "status"])
    .index("by_price", ["price"]),

  // ========================================
  // REVIEWS & FEEDBACK
  // ========================================

  /**
   * Reviews Table
   * User reviews for coaches after sessions or task completion
   */
  reviews: defineTable({
    userId: v.id("users"),
    coachId: v.id("coaches"),

    // Review Context
    taskId: v.optional(v.id("verificationTasks")),
    sessionId: v.optional(v.id("sessions")),

    // Review Content
    rating: v.number(), // 1-5
    comment: v.optional(v.string()),

    // Detailed Ratings (optional)
    detailedRatings: v.optional(v.object({
      professionalism: v.number(),
      communication: v.number(),
      expertise: v.number(),
      value: v.number(),
    })),

    // Review Metadata
    isVerified: v.optional(v.boolean()), // Verified purchase
    helpfulCount: v.optional(v.number()), // How many found this helpful

    // Coach Response
    coachResponse: v.optional(v.string()),
    coachResponseDate: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_coach", ["coachId"])
    .index("by_user", ["userId"])
    .index("by_rating", ["rating"])
    .index("by_coach_and_rating", ["coachId", "rating"])
    .index("by_created_at", ["createdAt"]),

  // ========================================
  // PAYMENTS & SUBSCRIPTIONS
  // ========================================

  /**
   * Payments Table
   * All payment transactions with Stripe integration
   */
  payments: defineTable({
    userId: v.id("users"),

    // Payment Details
    amount: v.number(),
    currency: v.string(), // ISO 4217 currency code

    // Payment Type
    type: v.union(
      v.literal("verification"),
      v.literal("session"),
      v.literal("subscription"),
      v.literal("refund")
    ),

    // Status
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("succeeded"),
      v.literal("failed"),
      v.literal("refunded"),
      v.literal("cancelled")
    ),

    // Stripe Integration
    stripePaymentIntentId: v.optional(v.string()),
    stripeChargeId: v.optional(v.string()),
    stripeRefundId: v.optional(v.string()),

    // Related Resources
    taskId: v.optional(v.id("verificationTasks")),
    sessionId: v.optional(v.id("sessions")),
    subscriptionId: v.optional(v.id("subscriptions")),

    // Coach Payout (for marketplace tasks)
    coachId: v.optional(v.id("coaches")),
    platformFee: v.optional(v.number()),
    coachPayout: v.optional(v.number()),
    payoutStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed")
    )),

    // Error Handling
    errorMessage: v.optional(v.string()),

    // Metadata
    metadata: v.optional(v.any()),

    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_coach", ["coachId"])
    .index("by_stripe_payment_intent", ["stripePaymentIntentId"])
    .index("by_created_at", ["createdAt"])
    .index("by_user_and_status", ["userId", "status"]),

  /**
   * Subscriptions Table
   * User subscription plans with Stripe billing
   */
  subscriptions: defineTable({
    userId: v.id("users"),

    // Plan Details
    plan: v.union(
      v.literal("free"),
      v.literal("premium"),
      v.literal("pro"),
      v.literal("enterprise")
    ),

    // Status
    status: v.union(
      v.literal("active"),
      v.literal("cancelled"),
      v.literal("expired"),
      v.literal("past_due"),
      v.literal("paused")
    ),

    // Stripe Integration
    stripeSubscriptionId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),

    // Billing Cycle
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAt: v.optional(v.number()),
    cancelledAt: v.optional(v.number()),

    // Features & Limits
    features: v.optional(v.object({
      maxResumes: v.number(),
      maxStarStories: v.number(),
      aiGenerationsPerMonth: v.number(),
      prioritySupport: v.boolean(),
    })),

    // Trial
    trialStart: v.optional(v.number()),
    trialEnd: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_plan", ["plan"])
    .index("by_stripe_subscription", ["stripeSubscriptionId"])
    .index("by_current_period_end", ["currentPeriodEnd"]),

  // ========================================
  // MESSAGING
  // ========================================

  /**
   * Messages Table
   * Direct messaging between users and coaches
   */
  messages: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),

    // Message Content
    content: v.string(),
    messageType: v.optional(v.union(
      v.literal("text"),
      v.literal("file"),
      v.literal("system")
    )),

    // Status
    read: v.boolean(),
    readAt: v.optional(v.number()),

    // Attachments
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),

    // Context
    taskId: v.optional(v.id("verificationTasks")),
    sessionId: v.optional(v.id("sessions")),

    // Thread
    threadId: v.optional(v.string()), // Group messages into threads
    replyToId: v.optional(v.id("messages")),

    // Moderation
    flagged: v.optional(v.boolean()),
    flagReason: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"])
    .index("by_conversation", ["senderId", "receiverId"])
    .index("by_thread", ["threadId"])
    .index("by_created_at", ["createdAt"])
    .index("by_read_status", ["receiverId", "read"]),

  /**
   * Notifications Table
   * System notifications for users
   */
  notifications: defineTable({
    userId: v.id("users"),

    // Notification Content
    title: v.string(),
    message: v.string(),

    // Type & Priority
    type: v.union(
      v.literal("application"),
      v.literal("session"),
      v.literal("payment"),
      v.literal("message"),
      v.literal("review"),
      v.literal("system")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),

    // Status
    read: v.boolean(),
    readAt: v.optional(v.number()),

    // Action
    actionUrl: v.optional(v.string()),
    actionText: v.optional(v.string()),

    // Related Resources
    relatedId: v.optional(v.string()),
    relatedType: v.optional(v.string()),

    // Delivery
    emailSent: v.optional(v.boolean()),
    pushSent: v.optional(v.boolean()),
    smsSent: v.optional(v.boolean()),

    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"])
    .index("by_read_status", ["userId", "read"])
    .index("by_priority", ["priority"])
    .index("by_created_at", ["createdAt"])
    .index("by_expires_at", ["expiresAt"]),
});
