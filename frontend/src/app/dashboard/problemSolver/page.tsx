'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import RefreshButton from '@/components/common/RefreshButton';
import { FullPageLoading } from '@/components/common';
import { reportAPI, taskAPI } from '@/utils/api';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  Star,
  TrendingUp,
  AlertCircle,
  MapPin,
  Calendar,
  Award,
  Activity,
  FileText,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TaskStats {
  total: number;
  assigned: number;
  ongoing: number;
  submitted: number;
  completed: number;
  rejected: number;
  points: number;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  report: any;
  deadline?: string;
  createdAt: string;
}

export default function SolverDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    assigned: 0,
    ongoing: 0,
    submitted: 0,
    completed: 0,
    rejected: 0,
    points: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'problemSolver')) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    if (user?.role === 'problemSolver') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async (showToast = false) => {
    try {
      if (showToast) {
        setIsRefreshing(true);
      } else {
        setLoadingStats(true);
      }

      // Fetch user's tasks with real data
      const tasksResponse = await taskAPI.getMyTasks(100);

      if (tasksResponse.success && tasksResponse.data) {
        const tasks = tasksResponse.data;
        setRecentTasks(tasks.slice(0, 6)); // Show 6 most recent tasks

        // Calculate real statistics
        const taskStats = {
          total: tasks.length,
          assigned: tasks.filter((t: Task) => t.status === 'assigned').length,
          ongoing: tasks.filter((t: Task) => ['accepted', 'in-progress'].includes(t.status)).length,
          submitted: tasks.filter((t: Task) => t.status === 'submitted').length,
          completed: tasks.filter((t: Task) => t.status === 'completed').length,
          rejected: tasks.filter((t: Task) => t.status === 'rejected').length,
          points: user?.points || 0,
        };

        setStats(taskStats);
      }

      if (showToast) {
        toast.success('Dashboard refreshed!', {
          icon: '✨',
          style: {
            background: '#2a7d2f',
            color: 'white',
          },
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (showToast) {
        toast.error('Failed to refresh dashboard');
      }
    } finally {
      setLoadingStats(false);
      setIsRefreshing(false);
    }
  };

  if (isLoading || !user) {
    return <FullPageLoading text="Loading Your Dashboard..." />;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      assigned: 'bg-blue-100 text-blue-700 border-blue-200',
      accepted: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'in-progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      submitted: 'bg-purple-100 text-purple-700 border-purple-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-gray-600',
      medium: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  const statsCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'All assigned tasks',
    },
    {
      title: 'New Assigned',
      value: stats.assigned,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Awaiting acceptance',
    },
    {
      title: 'In Progress',
      value: stats.ongoing,
      icon: Activity,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      description: 'Currently working',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Successfully finished',
    },
    {
      title: 'Under Review',
      value: stats.submitted,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Pending approval',
    },
    {
      title: 'Points Earned',
      value: stats.points,
      icon: Star,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description: 'Total rewards',
    },
  ];

  return (
    <>
      <div className="space-y-6 p-6 bg-linear-to-br from-gray-50 to-green-50 min-h-screen">
        {/* Welcome Section */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Activity className="text-[#2a7d2f]" size={40} />
              Your Missions
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and complete your assigned cleanup tasks
            </p>
          </div>
          <div className="flex gap-3">
            <RefreshButton
              onClick={() => fetchDashboardData(true)}
              isRefreshing={isRefreshing}
              variant="outline"
              size="md"
            />
            <Link href="/dashboard/problemSolver/tasks">
              <Button variant="primary" className="shadow-lg hover:shadow-xl transition-shadow">
                <Target className="mr-2" size={18} />
                View All Tasks
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`${stat.bgColor} rounded-xl p-5 border-2 ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-200 h-full`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-white shadow-sm ${stat.color}`}>
                      <IconComponent size={24} />
                    </div>
                    <span className={`text-3xl font-bold break-all leading-relaxed  ${stat.color}`}>
                      {loadingStats ? (
                        <div className="animate-pulse">...</div>
                      ) : (
                        stat.value
                      )}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-white shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="text-[#2a7d2f]" size={20} />
                Quick Actions
              </h2>
              <div className="space-y-2">
                <Link href="/dashboard/problemSolver/tasks">
                  <Button variant="primary" className="w-full justify-start shadow-sm hover:shadow-md transition-shadow">
                    <ListTodo className="mr-2" size={18} /> My Tasks
                  </Button>
                </Link>
                <Link href="/dashboard/problemSolver/all-reports">
                  <Button variant="secondary" className="w-full justify-start">
                    <FileText className="mr-2" size={18} /> Browse Reports
                  </Button>
                </Link>
                <Link href="/dashboard/problemSolver/map-search">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="mr-2" size={18} /> Map Search
                  </Button>
                </Link>
                <Link href="/dashboard/problemSolver/statistics">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="mr-2" size={18} /> Statistics
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Ranking Card */}
            <Card className="bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-md border-2 border-amber-200">
              <div className="text-center">
                <div className="inline-block p-3 bg-white rounded-full shadow-md mb-3">
                  <Award className="text-amber-500" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Ranking
                </h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="text-amber-500 fill-amber-500" size={24} />
                  <p className="text-4xl font-bold text-amber-600">
                    {stats.points}
                  </p>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-3">
                  Points Earned
                </p>
                <div className="pt-3 border-t border-amber-200">
                  <p className="text-xs text-gray-600">
                    Keep solving to climb the leaderboard! 🚀
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Tasks */}
          <div className="lg:col-span-3">
            <Card className="bg-white shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="text-[#2a7d2f]" size={28} />
                  Recent Tasks
                </h2>
                <Link href="/dashboard/problemSolver/tasks">
                  <Button variant="outline" size="sm" className="shadow-sm">
                    View All <span className="ml-1">→</span>
                  </Button>
                </Link>
              </div>

              {loadingStats ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : recentTasks.length > 0 ? (
                <div className="space-y-4">
                  {recentTasks.map((task, index) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/dashboard/problemSolver/tasks/${task._id}`}>
                        <div className="p-5 border-2 border-gray-200 rounded-xl hover:border-[#2a7d2f] hover:shadow-lg transition-all duration-200 bg-linear-to-r from-white to-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-gray-900 text-lg overflow-hidden">
                                  {task.title}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                                  {task.status.replace('-', ' ').toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 break-all leading-relaxed ">
                                {task.description}
                              </p>
                              <div className="flex items-center gap-4 flex-wrap">
                                {task.report?.location && (
                                  <span className="text-xs text-gray-600 flex items-center gap-1">
                                    <MapPin size={14} className="text-[#2a7d2f]" />
                                    {task.report.location.district}, {task.report.location.division}
                                  </span>
                                )}
                                <span className="text-xs text-gray-600 flex items-center gap-1">
                                  <Calendar size={14} className="text-blue-600" />
                                  {new Date(task.createdAt).toLocaleDateString()}
                                </span>
                                <span className={`text-xs font-semibold flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                                  <AlertCircle size={14} />
                                  {task.priority.toUpperCase()} Priority
                                </span>
                              </div>
                            </div>
                            <div className="ml-4 text-right">
                              <div className="text-sm font-medium text-gray-700 mb-2">
                                Progress
                              </div>
                              <div className="relative w-20 h-20">
                                <svg className="transform -rotate-90 w-20 h-20">
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="34"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="transparent"
                                    className="text-gray-200"
                                  />
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="34"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeDasharray={213}
                                    strokeDashoffset={213 - (213 * (task.progress || 0)) / 100}
                                    className="text-[#2a7d2f]"
                                  />
                                </svg>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                  <span className="text-lg font-bold text-[#2a7d2f]">{task.progress || 0}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="inline-block p-4 bg-gray-200 rounded-full mb-4">
                    <ListTodo className="text-gray-400" size={48} />
                  </div>
                  <p className="text-gray-600 text-lg font-medium mb-2">
                    No tasks assigned yet
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Check available reports and get started!
                  </p>
                  <Link href="/reports">
                    <Button variant="primary" size="md" className="shadow-lg">
                      <FileText className="mr-2" size={18} />
                      Browse Available Reports
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="bg-linear-to-r from-green-50 via-blue-50 to-purple-50 shadow-md border-2 border-green-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Activity className="text-[#2a7d2f]" size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                How It Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-start gap-2">
                  <div className="shrink-0 w-6 h-6 bg-[#2a7d2f] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Accept Tasks</p>
                    <p className="text-xs text-gray-600">Review and accept assigned tasks</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="shrink-0 w-6 h-6 bg-[#2a7d2f] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Start Work</p>
                    <p className="text-xs text-gray-600">Begin working on the task</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="shrink-0 w-6 h-6 bg-[#2a7d2f] text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Submit Proof</p>
                    <p className="text-xs text-gray-600">Upload completion evidence</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="shrink-0 w-6 h-6 bg-[#2a7d2f] text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Earn Points</p>
                    <p className="text-xs text-gray-600">Get rewarded for your work!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
