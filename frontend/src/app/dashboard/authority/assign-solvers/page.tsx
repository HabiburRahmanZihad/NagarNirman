'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { userAPI, reportAPI, taskAPI } from '@/utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'problemSolver';
  division: string;
  district?: string;
  organization?: string;
  profilePicture?: string;
  expertise?: string[];
  rating?: number;
  completedTasks?: number;
  successRate?: number;
  isActive: boolean;
}

interface Report {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: {
    division: string;
    district: string;
    address: string;
  };
  severity: string;
  status: string;
  createdAt: string;
}

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'urgent': return 'text-red-600 bg-red-100';
    case 'high': return 'text-orange-600 bg-orange-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getSeverityEmoji = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'urgent': return '🔴';
    case 'high': return '🟠';
    case 'medium': return '🟡';
    case 'low': return '🟢';
    default: return '⚪';
  }
};

export default function AssignSolversPage() {
  const { user: authUser } = useAuth();
  const [solvers, setSolvers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolver, setSelectedSolver] = useState<User | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [filterRole, setFilterRole] = useState<'all' | 'problemSolver'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (authUser?.division) {
      fetchSolvers();
      fetchReports();
    }
  }, [authUser]);

  const fetchSolvers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getSolvers({
        division: authUser?.division
      });

      setSolvers(response.users || []);
    } catch (error) {
      console.error('Error fetching solvers:', error);
      toast.error('Failed to load problem solvers and NGOs');
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getAll({
        division: authUser?.division,
        status: 'pending'
      });
      setReports(response.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load pending reports');
    }
  };

  const handleAssignTask = (solver: User) => {
    setSelectedSolver(solver);
    setShowAssignModal(true);
    setSelectedReport('');
    setAssignmentNotes('');
  };

  const handleSubmitAssignment = async () => {
    if (!selectedReport || !selectedSolver) {
      toast.error('Please select a report to assign');
      return;
    }

    try {
      setAssigning(true);
      await taskAPI.assign({
        title: 'Task Assignment',
        description: assignmentNotes || 'No additional notes',
        report: selectedReport,
        assignedTo: selectedSolver._id
      });

      toast.success(`Task assigned to ${selectedSolver.name} successfully!`);
      setShowAssignModal(false);
      fetchReports(); // Refresh reports to remove assigned one
    } catch (error: any) {
      console.error('Error assigning task:', error);
      toast.error(error.response?.data?.message || 'Failed to assign task');
    } finally {
      setAssigning(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'problemSolver': return '💡';

      default: return '👤';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'problemSolver':
        return 'bg-blue-100 text-blue-800';
      case 'ngo':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'problemSolver': return 'Problem Solver';

      default: return role;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredSolvers = solvers
    .filter(solver => filterRole === 'all' || solver.role === filterRole)
    .filter(solver =>
      solver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solver.organization?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Problem Solvers & NGOs
          </h1>
          <p className="text-gray-600">
            Assign tasks to problem solvers and NGOs in{' '}
            <span className="font-semibold text-green-600">{authUser?.division}</span>
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600">Total Solvers: </span>
              <span className="font-bold text-green-600">{solvers.length}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600">Pending Reports: </span>
              <span className="font-bold text-orange-600">{reports.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-white rounded-xl shadow-sm p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div>
              <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                id="filter-type"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="problemSolver">💡 Problem Solvers</option>

              </select>
            </div>
          </div>
        </motion.div>

        {/* Solvers Grid */}
        {filteredSolvers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center"
          >
            <p className="text-gray-500">No problem solvers or NGOs found</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSolvers.map((solver, index) => (
              <motion.div
                key={solver._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 border border-gray-100"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {solver.profilePicture ? (
                      <img
                        src={solver.profilePicture}
                        alt={solver.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                        {getInitials(solver.name)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{solver.name}</h3>
                      <p className="text-sm text-gray-500">{solver.email}</p>
                    </div>
                  </div>
                  <span className={`text-lg`}>{getRoleIcon(solver.role)}</span>
                </div>

                {/* Role Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(solver.role)}`}>
                    {getRoleLabel(solver.role)}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  {solver.organization && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🏢</span>
                      <span>{solver.organization}</span>
                    </div>
                  )}
                  {solver.district && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📍</span>
                      <span>{solver.district}, {solver.division}</span>
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">
                      {solver.rating?.toFixed(1) || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">
                      {solver.completedTasks || 0}
                    </div>
                    <div className="text-xs text-gray-500">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">
                      {solver.successRate || 0}%
                    </div>
                    <div className="text-xs text-gray-500">Success</div>
                  </div>
                </div>

                {/* Expertise Tags */}
                {solver.expertise && solver.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {solver.expertise.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {solver.expertise.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{solver.expertise.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Status & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className={`flex items-center text-sm ${solver.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${solver.isActive ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                    {solver.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleAssignTask(solver)}
                    disabled={!solver.isActive || reports.length === 0}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${solver.isActive && reports.length > 0
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Assign Task
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Assignment Modal */}
        <AnimatePresence>
          {showAssignModal && selectedSolver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAssignModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Assign Task</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Assigning to: <span className="font-semibold">{selectedSolver.name}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAssignModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Close modal"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Select Report */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Report to Assign <span className="text-red-500">*</span>
                    </label>
                    {reports.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No pending reports available</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {reports.map((report) => (
                          <div
                            key={report._id}
                            onClick={() => setSelectedReport(report._id)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedReport === report._id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-300'
                              }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">{report.title}</h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                                {getSeverityEmoji(report.severity)} {report.severity}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                            <div className="flex items-center text-xs text-gray-500 space-x-4">
                              <span>📍 {report.location.district}, {report.location.division}</span>
                              <span>📂 {report.category}</span>
                              <span>📅 {new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Assignment Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment Notes (Optional)
                    </label>
                    <textarea
                      value={assignmentNotes}
                      onChange={(e) => setAssignmentNotes(e.target.value)}
                      rows={4}
                      placeholder="Add any special instructions or notes for the solver..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowAssignModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitAssignment}
                      disabled={!selectedReport || assigning}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${selectedReport && !assigning
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      {assigning ? 'Assigning...' : 'Assign Task'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
