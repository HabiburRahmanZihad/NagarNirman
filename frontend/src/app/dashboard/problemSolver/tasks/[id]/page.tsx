"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import TaskDetails from "@/components/solver/TaskDetails";
import UpdateStatusButtons from "@/components/solver/UpdateStatusButtons";
import ProofUploadModal from "@/components/solver/ProofUploadModal";
import toast from "react-hot-toast";

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

const dummyTasks: { [key: string]: Task } = {
  "tsk_001": {
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
  },
  "tsk_002": {
    _id: "tsk_002",
    title: "Plastic waste in public park",
    description: "Large amount of plastic bottles and wrappers scattered across children's play area. This creates environmental hazards and safety risks for children playing in the park.",
    location: { 
      division: "Dhaka", 
      district: "Mirpur",
      area: "Section 11"
    },
    severity: "medium",
    images: [
      "https://images.unsplash.com/photo-1587132135056-6130359ab700?w=600",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600"
    ],
    assignedDate: "2025-11-09T14:20:00Z",
    status: "ongoing",
    rewardPoints: 30,
    history: [
      { status: "pending", date: "2025-11-09" },
      { status: "ongoing", date: "2025-11-10" }
    ],
    assignedBy: "City Corporation Admin",
    address: "Mirpur Section 11 Park, Near Playground"
  },
  "tsk_003": {
    _id: "tsk_003",
    title: "Abandoned furniture on sidewalk",
    description: "Old sofa and chairs blocking pedestrian pathway near school. This creates obstacles for students and local residents, especially during peak hours.",
    location: { 
      division: "Dhaka", 
      district: "Uttara",
      area: "Sector 7"
    },
    severity: "low",
    images: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600",
      "https://images.unsplash.com/photo-1550147760-44c9966d6bc7?w=600"
    ],
    assignedDate: "2025-11-08T09:15:00Z",
    status: "completed",
    rewardPoints: 20,
    history: [
      { status: "pending", date: "2025-11-08" },
      { status: "ongoing", date: "2025-11-09" },
      { status: "completed", date: "2025-11-10" }
    ],
    assignedBy: "City Corporation Admin",
    address: "Road 8, Uttara Sector 7, Near School Gate"
  }
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task>(dummyTasks[taskId] || dummyTasks["tsk_001"]);
  const [showProofModal, setShowProofModal] = useState(false);

  const updateTaskStatus = (newStatus: Task["status"]) => {
    // If task is already completed, don't allow status changes
    if (task.status === "completed") {
      toast.error("This task is already completed and cannot be modified.");
      return;
    }

    if (newStatus === "completed") {
      // Show modal first, don't update status yet
      setShowProofModal(true);
    } else {
      // For other status updates (pending -> ongoing)
      setTask(prev => ({
        ...prev,
        status: newStatus,
        history: [...prev.history, { status: newStatus, date: new Date().toISOString().split('T')[0] }]
      }));
      
      if (newStatus === "ongoing") {
        toast.success("Mission Started! 🚀");
      }
    }
  };

  const handleProofSubmit = async (proofData: { images: File[]; note: string }) => {
    try {
      // First update task status to completed
      setTask(prev => ({
        ...prev,
        status: "completed",
        history: [...prev.history, { status: "completed", date: new Date().toISOString().split('T')[0] }]
      }));

      // Then submit proof
      await fetch(`/api/tasks/${task._id}/proof`, {
        method: "POST",
        body: JSON.stringify(proofData),
      });
      
      setShowProofModal(false);
      toast.success("Proof Submitted Successfully! 📸");
    } catch (error) {
      console.error("Failed to submit proof:", error);
      toast.error("Submission Failed. Please try again.");
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Task Not Found</h1>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-green-700 hover:text-green-800 transition-colors group mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Missions</span>
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
    </div>
  );
}