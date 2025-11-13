import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  Sparkles,
  Target,
  Award,
  FileText,
  Zap,
  Eye,
  FileSearch,
  AlertTriangle,
  Info,
  ArrowRight,
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface ATSAnalysisDetail {
  score: number;
  categories: {
    formatting: {
      score: number;
      issues: Array<{ severity: 'critical' | 'warning' | 'info'; message: string }>;
    };
    keywords: {
      score: number;
      matched: string[];
      missing: string[];
      density: number;
    };
    content: {
      score: number;
      issues: Array<{ severity: 'critical' | 'warning' | 'info'; message: string }>;
    };
    structure: {
      score: number;
      issues: Array<{ severity: 'critical' | 'warning' | 'info'; message: string }>;
    };
  };
  industryKeywords: {
    category: string;
    keywords: string[];
    importance: 'high' | 'medium' | 'low';
  }[];
  improvements: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    message: string;
    impact: string;
  }>;
  comparisons: {
    industryAverage: number;
    topPerformer: number;
    yourScore: number;
  };
}

export default function ATSOptimization() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id') as Id<'resumes'> | null;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<ATSAnalysisDetail | null>(null);

  const resume = useQuery(api.resumes.getById, resumeId ? { id: resumeId } : 'skip');
  const analyzeDetailed = useMutation(api.resumes.analyzeDetailedATS);

  useEffect(() => {
    if (resumeId) {
      performAnalysis();
    }
  }, [resumeId]);

  const performAnalysis = async () => {
    if (!resumeId) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeDetailed({ id: resumeId });
      setAnalysisData(result as ATSAnalysisDetail);
    } catch (error) {
      console.error('Failed to analyze resume:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/50';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertCircle;
    return XCircle;
  };

  const getSeverityIcon = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return XCircle;
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Info;
    }
  };

  const getSeverityColor = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
    }
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  if (!resumeId) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Resume Selected</h2>
                <p className="text-gray-400">
                  Please select a resume to view its ATS optimization analysis.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!resume || isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <p className="text-gray-400">
                  {isAnalyzing ? 'Analyzing your resume...' : 'Loading resume...'}
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const overallScore = analysisData?.score ?? resume.atsScore ?? 0;
  const ScoreIcon = getScoreIcon(overallScore);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <Target className="w-8 h-8 text-yellow-500" />
                    ATS Optimization Dashboard
                  </h1>
                  <p className="text-gray-400">
                    Detailed analysis for: <span className="text-white font-semibold">{resume.title}</span>
                  </p>
                </div>
                <button
                  onClick={performAnalysis}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Re-analyze
                </button>
              </div>
            </div>

            {/* Overall Score Card */}
            <div className={`rounded-lg border p-8 mb-8 ${getScoreBg(overallScore)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative flex items-center justify-center w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="stroke-current text-gray-700"
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="42"
                        strokeWidth="8"
                      />
                      <circle
                        className={`stroke-current ${getScoreColor(overallScore).replace('text-', 'text-')} transition-all duration-500`}
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="42"
                        strokeDasharray="264"
                        strokeDashoffset={264 - (264 * overallScore) / 100}
                        strokeLinecap="round"
                        strokeWidth="8"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                        {overallScore}
                      </span>
                      <span className="text-sm text-gray-400">/ 100</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <ScoreIcon className={`w-7 h-7 ${getScoreColor(overallScore)}`} />
                      {overallScore >= 80
                        ? 'Excellent ATS Compatibility'
                        : overallScore >= 60
                        ? 'Good ATS Compatibility'
                        : 'Needs Improvement'}
                    </h2>
                    <p className="text-gray-300 max-w-xl">
                      {overallScore >= 80
                        ? 'Your resume is highly optimized for Applicant Tracking Systems and has excellent chances of passing automated screening.'
                        : overallScore >= 60
                        ? 'Your resume has good ATS compatibility. Implementing the suggestions below will further improve your chances.'
                        : 'Your resume needs significant improvements to pass through ATS systems effectively. Follow the high-priority recommendations below.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/resume-refinement?id=${resumeId}`)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition inline-flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Edit Resume
                </button>
              </div>
            </div>

            {/* Industry Comparison */}
            {analysisData?.comparisons && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-yellow-500" />
                  Industry Comparison
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Your Score</p>
                    <p className={`text-3xl font-bold ${getScoreColor(analysisData.comparisons.yourScore)}`}>
                      {analysisData.comparisons.yourScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Industry Average</p>
                    <p className="text-3xl font-bold text-gray-300">
                      {analysisData.comparisons.industryAverage}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Top Performers</p>
                    <p className="text-3xl font-bold text-green-400">
                      {analysisData.comparisons.topPerformer}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            {analysisData?.categories && (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Formatting */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <FileSearch className="w-5 h-5 text-yellow-500" />
                      Formatting
                    </h3>
                    <span className={`text-2xl font-bold ${getScoreColor(analysisData.categories.formatting.score)}`}>
                      {analysisData.categories.formatting.score}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {analysisData.categories.formatting.issues.map((issue, index) => {
                      const IssueIcon = getSeverityIcon(issue.severity);
                      return (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <IssueIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${getSeverityColor(issue.severity)}`} />
                          <span className="text-gray-300">{issue.message}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Keywords */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Keywords
                    </h3>
                    <span className={`text-2xl font-bold ${getScoreColor(analysisData.categories.keywords.score)}`}>
                      {analysisData.categories.keywords.score}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Keyword Density</p>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition-all"
                          style={{ width: `${analysisData.categories.keywords.density}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {analysisData.categories.keywords.density}% (Optimal: 2-3%)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">
                        Matched: {analysisData.categories.keywords.matched.length}
                      </p>
                      <p className="text-sm text-gray-400">
                        Missing: {analysisData.categories.keywords.missing.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-yellow-500" />
                      Content Quality
                    </h3>
                    <span className={`text-2xl font-bold ${getScoreColor(analysisData.categories.content.score)}`}>
                      {analysisData.categories.content.score}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {analysisData.categories.content.issues.map((issue, index) => {
                      const IssueIcon = getSeverityIcon(issue.severity);
                      return (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <IssueIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${getSeverityColor(issue.severity)}`} />
                          <span className="text-gray-300">{issue.message}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Structure */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Structure
                    </h3>
                    <span className={`text-2xl font-bold ${getScoreColor(analysisData.categories.structure.score)}`}>
                      {analysisData.categories.structure.score}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {analysisData.categories.structure.issues.map((issue, index) => {
                      const IssueIcon = getSeverityIcon(issue.severity);
                      return (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <IssueIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${getSeverityColor(issue.severity)}`} />
                          <span className="text-gray-300">{issue.message}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Improvement Recommendations */}
            {analysisData?.improvements && analysisData.improvements.length > 0 && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  Prioritized Improvements
                </h3>
                <div className="space-y-4">
                  {analysisData.improvements.map((improvement, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityBadge(improvement.priority)}`}
                        >
                          {improvement.priority.toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-400">
                              {improvement.category}
                            </span>
                          </div>
                          <p className="text-white mb-2">{improvement.message}</p>
                          <p className="text-sm text-green-400 flex items-center gap-2">
                            <ArrowRight className="w-4 h-4" />
                            Impact: {improvement.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Industry Keywords */}
            {analysisData?.industryKeywords && analysisData.industryKeywords.length > 0 && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-yellow-500" />
                  Industry-Specific Keywords
                </h3>
                <div className="space-y-4">
                  {analysisData.industryKeywords.map((category, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-semibold">{category.category}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            category.importance === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : category.importance === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {category.importance} priority
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.keywords.map((keyword, kidx) => (
                          <span
                            key={kidx}
                            className="px-3 py-1 bg-gray-700 rounded-full text-sm hover:bg-gray-600 transition cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(keyword);
                              alert(`Copied "${keyword}" to clipboard`);
                            }}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Click on any keyword to copy it to your clipboard
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
