import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { BookOpen, Clock, Award, Target, TrendingUp, PlayCircle, CheckCircle, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';

export default function LearningJourney() {
  const { user } = useUser();

  // Mock active courses
  const activeCourses = [
    {
      id: 1,
      title: 'AWS Solutions Architect - Professional',
      platform: 'A Cloud Guru',
      instructor: 'Ryan Kroonenburg',
      progress: 65,
      hoursCompleted: 26,
      totalHours: 40,
      lastAccessed: '2 hours ago',
      deadline: 'March 15, 2024',
      modules: 12,
      completedModules: 8,
      thumbnail: 'aws',
    },
    {
      id: 2,
      title: 'System Design Interview Prep',
      platform: 'Educative',
      instructor: 'Design Gurus',
      progress: 40,
      hoursCompleted: 10,
      totalHours: 25,
      lastAccessed: '1 day ago',
      deadline: 'April 1, 2024',
      modules: 15,
      completedModules: 6,
      thumbnail: 'system-design',
    },
    {
      id: 3,
      title: 'Advanced React Patterns',
      platform: 'Frontend Masters',
      instructor: 'Kent C. Dodds',
      progress: 85,
      hoursCompleted: 6.8,
      totalHours: 8,
      lastAccessed: '3 days ago',
      deadline: null,
      modules: 8,
      completedModules: 7,
      thumbnail: 'react',
    },
  ];

  // Mock completed certifications
  const completedCertifications = [
    {
      id: 1,
      title: 'React Advanced Patterns',
      platform: 'Frontend Masters',
      completedDate: 'January 15, 2024',
      certificate: true,
      grade: 'Passed with Distinction',
    },
    {
      id: 2,
      title: 'Professional Scrum Master I',
      platform: 'Scrum.org',
      completedDate: 'August 20, 2023',
      certificate: true,
      grade: '95%',
    },
    {
      id: 3,
      title: 'TypeScript Deep Dive',
      platform: 'Udemy',
      completedDate: 'June 5, 2023',
      certificate: true,
      grade: '100%',
    },
  ];

  // Mock learning goals
  const learningGoals = [
    {
      id: 1,
      title: 'Become AWS Certified',
      description: 'Complete AWS Solutions Architect Professional certification',
      targetDate: 'March 2024',
      progress: 65,
      status: 'on-track',
    },
    {
      id: 2,
      title: 'Master System Design',
      description: 'Learn to design scalable distributed systems',
      targetDate: 'April 2024',
      progress: 40,
      status: 'on-track',
    },
    {
      id: 3,
      title: 'Learn Kubernetes',
      description: 'Complete Kubernetes Administrator (CKA) certification',
      targetDate: 'May 2024',
      progress: 20,
      status: 'behind',
    },
  ];

  // Mock time investment data
  const timeInvestmentData = [
    { month: 'Aug', hours: 15 },
    { month: 'Sep', hours: 20 },
    { month: 'Oct', hours: 25 },
    { month: 'Nov', hours: 18 },
    { month: 'Dec', hours: 22 },
    { month: 'Jan', hours: 30 },
  ];

  // Mock learning by category
  const learningByCategory = [
    { name: 'Cloud/AWS', value: 35, color: '#3B82F6' },
    { name: 'System Design', value: 25, color: '#10B981' },
    { name: 'Frontend', value: 20, color: '#F59E0B' },
    { name: 'DevOps', value: 15, color: '#8B5CF6' },
    { name: 'Other', value: 5, color: '#6B7280' },
  ];

  // Stats
  const stats = [
    {
      label: 'Active Courses',
      value: activeCourses.length,
      icon: BookOpen,
      color: 'text-blue-500',
    },
    {
      label: 'Hours This Month',
      value: 30,
      icon: Clock,
      color: 'text-green-500',
    },
    {
      label: 'Certifications',
      value: completedCertifications.length,
      icon: Award,
      color: 'text-yellow-500',
    },
    {
      label: 'Active Goals',
      value: learningGoals.length,
      icon: Target,
      color: 'text-purple-500',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'on-track': 'text-green-500',
      'behind': 'text-red-500',
      'ahead': 'text-blue-500',
    };
    return colors[status] || 'text-gray-500';
  };

  const getStatusBg = (status: string) => {
    const colors: { [key: string]: string } = {
      'on-track': 'bg-green-500/20 border-green-500/50',
      'behind': 'bg-red-500/20 border-red-500/50',
      'ahead': 'bg-blue-500/20 border-blue-500/50',
    };
    return colors[status] || 'bg-gray-500/20 border-gray-500/50';
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
              <h1 className="text-3xl font-bold text-white mb-2">
                My Learning Journey
              </h1>
              <p className="text-gray-400">
                Track your courses, certifications, and learning goals
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Active Courses */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Active Courses</h2>
                <Link
                  to="/learning/paths"
                  className="text-yellow-500 hover:text-yellow-400 text-sm font-semibold"
                >
                  Browse Courses
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {activeCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/learning/course/${course.id}/progress`}
                    className="bg-gray-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-yellow-500 transition"
                  >
                    {/* Course thumbnail */}
                    <div className="h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-blue-500" />
                    </div>

                    {/* Course details */}
                    <div className="p-6">
                      <h3 className="text-white font-bold mb-1">{course.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{course.platform} • {course.instructor}</p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">Progress</span>
                          <span className="text-xs text-white font-semibold">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Course info */}
                      <div className="space-y-2 text-xs text-gray-400">
                        <div className="flex items-center justify-between">
                          <span>{course.completedModules} of {course.modules} modules</span>
                          <span>{course.hoursCompleted}/{course.totalHours} hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>Last accessed: {course.lastAccessed}</span>
                        </div>
                        {course.deadline && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>Deadline: {course.deadline}</span>
                          </div>
                        )}
                      </div>

                      <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition font-semibold">
                        <PlayCircle className="w-4 h-4" />
                        Continue Learning
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Time Investment */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Time Investment</h2>
                <p className="text-gray-400 text-sm mb-6">Hours spent learning per month</p>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={timeInvestmentData}>
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
                    <Bar dataKey="hours" fill="#3B82F6" name="Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Learning by Category */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Learning by Category</h2>
                <p className="text-gray-400 text-sm mb-6">Distribution of your learning focus</p>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={learningByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {learningByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">Learning Goals</h2>
              <div className="space-y-4">
                {learningGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-gray-700 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-bold mb-1">{goal.title}</h3>
                        <p className="text-gray-400 text-sm">{goal.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBg(goal.status)} ${getStatusColor(goal.status)}`}>
                        {goal.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-xs text-white font-semibold">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            goal.status === 'on-track' ? 'bg-green-500' :
                            goal.status === 'behind' ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Target: {goal.targetDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Certifications */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Completed Certifications</h2>
                <Link
                  to="/career/certificates"
                  className="text-yellow-500 hover:text-yellow-400 text-sm font-semibold"
                >
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {completedCertifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-gray-700 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-center mb-1">{cert.title}</h3>
                    <p className="text-gray-400 text-sm text-center mb-3">{cert.platform}</p>
                    <div className="bg-gray-800 rounded p-3 text-center">
                      <p className="text-xs text-gray-400 mb-1">Completed</p>
                      <p className="text-white text-sm font-semibold">{cert.completedDate}</p>
                      {cert.grade && (
                        <p className="text-green-500 text-xs font-semibold mt-1">{cert.grade}</p>
                      )}
                    </div>
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
