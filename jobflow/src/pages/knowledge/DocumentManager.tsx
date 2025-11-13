import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  Upload,
  Search,
  Filter,
  FolderPlus,
  File,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Eye,
  Edit,
  Star,
  Clock,
  Folder,
  ChevronRight,
  Grid,
  List
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  owner: string;
  shared: boolean;
  starred: boolean;
  version?: string;
}

export default function DocumentManager() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedFolder, setSelectedFolder] = useState('All Documents');

  const folders = [
    { name: 'All Documents', icon: File, count: 120 },
    { name: 'My Documents', icon: Folder, count: 45 },
    { name: 'Shared with me', icon: Share2, count: 28 },
    { name: 'Recent', icon: Clock, count: 15 },
    { name: 'Starred', icon: Star, count: 8 },
    { name: 'Career', icon: Folder, count: 30 },
    { name: 'Finance', icon: Folder, count: 22 },
    { name: 'Legal', icon: Folder, count: 18 },
  ];

  const documents: Document[] = [
    {
      id: '1',
      name: 'Q4 Financial Report.pdf',
      type: 'PDF',
      size: '2.4 MB',
      modified: '2024-01-15 10:30 AM',
      owner: 'You',
      shared: false,
      starred: true,
      version: 'v3'
    },
    {
      id: '2',
      name: 'Resume 2024.docx',
      type: 'Word',
      size: '145 KB',
      modified: '2024-01-14 3:45 PM',
      owner: 'You',
      shared: true,
      starred: false,
      version: 'v2'
    },
    {
      id: '3',
      name: 'Interview Prep Notes.txt',
      type: 'Text',
      size: '48 KB',
      modified: '2024-01-13 2:15 PM',
      owner: 'You',
      shared: false,
      starred: true
    },
    {
      id: '4',
      name: 'Company Research.pdf',
      type: 'PDF',
      size: '1.8 MB',
      modified: '2024-01-12 11:20 AM',
      owner: 'Shared by John',
      shared: true,
      starred: false
    },
    {
      id: '5',
      name: 'Salary Negotiation Guide.pdf',
      type: 'PDF',
      size: '890 KB',
      modified: '2024-01-10 9:00 AM',
      owner: 'You',
      shared: false,
      starred: false
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return FileText;
      case 'word':
      case 'docx':
        return FileText;
      case 'image':
      case 'jpg':
      case 'png':
        return Image;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      case 'zip':
      case 'rar':
        return Archive;
      default:
        return File;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-4">Document Management</h1>

              {/* Actions Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition">
                    <Upload className="w-5 h-5" />
                    Upload Document
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition">
                    <FolderPlus className="w-5 h-5" />
                    New Folder
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 w-64"
                    />
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${
                        viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                      } transition`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${
                        viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                      } transition`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                  </div>

                  <button className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Left Sidebar - Folders */}
              <div className="col-span-3">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-4">Folders</h3>
                  <div className="space-y-1">
                    {folders.map((folder) => (
                      <button
                        key={folder.name}
                        onClick={() => setSelectedFolder(folder.name)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition ${
                          selectedFolder === folder.name
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <folder.icon className="w-4 h-4" />
                          <span className="text-sm">{folder.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{folder.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Storage Info */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-4">
                  <h3 className="text-white font-semibold mb-3">Storage</h3>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Used</span>
                      <span className="text-white">4.2 GB / 10 GB</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>
                  <button className="w-full mt-3 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 transition">
                    Upgrade Storage
                  </button>
                </div>
              </div>

              {/* Main Content - Document List/Grid */}
              <div className="col-span-9">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-gray-400 text-sm">Documents</span>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                  <span className="text-white text-sm">{selectedFolder}</span>
                </div>

                {viewMode === 'list' ? (
                  /* List View */
                  <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-750">
                        <tr className="border-b border-gray-700">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Modified
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Owner
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {documents.map((doc) => {
                          const FileIcon = getFileIcon(doc.type);
                          return (
                            <tr key={doc.id} className="hover:bg-gray-750 transition group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <FileIcon className="w-5 h-5 text-gray-400" />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-white">{doc.name}</span>
                                      {doc.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                      {doc.shared && <Share2 className="w-4 h-4 text-blue-500" />}
                                    </div>
                                    {doc.version && (
                                      <span className="text-xs text-gray-500">{doc.version}</span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-300">{doc.type}</td>
                              <td className="px-6 py-4 text-gray-300">{doc.size}</td>
                              <td className="px-6 py-4 text-gray-300">{doc.modified}</td>
                              <td className="px-6 py-4 text-gray-300">{doc.owner}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                  <button className="p-1 hover:bg-gray-700 rounded" title="View">
                                    <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-700 rounded" title="Download">
                                    <Download className="w-4 h-4 text-gray-400 hover:text-white" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-700 rounded" title="Share">
                                    <Share2 className="w-4 h-4 text-gray-400 hover:text-white" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-700 rounded" title="Delete">
                                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-700 rounded" title="More">
                                    <MoreVertical className="w-4 h-4 text-gray-400 hover:text-white" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Grid View */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {documents.map((doc) => {
                      const FileIcon = getFileIcon(doc.type);
                      return (
                        <div
                          key={doc.id}
                          className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-yellow-500 transition group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <FileIcon className="w-10 h-10 text-gray-400" />
                            <button className="opacity-0 group-hover:opacity-100 transition">
                              <MoreVertical className="w-5 h-5 text-gray-400 hover:text-white" />
                            </button>
                          </div>
                          <h3 className="text-white font-medium mb-1 truncate">{doc.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400">{doc.type}</span>
                            <span className="text-xs text-gray-600">•</span>
                            <span className="text-xs text-gray-400">{doc.size}</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">{doc.modified}</p>
                          <div className="flex items-center gap-2">
                            {doc.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                            {doc.shared && <Share2 className="w-4 h-4 text-blue-500" />}
                          </div>
                        </div>
                      );
                    })}
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
