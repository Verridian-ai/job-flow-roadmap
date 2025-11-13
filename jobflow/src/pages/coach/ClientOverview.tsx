import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  FileText,
  MessageSquare,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';

interface Session {
  id: string;
  date: string;
  type: string;
  duration: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  notes?: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'in_progress' | 'completed' | 'blocked';
  dueDate: string;
}

interface Note {
  id: string;
  date: string;
  content: string;
  type: 'session' | 'general';
}

export default function ClientOverview() {
  const { clientId } = useParams();

  const [client] = useState({
    id: clientId || '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    avatar: 'SJ',
    joinDate: '2024-01-15',
    currentGoal: 'Transition to Product Management',
    status: 'active',
    totalSessions: 12,
    upcomingSessions: 3,
    overallProgress: 65
  });

  const [sessions] = useState<Session[]>([
    {
      id: '1',
      date: '2024-11-15',
      type: 'Resume Review',
      duration: '60 min',
      status: 'completed',
      notes: 'Reviewed resume structure and optimized for PM roles. Client needs to add more metrics.'
    },
    {
      id: '2',
      date: '2024-11-08',
      type: 'Interview Prep',
      duration: '45 min',
      status: 'completed',
      notes: 'Practiced behavioral questions. Focus on STAR method for next session.'
    },
    {
      id: '3',
      date: '2024-11-20',
      type: 'Career Strategy',
      duration: '60 min',
      status: 'upcoming'
    },
  ]);

  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Complete Resume Optimization',
      description: 'Update resume to highlight product management skills and add quantifiable achievements',
      progress: 80,
      status: 'in_progress',
      dueDate: '2024-11-18'
    },
    {
      id: '2',
      title: 'Master Behavioral Interviews',
      description: 'Prepare 10 STAR stories covering key PM competencies',
      progress: 60,
      status: 'in_progress',
      dueDate: '2024-11-25'
    },
    {
      id: '3',
      title: 'Build Portfolio Case Study',
      description: 'Document 2 detailed product case studies showcasing problem-solving',
      progress: 30,
      status: 'in_progress',
      dueDate: '2024-12-01'
    },
  ]);

  const [notes] = useState<Note[]>([
    {
      id: '1',
      date: '2024-11-15',
      content: 'Client showed great progress on resume. Needs to work on quantifying impact in previous roles.',
      type: 'session'
    },
    {
      id: '2',
      date: '2024-11-10',
      content: 'Follow up on LinkedIn optimization next week',
      type: 'general'
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20';
      case 'upcoming':
        return 'text-blue-400 bg-blue-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-500/20';
      case 'in_progress':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'blocked':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/coach-dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold text-xl">
                  {client.avatar}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{client.name}</h1>
                  <p className="text-sm text-gray-400">{client.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-500">
                      Client since {new Date(client.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Schedule Session
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Sessions</p>
                <p className="text-2xl font-bold text-white">{client.totalSessions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Upcoming</p>
                <p className="text-2xl font-bold text-white">{client.upcomingSessions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Overall Progress</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-white">{client.overallProgress}%</p>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Goal */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-bold text-white">Current Goal</h2>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-white mb-2">{client.currentGoal}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-yellow-500 font-medium">{client.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{ width: `${client.overallProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals & Milestones */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Goals & Milestones</h2>
                  <button className="flex items-center gap-1 px-3 py-1 text-sm text-yellow-500 border border-yellow-500 rounded-lg hover:bg-yellow-500/10 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Goal
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-700">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {goal.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : goal.status === 'blocked' ? (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-yellow-500"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{goal.title}</h3>
                        <p className="text-sm text-gray-400 mb-3">{goal.description}</p>
                        <div className="flex items-center gap-4 mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(goal.status)}`}>
                            {goal.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-yellow-500 font-medium">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div
                              className="bg-yellow-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Session History */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-bold text-white">Session History</h2>
              </div>
              <div className="divide-y divide-gray-700">
                {sessions.map((session) => (
                  <div key={session.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <h3 className="font-semibold text-white">{session.type}</h3>
                          <p className="text-sm text-gray-400">
                            {new Date(session.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{session.duration}</span>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                    </div>
                    {session.notes && (
                      <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-300">{session.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">Send Message</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">Share Resource</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium">Reschedule</span>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Notes</h2>
                  <button className="text-yellow-500 hover:text-yellow-400 transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {notes.map((note) => (
                  <div key={note.id} className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        note.type === 'session' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {note.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(note.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
