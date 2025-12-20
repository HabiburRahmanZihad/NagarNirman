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
            Track your assigned tasks, earn points, and make an impact in your community.
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
                <Link href="/dashboard/problemSolver/tasks">
                  <button className="w-full bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <ListTodo size={20} /> My Tasks
                  </button>
                </Link>
                <Link href="/dashboard/problemSolver/all-reports">
                  <button className="w-full bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <FileText size={20} /> Browse Reports
                  </button>
                </Link>
                <Link href="/dashboard/problemSolver/leaderboard">
                  <button className="w-full bg-accent text-info px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-accent/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <Award size={20} /> Leaderboard
                  </button>
                </Link>
                <Link href="/dashboard/problemSolver/statistics">
                  <button className="w-full bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <TrendingUp size={20} /> Statistics
                  </button>
                </Link>
              </div>
            </Card>

            {/* Points Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="mt-6 rounded-3xl shadow-xl border-t-4 border-accent p-8">
                <h3 className="text-2xl font-extrabold text-info mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-info font-bold">⭐</div>
                  Points Earned
                </h3>
                <div className={`p-6 rounded-2xl border-2 font-bold text-center capitalize text-2xl ${stats.points > 0
                  ? 'bg-success/10 text-success border-success/30'
                  : 'bg-warning/10 text-warning border-warning/30'
                  }`}>
                  {stats.points} Points
                </div>
                <p className="text-sm text-neutral/70 text-center mt-4">
                  Keep solving tasks to climb the leaderboard! 🚀
                </p>
                <Link href="/dashboard/problemSolver/leaderboard">
                  <button className="w-full mt-4 bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300">
                    View Leaderboard →
                  </button>
                </Link>
              </Card>
            </motion.div>
          </motion.div>

          {/* Recent Tasks */}
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
                  Recent Tasks
                </h2>
                <Link href="/dashboard/problemSolver/tasks">
                  <button className="bg-secondary text-white px-5 py-2 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300 text-sm">
                    View All →
                  </button>
                </Link>
              </div>

              {loadingStats ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-base-200 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : recentTasks.length > 0 ? (
                <div className="space-y-4">
                  {recentTasks.map((task, idx) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link href={`/dashboard/problemSolver/tasks/${task._id}`}>
                        <div className="p-5 bg-base-100 border-2 border-base-200 rounded-xl hover:border-secondary hover:shadow-lg transition-all duration-300 group cursor-pointer hover:bg-base-100">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="font-extrabold text-info mb-2 group-hover:text-secondary transition-colors text-lg line-clamp-1">
                                  {task.title}
                                </h3>
                                <span className={`text-xs px-3 py-1 rounded-full font-bold border-2 ${getStatusColor(task.status)}`}>
                                  {task.status.replace('-', ' ').toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-neutral/70 line-clamp-2 leading-relaxed">
                                {task.description}
                              </p>
                              <div className="flex items-center gap-3 mt-3 flex-wrap">
                                {task.report?.location && (
                                  <span className="text-xs font-bold bg-warning/10 text-warning px-3 py-1 rounded-full border border-warning/30">
                                    📍 {task.report.location.district}
                                  </span>
                                )}
                                <span className={`text-xs px-3 py-1 rounded-full font-bold border-2 ${getPriorityColor(task.priority) === 'text-red-600' ? 'bg-error/10 text-error border-error/30' : getPriorityColor(task.priority) === 'text-orange-600' ? 'bg-warning/10 text-warning border-warning/30' : 'bg-info/10 text-info border-info/30'}`}>
                                  {task.priority.toUpperCase()} Priority
                                </span>
                              </div>
                            </div>
                            <div className="ml-4 text-center min-w-fit">
                              <div className="text-xs font-bold text-neutral/70 mb-2">Progress</div>
                              <div className="relative w-20 h-20">
                                <svg className="transform -rotate-90 w-20 h-20">
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="34"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="transparent"
                                    className="text-base-200"
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
                                    className="text-primary transition-all duration-300"
                                  />
                                </svg>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                  <span className="text-lg font-bold text-primary">{task.progress || 0}%</span>
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
                <div className="text-center py-16 bg-base-300 rounded-xl border-2 border-dashed border-base-200">
                  <p className="text-3xl mb-3">🗂️</p>
                  <p className="text-info font-bold mb-2 text-lg">
                    No tasks assigned yet
                  </p>
                  <p className="text-sm text-neutral/70 mb-6">
                    Start by browsing available reports
                  </p>
                  <Link href="/dashboard/problemSolver/all-reports">
                    <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 inline-block">
                      📝 Browse Reports
                    </button>
                  </Link>
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
              How to Get Started
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <p className="font-bold text-info text-sm">Accept Tasks</p>
                  <p className="text-xs text-neutral/70">Review and accept assigned tasks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <p className="font-bold text-info text-sm">Start Work</p>
                  <p className="text-xs text-neutral/70">Begin working on the task</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 bg-accent text-info rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <p className="font-bold text-info text-sm">Submit Proof</p>
                  <p className="text-xs text-neutral/70">Upload completion evidence</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <p className="font-bold text-info text-sm">Earn Points</p>
                  <p className="text-xs text-neutral/70">Get rewarded for your work!</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
