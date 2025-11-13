import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Star, Edit2, Trash2, Save, X, Sparkles, Copy, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface StarStory {
  _id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  skills: string[];
  qualityScore?: number;
  completenessScore?: number;
  impactScore?: number;
  clarityScore?: number;
  aiSuggestions?: string;
  _creationTime: number;
}

interface Props {
  story: StarStory;
}

export default function StarStoryCard({ story }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    title: story.title,
    situation: story.situation,
    task: story.task,
    action: story.action,
    result: story.result,
    skills: story.skills.join(', '),
  });

  const updateStory = useMutation(api.starStories.update);
  const deleteStory = useMutation(api.starStories.remove);
  const scoreStory = useMutation(api.starStories.scoreWithAI);
  const duplicateStory = useMutation(api.starStories.duplicate);

  const handleSave = async () => {
    await updateStory({
      id: story._id,
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this story?')) {
      await deleteStory({ id: story._id });
    }
  };

  const handleScore = async () => {
    setIsScoring(true);
    try {
      await scoreStory({ id: story._id });
    } finally {
      setIsScoring(false);
    }
  };

  const handleDuplicate = async () => {
    await duplicateStory({ id: story._id });
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score?: number) => {
    if (!score) return AlertCircle;
    if (score >= 80) return CheckCircle;
    if (score >= 60) return TrendingUp;
    return AlertCircle;
  };

  if (isEditing) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Situation</label>
            <textarea
              value={formData.situation}
              onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Task</label>
            <textarea
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Action</label>
            <textarea
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Result</label>
            <textarea
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Skills (comma-separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition inline-flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ScoreIcon = getScoreIcon(story.qualityScore);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {story.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* AI Quality Score */}
            {story.qualityScore !== undefined && (
              <div className="flex items-center gap-4 mt-3 p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ScoreIcon className={`w-5 h-5 ${getScoreColor(story.qualityScore)}`} />
                  <span className="text-sm font-medium">Quality Score:</span>
                  <span className={`text-lg font-bold ${getScoreColor(story.qualityScore)}`}>
                    {story.qualityScore}/100
                  </span>
                </div>

                {story.completenessScore !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Completeness:</span>
                    <span className={getScoreColor(story.completenessScore)}>
                      {story.completenessScore}
                    </span>
                  </div>
                )}

                {story.impactScore !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Impact:</span>
                    <span className={getScoreColor(story.impactScore)}>
                      {story.impactScore}
                    </span>
                  </div>
                )}

                {story.clarityScore !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Clarity:</span>
                    <span className={getScoreColor(story.clarityScore)}>
                      {story.clarityScore}
                    </span>
                  </div>
                )}

                {story.aiSuggestions && (
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="ml-auto px-3 py-1 text-sm bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition"
                  >
                    {showSuggestions ? 'Hide' : 'View'} AI Suggestions
                  </button>
                )}
              </div>
            )}

            {/* AI Suggestions */}
            {showSuggestions && story.aiSuggestions && (
              <div className="mt-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Suggestions
                </h4>
                <p className="text-sm text-gray-300">{story.aiSuggestions}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={handleScore}
            disabled={isScoring}
            className="p-2 text-gray-400 hover:text-purple-400 transition disabled:opacity-50"
            title="Score with AI"
          >
            <Sparkles className={`w-5 h-5 ${isScoring ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleDuplicate}
            className="p-2 text-gray-400 hover:text-blue-400 transition"
            title="Duplicate story"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-yellow-500 transition"
            title="Edit story"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 transition"
            title="Delete story"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-yellow-500 mb-1">Situation</h4>
          <p className="text-gray-300">{story.situation}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-yellow-500 mb-1">Task</h4>
          <p className="text-gray-300">{story.task}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-yellow-500 mb-1">Action</h4>
          <p className="text-gray-300">{story.action}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-yellow-500 mb-1">Result</h4>
          <p className="text-gray-300">{story.result}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Created {new Date(story._creationTime).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
