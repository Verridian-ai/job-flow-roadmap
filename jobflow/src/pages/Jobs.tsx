import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import JobCard from '../components/JobCard';
import { Plus } from 'lucide-react';

const STATUSES = [
  { id: 'wishlist', label: 'Wishlist', color: 'bg-gray-700' },
  { id: 'applied', label: 'Applied', color: 'bg-blue-700' },
  { id: 'interviewing', label: 'Interviewing', color: 'bg-yellow-700' },
  { id: 'offer', label: 'Offer', color: 'bg-green-700' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-700' },
];

export default function Jobs() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobUrl: '',
    description: '',
    status: 'wishlist',
  });

  const jobs = useQuery(api.jobs.listByUser);
  const createJob = useMutation(api.jobs.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createJob(formData);
    setFormData({
      title: '',
      company: '',
      location: '',
      salary: '',
      jobUrl: '',
      description: '',
      status: 'wishlist',
    });
    setShowForm(false);
  };

  const getJobsByStatus = (status: string) => {
    return jobs?.filter(job => job.status === status) || [];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Job Applications</h1>
                <p className="text-gray-400">Track your job search progress</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Job
              </button>
            </div>

            {/* Create Form */}
            {showForm && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      placeholder="e.g., Tech Corp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      placeholder="e.g., Remote, San Francisco, CA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Salary Range</label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      placeholder="e.g., $120k - $160k"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Job URL</label>
                    <input
                      type="url"
                      value={formData.jobUrl}
                      onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    >
                      {STATUSES.map(status => (
                        <option key={status.id} value={status.id}>{status.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description / Notes</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
                      placeholder="Add notes about the role..."
                    />
                  </div>

                  <div className="md:col-span-2 flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                    >
                      Add Job
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Kanban Board */}
            <div className="grid lg:grid-cols-5 gap-4">
              {STATUSES.map(status => (
                <div key={status.id} className="flex flex-col">
                  <div className={`${status.color} px-4 py-3 rounded-t-lg`}>
                    <h3 className="font-semibold">
                      {status.label}
                      <span className="ml-2 text-sm opacity-75">
                        ({getJobsByStatus(status.id).length})
                      </span>
                    </h3>
                  </div>
                  <div className="bg-gray-800 rounded-b-lg border border-gray-700 border-t-0 p-3 space-y-3 min-h-[400px]">
                    {getJobsByStatus(status.id).map(job => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
