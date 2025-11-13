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
  category: string;
  qualityScore?: number;
  completenessScore?: number;
  impactScore?: number;
  clarityScore?: number;
  aiSuggestions?: string;
  createdAt: number;
  updatedAt: number;
}

export default function STARMemoryBank() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());
  const [editingStory, setEditingStory] = useState<StarStory | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const stories = useQuery(api.starStories.list, {
    category: selectedCategory || undefined,
  }) as StarStory[] | undefined;

  const deleteStory = useMutation(api.starStories.deleteStory);
  const updateStory = useMutation(api.starStories.update);

  const filteredStories = stories?.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.situation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleStorySelection = (storyId: string) => {
    const newSelected = new Set(selectedStories);
    if (newSelected.has(storyId)) {
      newSelected.delete(storyId);
    } else {
      newSelected.add(storyId);
    }
    setSelectedStories(newSelected);
  };

  const handleDeleteStory = async (storyId: Id<'starStories'>) => {
    if (confirm('Are you sure you want to delete this story?')) {
      try {
        await deleteStory({ id: storyId });
      } catch (error) {
        console.error('Error deleting story:', error);
        alert('Failed to delete story. Please try again.');
      }
    }
  };

  const getQualityScoreColor = (score?: number) => {
    if (!score) return 'text-zinc-500 border-zinc-500 bg-zinc-500/20';
    if (score >= 80) return 'text-green-500 border-green-500 bg-green-500/20';
    if (score >= 60) return 'text-yellow-500 border-yellow-500 bg-yellow-500/20';
    return 'text-red-500 border-red-500 bg-red-500/20';
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 sm:px-10 py-3 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800">
        <div className="flex items-center gap-4 text-white">
          <Link to="/dashboard" className="text-yellow-400 hover:text-yellow-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
            </svg>
          </Link>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight">My STAR Stories</h2>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/star-stories" className="text-yellow-400 text-sm font-bold">
            Memory Bank
          </Link>
          <Link to="/ai-resume-chat" className="text-white text-sm font-medium hover:text-yellow-400 transition-colors">
            AI Chat
          </Link>
          <Link to="/resume-generator" className="text-white text-sm font-medium hover:text-yellow-400 transition-colors">
            Resume Generator
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowQuickAdd(true)}
            className="flex items-center justify-center px-4 h-10 bg-yellow-400 text-zinc-900 text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors"
          >
            <span>Create New Story</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-zinc-700 border-2 border-zinc-600 overflow-hidden">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                {user?.firstName?.[0] || 'U'}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 sm:px-10 md:px-20 lg:px-40 py-5">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tight">My STAR Stories</h1>
          </div>

          {/* Search and Filters */}
          <div className="sticky top-[69px] z-30 bg-zinc-950/80 backdrop-blur-sm pt-4 pb-2">
            <div className="flex flex-col gap-4 px-4 py-3">
              {/* Search Bar */}
              <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-800 h-12 px-4">
                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories by keyword..."
                  className="flex-1 bg-transparent text-white placeholder:text-zinc-500 px-4 focus:outline-none"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors ${
                    selectedCategory === null
                      ? 'bg-yellow-400 text-zinc-900'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800'
                  }`}
                >
                  <p className="text-sm font-medium">All</p>
                </button>
                {['Leadership', 'Technical', 'Problem Solving', 'Communication', 'Project Management'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors ${
                      selectedCategory === cat
                        ? 'bg-yellow-400 text-zinc-900'
                        : 'bg-zinc-900 text-white hover:bg-zinc-800'
                    }`}
                  >
                    <p className="text-sm font-medium">{cat}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {filteredStories?.map((story) => (
              <div
                key={story._id}
                className="group relative flex flex-col rounded-xl bg-zinc-900 border border-transparent hover:border-yellow-400/50 transition-all duration-300"
              >
                <input
                  type="checkbox"
                  checked={selectedStories.has(story._id)}
                  onChange={() => toggleStorySelection(story._id)}
                  className="absolute top-4 left-4 z-10 w-5 h-5 opacity-0 group-hover:opacity-100 checked:opacity-100 transition-opacity cursor-pointer rounded text-yellow-400 bg-zinc-900 border-zinc-600 focus:ring-yellow-400/50"
                />
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-white font-bold text-lg pr-12">{story.title}</h3>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-xs ${getQualityScoreColor(story.qualityScore)}`}>
                      {story.qualityScore || '--'}/100
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {story.skills.map((skill, idx) => (
                      <span key={idx} className="text-xs font-semibold bg-yellow-400/20 text-yellow-400 px-2.5 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mt-1 line-clamp-3">{story.situation}</p>
                </div>
                <div className="border-t border-zinc-800 mt-auto p-3 flex justify-between items-center">
                  <p className="text-zinc-500 text-xs">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingStory(story)}
                      className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteStory(story._id)}
                      className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {(!filteredStories || filteredStories.length === 0) && (
              <div className="col-span-full flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed border-zinc-800 bg-transparent hover:border-yellow-400 hover:bg-zinc-900/50 transition-all duration-300 p-12 min-h-[280px]">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 mb-4">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg">No Stories Yet</h3>
                <p className="text-zinc-400 text-sm mt-1 max-w-md">
                  Start building your STAR story library. Share your achievements with our AI agent or create stories manually.
                </p>
                <div className="flex gap-4 mt-6">
                  <Link
                    to="/ai-resume-chat"
                    className="px-6 py-3 rounded-lg bg-yellow-400 text-zinc-900 font-bold hover:bg-yellow-300 transition-colors"
                  >
                    Talk to AI Agent
                  </Link>
                  <button
                    onClick={() => setShowQuickAdd(true)}
                    className="px-6 py-3 rounded-lg bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors"
                  >
                    Quick Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Selection Toolbar */}
      {selectedStories.size > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-md mb-6">
          <div className="flex items-center justify-between gap-4 bg-zinc-900 p-3 rounded-xl shadow-2xl border border-zinc-700">
            <p className="text-white text-sm font-medium pl-2">{selectedStories.size} stories selected</p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-zinc-900 rounded-xl border border-zinc-700 shadow-2xl flex flex-col max-h-[90vh]">
            <header className="p-5 border-b border-zinc-800">
              <h2 className="text-white font-bold text-xl">Edit Story: {editingStory.title}</h2>
            </header>
            <main className="p-6 flex-1 overflow-y-auto space-y-6">
              <div>
                <label className="block text-sm font-bold text-yellow-400 mb-2">Title</label>
                <input
                  type="text"
                  defaultValue={editingStory.title}
                  className="w-full bg-zinc-950 text-white rounded-lg border border-zinc-700 focus:ring-yellow-400/50 focus:border-yellow-400/50 p-3 placeholder:text-zinc-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-yellow-400 mb-2">Situation</label>
                <textarea
                  rows={3}
                  defaultValue={editingStory.situation}
                  className="w-full bg-zinc-950 text-white rounded-lg border border-zinc-700 focus:ring-yellow-400/50 focus:border-yellow-400/50 p-3 placeholder:text-zinc-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-yellow-400 mb-2">Task</label>
                <textarea
                  rows={3}
                  defaultValue={editingStory.task}
                  className="w-full bg-zinc-950 text-white rounded-lg border border-zinc-700 focus:ring-yellow-400/50 focus:border-yellow-400/50 p-3 placeholder:text-zinc-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-yellow-400 mb-2">Action</label>
                <textarea
                  rows={5}
                  defaultValue={editingStory.action}
                  className="w-full bg-zinc-950 text-white rounded-lg border border-zinc-700 focus:ring-yellow-400/50 focus:border-yellow-400/50 p-3 placeholder:text-zinc-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-yellow-400 mb-2">Result</label>
                <textarea
                  rows={3}
                  defaultValue={editingStory.result}
                  className="w-full bg-zinc-950 text-white rounded-lg border border-zinc-700 focus:ring-yellow-400/50 focus:border-yellow-400/50 p-3 placeholder:text-zinc-500"
                />
              </div>
            </main>
            <footer className="p-5 border-t border-zinc-800 flex justify-end gap-3">
              <button
                onClick={() => setEditingStory(null)}
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-zinc-800 text-white text-sm font-bold hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setEditingStory(null)}
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-yellow-400 text-zinc-900 text-sm font-bold hover:bg-yellow-300 transition-colors"
              >
                Save Changes
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
