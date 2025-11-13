import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  FileCheck,
  Calendar,
  CheckCircle,
  Star,
  MessageSquare,
  Send,
  Plus,
  X,
  Clock,
  Target,
  TrendingUp,
  User,
  Mail,
  Download,
  Edit,
  Save,
} from 'lucide-react';

interface Session {
  id: string;
  coachName: string;
  clientName: string;
  date: Date;
  duration: number;
  type: string;
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

interface SessionSummary {
  keyTopics: string[];
  achievements: string[];
  challenges: string[];
  notes: string;
}

interface FeedbackForm {
  rating: number;
  strengths: string;
  improvements: string;
  nextSteps: string;
  additionalComments: string;
}

export default function SessionFollowup() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [summary, setSummary] = useState<SessionSummary>({
    keyTopics: ['Interview preparation', 'STAR method', 'Salary negotiation'],
    achievements: [
      'Developed 5 strong behavioral stories',
      'Identified key value propositions',
      'Practiced negotiation scenarios',
    ],
    challenges: ['Need more practice with technical questions', 'Confidence in salary discussions'],
    notes: '',
  });

  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: '1',
      title: 'Practice mock interviews',
      description: 'Complete at least 2 mock interviews with focus on behavioral questions',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      priority: 'high',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Research target companies',
      description: 'Deep dive into company culture and recent news for top 3 targets',
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      priority: 'medium',
      status: 'pending',
    },
  ]);

  const [feedback, setFeedback] = useState<FeedbackForm>({
    rating: 0,
    strengths: '',
    improvements: '',
    nextSteps: '',
    additionalComments: '',
  });

  const [newActionItem, setNewActionItem] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const [newTopic, setNewTopic] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newChallenge, setNewChallenge] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);

  const recentSessions: Session[] = [
    {
      id: '1',
      coachName: 'Sarah Johnson',
      clientName: 'Alex Thompson',
      date: new Date(Date.now() - 3600000),
      duration: 60,
      type: 'Interview Preparation',
    },
    {
      id: '2',
      coachName: 'Michael Chen',
      clientName: 'Jessica Lee',
      date: new Date(Date.now() - 86400000),
      duration: 45,
      type: 'Resume Review',
    },
  ];

  const addActionItem = () => {
    if (newActionItem.title && newActionItem.dueDate) {
      setActionItems([
        ...actionItems,
        {
          id: Date.now().toString(),
          ...newActionItem,
          status: 'pending',
        },
      ]);
      setNewActionItem({ title: '', description: '', dueDate: '', priority: 'medium' });
    }
  };

  const updateActionItemStatus = (id: string, status: ActionItem['status']) => {
    setActionItems(actionItems.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const removeActionItem = (id: string) => {
    setActionItems(actionItems.filter((item) => item.id !== id));
  };

  const addToSummary = (field: keyof SessionSummary, value: string) => {
    if (field === 'notes') {
      setSummary({ ...summary, notes: value });
    } else if (Array.isArray(summary[field])) {
      setSummary({
        ...summary,
        [field]: [...(summary[field] as string[]), value],
      });
    }
  };

  const removeFromSummary = (field: keyof SessionSummary, index: number) => {
    if (Array.isArray(summary[field])) {
      setSummary({
        ...summary,
        [field]: (summary[field] as string[]).filter((_, i) => i !== index),
      });
    }
  };

  const handleSendSummary = () => {
    alert('Session summary sent to client!');
  };

  const handleScheduleNextSession = () => {
    // Navigate to booking page
    window.location.href = '/session-booking';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'low':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-500';
      case 'pending':
        return 'bg-gray-500/20 text-gray-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <FileCheck className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Session Follow-up</h1>
                  <p className="text-gray-400">Complete post-session tasks and track progress</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Sessions */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-xl font-semibold">Recent Sessions</h2>
                  </div>

                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <div
                        key={session.id}
                        className={`bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition border-2 ${
                          selectedSession?.id === session.id
                            ? 'border-yellow-500'
                            : 'border-transparent'
                        }`}
                        onClick={() => setSelectedSession(session)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <User className="w-5 h-5 text-yellow-500" />
                              <div>
                                <p className="font-semibold">{session.clientName}</p>
                                <p className="text-sm text-gray-400">with {session.coachName}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{session.date.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{session.duration} min</span>
                              </div>
                            </div>
                            <p className="text-sm text-yellow-500 mt-2">{session.type}</p>
                          </div>
                          {selectedSession?.id === session.id && (
                            <CheckCircle className="w-6 h-6 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedSession && (
                  <>
                    {/* Session Summary */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-5 h-5 text-yellow-500" />
                          <h2 className="text-xl font-semibold">Session Summary</h2>
                        </div>
                        <button
                          onClick={handleSendSummary}
                          className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send to Client
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Key Topics */}
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-yellow-500" />
                            Key Topics Covered
                          </h3>
                          <div className="space-y-2">
                            {summary.keyTopics.map((topic, index) => (
                              <div
                                key={index}
                                className="bg-gray-900 rounded-lg p-3 flex items-center justify-between"
                              >
                                <span className="text-sm">{topic}</span>
                                <button
                                  onClick={() => removeFromSummary('keyTopics', index)}
                                  className="text-gray-500 hover:text-red-500 transition"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                                placeholder="Add a topic..."
                                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              />
                              <button
                                onClick={() => {
                                  if (newTopic) {
                                    addToSummary('keyTopics', newTopic);
                                    setNewTopic('');
                                  }
                                }}
                                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Achievements */}
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            Key Achievements
                          </h3>
                          <div className="space-y-2">
                            {summary.achievements.map((achievement, index) => (
                              <div
                                key={index}
                                className="bg-gray-900 rounded-lg p-3 flex items-start justify-between"
                              >
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                  <span className="text-sm">{achievement}</span>
                                </div>
                                <button
                                  onClick={() => removeFromSummary('achievements', index)}
                                  className="text-gray-500 hover:text-red-500 transition"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newAchievement}
                                onChange={(e) => setNewAchievement(e.target.value)}
                                placeholder="Add an achievement..."
                                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              />
                              <button
                                onClick={() => {
                                  if (newAchievement) {
                                    addToSummary('achievements', newAchievement);
                                    setNewAchievement('');
                                  }
                                }}
                                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Challenges */}
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4 text-yellow-500" />
                            Areas for Improvement
                          </h3>
                          <div className="space-y-2">
                            {summary.challenges.map((challenge, index) => (
                              <div
                                key={index}
                                className="bg-gray-900 rounded-lg p-3 flex items-center justify-between"
                              >
                                <span className="text-sm">{challenge}</span>
                                <button
                                  onClick={() => removeFromSummary('challenges', index)}
                                  className="text-gray-500 hover:text-red-500 transition"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newChallenge}
                                onChange={(e) => setNewChallenge(e.target.value)}
                                placeholder="Add a challenge..."
                                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              />
                              <button
                                onClick={() => {
                                  if (newChallenge) {
                                    addToSummary('challenges', newChallenge);
                                    setNewChallenge('');
                                  }
                                }}
                                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Additional Notes */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-yellow-500" />
                              Additional Notes
                            </h3>
                            <button
                              onClick={() => setEditingNotes(!editingNotes)}
                              className="text-sm text-yellow-500 hover:text-yellow-400 transition flex items-center gap-1"
                            >
                              {editingNotes ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                              {editingNotes ? 'Save' : 'Edit'}
                            </button>
                          </div>
                          {editingNotes ? (
                            <textarea
                              value={summary.notes}
                              onChange={(e) => setSummary({ ...summary, notes: e.target.value })}
                              placeholder="Add any additional notes about the session..."
                              rows={4}
                              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="bg-gray-900 rounded-lg p-4">
                              <p className="text-sm text-gray-300">
                                {summary.notes || 'No additional notes'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Items */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Target className="w-5 h-5 text-yellow-500" />
                        <h2 className="text-xl font-semibold">Action Items</h2>
                      </div>

                      <div className="space-y-3 mb-4">
                        {actionItems.map((item) => (
                          <div key={item.id} className="bg-gray-900 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold">{item.title}</h4>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                      item.priority
                                    )}`}
                                  >
                                    {item.priority}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                      item.status
                                    )}`}
                                  >
                                    {item.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeActionItem(item.id)}
                                className="text-gray-500 hover:text-red-500 transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateActionItemStatus(item.id, 'pending')}
                                className={`flex-1 px-3 py-1 rounded-lg text-xs font-medium transition ${
                                  item.status === 'pending'
                                    ? 'bg-gray-700'
                                    : 'bg-gray-800 hover:bg-gray-700'
                                }`}
                              >
                                Pending
                              </button>
                              <button
                                onClick={() => updateActionItemStatus(item.id, 'in-progress')}
                                className={`flex-1 px-3 py-1 rounded-lg text-xs font-medium transition ${
                                  item.status === 'in-progress'
                                    ? 'bg-blue-500'
                                    : 'bg-gray-800 hover:bg-gray-700'
                                }`}
                              >
                                In Progress
                              </button>
                              <button
                                onClick={() => updateActionItemStatus(item.id, 'completed')}
                                className={`flex-1 px-3 py-1 rounded-lg text-xs font-medium transition ${
                                  item.status === 'completed'
                                    ? 'bg-green-500'
                                    : 'bg-gray-800 hover:bg-gray-700'
                                }`}
                              >
                                Completed
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gray-900 rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Add New Action Item</h3>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={newActionItem.title}
                            onChange={(e) =>
                              setNewActionItem({ ...newActionItem, title: e.target.value })
                            }
                            placeholder="Action item title"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          />
                          <textarea
                            value={newActionItem.description}
                            onChange={(e) =>
                              setNewActionItem({ ...newActionItem, description: e.target.value })
                            }
                            placeholder="Description"
                            rows={2}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="date"
                              value={newActionItem.dueDate}
                              onChange={(e) =>
                                setNewActionItem({ ...newActionItem, dueDate: e.target.value })
                              }
                              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            />
                            <select
                              value={newActionItem.priority}
                              onChange={(e) =>
                                setNewActionItem({
                                  ...newActionItem,
                                  priority: e.target.value as 'low' | 'medium' | 'high',
                                })
                              }
                              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            >
                              <option value="low">Low Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="high">High Priority</option>
                            </select>
                          </div>
                          <button
                            onClick={addActionItem}
                            className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                          >
                            <Plus className="w-5 h-5" />
                            Add Action Item
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Client Feedback */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <h2 className="text-xl font-semibold">Session Feedback</h2>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Session Rating
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => setFeedback({ ...feedback, rating })}
                                className={`p-3 rounded-lg transition ${
                                  feedback.rating >= rating
                                    ? 'bg-yellow-500 text-gray-900'
                                    : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    feedback.rating >= rating ? 'fill-current' : ''
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            What went well?
                          </label>
                          <textarea
                            value={feedback.strengths}
                            onChange={(e) => setFeedback({ ...feedback, strengths: e.target.value })}
                            placeholder="Strengths and positive aspects of the session..."
                            rows={3}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Areas for improvement
                          </label>
                          <textarea
                            value={feedback.improvements}
                            onChange={(e) =>
                              setFeedback({ ...feedback, improvements: e.target.value })
                            }
                            placeholder="What could be improved in future sessions..."
                            rows={3}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          />
                        </div>

                        <button className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center justify-center gap-2">
                          <Send className="w-5 h-5" />
                          Request Feedback from Client
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-6">
                {selectedSession && (
                  <>
                    {/* Quick Actions */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                      <h3 className="font-semibold mb-4">Quick Actions</h3>
                      <div className="space-y-2">
                        <button
                          onClick={handleScheduleNextSession}
                          className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Schedule Next Session
                        </button>
                        <button className="w-full px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2">
                          <Mail className="w-4 h-4" />
                          Send Email Summary
                        </button>
                        <button className="w-full px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          Export Summary
                        </button>
                      </div>
                    </div>

                    {/* Progress Tracking */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-semibold">Client Progress</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Action Items Completed</span>
                            <span className="font-semibold">
                              {actionItems.filter((i) => i.status === 'completed').length}/
                              {actionItems.length}
                            </span>
                          </div>
                          <div className="bg-gray-900 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${
                                  (actionItems.filter((i) => i.status === 'completed').length /
                                    actionItems.length) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Overall Progress</span>
                            <span className="font-semibold">75%</span>
                          </div>
                          <div className="bg-gray-900 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: '75%' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-blue-500" />
                        <h3 className="font-semibold text-blue-500">Next Steps</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Review and send session summary</li>
                        <li>• Assign action items to client</li>
                        <li>• Request session feedback</li>
                        <li>• Schedule follow-up session</li>
                      </ul>
                    </div>
                  </>
                )}

                {!selectedSession && (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
                    <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Select a session to create follow-up</p>
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
