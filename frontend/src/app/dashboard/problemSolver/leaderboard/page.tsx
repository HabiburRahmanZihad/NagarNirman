"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Trophy, Target, Zap, Award, TrendingUp } from "lucide-react";
import LeaderboardTable from "@/components/solver/LeaderboardTable";
import { leaderboardAPI } from "@/utils/api";
import toast from "react-hot-toast";

interface LeaderboardUser {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  district: string;
  points: number;
  completedTasks: number;
  ongoingTasks: number;
  totalTasks: number;
  totalRating: number;
  rank: number;
  level: number;
  xp: number;
  xpRequired: number;
  streak: number;
  badges: string[];
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy] = useState<'points' | 'streak' | 'completed' | 'rating'>('points');
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await leaderboardAPI.getFiltered({
        page: 1,
        limit: 100,
        sortBy
      });

      if (response.success) {
        const data = response.data.leaderboard;
        setLeaderboard(data);
        // Set first user as current user (for display purposes)
        if (data.length > 0) {
          setCurrentUser(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-4 xs:py-6 sm:py-8 px-3 xs:px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 xs:w-12 xs:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3 xs:mb-4"></div>
          <p className="text-gray-600 font-semibold text-sm xs:text-base">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-4 xs:py-6 sm:py-8 px-3 xs:px-4">
      <div className="max-w-7xl mx-auto space-y-4 xs:space-y-6 sm:space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 xs:gap-6 mb-4 xs:mb-6 sm:mb-8"
        >
          <div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-info mb-1 xs:mb-2">Leaderboard & Rewards</h1>
            <p className="text-gray-600 flex items-center gap-1.5 xs:gap-2 text-sm xs:text-base">
              <Target className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
              Track your progress, earn badges, and climb the ranks
            </p>
          </div>
          {currentUser && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 xs:space-x-3 bg-linear-to-r from-yellow-400 to-amber-500 text-white px-4 xs:px-6 py-2 xs:py-3 rounded-lg xs:rounded-xl shadow-lg font-bold text-sm xs:text-base"
            >
              <Trophy className="w-5 h-5 xs:w-6 xs:h-6" />
              <span>Top Rank: #{currentUser.rank}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-6 shadow-md border-t-4 border-primary hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-semibold mb-0.5 xs:mb-1">Current Streak</p>
                <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary">{currentUser?.streak || 0}</p>
                <p className="text-[10px] xs:text-xs text-gray-500 mt-0.5 xs:mt-1">days of consistency</p>
              </div>
              <div className="p-2 xs:p-3 bg-primary/10 rounded-md xs:rounded-lg">
                <Zap className="w-4 h-4 xs:w-5 sm:w-6 xs:h-5 sm:h-6 text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-6 shadow-md border-t-4 border-secondary hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-semibold mb-0.5 xs:mb-1">Current Level</p>
                <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-secondary">{currentUser?.level || 1}</p>
                <p className="text-[10px] xs:text-xs text-gray-500 mt-0.5 xs:mt-1">XP: {currentUser?.xp || 0}/{currentUser?.xpRequired || 1000}</p>
              </div>
              <div className="p-2 xs:p-3 bg-secondary/10 rounded-md xs:rounded-lg">
                <TrendingUp className="w-4 h-4 xs:w-5 sm:w-6 xs:h-5 sm:h-6 text-secondary" />
              </div>
            </div>
            <div className="mt-2 xs:mt-3 bg-gray-200 rounded-full h-1.5 xs:h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentUser ? (currentUser.xp / currentUser.xpRequired) * 100 : 0}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="bg-secondary h-1.5 xs:h-2 rounded-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-6 shadow-md border-t-4 border-accent hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-semibold mb-0.5 xs:mb-1">Badges Earned</p>
                <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-accent">{currentUser?.badges?.length || 0}</p>
                <p className="text-[10px] xs:text-xs text-gray-500 mt-0.5 xs:mt-1">achievements unlocked</p>
              </div>
              <div className="p-2 xs:p-3 bg-accent/10 rounded-md xs:rounded-lg">
                <Award className="w-4 h-4 xs:w-5 sm:w-6 xs:h-5 sm:h-6 text-accent" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-6 shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-semibold mb-0.5 xs:mb-1">Tasks Completed</p>
                <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-blue-600">{currentUser?.completedTasks || 0}</p>
                <p className="text-[10px] xs:text-xs text-gray-500 mt-0.5 xs:mt-1">total missions</p>
              </div>
              <div className="p-2 xs:p-3 bg-blue-100 rounded-md xs:rounded-lg">
                <Target className="w-4 h-4 xs:w-5 sm:w-6 xs:h-5 sm:h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Leaderboard Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl xs:rounded-2xl shadow-lg overflow-hidden border-t-4 border-primary"
        >
          <div className="p-4 xs:p-5 sm:p-6 bg-linear-to-r from-primary/5 to-secondary/5 border-b border-gray-100">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-info flex items-center gap-2 xs:gap-3">
              <Trophy className="w-5 h-5 xs:w-6 xs:h-6 text-primary" />
              Top Performers
            </h2>
            <p className="text-xs xs:text-sm text-gray-600 mt-1">Problem Solvers ranked by points and completed tasks</p>
          </div>
          {leaderboard.length > 0 ? (
            <LeaderboardTable users={leaderboard} />
          ) : (
            <div className="p-6 xs:p-8 text-center">
              <p className="text-gray-500 text-sm xs:text-base">No leaderboard data available</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}