'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/common/DashboardLayout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { userAPI, reportAPI, problemSolverAPI } from '@/utils/api';
import { motion } from 'framer-motion';

interface UserStats {
  totalReports: number;
  pendingReports: number;
  inProgressReports: number;
  resolvedReports: number;
  rejectedReports: number;
}

export default function UserDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchRecentReports();
      fetchApplicationStatus();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      if (!user?._id) {
        console.log('No user ID available');
        return;
      }
      console.log('Fetching stats for user:', user._id);
      const response = await userAPI.getUserStats(user._id);
      console.log('Stats response:', response);
      if (response.success && response.data) {
        const { reports } = response.data;
        setStats({
          totalReports: reports?.total || 0,
          pendingReports: reports?.byStatus?.pending || 0,
          inProgressReports: reports?.byStatus?.in_progress || 0,
          resolvedReports: reports?.byStatus?.resolved || 0,
          rejectedReports: reports?.byStatus?.rejected || 0,
        });
        console.log('Stats updated:', {
          totalReports: reports?.total || 0,
          pendingReports: reports?.byStatus?.pending || 0,
          inProgressReports: reports?.byStatus?.in_progress || 0,
          resolvedReports: reports?.byStatus?.resolved || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecentReports = async () => {
    try {
      const response = await reportAPI.getAll();
      console.log('Reports response:', response);
      if (response.success && Array.isArray(response.data)) {
        // Filter reports by current user
        const userReports = response.data.filter(
          (report: any) => report.createdBy === user?._id || report.createdBy?._id === user?._id
        );
        setRecentReports(userReports.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchApplicationStatus = async () => {
    try {
      const response = await problemSolverAPI.getMyApplication();
      if (response.success) {
        setApplicationStatus(response.data);
      }
    } catch (error) {
      // User may not have applied yet
    }
  };

  if (isLoading || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  const statsCards = [
    {
      title: 'Total Reports',
      value: stats?.totalReports || 0,
      icon: '📊',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending',
      value: stats?.pendingReports || 0,
      icon: '⏳',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'In Progress',
      value: stats?.inProgressReports || 0,
      icon: '⚙️',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Resolved',
      value: stats?.resolvedReports || 0,
      icon: '✅',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your reports today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`${stat.bgColor} rounded-xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className={`text-2xl font-bold ${stat.color}`}>
                    {loadingStats ? '...' : stat.value}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-700">
                  {stat.title}
                </h3>
              </div>
            </motion.div>
          ))}
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
                <Link href="/reports/new">
                  <Button variant="primary" className="w-full justify-start">
                    <span className="mr-2">📝</span> Report New Issue
                  </Button>
                </Link>
                <Link href="/dashboard/user/my-reports">
                  <Button variant="secondary" className="w-full justify-start">
                    <span className="mr-2">📋</span> My Reports
                  </Button>
                </Link>
                <Link href="/map-search">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">🗺️</span> Map Search
                  </Button>
                </Link>
                {!applicationStatus && (
                  <Link href="/join-as-a-Problem-Solver">
                    <Button variant="accent" className="w-full justify-start">
                      <span className="mr-2">💡</span> Become a Solver
                    </Button>
                  </Link>
                )}
              </div>
            </Card>

            {/* Application Status */}
            {applicationStatus && (
              <Card className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Solver Application
                </h3>
                <div className={`p-3 rounded-lg ${
                  applicationStatus.status === 'approved'
                    ? 'bg-green-50 text-green-700'
                    : applicationStatus.status === 'rejected'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-yellow-50 text-yellow-700'
                }`}>
                  <p className="font-medium capitalize">
                    Status: {applicationStatus.status}
                  </p>
                </div>
                <Link href="/dashboard/user/application-status">
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View Details
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Reports
                </h2>
                <Link href="/dashboard/user/my-reports">
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
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {report.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-gray-500">
                                {report.district}
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
                  <p className="text-gray-600 mb-2">
                    No reports yet
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Start by reporting your first issue
                  </p>
                  <Link href="/reports/new">
                    <Button variant="primary" size="sm">
                      Report an Issue
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
