/**
 * AI Request Retry Logic
 * Implements exponential backoff retry strategy for AI API calls
 */

import { RETRY_CONFIG, ERROR_MESSAGES } from "./config";

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableStatusCodes?: number[];
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: Error, retryableStatusCodes: number[]): boolean {
  // Check for network errors
  if (error.message.includes("network") || error.message.includes("timeout")) {
    return true;
  }

  // Check for rate limit errors
  if (error.message.includes("429") || error.message.includes("rate limit")) {
    return true;
  }

  // Check for specific HTTP status codes
  const statusMatch = error.message.match(/status (\d+)/);
  if (statusMatch) {
    const status = parseInt(statusMatch[1], 10);
    return retryableStatusCodes.includes(status);
  }

  return false;
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(
  attempt: number,
  initialDelayMs: number,
  maxDelayMs: number,
  backoffMultiplier: number
): number {
  const exponentialDelay = initialDelayMs * Math.pow(backoffMultiplier, attempt);
  const cappedDelay = Math.min(exponentialDelay, maxDelayMs);

  // Add jitter to prevent thundering herd
  const jitter = Math.random() * cappedDelay * 0.1;

  return cappedDelay + jitter;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = RETRY_CONFIG.maxRetries,
    initialDelayMs = RETRY_CONFIG.initialDelayMs,
    maxDelayMs = RETRY_CONFIG.maxDelayMs,
    backoffMultiplier = RETRY_CONFIG.backoffMultiplier,
    retryableStatusCodes = RETRY_CONFIG.retryableStatusCodes,
    onRetry,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if we should retry
      if (attempt === maxRetries || !isRetryableError(lastError, retryableStatusCodes)) {
        throw lastError;
      }

      // Calculate delay and wait
      const delay = calculateDelay(attempt, initialDelayMs, maxDelayMs, backoffMultiplier);

      // Call retry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      console.log(
        `[AI Retry] Attempt ${attempt + 1}/${maxRetries} failed. Retrying in ${Math.round(delay)}ms...`,
        lastError.message
      );

      await sleep(delay);
    }
  }

  throw lastError || new Error(ERROR_MESSAGES.unknownError);
}

/**
 * Timeout wrapper for promises
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(ERROR_MESSAGES.timeout)), timeoutMs)
    ),
  ]);
}

/**
 * Combine retry and timeout
 */
export async function withRetryAndTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  retryOptions?: RetryOptions
): Promise<T> {
  return withRetry(() => withTimeout(fn(), timeoutMs), retryOptions);
}
