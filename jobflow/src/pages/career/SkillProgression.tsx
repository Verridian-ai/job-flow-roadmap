import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { TrendingUp, Award, Users, Briefcase, ThumbsUp, ArrowUpRight, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export default function SkillProgression() {
  const { user } = useUser();
  const [selectedSkill, setSelectedSkill] = useState('React');

  // Mock skills data
  const skills = [
    {
      id: 1,
      name: 'React',
      category: 'Frontend',
      level: 'Expert',
      proficiency: 85,
      trend: 'up',
      change: '+15',
      endorsements: 12,
      lastUsed: '2 days ago',
      yearsExperience: 3.5,
      projects: 15,
    },
    {
      id: 2,
      name: 'TypeScript',
      category: 'Programming',
      level: 'Advanced',
      proficiency: 80,
      trend: 'up',
      change: '+10',
      endorsements: 8,
      lastUsed: '1 day ago',
      yearsExperience: 2.5,
      projects: 12,
    },
    {
      id: 3,
      name: 'Node.js',
      category: 'Backend',
      level: 'Advanced',
      proficiency: 75,
      trend: 'up',
      change: '+8',
      endorsements: 6,
      lastUsed: '3 days ago',
      yearsExperience: 2.0,
      projects: 10,
    },
    {
      id: 4,
      name: 'AWS',
      category: 'Cloud',
      level: 'Intermediate',
      proficiency: 65,
      trend: 'up',
      change: '+20',
      endorsements: 5,
      lastUsed: '1 week ago',
      yearsExperience: 1.5,
      projects: 6,
    },
    {
      id: 5,
      name: 'Python',
      category: 'Programming',
      level: 'Intermediate',
      proficiency: 70,
      trend: 'stable',
      change: '0',
      endorsements: 4,
      lastUsed: '2 weeks ago',
      yearsExperience: 1.0,
      projects: 5,
    },
    {
      id: 6,
      name: 'Docker',
      category: 'DevOps',
      level: 'Intermediate',
      proficiency: 60,
      trend: 'up',
      change: '+12',
      endorsements: 3,
      lastUsed: '1 week ago',
      yearsExperience: 0.8,
      projects: 4,
    },
  ];

  // Mock progression data for selected skill
  const progressionData = [
    { month: 'Jul 2023', proficiency: 55, assessments: 1 },
    { month: 'Aug 2023', proficiency: 60, assessments: 2 },
    { month: 'Sep 2023', proficiency: 65, assessments: 2 },
    { month: 'Oct 2023', proficiency: 70, assessments: 3 },
    { month: 'Nov 2023', proficiency: 75, assessments: 3 },
    { month: 'Dec 2023', proficiency: 78, assessments: 4 },
    { month: 'Jan 2024', proficiency: 85, assessments: 5 },
  ];

  // Mock endorsements data
  const endorsements = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Engineering Manager',
      company: 'Tech Corp',
      skill: 'React',
      date: '2 weeks ago',
      comment: 'Exceptional React developer with deep understanding of advanced patterns',
    },
    {
      id: 2,
      name: 'Mike Chen',
      title: 'Staff Engineer',
      company: 'Tech Corp',
      skill: 'React',
      date: '1 month ago',
      comment: 'Great at component architecture and performance optimization',
    },
    {
      id: 3,
      name: 'Emily Davis',
      title: 'Tech Lead',
      company: 'Tech Corp',
      skill: 'TypeScript',
      date: '3 weeks ago',
      comment: 'Strong TypeScript skills, writes clean and type-safe code',
    },
  ];

  // Mock project usage data
  const projectUsage = [
    { project: 'Customer Portal', usage: 85, duration: '8 months' },
    { project: 'Admin Dashboard', usage: 75, duration: '6 months' },
    { project: 'Mobile App', usage: 60, duration: '4 months' },
    { project: 'Analytics Engine', usage: 40, duration: '2 months' },
  ];

  const selectedSkillData = skills.find((s) => s.name === selectedSkill) || skills[0];

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      Beginner: 'text-gray-500',
      Intermediate: 'text-blue-500',
      Advanced: 'text-purple-500',
      Expert: 'text-yellow-500',
    };
    return colors[level] || 'text-gray-500';
  };

  const getLevelBg = (level: string) => {
    const colors: { [key: string]: string } = {
      Beginner: 'bg-gray-500/20 border-gray-500/50',
      Intermediate: 'bg-blue-500/20 border-blue-500/50',
      Advanced: 'bg-purple-500/20 border-purple-500/50',
      Expert: 'bg-yellow-500/20 border-yellow-500/50',
    };
    return colors[level] || 'bg-gray-500/20 border-gray-500/50';
  };

  // Stats
  const stats = [
    {
      label: 'Total Skills',
      value: skills.length,
      icon: Award,
      color: 'text-blue-500',
    },
    {
      label: 'Expert Level',
      value: skills.filter((s) => s.level === 'Expert').length,
      icon: TrendingUp,
      color: 'text-yellow-500',
    },
    {
      label: 'Total Endorsements',
      value: skills.reduce((sum, s) => sum + s.endorsements, 0),
      icon: ThumbsUp,
      color: 'text-green-500',
    },
    {
      label: 'Projects Completed',
      value: skills.reduce((sum, s) => sum + s.projects, 0),
      icon: Briefcase,
      color: 'text-purple-500',
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
                Skill Progression Dashboard
              </h1>
              <p className="text-gray-400">
                Track your skill development and proficiency over time
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

            {/* Skills Grid */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">Your Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill.name)}
                    className={`bg-gray-700 rounded-lg p-6 text-left hover:ring-2 hover:ring-yellow-500 transition ${
                      selectedSkill === skill.name ? 'ring-2 ring-yellow-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">{skill.name}</h3>
                        <p className="text-gray-400 text-sm">{skill.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${getLevelBg(skill.level)} ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>

                    {/* Proficiency bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Proficiency</span>
                        <span className="text-xs text-white font-semibold">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            skill.level === 'Expert'
                              ? 'bg-yellow-500'
                              : skill.level === 'Advanced'
                              ? 'bg-purple-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Skill details */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-400">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{skill.endorsements} endorsements</span>
                      </div>
                      {skill.trend === 'up' && (
                        <div className="flex items-center gap-1 text-green-500">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>{skill.change}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Skill Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Skill Info Card */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">{selectedSkillData.name} Overview</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Proficiency Level</p>
                    <div className="flex items-center justify-between">
                      <p className="text-white text-2xl font-bold">{selectedSkillData.proficiency}%</p>
                      <span className={`px-3 py-1 rounded text-sm font-semibold border ${getLevelBg(selectedSkillData.level)} ${getLevelColor(selectedSkillData.level)}`}>
                        {selectedSkillData.level}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Experience</p>
                        <p className="text-white font-semibold">{selectedSkillData.yearsExperience} years</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Projects</p>
                        <p className="text-white font-semibold">{selectedSkillData.projects}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Endorsements</p>
                        <p className="text-white font-semibold">{selectedSkillData.endorsements}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Last Used</p>
                        <p className="text-white font-semibold">{selectedSkillData.lastUsed}</p>
                      </div>
                    </div>
                  </div>

                  {selectedSkillData.trend === 'up' && (
                    <div className="pt-4 border-t border-gray-700">
                      <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            +{selectedSkillData.change}% improvement in last 6 months
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progression Chart */}
              <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Skill Progression Timeline</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressionData}>
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
                    <Line
                      type="monotone"
                      dataKey="proficiency"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', r: 6 }}
                      name="Proficiency Level"
                    />
                    <Line
                      type="monotone"
                      dataKey="assessments"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', r: 4 }}
                      name="Assessments Taken"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Project Usage */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Skill Usage in Projects</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectUsage} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis dataKey="project" type="category" stroke="#9CA3AF" width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Bar dataKey="usage" fill="#3B82F6" name="Usage %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Endorsements */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Recent Endorsements</h2>
                <div className="space-y-4">
                  {endorsements.slice(0, 3).map((endorsement) => (
                    <div
                      key={endorsement.id}
                      className="bg-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold">{endorsement.name}</p>
                          <p className="text-gray-400 text-sm">{endorsement.title} at {endorsement.company}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-yellow-500 text-xs font-semibold">{endorsement.skill}</span>
                            <span className="text-gray-500 text-xs">•</span>
                            <span className="text-gray-500 text-xs">{endorsement.date}</span>
                          </div>
                        </div>
                      </div>
                      {endorsement.comment && (
                        <p className="text-gray-300 text-sm italic mt-2">"{endorsement.comment}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
