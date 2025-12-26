"use client";

import { motion } from "framer-motion";
import { MapPin, AlertTriangle, User, Award, Clock, Navigation, Clock3, CheckCircle2, Image as ImageIcon } from "lucide-react";
import Button from '@/components/common/Button';
import Image from "next/image";

interface Task {
  _id: string;
  title: string;
  description: string;
  location: {
    division: string;
    district: string;
    area: string;
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
  assignedBy: string;
  address: string;
}

interface TaskDetailsProps {
  task: Task;
}

const severityConfig = {
  low: {
    color: "text-green-600",
    bgColor: "bg-green-100",
    label: "Low",
    headerBg: "from-green-500 to-green-600",
    lightBg: "bg-green-50",
    borderColor: "border-green-200"
  },
  medium: {
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    label: "Medium",
    headerBg: "from-yellow-500 to-yellow-600",
    lightBg: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  high: {
    color: "text-red-600",
    bgColor: "bg-red-100",
    label: "High",
    headerBg: "from-red-500 to-red-600",
    lightBg: "bg-red-50",
    borderColor: "border-red-200"
  }
};

const statusConfig = {
  pending: { color: "text-yellow-600", bgColor: "bg-yellow-100", label: "Ready to Start", icon: Clock },
  ongoing: { color: "text-blue-600", bgColor: "bg-blue-100", label: "In Progress", icon: Clock3 },
  completed: { color: "text-green-600", bgColor: "bg-green-100", label: "Completed", icon: CheckCircle2 }
};

const StatusIcon = ({ status }: { status: keyof typeof statusConfig }) => {
  const IconComponent = statusConfig[status].icon;
  return IconComponent ? <IconComponent className="w-4 h-4 mr-2" /> : null;
};

export default function TaskDetails({ task }: TaskDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeFromNow = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
    >
      {/* Header with Gradient - Same color as task card top border */}
      <div className={`bg-linear-to-r ${severityConfig[task.severity].headerBg} px-6 py-8 text-white`}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm">
                <AlertTriangle className="w-4 h-4 mr-1.5" />
                {severityConfig[task.severity].label} Priority
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm">
                <Award className="w-4 h-4 mr-1.5" />
                {task.rewardPoints} Reward Points
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">{task.title}</h1>
            <p className="text-white/90 text-lg leading-relaxed">{task.description}</p>
          </div>

          <div className="shrink-0">
            <div className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-white/20 backdrop-blur-sm border border-white/30">
              <StatusIcon status={task.status} />
              {statusConfig[task.status].label}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Task Images Gallery */}
        {task.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center mb-4">
              <ImageIcon className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-bold text-gray-800 text-lg">Issue Photos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {task.images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="group relative rounded-xl overflow-hidden shadow-md border border-gray-200"
                >
                  <Image
                    fill
                    src={image}
                    alt={`Task image ${index + 1}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Task Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`rounded-xl p-5 border ${severityConfig[task.severity].borderColor} ${severityConfig[task.severity].lightBg}`}
            >
              <div className="flex items-center mb-4">
                <Navigation className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-bold text-gray-800 text-lg">Location Details</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{task.address}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {task.location.area}, {task.location.district}, {task.location.division}
                    </p>
                  </div>
                </div>
                <Button variant="primary" size="md" fullWidth iconPosition="right" className="mt-3">
                  Open in Maps
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-bold text-gray-800 text-lg">Assignment Info</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Assigned By</p>
                  <p className="font-semibold text-gray-800">{task.assignedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Assignment Date</p>
                  <p className="font-semibold text-gray-800 text-sm">{formatDate(task.assignedDate)}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-100"
            >
              <div className="flex items-center mb-4">
                <Award className="w-5 h-5 text-yellow-600 mr-2" />
                <h4 className="font-bold text-gray-800 text-lg">Reward Details</h4>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{task.rewardPoints}</div>
                <p className="text-gray-600 text-sm mb-3">Points upon verification</p>
                <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-800">
                    {task.status === "completed"
                      ? "Points have been awarded for this completed task"
                      : "Points will be awarded after admin verification of your submitted proof"
                    }
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className={`rounded-xl p-5 border ${severityConfig[task.severity].borderColor} ${severityConfig[task.severity].lightBg}`}
            >
              <div className="flex items-center mb-4">
                <AlertTriangle className={`w-5 h-5 ${severityConfig[task.severity].color} mr-2`} />
                <h4 className="font-bold text-gray-800 text-lg">Priority Information</h4>
              </div>
              <div className="space-y-3">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${severityConfig[task.severity].bgColor} ${severityConfig[task.severity].color} font-semibold`}>
                  {severityConfig[task.severity].label} Priority
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {task.severity === 'high' && 'This is a critical issue requiring immediate attention and should be resolved as soon as possible.'}
                  {task.severity === 'medium' && 'This issue should be addressed within the next few days to prevent escalation.'}
                  {task.severity === 'low' && 'This issue can be addressed when convenient, but should be completed within the assigned timeframe.'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Task Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="font-bold text-gray-800 text-lg">Task Timeline</h3>
          </div>
          <div className="space-y-3">
            {task.history.map((historyItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="flex flex-col items-center pt-0.5">
                  <div className={`w-3 h-3 rounded-full ${historyItem.status === 'pending' ? 'bg-yellow-400' :
                      historyItem.status === 'ongoing' ? 'bg-blue-400' : 'bg-green-400'
                    }`} />
                  {index < task.history.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-gray-800 capitalize text-sm">{historyItem.status}</span>
                      <p className="text-gray-500 text-xs mt-0.5">{getTimeFromNow(historyItem.date)}</p>
                    </div>
                    <span className="text-xs text-gray-400">{historyItem.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}