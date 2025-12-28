'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button, FullPageLoading, ReportCard, RefreshButton } from '@/components/common';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaChartLine, FaFilter, FaFire, FaCheckCircle, FaClock, FaSync, FaArrowUp } from 'react-icons/fa';

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
  };
  upvotes: string[];
  createdAt: string;
  images?: string[];
}

export default function MyReportsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch user's reports
  const fetchMyReports = async (showToast = false) => {
    if (!user) return;

    if (showToast) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('nn_auth_token');
      const storedUserId = localStorage.getItem('user_id');
      const userId: string = storedUserId ?? user._id ?? (user as unknown as { id?: string }).id ?? '';

      const res = await fetch(`${apiUrl}/api/reports/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success && data.data) {
        setReports(data.data);
        setFilteredReports(data.data);
      } else {
        toast.error('No reports found');
        setReports([]);
        setFilteredReports([]);
      }
    } catch (error: unknown) {
      console.error('Error fetching reports:', error);
      const message = error instanceof Error ? error.message : String(error ?? '');
      toast.error(message || 'Failed to load your reports. Please check your connection.');
      setReports([]);
      setFilteredReports([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      if (showToast) {
        toast.success('Reports refreshed!');
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyReports();
    }
  }, [user]);

  // Apply status filter
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter((report) => report.status === statusFilter));
    }
  }, [statusFilter, reports]);

  // Calculate stats
  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    approved: reports.filter((r) => r.status === 'approved').length,
    inProgress: reports.filter((r) => r.status === 'in-progress').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    rejected: reports.filter((r) => r.status === 'rejected').length,
    totalUpvotes: reports.reduce((sum, r) => sum + (r.upvotes?.length || 0), 0),
  };

  if (authLoading || (isLoading && !reports.length)) {
    return <FullPageLoading text="Loading Your Reports" />;
  }

  if (!isAuthenticated || user?.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-4 xs:py-6 sm:py-8 px-3 xs:px-4 sm:px-6 md:px-8">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="mb-4 xs:mb-6 sm:mb-8 border-b pb-3 xs:pb-4 bg-white rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-3 xs:py-4 border-accent/80">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 xs:gap-4">
            <div>
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002E2E] mb-1 xs:mb-2 flex items-center gap-2 xs:gap-3">
                <FaCheckCircle className="text-primary text-lg xs:text-xl sm:text-2xl md:text-3xl" />
                My Reports
              </h1>
              <p className="text-[#6B7280] text-xs xs:text-sm sm:text-base">Track and manage your submitted infrastructure reports</p>
            </div>
            <div className="flex gap-2 xs:gap-3 w-full sm:w-auto">
              <RefreshButton
                onClick={() => fetchMyReports(true)}
                isRefreshing={isRefreshing}
                variant="outline"
              />
              <Link href="/dashboard/user/reports/new" className="flex-1 sm:flex-none">
                <Button variant="primary" className="px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 font-bold text-xs xs:text-sm sm:text-base w-full">
                  Report New Issue
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Dashboard - 5 Column Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-6 sm:mb-8">

          {/* Total Reports - Green Gradient */}
          <div className="col-span-2 md:col-span-1  bg-linear-to-br from-primary to-[#1e5d22] rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold opacity-90">Total Reports</p>
                <p className="text-2xl xs:text-3xl sm:text-4xl font-bold mt-1 xs:mt-2">{stats.total}</p>
              </div>
              <FaFire className="text-2xl xs:text-3xl sm:text-4xl opacity-30" />
            </div>
          </div>

          {/* Pending - Gray */}
          <div
            onClick={() => setStatusFilter('pending')}
            className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-gray-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[#6B7280]">Pending</p>
                <p className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-700 mt-1 xs:mt-2">{stats.pending}</p>
              </div>
              <FaClock className="text-2xl xs:text-3xl sm:text-4xl text-gray-300" />
            </div>
          </div>

          {/* In Progress - Indigo */}
          <div
            onClick={() => setStatusFilter('in-progress')}
            className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-indigo-200 hover:border-indigo-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-indigo-800">In Progress</p>
                <p className="text-2xl xs:text-3xl sm:text-4xl font-bold text-indigo-600 mt-1 xs:mt-2">{stats.inProgress}</p>
              </div>
              <FaSync className="text-2xl xs:text-3xl sm:text-4xl text-indigo-200" />
            </div>
          </div>

          {/* Resolved - Green */}
          <div
            onClick={() => setStatusFilter('resolved')}
            className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-green-200 hover:border-green-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-green-800">Resolved</p>
                <p className="text-2xl xs:text-3xl sm:text-4xl font-bold text-green-600 mt-1 xs:mt-2">{stats.resolved}</p>
              </div>
              <FaCheckCircle className="text-2xl xs:text-3xl sm:text-4xl text-green-200" />
            </div>
          </div>

          {/* Total Upvotes - Amber Gradient */}
          <div className="col-span-1 bg-linear-to-br from-amber-400 to-orange-500 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold opacity-90">Total Upvotes</p>
                <p className="text-2xl xs:text-3xl sm:text-4xl font-bold mt-1 xs:mt-2">{stats.totalUpvotes}</p>
              </div>
              <FaArrowUp className="text-2xl xs:text-3xl sm:text-4xl opacity-30" />
            </div>
          </div>

        </div>

        {/* Resolution Rate Card */}
        {stats.total > 0 && (
          <div className="bg-white rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6 shadow-lg mb-4 xs:mb-6 sm:mb-8 border-t-4 border-primary">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-3 xs:mb-4 gap-3 xs:gap-4">
              <div>
                <div className="flex items-center gap-2 xs:gap-3 mb-1 xs:mb-2">
                  <div className="p-2 xs:p-3 bg-green-100 rounded-lg">
                    <FaChartLine className="text-primary text-base xs:text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-base xs:text-lg sm:text-xl font-bold text-[#002E2E]">Resolution Rate</h3>
                    <p className="text-xs xs:text-sm text-[#6B7280]">{stats.resolved} of {stats.total} reports resolved</p>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-primary">{Math.round((stats.resolved / stats.total) * 100)}%</p>
                <p className="text-[10px] xs:text-xs text-[#6B7280] font-semibold">Success Rate</p>
              </div>
            </div>
            {/* Progress bar with animation */}
            <div className="w-full bg-gray-200 rounded-full h-2 xs:h-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-primary to-[#aef452] h-full transition-all duration-700 rounded-full"
                style={{ width: `${Math.round((stats.resolved / stats.total) * 100)}%` }}
              />
            </div>
            {/* Stats breakdown */}
            <div className="mt-3 xs:mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3 text-center">
              <div className="p-2 xs:p-3 bg-gray-50 rounded-lg">
                <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-700">{stats.pending}</p>
                <p className="text-[10px] xs:text-xs text-[#6B7280] font-semibold">Pending</p>
              </div>
              <div className="p-2 xs:p-3 bg-blue-50 rounded-lg">
                <p className="text-lg xs:text-xl sm:text-2xl font-bold text-indigo-600">{stats.approved}</p>
                <p className="text-[10px] xs:text-xs text-[#6B7280] font-semibold">Approved</p>
              </div>
              <div className="p-2 xs:p-3 bg-indigo-50 rounded-lg">
                <p className="text-lg xs:text-xl sm:text-2xl font-bold text-indigo-600">{stats.inProgress}</p>
                <p className="text-[10px] xs:text-xs text-[#6B7280] font-semibold">In Progress</p>
              </div>
              <div className="p-2 xs:p-3 bg-green-50 rounded-lg">
                <p className="text-lg xs:text-xl sm:text-2xl font-bold text-green-600">{stats.resolved}</p>
                <p className="text-[10px] xs:text-xs text-[#6B7280] font-semibold">Resolved</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-md mb-4 xs:mb-6 sm:mb-8">
          <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
            <div className="p-1.5 xs:p-2 bg-green-100 rounded-lg">
              <FaFilter className="text-primary text-sm xs:text-base sm:text-lg" />
            </div>
            <h3 className="text-sm xs:text-base sm:text-lg font-bold text-[#002E2E]">Filter by Status</h3>
          </div>
          <div className="flex gap-1.5 xs:gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All Reports', color: 'text-gray-700 border-gray-300' },
              { value: 'pending', label: 'Pending', color: 'text-gray-700 border-gray-300' },
              { value: 'approved', label: 'Approved', color: 'text-blue-700 border-blue-300' },
              { value: 'in-progress', label: 'In Progress', color: 'text-indigo-700 border-indigo-300' },
              { value: 'resolved', label: 'Resolved', color: 'text-green-700 border-green-300' },
              { value: 'rejected', label: 'Rejected', color: 'text-red-700 border-red-300' },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-2.5 xs:px-3 sm:px-4 md:px-5 py-1.5 xs:py-2 rounded-lg font-bold transition-all duration-300 border-2 transform hover:scale-105 text-[10px] xs:text-xs sm:text-sm ${statusFilter === status.value
                  ? 'bg-linear-to-r from-primary to-[#1e5d22] text-white border-primary shadow-lg'
                  : `bg-white border-${status.color.split(' ')[1]} ${status.color} hover:shadow-md`
                  }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid or Empty State */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-lg xs:rounded-xl p-8 xs:p-10 sm:p-12 md:p-16 shadow-lg text-center">
            <div className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl mb-3 xs:mb-4">
              {reports.length === 0 ? '📝' : '🔍'}
            </div>
            <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#002E2E] mb-2 xs:mb-3">
              {reports.length === 0 ? 'No Reports Yet' : 'No Reports Found'}
            </h3>
            <p className="text-[#6B7280] text-sm xs:text-base sm:text-lg mb-4 xs:mb-6 sm:mb-8 max-w-md mx-auto">
              {reports.length === 0
                ? 'Start making a difference by reporting infrastructure issues in your area'
                : `No reports with status: ${statusFilter}`}
            </p>
            {reports.length === 0 && (
              <Link href="/dashboard/user/reports/new">
                <Button variant="primary" className="inline-flex items-center gap-1.5 xs:gap-2 px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-bold">
                  Create Your First Report
                </Button>
              </Link>
            )}
            {reports.length > 0 && (
              <Button
                variant="primary"
                onClick={() => setStatusFilter('all')}
                className="inline-flex items-center gap-1.5 xs:gap-2 px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-bold text-black"
              >
                Show All Reports
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-4 xs:mb-5 sm:mb-6 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-0">
              <div>
                <p className="text-[#6B7280] font-semibold text-xs xs:text-sm">
                  Showing <span className="text-primary font-bold">{filteredReports.length}</span> of <span className="text-primary font-bold">{reports.length}</span> reports
                </p>
              </div>
              <div className="text-xs xs:text-sm text-[#6B7280] font-medium">
                {statusFilter !== 'all' && (
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="text-primary hover:underline font-bold"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
              {filteredReports.map((report) => (
                <ReportCard key={report._id} report={report} />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
