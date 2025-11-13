import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  User,
  Calendar,
  FileText,
  MessageSquare,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Plus,
  Send,
  Download,
  Edit,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ClientOverview() {
  const { clientId } = useParams<{ clientId: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'resources' | 'notes' | 'communication'>('overview');
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Mock data - in real app, would fetch from Convex
  const client = {
    id: clientId,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    photo: '',
    joinedDate: '2024-01-15',
    totalSessions: 8,
    upcomingSessions: 2,
    completedSessions: 6,
    totalSpent: 800,
    primaryGoal: 'Land a Senior Software Engineer role at a FAANG company',
    currentStatus: 'Active',
    tags: ['Tech', 'Senior Level', 'Interview Prep'],
    progressScore: 75
  };

  const sessions = [
    {
      id: 1,
      date: '2024-03-15',
      time: '2:00 PM',
      type: 'Resume Review',
      duration: 60,
      status: 'completed',
      notes: 'Updated resume with STAR format. Client needs to add more metrics.',
      rating: 5
    },
    {
      id: 2,
      date: '2024-03-20',
      time: '3:00 PM',
      type: 'Mock Interview',
      duration: 90,
      status: 'completed',
      notes: 'Practiced behavioral questions. Strong communication skills.',
      rating: 5
    },
    {
      id: 3,
      date: '2024-03-25',
      time: '2:00 PM',
      type: '1-on-1 Coaching',
      duration: 60,
      status: 'scheduled',
      notes: ''
    },
    {
      id: 4,
      date: '2024-03-30',
      time: '4:00 PM',
      type: 'Follow-up Session',
      duration: 30,
      status: 'scheduled',
      notes: ''
    }
  ];

  const sharedResources = [
    {
      id: 1,
      name: 'Updated Resume - V3.pdf',
      type: 'document',
      uploadedBy: 'coach',
      uploadedDate: '2024-03-15',
      size: '245 KB'
    },
    {
      id: 2,
      name: 'STAR Method Template.docx',
      type: 'template',
      uploadedBy: 'coach',
      uploadedDate: '2024-03-10',
      size: '52 KB'
    },
    {
      id: 3,
      name: 'Tech Interview Questions.pdf',
      type: 'guide',
      uploadedBy: 'coach',
      uploadedDate: '2024-03-08',
      size: '1.2 MB'
    }
  ];

  const notes = [
    {
      id: 1,
      date: '2024-03-15',
      text: 'Sarah is making great progress. Resume now highlights quantifiable achievements.',
      author: 'coach',
      tags: ['progress', 'resume']
    },
    {
      id: 2,
      date: '2024-03-20',
      text: 'Excellent performance in mock interview. Ready for real interviews.',
      author: 'coach',
      tags: ['milestone', 'interview']
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'client',
      text: 'Hi! I have an interview scheduled for next week. Can we do a mock interview?',
      timestamp: '2024-03-18 10:30 AM',
      read: true
    },
    {
      id: 2,
      sender: 'coach',
      text: 'Absolutely! I have availability on Tuesday at 3 PM or Thursday at 2 PM. Which works better?',
      timestamp: '2024-03-18 11:15 AM',
      read: true
    },
    {
      id: 3,
      sender: 'client',
      text: 'Tuesday at 3 PM works perfectly. Thank you!',
      timestamp: '2024-03-18 11:30 AM',
      read: true
    }
  ];

  const milestones = [
    { id: 1, title: 'Resume Optimization', status: 'completed', date: '2024-03-15' },
    { id: 2, title: 'LinkedIn Profile Update', status: 'completed', date: '2024-03-12' },
    { id: 3, title: 'Mock Interview Practice', status: 'completed', date: '2024-03-20' },
    { id: 4, title: 'Apply to 10 Target Companies', status: 'in-progress', date: null },
    { id: 5, title: 'Land First Interview', status: 'pending', date: null }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'notes', label: 'Notes', icon: Target },
    { id: 'communication', label: 'Messages', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  {client.photo ? (
                    <img
                      src={client.photo}
                      alt={client.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{client.name}</h1>
                    <p className="text-gray-400 mb-2">{client.email}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-semibold">
                        {client.currentStatus}
                      </span>
                      {client.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Session
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-5 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-2xl font-bold">{client.totalSessions}</span>
                  </div>
                  <p className="text-sm text-gray-400">Total Sessions</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-bold">{client.upcomingSessions}</span>
                  </div>
                  <p className="text-sm text-gray-400">Upcoming</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-2xl font-bold">{client.completedSessions}</span>
                  </div>
                  <p className="text-sm text-gray-400">Completed</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span className="text-2xl font-bold">${client.totalSpent}</span>
                  </div>
                  <p className="text-sm text-gray-400">Total Revenue</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    <span className="text-2xl font-bold">{client.progressScore}%</span>
                  </div>
                  <p className="text-sm text-gray-400">Progress</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700 mb-6">
              <div className="flex gap-4">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`pb-4 px-2 font-medium transition flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'text-yellow-500 border-b-2 border-yellow-500'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Primary Goal */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-yellow-500" />
                    Primary Goal
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{client.primaryGoal}</p>
                </div>

                {/* Progress Tracker */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                    Progress Tracker
                  </h3>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Overall Progress</span>
                      <span className="text-lg font-bold text-purple-500">{client.progressScore}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full transition-all"
                        style={{ width: `${client.progressScore}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Client is on track to meet their goals</p>
                </div>

                {/* Milestones */}
                <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    Milestones
                  </h3>
                  <div className="space-y-3">
                    {milestones.map(milestone => (
                      <div
                        key={milestone.id}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          milestone.status === 'completed'
                            ? 'bg-green-500/10 border border-green-500/30'
                            : milestone.status === 'in-progress'
                            ? 'bg-yellow-500/10 border border-yellow-500/30'
                            : 'bg-gray-700 border border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {milestone.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : milestone.status === 'in-progress' ? (
                            <Clock className="w-5 h-5 text-yellow-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-500" />
                          )}
                          <div>
                            <p className="font-semibold">{milestone.title}</p>
                            {milestone.date && (
                              <p className="text-sm text-gray-400">
                                Completed on {new Date(milestone.date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            milestone.status === 'completed'
                              ? 'bg-green-500/20 text-green-500'
                              : milestone.status === 'in-progress'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-gray-600/20 text-gray-400'
                          }`}
                        >
                          {milestone.status.replace('-', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-4">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className="bg-gray-800 rounded-lg border border-gray-700 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{session.type}</h3>
                        <p className="text-gray-400">
                          {new Date(session.date).toLocaleDateString()} at {session.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            session.status === 'completed'
                              ? 'bg-green-500/20 text-green-500'
                              : session.status === 'scheduled'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-gray-600/20 text-gray-400'
                          }`}
                        >
                          {session.status}
                        </span>
                        <span className="text-gray-400">{session.duration} min</span>
                      </div>
                    </div>
                    {session.notes && (
                      <div className="bg-gray-700 p-4 rounded-lg mb-3">
                        <p className="text-sm font-medium text-gray-400 mb-2">Session Notes</p>
                        <p className="text-gray-300">{session.notes}</p>
                      </div>
                    )}
                    {session.rating && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Client Rating:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span
                              key={star}
                              className={star <= session.rating ? 'text-yellow-500' : 'text-gray-600'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'resources' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Shared Resources</h3>
                  <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Resource
                  </button>
                </div>
                <div className="space-y-3">
                  {sharedResources.map(resource => (
                    <div
                      key={resource.id}
                      className="bg-gray-800 rounded-lg border border-gray-700 p-4 flex items-center justify-between hover:border-gray-600 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                          <p className="font-semibold">{resource.name}</p>
                          <p className="text-sm text-gray-400">
                            Uploaded by {resource.uploadedBy} on {new Date(resource.uploadedDate).toLocaleDateString()} • {resource.size}
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Progress Notes</h3>
                  <button
                    onClick={() => setIsAddingNote(!isAddingNote)}
                    className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Note
                  </button>
                </div>

                {isAddingNote && (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Write a note about client progress..."
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none mb-3"
                    />
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setIsAddingNote(false)}
                        className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                      <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition">
                        Save Note
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {notes.map(note => (
                    <div key={note.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-900" />
                          </div>
                          <div>
                            <p className="font-semibold">You</p>
                            <p className="text-sm text-gray-400">
                              {new Date(note.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-300 mb-3">{note.text}</p>
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'communication' && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-xl font-semibold mb-6">Message History</h3>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {messages.map(message => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'coach' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-md p-4 rounded-lg ${
                              message.sender === 'coach'
                                ? 'bg-yellow-500 text-gray-900'
                                : 'bg-gray-700 text-white'
                            }`}
                          >
                            <p className="mb-2">{message.text}</p>
                            <p className="text-xs opacity-70">{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      />
                      <button className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-left flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span>Schedule Session</span>
                    </button>
                    <button className="w-full px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-left flex items-center gap-3">
                      <FileText className="w-5 h-5 text-green-500" />
                      <span>Share Resource</span>
                    </button>
                    <button className="w-full px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-left flex items-center gap-3">
                      <Target className="w-5 h-5 text-purple-500" />
                      <span>Update Goals</span>
                    </button>
                    <button className="w-full px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-left flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-yellow-500" />
                      <span>Send Email</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
