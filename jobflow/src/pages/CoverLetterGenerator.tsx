import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  RefreshCw,
  Edit,
  Save,
  Wand2,
  CheckCircle,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

type ToneOption = 'formal' | 'conversational' | 'creative' | 'executive';

interface StarStory {
  _id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  skills: string[];
}

export default function CoverLetterGenerator() {
  const [step, setStep] = useState<'input' | 'generating' | 'result'>('input');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [tone, setTone] = useState<ToneOption>('formal');
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedLetter, setEditedLetter] = useState('');

  const starStories = useQuery(api.starStories.list, {});

  const toneOptions = [
    { value: 'formal' as ToneOption, label: 'Formal', description: 'Professional and traditional', icon: '👔' },
    { value: 'conversational' as ToneOption, label: 'Conversational', description: 'Friendly and approachable', icon: '💬' },
    { value: 'creative' as ToneOption, label: 'Creative', description: 'Unique and engaging', icon: '🎨' },
    { value: 'executive' as ToneOption, label: 'Executive', description: 'Confident and leadership-focused', icon: '🎯' },
  ];

  const handleGenerate = async () => {
    if (!jobDescription || !companyName || !jobTitle) {
      alert('Please fill in all required fields');
      return;
    }

    setStep('generating');

    // Simulate AI generation (in real app, this would call an AI API)
    setTimeout(() => {
      const letter = generateCoverLetter();
      setGeneratedLetter(letter);
      setEditedLetter(letter);
      setStep('result');
    }, 2000);
  };

  const generateCoverLetter = () => {
    const selectedStoryDetails = starStories?.filter(s => selectedStories.includes(s._id)) || [];

    const intro = tone === 'formal'
      ? `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my extensive experience and proven track record in delivering exceptional results, I am confident that I would be a valuable addition to your team.`
      : tone === 'conversational'
      ? `Hi there!\n\nI'm excited to apply for the ${jobTitle} role at ${companyName}. Your company's mission really resonates with me, and I'd love to bring my skills and enthusiasm to your team.`
      : tone === 'creative'
      ? `Imagine a ${jobTitle} who not only meets expectations but exceeds them at every turn. That's what I bring to the table at ${companyName}.`
      : `Dear Hiring Team,\n\nAs a results-driven professional with a track record of strategic leadership, I am writing to apply for the ${jobTitle} position at ${companyName}. My experience aligns perfectly with your needs.`;

    const body = selectedStoryDetails.length > 0
      ? selectedStoryDetails.map((story, index) => {
          return `\n\n${index === 0 ? 'Recently' : 'Additionally'}, ${story.situation.toLowerCase()} ${story.task} Through strategic ${story.action.toLowerCase()}, ${story.result.toLowerCase()} This experience demonstrates my ability to deliver results that align with ${companyName}'s objectives.`;
        }).join('')
      : `\n\nThroughout my career, I have consistently delivered exceptional results. My experience includes developing innovative solutions, leading high-performing teams, and driving measurable business impact. I am particularly drawn to ${companyName} because of your commitment to excellence and innovation in the industry.`;

    const closing = tone === 'formal'
      ? `\n\nI would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to ${companyName}'s continued success. Thank you for considering my application.\n\nSincerely,\n[Your Name]`
      : tone === 'conversational'
      ? `\n\nI'd love to chat more about how I can contribute to ${companyName}'s success. Thanks for taking the time to consider my application!\n\nBest regards,\n[Your Name]`
      : tone === 'creative'
      ? `\n\nLet's make great things happen together at ${companyName}. I'm ready when you are.\n\nCheers,\n[Your Name]`
      : `\n\nI look forward to the opportunity to discuss how I can drive results for ${companyName}. Thank you for your consideration.\n\nBest regards,\n[Your Name]`;

    return intro + body + closing;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editedLetter : generatedLetter);
    alert('Cover letter copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([isEditing ? editedLetter : generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${companyName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveEdit = () => {
    setGeneratedLetter(editedLetter);
    setIsEditing(false);
  };

  const handleRegenerateWithStory = (storyId: string) => {
    if (selectedStories.includes(storyId)) {
      setSelectedStories(selectedStories.filter(id => id !== storyId));
    } else {
      setSelectedStories([...selectedStories, storyId]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Wand2 className="w-8 h-8 text-yellow-500" />
                <h1 className="text-3xl font-bold">AI Cover Letter Generator</h1>
              </div>
              <p className="text-gray-400">
                Generate personalized cover letters in seconds using AI and your STAR stories
              </p>
            </div>

            {step === 'input' && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Input Form */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-yellow-500" />
                      Job Details
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          placeholder="e.g., TechCorp Inc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          placeholder="e.g., Senior Frontend Developer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Job Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-40"
                          placeholder="Paste the job description here..."
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          The AI will analyze this to tailor your cover letter
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      Choose Your Tone
                    </h2>
                    <div className="grid md:grid-cols-2 gap-3">
                      {toneOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setTone(option.value)}
                          className={`p-4 rounded-lg border-2 transition text-left ${
                            tone === option.value
                              ? 'border-yellow-500 bg-yellow-500/10'
                              : 'border-gray-700 bg-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl">{option.icon}</span>
                            <span className="font-semibold">{option.label}</span>
                          </div>
                          <p className="text-sm text-gray-400">{option.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={!jobDescription || !companyName || !jobTitle}
                    className="w-full px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-5 h-5" />
                    Generate Cover Letter
                  </button>
                </div>

                {/* STAR Stories Sidebar */}
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-yellow-500" />
                      Select STAR Stories
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Choose stories to include in your cover letter
                    </p>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {starStories && starStories.length > 0 ? (
                        starStories.map((story) => (
                          <button
                            key={story._id}
                            onClick={() => handleRegenerateWithStory(story._id)}
                            className={`w-full p-3 rounded-lg border-2 transition text-left ${
                              selectedStories.includes(story._id)
                                ? 'border-yellow-500 bg-yellow-500/10'
                                : 'border-gray-700 bg-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <CheckCircle
                                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                  selectedStories.includes(story._id)
                                    ? 'text-yellow-500'
                                    : 'text-gray-500'
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm mb-1">{story.title}</h4>
                                <p className="text-xs text-gray-400 line-clamp-2">
                                  {story.situation}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {story.skills.slice(0, 2).map((skill) => (
                                    <span
                                      key={skill}
                                      className="px-2 py-0.5 bg-gray-600 rounded text-xs"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400 text-sm">No STAR stories yet</p>
                          <button className="text-yellow-500 hover:text-yellow-400 text-sm mt-2">
                            Create your first story
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Pro Tip
                    </h4>
                    <p className="text-sm text-blue-300">
                      Select 2-3 STAR stories that best match the job requirements for a
                      compelling, personalized cover letter.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 'generating' && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
                <RefreshCw className="w-16 h-16 text-yellow-500 mx-auto mb-6 animate-spin" />
                <h2 className="text-2xl font-bold mb-2">Generating Your Cover Letter</h2>
                <p className="text-gray-400">
                  Our AI is crafting a personalized cover letter based on your inputs...
                </p>
              </div>
            )}

            {step === 'result' && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Generated Letter */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-yellow-500" />
                        Your Cover Letter
                      </h2>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setIsEditing(false);
                                setEditedLetter(generatedLetter);
                              }}
                              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setIsEditing(true)}
                              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={handleCopy}
                              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              Copy
                            </button>
                            <button
                              onClick={handleDownload}
                              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <textarea
                        value={editedLetter}
                        onChange={(e) => setEditedLetter(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white font-mono text-sm h-[600px]"
                      />
                    ) : (
                      <div className="bg-white text-gray-900 rounded-lg p-8 font-serif">
                        <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                          {generatedLetter}
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setStep('input');
                        setGeneratedLetter('');
                        setEditedLetter('');
                      }}
                      className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      Generate Another
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="flex-1 px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Regenerate
                    </button>
                  </div>
                </div>

                {/* Tips Sidebar */}
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setTone('formal')}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-left"
                      >
                        Change to Formal Tone
                      </button>
                      <button
                        onClick={() => setTone('conversational')}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-left"
                      >
                        Change to Conversational
                      </button>
                      <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-left">
                        Make it Shorter
                      </button>
                      <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-left">
                        Add More Details
                      </button>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Checklist
                    </h4>
                    <ul className="space-y-2 text-sm text-green-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Personalized greeting
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Company-specific details
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Relevant achievements
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Clear call-to-action
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-400 mb-2">Remember</h4>
                    <ul className="space-y-2 text-sm text-blue-300">
                      <li>• Customize for each application</li>
                      <li>• Proofread before sending</li>
                      <li>• Match the company's tone</li>
                      <li>• Keep it under one page</li>
                    </ul>
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
