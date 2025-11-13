import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  RefreshCw,
  Settings,
  Play,
  Pause,
  BarChart3
} from 'lucide-react';

export default function AICommandCenter() {
  const { user } = useUser();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const systemHealth = [
    {
      name: 'Overall System Health',
      status: 'Healthy',
      value: 'Healthy',
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50'
    },
    {
      name: 'RAG Query Success Rate',
      status: '98%',
      value: '98%',
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50'
    },
    {
      name: 'Agent Response Latency',
      status: '250ms',
      value: '250ms',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/50'
    },
    {
      name: 'Knowledge Graph Integrity',
      status: 'Stable',
      value: 'Stable',
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50'
    },
    {
      name: 'Vector Database Performance',
      status: 'Optimal',
      value: 'Optimal',
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50'
    }
  ];

  const ragMetrics = [
    {
      name: 'Query Performance',
      value: '95%',
      change: '+5%',
      trend: 'up',
      chart: [85, 87, 92, 89, 95, 93, 95]
    },
    {
      name: 'Retrieval Performance',
      value: '88%',
      change: '-2%',
      trend: 'down',
      bars: { precision: 85, recall: 45 }
    },
    {
      name: 'Generation Quality',
      value: '92%',
      change: '+3%',
      trend: 'up',
      bars: { coherence: 90, relevance: 95 }
    }
  ];

  const knowledgeGraphHealth = [
    {
      label: 'Graph Structure',
      value: '10K Nodes, 50K Edges'
    },
    {
      label: 'Vector Index Performance',
      value: '100K Embeddings, 50ms Latency'
    },
    {
      label: 'Data Freshness (KG)',
      value: 'Updated 2h Ago'
    },
    {
      label: 'Data Freshness (Vector DB)',
      value: 'Synced 1h Ago'
    }
  ];

  const agents = [
    {
      name: 'Resume Agent',
      status: 'Online',
      sessions: 5,
      prompts: 'Prompt A, Tool X',
      performance: '200ms, 96% Completion',
      actions: 'View Logs | Restart | Update'
    },
    {
      name: 'Job Matching Agent',
      status: 'Online',
      sessions: 12,
      prompts: 'Prompt B, Tool Y',
      performance: '300ms, 90% Completion',
      actions: 'View Logs | Restart | Update'
    },
    {
      name: 'Interview Agent',
      status: 'Offline',
      sessions: 0,
      prompts: 'Prompt C, Tool Z',
      performance: 'N/A',
      actions: 'View Logs | Restart | Update'
    },
    {
      name: 'Conversational UI Agent',
      status: 'Online',
      sessions: 8,
      prompts: 'Prompt D, Tool W',
      performance: '250ms, 92% Completion',
      actions: 'View Logs | Restart | Update'
    },
    {
      name: 'Admin Agent',
      status: 'Online',
      sessions: 2,
      prompts: 'Prompt E, Tool V',
      performance: '150ms, 98% Completion',
      actions: 'View Logs | Restart | Update'
    }
  ];

  const alerts = [
    {
      type: 'Critical Alert',
      message: 'Vector DB Sync Failed',
      time: '5 min ago',
      severity: 'critical'
    }
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
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-white">AI Command Center</h1>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                    <RefreshCw className="w-5 h-5" />
                    Refresh
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                    <Settings className="w-5 h-5" />
                    Settings
                  </button>
                </div>
              </div>
              <p className="text-gray-400">Monitor and manage AI agents, RAG systems, and knowledge infrastructure</p>
            </div>

            {/* Observability Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Observability Overview</h2>
              <div className="grid grid-cols-5 gap-4">
                {systemHealth.map((metric, index) => (
                  <div
                    key={index}
                    className={`${metric.bgColor} border ${metric.borderColor} rounded-lg p-4`}
                  >
                    <h3 className="text-white font-semibold mb-2 text-sm">{metric.name}</h3>
                    <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RAG System Monitoring */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">RAG System Monitoring</h2>
              <div className="grid grid-cols-3 gap-6">
                {ragMetrics.map((metric, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">{metric.name}</h3>
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                      <p className={`text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        Last 7 Days {metric.change}
                      </p>
                    </div>

                    {metric.chart && (
                      <div className="flex items-end gap-1 h-16">
                        {metric.chart.map((value, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gray-700 rounded-t"
                            style={{ height: `${value}%` }}
                          />
                        ))}
                      </div>
                    )}

                    {metric.bars && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">
                              {Object.keys(metric.bars)[0].charAt(0).toUpperCase() + Object.keys(metric.bars)[0].slice(1)}
                            </span>
                            <span className="text-white">{Object.values(metric.bars)[0]}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gray-400 h-2 rounded-full"
                              style={{ width: `${Object.values(metric.bars)[0]}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">
                              {Object.keys(metric.bars)[1].charAt(0).toUpperCase() + Object.keys(metric.bars)[1].slice(1)}
                            </span>
                            <span className="text-white">{Object.values(metric.bars)[1]}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gray-400 h-2 rounded-full"
                              style={{ width: `${Object.values(metric.bars)[1]}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge Graph & Vector Database Health */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Knowledge Graph & Vector Database Health</h2>
              <div className="grid grid-cols-4 gap-4">
                {knowledgeGraphHealth.map((item, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-gray-400 text-sm mb-2">{item.label}</h3>
                    <p className="text-white font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Monitoring & Management */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Agent Monitoring & Management</h2>
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-750">
                    <tr className="border-b border-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Agent Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Active Sessions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Assigned Prompts & Tools
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Performance Metrics
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {agents.map((agent, index) => (
                      <tr key={index} className="hover:bg-gray-750 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                          {agent.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                              agent.status === 'Online'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-gray-700 text-gray-400'
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                agent.status === 'Online' ? 'bg-green-500' : 'bg-gray-400'
                              }`}
                            />
                            {agent.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {agent.sessions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {agent.prompts}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {agent.performance}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-500 hover:text-blue-400 text-sm">
                              View Logs
                            </button>
                            <span className="text-gray-600">|</span>
                            <button className="text-yellow-500 hover:text-yellow-400 text-sm">
                              Restart
                            </button>
                            <span className="text-gray-600">|</span>
                            <button className="text-green-500 hover:text-green-400 text-sm">
                              Update
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Full Observability Dashboard */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Full Observability Dashboard</h2>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Access Detailed Observability</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Dive deeper into AI operations with advanced tracking, logging, and metrics. Trace user
                      journeys, inspect agent decisions, and debug failures.
                    </p>
                    <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                      Open Dashboard
                    </button>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-48 h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-12 h-12 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Controls & Alerts */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">System Controls & Alerts</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">System Controls</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                        <Pause className="w-4 h-4" />
                        Pause All Agents
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition">
                        <RefreshCw className="w-4 h-4" />
                        Trigger KG Rebuild
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Recent Alerts</h3>
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-semibold text-sm">{alert.type}</h4>
                          <span className="text-gray-400 text-xs">{alert.time}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
