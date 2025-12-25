'use client';

import { useEffect, useState, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FullPageLoading } from '@/components/common';
import {
  FileText,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Link2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { problemSolverAPI } from '@/utils/api';
import Card from '@/components/common/Card';
import Image from 'next/image';

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

interface ApplicationFilters {
  page: number;
  limit: number;
  status?: string;
}

// Add ApiResponse interface
interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    pages: number;
    total: number;
  };
  message?: string;
  error?: string;
}

export default function SuperAdminApplications() {
  const { user, isLoading: authLoading } = useAuth();
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

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const filters: ApplicationFilters = {
        page: pagination.page,
        limit: 10,
      };

      if (filterStatus !== 'all') {
        filters.status = filterStatus;
      }

      const response = await problemSolverAPI.getAllApplications(filters);

      // Type assertion for API response
      const apiResponse = response as ApiResponse<Application[]>;

      if (apiResponse.success && apiResponse.data) {
        setApplications(apiResponse.data);
        if (apiResponse.pagination) {
          setPagination(apiResponse.pagination);
        }
      } else {
        toast.error(apiResponse.message || 'Failed to load applications');
      }
    } catch (error) {
      toast.error('Failed to load applications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, pagination.page]);

  useEffect(() => {
    if (user?.role === 'superAdmin') {
      fetchApplications();
    }
  }, [fetchApplications, user]);

  const handleReview = async (appId: string, status: 'approved' | 'rejected') => {
    setIsReviewing(true);
    try {
      await problemSolverAPI.reviewApplication(appId, status, reviewNote);

      toast.success(`Application ${status} successfully!`);
      setShowModal(false);
      setSelectedApp(null);
      setReviewNote('');
      fetchApplications();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to review application';
      toast.error(errorMessage);
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
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold bg-amber-100 text-amber-700 border border-amber-200">
            <Clock className="w-4 h-4" /> Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle2 className="w-4 h-4" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-4 h-4" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (authLoading || loading) {
    return <FullPageLoading text="Loading applications..." />;
  }

  return (
    <div className="space-y-4 xs:space-y-6 sm:space-y-8 px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 lg:py-8 bg-base-300 min-h-screen container mx-auto">
      <Toaster position="top-right" />

      {/* Header with Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary text-white rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 xs:p-6 sm:p-8 lg:p-12 border-t-4 border-accent flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 sm:gap-6"
      >
        <div className="min-w-0">
          <h1 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-1 xs:mb-2 sm:mb-3">
            Applications Management 📋
          </h1>
          <p className="text-white/90 text-xs xs:text-sm sm:text-base lg:text-lg font-semibold">
            Problem solver applications (SuperAdmin)
          </p>
        </div>
        <motion.button
          onClick={() => fetchApplications()}
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="p-2 xs:p-2.5 sm:p-3 bg-white/20 hover:bg-white/30 rounded-lg xs:rounded-xl sm:rounded-2xl transition-all disabled:opacity-50 shrink-0"
          title="Refresh applications"
        >
          <RefreshCw className={`w-5 h-5 xs:w-6 xs:h-6 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
        {[
          {
            title: 'Total Applications',
            value: pagination.total,
            icon: FileText,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Pending',
            value: applications.filter(a => a.status === 'pending').length,
            icon: Clock,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50'
          },
          {
            title: 'Approved',
            value: applications.filter(a => a.status === 'approved').length,
            icon: CheckCircle2,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Rejected',
            value: applications.filter(a => a.status === 'rejected').length,
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50'
          }
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
                  <p className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-info mt-1 xs:mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} bg-white/50 p-1.5 xs:p-2 sm:p-3 rounded-lg xs:rounded-xl shrink-0`}>
                  <Icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <Card>
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 sm:gap-4">
          <label className="text-xs xs:text-sm font-bold text-neutral/70 uppercase tracking-wide shrink-0">Filter Status:</label>
          <select
            aria-label="Filter by status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-100 font-medium text-neutral cursor-pointer hover:border-accent/40 transition-all w-full xs:w-auto"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Applications Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 sm:gap-6"
      >
        {applications.map((app, index) => (
          <motion.div
            key={app._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.3) }}
            className="bg-base-100 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 xs:p-5 sm:p-6 border-t-4 border-secondary hover:shadow-xl sm:hover:shadow-2xl hover:scale-102 sm:hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-2 xs:gap-3 mb-3 xs:mb-4">
              <div className="flex items-center gap-2 xs:gap-3 min-w-0">
                <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 bg-linear-to-br from-primary to-secondary rounded-lg xs:rounded-xl flex items-center justify-center text-white font-bold text-sm xs:text-base sm:text-lg shrink-0">
                  {app.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm xs:text-base sm:text-lg font-bold text-neutral truncate">{app.fullName}</h3>
                  <p className="text-xs xs:text-sm text-neutral/60 truncate">{app.profession}</p>
                </div>
              </div>
              {getStatusBadge(app.status)}
            </div>

            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 mb-3 xs:mb-4 text-xs xs:text-sm">
              <div className="flex items-center gap-1.5 xs:gap-2 text-neutral/70">
                <Mail className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-secondary shrink-0" />
                <span className="truncate">{app.email}</span>
              </div>
              <div className="flex items-center gap-1.5 xs:gap-2 text-neutral/70">
                <Phone className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-secondary shrink-0" />
                <span className="truncate">{app.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 xs:gap-2 text-neutral/70">
                <MapPin className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-secondary shrink-0" />
                <span className="truncate">{app.district}, {app.division}</span>
              </div>
              <div className="flex items-center gap-1.5 xs:gap-2 text-neutral/70">
                <Calendar className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-secondary shrink-0" />
                <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <motion.button
              onClick={() => openModal(app)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 bg-linear-to-r from-primary to-secondary text-white rounded-lg xs:rounded-xl hover:shadow-lg transition-all font-semibold text-sm xs:text-base"
            >
              <Eye className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
              View Details & Review
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {applications.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-base-100 rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-2 border-dashed border-accent/20 p-8 xs:p-12 sm:p-16 text-center"
        >
          <div className="text-4xl xs:text-5xl sm:text-6xl mb-3 xs:mb-4">📋</div>
          <p className="text-base xs:text-lg font-bold text-neutral mb-1 xs:mb-2">No applications found</p>
          <p className="text-neutral/60 text-sm xs:text-base">Try adjusting your filters</p>
        </motion.div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-1.5 xs:gap-2"
        >
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              onClick={() => setPagination({ ...pagination, page })}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl font-semibold text-sm xs:text-base transition-all ${pagination.page === page
                ? 'bg-linear-to-r from-primary to-secondary text-white shadow-lg'
                : 'bg-base-200 text-neutral hover:bg-base-300 border-2 border-accent/20'
                }`}
            >
              {page}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 xs:p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-base-100 rounded-xl xs:rounded-2xl sm:rounded-3xl max-w-4xl w-full my-4 xs:my-6 sm:my-8 shadow-xl sm:shadow-2xl border-t-4 border-secondary overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-primary to-secondary text-white p-4 xs:p-5 sm:p-6 flex justify-between items-center">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold">Application Details 📝</h2>
              <motion.button
                onClick={closeModal}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white text-xl xs:text-2xl transition-colors"
              >
                ×
              </motion.button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-4 xs:p-5 sm:p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 mb-4 xs:mb-5 sm:mb-6">
                <div className="space-y-3 xs:space-y-4">
                  <div>
                    <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase">Full Name</label>
                    <p className="text-neutral font-semibold mt-0.5 xs:mt-1 text-sm xs:text-base">{selectedApp.fullName}</p>
                  </div>
                  <div>
                    <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase">Email</label>
                    <p className="text-neutral mt-0.5 xs:mt-1 text-sm xs:text-base break-all">{selectedApp.email}</p>
                  </div>
                  <div>
                    <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase">Phone</label>
                    <p className="text-neutral mt-0.5 xs:mt-1 text-sm xs:text-base">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase">Gender</label>
                    <p className="text-neutral mt-0.5 xs:mt-1 text-sm xs:text-base">{selectedApp.gender}</p>
                  </div>
                  <div>
                    <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase">Date of Birth</label>
                    <p className="text-neutral mt-0.5 xs:mt-1 text-sm xs:text-base">
                      {new Date(selectedApp.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedApp.nidNumber && (
                    <div>
                      <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase">NID Number</label>
                      <p className="text-neutral mt-0.5 xs:mt-1 text-sm xs:text-base">{selectedApp.nidNumber}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 xs:space-y-4">
                  <div>
                    <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase">Division</label>
                    <p className="text-neutral mt-0.5 xs:mt-1 text-sm xs:text-base">{selectedApp.division}</p>
                  </div>
                  <div>
                    <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase">District</label>
                    <p className="text-neutral mt-0.5 xs:mt-1 text-sm xs:text-base">{selectedApp.district}</p>
                  </div>
                  <div>
                    <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase">Address</label>
                    <p className="text-neutral mt-0.5 xs:mt-1 text-sm xs:text-base">{selectedApp.address}</p>
                  </div>
                  <div>
                    <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase">Profession</label>
                    <p className="text-neutral mt-0.5 xs:mt-1 text-sm xs:text-base">{selectedApp.profession}</p>
                  </div>
                  {selectedApp.organization && (
                    <div>
                      <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase">Organization</label>
                      <p className="text-neutral mt-0.5 xs:mt-1 text-sm xs:text-base">{selectedApp.organization}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              {selectedApp.skills && selectedApp.skills.length > 0 && (
                <div className="mb-4 xs:mb-5 sm:mb-6">
                  <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase block mb-2 xs:mb-3">Skills</label>
                  <div className="flex flex-wrap gap-1.5 xs:gap-2">
                    {selectedApp.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 xs:px-3 py-0.5 xs:py-1 bg-secondary/20 text-secondary rounded-full text-xs xs:text-sm font-medium border border-secondary/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages Section */}
              {selectedApp.languagesSpoken && selectedApp.languagesSpoken.length > 0 && (
                <div className="mb-4 xs:mb-5 sm:mb-6">
                  <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase block mb-2 xs:mb-3">Languages Spoken</label>
                  <div className="flex flex-wrap gap-1.5 xs:gap-2">
                    {selectedApp.languagesSpoken.map((lang, index) => (
                      <span
                        key={index}
                        className="px-2 xs:px-3 py-0.5 xs:py-1 bg-info/20 text-info rounded-full text-xs xs:text-sm font-medium border border-info/30"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivation */}
              <div className="mb-4 xs:mb-5 sm:mb-6">
                <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase block mb-1 xs:mb-2">Motivation</label>
                <div className="bg-base-200 p-3 xs:p-4 rounded-lg xs:rounded-xl text-neutral/80 whitespace-pre-wrap text-xs xs:text-sm border-l-4 border-secondary">
                  {selectedApp.motivation}
                </div>
              </div>

              {/* Experience */}
              {selectedApp.experience && (
                <div className="mb-4 xs:mb-5 sm:mb-6">
                  <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase block mb-1 xs:mb-2">Experience</label>
                  <div className="bg-base-200 p-3 xs:p-4 rounded-lg xs:rounded-xl text-neutral/80 whitespace-pre-wrap text-xs xs:text-sm border-l-4 border-secondary">
                    {selectedApp.experience}
                  </div>
                </div>
              )}

              {/* Previous Volunteer Work */}
              {selectedApp.previousVolunteerWork && (
                <div className="mb-4 xs:mb-5 sm:mb-6">
                  <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase block mb-1 xs:mb-2">Previous Volunteer Work</label>
                  <div className="bg-base-200 p-3 xs:p-4 rounded-lg xs:rounded-xl text-neutral/80 whitespace-pre-wrap text-xs xs:text-sm border-l-4 border-success">
                    {selectedApp.previousVolunteerWork}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(selectedApp.linkedinProfile || selectedApp.facebookProfile || selectedApp.twitterProfile || selectedApp.websiteProfile) && (
                <div className="mb-4 xs:mb-5 sm:mb-6">
                  <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase block mb-2 xs:mb-3">Social Media & Links</label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3">
                    {selectedApp.linkedinProfile && (
                      <a
                        href={selectedApp.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-2 xs:py-3 bg-info/10 hover:bg-info/20 rounded-lg xs:rounded-xl border border-info/30 text-info font-medium transition-all text-xs xs:text-sm"
                      >
                        <Link2 className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                        LinkedIn Profile
                      </a>
                    )}
                    {selectedApp.facebookProfile && (
                      <a
                        href={selectedApp.facebookProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-2 xs:py-3 bg-info/10 hover:bg-info/20 rounded-lg xs:rounded-xl border border-info/30 text-info font-medium transition-all text-xs xs:text-sm"
                      >
                        <Link2 className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                        Facebook Profile
                      </a>
                    )}
                    {selectedApp.twitterProfile && (
                      <a
                        href={selectedApp.twitterProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-2 xs:py-3 bg-info/10 hover:bg-info/20 rounded-lg xs:rounded-xl border border-info/30 text-info font-medium transition-all text-xs xs:text-sm"
                      >
                        <Link2 className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                        Twitter Profile
                      </a>
                    )}
                    {selectedApp.websiteProfile && (
                      <a
                        href={selectedApp.websiteProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-2 xs:py-3 bg-info/10 hover:bg-info/20 rounded-lg xs:rounded-xl border border-info/30 text-info font-medium transition-all text-xs xs:text-sm"
                      >
                        <Link2 className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                        Personal Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* NID Document */}
              {selectedApp.nidOrIdDoc && (
                <div className="mb-4 xs:mb-5 sm:mb-6">
                  <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase block mb-1 xs:mb-2">NID & Documents</label>
                  <a href={selectedApp.nidOrIdDoc} title='NID Document' target="_blank" rel="noopener noreferrer" className="block">
                    <Image
                      src={selectedApp.nidOrIdDoc}
                      width={500}
                      height={250}
                      alt="NID Document"
                      className="max-w-full h-auto max-h-64 xs:max-h-80 sm:max-h-96 rounded-lg xs:rounded-xl object-contain border-2 border-accent/20 hover:border-accent/50 transition-colors cursor-pointer"
                    />
                  </a>
                  <p className="text-[10px] xs:text-xs text-neutral/60 mt-1 xs:mt-2">Click to view in full size</p>
                </div>
              )}

              {/* Status */}
              <div className="mb-4 xs:mb-5 sm:mb-6">
                <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase block mb-1 xs:mb-2">Current Status</label>
                <div>{getStatusBadge(selectedApp.status)}</div>
              </div>

              {/* Review Section */}
              {selectedApp.status === 'pending' && (
                <>
                  <div className="bg-linear-to-b from-base-200 to-base-300 rounded-lg xs:rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 border-2 border-dashed border-accent/30 mb-4 xs:mb-5 sm:mb-6">
                    <label className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase block mb-2 xs:mb-3">📝 Review Note (Optional)</label>
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Add any notes about your decision..."
                      className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-100 text-neutral resize-none shadow-sm"
                      rows={4}
                    />
                  </div>

                  <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4">
                    <motion.button
                      onClick={() => handleReview(selectedApp._id, 'approved')}
                      disabled={isReviewing}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-1.5 xs:gap-2 px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-4 bg-linear-to-r from-success to-success/80 text-white rounded-lg xs:rounded-xl hover:shadow-lg disabled:opacity-50 transition-all font-bold text-sm xs:text-base sm:text-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 xs:w-5 xs:h-5" />
                      {isReviewing ? 'Processing...' : 'Approve Application'}
                    </motion.button>
                    <motion.button
                      onClick={() => handleReview(selectedApp._id, 'rejected')}
                      disabled={isReviewing}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-1.5 xs:gap-2 px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-4 bg-linear-to-r from-error to-error/80 text-white rounded-lg xs:rounded-xl hover:shadow-lg disabled:opacity-50 transition-all font-bold text-sm xs:text-base sm:text-lg"
                    >
                      <XCircle className="w-4 h-4 xs:w-5 xs:h-5" />
                      {isReviewing ? 'Processing...' : 'Reject Application'}
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}