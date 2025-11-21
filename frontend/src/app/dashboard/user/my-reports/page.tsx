'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, Button, Loading, ReportCard } from '@/components/common';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaPlus, FaChartLine, FaFilter } from 'react-icons/fa';

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
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Check authentication
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'user')) {
      toast.error('Please login as a user to view your reports');
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Fetch user's reports
  const fetchMyReports = async () => {
    if (!user) return;

    setIsLoading(true);
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
    return <Loading />;
  }

  if (!isAuthenticated || user?.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#002E2E] mb-2">
              My Reports
            </h1>
            <p className="text-[#6B7280] text-lg">
              Track and manage your submitted infrastructure reports
            </p>
          </div>
          <Link href="/reports/new">
            <Button variant="primary" className="flex items-center gap-2">
              <FaPlus />
              Report New Issue
            </Button>
          </Link>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          <Card className="p-4 bg-linear-to-br from-[#2a7d2f] to-[#1e5d22] text-white">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-90">Total Reports</div>
          </Card>
          <div className="p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white rounded-xl shadow-md" onClick={() => setStatusFilter('pending')}>
            <div className="text-3xl font-bold text-gray-600">{stats.pending}</div>
            <div className="text-sm text-[#6B7280]">Pending</div>
          </div>
          <div className="p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white rounded-xl shadow-md" onClick={() => setStatusFilter('in-progress')}>
            <div className="text-3xl font-bold text-indigo-600">{stats.inProgress}</div>
            <div className="text-sm text-[#6B7280]">In Progress</div>
          </div>
          <div className="p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white rounded-xl shadow-md" onClick={() => setStatusFilter('resolved')}>
            <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-[#6B7280]">Resolved</div>
          </div>
          <Card className="p-4 bg-linear-to-br from-[#f2a921] to-[#e69710] text-white">
            <div className="text-3xl font-bold">{stats.totalUpvotes}</div>
            <div className="text-sm opacity-90">Total Upvotes</div>
          </Card>
        </div>

        {/* Resolution Rate */}
        {stats.total > 0 && (
          <Card className="p-6 mb-6 bg-linear-to-r from-green-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaChartLine className="text-[#2a7d2f] text-xl" />
                  <h3 className="text-lg font-bold text-[#002E2E]">Resolution Rate</h3>
                </div>
                <p className="text-[#6B7280] text-sm">
                  {stats.resolved} out of {stats.total} reports resolved
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-[#2a7d2f]">
                  {Math.round((stats.resolved / stats.total) * 100)}%
                </div>
                <div className="text-sm text-[#6B7280]">Success Rate</div>
              </div>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-[#2a7d2f] to-[#aef452] h-full transition-all duration-500"
                style={{ width: `${(stats.resolved / stats.total) * 100}%` }}
              />
            </div>
          </Card>
        )}

        {/* Filter */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FaFilter className="text-[#6B7280]" />
              <span className="font-medium text-[#002E2E]">Filter by Status:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All', color: 'bg-gray-200 text-gray-800' },
                { value: 'pending', label: 'Pending', color: 'bg-gray-200 text-gray-800' },
                { value: 'approved', label: 'Approved', color: 'bg-blue-200 text-blue-800' },
                { value: 'in-progress', label: 'In Progress', color: 'bg-indigo-200 text-indigo-800' },
                { value: 'resolved', label: 'Resolved', color: 'bg-green-200 text-green-800' },
                { value: 'rejected', label: 'Rejected', color: 'bg-red-200 text-red-800' },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                    statusFilter === status.value
                      ? 'bg-[#2a7d2f] text-white'
                      : `${status.color} hover:opacity-80`
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Reports Grid */}
        {filteredReports.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">
              {reports.length === 0 ? '📝' : '🔍'}
            </div>
            <h3 className="text-2xl font-bold text-[#002E2E] mb-2">
              {reports.length === 0 ? 'No Reports Yet' : 'No Reports Found'}
            </h3>
            <p className="text-[#6B7280] mb-6">
              {reports.length === 0
                ? 'Start making a difference by reporting infrastructure issues in your area'
                : `No reports with status: ${statusFilter}`}
            </p>
            {reports.length === 0 && (
              <Link href="/reports/new">
                <Button variant="primary">Create Your First Report</Button>
              </Link>
            )}
            {reports.length > 0 && (
              <Button variant="outline" onClick={() => setStatusFilter('all')}>
                Show All Reports
              </Button>
            )}
          </Card>
        ) : (
          <>
            <div className="mb-4 text-[#6B7280]">
              Showing {filteredReports.length} of {reports.length} reports
            </div>
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
