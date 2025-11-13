import { useUser } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FileText, Briefcase, Star, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useUser();

  const stats = [
    {
      label: 'STAR Stories',
      value: 0,
      icon: Star,
      color: 'text-yellow-500',
      link: '/star-stories',
    },
    {
      label: 'Resumes',
      value: 0,
      icon: FileText,
      color: 'text-blue-500',
      link: '/resumes',
    },
    {
      label: 'Active Applications',
      value: 0,
      icon: Briefcase,
      color: 'text-green-500',
      link: '/jobs',
    },
    {
      label: 'Interviews',
      value: 0,
      icon: TrendingUp,
      color: 'text-purple-500',
      link: '/jobs',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.firstName || 'there'}! 👋
              </h1>
              <p className="text-gray-400">
                Here's your job search overview
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <Link
                  key={stat.label}
                  to={stat.link}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <ArrowRight className="w-5 h-5 text-gray-600" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/star-stories"
                  className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  <Plus className="w-5 h-5 text-yellow-500" />
                  <span className="text-white">Create STAR Story</span>
                </Link>
                <Link
                  to="/resume-builder"
                  className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  <Plus className="w-5 h-5 text-blue-500" />
                  <span className="text-white">Generate Resume</span>
                </Link>
                <Link
                  to="/jobs"
                  className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  <Plus className="w-5 h-5 text-green-500" />
                  <span className="text-white">Track New Job</span>
                </Link>
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-700/50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">🚀 Get Started</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 text-gray-900 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-white font-medium">Create your first STAR story</p>
                    <p className="text-gray-400 text-sm">Document your achievements using the STAR method</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 text-gray-900 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-white font-medium">Generate an AI-powered resume</p>
                    <p className="text-gray-400 text-sm">Use your STAR stories to create tailored resumes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 text-gray-900 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-white font-medium">Start tracking applications</p>
                    <p className="text-gray-400 text-sm">Organize your job search with our Kanban board</p>
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
