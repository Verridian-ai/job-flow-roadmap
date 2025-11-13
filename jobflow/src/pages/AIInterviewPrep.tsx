import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Link } from 'react-router-dom';

type InterviewStage = 'setup' | 'interviewing' | 'review';

interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface InterviewResponse {
  questionId: string;
  question: string;
  answer: string;
  duration: number;
  feedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
    starAlignment: boolean;
  };
}

export default function AIInterviewPrep() {
  const { user } = useUser();
  const [stage, setStage] = useState<InterviewStage>('setup');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [interviewType, setInterviewType] = useState<'behavioral' | 'technical' | 'mixed'>('behavioral');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateQuestions = useMutation(api.ai.actions.generateInterviewQuestions);

  useEffect(() => {
    if (isRecording && startTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, startTime]);

  const handleStartInterview = async () => {
    if (!jobTitle || !jobDescription) {
      alert('Please fill in the job title and description');
      return;
    }

    try {
      const result = await generateQuestions({
        jobDescription,
        resumeContent: '', // Could fetch user's resume here
      });

      // Mock questions for now
      const mockQuestions: InterviewQuestion[] = [
        {
          id: '1',
          question: 'Tell me about a time you had to deal with a difficult stakeholder.',
          category: 'Leadership',
          difficulty: 'medium',
        },
        {
          id: '2',
          question: 'Describe a situation where you had to make a decision with incomplete information.',
          category: 'Problem Solving',
          difficulty: 'hard',
        },
        {
          id: '3',
          question: 'How do you prioritize tasks when everything seems urgent?',
          category: 'Time Management',
          difficulty: 'easy',
        },
        {
          id: '4',
          question: 'Walk me through a project where you had to collaborate with cross-functional teams.',
          category: 'Teamwork',
          difficulty: 'medium',
        },
        {
          id: '5',
          question: 'Tell me about a time when you failed and what you learned from it.',
          category: 'Growth Mindset',
          difficulty: 'medium',
        },
      ];

      setQuestions(mockQuestions);
      setStage('interviewing');
      setCurrentQuestionIndex(0);
      setStartTime(Date.now());
      setElapsedTime(0);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate interview questions. Please try again.');
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setStartTime(Date.now());
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert('Please provide an answer before submitting');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    setIsGeneratingFeedback(true);

    // Mock feedback generation
    setTimeout(() => {
      const newResponse: InterviewResponse = {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        answer: currentAnswer,
        duration,
        feedback: {
          score: Math.floor(Math.random() * 30) + 70,
          strengths: [
            'Clear communication',
            'Good use of specific examples',
            'Demonstrated impact',
          ],
          improvements: [
            'Could elaborate more on the challenges faced',
            'Quantify results when possible',
          ],
          starAlignment: true,
        },
      };

      setResponses([...responses, newResponse]);
      setCurrentAnswer('');
      setIsGeneratingFeedback(false);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setStartTime(Date.now());
        setElapsedTime(0);
      } else {
        setStage('review');
      }
    }, 2000);
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
      setStartTime(Date.now());
      setElapsedTime(0);
    } else {
      setStage('review');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const averageScore = responses.length > 0
    ? Math.round(responses.reduce((sum, r) => sum + (r.feedback?.score || 0), 0) / responses.length)
    : 0;

  if (stage === 'setup') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-3 border-b border-zinc-800 bg-zinc-900">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-yellow-400 hover:text-yellow-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
              </svg>
            </Link>
            <h2 className="text-white text-lg font-bold">AI Interview Preparation</h2>
          </div>
        </header>

        {/* Setup Form */}
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl bg-zinc-900 rounded-xl border border-zinc-800 p-8">
            <h1 className="text-white text-3xl font-bold mb-2">Setup Your Mock Interview</h1>
            <p className="text-zinc-400 mb-8">Prepare for your upcoming interview with AI-powered practice questions and real-time feedback.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Product Manager"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-950 text-white border border-zinc-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description or key requirements..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-950 text-white border border-zinc-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none placeholder:text-zinc-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Interview Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'behavioral', label: 'Behavioral' },
                    { value: 'technical', label: 'Technical' },
                    { value: 'mixed', label: 'Mixed' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setInterviewType(type.value as any)}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                        interviewType === type.value
                          ? 'bg-yellow-400 text-zinc-900'
                          : 'bg-zinc-950 text-white border border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartInterview}
                className="w-full px-6 py-4 rounded-lg bg-yellow-400 text-zinc-900 font-bold text-lg hover:bg-yellow-300 transition-colors mt-8"
              >
                Start Interview
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (stage === 'interviewing') {
    const currentQuestion = questions[currentQuestionIndex];
    const totalElapsed = responses.reduce((sum, r) => sum + r.duration, 0) + elapsedTime;

    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-3 border-b border-zinc-800 bg-zinc-900">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-yellow-400 hover:text-yellow-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
              </svg>
            </Link>
            <div>
              <h2 className="text-white text-lg font-bold">Mock Interview: {jobTitle}</h2>
              <p className="text-zinc-400 text-sm">
                Question {currentQuestionIndex + 1}/{questions.length} | Time Elapsed: {formatTime(totalElapsed)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setStage('review')}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
          >
            End Interview
          </button>
        </header>

        {/* Interview Interface */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Question Display */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-semibold">
                      {currentQuestion.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                  <p className="text-white text-xl font-medium leading-relaxed">{currentQuestion.question}</p>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2 text-zinc-400 text-sm mt-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Time on this question: {formatTime(elapsedTime)}</span>
              </div>
            </div>

            {/* Answer Input */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-6">
              <label className="block text-white text-sm font-medium mb-3">Your Answer</label>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here using the STAR format (Situation, Task, Action, Result)..."
                rows={10}
                className="w-full px-4 py-3 rounded-lg bg-zinc-950 text-white border border-zinc-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none placeholder:text-zinc-500 resize-none"
                disabled={isGeneratingFeedback}
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleStartRecording}
                    disabled={isRecording || isGeneratingFeedback}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                    {isRecording ? 'Recording...' : 'Record Answer'}
                  </button>
                  {isRecording && (
                    <button
                      onClick={handleStopRecording}
                      className="px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                    >
                      Stop
                    </button>
                  )}
                </div>
                <p className="text-zinc-500 text-sm">{currentAnswer.length} characters</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleSkipQuestion}
                disabled={isGeneratingFeedback}
                className="px-6 py-3 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
              >
                Skip Question
              </button>
              <button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || isGeneratingFeedback}
                className="px-8 py-3 rounded-lg bg-yellow-400 text-zinc-900 font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingFeedback ? 'Analyzing...' : 'Submit & Continue'}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Review Stage
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-3 border-b border-zinc-800 bg-zinc-900">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-yellow-400 hover:text-yellow-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
            </svg>
          </Link>
          <h2 className="text-white text-lg font-bold">Interview Review</h2>
        </div>
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded-lg bg-yellow-400 text-zinc-900 font-bold hover:bg-yellow-300 transition-colors"
        >
          Back to Dashboard
        </Link>
      </header>

      {/* Review Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Overall Score */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-white text-2xl font-bold mb-6">Interview Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle className="stroke-current text-zinc-800" cx="18" cy="18" fill="none" r="16" strokeWidth="3" />
                    <circle
                      className="stroke-current text-yellow-400"
                      cx="18"
                      cy="18"
                      fill="none"
                      r="16"
                      strokeDasharray="100"
                      strokeDashoffset={100 - averageScore}
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-yellow-400">{averageScore}%</span>
                  </div>
                </div>
                <p className="text-white font-semibold">Overall Score</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-4xl font-black text-white mb-2">{responses.length}</p>
                <p className="text-zinc-400">Questions Answered</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-4xl font-black text-white mb-2">
                  {formatTime(responses.reduce((sum, r) => sum + r.duration, 0))}
                </p>
                <p className="text-zinc-400">Total Time</p>
              </div>
            </div>
          </div>

          {/* Individual Responses */}
          <h3 className="text-white text-xl font-bold mb-4">Response Breakdown</h3>
          <div className="space-y-4">
            {responses.map((response, idx) => (
              <div key={response.questionId} className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-2">Question {idx + 1}</p>
                    <p className="text-zinc-300">{response.question}</p>
                  </div>
                  {response.feedback && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400/20">
                      <span className="text-2xl font-bold text-yellow-400">{response.feedback.score}%</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-zinc-400 text-sm mb-2">Your Answer:</p>
                  <p className="text-white bg-zinc-950 rounded-lg p-4">{response.answer}</p>
                </div>

                {response.feedback && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-green-400 font-semibold mb-2">Strengths:</p>
                      <ul className="space-y-1">
                        {response.feedback.strengths.map((strength, i) => (
                          <li key={i} className="text-zinc-300 text-sm flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-yellow-400 font-semibold mb-2">Areas for Improvement:</p>
                      <ul className="space-y-1">
                        {response.feedback.improvements.map((improvement, i) => (
                          <li key={i} className="text-zinc-300 text-sm flex items-start gap-2">
                            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => {
                setStage('setup');
                setResponses([]);
                setCurrentQuestionIndex(0);
                setCurrentAnswer('');
              }}
              className="flex-1 px-6 py-3 rounded-lg bg-yellow-400 text-zinc-900 font-bold hover:bg-yellow-300 transition-colors"
            >
              Start New Interview
            </button>
            <button className="flex-1 px-6 py-3 rounded-lg bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors">
              Save & Export Report
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
