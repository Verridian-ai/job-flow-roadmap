import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  Calendar,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  BarChart3,
  Grid,
  List,
  FileText,
  MessageSquare,
  Clock,
  ChevronRight,
  Plus,
  Target,
  Award
} from 'lucide-react';

export default function CoachDashboard() {
  const { user } = useUser();
  const sessions = useQuery(api.sessions.listByCoach);
  const coachProfile = useQuery(api.coaches.getCurrentCoach);

  const [viewMode, setViewMode] = useState<'overview' | 'analytics' | 'clients' | 'resources'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const upcomingSessions = sessions?.filter(s => s.status === 'scheduled') || [];
  const completedSessions = sessions?.filter(s => s.status === 'completed') || [];
  const totalEarnings = completedSessions.reduce((sum, s) => sum + (s.payment || 0), 0);

  // Mock data for enhanced features
  const revenueData = [
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 3200 },
    { month: 'Mar', amount: 2800 },
    { month: 'Apr', amount: 4100 },
    { month: 'May', amount: 3600 },
    { month: 'Jun', amount: 4500 }
  ];

  const clients = [
    { id: 1, name: 'Sarah Johnson', status: 'active', sessions: 8, lastSession: '2024-03-20' },
    { id: 2, name: 'Michael Chen', status: 'active', sessions: 5, lastSession: '2024-03-18' },
    { id: 3, name: 'Emily Davis', status: 'paused', sessions: 3, lastSession: '2024-03-10' }
  ];

  const resources = [
    { id: 1, name: 'Resume Templates', type: 'template', downloads: 45 },
    { id: 2, name: 'Interview Guide', type: 'guide', downloads: 32 },
    { id: 3, name: 'STAR Method Worksheet', type: 'worksheet', downloads: 28 }
  ];

  const stats = [
    {
      label: 'Upcoming Sessions',
      value: upcomingSessions.length,
      icon: Calendar,
      color: 'text-blue-500',
    },
    {
      label: 'Total Earnings',
      value: `$${totalEarnings}`,
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      label: 'Total Clients',
      value: new Set(sessions?.map(s => s.userId)).size,
      icon: Users,
      color: 'text-purple-500',
    },
    {
      label: 'Rating',
      value: coachProfile?.rating.toFixed(1) || 'N/A',
      icon: Star,
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Coach Dashboard
                  </h1>
                  <p className="text-gray-400">Welcome back, {user?.firstName || 'Coach'}!</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Quick Actions
                  </button>
                  <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Schedule Session
                  </button>
                </div>
              </div>

              {/* View Mode Tabs */}
              <div className="border-b border-gray-700">
                <div className="flex gap-4">
                  <button
                    onClick={() => setViewMode('overview')}
                    className={`pb-3 px-2 font-medium transition flex items-center gap-2 ${
                      viewMode === 'overview'
                        ? 'text-yellow-500 border-b-2 border-yellow-500'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    Overview
                  </button>
                  <button
                    onClick={() => setViewMode('analytics')}
                    className={`pb-3 px-2 font-medium transition flex items-center gap-2 ${
                      viewMode === 'analytics'
                        ? 'text-yellow-500 border-b-2 border-yellow-500'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </button>
                  <button
                    onClick={() => setViewMode('clients')}
                    className={`pb-3 px-2 font-medium transition flex items-center gap-2 ${
                      viewMode === 'clients'
                        ? 'text-yellow-500 border-b-2 border-yellow-500'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Clients
                  </button>
                  <button
                    onClick={() => setViewMode('resources')}
                    className={`pb-3 px-2 font-medium transition flex items-center gap-2 ${
                      viewMode === 'resources'
                        ? 'text-yellow-500 border-b-2 border-yellow-500'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Resources
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-800 p-6 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <span className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-gray-400 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Content Based on View Mode */}
            {viewMode === 'overview' && (
              <>
                {/* Upcoming Sessions */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    Upcoming Sessions
                  </h2>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-3">
                  {upcomingSessions.slice(0, 5).map((session) => (
                    <div
                      key={session._id}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">
                          {session.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {session.scheduledFor 
                            ? new Date(session.scheduledFor).toLocaleString()
                            : 'Not scheduled yet'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-yellow-500">${session.payment || 0}</p>
                        <p className="text-sm text-gray-400">{session.duration} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No upcoming sessions scheduled.
                </p>
              )}
            </div>

            {/* Performance */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  Recent Activity
                </h2>
                {completedSessions.length > 0 ? (
                  <div className="space-y-3">
                    {completedSessions.slice(0, 5).map((session) => (
                      <div
                        key={session._id}
                        className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold text-sm">
                            {session.type.replace('_', ' ')}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {new Date(session._creationTime).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-green-500 font-semibold">
                          +${session.payment || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    No completed sessions yet.
                  </p>
                )}
              </div>

              {/* Profile Stats */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Your Profile
                </h2>
                {coachProfile ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Rating</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= coachProfile.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-semibold">
                          {coachProfile.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Reviews</p>
                      <p className="text-2xl font-bold">{coachProfile.reviewCount}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Hourly Rate</p>
                      <p className="text-2xl font-bold text-yellow-500">
                        ${coachProfile.hourlyRate}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Specialties</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {coachProfile.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    Complete your coach profile to get started.
                  </p>
                )}
              </div>
            </div>
              </>
            )}

            {/* Analytics View */}
            {viewMode === 'analytics' && (
              <div className="space-y-6">
                {/* Revenue Chart */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Revenue Analytics</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTimeRange('week')}
                        className={`px-3 py-1 rounded ${timeRange === 'week' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}
                      >
                        Week
                      </button>
                      <button
                        onClick={() => setTimeRange('month')}
                        className={`px-3 py-1 rounded ${timeRange === 'month' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}
                      >
                        Month
                      </button>
                      <button
                        onClick={() => setTimeRange('year')}
                        className={`px-3 py-1 rounded ${timeRange === 'year' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}
                      >
                        Year
                      </button>
                    </div>
                  </div>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {revenueData.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-yellow-500 rounded-t-lg transition-all hover:bg-yellow-400"
                          style={{ height: `${(data.amount / 5000) * 100}%` }}
                        />
                        <p className="text-xs text-gray-400 mt-2">{data.month}</p>
                        <p className="text-sm font-semibold">${data.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <Target className="w-8 h-8 text-green-500 mb-3" />
                    <p className="text-sm text-gray-400 mb-1">Session Completion Rate</p>
                    <p className="text-3xl font-bold">92%</p>
                    <p className="text-sm text-green-500 mt-2">+5% from last month</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <Award className="w-8 h-8 text-yellow-500 mb-3" />
                    <p className="text-sm text-gray-400 mb-1">Client Satisfaction</p>
                    <p className="text-3xl font-bold">4.8/5</p>
                    <p className="text-sm text-yellow-500 mt-2">Based on 45 reviews</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <TrendingUp className="w-8 h-8 text-purple-500 mb-3" />
                    <p className="text-sm text-gray-400 mb-1">Revenue Growth</p>
                    <p className="text-3xl font-bold">+25%</p>
                    <p className="text-sm text-purple-500 mt-2">Compared to last quarter</p>
                  </div>
                </div>
              </div>
            )}

            {/* Clients View */}
            {viewMode === 'clients' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">My Clients</h2>
                  <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Client
                  </button>
                </div>
                <div className="space-y-4">
                  {clients.map(client => (
                    <div key={client.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-yellow-500 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-900">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{client.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                              <span>{client.sessions} sessions</span>
                              <span>•</span>
                              <span>Last: {new Date(client.lastSession).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            client.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {client.status}
                          </span>
                          <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources View */}
            {viewMode === 'resources' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Resource Library</h2>
                  <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Resource
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {resources.map(resource => (
                    <div key={resource.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-yellow-500 transition">
                      <FileText className="w-10 h-10 text-yellow-500 mb-4" />
                      <h3 className="font-semibold mb-2">{resource.name}</h3>
                      <p className="text-sm text-gray-400 mb-3 capitalize">{resource.type}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{resource.downloads} downloads</span>
                        <button className="text-yellow-500 hover:text-yellow-400">
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
