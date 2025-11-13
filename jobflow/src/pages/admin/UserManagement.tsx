import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  User,
  Mail,
  Calendar,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'coach' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  joinDate: string;
  lastActive: string;
  subscription: string;
  supportTickets: number;
}

export default function UserManagement() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const users: UserData[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      subscription: 'Pro',
      supportTickets: 2
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'coach',
      status: 'active',
      joinDate: '2023-11-20',
      lastActive: '5 minutes ago',
      subscription: 'Enterprise',
      supportTickets: 0
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'mchen@example.com',
      role: 'user',
      status: 'suspended',
      joinDate: '2024-02-10',
      lastActive: '3 days ago',
      subscription: 'Basic',
      supportTickets: 5
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      role: 'admin',
      status: 'active',
      joinDate: '2023-09-05',
      lastActive: '1 hour ago',
      subscription: 'Enterprise',
      supportTickets: 1
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'dwilson@example.com',
      role: 'user',
      status: 'banned',
      joinDate: '2024-03-01',
      lastActive: '1 week ago',
      subscription: 'Free',
      supportTickets: 8
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-500';
      case 'coach':
        return 'bg-blue-500/20 text-blue-500';
      case 'user':
        return 'bg-gray-700 text-gray-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-500';
      case 'suspended':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'banned':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'suspended':
        return Clock;
      case 'banned':
        return XCircle;
      default:
        return AlertTriangle;
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                  <p className="text-gray-400">Manage users, roles, and access control</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition">
                  <Download className="w-5 h-5" />
                  Export Users
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Users', value: '12,547', icon: User, color: 'text-blue-500' },
                { label: 'Active Users', value: '8,932', icon: CheckCircle, color: 'text-green-500' },
                { label: 'Suspended', value: '147', icon: Clock, color: 'text-yellow-500' },
                { label: 'Banned', value: '23', icon: Ban, color: 'text-red-500' }
              ].map((stat, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Filters and Search */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="coach">Coach</option>
                  <option value="admin">Admin</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </div>

            {/* User Table */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-750">
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Support Tickets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((userData) => {
                    const StatusIcon = getStatusIcon(userData.status);
                    return (
                      <tr key={userData.id} className="hover:bg-gray-750 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{userData.name}</p>
                              <p className="text-gray-400 text-sm">{userData.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(userData.role)}`}>
                            <Shield className="w-3 h-3" />
                            {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(userData.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{userData.subscription}</td>
                        <td className="px-6 py-4 text-gray-300">{userData.joinDate}</td>
                        <td className="px-6 py-4 text-gray-300">{userData.lastActive}</td>
                        <td className="px-6 py-4">
                          <span className={`text-white ${userData.supportTickets > 3 ? 'text-red-500' : ''}`}>
                            {userData.supportTickets}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewUser(userData)}
                              className="p-2 hover:bg-gray-700 rounded transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                            <button
                              className="p-2 hover:bg-gray-700 rounded transition"
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                            <button
                              className="p-2 hover:bg-gray-700 rounded transition"
                              title="More Options"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* User Detail Modal */}
            {showUserModal && selectedUser && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-2xl w-full mx-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">User Details</h2>
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="p-2 hover:bg-gray-700 rounded transition"
                    >
                      <XCircle className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                        <p className="text-gray-400">{selectedUser.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(selectedUser.role)}`}>
                            {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedUser.status)}`}>
                            {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-750 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Subscription</p>
                        <p className="text-white font-semibold">{selectedUser.subscription}</p>
                      </div>
                      <div className="bg-gray-750 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Join Date</p>
                        <p className="text-white font-semibold">{selectedUser.joinDate}</p>
                      </div>
                      <div className="bg-gray-750 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Last Active</p>
                        <p className="text-white font-semibold">{selectedUser.lastActive}</p>
                      </div>
                      <div className="bg-gray-750 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Support Tickets</p>
                        <p className="text-white font-semibold">{selectedUser.supportTickets}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition">
                        Change Role
                      </button>
                      {selectedUser.status === 'active' ? (
                        <button className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition">
                          Suspend User
                        </button>
                      ) : (
                        <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition">
                          Activate User
                        </button>
                      )}
                      <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition">
                        Ban User
                      </button>
                    </div>

                    {/* Audit Log Preview */}
                    <div>
                      <h3 className="text-white font-semibold mb-3">Recent Activity</h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {[
                          'Logged in from IP 192.168.1.1',
                          'Updated profile information',
                          'Generated resume',
                          'Booked coaching session'
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                            <div className="w-2 h-2 rounded-full bg-gray-600" />
                            <span>{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
