'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button from '@/components/common/Button';
import { RefreshButton, FullPageLoading } from "@/components/common";
import { MapPin, CheckCircle, Clock, Target, TrendingUp, X, Image as ImageIcon, Send, AlertCircle, Eye, Filter, Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
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
    problemType?: string;
    category?: string;
    subcategory?: string;
  };
  priority: "low" | "medium" | "high";
  status: "assigned" | "accepted" | "in-progress" | "submitted" | "completed" | "rejected" | "verified";
  progress?: number;
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
  rejectionReason?: string;
  resubmissionCount?: number;
}

export default function SolverTasksPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { addNotification } = useNotifications();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    severity: "all",
    category: "all",
    search: ""
  });

  // Fetch tasks function
  // Accepts a flag to show toast only on manual refresh
  const fetchTasks = async (showToast = false) => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      const response = await taskAPI.getMyTasks();

      if (response.success && Array.isArray(response.data)) {
        setTasks(response.data);
        setFilteredTasks(response.data);
        if (showToast) toast.success('Tasks refreshed successfully!');
      } else {
        console.error('Invalid tasks response:', response);
        toast.error('Failed to load tasks');
      }
    } catch (error: unknown) {
      console.error('Error fetching tasks:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on mount (no toast)
  useEffect(() => {
    if (user && user.role === 'problemSolver') {
      fetchTasks(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedTaskForProof, setSelectedTaskForProof] = useState<string | null>(null);
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [proofDescription, setProofDescription] = useState("");
  const [submittingProof, setSubmittingProof] = useState(false);

  const stats = {
    total: tasks.length,
    assigned: tasks.filter(t => t.status === 'assigned').length,
    ongoing: tasks.filter(t => t.status === 'accepted' || t.status === 'in-progress').length,
    submitted: tasks.filter(t => t.status === 'submitted').length,
    completed: tasks.filter(t => t.status === 'completed' || t.status === 'verified').length,
    rejected: tasks.filter(t => t.status === 'rejected').length,
    totalPoints: user?.points ?? 0 // Use actual user points from backend
  };

  // Filter tasks
  useEffect(() => {
    let result = tasks;

    if (filters.status !== "all") {
      const statusMap: { [key: string]: string[] } = {
        'pending': ['assigned'],
        'ongoing': ['accepted', 'in-progress'],
        'completed': ['completed', 'verified'],
        'submitted': ['submitted'],
        'rejected': ['rejected']
      };
      const mappedStatuses = statusMap[filters.status] || [filters.status];
      result = result.filter(task => mappedStatuses.includes(task.status));
    }

    if (filters.severity !== "all") {
      result = result.filter(task => task.priority === filters.severity);
    }

    if (filters.category !== "all") {
      result = result.filter(task => task.report?.problemType === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.report?.problemType?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTasks(result);
  }, [filters, tasks]);

  // Start Task
  const handleStartTask = async (taskId: string) => {
    try {
      const response = await taskAPI.startTask(taskId);
      if (response.success) {
        toast.success("Task started! Good luck! 🚀");
        addNotification({
          title: 'Task Started',
          message: 'You have started working on the task. Update your progress regularly.',
          type: 'info',
        });
        // Refresh tasks
        const updatedTasks = await taskAPI.getMyTasks();
        if (updatedTasks.success) {
          setTasks(updatedTasks.data);
        }
      } else {
        toast.error(response.message || 'Failed to start task');
      }
    } catch (error: unknown) {
      console.error('Error starting task:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start task');
    }
  };

  // Open Proof Modal
  const handleOpenProofModal = (taskId: string) => {
    setSelectedTaskForProof(taskId);
    setProofImages([]);
    setProofDescription("");
    setShowProofModal(true);
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    setProofImages(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Proof
  const handleSubmitProof = async () => {
    if (!selectedTaskForProof) return;

    if (proofImages.length === 0) {
      toast.error("Please upload at least one proof image");
      return;
    }

    if (!proofDescription.trim()) {
      toast.error("Please provide a description of your work");
      return;
    }

    try {
      setSubmittingProof(true);
      const response = await taskAPI.submitProof(selectedTaskForProof, {
        images: proofImages,
        description: proofDescription
      });

      if (response.success) {
        toast.success("Proof submitted successfully! Waiting for review. ✅");
        addNotification({
          title: 'Proof Submitted',
          message: 'Your work proof has been submitted for review. You will be notified once it is reviewed.',
          type: 'success',
        });
        setShowProofModal(false);
        setSelectedTaskForProof(null);
        setProofImages([]);
        setProofDescription("");

        // Refresh tasks
        const updatedTasks = await taskAPI.getMyTasks();
        if (updatedTasks.success) {
          setTasks(updatedTasks.data);
        }
      } else {
        toast.error(response.message || 'Failed to submit proof');
      }
    } catch (error: unknown) {
      console.error('Error submitting proof:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit proof');
    } finally {
      setSubmittingProof(false);
    }
  };

  if (authLoading || loading) {
    return <FullPageLoading text="Loading Your Tasks" />;
  }

  if (!user || user.role !== 'problemSolver') {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-4 xs:py-6 sm:py-8 md:py-10 px-3 xs:px-4 sm:px-6 md:px-8">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="mb-4 xs:mb-6 sm:mb-8 border-b pb-3 xs:pb-4 bg-white rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 md:px-8 py-3 xs:py-4 sm:py-6 border-accent/80">
          <div className="flex flex-col xs:flex-row items-start justify-between gap-3 xs:gap-4">
            <div>
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002E2E] mb-1 xs:mb-2 flex items-center gap-2 xs:gap-3">
                <Target className="text-primary w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                My Missions
              </h1>
              <p className="text-xs xs:text-sm sm:text-base text-[#6B7280]">Track and manage your assigned cleanup tasks</p>
            </div>
            <div className="flex gap-2 xs:gap-3 self-end xs:self-auto">
              <RefreshButton
                onClick={() => fetchTasks(true)}
                isRefreshing={loading}
                variant="outline"
              />
            </div>
          </div>
        </div>

        {/* Stats Dashboard - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-6 sm:mb-8">
          {/* Total Tasks - Green Gradient */}
          <div className="bg-linear-to-br from-primary to-[#1e5d22] rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold opacity-90">Total Tasks</p>
                <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mt-1 xs:mt-2">{stats.total}</p>
              </div>
              <Target className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 opacity-30" />
            </div>
          </div>

          {/* Assigned - Gray */}
          <div
            onClick={() => setFilters({ ...filters, status: 'pending' })}
            className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-gray-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[#6B7280]">Assigned</p>
                <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 mt-1 xs:mt-2">{stats.assigned}</p>
              </div>
              <Clock className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-gray-300" />
            </div>
          </div>

          {/* Ongoing - Purple */}
          <div
            onClick={() => setFilters({ ...filters, status: 'ongoing' })}
            className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-purple-200 hover:border-purple-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-purple-800">Ongoing</p>
                <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 mt-1 xs:mt-2">{stats.ongoing}</p>
              </div>
              <TrendingUp className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-purple-200" />
            </div>
          </div>

          {/* Submitted - Blue */}
          <div
            onClick={() => setFilters({ ...filters, status: 'submitted' })}
            className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-blue-200 hover:border-blue-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-blue-800">Submitted</p>
                <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mt-1 xs:mt-2">{stats.submitted}</p>
              </div>
              <Send className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-blue-200" />
            </div>
          </div>

          {/* Completed - Green */}
          <div
            onClick={() => setFilters({ ...filters, status: 'completed' })}
            className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-green-200 hover:border-green-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-green-800">Completed</p>
                <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mt-1 xs:mt-2">{stats.completed}</p>
              </div>
              <CheckCircle className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-green-200" />
            </div>
          </div>

          {/* Total Points - Amber Gradient */}
          <div className="bg-linear-to-br from-amber-400 to-orange-500 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold opacity-90">Total Points</p>
                <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mt-1 xs:mt-2">{stats.totalPoints}</p>
              </div>
              <Flame className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 opacity-30" />
            </div>
          </div>
        </div>

        {/* Completion Rate Card */}
        {stats.total > 0 && (
          <div className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg mb-4 xs:mb-6 sm:mb-8 border-t-4 border-primary">
            <div className="flex flex-col xs:flex-row items-start justify-between gap-3 xs:gap-4 mb-3 xs:mb-4">
              <div>
                <div className="flex items-center gap-2 xs:gap-3 mb-1 xs:mb-2">
                  <div className="p-2 xs:p-2.5 sm:p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="text-primary w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base xs:text-lg sm:text-xl font-bold text-[#002E2E]">Completion Rate</h3>
                    <p className="text-xs xs:text-sm text-[#6B7280]">{stats.completed} of {stats.total} tasks completed</p>
                  </div>
                </div>
              </div>
              <div className="text-left xs:text-right">
                <p className="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-primary">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</p>
                <p className="text-[10px] xs:text-xs text-[#6B7280] font-semibold">Success Rate</p>
              </div>
            </div>
            {/* Progress bar with animation */}
            <div className="w-full bg-gray-200 rounded-full h-2 xs:h-2.5 sm:h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%` }}
                transition={{ duration: 0.8 }}
                className="bg-linear-to-r from-primary to-[#aef452] h-full rounded-full"
              />
            </div>
            {/* Stats breakdown */}
            <div className="mt-3 xs:mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3 text-center">
              <div className="p-2 xs:p-3 bg-gray-50 rounded-lg">
                <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-700">{stats.assigned}</p>
                <p className="text-[10px] xs:text-xs text-[#6B7280] font-semibold">Assigned</p>
              </div>
              <div className="p-2 xs:p-3 bg-purple-50 rounded-lg">
                <p className="text-lg xs:text-xl sm:text-2xl font-bold text-purple-600">{stats.ongoing}</p>
                <p className="text-[10px] xs:text-xs text-[#6B7280] font-semibold">Ongoing</p>
              </div>
              <div className="p-2 xs:p-3 bg-blue-50 rounded-lg">
                <p className="text-lg xs:text-xl sm:text-2xl font-bold text-blue-600">{stats.submitted}</p>
                <p className="text-[10px] xs:text-xs text-[#6B7280] font-semibold">Submitted</p>
              </div>
              <div className="p-2 xs:p-3 bg-green-50 rounded-lg">
                <p className="text-lg xs:text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-[10px] xs:text-xs text-[#6B7280] font-semibold">Completed</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-md mb-4 xs:mb-6 sm:mb-8">
          <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
            <div className="p-1.5 xs:p-2 bg-green-100 rounded-lg">
              <Filter className="text-primary w-4 h-4 xs:w-5 xs:h-5" />
            </div>
            <h3 className="text-sm xs:text-base sm:text-lg font-bold text-[#002E2E]">Filter by Status</h3>
          </div>
          <div className="flex gap-1.5 xs:gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All Tasks', color: 'text-gray-700 border-gray-300' },
              { value: 'pending', label: 'Assigned', color: 'text-gray-700 border-gray-300' },
              { value: 'ongoing', label: 'Ongoing', color: 'text-purple-700 border-purple-300' },
              { value: 'submitted', label: 'Submitted', color: 'text-blue-700 border-blue-300' },
              { value: 'completed', label: 'Completed', color: 'text-green-700 border-green-300' },
              { value: 'rejected', label: 'Rejected', color: 'text-red-700 border-red-300' },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setFilters({ ...filters, status: status.value })}
                className={`px-2 xs:px-3 sm:px-4 md:px-5 py-1.5 xs:py-2 rounded-md xs:rounded-lg text-[10px] xs:text-xs sm:text-sm font-bold transition-all duration-300 border-2 transform hover:scale-105 ${filters.status === status.value
                  ? 'bg-linear-to-r from-primary to-[#1e5d22] text-white border-primary shadow-lg'
                  : `bg-white border-${status.color.split(' ')[1]} ${status.color} hover:shadow-md`
                  }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Grid or Empty State */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg xs:rounded-xl p-6 xs:p-8 sm:p-12 md:p-16 shadow-lg text-center">
            <div className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl mb-3 xs:mb-4">
              {tasks.length === 0 ? '📋' : '🔍'}
            </div>
            <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#002E2E] mb-2 xs:mb-3">
              {tasks.length === 0 ? 'No Tasks Yet' : 'No Tasks Found'}
            </h3>
            <p className="text-sm xs:text-base sm:text-lg text-[#6B7280] mb-4 xs:mb-6 sm:mb-8 max-w-md mx-auto">
              {tasks.length === 0
                ? 'Check back soon for new cleanup tasks assigned to you'
                : `No tasks with status: ${filters.status}`}
            </p>
            {tasks.length > 0 && (
              <Button
                variant="primary"
                onClick={() => setFilters({ ...filters, status: 'all' })}
                className="inline-flex items-center gap-2 px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-bold"
              >
                Show All Tasks
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-3 xs:mb-4 sm:mb-6 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
              <div>
                <p className="text-xs xs:text-sm sm:text-base text-[#6B7280] font-semibold">
                  Showing <span className="text-primary font-bold">{filteredTasks.length}</span> of <span className="text-primary font-bold">{tasks.length}</span> tasks
                </p>
              </div>
              <div className="text-xs xs:text-sm text-[#6B7280] font-medium">
                {filters.status !== 'all' && (
                  <button
                    onClick={() => setFilters({ ...filters, status: 'all' })}
                    className="text-primary hover:underline font-bold"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-lg xs:rounded-xl shadow-md border-2 border-gray-200 hover:shadow-xl hover:border-primary transition-all duration-300 overflow-hidden group">
                    {/* Progress Bar */}
                    <div className="h-1 xs:h-1.5 bg-gray-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${task.progress || 50}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`h-full ${(task.progress || 50) === 100 ? 'bg-success' :
                          (task.progress || 50) >= 75 ? 'bg-primary' :
                            (task.progress || 50) >= 50 ? 'bg-warning' :
                              'bg-error'
                          }`}
                      />
                    </div>

                    <div className="p-3 xs:p-4 sm:p-5">
                      {/* Status Badge and Progress */}
                      <div className="flex justify-between items-start mb-2 xs:mb-3">
                        <span className={`px-2 xs:px-3 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-bold whitespace-nowrap ${task.status === 'completed' || task.status === 'verified' ? 'bg-success/10 text-success' :
                          task.status === 'submitted' ? 'bg-info/10 text-info' :
                            task.status === 'rejected' ? 'bg-error/10 text-error' :
                              task.status === 'in-progress' ? 'bg-purple-100 text-purple-700' :
                                task.status === 'accepted' ? 'bg-warning/10 text-warning' :
                                  'bg-gray-100 text-gray-700'
                          }`}>
                          {task.status === 'assigned' ? 'Assigned' :
                            task.status === 'accepted' ? 'Accepted' :
                              task.status === 'in-progress' ? 'In Progress' :
                                task.status === 'submitted' ? 'Under Review' :
                                  task.status === 'rejected' ? 'Rejected' :
                                    task.status === 'completed' ? 'Completed' :
                                      task.status === 'verified' ? 'Verified' : task.status}
                        </span>
                        <span className="text-[10px] xs:text-xs sm:text-sm font-bold text-[#6B7280]">{task.progress || 50}%</span>
                      </div>

                      {/* Task Title */}
                      <h3 className="font-bold text-[#002E2E] text-sm xs:text-base mb-1 xs:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {task.title}
                      </h3>

                      {/* Task Description */}
                      <p className="text-[#6B7280] text-xs xs:text-sm mb-2 xs:mb-3 line-clamp-2">{task.description}</p>

                      {/* Location Info */}
                      <div className="flex items-center text-xs xs:text-sm text-[#6B7280] mb-3 xs:mb-4">
                        <MapPin className="w-3 h-3 xs:w-4 xs:h-4 text-primary mr-1.5 xs:mr-2" />
                        <span className="line-clamp-1">{task.report?.location?.district || 'Unknown'}</span>
                      </div>

                      {/* Rejection Notice */}
                      {task.status === 'rejected' && task.rejectionReason && (
                        <div className="mb-3 xs:mb-4 p-2 xs:p-3 bg-error/10 border border-error/30 rounded-lg">
                          <div className="flex items-start space-x-1.5 xs:space-x-2">
                            <AlertCircle className="w-3 h-3 xs:w-4 xs:h-4 text-error shrink-0 mt-0.5" />
                            <p className="text-[10px] xs:text-xs text-error font-semibold">{task.rejectionReason}</p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-1.5 xs:gap-2">
                        {task.status === 'assigned' && (
                          <Link href={`/dashboard/problemSolver/tasks/${task._id}`} className="flex-1">
                            <button className="w-full py-2 xs:py-2.5 bg-linear-to-r from-primary to-[#1e5d22] text-white rounded-md xs:rounded-lg font-bold hover:shadow-lg transition-all duration-300 text-[10px] xs:text-xs sm:text-sm">
                              View & Accept
                            </button>
                          </Link>
                        )}

                        {task.status === 'accepted' && (
                          <>
                            <button
                              onClick={() => handleStartTask(task._id)}
                              className="flex-1 py-2 xs:py-2.5 bg-linear-to-r from-primary to-[#1e5d22] text-white rounded-md xs:rounded-lg font-bold hover:shadow-lg transition-all duration-300 text-[10px] xs:text-xs sm:text-sm"
                            >
                              Start
                            </button>
                            <Link href={`/dashboard/problemSolver/tasks/${task._id}`} className="px-2 xs:px-3 py-2 xs:py-2.5 bg-white border-2 border-primary text-primary rounded-md xs:rounded-lg hover:bg-primary/5 transition-all duration-300">
                              <Eye className="w-4 h-4 xs:w-5 xs:h-5" />
                            </Link>
                          </>
                        )}

                        {task.status === 'in-progress' && (
                          <>
                            <button
                              onClick={() => handleOpenProofModal(task._id)}
                              className="flex-1 py-2 xs:py-2.5 bg-linear-to-r from-primary to-[#1e5d22] text-white rounded-md xs:rounded-lg font-bold hover:shadow-lg transition-all duration-300 text-[10px] xs:text-xs sm:text-sm"
                            >
                              Submit
                            </button>
                            <Link href={`/dashboard/problemSolver/tasks/${task._id}`} className="px-2 xs:px-3 py-2 xs:py-2.5 bg-white border-2 border-primary text-primary rounded-md xs:rounded-lg hover:bg-primary/5 transition-all duration-300">
                              <Eye className="w-4 h-4 xs:w-5 xs:h-5" />
                            </Link>
                          </>
                        )}

                        {task.status === 'submitted' && (
                          <Link href={`/dashboard/problemSolver/tasks/${task._id}`} className="w-full">
                            <button className="w-full py-2 xs:py-2.5 bg-info/10 text-info rounded-md xs:rounded-lg font-bold border-2 border-info/30 hover:shadow-lg transition-all duration-300 text-[10px] xs:text-xs sm:text-sm flex items-center justify-center gap-1 xs:gap-2">
                              <Clock className="w-3 h-3 xs:w-4 xs:h-4" />
                              Under Review
                            </button>
                          </Link>
                        )}

                        {task.status === 'rejected' && (
                          <>
                            <button
                              onClick={() => handleOpenProofModal(task._id)}
                              className="flex-1 py-2 xs:py-2.5 bg-linear-to-r from-orange-500 to-red-600 text-white rounded-md xs:rounded-lg font-bold hover:shadow-lg transition-all duration-300 text-[10px] xs:text-xs sm:text-sm"
                            >
                              Resubmit
                            </button>
                            <Link href={`/dashboard/problemSolver/tasks/${task._id}`} className="px-2 xs:px-3 py-2 xs:py-2.5 bg-white border-2 border-orange-500 text-orange-600 rounded-md xs:rounded-lg hover:bg-orange-50 transition-all duration-300">
                              <Eye className="w-4 h-4 xs:w-5 xs:h-5" />
                            </Link>
                          </>
                        )}

                        {(task.status === 'completed' || task.status === 'verified') && (
                          <Link href={`/dashboard/problemSolver/tasks/${task._id}`} className="w-full">
                            <button className="w-full py-2 xs:py-2.5 bg-success/10 text-success rounded-md xs:rounded-lg font-bold border-2 border-success/30 hover:shadow-lg transition-all duration-300 text-[10px] xs:text-xs sm:text-sm flex items-center justify-center gap-1 xs:gap-2">
                              <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4" />
                              Completed
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Proof Submission Modal */}
        <AnimatePresence>
          {showProofModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4"
              onClick={() => setShowProofModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl xs:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-3 xs:p-4 sm:p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800">Submit Work Proof</h3>
                    <p className="text-xs xs:text-sm text-gray-600 mt-0.5 xs:mt-1">Upload images and description of completed work</p>
                  </div>
                  <Button
                    onClick={() => setShowProofModal(false)}
                    variant="ghost"
                    size="sm"
                    className="p-1.5 xs:p-2 min-w-0 w-8 h-8 xs:w-10 xs:h-10 rounded-full"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 xs:w-6 xs:h-6" />
                  </Button>
                </div>

                {/* Modal Body */}
                <div className="p-3 xs:p-4 sm:p-6 space-y-4 xs:space-y-5 sm:space-y-6">
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-2 xs:mb-3">
                      Upload Proof Images *
                    </label>

                    {/* Image Preview Grid */}
                    <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 xs:gap-3 mb-2 xs:mb-3">
                      {proofImages.map((image, index) => (
                        <div key={index} className="relative group aspect-square">
                          <Image
                            src={image}
                            alt={`Proof ${index + 1}`}
                            fill
                            className="object-cover rounded-md xs:rounded-lg border-2 border-gray-300"
                          />
                          <Button
                            onClick={() => handleRemoveImage(index)}
                            variant="danger"
                            size="sm"
                            className="absolute top-0.5 right-0.5 xs:top-1 xs:right-1 min-w-0 w-6 h-6 xs:w-8 xs:h-8 p-0 opacity-0 group-hover:opacity-100"
                            aria-label="Remove image"
                          >
                            <X className="w-3 h-3 xs:w-4 xs:h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Upload Button */}
                    <label className="flex items-center justify-center w-full px-3 xs:px-4 py-4 xs:py-6 sm:py-8 border-2 border-dashed border-gray-300 rounded-md xs:rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-300">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-1 xs:mb-2" />
                        <p className="text-xs xs:text-sm font-semibold text-gray-700">Click to upload images</p>
                        <p className="text-[10px] xs:text-xs text-gray-500 mt-0.5 xs:mt-1">PNG, JPG up to 5MB each</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] xs:text-xs text-gray-500 mt-1.5 xs:mt-2">
                      {proofImages.length} image(s) uploaded. At least 1 image is required.
                    </p>
                  </div>

                  {/* Description Section */}
                  <div>
                    <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-2 xs:mb-3">
                      Work Description *
                    </label>
                    <textarea
                      value={proofDescription}
                      onChange={(e) => setProofDescription(e.target.value)}
                      rows={4}
                      placeholder="Describe the work you completed, materials used, challenges faced, etc..."
                      className="w-full px-3 xs:px-4 py-2 xs:py-3 border border-gray-300 rounded-md xs:rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-xs xs:text-sm"
                    />
                    <p className="text-[10px] xs:text-xs text-gray-500 mt-1.5 xs:mt-2">
                      {proofDescription.length} characters. Provide detailed information about your work.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 xs:space-x-3 pt-2 xs:pt-4">
                    <Button
                      onClick={() => setShowProofModal(false)}
                      variant="ghost"
                      size="lg"
                      className="flex-1 text-xs xs:text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitProof}
                      disabled={submittingProof || proofImages.length === 0 || !proofDescription.trim()}
                      variant="primary"
                      size="lg"
                      iconPosition="right"
                      isLoading={submittingProof}
                      className="flex-1 text-xs xs:text-sm"
                    >
                      Submit Proof
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}