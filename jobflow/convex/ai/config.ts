/**
 * AI Service Configuration
 * Centralized configuration for OpenRouter AI integration
 */

// OpenRouter Configuration
export const OPENROUTER_CONFIG = {
  apiKey: process.env.OPENROUTER_API_KEY || "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",
  baseUrl: "https://openrouter.ai/api/v1/chat/completions",
  defaultModel: "moonshotai/kimi-k2-thinking",
  referer: "https://jobflow.app",
  title: "JobFlow AI Resume Generator",
} as const;

// Model configurations for different tasks
export const AI_MODELS = {
  // Resume generation - high quality, creative
  resume: {
    model: "moonshotai/kimi-k2-thinking",
    temperature: 0.7,
    maxTokens: 2500,
    description: "Best for generating detailed, ATS-optimized resumes",
  },

  // STAR story extraction - balanced
  starExtraction: {
    model: "moonshotai/kimi-k2-thinking",
    temperature: 0.6,
    maxTokens: 1500,
    description: "Optimized for extracting structured STAR stories",
  },

  // ATS scoring - analytical, precise
  atsScoring: {
    model: "moonshotai/kimi-k2-thinking",
    temperature: 0.3,
    maxTokens: 1000,
    description: "Precise analysis for ATS compatibility scoring",
  },

  // Cover letter - creative, warm
  coverLetter: {
    model: "moonshotai/kimi-k2-thinking",
    temperature: 0.8,
    maxTokens: 1200,
    description: "Generates compelling, personalized cover letters",
  },

  // Interview questions - balanced
  interviewQuestions: {
    model: "moonshotai/kimi-k2-thinking",
    temperature: 0.5,
    maxTokens: 1500,
    description: "Generates relevant interview questions",
  },

  // Resume suggestions - helpful, precise
  suggestions: {
    model: "moonshotai/kimi-k2-thinking",
    temperature: 0.4,
    maxTokens: 1000,
    description: "Provides specific improvement suggestions",
  },
} as const;

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  enabled: true,
  ttlMs: 60 * 60 * 1000, // 1 hour
  maxSize: 100, // Maximum number of cached responses
} as const;

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  maxRequestsPerHour: 100,
  maxRequestsPerDay: 500,
  maxCostPerDay: 10.0, // USD
} as const;

// Timeout configuration
export const TIMEOUT_CONFIG = {
  requestTimeoutMs: 30000, // 30 seconds
  connectionTimeoutMs: 10000, // 10 seconds
} as const;

// Error messages
export const ERROR_MESSAGES = {
  rateLimitExceeded: "AI rate limit exceeded. Please try again later.",
  timeout: "AI request timed out. Please try again.",
  invalidResponse: "AI returned an invalid response. Please try again.",
  serviceUnavailable: "AI service is temporarily unavailable. Please try again later.",
  quotaExceeded: "AI quota exceeded. Please contact support.",
  unknownError: "An unexpected error occurred. Please try again.",
} as const;
