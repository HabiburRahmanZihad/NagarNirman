'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FullPageLoading } from '@/components/common';
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
  Filter,
  Search,
  Download,
  BarChart3,
  PlusCircle,
  XCircle,
} from 'lucide-react';
import Card from '@/components/common/Card';

interface SolverStats {
  _id: string;
  name: string;
  email: string;
  role: 'problemSolver';
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

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

type SortOption = 'name' | 'points' | 'total' | 'completed' | 'pending' | 'rating' | 'successRate';
type SortOrder = 'asc' | 'desc';

export default function SolverStatisticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [statistics, setStatistics] = useState<SolverStats[]>([]);
  const [filteredStats, setFilteredStats] = useState<SolverStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'all' | 'problemSolver'>('all');
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
    let filtered = [...statistics];

    if (filterRole !== 'all') {
      filtered = filtered.filter((s) => s.role === filterRole);
    }

    if (filterStatus === 'free') {
      filtered = filtered.filter((s) => s.isFree);
    } else if (filterStatus === 'active') {
      filtered = filtered.filter((s) => !s.isFree);
    }

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

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

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

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const numA = aValue as number;
      const numB = bValue as number;
      return sortOrder === 'asc' ? numA - numB : numB - numA;
    });

    setFilteredStats(filtered);
  }, [statistics, filterRole, filterStatus, searchQuery, sortBy, sortOrder]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getSolverStatistics() as ApiResponse<SolverStats[]>;

      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load solver statistics';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAssignTask = (solver: SolverStats) => {
    router.push(`/dashboard/superAdmin/assign-task?solverId=${solver._id}&solverName=${encodeURIComponent(solver.name)}`);
  };

  if (loading) {
    return <FullPageLoading text="Loading solver statistics..." />;
  }

  return (
    <div className="min-h-screen bg-base-200 p-3 xs:p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-4 xs:space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-white rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 xs:p-6 sm:p-8 lg:p-12 border-t-4 border-accent flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 sm:gap-6"
        >
          <div className="min-w-0">
            <h1 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-1 xs:mb-2">
              Solver Performance
            </h1>
            <p className="text-white/90 text-xs xs:text-sm sm:text-base lg:text-lg font-semibold">
              Track task assignments, completion rates, and availability
            </p>
          </div>
          <motion.button
            onClick={() => window.print()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-white/20 hover:bg-white/30 rounded-lg xs:rounded-xl font-bold text-white transition-all shrink-0 text-xs xs:text-sm sm:text-base"
          >
            <Download className="w-4 h-4 xs:w-5 xs:h-5" />
            <span>Export</span>
          </motion.button>
        </motion.div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {[
            {
              title: 'Total Solvers',
              value: summaryStats.totalSolvers,
              icon: Users,
              color: 'text-info',
              bgColor: 'bg-info/10',
            },
            {
              title: 'Active Solvers',
              value: summaryStats.activeSolvers,
              icon: UserCheck,
              color: 'text-success',
              bgColor: 'bg-success/10',
            },
            {
              title: 'Free Solvers',
              value: summaryStats.freeSolvers,
              icon: UserX,
              color: 'text-warning',
              bgColor: 'bg-warning/10',
            },
            {
              title: 'Total Tasks',
              value: summaryStats.totalTasks,
              icon: BarChart3,
              color: 'text-secondary',
              bgColor: 'bg-secondary/10',
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border-2 border-accent/20 shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase tracking-wide truncate">{stat.title}</p>
                    <p className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-info mt-1 xs:mt-2 sm:mt-3">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} bg-white/60 p-1.5 xs:p-2 sm:p-3 rounded-lg xs:rounded-xl shrink-0`}>
                    <Icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Task Status Overview */}
        <Card className="bg-base-100 border-2 border-accent/20 p-4 xs:p-5 sm:p-6 lg:p-8 shadow-lg sm:shadow-xl">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-neutral mb-4 xs:mb-5 sm:mb-6 flex items-center gap-2 xs:gap-3">
            <TrendingUp className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-success" />
            Overall Task Status
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
            {[
              {
                title: 'Pending',
                value: summaryStats.pendingTasks,
                icon: Clock,
                bgColor: 'bg-warning/10',
                borderColor: 'border-warning/40',
                textColor: 'text-warning',
              },
              {
                title: 'In Progress',
                value: summaryStats.inProgressTasks,
                icon: AlertCircle,
                bgColor: 'bg-info/10',
                borderColor: 'border-info/40',
                textColor: 'text-info',
              },
              {
                title: 'Completed',
                value: summaryStats.completedTasks,
                icon: CheckCircle2,
                bgColor: 'bg-success/10',
                borderColor: 'border-success/40',
                textColor: 'text-success',
              },
              {
                title: 'Success Rate',
                value: `${summaryStats.completedTasks > 0
                  ? Math.round((summaryStats.completedTasks / summaryStats.totalTasks) * 100)
                  : 0
                  }%`,
                icon: Award,
                bgColor: 'bg-secondary/10',
                borderColor: 'border-secondary/40',
                textColor: 'text-secondary',
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`text-center p-3 xs:p-4 sm:p-5 ${stat.bgColor} rounded-lg xs:rounded-xl border-2 ${stat.borderColor} shadow-md`}
                >
                  <Icon className={`w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 ${stat.textColor} mx-auto mb-1.5 xs:mb-2`} />
                  <p className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-neutral">{stat.value}</p>
                  <p className={`text-[10px] xs:text-xs sm:text-sm font-bold mt-0.5 xs:mt-1 ${stat.textColor}`}>{stat.title}</p>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Filters */}
        <Card className="bg-base-100 border-2 border-accent/20 p-4 xs:p-5 sm:p-6 lg:p-8 shadow-lg sm:shadow-xl">
          <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-5 sm:mb-6">
            <Filter className="w-5 h-5 xs:w-6 xs:h-6 text-primary" />
            <h2 className="text-base xs:text-lg sm:text-xl font-extrabold text-neutral">Filters & Search</h2>
          </div>

          <div className="space-y-3 xs:space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-neutral/40" />
              <input
                type="text"
                placeholder="Search by name, email, district, or division..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 xs:pl-12 pr-3 xs:pr-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 focus:border-accent rounded-lg xs:rounded-xl focus:ring-2 focus:ring-accent/30 bg-base-100 font-semibold text-neutral placeholder-neutral/50 transition-all outline-none"
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4">
              {/* Role Filter */}
              <select
                title='all-roles'
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as 'all' | 'problemSolver')}
                className="px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 focus:border-accent rounded-lg xs:rounded-xl focus:ring-2 focus:ring-accent/30 bg-base-100 font-semibold text-neutral transition-all outline-none"
              >
                <option value="all">All Roles</option>
                <option value="problemSolver">Problem Solvers</option>
              </select>

              {/* Status Filter */}
              <select
                title='status-filter'
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'free')}
                className="px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 focus:border-accent rounded-lg xs:rounded-xl focus:ring-2 focus:ring-accent/30 bg-base-100 font-semibold text-neutral transition-all outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active (Busy)</option>
                <option value="free">Free</option>
              </select>

              {/* Sort By */}
              <select
                title='sort-by'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 focus:border-accent rounded-lg xs:rounded-xl focus:ring-2 focus:ring-accent/30 bg-base-100 font-semibold text-neutral transition-all col-span-2 sm:col-span-1 lg:col-span-2"
              >
                <option value="total">Total Tasks</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="rating">Rating</option>
                <option value="successRate">Success Rate</option>
                <option value="points">Points</option>
                <option value="name">Name</option>
              </select>

              {/* Sort Order */}
              <motion.button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base bg-linear-to-r from-secondary to-secondary/80 text-white rounded-lg xs:rounded-xl hover:shadow-lg font-bold transition-all flex items-center justify-center gap-1.5 xs:gap-2"
              >
                {sortOrder === 'asc' ? '↑' : '↓'} {sortOrder.toUpperCase()}
              </motion.button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 xs:mt-5 sm:mt-6 pt-4 xs:pt-5 sm:pt-6 border-t-2 border-accent/10">
            <p className="text-xs xs:text-sm font-bold text-neutral">
              Showing <span className="text-info">{filteredStats.length}</span> of{' '}
              <span className="text-info">{statistics.length}</span> solvers
            </p>
          </div>
        </Card>

        {/* Solver Statistics Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl shadow-xl border-2 border-accent/20 overflow-hidden"
        >
          {filteredStats.length === 0 ? (
            <div className="p-12 text-center">
              <UserX className="w-16 h-16 text-neutral/30 mx-auto mb-4" />
              <p className="text-xl font-bold text-neutral mb-2">No Solvers Found</p>
              <p className="text-neutral/60">
                {searchQuery || filterRole !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No problem solvers registered yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-primary/5 to-secondary/5 border-b-2 border-accent/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral uppercase tracking-wide">Solver</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral uppercase tracking-wide">Location</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-neutral uppercase tracking-wide">Total</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-neutral uppercase tracking-wide">Pending</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-neutral uppercase tracking-wide">Progress</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-neutral uppercase tracking-wide">Completed</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-neutral uppercase tracking-wide">Points</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-neutral uppercase tracking-wide">Rating</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-neutral uppercase tracking-wide">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-neutral uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent/10">
                  {filteredStats.map((solver, index) => (
                    <motion.tr
                      key={solver._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-base-200 transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-12 h-12 rounded-full bg-linear-to-br from-info to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg"
                          >
                            {solver.name.charAt(0).toUpperCase()}
                          </motion.div>
                          <div>
                            <p className="font-extrabold text-neutral">{solver.name}</p>
                            <p className="text-sm text-neutral/60">{solver.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-neutral">{solver.district || 'N/A'}</p>
                          <p className="text-sm text-neutral/60">{solver.division || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-info/10 text-info font-extrabold border-2 border-info/40">
                          {solver.taskStats?.total ?? solver.tasks?.total ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warning/10 text-warning font-extrabold border-2 border-warning/40">
                          {solver.taskStats?.pending ?? solver.tasks?.pending ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 text-secondary font-extrabold border-2 border-secondary/40">
                          {solver.tasks?.['in-progress'] ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 text-success font-extrabold border-2 border-success/40">
                          {solver.taskStats?.completed ?? solver.tasks?.completed ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Award className="w-5 h-5 text-warning" />
                          <span className="font-extrabold text-neutral">{solver.points}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1">
                            <span className="text-lg">⭐</span>
                            <span className="font-bold text-neutral">
                              {typeof solver.taskStats?.rating === 'number' && solver.taskStats.rating > 0
                                ? solver.taskStats.rating.toFixed(1)
                                : 'N/A'}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-neutral/60">
                            {typeof solver.taskStats?.successRate === 'number'
                              ? `${solver.taskStats.successRate}%`
                              : '0%'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {solver.isFree ? (
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide bg-success/20 text-success border-2 border-success/40">
                            <CheckCircle2 className="w-4 h-4" />
                            Free
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide bg-error/20 text-error border-2 border-error/40">
                            <XCircle className="w-4 h-4" />
                            Busy
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {solver.isFree ? (
                          <motion.button
                            onClick={() => handleAssignTask(solver)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-success to-info text-white rounded-xl hover:shadow-lg font-bold transition-all"
                            title="Assign a task to this solver"
                          >
                            <PlusCircle className="w-4 h-4" />
                            Assign
                          </motion.button>
                        ) : (
                          <span className="text-neutral/40 font-semibold text-sm">—</span>
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