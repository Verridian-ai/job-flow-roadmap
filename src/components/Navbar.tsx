import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Briefcase, Bell } from 'lucide-react';

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-yellow-500" />
            <span className="text-xl font-bold">Jobflow</span>
          </Link>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {user?.firstName} {user?.lastName}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
