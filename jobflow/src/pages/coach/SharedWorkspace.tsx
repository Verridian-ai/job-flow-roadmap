import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  FileText,
  Upload,
  Download,
  MessageSquare,
  Clock,
  Users,
  Edit,
  Eye,
  Save,
  Plus,
  X,
  Paperclip,
  Send,
  ChevronRight,
  Folder,
  File,
  Image as ImageIcon,
  Video
} from 'lucide-react';

export default function SharedWorkspace() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [documentContent, setDocumentContent] = useState('');

  // Mock workspace data
  const workspace = {
    id: workspaceId,
    clientName: 'Sarah Johnson',
    createdDate: '2024-03-01',
    lastActivity: '2024-03-20'
  };

  const documents = [
    {
      id: 1,
      name: 'Resume - Current Version',
      type: 'document',
      icon: FileText,
      lastModified: '2024-03-20',
      modifiedBy: 'coach',
      version: 5,
      status: 'in-review',
      comments: 12
    },
    {
      id: 2,
      name: 'Cover Letter - Tech Company',
      type: 'document',
      icon: FileText,
      lastModified: '2024-03-18',
      modifiedBy: 'client',
      version: 3,
      status: 'approved',
      comments: 8
    },
    {
      id: 3,
      name: 'Interview Prep Notes',
      type: 'document',
      icon: FileText,
      lastModified: '2024-03-15',
      modifiedBy: 'coach',
      version: 2,
      status: 'draft',
      comments: 5
    },
    {
      id: 4,
      name: 'Job Search Tracker',
      type: 'spreadsheet',
      icon: FileText,
      lastModified: '2024-03-19',
      modifiedBy: 'client',
      version: 1,
      status: 'active',
      comments: 3
    }
  ];

  const folders = [
    { id: 1, name: 'Resumes', count: 5 },
    { id: 2, name: 'Cover Letters', count: 3 },
    { id: 3, name: 'Interview Materials', count: 8 },
    { id: 4, name: 'Resources', count: 12 }
  ];

  const comments = [
    {
      id: 1,
      author: 'Coach',
      text: 'Great improvement on the achievements section! Consider adding more quantifiable metrics.',
      timestamp: '2024-03-20 10:30 AM',
      position: 'line-15',
      resolved: false
    },
    {
      id: 2,
      author: 'Sarah Johnson',
      text: 'Should I include my freelance work from 2020?',
      timestamp: '2024-03-20 11:15 AM',
      position: 'line-23',
      resolved: false
    },
    {
      id: 3,
      author: 'Coach',
      text: 'Yes, definitely include it. It shows continuous professional development.',
      timestamp: '2024-03-20 11:30 AM',
      position: 'line-23',
      resolved: false
    }
  ];

  const versions = [
    { id: 5, date: '2024-03-20', author: 'Coach', changes: 'Updated skills section with technical keywords' },
    { id: 4, date: '2024-03-18', author: 'Client', changes: 'Added recent project experience' },
    { id: 3, date: '2024-03-15', author: 'Coach', changes: 'Reformatted achievements with STAR method' },
    { id: 2, date: '2024-03-10', author: 'Client', changes: 'Initial draft with work history' },
    { id: 1, date: '2024-03-08', author: 'Coach', changes: 'Created template' }
  ];

  const activityFeed = [
    {
      id: 1,
      user: 'Coach',
      action: 'commented on',
      target: 'Resume - Current Version',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      user: 'Sarah Johnson',
      action: 'uploaded',
      target: 'Cover Letter - Tech Company',
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      user: 'Coach',
      action: 'approved',
      target: 'Cover Letter - Tech Company',
      timestamp: '1 day ago'
    }
  ];

  const handleSaveDocument = () => {
    setIsEditing(false);
    alert('Document saved successfully!');
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Shared Workspace</h1>
                  <p className="text-gray-400">
                    Collaborating with {workspace.clientName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload File
                  </button>
                  <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Document
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className="text-2xl font-bold">{documents.length}</span>
                  </div>
                  <p className="text-sm text-gray-400">Documents</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <MessageSquare className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-bold">{comments.length}</span>
                  </div>
                  <p className="text-sm text-gray-400">Active Comments</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <span className="text-2xl font-bold">5</span>
                  </div>
                  <p className="text-sm text-gray-400">Pending Reviews</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-5 h-5 text-green-500" />
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-400">Collaborators</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar - Folders & Files */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-4">
                  <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-400">
                    Folders
                  </h3>
                  <div className="space-y-2">
                    {folders.map(folder => (
                      <button
                        key={folder.id}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Folder className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm">{folder.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{folder.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                  <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-400">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {activityFeed.map(activity => (
                      <div key={activity.id} className="text-sm">
                        <p className="text-gray-300">
                          <span className="font-semibold">{activity.user}</span>
                          <span className="text-gray-400"> {activity.action} </span>
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {!selectedDocument ? (
                  // Document List View
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-4">All Documents</h2>
                      <div className="space-y-3">
                        {documents.map(doc => {
                          const Icon = doc.icon;
                          return (
                            <button
                              key={doc.id}
                              onClick={() => setSelectedDocument(doc)}
                              className="w-full bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-yellow-500 transition text-left"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-blue-500" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold mb-1">{doc.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                      <span>Version {doc.version}</span>
                                      <span>•</span>
                                      <span>Modified by {doc.modifiedBy}</span>
                                      <span>•</span>
                                      <span>{new Date(doc.lastModified).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                      doc.status === 'approved'
                                        ? 'bg-green-500/20 text-green-500'
                                        : doc.status === 'in-review'
                                        ? 'bg-yellow-500/20 text-yellow-500'
                                        : doc.status === 'draft'
                                        ? 'bg-gray-600/20 text-gray-400'
                                        : 'bg-blue-500/20 text-blue-500'
                                    }`}
                                  >
                                    {doc.status}
                                  </span>
                                  <div className="flex items-center gap-2 text-gray-400">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-sm">{doc.comments}</span>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Document Editor View
                  <div>
                    {/* Document Header */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedDocument(null)}
                            className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                          >
                            ← Back
                          </button>
                          <div>
                            <h2 className="text-xl font-bold">{selectedDocument.name}</h2>
                            <p className="text-sm text-gray-400">Version {selectedDocument.version}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setShowComments(!showComments)}
                            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" />
                            {showComments ? 'Hide' : 'Show'} Comments
                          </button>
                          <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          {isEditing ? (
                            <button
                              onClick={handleSaveDocument}
                              className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-400 transition inline-flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => setIsEditing(true)}
                              className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Status Bar */}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Last modified: {new Date(selectedDocument.lastModified).toLocaleString()}</span>
                        <span>•</span>
                        <span>Modified by: {selectedDocument.modifiedBy}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded ${
                          selectedDocument.status === 'approved'
                            ? 'bg-green-500/20 text-green-500'
                            : selectedDocument.status === 'in-review'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          {selectedDocument.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                      {/* Editor */}
                      <div className={showComments ? 'lg:col-span-2' : 'lg:col-span-3'}>
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                          {isEditing ? (
                            <textarea
                              value={documentContent}
                              onChange={(e) => setDocumentContent(e.target.value)}
                              placeholder="Start writing..."
                              rows={20}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none font-mono"
                            />
                          ) : (
                            <div className="prose prose-invert max-w-none">
                              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {documentContent || 'Document content will appear here...'}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Version History */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mt-6">
                          <h3 className="text-lg font-semibold mb-4">Version History</h3>
                          <div className="space-y-3">
                            {versions.map((version, index) => (
                              <div
                                key={version.id}
                                className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg"
                              >
                                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-sm font-semibold text-yellow-500">
                                    v{version.id}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-sm">{version.author}</p>
                                    <span className="text-xs text-gray-400">
                                      {new Date(version.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-400">{version.changes}</p>
                                  {index === 0 && (
                                    <span className="inline-block mt-2 px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-semibold">
                                      Current
                                    </span>
                                  )}
                                </div>
                                <button className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 transition text-sm">
                                  Restore
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Comments Sidebar */}
                      {showComments && (
                        <div className="lg:col-span-1">
                          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sticky top-4">
                            <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>

                            {/* Add Comment */}
                            <div className="mb-6">
                              <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                rows={3}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none text-sm mb-2"
                              />
                              <button className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center justify-center gap-2">
                                <Send className="w-4 h-4" />
                                Post Comment
                              </button>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {comments.map(comment => (
                                <div key={comment.id} className="bg-gray-700 p-3 rounded-lg">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-semibold text-gray-900">
                                          {comment.author[0]}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="font-semibold text-sm">{comment.author}</p>
                                        <p className="text-xs text-gray-400">{comment.timestamp}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-300 mb-2">{comment.text}</p>
                                  {comment.position && (
                                    <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs">
                                      {comment.position}
                                    </span>
                                  )}
                                  <div className="flex items-center gap-2 mt-3">
                                    <button className="text-xs text-gray-400 hover:text-white">
                                      Reply
                                    </button>
                                    {!comment.resolved && (
                                      <button className="text-xs text-green-500 hover:text-green-400">
                                        Resolve
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
