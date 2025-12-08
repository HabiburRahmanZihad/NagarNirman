'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FullPageLoading, NotFoundDisplay } from '@/components/common';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendar,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaIdCard,
  FaUserShield,
  FaGraduationCap,
  FaClock as FaAvailability,
  FaLanguage,
  FaHandsHelping,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaGlobe,
  FaFileImage,
  FaPaperPlane,
} from 'react-icons/fa';

interface Application {
  _id: string;
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
  profileImage?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
  appliedAt: string;
}

export default function MyApplicationStatus() {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const userDataStr = localStorage.getItem('nn_user');
    if (!userDataStr) {
      router.push('/auth/login');
      return;
    }

    const userData = JSON.parse(userDataStr);
    if (userData.role !== 'user') {
      toast.error('This page is only for regular users');
      router.push('/dashboard');
      return;
    }

    await fetchApplication();
  };

  const fetchApplication = async () => {
    try {
      const { problemSolverAPI } = await import('@/utils/api');
      const response = await problemSolverAPI.getMyApplication();
      setApplication(response.data);
    } catch (error: any) {
      if (error.message.includes('404') || error.message.includes('not found')) {
        setNotFound(true);
      } else {
        toast.error('Failed to load application');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    setDeleting(true);
    try {
      const { problemSolverAPI } = await import('@/utils/api');

      // Save application data to localStorage for prefilling
      if (application) {
        localStorage.setItem('nn_reapply_data', JSON.stringify({
          fullName: application.fullName,
          email: application.email,
          phone: application.phone,
          dateOfBirth: application.dateOfBirth,
          gender: application.gender,
          division: application.division,
          district: application.district,
          address: application.address,
          profession: application.profession,
          organization: application.organization,
          skills: application.skills,
          motivation: application.motivation,
          experience: application.experience,
          nidNumber: application.nidNumber,
          emergencyContact: application.emergencyContact,
          emergencyContactName: application.emergencyContactName,
          emergencyContactRelation: application.emergencyContactRelation,
          educationLevel: application.educationLevel,
          availability: application.availability,
          languagesSpoken: application.languagesSpoken,
          previousVolunteerWork: application.previousVolunteerWork,
          linkedinProfile: application.linkedinProfile,
          facebookProfile: application.facebookProfile,
          twitterProfile: application.twitterProfile,
          websiteProfile: application.websiteProfile,
          reviewNote: application.reviewNote, // Include feedback
        }));
      }

      await problemSolverAPI.deleteMyApplication();
      toast.success('Application deleted. Redirecting to application form...');

      setTimeout(() => {
        router.push('/dashboard/user/join-as-a-Problem-Solver');
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete application');
      setDeleting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-500 text-5xl" />;
      case 'approved':
        return <FaCheckCircle className="text-green-500 text-5xl" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500 text-5xl" />;
      default:
        return null;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          title: 'Application Under Review',
          message:
            'Your application is currently being reviewed by our authorities. We will notify you once a decision has been made.',
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
        };
      case 'approved':
        return {
          title: 'Application Approved!',
          message:
            'Congratulations! Your application has been approved. You are now a verified Problem Solver and can start helping your community.',
          color: 'text-green-700',
          bgColor: 'bg-green-50',
        };
      case 'rejected':
        return {
          title: 'Application Not Approved',
          message:
            'Unfortunately, your application was not approved at this time. Please review the feedback below and consider reapplying in the future.',
          color: 'text-red-700',
          bgColor: 'bg-red-50',
        };
      default:
        return {
          title: '',
          message: '',
          color: '',
          bgColor: '',
        };
    }
  };

  if (loading) {
    return <FullPageLoading text="Loading Application" subtext="Fetching your application status..." />;
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-8 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" />
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center border-t-4 border-primary"
          >
            <div className="mb-6">
              <FaClock className="text-amber-500 text-6xl mx-auto drop-shadow-lg" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#002E2E] mb-3">
              No Application Found
            </h2>
            <p className="text-[#6B7280] mb-8 text-lg leading-relaxed max-w-lg mx-auto">
              You haven't submitted an application to become a Problem Solver yet. Start your journey today and help your community!
            </p>
            <button
              onClick={() => router.push('/dashboard/user/join-as-a-Problem-Solver')}
              className="bg-linear-to-r from-primary to-[#1e5d22] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-bold transform hover:scale-105"
            >
              🔧 Apply Now to Join
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const statusInfo = getStatusMessage(application.status);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-primary"
        >
          {/* Status Header with Gradient Background */}
          <div className={`${application.status === 'pending' ? 'bg-linear-to-r from-amber-50 to-yellow-50 border-b-2 border-amber-200' : application.status === 'approved' ? 'bg-linear-to-r from-green-50 to-emerald-50 border-b-2 border-green-200' : 'bg-linear-to-r from-red-50 to-orange-50 border-b-2 border-red-200'} p-10 text-center`}>
            <div className="mb-4 flex justify-center animate-bounce">
              {getStatusIcon(application.status)}
            </div>
            <h1 className={`text-4xl font-extrabold ${statusInfo.color} mb-3`}>
              {statusInfo.title}
            </h1>
            <p className={`${statusInfo.color} max-w-2xl mx-auto text-lg leading-relaxed font-medium`}>
              {statusInfo.message}
            </p>
          </div>

          {/* Application Details */}
          <div className="p-10 space-y-8">
            {/* Applied Date */}
            <div className="flex items-center bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
              <FaCalendar className="mr-3 text-blue-600 text-xl" />
              <span className="text-[#002E2E] font-semibold">
                📅 Applied on {new Date(application.appliedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Personal Information */}
            <div className="border-t-2 border-primary/20 pt-8">
              <h2 className="text-2xl font-extrabold text-[#002E2E] mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">👤</div>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-100">
                  <FaUser className="mr-3 text-blue-600 text-lg" />
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">Full Name</p>
                    <p className="font-bold text-[#002E2E]">{application.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center bg-linear-to-r from-amber-50 to-orange-50 p-4 rounded-lg border-2 border-amber-100">
                  <FaEnvelope className="mr-3 text-amber-600 text-lg" />
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">Email</p>
                    <p className="font-bold text-[#002E2E] truncate">{application.email}</p>
                  </div>
                </div>
                <div className="flex items-center bg-linear-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-100">
                  <FaPhone className="mr-3 text-green-600 text-lg" />
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">Phone</p>
                    <p className="font-bold text-[#002E2E]">{application.phone}</p>
                  </div>
                </div>
                <div className="flex items-center bg-linear-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-100">
                  <FaBriefcase className="mr-3 text-purple-600 text-lg" />
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">Profession</p>
                    <p className="font-bold text-[#002E2E]">{application.profession}</p>
                  </div>
                </div>
                <div className="flex items-center bg-linear-to-r from-rose-50 to-red-50 p-4 rounded-lg border-2 border-rose-100">
                  <FaIdCard className="mr-3 text-rose-600 text-lg" />
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">NID Number</p>
                    <p className="font-bold text-[#002E2E] font-mono">{application.nidNumber}</p>
                  </div>
                </div>
                {application.educationLevel && (
                  <div className="flex items-center bg-linear-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border-2 border-indigo-100">
                    <FaGraduationCap className="mr-3 text-indigo-600 text-lg" />
                    <div>
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">Education Level</p>
                      <p className="font-bold text-[#002E2E]">{application.educationLevel}</p>
                    </div>
                  </div>
                )}
                {application.availability && (
                  <div className="flex items-center bg-linear-to-r from-cyan-50 to-teal-50 p-4 rounded-lg border-2 border-cyan-100">
                    <FaAvailability className="mr-3 text-cyan-600 text-lg" />
                    <div>
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">Availability</p>
                      <p className="font-bold text-[#002E2E]">{application.availability}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t-2 border-primary/20 pt-8">
              <h2 className="text-2xl font-extrabold text-[#002E2E] mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white">🚨</div>
                Emergency Contact
              </h2>
              <div className="bg-linear-to-r from-red-50 to-orange-50 rounded-xl p-6 space-y-4 border-2 border-red-200">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-red-100">
                  <span className="text-gray-600 font-bold">👤 Name:</span>
                  <span className="font-bold text-[#002E2E]">{application.emergencyContactName}</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-red-100">
                  <span className="text-gray-600 font-bold">📞 Phone:</span>
                  <span className="font-bold text-[#002E2E]">{application.emergencyContact}</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-red-100">
                  <span className="text-gray-600 font-bold">🔗 Relation:</span>
                  <span className="font-bold text-[#002E2E]">{application.emergencyContactRelation}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-t-2 border-primary/20 pt-8">
              <h2 className="text-2xl font-extrabold text-[#002E2E] mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white">📍</div>
                Location
              </h2>
              <div className="flex items-start bg-linear-to-r from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-amber-200">
                <FaMapMarkerAlt className="mr-4 text-amber-600 text-xl mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-lg text-[#002E2E] mb-2">
                    {application.district}, {application.division}
                  </p>
                  <p className="text-sm text-gray-700 font-semibold leading-relaxed">{application.address}</p>
                </div>
              </div>
            </div>

            {/* Languages Spoken */}
            {application.languagesSpoken && application.languagesSpoken.length > 0 && (
              <div className="border-t-2 border-primary/20 pt-8">
                <h2 className="text-2xl font-extrabold text-[#002E2E] mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">🗣️</div>
                  Languages Spoken
                </h2>
                <div className="flex flex-wrap gap-3">
                  {application.languagesSpoken.map((language, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-linear-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-bold border-2 border-blue-200 shadow-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="border-t-2 border-primary/20 pt-8">
              <h2 className="text-2xl font-extrabold text-[#002E2E] mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white">⚙️</div>
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-3">
                {application.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-linear-to-r from-primary to-[#1e5d22] text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Motivation */}
            <div className="border-t-2 border-primary/20 pt-8">
              <h2 className="text-2xl font-extrabold text-[#002E2E] mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center text-white">💭</div>
                Motivation
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap bg-linear-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200 leading-relaxed font-medium">
                {application.motivation}
              </p>
            </div>

            {/* Previous Volunteer Work */}
            {application.previousVolunteerWork && (
              <div className="border-t-2 border-primary/20 pt-8">
                <h2 className="text-2xl font-extrabold text-[#002E2E] mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white">🤝</div>
                  Previous Volunteer Work
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap bg-linear-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200 leading-relaxed font-medium">
                  {application.previousVolunteerWork}
                </p>
              </div>
            )}

            {/* Social Media Links */}
            {(application.linkedinProfile || application.facebookProfile ||
              application.twitterProfile || application.websiteProfile) && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Social Media & Online Presence
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {application.linkedinProfile && (
                      <a
                        href={application.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center p-4 bg-linear-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg border border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-center w-12 h-12 bg-[#0077b5] rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                          <FaLinkedin className="text-white text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-600 mb-0.5">LinkedIn</p>
                          <p className="text-[#0077b5] font-semibold truncate group-hover:underline">
                            LinkedIn Profile
                          </p>
                        </div>
                      </a>
                    )}
                    {application.facebookProfile && (
                      <a
                        href={application.facebookProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center p-4 bg-linear-to-r from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-lg border border-indigo-200 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-center w-12 h-12 bg-[#1877f2] rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                          <FaFacebook className="text-white text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-600 mb-0.5">Facebook</p>
                          <p className="text-[#1877f2] font-semibold truncate group-hover:underline">
                            Facebook Profile
                          </p>
                        </div>
                      </a>
                    )}
                    {application.twitterProfile && (
                      <a
                        href={application.twitterProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center p-4 bg-linear-to-r from-sky-50 to-cyan-100 hover:from-sky-100 hover:to-cyan-200 rounded-lg border border-sky-200 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-center w-12 h-12 bg-[#1da1f2] rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                          <FaTwitter className="text-white text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-600 mb-0.5">Twitter</p>
                          <p className="text-[#1da1f2] font-semibold truncate group-hover:underline">
                            Twitter Profile
                          </p>
                        </div>
                      </a>
                    )}
                    {application.websiteProfile && (
                      <a
                        href={application.websiteProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center p-4 bg-linear-to-r from-purple-50 to-pink-100 hover:from-purple-100 hover:to-pink-200 rounded-lg border border-purple-200 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-purple-600 to-pink-600 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                          <FaGlobe className="text-white text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-600 mb-0.5">Website</p>
                          <p className="text-purple-700 font-semibold truncate group-hover:underline">
                            Personal Website
                          </p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}

            {/* Documents & Images */}
            {(application.profileImage || application.nidOrIdDoc) && (
              <div className="border-t border-primary/80 pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaFileImage className="mr-2 text-[#2a7d2f]" />
                  Submitted Documents
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {application.profileImage && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Profile Photo
                      </p>
                      <img
                        src={application.profileImage}
                        alt="Profile"
                        className="w-48 h-48 rounded-lg object-cover border-2 border-[#2a7d2f] shadow-md"
                      />
                    </div>
                  )}
                  {application.nidOrIdDoc && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FaIdCard className="mr-1" />
                        NID/ID Document
                      </p>
                      <a
                        href={application.nidOrIdDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={application.nidOrIdDoc}
                          alt="ID Document"
                          className="w-full max-w-md rounded-lg object-cover border-2 border-[#2a7d2f] hover:opacity-80 transition-opacity cursor-pointer shadow-md"
                        />
                      </a>
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <span className="mr-1">🔍</span>
                        Click to view full size
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Review Note (if rejected or approved with note) */}
            {application.reviewNote && (
              <div className="border-t-2 border-primary/20 pt-8">
                <h2 className="text-2xl font-extrabold text-[#002E2E] mb-6 flex items-center gap-3">
                  <div className={`w-10 h-10 ${application.status === 'rejected' ? 'bg-linear-to-br from-red-400 to-red-600' : 'bg-linear-to-br from-green-400 to-emerald-600'} rounded-full flex items-center justify-center text-white`}>
                    {application.status === 'rejected' ? '📝' : '✅'}
                  </div>
                  Review Feedback
                </h2>
                <div className={`p-6 rounded-xl ${statusInfo.bgColor} border-2 ${application.status === 'rejected' ? 'border-red-200' : 'border-green-200'}`}>
                  <p className={`${statusInfo.color} font-semibold leading-relaxed`}>{application.reviewNote}</p>
                  {application.reviewedAt && (
                    <p className="text-sm text-gray-500 mt-2">
                      Reviewed on {new Date(application.reviewedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {application.status === 'approved' && (
              <div className="border-t-2 border-primary/20 pt-8 text-center">
                <button
                  onClick={() => router.push('/dashboard/problemSolver')}
                  className="bg-linear-to-r from-primary to-[#1e5d22] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-bold transform hover:scale-105"
                >
                  🚀 Go to Problem Solver Dashboard
                </button>
              </div>
            )}

            {application.status === 'rejected' && (
              <div className="border-t-2 border-primary/20 pt-8">
                <div className="bg-linear-to-r from-orange-50 to-red-50 p-8 rounded-xl border-2 border-orange-200">
                  <h3 className="text-2xl font-extrabold text-[#002E2E] mb-4 flex items-center gap-3">
                    <span className="text-3xl">💡</span>
                    Want to Reapply?
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                    You can delete this rejected application and submit a new one with updated information.
                    Your previous data will be pre-filled in the form to make it easier.
                  </p>
                  <button
                    onClick={handleDeleteConfirmClick}
                    disabled={deleting}
                    className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Delete & Start New Application
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Delete Confirmation Toast/Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={handleCancelDelete}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border-t-4 border-orange-500"
              >
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-linear-to-br from-orange-100 to-red-100 mb-6 animate-bounce">
                    <FaPaperPlane className="h-10 w-10 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#002E2E] mb-3">
                    Delete and Reapply?
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                    Are you sure you want to delete this application and start a new one? Your previous data will be saved for reference.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelDelete}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-bold hover:shadow-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="flex-1 px-4 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
