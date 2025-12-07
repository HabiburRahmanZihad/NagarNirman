"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Target, Zap, Award, TrendingUp, Filter } from "lucide-react";
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
  const [sortBy, setSortBy] = useState<'points' | 'streak' | 'completed' | 'rating'>('points');
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-info mb-2">Leaderboard & Rewards</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Track your progress, earn badges, and climb the ranks
            </p>
          </div>
          {currentUser && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 bg-linear-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold"
            >
              <Trophy className="w-6 h-6" />
              <span>Top Rank: #{currentUser.rank}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-md border-t-4 border-primary hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-primary">{currentUser?.streak || 0}</p>
                <p className="text-xs text-gray-500 mt-1">days of consistency</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-md border-t-4 border-secondary hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Current Level</p>
                <p className="text-3xl font-bold text-secondary">{currentUser?.level || 1}</p>
                <p className="text-xs text-gray-500 mt-1">XP: {currentUser?.xp || 0}/{currentUser?.xpRequired || 1000}</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentUser ? (currentUser.xp / currentUser.xpRequired) * 100 : 0}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="bg-secondary h-2 rounded-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-md border-t-4 border-accent hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Badges Earned</p>
                <p className="text-3xl font-bold text-accent">{currentUser?.badges?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-1">achievements unlocked</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Award className="w-6 h-6 text-accent" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Tasks Completed</p>
                <p className="text-3xl font-bold text-blue-600">{currentUser?.completedTasks || 0}</p>
                <p className="text-xs text-gray-500 mt-1">total missions</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Leaderboard Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-primary"
        >
          <div className="p-6 bg-linear-to-r from-primary/5 to-secondary/5 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-info flex items-center gap-3">
              <Trophy className="w-6 h-6 text-primary" />
              Top Performers
            </h2>
            <p className="text-sm text-gray-600 mt-1">Problem Solvers ranked by points and completed tasks</p>
          </div>
          {leaderboard.length > 0 ? (
            <LeaderboardTable users={leaderboard} />
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No leaderboard data available</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}