import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ResumeCard from '../components/ResumeCard';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Resumes() {
  const resumes = useQuery(api.resumes.listByUser);

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
                <h1 className="text-3xl font-bold mb-2">My Resumes</h1>
                <p className="text-gray-400">Manage your resume versions and downloads</p>
              </div>
              <Link
                to="/resume-builder"
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Generate New Resume
              </Link>
            </div>

            {/* Resumes Grid */}
            {resumes && resumes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume) => (
                  <ResumeCard key={resume._id} resume={resume} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-lg mb-4">No resumes yet.</p>
                <Link
                  to="/resume-builder"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Resume
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
