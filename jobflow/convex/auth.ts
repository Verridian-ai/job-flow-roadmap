import { WorkOS } from "@workos-inc/node";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * WorkOS SSO Authentication Configuration
 *
 * This module provides WorkOS SSO integration for the Job Flow platform,
 * supporting Google and Microsoft authentication providers.
 *
 * Features:
 * - Google OAuth 2.0 SSO
 * - Microsoft Azure AD SSO
 * - Session management
 * - User profile synchronization
 * - Role-based access control
 */

// Initialize WorkOS client (will be used in HTTP actions)
const getWorkOSClient = () => {
  const apiKey = process.env.WORKOS_API_KEY;
  const clientId = process.env.WORKOS_CLIENT_ID;

  if (!apiKey || !clientId) {
    throw new Error("WorkOS API key and Client ID must be configured in environment variables");
  }

  return new WorkOS(apiKey);
};

/**
 * SSO Provider Types
 */
export const SSO_PROVIDERS = {
  GOOGLE: "GoogleOAuth",
  MICROSOFT: "MicrosoftOAuth",
} as const;

export type SSOProvider = typeof SSO_PROVIDERS[keyof typeof SSO_PROVIDERS];

/**
 * Get WorkOS authorization URL for SSO login
 *
 * This creates the OAuth flow URL that users will be redirected to
 * for authentication with Google or Microsoft.
 */
export const getAuthorizationUrl = mutation({
  args: {
    provider: v.union(
      v.literal("GoogleOAuth"),
      v.literal("MicrosoftOAuth")
    ),
    redirectUri: v.string(),
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const workos = getWorkOSClient();
    const clientId = process.env.WORKOS_CLIENT_ID!;

    // Generate authorization URL with WorkOS
    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      provider: args.provider,
      clientId,
      redirectUri: args.redirectUri,
      state: args.state,
    });

    return { url: authorizationUrl };
  },
});

/**
 * Handle OAuth callback and authenticate user
 *
 * This processes the OAuth callback from WorkOS after user authentication,
 * creates or updates the user record, and establishes a session.
 */
export const authenticateWithCode = mutation({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const workos = getWorkOSClient();
    const clientId = process.env.WORKOS_CLIENT_ID!;

    try {
      // Exchange authorization code for user profile
      const { user, accessToken } = await workos.userManagement.authenticateWithCode({
        clientId,
        code: args.code,
      });

      // Check if user already exists
      let existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", user.email))
        .unique();

      const now = Date.now();

      if (existingUser) {
        // Update existing user
        await ctx.db.patch(existingUser._id, {
          authId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          emailVerified: user.emailVerified,
          updatedAt: now,
        });

        return {
          userId: existingUser._id,
          user: existingUser,
          accessToken,
        };
      } else {
        // Create new user
        const userId = await ctx.db.insert("users", {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          authId: user.id,
          role: "job_seeker", // Default role
          emailVerified: user.emailVerified,
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

        const newUser = await ctx.db.get(userId);

        return {
          userId,
          user: newUser,
          accessToken,
        };
      }
    } catch (error) {
      console.error("WorkOS authentication error:", error);
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

/**
 * Get current authenticated user from WorkOS session
 */
export const getCurrentUser = query({
  args: {
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const workos = getWorkOSClient();

    try {
      // Verify access token and get user
      const { user } = await workos.userManagement.getUser({
        accessToken: args.accessToken,
      });

      // Find user in database
      const dbUser = await ctx.db
        .query("users")
        .withIndex("by_auth_id", (q) => q.eq("authId", user.id))
        .unique();

      return dbUser;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },
});

/**
 * Refresh WorkOS session
 */
export const refreshSession = mutation({
  args: {
    refreshToken: v.string(),
  },
  handler: async (ctx, args) => {
    const workos = getWorkOSClient();
    const clientId = process.env.WORKOS_CLIENT_ID!;

    try {
      const { accessToken, refreshToken } = await workos.userManagement.refreshToken({
        clientId,
        refreshToken: args.refreshToken,
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw new Error("Failed to refresh session");
    }
  },
});

/**
 * Logout and revoke session
 */
export const logout = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const workos = getWorkOSClient();

    try {
      await workos.userManagement.revokeSession({
        sessionId: args.sessionId,
      });

      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Failed to logout");
    }
  },
});

/**
 * Verify user email through WorkOS
 */
export const sendVerificationEmail = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const workos = getWorkOSClient();

    try {
      await workos.userManagement.sendVerificationEmail({
        userId: user.authId,
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to send verification email:", error);
      throw new Error("Failed to send verification email");
    }
  },
});

/**
 * Verify email with code
 */
export const verifyEmail = mutation({
  args: {
    userId: v.id("users"),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const workos = getWorkOSClient();

    try {
      await workos.userManagement.verifyEmail({
        userId: user.authId,
        code: args.code,
      });

      // Update user record
      await ctx.db.patch(args.userId, {
        emailVerified: true,
        updatedAt: Date.now(),
      });

      return { success: true };
    } catch (error) {
      console.error("Email verification failed:", error);
      throw new Error("Email verification failed");
    }
  },
});

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      // Don't reveal if user exists
      return { success: true };
    }

    const workos = getWorkOSClient();

    try {
      await workos.userManagement.sendPasswordResetEmail({
        email: args.email,
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  },
});

/**
 * Reset password with token
 */
export const resetPassword = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const workos = getWorkOSClient();

    try {
      await workos.userManagement.resetPassword({
        token: args.token,
        newPassword: args.newPassword,
      });

      return { success: true };
    } catch (error) {
      console.error("Password reset failed:", error);
      throw new Error("Password reset failed");
    }
  },
});

/**
 * Get user's SSO provider info
 */
export const getUserSSOProvider = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }

    const workos = getWorkOSClient();

    try {
      const workosUser = await workos.userManagement.getUser({
        userId: user.authId,
      });

      return {
        provider: workosUser.user.profilePictureUrl ? "Google" : "Microsoft",
        emailVerified: workosUser.user.emailVerified,
        firstName: workosUser.user.firstName,
        lastName: workosUser.user.lastName,
      };
    } catch (error) {
      console.error("Failed to get SSO provider info:", error);
      return null;
    }
  },
});
