import React from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaClock, FaThumbsUp, FaEye, FaExclamationCircle } from 'react-icons/fa';

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

  return (
    <Link href={`/reports/${report._id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#2a7d2f] cursor-pointer group">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#002E2E] group-hover:text-[#2a7d2f] transition-colors line-clamp-2 mb-2">
                {report.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(report.severity)}`}>
                  {report.severity.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                  {report.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  {report.problemType.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#6B7280] text-sm mb-4 line-clamp-2">
            {report.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-4">
            <FaMapMarkerAlt className="text-[#f2a921] flex-shrink-0" />
            <span className="line-clamp-1">{report.location.address}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
              <div className="flex items-center gap-1">
                <FaClock className="text-gray-400" />
                <span>{formatDate(report.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaThumbsUp className="text-gray-400" />
                <span>{report.upvotes?.length || 0}</span>
              </div>
            </div>
            <button className="text-[#2a7d2f] hover:text-[#1e5d22] font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              <FaEye />
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ReportCard;
