import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Shield, CheckCircle, Clock, DollarSign, Filter } from 'lucide-react';

export default function Marketplace() {
  const [selectedType, setSelectedType] = useState('all');
  
  const tasks = useQuery(api.verificationTasks.list);
  const claimTask = useMutation(api.verificationTasks.claim);

  const taskTypes = ['all', 'resume_review', 'interview_prep', 'skill_verification', 'reference_check'];

  const filteredTasks = tasks?.filter(task => 
    selectedType === 'all' || task.type === selectedType
  );

  const handleClaimTask = async (taskId: string) => {
    try {
      await claimTask({ taskId });
      alert('Task claimed! You can now start working on it.');
    } catch (error) {
      console.error('Failed to claim task:', error);
      alert('Failed to claim task. It may already be claimed.');
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
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Shield className="w-8 h-8 text-yellow-500" />
                Verification Marketplace
              </h1>
              <p className="text-gray-400">
                Earn by helping verify resumes, conduct mock interviews, and more
              </p>
            </div>

            {/* Info Banner */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-yellow-500 mb-2">How It Works</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Browse available verification tasks posted by job seekers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Claim tasks that match your expertise</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Complete the verification and get paid</span>
                </li>
              </ul>
            </div>

            {/* Filter */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <label className="text-sm font-medium">Task Type:</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                >
                  {taskTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tasks List */}
            {filteredTasks && filteredTasks.length > 0 ? (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-medium">
                            {task.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            task.status === 'open' ? 'bg-green-500/20 text-green-500' :
                            task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-500' :
                            'bg-gray-600/20 text-gray-400'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Posted {new Date(task._creationTime).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right ml-6">
                        <div className="flex items-center gap-1 text-2xl font-bold text-yellow-500 mb-3">
                          <DollarSign className="w-6 h-6" />
                          {task.payment}
                        </div>
                        {task.status === 'open' && (
                          <button
                            onClick={() => handleClaimTask(task._id)}
                            className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                          >
                            Claim Task
                          </button>
                        )}
                      </div>
                    </div>

                    {task.requirements && task.requirements.length > 0 && (
                      <div className="border-t border-gray-700 pt-4">
                        <p className="text-sm font-medium mb-2">Requirements:</p>
                        <ul className="space-y-1">
                          {task.requirements.map((req, idx) => (
                            <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
                <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No verification tasks available.</p>
                <p className="text-gray-500 mt-2">Check back later for new opportunities.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
