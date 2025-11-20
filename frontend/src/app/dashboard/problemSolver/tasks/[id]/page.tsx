"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, AlertTriangle, User, Award } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import TaskDetails from "@/components/solver/TaskDetails";
import UpdateStatusButtons from "@/components/solver/UpdateStatusButtons";
import ProofUploadModal from "@/components/solver/ProofUploadModal";

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

const dummyTask: Task = {
  _id: "tsk_001",
  title: "Garbage accumulation in roadside drain",
  description: "Blocked drainage causing water overflow in residential area near market. The drain has been completely blocked by plastic waste and organic debris, leading to waterlogging during rains. This poses health risks and inconvenience to local residents.",
  location: { 
    division: "Dhaka", 
    district: "Gazipur",
    area: "Board Bazar"
  },
  severity: "high",
  images: [
    "https://images.unsplash.com/photo-1550147760-44c9966d6bc7?w=600",
    "https://images.unsplash.com/photo-1587132135056-6130359ab700?w=600"
  ],
  assignedDate: "2025-11-10T08:30:00Z",
  status: "pending",
  rewardPoints: 50,
  history: [
    { status: "pending", date: "2025-11-10" }
  ],
  assignedBy: "City Corporation Admin",
  address: "Road 12, Board Bazar, Near Local Market, Gazipur"
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task>(dummyTask);
  const [showProofModal, setShowProofModal] = useState(false);

  const updateTaskStatus = (newStatus: Task["status"]) => {
    setTask(prev => ({
      ...prev,
      status: newStatus,
      history: [...prev.history, { status: newStatus, date: new Date().toISOString().split('T')[0] }]
    }));
    
    if (newStatus === "completed") {
      setShowProofModal(true);
    }
  };

  const handleProofSubmit = async (proofData: { images: File[]; note: string }) => {
    // Dummy API call
    try {
      await fetch(`/api/tasks/${task._id}/proof`, {
        method: "POST",
        body: JSON.stringify(proofData),
      });
      setShowProofModal(false);
    } catch (error) {
      console.error("Failed to submit proof:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-green-700 hover:text-green-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tasks</span>
      </button>

      <TaskDetails task={task} />
      
      <UpdateStatusButtons 
        currentStatus={task.status} 
        onStatusUpdate={updateTaskStatus}
      />

      {showProofModal && (
        <ProofUploadModal
          task={task}
          onClose={() => setShowProofModal(false)}
          onSubmit={handleProofSubmit}
        />
      )}
    </div>
  );
}