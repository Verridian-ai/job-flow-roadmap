import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("job_seeker"), v.literal("coach"), v.literal("admin")),
    authId: v.string(),
    emailVerified: v.boolean(),
    profilePhoto: v.optional(v.string()),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    twoFactorEnabled: v.boolean(),
    privacySettings: v.object({
      profileVisible: v.boolean(),
      emailVisible: v.boolean(),
      phoneVisible: v.boolean(),
    }),
    notificationPreferences: v.object({
      email: v.boolean(),
      push: v.boolean(),
      sms: v.boolean(),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_auth_id", ["authId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  starStories: defineTable({
    userId: v.id("users"),
    title: v.string(),
    situation: v.string(),
    task: v.string(),
    action: v.string(),
    result: v.string(),
    skills: v.array(v.string()),
    category: v.string(),
    qualityScore: v.optional(v.number()),
    aiSuggestions: v.optional(v.string()),
    completenessScore: v.optional(v.number()),
    impactScore: v.optional(v.number()),
    clarityScore: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "category"])
    .searchIndex("search_stories", {
      searchField: "title",
      filterFields: ["userId", "skills"],
    }),

  resumes: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    jobDescription: v.string(),
    starStoryIds: v.array(v.id("starStories")),
    atsScore: v.number(),
    confidenceScore: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("pending_verification"),
      v.literal("verified"),
      v.literal("archived")
    ),
    version: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_and_status", ["userId", "status"]),

  jobs: defineTable({
    userId: v.id("users"),
    title: v.string(),
    company: v.string(),
    location: v.string(),
    jobUrl: v.optional(v.string()),
    description: v.string(),
    salary: v.optional(v.string()),
    status: v.union(
      v.literal("saved"),
      v.literal("applied"),
      v.literal("interviewing"),
      v.literal("offered"),
      v.literal("rejected"),
      v.literal("accepted")
    ),
    source: v.union(
      v.literal("manual"),
      v.literal("linkedin"),
      v.literal("indeed"),
      v.literal("other")
    ),
    appliedDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_and_status", ["userId", "status"]),

  applications: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobs"),
    resumeId: v.optional(v.id("resumes")),
    coverLetter: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("submitted"),
      v.literal("reviewed"),
      v.literal("interviewing"),
      v.literal("offered"),
      v.literal("rejected"),
      v.literal("accepted")
    ),
    appliedDate: v.number(),
    followUpDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_job", ["jobId"])
    .index("by_status", ["status"])
    .index("by_user_and_status", ["userId", "status"]),

  coaches: defineTable({
    userId: v.id("users"),
    specialty: v.array(v.string()),
    industries: v.array(v.string()),
    experience: v.string(),
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
    hourlyRate: v.number(),
    availability: v.array(v.object({
      dayOfWeek: v.number(),
      startTime: v.string(),
      endTime: v.string(),
    })),
    rating: v.number(),
    reviewCount: v.number(),
    verificationStatus: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    stripeAccountId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_verification_status", ["verificationStatus"])
    .index("by_rating", ["rating"]),

  sessions: defineTable({
    userId: v.id("users"),
    coachId: v.id("coaches"),
    scheduledTime: v.number(),
    duration: v.number(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),
    meetingUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_coach", ["coachId"])
    .index("by_status", ["status"])
    .index("by_scheduled_time", ["scheduledTime"]),

  verificationTasks: defineTable({
    resumeId: v.id("resumes"),
    userId: v.id("users"),
    taskType: v.union(
      v.literal("resume_review_quick"),
      v.literal("resume_review_full"),
      v.literal("cover_letter_review")
    ),
    urgency: v.union(
      v.literal("urgent"),
      v.literal("standard"),
      v.literal("flexible")
    ),
    suggestedPrice: v.number(),
    status: v.union(
      v.literal("open"),
      v.literal("bidding"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("disputed")
    ),
    assignedCoachId: v.optional(v.id("coaches")),
    finalPrice: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    feedback: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_user", ["userId"])
    .index("by_coach", ["assignedCoachId"]),

  bids: defineTable({
    taskId: v.id("verificationTasks"),
    coachId: v.id("coaches"),
    price: v.number(),
    estimatedTime: v.number(),
    message: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
    createdAt: v.number(),
  })
    .index("by_task", ["taskId"])
    .index("by_coach", ["coachId"])
    .index("by_status", ["status"]),

  reviews: defineTable({
    userId: v.id("users"),
    coachId: v.id("coaches"),
    taskId: v.optional(v.id("verificationTasks")),
    sessionId: v.optional(v.id("sessions")),
    rating: v.number(),
    comment: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_coach", ["coachId"])
    .index("by_user", ["userId"])
    .index("by_rating", ["rating"]),

  payments: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    type: v.union(
      v.literal("verification"),
      v.literal("session"),
      v.literal("subscription")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("succeeded"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    stripePaymentIntentId: v.optional(v.string()),
    taskId: v.optional(v.id("verificationTasks")),
    sessionId: v.optional(v.id("sessions")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    plan: v.union(
      v.literal("free"),
      v.literal("premium"),
      v.literal("pro")
    ),
    status: v.union(
      v.literal("active"),
      v.literal("cancelled"),
      v.literal("expired")
    ),
    stripeSubscriptionId: v.optional(v.string()),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  messages: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    content: v.string(),
    read: v.boolean(),
    fileUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"])
    .index("by_conversation", ["senderId", "receiverId"]),
});
