/**
 * AI Service Layer
 * Main service for OpenRouter AI integration with retry, caching, and monitoring
 */

import {
  OPENROUTER_CONFIG,
  AI_MODELS,
  TIMEOUT_CONFIG,
  ERROR_MESSAGES,
} from "./config";
import { aiCache } from "./cache";
import { withRetryAndTimeout } from "./retry";
import { usageTracker, estimateCost, estimateTokens } from "./usage";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export type AIOperationType =
  | "resume"
  | "starExtraction"
  | "atsScoring"
  | "coverLetter"
  | "interviewQuestions"
  | "suggestions";

/**
 * Main AI service class
 */
export class AIService {
  /**
   * Call OpenRouter API with retry and timeout
   */
  private async callOpenRouter(
    messages: AIMessage[],
    operationType: AIOperationType
  ): Promise<string> {
    // Check usage limits
    const limitCheck = usageTracker.checkLimits();
    if (!limitCheck.allowed) {
      throw new Error(`${ERROR_MESSAGES.rateLimitExceeded} ${limitCheck.reason}`);
    }

    // Get model configuration
    const modelConfig = AI_MODELS[operationType];

    // Make API call with retry and timeout
    const response = await withRetryAndTimeout(
      async () => {
        const res = await fetch(OPENROUTER_CONFIG.baseUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_CONFIG.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": OPENROUTER_CONFIG.referer,
            "X-Title": OPENROUTER_CONFIG.title,
          },
          body: JSON.stringify({
            model: modelConfig.model,
            messages,
            temperature: modelConfig.temperature,
            max_tokens: modelConfig.maxTokens,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `OpenRouter API error: ${response.status} - ${errorText}`
          );
        }

        return response.json();
      },
      TIMEOUT_CONFIG.requestTimeoutMs
    );

    const data = response as OpenRouterResponse;
    const content = data.choices[0]?.message?.content || "";

    // Track usage
    if (data.usage) {
      const cost = estimateCost(
        modelConfig.model,
        data.usage.prompt_tokens,
        data.usage.completion_tokens
      );

      usageTracker.record(
        operationType,
        modelConfig.model,
        data.usage.prompt_tokens,
        data.usage.completion_tokens,
        cost
      );
    }

    return content;
  }

  /**
   * Execute an AI operation with caching
   */
  async execute<T>(
    operationType: AIOperationType,
    messages: AIMessage[],
    params: Record<string, unknown>,
    parseResponse: (response: string) => T,
    skipCache: boolean = false
  ): Promise<T> {
    // Try to get from cache
    if (!skipCache) {
      const cached = aiCache.get<T>(operationType, params);
      if (cached !== null) {
        console.log(`[AI Service] Cache hit for ${operationType}`);
        return cached;
      }
    }

    // Call AI service
    console.log(`[AI Service] Calling AI for ${operationType}`);
    const response = await this.callOpenRouter(messages, operationType);

    // Parse response
    let parsed: T;
    try {
      parsed = parseResponse(response);
    } catch (error) {
      throw new Error(`${ERROR_MESSAGES.invalidResponse} ${(error as Error).message}`);
    }

    // Cache result
    if (!skipCache) {
      aiCache.set(operationType, params, parsed);
    }

    return parsed;
  }

  /**
   * Generate resume
   */
  async generateResume(params: {
    jobDescription: string;
    starStories: Array<{
      title: string;
      situation: string;
      task: string;
      action: string;
      result: string;
      skills: string[];
    }>;
    candidateName: string;
    candidateEmail: string;
  }): Promise<string> {
    const storiesText = params.starStories
      .map(
        (story, index) => `
STAR Story ${index + 1}: ${story.title}
- Situation: ${story.situation}
- Task: ${story.task}
- Action: ${story.action}
- Result: ${story.result}
- Skills: ${story.skills.join(", ")}
`
      )
      .join("\n");

    const prompt = `You are an expert resume writer specializing in ATS-optimized resumes. Generate a professional, compelling resume based on the following information:

JOB DESCRIPTION:
${params.jobDescription}

CANDIDATE STAR STORIES:
${storiesText}

CANDIDATE INFO:
Name: ${params.candidateName}
Email: ${params.candidateEmail}

Generate a complete, ATS-optimized resume in plain text format that:
1. Highlights relevant skills from the STAR stories that match the job description
2. Uses powerful action verbs and quantifiable achievements
3. Includes a compelling professional summary
4. Organizes experience in reverse chronological order
5. Emphasizes keywords from the job description
6. Formats cleanly for ATS systems

Format the resume with clear sections: PROFESSIONAL SUMMARY, SKILLS, PROFESSIONAL EXPERIENCE, and EDUCATION (placeholder).`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content:
          "You are an expert ATS-optimized resume writer. Create professional, compelling resumes that pass applicant tracking systems and impress hiring managers.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    return this.execute<string>(
      "resume",
      messages,
      params,
      (response) => response,
      false // Cache resume generation
    );
  }

  /**
   * Extract STAR story from user input
   */
  async extractStarStory(userInput: string): Promise<{
    title: string;
    situation: string;
    task: string;
    action: string;
    result: string;
    skills: string[];
  }> {
    const prompt = `You are an expert career coach helping extract professional accomplishments into the STAR method format (Situation, Task, Action, Result).

The user has shared the following experience:
"${userInput}"

Extract this into a STAR story with the following structure:
1. Title: A brief, compelling title for this accomplishment
2. Situation: The context and background
3. Task: What needed to be accomplished or the challenge faced
4. Action: Specific actions taken (use "I" statements)
5. Result: Measurable outcomes and impact
6. Skills: List of relevant professional skills demonstrated (3-7 skills)

Return ONLY a JSON object with this structure:
{
  "title": "...",
  "situation": "...",
  "task": "...",
  "action": "...",
  "result": "...",
  "skills": ["skill1", "skill2", ...]
}`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content:
          "You are an expert career coach specializing in the STAR method. Extract professional accomplishments into well-structured STAR stories. Return only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    return this.execute(
      "starExtraction",
      messages,
      { userInput },
      (response) => {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No valid JSON found in response");
        }
        return JSON.parse(jsonMatch[0]);
      },
      true // Don't cache extraction (always generate fresh)
    );
  }

  /**
   * Calculate ATS score
   */
  async calculateATSScore(
    resumeContent: string,
    jobDescription: string
  ): Promise<{
    score: number;
    feedback: string;
    keywordMatches: string[];
    missingKeywords: string[];
  }> {
    const prompt = `You are an ATS (Applicant Tracking System) analyzer. Compare this resume against the job description and provide an ATS compatibility score.

RESUME:
${resumeContent}

JOB DESCRIPTION:
${jobDescription}

Analyze the resume and return ONLY a JSON object with this structure:
{
  "score": 85,
  "feedback": "Your resume has good keyword coverage. Consider adding: [specific keywords]. Strengths: [what's working well].",
  "keywordMatches": ["keyword1", "keyword2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...]
}

The score should be 0-100 based on:
- Keyword match (40%)
- Skills alignment (30%)
- Format compatibility (20%)
- Relevance (10%)`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content:
          "You are an ATS analysis expert. Analyze resumes for ATS compatibility and provide actionable feedback. Return only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    return this.execute(
      "atsScoring",
      messages,
      { resumeContent, jobDescription },
      (response) => {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No valid JSON found in response");
        }
        return JSON.parse(jsonMatch[0]);
      },
      false // Cache ATS scoring
    );
  }

  /**
   * Generate cover letter
   */
  async generateCoverLetter(params: {
    jobDescription: string;
    resumeContent: string;
    companyName: string;
    positionTitle: string;
  }): Promise<string> {
    const prompt = `Generate a professional, compelling cover letter for the following:

POSITION: ${params.positionTitle}
COMPANY: ${params.companyName}

JOB DESCRIPTION:
${params.jobDescription}

CANDIDATE RESUME:
${params.resumeContent}

Create a cover letter that:
1. Opens with a strong hook showing enthusiasm and fit
2. Highlights 2-3 key accomplishments from the resume that align with the job
3. Demonstrates knowledge of the company (use general professional language)
4. Closes with a clear call to action
5. Is concise (250-350 words)
6. Uses professional but warm tone

Format as a complete cover letter ready to send.`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content:
          "You are an expert cover letter writer. Create compelling, personalized cover letters that get interviews.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    return this.execute(
      "coverLetter",
      messages,
      params,
      (response) => response,
      true // Don't cache cover letters (always personalized)
    );
  }

  /**
   * Generate interview questions
   */
  async generateInterviewQuestions(
    jobDescription: string,
    resumeContent: string
  ): Promise<
    Array<{
      question: string;
      category: string;
      difficulty: string;
      tip: string;
    }>
  > {
    const prompt = `Based on this job description and resume, generate 10 likely interview questions the candidate should prepare for.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeContent}

Return ONLY a JSON array of questions with this structure:
[
  {
    "question": "Tell me about a time when...",
    "category": "Behavioral",
    "difficulty": "Medium",
    "tip": "Focus on your STAR story about..."
  }
]

Categories: Behavioral, Technical, Situational, Cultural Fit
Difficulty: Easy, Medium, Hard`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content:
          "You are an expert interview coach. Generate relevant interview questions based on job descriptions and candidate backgrounds. Return only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    return this.execute(
      "interviewQuestions",
      messages,
      { jobDescription, resumeContent },
      (response) => {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error("No valid JSON found in response");
        }
        return JSON.parse(jsonMatch[0]);
      },
      false // Cache interview questions
    );
  }

  /**
   * Get usage statistics
   */
  getUsageStats() {
    return usageTracker.getStats();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return aiCache.getStats();
  }

  /**
   * Clear cache
   */
  clearCache() {
    aiCache.clear();
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;
