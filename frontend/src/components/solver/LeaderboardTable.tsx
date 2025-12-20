"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Medal, Crown } from "lucide-react";

interface LeaderboardUser {
  _id?: string;
  id?: string;
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
  totalRating?: number;
}

interface LeaderboardTableProps {
  users: LeaderboardUser[];
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-4 h-4 xs:w-5 xs:h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />;
    case 3:
      return <Medal className="w-4 h-4 xs:w-5 xs:h-5 text-amber-600" />;
    default:
      return <span className="text-xs xs:text-sm font-semibold">{rank}</span>;
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
      <div className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4 border-b border-gray-200">
        <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800">Top Cleaners</h2>
        <p className="text-xs xs:text-sm text-gray-600">Community leaderboard based on completed tasks and points</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] xs:min-w-[700px] sm:min-w-0">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cleaner
              </th>
              <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                District
              </th>
              <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Progress
              </th>
              <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tasks
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <motion.tr
                key={user._id || user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`hover:bg-gray-50 transition-colors ${getRankColor(user.rank)}`}
              >
                <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1 xs:space-x-2">
                    <div className="flex items-center justify-center w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-white border">
                      {getRankIcon(user.rank)}
                    </div>
                  </div>
                </td>
                <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2 xs:space-x-3">
                    <div className="shrink-0 w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-linear-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-xs xs:text-sm sm:text-base">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 text-xs xs:text-sm sm:text-base truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[150px] md:max-w-none">{user.name}</div>
                      <div className="flex items-center space-x-1 text-[10px] xs:text-xs sm:text-sm text-gray-500">
                        <Trophy className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-yellow-500" />
                        <span>Level {user.level}</span>
                      </div>
                      {/* Show district on mobile under name */}
                      <div className="sm:hidden text-[10px] xs:text-xs text-gray-500 truncate max-w-[80px] xs:max-w-[100px]">{user.district}</div>
                    </div>
                  </div>
                </td>
                <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-xs sm:text-sm text-gray-900 truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">{user.district}</div>
                </td>
                <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="w-20 sm:w-24 md:w-32">
                    <div className="flex justify-between text-[10px] xs:text-xs text-gray-600 mb-0.5 xs:mb-1">
                      <span>Level {user.level}</span>
                      <span>{Math.round((user.xp / user.xpRequired) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 xs:h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(user.xp / user.xpRequired) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        className="bg-linear-to-r from-green-500 to-green-600 h-1.5 xs:h-2 rounded-full"
                      />
                    </div>
                  </div>
                </td>
                <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-0.5 xs:space-x-1 text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900">
                    <Star className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
                    <span>{user.points.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-[10px] xs:text-xs sm:text-sm text-gray-900">{user.completedTasks} <span className="hidden xs:inline">tasks</span></div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}