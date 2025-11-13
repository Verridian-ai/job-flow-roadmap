import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  Search,
  FileText,
  BookOpen,
  Lightbulb,
  Network,
  Plus,
  Upload,
  Eye,
  Share,
  Tag,
  TrendingUp,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KnowledgeHub() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Documents', value: 120, icon: FileText, color: 'text-blue-500' },
    { label: 'Total Notes', value: 85, icon: BookOpen, color: 'text-green-500' },
    { label: 'Key Insights Generated (AI)', value: 42, icon: Lightbulb, color: 'text-yellow-500' },
  ];

  const categories = [
    { name: 'Career', icon: TrendingUp, count: 45 },
    { name: 'Finance', icon: Star, count: 28 },
    { name: 'Legal', icon: FileText, count: 17 },
    { name: 'Personal Projects', icon: Lightbulb, count: 25 },
  ];

  const tags = ['AI', 'Finance', 'Legal', 'Personal Projects', 'Startup'];

  const aiInsights = [
    {
      title: "You have 3 documents discussing 'AI in Finance'",
      description: "Explore the latest trends and insights in AI applications within the financial sector.",
      type: 'trend',
      bgColor: 'from-orange-500/20 to-orange-600/20',
      borderColor: 'border-orange-500/50'
    },
    {
      title: "Note on 'Tax Deductions' links to a relevant document",
      description: "Easily access related information for a comprehensive understanding of tax deductions.",
      type: 'connection',
      bgColor: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/50'
    }
  ];

  const actionableInsights = [
    {
      title: "Organise uncategorised documents",
      description: "Improve your knowledge management by categorising your documents.",
      icon: FileText
    },
    {
      title: "Review suggested connections related to your 'Business Idea' notes",
      description: "Explore potential connections and insights related to your business ideas.",
      icon: Network
    }
  ];

  const recentDocuments = [
    { title: 'Document 1', type: 'Report', lastAccessed: '2024-01-15', actions: 'View, Share, Tag' },
    { title: 'Document 2', type: 'Article', lastAccessed: '2024-01-10', actions: 'View, Share, Tag' },
    { title: 'Document 3', type: 'Presentation', lastAccessed: '2023-12-20', actions: 'View, Share, Tag' },
  ];

  const recentNotes = [
    { title: 'Note 1', actions: 'View, Edit, Summarise with AI' },
    { title: 'Note 2', actions: 'View, Edit, Summarise with AI' },
    { title: 'Note 3', actions: 'View, Edit, Summarise with AI' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Second Brain</h1>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Left Sidebar */}
              <div className="col-span-3 space-y-6">
                {/* Knowledge Graph */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">My Knowledge Graph</h3>
                  <Link
                    to="/knowledge/graph"
                    className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 transition"
                  >
                    <Network className="w-5 h-5" />
                    <span>View Knowledge Graph</span>
                  </Link>
                </div>

                {/* Categories */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.name}
                        className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 cursor-pointer transition"
                      >
                        <category.icon className="w-4 h-4" />
                        <span className="flex-1">{category.name}</span>
                        <span className="text-gray-500 text-sm">{category.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600 transition"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-span-9 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to="/knowledge/notes/new"
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                  >
                    <Plus className="w-5 h-5" />
                    New Note
                  </Link>
                  <Link
                    to="/knowledge/documents"
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Document
                  </Link>
                  <Link
                    to="/knowledge/notes"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                  >
                    <BookOpen className="w-5 h-5" />
                    Ask My Brain
                  </Link>
                </div>

                {/* AI-Generated Key Insights */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">AI-Generated Key Insights</h2>
                  <div className="space-y-4">
                    {aiInsights.map((insight, index) => (
                      <div
                        key={index}
                        className={`bg-gradient-to-r ${insight.bgColor} border ${insight.borderColor} rounded-lg p-6`}
                      >
                        <h3 className="text-white font-semibold mb-2">{insight.title}</h3>
                        <p className="text-gray-300 text-sm">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recently Added/Accessed Documents */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Recently Added/Accessed Documents</h2>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-750">
                        <tr className="border-b border-gray-700">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Last Accessed
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {recentDocuments.map((doc, index) => (
                          <tr key={index} className="hover:bg-gray-750 transition">
                            <td className="px-6 py-4 whitespace-nowrap text-white">{doc.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">{doc.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">{doc.lastAccessed}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">{doc.actions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Notes & Ideas */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Recent Notes & Ideas</h2>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-750">
                        <tr className="border-b border-gray-700">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {recentNotes.map((note, index) => (
                          <tr key={index} className="hover:bg-gray-750 transition">
                            <td className="px-6 py-4 whitespace-nowrap text-white">{note.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">{note.actions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actionable Insights / Next Steps (AI-Driven) */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Actionable Insights / Next Steps (AI-Driven)</h2>
                  <div className="space-y-4">
                    {actionableInsights.map((insight, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-gray-800 to-gray-750 border border-gray-700 rounded-lg p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <insight.icon className="w-8 h-8 text-yellow-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold mb-2">{insight.title}</h3>
                            <p className="text-gray-300 text-sm">{insight.description}</p>
                          </div>
                        </div>
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
