import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  Clock,
  GitBranch,
  Eye,
  RotateCcw,
  Trash2,
  Tag,
  Download,
  Copy,
  ArrowLeftRight,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface ResumeVersion {
  _id: string;
  resumeId: Id<'resumes'>;
  versionNumber: number;
  content: string;
  title: string;
  versionTag?: string;
  notes?: string;
  atsScore?: number;
  createdAt: number;
}

export default function ResumeVersions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id') as Id<'resumes'> | null;
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [compareVersion, setCompareVersion] = useState<string | null>(null);
  const [showTagModal, setShowTagModal] = useState<string | null>(null);
  const [tagName, setTagName] = useState('');
  const [tagNotes, setTagNotes] = useState('');

  const resume = useQuery(api.resumes.getById, resumeId ? { id: resumeId } : 'skip');
  const versions = useQuery(
    api.resumeVersions.listByResume,
    resumeId ? { resumeId } : 'skip'
  ) as ResumeVersion[] | undefined;
  const restoreVersion = useMutation(api.resumeVersions.restore);
  const deleteVersion = useMutation(api.resumeVersions.deleteVersion);
  const tagVersion = useMutation(api.resumeVersions.tagVersion);
  const duplicateVersion = useMutation(api.resumeVersions.duplicate);

  const handleRestore = async (versionId: string) => {
    if (!resumeId) return;

    const confirmed = window.confirm(
      'Are you sure you want to restore this version? This will create a new version with this content.'
    );
    if (!confirmed) return;

    try {
      await restoreVersion({ versionId, resumeId });
      alert('Version restored successfully!');
      navigate(`/resume-refinement?id=${resumeId}`);
    } catch (error) {
      console.error('Failed to restore version:', error);
      alert('Failed to restore version. Please try again.');
    }
  };

  const handleDelete = async (versionId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this version? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await deleteVersion({ versionId });
      alert('Version deleted successfully!');
    } catch (error) {
      console.error('Failed to delete version:', error);
      alert('Failed to delete version. Please try again.');
    }
  };

  const handleTag = async () => {
    if (!showTagModal) return;

    try {
      await tagVersion({
        versionId: showTagModal,
        tag: tagName,
        notes: tagNotes,
      });
      setShowTagModal(null);
      setTagName('');
      setTagNotes('');
      alert('Version tagged successfully!');
    } catch (error) {
      console.error('Failed to tag version:', error);
      alert('Failed to tag version. Please try again.');
    }
  };

  const handleDuplicate = async (versionId: string) => {
    try {
      const newResumeId = await duplicateVersion({ versionId });
      alert('Version duplicated as new resume!');
      navigate(`/resume-refinement?id=${newResumeId}`);
    } catch (error) {
      console.error('Failed to duplicate version:', error);
      alert('Failed to duplicate version. Please try again.');
    }
  };

  const handleDownloadVersion = (version: ResumeVersion) => {
    const blob = new Blob([version.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${version.title}-v${version.versionNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (!resumeId) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Resume Selected</h2>
                <p className="text-gray-400">
                  Please select a resume to view its version history.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!resume || !versions) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading versions...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const selectedVersionData = versions.find((v) => v._id === selectedVersion);
  const compareVersionData = versions.find((v) => v._id === compareVersion);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <GitBranch className="w-8 h-8 text-yellow-500" />
                Version History
              </h1>
              <p className="text-gray-400">
                Track changes and restore previous versions of: <span className="text-white font-semibold">{resume.title}</span>
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Version List */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    All Versions ({versions.length})
                  </h3>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {versions.map((version) => (
                      <div
                        key={version._id}
                        className={`p-4 rounded-lg border transition cursor-pointer ${
                          selectedVersion === version._id
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : 'border-gray-700 bg-gray-700/50 hover:bg-gray-700'
                        }`}
                        onClick={() => setSelectedVersion(version._id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold">
                                Version {version.versionNumber}
                              </span>
                              {version.versionTag && (
                                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center gap-1">
                                  <Tag className="w-3 h-3" />
                                  {version.versionTag}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400">{formatDate(version.createdAt)}</p>
                          </div>
                          {version.atsScore !== undefined && (
                            <span className={`text-sm font-bold ${getScoreColor(version.atsScore)}`}>
                              {version.atsScore}
                            </span>
                          )}
                        </div>
                        {version.notes && (
                          <p className="text-xs text-gray-400 line-clamp-2">{version.notes}</p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestore(version._id);
                            }}
                            className="flex-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition flex items-center justify-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Restore
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (compareVersion === version._id) {
                                setCompareVersion(null);
                              } else {
                                setCompareVersion(version._id);
                              }
                            }}
                            className={`flex-1 px-2 py-1 rounded text-xs transition flex items-center justify-center gap-1 ${
                              compareVersion === version._id
                                ? 'bg-yellow-500 text-gray-900'
                                : 'bg-gray-600 text-white hover:bg-gray-500'
                            }`}
                          >
                            <ArrowLeftRight className="w-3 h-3" />
                            {compareVersion === version._id ? 'Selected' : 'Compare'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Version Details/Preview */}
              <div className="lg:col-span-2">
                {selectedVersionData ? (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    {/* Actions Bar */}
                    <div className="border-b border-gray-700 p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          <FileText className="w-5 h-5 text-yellow-500" />
                          Version {selectedVersionData.versionNumber}
                          {selectedVersionData.versionTag && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                              {selectedVersionData.versionTag}
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Created {formatDate(selectedVersionData.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowTagModal(selectedVersionData._id)}
                          className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition flex items-center gap-2"
                        >
                          <Tag className="w-4 h-4" />
                          Tag
                        </button>
                        <button
                          onClick={() => handleDuplicate(selectedVersionData._id)}
                          className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>
                        <button
                          onClick={() => handleDownloadVersion(selectedVersionData)}
                          className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={() => handleDelete(selectedVersionData._id)}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Content Preview */}
                    {compareVersionData ? (
                      // Side-by-side comparison
                      <div className="grid grid-cols-2 divide-x divide-gray-700">
                        <div className="p-6">
                          <h4 className="text-sm font-semibold mb-4 text-yellow-500">
                            Version {selectedVersionData.versionNumber}
                            {selectedVersionData.atsScore !== undefined && (
                              <span className={`ml-2 ${getScoreColor(selectedVersionData.atsScore)}`}>
                                (ATS: {selectedVersionData.atsScore})
                              </span>
                            )}
                          </h4>
                          <div
                            className="prose prose-sm prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: selectedVersionData.content }}
                          />
                        </div>
                        <div className="p-6">
                          <h4 className="text-sm font-semibold mb-4 text-blue-500">
                            Version {compareVersionData.versionNumber}
                            {compareVersionData.atsScore !== undefined && (
                              <span className={`ml-2 ${getScoreColor(compareVersionData.atsScore)}`}>
                                (ATS: {compareVersionData.atsScore})
                              </span>
                            )}
                          </h4>
                          <div
                            className="prose prose-sm prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: compareVersionData.content }}
                          />
                        </div>
                      </div>
                    ) : (
                      // Single version preview
                      <div className="p-6 bg-white text-gray-900">
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: selectedVersionData.content }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
                    <Eye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Select a version to preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Tag Modal */}
      {showTagModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8"
          onClick={() => setShowTagModal(null)}
        >
          <div
            className="bg-gray-800 rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Tag className="w-6 h-6 text-yellow-500" />
              Tag Version
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tag Name</label>
                <input
                  type="text"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="e.g., Final Draft, Google Application"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <textarea
                  value={tagNotes}
                  onChange={(e) => setTagNotes(e.target.value)}
                  placeholder="Add notes about this version..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleTag}
                  disabled={!tagName.trim()}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Tag
                </button>
                <button
                  onClick={() => {
                    setShowTagModal(null);
                    setTagName('');
                    setTagNotes('');
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
