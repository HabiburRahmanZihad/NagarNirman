'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
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
} from 'react-icons/fa';
import {
  FullPageLoading,
} from '@/components/common';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
} from 'lucide-react';
import Image from 'next/image';
import type { PaginatedResponse } from '@/types';

// Using shared `PaginatedResponse` from '@/types'

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
      const filters: { status?: string; division?: string; district?: string; page?: number; limit?: number } = {
        page: pagination.page,
        limit: 10,
        division: userDivision // Filter by authority's division
      };

      if (filterStatus !== 'all') {
        filters.status = filterStatus;
      }

      // ✅ FIXED: Add type assertion for API response
      const response = await problemSolverAPI.getAllApplications(filters) as PaginatedResponse<Application>;

      // ✅ FIXED: Now TypeScript knows the response structure
      setApplications(response.data);
      setPagination(response.pagination);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Failed to load applications';
      toast.error(message);
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Failed to review application';
      toast.error(message);
      console.error(error);
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
    <div className="space-y-4 xs:space-y-6 sm:space-y-8 px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 lg:py-8 bg-base-300 min-h-screen container mx-auto">
      <Toaster position="top-right" />

      {/* Welcome Section with Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary text-white rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 xs:p-6 sm:p-8 lg:p-12 border-t-4 border-accent flex items-center justify-between gap-3 xs:gap-4"
      >
        <div className="min-w-0 flex-1">
          <h1 className="text-lg xs:text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-1 xs:mb-2 sm:mb-3 truncate xs:whitespace-normal">
            <span className="hidden xs:inline">Problem Solver Applications</span>
            <span className="xs:hidden">Applications</span> 📋
          </h1>
          <p className="text-white/90 text-xs xs:text-sm sm:text-lg font-semibold">
            Review applications from <span className="text-accent font-bold">{userDivision}</span>
          </p>
        </div>
        <motion.button
          onClick={() => fetchApplications(true)}
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          disabled={isRefreshing}
          className="p-2 xs:p-2.5 sm:p-3 bg-white/20 hover:bg-white/30 rounded-lg xs:rounded-xl sm:rounded-2xl transition-all disabled:opacity-50 shrink-0"
          title="Refresh applications"
        >
          <RefreshCw className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
        </motion.button>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
        {[
          { title: 'Pending Applications', value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { title: 'Approved', value: applications.filter(a => a.status === 'approved').length, icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50' },
          { title: 'Total Applications', value: pagination.total, icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50' },
          { title: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border-2 border-accent/20 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] xs:text-xs sm:text-sm font-bold text-neutral/70 uppercase tracking-wide truncate">{stat.title}</p>
                  <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-extrabold text-info mt-1 xs:mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} bg-white/50 p-1.5 xs:p-2 sm:p-3 rounded-lg xs:rounded-xl shrink-0`}>
                  <Icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters Card */}
      <Card className="rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-t-4 border-secondary p-4 xs:p-5 sm:p-6 lg:p-8 space-y-3 xs:space-y-4 sm:space-y-6">
        <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-info mb-3 xs:mb-4 sm:mb-6 flex items-center gap-2 xs:gap-3">
          <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-secondary rounded-md xs:rounded-lg flex items-center justify-center text-white">
            <Search className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
          </div>
          Filter Applications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
          {/* Status Filter */}
          <div>
            <label className="block text-xs xs:text-sm font-bold text-info mb-2 xs:mb-3 uppercase tracking-wide">
              Filter by Status
            </label>
            <select
              aria-label="Filter by status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral font-medium text-xs xs:text-sm sm:text-base"
            >
              <option value="all">All Applications</option>
              <option value="pending">⏳ Pending</option>
              <option value="approved">✅ Approved</option>
              <option value="rejected">❌ Rejected</option>
            </select>
          </div>

          {/* Total Display */}
          <div className="flex items-end">
            <div className="w-full p-3 xs:p-4 bg-linear-to-br from-primary/5 to-secondary/5 rounded-lg xs:rounded-xl border border-primary/10">
              <p className="text-xs xs:text-sm font-bold text-neutral/70 uppercase tracking-wide mb-1.5 xs:mb-2">Total Applications : {pagination.total}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Applications List */}
      {applications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-base-100 rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-6 xs:p-8 sm:p-12 text-center border-2 border-accent/20"
        >
          <FileText className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 text-neutral/30 mx-auto mb-3 xs:mb-4" />
          <p className="text-neutral/70 text-sm xs:text-base sm:text-lg font-bold">No applications found</p>
          <p className="text-neutral/50 mt-1 text-xs xs:text-sm">Try adjusting your filters</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-3 xs:gap-4 sm:gap-6">
          {applications.map((app, index) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-base-100 rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-2 border-accent/20 overflow-hidden hover:shadow-xl sm:hover:shadow-2xl transition-all p-4 xs:p-5 sm:p-6 lg:p-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 xs:mb-5 sm:mb-6 pb-4 xs:pb-5 sm:pb-6 border-b border-accent/10 gap-3 xs:gap-4">
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 flex-wrap">
                    <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-extrabold text-info truncate">
                      {app.fullName}
                    </h3>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 text-xs xs:text-sm text-neutral/70">
                    <div className="flex items-center gap-1.5 xs:gap-2">
                      <FaEnvelope className="text-secondary shrink-0 w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="font-medium truncate">{app.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 xs:gap-2">
                      <FaPhone className="text-secondary shrink-0 w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="font-medium">{app.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 xs:gap-2">
                      <FaMapMarkerAlt className="text-accent shrink-0 w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="font-medium truncate">{app.district}, {app.division}</span>
                    </div>
                    <div className="flex items-center gap-1.5 xs:gap-2">
                      <FaBriefcase className="text-primary shrink-0 w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="font-medium">{app.profession}</span>
                    </div>
                    <div className="flex items-center gap-1.5 xs:gap-2">
                      <FaCalendar className="text-primary shrink-0 w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="font-medium">{new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 xs:gap-2">
                      <FaTransgender className="text-secondary shrink-0 w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="font-medium">{app.gender}</span>
                    </div>
                  </div>

                  <div className="mt-3 xs:mt-4 flex flex-wrap gap-1.5 xs:gap-2">
                    {app.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 xs:px-3 py-0.5 xs:py-1 bg-primary/20 text-primary text-[10px] xs:text-xs font-bold rounded-full">
                        {skill}
                      </span>
                    ))}
                    {app.skills.length > 3 && (
                      <span className="px-2 xs:px-3 py-0.5 xs:py-1 bg-neutral/20 text-neutral text-[10px] xs:text-xs font-bold rounded-full">
                        +{app.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => openModal(app)}
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto sm:ml-4 shrink-0 text-xs xs:text-sm"
                >
                  View Details
                </Button>
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
          className="flex justify-center flex-wrap gap-1.5 xs:gap-2 sm:gap-3"
        >
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              onClick={() => setPagination({ ...pagination, page })}
              variant={pagination.page === page ? 'primary' : 'ghost'}
              size="sm"
              className={pagination.page === page ? 'scale-110' : ''}
            >
              {page}
            </Button>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 xs:p-3 sm:p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-base-100 rounded-xl xs:rounded-2xl sm:rounded-3xl max-w-4xl w-full my-4 xs:my-6 sm:my-8 shadow-xl sm:shadow-2xl border-2 border-accent/20 overflow-hidden"
          >
            <div className="bg-primary text-white p-3 xs:p-4 sm:p-6 flex justify-between items-center border-b-4 border-accent">
              <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold">Application Details</h2>
              <button
                onClick={closeModal}
                className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white text-lg xs:text-xl sm:text-2xl transition-colors"
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="p-3 xs:p-4 sm:p-6 max-h-[calc(90vh-100px)] xs:max-h-[calc(90vh-110px)] sm:max-h-[calc(90vh-120px)] overflow-y-auto">

              <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                {/* Personal Info */}
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border border-blue-100">
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold text-info mb-3 xs:mb-4 flex items-center gap-2 xs:gap-3">
                    <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-primary rounded-md xs:rounded-lg flex items-center justify-center text-white">
                      <FaUser className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 text-xs xs:text-sm">
                    <div>
                      <strong className="text-neutral/70">Full Name:</strong> <span className="text-info">{selectedApp.fullName}</span>
                    </div>
                    <div>
                      <strong className="text-neutral/70">Email:</strong> <span className="text-info break-all">{selectedApp.email}</span>
                    </div>
                    <div>
                      <strong className="text-neutral/70">Phone:</strong> <span className="text-info">{selectedApp.phone}</span>
                    </div>
                    <div>
                      <strong className="text-neutral/70">Date of Birth:</strong> <span className="text-info">{new Date(selectedApp.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <strong className="text-neutral/70">Gender:</strong> <span className="text-info">{selectedApp.gender}</span>
                    </div>
                    <div>
                      <strong className="text-neutral/70">Profession:</strong> <span className="text-info">{selectedApp.profession}</span>
                    </div>
                    {selectedApp.nidNumber && (
                      <div>
                        <strong className="text-neutral/70">NID Number:</strong> <span className="text-info">{selectedApp.nidNumber}</span>
                      </div>
                    )}
                    {selectedApp.educationLevel && (
                      <div>
                        <strong className="text-neutral/70">Education Level:</strong> <span className="text-info">{selectedApp.educationLevel}</span>
                      </div>
                    )}
                    {selectedApp.availability && (
                      <div>
                        <strong className="text-neutral/70">Availability:</strong> <span className="text-info">{selectedApp.availability}</span>
                      </div>
                    )}
                    {selectedApp.languagesSpoken && selectedApp.languagesSpoken.length > 0 && (
                      <div className="col-span-1 xs:col-span-2">
                        <strong className="text-neutral/70">Languages Spoken:</strong>
                        <div className="flex flex-wrap gap-1.5 xs:gap-2 mt-1.5 xs:mt-2">
                          {selectedApp.languagesSpoken.map((lang, idx) => (
                            <span key={idx} className="px-2 xs:px-3 py-0.5 xs:py-1 bg-primary/20 text-primary rounded-full text-xs xs:text-sm font-medium">
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
                  <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border border-red-100">
                    <h3 className="text-base xs:text-lg sm:text-xl font-bold text-info mb-3 xs:mb-4 flex items-center gap-2 xs:gap-3">
                      <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-secondary rounded-md xs:rounded-lg flex items-center justify-center text-white">
                        <FaPhone className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <strong className="text-neutral/70">Name:</strong> <span className="text-info">{selectedApp.emergencyContactName}</span>
                      </div>
                      <div>
                        <strong className="text-neutral/70">Phone:</strong> <span className="text-info">{selectedApp.emergencyContact}</span>
                      </div>
                      <div>
                        <strong className="text-neutral/70">Relation:</strong> <span className="text-info">{selectedApp.emergencyContactRelation}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border border-green-100">
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold text-info mb-3 xs:mb-4 flex items-center gap-2 xs:gap-3">
                    <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-primary rounded-md xs:rounded-lg flex items-center justify-center text-white">
                      <FaMapMarkerAlt className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    Location
                  </h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 text-xs xs:text-sm">
                    <div>
                      <strong className="text-neutral/70">Division:</strong> <span className="text-info">{selectedApp.division}</span>
                    </div>
                    <div>
                      <strong className="text-neutral/70">District:</strong> <span className="text-info">{selectedApp.district}</span>
                    </div>
                    <div className="col-span-1 xs:col-span-2">
                      <strong className="text-neutral/70">Address:</strong> <span className="text-info">{selectedApp.address}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border border-purple-100">
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold text-info mb-3 xs:mb-4 flex items-center gap-2 xs:gap-3">
                    <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-secondary rounded-md xs:rounded-lg flex items-center justify-center text-white">
                      <FaBriefcase className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    Professional Information
                  </h3>
                  <div className="space-y-2 text-xs xs:text-sm">
                    {selectedApp.organization && (
                      <div>
                        <strong className="text-neutral/70">Organization:</strong> <span className="text-info">{selectedApp.organization}</span>
                      </div>
                    )}
                    <div>
                      <strong className="text-neutral/70">Skills:</strong>
                      <div className="flex flex-wrap gap-1.5 xs:gap-2 mt-1.5 xs:mt-2">
                        {selectedApp.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 xs:px-3 py-0.5 xs:py-1 bg-primary/20 text-primary rounded-full text-xs xs:text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedApp.previousVolunteerWork && (
                      <div>
                        <strong className="text-neutral/70">Previous Volunteer Work:</strong>
                        <p className="mt-1 text-neutral whitespace-pre-wrap wrap-break-word bg-white p-2 xs:p-3 rounded-md xs:rounded-lg text-xs xs:text-sm">{selectedApp.previousVolunteerWork}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Media Links */}
                {(selectedApp.linkedinProfile || selectedApp.facebookProfile || selectedApp.twitterProfile || selectedApp.websiteProfile) && (
                  <div className="bg-linear-to-br from-cyan-50 to-blue-50 rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border border-cyan-100">
                    <h3 className="text-base xs:text-lg sm:text-xl font-bold text-info mb-3 xs:mb-4 flex items-center gap-2 xs:gap-3">
                      <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-primary rounded-md xs:rounded-lg flex items-center justify-center text-white">
                        <FaEnvelope className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <span className="hidden xs:inline">Social Media & Professional Links</span>
                      <span className="xs:hidden">Links</span>
                    </h3>
                    <div className="space-y-2 text-xs xs:text-sm">
                      {selectedApp.linkedinProfile && (
                        <div>
                          <strong className="text-neutral/70">LinkedIn:</strong>{' '}
                          <a
                            href={selectedApp.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium break-all"
                          >
                            {selectedApp.linkedinProfile}
                          </a>
                        </div>
                      )}
                      {selectedApp.facebookProfile && (
                        <div>
                          <strong className="text-neutral/70">Facebook:</strong>{' '}
                          <a
                            href={selectedApp.facebookProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium break-all"
                          >
                            {selectedApp.facebookProfile}
                          </a>
                        </div>
                      )}
                      {selectedApp.twitterProfile && (
                        <div>
                          <strong className="text-neutral/70">Twitter/X:</strong>{' '}
                          <a
                            href={selectedApp.twitterProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium break-all"
                          >
                            {selectedApp.twitterProfile}
                          </a>
                        </div>
                      )}
                      {selectedApp.websiteProfile && (
                        <div>
                          <strong className="text-neutral/70">Personal Website:</strong>{' '}
                          <a
                            href={selectedApp.websiteProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium break-all"
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
                  <div className="bg-linear-to-br from-amber-50 to-yellow-50 rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border border-amber-100">
                    <h3 className="text-base xs:text-lg sm:text-xl font-bold text-info mb-3 xs:mb-4 flex items-center gap-2 xs:gap-3">
                      <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-accent rounded-md xs:rounded-lg flex items-center justify-center text-white">
                        <FaCalendar className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <span className="hidden xs:inline">NID & Important Documents</span>
                      <span className="xs:hidden">Documents</span>
                    </h3>
                    <div>
                      <a
                        href={selectedApp.nidOrIdDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Image
                          width={200}
                          height={200}
                          src={selectedApp.nidOrIdDoc}
                          alt="NID Document"
                          className="max-w-full h-auto max-h-48 xs:max-h-64 sm:max-h-96 rounded-md xs:rounded-lg object-contain border-2 border-accent/20 hover:border-accent/60 transition-colors cursor-pointer"
                        />
                      </a>
                      <p className="text-[10px] xs:text-xs text-neutral/60 mt-1.5 xs:mt-2 font-medium">Click image to view in full size</p>
                    </div>
                  </div>
                )}

                {/* Motivation & Experience */}
                <div className="bg-linear-to-br from-teal-50 to-cyan-50 rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border border-teal-100">
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold text-info mb-3 xs:mb-4 flex items-center gap-2 xs:gap-3">
                    <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-primary rounded-md xs:rounded-lg flex items-center justify-center text-white">
                      <FaBriefcase className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    Motivation
                  </h3>
                  <p className="text-xs xs:text-sm text-neutral whitespace-pre-wrap wrap-break-word bg-white p-2 xs:p-3 sm:p-4 rounded-md xs:rounded-lg overflow-wrap-anywhere font-medium">
                    {selectedApp.motivation}
                  </p>
                  {selectedApp.experience && (
                    <>
                      <h3 className="text-base xs:text-lg sm:text-xl font-bold text-info mb-3 xs:mb-4 mt-4 xs:mt-5 sm:mt-6 flex items-center gap-2 xs:gap-3">
                        <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-secondary rounded-md xs:rounded-lg flex items-center justify-center text-white">
                          <FaEnvelope className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        Experience
                      </h3>
                      <p className="text-xs xs:text-sm text-neutral whitespace-pre-wrap wrap-break-word bg-white p-2 xs:p-3 sm:p-4 rounded-md xs:rounded-lg overflow-wrap-anywhere font-medium">
                        {selectedApp.experience}
                      </p>
                    </>
                  )}
                </div>

                {/* Review Section */}
                {selectedApp.status === 'pending' && (
                  <div className="bg-linear-to-br from-slate-50 to-gray-100 rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border-2 border-dashed border-accent/30 space-y-3 xs:space-y-4">
                    <div>
                      <label className="block text-xs xs:text-sm font-bold text-info mb-2 xs:mb-3 uppercase tracking-wide">
                        📝 Review Note (Optional)
                      </label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        className="w-full px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-3 border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral resize-none shadow-sm font-medium text-xs xs:text-sm"
                        rows={3}
                        placeholder="Add any notes about your decision..."
                      />
                    </div>

                    <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4">
                      <Button
                        onClick={() => handleReview(selectedApp._id, 'approved')}
                        disabled={isReviewing}
                        variant="primary"
                        size="lg"
                        isLoading={isReviewing}
                        className="flex-1 text-xs xs:text-sm"
                      >
                        ✅ Approve
                      </Button>
                      <Button
                        onClick={() => handleReview(selectedApp._id, 'rejected')}
                        disabled={isReviewing}
                        variant="danger"
                        size="lg"
                        isLoading={isReviewing}
                        className="flex-1 text-xs xs:text-sm"
                      >
                        ❌ Reject
                      </Button>
                    </div>
                  </div>
                )}

                {/* Review Info if already reviewed */}
                {selectedApp.status !== 'pending' && selectedApp.reviewNote && (
                  <div className="bg-linear-to-br from-gray-50 to-slate-100 rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border-2 border-neutral/20">
                    <h3 className="text-base xs:text-lg sm:text-xl font-bold text-info mb-2 xs:mb-3 flex items-center gap-2 xs:gap-3">
                      <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-neutral rounded-md xs:rounded-lg flex items-center justify-center text-white">
                        <FaCheckCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      Review Note
                    </h3>
                    <p className="text-xs xs:text-sm sm:text-base text-neutral bg-white p-2 xs:p-3 sm:p-4 rounded-md xs:rounded-lg font-medium">{selectedApp.reviewNote}</p>
                    {selectedApp.reviewedAt && (
                      <p className="text-[10px] xs:text-xs sm:text-sm text-neutral/60 mt-2 xs:mt-3 flex items-center gap-1.5 xs:gap-2 font-medium">
                        <FaCalendar className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
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