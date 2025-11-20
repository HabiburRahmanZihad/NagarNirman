'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a7d2f]"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" />
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="mb-6">
              <FaClock className="text-gray-400 text-6xl mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Application Found
            </h2>
            <p className="text-gray-600 mb-8">
              You haven't submitted an application to become a Problem Solver yet.
            </p>
            <button
              onClick={() => router.push('/join-as-a-Problem-Solver')}
              className="bg-[#2a7d2f] text-white px-8 py-3 rounded-lg hover:bg-[#236b27] transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const statusInfo = getStatusMessage(application.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Status Header */}
          <div className={`${statusInfo.bgColor} p-8 text-center border-b`}>
            <div className="mb-4 flex justify-center">
              {getStatusIcon(application.status)}
            </div>
            <h1 className={`text-3xl font-bold ${statusInfo.color} mb-2`}>
              {statusInfo.title}
            </h1>
            <p className={`${statusInfo.color} max-w-2xl mx-auto`}>
              {statusInfo.message}
            </p>
          </div>

          {/* Application Details */}
          <div className="p-8 space-y-6">
            {/* Applied Date */}
            <div className="flex items-center text-gray-600">
              <FaCalendar className="mr-3 text-[#2a7d2f]" />
              <span>
                Applied on {new Date(application.appliedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Personal Information */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-700">
                  <FaUser className="mr-3 text-[#2a7d2f]" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{application.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaEnvelope className="mr-3 text-[#2a7d2f]" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{application.email}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaPhone className="mr-3 text-[#2a7d2f]" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{application.phone}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaBriefcase className="mr-3 text-[#2a7d2f]" />
                  <div>
                    <p className="text-sm text-gray-500">Profession</p>
                    <p className="font-medium">{application.profession}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <div className="flex items-start text-gray-700">
                <FaMapMarkerAlt className="mr-3 text-[#2a7d2f] mt-1" />
                <div>
                  <p className="font-medium">
                    {application.district}, {application.division}
                  </p>
                  <p className="text-sm text-gray-600">{application.address}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {application.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#2a7d2f] text-white rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Motivation */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Motivation</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {application.motivation}
              </p>
            </div>

            {/* Documents & Images */}
            {(application.profileImage || application.nidOrIdDoc) && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
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
                        className="w-40 h-40 rounded-lg object-cover border-2 border-[#2a7d2f]"
                      />
                    </div>
                  )}
                  {application.nidOrIdDoc && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        ID Document
                      </p>
                      <a
                        href={application.nidOrIdDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={application.nidOrIdDoc}
                          alt="ID Document"
                          className="w-40 h-40 rounded-lg object-cover border-2 border-[#2a7d2f] hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      </a>
                      <p className="text-xs text-gray-500 mt-1">
                        Click to view full size
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Review Note (if rejected or approved with note) */}
            {application.reviewNote && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Review Feedback
                </h2>
                <div className={`p-4 rounded-lg ${statusInfo.bgColor}`}>
                  <p className={`${statusInfo.color}`}>{application.reviewNote}</p>
                  {application.reviewedAt && (
                    <p className="text-sm text-gray-500 mt-2">
                      Reviewed on {new Date(application.reviewedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            {application.status === 'approved' && (
              <div className="border-t pt-6 text-center">
                <button
                  onClick={() => router.push('/dashboard/problemSolver')}
                  className="bg-[#2a7d2f] text-white px-8 py-3 rounded-lg hover:bg-[#236b27] transition-colors"
                >
                  Go to Problem Solver Dashboard
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
