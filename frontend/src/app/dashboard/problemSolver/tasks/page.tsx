"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, MapPin, AlertTriangle, CheckCircle, Clock, Sparkles, Target, TrendingUp, Upload, X, Image as ImageIcon, FileText, Send, AlertCircle, Eye, RefreshCw } from "lucide-react";
import TaskCard from "@/components/solver/TaskCard";
import TaskFilterBar from "@/components/solver/TaskFilterBar";
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

  // Fetch tasks function
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
        toast.success('Tasks refreshed successfully!');
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

  // Fetch tasks on mount
  useEffect(() => {
    if (user && (user.role === 'problemSolver' || user.role === 'ngo')) {
      fetchTasks();
    }
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
    totalPoints: tasks.filter(t => t.status === 'completed' || t.status === 'verified').length * 10 // Placeholder points calculation
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

  // Accept Task
  const handleAcceptTask = async (taskId: string) => {
    try {
      const response = await taskAPI.acceptTask(taskId);
      if (response.success) {
        toast.success("Task accepted! You can now start working on it. 🎯");
        addNotification({
          title: 'Task Accepted',
          message: 'You have successfully accepted a task. You can now start working on it.',
          type: 'success',
        });
        // Refresh tasks
        const updatedTasks = await taskAPI.getMyTasks();
        if (updatedTasks.success) {
          setTasks(updatedTasks.data);
        }
      } else {
        toast.error(response.message || 'Failed to accept task');
      }
    } catch (error: any) {
      console.error('Error accepting task:', error);
      toast.error(error.message || 'Failed to accept task');
    }
  };

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
    } catch (error: any) {
      console.error('Error starting task:', error);
      toast.error(error.message || 'Failed to start task');
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
    } catch (error: any) {
      console.error('Error submitting proof:', error);
      toast.error(error.message || 'Failed to submit proof');
    } finally {
      setSubmittingProof(false);
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Your Missions
            </h1>
            <p className="text-gray-600 mt-2">Manage and complete your assigned cleanup tasks</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchTasks}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-green-500 text-green-600 rounded-full hover:bg-green-50 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh tasks"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-semibold">Refresh</span>
            </button>
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">{stats.totalPoints} Points Earned</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-6 gap-4"
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
                <p className="text-sm text-gray-600">Total</p>
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
                <p className="text-2xl font-bold text-gray-800">{stats.assigned}</p>
                <p className="text-sm text-gray-600">Assigned</p>
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
                <p className="text-sm text-gray-600">Ongoing</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.submitted}</p>
                <p className="text-sm text-gray-600">Submitted</p>
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

          <motion.div
            variants={containerVariants}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <TaskFilterBar filters={filters} onFiltersChange={setFilters} />

        {/* Enhanced Task Cards with Workflow Actions */}
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
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Progress Bar */}
                <div className="h-2 bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress || 50}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full ${
                      (task.progress || 50) === 100 ? 'bg-green-500' :
                      (task.progress || 50) >= 90 ? 'bg-blue-500' :
                      (task.progress || 50) >= 75 ? 'bg-yellow-500' :
                      'bg-orange-500'
                    }`}
                  />
                </div>

                <div className="p-5">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      task.status === 'completed' || task.status === 'verified' ? 'bg-green-100 text-green-700' :
                      task.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                      task.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      task.status === 'in-progress' ? 'bg-purple-100 text-purple-700' :
                      task.status === 'accepted' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status === 'assigned' ? 'New Assignment' :
                       task.status === 'accepted' ? 'Accepted' :
                       task.status === 'in-progress' ? 'In Progress' :
                       task.status === 'submitted' ? 'Under Review' :
                       task.status === 'rejected' ? 'Needs Resubmission' :
                       task.status === 'completed' ? 'Completed' :
                       task.status === 'verified' ? 'Verified' : task.status}
                    </span>
                    <span className="text-lg font-bold text-gray-700">{task.progress || 50}%</span>
                  </div>

                  {/* Task Info */}
                  <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">{task.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 text-green-600 mr-2" />
                    <span>{task.report?.location?.district || 'Unknown'}, {task.report?.location?.division || 'N/A'}</span>
                  </div>

                  {/* Rejection Notice */}
                  {task.status === 'rejected' && task.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">Rejection Feedback:</p>
                          <p className="text-sm text-red-700">{task.rejectionReason}</p>
                          {task.resubmissionCount ? (
                            <p className="text-xs text-red-600 mt-1">Resubmission #{task.resubmissionCount}</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Workflow Actions */}
                  <div className="space-y-2">
                    {/* View Details Button */}
                    {task.status === 'assigned' && (
                      <Link
                        href={`/dashboard/problemSolver/tasks/${task._id}`}
                        className="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-5 h-5" />
                        <span>View Details to Accept</span>
                      </Link>
                    )}

                    {/* Start Working Button */}
                    {task.status === 'accepted' && (
                      <button
                        onClick={() => handleStartTask(task._id)}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <TrendingUp className="w-5 h-5" />
                        <span>Start Working</span>
                      </button>
                    )}

                    {/* Submit Proof Button */}
                    {task.status === 'in-progress' && (
                      <button
                        onClick={() => handleOpenProofModal(task._id)}
                        className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Submit Proof</span>
                      </button>
                    )}

                    {/* Resubmit Button */}
                    {task.status === 'rejected' && (
                      <button
                        onClick={() => handleOpenProofModal(task._id)}
                        className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Resubmit Proof</span>
                      </button>
                    )}

                    {/* Waiting for Review */}
                    {task.status === 'submitted' && (
                      <div className="w-full py-2.5 bg-blue-50 text-blue-700 rounded-lg font-semibold text-center border border-blue-200">
                        <Clock className="w-5 h-5 inline mr-2" />
                        Waiting for Review...
                      </div>
                    )}

                    {/* Completed */}
                    {(task.status === 'completed' || task.status === 'verified') && (
                      <div className="w-full py-2.5 bg-green-50 text-green-700 rounded-lg font-semibold text-center border border-green-200">
                        <CheckCircle className="w-5 h-5 inline mr-2" />
                        Task Completed!
                      </div>
                    )}
                  </div>
                </div>
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

      {/* Proof Submission Modal */}
      <AnimatePresence>
        {showProofModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProofModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Submit Work Proof</h3>
                  <p className="text-sm text-gray-600 mt-1">Upload images and description of completed work</p>
                </div>
                <button
                  onClick={() => setShowProofModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Upload Proof Images *
                  </label>

                  {/* Image Preview Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {proofImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Proof ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Upload Button */}
                  <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-300">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-700">Click to upload images</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    {proofImages.length} image(s) uploaded. At least 1 image is required.
                  </p>
                </div>

                {/* Description Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Work Description *
                  </label>
                  <textarea
                    value={proofDescription}
                    onChange={(e) => setProofDescription(e.target.value)}
                    rows={6}
                    placeholder="Describe the work you completed, materials used, challenges faced, etc..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {proofDescription.length} characters. Provide detailed information about your work.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowProofModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitProof}
                    disabled={submittingProof || proofImages.length === 0 || !proofDescription.trim()}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white flex items-center justify-center space-x-2 transition-all duration-300 ${
                      submittingProof || proofImages.length === 0 || !proofDescription.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                    }`}
                  >
                    {submittingProof ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Proof</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}