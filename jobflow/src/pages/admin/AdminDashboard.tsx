import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  Star,
  Briefcase,
  FileText,
  MessageSquare
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useUser();
  const [timeRange, setTimeRange] = useState('30d');

  const keyMetrics = [
    {
      label: 'Total Users',
      value: '12,547',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      label: 'Active Users (MAU)',
      value: '8,932',
      change: '+8.2%',
      trend: 'up',
      icon: Activity,
      color: 'text-green-500'
    },
    {
      label: 'MRR',
      value: '$45,230',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-yellow-500'
    },
    {
      label: 'Churn Rate',
      value: '2.1%',
      change: '-0.5%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-red-500'
    }
  ];

  const userGrowthData = [
    { month: 'Jan', users: 8500 },
    { month: 'Feb', users: 9200 },
    { month: 'Mar', users: 9800 },
    { month: 'Apr', users: 10500 },
    { month: 'May', users: 11200 },
    { month: 'Jun', users: 12547 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 32000 },
    { month: 'Feb', revenue: 35000 },
    { month: 'Mar', revenue: 38000 },
    { month: 'Apr', revenue: 40000 },
    { month: 'May', revenue: 42500 },
    { month: 'Jun', revenue: 45230 }
  ];

  const subscriptionTiers = [
    { tier: 'Free', users: 7528, percentage: 60, revenue: '$0' },
    { tier: 'Basic', users: 3137, percentage: 25, revenue: '$15,685' },
    { tier: 'Pro', users: 1508, percentage: 12, revenue: '$22,620' },
    { tier: 'Enterprise', users: 374, percentage: 3, revenue: '$6,925' }
  ];

  const coachPerformance = [
    {
      name: 'Sarah Johnson',
      sessions: 42,
      rating: 4.9,
      earnings: '$2,100',
      status: 'active'
    },
    {
      name: 'Michael Chen',
      sessions: 38,
      rating: 4.8,
      earnings: '$1,900',
      status: 'active'
    },
    {
      name: 'Emily Davis',
      sessions: 35,
      rating: 4.7,
      earnings: '$1,750',
      status: 'active'
    },
    {
      name: 'David Wilson',
      sessions: 28,
      rating: 4.6,
      earnings: '$1,400',
      status: 'inactive'
    }
  ];

  const featureUsage = [
    { feature: 'Resume Builder', users: 9845, percentage: 78 },
    { feature: 'Job Tracking', users: 8234, percentage: 66 },
    { feature: 'STAR Stories', users: 7123, percentage: 57 },
    { feature: 'Coach Sessions', users: 5432, percentage: 43 },
    { feature: 'Interview Prep', users: 4321, percentage: 34 },
    { feature: 'Marketplace', users: 3210, percentage: 26 }
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Admin Analytics</h1>
                  <p className="text-gray-400">Platform-wide metrics and insights</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition">
                    <Download className="w-5 h-5" />
                    Export Report
                  </button>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {keyMetrics.map((metric, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
                    {metric.trend === 'up' ? (
                      <ArrowUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                  <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
                  <p className={`text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.change} vs last period
                  </p>
                </div>
              ))}
            </div>

            {/* User Growth & Revenue Charts */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* User Growth */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">User Growth</h2>
                <div className="h-64 flex items-end justify-between gap-2">
                  {userGrowthData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-blue-500 rounded-t hover:bg-blue-400 transition cursor-pointer"
                        style={{ height: `${(data.users / 13000) * 100}%` }}
                        title={`${data.users.toLocaleString()} users`}
                      />
                      <span className="text-xs text-gray-400">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Monthly Recurring Revenue</h2>
                <div className="h-64 flex items-end justify-between gap-2">
                  {revenueData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-yellow-500 rounded-t hover:bg-yellow-400 transition cursor-pointer"
                        style={{ height: `${(data.revenue / 50000) * 100}%` }}
                        title={`$${data.revenue.toLocaleString()}`}
                      />
                      <span className="text-xs text-gray-400">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subscription Tiers */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Subscription Distribution</h2>
              <div className="space-y-4">
                {subscriptionTiers.map((tier, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-semibold">{tier.tier}</span>
                        <span className="text-gray-400 text-sm">
                          {tier.users.toLocaleString()} users ({tier.percentage}%)
                        </span>
                      </div>
                      <span className="text-white font-semibold">{tier.revenue}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full"
                        style={{ width: `${tier.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coach Performance & Feature Usage */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Coach Performance */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Top Coach Performance</h2>
                <div className="space-y-3">
                  {coachPerformance.map((coach, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-750 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold">{coach.name}</h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              coach.status === 'active'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-gray-700 text-gray-400'
                            }`}
                          >
                            {coach.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{coach.sessions} sessions</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            {coach.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{coach.earnings}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Usage */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Feature Usage Statistics</h2>
                <div className="space-y-4">
                  {featureUsage.map((feature, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white">{feature.feature}</span>
                        <span className="text-gray-400 text-sm">
                          {feature.users.toLocaleString()} ({feature.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${feature.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Platform Activity</h2>
              <div className="space-y-3">
                {[
                  {
                    icon: Users,
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-500/20',
                    text: '47 new users registered',
                    time: '5 minutes ago'
                  },
                  {
                    icon: FileText,
                    color: 'text-green-500',
                    bgColor: 'bg-green-500/20',
                    text: '123 resumes generated',
                    time: '12 minutes ago'
                  },
                  {
                    icon: Briefcase,
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-500/20',
                    text: '89 new job applications tracked',
                    time: '28 minutes ago'
                  },
                  {
                    icon: MessageSquare,
                    color: 'text-purple-500',
                    bgColor: 'bg-purple-500/20',
                    text: '34 coach sessions completed',
                    time: '1 hour ago'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-750 rounded-lg">
                    <div className={`p-2 ${activity.bgColor} rounded-lg`}>
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white">{activity.text}</p>
                    </div>
                    <span className="text-gray-400 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
