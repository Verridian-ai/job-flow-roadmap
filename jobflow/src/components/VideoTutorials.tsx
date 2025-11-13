import { useState } from 'react';
import { PlayCircle, Clock, Search, Filter, Star, CheckCircle } from 'lucide-react';
import Navbar from './Navbar';

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  completed?: boolean;
  rating?: number;
}

export default function VideoTutorials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories = ['All', 'Getting Started', 'Resume Building', 'STAR Stories', 'Job Tracking', 'Coach Sessions', 'Advanced Tips'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const videos: Video[] = [
    {
      id: '1',
      title: 'Getting Started with Jobflow',
      description: 'Learn the basics of navigating the platform and setting up your profile',
      duration: '5:30',
      category: 'Getting Started',
      difficulty: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      completed: true,
      rating: 4.8
    },
    {
      id: '2',
      title: 'Creating Your First STAR Story',
      description: 'Step-by-step guide to documenting achievements using the STAR method',
      duration: '8:45',
      category: 'STAR Stories',
      difficulty: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
      rating: 4.9
    },
    {
      id: '3',
      title: 'AI Resume Builder Deep Dive',
      description: 'Advanced techniques for optimizing resumes with AI assistance',
      duration: '12:20',
      category: 'Resume Building',
      difficulty: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=225&fit=crop',
      rating: 4.7
    },
    {
      id: '4',
      title: 'Job Application Tracking Strategies',
      description: 'Organize your job search with the Kanban board effectively',
      duration: '6:15',
      category: 'Job Tracking',
      difficulty: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=225&fit=crop',
      completed: true,
      rating: 4.6
    },
    {
      id: '5',
      title: 'Booking and Preparing for Coach Sessions',
      description: 'How to find the right coach and make the most of your sessions',
      duration: '7:50',
      category: 'Coach Sessions',
      difficulty: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=225&fit=crop',
      rating: 4.8
    },
    {
      id: '6',
      title: 'Advanced Resume Customization',
      description: 'Tailor your resume for specific industries and roles',
      duration: '15:30',
      category: 'Resume Building',
      difficulty: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
      rating: 4.9
    },
    {
      id: '7',
      title: 'Mastering Interview Preparation',
      description: 'Use your STAR stories to ace behavioral interviews',
      duration: '10:45',
      category: 'Advanced Tips',
      difficulty: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=225&fit=crop',
      rating: 4.7
    },
    {
      id: '8',
      title: 'Networking and Personal Branding',
      description: 'Build your professional presence and expand your network',
      duration: '9:20',
      category: 'Advanced Tips',
      difficulty: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=225&fit=crop',
      rating: 4.8
    }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || video.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const completedCount = videos.filter(v => v.completed).length;
  const totalCount = videos.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Video Tutorial Library</h1>
          <p className="text-gray-400">Learn at your own pace with our comprehensive video guides</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Your Learning Progress</h3>
            <span className="text-sm text-gray-400">{completedCount} of {totalCount} completed</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">{progressPercentage}% complete</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white placeholder-gray-400"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">
                <Filter className="inline w-4 h-4 mr-2" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <div
              key={video.id}
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-yellow-500 transition cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-700">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <PlayCircle className="w-16 h-16 text-yellow-500" />
                </div>
                {video.completed && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    video.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    video.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {video.difficulty}
                  </span>
                  {video.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-400">{video.rating}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold mb-2 group-hover:text-yellow-500 transition">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">{video.description}</p>
                <div className="text-xs text-gray-500">{video.category}</div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No videos found matching your criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
