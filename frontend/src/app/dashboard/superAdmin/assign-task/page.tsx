'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from "next/navigation";
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { FullPageLoading } from '@/components/common';
import { reportAPI, userAPI, taskAPI } from '@/utils/api';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Users,
  Lightbulb,
  Building2,
  Clock,
  MapPin,
  ArrowLeft,
  Calendar,
  CheckSquare,
  Star
} from 'lucide-react';
import Card from '@/components/common/Card';

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

interface SolverFilters {
  limit: number;
  division?: string;
  district?: string;
}

export default function SuperAdminAssignTaskPage() {
  const searchParams = useSearchParams();
  const { user: authUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [solvers, setSolvers] = useState<ProblemSolver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedSolver, setSelectedSolver] = useState<string>('');
  const [assigning, setAssigning] = useState(false);
  const [preSelectedSolver, setPreSelectedSolver] = useState<{ id: string; name: string } | null>(null);
  const [deadline, setDeadline] = useState<string>('');

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

  // Check for pre-selected solver from URL params
  useEffect(() => {
    const solverId = searchParams.get('solverId');
    const solverName = searchParams.get('solverName');

    if (solverId && solverName) {
      setPreSelectedSolver({ id: solverId, name: decodeURIComponent(solverName) });
      setSelectedSolver(solverId);
      toast.success(`${decodeURIComponent(solverName)} has been pre-selected. Now choose a report to assign.`, {
        duration: 4000,
        icon: '👤',
      });
    }
  }, [searchParams]);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getAll({
        division: reportFilter.division || undefined,
        district: reportFilter.district || undefined,
        status: reportFilter.status || undefined
      });

      // console.log('Reports response:', response);

      if (response.success && Array.isArray(response.data)) {
        let filtered = response.data;

        if (reportFilter.severity) {
          filtered = filtered.filter((r: Report) => r.severity === reportFilter.severity);
        }

        setReports(filtered);
        // console.log('Loaded reports:', filtered.length);
      } else {
        console.error('Invalid reports response:', response);
        toast.error('Failed to load reports');
      }
    } catch (error: unknown) {
      console.error('Error fetching reports:', error);
      toast.error((error as Error).message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [reportFilter]);

  const fetchSolvers = useCallback(async () => {
    try {
      const filters: SolverFilters = { limit: 1000 };

      if (solverFilter.division) filters.division = solverFilter.division;
      if (solverFilter.district) filters.district = solverFilter.district;

      // console.log('Fetching solvers with filters:', filters);
      const response = await userAPI.getSolvers(filters);
      // console.log('Solvers response:', response);

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
        // console.log('Loaded solvers:', filtered.length);
      } else {
        console.error('Invalid solvers response:', response);
        toast.error('Failed to load problem solvers and NGOs');
      }
    } catch (error) {
      console.error('Error fetching solvers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load problem solvers and NGOs';
      toast.error(errorMessage);
    }
  }, [solverFilter]);

  useEffect(() => {
    if (authUser?.role === 'superAdmin') {
      fetchReports();
      fetchSolvers();
    }
  }, [authUser, fetchReports, fetchSolvers]);

  useEffect(() => {
    if (authUser?.role === 'superAdmin') {
      fetchSolvers();
    }
  }, [authUser?.role, fetchSolvers]);

  const handleAssignTask = async () => {
    if (!selectedReport || !selectedSolver) {
      toast.error('Please select both a report and a solver');
      return;
    }

    if (!deadline) {
      toast.error('Please set a deadline for this task');
      return;
    }

    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      toast.error('Deadline must be in the future');
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
        deadline: deadlineDate.toISOString()
      };

      const response = await taskAPI.assign(taskData);

      if (response.success) {
        toast.success('🎉 Task assigned successfully! Report status updated to approved.');
        setSelectedReport(null);
        setSelectedSolver('');
        setPreSelectedSolver(null);
        setDeadline('');
        fetchReports(); // Refresh reports to update status
        fetchSolvers(); // Refresh solvers
      } else {
        toast.error(response.message || 'Failed to assign task');
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to assign task';
      toast.error(errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return <FullPageLoading text="Loading..." />;
  }

  return (
    <div className="space-y-4 xs:space-y-6 sm:space-y-8 px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 lg:py-8 bg-base-300 min-h-screen container mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary text-white rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 xs:p-6 sm:p-8 lg:p-12 border-t-4 border-accent flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 sm:gap-6"
      >
        <div className="min-w-0">
          <h1 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-1 xs:mb-2 sm:mb-3">
            Quick Task Assignment 🚀
          </h1>
          <p className="text-white/90 text-xs xs:text-sm sm:text-base lg:text-lg font-semibold">
            3 easy steps: Select report → Choose solver → Assign
          </p>
        </div>
        {selectedReport && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="shrink-0 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-white/20 hover:bg-white/30 rounded-lg xs:rounded-xl sm:rounded-2xl border-2 border-accent"
          >
            <p className="text-xs xs:text-sm font-bold">Step {selectedSolver ? '3' : '2'} of 3</p>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
        {[
          { title: 'Pending Reports', value: reports.filter(r => r.status === 'pending').length, icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
          { title: 'Available Solvers', value: solvers.length, icon: Users, color: 'text-info', bgColor: 'bg-info/10' },
          { title: 'Individuals', value: solvers.filter(s => s.role === 'problemSolver').length, icon: Lightbulb, color: 'text-success', bgColor: 'bg-success/10' },
          { title: 'Organizations', value: solvers.filter(s => s.role === 'ngo').length, icon: Building2, color: 'text-secondary', bgColor: 'bg-secondary/10' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border-2 border-accent/20`}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase tracking-wide truncate">{stat.title}</p>
                  <p className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-info mt-1 xs:mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} bg-white/50 p-1.5 xs:p-2 sm:p-3 rounded-lg xs:rounded-xl shrink-0`}>
                  <Icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* STEP 1: Select Report */}
      {!selectedReport ? (
        <Card className="border-t-4 border-secondary">
          <div className="flex items-start xs:items-center gap-2 xs:gap-3 mb-4 xs:mb-5 sm:mb-6">
            <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-sm xs:text-base sm:text-lg shrink-0">1</div>
            <div className="min-w-0">
              <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold">Select a Report to Assign</h2>
              <p className="text-xs xs:text-sm text-neutral/60 mt-0.5 xs:mt-1">Choose a pending report that needs to be assigned to a problem solver</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-base-200 rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 mb-4 xs:mb-5 sm:mb-6">
            <p className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase mb-2 xs:mb-3">Filter Reports</p>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3">
              <select
                aria-label="Filter by severity"
                value={reportFilter.severity}
                onChange={(e) => setReportFilter({ ...reportFilter, severity: e.target.value })}
                className="px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-100 font-medium text-neutral cursor-pointer hover:border-secondary/50 transition-all"
              >
                <option value="">All Priorities</option>
                <option value="high">🔴 High Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🟢 Low Priority</option>
              </select>

              <select
                aria-label="Filter by status"
                value={reportFilter.status}
                onChange={(e) => setReportFilter({ ...reportFilter, status: e.target.value })}
                className="px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-100 font-medium text-neutral cursor-pointer hover:border-secondary/50 transition-all"
              >
                <option value="pending">⏳ Pending Only</option>
                <option value="">All Statuses</option>
              </select>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 max-h-[70vh] overflow-y-auto pr-1 xs:pr-2">
            {reports.length === 0 ? (
              <div className="col-span-2 text-center py-10 xs:py-12 sm:py-16">
                <div className="text-5xl xs:text-6xl sm:text-7xl mb-3 xs:mb-4 opacity-40">📭</div>
                <p className="text-neutral/60 text-base xs:text-lg font-semibold">No reports found</p>
                <p className="text-neutral/50 text-xs xs:text-sm mt-1 xs:mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              reports.map((report) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={report.status === 'pending' ? { scale: 1.02 } : {}}
                  className={`rounded-lg xs:rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 cursor-pointer transition-all border-2 overflow-hidden group ${report.status === 'pending'
                    ? 'bg-base-100 border-secondary/30 hover:border-secondary hover:shadow-2xl active:scale-95'
                    : 'bg-base-200 border-base-300 opacity-50 cursor-not-allowed'
                    }`}
                  onClick={() => report.status === 'pending' && setSelectedReport(report)}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-linear-to-r from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${report.status === 'pending' ? '' : 'hidden'}`}></div>

                  <div className="relative z-10">
                    {/* Header with severity badge */}
                    <div className="flex justify-between items-start gap-2 mb-3 xs:mb-4">
                      <h3 className="font-bold text-neutral text-sm xs:text-base sm:text-lg flex-1 group-hover:text-secondary transition-colors line-clamp-2">{report.title}</h3>
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className={`px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-bold text-white shrink-0 ${report.severity === 'high'
                          ? 'bg-error shadow-lg shadow-error/30'
                          : report.severity === 'medium'
                            ? 'bg-warning shadow-lg shadow-warning/30'
                            : 'bg-success shadow-lg shadow-success/30'
                          }`}
                      >
                        {report.severity === 'high' ? '🔴' : report.severity === 'medium' ? '🟡' : '🟢'} <span className="hidden xs:inline">{report.severity.toUpperCase()}</span>
                      </motion.span>
                    </div>

                    {/* Description */}
                    <p className="text-xs xs:text-sm text-neutral/70 mb-3 xs:mb-4 line-clamp-2">{report.description}</p>

                    {/* Footer with location and action */}
                    <div className="flex items-center justify-between pt-3 xs:pt-4 border-t border-accent/10">
                      <div className="text-xs xs:text-sm text-neutral/60 min-w-0">
                        <p className="font-semibold flex items-center gap-1 text-neutral truncate">
                          <MapPin className="w-3 h-3 xs:w-4 xs:h-4 text-secondary shrink-0" />
                          {report.location.district}
                        </p>
                        <p className="text-[10px] xs:text-xs text-neutral/50 mt-0.5 xs:mt-1 truncate">{report.location.division}</p>
                      </div>
                      {report.status === 'pending' ? (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                          }}
                          className="px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 bg-linear-to-r from-secondary to-secondary/80 text-white rounded-lg xs:rounded-xl hover:shadow-lg font-semibold flex items-center gap-1 xs:gap-2 text-xs xs:text-sm transition-all shadow-md shrink-0"
                        >
                          <CheckSquare className="w-3 h-3 xs:w-4 xs:h-4" />
                          Select
                        </motion.button>
                      ) : (
                        <span className="px-2 xs:px-3 py-0.5 xs:py-1 bg-base-300 text-neutral/60 rounded-lg text-[10px] xs:text-xs font-bold uppercase tracking-wide shrink-0">
                          {report.status}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Helper text */}
          {reports.length > 0 && (
            <p className="text-[10px] xs:text-xs text-neutral/50 mt-3 xs:mt-4 text-center">
              {reports.filter(r => r.status === 'pending').length} pending reports available for assignment
            </p>
          )}
        </Card>
      ) : !selectedSolver ? (
        /* STEP 2: Select Solver */
        <Card className="border-t-4 border-info">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 mb-4 xs:mb-5 sm:mb-6">
            <div className="flex items-start xs:items-center gap-2 xs:gap-3">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-info text-white rounded-full flex items-center justify-center font-bold text-sm xs:text-base sm:text-lg shrink-0">2</div>
              <div className="min-w-0">
                <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold">Choose Problem Solver</h2>
                <p className="text-xs xs:text-sm text-neutral/60 mt-0.5 xs:mt-1">Select a solver or NGO to handle this report</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedReport(null);
                setSelectedSolver('');
                setPreSelectedSolver(null);
              }}
              className="flex items-center gap-1 px-3 xs:px-4 py-1.5 xs:py-2 border-2 border-accent/20 rounded-lg xs:rounded-xl hover:bg-base-200 text-xs xs:text-sm font-semibold transition-all shrink-0"
            >
              <ArrowLeft className="w-3 h-3 xs:w-4 xs:h-4" /> Back
            </motion.button>
          </div>

          {/* Pre-Selected Solver */}
          {preSelectedSolver && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 xs:mb-5 sm:mb-6 p-3 xs:p-4 sm:p-5 bg-linear-to-r from-success/20 to-info/20 border-2 border-success rounded-lg xs:rounded-xl sm:rounded-2xl"
            >
              <div className="flex items-center gap-1.5 xs:gap-2 mb-1 xs:mb-2">
                <CheckCircle2 className="w-4 h-4 xs:w-5 xs:h-5 text-success" />
                <p className="text-xs xs:text-sm font-bold text-success">✨ Solver Pre-Selected</p>
              </div>
              <p className="font-bold text-neutral text-base xs:text-lg">{preSelectedSolver.name}</p>
              <p className="text-xs xs:text-sm text-neutral/60 mt-0.5 xs:mt-1">👉 This solver is available and ready for assignment</p>
            </motion.div>
          )}

          {/* Selected Report Summary */}
          <div className="mb-4 xs:mb-5 sm:mb-6 p-3 xs:p-4 sm:p-5 bg-linear-to-r from-secondary/20 to-accent/10 border-2 border-secondary rounded-lg xs:rounded-xl sm:rounded-2xl">
            <p className="text-[10px] xs:text-xs font-bold text-secondary/70 uppercase mb-1 xs:mb-2">Selected Report</p>
            <p className="font-bold text-neutral text-base xs:text-lg">{selectedReport.title}</p>
            <p className="text-xs xs:text-sm text-neutral/60 flex items-center gap-1 mt-1 xs:mt-2">
              <MapPin className="w-3 h-3 xs:w-4 xs:h-4" />
              {selectedReport.location.district}, {selectedReport.location.division}
            </p>
            <div className="mt-2 xs:mt-3 flex items-center gap-2">
              <span className={`px-2 xs:px-3 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-bold text-white ${selectedReport.severity === 'high'
                ? 'bg-error'
                : selectedReport.severity === 'medium'
                  ? 'bg-warning'
                  : 'bg-success'
                }`}>
                {selectedReport.severity.toUpperCase()} Priority
              </span>
            </div>
          </div>

          {/* Solver Filters */}
          <div className="bg-base-200 rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 mb-4 xs:mb-5 sm:mb-6">
            <p className="text-[10px] xs:text-xs font-bold text-neutral/70 uppercase mb-2 xs:mb-3">Search & Filter Solvers</p>
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
              <input
                type="text"
                placeholder="🔍 Search by name, email, or organization..."
                value={solverFilter.search}
                onChange={(e) => setSolverFilter({ ...solverFilter, search: e.target.value })}
                className="flex-1 px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-info focus:border-info bg-base-100 text-neutral hover:border-info/50 transition-all"
              />

              <select
                aria-label="Filter by solver type"
                value={solverFilter.role}
                onChange={(e) => setSolverFilter({ ...solverFilter, role: e.target.value as 'all' | 'problemSolver' | 'ngo' })}
                className="px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-info focus:border-info bg-base-100 font-medium text-neutral cursor-pointer hover:border-info/50 transition-all shrink-0"
              >
                <option value="all">👥 All Types</option>
                <option value="problemSolver">💡 Problem Solvers</option>
                <option value="ngo">🏢 NGOs</option>
              </select>
            </div>
          </div>

          {/* Solvers Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 max-h-[60vh] overflow-y-auto pr-1 xs:pr-2">
            {solvers.length === 0 ? (
              <div className="col-span-3 text-center py-10 xs:py-12 sm:py-16">
                <div className="text-5xl xs:text-6xl sm:text-7xl mb-3 xs:mb-4 opacity-40">🔍</div>
                <p className="text-neutral/60 text-base xs:text-lg font-semibold">No solvers found</p>
                <p className="text-neutral/50 text-xs xs:text-sm mt-1 xs:mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              solvers.map((solver) => {
                const isPreSelected = preSelectedSolver?.id === solver._id;
                return (
                  <motion.div
                    key={solver._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03 }}
                    className={`rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-5 cursor-pointer transition-all border-2 overflow-hidden group ${isPreSelected
                      ? 'bg-linear-to-br from-success/15 to-info/15 border-success shadow-lg ring-2 ring-success/50'
                      : 'bg-base-100 border-info/30 hover:border-info hover:shadow-xl'
                      }`}
                    onClick={() => setSelectedSolver(solver._id)}
                  >
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-linear-to-r from-info/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>

                    <div className="relative z-10">
                      {/* Avatar and Name */}
                      <div className="flex items-start gap-2 xs:gap-3 mb-3 xs:mb-4">
                        <div className={`w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl flex items-center justify-center text-white font-bold text-sm xs:text-base sm:text-lg shrink-0 bg-linear-to-br ${isPreSelected
                          ? 'from-success to-info shadow-lg'
                          : 'from-info to-secondary shadow-md'
                          }`}>
                          {solver.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-neutral text-sm xs:text-base truncate">{solver.name}</h3>
                          <p className="text-[10px] xs:text-xs text-neutral/60 truncate">{solver.email}</p>
                        </div>
                        {isPreSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="shrink-0 w-5 h-5 xs:w-6 xs:h-6 bg-success text-white rounded-full flex items-center justify-center"
                          >
                            <CheckCircle2 className="w-4 h-4 xs:w-5 xs:h-5" />
                          </motion.div>
                        )}
                      </div>

                      {/* Location and Organization */}
                      <div className="text-[10px] xs:text-xs text-neutral/60 space-y-1 xs:space-y-2 mb-3 xs:mb-4 pt-2 xs:pt-3 border-t border-accent/10">
                        <p className="font-semibold flex items-center gap-1 text-neutral">
                          <MapPin className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-info shrink-0" />
                          <span className="truncate">{solver.district}, {solver.division}</span>
                        </p>
                        {solver.organization && (
                          <p className="font-semibold flex items-center gap-1 text-neutral">
                            <Building2 className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-secondary shrink-0" /> <span className="truncate">{solver.organization}</span>
                          </p>
                        )}
                      </div>

                      {/* Stats Badges */}
                      <div className="flex items-center gap-1.5 xs:gap-2 flex-wrap mb-3 xs:mb-4">
                        <span className={`px-1.5 xs:px-2 sm:px-2.5 py-0.5 xs:py-1 rounded-md xs:rounded-lg text-[10px] xs:text-xs font-bold text-white ${solver.role === 'problemSolver' ? 'bg-info shadow-md shadow-info/30' : 'bg-secondary shadow-md shadow-secondary/30'
                          }`}>
                          {solver.role === 'problemSolver' ? '💡' : '🏢'} <span className="hidden xs:inline">{solver.role === 'problemSolver' ? 'Solver' : 'NGO'}</span>
                        </span>
                        {solver.rating && (
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="bg-warning text-white px-1.5 xs:px-2 sm:px-2.5 py-0.5 xs:py-1 rounded-md xs:rounded-lg font-bold flex items-center gap-0.5 xs:gap-1 text-[10px] xs:text-xs shadow-md shadow-warning/30"
                          >
                            <Star className="w-2.5 h-2.5 xs:w-3 xs:h-3" /> {solver.rating.toFixed(1)}
                          </motion.span>
                        )}
                        {solver.completedTasks !== undefined && (
                          <span className="bg-success text-white px-1.5 xs:px-2 sm:px-2.5 py-0.5 xs:py-1 rounded-md xs:rounded-lg font-bold flex items-center gap-0.5 xs:gap-1 text-[10px] xs:text-xs shadow-md shadow-success/30">
                            <CheckSquare className="w-2.5 h-2.5 xs:w-3 xs:h-3" /> {solver.completedTasks}
                          </span>
                        )}
                      </div>

                      {/* Select Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSolver(solver._id);
                        }}
                        className={`w-full px-2 xs:px-3 py-1.5 xs:py-2 sm:py-2.5 rounded-lg xs:rounded-xl text-xs xs:text-sm font-bold transition-all flex items-center justify-center gap-1 xs:gap-2 text-white shadow-md hover:shadow-lg ${isPreSelected
                          ? 'bg-linear-to-r from-success to-info'
                          : 'bg-linear-to-r from-info to-secondary'
                          }`}
                      >
                        {isPreSelected ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 xs:w-4 xs:h-4" /> Selected ✓
                          </>
                        ) : (
                          <>
                            <CheckSquare className="w-3 h-3 xs:w-4 xs:h-4" /> <span className="hidden xs:inline">Select This</span> Solver
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Helper text */}
          {solvers.length > 0 && (
            <p className="text-[10px] xs:text-xs text-neutral/50 mt-3 xs:mt-4 text-center">
              {solvers.length} solver{solvers.length !== 1 ? 's' : ''} available • Click to select
            </p>
          )}
        </Card>
      ) : (
        /* STEP 3: Confirm Assignment */
        <Card className="border-t-4 border-info">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 mb-4 xs:mb-5 sm:mb-6">
            <div className="flex items-center gap-2 xs:gap-3">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-info text-white rounded-full flex items-center justify-center font-bold text-sm xs:text-base sm:text-lg">3</div>
              <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold">Confirm Assignment</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSolver('')}
              className="flex items-center gap-1 px-3 xs:px-4 py-1.5 xs:py-2 border-2 border-accent/20 rounded-lg xs:rounded-xl hover:bg-base-200 text-xs xs:text-sm font-semibold transition-all shrink-0"
            >
              <ArrowLeft className="w-3 h-3 xs:w-4 xs:h-4" /> Change Solver
            </motion.button>
          </div>

          {/* Summary Cards */}
          <div className="space-y-3 xs:space-y-4 mb-4 xs:mb-5 sm:mb-6">
            {/* Report Summary */}
            <div className="p-3 xs:p-4 sm:p-5 bg-linear-to-b from-secondary/20 to-accent/10 border-2 border-secondary rounded-lg xs:rounded-xl sm:rounded-2xl">
              <p className="text-[10px] xs:text-xs font-bold text-secondary/70 uppercase mb-1 xs:mb-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 xs:w-4 xs:h-4" /> Report to be Assigned
              </p>
              <h3 className="text-base xs:text-lg sm:text-xl font-bold text-neutral mb-1 xs:mb-2">{selectedReport.title}</h3>
              <p className="text-xs xs:text-sm text-neutral/70 mb-2 xs:mb-3 line-clamp-2">{selectedReport.description}</p>
              <div className="flex items-center gap-2 xs:gap-3 flex-wrap text-xs xs:text-sm">
                <span className={`px-2 xs:px-3 py-0.5 xs:py-1 rounded-full font-bold text-white ${selectedReport.severity === 'high'
                  ? 'bg-error'
                  : selectedReport.severity === 'medium'
                    ? 'bg-warning'
                    : 'bg-success'
                  }`}>
                  {selectedReport.severity.toUpperCase()} Priority
                </span>
                <span className="text-neutral/70 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 xs:w-4 xs:h-4" />
                  <span className="truncate">{selectedReport.location.district}, {selectedReport.location.division}</span>
                </span>
              </div>
            </div>

            {/* Solver Summary */}
            <div className="p-3 xs:p-4 sm:p-5 bg-linear-to-b from-info/20 to-accent/10 border-2 border-info rounded-lg xs:rounded-xl sm:rounded-2xl">
              <p className="text-[10px] xs:text-xs font-bold text-info/70 uppercase mb-1 xs:mb-2 flex items-center gap-1">
                <Users className="w-3 h-3 xs:w-4 xs:h-4" /> Assigned To
              </p>
              {solvers.find(s => s._id === selectedSolver) && (
                <>
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold text-neutral mb-1 xs:mb-2">
                    {solvers.find(s => s._id === selectedSolver)?.name}
                  </h3>
                  <p className="text-xs xs:text-sm text-neutral/70 mb-2 xs:mb-3 truncate">{solvers.find(s => s._id === selectedSolver)?.email}</p>
                  <div className="flex items-center gap-2 xs:gap-3 flex-wrap text-xs xs:text-sm">
                    <span className={`px-2 xs:px-3 py-0.5 xs:py-1 rounded-full font-bold text-white ${solvers.find(s => s._id === selectedSolver)?.role === 'problemSolver' ? 'bg-info' : 'bg-secondary'
                      }`}>
                      {solvers.find(s => s._id === selectedSolver)?.role === 'problemSolver' ? '💡 Problem Solver' : '🏢 NGO'}
                    </span>
                    <span className="text-neutral/70 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="truncate">{solvers.find(s => s._id === selectedSolver)?.district}, {solvers.find(s => s._id === selectedSolver)?.division}</span>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Deadline Input */}
          <div className="p-3 xs:p-4 sm:p-5 bg-linear-to-b from-warning/20 to-accent/10 border-2 border-warning rounded-lg xs:rounded-xl sm:rounded-2xl mb-4 xs:mb-5 sm:mb-6">
            <p className="text-[10px] xs:text-xs font-bold text-warning/70 uppercase mb-2 xs:mb-3 flex items-center gap-1.5 xs:gap-2">
              <Calendar className="w-3 h-3 xs:w-4 xs:h-4" /> Set Task Deadline (Required)
            </p>
            <div className="space-y-2 xs:space-y-3">
              <input
                aria-label="Set task deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-warning/30 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-warning focus:border-warning bg-base-100 text-neutral font-semibold"
                required
              />
              <div className="grid grid-cols-2 xs:grid-cols-4 gap-1.5 xs:gap-2">
                {[
                  { label: '+3 Days', days: 3 },
                  { label: '+1 Week', days: 7 },
                  { label: '+2 Weeks', days: 14 },
                  { label: '+1 Month', days: 30 }
                ].map((preset) => (
                  <motion.button
                    key={preset.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      const date = new Date();
                      date.setDate(date.getDate() + preset.days);
                      setDeadline(date.toISOString().slice(0, 16));
                    }}
                    className="px-2 xs:px-3 py-1.5 xs:py-2 bg-base-100 border-2 border-warning/30 rounded-md xs:rounded-lg hover:bg-warning/10 text-xs xs:text-sm font-semibold text-neutral transition-all"
                  >
                    {preset.label}
                  </motion.button>
                ))}
              </div>
              {deadline && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs xs:text-sm text-warning font-semibold flex items-center gap-1.5 xs:gap-2 pt-1.5 xs:pt-2 border-t border-warning/20"
                >
                  <CheckSquare className="w-3 h-3 xs:w-4 xs:h-4" />
                  {new Date(deadline).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </motion.p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedReport(null);
                setSelectedSolver('');
                setDeadline('');
              }}
              className="flex-1 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 border-2 border-accent/20 rounded-lg xs:rounded-xl hover:bg-base-200 font-bold text-neutral transition-all text-sm xs:text-base"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAssignTask}
              disabled={assigning}
              className="flex-1 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-linear-to-r from-success to-info text-white rounded-lg xs:rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm xs:text-base sm:text-lg transition-all flex items-center justify-center gap-1.5 xs:gap-2"
            >
              {assigning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 xs:h-5 xs:w-5 border-b-2 border-white"></div>
                  Assigning...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 xs:w-5 xs:h-5" />
                  Confirm & Assign Task
                </>
              )}
            </motion.button>
          </div>
        </Card>
      )}
    </div>
  );
}
