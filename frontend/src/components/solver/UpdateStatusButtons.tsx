"use client";

import { motion } from "framer-motion";
import { Play, CheckCircle, Clock } from "lucide-react";

interface UpdateStatusButtonsProps {
  currentStatus: "pending" | "ongoing" | "completed";
  onStatusUpdate: (newStatus: "pending" | "ongoing" | "completed") => void;
}

export default function UpdateStatusButtons({ currentStatus, onStatusUpdate }: UpdateStatusButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
    >
      <h3 className="font-semibold text-gray-800 mb-4">Update Task Status</h3>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {currentStatus === "pending" && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStatusUpdate("ongoing")}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Task
          </motion.button>
        )}

        {currentStatus === "ongoing" && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStatusUpdate("completed")}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Mark as Completed
          </motion.button>
        )}

        {(currentStatus === "pending" || currentStatus === "ongoing") && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStatusUpdate(currentStatus === "pending" ? "ongoing" : "completed")}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Clock className="w-5 h-5 mr-2" />
            Save Progress
          </motion.button>
        )}

        {currentStatus === "completed" && (
          <div className="flex items-center text-green-700 font-medium">
            <CheckCircle className="w-5 h-5 mr-2" />
            Task Completed
          </div>
        )}
      </div>
    </motion.div>
  );
}