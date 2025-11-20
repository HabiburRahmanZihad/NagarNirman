'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
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

interface AnalyticsData {
  totalReports: number;
  completedReports: number;
  ongoingReports: number;
  pendingReports: number;
  averageResolutionTime: number;
  completionRate: number;
  categoryStats: Array<{ category: string; count: number }>;
  statusStats: Array<{ status: string; count: number; color: string }>;
  monthlyStats: Array<{ month: string; reports: number; resolved: number; pending: number }>;
  districtStats: Array<{ district: string; division: string; total: number; pending: number; resolved: number; ongoing: number }>;
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

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="animate-pulse mb-8">
        <div className="h-12 bg-gray-200 rounded-xl w-64 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>
      
      <div className="bg-white/80 rounded-2xl p-6 mb-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-40 ml-auto"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative overflow-hidden bg-white/80 rounded-2xl p-6 h-32 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full"></div>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/80 rounded-2xl p-6 h-80 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>

      <div className="bg-white/80 rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
        </div>
      </div>
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

  // Check if user has access to statistics page (only NGO and Problem Solver)
  useEffect(() => {
    if (user && user.role !== 'ngo' && user.role !== 'problemSolver') {
      toast.error('Access denied. Statistics are only available for NGO and Problem Solvers.');
      router.push(`/dashboard/${user.role === 'authority' ? 'authority' : 'user'}`);
    }
  }, [user, router]);

  // Calculate date range based on timeRange
  const getDateRange = () => {
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
  };

  const loadAnalytics = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Build filters
      const { startDate, endDate } = getDateRange();
      const filters: any = { startDate, endDate };

      // Add division filter - use user's division if not 'all'
      if (divisionFilter !== 'all') {
        filters.division = divisionFilter;
      } else if (user?.division) {
        filters.division = user.division;
      }

      const data = await statisticsAPI.getAnalytics(filters);
      
      // Validate data exists
      if (!data) {
        throw new Error('No data received from API');
      }
      
      // Transform data to match component expectations with null checks
      const transformedData = {
        ...data,
        // Add percentages to category stats
        categoryStats: (data.categoryStats || []).map((cat: any) => ({
          ...cat,
          percentage: data.totalReports > 0 ? (cat.count / data.totalReports) * 100 : 0
        })),
        // Add percentages to status stats
        statusStats: (data.statusStats || []).map((stat: any) => ({
          ...stat,
          percentage: data.totalReports > 0 ? (stat.count / data.totalReports) * 100 : 0
        })),
        // Rename fields for monthly stats to match component
        monthlyStats: (data.monthlyStats || []).map((stat: any) => ({
          month: stat.month,
          reports: stat.reports,
          completed: stat.resolved, // Rename resolved to completed
          pending: stat.pending
        })),
        // Transform district stats to match component
        districtStats: (data.districtStats || []).map((stat: any) => ({
          district: stat.district,
          division: stat.division,
          reports: stat.total, // Rename total to reports
          pending: stat.pending,
          completed: stat.resolved, // Rename resolved to completed
          ongoing: stat.ongoing
        })),
        // Ensure solver performance exists
        solverPerformance: data.solverPerformance || []
      };
      
      setAnalyticsData(transformedData as any);
      setLastUpdated(new Date());
      if (showRefresh) {
        toast.success('Data refreshed successfully!');
      }
    } catch (error: any) {
      console.error('Failed to load analytics:', error);
      toast.error(error.message || 'Failed to load analytics data');
      
      // Redirect to login if unauthorized
      if (error.message === 'Not authorized, token failed' || error.message === 'Not authorized, no token') {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, timeRange, divisionFilter]);

  const handleRefresh = () => {
    loadAnalytics(true);
  };

  const handleExport = (filters: any) => {
    console.log('Exporting with filters:', filters);
    toast.success('Export functionality coming soon!');
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Failed to load analytics data</div>
          <button
            onClick={() => loadAnalytics()}
            className="px-6 py-3 bg-[#2a7d2f] text-white rounded-xl font-medium shadow-lg hover:bg-[#3a9d40] transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 p-6">
      <div className="max-w-7xl mx-auto">
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="mb-8"
>
  <div className="flex items-center justify-between">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-gradient-to-r from-[#f2a921] to-[#2a7d2f] rounded-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1f2937] via-[#f2a921] to-[#2a7d2f] bg-clip-text text-transparent">
          Performance Analytics
        </h1>
      </div>
      <p className="text-gray-600 text-lg">
        Comprehensive insights and real-time performance metrics
      </p>
    </div>
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20"
    >
      <div className="text-right">
        <div className="text-2xl font-bold bg-gradient-to-r from-[#f2a921] to-[#2a7d2f] bg-clip-text text-transparent">
          Live Dashboard
        </div>
        <div className="flex items-center gap-2 justify-end">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </motion.div>
  </div>
</motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">Filters:</h3>
              
              <div className="flex bg-gray-100 rounded-xl p-1">
                {[
                  { value: '1month', label: '1 Month' },
                  { value: '3months', label: '3 Months' },
                  { value: '6months', label: '6 Months' },
                  { value: '1year', label: '1 Year' }
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      timeRange === range.value
                        ? 'bg-[#2a7d2f] text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <select
                value={divisionFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#2a7d2f] focus:border-transparent"
              >
                <option value="all">
                  {user?.division ? `My Division (${user.division})` : 'All Divisions'}
                </option>
                {Object.keys(divisionsData).map((division) => (
                  <option key={division} value={division}>
                    {division.charAt(0).toUpperCase() + division.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-[#2a7d2f] text-white rounded-xl font-medium shadow-lg hover:bg-[#3a9d40] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <AnalyticsKPI
          totalReports={analyticsData.totalReports}
          completedReports={analyticsData.completedReports}
          ongoingReports={analyticsData.ongoingReports}
          averageResolutionTime={analyticsData.averageResolutionTime}
          completionRate={analyticsData.completionRate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CategoryPieChart data={analyticsData.categoryStats} />
          <StatusBarChart data={analyticsData.statusStats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendLineChart data={analyticsData.monthlyStats} />
          <DivisionDistrictChart data={analyticsData.districtStats} />
        </div>

        <ReportExportPanel onExport={handleExport} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Problem Solver Performance
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Top Performers
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 font-medium text-gray-900">Solver</th>
                  <th className="text-left py-4 font-medium text-gray-900">Completed Tasks</th>
                  <th className="text-left py-4 font-medium text-gray-900">Success Rate</th>
                  <th className="text-left py-4 font-medium text-gray-900">Avg. Resolution Time</th>
                  <th className="text-left py-4 font-medium text-gray-900">Rating</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.solverPerformance && analyticsData.solverPerformance.length > 0 ? (
                  analyticsData.solverPerformance.map((solver, index) => (
                    <motion.tr
                      key={solver.solverId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-white/50 transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#2a7d2f] to-[#3a9d40] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {solver.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{solver.name}</div>
                            {solver.organization && (
                              <div className="text-xs text-gray-500">{solver.organization}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <span className="text-gray-900 font-semibold">{solver.completedTasks}</span>
                          <span className="text-gray-500 text-sm"> / {solver.totalTasks}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-[#2a7d2f] to-[#3a9d40]"
                              style={{ width: `${solver.successRate}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-900 font-medium min-w-12">{solver.successRate.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-gray-900 font-medium">{solver.avgResolutionTime.toFixed(1)}h</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-lg ${
                                  star <= Math.floor(solver.rating)
                                    ? 'text-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-900 font-bold">{solver.rating.toFixed(1)}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No solver performance data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;