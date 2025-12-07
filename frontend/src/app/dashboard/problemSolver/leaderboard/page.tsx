"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Target, Zap, Award, TrendingUp } from "lucide-react";
import LeaderboardTable from "@/components/solver/LeaderboardTable";

interface LeaderboardUser {
  id: string;
  name: string;
  district: string;
  points: number;
  completedTasks: number;
  rank: number;
  level: number;
  xp: number;
  xpRequired: number;
  streak: number;
  badges: string[];
}

const dummyLeaderboard: LeaderboardUser[] = [
  {
    id: "user_001",
    name: "Ahmed Khan",
    district: "Gazipur",
    points: 1250,
    completedTasks: 42,
    rank: 1,
    level: 8,
    xp: 750,
    xpRequired: 1000,
    streak: 5,
    badges: ["top_cleaner", "community_hero", "fast_finisher"]
  },
  {
    id: "user_002",
    name: "Fatima Begum",
    district: "Mirpur",
    points: 980,
    completedTasks: 35,
    rank: 2,
    level: 7,
    xp: 300,
    xpRequired: 800,
    streak: 3,
    badges: ["community_hero", "early_bird"]
  },
  {
    id: "user_003",
    name: "Rajesh Kumar",
    district: "Uttara",
    points: 720,
    completedTasks: 28,
    rank: 3,
    level: 6,
    xp: 600,
    xpRequired: 700,
    streak: 7,
    badges: ["fast_finisher", "weekend_warrior"]
  }
];

const currentUser = dummyLeaderboard[0];

export default function LeaderboardPage() {
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 bg-linear-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold"
          >
            <Trophy className="w-6 h-6" />
            <span>Your Rank: #{currentUser.rank}</span>
          </motion.div>
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
                <p className="text-3xl font-bold text-primary">{currentUser.streak}</p>
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
                <p className="text-3xl font-bold text-secondary">{currentUser.level}</p>
                <p className="text-xs text-gray-500 mt-1">XP: {currentUser.xp}/{currentUser.xpRequired}</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentUser.xp / currentUser.xpRequired) * 100}%` }}
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
                <p className="text-3xl font-bold text-accent">{currentUser.badges.length}</p>
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
                <p className="text-3xl font-bold text-blue-600">{currentUser.completedTasks}</p>
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
            <p className="text-sm text-gray-600 mt-1">Monthly leaderboard rankings</p>
          </div>
          <LeaderboardTable users={dummyLeaderboard} />
        </motion.div>
      </div>
    </div>
  );
}