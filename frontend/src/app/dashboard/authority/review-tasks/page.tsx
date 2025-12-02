'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FullPageLoading } from '@/components/common';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { taskAPI } from '@/utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ImageIcon,
  FileText,
  Award,
  Star,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TaskReview {
  _id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  priority: string;
  proof: {
    images: string[];
    description: string;
    submittedAt: string;
  };
  submittedAt: string;
  resubmissionCount: number;
  report: {
    _id: string;
    title: string;
    description?: string;
    problemType?: string;
    category?: string;
    subcategory?: string;
    location: any;
    images: string[];
  };
  solver: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

export default function TaskReviewPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskReview | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewData, setReviewData] = useState({
    points: 30,
    rating: 5,
    feedback: '',
    rejectionReason: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.role !== 'authority' && user?.role !== 'superAdmin') {
      toast.error('Access denied. Authority or SuperAdmin only.');
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'authority' || user?.role === 'superAdmin') {
      fetchPendingTasks();
    }
  }, [user]);

  const fetchPendingTasks = async () => {
    try {
      setLoading(true);
      // Pass division filter for authority users (filter by report's division, not solver's)
      const filters: any = {};
      if (user?.role === 'authority' && user.division) {
        filters.division = user.division;
      }

      const response = await taskAPI.getPendingReview(filters);

      if (response.success) {
        setTasks(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching pending tasks:', error);
      toast.error(error.message || 'Failed to load pending tasks');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (task: TaskReview, action: 'approve' | 'reject') => {
    setSelectedTask(task);
    setReviewAction(action);

    // Set default points based on priority
    const pointsMap: any = { low: 20, medium: 30, high: 50, urgent: 100 };
    setReviewData({
      points: pointsMap[task.priority] || 30,
      rating: 5,
      feedback: action === 'approve' ? 'Excellent work! Keep it up.' : '',
      rejectionReason: '',
    });

    setShowReviewModal(true);
  };

  const handleReview = async () => {
    if (!selectedTask) return;

    if (reviewAction === 'reject' && !reviewData.rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setSubmitting(true);

      if (reviewAction === 'approve') {
        await taskAPI.approveTask(selectedTask._id, {
          points: reviewData.points,
          rating: reviewData.rating,
          feedback: reviewData.feedback,
        });
        const solverName = selectedTask.solver?.name || 'the solver';
        toast.success(`✅ Task approved! ${reviewData.points} points awarded to ${solverName}`);
        addNotification({
          title: 'Task Approved',
          message: `You approved "${selectedTask.title}" and awarded ${reviewData.points} points to ${solverName}`,
          type: 'success',
        });
      } else {
        await taskAPI.rejectTask(selectedTask._id, reviewData.rejectionReason);
        toast.success('📝 Task rejected. Solver will be notified to resubmit.');
        addNotification({
          title: 'Task Rejected',
          message: `You rejected "${selectedTask.title}". The solver has been notified to resubmit.`,
          type: 'warning',
        });
      }

      setShowReviewModal(false);
      setSelectedTask(null);
      fetchPendingTasks();
    } catch (error: any) {
      console.error('Error reviewing task:', error);
      toast.error(error.message || 'Failed to review task');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      low: 'bg-green-100 text-green-700 border-green-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      urgent: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[priority] || colors.medium;
  };

  if (authLoading || loading) {
    return <FullPageLoading text="Loading pending reviews..." />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-green-50/30 to-blue-50/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Task Review Center
              </h1>
              <p className="text-gray-600">
                Review submitted work, approve or request improvements
              </p>
            </div>
            <button
              onClick={fetchPendingTasks}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-linear-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 mb-8 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white/90 text-sm font-medium">Pending Reviews</p>
              <p className="text-4xl font-bold">{tasks.length}</p>
              <p className="text-white/80 text-sm mt-1">
                {tasks.length === 0 ? 'All caught up! 🎉' : 'Tasks waiting for your review'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
            <p className="text-gray-600">No tasks pending review at the moment.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.resubmissionCount > 1 && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-300">
                            Resubmission #{task.resubmissionCount}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>

                      {/* Solver Info */}
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {task.solver.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{task.solver.name}</p>
                          <p className="text-sm text-gray-600">{task.solver.email} • Problem Solver</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Proof Section */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      Submitted Proof
                    </h4>

                    {/* Proof Description */}
                    {task.proof.description && (
                      <div className="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-700">{task.proof.description}</p>
                      </div>
                    )}

                    {/* Proof Images */}
                    {task.proof.images && task.proof.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {task.proof.images.map((image, idx) => (
                          <a
                            key={idx}
                            href={image}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`View proof image ${idx + 1}`}
                            className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer border-2 border-gray-200 hover:border-green-500 transition-all"
                          >
                            <Image
                              src={image}
                              alt={`Proof ${idx + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-8 h-8 text-white" />
                            </div>
                          </a>
                        ))}
                      </div>
                    )}

                    {(!task.proof.images || task.proof.images.length === 0) && !task.proof.description && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-700">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm">No proof description or images provided</span>
                      </div>
                    )}
                  </div>

                  {/* Report Reference */}
                  <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Original Report:</p>
                    <p className="font-semibold text-gray-900">{task.report.title}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {task.report.location?.district}, {task.report.location?.division}
                    </p>
                    {/* Problem Classification */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {task.report.problemType && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold capitalize">
                          Type: {task.report.problemType}
                        </span>
                      )}
                      {task.report.category && (
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {task.report.category}
                        </span>
                      )}
                      {task.report.subcategory && (
                        <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          {task.report.subcategory}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submission Info */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <span>Submitted: {new Date(task.submittedAt).toLocaleString()}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.floor((Date.now() - new Date(task.submittedAt).getTime()) / (1000 * 60 * 60))} hours ago
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => openReviewModal(task, 'approve')}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg hover:shadow-xl"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve & Reward
                    </button>
                    <button
                      onClick={() => openReviewModal(task, 'reject')}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg hover:shadow-xl"
                    >
                      <XCircle className="w-5 h-5" />
                      Request Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        <AnimatePresence>
          {showReviewModal && selectedTask && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    {reviewAction === 'approve' ? (
                      <>
                        <CheckCircle className="w-7 h-7 text-green-600" />
                        Approve Task
                      </>
                    ) : (
                      <>
                        <XCircle className="w-7 h-7 text-red-600" />
                        Request Changes
                      </>
                    )}
                  </h2>

                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900">{selectedTask.title}</p>
                    <p className="text-sm text-gray-600">by {selectedTask.solver.name}</p>
                  </div>

                  {reviewAction === 'approve' ? (
                    <div className="space-y-4">
                      {/* Points */}
                      <div>
                        <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                          <Award className="w-4 h-4 text-yellow-500" />
                          Reward Points
                        </label>
                        <input
                          aria-label="Reward points"
                          type="number"
                          value={reviewData.points}
                          onChange={(e) => setReviewData({ ...reviewData, points: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          min="0"
                          max="1000"
                        />
                        <p className="text-xs text-gray-500 mt-1">Suggested: Low=20, Medium=30, High=50, Urgent=100</p>
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              aria-label={`Set rating to ${star} star${star > 1 ? 's' : ''}`}
                              key={star}
                              type="button"
                              onClick={() => setReviewData({ ...reviewData, rating: star })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-8 h-8 ${star <= reviewData.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                                  } transition-colors`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Feedback */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Feedback (Optional)
                        </label>
                        <textarea
                          value={reviewData.feedback}
                          onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                          rows={4}
                          placeholder="Great work! Keep it up..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reason for Rejection <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={reviewData.rejectionReason}
                        onChange={(e) => setReviewData({ ...reviewData, rejectionReason: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        rows={5}
                        placeholder="Please explain what needs to be improved or corrected..."
                        required
                      />
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowReviewModal(false)}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReview}
                      disabled={submitting}
                      className={`flex-1 px-6 py-3 rounded-lg transition-all font-semibold text-white ${reviewAction === 'approve'
                        ? 'bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                        : 'bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                        } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {submitting ? 'Processing...' : reviewAction === 'approve' ? 'Approve & Award Points' : 'Send for Revision'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
