/**
 * AI Module - Central Export
 *
 * Provides comprehensive AI integration with OpenRouter:
 * - Resume generation
 * - STAR story extraction
 * - ATS scoring
 * - Cover letter generation
 * - Interview question generation
 * - Usage tracking and monitoring
 * - Response caching
 * - Retry logic with exponential backoff
 * - Error handling and fallbacks
 */

// Service exports
export { AIService, aiService, type AIMessage, type AIOperationType } from "./service";

// Configuration exports
export {
  OPENROUTER_CONFIG,
  AI_MODELS,
  RETRY_CONFIG,
  CACHE_CONFIG,
  RATE_LIMIT_CONFIG,
  TIMEOUT_CONFIG,
  ERROR_MESSAGES,
} from "./config";

// Cache exports
export { aiCache } from "./cache";

// Retry exports
export {
  withRetry,
  withTimeout,
  withRetryAndTimeout,
  type RetryOptions,
} from "./retry";

// Usage tracking exports
export {
  usageTracker,
  estimateCost,
  estimateTokens,
} from "./usage";

// Action exports (for Convex)
export * from "./actions";
