'use client';

import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, Clock, Target, Users, Award } from 'lucide-react';

interface AnalyticsKPIProps {
  totalReports: number;
  completedReports: number;
  ongoingReports: number;
  averageResolutionTime: number;
  completionRate: number;
}

const AnalyticsKPI = ({ totalReports, completedReports, ongoingReports, averageResolutionTime, completionRate }: AnalyticsKPIProps) => {
  const kpis = [
    {
      label: 'Total Reports',
      value: totalReports.toLocaleString(),
      icon: TrendingUp,
      color: 'from-[#2563eb] to-[#1d4ed8]',
      iconColor: 'text-blue-600',
      bgColor: 'bg-linear-to-br from-blue-50 to-indigo-50',
      trend: '+12%',
      description: 'From last month'
    },
    {
      label: 'Completed',
      value: completedReports.toLocaleString(),
      icon: CheckCircle,
      color: 'from-[#059669] to-[#047857]',
      iconColor: 'text-green-600',
      bgColor: 'bg-linear-to-br from-green-50 to-emerald-50',
      trend: '+8%',
      description: 'Resolution rate'
    },
    {
      label: 'In Progress',
      value: ongoingReports.toLocaleString(),
      icon: Clock,
      color: 'from-[#f59e0b] to-[#d97706]',
      iconColor: 'text-amber-600',
      bgColor: 'bg-linear-to-br from-amber-50 to-orange-50',
      trend: '+5%',
      description: 'Active tasks'
    },
    {
      label: 'Completion Rate',
      value: `${completionRate.toFixed(1)}%`,
      icon: Target,
      color: 'from-[#7c3aed] to-[#6d28d9]',
      iconColor: 'text-purple-600',
      bgColor: 'bg-linear-to-br from-purple-50 to-violet-50',
      trend: '+3.2%',
      description: 'Overall efficiency'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-linear-to-r from-[#2a7d2f] to-[#2563eb] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{kpi.label}</p>
                <motion.p
                  className="text-3xl font-bold text-gray-900 mt-2"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                >
                  {kpi.value}
                </motion.p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs font-medium ${kpi.iconColor} bg-white px-2 py-1 rounded-full border`}>
                    {kpi.trend}
                  </span>
                  <span className="text-xs text-gray-500">{kpi.description}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-linear-to-br ${kpi.color} shadow-lg`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-2 rounded-full bg-linear-to-r ${kpi.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (index * 25) + 60)}%` }}
                  transition={{ duration: 1.5, delay: index * 0.1 + 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnalyticsKPI;