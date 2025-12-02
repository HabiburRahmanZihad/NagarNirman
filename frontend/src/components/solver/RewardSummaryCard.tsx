"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Target, Zap, Award, TrendingUp } from "lucide-react";

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

interface RewardSummaryCardProps {
  user: LeaderboardUser;
}

const badgeConfig = {
  top_cleaner: { label: "Top Cleaner", color: "bg-yellow-100 text-yellow-800", icon: Trophy },
  community_hero: { label: "Community Hero", color: "bg-purple-100 text-purple-800", icon: Award },
  fast_finisher: { label: "Fast Finisher", color: "bg-green-100 text-green-800", icon: Zap },
  early_bird: { label: "Early Bird", color: "bg-blue-100 text-blue-800", icon: TrendingUp },
  weekend_warrior: { label: "Weekend Warrior", color: "bg-orange-100 text-orange-800", icon: Target }
};

export default function RewardSummaryCard({ user }: RewardSummaryCardProps) {
  const xpPercentage = (user.xp / user.xpRequired) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-linear-to-br from-green-600 to-green-700 rounded-2xl shadow-xl text-white p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Your Progress</h2>
              <p className="text-green-100">Ranked #{user.rank} in your area</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-green-200 text-sm">Total Points</p>
              <p className="text-2xl font-bold">{user.points}</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">Tasks Completed</p>
              <p className="text-2xl font-bold">{user.completedTasks}</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">Current Level</p>
              <p className="text-2xl font-bold">{user.level}</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">Daily Streak</p>
              <p className="text-2xl font-bold">{user.streak} days</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-green-100">Level Progress</span>
              <span className="text-green-100">{xpPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-green-800 bg-opacity-50 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-white h-3 rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs text-green-200 mt-1">
              <span>{user.xp} XP</span>
              <span>{user.xpRequired} XP for next level</span>
            </div>
          </div>

          {/* Badges */}
          <div>
            <p className="text-green-200 text-sm mb-2">Achievement Badges</p>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge, index) => {
                const config = badgeConfig[badge as keyof typeof badgeConfig];
                const Icon = config?.icon || Award;
                return (
                  <motion.span
                    key={badge}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-800'}`}
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {config?.label || badge}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}