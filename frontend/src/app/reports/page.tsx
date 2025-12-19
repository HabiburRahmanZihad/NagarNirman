'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, Button } from '@/components/common';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  FaFilter, FaSearch, FaSync, FaChevronLeft, FaChevronRight,
  FaFire, FaCheckCircle, FaClock, FaMapMarkerAlt, FaThumbsUp, FaCalendar,
  FaArrowUp
} from 'react-icons/fa';
import divisionData from '@/data/divisionsData.json';

interface Report {
  _id: string;
  title: string;
  description: string;
  problemType: string;
  severity: string;
  status: string;
  location: {
    address: string;
    district: string;
    division?: string;
  };
  upvotes: string[];
  createdAt: string;
  images?: string[];
  category?: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalReports: number;
  reportsPerPage: number;
}

export default function AllReportsPage() {
  const { user, isAuthenticated } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 0,
    totalReports: 0,
    reportsPerPage: 12,
  });
  const [allReportsStats, setAllReportsStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [filters, setFilters] = useState({
    district: '',
    status: '',
    severity: '',
    problemType: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Handle search submit (on Enter key)
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      fetchAllReportsStats();
      fetchReports(1);
    }
  };

  // Fetch all reports stats (without pagination)
  const fetchAllReportsStats = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const params = new URLSearchParams({
        page: '1',
        limit: '1000', // Get all reports in one go for stats
        ...(filters.district && { district: filters.district }),
        ...(filters.status && { status: filters.status }),
        ...(filters.severity && { severity: filters.severity }),
        ...(filters.problemType && { problemType: filters.problemType }),
        ...(searchTerm && { search: searchTerm }),
        sortBy: 'createdAt',
        order: 'desc',
      });

      const res = await fetch(`${apiUrl}/api/reports?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!res.ok) throw new Error('Failed to fetch stats');

      const data = await res.json();

      if (data.success && data.data) {
        const allReports = data.data;
        const stats = {
          total: data.pagination?.totalReports || allReports.length,
          pending: allReports.filter((r: Report) => r.status === 'pending').length,
          inProgress: allReports.filter((r: Report) => r.status === 'in-progress').length,
          resolved: allReports.filter((r: Report) => r.status === 'resolved').length,
        };
        // console.log('All reports stats:', stats);
        setAllReportsStats(stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [filters, searchTerm]);

  // Fetch reports with pagination
  const fetchReports = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pagination.reportsPerPage),
        ...(filters.district && { district: filters.district }),
        ...(filters.status && { status: filters.status }),
        ...(filters.severity && { severity: filters.severity }),
        ...(filters.problemType && { problemType: filters.problemType }),
        ...(searchTerm && { search: searchTerm }),
        sortBy: 'createdAt',
        order: 'desc',
      });

      const url = `${apiUrl}/api/reports?${params}`;
      // console.log('📡 Fetching reports from:', url);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      // console.log('✅ Response data:', data);

      if (data.success && data.data) {
        setReports(data.data);
        if (data.pagination) {
          // console.log('✅ Pagination data received:', data.pagination);
          setPagination(data.pagination);
        } else {
          console.warn('⚠️ No pagination in response, using defaults');
          setPagination({
            currentPage: page,
            totalPages: Math.ceil((data.data?.length || 0) / 12),
            totalReports: data.count || data.data?.length || 0,
            reportsPerPage: 12,
          });
        }
      } else {
        console.warn('⚠️ No data in response:', data);
        setReports([]);
        setPagination({
          currentPage: 1,
          totalPages: 0,
          totalReports: 0,
          reportsPerPage: 12,
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load reports. Please check your connection.';
      console.error('❌ Error fetching reports:', error);
      toast.error(errorMessage);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, searchTerm, pagination.reportsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchAllReportsStats();
    fetchReports(1);
  }, [filters, searchTerm, fetchAllReportsStats, fetchReports]);

  useEffect(() => {
    if (currentPage >= 1) {
      fetchReports(currentPage);
    }
  }, [currentPage, fetchReports]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      district: '',
      status: '',
      severity: '',
      problemType: '',
    });
    setCurrentPage(1);
    setTimeout(() => {
      fetchAllReportsStats();
      fetchReports(1);
    }, 0);
  };

  // Get severity color and icon
  const getSeverityStyles = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'urgent':
        return { bg: 'bg-red-500', text: 'text-red-500', lightBg: 'bg-red-50', icon: '🔴' };
      case 'high':
        return { bg: 'bg-orange-500', text: 'text-orange-500', lightBg: 'bg-orange-50', icon: '🟠' };
      case 'medium':
        return { bg: 'bg-yellow-500', text: 'text-yellow-500', lightBg: 'bg-yellow-50', icon: '🟡' };
      case 'low':
        return { bg: 'bg-green-500', text: 'text-green-500', lightBg: 'bg-green-50', icon: '🟢' };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-500', lightBg: 'bg-gray-50', icon: '⚫' };
    }
  };

  // Get status icon and color
  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return { color: 'text-green-600', bg: 'bg-green-100', icon: <FaCheckCircle /> };
      case 'in-progress':
        return { color: 'text-blue-600', bg: 'bg-blue-100', icon: <FaClock /> };
      case 'pending':
        return { color: 'text-orange-600', bg: 'bg-orange-100', icon: <FaClock /> };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: <FaSync /> };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    }
    if (days === 1) return '1d ago';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return date.toLocaleDateString();
  };

  // Get unique districts from data
  const allDistricts = Array.from(
    new Set(divisionData.flatMap((div) => div.districts.map((d) => d.name)))
  ).sort();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg font-semibold text-[#002E2E]">Loading Reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-primary flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-t-8 border-accent px-4 md:px-8 py-5 shadow-lg rounded-xl">
          <div>
            <h1 className="text-5xl font-extrabold text-[#ffffff] mb-2">
              Infrastructure <span className="text-accent">Issues</span>
            </h1>
            <p className="text-[#b3b6bb] text-lg">
              Discover and track community infrastructure problems reported across Bangladesh
            </p>
          </div>
          {isAuthenticated && user?.role === 'user' && (
            <Link href="/reports/new">
              <Button variant="primary" className="gap-2 bg-linear-to-br from-primary to-[#1e5d22]
              text-white px-6 py-3 rounded-lg font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Report New Issue
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchSubmit}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2
                  outline-none focus:ring-primary focus:border-primary transition"
                />
              </div>
              <button
                onClick={() => {
                  setCurrentPage(1);
                  fetchAllReportsStats();
                  fetchReports(1);
                }}
                className="px-6 py-3 bg-linear-to-br from-primary to-[#1e5d22] text-white rounded-lg font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                title="Search"
                aria-label="Search reports"
              >
                <FaSearch className="text-lg" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>

            {/* Filter Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${showFilters
                  ? 'bg-linear-to-br from-primary to-[#1e5d22] text-white shadow-lg'
                  : 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-md'
                  }`}
              >
                <FaFilter className="text-lg" />
                Filters
              </button>
              <button
                onClick={() => fetchReports(currentPage)}
                className="px-6 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-bold transition-all duration-300 hover:shadow-md"
                title="Refresh"
                aria-label="Refresh reports"
              >
                <FaSync className="text-lg" />
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              {/* District Filter */}
              <div>
                <label className="block text-sm font-medium text-[#002E2E] mb-2">
                  District
                </label>
                <select
                  aria-label="Filter reports by district"
                  value={filters.district}
                  onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">All Districts</option>
                  {allDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-[#002E2E] mb-2">
                  Status
                </label>
                <select
                  aria-label="Filter reports by status"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-[#002E2E] mb-2">
                  Severity
                </label>
                <select
                  aria-label="Filter reports by severity"
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">All Severity</option>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="urgent">🔴 Urgent</option>
                </select>
              </div>

              {/* Problem Type Filter */}
              <div>
                <label className="block text-sm font-medium text-[#002E2E] mb-2">
                  Problem Type
                </label>
                <select
                  aria-label="Filter reports by problem type"
                  value={filters.problemType}
                  onChange={(e) => setFilters({ ...filters, problemType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">All Types</option>
                  <option value="road">Road</option>
                  <option value="drainage">Drainage</option>
                  <option value="street light">Street Light</option>
                  <option value="waste management">Waste Management</option>
                  <option value="water supply">Water Supply</option>
                  <option value="electricity">Electricity</option>
                  <option value="public property">Public Property</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Reset Button */}
              <div className="md:col-span-4">
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2 bg-linear-to-br from-primary to-[#1e5d22] text-white rounded-lg font-bold transition-all duration-300 hover:shadow-lg"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Stats - Enhanced */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-linear-to-br from-green-400 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{allReportsStats.total}</div>
                <div className="text-green-100 text-sm mt-2">Total Reports</div>
              </div>
              <FaFire className="text-5xl opacity-20" />
            </div>
          </div>
          <div className="bg-linear-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{allReportsStats.pending}</div>
                <div className="text-blue-100 text-sm mt-2">Pending</div>
              </div>
              <FaClock className="text-5xl opacity-20" />
            </div>
          </div>
          <div className="bg-linear-to-br from-purple-400 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{allReportsStats.inProgress}</div>
                <div className="text-purple-100 text-sm mt-2">In Progress</div>
              </div>
              <FaArrowUp className="text-5xl opacity-20" />
            </div>
          </div>
          <div className="bg-linear-to-br from-emerald-400 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{allReportsStats.resolved}</div>
                <div className="text-emerald-100 text-sm mt-2">Resolved</div>
              </div>
              <FaCheckCircle className="text-5xl opacity-20" />
            </div>
          </div>
        </div>

        {/* Reports Grid - Stunning Cards */}
        {reports.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 opacity-50">📭</div>
            <h3 className="text-3xl font-bold text-[#002E2E] mb-4">No Reports Found</h3>
            <p className="text-[#6B7280] text-lg mb-8">
              {searchTerm || Object.values(filters).some((f) => f)
                ? 'Try adjusting your filters or search term'
                : 'Be the first to report an issue!'}
            </p>
            {isAuthenticated && user?.role === 'user' && (
              <Link href="/reports/new">
                <Button variant="primary" className="inline-flex items-center gap-2 bg-linear-to-br from-primary to-[#1e5d22] text-white px-6 py-3 rounded-lg font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Report New Issue
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-8 pt-4">
              <h2 className="text-3xl font-bold text-[#002E2E] mb-3">
                Reports <span className="text-primary font-extrabold">Listing</span>
              </h2>
              <p className="text-[#6B7280] text-lg">
                Showing <span className="font-bold text-[#002E2E]">{reports.length}</span> of <span className="font-bold text-[#002E2E]">{pagination.totalReports}</span> total reports
              </p>
            </div>

            {/* Cards Grid - 4 per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {reports.map((report: Report) => {
                const severityStyles = getSeverityStyles(report.severity);
                const statusStyles = getStatusStyles(report.status);
                const hasImage = report.images && report.images.length > 0;

                return (
                  <Link key={report._id} href={`/reports/${report._id}`}>
                    <div className="group h-full bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100">
                      {/* Image Section with Overlay */}
                      <div className="relative h-48 bg-linear-to-br from-[#F6FFF9] to-[#E8F5E9] overflow-hidden">
                        {hasImage ? (
                          <img
                            src={report.images![0]}
                            alt={report.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
                            🏗️
                          </div>
                        )}

                        {/* Severity Badge */}
                        <div className={`absolute top-3 right-3 ${severityStyles.lightBg} ${severityStyles.text} px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg`}>
                          {severityStyles.icon}
                          {report.severity?.charAt(0).toUpperCase() + report.severity?.slice(1)}
                        </div>

                        {/* Status Badge */}
                        <div className={`absolute top-3 left-3 ${statusStyles.bg} ${statusStyles.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg`}>
                          {statusStyles.icon}
                          {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
                        </div>

                        {/* Upvotes Badge */}
                        {report.upvotes && report.upvotes.length > 0 && (
                          <div className="absolute bottom-3 right-3 bg-white bg-opacity-90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-primary flex items-center gap-1 shadow-lg">
                            <FaThumbsUp className="text-lg" />
                            {report.upvotes.length}
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-5">
                        {/* Title */}
                        <h3 className="font-bold text-[#002E2E] line-clamp-2 group-hover:text-primary transition mb-2 text-lg">
                          {report.title}
                        </h3>

                        {/* Description */}
                        <p className="text-[#6B7280] text-sm line-clamp-2 mb-4">
                          {report.description}
                        </p>

                        {/* Location */}
                        <div className="flex items-start gap-2 mb-4 text-sm text-[#6B7280]">
                          <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                          <div className="line-clamp-2">
                            <div className="font-semibold text-[#002E2E]">{report.location.district}</div>
                            <div className="text-xs">{report.location.address}</div>
                          </div>
                        </div>

                        {/* Problem Type Badge */}
                        <div className="mb-4">
                          <span className="inline-block bg-primary bg-opacity-10 text-base-100 px-3 py-1 rounded-full text-xs font-semibold">
                            {report.problemType?.charAt(0).toUpperCase() + report.problemType?.slice(1)}
                          </span>
                        </div>

                        {/* Footer with Date */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-[#6B7280]">
                          <div className="flex items-center gap-1">
                            <FaCalendar className="text-primary" />
                            {formatDate(report.createdAt)}
                          </div>
                          <div className="text-primary font-bold group-hover:translate-x-1 transition">→</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3 pb-8">
                {/* Debug Info */}
                <div className="w-full text-center text-xs text-[#6B7280] mb-2 opacity-70">
                  Total: {pagination.totalReports} | Pages: {pagination.totalPages} | Current: {currentPage}
                </div>

                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary bg-white text-primary hover:bg-primary hover:text-white hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary transition-all duration-300 font-semibold"
                  aria-label="Previous page"
                >
                  <FaChevronLeft className="text-lg" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNumber;
                    if (pagination.totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNumber = pagination.totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    return pageNumber;
                  }).map((pageNumber, idx, arr) => {
                    if (arr[idx - 1] && pageNumber - arr[idx - 1] > 1) {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-3 py-2 text-[#6B7280] font-bold">
                          ••
                        </span>
                      );
                    }
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${currentPage === pageNumber
                          ? 'bg-linear-to-br from-primary to-[#1e5d22] text-white shadow-lg scale-110'
                          : 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-md'
                          }`}
                        aria-label={`Page ${pageNumber}`}
                        aria-current={currentPage === pageNumber ? 'page' : undefined}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary bg-white text-primary hover:bg-primary hover:text-white hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary transition-all duration-300 font-semibold"
                  aria-label="Next page"
                >
                  Next
                  <FaChevronRight className="text-lg" />
                </button>

                {/* Page Info */}
                <div className="w-full text-center text-sm text-[#6B7280] mt-6">
                  <span className="inline-block bg-primary bg-opacity-10 text-base-100 px-4 py-2 rounded-full font-bold">
                    Page <span className="text-base-300">{currentPage}</span> of <span className="text-base-100">{pagination.totalPages}</span>
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}