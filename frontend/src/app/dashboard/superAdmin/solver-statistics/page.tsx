'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { taskAPI } from '@/utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Award,
  UserCheck,
  UserX,
  ArrowLeft,
  Filter,
  Search,
  Download,
  BarChart3,
  PlusCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface SolverStats {
  _id: string;
  name: string;
  email: string;
  role: 'problemSolver' | 'ngo';
  division: string;
  district: string;
  points: number;
  avatar: string;
  isActive: boolean;
  taskStats?: {
    total: number;
    completed: number;
    pending: number;
    rating: number;
    successRate: number;
    status: string;
    isBusy: boolean;
  };
  // Keep old structure for backward compatibility
  tasks?: {
    pending: number;
    'in-progress': number;
    completed: number;
    verified: number;
    total: number;
  };
  isFree: boolean;
  status?: string;
}

type SortOption = 'name' | 'points' | 'total' | 'completed' | 'pending' | 'rating' | 'successRate';
type SortOrder = 'asc' | 'desc';

export default function SolverStatisticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [statistics, setStatistics] = useState<SolverStats[]>([]);
  const [filteredStats, setFilteredStats] = useState<SolverStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'all' | 'problemSolver' | 'ngo'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'free'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('total');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    if (user?.role === 'superAdmin') {
      fetchStatistics();
    }
  }, [user]);

  useEffect(() => {
    // Apply filters
    let filtered = [...statistics];

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter((s) => s.role === filterRole);
    }

    // Status filter
    if (filterStatus === 'free') {
      filtered = filtered.filter((s) => s.isFree);
    } else if (filterStatus === 'active') {
      filtered = filtered.filter((s) => !s.isFree);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query) ||
          s.district.toLowerCase().includes(query) ||
          s.division.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'points':
          aValue = a.points || 0;
          bValue = b.points || 0;
          break;
        case 'total':
          aValue = a.taskStats?.total ?? a.tasks?.total ?? 0;
          bValue = b.taskStats?.total ?? b.tasks?.total ?? 0;
          break;
        case 'completed':
          aValue = a.taskStats?.completed ?? a.tasks?.completed ?? 0;
          bValue = b.taskStats?.completed ?? b.tasks?.completed ?? 0;
          break;
        case 'pending':
          aValue = a.taskStats?.pending ?? a.tasks?.pending ?? 0;
          bValue = b.taskStats?.pending ?? b.tasks?.pending ?? 0;
          break;
        case 'rating':
          aValue = typeof a.taskStats?.rating === 'number' ? a.taskStats.rating : 0;
          bValue = typeof b.taskStats?.rating === 'number' ? b.taskStats.rating : 0;
          break;
        case 'successRate':
          aValue = typeof a.taskStats?.successRate === 'number' ? a.taskStats.successRate : 0;
          bValue = typeof b.taskStats?.successRate === 'number' ? b.taskStats.successRate : 0;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle numeric comparison
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredStats(filtered);
  }, [statistics, filterRole, filterStatus, searchQuery, sortBy, sortOrder]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getSolverStatistics();

      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching statistics:', error);
      toast.error(error.message || 'Failed to load solver statistics');
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary stats
  const summaryStats = {
    totalSolvers: statistics.length,
    freeSolvers: statistics.filter((s) => s.isFree).length,
    activeSolvers: statistics.filter((s) => !s.isFree).length,
    totalTasks: statistics.reduce((sum, s) => sum + (s.tasks?.total ?? 0), 0),
    completedTasks: statistics.reduce((sum, s) => {
      const completed = s.tasks?.completed ?? 0;
      const verified = s.tasks?.verified ?? 0;
      return sum + completed + verified;
    }, 0),
    inProgressTasks: statistics.reduce((sum, s) => sum + (s.tasks?.['in-progress'] ?? 0), 0),
    pendingTasks: statistics.reduce((sum, s) => sum + (s.tasks?.pending ?? 0), 0),
  };

  const getRoleColor = (role: string) => {
    return role === 'ngo'
      ? 'bg-purple-100 text-purple-700'
      : 'bg-blue-100 text-blue-700';
  };

  const getRoleBadge = (role: string) => {
    return role === 'ngo' ? 'NGO' : 'Problem Solver';
  };

  const handleAssignTask = (solver: SolverStats) => {
    // Navigate to assign task page with solver pre-selected via query params
    router.push(`/dashboard/superAdmin/assign-task?solverId=${solver._id}&solverName=${encodeURIComponent(solver.name)}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading solver statistics...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Solver Performance Statistics
              </h1>
              <p className="text-gray-600">
                Track task assignments, completion rates, and availability of problem solvers and NGOs
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Solvers</p>
                <p className="text-3xl font-bold text-gray-900">{summaryStats.totalSolvers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Solvers</p>
                <p className="text-3xl font-bold text-gray-900">{summaryStats.activeSolvers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
                <UserX className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Free Solvers</p>
                <p className="text-3xl font-bold text-gray-900">{summaryStats.freeSolvers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{summaryStats.totalTasks}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Task Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Overall Task Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-700">{summaryStats.pendingTasks}</p>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <AlertCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">{summaryStats.inProgressTasks}</p>
              <p className="text-sm text-blue-600 font-medium">In Progress</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{summaryStats.completedTasks}</p>
              <p className="text-sm text-green-600 font-medium">Completed</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-700">
                {summaryStats.completedTasks > 0
                  ? Math.round((summaryStats.completedTasks / summaryStats.totalTasks) * 100)
                  : 0}
                %
              </p>
              <p className="text-sm text-purple-600 font-medium">Success Rate</p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Filter by role"
            >
              <option value="all">All Roles</option>
              <option value="problemSolver">Problem Solvers</option>
              <option value="ngo">NGOs</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="active">Active (Has Tasks)</option>
              <option value="free">Free (No Tasks)</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Sort by"
            >
              <option value="total">Sort: Total Tasks</option>
              <option value="completed">Sort: Completed</option>
              <option value="pending">Sort: Pending</option>
              <option value="rating">Sort: Rating</option>
              <option value="successRate">Sort: Success Rate</option>
              <option value="points">Sort: Points</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-medium"
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-4"
        >
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredStats.length}</span> of{' '}
            <span className="font-bold text-gray-900">{statistics.length}</span> solvers
          </p>
        </motion.div>

        {/* Solver Statistics Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
        >
          {filteredStats.length === 0 ? (
            <div className="p-12 text-center">
              <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900 mb-2">No Solvers Found</p>
              <p className="text-gray-600">
                {searchQuery || filterRole !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No problem solvers or NGOs registered yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Solver</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Location</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Total</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Pending</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">In Progress</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Completed</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Points</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Rating / Success</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStats.map((solver, index) => (
                    <motion.tr
                      key={solver._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                            {solver.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{solver.name}</p>
                            <p className="text-sm text-gray-500">{solver.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(solver.role)}`}>
                          {getRoleBadge(solver.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{solver.district || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{solver.division || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-900 font-bold">
                          {solver.taskStats?.total ?? solver.tasks?.total ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                          {solver.taskStats?.pending ?? solver.tasks?.pending ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold">
                          {solver.tasks?.['in-progress'] ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-semibold">
                          {solver.taskStats?.completed ?? solver.tasks?.completed ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Award className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold text-gray-900">{solver.points}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold text-gray-900">
                              {typeof solver.taskStats?.rating === 'number' && solver.taskStats.rating > 0
                                ? solver.taskStats.rating.toFixed(1)
                                : 'N/A'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {typeof solver.taskStats?.successRate === 'number'
                              ? `${solver.taskStats.successRate}%`
                              : '0%'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {(solver.taskStats?.isBusy === false || solver.isFree) ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3" />
                            {solver.taskStats?.status || solver.status || 'Free'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                            <XCircle className="w-3 h-3" />
                            {solver.taskStats?.status || solver.status || 'Busy'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {solver.isFree ? (
                          <button
                            onClick={() => handleAssignTask(solver)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg font-medium text-sm"
                            title="Assign a task to this solver"
                          >
                            <PlusCircle className="w-4 h-4" />
                            Assign Task
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm font-medium">Occupied</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
