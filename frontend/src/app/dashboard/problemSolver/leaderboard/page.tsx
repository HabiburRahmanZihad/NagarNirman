"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Target, Zap, Award, TrendingUp } from "lucide-react";
import LeaderboardTable from "@/components/solver/LeaderboardTable";
import RewardSummaryCard from "@/components/solver/RewardSummaryCard";

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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Leaderboard & Rewards</h1>
        <div className="flex items-center space-x-2 text-yellow-600">
          <Trophy className="w-6 h-6" />
          <span className="font-semibold">Rank #{currentUser.rank}</span>
        </div>
      </div>

      <RewardSummaryCard user={currentUser} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-4 shadow-md border"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-xl font-bold text-gray-800">{currentUser.streak} days</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-4 shadow-md border"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Level Progress</p>
              <p className="text-xl font-bold text-gray-800">Level {currentUser.level}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-4 shadow-md border"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Badges Earned</p>
              <p className="text-xl font-bold text-gray-800">{currentUser.badges.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-4 shadow-md border"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="w-6 h-6 text-orange-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Weekly Rank</p>
              <p className="text-xl font-bold text-gray-800">#1</p>
            </div>
          </div>
        </motion.div>
      </div>

      <LeaderboardTable users={dummyLeaderboard} />
    </div>
  );
}