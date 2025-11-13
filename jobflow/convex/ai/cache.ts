/**
 * AI Response Cache
 * Caches AI responses to reduce API calls and improve performance
 */

import { CACHE_CONFIG } from "./config";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class AICache {
  private cache: Map<string, CacheEntry<unknown>>;
  private maxSize: number;
  private ttlMs: number;

  constructor(maxSize: number = CACHE_CONFIG.maxSize, ttlMs: number = CACHE_CONFIG.ttlMs) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  /**
   * Generate a cache key from request parameters
   */
  private generateKey(operation: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, unknown>);

    return `${operation}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Get a cached response
   */
  get<T>(operation: string, params: Record<string, unknown>): T | null {
    if (!CACHE_CONFIG.enabled) {
      return null;
    }

    const key = this.generateKey(operation, params);
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set a cached response
   */
  set<T>(operation: string, params: Record<string, unknown>, data: T): void {
    if (!CACHE_CONFIG.enabled) {
      return;
    }

    const key = this.generateKey(operation, params);

    // Evict oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.ttlMs,
    });
  }

  /**
   * Invalidate cache entries matching a pattern
   */
  invalidate(operation: string, params?: Partial<Record<string, unknown>>): void {
    if (!params) {
      // Invalidate all entries for this operation
      for (const key of this.cache.keys()) {
        if (key.startsWith(`${operation}:`)) {
          this.cache.delete(key);
        }
      }
      return;
    }

    // Invalidate specific entries
    const pattern = this.generateKey(operation, params as Record<string, unknown>);
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // TODO: Implement hit rate tracking
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
export const aiCache = new AICache();

// Cleanup expired entries every 5 minutes
setInterval(() => aiCache.cleanup(), 5 * 60 * 1000);

export default aiCache;
