import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  ClipboardList,
  Calendar,
  FileText,
  Upload,
  Link as LinkIcon,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  Plus,
  X,
  Download,
  Eye,
  TrendingUp,
  Target,
  Star,
  BookOpen,
} from 'lucide-react';

interface Session {
  id: string;
  coachName: string;
  clientName: string;
  date: Date;
  duration: number;
  type: string;
  status: 'upcoming' | 'completed';
}

interface AgendaItem {
  id: string;
  title: string;
  duration: number;
  notes: string;
  completed: boolean;
}

interface Resource {
  id: string;
  type: 'document' | 'link' | 'note';
  title: string;
  url?: string;
  content?: string;
  uploadedAt: Date;
}

interface QuestionnaireResponse {
  question: string;
  answer: string;
}

export default function SessionPrep() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
    {
      id: '1',
      title: 'Review career goals',
      duration: 10,
      notes: 'Discuss short-term and long-term objectives',
      completed: false,
    },
    {
      id: '2',
      title: 'Practice interview questions',
      duration: 30,
      notes: 'Focus on behavioral questions',
      completed: false,
    },
    {
      id: '3',
      title: 'Action items review',
      duration: 10,
      notes: 'Review progress on previous action items',
      completed: false,
    },
  ]);

  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      type: 'document',
      title: 'STAR Method Template',
      uploadedAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      type: 'link',
      title: 'Company Research Guide',
      url: 'https://example.com/research-guide',
      uploadedAt: new Date(Date.now() - 172800000),
    },
  ]);

  const [questionnaireResponses, setQuestionnaireResponses] = useState<QuestionnaireResponse[]>([
    {
      question: 'What are your main goals for this session?',
      answer: 'I want to prepare for an upcoming senior engineer interview at a tech company.',
    },
    {
      question: 'What specific challenges are you facing?',
      answer: 'I struggle with articulating my technical decisions and leadership experiences.',
    },
    {
      question: 'What would make this session successful for you?',
      answer: 'Having 3-5 strong STAR stories ready and feeling confident about my answers.',
    },
  ]);

  const [newAgendaItem, setNewAgendaItem] = useState({
    title: '',
    duration: 10,
    notes: '',
  });

  const [newResource, setNewResource] = useState({
    type: 'link' as 'document' | 'link' | 'note',
    title: '',
    url: '',
    content: '',
  });

  // Mock sessions
  const upcomingSessions: Session[] = [
    {
      id: '1',
      coachName: 'Sarah Johnson',
      clientName: 'Alex Thompson',
      date: new Date(Date.now() + 86400000),
      duration: 60,
      type: 'Interview Preparation',
      status: 'upcoming',
    },
    {
      id: '2',
      coachName: 'Michael Chen',
      clientName: 'Jessica Lee',
      date: new Date(Date.now() + 172800000),
      duration: 45,
      type: 'Resume Review',
      status: 'upcoming',
    },
  ];

  const previousSessions: Session[] = [
    {
      id: '3',
      coachName: 'Sarah Johnson',
      clientName: 'Alex Thompson',
      date: new Date(Date.now() - 604800000),
      duration: 60,
      type: 'Career Strategy',
      status: 'completed',
    },
  ];

  const preSessionQuestions = [
    'What are your main goals for this session?',
    'What specific challenges are you facing?',
    'What would make this session successful for you?',
    'Is there anything specific you want to work on today?',
  ];

  const addAgendaItem = () => {
    if (newAgendaItem.title) {
      setAgendaItems([
        ...agendaItems,
        {
          id: Date.now().toString(),
          ...newAgendaItem,
          completed: false,
        },
      ]);
      setNewAgendaItem({ title: '', duration: 10, notes: '' });
    }
  };

  const toggleAgendaItem = (id: string) => {
    setAgendaItems(
      agendaItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeAgendaItem = (id: string) => {
    setAgendaItems(agendaItems.filter((item) => item.id !== id));
  };

  const addResource = () => {
    if (newResource.title) {
      setResources([
        ...resources,
        {
          id: Date.now().toString(),
          ...newResource,
          uploadedAt: new Date(),
        },
      ]);
      setNewResource({ type: 'link', title: '', url: '', content: '' });
      setShowResourceModal(false);
    }
  };

  const totalAgendaDuration = agendaItems.reduce((sum, item) => sum + item.duration, 0);

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
                  <ClipboardList className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Session Preparation</h1>
                  <p className="text-gray-400">Prepare for upcoming coaching sessions</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Upcoming Sessions */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-yellow-500" />
                      <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
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
                    {/* Session Agenda */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-yellow-500" />
                          <h2 className="text-xl font-semibold">Session Agenda</h2>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">Total: {totalAgendaDuration} min</span>
                          {totalAgendaDuration > selectedSession.duration && (
                            <span className="text-red-500">(Over by {totalAgendaDuration - selectedSession.duration} min)</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        {agendaItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-gray-900 rounded-lg p-4 flex items-start gap-3"
                          >
                            <button
                              onClick={() => toggleAgendaItem(item.id)}
                              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                                item.completed
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-600 hover:border-yellow-500'
                              }`}
                            >
                              {item.completed && <CheckCircle className="w-4 h-4 text-white" />}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-1">
                                <p className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>
                                  {item.title}
                                </p>
                                <button
                                  onClick={() => removeAgendaItem(item.id)}
                                  className="text-gray-500 hover:text-red-500 transition"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-400">{item.notes}</p>
                              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{item.duration} minutes</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gray-900 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <input
                            type="text"
                            value={newAgendaItem.title}
                            onChange={(e) =>
                              setNewAgendaItem({ ...newAgendaItem, title: e.target.value })
                            }
                            placeholder="Agenda item title"
                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          />
                          <input
                            type="number"
                            value={newAgendaItem.duration}
                            onChange={(e) =>
                              setNewAgendaItem({
                                ...newAgendaItem,
                                duration: parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="Duration (min)"
                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          />
                        </div>
                        <input
                          type="text"
                          value={newAgendaItem.notes}
                          onChange={(e) =>
                            setNewAgendaItem({ ...newAgendaItem, notes: e.target.value })
                          }
                          placeholder="Notes (optional)"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent mb-3"
                        />
                        <button
                          onClick={addAgendaItem}
                          className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Add Agenda Item
                        </button>
                      </div>
                    </div>

                    {/* Shared Resources */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <Upload className="w-5 h-5 text-yellow-500" />
                          <h2 className="text-xl font-semibold">Shared Resources</h2>
                        </div>
                        <button
                          onClick={() => setShowResourceModal(true)}
                          className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Resource
                        </button>
                      </div>

                      <div className="space-y-3">
                        {resources.map((resource) => (
                          <div
                            key={resource.id}
                            className="bg-gray-900 rounded-lg p-4 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              {resource.type === 'document' && (
                                <FileText className="w-5 h-5 text-blue-500" />
                              )}
                              {resource.type === 'link' && (
                                <LinkIcon className="w-5 h-5 text-green-500" />
                              )}
                              {resource.type === 'note' && (
                                <MessageSquare className="w-5 h-5 text-yellow-500" />
                              )}
                              <div>
                                <p className="font-medium">{resource.title}</p>
                                <p className="text-xs text-gray-400">
                                  Added {resource.uploadedAt.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pre-Session Questionnaire */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-yellow-500" />
                          <h2 className="text-xl font-semibold">Client Responses</h2>
                        </div>
                        <button
                          onClick={() => setShowQuestionnaireModal(true)}
                          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-sm"
                        >
                          View Full Questionnaire
                        </button>
                      </div>

                      <div className="space-y-4">
                        {questionnaireResponses.map((response, index) => (
                          <div key={index} className="bg-gray-900 rounded-lg p-4">
                            <p className="text-sm text-gray-400 mb-2">{response.question}</p>
                            <p className="text-gray-300">{response.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-6">
                {selectedSession && (
                  <>
                    {/* Client Progress Overview */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-semibold">Client Progress</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Sessions Completed</span>
                            <span className="font-semibold">8</span>
                          </div>
                          <div className="bg-gray-900 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Goals Achieved</span>
                            <span className="font-semibold">5/7</span>
                          </div>
                          <div className="bg-gray-900 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '71%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes from Previous Session */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-semibold">Previous Session Notes</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-900 rounded-lg p-3">
                          <p className="text-sm text-gray-400 mb-1">
                            {previousSessions[0]?.date.toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-300">
                            Worked on behavioral interview techniques. Client showed improvement in STAR
                            method application. Follow-up on practicing with mock interviews.
                          </p>
                        </div>
                        <button className="w-full px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-sm">
                          View All Session History
                        </button>
                      </div>
                    </div>

                    {/* Action Items Status */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-semibold">Action Items Status</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-300">Prepare 3 STAR stories</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-300">Research target companies</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-300">Practice with recording</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-5 h-5 text-blue-500" />
                        <h3 className="font-semibold text-blue-500">Session Tips</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Review client's questionnaire responses</li>
                        <li>• Have agenda ready but be flexible</li>
                        <li>• Leave time for action items at end</li>
                        <li>• Share resources during session</li>
                      </ul>
                    </div>
                  </>
                )}

                {!selectedSession && (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
                    <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Select a session to view preparation details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Resource Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Resource</h2>
              <button
                onClick={() => setShowResourceModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resource Type
                </label>
                <select
                  value={newResource.type}
                  onChange={(e) =>
                    setNewResource({
                      ...newResource,
                      type: e.target.value as 'document' | 'link' | 'note',
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="link">Link</option>
                  <option value="document">Document</option>
                  <option value="note">Note</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) =>
                    setNewResource({ ...newResource, title: e.target.value })
                  }
                  placeholder="Resource title"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              {newResource.type === 'link' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                  <input
                    type="url"
                    value={newResource.url}
                    onChange={(e) =>
                      setNewResource({ ...newResource, url: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              )}

              {newResource.type === 'note' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                  <textarea
                    value={newResource.content}
                    onChange={(e) =>
                      setNewResource({ ...newResource, content: e.target.value })
                    }
                    placeholder="Note content..."
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-700 flex gap-3">
              <button
                onClick={() => setShowResourceModal(false)}
                className="flex-1 px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={addResource}
                className="flex-1 px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Add Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
