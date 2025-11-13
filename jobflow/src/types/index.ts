import type { Id } from "../../convex/_generated/dataModel";

export interface User {
  _id: Id<"users">;
  email: string;
  name: string;
  role: "job_seeker" | "coach" | "admin";
  authId: string;
  emailVerified: boolean;
  profilePhoto?: string;
  bio?: string;
  phone?: string;
  location?: string;
  twoFactorEnabled: boolean;
  privacySettings: {
    profileVisible: boolean;
    emailVisible: boolean;
    phoneVisible: boolean;
  };
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  createdAt: number;
  updatedAt: number;
}

export interface StarStory {
  _id: Id<"starStories">;
  userId: Id<"users">;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  skills: string[];
  category: string;
  createdAt: number;
  updatedAt: number;
}

export interface Resume {
  _id: Id<"resumes">;
  userId: Id<"users">;
  title: string;
  content: string;
  jobDescription: string;
  starStoryIds: Id<"starStories">[];
  atsScore: number;
  confidenceScore: number;
  status: "draft" | "pending_verification" | "verified" | "archived";
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface Job {
  _id: Id<"jobs">;
  userId: Id<"users">;
  title: string;
  company: string;
  location: string;
  jobUrl?: string;
  description: string;
  salary?: string;
  status: "saved" | "applied" | "interviewing" | "offered" | "rejected" | "accepted";
  source: "manual" | "linkedin" | "indeed" | "other";
  appliedDate?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Coach {
  _id: Id<"coaches">;
  userId: Id<"users">;
  specialty: string[];
  industries: string[];
  experience: string;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  portfolio: Array<{
    title: string;
    description: string;
    url?: string;
  }>;
  hourlyRate: number;
  availability: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
  rating: number;
  reviewCount: number;
  verificationStatus: "pending" | "approved" | "rejected";
  stripeAccountId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Session {
  _id: Id<"sessions">;
  userId: Id<"users">;
  coachId: Id<"coaches">;
  scheduledTime: number;
  duration: number;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  meetingUrl?: string;
  notes?: string;
  recordingUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface VerificationTask {
  _id: Id<"verificationTasks">;
  resumeId: Id<"resumes">;
  userId: Id<"users">;
  taskType: "resume_review_quick" | "resume_review_full" | "cover_letter_review";
  urgency: "urgent" | "standard" | "flexible";
  suggestedPrice: number;
  status: "open" | "bidding" | "assigned" | "in_progress" | "completed" | "disputed";
  assignedCoachId?: Id<"coaches">;
  finalPrice?: number;
  completedAt?: number;
  feedback?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Bid {
  _id: Id<"bids">;
  taskId: Id<"verificationTasks">;
  coachId: Id<"coaches">;
  price: number;
  estimatedTime: number;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: number;
}

export interface Review {
  _id: Id<"reviews">;
  userId: Id<"users">;
  coachId: Id<"coaches">;
  taskId?: Id<"verificationTasks">;
  sessionId?: Id<"sessions">;
  rating: number;
  comment?: string;
  createdAt: number;
}

export interface Payment {
  _id: Id<"payments">;
  userId: Id<"users">;
  amount: number;
  currency: string;
  type: "verification" | "session" | "subscription";
  status: "pending" | "succeeded" | "failed" | "refunded";
  stripePaymentIntentId?: string;
  taskId?: Id<"verificationTasks">;
  sessionId?: Id<"sessions">;
  createdAt: number;
}

export interface Message {
  _id: Id<"messages">;
  senderId: Id<"users">;
  receiverId: Id<"users">;
  content: string;
  read: boolean;
  fileUrl?: string;
  createdAt: number;
}
