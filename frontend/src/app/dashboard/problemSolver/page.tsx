'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { reportAPI } from '@/utils/api';
import { motion } from 'framer-motion';

interface TaskStats {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  points: number;
}

export default function SolverDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<TaskStats>({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    points: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [availableReports, setAvailableReports] = useState<any[]>([]);
  const [myTasks, setMyTasks] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== 'problemSolver' && user?.role !== 'ngo'))) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    if (user?.role === 'problemSolver' || user?.role === 'ngo') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoadingStats(true);

      // Fetch available reports (pending reports)
      const reportsResponse = await reportAPI.getAll({ status: 'pending' });
      if (reportsResponse.success) {
        setAvailableReports(reportsResponse.data.slice(0, 6));
      }

      // In a real scenario, fetch user's assigned tasks
      // For now, using mock data
      setStats({
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        points: user?.points || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81d586] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Data...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: '📋',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending',
      value: stats.pendingTasks,
      icon: '⏳',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: '✅',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Points Earned',
      value: stats.points,
      icon: '⭐',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Problem Solver Dashboard 🛠️
            </h1>
            <p className="text-gray-600">
              Help resolve community issues and earn points!
            </p>
          </div>
          <Link href="/reports">
            <Button variant="primary">
              Browse All Reports
            </Button>
          </Link>
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
                  <span className={`text-3xl font-bold ${stat.color}`}>
                    {loadingStats ? '...' : stat.value}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700">
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
                <Link href="/dashboard/solver/tasks">
                  <Button variant="primary" className="w-full justify-start">
                    <span className="mr-2">📋</span> My Tasks
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button variant="secondary" className="w-full justify-start">
                    <span className="mr-2">🔍</span> Browse Reports
                  </Button>
                </Link>
                <Link href="/map-search">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">🗺️</span> Map Search
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Leaderboard Info */}
            <Card className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="text-center">
                <span className="text-4xl mb-3 block">🏆</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Ranking
                </h3>
                <p className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.points} Points
                </p>
                <p className="text-sm text-gray-600">
                  Keep solving to climb the leaderboard!
                </p>
              </div>
            </Card>
          </div>

          {/* Available Reports */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Available Reports
                </h2>
                <Link href="/reports">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {availableReports.length > 0 ? (
                <div className="space-y-3">
                  {availableReports.map((report) => (
                    <Link key={report._id} href={`/reports/${report._id}`}>
                      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {report.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {report.description}
                            </p>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-500">
                                📍 {report.district}
                              </span>
                              <span className="text-xs text-gray-500">
                                📅 {new Date(report.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                +{report.pointsReward || 10} points
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
                    No reports available right now
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Check back later for new reports to solve
                  </p>
                  <Link href="/reports">
                    <Button variant="primary" size="sm">
                      Browse All Reports
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-start gap-4">
            <span className="text-4xl">💡</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How It Works
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ Browse available reports in your area</li>
                <li>✅ Request to be assigned to a task</li>
                <li>✅ Complete the work and upload proof</li>
                <li>✅ Earn points and climb the leaderboard!</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
