'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FullPageLoading } from '@/components/common';
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
  FaGraduationCap,
  FaClock as FaAvailability,
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

  const fetchApplication = useCallback(async () => {
    try {
      const { problemSolverAPI } = await import('@/utils/api');
      const response = await problemSolverAPI.getMyApplication();
      setApplication(response.data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        setNotFound(true);
      } else {
        toast.error('Failed to load application');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuthAndFetch = useCallback(async () => {
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
  }, [router, fetchApplication]);

  useEffect(() => {
    checkAuthAndFetch();
  }, [checkAuthAndFetch]);

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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete application';
      toast.error(errorMessage);
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
      <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-4 xs:py-6 sm:py-8 px-3 xs:px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" />
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl xs:rounded-2xl shadow-xl p-6 xs:p-8 sm:p-10 md:p-12 text-center border-t-4 border-primary"
          >
            <div className="mb-4 xs:mb-5 sm:mb-6">
              <FaClock className="text-amber-500 text-4xl xs:text-5xl sm:text-6xl mx-auto drop-shadow-lg" />
            </div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#002E2E] mb-2 xs:mb-3">
              No Application Found
            </h2>
            <p className="text-[#6B7280] mb-5 xs:mb-6 sm:mb-8 text-sm xs:text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
              You haven&apos;t submitted an application to become a Problem Solver yet. Start your journey today and help your community!
            </p>
            <button
              onClick={() => router.push('/dashboard/user/join-as-a-Problem-Solver')}
              className="bg-linear-to-r from-primary to-[#1e5d22] text-white px-5 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl hover:shadow-lg transition-all font-bold transform hover:scale-105 text-sm xs:text-base"
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
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-4 xs:py-6 sm:py-8 px-3 xs:px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl xs:rounded-2xl shadow-xl overflow-hidden border-t-4 border-primary"
        >
          {/* Status Header with Gradient Background */}
          <div className={`${application.status === 'pending' ? 'bg-linear-to-r from-amber-50 to-yellow-50 border-b-2 border-amber-200' : application.status === 'approved' ? 'bg-linear-to-r from-green-50 to-emerald-50 border-b-2 border-green-200' : 'bg-linear-to-r from-red-50 to-orange-50 border-b-2 border-red-200'} p-4 xs:p-6 sm:p-8 md:p-10 text-center`}>
            <div className="mb-3 xs:mb-4 flex justify-center animate-bounce">
              <div className="text-3xl xs:text-4xl sm:text-5xl">
                {getStatusIcon(application.status)}
              </div>
            </div>
            <h1 className={`text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold ${statusInfo.color} mb-2 xs:mb-3`}>
              {statusInfo.title}
            </h1>
            <p className={`${statusInfo.color} max-w-2xl mx-auto text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed font-medium`}>
              {statusInfo.message}
            </p>
          </div>

          {/* Application Details */}
          <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
            {/* Applied Date */}
            <div className="flex items-center bg-linear-to-r from-blue-50 to-indigo-50 p-3 xs:p-4 rounded-lg border-2 border-blue-200">
              <FaCalendar className="mr-2 xs:mr-3 text-blue-600 text-base xs:text-lg sm:text-xl" />
              <span className="text-[#002E2E] font-semibold text-xs xs:text-sm sm:text-base">
                📅 Applied on {new Date(application.appliedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Personal Information */}
            <div className="border-t-2 border-primary/20 pt-4 xs:pt-5 sm:pt-6 md:pt-8">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E] mb-3 xs:mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm xs:text-base sm:text-lg">👤</div>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                <div className="flex items-center bg-linear-to-r from-blue-50 to-indigo-50 p-3 xs:p-4 rounded-lg border-2 border-blue-100">
                  <FaUser className="mr-2 xs:mr-3 text-blue-600 text-base xs:text-lg shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] xs:text-xs text-gray-600 font-bold uppercase tracking-wide">Full Name</p>
                    <p className="font-bold text-[#002E2E] text-sm xs:text-base truncate">{application.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center bg-linear-to-r from-amber-50 to-orange-50 p-3 xs:p-4 rounded-lg border-2 border-amber-100">
                  <FaEnvelope className="mr-2 xs:mr-3 text-amber-600 text-base xs:text-lg shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] xs:text-xs text-gray-600 font-bold uppercase tracking-wide">Email</p>
                    <p className="font-bold text-[#002E2E] text-sm xs:text-base truncate">{application.email}</p>
                  </div>
                </div>
                <div className="flex items-center bg-linear-to-r from-green-50 to-emerald-50 p-3 xs:p-4 rounded-lg border-2 border-green-100">
                  <FaPhone className="mr-2 xs:mr-3 text-green-600 text-base xs:text-lg shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] xs:text-xs text-gray-600 font-bold uppercase tracking-wide">Phone</p>
                    <p className="font-bold text-[#002E2E] text-sm xs:text-base">{application.phone}</p>
                  </div>
                </div>
                <div className="flex items-center bg-linear-to-r from-purple-50 to-pink-50 p-3 xs:p-4 rounded-lg border-2 border-purple-100">
                  <FaBriefcase className="mr-2 xs:mr-3 text-purple-600 text-base xs:text-lg shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] xs:text-xs text-gray-600 font-bold uppercase tracking-wide">Profession</p>
                    <p className="font-bold text-[#002E2E] text-sm xs:text-base truncate">{application.profession}</p>
                  </div>
                </div>
                <div className="flex items-center bg-linear-to-r from-rose-50 to-red-50 p-3 xs:p-4 rounded-lg border-2 border-rose-100">
                  <FaIdCard className="mr-2 xs:mr-3 text-rose-600 text-base xs:text-lg shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] xs:text-xs text-gray-600 font-bold uppercase tracking-wide">NID Number</p>
                    <p className="font-bold text-[#002E2E] font-mono text-sm xs:text-base">{application.nidNumber}</p>
                  </div>
                </div>
                {application.educationLevel && (
                  <div className="flex items-center bg-linear-to-r from-indigo-50 to-blue-50 p-3 xs:p-4 rounded-lg border-2 border-indigo-100">
                    <FaGraduationCap className="mr-2 xs:mr-3 text-indigo-600 text-base xs:text-lg shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] xs:text-xs text-gray-600 font-bold uppercase tracking-wide">Education Level</p>
                      <p className="font-bold text-[#002E2E] text-sm xs:text-base truncate">{application.educationLevel}</p>
                    </div>
                  </div>
                )}
                {application.availability && (
                  <div className="flex items-center bg-linear-to-r from-cyan-50 to-teal-50 p-3 xs:p-4 rounded-lg border-2 border-cyan-100">
                    <FaAvailability className="mr-2 xs:mr-3 text-cyan-600 text-base xs:text-lg shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] xs:text-xs text-gray-600 font-bold uppercase tracking-wide">Availability</p>
                      <p className="font-bold text-[#002E2E] text-sm xs:text-base truncate">{application.availability}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t-2 border-primary/20 pt-4 xs:pt-5 sm:pt-6 md:pt-8">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E] mb-3 xs:mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-linear-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-sm xs:text-base sm:text-lg">🚨</div>
                Emergency Contact
              </h2>
              <div className="bg-linear-to-r from-red-50 to-orange-50 rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6 space-y-2 xs:space-y-3 sm:space-y-4 border-2 border-red-200">
                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center bg-white p-2 xs:p-3 rounded-lg border border-red-100 gap-1 xs:gap-0">
                  <span className="text-gray-600 font-bold text-xs xs:text-sm">👤 Name:</span>
                  <span className="font-bold text-[#002E2E] text-sm xs:text-base">{application.emergencyContactName}</span>
                </div>
                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center bg-white p-2 xs:p-3 rounded-lg border border-red-100 gap-1 xs:gap-0">
                  <span className="text-gray-600 font-bold text-xs xs:text-sm">📞 Phone:</span>
                  <span className="font-bold text-[#002E2E] text-sm xs:text-base">{application.emergencyContact}</span>
                </div>
                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center bg-white p-2 xs:p-3 rounded-lg border border-red-100 gap-1 xs:gap-0">
                  <span className="text-gray-600 font-bold text-xs xs:text-sm">🔗 Relation:</span>
                  <span className="font-bold text-[#002E2E] text-sm xs:text-base">{application.emergencyContactRelation}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-t-2 border-primary/20 pt-4 xs:pt-5 sm:pt-6 md:pt-8">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E] mb-3 xs:mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-linear-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-sm xs:text-base sm:text-lg">📍</div>
                Location
              </h2>
              <div className="flex items-start bg-linear-to-r from-amber-50 to-orange-50 p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl border-2 border-amber-200">
                <FaMapMarkerAlt className="mr-2 xs:mr-3 sm:mr-4 text-amber-600 text-lg xs:text-xl mt-0.5 xs:mt-1 shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-base xs:text-lg text-[#002E2E] mb-1 xs:mb-2">
                    {application.district}, {application.division}
                  </p>
                  <p className="text-xs xs:text-sm text-gray-700 font-semibold leading-relaxed">{application.address}</p>
                </div>
              </div>
            </div>

            {/* Languages Spoken */}
            {application.languagesSpoken && application.languagesSpoken.length > 0 && (
              <div className="border-t-2 border-primary/20 pt-4 xs:pt-5 sm:pt-6 md:pt-8">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E] mb-3 xs:mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 xs:gap-3">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm xs:text-base sm:text-lg">🗣️</div>
                  Languages Spoken
                </h2>
                <div className="flex flex-wrap gap-2 xs:gap-3">
                  {application.languagesSpoken.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 xs:px-4 py-1.5 xs:py-2 bg-linear-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs xs:text-sm font-bold border-2 border-blue-200 shadow-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="border-t-2 border-primary/20 pt-4 xs:pt-5 sm:pt-6 md:pt-8">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E] mb-3 xs:mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-linear-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm xs:text-base sm:text-lg">⚙️</div>
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2 xs:gap-3">
                {application.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 xs:px-4 py-1.5 xs:py-2 bg-linear-to-r from-primary to-[#1e5d22] text-white rounded-full text-xs xs:text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Motivation */}
            <div className="border-t-2 border-primary/20 pt-4 xs:pt-5 sm:pt-6 md:pt-8">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E] mb-3 xs:mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-linear-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm xs:text-base sm:text-lg">💭</div>
                Motivation
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap bg-linear-to-r from-yellow-50 to-orange-50 p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl border-2 border-yellow-200 leading-relaxed font-medium text-xs xs:text-sm sm:text-base">
                {application.motivation}
              </p>
            </div>

            {/* Previous Volunteer Work */}
            {application.previousVolunteerWork && (
              <div className="border-t-2 border-primary/20 pt-4 xs:pt-5 sm:pt-6 md:pt-8">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E] mb-3 xs:mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 xs:gap-3">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm xs:text-base sm:text-lg">🤝</div>
                  Previous Volunteer Work
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap bg-linear-to-r from-green-50 to-emerald-50 p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl border-2 border-green-200 leading-relaxed font-medium text-xs xs:text-sm sm:text-base">
                  {application.previousVolunteerWork}
                </p>
              </div>
            )}

            {/* Social Media Links */}
            {(application.linkedinProfile || application.facebookProfile ||
              application.twitterProfile || application.websiteProfile) && (
                <div className="border-t-2 border-primary/20 pt-4 xs:pt-5 sm:pt-6 md:pt-8">
                  <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E] mb-3 xs:mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 xs:gap-3">
                    <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-linear-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm xs:text-base sm:text-lg">🔗</div>
                    Social Media & Online Presence
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                    {application.linkedinProfile && (
                      <a
                        href={application.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center p-3 xs:p-4 bg-linear-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg border border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-center w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 bg-[#0077b5] rounded-full mr-3 xs:mr-4 group-hover:scale-110 transition-transform duration-300 shrink-0">
                          <FaLinkedin className="text-white text-base xs:text-lg sm:text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-600 mb-0.5">LinkedIn</p>
                          <p className="text-[#0077b5] font-semibold truncate group-hover:underline text-xs xs:text-sm sm:text-base">
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
                        className="group flex items-center p-3 xs:p-4 bg-linear-to-r from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-lg border border-indigo-200 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-center w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 bg-[#1877f2] rounded-full mr-3 xs:mr-4 group-hover:scale-110 transition-transform duration-300 shrink-0">
                          <FaFacebook className="text-white text-base xs:text-lg sm:text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-600 mb-0.5">Facebook</p>
                          <p className="text-[#1877f2] font-semibold truncate group-hover:underline text-xs xs:text-sm sm:text-base">
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
                        className="group flex items-center p-3 xs:p-4 bg-linear-to-r from-sky-50 to-cyan-100 hover:from-sky-100 hover:to-cyan-200 rounded-lg border border-sky-200 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-center w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 bg-[#1da1f2] rounded-full mr-3 xs:mr-4 group-hover:scale-110 transition-transform duration-300 shrink-0">
                          <FaTwitter className="text-white text-base xs:text-lg sm:text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-600 mb-0.5">Twitter</p>
                          <p className="text-[#1da1f2] font-semibold truncate group-hover:underline text-xs xs:text-sm sm:text-base">
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
                        className="group flex items-center p-3 xs:p-4 bg-linear-to-r from-purple-50 to-pink-100 hover:from-purple-100 hover:to-pink-200 rounded-lg border border-purple-200 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-center w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 bg-linear-to-r from-purple-600 to-pink-600 rounded-full mr-3 xs:mr-4 group-hover:scale-110 transition-transform duration-300 shrink-0">
                          <FaGlobe className="text-white text-base xs:text-lg sm:text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-600 mb-0.5">Website</p>
                          <p className="text-purple-700 font-semibold truncate group-hover:underline text-xs xs:text-sm sm:text-base">
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
              <div className="border-t-2 border-primary/20 pt-4 xs:pt-5 sm:pt-6 md:pt-8">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E] mb-3 xs:mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 xs:gap-3">
                  <FaFileImage className="text-[#2a7d2f] text-base xs:text-lg sm:text-xl" />
                  Submitted Documents
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                  {application.profileImage && (
                    <div>
                      <p className="text-xs xs:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2">
                        Profile Photo
                      </p>
                      <div className="relative w-36 h-36 xs:w-40 xs:h-40 sm:w-48 sm:h-48">
                        <Image
                          src={application.profileImage}
                          alt="Profile"
                          fill
                          className="rounded-lg object-cover border-2 border-[#2a7d2f] shadow-md"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                  {application.nidOrIdDoc && (
                    <div>
                      <p className="text-xs xs:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 flex items-center">
                        <FaIdCard className="mr-1" />
                        NID/ID Document
                      </p>
                      <a
                        href={application.nidOrIdDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        title="View NID/ID Document in full size"
                      >
                        <div className="relative w-full max-w-xs xs:max-w-sm sm:max-w-md h-48 xs:h-56 sm:h-64">
                          <Image
                            src={application.nidOrIdDoc}
                            alt="ID Document"
                            fill
                            className="rounded-lg object-cover border-2 border-[#2a7d2f] hover:opacity-80 transition-opacity cursor-pointer shadow-md"
                            unoptimized
                          />
                        </div>
                      </a>
                      <p className="text-[10px] xs:text-xs text-gray-500 mt-1.5 xs:mt-2 flex items-center">
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
              <div className="border-t-2 border-primary/20 pt-4 xs:pt-5 sm:pt-6 md:pt-8">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E] mb-3 xs:mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 xs:gap-3">
                  <div className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 ${application.status === 'rejected' ? 'bg-linear-to-br from-red-400 to-red-600' : 'bg-linear-to-br from-green-400 to-emerald-600'} rounded-full flex items-center justify-center text-white text-sm xs:text-base sm:text-lg`}>
                    {application.status === 'rejected' ? '📝' : '✅'}
                  </div>
                  Review Feedback
                </h2>
                <div className={`p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl ${statusInfo.bgColor} border-2 ${application.status === 'rejected' ? 'border-red-200' : 'border-green-200'}`}>
                  <p className={`${statusInfo.color} font-semibold leading-relaxed text-xs xs:text-sm sm:text-base`}>{application.reviewNote}</p>
                  {application.reviewedAt && (
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mt-1.5 xs:mt-2">
                      Reviewed on {new Date(application.reviewedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {application.status === 'approved' && (
              <div className="border-t-2 border-primary/20 pt-4 xs:pt-5 sm:pt-6 md:pt-8 text-center">
                <button
                  onClick={() => router.push('/dashboard/problemSolver')}
                  className="bg-linear-to-r from-primary to-[#1e5d22] text-white px-5 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl hover:shadow-lg transition-all font-bold transform hover:scale-105 text-sm xs:text-base w-full xs:w-auto"
                >
                  🚀 Go to Problem Solver Dashboard
                </button>
              </div>
            )}

            {application.status === 'rejected' && (
              <div className="border-t-2 border-primary/20 pt-4 xs:pt-5 sm:pt-6 md:pt-8">
                <div className="bg-linear-to-r from-orange-50 to-red-50 p-4 xs:p-5 sm:p-6 md:p-8 rounded-lg xs:rounded-xl border-2 border-orange-200">
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E] mb-2 xs:mb-3 sm:mb-4 flex items-center gap-2 xs:gap-3">
                    <span className="text-xl xs:text-2xl sm:text-3xl">💡</span>
                    Want to Reapply?
                  </h3>
                  <p className="text-gray-700 mb-4 xs:mb-5 sm:mb-6 leading-relaxed font-medium text-xs xs:text-sm sm:text-base">
                    You can delete this rejected application and submit a new one with updated information.
                    Your previous data will be pre-filled in the form to make it easier.
                  </p>
                  <button
                    onClick={handleDeleteConfirmClick}
                    disabled={deleting}
                    className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-1.5 xs:gap-2 text-sm xs:text-base"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 xs:h-5 xs:w-5 border-b-2 border-white"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="text-sm xs:text-base" />
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
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-3 xs:p-4"
              onClick={handleCancelDelete}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl xs:rounded-2xl shadow-2xl max-w-md w-full p-4 xs:p-6 sm:p-8 border-t-4 border-orange-500"
              >
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-14 w-14 xs:h-16 xs:w-16 sm:h-20 sm:w-20 rounded-full bg-linear-to-br from-orange-100 to-red-100 mb-4 xs:mb-5 sm:mb-6 animate-bounce">
                    <FaPaperPlane className="h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10 text-orange-600" />
                  </div>
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#002E2E] mb-2 xs:mb-3">
                    Delete and Reapply?
                  </h3>
                  <p className="text-gray-600 mb-5 xs:mb-6 sm:mb-8 leading-relaxed font-medium text-xs xs:text-sm sm:text-base">
                    Are you sure you want to delete this application and start a new one? Your previous data will be saved for reference.
                  </p>
                  <div className="flex gap-2 xs:gap-3">
                    <button
                      onClick={handleCancelDelete}
                      className="flex-1 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-bold hover:shadow-md text-sm xs:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="flex-1 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105 text-sm xs:text-base"
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
