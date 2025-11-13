import { FileText, Download, Trash2, Calendar, Edit3, Palette, GitBranch, Target } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Link } from 'react-router-dom';

interface Resume {
  _id: string;
  jobDescription: string;
  content: string;
  version: number;
  _creationTime: number;
}

interface Props {
  resume: Resume;
}

export default function ResumeCard({ resume }: Props) {
  const deleteResume = useMutation(api.resumes.remove);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this resume?')) {
      await deleteResume({ id: resume._id });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([resume.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-v${resume.version}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-1">
              Resume Version {resume.version}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              {new Date(resume._creationTime).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Job Description</p>
        <p className="text-sm text-gray-300 line-clamp-3">
          {resume.jobDescription}
        </p>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/resume-refinement?id=${resume._id}`}
            className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-500/30 transition inline-flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </Link>
          <Link
            to={`/resume-templates?id=${resume._id}`}
            className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-semibold hover:bg-purple-500/30 transition inline-flex items-center justify-center gap-2"
          >
            <Palette className="w-4 h-4" />
            Templates
          </Link>
          <Link
            to={`/resume-versions?id=${resume._id}`}
            className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold hover:bg-green-500/30 transition inline-flex items-center justify-center gap-2"
          >
            <GitBranch className="w-4 h-4" />
            Versions
          </Link>
          <Link
            to={`/ats-optimization?id=${resume._id}`}
            className="px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-semibold hover:bg-yellow-500/30 transition inline-flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" />
            ATS
          </Link>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition inline-flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg font-semibold hover:bg-red-500/30 transition inline-flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
