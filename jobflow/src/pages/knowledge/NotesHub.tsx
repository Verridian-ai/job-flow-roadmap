import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  Save,
  FileText,
  Lightbulb,
  Network,
  Tag,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function NotesHub() {
  const { user } = useUser();
  const [noteTitle, setNoteTitle] = useState('Note Title');
  const [noteContent, setNoteContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [aiSuggestedTags, setAiSuggestedTags] = useState<string[]>([]);
  const [autoSaved, setAutoSaved] = useState(true);

  const categories = ['Career', 'Finance', 'Legal', 'Personal Projects', 'Startup'];
  const statuses = ['Draft', 'In Progress', 'Completed'];
  const projects = ['Project A', 'Project B', 'None'];

  const handleGenerateAISummary = () => {
    // TODO: Implement AI summary generation
    console.log('Generating AI summary...');
  };

  const handleLinkToDocument = () => {
    // TODO: Implement document linking
    console.log('Linking to document...');
  };

  const handleAskAI = () => {
    // TODO: Implement AI assistant
    console.log('Asking AI about this note...');
  };

  const handleSummariseText = () => {
    // TODO: Implement text summarization
    console.log('Summarising text...');
  };

  const handleGenerateIdeas = () => {
    // TODO: Implement idea generation
    console.log('Generating ideas...');
  };

  const handleConnectToKnowledgeGraph = () => {
    // TODO: Implement knowledge graph connection
    console.log('Connecting to knowledge graph...');
  };

  const handleNewNote = () => {
    setNoteTitle('Note Title');
    setNoteContent('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedProject('');
    setAiSuggestedTags([]);
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log('Saving draft...');
    setAutoSaved(true);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="text-3xl font-bold text-white bg-transparent border-none outline-none w-full mb-4"
                placeholder="Note Title"
              />

              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={handleNewNote}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  New Note
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Save Draft
                </button>
              </div>

              {autoSaved && (
                <p className="text-gray-400 text-sm">Autosaved</p>
              )}
            </div>

            {/* AI Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={handleGenerateAISummary}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                <Sparkles className="w-5 h-5" />
                Generate AI Summary
              </button>
              <button
                onClick={handleLinkToDocument}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                <FileText className="w-5 h-5" />
                Link to Document
              </button>
              <button
                onClick={handleAskAI}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                <Lightbulb className="w-5 h-5" />
                Ask AI about this Note
              </button>
            </div>

            {/* Note Editor */}
            <div className="mb-6">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Start writing your note here..."
                className="w-full h-64 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 resize-none"
              />
            </div>

            {/* AI Assistant Panel */}
            <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-700/50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                AI Assistant
              </h2>
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <h3 className="text-white font-semibold mb-2">AI Insights</h3>
                <p className="text-gray-300 text-sm">
                  This sounds like a business idea - link to your 'Startup' documents?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSummariseText}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Summarise Text
                </button>
                <button
                  onClick={handleGenerateIdeas}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Generate Ideas
                </button>
                <button
                  onClick={handleConnectToKnowledgeGraph}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  <Network className="w-5 h-5" />
                  Connect to Knowledge Graph
                </button>
              </div>
            </div>

            {/* Note Metadata & Organisation */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Note Metadata & Organisation</h2>

              {/* AI-Suggested Tags */}
              <div className="mb-4">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">AI-Suggested Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {aiSuggestedTags.length > 0 ? (
                      aiSuggestedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm border border-yellow-500/30"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No tags suggested yet. Start writing to get AI suggestions.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between cursor-pointer">
                    <span className="text-white">Categories</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full mt-2 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">Select a category...</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status/Progress */}
              <div className="mb-4">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between cursor-pointer">
                    <span className="text-white">Status/Progress</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full mt-2 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">Select status...</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Link to Project/Case */}
              <div className="mb-4">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between cursor-pointer">
                    <span className="text-white">Link to Project/Case (Optional)</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full mt-2 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">Select project...</option>
                    {projects.map((project) => (
                      <option key={project} value={project}>
                        {project}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
