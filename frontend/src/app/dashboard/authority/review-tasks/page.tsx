'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FullPageLoading } from '@/components/common';
import { useNotifications } from '@/context/NotificationContext';
import Button from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { taskAPI } from '@/utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/common/Card';
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
  ClipboardCheck,
  TrendingUp,
  Zap,
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
    <>
      <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 bg-base-300 min-h-screen container mx-auto">
        {/* Welcome Section with Gradient Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-accent"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
            Task Review Center 📋
          </h1>
          <p className="text-white/90 text-lg font-semibold">
            Review submitted work and provide feedback to problem solvers
          </p>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Pending Reviews', value: tasks.length, icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { title: 'Approved Today', value: 0, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
            { title: 'Changes Requested', value: 0, icon: AlertCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
            { title: 'Total Reviewed', value: 0, icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-50' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-2xl p-6 border-2 border-accent/20 hover:scale-105 transition-transform`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-neutral/70 uppercase tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-extrabold text-info mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} bg-white/50 p-3 rounded-xl`}>
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
            className="bg-base-100 rounded-3xl shadow-xl p-12 text-center border-2 border-accent/20"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-info mb-2">All Caught Up! 🎉</h2>
            <p className="text-neutral/70">No tasks pending review at the moment.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="bg-base-100 rounded-3xl shadow-xl border-2 border-accent/20 overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-2xl font-bold text-info">{task.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.resubmissionCount > 1 && (
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-secondary/20 text-secondary border border-secondary/40">
                            Resubmission #{task.resubmissionCount}
                          </span>
                        )}
                      </div>
                      <p className="text-neutral/70 mb-4">{task.description}</p>

                      {/* Solver Info */}
                      <div className="flex items-center gap-4 p-4 bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
                        <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {task.solver.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-info">{task.solver.name}</p>
                          <p className="text-sm text-neutral/60">{task.solver.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Proof Section */}
                  <div className="mb-6">
                    <h4 className="font-bold text-info mb-4 flex items-center gap-2 text-lg">
                      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white">
                        <FileText className="w-5 h-5" />
                      </div>
                      Submitted Proof
                    </h4>

                    {/* Proof Description */}
                    {task.proof.description && (
                      <div className="mb-4 p-4 bg-linear-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10">
                        <p className="text-neutral/80 leading-relaxed">{task.proof.description}</p>
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
                            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border-2 border-accent/20 hover:border-secondary transition-all"
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
                      <div className="p-4 bg-yellow-50/50 border border-yellow-200/50 rounded-xl flex items-center gap-3 text-yellow-700">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium">No proof description or images provided</span>
                      </div>
                    )}
                  </div>

                  {/* Report Reference */}
                  <div className="mb-6 p-5 bg-linear-to-br from-secondary/5 to-accent/5 rounded-2xl border-2 border-secondary/20">
                    <p className="text-sm font-bold text-neutral/60 uppercase tracking-wide mb-2">📋 Original Report</p>
                    <p className="font-bold text-info text-lg mb-1">{task.report.title}</p>
                    <p className="text-sm text-neutral/70 mb-3">
                      {task.report.location?.district}, {task.report.location?.division}
                    </p>
                    {/* Problem Classification */}
                    <div className="flex flex-wrap gap-2">
                      {task.report.problemType && (
                        <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wide">
                          {task.report.problemType}
                        </span>
                      )}
                      {task.report.category && (
                        <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-bold uppercase tracking-wide">
                          {task.report.category}
                        </span>
                      )}
                      {task.report.subcategory && (
                        <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-bold uppercase tracking-wide">
                          {task.report.subcategory}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submission Info */}
                  <div className="flex items-center justify-between mb-6 text-sm text-neutral/70 font-semibold">
                    <span>📅 {new Date(task.submittedAt).toLocaleString()}</span>
                    <span className="flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      {Math.floor((Date.now() - new Date(task.submittedAt).getTime()) / (1000 * 60 * 60))} hrs ago
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => openReviewModal(task, 'approve')}
                      className="flex-1 px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve & Reward
                    </button>
                    <button
                      onClick={() => openReviewModal(task, 'reject')}
                      className="flex-1 px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-base-100 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-accent/20"
              >
                <div className="p-8">
                  <h2 className="text-3xl font-extrabold text-info mb-6 flex items-center gap-3">
                    {reviewAction === 'approve' ? (
                      <>
                        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        Approve Task
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white">
                          <XCircle className="w-6 h-6" />
                        </div>
                        Request Changes
                      </>
                    )}
                  </h2>

                  <div className="mb-6 p-5 bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
                    <p className="font-bold text-info text-lg mb-1">{selectedTask.title}</p>
                    <p className="text-neutral/70">by {selectedTask.solver.name}</p>
                  </div>

                  {reviewAction === 'approve' ? (
                    <div className="space-y-5">
                      {/* Points */}
                      <div>
                        <label className="flex text-sm font-bold text-info mb-3 items-center gap-2 uppercase tracking-wide">
                          <Award className="w-5 h-5 text-accent" />
                          Reward Points
                        </label>
                        <input
                          aria-label="Reward points"
                          type="number"
                          value={reviewData.points}
                          onChange={(e) => setReviewData({ ...reviewData, points: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 border-2 border-accent/20 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-info font-semibold"
                          min="0"
                          max="1000"
                        />
                        <p className="text-xs text-neutral/60 mt-2 font-medium">💡 Suggested: Low=20, Medium=30, High=50, Urgent=100</p>
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="flex text-sm font-bold text-info mb-3 items-center gap-2 uppercase tracking-wide">
                          <Star className="w-5 h-5 text-accent" />
                          Rating
                        </label>
                        <div className="flex gap-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              aria-label={`Set rating to ${star} star${star > 1 ? 's' : ''}`}
                              key={star}
                              type="button"
                              onClick={() => setReviewData({ ...reviewData, rating: star })}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-9 h-9 ${star <= reviewData.rating
                                    ? 'fill-accent text-accent'
                                    : 'text-neutral/30'
                                  } transition-colors`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Feedback */}
                      <div>
                        <label className="block text-sm font-bold text-info mb-3 uppercase tracking-wide">
                          Feedback (Optional)
                        </label>
                        <textarea
                          value={reviewData.feedback}
                          onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-accent/20 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral resize-none font-medium"
                          rows={4}
                          placeholder="Great work! Keep it up..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-bold text-info mb-3 uppercase tracking-wide">
                        Reason for Rejection <span className="text-red-500 text-lg">*</span>
                      </label>
                      <textarea
                        value={reviewData.rejectionReason}
                        onChange={(e) => setReviewData({ ...reviewData, rejectionReason: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-accent/20 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-base-200 text-neutral resize-none font-medium"
                        rows={5}
                        placeholder="Please explain what needs to be improved or corrected..."
                        required
                      />
                    </div>
                  )}

                  <div className="flex gap-3 mt-8 pt-6 border-t border-accent/20">
                    <button
                      onClick={() => setShowReviewModal(false)}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 text-info font-bold rounded-xl hover:bg-base-200 transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReview}
                      disabled={submitting || (reviewAction === 'reject' && !reviewData.rejectionReason.trim())}
                      className={`flex-1 px-6 py-3 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 ${reviewAction === 'approve' ? 'bg-secondary hover:shadow-lg' : 'bg-red-500 hover:shadow-lg'
                        }`}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>{reviewAction === 'approve' ? 'Approving...' : 'Sending...'}</span>
                        </>
                      ) : (
                        <>
                          {reviewAction === 'approve' ? (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              <span>Approve & Award Points</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5" />
                              <span>Send for Revision</span>
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
