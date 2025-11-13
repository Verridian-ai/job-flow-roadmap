import { action } from "./_generated/server";
import { v } from "convex/values";

// OpenRouter AI Integration using Moonshot AI Kimi K2 Thinking model
// API Key: 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
const OPENROUTER_API_KEY = "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";
const MODEL = "moonshotai/kimi-k2-thinking";

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

async function callOpenRouter(messages: OpenRouterMessage[]): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://jobflow.app",
      "X-Title": "JobFlow AI Resume Generator",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0]?.message?.content || "";
}

export const generateResume = action({
  args: {
    jobDescription: v.string(),
    starStories: v.array(v.object({
      title: v.string(),
      situation: v.string(),
      task: v.string(),
      action: v.string(),
      result: v.string(),
      skills: v.array(v.string()),
    })),
    candidateName: v.string(),
    candidateEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const storiesText = args.starStories
      .map((story, index) => `
STAR Story ${index + 1}: ${story.title}
- Situation: ${story.situation}
- Task: ${story.task}
- Action: ${story.action}
- Result: ${story.result}
- Skills: ${story.skills.join(", ")}
`)
      .join("\n");

    const prompt = `You are an expert resume writer specializing in ATS-optimized resumes. Generate a professional, compelling resume based on the following information:

JOB DESCRIPTION:
${args.jobDescription}

CANDIDATE STAR STORIES:
${storiesText}

CANDIDATE INFO:
Name: ${args.candidateName}
Email: ${args.candidateEmail}

Generate a complete, ATS-optimized resume in plain text format that:
1. Highlights relevant skills from the STAR stories that match the job description
2. Uses powerful action verbs and quantifiable achievements
3. Includes a compelling professional summary
4. Organizes experience in reverse chronological order
5. Emphasizes keywords from the job description
6. Formats cleanly for ATS systems

Format the resume with clear sections: PROFESSIONAL SUMMARY, SKILLS, PROFESSIONAL EXPERIENCE, and EDUCATION (placeholder).`;

    const messages: OpenRouterMessage[] = [
      {
        role: "system",
        content: "You are an expert ATS-optimized resume writer. Create professional, compelling resumes that pass applicant tracking systems and impress hiring managers.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const resumeContent = await callOpenRouter(messages);
    return resumeContent;
  },
});

export const extractStarStory = action({
  args: {
    userInput: v.string(),
  },
  handler: async (ctx, args) => {
    const prompt = `You are an expert career coach helping extract professional accomplishments into the STAR method format (Situation, Task, Action, Result).

The user has shared the following experience:
"${args.userInput}"

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

    const messages: OpenRouterMessage[] = [
      {
        role: "system",
        content: "You are an expert career coach specializing in the STAR method. Extract professional accomplishments into well-structured STAR stories. Return only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await callOpenRouter(messages);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
      throw new Error("No valid JSON found in response");
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error}`);
    }
  },
});

export const calculateATSScore = action({
  args: {
    resumeContent: v.string(),
    jobDescription: v.string(),
  },
  handler: async (ctx, args) => {
    const prompt = `You are an ATS (Applicant Tracking System) analyzer. Compare this resume against the job description and provide an ATS compatibility score.

RESUME:
${args.resumeContent}

JOB DESCRIPTION:
${args.jobDescription}

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

    const messages: OpenRouterMessage[] = [
      {
        role: "system",
        content: "You are an ATS analysis expert. Analyze resumes for ATS compatibility and provide actionable feedback. Return only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await callOpenRouter(messages);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
      throw new Error("No valid JSON found in response");
    } catch (error) {
      throw new Error(`Failed to parse ATS analysis: ${error}`);
    }
  },
});

export const generateCoverLetter = action({
  args: {
    jobDescription: v.string(),
    resumeContent: v.string(),
    companyName: v.string(),
    positionTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const prompt = `Generate a professional, compelling cover letter for the following:

POSITION: ${args.positionTitle}
COMPANY: ${args.companyName}

JOB DESCRIPTION:
${args.jobDescription}

CANDIDATE RESUME:
${args.resumeContent}

Create a cover letter that:
1. Opens with a strong hook showing enthusiasm and fit
2. Highlights 2-3 key accomplishments from the resume that align with the job
3. Demonstrates knowledge of the company (use general professional language)
4. Closes with a clear call to action
5. Is concise (250-350 words)
6. Uses professional but warm tone

Format as a complete cover letter ready to send.`;

    const messages: OpenRouterMessage[] = [
      {
        role: "system",
        content: "You are an expert cover letter writer. Create compelling, personalized cover letters that get interviews.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const coverLetter = await callOpenRouter(messages);
    return coverLetter;
  },
});

export const generateInterviewQuestions = action({
  args: {
    jobDescription: v.string(),
    resumeContent: v.string(),
  },
  handler: async (ctx, args) => {
    const prompt = `Based on this job description and resume, generate 10 likely interview questions the candidate should prepare for.

JOB DESCRIPTION:
${args.jobDescription}

CANDIDATE RESUME:
${args.resumeContent}

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

    const messages: OpenRouterMessage[] = [
      {
        role: "system",
        content: "You are an expert interview coach. Generate relevant interview questions based on job descriptions and candidate backgrounds. Return only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await callOpenRouter(messages);
    
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
      throw new Error("No valid JSON found in response");
    } catch (error) {
      throw new Error(`Failed to parse interview questions: ${error}`);
    }
  },
});
