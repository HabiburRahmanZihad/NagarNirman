'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { reportAPI, userAPI, taskAPI } from '@/utils/api';
import { motion } from 'framer-motion';

interface Report {
  _id: string;
  title: string;
  description: string;
  images: string[];
  problemType: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'in-progress' | 'resolved' | 'closed';
  location: {
    address: string;
    district: string;
    division: string;
    coordinates?: [number, number];
  };
  upvotes: string[];
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProblemSolver {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'problemSolver' | 'ngo';
  division: string;
  district?: string;
  organization?: string;
  expertise?: string[];
  approved: boolean;
  isActive: boolean;
  rating?: number;
  completedTasks?: number;
  successRate?: number;
}

export default function SuperAdminAssignTaskPage() {
  const router = useRouter();
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [solvers, setSolvers] = useState<ProblemSolver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedSolver, setSelectedSolver] = useState<string>('');
  const [assigning, setAssigning] = useState(false);

  // Filters
  const [reportFilter, setReportFilter] = useState({
    division: '',
    district: '',
    severity: '',
    status: 'pending'
  });

  const [solverFilter, setSolverFilter] = useState({
    division: '',
    district: '',
    role: 'all' as 'all' | 'problemSolver' | 'ngo',
    search: ''
  });

  // Check authentication
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (authUser?.role !== "superAdmin") {
        toast.error('Access denied. SuperAdmin only.');
        router.push("/");
      }
    }
  }, [isAuthenticated, authUser, authLoading, router]);

  useEffect(() => {
    if (authUser?.role === 'superAdmin') {
      fetchReports();
      fetchSolvers();
    }
  }, [authUser, reportFilter]);

  useEffect(() => {
    if (authUser?.role === 'superAdmin') {
      fetchSolvers();
    }
  }, [solverFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getAll({
        division: reportFilter.division || undefined,
        district: reportFilter.district || undefined,
        status: reportFilter.status || undefined
      });

      console.log('Reports response:', response);

      if (response.success && Array.isArray(response.data)) {
        let filtered = response.data;

        if (reportFilter.severity) {
          filtered = filtered.filter(r => r.severity === reportFilter.severity);
        }

        setReports(filtered);
        console.log('Loaded reports:', filtered.length);
      } else {
        console.error('Invalid reports response:', response);
        toast.error('Failed to load reports');
      }
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error(error.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchSolvers = async () => {
    try {
      const filters: any = { limit: 1000 };

      if (solverFilter.division) filters.division = solverFilter.division;
      if (solverFilter.district) filters.district = solverFilter.district;

      console.log('Fetching solvers with filters:', filters);
      const response = await userAPI.getSolvers(filters);
      console.log('Solvers response:', response);

      if (response.success && response.users) {
        let filtered = response.users;

        if (solverFilter.role !== 'all') {
          filtered = filtered.filter((s: ProblemSolver) => s.role === solverFilter.role);
        }

        if (solverFilter.search) {
          const search = solverFilter.search.toLowerCase();
          filtered = filtered.filter((s: ProblemSolver) =>
            s.name.toLowerCase().includes(search) ||
            s.email.toLowerCase().includes(search) ||
            s.organization?.toLowerCase().includes(search)
          );
        }

        setSolvers(filtered);
        console.log('Loaded solvers:', filtered.length);
      } else {
        console.error('Invalid solvers response:', response);
        toast.error('Failed to load problem solvers and NGOs');
      }
    } catch (error: any) {
      console.error('Error fetching solvers:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to load problem solvers and NGOs');
    }
  };

  const handleAssignTask = async () => {
    if (!selectedReport || !selectedSolver) {
      toast.error('Please select both a report and a solver');
      return;
    }

    try {
      setAssigning(true);

      const taskData = {
        title: `Resolve: ${selectedReport.title}`,
        description: selectedReport.description,
        report: selectedReport._id,
        assignedTo: selectedSolver,
        priority: selectedReport.severity,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      };

      const response = await taskAPI.assign(taskData);

      if (response.success) {
        toast.success('🎉 Task assigned successfully! Report status updated to approved.');
        setSelectedReport(null);
        setSelectedSolver('');
        fetchReports(); // Refresh reports to update status
        fetchSolvers(); // Refresh solvers
      } else {
        toast.error(response.message || 'Failed to assign task');
      }
    } catch (error: any) {
      console.error('Error assigning task:', error);
      toast.error(error.message || 'Failed to assign task');
    } finally {
      setAssigning(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    const badges = {
      low: 'bg-yellow-100 text-yellow-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800'
    };
    return badges[severity as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/dashboard/superAdmin" className="text-gray-500 hover:text-gray-700">
                  SuperAdmin Dashboard
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-green-600 font-medium">Assign Task</li>
            </ol>
          </nav>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                <span className="text-3xl">✅</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quick Task Assignment</h1>
                <p className="text-gray-600 mt-1">
                  3 easy steps: Select report → Choose solver → Assign
                </p>
              </div>
            </div>
            {selectedReport && (
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border-2 border-green-500 animate-pulse">
                <p className="text-sm font-semibold text-green-600">Step {selectedSolver ? '3' : '2'} of 3</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-xl font-bold text-yellow-600">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <div>
                <p className="text-xs text-gray-600">Solvers</p>
                <p className="text-xl font-bold text-blue-600">{solvers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-xs text-gray-600">Individuals</p>
                <p className="text-xl font-bold text-green-600">
                  {solvers.filter(s => s.role === 'problemSolver').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏢</span>
              <div>
                <p className="text-xs text-gray-600">NGOs</p>
                <p className="text-xl font-bold text-purple-600">
                  {solvers.filter(s => s.role === 'ngo').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Flow */}
        {!selectedReport ? (
          // STEP 1: Select Report
          <div className="bg-white rounded-xl shadow-lg border-2 border-green-500 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h2 className="text-2xl font-bold text-gray-900">Select a Report to Assign</h2>
            </div>

            {/* Report Filters */}
            <div className="mb-4 flex gap-3">
              <select
                value={reportFilter.severity}
                onChange={(e) => setReportFilter({ ...reportFilter, severity: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Priorities</option>
                <option value="high">🔴 High Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🟢 Low Priority</option>
              </select>

              <select
                value={reportFilter.status}
                onChange={(e) => setReportFilter({ ...reportFilter, status: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="pending">⏳ Pending Only</option>
                <option value="">All Statuses</option>
              </select>
            </div>

            {/* Reports List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2">
              {reports.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <span className="text-6xl mb-4 block">📭</span>
                  <p className="text-gray-500 text-lg">No reports found</p>
                </div>
              ) : (
                reports.map((report) => (
                  <motion.div
                    key={report._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      report.status === 'pending'
                        ? 'border-gray-300 hover:border-green-500 hover:shadow-lg bg-white'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                    onClick={() => report.status === 'pending' && setSelectedReport(report)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{report.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        report.severity === 'high' ? 'bg-red-500 text-white' :
                        report.severity === 'medium' ? 'bg-orange-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {report.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">📍 {report.location.district}</p>
                        <p className="text-xs text-gray-500">{report.location.division}</p>
                      </div>
                      {report.status === 'pending' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold shadow-md hover:shadow-lg transition-all"
                        >
                          Select →
                        </button>
                      ) : (
                        <span className="px-3 py-1 bg-gray-300 text-gray-600 rounded-lg text-xs font-medium">
                          {report.status}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ) : !selectedSolver ? (
          // STEP 2: Select Solver
          <div className="bg-white rounded-xl shadow-lg border-2 border-blue-500 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-2xl font-bold text-gray-900">Choose Problem Solver</h2>
              </div>
              <button
                onClick={() => {
                  setSelectedReport(null);
                  setSelectedSolver('');
                }}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                ← Back
              </button>
            </div>

            {/* Selected Report Info */}
            <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Selected Report:</p>
              <p className="font-bold text-gray-900 text-lg">{selectedReport.title}</p>
              <p className="text-sm text-gray-600">📍 {selectedReport.location.district}, {selectedReport.location.division}</p>
            </div>

            {/* Solver Filters */}
            <div className="mb-4 flex gap-3">
              <input
                type="text"
                placeholder="🔍 Search by name, email, or organization..."
                value={solverFilter.search}
                onChange={(e) => setSolverFilter({ ...solverFilter, search: e.target.value })}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <select
                value={solverFilter.role}
                onChange={(e) => setSolverFilter({ ...solverFilter, role: e.target.value as any })}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">👥 All Types</option>
                <option value="problemSolver">💡 Problem Solvers</option>
                <option value="ngo">🏢 NGOs</option>
              </select>
            </div>

            {/* Solvers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">
              {solvers.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <span className="text-6xl mb-4 block">🔍</span>
                  <p className="text-gray-500 text-lg">No solvers found</p>
                </div>
              ) : (
                solvers.map((solver) => (
                  <motion.div
                    key={solver._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="border-2 rounded-xl p-4 cursor-pointer transition-all bg-white hover:shadow-xl border-gray-300 hover:border-blue-500"
                    onClick={() => setSelectedSolver(solver._id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {solver.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{solver.name}</h3>
                          <p className="text-xs text-gray-500">{solver.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 space-y-2 mb-3">
                      <p className="font-medium">📍 {solver.district}, {solver.division}</p>
                      {solver.organization && <p className="font-medium">🏢 {solver.organization}</p>}
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          solver.role === 'problemSolver'
                            ? 'bg-blue-500 text-white'
                            : 'bg-purple-500 text-white'
                        }`}>
                          {solver.role === 'problemSolver' ? '💡 Solver' : '🏢 NGO'}
                        </span>
                        {solver.rating && (
                          <span className="bg-yellow-400 text-white px-2 py-1 rounded-full font-bold">
                            ⭐ {solver.rating.toFixed(1)}
                          </span>
                        )}
                        {solver.completedTasks !== undefined && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full font-bold">
                            ✓ {solver.completedTasks}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSolver(solver._id);
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 text-sm font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      Select This Solver →
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ) : (
          // STEP 3: Confirm Assignment
          <div className="bg-white rounded-xl shadow-lg border-2 border-purple-500 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <h2 className="text-2xl font-bold text-gray-900">Confirm Assignment</h2>
              </div>
              <button
                onClick={() => setSelectedSolver('')}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                ← Change Solver
              </button>
            </div>

            {/* Summary */}
            <div className="space-y-4 mb-6">
              <div className="p-5 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">📋 Report to be Assigned:</p>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedReport.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedReport.description}</p>
                <div className="flex items-center gap-3 text-sm">
                  <span className={`px-3 py-1 rounded-full font-bold ${
                    selectedReport.severity === 'high' ? 'bg-red-500 text-white' :
                    selectedReport.severity === 'medium' ? 'bg-orange-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {selectedReport.severity.toUpperCase()} Priority
                  </span>
                  <span className="text-gray-700 font-medium">📍 {selectedReport.location.district}, {selectedReport.location.division}</span>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">👤 Assigned To:</p>
                {solvers.find(s => s._id === selectedSolver) && (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {solvers.find(s => s._id === selectedSolver)?.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{solvers.find(s => s._id === selectedSolver)?.email}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <span className={`px-3 py-1 rounded-full font-bold ${
                        solvers.find(s => s._id === selectedSolver)?.role === 'problemSolver'
                          ? 'bg-blue-500 text-white'
                          : 'bg-purple-500 text-white'
                      }`}>
                        {solvers.find(s => s._id === selectedSolver)?.role === 'problemSolver' ? '💡 Problem Solver' : '🏢 NGO'}
                      </span>
                      <span className="text-gray-700 font-medium">
                        📍 {solvers.find(s => s._id === selectedSolver)?.district}, {solvers.find(s => s._id === selectedSolver)?.division}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedReport(null);
                  setSelectedSolver('');
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-bold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTask}
                disabled={assigning}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {assigning ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Assigning...
                  </span>
                ) : (
                  '✅ Confirm & Assign Task'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
