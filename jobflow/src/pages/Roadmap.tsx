import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  Search,
  ThumbsUp,
  MessageSquare,
  Bell,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: 'under-consideration' | 'planned' | 'in-progress' | 'completed';
  upvotes: number;
  comments: number;
  submittedBy: string;
  submittedDate: string;
  category: string;
  hasUpvoted?: boolean;
  isSubscribed?: boolean;
}

export default function Roadmap() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'under-consideration' | 'planned' | 'in-progress' | 'completed'>('under-consideration');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const features: FeatureRequest[] = [
    {
      id: '1',
      title: 'AI-Powered Resume Tailoring',
      description: 'Automatically tailor your resume to match specific job descriptions using AI algorithms.',
      status: 'under-consideration',
      upvotes: 12,
      comments: 5,
      submittedBy: 'John Doe',
      submittedDate: '2024-01-15',
      category: 'AI Features',
      hasUpvoted: false,
      isSubscribed: false
    },
    {
      id: '2',
      title: 'Enhanced Interview Simulation',
      description: 'Practice for interviews with realistic simulations, including AI-generated questions and feedback.',
      status: 'under-consideration',
      upvotes: 8,
      comments: 3,
      submittedBy: 'Sarah Johnson',
      submittedDate: '2024-01-12',
      category: 'Interview Prep',
      hasUpvoted: false,
      isSubscribed: false
    },
    {
      id: '3',
      title: 'Personalized Career Path Recommendations',
      description: 'Receive tailored career path suggestions based on your skills, experience, and interests.',
      status: 'under-consideration',
      upvotes: 5,
      comments: 2,
      submittedBy: 'Michael Chen',
      submittedDate: '2024-01-10',
      category: 'Career Planning',
      hasUpvoted: false,
      isSubscribed: false
    },
    {
      id: '4',
      title: 'Advanced Job Matching Algorithm',
      description: 'Improved job matching based on skills, experience, and preferences.',
      status: 'planned',
      upvotes: 24,
      comments: 12,
      submittedBy: 'Emily Davis',
      submittedDate: '2023-12-20',
      category: 'Job Search',
      hasUpvoted: true,
      isSubscribed: true
    },
    {
      id: '5',
      title: 'Video Resume Builder',
      description: 'Create professional video resumes with AI-powered editing and templates.',
      status: 'in-progress',
      upvotes: 18,
      comments: 8,
      submittedBy: 'David Wilson',
      submittedDate: '2023-12-15',
      category: 'Resume Tools',
      hasUpvoted: false,
      isSubscribed: true
    },
    {
      id: '6',
      title: 'Salary Negotiation Coach',
      description: 'AI-powered salary negotiation assistant with market data and strategies.',
      status: 'completed',
      upvotes: 42,
      comments: 20,
      submittedBy: 'Lisa Anderson',
      submittedDate: '2023-11-01',
      category: 'Career Development',
      hasUpvoted: true,
      isSubscribed: false
    }
  ];

  const filteredFeatures = features.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = f.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under-consideration':
        return 'bg-gray-700 text-gray-300';
      case 'planned':
        return 'bg-blue-500/20 text-blue-500';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under-consideration':
        return Target;
      case 'planned':
        return Calendar;
      case 'in-progress':
        return Clock;
      case 'completed':
        return CheckCircle;
      default:
        return Target;
    }
  };

  const handleUpvote = (featureId: string) => {
    // TODO: Implement upvote functionality
    console.log('Upvoting feature:', featureId);
  };

  const handleSubscribe = (featureId: string) => {
    // TODO: Implement subscribe functionality
    console.log('Subscribing to feature:', featureId);
  };

  const handleComment = (featureId: string) => {
    // TODO: Implement comment functionality
    console.log('Opening comments for feature:', featureId);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Public Roadmap</h1>
              <p className="text-gray-400 mb-6">
                Track the progress of submitted feature requests and upvote the ones you'd like to see implemented.
              </p>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search feature requests"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700 mb-8">
              <div className="flex gap-8">
                {[
                  { key: 'under-consideration', label: 'Under Consideration' },
                  { key: 'planned', label: 'Planned' },
                  { key: 'in-progress', label: 'In Progress' },
                  { key: 'completed', label: 'Completed' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`pb-4 px-2 font-semibold transition ${
                      activeTab === tab.key
                        ? 'text-white border-b-2 border-yellow-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-6 mb-8">
              {filteredFeatures.map((feature) => {
                const StatusIcon = getStatusIcon(feature.status);
                return (
                  <div
                    key={feature.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition"
                  >
                    <div className="grid grid-cols-12 gap-6">
                      {/* Left Side - Content */}
                      <div className="col-span-8">
                        <div className="flex items-start gap-3 mb-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(feature.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            {feature.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                            {feature.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-400 mb-4">{feature.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Submitted by {feature.submittedBy}</span>
                          <span>•</span>
                          <span>{feature.submittedDate}</span>
                        </div>
                      </div>

                      {/* Right Side - Actions and Image Placeholder */}
                      <div className="col-span-4">
                        <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 rounded-lg h-32 mb-4 flex items-center justify-center">
                          <TrendingUp className="w-12 h-12 text-yellow-500/30" />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpvote(feature.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                              feature.hasUpvoted
                                ? 'bg-yellow-500 text-gray-900'
                                : 'bg-gray-700 text-white hover:bg-gray-600'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Upvote ({feature.upvotes})
                          </button>
                          <button
                            onClick={() => handleComment(feature.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                          >
                            <MessageSquare className="w-4 h-4" />
                            {feature.comments}
                          </button>
                          <button
                            onClick={() => handleSubscribe(feature.id)}
                            className={`p-2 rounded-lg transition ${
                              feature.isSubscribed
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                            }`}
                            title={feature.isSubscribed ? 'Subscribed to updates' : 'Subscribe to updates'}
                          >
                            <Bell className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit New Feature Request Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                <Plus className="w-5 h-5" />
                Submit New Feature Request
              </button>
            </div>

            {/* Submit Feature Modal */}
            {showSubmitModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-2xl w-full mx-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Submit Feature Request</h2>
                    <button
                      onClick={() => setShowSubmitModal(false)}
                      className="p-2 hover:bg-gray-700 rounded transition"
                    >
                      <span className="text-2xl text-gray-400">&times;</span>
                    </button>
                  </div>

                  <form className="space-y-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Feature Title</label>
                      <input
                        type="text"
                        placeholder="Enter a clear, concise title"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Category</label>
                      <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500">
                        <option>Select a category...</option>
                        <option>AI Features</option>
                        <option>Interview Prep</option>
                        <option>Career Planning</option>
                        <option>Job Search</option>
                        <option>Resume Tools</option>
                        <option>Career Development</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Description</label>
                      <textarea
                        placeholder="Describe the feature in detail..."
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Why is this important?</label>
                      <textarea
                        placeholder="Explain why this feature would be valuable..."
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                      >
                        Submit Request
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSubmitModal(false)}
                        className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
