import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Award, ExternalLink, Share2, Download, CheckCircle, Clock, Target, Filter } from 'lucide-react';
import { useState } from 'react';

export default function Certificates() {
  const { user } = useUser();
  const [filterStatus, setFilterStatus] = useState<'all' | 'earned' | 'in-progress'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Mock certificates data
  const certificates = [
    {
      id: 1,
      title: 'AWS Solutions Architect - Professional',
      issuer: 'Amazon Web Services',
      issueDate: 'October 2023',
      expiryDate: 'October 2026',
      status: 'earned',
      category: 'Cloud',
      verificationUrl: 'https://aws.amazon.com/verify/cert123',
      credentialId: 'AWS-SAP-2023-12345',
      skills: ['AWS', 'Cloud Architecture', 'Infrastructure'],
      shareUrl: 'https://jobflow.app/share/cert/123',
    },
    {
      id: 2,
      title: 'Professional Scrum Master I',
      issuer: 'Scrum.org',
      issueDate: 'August 2023',
      expiryDate: null,
      status: 'earned',
      category: 'Project Management',
      verificationUrl: 'https://scrum.org/verify/cert456',
      credentialId: 'PSM-I-2023-67890',
      skills: ['Agile', 'Scrum', 'Team Leadership'],
      shareUrl: 'https://jobflow.app/share/cert/456',
    },
    {
      id: 3,
      title: 'React Advanced Patterns',
      issuer: 'Frontend Masters',
      issueDate: 'January 2024',
      expiryDate: null,
      status: 'earned',
      category: 'Web Development',
      verificationUrl: 'https://frontendmasters.com/verify/cert789',
      credentialId: 'FM-REACT-2024-11111',
      skills: ['React', 'TypeScript', 'State Management'],
      shareUrl: 'https://jobflow.app/share/cert/789',
    },
    {
      id: 4,
      title: 'Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      issueDate: null,
      expiryDate: null,
      status: 'in-progress',
      category: 'Cloud',
      progress: 65,
      estimatedCompletion: 'March 2024',
      skills: ['Kubernetes', 'Container Orchestration', 'DevOps'],
    },
    {
      id: 5,
      title: 'Google Cloud Professional Architect',
      issuer: 'Google Cloud',
      issueDate: null,
      expiryDate: null,
      status: 'in-progress',
      category: 'Cloud',
      progress: 30,
      estimatedCompletion: 'May 2024',
      skills: ['GCP', 'Cloud Architecture', 'Networking'],
    },
  ];

  // Mock badges data
  const badges = [
    {
      id: 1,
      title: '100 Day Streak',
      description: 'Maintained learning streak for 100 consecutive days',
      earnedDate: 'February 2024',
      rarity: 'rare',
    },
    {
      id: 2,
      title: 'Early Adopter',
      description: 'Joined Job Flow in the first month of launch',
      earnedDate: 'January 2024',
      rarity: 'epic',
    },
    {
      id: 3,
      title: 'Course Completionist',
      description: 'Completed 10 online courses',
      earnedDate: 'January 2024',
      rarity: 'uncommon',
    },
    {
      id: 4,
      title: 'Skill Master',
      description: 'Reached expert level in 5 different skills',
      earnedDate: 'December 2023',
      rarity: 'rare',
    },
    {
      id: 5,
      title: 'Community Helper',
      description: 'Helped 50+ community members with advice',
      earnedDate: 'November 2023',
      rarity: 'uncommon',
    },
    {
      id: 6,
      title: 'Interview Champion',
      description: 'Successfully completed 25 practice interviews',
      earnedDate: 'October 2023',
      rarity: 'rare',
    },
  ];

  const categories = ['all', 'Cloud', 'Web Development', 'Project Management', 'Data Science'];

  const getRarityColor = (rarity: string) => {
    const colors: { [key: string]: string } = {
      common: 'bg-gray-500',
      uncommon: 'bg-green-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500',
    };
    return colors[rarity] || 'bg-gray-500';
  };

  const filteredCertificates = certificates.filter((cert) => {
    const statusMatch = filterStatus === 'all' || cert.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || cert.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  // Statistics
  const stats = [
    {
      label: 'Certificates Earned',
      value: certificates.filter((c) => c.status === 'earned').length,
      icon: Award,
      color: 'text-yellow-500',
    },
    {
      label: 'Badges Earned',
      value: badges.length,
      icon: Award,
      color: 'text-purple-500',
    },
    {
      label: 'In Progress',
      value: certificates.filter((c) => c.status === 'in-progress').length,
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      label: 'Skills Validated',
      value: 12,
      icon: CheckCircle,
      color: 'text-green-500',
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
                Certificates & Badges
              </h1>
              <p className="text-gray-400">
                Showcase your professional credentials and achievements
              </p>
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

            {/* Certificates Section */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Professional Certificates</h2>
                <div className="flex gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="earned">Earned</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600 hover:border-yellow-500 transition"
                  >
                    {/* Certificate Header */}
                    <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 p-6 border-b border-gray-600">
                      <div className="flex items-start justify-between mb-4">
                        <Award className="w-12 h-12 text-yellow-500" />
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cert.status === 'earned'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {cert.status === 'earned' ? 'Earned' : 'In Progress'}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{cert.title}</h3>
                      <p className="text-gray-400 text-sm">{cert.issuer}</p>
                    </div>

                    {/* Certificate Details */}
                    <div className="p-6">
                      {cert.status === 'earned' ? (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Issue Date</p>
                              <p className="text-white text-sm font-semibold">{cert.issueDate}</p>
                            </div>
                            {cert.expiryDate && (
                              <div>
                                <p className="text-gray-400 text-xs mb-1">Expires</p>
                                <p className="text-white text-sm font-semibold">{cert.expiryDate}</p>
                              </div>
                            )}
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-400 text-xs mb-1">Credential ID</p>
                            <p className="text-white text-sm font-mono">{cert.credentialId}</p>
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-400 text-xs mb-2">Skills Validated</p>
                            <div className="flex flex-wrap gap-2">
                              {cert.skills?.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {cert.verificationUrl && (
                              <a
                                href={cert.verificationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-600 transition text-white text-sm"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Verify
                              </a>
                            )}
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-600 transition text-white text-sm">
                              <Share2 className="w-4 h-4" />
                              Share
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition text-sm font-semibold">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-gray-400 text-sm">Progress</p>
                              <p className="text-white text-sm font-semibold">{cert.progress}%</p>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${cert.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-400 text-xs mb-1">Est. Completion</p>
                            <p className="text-white text-sm font-semibold">{cert.estimatedCompletion}</p>
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-400 text-xs mb-2">Skills to Learn</p>
                            <div className="flex flex-wrap gap-2">
                              {cert.skills?.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <button className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition font-semibold text-sm">
                            Continue Learning
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges Section */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Achievement Badges</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-gray-700 rounded-lg p-4 hover:ring-2 hover:ring-yellow-500 transition cursor-pointer group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-16 h-16 ${getRarityColor(badge.rarity)} rounded-full flex items-center justify-center mb-3`}>
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1">{badge.title}</h3>
                      <p className="text-gray-400 text-xs mb-2">{badge.description}</p>
                      <p className="text-gray-500 text-xs">{badge.earnedDate}</p>
                      <div className={`mt-2 px-2 py-1 ${getRarityColor(badge.rarity)}/20 rounded text-xs font-semibold capitalize`}>
                        {badge.rarity}
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
