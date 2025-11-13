import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Calendar, DollarSign, Users, Star, TrendingUp } from 'lucide-react';

export default function CoachDashboard() {
  const { user } = useUser();
  const sessions = useQuery(api.sessions.listByCoach);
  const coachProfile = useQuery(api.coaches.getCurrentCoach);

  const upcomingSessions = sessions?.filter(s => s.status === 'scheduled') || [];
  const completedSessions = sessions?.filter(s => s.status === 'completed') || [];
  const totalEarnings = completedSessions.reduce((sum, s) => sum + (s.payment || 0), 0);

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
              <h1 className="text-3xl font-bold mb-2">
                Coach Dashboard
              </h1>
              <p className="text-gray-400">Welcome back, {user?.firstName || 'Coach'}!</p>
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
          </div>
        </main>
      </div>
    </div>
  );
}
