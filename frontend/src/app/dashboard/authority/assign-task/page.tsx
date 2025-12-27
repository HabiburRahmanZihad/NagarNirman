// src/app/dashboard/authority/assign-task/page.tsx
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { reportAPI, taskAPI, userAPI } from '@/utils/api';
import divisionsData from '@/data/divisionsData.json';
import { FullPageLoading } from '@/components/common';
import { motion } from 'framer-motion';
import Card from '@/components/common/Card';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
} from 'lucide-react';

// Define API response types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface Report {
  _id: string;
  title: string;
  description: string;
  images: string[];
  problemType: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'in-progress' | 'resolved' | 'closed';
  location: {
    address: string;
    district: string;
    division: string;
    coordinates: [number, number];
  };
  upvotes: string[];
  comments: unknown[];
  createdBy: string;
  assignedTo: string | null;
  history: {
    status: string;
    note: string;
    updatedBy: string;
    date: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ProblemSolver {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'problemSolver' | 'ngo';
  division: string;
  district?: string;
  address?: string;
  organization?: string;
  expertise?: string[];
  profilePicture?: string;
  approved: boolean;
  isActive: boolean;
  rating?: number;
  completedTasks?: number;
  successRate?: number;
  points?: number;
  taskStats?: {
    total: number;
    completed: number;
    pending: number;
    rating: string | number;
    successRate: string;
    status: string;
    isBusy: boolean;
  };
  createdAt: string;
}

interface SolverApiResponse {
  success: boolean;
  users: ProblemSolver[];
  message?: string;
}

interface AssignedTask {
  _id: string;
  title: string;
  description?: string;
  report?: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in-progress' | 'completed' | 'approved' | 'resolved' | 'closed';
  createdAt?: string;
  updatedAt?: string;
}

interface TaskAssignResponse {
  success: boolean;
  message?: string;
  task?: AssignedTask;
}

const AssignTaskPage = () => {
  const { user: authUser, isLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [problemSolvers, setProblemSolvers] = useState<ProblemSolver[]>([]);
  const [filters, setFilters] = useState({
    division: '',
    district: '',
    status: 'pending',
    severity: ''
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedSolver, setSelectedSolver] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  type SortKey = 'rating' | 'points' | 'completedTasks' | 'successRate';
  const [sortBy, setSortBy] = useState<SortKey>('rating');

  // Auto-set filters based on user's location
  useEffect(() => {
    if (authUser?.role === 'authority' && authUser.division) {
      setFilters({
        division: authUser.division,
        district: '', // Show all districts by default
        status: 'pending',
        severity: ''
      });
    }
  }, [authUser]);

  // Load data based on user's division from API
  useEffect(() => {
    const loadData = async () => {
      // Wait for auth to complete
      if (isLoading) {
        return;
      }

      // Check if user is authority with division
      if (!authUser || authUser.role !== 'authority' || !authUser.division) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Fetch reports and solvers in parallel
        const [reportsResponse, solversResponse] = await Promise.all([
          reportAPI.getAll({ division: authUser.division }).catch(err => {
            console.error('Reports API error:', err);
            return { success: false, data: [] } as ApiResponse<Report[]>;
          }),
          userAPI.getSolvers({ limit: 100 }).catch(err => {
            console.error('Solvers API error:', err);
            return { success: false, users: [] } as SolverApiResponse;
          })
        ]);

        // Set reports - Type assertion for API response
        const reportsApiResponse = reportsResponse as ApiResponse<Report[]>;
        if (reportsApiResponse.success && reportsApiResponse.data) {
          setReports(reportsApiResponse.data);
        } else {
          setReports([]);
        }

        // Set solvers - Type assertion for API response
        const solversApiResponse = solversResponse as SolverApiResponse;
        if (solversApiResponse.success && solversApiResponse.users) {
          // Sort by rating initially
          const sortedSolvers = [...solversApiResponse.users].sort((a, b) => {
            const ratingA = a.taskStats?.rating !== undefined && a.taskStats.rating !== 'N/A'
              ? (typeof a.taskStats.rating === 'string' ? parseFloat(a.taskStats.rating) : a.taskStats.rating)
              : a.rating || 0;
            const ratingB = b.taskStats?.rating !== undefined && b.taskStats.rating !== 'N/A'
              ? (typeof b.taskStats.rating === 'string' ? parseFloat(b.taskStats.rating) : b.taskStats.rating)
              : b.rating || 0;
            return ratingB - ratingA;
          });
          setProblemSolvers(sortedSolvers);
        } else {
          setProblemSolvers([]);
        }

        const reportCount = reportsApiResponse.data?.length || 0;
        const solverCount = solversApiResponse.users?.length || 0;

        if (reportCount === 0 && solverCount === 0) {
          toast.error(`No reports or solvers found in ${authUser.division} division`);
        } else if (reportCount === 0) {
          toast(`${solverCount} solvers available, but no reports found in ${authUser.division}`);
        } else if (solverCount === 0) {
          toast(`${reportCount} reports found, but no approved solvers in ${authUser.division}`);
        } else {
          toast.success(`Loaded ${reportCount} reports and ${solverCount} solvers`);
        }
      } catch (error: unknown) {
        console.error('Error loading data:', error);
        const message = error instanceof Error ? error.message : String(error ?? 'Unknown error');
        toast.error('Failed to load data: ' + message);
        setReports([]);
        setProblemSolvers([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authUser, isLoading]);

  // Get available districts based on selected division from divisionsData
  const availableDistricts = filters.division
    ? (divisionsData.find(d => d.division === filters.division)?.districts.map(d => d.name) || [])
    : [];

  // Sort problem solvers based on selected criteria
  const getSortedSolvers = (solvers: ProblemSolver[]) => {
    return [...solvers].sort((a, b) => {
      switch (sortBy) {
        case 'rating': {
          const ratingA = a.taskStats?.rating !== undefined && a.taskStats.rating !== 'N/A'
            ? (typeof a.taskStats.rating === 'string' ? parseFloat(a.taskStats.rating) : a.taskStats.rating)
            : a.rating || 0;
          const ratingB = b.taskStats?.rating !== undefined && b.taskStats.rating !== 'N/A'
            ? (typeof b.taskStats.rating === 'string' ? parseFloat(b.taskStats.rating) : b.taskStats.rating)
            : b.rating || 0;
          return ratingB - ratingA;
        }
        case 'points':
          return (b.points || 0) - (a.points || 0);
        case 'completedTasks': {
          const completedA = a.taskStats?.completed ?? a.completedTasks ?? 0;
          const completedB = b.taskStats?.completed ?? b.completedTasks ?? 0;
          return completedB - completedA;
        }
        case 'successRate': {
          const successA = a.taskStats?.successRate
            ? parseFloat(a.taskStats.successRate.replace('%', ''))
            : a.successRate || 0;
          const successB = b.taskStats?.successRate
            ? parseFloat(b.taskStats.successRate.replace('%', ''))
            : b.successRate || 0;
          return successB - successA;
        }
        default: {
          const ratingA = a.taskStats?.rating !== undefined && a.taskStats.rating !== 'N/A'
            ? (typeof a.taskStats.rating === 'string' ? parseFloat(a.taskStats.rating) : a.taskStats.rating)
            : a.rating || 0;
          const ratingB = b.taskStats?.rating !== undefined && b.taskStats.rating !== 'N/A'
            ? (typeof b.taskStats.rating === 'string' ? parseFloat(b.taskStats.rating) : b.taskStats.rating)
            : b.rating || 0;
          return ratingB - ratingA;
        }
      }
    });
  };

  // Filter reports based on filters
  const filteredReports = reports.filter(report => {
    if (filters.division && report.location.division !== filters.division) return false;
    if (filters.district && report.location.district !== filters.district) return false;
    if (filters.status && report.status !== filters.status) return false;
    if (filters.severity && report.severity !== filters.severity) return false;
    return true;
  });

  const assignTask = async (reportId: string, solverId: string) => {
    setAssigning(true);

    try {
      const report = reports.find(r => r._id === reportId);
      const solver = problemSolvers.find(s => s._id === solverId);

      if (!report || !solver) {
        toast.error('Invalid report or problem solver');
        return;
      }

      // API call to assign task
      const response = await taskAPI.assign({
        title: report.title,
        description: report.description,
        report: reportId,
        assignedTo: solver._id,
        priority: report.severity === 'high' ? 'high' : report.severity === 'medium' ? 'medium' : 'low',
      });

      // Type assertion for the response
      const assignResponse = response as TaskAssignResponse;

      if (assignResponse.success) {
        // Backend automatically updates report status to 'approved'
        // Update local state to reflect the change
        setReports(prev => prev.map(r =>
          r._id === reportId
            ? {
              ...r,
              status: 'approved',
              assignedTo: solver._id,
              history: [
                ...r.history,
                {
                  status: 'approved',
                  note: `Task assigned: ${report.title}`,
                  updatedBy: authUser?.name || 'Authority',
                  date: new Date().toISOString()
                }
              ],
              updatedAt: new Date().toISOString()
            }
            : r
        ));

        toast.success(`Task successfully assigned to ${solver.name}${solver.organization ? ` from ${solver.organization}` : ''}!`, {
          duration: 5000,
        });

        // Close modal after successful assignment
        setTimeout(() => {
          setSelectedReport(null);
          setSelectedSolver('');
        }, 1000);
      } else {
        throw new Error(assignResponse.message || 'Failed to assign task');
      }
    } catch (error: unknown) {
      console.error('Error assigning task:', error);
      const errorMessage = error instanceof Error ? error.message : String(error ?? 'Failed to assign task. Please try again.');
      toast.error(errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get available problem solvers for the selected report's location
  const getAvailableSolvers = (report?: Report | null) => {
    // Show all solvers from the same division, prioritizing those from the same district
    if (!report) return [] as ProblemSolver[];
    const solvers = problemSolvers.filter(solver =>
      solver.division === report.location.division
    );
    return getSortedSolvers(solvers);
  };

  if (loading) {
    return <FullPageLoading text="Loading Data..." />;
  }

  return (
    <>
      <div className="space-y-4 xs:space-y-6 sm:space-y-8 px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 lg:py-8 bg-base-300 min-h-screen container mx-auto">
        {/* Welcome Section with Gradient Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-white rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 xs:p-6 sm:p-8 lg:p-12 border-t-4 border-accent"
        >
          <h1 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-1.5 xs:mb-2 sm:mb-3">
            Task Assignment Center ⚡
          </h1>
          <p className="text-white/90 text-xs xs:text-sm sm:text-lg font-semibold">
            {authUser?.role === 'authority' && authUser.division
              ? `Assign infrastructure tasks to problem solvers in ${authUser.division} Division`
              : 'Manage and assign infrastructure tasks to available problem solvers'}
          </p>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
          {[
            { title: 'Pending Tasks', value: reports.filter(r => r.status === 'pending').length, icon: AlertCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
            { title: 'In Progress', value: reports.filter(r => r.status === 'in-progress').length, icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { title: 'Resolved', value: reports.filter(r => r.status === 'resolved').length, icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50' },
            { title: 'Available Solvers', value: problemSolvers.length, icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50' }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className={`${stat.bgColor} rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border-2 border-accent/20 shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1`}>
                  <div className="flex items-center justify-between mb-2 xs:mb-3">
                    <IconComponent size={20} className={`${stat.color} xs:w-6 xs:h-6 sm:w-8 sm:h-8`} />
                    <span className={`text-lg xs:text-xl sm:text-2xl lg:text-3xl font-extrabold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                  <h3 className="text-[10px] xs:text-xs sm:text-sm font-bold uppercase tracking-wide sm:tracking-widest text-neutral/70 truncate">
                    {stat.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-t-4 border-secondary p-4 xs:p-5 sm:p-6 lg:p-8 h-fit">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-info mb-4 xs:mb-5 sm:mb-6 flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm xs:text-base">🎯</div>
                Filters
              </h2>
              <div className="space-y-3 xs:space-y-4">
                <div>
                  <label className="block text-xs xs:text-sm font-bold text-gray-700 mb-1.5 xs:mb-2 uppercase tracking-wide">
                    Division
                  </label>
                  <select
                    aria-label="Filter by division"
                    value={filters.division}
                    onChange={(e) => setFilters({
                      ...filters,
                      division: e.target.value,
                      district: ''
                    })}
                    disabled={authUser?.role === 'authority'}
                    className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-base-200 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors disabled:bg-base-200 disabled:cursor-not-allowed font-medium"
                  >
                    <option value="">All Divisions</option>
                    {divisionsData.map(d => (
                      <option key={d.division} value={d.division}>{d.division}</option>
                    ))}
                  </select>
                  {authUser?.role === 'authority' && (
                    <p className="text-[10px] xs:text-xs text-gray-500 mt-1.5 xs:mt-2">Set to: {authUser.division}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs xs:text-sm font-bold text-gray-700 mb-1.5 xs:mb-2 uppercase tracking-wide">
                    District
                  </label>
                  <select
                    aria-label="Filter by district"
                    value={filters.district}
                    onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                    disabled={!filters.division}
                    className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-base-200 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors disabled:bg-base-200 disabled:cursor-not-allowed font-medium outline-none"
                  >
                    <option value="">All Districts</option>
                    {availableDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs xs:text-sm font-bold text-gray-700 mb-1.5 xs:mb-2 uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    aria-label="Filter by status"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-base-200 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors font-medium outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs xs:text-sm font-bold text-gray-700 mb-1.5 xs:mb-2 uppercase tracking-wide">
                    Severity
                  </label>
                  <select
                    aria-label="Filter by severity"
                    value={filters.severity}
                    onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                    className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-base-200 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors font-medium outline-none"
                  >
                    <option value="">All Severity</option>
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="w-full bg-secondary text-white px-4 xs:px-6 py-2 xs:py-3 rounded-lg xs:rounded-xl font-bold text-sm xs:text-base shadow-md hover:shadow-lg hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1.5 xs:gap-2 mt-4 xs:mt-6"
                >
                  <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh Filters</span>
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Reports List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-t-4 border-secondary p-4 xs:p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-4 xs:mb-5 sm:mb-6 gap-2 xs:gap-3">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-info flex items-center gap-2 xs:gap-3">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm xs:text-base">📋</div>
                  Available Tasks
                </h2>
                <span className="text-xs xs:text-sm font-bold bg-primary text-white px-2 xs:px-3 py-0.5 xs:py-1 rounded-full">
                  {filteredReports.length} Found
                </span>
              </div>

              {filteredReports.length > 0 ? (
                <div className="space-y-3 xs:space-y-4">
                  {filteredReports.map((report, idx) => (
                    <motion.div
                      key={report._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="p-3 xs:p-4 sm:p-5 bg-base-100 border-2 border-base-200 rounded-lg xs:rounded-xl hover:border-secondary hover:shadow-lg transition-all duration-300 group cursor-pointer hover:bg-base-100">
                        <div className="flex flex-col xs:flex-row items-start justify-between gap-3 xs:gap-4">
                          <div className="flex-1 min-w-0 w-full xs:w-auto">
                            <div className="flex items-center gap-1.5 xs:gap-2 mb-1.5 xs:mb-2 flex-wrap">
                              <h3 className="font-extrabold text-info group-hover:text-secondary transition-colors text-sm xs:text-base sm:text-lg line-clamp-1">
                                {report.title}
                              </h3>
                              <span className={`text-[10px] xs:text-xs px-2 xs:px-3 py-0.5 xs:py-1 rounded-full font-bold border-2 shrink-0 ${getStatusColor(report.status)}`}>
                                {report.status.replace('-', ' ').toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs xs:text-sm text-neutral/70 line-clamp-2 leading-relaxed">
                              {report.description}
                            </p>
                            <div className="flex items-center gap-2 xs:gap-3 mt-2 xs:mt-3 flex-wrap">
                              <span className="text-[10px] xs:text-xs font-bold bg-warning/10 text-warning px-2 xs:px-3 py-0.5 xs:py-1 rounded-full border border-warning/30">
                                📍 {report.location.district}
                              </span>
                              <span className={`text-[10px] xs:text-xs px-2 xs:px-3 py-0.5 xs:py-1 rounded-full font-bold border-2 ${getSeverityColor(report.severity)}`}>
                                {report.severity.toUpperCase()}
                              </span>
                              <span className="text-[10px] xs:text-xs text-neutral/60">
                                {new Date(report.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {report.status === 'pending' && getAvailableSolvers(report).length > 0 && (
                            <button
                              onClick={() => setSelectedReport(report)}
                              className="shrink-0 w-full xs:w-auto bg-primary text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg font-bold text-xs xs:text-sm shadow-md hover:shadow-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300"
                            >
                              Assign →
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 xs:py-12 sm:py-16 bg-base-300 rounded-lg xs:rounded-xl border-2 border-dashed border-base-200">
                  <p className="text-2xl xs:text-3xl mb-2 xs:mb-3">📭</p>
                  <p className="text-info font-bold mb-1.5 xs:mb-2 text-base xs:text-lg">No tasks found</p>
                  <p className="text-xs xs:text-sm text-neutral/70">
                    {authUser?.role === 'authority' && authUser.division
                      ? `No pending tasks in ${authUser.division} with current filters`
                      : 'Try adjusting your filters'}
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Modal for Assignment */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 xs:p-3 sm:p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-base-100 rounded-xl xs:rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-6 lg:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl sm:shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-4 xs:mb-5 sm:mb-6 gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-info mb-1 xs:mb-2">
                    Assign Task
                  </h2>
                  <p className="text-xs xs:text-sm text-neutral/70">
                    Select the best problem solver for this task
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setSelectedSolver('');
                  }}
                  className="text-neutral/50 hover:text-neutral transition shrink-0"
                  title="Close modal"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Task Details Card */}
              <div className="mb-4 xs:mb-5 sm:mb-6 p-3 xs:p-4 sm:p-5 bg-linear-to-br from-primary/5 to-secondary/5 rounded-lg xs:rounded-xl sm:rounded-2xl border-2 border-primary/20">
                <h3 className="font-bold text-info mb-2 xs:mb-3 text-sm xs:text-base">📋 Task Details</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 text-xs xs:text-sm">
                  <div>
                    <p className="text-neutral/60 font-medium">Title</p>
                    <p className="font-bold text-info truncate">{selectedReport.title}</p>
                  </div>
                  <div>
                    <p className="text-neutral/60 font-medium">Problem Type</p>
                    <p className="font-bold text-info truncate">{selectedReport.problemType}</p>
                  </div>
                  <div>
                    <p className="text-neutral/60 font-medium">Severity</p>
                    <span className={`inline-flex items-center px-2 xs:px-3 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-bold border-2 ${getSeverityColor(selectedReport.severity)}`}>
                      {selectedReport.severity.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-neutral/60 font-medium">Location</p>
                    <p className="font-bold text-info truncate">{selectedReport.location.district}</p>
                  </div>
                </div>
                <div className="mt-2 xs:mt-3 pt-2 xs:pt-3 border-t border-primary/20">
                  <p className="text-neutral/60 font-medium mb-0.5 xs:mb-1 text-xs xs:text-sm">Description</p>
                  <p className="text-xs xs:text-sm text-neutral/70">{selectedReport.description}</p>
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-4 xs:mb-5 sm:mb-6">
                <p className="text-xs xs:text-sm font-bold text-neutral/70 mb-2 xs:mb-3 uppercase tracking-wide">Sort By:</p>
                <div className="flex flex-wrap gap-1.5 xs:gap-2">
                  {([
                    { value: 'rating' as SortKey, label: '⭐ Rating' },
                    { value: 'completedTasks' as SortKey, label: '✅ Tasks' },
                    { value: 'successRate' as SortKey, label: '🎯 Success Rate' },
                    { value: 'points' as SortKey, label: '🏆 Points' }
                  ] as { value: SortKey; label: string }[]).map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-lg text-[10px] xs:text-xs sm:text-sm font-bold transition-all transform ${sortBy === option.value
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-base-200 text-neutral hover:bg-base-300 scale-100'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Problem Solvers */}
              <div className="mb-4 xs:mb-5 sm:mb-6">
                <p className="text-xs xs:text-sm font-bold text-neutral/70 mb-2 xs:mb-3 uppercase tracking-wide">
                  Available Problem Solvers ({getAvailableSolvers(selectedReport).length})
                </p>

                {getAvailableSolvers(selectedReport).length === 0 ? (
                  <div className="text-center py-6 xs:py-8 border-2 border-dashed border-base-200 rounded-lg xs:rounded-xl sm:rounded-2xl">
                    <p className="text-2xl xs:text-3xl mb-1.5 xs:mb-2">😕</p>
                    <p className="font-bold text-info text-sm xs:text-base">No solvers available</p>
                    <p className="text-xs xs:text-sm text-neutral/60 mt-0.5 xs:mt-1">
                      No approved problem solvers in {selectedReport.location.division} division
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 xs:space-y-3 max-h-60 xs:max-h-72 sm:max-h-80 overflow-y-auto pr-1 xs:pr-2">
                    {getAvailableSolvers(selectedReport).map((solver, index) => {
                      const rating = solver.taskStats?.rating !== undefined && solver.taskStats.rating !== 'N/A'
                        ? (typeof solver.taskStats.rating === 'string' ? parseFloat(solver.taskStats.rating) : solver.taskStats.rating)
                        : solver.rating || 0;
                      const successRate = solver.taskStats?.successRate
                        ? parseFloat(solver.taskStats.successRate.replace('%', ''))
                        : solver.successRate || 0;
                      const completedTasks = solver.taskStats?.completed ?? solver.completedTasks ?? 0;
                      const points = solver.points || 0;

                      return (
                        <motion.div
                          key={solver._id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedSolver(solver._id)}
                          className={`p-3 xs:p-4 rounded-lg xs:rounded-xl border-2 cursor-pointer transition-all ${selectedSolver === solver._id
                            ? 'border-primary bg-primary/5 ring-2 ring-primary'
                            : 'border-base-200 hover:border-primary/50 bg-base-50'
                            }`}
                        >
                          <div className="flex items-center justify-between gap-2 xs:gap-3 sm:gap-4">
                            <div className="flex items-center gap-2 xs:gap-3 flex-1 min-w-0">
                              {/* Rank Badge */}
                              <div className={`shrink-0 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs xs:text-sm ${index === 0 ? 'bg-yellow-500' :
                                index === 1 ? 'bg-gray-400' :
                                  index === 2 ? 'bg-orange-500' : 'bg-primary'
                                }`}>
                                {index + 1}
                              </div>

                              {/* Avatar */}
                              <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xs xs:text-sm sm:text-lg shrink-0">
                                {solver.name.split(' ').map(n => n[0]).join('')}
                              </div>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-info text-xs xs:text-sm sm:text-base truncate">{solver.name}</p>
                                <p className="text-[10px] xs:text-xs text-neutral/60 truncate">{solver.organization || solver.role}</p>
                                <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 mt-0.5 xs:mt-1 flex-wrap">
                                  <span className="text-[10px] xs:text-xs font-bold text-yellow-600 bg-yellow-50 px-1.5 xs:px-2 py-0.5 rounded">⭐ {rating.toFixed(1)}</span>
                                  <span className="text-[10px] xs:text-xs font-bold text-blue-600 bg-blue-50 px-1.5 xs:px-2 py-0.5 rounded">✅ {completedTasks}</span>
                                  <span className="text-[10px] xs:text-xs font-bold text-green-600 bg-green-50 px-1.5 xs:px-2 py-0.5 rounded hidden xs:inline">🎯 {successRate}%</span>
                                  <span className="text-[10px] xs:text-xs font-bold text-purple-600 bg-purple-50 px-1.5 xs:px-2 py-0.5 rounded hidden sm:inline">🏆 {points}</span>
                                </div>
                              </div>
                            </div>

                            {/* Selection Indicator */}
                            <div className={`shrink-0 w-5 h-5 xs:w-6 xs:h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedSolver === solver._id
                              ? 'bg-primary border-primary'
                              : 'border-base-300'
                              }`}>
                              {selectedSolver === solver._id && (
                                <svg className="w-3 h-3 xs:w-4 xs:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col xs:flex-row justify-end gap-2 xs:gap-3 pt-4 xs:pt-5 sm:pt-6 border-t border-base-200">
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setSelectedSolver('');
                  }}
                  className="px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 text-info font-bold text-sm xs:text-base rounded-lg xs:rounded-xl hover:bg-base-200 transition-all"
                  disabled={assigning}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!selectedSolver) {
                      toast.error('Please select a problem solver');
                      return;
                    }
                    if (!selectedReport) {
                      toast.error('No report selected');
                      return;
                    }
                    const solver = getAvailableSolvers(selectedReport).find(s => s._id === selectedSolver);
                    if (solver) {
                      assignTask(selectedReport._id, selectedSolver);
                    }
                  }}
                  disabled={!selectedSolver || assigning || getAvailableSolvers(selectedReport).length === 0}
                  className={`px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 text-white font-bold text-sm xs:text-base rounded-lg xs:rounded-xl transition-all flex items-center justify-center gap-1.5 xs:gap-2 ${assigning
                    ? 'bg-primary/50 cursor-not-allowed'
                    : 'bg-primary hover:shadow-lg transform hover:scale-105 hover:bg-primary/90'
                    }`}
                >
                  {assigning ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 xs:h-4 xs:w-4 border-b-2 border-white"></div>
                      <span>Assigning...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="hidden xs:inline">Confirm Assignment</span>
                      <span className="xs:hidden">Confirm</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </>
  );
};

export default AssignTaskPage;