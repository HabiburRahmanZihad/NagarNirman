'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {  Button, Loading, NotFoundDisplay } from '@/components/common';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Image from 'next/image';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaThumbsUp,
  FaUser,
  FaTasks,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaComments,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaEye,
  FaShareAlt,
  FaRegBookmark,
  FaBookmark,
  FaChartLine,
  FaHistory,
  FaBuilding,
  FaLayerGroup,
  FaChevronRight,
  FaTag,
  FaInfoCircle,
  FaLocationArrow,
  FaCertificate,
  FaShieldAlt,
  FaExpand,
} from 'react-icons/fa';

interface ReportComment {
  _id: string;
  user?: {
    _id: string;
    name: string;
    role: string;
    district: string;
  };
  comment: string;
  createdAt: string;
}

interface Report {
  _id: string;
  title: string;
  description: string;
  problemType: string;
  category?: string;
  subcategory?: string;
  severity: string;
  status: string;
  location: {
    address: string;
    district: string;
    division?: string;
    coordinates?: number[];
  };
  images: string[];
  upvotes: string[];
  comments: ReportComment[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  assignedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  history: Array<{
    status: string;
    note: string;
    updatedBy: {
      _id: string;
      name: string;
    };
    date: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function ReportDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [optimisticUpvotes, setOptimisticUpvotes] = useState<string[]>([]);
  const [optimisticComments, setOptimisticComments] = useState<ReportComment[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const reportId = params?.id as string;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const redirectUrl = `/auth/login?redirect_to=${encodeURIComponent(`/reports/${reportId}`)}`;
      router.push(redirectUrl);
    }
  }, [authLoading, isAuthenticated, router, reportId]);

  // Fetch report details
  const fetchReportDetails = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/reports/${reportId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success && data.data) {
        setReport(data.data);
        setOptimisticUpvotes(data.data.upvotes || []);
        setOptimisticComments(data.data.comments || []);
        setViewCount(prev => prev + 1);
      } else {
        toast.error('Report not found');
        setReport(null);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchReportDetails();
    }
  }, [reportId]);

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmittingComment(true);
    const tempCommentId = `temp_${Date.now()}`;
    
    // Create safe comment object
    const userComment: ReportComment = {
      _id: tempCommentId,
      user: {
        _id: user._id || 'temp_id',
        name: user.name || 'Anonymous',
        role: user.role || 'citizen',
        district: user.district || 'Unknown'
      },
      comment: newComment,
      createdAt: new Date().toISOString()
    };

    setOptimisticComments(prev => [userComment, ...prev]);

    try {
      const token = localStorage.getItem('nn_auth_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${reportId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newComment }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Comment added successfully!');
        setNewComment('');
        if (data.data?.comment) {
          setOptimisticComments(prev => 
            prev.map(comment => 
              comment._id === tempCommentId ? data.data.comment : comment
            )
          );
        }
      } else {
        toast.error(data.message || 'Failed to add comment');
        setOptimisticComments(prev => prev.filter(comment => comment._id !== tempCommentId));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      setOptimisticComments(prev => prev.filter(comment => comment._id !== tempCommentId));
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle upvote
  const handleUpvote = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to upvote');
      return;
    }

    setIsUpvoting(true);
    const userId = user._id;
    const wasUpvoted = optimisticUpvotes.includes(userId);
    
    // Optimistic update
    setOptimisticUpvotes(prev => 
      wasUpvoted ? prev.filter(id => id !== userId) : [...prev, userId]
    );

    try {
      const token = localStorage.getItem('nn_auth_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${reportId}/upvote`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        toast.success(wasUpvoted ? 'Upvote removed' : 'Upvoted successfully!');
        setOptimisticUpvotes(data.data.upvotes || []);
      } else {
        toast.error(data.message || 'Failed to upvote');
        setOptimisticUpvotes(prev => 
          wasUpvoted ? [...prev, userId] : prev.filter(id => id !== userId)
        );
      }
    } catch (error) {
      console.error('Error upvoting:', error);
      toast.error('Failed to upvote');
      setOptimisticUpvotes(prev => 
        wasUpvoted ? [...prev, userId] : prev.filter(id => id !== userId)
      );
    } finally {
      setIsUpvoting(false);
    }
  };

  // Handle bookmark
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: report?.title,
          text: report?.description.substring(0, 100),
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Handle report inappropriate
  const handleReport = () => {
    toast('Report submitted for review', {
      icon: '🚩',
    });
  };

  // Handle image click
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: {
        color: 'bg-gray-100 text-gray-700 border border-gray-300',
        icon: <FaHourglassHalf className="text-gray-600" />,
        label: 'Pending Review',
      },
      approved: {
        color: 'bg-blue-100 text-blue-700 border border-blue-300',
        icon: <FaCheckCircle className="text-blue-600" />,
        label: 'Approved',
      },
      'in-progress': {
        color: 'bg-indigo-100 text-indigo-700 border border-indigo-300',
        icon: <FaTasks className="text-indigo-600" />,
        label: 'In Progress',
      },
      resolved: {
        color: 'bg-green-100 text-green-700 border border-green-300',
        icon: <FaCheckCircle className="text-green-600" />,
        label: 'Resolved',
      },
      rejected: {
        color: 'bg-red-100 text-red-700 border border-red-300',
        icon: <FaTimesCircle className="text-red-600" />,
        label: 'Rejected',
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  // Get severity info
  const getSeverityInfo = (severity: string) => {
    const severityMap = {
      low: {
        color: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
        icon: '🟢',
        label: 'Low Priority',
      },
      medium: {
        color: 'bg-amber-100 text-amber-700 border border-amber-300',
        icon: '🟡',
        label: 'Medium Priority',
      },
      high: {
        color: 'bg-orange-100 text-orange-700 border border-orange-300',
        icon: '🟠',
        label: 'High Priority',
      },
      urgent: {
        color: 'bg-red-100 text-red-700 border border-red-300',
        icon: '🔴',
        label: 'Urgent',
      },
    };
    return severityMap[severity as keyof typeof severityMap] || severityMap.medium;
  };

  // Calculate progress percentage
  const getProgressPercentage = (status: string) => {
    const progressMap = {
      pending: 25,
      approved: 50,
      'in-progress': 75,
      resolved: 100,
      rejected: 0,
    };
    return progressMap[status as keyof typeof progressMap] || 0;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get initials from name - FIXED: Safe access function
  const getInitials = (comment: ReportComment) => {
    if (!comment.user?.name) return 'U';
    return comment.user.name.charAt(0).toUpperCase();
  };

  // Get user name safely
  const getUserName = (comment: ReportComment) => {
    return comment.user?.name || 'Anonymous';
  };

  // Get user role safely
  const getUserRole = (comment: ReportComment) => {
    return comment.user?.role;
  };

  // Get user district safely
  const getUserDistrict = (comment: ReportComment) => {
    return comment.user?.district;
  };

  if (authLoading || isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="container max-w-4xl">
          <NotFoundDisplay
            title="Access Denied"
            message="Please login to view report details."
            showHomeButton={true}
          />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="container max-w-4xl">
          <NotFoundDisplay
            title="Report Not Found"
            message="The report you're looking for doesn't exist or has been removed."
            showHomeButton={true}
            showBackButton={true}
          />
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(report.status);
  const severityInfo = getSeverityInfo(report.severity);
  const progress = getProgressPercentage(report.status);
  const isUpvoted = user ? optimisticUpvotes.includes(user._id) : false;

  return (
    <>
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeImageModal}>
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white text-xl hover:text-gray-300 transition-colors"
            >
              ✕ Close
            </button>
            <div className="relative w-full h-[70vh] rounded-lg overflow-hidden">
              <Image
                src={selectedImage}
                alt="Enlarged report image"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <button
              onClick={closeImageModal}
              className="mt-4 w-full py-3 bg-[#004d40] text-white font-semibold rounded-lg hover:bg-[#00332a] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-linear-to-r from-[#004d40] to-[#00695c] text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <FaArrowLeft />
                <span className="font-medium">Back</span>
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">Report ID:</span>
                <code className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-sm font-mono">
                  {report._id.substring(0, 8)}
                </code>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${statusInfo.color}`}>
                  {statusInfo.icon}
                  {statusInfo.label}
                </span>
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${severityInfo.color}`}>
                  {severityInfo.icon} {severityInfo.label}
                </span>
              </div>

              <h1 className="text-2xl font-bold mb-3 line-clamp-2">
                {report.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>Reported {formatDate(report.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  <span>{report.location.district}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEye />
                  <span>{viewCount} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress & Status Card */}
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-r from-[#004d40] to-[#00695c] text-white flex items-center justify-center">
                        <FaChartLine />
                      </div>
                      Resolution Progress
                    </h2>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#004d40]">{progress}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>

                  {/* Enhanced Progress Bar */}
                  <div className="mb-8">
                    <div className="relative">
                      {/* Progress steps */}
                      <div className="flex justify-between mb-6 relative">
                        {['Pending', 'Approved', 'In Progress', 'Resolved'].map((step, index) => {
                          const stepProgress = (index + 1) * 25;
                          const isCompleted = progress >= stepProgress;
                          const isCurrent = progress >= (index * 25) && progress < stepProgress;
                          
                          return (
                            <div key={step} className="flex flex-col items-center relative z-10">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-2 ${
                                isCompleted 
                                  ? 'bg-[#004d40] border-[#004d40] text-white' 
                                  : isCurrent
                                    ? 'bg-white border-[#004d40] text-[#004d40]'
                                    : 'bg-gray-100 border-gray-300 text-gray-400'
                              }`}>
                                {isCompleted ? (
                                  <FaCheckCircle className="text-lg" />
                                ) : (
                                  <span className="font-semibold">{index + 1}</span>
                                )}
                              </div>
                              <span className={`text-sm font-medium ${
                                isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                        
                        {/* Connecting line */}
                        <div className="absolute top-6 left-1/4 right-1/4 h-0.5 bg-gray-200 -z-10"></div>
                        <div className="absolute top-6 left-1/4 h-0.5 bg-[#004d40] -z-10" 
                          style={{ width: `${Math.min(progress, 100) * 0.5}%` }}></div>
                      </div>

                      {/* Main progress bar */}
                      <div className="relative">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Current Status: {statusInfo.label}</span>
                          <span className="text-sm font-medium text-[#004d40]">{progress}%</span>
                        </div>
                        <div className="relative h-4 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full overflow-hidden">
                          {/* Background linear */}
                          <div className="absolute inset-0 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100"></div>
                          
                          {/* Animated progress fill */}
                          <div
                            style={{ width: `${progress}%` }}
                            className="h-full bg-linear-to-r from-[#004d40] via-[#f2a921] to-[#004d40] transition-all duration-1000 ease-out rounded-full relative overflow-hidden"
                          >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                          </div>
                          
                          {/* Progress markers */}
                          <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-white"></div>
                          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white"></div>
                          <div className="absolute top-0 bottom-0 left-3/4 w-0.5 bg-white"></div>
                        </div>
                        
                        {/* Progress labels */}
                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Problem Classification */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaTag className="text-[#f2a921]" />
                      Problem Classification
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-linear-to-br from-gray-50 to-white border border-gray-300 rounded-lg p-4 hover:border-[#004d40] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white border-2 border-[#004d40]/30 flex items-center justify-center">
                            <FaInfoCircle className="text-[#004d40]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Problem Type</p>
                            <p className="font-medium text-gray-900 capitalize">{report.problemType}</p>
                          </div>
                        </div>
                      </div>
                      
                      {report.category && (
                        <div className="bg-linear-to-br from-gray-50 to-white border border-gray-300 rounded-lg p-4 hover:border-[#f2a921] transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white border-2 border-[#f2a921]/30 flex items-center justify-center">
                              <FaLayerGroup className="text-[#f2a921]" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Category</p>
                              <p className="font-medium text-gray-900">{report.category}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {report.subcategory && (
                        <div className="bg-linear-to-br from-gray-50 to-white border border-gray-300 rounded-lg p-4 hover:border-[#004d40] transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white border-2 border-[#004d40]/30 flex items-center justify-center">
                              <FaChevronRight className="text-[#004d40]" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Subcategory</p>
                              <p className="font-medium text-gray-900">{report.subcategory}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* Reporter Info - Compact Version */}
              {report.createdBy && (
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaUser className="text-[#004d40]" />
                    Reported By
                  </h3>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-linear-to-r from-[#004d40] to-[#00695c] text-white flex items-center justify-center font-bold">
                          {report.createdBy.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#f2a921] flex items-center justify-center">
                          <FaCertificate className="text-white text-xs" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-900">{report.createdBy.name || 'Anonymous'}</h4>
                          <span className="px-2 py-1 bg-[#004d40] text-white text-xs font-medium rounded-full">
                            Citizen Reporter
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {report.createdBy.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaEnvelope className="text-gray-400" />
                              <span className="truncate">{report.createdBy.email}</span>
                            </div>
                          )}
                          {report.createdBy.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaPhone className="text-gray-400" />
                              <span>{report.createdBy.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Images Gallery */}
              {report.images && report.images.length > 0 && (
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FaEye className="text-[#004d40]" />
                      Media Gallery
                    </h3>
                    <span className="text-sm text-gray-500">
                      {report.images.length} {report.images.length === 1 ? 'image' : 'images'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {report.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-[#004d40] transition-colors cursor-pointer group"
                        onClick={() => handleImageClick(image)}
                      >
                        <Image
                          src={image}
                          alt={`Report image ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <FaExpand className="text-white text-xl" />
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Details */}
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#004d40]" />
                  Location Details
                </h3>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FaBuilding className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Address</p>
                        <p className="font-medium text-gray-900">{report.location.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {report.location.division && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <FaMapMarkerAlt className="text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Division</p>
                            <p className="font-medium text-gray-900">{report.location.division}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FaLocationArrow className="text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">District</p>
                          <p className="font-medium text-gray-900">{report.location.district}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {report.location.coordinates && report.location.coordinates.length === 2 && (
                    <div className="bg-linear-to-r from-[#004d40] to-[#00695c] rounded-lg p-4 text-white">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <p className="text-sm text-emerald-100 mb-1">Coordinates</p>
                          <p className="font-mono text-sm">
                            {report.location.coordinates[1].toFixed(6)}, {report.location.coordinates[0].toFixed(6)}
                          </p>
                        </div>
                        <a
                          href={`https://www.google.com/maps?q=${report.location.coordinates[1]},${report.location.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#004d40] font-medium rounded hover:bg-gray-50 transition-colors text-sm"
                        >
                          <FaExternalLinkAlt />
                          View on Maps
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments Section - FIXED: Using safe access functions */}
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FaComments className="text-[#004d40]" />
                    Comments
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {optimisticComments.length} {optimisticComments.length === 1 ? 'comment' : 'comments'}
                  </span>
                </div>

                {/* Add Comment Form */}
                {isAuthenticated && user && user._id !== report.createdBy?._id ? (
                  <div className="mb-6 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Add a comment</h4>
                    <form onSubmit={handleCommentSubmit}>
                      <div className="flex gap-3">
                        <div className="shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#004d40] text-white flex items-center justify-center font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts, suggestions, or updates..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] resize-none text-sm"
                            rows={3}
                            disabled={isSubmittingComment}
                          />
                          <div className="flex justify-end mt-2">
                            <Button
                              type="submit"
                              variant="primary"
                              size="sm"
                              isLoading={isSubmittingComment}
                              disabled={!newComment.trim()}
                            >
                              Post Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="mb-6 border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-gray-700 mb-2">Please login to participate in discussion</p>
                    <Link href="/auth/login">
                      <Button variant="primary" size="sm">
                        Login to Comment
                      </Button>
                    </Link>
                  </div>
                ) : null}

                {/* Comments List - FIXED: Using safe access functions */}
                <div className="space-y-4">
                  {optimisticComments.length > 0 ? (
                    optimisticComments.map((comment, index) => (
                      <div
                        key={comment._id || index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex gap-3">
                          <div className="shrink-0">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold border border-indigo-200">
                                {getInitials(comment)}
                              </div>
                              {getUserRole(comment) === 'authority' && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center border border-white">
                                  <FaShieldAlt className="text-white text-xs" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">
                                {getUserName(comment)}
                              </span>
                              
                              {getUserRole(comment) && (
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserRole(comment) === 'authority'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : getUserRole(comment) === 'problemSolver'
                                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                                  }`}>
                                  {getUserRole(comment) === 'problemSolver' ? 'Problem Solver' :
                                    getUserRole(comment)!.charAt(0).toUpperCase() + getUserRole(comment)!.slice(1)}
                                </span>
                              )}
                              
                              {getUserDistrict(comment) && (
                                <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                  📍 {getUserDistrict(comment)}
                                </span>
                              )}
                              
                              <span className="ml-auto text-xs text-gray-500">
                                {formatDate(comment.createdAt)} at {formatTime(comment.createdAt)}
                              </span>
                            </div>
                            <div className="bg-gray-50 rounded p-3">
                              <p className="text-gray-700 text-sm whitespace-pre-line">{comment.comment}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 border border-gray-200 rounded-lg">
                      <FaComments className="text-gray-400 text-2xl mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">No comments yet</p>
                      <p className="text-gray-500 text-sm">Be the first to share your thoughts</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sticky Container */}
              <div className="sticky top-6 space-y-6">
                {/* Actions Card */}
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                  
                  {/* Upvote Button */}
                  {user && user._id !== report.createdBy?._id ? (
                    <button
                      onClick={handleUpvote}
                      disabled={isUpvoting || !isAuthenticated}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-4 transition-colors ${isUpvoted
                        ? 'bg-[#004d40] text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-2">
                        <FaThumbsUp />
                        <span className="font-medium">{isUpvoted ? 'Upvoted' : 'Upvote'}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-sm ${isUpvoted ? 'bg-white/30' : 'bg-white'}`}>
                        {optimisticUpvotes.length}
                      </span>
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-between px-4 py-3 rounded-lg mb-4 bg-gray-100 text-gray-800">
                      <div className="flex items-center gap-2">
                        <FaThumbsUp />
                        <span className="font-medium">Your Report</span>
                      </div>
                      <span className="px-2 py-1 bg-white rounded-full text-sm">
                        {optimisticUpvotes.length}
                      </span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={handleBookmark}
                      className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border ${isBookmarked
                        ? 'border-[#f2a921] bg-amber-50 text-amber-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        } transition-colors`}
                    >
                      {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                      <span className="text-xs font-medium">Bookmark</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaShareAlt />
                      <span className="text-xs font-medium">Share</span>
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                    <div className="flex flex-col gap-3">
                      <Link href="/reports">
                        <button className="btn w-full justify-center hover:bg-primary hover:text-white">
                          View All Reports
                        </button>
                      </Link>
                      <Link href={`/dashboard/${user?.role}`}>
                        <button className="justify-center btn w-full hover:bg-primary hover:text-white">
                          Go to Dashboard
                        </button>
                      </Link>
                      <Link href="/reports/create">
                        <Button variant="primary" fullWidth size="md" className="justify-center">
                          Submit New Report
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Statistics Card */}
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaChartLine className="text-[#004d40]" />
                    Statistics
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-300 flex items-center justify-center">
                          <FaThumbsUp className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Upvotes</p>
                          <p className="text-xl font-bold text-gray-900">{optimisticUpvotes.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-300 flex items-center justify-center">
                          <FaComments className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Comments</p>
                          <p className="text-xl font-bold text-gray-900">{optimisticComments.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-300 flex items-center justify-center">
                          <FaEye className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Views</p>
                          <p className="text-xl font-bold text-gray-900">{viewCount}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-300 flex items-center justify-center">
                          <FaHistory className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-bold text-gray-900">
                            {formatDate(report.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment Info */}
                {report.assignedTo && (
                  <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaTasks className="text-[#004d40]" />
                      Assignment Details
                    </h3>
                    
                    {/* Assigned To */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Assigned To</p>
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold border border-indigo-200">
                            {report.assignedTo.name?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{report.assignedTo.name}</p>
                            <p className="text-sm text-gray-600 capitalize">{report.assignedTo.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Assigned By */}
                    {report.assignedBy && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Assigned By</p>
                        <div className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold border border-blue-200">
                              <FaUserTie />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{report.assignedBy.name}</p>
                              <p className="text-sm text-gray-600">Authority</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add shimmer animation to tailwind config */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}