import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Search, Check, X, MessageCircle, Eye, AlertTriangle, Bell } from 'lucide-react';

interface ConnectionRequest {
  id: string;
  name: string;
  title: string;
  company: string;
  imageUrl: string;
  message: string;
  relevance: 'high' | 'medium' | 'low';
  mutualConnections: number;
  profileViewed: string;
  type: 'incoming' | 'sent';
  sentDate?: string;
}

export default function ConnectionRequests() {
  const [activeTab, setActiveTab] = useState<'incoming' | 'sent' | 'all'>('incoming');
  const [searchQuery, setSearchQuery] = useState('');

  const requests: ConnectionRequest[] = [
    {
      id: '1',
      name: 'Ethan Carter',
      title: 'Senior Data Scientist',
      company: 'Tech Innovations Inc.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      message: "I'm impressed by your work in AI and would love to connect.",
      relevance: 'high',
      mutualConnections: 3,
      profileViewed: '2 days ago',
      type: 'incoming',
    },
    {
      id: '2',
      name: 'Olivia Bennett',
      title: 'Product Manager',
      company: 'Innovate Solutions',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
      message: "I'm looking to expand my network and connect with professionals like you.",
      relevance: 'low',
      mutualConnections: 0,
      profileViewed: '5 days ago',
      type: 'incoming',
    },
    {
      id: '3',
      name: 'Marcus Williams',
      title: 'Software Architect',
      company: 'Cloud Systems Corp.',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
      message: 'Interested in discussing cloud architecture patterns.',
      relevance: 'high',
      mutualConnections: 8,
      profileViewed: '1 day ago',
      type: 'incoming',
    },
    {
      id: '4',
      name: 'Sophia Martinez',
      title: 'UX Designer',
      company: 'Design Studio Inc.',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      message: "I'd love to connect and share design insights.",
      relevance: 'medium',
      mutualConnections: 5,
      profileViewed: '3 days ago',
      type: 'incoming',
    },
    {
      id: '5',
      name: 'Liam Harper',
      title: 'CTO',
      company: 'FutureTech',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      message: '',
      relevance: 'high',
      mutualConnections: 12,
      profileViewed: '',
      type: 'sent',
      sentDate: '2024-01-15',
    },
    {
      id: '6',
      name: 'Sophia Clark',
      title: 'Marketing Director',
      company: 'Global Brands',
      imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop',
      message: '',
      relevance: 'medium',
      mutualConnections: 6,
      profileViewed: '',
      type: 'sent',
      sentDate: '2024-01-10',
    },
  ];

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'incoming' && request.type === 'incoming') ||
      (activeTab === 'sent' && request.type === 'sent');

    return matchesSearch && matchesTab;
  });

  const incomingCount = requests.filter((r) => r.type === 'incoming').length;
  const sentCount = requests.filter((r) => r.type === 'sent').length;

  const getRelevanceBadge = (relevance: string) => {
    switch (relevance) {
      case 'high':
        return (
          <div className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-green-500 font-medium">High Relevance: 90%</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span className="text-yellow-500 font-medium">Medium Relevance</span>
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            <span className="text-gray-500 font-medium">Low Relevance</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Connection Requests Management
              </h1>
              <p className="text-gray-400">
                Review and manage your professional connection requests
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg mb-8">
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('incoming')}
                  className={`flex-1 px-6 py-4 text-sm font-bold ${
                    activeTab === 'incoming'
                      ? 'text-white border-b-2 border-yellow-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Incoming ({incomingCount})
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`flex-1 px-6 py-4 text-sm font-bold ${
                    activeTab === 'sent'
                      ? 'text-white border-b-2 border-yellow-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sent ({sentCount})
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 px-6 py-4 text-sm font-bold ${
                    activeTab === 'all'
                      ? 'text-white border-b-2 border-yellow-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All
                </button>
              </div>

              {/* Search */}
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Requests List */}
            <div className="space-y-6">
              {activeTab === 'incoming' && (
                <h2 className="text-2xl font-bold text-white">Incoming Requests</h2>
              )}
              {activeTab === 'sent' && (
                <h2 className="text-2xl font-bold text-white">Sent Requests</h2>
              )}

              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6"
                >
                  {/* Profile Section */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={request.imageUrl}
                      alt={request.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{request.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {request.title} at {request.company}
                      </p>
                      {request.type === 'incoming' && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm font-medium">
                          <Check className="w-4 h-4" />
                          Accept
                        </button>
                      )}
                      {request.type === 'sent' && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm font-medium">
                          <X className="w-4 h-4" />
                          Withdraw Request
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Relevance Badge */}
                  {request.type === 'incoming' && (
                    <div className="mb-3">
                      {getRelevanceBadge(request.relevance)}
                      {request.mutualConnections > 0 && (
                        <span className="text-xs text-gray-400 ml-3">
                          {request.mutualConnections} mutual connections
                        </span>
                      )}
                      {request.profileViewed && (
                        <span className="text-xs text-gray-400 ml-3">
                          Viewed your profile {request.profileViewed}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Message */}
                  {request.message && (
                    <p className="text-white text-base mb-4 p-4 bg-gray-700/50 rounded-lg">
                      {request.message}
                    </p>
                  )}

                  {/* Sent Date */}
                  {request.type === 'sent' && request.sentDate && (
                    <p className="text-xs text-gray-500 mb-4">
                      Pending | Sent on {request.sentDate}
                    </p>
                  )}

                  {/* Actions */}
                  {request.type === 'incoming' && (
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm font-medium">
                        Deny
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-gray-600 hover:bg-gray-700 text-white rounded-lg transition text-sm font-medium">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-gray-600 hover:bg-gray-700 text-white rounded-lg transition text-sm font-medium">
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>
                      {request.relevance === 'low' && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-red-600 hover:bg-red-900/20 text-red-500 rounded-lg transition text-sm font-medium ml-auto">
                          <AlertTriangle className="w-4 h-4" />
                          Report/Block
                        </button>
                      )}
                    </div>
                  )}

                  {request.type === 'sent' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-700">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm font-medium">
                        <Bell className="w-4 h-4" />
                        Send Reminder
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredRequests.length === 0 && (
              <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-lg">
                <p className="text-gray-400 mb-2">No connection requests found.</p>
                <p className="text-sm text-gray-500">
                  {activeTab === 'incoming' && "You don't have any incoming connection requests."}
                  {activeTab === 'sent' && "You haven't sent any connection requests."}
                  {activeTab === 'all' && "You don't have any connection requests."}
                </p>
              </div>
            )}

            {/* AI Insights Sidebar */}
            {incomingCount > 0 && activeTab === 'incoming' && (
              <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    💡
                  </span>
                  AI Insights & Proactive Management
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <p className="text-white font-medium mb-2">Actionable Insights</p>
                    <p className="text-sm text-gray-400">
                      Ethan Carter's request is highly relevant based on your shared connections
                      and industry.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium">Network Growth Goals</p>
                      <span className="text-sm text-gray-400">66%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Accept 3 new connections this week</p>
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
