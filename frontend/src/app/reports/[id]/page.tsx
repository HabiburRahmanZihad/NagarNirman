'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, Button, Loading, NotFoundDisplay } from '@/components/common';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Image from 'next/image';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaClock,
  FaThumbsUp,
  FaUser,
  FaExclamationCircle,
  FaTasks,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaComments,
} from 'react-icons/fa';

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
  comments: Array<{
    user: {
      _id: string;
      name: string;
      role: string;
      district: string;
    };
    comment: string;
    createdAt: string;
  }>;
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

  const reportId = params?.id as string;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Store the current page as redirect_to parameter
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
      } else {
        toast.error('Report not found');
        setReport(null);
      }
    } catch (error: any) {
      console.error('Error fetching report:', error);
      toast.error(error.message || 'Failed to load report details. Please check your connection.');
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

    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmittingComment(true);
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
        fetchReportDetails(); // Refresh to show new comment
      } else {
        toast.error(data.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle upvote
  const handleUpvote = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to upvote');
      return;
    }

    setIsUpvoting(true);
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
        toast.success('Upvoted successfully!');
        fetchReportDetails();
      } else {
        toast.error(data.message || 'Failed to upvote');
      }
    } catch (error) {
      console.error('Error upvoting:', error);
      toast.error('Failed to upvote');
    } finally {
      setIsUpvoting(false);
    }
  };

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: {
        color: 'bg-gray-100 text-gray-800',
        icon: <FaHourglassHalf />,
        label: 'Pending Review',
      },
      approved: {
        color: 'bg-blue-100 text-blue-800',
        icon: <FaCheckCircle />,
        label: 'Approved',
      },
      'in-progress': {
        color: 'bg-indigo-100 text-indigo-800',
        icon: <FaTasks />,
        label: 'In Progress',
      },
      resolved: {
        color: 'bg-green-100 text-green-800',
        icon: <FaCheckCircle />,
        label: 'Resolved',
      },
      rejected: {
        color: 'bg-red-100 text-red-800',
        icon: <FaTimesCircle />,
        label: 'Rejected',
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  // Get severity info
  const getSeverityInfo = (severity: string) => {
    const severityMap = {
      low: { color: 'bg-green-100 text-green-800 border-green-300', emoji: '🟢', label: 'Low Priority' },
      medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', emoji: '🟡', label: 'Medium Priority' },
      high: { color: 'bg-orange-100 text-orange-800 border-orange-300', emoji: '🟠', label: 'High Priority' },
      urgent: { color: 'bg-red-100 text-red-800 border-red-300', emoji: '🔴', label: 'Urgent' },
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-12 flex items-center justify-center">
        <NotFoundDisplay
          title="Access Denied"
          message="Please login to view report details."
          showHomeButton={true}
        />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-12 flex items-center justify-center">
        <NotFoundDisplay
          title="Report Not Found"
          message="The report you're looking for doesn't exist or has been removed."
          showHomeButton={true}
          showBackButton={true}
        />
      </div>
    );
  }

  const statusInfo = getStatusInfo(report.status);
  const severityInfo = getSeverityInfo(report.severity);
  const progress = getProgressPercentage(report.status);
  const isUpvoted = report.upvotes.includes(user?._id || '');

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => router.push('/reports')}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#2a7d2f] mb-6 transition"
        >
          <FaArrowLeft />
          <span>Back to Reports</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${severityInfo.color}`}>
                  {severityInfo.emoji} {severityInfo.label}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${statusInfo.color}`}>
                  {statusInfo.icon}
                  {statusInfo.label}
                </span>
              </div>

              {/* Problem Classification */}
              <div className="mb-4 p-4 bg-linear-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">🏷️ Problem Classification</h4>
                <div className="flex flex-wrap gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Problem Type</p>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">
                      {report.problemType}
                    </span>
                  </div>
                  {report.category && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Category</p>
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                        {report.category}
                      </span>
                    </div>
                  )}
                  {report.subcategory && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Subcategory</p>
                      <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                        {report.subcategory}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <h1 className="text-3xl font-bold text-[#002E2E] mb-4">
                {report.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-[#6B7280] mb-6">
                <div className="flex items-center gap-1">
                  <FaClock />
                  <span>Reported {formatDate(report.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-[#f2a921]" />
                  <span>{report.location.district}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-[#002E2E]">Resolution Progress</span>
                  <span className="text-sm font-bold text-[#2a7d2f]">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
                  <div
                    className="bg-linear-to-r from-[#2a7d2f] to-[#aef452] h-full transition-all duration-500 rounded-full absolute top-0 left-0"
                    style={{ width: `${progress}%` } as React.CSSProperties}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-[#6B7280]">
                  <span>Pending</span>
                  <span>Approved</span>
                  <span>In Progress</span>
                  <span>Resolved</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-[#002E2E] mb-3">Description</h3>
                <p className="text-[#6B7280] leading-relaxed whitespace-pre-line break-all">
                  {report.description}
                </p>
              </div>
            </Card>

            {/* Reporter Info */}
            {report.createdBy && (
              <Card className="p-6">
                <h3 className="text-lg font-bold text-[#002E2E] mb-4 flex items-center gap-2">
                  <FaUser className="text-[#2a7d2f]" />
                  Reported By
                </h3>
                <div className="flex items-center gap-4 p-4 bg-linear-to-r from-[#F6FFF9] to-white rounded-lg border border-[#2a7d2f]/20">
                  <div className="w-16 h-16 rounded-full bg-[#2a7d2f] text-white flex items-center justify-center font-bold text-2xl shrink-0">
                    {report.createdBy.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-[#002E2E]">{report.createdBy.name || 'Anonymous'}</p>
                    <p className="text-sm text-[#6B7280] mb-2">Citizen Reporter</p>
                    <div className="space-y-1">
                      {report.createdBy.email && (
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <FaEnvelope className="text-[#2a7d2f]" />
                          <span>{report.createdBy.email}</span>
                        </div>
                      )}
                      {report.createdBy.phone && (
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <FaPhone className="text-[#2a7d2f]" />
                          <span>{report.createdBy.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Images */}
            {report.images && report.images.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-bold text-[#002E2E] mb-4">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {report.images.map((image, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={image}
                        alt={`Report image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Location Details */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-[#002E2E] mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#f2a921]" />
                Location Details
              </h3>
              <div className="space-y-2 text-[#6B7280]">
                <p><span className="font-semibold">Address:</span> {report.location.address}</p>
                {report.location.division && (
                  <p><span className="font-semibold">Division:</span> {report.location.division}</p>
                )}
                <p><span className="font-semibold">District:</span> {report.location.district}</p>
                {report.location.coordinates && report.location.coordinates.length === 2 && (
                  <>
                    <p>
                      <span className="font-semibold">Coordinates:</span>{' '}
                      {report.location.coordinates[1].toFixed(6)}, {report.location.coordinates[0].toFixed(6)}
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${report.location.coordinates[1]},${report.location.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#2a7d2f] hover:text-[#1e5d22] font-semibold transition"
                    >
                      <FaMapMarkerAlt />
                      View on Google Maps
                    </a>
                  </>
                )}
              </div>
            </Card>


            {/* Comments Section */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-[#002E2E] mb-4 flex items-center gap-2">
                <FaComments className="text-[#2a7d2f]" />
                Comments ({report.comments?.length || 0})
              </h3>

              {/* Add Comment Form */}
              {isAuthenticated && user?._id?.toString() !== report.createdBy?._id?.toString() ? (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2a7d2f] text-white flex items-center justify-center font-bold shrink-0">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-transparent resize-none"
                        rows={3}
                        disabled={isSubmittingComment}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={isSubmittingComment || !newComment.trim()}
                          className="px-4 py-2 bg-[#2a7d2f] text-white rounded-lg font-semibold hover:bg-[#1f5f23] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : !isAuthenticated ? (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-[#6B7280] mb-2">Please login to add comments</p>
                  <Link href="/auth/login">
                    <Button variant="primary">Login</Button>
                  </Link>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center border border-blue-200">
                  <p className="text-[#002E2E] font-semibold">
                    You cannot comment on your own report
                  </p>
                  <p className="text-[#6B7280] text-sm mt-1">
                    Others can add comments to provide feedback or updates
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {report.comments && report.comments.length > 0 ? (
                  report.comments.map((comment, index) => (
                    <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                        {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <span className="font-semibold text-[#002E2E]">
                            {comment.user?.name || 'Anonymous'}
                          </span>

                          {/* Role Badge */}
                          {comment.user?.role && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${comment.user.role === 'authority' ? 'bg-blue-100 text-blue-800' :
                              comment.user.role === 'problemSolver' ? 'bg-purple-100 text-purple-800' :

                                'bg-gray-100 text-gray-800'
                              }`}>
                              {comment.user.role === 'problemSolver' ? 'Problem Solver' :
                                comment.user.role.charAt(0).toUpperCase() + comment.user.role.slice(1)}
                            </span>
                          )}

                          {/* District Badge */}
                          {comment.user?.district && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                              📍 {comment.user.district}
                            </span>
                          )}

                          <span className="text-xs text-[#6B7280] ml-auto">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-[#6B7280] whitespace-pre-line">{comment.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#6B7280]">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-[#002E2E] mb-4">Actions</h3>
              <div className="space-y-3">
                {/* Show upvote button only if user is not the report creator */}
                {user?._id?.toString() !== report.createdBy?._id?.toString() ? (
                  <button
                    onClick={handleUpvote}
                    disabled={isUpvoting || !isAuthenticated}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition ${isUpvoted
                      ? 'bg-[#2a7d2f] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <FaThumbsUp />
                    {isUpvoted ? 'Upvoted' : 'Upvote'} ({report.upvotes.length})
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700">
                    <FaThumbsUp />
                    <span>Your Report • Upvotes: {report.upvotes.length}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Assignment Info */}
            {report.assignedTo && (
              <Card className="p-6">
                <h3 className="text-lg font-bold text-[#002E2E] mb-4 flex items-center gap-2">
                  <FaTasks className="text-[#2a7d2f]" />
                  Assignment Details
                </h3>

                {/* Assigned To */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-[#6B7280] mb-2">Assigned To:</p>
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                      {report.assignedTo.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className="font-semibold text-[#002E2E]">{report.assignedTo.name || 'Unknown'}</p>
                      <p className="text-xs text-[#6B7280] capitalize">{report.assignedTo.role || 'N/A'}</p>
                      <p className="text-xs text-[#6B7280]">{report.assignedTo.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Assigned By */}
                {report.assignedBy && (
                  <div>
                    <p className="text-sm font-semibold text-[#6B7280] mb-2">Assigned By:</p>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        <FaUserTie />
                      </div>
                      <div>
                        <p className="font-semibold text-[#002E2E]">{report.assignedBy.name || 'Unknown'}</p>
                        <p className="text-xs text-[#6B7280]">Authority</p>
                        <p className="text-xs text-[#6B7280]">{report.assignedBy.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-[#002E2E] mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7280]">Upvotes</span>
                  <span className="font-bold text-[#002E2E]">{report.upvotes.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7280]">Comments</span>
                  <span className="font-bold text-[#002E2E]">{report.comments?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7280]">Last Updated</span>
                  <span className="font-bold text-[#002E2E] text-sm">
                    {new Date(report.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
