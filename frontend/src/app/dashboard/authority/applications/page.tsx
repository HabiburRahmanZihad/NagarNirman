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
} from 'react-icons/fa';
import { RefreshButton } from '@/components/common';

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

export default function ProblemSolverApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
  const [userDivision, setUserDivision] = useState<string>('');

  useEffect(() => {
    const division = checkAuth();
    if (division) {
      setUserDivision(division);
    }
  }, []);

  useEffect(() => {
    if (userDivision) {
      fetchApplications();
    }
  }, [filterStatus, pagination.page, userDivision]);

  const checkAuth = () => {
    const userDataStr = localStorage.getItem('nn_user');
    if (!userDataStr) {
      router.push('/auth/login');
      return null;
    }

    const userData = JSON.parse(userDataStr);
    if (userData.role !== 'authority') {
      toast.error('Unauthorized access');
      router.push('/dashboard');
      return null;
    }

    return userData.division;
  };

  const fetchApplications = async (showToast = false) => {
    if (showToast) {
      setIsRefreshing(true);
    }
    try {
      const { problemSolverAPI } = await import('@/utils/api');
      const filters: any = {
        page: pagination.page,
        limit: 10,
        division: userDivision // Filter by authority's division
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
      setIsRefreshing(false);
      if (showToast) {
        toast.success('Applications refreshed!');
      }
    }
  };

  const handleReview = async (appId: string, status: 'approved' | 'rejected') => {
    setIsReviewing(true);
    try {
      const { problemSolverAPI } = await import('@/utils/api');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a7d2f]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Problem Solver Applications
          </h1>
          <p className="text-gray-600">
            Review and manage applications from citizens who want to become problem solvers
            {userDivision && (
              <span className="inline-flex items-center ml-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                📍 {userDivision} Division
              </span>
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
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
              <span className="text-sm text-gray-600">
                Total: {pagination.total} applications
              </span>
            </div>
            <RefreshButton
              onClick={() => fetchApplications(true)}
              isRefreshing={isRefreshing}
              variant="primary"
            />
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No applications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {app.fullName}
                      </h3>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaEnvelope className="mr-2 text-[#2a7d2f]" />
                        {app.email}
                      </div>
                      <div className="flex items-center">
                        <FaPhone className="mr-2 text-[#2a7d2f]" />
                        {app.phone}
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-[#2a7d2f]" />
                        {app.district}, {app.division}
                      </div>
                      <div className="flex items-center">
                        <FaBriefcase className="mr-2 text-[#2a7d2f]" />
                        {app.profession}
                      </div>
                      <div className="flex items-center">
                        <FaCalendar className="mr-2 text-[#2a7d2f]" />
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <FaTransgender className="mr-2 text-[#2a7d2f]" />
                        {app.gender}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-700">
                        <strong>Skills:</strong> {app.skills.join(', ')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => openModal(app)}
                    className="ml-4 bg-[#2a7d2f] text-white px-4 py-2 rounded-lg hover:bg-[#236b27] transition-colors flex items-center space-x-2"
                  >
                    <FaEye />
                    <span>View Details</span>
                  </button>
                </div>
              </motion.div>
            ))}
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
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Personal Info */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <strong>Full Name:</strong> {selectedApp.fullName}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedApp.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {selectedApp.phone}
                  </div>
                  <div>
                    <strong>Date of Birth:</strong>{' '}
                    {new Date(selectedApp.dateOfBirth).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Gender:</strong> {selectedApp.gender}
                  </div>
                  <div>
                    <strong>Profession:</strong> {selectedApp.profession}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <strong>Division:</strong> {selectedApp.division}
                  </div>
                  <div>
                    <strong>District:</strong> {selectedApp.district}
                  </div>
                  <div className="col-span-2">
                    <strong>Address:</strong> {selectedApp.address}
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Professional Information</h3>
                <div className="space-y-2 text-sm">
                  {selectedApp.organization && (
                    <div>
                      <strong>Organization:</strong> {selectedApp.organization}
                    </div>
                  )}
                  <div>
                    <strong>Skills:</strong> {selectedApp.skills.join(', ')}
                  </div>
                </div>
              </div>

              {/* Documents & Images */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Documents & Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedApp.profileImage && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Profile Photo</p>
                      <img
                        src={selectedApp.profileImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300"
                      />
                    </div>
                  )}
                  {selectedApp.nidOrIdDoc && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">ID Document</p>
                      <a
                        href={selectedApp.nidOrIdDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <img
                          src={selectedApp.nidOrIdDoc}
                          alt="ID Document"
                          className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300 hover:border-[#2a7d2f] transition-colors cursor-pointer"
                        />
                      </a>
                      <p className="text-xs text-gray-500 mt-1">Click to view full size</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Motivation & Experience */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Motivation</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedApp.motivation}
                </p>
                {selectedApp.experience && (
                  <>
                    <h3 className="text-lg font-semibold mb-3 mt-4">Experience</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedApp.experience}
                    </p>
                  </>
                )}
              </div>

              {/* Review Section */}
              {selectedApp.status === 'pending' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Note (Optional)
                    </label>
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] resize-none"
                      rows={3}
                      placeholder="Add any notes about your decision..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleReview(selectedApp._id, 'approved')}
                      disabled={isReviewing}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <FaCheckCircle />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReview(selectedApp._id, 'rejected')}
                      disabled={isReviewing}
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <FaTimesCircle />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Review Info if already reviewed */}
              {selectedApp.status !== 'pending' && selectedApp.reviewNote && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Review Note</h3>
                  <p className="text-sm text-gray-700">{selectedApp.reviewNote}</p>
                  {selectedApp.reviewedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Reviewed on {new Date(selectedApp.reviewedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
