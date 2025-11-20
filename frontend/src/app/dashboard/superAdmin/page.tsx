'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { userAPI, statisticsAPI } from '@/utils/api';
import { User } from '@/types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function SuperAdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allReports, setAllReports] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    authorities: 0,
    problemSolvers: 0,
    ngos: 0,
    pendingApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<'user' | 'authority' | 'problemSolver' | 'ngo'>('user');
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    if (!isLoading && user?.role !== 'superAdmin') {
      toast.error('Access denied. SuperAdmin only.');
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === 'superAdmin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats and users in parallel
      const [dashboardResponse, usersResponse] = await Promise.all([
        statisticsAPI.getAdminDashboard(),
        userAPI.getAllUsers()
      ]);

      // Set stats from API
      if (dashboardResponse.success) {
        setStats(dashboardResponse.data.stats);
        setAllReports(dashboardResponse.data.recentReports || []);
      }

      // Set all users for user management section
      if (usersResponse.success) {
        setAllUsers(usersResponse.data || []);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser) return;

    try {
      await userAPI.updateUserRole(selectedUser._id, newRole);
      toast.success(`User role updated to ${newRole} successfully!`);
      setShowRoleModal(false);
      setSelectedUser(null);
      fetchDashboardData(); // Refresh data
    } catch (error: any) {
      toast.error(error.message || 'Failed to update role');
    }
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role as any);
    setShowRoleModal(true);
  };

  const filteredUsers = filterRole === 'all'
    ? allUsers
    : allUsers.filter(u => u.role === filterRole);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-green-50/30 to-blue-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#81d586] mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-semibold text-lg">Loading SuperAdmin Dashboard...</p>
          <p className="mt-2 text-gray-500 text-sm">Please wait while we fetch your data</p>
        </motion.div>
      </div>
    );
  }

  if (user?.role !== 'superAdmin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-green-50/30 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-linear-to-r from-green-400 to-blue-500 p-3 rounded-xl shadow-lg">
              <span className="text-3xl">🛡️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                SuperAdmin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Complete system overview and management</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="blue" />
          <StatCard title="Total Reports" value={stats.totalReports} icon="📋" color="green" />
          <StatCard title="Authorities" value={stats.authorities} icon="🏛️" color="purple" />
          <StatCard title="Problem Solvers" value={stats.problemSolvers} icon="💡" color="yellow" />
          <StatCard title="NGOs" value={stats.ngos} icon="🏢" color="cyan" />
          <StatCard title="Pending Apps" value={stats.pendingApplications} icon="📄" color="red" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickAction
            title="All Reports"
            icon="📋"
            onClick={() => router.push('/dashboard/superAdmin/all-reports')}
            color="bg-blue-500"
          />
          <QuickAction
            title="Manage All Users"
            icon="👥"
            onClick={() => router.push('/dashboard/superAdmin/users')}
            color="bg-green-500"
          />
          <QuickAction
            title="Review Applications"
            icon="📄"
            onClick={() => router.push('/dashboard/superAdmin/applications')}
            color="bg-purple-500"
          />
          <QuickAction
            title="System Statistics"
            icon="📊"
            onClick={() => router.push('/dashboard/problemSolver/statistics')}
            color="bg-yellow-500"
          />
        </div>

        {/* User Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">👥</span>
                User Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">Manage and monitor all system users</p>
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#81d586] focus:border-[#81d586] transition-all bg-white"
              aria-label="Filter users by role"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="authority">Authorities</option>
              <option value="problemSolver">Problem Solvers</option>
              <option value="ngo">NGOs</option>
              <option value="superAdmin">Super Admins</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.slice(0, 10).map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-green-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-[#81d586] to-[#6bc175] rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {user.district || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                        user.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.approved ? '✓ Active' : '⏱ Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.role !== 'superAdmin' && (
                        <button
                          onClick={() => openRoleModal(user)}
                          className="px-4 py-2 bg-[#81d586] text-white rounded-lg hover:bg-[#6bc175] transition-colors font-medium"
                        >
                          Change Role
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">👥</span>
              <p className="text-gray-500 font-medium">No users found for this filter</p>
            </div>
          )}

          {filteredUsers.length > 10 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/dashboard/superAdmin/users')}
                className="px-6 py-3 bg-linear-to-r from-[#81d586] to-[#6bc175] text-white rounded-lg hover:shadow-lg transition-all font-semibold inline-flex items-center gap-2"
              >
                View All {filteredUsers.length} Users
                <span>→</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Recent Reports
              </h2>
              <p className="text-sm text-gray-600 mt-1">Latest reports from across the system</p>
            </div>
            <button
              onClick={() => router.push('/reports')}
              className="px-4 py-2 bg-linear-to-r from-[#81d586] to-[#6bc175] text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"
            >
              View All
              <span>→</span>
            </button>
          </div>

          <div className="space-y-3">
            {allReports.slice(0, 5).map((report, index) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-lg hover:border-[#81d586] hover:shadow-md cursor-pointer transition-all group"
                onClick={() => router.push(`/reports/${report._id}`)}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#81d586] transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <span>📍</span>
                    {report.location?.district || 'Unknown'} • {report.category || 'Uncategorized'}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusBadgeColor(report.status)} whitespace-nowrap`}>
                  {formatStatus(report.status)}
                </span>
              </motion.div>
            ))}
          </div>

          {allReports.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📋</span>
              <p className="text-gray-500 font-medium">No reports available</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-linear-to-r from-[#81d586] to-[#6bc175] p-3 rounded-xl">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Change User Role</h3>
                <p className="text-sm text-gray-500">Update user permissions</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">User</p>
              <p className="font-bold text-gray-900">{selectedUser.name}</p>
              <p className="text-xs text-gray-500 mt-1">{selectedUser.email}</p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Current Role</p>
                <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${getRoleBadgeColor(selectedUser.role)}`}>
                  {selectedUser.role}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Select New Role</p>
              {['user', 'authority', 'problemSolver', 'ngo'].map((role) => (
                <button
                  key={role}
                  onClick={() => setNewRole(role as any)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    newRole === role
                      ? 'border-[#81d586] bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-[#81d586] hover:bg-gray-50'
                  }`}
                  disabled={selectedUser.role === role}
                >
                  <span className="font-semibold capitalize text-gray-900">{role}</span>
                  {selectedUser.role === role && (
                    <span className="ml-2 text-xs text-gray-500">(Current)</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeRole}
                className="flex-1 px-6 py-3 bg-linear-to-r from-[#81d586] to-[#6bc175] text-white rounded-xl hover:shadow-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={newRole === selectedUser.role}
              >
                Update Role
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  const colorClasses: Record<string, { border: string; bg: string; text: string }> = {
    blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-600' },
    yellow: { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-600' },
    cyan: { border: 'border-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-600' },
    red: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-600' },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-md hover:shadow-xl p-5 border-l-4 ${colors.border} transition-all`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
        </div>
        <div className={`${colors.bg} p-3 rounded-lg`}>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    </motion.div>
  );
}

function QuickAction({ title, icon, onClick, color }: { title: string; icon: string; onClick: () => void; color: string }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${color} text-white rounded-xl p-6 hover:opacity-90 transition-all shadow-lg hover:shadow-2xl relative overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
      <span className="text-4xl mb-3 block transform group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-semibold text-lg">{title}</span>
    </motion.button>
  );
}

function getRoleBadgeColor(role: string) {
  const colors: Record<string, string> = {
    user: 'bg-gray-100 text-gray-800',
    authority: 'bg-purple-100 text-purple-800',
    problemSolver: 'bg-blue-100 text-blue-800',
    ngo: 'bg-green-100 text-green-800',
    superAdmin: 'bg-red-100 text-red-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
}

function getStatusBadgeColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    inProgress: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

function formatStatus(status: string) {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    inProgress: 'In Progress',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
  };
  return statusMap[status] || status;
}
