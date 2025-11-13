import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Sparkles, FileText, CheckCircle } from 'lucide-react';

export default function ResumeBuilder() {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const starStories = useQuery(api.starStories.listByUser);
  const generateResume = useMutation(api.resumes.generate);

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
        storyIds: selectedStories,
      });
      setGeneratedContent(result.content);
    } catch (error) {
      console.error('Failed to generate resume:', error);
    } finally {
      setIsGenerating(false);
    }
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
                Generate a tailored resume based on your STAR stories and the job description
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                {/* Job Description */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-64"
                    placeholder="Paste the job description here..."
                  />
                </div>

                {/* STAR Stories Selection */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-xl font-semibold mb-4">Select STAR Stories</h2>
                  {starStories && starStories.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {starStories.map((story) => (
                        <label
                          key={story._id}
                          className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStories.includes(story._id)}
                            onChange={() => handleToggleStory(story._id)}
                            className="mt-1 w-5 h-5 text-yellow-500 bg-gray-600 border-gray-500 rounded focus:ring-yellow-500"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{story.title}</h3>
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
                            <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          )}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">
                      No STAR stories available. Create some first!
                    </p>
                  )}
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !jobDescription.trim() || selectedStories.length === 0}
                  className="w-full px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {isGenerating ? 'Generating...' : 'Generate Resume'}
                </button>
              </div>

              {/* Output Section */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Generated Resume</h2>
                  {generatedContent && (
                    <FileText className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
                {generatedContent ? (
                  <div className="bg-white text-gray-900 p-8 rounded-lg min-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans">{generatedContent}</pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[600px] border-2 border-dashed border-gray-700 rounded-lg">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">
                        Your generated resume will appear here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
