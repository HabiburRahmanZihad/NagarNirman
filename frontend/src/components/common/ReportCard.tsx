'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt, FaClock, FaThumbsUp, FaEye, FaExclamationCircle, FaImages } from 'react-icons/fa';
import Button from '@/components/common/Button';

interface ReportCardProps {
  report: {
    _id: string;
    title: string;
    description: string;
    problemType: string;
    severity: string;
    status: string;
    location: {
      address: string;
      district: string;
    };
    upvotes: string[];
    createdAt: string;
    images?: string[];
  };
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      urgent: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      approved: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-indigo-100 text-indigo-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const primaryImage = report.images?.[0] || null;
  const imageCount = report.images?.length || 0;

  return (
    <Link href={`/dashboard/user/reports/${report._id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#2a7d2f] cursor-pointer group h-full flex flex-col">
        {/* Image Section */}
        {primaryImage ? (
          <div className="relative w-full h-48 bg-gray-100 overflow-hidden group">
            <Image
              src={primaryImage}
              alt={report.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {/* Image Count Badge */}
            {imageCount > 1 && (
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                <FaImages className="text-xs" />
                {imageCount}
              </div>
            )}
            {/* Status Badge - Top Left */}
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(report.status)}`}>
                {report.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            {/* Severity Badge - Top Right */}
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(report.severity)}`}>
                {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
              </span>
            </div>
            {/* Upvotes Badge - Bottom Left */}
            <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 text-[#2a7d2f] px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
              <FaThumbsUp />
              {report.upvotes?.length || 0}
            </div>
          </div>
        ) : (
          <div className="relative w-full h-48 bg-linear-to-br from-[#F6FFF9] to-[#E8F5E9] flex items-center justify-center">
            <div className="text-center">
              <FaImages className="text-4xl text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-[#6B7280] font-semibold">No Image Available</p>
            </div>
            {/* Status Badge - Top Left */}
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(report.status)}`}>
                {report.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            {/* Severity Badge - Top Right */}
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(report.severity)}`}>
                {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
              </span>
            </div>
            {/* Upvotes Badge - Bottom Left */}
            <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 text-[#2a7d2f] px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
              <FaThumbsUp />
              {report.upvotes?.length || 0}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-lg font-bold text-[#002E2E] group-hover:text-[#2a7d2f] transition-colors line-clamp-2 mb-2">
            {report.title}
          </h3>

          {/* Problem Type Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
              {report.problemType.toUpperCase()}
            </span>
          </div>

          {/* Description */}
          <p className="text-[#6B7280] text-sm mb-3 line-clamp-2 flex-1">
            {report.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-4">
            <FaMapMarkerAlt className="text-[#f2a921] shrink-0" />
            <span className="line-clamp-1">{report.location.address}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-[#6B7280]">
              <div className="flex items-center gap-1">
                <FaClock className="text-gray-400" />
                <span>{formatDate(report.createdAt)}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:text-[#1e5d22] font-bold">
              View →
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ReportCard;
