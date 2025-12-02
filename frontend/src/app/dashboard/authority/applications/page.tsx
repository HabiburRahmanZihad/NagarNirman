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
import { RefreshButton, FullPageLoading } from '@/components/common';

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
  nidOrIdDoc: string;
  nidNumber: string;
  emergencyContact: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  educationLevel?: string;
  availability?: string;
  languagesSpoken: string[];
  previousVolunteerWork?: string;
  linkedinProfile: string;
  facebookProfile?: string;
  twitterProfile?: string;
  websiteProfile?: string;
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
    return <FullPageLoading text="Loading applications..." />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h1 className="text-4xl font-bold bg-linear-to-r from-[#2a7d2f] to-[#1e5a23] bg-clip-text text-transparent mb-3">
            Problem Solver Applications
          </h1>
          <p className="text-gray-700 text-lg">
            Review and manage applications from citizens who want to become problem solvers
            {userDivision && (
              <span className="inline-flex items-center ml-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-linear-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm">
                📍 {userDivision} Division
              </span>
            )}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4 flex-wrap">
              <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-[#2a7d2f] to-[#1e5a23] rounded-xl shadow-md">
                <FaFilter className="text-white" />
              </div>
              <label className="text-sm font-semibold text-gray-700">Filter by Status:</label>
              <select
                aria-label="Filter by status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-5 py-2.5 bg-white/90 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] font-medium text-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <option value="all">All Applications</option>
                <option value="pending">⏳ Pending</option>
                <option value="approved">✅ Approved</option>
                <option value="rejected">❌ Rejected</option>
              </select>
              <div className="px-5 py-2.5 bg-linear-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200 shadow-sm">
                <span className="text-sm font-semibold text-blue-900">
                  Total: <span className="text-lg">{pagination.total}</span> applications
                </span>
              </div>
            </div>
            <RefreshButton
              onClick={() => fetchApplications(true)}
              isRefreshing={isRefreshing}
              variant="primary"
            />
          </div>
        </motion.div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center"
          >
            <div className="w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-5xl">📋</span>
            </div>
            <p className="text-gray-600 text-xl font-medium">No applications found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {applications.map((app, index) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6 border border-gray-200 hover:border-[#2a7d2f]/50"
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
                    className="ml-4 bg-linear-to-r from-[#2a7d2f] to-[#1e5a23] text-white px-6 py-3 rounded-xl hover:from-[#236b27] hover:to-[#1a4d1f] transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                  >
                    <FaEye className="text-lg" />
                    <span>View Details</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-center space-x-3"
          >
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setPagination({ ...pagination, page })}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg ${pagination.page === page
                    ? 'bg-linear-to-r from-[#2a7d2f] to-[#1e5a23] text-white scale-110'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                {page}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-linear-to-r from-[#2a7d2f] to-[#1e5a23] text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Application Details</h2>
              <button
                onClick={closeModal}
                className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">

              <div className="space-y-6">
                {/* Personal Info */}
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-8 bg-linear-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></span>
                    Personal Information
                  </h3>
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
                    {selectedApp.nidNumber && (
                      <div>
                        <strong>NID Number:</strong> {selectedApp.nidNumber}
                      </div>
                    )}
                    {selectedApp.educationLevel && (
                      <div>
                        <strong>Education Level:</strong> {selectedApp.educationLevel}
                      </div>
                    )}
                    {selectedApp.availability && (
                      <div>
                        <strong>Availability:</strong> {selectedApp.availability}
                      </div>
                    )}
                    {selectedApp.languagesSpoken && selectedApp.languagesSpoken.length > 0 && (
                      <div className="col-span-2">
                        <strong>Languages Spoken:</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedApp.languagesSpoken.map((lang, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Emergency Contact */}
                {selectedApp.emergencyContactName && (
                  <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-8 bg-linear-to-b from-red-500 to-orange-600 rounded-full mr-3"></span>
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <strong>Name:</strong> {selectedApp.emergencyContactName}
                      </div>
                      <div>
                        <strong>Phone:</strong> {selectedApp.emergencyContact}
                      </div>
                      <div>
                        <strong>Relation:</strong> {selectedApp.emergencyContactRelation}
                      </div>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-8 bg-linear-to-b from-green-500 to-emerald-600 rounded-full mr-3"></span>
                    Location
                  </h3>
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
                <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-8 bg-linear-to-b from-purple-500 to-pink-600 rounded-full mr-3"></span>
                    Professional Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    {selectedApp.organization && (
                      <div>
                        <strong>Organization:</strong> {selectedApp.organization}
                      </div>
                    )}
                    <div>
                      <strong>Skills:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedApp.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedApp.previousVolunteerWork && (
                      <div>
                        <strong>Previous Volunteer Work:</strong>
                        <p className="mt-1 text-gray-700 whitespace-pre-wrap wrap-break-word bg-white p-3 rounded-lg">{selectedApp.previousVolunteerWork}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Media Links */}
                {(selectedApp.linkedinProfile || selectedApp.facebookProfile || selectedApp.twitterProfile || selectedApp.websiteProfile) && (
                  <div className="bg-linear-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-8 bg-linear-to-b from-cyan-500 to-blue-600 rounded-full mr-3"></span>
                      Social Media & Professional Links
                    </h3>
                    <div className="space-y-2 text-sm">
                      {selectedApp.linkedinProfile && (
                        <div>
                          <strong>LinkedIn:</strong>{' '}
                          <a
                            href={selectedApp.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedApp.linkedinProfile}
                          </a>
                        </div>
                      )}
                      {selectedApp.facebookProfile && (
                        <div>
                          <strong>Facebook:</strong>{' '}
                          <a
                            href={selectedApp.facebookProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedApp.facebookProfile}
                          </a>
                        </div>
                      )}
                      {selectedApp.twitterProfile && (
                        <div>
                          <strong>Twitter/X:</strong>{' '}
                          <a
                            href={selectedApp.twitterProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedApp.twitterProfile}
                          </a>
                        </div>
                      )}
                      {selectedApp.websiteProfile && (
                        <div>
                          <strong>Personal Website:</strong>{' '}
                          <a
                            href={selectedApp.websiteProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedApp.websiteProfile}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents & Images */}
                {selectedApp.nidOrIdDoc && (
                  <div className="bg-linear-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-8 bg-linear-to-b from-amber-500 to-yellow-600 rounded-full mr-3"></span>
                      NID & Important Documents
                    </h3>
                    <div>
                      <a
                        href={selectedApp.nidOrIdDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <img
                          src={selectedApp.nidOrIdDoc}
                          alt="NID Document"
                          className="max-w-full h-auto max-h-96 rounded-lg object-contain border-2 border-gray-300 hover:border-[#2a7d2f] transition-colors cursor-pointer"
                        />
                      </a>
                      <p className="text-xs text-gray-500 mt-2">Click image to view in full size</p>
                    </div>
                  </div>
                )}

                {/* Motivation & Experience */}
                <div className="bg-linear-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-8 bg-linear-to-b from-teal-500 to-cyan-600 rounded-full mr-3"></span>
                    Motivation
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap wrap-break-word bg-white p-4 rounded-lg overflow-wrap-anywhere">
                    {selectedApp.motivation}
                  </p>
                  {selectedApp.experience && (
                    <>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6 flex items-center">
                        <span className="w-2 h-8 bg-linear-to-b from-teal-500 to-cyan-600 rounded-full mr-3"></span>
                        Experience
                      </h3>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap wrap-break-word bg-white p-4 rounded-lg overflow-wrap-anywhere">
                        {selectedApp.experience}
                      </p>
                    </>
                  )}
                </div>

                {/* Review Section */}
                {selectedApp.status === 'pending' && (
                  <div className="bg-linear-to-br from-slate-50 to-gray-100 rounded-2xl p-6 border-2 border-dashed border-gray-300 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        📝 Review Note (Optional)
                      </label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] resize-none shadow-sm"
                        rows={4}
                        placeholder="Add any notes about your decision..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleReview(selectedApp._id, 'approved')}
                        disabled={isReviewing}
                        className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <FaCheckCircle className="text-xl" />
                        <span>Approve Application</span>
                      </button>
                      <button
                        onClick={() => handleReview(selectedApp._id, 'rejected')}
                        disabled={isReviewing}
                        className="flex-1 bg-linear-to-r from-red-600 to-rose-600 text-white py-4 rounded-xl hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <FaTimesCircle className="text-xl" />
                        <span>Reject Application</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Review Info if already reviewed */}
                {selectedApp.status !== 'pending' && selectedApp.reviewNote && (
                  <div className="bg-linear-to-br from-gray-50 to-slate-100 rounded-2xl p-6 border-2 border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <span className="w-2 h-8 bg-linear-to-b from-gray-500 to-slate-600 rounded-full mr-3"></span>
                      Review Note
                    </h3>
                    <p className="text-base text-gray-700 bg-white p-4 rounded-lg">{selectedApp.reviewNote}</p>
                    {selectedApp.reviewedAt && (
                      <p className="text-sm text-gray-500 mt-3 flex items-center">
                        <FaCalendar className="mr-2" />
                        Reviewed on {new Date(selectedApp.reviewedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
