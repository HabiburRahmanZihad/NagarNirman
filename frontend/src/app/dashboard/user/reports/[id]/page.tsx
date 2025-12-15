'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, Loading, NotFoundDisplay } from '@/components/common';
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
  FaCamera,
  FaLightbulb,
  FaArrowUp,
  FaFlag,
  FaComment,
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
  const { user, isAuthenticated } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const reportId = params?.id as string;

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

  if (isLoading) {
    return <Loading />;
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
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard/user/my-reports')}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#2a7d2f] mb-6 transition font-semibold"
        >
          <FaArrowLeft />
          <span>Back to My Reports</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-primary">
              {/* Header Background Gradient */}
              <div className="h-32 bg-linear-to-r from-primary to-[#1e5d22]"></div>

              <div className="p-8 -mt-16 relative">
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${severityInfo.color}`}>
                    {severityInfo.emoji} {severityInfo.label}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${statusInfo.color}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </div>

                {/* Problem Classification */}
                <div className="mb-6 p-4 bg-linear-to-r from-purple-50 to-indigo-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="text-sm font-bold text-purple-900 mb-3">📋 Problem Classification</h4>
                  <div className="flex flex-wrap gap-3">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">Problem Type</p>
                      <span className="inline-block px-4 py-2 bg-blue-100 text-blue-900 rounded-lg text-sm font-bold capitalize shadow-sm">
                        {report.problemType}
                      </span>
                    </div>
                    {report.category && (
                      <div>
                        <p className="text-xs text-gray-600 font-semibold mb-1">Category</p>
                        <span className="inline-block px-4 py-2 bg-purple-100 text-purple-900 rounded-lg text-sm font-bold shadow-sm">
                          {report.category}
                        </span>
                      </div>
                    )}
                    {report.subcategory && (
                      <div>
                        <p className="text-xs text-gray-600 font-semibold mb-1">Subcategory</p>
                        <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-900 rounded-lg text-sm font-bold shadow-sm">
                          {report.subcategory}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <h1 className="text-4xl font-extrabold text-[#002E2E] mb-4">
                  {report.title}
                </h1>

                <div className="flex items-center gap-3 text-sm text-[#6B7280] mb-6 flex-wrap">
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg font-semibold">
                    <FaClock className="text-primary" />
                    <span>Reported {formatDate(report.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg font-semibold">
                    <FaMapMarkerAlt className="text-amber-500" />
                    <span>{report.location.district}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 p-5 rounded-lg border-2 border-green-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-[#002E2E]">📊 Resolution Progress</span>
                    <span className="text-3xl font-extrabold text-primary">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-5 overflow-hidden shadow-md">
                    <div
                      className="bg-linear-to-r from-primary to-[#aef452] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-3 text-xs font-bold text-[#6B7280]">
                    <span>📋 Pending</span>
                    <span>✅ Approved</span>
                    <span>⚙️ In Progress</span>
                    <span>🎉 Resolved</span>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                  <h3 className="text-xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
                    <FaExclamationCircle className="text-primary" />
                    Description
                  </h3>
                  <p className="text-[#6B7280] leading-relaxed whitespace-pre-line text-base">
                    {report.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Reporter Info */}
            {report.createdBy && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-xl shadow-lg border-2 border-blue-100 p-6">
                  <h3 className="text-xl font-bold text-[#002E2E] mb-6 flex items-center gap-2">
                    <FaUser className="text-blue-500" />
                    Reporter Information
                  </h3>

                  <div className="flex items-start gap-4 mb-8 pb-8 border-b-2 border-blue-100">
                    <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {report.createdBy.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-[#002E2E]">
                          {report.createdBy.name || 'Anonymous'}
                        </h4>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          👤 Citizen
                        </span>
                      </div>
                      {report.createdBy.email && (
                        <p className="text-sm text-[#6B7280] flex items-center gap-2 mb-2">
                          <FaEnvelope className="text-amber-500" />
                          {report.createdBy.email}
                        </p>
                      )}
                      {report.createdBy.phone && (
                        <p className="text-sm text-[#6B7280] flex items-center gap-2">
                          <FaPhone className="text-green-500" />
                          {report.createdBy.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Reporter Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center border-2 border-blue-200">
                      <p className="text-2xl font-bold text-blue-600">
                        1
                      </p>
                      <p className="text-xs text-gray-600 font-semibold mt-1">Total Reports</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center border-2 border-green-200">
                      <p className="text-2xl font-bold text-green-600">
                        {report.upvotes.length}
                      </p>
                      <p className="text-xs text-gray-600 font-semibold mt-1">Upvotes</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center border-2 border-purple-200">
                      <p className="text-2xl font-bold text-purple-600">
                        {report.comments?.length || 0}
                      </p>
                      <p className="text-xs text-gray-600 font-semibold mt-1">Comments</p>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Card */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-indigo-100 p-6 h-fit">
                  <h3 className="text-lg font-bold text-[#002E2E] mb-4 flex items-center gap-2">
                    <FaEnvelope className="text-indigo-500" />
                    Contact Reporter
                  </h3>

                  {report.createdBy.email ? (
                    <a
                      href={`mailto:${report.createdBy.email}`}
                      className="w-full mb-3 px-4 py-3 bg-linear-to-r from-blue-400 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <FaEnvelope /> Send Email
                    </a>
                  ) : null}

                  {report.createdBy.phone ? (
                    <a
                      href={`tel:${report.createdBy.phone}`}
                      className="w-full px-4 py-3 bg-linear-to-r from-green-400 to-green-500 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <FaPhone /> Call
                    </a>
                  ) : (
                    <p className="text-center text-sm text-gray-600 font-semibold py-3">
                      Contact info not available
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Images */}
            {report.images && report.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border-2 border-purple-100 p-8">
                <h3 className="text-2xl font-bold text-[#002E2E] mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaCamera className="text-purple-600 text-xl" />
                  </div>
                  Evidence Photos ({report.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {report.images.map((image, index) => (
                    <div
                      key={index}
                      className="group relative h-56 rounded-xl overflow-hidden border-2 border-purple-100 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    >
                      <Image
                        src={image}
                        alt={`Report image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      {/* Overlay Badge */}
                      <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {index + 1}
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <FaCamera className="text-white text-3xl" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Details */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-amber-100 p-8">
              <h3 className="text-2xl font-bold text-[#002E2E] mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="text-amber-600 text-xl" />
                </div>
                Location Details
              </h3>
              <div className="space-y-4">
                <div className="bg-linear-to-r from-amber-50 to-orange-50 p-5 rounded-lg border-2 border-amber-200">
                  <p className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">📍 Address</p>
                  <p className="text-lg font-bold text-[#002E2E] leading-relaxed">
                    {report.location.address}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-200">
                    <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">🏘️ District</p>
                    <p className="text-lg font-bold text-[#002E2E]">{report.location.district}</p>
                  </div>

                  {report.location.division && (
                    <div className="bg-purple-50 p-5 rounded-lg border-2 border-purple-200">
                      <p className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">🗺️ Division</p>
                      <p className="text-lg font-bold text-[#002E2E]">{report.location.division}</p>
                    </div>
                  )}
                </div>

                {report.location.coordinates && report.location.coordinates.length === 2 && (
                  <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
                    <p className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">📡 GPS Coordinates</p>
                    <p className="text-sm font-mono text-[#002E2E] break-all">
                      <span className="font-bold">Latitude:</span> {report.location.coordinates[1].toFixed(6)}
                    </p>
                    <p className="text-sm font-mono text-[#002E2E] break-all mt-1">
                      <span className="font-bold">Longitude:</span> {report.location.coordinates[0].toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            </div>


            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-indigo-100 p-8">
              <h3 className="text-2xl font-bold text-[#002E2E] mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FaComments className="text-indigo-600 text-xl" />
                </div>
                Comments & Discussions ({report.comments?.length || 0})
              </h3>

              {/* Add Comment Form */}
              {isAuthenticated && user?._id?.toString() !== report.createdBy?._id?.toString() ? (
                <form onSubmit={handleCommentSubmit} className="mb-8 pb-8 border-b-2 border-indigo-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-lg">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#6B7280] mb-2">Add your comment</p>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts, updates, or suggestions..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition"
                        rows={3}
                        disabled={isSubmittingComment}
                      />
                      <div className="flex justify-end mt-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewComment('')}
                          className="px-6 py-2 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition"
                        >
                          Clear
                        </button>
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          isLoading={isSubmittingComment}
                          disabled={!newComment.trim()}
                        >
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : !isAuthenticated ? (
                <div className="mb-8 pb-8 border-b-2 border-indigo-100 p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg text-center border-2 border-indigo-200">
                  <p className="text-[#002E2E] font-bold mb-3">Login Required</p>
                  <p className="text-[#6B7280] mb-4">Please login to share your thoughts and contribute to the discussion</p>
                  <Link href="/auth/login">
                    <Button variant="primary">Login to Comment</Button>
                  </Link>
                </div>
              ) : (
                <div className="mb-8 pb-8 border-b-2 border-indigo-100 p-6 bg-linear-to-r from-yellow-50 to-orange-50 rounded-lg text-center border-2 border-yellow-200">
                  <p className="text-[#002E2E] font-bold text-lg">
                    👋 This is Your Report
                  </p>
                  <p className="text-[#6B7280] mt-2">
                    You cannot comment on your own report, but others can provide feedback and updates
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {report.comments && report.comments.length > 0 ? (
                  report.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-5 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-400 to-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-lg">
                        {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <span className="font-bold text-[#002E2E]">
                            {comment.user?.name || 'Anonymous'}
                          </span>

                          {/* Role Badge */}
                          {comment.user?.role && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                              comment.user.role === 'authority'
                                ? 'bg-blue-200 text-blue-900'
                                : comment.user.role === 'problemSolver'
                                ? 'bg-purple-200 text-purple-900'
                                : 'bg-gray-200 text-gray-900'
                            }`}>
                              {comment.user.role === 'problemSolver' ? '🔧 Problem Solver' :
                               comment.user.role === 'authority' ? '👮 Authority' :
                               '👤 Citizen'}
                            </span>
                          )}

                          {/* District Badge */}
                          {comment.user?.district && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-900 shadow-sm">
                              📍 {comment.user.district}
                            </span>
                          )}

                          <span className="text-xs text-[#6B7280] ml-auto font-semibold">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-[#6B7280] whitespace-pre-line leading-relaxed">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 px-6 bg-linear-to-r from-gray-50 to-indigo-50 rounded-xl border-2 border-dashed border-gray-300">
                    <p className="text-2xl mb-2">💬</p>
                    <p className="text-[#6B7280] font-semibold text-lg">No comments yet</p>
                    <p className="text-[#6B7280] text-sm mt-1">Be the first to start a discussion!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-amber-100 p-6">
              <h3 className="text-lg font-bold text-[#002E2E] mb-4 flex items-center gap-2">
                <FaLightbulb className="text-amber-500" />
                Actions
              </h3>
              <div className="space-y-3">
                {/* Show upvote button only if user is not the report creator */}
                {user?._id?.toString() !== report.createdBy?._id?.toString() ? (
                  <button
                    onClick={handleUpvote}
                    disabled={isUpvoting || !isAuthenticated}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition transform hover:scale-105 shadow-md ${isUpvoted
                      ? 'bg-linear-to-r from-amber-400 to-amber-500 text-white'
                      : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <FaThumbsUp />
                    {isUpvoted ? 'Upvoted' : 'Upvote'} ({report.upvotes.length})
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-md">
                    <FaThumbsUp />
                    <span>Your Report • Upvotes: {report.upvotes.length}</span>
                  </div>
                )}

                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold bg-linear-to-r from-blue-400 to-blue-500 text-white hover:shadow-lg transition transform hover:scale-105">
                  <FaComment /> Add Comment
                </button>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold bg-linear-to-r from-red-400 to-red-500 text-white hover:shadow-lg transition transform hover:scale-105">
                  <FaFlag /> Report
                </button>
              </div>
            </div>

            {/* Assignment Info */}
            {report.assignedTo && (
              <div className="bg-white rounded-xl shadow-lg border-2 border-indigo-100 p-6">
                <h3 className="text-lg font-bold text-[#002E2E] mb-4 flex items-center gap-2">
                  <FaTasks className="text-indigo-600" />
                  Assignment Details
                </h3>

                {/* Assigned To */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-indigo-700 mb-3 uppercase tracking-wide">👤 Assigned To</p>
                  <div className="flex items-center gap-3 p-4 bg-linear-to-br from-indigo-50 to-indigo-100 rounded-lg border-2 border-indigo-200 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                      {report.assignedTo.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#002E2E] truncate">{report.assignedTo.name || 'Unknown'}</p>
                      <p className="text-xs text-[#6B7280] capitalize">{report.assignedTo.role || 'N/A'}</p>
                      <p className="text-xs text-[#6B7280] truncate">{report.assignedTo.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Assigned By */}
                {report.assignedBy && (
                  <div>
                    <p className="text-xs font-bold text-blue-700 mb-3 uppercase tracking-wide">👮 Assigned By</p>
                    <div className="flex items-center gap-3 p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                        <FaUserTie />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#002E2E] truncate">{report.assignedBy.name || 'Unknown'}</p>
                        <p className="text-xs text-[#6B7280]">Authority</p>
                        <p className="text-xs text-[#6B7280] truncate">{report.assignedBy.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Statistics Card */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-purple-100 p-6">
              <h3 className="text-lg font-bold text-[#002E2E] mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-purple-600" />
                Report Statistics
              </h3>
              <div className="space-y-4">
                {/* Upvotes */}
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200">
                  <span className="text-[#6B7280] font-semibold flex items-center gap-2">
                    <FaThumbsUp className="text-amber-600" />
                    Upvotes
                  </span>
                  <span className="font-bold text-amber-600 text-lg">{report.upvotes.length}</span>
                </div>

                {/* Comments */}
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
                  <span className="text-[#6B7280] font-semibold flex items-center gap-2">
                    <FaComments className="text-indigo-600" />
                    Comments
                  </span>
                  <span className="font-bold text-indigo-600 text-lg">{report.comments?.length || 0}</span>
                </div>

                {/* Last Updated */}
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
                  <span className="text-[#6B7280] font-semibold flex items-center gap-2">
                    <FaClock className="text-blue-600" />
                    Updated
                  </span>
                  <span className="font-bold text-blue-600 text-sm">
                    {new Date(report.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Created */}
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                  <span className="text-[#6B7280] font-semibold flex items-center gap-2">
                    <FaCheckCircle className="text-green-600" />
                    Created
                  </span>
                  <span className="font-bold text-green-600 text-sm">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
