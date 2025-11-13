import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Calendar, Clock, Video, MessageCircle, CheckCircle, XCircle } from 'lucide-react';

export default function Sessions() {
  const sessions = useQuery(api.sessions.listByUser);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-500';
      case 'completed': return 'bg-green-500/20 text-green-500';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Coaching Sessions</h1>
              <p className="text-gray-400">View and manage your coaching sessions</p>
            </div>

            {/* Sessions List */}
            {sessions && sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session._id}
                    className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold">
                            {session.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(session.status)}`}>
                            {getStatusIcon(session.status)}
                            {session.status}
                          </span>
                        </div>

                        <div className="space-y-2 text-gray-300">
                          {session.scheduledFor && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-gray-400" />
                              <span>
                                {new Date(session.scheduledFor).toLocaleDateString()} at{' '}
                                {new Date(session.scheduledFor).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span>{session.duration} minutes</span>
                          </div>

                          {session.meetingUrl && session.status === 'scheduled' && (
                            <div className="flex items-center gap-2">
                              <Video className="w-5 h-5 text-gray-400" />
                              <a
                                href={session.meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-yellow-500 hover:text-yellow-400 transition"
                              >
                                Join Meeting
                              </a>
                            </div>
                          )}
                        </div>

                        {session.notes && (
                          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-400 mb-1">Notes:</p>
                            <p className="text-gray-300">{session.notes}</p>
                          </div>
                        )}
                      </div>

                      {session.status === 'scheduled' && (
                        <div className="ml-6 space-y-2">
                          <button className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center justify-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Message Coach
                          </button>
                          {session.meetingUrl && (
                            <a
                              href={session.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition inline-flex items-center justify-center gap-2"
                            >
                              <Video className="w-4 h-4" />
                              Join Now
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No coaching sessions yet.</p>
                <p className="text-gray-500 mt-2">Book a session with a coach to get started.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
