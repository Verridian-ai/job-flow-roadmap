import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  Search,
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  Lock,
  Globe,
  Plus,
  Settings,
  Bell,
  FileText,
  UserPlus,
} from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  memberCount: number;
  postCount: number;
  category: string;
  privacy: 'public' | 'private';
  isMember: boolean;
  isAdmin?: boolean;
  activity: 'high' | 'medium' | 'low';
}

export default function Groups() {
  const [activeTab, setActiveTab] = useState<'discover' | 'mygroups'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all',
    'Software Engineering',
    'Data Science',
    'Product Management',
    'Design',
    'Marketing',
    'Career Development',
  ];

  const groups: Group[] = [
    {
      id: '1',
      name: 'React Developers Network',
      description:
        'A community for React developers to share knowledge, discuss best practices, and collaborate on projects.',
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop',
      memberCount: 12450,
      postCount: 1834,
      category: 'Software Engineering',
      privacy: 'public',
      isMember: true,
      isAdmin: false,
      activity: 'high',
    },
    {
      id: '2',
      name: 'Product Leaders Forum',
      description:
        'Exclusive group for product managers and leaders to discuss strategy, roadmaps, and leadership.',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
      memberCount: 8920,
      postCount: 2145,
      category: 'Product Management',
      privacy: 'private',
      isMember: true,
      isAdmin: true,
      activity: 'high',
    },
    {
      id: '3',
      name: 'Data Science & ML Hub',
      description:
        'Connect with data scientists, discuss ML algorithms, share datasets, and collaborate on AI projects.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
      memberCount: 15670,
      postCount: 3421,
      category: 'Data Science',
      privacy: 'public',
      isMember: false,
      activity: 'high',
    },
    {
      id: '4',
      name: 'UX/UI Designers Collective',
      description:
        'A creative space for designers to share portfolios, get feedback, and discuss design trends.',
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
      memberCount: 9340,
      postCount: 1567,
      category: 'Design',
      privacy: 'public',
      isMember: true,
      activity: 'medium',
    },
    {
      id: '5',
      name: 'Career Growth & Mentorship',
      description:
        'Find mentors, share career advice, and support each other in professional development journeys.',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop',
      memberCount: 21450,
      postCount: 4892,
      category: 'Career Development',
      privacy: 'public',
      isMember: false,
      activity: 'high',
    },
    {
      id: '6',
      name: 'Growth Marketing Strategies',
      description:
        'Discuss growth hacking, marketing automation, SEO, and digital marketing strategies.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
      memberCount: 7230,
      postCount: 1245,
      category: 'Marketing',
      privacy: 'private',
      isMember: false,
      activity: 'medium',
    },
  ];

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;

    const matchesTab =
      activeTab === 'discover' ? !group.isMember : group.isMember;

    return matchesSearch && matchesCategory && matchesTab;
  });

  const myGroups = groups.filter((g) => g.isMember);

  const getActivityBadge = (activity: string) => {
    switch (activity) {
      case 'high':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-medium">
            <TrendingUp className="w-3 h-3" />
            Very Active
          </span>
        );
      case 'medium':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs font-medium">
            <TrendingUp className="w-3 h-3" />
            Active
          </span>
        );
      case 'low':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-500 rounded text-xs font-medium">
            <TrendingUp className="w-3 h-3" />
            Quiet
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Groups & Communities</h1>
                  <p className="text-gray-400">
                    {activeTab === 'discover'
                      ? 'Discover and join professional communities'
                      : `You're a member of ${myGroups.length} groups`}
                  </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg transition font-medium">
                  <Plus className="w-5 h-5" />
                  Create Group
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg mb-8">
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`flex-1 px-6 py-4 text-sm font-bold ${
                    activeTab === 'discover'
                      ? 'text-white border-b-2 border-yellow-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Discover Groups
                </button>
                <button
                  onClick={() => setActiveTab('mygroups')}
                  className={`flex-1 px-6 py-4 text-sm font-bold ${
                    activeTab === 'mygroups'
                      ? 'text-white border-b-2 border-yellow-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  My Groups ({myGroups.length})
                </button>
              </div>

              {/* Search and Filters */}
              <div className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search groups..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition"
                >
                  {/* Group Image */}
                  <div className="relative h-32 bg-gradient-to-br from-gray-700 to-gray-800">
                    <img
                      src={group.imageUrl}
                      alt={group.name}
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {group.privacy === 'private' ? (
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-900/80 text-gray-300 rounded text-xs font-medium">
                          <Lock className="w-3 h-3" />
                          Private
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-900/80 text-gray-300 rounded text-xs font-medium">
                          <Globe className="w-3 h-3" />
                          Public
                        </span>
                      )}
                      {getActivityBadge(group.activity)}
                    </div>
                  </div>

                  {/* Group Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-white line-clamp-1">{group.name}</h3>
                      {group.isAdmin && (
                        <button className="text-gray-400 hover:text-white transition">
                          <Settings className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{group.description}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{group.memberCount.toLocaleString()} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{group.postCount.toLocaleString()} posts</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-gray-700 text-xs text-gray-300 rounded-full">
                        {group.category}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    {group.isMember ? (
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg transition font-medium">
                          <MessageSquare className="w-4 h-4" />
                          View Group
                        </button>
                        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">
                          <Bell className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium">
                        <UserPlus className="w-4 h-4" />
                        {group.privacy === 'private' ? 'Request to Join' : 'Join Group'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredGroups.length === 0 && (
              <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-lg">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No groups found.</p>
                <p className="text-sm text-gray-500">
                  {activeTab === 'discover'
                    ? 'Try adjusting your search or category filter.'
                    : "You haven't joined any groups yet. Discover groups to get started!"}
                </p>
              </div>
            )}

            {/* Group Management Tips (for My Groups tab) */}
            {activeTab === 'mygroups' && myGroups.length > 0 && (
              <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Group Activity Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span className="text-white font-medium">Upcoming Events</span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">12</p>
                    <p className="text-xs text-gray-400">Across all your groups</p>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      <span className="text-white font-medium">Shared Resources</span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">48</p>
                    <p className="text-xs text-gray-400">Documents and files</p>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <MessageSquare className="w-5 h-5 text-purple-500" />
                      <span className="text-white font-medium">Unread Discussions</span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">23</p>
                    <p className="text-xs text-gray-400">New posts to read</p>
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
