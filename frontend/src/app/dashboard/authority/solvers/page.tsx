'use client';

import { useState, useEffect } from 'react';
import divisionsData from '@/data/divisionsData.json';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { userAPI } from '@/utils/api';
import Link from 'next/link';
import { FullPageLoading } from '@/components/common';
import Card from '@/components/common/Card';
import {
  Users,
  TrendingUp,
  Activity,
  Star,
  Award,
  MapPin,
  Mail,
  Phone,
  Building2,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  RefreshCw,
} from 'lucide-react';
import Image from 'next/image';

interface Solver {
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
  successRate?: number | string; // Updated to accept both number and string
  isActive: boolean;
  phone?: string;
  createdAt: string;
  points?: number;
  taskStats?: {
    total: number;
    completed: number;
    pending: number;
    rating: string | number;
    successRate: string; // This is always string according to your code
    status: string;
    isBusy: boolean;
  };
}

// Define API response type
interface SolversApiResponse {
  success: boolean;
  message?: string;
  users?: Solver[];
}

export default function SolversPage() {
  const { user: authUser } = useAuth();
  const [solvers, setSolvers] = useState<Solver[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'all' | 'problemSolver'>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('');
  const [filterDivision, setFilterDivision] = useState<string>(authUser?.division || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'completedTasks' | 'successRate' | 'createdAt'>('rating');

  useEffect(() => {
    if (authUser?.division || filterDivision) {
      fetchSolvers();
    }
  }, [authUser, filterDivision]);

  const fetchSolvers = async (showToast = true) => {
    try {
      setLoading(true);
      const divisionToUse = filterDivision || authUser?.division;
      const response = await userAPI.getSolvers({
        ...(divisionToUse ? { division: divisionToUse } : {}),
        limit: 100
      });

      // Type assertion for the response
      const solversResponse = response as SolversApiResponse;

      if (solversResponse.success) {
        const solversList = solversResponse.users || [];
        setSolvers(solversList);
        if (showToast) {
          toast.success(`Loaded ${solversList.length} solvers from ${authUser?.division}`);
        }
      } else {
        toast.error(solversResponse.message || 'Failed to load solvers');
      }
    } catch (error: unknown) {
      console.error('Error fetching solvers:', error);
      const message = error instanceof Error ? error.message : String(error ?? 'Failed to load problem solvers and NGOs');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchSolvers(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  // Get all districts for the selected division (authority's division or manual selection)
  let districts: string[] = [];
  // Normalize division names for robust matching (trim, lowercase, remove unicode spaces)
  const normalize = (str: string) => str.replace(/\s+/g, ' ').trim().toLowerCase();
  const activeDivision = filterDivision || authUser?.division || '';
  // Typed divisions array to satisfy TypeScript (avoid `any`)
  type District = { name: string; latitude?: number; longitude?: number };
  type Division = { division: string; latitude?: number; longitude?: number; districts: District[] };
  const divisions = divisionsData as Division[];
  if (activeDivision) {
    const userDivision = normalize(activeDivision);
    const divisionObj = divisions.find(d => normalize(d.division) === userDivision);
    if (divisionObj) {
      districts = divisionObj.districts.map((d) => d.name);
    }
  }


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
        case 'rating': {
          // Use the best available rating (taskStats.rating, rating, or 0)
          const getRating = (solver: Solver) => {
            // Check if taskStats exists and has rating
            if (solver.taskStats?.rating !== undefined) {
              const taskStatsRating = solver.taskStats.rating;
              if (typeof taskStatsRating === 'number') return taskStatsRating;
              if (!isNaN(Number(taskStatsRating))) return Number(taskStatsRating);
            }

            // Fall back to solver.rating
            if (solver.rating !== undefined) {
              if (typeof solver.rating === 'number') return solver.rating;
              if (!isNaN(Number(solver.rating))) return Number(solver.rating);
            }

            return 0;
          };
          return getRating(b) - getRating(a);
        }
        case 'completedTasks': {
          const aCompleted = a.taskStats?.completed ?? a.completedTasks ?? 0;
          const bCompleted = b.taskStats?.completed ?? b.completedTasks ?? 0;
          return bCompleted - aCompleted;
        }
        case 'successRate': {
          const getSuccess = (solver: Solver) => {
            // Handle taskStats success rate
            if (solver.taskStats?.successRate) {
              const taskStatsSuccess = solver.taskStats.successRate;
              if (typeof taskStatsSuccess === 'string') {
                return parseInt(taskStatsSuccess.replace('%', '')) || 0;
              }
            }

            // Handle solver success rate (can be number or string)
            if (solver.successRate) {
              if (typeof solver.successRate === 'string') {
                return parseInt(solver.successRate.replace('%', '')) || 0;
              }
              if (typeof solver.successRate === 'number') {
                return solver.successRate;
              }
            }

            return 0;
          };
          return getSuccess(b) - getSuccess(a);
        }
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return <FullPageLoading text="Loading solvers..." />;
  }

  return (
    <>
      <div className="space-y-4 xs:space-y-6 sm:space-y-8 px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 lg:py-8 bg-base-300 min-h-screen container mx-auto">
        {/* Welcome Section with Gradient Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-white rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 xs:p-6 sm:p-8 lg:p-12 border-t-4 border-accent flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4"
        >
          <div className="min-w-0">
            <h1 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-1.5 xs:mb-2 sm:mb-3">
              Problem Solvers & NGOs 👥
            </h1>
            <p className="text-white/90 text-xs xs:text-sm sm:text-lg font-semibold">
              Manage all problem solvers and NGOs in <span className="text-accent font-bold">{authUser?.division}</span> division
            </p>
          </div>
          <motion.button
            onClick={handleRefresh}
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="p-2 xs:p-2.5 sm:p-3 bg-white/20 hover:bg-white/30 rounded-lg xs:rounded-xl sm:rounded-2xl transition-all disabled:opacity-50 shrink-0"
            title="Refresh solvers"
          >
            <RefreshCw className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
          {[
            { title: 'Total Solvers', value: solvers.length, icon: Users, color: 'text-green-600', bgColor: 'bg-green-50' },
            { title: 'Problem Solvers', value: solvers.filter(s => s.role === 'problemSolver').length, icon: Star, color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { title: 'Active Members', value: solvers.filter(s => s.isActive).length, icon: Activity, color: 'text-purple-600', bgColor: 'bg-purple-50' },
            {
              title: 'Avg Rating', value: (solvers.reduce((sum, s) => {
                const rating = s.taskStats?.rating !== undefined
                  ? (typeof s.taskStats.rating === 'number' ? s.taskStats.rating : Number(s.taskStats.rating) || 0)
                  : s.rating || 0;
                return sum + rating;
              }, 0) / Math.max(solvers.length, 1)).toFixed(1), icon: TrendingUp, color: 'text-yellow-600', bgColor: 'bg-yellow-50'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border-2 border-accent/20 hover:scale-105 transition-transform`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] xs:text-xs sm:text-sm font-bold text-neutral/70 uppercase tracking-wide truncate">{stat.title}</p>
                    <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-extrabold text-info mt-1 xs:mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} bg-white/50 p-1.5 xs:p-2 sm:p-3 rounded-lg xs:rounded-xl shrink-0`}>
                    <Icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters Card */}
        <Card className="rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-t-4 border-secondary p-4 xs:p-5 sm:p-6 lg:p-8 space-y-4 xs:space-y-5 sm:space-y-6">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-info mb-4 xs:mb-5 sm:mb-6 flex items-center gap-2 xs:gap-3">
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-secondary rounded-lg flex items-center justify-center text-white">
              <Search className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
            </div>
            Search & Filter
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-xs xs:text-sm font-bold text-info mb-2 xs:mb-3 uppercase tracking-wide">
                🔍 Search Solvers
              </label>
              <input
                type="text"
                placeholder="Search by name, email, organization, or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral font-medium outline-none"
              />
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-xs xs:text-sm font-bold text-info mb-2 xs:mb-3 uppercase tracking-wide">
                Filter Type
              </label>
              <select
                aria-label="Filter by role"
                value={filterRole}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilterRole(val === 'problemSolver' ? 'problemSolver' : 'all');
                }}
                className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral font-medium outline-none "
              >
                <option value="all">All Types</option>
                <option value="problemSolver">💡 Problem Solvers</option>
              </select>
            </div>
          </div>

          {/* District Filter */}
          <div>
            <label className="block text-xs xs:text-sm font-bold text-info mb-2 xs:mb-3 uppercase tracking-wide">
              Filter by District
            </label>
            {/* Division Filter (optional) */}
            <div className="mb-3">
              <label className="block text-xs xs:text-sm font-bold text-info mb-2 xs:mb-3 uppercase tracking-wide">
                Filter by Division
              </label>
              <select
                aria-label="Filter by division"
                value={filterDivision}
                onChange={(e) => { setFilterDivision(e.target.value); setFilterDistrict(''); }}
                disabled={!!authUser?.division}
                className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral font-medium outline-none"
              >
                <option value="">All Divisions</option>
                {divisions.map((div) => (
                  <option key={div.division} value={div.division}>{div.division}</option>
                ))}
              </select>
            </div>

            <select
              aria-label="Filter by district"
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral font-medium outline-none"
            >
              <option value="">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-xs xs:text-sm font-bold text-info mb-2 xs:mb-3 uppercase tracking-wide">
              📊 Sort By
            </label>
            <div className="flex flex-wrap gap-2 xs:gap-3">
              {([
                { value: 'rating', label: '⭐ Highest Rating' },
                { value: 'completedTasks', label: '✅ Most Tasks' },
                { value: 'successRate', label: '🎯 Success Rate' },
                { value: 'createdAt', label: '🆕 Newest' }
              ] as { value: 'rating' | 'completedTasks' | 'successRate' | 'createdAt'; label: string }[]).map(option => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg text-[10px] xs:text-xs sm:text-sm font-bold transition-all transform ${sortBy === option.value
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-base-200 text-neutral hover:bg-base-300 scale-100'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Results Info */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4">
          <p className="text-xs xs:text-sm font-bold text-neutral/70 uppercase tracking-wide">
            📋 Showing <span className="text-info">{filteredSolvers.length}</span> of <span className="text-info">{solvers.length}</span> solvers
          </p>
          <Link
            href="/dashboard/authority/assign-task"
            className="px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-secondary text-white font-bold text-xs xs:text-sm sm:text-base rounded-lg xs:rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-1.5 xs:gap-2"
          >
            <Plus className="w-4 h-4 xs:w-5 xs:h-5" />
            <span>Assign Tasks</span>
          </Link>
        </div>

        {/* Solvers Grid */}
        {filteredSolvers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-base-100 rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-6 xs:p-8 sm:p-12 text-center border-2 border-accent/20"
          >
            <Users className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 text-neutral/30 mx-auto mb-3 xs:mb-4" />
            <p className="text-neutral/70 text-base xs:text-lg font-bold">No solvers found</p>
            <p className="text-neutral/50 mt-0.5 xs:mt-1 text-xs xs:text-sm">Try adjusting your filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
            {filteredSolvers.map((solver, index) => (
              <motion.div
                key={solver._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="bg-base-100 rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-2 border-accent/20 overflow-hidden hover:shadow-2xl transition-all p-4 xs:p-5 sm:p-6 lg:p-8"
              >
                {/* Header with Avatar */}
                <div className="flex items-start justify-between mb-4 xs:mb-5 sm:mb-6">
                  <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
                    {solver.profilePicture ? (
                      <Image
                        width={200}
                        height={200}
                        src={solver.profilePicture}
                        alt={solver.name}
                        className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 rounded-lg xs:rounded-xl sm:rounded-2xl object-cover border-2 border-accent/20"
                      />
                    ) : (
                      <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 rounded-lg xs:rounded-xl sm:rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm xs:text-base sm:text-xl border-2 border-accent/20">
                        {getInitials(solver.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-bold text-info text-sm xs:text-base sm:text-lg truncate">{solver.name}</h3>
                      <p className="text-[10px] xs:text-xs sm:text-sm text-neutral/60 truncate">{solver.email}</p>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="space-y-2 xs:space-y-3 mb-4 xs:mb-5 sm:mb-6 pb-4 xs:pb-5 sm:pb-6 border-b border-accent/10">
                  {solver.organization && (
                    <div className="flex items-center gap-2 xs:gap-3 text-neutral/70">
                      <Building2 className="w-3 h-3 xs:w-4 xs:h-4 shrink-0 text-secondary" />
                      <span className="text-xs xs:text-sm font-medium truncate">{solver.organization}</span>
                    </div>
                  )}
                  {solver.district && (
                    <div className="flex items-center gap-2 xs:gap-3 text-neutral/70">
                      <MapPin className="w-3 h-3 xs:w-4 xs:h-4 shrink-0 text-accent" />
                      <span className="text-xs xs:text-sm font-medium truncate">{solver.district}, {solver.division}</span>
                    </div>
                  )}
                  {solver.phone && (
                    <div className="flex items-center gap-2 xs:gap-3 text-neutral/70">
                      <Phone className="w-3 h-3 xs:w-4 xs:h-4 shrink-0 text-primary" />
                      <span className="text-xs xs:text-sm font-medium">{solver.phone}</span>
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 xs:gap-3 mb-4 xs:mb-5 sm:mb-6 p-2 xs:p-3 sm:p-4 bg-linear-to-br from-primary/5 to-secondary/5 rounded-lg xs:rounded-xl sm:rounded-2xl border border-primary/10">
                  <div className="text-center">
                    <div className="text-sm xs:text-base sm:text-lg font-bold text-info flex items-center justify-center gap-0.5 xs:gap-1">
                      <Star className="w-3 h-3 xs:w-4 xs:h-4 text-accent" />
                      {solver.taskStats?.rating || solver.rating || 'N/A'}
                    </div>
                    <div className="text-[8px] xs:text-[10px] sm:text-xs text-neutral/60 font-bold uppercase mt-0.5 xs:mt-1">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm xs:text-base sm:text-lg font-bold text-info">{solver.taskStats?.completed ?? solver.completedTasks ?? 0}</div>
                    <div className="text-[8px] xs:text-[10px] sm:text-xs text-neutral/60 font-bold uppercase mt-0.5 xs:mt-1">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm xs:text-base sm:text-lg font-bold text-info">{solver.taskStats?.successRate || `${solver.successRate || 0}%`}</div>
                    <div className="text-[8px] xs:text-[10px] sm:text-xs text-neutral/60 font-bold uppercase mt-0.5 xs:mt-1">Success</div>
                  </div>
                </div>

                {/* Points Badge */}
                <div className="mb-4 xs:mb-5 sm:mb-6 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-1.5 xs:py-2 bg-accent/20 text-accent rounded-full text-xs xs:text-sm font-bold border border-accent/40">
                    <Award className="w-3 h-3 xs:w-4 xs:h-4" />
                    {Number(solver.points || 0).toLocaleString()} Points
                  </span>
                </div>

                {/* Expertise Tags */}
                {solver.expertise && solver.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 xs:gap-2 mb-4 xs:mb-5 sm:mb-6">
                    {solver.expertise.slice(0, 2).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 xs:px-3 py-0.5 xs:py-1 bg-primary/20 text-primary text-[10px] xs:text-xs font-bold rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {solver.expertise.length > 2 && (
                      <span className="px-2 xs:px-3 py-0.5 xs:py-1 bg-neutral/20 text-neutral text-[10px] xs:text-xs font-bold rounded-full">
                        +{solver.expertise.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Status Bar */}
                <div className="flex items-center justify-between gap-2 xs:gap-3 mb-4 xs:mb-5 sm:mb-6 pb-4 xs:pb-5 sm:pb-6 border-b border-accent/10">
                  <div className="flex items-center gap-2 xs:gap-3">
                    {solver.isActive ? (
                      <span className="flex items-center gap-1 xs:gap-2 text-[10px] xs:text-xs sm:text-sm font-bold text-green-600 bg-green-50 px-2 xs:px-3 py-0.5 xs:py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 xs:gap-2 text-[10px] xs:text-xs sm:text-sm font-bold text-neutral/50 bg-neutral/10 px-2 xs:px-3 py-0.5 xs:py-1 rounded-full">
                        <AlertCircle className="w-3 h-3 xs:w-4 xs:h-4" />
                        Inactive
                      </span>
                    )}
                  </div>
                  <div>
                    <span className={`px-2 xs:px-3 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-bold ${solver.taskStats?.isBusy
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      : 'bg-green-100 text-green-800 border border-green-300'
                      }`}>
                      {solver.taskStats?.status || 'Free'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 xs:gap-2">
                  <button
                    onClick={() => window.location.href = `mailto:${solver.email}`}
                    className="flex-1 p-2 xs:p-2.5 sm:p-3 bg-secondary/20 text-secondary hover:bg-secondary hover:text-white rounded-lg xs:rounded-xl transition-all transform hover:scale-105 font-bold flex items-center justify-center gap-1 xs:gap-2"
                    title="Send email"
                  >
                    <Mail className="w-3 h-3 xs:w-4 xs:h-4" />
                    <span className="text-xs xs:text-sm">Email</span>
                  </button>
                  {solver.phone && (
                    <button
                      onClick={() => window.location.href = `tel:${solver.phone}`}
                      className="flex-1 p-2 xs:p-2.5 sm:p-3 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg xs:rounded-xl transition-all transform hover:scale-105 font-bold flex items-center justify-center gap-1 xs:gap-2"
                      title="Call"
                    >
                      <Phone className="w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="text-xs xs:text-sm">Call</span>
                    </button>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 xs:mt-5 sm:mt-6 pt-4 xs:pt-5 sm:pt-6 border-t border-accent/10">
                  <p className="text-[10px] xs:text-xs text-neutral/50 font-medium text-center">
                    Member since {new Date(solver.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}