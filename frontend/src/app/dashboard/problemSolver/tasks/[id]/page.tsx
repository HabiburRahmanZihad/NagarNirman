"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, User, AlertTriangle, CheckCircle, Clock, Star, Eye, Award, Target, TrendingUp, Upload, X, Image as ImageIcon, Send, Camera } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { taskAPI } from "@/utils/api";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { InlineError } from "@/components/common";

interface Task {
  _id: string;
  title: string;
  description: string;
  report: {
    _id: string;
    title: string;
    description: string;
    location: {
      division: string;
      district: string;
      address: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    images: string[];
    severity: 'low' | 'medium' | 'high';
    problemType: string;
    category?: string;
    subcategory?: string;
    status: string;
    createdAt: string;
  };
  solver: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
  };
  assigner: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  priority: 'low' | 'medium' | 'high';
  status: 'assigned' | 'accepted' | 'in-progress' | 'submitted' | 'completed' | 'rejected' | 'verified';
  progress: number;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  startedAt?: string;
  submittedAt?: string;
  completedAt?: string;
  proof?: {
    images: string[];
    description: string;
    submittedAt: string;
  };
  rejectionReason?: string;
  resubmissionCount?: number;
  points?: number;
  rating?: number;
  feedback?: string;
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [proofDescription, setProofDescription] = useState('');
  const [submittingProof, setSubmittingProof] = useState(false);
  const [proofError, setProofError] = useState<string | null>(null);

  const fetchTaskDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getById(params.id as string);

      if (response && response.success) {
        setTask(response.data);
      } else {
        const errorMsg = response?.message || 'Failed to load task details';
        toast.error(errorMsg);
        router.push('/dashboard/problemSolver/tasks');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load task details';
      console.error('Error fetching task:', err);
      toast.error(errorMsg);
      router.push('/dashboard/problemSolver/tasks');
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (params.id && user) {
      fetchTaskDetails();
    }
  }, [params.id, user, fetchTaskDetails]);

  const handleAcceptTask = async () => {
    if (!task) return;

    try {
      const response = await taskAPI.acceptTask(task._id);
      if (response.success) {
        toast.success('Task accepted! You can now start working on it. 🎯');
        // Refresh task details
        fetchTaskDetails();
      } else {
        toast.error(response.message || 'Failed to accept task');
      }
    } catch (err: unknown) {
      console.error('Error accepting task:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to accept task');
    }
  };

  const handleStartTask = async () => {
    if (!task) return;

    try {
      const response = await taskAPI.startTask(task._id);
      if (response.success) {
        toast.success('Task started! Good luck! 🚀');
        fetchTaskDetails();
      } else {
        toast.error(response.message || 'Failed to start task');
      }
    } catch (err: unknown) {
      console.error('Error starting task:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to start task');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setProofImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitProof = async () => {
    if (!task) return;

    setProofError(null);

    if (proofImages.length === 0) {
      const msg = 'Please upload at least one proof image';
      setProofError(msg);
      toast.error(msg);
      return;
    }

    if (!proofDescription.trim()) {
      const msg = 'Please provide a description of your work';
      setProofError(msg);
      toast.error(msg);
      return;
    }

    try {
      setSubmittingProof(true);
      const response = await taskAPI.submitProof(task._id, {
        images: proofImages,
        description: proofDescription,
      });

      if (response && response.success) {
        toast.success('Proof submitted successfully! Waiting for review. ✅');
        setShowProofModal(false);
        setProofImages([]);
        setProofDescription('');
        setProofError(null);
        fetchTaskDetails();
      } else {
        const errorMsg = response?.message || 'Failed to submit proof';
        setProofError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit proof';
      setProofError(errorMsg);
      console.error('Error submitting proof:', err);
      toast.error(errorMsg);
    } finally {
      setSubmittingProof(false);
    }
  };

  const handleOpenInMaps = () => {
    if (!task?.report?.location) {
      toast.error('Location information not available');
      return;
    }

    const { coordinates, address, district, division } = task.report.location;

    // If coordinates are available, use them for precise location
    if (coordinates?.lat && coordinates?.lng) {
      const mapsUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
      window.open(mapsUrl, '_blank');
    } else {
      // Otherwise, use address search
      const searchQuery = encodeURIComponent(`${address}, ${district}, ${division}, Bangladesh`);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
      window.open(mapsUrl, '_blank');
    }
  };

  interface SeverityConfig {
    color: string;
    bgColor: string;
    borderColor: string;
    headerBg: string;
  }

  interface StatusConfig {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  const getSeverityConfig = (severity: string): SeverityConfig => {
    const configs: Record<string, SeverityConfig> = {
      low: {
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-300',
        headerBg: 'from-green-500 to-green-600',
      },
      medium: {
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-300',
        headerBg: 'from-yellow-500 to-yellow-600',
      },
      high: {
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-300',
        headerBg: 'from-red-500 to-red-600',
      },
    };
    return configs[severity] || configs.medium;
  };

  const getStatusConfig = (status: string): StatusConfig => {
    const configs: Record<string, StatusConfig> = {
      assigned: { label: 'New Assignment', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: Target },
      accepted: { label: 'Accepted', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: CheckCircle },
      'in-progress': { label: 'In Progress', color: 'text-indigo-700', bgColor: 'bg-indigo-100', icon: TrendingUp },
      submitted: { label: 'Under Review', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: Eye },
      completed: { label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
      verified: { label: 'Verified', color: 'text-emerald-700', bgColor: 'bg-emerald-100', icon: Award },
      rejected: { label: 'Needs Resubmission', color: 'text-red-700', bgColor: 'bg-red-100', icon: AlertTriangle },
    };
    return configs[status] || configs.assigned;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateRewardPoints = (priority: string) => {
    const points: Record<string, number> = {
      low: 20,
      medium: 30,
      high: 50,
    };
    return points[priority] || 30;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  const severityConfig = getSeverityConfig(task.priority || task.report?.severity || 'medium');
  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;
  const rewardPoints = calculateRewardPoints(task.priority);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-4 xs:py-6 sm:py-8 px-3 xs:px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/dashboard/problemSolver/tasks"
          className="flex items-center gap-2 text-[#6B7280] hover:text-primary mb-4 xs:mb-6 transition font-semibold text-sm xs:text-base"
        >
          <ArrowLeft className="w-4 h-4 xs:w-5 xs:h-5" />
          <span>Back to My Tasks</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 xs:space-y-5 sm:space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg overflow-hidden border-t-4 border-primary">
              {/* Header Background Gradient */}
              <div className={`h-20 xs:h-24 sm:h-32 bg-linear-to-r ${severityConfig.headerBg}`}></div>

              <div className="p-4 xs:p-6 sm:p-8 -mt-10 xs:-mt-12 sm:-mt-16 relative">
                <div className="flex flex-wrap gap-2 xs:gap-3 mb-4 xs:mb-6">
                  <span className={`px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm font-bold border-2 ${severityConfig.bgColor} ${severityConfig.color}`}>
                    <AlertTriangle className="w-3 h-3 xs:w-4 xs:h-4 inline mr-1" />
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </span>
                  <span className={`px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm font-bold flex items-center gap-1 xs:gap-2 ${statusConfig.bgColor} ${statusConfig.color}`}>
                    <StatusIcon className="w-3 h-3 xs:w-4 xs:h-4" />
                    {statusConfig.label}
                  </span>
                  <span className="px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm font-bold bg-yellow-100 text-yellow-800 flex items-center gap-1 xs:gap-2">
                    <Star className="w-3 h-3 xs:w-4 xs:h-4" />
                    {rewardPoints} Points
                  </span>
                </div>

                {/* Problem Classification */}
                <div className="mb-4 xs:mb-6 p-3 xs:p-4 bg-linear-to-r from-purple-50 to-indigo-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="text-xs xs:text-sm font-bold text-purple-900 mb-2 xs:mb-3">📋 Problem Classification</h4>
                  <div className="flex flex-wrap gap-2 xs:gap-3">
                    <div>
                      <p className="text-[10px] xs:text-xs text-gray-600 font-semibold mb-1">Problem Type</p>
                      <span className="inline-block px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 bg-blue-100 text-blue-900 rounded-lg text-xs xs:text-sm font-bold capitalize shadow-sm">
                        {task.report.problemType}
                      </span>
                    </div>
                    {task.report.category && (
                      <div>
                        <p className="text-[10px] xs:text-xs text-gray-600 font-semibold mb-1">Category</p>
                        <span className="inline-block px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 bg-purple-100 text-purple-900 rounded-lg text-xs xs:text-sm font-bold shadow-sm">
                          {task.report.category}
                        </span>
                      </div>
                    )}
                    {task.report.subcategory && (
                      <div>
                        <p className="text-[10px] xs:text-xs text-gray-600 font-semibold mb-1">Subcategory</p>
                        <span className="inline-block px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 bg-indigo-100 text-indigo-900 rounded-lg text-xs xs:text-sm font-bold shadow-sm">
                          {task.report.subcategory}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Task Title & Description */}
                <div>
                  <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#002E2E] mb-2 xs:mb-3">{task.title}</h1>
                  <p className="text-sm xs:text-base text-gray-700 leading-relaxed mb-3 xs:mb-4">{task.description}</p>

                  {/* Report Details */}
                  <div className="bg-gray-50 rounded-lg p-3 xs:p-4 border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-2 text-sm xs:text-base">Issue Details</h3>
                    <p className="text-xs xs:text-sm text-gray-600 mb-2">
                      <span className="font-semibold text-gray-800">Report Title:</span> {task.report.title}
                    </p>
                    <p className="text-xs xs:text-sm text-gray-700 break-all">
                      <span className="font-semibold">Report Description:</span> {task.report.description}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 xs:mt-6">
                  <div className="flex justify-between text-xs xs:text-sm mb-2">
                    <span className="font-semibold text-gray-700">Task Progress</span>
                    <span className="font-bold text-primary">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 xs:h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="bg-primary h-3 rounded-full shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Issue Photos */}
            {task.report?.images && task.report.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl xs:rounded-2xl shadow-md p-4 xs:p-5 sm:p-6 border-t-4 border-primary"
              >
                <h2 className="text-lg xs:text-xl font-bold text-[#002E2E] mb-3 xs:mb-4 flex items-center">
                  <Camera className="w-5 h-5 xs:w-6 xs:h-6 mr-2 text-primary" />
                  Issue Photos
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                  {task.report.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => {
                        setSelectedImage(image);
                        setImageModalOpen(true);
                      }}
                    >
                      <Image
                        src={image}
                        alt={`Issue photo ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Eye className="w-6 h-6 xs:w-8 xs:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl xs:rounded-2xl shadow-md p-4 xs:p-5 sm:p-6 border-t-4 border-primary"
            >
              <h2 className="text-lg xs:text-xl font-bold text-[#002E2E] mb-3 xs:mb-4 flex items-center">
                <Clock className="w-5 h-5 xs:w-6 xs:h-6 mr-2 text-primary" />
                Task Timeline
              </h2>
              <div className="space-y-3 xs:space-y-4">
                <div className="flex items-start space-x-2 xs:space-x-3">
                  <div className="shrink-0 w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm xs:text-base">Task Assigned</p>
                    <p className="text-xs xs:text-sm text-gray-500">{formatDate(task.createdAt)}</p>
                  </div>
                </div>
                {task.acceptedAt && (
                  <div className="flex items-start space-x-2 xs:space-x-3">
                    <div className="shrink-0 w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-blue-500 mt-2"></div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm xs:text-base">Accepted by You</p>
                      <p className="text-xs xs:text-sm text-gray-500">{formatDate(task.acceptedAt)}</p>
                    </div>
                  </div>
                )}
                {task.startedAt && (
                  <div className="flex items-start space-x-2 xs:space-x-3">
                    <div className="shrink-0 w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-indigo-500 mt-2"></div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm xs:text-base">Work Started</p>
                      <p className="text-xs xs:text-sm text-gray-500">{formatDate(task.startedAt)}</p>
                    </div>
                  </div>
                )}
                {task.submittedAt && (
                  <div className="flex items-start space-x-2 xs:space-x-3">
                    <div className="shrink-0 w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-purple-500 mt-2"></div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm xs:text-base">Proof Submitted</p>
                      <p className="text-xs xs:text-sm text-gray-500">{formatDate(task.submittedAt)}</p>
                    </div>
                  </div>
                )}
                {task.completedAt && (
                  <div className="flex items-start space-x-2 xs:space-x-3">
                    <div className="shrink-0 w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-emerald-500 mt-2"></div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm xs:text-base">Task Completed</p>
                      <p className="text-xs xs:text-sm text-gray-500">{formatDate(task.completedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Rejection Feedback */}
            {task.status === 'rejected' && task.rejectionReason && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-200 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6"
              >
                <h3 className="text-base xs:text-lg font-bold text-red-800 mb-2 xs:mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 xs:w-5 xs:h-5 mr-2" />
                  Rejection Feedback
                </h3>
                <p className="text-sm xs:text-base text-red-700 leading-relaxed">{task.rejectionReason}</p>
                {task.resubmissionCount && task.resubmissionCount > 0 && (
                  <p className="text-xs xs:text-sm text-red-600 mt-2 xs:mt-3">
                    Resubmission #{task.resubmissionCount}
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 xs:space-y-5 sm:space-y-6">
            {/* Location Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-green-50 rounded-xl xs:rounded-2xl shadow-md p-4 xs:p-5 sm:p-6 border-t-4 border-primary"
            >
              <h3 className="text-base xs:text-lg font-bold text-gray-800 mb-3 xs:mb-4 flex items-center">
                <MapPin className="w-4 h-4 xs:w-5 xs:h-5 mr-2 text-primary" />
                Location Details
              </h3>
              <div className="space-y-2 xs:space-y-3 text-xs xs:text-sm">
                <div>
                  <p className="text-gray-500 mb-1 font-semibold">Address</p>
                  <p className="font-semibold text-gray-800">{task.report.location.address}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 font-semibold">District</p>
                  <p className="font-semibold text-gray-800">{task.report.location.district}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 font-semibold">Division</p>
                  <p className="font-semibold text-gray-800">{task.report.location.division}</p>
                </div>
                {task.report.location.coordinates?.lat && task.report.location.coordinates?.lng && (
                  <div>
                    <p className="text-gray-500 mb-1 font-semibold">Coordinates</p>
                    <p className="font-mono text-xs text-gray-700 break-all">
                      {task.report.location.coordinates.lat.toFixed(6)}, {task.report.location.coordinates.lng.toFixed(6)}
                    </p>
                  </div>
                )}
                <button
                  onClick={handleOpenInMaps}
                  className="w-full mt-3 xs:mt-4 py-2 xs:py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-95 transform text-sm xs:text-base"
                >
                  <MapPin className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                  <span>Open in Maps</span>
                </button>
              </div>
            </motion.div>

            {/* Reward Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-yellow-50 rounded-xl xs:rounded-2xl shadow-md p-4 xs:p-5 sm:p-6 border-t-4 border-yellow-500"
            >
              <h3 className="text-base xs:text-lg font-bold text-gray-800 mb-3 xs:mb-4 flex items-center">
                <Award className="w-4 h-4 xs:w-5 xs:h-5 mr-2 text-yellow-600" />
                Reward Details
              </h3>
              <div className="text-center">
                <div className="text-3xl xs:text-4xl sm:text-5xl font-bold text-yellow-600 mb-2">{rewardPoints}</div>
                <p className="text-gray-600 font-medium text-sm xs:text-base">Points upon verification</p>
                {task.points && task.points > 0 && (
                  <div className="mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-yellow-200">
                    <p className="text-xs xs:text-sm text-gray-500 mb-1">Points Earned</p>
                    <p className="text-xl xs:text-2xl font-bold text-green-600">{task.points}</p>
                  </div>
                )}
                {task.rating && (
                  <div className="mt-3 xs:mt-4">
                    <p className="text-xs xs:text-sm text-gray-500 mb-2">Authority Rating</p>
                    <div className="flex justify-center space-x-0.5 xs:space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 xs:w-5 xs:h-5 ${star <= task.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Assignment Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl xs:rounded-2xl shadow-md p-4 xs:p-5 sm:p-6 border-t-4 border-blue-500"
            >
              <h3 className="text-base xs:text-lg font-bold text-gray-800 mb-3 xs:mb-4 flex items-center">
                <User className="w-4 h-4 xs:w-5 xs:h-5 mr-2 text-blue-600" />
                Assignment Info
              </h3>
              <div className="space-y-3 xs:space-y-4">
                <div>
                  <p className="text-[10px] xs:text-xs text-gray-500 mb-1 font-semibold">Assigned By</p>
                  <p className="font-semibold text-gray-800 text-sm xs:text-base">{task.assigner.name}</p>
                  <p className="text-xs xs:text-sm text-gray-500 capitalize">{task.assigner.role}</p>
                </div>
                <div>
                  <p className="text-[10px] xs:text-xs text-gray-500 mb-1 font-semibold">Assignment Date</p>
                  <p className="font-semibold text-gray-800 text-sm xs:text-base">{formatDate(task.createdAt)}</p>
                </div>
                {task.deadline && (
                  <div className={`p-2 xs:p-3 rounded-lg border-2 ${new Date(task.deadline) < new Date()
                    ? 'bg-red-50 border-red-300'
                    : new Date(task.deadline) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-blue-50 border-blue-300'
                    }`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] xs:text-xs font-semibold text-gray-600">Deadline</p>
                      <Clock className={`w-3.5 h-3.5 xs:w-4 xs:h-4 ${new Date(task.deadline) < new Date()
                        ? 'text-red-600'
                        : new Date(task.deadline) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                          ? 'text-orange-600'
                          : 'text-blue-600'
                        }`} />
                    </div>
                    <p className={`font-bold text-sm xs:text-base ${new Date(task.deadline) < new Date()
                      ? 'text-red-700'
                      : new Date(task.deadline) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                        ? 'text-orange-700'
                        : 'text-blue-700'
                      }`}>
                      {formatDate(task.deadline)}
                    </p>
                    {new Date(task.deadline) < new Date() && (
                      <p className="text-[10px] xs:text-xs text-red-600 font-semibold mt-1">⚠️ Overdue!</p>
                    )}
                    {new Date(task.deadline) >= new Date() && new Date(task.deadline) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) && (
                      <p className="text-[10px] xs:text-xs text-orange-600 font-semibold mt-1">⏰ Deadline approaching!</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Priority Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`bg-white rounded-xl xs:rounded-2xl shadow-md p-4 xs:p-5 sm:p-6 border-t-4 ${task.priority === 'high'
                ? 'border-red-500 bg-red-50'
                : task.priority === 'medium'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-green-500 bg-green-50'
                }`}
            >
              <h3 className="text-base xs:text-lg font-bold text-gray-800 mb-3 xs:mb-4 flex items-center">
                <AlertTriangle className={`w-4 h-4 xs:w-5 xs:h-5 mr-2 ${task.priority === 'high'
                  ? 'text-red-600'
                  : task.priority === 'medium'
                    ? 'text-orange-600'
                    : 'text-green-600'
                  }`} />
                Priority & Severity
              </h3>
              <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                <div className="bg-white/60 rounded-lg p-2 xs:p-3">
                  <p className="text-[10px] xs:text-xs text-gray-500 mb-1 font-semibold">Priority Level</p>
                  <p className={`font-bold text-base xs:text-lg capitalize ${task.priority === 'high'
                    ? 'text-red-600'
                    : task.priority === 'medium'
                      ? 'text-orange-600'
                      : 'text-green-600'
                    }`}>
                    {task.priority}
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-2 xs:p-3">
                  <p className="text-[10px] xs:text-xs text-gray-500 mb-1 font-semibold">Report Severity</p>
                  <p className={`font-bold text-base xs:text-lg capitalize ${task.report.severity === 'high'
                    ? 'text-red-600'
                    : task.report.severity === 'medium'
                      ? 'text-orange-600'
                      : 'text-green-600'
                    }`}>
                    {task.report.severity}
                  </p>
                </div>
              </div>
              <p className="text-xs xs:text-sm text-gray-700 leading-relaxed mt-3 xs:mt-4">
                {task.priority === 'high'
                  ? 'This is a critical issue requiring immediate attention and should be resolved as soon as possible.'
                  : task.priority === 'medium'
                    ? 'This issue requires attention and should be addressed in a timely manner.'
                    : 'This is a standard issue that can be resolved within the normal workflow.'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 xs:mt-8 flex flex-col xs:flex-row justify-center gap-3 xs:gap-4 flex-wrap px-2 xs:px-0"
        >
          {task.status === 'assigned' && (
            <button
              onClick={handleAcceptTask}
              className="w-full xs:w-auto px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 bg-linear-to-r from-primary to-primary/90 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm xs:text-base"
            >
              <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5" />
              <span>Accept This Task</span>
            </button>
          )}
          {task.status === 'accepted' && (
            <button
              onClick={handleStartTask}
              className="w-full xs:w-auto px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 bg-linear-to-r from-primary to-primary/90 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm xs:text-base"
            >
              <TrendingUp className="w-4 h-4 xs:w-5 xs:h-5" />
              <span>Start Working</span>
            </button>
          )}
          {task.status === 'in-progress' && (
            <button
              onClick={() => setShowProofModal(true)}
              className="w-full xs:w-auto px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 bg-linear-to-r from-accent to-accent/90 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm xs:text-base"
            >
              <Upload className="w-4 h-4 xs:w-5 xs:h-5" />
              <span>Submit Proof</span>
            </button>
          )}
          {task.status === 'rejected' && (
            <button
              onClick={() => setShowProofModal(true)}
              className="w-full xs:w-auto px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm xs:text-base"
            >
              <Upload className="w-4 h-4 xs:w-5 xs:h-5" />
              <span>Resubmit Proof</span>
            </button>
          )}
          <Link
            href="/dashboard/problemSolver/tasks"
            className="w-full xs:w-auto px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 bg-gray-500 text-white rounded-xl font-bold hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm xs:text-base"
          >
            <ArrowLeft className="w-4 h-4 xs:w-5 xs:h-5" />
            <span>Back to My Tasks</span>
          </Link>
        </motion.div>
      </div>

      {/* Image Modal */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 xs:p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute -top-8 xs:-top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <span className="text-2xl xs:text-3xl">✕</span>
            </button>
            <Image
              src={selectedImage}
              alt="Full size"
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Proof Submission Modal */}
      {showProofModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 xs:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl xs:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 xs:p-5 sm:p-6">
              <div className="flex justify-between items-center mb-4 xs:mb-6">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                  <Upload className="w-5 h-5 xs:w-6 xs:h-6 mr-2 text-purple-600" />
                  Submit Work Proof
                </h2>
                <button
                  onClick={() => {
                    setShowProofModal(false);
                    setProofImages([]);
                    setProofDescription('');
                  }}
                  className="p-1.5 xs:p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 xs:w-6 xs:h-6 text-gray-600" />
                </button>
              </div>

              {/* Upload Images */}
              <div className="mb-4 xs:mb-6">
                <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-2 xs:mb-3">
                  Upload Proof Images *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 xs:p-6 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="proof-upload"
                  />
                  <label
                    htmlFor="proof-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <ImageIcon className="w-10 h-10 xs:w-12 xs:h-12 text-gray-400 mb-2" />
                    <span className="text-xs xs:text-sm text-gray-600 font-medium">
                      Click to upload images
                    </span>
                    <span className="text-[10px] xs:text-xs text-gray-500 mt-1">
                      PNG, JPG up to 5MB each
                    </span>
                  </label>
                </div>

                {/* Image Preview */}
                {proofImages.length > 0 && (
                  <div className="mt-3 xs:mt-4 grid grid-cols-2 xs:grid-cols-3 gap-2 xs:gap-3">
                    {proofImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image}
                          alt={`Proof ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-24 xs:h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 xs:top-2 xs:right-2 p-0.5 xs:p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Remove proof image ${index + 1}`}
                        >
                          <X className="w-3 h-3 xs:w-4 xs:h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-4 xs:mb-6">
                <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-2 xs:mb-3">
                  Work Description *
                </label>
                <textarea
                  value={proofDescription}
                  onChange={(e) => setProofDescription(e.target.value)}
                  placeholder="Describe the work you've completed, steps taken, and any challenges faced..."
                  rows={4}
                  className="w-full px-3 xs:px-4 py-2 xs:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm xs:text-base"
                />
              </div>

              {/* Error Display */}
              {proofError && <InlineError message={proofError} />}

              {/* Submit Button */}
              <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-3">
                <button
                  onClick={handleSubmitProof}
                  disabled={submittingProof || proofImages.length === 0 || !proofDescription.trim()}
                  className="flex-1 py-2.5 xs:py-3 bg-linear-to-r from-accent to-accent/90 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm xs:text-base"
                >
                  {submittingProof ? (
                    <>
                      <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 xs:w-5 xs:h-5" />
                      <span>Submit Proof</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowProofModal(false);
                    setProofImages([]);
                    setProofDescription('');
                  }}
                  disabled={submittingProof}
                  className="xs:w-auto px-4 xs:px-6 py-2.5 xs:py-3 bg-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-400 transition-colors text-sm xs:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}