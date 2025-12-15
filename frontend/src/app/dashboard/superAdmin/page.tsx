'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { userAPI, statisticsAPI, taskAPI } from '@/utils/api';
import { User } from '@/types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FullPageLoading } from '@/components/common';
import { Users, BarChart3, RefreshCw, FileText, CheckCircle2, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import Card from '@/components/common/Card';

interface Report {
  _id: string;
  title: string;
  description?: string;
  status: string;
  category?: string;
  location?: {
    district?: string;
    division?: string;
  };
  createdAt: string;
}

export default function SuperAdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    authorities: 0,
    problemSolvers: 0,

    pendingApplications: 0,
    pendingReviewTasks: 0,
    totalTasks: 0,
    completedTasks: 0,
    assignedTasks: 0,
    inProgressTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<'user' | 'authority' | 'problemSolver'>('user');
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

      // Fetch all necessary data with error handling for each call - using fast statistics API
      const [dashboardResponse, usersResponse, taskStatsResponse] = await Promise.all([
        statisticsAPI.getAdminDashboard().catch(err => {
          console.error('Dashboard API error:', err);
          return { success: false, data: { stats: {}, recentReports: [] } };
        }),
        userAPI.getAllUsers({ limit: 100 }).catch(err => {
          console.error('Users API error:', err);
          return { success: false, data: [] };
        }),
        taskAPI.getTaskStatistics().catch(err => {
          console.error('Task statistics API error:', err);
          return { success: false, data: {} };
        })
      ]);

      // Set stats from API
      if (dashboardResponse.success) {
        setStats(prev => ({
          ...prev,
          ...dashboardResponse.data.stats
        }));
        setAllReports(dashboardResponse.data.recentReports || []);
      }

      // Set all users for user management section
      if (usersResponse.success) {
        setAllUsers(usersResponse.data || []);
      }

      // Set task stats from fast statistics endpoint
      if (taskStatsResponse.success && taskStatsResponse.data) {
        setStats(prev => ({
          ...prev,
          totalTasks: taskStatsResponse.data.totalTasks || 0,
          completedTasks: taskStatsResponse.data.completedTasks || 0,
          assignedTasks: taskStatsResponse.data.assignedTasks || 0,
          inProgressTasks: taskStatsResponse.data.inProgressTasks || 0,
          pendingReviewTasks: taskStatsResponse.data.pendingReviewTasks || 0,
        }));
      }

      toast.success('Dashboard loaded successfully!');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Some data may not be available');
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update role';
      toast.error(errorMessage);
    }
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role as 'user' | 'authority' | 'problemSolver');
    setShowRoleModal(true);
  };

  const filteredUsers = filterRole === 'all'
    ? allUsers
    : allUsers.filter(u => u.role === filterRole);

  if (isLoading || loading) {
    return <FullPageLoading text="Loading SuperAdmin Dashboard..." />;
  }

  if (user?.role !== 'superAdmin') {
    return null;
  }

  return (
    <div className="space-y-4 xs:space-y-6 sm:space-y-8 px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 lg:py-8 bg-base-300 min-h-screen container mx-auto">
      {/* Welcome Section with Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary text-white rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 xs:p-6 sm:p-8 lg:p-12 border-t-4 border-accent flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4"
      >
        <div className="min-w-0">
          <h1 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-1 xs:mb-2 sm:mb-3">
            SuperAdmin Dashboard 🛡️
          </h1>
          <p className="text-white/90 text-xs xs:text-sm sm:text-lg font-semibold">
            Complete system overview and management
          </p>
        </div>
        <motion.button
          onClick={fetchDashboardData}
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="p-2 xs:p-2.5 sm:p-3 bg-white/20 hover:bg-white/30 rounded-lg xs:rounded-xl sm:rounded-2xl transition-all disabled:opacity-50 shrink-0"
          title="Refresh dashboard"
        >
          <RefreshCw className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
        {[
          { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { title: 'Total Reports', value: stats.totalReports, icon: FileText, color: 'text-green-600', bgColor: 'bg-green-50' },
          { title: 'Problem Solvers', value: stats.problemSolvers, icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-50' },
          { title: 'Authorities', value: stats.authorities, icon: CheckCircle2, color: 'text-orange-600', bgColor: 'bg-orange-50' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border-2 border-accent/20 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] xs:text-xs sm:text-sm font-bold text-neutral/70 uppercase tracking-wide truncate">{stat.title}</p>
                  <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-extrabold text-info mt-1 xs:mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} bg-white/50 p-1.5 xs:p-2 sm:p-3 rounded-lg xs:rounded-xl shrink-0`}>
                  <Icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Task Workflow Stats - Card Wrapped */}
      <Card className="rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-t-4 border-secondary">
        <div className="p-4 xs:p-5 sm:p-6 lg:p-8">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-info mb-4 xs:mb-6 sm:mb-8 flex items-center gap-2 xs:gap-3">
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-secondary rounded-lg flex items-center justify-center text-white">
              <BarChart3 className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
            </div>
            Task Workflow Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4">
            {[
              { label: 'Assigned', value: stats.assignedTasks, icon: Clock, color: 'from-orange-500 to-amber-500', link: '/dashboard/superAdmin/assign-task' },
              { label: 'In Progress', value: stats.inProgressTasks, icon: TrendingUp, color: 'from-blue-500 to-cyan-500', link: null },
              { label: 'Pending Review', value: stats.pendingReviewTasks, icon: AlertCircle, color: 'from-purple-500 to-pink-500', link: '/dashboard/superAdmin/review-tasks' },
              { label: 'Completed', value: stats.completedTasks, icon: CheckCircle2, color: 'from-green-500 to-emerald-500', link: null },
              { label: 'Completion Rate', value: `${stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%`, icon: TrendingUp, color: 'from-emerald-500 to-teal-500', link: null }
            ].map((item, idx) => {
              const Icon = item.icon;
              const content = (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 xs:p-4 sm:p-5 bg-linear-to-br from-base-100 to-base-200 rounded-lg xs:rounded-xl sm:rounded-2xl border-2 border-accent/20 hover:border-accent/50 hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2 xs:mb-3">
                    <div className={`bg-linear-to-br ${item.color} p-2 xs:p-2.5 sm:p-3 rounded-lg xs:rounded-xl text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 xs:w-5 xs:h-5" />
                    </div>
                  </div>
                  <p className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-info">{item.value}</p>
                  <p className="text-[10px] xs:text-xs sm:text-sm font-bold text-neutral/60 uppercase tracking-wide mt-1 xs:mt-2">{item.label}</p>
                </motion.div>
              );

              return item.link ? (
                <Link key={idx} href={item.link}>
                  {content}
                </Link>
              ) : (
                <div key={idx}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
        {[
          { title: '📋 All Reports', link: '/dashboard/superAdmin/all-reports', color: 'from-blue-500 to-cyan-500' },
          { title: '✏️ Assign Task', link: '/dashboard/superAdmin/assign-task', color: 'from-indigo-500 to-purple-500' },
          { title: '👥 Manage Users', link: '/dashboard/superAdmin/users', color: 'from-green-500 to-emerald-500' },
          { title: '📄 Review Applications', link: '/dashboard/superAdmin/applications', color: 'from-purple-500 to-pink-500' },
          { title: '📊 Solver Statistics', link: '/dashboard/superAdmin/solver-statistics', color: 'from-cyan-500 to-blue-500' },
          { title: '📈 System Stats', link: '/dashboard/problemSolver/statistics', color: 'from-yellow-500 to-orange-500' }
        ].map((action, idx) => (
          <Link key={idx} href={action.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-linear-to-br ${action.color} text-white rounded-lg xs:rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 lg:p-8 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl font-extrabold relative z-10">{action.title}</p>
              <div className="absolute bottom-0 right-0 opacity-20 group-hover:opacity-30 transition-opacity">
                <div className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full -mr-6 -mb-6 xs:-mr-8 xs:-mb-8 sm:-mr-10 sm:-mb-10" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* User Management Section */}
      <Card className="rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-t-4 border-secondary">
        <div className="p-4 xs:p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-4 xs:mb-6 sm:mb-8 pb-4 xs:pb-5 sm:pb-6 border-b border-accent/10 gap-3 xs:gap-4">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-info flex items-center gap-2 xs:gap-3">
              <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-secondary rounded-lg flex items-center justify-center text-white">
                <Users className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
              </div>
              User Management
            </h2>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 xs:px-4 py-2 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl bg-base-200 focus:ring-2 focus:ring-secondary focus:border-secondary text-neutral font-medium transition-all duration-200"
              aria-label="Filter users by role"
            >
              <option value="all">All Roles</option>
              <option value="user">👤 Users</option>
              <option value="authority">👑 Authorities</option>
              <option value="problemSolver">💡 Problem Solvers</option>
              <option value="superAdmin">🛡️ Super Admins</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-lg xs:rounded-xl sm:rounded-2xl border-2 border-accent/20 -mx-4 xs:-mx-5 sm:-mx-6 lg:-mx-8">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-linear-to-r from-primary/5 to-secondary/5 border-b-2 border-accent/20">
                  <th className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-left font-bold text-info text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider">User</th>
                  <th className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-left font-bold text-info text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider">Role</th>
                  <th className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-left font-bold text-info text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider hidden sm:table-cell">Location</th>
                  <th className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-left font-bold text-info text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider">Status</th>
                  <th className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-left font-bold text-info text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/10">
                {filteredUsers.slice(0, 10).map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 xs:gap-3">
                        <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-linear-to-br from-primary to-secondary rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-xs xs:text-sm sm:text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs xs:text-sm font-bold text-neutral truncate">{user.name}</div>
                          <div className="text-[10px] xs:text-xs text-neutral/60 truncate max-w-20 xs:max-w-[120px] sm:max-w-none">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 whitespace-nowrap">
                      <span className={`px-2 xs:px-3 py-0.5 xs:py-1 inline-flex text-[9px] xs:text-[10px] sm:text-xs font-bold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        <span className="hidden xs:inline">{user.role === 'problemSolver' ? 'Problem Solver' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                        <span className="xs:hidden">{user.role === 'problemSolver' ? 'PS' : user.role === 'authority' ? 'Auth' : user.role === 'superAdmin' ? 'SA' : 'User'}</span>
                      </span>
                    </td>
                    <td className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 whitespace-nowrap text-xs xs:text-sm text-neutral/70 font-medium hidden sm:table-cell">
                      📍 {user.district || 'N/A'}
                    </td>
                    <td className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 whitespace-nowrap">
                      <span className={`px-2 xs:px-3 py-0.5 xs:py-1 inline-flex text-[9px] xs:text-[10px] sm:text-xs font-bold rounded-full ${user.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {user.approved ? '✓ Active' : '⏱ Pending'}
                      </span>
                    </td>
                    <td className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 whitespace-nowrap text-xs xs:text-sm font-medium">
                      {user.role !== 'superAdmin' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openRoleModal(user)}
                          className="px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 bg-linear-to-r from-secondary to-accent text-white rounded-lg hover:shadow-lg transition-all font-bold text-[10px] xs:text-xs sm:text-sm"
                        >
                          <span className="hidden xs:inline">Change Role</span>
                          <span className="xs:hidden">Edit</span>
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 xs:py-10 sm:py-12">
              <Users className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 text-neutral/30 mx-auto mb-3 xs:mb-4" />
              <p className="text-neutral/70 font-bold text-sm xs:text-base">No users found for this filter</p>
            </div>
          )}

          {filteredUsers.length > 10 && (
            <div className="mt-4 xs:mt-6 sm:mt-8 text-center pt-4 xs:pt-5 sm:pt-6 border-t border-accent/10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard/superAdmin/users')}
                className="px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 bg-linear-to-r from-accent to-secondary text-white rounded-lg xs:rounded-xl hover:shadow-xl transition-all font-bold inline-flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm sm:text-base"
              >
                View All {filteredUsers.length} Users
                <span>→</span>
              </motion.button>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Reports */}
      <Card className="rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-t-4 border-secondary">
        <div className="p-4 xs:p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-4 xs:mb-6 sm:mb-8 pb-4 xs:pb-5 sm:pb-6 border-b border-accent/10 gap-3 xs:gap-4">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-info flex items-center gap-2 xs:gap-3">
              <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-secondary rounded-lg flex items-center justify-center text-white">
                <FileText className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
              </div>
              Recent Reports
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/superAdmin/all-reports')}
              className="px-3 xs:px-4 py-1.5 xs:py-2 bg-linear-to-r from-accent to-secondary text-white rounded-lg hover:shadow-lg transition-all font-bold flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm"
            >
              View All
              <span>→</span>
            </motion.button>
          </div>

          <div className="space-y-2 xs:space-y-3">
            {allReports.slice(0, 5).map((report, index) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col xs:flex-row items-start xs:items-center justify-between p-3 xs:p-4 sm:p-6 border-2 border-accent/20 rounded-lg xs:rounded-xl sm:rounded-2xl hover:border-accent/50 hover:shadow-lg cursor-pointer transition-all group bg-linear-to-r from-base-100 to-base-200 gap-2 xs:gap-3"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-neutral group-hover:text-secondary transition-colors text-sm xs:text-base truncate">
                    {report.title}
                  </h3>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-neutral/60 flex items-center gap-1.5 xs:gap-2 mt-1 xs:mt-2">
                    <span>📍</span>
                    {report.location?.district || 'Unknown'} • {report.category || 'Uncategorized'}
                  </p>
                </div>
                <span className={`px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-lg xs:rounded-xl text-[10px] xs:text-xs font-bold ${getStatusBadgeColor(report.status)} whitespace-nowrap shrink-0`}>
                  {formatStatus(report.status)}
                </span>
              </motion.div>
            ))}
          </div>

          {allReports.length === 0 && (
            <div className="text-center py-8 xs:py-10 sm:py-12">
              <FileText className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 text-neutral/30 mx-auto mb-3 xs:mb-4" />
              <p className="text-neutral/70 font-bold text-sm xs:text-base">No reports available</p>
            </div>
          )}
        </div>
      </Card>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowRoleModal(false);
            setSelectedUser(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-linear-to-b from-white to-base-100 rounded-3xl shadow-2xl max-w-md w-full border border-accent/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-linear-to-r from-primary to-secondary text-white p-8 border-b-4 border-accent">
              <h3 className="text-2xl font-extrabold mb-1">Change User Role</h3>
              <p className="text-white/90 font-medium">Update permissions for this user</p>
            </div>

            {/* User Info */}
            <div className="p-8 bg-linear-to-r from-primary/5 to-secondary/5 border-b border-accent/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral/70 uppercase tracking-wide">User</p>
                  <p className="font-bold text-neutral">{selectedUser.name}</p>
                </div>
              </div>
              <p className="text-xs text-neutral/60 mb-3">{selectedUser.email}</p>
              <div className="pt-3 border-t border-accent/20">
                <p className="text-xs text-neutral/70 font-bold uppercase tracking-wide mb-2">Current Role</p>
                <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${getRoleBadgeColor(selectedUser.role)}`}>
                  {selectedUser.role === 'problemSolver' ? 'Problem Solver' : selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                </span>
              </div>
            </div>

            {/* Role Selection */}
            <div className="p-8 space-y-3">
              <p className="text-sm font-bold text-neutral/70 uppercase tracking-wide mb-4">Select New Role</p>
              {['user', 'authority', 'problemSolver'].map((role) => (
                <motion.button
                  key={role}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setNewRole(role as 'user' | 'authority' | 'problemSolver')}
                  disabled={selectedUser.role === role}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all font-bold ${newRole === role
                    ? 'border-accent bg-linear-to-r from-accent/10 to-secondary/10 shadow-md'
                    : 'border-accent/20 hover:border-accent/50 hover:bg-base-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="capitalize text-neutral">
                    {role === 'problemSolver' ? 'Problem Solver' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                  {selectedUser.role === role && (
                    <span className="ml-2 text-xs text-neutral/60">(Current)</span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-8 bg-linear-to-r from-primary/5 to-secondary/5 border-t border-accent/20 rounded-b-3xl">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 px-6 py-3 border-2 border-neutral/30 rounded-xl hover:bg-base-200 font-bold transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleChangeRole}
                disabled={newRole === selectedUser.role}
                className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${newRole === selectedUser.role
                  ? 'bg-neutral/30 text-neutral/50 cursor-not-allowed'
                  : 'bg-linear-to-r from-accent to-secondary text-white hover:shadow-lg'
                  }`}
              >
                Update Role
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// Helper Functions
function getRoleBadgeColor(role: string) {
  const colors: Record<string, string> = {
    user: 'bg-blue-100 text-blue-700',
    authority: 'bg-purple-100 text-purple-700',
    problemSolver: 'bg-amber-100 text-amber-700',
    superAdmin: 'bg-red-100 text-red-700',
  };
  return colors[role] || 'bg-neutral/10 text-neutral/70';
}

function getStatusBadgeColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    inProgress: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-neutral/10 text-neutral/70';
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
