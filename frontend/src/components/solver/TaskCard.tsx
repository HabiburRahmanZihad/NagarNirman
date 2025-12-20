"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, AlertTriangle, CheckCircle, Clock, ArrowRight, Star, Zap } from "lucide-react";
import Link from "next/link";

interface Task {
  _id: string;
  title: string;
  description: string;
  report?: {
    location?: {
      division?: string;
      district?: string;
      address?: string;
    };
    images?: string[];
    severity?: "low" | "medium" | "high";
  };
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "verified";
  assignedTo: string;
  assignedBy: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  proof?: {
    images?: string[];
    description?: string;
    submittedAt?: string;
  };
}

interface TaskCardProps {
  task: Task;
  onStatusUpdate: (taskId: string, newStatus: Task["status"]) => void;
}

const severityConfig = {
  low: {
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    headerBg: "from-green-400 to-green-500",
    headerColor: "from-green-500 to-green-600",
    lightBg: "bg-green-50"
  },
  medium: {
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    headerBg: "from-yellow-400 to-yellow-500",
    headerColor: "from-yellow-500 to-yellow-600",
    lightBg: "bg-yellow-50"
  },
  high: {
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    headerBg: "from-red-400 to-red-500",
    headerColor: "from-red-500 to-red-600",
    lightBg: "bg-red-50"
  }
};

const statusConfig = {
  pending: {
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    label: "Pending",
    icon: Clock,
  },
  "in-progress": {
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    label: "In Progress",
    icon: Zap,
  },
  completed: {
    color: "text-green-600",
    bgColor: "bg-green-100",
    label: "Completed",
    icon: CheckCircle,
  },
  verified: {
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    label: "Verified",
    icon: CheckCircle,
  }
};

export default function TaskCard({ task, onStatusUpdate }: TaskCardProps) {
  const severity = task.priority || task.report?.severity || 'medium';
  const StatusIcon = statusConfig[task.status].icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  // Calculate reward points based on priority
  const rewardPoints = severity === 'high' ? 50 : severity === 'medium' ? 30 : 20;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Header Gradient Bar - Same color as details page */}
      <div className={`h-1.5 bg-linear-to-r ${severityConfig[severity].headerBg}`}></div>

      <div className="p-5">
        {/* Header with Status and Severity */}
        <div className="flex justify-between items-start mb-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[task.status].bgColor} ${statusConfig[task.status].color}`}>
            <StatusIcon className="w-3 h-3 mr-1.5" />
            {statusConfig[task.status].label}
          </div>

          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${severityConfig[severity].bgColor} ${severityConfig[severity].color}`}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </div>
        </div>

        {/* Task Title and Description */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
            {task.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {task.description}
          </p>
        </div>

        {/* Location and Date */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-green-600 mr-2 shrink-0" />
            <span className="font-medium">{task.report?.location?.district || 'Unknown'}</span>
            <span className="text-gray-400 mx-1">•</span>
            <span className="text-gray-500">{task.report?.location?.division || 'N/A'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
            <span>Assigned {formatDate(task.createdAt)}</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-gray-500">{getTimeAgo(task.createdAt)}</span>
          </div>
        </div>

        {/* Progress Bar for In-Progress Tasks */}
        {task.status === 'in-progress' && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-linear-to-r from-blue-400 to-blue-500 h-1.5 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Footer with Points and Action */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-linear-to-br from-yellow-400 to-yellow-500 px-2.5 py-1 rounded-full text-white font-bold text-sm">
              <Star className="w-3 h-3" />
              <span>{rewardPoints}</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">points</span>
          </div>

          <Link
            href={`/dashboard/problemSolver/tasks/${task._id}`}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}