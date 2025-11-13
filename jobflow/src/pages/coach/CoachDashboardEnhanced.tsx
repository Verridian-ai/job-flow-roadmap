import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  Search
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'pending' | 'completed';
  nextSession?: string;
  progress: number;
}

interface Session {
  id: string;
  clientName: string;
  date: string;
  time: string;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function CoachDashboardEnhanced() {
  const [clients] = useState<Client[]>([
    { id: '1', name: 'Sarah Johnson', avatar: 'SJ', status: 'active', nextSession: 'Tomorrow, 2:00 PM', progress: 65 },
    { id: '2', name: 'Michael Chen', avatar: 'MC', status: 'active', nextSession: 'Today, 4:30 PM', progress: 40 },
    { id: '3', name: 'Emily Davis', avatar: 'ED', status: 'pending', progress: 15 },
    { id: '4', name: 'James Wilson', avatar: 'JW', status: 'active', nextSession: 'Friday, 10:00 AM', progress: 85 },
  ]);

  const [upcomingSessions] = useState<Session[]>([
    { id: '1', clientName: 'Michael Chen', date: 'Today', time: '4:30 PM', type: 'Interview Prep', status: 'upcoming' },
    { id: '2', clientName: 'Sarah Johnson', date: 'Tomorrow', time: '2:00 PM', type: 'Resume Review', status: 'upcoming' },
    { id: '3', clientName: 'James Wilson', date: 'Friday', time: '10:00 AM', type: 'Career Strategy', status: 'upcoming' },
  ]);

  const stats = {
    totalClients: 24,
    activeClients: 18,
    monthlyEarnings: 8450,
    averageRating: 4.8,
    upcomingSessions: 8,
    completedSessions: 142,
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen">
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center gap-3 p-2 mb-8">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-bold">
                AM
              </div>
              <div>
                <h1 className="text-white text-base font-medium">Alex Morgan</h1>
                <p className="text-gray-400 text-sm">Career Coach</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2 mb-auto">
              <Link
                to="/coach-dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-yellow-500/20 text-yellow-500"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <Link
                to="/coach/clients"
                className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-lg"
              >
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Clients</span>
              </Link>
              <Link
                to="/coach/calendar"
                className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-lg"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Calendar</span>
              </Link>
              <Link
                to="/coach/content"
                className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-lg"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm font-medium">Content Library</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-800 rounded-lg"
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </nav>

            <button className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:opacity-90 transition-opacity">
              Add New Client
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Top Bar */}
          <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome back, Alex</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search clients..."
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500"
                  />
                  <Search className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
                </div>
                <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stats.totalClients}</h3>
                <p className="text-sm text-gray-400">Total Clients</p>
                <p className="text-xs text-green-400 mt-2">+12% from last month</p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">${stats.monthlyEarnings.toLocaleString()}</h3>
                <p className="text-sm text-gray-400">This Month</p>
                <p className="text-xs text-green-400 mt-2">+8% from last month</p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stats.upcomingSessions}</h3>
                <p className="text-sm text-gray-400">Upcoming Sessions</p>
                <p className="text-xs text-gray-500 mt-2">Next: Today, 4:30 PM</p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Star className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stats.averageRating}</h3>
                <p className="text-sm text-gray-400">Average Rating</p>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= Math.floor(stats.averageRating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Sessions */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 border border-gray-700 rounded-lg">
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white">Upcoming Sessions</h2>
                      <Link to="/coach/calendar" className="text-sm text-yellow-500 hover:text-yellow-400">
                        View All
                      </Link>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-700">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="p-6 hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-semibold">
                              {session.clientName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{session.clientName}</h3>
                              <p className="text-sm text-gray-400">{session.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">{session.time}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{session.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Clients */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 border border-gray-700 rounded-lg">
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white">Active Clients</h2>
                      <Link to="/coach/clients" className="text-sm text-yellow-500 hover:text-yellow-400">
                        View All
                      </Link>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-700">
                    {clients.filter(c => c.status === 'active').map((client) => (
                      <Link
                        key={client.id}
                        to={`/coach/clients/${client.id}`}
                        className="block p-4 hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-semibold text-sm">
                            {client.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white text-sm truncate">{client.name}</h3>
                            {client.nextSession && (
                              <p className="text-xs text-gray-400 truncate">{client.nextSession}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-yellow-500 font-medium">{client.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div
                              className="bg-yellow-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${client.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
