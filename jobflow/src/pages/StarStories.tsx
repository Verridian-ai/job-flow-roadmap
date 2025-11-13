import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StarStoryCard from '../components/StarStoryCard';
import { Plus, Search, Filter } from 'lucide-react';

const CATEGORIES = [
  'Leadership',
  'Technical',
  'Problem Solving',
  'Communication',
  'Teamwork',
  'Innovation',
  'Project Management',
  'Other'
];

export default function StarStories() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    situation: '',
    task: '',
    action: '',
    result: '',
    skills: '',
    category: 'Other',
  });

  const starStories = useQuery(api.starStories.listByUser);
  const createStory = useMutation(api.starStories.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createStory({
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
    });
    setFormData({
      title: '',
      situation: '',
      task: '',
      action: '',
      result: '',
      skills: '',
      category: 'Other',
    });
    setShowForm(false);
  };

  const filteredStories = starStories?.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || story.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">STAR Stories</h1>
                <p className="text-gray-400">Document your achievements and experiences using the STAR method</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Story
              </button>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stories by title or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Create Form */}
            {showForm && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Create New STAR Story</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        placeholder="e.g., Led migration to microservices"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Situation *
                      <span className="text-gray-400 font-normal ml-2">(What was the context?)</span>
                    </label>
                    <textarea
                      required
                      value={formData.situation}
                      onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
                      placeholder="Describe the context or challenge..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Task *
                      <span className="text-gray-400 font-normal ml-2">(What needed to be done?)</span>
                    </label>
                    <textarea
                      required
                      value={formData.task}
                      onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
                      placeholder="What was your responsibility?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Action *
                      <span className="text-gray-400 font-normal ml-2">(What did YOU do?)</span>
                    </label>
                    <textarea
                      required
                      value={formData.action}
                      onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
                      placeholder="What specific actions did you take?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Result *
                      <span className="text-gray-400 font-normal ml-2">(What was the outcome?)</span>
                    </label>
                    <textarea
                      required
                      value={formData.result}
                      onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
                      placeholder="What was the outcome? Include metrics if possible."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      placeholder="e.g., Leadership, Python, System Design"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                    >
                      Create Story
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <h3 className="text-blue-400 font-semibold mb-2">About STAR Stories</h3>
              <p className="text-sm text-gray-300">
                The STAR method helps you structure accomplishments: <strong>S</strong>ituation (context), <strong>T</strong>ask (challenge), <strong>A</strong>ction (what you did), <strong>R</strong>esult (outcome).
                Click the sparkle icon on any story to get AI-powered quality scoring and suggestions for improvement.
              </p>
            </div>

            {/* Stories List */}
            <div className="grid gap-6">
              {filteredStories && filteredStories.length > 0 ? (
                filteredStories.map((story) => (
                  <StarStoryCard key={story._id} story={story} />
                ))
              ) : (
                <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-lg">
                    {searchTerm || selectedCategory ? 'No stories match your filters.' : 'No STAR stories yet.'}
                  </p>
                  <p className="text-gray-500 mt-2">
                    {searchTerm || selectedCategory ? 'Try adjusting your search or filters.' : 'Start documenting your achievements!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
