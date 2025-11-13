import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  Image as ImageIcon,
  Video,
  FileText,
  Sparkles,
  Calendar,
  Send,
  X,
  Loader2,
} from 'lucide-react';

type PostType = 'update' | 'article' | 'achievement' | 'job';
type ToneType = 'professional' | 'conversational' | 'inspirational' | 'technical';
type AudienceType = 'public' | 'connections' | 'private';

export default function CreatePost() {
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<PostType>('update');
  const [tone, setTone] = useState<ToneType>('professional');
  const [audience, setAudience] = useState<AudienceType>('connections');
  const [scheduledDate, setScheduledDate] = useState('');
  const [shareToLinkedIn, setShareToLinkedIn] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const postTypes = [
    { value: 'update', label: 'Update', description: 'Share your thoughts or news' },
    { value: 'article', label: 'Article', description: 'Share an article or blog post' },
    { value: 'achievement', label: 'Achievement', description: 'Celebrate a milestone' },
    { value: 'job', label: 'Job Posting', description: 'Share a job opportunity' },
  ];

  const tones = [
    { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
    { value: 'conversational', label: 'Conversational', description: 'Friendly and casual' },
    { value: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' },
    { value: 'technical', label: 'Technical', description: 'Detailed and precise' },
  ];

  const audiences = [
    { value: 'public', label: 'Public', description: 'Anyone can see this' },
    { value: 'connections', label: 'Connections Only', description: 'Only your connections' },
    { value: 'private', label: 'Private', description: 'Only you can see this' },
  ];

  const generateAIContent = async () => {
    if (!aiPrompt.trim()) return;

    setIsGeneratingAI(true);
    // Simulate AI generation
    setTimeout(() => {
      const generatedContent = `✨ AI-Generated Content Based on Your Prompt ✨\n\n${aiPrompt}\n\nThis is a professionally crafted post that captures your message with the ${tone} tone you selected. The content is optimized for engagement and includes relevant hashtags.\n\n#AIGenerated #ProfessionalNetworking #CareerGrowth`;
      setPostContent(generatedContent);
      setIsGeneratingAI(false);
      setShowAIPanel(false);
      setAiPrompt('');
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    // Handle post submission
    console.log({
      content: postContent,
      type: postType,
      tone,
      audience,
      scheduledDate,
      shareToLinkedIn,
      attachedImage,
    });
    navigate('/networking/feed');
  };

  const getSuggestedHashtags = () => {
    const hashtags: Record<PostType, string[]> = {
      update: ['#thoughts', '#professional', '#networking'],
      article: ['#article', '#knowledge', '#learning'],
      achievement: ['#milestone', '#achievement', '#success'],
      job: ['#hiring', '#jobopening', '#careers'],
    };
    return hashtags[postType] || [];
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Create New Post</h1>
              <p className="text-gray-400">Share your professional updates with your network</p>
            </div>

            {/* Post Type Selection */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-4">Post Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {postTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setPostType(type.value as PostType)}
                    className={`p-4 rounded-lg border-2 transition ${
                      postType === type.value
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-gray-700 bg-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-white font-medium mb-1">{type.label}</p>
                      <p className="text-xs text-gray-400">{type.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Assistant Panel */}
            {showAIPanel && (
              <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-2 border-yellow-500/50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-lg font-bold text-white">AI Post Assistant</h2>
                  </div>
                  <button
                    onClick={() => setShowAIPanel(false)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Describe what you want to share, and AI will craft a professional post for you.
                </p>
                <textarea
                  placeholder="E.g., I just got promoted to Senior Engineer after 3 years..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600 min-h-[100px] resize-none mb-4"
                />
                <button
                  onClick={generateAIContent}
                  disabled={isGeneratingAI || !aiPrompt.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 rounded-lg transition font-medium"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Post
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Main Content Editor */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <div className="mb-4">
                <textarea
                  placeholder="What do you want to talk about?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600 min-h-[200px] resize-none"
                />
              </div>

              {/* Media Attachment */}
              {attachedImage && (
                <div className="relative mb-4">
                  <img
                    src={attachedImage}
                    alt="Attached"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setAttachedImage(null)}
                    className="absolute top-2 right-2 p-2 bg-gray-900/80 hover:bg-gray-900 text-white rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Media Actions */}
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">
                  <Video className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Video</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Attach Document</span>
                </button>
              </div>
            </div>

            {/* AI Tone Adjuster */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">AI Tone Adjuster</h2>
                {!showAIPanel && (
                  <button
                    onClick={() => setShowAIPanel(true)}
                    className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                  >
                    <Sparkles className="w-4 h-4" />
                    Use AI Assistant
                  </button>
                )}
              </div>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneType)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600"
              >
                {tones.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label} - {t.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Suggested Hashtags */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-4">Suggested Hashtags</h2>
              <div className="flex flex-wrap gap-2">
                {getSuggestedHashtags().map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setPostContent((prev) => `${prev} ${tag}`)}
                    className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition text-sm"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Post Settings */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-4">Post Settings</h2>

              {/* Audience */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as AudienceType)}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600"
                >
                  {audiences.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label} - {a.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Schedule Post */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Schedule Post (Optional)
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600"
                  />
                  <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Cross-post to LinkedIn */}
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Also post to LinkedIn</p>
                  <p className="text-xs text-gray-400">Share this post on your LinkedIn profile</p>
                </div>
                <button
                  onClick={() => setShareToLinkedIn(!shareToLinkedIn)}
                  className={`relative w-12 h-6 rounded-full transition ${
                    shareToLinkedIn ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${
                      shareToLinkedIn ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/networking/feed')}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={!postContent.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 rounded-lg transition font-medium"
              >
                <Send className="w-5 h-5" />
                {scheduledDate ? 'Schedule Post' : 'Post Now'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
