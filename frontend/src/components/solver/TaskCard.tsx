"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, AlertTriangle, CheckCircle, Clock, ArrowRight, Star, Zap } from "lucide-react";
import Link from "next/link";

interface Task {
  _id: string;
  title: string;
  description: string;
  location: {
    division: string;
    district: string;
  };
  severity: "low" | "medium" | "high";
  images: string[];
  assignedDate: string;
  status: "pending" | "ongoing" | "completed";
  rewardPoints: number;
  history: {
    status: string;
    date: string;
  }[];
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
    icon: AlertTriangle,
    gradient: "from-green-400 to-green-500"
  },
  medium: { 
    color: "text-yellow-600", 
    bgColor: "bg-yellow-100", 
    borderColor: "border-yellow-200",
    icon: AlertTriangle,
    gradient: "from-yellow-400 to-yellow-500"
  },
  high: { 
    color: "text-red-600", 
    bgColor: "bg-red-100", 
    borderColor: "border-red-200",
    icon: AlertTriangle,
    gradient: "from-red-400 to-red-500"
  }
};

const statusConfig = {
  pending: { 
    color: "text-yellow-600", 
    bgColor: "bg-yellow-100", 
    label: "Ready", 
    icon: Clock,
    gradient: "from-yellow-400 to-yellow-500"
  },
  ongoing: { 
    color: "text-blue-600", 
    bgColor: "bg-blue-100", 
    label: "In Progress", 
    icon: Zap,
    gradient: "from-blue-400 to-blue-500"
  },
  completed: { 
    color: "text-green-600", 
    bgColor: "bg-green-100", 
    label: "Completed", 
    icon: CheckCircle,
    gradient: "from-green-400 to-green-500"
  }
};

export default function TaskCard({ task, onStatusUpdate }: TaskCardProps) {
  const SeverityIcon = severityConfig[task.severity].icon;
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

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      {/* Header Gradient Bar */}
      <div className={`h-2 bg-gradient-to-r ${severityConfig[task.severity].gradient}`}></div>
      
      <div className="p-5">
        {/* Header with Status and Severity */}
        <div className="flex justify-between items-start mb-4">
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${statusConfig[task.status].bgColor} ${statusConfig[task.status].color} border ${statusConfig[task.status].gradient.replace('from-', 'border-').replace('to-', 'border-')} border-opacity-20`}>
            <StatusIcon className="w-4 h-4 mr-1.5" />
            {statusConfig[task.status].label}
          </div>
          
          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${severityConfig[task.severity].bgColor} ${severityConfig[task.severity].color} border ${severityConfig[task.severity].borderColor}`}>
            <SeverityIcon className="w-3 h-3 mr-1" />
            {task.severity.charAt(0).toUpperCase() + task.severity.slice(1)}
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
            <div className="p-1.5 bg-green-50 rounded-lg mr-2">
              <MapPin className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-medium">{task.location.district}</span>
            <span className="text-gray-400 mx-1">•</span>
            <span className="text-gray-500">{task.location.division}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="p-1.5 bg-blue-50 rounded-lg mr-2">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <span>Assigned {formatDate(task.assignedDate)}</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-gray-500">{getTimeAgo(task.assignedDate)}</span>
          </div>
        </div>

        {/* Progress Bar for Ongoing Tasks */}
        {task.status === 'ongoing' && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Footer with Points and Action */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 blur-sm opacity-50 rounded-full"></div>
              <div className="relative flex items-center space-x-1 bg-gradient-to-br from-yellow-400 to-yellow-500 px-3 py-1.5 rounded-full text-white font-bold text-sm">
                <Star className="w-4 h-4" />
                <span>{task.rewardPoints}</span>
              </div>
            </div>
            <span className="text-xs text-gray-500 font-medium">points</span>
          </div>
          
          <Link 
            href={`/dashboard/solver/tasks/${task._id}`}
            className="group flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            <span>View Mission</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Hover Effect Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}