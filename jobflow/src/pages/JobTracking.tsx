import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  LayoutGrid,
  LayoutList,
  Plus,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type JobStatus = 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  status: JobStatus;
  appliedDate?: number;
  createdAt: number;
}

const STATUS_COLUMNS = [
  { id: 'saved' as JobStatus, label: 'Saved', color: 'bg-gray-600', textColor: 'text-gray-100' },
  { id: 'applied' as JobStatus, label: 'Applied', color: 'bg-blue-600', textColor: 'text-blue-100' },
  { id: 'interviewing' as JobStatus, label: 'Interviewing', color: 'bg-yellow-600', textColor: 'text-yellow-100' },
  { id: 'offered' as JobStatus, label: 'Offered', color: 'bg-green-600', textColor: 'text-green-100' },
  { id: 'rejected' as JobStatus, label: 'Rejected', color: 'bg-red-600', textColor: 'text-red-100' },
];

const DroppableColumn = ({
  status,
  jobs,
  color,
  label
}: {
  status: JobStatus;
  jobs: Job[];
  color: string;
  label: string;
}) => {
  return (
    <div className="flex flex-col min-w-[280px] flex-shrink-0">
      <div className={`${color} px-4 py-3 rounded-t-lg`}>
        <h3 className="font-semibold text-white">
          {label}
          <span className="ml-2 text-sm opacity-75">({jobs.length})</span>
        </h3>
      </div>
      <div
        className="bg-gray-800 rounded-b-lg border border-gray-700 border-t-0 p-3 space-y-3 min-h-[500px] flex-1"
        data-status={status}
      >
        {jobs.map((job) => (
          <DraggableJobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
};

const DraggableJobCard = ({ job }: { job: Job }) => {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('jobId', job._id);
      }}
      className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition cursor-move group"
    >
      <Link to={`/jobs/${job._id}`} onClick={(e) => e.stopPropagation()}>
        <h4 className="font-semibold mb-1 group-hover:text-yellow-500 transition">
          {job.title}
        </h4>
      </Link>
      <p className="text-sm text-gray-300 mb-2">{job.company}</p>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>{job.location}</span>
        {job.salary && (
          <>
            <span>•</span>
            <span>{job.salary}</span>
          </>
        )}
      </div>
      {job.appliedDate && (
        <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400">
          Applied {new Date(job.appliedDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

const StatsCard = ({
  label,
  value,
  change,
  icon: Icon
}: {
  label: string;
  value: string | number;
  change?: string;
  icon: any;
}) => (
  <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-400 text-sm">{label}</span>
      <Icon className="w-5 h-5 text-yellow-500" />
    </div>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-bold">{value}</span>
      {change && (
        <span className={`text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
      )}
    </div>
  </div>
);

export default function JobTracking() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'all'>('all');
  const [showStats, setShowStats] = useState(true);

  const jobs = useQuery(api.jobs.list, {});
  const updateJob = useMutation(api.jobs.update);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    const target = e.currentTarget.dataset.status as JobStatus;

    if (jobId && target) {
      await updateJob({
        id: jobId as any,
        status: target
      });
    }
  };

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  const getJobsByStatus = (status: JobStatus) => {
    return filteredJobs.filter(job => job.status === status);
  };

  // Calculate statistics
  const stats = {
    total: filteredJobs.length,
    applied: filteredJobs.filter(j => j.status === 'applied').length,
    interviewing: filteredJobs.filter(j => j.status === 'interviewing').length,
    offered: filteredJobs.filter(j => j.status === 'offered').length,
    responseRate: filteredJobs.length > 0
      ? Math.round((filteredJobs.filter(j => j.status === 'interviewing' || j.status === 'offered').length / Math.max(1, filteredJobs.filter(j => j.status === 'applied').length)) * 100)
      : 0,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Job Tracking Dashboard</h1>
                <p className="text-gray-400">Manage your job applications with ease</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setView(view === 'kanban' ? 'list' : 'kanban')}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition inline-flex items-center gap-2"
                >
                  {view === 'kanban' ? <LayoutList className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
                  {view === 'kanban' ? 'List View' : 'Kanban View'}
                </button>
                <Link
                  to="/jobs/new"
                  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Job
                </Link>
              </div>
            </div>

            {/* Statistics Dashboard */}
            {showStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <StatsCard label="Total Applications" value={stats.total} icon={BarChart3} />
                <StatsCard label="Applied" value={stats.applied} change="+12%" icon={Calendar} />
                <StatsCard label="Interviewing" value={stats.interviewing} change="+5%" icon={Calendar} />
                <StatsCard label="Offers" value={stats.offered} icon={Calendar} />
                <StatsCard
                  label="Response Rate"
                  value={`${stats.responseRate}%`}
                  change={stats.responseRate > 30 ? '+5%' : undefined}
                  icon={BarChart3}
                />
              </div>
            )}

            {/* Filters & Actions */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs or companies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as JobStatus | 'all')}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                >
                  <option value="all">All Status</option>
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  More Filters
                </button>
                <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export
                </button>
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2"
                >
                  <BarChart3 className="w-5 h-5" />
                  {showStats ? 'Hide' : 'Show'} Stats
                </button>
              </div>
            </div>

            {/* Kanban Board */}
            {view === 'kanban' ? (
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  {STATUS_COLUMNS.map((column) => (
                    <div
                      key={column.id}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      data-status={column.id}
                    >
                      <DroppableColumn
                        status={column.id}
                        jobs={getJobsByStatus(column.id)}
                        color={column.color}
                        label={column.label}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* List View */
              <div className="bg-gray-800 rounded-lg border border-gray-700">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-4 text-gray-400 font-medium">Job Title</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Company</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Location</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Applied Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job) => (
                      <tr key={job._id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                        <td className="p-4">
                          <Link to={`/jobs/${job._id}`} className="font-semibold hover:text-yellow-500 transition">
                            {job.title}
                          </Link>
                        </td>
                        <td className="p-4 text-gray-300">{job.company}</td>
                        <td className="p-4 text-gray-400">{job.location}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            STATUS_COLUMNS.find(c => c.id === job.status)?.color || 'bg-gray-600'
                          } text-white`}>
                            {STATUS_COLUMNS.find(c => c.id === job.status)?.label}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">
                          {job.appliedDate
                            ? new Date(job.appliedDate).toLocaleDateString()
                            : '-'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
