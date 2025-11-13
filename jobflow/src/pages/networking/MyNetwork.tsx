import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Search, Filter, MapPin, Briefcase, Star, MessageCircle, Mail } from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  imageUrl: string;
  connectionStrength: 'strong' | 'medium' | 'weak';
  lastActive: string;
  industry: string;
  tags: string[];
}

export default function MyNetwork() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStrength, setSelectedStrength] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const connections: Connection[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Senior Product Manager',
      company: 'Microsoft',
      location: 'Seattle, WA',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
      connectionStrength: 'strong',
      lastActive: '2 hours ago',
      industry: 'Technology',
      tags: ['Product Management', 'Strategy'],
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'Full Stack Developer',
      company: 'Google',
      location: 'Mountain View, CA',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      connectionStrength: 'strong',
      lastActive: '5 hours ago',
      industry: 'Technology',
      tags: ['React', 'Node.js', 'AWS'],
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      title: 'Marketing Director',
      company: 'Adobe',
      location: 'San Francisco, CA',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      connectionStrength: 'medium',
      lastActive: '1 day ago',
      industry: 'Marketing',
      tags: ['Digital Marketing', 'Brand Strategy'],
    },
    {
      id: '4',
      name: 'David Kim',
      title: 'Data Scientist',
      company: 'Amazon',
      location: 'Austin, TX',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
      connectionStrength: 'medium',
      lastActive: '3 days ago',
      industry: 'Technology',
      tags: ['Machine Learning', 'Python', 'Analytics'],
    },
    {
      id: '5',
      name: 'Jessica Taylor',
      title: 'UX Designer',
      company: 'Figma',
      location: 'New York, NY',
      imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop',
      connectionStrength: 'weak',
      lastActive: '1 week ago',
      industry: 'Design',
      tags: ['UI/UX', 'Prototyping', 'User Research'],
    },
    {
      id: '6',
      name: 'Robert Martinez',
      title: 'DevOps Engineer',
      company: 'Netflix',
      location: 'Los Angeles, CA',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      connectionStrength: 'strong',
      lastActive: '6 hours ago',
      industry: 'Technology',
      tags: ['Kubernetes', 'Docker', 'CI/CD'],
    },
  ];

  const industries = ['all', 'Technology', 'Marketing', 'Design', 'Finance', 'Healthcare'];
  const strengths = ['all', 'strong', 'medium', 'weak'];

  const filteredConnections = connections.filter((connection) => {
    const matchesSearch =
      connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry = selectedIndustry === 'all' || connection.industry === selectedIndustry;
    const matchesStrength = selectedStrength === 'all' || connection.connectionStrength === selectedStrength;

    return matchesSearch && matchesIndustry && matchesStrength;
  });

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'weak':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStrengthBadge = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'bg-green-500/20 text-green-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'weak':
        return 'bg-gray-500/20 text-gray-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
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
              <h1 className="text-3xl font-bold text-white mb-2">My Network</h1>
              <p className="text-gray-400">{connections.length} connections</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search connections by name, company, or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Industry
                    </label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600"
                    >
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry.charAt(0).toUpperCase() + industry.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Connection Strength
                    </label>
                    <select
                      value={selectedStrength}
                      onChange={(e) => setSelectedStrength(e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600"
                    >
                      {strengths.map((strength) => (
                        <option key={strength} value={strength}>
                          {strength.charAt(0).toUpperCase() + strength.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Connections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConnections.map((connection) => (
                <div
                  key={connection.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition"
                >
                  {/* Profile Section */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={connection.imageUrl}
                      alt={connection.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-1 truncate">
                        {connection.name}
                      </h3>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStrengthBadge(connection.connectionStrength)}`}>
                        <Star className={`w-3 h-3 ${getStrengthColor(connection.connectionStrength)}`} />
                        {connection.connectionStrength}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{connection.title}</p>
                        <p className="text-xs text-gray-400 truncate">{connection.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-400 truncate">{connection.location}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {connection.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {connection.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-700 text-xs text-gray-400 rounded">
                        +{connection.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Last Active */}
                  <p className="text-xs text-gray-500 mb-4">Active {connection.lastActive}</p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg transition text-sm font-medium">
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredConnections.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No connections found matching your filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustry('all');
                    setSelectedStrength('all');
                  }}
                  className="text-yellow-500 hover:text-yellow-400 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
