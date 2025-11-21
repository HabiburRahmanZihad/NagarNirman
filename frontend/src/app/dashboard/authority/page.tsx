'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { reportAPI, problemSolverAPI, taskAPI } from '@/utils/api';
import { motion } from 'framer-motion';

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

      // Fetch applications
      const applicationsResponse = await problemSolverAPI.getAllApplications({ status: 'pending' });
      if (applicationsResponse.success) {
        const applications = applicationsResponse.data;
        setRecentApplications(applications.slice(0, 5));
        setStats(prev => ({
          ...prev,
          pendingApplications: applications.length,
        }));
      }

      // Fetch pending review tasks
      const tasksResponse = await taskAPI.getPendingReview();
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
    return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Loading...</p>
        </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Reports',
      value: stats.totalReports,
      icon: '📊',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: `${stats.totalTasks} tasks assigned`,
      link: '/reports',
    },
    {
      title: 'Pending Review',
      value: stats.pendingReports,
      icon: '⏳',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: 'Reports awaiting review',
      link: '/reports',
    },
    {
      title: 'Tasks to Review',
      value: stats.pendingReviewTasks,
      icon: '✅',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'Submitted work awaiting approval',
      link: '/dashboard/authority/review-tasks',
      badge: stats.pendingReviewTasks > 0,
    },
    {
      title: 'In Progress',
      value: stats.inProgressReports,
      icon: '⚙️',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: 'Being actively resolved',
      link: '/reports',
    },
    {
      title: 'Resolved',
      value: stats.resolvedReports,
      icon: '🎉',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: `${stats.totalReports > 0 ? Math.round((stats.resolvedReports / stats.totalReports) * 100) : 0}% resolution rate`,
      link: '/reports',
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      icon: '🏆',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: `${stats.rejectedTasks} rejected`,
      link: '/dashboard/authority/review-tasks',
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Authority Dashboard 🏛️
            </h1>
            <p className="text-gray-600">
              Manage and oversee all reports and applications
            </p>
          </div>
          <Link href="/reports">
            <Button variant="primary">
              View All Reports
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.link || '#'}>
                <div className={`${stat.bgColor} rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 relative`}>
                  {stat.badge && stat.value > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                      {stat.value}
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{stat.icon}</span>
                    <span className={`text-3xl font-bold ${stat.color}`}>
                      {loadingStats ? '...' : stat.value}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {stat.trend}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Action Alerts */}
        <div className="space-y-4">
          {/* Pending Review Tasks Alert */}
          {stats.pendingReviewTasks > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <h3 className="font-semibold text-purple-800">
                      {stats.pendingReviewTasks} Task{stats.pendingReviewTasks !== 1 ? 's' : ''} Awaiting Review
                    </h3>
                    <p className="text-sm text-purple-700">
                      Problem solvers have submitted their work for your approval
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/authority/review-tasks">
                  <Button variant="accent" size="sm">
                    Review Tasks
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Pending Applications Alert */}
          {stats.pendingApplications > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-yellow-800">
                      {stats.pendingApplications} Pending Application{stats.pendingApplications !== 1 ? 's' : ''}
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Review problem solver applications awaiting approval
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/authority/applications">
                  <Button variant="accent" size="sm">
                    Review Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link href="/reports">
                  <Button variant="primary" className="w-full justify-start">
                    <span className="mr-2">📋</span> All Reports
                  </Button>
                </Link>
                <Link href="/dashboard/authority/assign-task">
                  <Button variant="primary" className="w-full justify-start">
                    <span className="mr-2">📝</span> Assign Tasks
                  </Button>
                </Link>
                <Link href="/dashboard/authority/solvers">
                  <Button variant="secondary" className="w-full justify-start">
                    <span className="mr-2">💡</span> Problem Solvers & NGOs
                  </Button>
                </Link>
                <Link href="/dashboard/authority/applications">
                  <Button variant="secondary" className="w-full justify-start">
                    <span className="mr-2">📄</span> Applications
                    {stats.pendingApplications > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {stats.pendingApplications}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href="/dashboard/authority/manage-users">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">👥</span> Manage Users
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Reports
                </h2>
                <Link href="/reports">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {recentReports.length > 0 ? (
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <Link key={report._id} href={`/reports/${report._id}`}>
                      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {report.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {report.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-gray-500">
                                📍 {report.district}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                report.status === 'resolved'
                                  ? 'bg-green-100 text-green-700'
                                  : report.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {report.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    No reports yet
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Recent Applications */}
        {recentApplications.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Pending Applications
              </h2>
              <Link href="/dashboard/authority/applications">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentApplications.map((app) => (
                <Link key={app._id} href="/dashboard/authority/applications">
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {app.fullName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {app.profession}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>📍 {app.district}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
