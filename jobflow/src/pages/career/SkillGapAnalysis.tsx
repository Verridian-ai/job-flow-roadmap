import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Target, TrendingUp, AlertCircle, CheckCircle, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function SkillGapAnalysis() {
  const { user } = useUser();
  const [selectedRole, setSelectedRole] = useState('Senior Software Engineer');

  // Mock target roles
  const targetRoles = [
    'Senior Software Engineer',
    'Staff Engineer',
    'Engineering Manager',
    'Solutions Architect',
    'Tech Lead',
  ];

  // Mock skill comparison data for radar chart
  const skillComparisonData = [
    { skill: 'React/Frontend', current: 85, required: 90, max: 100 },
    { skill: 'Backend APIs', current: 75, required: 85, max: 100 },
    { skill: 'Cloud/AWS', current: 60, required: 85, max: 100 },
    { skill: 'System Design', current: 70, required: 90, max: 100 },
    { skill: 'Leadership', current: 65, required: 85, max: 100 },
    { skill: 'DevOps/CI/CD', current: 55, required: 80, max: 100 },
  ];

  // Mock detailed skill gaps
  const skillGaps = [
    {
      skill: 'AWS Cloud Services',
      currentLevel: 60,
      requiredLevel: 85,
      gap: 25,
      priority: 'high',
      timeToLearn: '3 months',
      estimatedCost: '$299',
      description: 'Critical for senior role - need deep understanding of EC2, S3, Lambda, RDS',
      learningPaths: [
        { title: 'AWS Solutions Architect Course', platform: 'Udemy', duration: '40 hours' },
        { title: 'AWS Certified Developer Path', platform: 'A Cloud Guru', duration: '30 hours' },
      ],
    },
    {
      skill: 'System Design',
      currentLevel: 70,
      requiredLevel: 90,
      gap: 20,
      priority: 'high',
      timeToLearn: '4 months',
      estimatedCost: '$199',
      description: 'Must be able to design scalable distributed systems',
      learningPaths: [
        { title: 'System Design Interview Prep', platform: 'Educative', duration: '25 hours' },
        { title: 'Designing Data-Intensive Applications', platform: 'Book', duration: '60 hours' },
      ],
    },
    {
      skill: 'Leadership & Mentoring',
      currentLevel: 65,
      requiredLevel: 85,
      gap: 20,
      priority: 'medium',
      timeToLearn: '6 months',
      estimatedCost: '$500',
      description: 'Need to demonstrate leadership in technical decisions and mentor junior developers',
      learningPaths: [
        { title: 'Technical Leadership Course', platform: 'LinkedIn Learning', duration: '15 hours' },
        { title: 'Engineering Management 101', platform: 'Coursera', duration: '20 hours' },
      ],
    },
    {
      skill: 'Backend Architecture',
      currentLevel: 75,
      requiredLevel: 85,
      gap: 10,
      priority: 'medium',
      timeToLearn: '2 months',
      estimatedCost: '$149',
      description: 'Strengthen backend patterns, microservices, and API design',
      learningPaths: [
        { title: 'Microservices Architecture', platform: 'Pluralsight', duration: '20 hours' },
        { title: 'API Design Best Practices', platform: 'Frontend Masters', duration: '10 hours' },
      ],
    },
    {
      skill: 'DevOps & CI/CD',
      currentLevel: 55,
      requiredLevel: 80,
      gap: 25,
      priority: 'high',
      timeToLearn: '3 months',
      estimatedCost: '$249',
      description: 'Essential for deployment automation and infrastructure management',
      learningPaths: [
        { title: 'Docker & Kubernetes Mastery', platform: 'Udemy', duration: '35 hours' },
        { title: 'CI/CD with GitHub Actions', platform: 'YouTube', duration: '10 hours' },
      ],
    },
    {
      skill: 'React Advanced Patterns',
      currentLevel: 85,
      requiredLevel: 90,
      gap: 5,
      priority: 'low',
      timeToLearn: '1 month',
      estimatedCost: '$99',
      description: 'Refine knowledge of advanced patterns and performance optimization',
      learningPaths: [
        { title: 'Advanced React Patterns', platform: 'Frontend Masters', duration: '8 hours' },
        { title: 'React Performance', platform: 'Egghead.io', duration: '5 hours' },
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      high: 'text-red-500',
      medium: 'text-yellow-500',
      low: 'text-green-500',
    };
    return colors[priority] || 'text-gray-500';
  };

  const getPriorityBg = (priority: string) => {
    const colors: { [key: string]: string } = {
      high: 'bg-red-500/20 border-red-500/50',
      medium: 'bg-yellow-500/20 border-yellow-500/50',
      low: 'bg-green-500/20 border-green-500/50',
    };
    return colors[priority] || 'bg-gray-500/20 border-gray-500/50';
  };

  // Summary stats
  const stats = [
    {
      label: 'Skills to Develop',
      value: skillGaps.length,
      icon: Target,
      color: 'text-blue-500',
    },
    {
      label: 'High Priority Gaps',
      value: skillGaps.filter((s) => s.priority === 'high').length,
      icon: AlertCircle,
      color: 'text-red-500',
    },
    {
      label: 'Estimated Timeline',
      value: '6-9 months',
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      label: 'Learning Investment',
      value: '$1,495',
      icon: BookOpen,
      color: 'text-green-500',
    },
  ];

  // Calculate overall readiness
  const averageCurrent = skillComparisonData.reduce((sum, s) => sum + s.current, 0) / skillComparisonData.length;
  const averageRequired = skillComparisonData.reduce((sum, s) => sum + s.required, 0) / skillComparisonData.length;
  const readinessPercentage = Math.round((averageCurrent / averageRequired) * 100);

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
                Skill Gap Analysis
              </h1>
              <p className="text-gray-400">
                Compare your skills against target roles and get personalized learning recommendations
              </p>
            </div>

            {/* Target Role Selection */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <label className="block text-white font-semibold mb-3">Target Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full md:w-96 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                {targetRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Overall Readiness */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Overall Readiness</h2>
                  <p className="text-gray-300">
                    You are {readinessPercentage}% ready for {selectedRole} role
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-white mb-1">{readinessPercentage}%</div>
                  <p className="text-gray-400">Complete</p>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all"
                  style={{ width: `${readinessPercentage}%` }}
                ></div>
              </div>
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

            {/* Skill Comparison Radar */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Skills Comparison</h2>
              <p className="text-gray-400 text-sm mb-6">
                Your current skill levels vs. requirements for {selectedRole}
              </p>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={skillComparisonData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="skill" stroke="#9CA3AF" />
                    <PolarRadiusAxis stroke="#9CA3AF" />
                    <Radar
                      name="Your Skills"
                      dataKey="current"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Required"
                      dataKey="required"
                      stroke="#EF4444"
                      fill="#EF4444"
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

            {/* Detailed Skill Gaps */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Detailed Gap Analysis</h2>
              <div className="space-y-6">
                {skillGaps.map((gap, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 rounded-lg p-6 border-l-4 border-blue-500"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">{gap.skill}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityBg(gap.priority)} ${getPriorityColor(gap.priority)}`}>
                            {gap.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{gap.description}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Current Level</span>
                        <span className="text-sm text-white font-semibold">{gap.currentLevel}%</span>
                      </div>
                      <div className="relative w-full bg-gray-600 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full"
                          style={{ width: `${gap.currentLevel}%` }}
                        ></div>
                        <div
                          className="absolute top-0 h-3 border-r-2 border-red-500"
                          style={{ left: `${gap.requiredLevel}%` }}
                        >
                          <span className="absolute -top-6 -right-8 text-xs text-red-500 font-semibold whitespace-nowrap">
                            Target: {gap.requiredLevel}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Gap details */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-800 rounded p-3">
                        <p className="text-gray-400 text-xs mb-1">Gap to Close</p>
                        <p className="text-white font-semibold">{gap.gap} points</p>
                      </div>
                      <div className="bg-gray-800 rounded p-3">
                        <p className="text-gray-400 text-xs mb-1">Time to Learn</p>
                        <p className="text-white font-semibold">{gap.timeToLearn}</p>
                      </div>
                      <div className="bg-gray-800 rounded p-3">
                        <p className="text-gray-400 text-xs mb-1">Est. Cost</p>
                        <p className="text-white font-semibold">{gap.estimatedCost}</p>
                      </div>
                    </div>

                    {/* Learning paths */}
                    <div className="mb-4">
                      <p className="text-white font-semibold mb-3">Recommended Learning Paths</p>
                      <div className="space-y-2">
                        {gap.learningPaths.map((path, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-800 rounded p-3 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-4 h-4 text-blue-500" />
                              <div>
                                <p className="text-white text-sm font-semibold">{path.title}</p>
                                <p className="text-gray-400 text-xs">
                                  {path.platform} • {path.duration}
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-500" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action button */}
                    <Link
                      to="/learning"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition font-semibold"
                    >
                      <BookOpen className="w-4 h-4" />
                      Start Learning
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
