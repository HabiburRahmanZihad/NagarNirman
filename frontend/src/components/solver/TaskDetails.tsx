"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, AlertTriangle, User, Award, Clock } from "lucide-react";

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
  low: { color: "text-green-600", bgColor: "bg-green-100", label: "Low" },
  medium: { color: "text-yellow-600", bgColor: "bg-yellow-100", label: "Medium" },
  high: { color: "text-red-600", bgColor: "bg-red-100", label: "High" }
};

const statusConfig = {
  pending: { color: "text-yellow-600", bgColor: "bg-yellow-100", label: "Pending" },
  ongoing: { color: "text-blue-600", bgColor: "bg-blue-100", label: "Ongoing" },
  completed: { color: "text-green-600", bgColor: "bg-green-100", label: "Completed" }
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
    >
      <div className="h-2 bg-gradient-to-r from-green-600 to-green-400"></div>
      
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{task.title}</h1>
            <p className="text-gray-600">{task.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[task.status].bgColor} ${statusConfig[task.status].color}`}>
              {statusConfig[task.status].label}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${severityConfig[task.severity].bgColor} ${severityConfig[task.severity].color}`}>
              <AlertTriangle className="w-4 h-4 mr-1" />
              {severityConfig[task.severity].label} Severity
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              <Award className="w-4 h-4 mr-1" />
              {task.rewardPoints} Points
            </span>
          </div>
        </div>

        {/* Task Images */}
        {task.images.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Issue Photos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {task.images.map((image, index) => (
                <motion.img
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  src={image}
                  alt={`Task image ${index + 1}`}
                  className="rounded-lg shadow-sm w-full h-48 object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* Task Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-green-700 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800">Location Details</h4>
                <p className="text-gray-600">{task.address}</p>
                <p className="text-sm text-gray-500">
                  {task.location.area}, {task.location.district}, {task.location.division}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-green-700 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800">Assigned By</h4>
                <p className="text-gray-600">{task.assignedBy}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-green-700 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800">Assigned Date</h4>
                <p className="text-gray-600">{formatDate(task.assignedDate)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Award className="w-5 h-5 text-green-700 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800">Reward Points</h4>
                <p className="text-gray-600">{task.rewardPoints} points upon completion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Timeline */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Task Timeline</h3>
          <div className="space-y-3">
            {task.history.map((historyItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className={`w-3 h-3 rounded-full ${
                  historyItem.status === 'pending' ? 'bg-yellow-400' :
                  historyItem.status === 'ongoing' ? 'bg-blue-400' : 'bg-green-400'
                }`} />
                <div className="flex-1">
                  <span className="font-medium text-gray-800 capitalize">{historyItem.status}</span>
                  <span className="text-gray-500 text-sm ml-2">{historyItem.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}