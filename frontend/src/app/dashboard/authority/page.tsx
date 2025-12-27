'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/common/Card';
import { FullPageLoading } from '@/components/common';
import { reportAPI, problemSolverAPI, taskAPI } from '@/utils/api';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ListTodo,
  AlertCircle,
  Activity,
  FileText,
  Users,
  ClipboardCheck,
} from 'lucide-react';

interface Stats {
  totalReports: number;
  pendingReports: number;
  inProgressReports: number;
  resolvedReports: number;
  pendingApplications: number;
  pendingReviewTasks: number;
  totalTasks: number;
  completedTasks: number;
  rejectedTasks: number;
}

interface Report {
  _id: string;
  title: string;
  description: string;
  status: string;
  severity?: string;
  location?: {
    district: string;
    division: string;
  };
  createdAt: string;
}

interface Task {
  _id: string;
  status: string;
}

// Define API response types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export default function AuthorityDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalReports: 0,
    pendingReports: 0,
    inProgressReports: 0,
    resolvedReports: 0,
    pendingApplications: 0,
    pendingReviewTasks: 0,
    totalTasks: 0,
    completedTasks: 0,
    rejectedTasks: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [recentReports, setRecentReports] = useState<Report[]>([]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'authority')) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoadingStats(true);

      // Fetch all reports
      const reportsResponse = await reportAPI.getAll();
      // Type assertion for the response
      const reportsApiResponse = reportsResponse as ApiResponse<Report[]>;
      if (reportsApiResponse.success && reportsApiResponse.data) {
        const reports = reportsApiResponse.data;
        setRecentReports(reports.slice(0, 5));

        setStats(prev => ({
          ...prev,
          totalReports: reports.length,
          pendingReports: reports.filter((r: Report) => r.status === 'pending').length,
          inProgressReports: reports.filter((r: Report) => r.status === 'in_progress' || r.status === 'in-progress').length,
          resolvedReports: reports.filter((r: Report) => r.status === 'resolved').length,
        }));
      }

      // Fetch applications from authority's division only
      if (user?.division) {
        const applicationsResponse = await problemSolverAPI.getAllApplications({
          status: 'pending',
          division: user.division // Filter by authority's division
        });
        // Type assertion for the response — treat payload as unknown[] and guard at runtime
        const applicationsApiResponse = applicationsResponse as ApiResponse<unknown[]>;
        if (applicationsApiResponse.success && applicationsApiResponse.data) {
          const applications = Array.isArray(applicationsApiResponse.data) ? applicationsApiResponse.data : [];
          setStats(prev => ({
            ...prev,
            pendingApplications: applications.length,
          }));
        }
      }

      // Fetch pending review tasks from authority's division (based on report division)
      if (user?.division) {
        const tasksResponse = await taskAPI.getPendingReview({ division: user.division });
        // Type assertion for the response — treat payload as unknown[] and guard at runtime
        const tasksApiResponse = tasksResponse as ApiResponse<unknown[]>;
        if (tasksApiResponse.success && tasksApiResponse.data) {
          const pendingTasks = Array.isArray(tasksApiResponse.data) ? tasksApiResponse.data : [];
          setStats(prev => ({
            ...prev,
            pendingReviewTasks: pendingTasks.length,
          }));
        }
      }

      // Fetch all tasks for additional stats
      const allTasksResponse = await taskAPI.getAll();
      // Type assertion for the response
      const allTasksApiResponse = allTasksResponse as ApiResponse<Task[]>;
      if (allTasksApiResponse.success && allTasksApiResponse.data) {
        const allTasks = allTasksApiResponse.data;
        setStats(prev => ({
          ...prev,
          totalTasks: allTasks.length,
          completedTasks: allTasks.filter((t: Task) => t.status === 'completed' || t.status === 'verified').length,
          rejectedTasks: allTasks.filter((t: Task) => t.status === 'rejected').length,
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingStats(false);
    }
  }, [user?.division]);

  useEffect(() => {
    if (user?.role === 'authority') {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  if (isLoading || !user) {
    return <FullPageLoading text="Loading Your Dashboard..." />;
  }

  const getReportStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-blue-100 text-blue-700 border-blue-200',
      'in_progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'in-progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      resolved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const statsCards = [
    {
      title: 'Total Reports',
      value: stats.totalReports,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'All reports submitted',
    },
    {
      title: 'Pending Reports',
      value: stats.pendingReports,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Awaiting assignment',
    },
    {
      title: 'In Progress',
      value: stats.inProgressReports,
      icon: Activity,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      description: 'Being actively resolved',
    },
    {
      title: 'Resolved',
      value: stats.resolvedReports,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Successfully completed',
    },
    {
      title: 'Tasks to Review',
      value: stats.pendingReviewTasks,
      icon: ClipboardCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Pending approval',
    },
    {
      title: 'Applications',
      value: stats.pendingApplications,
      icon: Users,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      description: 'Awaiting review',
    },
  ];

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
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-white/90 text-xs xs:text-sm sm:text-lg font-semibold">
            Manage reports, assign tasks, and oversee problem solver work across your division.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className={`${stat.bgColor} rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 lg:p-8 border-2 border-accent/20 shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1`}>
                  <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
                    <span className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl group-hover:scale-110 transition-transform duration-300">
                      {loadingStats ? <span className="animate-pulse">...</span> : <IconComponent className={`w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${stat.color}`} />}
                    </span>
                    <span className={`text-lg xs:text-xl sm:text-2xl lg:text-4xl font-extrabold ${stat.color}`}>
                      {loadingStats ? <span className="animate-pulse">...</span> : stat.value}
                    </span>
                  </div>
                  <h3 className="text-[10px] xs:text-xs sm:text-sm font-bold uppercase tracking-wide sm:tracking-widest text-neutral/70">
                    {stat.title}
                  </h3>
                  <p className="text-[10px] xs:text-xs text-neutral/60 mt-0.5 xs:mt-1 hidden xs:block">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
          {/* Quick Actions Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-t-4 border-secondary p-4 xs:p-5 sm:p-6 lg:p-8 h-fit">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-info mb-3 xs:mb-4 sm:mb-6 flex items-center gap-2 xs:gap-3">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xs xs:text-sm">⚡</div>
                Quick Actions
              </h2>
              <div className="flex flex-col gap-1.5 xs:gap-2">
                <Link href="/dashboard/authority/all-reports">
                  <button className="w-full bg-primary text-white px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1.5 xs:gap-2 text-xs xs:text-sm sm:text-base">
                    <FileText className="w-4 h-4 xs:w-5 xs:h-5" /> All Reports
                  </button>
                </Link>
                <Link href="/dashboard/authority/assign-task">
                  <button className="w-full bg-secondary text-white px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1.5 xs:gap-2 text-xs xs:text-sm sm:text-base">
                    <ListTodo className="w-4 h-4 xs:w-5 xs:h-5" /> Assign Tasks
                  </button>
                </Link>
                <Link href="/dashboard/authority/review-tasks">
                  <button className="w-full bg-accent text-info px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-accent/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1.5 xs:gap-2 text-xs xs:text-sm sm:text-base">
                    <ClipboardCheck className="w-4 h-4 xs:w-5 xs:h-5" /> Review Tasks
                  </button>
                </Link>
                <Link href="/dashboard/authority/applications">
                  <button className="w-full bg-primary text-white px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1.5 xs:gap-2 text-xs xs:text-sm sm:text-base">
                    <Users className="w-4 h-4 xs:w-5 xs:h-5" /> Applications
                  </button>
                </Link>
              </div>
            </Card>

            {/* Alert Card */}
            {(stats.pendingReviewTasks > 0 || stats.pendingApplications > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="mt-3 xs:mt-4 sm:mt-6 rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-t-4 border-accent p-4 xs:p-5 sm:p-6 lg:p-8 bg-accent/5">
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-info mb-3 xs:mb-4 sm:mb-6 flex items-center gap-2 xs:gap-3">
                    <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center text-info font-bold text-xs xs:text-sm">🔔</div>
                    Pending Actions
                  </h3>
                  <div className="space-y-2 xs:space-y-3">
                    {stats.pendingReviewTasks > 0 && (
                      <Link href="/dashboard/authority/review-tasks">
                        <div className="p-2.5 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 transition cursor-pointer">
                          <div className="text-sm xs:text-base sm:text-lg font-bold text-purple-700">{stats.pendingReviewTasks} Tasks</div>
                          <p className="text-xs xs:text-sm text-purple-600">Awaiting your review</p>
                        </div>
                      </Link>
                    )}
                    {stats.pendingApplications > 0 && (
                      <Link href="/dashboard/authority/applications">
                        <div className="p-2.5 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition cursor-pointer">
                          <div className="text-sm xs:text-base sm:text-lg font-bold text-blue-700">{stats.pendingApplications} Applications</div>
                          <p className="text-xs xs:text-sm text-blue-600">Requiring approval</p>
                        </div>
                      </Link>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Recent Reports */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-t-4 border-secondary p-4 xs:p-5 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-3 xs:mb-4 sm:mb-6">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-info flex items-center gap-2 xs:gap-3">
                  <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xs xs:text-sm">📋</div>
                  <span className="hidden xs:inline">Recent Reports</span>
                  <span className="xs:hidden">Reports</span>
                </h2>
                <Link href="/dashboard/authority/all-reports">
                  <button className="bg-secondary text-white px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 rounded-md xs:rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300 text-xs xs:text-sm">
                    View All →
                  </button>
                </Link>
              </div>

              {loadingStats ? (
                <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 xs:h-18 sm:h-20 bg-base-200 rounded-lg xs:rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : recentReports.length > 0 ? (
                <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                  {recentReports.map((report, idx) => (
                    <motion.div
                      key={report._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link href={`/reports/${report._id}`}>
                        <div className="p-3 xs:p-4 sm:p-5 bg-base-100 border-2 border-base-200 rounded-lg xs:rounded-xl hover:border-secondary hover:shadow-lg transition-all duration-300 group cursor-pointer hover:bg-base-100">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5 xs:gap-2 mb-1.5 xs:mb-2 flex-wrap">
                                <h3 className="font-extrabold text-info mb-1 xs:mb-2 group-hover:text-secondary transition-colors text-sm xs:text-base sm:text-lg line-clamp-1">
                                  {report.title}
                                </h3>
                                <span className={`text-[10px] xs:text-xs px-2 xs:px-3 py-0.5 xs:py-1 rounded-full font-bold border-2 ${getReportStatusColor(report.status)}`}>
                                  {report.status?.replace('-', ' ').replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs xs:text-sm text-neutral/70 line-clamp-2 leading-relaxed">
                                {report.description}
                              </p>
                              <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 mt-2 xs:mt-3 flex-wrap">
                                {report.location && (
                                  <span className="text-[10px] xs:text-xs font-bold bg-warning/10 text-warning px-2 xs:px-3 py-0.5 xs:py-1 rounded-full border border-warning/30">
                                    📍 {report.location.district}
                                  </span>
                                )}
                                {report.severity && (
                                  <span className="text-[10px] xs:text-xs px-2 xs:px-3 py-0.5 xs:py-1 rounded-full font-bold border-2 bg-info/10 text-info border-info/30">
                                    {report.severity.toUpperCase()} Severity
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 xs:py-10 sm:py-12 lg:py-16 bg-base-300 rounded-lg xs:rounded-xl border-2 border-dashed border-base-200">
                  <p className="text-xl xs:text-2xl sm:text-3xl mb-2 xs:mb-3">📭</p>
                  <p className="text-info font-bold mb-1.5 xs:mb-2 text-sm xs:text-base sm:text-lg">
                    No reports yet
                  </p>
                  <p className="text-xs xs:text-sm text-neutral/70 mb-4 xs:mb-6">
                    Reports will appear here once citizens submit them
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-t-4 border-primary p-4 xs:p-5 sm:p-6 lg:p-8 bg-linear-to-br from-primary/5 to-secondary/5">
            <h3 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-info mb-3 xs:mb-4 sm:mb-6 flex items-center gap-2 xs:gap-3">
              <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs xs:text-sm">✨</div>
              Authority Workflow
            </h3>


            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">

              <div className="flex items-start gap-1.5 xs:gap-2 sm:gap-3">
                <div className="shrink-0 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs xs:text-sm">1</div>
                <div>
                  <p className="font-bold text-info text-xs xs:text-sm">Review Reports</p>
                  <p className="text-[10px] xs:text-xs text-neutral/70 hidden xs:block">Assess incoming infrastructure issues</p>
                </div>
              </div>

              <div className="flex items-start gap-1.5 xs:gap-2 sm:gap-3">
                <div className="shrink-0 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-xs xs:text-sm">2</div>
                <div>
                  <p className="font-bold text-info text-xs xs:text-sm">Assign Tasks</p>
                  <p className="text-[10px] xs:text-xs text-neutral/70 hidden xs:block">Delegate to problem solvers</p>
                </div>
              </div>

              <div className="flex items-start gap-1.5 xs:gap-2 sm:gap-3">
                <div className="shrink-0 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-accent text-info rounded-full flex items-center justify-center font-bold text-xs xs:text-sm">3</div>
                <div>
                  <p className="font-bold text-info text-xs xs:text-sm">Approve Work</p>
                  <p className="text-[10px] xs:text-xs text-neutral/70 hidden xs:block">Review submitted solutions</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
                <div className="shrink-0 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs xs:text-sm">4</div>
                <div>
                  <p className="font-bold text-info text-xs xs:text-sm">Mark Resolved</p>
                  <p className="text-[10px] xs:text-xs text-neutral/70 hidden xs:block">Close and monitor outcomes</p>
                </div>
              </div>

            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
}