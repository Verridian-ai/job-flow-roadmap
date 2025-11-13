import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Send a message
export const send = mutation({
  args: {
    receiverId: v.id("users"),
    content: v.string(),
    fileUrl: v.optional(v.string()),
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

    // Verify receiver exists
    const receiver = await ctx.db.get(args.receiverId);
    if (!receiver) {
      throw new Error("Receiver not found");
    }

    // Prevent sending messages to self
    if (user._id === args.receiverId) {
      throw new Error("Cannot send message to yourself");
    }

    const now = Date.now();
    const messageId = await ctx.db.insert("messages", {
      senderId: user._id,
      receiverId: args.receiverId,
      content: args.content,
      read: false,
      fileUrl: args.fileUrl,
      createdAt: now,
    });

    return messageId;
  },
});

// List conversations for current user
export const listConversations = query({
  args: {},
  handler: async (ctx) => {
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

    // Get all messages where user is sender or receiver
    const sentMessages = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", user._id))
      .collect();

    const receivedMessages = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", user._id))
      .collect();

    // Combine and get unique conversation partners
    const allMessages = [...sentMessages, ...receivedMessages];
    const partnerIds = new Set<string>();

    for (const message of allMessages) {
      if (message.senderId === user._id) {
        partnerIds.add(message.receiverId);
      } else {
        partnerIds.add(message.senderId);
      }
    }

    // Get conversation info for each partner
    const conversations = [];
    for (const partnerId of partnerIds) {
      const partner = await ctx.db.get(partnerId);
      if (!partner) continue;

      // Get latest message in this conversation
      const conversationMessages = allMessages.filter(
        (msg) =>
          (msg.senderId === user._id && msg.receiverId === partnerId) ||
          (msg.receiverId === user._id && msg.senderId === partnerId)
      );

      conversationMessages.sort((a, b) => b.createdAt - a.createdAt);
      const latestMessage = conversationMessages[0];

      // Count unread messages
      const unreadCount = conversationMessages.filter(
        (msg) => msg.receiverId === user._id && !msg.read
      ).length;

      conversations.push({
        partnerId,
        partnerName: partner.name,
        partnerEmail: partner.email,
        partnerPhoto: partner.profilePhoto,
        latestMessage: latestMessage.content,
        latestMessageTime: latestMessage.createdAt,
        unreadCount,
      });
    }

    // Sort by latest message time
    conversations.sort((a, b) => b.latestMessageTime - a.latestMessageTime);

    return conversations;
  },
});

// List messages in a conversation
export const listMessages = query({
  args: {
    otherUserId: v.id("users"),
    limit: v.optional(v.number()),
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

    // Verify other user exists
    const otherUser = await ctx.db.get(args.otherUserId);
    if (!otherUser) {
      throw new Error("Other user not found");
    }

    // Get messages between current user and other user
    const sentMessages = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", user._id))
      .filter((q) => q.eq(q.field("receiverId"), args.otherUserId))
      .collect();

    const receivedMessages = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", user._id))
      .filter((q) => q.eq(q.field("senderId"), args.otherUserId))
      .collect();

    const allMessages = [...sentMessages, ...receivedMessages];
    allMessages.sort((a, b) => a.createdAt - b.createdAt);

    // Apply limit if provided
    const limit = args.limit ?? allMessages.length;
    return allMessages.slice(-limit);
  },
});

// Mark message as read
export const markAsRead = mutation({
  args: {
    id: v.id("messages"),
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

    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error("Message not found");
    }

    // Only the receiver can mark a message as read
    if (message.receiverId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      read: true,
    });

    return args.id;
  },
});

// Mark all messages in a conversation as read
export const markConversationAsRead = mutation({
  args: {
    otherUserId: v.id("users"),
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

    // Get all unread messages from the other user
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", user._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("senderId"), args.otherUserId),
          q.eq(q.field("read"), false)
        )
      )
      .collect();

    // Mark all as read
    for (const message of unreadMessages) {
      await ctx.db.patch(message._id, {
        read: true,
      });
    }

    return { count: unreadMessages.length };
  },
});
