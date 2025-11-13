import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { CheckCircle, Circle, PlayCircle, Award, Clock, TrendingUp, BookOpen, Download, Share2, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

export default function CourseProgress() {
  const { user } = useUser();
  const { courseId } = useParams();
  const [selectedModule, setSelectedModule] = useState(1);

  // Mock course progress data
  const courseProgress = {
    id: courseId || '1',
    title: 'AWS Certified Solutions Architect - Professional',
    provider: 'A Cloud Guru',
    instructor: 'Ryan Kroonenburg',
    overallProgress: 65,
    hoursCompleted: 26,
    totalHours: 40,
    startedDate: 'January 5, 2024',
    lastAccessed: '2 hours ago',
    estimatedCompletion: 'March 15, 2024',
    modules: [
      {
        id: 1,
        title: 'Introduction & Exam Overview',
        progress: 100,
        status: 'completed',
        duration: '2 hours',
        lessons: [
          { id: 1, title: 'Course introduction', duration: '15 min', completed: true },
          { id: 2, title: 'Exam format and structure', duration: '20 min', completed: true },
          { id: 3, title: 'Study strategies', duration: '25 min', completed: true },
          { id: 4, title: 'AWS account setup', duration: '30 min', completed: true },
        ],
      },
      {
        id: 2,
        title: 'Identity & Federation',
        progress: 100,
        status: 'completed',
        duration: '4 hours',
        lessons: [
          { id: 1, title: 'IAM deep dive', duration: '45 min', completed: true },
          { id: 2, title: 'AWS Organizations', duration: '30 min', completed: true },
          { id: 3, title: 'Identity Federation', duration: '40 min', completed: true },
          { id: 4, title: 'AWS Directory Service', duration: '35 min', completed: true },
        ],
      },
      {
        id: 3,
        title: 'Networking & Content Delivery',
        progress: 75,
        status: 'in-progress',
        duration: '6 hours',
        lessons: [
          { id: 1, title: 'VPC advanced concepts', duration: '50 min', completed: true },
          { id: 2, title: 'Direct Connect', duration: '40 min', completed: true },
          { id: 3, title: 'Route 53 advanced routing', duration: '45 min', completed: true },
          { id: 4, title: 'CloudFront optimization', duration: '35 min', completed: false },
          { id: 5, title: 'AWS Global Accelerator', duration: '30 min', completed: false },
        ],
      },
      {
        id: 4,
        title: 'Data Storage & Management',
        progress: 40,
        status: 'in-progress',
        duration: '5 hours',
        lessons: [
          { id: 1, title: 'S3 advanced features', duration: '45 min', completed: true },
          { id: 2, title: 'Storage Gateway', duration: '35 min', completed: true },
          { id: 3, title: 'AWS Backup', duration: '30 min', completed: false },
          { id: 4, title: 'Data migration strategies', duration: '40 min', completed: false },
        ],
      },
      {
        id: 5,
        title: 'Database Services',
        progress: 0,
        status: 'not-started',
        duration: '5 hours',
        lessons: [
          { id: 1, title: 'RDS Multi-AZ and Read Replicas', duration: '45 min', completed: false },
          { id: 2, title: 'Aurora advanced features', duration: '40 min', completed: false },
          { id: 3, title: 'DynamoDB performance', duration: '35 min', completed: false },
        ],
      },
    ],
    quizzes: [
      {
        id: 1,
        title: 'Module 1 Quiz',
        score: 95,
        maxScore: 100,
        passed: true,
        attempts: 1,
        date: 'Jan 8, 2024',
      },
      {
        id: 2,
        title: 'Module 2 Quiz',
        score: 88,
        maxScore: 100,
        passed: true,
        attempts: 1,
        date: 'Jan 15, 2024',
      },
      {
        id: 3,
        title: 'Module 3 Quiz',
        score: 92,
        maxScore: 100,
        passed: true,
        attempts: 2,
        date: 'Jan 22, 2024',
      },
    ],
    certificates: [],
  };

  // Progress over time data
  const progressOverTime = [
    { date: 'Week 1', progress: 15 },
    { date: 'Week 2', progress: 25 },
    { date: 'Week 3', progress: 40 },
    { date: 'Week 4', progress: 50 },
    { date: 'Week 5', progress: 55 },
    { date: 'Week 6', progress: 65 },
  ];

  const selectedModuleData = courseProgress.modules.find(m => m.id === selectedModule) || courseProgress.modules[0];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      completed: 'text-green-500',
      'in-progress': 'text-blue-500',
      'not-started': 'text-gray-500',
    };
    return colors[status] || 'text-gray-500';
  };

  const getStatusBg = (status: string) => {
    const colors: { [key: string]: string } = {
      completed: 'bg-green-500/20 border-green-500/50',
      'in-progress': 'bg-blue-500/20 border-blue-500/50',
      'not-started': 'bg-gray-500/20 border-gray-500/50',
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
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    to="/learning"
                    className="text-yellow-500 hover:text-yellow-400 text-sm font-semibold mb-2 inline-block"
                  >
                    ← Back to Learning Journey
                  </Link>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {courseProgress.title}
                  </h1>
                  <p className="text-gray-400">
                    {courseProgress.provider} • {courseProgress.instructor}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition text-white">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  {courseProgress.overallProgress === 100 && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition font-semibold">
                      <Download className="w-4 h-4" />
                      Download Certificate
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Overall Progress Card */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Overall Progress</h2>
                  <p className="text-gray-300">
                    {courseProgress.hoursCompleted} of {courseProgress.totalHours} hours completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-white mb-1">{courseProgress.overallProgress}%</div>
                  <p className="text-gray-400">Complete</p>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all"
                  style={{ width: `${courseProgress.overallProgress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Started</p>
                  <p className="text-white font-semibold">{courseProgress.startedDate}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Last Accessed</p>
                  <p className="text-white font-semibold">{courseProgress.lastAccessed}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Est. Completion</p>
                  <p className="text-white font-semibold">{courseProgress.estimatedCompletion}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Module List */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Course Modules</h2>
                <div className="space-y-2">
                  {courseProgress.modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModule(module.id)}
                      className={`w-full text-left p-4 rounded-lg transition ${
                        selectedModule === module.id
                          ? 'bg-gray-700 border border-yellow-500'
                          : 'bg-gray-700/50 border border-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {module.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : module.status === 'in-progress' ? (
                          <PlayCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-sm">{module.title}</h3>
                          <p className="text-gray-400 text-xs">{module.duration}</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            module.status === 'completed'
                              ? 'bg-green-500'
                              : module.status === 'in-progress'
                              ? 'bg-blue-500'
                              : 'bg-gray-500'
                          }`}
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Module Details & Lessons */}
              <div className="lg:col-span-2 space-y-6">
                {/* Module Details */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedModuleData.title}</h2>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBg(selectedModuleData.status)} ${getStatusColor(selectedModuleData.status)}`}>
                          {selectedModuleData.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-sm">{selectedModuleData.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white mb-1">{selectedModuleData.progress}%</div>
                      <p className="text-gray-400 text-sm">Complete</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        selectedModuleData.status === 'completed'
                          ? 'bg-green-500'
                          : selectedModuleData.status === 'in-progress'
                          ? 'bg-blue-500'
                          : 'bg-gray-500'
                      }`}
                      style={{ width: `${selectedModuleData.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Lessons */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Lessons</h3>
                  <div className="space-y-3">
                    {selectedModuleData.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`flex items-center gap-4 p-4 rounded-lg ${
                          lesson.completed ? 'bg-gray-700' : 'bg-gray-700/50'
                        }`}
                      >
                        {lesson.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-500 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{lesson.title}</h4>
                          <p className="text-gray-400 text-sm">{lesson.duration}</p>
                        </div>
                        {!lesson.completed && (
                          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition font-semibold">
                            <PlayCircle className="w-4 h-4" />
                            Start
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Over Time */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Progress Over Time</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={progressOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="progress"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', r: 6 }}
                        name="Progress %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Quiz Results */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Quiz Results</h3>
                  <div className="space-y-3">
                    {courseProgress.quizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          {quiz.passed ? (
                            <CheckCircle className="w-8 h-8 text-green-500" />
                          ) : (
                            <Circle className="w-8 h-8 text-red-500" />
                          )}
                          <div>
                            <h4 className="text-white font-semibold">{quiz.title}</h4>
                            <p className="text-gray-400 text-sm">
                              {quiz.date} • Attempt {quiz.attempts}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">
                            {quiz.score}/{quiz.maxScore}
                          </p>
                          <p className={`text-sm font-semibold ${quiz.passed ? 'text-green-500' : 'text-red-500'}`}>
                            {quiz.passed ? 'PASSED' : 'FAILED'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                {courseProgress.overallProgress === 100 ? (
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/50 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <Award className="w-12 h-12 text-green-500 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">Congratulations!</h3>
                        <p className="text-gray-300 mb-4">
                          You've completed the course. Download your certificate and share your achievement!
                        </p>
                        <div className="flex gap-3">
                          <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 transition font-semibold flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            Download Certificate
                          </button>
                          <Link
                            to="/learning/paths"
                            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-semibold flex items-center gap-2"
                          >
                            Find Next Course
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Continue Learning</h3>
                    <p className="text-gray-400 mb-4">
                      You're {courseProgress.overallProgress}% through the course. Keep going!
                    </p>
                    <button className="w-full px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition font-bold text-lg flex items-center justify-center gap-2">
                      <PlayCircle className="w-6 h-6" />
                      Continue from where you left off
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
