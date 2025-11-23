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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#2a7d2f] border-b-[#2a7d2f] border-l-transparent border-r-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Toaster position="top-right" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#2a7d2f] to-[#1e5a23] rounded-xl shadow-lg">
              <FaShieldAlt className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2a7d2f] to-[#1e5a23] bg-clip-text text-transparent">
                All Applications Management
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
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
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#2a7d2f] to-[#1e5a23] rounded-xl shadow-md">
              <FaFilter className="text-white" />
            </div>
            <label className="text-sm font-semibold text-gray-700">Filter by Status:</label>
            <select
              aria-label="Filter by status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] font-medium text-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <option value="all">All Applications</option>
              <option value="pending">⏳ Pending</option>
              <option value="approved">✅ Approved</option>
              <option value="rejected">❌ Rejected</option>
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
          {applications.map((app, index) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6 border border-gray-200 hover:border-[#2a7d2f]/50"
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
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#2a7d2f] to-[#1e5a23] text-white rounded-xl hover:from-[#236b27] hover:to-[#1a4d1f] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
              >
                <FaEye className="mr-2 text-lg" />
                View Details & Review
              </button>
            </motion.div>
          ))}
        </motion.div>

        {applications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-5xl">📋</span>
            </div>
            <p className="text-gray-600 text-xl font-medium">No applications found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </motion.div>
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
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
                  pagination.page === page
                    ? 'bg-gradient-to-r from-[#2a7d2f] to-[#1e5a23] text-white scale-110'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </motion.div>
        )}

        {/* Modal */}
        {showModal && selectedApp && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#2a7d2f] to-[#1e5a23] text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Application Details</h2>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white text-2xl transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">

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
                    {selectedApp.nidNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">NID Number</label>
                        <p className="text-gray-900">{selectedApp.nidNumber}</p>
                      </div>
                    )}
                    {selectedApp.educationLevel && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Education Level</label>
                        <p className="text-gray-900">{selectedApp.educationLevel}</p>
                      </div>
                    )}
                    {selectedApp.availability && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Availability</label>
                        <p className="text-gray-900">{selectedApp.availability}</p>
                      </div>
                    )}
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
                    {selectedApp.languagesSpoken && selectedApp.languagesSpoken.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Languages Spoken</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedApp.languagesSpoken.map((lang: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Emergency Contact Section */}
                {selectedApp.emergencyContactName && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Name</label>
                        <p className="text-gray-900">{selectedApp.emergencyContactName}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900">{selectedApp.emergencyContact}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Relation</label>
                        <p className="text-gray-900">{selectedApp.emergencyContactRelation}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Skills</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedApp.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedApp.languagesSpoken && selectedApp.languagesSpoken.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Languages Spoken</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedApp.languagesSpoken.map((lang, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Motivation</label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-lg">{selectedApp.motivation}</p>
                  </div>

                  {selectedApp.experience && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Experience</label>
                      <p className="text-gray-900 mt-1 whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-lg">{selectedApp.experience}</p>
                    </div>
                  )}

                  {selectedApp.previousVolunteerWork && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Previous Volunteer Work</label>
                      <p className="text-gray-900 mt-1 whitespace-pre-wrap break-words bg-green-50 p-4 rounded-lg">{selectedApp.previousVolunteerWork}</p>
                    </div>
                  )}

                  {/* Social Media Links */}
                  {(selectedApp.linkedinProfile || selectedApp.facebookProfile || selectedApp.twitterProfile || selectedApp.websiteProfile) && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-3 block">Social Media & Professional Links</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedApp.linkedinProfile && (
                          <a
                            href={selectedApp.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                          >
                            <span className="text-blue-600 font-medium">🔗 LinkedIn Profile</span>
                          </a>
                        )}
                        {selectedApp.facebookProfile && (
                          <a
                            href={selectedApp.facebookProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                          >
                            <span className="text-blue-600 font-medium">📘 Facebook Profile</span>
                          </a>
                        )}
                        {selectedApp.twitterProfile && (
                          <a
                            href={selectedApp.twitterProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-3 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
                          >
                            <span className="text-sky-600 font-medium">🐦 Twitter Profile</span>
                          </a>
                        )}
                        {selectedApp.websiteProfile && (
                          <a
                            href={selectedApp.websiteProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                          >
                            <span className="text-purple-600 font-medium">🌐 Personal Website</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* NID Document */}
                  {selectedApp.nidOrIdDoc && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">NID & Important Documents</label>
                      <a
                        href={selectedApp.nidOrIdDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2"
                      >
                        <img
                          src={selectedApp.nidOrIdDoc}
                          alt="NID Document"
                          className="max-w-full h-auto max-h-96 rounded-lg object-contain border-2 border-gray-300 hover:border-[#2a7d2f] transition-colors cursor-pointer"
                        />
                      </a>
                      <p className="text-xs text-gray-500 mt-1">Click to view in full size</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-2">{getStatusBadge(selectedApp.status)}</div>
                  </div>

                  {selectedApp.status === 'pending' && (
                    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 border-2 border-dashed border-gray-300">
                      <label className="text-sm font-bold text-gray-700 mb-3 block">📝 Review Note (Optional)</label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        placeholder="Add any notes about your decision..."
                        className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] resize-none shadow-sm"
                        rows={4}
                      />
                    </div>
                  )}
                </div>

                {selectedApp.status === 'pending' && (
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => handleReview(selectedApp._id, 'approved')}
                      disabled={isReviewing}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-bold text-lg flex items-center justify-center"
                    >
                      <FaCheckCircle className="mr-2 text-xl" />
                      {isReviewing ? 'Processing...' : 'Approve Application'}
                    </button>
                    <button
                      onClick={() => handleReview(selectedApp._id, 'rejected')}
                      disabled={isReviewing}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-bold text-lg flex items-center justify-center"
                    >
                      <FaTimesCircle className="mr-2 text-xl" />
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
