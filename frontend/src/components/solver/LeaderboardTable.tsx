"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Medal, Crown } from "lucide-react";

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

interface LeaderboardTableProps {
  users: LeaderboardUser[];
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="text-sm font-semibold">{rank}</span>;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-50 border-yellow-200";
    case 2:
      return "bg-gray-50 border-gray-200";
    case 3:
      return "bg-amber-50 border-amber-200";
    default:
      return "bg-white border-gray-200";
  }
};

export default function LeaderboardTable({ users }: LeaderboardTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Top Cleaners</h2>
        <p className="text-gray-600">Community leaderboard based on completed tasks and points</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cleaner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                District
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tasks
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`hover:bg-gray-50 transition-colors ${getRankColor(user.rank)}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border">
                      {getRankIcon(user.rank)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="shrink-0 w-10 h-10 bg-linear-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        <span>Level {user.level}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.district}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-32">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Level {user.level}</span>
                      <span>{Math.round((user.xp / user.xpRequired) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(user.xp / user.xpRequired) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        className="bg-linear-to-r from-green-500 to-green-600 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1 text-sm font-semibold text-gray-900">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{user.points.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.completedTasks} tasks</div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}