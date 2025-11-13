import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  BookOpen,
  Briefcase,
  Users,
  Tag,
  X
} from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: 'note' | 'document' | 'skill' | 'job' | 'contact';
  x: number;
  y: number;
  connections: string[];
}

export default function KnowledgeGraph() {
  const { user } = useUser();
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filters, setFilters] = useState({
    notes: true,
    documents: true,
    skills: true,
    jobs: true,
    contacts: true,
  });

  // Sample graph data
  const nodes: Node[] = [
    {
      id: '1',
      label: 'Career Goals',
      type: 'note',
      x: 400,
      y: 300,
      connections: ['2', '3', '4']
    },
    {
      id: '2',
      label: 'Resume 2024',
      type: 'document',
      x: 250,
      y: 200,
      connections: ['1', '5']
    },
    {
      id: '3',
      label: 'React Developer',
      type: 'job',
      x: 550,
      y: 200,
      connections: ['1', '6']
    },
    {
      id: '4',
      label: 'JavaScript',
      type: 'skill',
      x: 400,
      y: 450,
      connections: ['1', '6']
    },
    {
      id: '5',
      label: 'Interview Prep',
      type: 'note',
      x: 150,
      y: 350,
      connections: ['2', '7']
    },
    {
      id: '6',
      label: 'TypeScript',
      type: 'skill',
      x: 550,
      y: 450,
      connections: ['3', '4']
    },
    {
      id: '7',
      label: 'John Smith',
      type: 'contact',
      x: 100,
      y: 500,
      connections: ['5']
    },
    {
      id: '8',
      label: 'Startup Ideas',
      type: 'note',
      x: 650,
      y: 350,
      connections: ['3']
    },
    {
      id: '9',
      label: 'Tax Documents',
      type: 'document',
      x: 300,
      y: 100,
      connections: ['2']
    },
    {
      id: '10',
      label: 'Python',
      type: 'skill',
      x: 500,
      y: 550,
      connections: ['4']
    },
  ];

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'note':
        return '#10B981'; // green
      case 'document':
        return '#3B82F6'; // blue
      case 'skill':
        return '#8B5CF6'; // purple
      case 'job':
        return '#F59E0B'; // yellow
      case 'contact':
        return '#EC4899'; // pink
      default:
        return '#6B7280'; // gray
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'note':
        return BookOpen;
      case 'document':
        return FileText;
      case 'skill':
        return Tag;
      case 'job':
        return Briefcase;
      case 'contact':
        return Users;
      default:
        return FileText;
    }
  };

  const filteredNodes = nodes.filter(node => {
    switch (node.type) {
      case 'note':
        return filters.notes;
      case 'document':
        return filters.documents;
      case 'skill':
        return filters.skills;
      case 'job':
        return filters.jobs;
      case 'contact':
        return filters.contacts;
      default:
        return true;
    }
  });

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.2, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.2, 0.5));

  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
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
              <h1 className="text-3xl font-bold text-white mb-4">Interactive Knowledge Graph</h1>
              <p className="text-gray-400">
                Explore connections between your notes, documents, skills, jobs, and contacts
              </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Left Sidebar - Filters */}
              <div className="col-span-3">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filter by Type
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.notes}
                        onChange={() => toggleFilter('notes')}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-white">Notes</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.documents}
                        onChange={() => toggleFilter('documents')}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-white">Documents</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.skills}
                        onChange={() => toggleFilter('skills')}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-white">Skills</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.jobs}
                        onChange={() => toggleFilter('jobs')}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-yellow-500"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-white">Jobs</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.contacts}
                        onChange={() => toggleFilter('contacts')}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-pink-500 focus:ring-pink-500"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-pink-500" />
                        <span className="text-white">Contacts</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-4">Graph Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Nodes:</span>
                      <span className="text-white">{filteredNodes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Connections:</span>
                      <span className="text-white">
                        {nodes.reduce((acc, node) => acc + node.connections.length, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Graph Area */}
              <div className="col-span-9">
                <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                  {/* Graph Controls */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleZoomOut}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                      >
                        <ZoomOut className="w-5 h-5 text-white" />
                      </button>
                      <span className="text-white px-3">{Math.round(zoom * 100)}%</span>
                      <button
                        onClick={handleZoomIn}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                      >
                        <ZoomIn className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Graph Canvas */}
                  <div className="relative h-[600px] bg-gray-900">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 800 700"
                      style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                    >
                      {/* Draw connections */}
                      {filteredNodes.map(node =>
                        node.connections.map(connId => {
                          const connectedNode = filteredNodes.find(n => n.id === connId);
                          if (!connectedNode) return null;
                          return (
                            <line
                              key={`${node.id}-${connId}`}
                              x1={node.x}
                              y1={node.y}
                              x2={connectedNode.x}
                              y2={connectedNode.y}
                              stroke="#374151"
                              strokeWidth="2"
                              opacity="0.5"
                            />
                          );
                        })
                      )}

                      {/* Draw nodes */}
                      {filteredNodes.map(node => (
                        <g
                          key={node.id}
                          onClick={() => setSelectedNode(node)}
                          style={{ cursor: 'pointer' }}
                        >
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={selectedNode?.id === node.id ? 35 : 30}
                            fill={getNodeColor(node.type)}
                            opacity={selectedNode?.id === node.id ? 1 : 0.8}
                            stroke={selectedNode?.id === node.id ? '#FCD34D' : 'none'}
                            strokeWidth={selectedNode?.id === node.id ? 3 : 0}
                          />
                          <text
                            x={node.x}
                            y={node.y + 50}
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize="12"
                            fontWeight={selectedNode?.id === node.id ? 'bold' : 'normal'}
                          >
                            {node.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Node Details Panel */}
                {selectedNode && (
                  <div className="mt-4 bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: getNodeColor(selectedNode.type) }}
                        >
                          {(() => {
                            const Icon = getNodeIcon(selectedNode.type);
                            return <Icon className="w-6 h-6 text-white" />;
                          })()}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{selectedNode.label}</h3>
                          <p className="text-gray-400 capitalize">{selectedNode.type}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Connections</h4>
                        <div className="space-y-2">
                          {selectedNode.connections.map(connId => {
                            const connectedNode = nodes.find(n => n.id === connId);
                            if (!connectedNode) return null;
                            const Icon = getNodeIcon(connectedNode.type);
                            return (
                              <div
                                key={connId}
                                className="flex items-center gap-2 text-white cursor-pointer hover:text-yellow-500 transition"
                                onClick={() => setSelectedNode(connectedNode)}
                              >
                                <Icon className="w-4 h-4" />
                                <span>{connectedNode.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Actions</h4>
                        <div className="space-y-2">
                          <button className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm">
                            View Details
                          </button>
                          <button className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm">
                            Add Connection
                          </button>
                          <button className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm">
                            Edit Node
                          </button>
                        </div>
                      </div>
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
