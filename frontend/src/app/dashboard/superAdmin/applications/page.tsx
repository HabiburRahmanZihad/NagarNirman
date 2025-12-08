'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Award,
  Link2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { problemSolverAPI } from '@/utils/api';
import Card from '@/components/common/Card';

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
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 bg-base-300 min-h-screen container mx-auto">
      <Toaster position="top-right" />

      {/* Header with Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary text-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-accent flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
            Applications Management 📋
          </h1>
          <p className="text-white/90 text-lg font-semibold">
            Problem solver applications (SuperAdmin)
          </p>
        </div>
        <motion.button
          onClick={() => fetchApplications()}
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all disabled:opacity-50 shrink-0"
          title="Refresh applications"
        >
          <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className={`${stat.bgColor} rounded-2xl p-6 border-2 border-accent/20 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-neutral/70 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-3xl font-extrabold text-info mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} bg-white/50 p-3 rounded-xl`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <Card>
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-neutral/70 uppercase tracking-wide">Filter Status:</label>
          <select
            aria-label="Filter by status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-5 py-2.5 border-2 border-accent/20 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-100 font-medium text-neutral cursor-pointer hover:border-accent/40 transition-all"
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
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {applications.map((app, index) => (
          <motion.div
            key={app._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.3) }}
            className="bg-base-100 rounded-2xl shadow-xl p-6 border-t-4 border-secondary hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {app.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral">{app.fullName}</h3>
                  <p className="text-sm text-neutral/60">{app.profession}</p>
                </div>
              </div>
              {getStatusBadge(app.status)}
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-neutral/70">
                <Mail className="w-4 h-4 text-secondary" />
                {app.email}
              </div>
              <div className="flex items-center gap-2 text-neutral/70">
                <Phone className="w-4 h-4 text-secondary" />
                {app.phone}
              </div>
              <div className="flex items-center gap-2 text-neutral/70">
                <MapPin className="w-4 h-4 text-secondary" />
                {app.district}, {app.division}
              </div>
              <div className="flex items-center gap-2 text-neutral/70">
                <Calendar className="w-4 h-4 text-secondary" />
                {new Date(app.appliedAt).toLocaleDateString()}
              </div>
            </div>

            <motion.button
              onClick={() => openModal(app)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <Eye className="w-4 h-4" />
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
          className="bg-base-100 rounded-3xl shadow-xl border-2 border-dashed border-accent/20 p-16 text-center"
        >
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg font-bold text-neutral mb-2">No applications found</p>
          <p className="text-neutral/60">Try adjusting your filters</p>
        </motion.div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              onClick={() => setPagination({ ...pagination, page })}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${pagination.page === page
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-base-100 rounded-3xl max-w-4xl w-full my-8 shadow-2xl border-t-4 border-secondary overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-primary to-secondary text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Application Details 📝</h2>
              <motion.button
                onClick={closeModal}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white text-2xl transition-colors"
              >
                ×
              </motion.button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral/70 uppercase">Full Name</label>
                    <p className="text-neutral font-semibold mt-1">{selectedApp.fullName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral/70 uppercase">Email</label>
                    <p className="text-neutral mt-1">{selectedApp.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral/70 uppercase">Phone</label>
                    <p className="text-neutral mt-1">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral/70 uppercase">Gender</label>
                    <p className="text-neutral mt-1">{selectedApp.gender}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral/70 uppercase">Date of Birth</label>
                    <p className="text-neutral mt-1">
                      {new Date(selectedApp.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedApp.nidNumber && (
                    <div>
                      <label className="text-xs font-bold text-neutral/70 uppercase">NID Number</label>
                      <p className="text-neutral mt-1">{selectedApp.nidNumber}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral/70 uppercase">Division</label>
                    <p className="text-neutral mt-1">{selectedApp.division}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral/70 uppercase">District</label>
                    <p className="text-neutral mt-1">{selectedApp.district}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral/70 uppercase">Address</label>
                    <p className="text-neutral mt-1">{selectedApp.address}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral/70 uppercase">Profession</label>
                    <p className="text-neutral mt-1">{selectedApp.profession}</p>
                  </div>
                  {selectedApp.organization && (
                    <div>
                      <label className="text-xs font-bold text-neutral/70 uppercase">Organization</label>
                      <p className="text-neutral mt-1">{selectedApp.organization}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              {selectedApp.skills && selectedApp.skills.length > 0 && (
                <div className="mb-6">
                  <label className="text-xs font-bold text-neutral/70 uppercase block mb-3">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium border border-secondary/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages Section */}
              {selectedApp.languagesSpoken && selectedApp.languagesSpoken.length > 0 && (
                <div className="mb-6">
                  <label className="text-xs font-bold text-neutral/70 uppercase block mb-3">Languages Spoken</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.languagesSpoken.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-info/20 text-info rounded-full text-sm font-medium border border-info/30"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivation */}
              <div className="mb-6">
                <label className="text-xs font-bold text-neutral/70 uppercase block mb-2">Motivation</label>
                <div className="bg-base-200 p-4 rounded-xl text-neutral/80 whitespace-pre-wrap text-sm border-l-4 border-secondary">
                  {selectedApp.motivation}
                </div>
              </div>

              {/* Experience */}
              {selectedApp.experience && (
                <div className="mb-6">
                  <label className="text-xs font-bold text-neutral/70 uppercase block mb-2">Experience</label>
                  <div className="bg-base-200 p-4 rounded-xl text-neutral/80 whitespace-pre-wrap text-sm border-l-4 border-secondary">
                    {selectedApp.experience}
                  </div>
                </div>
              )}

              {/* Previous Volunteer Work */}
              {selectedApp.previousVolunteerWork && (
                <div className="mb-6">
                  <label className="text-xs font-bold text-neutral/70 uppercase block mb-2">Previous Volunteer Work</label>
                  <div className="bg-base-200 p-4 rounded-xl text-neutral/80 whitespace-pre-wrap text-sm border-l-4 border-success">
                    {selectedApp.previousVolunteerWork}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(selectedApp.linkedinProfile || selectedApp.facebookProfile || selectedApp.twitterProfile || selectedApp.websiteProfile) && (
                <div className="mb-6">
                  <label className="text-xs font-bold text-neutral/70 uppercase block mb-3">Social Media & Links</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedApp.linkedinProfile && (
                      <a
                        href={selectedApp.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 bg-info/10 hover:bg-info/20 rounded-xl border border-info/30 text-info font-medium transition-all"
                      >
                        <Link2 className="w-4 h-4" />
                        LinkedIn Profile
                      </a>
                    )}
                    {selectedApp.facebookProfile && (
                      <a
                        href={selectedApp.facebookProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 bg-info/10 hover:bg-info/20 rounded-xl border border-info/30 text-info font-medium transition-all"
                      >
                        <Link2 className="w-4 h-4" />
                        Facebook Profile
                      </a>
                    )}
                    {selectedApp.twitterProfile && (
                      <a
                        href={selectedApp.twitterProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 bg-info/10 hover:bg-info/20 rounded-xl border border-info/30 text-info font-medium transition-all"
                      >
                        <Link2 className="w-4 h-4" />
                        Twitter Profile
                      </a>
                    )}
                    {selectedApp.websiteProfile && (
                      <a
                        href={selectedApp.websiteProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 bg-info/10 hover:bg-info/20 rounded-xl border border-info/30 text-info font-medium transition-all"
                      >
                        <Link2 className="w-4 h-4" />
                        Personal Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* NID Document */}
              {selectedApp.nidOrIdDoc && (
                <div className="mb-6">
                  <label className="text-xs font-bold text-neutral/70 uppercase block mb-2">NID & Documents</label>
                  <a href={selectedApp.nidOrIdDoc} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                      src={selectedApp.nidOrIdDoc}
                      alt="NID Document"
                      className="max-w-full h-auto max-h-96 rounded-xl object-contain border-2 border-accent/20 hover:border-accent/50 transition-colors cursor-pointer"
                    />
                  </a>
                  <p className="text-xs text-neutral/60 mt-2">Click to view in full size</p>
                </div>
              )}

              {/* Status */}
              <div className="mb-6">
                <label className="text-xs font-bold text-neutral/70 uppercase block mb-2">Current Status</label>
                <div>{getStatusBadge(selectedApp.status)}</div>
              </div>

              {/* Review Section */}
              {selectedApp.status === 'pending' && (
                <>
                  <div className="bg-linear-to-b from-base-200 to-base-300 rounded-2xl p-6 border-2 border-dashed border-accent/30 mb-6">
                    <label className="text-xs font-bold text-neutral/70 uppercase block mb-3">📝 Review Note (Optional)</label>
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Add any notes about your decision..."
                      className="w-full px-4 py-3 border-2 border-accent/20 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-100 text-neutral resize-none shadow-sm"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      onClick={() => handleReview(selectedApp._id, 'approved')}
                      disabled={isReviewing}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-success to-success/80 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all font-bold text-lg"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      {isReviewing ? 'Processing...' : 'Approve Application'}
                    </motion.button>
                    <motion.button
                      onClick={() => handleReview(selectedApp._id, 'rejected')}
                      disabled={isReviewing}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-error to-error/80 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all font-bold text-lg"
                    >
                      <XCircle className="w-5 h-5" />
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
