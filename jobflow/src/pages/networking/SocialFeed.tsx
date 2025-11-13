import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  TrendingUp,
  Briefcase,
  Award,
  FileText,
  Filter,
  Plus,
} from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    title: string;
    company: string;
    imageUrl: string;
  };
  content: string;
  type: 'update' | 'article' | 'achievement' | 'job';
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  imageUrl?: string;
  articleTitle?: string;
  jobTitle?: string;
  hashtags?: string[];
}

export default function SocialFeed() {
  const [feedFilter, setFeedFilter] = useState<'all' | 'connections' | 'recommended'>('all');
  const [topicFilter, setTopicFilter] = useState<'all' | 'career' | 'tech' | 'industry'>('all');

  const posts: Post[] = [
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        title: 'Senior Product Manager',
        company: 'Microsoft',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
      },
      content:
        "Excited to share that I've been promoted to Senior Product Manager! This journey has been incredible, and I'm grateful for the amazing team that supported me along the way. Looking forward to the new challenges ahead! 🚀",
      type: 'achievement',
      timestamp: '2 hours ago',
      likes: 156,
      comments: 23,
      shares: 8,
      isLiked: false,
      isBookmarked: false,
      hashtags: ['careerwin', 'productmanagement', 'promotion'],
    },
    {
      id: '2',
      author: {
        name: 'Michael Chen',
        title: 'Full Stack Developer',
        company: 'Google',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      },
      content:
        'Just published a new article on microservices architecture patterns. Check it out and let me know your thoughts!',
      type: 'article',
      timestamp: '5 hours ago',
      likes: 89,
      comments: 15,
      shares: 34,
      isLiked: true,
      isBookmarked: true,
      articleTitle: 'Building Scalable Microservices: Best Practices and Patterns',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=300&fit=crop',
      hashtags: ['softwarearchitecture', 'microservices', 'techblog'],
    },
    {
      id: '3',
      author: {
        name: 'Emily Rodriguez',
        title: 'Marketing Director',
        company: 'Adobe',
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      },
      content:
        "We're looking for talented marketers to join our team! If you're passionate about digital marketing and want to work with creative minds, check out the open positions. DM me for referrals!",
      type: 'job',
      timestamp: '1 day ago',
      likes: 67,
      comments: 42,
      shares: 18,
      isLiked: false,
      isBookmarked: false,
      jobTitle: 'Senior Digital Marketing Manager - Remote',
      hashtags: ['hiring', 'digitalmade', 'remotework'],
    },
    {
      id: '4',
      author: {
        name: 'David Kim',
        title: 'Data Scientist',
        company: 'Amazon',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
      },
      content:
        'Interesting observation from my latest project: proper data preprocessing can improve model accuracy by up to 40%. Sometimes the simplest steps have the biggest impact. What data science tips do you swear by?',
      type: 'update',
      timestamp: '2 days ago',
      likes: 234,
      comments: 67,
      shares: 12,
      isLiked: true,
      isBookmarked: true,
      hashtags: ['datascience', 'machinelearning', 'AI'],
    },
    {
      id: '5',
      author: {
        name: 'Jessica Taylor',
        title: 'UX Designer',
        company: 'Figma',
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop',
      },
      content:
        "Thrilled to announce that our design system won the UX Design Award 2024! This wouldn't have been possible without the incredible collaboration across teams. A huge thank you to everyone involved! 🏆",
      type: 'achievement',
      timestamp: '3 days ago',
      likes: 412,
      comments: 89,
      shares: 45,
      isLiked: false,
      isBookmarked: false,
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=300&fit=crop',
      hashtags: ['uxdesign', 'designsystem', 'award'],
    },
  ];

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'article':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'job':
        return <Briefcase className="w-5 h-5 text-green-500" />;
      default:
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'Shared an achievement';
      case 'article':
        return 'Shared an article';
      case 'job':
        return 'Posted a job';
      default:
        return 'Posted an update';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Professional Feed</h1>
                  <p className="text-gray-400">Stay updated with your network</p>
                </div>
                <Link
                  to="/networking/create-post"
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg transition font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create Post
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">Filter Feed</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">View</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFeedFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        feedFilter === 'all'
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFeedFilter('connections')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        feedFilter === 'connections'
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Connections
                    </button>
                    <button
                      onClick={() => setFeedFilter('recommended')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        feedFilter === 'recommended'
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Recommended
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Topic</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTopicFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        topicFilter === 'all'
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setTopicFilter('career')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        topicFilter === 'career'
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Career
                    </button>
                    <button
                      onClick={() => setTopicFilter('tech')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        topicFilter === 'tech'
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Tech
                    </button>
                    <button
                      onClick={() => setTopicFilter('industry')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        topicFilter === 'industry'
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Industry
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={post.author.imageUrl}
                          alt={post.author.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-white font-bold">{post.author.name}</h3>
                          <p className="text-sm text-gray-400">
                            {post.author.title} at {post.author.company}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {getPostIcon(post.type)}
                            <span className="text-xs text-gray-500">
                              {getPostTypeLabel(post.type)} • {post.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white transition">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div>
                      <p className="text-white mb-3 leading-relaxed">{post.content}</p>

                      {/* Article Preview */}
                      {post.type === 'article' && post.articleTitle && (
                        <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                          <h4 className="text-white font-bold mb-2">{post.articleTitle}</h4>
                          {post.imageUrl && (
                            <img
                              src={post.imageUrl}
                              alt={post.articleTitle}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      )}

                      {/* Job Preview */}
                      {post.type === 'job' && post.jobTitle && (
                        <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-5 h-5 text-green-500" />
                            <h4 className="text-white font-bold">{post.jobTitle}</h4>
                          </div>
                          <button className="text-sm text-green-500 hover:text-green-400 font-medium">
                            View Job Details →
                          </button>
                        </div>
                      )}

                      {/* Achievement Image */}
                      {post.type === 'achievement' && post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt="Achievement"
                          className="w-full h-64 object-cover rounded-lg mt-4"
                        />
                      )}

                      {/* Hashtags */}
                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.hashtags.map((tag) => (
                            <span
                              key={tag}
                              className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post Stats */}
                  <div className="px-6 py-3 border-t border-gray-700 text-sm text-gray-400">
                    <div className="flex items-center justify-between">
                      <span>{post.likes} likes</span>
                      <div className="flex items-center gap-4">
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="px-6 py-3 border-t border-gray-700 flex items-center justify-between">
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        post.isLiked
                          ? 'text-blue-500'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <ThumbsUp className="w-5 h-5" />
                      <span className="text-sm font-medium">Like</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        post.isBookmarked
                          ? 'text-yellow-500'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition border border-gray-700">
                Load More Posts
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
