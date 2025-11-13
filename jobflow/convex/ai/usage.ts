/**
 * AI Usage Tracking
 * Tracks API usage, costs, and enforces limits
 */

import { RATE_LIMIT_CONFIG, ERROR_MESSAGES } from "./config";

interface UsageRecord {
  timestamp: number;
  operation: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

interface UsageStats {
  hourly: {
    requests: number;
    cost: number;
  };
  daily: {
    requests: number;
    cost: number;
  };
  total: {
    requests: number;
    cost: number;
  };
}

class UsageTracker {
  private records: UsageRecord[] = [];

  /**
   * Record an AI operation
   */
  record(
    operation: string,
    model: string,
    inputTokens: number,
    outputTokens: number,
    cost: number
  ): void {
    this.records.push({
      timestamp: Date.now(),
      operation,
      model,
      inputTokens,
      outputTokens,
      cost,
    });

    // Clean up old records (older than 24 hours)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.records = this.records.filter((r) => r.timestamp > oneDayAgo);
  }

  /**
   * Get usage statistics
   */
  getStats(): UsageStats {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const hourlyRecords = this.records.filter((r) => r.timestamp > oneHourAgo);
    const dailyRecords = this.records.filter((r) => r.timestamp > oneDayAgo);

    return {
      hourly: {
        requests: hourlyRecords.length,
        cost: hourlyRecords.reduce((sum, r) => sum + r.cost, 0),
      },
      daily: {
        requests: dailyRecords.length,
        cost: dailyRecords.reduce((sum, r) => sum + r.cost, 0),
      },
      total: {
        requests: this.records.length,
        cost: this.records.reduce((sum, r) => sum + r.cost, 0),
      },
    };
  }

  /**
   * Check if rate limits are exceeded
   */
  checkLimits(): { allowed: boolean; reason?: string } {
    const stats = this.getStats();

    // Check hourly request limit
    if (stats.hourly.requests >= RATE_LIMIT_CONFIG.maxRequestsPerHour) {
      return {
        allowed: false,
        reason: `Hourly limit exceeded (${RATE_LIMIT_CONFIG.maxRequestsPerHour} requests/hour)`,
      };
    }

    // Check daily request limit
    if (stats.daily.requests >= RATE_LIMIT_CONFIG.maxRequestsPerDay) {
      return {
        allowed: false,
        reason: `Daily limit exceeded (${RATE_LIMIT_CONFIG.maxRequestsPerDay} requests/day)`,
      };
    }

    // Check daily cost limit
    if (stats.daily.cost >= RATE_LIMIT_CONFIG.maxCostPerDay) {
      return {
        allowed: false,
        reason: `Daily cost limit exceeded ($${RATE_LIMIT_CONFIG.maxCostPerDay}/day)`,
      };
    }

    return { allowed: true };
  }

  /**
   * Get usage breakdown by operation
   */
  getBreakdown(): Record<string, { requests: number; cost: number }> {
    const breakdown: Record<string, { requests: number; cost: number }> = {};

    for (const record of this.records) {
      if (!breakdown[record.operation]) {
        breakdown[record.operation] = { requests: 0, cost: 0 };
      }
      breakdown[record.operation].requests++;
      breakdown[record.operation].cost += record.cost;
    }

    return breakdown;
  }

  /**
   * Reset usage tracking
   */
  reset(): void {
    this.records = [];
  }

  /**
   * Export usage data for analysis
   */
  export(): UsageRecord[] {
    return [...this.records];
  }
}

// Singleton instance
export const usageTracker = new UsageTracker();

/**
 * Estimate cost for an AI operation
 * Based on OpenRouter pricing (approximate)
 */
export function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  // Pricing per 1M tokens (approximate)
  const pricing: Record<string, { input: number; output: number }> = {
    "moonshotai/kimi-k2-thinking": { input: 0.5, output: 2.0 },
    // Add more models as needed
  };

  const modelPricing = pricing[model] || pricing["moonshotai/kimi-k2-thinking"];

  const inputCost = (inputTokens / 1000000) * modelPricing.input;
  const outputCost = (outputTokens / 1000000) * modelPricing.output;

  return inputCost + outputCost;
}

/**
 * Estimate tokens for text (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough approximation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

export default usageTracker;
