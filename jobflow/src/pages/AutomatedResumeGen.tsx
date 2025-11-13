import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Id } from '../../convex/_generated/dataModel';

interface StarStory {
  _id: Id<'starStories'>;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  skills: string[];
}

interface GeneratedResume {
  content: string;
  atsScore: number;
  keywordMatches: Array<{ keyword: string; frequency: number }>;
  suggestions: string[];
}

export default function AutomatedResumeGen() {
  const { user } = useUser();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [generatedResume, setGeneratedResume] = useState<GeneratedResume | null>(null);
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());

  const stories = useQuery(api.starStories.list, {}) as StarStory[] | undefined;
  const generateResume = useMutation(api.ai.actions.generateResume);
  const calculateATS = useMutation(api.ai.actions.calculateATSScore);

  const handleAnalyzeJobDescription = async () => {
    if (!jobDescription.trim()) {
      alert('Please paste a job description first');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Mock analysis - in production, this would call an AI action
      setTimeout(() => {
        setAnalysisResults({
          keySkills: ['React', 'Node.js', 'TypeScript', 'UI/UX', 'Agile'],
          keywords: ['Leadership', 'API', 'Full-stack'],
          experienceLevel: 'Senior (5+ years)',
          recommendedStories: stories?.slice(0, 3).map(s => s._id) || [],
        });
        setIsAnalyzing(false);
      }, 2000);
    } catch (error) {
      console.error('Error analyzing job description:', error);
      alert('Failed to analyze job description. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!analysisResults || selectedStories.size === 0) {
      alert('Please analyze the job description and select at least one STAR story');
      return;
    }

    setIsGenerating(true);
    try {
      const selectedStoriesData = stories?.filter(s => selectedStories.has(s._id)) || [];

      const result = await generateResume({
        jobDescription,
        starStories: selectedStoriesData.map(s => ({
          title: s.title,
          situation: s.situation,
          task: s.task,
          action: s.action,
          result: s.result,
          skills: s.skills,
        })),
        candidateName: user?.fullName || 'Candidate Name',
        candidateEmail: user?.primaryEmailAddress?.emailAddress || 'email@example.com',
      });

      const atsResult = await calculateATS({
        resumeContent: result.resumeContent,
        jobDescription,
      });

      setGeneratedResume({
        content: result.resumeContent,
        atsScore: atsResult.score,
        keywordMatches: atsResult.keywordMatches || [],
        suggestions: atsResult.suggestions || [],
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleStorySelection = (storyId: string) => {
    const newSelected = new Set(selectedStories);
    if (newSelected.has(storyId)) {
      newSelected.delete(storyId);
    } else {
      newSelected.add(storyId);
    }
    setSelectedStories(newSelected);
  };

  const handleDownload = (format: 'pdf' | 'docx' | 'txt') => {
    if (!generatedResume) return;

    // Create a blob and download
    const blob = new Blob([generatedResume.content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-3 border-b border-zinc-800 bg-zinc-900">
        <div className="flex items-center gap-4 text-white">
          <Link to="/dashboard" className="text-yellow-400 hover:text-yellow-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
            </svg>
          </Link>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight">AI Resume Writer</h2>
        </div>
        <div className="flex items-center gap-9">
          <Link to="/dashboard" className="text-white text-sm font-medium hover:text-yellow-400 transition-colors">
            Dashboard
          </Link>
          <Link to="/resumes" className="text-yellow-400 text-sm font-bold">
            My Resumes
          </Link>
          <Link to="/ai-resume-chat" className="text-white text-sm font-medium hover:text-yellow-400 transition-colors">
            AI Chat
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center justify-center px-4 h-10 bg-yellow-400 text-zinc-900 text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
            Upgrade
          </button>
          <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden">
            {user?.imageUrl && <img src={user.imageUrl} alt="User" className="w-full h-full object-cover" />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Panel: Input & Analysis */}
          <div className="flex flex-col gap-6 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
            <p className="text-white text-2xl font-bold leading-tight tracking-tight">Job Description Analysis</p>

            <div className="flex flex-col flex-1">
              <label className="flex flex-col min-w-40 flex-1 h-full">
                <p className="text-white text-base font-medium leading-normal pb-2">Job Description</p>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="flex w-full min-w-0 flex-1 resize-none rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-yellow-400 border border-zinc-700 bg-zinc-950 min-h-60 placeholder:text-zinc-500 p-4 text-base"
                />
              </label>
            </div>

            <button
              onClick={handleAnalyzeJobDescription}
              disabled={isAnalyzing || !jobDescription.trim()}
              className="flex items-center justify-center h-12 px-5 w-full bg-yellow-400 text-zinc-900 text-base font-bold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Job Description'}
            </button>

            {analysisResults && (
              <>
                <h3 className="text-white text-lg font-bold leading-tight tracking-tight pt-4">Analysis Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-zinc-950 p-4 rounded-lg">
                    <h4 className="text-white text-sm font-bold mb-2">Key Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResults.keySkills.map((skill: string) => (
                        <span key={skill} className="bg-zinc-800 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded-lg">
                    <h4 className="text-white text-sm font-bold mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResults.keywords.map((keyword: string) => (
                        <span key={keyword} className="bg-zinc-800 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded-lg">
                    <h4 className="text-white text-sm font-bold mb-2">Experience Level</h4>
                    <p className="text-white font-semibold">{analysisResults.experienceLevel}</p>
                  </div>
                </div>

                {/* Story Selection */}
                <div className="mt-4">
                  <h3 className="text-white text-lg font-bold mb-3">Select STAR Stories to Include</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {stories?.map((story) => (
                      <label
                        key={story._id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStories.has(story._id)}
                          onChange={() => toggleStorySelection(story._id)}
                          className="w-5 h-5 rounded text-yellow-400 bg-zinc-900 border-zinc-700 focus:ring-yellow-400"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">{story.title}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {story.skills.slice(0, 3).map((skill) => (
                              <span key={skill} className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Panel: Resume Preview & Generation */}
          <div className="flex flex-col gap-6 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
            <p className="text-white text-2xl font-bold leading-tight tracking-tight">AI-Generated Resume</p>

            {generatedResume ? (
              <>
                <div className="flex items-center gap-6 bg-zinc-950 p-4 rounded-lg">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle className="stroke-current text-zinc-800" cx="18" cy="18" fill="none" r="16" strokeWidth="3" />
                      <circle
                        className="stroke-current text-yellow-400"
                        cx="18"
                        cy="18"
                        fill="none"
                        r="16"
                        strokeDasharray="100"
                        strokeDashoffset={100 - generatedResume.atsScore}
                        strokeWidth="3"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-yellow-400">{generatedResume.atsScore}%</span>
                      <span className="text-xs text-white">ATS Match</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold">Resume Preview</h4>
                    <p className="text-sm text-zinc-400">
                      Keywords matching the job description are highlighted. Your ATS score indicates how well your resume matches.
                    </p>
                  </div>
                </div>

                <div className="flex-1 bg-zinc-950 rounded-lg p-4 overflow-y-auto min-h-72 max-h-[600px]">
                  <div className="text-white text-sm leading-relaxed whitespace-pre-wrap">{generatedResume.content}</div>
                </div>

                <div className="flex items-center gap-4 mt-auto pt-4">
                  <button
                    onClick={handleGenerateResume}
                    disabled={isGenerating}
                    className="flex items-center justify-center h-12 px-5 flex-1 bg-yellow-400 text-zinc-900 text-base font-bold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50"
                  >
                    Regenerate Resume
                  </button>
                  <div className="relative group">
                    <button className="flex items-center gap-2 justify-center h-12 px-5 bg-zinc-700 text-white text-base font-bold rounded-lg hover:bg-zinc-600 transition-colors">
                      <span>Export As</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute bottom-full mb-2 w-full bg-zinc-700 rounded-lg shadow-lg hidden group-hover:block">
                      <button onClick={() => handleDownload('pdf')} className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-600 rounded-t-lg">
                        PDF
                      </button>
                      <button onClick={() => handleDownload('docx')} className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-600">
                        DOCX
                      </button>
                      <button onClick={() => handleDownload('txt')} className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-600 rounded-b-lg">
                        TXT
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-zinc-800 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">No Resume Generated Yet</h3>
                <p className="text-zinc-400 text-sm max-w-md">
                  Paste a job description and select your STAR stories to generate a tailored resume optimized for ATS systems.
                </p>
                <button
                  onClick={handleGenerateResume}
                  disabled={isGenerating || !analysisResults || selectedStories.size === 0}
                  className="mt-6 px-6 py-3 rounded-lg bg-yellow-400 text-zinc-900 font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : 'Generate Resume'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
