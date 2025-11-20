'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { userAPI } from '@/utils/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Solver {
  _id: string;
  name: string;
  email: string;
  role: 'problemSolver' | 'ngo';
  division: string;
  district?: string;
  organization?: string;
  profilePicture?: string;
  expertise?: string[];
  rating?: number;
  completedTasks?: number;
  successRate?: number;
  isActive: boolean;
  phone?: string;
  createdAt: string;
}

export default function SolversPage() {
  const router = useRouter();
  const { user: authUser, isLoading, isAuthenticated } = useAuth();
  const [solvers, setSolvers] = useState<Solver[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'all' | 'problemSolver' | 'ngo'>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'completedTasks' | 'successRate' | 'createdAt'>('rating');

  // Check if user is authenticated and has 'authority' role
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (authUser?.role !== "authority") {
        router.push("/");
      }
    }
  }, [isAuthenticated, authUser, isLoading, router]);

  useEffect(() => {
    if (authUser?.division) {
      fetchSolvers();
    }
  }, [authUser]);

  const fetchSolvers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getSolvers({
        division: authUser?.division,
        limit: 100
      });

      if (response.success) {
        const solversList = response.users || [];
        setSolvers(solversList);
        toast.success(`Loaded ${solversList.length} solvers from ${authUser?.division}`);
      } else {
        toast.error(response.message || 'Failed to load solvers');
      }
    } catch (error: any) {
      console.error('Error fetching solvers:', error);
      toast.error(error.message || 'Failed to load problem solvers and NGOs');
    } finally {
      setLoading(false);
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'problemSolver': return '💡';
      case 'ngo': return '🏢';
      default: return '👤';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'problemSolver':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ngo':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'problemSolver': return 'Problem Solver';
      case 'ngo': return 'NGO';
      default: return role;
    }
  };

  // Get unique districts
  const districts = Array.from(new Set(solvers.map(s => s.district).filter(Boolean)));

  // Filter and sort solvers
  const filteredSolvers = solvers
    .filter(solver => {
      if (filterRole !== 'all' && solver.role !== filterRole) return false;
      if (filterDistrict && solver.district !== filterDistrict) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          solver.name.toLowerCase().includes(query) ||
          solver.email.toLowerCase().includes(query) ||
          solver.organization?.toLowerCase().includes(query) ||
          solver.district?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'completedTasks':
          return (b.completedTasks || 0) - (a.completedTasks || 0);
        case 'successRate':
          return (b.successRate || 0) - (a.successRate || 0);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading solvers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Breadcrumb */}
        <div className="mb-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/dashboard/authority" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Authority Dashboard
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-green-600 font-medium">Problem Solvers & NGOs</li>
            </ol>
          </nav>

          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Problem Solvers & NGOs</h1>
              <p className="text-gray-600 mt-2">
                View and manage all problem solvers and NGOs in{' '}
                <span className="font-semibold text-green-600">{authUser?.division}</span> division
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchSolvers}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                title="Refresh data"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Solvers</p>
                <p className="text-2xl font-bold text-gray-900">{solvers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 text-2xl">💡</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Problem Solvers</p>
                <p className="text-2xl font-bold text-blue-600">
                  {solvers.filter(s => s.role === 'problemSolver').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="w-6 h-6 text-2xl">🏢</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">NGOs</p>
                <p className="text-2xl font-bold text-purple-600">
                  {solvers.filter(s => s.role === 'ngo').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {solvers.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, email, organization, or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="problemSolver">💡 Problem Solvers</option>
                <option value="ngo">🏢 NGOs</option>
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by District
              </label>
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'rating', label: 'Highest Rating' },
                { value: 'completedTasks', label: 'Most Tasks Completed' },
                { value: 'successRate', label: 'Highest Success Rate' },
                { value: 'createdAt', label: 'Newest First' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === option.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredSolvers.length}</span> of <span className="font-semibold">{solvers.length}</span> solvers
          </p>
          <Link
            href="/dashboard/authority/assign-solvers"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Assign Tasks</span>
          </Link>
        </div>

        {/* Solvers Grid */}
        {filteredSolvers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-12 text-center"
          >
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No solvers found</p>
            <p className="text-gray-400 mt-1">Try adjusting your filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSolvers.map((solver, index) => (
              <motion.div
                key={solver._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {solver.profilePicture ? (
                      <img
                        src={solver.profilePicture}
                        alt={solver.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {getInitials(solver.name)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{solver.name}</h3>
                      <p className="text-sm text-gray-500">{solver.email}</p>
                    </div>
                  </div>
                  <span className="text-2xl">{getRoleIcon(solver.role)}</span>
                </div>

                {/* Role Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadge(solver.role)}`}>
                    {getRoleLabel(solver.role)}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  {solver.organization && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🏢</span>
                      <span className="truncate">{solver.organization}</span>
                    </div>
                  )}
                  {solver.district && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📍</span>
                      <span>{solver.district}, {solver.division}</span>
                    </div>
                  )}
                  {solver.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📞</span>
                      <span>{solver.phone}</span>
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {solver.rating ? solver.rating.toFixed(1) : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {solver.completedTasks || 0}
                    </div>
                    <div className="text-xs text-gray-500">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
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

                {/* Status & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className={`flex items-center text-sm ${solver.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${solver.isActive ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                    {solver.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.location.href = `mailto:${solver.email}`}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Send email"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    {solver.phone && (
                      <button
                        onClick={() => window.location.href = `tel:${solver.phone}`}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Call"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Member Since */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Member since {new Date(solver.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
