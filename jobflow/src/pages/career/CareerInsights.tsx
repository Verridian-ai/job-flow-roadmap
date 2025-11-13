import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { TrendingUp, Users, DollarSign, Target, Award, Lightbulb, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export default function CareerInsights() {
  const { user } = useUser();

  // Mock data for career progression
  const careerProgressionData = [
    { month: 'Jan', salary: 65000, marketValue: 68000 },
    { month: 'Feb', salary: 65000, marketValue: 69000 },
    { month: 'Mar', salary: 65000, marketValue: 70000 },
    { month: 'Apr', salary: 70000, marketValue: 71000 },
    { month: 'May', salary: 70000, marketValue: 72000 },
    { month: 'Jun', salary: 70000, marketValue: 73000 },
  ];

  // Mock data for skill growth
  const skillGrowthData = [
    { skill: 'React', proficiency: 85, target: 90 },
    { skill: 'TypeScript', proficiency: 80, target: 85 },
    { skill: 'Node.js', proficiency: 75, target: 85 },
    { skill: 'Python', proficiency: 70, target: 80 },
    { skill: 'AWS', proficiency: 65, target: 75 },
    { skill: 'Docker', proficiency: 60, target: 80 },
  ];

  // Mock data for peer comparison
  const peerComparisonData = [
    { category: 'Technical Skills', you: 82, peers: 75 },
    { category: 'Leadership', you: 70, peers: 68 },
    { category: 'Communication', you: 85, peers: 80 },
    { category: 'Project Mgmt', you: 75, peers: 72 },
    { category: 'Innovation', you: 88, peers: 78 },
  ];

  // Mock insights
  const insights = [
    {
      type: 'positive',
      title: 'Salary Growth Opportunity',
      description: 'Your market value has increased by $8,000 (12.3%) over the past 6 months. Consider discussing a raise.',
      icon: DollarSign,
      color: 'green',
    },
    {
      type: 'neutral',
      title: 'Skill Development Recommendation',
      description: 'Learning AWS and Docker could increase your market value by an estimated $15,000/year.',
      icon: Lightbulb,
      color: 'blue',
    },
    {
      type: 'warning',
      title: 'Career Milestone',
      description: 'You\'re approaching 3 years in your current role. Industry data suggests exploring senior positions.',
      icon: Target,
      color: 'yellow',
    },
  ];

  // Key metrics
  const metrics = [
    {
      label: 'Current Market Value',
      value: '$73,000',
      change: '+12.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      label: 'Skill Growth Score',
      value: '85/100',
      change: '+8 pts',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-500',
    },
    {
      label: 'Peer Percentile',
      value: '78th',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-500',
    },
    {
      label: 'Career Milestones',
      value: '12',
      change: '+3 this year',
      trend: 'up',
      icon: Award,
      color: 'text-yellow-500',
    },
  ];

  // AI Recommendations
  const recommendations = [
    {
      title: 'Senior Software Engineer Roles',
      description: 'Based on your skill progression, you\'re ready for senior positions. Avg salary: $95,000-$120,000',
      action: 'View Matching Jobs',
      link: '/jobs',
    },
    {
      title: 'AWS Certification Path',
      description: 'Complete AWS Solutions Architect certification to boost your market value by $15,000',
      action: 'Explore Learning Paths',
      link: '/learning',
    },
    {
      title: 'Leadership Development',
      description: 'Your technical skills are strong. Focus on leadership to unlock management positions.',
      action: 'Find a Coach',
      link: '/coaches',
    },
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
                Career Insights
              </h1>
              <p className="text-gray-400">
                Data-driven insights to accelerate your career growth
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
                    <div className={`flex items-center gap-1 text-sm ${
                      metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {metric.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span>{metric.change}</span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                  <p className="text-sm text-gray-400">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* AI-Powered Insights */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">AI-Powered Insights</h2>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`bg-gray-700 rounded-lg p-4 border-l-4 ${
                      insight.color === 'green'
                        ? 'border-green-500'
                        : insight.color === 'blue'
                        ? 'border-blue-500'
                        : 'border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <insight.icon className={`w-6 h-6 flex-shrink-0 ${
                        insight.color === 'green'
                          ? 'text-green-500'
                          : insight.color === 'blue'
                          ? 'text-blue-500'
                          : 'text-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{insight.title}</h3>
                        <p className="text-gray-400 text-sm">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Career Progression Timeline */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Career Progression</h2>
                <p className="text-gray-400 text-sm mb-4">
                  Your salary vs. market value over the past 6 months
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={careerProgressionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="salary"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                      name="Current Salary"
                    />
                    <Area
                      type="monotone"
                      dataKey="marketValue"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                      name="Market Value"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Skill Growth Chart */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Skill Growth Overview</h2>
                <p className="text-gray-400 text-sm mb-4">
                  Current proficiency vs. target levels
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillGrowthData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis dataKey="skill" type="category" stroke="#9CA3AF" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="proficiency" fill="#3B82F6" name="Current" />
                    <Bar dataKey="target" fill="#6B7280" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Peer Comparison */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Peer Comparison</h2>
              <p className="text-gray-400 text-sm mb-4">
                How you compare to professionals with similar experience (anonymized data)
              </p>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={peerComparisonData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="category" stroke="#9CA3AF" />
                    <PolarRadiusAxis stroke="#9CA3AF" />
                    <Radar
                      name="You"
                      dataKey="you"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Peer Average"
                      dataKey="peers"
                      stroke="#6B7280"
                      fill="#6B7280"
                      fillOpacity={0.3}
                    />
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Personalized Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 rounded-lg p-6 flex flex-col"
                  >
                    <h3 className="text-white font-semibold mb-2">{rec.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 flex-1">{rec.description}</p>
                    <Link
                      to={rec.link}
                      className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition text-center"
                    >
                      {rec.action}
                    </Link>
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
