'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, Button, Loading, ReportCard } from '@/components/common';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaFilter, FaSearch, FaSync, FaPlus } from 'react-icons/fa';
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
  };
  upvotes: string[];
  createdAt: string;
  images?: string[];
}

export default function AllReportsPage() {
  const { user, isAuthenticated } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    district: '',
    status: '',
    severity: '',
    problemType: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all reports
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports?limit=100`);
      const data = await res.json();

      if (data.success) {
        setReports(data.data);
        setFilteredReports(data.data);
      } else {
        toast.error('Failed to load reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // District filter
    if (filters.district) {
      filtered = filtered.filter((report) => report.location.district === filters.district);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((report) => report.status === filters.status);
    }

    // Severity filter
    if (filters.severity) {
      filtered = filtered.filter((report) => report.severity === filters.severity);
    }

    // Problem type filter
    if (filters.problemType) {
      filtered = filtered.filter((report) => report.problemType === filters.problemType);
    }

    setFilteredReports(filtered);
  }, [searchTerm, filters, reports]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      district: '',
      status: '',
      severity: '',
      problemType: '',
    });
    setFilteredReports(reports);
  };

  // Get unique districts from data
  const allDistricts = Array.from(
    new Set(divisionData.flatMap((div) => div.districts.map((d) => d.name)))
  ).sort();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6FFF9] to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#002E2E] mb-2">
              All Reports
            </h1>
            <p className="text-[#6B7280] text-lg">
              Browse {reports.length} infrastructure issues across Bangladesh
            </p>
          </div>
          {isAuthenticated && user?.role === 'user' && (
            <Link href="/reports/new">
              <Button variant="primary" className="flex items-center gap-2">
                <FaPlus />
                Report New Issue
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f] transition"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                  showFilters
                    ? 'bg-[#2a7d2f] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaFilter />
                Filters
              </button>
              <button
                onClick={fetchReports}
                className="px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold transition"
                title="Refresh"
              >
                <FaSync />
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
                  value={filters.district}
                  onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f]"
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
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f]"
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
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f]"
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
                  value={filters.problemType}
                  onChange={(e) => setFilters({ ...filters, problemType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-[#2a7d2f]"
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
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-[#2a7d2f]">{reports.length}</div>
            <div className="text-sm text-[#6B7280]">Total Reports</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {reports.filter((r) => r.status === 'pending').length}
            </div>
            <div className="text-sm text-[#6B7280]">Pending</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {reports.filter((r) => r.status === 'in-progress').length}
            </div>
            <div className="text-sm text-[#6B7280]">In Progress</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {reports.filter((r) => r.status === 'resolved').length}
            </div>
            <div className="text-sm text-[#6B7280]">Resolved</div>
          </Card>
        </div>

        {/* Reports Grid */}
        {filteredReports.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-[#002E2E] mb-2">No Reports Found</h3>
            <p className="text-[#6B7280] mb-6">
              {searchTerm || Object.values(filters).some((f) => f)
                ? 'Try adjusting your filters or search term'
                : 'Be the first to report an issue!'}
            </p>
            {isAuthenticated && user?.role === 'user' && (
              <Link href="/reports/new">
                <Button variant="primary">Report New Issue</Button>
              </Link>
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