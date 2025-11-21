"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, MapPin, AlertTriangle, CheckCircle, Clock, Sparkles, Target, TrendingUp } from "lucide-react";
import TaskCard from "@/components/solver/TaskCard";
import TaskFilterBar from "@/components/solver/TaskFilterBar";
import { useAuth } from "@/context/AuthContext";
import { taskAPI } from "@/utils/api";
import toast from "react-hot-toast";

interface Task {
  _id: string;
  title: string;
  description: string;
  report?: {
    location?: {
      division?: string;
      district?: string;
      address?: string;
    };
    images?: string[];
    severity?: "low" | "medium" | "high";
  };
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "verified";
  assignedTo: string;
  assignedBy: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  proof?: {
    images?: string[];
    description?: string;
    submittedAt?: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function SolverTasksPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    severity: "all",
    district: "all",
    search: ""
  });

  // Check authentication
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (user?.role !== "problemSolver" && user?.role !== "ngo") {
        toast.error('Access denied. This page is only for Problem Solvers and NGOs.');
        router.push(`/dashboard/${user?.role || 'user'}`);
      }
    }
  }, [isAuthenticated, user, authLoading, router]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || (user.role !== 'problemSolver' && user.role !== 'ngo')) {
        return;
      }

      try {
        setLoading(true);
        const response = await taskAPI.getMyTasks();

        if (response.success && Array.isArray(response.data)) {
          setTasks(response.data);
          setFilteredTasks(response.data);
        } else {
          console.error('Invalid tasks response:', response);
          toast.error('Failed to load tasks');
        }
      } catch (error: any) {
        console.error('Error fetching tasks:', error);
        toast.error(error.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    if (user && (user.role === 'problemSolver' || user.role === 'ngo')) {
      fetchTasks();
    }
  }, [user]);

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    ongoing: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed' || t.status === 'verified').length,
    totalPoints: tasks.filter(t => t.status === 'completed' || t.status === 'verified').length * 10 // Placeholder points calculation
  };

  // Filter tasks
  useEffect(() => {
    let result = tasks;

    if (filters.status !== "all") {
      const statusMap: { [key: string]: string } = {
        'pending': 'pending',
        'ongoing': 'in-progress',
        'completed': 'completed',
        'verified': 'verified'
      };
      const mappedStatus = statusMap[filters.status] || filters.status;
      result = result.filter(task => task.status === mappedStatus);
    }

    if (filters.severity !== "all") {
      result = result.filter(task => task.priority === filters.severity);
    }

    if (filters.district !== "all") {
      result = result.filter(task => task.report?.location?.district === filters.district);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTasks(result);
  }, [filters, tasks]);

  const updateTaskStatus = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const response = await taskAPI.updateStatus(taskId, newStatus);

      if (response.success) {
        // Update local state
        setTasks(prev => prev.map(task =>
          task._id === taskId
            ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
            : task
        ));

        if (newStatus === "in-progress") {
          toast.success("Task started successfully! 🚀");
        } else if (newStatus === "completed") {
          toast.success("Task marked as completed! 🎉");
        }
      } else {
        toast.error(response.message || 'Failed to update task status');
      }
    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast.error(error.message || 'Failed to update task status');
    }
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Enhanced Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Your Missions
            </h1>
            <p className="text-gray-600 mt-2">Manage and complete your assigned cleanup tasks</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full text-white shadow-lg">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">{stats.totalPoints} Points Earned</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div
            variants={containerVariants}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.ongoing}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <TaskFilterBar filters={filters} onFiltersChange={setFilters} />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TaskCard task={task} onStatusUpdate={updateTaskStatus} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No missions found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your filters or check back later for new cleanup missions in your area.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}