'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Loading } from '@/components/common';
import { userAPI, reportAPI, problemSolverAPI } from '@/utils/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface UserStats {
  totalReports: number;
  pendingReports: number;
  inProgressReports: number;
  resolvedReports: number;
  rejectedReports: number;
}

export default function UserDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent duplicate API calls
    if (user && !hasFetched.current) {
      hasFetched.current = true;
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    await Promise.all([
      fetchUserStats(),
      fetchRecentReports(),
      fetchApplicationStatus()
    ]);
  };

  const fetchUserStats = async () => {
    if (!user?._id) return;

    try {
      const response = await userAPI.getUserStats(user._id);
      if (response.success && response.data) {
        const { reports } = response.data;
        setStats({
          totalReports: reports?.total || 0,
          pendingReports: reports?.byStatus?.pending || 0,
          inProgressReports: reports?.byStatus?.in_progress || 0,
          resolvedReports: reports?.byStatus?.resolved || 0,
          rejectedReports: reports?.byStatus?.rejected || 0,
        });
      }
    } catch (error: any) {
      toast.error('Failed to load statistics');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecentReports = async () => {
    if (!user?._id) return;

    try {
      const response = await reportAPI.getAll();
      if (response.success && Array.isArray(response.data)) {
        const userReports = response.data.filter(
          (report: any) => report.createdBy === user._id || report.createdBy?._id === user._id
        );
        setRecentReports(userReports.slice(0, 5));
      }
    } catch (error: any) {
      toast.error('Failed to load recent reports');
    }
  };

  const fetchApplicationStatus = async () => {
    try {
      const response = await problemSolverAPI.getMyApplication();
      if (response.success) {
        setApplicationStatus(response.data);
      }
    } catch (error: any) {
      // 404 means user hasn't applied yet - this is normal and expected
      if (error.status !== 404) {
        toast.error('Failed to check application status');
      }
    }
  };

  if (isLoading || !user) {
    return <Loading size="lg" text="Loading your dashboard..." />;
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
    <div className="min-h-screen bg-base-300 space-y-8 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 container mx-auto">
      {/* Welcome Section with Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary text-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-accent"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-white/90 text-lg font-semibold">
          Here's what's happening with your reports and community contributions today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className={`${stat.bgColor} rounded-2xl p-8 border-2 border-accent/20 shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
                <span className={`text-4xl font-extrabold text-primary`}>
                  {loadingStats ? <span className="animate-pulse">...</span> : stat.value}
                </span>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral/70">
                {stat.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="rounded-3xl shadow-xl border-t-4 border-primary p-8 h-fit">
            <h2 className="text-2xl font-extrabold text-info mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold">⚡</div>
              Quick Actions
            </h2>
            <div className="gap-1 flex flex-col">
              <Link href="/dashboard/user/reports/new">
                <button className="w-full bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  <span>📝</span> Report New Issue
                </button>
              </Link>
              <Link href="/dashboard/user/my-reports">
                <button className="w-full bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  <span>📋</span> My Reports
                </button>
              </Link>
              <Link href="/dashboard/user/map-search">
                <button className="w-full bg-accent text-info px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-accent/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  <span>🗺️</span> Map Search
                </button>
              </Link>
              {!applicationStatus && (
                <Link href="/dashboard/user/join-as-a-Problem-Solver">
                  <button className="w-full bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <span>💡</span> Become a Solver
                  </button>
                </Link>
              )}
            </div>
          </Card>

          {/* Application Status */}
          {applicationStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="mt-6 rounded-3xl shadow-xl border-t-4 border-accent p-8">
                <h3 className="text-2xl font-extrabold text-info mb-6 flex items-center gap-3">
                  <div className={`w-10 h-10 ${applicationStatus.status === 'approved' ? 'bg-success' : applicationStatus.status === 'rejected' ? 'bg-error' : 'bg-warning'} rounded-full flex items-center justify-center text-white font-bold`}>
                    {applicationStatus.status === 'approved' ? '✅' : applicationStatus.status === 'rejected' ? '❌' : '⏳'}
                  </div>
                  Solver Application
                </h3>
                <div className={`p-4 rounded-xl border-2 font-bold text-center capitalize text-lg ${applicationStatus.status === 'approved'
                  ? 'bg-success/10 text-success border-success/30'
                  : applicationStatus.status === 'rejected'
                    ? 'bg-error/10 text-error border-error/30'
                    : 'bg-warning/10 text-warning border-warning/30'
                  }`}>
                  Status: {applicationStatus.status}
                </div>
                <Link href="/dashboard/user/application-status">
                  <button className="w-full mt-4 bg-accent text-info px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-accent/90 transform hover:scale-105 transition-all duration-300">
                    View Details →
                  </button>
                </Link>
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
              <Link href="/dashboard/user/my-reports">
                <button className="bg-secondary text-white px-5 py-2 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300 text-sm">
                  View All →
                </button>
              </Link>
            </div>

            {recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report, idx) => (
                  <motion.div
                    key={report._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link href={`/dashboard/user/reports/${report._id}`}>
                      <div className="p-5 bg-base-100 border-2 border-base-200 rounded-xl hover:border-secondary hover:shadow-lg transition-all duration-300 group cursor-pointer hover:bg-base-100">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-extrabold text-info mb-2 group-hover:text-secondary transition-colors text-lg line-clamp-1">
                              {report.title}
                            </h3>
                            <p className="text-sm text-neutral/70 line-clamp-2 leading-relaxed">
                              {report.description}
                            </p>
                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                              <span className="text-xs font-bold bg-warning/10 text-warning px-3 py-1 rounded-full border border-warning/30">
                                📍 {report.district}
                              </span>
                              <span className={`text-xs px-3 py-1 rounded-full font-bold border-2 ${report.status === 'resolved'
                                ? 'bg-success/10 text-success border-success/30'
                                : report.status === 'in_progress'
                                  ? 'bg-info/10 text-info border-info/30'
                                  : 'bg-warning/10 text-warning border-warning/30'
                                }`}>
                                {report.status === 'resolved' ? '✅' : report.status === 'in_progress' ? '⚙️' : '⏳'} {report.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 text-xl group-hover:scale-110 transition-transform duration-300">
                            →
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-base-300 rounded-xl border-2 border-dashed border-base-200">
                <p className="text-3xl mb-3">🗂️</p>
                <p className="text-info font-bold mb-2 text-lg">
                  No reports yet
                </p>
                <p className="text-sm text-neutral/70 mb-6">
                  Start by reporting your first community issue
                </p>
                <Link href="/dashboard/user/reports/new">
                  <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 inline-block">
                    📝 Report an Issue
                  </button>
                </Link>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
