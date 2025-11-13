import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import {
  Save,
  Download,
  FileText,
  Sparkles,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Undo,
  Redo,
  FileDown,
  FileType,
  FileJson,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface ATSAnalysis {
  score: number;
  feedback: string;
  suggestions: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }>;
  keywordMatches: string[];
  missingKeywords: string[];
}

export default function ResumeRefinement() {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id') as Id<'resumes'> | null;
  const [activeTab, setActiveTab] = useState<'ats' | 'keywords' | 'versions'>('ats');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);

  const resume = useQuery(api.resumes.getById, resumeId ? { id: resumeId } : 'skip');
  const updateResume = useMutation(api.resumes.update);
  const analyzeATS = useMutation(api.resumes.analyzeATS);
  const exportResume = useMutation(api.resumes.exportResume);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
    ],
    content: resume?.content || '<p>Loading...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[600px] p-6',
      },
    },
  });

  // Update editor content when resume loads
  useEffect(() => {
    if (resume && editor && resume.content !== editor.getHTML()) {
      editor.commands.setContent(resume.content);
    }
  }, [resume, editor]);

  // Auto-save functionality
  useEffect(() => {
    if (!editor || !resumeId) return;

    const autoSave = setTimeout(async () => {
      const content = editor.getHTML();
      if (content && resume && content !== resume.content) {
        await handleSave();
      }
    }, 5000); // Auto-save after 5 seconds of inactivity

    return () => clearTimeout(autoSave);
  }, [editor?.getHTML()]);

  // Analyze ATS on load
  useEffect(() => {
    if (resumeId) {
      handleAnalyzeATS();
    }
  }, [resumeId]);

  const handleSave = async () => {
    if (!editor || !resumeId) return;

    setIsSaving(true);
    try {
      const content = editor.getHTML();
      await updateResume({
        id: resumeId,
        content,
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save resume:', error);
      alert('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyzeATS = async () => {
    if (!resumeId) return;

    try {
      const analysis = await analyzeATS({ id: resumeId });
      setAtsAnalysis(analysis as ATSAnalysis);
    } catch (error) {
      console.error('Failed to analyze ATS:', error);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx' | 'txt' | 'json') => {
    if (!resumeId || !editor) return;

    try {
      const content = editor.getHTML();
      const result = await exportResume({ id: resumeId, format, content });

      // Create download link
      const blob = new Blob([result.data], {
        type: format === 'json' ? 'application/json' :
              format === 'pdf' ? 'application/pdf' :
              format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
              'text/plain'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export resume:', error);
      alert('Failed to export resume. Please try again.');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreStroke = (score: number) => {
    if (score >= 80) return 'stroke-green-500';
    if (score >= 60) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return TrendingUp;
    return AlertCircle;
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
                <p className="text-gray-400">Please select a resume to refine from your resumes page.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!resume || !editor) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading resume...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const atsScore = atsAnalysis?.score ?? resume.atsScore ?? 0;
  const ScoreIcon = getScoreIcon(atsScore);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-yellow-500" />
                <div>
                  <h1 className="text-xl font-bold">{resume.title}</h1>
                  {lastSaved && (
                    <p className="text-xs text-gray-400">
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
                <div className="relative group">
                  <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-t-lg flex items-center gap-2"
                    >
                      <FileDown className="w-4 h-4" />
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleExport('docx')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2"
                    >
                      <FileType className="w-4 h-4" />
                      Export as DOCX
                    </button>
                    <button
                      onClick={() => handleExport('txt')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Export as TXT
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-b-lg flex items-center gap-2"
                    >
                      <FileJson className="w-4 h-4" />
                      Export as JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Section */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Rich Text Editor Toolbar */}
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-gray-700 transition ${
                          editor.isActive('bold') ? 'bg-gray-700 text-yellow-500' : ''
                        }`}
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-gray-700 transition ${
                          editor.isActive('italic') ? 'bg-gray-700 text-yellow-500' : ''
                        }`}
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-2 rounded hover:bg-gray-700 transition ${
                          editor.isActive('underline') ? 'bg-gray-700 text-yellow-500' : ''
                        }`}
                      >
                        <UnderlineIcon className="w-4 h-4" />
                      </button>
                      <div className="w-px h-6 bg-gray-700 mx-2" />
                      <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-gray-700 transition ${
                          editor.isActive('bulletList') ? 'bg-gray-700 text-yellow-500' : ''
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded hover:bg-gray-700 transition ${
                          editor.isActive('orderedList') ? 'bg-gray-700 text-yellow-500' : ''
                        }`}
                      >
                        <ListOrdered className="w-4 h-4" />
                      </button>
                      <div className="w-px h-6 bg-gray-700 mx-2" />
                      <button
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="p-2 rounded hover:bg-gray-700 transition disabled:opacity-50"
                      >
                        <Undo className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="p-2 rounded hover:bg-gray-700 transition disabled:opacity-50"
                      >
                        <Redo className="w-4 h-4" />
                      </button>
                      <div className="w-px h-6 bg-gray-700 mx-2" />
                      <button
                        onClick={handleAnalyzeATS}
                        className="ml-auto px-4 py-2 bg-yellow-500/20 text-yellow-500 rounded-lg font-semibold hover:bg-yellow-500/30 transition inline-flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Re-analyze ATS
                      </button>
                    </div>
                  </div>

                  {/* Editor Content */}
                  <div className="bg-white text-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                    <EditorContent editor={editor} />
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-28 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-700">
                      <button
                        onClick={() => setActiveTab('ats')}
                        className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
                          activeTab === 'ats'
                            ? 'border-b-2 border-yellow-500 text-yellow-500'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        ATS Score
                      </button>
                      <button
                        onClick={() => setActiveTab('keywords')}
                        className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
                          activeTab === 'keywords'
                            ? 'border-b-2 border-yellow-500 text-yellow-500'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Keywords
                      </button>
                      <button
                        onClick={() => setActiveTab('versions')}
                        className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
                          activeTab === 'versions'
                            ? 'border-b-2 border-yellow-500 text-yellow-500'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Versions
                      </button>
                    </div>

                    <div className="p-6">
                      {/* ATS Score Tab */}
                      {activeTab === 'ats' && (
                        <div className="space-y-6">
                          {/* Score Circle */}
                          <div className="flex flex-col items-center gap-4 text-center">
                            <div className="relative flex items-center justify-center w-36 h-36">
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle
                                  className="stroke-current text-gray-700"
                                  cx="50"
                                  cy="50"
                                  fill="transparent"
                                  r="42"
                                  strokeWidth="8"
                                />
                                <circle
                                  className={`stroke-current ${getScoreStroke(atsScore)} transition-all duration-500`}
                                  cx="50"
                                  cy="50"
                                  fill="transparent"
                                  r="42"
                                  strokeDasharray="264"
                                  strokeDashoffset={264 - (264 * atsScore) / 100}
                                  strokeLinecap="round"
                                  strokeWidth="8"
                                />
                              </svg>
                              <div className="absolute flex flex-col">
                                <span className={`text-3xl font-bold ${getScoreColor(atsScore)}`}>
                                  {atsScore}
                                </span>
                                <span className="text-sm font-medium text-gray-400">/ 100</span>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold mb-1 flex items-center gap-2 justify-center">
                                <ScoreIcon className={`w-5 h-5 ${getScoreColor(atsScore)}`} />
                                {atsScore >= 80
                                  ? 'Excellent Match!'
                                  : atsScore >= 60
                                  ? 'Good Match'
                                  : 'Needs Improvement'}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {atsAnalysis?.feedback ||
                                  'Your resume is being analyzed for ATS compatibility.'}
                              </p>
                            </div>
                          </div>

                          {/* Suggestions */}
                          {atsAnalysis?.suggestions && atsAnalysis.suggestions.length > 0 && (
                            <div className="border-t border-gray-700 pt-4">
                              <h4 className="font-bold mb-3">Suggestions</h4>
                              <div className="space-y-3">
                                {atsAnalysis.suggestions.map((suggestion, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-3 rounded-lg bg-gray-700 p-3"
                                  >
                                    {suggestion.type === 'success' ? (
                                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    ) : suggestion.type === 'warning' ? (
                                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                    ) : (
                                      <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    )}
                                    <p className="text-sm flex-1">{suggestion.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Keywords Tab */}
                      {activeTab === 'keywords' && (
                        <div className="space-y-4">
                          {atsAnalysis?.keywordMatches && atsAnalysis.keywordMatches.length > 0 && (
                            <div>
                              <h4 className="font-bold mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Matched Keywords
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {atsAnalysis.keywordMatches.map((keyword, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {atsAnalysis?.missingKeywords && atsAnalysis.missingKeywords.length > 0 && (
                            <div className="border-t border-gray-700 pt-4">
                              <h4 className="font-bold mb-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                                Consider Adding
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {atsAnalysis.missingKeywords.map((keyword, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full cursor-pointer hover:bg-yellow-500/30 transition"
                                    onClick={() => {
                                      editor?.commands.insertContent(` ${keyword} `);
                                    }}
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                              <p className="text-xs text-gray-400 mt-3">
                                Click on a keyword to add it to your resume
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Versions Tab */}
                      {activeTab === 'versions' && (
                        <div className="text-center py-8">
                          <p className="text-gray-400 text-sm">
                            Version history will be displayed here. This feature tracks all changes
                            made to your resume.
                          </p>
                        </div>
                      )}
                    </div>
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
