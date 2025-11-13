import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a coach profile
export const create = mutation({
  args: {
    specialty: v.array(v.string()),
    industries: v.array(v.string()),
    experience: v.string(),
    certifications: v.array(
      v.object({
        name: v.string(),
        issuer: v.string(),
        date: v.string(),
        url: v.optional(v.string()),
      })
    ),
    portfolio: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
        url: v.optional(v.string()),
      })
    ),
    hourlyRate: v.number(),
    availability: v.array(
      v.object({
        dayOfWeek: v.number(),
        startTime: v.string(),
        endTime: v.string(),
      })
    ),
    stripeAccountId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Verify user has coach role
    if (user.role !== "coach") {
      throw new Error("User must have coach role");
    }

    // Check if coach profile already exists
    const existingCoach = await ctx.db
      .query("coaches")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existingCoach) {
      throw new Error("Coach profile already exists");
    }

    const now = Date.now();
    const coachId = await ctx.db.insert("coaches", {
      userId: user._id,
      specialty: args.specialty,
      industries: args.industries,
      experience: args.experience,
      certifications: args.certifications,
      portfolio: args.portfolio,
      hourlyRate: args.hourlyRate,
      availability: args.availability,
      rating: 0,
      reviewCount: 0,
      verificationStatus: "pending",
      stripeAccountId: args.stripeAccountId,
      createdAt: now,
      updatedAt: now,
    });

    return coachId;
  },
});

// List all coaches (public)
export const list = query({
  args: {
    verificationStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.verificationStatus) {
      return await ctx.db
        .query("coaches")
        .withIndex("by_verification_status", (q) =>
          q.eq("verificationStatus", args.verificationStatus)
        )
        .collect();
    }

    // Default: return only approved coaches for public listing
    return await ctx.db
      .query("coaches")
      .withIndex("by_verification_status", (q) =>
        q.eq("verificationStatus", "approved")
      )
      .collect();
  },
});

// Get a single coach profile
export const get = query({
  args: {
    id: v.id("coaches"),
  },
  handler: async (ctx, args) => {
    const coach = await ctx.db.get(args.id);
    if (!coach) {
      throw new Error("Coach not found");
    }

    return coach;
  },
});

// Update coach profile
export const update = mutation({
  args: {
    id: v.id("coaches"),
    specialty: v.optional(v.array(v.string())),
    industries: v.optional(v.array(v.string())),
    experience: v.optional(v.string()),
    certifications: v.optional(
      v.array(
        v.object({
          name: v.string(),
          issuer: v.string(),
          date: v.string(),
          url: v.optional(v.string()),
        })
      )
    ),
    portfolio: v.optional(
      v.array(
        v.object({
          title: v.string(),
          description: v.string(),
          url: v.optional(v.string()),
        })
      )
    ),
    hourlyRate: v.optional(v.number()),
    availability: v.optional(
      v.array(
        v.object({
          dayOfWeek: v.number(),
          startTime: v.string(),
          endTime: v.string(),
        })
      )
    ),
    stripeAccountId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const coach = await ctx.db.get(args.id);
    if (!coach) {
      throw new Error("Coach not found");
    }

    // Row-level security: ensure user owns this coach profile
    if (coach.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...updates } = args;
    await ctx.db.patch(args.id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// Search coaches by specialty or industry
export const search = query({
  args: {
    specialty: v.optional(v.string()),
    industry: v.optional(v.string()),
    minRating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get all approved coaches
    let coaches = await ctx.db
      .query("coaches")
      .withIndex("by_verification_status", (q) =>
        q.eq("verificationStatus", "approved")
      )
      .collect();

    // Filter by specialty
    if (args.specialty) {
      coaches = coaches.filter((coach) =>
        coach.specialty.some((s) =>
          s.toLowerCase().includes(args.specialty!.toLowerCase())
        )
      );
    }

    // Filter by industry
    if (args.industry) {
      coaches = coaches.filter((coach) =>
        coach.industries.some((i) =>
          i.toLowerCase().includes(args.industry!.toLowerCase())
        )
      );
    }

    // Filter by minimum rating
    if (args.minRating !== undefined) {
      coaches = coaches.filter((coach) => coach.rating >= args.minRating!);
    }

    return coaches;
  },
});
