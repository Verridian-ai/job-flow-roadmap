# AI Service Module Documentation

Comprehensive OpenRouter AI integration for JobFlow with retry logic, caching, error handling, and usage tracking.

## Features

- **Retry Logic**: Automatic retry with exponential backoff for failed requests
- **Response Caching**: Intelligent caching to reduce API calls and costs
- **Usage Tracking**: Monitor API usage, costs, and enforce rate limits
- **Error Handling**: Graceful error handling with meaningful error messages
- **Multiple Models**: Support for different AI models optimized for specific tasks
- **Timeout Protection**: Automatic timeout handling for long-running requests

## Architecture

```
ai/
├── config.ts        # Configuration and constants
├── cache.ts         # Response caching layer
├── retry.ts         # Retry logic with exponential backoff
├── usage.ts         # Usage tracking and rate limiting
├── service.ts       # Main AI service class
├── actions.ts       # Convex action wrappers
├── index.ts         # Central exports
└── README.md        # This file
```

## Usage

### Basic Resume Generation

```typescript
import { aiService } from "./ai";

const resume = await aiService.generateResume({
  jobDescription: "Software Engineer position...",
  starStories: [
    {
      title: "Led API Migration",
      situation: "Legacy system causing issues",
      task: "Migrate to modern API",
      action: "Led team of 5 engineers...",
      result: "Reduced latency by 60%",
      skills: ["Leadership", "API Design", "Node.js"],
    },
  ],
  candidateName: "John Doe",
  candidateEmail: "john@example.com",
});
```

### Extract STAR Story

```typescript
import { aiService } from "./ai";

const story = await aiService.extractStarStory(
  "I led a project to migrate our legacy API to a modern microservices architecture. The project took 6 months and resulted in 60% faster response times and $100k in cost savings."
);

// Returns:
// {
//   title: "Led API Migration to Microservices",
//   situation: "Legacy monolithic API causing performance issues",
//   task: "Migrate to modern microservices architecture",
//   action: "Led the migration project over 6 months...",
//   result: "Achieved 60% faster response times and $100k cost savings",
//   skills: ["Architecture", "Leadership", "Microservices", "API Design"]
// }
```

### Calculate ATS Score

```typescript
import { aiService } from "./ai";

const analysis = await aiService.calculateATSScore(
  resumeContent,
  jobDescription
);

// Returns:
// {
//   score: 85,
//   feedback: "Strong keyword coverage. Consider adding...",
//   keywordMatches: ["JavaScript", "React", "API"],
//   missingKeywords: ["TypeScript", "GraphQL"]
// }
```

### Generate Cover Letter

```typescript
import { aiService } from "./ai";

const coverLetter = await aiService.generateCoverLetter({
  jobDescription: "Senior Software Engineer...",
  resumeContent: "Professional with 5 years...",
  companyName: "Tech Corp",
  positionTitle: "Senior Software Engineer",
});
```

### Generate Interview Questions

```typescript
import { aiService } from "./ai";

const questions = await aiService.generateInterviewQuestions(
  jobDescription,
  resumeContent
);

// Returns array of:
// {
//   question: "Tell me about a time when you had to debug a complex issue",
//   category: "Behavioral",
//   difficulty: "Medium",
//   tip: "Use your STAR story about the API debugging incident"
// }
```

## Configuration

### Model Selection

Different AI models optimized for different tasks:

```typescript
import { AI_MODELS } from "./ai";

// Resume generation: High quality, creative
AI_MODELS.resume; // temperature: 0.7, maxTokens: 2500

// ATS scoring: Analytical, precise
AI_MODELS.atsScoring; // temperature: 0.3, maxTokens: 1000

// Cover letter: Creative, warm
AI_MODELS.coverLetter; // temperature: 0.8, maxTokens: 1200
```

### Retry Configuration

```typescript
import { RETRY_CONFIG } from "./ai";

// Default retry settings:
RETRY_CONFIG.maxRetries; // 3
RETRY_CONFIG.initialDelayMs; // 1000ms
RETRY_CONFIG.backoffMultiplier; // 2x
```

### Cache Configuration

```typescript
import { CACHE_CONFIG } from "./ai";

// Default cache settings:
CACHE_CONFIG.enabled; // true
CACHE_CONFIG.ttlMs; // 1 hour
CACHE_CONFIG.maxSize; // 100 entries
```

### Rate Limiting

```typescript
import { RATE_LIMIT_CONFIG } from "./ai";

// Default limits:
RATE_LIMIT_CONFIG.maxRequestsPerHour; // 100
RATE_LIMIT_CONFIG.maxRequestsPerDay; // 500
RATE_LIMIT_CONFIG.maxCostPerDay; // $10
```

## Caching

The AI service automatically caches responses to reduce API calls and costs.

### Cache Behavior

- **Resume Generation**: Cached (similar job descriptions get cached resumes)
- **STAR Extraction**: Not cached (always generate fresh)
- **ATS Scoring**: Cached (consistent scoring for same inputs)
- **Cover Letters**: Not cached (always personalized)
- **Interview Questions**: Cached

### Manual Cache Control

```typescript
import { aiCache } from "./ai";

// Get cache stats
const stats = aiCache.getStats();
console.log(`Cache size: ${stats.size}/${stats.maxSize}`);

// Clear specific operation
aiCache.invalidate("resume");

// Clear all cache
aiCache.clear();
```

## Usage Tracking

Monitor API usage and enforce limits:

```typescript
import { usageTracker } from "./ai";

// Get usage statistics
const stats = usageTracker.getStats();
console.log(`Hourly requests: ${stats.hourly.requests}`);
console.log(`Daily cost: $${stats.daily.cost.toFixed(2)}`);

// Get breakdown by operation
const breakdown = usageTracker.getBreakdown();
console.log("Resume generations:", breakdown.resume?.requests);

// Check if limits exceeded
const check = usageTracker.checkLimits();
if (!check.allowed) {
  console.error(check.reason);
}
```

## Error Handling

The service provides graceful error handling:

```typescript
import { aiService } from "./ai";

try {
  const resume = await aiService.generateResume(params);
} catch (error) {
  if (error.message.includes("rate limit")) {
    // Handle rate limit error
  } else if (error.message.includes("timeout")) {
    // Handle timeout error
  } else {
    // Handle other errors
  }
}
```

### Error Types

- `Rate limit exceeded`: Hourly/daily limits reached
- `AI request timed out`: Request took too long
- `AI returned an invalid response`: Response parsing failed
- `AI service is temporarily unavailable`: OpenRouter service issues
- `AI quota exceeded`: Account quota reached

## Retry Logic

Automatic retry with exponential backoff:

```typescript
// Automatically retries on:
// - Network errors
// - Timeout errors
// - Rate limit errors (429)
// - Server errors (500, 502, 503, 504)

// Retry sequence:
// Attempt 1: Immediate
// Attempt 2: Wait 1s + jitter
// Attempt 3: Wait 2s + jitter
// Attempt 4: Wait 4s + jitter (max 3 retries by default)
```

## Advanced Usage

### Custom Retry Options

```typescript
import { withRetry } from "./ai";

const result = await withRetry(
  async () => {
    // Your API call
  },
  {
    maxRetries: 5,
    initialDelayMs: 500,
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt}:`, error.message);
    },
  }
);
```

### Estimate Costs

```typescript
import { estimateCost, estimateTokens } from "./ai";

const text = "Your prompt text here";
const inputTokens = estimateTokens(text);
const outputTokens = 500; // Estimated output

const cost = estimateCost("moonshotai/kimi-k2-thinking", inputTokens, outputTokens);
console.log(`Estimated cost: $${cost.toFixed(4)}`);
```

## Convex Actions

Use AI features in Convex:

```typescript
import { api } from "../_generated/api";

// In a mutation
export const createResumeWithAI = mutation({
  handler: async (ctx, args) => {
    const resume = await ctx.runAction(api.ai.generateResume, {
      jobDescription: args.jobDescription,
      starStories: args.starStories,
      candidateName: user.name,
      candidateEmail: user.email,
    });

    // Save to database
    return await ctx.db.insert("resumes", {
      content: resume,
      // ...other fields
    });
  },
});
```

## Monitoring

### Usage Dashboard

```typescript
import { aiService } from "./ai";

// Get comprehensive stats
const usageStats = aiService.getUsageStats();
const cacheStats = aiService.getCacheStats();

console.log("AI Usage:", usageStats);
console.log("Cache:", cacheStats);
```

### Export Usage Data

```typescript
import { usageTracker } from "./ai";

// Export for analysis
const records = usageTracker.export();

// Process records
const totalCost = records.reduce((sum, r) => sum + r.cost, 0);
console.log(`Total cost: $${totalCost.toFixed(2)}`);
```

## Best Practices

### 1. Use Appropriate Models

Choose the right model for each task:

- Resume generation: Use `resume` model (creative)
- ATS scoring: Use `atsScoring` model (analytical)
- Cover letters: Use `coverLetter` model (warm)

### 2. Leverage Caching

- Cache stable operations (ATS scoring, interview questions)
- Skip cache for personalized content (cover letters)

### 3. Monitor Usage

- Check usage stats regularly
- Set up alerts for quota limits
- Review cost breakdowns monthly

### 4. Handle Errors Gracefully

- Always catch and handle errors
- Provide user-friendly error messages
- Log errors for debugging

### 5. Optimize Prompts

- Keep prompts concise but detailed
- Include relevant context only
- Test different prompt variations

## Integration Checklist

- [ ] Configure OpenRouter API key in environment
- [ ] Set up usage monitoring
- [ ] Configure rate limits
- [ ] Test error handling
- [ ] Review cache behavior
- [ ] Monitor costs and usage
- [ ] Set up alerts for limits

## Cost Optimization

1. **Enable caching** for repetitive operations
2. **Monitor usage** to identify expensive operations
3. **Use appropriate models** (don't use expensive models for simple tasks)
4. **Batch operations** when possible
5. **Set rate limits** to prevent runaway costs

## Troubleshooting

### High Costs

- Check usage breakdown by operation
- Review cache hit rate
- Verify rate limits are configured
- Look for unnecessary API calls

### Slow Responses

- Check timeout configuration
- Review retry attempts
- Verify network connectivity
- Check OpenRouter status

### Cache Misses

- Verify cache is enabled
- Check cache size and TTL
- Review cache key generation
- Monitor cache statistics

## Support

For issues or questions:
- Check error logs
- Review usage statistics
- Consult OpenRouter documentation
- Contact support team

---

## License

Part of the JobFlow application AI infrastructure.
