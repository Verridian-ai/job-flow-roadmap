import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Lightbulb, Star, Clock, DollarSign, BookOpen, Users, TrendingUp, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function RecommendedPaths() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Categories
  const categories = ['all', 'Cloud', 'Web Development', 'System Design', 'DevOps', 'Data Science', 'Mobile'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  // Mock curated learning paths
  const learningPaths = [
    {
      id: 1,
      title: 'AWS Solutions Architect Professional Path',
      provider: 'Multiple Providers',
      category: 'Cloud',
      level: 'Advanced',
      description: 'Comprehensive path to become a certified AWS Solutions Architect Professional',
      totalDuration: '120 hours',
      estimatedCost: '$499',
      courses: 5,
      rating: 4.8,
      enrolledUsers: '50K+',
      recommended: true,
      matchScore: 95,
      skills: ['AWS', 'Cloud Architecture', 'Infrastructure', 'Security'],
      outcomes: [
        'Design and deploy scalable AWS applications',
        'Pass AWS Solutions Architect Professional exam',
        'Increase market value by $15,000',
      ],
    },
    {
      id: 2,
      title: 'Full-Stack JavaScript Developer',
      provider: 'Multiple Providers',
      category: 'Web Development',
      level: 'Intermediate',
      description: 'Master full-stack development with React, Node.js, and modern tools',
      totalDuration: '80 hours',
      estimatedCost: '$299',
      courses: 4,
      rating: 4.7,
      enrolledUsers: '75K+',
      recommended: true,
      matchScore: 88,
      skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
      outcomes: [
        'Build production-ready web applications',
        'Master modern JavaScript ecosystem',
        'Qualify for full-stack positions',
      ],
    },
    {
      id: 3,
      title: 'System Design & Architecture Mastery',
      provider: 'Multiple Providers',
      category: 'System Design',
      level: 'Advanced',
      description: 'Learn to design scalable distributed systems from scratch',
      totalDuration: '60 hours',
      estimatedCost: '$249',
      courses: 3,
      rating: 4.9,
      enrolledUsers: '40K+',
      recommended: true,
      matchScore: 92,
      skills: ['System Design', 'Scalability', 'Distributed Systems', 'Microservices'],
      outcomes: [
        'Design systems handling millions of users',
        'Pass system design interviews',
        'Advance to senior/staff engineer roles',
      ],
    },
    {
      id: 4,
      title: 'Kubernetes & Container Orchestration',
      provider: 'Multiple Providers',
      category: 'DevOps',
      level: 'Intermediate',
      description: 'Master Kubernetes and modern container orchestration',
      totalDuration: '50 hours',
      estimatedCost: '$199',
      courses: 3,
      rating: 4.6,
      enrolledUsers: '35K+',
      recommended: false,
      matchScore: 75,
      skills: ['Kubernetes', 'Docker', 'CI/CD', 'DevOps'],
      outcomes: [
        'Deploy and manage containerized apps',
        'Pass CKA certification',
        'Implement DevOps best practices',
      ],
    },
    {
      id: 5,
      title: 'Machine Learning Engineer Path',
      provider: 'Multiple Providers',
      category: 'Data Science',
      level: 'Advanced',
      description: 'Comprehensive ML engineering with Python, TensorFlow, and deployment',
      totalDuration: '150 hours',
      estimatedCost: '$599',
      courses: 6,
      rating: 4.8,
      enrolledUsers: '60K+',
      recommended: false,
      matchScore: 60,
      skills: ['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning'],
      outcomes: [
        'Build and deploy ML models',
        'Transition to ML Engineer role',
        'Average salary: $120K-$150K',
      ],
    },
    {
      id: 6,
      title: 'React Native Mobile Development',
      provider: 'Multiple Providers',
      category: 'Mobile',
      level: 'Intermediate',
      description: 'Build cross-platform mobile apps with React Native',
      totalDuration: '40 hours',
      estimatedCost: '$149',
      courses: 2,
      rating: 4.5,
      enrolledUsers: '30K+',
      recommended: false,
      matchScore: 70,
      skills: ['React Native', 'Mobile Development', 'iOS', 'Android'],
      outcomes: [
        'Build iOS and Android apps',
        'Expand into mobile development',
        'Increase project versatility',
      ],
    },
  ];

  // Mock individual courses
  const popularCourses = [
    {
      id: 101,
      title: 'AWS Certified Solutions Architect - Professional',
      provider: 'A Cloud Guru',
      instructor: 'Ryan Kroonenburg',
      category: 'Cloud',
      level: 'Advanced',
      duration: '40 hours',
      price: '$299',
      rating: 4.8,
      reviews: 12500,
      students: 50000,
      thumbnail: 'aws',
    },
    {
      id: 102,
      title: 'System Design Interview Course',
      provider: 'Educative',
      instructor: 'Design Gurus',
      category: 'System Design',
      level: 'Advanced',
      duration: '25 hours',
      price: '$199',
      rating: 4.9,
      reviews: 8500,
      students: 35000,
      thumbnail: 'system-design',
    },
    {
      id: 103,
      title: 'Complete React Developer',
      provider: 'Udemy',
      instructor: 'Andrei Neagoie',
      category: 'Web Development',
      level: 'Intermediate',
      duration: '40 hours',
      price: '$89',
      rating: 4.7,
      reviews: 25000,
      students: 120000,
      thumbnail: 'react',
    },
  ];

  const filteredPaths = learningPaths.filter((path) => {
    const categoryMatch = selectedCategory === 'all' || path.category === selectedCategory;
    const levelMatch = selectedLevel === 'all' || path.level === selectedLevel;
    const searchMatch = searchQuery === '' ||
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatch && levelMatch && searchMatch;
  });

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
                Recommended Learning Paths
              </h1>
              <p className="text-gray-400">
                AI-curated learning paths based on your career goals and skill gaps
              </p>
            </div>

            {/* Filters */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search courses or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level === 'all' ? 'All Levels' : level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/50 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">AI Recommendations for You</h2>
                  <p className="text-gray-300 mb-4">
                    Based on your skill gap analysis and career goals, we recommend focusing on AWS and System Design.
                    These paths will increase your market value by an estimated $20,000 and qualify you for senior roles.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-400 text-sm font-semibold">
                      95% Match
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded text-green-400 text-sm font-semibold">
                      High ROI
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Curated Learning Paths */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Curated Learning Paths</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPaths.map((path) => (
                  <div
                    key={path.id}
                    className={`bg-gray-800 border rounded-lg p-6 ${
                      path.recommended ? 'border-yellow-500 ring-2 ring-yellow-500/20' : 'border-gray-700'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {path.recommended && (
                            <span className="px-2 py-1 bg-yellow-500 text-gray-900 rounded text-xs font-bold">
                              RECOMMENDED
                            </span>
                          )}
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded text-xs font-semibold">
                            {path.matchScore}% Match
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{path.title}</h3>
                        <p className="text-gray-400 text-sm">{path.provider}</p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{path.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-700 rounded p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-400 text-xs">Duration</span>
                        </div>
                        <p className="text-white font-semibold">{path.totalDuration}</p>
                      </div>
                      <div className="bg-gray-700 rounded p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-gray-400 text-xs">Investment</span>
                        </div>
                        <p className="text-white font-semibold">{path.estimatedCost}</p>
                      </div>
                      <div className="bg-gray-700 rounded p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-400 text-xs">Courses</span>
                        </div>
                        <p className="text-white font-semibold">{path.courses} courses</p>
                      </div>
                      <div className="bg-gray-700 rounded p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-400 text-xs">Students</span>
                        </div>
                        <p className="text-white font-semibold">{path.enrolledUsers}</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <p className="text-gray-400 text-xs mb-2">Skills You'll Learn</p>
                      <div className="flex flex-wrap gap-2">
                        {path.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Outcomes */}
                    <div className="mb-4">
                      <p className="text-gray-400 text-xs mb-2">Expected Outcomes</p>
                      <ul className="space-y-1">
                        {path.outcomes.map((outcome, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <TrendingUp className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-700">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-white font-semibold">{path.rating}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{path.level}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        to={`/learning/path/${path.id}`}
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition text-white text-center font-semibold"
                      >
                        View Details
                      </Link>
                      <button className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition font-semibold">
                        Start Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Individual Courses */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Popular Individual Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {popularCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/learning/course/${course.id}`}
                    className="bg-gray-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-yellow-500 transition"
                  >
                    {/* Course thumbnail */}
                    <div className="h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-blue-500" />
                    </div>

                    {/* Course details */}
                    <div className="p-4">
                      <h3 className="text-white font-bold mb-1">{course.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{course.instructor}</p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-white font-semibold text-sm">{course.rating}</span>
                          <span className="text-gray-400 text-xs">({course.reviews.toLocaleString()})</span>
                        </div>
                        <span className="text-gray-400 text-xs">{course.students.toLocaleString()} students</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                        </div>
                        <span className="text-green-500 font-bold">{course.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
