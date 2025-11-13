import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Award, Briefcase, GraduationCap, TrendingUp, DollarSign, Users, Star, Download, Share2, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CareerTimeline() {
  const { user } = useUser();

  // Mock timeline events
  const timelineEvents = [
    {
      id: 1,
      type: 'role',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      date: 'Jan 2024',
      description: 'Promoted to senior role with team lead responsibilities',
      icon: Briefcase,
      color: 'blue',
      achievements: ['Led team of 5 developers', 'Increased code efficiency by 30%'],
    },
    {
      id: 2,
      type: 'certification',
      title: 'AWS Solutions Architect',
      issuer: 'Amazon Web Services',
      date: 'Oct 2023',
      description: 'Professional certification for cloud architecture',
      icon: Award,
      color: 'yellow',
      verificationLink: 'https://aws.amazon.com/verify',
    },
    {
      id: 3,
      type: 'milestone',
      title: 'First Product Launch',
      company: 'Tech Corp',
      date: 'Aug 2023',
      description: 'Successfully launched customer portal serving 50K users',
      icon: Star,
      color: 'purple',
      impact: '$2M revenue increase',
    },
    {
      id: 4,
      type: 'role',
      title: 'Software Engineer II',
      company: 'Tech Corp',
      date: 'Mar 2023',
      description: 'Promoted after 1.5 years of strong performance',
      icon: Briefcase,
      color: 'blue',
      salaryIncrease: '15%',
    },
    {
      id: 5,
      type: 'education',
      title: 'Advanced React Course',
      institution: 'Frontend Masters',
      date: 'Jan 2023',
      description: 'Completed comprehensive React and Redux course',
      icon: GraduationCap,
      color: 'green',
    },
    {
      id: 6,
      type: 'role',
      title: 'Software Engineer',
      company: 'Tech Corp',
      date: 'Sep 2021',
      description: 'Started career as full-stack developer',
      icon: Briefcase,
      color: 'blue',
      startingSalary: '$65,000',
    },
  ];

  // Mock salary progression data
  const salaryProgressionData = [
    { date: 'Sep 2021', salary: 65 },
    { date: 'Mar 2022', salary: 65 },
    { date: 'Sep 2022', salary: 65 },
    { date: 'Mar 2023', salary: 75 },
    { date: 'Sep 2023', salary: 75 },
    { date: 'Jan 2024', salary: 95 },
  ];

  // Mock achievements gallery
  const achievements = [
    {
      id: 1,
      title: 'Team Leadership',
      description: 'Led successful team through major product launch',
      date: 'Jan 2024',
      image: 'leadership',
      metrics: { team_size: 5, delivery: 'On Time' },
    },
    {
      id: 2,
      title: 'Innovation Award',
      description: 'Recognized for implementing AI-powered features',
      date: 'Dec 2023',
      image: 'innovation',
      metrics: { users: '50K+', rating: '4.8/5' },
    },
    {
      id: 3,
      title: 'Performance Excellence',
      description: 'Exceeded quarterly goals by 150%',
      date: 'Oct 2023',
      image: 'performance',
      metrics: { target: '100%', achieved: '150%' },
    },
    {
      id: 4,
      title: 'Mentorship',
      description: 'Successfully mentored 3 junior developers',
      date: 'Aug 2023',
      image: 'mentorship',
      metrics: { mentees: 3, promotions: 2 },
    },
  ];

  // Key statistics
  const stats = [
    {
      label: 'Years of Experience',
      value: '2.5',
      icon: Calendar,
      color: 'text-blue-500',
    },
    {
      label: 'Career Growth',
      value: '+46%',
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      label: 'Salary Growth',
      value: '+$30K',
      icon: DollarSign,
      color: 'text-yellow-500',
    },
    {
      label: 'Certifications',
      value: '3',
      icon: Award,
      color: 'text-purple-500',
    },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'role':
        return Briefcase;
      case 'certification':
        return Award;
      case 'education':
        return GraduationCap;
      case 'milestone':
        return Star;
      default:
        return Briefcase;
    }
  };

  const getEventColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
    };
    return colors[color] || 'bg-gray-500';
  };

  const getEventBorderColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'border-blue-500',
      yellow: 'border-yellow-500',
      green: 'border-green-500',
      purple: 'border-purple-500',
    };
    return colors[color] || 'border-gray-500';
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Career Timeline & Achievements
                  </h1>
                  <p className="text-gray-400">
                    Your professional journey visualized
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition text-white">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition font-semibold">
                    <Download className="w-4 h-4" />
                    Export as Resume
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics */}
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

            {/* Salary Progression Chart */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Salary Progression</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={salaryProgressionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" label={{ value: 'Salary ($K)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                    }}
                    formatter={(value) => [`$${value}K`, 'Salary']}
                  />
                  <Line
                    type="monotone"
                    dataKey="salary"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Career Timeline */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">Career Timeline</h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>

                {/* Timeline events */}
                <div className="space-y-8">
                  {timelineEvents.map((event) => {
                    const EventIcon = getEventIcon(event.type);
                    return (
                      <div key={event.id} className="relative flex gap-6">
                        {/* Timeline dot */}
                        <div className={`flex-shrink-0 w-16 h-16 ${getEventColor(event.color)} rounded-full flex items-center justify-center z-10`}>
                          <EventIcon className="w-8 h-8 text-white" />
                        </div>

                        {/* Event card */}
                        <div className={`flex-1 bg-gray-700 rounded-lg p-6 border-l-4 ${getEventBorderColor(event.color)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-white">{event.title}</h3>
                              <p className="text-gray-400">
                                {event.company || event.issuer || event.institution}
                              </p>
                            </div>
                            <span className="text-sm text-gray-400 flex-shrink-0">{event.date}</span>
                          </div>
                          <p className="text-gray-300 mb-3">{event.description}</p>

                          {/* Additional details */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            {event.achievements && (
                              <div className="flex-1">
                                <p className="text-gray-400 mb-1">Key Achievements:</p>
                                <ul className="list-disc list-inside text-gray-300">
                                  {event.achievements.map((achievement, idx) => (
                                    <li key={idx}>{achievement}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {event.salaryIncrease && (
                              <div className="bg-green-500/20 border border-green-500/50 rounded px-3 py-1 text-green-400">
                                +{event.salaryIncrease} salary increase
                              </div>
                            )}
                            {event.startingSalary && (
                              <div className="bg-blue-500/20 border border-blue-500/50 rounded px-3 py-1 text-blue-400">
                                Starting salary: {event.startingSalary}
                              </div>
                            )}
                            {event.impact && (
                              <div className="bg-purple-500/20 border border-purple-500/50 rounded px-3 py-1 text-purple-400">
                                Impact: {event.impact}
                              </div>
                            )}
                            {event.verificationLink && (
                              <a
                                href={event.verificationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-yellow-500 hover:text-yellow-400 underline"
                              >
                                Verify Certificate
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Achievement Gallery */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Achievement Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-gray-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-yellow-500 transition"
                  >
                    {/* Achievement image placeholder */}
                    <div className="h-48 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
                      <Award className="w-20 h-20 text-yellow-500" />
                    </div>

                    {/* Achievement details */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                        <span className="text-sm text-gray-400">{achievement.date}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>

                      {/* Metrics */}
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(achievement.metrics).map(([key, value]) => (
                          <div
                            key={key}
                            className="bg-gray-800 rounded px-3 py-1 text-sm"
                          >
                            <span className="text-gray-400">{key}: </span>
                            <span className="text-white font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
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
