import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StarStoryCard from '../components/StarStoryCard';
import { Plus, Search } from 'lucide-react';

export default function StarStories() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    situation: '',
    task: '',
    action: '',
    result: '',
    skills: '',
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
    });
    setShowForm(false);
  };

  const filteredStories = starStories?.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                <p className="text-gray-400">Document your achievements and experiences</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Story
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stories by title or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                />
              </div>
            </div>

            {/* Create Form */}
            {showForm && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Create New STAR Story</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
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
                    <label className="block text-sm font-medium mb-2">Situation</label>
                    <textarea
                      required
                      value={formData.situation}
                      onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
                      placeholder="Describe the context or challenge..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Task</label>
                    <textarea
                      required
                      value={formData.task}
                      onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
                      placeholder="What was your responsibility?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Action</label>
                    <textarea
                      required
                      value={formData.action}
                      onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
                      placeholder="What specific actions did you take?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Result</label>
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

            {/* Stories List */}
            <div className="grid gap-6">
              {filteredStories && filteredStories.length > 0 ? (
                filteredStories.map((story) => (
                  <StarStoryCard key={story._id} story={story} />
                ))
              ) : (
                <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-lg">No STAR stories yet.</p>
                  <p className="text-gray-500 mt-2">Start documenting your achievements!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
