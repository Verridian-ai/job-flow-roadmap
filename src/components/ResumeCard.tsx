import { FileText, Download, Trash2, Calendar } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

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

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center justify-center gap-2"
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
  );
}
