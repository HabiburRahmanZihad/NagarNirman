'use client';

import { useEffect, useState } from 'react';
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
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'authority')) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    if (user?.role === 'authority') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoadingStats(true);

      // Fetch all reports
      const reportsResponse = await reportAPI.getAll();
      if (reportsResponse.success) {
        const reports = reportsResponse.data;
        setRecentReports(reports.slice(0, 5));

        setStats(prev => ({
          ...prev,
          totalReports: reports.length,
          pendingReports: reports.filter((r: any) => r.status === 'pending').length,
          inProgressReports: reports.filter((r: any) => r.status === 'in_progress').length,
          resolvedReports: reports.filter((r: any) => r.status === 'resolved').length,
        }));
      }

      // Fetch applications from authority's division only
      const applicationsResponse = await problemSolverAPI.getAllApplications({
        status: 'pending',
        division: user?.division // Filter by authority's division
      });
      if (applicationsResponse.success) {
        const applications = applicationsResponse.data;
        setRecentApplications(applications.slice(0, 5));
        setStats(prev => ({
          ...prev,
          pendingApplications: applications.length,
        }));
      }

      // Fetch pending review tasks from authority's division (based on report division)
      const tasksResponse = await taskAPI.getPendingReview({ division: user?.division });
      if (tasksResponse.success) {
        const pendingTasks = tasksResponse.data;
        setStats(prev => ({
          ...prev,
          pendingReviewTasks: pendingTasks.length,
        }));
      }

      // Fetch all tasks for additional stats
      const allTasksResponse = await taskAPI.getAll();
      if (allTasksResponse.success) {
        const allTasks = allTasksResponse.data;
        setStats(prev => ({
          ...prev,
          totalTasks: allTasks.length,
          completedTasks: allTasks.filter((t: any) => t.status === 'completed' || t.status === 'verified').length,
          rejectedTasks: allTasks.filter((t: any) => t.status === 'rejected').length,
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingStats(false);
    }
  };

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
      <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 bg-base-300 min-h-screen container mx-auto">
        {/* Welcome Section with Gradient Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-accent"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-white/90 text-lg font-semibold">
            Manage reports, assign tasks, and oversee problem solver work across your division.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className={`${stat.bgColor} rounded-2xl p-8 border-2 border-accent/20 shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      {loadingStats ? <span className="animate-pulse">...</span> : <IconComponent size={40} className={stat.color} />}
                    </span>
                    <span className={`text-4xl font-extrabold ${stat.color}`}>
                      {loadingStats ? <span className="animate-pulse">...</span> : stat.value}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral/70">
                    {stat.title}
                  </h3>
                  <p className="text-xs text-neutral/60 mt-1">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="rounded-3xl shadow-xl border-t-4 border-secondary p-8 h-fit">
              <h2 className="text-2xl font-extrabold text-info mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">⚡</div>
                Quick Actions
              </h2>
              <div className="flex flex-col gap-2">
                <Link href="/dashboard/authority/all-reports">
                  <button className="w-full bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <FileText size={20} /> All Reports
                  </button>
                </Link>
                <Link href="/dashboard/authority/assign-task">
                  <button className="w-full bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <ListTodo size={20} /> Assign Tasks
                  </button>
                </Link>
                <Link href="/dashboard/authority/review-tasks">
                  <button className="w-full bg-accent text-info px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-accent/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <ClipboardCheck size={20} /> Review Tasks
                  </button>
                </Link>
                <Link href="/dashboard/authority/applications">
                  <button className="w-full bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <Users size={20} /> Applications
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
                <Card className="mt-6 rounded-3xl shadow-xl border-t-4 border-accent p-8 bg-accent/5">
                  <h3 className="text-2xl font-extrabold text-info mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-info font-bold">🔔</div>
                    Pending Actions
                  </h3>
                  <div className="space-y-3">
                    {stats.pendingReviewTasks > 0 && (
                      <Link href="/dashboard/authority/review-tasks">
                        <div className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 transition cursor-pointer">
                          <div className="text-lg font-bold text-purple-700">{stats.pendingReviewTasks} Tasks</div>
                          <p className="text-sm text-purple-600">Awaiting your review</p>
                        </div>
                      </Link>
                    )}
                    {stats.pendingApplications > 0 && (
                      <Link href="/dashboard/authority/applications">
                        <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition cursor-pointer">
                          <div className="text-lg font-bold text-blue-700">{stats.pendingApplications} Applications</div>
                          <p className="text-sm text-blue-600">Requiring approval</p>
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
            <Card className="rounded-3xl shadow-xl border-t-4 border-secondary p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold text-info flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">📋</div>
                  Recent Reports
                </h2>
                <Link href="/dashboard/authority/all-reports">
                  <button className="bg-secondary text-white px-5 py-2 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300 text-sm">
                    View All →
                  </button>
                </Link>
              </div>

              {loadingStats ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-base-200 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : recentReports.length > 0 ? (
                <div className="space-y-4">
                  {recentReports.map((report, idx) => (
                    <motion.div
                      key={report._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link href={`/reports/${report._id}`}>
                        <div className="p-5 bg-base-100 border-2 border-base-200 rounded-xl hover:border-secondary hover:shadow-lg transition-all duration-300 group cursor-pointer hover:bg-base-100">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="font-extrabold text-info mb-2 group-hover:text-secondary transition-colors text-lg line-clamp-1">
                                  {report.title}
                                </h3>
                                <span className={`text-xs px-3 py-1 rounded-full font-bold border-2 ${getReportStatusColor(report.status)}`}>
                                  {report.status?.replace('-', ' ').replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-neutral/70 line-clamp-2 leading-relaxed">
                                {report.description}
                              </p>
                              <div className="flex items-center gap-3 mt-3 flex-wrap">
                                {report.location && (
                                  <span className="text-xs font-bold bg-warning/10 text-warning px-3 py-1 rounded-full border border-warning/30">
                                    📍 {report.location.district}
                                  </span>
                                )}
                                {report.severity && (
                                  <span className="text-xs px-3 py-1 rounded-full font-bold border-2 bg-info/10 text-info border-info/30">
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
                <div className="text-center py-16 bg-base-300 rounded-xl border-2 border-dashed border-base-200">
                  <p className="text-3xl mb-3">📭</p>
                  <p className="text-info font-bold mb-2 text-lg">
                    No reports yet
                  </p>
                  <p className="text-sm text-neutral/70 mb-6">
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
          <Card className="rounded-3xl shadow-xl border-t-4 border-primary p-8 bg-linear-to-br from-primary/5 to-secondary/5">
            <h3 className="text-2xl font-extrabold text-info mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">✨</div>
              Authority Workflow
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <p className="font-bold text-info text-sm">Review Reports</p>
                  <p className="text-xs text-neutral/70">Assess incoming infrastructure issues</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <p className="font-bold text-info text-sm">Assign Tasks</p>
                  <p className="text-xs text-neutral/70">Delegate to problem solvers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 bg-accent text-info rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <p className="font-bold text-info text-sm">Approve Work</p>
                  <p className="text-xs text-neutral/70">Review submitted solutions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <p className="font-bold text-info text-sm">Mark Resolved</p>
                  <p className="text-xs text-neutral/70">Close and monitor outcomes</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
