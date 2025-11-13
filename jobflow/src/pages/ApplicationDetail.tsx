import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  Edit,
  Trash2,
  Save,
  X,
  Plus,
  Paperclip,
  Bell,
  CheckCircle,
} from 'lucide-react';

type JobStatus = 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';

interface StatusHistoryEntry {
  status: JobStatus;
  timestamp: number;
  note?: string;
}

export default function ApplicationDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState<any>(null);
  const [newNote, setNewNote] = useState('');
  const [newReminder, setNewReminder] = useState({
    title: '',
    date: '',
    time: '',
  });
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([]);
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Sarah Johnson', role: 'HR Manager', email: 'sarah@company.com', phone: '(555) 123-4567' },
  ]);
  const [interviews, setInterviews] = useState([
    { id: '1', title: 'Phone Screen', date: '2024-01-15', time: '10:00 AM', duration: '30 min', status: 'completed' },
    { id: '2', title: 'Technical Interview', date: '2024-01-22', time: '2:00 PM', duration: '1 hour', status: 'scheduled' },
  ]);
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Resume_TechCorp.pdf', type: 'Resume', uploadedAt: Date.now() - 86400000 },
    { id: '2', name: 'CoverLetter_TechCorp.pdf', type: 'Cover Letter', uploadedAt: Date.now() - 86400000 },
  ]);
  const [notes, setNotes] = useState([
    { id: '1', content: 'Great conversation with the hiring manager. They emphasized team collaboration.', timestamp: Date.now() - 172800000 },
    { id: '2', content: 'Need to prepare for technical round - focus on React and system design.', timestamp: Date.now() - 86400000 },
  ]);

  const jobs = useQuery(api.jobs.list, {});
  const updateJob = useMutation(api.jobs.update);
  const deleteJob = useMutation(api.jobs.deleteJob);

  const job = jobs?.find(j => j._id === jobId);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto text-center py-20">
              <h1 className="text-3xl font-bold mb-4">Job Not Found</h1>
              <p className="text-gray-400 mb-6">The job application you're looking for doesn't exist.</p>
              <Link
                to="/jobs/tracking"
                className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-block"
              >
                Back to Job Tracking
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const handleSaveEdit = async () => {
    if (editedJob) {
      await updateJob({
        id: jobId as any,
        ...editedJob,
      });
      setIsEditing(false);
      setEditedJob(null);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      await deleteJob({ id: jobId as any });
      navigate('/jobs/tracking');
    }
  };

  const handleStatusChange = async (newStatus: JobStatus) => {
    await updateJob({
      id: jobId as any,
      status: newStatus,
    });

    // Add to status history
    setStatusHistory([
      ...statusHistory,
      { status: newStatus, timestamp: Date.now() }
    ]);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([
        { id: Date.now().toString(), content: newNote, timestamp: Date.now() },
        ...notes
      ]);
      setNewNote('');
    }
  };

  const handleAddReminder = () => {
    if (newReminder.title && newReminder.date) {
      // In a real app, this would create a reminder/notification
      alert(`Reminder set: ${newReminder.title} on ${newReminder.date} at ${newReminder.time}`);
      setShowReminderForm(false);
      setNewReminder({ title: '', date: '', time: '' });
    }
  };

  const statusOptions: { value: JobStatus; label: string; color: string }[] = [
    { value: 'saved', label: 'Saved', color: 'bg-gray-600' },
    { value: 'applied', label: 'Applied', color: 'bg-blue-600' },
    { value: 'interviewing', label: 'Interviewing', color: 'bg-yellow-600' },
    { value: 'offered', label: 'Offered', color: 'bg-green-600' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-600' },
    { value: 'accepted', label: 'Accepted', color: 'bg-purple-600' },
  ];

  const currentStatus = statusOptions.find(s => s.value === job.status);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link
              to="/jobs/tracking"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Job Tracking
            </Link>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Job Header */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedJob?.title || job.title}
                          onChange={(e) => setEditedJob({ ...editedJob, title: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white text-2xl font-bold mb-2"
                        />
                      ) : (
                        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                      )}
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedJob?.company || job.company}
                          onChange={(e) => setEditedJob({ ...editedJob, company: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white text-xl"
                        />
                      ) : (
                        <p className="text-xl text-gray-300">{job.company}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="p-2 bg-green-600 rounded-lg hover:bg-green-500 transition"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setEditedJob(null);
                            }}
                            className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setEditedJob(job);
                            }}
                            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleDelete}
                            className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Added {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                    {job.appliedDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Applied {new Date(job.appliedDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {job.jobUrl && (
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Original Posting
                    </a>
                  )}
                </div>

                {/* Status */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-500" />
                    Application Status
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className={`px-4 py-2 ${currentStatus?.color} text-white rounded-lg font-medium`}>
                      {currentStatus?.label}
                    </span>
                  </div>
                  {statusHistory.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Status History</h3>
                      <div className="space-y-2">
                        {statusHistory.map((entry, index) => (
                          <div key={index} className="text-sm text-gray-300">
                            Changed to <span className="font-medium">{entry.status}</span> on{' '}
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-yellow-500" />
                    Job Description
                  </h2>
                  {isEditing ? (
                    <textarea
                      value={editedJob?.description || job.description}
                      onChange={(e) => setEditedJob({ ...editedJob, description: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-40"
                    />
                  ) : (
                    <p className="text-gray-300 whitespace-pre-wrap">{job.description}</p>
                  )}
                </div>

                {/* Interviews */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-yellow-500" />
                      Interview Schedule
                    </h2>
                    <button className="text-sm text-yellow-500 hover:text-yellow-400 transition">
                      + Add Interview
                    </button>
                  </div>
                  <div className="space-y-3">
                    {interviews.map((interview) => (
                      <div key={interview.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium mb-1">{interview.title}</h3>
                            <div className="text-sm text-gray-400 space-y-1">
                              <div>{interview.date} at {interview.time}</div>
                              <div>Duration: {interview.duration}</div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            interview.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                          }`}>
                            {interview.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-yellow-500" />
                    Notes & Updates
                  </h2>
                  <div className="mb-4">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note about this application..."
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24 mb-2"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                    >
                      Add Note
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div key={note.id} className="bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-300 mb-2">{note.content}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(note.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowReminderForm(!showReminderForm)}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-left flex items-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      Set Reminder
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-left flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Generate Cover Letter
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-left flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Draft Follow-up Email
                    </button>
                  </div>
                </div>

                {/* Reminder Form */}
                {showReminderForm && (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="font-semibold mb-4">Set Reminder</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Reminder title"
                        value={newReminder.title}
                        onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      />
                      <input
                        type="date"
                        value={newReminder.date}
                        onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      />
                      <input
                        type="time"
                        value={newReminder.time}
                        onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      />
                      <button
                        onClick={handleAddReminder}
                        className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                      >
                        Create Reminder
                      </button>
                    </div>
                  </div>
                )}

                {/* Contacts */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Contacts</h3>
                    <button className="text-sm text-yellow-500 hover:text-yellow-400 transition">
                      + Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="bg-gray-700 rounded-lg p-3">
                        <h4 className="font-medium mb-1">{contact.name}</h4>
                        <p className="text-sm text-gray-400 mb-2">{contact.role}</p>
                        <div className="space-y-1">
                          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-xs text-gray-400 hover:text-yellow-500 transition">
                            <Mail className="w-3 h-3" />
                            {contact.email}
                          </a>
                          <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-xs text-gray-400 hover:text-yellow-500 transition">
                            <Phone className="w-3 h-3" />
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Documents</h3>
                    <button className="text-sm text-yellow-500 hover:text-yellow-400 transition">
                      + Upload
                    </button>
                  </div>
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-gray-400">{doc.type}</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-white transition">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
