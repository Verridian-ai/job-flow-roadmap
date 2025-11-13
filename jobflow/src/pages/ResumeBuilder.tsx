import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Sparkles, FileText, CheckCircle, Download, Save, Edit3, TrendingUp, AlertCircle } from 'lucide-react';

interface ATSAnalysis {
  score: number;
  feedback?: string;
  keywordMatches?: string[];
  missingKeywords?: string[];
}

export default function ResumeBuilder() {
  const [step, setStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);

  const starStories = useQuery(api.starStories.listByUser);
  const generateResume = useMutation(api.resumes.generate);
  const updateResume = useMutation(api.resumes.update);

  const handleToggleStory = (storyId: string) => {
    setSelectedStories(prev =>
      prev.includes(storyId)
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim() || selectedStories.length === 0) return;

    setIsGenerating(true);
    try {
      const result = await generateResume({
        jobDescription,
        starStoryIds: selectedStories,
      });
      setGeneratedContent(result.content);
      setEditedContent(result.content);
      setAtsScore(result.atsScore);
      setAtsAnalysis(result.atsAnalysis);
      setResumeId(result.resumeId);
      setStep(3);
    } catch (error) {
      console.error('Failed to generate resume:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!resumeId || !editedContent) return;

    try {
      await updateResume({
        id: resumeId,
        content: editedContent,
      });
      setGeneratedContent(editedContent);
      setIsEditing(false);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Failed to save resume:', error);
      alert('Failed to save resume. Please try again.');
    }
  };

  const handleDownload = () => {
    if (!generatedContent) return;

    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/50';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return TrendingUp;
    return AlertCircle;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                AI Resume Builder
              </h1>
              <p className="text-gray-400">
                Generate a tailored, ATS-optimized resume using your STAR stories and job description
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-yellow-500' : 'text-gray-500'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}>
                    1
                  </div>
                  <span className="font-medium">Job Description</span>
                </div>
                <div className={`h-1 flex-1 mx-4 ${step >= 2 ? 'bg-yellow-500' : 'bg-gray-700'}`} />
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-yellow-500' : 'text-gray-500'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}>
                    2
                  </div>
                  <span className="font-medium">Select Stories</span>
                </div>
                <div className={`h-1 flex-1 mx-4 ${step >= 3 ? 'bg-yellow-500' : 'bg-gray-700'}`} />
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-yellow-500' : 'text-gray-500'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}>
                    3
                  </div>
                  <span className="font-medium">Review & Edit</span>
                </div>
              </div>
            </div>

            {/* Step 1: Job Description */}
            {step === 1 && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-xl font-semibold mb-4">Paste Job Description</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Copy and paste the full job description to generate a tailored resume that matches the requirements.
                  </p>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white min-h-[400px]"
                    placeholder="Paste the job description here..."
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!jobDescription.trim()}
                      className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next: Select Stories
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Select STAR Stories */}
            {step === 2 && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-xl font-semibold mb-4">Select STAR Stories</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Choose the STAR stories that best demonstrate your qualifications for this role.
                  </p>
                  {starStories && starStories.length > 0 ? (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto mb-4">
                      {starStories.map((story) => (
                        <label
                          key={story._id}
                          className="flex items-start gap-3 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStories.includes(story._id)}
                            onChange={() => handleToggleStory(story._id)}
                            className="mt-1 w-5 h-5 text-yellow-500 bg-gray-600 border-gray-500 rounded focus:ring-yellow-500"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{story.title}</h3>
                            {story.qualityScore !== undefined && (
                              <div className="flex items-center gap-2 mt-1 mb-2">
                                <span className="text-xs text-gray-400">Quality Score:</span>
                                <span className={`text-sm font-bold ${getScoreColor(story.qualityScore)}`}>
                                  {story.qualityScore}/100
                                </span>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {story.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 bg-gray-600 text-xs rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          {selectedStories.includes(story._id) && (
                            <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                          )}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">
                      No STAR stories available. Create some first!
                    </p>
                  )}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || selectedStories.length === 0}
                      className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      {isGenerating ? 'Generating...' : 'Generate Resume'}
                    </button>
                  </div>
                  {selectedStories.length > 0 && (
                    <p className="text-sm text-gray-400 mt-4 text-center">
                      {selectedStories.length} {selectedStories.length === 1 ? 'story' : 'stories'} selected
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review & Edit */}
            {step === 3 && (
              <div className="space-y-6">
                {/* ATS Score Card */}
                {atsScore !== null && (
                  <div className={`rounded-lg border p-6 ${getScoreBackground(atsScore)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {(() => {
                          const ScoreIcon = getScoreIcon(atsScore);
                          return <ScoreIcon className={`w-10 h-10 ${getScoreColor(atsScore)}`} />;
                        })()}
                        <div>
                          <h3 className="text-xl font-semibold">ATS Compatibility Score</h3>
                          <p className="text-sm text-gray-300 mt-1">
                            {atsScore >= 80 ? 'Excellent! Your resume is highly ATS-compatible.' :
                             atsScore >= 60 ? 'Good! Consider the suggestions below to improve.' :
                             'Needs improvement. Review the feedback carefully.'}
                          </p>
                        </div>
                      </div>
                      <div className={`text-5xl font-bold ${getScoreColor(atsScore)}`}>
                        {atsScore}
                      </div>
                    </div>
                    {atsAnalysis?.feedback && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-sm text-gray-300">{atsAnalysis.feedback}</p>
                      </div>
                    )}
                    {atsAnalysis?.keywordMatches && atsAnalysis.keywordMatches.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Matched Keywords:</p>
                        <div className="flex flex-wrap gap-2">
                          {atsAnalysis.keywordMatches.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {atsAnalysis?.missingKeywords && atsAnalysis.missingKeywords.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Consider Adding:</p>
                        <div className="flex flex-wrap gap-2">
                          {atsAnalysis.missingKeywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Resume Content */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <FileText className="w-6 h-6 text-yellow-500" />
                      Your Resume
                    </h2>
                    <div className="flex gap-3">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition inline-flex items-center gap-2"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-400 transition inline-flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-400 transition inline-flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setEditedContent(generatedContent);
                            }}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white font-mono min-h-[600px]"
                    />
                  ) : (
                    <div className="bg-white text-gray-900 p-8 rounded-lg min-h-[600px]">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {generatedContent}
                      </pre>
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => {
                        setStep(2);
                        setGeneratedContent('');
                        setAtsScore(null);
                        setAtsAnalysis(null);
                      }}
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                    >
                      Generate New Resume
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
