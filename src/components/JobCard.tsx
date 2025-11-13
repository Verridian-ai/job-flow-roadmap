import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { MapPin, DollarSign, ExternalLink, Trash2 } from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  company: string;
  location?: string;
  salary?: string;
  jobUrl?: string;
  description?: string;
  status: string;
  _creationTime: number;
}

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  const deleteJob = useMutation(api.jobs.remove);
  // const updateJob = useMutation(api.jobs.update); // TODO: Use for status change

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this job?')) {
      await deleteJob({ id: job._id });
    }
  };

  // TODO: Implement status change UI
  // const handleStatusChange = async (newStatus: string) => {
  //   await updateJob({
  //     id: job._id,
  //     status: newStatus,
  //   });
  // };

  return (
    <div className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{job.title}</h3>
          <p className="text-sm text-gray-300 mb-2">{job.company}</p>
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {job.location && (
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
          <MapPin className="w-3 h-3" />
          {job.location}
        </div>
      )}

      {job.salary && (
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
          <DollarSign className="w-3 h-3" />
          {job.salary}
        </div>
      )}

      {job.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
          {job.description}
        </p>
      )}

      {job.jobUrl && (
        <a
          href={job.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-yellow-500 hover:text-yellow-400 mb-3"
        >
          <ExternalLink className="w-3 h-3" />
          View Posting
        </a>
      )}

      <div className="pt-3 border-t border-gray-600">
        <p className="text-xs text-gray-400">
          Added {new Date(job._creationTime).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
