import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Star,
  FileText,
  Briefcase,
  Users,
  Shield,
  Calendar,
  Settings,
  Network,
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/star-stories', label: 'STAR Stories', icon: Star },
    { path: '/resume-builder', label: 'Resume Builder', icon: FileText },
    { path: '/resumes', label: 'My Resumes', icon: FileText },
    { path: '/jobs', label: 'Job Tracker', icon: Briefcase },
    { path: '/networking', label: 'Networking Hub', icon: Network },
    { path: '/coaches', label: 'Find Coaches', icon: Users },
    { path: '/marketplace', label: 'Marketplace', icon: Shield },
    { path: '/sessions', label: 'Sessions', icon: Calendar },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen p-6">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-yellow-500 text-gray-900 font-semibold'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
