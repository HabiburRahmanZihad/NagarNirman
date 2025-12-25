'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { statisticsAPI } from '@/utils/api';
import divisionsData from '@/data/divisionsData.json';
import toast from 'react-hot-toast';
import AnalyticsKPI from '@/components/admin/analytics/AnalyticsKPI';
import CategoryPieChart from '@/components/admin/analytics/CategoryPieChart';
import StatusBarChart from '@/components/admin/analytics/StatusBarChart';
import TrendLineChart from '@/components/admin/analytics/TrendLineChart';
import DivisionDistrictChart from '@/components/admin/analytics/DivisionDistrictChart';
import ReportExportPanel from '@/components/admin/analytics/ReportExportPanel';
import { ExportFilters } from '@/components/admin/analytics/types';

interface AnalyticsData {
  totalReports: number;
  completedReports: number;
  ongoingReports: number;
  pendingReports: number;
  averageResolutionTime: number;
  completionRate: number;
  categoryStats: Array<{ category: string; count: number; percentage: number }>;
  statusStats: Array<{ status: string; count: number; color: string; percentage: number }>;
  monthlyStats: Array<{ month: string; reports: number; completed: number; pending: number }>;
  districtStats: Array<{ district: string; division: string; reports: number; pending: number; completed: number; ongoing: number }>;
  solverPerformance: Array<{
    solverId: string;
    name: string;
    completedTasks: number;
    totalTasks: number;
    successRate: number;
    avgResolutionTime: number;
    rating: number;
    organization?: string;
  }>;
  lastUpdated: string;
}

interface CategoryStatRaw {
  category?: string;
  count?: number;
}

interface StatusStatRaw {
  status?: string;
  count?: number;
  color?: string;
}

interface MonthlyStatRaw {
  month?: string;
  reports?: number;
  resolved?: number;
  completed?: number;
  pending?: number;
}

interface DistrictStatRaw {
  district?: string;
  division?: string;
  total?: number;
  reports?: number;
  pending?: number;
  resolved?: number;
  completed?: number;
  ongoing?: number;
}

interface SolverPerformanceRaw {
  solverId?: string;
  name?: string;
  completedTasks?: number;
  totalTasks?: number;
  successRate?: number;
  avgResolutionTime?: number;
  rating?: number;
  organization?: string;
}

interface AnalyticsFilters {
  startDate: string;
  endDate: string;
  division?: string;
}

// Raw API response shape (used for type-safe transformation)
interface AnalyticsApiRaw {
  totalReports?: number;
  completedReports?: number;
  ongoingReports?: number;
  pendingReports?: number;
  averageResolutionTime?: number;
  completionRate?: number;
  categoryStats?: CategoryStatRaw[];
  statusStats?: StatusStatRaw[];
  monthlyStats?: MonthlyStatRaw[];
  districtStats?: DistrictStatRaw[];
  solverPerformance?: SolverPerformanceRaw[];
  lastUpdated?: string;
  [key: string]: unknown;
}

const SkeletonLoader = () => (
  <motion.div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-white/20 mb-6">
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-linear-to-r from-gray-200 to-gray-100 rounded-lg w-48"></div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 bg-linear-to-r from-gray-100 to-gray-50 rounded w-full"></div>
        ))}
      </div>
    </div>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-linear-to-br from-gray-50 via-green-50/20 to-gray-50 p-3 xs:p-4 md:p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.5 }}
        className="mb-6 xs:mb-8 animate-pulse"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 xs:w-10 xs:h-10 bg-gray-200 rounded-lg"></div>
          <div className="h-8 xs:h-10 bg-gray-200 rounded-lg w-48 xs:w-64"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-72 xs:w-96"></div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div className="bg-white/80 rounded-xl xs:rounded-2xl p-4 xs:p-6 mb-6 xs:mb-8 animate-pulse border border-gray-100">
        <div className="flex gap-2 xs:gap-4 flex-wrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 xs:h-10 bg-gray-200 rounded-lg w-16 xs:w-24"></div>
          ))}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8">
        {[...Array(4)].map((_, i) => (
          <SkeletonLoader key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6 mb-6 xs:mb-8">
        {[...Array(2)].map((_, i) => (
          <SkeletonLoader key={i} />
        ))}
      </div>

      {/* Performance Table */}
      <SkeletonLoader />
    </div>
  </div>
);

const AnalyticsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('3months');
  const [divisionFilter, setDivisionFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Check if user has access to statistics page (NGO, Problem Solver, and SuperAdmin)
  useEffect(() => {
    if (user && user.role !== 'problemSolver' && user.role !== 'superAdmin') {
      toast.error('Access denied. Statistics are only available for Problem Solvers and SuperAdmin.');
      router.push(`/dashboard/${user.role === 'authority' ? 'authority' : 'user'}`);
    }
  }, [user, router]);

  // Calculate date range based on timeRange
  const getDateRange = useCallback(() => {
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 3);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  }, [timeRange]);

  const loadAnalytics = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Build filters
      const { startDate, endDate } = getDateRange();
      const filters: AnalyticsFilters = { startDate, endDate };

      // Add division filter - use user's division if not 'all'
      if (divisionFilter !== 'all') {
        filters.division = divisionFilter;
      } else if (user?.division) {
        filters.division = user.division;
      }

      // console.log('📊 Fetching analytics with filters:', filters);
      const data = (await statisticsAPI.getAnalytics(filters)) as AnalyticsApiRaw;

      // Validate data exists
      if (!data) {
        throw new Error('No data received from API. The backend may not have data for the selected filters.');
      }

      // console.log('✅ Raw API response:', data);

      // Transform data to match component expectations with null checks
      // Normalize numeric values and use nullish coalescing to preserve zeroes
      const totalReports = Number(data?.totalReports ?? 0);
      const completedReports = Number(data?.completedReports ?? 0);
      const ongoingReports = Number(data?.ongoingReports ?? 0);
      const pendingReports = Number(data?.pendingReports ?? 0);
      const averageResolutionTime = Number(data?.averageResolutionTime ?? 0);
      const completionRate = Number(data?.completionRate ?? 0);
      const lastUpdated = typeof data?.lastUpdated === 'string' ? data.lastUpdated : new Date().toISOString();

      const transformedData: AnalyticsData = {
        totalReports,
        completedReports,
        ongoingReports,
        pendingReports,
        averageResolutionTime,
        completionRate,
        lastUpdated,
        // Add percentages to category stats
        categoryStats: (data?.categoryStats ?? []).map((cat: CategoryStatRaw) => ({
          category: cat?.category ?? 'Unknown',
          count: Number(cat?.count ?? 0),
          percentage: totalReports > 0 ? (Number(cat?.count ?? 0) / totalReports) * 100 : 0
        })),
        // Add percentages to status stats
        statusStats: (data?.statusStats ?? []).map((stat: StatusStatRaw) => ({
          status: stat?.status ?? 'Unknown',
          count: Number(stat?.count ?? 0),
          color: stat?.color ?? '#808080',
          percentage: totalReports > 0 ? (Number(stat?.count ?? 0) / totalReports) * 100 : 0
        })),
        // Rename fields for monthly stats to match component
        monthlyStats: (data?.monthlyStats ?? []).map((stat: MonthlyStatRaw) => ({
          month: stat?.month ?? 'N/A',
          reports: Number(stat?.reports ?? 0),
          completed: Number(stat?.resolved ?? stat?.completed ?? 0),
          pending: Number(stat?.pending ?? 0)
        })),
        // Transform district stats to match component
        districtStats: (data?.districtStats ?? []).map((stat: DistrictStatRaw) => ({
          district: stat?.district ?? 'Unknown',
          division: stat?.division ?? 'Unknown',
          reports: Number(stat?.total ?? stat?.reports ?? 0),
          pending: Number(stat?.pending ?? 0),
          completed: Number(stat?.resolved ?? stat?.completed ?? 0),
          ongoing: Number(stat?.ongoing ?? 0)
        })),
        // Ensure solver performance exists
        solverPerformance: (data?.solverPerformance ?? []).map((solver: SolverPerformanceRaw) => ({
          solverId: solver?.solverId ?? '',
          name: solver?.name ?? 'Unknown',
          completedTasks: Number(solver?.completedTasks ?? 0),
          totalTasks: Number(solver?.totalTasks ?? solver?.completedTasks ?? 0),
          successRate: Math.min(100, Math.max(0, Number(solver?.successRate ?? 0))),
          avgResolutionTime: Number(solver?.avgResolutionTime ?? 0),
          rating: Number(solver?.rating ?? 0),
          organization: solver?.organization
        }))
      };

      // console.log('✅ Transformed data:', transformedData);
      setAnalyticsData(transformedData);
      setLastUpdated(new Date());

      if (showRefresh) {
        toast.success('📈 Data refreshed successfully!', {
          icon: '🔄',
          duration: 2000
        });
      }
    } catch (err: unknown) {
      console.error('❌ Failed to load analytics:', err);

      // Type-safe error handling
      const error = err as { message?: string; status?: number; data?: { message?: string }; stack?: string };

      // Detailed error logging for debugging
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        data: error.data,
        stack: error.stack
      });

      const errorMessage = error.data?.message || error.message || 'Failed to load analytics data';
      toast.error(errorMessage, {
        icon: '❌',
        duration: 3000
      });

      // Redirect to login if unauthorized
      if (error.message?.includes('Not authorized') || error.status === 401) {
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getDateRange, divisionFilter, user?.division, router]);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, timeRange, divisionFilter, loadAnalytics]);

  const handleRefresh = () => {
    loadAnalytics(true);
  };

  const handleExport = () => {
    // console.log('Exporting with filters:', filters);
    toast.success('Export functionality coming soon!');
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-green-50/20 to-gray-50 p-3 xs:p-4 md:p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl xs:rounded-2xl shadow-lg border border-white/20 p-4 xs:p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-3 xs:mb-4">
              <AlertCircle className="w-10 h-10 xs:w-12 xs:h-12 text-amber-500" />
            </div>
            <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
            <p className="text-sm xs:text-base text-gray-600 mb-4 xs:mb-6">
              Unable to load analytics data. This could mean:
            </p>
            <ul className="text-left text-xs xs:text-sm text-gray-600 mb-4 xs:mb-6 space-y-1.5 xs:space-y-2">
              <li>• No reports have been created yet</li>
              <li>• You don&apos;t have permission to view this data</li>
              <li>• The backend service is experiencing issues</li>
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => loadAnalytics()}
              className="w-full px-4 py-3 bg-[#2a7d2f] text-white rounded-xl font-medium shadow-lg hover:bg-[#3a9d40] transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-green-50/10 to-gray-50 p-3 xs:p-4 md:p-6">
      <div className="container mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 xs:mb-8 border-b pb-4 bg-white rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-3 xs:py-4 border-accent/80"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 xs:gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 xs:gap-3 mb-2 xs:mb-3">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002E2E] mb-1 xs:mb-2">
                  Performance Analytics
                </h1>
              </div>
              <p className="text-[#6B7280] text-sm xs:text-base sm:text-lg">
                <span>Comprehensive insights and real-time performance metrics</span>
              </p>
            </div>

            {/* Live Status Badge */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 shadow-lg border border-white/20 self-end md:self-start"
            >
              <div className="text-right">
                <div className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-accent">
                  Live Dashboard
                </div>
                <div className="flex items-center gap-2 justify-end mt-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  ></motion.div>
                  <span className="text-xs md:text-sm text-gray-600">
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl xs:rounded-2xl shadow-lg border border-white/20 p-3 xs:p-4 sm:p-5 md:p-6 mb-6 xs:mb-8"
        >
          <div className="flex flex-col gap-3 xs:gap-4">
            <div className="flex items-center gap-2 xs:gap-3">
              <Filter className="w-4 h-4 xs:w-5 xs:h-5 text-[#2a7d2f]" />
              <h3 className="text-sm xs:text-base md:text-lg font-semibold text-gray-900">Filters</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 flex-wrap">
              {/* Time Range Buttons */}
              <div className="flex bg-gray-100 rounded-lg xs:rounded-xl p-0.5 xs:p-1 overflow-x-auto">
                {[
                  { value: '1month', label: '1M', fullLabel: '1 Month' },
                  { value: '3months', label: '3M', fullLabel: '3 Months' },
                  { value: '6months', label: '6M', fullLabel: '6 Months' },
                  { value: '1year', label: '1Y', fullLabel: '1 Year' }
                ].map((range) => (
                  <motion.button
                    key={range.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-2 xs:px-3 md:px-4 py-1.5 xs:py-2 rounded-md xs:rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${timeRange === range.value
                      ? 'bg-linear-to-r from-[#2a7d2f] to-[#3a9d40] text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    title={range.fullLabel}
                  >
                    <span className="hidden sm:inline">{range.fullLabel}</span>
                    <span className="sm:hidden">{range.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Division Filter */}
              <motion.select
                aria-label="Filter by division"
                value={divisionFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
                whileHover={{ scale: 1.02 }}
                className="bg-white border-2 border-gray-200 rounded-lg xs:rounded-xl px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-medium focus:ring-2 focus:ring-[#2a7d2f] focus:border-transparent transition-all hover:border-[#2a7d2f]"
              >
                <option value="all">
                  {user?.division ? `My Division (${user.division})` : 'All Divisions'}
                </option>
                {(Array.isArray(divisionsData)
                  ? divisionsData.map((d: { division: string }) => d.division)
                  : Object.keys(divisionsData)
                )
                  .filter((division: string) => division && division !== user?.division)
                  .map((division: string) => (
                    <option key={division} value={division}>
                      {division.charAt(0).toUpperCase() + division.slice(1)}
                    </option>
                  ))}
              </motion.select>

              {/* Refresh Button */}
              <div className="sm:ml-auto flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-1.5 xs:py-2 bg-linear-to-r from-[#2a7d2f] to-[#3a9d40] text-white rounded-lg xs:rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs xs:text-sm md:text-base"
                >
                  <RefreshCw className={`w-3.5 h-3.5 xs:w-4 xs:h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden xs:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                  <span className="xs:hidden">{refreshing ? '...' : 'Refresh'}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <AnalyticsKPI
            totalReports={analyticsData.totalReports}
            completedReports={analyticsData.completedReports}
            ongoingReports={analyticsData.ongoingReports}
            averageResolutionTime={analyticsData.averageResolutionTime}
            completionRate={analyticsData.completionRate}
          />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 mb-6 xs:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CategoryPieChart data={analyticsData.categoryStats} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <StatusBarChart data={analyticsData.statusStats} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 mb-6 xs:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TrendLineChart data={analyticsData.monthlyStats} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <DivisionDistrictChart data={analyticsData.districtStats} />
          </motion.div>
        </div>

        {/* Export Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ReportExportPanel onExport={handleExport} />
        </motion.div>

        {/* Performance Cards Grid - Matching Reports UI */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-6 xs:mt-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 xs:mb-6 sm:mb-8 gap-2 xs:gap-3">
            <div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#002E2E] mb-1 xs:mb-2 flex items-center gap-2 flex-wrap">
                Problem Solver <span className="text-primary">Performance</span>
              </h2>
              <p className="text-[#6B7280] text-sm xs:text-base sm:text-lg">
                Top performers ranked by completion rate and success metrics
              </p>
            </div>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-[10px] xs:text-xs md:text-sm text-gray-600 bg-linear-to-r from-[#f2a921]/10 to-[#2a7d2f]/10 px-2 xs:px-3 sm:px-4 py-1 xs:py-2 rounded-full border border-[#2a7d2f]/20 font-medium"
            >
              🏆 Top Performers
            </motion.span>
          </div>

          {analyticsData.solverPerformance && analyticsData.solverPerformance.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xs:gap-5 sm:gap-6">
              {analyticsData.solverPerformance.map((solver, index) => (
                <motion.div
                  key={solver.solverId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  className="group h-full bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform cursor-default border border-gray-100 overflow-hidden"
                >
                  {/* Top Bar with Performance Score */}
                  <div className="relative h-24 bg-linear-to-br from-[#F6FFF9] to-[#E8F5E9] overflow-hidden p-4">
                    <div className="flex items-start justify-between h-full">
                      <div>
                        <div className="text-3xl font-bold text-primary">
                          {solver.successRate.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Success Rate</div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 bg-linear-to-br from-[#2a7d2f] to-[#3a9d40] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                      >
                        {solver.name.charAt(0).toUpperCase()}
                      </motion.div>
                    </div>

                    {/* Performance Badge */}
                    {solver.successRate >= 85 && (
                      <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        ⭐ Top Performer
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    {/* Name and Organization */}
                    <h3 className="font-bold text-[#002E2E] line-clamp-1 group-hover:text-primary transition mb-1 text-lg">
                      {solver.name}
                    </h3>
                    {solver.organization && (
                      <p className="text-[#6B7280] text-xs line-clamp-1 mb-4 font-medium">
                        {solver.organization}
                      </p>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                        <div className="text-xs text-gray-600 font-medium">Completed</div>
                        <div className="text-2xl font-bold text-primary mt-1">
                          {solver.completedTasks}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          of {solver.totalTasks}
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <div className="text-xs text-gray-600 font-medium">Avg. Time</div>
                        <div className="text-2xl font-bold text-blue-600 mt-1">
                          {solver.avgResolutionTime.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">hours</div>
                      </div>
                    </div>

                    {/* Success Rate Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">Completion Progress</span>
                        <span className="text-xs font-bold text-primary">
                          {((solver.completedTasks / solver.totalTasks) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${((solver.completedTasks / solver.totalTasks) * 100)}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-2 rounded-full bg-linear-to-r from-[#2a7d2f] to-[#3a9d40]"
                        />
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="inline-block bg-primary bg-opacity-10 text-[#002E2E] px-3 py-1 rounded-full text-xs font-semibold">
                      {solver.successRate >= 90
                        ? '⭐⭐⭐⭐⭐'
                        : solver.successRate >= 80
                          ? '⭐⭐⭐⭐'
                          : solver.successRate >= 70
                            ? '⭐⭐⭐'
                            : '⭐⭐'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 xs:py-12 sm:py-16 bg-white rounded-xl xs:rounded-2xl border border-gray-100">
              <div className="text-5xl xs:text-6xl sm:text-8xl mb-4 xs:mb-6 opacity-50">📊</div>
              <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#002E2E] mb-2 xs:mb-4">No Performance Data</h3>
              <p className="text-[#6B7280] text-sm xs:text-base sm:text-lg px-4">
                Performance metrics will appear once problem solvers complete their first tasks.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;