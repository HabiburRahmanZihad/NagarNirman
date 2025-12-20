"use client";

import { motion } from "framer-motion";
import { Play, CheckCircle, Clock, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

interface UpdateStatusButtonsProps {
  currentStatus: "pending" | "ongoing" | "completed";
  onStatusUpdate: (newStatus: "pending" | "ongoing" | "completed") => void;
}

export default function UpdateStatusButtons({ currentStatus, onStatusUpdate }: UpdateStatusButtonsProps) {
  const handleSaveProgress = () => {
    toast.success("Progress saved!", {
      duration: 3000,
      position: "top-right",
    });
  };

  // If task is completed, show only completion message
  if (currentStatus === "completed") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Task Status</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-green-600">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-semibold">Task Completed</p>
              <p className="text-sm text-gray-600">This task has been successfully completed.</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            No further actions required
          </div>
        </div>
      </motion.div>
    );
  }

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
            onClick={handleSaveProgress}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Clock className="w-5 h-5 mr-2" />
            Save Progress
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}