import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    return user;
  },
});

export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      bio: user.bio,
      location: user.location,
      createdAt: user.createdAt,
    };
  },
});

export const create = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    authId: v.string(),
    role: v.union(v.literal("job_seeker"), v.literal("coach")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      authId: args.authId,
      role: args.role,
      emailVerified: false,
      twoFactorEnabled: false,
      privacySettings: {
        profileVisible: true,
        emailVisible: false,
        phoneVisible: false,
      },
      notificationPreferences: {
        email: true,
        push: true,
        sms: false,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    profilePhoto: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db.get(args.userId);
    if (!user || user.authId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    const updateData: { updatedAt: number; name?: string; bio?: string; phone?: string; location?: string; profilePhoto?: string } = { updatedAt: Date.now() };
    if (args.name !== undefined) updateData.name = args.name;
    if (args.bio !== undefined) updateData.bio = args.bio;
    if (args.phone !== undefined) updateData.phone = args.phone;
    if (args.location !== undefined) updateData.location = args.location;
    if (args.profilePhoto !== undefined) updateData.profilePhoto = args.profilePhoto;

    await ctx.db.patch(args.userId, updateData);
    return args.userId;
  },
});

export const updatePrivacySettings = mutation({
  args: {
    userId: v.id("users"),
    privacySettings: v.object({
      profileVisible: v.boolean(),
      emailVisible: v.boolean(),
      phoneVisible: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db.get(args.userId);
    if (!user || user.authId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.userId, {
      privacySettings: args.privacySettings,
      updatedAt: Date.now(),
    });

    return args.userId;
  },
});

export const updateNotificationPreferences = mutation({
  args: {
    userId: v.id("users"),
    notificationPreferences: v.object({
      email: v.boolean(),
      push: v.boolean(),
      sms: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db.get(args.userId);
    if (!user || user.authId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.userId, {
      notificationPreferences: args.notificationPreferences,
      updatedAt: Date.now(),
    });

    return args.userId;
  },
});

export const deleteAccount = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db.get(args.userId);
    if (!user || user.authId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.userId);
    return true;
  },
});
