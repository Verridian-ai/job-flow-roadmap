import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Users, UserPlus, TrendingUp, Calendar, Plus, Search } from 'lucide-react';

interface SuggestedConnection {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  reason: string;
  imageUrl: string;
  mutualConnections: number;
}

export default function NetworkingHub() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    {
      label: 'Total Connections',
      value: 342,
      icon: Users,
      color: 'text-blue-500',
      change: '+12 this week',
    },
    {
      label: 'Pending Requests',
      value: 8,
      icon: UserPlus,
      color: 'text-yellow-500',
      change: '5 received, 3 sent',
    },
    {
      label: 'Profile Views',
      value: 156,
      icon: TrendingUp,
      color: 'text-green-500',
      change: '+23% this month',
    },
    {
      label: 'Upcoming Events',
      value: 4,
      icon: Calendar,
      color: 'text-purple-500',
      change: 'Next: Today 3PM',
    },
  ];

  const suggestedConnections: SuggestedConnection[] = [
    {
      id: '1',
      name: 'Ethan Carter',
      title: 'Software Engineer',
      company: 'Tech Innovators Inc.',
      location: 'San Francisco',
      reason: 'Similar career path',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      mutualConnections: 12,
    },
    {
      id: '2',
      name: 'Olivia Bennett',
      title: 'Data Scientist',
      company: 'Data Insights Corp.',
      location: 'New York',
      reason: 'Shared skills: Python & AWS',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
      mutualConnections: 8,
    },
    {
      id: '3',
      name: 'Noah Thompson',
      title: 'Product Manager',
      company: 'Global Solutions Ltd.',
      location: 'London',
      reason: 'Alumni of Stanford University',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
      mutualConnections: 15,
    },
    {
      id: '4',
      name: 'Ava Harper',
      title: 'UX Designer',
      company: 'Creative Designs Co.',
      location: 'Los Angeles',
      reason: 'Currently hiring for roles matching your preferences',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      mutualConnections: 6,
    },
  ];

  const networkInsights = [
    { label: 'Industry Reach', value: '28 industries' },
    { label: 'Company Diversity', value: '156 companies' },
    { label: 'Geographic Spread', value: '43 cities' },
    { label: 'Average Response Time', value: '2.4 hours' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Networking Hub
              </h1>
              <p className="text-gray-400">
                Build and manage your professional network
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for professionals by name, company, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600"
                />
              </div>
            </div>

            {/* Network Insights */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Network Insights</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {networkInsights.map((insight) => (
                  <div key={insight.label} className="text-center">
                    <p className="text-2xl font-bold text-yellow-500 mb-1">{insight.value}</p>
                    <p className="text-sm text-gray-400">{insight.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI-Suggested Connections */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">AI-Suggested Connections</h2>
                <Link
                  to="/networking/my-network"
                  className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                >
                  View All Connections
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestedConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={connection.imageUrl}
                        alt={connection.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">{connection.reason}</p>
                        <h3 className="text-lg font-bold text-white mb-1">
                          {connection.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-1">
                          {connection.title} at {connection.company}
                        </p>
                        <p className="text-xs text-gray-500">{connection.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <p className="text-xs text-gray-500">
                        {connection.mutualConnections} mutual connections
                      </p>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm font-medium">
                        <Plus className="w-4 h-4" />
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/networking/my-network"
                  className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <span className="block text-white font-medium">My Network</span>
                    <span className="text-xs text-gray-400">View all connections</span>
                  </div>
                </Link>
                <Link
                  to="/networking/requests"
                  className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  <UserPlus className="w-5 h-5 text-yellow-500" />
                  <div>
                    <span className="block text-white font-medium">Connection Requests</span>
                    <span className="text-xs text-gray-400">8 pending requests</span>
                  </div>
                </Link>
                <Link
                  to="/networking/feed"
                  className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <div>
                    <span className="block text-white font-medium">Social Feed</span>
                    <span className="text-xs text-gray-400">See what's trending</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
