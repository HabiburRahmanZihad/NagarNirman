'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCalendar,
  FaTransgender,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaFilter,
  FaShieldAlt,
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { problemSolverAPI } from '@/utils/api';

interface Application {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  division: string;
  district: string;
  address: string;
  profession: string;
  organization?: string;
  skills: string[];
  motivation: string;
  experience?: string;
  profileImage?: string;
  nidOrIdDoc: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
  appliedAt: string;
}

export default function SuperAdminApplications() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  // Check authentication
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (user?.role !== 'superAdmin') {
        toast.error('Access denied. SuperAdmin only.');
        router.push('/');
      }
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'superAdmin') {
      fetchApplications();
    }
  }, [filterStatus, pagination.page, user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page: pagination.page,
        limit: 10,
      };

      if (filterStatus !== 'all') {
        filters.status = filterStatus;
      }

      const response = await problemSolverAPI.getAllApplications(filters);
      setApplications(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      toast.error('Failed to load applications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (appId: string, status: 'approved' | 'rejected') => {
    setIsReviewing(true);
    try {
      await problemSolverAPI.reviewApplication(appId, status, reviewNote);

      toast.success(`Application ${status} successfully!`);
      setShowModal(false);
      setSelectedApp(null);
      setReviewNote('');
      fetchApplications();
    } catch (error: any) {
      toast.error(error.message || 'Failed to review application');
    } finally {
      setIsReviewing(false);
    }
  };

  const openModal = (app: Application) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApp(null);
    setReviewNote('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <FaClock className="mr-1" /> Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <FaTimesCircle className="mr-1" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81d586] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <Toaster position="top-right" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-[#2a7d2f] rounded-xl shadow-lg">
              <FaShieldAlt className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                All Applications Management
              </h1>
              <p className="text-gray-600 mt-1">
                System-wide problem solver applications (SuperAdmin)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
              <span className="text-3xl">📄</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(a => a.status === 'approved').length}
                </p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(a => a.status === 'rejected').length}
                </p>
              </div>
              <span className="text-3xl">❌</span>
            </div>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow p-4 mb-6"
        >
          <div className="flex items-center space-x-4">
            <FaFilter className="text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              aria-label="Filter by status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f]"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* Applications Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#2a7d2f] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {app.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {app.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">{app.profession}</p>
                  </div>
                </div>
                {getStatusBadge(app.status)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FaEnvelope className="mr-2 text-gray-400" />
                  {app.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaPhone className="mr-2 text-gray-400" />
                  {app.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  {app.district}, {app.division}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaCalendar className="mr-2 text-gray-400" />
                  Applied: {new Date(app.appliedAt).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={() => openModal(app)}
                className="w-full flex items-center justify-center px-4 py-2 bg-[#2a7d2f] text-white rounded-lg hover:bg-[#1e5c22] transition-colors"
              >
                <FaEye className="mr-2" />
                View Details & Review
              </button>
            </div>
          ))}
        </motion.div>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No applications found</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setPagination({ ...pagination, page })}
                className={`px-4 py-2 rounded-lg ${
                  pagination.page === page
                    ? 'bg-[#2a7d2f] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Application Details
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900 font-medium">{selectedApp.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedApp.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedApp.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-gray-900">{selectedApp.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-900">
                        {new Date(selectedApp.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Division</label>
                      <p className="text-gray-900">{selectedApp.division}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">District</label>
                      <p className="text-gray-900">{selectedApp.district}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-gray-900">{selectedApp.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Profession</label>
                      <p className="text-gray-900">{selectedApp.profession}</p>
                    </div>
                    {selectedApp.organization && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Organization</label>
                        <p className="text-gray-900">{selectedApp.organization}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Skills</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedApp.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Motivation</label>
                    <p className="text-gray-900 mt-1">{selectedApp.motivation}</p>
                  </div>

                  {selectedApp.experience && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Experience</label>
                      <p className="text-gray-900 mt-1">{selectedApp.experience}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-2">{getStatusBadge(selectedApp.status)}</div>
                  </div>

                  {selectedApp.status === 'pending' && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Review Note</label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        placeholder="Add a note for this review..."
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                {selectedApp.status === 'pending' && (
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => handleReview(selectedApp._id, 'approved')}
                      disabled={isReviewing}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isReviewing ? 'Processing...' : 'Approve Application'}
                    </button>
                    <button
                      onClick={() => handleReview(selectedApp._id, 'rejected')}
                      disabled={isReviewing}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isReviewing ? 'Processing...' : 'Reject Application'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
