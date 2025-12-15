'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button, FullPageLoading, ReportCard, RefreshButton } from '@/components/common';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaPlus, FaChartLine, FaFilter, FaFire, FaCheckCircle, FaClock, FaSync, FaArrowUp } from 'react-icons/fa';

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
      const userId = localStorage.getItem('user_id') || (user as any)._id || (user as any).id;

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
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error(error.message || 'Failed to load your reports. Please check your connection.');
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
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-8 px-8">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="mb-8 border-b pb-4 bg-white rounded-lg shadow-sm px-6 py-4 border-accent/80">
          <div className="flex items-start justify-between ">
            <div>
              <h1 className="text-4xl font-extrabold text-[#002E2E] mb-2 flex items-center gap-3">
                <FaCheckCircle className="text-primary" />
                My Reports
              </h1>
              <p className="text-[#6B7280]">Track and manage your submitted infrastructure reports</p>
            </div>
            <div className="flex gap-3">
              <RefreshButton
                onClick={() => fetchMyReports(true)}
                isRefreshing={isRefreshing}
                variant="outline"
              />
              <Link href="/dashboard/user/reports/new">
                <Button variant="primary" className="px-6 py-3 font-bold ">
                  Report New Issue
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Dashboard - 5 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Reports - Green Gradient */}
          <div className="bg-linear-to-br from-primary to-[#1e5d22] rounded-xl p-6 shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold opacity-90">Total Reports</p>
                <p className="text-4xl font-bold mt-2">{stats.total}</p>
              </div>
              <FaFire className="text-4xl opacity-30" />
            </div>
          </div>

          {/* Pending - Gray */}
          <div
            onClick={() => setStatusFilter('pending')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-gray-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#6B7280]">Pending</p>
                <p className="text-4xl font-bold text-gray-700 mt-2">{stats.pending}</p>
              </div>
              <FaClock className="text-4xl text-gray-300" />
            </div>
          </div>

          {/* In Progress - Indigo */}
          <div
            onClick={() => setStatusFilter('in-progress')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-indigo-200 hover:border-indigo-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-800">In Progress</p>
                <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.inProgress}</p>
              </div>
              <FaSync className="text-4xl text-indigo-200" />
            </div>
          </div>

          {/* Resolved - Green */}
          <div
            onClick={() => setStatusFilter('resolved')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-green-200 hover:border-green-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-800">Resolved</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{stats.resolved}</p>
              </div>
              <FaCheckCircle className="text-4xl text-green-200" />
            </div>
          </div>

          {/* Total Upvotes - Amber Gradient */}
          <div className="bg-linear-to-br from-amber-400 to-orange-500 rounded-xl p-6 shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold opacity-90">Total Upvotes</p>
                <p className="text-4xl font-bold mt-2">{stats.totalUpvotes}</p>
              </div>
              <FaArrowUp className="text-4xl opacity-30" />
            </div>
          </div>
        </div>

        {/* Resolution Rate Card */}
        {stats.total > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8 border-t-4 border-primary">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FaChartLine className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#002E2E]">Resolution Rate</h3>
                    <p className="text-sm text-[#6B7280]">{stats.resolved} of {stats.total} reports resolved</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-5xl font-extrabold text-primary">{Math.round((stats.resolved / stats.total) * 100)}%</p>
                <p className="text-xs text-[#6B7280] font-semibold">Success Rate</p>
              </div>
            </div>
            {/* Progress bar with animation */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-primary to-[#aef452] h-full transition-all duration-700 rounded-full"
                style={{ width: `${Math.round((stats.resolved / stats.total) * 100)}%` }}
              />
            </div>
            {/* Stats breakdown */}
            <div className="mt-4 grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-700">{stats.pending}</p>
                <p className="text-xs text-[#6B7280] font-semibold">Pending</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-indigo-600">{stats.approved}</p>
                <p className="text-xs text-[#6B7280] font-semibold">Approved</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-2xl font-bold text-indigo-600">{stats.inProgress}</p>
                <p className="text-xs text-[#6B7280] font-semibold">In Progress</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                <p className="text-xs text-[#6B7280] font-semibold">Resolved</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaFilter className="text-primary text-lg" />
            </div>
            <h3 className="text-lg font-bold text-[#002E2E]">Filter by Status</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
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
                className={`px-5 py-2 rounded-lg font-bold transition-all duration-300 border-2 transform hover:scale-105 ${statusFilter === status.value
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
          <div className="bg-white rounded-xl p-16 shadow-lg text-center">
            <div className="text-8xl mb-4">
              {reports.length === 0 ? '📝' : '🔍'}
            </div>
            <h3 className="text-3xl font-bold text-[#002E2E] mb-3">
              {reports.length === 0 ? 'No Reports Yet' : 'No Reports Found'}
            </h3>
            <p className="text-[#6B7280] text-lg mb-8 max-w-md mx-auto">
              {reports.length === 0
                ? 'Start making a difference by reporting infrastructure issues in your area'
                : `No reports with status: ${statusFilter}`}
            </p>
            {reports.length === 0 && (
              <Link href="/dashboard/user/reports/new">
                <Button variant="primary" className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold">
                  <FaPlus />
                  Create Your First Report
                </Button>
              </Link>
            )}
            {reports.length > 0 && (
              <Button
                variant="primary"
                onClick={() => setStatusFilter('all')}
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-black"
              >
                Show All Reports
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[#6B7280] font-semibold">
                  Showing <span className="text-primary font-bold">{filteredReports.length}</span> of <span className="text-primary font-bold">{reports.length}</span> reports
                </p>
              </div>
              <div className="text-sm text-[#6B7280] font-medium">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
