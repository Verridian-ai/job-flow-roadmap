import { WorkOS } from "@workos-inc/node";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * User Registration Flow Functions
 *
 * This module handles complete user registration including:
 * - Email/password registration
 * - Email verification
 * - Profile creation
 * - Role assignment (job_seeker vs coach)
 * - Integration with WorkOS SSO
 */

const getWorkOSClient = () => {
  const apiKey = process.env.WORKOS_API_KEY;
  if (!apiKey) {
    throw new Error("WORKOS_API_KEY must be configured");
  }
  return new WorkOS(apiKey);
};

/**
 * Register a new user with email and password
 */
export const registerWithEmail = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: v.union(v.literal("job_seeker"), v.literal("coach")),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (args.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const workos = getWorkOSClient();
    const now = Date.now();

    try {
      // Create user in WorkOS
      const workosUser = await workos.userManagement.createUser({
        email: args.email,
        password: args.password,
        firstName: args.name.split(" ")[0],
        lastName: args.name.split(" ").slice(1).join(" ") || "",
        emailVerified: false,
      });

      // Create user in Convex database
      const userId = await ctx.db.insert("users", {
        email: args.email,
        name: args.name,
        authId: workosUser.id,
        role: args.role,
        emailVerified: false,
        ssoProvider: "email" as const,
        phone: args.phone,
        location: args.location,
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
        createdAt: now,
        updatedAt: now,
      });

      // Send verification email
      await workos.userManagement.sendVerificationEmail({
        userId: workosUser.id,
      });

      const user = await ctx.db.get(userId);

      return {
        userId,
        user,
        message: "Registration successful. Please check your email to verify your account.",
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(
        `Registration failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
});

/**
 * Complete user profile after registration
 */
export const completeProfile = mutation({
  args: {
    userId: v.id("users"),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    phone: v.optional(v.string()),
    profilePhoto: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      bio: args.bio,
      location: args.location || user.location,
      phone: args.phone || user.phone,
      profilePhoto: args.profilePhoto,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Profile completed successfully",
    };
  },
});

/**
 * Verify user email with verification code
 */
export const verifyEmailWithCode = mutation({
  args: {
    userId: v.id("users"),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.emailVerified) {
      return {
        success: true,
        message: "Email already verified",
      };
    }

    const workos = getWorkOSClient();

    try {
      await workos.userManagement.verifyEmail({
        userId: user.authId,
        code: args.code,
      });

      await ctx.db.patch(args.userId, {
        emailVerified: true,
        updatedAt: Date.now(),
      });

      return {
        success: true,
        message: "Email verified successfully",
      };
    } catch (error) {
      console.error("Email verification failed:", error);
      throw new Error("Invalid or expired verification code");
    }
  },
});

/**
 * Resend verification email
 */
export const resendVerificationEmail = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.emailVerified) {
      return {
        success: false,
        message: "Email already verified",
      };
    }

    const workos = getWorkOSClient();

    try {
      await workos.userManagement.sendVerificationEmail({
        userId: user.authId,
      });

      return {
        success: true,
        message: "Verification email sent successfully",
      };
    } catch (error) {
      console.error("Failed to send verification email:", error);
      throw new Error("Failed to send verification email");
    }
  },
});

/**
 * Update user role (for admin or self-service role change)
 */
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("job_seeker"), v.literal("coach")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      role: args.role,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: `Role updated to ${args.role}`,
    };
  },
});

/**
 * Check if email is available
 */
export const checkEmailAvailability = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    return {
      available: !existingUser,
      message: existingUser ? "Email already registered" : "Email is available",
    };
  },
});

/**
 * Get registration status for a user
 */
export const getRegistrationStatus = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }

    return {
      emailVerified: user.emailVerified,
      profileComplete: !!(user.bio && user.location && user.phone),
      role: user.role,
      createdAt: user.createdAt,
    };
  },
});

/**
 * Validate registration data before submission
 */
export const validateRegistrationData = query({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const errors: string[] = [];

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      errors.push("Invalid email format");
    }

    // Check if email exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      errors.push("Email already registered");
    }

    // Password validation
    if (args.password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(args.password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(args.password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(args.password)) {
      errors.push("Password must contain at least one number");
    }

    // Name validation
    if (args.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
});
