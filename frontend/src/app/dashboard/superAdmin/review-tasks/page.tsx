'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FullPageLoading } from '@/components/common';
import { useNotifications } from '@/context/NotificationContext';
import { taskAPI } from '@/utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  Award,
  Star,
  RefreshCw,
  AlertCircle,
  RotateCcw,
  Zap,
  MapPin,
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/common/Card';

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
  const { user } = useAuth();
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
    if (user?.role === 'authority' || user?.role === 'superAdmin') {
      fetchPendingTasks();
    }
  }, [user]);

  const fetchPendingTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getPendingReview();
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

  if (loading) {
    return <FullPageLoading text="Loading pending reviews..." />;
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-accent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-2">
              Task Review Center 📋
            </h1>
            <p className="text-white/90 text-base sm:text-lg font-semibold">
              Review submitted work & approve or request improvements
            </p>
          </div>
          <motion.button
            onClick={fetchPendingTasks}
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all shrink-0"
            title="Refresh tasks"
          >
            <RefreshCw className="w-6 h-6" />
          </motion.button>
        </motion.div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Pending Reviews',
              value: tasks.length,
              icon: Clock,
              color: 'text-warning',
              bgColor: 'bg-warning/10',
            },
            {
              title: 'High Priority',
              value: tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length,
              icon: Zap,
              color: 'text-error',
              bgColor: 'bg-error/10',
            },
            {
              title: 'Resubmissions',
              value: tasks.filter(t => t.resubmissionCount > 1).length,
              icon: RotateCcw,
              color: 'text-secondary',
              bgColor: 'bg-secondary/10',
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-2xl p-6 border-2 border-accent/20 shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-neutral/70 uppercase tracking-wide">{stat.title}</p>
                    <p className="text-4xl font-extrabold text-info mt-3">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} bg-white/60 p-3 rounded-xl`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-base-100 rounded-3xl shadow-2xl p-12 text-center border-t-4 border-success"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.3 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/20 mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-success" />
            </motion.div>
            <h2 className="text-3xl font-extrabold text-neutral mb-2">All Caught Up! 🎉</h2>
            <p className="text-neutral/70 text-base">No tasks pending review at the moment. Great job!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-base-100 rounded-2xl shadow-lg border-2 border-accent/20 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="p-6 space-y-5">
                  {/* Task Header */}
                  <div>
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-neutral">{task.title}</h3>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border-2 ${task.priority === 'urgent'
                            ? 'bg-error/20 text-error border-error/40'
                            : task.priority === 'high'
                              ? 'bg-warning/20 text-warning border-warning/40'
                              : task.priority === 'medium'
                                ? 'bg-info/20 text-info border-info/40'
                                : 'bg-success/20 text-success border-success/40'
                          }`}
                      >
                        {task.priority}
                        {task.priority === 'urgent' && ' ⚠️'}
                        {task.priority === 'high' && ' 🔥'}
                        {task.priority === 'medium' && ' 📋'}
                        {task.priority === 'low' && ' ✓'}
                      </motion.span>
                      {task.resubmissionCount > 1 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide bg-secondary/20 text-secondary border-2 border-secondary/40"
                        >
                          Resubmission #{task.resubmissionCount} 🔄
                        </motion.span>
                      )}
                    </div>
                    <p className="text-neutral/70 text-base mb-4">{task.description}</p>

                    {/* Solver Info Card */}
                    <Card className="bg-info/10 border-2 border-info/40 p-5 shadow-md">
                      <div className="flex items-center gap-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-14 h-14 bg-gradient-to-br from-info to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        >
                          {task.solver.name.charAt(0).toUpperCase()}
                        </motion.div>
                        <div className="flex-1">
                          <p className="font-extrabold text-neutral text-lg">{task.solver.name}</p>
                          <p className="text-sm text-neutral/70">{task.solver.email}</p>
                          <div className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-info/30 text-info border border-info/50">
                            Problem Solver
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Proof Section */}
                  <div className="bg-base-200 rounded-2xl p-6 border-2 border-accent/10 shadow-md">
                    <h4 className="font-extrabold text-neutral mb-4 flex items-center gap-3 text-lg">
                      <FileText className="w-6 h-6 text-success" />
                      Submitted Proof
                    </h4>

                    {task.proof.description && (
                      <div className="mb-5 p-4 bg-white/50 rounded-xl border-2 border-accent/20">
                        <p className="text-neutral font-semibold leading-relaxed">{task.proof.description}</p>
                      </div>
                    )}

                    {task.proof.images && task.proof.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {task.proof.images.map((image, idx) => (
                          <motion.a
                            key={idx}
                            href={image}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`View proof image ${idx + 1}`}
                            whileHover={{ scale: 1.05 }}
                            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border-2 border-accent/30 hover:border-success transition-all shadow-lg"
                          >
                            <Image
                              src={image}
                              alt={`Proof ${idx + 1}`}
                              fill
                              className="object-cover group-hover:scale-125 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-8 h-8 text-white" />
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    )}

                    {(!task.proof.images || task.proof.images.length === 0) && !task.proof.description && (
                      <div className="p-4 bg-warning/10 border-2 border-warning/40 rounded-xl flex items-center gap-3 text-warning">
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <span className="font-semibold">No proof description or images provided</span>
                      </div>
                    )}
                  </div>

                  {/* Report Reference Card */}
                  <Card className="bg-success/10 border-2 border-success/40 p-6 shadow-md">
                    <div className="flex items-start gap-3 mb-4">
                      <FileText className="w-6 h-6 text-success shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-neutral/70 uppercase tracking-wide">Original Report</p>
                        <p className="text-xl font-extrabold text-neutral mt-1">{task.report.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-neutral/70 mb-4">
                      <MapPin className="w-5 h-5 text-success" />
                      <span className="font-semibold">{task.report.location?.district}, {task.report.location?.division}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {task.report.problemType && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-block px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-300"
                        >
                          Type: {task.report.problemType}
                        </motion.span>
                      )}
                      {task.report.category && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.05 }}
                          className="inline-block px-3 py-2 bg-purple-100 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wide border border-purple-300"
                        >
                          📂 {task.report.category}
                        </motion.span>
                      )}
                      {task.report.subcategory && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="inline-block px-3 py-2 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold uppercase tracking-wide border border-indigo-300"
                        >
                          🏷️ {task.report.subcategory}
                        </motion.span>
                      )}
                    </div>
                  </Card>

                  {/* Submission Info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-neutral/70 font-semibold border-t-2 border-accent/10 pt-5">
                    <span>📅 Submitted: {new Date(task.submittedAt).toLocaleString()}</span>
                    <div className="flex items-center gap-2 bg-warning/10 px-4 py-2 rounded-full border border-warning/40">
                      <Clock className="w-4 h-4 text-warning" />
                      <span className="font-bold">
                        {Math.floor((Date.now() - new Date(task.submittedAt).getTime()) / (1000 * 60 * 60))} hours ago
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-2">
                    <motion.button
                      onClick={() => openReviewModal(task, 'approve')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-success to-info text-white rounded-xl hover:shadow-lg font-bold transition-all"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Approve & Reward
                    </motion.button>
                    <motion.button
                      onClick={() => openReviewModal(task, 'reject')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-error to-warning text-white rounded-xl hover:shadow-lg font-bold transition-all"
                    >
                      <XCircle className="w-5 h-5" />
                      Request Changes
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        <AnimatePresence>
          {showReviewModal && selectedTask && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-base-100 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-accent/20"
              >
                {/* Modal Header */}
                <div className={`bg-gradient-to-r ${reviewAction === 'approve'
                    ? 'from-success to-info'
                    : 'from-error to-warning'
                  } text-white rounded-t-3xl p-8 sticky top-0 z-10 border-b-4 border-accent`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    {reviewAction === 'approve' ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      <XCircle className="w-7 h-7" />
                    )}
                    <h2 className="text-2xl sm:text-3xl font-extrabold">
                      {reviewAction === 'approve' ? 'Approve & Reward Task' : 'Request Changes'}
                    </h2>
                  </div>
                  <p className="text-white/90 text-sm font-semibold">Review and provide feedback for the solver</p>
                </div>

                <div className="p-8 space-y-5">
                  {/* Task Summary Card */}
                  <Card className="bg-neutral/5 border-2 border-accent/20 p-5 shadow-md">
                    <p className="text-xs font-bold text-neutral/70 uppercase tracking-wide mb-2">Task Summary</p>
                    <p className="text-xl font-extrabold text-neutral mb-2">{selectedTask.title}</p>
                    <p className="text-sm text-neutral/70 font-semibold">by {selectedTask.solver.name}</p>
                  </Card>

                  {reviewAction === 'approve' ? (
                    <div className="space-y-5">
                      {/* Points */}
                      <div>
                        <label className="flex text-sm font-bold text-neutral mb-2 items-center gap-2">
                          <Award className="w-4 h-4 text-warning" />
                          Reward Points
                        </label>
                        <input
                          title='suggestion'
                          type="number"
                          value={reviewData.points}
                          onChange={(e) => setReviewData({ ...reviewData, points: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border-2 border-accent/20 focus:border-accent rounded-xl focus:ring-2 focus:ring-accent/30 bg-base-100 font-semibold text-neutral transition-all"
                          min="0"
                          max="1000"
                        />
                        <p className="text-xs text-neutral/60 mt-2">Suggested: Low=20, Medium=30, High=50, Urgent=100</p>
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="flex text-sm font-bold text-neutral mb-3 items-center gap-2">
                          <Star className="w-4 h-4 text-warning" />
                          Performance Rating
                        </label>
                        <div className="flex gap-3 bg-base-200 p-4 rounded-xl">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              type="button"
                              onClick={() => setReviewData({ ...reviewData, rating: star })}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              className="focus:outline-none transition-all"
                            >
                              <Star
                                className={`w-10 h-10 transition-all ${star <= reviewData.rating
                                    ? 'fill-warning text-warning drop-shadow-lg'
                                    : 'text-neutral/40'
                                  }`}
                              />
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Feedback */}
                      <div>
                        <label className="block text-sm font-bold text-neutral mb-2">
                          Feedback (Optional)
                        </label>
                        <textarea
                          value={reviewData.feedback}
                          onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-accent/20 focus:border-accent rounded-xl focus:ring-2 focus:ring-accent/30 bg-base-100 resize-none font-semibold text-neutral placeholder-neutral/50 transition-all"
                          rows={4}
                          placeholder="Excellent work! Your attention to detail was impressive..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-bold text-neutral mb-2">
                        Reason for Changes <span className="text-error">*</span>
                      </label>
                      <textarea
                        value={reviewData.rejectionReason}
                        onChange={(e) => setReviewData({ ...reviewData, rejectionReason: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-accent/20 focus:border-error rounded-xl focus:ring-2 focus:ring-error/30 bg-base-100 resize-none font-semibold text-neutral placeholder-neutral/50 transition-all"
                        rows={5}
                        placeholder="Please explain what needs to be improved or corrected..."
                        required
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t-2 border-accent/10">
                    <motion.button
                      onClick={() => setShowReviewModal(false)}
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-3 border-2 border-accent/20 rounded-xl hover:bg-base-200 font-bold text-neutral transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleReview}
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 px-6 py-3 rounded-xl transition-all font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg bg-linear-to-r ${reviewAction === 'approve'
                          ? 'from-success to-info'
                          : 'from-error to-warning'
                        }`}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                          Processing...
                        </>
                      ) : reviewAction === 'approve' ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 inline mr-2" />
                          Approve & Award Points
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 inline mr-2" />
                          Send for Revision
                        </>
                      )}
                    </motion.button>
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
